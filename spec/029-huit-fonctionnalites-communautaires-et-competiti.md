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

