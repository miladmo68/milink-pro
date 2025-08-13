import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Hero({ onOpenLightbox }) {
  const videoRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  // ===== Motion variants =====
  const parent = {
    hidden: {},
    visible: { transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
  };
  const fromTop = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };
  const fromBottom = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const fadeInWithCTA = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
    },
  };

  return (
    <section id="home" className="relative z-0 bg-transparent">
      {/* ===== BACKGROUND STACK (pushed behind content) ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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
      <div className="relative z-10">
        <div className="container grid items-center gap-10 md:grid-cols-2 py-10 md:py-14">
          {/* Left column */}
          <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left"
            variants={parent}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="badge badge-primary badge-lg mb-6"
              variants={fadeInWithCTA}
              whileHover={{ scale: 1.07 }}
            >
              Milink Agency
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="leading-tight mb-5 md:mb-6"
              variants={fromTop}
            >
              Build <br className="block md:hidden" />
              <span className="text-primary">Your Digital</span>{" "}
              <br className="block md:hidden" />
              Presence
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              className="mt-1 md:mt-2 mb-8 md:mb-10 text-lg opacity-90 max-w-prose md:max-w-xl"
              variants={fromBottom}
            >
              Grow your business with high-performing websites, premium
              branding, and proven digital strategies that convert visitors into
              customers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              variants={fadeIn}
            >
              <a href="#contact" className="btn btn-primary">
                Get a Quote
              </a>
              <a href="#work" className="btn btn-ghost">
                See our work
              </a>
            </motion.div>

            {/* Inline stats */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
              variants={fadeIn}
            >
              <span className="rounded-box bg-base-200 px-4 py-2">
                Web Design
              </span>
              <span className="rounded-box bg-base-200 px-4 py-2">
                SEO-Ready
              </span>
              <span className="rounded-box bg-base-200 px-4 py-2">
                E-Commerce
              </span>
            </motion.div>
          </motion.div>

          {/* Right column (image) — FULLY visible on mobile */}
          <div className="relative flex justify-center md:justify-end">
            <div
              className="
                w-full md:w-auto
                min-h-[280px] sm:min-h-[340px]
                aspect-[4/5]
                rounded-3xl overflow-hidden shadow-2xl bg-base-200/60
                max-w-none sm:max-w-sm md:max-w-md lg:max-w-lg
              "
            >
              <picture>
                {/* اگر بعداً avif/webp اضافه کردی، اینجا بذار */}
                <img
                  src="/assets/img/3.jpg"
                  alt="Showcase"
                  className="block h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                  style={{
                    WebkitTransform: "translateZ(0)",
                    filter: "brightness(0.95) contrast(0.95)",
                  }}
                />
              </picture>

              <button
                className="btn btn-sm btn-ghost absolute right-3 top-3"
                onClick={() => onOpenLightbox?.("/assets/img/3.jpg")}
                aria-label="Expand"
                title="Expand"
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

// import { useRef, useState } from "react";
// import { motion } from "framer-motion";

// export default function Hero({ onOpenLightbox }) {
//   const videoRef = useRef(null);
//   const [fallback, setFallback] = useState(false);

//   // ===== Motion variants =====
//   const parent = {
//     hidden: {},
//     visible: { transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
//   };
//   const fromTop = {
//     hidden: { opacity: 0, y: -80 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.9, ease: "easeOut" },
//     },
//   };
//   const fromBottom = {
//     hidden: { opacity: 0, y: 80 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.9, ease: "easeOut" },
//     },
//   };
//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
//   };
//   const fadeInWithCTA = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { duration: 0.8, ease: "easeOut", delay: 0.8 },
//     },
//   };

//   return (
//     <section id="home" className="relative bg-transparent">
//       {/* ===== BACKGROUND STACK ===== */}
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         {!fallback && (
//           <video
//             ref={videoRef}
//             className="absolute inset-0 h-full w-full object-cover"
//             src="/assets/video/hero.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             onError={() => setFallback(true)}
//             aria-hidden="true"
//           />
//         )}
//         <div className="hero-plain hero-mask-90" aria-hidden="true" />
//         <div className="hero-bleed hero-mask-90" aria-hidden="true" />
//         <div className="hero-grid grid-fade hero-mask-90" aria-hidden="true" />
//         <div
//           className="hero-grid hero-grid-center hero-mask-90"
//           aria-hidden="true"
//         />
//         <div className="hero-highlight hero-mask-90" aria-hidden="true" />
//         <div className="hero-shadow hero-mask-90" aria-hidden="true" />
//         <div className="hero-topfade" aria-hidden="true" />
//         <div className="hero-vignette" aria-hidden="true" />
//       </div>

//       {/* ===== FOREGROUND CONTENT ===== */}
//       <div className="relative z-10">
//         <div className="container grid items-center gap-10 md:grid-cols-2 py-10 md:py-14">
//           {/* Left column (exact order like screenshot) */}
//           <motion.div
//             className="flex flex-col items-start text-left"
//             variants={parent}
//             initial="hidden"
//             animate="visible"
//           >
//             {/* Badge */}
//             <motion.div
//               className="badge badge-primary badge-lg mb-6"
//               variants={fadeInWithCTA}
//               whileHover={{ scale: 1.07 }}
//             >
//               Milink Agency
//             </motion.div>

//             {/* Heading */}
//             <motion.h1
//               className="leading-tight mb-5 md:mb-6"
//               variants={fromTop}
//             >
//               Build <br className="block md:hidden" />
//               <span className="text-primary">Your Digital</span>{" "}
//               <br className="block md:hidden" />
//               Presence
//             </motion.h1>

//             {/* Paragraph */}
//             <motion.p
//               className="mt-1 md:mt-2 mb-8 md:mb-10 text-lg opacity-90 max-w-prose md:max-w-xl"
//               variants={fromBottom}
//             >
//               Grow your business with high-performing websites, premium
//               branding, and proven digital strategies that convert visitors into
//               customers.
//             </motion.p>

//             {/* CTAs */}
//             <motion.div
//               className="flex flex-col sm:flex-row gap-3"
//               variants={fadeIn}
//             >
//               <a href="#contact" className="btn btn-primary">
//                 Get a Quote
//               </a>
//               <a href="#work" className="btn btn-ghost">
//                 See our work
//               </a>
//             </motion.div>

//             {/* Inline stats (چسبیده مثل قبل) */}
//             <motion.div
//               className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
//               variants={fadeIn}
//             >
//               <span className="rounded-box bg-base-200 px-4 py-2">
//                 Web Design
//               </span>
//               <span className="rounded-box bg-base-200 px-4 py-2">
//                 SEO-Ready
//               </span>
//               <span className="rounded-box bg-base-200 px-4 py-2">
//                 E-Commerce
//               </span>
//             </motion.div>
//           </motion.div>

//           {/* Right column (image) */}
//           <div className="relative flex justify-center md:justify-end">
//             <div className="aspect-[4/5] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-base-200/60">
//               <img
//                 src="/assets/img/3.jpg"
//                 alt="Showcase"
//                 className="h-full w-full object-cover"
//                 loading="eager"
//                 style={{ filter: "brightness(0.95) contrast(0.95)" }}
//               />
//               <button
//                 className="btn btn-sm btn-ghost absolute right-3 top-3"
//                 onClick={() => onOpenLightbox?.("/assets/img/3.jpg")}
//                 aria-label="Expand"
//                 title="Expand"
//               >
//                 ⤢
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
