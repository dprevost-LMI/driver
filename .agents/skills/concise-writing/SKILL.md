---
name: concise-writing
description: Keep everything written in this repo — commit messages, PR titles/descriptions, and code comments — clear and terse. Use whenever creating a git commit, opening or updating a pull request, or writing/reviewing a code comment; also covers /commit and requests like "commit this", "open a PR", or "write a comment explaining this".
---

Everything written *about* the code in this repo — commit messages, PR descriptions, code comments — should say the minimum needed to be understood, and no more. The reader (a maintainer, a reviewer, a future agent) can already read the diff; don't narrate it back to them. Say what isn't obvious from the code itself: the *why*, not the *what*.

This applies across three surfaces. Jump to the one you need:

## Commit messages

Gather context first — run together, since none depends on the others:
- `git status` — what's changed and what's untracked
- `git diff` (unstaged) and `git diff --staged` — the actual content
- `git log --oneline -15` — refresh on this repo's message style

This repo's history is consistently `type: terse imperative summary`, e.g.:
```
fix: serialize per-package releases in release.yml
fix: correct .npmignore packaging rules across all 3 driver packages
test: split edgedriver's unit.test.ts by source module
fix: harden edgedriver install.ts against Windows and Zip Slip bugs
```
- One line, imperative mood, `type: summary`, no trailing period.
- Lead with *why*, not a mechanical restatement of the diff (bad: "update release.yml"; good: "detect which driver package changed before releasing 'all'").
- Only add a body if the one-liner genuinely can't carry the reasoning — rare in this repo's history. Default to skipping it.
- Pick the type by what changed: `fix`, `feat`, `test`, `ci`, `chore`, `docs`, `refactor`.

**Staging**: stage specific files by name (`git add path/to/file`), never a blanket `git add -A` or `git add .` — this repo's workflows and driver packages touch config and secrets-adjacent files, and a blind add risks scooping up something that doesn't belong. Check `git status` first for anything unexpected or secret-looking (`.env`, `credentials.json`, `*.pem`, `*token*`) and flag it instead of silently staging it.

**Committing**: pass the message via a heredoc so formatting survives:
```bash
git commit -m "$(cat <<'EOF'
type: terse summary here
EOF
)"
```
Append whatever attribution footer this session's own instructions specify — don't hardcode one here, since it can change independently of this skill.

Never amend an existing commit unless explicitly asked — a fresh commit is the default. Never pass `--no-verify` or otherwise skip hooks unless explicitly told to; if a pre-commit hook fails, fix the underlying issue and commit again. After committing, run `git status` to confirm it landed, and report back in one line what was committed — don't dump the full diff back at the user.

## PR titles and descriptions

- Title under ~70 characters, same "why, not what" rule as commit summaries — and same `type: summary` convention ([Conventional Commits](https://www.conventionalcommits.org/)) as the individual commits, e.g. `fix: ...`, `feat: ...`, `chore: ...`.
- **This matters more than it looks like it would**: PRs in this repo are squash-merged, so the PR title *becomes* the one commit message that survives on `main` — the individual commits inside the PR are gone forever. Each package's release now generates its GitHub Release notes from these types (`@release-it/conventional-changelog`, surfacing `feat`/`fix` commits). A PR titled `chore: ...` when it actually contains a fix means that fix silently never appears in any changelog. Get the type right on the title, not just on the commits inside it.
- Body: a short `## Summary` (1-3 bullets, what changed and why it was needed — not a file-by-file listing the diff already shows) plus a `## Test plan` checklist of what was actually run. Skip sections that would just restate the diff.
- Don't repeat the same information across every commit in the PR *and* the PR description *and* a summary comment — pick the level (usually the PR description) and let the rest stay terse.
- When reviewing someone else's PR description for terseness, flag sentences that only restate a line from the diff without adding reasoning, and padding like "This PR also includes minor cleanup" with nothing concrete after it.

## Code comments

Default to no comment. Well-named functions and variables already say *what* the code does. Only add a comment when it carries information the code can't:
- a non-obvious constraint or invariant
- the reason for a workaround (link the issue/bug if there is one)
- behavior that would genuinely surprise a reader

One line is almost always enough. This repo's existing multi-line comments are the exception that proves the rule — e.g. `packages/node-edgedriver/src/finder.ts` explains a 3-step platform-detection fallback that genuinely isn't obvious from the code alone — not a narration of what each line does. If removing a comment wouldn't leave a future reader confused, remove it.
