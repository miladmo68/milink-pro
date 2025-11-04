import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===========================
   Hero Section (revised)
   - fade-in-up + repeat on scroll (viewport trigger)
   - soft ease, smoother duration
=========================== */
export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  /* ===== Variants ===== */
  const parent = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 1, 0.5, 1], // نرم‌تر
        delay,
      },
    }),
  };

  const fadeInRow = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1], delay },
    }),
  };

  const fromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.25 },
    },
  };

  /* ===== Slides ===== */
  const slides = [
    {
      type: "web",
      title: "Web Design",
      subtitle: "Landing • Sections • Motion",
    },
    {
      type: "shop",
      title: "E-Commerce",
      subtitle: "Catalog • Price • Checkout",
    },
    { type: "seo", title: "SEO & Analytics", subtitle: "SERP • KPIs • Growth" },
    {
      type: "brand",
      title: "Branding",
      subtitle: "Monogram • Palette • Patterns",
    },
  ];

  return (
    <section id="home" className="relative z-0 bg-transparent">
      {/* ===== Background ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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
        <div
          className="hero-grid hero-grid-center hero-mask-90"
          aria-hidden="true"
        />
        <div className="hero-highlight hero-mask-90" aria-hidden="true" />
        <div className="hero-shadow hero-mask-90" aria-hidden="true" />
        <div className="hero-topfade" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
      </div>

      {/* ===== Foreground ===== */}
      <div className="relative z-10">
        <div className="container grid items-center gap-10 md:grid-cols-2 py-24 md:py-14">
          {/* Left text / CTA */}
          <motion.div
            className="flex flex-col mt-12 md:mt-0 items-center text-center md:items-start md:text-left"
            variants={parent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
          >
            <motion.div
              className="badge badge-primary badge-lg mb-6"
              variants={fadeUp}
              custom={0.2}
              whileHover={{ scale: 1.06 }}
            >
              Milink Digital Agency
            </motion.div>

            <motion.h1
              className="leading-tight mb-5 md:mb-6"
              variants={fadeUp}
              custom={0.4}
            >
              Build <br className="block md:hidden" />
              <span className="text-primary">Your Digital</span>{" "}
              <br className="block md:hidden" />
              Presence
            </motion.h1>

            <motion.p
              className="mt-1 md:mt-2 mb-8 md:mb-10 text-lg opacity-90 max-w-prose md:max-w-xl"
              variants={fadeUp}
              custom={0.6}
            >
              High-performing websites, premium branding, and digital strategies
              that convert visitors into customers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              variants={fadeUp}
              custom={0.8}
            >
              <a
                href="#contact"
                className="
                  inline-flex items-center justify-center
                  px-5 py-3 rounded-full font-semibold leading-none
                  border-2 text-white bg-white/15 backdrop-blur-md
                  transition hover:-translate-y-[3px] hover:scale-[1.03]
                  shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]
                  border-white/40 ring-1 ring-[rgba(0,96,255,0.35)]
                "
                style={{
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.75), 0 0 30px rgba(0,96,255,0.45)",
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(0,96,255,0.28) 0%, rgba(0,0,0,0) 70%), rgba(0,96,255,0.22)",
                  borderColor: "rgba(0,96,255,0.5)",
                }}
              >
                Get a Quote
              </a>

              <a
                href="#work"
                className="
                  inline-flex items-center justify-center
                  px-5 py-3 rounded-full font-semibold leading-none
                  border-2 border-white/40 text-white
                  bg-white/12 backdrop-blur-md
                  transition hover:-translate-y-[3px] hover:scale-[1.03]
                  shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]
                "
              >
                See our work
              </a>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-[12px] sm:text-[13px] flex-nowrap whitespace-nowrap"
              variants={fadeInRow}
              custom={1.0}
            >
              <span className="shrink-0 rounded-box bg-base-200 px-2.5 py-1">
                Web Design
              </span>
              <span className="shrink-0 rounded-box bg-base-200 px-2.5 py-1">
                E-Commerce
              </span>
              <span className="shrink-0 rounded-box bg-base-200 px-2.5 py-1">
                SEO-Ready
              </span>
            </motion.div>
          </motion.div>

          {/* Right side — Slider */}
          <motion.div
            className="hidden md:block"
            variants={fromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <MediaSlider
              slides={slides}
              onOpenLightbox={onOpenLightbox}
              autoPlay
              interval={3500}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =======================
   Media Slider Component
======================= */
function MediaSlider({
  slides,
  onOpenLightbox,
  autoPlay = true,
  interval = 3500,
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const timerRef = useRef(null);
  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const scheduleNext = useCallback(() => {
    if (!autoPlay) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
  }, [autoPlay, interval, slides.length]);

  const goTo = useCallback(
    (i) => {
      setDirection(i > index ? 1 : -1);
      setIndex(() => (i + slides.length) % slides.length);
      scheduleNext();
    },
    [index, slides.length, scheduleNext]
  );

  const next = useCallback(
    () => goTo((index + 1) % slides.length),
    [index, slides.length, goTo]
  );
  const prev = useCallback(
    () => goTo((index - 1 + slides.length) % slides.length),
    [index, slides.length, goTo]
  );

  useEffect(() => {
    scheduleNext();
    return () => clearTimer();
  }, [scheduleNext]);

  const pause = () => clearTimer();
  const resume = () => scheduleNext();

  const slideVariants = {
    enter: (dir) => ({ y: dir > 0 ? 30 : -30, opacity: 0 }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (dir) => ({
      y: dir > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    }),
  };

  return (
    <motion.div
      className="relative flex justify-center md:justify-end my-6 md:my-8"
      onMouseEnter={pause}
      onMouseLeave={resume}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.4 }}
    >
      <div
        className="
          relative w-full md:w-auto min-h-[280px] sm:min-h-[620px]
          aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-base-200/60
          max-w-none sm:max-w-sm md:max-w-md lg:max-w-lg
          ring-1 ring-base-content/10
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-base-200/80 via-base-200/30 to-[rgba(0,96,255,0.15)]" />
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,white,transparent)]">
          <div className="absolute inset-0 bg-[rgba(0,96,255,0.25)] blur-3xl" />
        </div>

        {/* slide */}
        <div className="absolute inset-0">
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <MediaCardSVG
                type={slides[index].type}
                title={slides[index].title}
                subtitle={slides[index].subtitle}
                onOpenLightbox={onOpenLightbox}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ring + controls + dots */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-[rgba(0,96,255,0.35)]" />
        <button
          className="btn btn-sm btn-ghost absolute left-2 top-1/2 -translate-y-1/2"
          onClick={prev}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="btn btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2"
          onClick={next}
          aria-label="Next"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[rgb(0,96,255)]"
                  : "w-2.5 bg-base-content/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   Media Card (SVG) — متن داخل قاب «وسط‌چین»
   type: 'web' | 'shop' | 'seo' | 'brand'
========================================== */
function MediaCardSVG({ onOpenLightbox, type = "web", title, subtitle }) {
  const svgRef = useRef(null);

  const handleExpand = () => {
    if (!onOpenLightbox || !svgRef.current) return;
    try {
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      onOpenLightbox(url);
    } catch {}
  };

  // پالت رنگ (همون قبلی)
  const palettes = {
    web: {
      screen: ["#1e293bE6", "#38bdf8D9"],
      frame: ["#94a3b8B3", "#64748bB3"],
      accent: ["#0ea5e9", "#22d3ee"],
    },
    shop: {
      screen: ["#064e3bE6", "#34d399D9"],
      frame: ["#a7f3d0B3", "#10b981B3"],
      accent: ["#059669", "#34d399"],
    },
    seo: {
      screen: ["#311b0bE6", "#fb923cD9"],
      frame: ["#fed7aaB3", "#fb923cB3"],
      accent: ["#f97316", "#fde68a"],
    },
    brand: {
      screen: ["#3b0764E6", "#c084f5D9"],
      frame: ["#c4b5fdB3", "#a78bfaB3"],
      accent: ["#8b5cf6", "#d946ef"],
    },
  };
  const pal = palettes[type] ?? palettes.web;

  return (
    <div className="w-full h-full relative">
      {/* متن داخل قاب — وسط‌چین */}
      {(title || subtitle) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center">
          <div className="badge badge-outline">{title}</div>
          {subtitle && (
            <div className="mt-1 text-xs opacity-80">{subtitle}</div>
          )}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 1200 1000"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`g-screen-${type}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={pal.screen[0]} />
            <stop offset="1" stopColor={pal.screen[1]} />
          </linearGradient>
          <linearGradient id={`g-frame-${type}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={pal.frame[0]} />
            <stop offset="1" stopColor={pal.frame[1]} />
          </linearGradient>
          <linearGradient id={`g-accent-${type}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={pal.accent[0]} />
            <stop offset="1" stopColor={pal.accent[1]} />
          </linearGradient>
          <filter
            id={`soft-${type}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* سایه پایه */}
        <ellipse
          cx="600"
          cy="880"
          rx="360"
          ry="45"
          fill="rgba(0,0,0,0.35)"
          filter={`url(#soft-${type})`}
        />

        {/* قاب و نمایشگر */}
        <rect
          x="200"
          y="140"
          width="800"
          height="520"
          rx="28"
          fill={`url(#g-frame-${type})`}
          opacity="0.85"
        />
        <rect
          x="220"
          y="160"
          width="760"
          height="480"
          rx="22"
          fill={`url(#g-screen-${type})`}
        />
        <rect
          x="220"
          y="160"
          width="760"
          height="480"
          rx="22"
          fill="white"
          opacity="0.05"
        />

        {/* تب‌ها */}
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

        {/* محتوای هر اسلاید */}
        {type === "web" && (
          <>
            {/* header */}
            <rect
              x="240"
              y="220"
              width="700"
              height="60"
              rx="12"
              fill="rgba(255,255,255,0.95)"
            />
            {/* logo & nav */}
            <rect
              x="255"
              y="238"
              width="90"
              height="24"
              rx="6"
              fill="rgba(0,0,0,0.22)"
            />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={360 + i * 90}
                y="238"
                width="70"
                height="24"
                rx="8"
                fill="rgba(0,0,0,0.12)"
              />
            ))}
            {/* hero */}
            <rect
              x="240"
              y="290"
              width="700"
              height="160"
              rx="16"
              fill="rgba(255,255,255,0.95)"
            />
            <rect
              x="260"
              y="308"
              width="280"
              height="22"
              rx="11"
              fill={`url(#g-accent-${type})`}
            />
            <rect
              x="260"
              y="338"
              width="360"
              height="12"
              rx="6"
              fill="rgba(0,0,0,0.18)"
            />
            <rect
              x="260"
              y="358"
              width="300"
              height="12"
              rx="6"
              fill="rgba(0,0,0,0.10)"
            />
            {/* CTAs */}
            <rect
              x="260"
              y="382"
              width="120"
              height="28"
              rx="14"
              fill={`url(#g-accent-${type})`}
            />
            <rect
              x="390"
              y="382"
              width="110"
              height="28"
              rx="14"
              fill="rgba(0,0,0,0.15)"
            />
            {/* cards */}
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={240 + i * 235}
                y="470"
                width="210"
                height="160"
                rx="18"
                fill="rgba(255,255,255,0.92)"
              />
            ))}
          </>
        )}

        {type === "shop" && (
          <>
            {/* filters/search */}
            <rect
              x="240"
              y="220"
              width="700"
              height="48"
              rx="12"
              fill="rgba(255,255,255,0.95)"
            />
            <rect
              x="255"
              y="232"
              width="220"
              height="24"
              rx="8"
              fill="rgba(0,0,0,0.12)"
            />
            <rect
              x="485"
              y="232"
              width="120"
              height="24"
              rx="8"
              fill="rgba(0,0,0,0.08)"
            />
            {/* grid */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <g key={`${row}-${col}`}>
                  <rect
                    x={240 + col * 230}
                    y={280 + row * 160}
                    width="210"
                    height="150"
                    rx="16"
                    fill="rgba(255,255,255,0.95)"
                  />
                  <rect
                    x={255 + col * 230}
                    y={295 + row * 160}
                    width="180"
                    height="78"
                    rx="12"
                    fill="rgba(0,0,0,0.08)"
                  />
                  {/* price & CTA */}
                  <rect
                    x={255 + col * 230}
                    y={378 + row * 160}
                    width="70"
                    height="16"
                    rx="8"
                    fill="rgba(0,0,0,0.22)"
                  />
                  <rect
                    x={330 + col * 230}
                    y={376 + row * 160}
                    width="90"
                    height="22"
                    rx="11"
                    fill={`url(#g-accent-${type})`}
                  />
                </g>
              ))
            )}
            {/* cart sidebar */}
            <rect
              x="780"
              y="280"
              width="160"
              height="320"
              rx="16"
              fill="rgba(0,0,0,0.35)"
            />
            <rect
              x="795"
              y="300"
              width="130"
              height="26"
              rx="8"
              fill="white"
              opacity="0.95"
            />
            <rect
              x="795"
              y="332"
              width="130"
              height="140"
              rx="10"
              fill="white"
              opacity="0.88"
            />
            <rect
              x="795"
              y="478"
              width="130"
              height="30"
              rx="10"
              fill={`url(#g-accent-${type})`}
            />
          </>
        )}

        {type === "seo" && (
          <>
            {/* KPI ribbon */}
            <rect
              x="240"
              y="220"
              width="700"
              height="70"
              rx="14"
              fill="rgba(255,255,255,0.95)"
            />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={255 + i * 170}
                y="238"
                width="140"
                height="36"
                rx="10"
                fill="rgba(0,0,0,0.08)"
              />
            ))}
            {/* SERP snippet */}
            <rect
              x="240"
              y="300"
              width="700"
              height="90"
              rx="12"
              fill="rgba(255,255,255,0.96)"
            />
            <rect
              x="260"
              y="320"
              width="320"
              height="16"
              rx="8"
              fill={`url(#g-accent-${type})`}
            />
            <rect
              x="260"
              y="342"
              width="460"
              height="12"
              rx="6"
              fill="rgba(0,0,0,0.18)"
            />
            {/* bars */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={280 + i * 90}
                y={540 - i * 35}
                width="60"
                height={210 + i * 35}
                rx="8"
                fill="rgba(255,255,255,0.92)"
              />
            ))}
            {/* growth line */}
            <polyline
              points="260,560 360,520 460,490 560,470 660,430 760,400 860,360"
              fill="none"
              stroke={`url(#g-accent-${type})`}
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}

        {type === "brand" && (
          <>
            {/* brandbook header */}
            <rect
              x="240"
              y="220"
              width="700"
              height="60"
              rx="14"
              fill="rgba(255,255,255,0.95)"
            />
            <rect
              x="255"
              y="238"
              width="180"
              height="22"
              rx="8"
              fill="rgba(0,0,0,0.12)"
            />
            {/* pattern panel */}
            <rect
              x="240"
              y="290"
              width="700"
              height="340"
              rx="18"
              fill="rgba(255,255,255,0.08)"
            />
            {/* monogram M */}
            <circle cx="360" cy="360" r="42" fill="white" opacity="0.95" />
            <path
              d="M340,375 L340,345 L352,360 L364,345 L364,375"
              stroke={`url(#g-accent-${type})`}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* typelock + palette */}
            <rect
              x="420"
              y="340"
              width="180"
              height="16"
              rx="8"
              fill="white"
              opacity="0.95"
            />
            <rect
              x="420"
              y="362"
              width="120"
              height="12"
              rx="6"
              fill="rgba(0,0,0,0.15)"
            />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={420 + i * 46}
                y="392"
                width="36"
                height="20"
                rx="6"
                fill={i % 2 === 0 ? pal.accent[0] : pal.accent[1]}
                opacity="0.95"
              />
            ))}
            {/* logo tiles */}
            {[0, 1].map((row) =>
              [0, 1, 2].map((col) => (
                <g key={`${row}-${col}`}>
                  <rect
                    x={270 + col * 220}
                    y={430 + row * 140}
                    width="200"
                    height="120"
                    rx="16"
                    fill="rgba(255,255,255,0.92)"
                  />
                  <circle
                    cx={330 + col * 220}
                    cy={470 + row * 140}
                    r="18"
                    fill={`url(#g-accent-${type})`}
                    opacity="0.9"
                  />
                  <rect
                    x={355 + col * 220}
                    y={458 + row * 140}
                    width="90"
                    height="12"
                    rx="6"
                    fill="rgba(0,0,0,0.25)"
                  />
                  <rect
                    x={355 + col * 220}
                    y={476 + row * 140}
                    width="70"
                    height="10"
                    rx="5"
                    fill="rgba(0,0,0,0.12)"
                  />
                </g>
              ))
            )}
          </>
        )}

        {/* کیبورد/پایه */}
        <rect
          x="260"
          y="700"
          width="680"
          height="70"
          rx="14"
          fill={`url(#g-frame-${type})`}
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

      {/* expand */}
      <button
        className="btn btn-sm btn-ghost absolute right-3 top-3"
        onClick={handleExpand}
        aria-label="Expand"
        title="Expand"
      >
        ⤢
      </button>
    </div>
  );
}
