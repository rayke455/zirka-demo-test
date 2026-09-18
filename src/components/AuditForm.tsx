"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { requestAudit, type AuditField } from "@/app/(frontend)/free-marketing-audit/actions";
import { AUDIT_GOALS } from "@/lib/audit";
import { trackEvent } from "@/lib/analytics";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/**
 * The free-audit request form (brief §9).
 *
 * Inputs are uncontrolled and the form is never reset on an error, so a
 * mistake in one field never costs the visitor what they typed in the others.
 * Campaign tags are read from the address the visitor landed on and sent in
 * hidden fields — nothing is stored in their browser to do it.
 */
export default function AuditForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<AuditField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Attribution from the landing URL. Read after mount, because the server
  // render has no window to read it from.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const set = (name: string, value: string) => {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.value = value;
    };
    for (const key of UTM_KEYS) set(key, params.get(key) ?? "");
    set("landing_page", window.location.pathname);
    try {
      set("referrer_host", document.referrer ? new URL(document.referrer).hostname : "");
    } catch {
      set("referrer_host", "");
    }
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setFormError(null);

    startTransition(async () => {
      const result = await requestAudit(data);
      if (result.ok) {
        trackEvent("marketing_audit_submit", { goal: data.get("goal") });
        setSentTo(String(data.get("name") ?? "").split(" ")[0] || "there");
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error ?? "Something went wrong.");
      // Take the visitor straight to the first thing that needs fixing.
      const first = Object.keys(result.fieldErrors ?? {})[0];
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    });
  }

  // Clear a field's error as soon as the visitor starts correcting it.
  const clear = (field: AuditField) => () =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));

  const described = (field: AuditField, hint?: string) =>
    [errors[field] ? `audit-${field}-error` : null, hint].filter(Boolean).join(" ") || undefined;

  const errorText = (field: AuditField) =>
    errors[field] ? (
      <p className="field-error" id={`audit-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  if (sentTo) {
    return (
      <div className="booking-done" role="status">
        <span className="eyebrow">Request received</span>
        <h2>Thanks, {sentTo}.</h2>
        <p className="booking-done__meta">
          A Zirka strategist will review your website and current marketing, then get back to you by
          email with the biggest opportunities we find. If anything is urgent, message us on
          WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="audit-form" onSubmit={submit} noValidate>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="audit-hp">Leave this empty</label>
        <input id="audit-hp" name="hp_confirm" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {UTM_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} defaultValue="" />
      ))}
      <input type="hidden" name="landing_page" defaultValue="" />
      <input type="hidden" name="referrer_host" defaultValue="" />

      <div className="form-row">
        <div className="field">
          <label htmlFor="audit-name">Your name</label>
          <input
            id="audit-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={described("name")}
            onInput={clear("name")}
          />
          {errorText("name")}
        </div>
        <div className="field">
          <label htmlFor="audit-company">Business name</label>
          <input
            id="audit-company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby={described("company")}
            onInput={clear("company")}
          />
          {errorText("company")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="audit-email">Email</label>
          <input
            id="audit-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={described("email")}
            onInput={clear("email")}
          />
          {errorText("email")}
        </div>
        <div className="field">
          <label htmlFor="audit-phone">Phone or WhatsApp (optional)</label>
          <input
            id="audit-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={described("phone")}
            onInput={clear("phone")}
          />
          {errorText("phone")}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="audit-website">Website</label>
          <input
            id="audit-website"
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.com"
            required
            aria-invalid={Boolean(errors.website)}
            aria-describedby={described("website")}
            onInput={clear("website")}
          />
          {errorText("website")}
        </div>
        <div className="field">
          <label htmlFor="audit-goal">Main marketing goal</label>
          <select
            id="audit-goal"
            name="goal"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={described("goal")}
            onChange={clear("goal")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {AUDIT_GOALS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          {errorText("goal")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="audit-message">Anything else we should know? (optional)</label>
        <textarea id="audit-message" name="message" rows={4} />
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="btn btn-gold" disabled={pending}>
        {pending ? "Sending…" : "Request My Free Audit"}
      </button>
      <p className="field-hint">
        No obligation, and we never share your details. See how we handle data in our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}
