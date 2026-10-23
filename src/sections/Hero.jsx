"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CountUp from "../components/CountUp.jsx";

const EASE = [0.25, 0.1, 0.25, 1];

const STATS = [
  { to: 50, suffix: "+", label: "Projects" },
  { to: 95, suffix: "+", label: "Lighthouse" },
  { text: "GTA", label: "Based" },
];

const HEADLINE_WORDS = ["converts.", "sells.", "ranks.", "lasts."];

const MARQUEE_ITEMS = [
  "Web Design",
  "E-Commerce",
  "SEO",
  "UI / UX",
  "Branding",
  "Performance",
  "Shopify",
  "WordPress",
  "Maintenance",
];

export default function Hero() {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const reduced = useReducedMotion();

  // Mirrors the reference site's hero-only magnetic CTA behavior. It is kept
  // off for touch, coarse-pointer, and reduced-motion users.
  const moveHeroCta = (event) => {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const x = event.clientX - (bounds.left + bounds.width / 2);
    const y = event.clientY - (bounds.top + bounds.height / 2);

    target.style.setProperty("--hero-cta-x", `${(x * 0.22).toFixed(1)}px`);
    target.style.setProperty("--hero-cta-y", `${(y * 0.32).toFixed(1)}px`);
  };

  const resetHeroCta = (event) => {
    event.currentTarget.style.setProperty("--hero-cta-x", "0px");
    event.currentTarget.style.setProperty("--hero-cta-y", "0px");
  };

  // This is a Hero background treatment, not a replacement for the native
  // cursor. It is intentionally desktop/fine-pointer only.
  const moveHeroGlow = (event) => {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty("--hero-glow-x", `${(event.clientX - bounds.left).toFixed(1)}px`);
    target.style.setProperty("--hero-glow-y", `${(event.clientY - bounds.top).toFixed(1)}px`);
    target.style.setProperty("--hero-glow-opacity", "1");
  };

  const resetHeroGlow = (event) => {
    event.currentTarget.style.setProperty("--hero-glow-opacity", "0");
  };

  useEffect(() => {
    if (videoRef.current?.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoReady(true);
    }
  }, []);

  // The Hero headline follows the reference's calm, full-word cycle. The
  // supporting sentence is deliberately static so the hierarchy stays clear.
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setWordIdx((i) => (i + 1) % HEADLINE_WORDS.length), 3000);
    return () => clearInterval(t);
  }, [reduced]);

  const fadeUp = (delay = 0, distance = 30) => ({
    // The root theme is resolved before paint, so the original entrance
    // motion can run without a light-to-dark flash on mobile.
    initial: reduced ? {} : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: reduced ? 0 : delay },
  });

  return (
    <section
      id="home"
      className="hero-pointer-glow relative z-0 bg-transparent min-h-screen flex flex-col justify-end lg:justify-center overflow-hidden"
      onPointerMove={moveHeroGlow}
      onPointerLeave={resetHeroGlow}
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
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 [object-position:60%_50%] sm:[object-position:center] ${videoReady ? "opacity-100" : "opacity-0"}`}
            src="/assets/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoReady(true)}
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
              "radial-gradient(35% 45% at 82% 35%, rgb(var(--brand) / 0.14) 0%, rgba(0,0,0,0) 70%)",
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
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 pt-24 pb-24 md:pb-32 lg:py-28 w-full">
        <div className="grid grid-cols-1 items-center">
          {/* Left column */}
          <div className="mx-auto max-w-5xl text-center">
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
              <span className="hero-availability-dot" aria-hidden="true" />
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
              aria-label="Build what converts, sells, ranks, and lasts."
              className="font-display font-black mb-8 text-center"
              style={{ letterSpacing: "-0.03em", fontSize: "clamp(46px, 9.5vw, 112px)", lineHeight: 0.92 }}
            >
              <div className="overflow-hidden flex gap-[0.22em] justify-center">
                {["Build", "what"].map((w, i) => (
                  <motion.span
                    key={w}
                    initial={reduced ? {} : { opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE, delay: reduced ? 0 : 0.3 + i * 0.09 }}
                  aria-hidden="true"
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
                  className="relative inline-flex overflow-hidden align-bottom"
                  aria-hidden="true"
                >
                  <span className="invisible">converts.</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={HEADLINE_WORDS[wordIdx]}
                      initial={reduced ? {} : { opacity: 0, y: "108%" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? {} : { opacity: 0, y: "-108%" }}
                      transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
                      className="hero-cycling-word absolute inset-x-0 top-0"
                    >
                      {HEADLINE_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </div>
            </h1>

            {/* Supporting copy remains stable while the headline cycles. */}
            <motion.p
              {...fadeUp(0.65)}
              className="font-body font-light text-[16px] max-w-[620px] mx-auto mb-12 text-center"
              style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}
            >
              We design and build high-performance websites that turn visitors into customers — fast, beautiful and made to grow with your business.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.8)}
              className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-3 mb-16 md:mb-20"
            >
              <div className="hero-cta-magnetic w-full sm:w-auto" onPointerMove={moveHeroCta} onPointerLeave={resetHeroCta}>
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="marketing-cta marketing-cta--primary w-full sm:w-auto"
                >
                  Get a Quote
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </motion.a>
              </div>
              <div className="hero-cta-magnetic w-full sm:w-auto" onPointerMove={moveHeroCta} onPointerLeave={resetHeroCta}>
                <motion.a
                  href="#work"
                  onClick={(e) => { e.preventDefault(); document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" }); }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="marketing-cta marketing-cta--secondary w-full sm:w-auto"
                >
                  See Our Work
                </motion.a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(1.0)} className="flex items-center flex-wrap gap-y-4 justify-center">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className={i === 0 ? "pr-6" : "px-6"}>
                    {s.text ? (
                      <span className="font-display font-black text-3xl block" style={{ color: "var(--accent)" }}>
                        {s.text}
                      </span>
                    ) : (
                      <CountUp
                        to={s.to}
                        suffix={s.suffix}
                        duration={1400 + i * 150}
                        className="font-display font-black text-3xl block"
                        style={{ color: "var(--accent)" }}
                      />
                    )}
                    <div className="font-body text-xs tracking-wide mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-8" style={{ background: "var(--surface-border)" }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — vertical editorial accent (desktop only) */}
          <div
            className="hidden"
            aria-hidden="true"
            style={{ minHeight: "440px" }}
          >
            {/* progress rail */}
            <div className="relative h-full flex items-center pr-2">
              <div className="relative w-px h-[360px]" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  initial={reduced ? { height: "60%" } : { height: 0 }}
                  animate={{ height: "60%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: reduced ? 0 : 0.7 }}
                  className="absolute top-0 left-0 w-px"
                  style={{
                    background: "linear-gradient(180deg, rgb(var(--brand)) 0%, rgb(var(--brand-accent)) 100%)",
                    boxShadow: "0 0 12px rgb(var(--brand) / 0.6)",
                  }}
                />
                <motion.span
                  initial={reduced ? { y: "60%", opacity: 1 } : { y: 0, opacity: 0 }}
                  animate={{ y: "60%", opacity: 1 }}
                  transition={{ duration: 1.4, ease: EASE, delay: reduced ? 0 : 0.7 }}
                  className="absolute -left-[3px] block w-[7px] h-[7px] rounded-full"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "0 0 14px rgb(var(--brand) / 0.85)",
                  }}
                />
              </div>
            </div>

            {/* vertical text */}
            <div className="flex items-center justify-center" style={{ width: "44px" }}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : 0.55 }}
                className="font-display font-bold uppercase text-[11px] tracking-[0.42em]"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  color: "var(--text-secondary)",
                }}
              >
                MILINK · Studio · Toronto · 2024 · ★
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom marquee ticker ===== */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t pointer-events-none"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background:
            "linear-gradient(180deg, rgba(7,12,22,0) 0%, rgba(7,12,22,0.55) 60%, rgba(7,12,22,0.78) 100%)",
        }}
        aria-hidden="true"
      >
        <motion.div
          className="flex whitespace-nowrap py-4"
          animate={reduced ? {} : { x: ["0%", "-50%"] }}
          transition={reduced ? {} : { duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 shrink-0">
              <span
                className="font-display font-black uppercase text-[15px] tracking-[0.22em]"
                style={{ color: "var(--text-primary)", opacity: 0.55 }}
              >
                {item}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent)", opacity: 0.85 }}>
                <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" />
              </svg>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        style={{ opacity: 0.45, color: "var(--accent)" }}
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
