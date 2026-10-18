import lume from "lume/mod.ts";
import plugins from "./plugins.ts";

const site = lume({
  src: "./src",

  // The origin every absolute URL is built from: canonical links, the feeds,
  // the sitemap and og:image. Override it for a preview deployment:
  //   deno task lume --location https://staging.example.com
  location: new URL("https://blog.foreshock.io/"),
});

site.use(plugins());

export default site;
