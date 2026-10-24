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

function HeroStats({ className = "", compact = false }) {
  const valueSize = compact ? "text-[22px] sm:text-[25px]" : "text-[26px] sm:text-[30px]";
  const labelSize = compact ? "text-[8px] sm:text-[9px]" : "text-[9px] sm:text-[10px]";
  return (
    <div className={`flex items-start justify-center ${compact ? "gap-4 sm:gap-5" : "gap-5 sm:gap-7"} ${className}`}>
      {STATS.map((s) => (
        <div key={s.label} className={`${compact ? "min-w-[48px]" : "min-w-[58px]"} text-left`}>
          {s.text ? (
            <span className={`block font-display ${valueSize} font-semibold leading-none tracking-[-0.04em]`} style={{ color: "var(--text-primary)" }}>
              {s.text}
            </span>
          ) : (
            <CountUp
              to={s.to}
              suffix={s.suffix}
              duration={1400}
              className={`block font-display ${valueSize} font-semibold leading-none tracking-[-0.04em]`}
              style={{ color: "var(--text-primary)" }}
            />
          )}
          <span className={`mt-1 block font-body ${labelSize} font-semibold uppercase tracking-[0.14em]`} style={{ color: "var(--text-secondary)" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroDevicePreview({ src, domain }) {
  return (
    <div className="overflow-hidden rounded-[15px] border border-white/15 bg-[#0a0f1e] shadow-[0_38px_88px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.05] px-3 py-2.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/35" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate rounded-md bg-white/[0.07] px-2 py-1 text-[8px] tracking-wide text-white/45">{domain}</span>
      </div>
      <img src={src} alt="" className="block w-full" />
    </div>
  );
}

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

  // The project stage gets the reference's very restrained depth response on
  // a mouse, while remaining perfectly static on touch and reduced motion.
  const moveHeroStage = (event) => {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--hero-stage-x",
      `${(((event.clientX - bounds.left) / bounds.width - 0.5) * 2).toFixed(3)}`,
    );
    event.currentTarget.style.setProperty(
      "--hero-stage-y",
      `${(((event.clientY - bounds.top) / bounds.height - 0.5) * 2).toFixed(3)}`,
    );
  };

  const resetHeroStage = (event) => {
    event.currentTarget.style.setProperty("--hero-stage-x", "0");
    event.currentTarget.style.setProperty("--hero-stage-y", "0");
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
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:gap-10 xl:gap-14">
          {/* Left column */}
          <div className="relative z-30 isolate mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
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
              className="mb-8 text-center font-display font-black lg:text-left"
              style={{ letterSpacing: "-0.03em", fontSize: "clamp(46px, 6.2vw, 92px)", lineHeight: 0.92 }}
            >
              <div className="flex justify-center gap-[0.22em] lg:justify-start">
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
              className="mx-auto mb-12 max-w-[680px] text-center font-body font-light lg:mx-0 lg:text-left"
              style={{ color: "var(--text-secondary)", fontSize: "clamp(17px, 1.55vw, 21px)", lineHeight: 1.65 }}
            >
              We design and build high-performance websites that turn visitors into customers — fast, beautiful and made to grow with your business.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.8)}
              className="mb-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
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

            {/* Small screens keep the proof points beneath the CTA stack. */}
            <motion.div {...fadeUp(1.0)} className="lg:hidden">
              <HeroStats />
            </motion.div>
          </div>

          {/* Desktop proof stage: three genuine projects, arranged like the supplied reference. */}
          <div className="relative z-0 mx-auto hidden w-full max-w-[680px] lg:block lg:translate-y-16 xl:translate-y-20">
          <motion.div {...fadeUp(0.55, 24)} className="relative">
            <div
              className="relative h-[470px] w-full xl:h-[520px]"
              style={{ perspective: "1800px", perspectiveOrigin: "50% 25%" }}
              onPointerMove={moveHeroStage}
              onPointerLeave={resetHeroStage}
            >
              <div
                className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-300 ease-out motion-reduce:transform-none"
                style={{ transform: "rotateY(calc(var(--hero-stage-x, 0) * 9deg)) rotateX(calc(var(--hero-stage-y, 0) * -5deg))" }}
              >
                <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: "rotateX(8deg)" }}>
                  <div
                    className="absolute -left-[1%] top-[18.33%] z-10 w-[38%] [transform-style:preserve-3d]"
                    style={{ transform: "rotateY(22deg) translateZ(-70px)" }}
                  >
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 72, scale: 0.92 }}
                      animate={reduced ? undefined : { opacity: 1, x: [0, 3, 0, -2, 0], y: [0, -14, 0], scale: 1 }}
                      transition={{ opacity: { duration: 0.8, delay: 0.75 }, scale: { duration: 0.8, delay: 0.75 }, x: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: -3 }, y: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: -3 } }}
                    >
                      <HeroDevicePreview src="/assets/img/kindsteps.png" domain="kindsteps.ca" />
                    </motion.div>
                  </div>

                  <div
                    className="absolute left-1/2 top-0 z-20 w-[57%] [transform-style:preserve-3d]"
                    style={{ transform: "translateX(-50%) translateZ(80px)" }}
                  >
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 72, scale: 0.92 }}
                      animate={reduced ? undefined : { opacity: 1, x: [0, -2, 0, 2, 0], y: [0, -14, 0], scale: 1 }}
                      transition={{ opacity: { duration: 0.8, delay: 0.45 }, scale: { duration: 0.8, delay: 0.45 }, x: { duration: 9, repeat: Infinity, ease: "easeInOut" }, y: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
                    >
                      <HeroDevicePreview src="/assets/img/fairconstruction.png" domain="fairconstruction-ca.vercel.app" />
                    </motion.div>
                  </div>

                  <div
                    className="absolute -right-[1%] top-[18.33%] z-10 w-[38%] [transform-style:preserve-3d]"
                    style={{ transform: "rotateY(-22deg) translateZ(-70px)" }}
                  >
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 72, scale: 0.92 }}
                      animate={reduced ? undefined : { opacity: 1, x: [0, -3, 0, 2, 0], y: [0, -14, 0], scale: 1 }}
                      transition={{ opacity: { duration: 0.8, delay: 0.9 }, scale: { duration: 0.8, delay: 0.9 }, x: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: -6 }, y: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: -6 } }}
                    >
                      <HeroDevicePreview src="/assets/img/pegstudio.png" domain="peg-studio-ten.vercel.app" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <motion.div
                className="pointer-events-none absolute left-[4%] top-[5%] z-30 flex items-center gap-1.5 rounded-[14px] border border-white/15 bg-[#0a0f1e]/75 py-1.5 pl-2 pr-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
                animate={reduced ? undefined : { y: [0, -6, 0], rotate: [0, 0.45, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: -2 }}
              >
                <span className="relative grid h-6 w-6 place-items-center rounded-full bg-[conic-gradient(#5AE6AA_0_95%,rgba(255,255,255,.12)_0)] text-[8px] font-bold text-white before:absolute before:inset-[3px] before:rounded-full before:bg-[#0a0f1e] before:content-['']"><b className="relative">95</b></span>
                <span className="grid gap-0.5"><b className="text-[9px] font-semibold text-white">Lighthouse</b><small className="text-[7px] font-normal text-white/60">Performance score</small></span>
              </motion.div>
              <motion.div
                className="pointer-events-none absolute right-[3%] top-0 z-30 flex items-center gap-1.5 rounded-[14px] border border-white/15 bg-[#0a0f1e]/75 py-1.5 pl-2 pr-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
                animate={reduced ? undefined : { y: [0, -6, 0], rotate: [0, 0.45, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: -5 }}
              >
                <span className="grid h-6 w-6 place-items-center rounded-[8px] bg-primary/25 text-white" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>
                </span>
                <span className="grid gap-0.5"><b className="text-[9px] font-semibold text-white">Mobile-first</b><small className="text-[7px] font-normal text-white/60">Every screen, every time</small></span>
              </motion.div>
              <motion.div
                className="pointer-events-none absolute bottom-[35.8%] left-[7%] z-30 flex items-center gap-1.5 rounded-[14px] border border-white/15 bg-[#0a0f1e]/75 py-1.5 pl-2 pr-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
                animate={reduced ? undefined : { y: [0, -6, 0], rotate: [0, 0.45, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: -7 }}
              >
                <span className="grid h-6 w-6 place-items-center rounded-[8px] bg-primary/25 text-white" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="6.5"/><path d="M20.5 20.5l-4.8-4.8"/></svg>
                </span>
                <span className="grid gap-0.5"><b className="text-[9px] font-semibold text-white">SEO-ready</b><small className="text-[7px] font-normal text-white/60">Built to be found</small></span>
              </motion.div>

              <div className="absolute left-1/2 top-[50%] z-30 -translate-x-1/2">
                <motion.div {...fadeUp(0.95, 16)}>
                  <motion.div
                    animate={reduced ? undefined : { y: [0, -5, 0], rotate: [0, 0.25, 0] }}
                    transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: -4 }}
                  >
                    <HeroStats compact />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
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
