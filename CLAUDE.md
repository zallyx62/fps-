# RIXE — Claude Code Instructions

This file defines the agent's operating rules, not RIXE's product specification. Keep product requirements in their authoritative documents; do not maintain a second copy here.

## 1. Authority and document roles

- `CAHIER_DES_CHARGES_RIXE.md` is the sole source of truth for approved features, decisions, exclusions, dependencies, priorities, roadmap and acceptance criteria.
- `UNREAL.md` records the implementation and technical state actually observed in Unreal. Historical editor tests are not proof of current build or network behaviour.
- `SUIVI_PHASES_RIXE.md` records verified progress, evidence, blockers and the current repository audit.
- `LICENCE_DISTRIBUTION.md` records third-party rights and distribution blockers. The root `LICENSE` file does not establish that every project asset is redistributable.
- This file governs how to resume, investigate, change, test and deliver work. It does not override the approved specification.

If documents conflict, identify the exact passages and dates. Apply only a clear, explicitly approved newer decision; otherwise stop and ask. Never silently invent, weaken or discard a requirement.

## 2. Resume from verified state

At the start of each session:

1. Inspect the actual workspace: repository root, branch, HEAD, `git status`, untracked/local changes, available tools and Unreal version. Never overwrite or discard work you do not understand.
2. Fetch current remote state. Verify `main`, the task branch, open PRs, relevant CI runs and whether `jeu-unreal` matches `main`.
3. Read this file and the current `SUIVI_PHASES_RIXE.md`. Consult `UNREAL.md` and the licence register when relevant.
4. Find the current specification sections relevant to the task. Read each relevant section in full, including its dependencies, cross-references and acceptance criteria. Do not read all sections by default and do not blindly use obsolete section-number ranges.
5. State the verified handoff briefly: current phase, last code commit actually tested, changes since that evidence, blockers and next verifiable action.

If the local project, editor or required tools are unavailable, say exactly what could not be inspected or tested. Never imply that local files, Blueprints or runtime behaviour were verified when they were not.

## 3. Scope and investigation

- Work only within the owner's explicitly approved scope. A request to research, audit or recommend is not permission to implement. Do not add, remove or redesign features, priorities, phases, milestones or deliverables without approval.
- Before proposing a new feature, search the entire current specification and all available decision records, prior proposals and conversation history for existing, overlapping, rejected or deferred ideas. Compare the user outcome and system responsibility, not just wording. Disclose when prior history is unavailable; do not claim exhaustive novelty.
- Inspect the actual implementation and its existing owner system before planning a change. Prefer extending that system over creating parallel or duplicate systems.
- Give a concise plan covering scope, relevant requirements, intended files and material risks. Ask before proceeding if ambiguity could change approved behaviour or scope.

## 4. Git and review workflow

- `main` is the canonical reference branch, not a development branch. Create a dedicated task branch from the latest verified `main`.
- `jeu-unreal` is a mirror of `main`, not a development branch. Never develop on it or force-push it. If it diverges, stop and inspect the unique commits before any synchronization.
- Keep commits focused. Never force-push, rewrite shared history, or reset/clean unknown work.
- Open a PR to `main`. Review the full diff and changed-file list for scope, unintended changes, secrets, generated files and licence changes.
- Merge only within the approved scope and after required checks have completed successfully. Pending, failed or unavailable checks are not a pass.
- After merging, verify the merge commit, CI result and equality of the `main` and `jeu-unreal` SHAs. Never assume an automatic workflow succeeded.

## 5. Engineering, tests and evidence

- Implement the smallest coherent change that satisfies the approved acceptance criteria. Avoid speculative refactors and unrelated cleanup.
- Select validation according to risk: static checks, Blueprint/project compilation, editor/runtime tests, packaged builds, network tests and performance checks as applicable.
- For networked changes, test multiple clients and separate machines/networks when relevant. A local PIE test does not prove Internet readiness.
- Record the exact code commit, environment, procedure, results, logs/artifacts, regressions and limitations. Update the appropriate progress or technical record without copying product requirements into it.
- Mark checks that were not run as **not run / not verified**, with the reason. Never turn an assumption, documentation change, static CI pass or editor-only test into proof of a packaged build or working online game.
- For game changes, produce a Windows x64 test build and a verified direct link whenever the environment permits. Otherwise state that packaging or sharing was unavailable and explain why. Identify the tested commit and build configuration.

A task is complete only when its approved acceptance criteria and relevant checks are evidenced, limitations are declared, and the resulting commit/PR state is verified.

## 6. Safety and authorization

Follow the approved autonomy, budget, security and licensing requirements in the specification (especially sections 11, 13–15 and 25) and `LICENCE_DISTRIBUTION.md`.

- The current approved budget is €0. No purchase, subscription, paid service or other expenditure without explicit approval.
- No public release/distribution, irreversible or destructive operation, data deletion, production migration, ownership transfer or licence change without explicit approval.
- Never modify or replace `LICENSE` automatically. Protect credentials, tokens, signing keys and private data; never commit secrets.
- Back up affected data before risky operations and verify that recovery is possible. If the impact or rollback path is unclear, stop and ask.
- Autonomous execution is welcome inside the approved scope; it does not grant permission to spend, publish, destroy data or make legal decisions.

## 7. English and context discipline

Use English for RIXE working communication, code, identifiers, comments, GitHub content, commit messages and new or modified technical documentation, unless the owner explicitly requests otherwise. Do not translate existing French documents wholesale. Prefer official English technical references.

Use the smallest context sufficient for reliable work: search headings and relevant terms first, read complete relevant sections and dependencies, and avoid re-reading unchanged material. Expand to a repository-wide audit for cross-cutting, security-critical or completeness/novelty tasks. Keep reports concise, but never sacrifice reasoning, correctness, testing, maintainability or safety to save tokens.