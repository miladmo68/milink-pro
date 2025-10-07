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

import React from "react";
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

// icon map
const iconMap = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
};

// ===== Hover-only flip (بدون state → بدون لرزش)
function FlippyHover({ front, back, className = "" }) {
  return (
    <div
      className={`group relative ${className}`}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        // فقط با هاور می‌چرخیم؛ وقتی موس بیرون رفت برمی‌گرده
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full rounded-2xl ring-1 ring-primary/15
                   [transform-style:preserve-3d] transform-gpu will-change-transform"
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl">
          {front}
        </div>

        {/* Back */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl">
          {back}
        </div>
      </motion.div>
    </div>
  );
}

function ServiceCard({ data, onOpen }) {
  const Icon = iconMap[data.icon] || CodeBracketIcon;

  // ===== رنگ‌بندی دارک‌بلو (بدون افکت‌های جابه‌جایی برای جلوگیری از jitter)
  const Front = (
    <article
      className="relative h-full p-6 rounded-2xl
                 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900
                 text-slate-100 shadow-md ring-1 ring-slate-700/40"
      aria-label={`${data.title} front`}
    >
      {data.badge && (
        <span className="badge badge-primary absolute right-3 top-3">
          {data.badge}
        </span>
      )}

      <div className="flex h-full flex-col items-center justify-center text-center gap-3">
        <Icon className="h-12 w-12 text-indigo-300" />
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <p className="opacity-80 max-w-[28ch]">{data.desc}</p>

        <span className="mt-3 text-xs opacity-60 select-none">
          Hover to flip
        </span>
      </div>
    </article>
  );

  const Back = (
    <article
      className="relative h-full p-6 rounded-2xl
                 bg-base-100/95 text-base-content backdrop-blur
                 ring-1 ring-indigo-700/30 shadow-xl"
      aria-label={`${data.title} back`}
    >
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h4 className="text-lg font-semibold">{data.title}</h4>
        <p className="mt-2 opacity-80 max-w-[34ch]">
          {data.longDesc ||
            "We keep it simple and reliable — so you can trust us to get it done right."}
        </p>

        {data.bullets?.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm opacity-90 text-left mx-auto max-w-xs">
            {data.bullets.map((b, i) => (
              <li key={i}>— {b}</li>
            ))}
          </ul>
        )}

        {/* فقط Open details نگه‌داشته شد */}
        <button
          className="btn btn-sm btn-primary mt-5"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.({
              title: data.title,
              text:
                data.longDesc ||
                "We keep it simple and reliable — so you can trust us to get it done right.",
              list: data.bullets || [],
            });
          }}
        >
          Open details
        </button>
      </div>
    </article>
  );

  return (
    <FlippyHover
      className="h-[320px] sm:h-[340px] md:h-[360px]"
      front={Front}
      back={Back}
    />
  );
}

export default function Services({ onOpen }) {
  return (
    <section id="services" className="py-20 bg-base-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Our Services</h2>
        <p className="opacity-80 mt-1">Design • Build • Grow</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.id} data={s} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
