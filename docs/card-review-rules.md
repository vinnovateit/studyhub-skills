# MCP and subagent card rules

This is Sam's slice of Stage 4 (see `studyhub-mcp/docs/sam.md`): the
credential-handling rule that governs how a third-party MCP server or
subagent is ever listed here, expressed as a rule a maintainer enforces and
a card Shreya's registry UI renders.

## The rule

**StudyHub never proxies, hosts, or configures a third-party MCP server or
subagent credential. No third-party credential is ever entered into
StudyHub.**

Concretely:

- A `registry.json`/`sources.json` entry of type `mcp` or `subagent` is
  always a **pointer** — a name, a description, a link to where the student
  sets it up themselves, and `setup.steps` telling them how. See
  `sources.json`'s existing rule: "third-party entries are listed, never
  shipped — they cannot carry a body." The same boundary applies to
  credentials: StudyHub is never in the path between a student and the
  third-party service's own auth.
- StudyHub's own backend and MCP server (`studyhub_revamp_backend`,
  `studyhub-mcp`) never store, forward, or have visibility into an API key,
  OAuth token, or session cookie that belongs to a third-party MCP server or
  subagent. There is no "paste your OpenAI key here" field anywhere in this
  system, for any entry.
- This is the same rule as "anything touching credentials needs Sam's
  review" (see `sam.md`'s "You review" section), just stated as a rule about
  UI and data model instead of about code review. A PR that adds a field for
  a third-party MCP server's token, or a proxy endpoint that forwards a
  request carrying one, is a credential-handling change and needs that
  review regardless of which repo it lands in.
- StudyHub's own OAuth 2.1 flow (`/oauth/authorize`, `/oauth/token` in
  `studyhub_revamp_backend`) is the one exception that proves the rule: it
  exists so *StudyHub's own MCP server* can hand a client (Claude.ai,
  ChatGPT, Claude Code, Codex) delegated access to *StudyHub's own corpus*.
  It is not a mechanism for onboarding a third party's credentials into
  StudyHub, and it must never be generalized into one.

## What the card shows

Shreya's registry card for an `mcp`/`subagent` entry renders, at minimum:

- That it is third-party (not run or hosted by StudyHub).
- A link to the third party's own setup/auth flow — never a form collecting
  a secret into StudyHub.
- The `review.accesses` list from the entry's metadata (see below) — what a
  maintainer has confirmed this thing can reach.

## `review.accesses` CI gate

Every `registry.json` entry with `"type": "mcp"` must carry a non-empty
`review.accesses` array before it can merge. This is enforced in CI by
`scripts/check-review-accesses.mjs` (wired into `.github/workflows/ci.yml`
and `npm test`), mirroring `validate.mjs`'s existing check on `sources.json`
but scoped to `registry.json` per this doc's authority. A missing or empty
`review.accesses` fails the PR — the check exists precisely so a missing
review fails mechanically rather than depending on a maintainer catching it
by eye.

## Third-party review flow

Before a maintainer marks an `mcp`/`subagent` entry `"review.status":
"reviewed"` and merges it, they confirm:

1. **What it can access** — filled into `review.accesses`, specific enough
   that a student reading the card knows what they're granting (e.g. "read
   access to a student's Google Calendar", not "calendar stuff").
2. **No credential passes through StudyHub** — the entry's `setup.steps`
   send the student to the third party's own auth surface; nothing in this
   repo, the backend, or the MCP server ever sees the resulting secret.
3. **License and author are real** — `license` and `author` are populated
   and the URL resolves to the actual project, not a fork or a lookalike.
4. **Scope matches the description** — the accesses list doesn't undersell
   (e.g. omitting write access it actually has) or oversell what the entry
   does.

Anything credential-shaped found outside this checklist — a proxy, a stored
key, a "connect your account" field pointed at StudyHub instead of the third
party — is treated as a Sam-lane finding per `sam.md`'s "You review" section,
not merged as a normal registry PR.
