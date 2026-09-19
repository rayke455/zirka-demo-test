import type React from "react";
import Link from "next/link";
import { getPayload, type Where } from "payload";
import config from "../../payload.config";
import Greeting from "./Greeting";
import TrafficChart from "./TrafficChart";
import TopPages from "./TopPages";
import { sql } from "@payloadcms/db-postgres";
import { OPEN_STAGES } from "../fields/lead";
import { dbKind } from "../db";

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

const ICON = (paths: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

/** The everyday jobs, in the order they usually matter. */
const ACTIONS: { href: string; label: string; hint: string; icon: React.ReactNode; external?: boolean }[] = [
  {
    href: "/admin/collections/submissions",
    label: "Read enquiries",
    hint: "Messages and free audit requests",
    icon: ICON(<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" /></>),
  },
  {
    href: "/admin/collections/quotes",
    label: "See quote requests",
    hint: "People asking for prices",
    icon: ICON(<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>),
  },
  {
    href: "/admin/collections/bookings",
    label: "See booked calls",
    hint: "Who is calling and when",
    icon: ICON(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>),
  },
  {
    href: "/admin/collections/projects/create",
    label: "Add a project",
    hint: "Show off work you've finished",
    icon: ICON(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  },
  {
    href: "/admin/collections/posts/create",
    label: "Write a blog post",
    hint: "Share advice with customers",
    icon: ICON(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>),
  },
  {
    href: "/admin/globals/site-settings",
    label: "Change contact details",
    hint: "Phone, WhatsApp, email and hours",
    icon: ICON(<><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></>),
  },
  {
    href: "/",
    label: "View the website",
    hint: "Opens in a new tab",
    external: true,
    icon: ICON(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  },
];


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
    await Promise.all(
      (["submissions", "quotes"] as const).map(async (collection) => {
        try {
          const { docs } = await payload.find({
            collection,
            limit: 500,
            depth: 0,
            select: { dealValue: true },
            where: { and: [{ status: { equals: "won" } }, { wonAt: { greater_than_equal: monthStart.toISOString() } }] },
          });
          count += docs.length;
          value += docs.reduce((sum, d) => sum + (Number((d as { dealValue?: number | null }).dealValue) || 0), 0);
        } catch {
          // Leave the tile at what could be counted.
        }
      })
    );
    return { count, value };
  };

  /**
   * Views per day and the top pages. The database does the counting: loading
   * every page view of the month (up to 20,000 rows) to count them in here
   * was the slowest part of opening the dashboard.
   */
  const pageViewStats = async () => {
    const perDay = new Map<string, number>();
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      perDay.set(d.toISOString().slice(0, 10), 0);
    }
    let perPath: { path: string; views: number }[] = [];

    if (dbKind === "postgres") {
      const drizzle = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: Record<string, unknown>[] }> } }).drizzle;
      const [byDay, byPath] = await Promise.all([
        drizzle.execute(
          sql`select to_char(created_at at time zone 'UTC', 'YYYY-MM-DD') as day, count(*)::int as views
              from page_views where created_at >= ${since.toISOString()} group by 1`
        ),
        drizzle.execute(
          sql`select path, count(*)::int as views from page_views
              where created_at >= ${since.toISOString()} group by path order by views desc limit 5`
        ),
      ]);
      for (const r of byDay.rows) if (perDay.has(String(r.day))) perDay.set(String(r.day), Number(r.views));
      perPath = byPath.rows.map((r) => ({ path: String(r.path), views: Number(r.views) }));
    } else {
      // Local SQLite: small enough to count here.
      const { docs } = await payload.find({
        collection: "page-views",
        limit: 20000,
        depth: 0,
        where: { createdAt: { greater_than_equal: since.toISOString() } },
      });
      const paths = new Map<string, number>();
      for (const v of docs as { path: string; createdAt: string }[]) {
        const key = v.createdAt.slice(0, 10);
        if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
        paths.set(v.path, (paths.get(v.path) ?? 0) + 1);
      }
      perPath = [...paths.entries()]
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    }

    const days = [...perDay.entries()].map(([date, views]) => ({
      date,
      label: new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      views,
    }));
    return { days, topPages: perPath, views: days.reduce((sum, d) => sum + d.views, 0) };
  };

  // Everything at once: each query waits on the database, not on the others.
  const [
    newEnquiries,
    newQuotes,
    confirmedBookings,
    openEnquiries,
    openQuotes,
    dueEnquiries,
    dueQuotes,
    won,
    stats,
    features,
  ] = await Promise.all([
    countOf("submissions", { status: { equals: "new" } }),
    countOf("quotes", { status: { equals: "new" } }),
    countOf("bookings", { status: { equals: "confirmed" } }),
    countOf("submissions", openLead("submissions")),
    countOf("quotes", openLead("quotes")),
    countOf("submissions", dueLead("submissions")),
    countOf("quotes", dueLead("quotes")),
    wonThisMonth(),
    // Page views are for admins only; a failed query just leaves the charts out.
    isAdmin ? pageViewStats().catch(() => null) : Promise.resolve(null),
    payload.findGlobal({ slug: "features", depth: 0 }) as Promise<{ maintenanceMode?: boolean }>,
  ]);
  const openLeads = openEnquiries + openQuotes;
  // The admin list reads `in` filters as an indexed array in the address.
  const openStageQuery = (collection: keyof typeof OPEN_STAGES) =>
    OPEN_STAGES[collection].map((stage, i) => `where[status][in][${i}]=${stage}`).join("&");
  const followUpsDue = dueEnquiries + dueQuotes;

  // No session id is stored on a visitor's device any more, so this counts
  // page views rather than unique people.
  const days = stats?.days ?? [];
  const topPages = stats?.topPages ?? [];
  const views = stats?.views ?? 0;

  const hasPendingItems = newEnquiries > 0 || newQuotes > 0 || confirmedBookings > 0 || followUpsDue > 0;
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

      {/* Big, plainly worded shortcuts to the everyday jobs. */}
      <section className="zk-actions-wrap" aria-labelledby="zk-actions-title">
        <h2 id="zk-actions-title" className="zk-section-title">
          What would you like to do?
        </h2>
        <div className="zk-actions">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              className="zk-action"
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener" } : {})}
            >
              <span className="zk-action__icon" aria-hidden="true">
                {a.icon}
              </span>
              <span className="zk-action__text">
                <strong>{a.label}</strong>
                <span>{a.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <h2 className="zk-section-title">How things are going</h2>

      {/* Business Metrics Grid */}
      <div className="zk-tiles">
        {isAdmin && (
          <div className="zk-tile zk-tile--static">
            <span className="zk-tile__num">{views.toLocaleString()}</span>
            <span className="zk-tile__label">Pages viewed</span>
            <span className="zk-tile__hint">In the last 30 days</span>
          </div>
        )}

        <Link className="zk-tile" href="/admin/collections/submissions">
          <span className="zk-tile__num">{newEnquiries}</span>
          <span className="zk-tile__label">New enquiries</span>
          <span className="zk-tile__hint">Not answered yet</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/quotes">
          <span className="zk-tile__num">{newQuotes}</span>
          <span className="zk-tile__label">New quote requests</span>
          <span className="zk-tile__hint">Not answered yet</span>
        </Link>

        <Link className="zk-tile" href="/admin/collections/bookings">
          <span className="zk-tile__num">{confirmedBookings}</span>
          <span className="zk-tile__label">Upcoming calls</span>
          <span className="zk-tile__hint">Booked on the website</span>
        </Link>

        <Link className="zk-tile" href={`/admin/collections/submissions?${openStageQuery("submissions")}`}>
          <span className="zk-tile__num">{openLeads}</span>
          <span className="zk-tile__label">Open leads</span>
          <span className="zk-tile__hint">
            {openEnquiries} {openEnquiries === 1 ? "enquiry" : "enquiries"} · {openQuotes} {openQuotes === 1 ? "quote" : "quotes"}
          </span>
        </Link>

        <div className="zk-tile zk-tile--static">
          <span className="zk-tile__num">{won.count}</span>
          <span className="zk-tile__label">Won this month</span>
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
       * Payload's own grid of every collection is hidden in custom.css: with the
       * shortcuts above and the sidebar, it was a third copy of the same links.
       */}
    </div>
  );
}
