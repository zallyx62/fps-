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

