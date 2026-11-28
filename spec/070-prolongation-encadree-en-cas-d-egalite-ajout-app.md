## 70. Prolongation encadrée en cas d'égalité — ajout approuvé le 23 novembre 2026

Prévoir, pour les modes compatibles, une prolongation courte lorsqu'une partie atteint sa limite réglementaire sans départager les équipes. L'objectif est de produire une conclusion claire sans transformer chaque égalité en manche supplémentaire interminable.

### 70.1 Déclenchement et règles
- Définir explicitement, dans la fiche de chaque mode concerné, si une égalité déclenche une prolongation, les conditions de déclenchement et la durée maximale.
- Utiliser une règle de départage cohérente avec l'objectif du mode : atteindre un seuil supplémentaire, contrôler un objectif pendant une durée définie ou obtenir un avantage mesurable selon des critères annoncés avant la partie.
- Ne pas inventer une règle universelle : certains modes peuvent déclarer une égalité lorsque leur format ou leur rythme ne se prête pas à une prolongation.
- Afficher clairement le début de la prolongation, le temps restant, les conditions de victoire et les éventuelles limites spécifiques.
- Prévoir une issue déterministe si l'égalité persiste à la fin de la prolongation : égalité officielle ou critère de départage préalablement défini pour le mode. Ne jamais choisir un vainqueur au hasard.

### 70.2 Équité et continuité du match
- Conserver les équipes, les règles, les armes et les capacités autorisées, sauf règle particulière annoncée avant le lancement de la partie.
- Éviter tout changement improvisé de côté, d'équipement, de ressources ou de conditions de réapparition qui avantagerait une équipe.
- Faire valider par le serveur le déclenchement, le chronomètre, les événements de score et le résultat final ; gérer les événements simultanés et les délais réseau de façon déterministe.
- Ne pas accorder de récompense ou de progression supplémentaire simplement parce qu'une partie a duré plus longtemps ; appliquer les règles de progression existantes.
- Prévoir la gestion des déconnexions, abandons, interruptions et erreurs serveur pendant la prolongation, en réutilisant les mécanismes de continuité et de résultat existants.

### 70.3 Validation et contraintes
- Tester chaque mode séparément, notamment les égalités au dernier instant, les scores simultanés, les objectifs contestés et les événements reçus à proximité de la fin du temps réglementaire.
- Mesurer l'effet sur la durée moyenne des parties et éviter les prolongations répétées ou excessivement longues.
- Rendre la règle désactivable pour les modes où elle dégrade le rythme ou l'équilibre ; ne pas l'activer en classé avant validation de l'intégrité des résultats.
- Réutiliser les systèmes existants de chronomètre, score, objectifs, équipes et réplication ; respecter le budget cible de 0 €.

