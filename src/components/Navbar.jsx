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

//             {/* === Book a Call (glass chip + blue tint + radial glow on hover) === */}
//             <motion.a
//               href="#contact"
//               whileHover={{
//                 y: -2,
//                 scale: 1.03,
//                 // ته‌رنگ آبی خیلی لطیف
//                 backgroundColor: "rgba(245, 248, 255, 0.68)",
//                 // glow رادیال نرم از مرکز
//                 backgroundImage:
//                   "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
//                 boxShadow:
//                   "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
//                 borderColor: "rgba(0,96,255,0.65)",
//                 filter: "brightness(1.02) saturate(1.05)",
//               }}
//               whileTap={{ scale: 0.98 }}
//               transition={{
//                 type: "spring",
//                 stiffness: 420,
//                 damping: 28,
//                 mass: 0.6,
//               }}
//               className="
//                 relative hidden md:inline-flex select-none items-center gap-2
//                 rounded-full px-4 py-2 text-sm font-semibold
//                 will-change-transform overflow-hidden
//                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
//               "
//               style={{
//                 color: "#0060FF", // متن ثابت
//                 background: "rgba(255,255,255,0.55)",
//                 border: "1px solid rgba(0,96,255,0.45)",
//                 boxShadow:
//                   "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
//                 // حالت عادی بدون رادیال
//                 backgroundImage: "none",
//                 backdropFilter: "blur(10px)",
//                 transition:
//                   "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
//               }}
//             >
//               {/* نقطه‌ی آبی براق سمت چپ */}
//               <span
//                 className="inline-block rounded-full"
//                 style={{
//                   width: 8,
//                   height: 8,
//                   background:
//                     "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
//                   boxShadow: "0 0 10px rgba(59,130,246,0.85)",
//                   transition: "box-shadow .2s",
//                 }}
//               />
//               <span>Book a Call</span>
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

//                 {/* --- Mobile Book a Call (همان افکت‌ها) --- */}
//                 <motion.a
//                   href="#contact"
//                   onClick={() => setOpen(false)}
//                   whileHover={{
//                     y: -1,
//                     scale: 1.02,
//                     backgroundColor: "rgba(245, 248, 255, 0.68)",
//                     backgroundImage:
//                       "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
//                     boxShadow:
//                       "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
//                     borderColor: "rgba(0,96,255,0.65)",
//                     filter: "brightness(1.02) saturate(1.05)",
//                   }}
//                   whileTap={{ scale: 0.98 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 420,
//                     damping: 28,
//                     mass: 0.6,
//                   }}
//                   className="
//                     mt-2 inline-flex select-none items-center gap-2
//                     rounded-full px-4 py-3 text-sm font-semibold
//                     will-change-transform overflow-hidden
//                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
//                   "
//                   style={{
//                     color: "#0060FF",
//                     background: "rgba(255,255,255,0.55)",
//                     border: "1px solid rgba(0,96,255,0.45)",
//                     boxShadow:
//                       "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
//                     backgroundImage: "none",
//                     backdropFilter: "blur(10px)",
//                     transition:
//                       "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
//                   }}
//                 >
//                   <span
//                     className="inline-block rounded-full"
//                     style={{
//                       width: 8,
//                       height: 8,
//                       background:
//                         "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
//                       boxShadow: "0 0 10px rgba(59,130,246,0.85)",
//                     }}
//                   />
//                   <span>Book a Call</span>
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

// --------------------------------------------------------------

// import { useEffect, useState, useCallback } from "react";
// import { nav } from "../data/content.js";
// import { SITE } from "../config/siteConfig.js";
// import ThemeToggle from "./ThemeToggle.jsx"; // دسکتاپ
// import {
//   XMarkIcon,
//   ChevronRightIcon,
//   MoonIcon,
//   SunIcon,
// } from "@heroicons/react/24/outline";
// import { motion, AnimatePresence } from "framer-motion";
// import LogoFancy from "./LogoFancy.jsx";

// /* =========================
//    Mobile Theme Toggle (round, glassy, no square border)
//    + persistent theme via data-theme + localStorage
// ========================= */
// const THEME_KEY = "theme"; // 'light' | 'dark'

// function applyTheme(t) {
//   const root = document.documentElement;
//   root.setAttribute("data-theme", t);
//   try {
//     localStorage.setItem(THEME_KEY, t);
//   } catch {}
//   // Optional broadcast
//   window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
// }

// function getInitialTheme() {
//   if (typeof window === "undefined") return "light";
//   try {
//     const saved = localStorage.getItem(THEME_KEY);
//     if (saved === "light" || saved === "dark") return saved;
//   } catch {}
//   return window.matchMedia?.("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// }

// function ThemeToggleMobile() {
//   const [mode, setMode] = useState(getInitialTheme);
//   useEffect(() => applyTheme(mode), [mode]);
//   const toggle = useCallback(
//     () => setMode((m) => (m === "dark" ? "light" : "dark")),
//     []
//   );
//   return (
//     <button
//       onClick={toggle}
//       aria-label="Toggle theme"
//       title="Toggle theme"
//       className="
//         relative grid h-10 w-10 place-items-center rounded-full
//         active:scale-95 transition
//         border-0
//         bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_60%)]
//         backdrop-blur-[6px]
//         shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_0_18px_rgba(0,96,255,0.18)]
//       "
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute inset-0 rounded-full"
//         style={{ boxShadow: "0 0 18px rgba(0,96,255,0.20)" }}
//       />
//       {mode === "dark" ? (
//         <SunIcon className="h-5 w-5 text-white/90" />
//       ) : (
//         <MoonIcon className="h-5 w-5 text-white/90" />
//       )}
//     </button>
//   );
// }

// /* =========================
//    Burger Button (Mobile)
//    grey gradient lines (not white)
// ========================= */
// const BRAND = { blueGlow: "rgba(0,96,255,0.22)" };

// function BurgerButton({ onClick }) {
//   return (
//     <motion.button
//       onClick={onClick}
//       aria-label="Open menu"
//       whileTap={{ scale: 0.97, y: 1 }}
//       className="
//         group relative grid h-12 w-12 place-items-center rounded-full
//         transition-all duration-200 select-none touch-manipulation
//         border border-[rgba(255,255,255,0.12)]
//         shadow-[0_10px_28px_rgba(0,0,0,0.35)]
//         bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.25),rgba(255,255,255,0.05)_60%),linear-gradient(180deg,#0E1422,#0A101B)]
//       "
//       style={{
//         boxShadow: `inset 0 1px 2px rgba(255,255,255,0.08),
//            0 0 0 3px ${BRAND.blueGlow},
//            0 16px 40px rgba(0,0,0,0.38)`,
//       }}
//     >
//       <span
//         aria-hidden
//         className="pointer-events-none absolute inset-0 rounded-full"
//         style={{ boxShadow: `0 0 26px ${BRAND.blueGlow}` }}
//       />
//       <div className="flex flex-col gap-[6px]">
//         {[0, 1, 2].map((i) => (
//           <span
//             key={i}
//             className="
//               block h-[2.5px] w-6 rounded-full
//               shadow-[0_0_8px_rgba(255,255,255,0.25),0_0_10px_rgba(0,96,255,0.12)]
//             "
//             style={{
//               background:
//                 "linear-gradient(180deg, rgba(209,213,219,0.96), rgba(156,163,175,0.9))", // slate-300 -> gray-400
//             }}
//           />
//         ))}
//       </div>
//       <span
//         aria-hidden
//         className="pointer-events-none absolute -top-px left-[10%] right-[10%] h-px rounded-full opacity-60
//                    bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.35),transparent)]"
//       />
//     </motion.button>
//   );
// }

// /* =========================
//    Social Icon helper
// ========================= */
// function SocialIcon({ href, label, type }) {
//   return (
//     <a
//       href={href}
//       target={href.startsWith("http") ? "_blank" : undefined}
//       rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
//       aria-label={label}
//       className="grid h-10 w-10 place-items-center rounded-xl"
//       style={{
//         border: "1px solid rgba(255,255,255,0.12)",
//         background:
//           "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
//         boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
//         backdropFilter: "blur(6px)",
//       }}
//     >
//       {type === "ig" && (
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <rect
//             x="3"
//             y="3"
//             width="18"
//             height="18"
//             rx="5"
//             stroke="rgba(255,255,255,0.85)"
//             strokeWidth="1.5"
//           />
//           <circle
//             cx="12"
//             cy="12"
//             r="3.5"
//             stroke="rgba(255,255,255,0.85)"
//             strokeWidth="1.5"
//           />
//           <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.85)" />
//         </svg>
//       )}
//       {type === "wa" && (
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <path
//             d="M5 19l1.3-3.2A7 7 0 1119 12a7 7 0 01-10.9 5.8L5 19z"
//             stroke="rgba(255,255,255,0.85)"
//             strokeWidth="1.5"
//           />
//           <path
//             d="M10.2 8.8c.3-.2.5-.2.6 0l1.1 1.3c.1.1.1.3 0 .5l-.5.6c.4.7 1 1.3 1.7 1.7l.6-.5c.2-.1.4-.1.5 0l1.3 1.1c.2.1.2.3 0 .6-.6.8-1.6 1.1-2.5.8-1.7-.6-3-1.9-3.6-3.6-.3-.9 0-1.9.8-2.5z"
//             fill="rgba(255,255,255,0.85)"
//           />
//         </svg>
//       )}
//       {type === "mail" && (
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <rect
//             x="3"
//             y="5"
//             width="18"
//             height="14"
//             rx="2"
//             stroke="rgba(255,255,255,0.85)"
//             strokeWidth="1.5"
//           />
//           <path
//             d="M4 7l8 6 8-6"
//             stroke="rgba(255,255,255,0.85)"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//           />
//         </svg>
//       )}
//       {type === "fb" && (
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <path
//             d="M13.5 21v-7h2.2l.3-2.6h-2.5V9.2c0-.8.2-1.2 1.2-1.2h1.3V5.6c-.6-.1-1.3-.2-1.9-.2-2 0-3.4 1.2-3.4 3.5v1.5H8.8V14h2V21h2.7z"
//             fill="rgba(255,255,255,0.85)"
//           />
//         </svg>
//       )}
//     </a>
//   );
// }

// /* =========================
//    Navbar
// ========================= */
// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // قفل اسکرول وقتی منوی موبایل بازه
//   useEffect(() => {
//     document.body.classList.toggle("overflow-hidden", open);
//     return () => document.body.classList.remove("overflow-hidden");
//   }, [open]);

//   // هر بار open تغییر کرد، تم ذخیره‌شده رو دوباره روی html اعمال کن تا بعد از بستن منو هم بمونه
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(THEME_KEY);
//       if (saved === "light" || saved === "dark") {
//         document.documentElement.setAttribute("data-theme", saved);
//       }
//     } catch {}
//   }, [open]);

//   const baseHeight = 80;
//   const navH = open ? baseHeight + nav.length * 44 : baseHeight;

//   // انیمیشن آیتم‌های موبایل
//   const listVariants = {
//     hidden: {},
//     show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
//   };
//   const itemVariants = {
//     hidden: { y: 10, opacity: 0 },
//     show: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 },
//     },
//   };

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
//           {/* لوگو (مثل قبل) */}
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

//           {/* دسکتاپ: منو + ThemeToggle + Book a Call (بدون تغییر) */}
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

//           <div className="hidden md:flex items-center gap-3">
//             <ThemeToggle />
//             <motion.a
//               href="#contact"
//               whileHover={{
//                 y: -2,
//                 scale: 1.03,
//                 backgroundColor: "rgba(245, 248, 255, 0.68)",
//                 backgroundImage:
//                   "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
//                 boxShadow:
//                   "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
//                 borderColor: "rgba(0,96,255,0.65)",
//                 filter: "brightness(1.02) saturate(1.05)",
//               }}
//               whileTap={{ scale: 0.98 }}
//               transition={{
//                 type: "spring",
//                 stiffness: 420,
//                 damping: 28,
//                 mass: 0.6,
//               }}
//               className="
//                 relative inline-flex select-none items-center gap-2
//                 rounded-full px-4 py-2 text-sm font-semibold
//                 will-change-transform overflow-hidden
//                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
//               "
//               style={{
//                 color: "#0060FF",
//                 background: "rgba(255,255,255,0.55)",
//                 border: "1px solid rgba(0,96,255,0.45)",
//                 boxShadow:
//                   "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
//                 backgroundImage: "none",
//                 backdropFilter: "blur(10px)",
//                 transition:
//                   "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
//               }}
//             >
//               <span
//                 className="inline-block rounded-full"
//                 style={{
//                   width: 8,
//                   height: 8,
//                   background:
//                     "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
//                   boxShadow: "0 0 10px rgba(59,130,246,0.85)",
//                 }}
//               />
//               <span>Book a Call</span>
//             </motion.a>
//           </div>

//           {/* موبایل: فقط دکمه‌ی برگر (با خطوط خاکستری) */}
//           <div className="md:hidden">
//             <BurgerButton onClick={() => setOpen(true)} />
//           </div>
//         </div>

//         {/* موبایل: اوورلی تیره+بلور و دراور گلس */}
//         <AnimatePresence>
//           {open && (
//             <>
//               <motion.button
//                 key="overlay"
//                 onClick={() => setOpen(false)}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 aria-label="Close menu overlay"
//                 className="fixed inset-0 z-[95] md:hidden bg-[rgba(0,0,0,0.62)] backdrop-blur-[8px]"
//               />

//               <motion.aside
//                 key="drawer"
//                 initial={{ x: "110%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "110%" }}
//                 transition={{ type: "tween", duration: 0.28 }}
//                 drag="x"
//                 dragConstraints={{ left: 0, right: 120 }}
//                 dragElastic={0.06}
//                 onDragEnd={(e, info) => {
//                   if (info.offset.x > 60 || info.velocity.x > 300)
//                     setOpen(false);
//                 }}
//                 className="
//                   fixed right-0 top-0 z-[96] h-[100dvh] w-[min(380px,90vw)] p-4
//                   flex flex-col md:hidden touch-pan-y
//                   text-white
//                   border-l border-[rgba(0,96,255,0.25)]
//                   shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_60px_rgba(0,96,255,0.1)]
//                   pt-[max(16px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))]
//                 "
//                 style={{
//                   background:
//                     "linear-gradient(180deg, rgba(10,14,23,0.94), rgba(10,14,23,0.92))",
//                   backdropFilter: "blur(18px)",
//                 }}
//                 role="dialog"
//                 aria-modal="true"
//               >
//                 {/* Header: لوگو + ThemeToggleMobile + Close */}
//                 <div
//                   className="mb-4 flex items-center justify-between rounded-2xl p-3"
//                   style={{
//                     background:
//                       "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
//                     border: "1px solid rgba(255,255,255,0.12)",
//                     boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
//                   }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="h-12 w-12 rounded-2xl overflow-hidden grid place-items-center border"
//                       style={{
//                         borderColor: "rgba(255,255,255,0.14)",
//                         background: "linear-gradient(180deg, #0E1524, #0B111C)",
//                         boxShadow:
//                           "inset 0 1px 2px rgba(255,255,255,0.06), 0 10px 22px rgba(0,0,0,0.35)",
//                       }}
//                     >
//                       <img
//                         src="/logomobile%20menu.png"
//                         alt="Milink Digital Agency"
//                         className="h-10 w-10 object-contain"
//                         loading="eager"
//                         decoding="async"
//                       />
//                     </div>
//                     <div className="leading-tight">
//                       <div className="text-base font-semibold">Milink</div>
//                       <div
//                         className="text-sm"
//                         style={{ color: "rgba(255,255,255,0.72)" }}
//                       >
//                         Digital Agency
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <ThemeToggleMobile />
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="grid h-10 w-10 place-items-center rounded-xl"
//                       style={{
//                         border: "1px solid rgba(255,255,255,0.14)",
//                         background:
//                           "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
//                         boxShadow: "0 0 20px rgba(0,96,255,0.25)",
//                       }}
//                       aria-label="Close menu"
//                     >
//                       <XMarkIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Title */}
//                 <div className="px-1 pb-2">
//                   <div className="text-[13px] uppercase tracking-[0.22em] text-white/55">
//                     Navigation
//                   </div>
//                 </div>

//                 {/* Links (کارت‌های گلس) */}
//                 <motion.ul
//                   variants={listVariants}
//                   initial="hidden"
//                   animate="show"
//                   className="grid gap-3 overflow-y-auto pr-1"
//                   style={{ maxHeight: "calc(100dvh - 430px)" }}
//                 >
//                   {nav.map((n, i) => (
//                     <motion.li key={i} variants={itemVariants}>
//                       <a
//                         href={n.href}
//                         onClick={() => setOpen(false)}
//                         className="group relative flex items-center justify-between rounded-2xl px-4 py-4"
//                         style={{
//                           background:
//                             "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
//                           border: "1px solid rgba(255,255,255,0.12)",
//                           boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
//                           overflow: "hidden",
//                           transition:
//                             "transform .15s ease, box-shadow .2s ease, border-color .2s ease",
//                         }}
//                       >
//                         <span
//                           aria-hidden
//                           className="absolute left-0 top-0 h-full w-[3px] opacity-70"
//                           style={{
//                             background:
//                               "linear-gradient(180deg, rgba(0,96,255,0.8), rgba(0,96,255,0.2))",
//                           }}
//                         />
//                         <span
//                           aria-hidden
//                           className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl group-hover:opacity-100 transition-opacity duration-300"
//                           style={{
//                             background:
//                               "radial-gradient(140px 60px at 50% 30%, rgba(0,96,255,0.16), transparent 70%)",
//                           }}
//                         />
//                         <div className="relative z-10 flex items-center gap-3">
//                           <span
//                             className="h-2 w-2 rounded-full"
//                             style={{
//                               background:
//                                 "radial-gradient(circle at 40% 40%, #73A6FF, #0060FF 80%)",
//                               boxShadow: "0 0 10px rgba(0,96,255,0.55)",
//                             }}
//                           />
//                           <span className="text-[15px] font-medium tracking-wide">
//                             {n.label}
//                           </span>
//                         </div>
//                         <ChevronRightIcon
//                           className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
//                           style={{ color: "rgba(255,255,255,0.7)" }}
//                         />
//                       </a>
//                     </motion.li>
//                   ))}
//                 </motion.ul>

//                 {/* Divider */}
//                 <div
//                   className="mt-4 mb-2 h-px w-full"
//                   style={{
//                     background:
//                       "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
//                   }}
//                 />

//                 {/* Socials */}
//                 <div className="px-1 pb-2">
//                   <div className="text-[12px] uppercase tracking-[0.18em] text-white/45 mb-2">
//                     Connect
//                   </div>
//                   <div className="flex items-center justify-center gap-3">
//                     <SocialIcon
//                       href="https://milink.ca"
//                       label="Instagram"
//                       type="ig"
//                     />
//                     <SocialIcon
//                       href="https://wa.me/14376003139"
//                       label="WhatsApp"
//                       type="wa"
//                     />
//                     <SocialIcon
//                       href="mailto:info@milink.ca"
//                       label="Email"
//                       type="mail"
//                     />
//                     <SocialIcon
//                       href="https://milink.ca"
//                       label="Facebook"
//                       type="fb"
//                     />
//                   </div>
//                 </div>

//                 {/* Divider */}
//                 <div
//                   className="mt-3 mb-1 h-px w-full"
//                   style={{
//                     background:
//                       "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
//                   }}
//                 />

//                 {/* CTA (Book a Call) */}
//                 <div className="mt-auto pt-1">
//                   <motion.a
//                     href="#contact"
//                     onClick={() => setOpen(false)}
//                     whileHover={{
//                       y: -1,
//                       scale: 1.02,
//                       backgroundColor: "rgba(245, 248, 255, 0.68)",
//                       backgroundImage:
//                         "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
//                       boxShadow:
//                         "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
//                       borderColor: "rgba(0,96,255,0.65)",
//                       filter: "brightness(1.02) saturate(1.05)",
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 420,
//                       damping: 28,
//                       mass: 0.6,
//                     }}
//                     className="relative inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold will-change-transform overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60"
//                     style={{
//                       color: "#0060FF",
//                       background: "rgba(255,255,255,0.55)",
//                       border: "1px solid rgba(0,96,255,0.45)",
//                       boxShadow:
//                         "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
//                       backgroundImage: "none",
//                       backdropFilter: "blur(10px)",
//                       transition:
//                         "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
//                     }}
//                   >
//                     <span
//                       className="inline-block rounded-full"
//                       style={{
//                         width: 8,
//                         height: 8,
//                         background:
//                           "radial-gradient(circle at 30% 30%, #3B82F6, #0060FF 80%)",
//                         boxShadow: "0 0 10px rgba(59,130,246,0.85)",
//                       }}
//                     />
//                     Book a Call
//                   </motion.a>
//                 </div>
//               </motion.aside>
//             </>
//           )}
//         </AnimatePresence>
//       </header>

//       {/* Spacer */}
//       <div style={{ height: navH }} aria-hidden="true" />
//     </>
//   );
// }
import { useEffect, useState, useCallback, useRef } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx"; // دسکتاپ
import {
  XMarkIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import LogoFancy from "./LogoFancy.jsx";

/* =========================
   Mobile Theme Toggle (round, glassy) + persistence
========================= */
const THEME_KEY = "theme"; // 'light' | 'dark'

function applyTheme(t) {
  const root = document.documentElement;
  root.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
  window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeToggleMobile() {
  const [mode, setMode] = useState(getInitialTheme);
  useEffect(() => applyTheme(mode), [mode]);
  const toggle = useCallback(
    () => setMode((m) => (m === "dark" ? "light" : "dark")),
    []
  );
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="
        relative grid h-10 w-10 place-items-center rounded-full
        active:scale-95 transition border-0
        bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_60%)]
        backdrop-blur-[6px]
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_0_18px_rgba(0,96,255,0.18)]
      "
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: "0 0 18px rgba(0,96,255,0.20)" }}
      />
      {mode === "dark" ? (
        <SunIcon className="h-5 w-5 text-white/90" />
      ) : (
        <MoonIcon className="h-5 w-5 text-white/90" />
      )}
    </button>
  );
}

/* =========================
   Shared CTA (Desktop & Mobile)
   - موبایل: با prop ها میشه واید و بدون بردر
========================= */
function CTAButton({ onClick, borderless = false, wide = false }) {
  return (
    <motion.a
      href="#contact"
      onClick={onClick}
      whileHover={{
        y: -2,
        scale: 1.03,
        backgroundColor: "rgba(245, 248, 255, 0.68)",
        backgroundImage:
          "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.33), 0 0 14px rgba(0,96,255,0.22)",
        borderColor: borderless ? "transparent" : "rgba(0,96,255,0.65)",
        filter: "brightness(1.02) saturate(1.05)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.6 }}
      className={`
        relative inline-flex select-none items-center gap-2
        rounded-full text-sm font-semibold
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60
        ${wide ? "w-full justify-center px-4 py-3" : "px-4 py-2"}
      `}
      style={{
        color: "#0060FF",
        background: "rgba(255,255,255,0.55)",
        border: borderless ? "none" : "1px solid rgba(0,96,255,0.45)",
        boxShadow:
          "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)",
        backgroundImage: "none",
        backdropFilter: "blur(10px)",
        transition:
          "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
        overflow: "visible",
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
  );
}

/* =========================
   Burger Button (Mobile) — grey gradient lines
========================= */
const BRAND = { blueGlow: "rgba(0,96,255,0.22)" };

function BurgerButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Open menu"
      whileTap={{ scale: 0.97, y: 1 }}
      className="
        group relative grid h-12 w-12 place-items-center rounded-full
        transition-all duration-200 select-none touch-manipulation
        border border-[rgba(255,255,255,0.12)]
        shadow-[0_10px_28px_rgba(0,0,0,0.35)]
        bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.25),rgba(255,255,255,0.05)_60%),linear-gradient(180deg,#0E1422,#0A101B)]
      "
      style={{
        boxShadow: `inset 0 1px 2px rgba(255,255,255,0.08), 0 0 0 3px ${BRAND.blueGlow}, 0 16px 40px rgba(0,0,0,0.38)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 26px ${BRAND.blueGlow}` }}
      />
      <div className="flex flex-col gap-[6px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[2.5px] w-6 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.25),0_0_10px_rgba(0,96,255,0.12)]"
            style={{
              background:
                "linear-gradient(180deg, rgba(209,213,219,0.96), rgba(156,163,175,0.9))",
            }}
          />
        ))}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-[10%] right-[10%] h-px rounded-full opacity-60
                   bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.35),transparent)]"
      />
    </motion.button>
  );
}

/* =========================
   Social Icon helper (MOBILE: fully round)
========================= */
function SocialIcon({ href, label, type }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
        boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
      }}
    >
      {type === "ig" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.5"
          />
          <circle
            cx="12"
            cy="12"
            r="3.5"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.5"
          />
          <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.85)" />
        </svg>
      )}
      {type === "wa" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 19l1.3-3.2A7 7 0 1119 12a7 7 0 01-10.9 5.8L5 19z"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.5"
          />
          <path
            d="M10.2 8.8c.3-.2.5-.2.6 0l1.1 1.3c.1.1.1.3 0 .5l-.5.6c.4.7 1 1.3 1.7 1.7l.6-.5c.2-.1.4-.1.5 0l1.3 1.1c.2.1.2.3 0 .6-.6.8-1.6 1.1-2.5.8-1.7-.6-3-1.9-3.6-3.6-.3-.9 0-1.9.8-2.5z"
            fill="rgba(255,255,255,0.85)"
          />
        </svg>
      )}
      {type === "mail" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.5"
          />
          <path
            d="M4 7l8 6 8-6"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {type === "fb" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.5 21v-7h2.2l.3-2.6h-2.5V9.2c0-.8.2-1.2 1.2-1.2h1.3V5.6c-.6-.1-1.3-.2-1.9-.2-2 0-3.4 1.2-3.4 3.5v1.5H8.8V14h2V21h2.7z"
            fill="rgba(255,255,255,0.85)"
          />
        </svg>
      )}
    </a>
  );
}

/* =========================
   Navbar
========================= */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // قفل اسکرول وقتی منوی موبایل بازه
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // تم همیشه پایدار
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }, [open]);

  const baseHeight = 80;
  const navH = open ? baseHeight + nav.length * 44 : baseHeight;

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 },
    },
  };

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
          {/* لوگو (مثل قبل) */}
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

          {/* دسکتاپ: منو + ThemeToggle + CTA (بدون تغییر) */}
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

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <CTAButton /> {/* دسکتاپ: همون قبلی با بردر */}
          </div>

          {/* موبایل: برگر */}
          <div className="md:hidden">
            <BurgerButton onClick={() => setOpen(true)} />
          </div>
        </div>

        {/* موبایل: اوورلی و دراور */}
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                key="overlay"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label="Close menu overlay"
                className="fixed inset-0 z-[95] md:hidden bg-[rgba(0,0,0,0.62)] backdrop-blur-[8px]"
              />

              <motion.aside
                key="drawer"
                initial={{ x: "110%" }}
                animate={{ x: 0 }}
                exit={{ x: "110%" }}
                transition={{ type: "tween", duration: 0.28 }}
                drag="x"
                dragConstraints={{ left: 0, right: 120 }}
                dragElastic={0.06}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 60 || info.velocity.x > 300)
                    setOpen(false);
                }}
                className="
                  fixed right-0 top-0 z-[96] h-[100dvh] w-[min(380px,90vw)] p-4
                  flex flex-col md:hidden touch-pan-y text-white
                  border-l border-[rgba(0,96,255,0.25)]
                  shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_60px_rgba(0,96,255,0.1)]
                  pt-[max(16px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))]
                  overflow-x-visible
                "
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,14,23,0.94), rgba(10,14,23,0.92))",
                  backdropFilter: "blur(18px)",
                }}
                role="dialog"
                aria-modal="true"
              >
                {/* Header: لوگو + ThemeToggleMobile + Close */}
                <div
                  className="mb-4 flex items-center justify-between rounded-2xl p-3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-2xl overflow-hidden grid place-items-center border"
                      style={{
                        borderColor: "rgba(255,255,255,0.14)",
                        background: "linear-gradient(180deg, #0E1524, #0B111C)",
                        boxShadow:
                          "inset 0 1px 2px rgba(255,255,255,0.06), 0 10px 22px rgba(0,0,0,0.35)",
                      }}
                    >
                      <img
                        src="/logomobile%20menu.png"
                        alt="Milink Digital Agency"
                        className="h-10 w-10 object-contain"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <div className="leading-tight">
                      <div className="text-base font-semibold">Milink</div>
                      <div
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.72)" }}
                      >
                        Digital Agency
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ThemeToggleMobile />
                    <button
                      onClick={() => setOpen(false)}
                      className="grid h-10 w-10 place-items-center rounded-xl"
                      style={{
                        border: "1px solid rgba(255,255,255,0.14)",
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
                        boxShadow: "0 0 20px rgba(0,96,255,0.25)",
                      }}
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="px-1 pb-2">
                  <div className="text-[13px] uppercase tracking-[0.22em] text-white/55">
                    Navigation
                  </div>
                </div>

                {/* Links */}
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="grid gap-3 overflow-y-auto pr-1"
                  style={{ maxHeight: "calc(100dvh - 430px)" }}
                >
                  {nav.map((n, i) => (
                    <motion.li key={i} variants={itemVariants}>
                      <a
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className="group relative flex items-center justify-between rounded-2xl px-4 py-4"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                          border: "1px solid rgba(255,255,255,0.12)",
                          boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
                          overflow: "hidden",
                          transition:
                            "transform .15s ease, box-shadow .2s ease, border-color .2s ease",
                        }}
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 h-full w-[3px] opacity-70"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0,96,255,0.8), rgba(0,96,255,0.2))",
                          }}
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "radial-gradient(140px 60px at 50% 30%, rgba(0,96,255,0.16), transparent 70%)",
                          }}
                        />
                        <div className="relative z-10 flex items-center gap-3">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle at 40% 40%, #73A6FF, #0060FF 80%)",
                              boxShadow: "0 0 10px rgba(0,96,255,0.55)",
                            }}
                          />
                          <span className="text-[15px] font-medium tracking-wide">
                            {n.label}
                          </span>
                        </div>
                        <ChevronRightIcon
                          className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        />
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Divider */}
                <div
                  className="mt-4 mb-2 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                />

                {/* Socials (fully round) */}
                <div className="px-1 pb-2">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/45 mb-2">
                    Connect
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <SocialIcon
                      href="https://milink.ca"
                      label="Instagram"
                      type="ig"
                    />
                    <SocialIcon
                      href="https://wa.me/14376003139"
                      label="WhatsApp"
                      type="wa"
                    />
                    <SocialIcon
                      href="mailto:info@milink.ca"
                      label="Email"
                      type="mail"
                    />
                    <SocialIcon
                      href="https://milink.ca"
                      label="Facebook"
                      type="fb"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="mt-3 mb-1 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                />

                {/* CTA — موبایل: واید + بدون بردر (دقیقاً همون استایل دسکتاپ) */}
                <div className="mt-auto pt-1 grid place-items-center overflow-visible">
                  <CTAButton onClick={() => setOpen(false)} wide borderless />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div style={{ height: navH }} aria-hidden="true" />
    </>
  );
}
