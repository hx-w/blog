---
title: 改造Memos，用 Fragments Skill 管理我的思维碎片
pubDatetime: 2026-03-27T13:00:00.000Z
description: "将 Memos 改造为支持 daily log 和 MCP，通过 Fragments skill 让 AI agent 自动记录和消费想法与工作日志。"
tags: ["tools", "life"]
draft: false
---

灵感该记在哪个 App、用什么格式以及打什么标签 这些问题本身就是认知负担。创业时最痛苦的不是没想法，而是想法太多却留不住——走路时冒出的灵感、聊天中做的决策、随手记下的待办，它们散落在不同的地方，等需要时已经找不回来。

我要的很简单：说出来，AI 帮我存好；需要时，AI 帮我找到。记录应该是对话的副产品，不是需要"管理"的任务。

于是我把 usememos/memos 改造了一番，新增了 daily log（John Carmack 的 .plan 改版），支持了 MCP，又在 deepshape-ai/ai-marketplace 里写了 fragments skill，让 opencode、claude code、openclaw 这些 AI harness 自动具备了索引、语义感知、汇总 daily log 和 memo 的能力。现在记录和消费都通过 AI 完成，日常生活和工作有了一个统一的入口。

<!--more-->

## 从 .plan 到 Daily Log

John Carmack 在 id Software 时期有一个著名的习惯：[写 .plan 文件](https://garbagecollected.org/2017/10/24/the-carmack-plan/)。每天更新一个纯文本文件，记录做了什么、打算做什么、遇到了什么问题。这个习惯的核心价值不是存档，而是低摩擦的思考和轻量级的透明度。**想写就写，格式简单，团队成员随时能看**。

节选自他的片段：

```text
[idsoftware.com]
Login name: johnc In real life: John Carmack
Directory: /raid/nardo/johnc Shell: /bin/csh
Never logged in.
Plan:

This is my daily work ...

When I accomplish something, I write a * line that day.

Whenever a bug / missing feature is mentioned during the day and
I don’t fix it, I make a note of it. Some things get noted many times
before they get fixed.

Occasionally I go back through the old notes and mark with a +
the things I have since fixed.

--- John Carmack

= feb 18 ===================================
* page flip crap
* stretch console
* faster swimming speed
* damage direction protocol
* armor color flash
* gib death
* grenade tweaking
* brightened alias models
* nail gun lag
* dedicated server quit at game end
+ scoreboard
+ optional full size
+ view centering key
+ vid mode 15 crap
+ change ammo box on sbar
+ allow “restart” after a program error
+ respawn blood trail?
+ -1 ammo value on rockets
+ light up characters
```

我想要的是同样的东西，但适配 AI 时代的工作方式。纯文本文件太孤立，搜索引擎够不着，AI 读不了，更没法跟其他记录产生关联。所以我选择在 Memos 上实现 daily log。

[Memos](https://github.com/usememos/memos) 本身是一个轻量的 memo 系统，支持 markdown、标签、搜索。我从几年前开始就在使用。

> 很有趣的是，他们这个仓库的分支只有一个，但是还是在多人积极维护的状态。

我在它的 0.26.3 stable 分支基础上做了三件事：

1. **新增 daily log 数据类型**：每个用户每天只能有一条 log，服务端强制约束。内容格式采用 .plan 风格，每行以 `* `（完成）、`+ `（待办）、`- `（笔记）、`? `（问题）开头。只有当天可编辑，36 小时后锁定。

2. **支持 MCP（Model Context Protocol）**：MCP 让 AI agent 能直接调用 Memos 的 API，不需要我手动粘贴内容到某个聊天框。写 daily log、查 memo、搜索历史，全部通过 MCP 工具完成。

3. **Daily log 引用 memo**：当某条记录需要展开时，先创建一个 memo，再在 daily log 里引用 `see memos/{uid}`。这样 daily log 保持简洁，细节又有地方放。

改造过程几乎全靠 AI。daily log 的 API 设计、数据库迁移、MCP 接口，大部分代码由 glm-5 完成。我做的更多是确认需求、审查输出、调整边界条件。这就是我理解的"AI 作为操作系统"的早期形态：有一个想法，描述给 AI，它帮你找到最接近的开源项目，然后改写成你要的样子。

效果：
![dailylog](/images/fragments-workflow/memo-dailylog.png)

## Fragments Skill: 给 Agent 装备记忆

有了支持 daily log 的 Memos，下一步是让 AI agent 知道怎么用它。这就是 fragments skill 的作用。

Fragments 是我在 [deepshape-ai/ai-marketplace](https://github.com/deepshape-ai/ai-marketplace) 里写的一个 skill，用于给 AI harness（opencode、claude code、openclaw）装备索引、语义感知、汇总的能力。

> 该skill在clawhub上同样也上传了一份

### 为什么不是文档或聊天记录

在决定自己造轮子之前，我比较过现有方案：

| 特性       | 文档工具     | IM聊天记录   | fragments    |
| ---------- | ------------ | ------------ | ------------ |
| 碎片化想法 | 需要组织结构 | 淹没在对话中 | 随手记录     |
| 随时记录   | 打开编辑器   | 要找群/人    | 直接说       |
| 有意义筛选 | 全靠手动     | 信息噪音大   | agent评估    |
| 语义检索   | 关键词匹配   | 弱           | TF-IDF + LSA |
| 结构化复盘 | 需要整理     | 分散         | `.plan`格式  |

文档工具要求完整的文章结构，一个念头不值得打开编辑器。聊天记录太嘈杂，真正有价值的想法会被"吃了吗"、"在吗"淹没。我需要的是：**碎片化捕获 + 语义检索 + 结构化复盘**，三者缺一不可。对我来说，最重要的是**无感知**——不需要切换上下文，不需要打开新窗口，想记就记。

### memo 模式：按需捕获

当我说"memo 这个想法"、"记一下"时，agent 会调用 `memos_create_memo` 创建一条 memo。它会自动提取 `#tag` 格式的标签，询问我可见性（默认 PRIVATE），确认后写入。如果内容很长，它会建议先创建 memo 再在 daily log 里引用。

### daily-log 模式：被动记录

这是更有意思的部分。我在 opencode 和 claude code 里配置了 hook：

```typescript
// opencode 的 plugin.ts
export default async function fragmentsHook({ client }: PluginInput) {
  return {
    "session.idle": async ({ messages }) => {
      if (!messages || messages.length < 3) return;
      const assistantMessages = messages.filter(m => m.role === "assistant");
      if (assistantMessages.length < 2) return;

      return {
        content:
          "Follow the fragments skill daily-log workflow: " +
          "(1) assess if meaningful work, " +
          "(2) call memos_get_daily_log, " +
          "(3) diff against existing, " +
          "(4) format in .plan style, " +
          "(5) ask for confirmation before saving.",
      };
    },
  };
}
```

当一个对话结束时（session.idle 或 Stop hook），agent 会评估这次对话是否做了有意义的工作。如果有，它会：

1. 获取当天的 daily log
2. 把本次对话的关键产出格式化为 .plan 行
3. 对比现有内容，跳过重复的
4. 展示合并后的完整内容，等我确认
5. 调用 `memos_save_daily_log` 保存

整个过程不需要我主动说"记录一下"。AI 在完成任务后自动问我："刚才做了 X、Y、Z，要不要记到今天的 log 里？"

### 语义搜索

Fragments 还提供了语义搜索能力。它用 TF-IDF + LSA（SVD 降维）做向量化和相似度计算。当我问"我之前有没有想过怎么处理用户认证"时，agent 会调用 `memos_search_memos`，然后可选地用本地的 `fragments_search.py` 脚本重排结果。这样很好的减少了在检索时memos和daily log的内容增加对agent上下文造成的负担。

这不是什么高深的 embedding 模型，但对于个人知识库的规模已经够用。而且完全本地运行，不依赖外部 API。

## 实际工作流

现在我的日常是这样的：

**早上打开 opencode 或 claude code**，问一句"昨天做了什么"。Agent 调用 `memos_get_daily_log`，把昨天的记录读出来。如果有待办事项，我继续推进。

**白天工作时**，有想法就随口说"memo 一下"。Agent 创建 memo，打上标签。如果想法值得跟进，我会在 agent 的协助下把它拆成 daily log 里的 `+ ` 行。

**每次完成一个任务**，agent 自动问我是否要记录。大多数时候我扫一眼确认就行。偶尔我会补充几句上下文。

**周末复盘时**，我问"这周在 X 项目上花了多少精力"，agent 会搜索 daily log 和 memo，汇总出一份周报草稿。

整个过程中，我没有打开过任何专门的笔记 App。所有记录发生在我和 AI 的对话里，而 AI 背后连接着 Memos 这个统一的存储。记录和消费使用同一个入口。

实际在opencode中的使用：

![opencode](/images/fragments-workflow/opencode-with-fragments.png)

### 一个真实的工作日志

这是我某天的 daily log（略有删减）：

```text
* 设计并实现 SCAD（语义约束解剖形变）模块
+ 用病例数据验证 SCAD 效果并调优参数
测试加密狗里是否有 dcm 的解码密钥
* scad 单元测试用例（暂一例）
? exocad 的静态 binary 中没有加密密钥
处理 1/4 牙列数据
+ 更新下 memos daily log 的 url markdown 渲染
```

`*` 标记完成的事，`+` 标记待办，`-` 标记笔记，`?` 标记问题。格式简单，但足够表达意图。更重要的是，这些都是 agent 在对话结束后自动提取的，不是我从头手写的。

## AI 作为操作系统

这个过程让我意识到一件事：AI 正在成为操作系统意义上的"入口"。

以前我的工作流是这样的：
- 想法 → 打开 Memos
- 长文 → 打开飞书文档
- 任务 → 打开备忘录
- 日程 → 打开日历
- 沟通 → 打开飞书/微信

每个 App 都是一个独立的入口，我需要记住什么事该去哪。

现在这些都变成了后端存储，前端只有一个聊天框。我不需要记住 Memos 的 URL，不需要打开飞书文档，不需要切换 App。我只需要告诉 AI，它会路由到正确的地方。

这不是说这些 App 会消失，而是它们的角色变了：从交互界面变成数据层。AI 成了统一的操作系统，我通过自然语言操作所有工具。

我用的是 opencode、claude code、openclaw，加上飞书里的 AI 机器人。它们都接了同一个 Memos 实例，都通过 MCP 读写。

这个转变带来的收益不是效率提升，而是**认知减负**。我不再需要维护多个系统的心智模型，不再需要为"这个记在哪"而中断思考。AI 帮我屏蔽了底层的复杂性，让我专注于思考本身。

**更重要的是，这个系统不止我一个人可以用，我们团队都可以使用。大家无缝通过Agent做为交互层，将想法和工作日志同步到Fragments中。这样既能记录下我们的工作成果，避免了周期性汇总的痛苦，又能大幅降低开会时沟通对齐的成本，因为别人做了什么事情，哪个项目推进到什么进度，直接看Fragments即可，在沟通前就已经同步好了90%的内容。这种高效的工作流程我认为是初创团队必须的。**

## 跨平台集成

不同 AI 工具的能力扩展方式各不相同：

| 能力层 | 本质                | Claude Code | OpenCode        | OpenClaw  |
| ------ | ------------------- | ----------- | --------------- | --------- |
| Skills | 渐进式上下文 prompt | 支持        | 支持            | 支持      |
| MCP    | 外部工具协议        | JSON 配置   | JSON 配置       | JSON 配置 |
| Hooks  | 事件拦截扩展        | JSON 定义   | TypeScript 插件 | 待实现    |

Fragments 的做法是将 MCP 配置、Hooks 定义、Skill prompt 统一打包，在安装时做环境检测和平台适配。凭证统一存放在 `~/.config/fragments.json`，各平台共享。切换 agent 工具时无需重复配置。

这套方案还不完美。各平台的 hooks 机制差异较大，Claude Code 用 JSON 定义，OpenCode 用 TypeScript 插件，OpenClaw 还在开发中。但至少 MCP 这层是统一的，核心的读写能力可以跨平台复用。语义搜索的精度有待提升，daily log 的格式约束偶尔会让我觉得不够灵活，跨 agent 的上下文同步也不是总能做到。

## 开发历程

这个系统的演进花了大概两周：

- **3 月 12 日**：完成第一版 memos + daily log 集成，发布 fragments skill
- **3 月 16 日**：修复 daily log 的 url markdown 渲染问题
- **3 月 22 日**：更新 memos，换了 logo，优化 daily log 使用体验
- **3 月 23 日**：fragments 适配 openclaw（mcp + hooks）

大部分改动是 glm-5 完成的。我主要负责产品定义、边界条件、代码审查。Daily log 的 API 设计、数据库迁移、MCP 接口，AI 写了 80% 以上的代码。

## 后续规划

当前系统还有几个明显短板：

1. **语义搜索精度**：TF-IDF + LSA 对于模糊查询的效果有限，后续考虑接入更好的 embedding 模型
2. **跨 agent 上下文同步**：在 opencode 里记录的想法，在 claude code 里不一定能无缝召回
3. **飞书集成**：日常工作中飞书是主要的沟通工具，但目前只支持主动交互，无法自动捕获对话中的想法。

下一步重点是接入飞书。这样日常对话中产生的想法也能被自动捕获，而不需要手动复制粘贴。

现在已经支持主动交互：

![install](/images/fragments-workflow/claw-install.png)

![weekly](/images/fragments-workflow/weekly.jpeg)

---

如果这套方案对你有启发，可以在 [deepshape-ai/memos](https://github.com/deepshape-ai/memos) 找到改造后的 Memos，在 [deepshape-ai/ai-marketplace](https://github.com/deepshape-ai/ai-marketplace) 找到 fragments skill。
