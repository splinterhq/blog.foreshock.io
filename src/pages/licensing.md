---
title: Licensing
subtitle: Ambiguity resolved through intent, not a directory of files. Two rules cover everything here.
wide: true
eyebrow: Terms
url: /licensing/
menu:
  visible: true
  order: 4
---

<div class="callout" style="max-width:70ch">
  <span class="label label--accent">The rule</span>
  <p><strong>Prosaic content that isn't designed as a prompt to create code is licensed under CC-0.</strong></p>
  <p style="margin-top:14px"><strong>Non-prosaic content, including prompts intended to generate code, is licensed under the terms of the Apache-2 license.</strong></p>
</div>

## What that means here

<div class="table-wrap">
  <table>
    <thead><tr><th>Content</th><th>License</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td>The site, the CLI, the gateway, the dashboard, Splinter</td><td class="mono">Apache-2.0</td><td>Code.</td></tr>
      <tr><td>Trainer scripts, Lua provisioners, label files</td><td class="mono">Apache-2.0</td><td>Code.</td></tr>
      <tr><td><strong>Concept phrases</strong> — the words a sensor is made of</td><td class="mono">CC-0</td><td>Prose. Not instructions to a machine.</td></tr>
      <tr><td>Generated probe corpora</td><td class="mono">CC-0</td><td>Derived from phrases; still prose.</td></tr>
      <tr><td>White papers, and every post on this blog</td><td class="mono">CC-0</td><td>Prose.</td></tr>
    </tbody>
  </table>
</div>

## Why the split

A phrase corpus isn't source code, and treating it as such gets the licensing
wrong in both directions. It isn't compiled, executed, or a prompt to anything —
it's language supplied as examples of a concept. But it's also the **most
labor-intensive and most human part** of building a classifier, and the one that
most needs wide reuse and contribution. CC-0 is the most permissive license that
exists: no attribution, no share-alike, just dedication to the public domain.

Everything that isn't prose stays under Apache-2.0, because a permissive patent
grant and explicit modification-notice terms are the right terms for software
other people will build on.

### Creative Commons Isn't For Code

Distinguishing *prosaic* from *non-prosaic* content with explicit intent will
resolve most potential licensing disputes before they ever bloom simply by 
clearing up the ambiguity as to which one applies. 

### Prompts That Produce Code Aren't Necessarily Prosaic

They're *definitely* probalistic and arguably a meta-language of Engilsh as much 
as Trans-Atlantic Americana is, but they might not be found by someone else to be 
*prosaic*. 

Clarify your intent with a deliberate license comment if it's a code prompt. By 
policy, Foreshock does not include code prompts unless absolutely necessary (and 
currently there are zero).

## Dependencies

Splinter and the nomic text and vision encoders are Apache-2.0. `cpp-httplib` is
MIT; Apache ECharts is Apache-2.0; Deno and llama.cpp are MIT. The bundled fonts
are SIL Open Font License 1.1.

This blog runs on [Lume](https://lume.land) (MIT) and self-hosts Familjen
Grotesk and IBM Plex Mono rather than loading them from a CDN.

## GPL3 Compatibility 

Because Aldous' only external component dependency that isn't directly owned by
its author is Nomic Text / Vision 1.5, and because 100% of the training corpus 
and weights of Nomic Text & Nomic Vision are released under Apache 2, the entire
stack is technically eligible for potential forking, where the FSF can assume the
copyright of the fork, including all dependencies.

Nomic can be reproduced freely from source with what they include. 

The author is willing to coordinate this if someone reaches out, but I'm not going
to be the one that approaches the FSF or RMS about it. I'm `tim@foreshock.io` or 
`timthepost@protonmail.com`, whichever is preferred. The tools aren't really something
I go around suggesting but something people figure out they need on their own.

In any event, a GPL fork is desired because it enables a much wider enablement to the
science on ordinary consumer-grade hardware (an i3 or better runs it all comfortably).

## Contributing phrases

Anything you contribute under the above is CC-0. If you'd rather it not be, say
so in the pull request and it will be left out — and the tolerance harness will
report the thinner coverage rather than quietly scoring against a population
that got smaller without anyone noticing.
