import Link from "next/link";
import Button from "../ui/Button.jsx";

// Building blocks for the long-form SEO pages (/services/<slug>, /web-design-toronto).
// Pure markup (no hooks), styled by the scoped `.sp-*` block in globals.css with the
// site's tokens, Button, badge and gradient text, so they match the home page.

export function SeoHero({ eyebrow, title, accent, intro, sub }) {
  return (
    <header className="sp-hero">
      <div className="sp-hero__glow" aria-hidden="true" />
      <span className="badge badge-outline">{eyebrow}</span>
      <h1 className="sp-hero__title">
        {title} {accent ? <span className="gradient-text-static">{accent}</span> : null}
      </h1>
      <p className="sp-hero__intro">{intro}</p>
      {sub ? <p className="sp-hero__sub">{sub}</p> : null}
      <div className="sp-hero__ctas">
        <Button href="/contact" arrow>Get a free quote</Button>
        <Button href="/work" variant="secondary">See our work</Button>
      </div>
    </header>
  );
}

export function SeoSection({ eyebrow, title, children }) {
  return (
    <section className="sp-section">
      <div className="sp-section__head">
        {eyebrow ? <span className="sp-kicker">{eyebrow}</span> : null}
        <h2 className="sp-h2">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function SeoCards({ items }) {
  return (
    <ul className="sp-cards">
      {items.map((item, i) => (
        <li key={item} className="sp-card">
          <span className="sp-card__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function SeoChecklist({ items }) {
  return (
    <ul className="sp-check">
      {items.map((item) => (
        <li key={item}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SeoSteps({ steps }) {
  return (
    <ol className="sp-steps">
      {steps.map(([title, text], i) => (
        <li key={title} className="sp-step">
          <span className="sp-step__n" aria-hidden="true">{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

export function SeoFaq({ faqs }) {
  return (
    <div className="sp-faq">
      {faqs.map(([q, a], i) => (
        <details key={q} className="sp-faq__item" open={i === 0}>
          <summary>
            <h3>{q}</h3>
            <span className="sp-faq__icon" aria-hidden="true" />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function SeoLinks({ links }) {
  return (
    <ul className="sp-pills">
      {links.map(({ href, label }) => (
        <li key={href}><Link href={href}>{label}</Link></li>
      ))}
    </ul>
  );
}

export function SeoCta({ title = "Ready for a website that brings you customers?", text }) {
  return (
    <aside className="sp-cta">
      <div className="sp-hero__glow" aria-hidden="true" />
      <h2 className="sp-h2">{title}</h2>
      {text ? <p>{text}</p> : null}
      <div className="sp-hero__ctas">
        <Button href="/contact" arrow>Get a free quote</Button>
        <Button href="/pricing" variant="secondary">See pricing</Button>
      </div>
    </aside>
  );
}
