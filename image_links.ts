// Post images become links to their own full-resolution file.
//
//   ![A chart](/assets/posts/erasure-1/erasure-1.png)
//   → <p><a class="shot" href="…" target="_blank" rel="noopener"><img …></a></p>
//
// A screenshot of a dashboard is unreadable at the prose measure, and the whole
// reason one is in the post is that the reader can read the axis labels. So the
// gesture worth offering is "show me the whole thing": one click, the original
// file, and the browser's own image view handles the zoom, rotate and save. No
// lightbox, no script, no layout to keep in sync with a scaled-down thumbnail.
//
// The link is written into the HTML at build time rather than assembled by
// main.js, for the reason the rest of this theme is progressive-enhancement
// first: a link that only exists once a script has run is not there at all for
// anyone without JS, on a slow connection, or for a crawler.
//
// An image that is already a link — [![alt](src)](href) — is left alone. Nested
// <a> is invalid HTML and browsers quietly "fix" it by dropping one of them.

import "lume/types.ts";

/** The slice of markdown-it's renderer this plugin replaces. Typed here, as
 *  callouts.ts types the container API, rather than imported: markdown-it is
 *  already on the site by way of markdown-it-container, but its own types are
 *  not, and three structural types are cheaper than a dependency. */
type Render = (
  tokens: Token[],
  index: number,
  options: unknown,
  env: unknown,
  self: unknown,
) => string;

interface Token {
  type: string;
  attrGet(name: string): string | null;
}

interface MarkdownIt {
  renderer: { rules: Record<string, Render | undefined> };
  utils: { escapeHtml(text: string): string };
}

/** Whether the token at `index` is inside an already-open link.
 *
 *  markdown-it hands the renderer one flat token stream, so the only record of
 *  the enclosing structure is the nesting of link_open / link_close either side
 *  of the token. Counted forwards from the start of the document; a page with a
 *  handful of images is nowhere near the size where that matters. */
function insideLink(tokens: Token[], index: number): boolean {
  let depth = 0;

  for (let i = 0; i < index; i++) {
    if (tokens[i].type === "link_open") depth++;
    else if (tokens[i].type === "link_close") depth--;
  }

  return depth > 0;
}

export default function imageLinks() {
  return function plugin(md: MarkdownIt) {
    const renderImage = md.renderer.rules.image;

    // markdown-it always defines one. If a future version stops doing so there
    // is no fallback worth writing: an image nobody can enlarge is still a
    // perfectly good image.
    if (!renderImage) return;

    md.renderer.rules.image = (tokens, index, options, env, self) => {
      const html = renderImage(tokens, index, options, env, self);
      const src = tokens[index].attrGet("src");

      if (!src || insideLink(tokens, index)) return html;

      return (
        `<a class="shot" href="${md.utils.escapeHtml(src)}"` +
        ` target="_blank" rel="noopener">${html}</a>`
      );
    };
  };
}
