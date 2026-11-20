# Commands

The library plugins enabled in [`settings.json`](settings.json) bring their own
commands; each plugin's `help` lists them (`/mluk-repo:help` first). They read
[`project-profile.md`](project-profile.md) plus this clone's gitignored
`project-profile.local.md`. This file lists only what the library does not
know: the project's own commands and its overrides.

Harness: mluk-bootstrap 1.7 — setup of 2026-11-20.
Command prefix: my

## Local

| Command                             | Mutating                   | What it does                                                                                                 |
| ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`/my-start`](commands/my-start.md) | installs plugins, on a yes | First command in a fresh clone: installs the declared plugins that are missing, then runs `/mluk-repo:start` |

The start command is local because a plugin that is not installed has no commands, so
the library cannot install itself.

## Overrides

None. A local command overrides a library one only when the procedure differs
— a parameter goes to the profile. Each override is a row here:
`/<local>` overrides `/mluk-repo:<name>` because <reason>.
