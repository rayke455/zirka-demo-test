import Link from "next/link";
import { getPayload, type Where } from "payload";
import config from "../../payload.config";
import Greeting from "./Greeting";
import TrafficChart from "./TrafficChart";
import TopPages from "./TopPages";
import { OPEN_STAGES } from "../fields/lead";

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

  // Lead tracker: anything not yet won or closed, what's due for a follow-up
  // by the end of today, and what was won since the 1st of this month.
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const openLead = (collection: keyof typeof OPEN_STAGES): Where => ({ status: { in: OPEN_STAGES[collection] } });
  const dueLead = (collection: keyof typeof OPEN_STAGES): Where => ({
    and: [openLead(collection), { followUp: { less_than_equal: endOfToday.toISOString() } }],
  });

  const wonThisMonth = async () => {
    let count = 0;
    let value = 0;
    for (const collection of ["submissions", "quotes"] as const) {
      try {
        const { docs } = await payload.find({
          collection,
          limit: 500,
          depth: 0,
          where: { and: [{ status: { equals: "won" } }, { wonAt: { greater_than_equal: monthStart.toISOString() } }] },
        });
        count += docs.length;
        value += docs.reduce((sum, d) => sum + (Number((d as { dealValue?: number | null }).dealValue) || 0), 0);
      } catch {
        // Leave the tile at what could be counted.
      }
    }
    return { count, value };
  };

  const [newEnquiries, newQuotes, confirmedBookings, openEnquiries, openQuotes, dueEnquiries, dueQuotes, won] =
    await Promise.all([
      countOf("submissions", { status: { equals: "new" } }),
      countOf("quotes", { status: { equals: "new" } }),
      countOf("bookings", { status: { equals: "confirmed" } }),
      countOf("submissions", openLead("submissions")),
      countOf("quotes", openLead("quotes")),
      countOf("submissions", dueLead("submissions")),
      countOf("quotes", dueLead("quotes")),
      wonThisMonth(),
    ]);
  const openLeads = openEnquiries + openQuotes;
  // The admin list reads `in` filters as an indexed array in the address.
  const openStageQuery = (collection: keyof typeof OPEN_STAGES) =>
    OPEN_STAGES[collection].map((stage, i) => `where[status][in][${i}]=${stage}`).join("&");
  const followUpsDue = dueEnquiries + dueQuotes;

  let days: { date: string; label: string; views: number }[] = [];
  let topPages: { path: string; views: number }[] = [];
  // No session id is stored on a visitor's device any more, so this counts
  // page views rather than unique people.
  let views = 0;

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

      for (let i = 0; i < DAYS; i++) {
        const d = new Date(since);
        d.setUTCDate(since.getUTCDate() + i);
        perDay.set(d.toISOString().slice(0, 10), 0);
      }

      for (const v of docs as {
        path: string;
        createdAt: string;
      }[]) {
        const key = v.createdAt.slice(0, 10);
        if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
        perPath.set(v.path, (perPath.get(v.path) ?? 0) + 1);
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

      views = docs.length;
    } catch {
      // Gracefully handle any analytics query issues
    }
  }

  const hasPendingItems = newEnquiries > 0 || newQuotes > 0 || confirmedBookings > 0 || followUpsDue > 0;
  const features = (await payload.findGlobal({ slug: "features", depth: 0 })) as { maintenanceMode?: boolean };
  const maintenanceOn = features.maintenanceMode === true;
  const displayName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="zk-dash">
      {/* Impossible to miss while the public site is closed. */}
      {maintenanceOn && (
        <div className="zk-maintenance" role="status">
          <div>
            <strong>Maintenance mode is on.</strong> Visitors see the maintenance notice, not the
            website.
          </div>
          <div className="zk-maintenance__actions">
            <a className="zk-maintenance__btn" href="/maintenance/bypass" target="_blank" rel="noopener">
              Preview the site
            </a>
            {user?.role === "superadmin" && (
              <Link className="zk-maintenance__btn zk-maintenance__btn--quiet" href="/admin/globals/features">
                Turn it off
              </Link>
            )}
          </div>
        </div>
      )}

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
          {followUpsDue > 0 && (
            <Link
              className="zk-alert zk-alert--followup"
              href={
                dueEnquiries > 0
                  ? `/admin/collections/submissions?where[followUp][less_than_equal]=${encodeURIComponent(endOfToday.toISOString())}&${openStageQuery("submissions")}&sort=followUp`
                  : `/admin/collections/quotes?where[followUp][less_than_equal]=${encodeURIComponent(endOfToday.toISOString())}&${openStageQuery("quotes")}&sort=followUp`
              }
            >
              <span className="zk-alert__badge">{followUpsDue}</span>
              <div className="zk-alert__content">
                <strong>
                  {followUpsDue} {followUpsDue === 1 ? "follow-up" : "follow-ups"} due today
                </strong>
                <span>
                  {dueEnquiries > 0 && dueQuotes > 0
                    ? `${dueEnquiries} ${dueEnquiries === 1 ? "enquiry" : "enquiries"} and ${dueQuotes} ${dueQuotes === 1 ? "quote" : "quotes"}. Time to get back in touch`
                    : "Time to get back in touch"}
                </span>
              </div>
              <span className="zk-alert__arrow">→</span>
            </Link>
          )}

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
            <span className="zk-tile__num">{views.toLocaleString()}</span>
            <span className="zk-tile__label">Page Views (30 Days)</span>
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

        <Link className="zk-tile" href={`/admin/collections/submissions?${openStageQuery("submissions")}`}>
          <span className="zk-tile__num">{openLeads}</span>
          <span className="zk-tile__label">Open Leads</span>
          <span className="zk-tile__hint">
            {openEnquiries} {openEnquiries === 1 ? "enquiry" : "enquiries"} · {openQuotes} {openQuotes === 1 ? "quote" : "quotes"}
          </span>
        </Link>

        <div className="zk-tile zk-tile--static">
          <span className="zk-tile__num">{won.count}</span>
          <span className="zk-tile__label">Won This Month</span>
          <span className="zk-tile__hint">
            {won.value > 0 ? `$${won.value.toLocaleString("en-US")} in deals` : "Mark a lead Won to count it"}
          </span>
        </div>
      </div>

      {/* Traffic Analytics Section */}
      {isAdmin && days.length > 0 && (
        <div className="zk-charts">
          <TrafficChart days={days} />
          <TopPages rows={topPages} />
        </div>
      )}

      {/*
       * No shortcut chips here. Payload's own dashboard below already lists
       * every collection and global with a create button, and the sidebar lists
       * them a third time — three copies of the same links is what made this
       * page feel complicated. This panel keeps only what the sidebar cannot
       * show: who is signed in, what is waiting, and how the site is doing.
       */}
    </div>
  );
}
