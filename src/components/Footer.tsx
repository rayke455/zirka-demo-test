import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/cms";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer>
      <div className="wrap foot-row">
        <div className="foot-brand">
          <Link className="foot-logo" href="/" aria-label="Zirka Digital Solutions — home">
            <Image src="/images/logo.png" alt="Zirka Digital Solutions" width={101} height={82} />
          </Link>
          <p className="slogan">{settings.slogan}</p>
        </div>
        <ul className="foot-links">
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
        </ul>
        <span className="copyright">
          &copy; {new Date().getFullYear()} {settings.companyName} &middot;{" "}
          <Link href="/privacy">Privacy</Link> &middot; <Link href="/terms">Terms</Link> &middot;{" "}
          <Link href="/refunds">Refunds</Link>
        </span>
      </div>
    </footer>
  );
}
