#!/usr/bin/env node
// Generates everything derived from skills/ and sources.json:
//
//   1. Injects shared/modes.md into each SKILL.md, between its markers.
//      Injection is in place and committed, because registry.json points the
//      app straight at skills/<id>/SKILL.md — there is no dist copy to read.
//   2. Emits registry.json, the catalog the StudyHub directory fetches.
//
// Run with --check to verify the committed files are current without writing
// anything. CI uses that; it is what stops a hand-edited generated block from
// silently drifting.

import { readFileSync, writeFileSync } from "node:fs";
import {
  BEGIN,
  END,
  MODES_FILE,
  parseSkill,
  readJSON,
  skillIds,
  skillPath,
  titleCase,
} from "./lib.mjs";

// Repo-level facts about the skills this repo owns. Third-party entries carry
// their own equivalents in sources.json.
const OWNER = { name: "StudyHub", url: "https://github.com/studyhub" };
const LICENSE = "MIT";
const PLATFORMS = ["claude-code", "codex", "cursor", "studyhub"];
const SUBJECTS = ["general"];

const check = process.argv.includes("--check");
const changed = [];

function emit(path, next) {
  const current = (() => {
    try {
      return readFileSync(path, "utf8");
    } catch {
      return null;
    }
  })();
  // Compare on normalised line endings so a Windows checkout does not report
  // every file as stale.
  if (current !== null && current.replace(/\r\n/g, "\n") === next) return;
  changed.push(path);
  if (!check) writeFileSync(path, next);
}

// ---------------------------------------------------------------------------
// 1. Inject the mode contract

const modes = readFileSync(MODES_FILE, "utf8").replace(/\r\n/g, "\n").trim();
const ids = skillIds();

for (const id of ids) {
  const path = skillPath(id);
  const text = readFileSync(path, "utf8").replace(/\r\n/g, "\n");

  const begin = text.indexOf(BEGIN);
  const end = text.indexOf(END);
  if (begin === -1 || end === -1) {
    console.error(`${path}: missing the shared/modes.md markers`);
    process.exit(1);
  }

  const next =
    text.slice(0, begin + BEGIN.length) + "\n" + modes + "\n" + text.slice(end);
  emit(path, next);
}

// ---------------------------------------------------------------------------
// 2. Build the registry

const entries = ids.map((id) => {
  const { frontmatter } = parseSkill(readFileSync(skillPath(id), "utf8"));
  return {
    id,
    type: "skill",
    name: titleCase(id),
    description: frontmatter?.description ?? "",
    author: OWNER,
    license: LICENSE,
    subjects: SUBJECTS,
    platforms: PLATFORMS,
    body: skillPath(id),
    setup: null,
    review: { status: "own", accesses: [] },
  };
});

for (const source of readJSON("sources.json").sources) {
  entries.push({
    id: source.id,
    type: source.type,
    name: source.name,
    description: source.description,
    author: source.author,
    license: source.license,
    url: source.url,
    subjects: source.subjects ?? SUBJECTS,
    platforms: source.platforms ?? [],
    // Third-party entries are pointers. The app never has a body to inject and
    // never proxies or hosts one — it shows the setup steps and links out.
    body: null,
    setup: source.setup ?? null,
    review: source.review,
  });
}

entries.sort((a, b) => a.id.localeCompare(b.id));

// No timestamp: the registry must regenerate byte-for-byte so --check is
// meaningful and diffs only ever show real changes.
emit("registry.json", JSON.stringify({ version: 1, entries }, null, 2) + "\n");

// ---------------------------------------------------------------------------

if (check && changed.length) {
  console.error("Generated files are out of date. Run `npm run build`:");
  for (const path of changed) console.error(`  ${path}`);
  process.exit(1);
}

console.log(
  changed.length
    ? `Wrote ${changed.length} file(s):\n  ${changed.join("\n  ")}`
    : "Everything already up to date.",
);
console.log(`registry.json: ${entries.length} entries (${ids.length} owned).`);
