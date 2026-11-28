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

