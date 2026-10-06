"use client";

import { useId, useState } from "react";
import { faqs } from "../data/content.js";
import { Reveal } from "../components/scroll-reveal.jsx";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionId = useId();

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-base-100 py-24 dark:!bg-transparent">
      <div className="container">
        <Reveal from="up" distance={12}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">FAQ</p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base-content/68">
              Straight answers to common questions about working with Milink.
            </p>
            <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-[rgb(var(--brand)/0.9)] via-[rgb(var(--brand)/0.6)] to-[rgb(var(--brand)/0.9)]" />
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} from="up" distance={14} delay={i * 0.035}>
              <article className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/35 transition-colors duration-200 hover:border-primary/30 dark:bg-base-200/25">
                <h3>
                  <button
                    id={`${sectionId}-question-${i}`}
                    type="button"
                    onClick={() => setOpenIndex((current) => (current === i ? null : i))}
                    aria-expanded={openIndex === i}
                    aria-controls={`${sectionId}-answer-${i}`}
                    className="flex min-h-14 w-full items-center justify-between gap-5 px-5 py-4 text-left font-display text-base font-bold text-base-content outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-6"
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-base-content/15 text-primary transition-transform duration-200 ${openIndex === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`${sectionId}-answer-${i}`}
                  role="region"
                  aria-labelledby={`${sectionId}-question-${i}`}
                  aria-hidden={openIndex !== i}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-base-content/10 px-5 py-5 text-sm leading-7 text-base-content/70 sm:px-6">
                      {f.a}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
