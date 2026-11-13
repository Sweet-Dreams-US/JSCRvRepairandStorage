import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal } from "@/components/marketing/atoms/reveal";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { formatReleaseDate, getReleasedPosts } from "@/lib/blog";
import { BUSINESS } from "@/lib/business";

// Which posts are visible depends on today's date, not on the last deploy.
// Re-read often so a post shows up on its release date without a new deploy.
export const revalidate = 900;

const DESCRIPTION = `RV service, storage and rental know-how from the team at ${BUSINESS.name} in ${BUSINESS.address.city}, Indiana.`;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getReleasedPosts();
  return {
    title: "Blog",
    description: DESCRIPTION,
    alternates: {
      canonical: "/blog",
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    ...(posts.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogIndexPage() {
  const posts = await getReleasedPosts();

  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed pb-12 pt-14 lg:pb-16 lg:pt-20">
          <Reveal>
            <Eyebrow number="Blog">Straight talk from the shop</Eyebrow>
          </Reveal>
          <h1 className="mt-7 font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.96] tracking-tight">
            <WordReveal text="Notes from" />
            <br />
            <WordReveal text="the shop." delay={0.15} accent={["shop"]} swash={["shop"]} italic={["shop"]} />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
              Plain answers about RV service, storage and rentals from the team at {BUSINESS.name}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────── POSTS ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain pb-20 lg:pb-28">
        <div className="container-tight">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-2xl border-2 border-dashed border-ink/40! bg-paper px-6 py-14 text-center">
              <p className="font-display text-2xl font-semibold leading-snug">The first post is on its way.</p>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
                Until then, call {BUSINESS.ownerShort} at {BUSINESS.phone} with any question about your RV.
              </p>
              <div className="mt-6 flex justify-center">
                <StampButton href="/contact" variant="garage" size="md">
                  Contact the shop <ArrowRight />
                </StampButton>
              </div>
            </div>
          ) : (
            <ul className="mx-auto grid max-w-4xl gap-6">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block border-2 border-ink/85! bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-garage! hover:shadow-[6px_6px_0_var(--ink)] sm:p-8"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
                      <time dateTime={p.release_on}>{formatReleaseDate(p.release_on)}</time>
                      <span className="h-1 w-1 rounded-full bg-garage" aria-hidden />
                      <span>{p.reading_minutes} min read</span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-tight transition-colors group-hover:text-garage sm:text-3xl">
                      {p.title}
                    </h2>
                    {p.description && (
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">{p.description}</p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-garage">
                      Read the post <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <OrnamentalRule variant="compass" className="mt-16 text-ink/30" />
        </div>
      </section>
    </>
  );
}
