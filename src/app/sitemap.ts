import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/content";
import { siteUrl } from "@/lib/fallback";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProductSlugs();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({ url: `${siteUrl}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
