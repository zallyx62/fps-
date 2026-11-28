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

