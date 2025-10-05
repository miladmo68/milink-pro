import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials as DATA } from "../data/content.js";

/**
 * Optional fields supported in DATA:
 * {
 *   text: string,
 *   name: string,
 *   role?: string,
 *   company?: string,
 *   avatar?: string,   // /images/people/alex.jpg
 *   rating?: number    // 1..5
 * }
 */

export default function Testimonials() {
  const testimonials = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const containerRef = useRef(null);
  const touch = useRef({ startX: 0, deltaX: 0, isSwiping: false });
  const intervalRef = useRef(null);

  const length = testimonials.length || 1;

  // Autoplay every 5s (pause on hover or when length < 2)
  useEffect(() => {
    if (length < 2) return;
    const play = () => setIndex((i) => (i + 1) % length);
    if (!isHover) intervalRef.current = setInterval(play, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isHover, length]);

  // Keyboard navigation (←/→)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [length]);

  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);
  const goTo = (i) => setIndex(i % length);

  // Touch/drag (mobile)
  const onTouchStart = (e) => {
    touch.current.startX = e.touches[0].clientX;
    touch.current.deltaX = 0;
    touch.current.isSwiping = true;
  };
  const onTouchMove = (e) => {
    if (!touch.current.isSwiping) return;
    touch.current.deltaX = e.touches[0].clientX - touch.current.startX;
  };
  const onTouchEnd = () => {
    if (!touch.current.isSwiping) return;
    const { deltaX } = touch.current;
    touch.current.isSwiping = false;
    if (Math.abs(deltaX) > 60) {
      deltaX < 0 ? next() : prev();
    }
  };

  if (!testimonials.length) {
    return (
      <section id="testimonials" className="py-20 bg-base-200 text-center">
        <h2 className="text-4xl font-bold mb-2">What Clients Say</h2>
        <p className="opacity-70">Add some testimonials to get started.</p>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="py-20 bg-base-200"
      aria-label="Client testimonials"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-3">
          What Clients Say
        </h2>
        <p className="text-center opacity-70 mb-10">
          Real words from partners who trusted your craft.
        </p>

        {/* Slider Shell */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <SlideCard key={i} t={t} />
            ))}
          </div>

          {/* Arrows */}
          {length > 1 && (
            <>
              <button
                aria-label="Previous testimonial"
                className="btn btn-circle btn-ghost absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/70 backdrop-blur shadow hover:scale-105"
                onClick={prev}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next testimonial"
                className="btn btn-circle btn-ghost absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/70 backdrop-blur shadow hover:scale-105"
                onClick={next}
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Dots */}
          {length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={[
                      "h-2 w-2 rounded-full transition-all",
                      active
                        ? "w-6 bg-primary"
                        : "bg-base-300 hover:bg-base-300/80",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ——— Slide Card ——— */
function SlideCard({ t }) {
  return (
    <article className="min-w-full px-2">
      <div className="card bg-base-100 shadow-xl mx-auto max-w-3xl">
        <div className="card-body p-8 sm:p-10">
          {/* Header: avatar + meta */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={t.avatar} name={t.name} />
            <div>
              <h4 className="font-bold text-lg">{t.name}</h4>
              <p className="text-sm opacity-70">
                {t.role}
                {t.company ? ` • ${t.company}` : ""}
              </p>
              {typeof t.rating === "number" && (
                <div className="mt-1">
                  <Stars outOf={5} value={Math.max(0, Math.min(5, t.rating))} />
                </div>
              )}
            </div>
          </div>

          {/* Quote */}
          <blockquote className="relative text-left">
            <span className="absolute -top-6 left-0 text-6xl leading-none opacity-10 select-none">
              “
            </span>
            <p className="italic text-lg sm:text-xl leading-relaxed">
              {t.text}
            </p>
          </blockquote>

          {/* Footer: subtle gradient bar */}
          <div className="mt-8 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70" />
        </div>
      </div>
    </article>
  );
}

/* ——— Small UI bits ——— */

function Avatar({ src, name = "" }) {
  if (!src) {
    // Fallback initials
    const initials = (name || "?")
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    return (
      <div className="avatar placeholder">
        <div className="w-14 rounded-full bg-base-300 text-base-content">
          <span className="text-sm">{initials}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="avatar">
      <div className="w-14 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
        <img src={src} alt={name} loading="lazy" />
      </div>
    </div>
  );
}

function Stars({ value = 5, outOf = 5 }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} out of ${outOf} stars`}
    >
      {Array.from({ length: outOf }).map((_, i) => (
        <Star key={i} filled={i < value} />
      ))}
    </div>
  );
}

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${filled ? "fill-yellow-400" : "fill-base-300"}`}
      aria-hidden="true"
    >
      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.211l8.2-1.193L12 .587z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="opacity-80">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="opacity-80">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
