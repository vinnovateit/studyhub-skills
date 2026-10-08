# Citation styles — exhaustive reference

This file is loaded only in clients that can read a skill's `references/`
directory (Claude Code, Codex, Cursor). The StudyHub app injects only
`SKILL.md`'s body, so the quick reference there must stand alone — treat this
file as depth for a CLI agent, never as the only place a rule lives.

## APA (7th edition)

- **In-text**: `(Author, Year)`; page/paragraph for direct quotes:
  `(Author, Year, p. 12)`. Three or more authors: `(Author et al., Year)`
  from the first citation.
- **Reference list**: titled "References", alphabetical by first author's
  surname, hanging indent. Title in sentence case; journal/book title in
  title case and italics.
- **Example (journal)**: Smith, J., & Lee, A. (2021). Attention and working
  memory in adolescents. *Journal of Cognitive Development*, 12(3), 45-60.
- **Example (book)**: Smith, J. (2019). *Cognitive psychology* (3rd ed.).
  Academic Press.
- **DOI**: append as a URL, `https://doi.org/10.xxxx/xxxx`, no "Retrieved
  from" preamble.

## MLA (9th edition)

- **In-text**: `(Author page)`, no comma, no "p." — `(Smith 45)`. No page
  number for a source without stable pagination.
- **Works Cited**: alphabetical, title case for titles, "container" model:
  Author. "Title of Source." *Title of Container*, Publisher, Publication
  date, Location.
- **Example**: Smith, Jane. "Attention in Adolescents." *Journal of Cognitive
  Development*, vol. 12, no. 3, 2021, pp. 45-60.
- Two authors: "Smith, Jane, and Alan Lee." Three or more: "Smith, Jane, et
  al."

## Harvard (author-date)

- **In-text**: `(Author Year)` or `(Author Year, p. 12)` for quotes — house
  variants vary on the comma; be consistent within one document rather than
  picking a single universal rule.
- **Reference list**: titled "References" or "Bibliography" depending on the
  institution's own style guide — ask the student which their department
  uses if it matters.
- **Example**: Smith, J. and Lee, A. (2021) 'Attention and working memory in
  adolescents', Journal of Cognitive Development, 12(3), pp. 45-60.

## Chicago (notes-bibliography, 17th edition)

- **First footnote**: full form — Jane Smith, "Attention and Working Memory
  in Adolescents," *Journal of Cognitive Development* 12, no. 3 (2021): 47.
- **Subsequent footnote for the same source**: short form — Smith,
  "Attention," 52.
- **Bibliography**: alphabetical by surname, full publication details,
  separate from the notes.
- Chicago also has an author-date variant closer to Harvard/APA; ask which
  variant the student's department requires before drafting citations.

## IEEE

- **In-text**: bracketed number in citation order, `[1]`, `[2]` — not
  alphabetical, and a source keeps its number everywhere it's cited again.
- **Reference list**: numbered in the same order as first appearance, not
  alphabetical by author.
- **Example**: [1] J. Smith and A. Lee, "Attention and working memory in
  adolescents," *J. Cogn. Dev.*, vol. 12, no. 3, pp. 45-60, 2021.

## Choosing a style when the student doesn't know

Ask what discipline and institution the piece is for — humanities defaults
toward MLA or Chicago, sciences and engineering toward APA or IEEE, and many
UK institutions default to Harvard regardless of discipline. Never assume;
the wrong style is a real mark deduction in most rubrics.
