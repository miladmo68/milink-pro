"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav } from "../data/content.js";
import ThemeToggle from "./ThemeToggle.jsx";

const EASE = [0.25, 0.1, 0.25, 1];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav.map((n) => n.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(`#${id}`); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollTo = useCallback((href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "nav-scrolled" : "nav-top"}`}>
        {/* ── Desktop bar ── */}
        <div className="hidden md:block max-w-8xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-2 no-underline">
              {/* <img src="/logo.png" alt="Milink" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" /> */}
              <span className="font-display font-black text-xl leading-none" style={{ color: "var(--text-primary)" }}>MI</span>
              <span className="font-display font-black text-xl leading-none" style={{ color: "var(--accent)" }}>LINK</span>
            </a>
            <nav className="flex items-center gap-8" aria-label="Main navigation">
              {nav.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="relative font-display text-sm font-semibold tracking-wide transition-colors duration-200 no-underline py-1"
                  style={{ color: active === item.href ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {item.label}
                  {active === item.href && (
                    <motion.span layoutId="nav-underline" className="absolute -bottom-0.5 left-0 right-0 h-px rounded-full"
                      style={{ background: "var(--accent)" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <motion.a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-display font-bold text-sm no-underline"
                style={{ background: "var(--accent)", color: "#fff" }}>
                Book a Call
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* ── Mobile capsule ── */}
        <div className="md:hidden px-3 pt-3 pb-1">
          <div
            className="flex items-center gap-3 rounded-[28px] px-4 py-3 relative overflow-hidden"
            style={{
              background: "var(--nav-pill-bg)",
              border: "var(--nav-pill-border)",
              boxShadow: "var(--nav-pill-shadow)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            {/* Logo */}
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-2 no-underline">
              {/* <img src="/logo.png" alt="Milink" width={24} height={24} className="w-6 h-6 object-contain flex-shrink-0" /> */}
              <span className="font-display font-black text-lg leading-none" style={{ color: "var(--text-primary)" }}>MI</span>
              <span className="font-display font-black text-lg leading-none" style={{ color: "var(--accent)" }}>LINK</span>
            </a>

            {/* Hamburger only — no theme toggle here */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="ml-auto w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-full"
              style={{
                background: "var(--nav-burger-bg)",
                border: "var(--nav-burger-border)",
                boxShadow: "var(--nav-burger-shadow)",
              }}
            >
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} transition={{ duration: 0.22 }} className="block w-5 h-[2px] rounded-full" style={{ background: "var(--text-primary)" }} />
              <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }} transition={{ duration: 0.15 }} className="block w-5 h-[2px] rounded-full" style={{ background: "var(--text-primary)" }} />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} transition={{ duration: 0.22 }} className="block w-5 h-[2px] rounded-full" style={{ background: "var(--text-primary)" }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile fullscreen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-[200] flex flex-col md:hidden"
            style={{ background: "var(--mobile-menu-bg)" }}
          >
            {/* Header row matches the capsule height/padding */}
            <div className="flex items-center justify-between px-7 pt-6 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg leading-none" style={{ color: "var(--text-primary)" }}>MI</span>
                <span className="font-display font-black text-lg leading-none" style={{ color: "var(--accent)" }}>LINK</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    const cur = document.documentElement.getAttribute("data-theme") || "dark";
                    const next = cur === "dark" ? "light" : "dark";
                    document.documentElement.setAttribute("data-theme", next);
                    document.documentElement.classList.toggle("dark", next === "dark");
                    try { localStorage.setItem("milink-theme-mode", next); } catch {}
                    window.dispatchEvent(new CustomEvent("milink-theme-change", { detail: next }));
                  }}
                  aria-label="Toggle theme"
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    minHeight: 44,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block", color: "var(--text-primary)" }}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    minHeight: 44,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    background: "var(--nav-burger-bg)",
                    border: "var(--nav-burger-border)",
                    boxShadow: "var(--nav-burger-shadow)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: "var(--text-primary)" }}>
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex flex-col gap-2.5 px-5 pt-6 pb-6 flex-1 overflow-y-auto" aria-label="Mobile navigation">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.055, ease: EASE }}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="flex items-center justify-between px-5 py-4 rounded-2xl font-display font-bold text-lg no-underline"
                  style={{
                    background: active === item.href ? "rgba(0,96,255,0.10)" : "var(--mobile-item-bg)",
                    color: active === item.href ? "var(--accent)" : "var(--text-primary)",
                    border: `1px solid ${active === item.href ? "rgba(0,96,255,0.22)" : "var(--mobile-item-border)"}`,
                  }}
                >
                  {item.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--accent)", opacity: 0.5 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </motion.a>
              ))}

              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, ease: EASE }}
                onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-display font-bold text-base no-underline"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Book a Call ↗
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
