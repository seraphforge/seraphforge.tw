# Seraph Writing Style

This guide keeps Seraph articles grounded in real work instead of making them feel like generic generated essays.

## Core Voice

Start from a real event, experiment, error, question, or observation. A Seraph article should usually begin with something that actually happened: a failed test, a confusing log, a workshop note, a device that did not behave as expected, or a question that stayed unresolved.

Do not use empty opening phrases such as:

- 在現今快速發展的時代
- 隨著科技日新月異
- 本文將深入探討
- 值得注意的是
- 綜上所述

Avoid using the same structure in every post. Not every article needs an introduction, three points, a conclusion, and future outlook. Some posts can be experiment logs, partial notes, mistake records, or short field observations.

Keep real uncertainty visible when it is true:

- 我一開始以為……
- 實際測試後才發現……
- 這裡我目前還不能確認……
- 這個判斷可能會受到……影響

Do not invent personal experience, device behavior, data, test results, quotes, screenshots, or citations.

## Technical Articles

When possible, include concrete context:

- actual environment
- device model
- operating system version
- tool version
- commands used
- error messages
- failed attempts
- why one approach was chosen over another
- what is still unfinished

Do not make every sentence symmetrical, polished, and presentation-like. Technical writing can keep the shape of the investigation. If the work was messy, the article can show the parts that mattered.

Reduce overuse of colon-plus-list formatting. Lists are useful for setup steps, commands, evidence, or comparison, but prose should still carry the reasoning.

Avoid repeated rhetorical templates:

- 不只是……更是……
- 從……到……
- 這不僅代表……
- 真正重要的是……

## Endings

The ending does not always need to be uplifting. It can stop at:

- a question that still needs verification
- the next experiment
- an unresolved limitation
- a failed result
- a note about what evidence is still missing

## Front Matter Controls

Supported controls:

```yaml
archive_only: true
indexing: false
featured: false
show_in_list: false
```

Behavior:

- `archive_only: true` hides a post from visible lists and excludes it from sitemap/search indexing support. The generated page can still exist if Hexo builds it.
- `indexing: false` adds `noindex, nofollow`, removes the post from sitemap, and removes it from the generated search index.
- `show_in_list: false` keeps the page generated but hides it from home, archive, tag, and all-article lists.
- `featured: false` is reserved for recommendation/featured surfaces. It does not delete the post.

Do not apply these flags to published posts casually. Use them when a post should stay in the repository but should not be promoted by the site.

## Public Site Limitation

GitHub Pages is a public static website. It cannot truly protect private articles. If a file is generated and deployed publicly, someone who knows or discovers the URL may still access it.

For content that must not be externally visible:

- do not generate the page, or
- move it to a private content folder that is not committed to the public repository, or
- keep it in a private repository or local note system.
