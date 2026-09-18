"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/app/(frontend)/track-actions";

/**
 * Counts page views and nothing else.
 *
 * Nothing is written to the visitor's browser — no cookie, no session id, no
 * local storage — and the server keeps neither the IP address nor the full
 * referring URL. That is why the site no longer asks permission first: there is
 * nothing stored on anyone's device to ask about. The cost is that a person
 * reading three pages counts as three views rather than one visitor.
 */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void trackView(pathname, document.referrer);
  }, [pathname]);

  return null;
}
