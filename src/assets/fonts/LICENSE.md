# Fonts

Both families are self-hosted rather than loaded from `fonts.gstatic.com`, so no
visitor request reaches a third party. That is not only a privacy stance: a
project whose thesis is that nothing should phone home cannot then load a font
from a third party on every page view.

Both are licensed under the **SIL Open Font License 1.1**, which permits
redistribution and web embedding, including bundled in a release tree like this
one. Neither has been modified or renamed.

| File(s)                               | Family                                    | Upstream                                             |
| ------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `familjen-grotesk-var-*.woff2`        | Familjen Grotesk (variable, wght 400–700) | <https://fonts.google.com/specimen/Familjen+Grotesk> |
| `ibm-plex-mono-{400,500,600}-*.woff2` | IBM Plex Mono                             | <https://fonts.google.com/specimen/IBM+Plex+Mono>    |

Full licence text: <https://openfontlicense.org/>

## Refreshing these

They are Google's own woff2 subsets, pulled from the `css2` API on 2026-08-14
(Familjen Grotesk v11, IBM Plex Mono v20). The `latin` and `latin-ext` subsets
are both present; the `unicode-range` in `sempods.css` is copied verbatim from
upstream, so `latin-ext` is only fetched when a glyph outside `latin` actually
renders. Cyrillic, Greek and Vietnamese subsets were deliberately not taken —
the site is `en-US` and nothing on it renders those scripts. The `unicode-range`
values in `fs.css` are copied from this same upstream response; keep them in
sync if you ever refresh.
