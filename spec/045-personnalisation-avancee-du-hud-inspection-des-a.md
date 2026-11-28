## 45. Personnalisation avancée du HUD, inspection des armes et nouvelles options de commandes/accessibilité — ajouts approuvés le 22 novembre 2026

Ces quatre fonctionnalités complètent les réglages d'interface et d'accessibilité (sections 22 et 30), la maîtrise et la personnalisation des armes (sections 26 et 32), ainsi que la calibration des commandes (section 32.2). Elles ne doivent pas créer de systèmes parallèles. Elles sont planifiées, pas considérées comme implémentées. Leur développement reste subordonné à la première build Windows jouable, à la stabilité du combat et du réseau, et au budget de 0 €.

### 45.1 Éditeur libre de disposition du HUD

- Permettre au joueur de déplacer librement les éléments d'interface autorisés : mini-carte, informations de santé et d'armure, munitions, indicateurs d'équipe, flux d'éliminations, objectifs et autres éléments non réservés.
- Proposer une interface d'édition visuelle avec aperçu en temps réel, déplacement, alignement, magnétisme facultatif, redimensionnement et réglage de l'espacement lorsque cela est pertinent.
- Prévoir des dispositions prédéfinies, une disposition personnalisée, plusieurs emplacements de profils, une restauration élément par élément et une remise à zéro complète.
- Permettre de sauvegarder localement les dispositions et, si le compte multiplateforme le permet, de les synchroniser avec gestion claire des conflits.
- Adapter automatiquement ou proposer un repositionnement lors des changements de résolution, format d'écran, ratio, échelle d'interface et plateforme ; éviter les éléments hors écran ou qui se chevauchent.
- Prévoir des règles de zones sûres et de marges pour les écrans de télévision et les interfaces tactiles si elles sont prises en charge.
- Ne pas autoriser de masquer ou déplacer de manière à créer un avantage compétitif, révéler des informations cachées ou rendre les informations essentielles inaccessibles. Les éléments indispensables doivent rester disponibles et lisibles.
- Intégrer les réglages de taille, contraste et accessibilité déjà prévus : l'éditeur complète ces options, il ne les remplace pas.
- Tester les dispositions en jeu réel, en spectateur si applicable, sur différentes résolutions et avec les différentes langues ; prévoir une disposition de secours fiable.

### 45.2 Inspection interactive des armes

- Ajouter dans l'armurerie ou un espace de présentation une inspection visuelle des armes permettant de les observer sous plusieurs angles, avec rotation libre à 360° et zoom contrôlé.
- Présenter les détails visuels pertinents : matériaux, finitions, accessoires équipés, animations d'inspection et éléments cosmétiques effectivement possédés ou disponibles.
- Permettre de lancer les animations d'inspection depuis cet espace sans interrompre une partie ni modifier l'état de l'arme en combat.
- Si des variantes cosmétiques sont prévues, permettre de les comparer dans cet aperçu sans confondre aperçu et déblocage réel.
- Ajouter une galerie de comparaison permettant d'afficher simultanément plusieurs apparences d'une même arme côte à côte, afin de comparer directement leurs couleurs, matériaux, motifs et finitions.
- Conserver pour chaque aperçu les contrôles de rotation et de zoom déjà prévus ; permettre d'examiner les variantes sous un éclairage cohérent et identique, avec un retour simple à la vue d'origine.
- La galerie ne doit afficher que les apparences réellement disponibles ou clairement identifiées comme aperçus ; comparer une apparence ne la débloque pas et ne l'équipe pas automatiquement.
- Ne pas permettre de voir à travers les modèles, d'inspecter des éléments internes utiles au gameplay ou d'obtenir des informations tactiques indisponibles en partie.
- L'inspection ne doit jamais modifier les dégâts, le recul, la précision, la cadence, les sons tactiques, les hitboxes ou toute autre propriété compétitive.
- Réutiliser les modèles, matériaux et animations de l'armurerie ; éviter de maintenir une seconde représentation de chaque arme.
- Optimiser les ressources et charger les détails à la demande afin de ne pas pénaliser les performances du jeu ou le temps de chargement.
- Ajouter une vérification rapide et facultative de l'état des munitions pour les armes compatibles : geste/animation permettant d'estimer visuellement le contenu du chargeur et, lorsque le modèle le permet, l'état de la chambre.
- Afficher uniquement une information que le personnage peut réellement vérifier ; distinguer clairement une estimation visuelle du nombre exact de cartouches et ne pas inventer de lecture impossible pour un chargeur opaque.
- La vérification ne recharge pas, ne modifie pas les munitions et ne crée aucune cartouche ; l'état réel reste celui validé par le serveur.
- Définir si cette vérification est réservée à l'armurerie/inspection ou disponible en partie sous une animation courte et interrompable ; dans tous les cas, elle ne doit pas procurer d'invulnérabilité ni d'avantage d'information.
- Valider les contrôles clavier/souris et manette, la lisibilité, les transitions d'animation et le comportement sur les configurations modestes.

### 45.3 Visée gyroscopique pour manettes compatibles

- Ajouter une option de visée par gyroscope pour les manettes qui exposent réellement cette donnée au jeu ; ne pas afficher l'option comme disponible sur un périphérique incompatible.
- Permettre d'activer ou désactiver le gyroscope indépendamment, notamment en permanence ou uniquement lorsque le joueur vise, selon les possibilités techniques du périphérique.
- Proposer la sensibilité, l'inversion des axes, le lissage facultatif, le seuil de neutralité et une procédure de calibration/recentrage.
- Prévoir des réglages distincts si nécessaire entre mouvements horizontaux et verticaux, sans multiplier inutilement les paramètres.
- Fournir un aperçu et des exercices de calibration dans le stand de tir, en complément des réglages de sticks déjà prévus à la section 32.2.
- Gérer les dérives du capteur, les interruptions, la mise en veille, les changements de périphérique et les données bruitées ; proposer un comportement de secours au stick.
- Ne pas appliquer d'assistance automatique supplémentaire ni de compensation cachée. Le gyroscope constitue une méthode de commande, pas un avantage artificiel.
- Tester la latence, la stabilité, la précision et l'équité face aux autres périphériques ; documenter les plateformes et manettes réellement compatibles.

### 45.4 Transcription vocale en temps réel des communications

- Proposer une option facultative qui convertit en texte les communications vocales reçues dans les canaux de jeu pris en charge, afin de permettre de suivre les échanges sans écouter le son.
- Distinguer visuellement les intervenants lorsque cette identification est disponible et fiable, et associer les transcriptions au bon canal (équipe, groupe ou proximité) sans mélanger les conversations.
- Afficher les transcriptions dans une zone dédiée et configurable : taille du texte, durée d'affichage, historique limité, effacement et désactivation immédiate.
- Ne pas présenter une transcription automatique comme une citation certaine : signaler les incertitudes et éviter d'inventer des mots lorsque la reconnaissance est insuffisante.
- Prévoir une prise en charge multilingue progressive, en indiquant clairement les langues disponibles et les limites de reconnaissance ; ne pas retarder la première version pour couvrir toutes les langues.
- Privilégier le traitement local lorsque la qualité et les performances le permettent. Tout recours à un service externe doit être explicitement documenté, facultatif, compatible avec le budget approuvé et soumis à une analyse de confidentialité avant activation.
- Ne pas enregistrer ni conserver les fichiers audio par défaut. Limiter la conservation du texte transcrit, ne pas l'utiliser pour entraîner un modèle et ne pas l'exposer dans les replays ou outils de modération sans décision explicite et cadre de confidentialité adapté.
- Informer clairement les joueurs lorsque la transcription est active et respecter les paramètres de confidentialité, de blocage et de mise en sourdine.
- Prévoir une solution de secours sans transcription et ne jamais rendre le vocal obligatoire pour jouer ou comprendre les objectifs.
- Tester le bruit de fond, les accents, les chevauchements de voix, la latence, les faux positifs, les performances et la confidentialité ; mesurer la qualité avant de déclarer la fonction fiable.

### Priorités et critères communs

- 45.1 complète les réglages de taille et de lisibilité du HUD existants ; ne pas créer un second menu de réglages d'interface.
- 45.2 s'intègre à l'armurerie et aux cosmétiques existants ; aucune propriété de gameplay ne peut être modifiée.
- 45.3 complète la calibration des commandes de la section 32.2 ; elle ne doit être activée que sur les périphériques compatibles et validés.
- 45.4 complète les sous-titres et options d'accessibilité existants ; elle ne doit pas devenir une dépendance du chat vocal ni imposer un traitement externe payant.
- Chaque fonctionnalité doit disposer d'un prototype, de critères d'acceptation, de tests de performance, d'un contrôle de confidentialité/sécurité pertinent et d'une possibilité de désactivation.
- Ne pas retarder la première build Windows jouable pour ces ajouts. Prioriser selon le coût réel, les dépendances techniques et le bénéfice démontré, en respectant le budget de 0 €.



