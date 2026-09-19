import Link from "next/link";
import Image from "next/image";
import { getSettings, getSolutionCategories } from "@/lib/cms";

/**
 * Brief §27: who Zirka is, the four solutions, the main pages and the legal
 * links. Only real details — no invented address, registrations or badges.
 */
export default async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getSolutionCategories()]);

  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Link className="foot-logo" href="/">
            <Image src="/images/logo.png" alt="Zirka Digital Solutions — home" width={101} height={82} />
          </Link>
          <p className="slogan">{settings.slogan}</p>
          <p className="foot-about">
            A digital marketing agency helping growing businesses get found, win more leads, build
            a trusted brand and convert with smart automation.
          </p>
        </div>

        {categories.length > 0 && (
          <nav className="foot-col" aria-label="Solutions">
            <h2 className="foot-heading">Solutions</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/services#${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="foot-col" aria-label="Company">
          <h2 className="foot-heading">Company</h2>
          <ul>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/work">Work</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/free-marketing-audit">Free Marketing Audit</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="wrap foot-base">
        <span>
          &copy; {new Date().getFullYear()} {settings.companyName}
        </span>
        <span className="foot-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refunds">Refunds</Link>
        </span>
      </div>
    </footer>
  );
}
