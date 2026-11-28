# RIXE — Claude Code Instructions

This file defines the agent workflow, not the product specification. Keep product requirements in their authoritative documents.

## 1. Source of truth

- `CAHIER_DES_CHARGES_RIXE.md`: approved features, decisions, exclusions, dependencies, priorities, roadmap and acceptance criteria.
- `UNREAL.md`: implementation and technical state actually observed in Unreal.
- `DECISIONS_GAMEPLAY_2026-11-25.md`: approved gameplay decisions and provisional tuning values; read it whenever combat, scoring, sprint, ADS or respawn behaviour is involved.
- `SUIVI_PHASES_RIXE.md`: verified progress, evidence, blockers and repository audit.
- `LICENCE_DISTRIBUTION.md`: third-party rights and distribution blockers.
- This file: session workflow, change control, safety and working conventions.

The gameplay decision record supplements the specification for approved rules and provisional tuning; it does not prove implementation. Historical notes are not proof of current implementation. If approved sources conflict, identify the exact passages and dates; ask the owner unless a clear, approved newer decision resolves the conflict.

## 2. Resume from verified state

At each new session:

1. Inspect the actual workspace: repository, branch, HEAD, `git status`, untracked/local changes, available tools and Unreal version. Never discard or overwrite work you do not understand.
2. Fetch current remote state. Verify `main`, the task branch, open PRs, relevant CI runs and whether `jeu-unreal` matches `main`.
3. Read this file and `SUIVI_PHASES_RIXE.md`. Consult `UNREAL.md`, `DECISIONS_GAMEPLAY_2026-11-25.md` and the licence register whenever relevant. The decision record resolves the Phase 2 gameplay questions it explicitly covers; do not ask the owner to decide them again unless a genuine conflict or new scope question exists.
4. Search the current specification for the task; read the complete relevant sections, dependencies and acceptance criteria. Do not load the whole specification or a fixed section range by default.
5. Briefly report the verified handoff: phase, last code commit actually tested, changes since that evidence, blockers and next verifiable action.

If local files, Unreal or required tools are unavailable, state what could not be inspected or tested. Never claim unperformed verification.

## 3. Scope and investigation

- Work only within the owner's approved scope. Research or recommendations are not permission to implement. Do not change product scope, features, priorities, phases or deliverables without approval.
- Before proposing a new feature, search the entire current specification and all available decision records, prior proposals and conversation history for existing, overlapping, rejected or deferred ideas. Compare user outcome and system responsibility, not just wording. Disclose unavailable history; do not claim exhaustive novelty.
- Inspect the real implementation and existing owner system before planning. Extend that system rather than creating a parallel one.
- Give a concise plan with scope, relevant requirements, files and material risks. Ask if ambiguity could change approved behaviour or scope.

## 4. Git workflow

Follow the repository and branch rules in the specification: `main` is the canonical reference, task work uses a dedicated branch and PR, and `jeu-unreal` is a mirror rather than a development branch. Never force-push, rewrite shared history or reset/clean unknown work.

Review the complete diff and changed-file list. Merge only approved changes after required checks succeed. After merging, verify the merge commit, CI and equality of the `main` / `jeu-unreal` SHAs. Never assume synchronization succeeded.

## 5. Engineering and evidence

Implement the smallest coherent change that meets the approved acceptance criteria. Select tests according to risk and affected systems; for networked changes, use multiple clients and separate machines/networks where relevant. Local PIE alone does not prove Internet readiness.

Record the exact code commit, environment, procedure, results, logs/artifacts, regressions and limitations. Mark unrun checks **not run / not verified** with the reason. Never treat assumptions, documentation changes, static CI or editor-only tests as proof of a packaged build or working online game.

Follow section 24 of the specification for build and delivery requirements. Never claim a build or link exists unless the artifact was actually produced and the exact link verified.

A task is complete only when its approved criteria and relevant checks are evidenced, limitations are declared, and the commit/PR state is verified.

## 6. Safety and authorization

Follow the autonomy, budget, security and licensing rules in specification sections 11 and 13–15, 25, plus `LICENCE_DISTRIBUTION.md`.

The approved budget is €0. No spending, public release/distribution, destructive or irreversible operation, data deletion or licence change without explicit owner approval. Never modify `LICENSE` automatically. Protect credentials and private data; back up affected data before risky operations and verify recovery. Stop if impact or rollback is unclear.

Autonomy applies only inside the approved scope.

## 7. English and context discipline

Use English for RIXE communication, code, identifiers, comments, GitHub content, commits and new or modified technical documentation unless the owner requests otherwise. Do not translate existing French documents wholesale. Prefer official English technical references.

Use the smallest context sufficient for reliable work: search first, then read complete relevant sections and dependencies. Expand to repository-wide inspection for cross-cutting, security-critical, completeness or novelty audits. Keep reports concise, never reasoning, validation or safety superficial to save tokens.