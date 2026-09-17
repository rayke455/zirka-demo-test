"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, CloseIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site">
      <div className="navrow">
        <Link className="wordmark" href="/" aria-label="Zirka Digital Solutions — home">
          {/* Declared at display size so the optimizer serves a ~110px file, not a 1920px one. */}
          <Image
            className="mark"
            src="/images/logo-mark.png"
            alt=""
            width={55}
            height={38}
            loading="eager"
            fetchPriority="high"
          />
          <span className="lockup">
            <span className="name">Zirka</span>
            <span className="sub">Digital Solutions</span>
          </span>
        </Link>
        <ul className="links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <ThemeToggle />
          <Link className="btn btn-gold" href="/quote">
            Get started
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-panel">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link
            className="btn btn-gold mobile-cta"
            href="/quote"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </nav>
      )}
    </header>
  );
}
