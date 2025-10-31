export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  // { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  {
    id: "web",
    icon: "CodeBracketIcon",
    badge: "Popular",
    title: "Web Design & Development",
    desc: "Custom, responsive websites that are fast, secure, and designed to convert.",
    bullets: [
      "Mobile-first design",
      "95+ Lighthouse performance",
      "Easy-to-manage CMS options",
    ],
    longDesc:
      "We design and develop modern websites that go beyond just looking good. Our builds are responsive, SEO-friendly, and optimized for speed. You’ll get a website that is simple to manage and designed to turn visitors into customers.",
  },
  {
    id: "ecom",
    icon: "ShoppingCartIcon",
    badge: "In Demand",
    title: "E-Commerce Solutions (Shopify & WordPress)",
    desc: "Scalable online stores with Shopify or WordPress WooCommerce.",
    bullets: [
      "Shopify storefronts",
      "WooCommerce setups",
      "Optimized product pages & checkout",
    ],
    longDesc:
      "Whether you want a powerful Shopify store or a flexible WordPress WooCommerce shop, we deliver secure, scalable, and conversion-optimized e-commerce solutions. From product pages and checkout flows to email capture and payment integration, everything is built for higher sales and long-term growth.",
  },
  {
    id: "seo",
    icon: "MagnifyingGlassIcon",
    badge: "High ROI",
    title: "SEO & Performance Optimization",
    desc: "Improve Google rankings, site speed, and organic reach.",
    bullets: [
      "Technical SEO audit",
      "Structured data & metadata",
      "Content & keyword strategy",
    ],
    longDesc:
      "We go beyond basic SEO: fixing technical issues, adding schema and metadata, and creating a simple but effective content plan. Combined with performance optimization, your site will load faster, rank higher, and attract quality traffic.",
  },
  {
    id: "maint",
    icon: "WrenchScrewdriverIcon",
    title: "Website Maintenance & Support",
    desc: "Keep your site secure, up-to-date, and running smoothly.",
    bullets: [
      "Updates & backups",
      "Security monitoring",
      "Content updates & quick fixes",
    ],
    longDesc:
      "Launching your site is just the beginning. We provide ongoing maintenance and support, including security monitoring, backups, and updates. Need changes to your content or design tweaks? We’ve got you covered long-term.",
  },
  {
    id: "brand",
    icon: "PaintBrushIcon",
    title: "Branding & Identity",
    desc: "Build a strong, consistent brand presence.",
    bullets: [
      "Custom logo design",
      "Typography & color systems",
      "Mini brand book",
    ],
    longDesc:
      "We help your brand stand out with a clean and memorable identity. You’ll get a professional logo suite, a tailored typography and color system, and a concise brand guide for consistent use across all channels.",
  },
  {
    id: "ux",
    icon: "DevicePhoneMobileIcon",
    title: "UI/UX Design",
    desc: "Intuitive and engaging interfaces for all devices.",
    bullets: [
      "User flows & wireframes",
      "Reusable design systems",
      "Usability improvements",
    ],
    longDesc:
      "From wireflows and design systems to usability testing and refinement, we design experiences that reduce friction and guide users towards meaningful actions — boosting engagement and conversions.",
  },
];

// export const work = [
//   {
//     id: "p1",
//     title: "Intershine",
//     summary: "Cleaning services website with a modern, clear layout.",
//     cover: "/assets/img/intershine.png",
//     liveUrl: "https://intershine.ca",
//   },
//   {
//     id: "p2",
//     title: "Fair Construction",
//     summary: "Construction company site with project showcases.",
//     cover: "/assets/img/fairconstruction.jpg",
//     liveUrl: "https://fairconstruction.ca",
//   },
//   {
//     id: "p3",
//     title: "Sky Contracting Inc",
//     summary: "Renovation & cabinetry site highlighting services.",
//     cover: "/assets/img/sky.jpg",
//     liveUrl: "https://skyinc.ca",
//   },
//   {
//     id: "p4",
//     title: "Zarsa Gold",
//     summary: "Jewelry e-commerce site built for elegance and trust.",
//     cover: "/assets/img/zarsagold.png",
//     liveUrl: "https://zarsa2.vercel.app/",
//   },
//   {
//     id: "p5",
//     title: "Tarahan Choob",
//     summary: "Cabinetry & office furniture design/build studio.",
//     cover: "/assets/img/tarahanchoob.jpg",
//     liveUrl: "#",
//   },
//   {
//     id: "p6",
//     title: "Jahan Ariya",
//     summary: "Metalworks & industrial hardware fabrication.",
//     cover: "/assets/img/jahanariya.jpg",
//     liveUrl: "#",
//   },
// ];
export const work = [
  {
    id: "p1",
    title: "Intershine",
    summary: "Cleaning services website with a modern, clear layout.",
    cover: "/assets/img/intershine.png",
    liveUrl: "https://intershine.ca",
  },
  {
    id: "p2",
    title: "Fair Construction",
    summary: "Construction company site with project showcases.",
    cover: "/assets/img/fairconstruction.jpg",
    liveUrl: "https://fairconstruction.ca",
  },
  {
    id: "p3",
    title: "Kind Steps",
    summary: "Therapy & behavioral services site designed for families.",
    cover: "/assets/img/KindSteps.png",
    liveUrl: "https://kindsteps.ca/",
  },
  {
    id: "p4",
    title: "Zarsa Gold",
    summary: "Jewelry e-commerce site built for elegance and trust.",
    cover: "/assets/img/zarsagold.png",
    liveUrl: "https://zarsa2.vercel.app/",
  },
  {
    id: "p5",
    title: "Sky Contracting Inc",
    summary: "Renovation & cabinetry site highlighting services.",
    cover: "/assets/img/sky.jpg",
    liveUrl: "https://skyinc.ca",
  },
  {
    id: "p6",
    title: "Tarahan Choob",
    summary: "Cabinetry & office furniture design/build studio.",
    cover: "/assets/img/tarahanchoob.jpg",
    liveUrl: "#",
  },
];

export const pricing = [
  {
    name: "Essential",
    priceLabel: "Contact us for a quote",
    tagline:
      "A polished one-page site to launch your online presence with confidence.",
    items: [
      "Modern, responsive design that looks great on all devices",
      "Fast-loading pages with clean structure",
      "Foundational SEO so customers can find you on Google",
      "Contact form with built-in spam protection",
      "Two rounds of design refinements",
    ],
  },
  {
    name: "Professional",
    popular: true,
    badge: "Most Popular",
    priceLabel: "Contact us for a quote",
    tagline:
      "A multi-page, conversion-ready website designed to grow your business.",
    items: [
      "5–10 custom pages (Home, Services, About, Blog, Contact…)",
      "SEO optimization for higher Google visibility",
      "Lead capture forms (inquiries, newsletter signups) with CRM handoff",
      "Blog or CMS setup for easy content publishing",
      "Integrated analytics for visitor insights",
    ],
  },
  {
    name: "Enterprise",
    priceLabel: "Contact us for a quote",
    tagline:
      "A fully tailored solution with ecommerce and advanced integrations.",
    items: [
      "Unlimited custom pages and scalable design system",
      "Full ecommerce setup (Shopify/WooCommerce): products, checkout, payments",
      "Advanced integrations (CRM, ERP, APIs, automation)",
      "Multi-language support and performance optimization",
      "Security audits, priority support, and SLA",
    ],
  },
];

export const testimonials = [
  {
    name: "Reza Mohammadi",
    text: "Their UI/UX design completely elevated our product. Users love the new interface.",
    role: "",
  },
  {
    name: "Sarah Lee",
    text: "Milink built a stunning website for us — fast, modern, and scalable.",
    role: "",
  },
  {
    name: "Leila Karimi",
    text: "Our e-commerce store runs smoother than ever thanks to Milink.",
    role: "",
  },
  {
    name: "James Brown",
    text: "They boosted our search rankings in just weeks. SEO expertise at its best!",
    role: "",
  },
  {
    name: "Omid Farahani",
    text: "Their ongoing maintenance support is top-notch. Always reliable.",
    role: "",
  },
  {
    name: "Anna White",
    text: "The branding strategy they delivered gave us a strong new identity.",
    role: "",
  },
  {
    name: "Maryam Rahimi",
    text: "From concept to launch, they handled everything seamlessly.",
    role: "",
  },
  {
    name: "David Chen",
    text: "We launched faster thanks to their automation and integration expertise.",
    role: "",
  },
];

export const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Most standard sites launch in 2–4 weeks, depending on scope, content readiness, and feedback speed.",
  },
  {
    q: "Do you provide ongoing support and maintenance?",
    a: "Yes — we offer monthly care plans that cover updates, security, SEO monitoring, and performance improvements.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Absolutely. We can refresh the design, improve speed and SEO, and align it with your brand and goals.",
  },
  {
    q: "Do you work with e-commerce platforms like Shopify?",
    a: "Yes, we specialize in Shopify stores, optimized product pages, and high-conversion checkouts.",
  },
  {
    q: "How much does a website cost?",
    a: "Pricing depends on your project scope and goals. Share your requirements, and we’ll send you a tailored proposal quickly.",
  },
  {
    q: "What if I need something custom?",
    a: "No problem — we create custom solutions for unique needs. Reach out and we’ll respond promptly with options.",
  },
];
