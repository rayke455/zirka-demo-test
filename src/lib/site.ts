/**
 * The public address of the site. Set NEXT_PUBLIC_SITE_URL when deploying
 * (e.g. https://zirkadigital.com) — sitemaps, share previews and canonical
 * links all need an absolute URL, and localhost is wrong for every one of them.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001").replace(/\/+$/, "");
