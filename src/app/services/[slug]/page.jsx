import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell.jsx";
import { services } from "../../../data/content.js";
import { serviceDetails, findServiceBySlug } from "../../../data/serviceDetails.js";
import { BASE_URL } from "../../../config/site.js";

export function generateStaticParams() {
  return Object.values(serviceDetails).map((d) => ({ slug: d.slug }));
}

function load(slug) {
  const detail = findServiceBySlug(slug);
  if (!detail) return null;
  const service = services.find((s) => s.id === detail.id);
  return service ? { service, detail } : null;
}

export function generateMetadata({ params }) {
  const data = load(params.slug);
  if (!data) return {};
  const { detail } = data;
  const url = `${BASE_URL}/services/${detail.slug}`;
  return {
    title: detail.seoTitle,
    description: detail.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: `${detail.seoTitle} | MILINK`, description: detail.metaDescription, url },
  };
}

export default function ServiceDetailPage({ params }) {
  const data = load(params.slug);
  if (!data) notFound();
  const { service, detail } = data;
  const url = `${BASE_URL}/services/${detail.slug}`;
  const others = Object.entries(serviceDetails).filter(([id]) => id !== detail.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: detail.seoTitle,
        description: detail.metaDescription,
        url,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: [
          { "@type": "City", name: "Toronto" },
          { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: detail.faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article className="container max-w-3xl py-16 px-5" style={{ maxWidth: 780, marginInline: "auto" }}>
        <p className="text-sm text-base-content/60 mb-2">
          <Link href="/services" className="link link-hover">
            Services
          </Link>
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{detail.h1}</h1>
        <p className="text-lg text-base-content/80 mb-6">{detail.intro}</p>
        <p className="text-base-content/80 mb-10">{service.longDesc}</p>

        <h2 className="font-display text-2xl font-bold mb-4">Who it&apos;s for</h2>
        <ul className="list-disc list-inside space-y-2 mb-10 text-base-content/85">
          {detail.forWho.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-bold mb-4">What&apos;s included</h2>
        <ul className="list-disc list-inside space-y-2 mb-10 text-base-content/85">
          {detail.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-bold mb-4">How we work</h2>
        <ol className="space-y-4 mb-10">
          {detail.process.map(([step, text], i) => (
            <li key={step} className="text-base-content/85">
              <span className="font-semibold text-base-content">
                {i + 1}. {step}:
              </span>{" "}
              {text}
            </li>
          ))}
        </ol>

        <h2 className="font-display text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-6 mb-12">
          {detail.faqs.map(([q, a]) => (
            <div key={q}>
              <h3 className="font-semibold text-lg mb-1">{q}</h3>
              <p className="text-base-content/80">{a}</p>
            </div>
          ))}
        </div>

        <p className="text-base-content/80 mb-6">
          See <Link href="/work" className="link">websites we&apos;ve built</Link> for GTA businesses,
          compare <Link href="/pricing" className="link">packages and pricing</Link>, or read about{" "}
          <Link href="/web-design-toronto" className="link">web design in Toronto</Link>.
        </p>

        <Link href="/contact" className="marketing-cta marketing-cta--primary">
          Get a quote
        </Link>

        <h2 className="font-display text-xl font-bold mt-16 mb-4">Other services</h2>
        <ul className="space-y-2 text-base-content/85">
          {others.map(([id, d]) => (
            <li key={id}>
              <Link href={`/services/${d.slug}`} className="link link-hover">
                {d.seoTitle}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}
