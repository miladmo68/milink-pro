import { pricing } from "../data/content.js";
import { Check } from "lucide-react"; // optional

// ⬇️ فقط این خط جدید اضافه شد
import { RevealStagger, SlideIn } from "../components/scroll-reveal.jsx";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-20"
      style={{ ["--brand"]: "59 130 246" }} // rgb(59,130,246) — آبی اصلی سایت
    >
      {/* ===== Background ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:18px_18px]" />
        <div className="absolute inset-x-0 top-[-120px] h-[340px] blur-3xl opacity-35 bg-gradient-to-r from-[rgb(var(--brand)/0.40)] via-[rgb(var(--brand)/0.18)] to-[rgb(var(--brand)/0.40)]" />
      </div>

      <div className="container">
        {/* ===== Header ===== */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
            Pricing & Packages
          </h2>
          <p className="mt-3 text-base-content/70">
            Choose what fits now—upgrade any time as you grow.
          </p>
          <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-[rgb(var(--brand)/0.9)] via-[rgb(var(--brand)/0.6)] to-[rgb(var(--brand)/0.9)]" />
        </div>

        {/* ===== Cards (فقط افکت اضافه شده) ===== */}
        <RevealStagger className="mt-12 grid gap-8 sm:gap-10 md:grid-cols-3 justify-center">
          {pricing.map((p, i) => {
            const isPopular = !!p.popular;
            const isPro = (p.name || "").toLowerCase() === "professional";

            // ===== Frame & Border (فقط Pro) =====
            const frameBase =
              "group relative overflow-hidden rounded-2xl transition-transform duration-300";
            const framePadding = isPro ? "p-[2px] md:p-[3px]" : "p-[1px]";

            const borderBase =
              "before:absolute before:inset-0 before:-z-10 before:rounded-2xl";

            // تغییر فقط این بخش: شروع از بالا، تمرکز گوشهٔ بالا-چپ، قوس پررنگ بلندتر
            const borderGradient = isPro
              ? "before:opacity-100 before:bg-[conic-gradient(from_-60deg_at_0%_0%,rgba(59,130,246,0.95)_0deg,rgba(59,130,246,0.60)_210deg,transparent_330deg)]"
              : "before:opacity-90 before:bg-[conic-gradient(from_0deg,rgba(59,130,246,0.7),rgba(59,130,246,0.25),transparent_220deg)]";

            // base lift
            const lift = isPopular
              ? "md:scale-[1.02] hover:md:scale-[1.04]"
              : "hover:-translate-y-1";

            // Professional glow (بدون تغییر)
            const proGlow = isPro
              ? " z-[1] md:scale-[1.08] hover:md:scale-[1.1] " +
                " ring-6 ring-[rgb(var(--brand)/0.9)] " +
                " [box-shadow:0_0_100px_-10px_rgba(59,130,246,0.75)] " +
                " after:absolute after:inset-[-14%] after:-z-20 after:rounded-[32px] after:blur-3xl " +
                " after:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]"
              : "";

            const cardOuter = [
              frameBase,
              framePadding,
              borderBase,
              borderGradient,
              lift,
              proGlow,
              "max-w-sm mx-auto",
            ].join(" ");

            // ⬇️ فقط این لایه‌ی SlideIn اضافه شد (dir مثل نمونه‌ی خودت)
            return (
              <SlideIn
                key={i}
                dir={i % 3 === 0 ? "left" : i % 3 === 1 ? "up" : "right"}
                dist={36}
              >
                <article className={cardOuter}>
                  {/* inner glass card */}
                  <div
                    className={
                      "relative h-full rounded-2xl bg-base-200/70 backdrop-blur-sm " +
                      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] " +
                      "transition-transform flex flex-col justify-between " +
                      "min-h-[500px] md:min-h-[580px]"
                    }
                  >
                    {/* ambient glow (بدون تغییر) */}
                    <div aria-hidden className="absolute inset-0 -z-10">
                      <div
                        className={`absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent_75%)] ${
                          isPro
                            ? "bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.14),transparent_65%)]"
                            : "bg-[radial-gradient(50%_50%_at_50%_0%,rgba(59,130,246,0.10),transparent_65%)]"
                        }`}
                      />
                    </div>

                    {/* sweep hover effect */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-[8deg]" />
                    </div>

                    {/* badge */}
                    {isPopular && (
                      <div className="absolute -right-9 top-6 rotate-45">
                        <span className="relative text-[11px] px-7 py-1 rounded-sm bg-[rgb(var(--brand))] text-white shadow-md">
                          {p.badge || "Most Popular"}
                          <span className="pointer-events-none absolute inset-0 rounded-sm animate-glowPulse bg-[rgb(var(--brand)/0.40)] blur-sm" />
                        </span>
                      </div>
                    )}

                    {/* content */}
                    <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                      <div className="text-center">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-base-content/60">
                          Plan
                        </div>
                        <h3
                          className={`mt-1 text-2xl md:text-3xl font-bold leading-tight bg-clip-text text-transparent ${
                            isPro
                              ? "bg-gradient-to-r from-[rgb(var(--brand)/0.85)] via-[rgb(var(--brand))] to-[rgb(var(--brand)/0.80)]"
                              : isPopular
                              ? "bg-gradient-to-r from-[rgb(var(--brand))] via-[rgb(var(--brand)/0.85)] to-[rgb(var(--brand))]"
                              : "bg-gradient-to-r from-base-content to-base-content/70"
                          }`}
                        >
                          {p.name}
                        </h3>
                        <p className="mt-3 text-[15px] md:text-base leading-relaxed text-base-content/85 font-medium">
                          {p.tagline}
                        </p>
                      </div>

                      <div className="my-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

                      {/* features */}
                      <ul className="space-y-2.5 flex-1">
                        {p.items.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span
                              className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-1 ${
                                isPro
                                  ? "bg-[rgb(var(--brand)/0.10)] ring-[rgb(var(--brand)/0.40)]"
                                  : "bg-[rgb(var(--brand)/0.12)] ring-[rgb(var(--brand)/0.30)]"
                              }`}
                            >
                              {Check ? (
                                <Check
                                  className={`h-3.5 w-3.5 ${
                                    isPro
                                      ? "text-[rgb(var(--brand)/0.95)]"
                                      : "text-[rgb(var(--brand)/0.90)]"
                                  }`}
                                />
                              ) : (
                                <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--brand)/0.85)]" />
                              )}
                            </span>
                            <span className="text-sm md:text-[15px] leading-6 text-base-content/90">
                              {it}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* price chip */}
                      {p.priceLabel && (
                        <div className="mt-6">
                          <span className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/70 px-3 py-1 text-xs text-base-content/70">
                            💬 {p.priceLabel}
                          </span>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
                        <a
                          href="#contact"
                          className={`relative overflow-hidden shadow-md hover:shadow-xl ${
                            isPro
                              ? "btn px-6 py-3 font-semibold text-white bg-gradient-to-r from-[rgb(var(--brand))] via-[rgb(var(--brand))] to-[rgb(var(--brand))] border-none"
                              : "btn bg-[rgb(var(--brand))] text-white border-none hover:bg-[rgb(var(--brand)/0.90)]"
                          }`}
                        >
                          <span className="relative z-10">Get a Quote</span>
                          {isPro && (
                            <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-[rgb(var(--brand)/0.80)] transition duration-300"></span>
                          )}
                        </a>
                        <a
                          href="#contact"
                          className="btn btn-ghost border-base-content/10 hover:bg-base-200/60"
                        >
                          Talk to expert
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </SlideIn>
            );
          })}
        </RevealStagger>
      </div>

      {/* keyframes for badge glow */}
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
