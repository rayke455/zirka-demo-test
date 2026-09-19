"use client";

import { useState } from "react";

/**
 * Features → Emails: sends one email through the saved mail server so the
 * owner can see straight away whether the settings work, and why not if not.
 */
export default function TestEmailButton() {
  const [state, setState] = useState<{ kind: "idle" | "sending" | "ok" | "error"; text?: string }>({ kind: "idle" });

  const send = async () => {
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/globals/features/test-email", { method: "POST", credentials: "include" });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      setState({ kind: res.ok ? "ok" : "error", text: body.message ?? `Something went wrong (${res.status}).` });
    } catch {
      setState({ kind: "error", text: "Couldn't reach the server. Check your connection and try again." });
    }
  };

  return (
    <div className="zk-test-email">
      <button type="button" className="zk-test-email__btn" onClick={send} disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Sending…" : "Send a test email"}
      </button>
      <span className="zk-test-email__hint">Save your changes first. The test uses the saved settings.</span>
      {state.text && (
        <p className={`zk-test-email__result zk-test-email__result--${state.kind}`} role="status">
          {state.text}
        </p>
      )}
    </div>
  );
}
