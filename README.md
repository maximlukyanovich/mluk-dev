# mluk.dev

A personal site in English and Russian, built with Next.js 16 (App Router,
Cache Components), React 19 and Tailwind 4, hosted on Vercel. The first wave:
a blog with RSS, About/CV, Projects and Contact, with content in git. Visiting
`/` redirects to `/en` or `/ru` by the remembered choice, then the
browser's language.

## Getting started

Requires Node 24 (`.nvmrc`) and pnpm 11 through Corepack.

```bash
corepack enable
pnpm install
pnpm dev          # http://localhost:3000
```

| Script                              | What it does                                                 |
| ----------------------------------- | ------------------------------------------------------------ |
| `pnpm lint`                         | ESLint                                                       |
| `pnpm format` / `pnpm format:check` | Prettier, with the Tailwind class-order plugin               |
| `pnpm typecheck`                    | `next typegen && tsc --noEmit`                               |
| `pnpm test`                         | Vitest over the app, then Node's test runner over `scripts/` |
| `pnpm build`                        | Production build                                             |
| `pnpm validate`                     | All of the above — the gate before a pull request            |

A dependency with a build script needs an `allowBuilds` entry in
`pnpm-workspace.yaml` — see [AGENTS.md](AGENTS.md) §2.

## Agent tooling

Optional, for Claude Code: start it at the repository root and trust the
folder. That registers the plugin marketplaces `.claude/settings.json`
declares but downloads no plugin — run `/my-start`, which installs the missing
ones and then gives the overview. A session that is already open loads new or
updated plugins after `/reload-plugins`. Other agents read
[AGENTS.md](AGENTS.md).
