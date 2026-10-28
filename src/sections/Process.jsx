"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";
import { work } from "../data/content.js";

const STEP_MS = 7000;
const EASE = [0.2, 0.8, 0.2, 1];

// The four steps keep their approved copy. `points` are the phrases of each
// description, shown as the checklist and inside the story on the right.
const STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We learn your business, your customers, and what the website needs to achieve.",
    points: ["Your business", "Your customers", "Your goals"],
    tint: "56 158 255",
  },
  {
    number: "02",
    title: "Design",
    description: "We shape the structure and visual direction, then refine it with your feedback.",
    points: ["Structure", "Visual direction", "Your feedback"],
    tint: "158 122 255",
  },
  {
    number: "03",
    title: "Build",
    description: "We develop a fast, mobile-first website with SEO foundations built in from day one.",
    points: ["Fast", "Mobile-first", "SEO built in"],
    tint: "77 235 168",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "We launch together, then stay available for updates, maintenance, and what comes next.",
    points: ["Launch together", "Updates", "Maintenance"],
    tint: "255 189 92",
  },
];

// One real project tells the whole story: it is the same site that appears in Work.
const PROJECT = work.find((item) => item.slug === "zarsa-gold");
const PROJECT_HOST = (() => {
  try {
    return new URL(PROJECT.liveUrl).host.replace(/^www\./, "");
  } catch {
    return "";
  }
})();

// Wireframe blocks, positioned to match the real page so the build "fills them in".
// Values are percentages of the page (left, top, width, height) and a corner radius in px.
const WIRE = [
  { k: "nav", l: 7.3, t: 2, w: 85.3, h: 8, r: 12 },
  { k: "logo", l: 8.8, t: 3.8, w: 2.5, h: 4.4, r: 99 },
  { k: "link", l: 42, t: 5.3, w: 5, h: 1.8, r: 4 },
  { k: "link", l: 50, t: 5.3, w: 5, h: 1.8, r: 4 },
  { k: "link", l: 57.5, t: 5.3, w: 5, h: 1.8, r: 4 },
  { k: "btn", l: 81.7, t: 3.6, w: 9.7, h: 5, r: 8, a: true },
  { k: "h", l: 7.3, t: 25, w: 40, h: 5.2, r: 6 },
  { k: "h", l: 7.3, t: 32.4, w: 32, h: 5.2, r: 6 },
  { k: "h", l: 7.3, t: 39.8, w: 17, h: 5.2, r: 6 },
  { k: "p", l: 7.3, t: 50, w: 38, h: 1.8, r: 4 },
  { k: "p", l: 7.3, t: 54, w: 36, h: 1.8, r: 4 },
  { k: "p", l: 7.3, t: 58, w: 22, h: 1.8, r: 4 },
  { k: "cta", l: 7.3, t: 63.7, w: 10.8, h: 5.9, r: 8, a: true },
  { k: "cta2", l: 19.25, t: 63.7, w: 14.2, h: 5.9, r: 8 },
  { k: "img", l: 51.4, t: 17.8, w: 41.4, h: 64, r: 16, a: true },
  { k: "title", l: 7.3, t: 93, w: 8, h: 3.2, r: 5 },
];

const CODE_LINES = [[34, 22, 18], [18, 40], [28, 14, 30], [12, 36, 20], [26, 18], [40, 24, 10], [20, 30]];

function Layer({ children, className = "", reduced, exit = true }) {
  return (
    <motion.div
      className={`pr-layer ${className}`}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={exit ? { opacity: 0, transition: { duration: reduced ? 0 : 0.25 } } : undefined}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A single browser that carries one real project from brief to live site. */
function Story({ active, reduced }) {
  const points = STEPS[active].points;
  const showWire = active === 1 || active === 2;
  const showReal = active >= 2;
  const tilt = (event) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--rx", (((event.clientX - rect.left) / rect.width - 0.5) * 2 * 5).toFixed(2));
    event.currentTarget.style.setProperty("--ry", (((event.clientY - rect.top) / rect.height - 0.5) * 2 * 4).toFixed(2));
  };
  const untilt = (event) => {
    event.currentTarget.style.setProperty("--rx", "0");
    event.currentTarget.style.setProperty("--ry", "0");
  };

  return (
    <div className="pr-visual" aria-hidden="true" onPointerMove={tilt} onPointerLeave={untilt}>
      <div className="pr-glow" />
      <div className="pr-site" data-step={active}>
        <div className="pr-site-bar">
          <span className="pr-dots"><i /><i /><i /></span>
          <span className="pr-url">
            <AnimatePresence mode="wait" initial={false}>
              {active === 3 ? (
                <motion.span key="host" className="pr-url-host" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }}>
                  <Lock size={10} />{PROJECT_HOST}
                </motion.span>
              ) : (
                <motion.span key="skel" className="pr-url-skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }} />
              )}
            </AnimatePresence>
          </span>
          <AnimatePresence>
            {active === 3 ? (
              <motion.span className="pr-live" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.5 }}>
                <b />Live
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="pr-site-body">
          {/* 01: the brief, as notes on an empty page */}
          <AnimatePresence>
            {active === 0 ? (
              <Layer className="pr-l-brief" reduced={reduced}>
                <div className="pr-rows">
                  {STEPS[0].points.map((text, i) => (
                    <div className="pr-row" key={text} style={{ "--i": i }}>
                      <span className="pr-tick"><Check size={13} strokeWidth={3} /></span>
                      <span className="pr-row-text">{text}</span>
                      <span className="pr-row-bar"><i /></span>
                    </div>
                  ))}
                </div>
                <span className="pr-scan" />
              </Layer>
            ) : null}
          </AnimatePresence>

          {/* 02 and 03: the wireframe, coloured in (already complete once building starts) */}
          <AnimatePresence>
            {showWire ? (
              <Layer className={`pr-l-wire ${active >= 2 ? "is-done" : ""}`} reduced={reduced}>
                {WIRE.map((item, i) => (
                  <i
                    key={i}
                    className={`pr-w pr-w-${item.k} ${item.a ? "is-accent" : ""}`}
                    style={{ left: `${item.l}%`, top: `${item.t}%`, width: `${item.w}%`, height: `${item.h}%`, borderRadius: item.r, "--i": i }}
                  />
                ))}
                <div className="pr-palette">{[0, 1, 2, 3].map((i) => <i key={i} style={{ "--i": i }} />)}</div>
              </Layer>
            ) : null}
          </AnimatePresence>

          {/* 03 and 04: the real site, revealed left to right as it is built */}
          {showReal ? (
            <motion.div
              key="real"
              className="pr-layer pr-l-real"
              initial={{ clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: reduced ? 0 : 3.2, ease: [0.65, 0, 0.35, 1], delay: reduced ? 0 : 0.35 }}
            >
              <Image src="/assets/work/zarsa-gold-cover.jpg" alt="" width={1200} height={675} sizes="(min-width: 1024px) 640px, 92vw" quality={70} />
            </motion.div>
          ) : null}
          {active === 2 ? <span className="pr-build-bar" /> : null}

          {/* 03: code typing in beside the page that is taking shape */}
          <AnimatePresence>
            {active === 2 ? (
              <Layer className="pr-l-code" reduced={reduced}>
                <div className="pr-code">
                  {CODE_LINES.map((segments, row) => (
                    <div className="pr-line" key={row} style={{ "--i": row, "--ind": row % 3 === 1 ? 1 : row % 3 === 2 ? 2 : 0 }}>
                      {segments.map((width, s) => <i key={s} style={{ "--w": `${width}%`, "--s": s }} />)}
                    </div>
                  ))}
                  <span className="pr-caret" />
                </div>
              </Layer>
            ) : null}
          </AnimatePresence>

          {/* 04: growth once it is live */}
          <AnimatePresence>
            {active === 3 ? (
              <Layer className="pr-l-growth" reduced={reduced}>
                <svg className="pr-chart" viewBox="0 0 200 84" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pr-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="currentColor" stopOpacity=".4" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="pr-area" d="M0 70 C30 66 44 58 66 54 S104 52 124 36 S168 16 200 6 L200 84 L0 84 Z" fill="url(#pr-area)" />
                  <path className="pr-curve" d="M0 70 C30 66 44 58 66 54 S104 52 124 36 S168 16 200 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                  <circle className="pr-dot" cx="200" cy="6" r="3.6" fill="currentColor" />
                </svg>
              </Layer>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="pr-chips" key={active}>
        {points.map((text, i) => (
          <span className="pr-chip" key={text} style={{ "--i": i }}>
            <Check size={12} strokeWidth={3} />{text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Process() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const panelRef = useRef(null);
  const tabRefs = useRef([]);
  const swipe = useRef(null);
  const running = auto && inView && !hover && !reduced;
  const step = STEPS[active];

  useEffect(() => {
    const element = panelRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The steps advance on their own until the visitor takes over.
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  const select = (index) => {
    setAuto(false);
    setActive(index);
  };

  // Phones: swipe the stage sideways to move between steps (vertical scroll is untouched).
  const onStageDown = (event) => {
    if (event.pointerType === "touch") swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onStageUp = (event) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || event.pointerType !== "touch") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    select(dx < 0 ? Math.min(STEPS.length - 1, active + 1) : Math.max(0, active - 1));
  };

  const onKeyDown = (event) => {
    const last = STEPS.length - 1;
    let next = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="process" className="relative scroll-mt-24 overflow-hidden bg-base-100 py-24 dark:!bg-transparent sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block" aria-hidden="true">
        <div className="section-depth-work" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:20px_20px]" />
        <div className="bg-orb bg-orb--top-right opacity-25" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left opacity-20" />
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-10">
        {/* Header: identical to every other section */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 border-primary/38 text-[10px] uppercase tracking-widest text-primary/90">How We Work</div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              A clear path from <span className="gradient-text">idea</span> to launch.
            </h2>
          </Reveal>
        </div>

        <Reveal from="up" distance={28} delay={0.1}>
          <div
            ref={panelRef}
            className={`pr-panel marketing-navy-surface bg-base-100 border border-base-300 card-surface ${running ? "is-running" : ""}`}
            style={{ "--pr-tint": step.tint, "--pr-ms": `${STEP_MS}ms` }}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setHover(true); }}
            onPointerLeave={(event) => { if (event.pointerType === "mouse") setHover(false); }}
          >
            <div className="pr-tabs" role="tablist" aria-label="Our process" onKeyDown={onKeyDown}>
              {STEPS.map((s, i) => (
                <button
                  key={s.number}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`pr-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="pr-stage"
                  tabIndex={i === active ? 0 : -1}
                  className={`pr-tab ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                  onClick={() => select(i)}
                >
                  <span className="pr-tab-num">{s.number}</span>
                  <span className="pr-tab-title">{s.title}</span>
                  <i className="pr-tab-bar" aria-hidden="true"><b /></i>
                </button>
              ))}
            </div>

            <div className="pr-stage" id="pr-stage" role="tabpanel" aria-labelledby={`pr-tab-${active}`} onPointerDown={onStageDown} onPointerUp={onStageUp} onPointerCancel={() => { swipe.current = null; }}>
              <div className="pr-copy" key={active}>
                <span className="pr-big" aria-hidden="true">{step.number}</span>
                <h3 className="pr-title">{step.title}</h3>
                <p className="pr-desc">{step.description}</p>
                <ul className="pr-points">
                  {step.points.map((point) => (
                    <li key={point}><span><Check size={13} strokeWidth={3} aria-hidden="true" /></span>{point}</li>
                  ))}
                </ul>
              </div>
              <Story active={active} reduced={reduced} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
