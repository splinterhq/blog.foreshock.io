# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and
this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2026-10-13

First release of the blog: the foreshock.io design system rebuilt on Lume 3.

### Added
- Design system ported from foreshock.io as composable stylesheets:
  tokens, reset, layout, type, prose, components, navigation, footer, and a
  blog-specific layer. Light and dark are both first-class, and every colour
  is a token.
- Post layout with a table of contents rail, reading time, tag chips,
  footnotes and older/newer post navigation.
- Paginated archive at `/archive/`, plus generated tag and author pages.
- Atom and JSON feeds, sitemap, `robots.txt`, favicons, canonical URLs and
  Open Graph / Twitter cards.
- Full-text search via Pagefind, styled with the site's own design tokens.
- Mastodon / Bluesky comment embeds, loaded only on posts that ask for them.
- Three-state theme toggle (system / light / dark), self-hosted subsetted
  fonts, the animated seismograph, reveal-on-scroll, section scrollspy and
  accordions.
- `mod.ts` theme entry point, and a `test/` site that consumes this repository
  as a theme to keep that contract honest.

### Notes
- Dates are formatted in UTC at build time rather than by the `date` filter at
  render time, because a date-only post written as `2026-06-18` renders as the
  17th on any machine west of Greenwich.
- `<meta name="theme-color">` tags are emitted by the layout rather than by the
  metas plugin: the plugin consumes its colour array with `shift()` as it writes
  the tags, so in a multi-page build only the first page gets them.