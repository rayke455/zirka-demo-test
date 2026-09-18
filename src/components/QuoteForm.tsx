"use client";

import { useState, useTransition, type FormEvent } from "react";
import { requestQuote } from "@/app/(frontend)/quote/actions";

export type QuoteService = { id: number; name: string; short: string };

/**
 * Ranges line up with the plan boundaries ($950 Starter, $1,850 Growth, $3,500
 * Scale) so an enquiry says which plan the person is really asking about. The
 * last option is here because this form also quotes one-off websites and logos,
 * which have no monthly figure at all.
 */
const BUDGETS = [
  "Not sure yet",
  "Under $950 a month",
  "$950 – $1,850 a month",
  "$1,850 – $3,500 a month",
  "$3,500+ a month",
  "One-off project, not monthly",
];
const TIMELINES = ["As soon as possible", "Within a month", "In the next quarter", "Just exploring"];

export default function QuoteForm({
  services,
  preselected,
}: {
  services: QuoteService[];
  preselected: number[];
}) {
  const [picked, setPicked] = useState<number[]>(preselected);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (id: number) =>
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.delete("services");
    for (const id of picked) form.append("services", String(id));
    setError(null);

    startTransition(async () => {
      const result = await requestQuote(form);
      if (result.ok) setSent(String(form.get("name") ?? ""));
      else setError(result.error ?? "Something went wrong.");
    });
  }

  if (sent) {
    return (
      <div className="booking-done" role="status">
        <span className="eyebrow">Request received</span>
        <h2>Thanks, {sent.split(" ")[0] || "there"}.</h2>
        <p className="booking-done__meta">
          We&rsquo;ll put together a quote for the services you picked and reply by email within one
          business day. If it&rsquo;s urgent, message us on WhatsApp and we&rsquo;ll get straight to it.
        </p>
      </div>
    );
  }

  return (
    <form className="quote" onSubmit={submit}>
      <div className="quote__step">
        <h2 className="booking__label">1. What do you need?</h2>
        <p className="booking__tz">Pick as many as you like.</p>
        <div className="quote__services">
          {services.map((s) => {
            const on = picked.includes(s.id);
            return (
              <button
                type="button"
                key={s.id}
                className={`quote-chip${on ? " is-selected" : ""}`}
                aria-pressed={on}
                onClick={() => toggle(s.id)}
              >
                <span className="quote-chip__tick" aria-hidden="true">
                  {on ? "✓" : "+"}
                </span>
                <span>
                  <strong>{s.name}</strong>
                  <em>{s.short}</em>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quote__step booking__form">
        <h2 className="booking__label">2. About you</h2>

        <div className="hp-field" aria-hidden="true">
          <label htmlFor="q-website">Leave this empty</label>
          <input id="q-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="q-name">Full name</label>
            <input id="q-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="q-email">Email</label>
            <input id="q-email" name="email" type="email" autoComplete="email" required />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="q-phone">Phone or WhatsApp (optional)</label>
            <input id="q-phone" name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="q-company">Business name (optional)</label>
            <input id="q-company" name="company" type="text" autoComplete="organization" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="q-budget">Monthly budget</label>
            <select
              id="q-budget"
              name="budget"
              defaultValue={BUDGETS[0]}
              aria-describedby="q-budget-hint"
            >
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <p className="field-hint" id="q-budget-hint">
              Roughly what you can spend with us each month. Advertising budget is separate.
            </p>
          </div>
          <div className="field">
            <label htmlFor="q-timeline">When do you want to start?</label>
            <select id="q-timeline" name="timeline" defaultValue={TIMELINES[0]}>
              {TIMELINES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="q-details">Anything else we should know? (optional)</label>
          <textarea id="q-details" name="details" rows={4} />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-gold" disabled={pending}>
          {pending ? "Sending…" : `Request my quote${picked.length ? ` (${picked.length})` : ""}`}
        </button>
      </div>
    </form>
  );
}
