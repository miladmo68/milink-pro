// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://milink.ca";
const BRAND = "MILINK";

export default function SEO({
  title = "MILINK — Web Design, E-Commerce, SEO & Branding in Toronto",
  description = "Our services include Web Design and Development, E-Commerce Solutions (Shopify, WordPress), SEO & Performance Optimization, UI/UX, Branding/Identity, and ongoing Website Maintenance & Support.",
  path = "/",
  type = "website",
}) {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph — og:image comes from src/app/opengraph-image.js (auto) */}
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter — twitter:image inherits from og:image */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="description"
        content="Our services include Web Design and Development, E-Commerce Solutions (Shopify, WordPress), SEO, UI/UX, Branding, and ongoing Website Maintenance and Support. Performance-optimized websites built with React/Next.js."
      />
    </Helmet>
  );
}
