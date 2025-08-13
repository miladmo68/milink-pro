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

  return (
    <section id="home" className="relative bg-transparent">
      {/* ===== BACKGROUND STACK ===== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
      <div className="relative z-10 h-full">
        <div className="container h-full grid md:grid-cols-2 gap-8 items-center py-8 md:py-10">
          <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left"
            variants={parent}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="badge badge-primary badge-lg mb-4"
              variants={fadeInWithCTA}
              whileHover={{
                scale: 1.07,
                boxShadow:
                  "0 0 25px rgba(255,255,255,0.5), 0 0 40px rgba(0,112,255,0.6)",
              }}
            >
              Milink Agency
            </motion.div>

            {/* Heading with mobile-only line breaks */}
            <motion.h1 className="leading-tight" variants={fromTop}>
              Build
              <br className="block md:hidden" />
              <span className="text-primary">Your Digital</span>
              <br className="block md:hidden" /> Presence
            </motion.h1>

            {/* Paragraph */}
            <motion.p className="mt-4 text-lg opacity-90" variants={fromBottom}>
              Grow your business with high-performing websites, premium
              branding, and proven digital strategies that convert visitors into
              customers.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-6 flex flex-col sm:flex-row gap-3"
              variants={fadeIn}
            >
              <a href="#contact" className="btn btn-primary">
                Get a Quote
              </a>
              <a href="#work" className="btn btn-ghost">
                See our work
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-8 grid grid-cols-3 gap-3 text-center text-sm"
              variants={fadeIn}
            >
              <div className="rounded-box bg-base-200 p-4">Web Design</div>
              <div className="rounded-box bg-base-200 p-4">
                Website Maintenance
              </div>
              <div className="rounded-box bg-base-200 p-4">E-Commerce</div>
            </motion.div>
          </motion.div>

          {/* ===== Image Section ===== */}
          <div className="relative flex justify-center md:justify-end">
            <div className="aspect-[4/5] max-w-xs sm:max-w-sm rounded-3xl bg-base-200/60 shadow-2xl overflow-hidden">
              <img
                src="/assets/img/3.jpg"
                alt="Showcase"
                className="h-full w-full object-cover"
                loading="eager"
                style={{
                  borderRadius: "1.5rem",
                  filter: "brightness(0.95) contrast(0.95)", // matte effect
                }}
              />
              <button
                className="btn btn-sm btn-ghost absolute right-3 top-3"
                onClick={() => onOpenLightbox?.("/assets/img/3.jpg")}
                aria-label="Expand"
              >
                ⤢
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
