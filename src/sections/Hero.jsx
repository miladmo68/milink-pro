"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];
const STATS = [
  { num: "50+", label: "Projects" },
  { num: "95+", label: "Lighthouse" },
  { num: "5★",  label: "Rating" },
];

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
    <section id="home" className="relative z-0 bg-transparent min-h-screen flex flex-col justify-end overflow-hidden">
      {/* ===== Original background ===== */}
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
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 pt-24 pb-20 md:pb-28 w-full">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0.2, 16)} className="flex items-center gap-3 mb-10">
          <div className="h-px w-8 rounded-full" style={{ background: "var(--accent)" }} />
          <span
            className="font-display font-bold uppercase tracking-[0.2em] text-[10px]"
            style={{ color: "var(--accent)" }}
          >
            Toronto Digital Agency · Est. 2024
          </span>
        </motion.div>

        {/* Title */}
        <h1
          className="font-display font-black mb-8 text-center sm:text-left"
          style={{ letterSpacing: "-0.03em", fontSize: "clamp(38px, 8vw, 84px)", lineHeight: 0.92 }}
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
              className="inline-block"
              style={{ color: "var(--accent)" }}
            >
              converts.
            </motion.span>
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.65)}
          className="font-body font-light text-[16px] max-w-[460px] mb-12"
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
            style={{ background: "var(--accent)", color: "#fff" }}
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
