import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const BASE_URL = "https://milink.ca";
const DEFAULT_IMAGE = `${BASE_URL}/og-cover.jpg`;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Milink Digital Agency",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-437-600-3139",
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.instagram.com/milink.ca",
        "https://www.facebook.com/milink.ca",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "MILINK — Web Design, E-Commerce, SEO & Branding",
      description:
        "Web Design, E-Commerce Solutions, SEO, UI/UX & Branding in Toronto.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en-CA",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", url: `${BASE_URL}/#contact` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Milink Digital Agency",
      image: DEFAULT_IMAGE,
      url: BASE_URL,
      telephone: "+1-437-600-3139",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${plusJakarta.variable}`}
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
