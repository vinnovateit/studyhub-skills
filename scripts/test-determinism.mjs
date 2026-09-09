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
