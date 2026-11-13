import { Marked, type Token, type Tokens } from "marked";

/**
 * Turns a post body (markdown with :::tip and :::note blocks) into ordered
 * segments the page can render, plus the table of contents built from the
 * `##` headings. Raw HTML in a post is escaped, never passed through.
 */

export type TocItem = { id: string; title: string };
export type CalloutKind = "tip" | "note";
export type CalloutLink = { text: string; href: string };

export type BodySegment =
  | { type: "markdown"; html: string }
  | { type: "callout"; kind: CalloutKind; title: string; html: string; links: CalloutLink[] };

export type RenderedPost = { segments: BodySegment[]; toc: TocItem[] };

type HeadingToken = Tokens.Heading & { _id?: string };

/* ------------------------------------------------------------------ helpers */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeBasic(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Only web, mail, phone, in-page and same-site links survive. */
function safeHref(href: string): string | null {
  const h = (href || "").trim();
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  if (h.startsWith("#")) return h;
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  return null;
}

function isExternal(href: string): boolean {
  return /^https?:/i.test(href);
}

function plainText(tokens: Token[] | undefined): string {
  if (!tokens) return "";
  return tokens
    .map((t) => {
      const withTokens = t as { tokens?: Token[] };
      if (withTokens.tokens && withTokens.tokens.length) return plainText(withTokens.tokens);
      const withText = t as { text?: unknown };
      return typeof withText.text === "string" ? unescapeBasic(withText.text) : "";
    })
    .join("");
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* --------------------------------------------------------------- the engine */

function createEngine() {
  const m = new Marked({ gfm: true, breaks: false });
  m.use({
    renderer: {
      html({ text }) {
        return escapeHtml(text);
      },
      image({ text }) {
        return escapeHtml(text || "");
      },
      heading(token) {
        const inner = this.parser.parseInline(token.tokens);
        const level = Math.min(Math.max(token.depth, 2), 4);
        const id = (token as HeadingToken)._id;
        return id
          ? `<h${level} id="${escapeHtml(id)}">${inner}</h${level}>\n`
          : `<h${level}>${inner}</h${level}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const safe = safeHref(href);
        if (!safe) return inner;
        const t = title ? ` title="${escapeHtml(title)}"` : "";
        const ext = isExternal(safe) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeHtml(safe)}"${t}${ext}>${inner}</a>`;
      },
    },
  });
  return m;
}

/* ------------------------------------------------------------ block splitting */

type RawChunk =
  | { type: "md"; text: string }
  | { type: "callout"; kind: CalloutKind; title: string; text: string };

/** Split the raw body into plain markdown chunks and :::tip / :::note blocks. */
function splitBlocks(body: string): RawChunk[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const chunks: RawChunk[] = [];
  let md: string[] = [];
  let open: { kind: CalloutKind; title: string; lines: string[] } | null = null;

  const flushMd = () => {
    const text = md.join("\n").trim();
    if (text) chunks.push({ type: "md", text });
    md = [];
  };

  for (const line of lines) {
    if (!open) {
      const m = line.match(/^:::(tip|note)\b[ \t]*(.*)$/i);
      if (m) {
        flushMd();
        open = { kind: m[1].toLowerCase() as CalloutKind, title: m[2].trim(), lines: [] };
        continue;
      }
      md.push(line);
    } else if (/^:::\s*$/.test(line)) {
      chunks.push({ type: "callout", kind: open.kind, title: open.title, text: open.lines.join("\n").trim() });
      open = null;
    } else {
      open.lines.push(line);
    }
  }
  if (open) chunks.push({ type: "callout", kind: open.kind, title: open.title, text: open.lines.join("\n").trim() });
  flushMd();
  return chunks;
}

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/**
 * Inside a tip, links become buttons under the text. A link that ends its
 * sentence or sits on its own line is lifted out of the text. A link in the
 * middle of a sentence keeps its words in the sentence (as plain text) and
 * still gets a button.
 */
function liftTipLinks(text: string): { text: string; links: CalloutLink[] } {
  const links: CalloutLink[] = [];
  const stripMd = (s: string) => s.replace(/[*_`]/g, "").trim();

  const out = text.replace(LINK_RE, (match: string, label: string, href: string, offset: number, whole: string) => {
    const safe = safeHref(href);
    if (!safe) return label;
    const text = stripMd(label);
    if (!links.some((l) => l.href === safe && l.text === text)) links.push({ text, href: safe });
    // Lift the link out only when it stands on its own: nothing before it on
    // its line, or a finished sentence before it, and nothing after it but
    // punctuation. Otherwise its words stay in the sentence as plain text.
    const lineStart = whole.lastIndexOf("\n", offset - 1) + 1;
    const before = whole.slice(lineStart, offset).trim();
    const restOfLine = whole.slice(offset + match.length).split("\n", 1)[0];
    const standsAlone = (before === "" || /[.!?:;]["')”’]*$/.test(before)) && /^[\s.!?:;,)]*$/.test(restOfLine);
    return standsAlone ? "" : label;
  });

  const cleaned = out
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text: cleaned, links };
}

/* ---------------------------------------------------------------- the entry */

export function renderPostBody(body: string): RenderedPost {
  const engine = createEngine();
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const segments: BodySegment[] = [];

  for (const chunk of splitBlocks(body)) {
    if (chunk.type === "md") {
      const tokens = engine.lexer(chunk.text);
      // Every top-level `##` gets an id, in reading order, unique across the post.
      for (const tok of tokens) {
        if (tok.type !== "heading" || tok.depth !== 2) continue;
        const heading = tok as HeadingToken;
        const title = plainText(heading.tokens).trim();
        let id = slugify(title) || `section-${toc.length + 1}`;
        if (used.has(id)) {
          let n = 2;
          while (used.has(`${id}-${n}`)) n++;
          id = `${id}-${n}`;
        }
        used.add(id);
        toc.push({ id, title });
        heading._id = id;
      }
      segments.push({ type: "markdown", html: engine.parser(tokens) });
      continue;
    }

    const lifted = chunk.kind === "tip" ? liftTipLinks(chunk.text) : { text: chunk.text, links: [] as CalloutLink[] };
    segments.push({
      type: "callout",
      kind: chunk.kind,
      title: chunk.title,
      html: lifted.text ? (engine.parse(lifted.text, { async: false }) as string) : "",
      links: lifted.links,
    });
  }

  return { segments, toc };
}
