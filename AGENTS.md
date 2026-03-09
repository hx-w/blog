# Article Rules For Agents

This repository is a Chinese Astro blog. When adding or revising blog posts, follow the rules below unless the user explicitly asks for something else.

## Scope

- These rules apply to all files under `src/data/blog/`.
- The goal is consistent structure, stable tags, clean assets, and readable writing.
- Do not use emoji in titles, frontmatter, headings, body text, image alt text, or filenames.

## File Path And Slug

- Create each new post as a single Markdown file at `src/data/blog/<slug>.md`.
- `<slug>` must use lowercase ASCII kebab-case, for example `oral-workflow-automation.md`.
- Do not use spaces, Chinese characters, uppercase letters, or date prefixes in the filename unless the user explicitly asks for them.
- Keep the slug stable. If a slug changes, also move the image directory and update internal links.

## Frontmatter

Use this field order:

```md
---
title: "文章标题"
pubDatetime: 2026-03-09T08:00:00.000Z
description: "一句话到两句话的摘要，给读者看，也给列表页和 SEO 用。"
tags: ["tools", "tutorial"]
draft: false
---
```

Rules:

- `title` is required. Keep it accurate and natural. Do not write clickbait, slogans, or decorative symbols.
- `pubDatetime` is required. Use full ISO 8601 format in UTC, for example `2026-03-09T08:00:00.000Z`.
- `description` is required. Write plain Chinese prose in 1 to 2 sentences. Keep it specific and readable. Do not paste a paragraph-long abstract or stack keywords.
- `tags` is required in practice. Do not rely on the schema default `["others"]`.
- `draft` is optional. Set it to `true` only when the article is intentionally incomplete.
- `modDatetime` is optional. Set it when making a meaningful revision to an existing post.
- `featured` is optional. Do not enable it unless the user explicitly asks.
- `ogImage` is optional. By default, do not set it. The site already supports dynamic OG images.
- `canonicalURL`, `hideEditPost`, and `timezone` should only be added when there is a real need.

## Tag Rules

- Use 1 to 3 tags per post.
- Reuse the existing tag system first:
  - `algorithm`
  - `cpp`
  - `devops`
  - `game-dev`
  - `graphics`
  - `life`
  - `note`
  - `paper`
  - `python`
  - `scu`
  - `tools`
  - `translation`
  - `tutorial`
- Prefer one primary topic tag plus zero to two auxiliary tags.
- Use lowercase English words or kebab-case only.
- Only introduce a new tag when no existing tag fits and the new tag is likely to be reused by multiple future posts.
- Do not create one-off tags for a single article.

Quick mapping:

- Algorithms and data structures: `algorithm`
- C++ engineering: `cpp`
- Deployment, server work, build pipelines: `devops`
- Graphics, rendering, geometry, shading: `graphics`
- Tooling, scripts, automation, workflow helpers: `tools`
- Reading notes or paper summaries: `paper` or `note`
- Step-by-step practical guides: `tutorial`
- Translations: `translation` plus one topic tag
- Personal reflections or non-technical records: `life`

## Body Format

- Write in Markdown, not MDX, unless the user explicitly asks for MDX features.
- Start with 1 to 3 short paragraphs that explain the context, the concrete problem, or what the reader will get from the post.
- Insert `<!--more-->` after the opening section.
- The body should start at `##`. Do not start the body with another `#`, because the title already exists in frontmatter.
- Use `###` and deeper headings only when the structure actually needs them.
- Code blocks must include a language identifier such as `ts`, `cpp`, `python`, `bash`, or `text`.
- Use tables only when they are clearer than prose or lists.
- If the post is a translation, link the original source near the top and clearly distinguish translated content from your own notes.
- If the post includes formulas, keep them valid for KaTeX.

## Writing Style

- Default to Chinese. Keep original English technical terms only where they improve precision.
- Keep the tone human, concrete, and high-signal.
- Prefer real context, actual decisions, tradeoffs, mistakes, and constraints over generic summary language.
- Do not write in a resume voice.
- Do not write in a corporate brand voice.
- Do not write AI boilerplate such as:
  - `本文将带你`
  - `相信大家都知道`
  - `首先我们来了解一下`
  - `总之非常重要`
- Avoid empty conclusions. If a conclusion exists, it should close the loop on the problem discussed earlier.

## Images And Assets

- Put article images under `public/images/<slug>/`.
- The image directory name must exactly match the article slug without the `.md` suffix.
- Use lowercase ASCII filenames with hyphens or numbers, for example `pipeline-overview.png`.
- Do not use spaces, Chinese filenames, or random clipboard export names when avoidable.
- Reference images with absolute site paths such as `/images/<slug>/pipeline-overview.png`.
- Prefer meaningful alt text. If an image is only illustrative, explain its role in the surrounding paragraph.
- Keep assets reasonably compressed before commit. Do not add obviously oversized images if a smaller version will do.
- SVG diagrams can live in the same article image directory.
- Do not mix one article's assets into another article's image directory.

## Links And Maintenance

- Internal article links should use the final site route, for example `/posts/<slug>/`.
- When revising an article in a meaningful way, add or update `modDatetime`.
- When moving or renaming an article, update all internal links and image references in the same change.
- Do not leave placeholder text such as `TODO`, `待补`, or `稍后再写` in published content unless the user explicitly wants that.

## Pre-Completion Checklist

Before claiming a new article is complete, verify all of the following:

- The file is in `src/data/blog/<slug>.md`.
- Frontmatter fields are present, ordered, and valid.
- `description` is concise and readable.
- `tags` follow the rules above.
- `<!--more-->` exists.
- Headings start at `##` inside the body.
- Code fences have language identifiers.
- All images live under `public/images/<slug>/`.
- No emoji appear anywhere in the article or related asset names.
- Internal links use `/posts/<slug>/` style paths.
- Run `pnpm build` after adding or substantially revising an article, then check that the build passes before saying the work is done.
