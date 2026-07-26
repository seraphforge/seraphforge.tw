---
title: "I No Longer Trust Codex, But I Will Keep Using It"
date: 2026-06-25
site_lang: en
translation_key: why-i-still-use-codex
categories:
  - Thoughts
tags:
  - AI
  - Codex
  - Reflection
  - Personal
slug: why-i-still-use-codex
permalink: 2026/06/25/why-i-still-use-codex/
description: "A personal technical reflection on why I no longer fully trust Codex, but still keep using it as a useful tool when its scope is limited and its work is verified."
seo_title: "I No Longer Trust Codex, But I Will Keep Using It"
seo_description: "A personal reflection from maintaining my blog and using an AI coding tool, covering Codex's value, risks, need for verification, and why engineering judgment still matters."
og_description: "I no longer trust Codex to do everything for me, but I will still use it. The thing that should be trusted is not the tool itself, but whether the person using it keeps their judgment."
canonical_url: https://seraphforge.github.io/2026/06/25/why-i-still-use-codex/
---

# I No Longer Trust Codex, But I Will Keep Using It

I no longer trust Codex.

But I will keep using it.

That sounds contradictory, but for me, it is probably the most honest feeling I have had recently.

I am not saying Codex is completely useless. On the contrary, sometimes it is genuinely powerful. It can quickly understand a project structure, help me find possible problems, and give me a reasonably useful direction when I am stuck. Many times, it saves me a lot of time.

But that is also where the problem begins.

It is too easy for people to mistakenly believe that "it knows what it is doing."

---

## It Looks Reliable

The most dangerous thing about Codex is not that it makes mistakes.

All tools make mistakes. People make mistakes too.

The truly dangerous part is that when it makes a mistake, it often still looks confident.

It will tell you what it did in a complete tone, and it will explain why the change makes sense in a reasonable way. It does not always stop and say, "I am actually not sure." More often, it gives you something that looks complete, engineering-oriented, and very much like a real answer.

If you do not check it yourself, it is easy to believe it.

And that is the feeling I dislike the most.

---

## It Is Not That I Distrust AI, But That I Distrust Autopilot

I am not against AI tools.

I also do not think engineers should pretend they do not use AI and hand-code everything themselves. That is not more noble. It is just more tiring.

But I have started to feel that using Codex should not be like handing over the steering wheel.

It is more like a fast-moving intern with ordinary memory who actively fills in missing details. You can ask it to look up information, organize context, modify a small piece of code, help run tests, or first propose a plan.

But whether to accept the result still has to be decided by you.

Because it does not know your deployment habits. It does not know which settings are historical baggage and which settings you intentionally kept. It also does not know that some things that look like they can be "cleaned up while we are here" may break everything once changed.

In my blog, the root setting once used an incorrect project subpath, and deployment settings may look like only a few lines of configuration, but behind them is the basic condition for whether the site can go online correctly.

The tool will not bear the consequences for me.

---

## I Will Still Keep Using It

Then why will I keep using it?

Because it still has value.

I do not believe Codex can finish everything for me, but I believe it can help me get into context faster.

I do not believe every change it makes is correct, but I believe it can save me some repetitive work.

I do not believe it understands my full intent, but I believe I can split tasks smaller, limit the scope, and require verification so that it becomes a more controllable tool.

That is probably my current attitude toward AI coding tools:

Do not worship it.

Do not reject it completely.

Treat it as a tool, not as the answer.

---

## What Really Matters Is Still Judgment

Codex made me realize one thing more clearly: the value of an engineer is not only whether they can write code.

Writing code is only one part of it.

What matters more is whether you know what should not be changed casually, where verification is needed, when to stop and read logs, and what areas a change may affect.

AI can generate a lot of content, but it does not automatically have your context.

It can speed you up, but it cannot take responsibility for you.

So I no longer trust Codex.

I will check it, constrain it, require it to run builds, and require it to list which files it changed.

And under those conditions, I will still keep using it.

Because the thing that should truly be trusted was never the tool itself.

It is whether the person using the tool still keeps their own judgment.
