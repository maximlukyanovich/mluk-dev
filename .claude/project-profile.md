# Project profile

Read by every library plugin before it acts. This file outranks the defaults
those plugins ship; a key in the gitignored `project-profile.local.md` outranks
it for one clone, and what the developer says in the current session outranks
both.

## Repository

- platform: `github` with `gh`
- remote account: `personal`
- base branch: `main`
- chain: `feature/* → main` — one author; Vercel's preview deployment of each pull request is the staging step, so no `develop`
- protected: `main`
- upstream: none
- validate: `pnpm validate`
- full gate: `local` — no CI
- commit preset: `gitmoji-conventional` — an agreement, no commit-msg hook
- commit confirm: `ask`
- merge method: `merge`
- delete branch: `merge` — GitHub's `delete_branch_on_merge` stays off
- pr language: `en`

### Targeted checks

| Path class                                          | Command                                                                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `*.ts`, `*.tsx`, `*.mjs`, `*.js` outside `scripts/` | `pnpm exec prettier --check <files> && pnpm exec eslint <files> && pnpm typecheck && pnpm exec vitest related --run <files>` |
| `scripts/**`                                        | `pnpm exec prettier --check <files> && pnpm exec eslint <files> && pnpm test`                                                |
| `*.md` outside `content/`, `.claude/**`             | `pnpm exec prettier --check <files>` — `pnpm format:check` reads them                                                        |

Shared configuration (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, Prettier's config),
`*.css`, `content/**` and `public/**` have no row: they run `pnpm validate`.

- hub files: `shared/i18n/locales.ts`, `shared/i18n/dictionaries/*.json` — every page reads them; a change runs the whole suite (`pnpm exec vitest run`)

## Docs

- technical: `AGENTS.md`, `CLAUDE.md`, `docs/README.md`, `README.md`
- product: none
- roadmap: none yet — the waves are in `AGENTS.md` §1
- techdebt: none yet

| Change                               | Document                                              |
| ------------------------------------ | ----------------------------------------------------- |
| A command, script or dependency rule | `AGENTS.md` §2, `README.md` «Getting started»         |
| A new top-level path or import rule  | `AGENTS.md` §3                                        |
| A convention or working agreement    | `AGENTS.md` §4 or §6                                  |
| A plugin, command, hook or layer     | `AGENTS.md` §7, `.claude/COMMANDS.md`                 |
| Deployment, domain, DNS              | `docs/README.md` (a deployment page, when one exists) |

## Task

- flavours: `ui → mluk-fe:web-ui-conventions, mluk-fe:component-discipline, mluk-design:design-port`; `copy-ru → mluk-ru:business-russian`; `deploy → mluk-deploy:deploy-vercel, mluk-deploy:domain-dns`
- brief sources: inline, a `docs/local/` note, a GitHub issue
- testing skill: none — `mluk-repo`'s `reference/proof.md`

## Checks

- agent plugins — `node scripts/agent-plugins.mjs` — `/my-start`
- node 24 — `node --version` — `nvm use` (reads `.nvmrc`)
- pnpm 11 — `pnpm --version` — `corepack enable`
- dependencies — `pnpm install --frozen-lockfile --offline` — `pnpm install`
- dev server — `curl -sf -o /dev/null http://localhost:3000` (the port is `PORT` in `.env.local`) — `pnpm dev`
- gh auth — `gh auth status --active` — `gh auth login` with the personal account; `--active` because another account on the machine may be logged out
- working tree — `git status --porcelain` — commit or stash

## Review

- i18n: a visitor-facing string outside the en/ru dictionaries, or a key present in one dictionary only — `major`
- boundaries: a feature importing another feature, or `shared/` importing `features/` or `app/` (`AGENTS.md` §3) — `major`
- Cache Components: the locale read from `params` instead of `next/root-params` in a page, a layout or `generateMetadata`, or a root parameter with no `generateStaticParams` value — `major`. Route handlers under `[lang]` (`route.ts`, `opengraph-image`) are the exception: `next/root-params` throws there, so they read `params` and export their own `generateStaticParams`
- design source: the kit (`## Sources of truth`, item 2) — a class, token or markup that departs from it, or from the chosen page artboard, without the owner's recorded agreement — `major`

## Sources of truth

1. The code and its config.
2. Design, in Claude Design:
   - **the kit** — the Design System artifact
     https://claude.ai/artifact/1mZUKFY6YW32tagwyFiFXh: tokens
     (`project/tokens.json`), component classes (`project/components/bundle.css`,
     `mk-*`) and their guidelines (`project/README.md`,
     `project/components/<Name>/README.md`). It wins over a canvas for the look
     of a component.
   - **the page canvas** — the Design artifact
     https://claude.ai/artifact/6VXXkACDuXmhmFUNbQ8LfH: three or more variants
     per page, one canvas page per section. **Ready** means the frame's title
     ends in «✓ выбрано»; a frame without it is a variant kept for comparison
     and is never ported. The canvas's sticky notes record what was decided.
   - Read both at write time with the Artifact tool, never from memory or a
     summary. A screen with no chosen frame waits for the owner's word, quoted
     with its date in the plan.
3. Library docs through Context7, before memory.

On conflict: show the owner both sides, never pick one silently.

## Languages

- committed: English — code, comments, commits, PRs, documentation
- user-facing: en and ru, default `en`; strings live in `shared/i18n/dictionaries/<locale>.json`, posts in `content/` per locale
- conversation: Russian

## Frontend

- messages: `shared/i18n/dictionaries` — flat or nested JSON, one file per locale
- default locale: `en`
- source: `.` — `app/`, `features/`, `shared/` sit at the root
- app: `app`
- hooks off: i18n-keys — no next-intl; dictionaries are read through the project's own helper

## Copy

- canonical documents: none yet — the About/CV page becomes the reference once written
- glossary: none yet
- language pairs: en ↔ ru — a dictionary key or a post changes in both locales in one commit
- copy journal: `docs/local/copy-journal.md`
