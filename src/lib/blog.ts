import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Blog posts are markdown files on disk (content/blog/YYYY-MM-DD-slug.md).
 * The publishing routine puts them there; this module only reads them and
 * decides what is visible.
 *
 * A post is visible on and after its `release_on` date in Fort Wayne time.
 * Nothing is baked in at build time: the blog pages revalidate on a timer
 * (see their `revalidate` exports), so a post releases on its date without a
 * new deploy. A post with no release_on, or a future one, is never shown.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const TIME_ZONE = "America/Indiana/Indianapolis";

/** Same base the rest of the site uses for absolute URLs. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://jscrvrepair.com").replace(/\/+$/, "");

export interface BlogSource {
  title: string;
  author?: string;
  url: string;
}

export interface BlogPost {
  post_id: string;
  seq: number;
  title: string;
  slug: string;
  /** YYYY-MM-DD, compared as a plain string against today's Fort Wayne date. */
  release_on: string;
  description: string;
  reading_minutes: number;
  sources: BlogSource[];
  /** Raw markdown body, after the front matter block. */
  body: string;
}

/** Today's date in Fort Wayne time, as YYYY-MM-DD. */
export function todayInFortWayne(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isReleased(post: Pick<BlogPost, "release_on">, today = todayInFortWayne()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(post.release_on) && post.release_on <= today;
}

export function formatReleaseDate(releaseOn: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${releaseOn}T00:00:00Z`));
}

/* ------------------------------------------------------------ Front matter */

function unquote(value: string): string {
  const t = value.trim();
  if (t.length >= 2 && t[0] === '"' && t.endsWith('"')) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (t.length >= 2 && t[0] === "'" && t.endsWith("'")) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  return t;
}

/**
 * A small parser for the fixed front matter shape in the blog file contract:
 * scalars, plus one list of maps for `sources`.
 */
function parseFrontmatter(raw: string): Record<string, string | Record<string, string>[]> {
  const lines = raw.split(/\r?\n/);
  const result: Record<string, string | Record<string, string>[]> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const [, key, rest] = m;
    if (rest.trim() !== "") {
      result[key] = unquote(rest);
      i++;
      continue;
    }
    // Empty value: look for an indented list of maps underneath (sources).
    const items: Record<string, string>[] = [];
    let j = i + 1;
    while (j < lines.length && /^\s*-\s/.test(lines[j])) {
      const item: Record<string, string> = {};
      const first = lines[j].match(/^\s*-\s*([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (first) item[first[1]] = unquote(first[2]);
      j++;
      while (j < lines.length && /^\s{2,}[A-Za-z_]/.test(lines[j]) && !/^\s*-\s/.test(lines[j])) {
        const kv = lines[j].match(/^\s*([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
        if (kv) item[kv[1]] = unquote(kv[2]);
        j++;
      }
      items.push(item);
    }
    result[key] = items;
    i = items.length ? j : i + 1;
  }
  return result;
}

function parsePost(filename: string, raw: string): BlogPost | null {
  const text = raw.replace(/^﻿/, "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    console.error(`[blog:parse-failed] ${filename}: no front matter block`);
    return null;
  }
  const [, fmRaw, body] = match;
  const fm = parseFrontmatter(fmRaw);

  const str = (k: string) => (typeof fm[k] === "string" ? (fm[k] as string) : "");
  const post_id = str("post_id");
  const title = str("title");
  const slug = str("slug");
  const release_on = str("release_on");
  if (!post_id || !title || !slug) {
    console.error(`[blog:parse-failed] ${filename}: missing a required field`);
    return null;
  }

  const rawSources = fm.sources;
  const sources: BlogSource[] = Array.isArray(rawSources)
    ? rawSources
        .filter((s) => s.title && s.url)
        .map((s) => ({ title: s.title, author: s.author || undefined, url: s.url }))
    : [];

  return {
    post_id,
    seq: Number(str("seq")) || 0,
    title,
    slug,
    release_on,
    description: str("description"),
    reading_minutes: Number(str("reading_minutes")) || 1,
    sources,
    body: body.trim(),
  };
}

async function readAllPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const parsed = await Promise.all(
    files.map(async (file) => {
      try {
        return parsePost(file, await readFile(path.join(BLOG_DIR, file), "utf8"));
      } catch {
        return null;
      }
    }),
  );
  // One post per post_id: a dated copy wins over an undated one.
  const byId = new Map<string, BlogPost>();
  for (const p of parsed) {
    if (!p) continue;
    const existing = byId.get(p.post_id);
    if (!existing || (!existing.release_on && p.release_on)) byId.set(p.post_id, p);
  }
  return [...byId.values()];
}

/** Strictly released posts, newest first (then highest seq for the same day). */
export async function getReleasedPosts(): Promise<BlogPost[]> {
  const today = todayInFortWayne();
  const posts = (await readAllPosts()).filter((p) => isReleased(p, today));
  return posts.sort((a, b) => {
    if (a.release_on !== b.release_on) return a.release_on < b.release_on ? 1 : -1;
    return b.seq - a.seq;
  });
}

/** One post the pages may show, or null (404) before release or if it does not exist. */
export async function getReleasedPost(slug: string): Promise<BlogPost | null> {
  const posts = await getReleasedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function hasReleasedPosts(): Promise<boolean> {
  return (await getReleasedPosts()).length > 0;
}
