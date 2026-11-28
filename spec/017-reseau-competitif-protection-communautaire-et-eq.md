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

