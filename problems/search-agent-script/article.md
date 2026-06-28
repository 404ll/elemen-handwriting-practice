# Search Agent Script 工作展示

## 场景

这个项目是一个用于学习“搜索代理”工作流的 TypeScript 脚本项目。

它围绕一个具体场景展开：从 Twitter/X 搜索内容，筛选出可能有价值的帖子，再交给 AI 分析并提取可复用的 prompt。项目重点不是做一个完整产品，而是把一条真实的数据处理链路拆成容易阅读、调试和扩展的小模块。

项目地址：[search-agent-script](https://github.com/404ll/search-agent-script)

## 我做了什么

- 把“搜索 → 标准化 → 过滤 → AI 分析 → 结构化输出”的主链路拆成独立模块。
- 用 `TwitterPost`、`AnalysisResult`、`PromptRecord` 三层类型约束数据流，避免外部 API 响应直接污染业务逻辑。
- 在调用 AI 前先用确定性规则过滤无效内容，减少请求成本，也降低 AI 输出波动。
- 用 Zod 校验 AI 返回的 JSON 结构，让 AI 输出从“文本结果”变成可验证的数据。
- 保存 `raw.json` 和 `prompts.json` 两类中间产物，让采集和分析可以分开调试。

## 核心流程

```text
搜索 Twitter/X
  ↓
标准化帖子数据
  ↓
去重和基础过滤
  ↓
AI 结构化分析
  ↓
生成 PromptRecord
  ↓
保存 JSON 文件
```

对应到模块：

```text
scripts/search-twitter-prompts.ts
  ↓ 调用
src/twitter.ts
  ↓ 输出 TwitterPost[]
src/filter.ts
  ↓ 输出 filtered TwitterPost[]
src/ai.ts
  ↓ 输出 Map<postId, AnalysisResult>
src/prompt-record.ts
  ↓ 输出 PromptRecord[]
src/output.ts
  ↓ 保存 raw.json / prompts.json
```

## 数据流

项目里最重要的是三层数据模型：

```text
Twitter API 原始响应
  ↓ normalizeSearchResponse
TwitterPost
  ↓ analyzeTweetsWithAI
AnalysisResult
  ↓ buildPromptRecord
PromptRecord
  ↓ saveJsonFile
prompts.json
```

这层拆分的价值在于：外部接口、AI 输出和最终业务产物不会混在一起。

- `TwitterPost`：屏蔽 Twitter/X 原始响应结构，只保留后续分析需要的字段。
- `AnalysisResult`：约束 AI 返回的结构化分析结果。
- `PromptRecord`：最终要保存和复用的 prompt 记录。

## 模块拆分

`scripts/search-twitter-prompts.ts` 是命令行入口，只负责编排流程，不承载复杂业务判断。

`src/twitter.ts` 负责调用 Twitter/X Search API，并把原始响应标准化成 `TwitterPost`。这里处理了作者信息、媒体信息、指标数据和帖子链接。

`src/filter.ts` 负责确定性过滤，包括去重、空文本、无媒体和广告关键词过滤。这里的设计重点是：不要把所有判断都交给 AI。

`src/ai.ts` 负责 OpenAI-compatible Chat Completions 调用、系统 Prompt、批量并发和 Zod 结构校验。AI 返回内容必须先通过 `AnalysisSchema.parse(...)`。

`src/prompt-record.ts` 负责把 AI 分析结果转换成最终产物，并再次检查相关性、质量分、内容长度和媒体存在性。

`src/output.ts` 负责读写 JSON 文件，让采集结果和分析结果可以落盘复用。

## 技术难点

### 1. 外部 API 数据不能直接进入业务链路

Twitter/X 的响应结构包含 `data`、`includes.users`、`includes.media` 等多块信息。如果后续模块直接依赖原始响应，代码会很难读，也很难测试。

所以项目先做了一层标准化：

```text
XSearchResponse -> TwitterPost
```

后续过滤、AI 分析、产物生成都只依赖 `TwitterPost`。

### 2. AI 前置过滤要用确定性规则

项目没有把所有帖子都交给 AI 判断，而是先用规则排除明显无效内容：

- 正文太短
- 没有媒体
- 广告或推广内容
- 重复帖子

这样能减少 AI 请求成本，也能让后面的分析输入更干净。

### 3. AI 输出必须结构化校验

AI 返回 JSON 并不等于它一定可信。

项目用 Zod 定义 `AnalysisSchema`，对字段类型、语言枚举和质量分范围做校验。只要 AI 返回结构不符合预期，流程就会直接失败，而不是把脏数据继续写入结果文件。

### 4. 采集和分析需要解耦

第一次搜索会保存：

```text
output/YYYY-MM-DD/HHMMSS-raw.json
```

之后可以用 `--raw` 重新分析这份数据：

```bash
npm run search -- \
  --raw output/2026-06-26/123456-raw.json \
  --model "gpt-image-2"
```

这让 Prompt、Schema、过滤规则可以反复调整，而不用每次都重新请求 Twitter/X。

## 代码

主流程可以压缩成这段伪代码：

```ts
const posts = rawFile
  ? loadJsonFile<TwitterPost[]>(rawFile)
  : await twitter.search({ query, limit, language });

const filteredPosts = dedupePosts(posts)
  .filter((post) => basicFilter(post, stats));

saveJsonFile(rawFile, filteredPosts);

const analyses = await analyzeTweetsWithAI(filteredPosts, aiClient, {
  targetModel,
  aiModel,
  batchSize,
  concurrency,
});

const prompts = filteredPosts
  .map((post) => buildPromptRecord(post, analyses.get(post.id), targetModel))
  .filter(Boolean);

saveJsonFile(promptsFile, prompts);
```

这段代码背后的关键点不是“会调用 API”，而是把一条复杂链路拆成了可替换的阶段。

## 记一下

这个项目最值得展示的点是：它把一个容易写成大脚本的任务，拆成了清晰的数据管道。

外部 API 负责采集，规则过滤负责低成本清洗，AI 负责语义判断，Zod 负责结果校验，`PromptRecord` 负责最终产物。每一层都有自己的输入输出，后续要替换搜索源、调整过滤规则、换模型或改输出格式，都不需要重写整条链路。

如果面试时讲这个项目，可以用一句话概括：

> 我做的是一个搜索 Agent 的学习型数据管道，把 Twitter/X 搜索结果先标准化和过滤，再交给 AI 做结构化分析，最后生成可复用的 prompt 记录；核心设计是把外部采集、规则清洗、AI 判断和结果落盘解耦，保证链路可调试、可验证、可复用。
