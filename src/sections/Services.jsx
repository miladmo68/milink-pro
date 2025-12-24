// import React, { useEffect, useRef, useState } from "react";
// import { motion, useInView } from "framer-motion";
// import {
//   CodeBracketIcon,
//   DevicePhoneMobileIcon,
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   WrenchScrewdriverIcon,
//   PaintBrushIcon,
// } from "@heroicons/react/24/outline";

// import { services } from "../data/content.js";
// import { Reveal } from "../components/scroll-reveal.jsx";

// /* ===== Brand palette (همان قبلی) ===== */
// const BRAND = {
//   baseFrom: "#0b1220",
//   baseVia: "#0a0f1a",
//   baseTo: "#0e1b33",
//   accent: "#3b82f6",
//   accentSoft: "#60a5fa",
// };

// /* ===== Icons map ===== */
// const iconMap = {
//   CodeBracketIcon,
//   DevicePhoneMobileIcon,
//   MagnifyingGlassIcon,
//   ShoppingCartIcon,
//   WrenchScrewdriverIcon,
//   PaintBrushIcon,
// };

// /* ===== Motion variants: دقیقاً مثل Work، ورود/خروج نرم ===== */
// const itemVariants = {
//   hidden: { opacity: 0, y: 18, scale: 0.98 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// /* ===== کارت را دوجهته کنترل می‌کند: وقتی در دید است → show، وقتی خارج شد → hidden ===== */
// function InOutItem({ children, index = 0, delayStep = 0.06 }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, {
//     // مثل Work: کمی که کارت وارد شد تریگر بزن
//     amount: 0.18,
//     margin: "-10% 0% -10% 0%",
//   });

//   return (
//     <motion.div
//       ref={ref}
//       initial="hidden"
//       animate={inView ? "show" : "hidden"}
//       variants={itemVariants}
//       transition={{
//         duration: 0.5,
//         ease: [0.22, 1, 0.36, 1],
//         delay: index * delayStep, // دونه‌دونه
//       }}
//       className="will-change-transform"
//     >
//       {children}
//     </motion.div>
//   );
// }

// /* ===== FlippyInteractive (بدون تغییر ظاهری) ===== */
// function FlippyInteractive({ front, back, className = "" }) {
//   const [flipped, setFlipped] = useState(false);

//   return (
//     <div
//       className={`relative ${className}`}
//       style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
//       onMouseEnter={() => setFlipped(true)}
//       onMouseLeave={() => setFlipped(false)}
//       onTouchStart={(e) => {
//         e.stopPropagation();
//         setFlipped((v) => !v);
//       }}
//     >
//       <motion.div
//         animate={{ rotateY: flipped ? 180 : 0 }}
//         transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//         className="relative w-full h-full rounded-2xl"
//         style={{
//           transformStyle: "preserve-3d",
//           WebkitTransformStyle: "preserve-3d",
//           willChange: "transform",
//         }}
//       >
//         {/* Front */}
//         <div
//           className="absolute inset-0 rounded-2xl overflow-hidden"
//           style={{
//             backfaceVisibility: "hidden",
//             WebkitBackfaceVisibility: "hidden",
//             transform: "rotateY(0deg) translateZ(0)",
//             WebkitTransform: "rotateY(0deg) translateZ(0)",
//           }}
//         >
//           {front}
//         </div>

//         {/* Back */}
//         <div
//           className="absolute inset-0 rounded-2xl overflow-hidden"
//           style={{
//             backfaceVisibility: "hidden",
//             WebkitBackfaceVisibility: "hidden",
//             transform: "rotateY(180deg) translateZ(0.1px)",
//             WebkitTransform: "rotateY(180deg) translateZ(0.1px)",
//           }}
//         >
//           {back}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// /* ===== Badge motion (بدون تغییر) ===== */
// const badgeMotion = {
//   animate: { y: [0, -2, 0], scale: [1, 1.06, 1] },
//   transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
// };

// /* ===== ServiceCard (دیزاین دست‌نخورده) ===== */
// function ServiceCard({ data }) {
//   const Icon = iconMap[data.icon] || CodeBracketIcon;

//   // فعال فقط وقتی پشت کارت متن زیادی داشت
//   const bodyRef = useRef(null);
//   const [needsScroll, setNeedsScroll] = useState(false);
//   useEffect(() => {
//     const check = () => {
//       const el = bodyRef.current;
//       if (el) setNeedsScroll(el.scrollHeight > el.clientHeight + 2);
//     };
//     check();
//     const ro = new ResizeObserver(check);
//     if (bodyRef.current) ro.observe(bodyRef.current);
//     window.addEventListener("resize", check);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", check);
//     };
//   }, []);

//   const Front = (
//     <article
//       className="relative h-full p-6 rounded-2xl text-slate-100 shadow-md ring-1"
//       aria-label={`${data.title} front`}
//       style={{
//         background: `linear-gradient(135deg, ${BRAND.baseFrom} 0%, ${BRAND.baseVia} 55%, ${BRAND.baseTo} 100%)`,
//         boxShadow: `0 0 0 1px rgba(59,130,246,0.18), 0 10px 28px rgba(0,0,0,0.35)`,
//         borderColor: "rgba(59,130,246,0.28)",
//       }}
//     >
//       {data.badge && (
//         <motion.span
//           {...badgeMotion}
//           className="badge absolute right-3 top-3 text-slate-900"
//           style={{ backgroundColor: BRAND.accent, borderColor: "transparent" }}
//         >
//           {data.badge}
//         </motion.span>
//       )}

//       <div className="flex h-full flex-col items-center justify-center text-center gap-3 relative z-[1]">
//         <Icon className="h-12 w-12" style={{ color: BRAND.accentSoft }} />
//         <h3 className="text-xl font-semibold">{data.title}</h3>
//         <p className="opacity-80 max-w-[28ch]">{data.desc}</p>

//         <span
//           className="mt-3 text-sm font-medium tracking-wide select-none"
//           style={{ color: BRAND.accent }}
//         >
//           More details
//         </span>
//       </div>

//       {/* Glow پایین راست */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute right-[-60px] bottom-[-60px] w-[260px] h-[260px] rounded-full opacity-25 blur-2xl"
//         style={{
//           background: `radial-gradient(50% 50% at 50% 50%, ${BRAND.accentSoft} 0%, rgba(96,165,250,0) 60%)`,
//         }}
//       />
//     </article>
//   );

//   const Back = (
//     <article
//       className="relative h-full rounded-2xl bg-base-100/95 text-base-content backdrop-blur"
//       aria-label={`${data.title} back`}
//       style={{
//         boxShadow: `0 0 0 1px rgba(59,130,246,0.28) inset, 0 10px 28px rgba(2, 6, 23, 0.25)`,
//       }}
//     >
//       <div className="flex h-full flex-col">
//         <div className="px-6 pt-6 text-center">
//           <h4
//             className="text-[1.2rem] leading-6 font-semibold tracking-wide"
//             style={{ color: BRAND.accent }}
//           >
//             {data.title}
//           </h4>
//         </div>

//         <div
//           ref={bodyRef}
//           className={`grow px-6 mt-2 pb-6 ${
//             needsScroll
//               ? "overflow-y-auto overscroll-contain"
//               : "overflow-hidden"
//           }`}
//           style={{ scrollbarWidth: "thin" }}
//         >
//           <p className="opacity-80">
//             {data.longDesc ||
//               "We keep it simple and reliable — so you can trust us to get it done right."}
//           </p>

//           {data.bullets?.length > 0 && (
//             <ul className="mt-3 space-y-1.5 text-sm opacity-90">
//               {data.bullets.map((b, i) => (
//                 <li key={i}>— {b}</li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </article>
//   );

//   return (
//     <FlippyInteractive
//       className="h-[320px] sm:h-[340px] md:h-[360px]"
//       front={Front}
//       back={Back}
//     />
//   );
// }

// /* ===== Services Section ===== */
// export default function Services() {
//   return (
//     <section id="services" className="py-20 bg-base-100">
//       <div className="container mx-auto px-4">
//         {/* Header (بدون تغییر) */}
//         <div className="max-w-3xl mx-auto text-center">
//           <Reveal from="up" distance={20}>
//             <h2 className="text-3xl md:text-4xl font-black tracking-tight">
//               Our Services
//             </h2>
//           </Reveal>
//           <Reveal from="up" distance={16} delay={0.05}>
//             <p className="opacity-80 mt-2">Design • Build • Grow</p>
//           </Reveal>
//         </div>

//         {/* Grid — فقط هر کارت داخل InOutItem پیچیده شده تا ورود/خروج مستقل داشته باشه */}
//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map((s, i) => (
//             <InOutItem key={s.id} index={i}>
//               <ServiceCard data={s} />
//             </InOutItem>
//           ))}
//         </div>

//         <div className="mt-10 grid place-items-center">
//           <div className="h-0.5 w-24 bg-primary/70 rounded-full" />
//         </div>
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

import { services } from "../data/content.js";
import { Reveal } from "../components/scroll-reveal.jsx";

/* ===== Brand palette (Dark = همان قبلی) ===== */
const BRAND = {
  baseFrom: "#0b1220",
  baseVia: "#0a0f1a",
  baseTo: "#0e1b33",
  accent: "#3b82f6",
  accentSoft: "#60a5fa",
};

/* ===== Light palette (فقط برای Light mode) ===== */
const BRAND_LIGHT = {
  baseFrom: "#ffffff",
  baseVia: "#f5f7ff",
  baseTo: "#eef3ff",
  text: "#0b1220",
  textMuted: "rgba(11,18,32,0.70)",
  ring: "rgba(59,130,246,0.22)",
  shadow: "0 10px 28px rgba(2, 6, 23, 0.10)",
};

/* ===== Icons map ===== */
const iconMap = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
};

/* ===== Motion variants: دقیقاً مثل Work ===== */
const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function InOutItem({ children, index = 0, delayStep = 0.06 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.18, margin: "-10% 0% -10% 0%" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={itemVariants}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * delayStep,
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/* ===== FlippyInteractive ===== */
function FlippyInteractive({ front, back, className = "" }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: "1200px", WebkitPerspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={(e) => {
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

const badgeMotion = {
  animate: { y: [0, -2, 0], scale: [1, 1.06, 1] },
  transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
};

/* ===== ServiceCard ===== */
function ServiceCard({ data, isLight }) {
  const Icon = iconMap[data.icon] || CodeBracketIcon;

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

  /* ========= FRONT: Dark same / Light readable ========= */
  const frontTextClass = isLight ? "text-slate-900" : "text-slate-100";
  const frontDescStyle = {
    color: isLight ? BRAND_LIGHT.textMuted : "rgba(241,245,249,0.80)",
  };

  const Front = (
    <article
      className={`relative h-full p-6 rounded-2xl shadow-md ring-1 ${frontTextClass}`}
      aria-label={`${data.title} front`}
      style={{
        background: isLight
          ? `linear-gradient(135deg, ${BRAND_LIGHT.baseFrom} 0%, ${BRAND_LIGHT.baseVia} 55%, ${BRAND_LIGHT.baseTo} 100%)`
          : `linear-gradient(135deg, ${BRAND.baseFrom} 0%, ${BRAND.baseVia} 55%, ${BRAND.baseTo} 100%)`,
        boxShadow: isLight
          ? `0 0 0 1px ${BRAND_LIGHT.ring}, ${BRAND_LIGHT.shadow}`
          : `0 0 0 1px rgba(59,130,246,0.18), 0 10px 28px rgba(0,0,0,0.35)`,
        borderColor: isLight
          ? "rgba(59,130,246,0.22)"
          : "rgba(59,130,246,0.28)",
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
        <p className="max-w-[28ch]" style={frontDescStyle}>
          {data.desc}
        </p>

        <span
          className="mt-3 text-sm font-medium tracking-wide select-none"
          style={{ color: BRAND.accent }}
        >
          More details
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-[-60px] bottom-[-60px] w-[260px] h-[260px] rounded-full blur-2xl"
        style={{
          opacity: isLight ? 0.18 : 0.25,
          background: `radial-gradient(50% 50% at 50% 50%, ${BRAND.accentSoft} 0%, rgba(96,165,250,0) 60%)`,
        }}
      />
    </article>
  );

  /* ========= BACK: already theme-friendly ========= */
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

/* ===== Services Section ===== */
export default function Services() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const el = document.documentElement;

    const compute = () => {
      const t = el.getAttribute("data-theme") || "";
      const lightNames = new Set([
        "light",
        "corporate",
        "winter",
        "cupcake",
        "bumblebee",
        "emerald",
      ]);
      setIsLight(lightNames.has(t));
    };

    compute();

    const obs = new MutationObserver(() => compute());
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal from="up" distance={20}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Our Services
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05}>
            <p className="opacity-80 mt-2">Design • Build • Grow</p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <InOutItem key={s.id} index={i}>
              <ServiceCard data={s} isLight={isLight} />
            </InOutItem>
          ))}
        </div>

        <div className="mt-10 grid place-items-center">
          <div className="h-0.5 w-24 bg-primary/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
