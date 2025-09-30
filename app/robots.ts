// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://digitalproductsartisan.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep bots out of internal/runtime paths
        disallow: ["/api/", "/_next/", "/__nextjs_original-stack-frame/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
