"use client";

import { useEffect, useRef, useState } from "react";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Check, ChevronRight, RotateCcw } from "lucide-react";

import { services } from "../data/content.js";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";

// Six equal cards. Each has its own small animated picture of what the service
// does (CSS only, no library, running only while the grid is on screen), the
// approved copy from `services` in content.js, and an in-card "More details"
// that flips the card to the long description (button, so touch and keyboard
// work; a mouse leaving the card flips it back). Styles: the `.sv-*` block at the
// end of globals.css.

const ICONS = { CodeBracketIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, ShoppingCartIcon, WrenchScrewdriverIcon, PaintBrushIcon };

// One tint per service, "r g b".
const TINTS = {
  web: "56 158 255",
  ecom: "255 189 92",
  seo: "77 235 168",
  maint: "158 122 255",
  brand: "255 122 170",
  ux: "56 214 240",
};

const Dots = () => (
  <span className="sv-dots" aria-hidden="true"><i /><i /><i /></span>
);

function ArtWeb() {
  return (
    <div className="sv-art sv-web" aria-hidden="true">
      <div className="sv-win">
        <Dots />
        <div className="sv-hero"><b className="l1" /><b className="l2" /><u className="btn" /></div>
        <div className="sv-cols"><i /><i /><i /></div>
        <span className="sv-sweep" />
      </div>
      <svg className="sv-ring" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="21" className="trk" />
        <circle cx="26" cy="26" r="21" className="val" />
        <path d="M17.5 26.5l6 6 11-12" className="tick" />
      </svg>
    </div>
  );
}

function ArtShop() {
  return (
    <div className="sv-art sv-shop" aria-hidden="true">
      <div className="sv-prod">
        <div className="img"><span /></div>
        <b /><b className="s" />
        <u className="add" />
      </div>
      <div className="sv-cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h2l2.2 11h10.4L20 8H6.2" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" />
        </svg>
        <em />
      </div>
      <div className="sv-pay"><b /><b className="s" /><u><Check size={11} strokeWidth={3} /></u></div>
    </div>
  );
}

function ArtSearch() {
  return (
    <div className="sv-art sv-seo" aria-hidden="true">
      <div className="sv-find">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
        <b /><i />
      </div>
      <div className="sv-results">
        <div className="sv-res is-top"><span /><b /><b className="s" /></div>
        <div className="sv-res"><span /><b /><b className="s" /></div>
        <div className="sv-res is-low"><span /><b /><b className="s" /></div>
      </div>
    </div>
  );
}

const CARE_ROWS = ["Updates", "Backups", "Security"];
function ArtCare() {
  return (
    <div className="sv-art sv-care" aria-hidden="true">
      {CARE_ROWS.map((label, i) => (
        <div key={label} className="sv-row" style={{ "--i": i }}>
          <u><Check size={11} strokeWidth={3} /></u>
          <span>{label}</span>
          <b />
        </div>
      ))}
    </div>
  );
}

function ArtBrand() {
  return (
    <div className="sv-art sv-brand" aria-hidden="true">
      <div className="sv-mark"><i /><i /></div>
      <span className="sv-aa">Aa</span>
      <div className="sv-swatches"><i /><i /><i /><i /></div>
    </div>
  );
}

function ArtFlow() {
  return (
    <div className="sv-art sv-flow" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="sv-scr" style={{ "--i": i }}><b /><i /><i className="s" /></div>
      ))}
      <span className="sv-link-line a" /><span className="sv-link-line b" />
      <svg className="sv-cursor" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" /></svg>
    </div>
  );
}

const ART = { web: ArtWeb, ecom: ArtShop, seo: ArtSearch, maint: ArtCare, brand: ArtBrand, ux: ArtFlow };

function ServiceCard({ data, flipped, onFlip, onClose }) {
  const Icon = ICONS[data.icon] || CodeBracketIcon;
  const Art = ART[data.id];

  const spotlight = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <article
      className="sv-card"
      data-flipped={flipped}
      style={{ "--sv-tint": TINTS[data.id] || TINTS.web }}
      onPointerMove={spotlight}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") onClose(); }}
    >
      <div className="sv-flip">
        <div className="sv-face sv-front marketing-navy-surface">
          <div className="sv-visual">{Art ? <Art /> : null}</div>
          <div className="sv-body">
            <div className="sv-top">
              <span className="sv-icon"><Icon aria-hidden="true" /></span>
              {data.badge && <span className="sv-tag">{data.badge}</span>}
            </div>
            <h3 className="sv-title">{data.title}</h3>
            <p className="sv-desc">{data.desc}</p>
            {data.bullets?.length > 0 && (
              <ul className="sv-points">
                {data.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
            <div className="sv-more-wrap">
              <button type="button" className="sv-more" aria-expanded={flipped} onClick={onFlip}>
                More details
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="sv-face sv-back marketing-navy-surface" aria-label={`${data.title}, details`}>
          <div className="sv-back-body">
            <span className="sv-icon"><Icon aria-hidden="true" /></span>
            <h4 className="sv-back-title">{data.title}</h4>
            <p className="sv-long">{data.longDesc}</p>
            {data.bullets?.length > 0 && (
              <ul className="sv-points">
                {data.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
            <div className="sv-more-wrap">
              <button type="button" className="sv-more" onClick={onClose}>
                <RotateCcw size={14} aria-hidden="true" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const gridRef = useRef(null);
  const [flippedId, setFlippedId] = useState(null);

  // The little animations run only while the cards are on screen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      grid.dataset.live = entry.isIntersecting ? "true" : "false";
    }, { threshold: 0.1 });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-100 dark:!bg-transparent"
    >
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none hidden dark:block" offset={55}>
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
            <h2 id="services-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Our <span className="gradient-text">Services</span>
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05}>
            <p className="text-base-content/58 mt-4 text-sm tracking-[0.04em] max-w-sm mx-auto">Design • Build • Grow</p>
          </Reveal>
        </div>

        <div ref={gridRef} className="sv-grid">
          {services.map((service, i) => (
            <Reveal key={service.id} from="up" distance={24} delay={(i % 3) * 0.08}>
              <ServiceCard
                data={service}
                flipped={flippedId === service.id}
                onFlip={() => setFlippedId(service.id)}
                onClose={() => setFlippedId((current) => (current === service.id ? null : current))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
