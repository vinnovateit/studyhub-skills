# studyhub-skills

Academic [Agent Skills](https://agentskills.io) for StudyHub, plus a directory
of third-party skills and MCP servers worth knowing about.

A skill carries **method** — how to run a revision session, how to mark an
answer, when to give a hint. The [`studyhub-mcp`](../studyhub-mcp) server
carries **material** — the real question bank, past papers and course outlines.
They are deliberately independent: a skill works without the server, and the
server works without skills.

**This is a starting point.** One skill of our own and one third-party listing,
enough to establish the shape. Three more skills (`flashcard-builder`,
`academic-writing`, `stem-solver`) follow the same structure.

## What is here

```
skills/exam-prep/          ours — SKILL.md is the source of truth
  SKILL.md                 the whole skill; the StudyHub app loads only this
  references/              optional depth, read by CLI agents and never by the app
shared/modes.md            the tutor/draft contract, injected into every skill
sources.json               third-party POINTERS — skills, MCP servers, subagents
registry.json              generated: the catalog the StudyHub app fetches
scripts/build.mjs          injects modes, emits the registry
scripts/validate.mjs       enforces the portability contract
scripts/pre-commit         runs both as a git hook, see below
```

`npm test` runs both scripts. Neither has dependencies, so there is nothing to
install.

## Where the checks run

`.github/workflows/ci.yml` runs `validate` and `check` on every pull request,
but do not treat that as the only gate: Actions minutes are metered on private
repositories, and the org's allowance runs out. Install the pre-commit hook so
the same two checks run before a commit is made:

```sh
ln -sf ../../scripts/pre-commit .git/hooks/pre-commit
```

That is the whole setup. The hook is `npm run validate && npm run check`, it
takes about a second, and `git commit --no-verify` skips it deliberately.

The workflow stays in the repo regardless — it costs nothing while it is not
running, and Actions is free and unmetered on public repositories, which is
where this repo is headed anyway. A directory that invites third-party pull
requests wants the shape check to happen on the contributor's PR, not on a
maintainer's machine after the fact.

## Why the format is Agent Skills, not Claude Code plugins

One `SKILL.md` runs unchanged in Claude Code, Codex, Cursor, Copilot and around
thirty other clients. A Claude Code plugin runs in one. The plugin marketplace
is a channel we can generate later; it is not the thing being authored.

That portability is a constraint, and `validate.mjs` enforces it:

- **Only `name` and `description` in frontmatter.** `context: fork`,
  `when_to_use`, `allowed-tools` and `agents/openai.yaml` all work in one client
  and are ignored or rejected in another.
- **The body must stand alone.** The StudyHub app injects `SKILL.md` into a
  prompt and has no filesystem — it never reads `references/`, `scripts/` or
  `assets/`. Anything load-bearing goes in the body; anything that would bloat
  it goes in `references/` and stays optional.
- **Under 200 lines.** An injected body competes with the conversation for room.

## Tutor mode is the default

Every skill opens in Tutor mode: hints before answers, method before result, and
the student does the productive work. Draft mode — where the agent produces the
finished thing — is reachable only when the student explicitly asks for it, and
switching is never silent.

The contract is written once in `shared/modes.md` and injected by `build.mjs`
into the marked block in each `SKILL.md`. Injection is **in place and
committed**, because `registry.json` points the app straight at
`skills/<id>/SKILL.md`; there is no build output for it to read instead. Edit
`shared/modes.md`, run `npm run build`, commit the result. CI fails a PR whose
generated blocks have drifted.

## Third-party entries are listed, never shipped

`sources.json` holds pointers. Nothing third-party is copied into this repo —
no `vendor/`, no sync script, no pinned shas, no licence-compatibility matrix.
An entry gives a student what it is, what it can access, and numbered steps to
install it from its own source.

The sample entry is Anthropic's [`pdf`
skill](https://github.com/anthropics/skills/tree/main/skills/pdf), which pairs
well with `exam-prep` when a student's past paper is a scanned PDF. It also
demonstrates why the rule exists: that skill is source-available, not open
source, so vendoring it into an MIT repo would be a licence problem. It is
listed with `platforms` that exclude `studyhub`, because it needs a shell to run
Python and the app cannot give it one.

`review.accesses` is mandatory on every third-party entry, and `review.status`
is set by a maintainer at merge time rather than by CI. Whether a server should
be recommended to students is not a schema question.

## Adding a skill

```sh
mkdir -p skills/my-skill
# write skills/my-skill/SKILL.md with name + description frontmatter,
# and the two shared/modes.md marker comments where the contract belongs
npm run build && npm test
```

To list something third-party instead, add an entry to `sources.json` and open a
PR. CI checks the shape; a maintainer fills in `review.accesses` and merges.

## Not built yet

- The other three skills.
- `plugins/` and `.claude-plugin/marketplace.json` — the generated Claude Code
  bundles. One more emitter in `build.mjs`; the source of truth does not change.
- Per-skill `subjects`, so the directory can filter by discipline. Display names
  are derived from the directory name today.

The MCP tools `exam-prep` calls (`list_courses`, `search_topics`,
`list_questions` and friends) are not implemented in `studyhub-mcp` yet, so the
skill currently takes its "tools are not available" path and works from material
the student pastes in. That path is not a fallback bolted on — it is how the
skill runs in ChatGPT and in any session without the server.

MIT licensed.
