import { useEffect, useState } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // heights for spacer (tweak if needed)
  const navH = open ? 64 + nav.length * 44 : 64; // px rough calc on mobile when menu open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all
        ${
          SITE.enableStickyBlur && scrolled
            ? "backdrop-blur bg-base-100/70 shadow-glow"
            : "bg-transparent"
        }`}
        style={{ height: 64 }}
      >
        <div className="container navbar py-3">
          <div className="flex-1">
            <a
              href="#home"
              className="text-xl font-display font-extrabold text-primary"
            >
              MILINK
            </a>
          </div>

          <nav className="hidden md:flex gap-6">
            {nav.map((n, i) => (
              <a key={i} href={n.href} className="link link-hover">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              Book a Call
            </a>
            <button
              className="btn btn-ghost btn-sm md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="menu"
            >
              ≡
            </button>
          </div>
        </div>

        {/* Mobile dropdown (kept inside header so it stays attached under the bar) */}
        {open && (
          <div className="md:hidden bg-base-100 border-t">
            <div className="container py-2 flex flex-col">
              {nav.map((n, i) => (
                <a
                  key={i}
                  href={n.href}
                  className="py-2"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn’t hide under fixed header */}
      <div style={{ height: navH }} aria-hidden="true" />
    </>
  );
}
