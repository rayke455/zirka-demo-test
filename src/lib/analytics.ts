/**
 * Named conversion events from brief §16 — marketing_audit_submit,
 * contact_form_submit, whatsapp_click and the rest.
 *
 * Google Analytics only loads once the owner enters a measurement ID in
 * Features → Visitor analytics. Until then `gtag` doesn't exist and this does
 * nothing at all: no network request, nothing stored.
 */
type GtagWindow = Window & { gtag?: (command: "event", name: string, params: Record<string, unknown>) => void };

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).gtag?.("event", event, params);
}
