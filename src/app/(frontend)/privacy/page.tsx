import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What information Zirka Digital Solutions collects through this website, and what we do with it.",
};

// Written to match what the site actually does. If the site starts collecting
// something new (email marketing, ad pixels, third-party analytics), update this page.
const LAST_UPDATED = "September 2026";

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What we collect, and why."
        lede="Plainly: very little. This page explains exactly what this website stores and what it doesn't."
      />

      <section>
        <div className="wrap prose">
          <p className="prose__meta">Last updated {LAST_UPDATED}</p>

          <h2>When you send us an enquiry</h2>
          <p>
            If you use the contact form, we store what you type into it: your name, email address,
            company, budget range and message. We use it only to reply to you and to follow up on
            the conversation you started. It is visible to our team and to no one else, and we do
            not sell it or add you to a mailing list.
          </p>

          <h2>When you browse the site</h2>
          <p>
            We count page visits so we know which pages are useful. For each visit we record the
            page address, the website that linked you here (the domain only, never the full link),
            and a random visit ID.
          </p>
          <p>
            That ID is stored in your browser&rsquo;s session storage and is deleted when you close
            the tab. We do not store your IP address, we do not use tracking cookies, and we do not
            use third-party analytics or advertising pixels. The visit data cannot be used to
            identify you.
          </p>

          <h2>Protecting the site from abuse</h2>
          <p>
            To stop automated spam, we briefly check your IP address when you send an enquiry or
            load pages quickly. It is held in memory for a few minutes to count attempts and is
            never written to our database.
          </p>

          <h2>Cookies</h2>
          <p>
            Visitors to the public site receive no cookies from us. Our staff receive a login
            cookie when they sign in to manage the site, which does not affect visitors.
          </p>

          <h2>Links to other services</h2>
          <p>
            Buttons that open WhatsApp take you to a service run by WhatsApp, whose own privacy
            policy then applies.
          </p>
          <p>
            Where we show a video hosted on YouTube or Vimeo, the player loads from their servers.
            We use YouTube&rsquo;s no-cookie option, so nothing is stored until you press play; once
            you do, that provider&rsquo;s own privacy policy applies.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries are kept for as long as they&rsquo;re needed to handle your request and any
            work that follows. Anonymous visit counts are kept for reporting.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Get
            in touch
            {settings.email ? (
              <>
                {" "}
                at <a href={`mailto:${settings.email}`}>{settings.email}</a> or
              </>
            ) : null}{" "}
            on WhatsApp at{" "}
            <a href={`https://wa.me/${settings.whatsapp}`}>{settings.phoneDisplay}</a> and we&rsquo;ll
            take care of it.
          </p>
        </div>
      </section>
    </>
  );
}
