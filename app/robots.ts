import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dev",
    },
    sitemap: "https://zbs.gg/sitemap.xml",
    host: "https://zbs.gg",
  };
}
