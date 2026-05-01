"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

const STATS = [
  { num: "50+", label: "Projects" },
  { num: "95+", label: "Lighthouse" },
  { num: "5★",  label: "Rating" },
];

// Floating service constellation (desktop only)
const SERVICES = [
  { label: "Web Design",   top: "6%",  left: "22%", delay: 0.0, size: "lg" },
  { label: "E-Commerce",   top: "20%", left: "62%", delay: 0.1, size: "md" },
  { label: "SEO",          top: "44%", left: "10%", delay: 0.2, size: "sm" },
  { label: "UI / UX",      top: "52%", left: "48%", delay: 0.3, size: "lg" },
  { label: "Branding",     top: "74%", left: "20%", delay: 0.4, size: "md" },
  { label: "Performance",  top: "82%", left: "60%", delay: 0.5, size: "sm" },
];

const sizeMap = {
  sm: "px-3.5 py-1.5 text-[11px]",
  md: "px-4 py-2 text-[12px]",
  lg: "px-5 py-2.5 text-[13px]",
};

export default function Hero() {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const reduced = useReducedMotion();

  const fadeUp = (delay = 0, distance = 30) => ({
    initial: reduced ? {} : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: reduced ? 0 : delay },
  });

  return (
    <section
      id="home"
      className="relative z-0 bg-transparent min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden"
    >
      {/* ===== Background ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="section-depth-hero pointer-events-none absolute inset-0 hidden dark:block"
          aria-hidden
        />
        {!fallback ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [object-position:60%_50%] sm:[object-position:center]"
            src="/assets/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFallback(true)}
            aria-hidden="true"
          />
        ) : (
          <img
            src="/assets/images/hero-bg.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="hero-plain hero-mask-90" aria-hidden="true" />
        <div className="hero-bleed hero-mask-90" aria-hidden="true" />
        <div className="hero-grid grid-fade hero-mask-90" aria-hidden="true" />
        <div className="hero-grid hero-grid-center hero-mask-90" aria-hidden="true" />
        <div className="hero-highlight hero-mask-90" aria-hidden="true" />
        <div className="hero-shadow hero-mask-90" aria-hidden="true" />
        <div className="hero-topfade" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        {/* Desktop: brand glow behind headline */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(40% 50% at 24% 55%, rgb(var(--brand) / 0.22) 0%, rgba(0,0,0,0) 65%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Desktop: secondary accent on the right side */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(38% 45% at 78% 35%, rgb(var(--brand) / 0.16) 0%, rgba(0,0,0,0) 70%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Desktop: side gradient lets the laptop video breathe more on the right */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,12,22,0.55) 0%, rgba(7,12,22,0.30) 45%, rgba(7,12,22,0.0) 80%)",
          }}
        />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 pt-24 pb-20 md:pb-28 lg:py-28 w-full">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">
          {/* Left column */}
          <div className="lg:col-span-7">
            {/* Eyebrow — premium status capsule */}
            <motion.div
              {...fadeUp(0.2, 16)}
              className="inline-flex items-center gap-2.5 mb-10 px-3.5 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <span className="relative flex w-1.5 h-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                  style={{ background: "#22c55e" }}
                />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#22c55e" }} />
              </span>
              <span
                className="font-display font-bold uppercase tracking-[0.18em] text-[10px]"
                style={{ color: "var(--text-secondary)" }}
              >
                Available for new projects
              </span>
              <span className="w-px h-2.5" style={{ background: "var(--surface-border)", opacity: 0.6 }} />
              <span
                className="font-display font-bold uppercase tracking-[0.18em] text-[10px]"
                style={{ color: "var(--accent)" }}
              >
                Toronto · Est. 2024
              </span>
            </motion.div>

            {/* Title */}
            <h1
              className="font-display font-black mb-8 text-center sm:text-left"
              style={{ letterSpacing: "-0.03em", fontSize: "clamp(38px, 8vw, 88px)", lineHeight: 0.92 }}
            >
              <div className="overflow-hidden flex gap-[0.22em] justify-center sm:justify-start">
                {["Build", "what"].map((w, i) => (
                  <motion.span
                    key={w}
                    initial={reduced ? {} : { opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE, delay: reduced ? 0 : 0.3 + i * 0.09 }}
                    className="inline-block"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={reduced ? {} : { opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: EASE, delay: reduced ? 0 : 0.48 }}
                  className="relative inline-block"
                  style={{ color: "var(--accent)" }}
                >
                  converts.
                  <motion.span
                    aria-hidden
                    initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1.0 }}
                    className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full origin-left"
                    style={{
                      background: "linear-gradient(90deg, rgb(var(--brand)) 0%, rgb(var(--brand-accent)) 100%)",
                      boxShadow: "0 0 18px rgb(var(--brand) / 0.55)",
                    }}
                  />
                </motion.span>
              </div>
            </h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.65)}
              className="font-body font-light text-[16px] max-w-[480px] mb-12"
              style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}
            >
              We design and build high-performance websites, e-commerce stores, and digital experiences that turn visitors into customers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.8)}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-16 md:mb-20"
            >
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-display font-bold text-sm no-underline w-full sm:w-auto"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 10px 28px rgb(var(--brand) / 0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                Get a Quote
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </motion.a>
              <motion.a
                href="#work"
                onClick={(e) => { e.preventDefault(); document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" }); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-display font-bold text-sm no-underline w-full sm:w-auto"
                style={{
                  background: "var(--btn-secondary-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--btn-secondary-border)",
                  backdropFilter: "blur(6px)",
                }}
              >
                See Our Work
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(1.0)} className="flex items-center flex-wrap gap-y-4 justify-center sm:justify-start">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className={i === 0 ? "pr-6" : "px-6"}>
                    <div className="font-display font-black text-3xl" style={{ color: "var(--accent)" }}>{s.num}</div>
                    <div className="font-body text-xs tracking-wide mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-8" style={{ background: "var(--surface-border)" }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — service constellation (desktop only) */}
          <div
            className="hidden lg:block lg:col-span-5"
            aria-hidden="true"
          >
            <div className="relative w-full" style={{ height: "560px" }}>
              {/* Soft brand halo */}
              <div
                className="absolute inset-0 blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgb(var(--brand) / 0.22) 0%, rgba(0,0,0,0) 70%)",
                  opacity: 0.85,
                }}
              />

              {/* Concentric rings */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 560"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <radialGradient id="ring-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="200" cy="280" r="120" stroke="rgba(120,165,255,0.10)" strokeWidth="1" />
                <circle cx="200" cy="280" r="180" stroke="rgba(120,165,255,0.08)" strokeWidth="1" />
                <circle cx="200" cy="280" r="240" stroke="rgba(120,165,255,0.06)" strokeWidth="1" />
                <circle cx="200" cy="280" r="120" fill="url(#ring-grad)" />
              </svg>

              {/* Center monogram */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-3xl"
                style={{
                  width: 120,
                  height: 120,
                  background:
                    "radial-gradient(120% 120% at 30% 20%, rgb(var(--brand) / 0.25), rgb(var(--brand) / 0.08) 60%), rgba(10,16,28,0.85)",
                  border: "1px solid rgb(var(--brand) / 0.40)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.45), 0 0 60px rgb(var(--brand) / 0.35)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display font-black text-3xl leading-none" style={{ color: "#fff" }}>MI</span>
                  <span className="font-display font-black text-3xl leading-none" style={{ color: "var(--accent)" }}>.</span>
                </div>
              </motion.div>

              {/* Service capsules */}
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduced ? {} : { opacity: 0, y: 14, scale: 0.92 }}
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : {
                          opacity: 1,
                          y: [0, i % 2 === 0 ? -6 : 6, 0],
                          scale: 1,
                        }
                  }
                  transition={{
                    opacity: { duration: 0.6, ease: EASE, delay: 0.7 + s.delay },
                    scale: { duration: 0.6, ease: EASE, delay: 0.7 + s.delay },
                    y: reduced
                      ? {}
                      : { duration: 6 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: 1 + s.delay },
                  }}
                  className={`absolute font-display font-semibold tracking-wide rounded-full ${sizeMap[s.size]}`}
                  style={{
                    top: s.top,
                    left: s.left,
                    background: "rgba(14,22,38,0.78)",
                    color: "#fff",
                    border: "1px solid rgb(var(--brand) / 0.30)",
                    boxShadow:
                      "0 12px 28px rgba(0,0,0,0.40), 0 0 18px rgb(var(--brand) / 0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 0 10px rgb(var(--brand) / 0.85)",
                    }}
                  />
                  {s.label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        style={{ opacity: 0.5, color: "var(--accent)" }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </motion.div>
    </section>
  );
}
