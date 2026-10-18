---
title: A diagonal is a matrix promise you can more confidently keep
subtitle: Storing only the diagonal of a covariance matrix turns scoring from arithmetic you dread into a lookup and two subtractions. It's also partly why Aldous is so damn fast.
author: Tim Post
date: 2026-04-02
tags:
  - DACE
  - Geometry
---

A full covariance matrix for a 768-dimensional embedding is 768×768 numbers. Per
concept. Across eighty-two sensors that is about 48 million floats. 

Yet, as a popular television salesman once said, "*But wait, there's more!*" 

<!--more-->

If you use an embedder with much higher dimensionality, say, 2048 or even 3072? 

`3072 x 3072 x 82 = 773,849,088`

Yikes! But the point of this post isn't about floats multiplying like tribbles, 
it's about almost all of them never being read.

Aldous uses the estimated [Mahalanobis](https://en.wikipedia.org/wiki/Mahalanobis_distance) 
(diagonal) case for precisely this reason.

Keeping only the diagonal throws away the claim that _dimension 3 and dimension
4 move together_. Whether that is defensible depends on the embedding, and the
honest answer is: test it, don't assume it. What it buys is the property that
matters at request time — scoring a document against a concept becomes a
centroid lookup and a weighted distance, with no matrix to touch.

## The scoring function

For a document vector `x` and a concept with centroid `μ` and variance `σ²`:

<div class="eqn">
  d(x)² = Σ<sub>j</sub> (x<sub>j</sub> − μ<sub>j</sub>)² / (σ²<sub>j</sub> + ε)
  <span class="eqn__cap">A standardized distance — Mahalanobis, diagonal case.
  Constant time per concept.</span>
</div>

Two details in that line do most of the work.

**The weights come from your own examples.** A dimension where your twenty
phrases agreed strongly divides by a small number, so a surprising move along it
is expensive — exactly as it should be, because you told the model that
dimension is where the concept lives.

**The variance floor exists because of one pathological case.** If your phrases
happen to agree _exactly_ on a dimension, the raw weight becomes `1/0` — or
`1/0.0000001`, effectively an instruction to let one coordinate dominate the
entire score. The floor at `0.01` caps any single dimension's weight at 100×.

## What this looks like at the call site

Nothing above the arithmetic changes when you add a sensor. The embedder runs
once per document; the scorer loops over keys already resident in shared memory:

```lua
-- One document, many concepts, no inference.
local v = embed(text)              -- 768 floats, once

for key, slot in store:each() do
  local d2 = 0.0
  for j = 1, 768 do
    local diff = v[j] - slot.mu[j]
    d2 = d2 + diff * diff / (slot.sigma2[j] + FLOOR)
  end
  scores[key] = math.sqrt(d2)      -- constant time per concept
end
```

There is no prompt, no temperature, no sampling, and nothing to tune per
deployment. If the numbers come out wrong, you have the phrases that produced
them and the constants that consumed them.

## The cost you are accepting

Dropping the off-diagonal terms is an approximation, and it is worth being
precise about which one. You are asserting that dimensions are conditionally
independent _given the concept_. That's an important distinction.

For sentence embeddings, where dimensions are learned jointly and almost certainly 
correlate, that assertion is false in detail. What survives is the large-scale 
behaviour: concepts whose examples varied a lot still read as more diffuse, and 
documents far from the centroid still read as far.

::: note
The elbow — the natural break in a sorted similarity curve, found by maximum
deviation from the diagonal — is a _relevance filter_, not a ranking. Using
it as a ranking is how a system ends up confidently returning the worst
match in a set.
:::

So: constant time, one file, arithmetic you can redo by hand, and a stated
approximation instead of a hidden one. That is a good trade for this problem. It
would be a bad trade for one that needed correlated-dimension sensitivity, and
it is worth knowing which problem you have before you point a model at it.

---

_Footnotes below are load-bearing: the ε and the floor are not the same number,
and neither of them is zero._[^floor]

[^floor]: The floor is applied as `σ² + FLOOR` on every dimension, so a
    zero-variance dimension contributes weight `1/FLOOR` rather than an
    infinity. The `ε` in the distance is a separate guard for the case where the
    _document_ lands exactly on the centroid, which would otherwise give a
    distance of zero for a meaningless reason.
