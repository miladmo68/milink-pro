"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, REVEAL_EASE } from "../components/scroll-reveal.jsx";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We learn your business, your customers, and what the website needs to achieve.",
  },
  {
    number: "02",
    title: "Design",
    description: "We shape the structure and visual direction, then refine it with your feedback.",
  },
  {
    number: "03",
    title: "Build",
    description: "We develop a fast, mobile-first website with SEO foundations built in from day one.",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "We launch together, then stay available for updates, maintenance, and what comes next.",
  },
];

function ProcessStep({ step, index }) {
  const reduced = useReducedMotion();

  return (
    <Reveal from="up" distance={26} delay={0.1 + index * 0.1} className="h-full">
      <motion.article
        className="group relative h-full px-0 pt-8 sm:px-7 sm:pt-10 xl:px-8"
        whileHover={reduced ? undefined : { y: -5 }}
        transition={{ duration: 0.35, ease: REVEAL_EASE }}
      >
        <motion.span
          className="block font-display text-[72px] font-semibold leading-none tracking-[-0.07em] sm:text-[84px] lg:text-[88px]"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgb(var(--brand-soft) / 0.78)",
            textShadow: "0 0 26px rgb(var(--brand) / 0.08)",
          }}
          whileHover={reduced ? undefined : { color: "rgb(var(--brand-soft))", textShadow: "0 0 30px rgb(var(--brand) / 0.28)" }}
          transition={{ duration: 0.45, ease: REVEAL_EASE }}
        >
          {step.number}
        </motion.span>
        <h3 className="mt-5 font-display text-[26px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[28px]" style={{ color: "var(--text-primary)" }}>
          {step.title}
        </h3>
        <p className="mt-3 max-w-[28ch] font-body text-[15px] leading-7" style={{ color: "var(--text-secondary)" }}>
          {step.description}
        </p>
      </motion.article>
    </Reveal>
  );
}

function stepBorderClass(index) {
  return [
    index > 0 && "border-t",
    (index === 1 || index === 3) && "sm:border-l sm:border-t-0",
    (index === 2 || index === 3) && "sm:border-t",
    index > 0 && "xl:border-l xl:border-t-0",
  ].filter(Boolean).join(" ");
}

export default function Process() {
  const reduced = useReducedMotion();

  return (
    <section id="process" className="relative scroll-mt-24 overflow-hidden bg-base-100 py-24 dark:!bg-transparent sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block" aria-hidden="true">
        <div className="section-depth-work" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:20px_20px]" />
        <div className="bg-orb bg-orb--top-right opacity-25" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left opacity-20" />
      </div>
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 border-primary/38 text-[10px] uppercase tracking-widest text-primary/90">
              How We Work
            </div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl md:text-6xl" style={{ color: "var(--text-primary)" }}>
              A clear path from <span className="gradient-text">idea</span> to launch.
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-14 border-t" style={{ borderColor: "var(--surface-border)" }}>
          <motion.div
            className="absolute left-0 top-[-1px] h-px w-full origin-left bg-gradient-to-r from-primary via-[#8fb6ff] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 1.15, ease: REVEAL_EASE, delay: reduced ? 0 : 0.1 }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`min-w-0 ${stepBorderClass(index)}`}
                style={{ borderColor: "var(--surface-border)" }}
              >
                <ProcessStep step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
