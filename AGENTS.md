<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent instructions

The harness's choices — branch chain, gate, commit preset, sources — are keys in
[`.claude/project-profile.md`](.claude/project-profile.md); this file says what
the project is and how to work in it, and points there instead of repeating them.

## 1. Project

mluk.dev — a personal site. The first wave is the blog with RSS, About/CV
(with a PDF), Projects and Contact; the second wave adds comments (Giscus),
likes (Upstash Redis), share links, `/now`, `/uses`, notes, search and a
newsletter. One repository, no siblings. The site is bilingual (en, ru) and
deploys to Vercel from `main`. No phase restriction: production code may be
written now.

## 2. Commands

Run from the repository root. Node 24 (`.nvmrc`), pnpm 11 through Corepack
(`packageManager`).

| What       | Command                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Install    | `pnpm install`                                                                                                        |
| Dev server | `pnpm dev` — http://localhost:3000                                                                                    |
| Lint       | `pnpm lint` (ESLint, `eslint-config-next`)                                                                            |
| Format     | `pnpm format` / `pnpm format:check` (Prettier)                                                                        |
| Type-check | `pnpm typecheck` — `next typegen && tsc --noEmit`; a bare `tsc` on a clean clone fails on the generated `LayoutProps` |
| Tests      | `pnpm test` — `node --test` over `scripts/**/*.test.mjs`; the app's test runner arrives with its first test           |
| Build      | `pnpm build`                                                                                                          |
| Full gate  | `pnpm validate` — format check, lint, type-check, tests, build                                                        |

**Adding a dependency.** pnpm 11 refuses a dependency with a build script —
direct or transitive — that has no `allowBuilds` entry in
`pnpm-workspace.yaml`: `pnpm add` and every install of a package the tree has
not built fail with `ERR_PNPM_IGNORED_BUILDS`. Add the entry with its reason
in a comment. A warm tree proves nothing, and there is no CI: prove a new
dependency with `pnpm install --frozen-lockfile` in a fresh clone.

## 3. Architecture

App Router at the root (no `src/`), import alias `@/*` → the root. Paths
marked _planned_ are decided and not yet in the code.

| Path                                                                   | Responsibility                                                                    | May import                                       |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| `app/[lang]/` _(planned)_                                              | Routes, layouts, metadata — thin: read params, call a feature, render it          | `features/*` through their `index.ts`, `shared/` |
| `features/<module>/` _(planned)_ — `blog`, `cv`, `projects`, `contact` | A section's components, data loading and logic; its public API is `index.ts` only | `shared/`, `content/` — never another feature    |
| `shared/` _(planned)_                                                  | `ui/` (shadcn/ui components), `lib/`, `i18n/` (locales, dictionaries, helpers)    | itself only — never `features/` or `app/`        |
| `content/` _(planned)_                                                 | MDX posts and pages in git, one file per locale                                   | —                                                |
| `public/`                                                              | Static assets; images go through `next/image`                                     | —                                                |
| `scripts/`                                                             | Repository tooling (the agent-plugin report)                                      | Node built-ins                                   |

Decided stack for the planned parts: MDX content, no database; Tailwind 4 with
shadcn/ui and `next-themes` (light/dark); i18n by `app/[lang]` + dictionaries +
`next/root-params`, no library; Vercel hosting with Cloudflare DNS.

## 4. Conventions

- **Languages** — the profile's `## Languages`. Every string a visitor reads
  comes from the en and ru dictionaries; none is written into JSX or metadata.
  Both dictionaries change in the same commit.
- **Branches** — `feature/* → main`, `main` takes pull requests only; Vercel's
  preview deployment of the pull request is the staging check.
- **Commits** — preset `gitmoji-conventional`, by the `mluk-repo:commit-conventions`
  skill; git safety by `mluk-repo:git-safety`; PRs by `mluk-repo:pr-conventions`.
- **Formatting and lint** — `[lint]` Prettier and ESLint decide; their output
  is not argued with in prose.
- **Styling** — Tailwind utilities and shadcn/ui tokens; no CSS modules, no
  inline style objects for what a utility expresses.

## 5. Sources of truth

The profile's `## Sources of truth` gives the order and the design source. On a
conflict between two sources, show it to the owner — never pick one silently.

## 6. Working agreements

- **Next.js 16 traps.** Middleware is `proxy.ts` next to `app/`, exporting
  `proxy`. With Cache Components `await params` is runtime data: the locale
  comes from `next/root-params` (`await lang()`), not from `params`, and every
  root parameter has at least one value in `generateStaticParams`, or the
  build fails. Read the guide in `node_modules/next/dist/docs/` before using an
  API, as the block above says.
- **Library docs before memory** — Context7 for Next.js, React, Tailwind,
  shadcn/ui, MDX.
- **A UI change is checked live** — Playwright against the dev server, both
  locales and both themes, before it is called done.
- **Tests by risk** — `mluk-repo`'s `reference/proof.md`: routing by locale,
  the RSS feed and anything that branches get a test in the same commit; the
  rest gets a recorded live check.
- **Efficiency remarks.** A remark from the owner about the agent's speed,
  cost or quality of work goes as a row into `docs/local/efficiency-remarks.md`
  in the same session — date, task, the quote, context, a link, no judgement;
  `/mluk-bootstrap:audit` reads it.
- **Prompts offered to continue the work** go in a code block of their own,
  ready to copy; there may be several. A block names a step that can run now: a
  step that waits on an earlier one shows the earlier step's block first. The
  line above it says where it runs, the words for a fresh session in bold. A
  block for a worktree runs in a session opened in the main repository, never
  `cd <tree> && claude`: the prompt enters the tree by its absolute path with
  `EnterWorktree`, leaves with `ExitWorktree`, `keep`, before writing to the
  main tree, and enters again.

## 7. Agent tooling

- **Plugins** — declared in [`.claude/settings.json`](.claude/settings.json):
  `mluk-bootstrap`, `mluk-repo`, `mluk-fe`, `mluk-design`, `mluk-deploy`,
  `mluk-ru` from `mluk-agent-tools` (following `main`), `context7` and
  `playwright` from `claude-plugins-official`. `/my-start` installs the missing
  ones in a fresh clone.
- **Commands** — the library's; the project's own and its overrides are in
  [`.claude/COMMANDS.md`](.claude/COMMANDS.md).
- **Hooks** — `mluk-fe`'s (locale parity, localised metadata titles); none of
  the project's own.
- **Layers left out, deliberately:**
  - _Project hooks and skills_ — no recurring mistake yet. Add one when the
    same mechanism is met a second time (the `mluk-repo:kickoff` skill, step 8).
  - _Git hooks, commitlint_ — the commit format is an agreement;
    `/mluk-repo:commit` runs the targeted checks. Add them when a commit gets
    past the agreement.
  - _CI_ — the gate runs locally. Add a workflow when a second contributor
    arrives or a red `main` reaches Vercel.
  - _Gate fingerprinting and the heavy-run lock_ — each part of the gate reads
    nearly the whole tree, and no test suite takes every core. Revisit with the
    app's test runner.
  - _MCP example and `.env.example`_ — no server or secret yet; they come with
    Upstash and Giscus.
