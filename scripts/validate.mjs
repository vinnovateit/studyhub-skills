#!/usr/bin/env node
// Enforces the portability contract and the registry schema.
//
// The contract exists because a SKILL.md here has to run unchanged in Claude
// Code, Codex, Cursor, Copilot and inside the StudyHub app. Every rule below is
// a thing that works in one client and breaks in another, or a thing the app
// cannot honour because it injects the body and nothing else.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { BEGIN, END, parseSkill, readJSON, skillIds, skillPath } from "./lib.mjs";

// Frontmatter keys that some clients honour and others ignore. Allowing one
// would let a skill quietly depend on the client it was written in.
const ALLOWED_KEYS = new Set(["name", "description"]);
// Files that pin a skill to one vendor's runtime.
const VENDOR_FILES = ["agents/openai.yaml"];
// Permitted entries inside skills/<id>/. The body must stand alone, while depth
// belongs in references/, assets/ or scripts/ for CLI agents that can read them.
const PERMITTED_SKILL_CHILDREN = new Set(["SKILL.md", "references", "assets", "scripts"]);
// The app injects the body into a prompt, so a long one crowds out the
// conversation. Depth belongs in references/, which the app never reads.
const MAX_BODY_LINES = 200;

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

// ---------------------------------------------------------------------------
// skills/

const ids = skillIds();
if (ids.length === 0) fail("skills/", "no skills found");

for (const id of ids) {
  const path = skillPath(id);
  if (!existsSync(path)) {
    fail(`skills/${id}`, "has no SKILL.md");
    continue;
  }

  const text = readFileSync(path, "utf8");
  const { frontmatter, body } = parseSkill(text);

  if (!frontmatter) {
    fail(path, "has no YAML frontmatter");
    continue;
  }

  // Non-portable frontmatter checks: reject context: fork, when_to_use, allowed-tools
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const rawFm = fmMatch ? fmMatch[1] : "";
  if (/\bcontext\s*:\s*fork\b/i.test(rawFm)) {
    fail(path, 'non-portable frontmatter "context: fork" is rejected — skills must run across all clients');
  }
  if (/\bwhen_to_use\s*:/i.test(rawFm)) {
    fail(path, 'non-portable frontmatter "when_to_use" is rejected — use description instead');
  }
  if (/\ballowed-tools\s*:/i.test(rawFm)) {
    fail(path, 'non-portable frontmatter "allowed-tools" is rejected — tool permissions belong in client runtime');
  }

  for (const key of Object.keys(frontmatter)) {
    if (!ALLOWED_KEYS.has(key)) {
      fail(path, `frontmatter key "${key}" is not portable — only name and description are allowed`);
    }
  }

  if (frontmatter.name !== id) {
    fail(path, `frontmatter name "${frontmatter.name}" does not match the directory name "${id}"`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    fail(path, `"${id}" is not kebab-case`);
  }

  const description = frontmatter.description ?? "";
  if (description.length < 40) {
    fail(path, "description is too short to trigger reliably — say what it does and when to use it");
  }
  if (description.length > 1024) {
    fail(path, `description is ${description.length} characters, over the 1024 limit`);
  }

  if (!text.includes(BEGIN) || !text.includes(END)) {
    fail(path, "is missing the shared/modes.md markers — every skill states the mode contract");
  }

  const lines = body.trim().split(/\r?\n/).length;
  if (lines > MAX_BODY_LINES) {
    fail(path, `body is ${lines} lines, over the ${MAX_BODY_LINES} limit — move depth into references/`);
  }

  // Permitted directory contents: only SKILL.md, references/, assets/, scripts/
  const children = readdirSync(`skills/${id}`);
  for (const child of children) {
    if (!PERMITTED_SKILL_CHILDREN.has(child)) {
      fail(`skills/${id}/${child}`, `is not permitted — only SKILL.md, references/, assets/, and scripts/ are allowed`);
    }
  }

  for (const vendorFile of VENDOR_FILES) {
    if (existsSync(`skills/${id}/${vendorFile}`)) {
      fail(path, `${vendorFile} pins this skill to one vendor's runtime`);
    }
  }
}

// ---------------------------------------------------------------------------
// sources.json — third-party pointers

const sources = readJSON("sources.json").sources ?? [];
const seen = new Set(ids);

for (const [index, source] of sources.entries()) {
  const where = `sources.json[${index}]${source.id ? ` (${source.id})` : ""}`;

  for (const field of ["id", "type", "name", "description", "url", "license", "author"]) {
    if (!source[field]) fail(where, `is missing "${field}"`);
  }
  if (!["skill", "mcp", "subagent"].includes(source.type)) {
    fail(where, `type "${source.type}" must be skill, mcp or subagent`);
  }
  if (source.id && seen.has(source.id)) {
    fail(where, `id "${source.id}" is already taken`);
  }
  seen.add(source.id);

  if (source.body) {
    fail(where, "third-party entries are listed, never shipped — they cannot carry a body");
  }

  // A student deciding whether to install something needs to know what it can
  // reach. CI cannot judge that, so it only enforces that a human answered.
  const accesses = source.review?.accesses;
  if (!Array.isArray(accesses)) {
    fail(where, "review.accesses is mandatory — list what this entry can access");
  } else if (source.type === "mcp" && accesses.length === 0) {
    fail(where, "an MCP server with an empty review.accesses has not been reviewed");
  }
  if (!["reviewed", "unreviewed"].includes(source.review?.status)) {
    fail(where, 'review.status must be "reviewed" or "unreviewed" for third-party entries');
  }

  if (!source.setup?.steps?.length) {
    fail(where, "needs setup.steps — the app links out with instructions, it never configures anything");
  }
}

// ---------------------------------------------------------------------------

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`OK — ${ids.length} skill(s), ${sources.length} listed source(s).`);
