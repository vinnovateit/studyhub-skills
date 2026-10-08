#!/usr/bin/env node
/**
 * Registry Determinism Hardening Test (Stage 3)
 *
 * Proves that running build.mjs repeatedly on the same inputs produces
 * byte-for-byte identical output files without timestamp drift or ordering variations.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { BEGIN, END, MODES_FILE, skillIds, skillPath } from "./lib.mjs";

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

console.log("=== Testing Registry Determinism ===");

// 1. Run build
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "pipe" });

const reg1 = readFileSync("registry.json", "utf8");
const mark1 = readFileSync(".claude-plugin/marketplace.json", "utf8");

const hashReg1 = sha256(reg1);
const hashMark1 = sha256(mark1);

// 2. Run build again
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "pipe" });

const reg2 = readFileSync("registry.json", "utf8");
const mark2 = readFileSync(".claude-plugin/marketplace.json", "utf8");

const hashReg2 = sha256(reg2);
const hashMark2 = sha256(mark2);

if (hashReg1 !== hashReg2) {
  console.error("Determinism failure: registry.json hashes differ between runs!");
  console.error(`Run 1: ${hashReg1}`);
  console.error(`Run 2: ${hashReg2}`);
  process.exit(1);
}

if (hashMark1 !== hashMark2) {
  console.error("Determinism failure: marketplace.json hashes differ between runs!");
  console.error(`Run 1: ${hashMark1}`);
  console.error(`Run 2: ${hashMark2}`);
  process.exit(1);
}

// 3. Verify --check passes cleanly
try {
  execFileSync(process.execPath, ["scripts/build.mjs", "--check"], { stdio: "pipe" });
} catch (err) {
  console.error("build.mjs --check failed on fresh build:", err.message);
  process.exit(1);
}

console.log("OK — Proved byte-identical output across multiple build runs.");
console.log(`  registry.json SHA-256:       ${hashReg1}`);
console.log(`  marketplace.json SHA-256:    ${hashMark1}`);

// 4. Mode-block byte-identity: after build.mjs injects shared/modes.md into
// every skill body, the injected block itself must be byte-identical across
// all of them. Drift here is invisible in review (each body still reads
// fine on its own) and only a test catches it — see shreya.md's "mode-block
// byte-identity test" requirement.
console.log("=== Testing mode-block byte-identity across skill bodies ===");

const modes = readFileSync(MODES_FILE, "utf8").replace(/\r\n/g, "\n").trim();
const ids = skillIds();
if (ids.length === 0) {
  console.error("No skills found under skills/ — nothing to compare.");
  process.exit(1);
}

const blocksByHash = new Map();
for (const id of ids) {
  const text = readFileSync(skillPath(id), "utf8").replace(/\r\n/g, "\n");
  const begin = text.indexOf(BEGIN);
  const end = text.indexOf(END);
  if (begin === -1 || end === -1) {
    console.error(`skills/${id}/SKILL.md: missing the shared/modes.md markers`);
    process.exit(1);
  }
  const block = text.slice(begin + BEGIN.length, end).trim();
  if (block !== modes) {
    console.error(`skills/${id}/SKILL.md: injected mode block does not match shared/modes.md`);
    process.exit(1);
  }
  const hash = sha256(block);
  if (!blocksByHash.has(hash)) blocksByHash.set(hash, []);
  blocksByHash.get(hash).push(id);
}

if (blocksByHash.size > 1) {
  console.error("Determinism failure: mode blocks differ across skill bodies!");
  for (const [hash, matchingIds] of blocksByHash) {
    console.error(`  ${hash}: ${matchingIds.join(", ")}`);
  }
  process.exit(1);
}

console.log(`OK — mode block is byte-identical across ${ids.length} skill bod${ids.length === 1 ? "y" : "ies"}: ${ids.join(", ")}.`);
