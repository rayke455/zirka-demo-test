import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaintenance, getSettings } from "@/lib/cms";
import { WhatsAppIcon } from "@/components/Icons";

// Shown only while maintenance mode is on, so it is always rendered fresh.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "We'll be back shortly | Zirka Digital Solutions",
};

export default async function MaintenancePage() {
  const [maintenance, settings] = await Promise.all([getMaintenance(), getSettings()]);
  // Visited directly while the site is open, there is nothing to show.
  if (!maintenance.on) notFound();

  const digits = settings.whatsapp.replace(/\D/g, "");

  return (
    <main className="maintenance">
      <div className="maintenance__card">
        <Image
          className="maintenance__logo"
          src="/images/logo.png"
          alt={settings.companyName}
          width={140}
          height={114}
          loading="eager"
        />
        <p className="maintenance__slogan">{settings.slogan}</p>

        <h1>{maintenance.heading}</h1>
        <p className="maintenance__message">{maintenance.message}</p>

        <section className="maintenance__contact" aria-labelledby="maintenance-contact">
          <h2 id="maintenance-contact">For any enquiries, contact us</h2>
          <div className="maintenance__actions">
            {digits && (
              <a
                className="btn btn-gold"
                href={`https://wa.me/${digits}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                Message us on WhatsApp
              </a>
            )}
            {digits && (
              <a className="btn btn-ghost" href={`tel:+${digits}`}>
                Call {settings.phoneDisplay || `+${digits}`}
              </a>
            )}
            {settings.email && (
              <a className="btn btn-ghost" href={`mailto:${settings.email}`}>
                Email {settings.email}
              </a>
            )}
          </div>
          {settings.hours && <p className="maintenance__hours">{settings.hours}</p>}
        </section>
      </div>
      <Link className="maintenance__team" href="/admin">
        Team sign-in
      </Link>
    </main>
  );
}
