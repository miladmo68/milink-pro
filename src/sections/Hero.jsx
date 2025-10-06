import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===========================
   Hero Section (Left-aligned text + Smooth SVG Slider)
=========================== */
export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  // ===== Motion variants (نرم و ملایم) =====
  const parent = {
    hidden: {},
    visible: { transition: { delayChildren: 0.25, staggerChildren: 0.18 } },
  };
  const fromTop = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const fromBottom = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const fadeInWithCTA = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.6 },
    },
  };
  const fromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.25 },
    },
  };

  // اسلایدها (تیتر/ساب‌تایتل مرتبط)
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
      {/* ===== Background Stack ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {!fallback ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [object-position:30%_50%]     
            sm:[object-position:center] "
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
        <div className="container grid items-center gap-10 md:grid-cols-2 py-10 md:py-14">
          {/* Left — به حالت قبلی برگشت: left-aligned در دسکتاپ */}
          <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left"
            variants={parent}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="badge badge-primary badge-lg mb-6"
              variants={fadeInWithCTA}
              whileHover={{ scale: 1.06 }}
            >
              Milink Digital Agency
            </motion.div>

            <motion.h1
              className="leading-tight mb-5 md:mb-6"
              variants={fromTop}
            >
              Build <br className="block md:hidden" />
              <span className="text-primary">Your Digital</span>{" "}
              <br className="block md:hidden" />
              Presence
            </motion.h1>

            <motion.p
              className="mt-1 md:mt-2 mb-8 md:mb-10 text-lg opacity-90 max-w-prose md:max-w-xl"
              variants={fromBottom}
            >
              High-performing websites, premium branding, and digital strategies
              that convert visitors into customers.
            </motion.p>

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

          {/* Right — Slider (SVG) */}
          <div className="hidden md:block">
            <MediaSlider
              slides={slides}
              onOpenLightbox={onOpenLightbox}
              variants={fromRight}
              autoPlay
              interval={3500} // ← کوتاه‌تر و استاندارد
            />
          </div>
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
  variants,
  autoPlay = true,
  interval = 3500,
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // ---- فقط تغییرِ مربوط به تایمر (setTimeout به جای setInterval)
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const goTo = useCallback(
    (i) => {
      setDirection(i > index ? 1 : -1);
      setIndex(() => {
        const ni = (i + slides.length) % slides.length;
        return ni;
      });
      scheduleNext(); // بعد از هر ناوبری (اتومات/دستی) تایمر از نو تنظیم شود
    },
    // scheduleNext پایین تعریف شده؛ eslint ممکنه اخطارِ ترتیب بده، ولی در runtime مشکلی نیست
    // چون هر سه تابع در یک render تعریف می‌شوند.
    // اگر strict بخواهی: می‌توانیم nextRef بسازیم. فعلاً ساده نگه می‌داریم.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, slides.length]
  );

  const next = useCallback(
    () => goTo((index + 1) % slides.length),
    [index, slides.length, goTo]
  );
  const prev = useCallback(
    () => goTo((index - 1 + slides.length) % slides.length),
    [index, slides.length, goTo]
  );

  const scheduleNext = useCallback(() => {
    if (!autoPlay) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      next(); // بعد از interval فقط یک‌بار جلو بره
    }, interval);
  }, [autoPlay, interval, next]);

  useEffect(() => {
    scheduleNext();
    return () => clearTimer();
  }, [scheduleNext]);

  const pause = () => clearTimer();
  const resume = () => scheduleNext();

  // انیمیشن ورود/خروج — ملایم
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: "easeOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.55, ease: "easeIn" },
    }),
  };

  return (
    <motion.div
      className="relative flex justify-center md:justify-end my-6 md:my-8"
      variants={variants}
      initial="hidden"
      animate="visible"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        className="
          relative
          w-full md:w-auto
          min-h-[280px] sm:min-h-[620px]
          aspect-[4/5]
          rounded-3xl overflow-hidden shadow-2xl bg-base-200/60
          max-w-none sm:max-w-sm md:max-w-md lg:max-w-lg
          ring-1 ring-base-content/10
        "
      >
        {/* gradient & glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-200/80 via-base-200/30 to-primary/10" />
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,white,transparent)]">
          <div className="absolute inset-0 bg-primary/20 blur-3xl" />
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

        {/* ring */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-primary/30" />

        {/* controls */}
        <button
          className="btn btn-sm btn-ghost absolute left-2 top-1/2 -translate-y-1/2"
          onClick={prev}
          aria-label="Previous"
          title="Previous"
        >
          ‹
        </button>
        <button
          className="btn btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2"
          onClick={next}
          aria-label="Next"
          title="Next"
        >
          ›
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2.5 bg-base-content/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              title={`Slide ${i + 1}`}
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

  // پالت رنگ
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
      {/* متنِ داخل قاب — دقیقاً وسط‌چین */}
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

        {/* محتوای مرتبط هر اسلاید */}
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
            {/* services cards */}
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
            {/* product grid */}
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
