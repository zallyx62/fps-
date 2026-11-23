# RIXE — Claude Code Operating Instructions

These instructions define **how to work**, not what features RIXE should contain. Keep this file short, stable and operational. The approved project specification is the authority for product scope.

## 1. Project and source-of-truth hierarchy

- Project: **RIXE**, a multiplayer arena FPS built with **Unreal Engine 5.8**, primarily using Blueprints.
- Goal: deliver a genuinely playable, stable, maintainable FPS. Never confuse planned scope with implemented or validated functionality.
- `CAHIER_DES_CHARGES_RIXE.md` is the sole authority for approved features, product decisions, exclusions, dependencies and roadmap.
- `UNREAL.md` records the observed Unreal project, implementation details, technical findings and historical tests. It is not a product specification.
- `SUIVI_PHASES_RIXE.md` records current progress, phase status, test evidence, blockers and next verifiable actions. Revalidate dated claims against the current commit.
- Other documents (including licence, build, asset or technical records) are authoritative only within their stated subject. Follow references in the specification.
- This file governs workflow and safety. It must not duplicate the feature catalogue, technical state or roadmap.

If sources conflict, identify the exact passages and dates. Apply an explicitly approved, unambiguous newer decision; otherwise stop and ask the owner. Never resolve uncertainty by silently deleting, weakening or inventing a requirement.

## 2. Session start: establish the real state

Before resuming work, do not rely on memory, old summaries or a previous session report.

1. Inspect the local workspace first: repository root, current branch, HEAD, `git status`, untracked files, local changes, running Unreal instances and available project/tool versions. Do not overwrite, reset, clean or discard work you do not understand.
2. Fetch current remote references. Verify the latest `main` commit, the task branch, relevant open PRs, recent commits and relevant CI/workflow results. Check whether `jeu-unreal` still matches `main`.
3. Read this file and the current `SUIVI_PHASES_RIXE.md`. Read `UNREAL.md` only where the task needs implementation or environment context.
4. Inspect the specification's heading/index structure, identify the sections relevant to the task, then read those sections **in full**, including their explicitly referenced dependencies and acceptance criteria. Do not read the entire specification by default.
5. Summarize the verified handoff briefly: active phase, last code commit actually tested, changes since that evidence, current blocker and next verifiable action.

If the local project or required tools are unavailable, state exactly what could and could not be verified. Never imply that a local build, Blueprint inspection or runtime test occurred when it did not.

## 3. Specification discovery and change control

Use the specification dynamically; section numbers and titles can change.

- For ordinary implementation, search the specification for the feature, its owner system, dependencies, constraints, exclusions and acceptance criteria. Read the complete relevant sections and follow their cross-references.
- For architecture-wide, security, licence, release or migration work, broaden the inspection to every affected system and dependency. A targeted search must not become an excuse to miss a consequential requirement.
- For a proposed new feature or idea, first search the **entire current specification** and all available decision/proposal records and conversation context for existing, overlapping, rejected or deferred ideas. Compare user outcome and technical responsibility, not just wording. If prior conversation history is unavailable, disclose that limitation; do not claim exhaustive novelty.
- Preserve every approved requirement, including deferred requirements. Merge overlapping implementation under the existing owner system without dropping distinct approved behaviours.
- Do not add, remove, redesign or modify product scope, features, priorities, phases, milestones or deliverables without the owner's explicit approval. A request to investigate or recommend is not approval to implement.
- Before editing, state the task scope, relevant specification sections, intended files, approach and material risks. If an ambiguity changes product behaviour or scope, ask before proceeding.

For weapon work, use the exact approved weapon/source-game specification. Verify the source title, reference version or patch, configuration and test conditions; preserve the original weapon's documented characteristics as closely as the approved design requires. Do not invent reference statistics.

## 4. Git and delivery workflow

- `main` is the protected reference branch, **never a development workspace**.
- Create a dedicated task branch from the latest verified `main`. Inspect any existing candidate branch before reuse; confirm its base, commits and diff.
- Make focused, reviewable commits. Do not mix unrelated work. Never force-push, rewrite shared history or delete branches to hide divergence.
- Open a pull request to `main` with a factual summary, scope, tests, evidence and known limitations. Review the complete diff and changed-file list before merging.
- Merge only when the change is within the owner's authorization, the diff is correct, and required checks have completed successfully. If checks fail, are pending, or cannot be evaluated, report that state and stop rather than claiming validation.
- `jeu-unreal` is intended to be an exact mirror of `main`, maintained by the repository workflow. Never develop on it or force it. If it has unique commits or diverges, stop and request an explicit resolution.
- After a merge, verify the merge commit, resulting `main`, synchronization workflow and equality of `main` / `jeu-unreal` SHAs. Do not infer success from a workflow being merely queued or in progress.

Never amend unrelated files or historical branches as part of a task. Keep the change set limited to the approved scope.

## 5. Engineering workflow and quality bar

For each task:

1. Establish the expected behaviour and acceptance criteria from the approved specification.
2. Inspect the actual implementation and existing owner system before designing a change. Prefer extending the existing system over creating parallel systems.
3. Identify dependencies, failure modes, data impact, security implications and rollback needs. Make a concise plan.
4. Back up affected assets/data when appropriate and verify that the backup is usable before risky operations.
5. Implement the smallest coherent change that fully satisfies the approved requirement. Avoid speculative refactors and unrelated cleanup.
6. Validate progressively: syntax/static checks, Blueprint compilation, project compilation, editor/runtime tests, packaged-build tests, network tests and performance checks as applicable to the change.
7. Test relevant regressions in dependent systems. For networked behaviour, use multiple clients and, where relevant, separate machines/networks; local PIE alone does not prove Internet readiness.
8. Record exact branch/commit, environment, procedure, results, logs or artifacts, failures and limitations. Update the appropriate technical or progress document without duplicating the specification.
9. Review the final diff for unintended changes, secrets, generated files, licence changes and unsupported claims before committing.

Choose tests according to risk; do not run expensive or irrelevant suites merely for appearance. Equally, never skip a necessary test to save time or tokens.

A task is complete only when its implementation is present, relevant checks have passed, dependent systems have been checked, evidence and limitations are recorded, and the resulting commit/PR state is verified. If a check cannot be run, mark it **not run / not verified** and explain why. Never turn an assumption, editor-only test, documentation commit or CI lint pass into proof of a packaged build or working online game.

## 6. Safety, permissions, budget and licensing

The approved budget is **€0**.

- No purchases, subscriptions, paid plugins/assets, hosting, cloud compute, advertising, domains or other paid services without the owner's explicit approval.
- No public release, publication, irreversible/destructive operation, data deletion, production migration, ownership transfer or licence change without explicit approval.
- Never modify or replace `LICENSE` automatically. Do not claim that the project or its contents are redistributable until the applicable Unreal/Epic, third-party, plugin, asset, font, audio and code rights have been checked against the current licence records and official terms.
- Protect credentials, tokens, signing keys, account data, private user information and local project data. Never commit secrets or expose sensitive logs. Use approved local secret-management mechanisms.
- Before a risky operation, explain the impact, create a recoverable backup and verify the rollback path. If safe recovery cannot be established, stop and ask.
- Use only tools, permissions and capabilities actually available in the current environment. Do not bypass permission prompts, security controls or tool restrictions.

Autonomous execution is welcome **inside the approved scope**. It does not grant authority to spend money, expand scope, publish, destroy data or make legal/licensing decisions.

## 7. Builds, artifacts and reporting

When a change modifies the game, the owner expects a testable build link whenever a valid build can be produced.

- Produce a Windows x64 Development or Shipping package when the environment and project state permit it.
- Share a direct link only after the artifact exists and the exact link has been verified. Identify its version, branch, commit, platform and build configuration.
- Report what was actually tested, including player count, network conditions and hardware when relevant. Separate successful, failed, blocked and untested checks.
- If packaging or sharing is unavailable, say **unavailable**, explain the blocker and provide the strongest valid test evidence instead. Source-code links are not game-build links.
- Do not use the web prototype as a substitute for the Unreal game.
- Do not publish a public release or expose an artifact publicly without the required owner approval and licence/security checks.

Keep reports concise and evidence-led: **scope / changes / tests and evidence / limitations or blockers / PR and build links / next action**. Do not repeat unchanged project context.

## 8. Mandatory English-first convention

Use English exclusively for RIXE working communication, explanations, reports, code, identifiers, comments, technical documentation, GitHub content and commit messages, unless the owner explicitly requests another language.

Write all new or modified technical content in English. Do not translate existing French project documents wholesale or change them solely to enforce this convention. Prefer official English technical documentation.

This is a working convention only. It creates no feature, task, phase, milestone, deliverable or roadmap change.

## 9. Token and context discipline

Maximize engineering quality per token, not token reduction at any cost.

- Load only the files and ranges needed for the task; use headings, targeted search and cross-references before reading large documents.
- Do not reread unchanged content already available in context unless freshness or correctness requires it.
- Do not load or summarize the full repository or full specification by default.
- Expand inspection when the task is broad, cross-cutting, safety-critical or requires a novelty/completeness audit.
- Avoid redundant searches, tool calls, repeated explanations and unnecessary progress messages.
- Use parallel work or subagents only when independent work provides a real benefit greater than its coordination cost.
- Keep plans and reports compact, but preserve reasoning, edge-case analysis, implementation quality, required tests, security checks and evidence.
- Never sacrifice correctness, completeness, maintainability or safety to reduce context usage.

**Operating principle:** use the smallest sufficient context and workflow that can reliably complete the task—not the smallest possible context.