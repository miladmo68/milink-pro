// import { useEffect, useState } from "react";
// import { nav } from "../data/content.js";
// import { SITE } from "../config/siteConfig.js";
// import ThemeToggle from "./ThemeToggle.jsx";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import LogoFancy from "./LogoFancy.jsx";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const baseHeight = 80;
//   const navH = open ? baseHeight + nav.length * 44 : baseHeight;

//   return (
//     <>
//       <header
//         className={`fixed inset-x-0 top-0 z-50 transition-all
//         ${
//           SITE.enableStickyBlur && scrolled
//             ? "backdrop-blur bg-base-100/70 shadow-[0_10px_28px_-18px_rgba(59,130,246,0.55)]"
//             : "bg-transparent"
//         }`}
//         style={{ height: baseHeight }}
//       >
//         <div className="container navbar py-4">
//           {/* Logo */}
//           <div className="flex-1">
//             <LogoFancy
//               className="flex items-center font-[sans-serif]"
//               idleSrc="/logo.png"
//               idleAlt="MILINK Logo"
//               idleTitle="MILINK"
//               idleSubtitle="DIGITAL AGENCY"
//               hoverTitle="Design • Launch • Scale"
//               gradientClass="gradient-text"
//               iconGap={0}
//               blockShiftY={1}
//               hoverCenterShiftY={+1}
//             />
//           </div>

//           {/* Desktop nav */}
//           <nav className="hidden md:flex gap-6">
//             {nav.map((n, i) => (
//               <a
//                 key={i}
//                 href={n.href}
//                 className="relative inline-flex items-center
//                   after:content-[''] after:absolute after:-bottom-1 after:left-0
//                   after:h-[1.5px] after:w-full after:bg-current
//                   after:scale-x-0 after:origin-right
//                   after:transition-transform after:duration-300
//                   hover:after:scale-x-100 hover:after:origin-left"
//               >
//                 {n.label}
//               </a>
//             ))}
//           </nav>

//           {/* Actions */}
//           <div className="flex items-center gap-3">
//             <ThemeToggle />

//             {/* --- Desktop CTA (Framer Motion) --- */}
//             <motion.a
//               href="#contact"
//               whileHover={{ scale: 1.06, y: -1 }}
//               whileTap={{ scale: 0.98 }}
//               transition={{
//                 type: "spring",
//                 stiffness: 420,
//                 damping: 28,
//                 mass: 0.6,
//               }}
//               className="
//                 relative hidden md:inline-flex btn btn-primary btn-sm
//                 will-change-transform overflow-hidden group
//                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
//                 hover:brightness-90 hover:saturate-110
//                 [box-shadow:0_8px_22px_-12px_rgba(59,130,246,0.55)]
//                 hover:[box-shadow:0_18px_46px_-14px_rgba(59,130,246,0.65)]
//               "
//             >
//               <span className="relative z-10">Book a Call</span>

//               {/* لایه‌ی تیره‌تر روی هاور */}
//               <span
//                 className="
//                   pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
//                   transition-opacity duration-300 bg-black/10
//                 "
//               />

//               {/* Glow رادیال هنگام هاور */}
//               <span
//                 className="
//                   pointer-events-none absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100
//                   transition-opacity duration-500 blur-md
//                   bg-[radial-gradient(120px_60px_at_center,theme(colors.primary/40),transparent_70%)]
//                 "
//               />
//             </motion.a>

//             {/* Mobile toggle */}
//             <button
//               className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-transparent"
//               onClick={() => setOpen((v) => !v)}
//               aria-label={open ? "Close menu" : "Open menu"}
//             >
//               {open ? (
//                 <XMarkIcon className="h-7 w-7" />
//               ) : (
//                 <Bars3Icon className="h-7 w-7" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile dropdown (Animated) */}
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               key="mobileMenu"
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ type: "tween", duration: 0.22 }}
//               className="md:hidden bg-base-100 border-t overflow-hidden"
//             >
//               <div className="container py-4 flex flex-col items-center text-center gap-1">
//                 {nav.map((n, i) => (
//                   <motion.a
//                     key={i}
//                     href={n.href}
//                     onClick={() => setOpen(false)}
//                     initial={{ y: 8, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{
//                       delay: 0.03 * i,
//                       type: "spring",
//                       stiffness: 420,
//                       damping: 30,
//                     }}
//                     className="py-2"
//                   >
//                     {n.label}
//                   </motion.a>
//                 ))}

//                 {/* --- Mobile CTA با افکت مشابه --- */}
//                 <motion.a
//                   href="#contact"
//                   onClick={() => setOpen(false)}
//                   whileHover={{ scale: 1.04, y: -1 }}
//                   whileTap={{ scale: 0.98 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 420,
//                     damping: 28,
//                     mass: 0.6,
//                   }}
//                   className="
//                     mt-2 relative inline-flex btn btn-primary btn-md
//                     will-change-transform overflow-hidden group
//                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
//                     hover:brightness-90 hover:saturate-110
//                     [box-shadow:0_8px_22px_-12px_rgba(59,130,246,0.55)]
//                     hover:[box-shadow:0_18px_46px_-14px_rgba(59,130,246,0.65)]
//                   "
//                 >
//                   <span className="relative z-10">Book a Call</span>
//                   <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10" />
//                   <span className="pointer-events-none absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-[radial-gradient(120px_60px_at_center,theme(colors.primary/40),transparent_70%)]" />
//                 </motion.a>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </header>

//       {/* Spacer */}
//       <div style={{ height: navH }} aria-hidden="true" />
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LogoFancy from "./LogoFancy.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseHeight = 80;
  const navH = open ? baseHeight + nav.length * 44 : baseHeight;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all
        ${
          SITE.enableStickyBlur && scrolled
            ? "backdrop-blur bg-base-100/70 shadow-[0_10px_28px_-18px_rgba(59,130,246,0.55)]"
            : "bg-transparent"
        }`}
        style={{ height: baseHeight }}
      >
        <div className="container navbar py-4">
          {/* Logo */}
          <div className="flex-1">
            <LogoFancy
              className="flex items-center font-[sans-serif]"
              idleSrc="/logo.png"
              idleAlt="MILINK Logo"
              idleTitle="MILINK"
              idleSubtitle="DIGITAL AGENCY"
              hoverTitle="Design • Launch • Scale"
              gradientClass="gradient-text"
              iconGap={0}
              blockShiftY={1}
              hoverCenterShiftY={+1}
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6">
            {nav.map((n, i) => (
              <a
                key={i}
                href={n.href}
                className="relative inline-flex items-center
                  after:content-[''] after:absolute after:-bottom-1 after:left-0
                  after:h-[1.5px] after:w-full after:bg-current
                  after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100 hover:after:origin-left"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* === Book a Call (glass chip + blue tint + radial glow on hover) === */}
            <motion.a
              href="#contact"
              whileHover={{
                y: -2,
                scale: 1.03,
                // ته‌رنگ آبی خیلی لطیف
                backgroundColor: "rgba(245, 248, 255, 0.68)",
                // glow رادیال نرم از مرکز
                backgroundImage:
                  "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
                borderColor: "rgba(0,96,255,0.65)",
                filter: "brightness(1.02) saturate(1.05)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
                mass: 0.6,
              }}
              className="
                relative hidden md:inline-flex select-none items-center gap-2
                rounded-full px-4 py-2 text-sm font-semibold
                will-change-transform overflow-hidden
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
              "
              style={{
                color: "#0060FF", // متن ثابت
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(0,96,255,0.45)",
                boxShadow:
                  "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
                // حالت عادی بدون رادیال
                backgroundImage: "none",
                backdropFilter: "blur(10px)",
                transition:
                  "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
              }}
            >
              {/* نقطه‌ی آبی براق سمت چپ */}
              <span
                className="inline-block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background:
                    "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.85)",
                  transition: "box-shadow .2s",
                }}
              />
              <span>Book a Call</span>
            </motion.a>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-transparent"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown (Animated) */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobileMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.22 }}
              className="md:hidden bg-base-100 border-t overflow-hidden"
            >
              <div className="container py-4 flex flex-col items-center text-center gap-1">
                {nav.map((n, i) => (
                  <motion.a
                    key={i}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.03 * i,
                      type: "spring",
                      stiffness: 420,
                      damping: 30,
                    }}
                    className="py-2"
                  >
                    {n.label}
                  </motion.a>
                ))}

                {/* --- Mobile Book a Call (همان افکت‌ها) --- */}
                <motion.a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  whileHover={{
                    y: -1,
                    scale: 1.02,
                    backgroundColor: "rgba(245, 248, 255, 0.68)",
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
                    boxShadow:
                      "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
                    borderColor: "rgba(0,96,255,0.65)",
                    filter: "brightness(1.02) saturate(1.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                    mass: 0.6,
                  }}
                  className="
                    mt-2 inline-flex select-none items-center gap-2
                    rounded-full px-4 py-3 text-sm font-semibold
                    will-change-transform overflow-hidden
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
                  "
                  style={{
                    color: "#0060FF",
                    background: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(0,96,255,0.45)",
                    boxShadow:
                      "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
                    backgroundImage: "none",
                    backdropFilter: "blur(10px)",
                    transition:
                      "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
                  }}
                >
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      background:
                        "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
                      boxShadow: "0 0 10px rgba(59,130,246,0.85)",
                    }}
                  />
                  <span>Book a Call</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div style={{ height: navH }} aria-hidden="true" />
    </>
  );
}
