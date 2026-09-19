import type { Endpoint, Payload, Where } from "payload";
import { SITE_URL } from "../lib/site";
import { escapeHtml, mailSetup } from "./mailer";
import { OPEN_STAGES } from "./fields/lead";

type Lead = {
  id: number | string;
  name: string;
  company?: string | null;
  kind?: string | null;
  status?: string | null;
  followUp?: string | null;
  createdAt: string;
};

type Settings = {
  followUpReminders?: boolean | null;
  untouchedLeadNudges?: boolean | null;
  weeklySummary?: boolean | null;
};

const DAY = 24 * 60 * 60 * 1000;
const COLLECTIONS = ["submissions", "quotes"] as const;
const LABEL = { submissions: "Enquiry", quotes: "Quote request" } as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

const leadLink = (collection: string, lead: Lead) => `${SITE_URL}/admin/collections/${collection}/${lead.id}`;

const find = async (payload: Payload, collection: (typeof COLLECTIONS)[number], where: Where) =>
  (
    await payload.find({
      collection,
      where,
      limit: 100,
      depth: 0,
      sort: "followUp",
      select: { name: true, company: true, status: true, followUp: true, createdAt: true, ...(collection === "submissions" ? { kind: true } : {}) },
    })
  ).docs as unknown as Lead[];

const count = async (payload: Payload, collection: string, where: Where) =>
  (await payload.count({ collection: collection as never, where })).totalDocs;

const shell = (title: string, body: string) => `
  <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#0e2a20;max-width:600px">
    <p style="font-size:19px;margin:0 0 18px">${title}</p>
    ${body}
    <p style="margin:24px 0 0;color:#5f6b64;font-size:13px">
      Sent by your website each morning. Change these emails in the admin under Features → Emails.
    </p>
  </div>`;

const leadRows = (rows: { collection: string; lead: Lead; note: string }[]) => `
  <table style="border-collapse:collapse;width:100%;margin:0 0 20px">
    ${rows
      .map(
        ({ collection, lead, note }) => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid #e6e1d4">
          <a href="${leadLink(collection, lead)}" style="color:#9c5c33;font-weight:bold;text-decoration:none">${escapeHtml(lead.name)}</a>
          ${lead.company ? `<span style="color:#5f6b64"> · ${escapeHtml(lead.company)}</span>` : ""}<br>
          <span style="font-size:13px;color:#5f6b64">${escapeHtml(note)}</span>
        </td>
      </tr>`
      )
      .join("")}
  </table>`;

/** Leads due or overdue for a follow-up, and new ones nobody has answered in 24 hours. */
async function dailyDigest(payload: Payload, s: Settings, now: Date) {
  const endOfToday = new Date(now);
  endOfToday.setUTCHours(23, 59, 59, 999);
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  const due: { collection: string; lead: Lead; note: string }[] = [];
  const untouched: { collection: string; lead: Lead; note: string }[] = [];

  for (const collection of COLLECTIONS) {
    if (s.followUpReminders !== false) {
      const leads = await find(payload, collection, {
        and: [{ status: { in: OPEN_STAGES[collection] } }, { followUp: { less_than_equal: endOfToday.toISOString() } }],
      });
      for (const lead of leads) {
        const overdue = lead.followUp && new Date(lead.followUp) < startOfToday;
        due.push({
          collection,
          lead,
          note: `${collection === "submissions" && lead.kind === "audit" ? "Free audit request" : LABEL[collection]} · ${
            overdue ? `overdue since ${fmtDate(lead.followUp as string)}` : "due today"
          }`,
        });
      }
    }
    if (s.untouchedLeadNudges !== false) {
      const leads = await find(payload, collection, {
        and: [{ status: { equals: "new" } }, { createdAt: { less_than_equal: new Date(now.getTime() - DAY).toISOString() } }],
      });
      for (const lead of leads) {
        const days = Math.floor((now.getTime() - new Date(lead.createdAt).getTime()) / DAY);
        untouched.push({
          collection,
          lead,
          note: `${collection === "submissions" && lead.kind === "audit" ? "Free audit request" : LABEL[collection]} · sent ${days} day${days === 1 ? "" : "s"} ago, still marked New`,
        });
      }
    }
  }

  if (due.length === 0 && untouched.length === 0) return null;

  const parts: string[] = [];
  if (due.length > 0) parts.push(`<p style="margin:0 0 6px;font-weight:bold">Follow up today (${due.length})</p>${leadRows(due)}`);
  if (untouched.length > 0)
    parts.push(
      `<p style="margin:0 0 6px;font-weight:bold">Waiting for a first reply (${untouched.length})</p>
       <p style="margin:0 0 6px;color:#5f6b64;font-size:13px">Once you've been in touch, set the stage to Contacted and they'll drop off this list.</p>
       ${leadRows(untouched)}`
    );

  const total = due.length + untouched.length;
  return {
    subject: `${total} lead${total === 1 ? "" : "s"} to follow up today`,
    html: shell("Today's follow-ups", parts.join("")),
  };
}

/** Monday's look back at the last seven days. */
async function weeklySummary(payload: Payload, now: Date) {
  const since = new Date(now.getTime() - 7 * DAY).toISOString();
  const recent: Where = { createdAt: { greater_than_equal: since } };

  const [enquiries, audits, quotes, bookings, pageViews, wonSubs, wonQuotes] = await Promise.all([
    count(payload, "submissions", { and: [recent, { kind: { not_equals: "audit" } }] }),
    count(payload, "submissions", { and: [recent, { kind: { equals: "audit" } }] }),
    count(payload, "quotes", recent),
    count(payload, "bookings", recent),
    count(payload, "page-views", recent),
    payload.find({ collection: "submissions", limit: 200, depth: 0, select: { dealValue: true }, where: { and: [{ status: { equals: "won" } }, { wonAt: { greater_than_equal: since } }] } }),
    payload.find({ collection: "quotes", limit: 200, depth: 0, select: { dealValue: true }, where: { and: [{ status: { equals: "won" } }, { wonAt: { greater_than_equal: since } }] } }),
  ]);
  const won = [...wonSubs.docs, ...wonQuotes.docs] as { dealValue?: number | null }[];
  const wonValue = won.reduce((sum, d) => sum + (Number(d.dealValue) || 0), 0);

  const row = (label: string, value: string | number) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e6e1d4">${label}</td><td style="padding:8px 0;border-bottom:1px solid #e6e1d4;text-align:right;font-weight:bold">${value}</td></tr>`;

  const body = `
    <table style="border-collapse:collapse;width:100%;margin:0 0 20px">
      ${row("Free audit requests", audits)}
      ${row("Contact enquiries", enquiries)}
      ${row("Quote requests", quotes)}
      ${row("Calls booked", bookings)}
      ${row("Deals won", won.length + (wonValue > 0 ? ` · $${wonValue.toLocaleString("en-US")}` : ""))}
      ${row("Page views", pageViews.toLocaleString("en-US"))}
    </table>
    <p style="margin:0"><a href="${SITE_URL}/admin" style="color:#9c5c33">Open the dashboard</a></p>`;

  const leads = audits + enquiries + quotes + bookings;
  return {
    subject: `Your week: ${leads} new lead${leads === 1 ? "" : "s"}, ${won.length} won`,
    html: shell(`Last 7 days on zirkadigitalsolutions.com`, body),
  };
}

/**
 * GET /api/cron/daily, called by Vercel Cron every morning (vercel.json).
 * Vercel signs the call with CRON_SECRET. A signed-in super admin can also
 * open it with ?dryRun=1 to see what would be sent, without sending anything.
 */
export const dailyCron: Endpoint = {
  path: "/cron/daily",
  method: "get",
  handler: async (req) => {
    const secret = process.env.CRON_SECRET;
    const fromVercel = Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
    const superAdmin = (req.user as { role?: string } | null)?.role === "superadmin";
    if (!fromVercel && !superAdmin) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const dryRun = superAdmin && new URL(req.url ?? "", SITE_URL).searchParams.has("dryRun");
    const now = new Date();
    const s = (await req.payload.findGlobal({ slug: "features", depth: 0 })) as Settings;

    const emails = [
      await dailyDigest(req.payload, s, now),
      // Monday, in the morning the job runs (05:00 UTC, 8am in Nairobi).
      s.weeklySummary !== false && now.getUTCDay() === 1 ? await weeklySummary(req.payload, now) : null,
    ].filter((e): e is { subject: string; html: string } => e !== null);

    const mail = await mailSetup(req.payload);
    if (dryRun) {
      return Response.json({ wouldSendTo: mail.teamInbox, emails: emails.map((e) => e.subject) });
    }
    if (!mail.teamInbox) {
      return Response.json({ message: "No alerts inbox set (Features → Emails), so nothing was sent.", pending: emails.length });
    }

    const sent: string[] = [];
    for (const e of emails) {
      try {
        await mail.send({ to: mail.teamInbox, subject: e.subject, html: e.html });
        sent.push(e.subject);
      } catch (err) {
        req.payload.logger.error({ err }, `Could not send scheduled email: ${e.subject}`);
      }
    }
    return Response.json({ sent });
  },
};
