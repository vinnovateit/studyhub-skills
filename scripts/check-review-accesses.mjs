#!/usr/bin/env node
/**
 * review.accesses CI gate (Stage 4, Sam's lane — identity/credentials).
 *
 * Every `mcp`-type entry in registry.json is something a student can add
 * that talks to a third-party service on their behalf. Before it goes live,
 * a maintainer must have written down what it can reach — see
 * docs/card-review-rules.md. This is mandatory, not advisory: an entry with
 * no review.accesses array (or an empty one) means nobody actually looked,
 * so it fails the PR rather than waiting to fail the review.
 *
 * Dependency-free on purpose, like validate.mjs and check-pr-form.mjs: a PR
 * that only touches the registry should not wait on a lockfile.
 */

import { readJSON } from "./lib.mjs";

export function checkReviewAccesses(registry) {
  const problems = [];
  const entries = registry?.entries ?? [];

  for (const [index, entry] of entries.entries()) {
    if (entry?.type !== "mcp") continue;

    const where = `registry.json entries[${index}]${entry.id ? ` (${entry.id})` : ""}`;
    const accesses = entry.review?.accesses;

    if (!Array.isArray(accesses)) {
      problems.push(`${where}: missing review.accesses — every mcp entry must list what it can access`);
      continue;
    }
    if (accesses.length === 0) {
      problems.push(`${where}: review.accesses is empty — an MCP server with nothing listed has not been reviewed`);
    }
  }

  return problems;
}

const registry = readJSON("registry.json");
const problems = checkReviewAccesses(registry);

if (problems.length > 0) {
  console.error(`${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const mcpCount = (registry.entries ?? []).filter((e) => e.type === "mcp").length;
console.log(`OK — ${mcpCount} mcp entr${mcpCount === 1 ? "y" : "ies"} in registry.json, all with review.accesses.`);
