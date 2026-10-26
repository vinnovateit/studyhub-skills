#!/usr/bin/env node
// Check trigger coverage and exclusions against the installed skill catalog.

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJSON, skillIds } from "./lib.mjs";

const normalize = (phrase) => phrase.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();

export function checkTriggerTable(table, expectedSkills = skillIds()) {
  if (!Array.isArray(table?.skills)) return ["trigger table must contain a skills array"];

  const expected = new Set(expectedSkills);
  const skills = new Map();
  const positives = new Map();
  const problems = [];
  const negativeCount = Math.max(0, expected.size - 1) * 3;

  for (const skill of table.skills) {
    if (!expected.has(skill?.id)) {
      problems.push(`unknown skill: ${skill?.id ?? "missing id"}`);
      continue;
    }
    if (skills.has(skill.id)) {
      problems.push(`duplicate skill: ${skill.id}`);
      continue;
    }
    skills.set(skill.id, skill);

    if (!Array.isArray(skill.positive_triggers) || skill.positive_triggers.length !== 3) {
      problems.push(`${skill.id}: expected exactly 3 positive triggers`);
    }
    for (const phrase of Array.isArray(skill.positive_triggers) ? skill.positive_triggers : []) {
      if (typeof phrase !== "string" || phrase.trim().length < 10) {
        problems.push(`${skill.id}: invalid positive trigger`);
        continue;
      }
      const key = normalize(phrase);
      if (positives.has(key)) problems.push(`${skill.id}: duplicate positive trigger from ${positives.get(key)}`);
      positives.set(key, skill.id);
    }
    if (!Array.isArray(skill.negative_triggers) || skill.negative_triggers.length !== negativeCount) {
      problems.push(`${skill.id}: expected exactly ${negativeCount} negative triggers`);
    }
  }

  for (const id of expected) {
    if (!skills.has(id)) problems.push(`missing skill: ${id}`);
  }

  for (const [id, skill] of skills) {
    const expectedNegatives = new Set([...positives].filter(([, owner]) => owner !== id).map(([phrase]) => phrase));
    const negatives = Array.isArray(skill.negative_triggers) ? skill.negative_triggers : [];
    const actualNegatives = new Set();
    for (const phrase of negatives) {
      if (typeof phrase !== "string" || phrase.trim().length < 10) {
        problems.push(`${id}: invalid negative trigger`);
        continue;
      }
      const key = normalize(phrase);
      if (actualNegatives.has(key)) problems.push(`${id}: duplicate negative trigger`);
      actualNegatives.add(key);
      if (!expectedNegatives.has(key)) problems.push(`${id}: unexpected negative trigger: ${phrase}`);
    }
    for (const phrase of expectedNegatives) {
      if (!actualNegatives.has(phrase)) problems.push(`${id}: missing negative trigger: ${phrase}`);
    }
  }
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const table = readJSON("shared/trigger_table.json");
    const problems = checkTriggerTable(table);
    if (problems.length) {
      for (const problem of problems) console.error(`FAIL: ${problem}`);
      process.exitCode = 1;
    } else {
      const positiveCount = table.skills.reduce((total, skill) => total + skill.positive_triggers.length, 0);
      const negativeCount = table.skills.reduce((total, skill) => total + skill.negative_triggers.length, 0);
      console.log(`OK: ${table.skills.length} skills, ${positiveCount} distinct trigger examples and ${negativeCount} negative checks.`);
    }
  } catch (error) {
    console.error(`FAIL: cannot validate trigger table: ${error.message}`);
    process.exitCode = 1;
  }
}
