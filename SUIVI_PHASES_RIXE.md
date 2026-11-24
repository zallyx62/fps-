# RIXE — Suivi vérifiable des phases

**Dernière mise à jour :** 24 novembre 2026  
**Dépôt :** `zallyx62/fps-`  
**Référence fonctionnelle :** dernière version approuvée de `CAHIER_DES_CHARGES_RIXE.md`.

Ce document enregistre l'avancement réellement démontré et les preuves associées. Il ne remplace ni le cahier des charges, ni les consignes de travail de `CLAUDE.md`, ni le journal d'implémentation Unreal, ni le registre spécialisé des licences.

## 1. État de référence GitHub — audit du 24 novembre 2026

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

**Aucune phase du projet n'est actuellement déclarée validée.** Les anciens essais dans l'éditeur et les contrôles statiques GitHub ne remplacent pas les preuves exigées par le cahier des charges.

| Phase | Critère à démontrer | Statut | Preuve ou blocage actuellement enregistré |
|---|---|---|---|
| 0 — Sécurisation et état des lieux | Sauvegardes vérifiées, audit de l'environnement, état reproductible et blocages identifiés | **Non vérifiée** | Evidence recorded in section 8 (verified backup, environment audit, secret scan); awaiting owner acceptance |
| 1 — Première boucle FPS Windows jouable | Build Windows empaquetée et partie complète reproductible sur une carte pilote | **Non vérifiée** | Packaged Development build `aeaf808` tested locally with bots (section 8); not distributed, no network test; awaiting owner acceptance |
| 2 — Fondations FPS, combat, réseau et carte pilote | Combat stable, autorité serveur testée, bots, tests réseau progressifs et régressions critiques corrigées | **Non vérifiée** | Notes PIE historiques uniquement ; aucun rapport de test du commit courant répondant aux critères complets |
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

**Prochaine action projet :** vérifier l'espace de travail local et les sauvegardes, ouvrir le projet dans Unreal Engine 5.8, inspecter les plugins et les journaux de l'éditeur, reproduire le démarrage, puis produire et tester une build Windows de développement. Enregistrer les résultats sur le SHA exact du code avant de modifier le statut d'une phase.


## 7. Correctif technique ciblé — 24 novembre 2026

**Pull request :** [#23 — restauration de la visibilité des armes après la visée](https://github.com/zallyx62/fps-/pull/23)

- **Fichier corrigé :** `Tools/dsl/scope_apply.dsl`. À la désactivation de la lunette, les meshes d'armes en vue subjective sont maintenant réaffichés, comme le mesh du personnage. Ils restent masqués uniquement pendant l'affichage de la lunette.
- **Validation renforcée :** `Tools/validate_project.py` vérifie désormais l'équilibre des parenthèses et la fermeture des chaînes de caractères dans les scripts de `Tools/dsl/`, puis contrôle la règle de visibilité des armes pour prévenir cette régression.
- **Commit du correctif DSL :** `3df8b0ddc8707556821c96780e42b5527e10db0e`.
- **Commit contenant les nouveaux contrôles :** `fa9cacf82941c80f4516fd4cd1b5635a9ace3a83`.
- **CI :** validation GitHub Actions n° 81 réussie — [exécution 45294161509](https://github.com/zallyx62/fps-/actions/runs/45294161509). Les contrôles statiques et tests de génération ont réussi.

**Limite de preuve :** aucun chargement du projet dans Unreal, aucune compilation de Blueprint, aucun test de la visée en jeu et aucune build Windows n'ont été effectués dans cette opération. Le contrôle DSL vérifie la structure et la règle ciblée ; il ne remplace pas le compilateur ni l'exécution Unreal. Les phases 0 à 7 restent donc **Non vérifiées** et aucun critère de phase n'est déclaré franchi.

## 8. Phase 0–1 evidence — Windows Development build (24 November 2026)

**Branch:** `phase1/windows-dev-build` (based on `main` @ `d0c3b23`). **Status of phases 0 and 1: still _Non vérifiée_** until the owner explicitly accepts this evidence.

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
- **Decision on passing phases 0 and 1:** pending owner acceptance. Until then both stay **Non vérifiée**.
