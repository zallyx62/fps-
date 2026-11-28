# RIXE — owner decisions: licence, FOV, graphics presets, health, content parity (28 November 2026)

**Status:** owner-approved direction (28 Nov 2026). Recorded as a decision record, like `DECISIONS_GAMEPLAY_2026-11-25.md`. It does not change specification phases or scope beyond the explicit decisions below.

## 1. Licence

- The owner explicitly approved replacing the GPL-3.0 software `LICENSE` with **PolyForm Noncommercial License 1.0.0**. Following a further scope review, original artistic assets and written documentation are separately licensed under **CC BY-NC 4.0** in `LICENSE-ARTWORK.md`; this distinction is recorded in PR #49.
- Goal: the original RIXE source stays publicly readable, modifiable and distributable for noncommercial purposes only; third parties may not sell it or commercially exploit it without a separate written commercial licence from the rights holder. This is **source-available**, not OSI open source.
- PolyForm applies only to original software; CC BY-NC applies only to original artwork and written documentation. Their exact rights-cleared scopes are listed in `THIRD_PARTY_NOTICES.md`. It does not apply to Unreal Engine, Epic Examples/Starter Content, Fab/Learn/Quixel material, plugins, or other third-party works.
- The owner can independently grant a separate commercial licence for rights they actually own. PolyForm does not itself transfer ownership to the owner or make third-party contributions the owner's property.
- Existing clones received under the earlier GPL remain under the GPL for the versions already distributed; changing the current repository does not revoke those prior grants.
- **Still open:** obtain written Epic clarification or qualified legal review on the actual combination under Unreal EULA section 6(c); prove the provenance of template files; complete asset/plugin inventory; validate packaged-game EULA and notices.
- Do not claim Epic has expressly approved PolyForm or CC BY-NC. Neither is named in the current EULA examples clause.

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

## 5. Shared official game and cosmetics

- Every player of the official RIXE release must have access to the same base-game content and the same official cosmetic catalogue: weapons, maps, character content, skins, visual effects and other included content.
- No paid-exclusive skin, cosmetic DLC that fragments the catalogue, platform-exclusive or region-exclusive official cosmetic, or paid gameplay advantage.
- Official cosmetics must follow the same availability and unlock rules for everyone. The owner may choose non-paid progression/unlock conditions, but must not sell exclusive access to part of the official catalogue.
- All players receive the same official content updates. Do not withhold higher-quality official models, textures or visual effects behind payment.
- Local graphics options may scale rendering for hardware capability and performance. They must not change gameplay, hitboxes, information available to players, or competitive fairness. Identical pixel output cannot be guaranteed across different GPUs, screens and settings.
- This decision describes the official game. It does not grant third parties permission to commercially redistribute RIXE or its content.
