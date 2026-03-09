# AstroPaper 博客开发文档

本文档描述项目的架构设计、开发流程、内容管理规范以及部署配置。

---

## 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [目录结构](#目录结构)
- [环境配置](#环境配置)
- [本地开发](#本地开发)
- [内容管理](#内容管理)
- [配置说明](#配置说明)
- [样式定制](#样式定制)
- [部署流程](#部署流程)
- [工程命令](#工程命令)

---

## 项目概述

本项目基于 AstroPaper 主题构建，是一个基于 Astro 框架的静态博客系统。系统采用 SSG（Static Site Generation）模式，具备以下技术特性：

- TypeScript 类型安全的内容管理
- 响应式设计与无障碍访问支持
- SEO 优化与结构化数据
- 明暗主题切换
- Pagefind 全文搜索
- LaTeX 数学公式渲染
- 自动生成 Sitemap 与 RSS 订阅

---

## 技术架构

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 5.x | 静态站点生成框架 |
| TypeScript | 5.x | 类型检查 |
| Tailwind CSS | 4.x | 样式系统 |

### 关键依赖

| 依赖 | 用途 |
|------|------|
| @astrojs/sitemap | 站点地图生成 |
| @astrojs/rss | RSS 订阅源生成 |
| remark-math / rehype-katex | 数学公式渲染 |
| remark-toc | 目录自动生成 |
| pagefind | 静态全文搜索索引 |
| sharp / satori | OG 图片处理 |

---

## 目录结构

```
blog/
├── public/                          # 静态资源目录
│   ├── favicon.svg                  # 站点图标
│   ├── astropaper-og.jpg            # 默认社交分享预览图
│   └── pagefind/                    # 搜索索引（构建时生成）
│
├── src/
│   ├── assets/                      # 需要构建处理的资源
│   │   ├── icons/                   # SVG 图标组件
│   │   └── images/                  # 图片资源
│   │
│   ├── components/                  # Astro 组件
│   │
│   ├── data/
│   │   └── blog/                    # 博客文章存储目录
│   │       └── *.md                 # Markdown 文章文件
│   │
│   ├── layouts/                     # 页面布局模板
│   │
│   ├── pages/                       # 路由页面
│   │   ├── index.astro              # 首页
│   │   ├── 404.astro                # 404 页面
│   │   ├── search.astro             # 搜索页面
│   │   ├── archives/                # 归档页面
│   │   ├── posts/                   # 文章列表与详情
│   │   └── tags/                    # 标签聚合页面
│   │
│   ├── scripts/                     # 客户端脚本
│   │
│   ├── styles/
│   │   ├── global.css               # 全局样式与主题变量
│   │   └── typography.css           # 排版样式
│   │
│   ├── utils/                       # 工具函数
│   │
│   ├── config.ts                    # 站点配置文件
│   ├── constants.ts                 # 常量定义（社交链接等）
│   └── content.config.ts            # 内容集合 Schema 定义
│
├── astro.config.ts                  # Astro 框架配置
├── package.json                     # 项目依赖与脚本
├── tsconfig.json                    # TypeScript 配置
└── eslint.config.js                 # ESLint 配置
```

---

## 环境配置

### 系统要求

- Node.js >= 18.14.1
- pnpm >= 8.x（推荐）或 npm >= 9.x

### 环境变量

项目支持以下环境变量配置：

| 变量名 | 说明 | 必填 |
|--------|------|------|
| PUBLIC_GOOGLE_SITE_VERIFICATION | Google 站点验证码 | 否 |

创建 `.env` 文件：

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

---

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

服务启动后访问 `http://localhost:4321`。

### 构建生产版本

```bash
pnpm run build
```

构建产物输出至 `./dist/` 目录。

### 预览构建结果

```bash
pnpm run preview
```

---

## 内容管理

### 文章存储位置

所有博客文章存放于 `src/data/blog/` 目录，支持子目录分类。

### 文件命名规范

- 使用小写字母
- 单词间以连字符分隔
- 示例：`getting-started-with-astro.md`、`tech/vue-composition-api.md`

### Frontmatter Schema

每篇文章必须包含以下 YAML 格式的元数据：

```yaml
---
pubDatetime: 2026-03-08T10:00:00+08:00  # 发布时间（必填）
title: "文章标题"                         # 文章标题（必填）
description: "文章描述，用于 SEO"         # 描述（必填）
author: "作者名"                          # 作者（可选，默认使用全局配置）
modDatetime: 2026-03-08T12:00:00+08:00  # 修改时间（可选）
featured: false                          # 是否精选（可选，默认 false）
draft: false                             # 是否草稿（可选，默认 false）
tags:                                    # 标签（可选，默认 ["others"]）
  - "Astro"
  - "教程"
ogImage: "/images/custom-og.jpg"         # 自定义 OG 图片（可选）
canonicalURL: "https://example.com/post" # 规范 URL（可选）
hideEditPost: false                      # 隐藏编辑按钮（可选）
timezone: "Asia/Shanghai"                # 时区覆盖（可选）
---
```

### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| pubDatetime | Date | 是 | - | ISO 8601 格式的发布时间 |
| title | string | 是 | - | 文章标题 |
| description | string | 是 | - | 文章描述，用于 SEO meta 标签 |
| author | string | 否 | config.author | 作者名称 |
| modDatetime | Date | 否 | null | 最后修改时间 |
| featured | boolean | 否 | false | 是否在首页精选展示 |
| draft | boolean | 否 | false | 草稿标记，true 时不在生产构建中发布 |
| tags | string[] | 否 | ["others"] | 文章标签 |
| ogImage | string \| Image | 否 | - | Open Graph 分享图片 |
| canonicalURL | string | 否 | - | 规范化 URL |
| hideEditPost | boolean | 否 | false | 是否隐藏"编辑此页"按钮 |
| timezone | string | 否 | config.timezone | 时区设置 |

### 文章示例

创建文件 `src/data/blog/hello-world.md`：

```markdown
---
pubDatetime: 2026-03-08T10:00:00+08:00
title: "Hello World"
description: "第一篇博客文章，介绍博客系统的基本功能。"
author: "Admin"
tags:
  - "随笔"
---

## 欢迎

这是正文内容。

### 代码示例

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

### 目录生成

在文章中插入 `[[toc]]` 可自动生成目录。
```

### 草稿管理

设置 `draft: true` 的文章在执行 `pnpm run build` 时不会被包含在生产构建中，适合保存未完成的内容。

---

## 配置说明

### 站点配置 (src/config.ts)

```typescript
export const SITE = {
  // 站点信息
  website: "https://your-site.netlify.app/",  // 生产环境域名
  title: "我的博客",                           // 站点标题
  author: "你的名字",                          // 默认作者
  desc: "站点描述",                            // 站点描述
  profile: "https://github.com/your-name",    // 个人主页

  // 显示配置
  ogImage: "astropaper-og.jpg",               // 默认 OG 图片
  lightAndDarkMode: true,                     // 明暗主题切换
  postPerIndex: 4,                            // 首页文章数
  postPerPage: 4,                             // 分页每页文章数
  showArchives: true,                         // 显示归档页面
  showBackButton: true,                       // 文章页返回按钮

  // 功能配置
  scheduledPostMargin: 15 * 60 * 1000,        // 定时发布容差（毫秒）
  dynamicOgImage: false,                      // 动态 OG 图片生成
  editPost: {
    enabled: true,
    text: "编辑此页",
    url: "https://github.com/your-name/your-repo/edit/main/",
  },

  // 国际化
  dir: "ltr",                                 // 文字方向
  lang: "zh-CN",                              // HTML lang 属性
  timezone: "Asia/Shanghai",                  // 默认时区
} as const;
```

### 社交链接配置 (src/constants.ts)

`SOCIALS` 数组定义页脚显示的社交链接：

```typescript
export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/your-name",
    linkTitle: `${SITE.title} 的 GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Mail",
    href: "mailto:your@email.com",
    linkTitle: `联系 ${SITE.author}`,
    icon: IconMail,
  },
  // 移除不需要的链接
];
```

### Astro 配置 (astro.config.ts)

关键配置项说明：

```typescript
export default defineConfig({
  site: SITE.website,           // 站点 URL（必填，用于 sitemap）
  integrations: [sitemap()],    // 集成插件
  markdown: {
    remarkPlugins: [remarkMath, remarkToc],  // Markdown 插件
    rehypePlugins: [rehypeKatex],             // HTML 转换插件
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },  // 代码高亮主题
    },
  },
});
```

---

## 样式定制

### 主题色彩

编辑 `src/styles/global.css` 修改主题变量：

```css
:root,
html[data-theme="light"] {
  --background: #fdfdfd;    /* 背景色 */
  --foreground: #282728;    /* 前景色（文字） */
  --accent: #006cac;        /* 强调色 */
  --muted: #e6e6e6;         /* 次要色 */
  --border: #ece9e9;        /* 边框色 */
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #ab4b08;
}
```

### 字体配置

在 `global.css` 的 `@theme inline` 块中修改字体栈：

```css
@theme inline {
  --font-app:
    "Noto Sans SC",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    system-ui,
    sans-serif;
}
```

### 静态资源替换

| 文件 | 用途 | 推荐规格 |
|------|------|----------|
| public/favicon.svg | 站点图标 | SVG 格式 |
| public/astropaper-og.jpg | 社交分享预览图 | 1200x630px |

---

## 部署流程

### Netlify 部署

#### 前置条件

- GitHub 账户
- Netlify 账户
- 代码已推送至 GitHub 仓库

#### 部署步骤

1. 登录 [Netlify](https://app.netlify.com/)

2. 点击 "Add new site" 选择 "Import an existing project"

3. 连接 GitHub 并选择仓库

4. 配置构建设置：

   | 配置项 | 值 |
   |--------|------|
   | Build command | `pnpm run build` |
   | Publish directory | `dist` |

5. 点击 "Deploy site" 开始部署

6. 部署完成后，在 Site settings 中配置自定义域名（可选）

#### 配置站点域名

部署后更新 `src/config.ts`：

```typescript
export const SITE = {
  website: "https://your-site-name.netlify.app/",  // Netlify 默认域名
  // 或自定义域名
  // website: "https://your-domain.com/",
  // ...
};
```

#### 环境变量配置

在 Netlify 控制台的 Site settings > Environment variables 中添加：

| Key | Value |
|-----|-------|
| PUBLIC_GOOGLE_SITE_VERIFICATION | Google 站点验证码（如需） |

#### 持续部署

Netlify 自动监听仓库的 main 分支，每次推送代码将自动触发重新部署。

### 构建输出

构建产物目录结构：

```
dist/
├── index.html              # 首页
├── posts/                  # 文章页面
├── tags/                   # 标签页面
├── archives/               # 归档页面
├── rss.xml                 # RSS 订阅源
├── sitemap-index.xml       # 站点地图
├── pagefind/               # 搜索索引
└── _astro/                 # 静态资源（CSS/JS）
```

---

## 工程命令

### 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm run dev` | 启动开发服务器（热重载） |
| `pnpm run build` | 构建生产版本 |
| `pnpm run preview` | 本地预览构建结果 |
| `pnpm run sync` | 生成 Astro 类型定义 |

### 代码质量

| 命令 | 说明 |
|------|------|
| `pnpm run lint` | ESLint 代码检查 |
| `pnpm run format` | Prettier 格式化代码 |
| `pnpm run format:check` | 检查代码格式 |

---

## 附录

### 相关文档

- [Astro 官方文档](https://docs.astro.build/)
- [AstroPaper 主题文档](https://astro-paper.pages.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Netlify 文档](https://docs.netlify.com/)

### 内容集合 Schema 定义

完整 Schema 定义位于 `src/content.config.ts`：

```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});
```

以 `_` 开头的 Markdown 文件将被忽略，不会作为文章发布。
