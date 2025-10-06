import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { services } from "../data/content.js";

// Map icon name strings from content.js to actual components
const iconMap = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
};

function ServiceCard({ data, onOpen }) {
  const Icon = iconMap[data.icon] || CodeBracketIcon;

  return (
    <article className="relative card bg-base-300/70 p-6 shadow-md rounded-2xl ring-1 ring-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40 focus-within:ring-primary/50">
      {data.badge && (
        <span className="badge badge-primary absolute right-3 top-3 motion-safe:animate-pulse hover:motion-safe:animate-none">
          {data.badge}
        </span>
      )}

      <div className="flex flex-col items-start gap-3 text-left">
        <Icon className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <p className="opacity-80">{data.desc}</p>

        {data.bullets?.length > 0 && (
          <ul className="mt-2 space-y-2 text-sm opacity-90">
            {data.bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        )}

        <div className="mt-4 w-full flex justify-end">
          <button
            className="btn btn-sm"
            onClick={() =>
              onOpen?.({
                title: data.title,
                text:
                  data.longDesc ||
                  "We keep it simple and reliable — so you can trust us to get it done right.",
                list: data.bullets || [],
              })
            }
          >
            Read more
          </button>
        </div>
      </div>
    </article>
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
