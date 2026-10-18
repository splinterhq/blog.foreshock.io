---
title: Umbrella Governance Philosophy
subtitle: Classifying language is a power. Whoever holds the classifier holds the ability to call something acceptable or not, at scale, without looking at it. That is worth building carefully, and worth being objectively suspicious of. This is why our work happens in the sunlight, openly, and collaboratively with those that depend the most on it.
url: /governance/
menu:
  visible: true
  order: 2
---

This project exists because the current options are bad in opposite directions.
Commercial classifiers are opaque, rented, and process the content you were
trying to protect. Rule-based filters are transparent and trivially evaded.
Foreshock is an attempt at a third thing: a classifier whose reasoning you can
read, that runs on your own hardware, and that never needs to see your content
to tell you something about it.

<div class="tenets" style="margin-top:32px">
  <div class="tenet"><span class="k">01</span><b>Geometry, not judgement</b><p>A concept becomes vectors and arithmetic. Nothing in the path can be persuaded by anything.</p></div>
  <div class="tenet"><span class="k">02</span><b>Receipts, not scores</b><p>Every reading is re-derivable from the model file. If you can't recompute it, you can't appeal it.</p></div>
  <div class="tenet"><span class="k">03</span><b>Your hardware, your data</b><p>The embedder, store and scorer are local processes. No specimen crosses a network hop. There is no network code to leak one.</p></div>
  <div class="tenet"><span class="k">04</span><b>Auditable, including itself</b><p>Tolerance bands, thresholds and label guards are pinned by tests. A guard that fails open is called out as one.</p></div>
  <div class="tenet"><span class="k">05</span><b>Bias is surfaced</b><p>Whoever wrote the examples shaped the concept. The trainer says so in its own header, and this site repeats it.</p></div>
  <div class="tenet"><span class="k">06</span><b>Open, on purpose</b><p>Tooling under Apache-2.0, concept phrases under CC-0. The most human-intensive artifact needs the widest possible reuse.</p></div>
</div>

## What this project won't claim

A governance project that oversells itself is worse than no project. So,
plainly:

- **It does not understand your content.** It measures where a text sits in a
  space you described. It cannot tell you what a text _means_, and a confidently
  wrong reading is possible.
- **Trip enforcement is not server-side yet.** Observed-intent thresholds are
  stored and parsed but not compared against. Trip decisions are client policy
  today. The studio says "would trip" for that reason.
- **Some published numbers are provisional.** The vision alignment figures come
  from a harness with unverified labels, and that is said wherever they appear.
- **This is research software.** Past 1.0 on Splinter, pre-release on the model,
  and the READMEs in the repositories lag the code in places. Where the site
  says a thing is measured, it means measured.
- **Good-faith is the cost of open access.** A wrong number is an accident, not
  a misdirection or hallucination. The amount of rigor in place for a project of
  this nature is itself something worth writing about eventually. Be our editors
  before being our critics, please.

## Contributing

Both repositories are public and both take issues and pull requests. Git —
Codeberg is where they live; nothing about the workflow requires GitHub.

<div class="btn-row" style="margin-top:22px">
  <a class="btn btn--primary" href="https://codeberg.org/timthepost/semsage" target="_blank" rel="noopener">SemSage <span class="arrow">→</span></a>
  <a class="btn btn--ghost" href="https://codeberg.org/timthepost/libsplinter" target="_blank" rel="noopener">Splinter</a>
  <a class="btn btn--link" href="/licensing/">Licensing →</a>
</div>

Contributing phrase corpora is the highest-value contribution and the one the
project most needs: a diverse group writing the examples, with the most
vulnerable represented, produces a measurably better concept than one person or
one model can. That's the head bias notice taken seriously.
