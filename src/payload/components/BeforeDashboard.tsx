import Link from "next/link";
import { getPayload, type Where } from "payload";
import config from "../../payload.config";
import Greeting from "./Greeting";
import TrafficChart from "./TrafficChart";
import TopPages from "./TopPages";

type Props = {
  user?: {
    id?: string | number;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
};

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  worker: "Worker",
};

const DAYS = 30;

export default async function BeforeDashboard({ user }: Props) {
  const payload = await getPayload({ config });

  const countOf = async (collection: string, where?: Where) => {
    try {
      const { totalDocs } = await payload.find({
        collection: collection as never,
        limit: 0,
        depth: 0,
        ...(where ? { where } : {}),
      });
      return totalDocs;
    } catch {
      return 0;
    }
  };

  const role = user?.role ? ROLE_LABEL[user.role] ?? user.role : null;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));

  const [newEnquiries, newQuotes, confirmedBookings, caseStudies, services] =
    await Promise.all([
      countOf("submissions", { status: { equals: "new" } }),
      countOf("quotes", { status: { equals: "new" } }),
      countOf("bookings", { status: { equals: "confirmed" } }),
      countOf("case-studies", { _status: { equals: "published" } }),
      countOf("services", { _status: { equals: "published" } }),
    ]);

  let days: { date: string; label: string; views: number }[] = [];
  let topPages: { path: string; views: number }[] = [];
  let sessions = 0;

  if (isAdmin) {
    try {
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

      for (const v of docs as {
        path: string;
        session?: string | null;
        createdAt: string;
      }[]) {
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
    } catch {
      // Gracefully handle any analytics query issues
    }
  }

  const hasPendingItems = newEnquiries > 0 || newQuotes > 0 || confirmedBookings > 0;
  const displayName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="zk-dash">
      {/* Executive Header Bar */}
      <div className="zk-dash__head">
        <div className="zk-dash__head-left">
          <div className="zk-dash__title-row">
            <h1 className="zk-dash__title">
              <Greeting name={displayName} />
            </h1>
            {role && <span className="zk-dash__role">{role}</span>}
          </div>
          <div className="zk-dash__subtitle-row">
            <span className="zk-dash__status">
              <span className="zk-dash__status-dot" />
              zirkadigitalsolutions.com
            </span>
            <span className="zk-dash__sep">·</span>
            <span className="zk-dash__date">
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Priority Action Alerts */}
      {hasPendingItems && (
        <div className="zk-alerts">
          {newEnquiries > 0 && (
            <Link
              className="zk-alert zk-alert--enquiry"
              href="/admin/collections/submissions?where[status][equals]=new"
            >
              <span className="zk-alert__badge">{newEnquiries}</span>
              <div className="zk-alert__content">
                <strong>
                  {newEnquiries} new {newEnquiries === 1 ? "contact enquiry" : "contact enquiries"}
                </strong>
                <span>Awaiting response — review in submissions</span>
              </div>
              <span className="zk-alert__arrow">→</span>
            </Link>
          )}

          {newQuotes > 0 && (
            <Link
              className="zk-alert zk-alert--quote"
              href="/admin/collections/quotes?where[status][equals]=new"
            >
              <span className="zk-alert__badge">{newQuotes}</span>
              <div className="zk-alert__content">
                <strong>
                  {newQuotes} new {newQuotes === 1 ? "quote request" : "quote requests"}
                </strong>
                <span>Client looking for pricing proposal — review</span>
              </div>
              <span className="zk-alert__arrow">→</span>
            </Link>
          )}

          {confirmedBookings > 0 && (
            <Link
              className="zk-alert zk-alert--booking"
              href="/admin/collections/bookings?where[status][equals]=confirmed"
            >
              <span className="zk-alert__badge">{confirmedBookings}</span>
              <div className="zk-alert__content">
                <strong>
                  {confirmedBookings} upcoming {confirmedBookings === 1 ? "consultation" : "consultations"}
                </strong>
                <span>Confirmed calendar bookings</span>
              </div>
              <span className="zk-alert__arrow">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Business Metrics Grid */}
      <div className="zk-tiles">
        {isAdmin && (
          <div className="zk-tile zk-tile--static">
            <span className="zk-tile__num">{sessions.toLocaleString()}</span>
            <span className="zk-tile__label">30-Day Unique Visits</span>
            <span className="zk-tile__hint">Website traffic</span>
          </div>
        )}

        <Link className="zk-tile" href="/admin/collections/submissions">
          <span className="zk-tile__num">{newEnquiries}</span>
          <span className="zk-tile__label">New Inquiries</span>
          <span className="zk-tile__hint">Contact form</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/quotes">
          <span className="zk-tile__num">{newQuotes}</span>
          <span className="zk-tile__label">Quote Requests</span>
          <span className="zk-tile__hint">Project proposals</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/bookings">
          <span className="zk-tile__num">{confirmedBookings}</span>
          <span className="zk-tile__label">Booked Meetings</span>
          <span className="zk-tile__hint">Consultations</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/services">
          <span className="zk-tile__num">{services}</span>
          <span className="zk-tile__label">Live Services</span>
          <span className="zk-tile__hint">Offered solutions</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/case-studies">
          <span className="zk-tile__num">{caseStudies}</span>
          <span className="zk-tile__label">Case Studies</span>
          <span className="zk-tile__hint">Published work</span>
        </Link>
      </div>

      {/* Traffic Analytics Section */}
      {isAdmin && days.length > 0 && (
        <div className="zk-charts">
          <TrafficChart days={days} />
          <TopPages rows={topPages} />
        </div>
      )}

      {/* Refined Quick Operations Hub */}
      <div className="zk-quick-hub">
        <div className="zk-quick-group">
          <span className="zk-quick-label">Content Creation</span>
          <div className="zk-actions">
            <Link className="zk-chip" href="/admin/collections/services/create">
              + New Service
            </Link>
            <Link className="zk-chip" href="/admin/collections/case-studies/create">
              + New Case Study
            </Link>
            <Link className="zk-chip" href="/admin/collections/testimonials/create">
              + New Testimonial
            </Link>
            <Link className="zk-chip" href="/admin/collections/team-members/create">
              + Team Member
            </Link>
            <Link className="zk-chip" href="/admin/collections/media">
              📁 Media Library
            </Link>
          </div>
        </div>

        <div className="zk-quick-group">
          <span className="zk-quick-label">System & Settings</span>
          <div className="zk-actions">
            {isAdmin && (
              <Link className="zk-chip" href="/admin/globals/site-settings">
                ⚙️ Site Settings
              </Link>
            )}
            <Link className="zk-chip" href="/admin/globals/booking-settings">
              📅 Booking Settings
            </Link>
            <Link className="zk-chip" href="/admin/collections/users">
              👥 Users & Staff
            </Link>
            <Link className="zk-chip" href="/admin/account">
              👤 My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
