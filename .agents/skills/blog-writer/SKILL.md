---
name: blog-writer
description: Use when writing new blog posts, drafting technical articles, or creating tutorials for this Astro blog project. Triggers when user asks to write, draft, or create blog content.
---

# Blog Writer

Write blog posts for this Astro + AstroPaper blog that require human review before publishing.

## Workflow

```
User request → Read AGENTS.md → Draft article → [Optional: image search] → Human review
```

**ALWAYS read AGENTS.md first** — it contains all formatting rules, tag conventions, and writing guidelines.

## Core Rules (Non-Negotiable)

1. **Human review required** — never claim the article is "done" or "ready to publish"
2. **File path**: `src/data/blog/<slug>.md` (lowercase kebab-case, no Chinese/space)
3. **Image path**: `public/images/<slug>/filename.png`
4. **Read AGENTS.md** for: frontmatter fields, tag list, writing style, heading rules

## Writing Style

- Chinese body text, English for technical terms
- Start with 1-3 short paragraphs explaining context/problem
- Insert `<!--more-->` after opening section
- Body starts at `##` (not `#` — title comes from frontmatter)
- No AI boilerplate: avoid "本文将带你", "相信大家都知道", "首先我们来了解一下"

## Images

### User-Provided Images
If user mentions or provides images:
- Save to `public/images/<slug>/descriptive-name.png`
- Reference: `![具体描述](/images/<slug>/filename.png)`
- Alt text must be descriptive, not "图片" or "screenshot"

### Placeholder Images
If an image would help but user hasn't provided one:
```markdown
<!-- TODO: 图片占位 - 描述需要什么样的图 -->
![图片描述占位符](/images/<slug>/placeholder-note.png)
<!-- 可选：建议使用氛围图展示XX概念 -->
```

### Optional: Atmosphere Images (PEXELS/PIXABAY)
If atmosphere/enhancement images would add value AND environment has API keys:

```bash
# Check for API keys
PEXELS_API_KEY  # available in ~/.custom-envs
PIXABAY_API_KEY # available in ~/.custom-envs
```

Search workflow:
1. Identify image need from article context
2. Search with English keywords (better results)
3. Download and save to `public/images/<slug>/`
4. Reference with descriptive alt text

**Skip if no API keys** — images are optional enhancements.

## Draft Handoff

When draft is complete, output:

```markdown
## Draft Complete

**File**: `src/data/blog/<slug>.md`
**Images**: `public/images/<slug>/` (X files)

**Review checklist**:
- [ ] Title and description match content
- [ ] Tags are appropriate
- [ ] All images have meaningful alt text
- [ ] No placeholder text remains
- [ ] `<!--more-->` placed correctly
- [ ] Run `pnpm build` to verify

**Draft content**:
<full markdown content>
```

## What NOT To Do

- Don't write "ready to publish" — always require human review
- Don't duplicate AGENTS.md content here — reference it
- Don't use emoji in titles, headings, or filenames
- Don't claim completion without showing full draft for review
