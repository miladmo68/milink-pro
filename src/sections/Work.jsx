import { useCallback, useEffect, useState } from "react";
import { Instagram, Globe, Link as LinkIcon, X } from "lucide-react";
import { Reveal } from "../components/scroll-reveal.jsx";
import { motion } from "framer-motion";
import { work } from "../data/content.js";

const INSTAGRAM_URL = "https://instagram.com/milink.ca";
const PORTFOLIO_URL = "https://miladweb.com";

/* ===========================
   Modal (inline)
=========================== */
function Modal({ isOpen, onClose, item }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const { title, img, liveUrl } = item;
  const href = liveUrl || "#";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 w-[min(1000px,92vw)] max-h-[92vh] rounded-2xl overflow-hidden bg-base-100 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-base-300">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-base-200 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="relative bg-black">
          <img
            src={img}
            alt={title}
            className="w-full h-auto max-h-[62vh] object-contain"
          />
        </div>
        <div className="px-4 md:px-6 py-5 grid place-items-center">
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary px-6"
            aria-label="Open live project"
          >
            Live Project →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   Work Section (smooth fade like Services)
=========================== */
export default function Work() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);

  const onOpen = useCallback((payload) => {
    setItem(payload);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setItem(null);
  }, []);

  return (
    <section id="work" className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <Reveal from="up" distance={20} once={false}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Our Work
            </h2>
          </Reveal>
          <Reveal from="up" distance={16} delay={0.05} once={false}>
            <p className="opacity-80 mt-3">
              Custom, responsive websites built for speed, clarity, and brand
              impact. Click a thumbnail to preview; live links included.
            </p>
          </Reveal>
        </div>

        {/* Desktop: horizontal accordion cards */}
        <div className="mt-10 hidden lg:block">
          <Reveal asChild from="up" distance={18} delay={0.04} once={false}>
            <div
              className="
                mx-auto flex gap-3
                h-[420px]
                lg:h-[480px]
                xl:h-[540px]
                max-w-[1200px]
                px-4
              "
            >
              {work.map((w) => (
                <div
                  key={w.id}
                  className="
                    group relative min-w-[70px] h-full rounded-[30px] overflow-hidden
                    flex items-end [flex-grow:1] hover:[flex-grow:7]
                    transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ring-1 ring-primary/10 cursor-pointer
                  "
                  onClick={() =>
                    onOpen({
                      title: w.title,
                      text: w.summary,
                      img: w.cover,
                      liveUrl: w.liveUrl,
                    })
                  }
                  aria-label={`Open ${w.title}`}
                  role="button"
                >
                  <img
                    src={w.cover}
                    alt={w.title}
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.40] transition duration-300 group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/70 pointer-events-none" />
                  <h3
                    className="
                      absolute left-5 bottom-5 z-10 text-lg font-bold text-white drop-shadow
                      translate-y-8 opacity-0
                      group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-500 ease-out
                    "
                  >
                    {w.title}
                  </h3>
                  {w.liveUrl && (
                    <a
                      href={w.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="
                        absolute bottom-5 right-5 z-10
                        size-[50px] rounded-full border grid place-items-center
                        border-white bg-black/10 backdrop-blur-[1px]
                        transition-colors duration-300
                        hover:border-emerald-300
                      "
                      aria-label={`${w.title} live link`}
                    >
                      <LinkIcon
                        size={22}
                        className="text-white transition-colors duration-300 group-hover:text-emerald-300"
                      />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Mobile/Tablet */}
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-1 lg:hidden">
          {work.map((w, i) => (
            <Reveal
              key={w.id}
              asChild
              from="up"
              distance={16}
              delay={i * 0.04}
              once={false}
            >
              <article
                className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-primary/10 bg-base-300/80 hover:bg-base-200 transition"
                role="button"
                aria-label={`Open ${w.title}`}
                onClick={() =>
                  onOpen({
                    title: w.title,
                    text: w.summary,
                    img: w.cover,
                    liveUrl: w.liveUrl,
                  })
                }
              >
                <img
                  src={w.cover}
                  alt={w.title}
                  className="w-full h-[240px] sm:h-[260px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/70 pointer-events-none" />
                <h3 className="absolute left-4 bottom-4 z-10 text-base font-bold text-white drop-shadow">
                  {w.title}
                </h3>
                {w.liveUrl && (
                  <a
                    href={w.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="
                      absolute right-4 bottom-4 z-10
                      size-[44px] rounded-full border grid place-items-center
                      border-white/90 bg-black/10 backdrop-blur-[1px]
                    "
                    aria-label={`${w.title} live link`}
                  >
                    <LinkIcon size={20} className="text-white" />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA footer */}
        {/* <Reveal from="up" distance={18} delay={0.04} once={false}>
          <div className="mt-8">
            <div className="card bg-base-100 border border-base-300 ring-1 ring-primary/10 shadow-soft">
              <div className="card-body items-center text-center">
                <h3 className="text-xl md:text-2xl font-extrabold">
                  See More Work
                </h3>
                <p className="opacity-80 max-w-xl">
                  Browse full galleries, recent launches, and behind-the-scenes.
                </p>
                <div className="card-actions mt-4 flex gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <Instagram size={18} /> Instagram
                  </a>
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Globe size={18} /> Full Portfolio
                  </a>
                </div>
                <div className="mt-4 h-0.5 w-24 bg-primary/70 rounded-full" />
              </div>
            </div>
          </div>
        </Reveal> */}
        {/* CTA footer */}
        <Reveal from="up" distance={18} delay={0.04} once={false}>
          <div className="mt-8">
            <div className="card bg-base-100 border border-base-300 ring-1 ring-primary/10 shadow-soft transition-all duration-500 hover:shadow-lg hover:ring-primary/20">
              <div className="card-body items-center text-center">
                <h3 className="text-xl md:text-2xl font-extrabold">
                  See More Work
                </h3>
                <p className="opacity-80 max-w-xl">
                  Browse full galleries, recent launches, and behind-the-scenes.
                </p>

                <div className="card-actions mt-4 flex gap-3">
                  {/* Instagram Button */}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-outline flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_rgba(219,39,119,0.4)] hover:border-pink-500 hover:text-pink-500"
                  >
                    <Instagram size={18} /> Instagram
                  </a>

                  {/* Portfolio Button */}
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_16px_rgba(99,102,241,0.6)]"
                  >
                    <Globe size={18} /> Full Portfolio
                  </a>
                </div>

                <div className="mt-4 h-0.5 w-24 bg-primary/70 rounded-full" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={onClose} item={item} />
    </section>
  );
}
