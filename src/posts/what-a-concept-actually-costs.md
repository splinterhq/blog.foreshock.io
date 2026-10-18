---
title: "Centroid concepts: what's the cost from cradle to deployment?"
subtitle: A concept is not a word. It is a population of phrases, and somebody has to write them. Computationally, they require more brain power than compute, and can multiply the impact of human judgement exponentially. So, what do they cost to write?
author: Tim Post
date: 2026-02-11
tags:
  - Concepts
  - DACE
  - Training
---

The most expensive part of a classifier is not the training run. It is the forty
minutes you spend writing the forty phrases that become a sensor — and the fact
that those forty phrases are now the _entire_ definition of what the model
believes the concept means.

<!--more-->

Everything downstream of that list is arithmetic. Before it, there is a person
with opinions, and the model inherits every one of them without any mechanism
for telling you which were load-bearing.

## A concept is a distribution, not a point

Write a handful of example phrases and each one becomes a 768-number vector. The
naive move is to average them and call the average the concept:

<div class="eqn">
  μ = (1/N) Σ x<sub>i</sub>
  <span class="eqn__cap">The centroid. Every phrase contributes equally, and the
  disagreement between them is thrown away.</span>
</div>

That throws away the most useful thing you learned while writing them. If your
twenty phrases for _tension_ agree tightly on some dimensions and drift all over
the place on others, the concept genuinely is tighter in one direction than the
other. Keeping only the mean flattens that into a fiction: one point pretending
to describe a cloud.

So the model keeps the per-dimension spread as well:

<div class="eqn">
  σ²<sub>j</sub> = (1/(N−1)) Σ (x<sub>ij</sub> − μ<sub>j</sub>)²
  <span class="eqn__cap">Variance per dimension. Small where your examples
  agreed; large where they did not.</span>
</div>

The `N−1` is Bessel's correction and it is not optional. Divide by `N` and a
twenty-phrase sample reports itself as systematically more certain than it is,
which is exactly the direction you want to be wrong in.

## The cost is the writing in plain language, not math

Here is the arithmetic nobody puts in a paper. A full training run for the
flagship model takes about forty-five minutes. Writing its eighty-two sensors
takes considerably longer than that, and it cannot be parallelised, because
writing example phrases for _escalating hostility_ while someone else writes
them for _epistemic hedging_ is not a task you split across a team without
losing the shared judgement that makes the concepts comparable at all.

::: warning
85% of Aldous's phrases are human-written, 15% are synthetic backfill. That
ratio is in the trainer's own header, unedited. If a human writes the head,
the head has the bias of the human — and the number you get out is that
head's opinion about your text, expressed as a float.
:::

The consequence is that a classifier's coverage is a property of _who wrote it_.
A concept nobody in the group had experience of is a concept with a thin
population: high variance on most dimensions, a reading that moves when the
phrase set changes, and a score that means less than the interface implies.

## What would fix it

Not a better embedding model. A better phrase-writing process:

- More than one writer per concept, with the disagreements kept rather than
  averaged away before you ever see them.
- Populations large enough that variance is worth reporting — below about ten
  phrases, the variance estimate is mostly noise.
- Vocabulary coverage tracked as a first-class metric, so a concept reads as
  thin when it is thin.

Until that exists, the honest thing a score can do is tell you how sure the
model was, not just what it decided. It already can: the variance is right there
in the slot. Most interfaces throw it away, and that is a choice, not a
limitation.

---

_Next: why the covariance matrix in that equation is only ever stored as its
diagonal — and what that buys you at scoring time._
