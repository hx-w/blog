---
name: writer
description: 为 Carol's Blog (Astro + AstroPaper) 撰写博客文章。当用户需要写新文章、起草博客、创建技术教程、记录项目开发日志、或写个人随笔时使用此 skill。覆盖：Markdown frontmatter 规范、文件命名、图片管理、写作风格、中英混排规则。
---

# 博客写作指南

## 创建文章

### 文件

- 路径：`src/data/blog/<slug>.md`
- 命名：小写字母 + 连字符，如 `garmin-watchface-dev.md`
- 以 `_` 开头的文件会被忽略，不发布

### Frontmatter

```yaml
---
pubDatetime: 2026-03-16T10:00:00+08:00  # 必填，ISO 8601 + 时区
title: "文章标题"                         # 必填
description: "50-150字的摘要，用于SEO"    # 必填
author: "Carol"                          # 可选，默认 Carol
tags:                                    # 可选，默认 ["others"]
  - "tutorial"
draft: false                             # true 则不发布
featured: false                          # true 则首页精选
modDatetime: null                        # 修改时间，可选
---
```

**常用 tags**（小写，1-2 个）：`tutorial`, `algorithm`, `graphics`, `game-dev`, `tools`, `note`, `life`, `dental-tech`, `startup`

**description 写法**：直接概括文章核心内容和关键词，不用 markdown 语法。
示例：`"以开源项目Segment34为例，系统介绍Garmin表盘开发的全流程：Monkey C语言、Connect IQ SDK、项目结构。"`

## 写作风格

### 语言

- 正文用中文，技术术语、专有名词、代码标识符用英文原文
- 不翻译：框架名 (Astro, React)、API 名 (`makeWebRequest`)、文件路径、类名
- 格式：`中文描述 **English Term** 中文继续`
- 代码注释可中英混用，变量名英文

### 语气

| 类型 | 语气 | 示例 |
|------|------|------|
| 技术教程 | 专业但有亲和力，先讲 why 再讲 how | "要理解该算法，我们需要先掌握…" |
| 项目记录 | 带时间线的开发日志，穿插技术决策 | "2024-03-01 完成了基础框架搭建…" |
| 个人随笔 | 第一人称、内省、真诚 | "我能感觉到会有很多困难在等着我" |

### 结构模板

**技术文章**：
```
## 开头段（动机/问题/故事引入）
## 背景知识（理论、定义）
## 核心内容（实现、分析、步骤）
### 子章节（按逻辑递进拆分）
## 小结（要点回顾 + 下一步建议）
## 参考资料（markdown 链接列表）
```

**项目记录**：
```
## 项目介绍（是什么、解决什么问题）
## 技术选型
## 开发日志（按时间）
### YYYY-MM-DD 阶段标题
## 总结与展望
```

**个人随笔**：自由结构，H2 分段即可，不需要参考资料。

### 标题层级

- H2 (`##`) 主章节
- H3 (`###`) 子章节
- H4 (`####`) 细节/时间线条目
- 不用 H1（页面标题由 frontmatter `title` 生成）

## 图片

### 存放路径

```
public/images/<post-slug>/<descriptive-name>.<ext>
```

示例：`/images/garmin-watchface-dev/segment34-screenshot.png`

### 引用方式

```markdown
![描述性中文 alt text](/images/post-slug/filename.png)
```

alt text 要具体：`"IEEE 754 单精度浮点数位布局"` 而非 `"图片"`

### 图片来源策略

| 类型 | 来源 | 说明 |
|------|------|------|
| 氛围图/封面图 | Unsplash | 搜索相关英文关键词，下载后存入 images 目录 |
| 技术截图 | 用户自行截取 | 实际运行效果、IDE 界面、命令行输出 |
| 架构图/流程图 | 工具生成 | draw.io、Mermaid、或 SVG 手绘 |
| 数学图示 | 工具生成 | 优先 SVG 格式，清晰可缩放 |
| 项目 logo/品牌图 | 用户提供 | 不擅自使用他人品牌素材 |

如果用户未提供具体语义图片，提醒用户准备，不要用占位图发布。

### 格式偏好

- 截图/照片：PNG
- 技术图解/示意图：SVG（优先）
- 照片类大图：JPG

## 特殊语法

### 数学公式

行内：`$E = mc^2$`
块级：
```
$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

### 目录

在文章中插入 `## Table of contents` 会自动生成目录（由 remark-toc 处理）。

### 代码块

````markdown
```typescript
// 指定语言，使用真实项目代码而非伪代码
const result = await fetch(url);
```
````

支持的语言：typescript, javascript, python, c, cpp, bash, xml, json, yaml, css, html 等。

## 检查清单

发布前确认：
- [ ] frontmatter 三个必填字段完整（pubDatetime, title, description）
- [ ] 时区为 `+08:00`
- [ ] slug（文件名）简洁、无中文、无空格
- [ ] tags 使用现有标签或合理新增
- [ ] 图片路径正确，alt text 有意义
- [ ] draft 设为 false（确认发布时）
- [ ] 无 H1 标题（由框架自动生成）
- [ ] 参考资料链接可访问
