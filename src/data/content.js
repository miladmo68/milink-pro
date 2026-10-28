export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export const services = [
  {
    id: "web",
    icon: "CodeBracketIcon",
    badge: "Popular",
    title: "Web Design & Development",
    desc: "Custom, responsive business websites built for performance, usability, and conversion.",
    bullets: [
      "Mobile-first design",
      "95+ Lighthouse performance",
      "Easy-to-manage CMS options",
    ],
    longDesc:
      "We design and develop responsive business websites with clear structure, mobile-first layouts, SEO-friendly foundations, and performance-focused builds. The result is a site that is easy to use, simple to manage, and built around your business goals.",
  },
  {
    id: "ecom",
    icon: "ShoppingCartIcon",
    badge: "In Demand",
    title: "E-Commerce Solutions (Shopify & WordPress)",
    desc: "Shopify and WooCommerce stores with responsive product pages and checkout setup.",
    bullets: [
      "Shopify storefronts",
      "WooCommerce setups",
      "Optimized product pages & checkout",
    ],
    longDesc:
      "We build Shopify and WooCommerce stores with responsive storefronts, product pages, checkout setup, email capture, payment integration, and optional custom functionality. The store structure is planned around a clear shopping experience and room to grow.",
  },
  {
    id: "seo",
    icon: "MagnifyingGlassIcon",
    badge: "High ROI",
    title: "SEO & Performance Optimization",
    desc: "Technical SEO, metadata, and performance improvements for stronger search foundations.",
    bullets: [
      "Technical SEO audit",
      "Structured data & metadata",
      "Content & keyword strategy",
    ],
    longDesc:
      "We improve the technical foundations that help search engines and visitors understand and use your website: site structure, metadata, schema, content planning, and performance. This practical work supports discoverability and a faster site experience.",
  },
  {
    id: "maint",
    icon: "WrenchScrewdriverIcon",
    badge: "Care",
    title: "Website Maintenance & Support",
    desc: "Ongoing updates, backups, security monitoring, and support after launch.",
    bullets: [
      "Updates & backups",
      "Security monitoring",
      "Content updates & quick fixes",
    ],
    longDesc:
      "After launch, we handle website updates, backups, security monitoring, content changes, performance improvements, and quick fixes. Ongoing support keeps your site current and gives your team a clear place to request changes.",
  },
  {
    id: "brand",
    icon: "PaintBrushIcon",
    badge: "Identity",
    title: "Branding & Identity",
    desc: "Logo, typography, colour systems, and a consistent brand foundation.",
    bullets: [
      "Custom logo design",
      "Typography & color systems",
      "Mini brand book",
    ],
    longDesc:
      "We create the visual building blocks for a consistent brand: a logo suite, typography and colour choices, and a concise brand guide. These assets help your website and other touchpoints look aligned.",
  },
  {
    id: "ux",
    icon: "DevicePhoneMobileIcon",
    badge: "Experience",
    title: "UI/UX Design",
    desc: "User flows, wireframes, and interface design for clearer digital experiences.",
    bullets: [
      "User flows & wireframes",
      "Reusable design systems",
      "Usability improvements",
    ],
    longDesc:
      "We plan user flows, wireframes, design systems, and interface refinements that make important actions easier to understand. The focus is clearer navigation, fewer friction points, and a more usable experience across devices.",
  },
];

// // Each project carries full-page captures of the live site (desktop 1200px and
// mobile 390px wide) so the Work section can scroll through the real thing.
const shot = (slug, device, width, height) => ({ src: `/assets/work/${slug}-${device}.jpg`, width, height });

export const work = [
  {
    id: "p1",
    slug: "fair-construction",
    title: "Fair Construction",
    summary: "Construction company site with project showcases.",
    tags: ["Web design", "Development", "Construction"],
    tint: [255, 200, 70],
    liveUrl: "https://fairconstructions.ca/",
    shots: { desktop: shot("fair-construction", "desktop", 1200, 5834), mobile: shot("fair-construction", "mobile", 390, 9000) },
  },
  {
    id: "p2",
    slug: "kind-steps",
    title: "Kind Steps",
    summary: "Therapy & behavioral services site designed for families.",
    tags: ["Web design", "Development", "Healthcare"],
    tint: [150, 112, 255],
    liveUrl: "https://kindsteps.ca/",
    shots: { desktop: shot("kind-steps", "desktop", 1200, 5626), mobile: shot("kind-steps", "mobile", 390, 9000) },
  },
  {
    id: "p3",
    slug: "intershine",
    title: "Intershine",
    summary: "Cleaning services website with a modern, clear layout.",
    tags: ["Web design", "Development", "Local services"],
    tint: [45, 190, 190],
    liveUrl: "https://intershine-ca.vercel.app/",
    shots: { desktop: shot("intershine", "desktop", 1200, 5834), mobile: shot("intershine", "mobile", 390, 9000) },
  },
  {
    id: "p4",
    slug: "zarsa-gold",
    title: "Zarsa Gold",
    summary: "Jewelry e-commerce site built for elegance and trust.",
    tags: ["Web design", "E-commerce", "Jewelry"],
    tint: [255, 189, 92],
    liveUrl: "https://zarsa.ca/",
    shots: { desktop: shot("zarsa-gold", "desktop", 1200, 3660), mobile: shot("zarsa-gold", "mobile", 390, 9000) },
  },
  {
    id: "p5",
    slug: "sky-contracting",
    title: "Sky Contracting Inc",
    summary: "Renovation & cabinetry site highlighting services.",
    tags: ["Web design", "Development", "Contracting"],
    tint: [66, 138, 240],
    liveUrl: "https://skyinc.ca",
    shots: { desktop: shot("sky-contracting", "desktop", 1200, 3926), mobile: shot("sky-contracting", "mobile", 390, 4493) },
  },
  {
    id: "p6",
    slug: "tarahan-choob",
    title: "Tarahan Choob",
    summary: "Cabinetry & office furniture design/build studio.",
    tags: ["Web design", "Persian · RTL", "Furniture"],
    tint: [214, 150, 60],
    liveUrl: "https://woodline-ir.vercel.app/",
    shots: { desktop: shot("tarahan-choob", "desktop", 1200, 4990), mobile: shot("tarahan-choob", "mobile", 390, 9000) },
  },
  {
    id: "p7",
    slug: "peg-studio",
    title: "PEG Studio",
    summary: "Interior design studio site with a calm, editorial layout.",
    tags: ["Web design", "Development", "Interior design"],
    tint: [64, 176, 154],
    liveUrl: "https://peg-studio-ten.vercel.app/",
    shots: { desktop: shot("peg-studio", "desktop", 1200, 3382), mobile: shot("peg-studio", "mobile", 390, 7091) },
  },
];

export const pricing = [
  {
    name: "Essential",
    mobileBadge: "Best Value", // shown only on phones, where the selected card gets the featured look
    startingPrice: "$399",
    priceCurrency: "CAD",
    scopeNote: "Final text, logo, and imagery supplied by your team.",
    tagline:
      "A polished one-page website for businesses that need a clear, professional online presence.",
    items: [
      "Custom one-page website tailored to your business",
      "Mobile-friendly layout for every screen",
      "Clear service, story, and contact sections with an enquiry form",
      "Essential on-page SEO setup",
      "One refinement round plus launch-ready setup and testing",
    ],
  },
  {
    name: "Professional",
    popular: true,
    badge: "Most Popular",
    startingPrice: "$699",
    priceCurrency: "CAD",
    tagline:
      "A complete business website with space to explain your services and turn visitors into inquiries.",
    items: [
      "Up to five custom pages",
      "Custom layout with dedicated services, work, and contact pages",
      "Conversion-focused navigation, calls to action, and proof sections",
      "Mobile-friendly design and essential SEO across your core pages",
      "One round of refinements before launch",
    ],
  },
  {
    name: "E-commerce & Custom",
    quoteTitle: "Custom quote",
    quoteDetail: "Based on your products, features, and goals",
    tagline:
      "A tailored website or online store built around the way your business works.",
    items: [
      "Shopify or WooCommerce store setup",
      "Product and collection pages with a clear mobile shopping experience",
      "Checkout and payment setup",
      "Custom pages and features tailored to your goals",
      "Optional booking, integrations, or multilingual support",
    ],
  },
];

// Side-by-side rows for the Pricing comparison table. Every cell restates what
// the approved package copy above already says (true = included, false = not
// part of the package, string = the short wording). Add nothing that is not in
// `pricing`. Order matches `pricing`: Essential, Professional, E-commerce & Custom.
export const pricingCompare = [
  { label: "Starting price", values: ["$399 CAD", "$699 CAD", "Custom quote"] },
  { label: "Pages", values: ["One page", "Up to five", "Tailored to your goals"] },
  { label: "Mobile-friendly design", values: [true, true, true] },
  { label: "On-page SEO", values: ["Essential", "Core pages", "Scoped with you"] },
  { label: "Proof sections and calls to action", values: [false, true, true] },
  { label: "Online store and checkout", values: [false, false, true] },
  { label: "Booking, integrations, multilingual", values: [false, false, "Optional"] },
  { label: "Refinement before launch", values: ["One round", "One round", "Scoped with you"] },
];

const essentialPackage = pricing.find((plan) => plan.name === "Essential");
const essentialStartingPriceLabel = `${essentialPackage.startingPrice} ${essentialPackage.priceCurrency}`;

// Written and approved by the clients themselves (supplied by the owner on
// 2026-10-27). Keep their exact wording; only add or change an entry with the
// client's approval. `name` is the business, `role` its industry.
export const testimonials = [
  {
    name: "Fair Construction",
    role: "Construction & Building",
    text: "We needed a website that looked as professional as the work we do, and Milink nailed it. They took our ideas and turned them into something modern, clean, and impressive. The attention to detail was excellent, and we're genuinely proud to share our new website.",
  },
  {
    name: "Kind Steps",
    role: "Therapy & Behavioral Services",
    text: "What we loved most about working with Milink was how much care they put into the little details. They created a warm, welcoming website that truly reflects who we are and what we do. It's beautiful, easy to use, and exactly what we had envisioned.",
  },
  {
    name: "Intershine",
    role: "Professional Cleaning Services",
    text: "We wanted something fresh, modern, and easy for our customers to use, and Milink absolutely delivered. They made the whole process feel simple and understood our vision perfectly. The finished website looks fantastic and represents our brand beautifully.",
  },
  {
    name: "Zarsa Gold",
    role: "Jewelry & E-Commerce",
    text: "Milink brought our vision to life in such a beautiful way. We wanted an elegant online store that would really let our jewelry shine, and that's exactly what they created. From the overall design to the smallest details, everything feels premium and thoughtfully crafted.",
  },
  {
    name: "Sky Contracting Inc.",
    role: "Renovation & Contracting",
    text: "Milink understood exactly what we wanted from day one. They gave our business a clean, professional website that really reflects the quality of our work. Everything feels polished, easy to navigate, and thoughtfully put together. We couldn't be happier with the result.",
  },
  {
    name: "Tarahan Choob",
    role: "Cabinetry & Interior Design",
    text: "Our work is all about design, craftsmanship, and the details that make a difference. Milink understood that right away. They built a beautiful, minimal website that lets our projects speak for themselves. The final result feels elegant, modern, and very true to our brand.",
  },
  {
    name: "PEG Studio",
    role: "Custom Furniture & Interior Design",
    text: "Working with Milink was a great experience from start to finish. They really understood our creative direction and turned it into a website that feels modern, refined, and full of personality. Every detail was carefully considered, and the result exceeded our expectations.",
  },
];


export const faqs = [
  {
    q: "How much does a website cost?",
    a: `Milink's Essential one-page business website starts from ${essentialStartingPriceLabel}. It is designed for businesses that need a polished, mobile-friendly online presence with a contact form and essential on-page SEO. Multi-page, e-commerce, and custom projects are scoped separately so the final scope matches what your business needs.`,
  },
  {
    q: "How long does it take to design and build a website?",
    a: "The timeline depends on the size and complexity of the project. A simple website can usually be completed faster than a multi-page, e-commerce, or custom build. Content readiness, integrations, revisions, and feedback can also affect timing. We provide a clear project timeline before development begins.",
  },
  {
    q: "Do you only work with businesses in Toronto?",
    a: "Milink is based in the Greater Toronto Area and works primarily with businesses in Toronto and the GTA. Because our process can be handled remotely, businesses outside the GTA can also contact us to discuss their project.",
  },
  {
    q: "What platforms do you use?",
    a: "We choose the platform based on the project's requirements rather than forcing every business into the same solution. For e-commerce, Milink works with Shopify and WordPress/WooCommerce. For business websites, we can recommend an appropriate modern CMS or development approach based on performance, content management, and functionality needs.",
  },
  {
    q: "Is SEO included with a new website?",
    a: "Every Milink website is built with SEO-friendly foundations such as clean structure, responsive design, performance considerations, and appropriate on-page setup. More advanced SEO, technical optimization, schema, keyword strategy, and ongoing search optimization can also be provided through our SEO & Performance Optimization service.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. If your current website looks outdated, loads slowly, is difficult to use, or is no longer supporting your business goals, we can review the existing site and recommend whether a redesign, rebuild, or targeted improvements make the most sense.",
  },
  {
    q: "Do you build e-commerce websites?",
    a: "Yes. Milink builds online stores using Shopify and WooCommerce. Depending on the project, this can include product pages, checkout and payment setup, responsive store design, conversion-focused layouts, and custom functionality or integrations.",
  },
  {
    q: "Will my website work properly on mobile devices?",
    a: "Yes. Milink websites are designed to be responsive and work across mobile, tablet, and desktop screen sizes. We also pay attention to usability, performance, navigation, and conversion paths on smaller screens.",
  },
  {
    q: "Do you provide support after the website launches?",
    a: "Yes. Milink offers website maintenance and ongoing support for businesses that need help after launch. This can include updates, backups, security monitoring, content changes, performance improvements, and other website maintenance needs.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};
