/* blog.foreshock.io — site runtime.
 *
 * No dependencies, no build step beyond the minifier. Progressive enhancement
 * throughout: every page is readable and navigable with this file absent.
 * Anything that fails here must leave the page working, not broken.
 */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  // ============================================================ theme
  //
  // Three states, not two: `system` follows prefers-color-scheme and `light` /
  // `dark` override it. The attribute is only ever set for an explicit choice,
  // which is what lets the CSS media query stay the source of truth for
  // `system` — no JS has to watch for OS changes.

  const STORE_KEY = "fs-theme";
  const MODES = ["system", "light", "dark"];

  function readMode() {
    try {
      const v = localStorage.getItem(STORE_KEY);
      return MODES.includes(v) ? v : "system";
    } catch {
      // Private mode / storage disabled: still honour the OS preference, just
      // without remembering an override.
      return "system";
    }
  }

  function applyMode(mode) {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  }

  // Runs in <head> before first paint (see the inline snippet there) to avoid a
  // flash. Re-applied here so the stored mode is authoritative at load, and the
  // no-js marker is dropped now that this file is running — otherwise the CSS
  // keeps forcing every reveal visible for the life of the page.
  applyMode(readMode());
  document.documentElement.classList.remove("no-js");

  // The explicit 3-state rotation: system → light → dark → system.
  //
  // It is tempting to jump straight from `system` to the *opposite* of whatever
  // the OS is currently showing, because that is the one click that visibly
  // does something. That is wrong: on a light-preferring machine it makes
  // `light` unreachable, because `system` already looks light and the toggle
  // offers `dark`. The user then cannot get back to a light page except by
  // sitting through dark — and if they only ever see light, they cannot tell
  // the control exists. A fixed rotation reaches all three states from any
  // starting point, on any OS, which is what "three states" has to mean.
  const NEXT = { system: "light", light: "dark", dark: "system" };

  function initTheme() {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

    let mode = readMode();

    function label() {
      // Name the CURRENT state, then the transition the next click performs —
      // and both must come off the same NEXT map the handler uses, so the label
      // cannot describe a different jump than the one that happens. Getting
      // this wrong is invisible to a user who never tab-reaches the control and
      // fatal to one who does, which is why it is derived rather than written.
      const current = mode === "system"
        ? "following your system"
        : `always ${mode}`;
      const next = NEXT[mode];
      const nextText = next === "system"
        ? "following your system again"
        : `always ${next}`;
      btn.setAttribute(
        "aria-label",
        `Colour theme: ${current}. Switch to ${nextText}.`,
      );
      // The glyph follows the current state, and all three states have one.
      // `aria-pressed` is deliberately gone: it is a boolean, so it can only
      // ever distinguish dark from not-dark, which is what left `system` and
      // `light` looking identical and made a click into either of them read as
      // nothing happening.
      btn.dataset.mode = mode;
      btn.title = `Theme: ${mode}`;
    }

    label();

    btn.addEventListener("click", () => {
      mode = NEXT[mode];
      try {
        localStorage.setItem(STORE_KEY, mode);
      } catch {
        /* not persisting is survivable; the toggle still works this page-view */
      }
      applyMode(mode);
      label();
      // Canvases read colours off the computed style, so a mode change has to
      // redraw them.
      document.dispatchEvent(new CustomEvent("fs:theme"));
    });

    // Only matters while in `system`, but keeping the label accurate costs
    // nothing and avoids a stale name after an OS switch.
    matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      () => {
        if (mode === "system") label();
      },
    );
  }

  // ============================================================ nav

  function initNav() {
    const burger = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector("[data-nav-links]");
    if (!burger || !links) return;

    const setOpen = (open) => {
      links.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    };

    burger.addEventListener("click", () => {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
  }

  // ============================================================ reveal on scroll
  //
  // Three safeguards, because a fade-up that never fires is a page with holes
  // in it: a rAF pass for anything already in view, an 800ms timer for
  // throttled or backgrounded tabs where the IntersectionObserver never
  // reports, and `.no-js` in CSS that keeps everything visible without JS.

  function initReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const show = (el) => el.classList.add("is-in");

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        if (delay) setTimeout(() => show(el), delay);
        else show(el);
        io.unobserve(el);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach((el) => {
      if (el.getBoundingClientRect().top < globalThis.innerHeight) {
        show(el);
      } else {
        io.observe(el);
      }
    });

    setTimeout(() => items.forEach(show), 800);
  }

  // ============================================================ accordion

  function initAccordions() {
    for (const trigger of document.querySelectorAll("[data-acc-trigger]")) {
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls"),
      );
      if (!panel) continue;

      trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        // max-height, not height: the panel sizes to its content. The explicit
        // 0 on close is what lets the transition run at all.
        panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
      });

      // A resize can invalidate a measured pixel height. Cheap to re-measure,
      // and a clipped answer in an open panel is a broken answer.
      addEventListener("resize", () => {
        if (trigger.getAttribute("aria-expanded") === "true") {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  // ============================================================ section scrollspy

  /** Resolve an in-page anchor to its element.
   *
   * Heading ids come out of the build percent-encoded — a heading containing a
   * comma becomes `id="a%2Cb"` — so the href is not always a usable selector and
   * `querySelector("#a%2Cb")` throws a SyntaxError. That throw used to abort
   * the rest of boot() and silently disable the copy buttons, the seismograph
   * and the comment embeds on every post with a comma in a heading, leaving the
   * theme toggle alive only because it happened to be initialised first. Match
   * on the id directly and treat an unmatchable anchor as what it is: one
   * broken link, not a broken page. */
  function sectionFor(href) {
    const id = href.slice(1);
    let section = document.getElementById(id);
    if (!section) {
      try {
        section = document.getElementById(decodeURIComponent(id));
      } catch {
        // A malformed escape is an unmatchable anchor, nothing more.
      }
    }
    return section ?? null;
  }

  function initScrollspy() {
    const nav = document.querySelector("[data-scrollspy]");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    const byId = new Map();
    for (const link of links) {
      const section = sectionFor(link.getAttribute("href"));
      if (section) byId.set(section, link);
    }

    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const link = byId.get(entry.target);
        if (!link) continue;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      }
    }, { rootMargin: "-18% 0px -72% 0px" });

    byId.forEach((_, section) => io.observe(section));
  }

  // ============================================================ copy buttons

  function initCopy() {
    for (const btn of document.querySelectorAll("[data-copy]")) {
      btn.addEventListener("click", async () => {
        const target = document.querySelector(btn.dataset.copy);
        if (!target) return;
        const text = target.innerText;
        try {
          await navigator.clipboard.writeText(text);
          const prev = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(() => {
            btn.textContent = prev;
          }, 1600);
        } catch {
          // Clipboard needs a secure context. Say so rather than failing
          // silently — a button that does nothing looks broken.
          btn.textContent = "Copy failed — select manually";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2600);
        }
      });
    }
  }

  // ============================================================ seismograph
  //
  // The brand mark as an animation: flat baseline, a small precursor, then the
  // main event. Colours are read off the computed style so it follows the
  // theme, and the trace colour is separate from the accent on purpose — a
  // live plot should not read as a link.

  function initSeismograph() {
    const canvases = Array.from(
      document.querySelectorAll("[data-seismograph]"),
    );
    if (!canvases.length) return;

    const reducedNow = reduced.matches;
    let raf = 0;

    function draw(canvas, t) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const css = getComputedStyle(document.documentElement);
      const trace = css.getPropertyValue("--trace").trim() || "#19d0e3";
      const line = css.getPropertyValue("--border-strong").trim() ||
        "rgba(233,240,244,0.17)";

      const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // baseline
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // trace
      const mid = h / 2;
      const amp = h * 0.36;
      ctx.strokeStyle = trace;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      for (let x = 0; x <= w; x += 2) {
        const p = x / w;
        // Two slow sines for a plausible-looking seismogram envelope.
        let y = 0;
        y += Math.sin(p * 34 + t * 0.9) * 0.22;
        y += Math.sin(p * 71 - t * 0.55) * 0.12;
        y += Math.sin(p * 133 + t * 0.3) * 0.05;
        // Precursor at 0.28, main event at 0.56, decaying aftershocks after.
        y += Math.exp(-Math.pow((p - 0.28) * 26, 2)) * 0.42 * Math.sin(t * 3.1);
        y += Math.exp(-Math.pow((p - 0.56) * 13, 2)) * 1.5 *
          Math.sin(t * 2.2 + 0.6);
        y += Math.exp(-Math.pow((p - 0.68) * 22, 2)) * 0.5 *
          Math.sin(t * 4.4 + 1.9);
        y += Math.exp(-Math.pow((p - 0.79) * 30, 2)) * 0.26 *
          Math.sin(t * 5.1 + 2.7);
        ctx.lineTo(x, mid - y * amp);
      }
      ctx.stroke();
    }

    function frame(now) {
      const t = (now - startedAt) / 1000;
      for (const canvas of canvases) draw(canvas, t);
      raf = requestAnimationFrame(frame);
    }

    const startedAt = performance.now();

    if (reducedNow) {
      for (const canvas of canvases) draw(canvas, 0);
      // A single still frame: the brand mark as a diagram rather than an
      // animation. Redraw on theme change so it stays legible in both modes.
      document.addEventListener("fs:theme", () => {
        for (const canvas of canvases) draw(canvas, 0);
      });
      return;
    }

    raf = requestAnimationFrame(frame);

    // Cancel the loop when nobody can see it, and resume without stacking a
    // second one when they come back.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    });

    document.addEventListener("fs:theme", () => draw(canvases[0], 0));

    let resizeTimer = 0;
    addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        for (const canvas of canvases) draw(canvas, 0);
      }, 160);
    });
  }

  // ============================================================ comments
  //
  // The Mastodon/Bluesky embed is a third-party custom element, fetched into
  // the build only when a post asks for comments. Importing it dynamically —
  // and only after the browser has parsed the page — keeps it off the critical
  // path, and a failure here cannot take the post down with it.

  function initComments() {
    if (!document.querySelector("mastodon-comments")) return;

    import("/js/comments.js")
      .then(({ default: Comments }) => {
        if (!customElements.get("mastodon-comments")) {
          customElements.define("mastodon-comments", Comments);
        }
      })
      .catch(() => {
        // The fallback text inside the element ("No comments yet") is already
        // in the HTML, so a failed fetch degrades to a plain sentence.
      });
  }

  // ============================================================ boot

  function boot() {
    initTheme();
    initNav();
    initReveal();
    initAccordions();
    initScrollspy();
    initCopy();
    initSeismograph();
    initComments();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  globalThis.FS = { refresh: boot };
})();
