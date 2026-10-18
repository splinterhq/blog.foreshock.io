---
title: Why receipts matter than scores when choosing a safety model
subtitle: A number you cannot recompute is an assertion wearing a decimal point. Here is what it takes to make every reading re-derivable.
author: Tim Post
date: 2026-06-18
draft: true
tags:
  - Testing
  - Governance
  - SemSage
---

Every classifier shows you a number. Very few can show you where the number came
from. The gap between those two things is the entire difference between a
measurement and an opinion, and it is invisible unless you go looking for it.

<!--more-->

A score is an output. A receipt is the set of inputs and constants that produce
it, stored well enough that you can run them again and get the same answer. One
is something the model says; the other is something you can check.

## What has to be true for that to work

Three properties, and each one is cheap until you have it and expensive to
retrofit:

- **The thresholds are constants in tests, not configuration.** A threshold that
  can be tuned at runtime is a threshold nobody has ever asserted on.
- **Every key names its own semantics.** If the gate cannot tell you what it is
  a gate for, the score it returns is not interpretable.
- **The failure modes are enumerated before they happen.** Specifically the ones
  that fail _open_.

## A guard that misses and says yes

Fail-open is the failure that looks like a safety feature. A check runs, misses,
and the operation proceeds anyway — and because a guard ran, everyone assumes
something verified it. It is worse than no guard at all, because it consumes the
credibility that a real guard would have earned.

This is the reason the tolerance harness refuses to widen a band when any check
has failed:

```sh
# seal: widen only what needs widening, and never over a failure
if [ "$failed" -ne 0 ]; then
  echo "refusing to seal: $failed check(s) failed" >&2
  exit 2
fi
```

A regression is evidence. Accommodating it into the tolerance band destroys the
only artefact that recorded it.

## Adhesion, and why bands move at all

Tolerances are not fixed forever. A concept that used to sit near 0.4 can drift
to 0.45 after a legitimate change to the phrase population, and if the band is
frozen the harness reports a failure that no longer means anything. So bands are
defined by _adhesion_ — normalised position inside the band:

- `0` at the boundary
- `1` at the far edge

Sealing widens only the bands whose adhesion has fallen below 10%, which puts
the current reading at the goal. Bands with healthy adhesion are untouched, so
the loosening is visible as a diff rather than as a quiet drift in every
threshold at once.

## What this looks like in a report

| Property                | Score only             | Receipt                         |
| ----------------------- | ---------------------- | ------------------------------- |
| Reproducible            | No                     | Yes — same file, same constants |
| Threshold provenance    | Unknown                | A test name                     |
| Failure mode            | Silent                 | Named, and pinned               |
| Disagreement resolution | Argues from the number | Argues from the arithmetic      |

::: tip
The practical test: hand the model file and the score to someone who has
never read your code, and ask them to reproduce the number. If they cannot,
you gave them an assertion, not a measurement.
:::

None of this makes the classifier more accurate. It makes the errors legible,
which is a different property and, for anything a person will be asked to
defend, the one that matters.

