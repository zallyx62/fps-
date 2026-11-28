## 34. Sélection compétitive et circulation sans blocage entre alliés — deux décisions approuvées le 19 novembre 2026

Cette section formalise le veto compétitif approuvé et la règle de circulation entre coéquipiers précisée par le propriétaire. Ces systèmes restent planifiés jusqu'à leur implémentation et validation en jeu.

### 34.1 Veto des cartes et équipements en compétitif
- Prévoir une phase de sélection/bannissement pour les playlists compétitives organisées qui l'activent.
- Permettre aux équipes de bannir alternativement des cartes parmi une sélection annoncée avant la procédure.
- Autoriser, uniquement dans les formats qui le prévoient, le bannissement de certaines armes ou catégories d'équipements ; publier à l'avance la liste éligible et les restrictions.
- Définir un ordre alterné, des délais raisonnables, une résolution automatique en cas d'absence de choix et une présentation identique pour les deux équipes.
- Afficher la sélection, les choix déjà effectués, les options restantes et la carte/les règles finales avant le lancement.
- Éviter les choix impossibles : conserver un nombre suffisant de cartes et d'équipements disponibles et prévoir une solution de secours déterministe.
- Ne pas imposer cette procédure au matchmaking public classique ; elle doit être réservée aux playlists compétitives, parties privées ou formats organisés compatibles.
- Enregistrer le résultat du veto dans les données de partie et les replays afin que les statistiques comparent des configurations équivalentes.
- Tester les abandons, déconnexions, égalités, délais expirés et désaccords de version ; ne pas permettre de modifier la sélection après le début de la partie.

### 34.2 Circulation entre alliés : non-collision de gameplay façon XDefiant, The Finals et Call of Duty
- Viser le ressenti pratique observé dans XDefiant, The Finals et Call of Duty : les coéquipiers ne doivent pas se bloquer physiquement et doivent pouvoir se croiser naturellement, y compris dans les portes, couloirs, escaliers et zones d'objectif. Il s'agit de reproduire le résultat de gameplay attendu, pas de copier une implémentation propriétaire.
- Désactiver les collisions de déplacement bloquantes entre capsules alliées. La collision allié-allié ne doit jamais arrêter, ralentir, repousser, dévier ou immobiliser le mouvement d'un joueur.
- Ne pas utiliser de séparation physique, de répulsion ou de correction de position qui recrée indirectement du body-block. Aucun mur invisible, aucune file d'attente forcée et aucune téléportation pour dégager un passage.
- Accepter une superposition visuelle temporaire entre alliés si nécessaire à la fluidité. Tout éventuel ajustement visuel doit rester strictement cosmétique : il ne doit modifier ni la position de gameplay, ni la trajectoire, ni la vitesse, ni la visée, ni les collisions.
- Les alliés peuvent se traverser sans friction ni blocage. Dans les modes officiels standards, les tirs, projectiles, explosions et effets alliés ne doivent pas blesser ou tuer les coéquipiers ; aucune exception par défaut.
- Les ennemis conservent les collisions et interactions normales prévues par le mode : un joueur ne traverse pas un adversaire et ne bénéficie d'aucune protection supplémentaire contre ses tirs.
- Assurer un comportement identique côté serveur et client : règles de collision explicites, autorité serveur sur les interactions, prédiction client sans blocage local et corrections réseau discrètes. Vérifier que les capsules, traces d'armes, projectiles et interactions avec le décor ne réintroduisent pas de blocage indirect.
- Tester les croisements simultanés à plusieurs joueurs, portes étroites, couloirs, escaliers, objectifs, apparitions, sauts, sprint, glissades éventuelles et connexions à latence élevée.
- Critères d'acceptation : aucun allié ne peut empêcher physiquement un autre allié d'avancer ; aucune répulsion forcée ni déviation de gameplay ; les ennemis et le décor restent correctement bloquants ; tirs amis désactivés dans les modes standards.
- Commencer par un prototype multijoueur dans une carte de test, puis vérifier les cas limites avant généralisation à toutes les cartes et tous les modes.
### Priorités et critères communs
- Prototyper la circulation alliée avec plusieurs personnages dans des couloirs étroits avant de l'étendre à toutes les cartes.
- Vérifier que le système ne crée ni body block, ni superposition exacte, ni déplacement forcé, ni avantage défensif artificiel.
- Développer le veto après stabilisation des playlists compétitives, du système de groupes et de la sélection de cartes.
- Conserver le matchmaking public simple et rapide ; ne pas retarder la première build jouable.
- Respecter le budget de 0 € et ne pas ajouter de dépendance payante sans accord explicite.

