import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  PREVIEW_COOKIE,
  PREVIEW_FLAG_COOKIE,
  PREVIEW_HOURS,
  createPreviewToken,
} from "@/lib/preview-cookie";

export const dynamic = "force-dynamic";

const STAFF = new Set(["superadmin", "admin", "worker"]);

/**
 * /maintenance/bypass — lets a signed-in team member see the real site while
 * maintenance mode is on. /maintenance/bypass?exit=1 ends the preview.
 *
 * Linked from the admin dashboard whenever maintenance mode is on.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const home = new URL("/", url);

  if (url.searchParams.has("exit")) {
    const res = NextResponse.redirect(home);
    res.cookies.delete(PREVIEW_COOKIE);
    res.cookies.delete(PREVIEW_FLAG_COOKIE);
    return res;
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!role || !STAFF.has(role)) {
    // Not signed in: sign in first, then come straight back here.
    return NextResponse.redirect(new URL("/admin/login?redirect=%2Fmaintenance%2Fbypass", url));
  }

  const maxAge = PREVIEW_HOURS * 60 * 60;
  const secure = url.protocol === "https:";
  const res = NextResponse.redirect(home);
  res.cookies.set(PREVIEW_COOKIE, await createPreviewToken(), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  // Carries nothing secret; it only tells the page to show the preview badge.
  res.cookies.set(PREVIEW_FLAG_COOKIE, "1", { secure, sameSite: "lax", path: "/", maxAge });
  return res;
}
