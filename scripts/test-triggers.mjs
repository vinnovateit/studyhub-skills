#!/usr/bin/env node
// Test runner for StudyHub Stage 1 Trigger Table.
// Verifies that:
// 1. All 4 required skills exist (exam-prep, flashcard-builder, academic-writing, stem-solver).
// 2. Each skill has exactly 3 realistic positive trigger phrasings.
// 3. Each skill has exactly 9 negative trigger phrasings (the 3 triggers from each of the other 3 skills).
// 4. No positive trigger overlaps with any sibling skill's positive triggers (zero cross-skill ambiguity).

import { readFileSync } from "node:fs";
import { join } from "node:path";

const TRIGGER_TABLE_PATH = join("shared", "trigger_table.json");

function main() {
  console.log("Checking Trigger Table data integrity...");

  let table;
  try {
    const raw = readFileSync(TRIGGER_TABLE_PATH, "utf8");
    table = JSON.parse(raw);
  } catch (err) {
    console.error(`FAIL: Unable to read trigger table from ${TRIGGER_TABLE_PATH}: ${err.message}`);
    process.exit(1);
  }

  const expectedSkills = [
    "exam-prep",
    "flashcard-builder",
    "academic-writing",
    "stem-solver",
  ];

  if (!table.skills || !Array.isArray(table.skills)) {
    console.error("FAIL: trigger table must contain a 'skills' array.");
    process.exit(1);
  }

  const skillMap = new Map();
  const allPositiveTriggers = new Map();
  let errors = 0;

  for (const skill of table.skills) {
    if (!skill.id) {
      console.error("FAIL: Found skill entry without an 'id'.");
      errors++;
      continue;
    }
    skillMap.set(skill.id, skill);

    // Check positive triggers
    if (!Array.isArray(skill.positive_triggers) || skill.positive_triggers.length !== 3) {
      console.error(`FAIL: [${skill.id}] must have exactly 3 positive triggers, got ${skill.positive_triggers?.length ?? 0}`);
      errors++;
    } else {
      for (const phrase of skill.positive_triggers) {
        if (!phrase || typeof phrase !== "string" || phrase.trim().length < 10) {
          console.error(`FAIL: [${skill.id}] has invalid/too-short phrasing: "${phrase}"`);
          errors++;
        }
        if (allPositiveTriggers.has(phrase)) {
          console.error(`FAIL: Ambiguous positive trigger! "${phrase}" is claimed by both [${allPositiveTriggers.get(phrase)}] and [${skill.id}]`);
          errors++;
        }
        allPositiveTriggers.set(phrase, skill.id);
      }
    }

    // Check negative triggers
    if (!Array.isArray(skill.negative_triggers) || skill.negative_triggers.length !== 9) {
      console.error(`FAIL: [${skill.id}] must have exactly 9 negative triggers, got ${skill.negative_triggers?.length ?? 0}`);
      errors++;
    }
  }

  // Ensure all 4 expected skills are present
  for (const exp of expectedSkills) {
    if (!skillMap.has(exp)) {
      console.error(`FAIL: Missing required skill in trigger table: [${exp}]`);
      errors++;
    }
  }

  // Cross-check: For each skill, its 9 negative triggers must be exactly the positive triggers of the other 3 skills
  for (const [id, skill] of skillMap.entries()) {
    const expectedNegatives = new Set();
    for (const [otherId, otherSkill] of skillMap.entries()) {
      if (otherId === id) continue;
      for (const p of otherSkill.positive_triggers || []) {
        expectedNegatives.add(p);
      }
    }

    const actualNegatives = new Set(skill.negative_triggers || []);
    for (const expNeg of expectedNegatives) {
      if (!actualNegatives.has(expNeg)) {
        console.error(`FAIL: [${id}] is missing negative cross-check for phrasing: "${expNeg}"`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\nTrigger Table validation failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log(`PASS: All 4 skills present with 12 distinct phrasings and 36 cross-skill negative checks verified.`);
}

main();

