<!-- StudyHub Skills Pull Request Template -->
## Submission Type
- [ ] **Native Skill** (added under `skills/<id>/`)
- [ ] **Third-Party Listing** (pointer added to `sources.json`)
- [ ] **Tooling / CI / Documentation**

---

## Entry Metadata (Required for Skills & Third-Party Entries)
- **ID / Name**: 
- **Type**: `skill` | `mcp` | `subagent`
- **Author / Maintainer**: 
- **License**: 
- **Upstream Source URL**: 
- **Target Platforms**: `[claude-code, codex, cursor, studyhub]`

---

## Security & Access Review (`review.accesses`)
*Specify what resources or environments this skill/tool accesses:*
- [ ] Network (outbound API calls)
- [ ] Local Filesystem (read / write)
- [ ] Environment Variables / Tokens
- [ ] Terminal / Shell Execution
- [ ] None (pure prompt / in-context reasoning)

**Access Details**: 

---

## Contributor Verification Checklist
- [ ] I have run `npm test` locally (`npm run validate && npm run check`) and all checks pass cleanly.
- [ ] **Portability Contract**: No non-portable frontmatter (`context: fork`, `when_to_use`, `allowed-tools`) or vendor lock-in files (`agents/openai.yaml`).
- [ ] **Mode Contract**: Includes `shared/modes.md` markers and defaults to Tutor mode.
- [ ] **Body Length**: Main `SKILL.md` body is under 200 lines; deep docs/scripts are in `references/`, `assets/`, or `scripts/`.
- [ ] **Registry Determinism**: Ran `npm run build` to update `registry.json` and `.claude-plugin/marketplace.json` byte-identically.
