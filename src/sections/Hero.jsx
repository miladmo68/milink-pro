import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  // ===== Motion variants =====
  const parent = {
    hidden: {},
    visible: { transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
  };
  const fromTop = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };
  const fromBottom = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const fadeInWithCTA = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
    },
  };
  const fromRight = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut", delay: 0.3 },
    },
  };

  return (
    <section id="home" className="relative z-0 bg-transparent">
      {/* ===== BACKGROUND STACK (pushed behind content) ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {!fallback && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFallback(true)}
            aria-hidden="true"
          />
        )}
        <div className="hero-plain hero-mask-90" aria-hidden="true" />
        <div className="hero-bleed hero-mask-90" aria-hidden="true" />
        <div className="hero-grid grid-fade hero-mask-90" aria-hidden="true" />
        <div
          className="hero-grid hero-grid-center hero-mask-90"
          aria-hidden="true"
        />
        <div className="hero-highlight hero-mask-90" aria-hidden="true" />
        <div className="hero-shadow hero-mask-90" aria-hidden="true" />
        <div className="hero-topfade" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
      </div>

      {/* ===== FOREGROUND CONTENT ===== */}
      <div className="relative z-10">
        <div className="container grid items-center gap-10 md:grid-cols-2 py-10 md:py-14">
          {/* Left column (UNCHANGED) */}
          <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left"
            variants={parent}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="badge badge-primary badge-lg mb-6"
              variants={fadeInWithCTA}
              whileHover={{ scale: 1.07 }}
            >
              Milink Digital Agency
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="leading-tight mb-5 md:mb-6"
              variants={fromTop}
            >
              Build <br className="block md:hidden" />
              <span className="text-primary">Your Digital</span>{" "}
              <br className="block md:hidden" />
              Presence
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              className="mt-1 md:mt-2 mb-8 md:mb-10 text-lg opacity-90 max-w-prose md:max-w-xl"
              variants={fromBottom}
            >
              Grow your business with high-performing websites, premium
              branding, and proven digital strategies that convert visitors into
              customers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              variants={fadeIn}
            >
              <a href="#contact" className="btn btn-primary">
                Get a Quote
              </a>
              <a href="#work" className="btn btn-ghost">
                See our work
              </a>
            </motion.div>

            {/* Inline stats */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
              variants={fadeIn}
            >
              <span className="rounded-box bg-base-200 px-4 py-2">
                Web Design
              </span>
              <span className="rounded-box bg-base-200 px-4 py-2">
                E-Commerce
              </span>
              <span className="rounded-box bg-base-200 px-4 py-2">
                SEO-Ready
              </span>
            </motion.div>
          </motion.div>

          {/* Right column (REPLACED) — Pure SVG device mock + UI (no assets) */}
          <MediaCardSVG onOpenLightbox={onOpenLightbox} variants={fromRight} />
        </div>
      </div>
    </section>
  );
}

/* ===================== */
/*      Media Card       */
/* ===================== */
function MediaCardSVG({ onOpenLightbox, variants }) {
  const svgRef = useRef(null);

  const handleExpand = () => {
    if (!onOpenLightbox || !svgRef.current) return;
    try {
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      onOpenLightbox(url);
    } catch (e) {
      // fallback: do nothing
    }
  };

  return (
    <motion.div
      className="relative flex justify-center md:justify-end my-6 md:my-8" // ★ اضافه شد
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="
          group relative
          w-full md:w-auto
          min-h-[280px] sm:min-h-[620px]
          aspect-[4/5]
          rounded-3xl overflow-hidden shadow-2xl bg-base-200/60
          max-w-none sm:max-w-sm md:max-w-md lg:max-w-lg
          ring-1 ring-base-content/10
        "
      >
        {/* Subtle background gradient + glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-200/80 via-base-200/30 to-primary/10" />
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,white,transparent)]">
          <div className="absolute inset-0 bg-primary/20 blur-3xl" />
        </div>

        {/* The SVG device + UI */}
        <svg
          ref={svgRef}
          viewBox="0 0 1200 1000"
          className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g-screen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(30,64,175,0.9)" />
              {/* indigo-700 */}
              <stop offset="1" stopColor="rgba(56,189,248,0.85)" />
              {/* sky-400 */}
            </linearGradient>
            <linearGradient id="g-frame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(148,163,184,0.7)" />
              {/* slate-400 */}
              <stop offset="1" stopColor="rgba(100,116,139,0.7)" />
              {/* slate-500 */}
            </linearGradient>
            <linearGradient id="g-accent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgb(59,130,246)" />
              {/* blue-500 */}
              <stop offset="1" stopColor="rgb(99,102,241)" />
              {/* indigo-500 */}
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {/* Laptop base (shadow) */}
          <ellipse
            cx="600"
            cy="880"
            rx="360"
            ry="45"
            fill="rgba(0,0,0,0.35)"
            filter="url(#soft)"
          />

          {/* Laptop frame */}
          <rect
            x="200"
            y="140"
            width="00"
            height="520"
            rx="28"
            fill="url(#g-frame)"
            opacity="0.85"
          />
          <rect
            x="220"
            y="160"
            width="760"
            height="480"
            rx="22"
            fill="url(#g-screen)"
          />
          {/* Screen gloss */}
          <rect
            x="220"
            y="160"
            width="760"
            height="480"
            rx="22"
            fill="white"
            opacity="0.05"
          />

          {/* Top bar tabs */}
          <g opacity="0.9">
            <rect
              x="250"
              y="185"
              width="120"
              height="36"
              rx="10"
              fill="rgba(15,23,42,0.5)"
            />
            <rect
              x="380"
              y="185"
              width="120"
              height="36"
              rx="10"
              fill="rgba(15,23,42,0.35)"
            />
            <rect
              x="510"
              y="185"
              width="120"
              height="36"
              rx="10"
              fill="rgba(15,23,42,0.25)"
            />
          </g>

          {/* Grid */}
          <g opacity="0.25">
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={"g" + i}
                x1="240"
                y1={220 + i * 42}
                x2="960"
                y2={220 + i * 42}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Line chart */}
          <polyline
            points="260,560 330,520 400,540 470,500 540,520 610,470 680,490 750,420 820,460 890,380"
            fill="none"
            stroke="url(#g-accent)"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {[
            [330, 520],
            [470, 500],
            [610, 470],
            [750, 420],
            [890, 380],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="10" fill="white" opacity="0.9" />
          ))}

          {/* Bars */}
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={780 + i * 26}
                y={460 - i * 20}
                width="18"
                height={120 + i * 20}
                rx="5"
                fill="rgba(255,255,255,0.9)"
              />
            ))}
          </g>

          {/* Side cards */}
          <g opacity="0.95">
            <rect
              x="250"
              y="610"
              width="170"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.6)"
            />
            <rect
              x="430"
              y="610"
              width="140"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.45)"
            />
            <rect
              x="580"
              y="610"
              width="160"
              height="70"
              rx="14"
              fill="rgba(15,23,42,0.35)"
            />
          </g>

          {/* Keyboard base */}
          <rect
            x="260"
            y="700"
            width="680"
            height="70"
            rx="14"
            fill="url(#g-frame)"
            opacity="0.95"
          />
          <rect
            x="270"
            y="710"
            width="660"
            height="50"
            rx="10"
            fill="rgba(0,0,0,0.25)"
          />
        </svg>

        {/* Overlay ring */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-primary/30" />

        {/* Expand button */}
        <button
          className="btn btn-sm btn-ghost absolute right-3 top-3"
          onClick={handleExpand}
          aria-label="Expand"
          title="Expand"
        >
          ⤢
        </button>
      </div>
    </motion.div>
  );
}
