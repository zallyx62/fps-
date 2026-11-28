## 47. Analyse détaillée des échanges de tirs — extension approuvée le 22 novembre 2026

Cette fonctionnalité approfondit le récapitulatif après élimination déjà prévu en section 36.1. Elle ne doit pas créer un second système de replay ou de statistiques : elle réutilise les événements de combat et les données validées par le serveur. Elle reste planifiée et ne sera considérée comme implémentée qu'après validation sur une build réelle.

### 47.1 Rapport personnel d'un échange de tirs
- Après une élimination, proposer un rapport facultatif et consultable sans ralentir la reprise de partie, qui explique l'échange de tirs entre le joueur et son adversaire lorsque les données nécessaires sont disponibles.
- Présenter séparément les dégâts infligés par le joueur et les dégâts reçus, en identifiant les tirs confirmés, les impacts et les éventuelles éliminations/assistances liées à l'échange.
- Indiquer, lorsque les données serveur sont fiables : nombre de tirs tentés et confirmés, zones corporelles touchées, dégâts par impact, arme utilisée, ordre chronologique des événements et distance estimée avec une marge d'incertitude.
- Distinguer clairement les tirs ratés, les impacts sur l'environnement, les impacts confirmés sur un adversaire et les dégâts réellement appliqués ; ne jamais déduire un impact à partir du seul retour visuel ou sonore du client.
- Expliquer les limites possibles : dégâts atténués, protections, obstacles, tirs simultanés, latence, événements manquants ou données indisponibles. Ne pas inventer de cause certaine lorsqu'elle ne peut pas être établie.
- Lorsque le joueur a perdu le duel, résumer les éléments observables sans jugement : dégâts échangés, chronologie, précision et éventuelles différences de portée ou de position si elles sont mesurables.
- Ne pas révéler de position ennemie cachée, d'information reçue après la mort qui pourrait être transmise aux coéquipiers, ni de donnée que le joueur ne pouvait légitimement connaître. Respecter les restrictions du replay et de la caméra de mort.
- Permettre de fermer ou ignorer immédiatement le rapport ; aucune animation ou analyse ne doit retarder la réapparition, le spectateur ou le retour au jeu.
- Ne pas transformer ce rapport en outil de surveillance des autres joueurs : l'affichage est personnel, limité aux événements pertinents et soumis aux règles de confidentialité.
- Critères de validation : duel gagné/perdu, élimination simultanée, assistance, dégâts réduits, tirs traversant des matériaux autorisés, latence élevée, données incomplètes, plusieurs adversaires, modes sans réapparition et absence de fuite d'information.

### Priorités et critères communs
- Étendre le récapitulatif de la section 36.1 au lieu de créer une interface ou un historique parallèle.
- Réutiliser les événements de combat validés côté serveur et les données de replay strictement nécessaires ; ne pas enregistrer de vidéo continue pour cette fonction.
- Afficher les indicateurs indisponibles comme tels et différencier faits confirmés, estimations et données absentes.
- Mesurer le coût CPU, mémoire, stockage et réseau ; limiter la quantité et la durée de conservation des données.
- Fonction facultative et secondaire : ne pas retarder la première build Windows jouable, la stabilité du combat ou du réseau. Respecter le budget de 0 €.


