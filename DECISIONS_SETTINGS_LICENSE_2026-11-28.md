# RIXE — owner decisions: licence, FOV, graphics presets, health (28 November 2026)

**Status:** owner-approved direction (28 Nov 2026). Recorded as a decision record, like `DECISIONS_GAMEPLAY_2026-11-25.md`. It does not change specification phases or scope.

## 1. Licence

- The owner explicitly approved replacing the GPL-3.0 `LICENSE` with the **PolyForm Noncommercial License 1.0.0**. This is the explicit decision that specification section 25 and `CLAUDE.md` require.
- Goal: the code stays readable and modifiable by anyone for noncommercial use; only the owner may sell or commercially exploit it. This is "source-available", not OSI open source.
- The licence applies only to the original RIXE material defined in `THIRD_PARTY_NOTICES.md`. Epic and third-party content is excluded.
- Existing clones made under the GPL stay under the GPL for the versions they received.
- Contributors grant the owner the right to relicense and sell their work (`CONTRIBUTING.md`).
- **Still open:** validation by a qualified person (compatibility with the Unreal EULA "Non-Compatible Licenses" clause; public posting of Epic-derived assets). Public distribution of builds stays blocked.

## 2. Field of view

- Default **70**, maximum **120**.
- Minimum **70** (assumption, because the prototype log says both "70 to 120" and "80 to 120"; the owner can change it).
- The same limits apply to every player in every mode. ADS keeps its own multiplier.
- To do in the editor: set the default in `BP_RixeGameInstance`, clamp the menu slider and any saved value to the range, and make the `Aim` function use the same range.

## 3. Graphics presets

- Six presets plus **Personnalisé**, as in specification section 30.1: Ultra performance, Performance, Équilibré, Qualité élevée, Très haute qualité, Ultra. Équilibré is the default.
- The prototype menu has four levels (named Low/Medium/High/Epic in one place and Basse/Moyenne/Haute/Ultra in another). It must be replaced, not extended.
- Presets never change gameplay, hitboxes, damage, movement or network rules.

## 4. Health

- A player respawning with **500 HP** is a bug, not a rule. Bots appear to have 100 HP.
- Use a single source of truth (a data table). Players and bots read the same value; the server logs a warning if a spawned pawn differs from the table.
- The intended value is still to be chosen by the owner.

## 5. Inconsistencies in `UNREAL.md` (reconciled on 28 Nov 2026; `UNREAL.md` is now English only)

- FOV range stated twice with different minimums (section 3 above).
- Quality level names stated twice (section 3 above).
- Sprint measured at about 1.3 times walking, while the decision record targets 1.5 (900 against 600). Re-measure the same way as walking before retuning.
- The document mixes French and English; new text should follow `CLAUDE.md` (English).
