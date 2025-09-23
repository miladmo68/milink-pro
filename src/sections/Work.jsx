import { work } from "../data/content.js";
import { Instagram, Globe } from "lucide-react"; // آیکون‌ها

const INSTAGRAM_URL = "https://instagram.com/milink.ca";
const PORTFOLIO_URL = "https://miladweb.com";

export default function Work({ onOpen }) {
  return (
    <section id="work" className="py-20">
      <div className="container">
        {/* Header - centered */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Our Work
          </h2>
          <p className="opacity-80 mt-3">
            Custom, responsive websites built for speed, clarity, and brand
            impact. Below is a curated selection—click a thumbnail to preview;
            live links included.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w) => (
            <article
              key={w.id}
              className="
                card bg-base-300/80 hover:bg-base-200
                transition shadow-xl overflow-hidden
                ring-1 ring-primary/10
              "
            >
              {/* Cover */}
              <figure
                className="aspect-video overflow-hidden cursor-pointer group"
                onClick={() =>
                  onOpen({
                    title: w.title,
                    text: w.summary,
                    img: w.cover,
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

              {/* Body */}
              <div className="card-body items-center text-center">
                <h3 className="card-title">{w.title}</h3>
                <p className="opacity-80">{w.summary}</p>

                <div className="card-actions mt-2">
                  {w.liveUrl && (
                    <a
                      href={w.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-sm btn-primary"
                    >
                      Visit site →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Full-width CTA */}
          <div className="sm:col-span-2 lg:col-span-3">
            <div
              className="
                card bg-base-100 border border-base-300 shadow-soft
                ring-1 ring-primary/10
              "
            >
              <div className="card-body items-center text-center">
                <h3 className="text-xl md:text-2xl font-extrabold">
                  See More Work
                </h3>
                <p className="opacity-80 max-w-xl">
                  Browse full galleries, recent launches, and behind-the-scenes.
                </p>

                {/* Buttons with icons */}
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

                {/* Thin accent line */}
                <div className="mt-4 h-0.5 w-24 bg-primary/70 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
