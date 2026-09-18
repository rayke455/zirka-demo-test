import Link from "next/link";
import { getSettings, getFeatures } from "@/lib/cms";

/**
 * The closing call to action on most pages (brief §10): the free audit as the
 * one primary action, and a direct line to a strategist as the alternative for
 * people who would rather talk first. WhatsApp stays in the small contact line
 * rather than becoming a third button.
 */
export default async function CtaBand({
  heading = "Find your biggest marketing opportunities.",
}: {
  heading?: string;
}) {
  const [settings, features] = await Promise.all([getSettings(), getFeatures()]);

  // "Talk to a Strategist" goes to the booking calendar when it's open,
  // otherwise straight to WhatsApp.
  const strategistHref = features.bookingEnabled
    ? "/book"
    : features.showWhatsApp
      ? `https://wa.me/${settings.whatsapp}`
      : "/contact";
  const external = strategistHref.startsWith("http");

  return (
    <section className="section--flow">
      <div className="wrap">
        <div className="cta-band">
          <h2>{heading}</h2>
          <div className="right">
            <div className="cta-actions">
              <Link className="btn btn-gold" href="/free-marketing-audit" data-track="main_cta_click">
                Get a Free Marketing Audit
              </Link>
              {external ? (
                <a className="btn btn-ghost" href={strategistHref} target="_blank" rel="noopener noreferrer">
                  Talk to a Strategist
                </a>
              ) : (
                <Link className="btn btn-ghost" href={strategistHref}>
                  Talk to a Strategist
                </Link>
              )}
            </div>
            <span className="contact">
              {features.showWhatsApp ? (
                <>
                  WhatsApp{" "}
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    {settings.phoneDisplay || settings.whatsapp}
                  </a>
                </>
              ) : (
                settings.phoneDisplay
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
