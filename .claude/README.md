# .claude

Claude Code's part of the harness. The project rules are in
[`../AGENTS.md`](../AGENTS.md); this directory holds what the plugins read.

| Path                                       | What                                                                                                                | In git |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------ |
| [`settings.json`](settings.json)           | Marketplaces, enabled plugins, empty attribution                                                                    | yes    |
| `settings.local.json`                      | Personal permissions                                                                                                | no     |
| [`project-profile.md`](project-profile.md) | The keys the library plugins read: repository, gate, docs, task, checks, review, sources, languages, frontend, copy | yes    |
| `project-profile.local.md`                 | This clone's overrides, same headings                                                                               | no     |
| [`COMMANDS.md`](COMMANDS.md)               | Index of the project's own commands and overrides                                                                   | yes    |
| [`commands/`](commands/)                   | Command files only — every `.md` there becomes a slash command                                                      | yes    |

`skills/` and `hooks/` appear with their first real file (`AGENTS.md` §7 says
why there are none yet).
