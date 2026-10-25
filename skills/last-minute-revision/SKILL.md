---
name: last-minute-revision
description: Turn a syllabus and past papers into a compact nested revision
  checklist with asked-topic evidence, explicit OOS portions and a realistic
  time budget. Adapt to revision checkpoints and full, two-hour or 15-minute
  views. Use for last-minute revision, a night-before overview, a crash sheet
  or a quick version of a syllabus map. Use syllabus-map for the detailed
  coverage audit and exam-prep for interactive questions or mock papers.
---

# Last-minute revision

## Ground the revision sheet

Reuse an existing syllabus map, source references and known course/exam scope
from the conversation. Check that its syllabus version and assessed modules
match this exam. Do not claim to have rechecked sources you have not inspected.
Ask for missing course/syllabus scope when necessary. Ask how much time remains
only if needed to allocate a schedule. Otherwise provide a compact checklist
without assuming an exam date or delaying it for a time estimate.

With StudyHub MCP, use `list_courses`, `get_course_outline` and `get_topic` to
ground module/topic structure. Use `list_papers` and `get_paper_questions` for
exam evidence. Inspect whole papers so untagged and OOS portions are visible.
Follow any `list_questions` cursors with the same filters when using bank
material. Treat bank-only items as practice, not proof of a past exam question.
`generate_summary` can supply supporting material, but its sampled questions
and shortened descriptions do not establish full topic or paper coverage.

Without MCP, use supplied syllabus, papers and notes. State missing sources,
unreadable pages or truncation. Work with what is available. Do not fill a
missing syllabus with general subject knowledge or turn a sample into a claim
about all past papers. Disclose tool limits that have no continuation path.

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

Provide the compact checklist in either mode. Tutor mode may add a brief
recall cue without its answer. Draft mode may include sourced formula or
definition reminders. Do not begin a quiz or produce a mock paper unless asked.

## Compress without losing the scope

- Keep the same module, topic and named-subtopic hierarchy as the detailed
  map or syllabus. Use short phrases. Combine sibling leaves on one line only
  when their individual names and labels remain clear. Keep every supplied
  syllabus leaf visible in the checklist or a compact deferred-topic index.
  Never leave the omitted scope implicit.
- Keep syllabus status separate from exam evidence. Use `[ASKED]` only with a
  paper reference. Use `[NOT OBSERVED]` only within inspected papers. Mark
  `[EVIDENCE INCOMPLETE]` when gaps prevent that absence claim. Never promise
  that a repeated topic will appear or that an unobserved one is safe to skip.
  With no papers available, use `[EVIDENCE INCOMPLETE]` for all exam history.
- Mark `[OOS]` only when exclusion is supported by a cited complete relevant
  course syllabus or an explicit exclusion from it. Label uncertain cases
  `[SCOPE UNCLEAR]`. Absence from a topic tag or a broad outline is insufficient.
  Mark only the affected portion of a mixed question. Use
  `[OUTSIDE THIS EXAM]` for course topics excluded from this exam's modules.
- Mark extra concepts derived from questions `[paper-derived]` without
  implying syllabus inclusion. Show bank-only evidence as `[BANK ONLY]`.
- Carry one short evidence reference per asked leaf. Group additional paper
  references compactly. Cite entry positions as entry positions if original
  question numbers are unavailable. Do not invent question numbers or marks.
- Count distinct inspected papers for repetition. Deduplicate repeated
  retrieval. Do not add a multi-topic question's marks more than once to a
  total or allocate shared marks without a source breakdown.

## Compression levels

Use the requested level. Default to a compact full map when none is named.
Do not produce all three versions unless asked.

- **Full map:** retain every syllabus leaf, scope label and evidence reference.
  Show concise recall cues and recurring question patterns where supported.
- **Two-hour sheet:** select a realistic study sequence within 120 minutes.
  Prefer shaky in-scope topics, prerequisites and observed question patterns.
  Retain short evidence references. Put all deferred leaves in a compact index.
- **15-minute recall list:** select only feasible recall cues, essential
  conditions and known traps within 15 minutes. State that it is selective.
  List deferred topics explicitly. Avoid introducing long new derivations.

For another supplied duration, use that budget. Include breaks or review within
the total. Distinguish topics visible in the index from topics allocated study
time. Do not imply that a two-hour or 15-minute view covers the whole course.
Retain OOS and uncertain-scope lists at every level. Reuse a prior version
comparison only if it applies to the selected syllabus. Disclose unverified
version changes. Do not drop caveats when compressing.

## Checkpoints and question patterns

Accept `[UNTOUCHED]`, `[SHAKY]` and `[CONFIDENT]` by topic path and syllabus
version. Use `[UNREPORTED]` when unknown. Keep student reports distinct from
session evidence. Do not infer mastery from a ticked box or weakness from
missing history. Carry supplied changes into the priorities and time blocks.
Keep progress in this conversation. On request, return a copyable checkpoint
table for another session. Do not claim persistent StudyHub storage.

Reuse grounded pattern groups from the map. Otherwise group inspected questions
only when they share a concept and required operation. Keep different methods
separate. Show a short pattern, paper references and observed marks range.
Infer answer depth from the command and marks only when no rubric is supplied.
Label that inference. Count distinct papers, not retrieved copies or paraphrases.

## Priorities and time

Add `[FIRST]`, `[NEXT]` or `[IF TIME]` beside in-scope leaves when evidence
supports an ordering. Explain the basis briefly: observed recurrence/marks,
prerequisites or the student's stated weak areas. Do not infer weakness from
missing history. When evidence is thin, state that the ordering is provisional.
Preserve syllabus order in the checklist. Put a short recommended study sequence
after it instead of reshuffling the hierarchy.

For a supplied time budget, assign concrete blocks that sum to no more than the
available time. Include recall/practice and a final review. Say what cannot
realistically be covered. Keep deferred topics visible in the index.
Put confirmed OOS material outside the core study blocks. Do not treat a
previously asked OOS question as irrelevant without the current scope evidence.

## Output

1. One short source/scope note: syllabus version if known, assessed modules,
   papers inspected and any evidence gaps. Add a compact label legend.
2. A nested checklist or recall list at the requested compression level. Keep
   syllabus order within it. Add a deferred-topic index for selective views.
3. A separate **OOS portions** list with the exact portions and scope references.
   Keep uncertain cases separate. If none is confirmed, say so.
4. A short study sequence, with time blocks only when a budget is known. Close
   with omitted sources or coverage limits rather than a claim of completeness.

Use terse cues, one-line evidence and a single label legend. Omit repeated
explanations and closing recaps. Preserve units, conditions and uncertainty.
For a full map, preserve leaves over an arbitrary page limit. For selective
views, name every deferred leaf without implying it was revised.
