"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/app/(frontend)/track-actions";

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

  useEffect(() => {
    void trackView(pathname, document.referrer, getSession());
  }, [pathname]);

  return null;
}
