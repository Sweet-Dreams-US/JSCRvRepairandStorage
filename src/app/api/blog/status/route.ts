import { NextResponse } from "next/server";
import { hasReleasedPosts } from "@/lib/blog";

/**
 * Whether the nav should show the Blog link: true once at least one post has
 * released. Read at request time (a handful of small files on disk), so the
 * link appears and disappears without a deploy.
 *
 * The header and footer ask for this from the browser instead of reading it in
 * the layout, so the rest of the site's static pages stay static.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { hasBlog: await hasReleasedPosts() },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600" } },
  );
}
