"use client";

import { useId, useState } from "react";
import { faqs } from "../data/content.js";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";

// One panel with a row per question (the first one open), the same header
// pattern as every other section. Copy comes from `faqs` in content.js, which
// also feeds the FAQPage JSON-LD. Styles: the `.fq-*` block in globals.css.
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionId = useId();

  const spotlight = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative scroll-mt-24 overflow-hidden bg-base-100 py-24 dark:!bg-transparent">
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none hidden dark:block" offset={45}>
        <div className="section-depth-faq" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={30}>
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>
      <div className="container">
        <Reveal from="up" distance={12}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">FAQ</p>
            <h2 id="faq-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-base-content/68">
              Straight answers to common questions about working with Milink.
            </p>
          </div>
        </Reveal>

        <Reveal from="up" distance={20}>
          <div className="fq-panel marketing-navy-surface" onPointerMove={spotlight}>
            {faqs.map((f, i) => {
              const open = openIndex === i;
              return (
                <div key={f.q} className="fq-item" data-open={open}>
                  <h3>
                    <button
                      id={`${sectionId}-question-${i}`}
                      type="button"
                      className="fq-q"
                      aria-expanded={open}
                      aria-controls={`${sectionId}-answer-${i}`}
                      onClick={() => setOpenIndex((current) => (current === i ? null : i))}
                    >
                      <span>{f.q}</span>
                      <span className="fq-plus" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`${sectionId}-answer-${i}`}
                    role="region"
                    aria-labelledby={`${sectionId}-question-${i}`}
                    className="fq-a"
                  >
                    <div><p>{f.a}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
