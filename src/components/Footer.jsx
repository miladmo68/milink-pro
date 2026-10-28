"use client";

import { useEffect, useState } from "react";
import { Instagram, Mail, Phone } from "lucide-react";
import { nav } from "../data/content.js";
import { BUSINESS, whatsappLinks } from "../config/business.js";
import { openWhatsApp } from "../lib/whatsapp.js";

// Public-site footer: deliberately small. One row (logo + MILINK wordmark,
// links, contact icons) and one fine-print line. CSS only, no animation library. Every value comes from src/config/business.js; styles are
// the `.mk-footer*` block in globals.css. The floating WhatsApp launcher also
// lives here so it appears on every marketing page.

const WhatsAppGlyph = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1.3-4.2A8 8 0 1 1 12 20a8 8 0 0 1-3.8-1L4 20z" />
    <path d="M9.2 9.2c0 3 2.6 5.6 5.6 5.6l1-1.3-1.9-1-.8.6a3.5 3.5 0 0 1-1.6-1.6l.6-.8-1-1.9z" />
  </svg>
);

const LINKS = [...nav, { label: "Client Portal", href: "/portal" }];

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = whatsappLinks();
  const [away, setAway] = useState(false);

  // On phones the launcher hides while scrolling down and returns on scroll up (CSS only applies below 768px).
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) > 8) {
          setAway(y > last && y > 120);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="mk-footer marketing-navy-footer bg-base-200 dark:!bg-transparent" aria-label="Site footer">
        <div className="absolute inset-0 -z-10 pointer-events-none hidden dark:block" aria-hidden="true">
          <div className="section-depth-footer" />
        </div>

        <div className="container relative z-10">
          <div className="mk-footer-main">
            <a href="/" className="mk-footer-logo" aria-label={`${BUSINESS.brand} home`}>
              <img src="/Logo-Blue.png" alt="" width={74} height={40} />
              <span className="mk-footer-wordmark">
                <b>MI</b><b className="text-[color:var(--accent)]">LINK</b>
              </span>
            </a>

            <nav className="mk-footer-nav-wrap" aria-label="Footer navigation">
              <ul className="mk-footer-nav">
                {LINKS.map((item) => (
                  <li key={item.href}><a href={item.href}>{item.label}</a></li>
                ))}
              </ul>
            </nav>

            <ul className="mk-footer-social">
              <li>
                <a href={BUSINESS.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${BUSINESS.instagram.handle}`}>
                  <Instagram size={16} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={whatsapp.web} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={openWhatsApp}>
                  <WhatsAppGlyph size={16} />
                </a>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phone.tel}`} aria-label={`Call ${BUSINESS.phone.display}`}>
                  <Phone size={16} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} aria-label={`Email ${BUSINESS.email}`}>
                  <Mail size={16} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <p className="mk-footer-bottom">
            © {year} {BUSINESS.name}
            <span className="mk-footer-area"> · {BUSINESS.address.short}</span>
          </p>
        </div>
      </footer>

      <a
        href={whatsapp.web}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Milink on WhatsApp"
        className={`marketing-whatsapp-float${away ? " is-away" : ""}`}
        onClick={openWhatsApp}
      >
        <WhatsAppGlyph size={28} />
      </a>
    </>
  );
}
