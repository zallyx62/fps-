# RIXE — Verifiable phase tracking

**Last verified update:** 24 November 2026  
**Repository:** `zallyx62/fps-`  
**Functional authority:** the latest approved `CAHIER_DES_CHARGES_RIXE.md`.

This document records demonstrated progress and audit evidence. It does not replace the product specification, Claude Code workflow instructions, the Unreal implementation log, or the licence register.

## 1. Current repository audit baseline

The following state was read directly from GitHub on 24 November 2026, before this maintenance PR, at `main` commit `df3fcfbe77de0f8790194d9f387d5bb36835b51a`.

| Item | Verified state |
|---|---|
| Canonical branch | `main` |
| Mirror branch | `jeu-unreal` |
| Baseline branch SHAs | Both `df3fcfbe77de0f8790194d9f387d5bb36835b51a` |
| Open pull requests | 0 |
| Tracked files | 588 |
| Recursive tree entries | 943, including directories |
| Unreal assets | 536 `.uasset` and 3 `.umap` |
| Content files | 541 |
| Sum of tracked file sizes | 165,778,865 bytes; not the Git clone or full history size |
| Exact duplicate Git blobs | None detected |
| Main workflow validation | Success — [run 45289174444](https://github.com/zallyx62/fps-/actions/runs/45289174444) |
| Mirror synchronization | Success — [run 45289174446](https://github.com/zallyx62/fps-/actions/runs/45289174446) |

The recursive tree was complete and not truncated. Blob equality detects identical files only; it does not identify duplicate functionality inside Blueprints or Unreal assets.

### Branch inventory

At the audit baseline, the repository had 12 branches: `main`, `jeu-unreal` and ten historical `docs/*` branches. The ten historical branches differ from `main` only in documentation and the already-removed `Tools/.gitignore`; no unique gameplay source, Unreal configuration or asset change was found. Their associated pull requests are already merged. They are obsolete working references, but their remote branch pointers have not been deleted.

`main` and `jeu-unreal` are identical at the audit baseline. The project specification defines `main` as canonical and `jeu-unreal` as a mirror, not an independent development branch.

GitHub reports `protected=false` for both branches and the repository rulesets query returned no rulesets. The detailed branch-protection endpoint was not accessible to the connected integration. Server-side protection is therefore not configured or verified by this audit; do not describe either branch as protected.

## 2. Product specification authority

The current specification contains 71 numbered top-level sections. Section 71 is the latest approved addition at this audit baseline.

- The specification remains the sole authority for approved features, exclusions, decisions, priorities, dependencies and acceptance criteria.
- No approved requirement may be removed, downgraded or treated as optional without the owner's explicit decision.
- Before a task, search for its relevant requirements and read the complete sections, dependencies and acceptance criteria. Do not load a fixed section range at every session start.
- For global audits, feature-novelty checks and cross-cutting work, broaden the search to the entire specification and applicable decision records.
- When requirements overlap, attach the work to the existing owning system and preserve cross-references. Escalate conflicting approved decisions instead of guessing.

## 3. Phase status

**No project phase is currently verified as complete.** Historical editor notes and GitHub static checks do not replace the acceptance evidence required by the specification.

| Phase | Required evidence | Status | Current evidence / blocker |
|---|---|---|---|
| 0 — Security and baseline | Verified backups, repository/environment audit, reproducible state and blockers identified | **Not verified** | GitHub repository audit only; local machine, backups, secrets and editor environment not inspected |
| 1 — First playable Windows loop | Reproducible packaged Windows build and complete playable match on a pilot map | **Not verified** | No packaged Windows build or verified download artifact recorded |
| 2 — FPS, combat, network and pilot map foundations | Stable combat, tested server authority, bots, progressive network tests and critical regressions fixed | **Not verified** | Historical PIE notes only; no current-commit test report meeting the full criteria |
| 3 — EOS and private sessions | Identity, invitations, private lobby, launch, return and reconnect tested end to end | **Not verified** | Prototype currently documented with OnlineSubsystem Null and direct IP; no validated EOS journey |
| 4 — Public matchmaking and launch content | Public queue, lobby, groups, departures/reconnects, maps and modes validated | **Not verified** | No validated public matchmaking or complete launch-content report |
| 5 — Persistent data and community services | Consistent, protected and recoverable progression/statistics | **Not verified** | No phase evidence recorded |
| 6 — Quality, performance and alpha readiness | Regression, multi-configuration performance, compliance, Shipping build and rollback | **Not verified** | No verified Shipping/alpha build or full validation campaign |
| 7 — Extensions | Each extension has acceptance criteria, tests, evidence and rollback without regressions | **Not verified** | No extension validated by this register |

The phase order and dependencies remain those defined by section 12 of the product specification. The first Windows build remains the priority defined in section 24. No feature, phase, milestone or deliverable is added by this audit.

## 4. Current automated validation scope

The GitHub validation workflow runs `Tools/validate_project.py`. After this maintenance change, it is intended to check:

- Unreal project JSON, engine association, unique plugin entries and configured startup asset references.
- The default ray-tracing setting and required map, GameMode and GameInstance assets.
- Python syntax, weapon/accessory metadata and generated triangle counts.
- Existence and non-empty output of all weapon, iron-sight and accessory OBJ exports.
- The scope PNG generator's dimensions, RGBA format, reticle centre and transparent lens interior.

These are static and generator smoke tests. They do **not** launch Unreal Engine, load or compile Blueprints, compile shaders, test networking, run a Windows package or establish that the game is playable.

A successful GitHub Actions run is not evidence that a project phase has passed.

## 5. Required evidence for each validation attempt

For every attempted phase criterion, record:

- Exact phase and acceptance criterion.
- Branch and SHA of the game code tested, separately from any documentation-only commit.
- Unreal version, configuration (Development/Shipping), platform and relevant hardware.
- Exact build/artifact and a verified location or link, if produced.
- Reproducible procedure, client/player count, network topology and test conditions.
- Observed result: passed, failed, not run or not verified; include useful logs and artifacts.
- Regressions, limitations, blockers and corrective action.
- Explicit decision on whether the criterion passed, with owner and date.

Never convert a documentation commit, Python check, Git synchronization or isolated PIE test into proof of a Windows build, Internet multiplayer readiness or phase completion.

## 6. Update policy and next verifiable action

Update this register in the same work batch whenever a real test, repository change or phase-status change occurs.

- Re-fetch branch heads and workflow results; never present an old audit snapshot as current.
- Distinguish the documentation commit from the exact game-code commit under test.
- Keep a phase **Not verified** until every required acceptance proof is available.
- Mark checks that were not run and explain why.
- Do not imply continuous background monitoring between sessions.

**Next project action:** verify the local workspace and backups, open the project in Unreal Engine 5.8, inspect plugins and editor logs, reproduce project startup, then produce and test a Windows development build. Record the evidence against the exact game-code SHA before changing any phase status.
