# RIXE — Suivi vérifiable des phases

**Dernière mise à jour :** 25 novembre 2026  
**Dépôt :** `zallyx62/fps-`  
**Référence fonctionnelle :** dernière version approuvée de `CAHIER_DES_CHARGES_RIXE.md`.

Ce document enregistre l'avancement réellement démontré et les preuves associées. Il ne remplace ni le cahier des charges, ni les consignes de travail de `CLAUDE.md`, ni le journal d'implémentation Unreal, ni le registre spécialisé des licences.

## 1. État de référence GitHub — audit du 24 novembre 2026

> **Historical snapshot, superseded.** Current state verified on 25 November 2026: `main` = `jeu-unreal` = `19c4ab5` (merge of PR #31), then PR #32 (M5 + L8) merged as `40270b4`; 25 remote branches (`main`, `jeu-unreal`, 10 `docs/*`, 4 `maintenance/*`, 9 `phase1/*`/`phase2/*`). Always re-read the live state before relying on this section.

L'état ci-dessous a été relevé directement sur GitHub avant cette PR de maintenance, au commit `345295ea2ab8d2b6417f1b81f4e3d0d26290cbf1`.

| Élément | État vérifié |
|---|---|
| Branche de référence | `main` |
| Branche miroir | `jeu-unreal` |
| SHA de référence des deux branches | `345295ea2ab8d2b6417f1b81f4e3d0d26290cbf1` |
| PR ouvertes | 0 à l'ouverture de cet audit |
| Fichiers suivis | 589 |
| Entrées de l'arborescence récursive | 944, dossiers compris |
| Assets Unreal | 536 `.uasset` et 3 `.umap` |
| Fichiers sous `Content/` | 541 |
| Somme des tailles des fichiers suivis | 165 779 240 octets ; ce n'est ni la taille du clone ni celle de tout l'historique Git |
| Blobs Git strictement identiques | Aucun doublon détecté |
| Validation du dépôt | Réussie — [exécution 45291809769](https://github.com/zallyx62/fps-/actions/runs/45291809769) |
| Synchronisation du miroir | Réussie — [exécution 45291809767](https://github.com/zallyx62/fps-/actions/runs/45291809767) |

L'arborescence récursive a été récupérée intégralement, sans troncature. La comparaison des blobs ne détecte que les fichiers strictement identiques ; elle ne révèle pas les doublons fonctionnels à l'intérieur des Blueprints ou des assets Unreal.

### Branches historiques

À la date de référence, le dépôt comptait 14 branches : `main`, `jeu-unreal`, dix anciennes branches `docs/*` et deux branches `maintenance/*`. La comparaison déjà effectuée des dix branches documentaires avec `main` n'a révélé que des différences documentaires et l'ancien fichier `Tools/.gitignore`, déjà supprimé de `main`. Leurs pull requests associées sont fusionnées ; elles peuvent être supprimées après vérification finale de leurs références.

Les deux branches `maintenance/*` sont divergentes par rapport à `main` selon l'API GitHub. Leurs arbres finaux n'ont pas été certifiés identiques et elles n'ont pas de pull request ouverte. Elles sont conservées : ne pas les supprimer avant d'avoir comparé précisément leurs arbres et récupéré tout changement utile. La suppression des pointeurs de branches n'est pas disponible via l'intégration utilisée pendant cet audit.

**Update 25 November 2026:** the four `maintenance/*` branches were squash-merged through PRs #15, #21, #22 and #23, which is why GitHub reports them as divergent. A per-file comparison shows that `main` contains all of their changes; no unmerged work remains on them. They can be deleted with the owner's approval.

La règle du cahier des charges reste inchangée : `main` est la branche canonique et `jeu-unreal` est un miroir, pas une branche de développement indépendante.

### Protection GitHub

GitHub renvoie `protected=false` pour les deux branches et aucun ruleset n'est présent dans la réponse de l'API. L'intégration ne permet pas de lire le point de terminaison détaillé de protection. La protection côté serveur n'est donc pas confirmée : ne jamais présenter ces branches comme protégées.

## 2. Autorité du cahier des charges

Le cahier des charges contient 71 sections principales numérotées à la date de cet audit. La section 71 est le dernier ajout approuvé connu à cette date.

- Le cahier des charges reste l'unique autorité pour les fonctionnalités approuvées, exclusions, décisions, priorités, dépendances et critères d'acceptation.
- Aucune exigence approuvée ne peut être supprimée, rétrogradée ou rendue facultative sans décision explicite du propriétaire.
- Avant une tâche, rechercher les exigences concernées puis lire intégralement les sections pertinentes, leurs dépendances et leurs critères d'acceptation. Ne pas charger systématiquement une plage fixe de sections à chaque nouvelle session.
- Pour un audit global, une vérification d'originalité ou un travail transversal, étendre l'analyse à l'ensemble du cahier des charges et aux registres de décisions applicables.
- En cas de chevauchement, rattacher le travail au système propriétaire existant et conserver les références croisées. En cas de contradiction entre décisions approuvées, demander un arbitrage plutôt que deviner.

## 3. État des phases

**Phases 0 and 1 were accepted by the owner on 24 November 2026; no other phase is declared validated.** Les anciens essais dans l'éditeur et les contrôles statiques GitHub ne remplacent pas les preuves exigées par le cahier des charges.

| Phase | Critère à démontrer | Statut | Preuve ou blocage actuellement enregistré |
|---|---|---|---|
| 0 — Sécurisation et état des lieux | Sauvegardes vérifiées, audit de l'environnement, état reproductible et blocages identifiés | **Validée** (owner acceptance, 24 Nov 2026) | Evidence recorded in section 8 (verified backup, environment audit, secret scan) |
| 1 — Première boucle FPS Windows jouable | Build Windows empaquetée et partie complète reproductible sur une carte pilote | **Validée** (owner acceptance, 24 Nov 2026) | Packaged Development build `aeaf808` tested locally with bots (section 8); not distributed, no network test (network tests belong to Phase 2) |
| 2 — Fondations FPS, combat, réseau et carte pilote | Combat stable, autorité serveur testée, bots, tests réseau progressifs et régressions critiques corrigées | **Non vérifiée** | Audit fixes H1/S2, M4 + L6, M1, M2, M5 + L8, S1, M3, S6, M9 + L15, S4, S3 and item 14 (L1 + M7, M6 projectile part) tested in single-machine PIE (listen server + 1 to 3 clients) and packaged smoke runs (sections 10–23); M8 refuted (section 13); M6 weapon-actor part open (item 14b); no multi-machine, LAN or Internet test yet |
| 3 — EOS et parties privées | Identité, invitations, lobby privé, lancement, retour et reconnexion testés de bout en bout | **Non vérifiée** | Prototype documenté avec OnlineSubsystem Null et connexion IP directe ; aucun parcours EOS validé |
| 4 — Matchmaking public et contenu de lancement | File publique, lobby, groupes, départs/reconnexion, cartes et modes validés | **Non vérifiée** | Aucun rapport de validation du matchmaking public ou de l'ensemble du contenu de lancement |
| 5 — Données durables et services communautaires | Progression/statistiques cohérentes, protégées et restaurables | **Non vérifiée** | Aucune preuve de phase enregistrée |
| 6 — Qualité, performances et préparation alpha | Non-régression, performances multi-configurations, conformité, build Shipping et retour arrière | **Non vérifiée** | Aucune build Shipping/alpha ni campagne complète de validation référencée |
| 7 — Extensions | Critères, tests, preuves et retour arrière pour chaque extension sans régression du socle | **Non vérifiée** | Aucune extension validée par ce registre |

L'ordre et les dépendances des phases restent ceux de la section 12 du cahier des charges. La première build Windows reste la priorité définie dans sa section 24. Cet audit n'ajoute aucune fonctionnalité, phase, priorité, étape ou livrable.

## 4. Portée des contrôles automatisés

Le workflow GitHub Actions exécute `Tools/validate_project.py`. Le périmètre exact des contrôles est défini dans ce script et doit rester aligné avec les outils effectivement présents dans le dépôt.

Un résultat vert signifie uniquement que les vérifications statiques et les tests de génération exécutés ont réussi. Il ne prouve pas que le projet a été ouvert dans Unreal Engine, que les Blueprints ou shaders compilent, que le réseau fonctionne, ni qu'une build Windows est jouable.

Une exécution GitHub Actions réussie ne suffit jamais à déclarer une phase validée.

## 5. Preuves obligatoires pour chaque tentative de validation

Pour chaque critère de phase testé, enregistrer :

- La phase et le critère d'acceptation exacts.
- La branche et le SHA du code du jeu réellement testé, séparément de tout commit documentaire.
- La version d'Unreal, la configuration (Development/Shipping), la plateforme et le matériel pertinent.
- La build ou l'artefact exact et son emplacement ou lien vérifiable, si produit.
- La procédure reproductible, le nombre de joueurs/clients, la topologie réseau et les conditions du test.
- Le résultat observé : réussi, échoué, non exécuté ou non vérifié ; joindre les journaux et artefacts utiles.
- Les régressions, limites, blocages et actions correctives.
- La décision explicite de franchissement ou non du critère, avec responsable et date.

Ne jamais transformer un commit documentaire, un contrôle Python, une synchronisation Git ou un test PIE isolé en preuve de build Windows, de fonctionnement sur Internet ou de franchissement de phase.

## 6. Mise à jour du suivi et prochaine action vérifiable

Mettre à jour ce registre dans le même lot de travail lorsqu'un test réel, une modification du dépôt ou un changement de statut intervient.

- Récupérer à nouveau les têtes des branches et les résultats des workflows ; ne jamais présenter un ancien relevé comme l'état courant.
- Distinguer le SHA documentaire du SHA exact du code testé.
- Conserver le statut **Non vérifiée** tant que toutes les preuves du critère ne sont pas disponibles.
- Indiquer explicitement les contrôles non exécutés et leur raison.
- Ne pas laisser entendre qu'une surveillance automatique continue entre les sessions est en place.

**Prochaine action projet :** the current next action is the one stated in the most recent numbered section below. As of 25 November 2026: audit item 14 is done except its M6 weapon-actor part (section 23); the next item is audit item 14b (replicated authority-only weapons) or item 15 (L14), as the owner prefers. The four pending owner decisions are settled by the decision record `DECISIONS_GAMEPLAY_2026-11-25.md` (owner direction: follow XDefiant, Call of Duty and Apex Legends). The earlier next action of this section (first Windows Development build) was completed in section 8.


## 7. Correctif technique ciblé — 24 novembre 2026

**Pull request :** [#23 — restauration de la visibilité des armes après la visée](https://github.com/zallyx62/fps-/pull/23)

- **Fichier corrigé :** `Tools/dsl/scope_apply.dsl`. À la désactivation de la lunette, les meshes d'armes en vue subjective sont maintenant réaffichés, comme le mesh du personnage. Ils restent masqués uniquement pendant l'affichage de la lunette.
- **Validation renforcée :** `Tools/validate_project.py` vérifie désormais l'équilibre des parenthèses et la fermeture des chaînes de caractères dans les scripts de `Tools/dsl/`, puis contrôle la règle de visibilité des armes pour prévenir cette régression.
- **Commit du correctif DSL :** `3df8b0ddc8707556821c96780e42b5527e10db0e`.
- **Commit contenant les nouveaux contrôles :** `fa9cacf82941c80f4516fd4cd1b5635a9ace3a83`.
- **Merge note:** PR #23 was squash-merged into `main` as `d0c3b23`; the two commits above exist only on the PR #23 branch.
- **CI :** validation GitHub Actions n° 81 réussie — [exécution 45294161509](https://github.com/zallyx62/fps-/actions/runs/45294161509). Les contrôles statiques et tests de génération ont réussi.

**Limite de preuve :** aucun chargement du projet dans Unreal, aucune compilation de Blueprint, aucun test de la visée en jeu et aucune build Windows n'ont été effectués dans cette opération. Le contrôle DSL vérifie la structure et la règle ciblée ; il ne remplace pas le compilateur ni l'exécution Unreal. À la date de la PR #23, les phases 0 à 7 restaient donc **Non vérifiées** et aucun critère de phase n'est déclaré franchi.

## 8. Phase 0–1 evidence — Windows Development build (24 November 2026)

**Branch:** `phase1/windows-dev-build` (based on `main` @ `d0c3b23`). **Status of phases 0 and 1:** accepted by the owner on 24 November 2026 (see the end of this section).

### Phase 0 — backup and environment

- Backup `D:\RIXE_Backups\fps58-20261124-082425.tar` (982 entries, read back and verified). The local folder `D:\fps 5.8` matched `main` @ `d0c3b23` (content and config identical; only CRLF noise, `git diff -w` empty).
- Environment: Unreal Engine 5.8 (`D:\UE_5.8`), Visual Studio 2022, Windows 10 Enterprise 19045, 4 cores / 16 GB RAM, NVIDIA GTX 1070 (driver 582.28). `GameplayStateTree` forces a code build of the game target.
- Secret scan of tracked files: no secret found. Untracked `RixeSource/` (OBJ/PNG sources) is left out of Git.

### Code commits (game code, separate from this documentation commit)

| Commit | Change |
|---|---|
| `006a31c3c7ea7828d3793a278ac4acc3aad21a3d` | Asset Manager rule for `GameFeatureData` (unblocks the cook); MCP plugins (`ModelContextProtocol`, `MCPClientToolset`, `AllToolsets`) restricted to the Editor target, so the game no longer ships the MCP runtime / HTTP server |
| `04355ca095651a8c48769a276224feffef8ad4f7` | `GameFeatureData` rule marked editor-only (removes a handled ensure at game startup) |
| `34eeea3335fc95905c3c90ad08b696e924e6c4f6` | Broken asset references removed (`BP_WobbleTarget` material override, stale `SM_DoorFrame_Edge` path); `BP_RixeMatchRules` not spatially loaded |
| `aeaf8088656f08e4a2f9c26826c4cc457c6230b1` | `ScoreLimit` override on the arena instance (75) reset to the class default **20**, per owner decision of 24 Nov 2026 |

### Builds (RunUAT BuildCookRun, Win64, Development, cook + stage + pak + archive)

| Code commit | Result | Output (local only, not distributed) |
|---|---|---|
| `d0c3b23` | **Failed** (ExitCode 25, missing `GameFeatureData` rule) | — |
| `006a31c` | Successful, cook 0 errors / 0 warnings | `D:\RIXE_Builds\dev-006a31c` |
| `04355ca` | Successful | `D:\RIXE_Builds\dev-04355ca` |
| `34eeea3` | Successful, cook 0 errors / 0 warnings | `D:\RIXE_Builds\dev-34eeea3` |
| `aeaf808` | **Successful**, cook 0 errors / 0 warnings, ~965 MB | `D:\RIXE_Builds\dev-aeaf808` |

No MCP module appears in the staging manifests of `aeaf808`. **No download link exists**: the build is not published, because the licence audit (specification section 25) blocks any distribution.

### Tests

Map `Lvl_ArenaShooter`, mode `BP_ShooterGameMode`, single local player plus bots on both teams. Launch: `fps.exe -windowed -ResX=1280 -ResY=720 -log`.

1. **Packaged `aeaf808`, unattended run** (24 Nov 2026, 09:01–09:09 UTC; log and screenshots in `D:\RIXE_Builds\evidence-aeaf808`): 6 victories in about 7 minutes ("VICTOIRE DE L'EQUIPE ROUGE/BLEUE" at 09:03:11, 09:04:17, 09:05:21, 09:06:27, 09:07:38 and 09:08:44), each followed about 6 s later by `ProcessServerTravel` to the arena. Screenshots show the victory banner with **ROUGE 20** (09:07:39, 09:08:45) and a reset score after the restart (09:08:00). The game was closed with a normal window close and the log ends with `LogExit: Exiting.`. No missing package, no ensure, no Blueprint script error and no crash.
2. **Hands-on play on packaged `04355ca`** (computer use, approved by the owner): movement, mouse look, shooting (ammo bar decreases), reload (R), damage taken, death and respawn, and the team score increasing in the HUD. Victory was not reached in that run because the limit was still 75. Victory at the limit was then confirmed on `aeaf808` (test 1).
3. Earlier supporting runs: unattended run on packaged `006a31c` (two victories and restarts) and a PIE run (victory and ServerTravel).

### Known non-blocking issues (recorded, not fixed)

- 24 `LogRHI: Error: Failed to create compute pipeline` (D3D12 SM6) at startup on the GTX 1070; the game keeps running normally.
- Debug StateTree text ("Attacking in Place", "No LoS", …) is drawn above bots in Development builds.
- After each restart: `LogCrowdFollowing: Unable to find RecastNavMesh`, `OSS: Cannot create session 'GameSession': session already exists`, and `SpawnActor failed because we are in the process of tearing down the world`.
- `NPC stuck` messages on `BP_WobbleTarget`.

### Limits of this evidence

- Single machine, single local player and bots only. **This is not a network, multi-machine or Internet test.**
- No test from a clean machine, no Shipping build, and no verified download link.
- The score is the prototype elimination counter, not the final contribution score of specification section 3.
- **Decision on passing phases 0 and 1:** accepted by the owner in chat on 24 November 2026, on the basis of this evidence and its limits. Both are now **Validée**.

## 9. Phase 2 — combat server-authority audit (24 November 2026)

**Phase 2 criterion addressed:** step 2 of specification section 12.2 (verify and strengthen server authority on sensitive actions; fix desyncs, double events, abusable RPCs and replication inconsistencies), against specification section 5.

- **Code state audited:** `main` @ `6825461` (Blueprints unchanged since `aeaf808`).
- **Method:** the graphs of 31 combat-related Blueprints were exported as text through the editor MCP. The text was then read statically by six independent auditors (fire/ammo, damage, death/score, client RPCs, movement, teams/bots), and each finding was challenged by two verifiers.
- **Report:** `AUDIT_PHASE2_COMBAT_AUTHORITY.md`. It contains 57 verified raw findings, deduplicated into 37 entries (1 high after the H2 correction, 9 medium, 8 split medium/low, 18 low), plus 5 refuted items and the list of paths that are already correctly server-authoritative.
- **Post-audit correction:** finding H2 ("Blue victory never restarts") is **refuted by runtime evidence**. The packaged `aeaf808` logs show a restart after Blue victories; the export prints a node shared by two branches only once.
- **Main remaining risk (H1):** the single client RPC `ServerRixeAction` accepts fire/reload/swap/loadout actions without checking that the pawn is alive or that the match is running, and without rate limits.

**Limits:** static reading only. Nothing in this audit was executed, so every finding is **not verified at runtime** until it is reproduced in a multi-client test. RPC flags (Run on Server, Reliable) are not visible in the export. Phase 2 stays **Non vérifiée**.

**Next verifiable action:** fix H1 (alive/match-state guard on `ServerRixeAction`, stop firing on death), then test it with a listen server and one client in PIE and on a packaged build. (Done: sections 10–11.)

**Owner decisions needed before the related fixes:** suicide and team-kill scoring (S3), sprint/fire exclusivity, ADS time, bot respawn delay, and whether C++ CharacterMovement work is acceptable (S7).
## 10. Phase 2 — audit fix H1: server-side guard on `ServerRixeAction` (24 November 2026)

Scope: specification section 12 (Phase 2, step 2, server authority) and audit `AUDIT_PHASE2_COMBAT_AUTHORITY.md` finding H1 (PR #25, merged into `main` as `fb55909`). Phase 2 stays **Non vérifiée**.

### Change (code commit `5d7b18e`, branch `phase2/h1-server-action-guard`, base `main` `6825461`)

- `BP_ShooterPlayerController`: new pure-logic function `RixeCanAct(Action) -> bool`. Chat (Action 3) is always allowed; every other action requires a controlled `BP_ShooterCharacter` that is not dead (`IsDead`, i.e. `Current HP <= 0`) and a match that is not over (`BP_RixeGameState.WinningTeam == 0`; if the GameState cast fails the action is allowed, as before).
- `ServerRixeAction` (Run on Server) now branches on `RixeCanAct` before the existing action chain; a rejected action does nothing. No other graph was changed.
- Not in this change (remaining H1 items from audit section 6): clearing `bFiringRep` / `StopFiring` in the authority Die path, and `StopFiring` in both Die graphs on every machine (also S2).

### Tests

1. **PIE, listen server + 1 remote client** (editor, same machine, 24 Nov 2026 ~17:35–17:45 UTC; Play settings changed in memory only and restored): the client connected (`Join succeeded`); bots played several matches to victory with automatic restart while the client was connected.
   - **Verified:** a live client holding fire reached the server through `ServerRixeAction` (server-side `bFiringRep = true` on the client's pawn, `RemoteRole = AutonomousProxy`).
   - **Not verified:** that the server rejects fire from a dead client or after victory. The editor tooling could not set `Current HP` or `WinningTeam` on PIE actors, and the client's pawn was destroyed/recreated around deaths and match restarts before a read could be taken. One attempt during a victory read `bFiringRep = false`, but the GameState had already been reset, so it is not evidence.
   - Log: 4 `Blueprint Runtime Error` lines in `BP_ShooterCharacter` `Update Health UI` (`OnRep_Current HP` and EventGraph) accessing the remote client's destroyed `BP_ShooterPlayerController` during the first match restart. Not in a graph touched by this change; recorded as a new finding for a later fix.
2. **Packaged Development Win64 build of `5d7b18e`** (`RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-5d7b18e`, log `D:\RIXE_Builds\build-dev-5d7b18e.log`). As in section 8, the build uses the local working tree, including local `Config/*.ini` changes that are not committed. (Clarified 25 Nov 2026: those local `Config/*.ini` and `fps.uproject` differences are line endings only, with no content change; see `.gitattributes` `eol=lf`.)
3. **Smoke run of that build** (17:47–17:52 UTC, single local player plus bots, log copied to `D:\RIXE_Builds\evidence-5d7b18e\smoke-5d7b18e-fps.log`): 3 victories (17:49:13 blue, 17:50:29 red, 17:51:44), each followed about 6 s later by `ProcessServerTravel`. Hands-on (computer use): holding fire empties the ammo bar and `R` refills it. The game was closed with a normal close and the log ends with `LogExit: Exiting.`. No Blueprint runtime error, no ensure, no crash.

### Limits

- Single machine. No separate-machine, LAN or Internet test.
- The rejection paths of the guard (dead player, match over) are not demonstrated at runtime; they need a manual two-player test or a test hook.
- No download link exists; the build is not distributed (specification section 25).

### Other observation

- `origin/jeu-unreal` (`d0c3b23`) does not match `origin/main` (`6825461`) at the time of this test; the mirror is out of date. (Resolved: the mirror was verified equal to `main` at `19c4ab5` on 25 November 2026.)

## 11. Phase 2 — audit fix H1 remainder and S2: stop firing on death (24 November 2026)

Scope: audit section 6 item 2 (H1 core, Die part) and S2. Stacked on section 10 (branch `phase2/h1-stop-fire-on-death`, based on `phase2/h1-server-action-guard`). Phase 2 stays **Non vérifiée**.

### Change (code commit `b3ccb4e`)

- `BP_ShooterCharacter` `Die`: on authority, after `Set w/ Notify bDeadRep = true`, also `Set w/ Notify bFiringRep = false` (proxies run `RepStopFire`). Then, on every machine, `IsValid(CurrentWeapon)` → `StopFiring`, before the existing death sequence.
- `BP_ShooterNPC` `Die`: calls the existing `StopShooting` first (on authority it clears `bShootingRep`; on every machine it stops the weapon).
- Review: a Blueprint DSL export after saving, compared with the pre-change export, shows only these additions.

### Tests

1. **PIE, listen server + 1 remote client** (same machine, ~18:00–18:03 UTC): the client's fire reaches the server, deaths and respawns happen, and a match ends in victory followed by `ServerTravel`. No `Blueprint Runtime Error` or `Accessed None` in that run.
   - **Not verified:** a dead pawn stops firing at the exact moment of death. Fire could not be held through a natural death, because the magazine empties and the weapon stops by itself. The 5 s window after death was not observed.
2. **Packaged Development Win64 build of `b3ccb4e`**: cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-b3ccb4e`.
3. **Unattended smoke run** (18:06–18:14 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-b3ccb4e\smoke-b3ccb4e-fps.log`): 6 victories, each followed about 6 s later by `ProcessServerTravel`. Normal close, `LogExit: Exiting.`. No Blueprint runtime error, no ensure, no crash.
   - **Not run:** hands-on fire/reload check on this build (computer-use access to the game window was declined). Section 10 covers that check for `5d7b18e`.

### Limits

Single machine only. No second client on another machine. Not verified that proxies show no shots after a death.

## 12. Phase 2 — audit fix M4 + L6: friendly fire from the authoritative team (24 November 2026)

Scope: audit section 6 item 3. Stacked on sections 10–11 (branch `phase2/m4-authoritative-friendly-fire`). Phase 2 stays **Non vérifiée**.

### Change (code commit `bdce5e2`)

- `BP_ShooterProjectileBase`:
  - New `RixeTeamOf(Actor) -> (Team, Known)`: reads `Team Byte` from `BP_ShooterCharacter` or `BP_ShooterNPC`; `Known = false` otherwise.
  - `BeginPlay` caches the instigator's team in `RixeInstTeam` / `RixeInstTeamKnown`.
  - New `RixeFriendlyAuth` replaces `RixeFriendly` in `ProcessHit`. A hit is friendly when the shooter's cached team equals the victim's authoritative team, the victim is not the shooter and the victim is alive. An unknown shooter team counts as friendly (L6).
  - The old `RixeFriendly`, which compared the possibly stale `RixeTeamRep`, is removed. It had no other caller.
- `BP_ShooterCharacter` `EventSetTeam`: also calls `RixeSetHP(SafeDivide(Current HP, Max HP), Team Byte)`, so `RixeTeamRep` is correct as soon as the team is assigned.
- Review: the DSL export after saving shows only these changes. An independent 3-lens static review of the before/after exports (gameplay semantics, networking/timing, regressions) found no defect.

### Tests

1. **PIE, listen server + 1 remote client** (same machine, ~18:25–18:28 UTC):
   - Right after spawn, the server read the client's team-1 pawn as `Team Byte = 1` and `RixeTeamRep = 1`. Before this fix `RixeTeamRep` could stay 0 for up to about 1 s.
   - Enemy damage applies (the host pawn was at 70 HP), and a victory was followed by `ServerTravel`.
   - No `Blueprint Runtime Error` and no `Accessed None`.
2. **Packaged Development Win64 build of `bdce5e2`**: cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, output `D:\RIXE_Builds\dev-bdce5e2`.
3. **Unattended smoke run** (18:31–18:34 UTC, log `D:\RIXE_Builds\evidence-bdce5e2\smoke-bdce5e2-fps.log`): 2 victories, each followed by `ProcessServerTravel`, then a normal close with `LogExit: Exiting.`. No Blueprint runtime error.

### Not verified / limits

- The audit's targeted tests were not run as described: a newly respawned enemy client hit within 1 s, and a teammate shot that must not apply. They need two human players.
- Single machine only.

### Pre-existing issues noted by the review (not changed)

- Direct hits on `BP_RixeTarget` never reach `RixeApplyHit`, because `ProcessHit` only continues for `Character` (audit S5).
- Bots spawned by `BP_ShooterNPCSpawner` instead of the bot director never receive a team.

## 13. Phase 2 — audit item M8 (team ↔ colour ↔ PlayerStart tag): refuted, no code change (24 November 2026)

**Owner decision (24 Nov 2026):** team 0 = RED, team 1 = BLUE, for tint, PlayerStart tags and score labels.

### Verification (editor `main` + stacked branches, no asset modified)

Node-level reading through the editor MCP (`get_node_infos`), plus the engine source:

- **Engine rule:** in `K2Node_Select.cpp` (UE 5.8, `Engine/Source/Editor/BlueprintGraph/Private`), a bool-indexed Select has "Option 0" = False and "Option 1" = True.
- **Humans:**
  - `BP_ShooterGameMode.ChoosePlayerStart` uses a byte-indexed Select with `Option 0 = "RED"` and `Option 1 = "BLUE"`, so team 0 maps to RED.
  - `BP_ShooterPlayerController` respawn uses the same Select, again team 0 → RED.
- **Bots:** `BP_RixeBotDirector.SpawnBot` uses a bool Select. Its index is `Team == 0`, with False → "BLUE" and True → "RED", so team 0 maps to RED.
- **Tint:** `SelectVector(red, blue, bPickA = (Team == 0))` for players and bots, so team 0 is red.
- **Score and victory:**
  - `TeamScores[X]` counts deaths of team X, so `RedScore = TeamScores[1]` is team 0's points.
  - "VICTOIRE DE L'EQUIPE ROUGE" (`WinningTeam = 1`) fires when team 1's deaths reach the limit, which is a team 0 win.
- **Why the audit was wrong:** the audit read the DSL export, which prints Select options in an order that does not match the pins. This is the same kind of export artefact as H2.

### Runtime check (PIE, listen server + 1 client, ~18:43–18:48 UTC)

- **PlayerStart positions in the level:** RED at y ≈ −1050 to −1450, BLUE at y ≈ +1348 to +1506.
- **Humans at spawn:** the team-0 human was at y = −1350 / −1450 (RED); the team-1 human was at y = +1348 / +1506 (BLUE).
- **Freshly spawned bots:** a team-1 bot was at (−606, 1603), next to a BLUE start; a team-0 bot was at (−717, −1413), on the RED side. Older bots had already moved and were not used as evidence.
- **Process note:** during the check a literal swap in `SpawnBot` was tried, found wrong against the engine source, and reverted before any save. `git status` shows no asset change.

### Status

- M8: **refuted, no change needed**.
- Still open: audit M9 (team assignment by PlayerArray parity) and NPCs from `BP_ShooterNPCSpawner` with no team.

## 14. Phase 2 — audit fix M1: action 9 (loadout) cannot refill used weapons (24–25 November 2026)

Scope: audit section 6 item 5 (M1). Branch `phase2/m1-loadout-once-per-life`, based on `main` @ `f482fcd`. Phase 2 stays **Non vérifiée**.

### Change (code commit `29780b3`; earlier iterations `bcbb37b` v1 and `fc26862` v2 are superseded)

All in `BP_ShooterPlayerController`; server-side state only, no new replicated variable:

- **Per-life weapon-use gate.** New bool `RixeWeaponsUsed`. `RixeNoteWeaponUse(Action)` runs in `ServerRixeAction` right after `RixeCanAct` and sets it for actions 1 (fire), 2 (swap) and 6 (reload). `RixeApplyLoadoutTo` clears it, so every new pawn (`EventOnPossess`) and every loadout rebuild starts unused. Outside `Lvl_RixeRange`, action 9 rebuilds the weapons only while the flag is false.
- **Normalized loadout.** `RixeNormalizeLoadout(Text, Fallback)` rebuilds the string from exactly 6 integer fields, clamped like `RixeBuildLoadout` / `RixeEquip` (primary 0–5, secondary 6–7, attachments 0–63, skins 0–6). A string without exactly 6 fields keeps the previous value. The no-op check compares the pawn's loadout with the effective string (empty → default `0,6,0,0,0,0`).
- **Action 9 always stored.** `RixeCanAct` now exempts action 9 (like chat), so a choice made while dead or after the round is kept for the next spawn. Applying still requires alive and round undecided: `RixeTryApplyLoadout` calls `RixeCanAct(0)`.
- **Cooldown without lost clicks.** Re-applies are at most one per second; a change blocked by the cooldown arms a non-looping `RixeLoadoutRetry` timer, which re-runs `RixeTryApplyLoadout` with the latest stored string. The existing 10 s spawn window in `RixeServerAction2` is unchanged.

### Review

- v1 (2-lens workflow): 3 defects (refill once per life after shooting; dropped first sync on the range; first-life sync consumed the slot). Fixed in v2.
- v2 (two independent adversarial workflows, 2 and 3 lenses, each finding re-checked by refuters): confirmed **fire → swap (action 2) → resend action 9** still refilled and reset refire (medium/high); raw-string no-op bypass; 1 s cooldown dropping quick Arsenal clicks; action 9 lost while dead. All fixed in v3.
- v3 (3-lens workflow, 2 refuters per finding): no medium or high finding. Two low findings fixed before commit (retry no longer re-checks the 10 s age; attachment and skin fields clamped). Remaining nits are listed under limits.

### Tests

1. **PIE, listen server + 1 remote client** (editor, same machine, 24 Nov 2026 22:40–22:52 UTC; play settings changed in memory and restored):
   - At spawn, server-side controllers: host `RixeLoadoutSrv = "0,7,2,0,0,0"`, `RixeLoadoutLastTime ≈ 0.33`; remote client `"0,7,2,0,0,0"`, `≈ 2.07`; `RixeWeaponsUsed = false`. Both pawns have `RixeLoadout = "0,7,2,0,0,0"` on the server and on the client.
   - After a victory and `ProcessServerTravel` (22:47:29) and the client's `Join succeeded`: new controllers again applied the loadout (`LastTime ≈ 0.33` and `≈ 2.68`), same pawn values on both sides.
   - No `Blueprint Runtime Error`, `Accessed None` or script error in the editor log for these runs.
   - **Investigation note:** the empty `RixeLoadoutSrv` reported in the previous handover was read from the client world's copy of the controller (`UEDPIE_1`). These variables are server-only and not replicated, so they are always empty there. The server copy was correct; no defect.
2. **Packaged Development Win64 build of `29780b3`** (`RunUAT BuildCookRun`, same parameters as section 8): cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-29780b3`, log `D:\RIXE_Builds\build-dev-29780b3.log`. As before, the build uses the local working tree including uncommitted local `Config/*.ini` changes. (Clarified 25 Nov 2026: those local `Config/*.ini` and `fps.uproject` differences are line endings only, with no content change; see `.gitattributes` `eol=lf`.)
3. **Unattended smoke run** (23:01–23:04 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-29780b3\smoke-29780b3-fps.log`): 2 victories (23:02:35 red, 23:03:46 blue), each followed about 6 s later by `ProcessServerTravel`. The game was closed with a normal window close and the log ends with `LogExit: Exiting.`. No Blueprint runtime error, no `Accessed None`, no ensure, no crash.

### Not verified / limits

- The exploit sequences (fire → swap → resend 9, equivalent strings, rapid Arsenal clicks on the range, a choice made while dead) were checked statically by the reviews only. No modified client was used, and the editor tooling cannot send RPCs, so they are **not verified at runtime**.
- If a player fires, swaps or reloads before the client's first action 9 reaches the server (about 0.3 s for the host, about 2 s for a remote client in PIE), that first life keeps the default loadout; the choice applies from the next spawn.
- The possession rebuild does not start the 1 s cooldown, so a spawn can rebuild weapons twice within 1 s (nit, no refill: weapons are unused).
- `Lvl_RixeRange` still allows one rebuild per second with no weapon-use check, as the audit allows for the solo range.
- Single machine only; not a network or Internet test.

## 15. Phase 2 — audit fix M2: action 6 reload runs on the server weapon (25 November 2026)

Scope: audit section 6 item 6 (M2). Branch `phase2/m2-server-reload`, based on `main` @ `d9b8363`. Phase 2 stays **Non vérifiée**.

### Change (code commit `38f298e`; only `BP_ShooterPlayerController` and `BP_ShooterWeaponBase`)

- **Single reload path.** `ServerRixeAction` action 6 now clears `bFiringRep` and calls `RixeServerReload`, which calls `RixeReload` on the server copy of the pawn's current weapon. The fixed 1.6 s `Delay` + refill block is removed, so the weapon's own `RixeReloadTime` (minimum 0.5 s) applies to host and remote clients alike, and the existing guard (not already reloading, magazine not full) applies to forged action 6 calls.
- **Cancel on swap.** `RixeCancelReload` (clears `RixeReloading` and the `RixeReloadDone` timer) runs in the weapon's `DeactivateWeapon` event, so the weapon swapped to is never refilled by an earlier reload.
- **No fire while reloading.** For actions 1/other, `RixeSyncReloading` copies the current weapon's `RixeReloading` to the controller, and `bFiringRep` is only set when not reloading. `RixeFire` also refuses to fire while `RixeReloading`.
- A temporary debug function (`RixeDbgReload`, PrintString on reload completion) left by the previous session was removed before commit.

### Tests

1. Both Blueprints compile; `BP_ShooterWeaponBase` saved without compile error in the editor log.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 08:46–08:50 UTC): two complete rounds, each followed by `ProcessServerTravel` (08:48:11 and 08:49:52). Server-side weapon instances read through the editor tooling showed per-class values (e.g. AR `RixeReloadTime = 2.1`, magazine 30; revolver 2.6, magazine 6) and `RixeReloading = false` at rest. No `Blueprint Runtime Error`, `Accessed None` or script error in the editor log for the run.
3. **PIE input test, remote client** (25 Nov 2026 08:53–08:58 UTC; input sent to the `NetMode: Client 1` window through the editor Slate automation tooling; state read on the server copy of the client pawn's weapon):
   - Fire then R with the AR (`RixeReloadTime = 2.1`): server magazine 30 → 20, `RixeReloading` true about 0.4–0.7 s after R (RPC plus throttled background tick), refilled to 30 about 2.3 s later, so the weapon's reload time applies, not the old fixed 1.6 s.
   - Fire, R, then swap (Gamepad face button top, mapped to `IA_SwapWeapon`) while reloading: current weapon becomes the revolver, the AR stays at 21 with `RixeReloading` false and is not refilled 3 s later; the revolver is untouched (6/6). Cancel-on-swap works.
   - No `Blueprint Runtime Error`, `Accessed None` or script error in the editor log for these runs.

### Not verified / limits

- A forged action 6 (modified client) was not sent; the editor tooling cannot send raw RPCs. The server guard (not reloading, magazine not full) is checked statically.
- Timings were measured with the editor in the background at a throttled tick rate; they show the order of magnitude, not frame-accurate values.
- No packaged build of this commit; single machine only, not a network or Internet test.
- Other locally modified assets (`BP_ShooterCharacter`, `BP_ShooterNPC`, `BP_RixeGameInstance`, `WBP_RixeMenu`, `BP_ShooterProjectileBase`) and the `Config/*.ini` / `fps.uproject` line-ending-only changes are **not part of this commit**; their origin is unverified and they stay uncommitted.

## 16. Phase 2 — audit fix M5 + L8: play freezes after victory (25 November 2026)

Scope: audit section 6 item 7 (M5 + L8). Branch `phase2/m5-match-phase`, based on `main` @ `19c4ab5`. Phase 2 stays **Non vérifiée**.

### Change (code commit `4f509b1`, which also adds this section; only `BP_ShooterGameMode`, `BP_ShooterPlayerController`, `BP_RixeBotDirector`)

- **Match phase source.** The replicated `WinningTeam` in `BP_RixeGameState` (0 = match running) is the match phase; no new variable.
- **Scoring frozen, victory checked synchronously (M5, L8).** `EventIncrementTeamScore` calls a new `RixeApplyTeamScore`: when `WinningTeam != 0` the score is not changed; otherwise it increments, updates `RedScore`/`BlueScore` and calls `BP_RixeMatchRules.CheckScore` immediately, so the limit is detected on the kill that reaches it (no 0.5 s poll overshoot). The 0.5 s poll stays as a fallback.
- **Player respawn gated.** The pawn `OnDestroyed_Event` now calls `RixeRespawnPawn`, which respawns (via `RixeSpawnAtTeamStart`, same PlayerStart-tag logic as before) only while `WinningTeam == 0`.
- **Bot refill gated.** The director timer now calls `RixeGatedDirectorTick`, which runs `DirectorTick` only while `WinningTeam == 0`.
- `ServerRixeAction` was already gated on `WinningTeam` by `RixeCanAct` (H1).

### Tests

1. All three Blueprints compile and were saved without compile error.
2. **PIE, listen server + 1 client + bots** (editor, same machine, 25 Nov 2026 09:12–09:13 UTC), `ScoreLimit` lowered at runtime on the server `BP_RixeMatchRules` instance:
   - Run 1 (limit 6): victory logged 09:12:36.3; server state read during the window: Red 6, Blue 3, `WinningTeam` 1 while bots kept fighting (pawns fell to 1, no new pawn spawned). `servertravel` at 09:12:42.3, then scores 0/0 and pawns refilled.
   - Run 2 (limit 3): victory 09:13:11.0 with Red 3, Blue 1 (exactly the limit); during the window no new pawn index appeared; `servertravel` at 09:13:17.0.
   - No `Blueprint Runtime Error`, `Accessed None` or script error for these runs (the two `GetCurrentLevel` errors come from the editor tooling during PIE).

### Not verified / limits

- One state read per window (editor tooling latency); the freeze is inferred from the exact-limit scores despite continued deaths and from the absence of new pawns.
- Remote client respawn and HUD display of the frozen state were not checked visually.
- No packaged build of this commit; single machine only, not a network or Internet test.
- The other locally modified assets and `Config/*.ini` / `fps.uproject` changes listed in section 15 remain uncommitted and are not part of this change.

## 17. Phase 2 — audit fix S1: server-side validation of `ServerRixeAction` (25 November 2026)

Scope: audit section 6 item 8 (S1). L13 (sprint rules) is **not** in this change: it needs the owner decisions listed in audit section 6 (sprint/fire exclusivity, forward-only sprint). Branch `phase2/s1-action-validation`, based on `phase2/m5-match-phase` @ `4f509b1`, then merged with `main` @ `3676b90`. Phase 2 stays **Non vérifiée**.

### Change (code commit `af521de`; only `BP_ShooterPlayerController`)

- **Single gate for the RPC.** `ServerRixeAction` now calls `RixeServerGate(Action, Text)` instead of `RixeCanAct(Action)`. The gate runs `RixeValidateAction` first and, only if it passes, the existing `RixeCanAct` state guard (alive pawn, `WinningTeam == 0`, H1). `RixeCanAct` itself is unchanged because `RixeTryApplyLoadout` reuses it as a state check; putting the validator there would have consumed rate-limit tokens on internal calls.
- **`RixeValidateAction`** (server side, per controller):
  - whitelist: `Action` must be 0..9;
  - payload: `Text` longer than 256 characters is refused (chat is still cut to 100 and loadout to 40 by the existing code; other actions never read `Text`);
  - rate limit: token bucket of 30, refilled at 30 tokens per second (`RixeActTokens`, `RixeActTokenTime`); the bucket starts full (class default 30) so the first actions after spawn (loadout) are never dropped;
  - every refused call increments `RixeActDropped`; the first drop and every 100th drop are written to the log (`RIXE S1 dropped action=<n> total=<n>`), so a flood cannot flood the log.
- **Per-action cooldowns from the audit's "smallest fix":** action 9 already has the 1 s cooldown and once-per-life rule (M1); action 6 is already refused while reloading or with a full magazine (M2). A server cooldown on action 2 (swap) is **left to M3**: swap is still replicated as a toggle counter, so dropping one swap on the server would desynchronize the client permanently.
- `RixeActionSig` is an event dispatcher signature, not a function, so it was left unchanged; the validator is the new function `RixeValidateAction`.
- **Defects found and fixed before commit** (PIE):
  - the refill was computed from pure nodes that the Blueprint VM re-evaluated after `RixeActTokenTime` was updated, so the elapsed time was always 0 and every action was dropped; values are now captured from the Set nodes' outputs;
  - with an empty initial bucket the host's first action (loadout, t ≈ 0) was dropped; fixed by the class default of 30.

### Tests

1. Blueprint compiles and saves without error; the four graphs (`ServerRixeAction`, `RixeServerGate`, `RixeValidateAction`, `RixeCanAct`) were read back through the editor MCP and match the intent.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 09:35–09:38 UTC). Python `call_method` runs an event locally instead of sending an RPC, so the flood was run on the **server copy** of the remote client's controller, which executes exactly the body of a received RPC. Values read on that server copy:
   - 4 normal actions (4, 5, 7, 8): accepted, tokens 30 → 26, `dropped = 0`;
   - 25 invalid codes (99, -1, 10): all refused, `dropped = 25`, tokens unchanged; log `RIXE S1 dropped action=99 total=1`;
   - 10 oversized texts (300 characters, actions 3 and 9): all refused, `dropped = 35`;
   - 60 calls in one frame (action 5): 30 accepted, 30 refused, `dropped = 65`, tokens 0;
   - 2 s later, 4 normal actions: accepted (tokens refilled), `dropped` unchanged.
3. **Real network path** (same session): 30 right-click aim toggles in the client window (about 60 RPCs over several seconds) reached the server through the gate (`RixeActTokenTime` 0.82 → 53.98) with `dropped = 0`, so normal fast play is not throttled. At start, no drop was logged for the host or the client.
4. No `Blueprint Runtime Error`, `Accessed None` or script error in the editor log for these runs.
5. **Packaged Development Win64 build of `af521de`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-af521de`, log `D:\RIXE_Builds\build-dev-af521de.log`. The build uses the local working tree; its `Config/*.ini` / `fps.uproject` differences are line endings only.
6. **Unattended smoke run of that build** (25 Nov 2026 09:53–09:56 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-af521de\smoke-af521de-fps.log`): 2 victories, each followed by `ProcessServerTravel` (09:55:00, 09:56:08); 0 `RIXE S1 dropped` lines (normal play never throttled); no `Blueprint Runtime Error` or `Accessed None`; closed with a normal window close. The 24 startup `Failed to create pipeline state` D3D12 errors are identical in every earlier smoke log (`5d7b18e` to `29780b3`): pre-existing, not a regression.

### Not verified / limits

- A real client cannot send invalid codes or more than 30 actions per second without a modified client; the flood was verified on the server-side execution path, not through the network driver.
- Single machine; no LAN, separate-machine or Internet test.
- L13 and the swap cooldown (M3) are not addressed here.
- The other locally modified assets and the untracked `RixeSource/` folder are not part of this change.

**Next verifiable action:** audit section 6 item 9 (M3: replicated absolute weapon index plus a server swap cooldown), or the owner decisions that unblock L13, S3 and S6.

## 18. Phase 2 — audit fix M3: replicated absolute weapon index (25 November 2026)

Scope: audit section 6 item 9 (M3). Branch `phase2/m3-weapon-index`, based on `main` @ `9bece55`. Phase 2 stays **Non vérifiée**.

### Working-tree decision before this change

The editor checkout still held five locally modified, never-committed assets of unverified origin (`BP_ShooterCharacter`, `BP_ShooterNPC`, `BP_RixeGameInstance`, `WBP_RixeMenu`, `BP_ShooterProjectileBase`, saved 25 Nov 2026 00:24; see sections 15–17). M3 must edit `BP_ShooterCharacter`, and binary assets cannot separate those unknown edits from new work. They were backed up with checksums to `D:\RIXE_Backups\uncommitted-assets-2026-11-25\` (copies verified byte-identical), and the checkout was reset to `main`. A string comparison of the binaries showed that the local `BP_ShooterCharacter` had lost the `Event Tick` that drives aim, scope and HUD bars (`ReceiveTick` present on `main`, absent locally); the committed version, which was already tested in build `29780b3`, is the baseline. The backup lets the owner restore them if they were intended.

### Change (code commit `1c4ae92`; only `BP_ShooterCharacter` and `BP_ShooterPlayerController`)

- **Absolute index.** New replicated RepNotify int `RixeWeaponIdxRep` on `BP_ShooterCharacter` (class default 1 = primary, which `RixeBuildLoadout` equips: index 0 is the secondary, index 1 the primary).
- **Server swap.** `ServerRixeAction` action 2 now calls `RixeServerSwap` on the pawn instead of incrementing the `SwapCountRep` toggle counter. After the existing S1 and `RixeCanAct` gates (valid action, alive, match running), the server sets `RixeWeaponIdxRep = (RixeWeaponIdxRep + 1) % weapons` with a 0.15 s server cooldown. The next index is computed from the replicated index, not from `CurrentWeapon`, because a listen-server host has already swapped locally before the server code runs.
- **Apply.** `OnRep_RixeWeaponIdxRep` calls `RixeApplyWeaponIdx` (deactivate current, set and activate `OwnedWeapons[index]`, no-op when already equipped or index invalid) on every non-locally-controlled copy: proxies and the server copy of remote pawns. Initial replication gives late joiners the right weapon.
- **Owner reconciliation.** The owning player keeps its instant local swap (input graphs unchanged). `RixeOnWeaponActivated` records `RixeLocalSwapTime`; `RixeWeaponReconcile`, called from the existing locally-controlled `Event Tick` branch, applies the server index 0.5 s after the last local activation. This corrects swaps the server refused (cooldown, dead, match over) instead of leaving the client on a different weapon.
- **Loadout rebuild.** `RixeAfterLoadout`, called at the end of `RixeBuildLoadout`, resets the server index to 1 so a server-side rebuild and the clients' rebuilds agree.
- `SwapCountRep` / `OnRep_SwapCountRep` / `RepSwap` are left in place but no longer driven by the server.
- Swapping during a reload stays allowed (it cancels the reload, section 15).

### Tests

1. Both Blueprints compile and save without error; the new graphs and the `ServerRixeAction` action 2 branch were read back through the editor MCP.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 10:21–10:25 UTC). The helper logs, for every `BP_ShooterCharacter` in both worlds, the owned weapons, the current weapon and its index, and `RixeWeaponIdxRep`:
   - start: all copies AR (index 1), `rep = 1`;
   - **server cooldown:** 5 `RixeServerSwap` calls in one frame on the server copy of the client's pawn → one accepted (`rep` 1 → 0), four refused; the owning client, which had not swapped locally, converged to Revolver (index 0) within the 0.5 s window, so all copies agree;
   - **real client swap** (mouse wheel in the client window): server copy and owning client both Revolver, `rep = 0`; the host's pawn stays AR on both sides;
   - **5 fast real swaps** (mouse wheel burst): server copy and owning client agree (Revolver, `rep = 0`);
   - **host swap** (mouse wheel in the listen-server window): host pawn Revolver, `rep = 0`, on the server and on the client's proxy (no double swap);
   - two matches ended and restarted during the session; no `Blueprint Runtime Error`, `Accessed None` or script error from the game.
3. **Packaged Development Win64 build of `1c4ae92`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-1c4ae92`, log `D:\RIXE_Builds\build-dev-1c4ae92.log`. Built from a clean checkout of the branch (no local asset or config differences).
4. **Unattended smoke run of that build** (25 Nov 2026 13:31–13:34 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-1c4ae92\smoke-1c4ae92-fps.log`): 2 victories, each followed by `ProcessServerTravel` (13:33:16, 13:34:21); no `Blueprint Runtime Error` or `Accessed None`; 0 `RIXE S1 dropped` lines; closed with a normal window close. The 24 startup D3D12 `Failed to create pipeline state` errors are the same pre-existing ones as in every earlier smoke log.

### Not verified / limits

- Synthetic keyboard input does not reach the PIE windows in this setup (the `1` / `2` weapon keys were not exercised); the mouse wheel uses the same swap chain (`ServerRixeAction 2` then local next-weapon swap).
- No emulated latency or packet loss, and no late-join client test (late join relies on the initial replication of `RixeWeaponIdxRep`).
- Single machine; no LAN, separate-machine or Internet test.
- Bots (`BP_ShooterNPC`) are not affected by this change.

**Next verifiable action:** audit section 6 item 10 (S6 + L2: reset ADS/sprint flags on possess and in Die; single ADS source). The server ADS timing part waits for the owner's decision on aim time.

## 19. Phase 2 — audit fix S6 + L2 (single ADS source): reset server ADS/sprint state (25 November 2026)

Scope: audit section 6 item 10. Branch `phase2/s6-ads-sprint-reset`, based on `main` @ `3c34bbc`. Phase 2 stays **Non vérifiée**.

### Change (code commit `829c1a4`; only `BP_ShooterPlayerController` and `BP_ShooterWeaponBase`)

- New controller function `RixeResetMoveState`: clears `RixeAdsSrv` and `RixeSprintSrv`; when the controlled pawn is a valid `BP_ShooterCharacter`, also clears its `RixeSprinting` and `bRixeADS` and calls `RixeApplySpeed`. It is called at the end of `EventOnPossess` and after `RixeRespawnPawn` in `OnDestroyed_Event` (the validity check avoids `Accessed None` when no pawn is respawned after victory).
- `RixeIsAds` (weapon): on authority, the controller's `RixeAdsSrv` is the only ADS source (previously `bRixeADS OR RixeAdsSrv`). Non-authority copies and bots keep the local `bRixeADS`, which only drives cosmetic recoil and local spread.
- **Not in this change:** the server ADS time (L2 remainder). It needs the aim-time rule from the owner decision on ADS time.
- A stray empty `OnDestroyed_Event_21` custom event created by the editor tooling was deleted before saving.

### Tests

1. Both Blueprints compile with warnings as errors; `RixeResetMoveState`, `RixeIsAds` and the two event chains were read back through the editor MCP.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 13:51–13:53 UTC; helper `Saved/rixe_s6_test.py`, not shipped):
   - baseline: server copy of the client's controller `AdsSrv=False SprintSrv=False`, walk speed 570, `RixeIsAds=False`;
   - armed (server body of `RixeServerAction2` for actions 7 then 4, as if the client was aiming and sprinting): `AdsSrv=True SprintSrv=True`, walk 399, server `RixeIsAds=True`; the client's own copy is unaffected;
   - the server destroys the client's pawn: a new pawn is spawned and possessed, `AdsSrv=False SprintSrv=False`, `bRixeADS=False`, walk 570, `RixeIsAds=False` on server and client copies;
   - one match ended and restarted during the session (13:52:09); no `Blueprint Runtime Error` or `Accessed None`.
3. **Packaged Development Win64 build of `829c1a4`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-829c1a4`, log `D:\RIXE_Builds\build-dev-829c1a4.log`. Built from a clean checkout of the branch (no local asset or config differences).
4. **Smoke run of that build** (25 Nov 2026 14:02–14:07 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-829c1a4\smoke-829c1a4-fps.log`): 4 victories (red, red, blue, blue), each followed by `ProcessServerTravel`; 0 `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines; closed through the in-game menu `QUITTER`, log ends with `LogExit: Exiting.`. The 24 startup D3D12 `Failed to create pipeline state` errors are the same pre-existing ones.

### Not verified / limits

- `call_method` runs the server body locally; the network RPC path for actions 7/4 was not re-sent in this run. Hold-to-aim with real mouse input was not exercised.
- Single machine; no LAN, separate-machine or Internet test.
- Observation: during this smoke run, the window close button and a `WM_CLOSE` sent to the process did not quit the game; the in-game `QUITTER` button did. Recorded for a later check (earlier smoke runs closed with the window close button).

**Next verifiable action:** audit section 6 item 11 (M9 + L15: assign teams once on login onto the smaller human team; `GetTeam` on the character returns its team).

## 20. Phase 2 — audit fix M9 + L15: team assignment on login (25 November 2026)

Scope: audit section 6 item 11. Branch `phase2/m9-team-assign`, based on `main` @ `9be0598`. Phase 2 stays **Non vérifiée**.

### Change (code commit `9aeeb98`; only `BP_ShooterGameMode` and `BP_ShooterCharacter`)

- `BP_ShooterGameMode`: new function `RixeAssignTeam(Player)`. For a valid `BP_ShooterPlayerController` whose `bTeamAssigned` is false, it counts the other assigned player controllers per team, sets the team through `BPI_Teammate SetTeam` onto the smaller team (tie: RED, team 0), and sets `bTeamAssigned`. The previously unused `bTeamAssigned` controller variable is reused.
- It is called from `OnPostLogin` (previously empty) and at the start of `ChoosePlayerStart`, as a fallback. The `PlayerArray` index parity rule and its orphaned pure nodes were removed from `ChoosePlayerStart`.
- `bUseSeamlessTravel` is false on the GameMode, so each match restart re-creates the controllers and assigns teams again.
- L15: `BP_ShooterCharacter` `GetTeam` (`BPI_Teammate`) now returns `Team Byte` instead of the constant 0.

### Tests

1. Both Blueprints compile with warnings as errors; `RixeAssignTeam`, `ChoosePlayerStart`, `OnPostLogin` and `GetTeam` were read back through the editor MCP.
2. **PIE, listen server + 3 remote clients + bots** (editor, same machine, 25 Nov 2026 14:16–14:18 UTC; helper `Saved/rixe_m9_test.py`, not shipped; the server-side controller list is logged with team, `bTeamAssigned` and pawn team):
   - start: 4 controllers, RED=2 BLUE=2, all assigned, each pawn's team matches its controller;
   - one BLUE client disconnects: RED=2 BLUE=1;
   - a RED client reconnects (`open 127.0.0.1:17777` in its world): with RED=1 BLUE=1 among the others it is assigned RED (tie rule);
   - **target scenario:** the last BLUE client reconnects while RED=2 BLUE=0: it is assigned **BLUE** (`BP_ShooterPlayerController_C_5 team=1`). The previous parity rule would have given index 2 → RED (3 vs 0).
3. **Packaged Development Win64 build of `9aeeb98`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-9aeeb98`, log `D:\RIXE_Builds\build-dev-9aeeb98.log`.
4. **Smoke run of that build** (25 Nov 2026 14:21–14:25 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-9aeeb98\smoke-9aeeb98-fps.log`): 2 victories (blue, red), each followed by `ProcessServerTravel`; 0 `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines; quit through the in-game `QUITTER` button, log ends with `LogExit: Exiting.`; the same 24 pre-existing D3D12 PSO errors.

### New findings (pre-existing, not caused by this change; recorded for later fixes)

- **Reconnect UI errors:** when a PIE client reconnects, `WBP_RixeHealthBar` (`Refresh`), `WBP_RixeHUD` (`Refresh HUD`) and `UI_ShooterBulletCounter` keep reading the client's previous `BP_ShooterCharacter` after it is destroyed (about 190 `Blueprint Runtime Error` lines, "pending kill or garbage"). The widgets need an `IsValid` guard or to unbind when their pawn is destroyed.
- **Late join, bots:** on a joining client, `BP_ShooterNPC` `Start Firing` / `Stop Firing` read `Weapon` before it is replicated (`Accessed None`, about 14 lines). Needs an `IsValid` guard on the client path.
- **Window close button:** in the packaged builds `829c1a4` and `9aeeb98`, the window close button does not quit the game (confirmed twice); the in-game `QUITTER` button does.

### Not verified / limits

- Single machine. Disconnect and reconnect were driven by console commands in the PIE client worlds, not by separate game instances or machines.
- The team-switch case (a player changing team voluntarily) does not exist in the game yet and was not tested.

**Next verifiable action:** audit section 6 item 12 (S4: respawn through a GameMode request with fallback, validity checks and retry). The owner direction for the four pending decisions is recorded in `DECISIONS_GAMEPLAY_2026-11-25.md` (PR #40); it unblocks L2 (server ADS time), L13 (sprint rules), S3 (suicide and team-kill scoring) and the bot respawn delay, which follow in the audit order.

## 21. Phase 2 — audit fix S4: respawn through a GameMode request (25 November 2026)

Scope: audit section 6 item 12. Branch `phase2/s4-respawn-request`, based on `main` @ `72f744d`. Phase 2 stays **Non vérifiée**.

### Change (code commit `d3c5f54`; only `BP_ShooterGameMode` and `BP_ShooterPlayerController`)

- `BP_ShooterGameMode`:
  - `RixeRequestRespawn(PC) -> Result` returns 1 (not allowed) for an invalid controller, a controller that is being destroyed (logout), or a finished match (`WinningTeam != 0`). Otherwise it calls `RixeSpawnFor`.
  - `RixeSpawnFor(PC)` returns 0 if the controller already has a pawn. Otherwise it picks a random team-tagged `PlayerStart` (same team → tag mapping as before), falls back to any `PlayerStart`, and returns 2 (retry) if there is none.
  - `RixeSpawnAt(PC, Start)` spawns `BP_ShooterCharacter` with `AdjustIfPossibleButAlwaysSpawn` and possesses it only if the spawn is valid (0), otherwise returns 2.
  - New `EventOnLogout`: destroys the exiting controller's pawn, if any.
- `BP_ShooterPlayerController` `RixeRespawnPawn` calls `RixeRequestRespawn`. On result 2 it retries every 0.5 s, at most 10 times (new `RixeRespawnTries`). `RixeSpawnAtTeamStart` is no longer called; it is left in place.
- The respawn delay chosen in `DECISIONS_GAMEPLAY_2026-11-25.md` (TDM 3.0 s) is **not** part of this change; it belongs to the bot/player respawn-delay item.

### Tests

1. Both Blueprints compile with warnings as errors; the four functions and the two events were read back through the editor MCP.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 14:28–14:38 UTC; helper `Saved/rixe_s4_test.py`, not shipped; the server destroys the client's pawn to trigger `OnDestroyed` → `RixeRespawnPawn`):
   - **normal:** a new pawn is possessed at a tagged start in the same frame, tries 0;
   - **no tagged start** (tags removed from the 6 `PlayerStart`s): the new pawn appears at an untagged start (`-800,-1050,98` and `-232,-1350,298`), not at the origin;
   - **no start at all** (all `PlayerStart`s destroyed): no pawn is spawned; `RixeRespawnTries` goes 1 → 5 → back to 0 after the 10 retries (about 5 s); no runtime error;
   - **after victory** (a real victory, caught by a tick callback when `WinningTeam` becomes 1): the client's pawn is destroyed and no pawn is respawned (`pawn=None`, tries 0, logged in the same frame);
   - **client disconnects while alive:** first run, without the logout check: the server kept the leaving client's controller and gave it a new pawn (orphan). This was a regression of the first version of this change, since the old spawn code did not show it in the M9 run. With the `IsActorBeingDestroyed` check and `EventOnLogout`: only the host's pawn remains, no orphan, the leaving controller is gone.
   - No `Blueprint Runtime Error` or `Accessed None` in the editor log between 14:28 and 14:38.
3. **Packaged Development Win64 build of `d3c5f54`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-d3c5f54`, log `D:\RIXE_Builds\build-dev-d3c5f54.log`.
4. **Smoke run of that build** (25 Nov 2026 14:40–14:43 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-d3c5f54\smoke-d3c5f54-fps.log`): 2 victories (blue, red), each followed by `ProcessServerTravel`; 0 `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines; quit through `QUITTER`, log ends with `LogExit: Exiting.`; the same 24 pre-existing D3D12 PSO errors.

### Not verified / limits

- `WinningTeam` cannot be written from editor Python, so the victory case used a real victory; only one victory was observed with the final version.
- The bot director's own respawn path (`BP_RixeBotDirector`) is not changed by this item.
- Single machine; disconnects were driven by the `disconnect` console command in the PIE client world.

**Next verifiable action:** audit section 6 item 13 (S3: killer attribution and the suicide / team-kill scoring rules of `DECISIONS_GAMEPLAY_2026-11-25.md`).

## 22. Phase 2 — audit fix S3: death credit after recent enemy damage (25 November 2026)

Scope: audit section 6 item 13, with the scoring rule of `DECISIONS_GAMEPLAY_2026-11-25.md` section 2 (owner direction: follow XDefiant, Call of Duty and Apex Legends). Branch `phase2/s3-kill-credit`, based on `main` @ `ca41be9`. Phase 2 stays **Non vérifiée**.

### Change (code commit `a301c34`; only `BP_ShooterCharacter` and `BP_ShooterNPC`)

- New `RixeNoteDamage(Causer)`, called first in `AnyDamage` on both Blueprints. If the causer is a `BP_ShooterProjectileBase` whose cached instigator team (`RixeInstTeam` with `RixeInstTeamKnown`, from the M4 fix) differs from the victim's `Team Byte`, the current game time is stored in the new `RixeLastEnemyTime`.
- New `RixeScoreDeath` replaces the direct `IncrementTeamScore` call in `Die`. The point goes to the enemy team only if enemy damage was noted in the last 5 s. A suicide (own grenade), environment death or any death without recent enemy damage scores nothing.
- The team that receives the point is unchanged: `IncrementTeamScore(victim team)`, where the GameMode adds the point to the other team.
- **Not in this change, and recorded as limits:**
  - per-player kill credit and K/D (no per-player stats exist yet; persistent stats are Phase 5);
  - team-kill penalties (friendly fire is off in standard modes, specification 34.2);
  - "quit with recent enemy damage" credit (needs a logout-time scoring hook);
  - suicide respawn penalty (+1 s), which belongs to the respawn-delay item.

### Tests

1. Both Blueprints compile with warnings as errors; the two functions and the modified `AnyDamage` / `Die` chains were read back through the editor MCP.
2. **PIE, listen server + 1 remote client + bots** (editor, same machine, 25 Nov 2026 14:50–14:55 UTC). The helper `Saved/rixe_s3_test.py` (not shipped) reads the GameMode `TeamScores` map and the GameState red/blue scores in the same frame as each action:
   - `Python apply_damage` did not reach the pawn's `AnyDamage`, so the hooks were driven directly. `RixeNoteDamage` is called with a **real bot projectile caught in flight** by a tick callback, then `Die` is called (the server-side death that runs `RixeScoreDeath`).
   - **friendly projectile** (instigator team = victim team): not noted (`RixeLastEnemyTime` stays 0);
   - **enemy projectile then death in the same frame:** red 0 → 1 (+1 for the enemy team);
   - **suicide on a fresh pawn** (no enemy damage): red 11 / blue 10 unchanged;
   - **death about 8 s after enemy damage:** unchanged;
   - normal bot-vs-bot kills kept scoring throughout (red 11 / blue 10 after about 40 s), and matches ended in victory;
   - no `Blueprint Runtime Error` or `Accessed None` in the editor log between 14:49 and 14:59.
3. **Packaged Development Win64 build of `a301c34`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB, output `D:\RIXE_Builds\dev-a301c34`, log `D:\RIXE_Builds\build-dev-a301c34.log`.
4. **Smoke run of that build** (25 Nov 2026 14:57–15:00 UTC, single local player plus bots, log `D:\RIXE_Builds\evidence-a301c34\smoke-a301c34-fps.log`): 2 victories (blue, red), each followed by `ProcessServerTravel`, so scoring still reaches the victory threshold; 0 `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines; quit through `QUITTER`, log ends with `LogExit: Exiting.`; the same 24 pre-existing D3D12 PSO errors.

### Not verified / limits

- A real self-grenade death and a real bullet kill by a human were not performed; the hooks were exercised directly with real projectiles.
- Observation: `BP_ShooterCharacter` `Die` has no `DoOnce` guard (`BP_ShooterNPC` has one). In play, `AnyDamage` only calls `Die` while HP > 0, but a second direct call on a dying pawn scores again. Recorded for a later hardening.
- Single machine.

**Next verifiable action:** audit section 6 item 14 (L1 + M6 + M7: server-driven shot event, authority-only weapon spawning, server aim). The audit marks it as the larger refactor needing a 2-client trace test first. The decided rules for ADS time (L2), sprint (L13) and respawn delay stay queued as separate items.

## 23. Phase 2 — audit item 14 (L1 + M7, M6 projectile part): server-driven shot event and server aim (25 November 2026)

Scope: audit section 6 item 14 and findings L1, M6, M7. Branch `phase2/item14-server-shot`, based on `main` @ `52e8875`. Phase 2 stays **Non vérifiée**.

### Trace test before any change (PIE, listen server + 2 clients + bots, `main` @ `52e8875`)

Helper `Saved/rixe_i14_test.py` (not shipped; modes `census`, `aim`, `fire`, `ammo`, `watch`):

- **M6 confirmed.** Every machine spawns its own weapons. On each of the 3 worlds: 2 per player and 1 per bot, 23 in total, all with `replicates=False`. Projectile classes are not replicated either.
- **L1 confirmed.** `ServerRixeAction` 1 then 0 in the same server frame: the server weapon fired (ammo 30 → 29). The other client's copy of that weapon never fired (ammo stayed 30), so the shot was invisible there.
- **M7, spread desync confirmed.** During a 30-tick hold the server spawned 28 projectiles and the proxy client spawned 28 of its own, with its own spread (positions up to ~50 uu apart).
- **M7, "server camera lacks pitch" refuted in PIE.** At control pitch +30° and −40°, the server copy of each remote pawn had the same `FirstPersonCamera` pitch, `GetBaseAimRotation` and target point as the client. In one later run the server camera read p = −2° while the control rotation was +2°, so the camera component is not a reliable aim source.

### Change (code commit `2339dec`; only `BP_ShooterWeaponBase`, `BP_ShooterCharacter`, `BP_ShooterNPC`)

- `BP_ShooterWeaponBase.RixeFire`:
  - The pellet loop that spawns projectiles now runs only when `IsServer`. `HasAuthority` cannot be used here: weapons are local, non-replicated actors, so a client's copy of a weapon has local authority.
  - The server stores each pellet transform in the new `RixeShotXfs` array and calls the new `RixeSendShot`, which multicasts the array on the owning pawn.
  - Montage, recoil, ammo, HUD and reload are unchanged on every machine.
- `BP_ShooterCharacter` and `BP_ShooterNPC`:
  - New `RixeShotMC(Xfs)`, an **unreliable NetMulticast** event, that calls the new `RixeShowShot`.
  - On clients only, `RixeShowShot` calls the new `BP_ShooterWeaponBase.RixeCosmeticShots`, which spawns cosmetic projectiles from the pawn's local weapon copy at the server's exact transforms. Damage stays server-only through the existing `ProcessHit` `IsServer` gate.
- `BP_ShooterCharacter.Get Weapon Target Location`: the trace direction is now `GetForwardVector(GetBaseAimRotation())` instead of the `FirstPersonCamera` forward vector. The trace still starts at the camera location.
- A first version put the multicast on `BP_RixeGameState`. It delivered only 7 of 20 shots: the GameState updates at 10 Hz and shares one unreliable RPC budget across every shooter. The multicast was moved to the pawns, which update at 100 Hz, and the GameState change was reverted.
- Workflow note: the tooling cannot set RPC flags or typed parameters on custom events, so the two `RixeShotMC` nodes were pasted as editor node text with `FunctionFlags` = Public | BlueprintCallable | BlueprintEvent | Net | NetMulticast. Both read back in the Details panel as Multicast, not Reliable, Public, with `Xfs: Transform[]`.

### Tests

1. All three Blueprints compile with warnings as errors. `RixeFire`, `RixeSendShot`, `RixeCosmeticShots`, both `RixeShowShot` and `Get Weapon Target Location` were read back through the editor MCP.
2. **PIE re-run after the change** (listen server + 2 clients + bots, 25 Nov 2026 19:08–19:16 UTC):
   - **30-tick hold by remote client P257 (driven by the helper):** the server spawned 20; the owning client and the proxy each drew 19 cosmetics. Every delivered shot had the same position and rotation on all three machines. The proxy no longer spawns its own bullets. The one shot not drawn on clients was fired inside the Python call itself.
   - **Real mouse taps by the host:** 4 of 4 shots appeared on both clients with identical transforms.
   - **Real mouse taps by remote client P269:** the server spawned 9; the owning client and the proxy each drew 9, all identical.
   - **Aim:** `GetBaseAimRotation` matched the client control rotation on the server.
   - No `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines in the editor log.
3. **Packaged Development Win64 build of `2339dec`:** `RunUAT BuildCookRun`, same parameters as section 8; cook `Success - 0 error(s), 0 warning(s)`, `BUILD SUCCESSFUL`, ~965 MB. Output `D:\RIXE_Builds\dev-2339dec`, log `D:\RIXE_Builds\build-dev-2339dec.log`.
4. **Smoke run of that build** (25 Nov 2026 19:20–19:25 UTC, single local player plus bots; log `D:\RIXE_Builds\evidence-2339dec\smoke-2339dec-fps.log`):
   - 3 victories (blue, red, red), each followed by `ProcessServerTravel`;
   - 0 `Blueprint Runtime Error`, `Accessed None` or `RIXE S1 dropped` lines;
   - quit through `QUITTER`; the log ends with `LogExit: Exiting.`;
   - the same 24 pre-existing D3D12 PSO errors and the same `LogRHI` error set as the `a301c34` smoke log.
   - During the run a second game instance was started by mistake by the desktop automation. It had no window, was ended with Stop-Process, and its log is kept as `stray-instance-2339dec-fps_2.log`. It is not part of the evidence.

### Not verified / limits

- **M6 weapon-actor part not done (audit item 14b).** Weapons are still spawned on every machine and are not replicated. The owning client's HUD ammo is still predicted locally: after one real-tap run the server had 20 and the owner showed 21.
- **The same-frame tap (L1) was not reproduced with real input.** Driven from Python, the server fired but neither client drew the cosmetic. Real taps from a remote client (9 of 9) and from the host (4 of 4) were all delivered. Python-issued RPCs outside the PIE world tick may explain this, but that is not proven.
- Owning clients now see their own tracers one round trip late, because there is no local prediction. Sending origin, direction and a seed in the fire RPC (the audit's "later" step) is not done.
- Unreliable multicast: under heavy load the budget is up to 2 RPCs per pawn net update, so some cosmetics may be dropped. Damage is not affected.
- The harness misses projectiles that hit a wall within one frame (~8 fps PIE with 3 windows), so counts were taken while aiming at the open sky.
- Single machine; no Internet or latency test; no dedicated server.
- Editor incidents:
  - At session start, 6 assets that differed from `main` after a save were backed up to `D:\RIXE_Backups\dirty-editor-assets-2026-11-25-item14\` (with SHA256SUMS), restored from git and reloaded. Graph reads through the MCP mark Blueprints dirty, which is the likely cause.
  - The editor crashed once ("pure virtual function call") when a package was reloaded while its Blueprint editor was open. The crash report was not sent. No saved work was lost.

**Next verifiable action:** audit item 14b (authority-only replicated weapons), or item 15 (L14), as the owner prefers. The queued owner-decision items (L2, L13, respawn delay) are unchanged.
