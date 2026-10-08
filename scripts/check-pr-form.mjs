#!/usr/bin/env node
/**
 * CI PR Form Checker (Stage 4)
 *
 * Verifies that PR submissions include the mandatory fields and security disclosures
 * required by the maintainers:
 * - Submission Type
 * - Entry Metadata
 * - Security & Access Review (review.accesses)
 * - Contributor Verification Checklist
 */

import { existsSync, readFileSync } from "node:fs";

const REQUIRED_SECTIONS = [
  "## Submission Type",
  "## Entry Metadata",
  "## Security & Access Review",
  "## Contributor Verification Checklist",
];

const REQUIRED_FIELDS = [
  "**ID / Name**",
  "**Type**",
  "**Author / Maintainer**",
  "**License**",
  "**Target Platforms**",
  "**Access Details**",
];

export function validatePRFormText(bodyText) {
  const problems = [];
  if (!bodyText || bodyText.trim().length === 0) {
    return ["PR description is empty — submitters must complete the PR template."];
  }

  for (const sec of REQUIRED_SECTIONS) {
    if (!bodyText.includes(sec)) {
      problems.push(`Missing required section: '${sec}'`);
    }
  }

  for (const field of REQUIRED_FIELDS) {
    if (!bodyText.includes(field)) {
      problems.push(`Missing required field: '${field}'`);
    }
  }

  return problems;
}

// Check template existence
const templatePath = ".github/pull_request_template.md";
if (!existsSync(templatePath)) {
  console.error(`Missing PR template at ${templatePath}`);
  process.exit(1);
}

const templateContent = readFileSync(templatePath, "utf8");
const templateProblems = validatePRFormText(templateContent);
if (templateProblems.length > 0) {
  console.error("PR template is missing required sections:", templateProblems);
  process.exit(1);
}

// If PR_BODY is passed in environment or file argument, check it
const prBodyFile = process.argv[2];
const prBodyEnv = process.env.PR_BODY;

if (prBodyFile && existsSync(prBodyFile)) {
  const content = readFileSync(prBodyFile, "utf8");
  const problems = validatePRFormText(content);
  if (problems.length > 0) {
    console.error("PR Form Validation Failed:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
} else if (prBodyEnv) {
  const problems = validatePRFormText(prBodyEnv);
  if (problems.length > 0) {
    console.error("PR Form Validation Failed:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
}

// Self-test with sample PR body
const sampleBody = `
## Submission Type
- [x] **Native Skill**

## Entry Metadata
- **ID / Name**: flashcard-builder
- **Type**: skill
- **Author / Maintainer**: StudyHub
- **License**: MIT
- **Upstream Source URL**: N/A
- **Target Platforms**: [claude-code, codex, cursor, studyhub]

## Security & Access Review
- [x] None (pure prompt / in-context reasoning)
**Access Details**: No filesystem or network access needed.

## Contributor Verification Checklist
- [x] All checks pass
`;

const sampleProblems = validatePRFormText(sampleBody);
if (sampleProblems.length > 0) {
  console.error("Self-test failed on sample PR body:", sampleProblems);
  process.exit(1);
}

console.log("OK — PR template and form validation checks passed.");
