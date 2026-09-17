/**
 * Minimal timezone maths on the built-in Intl API, so booking slots are correct
 * across daylight-saving changes without shipping a date library.
 */

type WallTime = { y: number; m: number; d: number; h: number; mi: number; weekday: number };

const formatters = new Map<string, Intl.DateTimeFormat>();
const formatterFor = (tz: string) => {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    formatters.set(tz, f);
  }
  return f;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The wall-clock time a given instant shows in `tz`. */
export function wallTimeIn(date: Date, tz: string): WallTime {
  const parts = Object.fromEntries(formatterFor(tz).formatToParts(date).map((p) => [p.type, p.value]));
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    h: Number(parts.hour),
    mi: Number(parts.minute),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  };
}

/** Minutes `tz` is ahead of UTC at that instant (negative west of Greenwich). */
function offsetMinutes(date: Date, tz: string): number {
  const w = wallTimeIn(date, tz);
  const asUtc = Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi);
  return Math.round((asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000);
}

/**
 * The instant at which the clock in `tz` reads the given wall time.
 * Two passes, because the offset itself depends on which side of a DST change we land.
 */
export function zonedWallTimeToUtc(y: number, m: number, d: number, h: number, mi: number, tz: string): Date {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = offsetMinutes(new Date(guess), tz);
  let t = guess - first * 60000;
  const second = offsetMinutes(new Date(t), tz);
  if (second !== first) t = guess - second * 60000;
  return new Date(t);
}

export const isValidTimeZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};
