import { Callout } from "@/components/blog/callout";
import type { BodySegment } from "@/lib/blog-markdown";

/** The post text, rendered in the site's own type and colours. */
export function PostBody({ segments }: { segments: BodySegment[] }) {
  return (
    <div className="blog-prose">
      {segments.map((s, i) =>
        s.type === "markdown" ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: s.html }} />
        ) : (
          <Callout key={i} kind={s.kind} title={s.title} html={s.html} links={s.links} />
        ),
      )}
    </div>
  );
}
