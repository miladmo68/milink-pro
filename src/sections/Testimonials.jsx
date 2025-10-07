// import { useEffect, useMemo, useRef, useState } from "react";
// import { testimonials as DATA } from "../data/content.js";

// const cx = (...a) => a.filter(Boolean).join(" ");

// export default function Testimonials() {
//   const items = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
//   const len = items.length || 1;

//   const [perView, setPerView] = useState(3); // 1 (mobile) or 3 (md+)
//   const [pos, setPos] = useState(1); // center index within `extended`
//   const [hover, setHover] = useState(false);
//   const [transitioning, setTransitioning] = useState(true);

//   // --- Responsiveness
//   useEffect(() => {
//     const onResize = () => setPerView(window.innerWidth >= 768 ? 3 : 1);
//     onResize();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const base = useMemo(() => items, [items]);

//   // --- Two clones (head & tail) to make looping seamless
//   const extended = useMemo(() => {
//     if (!len) return [];
//     return [base[len - 1], ...base, base[0]]; // [cloneTail, ...real..., cloneHead]
//   }, [base, len]);

//   const next = () => setPos((p) => p + 1);
//   const prev = () => setPos((p) => p - 1);
//   const goTo = (i) => setPos(i + 1); // i: 0..len-1 -> pos: 1..len

//   // --- Autoplay (pause on hover)
//   useEffect(() => {
//     if (hover || len < 2) return;
//     const id = setInterval(() => next(), 4500);
//     return () => clearInterval(id);
//   }, [hover, len]);

//   // --- Re-enable transition when pos changes
//   useEffect(() => {
//     setTransitioning(true);
//   }, [pos]);

//   // --- Fix loop at boundaries without visual jump
//   const onTransitionEnd = () => {
//     if (pos === 0) {
//       // jumped before first -> snap to last real
//       setTransitioning(false);
//       setPos(len);
//       requestAnimationFrame(() =>
//         requestAnimationFrame(() => setTransitioning(true))
//       );
//     } else if (pos === len + 1) {
//       // jumped after last -> snap to first real
//       setTransitioning(false);
//       setPos(1);
//       requestAnimationFrame(() =>
//         requestAnimationFrame(() => setTransitioning(true))
//       );
//     }
//   };

//   // --- Geometry
//   // Use percentage widths with NO flex `gap` to keep math exact.
//   // Each slide width in % (mobile=100, desktop=33.3333)
//   const step = perView === 1 ? 100 : 100 / 3;
//   // Center the current card: left_i - translate = 50 - step/2  => translate = left_i - (50 - step/2)
//   const translatePct = pos * step - 50 + step / 2; // pos is index in `extended`

//   if (!items.length) return null;

//   return (
//     <section id="testimonials" className="py-20 bg-base-200">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <h2 className="text-4xl font-bold text-center mb-3">
//           What Clients Say
//         </h2>
//         <p className="text-center opacity-70 mb-10">
//           Trusted voices from real clients.
//         </p>

//         <div
//           className="relative"
//           onMouseEnter={() => setHover(true)}
//           onMouseLeave={() => setHover(false)}
//         >
//           <button
//             aria-label="Previous"
//             onClick={prev}
//             className="btn btn-circle btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
//           >
//             ‹
//           </button>
//           <button
//             aria-label="Next"
//             onClick={next}
//             className="btn btn-circle btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-base-100/70 backdrop-blur shadow hover:scale-105"
//           >
//             ›
//           </button>

//           <div className="overflow-hidden px-6 md:px-12">
//             <div className="relative">
//               <div
//                 onTransitionEnd={onTransitionEnd}
//                 className={cx(
//                   // IMPORTANT: remove `gap` so translate math stays exact
//                   "flex will-change-transform",
//                   transitioning
//                     ? "transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
//                     : "transition-none"
//                 )}
//                 style={{ transform: `translateX(-${translatePct}%)` }}
//               >
//                 {extended.map((t, i) => {
//                   const isCenter = i === pos;
//                   const isLeft = i === pos - 1;
//                   const isRight = i === pos + 1;

//                   const scale =
//                     perView === 1
//                       ? isCenter
//                         ? "scale-105"
//                         : "scale-95"
//                       : isCenter
//                       ? "scale-105"
//                       : isLeft || isRight
//                       ? "scale-95"
//                       : "scale-90";

//                   const opacity =
//                     perView === 1
//                       ? isCenter
//                         ? "opacity-100"
//                         : "opacity-80"
//                       : isCenter
//                       ? "opacity-100"
//                       : isLeft || isRight
//                       ? "opacity-85"
//                       : "opacity-60";

//                   const ring = isCenter
//                     ? "ring-1 ring-primary/30 border-primary/20 shadow-2xl"
//                     : "";

//                   return (
//                     <article
//                       key={i}
//                       className={cx(
//                         // Widths (no external gap). Add inner padding for spacing.
//                         "shrink-0 px-3 md:px-4", // visual spacing
//                         perView === 1 ? "w-full" : "w-1/3",
//                         "transition-all duration-700 ease-out"
//                       )}
//                     >
//                       <div
//                         className={cx(
//                           "card h-full mx-auto bg-base-100 p-8 border border-transparent shadow-xl",
//                           "transition-all duration-700 ease-out",
//                           scale,
//                           opacity,
//                           ring
//                         )}
//                       >
//                         <div className="flex items-center gap-4 mb-5">
//                           <Avatar src={t?.avatar} name={t?.name} />
//                           <div>
//                             <h4 className="font-bold text-lg">{t?.name}</h4>
//                             <p className="text-sm opacity-70">
//                               {t?.role}
//                               {t?.company ? ` • ${t.company}` : ""}
//                             </p>
//                           </div>
//                         </div>

//                         <blockquote
//                           className={cx(
//                             "relative text-left leading-relaxed text-base sm:text-lg",
//                             isCenter ? "italic" : ""
//                           )}
//                         >
//                           <span className="absolute -top-6 left-0 text-6xl leading-none opacity-10 select-none">
//                             “
//                           </span>
//                           <p>{t?.text}</p>
//                         </blockquote>

//                         <div
//                           className={cx(
//                             "mt-8 h-1 rounded-full",
//                             isCenter ? "bg-primary" : "bg-base-300"
//                           )}
//                         />
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>

//               {/* Edge fade masks */}
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-base-200 to-transparent" />
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-base-200 to-transparent" />
//             </div>
//           </div>

//           {/* Dots */}
//           <div className="flex items-center justify-center gap-2 mt-8">
//             {items.map((_, i) => {
//               const current = pos > len ? 1 : pos < 1 ? len : pos; // normalize
//               const active = i + 1 === current;
//               return (
//                 <button
//                   key={i}
//                   onClick={() => goTo(i)}
//                   aria-label={`Go to ${i + 1}`}
//                   className={cx(
//                     "h-2 rounded-full transition-all",
//                     active ? "w-6 bg-primary" : "w-2 bg-base-300"
//                   )}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Avatar({ src, name = "" }) {
//   if (!src) {
//     const initials = (name || "?")
//       .split(" ")
//       .map((n) => n[0]?.toUpperCase())
//       .slice(0, 2)
//       .join("");
//     return (
//       <div className="avatar placeholder">
//         <div className="w-14 rounded-full bg-base-300 text-base-content">
//           <span className="text-sm">{initials}</span>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="avatar">
//       <div className="w-14 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
//         <img src={src} alt={name} loading="lazy" />
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials as DATA } from "../data/content.js";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Testimonials3DPro() {
  const items = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
  const len = items.length;
  if (!len) return null;

  // ===== Layout: 1 (mobile) or 3 (md+)
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth >= 768 ? 3 : 1);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== Extended array: [cloneTail, ...base, cloneHead]
  const base = useMemo(() => items, [items]);
  const extended = useMemo(
    () => [base[len - 1], ...base, base[0]],
    [base, len]
  );

  // ===== Position state (virtual): 1..len  (0 و len+1 کُلن‌ها هستند)
  const [pos, setPos] = useState(1);
  const posRef = useRef(pos);
  posRef.current = pos;

  // برای جلوگیری از تداخل تیکِ autoplay موقع snap
  const snappingRef = useRef(false);

  // فلگ ترنزیشن (برای اسنپ بدون انیمیشن)
  const [transitioning, setTransitioning] = useState(true);

  // Hover = pause
  const [hover, setHover] = useState(false);

  // ===== Helpers
  const normalize = (p) => ((p - 1 + len) % len) + 1; // -> 1..len
  const clampGhost = (p) => Math.max(0, Math.min(len + 1, p)); // -> 0..len+1

  // ===== Autoplay (بدون تداخل با snap)
  useEffect(() => {
    if (hover || len < 2) return;
    const id = setInterval(() => {
      if (snappingRef.current) return; // یک فریم بعد از snap تیک نزن
      setPos((p) => clampGhost(p + 1));
    }, 4200);
    return () => clearInterval(id);
  }, [hover, len]);

  // هر تغییر pos => ترنزیشن روشن باشد (به‌جز دقیقاً قبل از snap)
  useEffect(() => {
    setTransitioning(true);
  }, [pos]);

  // ===== Seamless loop (اسنپ بی‌وقفه)
  const railRef = useRef(null);
  const onTransitionEnd = (e) => {
    if (!railRef.current || e.target !== railRef.current) return; // فقط ریل
    if (pos === 0 || pos === len + 1) {
      snappingRef.current = true; // جلوی تداخل autoplay را بگیر
      setTransitioning(false); // بدون انیمیشن اسنپ کن
      const target = pos === 0 ? len : 1;
      // دو تا rAF برای تضمین اعمال transform بدون transition
      requestAnimationFrame(() => {
        setPos(target);
        requestAnimationFrame(() => {
          setTransitioning(true);
          // یک rAF دیگر تا بعد از فعال شدن transition، اجازه autoplay بده
          requestAnimationFrame(() => (snappingRef.current = false));
        });
      });
    }
  };

  // ===== Geometry
  const step = perView === 1 ? 100 : 100 / 3; // 100% یا 33.333%
  // translate بر اساس pos روی extended (0..len+1) محاسبه می‌شود
  const pGhost = clampGhost(pos);
  const translatePct = pGhost * step - 50 + step / 2;

  // ===== Controls
  const next = () => setPos((p) => clampGhost(p + 1));
  const prev = () => setPos((p) => clampGhost(p - 1));
  const handleClick = (i) => setPos(clampGhost(i)); // i همان ایندکس extended است
  const goTo = (i) => setPos(clampGhost(i + 1)); // dots: 0..len-1 -> 1..len

  return (
    <section id="testimonials" className="py-20 bg-base-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight">
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

          <div className="overflow-hidden px-4 md:px-10">
            <div className="relative">
              <div
                ref={railRef}
                onTransitionEnd={onTransitionEnd}
                className={cx(
                  "flex t3d-rail will-change-transform",
                  transitioning
                    ? "transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
                    : "transition-none"
                )}
                style={{ transform: `translateX(-${translatePct}%)` }}
              >
                {extended.map((t, i) => {
                  const isCenter = i === pGhost;
                  const d = i - pGhost; // relative to center on extended
                  const abs = Math.abs(d);

                  // 3D transforms
                  const depth = [10, 8.5, 5.6, 2.5, 0.6];
                  const rot = [0, 35, 40, 30, 15];
                  const z = abs < depth.length ? depth[abs] : 0.2;
                  const ry =
                    d === 0
                      ? 0
                      : d > 0
                      ? rot[Math.min(abs, 4)]
                      : -rot[Math.min(abs, 4)];

                  const scale =
                    perView === 1
                      ? abs === 0
                        ? 1.03
                        : abs === 1
                        ? 0.96
                        : 0.92
                      : abs === 0
                      ? 1.04
                      : abs === 1
                      ? 0.97
                      : 0.93;

                  const opacity =
                    perView === 1
                      ? abs === 0
                        ? 1
                        : abs === 1
                        ? 0.9
                        : 0.7
                      : abs === 0
                      ? 1
                      : abs === 1
                      ? 0.88
                      : 0.6;

                  return (
                    <article
                      key={i}
                      className={cx(
                        "shrink-0 px-3 md:px-4",
                        perView === 1 ? "w-full" : "w-1/3"
                      )}
                    >
                      <button
                        type="button"
                        aria-label={`Open testimonial ${i}`}
                        onClick={() => handleClick(i)}
                        className={cx(
                          "item group relative block w-full overflow-visible rounded-2xl outline-none",
                          "transition-[filter,transform] duration-700"
                        )}
                        style={{
                          filter: `grayscale(${abs === 0 ? 0 : 1}) brightness(${
                            abs === 0 ? 1 : 0.55
                          })`,
                          transform: `translateZ(calc(var(--index) * ${z})) rotateY(${ry}deg) scale(${scale})`,
                        }}
                      >
                        {/* Backdrop */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-cover bg-center"
                          style={{
                            backgroundImage: t?.avatar
                              ? `url(${t.avatar})`
                              : "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
                          }}
                        />
                        {/* Gloss */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
                        {/* Card */}
                        <div
                          className={cx(
                            "relative z-10 card h-full bg-base-100/85 border border-white/10",
                            "shadow-[0_10px_40px_-10px_rgba(0,0,0,.4)] p-6 md:p-8 rounded-2xl backdrop-blur"
                          )}
                          style={{ opacity }}
                        >
                          <div className="flex items-center gap-4 mb-5">
                            <Avatar src={t?.avatar} name={t?.name} />
                            <div>
                              <h4 className="font-semibold text-lg leading-tight">
                                {t?.name}
                              </h4>
                              <p className="text-xs md:text-sm opacity-70">
                                {t?.role}
                                {t?.company ? ` • ${t.company}` : ""}
                              </p>
                            </div>
                          </div>

                          <blockquote className="relative text-left leading-relaxed text-base md:text-lg">
                            <span className="quote absolute -top-6 left-0 text-6xl leading-none opacity-10 select-none">
                              “
                            </span>
                            <p>{t?.text}</p>
                          </blockquote>

                          <div
                            className={cx(
                              "mt-6 h-[3px] rounded-full",
                              isCenter ? "bg-primary" : "bg-base-300"
                            )}
                          />
                        </div>
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Edge fade */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-base-200 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-base-200 to-transparent" />
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
                    active
                      ? "w-7 bg-primary"
                      : "w-2 bg-base-300 hover:bg-base-400"
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        :root{ --index: calc(1vw + 1vh); }
        .t3d-rail{ perspective: calc(var(--index) * 35); }
        .i-dot { width:.5rem; height:.5rem; border-radius:999px; background: currentColor; display:inline-block; }
        .nav{ opacity:.9 }
        @media (max-width: 767px){
          :root{ --index: calc(1.5vw + 1.5vh); }
        }
      `}</style>
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
        <div className="w-12 md:w-14 rounded-full bg-base-300 text-base-content">
          <span className="text-sm">{initials}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="avatar">
      <div className="w-12 md:w-14 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
        <img src={src} alt={name} loading="lazy" />
      </div>
    </div>
  );
}
