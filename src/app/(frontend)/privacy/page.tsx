import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getSettings } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description:
    "What information Zirka Digital Solutions collects through this website, why, how long it is kept, and the choices you have.",
  path: "/privacy",
});

// Written to match what the site actually does. If the site starts collecting
// something new (email marketing, ad pixels, third-party analytics), update this page —
// including anything Cloudflare adds from its dashboard, which bypasses this codebase.
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
            Our forms store what you type into them. Depending on the form, that is your name,
            email address, phone or WhatsApp number, business name, website, main marketing goal,
            budget range, the services you are interested in, a preferred call time, and your
            message. We use it only to reply to you and to follow up on the conversation you
            started. It is visible to our team and to no one else, and we do not sell it or add
            you to a mailing list.
          </p>
          <p>
            If you arrived through a link from one of our campaigns, the free-audit form also
            records the campaign tags in that link (such as utm_source), the page you landed on
            and the website that referred you — the domain only. This tells us which campaigns
            bring enquiries; it is saved with your enquiry and nowhere else.
          </p>

          <h2>When you browse the site</h2>
          <p>
            We count page views so we know which pages are useful. For each view we record two
            things: the page address, and the website that linked you here — the domain only, never
            the full link.
          </p>
          <p>
            Nothing is written to your device for this. No cookie, no visit ID, nothing kept in
            your browser&rsquo;s storage, and we do not record your IP address. We use no
            advertising pixels. The trade-off is ours: we cannot tell whether two page views came
            from the same person.
          </p>

          <h2>Our hosting and network providers</h2>
          <p>
            The site is hosted by Vercel and served through Cloudflare, which protect it and make
            it load faster. Like any network provider, they handle your IP address in order to
            deliver the page to you. Cloudflare also measures visits with Cloudflare Web Analytics,
            which it describes as not using cookies and not tracking you across other websites.
            Their own privacy policies apply to that processing.
          </p>

          <h2>Protecting the site from abuse</h2>
          <p>
            To stop automated spam, we briefly check your IP address when you send an enquiry or
            load pages quickly. It is held in memory for a few minutes to count attempts and is
            never written to our database.
          </p>

          <h2>Cookies</h2>
          <p>
            Visitors to the public site receive no cookies from us at all. Our staff receive a
            login cookie when they sign in to manage the site, which does not affect visitors.
          </p>
          <p>
            One exception is in your hands: if a page shows a video, the player is not loaded until
            you press play. Pressing it loads the player from the company hosting the video, which
            may set its own cookies. Leave it unplayed and nothing loads.
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
