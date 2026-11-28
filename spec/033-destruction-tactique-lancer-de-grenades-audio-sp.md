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


