import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/composer/recapitulatif", "/composer/confirmation", "/kab/composer/recapitulatif", "/kab/composer/confirmation"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
