---
title: "Erasure: what survives, and what it opens for research"
subtitle: Subtract one concept from a text's vector, rescale the remainder, re-score it — and print the arithmetic instead of asserting the result.
author: Tim Post
date: 2026-08-05
draft: true
tags:
  - Erasure
  - Geometry
  - DACE
---

If you remove a concept from a document's vector and everything else stays
exactly where it was, then the concept was never really there — it was a
projection of something else. Measuring how much of the document _survives_ the
subtraction is how you find out which.

<!--more-->

## The procedure, in full

Take the document vector `x`, the motif centroid `μ_m` (the concept you are
erasing), and its variance `σ²_m`. Three steps, no inference:

1. **Project.** Measure how much of `x` lies along the motif direction.
2. **Subtract.** Remove that component: `x' = x − λμ_m`.
3. **Rescale.** Put the vector back on the unit sphere, because a shorter vector
   is not a _less_ meaningful one — it is the same text, measured on a different
   ruler.

Then re-score `x'` against every other concept under identical conditions. What
moves is the receipt.

```
motif:     violence      λ = 0.41
before:    anger 0.62   threat 0.38   violence 0.71
after:     anger 0.58   threat 0.11   violence 0.07
```

`threat` fell almost as far as `violence`. That is the interesting result and
the one that makes the tool worth having: the two concepts were not independent
in this document, and you now know it numerically instead of by argument.

## The bug that was in the metric

The first implementation of this reported _corpus drag_ — how much the rest of
the corpus shifted when the motif was erased — as roughly 2%. That was wrong,
and the reason was an arithmetic slip: the projection used the un-normalised
subtraction, so the rescale step was applied to a vector whose length no longer
correlated with anything meaningful.

The fix changed the number, and it changed it in the direction that made the
feature look slightly worse. Both numbers are published:

<div class="stats">
  <div class="stat"><div class="v">2<small>%</small></div><div class="k">Corpus drag, before the fix</div></div>
  <div class="stat"><div class="v">3.1<small>%</small></div><div class="k">Corpus drag, corrected</div></div>
  <div class="stat"><div class="v">2-0</div><div class="k">Corrected in release</div></div>
</div>

::: warning
The interesting conclusion is not "erasure is lossy". It is that a plausible
metric can be wrong in a way that flatters the feature, and the only reason
it got caught is that the arithmetic was printed next to the claim.
:::

## One motif at a time

The current implementation erases a single concept per operation. Chained
erasure — remove A, then B from what is left — is arithmetically easy and
conceptually treacherous, because after the first subtraction the second one is
operating on a vector that no longer corresponds to any real text. The tool
refuses it deliberately.

Any cached key is technically a valid motif, including an ambient scalar or a
structural probe. Which one _should_ be preferred is a policy question that
belongs in the interface, not in the arithmetic, so it lives in the Shunt Studio
rather than in the model.

## Where this is provisional

Two things, stated plainly:

- The corpus-drag figures come from a fixed evaluation set that predates the
  current phrase population. They are directional, not authoritative.
- Nothing here claims erasure is selective in the useful sense. Removing a
  concept and watching related concepts move is a _diagnostic_. It is not a
  content filter, and it is not a privacy control.
