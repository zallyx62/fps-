# RIXE — Cahier des charges consolidé

**Version :** 23 novembre 2026 — mise à jour consolidée  
**Dépôt :** https://github.com/zallyx62/fps-  
**Branche de référence documentaire :** `main`  
**Moteur :** Unreal Engine 5.8 — projet principalement Blueprint.

> Ce document distingue l'existant documenté des objectifs. Une fonctionnalité planifiée n'est pas réputée implémentée tant qu'elle n'a pas été testée.

## Règles de gestion du dépôt et synchronisation des branches

- `main` est la branche de référence : le cahier des charges, les décisions approuvées et les changements validés y sont centralisés.
- `jeu-unreal` est une branche miroir de `main`, pas une branche de développement indépendante. Elle doit rester au même commit que `main`.
- Après chaque mise à jour de `main`, GitHub Actions synchronise automatiquement `jeu-unreal` par avance rapide. La synchronisation doit aussi pouvoir être lancée manuellement.
- La synchronisation automatique est strictement non destructive : aucun push forcé, aucune réécriture d'historique et aucun écrasement de commits propres à `jeu-unreal`.
- Si la branche miroir diverge ou contient des commits qui ne sont pas dans `main`, l'automatisation doit échouer sans modifier la branche. Il faut alors comparer les changements et résoudre explicitement la divergence avant de reprendre la synchronisation.
- Toute nouvelle tâche de développement doit partir de `main` dans une branche de travail dédiée ; ne pas développer directement sur la branche miroir.
- Après chaque synchronisation, vérifier que les deux références pointent sur le même SHA et que les validations automatiques se déclenchent. Une synchronisation réussie ne constitue pas une preuve de compilation Unreal, de test de gameplay ou de livraison.
- Mettre à jour cette règle et les instructions de développement si l'organisation des branches change. Ne jamais annoncer que les branches sont synchronisées sans avoir vérifié leurs références GitHub.

## 1. Vision et principes

RIXE est un FPS d'arène en équipes, gratuit et communautaire, avec une ambition open source pour les éléments originaux dont les licences le permettent. Il doit accueillir des joueurs internationaux. L'expérience officielle par défaut repose sur le matchmaking et les lobbies publics automatiques inspirés de Black Ops II ; les invitations, parties privées et serveurs communautaires restent des voies complémentaires.

Principes :
- Jeu de base gratuit, sans avantage compétitif payant.
- Parties hébergées par les joueurs autant que possible.
- Matchmaking officiel et lobby public automatiques comme parcours principal ; conserver en complément les invitations, salons privés et la découverte de serveurs communautaires.
- Score valorisant objectifs, assistance, défense et soutien, pas uniquement les éliminations.
- Priorité à la stabilité, la sécurité et l'équilibrage avant l'ajout massif de contenu.

## 2. État de départ connu

Le dépôt est un projet Unreal Engine 5.8 principalement Blueprint, dérivé du modèle First Person / Arena Shooter. Le README et `UNREAL.md` documentent notamment :
- Arène rouge/bleue, règles de manche, score et écran de victoire.
- Multijoueur via serveur d'écoute, hébergement/rejoindre par IP, UDP 7777.
- Bots d'entraînement et logique de remplissage des équipes.
- Armes principales et secondaires, tir, rechargement et munitions répliquées.
- Menus, réglages graphiques/audio/commandes, touches réassignables.
- Chat textuel et commandes de chat vocal.
- HUD et plusieurs validations multijoueur en éditeur.

L'architecture actuelle documentée utilise `OnlineSubsystem Null`. Les éléments décrits dans la documentation doivent être retestés sur une build distribuable.

## 3. Gameplay et cartes

### Cartes de lancement
- Viser trois cartes maximum au lancement initial. Ce plafond concerne l'alpha de lancement : les modes des sections 48 à 59 n'y sont inclus que s'ils peuvent utiliser ces cartes ou leurs variantes (section 33.7) ; leurs cartes ou parcours dédiés sont planifiés après le lancement.
- Équilibrer courte, moyenne et longue portée.
- Éviter les lignes de vue et positions dominantes impossibles à déloger.
- Autoriser le jeu défensif, mais limiter le camping abusif par le level design : itinéraires alternatifs, couvertures, lignes de vue cassées et objectifs qui encouragent la rotation.
- Tester chaque carte avec plusieurs armes et styles de jeu.

### Apparition automatique et adaptative (ajout approuvé)
- Les joueurs ne choisissent pas leur point d'apparition : le jeu le sélectionne automatiquement côté serveur.
- À chaque réapparition, évaluer les points autorisés selon la position des adversaires et alliés, les lignes de vue, les menaces immédiates, la proximité des combats et objectifs, l'historique récent des apparitions et le risque de spawn-kill.
- Favoriser une zone sûre mais utile à la reprise du combat, sans téléporter artificiellement un joueur au cœur d'un affrontement ni favoriser systématiquement une équipe.
- Réévaluer les candidats au moment effectif du respawn ; ne jamais se fier à une décision calculée trop tôt si la situation a changé.
- Garder la sélection et les validations sous autorité serveur, avec des règles déterministes et testables. Prévoir une solution de secours si aucun point idéal n'existe.
- Mesurer équité, temps de retour au combat, morts immédiates après apparition et répétition des mêmes points. Les points d'apparition ne doivent pas révéler la position exacte des ennemis.

### Événements environnementaux tactiques (ajout approuvé)
- Ajouter des événements légers et temporaires dans un mode choisi pour le prototype initial : ouverture/fermeture temporaire d'un passage, changement d'accès ou déplacement/activation d'une couverture prévue par la carte.
- Les événements doivent être annoncés clairement, lisibles, prévisibles et identiques pour les deux équipes ; aucune surprise aléatoire ne doit décider seule d'un duel.
- Prévoir des contre-mesures et plusieurs itinéraires ; ne jamais enfermer un joueur, bloquer un objectif ou créer un avantage durable pour l'équipe déjà gagnante.
- Synchroniser l'état de l'événement par le serveur et garantir que collision, visibilité, navigation des bots et réplication correspondent au même état chez tous les joueurs.
- Désactiver cette mécanique dans les modes où elle nuirait à la compétition ou à la lisibilité. Mesurer son impact sur performances, réseau et équilibre avant extension.

### Équipes et bots
- Conserver les équipes rouge et bleue.
- Les bots servent à l'entraînement, aux tests et au remplissage des équipes selon le mode.
- Leur création et leurs décisions importantes doivent rester sous autorité serveur.
- Objectif de référence : jusqu'à 10 contre 10 lorsque performances et stabilité le permettent.

### Score de contribution
Le score doit valoriser capture, défense, progression d'objectif, assistance, soin/réanimation, protection, repérage utile et victoire collective. Les éliminations restent récompensées mais ne doivent pas être l'unique voie de progression.

Barème de départ à équilibrer :
| Action | Points initiaux |
|---|---:|
| Élimination | 100 |
| Assistance | 60 |
| Capture | 150 |
| Défense d'objectif | 100 |
| Progression d'objectif | 20 |
| Soin ou réanimation | 60 |
| Protection d'un allié | 30 |
| Repérage utile | 20 |
| Victoire d'équipe | 150 |

Ces chiffres sont des hypothèses de tuning. Ajouter des conditions d'éligibilité, des plafonds et des protections contre le farming.

## 4. Multijoueur et services en ligne

Étudier puis intégrer Epic Online Services (EOS) pour identités, sessions/salons, invitations, recherche de parties et éventuellement classements.

Contraintes :
- Le matchmaking public est le parcours par défaut du bouton « Jouer ». Les invitations, groupes préformés et salons privés doivent rester accessibles sans obligation de passer par une file publique.
- Privilégier l'hébergement par un joueur pour éviter les coûts de serveurs dédiés permanents.
- Documenter NAT, pare-feu, qualité de connexion, avantage de l'hôte et indisponibilité d'un hôte.
- Étudier la migration d'hôte, sans la promettre avant un prototype testé.
- Distinguer statistiques locales/non classées et résultats classés fiables.
- Ne pas retirer la connexion IP existante avant validation EOS de bout en bout et plan de retour arrière.

Un hôte joueur ne peut pas offrir la même garantie d'intégrité qu'un serveur dédié indépendant.

## 5. Autorité réseau et anti-triche

Priorité critique :
- Le serveur valide tirs, cadence, munitions, dégâts, morts, respawns, scores et résultats.
- Vérifier vitesses, accélérations, téléportations et actions impossibles.
- Ne jamais faire confiance au client pour s'attribuer des points ou déclarer une élimination.
- Limiter et valider les RPC : fréquence, taille, paramètres et états autorisés.
- Protéger salons et profils contre usurpation et abus.
- Journaliser les événements utiles sans collecter inutilement de données personnelles.
- Évaluer un anti-triche client compatible avec les plateformes visées, sans le considérer comme suffisant à lui seul.

Les résultats des parties hébergées par les joueurs ne doivent pas donner accès à des récompenses compétitives de grande valeur sans contrôles supplémentaires.

## 6. Statistiques

Afficher après chaque partie, selon le mode :
- Éliminations, morts et assistances.
- Captures, défense et temps sur objectif.
- Soins, réanimations, protections et repérages utiles.
- Score de contribution et résultat d'équipe.

Le tableau doit expliquer comment le score a été obtenu et valoriser les joueurs utiles à l'équipe, même s'ils ont peu éliminé.

### Distinctions de fin de partie (ajout approuvé)
- Ajouter des distinctions collectives et individuelles en fin de match, par exemple meilleur soutien, meilleure défense, joueur le plus utile aux objectifs ou esprit d'équipe.
- Attribuer ces distinctions à partir de statistiques vérifiables côté serveur et de critères publiés, pas par simple vote de popularité.
- Prévoir plusieurs catégories et éviter qu'un même profil rafle systématiquement toutes les distinctions ; les récompenses restent symboliques et ne donnent aucun avantage de gameplay.
- Ajouter des seuils minimums, plafonds et contrôles anti-farming/anti-collusion. Ne pas récompenser les actions répétées artificiellement entre amis ou bots.
- Afficher brièvement la raison de chaque distinction et permettre de consulter les statistiques qui la justifient. Ne pas humilier les joueurs non distingués.

## 7. IA et apprentissage par renforcement

### Bots adaptatifs — difficulté ajustée aux performances

- Ajouter une adaptation facultative du niveau des bots d'entraînement en fonction des performances réellement observées du joueur, afin de proposer un défi progressif sans rendre les exercices artificiellement faciles ou impossibles.
- Évaluer plusieurs indicateurs sur une période suffisante : précision, régularité des éliminations, capacité à survivre, réussite des objectifs et maîtrise des déplacements. Ne pas ajuster la difficulté sur une seule action ou une courte série de tirs.
- Faire évoluer les paramètres par petits paliers et avec une fréquence limitée ; éviter les changements brusques ou perceptibles en plein duel.
- Ajuster uniquement des paramètres de difficulté autorisés et documentés, par exemple la précision, les délais de réaction, la vitesse de décision ou la coordination tactique. Ne jamais modifier les dégâts, les règles de collision ou les résultats après coup pour fabriquer une victoire ou une défaite.
- Les bots ne doivent jamais tricher : aucune connaissance des positions cachées, aucune visée instantanée, aucune information inaccessible à un joueur humain et aucun avantage lié à la latence ou à la réplication.
- Permettre au joueur de désactiver l'adaptation et de choisir un niveau fixe. Afficher clairement lorsque l'adaptation est active et éviter de présenter un niveau adaptatif comme un classement de compétence officiel.
- Réserver cette adaptation aux entraînements et contextes explicitement prévus. En partie multijoueur publique ou compétitive, les bots doivent utiliser des profils déterministes et équitables, sans s'ajuster secrètement aux performances d'un joueur précis.
- Mesurer la stabilité du niveau, la diversité des comportements, l'équité perçue et le coût CPU ; conserver un comportement de difficulté fixe comme solution de secours.

Learning Agents / PPO / imitation learning restent expérimentaux :
- Garder une IA de base fonctionnelle si le plugin ou le modèle appris est indisponible.
- Séparer entraînement, données et exécution en jeu.
- Mesurer précision, survie, contribution aux objectifs, comportement collectif et coût CPU.
- Ne jamais bloquer une partie sur le chargement d'un modèle expérimental.
- Verrouiller et documenter les versions des plugins et dépendances Python.

## 8. Performances et stabilité

- Mesurer CPU, GPU et réseau à 2, 10 et jusqu'à 20 joueurs/bots.
- Éviter les boucles Tick coûteuses et les mises à jour UI redondantes ; privilégier événements et réplication ciblée.
- Tester les builds Development et Shipping, pas uniquement PIE.
- Verrouiller les dépendances et documenter les prérequis.
- Corriger les erreurs critiques avant les nouvelles fonctionnalités.
- Retirer les secrets, jetons et configurations privées du dépôt ; renouveler tout secret exposé.
- Prévoir sauvegarde et restauration du projet.

## 9. Qualité du dépôt

- Maintenir `README.md`, `UNREAL.md` et ce cahier des charges cohérents.
- Marquer chaque élément : planifié, en cours, expérimental, testé ou livré.
- Utiliser branches et pull requests pour les changements importants.
- Ajouter des tests de non-régression pour règles de match, score, dégâts, respawn, connexion et déconnexion.
- Vérifier les plugins activés et retirer les références obsolètes.
- Ne pas versionner caches et fichiers temporaires inutiles.

## 10. Note historique à clarifier

Une ancienne note de cadrage mentionnait quatre ajouts numérotés (trois limités à un seul mode et un facultatif). Leur libellé exact n'est pas suffisamment documenté dans le dépôt. Cette note n'autorise donc aucune implémentation : ne pas inventer leur contenu, ne pas les compter comme exigences fonctionnelles confirmées et demander leur clarification uniquement si ces éléments redeviennent pertinents.

## 11. Agent de développement autonome

Le propriétaire souhaite qu'un agent de développement (notamment Claude) avance de manière autonome, y compris avec terminal, éditeur Unreal, navigateur et contrôle du PC lorsque les autorisations correspondantes sont accordées.

Règles :
- Auditer le dépôt et reproduire le problème bloquant actuel avant de coder de nouvelles fonctionnalités.
- Avancer par étapes vérifiables sans demander une validation pour chaque action technique réversible.
- Ne jamais écraser/supprimer des données sans sauvegarde.
- Ne pas publier secrets, données personnelles ou ressources tierces non redistribuables.
- Demander confirmation avant action irréversible, dépense, engagement juridique ou utilisation d'identifiants/paiements.
- Ne déclarer une fonctionnalité terminée qu'après build/test approprié.
- À chaque étape, rapporter fichiers modifiés, tests, résultats, problèmes restants et prochaine action.

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

## 13. Distribution et modèle économique — zéro budget

### Décision
- Le jeu de base RIXE doit être gratuit sur toutes les plateformes.
- Aucun achat ne doit donner un avantage de gameplay.
- Le propriétaire dispose actuellement d'un budget de **0 €** : aucune dépense de publication, d'hébergement, d'outil, de publicité ou de sous-traitance ne doit être engagée sans accord explicite et financement préalable.
- Claude / les agents de développement peuvent préparer les cosmétiques, éléments de présentation et tâches de développement dans la mesure permise par les outils, licences et quotas déjà disponibles. Ne pas supposer que l'utilisation d'un agent, de services cloud ou de génération d'assets est sans coût.

### Ordre de publication sans avance de frais
1. **itch.io en premier** : publier gratuitement une version prototype/alpha. Un compte créateur est gratuit et la page peut être configurée en téléchargement gratuit, avec dons facultatifs ou sans paiements. La part de revenus itch.io est configurable ; les frais des prestataires de paiement s'appliquent si des transactions ont lieu.
2. **Steam plus tard** : la publication demande un Steam Direct Fee de 100 USD par produit (taxes éventuelles en sus). Ce montant n'est pas remboursable, mais Valve le récupère sur les paiements dus après que le produit atteint 1 000 USD de revenu brut ajusté éligible. Ne pas payer tant que le budget n'existe pas. Le jeu restera gratuit pour les joueurs ; le paiement est un frais de mise en ligne, pas le prix du jeu.
3. **Epic Games Store éventuellement plus tard** : frais de soumission de 100 USD par produit (taxes locales éventuelles), non remboursables mais récupérables après 1 000 USD de revenus éligibles. Ne pas engager cette dépense tant que le financement n'est pas disponible. Vérifier aussi les exigences de publication, notamment le crossplay PC pour les jeux multijoueurs.
4. Ne pas promettre une sortie simultanée sur toutes les boutiques. Priorité à la stabilité, au coût zéro et à la validation communautaire.

### Financement facultatif sans rendre le jeu payant
- Dons volontaires et soutien communautaire, sans contrepartie qui affecte le gameplay.
- Cosmétiques purement visuels créés pour RIXE : apparences, couleurs, emblèmes, poses ou effets non avantageux, seulement après validation des licences et de la qualité.
- Packs cosmétiques facultatifs, sans armes plus puissantes, bonus d'expérience, accès prioritaire compétitif ni contenu qui fragmente la communauté.
- Soutien participatif / financement communautaire, uniquement avec une présentation transparente de l'objectif, du budget et des risques.
- Éventuellement partenariats ou mécénat, sans céder le contrôle du gameplay ni les données des joueurs.
- Sur itch.io, activer « $0 or Donate » ou « No payments » selon le choix du propriétaire. Les dons restent facultatifs.
- Ne pas dépendre des dons pour payer des serveurs permanents : privilégier l'hébergement par les joueurs et des services gratuits dans leurs limites.

### Gestion stricte du budget
- Coût autorisé par défaut : 0 €.
- Aucun abonnement payant, achat d'asset, plugin payant, publicité, serveur, nom de domaine ou frais de boutique sans approbation préalable.
- Utiliser en priorité les outils, logiciels, services et assets gratuits dont les licences autorisent réellement l'usage et la redistribution du jeu.
- Tenir un registre des coûts réels, y compris frais de paiement, taxes, commissions, coûts d'IA et éventuelles redevances.
- Avant toute sortie commerciale ou collecte de dons, vérifier les obligations légales, fiscales, de protection des consommateurs et de propriété intellectuelle applicables en France et dans les pays ciblés.
- Les dons et cosmétiques sont des pistes possibles, pas des revenus garantis. Le développement ne doit pas présumer qu'ils financeront le projet.

## 14. Licence — audit indispensable

Le dépôt contient actuellement une `LICENSE` GPL-3.0. Les conditions officielles d'Unreal Engine et de certains contenus Epic citent explicitement la GPL parmi les licences incompatibles avec la combinaison/distribution de la technologie ou du contenu licencié.

Ne pas considérer la GPL-3.0 actuelle comme validée pour le projet Unreal complet. Auditer séparément :
1. Code et contenu originaux de RIXE.
2. Code et contenu du modèle Unreal.
3. Ressources Epic / Marketplace / Quixel.
4. Plugins, bibliothèques et ressources tierces.

Piste à étudier : MIT pour les seuls éléments originaux de code RIXE, avec exclusions et notices claires ; licence distincte pour les créations artistiques originales ; licences propres pour les contenus Epic et tiers. Ne pas appliquer une licence globale aux ressources Epic ou tierces. Faire confirmer la licence définitive après inventaire des droits détenus.

Références officielles :
- Unreal Engine EULA : https://www.unrealengine.com/eula/unreal
- Epic Content License Agreement : https://www.unrealengine.com/eula/content
- Options de licence Unreal Engine : https://www.unrealengine.com/license

## 15. Conditions minimales d'une alpha publique

- Hébergement et connexion documentés et testés sur plusieurs réseaux.
- Départ/reconnexion testés.
- Combat et score validés côté serveur.
- Aucun secret dans le dépôt.
- Build Shipping démarrant sur une machine propre.
- Cartes initiales équilibrées.
- Licences des éléments distribués vérifiées.
- Limites de l'hébergement par les joueurs annoncées clairement.

## 16. Jeu multiplateforme et parité de gameplay

### Objectif du propriétaire
RIXE doit être accessible depuis un navigateur web et sous forme installable (au minimum Windows), avec possibilité d'étendre ensuite à d'autres plateformes. Tous les joueurs doivent retrouver les mêmes règles, armes, cartes, déplacements, capacités, objectifs, progression et conditions de victoire. Une différence de rendu est acceptable ; une différence de gameplay ou un avantage compétitif lié à la plateforme ne l'est pas.

### Distinguer les voies techniques
1. **Client Unreal natif** : priorité de référence pour Windows, puis étude de macOS/Linux et des plateformes mobiles/consoles selon faisabilité, matériel, exigences de publication et coûts. C'est la voie qui conserve directement le rendu Unreal local ; les niveaux de qualité peuvent varier selon le matériel.
2. **Navigateur avec Pixel Streaming** : exécuter une build Unreal sur une machine distante équipée d'un GPU, puis transmettre image et son au navigateur via WebRTC et renvoyer les commandes du joueur. Cette voie conserve réellement le rendu Unreal dans le navigateur, mais elle exige une infrastructure GPU, de la bande passante et une faible latence. Elle n'est pas considérée comme gratuite ou scalable par défaut et ne doit pas être déployée à grande échelle tant que le financement et les tests réseau ne le permettent pas.
3. **Client web natif allégé** : si le streaming Unreal est trop coûteux ou trop lent, développer un client navigateur distinct avec rendu WebGL/WebGPU et interface adaptée. Il doit utiliser les mêmes règles de jeu, données, armes, cartes fonctionnelles, timings, validations serveur et protocole réseau que les clients Unreal. Les différences visuelles doivent rester cosmétiques et ne jamais masquer des informations utiles ou modifier les hitboxes, collisions, visibilité compétitive ou sensations de contrôle.

Ne pas présenter un client WebGL/WebGPU comme un jeu rendu par Unreal Engine : ce serait un rendu distinct. Ne pas supposer qu'un export HTML5/WebAssembly Unreal est une cible officielle prête à l'emploi pour UE 5.8. Le Pixel Streaming est la piste documentée pour afficher une application Unreal dans un navigateur.

### Architecture exigée pour préserver l'équité
- Séparer autant que possible règles de gameplay et autorité serveur du rendu et de l'interface propres à chaque plateforme.
- Le serveur décide des dégâts, tirs, collisions pertinentes, déplacements autorisés, capacités, apparitions, score, événements de carte et résultats ; les clients ne font que présenter et prédire visuellement dans les limites validées.
- Définir une spécification commune et versionnée des règles, des armes, des cartes, des timings, des données de match et du protocole réseau.
- Prévoir cross-play et salons communs entre plateformes compatibles, avec contrôles de latence, input, aide à la visée et équilibre clavier/souris/manette/tactile. Ne jamais donner un avantage artificiel à une plateforme.
- Garder une base de contenu et de règles commune. Les niveaux de détail, textures, éclairage, effets, résolution et fréquence d'images peuvent être adaptés au matériel, sans modifier la simulation compétitive.
- Tester séparément latence, stabilité, fréquence d'images, précision des commandes, lisibilité, accessibilité et performances sur navigateur et clients installés.
- Le navigateur doit rester utilisable sans installation lourde ; prévoir une page d'accueil légère, contrôles compatibles et avertissements clairs si l'appareil ou la connexion ne permet pas une expérience correcte.

### Déploiement progressif et contrainte zéro euro
- Ne pas tenter de développer simultanément toutes les plateformes avant d'avoir une version Windows stable et une architecture réseau/serveur fiable.
- Étape 1 : stabiliser et empaqueter le client Unreal Windows.
- Étape 2 : valider un prototype Pixel Streaming sur réseau local ou infrastructure temporaire gratuite disponible, sans promettre une capacité publique permanente.
- Étape 3 : comparer objectivement Pixel Streaming et client web allégé sur latence, qualité, coût par joueur, compatibilité et charge de développement ; faire un prototype navigateur seulement après ce comparatif.
- Étape 4 : étendre aux autres plateformes natives selon les résultats et les moyens disponibles.
- Aucun serveur GPU, hébergement cloud, abonnement ou service payant sans accord explicite : budget actuel 0 €.

Références techniques Epic à vérifier pour la version du moteur utilisée :
- Pixel Streaming UE 5.8 : https://dev.epicgames.com/documentation/unreal-engine/overview-of-pixel-streaming-in-unreal-engine
- Infrastructure Pixel Streaming : https://dev.epicgames.com/documentation/unreal-engine/pixel-streaming-infrastructure
- Plateformes et packaging UE 5.8 : https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project

## 17. Réseau compétitif, protection communautaire et équilibrage par les données

### 17.1 Réseau adapté aux FPS compétitifs
Objectif : rendre les affrontements aussi réactifs et équitables que possible malgré les différences de latence, de plateforme et de qualité de connexion.
- Mesurer et afficher le ping, la gigue (jitter), la perte de paquets et les variations de qualité de connexion de manière compréhensible.
- Étudier une compensation de latence côté serveur pour la validation des tirs (par exemple rewind/lag compensation avec historique limité des positions), avec fenêtre maximale, contrôles anti-abus et tests de cas extrêmes.
- Étudier la prédiction et la réconciliation des déplacements côté client pour réduire la sensation de retard, sans donner au client l'autorité sur la position réelle ni les collisions validées.
- Optimiser la fréquence et la priorité de réplication selon la pertinence des acteurs, la distance et les besoins du gameplay ; éviter de transmettre inutilement des données.
- Gérer proprement gigue, pertes de paquets, pics de latence et déconnexions ; fournir un diagnostic clair plutôt que masquer une mauvaise connexion.
- Tester en laboratoire avec latence, gigue et pertes simulées, puis sur des réseaux et plateformes variés. Mesurer le temps de réponse, les écarts de tirs, les corrections de mouvement et l'équité entre joueurs.
- Ne pas promettre une équité parfaite : documenter les limites de l'hébergement par un joueur, de la latence et de la compensation. Toute solution doit rester compatible avec l'autorité serveur et les modes classés éventuels.

### 17.2 Protection et modération de la communauté
Objectif : permettre aux joueurs de jouer ensemble dans un environnement accueillant, sans exiger une équipe de modération coûteuse au lancement.
- Actions accessibles depuis le tableau des scores et le profil : signaler un comportement, bloquer un joueur et mettre en sourdine le chat textuel/vocal.
- Catégories de signalement claires (harcèlement, triche présumée, spam, contenu inapproprié, sabotage) et possibilité d'ajouter un contexte limité.
- Anti-spam pour le chat, invitations et autres interactions ; limites de fréquence, détection de répétitions et protections contre les abus automatisés.
- Outils de modération proportionnés : historique minimal nécessaire, file de signalements, priorisation et décisions traçables. Prévoir une procédure de contestation si des sanctions de compte sont introduites.
- Ne pas appliquer de sanction automatique grave sur la base d'un signalement unique ou d'un score opaque. Les signalements coordonnés et abusifs doivent être détectés.
- Respecter la vie privée : minimiser les données collectées, limiter leur durée de conservation, protéger les accès et expliquer les traitements. Ne pas enregistrer les conversations vocales par défaut.
- Distinguer les mesures locales (masquer/silencier) des sanctions globales qui nécessitent une infrastructure et une procédure fiables. Commencer par les fonctions locales et les outils simples compatibles avec le budget de 0 €.

### 17.3 Équilibrage du jeu fondé sur des données
Objectif : identifier les déséquilibres réels sans modifier le jeu sur la base d'une impression ou d'un petit échantillon.
- Collecter des statistiques de gameplay strictement nécessaires et, si possible, agrégées : efficacité des armes, taux de victoire par carte/côté, durée des manches, lieux d'élimination, usage des capacités et contribution aux objectifs.
- Comparer les résultats en tenant compte du niveau des joueurs, du nombre de parties, des équipes, du mode, de la plateforme et de la qualité réseau lorsque ces facteurs sont disponibles et pertinents.
- Utiliser des seuils d'échantillon et des intervalles d'incertitude ; ne pas tirer de conclusion d'une poignée de parties ni confondre corrélation et causalité.
- Créer des rapports internes et visualisations de tendances pour les développeurs. Ne pas exposer publiquement de données personnelles ou de profils individuels sensibles.
- Tester les changements d'armes, cartes et règles sur une branche ou un environnement de test, comparer avant/après et garder une possibilité de retour arrière.
- Ne jamais laisser un algorithme modifier automatiquement les statistiques d'armes ou les règles en pleine partie classée. Les changements d'équilibrage doivent être versionnés, annoncés et validés avant déploiement.
- Prévoir une option de télémétrie minimale et une information claire des joueurs ; vérifier les obligations de protection des données applicables avant toute collecte en ligne.

### Ordre de priorité
1. Diagnostic réseau et tests avec latence/pertes simulées ; ensuite compensation et prédiction contrôlées.
2. Blocage, sourdine et signalement local ; ensuite outils de modération et protections anti-spam.
3. Instrumentation minimale et rapports d'équilibrage ; ensuite analyses comparatives et tests contrôlés.

Ces trois chantiers restent planifiés tant qu'ils n'ont pas été implémentés et testés sur des builds distribuables.

---
Cahier des charges vivant : une ligne planifiée ne prouve jamais que la fonctionnalité existe dans le code.

## 18. Plateforme RIXE : compte unique, progression synchronisée et cross-play (ajouts approuvés)

### Vision
RIXE doit devenir une plateforme de jeu unifiée, et pas seulement un FPS limité à un appareil. Un joueur doit pouvoir retrouver son identité et continuer sa progression sur toute plateforme officiellement prise en charge, par exemple Windows, navigateur web et, si techniquement possible, d'autres appareils.

### Compte joueur et sauvegarde multiplateforme
- Mettre en place une identité RIXE unique, indépendante de la boutique ou de l'appareil utilisé. Étudier EOS et les solutions d'identité compatibles avec le budget, les licences et les plateformes.
- Permettre de lier/délier proprement les comptes de plateforme (PC, boutiques et autres appareils) à un même compte RIXE, avec une procédure sécurisée de récupération et de prévention des usurpations.
- Synchroniser les données de profil pertinentes : progression, niveau/XP, statistiques de carrière, défis, maîtrises, déblocages cosmétiques, inventaire visuel, préférences et paramètres lorsque compatibles.
- Sauvegarder côté service de compte les données qui doivent suivre le joueur ; conserver un cache local pour permettre un démarrage raisonnable hors ligne si le mode le permet. Définir clairement les règles de conflit, de version et de restauration des sauvegardes.
- Ne jamais perdre une progression à cause d'un changement d'appareil, d'une réinstallation ou d'un changement de boutique. Prévoir sauvegarde, migration, export/récupération du compte et tests de restauration.
- La progression compétitive doit être cohérente entre plateformes et validée côté serveur. Ne pas faire confiance à une sauvegarde client pour attribuer XP, rangs, statistiques ou récompenses.
- Ne pas synchroniser de données sensibles inutiles. Informer le joueur des données conservées, sécuriser les accès et prévoir les mécanismes de confidentialité/suppression requis.
- Le compte et la synchronisation doivent fonctionner sans achat obligatoire. Respecter le budget de 0 € : aucun service cloud payant ou stockage facturé sans accord explicite.

### Cross-play activable ou désactivable
- Permettre au joueur d'activer ou désactiver le cross-play dans les paramètres, avec une explication claire des conséquences sur le temps d'attente et le nombre de parties disponibles.
- Permettre aux joueurs de rejoindre leurs amis multiplateformes via invitations et groupes, sous réserve des règles de compatibilité et de sécurité.
- Définir un matchmaking qui respecte le choix de cross-play de chaque joueur et de son groupe ; ne pas mélanger silencieusement des joueurs ayant refusé le cross-play.
- Étudier des files distinctes ou des règles adaptées selon les plateformes et les périphériques (clavier/souris, manette, tactile), sans donner d'avantage injuste. Ne pas imposer une séparation si les tests démontrent une équité acceptable.
- Afficher les plateformes des membres d'un groupe lorsque cela aide à comprendre la compatibilité, sans exposer d'informations techniques ou personnelles superflues.
- Prévoir des tests de bout en bout : création de compte, liaison, invitation, groupe mixte, matchmaking cross-play activé/désactivé, progression sur un second appareil, déconnexion, conflit de sauvegarde et récupération du compte.

### Architecture et limites réalistes
- Séparer clairement identité du joueur, profil, progression, sauvegardes, matchmaking et session de jeu afin que les clients Unreal natifs et web puissent partager les mêmes services et règles.
- Garder le serveur autoritaire pour les résultats de match, l'XP, les rangs, les récompenses et les statistiques fiables.
- Le navigateur, Windows et les autres clients doivent partager les mêmes règles et données de gameplay ; les différences graphiques/performance déjà prévues ne doivent pas créer d'avantage compétitif.
- Documenter les limites propres à chaque plateforme, les politiques des boutiques, la disponibilité des SDK et les exigences de confidentialité.
- Implémenter progressivement : prototype d'identité et liaison de comptes, puis profil/sauvegarde, puis invitations et cross-play, puis tests de progression multi-appareils. Aucune promesse de disponibilité universelle avant validation réelle.

### Statut
Fonctionnalités approuvées et planifiées ; elles ne sont pas considérées comme implémentées tant que les flux de compte, sauvegarde, cross-play et récupération n'ont pas été testés sur au moins deux clients/plateformes réels.

## 19. Ajouts approuvés : A, B et E

### A — Stabilisation et consolidation du multijoueur
- Faire d'EOS (ou d'une solution équivalente validée) une couche de services en ligne réellement testée : identité, sessions/salons, invitations, recherche de parties et classements si disponibles.
- Garantir un parcours complet et cohérent : créer/rejoindre un salon, inviter, rejoindre un ami, lancer une partie, gérer les déconnexions et revenir au groupe.
- Prévoir un navigateur de parties/salons avec filtres utiles (mode, région/latence, places disponibles, plateforme et type de partie), sans exposer de données privées.
- Afficher les erreurs de connexion avec une explication et une action de récupération compréhensibles.
- Conserver une solution de connexion de secours pendant la transition ; ne retirer aucun parcours existant avant validation de bout en bout.
- Les classements doivent utiliser des résultats fiables validés côté serveur et distinguer clairement les parties classées des parties privées/non classées.
- Une playlist de test communautaire (section 29.7) est une file expérimentale séparée : elle peut être préparée et testée sans classé, sans rang et sans récompense officielle. Elle exige un environnement versionné, des résultats isolés et les protections minimales requises avant toute ouverture à des volontaires.

### B — Anti-camping intelligent
- Compléter le level design anti-camping par des mécanismes de jeu contextuels, sans interdire la défense tactique ni pénaliser un joueur qui tient temporairement un objectif.
- Repérer les positions durablement dominantes à partir de données de partie (durée d'immobilité, répétition d'éliminations depuis une même zone, couverture et lignes de vue), sans se baser sur un seul indicateur.
- Préférer des réponses indirectes et équitables : itinéraires alternatifs, objectifs qui déplacent l'action, couvertures et contre-positions accessibles aux deux équipes.
- Si un signal visuel ou une information tactique est utilisé, il doit être symétrique, lisible et ne jamais révéler gratuitement la position exacte d'un joueur.
- Ne pas infliger automatiquement de dégâts, retirer de points ou dévoiler un joueur uniquement parce qu'il reste immobile ; le sniper, le défenseur d'objectif et les stratégies légitimes doivent rester viables.
- Tester sur plusieurs cartes, armes et niveaux de compétence afin de réduire le camping abusif sans rendre les cartes chaotiques ni favoriser le rush permanent.

### E — Transparence des statistiques de fin de partie
- Présenter un tableau de fin de partie détaillé et compréhensible pour tous les joueurs : éliminations, morts, assistances, dégâts utiles si mesurables, objectifs, défense, soutien, soins/réanimations, protections, repérages et score.
- Expliquer comment les points et distinctions ont été attribués, avec les critères et valeurs applicables au mode joué.
- Distinguer clairement statistiques individuelles, contribution à l'équipe et résultat collectif ; éviter qu'un seul ratio éliminations/morts résume la performance.
- Permettre de consulter les statistiques de chaque joueur de la partie, sous réserve des règles de confidentialité et des données réellement disponibles.
- Garder les chiffres cohérents entre le tableau de match, le profil et les statistiques de carrière ; signaler les données indisponibles plutôt que d'inventer ou d'estimer silencieusement.
- Les statistiques affichées doivent provenir d'événements validés et ne pas exposer de données personnelles ou techniques sensibles.

## 20. Création communautaire, replays et calibration des joueurs (ajouts approuvés)

### 20.1 Replays complets de parties
- Prévoir un système de replay permettant de revoir une partie entière après sa fin, au-delà de la killcam.
- Enregistrer prioritairement les événements et états nécessaires à une reconstruction fiable (positions, actions, tirs, dégâts, objectifs, apparitions, événements de manche), plutôt qu'une vidéo lourde lorsque la reconstruction déterministe est possible.
- Permettre de choisir un joueur à suivre, passer d'une vue à l'autre, utiliser une caméra libre si le mode et les règles l'autorisent, mettre en pause et parcourir la chronologie.
- Ajouter des commandes de lecture (lecture/pause, vitesse, saut à un événement) et une chronologie des éliminations/objectifs.
- Distinguer clairement les replays locaux, privés et partageables. Ne jamais publier automatiquement un replay contenant des données privées ou des communications vocales.
- Prévoir des limites de stockage, une durée de conservation configurable et des contrôles de confidentialité. Ne pas enregistrer le chat vocal par défaut.
- Les replays doivent indiquer leur version de jeu et être déclarés incompatibles si une mise à jour empêche une reconstruction fidèle.
- Utiliser les replays pour l'analyse et le signalement, sans les considérer comme preuve infaillible en l'absence de vérification serveur.

### 20.2 Éditeur de cartes communautaire
- Étudier un éditeur de cartes accessible permettant de construire des arènes à partir d'éléments et d'outils autorisés, de placer apparitions/objectifs/couvertures et de tester la circulation des joueurs.
- Fournir des outils de validation : limites de carte, collisions, points d'apparition, lignes de vue, zones inaccessibles, performances, lisibilité et risques de spawn-kill/camping.
- Permettre les tests privés entre amis avant toute proposition à la communauté.
- Prévoir une galerie de cartes avec aperçu, description, auteur, version, notes et retours des joueurs ; les évaluations doivent être protégées contre le spam et les votes coordonnés.
- Mettre en place une validation technique et une modération avant qu'une carte communautaire puisse rejoindre une playlist publique ou compétitive.
- Séparer les cartes communautaires des cartes officielles et des classements officiels tant qu'elles n'ont pas passé les tests d'équilibrage et de sécurité.
- Définir un format de contenu sécurisé, versionné et limité : pas d'exécution de scripts arbitraires, pas d'accès aux fichiers personnels et pas d'assets sans droits de redistribution.
- Respecter strictement les licences des outils, éléments de construction et contenus importés. Ne pas autoriser l'import d'assets tiers non vérifiés.
- Commencer par un prototype restreint et des outils internes ; l'éditeur complet ne doit pas retarder la stabilité du FPS ni dépasser le budget de 0 €.

### 20.3 Calibration du niveau et détection des abus de matchmaking
- Estimer le niveau réel d'un joueur sur plusieurs parties et avec une incertitude explicite, plutôt qu'à partir d'une seule victoire ou du ratio éliminations/morts.
- Prévoir une phase de calibration progressive pour les nouveaux comptes et les joueurs revenant après une longue absence, sans les enfermer durablement dans une catégorie.
- Détecter les comportements compatibles avec du smurfing ou de la manipulation de matchmaking à partir de plusieurs signaux agrégés et contextualisés ; ne jamais conclure sur la seule base d'une bonne partie.
- Distinguer un joueur très talentueux, un joueur qui progresse rapidement, un compte secondaire légitime et une manipulation volontaire.
- Ajuster prudemment l'estimation de niveau et les adversaires proposés ; ne pas appliquer de bannissement ou sanction automatique sur une simple suspicion.
- Prévoir une possibilité de réévaluation et de contestation en cas d'erreur, et limiter la collecte aux données nécessaires.
- Tester l'effet sur les nouveaux joueurs, les groupes d'amis, le cross-play, les joueurs de retour et les petites populations de matchmaking.
- Garder les règles et seuils documentés, versionnés et révisables ; aucune modification cachée des statistiques ou des résultats d'une partie en cours.

### Statut
Ces trois fonctionnalités sont approuvées et planifiées. Elles restent non livrées tant que leurs prototypes, contrôles de sécurité, tests multi-joueurs et contraintes de performance n'ont pas été validés.

## 21. Crosshair entièrement personnalisable

### Deux formes de base
- Proposer deux formes prédéfinies dès le départ : **rond** et **croix**.
- Ces deux formes doivent être disponibles gratuitement pour tous les joueurs, sur toutes les plateformes compatibles.
- Le joueur peut choisir l'une des deux comme point de départ, puis modifier son apparence.

### Personnalisation détaillée
- Permettre de régler la taille, l'épaisseur, l'écartement, la longueur des branches, le diamètre du rond, la couleur et l'opacité.
- Permettre d'activer ou désactiver un point central, un contour et un fond/halo de contraste lorsque ces options restent lisibles.
- Permettre de choisir un réticule statique ou, si le jeu le prend en charge, un comportement dynamique lié au déplacement, au saut ou au tir.
- Fournir un aperçu en direct dans les paramètres et un moyen de tester le réticule dans le stand de tir.
- Proposer une remise à zéro, plusieurs emplacements de profils personnalisés et des préréglages simples.
- Sauvegarder les réglages dans le profil du joueur et les synchroniser entre plateformes lorsque le compte multiplateforme le permet.
- Prévoir des paramètres distincts par arme ou catégorie d'armes uniquement si cela reste simple à comprendre et fiable à synchroniser.
- Assurer la lisibilité sur les différentes cartes et arrière-plans ; proposer des options d'accessibilité pour les couleurs et le contraste.

### Équité et contraintes
- Le crosshair personnalisé est purement visuel : aucune aide à la visée, détection automatique des adversaires, indication de leur position ou information cachée.
- Ne pas fournir d'avantage compétitif par rapport aux autres joueurs ; les options doivent seulement modifier l'apparence et le comportement visuel autorisé du réticule.
- Garantir une interface cohérente à la souris/clavier, à la manette et sur les interfaces tactiles prises en charge.
- Tester la sauvegarde, le changement d'arme, le changement de résolution, le mode fenêtré/plein écran et la synchronisation entre deux appareils.

### Statut et validation
La fonctionnalité est approuvée et planifiée. La mention historique d'un « éditeur de réticule » dans les notes techniques ne vaut pas preuve d'implémentation. Elle ne sera déclarée disponible qu'après vérification dans le projet Unreal, tests en jeu et validation de la sauvegarde des réglages.


## 22. Fiabilité, sécurité, accessibilité et qualité de livraison — nouveaux ajouts approuvés

Les dix axes ci-dessous sont approuvés et doivent être intégrés à la planification. Leur présence dans le cahier des charges ne signifie pas qu'ils sont déjà implémentés. Chaque axe doit être évalué, prototypé et testé selon les priorités, les contraintes de budget (0 €) et la capacité réelle du projet.

### 22.1 Diagnostic et correction des désynchronisations de combat
- Mesurer les écarts entre l'état présenté au client et l'état autoritatif validé par le serveur : positions, tirs, impacts, dégâts et événements.
- Identifier les symptômes de latence, jitter, pertes de paquets et corrections de prédiction ; distinguer clairement un problème réseau d'un comportement suspect.
- Corriger les écarts visuels progressivement lorsque cela ne compromet pas la cohérence compétitive ; ne jamais falsifier l'état autoritatif.
- Fournir des diagnostics techniques reproductibles et respectueux de la vie privée, avec collecte minimale et durée de conservation définie.
- Tester les cas limites sur différentes latences, pertes de paquets et fréquences d'images.

### 22.2 Séparation des parties classées et non classées selon leur niveau de confiance
- Ne proposer de classement officiel que pour des parties dont l'intégrité des résultats peut être suffisamment garantie.
- Évaluer les limites de l'hébergement par un joueur : avantage potentiel de l'hôte, autorité réelle, départ de l'hôte, falsification des résultats et résistance aux manipulations.
- Séparer clairement les parties privées, publiques non classées et classées ; afficher le type d'hébergement et les garanties réelles avant la partie.
- Si une autorité indépendante et fiable n'est pas disponible, désactiver le classement officiel plutôt que prétendre qu'il est sécurisé.
- Ne pas imposer de serveurs payants : toute architecture doit respecter le budget de 0 € ou être soumise à approbation avant dépense.

### 22.3 Accessibilité complète
- Ajouter des options de daltonisme et de distinction des équipes qui ne reposent pas uniquement sur la couleur.
- Permettre de régler tailles de texte, sous-titres, éléments du HUD, contraste et lisibilité.
- Proposer une réduction ou désactivation des flashs, secousses de caméra et effets visuels agressifs, dans les limites de l'équité.
- Séparer les volumes des armes, pas, explosions, interface et communications.
- Proposer des indices visuels facultatifs pour certains sons importants, sans révéler d'informations que le joueur ne pourrait normalement pas connaître.
- Permettre de choisir entre maintenir une touche et basculer un état pour les actions compatibles.
- Vérifier que les options ne fournissent aucun avantage compétitif injuste et qu'elles fonctionnent sur les plateformes prises en charge.

### 22.4 Tutoriel progressif et apprentissage facultatif
- Construire des exercices courts pour les déplacements, le tir, le rechargement, les armes et les objectifs.
- Proposer des entraînements facultatifs adaptés aux difficultés observées, sans pénalité ni obligation.
- Expliquer les notions d'attaque, défense, soutien et coopération.
- Permettre de passer, reprendre ou recommencer chaque exercice.
- Ne pas exposer les données personnelles ou les performances individuelles publiquement ; utiliser uniquement les informations nécessaires pour adapter les exercices.

### 22.5 Laboratoire de validation et d'équilibrage des armes
- Développer des outils internes pour mesurer dégâts, portée, dispersion, recul, cadence, temps de rechargement et récupération de précision.
- Comparer des configurations d'armes dans des conditions reproductibles.
- Tester les armes selon différentes distances, fréquences d'images et conditions réseau.
- Générer des rapports comparatifs versionnés pour les développeurs.
- Ne pas modifier automatiquement les valeurs en partie ; tout changement doit être testé, documenté et réversible.
- Le laboratoire complète le stand de tir joueur, mais ne le remplace pas.

### 22.6 Batterie de validation automatique des cartes
- Détecter les apparitions dans des géométries invalides, dangereuses ou immédiatement exposées.
- Repérer les risques de blocage, zones inaccessibles, collisions incorrectes, passages involontairement réservés à une équipe et objectifs impossibles à atteindre.
- Mesurer les distances entre apparitions, objectifs et zones de combat, sans remplacer les tests humains d'équilibrage.
- Contrôler les performances, les lignes de vue et les possibilités de sortie de carte.
- Produire un rapport exploitable avant validation d'une carte officielle ou communautaire.
- Les résultats automatisés sont des alertes à examiner, pas une preuve suffisante d'équilibrage.

### 22.7 Sécurité et contrôle des sessions de compte
- Permettre au joueur de consulter les sessions et appareils connectés et de révoquer une session à distance.
- Prévoir une récupération de compte sécurisée et des protections renforcées pour les opérations sensibles.
- Protéger les changements d'adresse e-mail, les liaisons/déliaisons de plateformes et les modifications des moyens de récupération.
- Informer le joueur des changements de sécurité importants.
- Ne jamais stocker de mots de passe en clair ; appliquer les bonnes pratiques d'authentification, de limitation des tentatives et de protection des secrets.
- Ne pas créer de mécanisme de sécurité qui nécessite un service payant sans approbation explicite.

### 22.8 Compatibilité des versions et mises à jour réversibles
- Vérifier la compatibilité des versions client, serveur, cartes et données de gameplay avant une connexion.
- Détecter les fichiers manquants, corrompus ou incompatibles et expliquer clairement la correction nécessaire.
- Empêcher qu'un client puisse imposer des données de gameplay non autorisées au serveur.
- Versionner les paramètres d'armes, cartes, règles et formats de données.
- Prévoir une procédure de retour à une version précédente lorsque cela est techniquement et juridiquement possible.
- Documenter les changements susceptibles d'affecter les replays, les statistiques et la compatibilité multijoueur.

### 22.9 Profilage des performances sur configurations modestes
- Mesurer les FPS, temps de frame, saccades, mémoire, temps de chargement, coûts CPU/GPU et charge réseau.
- Identifier les cartes, effets, bots et systèmes de réplication les plus coûteux.
- Définir des profils graphiques cohérents et préserver la lisibilité compétitive à faible niveau de détail.
- Tester sur plusieurs catégories de matériel réellement disponibles, sans inventer de configuration minimale non mesurée.
- Comparer les résultats avant/après chaque changement important et conserver des références de performance.
- Ne pas sacrifier l'équité visuelle entre plateformes.

### 22.10 Tests automatiques de non-régression du gameplay
- Créer des tests reproductibles couvrant les règles essentielles : munitions, cadence de tir, dégâts, mort, score, objectifs, apparitions, équipes, bots et sauvegarde des paramètres.
- Vérifier qu'une action ne peut pas attribuer plusieurs fois les mêmes points ou événements.
- Vérifier que les clients ne peuvent pas imposer au serveur les dégâts, résultats ou récompenses.
- Ajouter des tests réseau, de reconnexion et de compatibilité lorsqu'ils deviennent disponibles.
- Exécuter les tests pertinents après chaque modification et avant toute livraison.
- Consigner les tests réellement exécutés, leurs résultats, les limites connues et le commit testé ; ne jamais déclarer un test réussi s'il n'a pas été exécuté.

### Ordre de priorité recommandé
1. Tests automatiques de non-régression et diagnostic des désynchronisations.
2. Confiance et intégrité des parties classées.
3. Laboratoire de validation des armes et validation automatique des cartes.
4. Compatibilité des versions, profilage des performances et sécurité des sessions.
5. Accessibilité et tutoriel progressif.

### Règles de réalisation
- Ces axes ne doivent pas détourner l'équipe des blocages actuels, de l'audit des licences, de la stabilité du multijoueur et de la production d'une version jouable.
- Privilégier des prototypes réduits, mesurables et livrables ; découper ou reporter les systèmes trop ambitieux.
- Aucune dépense, dépendance payante ou infrastructure payante sans accord explicite du propriétaire.
- Aucune fonctionnalité ne peut être marquée « terminée » sur la seule base de sa spécification ou de code non testé.
- Pour chaque axe : préciser l'état réel (non commencé, en cours, prototype, testé, livré), les dépendances, les risques, les tests et les preuves de validation.


## 23. Nouvelles fonctionnalités communautaires et confort de partie — approuvées

Ces cinq fonctionnalités sont approuvées et planifiées. Elles ne sont pas considérées comme implémentées tant qu'elles n'ont pas été développées et testées dans une build réelle.

### 23.1 Roue de communication rapide
- Ajouter une roue de communication accessible rapidement, notamment à la manette et au clavier, avec des messages courts prédéfinis : « ennemi repéré », « besoin de renfort », « défendez l'objectif », « je recharge », « regroupez-vous », « danger », « merci » et « bien joué ».
- Prévoir une présentation textuelle claire et, si possible sans dépendance payante, des annonces vocales préenregistrées ou synthétiques uniquement si la licence et la taille le permettent.
- Transmettre uniquement les informations que le joueur est autorisé à communiquer ; une indication directionnelle ou de position ne doit pas révéler une information inconnue du joueur.
- Ajouter limitation de fréquence, mute, désactivation et protections anti-spam.
- Adapter l'interface aux plateformes et périphériques pris en charge.
- Ajouter quelques gestes tactiques silencieux déclenchés depuis la roue ou des raccourcis : « suivre », « rester ici », « danger », « zone à surveiller » et « besoin d'aide ».
- Représenter le geste par une animation courte du personnage et, si nécessaire, un pictogramme discret pour les alliés ; ne pas révéler une information que le joueur ne connaît pas.
- Rendre les gestes visibles uniquement dans des conditions cohérentes avec la visibilité réelle du personnage ; ne pas transmettre de signal à travers les murs ou à distance irréaliste.
- Permettre de réduire ou désactiver les animations reçues, tout en conservant éventuellement le pictogramme ou le texte ; les gestes ne doivent jamais bloquer le tir, le rechargement, le sprint ou une action essentielle.
- Répliquer seulement le type de geste et les informations utiles, avec des limites anti-spam ; ne pas attribuer de points ou de progression à leur répétition.
- Prévoir des commandes accessibles au clavier et à la manette, configurables et compatibles avec les options d'accessibilité.

### 23.2 Échauffement pré-match de dix secondes — isolation totale des équipes
- Avant le début officiel de chaque partie, prévoir une phase d'échauffement de **10 secondes**, inspirée des salons d'échauffement des anciens Call of Duty.
- Pendant cette phase, chaque joueur peut librement marcher, courir, sprinter, sauter, viser, tirer, recharger, changer d'arme et tester les grenades ou équipements disponibles dans le mode.
- Les joueurs peuvent entendre les sons de leur propre équipe, mais **aucun son de l'équipe adverse ne doit leur parvenir** : tirs, impacts, explosions, grenades, pas, sauts, rechargements, voix, communications et autres événements audio.
- L'isolation doit être appliquée techniquement côté serveur et/ou par le système de réplication audio : ne pas simplement baisser le volume adverse dans les réglages locaux. Aucun événement audio adverse ne doit être transmis ou rendu audible pendant cette phase.
- Les deux équipes ne doivent recevoir aucune information sur les actions de l'autre équipe : positions, déplacements, visée, tirs, grenades, équipement, changements d'arme, éliminations, messages, marqueurs, indicateurs, killfeed ou notifications. Ne pas transmettre ces informations aux clients adverses pendant l'échauffement lorsque cela est techniquement possible.
- Prévoir une séparation des espaces ou des instances d'échauffement si nécessaire afin d'empêcher les joueurs de voir l'équipe adverse. Si les joueurs partagent physiquement la même carte, masquer les silhouettes, noms, effets, projectiles et autres indices visuels adverses.
- Les joueurs peuvent tester librement les armes et équipements ; les munitions peuvent être réapprovisionnées et les réapparitions rapides autorisées pour éviter les temps morts.
- Les tirs, dégâts, grenades, éliminations et autres actions de l'échauffement ne comptent pas dans les statistiques, le score, les défis, les replays officiels ou le résultat de la partie. Aucun effet persistant ne doit influencer le début officiel.
- À la fin des dix secondes, terminer l'échauffement, réinitialiser les états nécessaires (santé, munitions, grenades, positions et équipements selon les règles du mode), puis démarrer simultanément la partie officielle pour les deux équipes.
- Synchroniser le compte à rebours avec l'autorité de partie. Gérer proprement les chargements tardifs, pertes de connexion et arrivées tardives ; ne pas démarrer avec des états différents entre clients.
- L'échauffement doit être identique pour tous les joueurs du match et ne doit procurer aucun avantage d'information ou de position au lancement officiel.

### 23.3 Rotation intelligente des cartes et des modes
- Éviter les répétitions excessives d'une même carte ou d'un même mode dans les playlists concernées.
- Tenir compte de l'historique récent des parties, de la population disponible et des contraintes de matchmaking.
- Si un vote est proposé, offrir un choix équitable et éviter que le système ne favorise toujours la même carte.
- Ne pas imposer une carte incompatible avec le mode ou les règles de la playlist.
- Garder une rotation déterministe et explicable ; ne pas modifier le matchmaking pour masquer une population insuffisante.

### 23.4 Historique des changements du jeu
- Mettre à disposition des notes de version consultables et archivées : changements d'armes, cartes, règles, corrections et améliorations techniques.
- Associer chaque version aux identifiants de build, branche/commit de développement et date de publication lorsque ces informations sont disponibles.
- Permettre de retrouver les notes des versions précédentes et d'identifier les changements pouvant affecter les statistiques ou replays.
- Ne publier que des informations vérifiées ; distinguer clairement les changements livrés des changements prévus.

### 23.5 Protection contre les erreurs de manipulation
- Demander une confirmation pour les actions destructrices ou difficiles à annuler, par exemple supprimer un profil local ou réinitialiser des paramètres.
- Prévoir une restauration des paramètres par défaut et, lorsque cela est faisable, une sauvegarde des configurations avant modification.
- Permettre plusieurs profils de commandes et de réglages sans écraser accidentellement le profil actif.
- Étendre cette gestion avec des profils de commandes associés à un contexte choisi (par exemple entraînement, menus ou partie), avec sélection automatique uniquement si le joueur l'active.
- Permettre de nommer, dupliquer, importer et exporter les profils dans des formats sûrs ; signaler les conflits et périphériques/commandes indisponibles avant application.
- Préserver un profil global de secours, permettre le retour au profil précédent et éviter toute modification silencieuse des affectations.
- Éviter les confirmations répétitives pour les actions quotidiennes non risquées.
- Ne jamais présenter une suppression distante ou une restauration cloud comme réversible si elle ne l'est pas réellement.

### Statut
Les cinq fonctionnalités sont approuvées et planifiées. Leur priorité est inférieure à la correction des blocages, à la stabilité du FPS multijoueur et à l'obtention d'une build jouable et testable.


## 24. Livraison prioritaire — première build jouable Windows

### 24.1 Objectif et relation avec la chronologie générale

L'objectif de cette livraison rapprochée est de fournir une **première build Windows réellement jouable et testable**, et non de terminer toutes les fonctionnalités de RIXE. Elle correspond principalement aux phases 0 et 1 de la section 12, avec les contrôles indispensables de sécurité, de licence et de qualité.

La section 12 reste la chronologie générale du projet. La présente section est un objectif de livraison court terme : elle ne crée pas une deuxième feuille de route et ne permet pas de sauter les prérequis de la section 12. Les étapes suivantes du produit restent planifiées après cette première livraison.

La cible initiale était d'environ douze jours à compter du 19 novembre 2026. Cette durée est indicative et doit être réévaluée selon l'état réel du dépôt, les blocages techniques et les résultats des tests. **La qualité et les preuves priment sur la date.**

### 24.2 Périmètre minimum de la première build

- Build Unreal empaquetée et exécutable sur Windows x64, si l'environnement et les outils disponibles le permettent.
- Démarrage fiable, accès à une partie et boucle complète : déplacement, visée, tir, rechargement, dégâts, élimination, réapparition, score et fin de partie.
- Au moins une carte fonctionnelle et un mode jouable.
- Bots autorisés pour valider la boucle si le multijoueur en ligne n'est pas encore fiable ; leur présence ne doit pas être présentée comme une validation réseau.
- Test multijoueur réel si disponible, en indiquant précisément le nombre de machines, joueurs, réseaux et scénarios testés.
- Aucun crash ou blocage critique connu dans le parcours testé ; les défauts non bloquants doivent être consignés.
- Un lien direct de téléchargement uniquement si la build existe réellement et si le lien a été vérifié. Sinon, expliquer clairement le blocage.
- Rapport indiquant version, branche, commit, plateforme, procédure de lancement, tests exécutés, résultats, limites et fonctionnalités non incluses.

Cette première build n'exige pas que toutes les cartes, playlists, EOS, le matchmaking public, les statistiques avancées, les fonctions communautaires, le classé ou le cross-play soient terminés. Ces éléments ne sont pas supprimés : ils restent soumis à la chronologie générale et à leurs dépendances.

### 24.3 Séquence indicative de livraison

1. **Préparation :** sauvegarde, vérification branche/commit, audit des secrets et licences, reproduction du blocage.
2. **Déblocage :** correction du problème empêchant le lancement, la compilation ou l'accès au jeu ; build de référence.
3. **Boucle jouable :** une carte, un mode, contrôles, armes, dégâts, élimination, réapparition, score et fin de partie.
4. **Stabilisation :** tests fonctionnels, bots si nécessaires, corrections critiques, sauvegarde des réglages et contrôle des régressions.
5. **Empaquetage :** build Windows, lancement depuis un environnement propre, vérification des fichiers et procédure de démarrage.
6. **Livraison :** lien vérifié si disponible, rapport factuel et liste des limites et travaux suivants.

Les jalons calendaires initiaux (jours 1–2, 3–5, 6–8, 9–10 et 11–12) peuvent servir d'estimation, mais ne constituent ni des dates garanties ni des critères de validation.

### 24.4 Gel de périmètre et arbitrage jusqu'à la livraison

- Priorité 1 : sauvegarde, intégrité du dépôt, secrets, licences et risques juridiques bloquants pour la distribution.
- Priorité 2 : blocage empêchant de compiler, lancer ou jouer.
- Priorité 3 : boucle FPS complète sur une carte et un mode.
- Priorité 4 : stabilité, tests fonctionnels et sauvegarde des réglages.
- Priorité 5 : build Windows reproductible, test propre et livraison vérifiable.
- Priorité 6 : uniquement ensuite, travaux secondaires qui ne compromettent pas la livraison.

Ne pas entreprendre avant cette livraison un grand système secondaire (replays, éditeur communautaire, saisons, fonctions sociales avancées, cross-play, navigateur, Learning Agents ou optimisation graphique avancée) sauf s'il corrige directement un blocage, une faille, une incompatibilité ou un risque indispensable à la build.

Ne pas sacrifier l'autorité serveur, la sécurité, les licences, la sauvegarde ou les tests pour respecter une échéance. Si une exigence de sécurité ou de licence bloque la distribution publique, fournir si possible une build de test interne non distribuée et expliquer ce qui interdit sa publication.

### 24.5 Conditions de validation et rapport de livraison

La livraison n'est validée que si :
- la build et le commit correspondent exactement au rapport ;
- le lancement et la boucle de jeu ont été testés réellement ;
- les résultats distinguent tests locaux, tests en réseau et tests sur plusieurs machines ;
- les erreurs, limites et fonctions absentes sont déclarées ;
- les licences et contenus distribués ont été contrôlés ;
- le lien fourni ouvre bien l'artefact attendu, ou son indisponibilité est explicitement indiquée.

Ne jamais qualifier cette étape de jeu complet ou de produit final. Employer le statut exact démontré : prototype jouable, build de test ou alpha.


## 25. Audit de licence Unreal Engine / Epic — point bloquant à résoudre avant distribution

### Constat vérifié dans le dépôt et les conditions Epic consultées le 19 novembre 2026
- Le dépôt contient un fichier `LICENSE` intégralement rédigé sous GNU GPL version 3.
- Le `README.md` indique seulement que le dépôt contient un fichier `LICENSE` GNU GPL-3.0 et que la compatibilité avec Unreal/Epic reste à auditer ; il ne fournit pas, à lui seul, un inventaire d'attribution de licence par fichier ou dossier. Ne pas en déduire que chaque élément de `Content/Rixe` est effectivement détenu ou licencié par le propriétaire sous GPL-3.0.
- Le projet `fps.uproject` déclare Unreal Engine 5.8 et active plusieurs plugins ; chaque plugin, module, contenu et dépendance doit être inventorié avec sa version et sa licence.
- La version actuelle de l'Unreal Engine EULA publiée par Epic contient une clause « Non-Compatible Licenses » (section 6(c)) qui cite explicitement GNU GPL et LGPL (sauf simple liaison dynamique d'une bibliothèque partagée) parmi les licences incompatibles avec la Licensed Technology. L'accord limite aussi la redistribution du moteur et du contenu Epic ; les produits intégrant le moteur doivent respecter les conditions de distribution applicables.
- Ce constat crée un risque sérieux de compatibilité entre la GPL-3.0 annoncée pour le projet et l'utilisation/intégration d'Unreal Engine. Il ne permet pas, à lui seul, de conclure que chaque fichier du dépôt est soumis à la même licence ou que le propriétaire détient les droits nécessaires pour relicencier tous les éléments.

### Consignes obligatoires
- **Ne pas remplacer, supprimer ou réécrire le fichier `LICENSE` automatiquement.** Ne pas annoncer que le problème est réglé par un simple changement global vers MIT, BSD ou Apache.
- Auditer fichier par fichier et dossier par dossier : code original, Blueprints et assets originaux, modèle First Person/Arena Shooter, Starter Content, exemples Epic, contenus Fab/Quixel, plugins, bibliothèques, sons, polices, textures, animations, outils et prototype web.
- Pour chaque élément, relever auteur/source, version, propriétaire des droits, licence exacte, preuve d'acquisition, droits de modification, redistribution, usage commercial et restrictions de plateforme/source.
- Séparer clairement les éléments originaux RIXE des éléments Epic et des tiers. Ne pas appliquer une licence open source au contenu Epic ou tiers sans autorisation expresse.
- Vérifier si les fichiers originaux placés dans le même projet Unreal et distribués avec le moteur peuvent légalement rester sous GPL au regard de la clause 6(c). Examiner une architecture de licences séparées ou une licence permissive pour les seuls éléments originaux, uniquement si le propriétaire possède les droits nécessaires et après validation juridique.
- Ne pas présumer que MIT résout toutes les obligations : conserver les notices tierces, respecter les licences des plugins/assets et les règles de redistribution d'Epic.
- Produire un rapport de compatibilité, les éléments incertains, les options de remédiation et leurs conséquences sur l'ouverture du code, la distribution des sources et les builds binaires.
- Si la compatibilité ne peut pas être établie, suspendre la publication/distribution publique des éléments concernés jusqu'à décision du propriétaire après avis juridique adapté. Le travail privé de développement ne doit pas être confondu avec une autorisation de redistribuer.
- Consigner la version et la date de l'EULA examinée ; revérifier les conditions Epic au moment de toute distribution.

### Décision de licence
Aucune modification de licence n'est autorisée sans inventaire complet, preuve des droits du propriétaire sur chaque élément concerné et approbation explicite du propriétaire. Toute modification doit être ciblée, documentée et vérifiée dans toutes les branches et tous les fichiers de notices concernés.


## 26. Lobby public, continuité des parties, identité sonore et modes Chaos — ajouts approuvés

### Lobby public à lancement automatique, inspiré de Black Ops II
- Concevoir une expérience de playlist publique dans laquelle les joueurs rejoignent un lobby commun à un mode/une playlist, voient les joueurs arriver et attendent le lancement collectif de la partie.
- Le lancement se déclenche automatiquement lorsque le lobby est suffisamment rempli et/ou lorsque le compte à rebours configuré arrive à zéro. Le système doit pouvoir lancer avec un effectif inférieur au maximum si les seuils minimums du mode sont atteints ; sinon, prolonger/recommencer l'attente sans bloquer indéfiniment les joueurs.
- Afficher clairement le nombre de joueurs présents, les places restantes, le mode/la carte, l'état de préparation et le compte à rebours. Le joueur ne doit pas avoir à confirmer individuellement à chaque étape si la playlist publique utilise le lancement automatique.
- Prévoir un seuil minimum, un effectif cible, un délai maximum et des règles de remplissage/backfill. Ne pas lancer une partie déséquilibrée ou injouable simplement pour respecter le timer.
- Le système doit préserver la qualité de connexion, la région/latence et les règles de matchmaking du mode. Pour le classé, appliquer les critères d'intégrité et d'équité plus stricts.
- La confirmation avant lancement reste utile pour les groupes privés/personnalisés ou les changements importants de configuration ; elle ne doit pas transformer le lobby public en succession de pop-ups.
- S'inspirer du rythme et de la lisibilité des anciens lobbies Call of Duty/Black Ops II, sans copier leur interface ou leur code. La référence est le principe de rassemblement dans un lobby puis lancement automatique.

### Déconnexion, période de grâce et remplacement par bot
- Lorsqu'un joueur perd sa connexion ou quitte involontairement, conserver temporairement sa place et son identité de session pendant une période de grâce configurable par mode.
- Pendant cette période, afficher l'état « reconnexion possible » et permettre au même compte/session de reprendre sa place, son équipe et son emplacement logique, sous réserve des validations serveur.
- Le joueur reconnecté ne doit pas récupérer un avantage indu : rétablir son état de jeu selon des règles sûres (par exemple réapparition ou réintégration protégée), sans restaurer un état client non fiable.
- À l'expiration de la période de grâce, remplacer automatiquement le joueur absent par un bot adapté au mode et au niveau moyen de la partie, si le mode autorise les bots.
- Si le joueur revient après le remplacement, appliquer une règle explicite : reprendre sa place en remplaçant le bot si cela est autorisé et sans expulser un autre joueur humain ; sinon attendre une place disponible ou rejoindre en spectateur/au prochain match selon le mode.
- Le bot ne doit pas recevoir les données privées du compte et ne doit pas modifier les statistiques personnelles du joueur absent. Les actions du bot doivent être distinguées dans les statistiques, replays et journaux.
- En classé, définir une politique stricte et cohérente : période de grâce, bot temporaire ou absence de bot selon les exigences compétitives ; aucun résultat ne doit être artificiellement attribué au joueur déconnecté. Prévoir protections contre les déconnexions volontaires et abus de reconnexion, sans sanction automatique sur une simple coupure réseau.
- Synchroniser ces transitions côté serveur et tester coupure réseau, fermeture du jeu, retour rapide, retour tardif, hôte déconnecté, plusieurs joueurs absents et panne de session.

### Migration automatique de l'hôte
- Si l'hôte joueur quitte ou perd durablement sa connexion, tenter de transférer l'autorité de session à un autre participant éligible, avec migration d'état vérifiée et reprise coordonnée.
- Élire le nouvel hôte selon des critères documentés (stabilité, latence, capacité et disponibilité), sans permettre au client de s'auto-attribuer l'autorité.
- Prévoir un délai de migration, un message clair, la reprise ou l'annulation propre de la partie et une solution de secours si la migration échoue.
- Ne jamais considérer la migration P2P comme équivalente à un serveur dédié indépendant pour l'intégrité du classé. Les parties classées doivent utiliser une architecture et des validations adaptées ; désactiver ou limiter la migration si elle compromet l'intégrité.
- Prototyper et mesurer la faisabilité avec l'architecture réseau réelle avant de déclarer la fonction disponible.

### Appellations tactiques des zones de carte
- Donner aux zones importantes de chaque carte des noms courts, distinctifs, faciles à prononcer et traduisibles.
- Utiliser les mêmes appellations dans la mini-carte, les pings, la roue de communication, les objectifs et les communications rapides.
- Éviter les noms ambigus ou trop proches phonétiquement ; tester leur compréhension dans plusieurs langues et sans vocal.
- Permettre de signaler rapidement une zone par son nom, sans révéler automatiquement une information que le joueur n'a pas observée.

### Identité sonore des armes et satisfaction du tracking
- Chaque arme doit avoir une identité sonore de tir et de confirmation d'impact clairement reconnaissable, cohérente avec sa mécanique, sa cadence et sa catégorie.
- Le retour sonore lorsqu'un projectile/tir touche un adversaire doit être particulièrement satisfaisant, précis et lisible pendant le tracking, sans devenir envahissant ni masquer les sons tactiques importants.
- Concevoir des couches audio distinctes et mixables : tir de l'arme du joueur, impacts sur surfaces, impacts confirmés sur adversaire, élimination, rechargement et événements spécifiques. Le retour d'impact doit être fiable et déclenché à partir d'un résultat confirmé par le serveur, avec une latence perçue optimisée.
- Chaque arme possède son propre son de confirmation de touche ou une signature sonore adaptée ; ne pas réutiliser un son générique identique pour tout l'arsenal.
- Débloquer, à partir de seuils de maîtrise de l'arme, des variantes cosmétiques de sons de confirmation de touche. Le son de base doit rester excellent dès le départ ; aucun son ne doit fournir une information compétitive supplémentaire, modifier la détection ou avantager le joueur.
- Laisser le joueur choisir parmi les sons qu'il a débloqués, avec aperçu, réglage de volume dédié, option de désactivation et retour au son par défaut. Les variantes ne doivent pas dégrader la lisibilité des autres sons.
- Tester chaque arme en tir isolé, rafale, tracking continu, impacts multiples, tirs ratés, headshots, élimination, combat rapproché et combat chargé. Évaluer qualité, fatigue auditive, mixage, cohérence et lisibilité avec casque et haut-parleurs.
- Prévoir accessibilité : réglages de volume, indicateurs visuels équivalents et absence d'information exclusivement sonore indispensable.

### Arsenal maîtrisé et playlists Chaos
- Dans les modes classiques et compétitifs standards, sélectionner un arsenal contrôlé et équilibré. Éviter les armes « cancer »/dominantes qui rendent les duels frustrants ou suppriment les possibilités de contre-jeu.
- Conserver les armes explosives ou atypiques (par exemple lance-roquettes/RPG) dans des playlists dédiées où leur présence est attendue, plutôt que de les supprimer définitivement du jeu.
- Créer deux playlists distinctes : **Chaos** (non classée) et **Chaos classé** (classée), avec accès à l'arsenal complet, y compris les armes explosives et les équipements les plus extrêmes.
- Définir pour Chaos classé des règles propres, une rotation/validation de l'arsenal, des limites éventuelles de munitions/fréquence ou des contre-mesures si nécessaires ; « arsenal complet » ne signifie pas abandon de la stabilité, de l'anti-triche ou de la qualité compétitive.
- Afficher clairement avant de rejoindre qu'il s'agit d'une playlist Chaos et que les armes atypiques/explosives y sont autorisées. Ne pas mélanger silencieusement ces règles aux modes classiques.
- Mesurer les taux d'utilisation, éliminations, efficacité, frustration signalée, taux de victoire et possibilités de contre-jeu. Corriger les excès par équilibrage documenté, sans supprimer arbitrairement le style Chaos.

### Interface lobby et paramètres
- Adopter une interface lobby originale de RIXE, avec une hiérarchie visuelle simple, des coins arrondis cohérents avec l'identité déjà décidée (kit UI arrondi, rayons indicatifs 8–16 px), des libellés explicites et des interactions rapides.
- Prioriser : mode/playlist sélectionné, état du lobby, joueurs présents/places restantes, compte à rebours, groupe/amis, connexion/latence et action principale. Les informations secondaires doivent rester secondaires.
- Les paramètres doivent être regroupés par catégories compréhensibles, avec recherche si le nombre d'options le justifie, descriptions courtes, valeurs visibles, aperçu immédiat lorsque possible et bouton de réinitialisation.
- Ne pas copier l'écran de Warzone, Apex Legends ou THE FINALS. Étudier leurs principes d'organisation et tester des prototypes RIXE auprès de joueurs. Choisir la solution sur des mesures de compréhension, nombre d'actions, temps pour lancer/rejoindre une partie, erreurs et accessibilité.
- Éviter les animations longues, les panneaux surchargés, les menus imbriqués inutilement et les éléments décoratifs qui masquent l'information utile. Préserver une navigation rapide à la manette, au clavier/souris et sur navigateur.

Tous ces éléments sont des exigences approuvées mais restent planifiés tant qu'ils ne sont pas implémentés et validés par des tests réels. Respecter le budget de 0 €, les licences et les priorités de stabilité/livraison.

## 27. Direction de développement : FPS hybride à priorité communautaire (approuvée le 19 novembre 2026)

### 27.1 Vision directrice
RIXE est un FPS hybride : le gameplay compétitif, nerveux et lisible constitue le cœur de chaque partie ; la continuité sociale, les rencontres et les communautés donnent envie aux joueurs de revenir. La priorité stratégique est la communauté, sans sacrifier l'équité, la qualité du combat, la stabilité réseau ni l'accessibilité.

S'inspirer des qualités recherchées dans les FPS appréciés (fluidité, gunplay satisfaisant, lobbies publics, continuité des groupes, liberté de choix, outils sociaux) sans copier l'interface, les assets, les marques ou l'identité d'un jeu existant. RIXE conserve une identité visuelle et fonctionnelle propre.

### 27.2 Expérience par défaut : matchmaking et lobby public façon BO2
C'est le parcours principal et l'écran de jeu par défaut. Les serveurs communautaires ne doivent jamais remplacer ni masquer cette expérience.

- Au lancement, afficher l'interface principale RIXE avec l'action principale « Jouer » clairement mise en avant.
- En choisissant « Jouer », le joueur rejoint le matchmaking officiel de la playlist choisie et un lobby public de joueurs, inspiré du fonctionnement des anciens Call of Duty / Black Ops II.
- Le lobby public se remplit automatiquement ; afficher clairement playlist, mode, carte si connue, région/qualité de connexion, population, places restantes et compte à rebours.
- Lancer automatiquement la partie lorsque le seuil d'effectif ou le délai configuré est atteint. Aucun pop-up de confirmation individuel ne doit interrompre le matchmaking public.
- Après la partie, conserver autant que possible les joueurs dans le même lobby pour enchaîner les manches/parties, favoriser les retrouvailles, les rivalités amicales et la formation spontanée de groupes.
- Le joueur doit pouvoir quitter, rejoindre un groupe, inviter des amis ou changer de playlist sans parcours complexe.
- Prévoir remplissage des places libres (backfill) sans déséquilibrer une manche déjà presque terminée ; utiliser des bots uniquement selon les règles du mode et avec une indication claire. Ne pas remplir artificiellement les parties de bots si des joueurs humains sont disponibles dans un délai raisonnable.
- Le matchmaking prend en compte en priorité la qualité de connexion et le temps d'attente, puis le niveau avec une calibration prudente ; éviter les écarts de ping excessifs et les compositions manifestement déséquilibrées. Expliquer les critères sans promettre un matchmaking parfait.
- Le système de lobby public et de matchmaking doit rester la voie la plus simple, la plus visible et la plus rapide pour jouer.

### 27.3 Serveurs communautaires : fonctionnalité secondaire et facultative
- Ajouter une rubrique distincte, par exemple « Communauté » ou « Serveurs », accessible depuis une autre interface/entrée du menu principal.
- Ne pas ouvrir cette rubrique automatiquement au démarrage et ne pas sélectionner les serveurs communautaires comme parcours par défaut.
- Cette rubrique pourra proposer un navigateur de serveurs avec filtres mode, carte, région, ping, population, règles, langue, favoris et présence d'amis.
- Permettre de rejoindre directement un serveur, de retrouver un serveur favori et de créer/rejoindre des expériences communautaires lorsque l'infrastructure et le budget le permettent.
- Identifier sans ambiguïté les serveurs officiels, communautaires vérifiés et expériences personnalisées.
- Séparer les règles, la progression, les statistiques et les classements communautaires des résultats classés officiels, sauf validation explicite d'un environnement compétitif conforme.
- Prévoir outils d'administration, signalement, blocage, mute, journalisation proportionnée, règles de conduite et mécanismes de contestation.
- Ne pas exiger Discord ou une application externe pour les fonctions communautaires essentielles.

### 27.4 Continuité sociale et fidélisation
- Conserver les joueurs ensemble entre les parties lorsque possible, avec possibilité de quitter à tout moment.
- Groupes persistants, invitations, rejoindre un ami, présence et statut en jeu, liste d'amis et gestion simple du groupe.
- Préparer un système de clans/groupes persistants : nom, tag, emblème, membres, rôles, invitations, paramètres de confidentialité et historique collectif. Le développer après le socle multijoueur.
- Prévoir des outils de formation de groupes spontanés et de maintien d'une équipe appréciée après une partie, sans forcer les joueurs à rester.
- Ajouter à terme des événements et tournois communautaires gratuits : inscriptions, équipes, formats adaptés (1v1, 2v2, 5v5 ou autres selon les modes), tableaux de tournoi, résultats, règles et historique.
- Les événements communautaires ne doivent pas donner d'avantage payant ni perturber les playlists officielles.

### 27.5 Créativité et participation communautaires
- Permettre à terme de proposer, tester et publier des cartes communautaires via un processus progressif : tests privés, validation technique, modération, vérification des licences et publication.
- Séparer clairement les cartes communautaires des cartes officielles et du matchmaking/classé officiel tant que les critères de validation ne sont pas satisfaits.
- Prévoir à terme des variantes/règles temporaires communautaires contrôlées, avec vote ou rotation, sans contaminer les statistiques et classements officiels.
- Recueillir les suggestions et retours des joueurs directement dans le jeu ou via un canal officiel accessible.
- Publier un historique clair des changements, problèmes connus, corrections et décisions d'équilibrage.
- Utiliser les données agrégées de parties pour éclairer l'équilibrage des armes, cartes, modes et apparitions ; conserver validation humaine, échantillons suffisants, tests avant/après et possibilité de retour arrière. Ne jamais changer les règles compétitives en pleine partie.

### 27.6 Qualité du combat et équité comme fondations
- Prioriser les sensations de tir, les déplacements, la lisibilité des impacts, l'identité sonore des armes, la stabilité des hit registrations et la cohérence des dégâts.
- Traiter les plaintes de désynchronisation avec des outils compréhensibles : ping, pertes, jitter, événements de tir/dégâts validés, et explication prudente des divergences. Ne jamais présenter une estimation client comme preuve définitive.
- Renforcer anti-triche, autorité serveur, sécurité des comptes et protection contre les exploits.
- Prévoir une expérience d'accueil progressive : tutoriel court, stand de tir, entraînement contre bots et explication des objectifs/communications.
- Offrir des options d'accessibilité complètes et configurables : remappage, sous-titres, contrastes, daltonisme, tailles UI, intensité des effets, options audio et réglages adaptés aux limitations motrices lorsque possible.
- Préserver les modes officiels classiques avec arsenal maîtrisé et équilibré ; les expériences Chaos et les règles personnalisées restent séparées selon les sections déjà approuvées.
- La progression doit récompenser le temps et la contribution sans imposer de grind excessif, pay-to-win ni achat obligatoire.

### 27.7 Modération et confiance
- Outils intégrés de signalement, blocage, mute texte/vocal, contrôle des invitations et confidentialité.
- Modération proportionnée, procédures de réexamen et contestation ; aucune sanction grave automatisée sur la base d'un simple score ou d'une suspicion non vérifiée.
- Protection contre le harcèlement, le spam, les usurpations, le doxxing et les abus de groupe.
- Ne pas enregistrer le vocal par défaut ; minimiser la collecte, expliquer les données et limiter leur conservation.
- Prévoir des outils d'administration adaptés aux serveurs communautaires, avec permissions graduées et traces des actions sensibles.

### 27.8 Plateformes et modèle économique
- Le client Windows Unreal reste la référence initiale ; les voies navigateur et autres plateformes suivent une stratégie technique distincte mais visent les mêmes règles et la parité de gameplay, comme défini en section 16.
- Le compte RIXE, la progression et les paramètres doivent être synchronisables entre plateformes compatibles, avec protections de compte et gestion des conflits.
- Le cross-play doit être configurable et respecter les préférences des joueurs et l'équité des périphériques.
- Le jeu de base reste gratuit et aucun avantage compétitif ne peut être vendu.
- Budget actuel : 0 €. Aucun serveur payant, service cloud, hébergement, achat d'asset, plugin, abonnement, frais de boutique ou dépense ne peut être engagé sans accord explicite préalable. Concevoir les fonctions communautaires en fonction des capacités réellement gratuites et des limites d'hébergement par les joueurs.

### 27.9 Interface et architecture de navigation
- Conserver la direction d'interface RIXE déjà approuvée : identité originale, claire, rapide, hiérarchie simple, coins arrondis cohérents de 8 à 16 px, sans copier Apex, THE FINALS ou Warzone.
- L'écran principal met en avant « Jouer » et le matchmaking/lobby public.
- Les rubriques secondaires peuvent inclure « Communauté/Serveurs », « Amis/Groupe », « Armes », « Progression », « Personnalisation » et « Paramètres ».
- La rubrique communautaire ne doit pas concurrencer visuellement le bouton « Jouer » ni devenir l'expérience par défaut.
- Paramètres lisibles, libellés explicites, descriptions courtes, valeurs visibles, aperçu immédiat et réinitialisation.

### 27.10 Ordre de réalisation

Cette séquence complète la chronologie générale de la section 12 ; elle ne la remplace pas. La première build Windows de la section 24 reste prioritaire. Les services privés EOS et le matchmaking public sont deux jalons distincts. **La sécurité communautaire minimale doit précéder toute ouverture ou expérimentation publique**, et la validation qualité/alpha doit précéder les extensions avancées.

1. **Sécurisation et audit :** sauvegarde, état réel du dépôt, secrets, licences, plugins, dépendances, configurations et blocages. Aucune distribution publique avant clarification des licences ; les tests internes peuvent continuer si les droits et conditions applicables le permettent.
2. **Première build jouable :** une carte pilote, un mode, boucle FPS complète et build Windows de test ; bots/local autorisés pour valider le gameplay sans prétendre valider le réseau en ligne.
3. **Fondations FPS et réseau :** qualité du tir/hit registration, autorité serveur, réplication, déplacements et mécaniques de base approuvées, dégâts, apparitions, équipes, bots, stabilité de la carte pilote et tests réseau progressifs. Établir la référence de performances dès ce stade. **La carte pilote seule est requise pour cette phase et pour ouvrir le chantier EOS ; les autres cartes du lancement ne sont pas un prérequis EOS.**
4. **EOS et parties privées :** identité/Connect, présence, amis/invitations, lobbies et sessions privées ; valider création, invitation, rejoindre, lancer une partie, retour au lobby et reconnexion. Garder un chemin LAN/direct de diagnostic.
5. **Socle de sécurité communautaire avant le public :** sourdine, blocage, signalement, limites anti-spam, confidentialité, messages d'erreur et règles de traitement des abus. Tester ces protections avec les parcours privés et les scénarios de groupe. Les outils avancés de modération restent ultérieurs, mais aucune ouverture publique ne doit précéder ce socle.
6. **Matchmaking public officiel et contenu de lancement :** après validation d'EOS et des parties privées, construire et tester en environnement contrôlé la file publique, la constitution des équipes, le lobby BO2, le compte à rebours/seuil de joueurs, le lancement automatique et la continuité des groupes. Les prototypes internes du matchmaking peuvent avancer sur la carte pilote sans attendre la finalisation des autres cartes. Ajouter progressivement gestion des départs, migration d'hôte, backfill, remplaçants et préférences selon les capacités validées. Finaliser et valider les trois cartes maximum et les modes inclus dans l'alpha avant celle-ci. **L'activation publique réelle** attend les contrôles de sécurité, de licence, de stabilité et de capacité.
7. **Données persistantes et systèmes dépendants :** statistiques détaillées, sauvegardes, progression, défis, préférences synchronisées et fonctions communautaires avancées. Le score de match de base et son affichage sont requis dans la première boucle jouable ; sa validation serveur appartient aux fondations FPS.
8. **Qualité, performances et préparation de l'alpha :** non-régression, tests réseau/performance multi-configurations, sauvegardes, accessibilité, localisation, compatibilité, audit final des licences, build Shipping et procédure de retour arrière. Le profilage commence dès les fondations ; cette phase réalise la validation finale.
9. **Extensions après validation du socle :** replays, création communautaire, événements, fonctions sociales avancées, cross-play, clients navigateur et plateformes supplémentaires lorsque leurs dépendances sont prêtes. Learning Agents reste une expérimentation isolée, désactivable et non bloquante.

Ne pas développer tous les systèmes sociaux simultanément. À chaque étape, appliquer les critères de passage de la section 12 et les critères spécialisés du système concerné. Une dépendance non validée bloque le jalon qui en dépend, pas les tâches indépendantes et réversibles de même priorité. Les fonctionnalités reportées restent planifiées ; elles ne sont ni supprimées ni déclarées livrées.

À chaque jalon : tests réels adaptés, critères d'acceptation, sauvegarde, rapport branche/commit, état des limites et build ou lien de test vérifié lorsque possible. Une fonction planifiée n'est jamais présentée comme livrée sans preuve.

## 28. Améliorations de l'expérience multijoueur — cinq ajouts approuvés le 19 novembre 2026

Ces cinq fonctionnalités sont approuvées pour RIXE. Elles complètent les systèmes existants sans les dupliquer. Elles restent planifiées tant qu'elles n'ont pas été développées, testées et validées.

### 28.1 Préférence de matchmaking pour les joueurs humains
- Proposer une préférence claire permettant de privilégier les parties composées de joueurs humains.
- Prévoir au minimum les choix « Humains prioritaires » et « Bots autorisés pour réduire l'attente ». Étudier une option « Humains uniquement » lorsque la population, le mode et la région permettent de trouver une partie dans un délai raisonnable.
- Ne jamais présenter un bot comme un joueur humain : signaler clairement les bots dans le lobby et le tableau de partie.
- Distinguer strictement statistiques, progression, récompenses et résultats des joueurs humains et des bots.
- Les bots ne doivent pas être injectés silencieusement pour donner l'impression artificielle qu'une partie est peuplée.
- Expliquer lorsqu'une préférence empêche de trouver rapidement une partie et permettre au joueur de modifier son choix.
- Appliquer des limites et règles propres aux modes classés ; ne pas introduire de bots dans un match classé officiel sauf décision explicite, transparente et validée séparément.

### 28.2 Chat vocal de proximité facultatif
- Ajouter, dans les modes compatibles, un chat vocal de proximité dont le volume varie selon la distance et, si techniquement pertinent, l'occlusion.
- Le chat de proximité est facultatif et peut être désactivé globalement ou par mode.
- Séparer clairement vocal de proximité, vocal d'équipe et communications de groupe.
- Prévoir mute individuel immédiat, signalement, blocage et contrôles de confidentialité.
- Ne pas enregistrer le vocal par défaut. Minimiser les données traitées et expliquer les règles de conservation.
- Définir les modes où cette fonction est autorisée ; la désactiver dans les modes où elle compromet la compétition, la confidentialité ou la lisibilité.
- Tester latence, qualité, sécurité, abus, charge réseau et accessibilité avant activation publique.

### 28.3 Entraînement pendant la recherche de partie
- Permettre au joueur d'utiliser un stand de tir ou un espace d'entraînement pendant que le matchmaking recherche une partie, lorsque l'architecture réseau et les ressources le permettent.
- Permettre de tester les armes, accessoires, déplacements, cibles mobiles et équipements disponibles.
- Afficher clairement l'état de recherche et avertir le joueur lorsqu'une partie est trouvée.
- Prévoir un transfert vers la partie avec un chargement fiable et un délai raisonnable ; ne pas faire perdre au joueur une place confirmée à cause d'une transition défaillante.- L'entraînement est isolé du match : aucun dégât, score, défi, statistique, replay officiel ou progression compétitive ne doit être attribué.
- Aucune information sur les équipes adverses, la carte en cours ou les positions de la partie recherchée ne doit être divulguée.
- Si l'entraînement simultané n'est pas techniquement viable ou dépasse le budget/performance, proposer une version légère ou différer la fonction plutôt que fragiliser le matchmaking.

### 28.4 Préférences de matchmaking par périphérique
- Permettre de définir une préférence de mise en relation selon le périphérique de contrôle : clavier/souris, manette ou parties mixtes.
- Ne pas empêcher les amis utilisant des périphériques différents de jouer ensemble ; prévoir des règles explicites pour les groupes mixtes.
- Le joueur doit savoir dans quel type de matchmaking il entre et pouvoir modifier sa préférence.
- Évaluer l'équité à partir de données de performance suffisamment représentatives, sans présumer qu'un périphérique est toujours supérieur.
- Équilibrer et tester séparément l'assistance à la visée, la sensibilité, les entrées et les performances des plateformes.
- Ne pas fragmenter excessivement la population ni augmenter démesurément les temps d'attente : prévoir des règles d'élargissement transparentes et configurables.
- Le périphérique détecté et les règles de groupe doivent être vérifiés autant que possible côté serveur, sans collecte intrusive.

### 28.5 Remplaçants volontaires pour les parties en cours
- Étudier un système permettant à des joueurs volontaires de rejoindre une partie officielle déjà commencée lorsqu'une place est libre.
- Le joueur doit pouvoir activer/désactiver sa disponibilité comme remplaçant et connaître le mode, la durée approximative restante et les conditions de la partie avant d'accepter.
- Prioriser les remplacements qui rétablissent l'équilibre des équipes, sans permettre de rejoindre uniquement les parties presque gagnées ou d'exploiter les informations de match.
- Ne pas interrompre un joueur déjà engagé dans une autre partie.
- Le remplaçant commence avec un état de jeu cohérent et équitable (équipement, ressources, position et protection d'apparition selon le mode).
- Ses statistiques, récompenses et contribution sont enregistrées uniquement à partir de son arrivée ; elles ne sont jamais fusionnées avec celles du joueur parti.
- Les départs, remplacements, bots temporaires et retours de joueurs déconnectés doivent suivre une règle cohérente avec la reconnexion et le backfill existants.
- Protéger le système contre le boosting, les arrangements entre joueurs, les changements volontaires d'équipe et les abus de matchmaking.
- En classé, n'activer cette fonction qu'après définition et validation de règles strictes ; sinon la désactiver.

### 28.6 Ordre de réalisation et critères communs
- Priorité initiale : préférences humains/bots et entraînement pendant la recherche, après stabilisation du matchmaking et de la boucle de jeu.
- Chat vocal de proximité, préférences de périphérique et remplaçants volontaires sont des chantiers ultérieurs, à prototyper et mesurer avant généralisation.
- Chaque fonction doit disposer de critères d'acceptation, tests réseau et sécurité, vérification de l'impact sur les temps d'attente et possibilité de désactivation.
- Respecter le budget de 0 €, la confidentialité, l'autorité serveur, l'accessibilité et la séparation entre statistiques officielles et activités d'entraînement.

## 29. Huit fonctionnalités communautaires et compétitives approuvées

Les huit propositions suivantes sont approuvées par le propriétaire. Elles complètent les systèmes existants ; lorsqu'un sujet recoupe une section antérieure, enrichir cette section plutôt que créer un système concurrent. Elles sont planifiées et ne sont pas réputées implémentées avant validation par des tests.

### 29.1 Annulation et réparation des parties compromises
- Mettre en place une procédure contrôlée pour invalider les résultats d'une partie lorsqu'une triche est confirmée après enquête ou qu'une défaillance serveur majeure a rendu le match manifestement invalide.
- Définir des critères vérifiables et différents selon la cause : triche confirmée, corruption des résultats, panne serveur, déconnexion massive ou incident réseau.
- Restaurer les points/rangs injustement perdus et retirer les gains indûment obtenus uniquement lorsque les preuves et règles publiées le justifient.
- Informer les joueurs concernés de la décision, de son motif et de ses conséquences ; conserver une procédure de contestation et un journal d'audit minimisant les données personnelles.
- Ne jamais annuler une partie ou sanctionner un joueur sur une simple suspicion, un signalement isolé ou une anomalie réseau non corroborée. Prévoir une validation humaine pour les cas ambigus.

### 29.2 Matchmaking tenant compte des groupes préformés
- Enrichir le matchmaking officiel pour identifier la taille et la cohésion des groupes préformés et éviter autant que possible d'opposer un joueur seul à une équipe entièrement constituée d'amis.
- Étudier des préférences de file « solo » et « groupes acceptés », sans garantir une séparation absolue si la population ou le temps d'attente ne le permet pas.
- Préserver les groupes et amis qui souhaitent jouer ensemble ; ne pas les séparer silencieusement pour équilibrer une partie.
- Arbitrer explicitement entre équité, qualité de connexion, temps d'attente, niveau estimé et disponibilité des joueurs. Expliquer les compromis lorsque la préférence ne peut pas être respectée.
- Mesurer les écarts de victoire et de niveau entre groupes et joueurs solos, avec des échantillons suffisants et sans pénaliser automatiquement les groupes.

### 29.3 Entraînement entièrement hors ligne
- Ajouter un mode d'entraînement local utilisable sans connexion Internet, contre des bots, lorsque la plateforme le permet.
- Permettre de choisir les bots, leur difficulté, les équipes, les cartes et les règles compatibles ; proposer des cibles mobiles et des exercices de tracking, recul, précision, déplacement et lancer de grenades.
- Autoriser l'essai des armes et accessoires disponibles localement, sans dépendance à un service en ligne.
- Garder progression, statistiques et résultats strictement locaux et séparés du profil officiel, du matchmaking et des classements ; ne jamais convertir les résultats hors ligne en récompenses officielles.
- Signaler clairement les fonctions indisponibles hors ligne et prévoir une sauvegarde locale robuste.

### 29.4 Temps morts tactiques et abandon encadré
- Étudier des temps morts limités par équipe dans les modes compétitifs compatibles, notamment classés et parties personnalisées ; ne pas les imposer à tous les modes publics. Distinct de la pause technique de la section 64 (incident matériel ou réseau) : ne pas créer deux systèmes de pause concurrents, mais un mécanisme commun de synchronisation et de reprise.
- Synchroniser le temps mort côté serveur, afficher clairement sa durée et ses conditions, et empêcher les abus de pause répétée ou déclenchée à un moment injuste.
- Prévoir un vote d'abandon uniquement sous conditions définies (par exemple joueur manquant ou situation durablement compromise), avec seuil de votes, délai et protections contre la manipulation.
- Définir les conséquences de l'abandon, les pertes éventuelles de rang et les cas d'exception avant activation en classé.
- Tester l'impact sur le rythme, l'équité, les déconnexions et les possibilités de griefing. Garder la fonction désactivable par mode.

### 29.5 Armurerie transparente et laboratoire d'armes accessible aux joueurs
- Étendre le laboratoire interne d'équilibrage déjà prévu en une version accessible aux joueurs, sans dupliquer les outils de développement.
- Permettre d'essayer librement armes et accessoires dans un stand de tir, de comparer les armes et de consulter leurs valeurs réellement utilisées en jeu : dégâts selon distance, cadence, recul, temps de rechargement, dispersion et autres paramètres pertinents.
- Distinguer clairement les valeurs exactes, les valeurs contextuelles et les éventuelles approximations d'affichage ; les données présentées doivent correspondre à la version de jeu active.
- Afficher les effets réels d'un accessoire sur les statistiques et le comportement, sans descriptions trompeuses.
- Actualiser les informations lors des mises à jour et conserver un historique des changements d'équilibrage pertinent pour les joueurs.

### 29.6 Équilibrage des deux équipes avant le lancement
- Ajouter au matchmaking un équilibrage explicite des deux équipes avant chaque match, en complément de la sélection des joueurs et du niveau estimé déjà prévus.
- Prendre en compte niveau estimé avec son incertitude, performances récentes, expérience du mode, rôles/contributions utiles et cohésion des groupes.
- Éviter autant que possible de séparer les amis ou de déplacer un joueur après le début de la partie ; annoncer clairement toute répartition avant lancement.
- Privilégier l'équité sans sacrifier excessivement la qualité de connexion ni allonger démesurément l'attente.
- Mesurer l'écart de niveau et les résultats des équipes, détecter les effets indésirables et permettre un retour arrière. Ne pas promettre une égalité parfaite ni utiliser un score opaque comme unique critère.

### 29.7 Environnement public de test communautaire
- Prévoir une playlist ou un environnement de test facultatif permettant aux volontaires d'essayer en avance des changements officiels : armes, cartes, modes, recul, apparitions, règles réseau et équilibrage.
- Identifier sans ambiguïté la version expérimentale et ses risques ; ne pas mélanger ses résultats avec les statistiques, rangs ou récompenses officiels.
- Recueillir des retours structurés et facultatifs, ainsi que des données de télémétrie strictement nécessaires, anonymisées ou agrégées autant que possible.
- Comparer les résultats aux objectifs de test et aux retours ; publier, modifier ou retirer une expérimentation seulement après analyse.
- Séparer clairement environnement de test, serveurs communautaires et matchmaking officiel. Ne pas exiger de téléchargement ou de participation au test pour jouer au jeu normal.

### 29.8 Transparence sur le ping des groupes et les régions
- Avant le lancement d'une recherche en groupe, afficher une estimation récente de la latence de chaque membre vers les régions candidates, ainsi que les éventuelles incertitudes.
- Avertir lorsque les membres du groupe sont géographiquement/réseau très éloignés ou qu'une région commune risque de produire une connexion médiocre.
- Proposer les régions compatibles et un choix explicite entre meilleure qualité de connexion et temps d'attente plus court, selon les options réellement disponibles.
- Ne pas exposer d'adresse IP, de localisation précise ni de données réseau sensibles aux autres joueurs ; n'afficher que des indicateurs de latence et de région suffisamment généraux.
- Ne jamais garantir un ping futur à partir d'une simple estimation. Mesurer la qualité réelle après connexion et expliquer les limites de l'hébergement par un joueur.

### Priorités et règles communes
- Intégrer 29.2, 29.6 et 29.8 au système de matchmaking existant ; ne pas créer plusieurs moteurs de matchmaking.
- Intégrer 29.5 au stand de tir et au laboratoire d'équilibrage existants ; proposer une interface joueur distincte et sûre, alimentée par les données de la version active.
- Prioriser 29.1 (intégrité des résultats) et les fondations de 29.2/29.6/29.8 après stabilisation du socle réseau et du matchmaking officiel.
- Réaliser 29.3 comme mode local indépendant après validation de la boucle gameplay et des bots.
- Ajouter 29.4 selon ses propres dépendances. Préparer 29.7 dès que la boucle gameplay, les bots et l'environnement de test versionné sont suffisamment stables ; son lancement public exige le socle minimal de sécurité communautaire et les contrôles de confidentialité, mais **ne dépend pas de l'activation du classé**, des rangs ou des récompenses officielles.
- Respecter le budget autorisé de 0 € : aucune infrastructure, service, outil ou dépense nouvelle sans accord explicite. Privilégier les solutions locales et gratuites dans leurs limites réelles.
- Toute fonction reste planifiée jusqu'à ce qu'elle soit implémentée, testée sur une build et documentée avec ses limites.

## 30. Préréglages graphiques, diagnostic et optimisation — huit ajouts approuvés le 19 novembre 2026

Cette section complète les paramètres vidéo et les objectifs de performance existants. Elle décrit des fonctions planifiées : aucune n'est considérée comme livrée avant implémentation et tests sur des builds réelles.

### 30.1 Six préréglages graphiques
Proposer six préréglages clairement nommés :
1. **Ultra performance** : priorité maximale à la fluidité ; désactiver ou réduire fortement les effets graphiques coûteux (ombres, reflets, effets secondaires, qualité d'éclairage et détails non essentiels) lorsque cela est techniquement sûr.
2. **Performance** : privilégier les FPS tout en conservant certains effets visuels simples.
3. **Équilibré** : compromis recommandé entre qualité et fluidité.
4. **Qualité élevée** : améliorer textures, ombres, éclairage et effets selon les capacités du matériel.
5. **Très haute qualité** : pousser davantage les détails et effets avancés compatibles.
6. **Ultra** : proposer la meilleure qualité réellement disponible sur la configuration, sans activer aveuglément une option incompatible.

Règles obligatoires :
- Les préréglages ne modifient jamais le gameplay, les hitboxes, les dégâts, le recul, la cadence, les déplacements, les collisions, les règles réseau ou l'équilibrage.
- Préserver la visibilité des adversaires, les silhouettes, les télégraphies, les projectiles et tous les indices visuels qui transmettent une information tactique.
- Ne pas supprimer un effet fonctionnel de gameplay (fumée, explosion, signal d'objectif, etc.) ; réduire uniquement son coût ou sa présentation sans changer son information, sa durée, sa portée ou son comportement.
- Les options graphiques avancées doivent être activées uniquement si le matériel et le chemin de rendu les prennent réellement en charge.
- **Équilibré est le préréglage sélectionné par défaut** lors d'une première installation, puis le jeu peut proposer un benchmark pour affiner le choix sans rien modifier sans accord.
- Ajouter une entrée **Personnalisé**, distincte des six préréglages : elle permet de modifier individuellement les options, de sauvegarder plusieurs configurations nommées, de les renommer/supprimer et de restaurer un préréglage de départ. Ne pas créer un septième préréglage prédéfini.
- Afficher les valeurs réellement actives et signaler clairement lorsqu'une option est indisponible ou remplacée par une solution de secours.
- Ne fixer aucun quota universel de FPS par préréglage. Chercher la meilleure fluidité réellement possible selon le matériel, la résolution et les options choisies, avec une priorité particulière à la régularité des images (frame pacing) plutôt qu'à une moyenne élevée mais instable.
- Mesurer, lorsque possible, FPS moyens, 1 % low, temps de frame, pics de temps de frame et saccades. Distinguer les FPS réellement rendus des images interpolées/générées.
- Les préréglages sont des points de départ et non une garantie de FPS identique sur tous les matériels.

### 30.2 Benchmark graphique intégré
- Ajouter un test de performances accessible depuis les paramètres vidéo.
- Utiliser une séquence reproductible représentant une charge réaliste du jeu, sans exposer d'informations tactiques ni modifier les statistiques officielles.
- Mesurer et afficher, lorsque les données sont disponibles, FPS moyens, 1 % low / stabilité des images, temps de frame et éventuels indicateurs CPU/GPU.
- Comparer les résultats avant/après un changement et proposer un préréglage adapté, sans appliquer de changement sans accord du joueur.
- Préciser la scène, la résolution, les options et les limites du test ; ne pas présenter une mesure courte comme une garantie de performances en partie réelle.

### 30.3 Mode faible latence
- Étudier une option de réduction de latence de rendu et d'entrée, compatible avec les API et pilotes réellement disponibles.
- Optimiser la file de rendu, la synchronisation et le traitement des entrées lorsque cela réduit effectivement le délai.
- Distinguer clairement latence d'entrée/rendu, latence réseau et ping ; ne pas les confondre dans l'interface.
- Ne pas promettre de gain universel et ne pas sacrifier la stabilité, la précision d'affichage ou la compatibilité pour un bénéfice non mesuré.
- Garder les technologies propriétaires optionnelles et prévoir un comportement de secours.

### 30.4 Précompilation et cache des shaders
- Préparer les shaders nécessaires avant l'entrée en partie lorsque la plateforme le permet.
- Afficher une progression claire lors de la première compilation ou après une mise à jour importante.
- Mettre en cache les shaders compilés et éviter les recompilations inutiles.
- Gérer proprement invalidation, versions, espace disque et cache corrompu ; permettre une reconstruction sûre du cache.
- Réduire les saccades de compilation en cours de partie sans bloquer indéfiniment le lancement du jeu.

### 30.5 Réglages de visibilité et de confort visuel
- Ajouter des options pour régler contraste de l'interface, intensité des flashs, effets lumineux perturbants, taille/échelle du HUD et lisibilité des marqueurs.
- Compléter les options d'accessibilité déjà prévues (daltonisme, sous-titres, contrastes, réduction des effets).
- Ne pas permettre de supprimer les obstacles visuels, fumées, effets ou indices tactiques pour obtenir un avantage compétitif ; les réglages doivent préserver une information équivalente entre joueurs.
- Fournir des valeurs recommandées, un aperçu et une réinitialisation.

### 30.6 Diagnostic automatique et profils graphiques par carte
- Ajouter un diagnostic local qui aide à identifier les causes probables de problèmes : saturation CPU/GPU, mémoire vidéo, saccades, compilation de shaders, pertes de paquets et instabilité réseau.
- Séparer les mesures locales des informations réseau ; ne jamais affirmer qu'un diagnostic client prouve une triche ou identifie avec certitude la cause d'un incident.
- Proposer des pistes de correction explicables, sans modifier les réglages ni transmettre des données sans consentement.
- Mémoriser les performances et réglages testés par carte afin de signaler les cartes plus exigeantes et proposer un ajustement avant leur lancement.
- Le joueur garde toujours le contrôle : pas de changement silencieux en pleine partie, possibilité de désactiver les recommandations et de conserver ses réglages globaux.
- Les profils par carte ne doivent jamais créer de différence de gameplay ou d'information tactique.

#### Comparateur de configuration matérielle

- Ajouter au diagnostic local une fiche indiquant les caractéristiques matérielles utiles au fonctionnement de RIXE : processeur, carte graphique, mémoire vive, mémoire vidéo lorsque disponible, système d'exploitation et espace disque.
- Comparer ces caractéristiques aux configurations minimale et recommandée officiellement définies pour la version du jeu installée. Ne pas inventer de seuils : les exigences doivent être établies et validées par des tests sur des configurations réelles.
- Présenter clairement les composants qui respectent les recommandations, ceux qui se situent en dessous et les informations qui n'ont pas pu être détectées.
- Fournir une estimation prudente des éventuels points limitants et des réglages à essayer, en précisant qu'un composant isolé ne permet pas de prédire exactement les FPS ni d'établir avec certitude la cause d'un ralentissement.
- Distinguer les recommandations générales des résultats du benchmark intégré et des mesures réellement observées en jeu.
- Effectuer l'analyse localement autant que possible ; ne transmettre aucune caractéristique matérielle sans information claire et consentement du joueur.
- Ne jamais modifier automatiquement le PC, les pilotes, les fréquences, les tensions ou les paramètres système. Toute modification des réglages de RIXE reste soumise à l'accord du joueur.
- Mettre à jour les configurations de référence lorsque les exigences du jeu évoluent et préciser la version à laquelle elles s'appliquent.

### 30.7 Mise à l'échelle, technologies GPU et génération d'images
- Étudier et intégrer, lorsque les versions, licences, pilotes, API de rendu et cartes graphiques le permettent, les solutions suivantes : **NVIDIA DLSS**, **AMD FSR**, **Intel XeSS** et **Unreal TSR**.
- Utiliser Unreal TSR comme voie de mise à l'échelle de référence largement compatible lorsque les solutions spécialisées ne sont pas disponibles ; ne jamais rendre DLSS, FSR ou XeSS obligatoires au démarrage.
- Détecter les capacités réellement disponibles sur la machine (GPU, API/RHI, pilote et fonctionnalités prises en charge) et n'afficher que les options compatibles. Prévoir une solution de secours testée si un plugin, pilote ou chemin de rendu est absent ou échoue.
- Permettre au joueur de choisir la solution et le niveau de qualité lorsqu'ils sont compatibles ; ne jamais imposer silencieusement une technologie ni remplacer un choix sans l'en informer.
- Ne jamais activer simultanément plusieurs upscalers concurrents sur la même chaîne de rendu. Vérifier les conflits de plugins et de génération d'images ; une seule technologie de frame generation peut être active à la fois.
- Étudier les fonctions de réduction de latence adaptées au matériel : **NVIDIA Reflex**, y compris le mode **On + Boost** lorsqu'il est exposé par le plugin, **AMD Radeon Anti-Lag 2** et **Intel Xe Low Latency (XeLL)** lorsqu'elles sont prises en charge. Ces fonctions réduisent la latence du pipeline ; elles ne constituent pas un upscaler et ne garantissent pas une hausse des FPS.
- Distinguer **NVIDIA Reflex On + Boost** (maintien de fréquences GPU plus élevées pour réduire parfois encore la latence, avec consommation/chauffe potentiellement supérieures) de **AMD Radeon Boost** (réduction dynamique de résolution ou adaptation du shading lors de mouvements rapides dans les titres compatibles). Ne pas confondre ces options avec un overclocking ni promettre un gain universel.
- Lorsque le pilote AMD ne propose pas Radeon Boost pour le jeu, étudier une **résolution dynamique intégrée à RIXE**, avec seuils et limites configurables, transitions discrètes et préservation de la lisibilité. Cette fonction native doit pouvoir bénéficier aux matériels compatibles de plusieurs marques, sans prétendre activer le réglage propriétaire du pilote AMD.
- Ne jamais modifier automatiquement les fréquences, tensions, limites de puissance ou paramètres globaux du pilote du joueur. Toute fonction de tuning/overclocking reste sous le contrôle du propriétaire du PC et hors du périmètre automatique de RIXE.
- Proposer la génération d'images (Frame Generation / Multi Frame Generation) uniquement si la configuration et la solution sélectionnée la prennent réellement en charge. Elle doit rester facultative et désactivable, particulièrement pour le jeu compétitif.
- Expliquer que les images générées améliorent la fluidité visuelle mais n'augmentent pas dans les mêmes proportions la fréquence de simulation, la réactivité des entrées ou les FPS réellement calculés. Afficher séparément, lorsque possible, les FPS natifs et les FPS incluant les images générées.
- Ne jamais sacrifier la précision, la latence, la lisibilité des adversaires ou la stabilité du gameplay pour afficher un chiffre de FPS supérieur. Tester chaque technologie en mouvement, en combat et dans les scènes chargées.
- Prévoir les options HDR uniquement lorsque l'écran, le système et le chemin de rendu sont compatibles, avec calibration et retour à un affichage SDR fiable.
- Auditer les licences, conditions de redistribution, versions et dépendances de chaque SDK/plugin avant intégration. Privilégier les composants gratuits compatibles avec le budget de 0 € ; aucun achat, abonnement ou service payant sans accord explicite.
- Verrouiller et documenter les versions testées des plugins. Ne pas considérer une compatibilité annoncée par un fournisseur comme une validation suffisante : vérifier réellement le build, le lancement, le rendu, les performances et le comportement de secours sous Unreal Engine 5.8.

### 30.8 Réglages personnalisés et validation multi-matériels
- Regrouper dans le mode Personnalisé les réglages détaillés déjà prévus par le jeu : textures/matériaux, ombres, éclairage, reflets, effets, post-traitement, distance d'affichage, résolution/résolution dynamique, anti-aliasing/upscaler, limite FPS, synchronisation, faible latence et HDR si disponibles.
- N'exposer que les paramètres réellement pris en charge par la plateforme ; expliquer brièvement les options avancées sans imposer de choix technique au joueur.
- Prévoir une fonction de comparaison avant/après et de restauration sûre des valeurs précédentes si un changement provoque un écran noir, une instabilité ou une dégradation importante.
- Lorsqu'un changement de résolution, de fréquence d'écran ou de mode d'affichage est appliqué, proposer une période de confirmation temporaire avec compte à rebours et aperçu du résultat ; demander au joueur de confirmer explicitement pour conserver le nouveau réglage.
- En l'absence de confirmation avant la fin du délai, rétablir automatiquement les paramètres précédents. Prévoir également un mécanisme de secours permettant de revenir à une configuration d'affichage fonctionnelle si le changement provoque un écran noir ou rend l'interface inaccessible.
- Ne jamais laisser un réglage d'affichage non confirmé devenir permanent ; sauvegarder les dernières valeurs fonctionnelles avant toute tentative et tester le retour arrière après plantage, fermeture forcée et redémarrage.
- Valider les six préréglages et le mode Personnalisé sur plusieurs catégories de GPU (modestes, intermédiaires et haut de gamme), résolutions et fréquences d'écran, ainsi que sur les chemins de rendu effectivement pris en charge.
- Inclure des tests spécifiques sur matériel NVIDIA, AMD et Intel lorsque disponible. Une option non testée sur une famille de matériel ne doit pas être annoncée comme pleinement prise en charge.
- Ne pas limiter la qualité maximale du projet à la GTX 1070 du propriétaire : conserver des niveaux évolutifs, tout en fournissant une voie de rendu jouable et stable aux machines plus modestes.
- Commencer par une carte de référence représentative, mesurer les coûts GPU/CPU et la lisibilité compétitive, puis appliquer les réglages validés aux autres cartes.

### Critères communs et ordre de réalisation
- Commencer par les préréglages et leur validation sur plusieurs configurations, puis le benchmark reproductible.
- Prototyper ensuite le mode faible latence et la précompilation/cache, en mesurant les gains réels.
- Intégrer les réglages de confort avec le système d'accessibilité existant.
- Ajouter diagnostic et profils par carte après fiabilisation de la collecte locale des mesures.
- Tester les six préréglages sur GPU modestes et puissants, plusieurs résolutions et les chemins de rendu pris en charge.
- Ne pas retarder la première build jouable pour ces fonctions ; priorité à la stabilité et au socle gameplay.
- Respecter le budget de 0 € et ne pas ajouter de dépendance ou service payant sans accord explicite.

## 31. Internationalisation et retours communautaires — deux ajouts approuvés le 19 novembre 2026

Ces deux fonctionnalités sont approuvées. Elles complètent les systèmes de communauté, d'accessibilité, de statistiques et de modération déjà décrits. Elles restent planifiées jusqu'à leur implémentation et validation.

### 31.1 Internationalisation et localisation complètes
- Concevoir RIXE pour être utilisable dans plusieurs langues, avec une architecture de localisation centralisée plutôt que des textes intégrés directement dans les Blueprints ou widgets.
- Traduire les menus, paramètres, tutoriels, notifications, objectifs, descriptions d'armes/accessoires, aides contextuelles, messages d'erreur et textes d'accessibilité.
- Prévoir une langue de secours clairement définie lorsqu'une traduction est absente ; ne jamais afficher une clé technique ou un texte vide au joueur.
- Permettre de choisir la langue de l'interface indépendamment, lorsque possible, de la langue des voix et des sous-titres.
- Prévoir sous-titres configurables et identification claire des informations audio importantes, sans donner aux sous-titres une information tactique indisponible aux autres joueurs.
- Gérer correctement caractères accentués, alphabets non latins, polices, sens d'écriture droite-à-gauche lorsque nécessaire, formats de nombres/dates et expansion du texte dans les interfaces.
- Éviter que les traductions longues coupent les boutons, menus, notifications ou éléments HUD ; tester chaque langue sur différentes résolutions et échelles d'interface.
- Autoriser des contributions de traduction communautaires dans un processus distinct de la version publiée : proposition, révision, validation, attribution facultative et historique des changements.
- Ne jamais publier automatiquement une traduction communautaire non vérifiée ; prévoir signalement et correction des traductions incorrectes, offensantes ou trompeuses.
- Ne pas fragmenter le matchmaking selon la langue de l'interface. Une préférence de langue pour le chat ou la communication peut être proposée si la population le permet, sans empêcher les groupes d'amis de jouer ensemble.
- Garder les termes de gameplay, noms d'armes, zones et commandes cohérents dans toutes les langues ; maintenir un glossaire de référence.
- Commencer par les langues réellement traduites et testées ; ne pas annoncer une langue comme disponible si sa couverture est incomplète.
- La localisation ne doit pas changer les règles, les statistiques, les valeurs d'armes ou les informations de gameplay.

### 31.2 Retours communautaires structurés sur la qualité et l'équilibrage
- Permettre aux joueurs de transmettre des retours contextualisés sur les cartes, armes, modes, apparitions, performances, réseau, lisibilité et expérience générale.
- Proposer des catégories et des formulaires courts, avec possibilité d'ajouter une description facultative ; éviter de demander des données personnelles inutiles.
- Permettre, lorsque le joueur le souhaite, de joindre des éléments utiles comme la carte, le mode, la version du jeu, l'arme concernée et un identifiant technique de partie non sensible.
- Distinguer clairement un avis subjectif, un problème technique reproductible et un signalement de comportement abusif ; les signalements de joueurs suivent les procédures de modération dédiées et ne deviennent pas des votes d'équilibrage.
- Regrouper et analyser les retours avec les données agrégées du jeu : taux d'utilisation, efficacité, résultats, distances d'engagement, taux de victoire, incidents réseau et contexte de mode.
- Détecter les campagnes de votes coordonnées, le spam, les doublons et les tentatives de manipulation ; ne pas laisser le volume brut de votes décider seul d'un changement.
- Ne jamais modifier automatiquement les armes, cartes, apparitions ou règles à partir des retours. Toute modification doit passer par une analyse, un prototype ou environnement de test, une validation et une possibilité de retour arrière.
- Donner de la visibilité sur l'état des retours : reçu, à l'étude, reproduit, corrigé, rejeté ou planifié, lorsque cela peut être communiqué sans divulguer d'informations sensibles.
- Publier périodiquement des synthèses anonymisées des problèmes étudiés et des décisions prises, y compris lorsqu'une proposition n'est pas retenue.
- Prévoir des limites anti-spam, des outils de modération, une politique de conservation limitée et une explication claire des données éventuellement collectées.
- Respecter le budget de 0 € : privilégier les outils internes et services gratuits dans leurs limites réelles, sans dépendance payante imposée.

### Priorités et critères communs
- Mettre en place d'abord l'architecture de localisation et le glossaire, puis traduire et tester les langues retenues par étapes.
- Développer les retours structurés après stabilisation du profil, des statistiques, de la modération et des mécanismes de test communautaire.
- Les deux systèmes doivent fonctionner sur les plateformes effectivement prises en charge, avec une interface adaptée au navigateur si ce client est développé.
- Toute contribution, traduction ou donnée communautaire doit être modérée, protégée contre les abus et soumise aux licences applicables.
- Ne pas retarder la première build jouable ; commencer par les fondations techniques nécessaires et livrer progressivement.


## 32. Maîtrise des armes, calibration des commandes et défis communautaires — trois ajouts approuvés le 19 novembre 2026

Ces ajouts complètent les systèmes d'armurerie, de personnalisation, de progression, de sons d'armes et d'événements communautaires déjà prévus. Ils doivent être intégrés aux systèmes existants, sans créer de progression ou de menus redondants. Ils restent planifiés jusqu'à leur implémentation et validation.

### 32.1 Maîtrise individuelle des armes — système fusionné
- Créer un seul système cohérent de maîtrise propre à chaque arme, qui regroupe la progression de maîtrise déjà évoquée pour les armes et les déblocages cosmétiques/sonores associés. Ne pas créer deux systèmes parallèles.
- Faire progresser la maîtrise par l'utilisation réelle et variée de l'arme en partie : éliminations confirmées, assists pertinentes, précision, maîtrise du recul, objectifs ou autres contributions vérifiables selon l'arme. Ne pas récompenser uniquement le farming d'éliminations.
- Proposer des niveaux de maîtrise, défis progressifs, insignes et éléments de présentation qui montrent l'expérience acquise avec chaque arme.
- Débloquer uniquement des récompenses non compétitives : camouflages, apparences, emblèmes, éléments de profil et variantes purement cosmétiques des sons de tir ou de confirmation d'impact déjà prévus à la section 26.
- Conserver un son de base de grande qualité pour chaque arme dès le départ. Les variantes déblocables ne doivent jamais être plus audibles, plus précises, plus rapides ou transmettre une information supplémentaire ; elles doivent conserver une durée, une lisibilité et un niveau sonore comparables.
- N'accorder aucun bonus de dégâts, cadence, recul, précision, portée, vitesse de rechargement, assistance à la visée ou autre avantage de gameplay via la maîtrise.
- Calculer et valider la progression à partir d'événements de partie fiables côté serveur lorsque le mode le permet. Définir des plafonds, conditions et protections contre le farming entre amis, bots, comptes secondaires ou actions répétées artificiellement.
- Séparer clairement les résultats des modes officiels, communautaires, expérimentaux et hors ligne. Les règles de conversion de progression doivent être transparentes ; ne pas convertir automatiquement les résultats hors ligne en progression officielle.
- Afficher les défis, la progression et les récompenses de manière claire dans l'armurerie, sans multiplier les menus. Prévoir une consultation des critères et un historique des déblocages.
- Garder toutes les récompenses accessibles gratuitement par le jeu ; aucun achat ne doit accélérer la maîtrise ni donner un avantage compétitif.

### 32.2 Calibration avancée et personnalisation des commandes
- Compléter le remappage des touches déjà prévu par des réglages précis et cohérents pour clavier/souris, manette et commandes tactiles si cette plateforme est développée.
- Pour les sticks, proposer notamment zones mortes intérieure/extérieure lorsque pertinent, courbes de réponse, accélération/décélération et sensibilité horizontale/verticale.
- Pour la souris, proposer sensibilité, sensibilité en visée, éventuel multiplicateur par lunette si le jeu utilise plusieurs niveaux de zoom, et options de lissage/désactivation du lissage clairement expliquées.
- Permettre de régler séparément sensibilité générale, visée, caméra et commandes de déplacement lorsque cela a un sens, sans introduire de réglages contradictoires.
- Fournir un aperçu immédiat, des valeurs par défaut recommandées, des préréglages, une restauration individuelle ou globale et une vérification des conflits de touches.
- Ajouter des exercices dans le stand de tir pour comparer les réglages : suivi de cibles mobiles, changements de cible, contrôle du recul et rotations. Ne pas imposer un réglage considéré comme universellement optimal.
- Enregistrer les paramètres par périphérique et, si possible, par plateforme/compte, avec synchronisation contrôlée et résolution explicite des conflits entre appareils.
- Ne pas confondre calibration des commandes et assistance à la visée. Aucun réglage ne doit fournir une information cachée, modifier les hitboxes ou contourner les règles d'équité du cross-play.
- Tester les valeurs sur les périphériques réellement pris en charge et proposer un comportement de secours si une option n'est pas compatible.

### 32.3 Défis communautaires collectifs
- Ajouter des objectifs mondiaux facultatifs auxquels l'ensemble de la communauté peut contribuer : nombre d'objectifs capturés, soutien apporté, parties terminées, défis coopératifs ou autres actions positives vérifiables.
- Organiser les défis par périodes clairement annoncées, avec objectifs, durée, progression collective et conditions de réussite visibles en jeu.
- Prévoir des paliers intermédiaires afin que les joueurs voient l'effet de leur contribution même si l'objectif final n'est pas atteint.
- Récompenser la participation par des éléments gratuits et non compétitifs : emblèmes, titres, éléments de profil ou cosmétiques. Aucun bonus de statistiques, d'expérience compétitive, d'arme ou d'accès prioritaire ne doit être accordé.
- Éviter que les défis encouragent le sabotage, le farming, l'abandon de partie, les éliminations répétées entre complices ou la concentration excessive sur une action au détriment de l'objectif du match.
- Définir des critères d'éligibilité simples et transparents, des plafonds de contribution et des contrôles anti-bots/anti-collusion ; seules les actions réellement validées doivent compter.
- Ne pas désavantager les nouveaux joueurs, les joueurs occasionnels ou les régions à faible population. Adapter les objectifs à la population réelle et permettre une contribution raisonnable sans obligation de connexion quotidienne.
- Publier les résultats et récompenses de manière transparente, conserver un historique des événements et expliquer les règles de calcul.
- Ne pas exiger d'achat, de paiement, de connexion à une heure précise ou de partage de données personnelles pour participer.
- Utiliser les outils communautaires et de progression existants ; ne pas créer un service payant ni retarder la première build jouable.

### Priorités et critères communs
- Intégrer 32.1 à l'armurerie, au système de sons d'armes de la section 26 et à la progression existante ; un seul système de maîtrise par arme.
- Ajouter 32.2 aux paramètres de commandes et au stand de tir, puis tester chaque périphérique réellement supporté.
- Développer 32.3 après stabilisation des comptes, de la progression, des statistiques et de l'anti-triche.
- Toute progression et toute récompense doivent respecter l'équité, la confidentialité, les règles anti-farming et le budget de 0 €.
- Ne pas retarder la première build jouable pour ces fonctionnalités ; les livrer progressivement après validation du socle gameplay et réseau.


## 33. Destruction tactique, lancer de grenades, audio spatial et approfondissement du combat — huit ajouts approuvés le 19 novembre 2026

Les huit idées suivantes sont approuvées et ajoutées au cahier des charges. Elles restent planifiées tant qu'elles ne sont pas implémentées, testées et validées sur une build réelle. Elles ne doivent pas retarder la première build jouable ni compromettre l'équilibre compétitif, la lisibilité ou les performances.

### 33.1 Destruction tactique limitée des décors
- Autoriser la destruction de certains éléments de couverture clairement identifiés : panneaux, cloisons légères, barricades, portes ou ouvertures prévues par le level design.
- Limiter strictement la destruction à des éléments sélectionnés et testés ; aucune destruction libre ou totale de la carte.
- Concevoir chaque élément destructible avec une fonction tactique et des contreparties : créer une ouverture peut améliorer une ligne de tir mais aussi exposer le joueur.
- Garantir que les destructions ne condamnent pas une équipe, ne rendent pas un objectif inaccessible et ne créent pas de position dominante impossible à contrer.
- Synchroniser l'état, la collision et les dégâts de ces éléments sous autorité serveur. Tous les clients et bots doivent observer le même état.
- Prévoir des états visuels/collision simples et déterministes, une réplication limitée et des budgets CPU, GPU, mémoire et réseau.
- Commencer par un prototype sur une seule carte et un petit nombre d'éléments ; désactiver la mécanique dans les modes où elle nuit à l'équité.
- Distinguer cette destruction provoquée par les joueurs des événements environnementaux prédéfinis de la section 3.

### 33.2 Lancer de grenades à puissance variable
- Permettre plusieurs intensités de lancer selon la durée d'appui ou une commande clairement indiquée : lancer court, moyen et puissant.
- Étudier un lancer au sol/roulé pour faire passer une grenade sous certains obstacles ou dans un espace bas, uniquement lorsque la géométrie et les règles du mode le permettent.
- Assurer des trajectoires, rebonds, vitesses, fuseaux et dégâts cohérents, reproductibles et validés côté serveur.
- Afficher une indication discrète et lisible de la puissance choisie ; éviter une interface qui masque les adversaires ou l'action.
- Prévoir des limites pour empêcher les lancers impossibles, les traversées de géométrie et les abus de physique.
- Conserver des commandes accessibles et configurables sur les périphériques pris en charge ; proposer une méthode alternative si l'appui prolongé n'est pas adapté.
- Tester les distances, rebonds, dégâts et contre-mesures sur chaque carte ; ne pas rendre les grenades indispensables ni excessivement dominantes.
- Pour les grenades compatibles, permettre une temporisation volontaire avant le lancer (« cuisson ») : le décompte commence au moment cohérent avec le fonctionnement de l'équipement, par exemple le retrait de la sécurité ou l'activation de la fusée.
- Définir une durée de fusée fiable et identique pour tous les joueurs ; afficher un retour sonore/visuel discret et compréhensible sans fournir une précision artificielle.
- La durée restante est gérée par le serveur et continue pendant le lancer, les rebonds et les déplacements ; aucune pause, réinitialisation ou duplication de fusée ne doit être possible.
- Autoriser l'explosion avant le lancer si le joueur attend trop longtemps, avec les risques normaux pour lui-même, et pour ses alliés uniquement dans les modes où le tir ami est explicitement activé (dans les modes officiels standards, la règle de la section 34.2 s'applique : aucun dégât allié) ; ne pas garantir un lancer à la dernière fraction de seconde.
- Réserver cette mécanique aux types de grenades dont le fonctionnement le justifie ; elle ne doit pas être appliquée automatiquement à tous les équipements explosifs.
- Pour les grenades compatibles, permettre à un joueur de tenter de les repousser ou de les renvoyer vers leur zone d'origine lorsqu'elles sont encore accessibles et suffisamment éloignées de leur explosion.
- Définir une fenêtre d'interaction courte, une portée et une animation dédiées ; l'action doit être volontaire, lisible et exposer le joueur à un risque réel pendant son exécution.
- Ne pas permettre de renvoyer une grenade déjà explosée, inaccessible, derrière un obstacle ou trop proche de sa détonation ; la cuisson et le temps de fusée restent continus et sous autorité serveur.
- Le renvoi ne doit ni réinitialiser la fusée, ni modifier artificiellement les dégâts, ni garantir que la grenade atteigne un adversaire ; conserver une trajectoire physique cohérente et un contre-jeu possible.
- Limiter cette interaction aux types de grenades dont la forme et le fonctionnement la rendent plausible ; désactiver ou adapter la mécanique dans les modes où elle déséquilibrerait les affrontements.

### 33.3 Audio spatial intelligent
- Améliorer la spatialisation des tirs, pas, rechargements, explosions et autres sons utiles selon la distance, la direction, les obstacles, les portes, les étages et les matériaux.
- Appliquer une occlusion et une atténuation cohérentes lorsqu'un mur, une porte ou un obstacle sépare la source du joueur ; éviter qu'un son traverse artificiellement plusieurs surfaces.
- Différencier les matériaux et les espaces lorsque cela apporte une information sonore naturelle et compréhensible.
- Gérer le masquage sonore : explosions et tirs proches peuvent temporairement rendre certains sons moins perceptibles, sans supprimer arbitrairement les indices essentiels.
- Ne jamais amplifier artificiellement un son pour révéler une position qui ne devrait pas être audible, ni donner à un joueur une information cachée.
- Garantir des résultats cohérents entre joueurs, limiter les variations liées au matériel et proposer des réglages d'accessibilité/volume compatibles avec les options audio existantes.
- Tester au casque, sur haut-parleurs et avec différents réglages ; préserver la lisibilité des sons de gameplay sans rendre le mixage fatigant.

### 33.4 Rechargement naturel et cohérent
- Définir précisément les phases de rechargement : début, retrait/éjection, insertion, remise en état de tir et fin de l'animation.
- Pour les armes compatibles, permettre l'interruption à des moments cohérents par un tir, un sprint ou une autre action prioritaire, sans autoriser de duplication de munitions ni de rechargement instantané.
- Distinguer le rechargement tactique (conserver les cartouches restantes lorsque le type d'arme le permet) du rechargement complet après chargeur vide.
- Déterminer côté serveur le moment exact où les munitions sont consommées ou réattribuées ; l'animation client ne doit jamais faire autorité sur les munitions.
- Adapter les règles aux mécanismes réels de chaque famille d'armes, sans imposer une animation ou une logique identique à tout l'arsenal.
- Garder les interruptions prévisibles et équitables en réseau, y compris avec latence, prédiction et correction ; éviter les états où l'arme semble prête mais ne peut pas tirer.
- Tester les transitions, annulations, changements d'arme, morts, déconnexions et corrections réseau.

### 33.5 Impacts environnementaux persistants et temporaires
- Afficher des traces de balles, éclats, impacts et marques sur les surfaces ; permettre à certains vitrages de se fissurer ou de se briser lorsque cela est prévu par la carte.
- Définir une durée de persistance et des limites de quantité par zone, joueur et partie ; supprimer proprement les traces les plus anciennes lorsque les budgets sont atteints.
- Distinguer les effets purement visuels des éléments qui modifient réellement la géométrie ou la collision. Toute modification fonctionnelle doit être prévue au level design et validée/synchronisée par le serveur.
- Ne jamais permettre aux impacts ou aux vitrages de créer une information tactique supplémentaire, une obstruction injuste ou un avantage graphique réservé à une configuration.
- Répliquer uniquement les événements nécessaires ; privilégier des effets locaux déterministes lorsque l'état partagé n'a pas d'incidence sur le gameplay.
- Préserver les performances sur les configurations modestes grâce à des budgets GPU, CPU, mémoire et réseau, des niveaux de détail et une désactivation contrôlée des effets secondaires.
- Vérifier que les effets ne masquent pas les silhouettes, projectiles, objectifs ou indices visuels importants.
- Ajouter, lorsque cela est pertinent, les douilles éjectées et quelques effets résiduels légers (poussière retombante, fumée qui se dissipe ou petites projections), avec une durée de vie courte et des limites strictes.
- Distinguer les effets purement décoratifs des éléments qui modifient réellement la géométrie ou la collision ; les effets décoratifs ne doivent pas révéler d'information tactique supplémentaire.
- Réduire ou désactiver automatiquement les effets secondaires selon la charge matérielle et proposer un réglage de densité, sans masquer les silhouettes, projectiles ou objectifs.
- Permettre une personnalisation purement cosmétique des effets visuels de tir : variantes de flash de bouche, apparence des traînées visibles, étincelles d'impact et apparence des douilles lorsque ces effets existent.
- Les variantes doivent rester lisibles, discrètes et équivalentes en durée, intensité utile et visibilité ; elles ne doivent jamais masquer une silhouette, modifier la visibilité d'un projectile, révéler une position autrement cachée ou changer les performances de gameplay.
- Distinguer les effets locaux cosmétiques des événements d'impact confirmés et des effets partagés ; le client ne peut pas modifier les résultats de tir ni déclencher un effet donnant une information non validée par le serveur.
- Prévoir des options de densité, de désactivation et des réglages d'accessibilité ; les effets cosmétiques doivent respecter les budgets de performances et les paramètres graphiques communs.

### 33.6 Dégâts par zone corporelle
- Étudier des multiplicateurs de dégâts distincts pour les zones corporelles pertinentes (tête, torse, bras et jambes), définis arme par arme et mode par mode si nécessaire.
- Garder des règles simples, documentées et testables ; ne pas multiplier les zones au point de rendre les combats opaques ou imprévisibles.
- Faire dépendre les dégâts de la zone réellement touchée, déterminée et validée par le serveur à partir des traces de tir et des hitboxes autorisées.
- Éviter qu'une zone difficile à atteindre ou une différence de modèle/animation donne un avantage involontaire ; vérifier les hitboxes sur toutes les silhouettes et animations.
- Afficher des retours de hit clairs et cohérents sans révéler d'informations cachées ni permettre au client de décider de ses propres dégâts.
- Mesurer le temps pour éliminer, la fréquence des tirs à la tête, la répartition des zones touchées et l'écart entre armes ; équilibrer pour préserver la viabilité des différentes armes et périphériques.
- Ne pas rendre les bras ou jambes artificiellement punitifs ; toute différence doit avoir une justification de gameplay et être expliquée dans le laboratoire d'armes.
- Tester les impacts sur clavier/souris, manette et autres périphériques pris en charge, ainsi que sur les modes classiques et les playlists Chaos.

### 33.7 Configurations alternatives prédéfinies des cartes
- Préparer, si les tests le justifient, deux ou trois configurations prédéfinies pour certaines cartes : ouvertures différentes, couvertures déplacées, accès alternatifs ou obstacles activés/désactivés.
- Choisir la configuration entre les parties, jamais de manière imprévisible au milieu d'un duel ; annoncer clairement la variante avant le lancement.
- Conserver les mêmes principes d'équilibrage : itinéraires de contre-attaque, distances courte/moyenne/longue, accès aux objectifs et possibilités de rotation.
- Empêcher qu'une variante transforme une zone en position de camping dominante ou supprime une voie de réponse à une équipe.
- Synchroniser le choix de configuration et tous les éléments concernés (géométrie, collision, navigation des bots, points d'apparition, objectifs et réplication) avant le début de la manche.
- Identifier clairement la variante dans le lobby, les informations de carte, les replays et les statistiques afin de comparer des configurations équivalentes.
- Garder un nombre maximal de trois cartes au lancement ; les variantes servent à diversifier les cartes existantes, pas à augmenter artificiellement le nombre de cartes.
- Ne publier une variante dans les playlists officielles qu'après tests de navigation, de performance, de spawn et d'équilibre sur les deux équipes.

### 33.8 Grenade adhésive
- Ajouter une grenade adhésive (« grenade collante ») capable de se fixer aux surfaces compatibles — murs, plafonds et certains objets — au point d'impact, avant sa détonation selon une temporisation définie.
- Définir précisément les surfaces autorisées, le comportement en cas d'impact sur un joueur ou un objet mobile, ainsi que les règles de rebond ou de chute lorsque l'adhérence n'est pas possible ; ne jamais permettre de traverser la géométrie.
- Conserver un délai de détonation lisible et cohérent ; la fusée reste continue et validée par le serveur. Le joueur qui la lance ne peut pas la récupérer ni la réinitialiser après fixation.
- Prévoir un contre-jeu proportionné : signal visuel/sonore perceptible, possibilité de s'éloigner ou de quitter la zone menacée, et éventuelle neutralisation uniquement si elle est testée et équilibrée.
- Limiter le nombre transporté et les conditions de réapprovisionnement ; tester les interactions avec cuisson, renvoi des grenades, dégâts, physique, latence et collisions en multijoueur.
- Traiter cette grenade comme un équipement distinct, facultatif et non systématiquement supérieur aux grenades classiques ; vérifier son équilibre sur chaque carte et dans chaque mode compatible.

### Priorités et critères communs
- Ne pas développer les huit systèmes simultanément. Priorité à la fiabilité du tir, des dégâts, du rechargement et de la réplication avant les effets visuels avancés.
- Prototyper d'abord 33.4 et 33.6 dans un environnement de test, puis 33.2 et 33.3 ; n'ajouter 33.8 qu'une fois la cuisson et le renvoi de 33.2 validés ; évaluer 33.1 et 33.7 sur une carte pilote avant toute extension.
- Ajouter 33.5 progressivement avec des budgets stricts et une option de réduction des effets secondaires.
- Toute fonctionnalité affectant la collision, les dégâts, les munitions, la géométrie ou les règles doit être autoritaire côté serveur et couverte par des tests de non-régression.
- Ne pas modifier les règles d'un mode sans l'indiquer ; certaines fonctionnalités peuvent être limitées à des modes si les tests montrent un risque pour l'équilibre.
- Conserver la priorité de livraison : audit/licences/sécurité, build jouable, stabilité combat et réseau, puis extensions.
- Respecter le budget de 0 € ; aucun plugin, asset, outil, hébergement ou service payant sans accord explicite.


## 34. Sélection compétitive et circulation sans blocage entre alliés — deux décisions approuvées le 19 novembre 2026

Cette section formalise le veto compétitif approuvé et la règle de circulation entre coéquipiers précisée par le propriétaire. Ces systèmes restent planifiés jusqu'à leur implémentation et validation en jeu.

### 34.1 Veto des cartes et équipements en compétitif
- Prévoir une phase de sélection/bannissement pour les playlists compétitives organisées qui l'activent.
- Permettre aux équipes de bannir alternativement des cartes parmi une sélection annoncée avant la procédure.
- Autoriser, uniquement dans les formats qui le prévoient, le bannissement de certaines armes ou catégories d'équipements ; publier à l'avance la liste éligible et les restrictions.
- Définir un ordre alterné, des délais raisonnables, une résolution automatique en cas d'absence de choix et une présentation identique pour les deux équipes.
- Afficher la sélection, les choix déjà effectués, les options restantes et la carte/les règles finales avant le lancement.
- Éviter les choix impossibles : conserver un nombre suffisant de cartes et d'équipements disponibles et prévoir une solution de secours déterministe.
- Ne pas imposer cette procédure au matchmaking public classique ; elle doit être réservée aux playlists compétitives, parties privées ou formats organisés compatibles.
- Enregistrer le résultat du veto dans les données de partie et les replays afin que les statistiques comparent des configurations équivalentes.
- Tester les abandons, déconnexions, égalités, délais expirés et désaccords de version ; ne pas permettre de modifier la sélection après le début de la partie.

### 34.2 Circulation entre alliés : non-collision de gameplay façon XDefiant, The Finals et Call of Duty
- Viser le ressenti pratique observé dans XDefiant, The Finals et Call of Duty : les coéquipiers ne doivent pas se bloquer physiquement et doivent pouvoir se croiser naturellement, y compris dans les portes, couloirs, escaliers et zones d'objectif. Il s'agit de reproduire le résultat de gameplay attendu, pas de copier une implémentation propriétaire.
- Désactiver les collisions de déplacement bloquantes entre capsules alliées. La collision allié-allié ne doit jamais arrêter, ralentir, repousser, dévier ou immobiliser le mouvement d'un joueur.
- Ne pas utiliser de séparation physique, de répulsion ou de correction de position qui recrée indirectement du body-block. Aucun mur invisible, aucune file d'attente forcée et aucune téléportation pour dégager un passage.
- Accepter une superposition visuelle temporaire entre alliés si nécessaire à la fluidité. Tout éventuel ajustement visuel doit rester strictement cosmétique : il ne doit modifier ni la position de gameplay, ni la trajectoire, ni la vitesse, ni la visée, ni les collisions.
- Les alliés peuvent se traverser sans friction ni blocage. Dans les modes officiels standards, les tirs, projectiles, explosions et effets alliés ne doivent pas blesser ou tuer les coéquipiers ; aucune exception par défaut.
- Les ennemis conservent les collisions et interactions normales prévues par le mode : un joueur ne traverse pas un adversaire et ne bénéficie d'aucune protection supplémentaire contre ses tirs.
- Assurer un comportement identique côté serveur et client : règles de collision explicites, autorité serveur sur les interactions, prédiction client sans blocage local et corrections réseau discrètes. Vérifier que les capsules, traces d'armes, projectiles et interactions avec le décor ne réintroduisent pas de blocage indirect.
- Tester les croisements simultanés à plusieurs joueurs, portes étroites, couloirs, escaliers, objectifs, apparitions, sauts, sprint, glissades éventuelles et connexions à latence élevée.
- Critères d'acceptation : aucun allié ne peut empêcher physiquement un autre allié d'avancer ; aucune répulsion forcée ni déviation de gameplay ; les ennemis et le décor restent correctement bloquants ; tirs amis désactivés dans les modes standards.
- Commencer par un prototype multijoueur dans une carte de test, puis vérifier les cas limites avant généralisation à toutes les cartes et tous les modes.
### Priorités et critères communs
- Prototyper la circulation alliée avec plusieurs personnages dans des couloirs étroits avant de l'étendre à toutes les cartes.
- Vérifier que le système ne crée ni body block, ni superposition exacte, ni déplacement forcé, ni avantage défensif artificiel.
- Développer le veto après stabilisation des playlists compétitives, du système de groupes et de la sélection de cartes.
- Conserver le matchmaking public simple et rapide ; ne pas retarder la première build jouable.
- Respecter le budget de 0 € et ne pas ajouter de dépendance payante sans accord explicite.

## 35. Améliorations supplémentaires du rythme et de la qualité des parties

### 35.1 Protection anti-spawn-trap et réévaluation des apparitions
- Détecter les situations où un joueur ou une équipe est éliminé à répétition très peu de temps après sa réapparition, en particulier lorsque plusieurs adversaires contrôlent les sorties ou les lignes de vue.
- Exploiter les données déjà prévues par le système d'apparitions intelligentes : proximité des ennemis, lignes de vue, pression autour des points, morts récentes, sécurité des sorties et historique des apparitions.
- Réévaluer immédiatement les points disponibles et choisir automatiquement une zone plus sûre lorsqu'une apparition devient manifestement piégée.
- Ne pas rendre les joueurs invulnérables de façon abusive, ne pas téléporter un joueur après son apparition et ne pas révéler les positions ennemies.
- Prévoir des protections contre les abus : un joueur ne doit pas pouvoir provoquer artificiellement un changement de spawn pour exploiter le système.
- Mesurer les éliminations dans les premières secondes après apparition, les répétitions par zone, les apparitions annulées et les déséquilibres créés ; tester sur chaque carte et chaque mode concerné.
- Cette fonction complète le système d'apparitions intelligentes déjà prévu ; elle ne doit pas créer un second système indépendant.

### 35.2 Revanche immédiate et continuité des équipes
- À la fin d'une partie publique compatible, proposer automatiquement une continuité entre les deux équipes afin qu'elles puissent enchaîner sur une revanche sans devoir reformer un groupe ou relancer une recherche complète.
- Conserver autant que possible les équipes et les joueurs qui souhaitent rester, dans l'esprit des lobbies persistants des anciens FPS.
- Permettre une rotation vers une autre carte ou un autre mode selon la playlist, tout en gardant l'option d'une revanche sur la même carte lorsque les règles le permettent.
- Afficher clairement qui reste, qui quitte et qui rejoint ; remplacer les départs par le backfill prévu, sans bloquer indéfiniment le lancement.
- Respecter les choix de départ, les groupes préformés, les préférences de matchmaking et les règles de population. Ne jamais retenir un joueur contre son gré.
- Éviter que la continuité ne fige le matchmaking : si les équipes deviennent trop déséquilibrées ou si la qualité réseau se dégrade, appliquer les règles transparentes de rééquilibrage déjà prévues.
- Garder cette continuité facultative et compatible avec les playlists ; ne pas imposer la conservation des équipes en classé si les règles compétitives l'interdisent.

### 35.3 Protection contre les connexions instables
- Surveiller, lorsque les données sont disponibles, le ping, le jitter, les pertes de paquets, les variations brutales de latence et les désynchronisations pour chaque joueur.
- Distinguer la latence réseau de la latence locale d'entrée/rendu et des ralentissements CPU/GPU ; ne pas présenter le FPS comme une mesure du ping.
- Afficher des indicateurs compréhensibles et des avertissements utiles au joueur, sans exposer son adresse IP ni sa localisation précise.
- Utiliser la qualité de connexion comme un facteur explicable du matchmaking et du choix de région, avec un compromis transparent entre attente, niveau et stabilité.
- Détecter les dégradations temporaires pour éviter les décisions injustes fondées sur une seule mesure ; utiliser des fenêtres de mesure et des seuils validés par les tests.
- Ne jamais modifier artificiellement les dégâts, les hitboxes, la cadence, le recul ou les règles de combat pour compenser une mauvaise connexion.
- Compléter les outils de diagnostic réseau et de désynchronisation déjà prévus ; ne pas créer de systèmes redondants.
- Tester les scénarios de pertes de paquets, jitter, pics de ping, reconnexion et hôte instable. Documenter les limites du listen server et ne pas présenter ces protections comme un remplacement d'une architecture serveur compétitive.
- Respecter le budget de 0 € : aucun service payant ni hébergement supplémentaire sans accord explicite.


## 36. Informations de combat, continuité des groupes et progression personnelle — quatre décisions approuvées le 19 novembre 2026

### 36.1 Récapitulatif détaillé après une élimination
- Après la mort du joueur, présenter un récapitulatif clair de l'élimination : adversaire responsable lorsque connu, arme utilisée, chronologie des impacts, dégâts reçus, répartition par zone corporelle si cette fonction est activée et distance estimée lorsque la mesure est fiable.
- Distinguer les dégâts directs, dégâts de zone et éventuels dégâts déjà reçus d'autres adversaires ; ne pas attribuer à tort toute l'élimination à un seul joueur.
- Afficher uniquement les données de combat réellement enregistrées et validées par le serveur ; signaler les valeurs estimées ou indisponibles plutôt que d'inventer une précision.
- Permettre de fermer ou passer rapidement le récapitulatif pour ne pas ralentir la réapparition.
- Ne pas révéler à un joueur ou à son équipe des positions ennemies qui ne seraient pas normalement connues ; ne pas transformer l'écran de mort en outil de repérage.
- Garder une présentation lisible, concise et cohérente avec les règles de chaque mode.

### 36.2 Transfert automatique du chef de groupe
- Si le chef d'un groupe quitte, se déconnecte durablement ou perd sa session, transférer automatiquement le rôle à un membre éligible encore présent.
- Choisir le successeur selon une règle stable et annoncée, par exemple ancienneté dans le groupe ou disponibilité de session ; éviter une élection confuse à chaque micro-coupure.
- Conserver les membres, invitations, paramètres de groupe et recherche de partie autant que possible ; notifier clairement le changement de chef.
- Si le chef revient, ne pas lui reprendre automatiquement le rôle : le groupe doit rester stable, avec possibilité de transfert volontaire.
- Gérer les cas où le groupe est en file d'attente, dans un lobby, en partie ou en transition ; ne pas confondre ce transfert de responsabilité sociale avec la migration de l'hôte réseau de la partie, déjà spécifiée séparément.
- Prévoir une protection contre les transferts en boucle, les comptes inactifs et les sessions expirées.

### 36.3 Caméra de mort courte
- Dans les modes compatibles, proposer une séquence courte et passable montrant les derniers instants ayant conduit à l'élimination, reconstruite à partir des événements de partie et des données de simulation disponibles.
- Utiliser une reconstruction cohérente avec le serveur ; afficher clairement toute limite ou approximation liée à la reconstruction et à la latence.
- Ne jamais transmettre cette vue aux coéquipiers encore vivants et ne jamais révéler au joueur des informations cachées qu'il pourrait exploiter pour communiquer pendant la partie.
- Permettre de passer la séquence immédiatement et désactiver la fonction dans les modes où elle nuit au rythme ou à l'équité.
- Ne pas enregistrer de vidéo complète en continu : réutiliser les événements nécessaires au système de replay déjà prévu, avec durée de conservation et confidentialité cohérentes.
- Prévoir des protections contre les abus, notamment l'utilisation de la caméra pour identifier des positions, des stratégies ou des joueurs hors du champ de connaissance légitime.

### 36.4 Comparaison des performances avec son propre historique
- À la fin d'une partie, comparer les performances du joueur à ses propres références récentes : éliminations, morts, assists, précision, contribution aux objectifs, soutien et performances par arme, uniquement lorsque les données sont suffisamment fiables.
- Présenter les tendances sur plusieurs parties plutôt que tirer des conclusions d'un seul match ; distinguer les changements de mode, carte, arme et durée de partie.
- Mettre en avant des axes de progression concrets sans imposer de comparaison publique, de classement humiliant ou de pression artificielle.
- Permettre de consulter et filtrer son historique, avec des options de confidentialité et de suppression/export lorsque l'architecture du compte le permet.
- Ne pas modifier le matchmaking, le niveau caché ou l'équilibrage sur la seule base de ces indicateurs personnels.
- Séparer les statistiques officielles validées par le serveur des données locales d'entraînement hors ligne.

### Priorités et critères communs
- Développer d'abord le récapitulatif après élimination et le transfert du chef de groupe, une fois les données serveur et les sessions de groupe stabilisées.
- Ajouter ensuite la caméra de mort courte seulement si la reconstruction est fiable, rapide et sans fuite d'information ; réutiliser l'architecture de replay plutôt que créer un enregistreur parallèle.
- Ajouter la comparaison personnelle après validation de la qualité des statistiques et de l'historique.
- Toutes ces fonctions restent subordonnées à la build jouable, à la stabilité réseau, à la sécurité et au budget de 0 €. Aucun service payant sans accord explicite.


## 37. Signature de gameplay personnelle — décision approuvée le 19 novembre 2026

### 37.1 Identité de jeu évolutive
- Construire pour chaque joueur une signature de gameplay descriptive, calculée à partir de ses performances réelles sur plusieurs parties : tendances offensives/défensives, soutien, jeu d'objectif, polyvalence, distances d'engagement et préférences d'armes.
- Présenter cette signature comme un portrait évolutif et nuancé, et non comme une classe, un rôle imposé, un niveau caché ou une étiquette définitive.
- Déduire les tendances à partir d'un volume suffisant de parties comparables ; afficher un indicateur de fiabilité ou attendre avant de conclure lorsque les données sont insuffisantes.
- Distinguer les habitudes par mode, carte et contexte afin de ne pas qualifier un joueur sur la base d'une seule partie ou d'un mode particulier.
- Autoriser le joueur à consulter son profil, son évolution et les facteurs ayant contribué à chaque tendance ; permettre de masquer ou de limiter le partage public de cette signature.
- Ne pas attribuer de bonus, malus, compétences, armes, matchmaking ou restrictions selon cette signature. Elle ne doit pas pénaliser les joueurs polyvalents, les changements de style ou les parties jouées avec des amis.
- Utiliser des statistiques validées par le serveur pour les parties officielles ; séparer les données d'entraînement hors ligne et les parties communautaires si leurs règles diffèrent.
- Protéger les données personnelles : ne pas inférer de traits sensibles, ne pas exposer de données individuelles non nécessaires et respecter les paramètres de confidentialité du compte.
- Prévoir une présentation compréhensible, traduisible et accessible, avec des catégories explicables plutôt qu'un score opaque unique.

### Priorités et critères de validation
- Commencer par un prototype descriptif basé sur les statistiques déjà prévues, sans créer une nouvelle infrastructure de télémétrie coûteuse.
- Vérifier que les résultats sont stables sur plusieurs parties, explicables, non manipulables facilement et ne favorisent pas artificiellement un style de jeu.
- Ne pas retarder la build jouable, la stabilité réseau, la sécurité ou les fonctionnalités essentielles ; budget de 0 €, aucun service payant sans accord explicite.

## 38. Rivalités, intégrité vérifiable et laboratoire communautaire — trois décisions approuvées le 19 novembre 2026

### 38.1 Rivalités personnelles
- Proposer, lorsque les joueurs se sont affrontés à plusieurs reprises, un historique facultatif de leurs confrontations : nombre de rencontres, victoires/défaites, éliminations, assists et autres statistiques pertinentes disponibles.
- Présenter les résultats avec leur contexte (mode, période, nombre de rencontres) et éviter les conclusions définitives à partir d'un échantillon trop faible.
- Ne pas créer de classement public humiliant, de notification provocatrice ou de mécanisme encourageant le harcèlement ; ne pas exposer les données privées d'un joueur.
- Permettre à chaque joueur de désactiver l'affichage de ses rivalités ou de limiter leur visibilité ; respecter blocage, confidentialité et modération déjà prévus.
- Ne donner aucun bonus, malus, priorité de matchmaking ou information tactique selon l'existence d'une rivalité.
- Calculer les statistiques à partir des résultats officiels validés ; séparer les parties hors ligne, entraînements et expériences communautaires si leurs règles diffèrent.
- Garder cette fonction légère et facultative, sans ralentir le lobby, la recherche de partie ou l'accès aux statistiques principales.

### 38.2 Rapport d'intégrité après chaque partie
- Fournir, lorsque les données techniques le permettent, un rapport synthétique après la partie indiquant les contrôles d'intégrité effectivement exécutés, les incidents techniques détectés et le statut du résultat (validé, en attente d'examen, invalidé ou indisponible).
- Distinguer clairement les contrôles réalisés des contrôles impossibles ou non disponibles ; ne jamais afficher une certification absolue ni garantir qu'aucune triche n'a eu lieu.
- Résumer les événements pertinents sans révéler les méthodes sensibles de détection, les seuils internes, les données personnelles ou les informations qui faciliteraient le contournement de l'anti-triche.
- Séparer une anomalie réseau ou un incident technique d'une suspicion de triche ; une suspicion seule ne doit pas entraîner automatiquement une sanction grave ni l'invalidation définitive d'un résultat.
- Permettre un examen complémentaire, une contestation et une correction/annulation du résultat selon les procédures et preuves déjà prévues.
- Conserver une traçabilité proportionnée et sécurisée des décisions, avec accès limité, durée de conservation définie et respect de la confidentialité.
- En cas de panne ou d'indisponibilité des contrôles, afficher explicitement que le statut ne peut pas être certifié ; ne pas présenter une absence de données comme une preuve d'intégrité.
- Réutiliser les mécanismes serveur, anti-triche, diagnostic réseau et réparation des parties déjà spécifiés, sans créer de systèmes redondants.

### 38.3 Laboratoire communautaire de règles expérimentales
- Créer un espace facultatif où les joueurs peuvent tester des variantes de règles avant toute éventuelle adoption officielle : durée, score, rythme de réapparition, paramètres d'armes autorisés ou autres réglages validés par l'équipe.
- Identifier clairement chaque expérience comme expérimentale, avec sa version, ses règles, sa période de test et les changements par rapport au mode de référence.
- Isoler les statistiques, récompenses et classements expérimentaux des statistiques, récompenses et classements officiels ; aucune progression compétitive officielle ne doit être accordée sur la base de règles expérimentales non validées.
- Recueillir des retours contextualisés et des données agrégées ; protéger le laboratoire contre le spam, la manipulation des votes, le farming et les groupes cherchant à fausser les résultats.
- Ne jamais modifier automatiquement les modes officiels en fonction du nombre de votes ou de la popularité d'une variante : toute adoption doit passer par une analyse, des tests d'équilibrage, une validation technique et une annonce des changements.
- Permettre de retirer, corriger ou réinitialiser une expérience défectueuse ; afficher les limites et incidents connus.
- Réutiliser les outils de retours communautaires, de test et de validation déjà prévus, sans multiplier les infrastructures ni dépendre d'un service payant.
- Garder ce laboratoire séparé du matchmaking officiel et ne pas le rendre obligatoire pour accéder au jeu.

### Priorités et critères communs
- Commencer par un prototype simple du rapport d'intégrité, uniquement après stabilisation des validations serveur et des données de partie.
- Ajouter les rivalités personnelles ensuite, à partir des statistiques déjà disponibles et avec les contrôles de confidentialité.
- Ouvrir le laboratoire communautaire lorsque les modes officiels, les statistiques et les outils de modération sont suffisamment stables.
- Ces trois fonctions ne doivent jamais retarder la première build jouable, la correction de tout secret exposé dans le dépôt (sections 8 et 15), l'audit des licences, la stabilité réseau ou les fonctionnalités essentielles.

## 39. Choix du matchmaking, protection des débutants et recommandations entre joueurs — trois décisions approuvées le 19 novembre 2026

### 39.1 Préférence de matchmaking compréhensible et transparente
- Ajouter un choix simple dans les préférences de recherche de partie, avec trois profils clairement nommés :
  - **Ouvert** : privilégier la qualité de connexion et le temps d'attente ; l'équilibrage du niveau est moins strict, sans être abandonné au point de créer volontairement des parties injouables.
  - **Équilibré** : rechercher un compromis entre qualité de connexion, niveau estimé, composition des équipes et temps d'attente.
  - **Compétitif** : privilégier un équilibrage de niveau plus exigeant et une qualité de connexion suffisante, uniquement dans les playlists compatibles.
- Présenter ces choix avec des libellés courts, une phrase d'explication chacun et une indication claire de leurs effets. Éviter les termes techniques opaques, les curseurs complexes et les réglages cachés.
- Afficher le profil actuellement sélectionné avant de lancer la recherche et permettre de le modifier en quelques secondes, sans parcourir plusieurs menus.
- Expliquer simplement qu'un profil peut augmenter le temps d'attente ou réduire le nombre de parties disponibles ; ne jamais promettre un niveau d'adversaires, un ping ou un résultat précis.
- Respecter réellement la préférence choisie : ne pas annoncer un profil puis appliquer silencieusement un autre. Si une adaptation exceptionnelle est nécessaire pour éviter une attente excessive ou une file vide, demander l'accord du joueur ou afficher clairement la proposition avant de l'appliquer.
- Ne pas mélanger les règles du matchmaking classé et non classé ; le profil Ouvert ne doit pas contourner les conditions d'intégrité, de sécurité ou d'éligibilité d'une playlist.
- Préserver les groupes préformés et les règles de périphériques déjà prévues ; ne pas séparer les amis pour satisfaire artificiellement un profil.
- Mesurer la population disponible avant d'activer ces préférences afin d'éviter une fragmentation excessive des files. Si une préférence n'est pas viable dans une région ou à une heure donnée, expliquer clairement pourquoi et proposer une alternative sans l'imposer.
- Fournir une explication accessible des principaux facteurs de recherche, sans révéler les seuils internes sensibles de l'anti-triche ni les détails exploitables du système.
- Tester les trois profils avec des populations faibles et fortes, groupes mixtes, régions différentes, joueurs débutants et joueurs expérimentés. Vérifier que le choix produit une différence réelle et compréhensible.
- Cette préférence complète les paramètres de matchmaking déjà prévus ; elle ne crée pas trois files rigides permanentes si la population ne le permet pas.

### 39.2 Protection temporaire et progressive des nouveaux joueurs
- Proposer aux nouveaux comptes une phase de découverte facultative et limitée, destinée à leur permettre d'apprendre les bases sans être immédiatement confrontés de façon répétée à des adversaires beaucoup plus expérimentés.
- Pendant cette phase, privilégier des parties avec des joueurs ayant une expérience comparable, lorsque la population et la qualité de connexion le permettent.
- Utiliser les bots déjà prévus comme solution d'entraînement ou de remplissage clairement signalée ; ne jamais faire passer un bot pour un joueur humain.
- Faire évoluer progressivement la protection selon plusieurs indicateurs fiables (parties jouées, expérience réelle et incertitude de l'estimation), et non selon un simple nombre de kills ou une seule bonne partie.
- Autoriser le joueur à quitter la phase de découverte et à rejoindre les parties publiques normales ; expliquer simplement les conséquences de ce choix.
- Éviter qu'un joueur expérimenté puisse exploiter cette protection en créant de nouveaux comptes ou en jouant volontairement avec des débutants : surveiller les comportements manifestes d'abus avec prudence, sans sanction automatique sur simple suspicion.
- Ne pas enfermer les nouveaux joueurs dans une file peu peuplée, ne pas rallonger excessivement leur attente et ne pas leur imposer des adversaires artificiellement faciles.
- Ne pas accorder de progression, récompense ou statistique officielle artificielle ; les résultats restent soumis aux règles normales du mode et à la validation serveur.
- Ne pas modifier les dégâts, la précision, les hitboxes, le recul, la santé ou les règles de combat pour favoriser un débutant.
- Expliquer la protection dans le tutoriel et les paramètres avec un texte court ; ne pas afficher publiquement qu'un joueur est débutant.
- Évaluer cette fonction sur la rétention, la qualité des premières parties, l'attente et les écarts de niveau ; désactiver ou ajuster le système si les résultats sont injustes ou manipulables.

### 39.3 Recommandations positives entre joueurs
- À la fin d'une partie, permettre de remercier ou recommander facultativement un joueur pour un comportement observé : esprit d'équipe, soutien, défense d'objectif, communication utile ou fair-play.
- Proposer une interface très rapide, avec quelques catégories prédéfinies et un seul geste de validation ; ne pas imposer de texte libre ni ralentir le retour au lobby.
- Distinguer cette recommandation donnée par un joueur des distinctions automatiques de fin de partie déjà prévues dans le projet.
- Limiter le nombre de recommandations par joueur et par partie ; empêcher les envois répétés, échanges organisés, groupes de farming et manipulations de réputation.
- Ne donner aucun bonus d'expérience, monnaie, progression, avantage de matchmaking, rang ou récompense matérielle en échange des recommandations.
- Ne pas créer de note négative publique, de bouton de dénonciation parallèle ou de classement de popularité ; les signalements d'abus restent dans le système de modération séparé.
- Présenter éventuellement sur le profil des tendances agrégées et anonymisées, uniquement avec un volume suffisant, sans exposer qui a recommandé qui ni transformer ces indications en jugement définitif.
- Permettre de désactiver l'affichage ou la réception de ces recommandations et respecter les paramètres de confidentialité, blocages et règles de modération.
- Ne pas pénaliser les joueurs silencieux, solitaires, débutants ou utilisant les options d'accessibilité ; aucune recommandation ne doit être requise pour progresser.
- Tester la résistance au spam, aux échanges entre amis, aux comptes multiples et aux comportements de harcèlement avant activation publique.

### Priorités et critères communs
- Concevoir d'abord une interface de préférence matchmaking extrêmement simple, puis tester que chaque profil modifie réellement les priorités annoncées sans fragmenter les files.
- Déployer la protection des débutants uniquement après stabilisation des données de niveau, du matchmaking et du remplissage transparent par bots.
- Ajouter les recommandations positives en dernier, après validation des outils de modération, de confidentialité et d'anti-abus.
- Ces fonctions ne doivent pas retarder la première build jouable, les corrections réseau, l'audit de licence ou la sécurisation du dépôt.

## 40. Fin de partie équilibrée, partage de configurations et meilleurs moments — trois décisions approuvées le 19 novembre 2026

### 40.1 Proposition de fin anticipée dans les parties irrécupérables
- Dans les modes compatibles, détecter les situations de déséquilibre extrême à partir de critères propres au mode : écart de score, temps restant, objectifs, dynamique de partie et probabilité raisonnable de retour.
- Lorsque les critères validés sont réunis, proposer une fin anticipée selon une procédure claire et rapide, par exemple un vote d'équipe ou une règle de mode annoncée à l'avance.
- Ne jamais mettre fin à une partie sur le seul fondement d'un écart de score ponctuel ; préserver les possibilités de retournement et les objectifs secondaires encore accessibles.
- Définir des seuils testés pour chaque mode, avec une période minimale avant qu'une proposition puisse apparaître, afin d'éviter les abus en début de partie.
- Empêcher les manipulations par abandon coordonné, vote répété, comptes multiples ou joueurs qui cherchent à éviter une défaite ; prévoir des limites de fréquence et des règles de résultat explicites.
- En cas de vote, expliquer simplement les conséquences et appliquer une règle de majorité définie avant le match ; ne pas bloquer indéfiniment les joueurs qui souhaitent poursuivre.
- Définir séparément les conséquences statistiques et de progression : une fin anticipée ne doit pas être comptabilisée comme une victoire ou une défaite classique si les règles du mode ne le justifient pas.
- En classé, ne pas activer cette fonction avant d'avoir défini et testé une politique compétitive stricte, résistante aux collusions et aux abus ; elle peut rester désactivée.
- Ne jamais pénaliser automatiquement un joueur pour avoir voté contre une fin anticipée ou pour avoir continué à jouer.
- Tester avec des écarts de score variés, des retournements réels, des déconnexions et des groupes coordonnés. Désactiver la fonction dans tout mode où elle nuit à l'équité ou au rythme.

### 40.2 Codes de partage des configurations d'armes
- Permettre à un joueur de générer un code court pour partager une configuration d'arme complète avec ses accessoires, variantes et paramètres autorisés.
- Permettre à un autre joueur de saisir ou coller ce code pour prévisualiser la configuration, puis l'enregistrer dans un emplacement personnel après confirmation.
- Afficher clairement les accessoires manquants, non débloqués, incompatibles ou indisponibles dans la version actuelle ; ne jamais les équiper automatiquement ni contourner les conditions normales de progression.
- Vérifier le code côté jeu/serveur : format, version, arme, accessoires autorisés et limites de configuration. Rejeter les codes invalides ou manipulés.
- Prévoir une prévisualisation lisible de la configuration et de ses caractéristiques réelles, sans présenter une configuration communautaire comme officiellement recommandée ou objectivement supérieure.
- Autoriser le partage par code et, si les interfaces le permettent, par invitation entre amis ; ne pas exiger de compte tiers ni de service payant.
- Permettre de copier, supprimer et remplacer ses propres configurations sauvegardées ; limiter les emplacements selon une règle transparente et éviter la perte silencieuse d'une configuration existante.
- Préserver les règles d'équilibrage : un code ne débloque aucun accessoire, ne modifie aucune statistique et ne donne aucun avantage non autorisé.
- Gérer les mises à jour : si un accessoire ou une valeur change, signaler que la configuration a été modifiée ou qu'elle n'est plus reproductible à l'identique ; conserver la version de référence lorsque cela est utile.
- Compléter l'armurerie et le laboratoire d'armes déjà prévus sans dupliquer leur interface ni leur système de sauvegarde.

### 40.3 Génération facultative de meilleurs moments
- Réutiliser les événements et données de replay déjà prévus pour repérer des séquences potentiellement intéressantes : multikills, séries d'éliminations, défense décisive, action collective, retournement de situation ou autre événement défini par le mode.
- Proposer au joueur une sélection de moments après la partie, avec aperçu, possibilité de choisir le début et la fin, de renommer et de supprimer une séquence.
- Ne jamais enregistrer une vidéo complète en continu par défaut ; reconstruire les séquences à partir des données de replay disponibles, lorsque leur fidélité est suffisante.
- Afficher clairement les limites de reconstruction, les événements manquants et les approximations éventuelles ; ne pas présenter comme exact un mouvement ou une action qui ne peut pas être reproduit fidèlement.
- Permettre un export vidéo local facultatif lorsque la plateforme et les performances le permettent ; l'export ne doit pas nécessiter de serveur payant ni de stockage cloud obligatoire.
- Laisser le joueur choisir ce qu'il exporte et partage ; ne jamais publier automatiquement, envoyer à des tiers ou rendre public un replay privé.
- Respecter les paramètres de confidentialité, les demandes de blocage et les règles de modération ; éviter d'inclure des informations personnelles, messages privés ou voix enregistrées sans consentement.
- Ne pas exposer des positions ennemies ou informations cachées qui n'étaient pas légitimement accessibles au joueur pendant la partie ; appliquer les mêmes restrictions que le système de replay et la caméra de mort.
- Prévoir une génération légère et asynchrone après le match, avec annulation possible, limites de stockage local et nettoyage des fichiers temporaires.
- Ne pas ralentir la réapparition, le retour au lobby ou le lancement de la partie suivante ; la fonction doit rester entièrement facultative.
- Réutiliser les replays existants et éviter toute infrastructure vidéo ou cloud coûteuse.

### Priorités et critères communs
- Le partage de configurations peut être développé à partir de l'armurerie existante, après stabilisation des armes et de la sauvegarde des profils.
- Le système de meilleurs moments dépend de la fiabilité du replay et doit commencer par une sélection simple, sans montage complexe ni service cloud.
- La fin anticipée est la plus sensible pour l'équité : la tester longuement en parties publiques non classées avant d'envisager d'autres modes ; la désactiver si les abus ne peuvent pas être maîtrisés.
- Ces fonctions ne doivent jamais retarder la première build jouable, la sécurité du dépôt, l'audit des licences ou la stabilité réseau.

## 41. Rematch amical en duel — décision approuvée le 19 novembre 2026

### 41.1 Défi amical 1 contre 1 après une confrontation
- Après une partie ou une confrontation compatible, permettre à un joueur d'envoyer à un autre une invitation facultative à un duel amical 1 contre 1.
- Le destinataire doit accepter explicitement ; aucun lancement automatique, aucune invitation répétitive et aucun blocage de l'accès au lobby ou à la partie suivante en cas de refus.
- Prévoir un format simple et rapide : choix parmi les cartes et règles de duel autorisées, durée ou score cible prédéfini, puis lancement dès que les deux joueurs sont prêts.
- Utiliser un équipement identique ou un ensemble prédéfini pour les deux participants afin de limiter les écarts liés au déblocage d'accessoires ou à la progression.
- Autoriser des variantes de règles uniquement si elles sont clairement annoncées avant acceptation et restent équilibrées ; commencer par un format de référence commun.
- Isoler totalement les duels amicaux des statistiques officielles, du niveau compétitif, du matchmaking, des classements, des défis officiels et de la progression des armes.
- Afficher clairement le résultat comme amical/non officiel ; ne pas compter les éliminations, victoires ou défaites du duel dans les statistiques des modes standards.
- Prévoir les cas d'annulation, de déconnexion, de refus, de latence excessive et de départ d'un participant ; ne pas attribuer une victoire compétitive à la suite d'un abandon d'un duel amical.
- Respecter les blocages, préférences d'invitation, paramètres de confidentialité et outils de modération ; empêcher les invitations répétées après un refus.
- Ne pas révéler d'informations privées ni permettre d'utiliser le duel pour contourner les restrictions de groupe ou de matchmaking.
- Si l'infrastructure multijoueur ne permet pas encore d'assurer une session stable et équitable, différer la fonction plutôt que proposer un duel dégradé ou trompeur.

### Priorités et critères de validation
- Développer cette fonction après stabilisation des sessions, invitations, groupes et reconnexion.
- Commencer par une seule règle de duel, une carte adaptée et un équipement symétrique ; élargir seulement après tests.
- Tester l'équité réseau, la reconnexion, le refus, les invitations abusives, les groupes et les différences de périphériques.
- Ne pas retarder la première build jouable, la sécurité du dépôt, l'audit des licences ou la stabilité du multijoueur.

## 42. Progression durable, fiche de mode universelle et favoris de playlists — décisions approuvées le 19 novembre 2026

### 42.1 Progression durable sans FOMO
- Les récompenses prévues comme gratuites ne doivent pas devenir définitivement inaccessibles uniquement parce qu'un joueur a manqué une saison, une période ou un événement.
- Prévoir une archive ou un catalogue permettant de retrouver les anciens défis et de reprendre une progression interrompue, lorsque les conditions de licence et de disponibilité du contenu le permettent.
- Éviter les obligations de connexion quotidienne, les séries punitives, les échéances artificiellement urgentes et les mécaniques conçues pour faire culpabiliser le joueur.
- Les défis peuvent être organisés par périodes, mais leur contenu doit rester récupérable selon des règles transparentes ; aucune récompense de gameplay ne doit être verrouillée derrière une échéance.
- Aucun achat, abonnement ou paiement ne doit être nécessaire pour récupérer les récompenses annoncées comme gratuites.
- Protéger les objectifs contre le farming artificiel et valider côté serveur les progrès compétitifs ; conserver une progression locale distincte en hors ligne.
- Expliquer clairement les conditions, la durée éventuelle d'une période et les possibilités de reprise avant que le joueur ne s'engage.

### 42.2 Fiche de mode universelle — tous les joueurs et tous les modes
- Afficher une fiche d'information courte, simple, efficace et rapide pour tous les joueurs et dans absolument tous les modes, sans exception.
- Présenter uniquement les informations essentielles : nom du mode, objectif, règles particulières importantes et condition de victoire.
- Adapter automatiquement le contenu au mode sélectionné ; ne pas afficher de champs inutiles ni un long tutoriel.
- Rendre l'information immédiatement lisible dans la sélection du mode et, lorsque pertinent, accessible depuis le lobby ou le menu de pause.
- Utiliser des formulations courtes, des pictogrammes cohérents et une hiérarchie visuelle claire ; éviter les fenêtres intrusives et les confirmations supplémentaires.
- Les informations doivent refléter exactement les règles réellement actives pour la partie, y compris les variantes, limites d'équipement, réapparitions, bots ou tir ami lorsqu'ils diffèrent.
- Cette fiche est obligatoire dans tous les modes, y compris expérimentaux et communautaires ; si une règle est inconnue ou non applicable, ne pas inventer de valeur.

### 42.3 Favoris et préférences de playlists
- Permettre de marquer des modes ou playlists comme favoris et de sélectionner plusieurs playlists préférées pour la recherche de partie.
- Permettre d'exclure explicitement certaines playlists et de modifier ces préférences rapidement, sans parcours de menus complexe.
- Afficher une estimation honnête de l'effet possible des préférences sur l'attente, uniquement si des données suffisantes existent ; ne jamais promettre un délai ou une disponibilité.
- Respecter strictement les exclusions : ne jamais placer un joueur dans une playlist qu'il a explicitement désactivée.
- Ne pas fragmenter excessivement le matchmaking ; expliquer simplement quand un choix réduit fortement les possibilités de trouver une partie.
- Synchroniser les préférences sur le compte RIXE lorsque le compte et la sauvegarde sont disponibles ; conserver un comportement local cohérent en cas d'indisponibilité réseau.
- Ne pas modifier silencieusement les préférences du joueur.

### Priorités et critères de validation
- La fiche universelle de mode est une exigence de base de l'interface et doit être réalisée avec le menu de sélection/lobby, sans créer un écran lourd supplémentaire.
- Les favoris et préférences dépendent du système de playlists et de matchmaking ; les développer après stabilisation de ces systèmes.
- La progression durable dépend du catalogue de récompenses, des défis et de la sauvegarde ; commencer par une architecture simple et sans service payant.
- Tester lisibilité, navigation clavier/manette/tactile, localisation, changements de règles, exclusions de playlists, synchronisation et reprise des défis.
- Ces fonctionnalités ne doivent pas retarder la première build jouable ni la correction des risques critiques.


## 43. Consolidation des décisions de gameplay et de direction artistique approuvées

Cette section rassemble des décisions approuvées lors des échanges de cadrage antérieurs, qui n'étaient pas formulées assez explicitement dans les sections précédentes. Elles complètent les systèmes existants : ne pas créer de doublons.

### 43.1 Identité du jeu et direction artistique
- Construire une identité propre à RIXE : sensations de FPS d'arène rapides et lisibles, avec une direction de gameplay principalement inspirée de XDefiant et une ambiance militaire évoquant Call of Duty 2/3.
- Éviter que l'identité visuelle ou le rythme général fasse penser à un clone de Valorant ou Counter-Strike ; ne pas reprendre leurs codes tactiques/visuels comme direction principale.
- Conserver une interface originale, simple, rapide et arrondie, avec des rayons cohérents de 8 à 16 px ; cette règle complète les exigences d'interface des sections 26 et 27.
- Les références à des jeux commerciaux décrivent uniquement des sensations et objectifs qualitatifs : ne copier aucun code, asset, carte, interface, animation, son ou élément protégé.

### 43.2 Playlists avec et sans capacités
- Prévoir trois playlists de référence : **Classé avec capacités** (désactivée tant que les garanties ne sont pas suffisantes), **Standard / non classé avec capacités** et **Non classé sans capacités**. Les anciennes entrées « Standard avec capacités » et « Non classé avec capacités » sont fusionnées tant qu'aucune différence de règles, de population, de statut ou de progression n'est définie et testée ; elles ne doivent pas créer deux files équivalentes.
- Les capacités doivent compléter les armes et le tir, jamais les remplacer ; elles doivent être équilibrées, lisibles, contrables et testées pour ne pas dominer les affrontements.
- La fiche universelle de mode (section 42.2) doit indiquer clairement si les capacités sont actives, leurs règles essentielles et les conditions de victoire.
- Ne pas activer les capacités dans la playlist sans capacités, y compris via un équipement, bonus temporaire ou effet indirect.
- Ne pas activer le classé tant que l'autorité serveur, l'intégrité des résultats, l'anti-triche et les conditions d'équité ne satisfont pas les critères déjà définis.

### 43.3 Déplacements et interactions avec l'environnement
- Développer une boucle de déplacement fluide comprenant sprint, glissade, saut et franchissement d'obstacles lorsque le level design le permet.
- La glissade doit être naturelle, contrôlable et cohérente avec le rythme rapide visé ; elle ne doit pas créer d'invulnérabilité, de hitbox incohérente ni d'avantage réseau.
- Les portes et passages interactifs doivent être rapides, prévisibles et naturels à utiliser, sans ralentir artificiellement les déplacements ni créer de blocage injuste.
- Conserver une autorité serveur sur les mouvements et interactions compétitifs ; tester collisions, réplication, latence, anti-exploit et cohérence des animations.

### 43.4 Variantes cosmétiques d'animations de rechargement
- Prévoir plusieurs animations de rechargement pour une même arme, avec une animation de base gratuite et des variantes déblocables par la maîtrise, des défis ou des événements communautaires.
- Toutes les variantes d'une même arme doivent conserver exactement les mêmes timings de gameplay : durée, fenêtre d'interruption, transfert des munitions, reprise du tir et comportement serveur.
- Les variantes ne donnent aucun avantage, ne changent pas la cadence réelle et ne modifient ni la quantité de munitions ni les règles de rechargement.
- Utiliser un seul système de maîtrise par arme (section 32.1) pour attribuer les variantes ; ne pas créer une progression parallèle.

### 43.5 Éléments tactiques et évolution communautaire
- Étudier des équipements tactiques déployables lorsque leur rôle, leur contre-mesure, leur coût réseau et leur équilibre sont définis ; ils doivent compléter les armes et capacités sans rendre les combats illisibles.
- Prévoir des cycles ou saisons communautaires gratuits et des événements jour/nuit uniquement lorsqu'ils sont compatibles avec la lisibilité, la performance et les cartes approuvées. Les variations jour/nuit ne doivent jamais donner un avantage visuel injuste à une équipe.
- Permettre aux joueurs de proposer, tester et partager des défis communautaires à travers le système de défis existant ; validation, modération, anti-farming et licences restent obligatoires.
- Réutiliser les systèmes de laboratoire, événements, variantes de règles et création communautaire existants. Aucun nouveau système parallèle de progression ou de publication ne doit être créé.

### Critères de validation
- Valider ces décisions dans les documents techniques et les fiches de modes avant leur implémentation.
- Prototyper les déplacements, capacités, équipements et variantes d'animation sur une seule carte et un ensemble réduit d'armes avant extension.
- Mesurer équité, lisibilité, performances, réseau et accessibilité ; désactiver ou réviser toute mécanique qui dégrade le combat.
- Ces ajouts restent soumis aux priorités de livraison, au plafond de trois cartes au lancement et au budget de 0 €.


## 44. Outils de maintenance, présence en partie, écran partagé et canaux vocaux — ajouts approuvés le 22 novembre 2026

Cette section formalise quatre fonctionnalités approuvées. Elles complètent les systèmes existants sans créer de mécanismes parallèles. Elles restent planifiées et ne sont pas considérées comme implémentées avant validation dans une build réelle.

### 44.1 Vérification et réparation des fichiers du jeu
- Ajouter un outil accessible depuis le lanceur ou le menu de démarrage permettant de vérifier l'intégrité de l'installation RIXE.
- Comparer les fichiers installés à un manifeste de référence versionné et signé, contenant au minimum les chemins, tailles et empreintes cryptographiques attendues.
- Détecter les fichiers absents, incomplets, corrompus ou incompatibles avec la version active ; distinguer clairement les fichiers officiels des fichiers locaux autorisés (captures, replays, réglages et contenus communautaires).
- Proposer une réparation ciblée des seuls fichiers concernés plutôt qu'une réinstallation complète lorsque cela est possible.
- Télécharger uniquement les éléments nécessaires depuis une source officielle configurée ; vérifier leur intégrité après téléchargement avant de les remplacer.
- Effectuer les remplacements de manière sûre : sauvegarde temporaire des fichiers concernés, écriture atomique lorsque possible, reprise après interruption et retour à l'état précédent en cas d'échec.
- Ne jamais supprimer silencieusement les captures, replays, réglages, sauvegardes locales ou contenus communautaires du joueur. Demander confirmation avant toute opération destructive et isoler les fichiers inconnus au lieu de les effacer automatiquement.
- Afficher un rapport compréhensible : éléments vérifiés, anomalies trouvées, réparations effectuées, éléments ignorés et éventuelle action manuelle requise.
- Prévoir un mode diagnostic sans réparation, ainsi qu'une option de vérification au démarrage qui ne bloque pas inutilement le lancement si aucun problème critique n'est détecté.
- Ne pas intégrer de mécanisme d'exécution de code arbitraire, de téléchargement depuis des sources non fiables ou de désactivation de la sécurité du système.
- Réutiliser le système de versions et de mise à jour réversible de la section 22.8 ; ne pas créer un second mécanisme de mise à jour.
- Critères de validation : fichiers absents, corrompus, modifiés, accès refusé, disque plein, réseau interrompu, téléchargement incomplet, manifeste invalide, restauration après échec et préservation des données utilisateur.

### 44.2 Détection et gestion des joueurs inactifs (AFK)
- Distinguer l'inactivité prolongée d'une déconnexion réseau : un joueur AFK est toujours connecté mais ne participe plus, tandis qu'une déconnexion relève de la période de grâce et de la reconnexion prévues en section 26.
- Définir des seuils adaptés à chaque mode, avec une durée de tolérance avant avertissement et une seconde étape avant toute conséquence.
- Ne pas se baser sur l'absence de déplacements uniquement : tenir compte d'une activité de jeu pertinente sans considérer un joueur qui défend légitimement une position comme automatiquement inactif.
- Afficher un avertissement clair et laisser au joueur un délai raisonnable pour confirmer sa présence par une action simple.
- Dans les modes qui l'autorisent, retirer de la partie un joueur restant inactif après avertissements ; appliquer ensuite les règles de remplacement déjà prévues en section 26, sans créer un système de bots distinct.
- Définir une politique plus stricte ou différente pour les parties classées, les parties privées et les modes sans réapparition ; ne jamais attribuer artificiellement une victoire ou une défaite.
- Prévoir des protections contre les faux positifs liés aux menus, aux problèmes d'accessibilité, aux périphériques défaillants et aux interruptions temporaires.
- Limiter les sanctions : une expulsion AFK ne doit pas entraîner automatiquement une suspension lourde. Toute pénalité répétée doit être progressive, proportionnée, explicable et contestable.
- Critères de validation : défense statique légitime, spectateur, pause autorisée, perte momentanée de périphérique, latence, déconnexion réelle, reconnexion, joueur inactif en classé et tentative de simulation d'activité.

### 44.3 Multijoueur local en écran partagé sur PC
- Étudier et développer la possibilité pour plusieurs joueurs de participer à une même session sur un seul PC, avec affichage en écran partagé et périphériques de contrôle distincts.
- Commencer par deux joueurs locaux ; n'étendre à davantage de joueurs que si les performances, la lisibilité et les contraintes de l'interface le permettent.
- Permettre de rejoindre une partie locale hors ligne contre des bots, puis étudier la participation de plusieurs joueurs locaux à une partie en ligne si l'architecture réseau, les comptes et les règles de session le permettent.
- Prévoir une attribution claire des périphériques : clavier/souris pour le joueur principal et manettes supplémentaires, avec association et réattribution simples. Ne pas promettre deux joueurs indépendants au clavier/souris sur un même PC.
- Adapter le HUD, les menus, les messages, les scores et les paramètres à chaque vue ; éviter qu'un joueur puisse modifier accidentellement les réglages ou menus de l'autre.
- Gérer séparément les paramètres locaux nécessaires à chaque participant (sensibilité, commandes, audio et préférences d'affichage) sans écraser les profils personnels.
- Définir les limites techniques : résolution minimale, disposition horizontale ou verticale si les deux sont viables, fréquence d'images, charge CPU/GPU, mémoire, audio et compatibilité des cartes.
- Prévoir une procédure d'ajout/retrait d'un joueur local, de déconnexion d'une manette et de retour au lobby sans corrompre la session.
- Ne pas accorder automatiquement plusieurs récompenses, progressions ou résultats officiels à un même compte ou à des comptes secondaires sans règles anti-abus spécifiques.
- Critères de validation : deux joueurs locaux, périphériques mélangés, changement de périphérique, déconnexion d'une manette, menus simultanés, reconnexion, performances sur PC modeste et participation en ligne lorsque prise en charge.
- Cette fonctionnalité est secondaire et ne doit pas retarder la première build Windows jouable ni dégrader l'expérience standard à un seul joueur.

### 44.4 Gestion avancée des canaux vocaux
- Organiser le chat vocal autour de canaux clairement séparés, en réutilisant le système audio et le chat de proximité déjà prévus en section 28.2.
- Prévoir au minimum les destinations suivantes lorsque le mode les autorise : canal d'équipe, canal de groupe/amis, canal de proximité et canal d'organisation réservé aux responsables d'une partie personnalisée ou d'un événement.
- Permettre de choisir rapidement le canal actif et, si cela reste compréhensible, d'écouter plusieurs canaux avec des volumes indépendants ; éviter qu'un joueur transmette accidentellement sa voix à un canal non souhaité.
- Afficher clairement le canal de transmission actif, les participants qui parlent et l'état micro muet/non muet.
- Permettre de régler séparément le volume de chaque canal et de chaque joueur, ainsi que de couper ou bloquer un participant conformément aux outils de confidentialité et de modération existants.
- Définir les droits de création, d'accès et de gestion des canaux privés ; les responsables ne doivent pas pouvoir contourner les blocages, les paramètres de confidentialité ou les règles de modération.
- En partie compétitive, appliquer des règles explicites aux communications entre équipes et pendant les phases où certaines informations doivent rester confidentielles ; ne jamais transmettre à un joueur des communications auxquelles il ne devrait pas avoir accès.
- Prévoir un comportement de secours lorsque le chat vocal est indisponible : indicateur clair, possibilité de rester dans la partie et accès aux moyens de communication non vocaux déjà prévus.
- Ne pas enregistrer les conversations vocales par défaut. Toute éventuelle conservation à des fins de modération doit faire l'objet d'une conception distincte, proportionnée, transparente et conforme aux règles applicables.
- Critères de validation : changement de canal en cours de partie, groupe multiplateforme si disponible, invitations, joueur bloqué, micro déconnecté, perte réseau, permissions, confidentialité et absence de fuite audio entre équipes.

### Priorités et règles communes
- Ces quatre fonctionnalités sont approuvées et planifiées, mais ne sont pas implémentées par leur seule présence dans le cahier des charges.
- Priorité de livraison : première build Windows jouable, stabilité du combat et du réseau, sécurité et intégrité des fichiers ; les fonctionnalités locales et vocales viennent ensuite selon leur coût réel.
- Réaliser des prototypes techniques courts avant de figer l'architecture, notamment pour l'écran partagé et les canaux vocaux.
- Réutiliser les systèmes existants de mise à jour, reconnexion, remplacement par bot, audio spatial, proximité, groupes, comptes, accessibilité et modération.

## 45. Personnalisation avancée du HUD, inspection des armes et nouvelles options de commandes/accessibilité — ajouts approuvés le 22 novembre 2026

Ces quatre fonctionnalités complètent les réglages d'interface et d'accessibilité (sections 22 et 30), la maîtrise et la personnalisation des armes (sections 26 et 32), ainsi que la calibration des commandes (section 32.2). Elles ne doivent pas créer de systèmes parallèles. Elles sont planifiées, pas considérées comme implémentées. Leur développement reste subordonné à la première build Windows jouable, à la stabilité du combat et du réseau, et au budget de 0 €.

### 45.1 Éditeur libre de disposition du HUD

- Permettre au joueur de déplacer librement les éléments d'interface autorisés : mini-carte, informations de santé et d'armure, munitions, indicateurs d'équipe, flux d'éliminations, objectifs et autres éléments non réservés.
- Proposer une interface d'édition visuelle avec aperçu en temps réel, déplacement, alignement, magnétisme facultatif, redimensionnement et réglage de l'espacement lorsque cela est pertinent.
- Prévoir des dispositions prédéfinies, une disposition personnalisée, plusieurs emplacements de profils, une restauration élément par élément et une remise à zéro complète.
- Permettre de sauvegarder localement les dispositions et, si le compte multiplateforme le permet, de les synchroniser avec gestion claire des conflits.
- Adapter automatiquement ou proposer un repositionnement lors des changements de résolution, format d'écran, ratio, échelle d'interface et plateforme ; éviter les éléments hors écran ou qui se chevauchent.
- Prévoir des règles de zones sûres et de marges pour les écrans de télévision et les interfaces tactiles si elles sont prises en charge.
- Ne pas autoriser de masquer ou déplacer de manière à créer un avantage compétitif, révéler des informations cachées ou rendre les informations essentielles inaccessibles. Les éléments indispensables doivent rester disponibles et lisibles.
- Intégrer les réglages de taille, contraste et accessibilité déjà prévus : l'éditeur complète ces options, il ne les remplace pas.
- Tester les dispositions en jeu réel, en spectateur si applicable, sur différentes résolutions et avec les différentes langues ; prévoir une disposition de secours fiable.

### 45.2 Inspection interactive des armes

- Ajouter dans l'armurerie ou un espace de présentation une inspection visuelle des armes permettant de les observer sous plusieurs angles, avec rotation libre à 360° et zoom contrôlé.
- Présenter les détails visuels pertinents : matériaux, finitions, accessoires équipés, animations d'inspection et éléments cosmétiques effectivement possédés ou disponibles.
- Permettre de lancer les animations d'inspection depuis cet espace sans interrompre une partie ni modifier l'état de l'arme en combat.
- Si des variantes cosmétiques sont prévues, permettre de les comparer dans cet aperçu sans confondre aperçu et déblocage réel.
- Ajouter une galerie de comparaison permettant d'afficher simultanément plusieurs apparences d'une même arme côte à côte, afin de comparer directement leurs couleurs, matériaux, motifs et finitions.
- Conserver pour chaque aperçu les contrôles de rotation et de zoom déjà prévus ; permettre d'examiner les variantes sous un éclairage cohérent et identique, avec un retour simple à la vue d'origine.
- La galerie ne doit afficher que les apparences réellement disponibles ou clairement identifiées comme aperçus ; comparer une apparence ne la débloque pas et ne l'équipe pas automatiquement.
- Ne pas permettre de voir à travers les modèles, d'inspecter des éléments internes utiles au gameplay ou d'obtenir des informations tactiques indisponibles en partie.
- L'inspection ne doit jamais modifier les dégâts, le recul, la précision, la cadence, les sons tactiques, les hitboxes ou toute autre propriété compétitive.
- Réutiliser les modèles, matériaux et animations de l'armurerie ; éviter de maintenir une seconde représentation de chaque arme.
- Optimiser les ressources et charger les détails à la demande afin de ne pas pénaliser les performances du jeu ou le temps de chargement.
- Ajouter une vérification rapide et facultative de l'état des munitions pour les armes compatibles : geste/animation permettant d'estimer visuellement le contenu du chargeur et, lorsque le modèle le permet, l'état de la chambre.
- Afficher uniquement une information que le personnage peut réellement vérifier ; distinguer clairement une estimation visuelle du nombre exact de cartouches et ne pas inventer de lecture impossible pour un chargeur opaque.
- La vérification ne recharge pas, ne modifie pas les munitions et ne crée aucune cartouche ; l'état réel reste celui validé par le serveur.
- Définir si cette vérification est réservée à l'armurerie/inspection ou disponible en partie sous une animation courte et interrompable ; dans tous les cas, elle ne doit pas procurer d'invulnérabilité ni d'avantage d'information.
- Valider les contrôles clavier/souris et manette, la lisibilité, les transitions d'animation et le comportement sur les configurations modestes.

### 45.3 Visée gyroscopique pour manettes compatibles

- Ajouter une option de visée par gyroscope pour les manettes qui exposent réellement cette donnée au jeu ; ne pas afficher l'option comme disponible sur un périphérique incompatible.
- Permettre d'activer ou désactiver le gyroscope indépendamment, notamment en permanence ou uniquement lorsque le joueur vise, selon les possibilités techniques du périphérique.
- Proposer la sensibilité, l'inversion des axes, le lissage facultatif, le seuil de neutralité et une procédure de calibration/recentrage.
- Prévoir des réglages distincts si nécessaire entre mouvements horizontaux et verticaux, sans multiplier inutilement les paramètres.
- Fournir un aperçu et des exercices de calibration dans le stand de tir, en complément des réglages de sticks déjà prévus à la section 32.2.
- Gérer les dérives du capteur, les interruptions, la mise en veille, les changements de périphérique et les données bruitées ; proposer un comportement de secours au stick.
- Ne pas appliquer d'assistance automatique supplémentaire ni de compensation cachée. Le gyroscope constitue une méthode de commande, pas un avantage artificiel.
- Tester la latence, la stabilité, la précision et l'équité face aux autres périphériques ; documenter les plateformes et manettes réellement compatibles.

### 45.4 Transcription vocale en temps réel des communications

- Proposer une option facultative qui convertit en texte les communications vocales reçues dans les canaux de jeu pris en charge, afin de permettre de suivre les échanges sans écouter le son.
- Distinguer visuellement les intervenants lorsque cette identification est disponible et fiable, et associer les transcriptions au bon canal (équipe, groupe ou proximité) sans mélanger les conversations.
- Afficher les transcriptions dans une zone dédiée et configurable : taille du texte, durée d'affichage, historique limité, effacement et désactivation immédiate.
- Ne pas présenter une transcription automatique comme une citation certaine : signaler les incertitudes et éviter d'inventer des mots lorsque la reconnaissance est insuffisante.
- Prévoir une prise en charge multilingue progressive, en indiquant clairement les langues disponibles et les limites de reconnaissance ; ne pas retarder la première version pour couvrir toutes les langues.
- Privilégier le traitement local lorsque la qualité et les performances le permettent. Tout recours à un service externe doit être explicitement documenté, facultatif, compatible avec le budget approuvé et soumis à une analyse de confidentialité avant activation.
- Ne pas enregistrer ni conserver les fichiers audio par défaut. Limiter la conservation du texte transcrit, ne pas l'utiliser pour entraîner un modèle et ne pas l'exposer dans les replays ou outils de modération sans décision explicite et cadre de confidentialité adapté.
- Informer clairement les joueurs lorsque la transcription est active et respecter les paramètres de confidentialité, de blocage et de mise en sourdine.
- Prévoir une solution de secours sans transcription et ne jamais rendre le vocal obligatoire pour jouer ou comprendre les objectifs.
- Tester le bruit de fond, les accents, les chevauchements de voix, la latence, les faux positifs, les performances et la confidentialité ; mesurer la qualité avant de déclarer la fonction fiable.

### Priorités et critères communs

- 45.1 complète les réglages de taille et de lisibilité du HUD existants ; ne pas créer un second menu de réglages d'interface.
- 45.2 s'intègre à l'armurerie et aux cosmétiques existants ; aucune propriété de gameplay ne peut être modifiée.
- 45.3 complète la calibration des commandes de la section 32.2 ; elle ne doit être activée que sur les périphériques compatibles et validés.
- 45.4 complète les sous-titres et options d'accessibilité existants ; elle ne doit pas devenir une dépendance du chat vocal ni imposer un traitement externe payant.
- Chaque fonctionnalité doit disposer d'un prototype, de critères d'acceptation, de tests de performance, d'un contrôle de confidentialité/sécurité pertinent et d'une possibilité de désactivation.
- Ne pas retarder la première build Windows jouable pour ces ajouts. Prioriser selon le coût réel, les dépendances techniques et le bénéfice démontré, en respectant le budget de 0 €.



## 46. Informations tactiques contextuelles, continuité des périphériques et statistiques par carte — ajouts approuvés le 22 novembre 2026

Ces ajouts complètent les communications tactiques (sections 23.1 et 26), les préférences et réglages de périphériques (sections 28.4 et 32.2), le diagnostic graphique/réseau (section 30.6) et la comparaison personnelle des performances (section 36.4). Ils restent planifiés et ne sont pas considérés comme implémentés avant validation sur une build réelle.

### 46.1 Marqueurs tactiques contextuels et intelligents
- Compléter les appellations de zones et les pings déjà prévus aux sections 23.1 et 26 par une communication rapide contextuelle : signaler un danger observé, demander un soutien, indiquer une direction, un objectif à défendre/attaquer ou un équipement/allier nécessitant de l'aide.
- Adapter les propositions au contexte réel (mode, proximité d'un objectif, état du joueur et éléments effectivement visibles) sans envoyer automatiquement un message non voulu ; le joueur conserve toujours la confirmation de l'envoi.
- Associer si possible le marqueur à une zone ou un élément identifié, avec une durée de validité adaptée. Faire expirer ou atténuer les marqueurs devenus anciens, invalides ou contredits par l'évolution de la partie.
- Distinguer clairement une observation directe, une demande d'aide et une hypothèse ; ne jamais transformer un ping en révélation de position ennemie non observée.
- Respecter les règles de visibilité et de confidentialité : le serveur valide les informations partageables et aucun client ne reçoit de données cachées par l'intermédiaire du système de ping.
- Prévoir une roue ou des raccourcis configurables, une utilisation clavier/souris et manette, des libellés traduisibles et des retours visuels/sonores accessibles.
- Limiter la fréquence, empêcher le spam et permettre de masquer ou réduire les marqueurs ; les outils de modération et de blocage existants restent applicables.
- Critères de validation : marqueur erroné devenu obsolète, changement de position, ennemi non visible, joueur bloqué, spam, groupe vocal/non vocal, lisibilité en combat chargé et cohérence entre clients.

### 46.2 Détection des interruptions et bascule contrôlée des périphériques
- Détecter la perte, déconnexion, mise en veille ou absence prolongée de réponse d'un périphérique de contrôle actif (souris, clavier, manette ou autre périphérique officiellement pris en charge).
- Afficher une notification discrète et explicite indiquant le périphérique concerné, sans bloquer inutilement la partie ni déclencher une action de gameplay.
- Lorsqu'un autre périphérique compatible est disponible, permettre une bascule simple et contrôlée ; ne jamais changer automatiquement de méthode de contrôle d'une manière susceptible de déplacer la visée, d'activer une commande ou de modifier involontairement les réglages.
- Préserver les associations, remappages, sensibilités, zones mortes et profils propres à chaque périphérique conformément à la section 32.2.
- À la reconnexion, éviter les doubles entrées, changements intempestifs de focus ou répétitions involontaires de commandes ; demander une confirmation si le retour au périphérique précédent nécessite une bascule.
- Distinguer une déconnexion matérielle d'un gel du jeu, d'une perte de focus ou d'un problème système ; ne pas prétendre diagnostiquer avec certitude une panne matérielle.
- Prévoir des options pour désactiver les notifications ou choisir le comportement de bascule, sans masquer un état qui rendrait les commandes inopérantes.
- Critères de validation : débranchement en combat, batterie vide, veille/réveil, reconnexion, périphériques multiples, changement de fenêtre, manette sans fil instable et maintien des paramètres personnels.

### 46.3 Historique et comparaison des performances par carte
- Étendre la comparaison personnelle prévue en section 36.4 afin de permettre de consulter ses tendances séparément par carte, mode et côté (attaque/défense ou équipe selon les règles du mode).
- Afficher, lorsque les données sont fiables et disponibles, des indicateurs contextualisés : résultats, éliminations/morts/assists, précision, contribution aux objectifs, soutien, performances par arme et durée de partie.
- Permettre de filtrer par période et de comparer des parties réellement comparables ; signaler le nombre de matchs pris en compte et éviter toute conclusion lorsque l'échantillon est trop faible.
- Présenter les tendances comme des repères de progression personnelle, jamais comme une preuve qu'une carte, un côté ou un coéquipier est responsable d'un résultat.
- Distinguer les modes officiels, privés, communautaires, expérimentaux et entraînements hors ligne ; seules les données répondant aux règles de fiabilité correspondantes alimentent chaque vue.
- Réutiliser les statistiques et l'historique existants, sans créer une seconde infrastructure de collecte ni enregistrer des données personnelles inutiles.
- Prévoir des filtres de confidentialité, une option de désactivation et, lorsque l'architecture le permet, l'export ou la suppression de l'historique personnel.
- Ne pas utiliser ces indicateurs pour modifier automatiquement le matchmaking, le niveau caché ou l'équilibrage.
- Critères de validation : faible nombre de parties, changement de mode/carte, équilibrage de carte modifié entre versions, résultats incomplets, parties hors ligne et confidentialité du profil.

### Priorités et critères communs
- 46.1 réutilise les zones nommées, la roue de communication et les pings déjà prévus ; il ne crée pas un canal d'information caché.
- 46.2 complète les réglages par périphérique et la gestion des périphériques déjà pris en charge ; la continuité des commandes prime sur l'automatisation.
- 46.3 étend la comparaison personnelle de la section 36.4 et réutilise les statistiques officielles ; aucun système de statistiques parallèle.
- Ces fonctions restent secondaires par rapport à la première build Windows jouable, à la stabilité du combat/réseau et à la sécurité. Respecter le budget de 0 € et ne pas intégrer de service payant sans accord explicite.


## 47. Analyse détaillée des échanges de tirs — extension approuvée le 22 novembre 2026

Cette fonctionnalité approfondit le récapitulatif après élimination déjà prévu en section 36.1. Elle ne doit pas créer un second système de replay ou de statistiques : elle réutilise les événements de combat et les données validées par le serveur. Elle reste planifiée et ne sera considérée comme implémentée qu'après validation sur une build réelle.

### 47.1 Rapport personnel d'un échange de tirs
- Après une élimination, proposer un rapport facultatif et consultable sans ralentir la reprise de partie, qui explique l'échange de tirs entre le joueur et son adversaire lorsque les données nécessaires sont disponibles.
- Présenter séparément les dégâts infligés par le joueur et les dégâts reçus, en identifiant les tirs confirmés, les impacts et les éventuelles éliminations/assistances liées à l'échange.
- Indiquer, lorsque les données serveur sont fiables : nombre de tirs tentés et confirmés, zones corporelles touchées, dégâts par impact, arme utilisée, ordre chronologique des événements et distance estimée avec une marge d'incertitude.
- Distinguer clairement les tirs ratés, les impacts sur l'environnement, les impacts confirmés sur un adversaire et les dégâts réellement appliqués ; ne jamais déduire un impact à partir du seul retour visuel ou sonore du client.
- Expliquer les limites possibles : dégâts atténués, protections, obstacles, tirs simultanés, latence, événements manquants ou données indisponibles. Ne pas inventer de cause certaine lorsqu'elle ne peut pas être établie.
- Lorsque le joueur a perdu le duel, résumer les éléments observables sans jugement : dégâts échangés, chronologie, précision et éventuelles différences de portée ou de position si elles sont mesurables.
- Ne pas révéler de position ennemie cachée, d'information reçue après la mort qui pourrait être transmise aux coéquipiers, ni de donnée que le joueur ne pouvait légitimement connaître. Respecter les restrictions du replay et de la caméra de mort.
- Permettre de fermer ou ignorer immédiatement le rapport ; aucune animation ou analyse ne doit retarder la réapparition, le spectateur ou le retour au jeu.
- Ne pas transformer ce rapport en outil de surveillance des autres joueurs : l'affichage est personnel, limité aux événements pertinents et soumis aux règles de confidentialité.
- Critères de validation : duel gagné/perdu, élimination simultanée, assistance, dégâts réduits, tirs traversant des matériaux autorisés, latence élevée, données incomplètes, plusieurs adversaires, modes sans réapparition et absence de fuite d'information.

### Priorités et critères communs
- Étendre le récapitulatif de la section 36.1 au lieu de créer une interface ou un historique parallèle.
- Réutiliser les événements de combat validés côté serveur et les données de replay strictement nécessaires ; ne pas enregistrer de vidéo continue pour cette fonction.
- Afficher les indicateurs indisponibles comme tels et différencier faits confirmés, estimations et données absentes.
- Mesurer le coût CPU, mémoire, stockage et réseau ; limiter la quantité et la durée de conservation des données.
- Fonction facultative et secondaire : ne pas retarder la première build Windows jouable, la stabilité du combat ou du réseau. Respecter le budget de 0 €.


## 48. Mode parcours chronométré — ajout approuvé le 22 novembre 2026

Créer un mode indépendant des parties compétitives dans lequel les joueurs parcourent des circuits conçus pour tester la vitesse, la précision des déplacements et la maîtrise des mouvements.

### 48.1 Parcours, chronomètre et records
- Proposer des parcours composés d'obstacles, de plateformes, de passages étroits, de changements de hauteur et de séquences sollicitant les mouvements disponibles dans RIXE.
- Afficher un chronomètre précis, les temps intermédiaires et le temps final. Permettre de recommencer rapidement un parcours.
- Prévoir plusieurs niveaux de difficulté et des parcours de durées variées, des circuits courts axés sur un mouvement précis aux parcours plus longs combinant plusieurs techniques.
- Enregistrer les meilleurs temps personnels et, si un classement en ligne est proposé, séparer clairement les classements par parcours, difficulté et version du circuit.
- Garantir des conditions de comparaison identiques : même configuration du parcours, mêmes règles de déplacement et détection des raccourcis ou exploits qui invalideraient un temps.
- Permettre de s'entraîner sans pression de classement et de consulter ses temps précédents pour mesurer ses progrès.
- Ne donner aucun avantage, bonus ou progression compétitive aux résultats obtenus dans ce mode.

### 48.2 Ambiance musicale et satisfaction
- Intégrer au lancement une sélection de trois morceaux musicaux au maximum, originaux ou correctement licenciés, spécialement choisis ou composés pour rendre les parcours agréables, rythmés et satisfaisants à terminer. Cette limite concerne la sélection officielle intégrée au jeu et pourra évoluer ultérieurement après décision explicite.
- Permettre au joueur de rechercher, sélectionner et lire ses propres fichiers audio présents sur son PC pendant le parcours, au moyen d'un sélecteur de fichiers et d'une barre de recherche dans les fichiers ou dossiers qu'il a explicitement choisis.
- La lecture de musique personnelle repose exclusivement sur les fichiers locaux du joueur : aucune recherche de catalogue musical sur Internet, aucun service de streaming, aucune API musicale en ligne et aucun abonnement ou paiement à un fournisseur externe ne doivent être nécessaires.
- Ne pas téléverser les fichiers musicaux, leurs chemins ni la bibliothèque personnelle du joueur. Limiter l'accès aux emplacements sélectionnés par le joueur et conserver ses préférences localement lorsque cela est possible.
- Prendre en charge uniquement les formats audio effectivement validés par le moteur et afficher clairement les fichiers incompatibles ou illisibles.
- Permettre de choisir un morceau, de mélanger les morceaux locaux sélectionnés ou de laisser le jeu choisir automatiquement une musique différente à chaque tentative.
- Synchroniser avec subtilité certains retours sonores ou effets d'ambiance avec le rythme musical, sans rendre les obstacles, les repères ou les sons utiles au gameplay moins audibles.
- Prévoir des réglages de volume séparés pour la musique et les effets sonores, ainsi qu'une option pour couper complètement la musique.
- Fournir une interface claire indiquant le morceau et son emplacement local, l'état de lecture et les commandes lecture/pause/suivant, avec une gestion compréhensible des fichiers manquants ou des erreurs de lecture.
- Faire évoluer la musique de manière satisfaisante pendant le parcours et lors de la réussite : montée musicale à l'approche de l'arrivée, accent sonore lors d'un passage réussi et conclusion musicale valorisante à la fin, sans ralentir ni bloquer le joueur.
- Éviter les répétitions trop fréquentes : varier les morceaux et, si possible, leurs transitions afin que les sessions restent plaisantes.
- Ne pas intégrer ni distribuer de musique commerciale sans les droits nécessaires. Les morceaux personnels restent des fichiers fournis et utilisés localement par le joueur.
### Priorités et critères communs
- Ce mode doit rester distinct du matchmaking et des statistiques compétitives ; ses records ne modifient ni le niveau du joueur ni son classement en partie.
- Réutiliser le système de déplacement et les outils de création de cartes existants lorsque cela est techniquement pertinent, sans imposer la création d'un éditeur supplémentaire.
- Tester la précision du chronométrage, la reproductibilité des temps, les collisions, les raccourcis, les performances et les transitions audio.
- La musique doit rester facultative et ne jamais masquer les informations sonores utiles dans les autres modes.
- Fonction secondaire : ne pas retarder la première build Windows jouable et respecter le budget de 0 €.


## 49. Mode Recherche et destruction — ajout approuvé le 22 novembre 2026

Créer un mode tactique en manches inspiré du principe classique « Search and Destroy » de Call of Duty, avec une identité, des cartes et une présentation propres à RIXE.

### 49.1 Objectifs et déroulement des manches
- Deux équipes alternent les rôles d'attaque et de défense.
- L'équipe attaquante doit installer un dispositif sur l'un des sites désignés (par exemple A ou B), puis empêcher son désamorçage jusqu'à la fin du compte à rebours.
- L'équipe défensive doit empêcher l'installation ou désamorcer le dispositif après sa pose.
- Une manche peut également être remportée par élimination complète de l'équipe adverse, selon les règles précises du mode.
- Prévoir une seule vie par joueur et par manche : aucune réapparition après élimination avant la manche suivante.
- Définir une durée de manche, une durée d'installation et une durée de désamorçage configurables et équilibrées.
- Après un nombre défini de manches, les équipes échangent leurs rôles. Prévoir un nombre de manches gagnantes et, si nécessaire, des manches supplémentaires pour départager une égalité.
- Afficher clairement le temps restant, l'état du dispositif, le nombre de joueurs encore en vie et le résultat de chaque manche.
- Permettre de regarder ses coéquipiers après élimination, avec les restrictions anti-triche et anti-fuite d'information adaptées.
### 49.2 Équilibrage et règles compétitives
- Concevoir des cartes avec plusieurs itinéraires viables, des sites distincts, des possibilités de rotation et des positions défensives contestables.
- Éviter les sites impossibles à reprendre, les angles sans contre-jeu, les apparitions trop proches des sites et les raccourcis exploitables.
- Garantir des conditions équitables lors du changement de côté : mêmes équipements autorisés, mêmes règles et mêmes conditions de départ.
- Définir les règles d'égalité, de fin de manche, de déconnexion, d'abandon et de reconnexion sans créer d'avantage artificiel.
- Prévoir des variantes non classées et, uniquement lorsque l'intégrité des résultats est garantie, une version classée avec règles verrouillées.
- Réutiliser les systèmes de groupes, de lobby, de score et de statistiques déjà prévus ; ne pas créer un système parallèle.
- Les statistiques du mode doivent distinguer notamment installations, désamorçages, éliminations, survies et contributions aux objectifs.

### Priorités et critères communs
- Ce mode constitue une playlist tactique distincte des modes à réapparitions ; il doit être clairement présenté avant la recherche de partie.
- Prototyper d'abord une carte et des règles simples, puis tester l'équilibre des deux côtés avec des équipes de niveaux variés.
- Tester les cas limites : éliminations simultanées, dispositif posé à la dernière seconde, désamorçage interrompu, déconnexion, reconnexion, égalité et fin de temps.
- Ne pas commencer son développement avant la stabilisation du combat, des dégâts, du réseau, des réapparitions et de la première build jouable.
- Respecter le budget de 0 €, les règles d'autorité serveur et les exigences anti-triche.

## 50. Campagne scénarisée coopérative — ajout approuvé le 22 novembre 2026

Créer une campagne originale dans l'univers de RIXE, jouable en solo avec des alliés contrôlés par l'IA et, si la technique le permet, en coopération avec d'autres joueurs. L'histoire, les personnages et le monde restent à concevoir : aucune intrigue ni aucun personnage ne sont considérés comme déjà décidés.

### 50.1 Création de l'univers et de l'histoire
- Écrire une véritable histoire originale adaptée à l'identité de RIXE : contexte du conflit, factions, motivations, enjeux, événements déclencheurs et conséquences.
- Créer une bible narrative avant la production des missions : chronologie, géographie, factions, personnages, relations, vocabulaire, règles de l'univers et éléments de continuité.
- Définir un protagoniste ou une escouade identifiable, des alliés récurrents et des antagonistes avec des motivations compréhensibles.
- Construire une progression narrative cohérente avec un début, des développements, des révélations, un climax et une conclusion. Éviter une simple succession de missions sans lien.
- Prévoir des dialogues et des séquences narratives courtes intégrées au rythme du FPS, sans imposer de longues interruptions répétitives.
- Les choix du joueur peuvent influencer certaines situations, relations, objectifs secondaires ou conséquences, à condition que leurs effets soient compréhensibles et réalisables dans le budget du projet.
- Garder une cohérence entre la campagne, les cartes multijoueurs et l'univers général de RIXE, sans rendre la campagne obligatoire pour comprendre le multijoueur.

### 50.2 Missions et expérience de jeu
- Construire plusieurs missions variées avec des objectifs clairs : progression au combat, défense, récupération, sabotage, évacuation, reconnaissance ou affrontements majeurs.
- Alterner combats intenses, déplacements, moments de préparation et séquences narratives pour éviter la répétition.
- Proposer des environnements et situations distincts, avec une progression de difficulté maîtrisée.
- Intégrer des objectifs principaux et, lorsque cela apporte un intérêt réel, des objectifs secondaires facultatifs.
- Prévoir des checkpoints, sauvegardes fiables et reprise de mission après fermeture ou déconnexion.
- Permettre de rejouer les missions et de consulter les objectifs accomplis sans obliger à recommencer toute la campagne.
- Éviter les séquences artificiellement longues ou les passages qui retirent durablement le contrôle au joueur.

### 50.3 Solo, coopération et IA
- Permettre de jouer seul avec des coéquipiers IA dont les comportements soutiennent le joueur sans accomplir systématiquement les objectifs à sa place.
- Étudier la coopération en ligne, avec progression de mission synchronisée, difficulté adaptée au nombre de participants et règles claires pour les départs/reconnexions.
- Définir comment les choix narratifs et la progression sont enregistrés en coopération : hôte, progression individuelle, décisions communes et reprise d'une session.
- Prévoir des difficultés réglables, avec des adversaires et ressources adaptés sans modifier arbitrairement les règles fondamentales.
- Les bots doivent rester utiles, lisibles et testables ; ne pas dépendre d'un modèle d'apprentissage expérimental pour faire fonctionner la campagne.

### Priorités et critères communs
- La campagne est une extension importante, distincte du multijoueur compétitif ; elle ne doit pas retarder la première build Windows jouable ni les fondations réseau.
- Commencer par un document de conception narrative, puis un synopsis global, les personnages principaux, l'arc de l'histoire et le découpage des missions avant de produire tous les niveaux.
- Réaliser d'abord une mission verticale complète pour valider gunplay, IA, rythme, sauvegarde, dialogues et performance.
- Privilégier des dialogues écrits et des ressources audio originales ou clairement licenciées. Ne pas engager de dépenses de doublage, d'assets ou de services sans autorisation explicite ; budget actuel : 0 €.
- Tester la continuité narrative, les checkpoints, les sauvegardes, les difficultés, les bots et les scénarios coopératifs réellement pris en charge.
- Ne déclarer la campagne terminée qu'après validation de toutes les missions incluses, de leur conclusion et de la sauvegarde de progression.

## 51. Mode Domination — ajout approuvé le 22 novembre 2026

Créer un mode en équipes où les joueurs gagnent en contrôlant plusieurs zones stratégiques réparties sur la carte.

### 51.1 Règles et déroulement
- Prévoir trois zones de contrôle principales, nommées A, B et C, lorsque la configuration de la carte le permet.
- Les joueurs capturent une zone en y entrant et en la sécurisant selon une durée et des conditions clairement affichées.
- Une zone contrôlée rapporte des points à intervalles réguliers à l'équipe qui la détient ; la cadence et les seuils de score sont configurables.
- L'équipe qui atteint le score cible ou possède le meilleur score à la fin du temps imparti remporte la partie.
- Définir précisément les règles de capture contestée : présence des deux équipes, progression interrompue ou neutralisation selon le prototype retenu.
- Éviter qu'une accumulation de joueurs accélère indéfiniment la capture ; plafonner le bonus de présence si cette règle est testée.
- Afficher l'état des zones, leur progression, leur propriétaire et le score de chaque équipe sur le HUD et la carte.
- Récompenser la capture, la défense et la présence utile sur les objectifs, sans encourager le farming ou l'abandon des autres zones.

### 51.2 Équilibrage et validation
- Concevoir des zones accessibles par plusieurs itinéraires, avec des couvertures et des possibilités de reprise pour les deux équipes.
- Éviter les apparitions trop proches des objectifs, les positions impossibles à déloger et les enchaînements de captures qui enferment une équipe.
- Adapter les apparitions automatiques au contrôle des zones sans permettre de choisir ou prédire précisément un point d'apparition adverse.
- Tester les parties en avance, en retard, à égalité, avec zones contestées, joueurs déconnectés et équipes incomplètes.
- Enregistrer séparément temps de contrôle, captures, défenses et contributions ; appliquer les règles de fiabilité des statistiques et du classé déjà prévues.

### Priorités et critères communs
- Réutiliser les systèmes de score, d'apparition, de HUD, de statistiques et de matchmaking existants.
- Prototyper d'abord une carte et trois zones ; valider la lisibilité et l'équilibre avant toute extension.
- Ce mode ne doit pas retarder la première build Windows jouable ni les fondations du combat et du réseau. Respecter le budget de 0 €.

## 52. Mode Jeu d'armes (Gun Game) — ajout approuvé le 22 novembre 2026

Créer un mode arcade où chaque joueur progresse dans une séquence d'armes en réalisant des éliminations. Le mode doit être jouable en chacun pour soi, avec une variante en équipes éventuellement étudiée séparément.

### 52.1 Progression des armes
- Tous les joueurs commencent au même niveau avec la même première arme et suivent une séquence prédéfinie et identique pour tous.
- Une élimination valide fait passer le joueur à l'arme suivante ; la progression est confirmée par le serveur.
- Le premier joueur à obtenir une élimination avec la dernière arme remporte la partie, sous réserve des règles de fin et de validation.
- Définir une liste d'armes suffisamment variée, avec une progression cohérente entre catégories et difficultés d'utilisation.
- Définir explicitement le traitement des assistances, suicides, éliminations simultanées, déconnexions et égalités.
- Étudier une règle de recul d'un niveau après une élimination au corps-à-corps uniquement si elle est lisible, équilibrée et confirmée par le serveur ; cette règle n'est pas obligatoire pour le premier prototype.
- Afficher l'arme actuelle, la prochaine étape et la progression des adversaires sans révéler d'information tactique cachée.
- Les équipements et capacités donnant un avantage extérieur à la séquence d'armes doivent être désactivés ou strictement encadrés.

### 52.2 Équité et expérience
- Garantir que tous les joueurs ont accès à la même séquence et aux mêmes conditions de progression.
- Équilibrer les armes difficiles en tenant compte de leur position dans la séquence ; éviter qu'une arme impose un blocage disproportionné.
- Concevoir des cartes compactes adaptées aux rencontres fréquentes, sans apparitions directement visibles par un adversaire.
- Prévoir une durée maximale, une règle d'égalité et une fin de partie claire si personne n'atteint la dernière arme.
- Séparer les statistiques du mode des performances des modes compétitifs classiques ; aucune progression de maîtrise ne doit être artificiellement gonflée.
- Tester les abus possibles : éliminations organisées, progression par bots, échanges volontaires de morts et tentatives de manipulation du classement.

### Priorités et critères communs
- Réutiliser les armes, les règles d'élimination, le serveur autoritaire, le HUD et les statistiques existants.
- Commencer par une variante chacun pour soi sur une carte déjà validée ; les variantes en équipes et les règles spéciales restent facultatives.
- Ce mode arcade est secondaire et ne doit pas retarder la première build Windows jouable. Respecter le budget de 0 €.

## 53. Mode Capture du drapeau — ajout approuvé le 22 novembre 2026

Créer un mode en équipes dans lequel chaque camp doit récupérer le drapeau adverse et le rapporter à sa propre base, tout en protégeant son drapeau.

### 53.1 Règles et objectifs
- Chaque équipe possède une base et un drapeau clairement identifiables.
- Pour marquer, un joueur doit prendre le drapeau adverse et le rapporter à sa base ; définir si le drapeau allié doit obligatoirement être revenu à sa base pour valider une capture.
- Lorsqu'un porteur est éliminé, le drapeau tombe à un emplacement visible et peut être récupéré par son équipe ou renvoyé à sa base par un défenseur, selon les règles retenues.
- Afficher l'état des deux drapeaux, le porteur lorsqu'il est légitimement visible, les captures réalisées et le score.
- Définir une limite de temps, un score cible, les règles d'égalité, de retour automatique du drapeau et de fin de partie.
- Encadrer le port du drapeau : vitesse, armes et capacités autorisées doivent être équilibrées sans rendre le porteur impuissant ou invulnérable.
- Récompenser capture, escorte, défense de base, récupération et retour du drapeau, avec des protections contre le farming.

### 53.2 Cartes et équilibre
- Concevoir des bases suffisamment éloignées et des itinéraires alternatifs pour l'infiltration et le retour.
- Prévoir des chemins de défense et des possibilités d'interception ; éviter les lignes de tir directes entre les bases.
- Empêcher les stratégies de blocage permanent et les apparitions qui permettent de défendre sans effort.
- Tester les situations de drapeau abandonné, porteur déconnecté, capture simultanée, score à égalité et partie proche de la limite de temps.

### Priorités et critères communs
- Réutiliser les systèmes d'équipes, d'apparition, de score, de HUD, de statistiques et de réseau existants.
- Prototyper une carte et des règles simples avant de créer des variantes.
- Ce mode secondaire ne doit pas retarder la première build Windows jouable. Respecter le budget de 0 €.

## 54. Mode Une balle dans le chargeur — ajout approuvé le 22 novembre 2026

Créer un mode arcade de précision où chaque joueur dispose d'une seule balle à la fois et doit réussir ses tirs pour conserver ou récupérer des munitions.

### 54.1 Règles de jeu
- Chaque joueur commence avec une arme dédiée et une seule balle disponible dans son chargeur.
- Une élimination confirmée attribue une balle supplémentaire ou recharge immédiatement l'arme, selon la variante retenue pour le prototype.
- Un tir manqué laisse le joueur sans balle jusqu'à ce qu'il récupère une munition selon les règles de la carte ou de la partie ; choisir une règle simple et compréhensible pour éviter les joueurs définitivement bloqués.
- Définir le nombre de vies, les conditions de réapparition et la condition de victoire : dernier joueur en vie, seuil d'éliminations ou score cible.
- Prévoir un rechargement manuel uniquement si le mode le justifie ; ne pas permettre de contourner la limitation d'une balle.
- Afficher clairement les munitions restantes, les éliminations et les conditions de victoire.
- Établir des règles explicites pour les tirs simultanés, suicides, assistances, déconnexions et égalités.

### 54.2 Équité et lisibilité
- Utiliser une arme adaptée au tir précis et une configuration identique pour tous les joueurs.
- Éviter les capacités, équipements ou bonus qui fourniraient des munitions supplémentaires de manière imprévisible.
- Concevoir des cartes offrant des lignes de tir variées et des couvertures, sans favoriser exclusivement le tir à longue distance.
- Tester le rythme des manches, les situations sans munition, les éliminations simultanées et les risques de camping excessif.
- Séparer les statistiques de ce mode des statistiques compétitives classiques et empêcher le farming entre joueurs.

### Priorités et critères communs
- Réutiliser le système d'armes, de munitions, d'éliminations, de réapparition et de validation serveur.
- Commencer par une variante simple sur une carte existante ; les variantes de règles restent facultatives.
- Ce mode arcade ne doit pas retarder la première build Windows jouable. Respecter le budget de 0 €.

## 55. Approfondissements approuvés du combat et de l'armement — 22 novembre 2026

Cette section formalise huit décisions de gameplay explicitement approuvées. Elle complète les systèmes d'armes, d'accessoires, de dégâts, de score et de rechargement déjà décrits dans les sections précédentes. Elle ne doit pas créer de systèmes parallèles.

### 55.1 Gestion avancée des accessoires
- Permettre une gestion plus complète des accessoires compatibles avec chaque arme : sélection, montage, retrait et remplacement depuis l'atelier ou l'écran de configuration.
- Définir les compatibilités par arme et par emplacement ; empêcher les combinaisons techniquement impossibles.
- Afficher clairement les effets réels de chaque accessoire sur les caractéristiques utiles (maniabilité, recul, précision, vitesse de visée, mobilité ou autres paramètres effectivement implémentés).
- Éviter les accessoires strictement obligatoires : chaque choix doit présenter des compromis compréhensibles et équilibrables.
- Réutiliser le système de personnalisation et de maîtrise des armes existant ; ne pas créer une progression d'accessoires indépendante.

### 55.2 Tirs traversants selon le calibre et les matériaux
- Permettre à certains projectiles de traverser des matériaux lorsque leur énergie et leur comportement balistique le permettent.
- Déterminer la pénétration selon le calibre, le type de munition, la vitesse ou l'énergie restante et les propriétés du matériau traversé.
- Différencier les surfaces et épaisseurs ; une même arme ne doit pas traverser tous les murs ni toutes les protections.
- Appliquer une perte d'énergie et, lorsque pertinent, une modification des dégâts et de la précision après chaque traversée.
- Valider les impacts et dégâts côté serveur ; synchroniser les résultats de manière cohérente en multijoueur.
- Prévoir des effets visuels et sonores lisibles sans révéler artificiellement la position d'un joueur qui ne devrait pas être détectée.

### 55.3 Ramassage des armes laissées par les adversaires
- Autoriser un joueur à récupérer une arme abandonnée par un adversaire lorsque les règles du mode le permettent.
- Afficher une interaction claire indiquant l'arme récupérable et les conditions de ramassage.
- Définir les limites de transport, le remplacement de l'arme actuellement portée, les munitions récupérées et la durée de disponibilité au sol.
- Éviter les duplications, les ramassages simultanés incohérents et les abus de génération de munitions ; le serveur arbitre la possession.
- Respecter les restrictions des modes à équipement verrouillé ou à progression d'armes, notamment Jeu d'armes.

### 55.4 Signalement visuel des ennemis
- Fournir un retour visuel temporaire lorsqu'un ennemi est effectivement repéré par un mécanisme autorisé du jeu.
- Définir la durée, la précision et les conditions de visibilité du signalement selon le mode et la source du repérage.
- Ne pas transformer le signalement en suivi permanent à travers les murs ; limiter les informations transmises pour préserver le contre-jeu.
- Réutiliser les marqueurs tactiques contextuels et les règles d'information déjà prévues ; éviter les marqueurs redondants ou contradictoires.
- Valider côté serveur les événements de repérage qui influencent le gameplay ou le score.

### 55.5 Reconnaissance et compensation des assistances
- Reconnaître les contributions significatives ayant facilité une élimination, même lorsque le joueur n'a pas porté le coup final.
- Répartir ou attribuer la reconnaissance selon des critères mesurables : dégâts réellement infligés, actions de soutien ou repérage utile, dans les limites déjà prévues par le score de contribution.
- Définir des fenêtres temporelles, seuils et plafonds afin d'éviter les assistances artificielles et le farming.
- Présenter distinctement éliminations, assistances et contributions de soutien dans le tableau de résultats.
- Ne pas attribuer plusieurs fois une récompense complète pour une même élimination ; conserver un barème cohérent entre les modes.

### 55.6 Rechargement tactique interruptible — critères complémentaires
- Le principe et les règles fondamentales du rechargement interruptible sont définis en section 33.4 ; cette sous-section ne crée pas un second système de rechargement.
- Compléter les tests de transition avec les cas de changement d'équipement, d'élimination et de déconnexion pendant le rechargement, en plus du tir, du sprint et du changement d'arme déjà prévus.
- Vérifier les interruptions répétées, les changements rapides d'arme, la latence et toute divergence entre l'état serveur, les munitions réellement disponibles et l'animation affichée.
- Les variantes cosmétiques d'animations prévues en section 43.4 doivent conserver les mêmes timings, fenêtres d'interruption et résultats fonctionnels pour une même arme.
- Définir un seul état de rechargement faisant autorité côté serveur ; les sections 33.4 et 55.6 doivent être implémentées et testées comme une exigence unique.

### 55.7 Sélecteur de mode de tir
- Permettre de sélectionner, pour les armes réellement compatibles, le mode de tir adapté : semi-automatique, rafale avec le nombre de coups défini par l'arme, ou automatique.
- Ne proposer que les modes plausibles pour chaque modèle d'arme ; ne pas ajouter artificiellement un mode de tir à une arme qui n'en dispose pas.
- Utiliser une commande dédiée et configurable, avec un retour HUD discret indiquant le mode actif ; éviter toute confusion avec le changement d'arme ou les commandes d'équipement.
- Chaque mode doit respecter les caractéristiques de l'arme : cadence, délai entre rafales, recul, dispersion, consommation de munitions et animation. Le sélecteur ne doit pas augmenter la cadence maximale autorisée.
- Valider le mode actif et les tirs côté serveur ; synchroniser le changement de mode et empêcher les changements impossibles, les tirs supplémentaires ou les désynchronisations en cas de latence.
- Définir le comportement à la réapparition, au ramassage d'une arme, au changement d'arme et lors d'une partie avec équipement verrouillé ; ne pas contourner les règles des modes à équipement imposé.
- Prévoir une option d'accessibilité et une indication claire pour clavier/souris et manette ; tester les erreurs de commande et les changements involontaires en combat.

### 55.8 Caisses de ravitaillement à stock limité
- Ajouter sur certaines cartes ou dans les règles de certains modes des caisses de ravitaillement permettant de récupérer une quantité limitée de munitions et, si le mode l'autorise, un équipement compatible.
- Définir un stock commun clairement borné pour chaque caisse ; chaque utilisation consomme réellement une quantité disponible et une caisse vide ne fournit rien tant qu'elle n'a pas été réapprovisionnée selon les règles prévues.
- Déterminer à l'avance si les caisses sont neutres ou réservées à une équipe ; afficher leur disponibilité et leur état de manière identique et compréhensible pour tous les joueurs concernés.
- Prévoir des quantités, délais de réapprovisionnement et conditions d'accès équilibrés ; éviter qu'une équipe contrôle indéfiniment une caisse ou qu'un joueur monopolise toutes les ressources.
- Le serveur valide les interactions, le stock, les consommations et les éventuels réapprovisionnements ; empêcher les doubles prélèvements, duplications, demandes simultanées incohérentes et abus de latence.
- Ne pas transformer les caisses en source illimitée de grenades, de capacités ou d'équipements puissants ; respecter les restrictions de chaque mode et les limites de transport du joueur.
- Leur emplacement doit être lisible et contestable, sans créer de position dominante ni rendre le ravitaillement obligatoire pour gagner ; prévoir des alternatives par l'arsenal de départ ou les ressources normales du mode.
- Commencer par un prototype avec munitions uniquement, puis n'ajouter d'autres ressources qu'après mesure de leur impact sur le rythme, l'équilibre et les performances.
- Réutiliser les systèmes d'interaction, d'inventaire, de munitions et de réplication existants ; respecter le budget de 0 € et ne pas dépendre d'un service externe payant.

### Priorités et critères communs
- Réutiliser les systèmes d'armes, d'accessoires, de dégâts, de munitions, de repérage et de score déjà prévus.
- Prototyper chaque mécanisme séparément, puis vérifier leur interaction en multijoueur avec latence et déconnexions.
- Tester les cas limites : traversée de plusieurs matériaux, armes ramassées simultanément, changement d'arme, signalement expiré, assistances multiples et résultats serveur/client divergents.
- Le rechargement tactique interruptible reste régi par les règles et animations de rechargement déjà prévues ; conserver une seule implémentation cohérente de la fenêtre d'interruption et du transfert de munitions.
- Ces ajouts restent soumis aux priorités de livraison, à la stabilité réseau et au budget de 0 €.

## 56. Tournois communautaires — ajout approuvé le 22 novembre 2026

Créer un système permettant aux joueurs et aux communautés d'organiser des tournois directement dans RIXE, sans imposer le recours à un site externe pour gérer les inscriptions et les résultats.

### 56.1 Création et configuration
- Permettre à un organisateur autorisé de créer un tournoi public ou privé.
- Configurer le nom, la description, le mode compatible, la taille des équipes, le nombre de participants, les dates, les règles et les conditions d'inscription.
- Prévoir des formats individuels et par équipes, selon les modes réellement compatibles.
- Permettre de définir une limite d'inscription, une liste d'attente et une heure de clôture.
- Afficher clairement les règles, le fuseau horaire, le calendrier et les éventuelles conditions d'accès.
- Ne pas autoriser de frais d'inscription ou de récompenses monétaires intégrés sans étude juridique et approbation distincte ; le projet conserve son budget de 0 €.

### 56.2 Inscriptions et équipes
- Permettre aux joueurs de s'inscrire individuellement ou de rejoindre une équipe déjà constituée.
- Permettre aux capitaines ou organisateurs de gérer les compositions dans les limites définies.
- Prévoir une validation des participants, des remplaçants et des abandons avant le début du tournoi.
- Empêcher les inscriptions multiples abusives et les changements d'équipe destinés à contourner les règles.
- Afficher la liste des participants et le statut de chaque inscription, dans le respect des paramètres de confidentialité.

### 56.3 Déroulement et résultats
- Générer automatiquement un arbre à élimination directe pour les tournois utilisant ce format.
- Prévoir ultérieurement d'autres formats (poules ou championnat) seulement après validation de leur complexité et de leur utilité.
- Créer les salons ou organiser les rencontres à partir des systèmes de lobby existants.
- Enregistrer les résultats à partir des données de match vérifiées ; prévoir une procédure de contestation en cas de résultat incorrect ou de déconnexion.
- Gérer les retards, forfaits, égalités, abandons, reconnexions et matchs non terminés selon des règles annoncées à l'avance.
- Afficher les prochains matchs, les horaires, les adversaires, les scores et les qualifications.
- Produire un classement final et un historique des tournois terminés.

### 56.4 Administration et intégrité
- Fournir aux organisateurs des outils pour gérer les inscriptions, lancer les rencontres, signaler un incident et appliquer les règles annoncées.
- Séparer les permissions d'organisateur, d'arbitre et de participant.
- Journaliser les changements importants : résultats corrigés, forfaits, sanctions et décisions de contestation.
- Prévoir des protections contre les faux résultats, les comptes multiples abusifs, les arrangements de matchs et les manipulations de classement.
- Ne pas considérer comme incontestables les résultats de parties hébergées par un joueur si l'intégrité serveur ne peut pas être garantie.
- Permettre de signaler un tournoi ou un organisateur en cas d'abus, avec un traitement proportionné et traçable.

### Priorités et critères communs
- Réutiliser les comptes, groupes, équipes, salons, statistiques, modes et outils d'administration existants.
- Commencer par un tournoi privé simple à élimination directe, puis tester l'inscription, la génération des rencontres, la validation des résultats et les contestations.
- Ne pas lancer de classement ou de récompense compétitive de grande valeur avant de disposer de résultats suffisamment fiables.
- Le système doit rester facultatif et ne pas retarder la première build Windows jouable ni les fondations du multijoueur.
- Respecter le budget de 0 € et ne pas dépendre d'un service payant externe.

## 57. Mode Infection — ajout approuvé le 22 novembre 2026

Créer un mode asymétrique et évolutif dans lequel un joueur ou une petite équipe commence comme survivant ; chaque survivant éliminé rejoint ensuite le camp des infectés. Le mode doit privilégier la poursuite, la fuite, le placement et la coopération, sans transformer les infectés en adversaires artificiellement invulnérables.

### 57.1 Règles et progression
- Définir au lancement le nombre de joueurs initiaux du camp des infectés, en fonction de la taille de la partie ; le choix doit éviter qu'une équipe soit immédiatement submergée.
- Lorsqu'un survivant est éliminé par un infecté, il rejoint le camp des infectés après une transition courte et lisible. Le changement d'équipe et de rôle est validé par le serveur.
- Les infectés disposent d'un équipement rapproché dédié et de capacités strictement équilibrées ; les survivants conservent un arsenal limité défini par la variante.
- Définir clairement si les infectés réapparaissent, à quel délai et dans quelles conditions. Les survivants éliminés ne doivent pas pouvoir revenir dans leur ancien camp.
- Les survivants gagnent en tenant jusqu'à la fin du temps imparti ou en remplissant une condition de survie annoncée ; les infectés gagnent lorsqu'ils ont converti tous les survivants ou atteint leur condition de victoire.
- Prévoir une durée maximale, des règles d'égalité et une gestion explicite des déconnexions, abandons et parties devenues déséquilibrées.
- Afficher en permanence le nombre de survivants et d'infectés, les conditions de victoire et le temps restant.

### 57.2 Équilibrage, cartes et intégrité
- Concevoir des cartes avec des itinéraires de fuite, des espaces de repli et plusieurs accès ; éviter les positions défensives impossibles à prendre ou les zones où les survivants peuvent rester invulnérables.
- Encadrer les munitions, équipements, capacités et possibilités de réapprovisionnement des survivants pour maintenir la tension sans les rendre impuissants.
- Éviter qu'un joueur infecté puisse camper un point de réapparition ou bloquer durablement les déplacements.
- Adapter le nombre de joueurs initiaux, les délais et les ressources à la taille de lobby ; tester les petits et grands groupes.
- Séparer les statistiques de ce mode des statistiques compétitives classiques et empêcher le farming par conversions organisées.
- Le serveur arbitre les éliminations, conversions, changements d'équipe, réapparitions et résultats ; tester les conversions simultanées et les déconnexions au moment d'une élimination.

### Priorités et critères communs
- Réutiliser les systèmes d'équipes, d'élimination, de réapparition, de score, de HUD et de réseau.
- Prototyper d'abord une carte existante et une règle de conversion simple avant d'ajouter des variantes ou capacités spécifiques.
- Mode facultatif, classé désactivé au départ ; ne doit pas retarder la première build Windows jouable. Respecter le budget de 0 €.

## 58. Mode Prime — ajout approuvé le 22 novembre 2026

Créer un mode chacun pour soi dans lequel un joueur est désigné comme cible prioritaire (« joueur Prime »). Les autres joueurs cherchent à l'éliminer pour prendre sa place et obtenir la récompense associée. Le système doit maintenir une cible clairement identifiable sans révéler sa position exacte ni favoriser artificiellement le joueur déjà en tête.

### 58.1 Désignation et rotation de la cible
- Désigner une cible initiale selon une règle neutre et vérifiable, par exemple une sélection aléatoire parmi les participants éligibles.
- Le joueur qui élimine la cible devient le nouveau joueur Prime ; le changement est confirmé par le serveur et annoncé à tous.
- Si la cible est éliminée par un événement environnemental, un suicide ou une déconnexion, appliquer une règle de remplacement prédéfinie afin d'éviter les blocages et les attributions contestables.
- Définir un délai de protection très court après la désignation, si nécessaire pour éviter une élimination instantanée, sans offrir d'invulnérabilité ni d'avantage de duel.
- Prévoir une règle de départage en cas d'éliminations simultanées et une fin de partie au score cible ou à la fin du temps imparti.

### 58.2 Score et informations de jeu
- Accorder une récompense principale pour l'élimination du joueur Prime ; attribuer une récompense secondaire limitée aux éliminations ordinaires afin de maintenir l'activité de tous.
- Le joueur Prime peut obtenir un bonus de score lié à sa durée de survie ou à ses éliminations, avec plafonds et coefficients décroissants pour éviter qu'il ne creuse un écart impossible à rattraper.
- Afficher clairement l'identité de la cible et son statut, mais ne jamais transmettre sa position exacte à travers les murs ou hors des règles normales de visibilité.
- Donner à la cible un retour HUD clair indiquant son statut et les changements de Prime, sans révéler les positions des chasseurs.
- Définir explicitement les assistances, les dégâts infligés à la cible, les suicides, les éliminations environnementales, les égalités et les déconnexions.

### 58.3 Équité et anti-abus
- Empêcher les arrangements entre joueurs visant à se transmettre la prime ou à gonfler artificiellement le score ; appliquer des seuils, plafonds et contrôles de répétition.
- Éviter que le joueur Prime soit pénalisé par une révélation permanente de sa position ; son statut public doit créer un enjeu, pas une traque à travers les murs.
- Tester les écarts de score, les rotations rapides de cible, les joueurs qui quittent volontairement la partie et les lobbies de faible population.
- Utiliser les règles d'autorité serveur et de fiabilité des résultats déjà définies dans le cahier des charges.

### Priorités et critères communs
- Réutiliser les éliminations, assistances, score, HUD, statistiques et validation serveur.
- Commencer par une variante chacun pour soi avec une cible unique ; les variantes en équipes ou à plusieurs primes sont hors du premier prototype.
- Mode facultatif, non classé au départ ; respecter les priorités de livraison et le budget de 0 €.

## 59. Mode Gunfight 2v2 — ajout approuvé le 22 novembre 2026

Créer un mode tactique en petites équipes de deux joueurs, fondé sur des manches courtes et des affrontements à une vie. Les deux équipes reçoivent un équipement identique au début de chaque manche ; la composition d'armes change entre les manches selon une séquence commune afin de tester l'adaptabilité plutôt que la seule maîtrise d'un équipement favori.

### 59.1 Règles de manche
- Former deux équipes de deux joueurs ; chaque joueur ne dispose que d'une vie par manche et ne réapparaît pas avant la manche suivante.
- Une manche est gagnée lorsque les deux adversaires sont éliminés, ou lorsqu'une condition d'objectif/temps prédéfinie est remplie.
- Prévoir un objectif neutre facultatif qui s'active après un délai pour départager les manches trop passives ; son activation, sa position et son fonctionnement doivent être identiques pour les deux équipes.
- Définir le nombre de manches, le score nécessaire pour gagner la partie, le changement de côté et les règles en cas d'égalité.
- Les manches doivent être rapides, avec une phase de préparation courte et un lancement synchronisé.
- Gérer les éliminations simultanées, déconnexions, abandons, reconnexions et équipes incomplètes selon des règles annoncées avant le match.

### 59.2 Équipement commun et rotation
- Fournir aux deux équipes exactement le même équipement pour une manche donnée : armes, accessoires, munitions et équipements autorisés.
- Faire évoluer la sélection d'armes entre les manches selon une séquence prédéfinie ou un ensemble commun tiré au sort avant la partie ; aucune équipe ne doit recevoir une configuration plus favorable.
- Désactiver le ramassage d'armes adverses et les modifications d'équipement en cours de manche, sauf variante explicitement testée.
- Encadrer ou désactiver les capacités et équipements qui pourraient rompre l'égalité des conditions.
- Afficher avant chaque manche la configuration commune et les éventuelles règles particulières.

### 59.3 Équité, cartes et compétition
- Utiliser des cartes compactes adaptées au 2v2, avec plusieurs approches, des couvertures symétriques ou un équilibre démontré par les tests.
- Éviter les apparitions permettant un tir immédiat sur l'adversaire ; synchroniser le départ et garantir un court temps de mise en place si nécessaire.
- Prévoir des statistiques spécifiques : manches gagnées, éliminations, assistances, survie, dégâts et contribution à l'objectif.
- Ne pas mélanger directement les statistiques de ce mode avec celles des modes à réapparition.
- Le classé ne pourra être activé qu'après validation des résultats, de l'autorité serveur, des déconnexions et de l'équilibrage des cartes.

### Priorités et critères communs
- Réutiliser les équipes, salons, manches, arsenal, HUD, score, statistiques et règles réseau existants.
- Prototyper une carte compacte et une courte séquence d'équipements identiques ; valider ensuite le changement de côté et les cas de déconnexion.
- Mode facultatif ; ne doit pas retarder la première build Windows jouable. Respecter le budget de 0 €.

## 60. Mode diffusion et protection contre le stream sniping — ajout approuvé le 22 novembre 2026

### 60.1 Confidentialité du joueur en diffusion
- Proposer un mode diffusion facultatif qui réduit l'exposition des informations personnelles et des éléments permettant de rejoindre ou de perturber une session.
- Masquer, selon les préférences du joueur, les identifiants de compte, adresses de contact, codes de lobby, invitations privées et notifications personnelles susceptibles d'apparaître à l'écran.
- Permettre de remplacer les noms affichés dans les éléments destinés à la capture ou à la diffusion par des pseudonymes temporaires, sans modifier l'identité réelle utilisée par le serveur, les statistiques, les sanctions ou les outils de modération.
- Prévoir un aperçu clair des informations masquées et un réglage simple pour activer ou désactiver chaque catégorie ; ne jamais masquer les informations indispensables à la compréhension du gameplay ou à la sécurité du compte.
- Ne pas désactiver silencieusement les fonctions sociales : indiquer clairement si les invitations, messages ou notifications sont masqués, différés ou toujours accessibles depuis les menus.

### 60.2 Réduction du stream sniping
- Réduire l'exposition publique des informations de session qui faciliteraient la recherche ciblée d'un streamer : codes de salon, identifiants de session, région précise et détails non nécessaires sur le lobby.
- Étudier un délai facultatif de publication des informations de présence ou de résultat lorsque cela est techniquement possible, sans retarder les communications indispensables au fonctionnement du jeu.
- Ne pas retarder artificiellement les événements de gameplay, modifier le matchmaking, masquer des informations tactiques aux joueurs présents ou accorder un avantage compétitif au diffuseur.
- Préserver les outils de signalement, de modération et d'administration : les pseudonymes temporaires ne doivent jamais empêcher l'identification fiable d'un compte par les systèmes autorisés.
- Prévoir des protections contre les abus du mode, notamment son utilisation pour dissimuler une sanction, usurper l'identité d'un autre joueur ou contourner les règles de confidentialité.

### Priorités et critères de validation
- Garder cette fonctionnalité facultative, légère, compatible avec les logiciels de capture courants et sans service payant obligatoire, conformément au budget cible de 0 €.
- Tester les captures d'écran et de vidéo, les notifications système, les overlays, les invitations, les changements de lobby, les groupes, le cross-play et les différentes résolutions d'interface.
- Vérifier qu'aucune donnée privée ou information de session protégée ne réapparaît lors d'une transition d'écran, d'une reconnexion ou d'une ouverture de menu.
- Confirmer que le mode diffusion ne change ni les règles de combat, ni les performances réseau, ni les statistiques officielles, ni l'équité entre joueurs.

## 61. Vérification de la connexion avant de rejoindre une partie — ajout approuvé le 22 novembre 2026

Ajouter un diagnostic réseau facultatif, accessible avant de rejoindre une partie publique, un groupe ou un serveur communautaire. Son objectif est d'aider le joueur à repérer une connexion instable et à choisir une région adaptée avant le lancement, sans promettre un résultat réseau garanti.

### 61.1 Test préalable
- Proposer une vérification rapide avant la mise en file ou la validation d'une invitation : mesurer la latence vers les services ou points de test disponibles, la gigue, les pertes de paquets et les variations anormales de réponse.
- Distinguer clairement les mesures réellement observées, les estimations et les données indisponibles. Un test vers un service de diagnostic ne doit jamais être présenté comme une mesure exacte du ping de la future partie.
- Afficher un résultat simple et compréhensible (connexion stable, variable ou dégradée), accompagné des valeurs utiles et de leur période de mesure.
- Permettre de relancer le test et d'accéder à une explication courte des problèmes détectés, sans bloquer arbitrairement l'accès au jeu.

### 61.2 Aide au choix de région et de session
- Comparer les régions réellement disponibles à partir de mesures récentes lorsqu'elles existent ; recommander celle qui offre le meilleur compromis entre latence, stabilité et disponibilité.
- Signaler lorsqu'une région est susceptible d'offrir une connexion moins stable, mais laisser le joueur choisir une autre région ou poursuivre malgré l'avertissement.
- Pour les parties hébergées par un joueur, préciser que la qualité finale dépendra de l'hôte, de son réseau, du chemin de connexion et des autres participants ; ne pas assimiler le test préalable à une garantie de qualité.
- Ne pas contourner les règles du matchmaking, les limites de région, les préférences de groupe ou les critères d'équité définis ailleurs dans le cahier des charges.

### 61.3 Confidentialité, robustesse et coûts
- Ne pas collecter ni conserver l'adresse IP ou des données réseau détaillées au-delà de ce qui est strictement nécessaire au diagnostic ; expliquer les données utilisées et leur durée de conservation.
- Éviter les tests répétés ou intensifs qui consommeraient inutilement la bande passante, solliciteraient les services ou pénaliseraient les connexions limitées.
- Prévoir un fonctionnement dégradé si les points de mesure sont indisponibles : afficher « test indisponible » plutôt que produire un score inventé ou empêcher de jouer.
- Réutiliser les mesures, régions et outils réseau déjà prévus dans les sections consacrées au matchmaking et à la qualité de connexion ; cette section ajoute le parcours de diagnostic préalable, sans créer un second système de mesure concurrent.
- Respecter le budget cible de 0 € et ne pas dépendre d'un service de diagnostic payant obligatoire.

### Priorités et critères de validation
- Commencer par un test léger sur les régions effectivement prises en charge, puis vérifier la pertinence des recommandations sur plusieurs réseaux, plateformes et types de connexion.
- Comparer les résultats du test préalable aux mesures observées une fois en partie afin de quantifier les écarts et d'éviter toute promesse trompeuse.
- Tester les pertes, la gigue, les pics de latence, les points de mesure indisponibles, les réseaux mobiles ou limités et les changements de région.
- Confirmer que le diagnostic ne retarde pas excessivement l'accès à une partie, ne consomme pas de bande passante de façon disproportionnée et ne modifie pas l'équité du matchmaking.

## 62. Traduction instantanée du chat textuel — ajout approuvé le 22 novembre 2026

Ajouter une traduction facultative des messages du chat textuel afin de faciliter les échanges entre joueurs qui ne parlent pas la même langue.

### 62.1 Fonctionnement
- Permettre au joueur de choisir sa langue de traduction et de consulter la traduction d'un message reçu directement dans le chat.
- Conserver un accès simple au texte original, affichable à la demande ou en parallèle de la traduction.
- Permettre de désactiver la traduction globalement ou pour certains joueurs/canaux lorsque cette granularité est disponible.
- Signaler visuellement qu'un texte est une traduction automatique et non le message original.
- Ne jamais modifier le message source stocké ou transmis aux outils de modération.

### 62.2 Fiabilité, confidentialité et modération
- Afficher clairement qu'une traduction peut être approximative, notamment pour l'argot, les abréviations, les expressions et les messages très courts.
- Ne pas traduire silencieusement les noms de joueurs, identifiants, codes de salon ou commandes qui doivent rester exacts.
- Appliquer les règles de sécurité et de modération au message original ; ne pas considérer une erreur de traduction comme une preuve suffisante pour sanctionner un joueur.
- Éviter l'envoi de conversations à un service tiers sans information claire et base technique/juridique appropriée. Privilégier une solution gratuite et respectueuse de la vie privée ; si aucune solution adaptée au budget de 0 € n'est disponible, différer la fonction plutôt que d'introduire un coût caché.
- Prévoir un comportement de secours lorsque le service de traduction est indisponible : afficher le texte original sans bloquer le chat.

### Validation
- Tester les langues prises en charge, les caractères spéciaux, les messages longs, l'argot, les erreurs de service et le retour au texte original.
- Vérifier que la traduction ne retarde pas sensiblement l'affichage du chat et ne contourne ni filtres, ni blocages, ni signalements.

## 63. Centre d'aide interactif intégré — ajout approuvé le 22 novembre 2026

Créer une rubrique d'aide accessible depuis les menus de RIXE, destinée à expliquer les fonctionnalités et à guider le joueur sans l'obliger à consulter des ressources externes.

### 63.1 Contenu et recherche
- Organiser les explications par thèmes : commandes, réglages, armes, accessoires, modes, groupes, compte, réseau, accessibilité et fonctionnalités communautaires.
- Proposer une recherche par mots-clés et des réponses courtes, illustrées si utile, avec des étapes clairement ordonnées.
- Ajouter des aides contextuelles accessibles depuis les écrans concernés, sans interrompre la partie ni imposer des fenêtres répétitives.
- Prévoir des explications adaptées aux erreurs courantes et aux messages affichés par le jeu.
- Rendre consultables hors connexion les informations essentielles déjà installées avec le jeu.

### 63.2 Maintenance et expérience
- Versionner les articles et les associer à la version du jeu afin d'éviter les instructions obsolètes.
- Permettre de signaler une explication incorrecte ou devenue obsolète, sans transformer ce mécanisme en canal de signalement des joueurs.
- Garder l'interface légère, accessible à la manette et au clavier/souris, traduisible et cohérente avec les menus arrondis de RIXE.
- Ne pas dépendre d'un service payant obligatoire ni d'une IA distante pour les fonctions essentielles.

### Validation
- Vérifier la pertinence des résultats de recherche, les liens entre aides contextuelles et articles, les traductions, l'affichage sur différentes résolutions et la disponibilité hors ligne des contenus essentiels.

## 64. Pause technique encadrée pour les parties privées — ajout approuvé le 22 novembre 2026

Permettre une pause technique limitée dans les parties privées et les rencontres de tournoi compatibles, afin de gérer un incident matériel ou réseau ponctuel sans fausser le résultat. Cette fonction complète les temps morts tactiques de la section 29.4 (choix stratégique) et doit partager avec eux le même mécanisme de pause synchronisée sous autorité serveur.

### 64.1 Règles de pause
- Autoriser un nombre limité de pauses par équipe ou par rencontre, avec une durée maximale configurable par le créateur ou le règlement du tournoi.
- Afficher clairement l'équipe ou le joueur à l'origine de la demande, le motif sélectionné et le temps restant.
- Synchroniser l'arrêt et la reprise pour tous les participants, sous autorité serveur lorsque l'architecture le permet.
- Prévoir une reprise annoncée avec un court compte à rebours, afin que tous les joueurs soient prêts.
- Définir le traitement des joueurs qui restent absents à la fin du délai : reprise, forfait ou autre procédure selon le règlement de la rencontre.
- Réserver cette fonction aux contextes privés/compétitifs explicitement compatibles ; ne pas l'activer dans les parties publiques ordinaires.

### 64.2 Prévention des abus et intégrité
- Empêcher les demandes répétées, les pauses en chaîne et l'utilisation de la fonction pour casser le rythme ou obtenir un avantage tactique.
- Ne pas permettre de modifier les équipes, équipements, règles ou paramètres de la rencontre pendant la pause, sauf disposition explicitement prévue par le règlement.
- Journaliser les demandes, durées et reprises pour permettre aux organisateurs de traiter les contestations.
- Prévoir une procédure de reprise sûre en cas de déconnexion de l'hôte ou d'un participant pendant la pause.

### Validation
- Tester les demandes simultanées, les limites de durée, les refus, les déconnexions, les reprises synchronisées et les abus possibles.
- Vérifier que l'état de partie, le chronomètre, les objectifs et les statistiques reprennent sans duplication ni perte d'événement.

## 65. Export détaillé des statistiques personnelles — ajout approuvé le 22 novembre 2026

Permettre au joueur d'exporter une copie exploitable de ses propres statistiques afin de réaliser des analyses personnelles avec des outils externes.

### 65.1 Données et formats
- Proposer des formats ouverts et courants, notamment CSV et JSON, lorsque les données concernées sont disponibles.
- Laisser le joueur choisir les catégories et la période : statistiques globales, par partie, carte, arme, mode ou période, selon les données effectivement enregistrées.
- Inclure les définitions des champs, unités, dates et versions nécessaires pour interpréter correctement les données.
- Distinguer les valeurs calculées, les valeurs validées par le serveur et les données indisponibles ou incomplètes.
- Permettre un export local déclenché par le joueur, sans abonnement, service cloud payant ni publication automatique.

### 65.2 Confidentialité et limites
- N'exporter que les données personnelles du joueur et les informations agrégées ou anonymisées autorisées ; exclure les données privées et identifiants sensibles des autres joueurs.
- Respecter les paramètres de confidentialité, les règles de conservation et les droits applicables aux données du compte.
- Indiquer clairement les limites de l'export et ne pas présenter les données manquantes comme des statistiques nulles.
- Ne pas garantir un historique antérieur à la mise en place effective de la collecte.

### Validation
- Tester les fichiers CSV/JSON, les caractères internationaux, les grands historiques, les filtres de période, les données incomplètes et les autorisations.
- Vérifier que l'export ne ralentit pas les menus et qu'il ne révèle aucune donnée non autorisée.



## 66. Gestionnaire intelligent des mises à jour — ajout approuvé le 23 novembre 2026

Améliorer le téléchargement et l'installation des mises à jour de RIXE afin de donner au joueur davantage de contrôle sur les téléchargements, leur consommation de ressources et leur fiabilité.

### 66.1 Contrôle des téléchargements
- Afficher la taille totale estimée d'une mise à jour et, lorsque l'information est disponible, la quantité réellement à télécharger après déduction des fichiers déjà présents.
- Permettre de mettre en pause, reprendre ou annuler un téléchargement sans corrompre l'installation.
- Proposer une limite facultative de débit afin de ne pas saturer la connexion pendant que le joueur utilise d'autres services.
- Indiquer la progression, le débit, le temps restant estimé et l'espace disque nécessaire, en précisant qu'une estimation peut varier.
- Distinguer le téléchargement, la vérification, la préparation et l'installation ; expliquer lorsqu'un redémarrage du jeu est nécessaire.

### 66.2 Fiabilité et consommation
- Étudier les mises à jour différentielles afin de ne télécharger que les éléments modifiés lorsque cela est techniquement fiable et réellement avantageux.
- Vérifier l'intégrité des fichiers téléchargés et reprendre proprement après une coupure réseau ou un arrêt inattendu.
- Prévoir une vérification/réparation des fichiers du jeu sans imposer une réinstallation complète lorsque les éléments peuvent être réparés individuellement ; réutiliser l'outil défini en section 44.1 et le système de versions de la section 22.8, sans créer un second mécanisme.
- Éviter les écritures et vérifications inutiles sur le disque ; prévenir avant toute opération exigeant un espace temporaire important.
- Ne jamais supprimer les fichiers personnels ou configurations du joueur lors d'une mise à jour.

### 66.3 Contraintes et validation
- Privilégier une solution compatible avec le budget cible de 0 €, sans service payant obligatoire.
- Tester les téléchargements interrompus, les fichiers corrompus, les espaces disque insuffisants, les limites de débit et les mises à jour de tailles différentes.
- Mesurer le gain réel des mises à jour différentielles et conserver une méthode de mise à jour complète de secours.

## 67. Vérification des périphériques audio avant une partie — ajout approuvé le 23 novembre 2026

Ajouter un contrôle audio facultatif avant de rejoindre une partie afin que le joueur puisse vérifier rapidement son microphone, son casque ou ses haut-parleurs et éviter de découvrir un problème une fois la partie commencée.

### 67.1 Test du microphone
- Permettre au joueur d'enregistrer ou d'écouter un court aperçu de sa voix, avec une indication claire du niveau détecté.
- Afficher le périphérique d'entrée actuellement sélectionné et permettre de choisir un autre microphone disponible.
- Signaler les situations courantes : microphone muet, périphérique débranché, autorisation système refusée, niveau trop faible ou signal saturé.
- Permettre de vérifier le fonctionnement du push-to-talk et de son raccourci sans diffuser le test aux autres joueurs.

### 67.2 Test de sortie audio
- Permettre de sélectionner le casque ou les haut-parleurs et de jouer un signal de test clairement identifiable.
- Aider à détecter une sortie incorrecte, un périphérique indisponible ou un volume de sortie nul.
- Vérifier séparément les canaux gauche et droit lorsque le matériel le permet.
- Ne pas modifier automatiquement les volumes système ou les périphériques par défaut sans accord du joueur.

### 67.3 Respect du joueur et validation
- Rendre le test facultatif, rapide, accessible depuis les réglages et le lobby, sans bloquer l'accès à une partie.
- Ne pas enregistrer ni conserver les échantillons vocaux du test ; les supprimer à la fin de celui-ci.
- Ne pas considérer l'absence de microphone comme une anomalie empêchant de jouer.
- Tester les périphériques USB, Bluetooth et analogiques, les changements à chaud, les autorisations système et les configurations multi-sorties.

## 68. Tableau de santé des services RIXE — ajout approuvé le 23 novembre 2026

Créer une page d'état des services permettant aux joueurs de savoir si les fonctions en ligne de RIXE rencontrent un incident, plutôt que de confondre une panne générale avec un problème de leur installation ou de leur connexion.

### 68.1 Services et informations affichés
- Présenter séparément l'état des services réellement déployés, par exemple authentification, groupes et invitations, matchmaking, sessions de jeu, statistiques et services communautaires.
- Afficher des états simples et compréhensibles : opérationnel, dégradé, indisponible ou maintenance planifiée.
- Indiquer les régions concernées lorsqu'un incident est régionalisé.
- Afficher l'heure de début connue, la dernière actualisation et, lorsqu'elle est confirmée, une estimation de rétablissement.
- Présenter les maintenances planifiées et un historique concis des incidents récents.

### 68.2 Fiabilité de l'information
- Ne jamais afficher un service comme opérationnel si son état n'a pas pu être vérifié ; distinguer « état inconnu » d'un fonctionnement normal.
- Éviter les estimations de résolution non confirmées et horodater les informations.
- Prévoir une mise à jour automatique raisonnablement espacée et un rafraîchissement manuel.
- Garder la page consultable même lorsqu'un service principal est indisponible, dans la mesure permise par l'architecture.
- Ne pas exposer d'informations internes sensibles, de données personnelles ou de détails facilitant une attaque.

### 68.3 Contraintes et validation
- Concevoir le système pour qu'il reste léger et compatible avec le budget cible de 0 €, sans dépendance obligatoire à une plateforme de statut payante.
- Tester les pannes partielles, les états incohérents, les changements de région, les maintenances et l'indisponibilité du système de statut lui-même.
- Ne déclarer que les composants réellement surveillés ; ne pas simuler une surveillance qui n'existe pas.

## 69. Signalement de bugs avec rapport technique facultatif — ajout approuvé le 23 novembre 2026

Permettre au joueur de transmettre un signalement de bug structuré depuis RIXE afin de faciliter la reproduction et la correction des problèmes, sans lui demander de connaître les détails techniques.

### 69.1 Création du signalement
- Proposer une entrée accessible depuis les menus et, lorsque cela est pertinent, depuis l'écran de fin de partie.
- Permettre de décrire le problème en texte libre et de choisir une catégorie : crash, problème visuel, audio, commandes, réseau, interface ou gameplay.
- Proposer des champs facultatifs pour préciser les étapes permettant de reproduire le problème, le résultat attendu et le résultat observé.
- Associer automatiquement, uniquement si le joueur l'autorise, les informations utiles comme la version du jeu, le numéro de build, la plateforme et le contexte général de survenue.
- Permettre de joindre une capture d'écran ou une courte séquence lorsque cela est pris en charge et explicitement choisi par le joueur.

### 69.2 Rapport technique et confidentialité
- Proposer séparément un rapport technique facultatif contenant uniquement les éléments utiles au diagnostic, par exemple journaux pertinents, catégorie d'erreur, informations matérielles générales et état de connexion résumé.
- Présenter un aperçu des données techniques qui seront envoyées et demander un consentement explicite avant leur transmission.
- Exclure les mots de passe, jetons d'authentification, contenus privés du joueur et données personnelles non nécessaires.
- Ne pas enregistrer le chat vocal ni transmettre les conversations privées dans le cadre d'un rapport de bug.
- Permettre l'envoi sans rapport technique et afficher clairement si le signalement a été transmis, mis en attente ou n'a pas pu être envoyé.
- Prévoir une file locale temporaire et une suppression possible des rapports en attente avant leur transmission.

### 69.3 Suivi et validation
- Fournir un identifiant de signalement permettant au joueur de retrouver son envoi et son état général, sans promettre une réponse individuelle.
- Éviter les envois multiples involontaires et permettre de compléter un rapport existant lorsque c'est possible.
- Tester les rapports incomplets, les pièces jointes, les échecs réseau, les autorisations et la suppression des données sensibles.
- Respecter le budget cible de 0 € ; le volume de stockage et de traitement des rapports doit être maîtrisé.



## 70. Prolongation encadrée en cas d'égalité — ajout approuvé le 23 novembre 2026

Prévoir, pour les modes compatibles, une prolongation courte lorsqu'une partie atteint sa limite réglementaire sans départager les équipes. L'objectif est de produire une conclusion claire sans transformer chaque égalité en manche supplémentaire interminable.

### 70.1 Déclenchement et règles
- Définir explicitement, dans la fiche de chaque mode concerné, si une égalité déclenche une prolongation, les conditions de déclenchement et la durée maximale.
- Utiliser une règle de départage cohérente avec l'objectif du mode : atteindre un seuil supplémentaire, contrôler un objectif pendant une durée définie ou obtenir un avantage mesurable selon des critères annoncés avant la partie.
- Ne pas inventer une règle universelle : certains modes peuvent déclarer une égalité lorsque leur format ou leur rythme ne se prête pas à une prolongation.
- Afficher clairement le début de la prolongation, le temps restant, les conditions de victoire et les éventuelles limites spécifiques.
- Prévoir une issue déterministe si l'égalité persiste à la fin de la prolongation : égalité officielle ou critère de départage préalablement défini pour le mode. Ne jamais choisir un vainqueur au hasard.

### 70.2 Équité et continuité du match
- Conserver les équipes, les règles, les armes et les capacités autorisées, sauf règle particulière annoncée avant le lancement de la partie.
- Éviter tout changement improvisé de côté, d'équipement, de ressources ou de conditions de réapparition qui avantagerait une équipe.
- Faire valider par le serveur le déclenchement, le chronomètre, les événements de score et le résultat final ; gérer les événements simultanés et les délais réseau de façon déterministe.
- Ne pas accorder de récompense ou de progression supplémentaire simplement parce qu'une partie a duré plus longtemps ; appliquer les règles de progression existantes.
- Prévoir la gestion des déconnexions, abandons, interruptions et erreurs serveur pendant la prolongation, en réutilisant les mécanismes de continuité et de résultat existants.

### 70.3 Validation et contraintes
- Tester chaque mode séparément, notamment les égalités au dernier instant, les scores simultanés, les objectifs contestés et les événements reçus à proximité de la fin du temps réglementaire.
- Mesurer l'effet sur la durée moyenne des parties et éviter les prolongations répétées ou excessivement longues.
- Rendre la règle désactivable pour les modes où elle dégrade le rythme ou l'équilibre ; ne pas l'activer en classé avant validation de l'intégrité des résultats.
- Réutiliser les systèmes existants de chronomètre, score, objectifs, équipes et réplication ; respecter le budget cible de 0 €.

## 71. Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée — ajout approuvé le 23 novembre 2026

Cette section définit la méthode de production des modèles d'armes RIXE, leur ordre de fabrication indicatif et les règles des apparences cosmétiques de mêlée. Elle ne constitue pas une preuve que les armes ou les outils sont déjà intégrés au projet.

### 71.1 Principes de création et propriété intellectuelle
- Les armes inspirées de jeux tiers (Black Ops II, Black Ops III, XDefiant, Apex Legends ou autres) doivent être recréées de manière indépendante : ne pas extraire, convertir ou réutiliser des modèles, textures, animations, sons, fichiers ou éléments artistiques provenant des jeux.
- Ne pas reproduire à l'identique les designs distinctifs protégés d'une arme fictive sans autorisation écrite couvrant explicitement les droits nécessaires.
- Utiliser les armes des jeux sources comme références de gameplay et de documentation, et comme inspirations générales de conception uniquement dans les limites des droits applicables.
- Les statistiques d'une arme issue d'un jeu source doivent être documentées séparément du modèle visuel : jeu, version/patch, configuration de référence, cadence, dégâts, rechargement, recul, dispersion, chargeur, temps de visée, portée, perte de dégâts, vitesse de projectile et autres paramètres pertinents.
- Ne pas inventer ou modifier les statistiques de référence pour faciliter la modélisation ou l'équilibrage. Tout écart nécessaire dans RIXE doit être signalé et soumis à décision avant modification.
- Les armes originales RIXE disposent d'un design propre, conçu sans copier un modèle protégé. Les droits et licences de chaque ressource intégrée doivent être vérifiés et documentés.

### 71.2 Outils gratuits et pipeline de fabrication
- Respecter le budget de 0 € : aucun logiciel, modèle, texture, animation, son, plugin ou service payant ne doit être une dépendance obligatoire.
- Utiliser Blender pour la modélisation 3D, la séparation des pièces mobiles, les UV, le rigging et les animations.
- Utiliser Krita pour la création et la retouche des textures 2D.
- Utiliser Material Maker pour créer les matériaux et textures procédurales PBR lorsque cela est utile.
- Utiliser Unreal Engine 5 pour l'intégration, les matériaux en jeu, les animations, l'éclairage, le rendu et les tests de performance.
- Vérifier la compatibilité exacte des versions retenues avec Windows 10 et les caractéristiques de la machine avant installation ou adoption définitive. Ne pas imposer une version non vérifiée.
- Prévoir un pipeline de production : références légales et fiche de conception ; blockout/silhouette ; modélisation détaillée ; séparation des pièces mobiles ; UV ; matériaux et textures PBR ; baking/optimisation ; rigging et animations ; export ; intégration Unreal ; contrôle visuel et performance.
- Viser une qualité visuelle réaliste et détaillée comparable aux références de grands FPS, sans promettre un résultat AAA automatique : la qualité doit être évaluée sur des captures en jeu et des tests réels.
- Produire des modèles game-ready, avec géométrie adaptée, textures cohérentes, niveaux de détail si nécessaires, collisions et pièces mobiles correctement configurées.
- Réutiliser les méthodes, gabarits techniques et matériaux génériques lorsque cela est pertinent, sans rendre toutes les armes visuellement identiques.

### 71.3 Ordre indicatif de fabrication de la présélection de 34 armes
- L'ordre de fabrication est une priorité de production 3D, pas un classement de puissance, de popularité ou de valeur compétitive.
- La difficulté est estimative et doit être réévaluée après le premier prototype ; elle dépend du niveau de détail, des pièces mobiles, des animations et des ressources légales disponibles.
- Première série proposée : B23R (BO2), RK5 (BO3), D50 (XDefiant), puis AN-94 (BO2), KN-44 (BO3), ACR 6.8 (XDefiant), R-301 Carbine (Apex) et VK-47 Flatline (Apex).
- Série suivante : MSMC (BO2), VMP (BO3), MP7 (XDefiant), P90 (XDefiant), Prowler (Apex), puis LSAT (BO2), Dingo (BO3), M249 (XDefiant) et Spitfire (Apex).
- Série intermédiaire : FAL OSW (BO2), M8A1 (BO3), MK20 SSR (XDefiant), G7 Scout (Apex), puis KSG (BO2), Brecci (BO3), M870 (XDefiant) et Peacekeeper (Apex).
- Série plus exigeante : DSR 50 (BO2), Locus (BO3), TAC-50 (XDefiant) et Sentinel (Apex).
- Armes atypiques à traiter dans une série dédiée : RPG (BO2) et XM-53 (BO3). Leur présence et leurs règles doivent respecter les playlists et restrictions d'arsenal prévues.
- Les couteaux BO2 et BO3 de la présélection sont traités comme références de gameplay éventuelles ; leurs designs visuels doivent être originaux ou dûment autorisés.
- Cet ordre reste indicatif et ne transforme pas la présélection en catalogue définitivement validé. Vérifier les doublons, la disponibilité des références de statistiques, les droits et la faisabilité avant chaque production.

### 71.4 Prototype de référence et contrôle qualité
- Commencer par un seul prototype d'arme afin de définir le standard de fabrication RIXE avant de produire toute la série.
- Le prototype doit inclure le modèle détaillé, les pièces mobiles, les UV, les matériaux PBR, les textures, les animations essentielles, l'export et l'intégration dans Unreal.
- Valider le rendu en vue première personne et en inspection rapprochée : silhouette, lisibilité, matériaux, détails, éclairage, clipping, animations et performances.
- Consigner pour chaque arme sa source de référence de gameplay, sa version, ses statistiques documentées, les ressources utilisées, leurs licences, les fichiers sources Blender et les exports Unreal.
- Ne pas considérer une arme comme terminée sur la seule base d'une image de rendu ou d'une documentation : exiger une intégration testée dans une build du jeu.

### 71.5 Apparences cosmétiques de mêlée
- Proposer plusieurs apparences cosmétiques de mêlée, notamment : couteau classique, karambit, faux, masse, marteau et autres variantes visuelles originales compatibles avec l'identité de RIXE.
- Ces apparences sont des skins/variantes cosmétiques d'un même équipement de mêlée de base ; elles ne constituent pas des armes aux statistiques ou classes de gameplay différentes.
- Toutes les apparences utilisent exactement les mêmes paramètres de déplacement et de combat que l'équipement de mêlée de base : vitesse de marche, vitesse de course, accélération, mobilité, portée, dégâts, cadence d'attaque, récupération, hitbox et délais d'action identiques.
- Aucun skin ne doit procurer d'avantage ou de désavantage compétitif. Les différences de silhouette, d'animation ou de taille apparente ne doivent pas modifier la portée perçue de façon trompeuse ni la zone réelle de collision.
- Les animations et points de contact doivent rester cohérents avec l'apparence équipée, tout en conservant les mêmes fenêtres d'attaque et de récupération.
- Les skins doivent être obtenus et utilisés selon le système cosmétique/progression existant, sans créer un système parallèle. Les règles de licence et de création indépendante s'appliquent à chaque apparence.
- Prévoir une vérification visuelle et fonctionnelle de chaque skin à la première personne et à la troisième personne, notamment pour éviter les problèmes de clipping, de lisibilité et de collision.

### 71.6 Statut et contraintes
- Les éléments de cette section sont des exigences approuvées et planifiées ; ils ne sont pas réputés implémentés tant que les modèles, textures, animations et tests correspondants ne sont pas présents et vérifiés dans le dépôt et dans une build.
- Respecter le budget de 0 €, les licences des ressources, les priorités de stabilité et l'ordre général de réalisation de RIXE.

## 72. Fonds d’écran de chargement personnalisés — ajout approuvé le 27 novembre 2026

Permettre à chaque joueur de personnaliser l’arrière-plan de l’écran de chargement de RIXE en important une image depuis son propre ordinateur. Cette personnalisation est purement visuelle et ne doit apporter aucun avantage en jeu.

### 72.1 Importation et stockage local
- Ajouter dans les paramètres ou dans la personnalisation de l’interface une option « Choisir une image » ouvrant le sélecteur de fichiers de l’ordinateur.
- Accepter au minimum les formats d’image courants et sûrs, notamment PNG, JPG/JPEG et WebP, sous réserve de la prise en charge réelle par le moteur.
- Enregistrer l’image sélectionnée dans un emplacement local dédié aux données utilisateur de RIXE ; ne pas l’envoyer aux serveurs du jeu et ne pas l’intégrer aux fichiers du projet ou aux mises à jour.
- Conserver le choix entre les sessions et permettre de remplacer l’image, de supprimer l’image importée ou de revenir au fond officiel par défaut.
- Définir une taille maximale configurable et contrôler le poids, les dimensions, le format réel et la validité du fichier avant de l’utiliser. Refuser proprement les fichiers corrompus, non pris en charge ou excessivement volumineux.

### 72.2 Adaptation à l’écran et cadrage
- Adapter automatiquement l’image à la zone d’affichage de l’écran de chargement, quelles que soient la résolution et les proportions de l’écran du joueur.
- Préserver le ratio de l’image : ne jamais l’étirer ni la déformer. Utiliser un ajustement de type « couvrir » avec recadrage maîtrisé lorsque nécessaire, afin de remplir la zone sans bandes vides.
- Proposer un aperçu du résultat avant validation.
- Permettre, si cela est techniquement réalisable, de déplacer l’image et d’ajuster son zoom pour choisir la zone visible ; offrir une commande simple pour recentrer ou réinitialiser le cadrage.
- Vérifier le rendu sur plusieurs résolutions, ratios d’écran et niveaux de mise à l’échelle de l’interface, y compris les écrans ultralarges.

### 72.3 Lisibilité et fonctionnement de l’écran de chargement
- Conserver les éléments utiles de l’écran de chargement officiel, notamment la progression, les informations et les conseils éventuels ; l’image personnalisée remplace uniquement l’arrière-plan.
- Prévoir un voile ou un assombrissement réglable, ou une solution équivalente, pour garantir la lisibilité des textes et indicateurs quelle que soit l’image choisie.
- Garder les effets supplémentaires éventuels (flou, filtres ou profondeur) facultatifs et légers ; ne pas imposer de traitement coûteux.
- Charger l’image de manière asynchrone lorsque c’est possible et afficher un fond de secours si le fichier est absent, invalide ou trop lent à charger. Une image personnalisée ne doit jamais bloquer le lancement, le chargement d’une carte ou la connexion à une partie.

### 72.4 Performance, sécurité et validation
- Décoder et redimensionner l’image à une résolution adaptée à l’affichage afin de maîtriser la mémoire vidéo et la mémoire vive ; éviter de conserver inutilement plusieurs copies haute résolution.
- Ne pas exécuter de contenu intégré au fichier et ne pas traiter l’image comme une ressource active. Limiter les formats et les tailles acceptés et gérer les erreurs de décodage sans crash.
- Ne pas synchroniser l’image avec le compte, les autres joueurs ou le matchmaking ; elle reste strictement locale et n’est visible que par son propriétaire.
- Tester l’import, le remplacement, la suppression, la persistance après redémarrage, les fichiers invalides, les limites de taille, les changements de résolution et les écrans ultralarges.
- Vérifier que l’option fonctionne dans une build distribuable Windows et que son coût en mémoire, temps de chargement et performances reste négligeable.
- Prévoir une désactivation ou un retour automatique au fond officiel en cas d’erreur, sans altérer les autres paramètres ni les fichiers du joueur.

### 72.5 Statut et contraintes
- Cette fonctionnalité est une exigence approuvée et planifiée ; elle n’est pas réputée implémentée tant que l’import local, l’adaptation d’image et les tests correspondants ne sont pas présents et vérifiés dans une build.
- Respecter le budget cible de 0 €, le fonctionnement hors ligne lorsque pertinent et les règles générales de stabilité et de protection des données de RIXE.

