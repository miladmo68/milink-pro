import { useRef, useState } from "react";

export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

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

        {/* Base + overlays */}
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
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="badge badge-primary badge-lg mb-4">
              Milink Studio
            </div>
            <h1 className="leading-tight">
              Build <span className="text-primary">luxury websites</span> that
              convert.
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Smooth scroll, premium effects, and performance-first.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="btn btn-primary">
                Get a Quote
              </a>
              <a href="#work" className="btn btn-ghost">
                See our work
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-box bg-base-200 p-4">95+ Lighthouse</div>
              <div className="rounded-box bg-base-200 p-4">AA A11y</div>
              <div className="rounded-box bg-base-200 p-4">SEO-Ready</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-base-200/60 shadow-2xl overflow-hidden">
              <img
                src="/assets/img/3.jpg"
                alt="Showcase"
                className="h-full w-full object-cover"
                loading="eager"
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
