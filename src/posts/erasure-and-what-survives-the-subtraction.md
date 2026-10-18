---
title: "Concept Erasure: what survives, and what it's already suggesting about ourselves"
subtitle: Subtract one concept from a text's vector, rescale the remainder, and re-score it. The math begins talking, sometimes in uncomfortable ways, and here's why we are investigating it further.
author: Tim Post
date: 2026-10-18
draft: false
tags:
  - Erasure
  - Geometry
  - Aldous-2
  - Trust-And-Safety
---

There's something beautiful about the layering of the geometry that binds
human language together: it builds upon itself like a modern patisserie 
arranged by the most skilled of pastry chefs who saw the outcome of their
vision in advance.

The color of a room, any plain room, can alter the trajectory of what happens 
inside of it just as much as the temperature, or presence of a dangerous snake.

If you remove the wall color and make it painted like a children's nursery 
instead, or perhaps a wall in a hospital room, what happens both with and without
the snake? 

This is what we can determine forensically in text (and soon, images)
through a process we call latent concept erasure through orthogonal projection,
which is a fancy way to say we just use a specialized 
[range finder](https://en.wikipedia.org/wiki/Rangefinder) with a different kind of
lens.

<!--more-->

<p style="margin-top:.25em;">&nbsp;</p>

::: warning
This post is as much about mathematics and engineering science as it is 
about the cultural disciplines that Aldous touches. Exposure to strong
conceptual anti-Blackness phrasing and one controversial recent shoe 
advertisement follows beyond the mid-point of this essay.

This warning is for the benefit of those who have trauma around this.

If that's not you, then you probably should read it. If it is you, then
stop reading when you see "Examples From History," or maybe even skip 
this one altogether.
:::

<p style="margin-top:.25em;">&nbsp;</p>


If you remove a concept from a document's vector and everything else stays
exactly where it was, then the concept was never really there -- it was a
projection of something else. Measuring how much of the document _survives_ the
subtraction is how you find out which.

You can't remove a hospital bed from the initial wall by its vector because
it was never in the semantic picture to begin with. If it's beginning to make
sense, **great**, because it's about to get even easier to understand.

Last housekeeping note: there's a [glossary](/glossary) pinned in the top navigation 
there just to help you in case you need it.

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

## The magnificent error hidden in Aldous' 1-X series

Geometry puns are purely accidental, I assure you.

This is also the story of never being afraid of admitting you were absolutely
right about the wrong thing when you're spelunking in a new place.

Aldous 2 isn't the first model to have LCE; it was a formative feature of the 
entire model concept. LCE was part of the graduation criteria for Aldous' initial 
viability: it _had_ to bring orthogonal concepts to total zero cosine or within 
a negligible, near-zero tolerance or it wouldn't be much more useful than what
exists.

<p style="margin: .25em 0 auto;">&nbsp;</p>

>
> *Okay, it glows green in the daytime and the little meter buries, but now what?*
>

<p style="margin: .25em 0 auto">&nbsp;</p>

Aldous needed to be able to differentiate hate-filled drivel from actual discussions
about hate-filled drivel if it was going to be at all useful, and why we _knew_ people
had to be able to define objectionable on their own terms, with very little technical
ability.

Aldous 1 reported something we initially called *corpus drag*, or how much the rest of 
the corpus shifted when the motif was erased when we ran the purified vector through 
the same metrics we used to measure unacceptable drifts in variation between runs that
focus on one isolated concept worded many different ways.

At first we saw this as a ***roughly*** 2% shift in scored variance on the purified set,
which was disappointing at first, but also trying to show us something *completely
different* which was we were measuring the embedder's temporal drift more precisely 
with the vague "ghosts" of those vectors. We thought it would be _less_ because everything
else (as far as cosine went) would be roughly as similar. Wrong. Wrong. Wrong.

We (well, more like *I*) didn't realize that until a much more recent paper uncovered the 
trap and the reason for it. It was an arithmetic slip: the projection used the un-normalized 
subtraction, meaning the rescale step was applied to a vector whose length no longer correlated 
with anything definitively meaningful.

It was a picture out-of-sync. If I didn't have visceral growl for televisions being
slightly out-of-sync due to a lack of automatic fine tuning in the 80s, I might not
have connected it.

Even accounting for US English being extremely dynamic between 1860 and 1970, the most 
significant drift was found only in the oldest of the oldest texts within our [validation corpus](https://codeberg.org/timthepost/semsage/src/branch/main/train/tests/Aldous_2-0), which watches this in high-resolution bands.

Here's the same 'drag' before and after, presented so that emphasis is clear:

<div class="stats" style="margin-top: .25em;">
  <div class="stat"><div class="v">2<small>%</small></div><div class="k">Corpus drag, before the fix</div></div>
  <div class="stat"><div class="v">3.1<small>%</small></div><div class="k">Corpus drag, corrected</div></div>
  <div class="stat"><div class="v">Corrected: 2-0</div><div class="k">Affected: 1-0 - 1-3</div></div>
</div>

And, importantly, we knew through a simple toggle exactly why we saw the movement
just by flipping that metric from standardized back over to raw Euclidian while running 
[a diverse swath](https://codeberg.org/timthepost/semsage/src/branch/main/train/tests)
through the public-works harness, since we could flip it so conveniently and knowingly 
between runs.

This provides unexpected confidence that our current choice for unified embedder 
(Nomic Text/Vision 1.5) is _more than adequate_ to handle text as far back as 1928 within 
band drifts we can reliably track and certify the guaranteed variances we publish with each
model, which makes operations on these documentable and essential.

The worst "drag damage" was still within acceptable parameters, which we have subsequently
tightened even more, and we couldn't be happier! We now know the full-breadth of our 
defensible observation area where two weeks ago we did not. 

Now that we confidently know when language drift moves through variance, we don't need to 
fully unpack the magnitude of _why_ in order to move forward. We can simply present an honest, 
compelling argument as to why it isn't necessary.

That's exactly the precision we required to move forward with informal sharing of historical 
observations.

## Hard rule: one concept centroid motif at a time

These operations cannot be combined. You must go in the following order:

```text

   Specimen Text -> Orthogonal Centroid Projection -> "Purified" Vector
   Specimen Text -> Different Orthogonal Projection -> New Purified Vector
   
```

This is accurate to the best of my knowledge. I do not claim it is impossible,
I only claim I lack any construct in which to conceive it could be anything 
else. Attempting projection of a centroid _onto_ a previously purified vector 
will not result in the same vector as would have resulted if the operations
were conducted independently.

Hence, the current implementation erases a single concept per operation. Chained
erasure (remove A, then B from what is left) is **arithmetically easy** but
**conceptually treacherous**, because after the first subtraction the second one is
operating on a vector that no longer corresponds to any real sentences. 

Think of it like a lawn with a big rock in the middle. You remove the rock. Now you
have a lawn with a giant bald spot. The tool refuses any further alteration completely 
and reports only the big bald spot with much less grass.

## Examples In History: "Strange Fruit"

How does our modern language treat historical concepts that are linked to very dynamic 
parts of our shared cultural evolution? To help answer that, we can run an informal, but
informative experiment with math more people than us are saying works: Let's see what
Aldous 2 thinks of Strange Fruit (_Meeropol / Holiday, 1939_) through 
the lens of an embedder that can fully understand it, but specializes in how we use 
language *today*.

<p style="margin-top:.25em;">&nbsp;</p>

::: note
The authorship of "Strange Fruit" was contested for some time, and its origins were 
mistakenly attributed to a novel published in 1944 by the same name, written by 
[Lillian Smith](https://en.wikipedia.org/wiki/Lillian_Smith_(author)).

This isn't accurate, according to reviewed biographical sources and most scholarly
consensus that I have open access to. It was very likely written instead by another 
writer and poet, a Black man named [Abel Meeropol](https://en.wikipedia.org/wiki/Abel_Meeropol). 

The exact day or even month Meeropol wrote the initial poem titled "Bitter Fruit", after seeing a 
photograph of the 1930 lynching of [Thomas Shipp and Abraham Smith](https://en.wikipedia.org/wiki/Lynching_of_Thomas_Shipp_and_Abram_Smith), is unknown. The poem was published in the *New York Teacher*
in 1937. He likely wrote it closer to 1937 than 1930, but we don't know when, and 
unless journals or other accounts come on the radar, we can't. What we do know is he later 
renamed it to "Strange Fruit" when he put it to _music_, which [Billie Holiday](https://en.wikipedia.org/wiki/Billie_Holiday) 
so famously covered in 1939.

Critical for our purposes but not nearly as important as the issue of credit is also that it 
places the text squarely within the grasp of open science under current US copyright law. 
:::

In other words, getting back to where we were: approximately what else does racism _mean_ to us 
below the surface of shared meaning, as evidenced by a current X-ray of our language understanding? 

We need to understand this in our field because Aldous uses the same research that helps petroleum 
companies understand when unrest is critical just as much as it helps sociologists understand why 
there's unrest in the first place. Very different levels of altruism, same diligence, and that's been 
missing.

Beyond investigating this being the right thing to do, falsifiable answers to these questions matter 
_a lot_ in machine learning.

We'll start by a first-pass [of these exact fourteen lines of text](https://codeberg.org/timthepost/semsage/src/branch/main/train/tests/Aldous_2-0/__restricted__billie-holiday-strange-fruit.txt):

![A dashboard interface featuring a top 'markov' saturation chart with five bars. The bottom 'UNSIGNED CENTROID SENSORS' chart is fully zoomed out using the timeline selector at the bottom, displaying a wide, colorful array of bars across classes such as 'anger', '++sexuality', '+certainty', 'philosophical_tension', and '++change_existential](/assets/posts/erasure-1/spectrum-full.png)

Let's make sure we eliminate anything that falls past the elbow of meaningful
similiarity and distance, which doesn't cancel many sensors out from this, since
it's a hugely-impactful piece:

![A SemSage Multivariate Workbench dashboard containing two main charts. The top chart shows five isolated bars representing different 'markov' saturations hovering around the 50% confidence line. The bottom chart is a dense, multi-colored bar chart with values peaking near 61%, categorized by groups like 'anger', '+sexuality', '+certainty', and '+hate'](/assets/posts/erasure-1/spectrum-kneedle.png)

What's also remarkable is the intent inflection sensors, as well as Aldous' two 
signed indexes:

![A dark-themed data dashboard with two sections. The top, 'SIGNED CENTROID INDEXES', shows horizontal range sliders for 'Outlook' and 'Action'. The bottom, 'UNSIGNED DENSE CONCEPT SATURATIONS', is a horizontal bar chart showing percentages for concepts like '@ObsInt_drive_ext' at 59% and '@Sarcasm' at 54%, marked with a 20% noise floor and 50% confidence line](/assets/posts/erasure-1/spectrum-scalar.png)

So, let's erase the strongest match, which was "anti-Blackness" after you decode
the key nomenclature:

![A SemSage interface showing a tool to erase a motif, with '~~anti_blackness' selected. Below is a 'before' and 'after (erased)' bar chart. The 'before' dark blue bars for 'change_existential' and '~~anti_blackness' are high, near 50-60%. The 'after' light blue bars show significantly reduced similarity percentages, dropping close to 10%.](/assets/posts/erasure-1/erasure-1.png)

We have 100% cosine collapse. And we lost a whole lot of other extremely moving 
things. But what was hardest to accept and I think deserves the math speaking for
itself here: sexuality collapsed completely too - the ***collective*** sensor head 
for escalated sexuality which is inclusive of fetishism, to be exact:

![A bar chart displaying similarity percentages with a high band marked at 58.9% and a low band at 53.1%. It shows three prominent dark red bars reaching over 50% for the categories '++sadness', '++sexuality', and '++spirituality', with smaller pink bars next to them. A timeline selection tool is visible below](/assets/posts/erasure-1/erasure-2.png)

The full source code, training corpus, scripts, everything else needed to examine
this work is in [this code repository](https://codeberg.org/timthepost/semsage) and available for scrutiny. To save you
the trouble, [here is a link to the Aldous 2 academic paper](https://codeberg.org/timthepost/semsage/src/branch/main/docs/Aldous_2-0.pdf). 

We can put effort into changing what the language grows to mean over time, which 
is the guaranteed fix for any implications of this observation, or we can continue
to debate its existence.

But we now have a framework in which hand-waving takes on a much stronger drag 
coefficient, because math is standing at the table and getting ready to sit down.

## Remember vision, and *that Converse ad?*

We don't yet have enough unencumbered photograps paired to keys to fully bloom the 
_depth_ of image matching (magnitude), but affective recognition in images is zero-shot based
completely on the text vector space from the [existing centroid populations](https://codeberg.org/timthepost/semsage/src/branch/main/train/Aldous_2-0#L1250). 

In other words, we've got plenty of breadth to make it useful already, we just lack
depth to erase while I source and curate the image corpus to fortify it.

Here's the analysis of what could have been observed presented with only technical
commentary I am qualified to make:

![A screenshot of the SemSage Multivariate Workbench interface. The top section displays an uploaded image of a person's legs wearing black Converse sneakers, surrounded by several other pairs of Converse forming a star shape with their shadows. Below is a colorful bar chart titled 'UNSIGNED CENTROID SENSORS GROUPED BY CLASS', showing similarity percentages mostly below 11%, with a tooltip highlighting a 'hedging' variable.](/assets/posts/erasure-1/converse-1.png)

Let's zoom in on the highest scoring group fanned-out for individual discernment as we 
see what's leading the pack here is, at a minimum, unsurprising:

![A zoomed-in section of a bar chart measuring similarity percentage, with a peak line at 11% and a floor line at 5%. It shows sparse, low-scoring bars, with the highest being '~~anti_blackness' near 11%, followed by '~~generational_tension' around 9%, and '++violence' near 8.5%. A timeline navigator is at the bottom.](/assets/posts/erasure-1/converse-2.png)

Note that the way the posed model is dangling the shoes *is semantically very similar* to 
romantic imagery where a woman holds onto high heels in a similar fashion prior to 
an escalation in a romantic encounter. 

That observation is ***precisely*** why we're going to keep going with developing
magnitude image, by image, with excruciating and defensible care put into each
one's inclusion into the corresponding _V_  population we lack. We need to collapse
*images* as well so we can visually observe what changes as it happens.

Further analysis on the image score is an exercise for the reader, this is all open 
source and open corpus precisely so that can be the case.

## Immediate next-steps in the work

We will be fortifying the image corpus as well as the historical validation suite (public)
to better fortify the instrumentation for this specific use, and better track with more 
precision _each indivdual sensor_ across strongly-emotive public domain political speeches
all the way to 2014.

We will also be ramping up our local verification, where we use the encumbered lyrics that
have broad affective consensus as calibration sources (only using Aldous to score the text
and album covers, never actually training on them or that output). It's like needing more 
elements on which to test any new measurement.

There is also more to learn about ways we can more accurately track _linguistic_ drifts 
themselves from _encoder_ drifts due to training or over/under fitting when it comes to 
understanding how to adjust more accurately to relative meaning. 

While we're content with these initial observations, we are highly confident that these 
variance bands reflect genuine linguistic drift over time, and we will soon be publishing 
the comprehensive data to point to it.

## Cross-field invitation to contribute or inquire

I'd like to break the trend of marginalized groups having to be the ones that 
endure the emotional labor of the work involved in examining this more.

There's a limit to how _accurately_ I am able to [craft these groups](/posts/what-a-concept-actually-costs/) without direct support from collaborative people who have studied the experiences we're trying to 
measure and I'd like to call on anyone else who can to help.

I need people deep in historical studies to help this go further, all the way back
to biblical scholars. I've got a few Math post-docs and advanced folks helping 
me with the technical side - I need to bring people interested in working on the
human side to the table with the rigor this phase of the work needs.

I'm `tim@foreshock.io` if you want to collaborate. The answer to "Can Aldous identify
subtle racism" is leaning heavily toward _yes_. What else can you help make it do?

## Additional Notes

While investigating different known examples of certain events that are categorized 
through broad consensus as being deliberately aimed toward marginalized groups, we
observed additional imagery similarities that aren't as well known in history.

Anti-Romani as well as Anti-Indigenous sentiments are strongly associated with having
semantic symmetry with lynching, and this appears frequently in observations.

We plan to investigate them as categories next, in addition to modern identity 
anchors currently undergoing plastic-like deformation due to current events.

Math removes the rules-lawyering. Our language is _literally_ designed to 
tell on itself.

## References

See [Aldous 2-0: Zero-shot affective semantic telemetry and guardrail engine built on DECE](https://codeberg.org/timthepost/semsage/src/branch/main/docs/Aldous_2-0.pdf) 
by the same author as this post (the paper is academic and generously-sourced).

The paper's text bibliography, as well as raw markdown source are in the same repository.

---

*Written by-hand by Tim Post, Principal engineer and investigator working on this; creator of Aldous.*





