import type { MetadataRoute } from "next";
import { listPublishedSlugs } from "@/server/repositories/content.repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://abhishekledtvrepair.in";

function siteUrl(path = ""): string {
  if (!path) return BASE_URL;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/tv-repair",
    "/blog",
    "/gallery",
    "/contact",
    "/book-service",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  try {
    const { pages, services, blogs } = await listPublishedSlugs();
    const entries: MetadataRoute.Sitemap = [
      ...staticPaths.map((path) => ({
        url: siteUrl(path || "/"),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.8,
      })),
      ...pages
        .filter((p) =>
          p.slug &&
          ![
            "home",
            "about",
            "services",
            "tv-repair",
            "blog",
            "gallery",
            "contact",
            "book-service",
            "privacy-policy",
            "terms-and-conditions",
          ].includes(p.slug.trim()),
        )
        .map((p) => ({
          url: siteUrl(`/${p.slug.trim()}`),
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
      ...services
        .filter((s) => Boolean(s.slug?.trim()))
        .map((s) => ({
          url: siteUrl(`/tv-repair/${s.slug.trim()}`),
          lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      ...blogs
        .filter((b) => Boolean(b.slug?.trim()))
        .map((b) => ({
          url: siteUrl(`/blog/${b.slug.trim()}`),
          lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
    ];
    return entries;
  } catch (error) {
    console.error("[sitemap] failed to load dynamic slugs:", error);
    return staticPaths.map((path) => ({ url: siteUrl(path || "/") }));
  }
}
