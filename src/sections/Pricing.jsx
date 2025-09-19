import { pricing } from "../data/content.js";
export default function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="container">
        <h2 className="text-center">Plans that scale</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {pricing.map((p, i) => (
            <div
              key={i}
              className={`card bg-base-200/60 p-6 ${
                p.popular ? "ring-2 ring-primary shadow-glow" : "shadow-soft"
              }`}
            >
              {p.popular && (
                <div className="badge badge-primary mb-2 self-start">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-2 text-4xl font-extrabold">
                ${p.price}
                <span className="text-base font-normal opacity-70">
                  /project
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {p.items.map((it, idx) => (
                  <li key={idx}>• {it}</li>
                ))}
              </ul>
              <a href="#contact" className="btn btn-primary mt-6">
                Choose
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
