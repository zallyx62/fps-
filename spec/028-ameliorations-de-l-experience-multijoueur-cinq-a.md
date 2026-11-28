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

