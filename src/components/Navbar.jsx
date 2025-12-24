import { useEffect, useRef, useState, useMemo } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";
import { XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import LogoFancy from "./LogoFancy.jsx";

/* =========================
   CTA (Book a Call)
========================= */
function CTAButton({
  onClick,
  borderless = false,
  wide = false,
  mobileGlow = false,
}) {
  const baseShadow =
    "inset 0 1px 3px rgba(255,255,255,0.65), 0 4px 14px rgba(0,96,255,0.25)";
  const glowShadow =
    "inset 0 0 0 1px rgba(0,96,255,0.85), inset 0 6px 18px rgba(0,96,255,0.15), 0 0 16px rgba(0,96,255,0.45), 0 10px 30px rgba(0,96,255,0.28)";

  return (
    <motion.a
      href="#contact"
      onClick={onClick}
      whileHover={{
        y: -1,
        scale: 1.02,
        backgroundColor: "rgba(245, 248, 255, 0.68)",
        backgroundImage:
          "radial-gradient(circle at center, rgba(0,96,255,0.08) 0%, transparent 70%)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.8), 0 8px 22px rgba(0,96,255,0.30), 0 0 14px rgba(0,96,255,0.18)",
        borderColor: borderless ? "transparent" : "#0060FF",
        filter: "brightness(1.02) saturate(1.05)",
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.6 }}
      className={`relative inline-flex select-none items-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60 ${
        wide ? "w-full justify-center px-4 py-3" : "px-4 py-2"
      }`}
      style={{
        color: "#0060FF",
        background: "rgba(255,255,255,0.55)",
        border: borderless ? "none" : "1px solid #0060FF",
        boxShadow: mobileGlow ? glowShadow : baseShadow,
        backgroundImage: "none",
        backdropFilter: "blur(10px)",
        transition:
          "background-color .25s, background-image .25s, box-shadow .25s, border-color .25s, filter .25s",
        overflow: "visible",
        filter: mobileGlow
          ? "drop-shadow(0 0 10px rgba(0,96,255,0.45))"
          : undefined,
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
   Burger Button (same look)
========================= */
const BRAND = { blueGlow: "rgba(0,107,206,0.45)" };

function BurgerButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Open menu"
      whileTap={{ scale: 0.97, y: 1 }}
      className="group relative grid h-12 w-12 place-items-center rounded-full transition-all duration-200 select-none touch-manipulation border border-[rgba(255,255,255,0.12)] shadow-[0_10px_28px_rgba(0,0,0,0.35)] bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.25),rgba(255,255,255,0.05)_60%),linear-gradient(180deg,#0E1422,#0A101B)]"
      style={{
        boxShadow: `inset 0 1px 2px rgba(255,255,255,0.10),
                    0 0 0 2px rgba(255,255,255,0.20),
                    0 0 0 4px ${BRAND.blueGlow},
                    0 16px 40px rgba(0,0,0,0.35)`,
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
        className="pointer-events-none absolute -top-px left-[10%] right-[10%] h-px rounded-full opacity-50 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.30),transparent)]"
      />
    </motion.button>
  );
}

/* =========================
   Social Icon helper
========================= */
function SocialIcon({ href, label, type }) {
  const isExternal = href.startsWith("http");
  const glow1 = "rgba(0,96,255,0.55)";
  const glow2 = "rgba(59,130,246,0.45)";
  const edge = "rgba(255,255,255,0.14)";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="relative grid h-11 w-11 place-items-center rounded-full overflow-visible select-none"
      style={{
        border: `1px solid ${edge}`,
        background:
          "radial-gradient(120% 120% at 0% 0%, rgba(59,130,246,0.25), rgba(0,0,0,0) 60%), radial-gradient(120% 120% at 80% 20%, rgba(0,96,255,0.25), rgba(0,0,0,0) 70%), rgba(15,23,42,0.78)",
        boxShadow: `0 10px 22px rgba(0,0,0,0.35), 0 0 18px ${glow1}, 0 0 36px ${glow2}`,
        backdropFilter: "blur(6px) saturate(160%)",
        WebkitBackdropFilter: "blur(6px) saturate(160%)",
        transition: "transform .2s ease, box-shadow .25s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-1px) scale(1.04)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 22px ${glow1}, 0 0 34px ${glow2}`,
          opacity: 0.9,
          filter: "blur(0.2px)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] rounded-full overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 70%)",
        }}
      >
        <span
          className="milink-sheen absolute -inset-3 rounded-full"
          style={{
            background:
              "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            transform: "translateX(-140%) rotate(8deg)",
            filter: "blur(2px)",
            opacity: 0,
            transition: "transform .7s ease, opacity .3s ease",
          }}
        />
      </span>

      <style>{`a[aria-label="${label}"]:hover .milink-sheen{transform:translateX(120%) rotate(8deg);opacity:1;}`}</style>

      {type === "ig" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="rgba(255,255,255,0.90)"
            strokeWidth="1.5"
          />
          <circle
            cx="12"
            cy="12"
            r="3.5"
            stroke="rgba(255,255,255,0.90)"
            strokeWidth="1.5"
          />
          <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.92)" />
        </svg>
      )}

      {type === "wa" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 19l1.3-3.2A7 7 0 1119 12 7 7 0 018.1 17.8L5 19z"
            stroke="rgba(255,255,255,0.90)"
            strokeWidth="1.5"
          />
          <path
            d="M10.2 8.8c.3-.2.5-.2.6 0l1.1 1.3c.1.1.1.3 0 .5l-.5.6c.4.7 1 1.3 1.7 1.7l.6-.5c.2-.1.4-.1.5 0l1.3 1.1c.2.1.2.3 0 .6-.6.8-1.6 1.1-2.5.8-1.7-.6-3-1.9-3.6-3.6-.3-.9 0-1.9.8-2.5z"
            fill="rgba(255,255,255,0.92)"
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
            stroke="rgba(255,255,255,0.90)"
            strokeWidth="1.5"
          />
          <path
            d="M4 7l8 6 8-6"
            stroke="rgba(255,255,255,0.90)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {type === "fb" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.5 21v-7h2.2l.3-2.6h-2.5V9.2c0-.8.2-1.2 1.2-1.2h1.3V5.6c-.6-.1-1.3-.2-1.9-.2-2 0-3.4 1.2-3.4 3.5v1.5H8.8V14h2V21h2.7z"
            fill="rgba(255,255,255,0.92)"
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
  const lockScrollY = useRef(0);

  // Active hash
  const [activeHash, setActiveHash] = useState("#home");

  // ScrollSpy map
  const navHrefs = useMemo(() => nav.map((n) => n.href), []);
  const observerRef = useRef(null);
  const rafRef = useRef(null);

  // hashchange (fallback)
  useEffect(() => {
    const setFromHash = () => setActiveHash(window.location.hash || "#home");
    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  // scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    if (!navHrefs.length) return;

    const ids = navHrefs
      .filter((h) => h && h.startsWith("#"))
      .map((h) => h.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const updateActive = (hash) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setActiveHash(hash));
    };

    observerRef.current?.disconnect?.();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          );

        if (visible[0]?.target?.id) updateActive(`#${visible[0].target.id}`);
      },
      {
        root: null,
        threshold: [0.12, 0.22, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    els.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [navHrefs]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      lockScrollY.current = window.scrollY || 0;
      const body = document.body;
      const html = document.documentElement;
      body.style.position = "fixed";
      body.style.top = `-${lockScrollY.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
    } else {
      const body = document.body;
      const html = document.documentElement;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overscrollBehavior = "";
      if (lockScrollY.current) window.scrollTo(0, lockScrollY.current);
    }
  }, [open]);

  const baseHeight = 100;
  const navH = open ? baseHeight + nav.length * 44 : baseHeight;
  const LOGO_BOX_WIDTH = 260;

  // Mobile bg (unchanged)
  const MOBILE_PILL_BG =
    "radial-gradient(160% 140% at 85% 20%, rgba(0,118,255,0.10) 0%, rgba(0,118,255,0) 60%), linear-gradient(180deg, rgba(26,30,40,0.92), rgba(14,18,28,0.88))";

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

  // ✅ Desktop link styles (DAISYUI-AWARE FIX)
  // Works with DaisyUI data-theme because it uses CSS vars.
  const linkBase =
    "relative inline-flex items-center text-sm font-medium tracking-[0.06em] " +
    "text-base-content/70 hover:text-base-content transition";

  const linkUnderline =
    "after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full " +
    "after:bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.95),rgba(0,96,255,0.95),transparent)] " +
    "after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:blur-[0.2px] " +
    "hover:after:scale-x-100 hover:after:origin-left";

  const linkActive =
    "text-base-content drop-shadow-[0_10px_30px_rgba(0,96,255,0.30)]";

  /* ======================================================
     Desktop "pill on scroll" DISABLED:
     - No background/border/shadow/blur changes on scroll
  ====================================================== */
  const DESKTOP_BAR_BG = "transparent";
  const DESKTOP_BAR_BORDER = "1px solid transparent";
  const DESKTOP_BAR_SHADOW = "none";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all pt-3 ${
          SITE.enableStickyBlur && scrolled
            ? "backdrop-blur-xl bg-transparent"
            : "bg-transparent"
        }`}
        style={{ height: baseHeight }}
      >
        {/* ========== Desktop (NO pill — like old) ========== */}
        <div className="container hidden md:flex items-center gap-6">
          {/* Desktop inner bar */}
          <div
            className="w-full flex items-center gap-6 px-4"
            style={{
              height: scrolled ? 64 : 72,
              background: DESKTOP_BAR_BG,
              border: DESKTOP_BAR_BORDER,
              boxShadow: DESKTOP_BAR_SHADOW,

              // no blur on desktop bar
              backdropFilter: "none",
              WebkitBackdropFilter: "none",

              transition:
                "height .2s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease",
            }}
          >
            <div className="flex items-center gap-1">
              <div
                className="hidden md:block shrink-0 overflow-hidden m-0 p-0 leading-none"
                style={{ width: LOGO_BOX_WIDTH, transform: "translateY(1px)" }}
              >
                <LogoFancy
                  className="flex items-center font-[sans-serif] m-0 p-0 leading-none w-full"
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

              {/* NAV */}
              <nav className="hidden md:flex items-center gap-7 ml-1 relative">
                {nav.map((n, i) => {
                  const isActive = activeHash === n.href;

                  return (
                    <a
                      key={i}
                      href={n.href}
                      className={`${linkBase} ${linkUnderline} ${
                        isActive ? linkActive : ""
                      }`}
                      onClick={() => setActiveHash(n.href)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-[11px] left-0 right-0 h-[3px] rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 520,
                            damping: 38,
                            mass: 0.6,
                          }}
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(56,189,248,0.00), rgba(56,189,248,0.95), rgba(0,96,255,0.95), rgba(56,189,248,0.00))",
                            boxShadow:
                              "0 0 18px rgba(0,96,255,0.30), 0 10px 26px rgba(0,96,255,0.18)",
                            filter: "blur(0.1px)",
                          }}
                        />
                      )}
                      {n.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {/* ✅ theme-aware divider */}
                <div className="w-px h-7 bg-base-content/10" />
                <CTAButton mobileGlow />
              </div>
            </div>
          </div>
        </div>

        {/* ========== Mobile (unchanged pill) ========== */}
        <div className="md:hidden px-3 py-3">
          <div
            className="flex items-center gap-3 rounded-[28px] px-4 py-3 relative overflow-hidden ring-1"
            style={{
              ringColor: "rgba(255,255,255,0.10)",
              background: MOBILE_PILL_BG,
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.45), 0 0 28px rgba(0,118,255,0.20), inset 0 1px 2px rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="shrink-0">
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

            <div className="ml-auto mr-[14px]">
              <BurgerButton onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>

        {/* ====== Mobile overlay + drawer ====== */}
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
                {/* Header drawer */}
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
                        src="/logo.png"
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
                    <ThemeToggle />
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

                {/* Socials */}
                <div className="px-1 pb-2">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/45 mb-2">
                    Connect
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <SocialIcon
                      href="https://www.instagram.com/milink.ca"
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
                      href="https://www.facebook.com/milink.ca"
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

                {/* CTA — موبایل */}
                <div className="mt-auto pt-1 grid place-items-center overflow-visible">
                  <CTAButton onClick={() => setOpen(false)} wide mobileGlow />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer (desktop only) */}
      <div className="hidden md:block" style={{ height: navH }} aria-hidden />
    </>
  );
}
