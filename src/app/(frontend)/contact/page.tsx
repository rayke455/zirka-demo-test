import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Zirka Digital Solutions — tell us what you're trying to solve.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Ready to find your direction?"
        lede="Tell us about the business and the number you're trying to move. A strategist reads every message personally — no form-fill funnel."
      />

      <section>
        <div className="wrap contact-grid">
          <ContactForm />
          <div className="contact-info">
            <div className="info-block">
              <h3>WhatsApp</h3>
              <a href={`https://wa.me/${settings.whatsapp}`}>{settings.phoneDisplay}</a>
            </div>
            {settings.email && (
              <div className="info-block">
                <h3>Email</h3>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
            )}
            <div className="info-block">
              <h3>Social</h3>
              <p>
                Facebook &amp; Instagram
                <br />
                {settings.socialHandle}
              </p>
            </div>
            <div className="info-block">
              <h3>Hours</h3>
              <p>{settings.hours}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
