import { Helmet } from "react-helmet-async";

const BASE_URL = "https://milink.ca";
const BRAND = "MILINK";
const DEFAULT_IMAGE = `${BASE_URL}/og-cover.jpg`;

export default function SEO({
  title = "MILINK — Design • Build • Grow",
  description = "Milink builds fast, premium websites and e-commerce for ambitious brands. React/Next.js, SEO-first, analytics-driven.",
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  const url = `${BASE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={BRAND} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
