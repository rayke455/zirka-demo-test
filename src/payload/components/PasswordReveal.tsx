"use client";

import { useEffect, type ReactNode } from "react";

/** Fields stored as plain text that should still be hidden on screen, like a password. */
const SECRET_FIELDS = ["#field-smtpPass"];

const EYE =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a10.6 10.6 0 0 0 5.4-1.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m3 3 18 18"/></svg>';

/** Centre the button on the box itself: some wrappers are taller than the input. */
function place(input: HTMLInputElement) {
  const button = input.nextElementSibling as HTMLElement | null;
  if (button?.classList.contains("zk-reveal") && input.offsetHeight > 0) {
    button.style.top = `${input.offsetTop + input.offsetHeight / 2}px`;
  }
}

/**
 * Adds a show/hide button to every password box in the admin: the login
 * page, changing a password on an account, and the mail server password.
 * Payload renders those inputs itself, so this watches the page and adds the
 * button next to each one as it appears.
 */
function enhance(input: HTMLInputElement) {
  if (input.dataset.zkReveal) return place(input);
  input.dataset.zkReveal = "1";
  if (input.type !== "password") input.type = "password";

  const holder = input.parentElement;
  if (!holder) return;
  holder.classList.add("zk-reveal-holder");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "zk-reveal";
  // Payload redraws the box as you type, which puts type="password" back.
  // Remember the choice here and re-apply it whenever that happens.
  let shown = false;
  const sync = () => {
    button.innerHTML = shown ? EYE_OFF : EYE;
    button.setAttribute("aria-label", shown ? "Hide password" : "Show password");
    button.setAttribute("aria-pressed", String(shown));
    button.title = shown ? "Hide password" : "Show password";
  };
  button.addEventListener("click", () => {
    shown = !shown;
    input.type = shown ? "text" : "password";
    sync();
    input.focus();
  });
  new MutationObserver(() => {
    const wanted = shown ? "text" : "password";
    if (input.type !== wanted) input.type = wanted;
  }).observe(input, { attributes: true, attributeFilter: ["type"] });
  sync();
  input.insertAdjacentElement("afterend", button);
  place(input);
}

export default function PasswordReveal({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const scan = () => {
      document
        .querySelectorAll<HTMLInputElement>(`input[type="password"], ${SECRET_FIELDS.join(", ")}`)
        .forEach(enhance);
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", scan);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scan);
    };
  }, []);

  return <>{children}</>;
}
