// import { work } from "../data/content.js";
// import { Instagram, Globe } from "lucide-react";

// const INSTAGRAM_URL = "https://instagram.com/milink.ca";
// const PORTFOLIO_URL = "https://miladweb.com";

// export default function Work({ onOpen }) {
//   return (
//     <section id="work" className="py-20">
//       <div className="container">
//         {/* Header - centered */}
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-black tracking-tight">
//             Our Work
//           </h2>
//           <p className="opacity-80 mt-3">
//             Custom, responsive websites built for speed, clarity, and brand
//             impact. Below is a curated selection—click a thumbnail to preview;
//             live links included.
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {work.map((w) => (
//             <article
//               key={w.id}
//               className="
//                 card bg-base-300/80 hover:bg-base-200
//                 transition shadow-xl overflow-hidden
//                 ring-1 ring-primary/10
//               "
//             >
//               {/* Cover */}
//               <figure
//                 className="aspect-video overflow-hidden cursor-pointer group"
//                 onClick={() =>
//                   onOpen({
//                     title: w.title,
//                     text: w.summary,
//                     img: w.cover,
//                   })
//                 }
//               >
//                 <img
//                   src={w.cover}
//                   alt={w.title}
//                   className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                   loading="lazy"
//                 />
//               </figure>

//               {/* Body */}
//               <div className="card-body items-center text-center">
//                 <h3 className="card-title">{w.title}</h3>
//                 <p className="opacity-80">{w.summary}</p>

//                 <div className="card-actions mt-2">
//                   {w.liveUrl && (
//                     <a
//                       href={w.liveUrl}
//                       target="_blank"
//                       rel="noreferrer noopener"
//                       className="btn btn-sm btn-primary"
//                     >
//                       Visit site →
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </article>
//           ))}

//           {/* Full-width CTA */}
//           <div className="sm:col-span-2 lg:col-span-3">
//             <div
//               className="
//                 card bg-base-100 border border-base-300 shadow-soft
//                 ring-1 ring-primary/10
//               "
//             >
//               <div className="card-body items-center text-center">
//                 <h3 className="text-xl md:text-2xl font-extrabold">
//                   See More Work
//                 </h3>
//                 <p className="opacity-80 max-w-xl">
//                   Browse full galleries, recent launches, and behind-the-scenes.
//                 </p>

//                 {/* Buttons with icons */}
//                 <div className="card-actions mt-4 flex gap-3">
//                   <a
//                     href={INSTAGRAM_URL}
//                     target="_blank"
//                     rel="noreferrer noopener"
//                     className="btn btn-outline flex items-center gap-2"
//                   >
//                     <Instagram size={18} /> Instagram
//                   </a>
//                   <a
//                     href={PORTFOLIO_URL}
//                     target="_blank"
//                     rel="noreferrer noopener"
//                     className="btn btn-primary flex items-center gap-2"
//                   >
//                     <Globe size={18} /> Full Portfolio
//                   </a>
//                 </div>

//                 {/* Thin accent line */}
//                 <div className="mt-4 h-0.5 w-24 bg-primary/70 rounded-full" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// work.js (or Work.jsx)
import { useCallback, useEffect, useState } from "react";
import { Instagram, Globe, Link as LinkIcon, X } from "lucide-react";
import { work } from "../data/content.js";

const INSTAGRAM_URL = "https://instagram.com/milink.ca";
const PORTFOLIO_URL = "https://miladweb.com";

/* ===========================
   Simple Modal (inline)
=========================== */
function Modal({ isOpen, onClose, item }) {
  // Close on ESC
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
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      {/* Dialog */}
      <div className="relative z-10 w-[min(1000px,92vw)] max-h-[92vh] rounded-2xl overflow-hidden bg-base-100 shadow-2xl ring-1 ring-white/10">
        {/* Header */}
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

        {/* Media */}
        <div className="relative bg-black">
          <img
            src={img}
            alt={title}
            className="w-full h-auto max-h-[62vh] object-contain"
          />
        </div>

        {/* Footer – centered CTA */}
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
   Work Section
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
    <section id="work" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Our Work
          </h2>
          <p className="opacity-80 mt-3">
            Custom, responsive websites built for speed, clarity, and brand
            impact. Click a thumbnail to preview; live links included.
          </p>
        </div>

        {/* Desktop: horizontal accordion cards */}
        <div className="mt-10 hidden lg:block">
          <div className="mx-auto flex gap-3 h-[380px] lg:h-[420px] xl:h-[460px] max-w-[1200px] px-4">
            {work.map((w) => (
              <div
                key={w.id}
                className="
                  group relative min-w-[70px] h-full
                  rounded-[30px] overflow-hidden
                  flex items-end
                  [flex-grow:1] hover:[flex-grow:7]
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
                {/* Background */}
                <img
                  src={w.cover}
                  alt={w.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.40] transition duration-300 group-hover:brightness-100"
                  loading="lazy"
                />

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/70 pointer-events-none" />

                {/* Bottom content — icon always visible; title only on hover */}
                <div
                  className="
                    absolute left-2 right-2 bottom-5 z-10
                    flex items-center gap-3
                    transition-all duration-300
                    group-hover:inset-5 group-hover:top-auto
                  "
                >
                  {w.liveUrl && (
                    <a
                      href={w.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="
                        shrink-0 size-[50px]
                        rounded-full border border-white
                        grid place-items-center
                        transition-colors duration-300
                        group-hover:border-emerald-300
                        bg-black/10 backdrop-blur-[1px]
                      "
                      aria-label={`${w.title} live link`}
                    >
                      <LinkIcon
                        size={22}
                        className="text-white transition-colors duration-300 group-hover:text-emerald-300"
                      />
                    </a>
                  )}

                  <h3
                    className="
                      text-lg font-bold text-white drop-shadow
                      translate-y-8 opacity-0
                      group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-500 ease-out
                    "
                  >
                    {w.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
          {work.map((w) => (
            <article
              key={w.id}
              className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-primary/10 bg-base-300/80 hover:bg-base-200 transition"
            >
              <figure
                className="aspect-video overflow-hidden cursor-pointer group"
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
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </figure>

              <div className="p-4 flex items-end gap-3">
                {w.liveUrl && (
                  <a
                    href={w.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="shrink-0 size-[46px] rounded-full border border-white/90 hover:border-emerald-300 grid place-items-center bg-black/5 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${w.title} live link`}
                  >
                    <LinkIcon size={20} className="text-white" />
                  </a>
                )}

                {/* Title only on hover (for consistency with desktop group hover) */}
                <h3
                  className="
                    text-lg font-bold
                    translate-y-4 opacity-0
                    group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-500 ease-out
                  "
                >
                  {w.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        {/* CTA footer (Instagram / Portfolio) */}
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
      </div>

      {/* Inline Modal */}
      <Modal isOpen={open} onClose={onClose} item={item} />
    </section>
  );
}
