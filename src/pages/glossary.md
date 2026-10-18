---
title: Glossary
subtitle: Every term this project leans on, defined in the words you'd use to explain it to a colleague who has not read the source.
wide: true
eyebrow: Vocabulary
url: /glossary/
menu:
  visible: true
  order: 3
---

Terms are grouped roughly in the order you'd meet them, from the substrate up.

## Substrate — Splinter

<div class="gloss">
  <div class="gloss__row"><div class="gloss__term">Manifold</div><div class="gloss__def">A shared memory region several processes map directly. No socket, no copy, no arbiter — reads and writes go to the same physical pages.</div></div>
  <div class="gloss__row"><div class="gloss__term">Seqlock</div><div class="gloss__def">The concurrency protocol. Each slot carries a counter that is even when stable and odd during a write. Read it before and after; if it moved, your read was torn — retry.</div></div>
  <div class="gloss__row"><div class="gloss__term">EAGAIN</div><div class="gloss__def">Not an error — a signal. The slot is momentarily contested; back off and retry. The only errno that means "the same call will succeed later".</div></div>
  <div class="gloss__row"><div class="gloss__term">Slot</div><div class="gloss__def">One fixed-width, 64-byte-aligned record in the store's flat array. Holds a key hash, an epoch, a label mask, a key string, a 768-float vector, and an offset into the value arena.</div></div>
  <div class="gloss__row"><div class="gloss__term">Bloom label</div><div class="gloss__def">A 64-bit mask on each slot, used for routing and batch enumeration. It's a bitmask, not a probabilistic filter — the name is historical.</div></div>
  <div class="gloss__row"><div class="gloss__term">Tandem key<small>order companion</small></div><div class="gloss__def">An ordered set under one base name using a dot accessor: <code>car</code>, <code>car.1</code>, <code>car.2</code>. How a concept's centroid, variance and trip-config hang off one logical name.</div></div>
  <div class="gloss__row"><div class="gloss__term">Epoch</div><div class="gloss__def">The seqlock counter. Advancing it by exactly two is how a write publishes itself; <code>bump</code> advances it with no data change, which is how you re-trigger automation.</div></div>
  <div class="gloss__row"><div class="gloss__term">Geometry</div><div class="gloss__def">Slot count and value width. Fixed at creation and never resizable — a deliberate constraint that buys the flat-array layout.</div></div>
</div>

## Geometry — DACE

<div class="gloss">
  <div class="gloss__row"><div class="gloss__term">Embedding</div><div class="gloss__def">A fixed-length list of numbers representing meaning. 768 dimensions here. Similar meanings land near each other; the numbers themselves mean nothing individually.</div></div>
  <div class="gloss__row"><div class="gloss__term">Centroid<small>μ</small></div><div class="gloss__def">The arithmetic mean of a population of vectors. The "centre" of a concept.</div></div>
  <div class="gloss__row"><div class="gloss__term">Variance<small>σ²</small></div><div class="gloss__def">Per-dimension spread around the centroid. Small where the example phrases agreed; large where they drifted.</div></div>
  <div class="gloss__row"><div class="gloss__term">Diagonal</div><div class="gloss__def">Only the diagonal of the covariance matrix is kept — 768 numbers instead of a 768×768 matrix. This is what makes scoring O(1) per concept.</div></div>
  <div class="gloss__row"><div class="gloss__term">Bessel correction<small>N−1</small></div><div class="gloss__def">Dividing the variance sum by N−1 rather than N, so a small sample isn't systematically under-read as less certain than it is.</div></div>
  <div class="gloss__row"><div class="gloss__term">Standardized distance<small>Mahalanobis, diagonal case</small></div><div class="gloss__def">Distance weighted so each dimension counts for less if your examples already agreed strongly on it. "How surprising is this move, given what I know about this concept."</div></div>
  <div class="gloss__row"><div class="gloss__term">Variance floor</div><div class="gloss__def">The minimum weight any dimension gets, 0.01. Without it a near-zero variance would give that one dimension a weight of up to 10,000× and let it dominate the score.</div></div>
  <div class="gloss__row"><div class="gloss__term">Cosine similarity</div><div class="gloss__def">Angle between two vectors, scale-invariant. The number to quote when comparing across concepts. 1.0 means identical direction.</div></div>
  <div class="gloss__row"><div class="gloss__term">Elbow</div><div class="gloss__def">The natural break in a sorted similarity curve, found by maximum deviation from the diagonal. Used as a relevance filter, not a ranking.</div></div>
</div>

## The model — Aldous

<div class="gloss">
  <div class="gloss__row"><div class="gloss__term">Sensor</div><div class="gloss__def">One concept, defined by a population of example phrases. Becomes a centroid plus a variance.</div></div>
  <div class="gloss__row"><div class="gloss__term">Graduated ladder</div><div class="gloss__def">The same concept at several intensities as separate sensors — <code>tension</code>, <code>+tension</code>, <code>++tension</code>. Lets a model distinguish presence from intensity.</div></div>
  <div class="gloss__row"><div class="gloss__term">Axis pillar<small>|</small></div><div class="gloss__def">A unidirectional ladder that is always returned and never gated. A random gap would break consumer math, and absence across a run is itself information.</div></div>
  <div class="gloss__row"><div class="gloss__term">Ambient scalar<small>@</small></div><div class="gloss__def">How something is framed rather than what's in it — tone, meta-concept, delivery.</div></div>
  <div class="gloss__row"><div class="gloss__term">Observed-intent head<small>@ObsInt_</small></div><div class="gloss__def">A trust-and-safety tripwire: a full concept plus a per-key trip configuration. Case-sensitive; a near-miss prefix bakes fine and scores as nothing.</div></div>
  <div class="gloss__row"><div class="gloss__term">Structural probe<small>%</small></div><div class="gloss__def">Reads the ambient intensity of a whole tagged group rather than one concept. The <code>%markov_*</code> family is these — the model's structural baselines.</div></div>
  <div class="gloss__row"><div class="gloss__term">Five pillars</div><div class="gloss__def">The five structural probes a model declares. Their similarities average into a single session reading — and return nothing rather than a partial average, because dividing by five with only three present measures less than it claims.</div></div>
  <div class="gloss__row"><div class="gloss__term">Drift band</div><div class="gloss__def">Mean ± one standard deviation across the structural probes in one response. How far a reading sits from its own baseline. Degrades to nothing below three baselines.</div></div>
  <div class="gloss__row"><div class="gloss__term">Shunt</div><div class="gloss__def">A concept added to a running model without retraining it. Either monolithic (one mean-pooled vector) or intrinsic (centroid + variance).</div></div>
  <div class="gloss__row"><div class="gloss__term">Motif</div><div class="gloss__def">The concept you erase from a specimen vector. Any cached key is technically a valid motif; the policy of which to prefer lives in the UI.</div></div>
</div>

## Discipline — testing

<div class="gloss">
  <div class="gloss__row"><div class="gloss__term">Adhesion</div><div class="gloss__def">Normalized position inside a tolerance band: 0 at the boundary, 1 at the far edge. How much regression margin a concept still has.</div></div>
  <div class="gloss__row"><div class="gloss__term">Seal</div><div class="gloss__def">Widening any band whose adhesion is below 10% so the current reading sits at the goal. Refuses entirely if any check failed — a regression is evidence, not something to accommodate.</div></div>
  <div class="gloss__row"><div class="gloss__term">Receipt</div><div class="gloss__def">A score you can re-derive from the model file alone: the centroid, the variance, the three numbers, the thresholds. No hidden judgement in the path.</div></div>
  <div class="gloss__row"><div class="gloss__term">Head bias</div><div class="gloss__def">The bias a concept inherits from whoever wrote its examples. Unavoidable. Surfaces as a requirement, not a disclaimer.</div></div>
  <div class="gloss__row"><div class="gloss__term">Fail open</div><div class="gloss__def">A guard that misses and still lets the operation succeed. Worse than no guard, because it looks like one — which is why the ones here are pinned by tests.</div></div>
</div>
