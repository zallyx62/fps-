# RIXE — Suivi vérifiable des phases

**Mise à jour documentaire : 23 novembre 2026**  
**Dépôt :** `zallyx62/fps-`  
**Référence fonctionnelle :** `CAHIER_DES_CHARGES_RIXE.md`, version approuvée la plus récente.

Ce fichier est le registre des preuves et de l'avancement réellement démontré. Il ne remplace ni le cahier des charges, ni les instructions de développement de `CLAUDE.md`, ni le journal du prototype `UNREAL.md`.

## 1. Références GitHub et état documentaire

| Élément | État vérifié |
|---|---|
| Branche de référence | `main` |
| Branche miroir | `jeu-unreal` |
| SHA actuel de `main` après consolidation documentaire du 23 novembre 2026 | `f8f56c41acb3297d2bbe062c5eb9e5c6c41258a9` |
| SHA de `main` avant la consolidation documentaire finale | `e378e1485691c523a7b2a769ab77a808ebd9ec14` |
| État vérifié après le dernier commit contrôlé | `main` et `jeu-unreal` pointent toutes deux sur `c2c3f41f6702e9b904024c09f6a18bfbbcd9d2af` (vérifié le 23 novembre 2026) |
| Dernière section principale du cahier au 23 novembre 2026 | **71 — Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée** |
| Dernière modification du cahier avant ce nettoyage | `d6e2505b46ad9acf5e6f7e6dd019cc3e626f79f4` — ajout de la section 71 ; modification documentaire du cahier, pas preuve d'implémentation |
| Dernier commit identifié touchant configuration/outillage du dépôt | `e8a40f4895e22212ce1298672a1db396f6dfcf60` — configuration, validation et documentation, 20 novembre 2026 |
| Commit de code gameplay validé par un protocole reproductible | **Aucun enregistré** |
| Build Windows empaquetée vérifiée | **Aucune preuve enregistrée** |
| Release publique vérifiée | **Aucune** |

Les commits documentaires postérieurs à `d6e2505` ne doivent jamais être présentés comme des commits de code testé. Après le présent nettoyage, mettre à jour les SHA documentaires et les références de branches sans modifier rétroactivement l'identité du dernier commit de code réellement testé.

## 2. Cahier des charges — autorité et périmètre actuel

Le cahier des charges est la source de vérité pour les fonctionnalités, décisions produit, contraintes et priorités.

- Le document contient **71 sections principales** à la date de cette revue.
- La section 71 est approuvée le 23 novembre 2026 : « Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée ».
- La section 71 couvre notamment le pipeline de fabrication, la présélection de 34 armes et les apparences cosmétiques de mêlée.
- Les apparences de mêlée sont des cosmétiques : ne pas les convertir en armes fonctionnelles supplémentaires ni créer de doublons d'armes.
- Claude doit relire les sections 42 à 71 et les sections antérieures référencées par elles avant toute tâche concernée. Il doit aussi vérifier le numéro de la dernière section actuelle : 71 n'est pas une limite permanente si le cahier évolue.
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

## 4 bis. Actualisation de l'état GitHub après consolidation — 23 novembre 2026

Vérification effectuée sur la révision courante de main :

- SHA actuel de `main` : `c2c3f41f6702e9b904024c09f6a18bfbbcd9d2af`.
- SHA actuel de `jeu-unreal` : `c2c3f41f6702e9b904024c09f6a18bfbbcd9d2af` ; les deux branches sont identiques au moment de cette vérification.
- Le workflow de validation du dépôt sur ce SHA s'est terminé avec succès : [exécution 45196603347](https://github.com/zallyx62/fps-/actions/runs/45196603347).
- Le workflow de synchronisation du miroir sur ce SHA s'est terminé avec succès : [exécution 45196603269](https://github.com/zallyx62/fps-/actions/runs/45196603269).
- L'arborescence récursive vérifiée reste complète et non tronquée : 589 fichiers suivis au relevé précédent ; le dernier commit contrôlé est documentaire.
- Cinq branches documentaires historiques subsistent en plus de `main` et `jeu-unreal`. Elles divergent toutes de `main` et ne doivent pas être fusionnées automatiquement. Les écarts ci-dessous ont été recalculés par comparaison avec le SHA courant de `main` :

| Branche | SHA observé | Écart par rapport à main | Traitement |
|---|---|---|---|
| `docs/clarify-claude-resume-workflow` | `a29400bf9ca5b44217559e8f4fbad045038527b9` | 1 commit en avance, 5 en retard | Historique divergent ; ne pas fusionner automatiquement |
| `docs/correct-current-audit-refs` | `9a7e4d4cdfa763cc52c53a4868930dc4185fd016` | 1 commit en avance, 1 en retard | Historique divergent ; ne pas fusionner automatiquement |
| `docs/fix-code-commit-reference` | `4938bd8cfb19cac1c8ac4a4d139a9821cf90a9f1` | 1 commit en avance, 3 en retard | Historique divergent ; ne pas fusionner automatiquement |
| `docs/record-github-audit-2026-11-23` | `62a5d7cc04d8678282cec2f37b9d85e8d539a5f2` | 1 commit en avance, 4 en retard | Historique divergent ; ne pas fusionner automatiquement |
| `docs/finalize-claude-handoff-2026-11-23` | `4d214d34ff9da350b572462b333679648009ddcd` | 3 commits en avance, 2 en retard | Historique divergent ; ne pas fusionner automatiquement |

Les cinq branches historiques ne sont pas supprimées par cette correction : leur suppression nécessite une décision séparée et une vérification de leur utilité. Les références et écarts ci-dessus décrivent l'état observé le 23 novembre 2026 et doivent être revérifiés avant toute opération Git.

## 5. Branches documentaires historiques à ne pas réutiliser

Les cinq branches suivantes ont été vérifiées le 23 novembre 2026 et divergent de `main`. Leurs écarts exacts sont indiqués par rapport au SHA courant ; leur contenu doit être inspecté séparément avant toute réutilisation :

| Branche | Traitement documentaire | Consigne |
|---|---|---|
| `docs/clarify-claude-resume-workflow` | Divergente : 1 commit en avance, 5 en retard ; vérifier son contenu avant toute réutilisation | Ne pas checkout, fusionner ou réutiliser sans audit |
| `docs/correct-current-audit-refs` | Divergente : 1 commit en avance, 1 en retard ; contient une ancienne correction du suivi | Ne pas checkout, fusionner ou réutiliser sans audit |
| `docs/fix-code-commit-reference` | Divergente : 1 commit en avance, 3 en retard ; ancienne référence de commit | Ne pas checkout, fusionner ou réutiliser sans audit |
| `docs/record-github-audit-2026-11-23` | Divergente : 1 commit en avance, 4 en retard ; ancien relevé d'audit | Ne pas checkout, fusionner ou réutiliser sans audit |
| `docs/finalize-claude-handoff-2026-11-23` | Divergente : 3 commits en avance, 2 en retard ; ancienne passation Claude | Ne pas checkout, fusionner ou réutiliser sans audit |

Ces branches sont **obsolètes et non autoritaires**. La branche de référence reste `main`, et `jeu-unreal` reste sa branche miroir. Ne pas supprimer ni forcer une branche sans vérifier son SHA et son contenu ; si leur suppression est souhaitée, effectuer cette opération séparément après confirmation qu'aucun travail utile n'y subsiste.

## 6. Registre de preuve obligatoire

Pour chaque tentative de validation, ajouter une entrée datée avec :

- Phase et critère exact évalué.
- Branche et SHA du commit du code testé (pas seulement le commit documentaire).
- Version d'Unreal, configuration (Development/Shipping), plateforme et matériel pertinent.
- Build/artefact exact et emplacement ou lien vérifiable, si produit.
- Procédure de test, nombre de joueurs/clients, réseau utilisé et conditions.
- Résultat observé : réussi/échoué/non exécuté, logs et captures utiles.
- Régressions, limites, blocages et action corrective.
- Décision : critère franchi ou non franchi, avec responsable et date.

## 7. Mise à jour du suivi

Claude doit mettre à jour ce fichier dans le même lot de travail lorsqu'une validation réelle, une modification du dépôt ou un changement de statut intervient.

- Distinguer systématiquement le SHA documentaire du SHA du code réellement testé.
- Vérifier à nouveau les branches et les workflows ; ne pas recopier un ancien état comme s'il était actuel.
- Ne jamais convertir un commit documentaire, un contrôle Python, une synchronisation Git ou un test PIE isolé en preuve de build Windows, de test Internet ou de franchissement de phase.
- Conserver le statut **Non vérifiée** tant que toutes les preuves du critère ne sont pas disponibles.
- Si aucun test n'a été exécuté, l'écrire explicitement.
- Cette règle n'implique aucune surveillance automatique permanente entre les sessions.

**Prochaine action prioritaire :** sur la machine de développement, vérifier l'état local et les sauvegardes, ouvrir le projet avec Unreal Engine 5.8, contrôler les plugins et les journaux, reproduire le démarrage, puis produire une première build Windows de test. Consigner les résultats sur le SHA exact du code avant de modifier le statut des phases.
