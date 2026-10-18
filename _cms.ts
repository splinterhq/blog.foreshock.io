import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

/** Normalise a page URL: leading slash, trailing slash, empty = derive. */
const url: Lume.CMS.Field = {
  name: "url",
  type: "text",
  description: "The public URL of the page. Leave empty to use the file path.",
  transform(value) {
    if (!value) {
      return;
    }

    if (!value.endsWith("/")) {
      value += "/";
    }
    if (!value.startsWith("/")) {
      value = "/" + value;
    }

    return value;
  },
};

cms.document({
  name: "settings",
  description: "Global settings for the site.",
  store: "src:_data.yml",
  url: "/",
  fields: [
    {
      name: "lang",
      type: "text",
      label: "Language",
    },
    {
      name: "description",
      type: "text",
      label: "Tagline",
      description: "Used as the meta description and feed subtitle.",
    },
    {
      name: "home",
      type: "object",
      label: "Homepage",
      fields: [
        {
          name: "eyebrow",
          type: "text",
          label: "Eyebrow",
        },
        {
          name: "title",
          type: "text",
          label: "Title",
        },
        {
          name: "lead",
          type: "text",
          label: "Lead paragraph",
        },
        {
          name: "seismograph",
          type: "checkbox",
          label: "Show the seismograph",
          description: "The animated brand trace under the lead paragraph.",
        },
      ],
    },
    {
      name: "menu_links",
      type: "object-list",
      label: "Extra navigation links",
      fields: [
        {
          name: "text",
          type: "text",
          label: "Title",
        },
        {
          name: "href",
          type: "text",
          label: "URL",
        },
        {
          name: "target",
          type: "text",
          label: "Target",
          description:
            'Leave empty for the same tab. Use "_blank" for new tab.',
        },
      ],
    },
    {
      name: "footer_columns",
      type: "object-list",
      label: "Footer link columns",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Title",
        },
        {
          name: "links",
          type: "object-list",
          label: "Links",
          fields: [
            {
              name: "text",
              type: "text",
              label: "Title",
            },
            {
              name: "href",
              type: "text",
              label: "URL",
            },
          ],
        },
      ],
    },
    {
      name: "footer_note",
      type: "text",
      label: "Footer note",
      description: "Small print under the logo.",
    },
    {
      name: "footer_quote",
      type: "text",
      label: "Footer quote",
      description: "Shown opposite the copyright line.",
    },
    {
      name: "extra_head",
      type: "code",
      label: "Extra head content",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "metas",
      type: "object",
      label: "Meta tags",
      description: "Meta tags configuration: https://lume.land/plugins/metas/",
      fields: [
        "site: text",
        "description: text",
        "title: text",
        "image: text",
        "twitter: text",
        "fediverse: text",
        "lang: text",
        "generator: checkbox",
      ],
    },
  ],
});

cms.collection("posts: Blog posts", "src:posts/*.md", [
  {
    name: "title",
    type: "text",
    label: "Title",
  },
  url,
  {
    name: "subtitle",
    type: "text",
    label: "Subtitle",
    description:
      "The standfirst under the title. Also used as the excerpt fallback.",
  },
  {
    name: "author",
    type: "text",
    init(field, { data }) {
      field.options = data.site?.search.values("author");
    },
  },
  {
    name: "date",
    type: "date",
    label: "Date",
  },
  {
    name: "tags",
    type: "list",
    label: "Tags",
    init(field, { data }) {
      field.options = data.site?.search.values("tags");
    },
  },
  {
    name: "comments",
    type: "object",
    label: "Comments",
    description: "Both empty means no comment script is loaded on the post.",
    fields: [
      {
        name: "src",
        label: "Link to Mastodon post",
        type: "url",
      },
      {
        name: "bluesky",
        label: "Link to Bluesky post",
        type: "url",
      },
    ],
  },
  {
    name: "extra_head",
    type: "code",
    label: "Extra head content",
    description: "Extra content to include in the <head> tag",
  },
  {
    name: "content",
    type: "markdown",
    label: "Content",
  },
]);

cms.collection("pages: Additional pages", "src:pages/*.md", [
  {
    name: "layout",
    type: "hidden",
    value: "layouts/page.vto",
  },
  {
    name: "title",
    type: "text",
    label: "Title",
  },
  {
    name: "subtitle",
    type: "text",
    label: "Subtitle",
  },
  url,
  {
    name: "eyebrow",
    type: "text",
    label: "Eyebrow",
    description:
      'Small mono label above the title, e.g. "Reference · Vocabulary".',
  },
  {
    name: "menu",
    type: "object",
    label: "Navigation",
    fields: [
      {
        name: "visible",
        type: "checkbox",
        label: "Show in menu",
      },
      {
        name: "order",
        type: "number",
        label: "Order",
      },
    ],
  },
  {
    name: "extra_head",
    type: "code",
    label: "Extra head content",
    description: "Extra content to include in the <head> tag",
  },
  {
    name: "content",
    type: "markdown",
    label: "Content",
  },
]);

cms.upload("uploads: Uploaded files", "src:uploads");

export default cms;
