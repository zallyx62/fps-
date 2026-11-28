## 35. Améliorations supplémentaires du rythme et de la qualité des parties

### 35.1 Protection anti-spawn-trap et réévaluation des apparitions
- Détecter les situations où un joueur ou une équipe est éliminé à répétition très peu de temps après sa réapparition, en particulier lorsque plusieurs adversaires contrôlent les sorties ou les lignes de vue.
- Exploiter les données déjà prévues par le système d'apparitions intelligentes : proximité des ennemis, lignes de vue, pression autour des points, morts récentes, sécurité des sorties et historique des apparitions.
- Réévaluer immédiatement les points disponibles et choisir automatiquement une zone plus sûre lorsqu'une apparition devient manifestement piégée.
- Ne pas rendre les joueurs invulnérables de façon abusive, ne pas téléporter un joueur après son apparition et ne pas révéler les positions ennemies.
- Prévoir des protections contre les abus : un joueur ne doit pas pouvoir provoquer artificiellement un changement de spawn pour exploiter le système.
- Mesurer les éliminations dans les premières secondes après apparition, les répétitions par zone, les apparitions annulées et les déséquilibres créés ; tester sur chaque carte et chaque mode concerné.
- Cette fonction complète le système d'apparitions intelligentes déjà prévu ; elle ne doit pas créer un second système indépendant.

### 35.2 Revanche immédiate et continuité des équipes
- À la fin d'une partie publique compatible, proposer automatiquement une continuité entre les deux équipes afin qu'elles puissent enchaîner sur une revanche sans devoir reformer un groupe ou relancer une recherche complète.
- Conserver autant que possible les équipes et les joueurs qui souhaitent rester, dans l'esprit des lobbies persistants des anciens FPS.
- Permettre une rotation vers une autre carte ou un autre mode selon la playlist, tout en gardant l'option d'une revanche sur la même carte lorsque les règles le permettent.
- Afficher clairement qui reste, qui quitte et qui rejoint ; remplacer les départs par le backfill prévu, sans bloquer indéfiniment le lancement.
- Respecter les choix de départ, les groupes préformés, les préférences de matchmaking et les règles de population. Ne jamais retenir un joueur contre son gré.
- Éviter que la continuité ne fige le matchmaking : si les équipes deviennent trop déséquilibrées ou si la qualité réseau se dégrade, appliquer les règles transparentes de rééquilibrage déjà prévues.
- Garder cette continuité facultative et compatible avec les playlists ; ne pas imposer la conservation des équipes en classé si les règles compétitives l'interdisent.

### 35.3 Protection contre les connexions instables
- Surveiller, lorsque les données sont disponibles, le ping, le jitter, les pertes de paquets, les variations brutales de latence et les désynchronisations pour chaque joueur.
- Distinguer la latence réseau de la latence locale d'entrée/rendu et des ralentissements CPU/GPU ; ne pas présenter le FPS comme une mesure du ping.
- Afficher des indicateurs compréhensibles et des avertissements utiles au joueur, sans exposer son adresse IP ni sa localisation précise.
- Utiliser la qualité de connexion comme un facteur explicable du matchmaking et du choix de région, avec un compromis transparent entre attente, niveau et stabilité.
- Détecter les dégradations temporaires pour éviter les décisions injustes fondées sur une seule mesure ; utiliser des fenêtres de mesure et des seuils validés par les tests.
- Ne jamais modifier artificiellement les dégâts, les hitboxes, la cadence, le recul ou les règles de combat pour compenser une mauvaise connexion.
- Compléter les outils de diagnostic réseau et de désynchronisation déjà prévus ; ne pas créer de systèmes redondants.
- Tester les scénarios de pertes de paquets, jitter, pics de ping, reconnexion et hôte instable. Documenter les limites du listen server et ne pas présenter ces protections comme un remplacement d'une architecture serveur compétitive.
- Respecter le budget de 0 € : aucun service payant ni hébergement supplémentaire sans accord explicite.


