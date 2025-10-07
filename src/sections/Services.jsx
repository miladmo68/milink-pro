// import {
//   CodeBracketIcon,
//   DevicePhoneMobileIcon,
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   WrenchScrewdriverIcon,
//   PaintBrushIcon,
// } from "@heroicons/react/24/outline";
// import { services } from "../data/content.js";

// // Map icon name strings from content.js to actual components
// const iconMap = {
//   CodeBracketIcon,
//   DevicePhoneMobileIcon,
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   WrenchScrewdriverIcon,
//   PaintBrushIcon,
// };

// function ServiceCard({ data, onOpen }) {
//   const Icon = iconMap[data.icon] || CodeBracketIcon;

//   return (
//     <article className="relative card bg-base-300/70 p-6 shadow-md rounded-2xl ring-1 ring-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40 focus-within:ring-primary/50">
//       {data.badge && (
//         <span className="badge badge-primary absolute right-3 top-3 motion-safe:animate-pulse hover:motion-safe:animate-none">
//           {data.badge}
//         </span>
//       )}

//       <div className="flex flex-col items-start gap-3 text-left">
//         <Icon className="h-12 w-12 text-primary" />
//         <h3 className="text-xl font-semibold">{data.title}</h3>
//         <p className="opacity-80">{data.desc}</p>

//         {data.bullets?.length > 0 && (
//           <ul className="mt-2 space-y-2 text-sm opacity-90">
//             {data.bullets.map((b, i) => (
//               <li key={i}>• {b}</li>
//             ))}
//           </ul>
//         )}

//         <div className="mt-4 w-full flex justify-end">
//           <button
//             className="btn btn-sm"
//             onClick={() =>
//               onOpen?.({
//                 title: data.title,
//                 text:
//                   data.longDesc ||
//                   "We keep it simple and reliable — so you can trust us to get it done right.",
//                 list: data.bullets || [],
//               })
//             }
//           >
//             Read more
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// export default function Services({ onOpen }) {
//   return (
//     <section id="services" className="py-20 bg-base-100">
//       <div className="container mx-auto text-center">
//         <h2 className="text-4xl font-bold">Our Services</h2>
//         <p className="opacity-80 mt-1">Design • Build • Grow</p>

//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map((s) => (
//             <ServiceCard key={s.id} data={s} onOpen={onOpen} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { services } from "../data/content.js";

/* ===== Brand palette ===== */
const BRAND = {
  baseFrom: "#0b1220",
  baseVia: "#0a0f1a",
  baseTo: "#0e1b33",
  accent: "#3b82f6", // main blue
  accentSoft: "#60a5fa", // soft blue for icons/glow
};

/* ===== Icon map ===== */
const iconMap = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
};

/* ===== Flip wrapper: hover (desktop) + tap (mobile), بدون jitter ===== */
function FlippyInteractive({ front, back, className = "" }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={(e) => {
        // tap toggle روی موبایل
        e.stopPropagation();
        setFlipped((v) => !v);
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full rounded-2xl"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(0)",
            WebkitTransform: "rotateY(0deg) translateZ(0)",
          }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(0.1px)",
            WebkitTransform: "rotateY(180deg) translateZ(0.1px)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

/* ===== Badge motion (Popular / In-Demand / High-Pro) ===== */
const badgeMotion = {
  animate: { y: [0, -2, 0], scale: [1, 1.06, 1] },
  transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
};

function ServiceCard({ data }) {
  const Icon = iconMap[data.icon] || CodeBracketIcon;

  // داینامیک: فقط اگر محتوا بلند شد اسکرول فعال شود
  const bodyRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = bodyRef.current;
      if (el) setNeedsScroll(el.scrollHeight > el.clientHeight + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    if (bodyRef.current) ro.observe(bodyRef.current);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  /* Front: گرادیان قبلی + glow پایین راست */
  const Front = (
    <article
      className="relative h-full p-6 rounded-2xl text-slate-100 shadow-md ring-1"
      aria-label={`${data.title} front`}
      style={{
        background: `linear-gradient(135deg, ${BRAND.baseFrom} 0%, ${BRAND.baseVia} 55%, ${BRAND.baseTo} 100%)`,
        boxShadow: `0 0 0 1px rgba(59,130,246,0.18), 0 10px 28px rgba(0,0,0,0.35)`,
        borderColor: "rgba(59,130,246,0.28)",
      }}
    >
      {data.badge && (
        <motion.span
          {...badgeMotion}
          className="badge absolute right-3 top-3 text-slate-900"
          style={{ backgroundColor: BRAND.accent, borderColor: "transparent" }}
        >
          {data.badge}
        </motion.span>
      )}

      <div className="flex h-full flex-col items-center justify-center text-center gap-3 relative z-[1]">
        <Icon className="h-12 w-12" style={{ color: BRAND.accentSoft }} />
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <p className="opacity-80 max-w-[28ch]">{data.desc}</p>

        {/* More details با رنگ آبی برند */}
        <span
          className="mt-3 text-sm font-medium tracking-wide select-none"
          style={{ color: BRAND.accent }}
        >
          More details
        </span>
      </div>

      {/* Glow پایین راست */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-60px] bottom-[-60px] w-[260px] h-[260px] rounded-full opacity-25 blur-2xl"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${BRAND.accentSoft} 0%, rgba(96,165,250,0) 60%)`,
        }}
      />
    </article>
  );

  /* Back: بدون دکمه؛ تیتر بولدتر و آبی */
  const Back = (
    <article
      className="relative h-full rounded-2xl bg-base-100/95 text-base-content backdrop-blur"
      aria-label={`${data.title} back`}
      style={{
        boxShadow: `0 0 0 1px rgba(59,130,246,0.28) inset, 0 10px 28px rgba(2, 6, 23, 0.25)`,
      }}
    >
      <div className="flex h-full flex-col">
        <div className="px-6 pt-6 text-center">
          <h4
            className="text-[1.2rem] leading-6 font-semibold tracking-wide"
            style={{ color: BRAND.accent }}
          >
            {data.title}
          </h4>
        </div>

        <div
          ref={bodyRef}
          className={`grow px-6 mt-2 pb-6 ${
            needsScroll
              ? "overflow-y-auto overscroll-contain"
              : "overflow-hidden"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          <p className="opacity-80">
            {data.longDesc ||
              "We keep it simple and reliable — so you can trust us to get it done right."}
          </p>

          {data.bullets?.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm opacity-90">
              {data.bullets.map((b, i) => (
                <li key={i}>— {b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <FlippyInteractive
      className="h-[320px] sm:h-[340px] md:h-[360px]"
      front={Front}
      back={Back}
    />
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 bg-base-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Our Services</h2>
        <p className="opacity-80 mt-1">Design • Build • Grow</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.id} data={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
