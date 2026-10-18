# blog.foreshock.io

The Foreshock blog: the design of [foreshock.io](../fs) rebuilt as a Lume blog,
with the reading features of
[theme-simple-blog](https://github.com/lumeland/theme-simple-blog) and the
project skeleton of
[theme-boilerplate](https://github.com/lumeland/theme-boilerplate).

Nothing about the main site's markup was ported. The design system — the tokens,
the type scale, the components, the motion and the accessibility behaviour — was
carried across and rebuilt against Lume's layouts, and the blog functionality
was then implemented on top of it. That ordering is the point: the theme's
components are recognisably the same components, and none of the blog's
structure was inherited from it.

## Quick start

```sh
deno task serve     # dev server on http://localhost:3000
deno task build     # static site in ./_site
deno task cms       # the Lume CMS editor
```

Requires Deno 2 and network access on the first build (Lume and the plugins are
fetched from jsDelivr and npm).

## What it does

- **Posts** in `src/posts/*.md`, with title, subtitle, author, date, tags,
  reading time and an optional Mastodon/Bluesky comment thread.
- **An archive** at `/archive/`, paginated ten to a page, with full-text search
  (Pagefind) on the first page.
- **Tag pages** at `/archive/<tag>/` and **author pages** at
  `/author/<author>/`, both generated and both paginated.
- **Older/newer post navigation** at the foot of every post, and a table of
  contents rail beside the body of anything long enough to need one.
- **Atom and JSON feeds**, a sitemap, `robots.txt`, favicons, canonical URLs and
  Open Graph / Twitter cards on every page.
- **Markdown extras**: footnotes, Prism highlighting with per-language
  autoloading, images, definition lists, and `::: note` / `::: warning`
  callouts.
- **A design system** with light and dark first-class, a three-state theme
  toggle that remembers, a visible focus ring everywhere, no third-party
  requests of any kind, and a reduced-motion path.

## Writing a post

```markdown
---
title: What a concept actually costs
subtitle: A concept is not a word. It is a population of phrases.
author: Tim Post
date: 2026-02-11
tags: [Concepts, DACE]
comments:
  src: https://example.social/@user/123
---

The first paragraph is the excerpt used on the homepage and in the feeds.

<!-- more -->

Everything after this is the rest of the post.
```

- `subtitle` is the standfirst under the title, and the meta description. Left
  out, the first paragraph is used instead.
- `<!-- more -->` ends the teaser. Leave it out and the whole post is the
  teaser. The marker is stripped from the rendered page.
- `tags` and `author` become their own archive pages automatically.
- `comments` is optional. Without it no third-party script is loaded on the post
  at all — which is the default, and the reason for it.

Dates are formatted in UTC at build time (see `plugins.ts`), so a post dated
`2026-06-18` reads as the 18th everywhere regardless of the build machine's
timezone.

## Layout of the repository

| Path                       | What it is                                                                    |
| -------------------------- | ----------------------------------------------------------------------------- |
| `_config.ts`               | Lume configuration. Sets the site origin used for absolute URLs.              |
| `plugins.ts`               | Every plugin, the feed and Pagefind settings, and the markdown preprocessing. |
| `callouts.ts`              | The `::: name` markdown-it plugin.                                            |
| `mod.ts`                   | The theme entry point: what a consuming site gets.                            |
| `_cms.ts`                  | Lume CMS configuration for settings, posts and pages.                         |
| `src/_data.yml`            | Site settings: homepage copy, navigation, footer, meta tags.                  |
| `src/_data/i18n.yml`       | Every user-facing string that is not content.                                 |
| `src/_includes/css/`       | The design system, one concern per file.                                      |
| `src/_includes/layouts/`   | `base`, `page`, `post`, `archive`, `archive_result`.                          |
| `src/_includes/templates/` | Post list, post details, pagination, table of contents.                       |
| `src/assets/fonts.css`     | The `@font-face` rules. Loaded separately on purpose.                         |
| `src/js/main.js`           | Theme toggle, nav, reveal, scrollspy, seismograph, comments.                  |
| `test/`                    | A site that consumes this one as a theme, to prove the contract holds.        |

## Notes on the CSS

`src/style.css` is the entry point; Lightning CSS inlines everything it imports
into one `/style.css`, so the import order there _is_ the cascade order. The
`@font-face` rules are the exception: they live in `src/assets/fonts.css`,
served as its own stylesheet, because their relative URLs have to resolve
against the directory the `woff2` files are actually in.

Component CSS never hardcodes a colour. Every colour comes from a token in
`_includes/css/variables.css`, in a light/dark pair, and `--border-ui` exists
separately from `--border` so a control boundary can clear 3:1 without making
the decorative hairlines heavy.

## Using this as a theme

`mod.ts` exports the theme. The consuming site needs nothing from `src/` except
its own content:

```ts
// _config.ts of the consuming site
import lume from "lume/mod.ts";
import theme from "theme/mod.ts";

const site = lume();

site.use(theme());

export default site;
```

Anything the theme ships — data, layouts, templates, stylesheet, fonts, runtime,
the archive generators, the homepage — arrives as a remote file; posts and pages
are yours. `test/` is exactly that arrangement with one markdown file in it, and
`cd test && deno task build` builds it.

## Licence

Apache-2.0, like the rest of the project. The bundled fonts are SIL Open Font
License 1.1; see `src/assets/fonts/LICENSE.md`.
