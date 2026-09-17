import type { Payload } from "payload";
import { wallTimeIn, zonedWallTimeToUtc, isValidTimeZone } from "./timezone";

export type BookingConfig = {
  timezone: string;
  callMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  daysAhead: number;
  meetingDetails: string;
  weeklyHours: { day: number; start: string; end: string }[];
  blockedDates: string[]; // YYYY-MM-DD in the business timezone
};

export type DayAvailability = { date: string; slots: string[] }; // slots are UTC ISO strings

const DEFAULT_HOURS = [1, 2, 3, 4, 5].map((day) => ({ day, start: "09:00", end: "17:00" }));

const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

/** Settings with safe defaults — the availability page may never have been saved. */
export async function getBookingConfig(payload: Payload): Promise<BookingConfig> {
  const s = (await payload.findGlobal({ slug: "booking-settings", depth: 0 })) as unknown as Record<string, unknown>;
  const tz = typeof s.timezone === "string" && isValidTimeZone(s.timezone) ? s.timezone : "America/New_York";

  const rows = Array.isArray(s.weeklyHours) ? (s.weeklyHours as { day?: string; start?: string; end?: string }[]) : [];
  const hours = rows
    .filter((r) => r.day !== undefined && r.start && r.end)
    .map((r) => ({ day: Number(r.day), start: r.start as string, end: r.end as string }));

  const blocked = Array.isArray(s.blockedDates) ? (s.blockedDates as { date?: string }[]) : [];

  return {
    timezone: tz,
    callMinutes: Math.max(15, num(s.callMinutes, 30)),
    bufferMinutes: Math.max(0, num(s.bufferMinutes, 15)),
    minNoticeHours: Math.max(0, num(s.minNoticeHours, 12)),
    daysAhead: Math.min(120, Math.max(1, num(s.daysAhead, 21))),
    meetingDetails: typeof s.meetingDetails === "string" && s.meetingDetails ? s.meetingDetails : "Video call — we'll email you the link",
    weeklyHours: rows.length > 0 ? hours : DEFAULT_HOURS,
    blockedDates: blocked
      .filter((b) => b.date)
      .map((b) => {
        // Stored as a UTC instant for a picked calendar day; read the day in the business timezone.
        const w = wallTimeIn(new Date(b.date as string), tz);
        const noon = wallTimeIn(new Date(new Date(b.date as string).getTime() + 12 * 3600e3), tz);
        const pick = w.h >= 12 ? noon : w;
        return `${pick.y}-${String(pick.m).padStart(2, "0")}-${String(pick.d).padStart(2, "0")}`;
      }),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

type Busy = { start: number; end: number };

async function busyPeriods(payload: Payload, from: Date, to: Date): Promise<Busy[]> {
  const { docs } = await payload.find({
    collection: "bookings",
    limit: 2000,
    depth: 0,
    pagination: false,
    where: {
      and: [
        { status: { not_equals: "cancelled" } },
        { start: { less_than: to.toISOString() } },
        { end: { greater_than: from.toISOString() } },
      ],
    },
  });
  return (docs as { start: string; end: string }[]).map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));
}

/** Every open slot from now until `daysAhead`, grouped by business-timezone day. */
export async function getAvailability(payload: Payload, now = new Date()): Promise<{ config: BookingConfig; days: DayAvailability[] }> {
  const config = await getBookingConfig(payload);
  const { timezone: tz, callMinutes, bufferMinutes, minNoticeHours, daysAhead } = config;

  const earliest = now.getTime() + minNoticeHours * 3600e3;
  const horizon = new Date(now.getTime() + (daysAhead + 1) * 86400e3);
  const busy = await busyPeriods(payload, now, horizon);
  const blocked = new Set(config.blockedDates);
  const today = wallTimeIn(now, tz);

  const days: DayAvailability[] = [];
  for (let i = 0; i <= daysAhead; i++) {
    // Calendar arithmetic on a UTC date avoids DST drift when stepping days.
    const cal = new Date(Date.UTC(today.y, today.m - 1, today.d + i));
    const y = cal.getUTCFullYear();
    const m = cal.getUTCMonth() + 1;
    const d = cal.getUTCDate();
    const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (blocked.has(key)) continue;

    const slots: string[] = [];
    for (const block of config.weeklyHours.filter((h) => h.day === cal.getUTCDay())) {
      const open = toMinutes(block.start);
      const close = toMinutes(block.end);
      for (let t = open; t + callMinutes <= close; t += callMinutes + bufferMinutes) {
        const start = zonedWallTimeToUtc(y, m, d, Math.floor(t / 60), t % 60, tz).getTime();
        const end = start + callMinutes * 60e3;
        if (start < earliest) continue;
        // A slot clashes if it overlaps a booking once the buffer is added on both sides.
        const clash = busy.some((b) => start < b.end + bufferMinutes * 60e3 && end + bufferMinutes * 60e3 > b.start);
        if (!clash) slots.push(new Date(start).toISOString());
      }
    }
    if (slots.length > 0) days.push({ date: key, slots: [...new Set(slots)].sort() });
  }

  return { config, days };
}

/** Re-checks one slot against live data at the moment of booking. */
export async function isSlotAvailable(payload: Payload, startIso: string): Promise<boolean> {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return false;
  const { days } = await getAvailability(payload);
  return days.some((d) => d.slots.includes(start.toISOString()));
}
