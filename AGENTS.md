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

| What       | Command                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Install    | `pnpm install`                                                                                                                                  |
| Dev server | `pnpm dev` — http://localhost:3000                                                                                                              |
| Lint       | `pnpm lint` (ESLint, `eslint-config-next`)                                                                                                      |
| Format     | `pnpm format` / `pnpm format:check` (Prettier)                                                                                                  |
| Type-check | `pnpm typecheck` — `next typegen && tsc --noEmit`; a bare `tsc` on a clean clone fails on the generated `LayoutProps`                           |
| Tests      | `pnpm test` — Vitest over `{app,features,shared}/**/*.test.ts(x)` and `proxy.test.ts`, then `pnpm test:scripts` (`node --test` over `scripts/`) |
| Build      | `pnpm build`                                                                                                                                    |
| Full gate  | `pnpm validate` — format check, lint, type-check, tests, build                                                                                  |

**Adding a dependency.** pnpm 11 refuses a dependency with a build script —
direct or transitive — that has no `allowBuilds` entry in
`pnpm-workspace.yaml`: `pnpm add` and every install of a package the tree has
not built fail with `ERR_PNPM_IGNORED_BUILDS`. Add the entry with its reason
in a comment. A warm tree proves nothing, and there is no CI: prove a new
dependency with `pnpm install --frozen-lockfile` in a fresh clone.

## 3. Architecture

App Router at the root (no `src/`), import alias `@/*` → the root. Paths
marked _planned_ are decided and not yet in the code.

| Path                                                                                 | Responsibility                                                                                                                                                                  | May import                                                        |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `app/[lang]/`                                                                        | The root layout (locale, fonts, theme), routes, metadata — thin: read the locale, call a feature, render it. `(site)` has the header and footer; `(print)` _(planned)_ has none | `features/*` through their `index.ts`, `shared/`                  |
| `app/sitemap.ts`, `app/robots.ts`                                                    | Metadata routes outside the locale; the sitemap takes each section's pages from its feature                                                                                     | `shared/`; the sitemap also `features/*` through their `index.ts` |
| `proxy.ts`                                                                           | Locale routing: applies `shared/i18n/decide-locale.ts`, nothing else                                                                                                            | `shared/`                                                         |
| `features/<module>/` — `cv`; `blog`, `projects`, `contact`, `how-i-work` _(planned)_ | A section's components, data loading and logic; its public API is `index.ts` only                                                                                               | `shared/`, `content/` — never another feature                     |
| `shared/`                                                                            | `ui/` (kit components, `site/` header and footer, `styles/`), `lib/`, `i18n/` (locales, dictionaries, `decideLocale`, `switchHref`, `alternates`)                               | itself only — never `features/` or `app/`                         |
| `content/`                                                                           | Site content in git, one file per locale: `cv/<locale>.json`; MDX posts _(planned)_                                                                                             | —                                                                 |
| `assets/fonts/`                                                                      | Static TTFs for `next/og` (Satori takes no woff2) with their OFL licences                                                                                                       | —                                                                 |
| `public/` _(planned)_                                                                | Static assets; images go through `next/image`                                                                                                                                   | —                                                                 |
| `scripts/`                                                                           | Repository tooling (the agent-plugin report)                                                                                                                                    | Node built-ins                                                    |

Stack: Tailwind 4 with the design kit's CSS and shadcn/ui conventions,
`next-themes` (light/dark, `data-theme`); i18n by `app/[lang]`, dictionaries
and `next/root-params`, no library; content in JSON now, MDX posts planned,
no database; Vercel hosting with Cloudflare DNS.

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
- **Icons** — from `lucide-react` when it has the needed one, otherwise the
  kit's SVG (owner, 2026-11-21).

## 5. Sources of truth

The profile's `## Sources of truth` gives the order and the design source. On a
conflict between two sources, show it to the owner — never pick one silently.

## 6. Working agreements

- **Next.js 16 traps.** Middleware is `proxy.ts` next to `app/`, exporting
  `proxy`. With Cache Components `await params` is runtime data: the locale
  comes from `next/root-params` (`await lang()`), not from `params`, and every
  root parameter has at least one value in `generateStaticParams`, or the
  build fails. Route handlers under `[lang]` (`opengraph-image`, `feed.xml`)
  are the exception: `lang()` throws there, so they read `params` and export
  their own `generateStaticParams`. A 404 under a locale is `notFound()`
  caught by `app/[lang]/(site)/not-found.tsx`; its HTML is an error shell the
  client fills from the RSC payload (Next 16.4). The proxy skips a path
  whose last segment has a dot, so one under a non-locale first segment
  (`/feed.xml`, `/wp-admin/install.php`) would reach the root layout with
  that segment as a locale, and its `notFound()` gets Next's unlocalized
  page — `app/global-not-found` does not catch it. An `afterFiles` rewrite in
  `next.config.ts` serves such a path from the default locale instead. Read
  the guide in `node_modules/next/dist/docs/` before using an API, as the
  block above says.
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
    nearly the whole tree, and Vitest runs the app's suite in under a second.
    Revisit when the suite takes longer than the build.
  - _MCP example and `.env.example`_ — no server or secret yet; they come with
    Upstash and Giscus.
