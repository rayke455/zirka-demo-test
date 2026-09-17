"use server";

import { getCms, getFeatures } from "@/lib/cms";
import { allow, clientIp } from "@/lib/rate-limit";

/** Only the host, never the full referring URL with its query string. */
const referrerHost = (referrer: string): string => {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname;
  } catch {
    return "";
  }
};

export async function trackView(path: string, referrer: string, session: string) {
  if (!path.startsWith("/") || path.startsWith("/admin")) return;

  // A real visitor browses a handful of pages a minute; beyond that it's noise
  // or someone trying to inflate the numbers.
  if (!allow(`view:${await clientIp()}`, 30, 60 * 1000)) return;

  try {
    if (!(await getFeatures()).analyticsEnabled) return;
    const payload = await getCms();
    await payload.create({
      collection: "page-views",
      data: {
        path: path.slice(0, 200),
        referrer: referrerHost(referrer),
        session: session.slice(0, 40),
      },
    });
  } catch {
    // Analytics must never break the page for a visitor.
  }
}
