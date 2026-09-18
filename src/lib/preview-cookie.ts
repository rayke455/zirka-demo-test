/**
 * The cookie that lets a signed-in admin see the real site while maintenance
 * mode shows everyone else the notice.
 *
 * Its value is an expiry time plus an HMAC of it keyed with PAYLOAD_SECRET, so
 * it cannot be made up by hand. Web Crypto only, because the proxy that checks
 * it runs separately from the rest of the app.
 */
import { PREVIEW_HOURS } from "./preview-cookie-names";

export { PREVIEW_COOKIE, PREVIEW_FLAG_COOKIE, PREVIEW_HOURS } from "./preview-cookie-names";

const encoder = new TextEncoder();

async function sign(payload: string): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("PAYLOAD_SECRET is not set");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(`zk-preview:${payload}`));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createPreviewToken(): Promise<string> {
  const expires = String(Date.now() + PREVIEW_HOURS * 60 * 60 * 1000);
  return `${expires}.${await sign(expires)}`;
}

export async function isValidPreviewToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  try {
    const expected = await sign(expires);
    // Length first, then every character, so the comparison takes the same time
    // whichever character is wrong.
    if (expected.length !== sig.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}
