import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell.jsx";
import { SeoHero, SeoSection, SeoCards, SeoChecklist, SeoSteps, SeoFaq, SeoLinks, SeoCta } from "../../../components/seo/SeoBlocks.jsx";
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

  const links = [
    ...others.map(([id, d]) => ({ href: `/services/${d.slug}`, label: d.seoTitle.replace(/ in Toronto$/, "") })),
    { href: "/web-design-toronto", label: "Web design in Toronto" },
  ];
  const [titleLead, ...rest] = detail.h1.split(" for ");

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="sp-wrap">
        <SeoHero
          eyebrow={service.title}
          title={rest.length ? `${titleLead} for` : detail.h1}
          accent={rest.length ? rest.join(" for ") : null}
          intro={detail.intro}
          sub={service.longDesc}
        />
        <SeoSection eyebrow="Who it's for" title="Is this right for your business?">
          <SeoCards items={detail.forWho} />
        </SeoSection>
        <SeoSection eyebrow="What's included" title="Everything you need, done properly">
          <SeoChecklist items={detail.included} />
        </SeoSection>
        <SeoSection eyebrow="How we work" title="A clear path from idea to launch">
          <SeoSteps steps={detail.process} />
        </SeoSection>
        <SeoSection eyebrow="FAQ" title="Frequently asked questions">
          <SeoFaq faqs={detail.faqs} />
        </SeoSection>
        <SeoCta text="Tell us about your business and we'll recommend the right package. No pressure, no jargon." />
        <SeoSection eyebrow="More from Milink" title="Other services">
          <SeoLinks links={links} />
        </SeoSection>
      </div>
    </PageShell>
  );
}
