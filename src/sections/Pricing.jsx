"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Minus } from "lucide-react";
import { pricing, pricingCompare } from "../data/content.js";
import { whatsappLinks } from "../config/business.js";
import { openWhatsApp } from "../lib/whatsapp.js";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";
import Button from "../components/ui/Button.jsx";

// Three packages, one clearly recommended. Desktop shows all three side by side
// (Professional lifted, with a light that travels its border); phones show one
// at a time behind a three-way switch so nobody scrolls three tall cards. A
// collapsed comparison table (progressive disclosure) and a "not sure" strip
// finish the section. Copy and prices come from `pricing` / `pricingCompare`
// in content.js; styles are the `.pk-*` block at the end of globals.css.

// The owner wants the entry package (lowest price) open first on phones.
const DEFAULT_MOBILE = Math.max(0, pricing.findIndex((plan) => plan.name === "Essential"));

function Cell({ value }) {
  if (value === true) return <Check className="pk-yes" size={16} aria-label="Included" />;
  if (value === false) return <Minus className="pk-no" size={16} aria-label="Not included" />;
  return value;
}

export default function Pricing() {
  const gridRef = useRef(null);
  const [mobile, setMobile] = useState(DEFAULT_MOBILE);
  const [compare, setCompare] = useState(false);
  const whatsapp = whatsappLinks();

  // The travelling border animates only while the cards are on screen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      grid.dataset.live = entry.isIntersecting ? "true" : "false";
    }, { threshold: 0.2 });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const spotlight = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-100 dark:!bg-transparent"
    >
      <ScrollParallax className="pointer-events-none absolute inset-0 -z-10" offset={70}>
        <div className="section-depth-pricing" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:18px_18px]" />
        <div className="absolute inset-x-0 top-[-120px] h-[340px] blur-3xl opacity-30 dark:opacity-[0.34] bg-gradient-to-r from-[rgb(var(--brand)/0.32)] via-[rgb(var(--brand)/0.14)] to-[rgb(var(--brand)/0.32)]" />
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Our Packages</div>
          </Reveal>
          <h2 id="pricing-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="gradient-text">Pricing</span> &amp; Packages
          </h2>
          <p className="mt-4 text-base-content/68 max-w-sm mx-auto">
            Choose what fits now—upgrade any time as you grow.
          </p>
        </div>

        <div className="pk-switch" role="group" aria-label="Choose a package">
          {pricing.map((plan, i) => (
            <button key={plan.name} type="button" aria-pressed={mobile === i} onClick={() => setMobile(i)}>
              {plan.name.split(" & ")[0]}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="pk-grid">
          {pricing.map((plan, i) => {
            const pro = !!plan.popular;
            const note = plan.scopeNote || plan.quoteDetail;
            const [mainName, suffix] = plan.name.split(/ (?=&)/);
            return (
              <div key={plan.name} className="pk-slot" data-active={mobile === i}>
                <Reveal from="up" distance={24} delay={i * 0.08} className="h-full">
                  <article
                    className={`pk-card marketing-navy-surface${pro ? " pk-card--pro" : ""}`}
                    onPointerMove={spotlight}
                  >
                    {pro && <span className="pk-chip">{plan.badge || "Most Popular"}</span>}
                    {plan.mobileBadge && <span className="pk-chip pk-chip--m">{plan.mobileBadge}</span>}
                    <h3 className="pk-name">
                      {mainName}
                      {suffix ? <span className="pk-name-sub"> {suffix}</span> : null}
                    </h3>
                    <p className="pk-tagline">{plan.tagline}</p>

                    <div className="pk-price">
                      {plan.startingPrice ? (
                        <>
                          <span className="pk-price-label">Starting from</span>
                          <p className="pk-figure" aria-label={`Starting from ${plan.startingPrice} ${plan.priceCurrency}`}>
                            {plan.startingPrice}<small>{plan.priceCurrency}</small>
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="pk-price-label">Flexible pricing</span>
                          <p className="pk-figure pk-figure--text">{plan.quoteTitle}</p>
                        </>
                      )}
                      <p className="pk-note">{note || " "}</p>
                    </div>

                    <ul className="pk-list">
                      {plan.items.map((item) => (
                        <li key={item}>
                          <span className="pk-tick"><Check size={12} aria-hidden="true" /></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {[pro ? null : "d", pro ? "p" : "m"].filter(Boolean).map((kind) => (
                      <Button
                        key={kind}
                        href={`/?package=${encodeURIComponent(plan.name)}#contact`}
                        variant={kind === "d" ? "secondary" : "primary"}
                        size="block"
                        arrow
                        className={`pk-cta pk-cta--${kind}`}
                      >
                        Get a Quote
                      </Button>
                    ))}
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>

        <div className="pk-compare">
          <button
            type="button"
            className="pk-compare-toggle"
            aria-expanded={compare}
            aria-controls="pk-compare-table"
            onClick={() => setCompare((open) => !open)}
          >
            {compare ? "Hide comparison" : "Compare packages"}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          <div className="pk-compare-body" data-open={compare}>
            <div id="pk-compare-table">
              <div className="pk-table-wrap">
                <table className="pk-table">
                  <caption className="sr-only">Package comparison</caption>
                  <thead>
                    <tr>
                      <th scope="col"><span className="sr-only">Feature</span></th>
                      {pricing.map((plan) => (
                        <th key={plan.name} scope="col" className={plan.popular ? "is-pro" : ""}>
                          {plan.name.split(" & ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingCompare.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        {row.values.map((value, i) => (
                          <td key={i} className={pricing[i].popular ? "is-pro" : ""}><Cell value={value} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Reveal from="up" distance={14}>
          <div className="pk-help">
            <p>
              <strong>Not sure which one fits?</strong>
              <span> Tell us about your project and we&apos;ll point you to the right package.</span>
            </p>
            <div className="pk-help-actions">
              <Button href="/#contact" size="compact" arrow>Tell us about it</Button>
              <Button
                href={whatsapp.web}
                variant="secondary"
                size="compact"
                external
                onClick={openWhatsApp}
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
