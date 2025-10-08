import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { testimonials as DATA } from "../data/content.js";

/**
 * Testimonials3DPro – Clean Professional v3 (Color-polished)
 * - کارت‌ها هم‌اندازه؛ کارت وسط کمی بزرگ‌تر
 * - پالت لوکس آبی تیره + اکنت آبی روشن، کاملاً مینیمال و باکلاس
 * - گرادیان قاب لطیف، دات‌های گرادیانی، پس‌زمینه رنگی ملایم
 */

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Testimonials3DPro() {
  const items = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
  const len = items.length;
  if (!len) return null;

  // ===== Brand
  const BRAND = {
    rgb: "23 37 84", // primary dark blue: "23 37 84"
    comma: "23, 37, 84",
    hex: "#172554",
    accentRGB: "56 189 248", // sky-400 style accent
    accentComma: "56, 189, 248",
  };

  const REDUCED = usePrefersReducedMotion();

  // ===== Layout: 1 (mobile) or 3 (md+)
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth >= 768 ? 3 : 1);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Visibility pause
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // ===== Extended array: [cloneTail, ...base, cloneHead]
  const base = useMemo(() => items, [items]);
  const extended = useMemo(
    () => [base[len - 1], ...base, base[0]],
    [base, len]
  );

  // ===== Position state (virtual): 1..len  (0 & len+1 ghosts)
  const [pos, setPos] = useState(1);
  const posRef = useRef(pos);
  posRef.current = pos;

  const snappingRef = useRef(false);
  const [transitioning, setTransitioning] = useState(true);
  const [hover, setHover] = useState(false);

  const normalize = (p) => ((p - 1 + len) % len) + 1; // -> 1..len
  const clampGhost = (p) => Math.max(0, Math.min(len + 1, p)); // -> 0..len+1

  // ===== Autoplay
  useEffect(() => {
    if (REDUCED || hover || len < 2 || !pageVisible) return;
    const id = setInterval(() => {
      if (snappingRef.current) return;
      setPos((p) => clampGhost(p + 1));
    }, 5200);
    return () => clearInterval(id);
  }, [REDUCED, hover, len, pageVisible]);

  useEffect(() => setTransitioning(true), [pos]);

  // ===== Seamless loop
  const railRef = useRef(null);
  const onTransitionEnd = (e) => {
    if (!railRef.current || e.target !== railRef.current) return;
    if (pos === 0 || pos === len + 1) {
      snappingRef.current = true;
      setTransitioning(false);
      const target = pos === 0 ? len : 1;
      requestAnimationFrame(() => {
        setPos(target);
        requestAnimationFrame(() => {
          setTransitioning(true);
          requestAnimationFrame(() => (snappingRef.current = false));
        });
      });
    }
  };

  // ===== Geometry
  const step = perView === 1 ? 100 : 100 / 3; // 100% یا 33.333%
  const pGhost = clampGhost(pos);
  const translatePct = pGhost * step - 50 + step / 2;

  // ===== Controls
  const next = useCallback(() => setPos((p) => clampGhost(p + 1)), []);
  const prev = useCallback(() => setPos((p) => clampGhost(p - 1)), []);
  const handleClick = (i) => setPos(clampGhost(i));
  const goTo = (i) => setPos(clampGhost(i + 1));

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section
      id="testimonials"
      className="relative py-20 bg-base-200"
      style={{
        ["--brand"]: BRAND.rgb,
        ["--card-h"]: "clamp(300px, 36vw, 380px)",
      }}
      aria-label="Client testimonials"
    >
      <DecorBG brandComma={BRAND.comma} accentComma={BRAND.accentComma} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            What Clients Say
          </h2>
          <p className="opacity-70 mt-2">Real feedback, real outcomes.</p>
        </header>

        <div
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Arrows */}
          <button
            aria-label="Previous"
            onClick={prev}
            className="nav left btn btn-circle btn-ghost absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="nav right btn btn-circle btn-ghost absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
          >
            ›
          </button>

          <div className="overflow-hidden px-3 md:px-10">
            <div className="relative">
              {/* accent خط بسیار نرم */}
              <div
                className="pointer-events-none absolute -top-2 left-8 right-8 h-px"
                style={{
                  background: `linear-gradient(90deg, rgba(${BRAND.comma}, 0.35), rgba(${BRAND.accentComma}, 0.35), transparent)`,
                }}
              />

              <div
                ref={railRef}
                onTransitionEnd={onTransitionEnd}
                className={cx(
                  "flex t3d-rail will-change-transform",
                  transitioning && !REDUCED
                    ? "transition-transform duration-600 ease-[cubic-bezier(.22,.61,.36,1)]"
                    : "transition-none"
                )}
                style={{ transform: `translateX(-${translatePct}%)` }}
              >
                {extended.map((t, i) => {
                  const isCenter = i === pGhost;
                  const d = i - pGhost;
                  const abs = Math.abs(d);

                  // 3D بسیار لطیف + مقیاس یک‌ذره بزرگ‌تر برای کارت وسط
                  const depth = REDUCED ? [0, 0] : [5, 2.5, 1];
                  const rot = REDUCED ? [0, 0] : [0, 8, 4];
                  const z = abs < depth.length ? depth[abs] : 0.5;
                  const ry =
                    d === 0
                      ? 0
                      : d > 0
                      ? rot[Math.min(abs, 2)]
                      : -rot[Math.min(abs, 2)];

                  const scale =
                    perView === 1
                      ? abs === 0
                        ? 1.03
                        : 1
                      : abs === 0
                      ? 1.06
                      : 1;

                  return (
                    <article
                      key={i}
                      className={cx(
                        "shrink-0 px-2.5 md:px-4",
                        perView === 1 ? "w-full" : "w-1/3"
                      )}
                    >
                      <button
                        type="button"
                        aria-label={`Open testimonial ${i}`}
                        onClick={() => handleClick(i)}
                        className={cx(
                          "group relative block w-full overflow-visible rounded-2xl outline-none",
                          "transition-transform duration-600"
                        )}
                        style={{
                          transform: `translateZ(calc(var(--index) * ${z})) rotateY(${ry}deg) scale(${scale})`,
                        }}
                      >
                        {/* قاب گرادیانی ظریف + کارت مینیمال */}
                        <div
                          className="relative rounded-2xl p-[1px]"
                          style={{
                            background: isCenter
                              ? `linear-gradient(135deg, rgba(${BRAND.comma}, 0.85), rgba(${BRAND.accentComma}, 0.8))`
                              : `linear-gradient(135deg, rgba(${BRAND.comma}, 0.18), rgba(${BRAND.accentComma}, 0.16))`,
                            boxShadow: isCenter
                              ? `0 24px 80px -24px rgba(${BRAND.comma}, 0.55)`
                              : `0 16px 50px -28px rgba(0,0,0,.35)`,
                          }}
                        >
                          <div
                            className={cx(
                              "relative z-10 rounded-2xl border bg-base-100",
                              "border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,.30)]"
                            )}
                            style={{ minHeight: "var(--card-h)" }}
                          >
                            {/* نوار بالا */}
                            <div
                              className="h-[3px] rounded-t-2xl"
                              style={{
                                background: isCenter
                                  ? `linear-gradient(90deg, rgba(${BRAND.comma}, 1), rgba(${BRAND.accentComma}, .95))`
                                  : `linear-gradient(90deg, rgba(${BRAND.comma}, .25), rgba(${BRAND.accentComma}, .25))`,
                              }}
                            />

                            {/* محتوا */}
                            <div className="p-6 md:p-8 grid grid-rows-[auto,1fr,auto] h-[calc(var(--card-h)-12px)]">
                              <div className="flex items-center gap-4">
                                <Avatar
                                  src={t?.avatar}
                                  name={t?.name}
                                  brandComma={BRAND.comma}
                                  accentComma={BRAND.accentComma}
                                />
                                <div>
                                  <h4 className="font-semibold text-lg md:text-xl leading-tight">
                                    {t?.name}
                                  </h4>
                                  <p className="text-xs md:text-sm text-base-content/70">
                                    {t?.role}
                                    {t?.company ? ` • ${t.company}` : ""}
                                  </p>
                                </div>
                              </div>

                              <blockquote className="mt-4 text-left leading-8 md:leading-8 text-[15px] md:text-[17px] text-base-content/90 relative">
                                <span
                                  className="absolute -top-6 left-0 text-5xl leading-none select-none"
                                  style={{
                                    color: `rgba(${BRAND.accentComma}, .22)`,
                                  }}
                                >
                                  “
                                </span>
                                <p
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: perView === 1 ? 9 : 7,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {t?.text}
                                </p>
                              </blockquote>

                              {/* فوتر */}
                              <div
                                className="mt-6 h-[2px] rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, rgba(${BRAND.comma}, .22), rgba(${BRAND.accentComma}, .35))`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Edge fades */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-base-200 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-base-200 to-transparent" />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {base.map((_, i) => {
              const current = normalize(pos);
              const active = i + 1 === current;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${i + 1}`}
                  className={cx(
                    "h-2 rounded-full transition-all",
                    active ? "w-8" : "w-3"
                  )}
                  style={{
                    background: active
                      ? `linear-gradient(90deg, rgba(${BRAND.comma}, 1), rgba(${BRAND.accentComma}, .95))`
                      : `rgba(0,0,0,.18)`,
                    boxShadow: active
                      ? `0 0 0 2px rgba(255,255,255,.25)`
                      : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        :root{ --index: calc(1vw + 1vh); }
        .t3d-rail{ perspective: calc(var(--index) * 26); }
        .nav{ opacity:.95 }
        @media (max-width: 767px){ :root{ --index: calc(1.5vw + 1.5vh); } }
      `}</style>
    </section>
  );
}

function DecorBG({ brandComma = "23, 37, 84", accentComma = "56, 189, 248" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px,#fff 1px,transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* angled color wash */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, rgba(${brandComma}, .22) 0%, rgba(${brandComma}, 0) 40%), linear-gradient(315deg, rgba(${accentComma}, .18) 10%, rgba(${accentComma}, 0) 60%)`,
          maskImage:
            "radial-gradient(80% 55% at 50% -10%, #000 40%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(80% 55% at 50% -10%, #000 40%, transparent 70%)",
        }}
      />
    </div>
  );
}

function Avatar({
  src,
  name = "",
  brandComma = "23, 37, 84",
  accentComma = "56, 189, 248",
}) {
  if (!src) {
    const initials = (name || "?")
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    return (
      <div className="avatar placeholder">
        <div className="w-12 md:w-14 rounded-full bg-base-300 text-base-content">
          <span className="text-sm">{initials}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="avatar">
      <div
        className="w-12 md:w-14 rounded-full ring ring-offset-2 ring-offset-base-100 overflow-hidden"
        style={{
          boxShadow: `0 0 0 2px rgba(${brandComma}, 0.22), 0 0 0 5px rgba(${accentComma}, 0.12)`,
        }}
      >
        <img src={src} alt={name} loading="lazy" />
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
