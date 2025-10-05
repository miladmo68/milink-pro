// import { useEffect, useMemo, useRef, useState } from "react";
// import { testimonials as DATA } from "../data/content.js";

// /**
//  * Optional fields supported in DATA:
//  * {
//  *   text: string,
//  *   name: string,
//  *   role?: string,
//  *   company?: string,
//  *   avatar?: string,   // /images/people/alex.jpg
//  *   rating?: number    // 1..5
//  * }
//  */

// export default function Testimonials() {
//   const testimonials = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
//   const [index, setIndex] = useState(0);
//   const [isHover, setIsHover] = useState(false);
//   const containerRef = useRef(null);
//   const touch = useRef({ startX: 0, deltaX: 0, isSwiping: false });
//   const intervalRef = useRef(null);

//   const length = testimonials.length || 1;

//   // Autoplay every 5s (pause on hover or when length < 2)
//   useEffect(() => {
//     if (length < 2) return;
//     const play = () => setIndex((i) => (i + 1) % length);
//     if (!isHover) intervalRef.current = setInterval(play, 5000);
//     return () => clearInterval(intervalRef.current);
//   }, [isHover, length]);

//   // Keyboard navigation (←/→)
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [length]);

//   const prev = () => setIndex((i) => (i - 1 + length) % length);
//   const next = () => setIndex((i) => (i + 1) % length);
//   const goTo = (i) => setIndex(i % length);

//   // Touch/drag (mobile)
//   const onTouchStart = (e) => {
//     touch.current.startX = e.touches[0].clientX;
//     touch.current.deltaX = 0;
//     touch.current.isSwiping = true;
//   };
//   const onTouchMove = (e) => {
//     if (!touch.current.isSwiping) return;
//     touch.current.deltaX = e.touches[0].clientX - touch.current.startX;
//   };
//   const onTouchEnd = () => {
//     if (!touch.current.isSwiping) return;
//     const { deltaX } = touch.current;
//     touch.current.isSwiping = false;
//     if (Math.abs(deltaX) > 60) {
//       deltaX < 0 ? next() : prev();
//     }
//   };

//   if (!testimonials.length) {
//     return (
//       <section id="testimonials" className="py-20 bg-base-200 text-center">
//         <h2 className="text-4xl font-bold mb-2">What Clients Say</h2>
//         <p className="opacity-70">Add some testimonials to get started.</p>
//       </section>
//     );
//   }

//   return (
//     <section
//       id="testimonials"
//       className="py-20 bg-base-200"
//       aria-label="Client testimonials"
//     >
//       <div className="container mx-auto px-4 max-w-5xl">
//         <h2 className="text-4xl font-bold text-center mb-3">
//           What Clients Say
//         </h2>
//         <p className="text-center opacity-70 mb-10">
//           Real words from partners who trusted your craft.
//         </p>

//         {/* Slider Shell */}
//         <div
//           ref={containerRef}
//           className="relative"
//           onMouseEnter={() => setIsHover(true)}
//           onMouseLeave={() => setIsHover(false)}
//           onTouchStart={onTouchStart}
//           onTouchMove={onTouchMove}
//           onTouchEnd={onTouchEnd}
//         >
//           {/* Track */}
//           <div
//             className="flex transition-transform duration-500 ease-out"
//             style={{ transform: `translateX(-${index * 100}%)` }}
//           >
//             {testimonials.map((t, i) => (
//               <SlideCard key={i} t={t} />
//             ))}
//           </div>

//           {/* Arrows */}
//           {length > 1 && (
//             <>
//               <button
//                 aria-label="Previous testimonial"
//                 className="btn btn-circle btn-ghost absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/70 backdrop-blur shadow hover:scale-105"
//                 onClick={prev}
//               >
//                 <ChevronLeft />
//               </button>
//               <button
//                 aria-label="Next testimonial"
//                 className="btn btn-circle btn-ghost absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/70 backdrop-blur shadow hover:scale-105"
//                 onClick={next}
//               >
//                 <ChevronRight />
//               </button>
//             </>
//           )}

//           {/* Dots */}
//           {length > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-6">
//               {testimonials.map((_, i) => {
//                 const active = i === index;
//                 return (
//                   <button
//                     key={i}
//                     aria-label={`Go to slide ${i + 1}`}
//                     onClick={() => goTo(i)}
//                     className={[
//                       "h-2 w-2 rounded-full transition-all",
//                       active
//                         ? "w-6 bg-primary"
//                         : "bg-base-300 hover:bg-base-300/80",
//                     ].join(" ")}
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ——— Slide Card ——— */
// function SlideCard({ t }) {
//   return (
//     <article className="min-w-full px-2">
//       <div className="card bg-base-100 shadow-xl mx-auto max-w-3xl">
//         <div className="card-body p-8 sm:p-10">
//           {/* Header: avatar + meta */}
//           <div className="flex items-center gap-4 mb-6">
//             <Avatar src={t.avatar} name={t.name} />
//             <div>
//               <h4 className="font-bold text-lg">{t.name}</h4>
//               <p className="text-sm opacity-70">
//                 {t.role}
//                 {t.company ? ` • ${t.company}` : ""}
//               </p>
//               {typeof t.rating === "number" && (
//                 <div className="mt-1">
//                   <Stars outOf={5} value={Math.max(0, Math.min(5, t.rating))} />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Quote */}
//           <blockquote className="relative text-left">
//             <span className="absolute -top-6 left-0 text-6xl leading-none opacity-10 select-none">
//               “
//             </span>
//             <p className="italic text-lg sm:text-xl leading-relaxed">
//               {t.text}
//             </p>
//           </blockquote>

//           {/* Footer: subtle gradient bar */}
//           <div className="mt-8 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70" />
//         </div>
//       </div>
//     </article>
//   );
// }

// /* ——— Small UI bits ——— */

// function Avatar({ src, name = "" }) {
//   if (!src) {
//     // Fallback initials
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

// function Stars({ value = 5, outOf = 5 }) {
//   return (
//     <div
//       className="flex items-center gap-0.5"
//       aria-label={`${value} out of ${outOf} stars`}
//     >
//       {Array.from({ length: outOf }).map((_, i) => (
//         <Star key={i} filled={i < value} />
//       ))}
//     </div>
//   );
// }

// function Star({ filled }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       className={`h-4 w-4 ${filled ? "fill-yellow-400" : "fill-base-300"}`}
//       aria-hidden="true"
//     >
//       <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.211l8.2-1.193L12 .587z" />
//     </svg>
//   );
// }

// function ChevronLeft() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" className="opacity-80">
//       <path
//         d="M15 18l-6-6 6-6"
//         stroke="currentColor"
//         strokeWidth="2"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function ChevronRight() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" className="opacity-80">
//       <path
//         d="M9 6l6 6-6 6"
//         stroke="currentColor"
//         strokeWidth="2"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials as DATA } from "../data/content.js";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Testimonials() {
  const items = useMemo(() => (Array.isArray(DATA) ? DATA : []), []);
  const len = items.length || 1;

  const [perView, setPerView] = useState(3);
  const [pos, setPos] = useState(1);
  const [hover, setHover] = useState(false);
  const [transitioning, setTransitioning] = useState(true);

  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth >= 768 ? 3 : 1);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const base = useMemo(() => items, [items]);
  const extended = useMemo(() => {
    if (!len) return [];
    return [base[len - 1], ...base, base[0]];
  }, [base, len]);

  const next = () => setPos((p) => p + 1);
  const prev = () => setPos((p) => p - 1);
  const goTo = (i) => setPos(i + 1);

  useEffect(() => {
    if (hover || len < 2) return;
    const id = setInterval(() => next(), 4500);
    return () => clearInterval(id);
  }, [hover, len]);

  useEffect(() => {
    setTransitioning(true);
  }, [pos]);

  const onTransitionEnd = () => {
    if (pos === 0) {
      setTransitioning(false);
      setPos(len);
      requestAnimationFrame(() => setTransitioning(true));
    } else if (pos === len + 1) {
      setTransitioning(false);
      setPos(1);
      requestAnimationFrame(() => setTransitioning(true));
    }
  };

  const step = perView === 1 ? 100 : 100 / 3;
  const translate = (pos - 1) * step;

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
                  "flex gap-10 will-change-transform",
                  transitioning
                    ? "transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
                    : "transition-none"
                )}
                style={{ transform: `translateX(-${translate}%)` }}
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
                    ? "ring-1 ring-[#142133]/30 border-[#142133]/20 shadow-2xl"
                    : "";

                  return (
                    <article
                      key={i}
                      className={cx(
                        "shrink-0 w-full",
                        perView === 1 ? "md:w-full" : "md:w-1/3",
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
                            isCenter
                              ? "bg-gradient-to-r from-[#142133] via-[#142133] to-[#142133]"
                              : "bg-base-300"
                          )}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-base-200 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-base-200 to-transparent" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to ${i + 1}`}
                className={cx(
                  "h-2 rounded-full transition-all",
                  i + 1 === (pos > len ? 1 : pos < 1 ? len : pos)
                    ? "w-6 bg-[#142133]"
                    : "w-2 bg-base-300"
                )}
              />
            ))}
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
      <div className="w-14 rounded-full ring ring-[#142133]/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
        <img src={src} alt={name} loading="lazy" />
      </div>
    </div>
  );
}
