import plugins, { Options } from "./plugins.ts";

import "lume/types.ts";

export type { Options } from "./plugins.ts";

export default function (options: Partial<Options> = {}) {
  return (site: Lume.Site) => {
    // Configure the site
    site.use(plugins(options));

    // Everything the theme needs in order to render: the data, the layouts,
    // the stylesheet, the fonts, the runtime, the archive generators and the
    // homepage. Content is deliberately NOT here — posts and pages belong to
    // the site using the theme, not to the theme.
    //
    // The glob patterns are how jsDelivr resolves a remote folder, so they are
    // all anchored with a leading slash; a relative pattern silently matches
    // nothing and the consumer gets a theme with no layouts.
    site.remote("/", import.meta.resolve("./src"), [
      "/_data.yml",
      "/_data/**/*",
      "/_includes/css/*.css",
      "/_includes/layouts/*.vto",
      "/_includes/templates/*.vto",
      "/assets/fonts/*.woff2",
      "/assets/*.svg",
      "/assets/*.png",
      "/js/*.js",
      // The defaults that make a folder of markdown files into posts: the type
      // the archive queries look for, and the layout that renders them.
      "/posts/_data.yml",
      "/style.css",
      "/404.md",
      "/archive.page.js",
      "/archive_result.page.js",
      "/index.vto",
    ]);
  };
}
