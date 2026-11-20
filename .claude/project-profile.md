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

| Path class                                          | Command                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `*.ts`, `*.tsx`, `*.mjs`, `*.js` outside `scripts/` | `pnpm exec prettier --check <files> && pnpm exec eslint <files> && pnpm typecheck` |
| `scripts/**`                                        | `pnpm exec prettier --check <files> && pnpm exec eslint <files> && pnpm test`      |
| `*.md` outside `content/`, `.claude/**`             | `pnpm exec prettier --check <files>` — `pnpm format:check` reads them              |

Shared configuration (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`,
`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, Prettier's config),
`*.css`, `content/**` and `public/**` have no row: they run `pnpm validate`.

- hub files: none yet — no app test suite

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
- dev server — `curl -sf -o /dev/null http://localhost:3000` — `pnpm dev`
- gh auth — `gh auth status --active` — `gh auth login` with the personal account; `--active` because another account on the machine may be logged out
- working tree — `git status --porcelain` — commit or stash

## Review

- i18n: a visitor-facing string outside the en/ru dictionaries, or a key present in one dictionary only — `major`
- boundaries: a feature importing another feature, or `shared/` importing `features/` or `app/` (`AGENTS.md` §3) — `major`
- Cache Components: the locale read from `params` instead of `next/root-params`, or a root parameter with no `generateStaticParams` value — `major`
- design source: the Design System artifact in Claude Design — to be created; until then shadcn/ui defaults

## Sources of truth

1. The code and its config.
2. Design: a Design System artifact (the kit) and a separate Design artifact
   with canvases of page variants, both in Claude Design — to be created; their
   URLs go here when they exist, with which canvas state means ready. Until
   then shadcn/ui defaults and the owner's word, quoted with its date in the
   plan.
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
