import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { services } from "../data/content.js";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const BASE_URL = "https://milink.ca";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const LOCAL_BUSINESS_ID = `${BASE_URL}/#localbusiness`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const SERVICE_AREAS = [
  { "@type": "City", name: "Toronto" },
  { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
  { "@type": "AdministrativeArea", name: "Ontario" },
  { "@type": "Country", name: "Canada" },
];

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.118 0.011 266)" },
  ],
};

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "MILINK — Web Design, E-Commerce, SEO, UI/UX & Branding in Toronto",
    template: "%s | MILINK",
  },
  description:
    "Web Design and Development, E-Commerce Solutions (Shopify, WordPress), SEO & Performance Optimization, UI/UX, Branding/Identity, and ongoing Website Maintenance & Support. Toronto.",
  keywords: [
    "web design Toronto",
    "e-commerce development",
    "SEO Toronto",
    "UI/UX design",
    "branding",
    "Shopify",
    "WordPress",
    "website maintenance",
  ],
  authors: [{ name: "Milink Digital Agency", url: BASE_URL }],
  creator: "Milink Digital Agency",
  publisher: "Milink Digital Agency",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "MILINK",
    title: "MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding",
    description:
      "Premium websites & E-Commerce Solutions, SEO, UI/UX & Branding. Toronto.",
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: "MILINK — Web Design, E-Commerce, SEO & Branding in Toronto",
        type: "image/jpeg",
        secureUrl: DEFAULT_IMAGE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding",
    description:
      "Premium websites & E-Commerce Solutions, SEO, UI/UX & Branding.",
    images: [DEFAULT_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {},
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Milink Digital Agency",
      url: BASE_URL,
      description:
        "Web Design and Development, E-Commerce Solutions, SEO & Performance Optimization, UI/UX, Branding/Identity, and ongoing Website Maintenance & Support. Toronto.",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.png`,
        width: 192,
        height: 192,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-437-600-3139",
        contactType: "customer service",
        areaServed: SERVICE_AREAS,
      },
      areaServed: SERVICE_AREAS,
      sameAs: ["https://www.instagram.com/milink.ca"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: BASE_URL,
      name: "MILINK — Web Design, E-Commerce, SEO & Branding",
      description:
        "Web Design, E-Commerce Solutions, SEO, UI/UX & Branding in Toronto.",
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en-CA",
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": LOCAL_BUSINESS_ID,
      name: "Milink Digital Agency",
      image: DEFAULT_IMAGE,
      url: BASE_URL,
      telephone: "+1-437-600-3139",
      description:
        "Web Design and Development, E-Commerce Solutions, SEO & Performance Optimization, UI/UX, Branding/Identity, and ongoing Website Maintenance & Support. Toronto.",
      parentOrganization: { "@id": ORGANIZATION_ID },
      areaServed: SERVICE_AREAS,
    },
    ...services.map((service) => ({
      "@type": "Service",
      "@id": `${BASE_URL}/#service-${service.id}`,
      name: service.title,
      description: service.desc,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: SERVICE_AREAS,
    })),
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var key = 'milink-theme-mode';
  var stored = typeof localStorage !== 'undefined' && localStorage.getItem(key);
  var pref = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var theme = stored || pref;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
