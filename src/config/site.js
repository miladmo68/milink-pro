import { serviceDetails } from "../data/serviceDetails.js";

// Date the content of each route last changed. Update it when you edit that page
// (a sitemap date that changes on every request teaches Google to ignore it).
const CONTENT_UPDATED = "2026-11-03";

export const BASE_URL = "https://milink.ca";

/** Indexable static routes (path without trailing slash, except home = ""). */
export const STATIC_ROUTES = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/web-design-toronto", changeFrequency: "monthly", priority: 0.9 },
];

export function getSitemapEntries() {
  const lastModified = new Date(CONTENT_UPDATED);

  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const serviceEntries = Object.values(serviceDetails).map((detail) => ({
    url: `${BASE_URL}/services/${detail.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...serviceEntries];
}
