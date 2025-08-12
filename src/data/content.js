export const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  { id:"web", title: "Web Design & Build", desc: "Luxury UI, mobile-first, high performance.", bullets:["Component library","Accessibility AA","SEO foundations"] },
  { id:"seo", title: "SEO & Content", desc: "Technical SEO + content playbook.", bullets:["Tech audit","Schema/meta","Editorial calendar"] },
  { id:"ads", title: "Paid Growth", desc: "Google & Meta with CRO landing pages.", bullets:["GA4/Tags plan","Search/PMAX/Meta","A/B tests"] },
  { id:"brand", title: "Brand & Identity", desc: "Distinctive system + guide.", bullets:["Logo suite","Color & type","Brand book"] },
  { id:"ecom", title: "E‑Commerce", desc: "Shopify builds with CRO.", bullets:["UX of PDP/PLP","Checkout","Email capture"] },
  { id:"analytics", title: "Analytics", desc: "Event schema + dashboards.", bullets:["GA4+GTM","Events","Attribution"] },
];

export const work = [
  { id:"saas", title:"SaaS Lead Gen", tag:"SEO + CRO", summary:"3x demo bookings in 60 days.", cover:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop" },
  { id:"ecom", title:"D2C Scale", tag:"Ads + Analytics", summary:"+220% ROAS in 90 days.", cover:"https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop" },
  { id:"local", title:"Local Biz Boost", tag:"Web + GMB", summary:"Calls up 170% MoM.", cover:"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1400&auto=format&fit=crop" },
];

export const pricing = [
  { name:"Starter", price:999, items:["One‑page site","Basic SEO","2 revisions"] },
  { name:"Growth", price:2499, items:["5–7 pages","SEO setup","Lead capture","Analytics"], popular:true },
  { name:"Scale", price:4999, items:["Custom pages","CRO","Blog/CMS","Integrations"] },
];

export const faqs = [
  { q:"How long does a site take?", a:"Most sites launch in 2–4 weeks depending on scope and content readiness." },
  { q:"Do you offer ongoing support?", a:"Yes—monthly care plans for updates, SEO, and performance." },
  { q:"Which stack do you use?", a:"React + Vite, TailwindCSS, DaisyUI." },
];
