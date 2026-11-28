# Contributing to RIXE

RIXE's rights-cleared original material is source-available under the PolyForm Noncommercial License 1.0.0 (see `LICENSE` and `THIRD_PARTY_NOTICES.md`). This public licence does not grant commercial rights.

## Important: external contributions and commercial rights

The project owner wants to retain the ability to be the only party authorized to commercially exploit the official RIXE project. A standard pull request, a GitHub account, or the act of submitting code does **not** by itself transfer copyright or establish the exclusive commercial rights the owner needs.

Until a separate contributor agreement has been drafted and reviewed for the applicable jurisdictions:

- Do not merge an external contribution into the official game or a release candidate.
- Do not submit Epic, Fab, Quixel, Marketplace, or other third-party files unless the exact licence and redistribution permission are documented.
- A proposed contribution may be discussed or tested separately, but it must not be treated as cleared for commercial distribution.
- Preserve the contributor's identity, authorship statement, source, and the exact files they provide.

Before accepting external work into the official project, the owner must obtain a separate written agreement that clearly describes the rights granted for the specific contribution, including the commercial exploitation rights, media/methods, territory, duration, and other terms required by applicable law. In France, transfers of author's rights are subject to written-form and specificity requirements; a qualified French intellectual-property lawyer should prepare or review the document. See Code de la propriété intellectuelle, Articles L131-2 and L131-3.

Do not use the former blanket sentence saying that a PR automatically assigns all rights to the owner. Do not claim that the owner owns a contribution unless the valid signed agreement establishes that result.

## Workflow

- Read `CLAUDE.md`, `spec/INDEX.md` (then the relevant section files), and `THIRD_PARTY_NOTICES.md` first.
- Work on a dedicated branch and open a pull request against `main`. `jeu-unreal` is a mirror: never push to it.
- The `Validate RIXE repository` check must pass. Note that it does not launch Unreal Engine or test the network.
- Fairness first: nothing may give one player a gameplay advantage (no pay-to-win, no client-side authority over damage, shots, movement or score).
- Use English for code, comments, commits and new technical documentation.
