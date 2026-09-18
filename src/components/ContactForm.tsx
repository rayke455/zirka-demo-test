"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitEnquiry } from "@/app/(frontend)/contact/actions";
import { budgetRanges as BUDGETS } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFirstName(String(formData.get("name") ?? "").split(" ")[0]);
    setError(null);

    startTransition(async () => {
      const result = await submitEnquiry(formData);
      if (result.ok) {
        trackEvent("contact_form_submit");
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="success-note" role="status">
        <h3>Thanks, {firstName || "there"} &mdash; message received.</h3>
        <p>
          A strategist will reply within one business day. If it&rsquo;s urgent, message us on
          WhatsApp and you&rsquo;ll get someone faster.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" />
        </div>
        <div className="field">
          <label htmlFor="budget">Monthly budget</label>
          <select id="budget" name="budget" defaultValue={BUDGETS[0]}>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">What are you trying to solve?</label>
        <textarea id="message" name="message" required />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-gold"
        style={{ alignSelf: "flex-start" }}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
