## 44. Outils de maintenance, présence en partie, écran partagé et canaux vocaux — ajouts approuvés le 22 novembre 2026

Cette section formalise quatre fonctionnalités approuvées. Elles complètent les systèmes existants sans créer de mécanismes parallèles. Elles restent planifiées et ne sont pas considérées comme implémentées avant validation dans une build réelle.

### 44.1 Vérification et réparation des fichiers du jeu
- Ajouter un outil accessible depuis le lanceur ou le menu de démarrage permettant de vérifier l'intégrité de l'installation RIXE.
- Comparer les fichiers installés à un manifeste de référence versionné et signé, contenant au minimum les chemins, tailles et empreintes cryptographiques attendues.
- Détecter les fichiers absents, incomplets, corrompus ou incompatibles avec la version active ; distinguer clairement les fichiers officiels des fichiers locaux autorisés (captures, replays, réglages et contenus communautaires).
- Proposer une réparation ciblée des seuls fichiers concernés plutôt qu'une réinstallation complète lorsque cela est possible.
- Télécharger uniquement les éléments nécessaires depuis une source officielle configurée ; vérifier leur intégrité après téléchargement avant de les remplacer.
- Effectuer les remplacements de manière sûre : sauvegarde temporaire des fichiers concernés, écriture atomique lorsque possible, reprise après interruption et retour à l'état précédent en cas d'échec.
- Ne jamais supprimer silencieusement les captures, replays, réglages, sauvegardes locales ou contenus communautaires du joueur. Demander confirmation avant toute opération destructive et isoler les fichiers inconnus au lieu de les effacer automatiquement.
- Afficher un rapport compréhensible : éléments vérifiés, anomalies trouvées, réparations effectuées, éléments ignorés et éventuelle action manuelle requise.
- Prévoir un mode diagnostic sans réparation, ainsi qu'une option de vérification au démarrage qui ne bloque pas inutilement le lancement si aucun problème critique n'est détecté.
- Ne pas intégrer de mécanisme d'exécution de code arbitraire, de téléchargement depuis des sources non fiables ou de désactivation de la sécurité du système.
- Réutiliser le système de versions et de mise à jour réversible de la section 22.8 ; ne pas créer un second mécanisme de mise à jour.
- Critères de validation : fichiers absents, corrompus, modifiés, accès refusé, disque plein, réseau interrompu, téléchargement incomplet, manifeste invalide, restauration après échec et préservation des données utilisateur.

### 44.2 Détection et gestion des joueurs inactifs (AFK)
- Distinguer l'inactivité prolongée d'une déconnexion réseau : un joueur AFK est toujours connecté mais ne participe plus, tandis qu'une déconnexion relève de la période de grâce et de la reconnexion prévues en section 26.
- Définir des seuils adaptés à chaque mode, avec une durée de tolérance avant avertissement et une seconde étape avant toute conséquence.
- Ne pas se baser sur l'absence de déplacements uniquement : tenir compte d'une activité de jeu pertinente sans considérer un joueur qui défend légitimement une position comme automatiquement inactif.
- Afficher un avertissement clair et laisser au joueur un délai raisonnable pour confirmer sa présence par une action simple.
- Dans les modes qui l'autorisent, retirer de la partie un joueur restant inactif après avertissements ; appliquer ensuite les règles de remplacement déjà prévues en section 26, sans créer un système de bots distinct.
- Définir une politique plus stricte ou différente pour les parties classées, les parties privées et les modes sans réapparition ; ne jamais attribuer artificiellement une victoire ou une défaite.
- Prévoir des protections contre les faux positifs liés aux menus, aux problèmes d'accessibilité, aux périphériques défaillants et aux interruptions temporaires.
- Limiter les sanctions : une expulsion AFK ne doit pas entraîner automatiquement une suspension lourde. Toute pénalité répétée doit être progressive, proportionnée, explicable et contestable.
- Critères de validation : défense statique légitime, spectateur, pause autorisée, perte momentanée de périphérique, latence, déconnexion réelle, reconnexion, joueur inactif en classé et tentative de simulation d'activité.

### 44.3 Multijoueur local en écran partagé sur PC
- Étudier et développer la possibilité pour plusieurs joueurs de participer à une même session sur un seul PC, avec affichage en écran partagé et périphériques de contrôle distincts.
- Commencer par deux joueurs locaux ; n'étendre à davantage de joueurs que si les performances, la lisibilité et les contraintes de l'interface le permettent.
- Permettre de rejoindre une partie locale hors ligne contre des bots, puis étudier la participation de plusieurs joueurs locaux à une partie en ligne si l'architecture réseau, les comptes et les règles de session le permettent.
- Prévoir une attribution claire des périphériques : clavier/souris pour le joueur principal et manettes supplémentaires, avec association et réattribution simples. Ne pas promettre deux joueurs indépendants au clavier/souris sur un même PC.
- Adapter le HUD, les menus, les messages, les scores et les paramètres à chaque vue ; éviter qu'un joueur puisse modifier accidentellement les réglages ou menus de l'autre.
- Gérer séparément les paramètres locaux nécessaires à chaque participant (sensibilité, commandes, audio et préférences d'affichage) sans écraser les profils personnels.
- Définir les limites techniques : résolution minimale, disposition horizontale ou verticale si les deux sont viables, fréquence d'images, charge CPU/GPU, mémoire, audio et compatibilité des cartes.
- Prévoir une procédure d'ajout/retrait d'un joueur local, de déconnexion d'une manette et de retour au lobby sans corrompre la session.
- Ne pas accorder automatiquement plusieurs récompenses, progressions ou résultats officiels à un même compte ou à des comptes secondaires sans règles anti-abus spécifiques.
- Critères de validation : deux joueurs locaux, périphériques mélangés, changement de périphérique, déconnexion d'une manette, menus simultanés, reconnexion, performances sur PC modeste et participation en ligne lorsque prise en charge.
- Cette fonctionnalité est secondaire et ne doit pas retarder la première build Windows jouable ni dégrader l'expérience standard à un seul joueur.

### 44.4 Gestion avancée des canaux vocaux
- Organiser le chat vocal autour de canaux clairement séparés, en réutilisant le système audio et le chat de proximité déjà prévus en section 28.2.
- Prévoir au minimum les destinations suivantes lorsque le mode les autorise : canal d'équipe, canal de groupe/amis, canal de proximité et canal d'organisation réservé aux responsables d'une partie personnalisée ou d'un événement.
- Permettre de choisir rapidement le canal actif et, si cela reste compréhensible, d'écouter plusieurs canaux avec des volumes indépendants ; éviter qu'un joueur transmette accidentellement sa voix à un canal non souhaité.
- Afficher clairement le canal de transmission actif, les participants qui parlent et l'état micro muet/non muet.
- Permettre de régler séparément le volume de chaque canal et de chaque joueur, ainsi que de couper ou bloquer un participant conformément aux outils de confidentialité et de modération existants.
- Définir les droits de création, d'accès et de gestion des canaux privés ; les responsables ne doivent pas pouvoir contourner les blocages, les paramètres de confidentialité ou les règles de modération.
- En partie compétitive, appliquer des règles explicites aux communications entre équipes et pendant les phases où certaines informations doivent rester confidentielles ; ne jamais transmettre à un joueur des communications auxquelles il ne devrait pas avoir accès.
- Prévoir un comportement de secours lorsque le chat vocal est indisponible : indicateur clair, possibilité de rester dans la partie et accès aux moyens de communication non vocaux déjà prévus.
- Ne pas enregistrer les conversations vocales par défaut. Toute éventuelle conservation à des fins de modération doit faire l'objet d'une conception distincte, proportionnée, transparente et conforme aux règles applicables.
- Critères de validation : changement de canal en cours de partie, groupe multiplateforme si disponible, invitations, joueur bloqué, micro déconnecté, perte réseau, permissions, confidentialité et absence de fuite audio entre équipes.

### Priorités et règles communes
- Ces quatre fonctionnalités sont approuvées et planifiées, mais ne sont pas implémentées par leur seule présence dans le cahier des charges.
- Priorité de livraison : première build Windows jouable, stabilité du combat et du réseau, sécurité et intégrité des fichiers ; les fonctionnalités locales et vocales viennent ensuite selon leur coût réel.
- Réaliser des prototypes techniques courts avant de figer l'architecture, notamment pour l'écran partagé et les canaux vocaux.
- Réutiliser les systèmes existants de mise à jour, reconnexion, remplacement par bot, audio spatial, proximité, groupes, comptes, accessibilité et modération.

