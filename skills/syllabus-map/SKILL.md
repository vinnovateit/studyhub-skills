---
name: syllabus-map
description: Build a complete nested checklist of syllabus modules, topics and
  subtopics. Map past-paper questions to each topic with paper references and
  marks, recurring question patterns and revision checkpoints. Compare syllabus
  versions and mark confirmed OOS portions. Use for a detailed syllabus breakdown,
  coverage audit, version comparison or list of everything asked. Use
  last-minute-revision for a compact revision version.
---

# Syllabus map

## Sources and scope

Use the student's syllabus version and exam scope. Reuse supplied material and
scope from the conversation. Ask only for missing essentials: course, syllabus
or assessed modules. Record exam type and paper years when known.

With StudyHub MCP, resolve the course with `list_courses`, then fetch
`get_course_outline`. Use `get_topic` for descriptions that contain subtopics.
Use `list_papers` and `get_paper_questions` to inspect the selected papers in
full. Inspect whole papers before filtering by topic so untagged questions and
OOS portions remain visible. Use `list_questions` for supplementary bank items.
Follow returned cursors with the same filters. Bank counts alone do not prove
that a topic was asked in an exam.

Without MCP, work from supplied syllabus text, notes and papers. If one source
is missing, produce the supported portion and state what remains unverified.
Do not reconstruct an official syllabus from general subject knowledge.

State the syllabus source/version, assessed scope and papers actually inspected.
Distinguish a course outline from a verified official syllabus. State any
missing pages, unreadable text, truncated results or unavailable papers. A
summary or a sample of questions cannot establish exhaustive coverage. If a
tool offers no continuation, disclose the gap instead of repeating the call.

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

Provide the factual map in either mode without waiting for an attempt. In Tutor
mode, use the map to help the student choose what to study next. In Draft mode,
deliver a standalone checklist. Neither mode needs worked answers here.

## Build the hierarchy

- Preserve syllabus order: course, module/unit, topic, then named subtopics.
- Include every syllabus leaf, including those with no observed questions.
  Split compound syllabus entries only into the components the source names.
- Nest concepts found only in questions under a relevant topic as
  `[paper-derived]`. This describes their source, not their syllabus status.
  Never imply that these concepts were explicitly listed in the syllabus.
- Map each question and subpart to its actual subject matter. Treat stored
  topic tags as clues. A broad tag can hide an unrelated or OOS subpart.
- Keep two independent labels: syllabus status and exam evidence. An item can
  be `[IN SYLLABUS] [ASKED]` or `[OOS] [ASKED]`.

## Labels and evidence

- `[IN SYLLABUS]`: explicitly listed or clearly covered by a cited syllabus
  statement. Explain inferred inclusion when the wording differs.
- `[OOS]`: explicitly excluded from the course syllabus, or demonstrably outside
  the complete relevant syllabus. Cite the scope evidence and question portion.
  Apply it to the smallest affected subtopic or subpart. Preserve the in-scope
  portions of mixed questions without an OOS label.
- `[SCOPE UNCLEAR]`: the syllabus is missing, incomplete, too broad or from an
  unverified version. A missing topic tag or unfamiliar title never proves OOS.
- `[OUTSIDE THIS EXAM]`: covered by the course but outside the selected exam's
  modules. Distinguish this from content outside the course syllabus.
- `[ASKED]`: supported by an inspected paper. Attach paper title/year, exam
  type, question/subpart reference and marks when available.
- `[NOT OBSERVED]`: no match in the papers actually inspected. Never write
  "never asked" or infer that the topic cannot appear next time.
- `[EVIDENCE INCOMPLETE]`: missing or partial paper coverage prevents a reliable
  absence claim. Keep known positive evidence even when coverage is partial.
  Use this label when no papers are available. Do not mark topics unobserved
  against an empty set of inspected papers.
- `[BANK ONLY]`: available as practice without an inspected paper reference.
  Do not count these items as historical exam occurrences.

Use a source question number only when present. MCP paper output may number
published entries in stored order. Cite that as an entry position, not as the
original question number. Never invent marks, years or page references.

Deduplicate repeated retrieval of a question using its source identity. Keep
separate occurrences in different papers. For frequency, count distinct papers
and state the inspected-paper denominator. A question mapped to several topics
still contributes its marks only once to any overall total. Do not split shared
marks across topics without an explicit allocation.

## Question patterns

Group inspected questions by the concept and operation they test: recall,
explain, compare, derive, calculate or apply. Keep different methods and answer
demands distinct. Similar wording alone does not establish the same pattern.
Use a short pattern label with source references, distinct-paper frequency and
observed marks range. Preserve each occurrence's wording and marks in the source
mapping. Do not count paraphrases or subparts as extra papers.

State expected answer depth from the actual command, subparts and marks. Use
the rubric or answer key when supplied. Otherwise label the depth as inferred.
Do not invent a marking scheme or predict the next paper. Keep the topic tree
as the main artifact. Add one compact pattern line under each relevant topic.

## Compare syllabus versions

When asked, compare two identified syllabus sources. Record both versions and
which one governs this exam. If one is missing, request it and provide only the
supported map. Do not reconstruct an older version from old papers.

Match topic meaning before comparing names. Report added, removed, renamed,
moved or split/merged entries in a compact table: old location, new location,
change, source evidence. Separate confirmed matches from uncertain candidates.
A missing heading alone does not prove removal when its content moved elsewhere.

Remap historical questions against the selected syllabus. Keep the paper's
original context separate from its status for this exam. A removed topic can
be OOS for the selected version without having been OOS when originally asked.

## Revision checkpoints

Use the same topic path and syllabus version across the map and revision sheet.
Accept student labels `[UNTOUCHED]`, `[SHAKY]` and `[CONFIDENT]`. Use
`[UNREPORTED]` when no status is known. Never equate missing history with weakness
or a checked box with mastery. Keep progress independent of OOS and exam labels.

Record whether a status is student-reported or supported by session attempts.
Carry supplied checkpoints into the study order. Update only affected topics.
Keep checkpoints in this conversation. On request, return a compact copyable
table of topic path, version, status and basis for reuse in another session.
Do not claim that progress is saved to StudyHub or available across sessions.

## Output

Use short labels and one-line evidence notes. Define repeated labels once.
Keep technical distinctions, scope limits and source references. Drop filler,
repeated explanations and closing recaps. Do not shorten away uncertainty.

Lead with a short scope and source note, then a label legend. Make the main
artifact a detailed nested checklist, not a flat table or a list of priorities:

- Module 1: supplied title
  - [ ] Topic: supplied title `[IN SYLLABUS] [ASKED]`
    - [ ] Named subtopic `[IN SYLLABUS] [NOT OBSERVED]`
    - Evidence: supplied paper, year, question/subpart or entry position, marks
    - [ ] Additional concept `[paper-derived] [SCOPE UNCLEAR] [ASKED]`

Put confirmed OOS items in a separate, clearly labelled **OOS portions** list.
Keep a short `[OOS]` cross-reference at their relevant hierarchy location.
List uncertain mappings separately from confirmed OOS. If none is established,
say "No confirmed OOS portions in the inspected material."

Finish with source coverage and gaps. Check that every syllabus leaf appears
and every inspected question/subpart maps to a topic, OOS entry or unresolved
entry. For a long result, split at module boundaries and state what remains.
Never label a partial map complete. Do not generate worked answers unless asked.
