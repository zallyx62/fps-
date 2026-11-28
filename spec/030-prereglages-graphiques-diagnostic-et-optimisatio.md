## 30. Préréglages graphiques, diagnostic et optimisation — huit ajouts approuvés le 19 novembre 2026

Cette section complète les paramètres vidéo et les objectifs de performance existants. Elle décrit des fonctions planifiées : aucune n'est considérée comme livrée avant implémentation et tests sur des builds réelles.

### 30.1 Six préréglages graphiques
Proposer six préréglages clairement nommés :
1. **Ultra performance** : priorité maximale à la fluidité ; désactiver ou réduire fortement les effets graphiques coûteux (ombres, reflets, effets secondaires, qualité d'éclairage et détails non essentiels) lorsque cela est techniquement sûr.
2. **Performance** : privilégier les FPS tout en conservant certains effets visuels simples.
3. **Équilibré** : compromis recommandé entre qualité et fluidité.
4. **Qualité élevée** : améliorer textures, ombres, éclairage et effets selon les capacités du matériel.
5. **Très haute qualité** : pousser davantage les détails et effets avancés compatibles.
6. **Ultra** : proposer la meilleure qualité réellement disponible sur la configuration, sans activer aveuglément une option incompatible.

Règles obligatoires :
- Les préréglages ne modifient jamais le gameplay, les hitboxes, les dégâts, le recul, la cadence, les déplacements, les collisions, les règles réseau ou l'équilibrage.
- Préserver la visibilité des adversaires, les silhouettes, les télégraphies, les projectiles et tous les indices visuels qui transmettent une information tactique.
- Ne pas supprimer un effet fonctionnel de gameplay (fumée, explosion, signal d'objectif, etc.) ; réduire uniquement son coût ou sa présentation sans changer son information, sa durée, sa portée ou son comportement.
- Les options graphiques avancées doivent être activées uniquement si le matériel et le chemin de rendu les prennent réellement en charge.
- **Équilibré est le préréglage sélectionné par défaut** lors d'une première installation, puis le jeu peut proposer un benchmark pour affiner le choix sans rien modifier sans accord.
- Ajouter une entrée **Personnalisé**, distincte des six préréglages : elle permet de modifier individuellement les options, de sauvegarder plusieurs configurations nommées, de les renommer/supprimer et de restaurer un préréglage de départ. Ne pas créer un septième préréglage prédéfini.
- Afficher les valeurs réellement actives et signaler clairement lorsqu'une option est indisponible ou remplacée par une solution de secours.
- Ne fixer aucun quota universel de FPS par préréglage. Chercher la meilleure fluidité réellement possible selon le matériel, la résolution et les options choisies, avec une priorité particulière à la régularité des images (frame pacing) plutôt qu'à une moyenne élevée mais instable.
- Mesurer, lorsque possible, FPS moyens, 1 % low, temps de frame, pics de temps de frame et saccades. Distinguer les FPS réellement rendus des images interpolées/générées.
- Les préréglages sont des points de départ et non une garantie de FPS identique sur tous les matériels.

### 30.2 Benchmark graphique intégré
- Ajouter un test de performances accessible depuis les paramètres vidéo.
- Utiliser une séquence reproductible représentant une charge réaliste du jeu, sans exposer d'informations tactiques ni modifier les statistiques officielles.
- Mesurer et afficher, lorsque les données sont disponibles, FPS moyens, 1 % low / stabilité des images, temps de frame et éventuels indicateurs CPU/GPU.
- Comparer les résultats avant/après un changement et proposer un préréglage adapté, sans appliquer de changement sans accord du joueur.
- Préciser la scène, la résolution, les options et les limites du test ; ne pas présenter une mesure courte comme une garantie de performances en partie réelle.

### 30.3 Mode faible latence
- Étudier une option de réduction de latence de rendu et d'entrée, compatible avec les API et pilotes réellement disponibles.
- Optimiser la file de rendu, la synchronisation et le traitement des entrées lorsque cela réduit effectivement le délai.
- Distinguer clairement latence d'entrée/rendu, latence réseau et ping ; ne pas les confondre dans l'interface.
- Ne pas promettre de gain universel et ne pas sacrifier la stabilité, la précision d'affichage ou la compatibilité pour un bénéfice non mesuré.
- Garder les technologies propriétaires optionnelles et prévoir un comportement de secours.

### 30.4 Précompilation et cache des shaders
- Préparer les shaders nécessaires avant l'entrée en partie lorsque la plateforme le permet.
- Afficher une progression claire lors de la première compilation ou après une mise à jour importante.
- Mettre en cache les shaders compilés et éviter les recompilations inutiles.
- Gérer proprement invalidation, versions, espace disque et cache corrompu ; permettre une reconstruction sûre du cache.
- Réduire les saccades de compilation en cours de partie sans bloquer indéfiniment le lancement du jeu.

### 30.5 Réglages de visibilité et de confort visuel
- Ajouter des options pour régler contraste de l'interface, intensité des flashs, effets lumineux perturbants, taille/échelle du HUD et lisibilité des marqueurs.
- Compléter les options d'accessibilité déjà prévues (daltonisme, sous-titres, contrastes, réduction des effets).
- Ne pas permettre de supprimer les obstacles visuels, fumées, effets ou indices tactiques pour obtenir un avantage compétitif ; les réglages doivent préserver une information équivalente entre joueurs.
- Fournir des valeurs recommandées, un aperçu et une réinitialisation.

### 30.6 Diagnostic automatique et profils graphiques par carte
- Ajouter un diagnostic local qui aide à identifier les causes probables de problèmes : saturation CPU/GPU, mémoire vidéo, saccades, compilation de shaders, pertes de paquets et instabilité réseau.
- Séparer les mesures locales des informations réseau ; ne jamais affirmer qu'un diagnostic client prouve une triche ou identifie avec certitude la cause d'un incident.
- Proposer des pistes de correction explicables, sans modifier les réglages ni transmettre des données sans consentement.
- Mémoriser les performances et réglages testés par carte afin de signaler les cartes plus exigeantes et proposer un ajustement avant leur lancement.
- Le joueur garde toujours le contrôle : pas de changement silencieux en pleine partie, possibilité de désactiver les recommandations et de conserver ses réglages globaux.
- Les profils par carte ne doivent jamais créer de différence de gameplay ou d'information tactique.

#### Comparateur de configuration matérielle

- Ajouter au diagnostic local une fiche indiquant les caractéristiques matérielles utiles au fonctionnement de RIXE : processeur, carte graphique, mémoire vive, mémoire vidéo lorsque disponible, système d'exploitation et espace disque.
- Comparer ces caractéristiques aux configurations minimale et recommandée officiellement définies pour la version du jeu installée. Ne pas inventer de seuils : les exigences doivent être établies et validées par des tests sur des configurations réelles.
- Présenter clairement les composants qui respectent les recommandations, ceux qui se situent en dessous et les informations qui n'ont pas pu être détectées.
- Fournir une estimation prudente des éventuels points limitants et des réglages à essayer, en précisant qu'un composant isolé ne permet pas de prédire exactement les FPS ni d'établir avec certitude la cause d'un ralentissement.
- Distinguer les recommandations générales des résultats du benchmark intégré et des mesures réellement observées en jeu.
- Effectuer l'analyse localement autant que possible ; ne transmettre aucune caractéristique matérielle sans information claire et consentement du joueur.
- Ne jamais modifier automatiquement le PC, les pilotes, les fréquences, les tensions ou les paramètres système. Toute modification des réglages de RIXE reste soumise à l'accord du joueur.
- Mettre à jour les configurations de référence lorsque les exigences du jeu évoluent et préciser la version à laquelle elles s'appliquent.

### 30.7 Mise à l'échelle, technologies GPU et génération d'images
- Étudier et intégrer, lorsque les versions, licences, pilotes, API de rendu et cartes graphiques le permettent, les solutions suivantes : **NVIDIA DLSS**, **AMD FSR**, **Intel XeSS** et **Unreal TSR**.
- Utiliser Unreal TSR comme voie de mise à l'échelle de référence largement compatible lorsque les solutions spécialisées ne sont pas disponibles ; ne jamais rendre DLSS, FSR ou XeSS obligatoires au démarrage.
- Détecter les capacités réellement disponibles sur la machine (GPU, API/RHI, pilote et fonctionnalités prises en charge) et n'afficher que les options compatibles. Prévoir une solution de secours testée si un plugin, pilote ou chemin de rendu est absent ou échoue.
- Permettre au joueur de choisir la solution et le niveau de qualité lorsqu'ils sont compatibles ; ne jamais imposer silencieusement une technologie ni remplacer un choix sans l'en informer.
- Ne jamais activer simultanément plusieurs upscalers concurrents sur la même chaîne de rendu. Vérifier les conflits de plugins et de génération d'images ; une seule technologie de frame generation peut être active à la fois.
- Étudier les fonctions de réduction de latence adaptées au matériel : **NVIDIA Reflex**, y compris le mode **On + Boost** lorsqu'il est exposé par le plugin, **AMD Radeon Anti-Lag 2** et **Intel Xe Low Latency (XeLL)** lorsqu'elles sont prises en charge. Ces fonctions réduisent la latence du pipeline ; elles ne constituent pas un upscaler et ne garantissent pas une hausse des FPS.
- Distinguer **NVIDIA Reflex On + Boost** (maintien de fréquences GPU plus élevées pour réduire parfois encore la latence, avec consommation/chauffe potentiellement supérieures) de **AMD Radeon Boost** (réduction dynamique de résolution ou adaptation du shading lors de mouvements rapides dans les titres compatibles). Ne pas confondre ces options avec un overclocking ni promettre un gain universel.
- Lorsque le pilote AMD ne propose pas Radeon Boost pour le jeu, étudier une **résolution dynamique intégrée à RIXE**, avec seuils et limites configurables, transitions discrètes et préservation de la lisibilité. Cette fonction native doit pouvoir bénéficier aux matériels compatibles de plusieurs marques, sans prétendre activer le réglage propriétaire du pilote AMD.
- Ne jamais modifier automatiquement les fréquences, tensions, limites de puissance ou paramètres globaux du pilote du joueur. Toute fonction de tuning/overclocking reste sous le contrôle du propriétaire du PC et hors du périmètre automatique de RIXE.
- Proposer la génération d'images (Frame Generation / Multi Frame Generation) uniquement si la configuration et la solution sélectionnée la prennent réellement en charge. Elle doit rester facultative et désactivable, particulièrement pour le jeu compétitif.
- Expliquer que les images générées améliorent la fluidité visuelle mais n'augmentent pas dans les mêmes proportions la fréquence de simulation, la réactivité des entrées ou les FPS réellement calculés. Afficher séparément, lorsque possible, les FPS natifs et les FPS incluant les images générées.
- Ne jamais sacrifier la précision, la latence, la lisibilité des adversaires ou la stabilité du gameplay pour afficher un chiffre de FPS supérieur. Tester chaque technologie en mouvement, en combat et dans les scènes chargées.
- Prévoir les options HDR uniquement lorsque l'écran, le système et le chemin de rendu sont compatibles, avec calibration et retour à un affichage SDR fiable.
- Auditer les licences, conditions de redistribution, versions et dépendances de chaque SDK/plugin avant intégration. Privilégier les composants gratuits compatibles avec le budget de 0 € ; aucun achat, abonnement ou service payant sans accord explicite.
- Verrouiller et documenter les versions testées des plugins. Ne pas considérer une compatibilité annoncée par un fournisseur comme une validation suffisante : vérifier réellement le build, le lancement, le rendu, les performances et le comportement de secours sous Unreal Engine 5.8.

### 30.8 Réglages personnalisés et validation multi-matériels
- Regrouper dans le mode Personnalisé les réglages détaillés déjà prévus par le jeu : textures/matériaux, ombres, éclairage, reflets, effets, post-traitement, distance d'affichage, résolution/résolution dynamique, anti-aliasing/upscaler, limite FPS, synchronisation, faible latence et HDR si disponibles.
- N'exposer que les paramètres réellement pris en charge par la plateforme ; expliquer brièvement les options avancées sans imposer de choix technique au joueur.
- Prévoir une fonction de comparaison avant/après et de restauration sûre des valeurs précédentes si un changement provoque un écran noir, une instabilité ou une dégradation importante.
- Lorsqu'un changement de résolution, de fréquence d'écran ou de mode d'affichage est appliqué, proposer une période de confirmation temporaire avec compte à rebours et aperçu du résultat ; demander au joueur de confirmer explicitement pour conserver le nouveau réglage.
- En l'absence de confirmation avant la fin du délai, rétablir automatiquement les paramètres précédents. Prévoir également un mécanisme de secours permettant de revenir à une configuration d'affichage fonctionnelle si le changement provoque un écran noir ou rend l'interface inaccessible.
- Ne jamais laisser un réglage d'affichage non confirmé devenir permanent ; sauvegarder les dernières valeurs fonctionnelles avant toute tentative et tester le retour arrière après plantage, fermeture forcée et redémarrage.
- Valider les six préréglages et le mode Personnalisé sur plusieurs catégories de GPU (modestes, intermédiaires et haut de gamme), résolutions et fréquences d'écran, ainsi que sur les chemins de rendu effectivement pris en charge.
- Inclure des tests spécifiques sur matériel NVIDIA, AMD et Intel lorsque disponible. Une option non testée sur une famille de matériel ne doit pas être annoncée comme pleinement prise en charge.
- Ne pas limiter la qualité maximale du projet à la GTX 1070 du propriétaire : conserver des niveaux évolutifs, tout en fournissant une voie de rendu jouable et stable aux machines plus modestes.
- Commencer par une carte de référence représentative, mesurer les coûts GPU/CPU et la lisibilité compétitive, puis appliquer les réglages validés aux autres cartes.

### Critères communs et ordre de réalisation
- Commencer par les préréglages et leur validation sur plusieurs configurations, puis le benchmark reproductible.
- Prototyper ensuite le mode faible latence et la précompilation/cache, en mesurant les gains réels.
- Intégrer les réglages de confort avec le système d'accessibilité existant.
- Ajouter diagnostic et profils par carte après fiabilisation de la collecte locale des mesures.
- Tester les six préréglages sur GPU modestes et puissants, plusieurs résolutions et les chemins de rendu pris en charge.
- Ne pas retarder la première build jouable pour ces fonctions ; priorité à la stabilité et au socle gameplay.
- Respecter le budget de 0 € et ne pas ajouter de dépendance ou service payant sans accord explicite.

