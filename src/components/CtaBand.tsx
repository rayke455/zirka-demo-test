import Link from "next/link";
import { getSettings, getFeatures } from "@/lib/cms";
import { WhatsAppIcon } from "./Icons";

export default async function CtaBand({
  heading = "Ready to find your direction?",
}: {
  heading?: string;
}) {
  const [settings, features] = await Promise.all([getSettings(), getFeatures()]);

  return (
    <section className="section--flow">
      <div className="wrap">
        <div className="cta-band">
          <h2>{heading}</h2>
          <div className="right">
            <div className="cta-actions">
              <Link className="btn btn-gold" href="/quote">
                Get started
              </Link>
              {features.showWhatsApp && (
              <a
                className="btn btn-ghost"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
              )}
            </div>
            <span className="contact">
              {[settings.phoneDisplay, settings.socialHandle].filter(Boolean).join("  ·  ")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
