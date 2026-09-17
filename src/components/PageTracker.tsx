"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/app/(frontend)/track-actions";
import { useConsent } from "./CookieConsent";

/** Session id lives in sessionStorage, so it disappears when the tab closes. */
const getSession = (): string => {
  try {
    const existing = sessionStorage.getItem("zk_s");
    if (existing) return existing;
    const fresh = Math.random().toString(36).slice(2, 12);
    sessionStorage.setItem("zk_s", fresh);
    return fresh;
  } catch {
    return "";
  }
};

export default function PageTracker() {
  const pathname = usePathname();
  const consent = useConsent();

  useEffect(() => {
    // No counting at all until the visitor has said yes.
    if (consent !== "accepted") return;
    void trackView(pathname, document.referrer, getSession());
  }, [pathname, consent]);

  return null;
}
