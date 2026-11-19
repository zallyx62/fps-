# RIXE — Suivi vérifiable des phases

**Mise à jour :** 20 novembre 2026  
Ce fichier consigne l'état démontré des jalons. Il ne remplace pas la feuille de route de la section 12 de `CAHIER_DES_CHARGES_RIXE.md`.

**Règle :** aucun jalon n'est déclaré franchi sur la seule base d'un titre de commit, d'une note historique, d'un fichier présent ou d'une affirmation non reproduite.

## Références de départ

| Référence | Valeur |
|---|---|
| Branche documentaire | `main` |
| Commit de référence `main` avant cette mise à jour | `f1800b492e440494570e9f3b92b5f22ba0355515` |
| Branche de développement | `jeu-unreal` |
| Commit de référence `jeu-unreal` avant cette mise à jour | `c42f465e15afdab139b9aae90065ec3b57334e72` |
| Release GitHub publique observée | Aucune release publiée au moment du contrôle |
| Build Windows distribuable vérifiée dans ce suivi | Aucune preuve enregistrée |

Ces SHA identifient les états du dépôt consultés ; ils ne constituent pas des preuves de compilation, de test ou de franchissement de phase. Après toute mise à jour, consigner le nouveau commit documentaire séparément du commit du code réellement testé.

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
