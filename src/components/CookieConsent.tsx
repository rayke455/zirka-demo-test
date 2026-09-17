"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "zk-consent";
export type Consent = "accepted" | "declined" | "unset";

// Consent lives in localStorage rather than a cookie, so nothing is stored on the
// visitor's device until they actually choose.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};

const read = (): Consent => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : "unset";
  } catch {
    return "unset";
  }
};

/** Read the visitor's choice. "unset" on the server, so nothing runs before they choose. */
export const useConsent = (): Consent => useSyncExternalStore(subscribe, read, () => "unset");

const set = (value: Consent) => {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private browsing: the banner will ask again next visit.
  }
  notify();
};

export default function CookieConsent() {
  const consent = useConsent();
  if (consent !== "unset") return null;

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Privacy choices">
      <div className="consent__inner">
        <p className="consent__text">
          We count anonymous page visits to see which pages are useful, and embedded videos load
          from YouTube. Neither happens until you say yes.{" "}
          <Link href="/privacy">How we handle data</Link>.
        </p>
        <div className="consent__actions">
          <button type="button" className="btn btn-outline" onClick={() => set("declined")}>
            Decline
          </button>
          <button type="button" className="btn btn-gold" onClick={() => set("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
