"use client";

import { useEffect, useState } from "react";
import { PREVIEW_FLAG_COOKIE } from "@/lib/preview-cookie-names";

/**
 * A reminder for a team member previewing the site during maintenance: they
 * are seeing the real pages, but visitors are seeing the notice. Checks the
 * live status too, so a leftover cookie never shows it after maintenance ends.
 */
export default function PreviewBadge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!document.cookie.split("; ").some((c) => c.startsWith(`${PREVIEW_FLAG_COOKIE}=`))) return;
    let cancelled = false;
    fetch("/site-status", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: { maintenance?: boolean }) => !cancelled && setShow(s.maintenance === true))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;
  return (
    <div className="preview-badge" role="status">
      <span>Preview: visitors currently see the maintenance notice.</span>
      <a href="/maintenance/bypass?exit=1">End preview</a>
    </div>
  );
}
