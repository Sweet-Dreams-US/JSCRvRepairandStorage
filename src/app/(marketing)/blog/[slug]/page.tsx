import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostBody } from "@/components/blog/post-body";
import { PostToc } from "@/components/blog/post-toc";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { formatReleaseDate, getReleasedPost, SITE_URL } from "@/lib/blog";
import { renderPostBody } from "@/lib/blog-markdown";
import { BUSINESS } from "@/lib/business";

// A post is visible on and after its release date. Re-read often so a post
// appears on its date without a new deploy. Slugs are resolved on request, so
// a post added after the last build still renders.
export const revalidate = 900;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReleasedPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.description || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      url: `/blog/${post.slug}`,
      siteName: BUSINESS.name,
      locale: "en_US",
      publishedTime: post.release_on,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getReleasedPost(slug);
  if (!post) notFound();

  const { segments, toc } = renderPostBody(post.body);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const sources = post.sources.filter((s) => /^https?:\/\//i.test(s.url));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.release_on,
    dateModified: post.release_on,
    inLanguage: "en-US",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: BUSINESS.name, url: SITE_URL },
    publisher: { "@type": "Organization", name: BUSINESS.name, url: SITE_URL },
    ...(sources.length
      ? {
          citation: sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
            ...(s.author ? { author: { "@type": "Organization", name: s.author } } : {}),
          })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ──────────── HEADER ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-tight pb-10 pt-12 lg:pb-12 lg:pt-16">
          <div className="mx-auto max-w-[42rem]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70 transition-colors hover:text-garage"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All posts
            </Link>
            <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.06] tracking-tight text-letterpress">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
              <time dateTime={post.release_on}>{formatReleaseDate(post.release_on)}</time>
              <span className="h-1 w-1 rounded-full bg-garage" aria-hidden />
              <span>{post.reading_minutes} min read</span>
            </div>
            {post.description && (
              <p className="mt-6 text-lg leading-relaxed text-ink/75">{post.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* ──────────── ARTICLE ──────────── */}
      <div className="relative overflow-hidden bg-cream bg-grain">
      <article id="blog-article" className="container-tight pb-20 pt-8 lg:pb-28">
        <div className="mx-auto max-w-[42rem] border-t-2 border-ink/85! pt-10">
          <PostBody segments={segments} />

          {sources.length > 0 && (
            <section aria-labelledby="blog-sources" className="mt-14 border-t border-dashed border-ink/30! pt-8">
              <h2
                id="blog-sources"
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70"
              >
                Sources
              </h2>
              <ol className="mt-4 grid gap-3 text-[15px] leading-snug">
                {sources.map((s, i) => (
                  <li key={`${s.url}-${i}`} className="flex gap-3">
                    <span className="pt-0.5 font-mono text-[11px] text-garage">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 break-words">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline decoration-ink/30 underline-offset-2 transition-colors hover:text-garage hover:decoration-garage"
                      >
                        {s.title}
                      </a>
                      {s.author && <span className="text-ink/60">, {s.author}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <aside className="mt-12 border-2 border-ink/85! bg-paper p-6 shadow-[6px_6px_0_var(--ink)] sm:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">Questions about your RV?</div>
            <p className="mt-2 font-display text-xl leading-snug">
              Call {BUSINESS.ownerShort} at {BUSINESS.phone}, or send a request through the contact page.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <StampButton href="/contact" variant="garage" size="md" className="w-full sm:w-auto">
                Contact the shop
              </StampButton>
              <StampButton href={`tel:${BUSINESS.phoneRaw}`} variant="outline" size="md" className="w-full sm:w-auto">
                Call {BUSINESS.phone}
              </StampButton>
            </div>
          </aside>
        </div>
      </article>
      </div>

      <PostToc items={toc} articleId="blog-article" />
    </>
  );
}
