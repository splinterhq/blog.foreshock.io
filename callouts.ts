// Callouts for markdown: `::: note`, `::: warning`, `::: tip`, …
// …through to `:::`.
//
// GitHub's flavour of this (the `> [!NOTE]` blockquote form) needs a
// markdown-it block rule of its own, and the npm alert plugins either target
// unified/mdast instead of markdown-it, or emit class names this design would
// have to be patched around. markdown-it-container already solves the hard
// part — finding where a fenced block ends — so this file is only the twenty
// lines of rendering on top of it.
//
// Emitted markup, matched by the .callout rules in css/prose.css:
//
//   ::: warning
//   Body text.
//   ::
//   → <div class="callout callout--warning" role="note">
//       <span class="label">Warning</span> … </div>

import container from "npm:markdown-it-container@4.0.0";

import "lume/types.ts";

/** The slice of markdown-it's surface this plugin touches. Typing it here
 *  rather than importing markdown-it's own types keeps the dependency to the
 *  one container package actually used at runtime. */
interface MarkdownIt {
  use(plugin: unknown, name: string, options: unknown): MarkdownIt;
}

interface Token {
  /** 1 for an opening fence, -1 for the closing one */
  nesting: 1 | -1;
}

export interface CalloutOptions {
  /** The callout names this site understands, in CSS class order. */
  types?: Record<string, { class: string; label: string }>;
  /** Whether to open the alert as role="note" */
  role?: boolean;
}

const defaults: Required<CalloutOptions> = {
  types: {
    note: { class: "callout--note", label: "Note" },
    info: { class: "callout--info", label: "Info" },
    tip: { class: "callout--tip", label: "Tip" },
    warning: { class: "callout--warn", label: "Warning" },
    danger: { class: "callout--danger", label: "Danger" },
    success: { class: "callout--success", label: "Success" },
  },
  role: true,
};

export default function callouts(userOptions: CalloutOptions = {}) {
  const options = { ...defaults, ...userOptions };

  return function plugin(md: MarkdownIt) {
    for (const [name, { class: cls, label }] of Object.entries(options.types)) {
      md.use(container, name, {
        // Exact match. A startsWith test here would make `::: notebook` open a
        // note callout, because the container rule matches on the fence line
        // before the rest of the line is looked at.
        validate: (params: string) => params.trim() === name,
        render: (tokens: Token[], idx: number) => {
          const token = tokens[idx];

          if (token.nesting !== 1) {
            return "</div>\n";
          }

          const role = options.role ? ` role="note"` : "";

          return (
            `<div class="callout ${cls}"${role}>` +
            `<span class="label label--accent">${label}</span>\n`
          );
        },
      });
    }
  };
}
