export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
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
    id: "saas",
    title: "SaaS Lead Gen",
    tag: "SEO + CRO",
    summary: "3x demo bookings in 60 days.",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "ecom",
    title: "D2C Scale",
    tag: "Ads + Analytics",
    summary: "+220% ROAS in 90 days.",
    cover:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "local",
    title: "Local Biz Boost",
    tag: "Web + GMB",
    summary: "Calls up 170% MoM.",
    cover:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1400&auto=format&fit=crop",
  },
];

export const pricing = [
  {
    name: "Starter",
    price: 999,
    items: ["One‑page site", "Basic SEO", "2 revisions"],
  },
  {
    name: "Growth",
    price: 2499,
    items: ["5–7 pages", "SEO setup", "Lead capture", "Analytics"],
    popular: true,
  },
  {
    name: "Scale",
    price: 4999,
    items: ["Custom pages", "CRO", "Blog/CMS", "Integrations"],
  },
];

export const faqs = [
  {
    q: "How long does a site take?",
    a: "Most sites launch in 2–4 weeks depending on scope and content readiness.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes—monthly care plans for updates, SEO, and performance.",
  },
  { q: "Which stack do you use?", a: "React + Vite, TailwindCSS, DaisyUI." },
];
