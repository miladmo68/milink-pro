"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe, Instagram, Maximize2, Monitor, Smartphone, X } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";
import Button from "../components/ui/Button.jsx";
import { work } from "../data/content.js";
import { BUSINESS } from "../config/business.js";

const AUTO_MS = 9000;
const EASE = [0.2, 0.8, 0.2, 1];

const hostOf = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/* ===========================
   ScrollFrame: a viewport onto a full-page capture of the live site.
   It drifts down and back on its own; a mouse can scrub it by moving
   vertically across the frame. Rendering pauses off-screen.
=========================== */
function ScrollFrame({ shot, alt, sizes, quality = 72, scrub = false, onOpen, label, className = "" }) {
  const viewRef = useRef(null);
  const innerRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const view = viewRef.current;
    const inner = innerRef.current;
    if (!view || !inner) return undefined;

    const s = { pos: 0, dir: 1, max: 0, speed: 40, hold: 900, target: null, visible: true };
    let frame = 0;
    let last = 0;

    const measure = () => {
      s.max = Math.max(0, inner.offsetHeight - view.clientHeight);
      // One full pass takes about sixteen seconds however long the page is.
      s.speed = Math.max(36, s.max / 16);
    };

    const tick = (now) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (s.target !== null) {
        s.pos += (s.target - s.pos) * Math.min(1, dt / 110);
      } else if (!reduced) {
        if (s.hold > 0) {
          s.hold -= dt;
        } else {
          s.pos += (s.dir * s.speed * dt) / 1000;
          if (s.pos >= s.max) { s.pos = s.max; s.dir = -1; s.hold = 1300; }
          else if (s.pos <= 0) { s.pos = 0; s.dir = 1; s.hold = 1300; }
        }
      }
      s.pos = Math.min(s.max, Math.max(0, s.pos));
      inner.style.transform = `translate3d(0, ${-s.pos}px, 0)`;
      const idle = reduced && s.target === null;
      frame = s.visible && !document.hidden && !idle ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };

    const run = () => {
      if (!frame && s.visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    measure();
    const resizeObserver = new ResizeObserver(() => { measure(); run(); });
    resizeObserver.observe(view);
    resizeObserver.observe(inner);
    const intersection = new IntersectionObserver(([entry]) => { s.visible = entry.isIntersecting; run(); });
    intersection.observe(view);
    document.addEventListener("visibilitychange", run);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const move = (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = view.getBoundingClientRect();
      s.target = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)) * s.max;
      run();
    };
    const leave = () => { s.target = null; s.hold = 800; run(); };
    if (scrub && fine) {
      view.addEventListener("pointermove", move);
      view.addEventListener("pointerleave", leave);
    }
    run();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", run);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerleave", leave);
    };
  }, [reduced, scrub, shot.src]);

  const interactive = typeof onOpen === "function";
  return (
    <div
      ref={viewRef}
      className={`work-frame-view ${interactive ? "is-clickable" : ""} ${className}`}
      onClick={interactive ? onOpen : undefined}
      onKeyDown={interactive ? (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); }
      } : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
    >
      <div ref={innerRef} className="work-frame-inner">
        <Image src={shot.src} width={shot.width} height={shot.height} sizes={sizes} quality={quality} alt={alt} draggable={false} />
      </div>
    </div>
  );
}

function Browser({ project, children, className = "" }) {
  return (
    <div className={`work-browser ${className}`}>
      <div className="work-browser-bar" aria-hidden="true">
        <span className="work-dots"><i /><i /><i /></span>
        <span className="work-url">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          {hostOf(project.liveUrl)}
        </span>
      </div>
      {children}
    </div>
  );
}

function PhoneBody({ children, className = "" }) {
  return (
    <div className={`work-phone-body ${className}`}>
      <span className="work-phone-notch" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ===========================
   Full-screen viewer: the whole page, scrollable, desktop or mobile
=========================== */
function Viewer({ items, state, setState, onClose }) {
  const { index, device } = state;
  const project = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const go = useCallback((direction) => {
    setState((current) => ({ ...current, index: (current.index + direction + items.length) % items.length }));
  }, [items.length, setState]);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key === "ArrowRight") { go(1); return; }
      if (event.key === "ArrowLeft") { go(-1); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("a[href], button:not([tabindex='-1']), [tabindex='0']")];
      if (!focusable.length) return;
      const first = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); lastEl.focus(); }
      else if (!event.shiftKey && document.activeElement === lastEl) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous && previous.focus) previous.focus();
    };
  }, [onClose, go]);

  const shot = project.shots[device];
  const previousProject = items[(index - 1 + items.length) % items.length];
  const nextProject = items[(index + 1) % items.length];

  return (
    <motion.div
      ref={dialogRef}
      className="work-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} full-page viewer`}
      style={{ "--work-tint": project.tint.join(" ") }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" className="work-viewer-scrim" aria-label="Close viewer" tabIndex={-1} onClick={onClose} />
      <motion.div
        className="work-viewer-panel"
        initial={{ y: 28, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <aside className="work-viewer-info">
          <div className="work-viewer-top">
            <button ref={closeRef} type="button" className="work-viewer-close" onClick={onClose} aria-label="Close viewer">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <h3 className="work-viewer-title">{project.title}</h3>
          <p className="work-viewer-summary">{project.summary}</p>
          <ul className="work-tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          <Button size="compact" href={project.liveUrl} external className="work-viewer-visit">
            Visit live site <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
          <nav className="work-viewer-nav" aria-label="Project navigation">
            <button type="button" onClick={() => go(-1)}>
              <ChevronLeft size={16} aria-hidden="true" />
              <span><small>Previous</small>{previousProject.title}</span>
            </button>
            <button type="button" onClick={() => go(1)}>
              <span><small>Next</small>{nextProject.title}</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </aside>

        <div className="work-viewer-stage">
          <div className="work-viewer-toolbar">
            <div className="work-toggle" role="group" aria-label="Device">
              <button type="button" aria-pressed={device === "desktop"} onClick={() => setState((c) => ({ ...c, device: "desktop" }))}>
                <Monitor size={15} aria-hidden="true" /> Desktop
              </button>
              <button type="button" aria-pressed={device === "mobile"} onClick={() => setState((c) => ({ ...c, device: "mobile" }))}>
                <Smartphone size={15} aria-hidden="true" /> Mobile
              </button>
            </div>
            <span className="work-viewer-hint">Scroll to explore the full page</span>
          </div>

          <div className={`work-viewer-device is-${device}`}>
            {device === "desktop" ? (
              <Browser project={project} className="work-viewer-browser">
                <div key={`${project.id}-d`} className="work-viewer-scroll" tabIndex={0} aria-label={`${project.title}, full page, scrollable`}>
                  <Image src={shot.src} width={shot.width} height={shot.height} sizes="(min-width: 1024px) 900px, 100vw" quality={82} alt={`${project.title} website, full page`} />
                </div>
              </Browser>
            ) : (
              <div className="work-viewer-phone">
                <PhoneBody>
                  <div key={`${project.id}-m`} className="work-viewer-scroll" tabIndex={0} aria-label={`${project.title}, mobile, full page, scrollable`}>
                    <Image src={shot.src} width={shot.width} height={shot.height} sizes="390px" quality={82} alt={`${project.title} mobile website, full page`} />
                  </div>
                </PhoneBody>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===========================
   Work section
=========================== */
export default function Work() {
  const reduced = useReducedMotion();
  const items = work;
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [mounted, setMounted] = useState(false);
  const showcaseRef = useRef(null);
  const active = items[index];
  const running = auto && inView && !hover && !viewer && !reduced;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const element = showcaseRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The showcase moves on to the next project until the visitor takes over.
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, items.length]);

  const pick = (i) => {
    setAuto(false);
    setIndex(i);
  };
  const openViewer = (i) => {
    const narrow = typeof window !== "undefined" && window.innerWidth < 768;
    setViewer({ index: i, device: narrow ? "mobile" : "desktop" });
  };
  const closeViewer = useCallback(() => setViewer(null), []);

  return (
    <section
      id="work"
      className="relative scroll-mt-24 py-24 bg-base-200 dark:!bg-transparent"
      style={{ overflow: "clip" }}
    >
      <ScrollParallax
        className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
        offset={60}
      >
        <div className="section-depth-work" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={40}>
        <div className="bg-orb bg-orb--top-left" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-right" aria-hidden="true" />
      </ScrollParallax>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Portfolio</div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Our <span className="gradient-text">Work</span>
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05}>
            <p className="opacity-60 mt-4 max-w-md mx-auto">
              Real sites we designed and built — scroll through the live pages,
              on desktop and mobile.
            </p>
          </Reveal>
        </div>

        {/* Desktop: project list beside a live-scrolling browser */}
        <div className="hidden lg:block">
          <Reveal from="up" distance={18} delay={0.04}>
            <div
              ref={showcaseRef}
              className="work-showcase"
              style={{ "--work-tint": active.tint.join(" ") }}
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
            >
              <ol className="work-list">
                {items.map((w, i) => {
                  const isActive = i === index;
                  return (
                    <li key={w.id} className={`work-row ${isActive ? "is-active" : ""}`}>
                      <button type="button" className="work-row-head" aria-pressed={isActive} onClick={() => pick(i)}>
                        <span className="work-row-title">{w.title}</span>
                        <ArrowUpRight className="work-row-arrow" size={18} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            className="work-row-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                          >
                            <div className="work-row-inner">
                              <p>{w.summary}</p>
                              <ul className="work-tags">{w.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                              <div className="work-actions">
                                <Button size="compact" onClick={() => openViewer(i)}>
                                  Explore the site <Maximize2 size={15} aria-hidden="true" />
                                </Button>
                                <Button variant="secondary" size="compact" href={w.liveUrl} external>
                                  Visit live <ArrowUpRight size={15} aria-hidden="true" />
                                </Button>
                              </div>
                              <div className={`work-progress ${running ? "" : "is-paused"} ${auto ? "" : "is-off"}`} aria-hidden="true">
                                <i key={index} style={{ "--auto-ms": `${AUTO_MS}ms` }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>

              <div className="work-stage-wrap">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    className="work-stage"
                    initial={reduced ? false : { opacity: 0, y: 22, scale: 0.97, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={reduced ? undefined : { opacity: 0, y: -14, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.22 } }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="work-glow" aria-hidden="true" />
                    <Browser project={active}>
                      <ScrollFrame
                        shot={active.shots.desktop}
                        alt={`${active.title} website, full page`}
                        sizes="(min-width: 1280px) 760px, 56vw"
                        scrub
                        onOpen={() => openViewer(index)}
                        label={`Open ${active.title} in the full-page viewer`}
                      />
                    </Browser>
                    <div className="work-phone" aria-hidden="true">
                      <PhoneBody>
                        <ScrollFrame shot={active.shots.mobile} alt="" sizes="180px" quality={70} className="work-phone-view" />
                      </PhoneBody>
                    </div>
                    <button type="button" className="work-open" onClick={() => openViewer(index)}>
                      <Maximize2 size={14} aria-hidden="true" /> Full screen
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mobile / tablet: one live-scrolling card per project */}
        <div className="work-cards lg:hidden">
          {items.map((w, i) => (
            <Reveal key={w.id} from="up" distance={24} delay={i * 0.05}>
              <article className="work-card" style={{ "--work-tint": w.tint.join(" ") }}>
                <Browser project={w}>
                  <ScrollFrame
                    shot={w.shots.desktop}
                    alt={`${w.title} website, full page`}
                    sizes="94vw"
                    onOpen={() => openViewer(i)}
                    label={`Open ${w.title} in the full-page viewer`}
                  />
                </Browser>
                <div className="work-card-meta">
                  <h3>{w.title}</h3>
                  <p>{w.summary}</p>
                  <ul className="work-tags">{w.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                <div className="work-actions">
                  <Button size="compact" onClick={() => openViewer(i)}>
                    Explore the site <Maximize2 size={15} aria-hidden="true" />
                  </Button>
                  <Button variant="secondary" size="compact" href={w.liveUrl} external>
                    Visit live <ArrowUpRight size={15} aria-hidden="true" />
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA footer */}
        <Reveal from="up" distance={18} delay={0.04}>
          <div className="mt-14">
            <div className="marketing-navy-surface card bg-base-100 border border-base-300 ring-1 ring-primary/15 shadow-soft transition-all duration-500 hover:shadow-lg hover:ring-primary/25 dark:!border-0 dark:!bg-transparent card-surface">
              <div className="card-body items-center text-center">
                <h3 className="text-xl md:text-2xl font-extrabold">
                  See More Work
                </h3>
                <p className="opacity-80 max-w-xl">
                  Browse full galleries, recent launches, and behind-the-scenes.
                </p>

                <div className="card-actions mt-4 flex gap-3">
                  <Button variant="secondary" size="compact" href={BUSINESS.instagram.url} external>
                    <Instagram size={18} aria-hidden="true" /> Instagram
                  </Button>
                  <Button size="compact" href={BUSINESS.portfolioUrl} external>
                    <Globe size={18} aria-hidden="true" /> Full Portfolio
                  </Button>
                </div>

                <div className="mt-4 h-px w-20 bg-primary/30 rounded-full" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Portalled to <body> so no section stacking context can sit under the header. */}
      {mounted && createPortal(
        <AnimatePresence>
          {viewer && <Viewer items={items} state={viewer} setState={setViewer} onClose={closeViewer} />}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
