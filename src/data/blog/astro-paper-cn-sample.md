---
author: "你的名字"
pubDatetime: 2026-03-08T18:30:00+08:00
modDatetime: 2026-03-08T19:00:00+08:00
title: "Astro Paper 中文全特性示例"
featured: true
draft: false
tags:
  - "Astro"
  - "教程"
  - "LaTeX"
description: "用于验证 AstroPaper + Netlify + 数学公式 + 中文化标签 的示例文章。"
---

这是一篇用于验收的示例文章，覆盖本博客的常用能力：目录、代码、表格、引用、任务列表、图片、行内公式和块级公式。

## Table of contents

[[toc]]

## 1. 基础 Markdown

这是**加粗文本**、*斜体文本*、`行内代码`，以及一个外部链接：[Astro 官方文档](https://docs.astro.build/)。

> 这是一个引用块，可用于强调关键结论或备注信息。

## 2. 任务列表

- [x] 已完成 AstroPaper 初始化
- [x] 已完成中文化主要标签
- [x] 已完成 Netlify 部署配置
- [x] 已完成 LaTeX 数学公式支持

## 3. 代码块

```ts
interface PostMeta {
  title: string;
  tags: string[];
  featured?: boolean;
}

const samplePost: PostMeta = {
  title: "Astro Paper 中文全特性示例",
  tags: ["Astro", "LaTeX", "Netlify"],
  featured: true,
};

console.log(samplePost);
```

## 4. 表格

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 静态构建 | 已开启 | 通过 `astro build` 输出到 `dist/` |
| 搜索 | 已开启 | 使用 Pagefind 进行本地搜索 |
| 数学公式 | 已开启 | 通过 `remark-math` + `rehype-katex` |

## 5. 图片

![AstroPaper 预览图](/astropaper-og.jpg)

## 6. LaTeX 公式

行内公式示例：当 $a^2 + b^2 = c^2$ 时，直角三角形满足勾股定理。

块级公式示例：

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

再来一个常见公式：

$$
\mathrm{softmax}(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{n} e^{z_j}}
$$

## 7. 折叠内容

<details>
  <summary>点击展开</summary>
  这里可以放补充说明、注意事项或扩展阅读。
</details>

## 8. 小结

如果你能在页面中看到目录、代码高亮、表格样式、图片和公式渲染，说明这套博客流程已经跑通。
