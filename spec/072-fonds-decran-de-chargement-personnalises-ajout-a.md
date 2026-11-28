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

