## 36. Informations de combat, continuité des groupes et progression personnelle — quatre décisions approuvées le 19 novembre 2026

### 36.1 Récapitulatif détaillé après une élimination
- Après la mort du joueur, présenter un récapitulatif clair de l'élimination : adversaire responsable lorsque connu, arme utilisée, chronologie des impacts, dégâts reçus, répartition par zone corporelle si cette fonction est activée et distance estimée lorsque la mesure est fiable.
- Distinguer les dégâts directs, dégâts de zone et éventuels dégâts déjà reçus d'autres adversaires ; ne pas attribuer à tort toute l'élimination à un seul joueur.
- Afficher uniquement les données de combat réellement enregistrées et validées par le serveur ; signaler les valeurs estimées ou indisponibles plutôt que d'inventer une précision.
- Permettre de fermer ou passer rapidement le récapitulatif pour ne pas ralentir la réapparition.
- Ne pas révéler à un joueur ou à son équipe des positions ennemies qui ne seraient pas normalement connues ; ne pas transformer l'écran de mort en outil de repérage.
- Garder une présentation lisible, concise et cohérente avec les règles de chaque mode.

### 36.2 Transfert automatique du chef de groupe
- Si le chef d'un groupe quitte, se déconnecte durablement ou perd sa session, transférer automatiquement le rôle à un membre éligible encore présent.
- Choisir le successeur selon une règle stable et annoncée, par exemple ancienneté dans le groupe ou disponibilité de session ; éviter une élection confuse à chaque micro-coupure.
- Conserver les membres, invitations, paramètres de groupe et recherche de partie autant que possible ; notifier clairement le changement de chef.
- Si le chef revient, ne pas lui reprendre automatiquement le rôle : le groupe doit rester stable, avec possibilité de transfert volontaire.
- Gérer les cas où le groupe est en file d'attente, dans un lobby, en partie ou en transition ; ne pas confondre ce transfert de responsabilité sociale avec la migration de l'hôte réseau de la partie, déjà spécifiée séparément.
- Prévoir une protection contre les transferts en boucle, les comptes inactifs et les sessions expirées.

### 36.3 Caméra de mort courte
- Dans les modes compatibles, proposer une séquence courte et passable montrant les derniers instants ayant conduit à l'élimination, reconstruite à partir des événements de partie et des données de simulation disponibles.
- Utiliser une reconstruction cohérente avec le serveur ; afficher clairement toute limite ou approximation liée à la reconstruction et à la latence.
- Ne jamais transmettre cette vue aux coéquipiers encore vivants et ne jamais révéler au joueur des informations cachées qu'il pourrait exploiter pour communiquer pendant la partie.
- Permettre de passer la séquence immédiatement et désactiver la fonction dans les modes où elle nuit au rythme ou à l'équité.
- Ne pas enregistrer de vidéo complète en continu : réutiliser les événements nécessaires au système de replay déjà prévu, avec durée de conservation et confidentialité cohérentes.
- Prévoir des protections contre les abus, notamment l'utilisation de la caméra pour identifier des positions, des stratégies ou des joueurs hors du champ de connaissance légitime.

### 36.4 Comparaison des performances avec son propre historique
- À la fin d'une partie, comparer les performances du joueur à ses propres références récentes : éliminations, morts, assists, précision, contribution aux objectifs, soutien et performances par arme, uniquement lorsque les données sont suffisamment fiables.
- Présenter les tendances sur plusieurs parties plutôt que tirer des conclusions d'un seul match ; distinguer les changements de mode, carte, arme et durée de partie.
- Mettre en avant des axes de progression concrets sans imposer de comparaison publique, de classement humiliant ou de pression artificielle.
- Permettre de consulter et filtrer son historique, avec des options de confidentialité et de suppression/export lorsque l'architecture du compte le permet.
- Ne pas modifier le matchmaking, le niveau caché ou l'équilibrage sur la seule base de ces indicateurs personnels.
- Séparer les statistiques officielles validées par le serveur des données locales d'entraînement hors ligne.

### Priorités et critères communs
- Développer d'abord le récapitulatif après élimination et le transfert du chef de groupe, une fois les données serveur et les sessions de groupe stabilisées.
- Ajouter ensuite la caméra de mort courte seulement si la reconstruction est fiable, rapide et sans fuite d'information ; réutiliser l'architecture de replay plutôt que créer un enregistreur parallèle.
- Ajouter la comparaison personnelle après validation de la qualité des statistiques et de l'historique.
- Toutes ces fonctions restent subordonnées à la build jouable, à la stabilité réseau, à la sécurité et au budget de 0 €. Aucun service payant sans accord explicite.


