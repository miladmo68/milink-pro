import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials as DATA } from "../data/content.js";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Testimonials() {
  const items = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
  const len = items.length || 1;

  const [perView, setPerView] = useState(3); // 1 (mobile) or 3 (md+)
  const [pos, setPos] = useState(1); // center index within `extended`
  const [hover, setHover] = useState(false);
  const [transitioning, setTransitioning] = useState(true);

  // --- Responsiveness
  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth >= 768 ? 3 : 1);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const base = useMemo(() => items, [items]);

  // --- Two clones (head & tail) to make looping seamless
  const extended = useMemo(() => {
    if (!len) return [];
    return [base[len - 1], ...base, base[0]]; // [cloneTail, ...real..., cloneHead]
  }, [base, len]);

  const next = () => setPos((p) => p + 1);
  const prev = () => setPos((p) => p - 1);
  const goTo = (i) => setPos(i + 1); // i: 0..len-1 -> pos: 1..len

  // --- Autoplay (pause on hover)
  useEffect(() => {
    if (hover || len < 2) return;
    const id = setInterval(() => next(), 4500);
    return () => clearInterval(id);
  }, [hover, len]);

  // --- Re-enable transition when pos changes
  useEffect(() => {
    setTransitioning(true);
  }, [pos]);

  // --- Fix loop at boundaries without visual jump
  const onTransitionEnd = () => {
    if (pos === 0) {
      // jumped before first -> snap to last real
      setTransitioning(false);
      setPos(len);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransitioning(true))
      );
    } else if (pos === len + 1) {
      // jumped after last -> snap to first real
      setTransitioning(false);
      setPos(1);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransitioning(true))
      );
    }
  };

  // --- Geometry
  // Use percentage widths with NO flex `gap` to keep math exact.
  // Each slide width in % (mobile=100, desktop=33.3333)
  const step = perView === 1 ? 100 : 100 / 3;
  // Center the current card: left_i - translate = 50 - step/2  => translate = left_i - (50 - step/2)
  const translatePct = pos * step - 50 + step / 2; // pos is index in `extended`

  if (!items.length) return null;

  return (
    <section id="testimonials" className="py-20 bg-base-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-3">
          What Clients Say
        </h2>
        <p className="text-center opacity-70 mb-10">
          Trusted voices from real clients.
        </p>

        <div
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <button
            aria-label="Previous"
            onClick={prev}
            className="btn btn-circle btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="btn btn-circle btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
          >
            ›
          </button>

          <div className="overflow-hidden px-6 md:px-12">
            <div className="relative">
              <div
                onTransitionEnd={onTransitionEnd}
                className={cx(
                  // IMPORTANT: remove `gap` so translate math stays exact
                  "flex will-change-transform",
                  transitioning
                    ? "transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
                    : "transition-none"
                )}
                style={{ transform: `translateX(-${translatePct}%)` }}
              >
                {extended.map((t, i) => {
                  const isCenter = i === pos;
                  const isLeft = i === pos - 1;
                  const isRight = i === pos + 1;

                  const scale =
                    perView === 1
                      ? isCenter
                        ? "scale-105"
                        : "scale-95"
                      : isCenter
                      ? "scale-105"
                      : isLeft || isRight
                      ? "scale-95"
                      : "scale-90";

                  const opacity =
                    perView === 1
                      ? isCenter
                        ? "opacity-100"
                        : "opacity-80"
                      : isCenter
                      ? "opacity-100"
                      : isLeft || isRight
                      ? "opacity-85"
                      : "opacity-60";

                  const ring = isCenter
                    ? "ring-1 ring-primary/30 border-primary/20 shadow-2xl"
                    : "";

                  return (
                    <article
                      key={i}
                      className={cx(
                        // Widths (no external gap). Add inner padding for spacing.
                        "shrink-0 px-3 md:px-4", // visual spacing
                        perView === 1 ? "w-full" : "w-1/3",
                        "transition-all duration-700 ease-out"
                      )}
                    >
                      <div
                        className={cx(
                          "card h-full mx-auto bg-base-100 p-8 border border-transparent shadow-xl",
                          "transition-all duration-700 ease-out",
                          scale,
                          opacity,
                          ring
                        )}
                      >
                        <div className="flex items-center gap-4 mb-5">
                          <Avatar src={t?.avatar} name={t?.name} />
                          <div>
                            <h4 className="font-bold text-lg">{t?.name}</h4>
                            <p className="text-sm opacity-70">
                              {t?.role}
                              {t?.company ? ` • ${t.company}` : ""}
                            </p>
                          </div>
                        </div>

                        <blockquote
                          className={cx(
                            "relative text-left leading-relaxed text-base sm:text-lg",
                            isCenter ? "italic" : ""
                          )}
                        >
                          <span className="absolute -top-6 left-0 text-6xl leading-none opacity-10 select-none">
                            “
                          </span>
                          <p>{t?.text}</p>
                        </blockquote>

                        <div
                          className={cx(
                            "mt-8 h-1 rounded-full",
                            isCenter ? "bg-primary" : "bg-base-300"
                          )}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Edge fade masks */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-base-200 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-base-200 to-transparent" />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {items.map((_, i) => {
              const current = pos > len ? 1 : pos < 1 ? len : pos; // normalize
              const active = i + 1 === current;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${i + 1}`}
                  className={cx(
                    "h-2 rounded-full transition-all",
                    active ? "w-6 bg-primary" : "w-2 bg-base-300"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({ src, name = "" }) {
  if (!src) {
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
