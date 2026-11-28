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

