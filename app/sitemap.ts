import type { MetadataRoute } from "next";

const BASE = "https://zbs.gg";

// Public, indexable routes. /dev is internal and is disallowed in robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/preview`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/eye`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/bench`, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
