import Link from "next/link";
import PageShell from "../../components/PageShell.jsx";
import { SeoHero, SeoSection, SeoChecklist, SeoFaq, SeoLinks, SeoCta } from "../../components/seo/SeoBlocks.jsx";
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
      <div className="sp-wrap">
        <SeoHero
          eyebrow="Web design · Toronto & GTA"
          title="Web design in Toronto for businesses that want"
          accent="more customers"
          intro="Milink is a web design studio in the Greater Toronto Area. We design and build custom websites and online stores for local businesses: clear about what you offer, fast on a phone, and built so customers can call, message or book you in a tap."
          sub="You work directly with the developer who builds your site, and every project gets a private client portal for briefs, files, messages and approvals, so you always know where your project stands."
        />

        <SeoSection eyebrow="Our work" title="Websites we've built for GTA businesses">
          <ul className="sp-work">
            {work.map((p) => (
              <li key={p.id}>
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                  <b>{p.title}</b>
                  <span>{p.summary}</span>
                  <em>Visit live site →</em>
                </a>
              </li>
            ))}
          </ul>
        </SeoSection>

        <SeoSection eyebrow="Services" title="What we do">
          <ul className="sp-work">
            {Object.entries(serviceDetails).map(([id, d]) => (
              <li key={id}>
                <Link href={`/services/${d.slug}`}>
                  <b>{d.seoTitle.replace(/ in Toronto$/, "")}</b>
                  <span>{d.metaDescription.split(".")[0]}.</span>
                  <em>Learn more →</em>
                </Link>
              </li>
            ))}
          </ul>
        </SeoSection>

        <SeoSection eyebrow="Pricing" title="Simple, upfront pricing">
          <SeoChecklist
            items={[
              ...pkgs.map((p) => `${p.name}: from ${p.startingPrice} ${p.priceCurrency}`),
              "E-commerce & custom: quoted after a short call",
            ]}
          />
        </SeoSection>

        <SeoSection eyebrow="Areas we serve" title="Across Toronto and the GTA">
          <SeoLinks links={AREAS.map((a) => ({ href: "/contact", label: a }))} />
        </SeoSection>

        <SeoSection eyebrow="FAQ" title="Questions Toronto business owners ask">
          <SeoFaq faqs={FAQS} />
        </SeoSection>

        <SeoCta text="Tell us about your business and we'll recommend the right package for your budget." />
      </div>
    </PageShell>
  );
}
