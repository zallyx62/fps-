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


