# RIXE — Suivi vérifiable des phases

**Last verified update: 24 November 2026**  
**Dépôt :** `zallyx62/fps-`  
**Référence fonctionnelle :** `CAHIER_DES_CHARGES_RIXE.md`, version approuvée la plus récente.

Ce fichier est le registre des preuves et de l'avancement réellement démontré. Il ne remplace ni le cahier des charges, ni les instructions de développement de `CLAUDE.md`, ni le journal du prototype `UNREAL.md`.

## 1. Current repository state

| Item | Verified state |
|---|---|
| Canonical branch | `main` |
| Mirror branch | `jeu-unreal` |
| Current `main` SHA | `19ced966cef665be47c66e5f3a78f0039846dcf2` |
| Current `jeu-unreal` SHA | `19ced966cef665be47c66e5f3a78f0039846dcf2` — identical to `main` |
| Latest main commit | `19ced966` — documentation-only refactor of `CLAUDE.md` |
| Latest non-documentation project/configuration/tooling commit | `e8a40f4895e22212ce1298672a1db396f6dfcf60` (20 November 2026); the 45 commits after it change documentation and add the mirror workflow only |
| Gameplay code commit validated with a reproducible protocol | **None recorded** |
| Verified Windows packaged build | **None recorded** |
| Verified public release | **None recorded** |
| Open pull requests | **None**; PR #13 is merged |
| Latest repository validation | Success — [workflow run 45288243208](https://github.com/zallyx62/fps-/actions/runs/45288243208) |
| Latest mirror synchronization | Success — [workflow run 45288243001](https://github.com/zallyx62/fps-/actions/runs/45288243001) |

The full recursive Git tree was retrieved without truncation at the current main commit: **589 tracked files**, including 536 `.uasset` files and 3 `.umap` files. No identical Git blob SHA was shared by two tracked paths. This checks exact file duplication only; it does not detect functional duplication inside Unreal assets.

GitHub reports `protected=false` for both `main` and `jeu-unreal`; the repository rulesets endpoint returned an empty list. The branch-protection details endpoint could not be read by the connected integration. Therefore, do not describe `main` as server-side protected. It remains the canonical branch by project policy.

The latest project/configuration/tooling commit is not proof of a gameplay implementation or a tested game build. Keep all gameplay phases unverified until the evidence required by the specification is recorded.
## 2. Cahier des charges — autorité et périmètre actuel

Le cahier des charges est la source de vérité pour les fonctionnalités, décisions produit, contraintes et priorités.

- Le document contient **71 sections principales** à la date de cette revue.
- La section 71 est approuvée le 23 novembre 2026 : « Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée ».
- La section 71 couvre notamment le pipeline de fabrication, la présélection de 34 armes et les apparences cosmétiques de mêlée.
- Les apparences de mêlée sont des cosmétiques : ne pas les convertir en armes fonctionnelles supplémentaires ni créer de doublons d'armes.
- Claude must inspect the current specification headings, search for the task's requirements, and read the complete relevant sections and their dependencies. Do not require a fixed section range such as 42–71 at every session start; broaden to the whole specification only for global audits, feature-novelty checks or cross-cutting work.
- Aucune exigence approuvée ne peut être supprimée, rétrogradée ou considérée comme facultative sans décision explicite du propriétaire.
- En cas de chevauchement, rattacher l'exigence au système propriétaire existant et conserver les références croisées. En cas de contradiction entre décisions approuvées, demander arbitrage plutôt que deviner.

## 3. État des phases

**Aucune phase n'est actuellement déclarée validée.** Les notes historiques de tests dans l'éditeur et les contrôles GitHub Actions ne remplacent pas les preuves exigées ci-dessous.

| Phase | Critère de passage à démontrer | Statut | Preuve actuellement enregistrée | Prochaine action |
|---|---|---|---|---|
| 0 — Sécurisation et état des lieux | Sauvegarde, audit des risques, état reproductible du dépôt et blocage principal identifié | **Non vérifiée** | Audit documentaire GitHub réalisé ; pas d'audit complet de la machine locale ni de sauvegarde vérifiée | Vérifier l'environnement local, les sauvegardes, secrets, plugins, licences et état de travail |
| 1 — Première boucle FPS Windows jouable | Build Windows exécutable et partie complète reproductible sur une carte pilote | **Non vérifiée** | Notes historiques d'essais dans l'éditeur ; aucune build empaquetée référencée | Produire et tester une build Windows, enregistrer l'artefact et le protocole |
| 2 — Fondations FPS, combat, réseau et carte pilote | Combat stable, autorité serveur testée, bots, tests réseau progressifs et régressions critiques corrigées | **Non vérifiée** | `UNREAL.md` décrit des essais PIE historiques ; critères complets non démontrés sur le commit courant | Rejouer les tests sur le commit exact, plusieurs clients et réseaux distincts |
| 3 — EOS et parties privées | Identité, invitations, lobby privé, lancement, retour et reconnexion testés de bout en bout | **Non vérifiée** | Prototype documenté avec `OnlineSubsystem Null` et connexion IP directe ; aucun parcours EOS validé | Implémenter puis tester le parcours EOS privé selon le cahier |
| 4 — Matchmaking public et contenu de lancement | File publique, lobby, groupes, départs/reconnexion, cartes et modes d'alpha validés | **Non vérifiée** | Aucun rapport de validation de matchmaking public ou de toutes les cartes/modes | Après les prérequis, valider matchmaking, continuité et contenu de lancement |
| 5 — Données durables et services communautaires étendus | Progression/statistiques persistantes cohérentes, protégées et restaurables | **Non vérifiée** | Aucune preuve de phase enregistrée | Développer après validation des événements de match et dépendances |
| 6 — Qualité, performances et préparation alpha | Non-régression, performances multi-configurations, licences, build Shipping et retour arrière | **Non vérifiée** | Aucune build Shipping/alpha ni campagne de validation complète référencée | Préparer la campagne de validation après les phases précédentes |
| 7 — Extensions | Chaque extension possède critères, tests, preuves et retour arrière sans régression du socle | **Non vérifiée** | Aucune extension n'est validée par ce registre | N'ouvrir que les extensions dont les dépendances sont franchies |

## 4. Audit GitHub reproductible — relevé initial du 23 novembre 2026

Les éléments ci-dessous décrivent le relevé initial effectué sur `main` au SHA `e378e1485691c523a7b2a769ab77a808ebd9ec14`. Ils restent un historique utile, mais ne doivent pas être interprétés comme l'état courant après les commits documentaires suivants :

- Arborescence récursive complète : **589 fichiers suivis** ; résultat non tronqué.
- Répartition observée : 536 fichiers `.uasset`, 3 fichiers `.umap`, et les fichiers de configuration, scripts, documentation et prototype web.
- Comparaison des identifiants de blobs Git : **aucun groupe de fichiers au contenu strictement identique détecté**. Cela ne prouve pas l'absence de doublons fonctionnels dans les Blueprints ou les systèmes Unreal.
- Numérotation des titres de sections principales du cahier : aucun numéro principal dupliqué détecté.
- Les titres de sous-sections génériques tels que « Priorités et critères communs », « Validation » ou « Statut » se répètent dans des sections différentes : ce sont des gabarits locaux, pas à eux seuls des doublons fonctionnels.
- À la date de ce relevé initial, les deux branches de référence étaient identiques : `main` = `jeu-unreal` = `e378e1485691c523a7b2a769ab77a808ebd9ec14`.
- Workflow [Validate RIXE repository](https://github.com/zallyx62/fps-/actions/runs/45173785657) sur ce SHA : terminé avec succès. Il vérifie la structure du projet, les métadonnées/géométries générées, la syntaxe Python et un test de génération OBJ. Il ne compile pas Unreal, ne charge pas les Blueprints et ne produit pas de build Windows.
- Workflow [Keep jeu-unreal synchronized with main](https://github.com/zallyx62/fps-/actions/runs/45173785667) sur ce SHA : terminé avec succès.
- `README.md`, `UNREAL.md`, `fps.uproject` et `Config/DefaultEngine.ini` concordent sur la carte et le mode de jeu de démarrage documentés : `Variant_Shooter/Lvl_ArenaShooter` et `BP_ShooterGameMode`.
- Le prototype multijoueur documenté reste fondé sur `OnlineSubsystem Null` et la connexion IP directe. EOS et le matchmaking public restent des objectifs non validés.
- `UNREAL.md` signale les écarts du prototype : apparitions, bots, score, profils graphiques, autorité serveur et anti-triche. Ne pas les présenter comme résolus sans preuves nouvelles.
- `LICENCE_DISTRIBUTION.md` maintient le blocage de distribution publique tant que la compatibilité GPL/Epic, la provenance des assets et les licences des plugins/dépendances ne sont pas établies.

### Limites explicites de cet audit

L'API GitHub permet d'inventorier les chemins et les blobs, mais pas d'inspecter la structure interne des assets binaires Unreal (`.uasset`, `.umap`). Cet audit n'a pas accès à la machine locale, à l'éditeur Unreal, aux sauvegardes, aux modifications non commitées, aux journaux locaux ni à une compilation empaquetée. Il ne peut donc pas certifier l'absence de doublons internes dans les Blueprints, de problèmes d'exécution ou de défauts de gameplay.

## 4 bis. Current GitHub audit — 24 November 2026

The following repository state was checked against GitHub after PR #13 was merged.

- `main` and `jeu-unreal` both point to `19ced966cef665be47c66e5f3a78f0039846dcf2`.
- The mirror workflow completed successfully after the merge: [run 45288243001](https://github.com/zallyx62/fps-/actions/runs/45288243001). The repository validation workflow also completed successfully: [run 45288243208](https://github.com/zallyx62/fps-/actions/runs/45288243208).
- The validation job ran the Python dependency installation and `Tools/validate_project.py`, including project JSON, Python syntax, weapon metadata, generated geometry and OBJ smoke checks. It did **not** compile Unreal, load Blueprints or package a Windows build.
- No pull request is currently open. PR #13, which refactored `CLAUDE.md`, is merged.
- The recursive tree contains 589 tracked files and is not truncated. Exact duplicate Git blobs: none. Binary Unreal assets cannot be inspected internally through this tree audit.
- The current branch listing contains nine historical `docs/*` branches in addition to `main` and `jeu-unreal`. Their commits unique to each branch affect documentation only; they are not current working branches. Do not reuse, merge or delete them without inspecting the unique commits. PR #13's source branch is also retained after its content was squash-merged.

| Historical branch | Head SHA | Ahead of `main` | Behind `main` | Current handling |
|---|---|---:|---:|---|
| `docs/clarify-claude-resume-workflow` | `a29400bf9ca5b44217559e8f4fbad045038527b9` | 1 | 9 | Divergent; inspect before reuse |
| `docs/correct-current-audit-refs` | `9a7e4d4cdfa763cc52c53a4868930dc4185fd016` | 1 | 5 | Divergent; inspect before reuse |
| `docs/english-first-working-policy` | `c13b0ce30b142853c99a423990ad429f57587c1e` | 1 | 3 | Divergent; inspect before reuse |
| `docs/finalize-claude-handoff-2026-11-23` | `4d214d34ff9da350b572462b333679648009ddcd` | 3 | 6 | Divergent; inspect before reuse |
| `docs/fix-code-commit-reference` | `4938bd8cfb19cac1c8ac4a4d139a9821cf90a9f1` | 1 | 7 | Divergent; inspect before reuse |
| `docs/record-github-audit-2026-11-23` | `62a5d7cc04d8678282cec2f37b9d85e8d539a5f2` | 1 | 8 | Divergent; inspect before reuse |
| `docs/refactor-claude-md-2026-11-24` | `806f49c143a1b9bbaab1f9020fed397309533f51` | 1 | 1 | PR #13 merged; branch pointer remains |
| `docs/token-context-efficiency` | `52469d35f0517317131524aa300f849ae1b7dff6` | 1 | 2 | Divergent; inspect before reuse |
| `docs/update-current-github-audit` | `7635354620fbdf8c4293e506cdb4d26fd7649b80` | 3 | 4 | Divergent; inspect before reuse |

The GitHub branch listing reports `protected=false` for `main` and `jeu-unreal`, and the rulesets query returned no rulesets. Branch-protection details could not be inspected with the connected integration. Server-side protection is therefore **not verified** and must not be claimed.
## 5. Registre de preuve obligatoire

Pour chaque tentative de validation, ajouter une entrée datée avec :

- Phase et critère exact évalué.
- Branche et SHA du commit du code testé (pas seulement le commit documentaire).
- Version d'Unreal, configuration (Development/Shipping), plateforme et matériel pertinent.
- Build/artefact exact et emplacement ou lien vérifiable, si produit.
- Procédure de test, nombre de joueurs/clients, réseau utilisé et conditions.
- Résultat observé : réussi/échoué/non exécuté, logs et captures utiles.
- Régressions, limites, blocages et action corrective.
- Décision : critère franchi ou non franchi, avec responsable et date.

## 6. Mise à jour du suivi

Claude doit mettre à jour ce fichier dans le même lot de travail lorsqu'une validation réelle, une modification du dépôt ou un changement de statut intervient.

- Distinguer systématiquement le SHA documentaire du SHA du code réellement testé.
- Vérifier à nouveau les branches et les workflows ; ne pas recopier un ancien état comme s'il était actuel.
- Ne jamais convertir un commit documentaire, un contrôle Python, une synchronisation Git ou un test PIE isolé en preuve de build Windows, de test Internet ou de franchissement de phase.
- Conserver le statut **Non vérifiée** tant que toutes les preuves du critère ne sont pas disponibles.
- Si aucun test n'a été exécuté, l'écrire explicitement.
- Cette règle n'implique aucune surveillance automatique permanente entre les sessions.

**Prochaine action prioritaire :** sur la machine de développement, vérifier l'état local et les sauvegardes, ouvrir le projet avec Unreal Engine 5.8, contrôler les plugins et les journaux, reproduire le démarrage, puis produire une première build Windows de test. Consigner les résultats sur le SHA exact du code avant de modifier le statut des phases.
