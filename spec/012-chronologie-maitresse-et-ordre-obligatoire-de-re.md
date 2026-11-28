## 12. Chronologie maîtresse et ordre obligatoire de réalisation

Cette section constitue **la feuille de route générale de RIXE**. Elle organise les dépendances entre les exigences du document sans remplacer ni réduire les fonctionnalités approuvées. La section 24 définit uniquement la livraison rapprochée ; les ordres des sections spécialisées s'appliquent à l'intérieur de leur chantier, sous réserve des règles d'arbitrage ci-dessous.

### 12.1 Règles de pilotage et d'arbitrage

- **Priorité absolue :** préserver le dépôt et les données, protéger les secrets, vérifier les licences et corriger tout blocage empêchant de travailler ou de lancer le jeu.
- **Priorité de livraison :** obtenir d'abord une boucle FPS Windows réellement jouable, testable et reproductible. Ne pas attendre EOS, le matchmaking public, les statistiques avancées, les fonctions communautaires ou les plateformes secondaires pour produire cette première build locale.
- **Priorité produit :** après la boucle jouable, sécuriser le combat et le réseau, puis construire le parcours multijoueur officiel. Les systèmes de progression, de communauté et les extensions avancées viennent après leurs fondations.
- **Dépendances avant calendrier :** une étape ne peut être déclarée franchie que lorsque ses critères d'acceptation sont démontrés. Une date cible ne permet jamais de contourner un prérequis, une validation de sécurité, une licence ou un test.
- **Pas de parallélisation dispersée :** un seul chantier principal à la fois. Un travail secondaire n'est autorisé en parallèle que s'il est indépendant, réversible, de faible risque et ne retarde pas le jalon prioritaire.
- **Pas de suppression par report :** toute exigence approuvée qui n'est pas nécessaire au jalon courant reste planifiée. La reporter ne signifie ni l'abandonner ni la considérer comme livrée.
- **Aucune fausse validation :** distinguer systématiquement « spécifié », « commencé », « implémenté », « compilé », « testé », « validé sur build » et « livré ». Une preuve doit correspondre au niveau annoncé. Le statut des phases et leurs preuves sont consignés dans `SUIVI_PHASES_RIXE.md` ; la matrice ci-dessous reste un rattachement fonctionnel, pas une preuve de réalisation.

### 12.2 Chronologie générale par phases et critères de passage

**Phase 0 — Sécurisation et état des lieux**
1. Vérifier la branche de travail, le commit, les changements locaux, les sauvegardes et la possibilité de revenir en arrière.
2. Auditer l'arborescence, les Blueprints, plugins, dépendances, secrets, licences, configurations et outils réellement disponibles.
3. Reproduire le blocage principal à partir d'une procédure claire ; relever les erreurs et distinguer faits vérifiés, hypothèses et inconnues.
4. Établir un état de référence : ce qui fonctionne réellement, ce qui compile, ce qui a été testé, ce qui est incomplet et ce qui est bloqué.

**Critère de passage :** dépôt sauvegardé, risques immédiats identifiés, blocage principal reproduit ou impossibilité de reproduction documentée, plan de correction concret. Aucun secret ou contenu non redistribuable ne doit être exposé.

**Phase 1 — Première boucle FPS Windows jouable**
1. Corriger le blocage qui empêche de lancer ou de jouer ; obtenir une compilation et une build de référence lorsque l'environnement le permet.
2. Stabiliser une seule carte pilote, un mode simple et le parcours de lancement.
3. Valider la boucle complète : déplacement, visée, tir, rechargement, dégâts, élimination, réapparition, score et fin de partie.
4. Utiliser des bots ou un fonctionnement local pour tester la boucle si le multijoueur en ligne n'est pas encore fiable.
5. Vérifier les sauvegardes essentielles et les réglages nécessaires au test.

**Critère de passage :** une build Windows exécutable permet de jouer une partie complète reproductible sans blocage critique connu. Si l'empaquetage est impossible, la raison, les preuves de compilation et les étapes restantes sont consignées ; la build n'est pas déclarée livrée.

**Phase 2 — Fondations FPS, combat, réseau et carte pilote**
1. Stabiliser sur une seule carte pilote le cœur du combat : déplacements, visée, tirs, cadence, munitions, dégâts, hit registration, morts, réapparitions et fin de partie.
2. Vérifier et renforcer l'autorité serveur sur les actions sensibles ; corriger les désynchronisations, doubles événements, RPC abusifs et incohérences de réplication.
3. Prototyper les mécaniques de gameplay indispensables déjà approuvées (notamment sprint, glissade, saut/franchissement, capacités et interactions) sur cette carte et un arsenal réduit ; conserver des timings, collisions et règles validés par le serveur. N'étendre qu'après tests concluants.
4. Stabiliser les équipes, les apparitions, les bots et leurs règles serveur ; conserver un fonctionnement jouable même si les services en ligne sont indisponibles.
5. Tester d'abord en local et avec plusieurs clients, puis sur plusieurs machines/réseaux via les chemins LAN/direct disponibles ; mesurer latence, gigue, pertes, déconnexions et reconnexions. Les tests directs ne remplacent pas les tests EOS à venir.
6. Établir une référence de performances et des budgets provisoires CPU/GPU, mémoire, temps de frame et charge réseau. Les préréglages avancés et l'optimisation finale restent ultérieurs.
7. Garder le classé désactivé tant que l'intégrité des résultats et les garanties d'hébergement ne sont pas suffisantes.

**Critère de passage :** boucle de combat stable sur la carte pilote, règles sensibles validées côté serveur, bots fonctionnels, tests réseau progressifs réalisés, régressions critiques corrigées et limites documentées. Les tests PIE locaux ne valent pas validation Internet. Les autres cartes du lancement ne bloquent pas ce jalon : elles seront validées après les fondations, avant l'alpha publique.

**Phase 3 — EOS et parcours privé entre amis**
1. Prototyper puis intégrer EOS pour les fonctions nécessaires : identité/Connect, présence, amis, invitations, lobbies et sessions privées.
2. Séparer les services EOS du transport et de la simulation Unreal ; évaluer P2P/relay sans supposer une traversée NAT universelle ni un coût nul garanti.
3. Valider le parcours privé de bout en bout : connexion, création de groupe/lobby, invitation, rejoindre, lancement d'une partie, retour au lobby, continuité du groupe et reconnexion dans les scénarios supportés.
4. Conserver un chemin LAN/direct de diagnostic et ne retirer aucune méthode de connexion existante avant validation de bout en bout et possibilité de retour arrière.
5. Tester sur des machines et réseaux distincts, avec NAT/pare-feu, latence, pertes, départ de l'hôte, reconnexion et scénarios d'échec.
6. Préparer le socle minimal de sécurité communautaire avant toute ouverture publique : sourdine/blocage local, signalement simple, limites anti-spam et règles de confidentialité. Les sanctions globales et outils de modération avancés restent un chantier ultérieur.

**Critère de passage :** le parcours privé fonctionne dans les scénarios réellement testés ; les erreurs sont compréhensibles, les limites sont documentées et le jeu reste testable sans EOS. Le socle minimal de protection est prêt avant les tests publics. Aucun matchmaking public n'est considéré comme livré à cette phase.

**Phase 4 — Matchmaking officiel, lobby public et consolidation du contenu de lancement**
1. Construire et tester le parcours officiel inspiré de BO2 : file publique, constitution des équipes, lobby, compte à rebours/seuil de joueurs et lancement automatique.
2. Assurer la continuité du groupe entre les parties lorsque possible, avec retour au lobby, invitations, rejoindre un ami, gestion des départs et reconnexion.
3. Ajouter progressivement backfill/remplaçants, préférences humains/bots, préférences de périphériques, gestion des groupes préformés et exclusions de playlists, selon les sections spécialisées. Ne les activer qu'après validation de la file de base.
4. Finaliser et tester les autres cartes du lancement (trois maximum), les modes et leurs règles, à partir du socle validé sur la carte pilote. Cette validation est requise avant l'alpha publique, mais ne doit pas retarder les prototypes internes du matchmaking.
5. Renforcer la protection communautaire avant l'ouverture publique ; ajouter ensuite les outils de modération avancés et les fonctions sociales étendues en réutilisant les systèmes uniques déjà définis.
6. Mesurer l'effet des préférences sur la population et les temps d'attente ; ne jamais promettre un délai ni placer un joueur dans une playlist explicitement exclue.

**Critère de passage :** le parcours public est testé de bout en bout avec les scénarios de groupe, d'équilibrage, de remplissage, de départ et de reconnexion applicables. Les cartes/modes inclus dans l'alpha sont validés, les règles de file et les limites de population sont documentées ; aucun résultat classé n'est activé sans garanties suffisantes.

**Phase 5 — Données durables, progression et services communautaires étendus**
1. Consolider les statistiques persistantes, profils, historiques et tableaux détaillés à partir des événements de match déjà validés. Le score de match et son affichage de base sont requis dès la première boucle jouable ; leur validation serveur relève de la phase 2.
2. Ajouter la sauvegarde et la progression durables, les défis et récompenses récupérables, en évitant les pertes de données et les récompenses définitivement manquées.
3. Ajouter les outils d'analyse et d'équilibrage à partir de données suffisantes, minimisées et correctement protégées.
4. Développer les fonctions de compte, groupes persistants, préférences synchronisées et modération avancée qui ne sont pas déjà couvertes par le parcours EOS privé et le matchmaking public.

**Critère de passage :** les données persistantes sont cohérentes, sauvegardées, récupérables selon les garanties annoncées, protégées contre les attributions client non autorisées et testées après reconnexion, conflit de synchronisation ou mise à jour.

**Phase 6 — Qualité, performances et préparation de l'alpha**
1. Exécuter les tests de non-régression, tests réseau, tests de sauvegarde et tests de compatibilité pertinents.
2. Mesurer performances CPU/GPU, mémoire, temps de frame, 1 % low, chargements, saccades et charge réseau sur plusieurs configurations réellement disponibles.
3. Optimiser sans sacrifier la lisibilité compétitive, l'équité visuelle ou la stabilité ; intégrer les technologies graphiques uniquement après vérification de leur compatibilité et de leur licence.
4. Vérifier les trois cartes au maximum prévues au lancement, les modes retenus, les paramètres et le parcours de démarrage.
5. Produire une build Shipping/alpha propre, vérifier son lancement sur un environnement propre et préparer les notes, limites et procédure de retour arrière.

**Critère de passage :** build identifiée par branche, commit et version, tests réellement exécutés, aucun défaut bloquant connu dans le périmètre annoncé, licences vérifiées pour le contenu distribué et procédure de livraison documentée.

**Phase 7 — Extensions et systèmes avancés**
Après stabilisation et validation du socle, développer progressivement les fonctions avancées approuvées : replays, création communautaire, événements, fonctions sociales étendues, accessibilité approfondie, outils communautaires, cross-play et clients/plateformes supplémentaires. Respecter les dépendances propres à chaque fonction, le budget de 0 € et les contraintes de licence.

Learning Agents doit rester une expérimentation isolée : définir un cas d'usage mesurable, établir une référence sans apprentissage, comparer les résultats, contrôler les coûts/performance et ne l'intégrer au jeu que si le bénéfice est démontré. Il ne doit jamais bloquer la boucle FPS, le réseau ou la livraison.

**Critère de passage :** chaque extension possède ses propres critères, tests, preuves, plan de désactivation ou retour arrière et ne dégrade pas les systèmes déjà validés.

### 12.3 Règles de lecture des priorités spécialisées

- Les sections 17, 22 et 25 précisent des exigences de réseau, de fiabilité, de sécurité et de licence. Leurs contrôles bloquants s'appliquent dès la phase concernée ; leurs fonctions avancées ne deviennent pas automatiquement des prérequis de la première build jouable.
- Les sections 26 à 29 détaillent le parcours multijoueur, le matchmaking, les groupes et les fonctions communautaires. Elles s'intègrent après les fondations réseau et les services en ligne, sans créer plusieurs systèmes concurrents.
- Les sections 30 à 33 détaillent les performances, l'internationalisation, la maîtrise des armes et les approfondissements du combat. Les fonctions nécessaires à la stabilité ou à l'équité sont traitées avant les finitions et extensions.
- Les sections 34 à 43 ajoutent ou consolident des règles et fonctions spécifiques. Leur présence dans le cahier ne signifie pas qu'elles sont toutes exigées pour la première alpha ; suivre leurs dépendances et leur ordre local après validation du socle concerné.
- Les sections 44 à 70 ajoutent des outils, modes et services complémentaires (maintenance, HUD, modes de jeu, tournois, diffusion, aide, mises à jour, prolongation). Elles réutilisent les systèmes propriétaires existants et restent subordonnées à la première build jouable ; suivre leurs dépendances locales.

#### Matrice de rattachement des sections à la chronologie

Cette matrice sert à vérifier qu'aucune exigence approuvée ne disparaît entre le cahier des charges et l'exécution. Elle indique le premier chantier pertinent, pas une obligation de tout livrer au même jalon.

| Sections | Phase(s) de référence | Rattachement et dépendance principale | Statut constaté | Commit / preuve de validation |
|---|---|---|---|---|
| 1–2 | 0, puis toutes | Vision, contraintes et état réel ; base de l'audit et de la traçabilité.  | Non vérifié | Aucun enregistré |
| 3 | 1–2, puis 4 | Boucle de gameplay et carte pilote ; extension aux cartes/modes de lancement après stabilisation.  | Non vérifié | Aucun enregistré |
| 4 | 3–4 | EOS, groupes et sessions privées avant le matchmaking public.  | Non vérifié | Aucun enregistré |
| 5 | 2–4 | Autorité serveur et intégrité du combat avant toute fonction compétitive ou publique.  | Non vérifié | Aucun enregistré |
| 6 | 1–2, puis 5 | Score de match de base dès la boucle jouable ; statistiques persistantes et détaillées ensuite.  | Non vérifié | Aucun enregistré |
| 7 | 7 | Learning Agents expérimental, isolé et jamais bloquant.  | Non vérifié | Aucun enregistré |
| 8–9 | Toutes, validation finale en 6 | Mesures dès les fondations ; non-régression, qualité du dépôt et validation finale avant alpha.  | Non vérifié | Aucun enregistré |
| 10–12 | 0, puis pilotage continu | Note historique non implémentable sans clarification ; règles agent et chronologie applicables à chaque tâche.  | Non vérifié | Aucun enregistré |
| 13–15 | 0 et 6 | Budget et licence audités dès le départ ; distribution et conditions d'alpha contrôlées avant publication.  | Non vérifié | Aucun enregistré |
| 16–18 | 5 et 7 | Comptes/progression après les sessions et données de base ; cross-play et plateformes supplémentaires après Windows.  | Non vérifié | Aucun enregistré |
| 19–23 | 2 à 7 selon dépendances | Stabilisation réseau, anti-camping, statistiques, replays, accessibilité et confort ; chaque fonction suit son système propriétaire.  | Non vérifié | Aucun enregistré |
| 24–25 | 0–1 et 6 | Première build Windows ; audit de licence initial puis contrôle final avant toute distribution.  | Non vérifié | Aucun enregistré |
| 26–29 | 3–5 | Lobbies, continuité, matchmaking, remplaçants et fonctions communautaires après EOS privé et protections minimales.  | Non vérifié | Aucun enregistré |
| 30–33 | 2, 6 et 7 | Référence graphique et combat sur carte pilote ; profils finaux, internationalisation et extensions après mesures.  | Non vérifié | Aucun enregistré |
| 34–38 | 2, 4, 5 et 7 | Équité des cartes/mouvements, informations de match, progression et systèmes communautaires selon leurs prérequis.  | Non vérifié | Aucun enregistré |
| 39–43 | 2, 4, 5 et 7 | Matchmaking, protection des nouveaux, fin de partie, duel, progression, identité et variantes ; jamais avant les fondations correspondantes.  | Non vérifié | Aucun enregistré |
| 44–47 | 2–7 selon dépendances | Maintenance, présence en partie, écran partagé, voix, HUD, commandes, informations tactiques et analyse des combats ; réutiliser les systèmes existants et valider chaque extension. | Non vérifié | Aucun enregistré |
| 48–54 | Après les fondations 2–5 et avant extension compétitive | Modes et expériences complémentaires ; prototypes indépendants, équilibre et validation spécifiques avant intégration aux playlists. | Non vérifié | Aucun enregistré |
| 55–59 | 2–7 selon dépendances | Approfondissements du combat/armement, tournois et modes supplémentaires ; fusionner avec les systèmes propriétaires et garder le classé désactivé tant que l'intégrité n'est pas démontrée. | Non vérifié | Aucun enregistré |
| 60–70 | 3–7 selon dépendances | Confidentialité en diffusion, vérification de connexion, traduction du chat, centre d'aide, pause technique, export des statistiques, mises à jour, test audio, état des services, signalement de bugs et prolongation ; réutiliser les systèmes de réseau, de matchmaking, de mise à jour et de statistiques existants. | Non vérifié | Aucun enregistré |

Une exigence peut contribuer à plusieurs phases : sa version minimale nécessaire à la jouabilité ou à la sécurité est traitée tôt ; ses fonctions persistantes, sociales ou avancées sont livrées plus tard. Le report d'une partie avancée ne reporte pas une protection critique, et ne supprime jamais l'exigence.
- Une priorité locale indique l'ordre à respecter **dans son propre chantier**. Elle ne permet pas de passer devant un blocage de sécurité, de licence, de sauvegarde, de boucle jouable ou de réseau qui empêche le chantier de fonctionner.
- Lorsqu'une section spécialisée semble contredire la chronologie générale, ne rien supprimer ni interpréter silencieusement : identifier les deux passages, appliquer la priorité générale et les décisions explicitement approuvées les plus récentes, puis signaler toute ambiguïté qui change réellement le périmètre.
- Les anciens intitulés d'étapes dans `UNREAL.md` et les messages de commit sont des repères historiques, pas des jalons de la chronologie actuelle. La correspondance et les limites de preuve sont précisées dans `SUIVI_PHASES_RIXE.md`.

### 12.4 Sélection de la prochaine tâche par Claude

Au début de chaque session et après chaque jalon :
1. Lire cette section 12, la section 24 et les sections spécialisées utiles à la tâche.
2. Vérifier l'état réel du dépôt, de la branche, du commit, des fichiers modifiés, des builds et des tests ; ne pas se fier à un ancien rapport.
3. Identifier la phase active, son critère de passage, les prérequis validés, le blocage le plus important et la prochaine action vérifiable.
4. Choisir une tâche courte qui débloque ou fait progresser la phase active. Ne pas démarrer une extension simplement parce qu'elle est intéressante ou détaillée.
5. Si la phase est bloquée, traiter d'abord le blocage ; sinon, choisir une tâche indépendante de même priorité ou préparer le prochain test. Ne pas sauter une phase.
6. Après chaque modification, exécuter les validations pertinentes, consigner les preuves et mettre à jour le suivi de travail sans recopier le cahier.
7. Présenter un rapport bref : **phase active / tâche réalisée / preuves et tests / blocage restant / prochaine action**.

La chronologie est un ordre de dépendances, pas une promesse de durée. Toute estimation doit être révisée selon l'état réel du projet et les résultats observés.

