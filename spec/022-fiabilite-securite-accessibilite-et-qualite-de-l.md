## 22. Fiabilité, sécurité, accessibilité et qualité de livraison — nouveaux ajouts approuvés

Les dix axes ci-dessous sont approuvés et doivent être intégrés à la planification. Leur présence dans le cahier des charges ne signifie pas qu'ils sont déjà implémentés. Chaque axe doit être évalué, prototypé et testé selon les priorités, les contraintes de budget (0 €) et la capacité réelle du projet.

### 22.1 Diagnostic et correction des désynchronisations de combat
- Mesurer les écarts entre l'état présenté au client et l'état autoritatif validé par le serveur : positions, tirs, impacts, dégâts et événements.
- Identifier les symptômes de latence, jitter, pertes de paquets et corrections de prédiction ; distinguer clairement un problème réseau d'un comportement suspect.
- Corriger les écarts visuels progressivement lorsque cela ne compromet pas la cohérence compétitive ; ne jamais falsifier l'état autoritatif.
- Fournir des diagnostics techniques reproductibles et respectueux de la vie privée, avec collecte minimale et durée de conservation définie.
- Tester les cas limites sur différentes latences, pertes de paquets et fréquences d'images.

### 22.2 Séparation des parties classées et non classées selon leur niveau de confiance
- Ne proposer de classement officiel que pour des parties dont l'intégrité des résultats peut être suffisamment garantie.
- Évaluer les limites de l'hébergement par un joueur : avantage potentiel de l'hôte, autorité réelle, départ de l'hôte, falsification des résultats et résistance aux manipulations.
- Séparer clairement les parties privées, publiques non classées et classées ; afficher le type d'hébergement et les garanties réelles avant la partie.
- Si une autorité indépendante et fiable n'est pas disponible, désactiver le classement officiel plutôt que prétendre qu'il est sécurisé.
- Ne pas imposer de serveurs payants : toute architecture doit respecter le budget de 0 € ou être soumise à approbation avant dépense.

### 22.3 Accessibilité complète
- Ajouter des options de daltonisme et de distinction des équipes qui ne reposent pas uniquement sur la couleur.
- Permettre de régler tailles de texte, sous-titres, éléments du HUD, contraste et lisibilité.
- Proposer une réduction ou désactivation des flashs, secousses de caméra et effets visuels agressifs, dans les limites de l'équité.
- Séparer les volumes des armes, pas, explosions, interface et communications.
- Proposer des indices visuels facultatifs pour certains sons importants, sans révéler d'informations que le joueur ne pourrait normalement pas connaître.
- Permettre de choisir entre maintenir une touche et basculer un état pour les actions compatibles.
- Vérifier que les options ne fournissent aucun avantage compétitif injuste et qu'elles fonctionnent sur les plateformes prises en charge.

### 22.4 Tutoriel progressif et apprentissage facultatif
- Construire des exercices courts pour les déplacements, le tir, le rechargement, les armes et les objectifs.
- Proposer des entraînements facultatifs adaptés aux difficultés observées, sans pénalité ni obligation.
- Expliquer les notions d'attaque, défense, soutien et coopération.
- Permettre de passer, reprendre ou recommencer chaque exercice.
- Ne pas exposer les données personnelles ou les performances individuelles publiquement ; utiliser uniquement les informations nécessaires pour adapter les exercices.

### 22.5 Laboratoire de validation et d'équilibrage des armes
- Développer des outils internes pour mesurer dégâts, portée, dispersion, recul, cadence, temps de rechargement et récupération de précision.
- Comparer des configurations d'armes dans des conditions reproductibles.
- Tester les armes selon différentes distances, fréquences d'images et conditions réseau.
- Générer des rapports comparatifs versionnés pour les développeurs.
- Ne pas modifier automatiquement les valeurs en partie ; tout changement doit être testé, documenté et réversible.
- Le laboratoire complète le stand de tir joueur, mais ne le remplace pas.

### 22.6 Batterie de validation automatique des cartes
- Détecter les apparitions dans des géométries invalides, dangereuses ou immédiatement exposées.
- Repérer les risques de blocage, zones inaccessibles, collisions incorrectes, passages involontairement réservés à une équipe et objectifs impossibles à atteindre.
- Mesurer les distances entre apparitions, objectifs et zones de combat, sans remplacer les tests humains d'équilibrage.
- Contrôler les performances, les lignes de vue et les possibilités de sortie de carte.
- Produire un rapport exploitable avant validation d'une carte officielle ou communautaire.
- Les résultats automatisés sont des alertes à examiner, pas une preuve suffisante d'équilibrage.

### 22.7 Sécurité et contrôle des sessions de compte
- Permettre au joueur de consulter les sessions et appareils connectés et de révoquer une session à distance.
- Prévoir une récupération de compte sécurisée et des protections renforcées pour les opérations sensibles.
- Protéger les changements d'adresse e-mail, les liaisons/déliaisons de plateformes et les modifications des moyens de récupération.
- Informer le joueur des changements de sécurité importants.
- Ne jamais stocker de mots de passe en clair ; appliquer les bonnes pratiques d'authentification, de limitation des tentatives et de protection des secrets.
- Ne pas créer de mécanisme de sécurité qui nécessite un service payant sans approbation explicite.

### 22.8 Compatibilité des versions et mises à jour réversibles
- Vérifier la compatibilité des versions client, serveur, cartes et données de gameplay avant une connexion.
- Détecter les fichiers manquants, corrompus ou incompatibles et expliquer clairement la correction nécessaire.
- Empêcher qu'un client puisse imposer des données de gameplay non autorisées au serveur.
- Versionner les paramètres d'armes, cartes, règles et formats de données.
- Prévoir une procédure de retour à une version précédente lorsque cela est techniquement et juridiquement possible.
- Documenter les changements susceptibles d'affecter les replays, les statistiques et la compatibilité multijoueur.

### 22.9 Profilage des performances sur configurations modestes
- Mesurer les FPS, temps de frame, saccades, mémoire, temps de chargement, coûts CPU/GPU et charge réseau.
- Identifier les cartes, effets, bots et systèmes de réplication les plus coûteux.
- Définir des profils graphiques cohérents et préserver la lisibilité compétitive à faible niveau de détail.
- Tester sur plusieurs catégories de matériel réellement disponibles, sans inventer de configuration minimale non mesurée.
- Comparer les résultats avant/après chaque changement important et conserver des références de performance.
- Ne pas sacrifier l'équité visuelle entre plateformes.

### 22.10 Tests automatiques de non-régression du gameplay
- Créer des tests reproductibles couvrant les règles essentielles : munitions, cadence de tir, dégâts, mort, score, objectifs, apparitions, équipes, bots et sauvegarde des paramètres.
- Vérifier qu'une action ne peut pas attribuer plusieurs fois les mêmes points ou événements.
- Vérifier que les clients ne peuvent pas imposer au serveur les dégâts, résultats ou récompenses.
- Ajouter des tests réseau, de reconnexion et de compatibilité lorsqu'ils deviennent disponibles.
- Exécuter les tests pertinents après chaque modification et avant toute livraison.
- Consigner les tests réellement exécutés, leurs résultats, les limites connues et le commit testé ; ne jamais déclarer un test réussi s'il n'a pas été exécuté.

### Ordre de priorité recommandé
1. Tests automatiques de non-régression et diagnostic des désynchronisations.
2. Confiance et intégrité des parties classées.
3. Laboratoire de validation des armes et validation automatique des cartes.
4. Compatibilité des versions, profilage des performances et sécurité des sessions.
5. Accessibilité et tutoriel progressif.

### Règles de réalisation
- Ces axes ne doivent pas détourner l'équipe des blocages actuels, de l'audit des licences, de la stabilité du multijoueur et de la production d'une version jouable.
- Privilégier des prototypes réduits, mesurables et livrables ; découper ou reporter les systèmes trop ambitieux.
- Aucune dépense, dépendance payante ou infrastructure payante sans accord explicite du propriétaire.
- Aucune fonctionnalité ne peut être marquée « terminée » sur la seule base de sa spécification ou de code non testé.
- Pour chaque axe : préciser l'état réel (non commencé, en cours, prototype, testé, livré), les dépendances, les risques, les tests et les preuves de validation.


