# RIXE — Suivi vérifiable des phases

**Mise à jour :** 23 novembre 2026  
Ce fichier consigne l'état démontré des jalons. Il ne remplace pas la feuille de route de la section 12 de `CAHIER_DES_CHARGES_RIXE.md`.

**Règle :** aucun jalon n'est déclaré franchi sur la seule base d'un titre de commit, d'une note historique, d'un fichier présent ou d'une affirmation non reproduite.

## Références de départ

| Référence | Valeur |
|---|---|
| Branche par défaut GitHub | `main` |
| Branche miroir | `jeu-unreal` |
| Dernier commit observé sur `main` lors de la revue | `c966a5bd5f1cb9f4d28eafb9aa12bd36a197114d` (fusion documentaire de la procédure de reprise) |
| Release GitHub publique observée | Aucune release publiée au moment du contrôle |
| Build Windows distribuable vérifiée dans ce suivi | Aucune preuve enregistrée |

Le commit indiqué est le dernier commit observé sur `main` pendant la revue du 23 novembre 2026. La comparaison GitHub entre `main` et `jeu-unreal` ne montre aucun commit d'avance ou de retard et aucun fichier différent à cet instant. Cette synchronisation ne constitue pas une preuve de compilation, de test ou de franchissement de phase. Le SHA de ce commit n'est pas présenté comme un commit de code testé : aucun SHA de code testé n'est actuellement consigné. Après chaque mise à jour documentaire, consigner le commit documentaire séparément du commit du code réellement testé. La branche `main` est la branche par défaut du dépôt ; `jeu-unreal` est la branche miroir.

## État des phases

| Phase | Critère de passage à démontrer | Statut actuel | Commit du code testé | Preuves vérifiables | Blocage / prochaine action |
|---|---|---|---|---|---|
| 0 — Sécurisation et état des lieux | Sauvegarde, audit des risques, état reproductible du dépôt et blocage principal identifié ou impossibilité documentée | **Non vérifiée** | Aucun | Aucun rapport d'audit daté et reproductible référencé ici | Réaliser l'audit sur la machine de développement et joindre le rapport |
| 1 — Première boucle FPS Windows jouable | Build Windows exécutable et partie complète reproductible sur une carte pilote | **Non vérifiée** | Aucun | Les notes historiques décrivent des tests dans l'éditeur ; aucune build empaquetée vérifiée n'est référencée ici | Produire ou localiser la build, consigner son SHA/version et le protocole de test |
| 2 — Fondations FPS, combat, réseau et carte pilote | Combat stable, autorité serveur testée, bots, tests réseau progressifs et régressions critiques corrigées | **Non vérifiée** | Aucun | `UNREAL.md` contient des observations et tests historiques en éditeur ; ils ne démontrent pas à eux seuls les critères complets de phase 2 | Rejouer les tests sur le commit courant, plusieurs clients et réseaux distincts ; archiver les résultats |
| 3 — EOS et parties privées | Identité, invitations, lobby privé, lancement, retour et reconnexion testés de bout en bout | **Non vérifiée** | Aucun | Le README décrit encore le prototype avec `OnlineSubsystem Null` et connexion directe IP ; aucun parcours EOS validé n'est référencé ici | Implémenter puis tester le parcours privé EOS ; conserver le chemin direct de secours |
| 4 — Matchmaking public et contenu de lancement | File publique, lobby, groupes, départs/reconnexion, cartes et modes d'alpha validés | **Non vérifiée** | Aucun | Aucun rapport de test de matchmaking public ni de validation complète des cartes n'est référencé ici | Après phase 3, tester d'abord le matchmaking en environnement contrôlé ; finaliser les cartes avant l'alpha |
| 5 — Données durables et services communautaires étendus | Progression/statistiques persistantes cohérentes, protégées et restaurables | **Non vérifiée** | Aucun | Aucune preuve de validation de phase enregistrée | Développer après validation des événements de match et des services dépendants |
| 6 — Qualité, performances et préparation alpha | Non-régression, performances multi-configurations, licences, build Shipping et procédure de retour arrière | **Non vérifiée** | Aucun | Aucune build Shipping/alpha ni rapport de validation finale référencé ici | Préparer une campagne de validation complète après les phases précédentes |
| 7 — Extensions | Chaque extension dispose de critères, tests, preuves et retour arrière sans régression du socle | **Non vérifiée** | Aucun | Aucune extension n'est considérée comme validée par ce suivi | N'ouvrir que les extensions dont les dépendances sont franchies |

## Registre de preuve obligatoire

Pour chaque tentative de validation, ajouter une entrée datée avec :

- Phase et critère exact évalué.
- Branche et SHA du commit du code testé (pas seulement le commit de documentation).
- Version d'Unreal, configuration (Development/Shipping), plateforme et matériel pertinent.
- Build/artefact exact et emplacement ou lien vérifiable, si produit.
- Procédure de test, nombre de joueurs/clients, réseau utilisé et conditions.
- Résultat observé : réussi/échoué/non exécuté, logs et captures utiles.
- Régressions, limites, blocages et action corrective.
- Décision : critère franchi ou non franchi, avec responsable et date.

## Historique à ne pas confondre avec les phases actuelles

Les intitulés historiques `Étape 1 : rendu, performances, interface` et `Étape 2 : armes, stand de tir, arsenal` figurent dans les notes/commits du 18 novembre 2026. Ils décrivent des lots de travail de cette époque. Ils ne correspondent pas aux phases actuelles : l'ancienne Étape 1 ne démontre pas la build Windows jouable exigée par la phase 1 ; l'ancienne Étape 2 ne démontre pas la validation combat/réseau exigée par la phase 2.

Une mention « testé dans l'éditeur » reste une preuve limitée à son protocole et à son commit. Elle ne prouve pas une build empaquetée, un test Internet, EOS, un matchmaking public ou une release.

## Mise à jour du suivi

Claude doit mettre à jour ce fichier après chaque validation réelle ou changement de statut. Ne jamais remplacer « Non vérifiée » par « En cours », « Validée » ou « Livrée » sans consigner les preuves correspondantes. En cas de blocage, conserver le statut non franchi et décrire la prochaine action concrète.


## Dernière revue documentaire — 23 novembre 2026

Revue effectuée en lecture seule avant la présente mise à jour du suivi :

- Dépôt : `zallyx62/fps-`, branche de référence `main`.
- Synchronisation : `main` et `jeu-unreal` étaient identiques lors de la comparaison (aucun commit en avance/en retard, aucun fichier divergent).
- Dernier commit observé avant cette mise à jour du suivi : `1870b6886ed670759bd1f053c63c1d954e4c2508`.
- Documentation Unreal : `UNREAL.md` décrit encore plusieurs écarts entre prototype et cible (apparitions fixes au lieu du système adaptatif, bots limités au solo dans le comportement documenté, score d'éliminations provisoire, connexion directe IP au lieu d'un parcours EOS/matchmaking public validé).
- Arsenal : les scripts consultés décrivent des familles génériques d'armes et des accessoires de base ; ils ne démontrent pas l'existence d'un catalogue final individualisé ni de modèles 3D/Blueprints finalisés pour toutes les armes.
- Validation : le statut GitHub du commit consulté ne fournissait aucun statut de contrôle. Les contrôles documentaires/Python ne constituent pas une compilation Unreal. Aucun rapport de build Windows empaquetée, de test multijoueur complet ou de validation EOS n'a été ajouté comme preuve.

**Conséquence sur les phases :** aucune phase n'est déclarée franchie à la suite de cette revue. Les phases 0 à 7 restent « Non vérifiée » tant que les preuves exigées dans le tableau et le registre ci-dessus ne sont pas fournies. Les constats documentaires ci-dessus ne remplacent pas les tests sur le commit de code courant.

## Règle de maintien à jour

À chaque modification du dépôt, validation réelle, audit demandé ou changement de statut connu, mettre à jour ce fichier dans le même travail : date, dernier commit observé, état des branches, preuves réellement obtenues, écarts, blocages et prochaines actions. Ne jamais convertir une intention, une note de conception, un commit documentaire ou une synchronisation Git en preuve de test. Si aucun nouveau test n'a été exécuté, conserver les phases non vérifiées et l'indiquer explicitement.

Cette règle est appliquée lors des interventions sur le dépôt ; elle ne signifie pas qu'une surveillance automatique permanente est active entre les sessions ou en l'absence d'un événement GitHub configuré.


## Audit GitHub complémentaire — 23 novembre 2026

Audit en lecture seule du dépôt distant après fusion de la procédure de reprise dans `main`.

- Branche `main` : `c966a5bd5f1cb9f4d28eafb9aa12bd36a197114d`.
- Branche miroir `jeu-unreal` : même SHA ; égalité vérifiée après fusion.
- Arborescence Git : 589 fichiers suivis, dont 536 `.uasset` et 3 `.umap`. L'arbre récursif n'est pas tronqué.
- Recherche de doublons exacts par identifiant de blob Git : aucun doublon de contenu détecté. Deux fichiers portent le même basename `.gitignore` à des chemins distincts (`/.gitignore` et `/Tools/.gitignore`) ; ce n'est pas un doublon de contenu établi.
- Workflow [Validate RIXE repository](https://github.com/zallyx62/fps-/actions/runs/45173474331) sur le commit courant : terminé avec succès. Les contrôles exécutés valident la structure JSON du projet, les métadonnées et géométries générées des armes/accessoires, la syntaxe des scripts Python et un smoke test OBJ. Ce workflow ne compile pas Unreal, ne charge pas les Blueprints et ne produit pas de build Windows.
- Workflow [Keep jeu-unreal synchronized with main](https://github.com/zallyx62/fps-/actions/runs/45173474265) : terminé avec succès ; la branche miroir est à jour.
- La configuration du projet déclare Unreal Engine 5.8 et les plugins `GameplayStateTree`, `ModelContextProtocol`, `MCPClientToolset`, `AllToolsets` et `ModelingToolsEditorMode`. Leurs dépendances, licences et exclusions éventuelles des builds Shipping restent à vérifier dans l'environnement Unreal.
- `Config/DefaultEngine.ini`, `fps.uproject`, `README.md` et `UNREAL.md` sont cohérents sur la carte de démarrage et le mode de jeu du prototype : `Variant_Shooter/Lvl_ArenaShooter` et `BP_ShooterGameMode`. Le prototype décrit toujours `OnlineSubsystem Null` et la connexion IP directe ; EOS et le matchmaking public restent planifiés, non livrés.
- `UNREAL.md` signale explicitement les écarts connus : apparitions statiques, bots limités en présence de plusieurs joueurs, score provisoire fondé sur les éliminations, profils graphiques incomplets et autorité serveur/anti-triche non entièrement auditée. Ces écarts ne doivent pas être requalifiés en fonctionnalités terminées.
- `LICENCE_DISTRIBUTION.md` maintient à juste titre le blocage de distribution publique : compatibilité GPL-3.0 / contenus Epic, provenance des assets et licences des plugins/dépendances non établies.

**Limites de cet audit :** l'API GitHub permet d'inventorier les fichiers mais pas d'inspecter la structure interne des assets binaires Unreal (`.uasset`, `.umap`). Aucun accès à la machine Unreal locale, à son état de travail, à ses sauvegardes, à l'éditeur ou à une compilation empaquetée n'a été disponible dans cet audit. La phase 0 reste donc **Non vérifiée** ; aucune phase 1 à 7 n'est promue. Le pipeline vert ne constitue pas une preuve de compilation Unreal ou de jouabilité.

**Prochaine action prioritaire :** sur la machine de développement, ouvrir le projet avec Unreal Engine 5.8, vérifier les plugins déclarés, examiner les Blueprints de gameplay et les journaux, reproduire le démarrage, puis produire une première build Windows de test. Consigner les résultats et le commit de code exact avant de modifier les statuts des phases.
