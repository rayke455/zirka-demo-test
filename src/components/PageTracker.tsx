"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/app/(frontend)/track-actions";
import { trackEvent } from "@/lib/analytics";

/**
 * Counts page views, and names the clicks that matter (brief §16).
 *
 * Nothing is written to the visitor's browser — no cookie, no session id, no
 * local storage — and the server keeps neither the IP address nor the full
 * referring URL. That is why the site does not ask permission first.
 *
 * Click events go through trackEvent, which only reaches an analytics tool if
 * Tag Manager has been installed; until then they go nowhere.
 */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void trackView(pathname, document.referrer);
  }, [pathname]);

  // One listener for the whole site instead of a handler on every link:
  // WhatsApp, phone and email links are recognised by their address, and any
  // other link worth counting carries data-track="event_name".
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const named = link.getAttribute("data-track");
      if (named) trackEvent(named, { link_url: href, page: window.location.pathname });
      else if (href.startsWith("https://wa.me/")) trackEvent("whatsapp_click", { page: window.location.pathname });
      else if (href.startsWith("tel:")) trackEvent("phone_click", { page: window.location.pathname });
      else if (href.startsWith("mailto:")) trackEvent("email_click", { page: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
