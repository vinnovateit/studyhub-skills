// Shared helpers for build.mjs and validate.mjs. No dependencies, deliberately:
// CI should not need an install step to check a repo of markdown files.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const SKILLS_DIR = "skills";
export const MODES_FILE = "shared/modes.md";
export const BEGIN = "<!-- BEGIN shared/modes.md — generated, do not edit here -->";
export const END = "<!-- END shared/modes.md -->";

/** Directory names under skills/, sorted so every output is deterministic. */
export function skillIds() {
  return readdirSync(SKILLS_DIR)
    .filter((name) => statSync(join(SKILLS_DIR, name)).isDirectory())
    .sort();
}

export function skillPath(id) {
  return `${SKILLS_DIR}/${id}/SKILL.md`;
}

/**
 * Splits a SKILL.md into its frontmatter and body.
 *
 * This parses the subset of YAML the portability contract allows — top-level
 * `key: value` pairs with optional indented continuation lines — rather than
 * pulling in a YAML library. Anything richer than that is a contract violation
 * and validate.mjs should be the thing that reports it, so unknown structure is
 * kept as a raw string here instead of throwing.
 */
export function parseSkill(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { frontmatter: null, body: text };

  const [, raw, body] = match;
  const frontmatter = {};
  let key = null;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const start = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (start && !/^\s/.test(line)) {
      key = start[1];
      frontmatter[key] = start[2].trim();
    } else if (key && /^\s+\S/.test(line)) {
      // Folded continuation: join with a space, the way YAML folds a plain scalar.
      frontmatter[key] = `${frontmatter[key]} ${line.trim()}`.trim();
    } else {
      key = null;
    }
  }

  return { frontmatter, body };
}

export function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

/** `exam-prep` -> `Exam Prep`. Display names are derived rather than stored so
 *  the portability contract can keep frontmatter to name + description. */
export function titleCase(id) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
