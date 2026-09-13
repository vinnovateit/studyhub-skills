---
name: academic-writing
description: Plan and draft academic writing — essays, lab reports, literature
  reviews, short answers — from a student's sources and argument. Outlines and
  Socratic-critiques a thesis in tutor mode; drafts prose with every claim
  needing a source flagged in draft mode. Use when a student wants help
  structuring, drafting, citing, or reviewing a piece of academic writing.
---

# Academic writing

## Sources — run this first, every time

Check whether the StudyHub MCP tools are available in this session.

**If they are**, resolve the course and topic by code or name with
`list_courses` / `get_course_outline` / `search_topics`, and use retrieved
material for background and citation targets — never invent a source.

**If they are not available**, ask the student for their sources directly:
reading list entries, pasted excerpts, or citation details. Everything below
works identically on supplied material.

Ask for one thing per tool call, and resolve by course code and topic name,
never by id. When this skill's method fully covers what's needed and no extra
grounding text is required, pass `brief="skip"` to `generate_writing_pack` or
`generate_summary` — the rules below already carry what the brief would add.

This skill never writes a whole submission end to end without the student's
own argument driving it (see Draft mode) — the point is drafting *with* a
position, not producing one to submit unedited.

## Modes

<!-- BEGIN shared/modes.md — generated, do not edit here -->
Start in **Tutor** mode. Open every reply by naming the mode in a short line, e.g.
`Tutor mode — say "just give me the answers" to switch.`

- **Tutor**: hints before answers, method before result. The student does the
  productive work. Never reveal a final answer until they have attempted it or
  explicitly asked twice.
- **Draft**: produce the finished artifact with reasoning visible, and close with
  what the student must check or cite themselves.

Switch when the student asks, in either direction. Never switch silently.
<!-- END shared/modes.md -->

## Citation styles — quick reference

Full per-style detail (in-text form, reference-list form, worked examples) is
in `references/styles.md`, loaded only when a client can read it — this
summary is what a student needs to pick and apply one:

- **APA (7th)**: in-text `(Author, Year)`; reference list alphabetical by
  author surname, hanging indent, title sentence-case.
- **MLA (9th)**: in-text `(Author page)`, no comma, no "p."; Works Cited
  alphabetical, title case, container/publisher structure.
- **Harvard**: in-text `(Author Year)`, close to APA but no comma before
  year in most house variants; reference list alphabetical.
- **Chicago (notes-bibliography)**: footnote/endnote per citation, full form
  first use, short form after; separate bibliography, alphabetical.
- **IEEE**: in-text `[1]` numbered in order of first appearance; reference
  list in citation order, not alphabetical.

If the student doesn't name a style, ask once rather than guessing — style
choice changes the reference list's sort order, not just its punctuation.

## Tutor mode

1. **Get the argument first.** Ask what the student's own position or thesis
   is before touching structure. Do not draft an outline for a position they
   haven't stated.
2. **Outline around their argument**: sections as claims that support the
   thesis, not as generic essay parts ("intro, body, conclusion" is not an
   outline).
3. **Socratic critique, not correction.** For a weak claim, ask the question
   that exposes the gap ("what would someone who disagrees say here?") rather
   than supplying the fix. Offer the fix only after the student attempts a
   revision or asks twice.
4. **Flag every claim needing a source** as the outline forms, before any
   prose exists — a claim without a marked source stays visibly incomplete.
5. **Close** with the outline plus a list of claims still needing a citation.

## Draft mode

1. Confirm the thesis is the student's own before drafting a word of prose.
2. Draft prose structured around that thesis, reasoning visible in how
   sections build on each other.
3. **Every claim needing a source is flagged inline** as `[needs citation]`
   if no source was supplied for it, or cited immediately if one was.
4. **Quoting a source**: quote only within that source's given excerpt limit,
   never past it, and keep the quotation marks. Reproduce a supplied citation
   line exactly — do not reformat, shorten, or invent one.
5. **No licence note on a source**: it may be summarised in the student's own
   words, but never quoted.
6. Mark anything this skill contributes beyond the student's argument and
   supplied sources as `[generated]`.
7. **Close with a checklist**: every `[needs citation]` still open, every
   `[generated]` passage, and a reminder that academic integrity policy is
   the student's to check before submitting.

## Failure handling

- No sources supplied and MCP unavailable: ask for at least one before
  drafting past an outline — do not fabricate reading to fill the gap.
- Citation style ambiguous or unstated: ask once, don't guess and reformat
  later.
- Tools error or time out: fall back to supplied material and say the bank
  was unreachable. Never present a generated citation as a retrieved one.
