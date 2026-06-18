import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell.jsx";
import { services } from "../../../data/content.js";

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export function generateMetadata({ params }) {
  const service = services.find((s) => s.id === params.id);
  if (!service) return {};

  return {
    title: `${service.title} — MILINK Toronto`,
    description: service.desc,
    alternates: {
      canonical: `https://milink.ca/services/${service.id}`,
    },
  };
}

export default function ServiceDetailPage({ params }) {
  const service = services.find((s) => s.id === params.id);
  if (!service) notFound();

  return (
    <PageShell>
      <article className="container max-w-3xl py-16">
        <p className="text-sm text-base-content/60 mb-2">
          <Link href="/services" className="link link-hover">
            Services
          </Link>
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
          {service.title}
        </h1>
        <p className="text-lg text-base-content/80 mb-8">{service.longDesc}</p>
        <ul className="list-disc list-inside space-y-2 mb-10 text-base-content/85">
          {service.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="btn btn-primary rounded-full px-8"
        >
          Get a quote
        </Link>
      </article>
    </PageShell>
  );
}
