import { useRef, useState } from "react";

export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-[100svh] md:min-h-[100dvh] bg-transparent"
    >
      {/* ===== BACKGROUND STACK ===== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!fallback ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/video/hero.mp4"
            poster="/assets/img/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFallback(true)}
            aria-hidden="true"
          />
        ) : (
          <img
            src="/assets/img/hero-poster.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
        )}

        {/* Base + overlays (همون افکت‌هایی که قبلاً ساختیم) */}
        <div className="hero-plain hero-mask-90" aria-hidden="true" />
        <div className="hero-bleed hero-mask-90" aria-hidden="true" />
        <div className="hero-grid grid-fade hero-mask-90" aria-hidden="true" />
        <div
          className="hero-grid-soft grid-fade hero-mask-90"
          aria-hidden="true"
        />
        <div className="hero-highlight hero-mask-90" aria-hidden="true" />
        <div className="hero-shadow hero-mask-90" aria-hidden="true" />
        <div className="hero-topfade" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
      </div>

      {/* ===== FOREGROUND CONTENT (وسط‌چین عمودی تمام‌قد) ===== */}
      <div className="relative z-10 h-full">
        <div className="container h-full grid md:grid-cols-2 gap-8 items-center py-8 md:py-10">
          <div>
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
                src="https://images.unsplash.com/photo-1524666041070-9d87656c25bb?q=80&w=1200&auto=format&fit=crop"
                alt="Showcase"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <button
                className="btn btn-sm btn-ghost absolute right-3 top-3"
                onClick={() =>
                  onOpenLightbox?.(
                    "https://images.unsplash.com/photo-1524666041070-9d87656c25bb?q=80&w=1600&auto=format&fit=crop"
                  )
                }
                aria-label="Expand"
              >
                ⤢
              </button>
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-16 -right-12 w-56 h-56 rounded-full bg-secondary/20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
