"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The Blog link shows only while at least one post is released. The answer
 * comes from /api/blog/status at request time, so the link appears and
 * disappears without a deploy. One request is shared by every consumer.
 */
let pending: Promise<boolean> | null = null;

function fetchBlogLive(): Promise<boolean> {
  if (!pending) {
    pending = fetch("/api/blog/status")
      .then((r) => (r.ok ? r.json() : { hasBlog: false }))
      .then((j) => Boolean(j?.hasBlog))
      .catch(() => false);
    // Ask again on a later page view instead of holding the answer forever.
    setTimeout(() => {
      pending = null;
    }, 5 * 60 * 1000);
  }
  return pending;
}

export function useBlogLive(): boolean {
  const [live, setLive] = useState(false);
  useEffect(() => {
    let active = true;
    fetchBlogLive().then((v) => {
      if (active) setLive(v);
    });
    return () => {
      active = false;
    };
  }, []);
  return live;
}

/** Footer list item, styled like the other footer links. */
export function BlogFooterLink() {
  const live = useBlogLive();
  if (!live) return null;
  return (
    <li>
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 text-cream/85 transition-colors hover:text-garage"
      >
        <span className="font-mono text-[10px] text-cream/30 transition-colors group-hover:text-garage">
          ▸
        </span>
        Blog
      </Link>
    </li>
  );
}
