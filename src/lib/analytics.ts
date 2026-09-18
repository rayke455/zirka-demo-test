/**
 * Named conversion events from brief §16 — marketing_audit_submit,
 * contact_form_submit, whatsapp_click and the rest.
 *
 * No analytics tool is installed yet (GA4/GTM waits on the owner's measurement
 * ID and a consent decision), so this only hands the event to a Tag Manager
 * `dataLayer` if one exists. Until then it does nothing at all: no network
 * request, nothing stored. Adding GTM later makes every call site live at once.
 */
type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as DataLayerWindow).dataLayer?.push({ event, ...params });
}
