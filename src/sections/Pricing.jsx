import { pricing } from "../data/content.js";

export default function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="container">
        <h2 className="text-center">Plans that scale</h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {pricing.map((p, i) => {
            const isPopular = !!p.popular;

            // کارت‌های کناری (غیرمحبوب): تیره‌تر + هاله‌ی ملایم همیشه‌فعال
            const sideCard = `
              group relative z-0 overflow-hidden rounded-2xl
              card bg-base-300/70 p-6
              shadow-md
              ring-1 ring-primary/10
              transition-transform transition-shadow duration-200
              hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40
              focus-within:ring-primary/50
            `;

            // کارت وسط (محبوب): استایل فعلیِ پررنگ
            const centerCard = `
              group relative z-0 overflow-hidden rounded-2xl
              card bg-base-200/60 p-6 shadow-soft
              ring-2 ring-primary shadow-glow
              transition-transform transition-shadow duration-200
              before:content-[''] before:absolute before:inset-0 before:z-0
              before:rounded-2xl before:pointer-events-none
              before:bg-gradient-to-br before:from-primary/20 before:to-transparent
              before:opacity-0 group-hover:before:opacity-100
              hover:-translate-y-1 hover:shadow-xl hover:scale-[1.03]
            `;

            const articleCls = isPopular ? centerCard : sideCard;

            return (
              <article key={i} className={articleCls}>
                {isPopular && (
                  <div className="badge badge-primary mb-2 self-center motion-safe:animate-pulse group-hover:motion-safe:animate-none">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold">{p.name}</h3>

                <div className="mt-2 text-1xl font-bold">
                  {p.tagline}
                  <span className="text-base opacity-70 text-2xl"></span>
                </div>

                <ul className="mt-4 space-y-2">
                  {p.items.map((it, idx) => (
                    <li key={idx}>• {it}</li>
                  ))}
                </ul>

                <a href="#contact" className="btn btn-primary mt-6">
                  Contact Us
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
