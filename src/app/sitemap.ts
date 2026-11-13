import type { MetadataRoute } from "next";
import { getReleasedPosts, SITE_URL } from "@/lib/blog";

// Re-read at least every hour so a post enters the sitemap on its release date.
export const revalidate = 3600;

const PAGES = ["/", "/services", "/storage", "/rentals", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getReleasedPosts();

  const entries: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: p === "/" ? SITE_URL : `${SITE_URL}${p}`,
  }));

  if (posts.length > 0) {
    entries.push({ url: `${SITE_URL}/blog`, lastModified: posts[0].release_on });
    for (const p of posts) {
      entries.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.release_on });
    }
  }
  return entries;
}
