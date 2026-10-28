"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CountUp from "../components/CountUp.jsx";
import HeroBackdrop from "../components/HeroBackdrop.jsx";

const SCENE_MS = 4200;

const STATS = [
  { to: 50, suffix: "+", label: "Projects" },
  { to: 95, suffix: "+", label: "Lighthouse" },
  { text: "GTA", label: "Based" },
];

// Each headline word drives the stage: a real MiLink project is "built" in the
// browser frame while a widget acts out the promise of that word. The tint
// colours the backdrop light and the stage rim for that scene.
const SCENES = [
  { word: "converts.", tag: "Lead capture", title: "Kind Steps", src: "/assets/work/kind-steps-cover.jpg", width: 1200, height: 675, widget: "inquiry", tint: [0.22, 0.62, 1] },
  { word: "sells.", tag: "E-commerce", title: "Zarsa Gold", src: "/assets/work/zarsa-gold-cover.jpg", width: 1200, height: 675, widget: "order", tint: [1, 0.74, 0.36] },
  { word: "ranks.", tag: "Search", title: "Fair Construction", src: "/assets/work/fair-construction-cover.jpg", width: 1200, height: 675, widget: "serp", tint: [0.3, 0.92, 0.66] },
  { word: "lasts.", tag: "Performance", title: "PEG Studio", src: "/assets/work/peg-studio-cover.jpg", width: 1200, height: 675, widget: "lighthouse", tint: [0.62, 0.48, 1] },
];

// Real clients from the Work section, shown as the Hero's social-proof row.
const CLIENTS = [
  "Kind Steps",
  "Fair Construction",
  "Zarsa Gold",
  "PEG Studio",
  "Intershine",
  "Sky Contracting",
  "Tarahan Choob",
];

const SCRAMBLE_GLYPHS = "abcdefghijklmnopqrstuvwxyz#%&*+=/<>";

const EASE = [0.2, 0.8, 0.2, 1];

function useCountTo(to, { duration = 1100, delay = 250 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    let start;
    const timer = window.setTimeout(() => {
      const tick = (now) => {
        start ??= now;
        const progress = Math.min(1, (now - start) / duration);
        setValue(to * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => { window.clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [to, duration, delay]);
  return value;
}

// The cycling word decodes into place, resolving left to right.
function ScrambleWord({ word, reduced }) {
  const [text, setText] = useState(word);
  const previous = useRef(word);

  useEffect(() => {
    if (reduced || previous.current === word) {
      previous.current = word;
      setText(word);
      return undefined;
    }
    previous.current = word;
    const start = performance.now();
    const duration = 700;
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const resolved = progress * word.length;
      let next = "";
      for (let i = 0; i < word.length; i++) {
        next += i < resolved || word[i] === "." ? word[i] : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
      }
      setText(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [word, reduced]);

  return (
    <span className="hero-cycling-word absolute inset-x-0 top-0">
      {text}
    </span>
  );
}

function HeroStats() {
  return (
    <div className="flex items-start justify-center gap-6 sm:gap-8 lg:justify-start">
      {STATS.map((s) => (
        <div key={s.label} className="min-w-[58px] text-left">
          {s.text ? (
            <span className="block font-display text-[26px] font-semibold leading-none tracking-[-0.04em] sm:text-[30px]" style={{ color: "var(--text-primary)" }}>
              {s.text}
            </span>
          ) : (
            <CountUp
              to={s.to}
              suffix={s.suffix}
              className="block font-display text-[26px] font-semibold leading-none tracking-[-0.04em] sm:text-[30px]"
              style={{ color: "var(--text-primary)" }}
            />
          )}
          <span className="mt-1 block font-body text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px]" style={{ color: "var(--text-secondary)" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ===== Stage widgets (illustrative) ===== */

function InquiryWidget() {
  const growth = useCountTo(38, { delay: 500 });
  const bars = [30, 42, 36, 55, 61, 74, 94];
  return (
    <>
      <div className="hero-widget-head">
        <span className="hero-widget-live" />
        New inquiry
        <time>just now</time>
      </div>
      <div className="hero-widget-person">
        <span className="hero-widget-avatar">SM</span>
        <span>
          <b>Sarah M.</b>
          <small>Requested a free consultation</small>
        </span>
      </div>
      <div className="hero-widget-rule" />
      <div className="hero-widget-meta">
        <span>Leads this month</span>
        <b className="text-[#5ae6aa]">+{Math.round(growth)}%</b>
      </div>
      <div className="hero-widget-bars">
        {bars.map((h, i) => (
          <motion.i
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: 0.35 + i * 0.07, ease: EASE }}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </>
  );
}

function OrderWidget() {
  const total = useCountTo(129, { delay: 350, duration: 1000 });
  return (
    <>
      <div className="hero-widget-head">
        <span className="hero-widget-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
        </span>
        New order
        <time>#1042</time>
      </div>
      <div className="hero-widget-amount">${total.toFixed(2)}</div>
      <svg className="hero-widget-spark" viewBox="0 0 200 54" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="hero-spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 46 L22 40 L44 43 L66 30 L88 34 L110 22 L132 26 L154 14 L176 16 L200 4 L200 54 L0 54 Z"
          fill="url(#hero-spark-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        />
        <motion.path
          d="M0 46 L22 40 L44 43 L66 30 L88 34 L110 22 L132 26 L154 14 L176 16 L200 4"
          fill="none"
          stroke="rgb(56 189 248)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        />
      </svg>
      <div className="hero-widget-foot">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        Payment confirmed
      </div>
    </>
  );
}

const SERP_QUERY = "contractor near me";

function SerpWidget() {
  const [typed, setTyped] = useState(0);
  const [climbed, setClimbed] = useState(false);
  useEffect(() => {
    const typer = window.setInterval(() => setTyped((n) => Math.min(SERP_QUERY.length, n + 1)), 38);
    const climb = window.setTimeout(() => setClimbed(true), 1500);
    return () => { window.clearInterval(typer); window.clearTimeout(climb); };
  }, []);
  const rows = climbed ? ["you", "a", "b"] : ["a", "b", "you"];
  return (
    <>
      <div className="hero-widget-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20.5 20.5-4.8-4.8" /></svg>
        <span>{SERP_QUERY.slice(0, typed)}<i className="hero-widget-caret" /></span>
      </div>
      <ul className="hero-widget-serp">
        {rows.map((row, i) => (
          <motion.li key={row} layout transition={{ type: "spring", stiffness: 260, damping: 26 }} className={row === "you" ? "is-you" : ""}>
            <em>{i + 1}</em>
            {row === "you" ? (
              <span>
                <b>Your website</b>
                <small>Fast, local, SEO-ready</small>
              </span>
            ) : (
              <span className="hero-widget-skeleton"><i /><i /></span>
            )}
            {row === "you" && climbed && (
              <motion.strong initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 }}>
                #1
              </motion.strong>
            )}
          </motion.li>
        ))}
      </ul>
    </>
  );
}

const LIGHTHOUSE = [
  { label: "Perf", value: 98 },
  { label: "A11y", value: 100 },
  { label: "Best", value: 100 },
  { label: "SEO", value: 100 },
];

function LighthouseRing({ label, value, index }) {
  const shown = useCountTo(value, { delay: 250 + index * 120, duration: 1000 });
  const circumference = 2 * Math.PI * 17;
  return (
    <div className="hero-widget-ring">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="17" className="hero-widget-ring-track" />
        <circle
          cx="20"
          cy="20"
          r="17"
          className="hero-widget-ring-fill"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
        />
      </svg>
      <b>{Math.round(shown)}</b>
      <small>{label}</small>
    </div>
  );
}

function LighthouseWidget() {
  return (
    <>
      <div className="hero-widget-head">
        <span className="hero-widget-live" />
        Lighthouse audit
        <time>mobile</time>
      </div>
      <div className="hero-widget-rings">
        {LIGHTHOUSE.map((item, i) => <LighthouseRing key={item.label} {...item} index={i} />)}
      </div>
      <div className="hero-widget-foot">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        Built to stay fast
      </div>
    </>
  );
}

const WIDGETS = { inquiry: InquiryWidget, order: OrderWidget, serp: SerpWidget, lighthouse: LighthouseWidget };

/* ===== Stage ===== */

function HeroStage({ scene, setScene, paused, reduced }) {
  const active = SCENES[scene];
  const Widget = WIDGETS[active.widget];

  // A restrained depth response for a mouse; static on touch and reduced motion.
  const tilt = (event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--hero-stage-x", (((event.clientX - bounds.left) / bounds.width - 0.5) * 2).toFixed(3));
    event.currentTarget.style.setProperty("--hero-stage-y", (((event.clientY - bounds.top) / bounds.height - 0.5) * 2).toFixed(3));
  };
  const untilt = (event) => {
    event.currentTarget.style.setProperty("--hero-stage-x", "0");
    event.currentTarget.style.setProperty("--hero-stage-y", "0");
  };

  return (
    <div className="hero-land relative mx-auto w-full max-w-[640px]" style={{ "--d": "0.55s" }} role="group" aria-label="Selected MiLink projects">
      <div className="hero-stage" onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="hero-stage-rig">
          <div className="hero-stage-glow" aria-hidden="true" />

          <div className="hero-browser">
            <div className="hero-browser-bar" aria-hidden="true">
              <span className="hero-browser-dots"><i /><i /><i /></span>
              <span className="hero-browser-url">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {active.title} <em>· built by MiLink</em>
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div className="hero-browser-view">
              {SCENES.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={i === scene ? `${s.title} website designed by MiLink` : ""}
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 92vw"
                  quality={60}
                  priority={i === 0}
                  className={`hero-browser-shot ${i === scene ? "is-active" : ""}`}
                />
              ))}

              {/* Wireframe → design: each scene is "built" as the wireframe wipes away. */}
              {!reduced && (
                <motion.div
                  key={`wire-${scene}`}
                  className="hero-wireframe"
                  aria-hidden="true"
                  initial={{ clipPath: "inset(0 0% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 100%)" }}
                  transition={{ duration: 1, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
                >
                  <div className="hero-wireframe-nav"><i /><i /><i /><i /></div>
                  <div className="hero-wireframe-hero"><i /><i /><i /><b /></div>
                  <div className="hero-wireframe-cards"><i /><i /><i /></div>
                </motion.div>
              )}
              {!reduced && (
                <motion.div
                  key={`scan-${scene}`}
                  className="hero-scanline"
                  aria-hidden="true"
                  initial={{ left: "0%", opacity: 1 }}
                  animate={{ left: "100%", opacity: [1, 1, 0] }}
                  transition={{ duration: 1, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
            </div>
          </div>

          <div className="hero-widget-slot" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.widget}
                className="hero-widget"
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.94, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -12, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.22 } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Widget />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="hero-scenes">
        {SCENES.map((s, i) => (
          <button
            key={s.word}
            type="button"
            onClick={() => setScene(i)}
            aria-pressed={i === scene}
            aria-label={`Show ${s.title}: ${s.tag}`}
            className={`hero-scene ${i === scene ? "is-active" : ""} ${paused ? "is-paused" : ""}`}
            style={{ "--scene-ms": `${SCENE_MS}ms` }}
          >
            <span className="hero-scene-bar"><i key={`${scene}-${i}`} /></span>
            <span className="hero-scene-label">{s.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const paused = Boolean(reduced) || !inView || !tabVisible;
  const tint = SCENES[scene].tint;

  // Scroll exit: copy and stage ease back while the Hero leaves the viewport.
  useEffect(() => {
    if (reduced) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, section.offsetHeight)));
      section.style.setProperty("--hero-exit", progress.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

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

  // The scene only advances while the Hero is on screen and the tab is visible.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setTimeout(() => setScene((i) => (i + 1) % SCENES.length), SCENE_MS);
    return () => window.clearTimeout(timer);
  }, [scene, paused]);

  const scrollToId = (event, id) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative z-0 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-transparent"
      style={{ "--hero-tint": tint.map((c) => Math.round(c * 255)).join(" ") }}
    >
      {/* ===== Background: depth field + Blueprint Horizon shader ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="section-depth-hero pointer-events-none absolute inset-0 hidden dark:block" aria-hidden />
        <HeroBackdrop className="absolute inset-0" tint={tint} pulseKey={scene} pulseDelay={1250} />
        <div className="hero-topfade" aria-hidden="true" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto w-full max-w-8xl px-4 pb-28 pt-28 sm:px-6 lg:pb-[max(4.5rem,9vh)] lg:pt-[max(6.5rem,12vh)]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.95fr)] lg:gap-10 xl:gap-16">
          {/* Left column */}
          <div className="hero-exit-copy relative z-30 mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div
              className="hero-rise mb-10 inline-flex items-center lg:mb-[3.2vh] gap-2.5 rounded-full px-3.5 py-1.5"
              style={{
                "--d": "0.05s",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <span className="hero-availability-dot" aria-hidden="true" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--text-secondary)" }}>
                Available for new projects
              </span>
              <span className="hidden h-2.5 w-px sm:inline" style={{ background: "var(--surface-border)", opacity: 0.6 }} />
              <span className="hidden font-display text-[10px] font-bold uppercase tracking-[0.18em] sm:inline" style={{ color: "var(--accent)" }}>
                Toronto · Est. 2024
              </span>
            </div>

            {/* Title: CSS line reveal starts at first paint, before hydration. */}
            <h1
              aria-label="Build what converts, sells, ranks, and lasts."
              className="mb-8 text-center font-display font-black lg:mb-[3.2vh] lg:text-left"
              style={{ letterSpacing: "-0.03em", fontSize: "clamp(46px, min(6.2vw, 9.4vh), 92px)", lineHeight: 0.98 }}
            >
              <span className="hero-line" aria-hidden="true">
                <span style={{ "--d": "0.12s", color: "var(--text-primary)" }}>Build what</span>
              </span>
              <span className="hero-line" aria-hidden="true">
                <span style={{ "--d": "0.24s" }} className="hero-word-slot">
                  <span className="invisible">converts.</span>
                  <ScrambleWord word={SCENES[scene].word} reduced={reduced} />
                </span>
              </span>
            </h1>

            <p
              className="hero-rise mx-auto mb-12 max-w-[640px] lg:mb-[4.2vh] text-center font-body font-light lg:mx-0 lg:text-left"
              style={{ "--d": "0.4s", color: "var(--text-secondary)", fontSize: "clamp(16px, min(1.55vw, 2.5vh), 21px)", lineHeight: 1.65 }}
            >
              We design and build high-performance websites that turn visitors into customers — fast, beautiful and made to grow with your business.
            </p>

            <div
              className="hero-rise mb-12 flex flex-col gap-3 lg:mb-[4.2vh] sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
              style={{ "--d": "0.52s" }}
            >
              <div className="hero-cta-magnetic w-full sm:w-auto" onPointerMove={moveHeroCta} onPointerLeave={resetHeroCta}>
                <motion.a
                  href="#contact"
                  onClick={(e) => scrollToId(e, "#contact")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="marketing-cta marketing-cta--primary w-full sm:w-auto"
                >
                  Get a Quote
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </motion.a>
              </div>
              <div className="hero-cta-magnetic w-full sm:w-auto" onPointerMove={moveHeroCta} onPointerLeave={resetHeroCta}>
                <motion.a
                  href="#work"
                  onClick={(e) => scrollToId(e, "#work")}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="marketing-cta marketing-cta--secondary w-full sm:w-auto"
                >
                  See Our Work
                </motion.a>
              </div>
            </div>

            <div className="hero-rise" style={{ "--d": "0.64s" }}>
              <HeroStats />
            </div>
          </div>

          {/* Right column: the live build stage */}
          <div className="hero-exit-stage">
            <HeroStage scene={scene} setScene={setScene} paused={paused} reduced={reduced} />
          </div>
        </div>
      </div>

      {/* ===== Social proof: real clients ===== */}
      <div
        className="hero-proof absolute bottom-0 left-0 right-0 z-10 flex items-center border-t"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "linear-gradient(180deg, rgba(7,12,22,0) 0%, rgba(7,12,22,0.5) 60%, rgba(7,12,22,0.72) 100%)",
        }}
      >
        <p className="sr-only">Trusted by {CLIENTS.join(", ")}</p>
        <span className="hero-proof-label" aria-hidden="true">Trusted by GTA businesses</span>
        <div className="hero-proof-viewport" aria-hidden="true">
          <div className="hero-marquee-track flex whitespace-nowrap py-4">
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span key={i} className="hero-proof-item">
                {client}
                <i />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
