// Long-form copy for the /services/<slug> pages (SEO pages; not shown on the home page).
// Keep every claim verifiable: no invented results, ratings, counts or guarantees.
// `slug` is the public URL; the old short ids (/services/web etc.) 301-redirect to it (next.config.js).

export const serviceDetails = {
  web: {
    slug: "web-design",
    seoTitle: "Web Design & Development in Toronto",
    metaDescription:
      "Custom, mobile-first business websites for Toronto and GTA businesses. Clear structure, fast pages and SEO-ready foundations, with packages starting from $399 CAD.",
    h1: "Web design & development for Toronto businesses",
    intro:
      "Your website is often the first place a customer decides whether to call you. We design and build custom business websites for companies across Toronto and the GTA: clear about what you do, fast on a phone, and easy for customers to contact you from.",
    forWho: [
      "Local service businesses (contractors, clinics, cleaners, studios) that need more calls and quote requests",
      "Businesses with an outdated, slow or template website that no longer reflects the quality of their work",
      "New businesses that need a professional site quickly, without paying agency enterprise prices",
    ],
    included: [
      "A custom design built around your brand, not a recycled template",
      "Mobile-first layouts tested on phones, tablets and desktops",
      "Service, about, work and contact sections written to answer customer questions",
      "Contact form, click-to-call and WhatsApp buttons so leads reach you directly",
      "On-page SEO setup: titles, descriptions, headings, structured data and a sitemap",
      "Performance-focused build: compressed images, lean code and fast loading",
      "Launch, domain connection and a walkthrough of how to update your content",
    ],
    process: [
      ["Discover", "A short call to learn your business, your customers and what the site needs to achieve."],
      ["Design", "We design the key pages and refine them with you before any code is written."],
      ["Build", "We develop the site, connect forms and analytics, and test it on real devices."],
      ["Launch & grow", "We publish the site, submit it to Google and stay available for updates."],
    ],
    faqs: [
      ["How much does a business website cost?", "Our Essential one-page website starts from $399 CAD and the Professional package (up to five pages) starts from $699 CAD. Online stores and custom features are quoted after a short call."],
      ["Can you redesign my current website?", "Yes. We review what works on your current site, keep your content where it helps, and rebuild the design and structure so it is faster and clearer."],
      ["Will I be able to edit the website myself?", "Yes. Depending on the project we set up an easy way to update text and images, and we show you how before launch."],
      ["Do you only work with Toronto businesses?", "We are based in the Greater Toronto Area and mostly work with local businesses, but we also take on projects elsewhere in Canada."],
    ],
  },
  ecom: {
    slug: "ecommerce-development",
    seoTitle: "Shopify & WooCommerce Development in Toronto",
    metaDescription:
      "Shopify and WooCommerce stores for Toronto and GTA businesses: product pages, checkout, payments and a smooth mobile shopping experience.",
    h1: "E-commerce websites with Shopify & WooCommerce",
    intro:
      "We build online stores that make it easy to browse, trust and buy, especially on a phone. Whether you are starting to sell online or moving from a store that is hard to manage, we set up Shopify or WooCommerce around the way your business works.",
    forWho: [
      "Retail and product brands in the GTA starting to sell online",
      "Stores on an old platform that is slow, hard to update or hard to shop on mobile",
      "Makers and studios selling custom or made-to-order products",
    ],
    included: [
      "Platform advice: Shopify or WooCommerce, based on your products and budget",
      "Custom storefront design that matches your brand",
      "Product and collection pages with clear photos, details and calls to action",
      "Cart, checkout and payment setup, including taxes and shipping rules",
      "Email capture and basic order notifications",
      "On-page SEO for product and collection pages",
      "Training so you can add products and manage orders yourself",
    ],
    process: [
      ["Plan", "We map your catalogue, shipping, payments and the pages the store needs."],
      ["Design", "We design the home, collection and product pages for mobile first."],
      ["Build", "We set up the store, import products and test the full checkout."],
      ["Launch", "We go live, connect your domain and help with the first orders."],
    ],
    faqs: [
      ["Shopify or WooCommerce: which is better?", "Shopify is simpler to run and includes hosting; WooCommerce gives more control and suits stores already on WordPress. We recommend one after looking at your products and plans."],
      ["How much does an online store cost?", "Stores are quoted individually because they depend on the number of products, features and integrations. Tell us about your store and we will send a clear quote."],
      ["Can you move my existing store?", "Yes. We can migrate products, collections and content to a new design or platform."],
      ["Will I be able to manage the store myself?", "Yes. We show you how to add products, update prices and handle orders before launch."],
    ],
  },
  seo: {
    slug: "seo-services",
    seoTitle: "SEO Services & Website Speed Optimization in Toronto",
    metaDescription:
      "Technical SEO, local SEO and website speed work for Toronto and GTA businesses, so customers searching for your services can find you.",
    h1: "SEO & performance optimization for GTA businesses",
    intro:
      "Most customers search before they call. We fix the technical foundations that help Google understand your website, make pages load faster, and build the local signals that help you show up when people nearby search for what you do.",
    forWho: [
      "Businesses with a website that gets few visits or enquiries from Google",
      "Sites that load slowly on phones or show errors in Google Search Console",
      "Local businesses that want to appear in Google Maps and local results",
    ],
    included: [
      "Technical SEO audit: indexing, sitemap, robots, broken links and duplicate pages",
      "Page titles, meta descriptions and heading structure for your key services",
      "Structured data (schema) so search engines understand your business",
      "Speed improvements: image compression, lighter code and better loading",
      "Google Search Console and Google Business Profile setup or clean-up",
      "Keyword and content plan for the services and areas you want to rank for",
    ],
    process: [
      ["Audit", "We check how your site is crawled, indexed and loaded today."],
      ["Fix", "We correct the technical issues and update titles, content and schema."],
      ["Local", "We set up or improve your Google Business Profile and local listings."],
      ["Measure", "We track search visibility and enquiries and plan the next improvements."],
    ],
    faqs: [
      ["How long does SEO take to work?", "Technical fixes can help within weeks, but ranking for competitive searches usually takes months of steady work. We are clear about what to expect for your situation."],
      ["Is SEO included with a new website?", "Every Milink website includes SEO-friendly foundations. Ongoing SEO, content and local SEO work is a separate service."],
      ["Do you guarantee first place on Google?", "No one can honestly guarantee rankings. We focus on the work that improves your visibility and measure the results."],
      ["Can you help with Google Maps?", "Yes. We set up and optimize your Google Business Profile, which drives most local map results."],
    ],
  },
  maint: {
    slug: "website-maintenance",
    seoTitle: "Website Maintenance & Support in Toronto",
    metaDescription:
      "Website updates, backups, security monitoring and quick fixes for Toronto and GTA businesses, so your site stays fast, safe and up to date.",
    h1: "Website maintenance & support",
    intro:
      "A website needs care after launch. We handle the updates, backups, security checks and small content changes, so your site keeps working and you can focus on running your business.",
    forWho: [
      "Businesses without an in-house developer",
      "WordPress and WooCommerce sites that need regular plugin and security updates",
      "Owners who want a reliable person to call when something on the site needs changing",
    ],
    included: [
      "Software, theme and plugin updates",
      "Regular backups and restore if something goes wrong",
      "Security and uptime monitoring",
      "Content updates: text, images, prices, team and service changes",
      "Speed checks and small fixes",
      "Help with domains, email records and hosting questions",
    ],
    process: [
      ["Review", "We check your current site, hosting and access."],
      ["Secure", "We set up backups and monitoring and apply pending updates."],
      ["Maintain", "We keep the site updated and handle your change requests."],
      ["Report", "You get a short summary of what was done."],
    ],
    faqs: [
      ["Do you maintain websites you didn't build?", "Yes, after a quick review of the site, hosting and access."],
      ["What if my site goes down?", "We investigate, restore from backup if needed, and keep you informed."],
      ["Can I just send you small changes when I need them?", "Yes. Send us the change and we will take care of it."],
      ["Is maintenance required after launch?", "No, but it is recommended for sites that need regular updates or run plugins."],
    ],
  },
  brand: {
    slug: "branding",
    seoTitle: "Branding & Logo Design in Toronto",
    metaDescription:
      "Logo design, colour palettes, typography and a mini brand book for Toronto and GTA businesses that want a consistent, professional brand.",
    h1: "Branding & visual identity",
    intro:
      "A clear brand makes a small business look established. We design the visual building blocks (logo, colours, typography and simple rules) so your website, social media and printed materials all look like the same company.",
    forWho: [
      "New businesses that need a logo and a look before launching their website",
      "Businesses whose logo or colours feel dated or inconsistent",
      "Owners preparing signage, social media or print materials",
    ],
    included: [
      "Logo design with variations for light and dark backgrounds",
      "Colour palette and typography choices",
      "A mini brand book showing how to use them",
      "Social media profile and cover graphics",
      "Files ready for web, print and social media",
    ],
    process: [
      ["Discover", "We learn about your business, audience and the feel you want."],
      ["Explore", "We present logo and style directions."],
      ["Refine", "We develop the chosen direction with your feedback."],
      ["Deliver", "You receive the final files and the mini brand book."],
    ],
    faqs: [
      ["Can you design a logo and a website together?", "Yes. Doing both together keeps the brand and the website consistent from day one."],
      ["What files will I receive?", "Logo files for web and print (including transparent versions), colour codes, fonts and the brand book."],
      ["Can you refresh my existing logo?", "Yes. We can modernize an existing logo while keeping what customers recognize."],
      ["Do I own the final design?", "Yes. Once the project is paid, the final brand files are yours."],
    ],
  },
  ux: {
    slug: "ui-ux-design",
    seoTitle: "UI/UX Design in Toronto",
    metaDescription:
      "User flows, wireframes and interface design for websites and web apps, built to make important actions clear and easy for your customers.",
    h1: "UI/UX design for websites & web apps",
    intro:
      "Good design is not only how a page looks; it is how easily people find what they need and take the next step. We plan user flows, wireframes and interfaces for websites, portals and web apps.",
    forWho: [
      "Businesses planning a new website or web app",
      "Teams whose site or app gets visits but few sign-ups, bookings or enquiries",
      "Founders who need clear screens before development starts",
    ],
    included: [
      "User flows for the key tasks on your site or app",
      "Wireframes to agree on structure before visual design",
      "High-fidelity interface design",
      "Reusable components and a small design system",
      "Usability review of an existing site or app",
      "Handoff files ready for development",
    ],
    process: [
      ["Understand", "We map who uses the product and what they need to do."],
      ["Structure", "We sketch flows and wireframes and review them with you."],
      ["Design", "We create the final interface and reusable components."],
      ["Hand off", "We prepare everything for development, or build it ourselves."],
    ],
    faqs: [
      ["Can you also build what you design?", "Yes. We design and develop, so the final product matches the design."],
      ["Do you work in Figma?", "Yes. Designs and prototypes are delivered in Figma."],
      ["Can you improve an existing app or site?", "Yes. We start with a usability review and fix the biggest problems first."],
      ["How long does UI/UX design take?", "It depends on the number of screens and flows. We give a timeline after a short call."],
    ],
  },
};

/** Map of old short ids to new slugs (used for redirects and the sitemap). */
export const SERVICE_SLUGS = Object.fromEntries(
  Object.entries(serviceDetails).map(([id, d]) => [id, d.slug]),
);

export function findServiceBySlug(slug) {
  const entry = Object.entries(serviceDetails).find(([, d]) => d.slug === slug);
  return entry ? { id: entry[0], ...entry[1] } : null;
}
