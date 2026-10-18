---
title: 'Welcome to "Not The LinkedIn Newsletter!"'
subtitle: This is a research log with a comments section. Everything here is CC-0, nothing is tracked, and the feed is the point. 
author: Tim Post
date: 2026-09-22
tags:
  - Meta
  - Governance
---

The obvious way to run a project blog is to bolt a newsletter onto the marketing
site and let someone else send it. This is not that, and the differences are the
purpose of doing it in the first place. Open research is supposed to mean bringing 
something to the hallway when you think it might be worth something.

Somehow, that turned into publishing only when you're ready to prove something. 
It became turning a stream-of-consciousness into something highly-curated built
more around the tastebuds of investors than terms real colleagues are actually
investigating.

<!--more-->

That's what marketing does to science, and why it can't be what drives the 
directions this technology should take, which is whatever way the evidence we 
uncover takes it, openly, where the plurality has equal access to decide what's
safe _during_ the building process before changes become too costly to revisit.

This is what goes *into* Tim's [LinkedIn Newsletter](#) which hopefully brings
you here.

## No analytics, no third parties

This site sets no cookies, loads no fonts from anyone's CDN, and runs no
analytics. The fonts are self-hosted and subset with Google's own
`unicode-range` values, so a page with no accented characters fetches one
`woff2` file and no more.

The reasoning is the project's thesis applied to itself: a site arguing that
classification should not require sending content to a third party cannot then
report every reader to one. There is no exception carved out for "just the page
views".

## High-signal, modestly-paced updates

Sometimes things move really fast and there's not a lot of time to get an article
to capture something that could be useful to others written down in time to keep
up with the next tasks in a project, but generally, a post only happens when there 
is something _new_ to talk about _because we plan to talk more about it_.

Occasionally there's an article that talks about why a design decision was made, or
what a feature exists.

Eveyrone here is busy and optimizes as best they can for others when considering the
ask and what someone else needs to help with it. We're inviting collaboration, not
lecturing. 

Okay, sometimes there's a little lecturing.

## The feed is the subscription

There is no email list. There is an Atom feed and a JSON feed, both generated
from the same source as the pages:

<div class="btn-row" style="margin-top: .5em;">
  <a class="btn btn--primary" href="/feed.xml">Atom</a>
  <a class="btn btn--ghost" href="/feed.json">JSON</a>
</div>

A reader can take the feed, filter it, read it in whatever they already use, and
cancel by not reading. That is a smaller promise than an email list, and it is
one the project can actually keep.

## Posts say when they are wrong

The rule for everything published here: if a number is measured, it says how,
and if it is not measured, it says **provisional**. Three examples from recent
posts, so the pattern is visible rather than promised:

- The corpus-drag figure from
  [erasure](/posts/erasure-and-what-survives-the-subtraction/) was wrong, was
  corrected, and both numbers are printed.
- The vision alignment harness under-reads because its labels were inferred from
  a search query and never verified. Every number from it is provisional.
- Trip thresholds are parsed and stored but **not** enforced server-side yet.
  The studio says "would trip" for exactly that reason.

A blog that only ever publishes wins is marketing with a publication date.

## Everything is CC-0

Posts here are dedicated to the public domain. The site's code is Apache-2.0.
Translating a post, quoting it in an argument, or lifting a worked example into
your own documentation requires no permission and no attribution, though
attribution is welcome.

The distinction matters because the hardest part of a project like this is not
the code — it is the prose, the example phrases and the explanations. Those are
the parts that should travel furthest.

Code is Apache-2. See [licensing](/licensing).

## Comments, when a post has them

Some posts carry a Mastodon or Bluesky link and render replies fetched at read
time from that post's thread. It is the only place on this site where a request
leaves the visitor's browser to somewhere else, and it is opt-in per post: a
post without a comment link loads no third-party script at all.

If you would rather reply here than on a social network, the source repositories
take issues and pull requests, and Git is not GitHub-specific — they live on
[Codeberg](https://codeberg.org/timthepost/semsage).

---

_The main site has the concept documentation, the glossary and the governance
statement. This one is where the reasoning between the releases goes._
