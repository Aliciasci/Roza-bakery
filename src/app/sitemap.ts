import type { MetadataRoute } from "next";
import { localeNames, localizePath, locales } from "@/i18n/config";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/composer", priority: 0.9, changeFrequency: "monthly" },
    { path: "/helwa", priority: 0.8, changeFrequency: "weekly" },
    { path: "/creations", priority: 0.8, changeFrequency: "weekly" },
    { path: "/comment-ca-marche", priority: 0.6, changeFrequency: "monthly" },
    { path: "/a-propos", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  ];
  const url = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;
  return routes.flatMap((r) =>
    locales.map((locale) => ({
      url: url(localizePath(r.path, locale)),
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: locale === "fr" ? r.priority : r.priority * 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [localeNames[l].htmlLang, url(localizePath(r.path, l))])),
      },
    })),
  );
}
