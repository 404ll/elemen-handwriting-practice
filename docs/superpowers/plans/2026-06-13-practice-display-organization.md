# Practice Display Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the blog practice display so it uses manifest groups, renders source first, renders optional article notes second, and never displays prompt content.

**Architecture:** The practice repository remains the content source. The blog loader becomes the single boundary that parses `manifest.json`, source files, and optional `article.md`, while React components render the group-aware Wiki sidebar and source-first detail page.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner, Zod, Shiki.

---

## File Structure

- Modify `/Users/elemen/Myself/Elemen-blog/lib/practice/schema.ts` to accept `groups`, `groupId`, and optional `article`.
- Modify `/Users/elemen/Myself/Elemen-blog/lib/practice/types.ts` to model groups and notes.
- Modify `/Users/elemen/Myself/Elemen-blog/lib/practice/loader.ts` to expose group-aware ordering and read `article.md`, not `prompt.md`.
- Modify `/Users/elemen/Myself/Elemen-blog/lib/practice/categories.ts` only as a legacy fallback for old `category` values.
- Modify `/Users/elemen/Myself/Elemen-blog/components/practice/PracticeSidebar.tsx` to render groups supplied by the loader.
- Modify `/Users/elemen/Myself/Elemen-blog/app/(site)/practice/layout.tsx` if needed to pass group data into the sidebar.
- Modify `/Users/elemen/Myself/Elemen-blog/app/(site)/practice/[id]/page.tsx` to render source first and notes second.
- Modify `/Users/elemen/Myself/Elemen-blog/tests/fixtures/practice/manifest.json` and fixture files to cover groups, article, and prompt exclusion.
- Modify `/Users/elemen/Myself/Elemen-blog/tests/practice.test.ts` to verify the new loader behavior.

## Tasks

### Task 1: Loader Schema and Group Model

**Files:**
- Modify: `/Users/elemen/Myself/Elemen-blog/tests/practice.test.ts`
- Modify: `/Users/elemen/Myself/Elemen-blog/tests/fixtures/practice/manifest.json`
- Create: `/Users/elemen/Myself/Elemen-blog/tests/fixtures/practice/problems/debounce/code.js`
- Create: `/Users/elemen/Myself/Elemen-blog/tests/fixtures/practice/problems/debounce/article.md`
- Create: `/Users/elemen/Myself/Elemen-blog/tests/fixtures/practice/problems/debounce/prompt.md`
- Modify: `/Users/elemen/Myself/Elemen-blog/lib/practice/schema.ts`
- Modify: `/Users/elemen/Myself/Elemen-blog/lib/practice/types.ts`
- Modify: `/Users/elemen/Myself/Elemen-blog/lib/practice/loader.ts`

- [ ] **Step 1: Add failing loader tests**

Add tests that assert:

```ts
const manifest = loadManifest(fixtureRoot);
assert.equal(manifest.groups.length, 2);
assert.equal(manifest.problems[1].groupId, "async");

const groups = getPracticeGroups(fixtureRoot);
assert.deepEqual(groups.map((g) => g.id), ["array", "async"]);

const debounce = getProblemById("debounce", fixtureRoot);
assert.ok(debounce);
assert.match(debounce!.note ?? "", /Visible note/);
assert.doesNotMatch(debounce!.note ?? "", /Hidden prompt/);
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm test`

Expected: FAIL because `groups`, `groupId`, `article`, `getPracticeGroups`, and `note` are not implemented.

- [ ] **Step 3: Implement schema, types, and loader**

Implement:

- `PracticeGroup`
- optional `groupId`
- optional `article`
- optional `note`
- `getPracticeGroups(rootDir?)`
- group-aware `getAllProblems(rootDir?)`
- `getProblemById()` reading article notes and ignoring prompt files

- [ ] **Step 4: Run tests and verify pass**

Run: `pnpm test`

Expected: PASS.

### Task 2: Sidebar and Detail Rendering

**Files:**
- Modify: `/Users/elemen/Myself/Elemen-blog/components/practice/PracticeSidebar.tsx`
- Modify: `/Users/elemen/Myself/Elemen-blog/app/(site)/practice/layout.tsx`
- Modify: `/Users/elemen/Myself/Elemen-blog/app/(site)/practice/[id]/page.tsx`

- [ ] **Step 1: Compile current UI assumptions**

Run: `pnpm typecheck`

Expected before implementation: FAIL or PASS is acceptable; record current output.

- [ ] **Step 2: Update sidebar props and rendering**

Change sidebar to accept loader-produced groups and render by `group.id`, `group.title`, `group.description`, and `group.items`.

- [ ] **Step 3: Update detail page content order**

Render sections in this order:

1. `源码练习`
2. Shiki code block and copy button
3. optional `笔记记录` from `problem.note`
4. previous/next navigation

Remove all `problem.prompt` rendering.

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`

Expected: PASS.

### Task 3: Build Verification and Practice Content Cleanup

**Files:**
- Modify as needed: `/Users/elemen/Myself/learn/pracitice/manifest.json`
- Delete or ignore: `/Users/elemen/Myself/learn/pracitice/problems/debounce/prompt.md`

- [ ] **Step 1: Verify practice manifest references**

Run a Node check that all `entry` and optional `article` paths exist.

Expected: PASS.

- [ ] **Step 2: Build blog**

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 3: Commit changes**

Commit practice repo changes separately from blog repo changes where possible.
