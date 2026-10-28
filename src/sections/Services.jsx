import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

import { services } from "../data/content.js";
import {
  Reveal,
  REVEAL_EASE,
  REVEAL_DURATION_IN,
  REVEAL_AMOUNT,
  REVEAL_MARGIN,
} from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";

/* ===== Brand palette — values driven by CSS vars in globals.css ===== */
const BRAND = {
  accent: "rgb(var(--brand-soft))",
};

// Services has one dark card surface by design. Keeping it as a direct value
// (rather than inheriting a general-purpose card token) prevents different
// rows or the flipped face from picking up a separate charcoal gradient.
const DARK_CARD_SURFACE = "#0B1429";

/* ===== Light palette ===== */
const BRAND_LIGHT = {
  baseFrom: "#ffffff",
  baseVia: "#f5f7ff",
  baseTo: "#eef3ff",
  text: "var(--text-primary)",
  textMuted: "var(--text-secondary)",
  ring: "rgb(var(--brand-soft) / 0.22)",
  shadow: "0 10px 28px rgba(2, 6, 23, 0.10)",
};

/* ===== Icons map ===== */
const iconMap = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
};

/* ===== Motion variants — fade-up to mirror fairconstruction's universal data-aos="fade-up" ===== */
const itemVariants = {
  // Keep the card surface fully opaque at every reveal state. A fading parent
  // blends its card fill with the blue section behind it, making rows appear
  // to have different colours while they enter the viewport.
  hidden: { opacity: 1, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_IN, ease: REVEAL_EASE },
  },
};

function InOutItem({ children, index = 0, delayStep = 0.08 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: REVEAL_AMOUNT, margin: REVEAL_MARGIN });

  const variants = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : itemVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variants}
      transition={{
        duration: reduced ? 0 : REVEAL_DURATION_IN,
        ease: REVEAL_EASE,
        delay: reduced ? 0 : index * delayStep,
      }}
      className={reduced ? undefined : "will-change-transform"}
    >
      {children}
    </motion.div>
  );
}

/* ===== FlippyInteractive ===== */
function FlippyInteractive({ front, back, title, className = "" }) {
  const [flipped, setFlipped] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setFlipped((value) => !value);
  };

  return (
    <div
      className={`services-card relative ${className}`}
      style={{ perspective: "1200px", WebkitPerspective: "1200px", borderRadius: "28px" }}
      tabIndex={0}
      role="button"
      aria-expanded={flipped}
      aria-label={`${title}. Press Enter or Space to show or hide details.`}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((value) => !value)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--service-x", `${event.clientX - bounds.left}px`);
        event.currentTarget.style.setProperty("--service-y", `${event.clientY - bounds.top}px`);
      }}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: REVEAL_EASE }}
        className="relative w-full h-full rounded-[28px]"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(0)",
            WebkitTransform: "rotateY(0deg) translateZ(0)",
          }}
        >
          {front}
        </div>

        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(0.1px)",
            WebkitTransform: "rotateY(180deg) translateZ(0.1px)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

/* ===== ServiceCard ===== */
function ServiceCard({ data, isLight }) {
  const Icon = iconMap[data.icon] || CodeBracketIcon;
  const cardBackground = isLight
    ? `linear-gradient(170deg, ${BRAND_LIGHT.baseTo} 0%, ${BRAND_LIGHT.baseFrom} 100%)`
    : DARK_CARD_SURFACE;

  const bodyRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = bodyRef.current;
      if (el) setNeedsScroll(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    if (bodyRef.current) ro.observe(bodyRef.current);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  /* ========= FRONT: Dark same / Light readable ========= */
  const frontTextClass = isLight ? "text-slate-900" : "text-slate-100";
  const frontDescStyle = {
    color: isLight ? BRAND_LIGHT.textMuted : "rgba(241,245,249,0.80)",
  };

  const Front = (
    <article
      className={`service-card__front relative h-full rounded-[28px] p-[34px_32px_32px] ${frontTextClass}`}
      aria-label={`${data.title} front`}
      style={{
        background: cardBackground,
        boxShadow: isLight
          ? `0 0 0 1px ${BRAND_LIGHT.ring}, ${BRAND_LIGHT.shadow}`
          : undefined,
      }}
    >
      <div className="relative z-[1] flex h-full flex-col items-start text-left">
        <div className="service-card__top">
          <div className="service-card__icon" style={isLight ? { color: "rgb(var(--brand-accent))" } : undefined}>
            <Icon aria-hidden="true" />
          </div>
          {data.badge && <span className="service-card__tag">{data.badge}</span>}
        </div>
        <h3 className="service-card__title">{data.title}</h3>
        <p className="service-card__description" style={frontDescStyle}>
          {data.desc}
        </p>

        {data.bullets?.length > 0 && (
          <ul className="service-card__points mt-auto w-full">
            {data.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}

        <span className="service-card__more" aria-hidden="true">
          More details <span>↗</span>
        </span>
      </div>
    </article>
  );

  /* ========= BACK: already theme-friendly ========= */
  const Back = (
    <article
      className="service-card__back relative h-full rounded-[28px] bg-base-100/95 text-base-content backdrop-blur border border-base-300 dark:!border-0 dark:!bg-transparent"
      aria-label={`${data.title} back`}
      style={{
        background: cardBackground,
        boxShadow: `0 0 0 1px rgb(var(--brand-soft) / 0.20) inset, 0 12px 40px rgba(0,0,0,0.50)`,
      }}
    >
      <div className="flex h-full flex-col">
        <div className="px-7 pt-7 text-center">
          <h4
            className="text-[1.2rem] leading-6 font-semibold tracking-wide"
            style={{ color: BRAND.accent }}
          >
            {data.title}
          </h4>
        </div>

        <div
          ref={bodyRef}
          className={`grow px-7 mt-2 pb-7 ${
            needsScroll
              ? "overflow-y-auto overscroll-contain"
              : "overflow-hidden"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          <p className="text-base-content/82">
            {data.longDesc ||
              "We keep it simple and reliable — so you can trust us to get it done right."}
          </p>

          {data.bullets?.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm text-base-content/90">
              {data.bullets.map((b, i) => (
                <li key={i}>— {b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <FlippyInteractive
      className="h-[500px] sm:h-[480px] md:h-[480px]"
      title={data.title}
      front={Front}
      back={Back}
    />
  );
}

/* ===== Services Section ===== */
export default function Services() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const el = document.documentElement;

    const compute = () => {
      const t = el.getAttribute("data-theme") || "";
      const lightNames = new Set([
        "light",
        "corporate",
        "winter",
        "cupcake",
        "bumblebee",
        "emerald",
      ]);
      setIsLight(lightNames.has(t));
    };

    compute();

    const obs = new MutationObserver(() => compute());
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-100 dark:!bg-transparent"
    >
      <ScrollParallax
        className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
        offset={55}
      >
        <div className="section-depth-services" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={30}>
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[160px] -z-10 bg-gradient-to-b from-black/[0.11] to-transparent dark:from-black/[0.50]" aria-hidden />
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">What We Build</div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Our <span className="gradient-text">Services</span>
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05}>
            <p className="text-base-content/58 mt-4 text-sm tracking-[0.04em] max-w-sm mx-auto">Design • Build • Grow</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <InOutItem key={s.id} index={i}>
              <ServiceCard data={s} isLight={isLight} />
            </InOutItem>
          ))}
        </div>
      </div>
    </section>
  );
}
