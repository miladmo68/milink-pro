import Link from "next/link";
import PageShell from "../../components/PageShell.jsx";
import { work, pricing } from "../../data/content.js";
import { serviceDetails } from "../../data/serviceDetails.js";
import { BASE_URL } from "../../config/site.js";

const URL_ = `${BASE_URL}/web-design-toronto`;
const DESCRIPTION =
  "Toronto web design studio building fast, mobile-first websites and online stores for GTA businesses. Custom design, SEO-ready, packages from $399 CAD.";

export const metadata = {
  title: "Web Design Toronto — Websites for GTA Businesses",
  description: DESCRIPTION,
  alternates: { canonical: URL_ },
  openGraph: { title: "Web Design Toronto | MILINK", description: DESCRIPTION, url: URL_ },
};

const AREAS = ["Toronto", "North York", "Scarborough", "Etobicoke", "Vaughan", "Richmond Hill", "Markham", "Mississauga", "Brampton", "Oakville"];

const FAQS = [
  ["How much does a website cost in Toronto?", "Prices vary widely. At Milink, a one-page Essential website starts from $399 CAD and a Professional website with up to five pages starts from $699 CAD. Online stores and custom features are quoted after a short call."],
  ["How long does it take to build a website?", "It depends on the size of the project and how quickly content is ready. A simple website is usually much faster than a large custom site or online store; we give you a timeline before starting."],
  ["Do you meet clients in person?", "We are based in the GTA and work with most clients by phone, video call and WhatsApp. Ask us if you prefer to meet."],
  ["Do you build websites for small businesses?", "Yes. Most of our clients are owner-run local businesses such as contractors, clinics, cleaning companies, interior studios and retailers."],
];

export default function WebDesignTorontoPage() {
  const pkgs = (pricing || []).filter((p) => p.startingPrice);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${URL_}#service`,
        name: "Web design in Toronto",
        serviceType: "Web design",
        description: DESCRIPTION,
        url: URL_,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: AREAS.map((name) => ({ "@type": "City", name })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="container max-w-3xl py-16 px-5" style={{ maxWidth: 780, marginInline: "auto" }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Web design in Toronto for businesses that want more customers</h1>
        <p className="text-lg text-base-content/80 mb-6">
          Milink is a web design studio in the Greater Toronto Area. We design and build custom websites and online stores for local
          businesses: clear about what you offer, fast on a phone, and built so customers can call, message or book you in a tap.
        </p>
        <p className="text-base-content/80 mb-10">
          You work directly with the developer who builds your site, and every project gets a private client portal for briefs, files,
          messages and approvals, so you always know where your project stands.
        </p>

        <h2 className="font-display text-2xl font-bold mb-4">Websites we&apos;ve built for GTA businesses</h2>
        <ul className="space-y-3 mb-10 text-base-content/85">
          {work.map((p) => (
            <li key={p.id}>
              <a href={p.liveUrl} className="link font-semibold" target="_blank" rel="noopener noreferrer">{p.title}</a>
              {": "}{p.summary}
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-bold mb-4">What we do</h2>
        <ul className="space-y-2 mb-10 text-base-content/85">
          {Object.entries(serviceDetails).map(([id, d]) => (
            <li key={id}>
              <Link href={`/services/${d.slug}`} className="link link-hover font-semibold">{d.seoTitle}</Link>
              {": "}{d.metaDescription.split(".")[0]}.
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-bold mb-4">Simple, upfront pricing</h2>
        <ul className="list-disc list-inside space-y-2 mb-4 text-base-content/85">
          {pkgs.map((p) => (
            <li key={p.name}><span className="font-semibold">{p.name}</span>: from {p.startingPrice} {p.priceCurrency}</li>
          ))}
          <li><span className="font-semibold">E-commerce &amp; custom</span>: quoted after a short call</li>
        </ul>
        <p className="text-base-content/80 mb-10">
          Compare everything on the <Link href="/pricing" className="link">pricing page</Link>.
        </p>

        <h2 className="font-display text-2xl font-bold mb-4">Areas we serve</h2>
        <p className="text-base-content/80 mb-10">
          {AREAS.join(", ")} and the rest of the GTA, plus clients elsewhere in Canada.
        </p>

        <h2 className="font-display text-2xl font-bold mb-4">Questions Toronto business owners ask</h2>
        <div className="space-y-6 mb-12">
          {FAQS.map(([q, a]) => (
            <div key={q}>
              <h3 className="font-semibold text-lg mb-1">{q}</h3>
              <p className="text-base-content/80">{a}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="marketing-cta marketing-cta--primary">Get a free quote</Link>
      </article>
    </PageShell>
  );
}
