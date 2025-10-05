export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  // { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  // ===== CORE (Top 3) =====
  {
    id: "web",
    tier: "core",
    icon: "CodeBracketIcon",
    badge: "Popular",
    title: "Web Design & Development",
    desc: "Fast, responsive websites that impress and convert visitors into customers.",
    bullets: [
      "Mobile-first UI",
      "High performance (95+ Lighthouse)",
      "SEO foundations",
    ],
    longDesc:
      "We plan, design, and build premium websites that look sharp and load fast. Your site will be easy to update, optimized for Google, and designed to turn visitors into customers.",
  },
  {
    id: "maint",
    tier: "core",
    icon: "WrenchScrewdriverIcon",
    badge: "Popular",
    title: "Website Maintenance & Redesign",
    desc: "Ensure your site runs smoothly, stays secure, and wows visitors year-round.",
    bullets: [
      "Core updates & backups",
      "Security & uptime",
      "Design refreshes",
    ],
    longDesc:
      "We keep your site healthy and polished: updates, backups, monitoring, and quick fixes. Need a visual refresh or better conversions? We improve UX without breaking what already works.",
  },
  {
    id: "ecom",
    tier: "core",
    icon: "ShoppingCartIcon",
    badge: "In Demand",
    title: "E-Commerce Solutions",
    desc: "Secure, scalable stores built for higher sales and retention.",
    bullets: [
      "Shopify builds",
      "CRO product pages",
      "Checkout & email capture",
    ],
    longDesc:
      "From storefront setup to conversion-focused product pages, we build fast, secure shops with clean structure, smooth checkout, and tracking—so you can grow with confidence.",
  },

  // ===== EXTRA (More ways we can help) =====
  {
    id: "seo",
    tier: "extra",
    icon: "MagnifyingGlassIcon",
    badge: "High ROI",
    title: "SEO Optimization",
    desc: "Rank higher on Google, attract quality traffic, and grow your reach.",
    bullets: ["Technical audit", "Schema & meta", "Editorial calendar"],
    longDesc:
      "We remove technical blockers, add structured data, and ship a simple content plan. The result: steady, compounding organic traffic that brings ready-to-buy visitors.",
  },
  {
    id: "ads",
    tier: "extra",
    icon: "RocketLaunchIcon",
    title: "Paid Growth",
    desc: "Google & Meta ads with CRO-tuned landing pages.",
    bullets: ["GA4/Tags plan", "Search / PMAX / Meta", "A/B testing"],
    longDesc:
      "We run targeted campaigns and pair them with fast, focused landing pages. Clear tracking shows what works, and experiments help you scale your best performers.",
  },
  {
    id: "brand",
    tier: "extra",
    icon: "PaintBrushIcon",
    title: "Branding & Identity",
    desc: "Distinctive visual system and usage guide.",
    bullets: ["Logo suite", "Color & typography", "Brand book"],
    longDesc:
      "A clean, memorable identity that fits your business. You’ll get logo variations, type and color rules, and a short brand guide so everything stays consistent.",
  },
  {
    id: "analytics",
    tier: "extra",
    icon: "ChartBarIcon",
    title: "Analytics & Attribution",
    desc: "Event schema and dashboards tied to goals.",
    bullets: ["GA4 + GTM", "Events & funnels", "Attribution reports"],
    longDesc:
      "We define the events that matter, implement tracking correctly, and build simple dashboards—so decisions are based on facts, not guesses.",
  },
  {
    id: "ux",
    tier: "extra",
    icon: "DevicePhoneMobileIcon",
    title: "UI/UX Design",
    desc: "Intuitive interfaces that keep users engaged.",
    bullets: ["Wireflows", "Design systems", "Usability fixes"],
    longDesc:
      "From flows and wireframes to polished components, we design interfaces that reduce friction and guide users to action on any device.",
  },
  {
    id: "assets",
    tier: "extra",
    icon: "PhotoIcon",
    title: "Image & Asset Optimization",
    desc: "Smaller, smarter assets (WebP, srcset) for faster loads.",
    bullets: ["WebP/AVIF", "Responsive images", "CDN & caching"],
    longDesc:
      "We compress and serve images the right way, tune caching/CDN, and boost Core Web Vitals. Faster pages = better SEO and more conversions.",
  },
];

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
    title: "Sky Contracting Inc",
    summary: "Renovation & cabinetry site highlighting services.",
    cover: "/assets/img/sky.jpg",
    liveUrl: "https://skyinc.ca",
  },
  {
    id: "p4",
    title: "Zarsa Gold",
    summary: "Jewelry e-commerce site built for elegance and trust.",
    cover: "/assets/img/zarsagold.jpg",
    liveUrl: "https://zarsa2.vercel.app/",
  },
  {
    id: "p5",
    title: "Tarahan Choob",
    summary: "Cabinetry & office furniture design/build studio.",
    cover: "/assets/img/tarahanchoob.jpg",
    liveUrl: "#",
  },
  {
    id: "p6",
    title: "Jahan Ariya",
    summary: "Metalworks & industrial hardware fabrication.",
    cover: "/assets/img/jahanariya.jpg",
    liveUrl: "#",
  },
];

export const pricing = [
  {
    name: "Starter",
    priceLabel: "Contact us for a quote",
    tagline: "A simple one-page website to get your business online fast.",
    items: [
      "One-page website",
      "Mobile-friendly design",
      "Basic SEO setup",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Growth",
    popular: true,
    badge: "Most Popular",
    priceLabel: "Contact us for a quote",
    tagline:
      "A professional multi-page site designed to bring you leads and growth.",
    items: [
      "5–7 custom pages (Home, Services, About, Contact…)",
      "SEO setup for better Google ranking",
      "Lead capture forms (emails, signups)",
      "Basic analytics to track visitors",
    ],
  },
  {
    name: "Scale",
    priceLabel: "Contact us for a quote",
    tagline:
      "A custom website with advanced features, CMS, and integrations for bigger businesses.",
    items: [
      "Custom pages and layouts",
      "Blog or CMS included",
      "Integrations (CRM, payments, tools)",
      "Conversion optimization (better sales)",
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
