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
| 0 — Sécurisation et état des lieux | Sauvegardes vérifiées, audit de l'environnement, état reproductible et blocages identifiés | **Non vérifiée** | Audit GitHub uniquement ; machine locale, sauvegardes, secrets et environnement éditeur non inspectés |
| 1 — Première boucle FPS Windows jouable | Build Windows empaquetée et partie complète reproductible sur une carte pilote | **Non vérifiée** | Aucune build Windows empaquetée ni aucun artefact de téléchargement vérifié |
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
