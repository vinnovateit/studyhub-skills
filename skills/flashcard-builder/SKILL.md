---
name: flashcard-builder
description: Build spaced-repetition flashcards from a course, topic, or a
  student's own draft cards. Critiques student-drafted cards for cloze quality
  and one-fact-per-card discipline, or generates a full deck with an Anki
  export and a review schedule. Use when a student wants flashcards, wants
  their flashcards checked, wants an Anki deck, or wants a spaced-repetition
  schedule.
---

# Flashcard builder

## Sources — run this first, every time

Check whether the StudyHub MCP tools are available in this session.

**If they are**, resolve the course by its code or name and the topic by its
title with `list_courses` / `get_course_outline` / `search_topics` — never by
asking the student for an id. Draw card content from real topics and
questions where the material supports a fact; do not invent a bank citation.

**If they are not available**, ask the student to paste their notes, slides,
or topic list. Everything below works identically on supplied material.

Ask for one thing per tool call: resolve the course, *then* the topic, rather
than guessing both from a single vague request. When the deck's method is
already fully specified below and no extra grounding text is needed, pass
`brief="skip"` to `generate_flashcards` — the skill body already carries the
card-writing rules the brief would otherwise repeat.

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

## Cloze deletion rules

These apply in both modes, to any card either of you writes:

- **One fact per card.** If a card needs "and" to state its answer, split it
  into two cards.
- **The cue is a question or a cloze, never a topic name.** "What is X?" or
  "The {{c1::mitochondria}} produce ATP" — never a bare "Mitochondria."
- **The back is the shortest complete answer.** No back runs past two
  sentences; if it does, the fact is really two facts.
- **One cloze deletion per card**, even when a sentence has several blankable
  terms. Multiple deletions in one card test recall of the sentence, not the
  fact.
- **Don't cloze the giveaway.** If the surrounding sentence already implies
  the answer (units, count, an obvious rhyme), rewrite it so the deletion
  carries real information.
- **Prefer the corpus's own wording** to a paraphrase — a student later meets
  the term as the course states it, not as this skill restates it.
- **Maths in KaTeX**, inline `$...$` or display `$$...$$`, on either side of
  the card.
- **Cite every card drawn from the bank**: course code, module, topic title.
  A card written from a topic description rather than a specific retrieved
  fact is `[generated]` and stays visually separate from bank-cited cards.
- **Order by module, then by the outline's own topic order** — never by
  difficulty or by when the card was written.

## Tutor mode

The student drafts; this skill critiques.

1. Ask the student to draft one card (or paste a small batch) rather than
   writing cards for them.
2. Check each card against the cloze deletion rules above. Name which rule a
   card breaks, don't just say it's wrong — "this card has two facts, split
   it" beats "needs work."
3. If a card asserts something the bank doesn't support, say so and ask for
   the source rather than silently accepting it.
4. Offer one rewritten example per problem found, not a rewrite of the whole
   deck — the student should apply the fix themselves to the next card.
5. Track which rules a student keeps breaking across the session and name the
   pattern once it repeats, rather than repeating the same note every card.
6. Close a batch with a short tally: cards ready to study, cards needing a
   split, cards needing a citation.

## Draft mode

Produce, in order:

1. **The deck** — cards grouped by module in outline order, following every
   cloze deletion rule above.
2. **An Anki export.** Plain-text, tab-separated, one card per line: `front
   <TAB> back <TAB> tags`. Tags are `module::<module-name>` and, for
   bank-cited cards, `source::<paper>-<year>` when a paper year exists. Say
   plainly that this is Anki's basic tab-separated import format (File →
   Import in Anki Desktop) — StudyHub does not generate a `.apkg` file.
3. **A review schedule.** Spaced repetition, not a fixed calendar: day 1, day
   2, day 4, day 7, day 14, day 30 from first study, restarting a card's
   schedule from day 1 whenever the student reports missing it. State the
   schedule against the student's stated exam date if one was given, and flag
   any card whose day-30 review would land after the exam.
4. **A coverage note**: topics in the outline the deck does not touch.

## Failure handling

- No bank material for a topic: say so, offer a generated card set, label it
  clearly, and ask the student to supply source material if accuracy matters.
- Topic ambiguous: list the candidates and ask which, rather than guessing.
- Tools error or time out: fall back to supplied material and say the bank
  was unreachable. Never present generated cards as bank-cited ones.
