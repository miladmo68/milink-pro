// Answer-first guide pages (/guides/<slug>), owner-authorized 2026-11-05.
// Facts about Milink come from content.js (prices) only; no invented market
// numbers, timelines or results. Third-party facts are stated generally, without
// prices that change (e.g. Wix plans), so the pages stay true.

import { pricing } from "./content.js";

const pkg = (name) => pricing.find((p) => p.name === name);
const essential = pkg("Essential");
const professional = pkg("Professional");
const priceOf = (p) => `${p.startingPrice} ${p.priceCurrency}`;

export const GUIDES_UPDATED = "2026-11-05";

export const guides = [
  {
    slug: "website-cost-toronto",
    nav: "How much a website costs",
    title: "How much does a website cost in Toronto?",
    metaTitle: "How Much Does a Website Cost in Toronto? (2026 Guide)",
    description: `What a small-business website costs in Toronto and the GTA, what changes the price, and Milink's packages from ${priceOf(essential)}.`,
    eyebrow: "Guide · Pricing",
    answer: `It depends mostly on how many pages you need, whether you sell online, and how much custom work is involved. At Milink, a one-page business website starts from ${priceOf(essential)}, a website with up to five pages starts from ${priceOf(professional)}, and online stores or custom builds are quoted after a short call.`,
    sections: [
      {
        title: "What changes the price of a website",
        type: "cards",
        items: [
          "Number of pages: a one-page site costs less than a site with separate service, work and contact pages.",
          "Selling online: an online store needs product pages, a cart, checkout and payment setup.",
          "Custom features: booking, member areas, integrations or multiple languages add work.",
          "Content: if your text, logo and photos are ready, the project is simpler than one where they still need to be created.",
          "Design depth: a custom design built around your brand takes more time than a lightly adjusted layout.",
        ],
      },
      {
        title: "Milink packages (CAD)",
        type: "check",
        items: [
          `Essential: from ${priceOf(essential)}. ${essential.tagline}`,
          `Professional: from ${priceOf(professional)}. ${professional.tagline}`,
          "E-commerce & Custom: custom quote, based on your products, features and goals.",
        ],
        link: { href: "/pricing", label: "Compare the packages" },
      },
      {
        title: "Costs to plan for besides the build",
        type: "check",
        items: [
          "A domain name (your .ca or .com address), renewed every year.",
          "Hosting, if your site needs it, and any paid apps or plugins.",
          "Ongoing updates and fixes, if you want someone to look after the site for you.",
          "Payment processing fees for online stores, charged by the payment provider.",
        ],
      },
    ],
    faqs: [
      ["Is a cheap website worth it?", "A low price is fine if the site is clear, fast on a phone and easy to contact you from. What usually costs more later is a site that looks unprofessional or that customers can't use, because it loses enquiries. Ask to see live sites the designer has built."],
      ["Do you charge monthly?", "Our packages are a one-time build price. Domain, hosting and optional ongoing maintenance are separate and depend on what your site needs."],
      ["How do I get an exact price?", "Tell us about your business and what you need on the contact page, and we'll recommend a package and give you a clear quote before any work starts."],
    ],
  },
  {
    slug: "how-long-to-build-a-website",
    nav: "How long a website takes",
    title: "How long does it take to build a website?",
    metaTitle: "How Long Does It Take to Build a Website?",
    description: "What decides how long a small-business website takes to build, the steps involved, and how to launch sooner.",
    eyebrow: "Guide · Timeline",
    answer: "It depends on the size of the site and how quickly the content and feedback come in. A one-page website is much faster than a multi-page site, and an online store or custom build takes the longest. At Milink we give you a clear timeline before we start, so you know your launch date up front.",
    sections: [
      {
        title: "The steps of a website project",
        type: "steps",
        items: [
          ["Brief", "We learn about your business, your customers and what the site needs to do."],
          ["Content", "You send your text, logo and photos (or we agree who creates them)."],
          ["Design", "We design the pages around your brand and show you before building."],
          ["Build", "We build the site, mobile-first, with on-page SEO set up."],
          ["Review", "You check everything and we make the agreed refinements."],
          ["Launch", "We connect your domain, test forms and pages, and go live."],
        ],
      },
      {
        title: "What slows a project down",
        type: "cards",
        items: [
          "Content that isn't ready: text and photos are the most common reason projects wait.",
          "Slow feedback: each review round waits for your answer.",
          "Changing the scope halfway: new pages or features mean new design and build work.",
          "Third-party accounts: domain, payment or booking accounts that need the owner's login.",
        ],
      },
      {
        title: "How to launch sooner",
        type: "check",
        items: [
          "Prepare your logo, your main services and a few good photos before the project starts.",
          "Pick one person who gives feedback and approves.",
          "Start with the pages you need now; you can add more after launch.",
          "Have your domain login ready for launch day.",
        ],
      },
    ],
    faqs: [
      ["Can you build a website in a week?", "A small one-page site can be quick when the content is ready and feedback is fast. We'll tell you honestly what's realistic for your project before we start."],
      ["What do I need to prepare?", "Your logo, a short description of your services, your contact details, and any photos of your work. If something is missing, we'll tell you what's needed."],
      ["Can I update the website myself after launch?", "That depends on how the site is built. Tell us if you want to edit content yourself and we'll plan for it."],
    ],
  },
  {
    slug: "wix-vs-custom-website",
    nav: "Wix vs a custom website",
    title: "Wix or a custom website: which is right for your business?",
    metaTitle: "Wix vs Custom Website for Small Businesses in Toronto",
    description: "An honest comparison of website builders like Wix and Squarespace with a professionally built custom website, for small businesses in Toronto and the GTA.",
    eyebrow: "Guide · Comparison",
    answer: "A website builder like Wix or Squarespace is a good fit if you want to make the site yourself, have time to learn the tool, and need a simple site. A custom website built by a designer is a better fit if you want a site that looks unique to your brand, is set up for Google and enquiries from day one, and you'd rather spend your time running your business.",
    sections: [
      {
        title: "When a website builder makes sense",
        type: "check",
        items: [
          "You're just starting and want to put something online yourself.",
          "You enjoy design and have time to learn the builder and update it.",
          "You need a few simple pages and a standard layout is fine.",
          "You're comfortable with a monthly subscription to the platform.",
        ],
      },
      {
        title: "When a custom website makes sense",
        type: "check",
        items: [
          "You want your site to look different from competitors using the same templates.",
          "You'd rather have a professional handle structure, copy layout and on-page SEO.",
          "You need specific features, integrations or a store set up properly.",
          "You want the work done for you so you can focus on your customers.",
        ],
      },
      {
        title: "Questions to ask before you choose",
        type: "cards",
        items: [
          "Who will build it, and who will update it after launch?",
          "What will it cost per month or per year, including the platform, domain and apps?",
          "Can customers call, message or request a quote in one tap on a phone?",
          "Is it set up so Google understands your services and area?",
          "If you change your mind later, can you move your content elsewhere?",
        ],
      },
    ],
    faqs: [
      ["Is Wix bad for SEO?", "No platform guarantees good or bad rankings on its own. What matters most is clear content about your services and area, a fast mobile experience, correct page titles and descriptions, and your Google Business Profile. Those can be done well or badly on any platform."],
      ["Can you redesign my Wix site?", "Yes. We can rebuild it as a custom site or advise you on what to fix first. Contact us with your current website address."],
      ["Which platforms does Milink use?", "We choose based on the project. For online stores we work with Shopify and WordPress/WooCommerce; for business websites we recommend the approach that fits your content, speed and budget."],
    ],
  },
];

export const findGuide = (slug) => guides.find((g) => g.slug === slug);
