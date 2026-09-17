import Link from "next/link";
import { getPayload, type Where } from "payload";
import config from "../../payload.config";
import Greeting from "./Greeting";
import TrafficChart from "./TrafficChart";
import TopPages from "./TopPages";

type Props = { user?: { name?: string | null; role?: string | null } | null };

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  worker: "Worker",
};

const DAYS = 30;

export default async function BeforeDashboard({ user }: Props) {
  const payload = await getPayload({ config });

  const countOf = async (collection: string, where?: Where) => {
    const { totalDocs } = await payload.find({
      collection: collection as never,
      limit: 0,
      depth: 0,
      ...(where ? { where } : {}),
    });
    return totalDocs;
  };

  const role = user?.role ? ROLE_LABEL[user.role] ?? user.role : null;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Buckets and stored timestamps must use the same calendar, or the newest
  // day falls outside the range. Payload stores UTC, so bucket in UTC too.
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));

  const [newEnquiries, caseStudies, services] = await Promise.all([
    countOf("submissions", { status: { equals: "new" } }),
    countOf("case-studies", { _status: { equals: "published" } }),
    countOf("services", { _status: { equals: "published" } }),
  ]);

  // Analytics are admin-only, matching the collection's read access.
  let days: { date: string; label: string; views: number }[] = [];
  let topPages: { path: string; views: number }[] = [];
  let sessions = 0;

  if (isAdmin) {
    const { docs } = await payload.find({
      collection: "page-views",
      limit: 20000,
      depth: 0,
      where: { createdAt: { greater_than_equal: since.toISOString() } },
    });

    const perDay = new Map<string, number>();
    const perPath = new Map<string, number>();
    const seen = new Set<string>();

    for (let i = 0; i < DAYS; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      perDay.set(d.toISOString().slice(0, 10), 0);
    }

    for (const v of docs as { path: string; session?: string | null; createdAt: string }[]) {
      const key = v.createdAt.slice(0, 10);
      if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
      perPath.set(v.path, (perPath.get(v.path) ?? 0) + 1);
      if (v.session) seen.add(v.session);
    }

    days = [...perDay.entries()].map(([date, views]) => ({
      date,
      label: new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      views,
    }));

    topPages = [...perPath.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    sessions = seen.size;
  }

  return (
    <div className="zk-dash">
      <div className="zk-dash__head">
        <h2 className="zk-dash__title">
          <Greeting name={user?.name?.split(" ")[0] ?? "there"} />
        </h2>
        {role && <span className="zk-dash__role">{role}</span>}
      </div>

      {newEnquiries > 0 && (
        <Link className="zk-alert" href="/admin/collections/submissions?where[status][equals]=new">
          <strong>
            {newEnquiries} new {newEnquiries === 1 ? "enquiry" : "enquiries"}
          </strong>
          <span>Waiting for a reply — open</span>
        </Link>
      )}

      <div className="zk-tiles">
        {isAdmin && (
          <div className="zk-tile zk-tile--static">
            <span className="zk-tile__num">{sessions.toLocaleString()}</span>
            <span className="zk-tile__label">Visits, last 30 days</span>
          </div>
        )}
        <Link className="zk-tile" href="/admin/collections/case-studies">
          <span className="zk-tile__num">{caseStudies}</span>
          <span className="zk-tile__label">Case studies live</span>
        </Link>
        <Link className="zk-tile" href="/admin/collections/services">
          <span className="zk-tile__num">{services}</span>
          <span className="zk-tile__label">Services live</span>
        </Link>
        <Link className="zk-tile" href="/admin/collections/submissions">
          <span className="zk-tile__num">{newEnquiries}</span>
          <span className="zk-tile__label">New enquiries</span>
        </Link>
      </div>

      {isAdmin && (
        <div className="zk-charts">
          <TrafficChart days={days} />
          <TopPages rows={topPages} />
        </div>
      )}

      <div className="zk-actions">
        <Link className="zk-chip" href="/admin/collections/case-studies/create">
          + Case study
        </Link>
        <Link className="zk-chip" href="/admin/collections/testimonials/create">
          + Testimonial
        </Link>
        <Link className="zk-chip" href="/admin/collections/media">
          Upload photos
        </Link>
        {isAdmin && (
          <Link className="zk-chip" href="/admin/globals/site-settings">
            Site settings
          </Link>
        )}
      </div>
    </div>
  );
}
