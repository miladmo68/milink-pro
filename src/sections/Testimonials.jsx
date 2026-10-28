import { testimonials as DATA } from "../data/content.js";
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";

const initialsFor = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "M";

function TestimonialCard({ testimonial, hidden = false }) {
  return (
    <figure className="testimonial-marquee-card" aria-hidden={hidden || undefined}>
      <div>
        <blockquote>“{testimonial.text}”</blockquote>
      </div>

      <figcaption className="testimonial-marquee-person">
        <span className="testimonial-marquee-avatar" aria-hidden="true">
          {initialsFor(testimonial.name)}
        </span>
        <span>
          <strong>{testimonial.name}</strong>
          {testimonial.role ? <small>{testimonial.role}</small> : null}
        </span>
      </figcaption>
    </figure>
  );
}

function TestimonialGroup({ items, hidden = false }) {
  return (
    <div className="testimonial-marquee-group" aria-hidden={hidden || undefined}>
      {items.map((testimonial, index) => (
        <TestimonialCard
          key={`${hidden ? "duplicate" : "primary"}-${testimonial.name}-${index}`}
          testimonial={testimonial}
          hidden={hidden}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const items = Array.isArray(DATA) ? DATA : [];
  if (!items.length) return null;

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-200 dark:!bg-transparent"
      aria-label="Client testimonials"
    >
      <ScrollParallax
        className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
        offset={50}
      >
        <div className="section-depth-quote" />
      </ScrollParallax>
      <ScrollParallax className="absolute inset-0 -z-10 pointer-events-none" offset={40}>
        <DecorBG />
        <div className="bg-orb bg-orb--top-left" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-right" aria-hidden="true" />
      </ScrollParallax>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <header className="text-center mb-14 max-w-2xl mx-auto">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Client Stories</div>
          </Reveal>
          <Reveal from="up" distance={20}>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              What Clients <span className="gradient-text">Say</span>
            </h2>
          </Reveal>
          <p className="text-base-content/58 mt-4 text-sm max-w-sm mx-auto">Real feedback, real outcomes.</p>
        </header>
      </div>

      <Reveal from="up" distance={24} className="relative z-10">
        <div className="testimonial-marquee" aria-label="Client feedback">
          <div className="testimonial-marquee-track">
            <TestimonialGroup items={items} />
            <TestimonialGroup items={items} hidden />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function DecorBG() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px,#fff 1px,transparent 1.2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.14]"
        style={{
          background: "linear-gradient(135deg, rgb(var(--brand) / 0.12) 0%, rgb(var(--brand) / 0) 40%), linear-gradient(315deg, rgb(var(--brand-accent) / 0.1) 10%, rgb(var(--brand-accent) / 0) 60%)",
          maskImage: "radial-gradient(80% 55% at 50% -10%, #000 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(80% 55% at 50% -10%, #000 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
