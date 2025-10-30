// // src/components/LogoFancy.jsx
// import { useState, useId, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function LogoFancy({
//   className = "",
//   href = "#home",
//   idleSrc = "/logo.png",
//   idleAlt = "MILINK Logo",

//   // متون (عادی و هاور)
//   idleTitle = "MILINK",
//   idleSubtitle = "DIGITAL AGENCY",
//   hoverTitle = "Design • Launch • Scale",

//   // استایل‌ها
//   gradientClass = "gradient-text",

//   // فاصله‌ها/چسبندگی‌ها
//   iconGap = 2, // فاصله آیکون تا متن (px) - نزدیک
//   blockShiftY = 0, // شیفت عمودی حالت عادی
//   hoverCenterShiftY = -1, // شیفت عمودی حالت هاور
// }) {
//   const [hovered, setHovered] = useState(false);
//   const labelId = useId();

//   // کلمات
//   const tIdle = useMemo(() => idleTitle.trim().split(/\s+/), [idleTitle]);
//   const tHover = useMemo(() => hoverTitle.trim().split(/\s+/), [hoverTitle]);
//   const tSub = useMemo(() => idleSubtitle.trim().split(/\s+/), [idleSubtitle]);

//   // واریانت‌ها
//   const blockV = {
//     hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
//     show: {
//       opacity: 1,
//       y: 0,
//       filter: "blur(0px)",
//       transition: { duration: 0.26 },
//     },
//     exit: {
//       opacity: 0,
//       y: -8,
//       filter: "blur(2px)",
//       transition: { duration: 0.2 },
//     },
//   };
//   const rowV = {
//     show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
//   };
//   const wordV = {
//     hidden: { y: 10, opacity: 0, filter: "blur(3px)" },
//     show: {
//       y: 0,
//       opacity: 1,
//       filter: "blur(0px)",
//       transition: { duration: 0.24 },
//     },
//   };

//   // فاصله‌ی کوچک بین کلمات
//   const WORD_GAP = "mr-[0.35ch]";

//   return (
//     <a
//       href={href}
//       className={`group relative inline-flex items-center select-none ${className}`}
//       aria-label="Home"
//       aria-labelledby={labelId}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onFocus={() => setHovered(true)}
//       onBlur={() => setHovered(false)}
//       style={{ gap: `${iconGap}px` }}
//     >
//       {/* آیکون (یک پله کوچک‌تر: h-9/md:h-12) */}
//       <div className="relative h-9 w-auto md:h-12 self-center">
//         <img
//           src={idleSrc}
//           alt={idleAlt}
//           className="h-11 w-auto md:h-14 pointer-events-none"
//           draggable="false"
//         />
//       </div>

//       {/* بلوک متن‌ها (همه چیز با هم انیمیت می‌شود) */}
//       <div
//         className="relative"
//         style={{
//           transform: `translateY(${
//             hovered ? hoverCenterShiftY : blockShiftY
//           }px)`,
//         }}
//       >
//         <div className="sr-only" id={labelId}>
//           {hovered ? hoverTitle : `${idleTitle} — ${idleSubtitle}`}
//         </div>

//         <AnimatePresence mode="wait" initial={false}>
//           {/* حالت عادی: عنوان + زیرتیتر (هر دو کوچک‌تر از قبل) */}
//           {!hovered ? (
//             <motion.div
//               key="idle-block"
//               variants={blockV}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               className="leading-tight"
//             >
//               {/* سطر بالا: MILINK  → یک پله پایین‌تر: text-lg/md:text-xl */}
//               <motion.div
//                 variants={rowV}
//                 initial="hidden"
//                 animate="show"
//                 className="flex flex-wrap items-end"
//               >
//                 {tIdle.map((w, i) => (
//                   <motion.span
//                     key={`idle-title-${i}-${w}`}
//                     variants={wordV}
//                     className={`text-xl md:text-2xl font-bold  tracking-[0.05em] ${WORD_GAP}`}
//                   >
//                     {w}
//                   </motion.span>
//                 ))}
//               </motion.div>

//               {/* سطر پایین: DIGITAL AGENCY  → یک پله پایین‌تر: 9px/10px و نزدیک */}
//               <motion.div
//                 variants={rowV}
//                 initial="hidden"
//                 animate="show"
//                 className="flex flex-wrap items-end -mt-1"
//               >
//                 {tSub.map((w, i) => (
//                   <motion.span
//                     key={`idle-sub-${i}-${w}`}
//                     variants={wordV}
//                     className={`text-[7px] md:text-[8px] font-light uppercase tracking-[0.23em] opacity-80 ${WORD_GAP}`}
//                   >
//                     {w}
//                   </motion.span>
//                 ))}
//               </motion.div>
//             </motion.div>
//           ) : (
//             /* حالت هاور: یک پله پایین‌تر: text-sm/md:text-base و کمی گرادیانت */
//             <motion.div
//               key="hover-block"
//               variants={blockV}
//               initial="hidden"
//               animate="show"
//               exit="exit"
//               className="leading-tight"
//             >
//               <motion.div
//                 variants={rowV}
//                 initial="hidden"
//                 animate="show"
//                 className="flex flex-wrap items-end"
//               >
//                 {tHover.map((w, i) => (
//                   <motion.span
//                     key={`hover-title-${i}-${w}`}
//                     variants={wordV}
//                     className={`text-sm md:text-base font-semibold ${gradientClass} ${WORD_GAP}`}
//                   >
//                     {w}
//                   </motion.span>
//                 ))}
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </a>
//   );
// }
// src/components/LogoFancy.jsx
import { useState, useId, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoFancy({
  className = "",
  href = "#home",
  idleSrc = "/logo.png",
  idleAlt = "MILINK Logo",

  // متون (عادی و هاور)
  idleTitle = "MILINK",
  idleSubtitle = "DIGITAL AGENCY",
  hoverTitle = "Design • Launch • Scale",

  // استایل‌ها
  gradientClass = "gradient-text",

  // فاصله‌ها/چسبندگی‌ها
  iconGap = 2, // فاصله آیکون تا متن (px)
  blockShiftY = 0, // شیفت عمودی حالت عادی
  hoverCenterShiftY = -1, // شیفت عمودی حالت هاور
}) {
  const [hovered, setHovered] = useState(false);
  const labelId = useId();

  // کلمات
  const tIdle = useMemo(() => idleTitle.trim().split(/\s+/), [idleTitle]);
  const tHover = useMemo(() => hoverTitle.trim().split(/\s+/), [hoverTitle]);
  const tSub = useMemo(() => idleSubtitle.trim().split(/\s+/), [idleSubtitle]);

  // واریانت‌ها
  const blockV = {
    hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.26 },
    },
    exit: {
      opacity: 0,
      y: -8,
      filter: "blur(2px)",
      transition: { duration: 0.2 },
    },
  };
  const rowV = {
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
  };
  const wordV = {
    hidden: { y: 10, opacity: 0, filter: "blur(3px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.24 },
    },
  };

  // فاصله‌ی بین کلمات (برای عادی و هاور جدا)
  const WORD_GAP_IDLE = "mr-[0.35ch]";
  const WORD_GAP_HOVER = "mr-[0.25ch]";

  return (
    <a
      href={href}
      className={`group relative inline-flex items-center select-none ${className}`}
      aria-label="Home"
      aria-labelledby={labelId}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ gap: `${iconGap}px` }}
    >
      {/* آیکون */}
      <div className="relative h-9 w-auto md:h-12 self-center">
        <img
          src={idleSrc}
          alt={idleAlt}
          className="h-11 w-auto md:h-14 pointer-events-none"
          draggable="false"
        />
      </div>

      {/* بلوک متن‌ها */}
      <div
        className="relative"
        style={{
          transform: `translateY(${
            hovered ? hoverCenterShiftY : blockShiftY
          }px)`,
        }}
      >
        <div className="sr-only" id={labelId}>
          {hovered ? hoverTitle : `${idleTitle} — ${idleSubtitle}`}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {/* حالت عادی: عنوان + زیرتیتر (کوچک و فشرده) */}
          {!hovered ? (
            <motion.div
              key="idle-block"
              variants={blockV}
              initial="hidden"
              animate="show"
              exit="exit"
              className="leading-tight"
            >
              {/* سطر بالا: MILINK */}
              <motion.div
                variants={rowV}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-end"
              >
                {tIdle.map((w, i) => (
                  <motion.span
                    key={`idle-title-${i}-${w}`}
                    variants={wordV}
                    className={`text-xl md:text-2xl font-bold tracking-[0.05em] ${WORD_GAP_IDLE}`}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.div>

              {/* سطر پایین: DIGITAL AGENCY */}
              <motion.div
                variants={rowV}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-end -mt-1"
              >
                {tSub.map((w, i) => (
                  <motion.span
                    key={`idle-sub-${i}-${w}`}
                    variants={wordV}
                    className={`text-[7px] md:text-[8px] font-light uppercase tracking-[0.23em] opacity-80 ${WORD_GAP_IDLE}`}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* حالت هاور: کوچیک‌تر و فشرده‌تر از قبل تا عرض کم بشه */
            <motion.div
              key="hover-block"
              variants={blockV}
              initial="hidden"
              animate="show"
              exit="exit"
              className="leading-tight"
            >
              <motion.div
                variants={rowV}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-end"
              >
                {tHover.map((w, i) => (
                  <motion.span
                    key={`hover-title-${i}-${w}`}
                    variants={wordV}
                    className={`text-[12px] md:text-[13px] font-medium ${gradientClass} tracking-[0.02em] ${WORD_GAP_HOVER}`}
                  >
                    {w}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </a>
  );
}
