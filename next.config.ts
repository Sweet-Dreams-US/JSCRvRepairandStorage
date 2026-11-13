import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Blog posts are read from disk when a page revalidates, which is how a post
  // releases on its date without a deploy. Ship the files with every function
  // that reads them.
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
    "/blog/rss.xml": ["./content/blog/**/*"],
    "/sitemap.xml": ["./content/blog/**/*"],
    "/api/blog/status": ["./content/blog/**/*"],
  },
};

export default nextConfig;
