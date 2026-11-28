## 23. Nouvelles fonctionnalités communautaires et confort de partie — approuvées

Ces cinq fonctionnalités sont approuvées et planifiées. Elles ne sont pas considérées comme implémentées tant qu'elles n'ont pas été développées et testées dans une build réelle.

### 23.1 Roue de communication rapide
- Ajouter une roue de communication accessible rapidement, notamment à la manette et au clavier, avec des messages courts prédéfinis : « ennemi repéré », « besoin de renfort », « défendez l'objectif », « je recharge », « regroupez-vous », « danger », « merci » et « bien joué ».
- Prévoir une présentation textuelle claire et, si possible sans dépendance payante, des annonces vocales préenregistrées ou synthétiques uniquement si la licence et la taille le permettent.
- Transmettre uniquement les informations que le joueur est autorisé à communiquer ; une indication directionnelle ou de position ne doit pas révéler une information inconnue du joueur.
- Ajouter limitation de fréquence, mute, désactivation et protections anti-spam.
- Adapter l'interface aux plateformes et périphériques pris en charge.
- Ajouter quelques gestes tactiques silencieux déclenchés depuis la roue ou des raccourcis : « suivre », « rester ici », « danger », « zone à surveiller » et « besoin d'aide ».
- Représenter le geste par une animation courte du personnage et, si nécessaire, un pictogramme discret pour les alliés ; ne pas révéler une information que le joueur ne connaît pas.
- Rendre les gestes visibles uniquement dans des conditions cohérentes avec la visibilité réelle du personnage ; ne pas transmettre de signal à travers les murs ou à distance irréaliste.
- Permettre de réduire ou désactiver les animations reçues, tout en conservant éventuellement le pictogramme ou le texte ; les gestes ne doivent jamais bloquer le tir, le rechargement, le sprint ou une action essentielle.
- Répliquer seulement le type de geste et les informations utiles, avec des limites anti-spam ; ne pas attribuer de points ou de progression à leur répétition.
- Prévoir des commandes accessibles au clavier et à la manette, configurables et compatibles avec les options d'accessibilité.

### 23.2 Échauffement pré-match de dix secondes — isolation totale des équipes
- Avant le début officiel de chaque partie, prévoir une phase d'échauffement de **10 secondes**, inspirée des salons d'échauffement des anciens Call of Duty.
- Pendant cette phase, chaque joueur peut librement marcher, courir, sprinter, sauter, viser, tirer, recharger, changer d'arme et tester les grenades ou équipements disponibles dans le mode.
- Les joueurs peuvent entendre les sons de leur propre équipe, mais **aucun son de l'équipe adverse ne doit leur parvenir** : tirs, impacts, explosions, grenades, pas, sauts, rechargements, voix, communications et autres événements audio.
- L'isolation doit être appliquée techniquement côté serveur et/ou par le système de réplication audio : ne pas simplement baisser le volume adverse dans les réglages locaux. Aucun événement audio adverse ne doit être transmis ou rendu audible pendant cette phase.
- Les deux équipes ne doivent recevoir aucune information sur les actions de l'autre équipe : positions, déplacements, visée, tirs, grenades, équipement, changements d'arme, éliminations, messages, marqueurs, indicateurs, killfeed ou notifications. Ne pas transmettre ces informations aux clients adverses pendant l'échauffement lorsque cela est techniquement possible.
- Prévoir une séparation des espaces ou des instances d'échauffement si nécessaire afin d'empêcher les joueurs de voir l'équipe adverse. Si les joueurs partagent physiquement la même carte, masquer les silhouettes, noms, effets, projectiles et autres indices visuels adverses.
- Les joueurs peuvent tester librement les armes et équipements ; les munitions peuvent être réapprovisionnées et les réapparitions rapides autorisées pour éviter les temps morts.
- Les tirs, dégâts, grenades, éliminations et autres actions de l'échauffement ne comptent pas dans les statistiques, le score, les défis, les replays officiels ou le résultat de la partie. Aucun effet persistant ne doit influencer le début officiel.
- À la fin des dix secondes, terminer l'échauffement, réinitialiser les états nécessaires (santé, munitions, grenades, positions et équipements selon les règles du mode), puis démarrer simultanément la partie officielle pour les deux équipes.
- Synchroniser le compte à rebours avec l'autorité de partie. Gérer proprement les chargements tardifs, pertes de connexion et arrivées tardives ; ne pas démarrer avec des états différents entre clients.
- L'échauffement doit être identique pour tous les joueurs du match et ne doit procurer aucun avantage d'information ou de position au lancement officiel.

### 23.3 Rotation intelligente des cartes et des modes
- Éviter les répétitions excessives d'une même carte ou d'un même mode dans les playlists concernées.
- Tenir compte de l'historique récent des parties, de la population disponible et des contraintes de matchmaking.
- Si un vote est proposé, offrir un choix équitable et éviter que le système ne favorise toujours la même carte.
- Ne pas imposer une carte incompatible avec le mode ou les règles de la playlist.
- Garder une rotation déterministe et explicable ; ne pas modifier le matchmaking pour masquer une population insuffisante.

### 23.4 Historique des changements du jeu
- Mettre à disposition des notes de version consultables et archivées : changements d'armes, cartes, règles, corrections et améliorations techniques.
- Associer chaque version aux identifiants de build, branche/commit de développement et date de publication lorsque ces informations sont disponibles.
- Permettre de retrouver les notes des versions précédentes et d'identifier les changements pouvant affecter les statistiques ou replays.
- Ne publier que des informations vérifiées ; distinguer clairement les changements livrés des changements prévus.

### 23.5 Protection contre les erreurs de manipulation
- Demander une confirmation pour les actions destructrices ou difficiles à annuler, par exemple supprimer un profil local ou réinitialiser des paramètres.
- Prévoir une restauration des paramètres par défaut et, lorsque cela est faisable, une sauvegarde des configurations avant modification.
- Permettre plusieurs profils de commandes et de réglages sans écraser accidentellement le profil actif.
- Étendre cette gestion avec des profils de commandes associés à un contexte choisi (par exemple entraînement, menus ou partie), avec sélection automatique uniquement si le joueur l'active.
- Permettre de nommer, dupliquer, importer et exporter les profils dans des formats sûrs ; signaler les conflits et périphériques/commandes indisponibles avant application.
- Préserver un profil global de secours, permettre le retour au profil précédent et éviter toute modification silencieuse des affectations.
- Éviter les confirmations répétitives pour les actions quotidiennes non risquées.
- Ne jamais présenter une suppression distante ou une restauration cloud comme réversible si elle ne l'est pas réellement.

### Statut
Les cinq fonctionnalités sont approuvées et planifiées. Leur priorité est inférieure à la correction des blocages, à la stabilité du FPS multijoueur et à l'obtention d'une build jouable et testable.


