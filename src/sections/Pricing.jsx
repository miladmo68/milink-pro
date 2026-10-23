import { pricing } from "../data/content.js";
import { Check } from "lucide-react"; // optional
import { Reveal } from "../components/scroll-reveal.jsx";
import ScrollParallax from "../components/ScrollParallax.jsx";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden py-24 bg-base-100 dark:!bg-transparent"
    >
      <ScrollParallax className="pointer-events-none absolute inset-0 -z-10" offset={70}>
        <div className="section-depth-pricing" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:18px_18px]" />
        <div className="absolute inset-x-0 top-[-120px] h-[340px] blur-3xl opacity-30 dark:opacity-[0.34] bg-gradient-to-r from-[rgb(var(--brand)/0.32)] via-[rgb(var(--brand)/0.14)] to-[rgb(var(--brand)/0.32)]" />
        <div className="bg-orb bg-orb--top-right" aria-hidden="true" />
        <div className="bg-orb bg-orb--accent bg-orb--bottom-left" aria-hidden="true" />
      </ScrollParallax>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal from="up" distance={12}>
            <div className="badge badge-outline mb-4 uppercase tracking-widest text-[10px] border-primary/38 text-primary/90">Our Packages</div>
          </Reveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="gradient-text">Pricing</span> &amp; Packages
          </h2>
          <p className="mt-4 text-base-content/68 max-w-sm mx-auto">
            Choose what fits now—upgrade any time as you grow.
          </p>
          <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-[rgb(var(--brand)/0.9)] via-[rgb(var(--brand)/0.6)] to-[rgb(var(--brand)/0.9)]" />
        </div>

        <div className="mt-14 grid items-stretch gap-6 sm:gap-8 md:grid-cols-3">
          {pricing.map((p, i) => {
            const isPopular = !!p.popular;
            const isPro = (p.name || "").toLowerCase() === "professional";
            const quoteHref = `/?package=${encodeURIComponent(p.name)}#contact`;
            const frameBase = "group relative overflow-hidden rounded-2xl transition-transform duration-300";
            const framePadding = isPro ? "p-[2px] md:p-[3px]" : "p-[1px]";
            const borderBase = "before:absolute before:inset-0 before:-z-10 before:rounded-2xl";
            const borderGradient = isPro
              ? "before:opacity-100 before:bg-[conic-gradient(from_-60deg_at_0%_0%,rgba(59,130,246,0.95)_0deg,rgba(59,130,246,0.60)_210deg,transparent_330deg)]"
              : "before:opacity-100 before:bg-[conic-gradient(from_0deg,rgba(59,130,246,0.78),rgba(59,130,246,0.32),transparent_220deg)]";
            const lift = "hover:-translate-y-1";
            // Keep the featured plan visually elevated on desktop without changing its shared card dimensions.
            const featuredOffset = isPro ? "md:-translate-y-4 md:hover:-translate-y-5" : "";
            const proGlow = isPro
              ? "z-[1] ring-2 ring-[rgb(var(--brand)/0.68)] [box-shadow:0_0_72px_-16px_rgba(59,130,246,0.68)] after:absolute after:inset-[-14%] after:-z-20 after:rounded-[32px] after:blur-3xl after:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(59,130,246,0.24),transparent_70%)]"
              : "";
            const cardOuter = [frameBase, framePadding, borderBase, borderGradient, lift, featuredOffset, proGlow, "h-full w-full max-w-sm mx-auto"].join(" ");
            const innerLift = isPro
              ? "shadow-[0_22px_54px_-18px_rgba(0,0,0,0.6),0_0_0_1px_oklch(0.4_0.02_265_/_0.48)]"
              : "ring-1 ring-inset ring-base-300/50 shadow-[0_36px_88px_-12px_rgba(0,0,0,0.68),0_0_0_1px_oklch(0.46_0.02_265_/_0.55)]";

            return (
              <Reveal key={i} from="up" distance={24} delay={i * 0.08} className="h-full">
                <article className={cardOuter}>
                  <div className={`marketing-navy-surface relative h-full rounded-2xl card-surface--pricing card-lift card-sweep card-bar ${innerLift} flex flex-col justify-between min-h-[620px] md:min-h-[650px]`}>
                    <div aria-hidden className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent_75%)] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.14),transparent_65%)]" />
                    </div>

                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-[8deg]" />
                    </div>

                    {isPopular && (
                      <div className="absolute -right-9 top-6 rotate-45">
                        <span className="relative text-[11px] px-7 py-1 rounded-sm bg-[rgb(var(--brand))] text-white shadow-md">
                          {p.badge || "Most Popular"}
                          <span className="pointer-events-none absolute inset-0 rounded-sm animate-glowPulse bg-[rgb(var(--brand)/0.40)] blur-sm" />
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                      <div className="text-center">
                        <h3 className={`text-2xl md:text-3xl font-bold leading-tight bg-clip-text text-transparent ${
                          isPro
                            ? "bg-gradient-to-r from-[rgb(var(--brand)/0.85)] via-[rgb(var(--brand))] to-[rgb(var(--brand)/0.80)]"
                            : isPopular
                              ? "bg-gradient-to-r from-[rgb(var(--brand))] via-[rgb(var(--brand)/0.85)] to-[rgb(var(--brand))]"
                              : "bg-gradient-to-r from-base-content to-base-content/70"
                        }`}>{p.name}</h3>
                        <div className="mt-4 min-h-[76px]">
                          {p.startingPrice ? (
                            <div aria-label={`Starting from ${p.startingPrice} ${p.priceCurrency}`}>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/62">Starting from</p>
                              <p className="mt-1 text-3xl font-extrabold tracking-tight text-base-content">
                                {p.startingPrice}<span className="ml-1 text-sm font-semibold text-base-content/66">{p.priceCurrency}</span>
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/62">Flexible pricing</p>
                              <p className="mt-1 text-2xl font-extrabold tracking-tight text-base-content">{p.quoteTitle}</p>
                              <p className="mt-1 text-xs leading-5 text-base-content/62">{p.quoteDetail}</p>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-[15px] md:text-base leading-relaxed text-base-content/88 font-medium">{p.tagline}</p>
                      </div>

                      <div className="my-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

                      <ul className="space-y-3 flex-1">
                        {p.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ${
                              isPro ? "bg-[rgb(var(--brand)/0.10)] ring-[rgb(var(--brand)/0.40)]" : "bg-[rgb(var(--brand)/0.12)] ring-[rgb(var(--brand)/0.30)]"
                            }`}>
                              <Check className={`h-3.5 w-3.5 ${isPro ? "text-[rgb(var(--brand)/0.95)]" : "text-[rgb(var(--brand)/0.90)]"}`} aria-hidden="true" />
                            </span>
                            <span className="text-sm md:text-[15px] leading-6 text-base-content/92">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-base-content/12 bg-base-200/50 dark:bg-base-200/40 px-3 py-1 text-xs text-base-content/70">💬 {p.priceLabel}</span>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <a href={quoteHref} className="marketing-cta marketing-cta--primary marketing-cta--block">
                          Get a Quote
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: .15; }
          50% { opacity: .45; }
        }
        .animate-glowPulse { animation: glowPulse 2.4s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
