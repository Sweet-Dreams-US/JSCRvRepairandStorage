import { getReleasedPosts, SITE_URL } from "@/lib/blog";
import { BUSINESS } from "@/lib/business";

// Released posts only, re-read at least every hour.
export const revalidate = 3600;

function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getReleasedPosts();
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(`${p.release_on}T12:00:00Z`).toUTCString();
      return [
        "    <item>",
        `      <title>${xml(p.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${xml(p.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuild = posts[0] ? new Date(`${posts[0].release_on}T12:00:00Z`).toUTCString() : new Date().toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${BUSINESS.name} Blog`)}</title>
    <link>${xml(`${SITE_URL}/blog`)}</link>
    <atom:link href="${xml(`${SITE_URL}/blog/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>${xml(`RV service, storage and rental know-how from ${BUSINESS.name} in ${BUSINESS.address.city}, Indiana.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
