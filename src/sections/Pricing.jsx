// import { pricing } from "../data/content.js";

// export default function Pricing() {
//   return (
//     <section id="pricing" className="py-16">
//       <div className="container">
//         <h2 className="text-center">Plans that scale</h2>

//         <div className="mt-10 grid md:grid-cols-3 gap-6">
//           {pricing.map((p, i) => {
//             const isPopular = !!p.popular;

//             // کارت‌های کناری (غیرمحبوب): تیره‌تر + هاله‌ی ملایم همیشه‌فعال
//             const sideCard = `
//               group relative z-0 overflow-hidden rounded-2xl
//               card bg-base-300/70 p-6
//               shadow-md
//               ring-1 ring-primary/10
//               transition-transform transition-shadow duration-200
//               hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40
//               focus-within:ring-primary/50
//             `;

//             // کارت وسط (محبوب): استایل فعلیِ پررنگ
//             const centerCard = `
//               group relative z-0 overflow-hidden rounded-2xl
//               card bg-base-200/60 p-6 shadow-soft
//               ring-2 ring-primary shadow-glow
//               transition-transform transition-shadow duration-200
//               before:content-[''] before:absolute before:inset-0 before:z-0
//               before:rounded-2xl before:pointer-events-none
//               before:bg-gradient-to-br before:from-primary/20 before:to-transparent
//               before:opacity-0 group-hover:before:opacity-100
//               hover:-translate-y-1 hover:shadow-xl hover:scale-[1.03]
//             `;

//             const articleCls = isPopular ? centerCard : sideCard;

//             return (
//               <article key={i} className={articleCls}>
//                 {isPopular && (
//                   <div className="badge badge-primary mb-2 self-center motion-safe:animate-pulse group-hover:motion-safe:animate-none">
//                     Most Popular
//                   </div>
//                 )}

//                 <h3 className="text-xl font-semibold">{p.name}</h3>

//                 <div className="mt-2 text-1xl font-bold">
//                   {p.tagline}
//                   <span className="text-base opacity-70 text-2xl"></span>
//                 </div>

//                 <ul className="mt-4 space-y-2">
//                   {p.items.map((it, idx) => (
//                     <li key={idx}>• {it}</li>
//                   ))}
//                 </ul>

//                 <a href="#contact" className="btn btn-primary mt-6">
//                   Contact Us
//                 </a>
//               </article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

/////////////////////////////
// import { pricing } from "../data/content.js";
// import { Check } from "lucide-react"; // optional

// export default function Pricing() {
//   return (
//     <section id="pricing" className="relative py-20">
//       {/* BG vibes */}
//       <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
//         <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:18px_18px]" />
//         <div className="absolute inset-x-0 top-[-120px] h-[320px] blur-3xl opacity-35 bg-gradient-to-r from-primary/40 via-fuchsia-500/25 to-cyan-400/25" />
//       </div>

//       <div className="container">
//         <div className="text-center max-w-2xl mx-auto">
//           <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
//             Plans that scale
//           </h2>
//           <p className="mt-3 text-base-content/70">
//             Choose a plan that fits now—upgrade whenever you’re ready.
//           </p>
//         </div>

//         <div className="mt-12 grid gap-6 md:grid-cols-3">
//           {pricing.map((p, i) => {
//             const isPopular = !!p.popular;

//             // frame with gradient border
//             const frame =
//               "group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300";
//             const border =
//               "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:opacity-80 " +
//               "before:bg-[conic-gradient(var(--tw-gradient-stops))] before:from-primary/70 before:via-primary/25 before:to-transparent";
//             const cardOuter = isPopular
//               ? `${frame} ${border} ring-2 ring-primary/40 shadow-[0_0_44px_-14px] shadow-primary/50 md:scale-[1.015] hover:md:scale-[1.03]`
//               : `${frame} ${border} hover:-translate-y-1`;

//             return (
//               <article key={i} className={cardOuter}>
//                 {/* inner glass card */}
//                 <div className="relative h-full rounded-2xl bg-base-200/70 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
//                   {/* shimmer on hover */}
//                   <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                     <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-[8deg]" />
//                   </div>

//                   {/* ribbon */}
//                   {isPopular && (
//                     <div className="absolute -right-10 top-6 rotate-45">
//                       <span className="bg-primary text-primary-content text-xs px-8 py-1 shadow-md rounded-sm">
//                         {p.badge || "Most Popular"}
//                       </span>
//                     </div>
//                   )}

//                   {/* content */}
//                   <div className="relative z-10 flex h-full flex-col p-7">
//                     {/* Title center + gradient */}
//                     <div className="text-center">
//                       <div className="text-xs uppercase tracking-widest text-base-content/60">
//                         Plan
//                       </div>
//                       <h3
//                         className={`mt-1 text-2xl font-bold leading-tight bg-clip-text text-transparent
//                           ${
//                             isPopular
//                               ? "bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-400"
//                               : "bg-gradient-to-r from-base-content to-base-content/70"
//                           }`}
//                       >
//                         {p.name}
//                       </h3>

//                       {/* Tagline nicer */}
//                       <p className="mt-3 text-[15px] md:text-base leading-relaxed text-base-content/80 font-medium">
//                         {p.tagline}
//                       </p>
//                     </div>

//                     {/* divider */}
//                     <div className="my-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

//                     {/* Features with pretty bullets */}
//                     <ul className="space-y-2.5">
//                       {p.items.map((it, idx) => (
//                         <li key={idx} className="flex items-start gap-3">
//                           <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
//                             {Check ? (
//                               <Check className="h-3.5 w-3.5 text-primary/90" />
//                             ) : (
//                               <span className="h-2 w-2 rounded-full bg-primary/80" />
//                             )}
//                           </span>
//                           <span className="text-sm md:text-[15px] leading-6">
//                             {it}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>

//                     {/* Price label (chip) */}
//                     {p.priceLabel && (
//                       <div className="mt-6">
//                         <span className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/60 px-3 py-1 text-xs text-base-content/70">
//                           <span className="i">💬</span>
//                           {p.priceLabel}
//                         </span>
//                       </div>
//                     )}

//                     {/* CTA row */}
//                     <div className="mt-6 flex items-center justify-center gap-3">
//                       <a
//                         href="#contact"
//                         className="btn btn-primary relative overflow-hidden shadow-md hover:shadow-lg"
//                       >
//                         <span className="relative z-10">Get a Quote</span>
//                         <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/10 to-transparent" />
//                       </a>
//                       <a
//                         href="#contact"
//                         className="btn btn-ghost border-base-content/10 hover:bg-base-200/60"
//                       >
//                         Talk to expert
//                       </a>
//                     </div>

//                     {/* micro-copy */}
//                     <p className="mt-3 text-center text-xs text-base-content/60">
//                       Fast kickoff in 7–10 business days • Cancel anytime
//                       pre-build
//                     </p>
//                   </div>
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

import { pricing } from "../data/content.js";
import { Check } from "lucide-react"; // optional

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20">
      {/* ===== Background vibes ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* micro-grid */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:18px_18px]" />
        {/* soft glow */}
        <div className="absolute inset-x-0 top-[-120px] h-[340px] blur-3xl opacity-35 bg-gradient-to-r from-primary/40 via-fuchsia-500/25 to-cyan-400/25" />
      </div>

      <div className="container">
        {/* ===== Header ===== */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/50 px-3 py-1 text-xs text-base-content/60">
            Pricing & Packages
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
            Plans that scale
          </h2>
          <p className="mt-3 text-base-content/70">
            Choose what fits now—upgrade any time as you grow.
          </p>
          {/* accent underline */}
          <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-400" />
        </div>

        {/* ===== Cards ===== */}
        <div className="mt-12 grid gap-6 sm:gap-7 md:grid-cols-3">
          {pricing.map((p, i) => {
            const isPopular = !!p.popular;

            // frame with gradient border
            const frame =
              "group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300";
            const border =
              "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:opacity-90 " +
              "before:bg-[conic-gradient(var(--tw-gradient-stops))] before:from-primary/70 before:via-primary/20 before:to-transparent";
            const lift = isPopular
              ? "md:scale-[1.02] hover:md:scale-[1.04]"
              : "hover:-translate-y-1";

            const cardOuter = `${frame} ${border} ${lift}`;

            return (
              <article key={i} className={cardOuter}>
                {/* inner glass card */}
                <div
                  className={
                    "relative h-full rounded-2xl bg-base-200/70 backdrop-blur-sm " +
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] " +
                    // tiny parallax tilt (no extra lib)
                    "transition-transform [transform-style:preserve-3d] group-hover:[transform:translateZ(0.0001px)_rotateX(0.5deg)_rotateY(-0.5deg)]"
                  }
                >
                  {/* shimmer sweep */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-[8deg]" />
                  </div>

                  {/* ribbon */}
                  {isPopular && (
                    <div className="absolute -right-9 top-6 rotate-45">
                      <span className="bg-primary text-primary-content text-[11px] px-7 py-1 shadow-md rounded-sm">
                        {p.badge || "Most Popular"}
                      </span>
                    </div>
                  )}

                  {/* content */}
                  <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                    {/* Title center + gradient */}
                    <div className="text-center">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-base-content/60">
                        Plan
                      </div>
                      <h3
                        className={`mt-1 text-2xl md:text-3xl font-bold leading-tight bg-clip-text text-transparent 
                          ${
                            isPopular
                              ? "bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-400"
                              : "bg-gradient-to-r from-base-content to-base-content/70"
                          }`}
                      >
                        {p.name}
                      </h3>

                      {/* Tagline stronger & centered */}
                      <p className="mt-3 text-[15px] md:text-base leading-relaxed text-base-content/85 font-medium">
                        {p.tagline}
                      </p>
                    </div>

                    {/* divider */}
                    <div className="my-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

                    {/* Features with glossy bullets */}
                    <ul className="space-y-2.5">
                      {p.items.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 ring-1 ring-primary/30">
                            {Check ? (
                              <Check className="h-3.5 w-3.5 text-primary/90" />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                            )}
                          </span>
                          <span className="text-sm md:text-[15px] leading-6 text-base-content/90">
                            {it}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Price label as chip (optional) */}
                    {p.priceLabel && (
                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100/70 px-3 py-1 text-xs text-base-content/70">
                          💬 {p.priceLabel}
                        </span>
                      </div>
                    )}

                    {/* CTA row */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
                      <a
                        href="#contact"
                        className="btn btn-primary relative overflow-hidden shadow-md hover:shadow-lg"
                      >
                        <span className="relative z-10">Get a Quote</span>
                        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/10 to-transparent" />
                      </a>
                      <a
                        href="#contact"
                        className="btn btn-ghost border-base-content/10 hover:bg-base-200/60"
                      >
                        Talk to expert
                      </a>
                    </div>

                    {/* micro-copy removed per your request */}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
