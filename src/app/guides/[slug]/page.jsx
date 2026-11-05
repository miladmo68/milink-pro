import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell.jsx";
import { SeoHero, SeoSection, SeoCards, SeoChecklist, SeoSteps, SeoFaq, SeoLinks, SeoCta } from "../../../components/seo/SeoBlocks.jsx";
import { guides, findGuide, GUIDES_UPDATED } from "../../../data/guides.js";
import { BASE_URL } from "../../../config/site.js";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const g = findGuide(params.slug);
  if (!g) return {};
  const url = `${BASE_URL}/guides/${g.slug}`;
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: `${g.metaTitle} | MILINK`, description: g.description, url, type: "article" },
  };
}

function Body({ s }) {
  if (s.type === "steps") return <SeoSteps steps={s.items} />;
  if (s.type === "cards") return <SeoCards items={s.items} />;
  return <SeoChecklist items={s.items} />;
}

export default function GuidePage({ params }) {
  const g = findGuide(params.slug);
  if (!g) notFound();
  const url = `${BASE_URL}/guides/${g.slug}`;
  const others = guides.filter((o) => o.slug !== g.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: g.title,
        description: g.description,
        url,
        dateModified: GUIDES_UPDATED,
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: [[g.title, g.answer], ...g.faqs].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="sp-wrap">
        <SeoHero eyebrow={g.eyebrow} title={g.title} intro={g.answer} />
        {g.sections.map((s) => (
          <SeoSection key={s.title} title={s.title}>
            <Body s={s} />
            {s.link ? <p className="sp-hero__sub"><Link href={s.link.href}>{s.link.label} →</Link></p> : null}
          </SeoSection>
        ))}
        <SeoSection eyebrow="FAQ" title="Common questions">
          <SeoFaq faqs={g.faqs} />
        </SeoSection>
        <SeoSection eyebrow="More guides" title="Keep reading">
          <SeoLinks links={[...others.map((o) => ({ href: `/guides/${o.slug}`, label: o.nav })), { href: "/web-design-toronto", label: "Web design in Toronto" }]} />
        </SeoSection>
        <SeoCta text="Tell us about your business and we'll give you a clear price and timeline before any work starts." />
      </div>
    </PageShell>
  );
}
