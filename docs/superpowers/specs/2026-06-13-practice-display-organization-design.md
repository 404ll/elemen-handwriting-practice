# Practice Display Organization Design

## Context

The practice repository is the content source for the blog's `/practice` section. The blog currently renders a Wiki-like practice area from the `practice/` submodule, but the display layer still reads the older `category` field and `prompt.md`. This creates several problems:

- Newer manifest fields such as `groups` and `groupId` are not reflected in the blog UI.
- Topics like `EventEmitter` appear under compatibility categories instead of their intended groups.
- `debounce` renders prompt text as page content, even though prompts are not part of the desired reader-facing experience.
- `/practice` redirects straight to the newest problem, which makes the section feel like a detail page rather than a browsable exercise library.

The selected direction is **A: enhanced Wiki layout**. Keep the existing learning-oriented sidebar and detail view, but make the information architecture explicit and stable.

## Goals

- Make `/practice` feel like a structured exercise library, not a hidden list of individual pages.
- Render practice groups from `manifest.groups` and `problem.groupId`.
- Use each problem's source file as the primary content.
- Use `article.md` as the optional note record for scenarios, reasoning, component snippets, and implementation notes.
- Remove `prompt.md` from the blog display path.
- Keep the implementation compatible with the existing submodule workflow.

## Non-Goals

- Do not turn practice entries into regular blog posts.
- Do not introduce a full search/index page in this phase.
- Do not redesign the global blog navigation.
- Do not require every existing problem to have notes before it can be shown.

## Content Model

Each problem keeps the existing directory shape:

```text
problems/<id>/
  code.js | code.jsx      required source practice
  article.md              optional note record
```

`prompt.md` is not part of the display model. It may be deleted or kept locally as a generation helper, but the blog loader must not read or render it.

`manifest.json` remains the index source:

- `groups`: ordered practice sections, with `id`, `title`, `description`, and `order`.
- `problems`: individual exercises.
- `problem.groupId`: the display group used by the blog sidebar and breadcrumb.
- `problem.category`: legacy compatibility field only. It should not control the new blog grouping.
- `problem.entry`: source file path.
- `problem.article`: optional note file path. If omitted, the blog can still fall back to `problems/<id>/article.md` when it exists.

## Blog Display Design

The `/practice` section keeps the current two-column Wiki layout:

- Left sidebar on desktop.
- Drawer directory on mobile.
- Main detail area on the right.

Sidebar behavior:

- Show total problem count.
- Group problems by `manifest.groups`, ordered by `group.order`.
- Render group title and, when useful, a short description.
- Only render groups with at least one problem.
- Highlight the active problem.
- Strip the leading `手写 ` prefix in sidebar labels to keep the directory compact.

Detail page behavior:

1. Breadcrumb: `手写练习 / <group title> / <problem id>`.
2. Title, difficulty, tags, and GitHub source link.
3. **源码练习** section from `code.js` or `code.jsx`.
4. **笔记记录** section from `article.md`, only when notes exist.
5. Previous/next navigation using the same group-aware ordering as the sidebar.

Source comes first because the page is primarily an exercise reference. Notes follow as supporting context.

## Data Loading

The blog `lib/practice` layer should parse and expose:

- `groups`
- `groupId`
- optional `article`
- source code
- optional note markdown

The schema should validate the new fields while still accepting legacy practice entries. If a problem has no `groupId`, it can fall back to `category` for compatibility.

Recommended loader APIs:

- `getPracticeGroups()`
- `getAllProblems()`
- `getProblemById(id)`
- `getAdjacentProblems(id)`

`getAllProblems()` should use a stable group-aware ordering:

1. Group `order`
2. Problem `updatedAt` descending inside each group
3. Title as a final tiebreaker

## Migration Plan

1. Update the blog schema and types to understand `groups`, `groupId`, and `article`.
2. Change the sidebar to group by `groupId`, not `category`.
3. Change the detail page to render source first and article notes second.
4. Remove prompt rendering from the blog.
5. Update practice content:
   - Keep `debounce/code.js`.
   - Treat `debounce/article.md` as the visible note.
   - Remove or ignore `debounce/prompt.md`.
6. Add tests for grouping, source rendering, article rendering, and absence of prompt rendering.

## Verification

Required checks after implementation:

- Blog build passes.
- Practice tests pass.
- `/practice` shows the expected count and group labels.
- `/practice/debounce` renders source first and notes second.
- `/practice/add-event-listener` appears under the intended event group when `groupId` is `event`.
- No prompt content appears on any practice page.

## Open Decisions

- `/practice` can continue redirecting to the first problem for phase one. A dedicated searchable index page is deferred until the exercise count grows or discovery becomes a stronger need.
- Existing problems without `article.md` will show only the source section.
