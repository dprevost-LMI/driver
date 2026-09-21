---
name: commit
description: Create a git commit in this repo with a clear, terse, Conventional-Commits-style message. Use whenever the user asks to commit, save, or check in their changes, or types /commit — even if they just say "commit this" or "commit that" with no other detail.
---

Commit the current changes with a message that matches this repo's existing style: short, imperative, prefixed with a Conventional Commits type, and focused on *why* the change was made rather than restating the diff.

## 1. Gather context

Run these together, not sequentially, since none depends on the others:
- `git status` — see what's changed and what's untracked
- `git diff` (unstaged) and `git diff --staged` (already staged) — see the actual content
- `git log --oneline -15` — refresh on this repo's message style before writing one

This repo's history is consistently `type: terse imperative summary`, e.g.:
```
fix: serialize per-package releases in release.yml
fix: correct .npmignore packaging rules across all 3 driver packages
test: split edgedriver's unit.test.ts by source module
fix: harden edgedriver install.ts against Windows and Zip Slip bugs
```
No bullet-point bodies, no restating every changed file — one line that says what changed and, where it's not obvious from the summary alone, why. Match that: `feat`, `fix`, `test`, `chore`, `docs`, `ci`, `refactor` are the types actually in use here.

## 2. Stage deliberately

Stage specific files by name (`git add path/to/file`), never a blanket `git add -A` or `git add .` — this repo's workflows and driver packages touch config, secrets-adjacent files (`.npmrc`, `.env*`, credentials), and generated output, and a blind add risks scooping up something that doesn't belong in the commit or the user didn't mean to include.

Before staging, check `git status` for anything unexpected: files you didn't touch this session, or filenames that look like they could hold secrets even if the diff looks innocuous (`.env`, `credentials.json`, `*.pem`, `*token*`). If something looks off, flag it to the user instead of silently staging it.

## 3. Write the message

- One line, imperative mood, `type: summary` — no period at the end, matching the log above.
- Lead with *why*, not a mechanical restatement of the diff (bad: "update release.yml"; good: "detect which driver package changed before releasing 'all'").
- Only add a body (blank line + short paragraph or bullets) if the one-liner genuinely can't carry the reasoning — this repo's history shows that's rare. Default to skipping it.
- Pick the type by what actually changed: `fix` for bug fixes, `feat` for new capability, `test` for test-only changes, `ci` for workflow/pipeline changes, `chore` for tooling/deps, `docs` for documentation only, `refactor` for no-behavior-change restructuring.

## 4. Commit

Pass the message via a heredoc so formatting survives:
```bash
git commit -m "$(cat <<'EOF'
type: terse summary here
EOF
)"
```
Append whatever attribution footer this session's own instructions specify (check for a system reminder about commit attribution) — don't hardcode one here, since it can change independently of this skill.

Never amend an existing commit unless the user explicitly asks for it — a fresh commit is the default even if a previous one was just made. Never pass `--no-verify` or otherwise skip hooks unless the user explicitly says to; if a pre-commit hook fails, fix the underlying issue and commit again rather than bypassing it.

## 5. Confirm

Run `git status` after the commit to confirm it landed cleanly, and report back in one line what was committed — don't dump the full diff back at the user, they already know what they changed.
