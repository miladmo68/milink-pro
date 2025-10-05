// import { useEffect, useState } from "react";
// import { nav } from "../data/content.js";
// import { SITE } from "../config/siteConfig.js";
// import ThemeToggle from "./ThemeToggle.jsx";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const navH = open ? 64 + nav.length * 44 : 64; // spacer height

//   return (
//     <>
//       <header
//         className={`fixed inset-x-0 top-0 z-50 transition-all
//         ${
//           SITE.enableStickyBlur && scrolled
//             ? "backdrop-blur bg-base-100/70 shadow-glow"
//             : "bg-transparent"
//         }`}
//         style={{ height: 64 }}
//       >
//         <div className="container navbar py-3">
//           <div className="flex-1">
//             {/* ✅ لوگو به صورت PNG */}
//             <a
//               href="#home"
//               className="flex items-center gap-2"
//               aria-label="Home"
//             >
//               <img
//                 src="/logo.png"
//                 alt="MILINK Logo"
//                 className="h-8 w-auto md:h-12 select-none"
//                 draggable="false"
//               />
//             </a>
//           </div>

//           {/* Desktop nav with underline animation */}
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

//           <div className="flex items-center gap-3">
//             <ThemeToggle />
//             <a
//               href="#contact"
//               className="btn btn-primary btn-sm hidden md:inline-flex"
//             >
//               Book a Call
//             </a>

//             {/* Mobile menu toggle */}
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

//         {/* Mobile dropdown */}
//         {open && (
//           <div className="md:hidden bg-base-100 border-t">
//             <div className="container py-4 flex flex-col items-center text-center">
//               {nav.map((n, i) => (
//                 <a
//                   key={i}
//                   href={n.href}
//                   className="py-2"
//                   onClick={() => setOpen(false)}
//                 >
//                   {n.label}
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Spacer so content isn’t hidden */}
//       <div style={{ height: navH }} aria-hidden="true" />
//     </>
//   );
// }
import { useEffect, useState } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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
            ? "backdrop-blur bg-base-100/70 shadow-glow"
            : "bg-transparent"
        }`}
        style={{ height: baseHeight }}
      >
        <div className="container navbar py-4">
          <div className="flex-1">
            <a
              href="#home"
              className="flex items-center gap-2"
              aria-label="Home"
            >
              <img
                src="/logo.png"
                alt="MILINK Logo"
                className="h-10 w-auto md:h-14 select-none"
                draggable="false"
              />
            </a>
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

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              Book a Call
            </a>

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

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-base-100 border-t">
            <div className="container py-4 flex flex-col items-center text-center">
              {nav.map((n, i) => (
                <a
                  key={i}
                  href={n.href}
                  className="py-2"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: navH }} aria-hidden="true" />
    </>
  );
}
