import lightningcss from "lume/plugins/lightningcss.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import date, { Options as DateOptions } from "lume/plugins/date.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import prism, { Options as PrismOptions } from "lume/plugins/prism.ts";
import terser from "lume/plugins/terser.ts";
import robots from "lume/plugins/robots.ts";
import sitemap, { Options as SitemapOptions } from "lume/plugins/sitemap.ts";
import feed, { Options as FeedOptions } from "lume/plugins/feed.ts";
import pagefind, { Options as PagefindOptions } from "lume/plugins/pagefind.ts";
import favicon, { Options as FaviconOptions } from "lume/plugins/favicon.ts";
import { merge } from "lume/core/utils/object.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.9.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.9.0/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.9.0/footnotes.ts";
import callouts from "./callouts.ts";

import "lume/types.ts";

export interface Options {
  /**
   * The language dates are formatted in, and the locale of the human-readable
   * date strings. Defaults to "en"; it does not change `lang` for the pages
   * themselves, which lives in _data.yml.
   */
  lang?: string;
  prism?: Partial<PrismOptions>;
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
  feed?: Partial<FeedOptions>;
  sitemap?: Partial<SitemapOptions>;
  favicon?: Partial<FaviconOptions>;
}

export const defaults: Options = {
  prism: {
    // Load each language on demand from the fence that names it. Without this
    // Prism runs with nothing loaded and a `lua` fence comes out unhighlighted
    // but still marked up as a lua block, which looks like a bug rather than a
    // setting.
    autoloadLanguages: true,
  },
  feed: {
    output: ["/feed.xml", "/feed.json"],
    query: "type=post",
    limit: 20,
    info: {
      title: "=metas.site",
      description: "=metas.description",
      lang: "=metas.lang",
    },
    items: {
      title: "=title",
    },
  },
  pagefind: {
    // The design system owns the type and the surfaces, so Pagefind's own
    // reset is turned off and .pagefind-ui is styled in css/search.css
    // instead. Search is injected into any element with this id.
    ui: {
      containerId: "search",
      resetStyles: false,
      showImages: false,
      excerptLength: 0,
      showSubResults: false,
    },
  },
  favicon: {
    input: "assets/favicon.svg",
  },
};

/**
 * Reduce a markdown fragment to a single plain line, for meta descriptions.
 *
 * Deliberately conservative: it removes the syntax rather than trying to parse
 * it, so an unusual document loses its formatting but never its meaning. The
 * cut is at a word boundary because the metas plugin truncates at 155
 * characters anyway — cutting mid-word here would only make that worse.
 */
function plainText(source: string): string {
  const text = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__|\*|_)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 155
    ? `${text.slice(0, 152).replace(/\s\S*$/, "")}…`
    : text;
}

/** Configure the site */
export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    // Dates are formatted in this language, in UTC. See the preprocess hook.
    const lang = options.lang ?? "en";

    // ::: blocks in markdown become callouts — see callouts.ts. Registered
    // before the plugin chain so the markdown-it plugin list reads in the order
    // it is assembled.
    site.hooks.addMarkdownItPlugin(callouts());

    site
      .use(terser())
      // The font provenance note is repository documentation, not a page. Left
      // alone, Lume renders it into /assets/fonts/license/ and the sitemap
      // invites a crawl of a document that was never meant to be read there.
      .ignore("assets/fonts/LICENSE.md")
      .use(lightningcss())
      .use(basePath())
      .use(resolveUrls())
      .use(slugifyUrls())
      .use(metas())
      .use(date(options.date))
      .use(readingInfo())
      // The heading ids are what the table of contents and the scrollspy link
      // to. The visible anchor link inside each heading is switched off: this
      // design does not make headings clickable, and a wrapped anchor turns
      // every h2 into an underlined accent-coloured link.
      .use(toc({ anchor: false }))
      .use(footnotes())
      .use(image())
      .use(prism(options.prism))
      .use(pagefind(options.pagefind))
      .use(sitemap(options.sitemap))
      .use(robots())
      .use(feed(options.feed))
      .use(favicon(options.favicon))
      .add("style.css")
      .add("assets")
      .add("js")
      .mergeKey("extra_head", "stringArray")
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          const body = page.data.content as string;

          // <!-- more --> marks the end of the teaser used on the homepage and
          // in the feeds. Falling back to the whole body is deliberate: a post
          // without the marker should still have a usable excerpt. The marker
          // itself is stripped from the content — left in place it renders as a
          // stray HTML comment in the middle of the post, which is exactly the
          // kind of thing that survives to production.
          const [excerpt] = body.split(/<!--\s*more\s*-->/i);
          page.data.excerpt ??= excerpt;
          page.data.content = body.replace(/<!--\s*more\s*-->/i, "");

          // Posts carry a description into the meta tags and the feeds. The
          // standfirst is the intended source; the opening paragraph is the
          // fallback so a post without one is still described by something it
          // actually says.
          if (page.data.type === "post") {
            page.data.description ??= plainText(
              page.data.subtitle || page.data.excerpt,
            );
          }

          // Dates are rendered in UTC, here, at build time.
          //
          // A front matter date of 2026-06-18 parses to midnight UTC, and a
          // formatter running in any timezone west of Greenwich renders it as
          // the 17th. That is a build-machine artefact, not a fact about the
          // post, so the three strings the templates actually use are computed
          // once with an explicit zone instead of at render time. `TZ` in the
          // deno task would fix this too, except Deno ignores task-level env.
          if (page.data.date) {
            const when = new Date(page.data.date);
            page.data.dateISO = when.toISOString();
            page.data.dateShort = when.toISOString().slice(0, 10);
            page.data.dateHuman = new Intl.DateTimeFormat(lang, {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }).format(when);
          }
        }
      });

    // Mastodon / Bluesky comment embeds. The module is always built, but
    // js/main.js only imports it on a page that actually renders a
    // <mastodon-comments> element, so a post without comments — and every page
    // that is not a post — makes no request to any third party at all.
    site.remoteFile(
      "/js/comments.js",
      "https://cdn.jsdelivr.net/npm/@oom/mastodon-comments@0.3.2/src/comments.js",
    );
  };
}
