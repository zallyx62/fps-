# Contributing to RIXE

RIXE's original material is source-available under the PolyForm Noncommercial License 1.0.0 (see `LICENSE`). Only the owner may sell or commercially exploit it.

## Contribution terms

By submitting a pull request, patch or any other contribution, you agree that:

1. You wrote it yourself, or you have the right to submit it, and you did not copy Epic Games content, Fab assets or other third-party material into it (list any third-party material you used in the PR description).
2. You grant the owner (zallyx62) a perpetual, worldwide, irrevocable, royalty-free, sublicensable licence to use, modify, distribute, **relicense and sell** your contribution, including commercially. Where the law allows, you assign your copyright to the owner instead.
3. Your contribution is also available to everyone else under the PolyForm Noncommercial License 1.0.0, like the rest of the original material.
4. You keep the right to reuse your own work elsewhere.

These terms exist so the owner can keep selling the game. They are a simple grant, not legal advice; the owner may replace them with a formal contributor agreement before accepting large external contributions.

## Workflow

- Read `CLAUDE.md`, `spec/INDEX.md` (then the relevant section files), and `THIRD_PARTY_NOTICES.md` first.
- Work on a dedicated branch and open a pull request against `main`. `jeu-unreal` is a mirror: never push to it.
- The `Validate RIXE repository` check must pass. Note that it does not launch Unreal Engine or test the network.
- Fairness first: nothing may give one player a gameplay advantage (no pay-to-win, no client-side authority over damage, shots, movement or score).
- Use English for code, comments, commits and new technical documentation.
