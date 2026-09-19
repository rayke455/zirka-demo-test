"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

/** Services is a menu of its own (brief §26), so it is not in this list. */
const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export type NavCategory = { name: string; slug: string; description: string };

export default function HeaderNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();
  const servicesRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close the Services menu on navigation, on Escape, and on a click elsewhere.
  useEffect(() => {
    queueMicrotask(() => setServicesOpen(false));
  }, [pathname]);
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [servicesOpen]);

  return (
    <>
      <header className="site">
        <div className="navrow">
          <Link className="wordmark" href="/">
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
              <span className="name">Zirka</span>{" "}
              <span className="sub">Digital Solutions</span>
            </span>
          </Link>
          <ul className="links">
            <li className="nav-services" ref={servicesRef}>
              <button
                type="button"
                className="nav-services__toggle"
                aria-expanded={servicesOpen}
                aria-controls={menuId}
                onClick={() => setServicesOpen((v) => !v)}
              >
                Services
                <span className="nav-services__chevron" aria-hidden="true" />
              </button>
              <div className="nav-services__menu" id={menuId} hidden={!servicesOpen}>
                <ul>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/services#${c.slug}`}>
                        <strong>{c.name}</strong>
                        <span>{c.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className="nav-services__all" href="/services">
                  All services &rarr;
                </Link>
              </div>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <ThemeToggle />
            <Link
              className="btn btn-gold nav-cta"
              href="/free-marketing-audit"
              data-track="main_cta_click"
            >
              Get a Free Marketing Audit
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
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                className="mobile-sub"
                href={`/services#${c.slug}`}
                onClick={() => setOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              className="btn btn-gold mobile-cta"
              href="/free-marketing-audit"
              data-track="main_cta_click"
              onClick={() => setOpen(false)}
            >
              Get a Free Marketing Audit
            </Link>
          </nav>
        )}
      </header>
      {/* Where "Skip to content" lands: just past the navigation, which on this
          site sits inside each page's hero rather than above <main>. */}
      <span id="content" tabIndex={-1} className="skip-target" />
    </>
  );
}
