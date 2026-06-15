# elemen-handwriting-practice

前端手写题题库，通过 git submodule 挂载到 [Elemen-blog](https://github.com/404ll/Elemen-blog) 的 `practice/`。

- `manifest.json` — 题目索引和分组元数据
- `problems/<id>/code.js` / `problems/<id>/code.jsx` — 参考实现源码
- `problems/<id>/article.md` — 笔记记录、场景说明与组件片段（可选）

## 自动同步到博客（推荐）

`push` 到本仓库 `main` 后，GitHub Action 会给博客仓开一个 PR，更新子模块指针。合并 PR 后 Vercel 部署，线上 `/practice` 即更新。

### 一次性配置

1. 打开 [GitHub PAT](https://github.com/settings/tokens)（Fine-grained 或 Classic 均可）
2. 权限需包含对 **`404ll/Elemen-blog`** 的：
   - Contents: Read and write
   - Pull requests: Read and write
3. 在本仓库 **Settings → Secrets and variables → Actions** 新建：
   - 名称：`BLOG_REPO_TOKEN`
   - 值：上一步生成的 token
4. 在本仓库 **Actions** 页可手动运行 **Sync blog practice submodule** 试一次

### 日常流程

```text
改 `problems/`、`manifest.json` 或 `article.md` → `git push origin main`
  → 博客仓出现 PR → 合并 → Vercel 部署
```

## 手动同步（未配置 Secret 时）

在博客仓库根目录：

```bash
pnpm practice:sync
git commit -m "chore: bump practice submodule"
git push
```
