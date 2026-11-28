## 27. Direction de développement : FPS hybride à priorité communautaire (approuvée le 19 novembre 2026)

### 27.1 Vision directrice
RIXE est un FPS hybride : le gameplay compétitif, nerveux et lisible constitue le cœur de chaque partie ; la continuité sociale, les rencontres et les communautés donnent envie aux joueurs de revenir. La priorité stratégique est la communauté, sans sacrifier l'équité, la qualité du combat, la stabilité réseau ni l'accessibilité.

S'inspirer des qualités recherchées dans les FPS appréciés (fluidité, gunplay satisfaisant, lobbies publics, continuité des groupes, liberté de choix, outils sociaux) sans copier l'interface, les assets, les marques ou l'identité d'un jeu existant. RIXE conserve une identité visuelle et fonctionnelle propre.

### 27.2 Expérience par défaut : matchmaking et lobby public façon BO2
C'est le parcours principal et l'écran de jeu par défaut. Les serveurs communautaires ne doivent jamais remplacer ni masquer cette expérience.

- Au lancement, afficher l'interface principale RIXE avec l'action principale « Jouer » clairement mise en avant.
- En choisissant « Jouer », le joueur rejoint le matchmaking officiel de la playlist choisie et un lobby public de joueurs, inspiré du fonctionnement des anciens Call of Duty / Black Ops II.
- Le lobby public se remplit automatiquement ; afficher clairement playlist, mode, carte si connue, région/qualité de connexion, population, places restantes et compte à rebours.
- Lancer automatiquement la partie lorsque le seuil d'effectif ou le délai configuré est atteint. Aucun pop-up de confirmation individuel ne doit interrompre le matchmaking public.
- Après la partie, conserver autant que possible les joueurs dans le même lobby pour enchaîner les manches/parties, favoriser les retrouvailles, les rivalités amicales et la formation spontanée de groupes.
- Le joueur doit pouvoir quitter, rejoindre un groupe, inviter des amis ou changer de playlist sans parcours complexe.
- Prévoir remplissage des places libres (backfill) sans déséquilibrer une manche déjà presque terminée ; utiliser des bots uniquement selon les règles du mode et avec une indication claire. Ne pas remplir artificiellement les parties de bots si des joueurs humains sont disponibles dans un délai raisonnable.
- Le matchmaking prend en compte en priorité la qualité de connexion et le temps d'attente, puis le niveau avec une calibration prudente ; éviter les écarts de ping excessifs et les compositions manifestement déséquilibrées. Expliquer les critères sans promettre un matchmaking parfait.
- Le système de lobby public et de matchmaking doit rester la voie la plus simple, la plus visible et la plus rapide pour jouer.

### 27.3 Serveurs communautaires : fonctionnalité secondaire et facultative
- Ajouter une rubrique distincte, par exemple « Communauté » ou « Serveurs », accessible depuis une autre interface/entrée du menu principal.
- Ne pas ouvrir cette rubrique automatiquement au démarrage et ne pas sélectionner les serveurs communautaires comme parcours par défaut.
- Cette rubrique pourra proposer un navigateur de serveurs avec filtres mode, carte, région, ping, population, règles, langue, favoris et présence d'amis.
- Permettre de rejoindre directement un serveur, de retrouver un serveur favori et de créer/rejoindre des expériences communautaires lorsque l'infrastructure et le budget le permettent.
- Identifier sans ambiguïté les serveurs officiels, communautaires vérifiés et expériences personnalisées.
- Séparer les règles, la progression, les statistiques et les classements communautaires des résultats classés officiels, sauf validation explicite d'un environnement compétitif conforme.
- Prévoir outils d'administration, signalement, blocage, mute, journalisation proportionnée, règles de conduite et mécanismes de contestation.
- Ne pas exiger Discord ou une application externe pour les fonctions communautaires essentielles.

### 27.4 Continuité sociale et fidélisation
- Conserver les joueurs ensemble entre les parties lorsque possible, avec possibilité de quitter à tout moment.
- Groupes persistants, invitations, rejoindre un ami, présence et statut en jeu, liste d'amis et gestion simple du groupe.
- Préparer un système de clans/groupes persistants : nom, tag, emblème, membres, rôles, invitations, paramètres de confidentialité et historique collectif. Le développer après le socle multijoueur.
- Prévoir des outils de formation de groupes spontanés et de maintien d'une équipe appréciée après une partie, sans forcer les joueurs à rester.
- Ajouter à terme des événements et tournois communautaires gratuits : inscriptions, équipes, formats adaptés (1v1, 2v2, 5v5 ou autres selon les modes), tableaux de tournoi, résultats, règles et historique.
- Les événements communautaires ne doivent pas donner d'avantage payant ni perturber les playlists officielles.

### 27.5 Créativité et participation communautaires
- Permettre à terme de proposer, tester et publier des cartes communautaires via un processus progressif : tests privés, validation technique, modération, vérification des licences et publication.
- Séparer clairement les cartes communautaires des cartes officielles et du matchmaking/classé officiel tant que les critères de validation ne sont pas satisfaits.
- Prévoir à terme des variantes/règles temporaires communautaires contrôlées, avec vote ou rotation, sans contaminer les statistiques et classements officiels.
- Recueillir les suggestions et retours des joueurs directement dans le jeu ou via un canal officiel accessible.
- Publier un historique clair des changements, problèmes connus, corrections et décisions d'équilibrage.
- Utiliser les données agrégées de parties pour éclairer l'équilibrage des armes, cartes, modes et apparitions ; conserver validation humaine, échantillons suffisants, tests avant/après et possibilité de retour arrière. Ne jamais changer les règles compétitives en pleine partie.

### 27.6 Qualité du combat et équité comme fondations
- Prioriser les sensations de tir, les déplacements, la lisibilité des impacts, l'identité sonore des armes, la stabilité des hit registrations et la cohérence des dégâts.
- Traiter les plaintes de désynchronisation avec des outils compréhensibles : ping, pertes, jitter, événements de tir/dégâts validés, et explication prudente des divergences. Ne jamais présenter une estimation client comme preuve définitive.
- Renforcer anti-triche, autorité serveur, sécurité des comptes et protection contre les exploits.
- Prévoir une expérience d'accueil progressive : tutoriel court, stand de tir, entraînement contre bots et explication des objectifs/communications.
- Offrir des options d'accessibilité complètes et configurables : remappage, sous-titres, contrastes, daltonisme, tailles UI, intensité des effets, options audio et réglages adaptés aux limitations motrices lorsque possible.
- Préserver les modes officiels classiques avec arsenal maîtrisé et équilibré ; les expériences Chaos et les règles personnalisées restent séparées selon les sections déjà approuvées.
- La progression doit récompenser le temps et la contribution sans imposer de grind excessif, pay-to-win ni achat obligatoire.

### 27.7 Modération et confiance
- Outils intégrés de signalement, blocage, mute texte/vocal, contrôle des invitations et confidentialité.
- Modération proportionnée, procédures de réexamen et contestation ; aucune sanction grave automatisée sur la base d'un simple score ou d'une suspicion non vérifiée.
- Protection contre le harcèlement, le spam, les usurpations, le doxxing et les abus de groupe.
- Ne pas enregistrer le vocal par défaut ; minimiser la collecte, expliquer les données et limiter leur conservation.
- Prévoir des outils d'administration adaptés aux serveurs communautaires, avec permissions graduées et traces des actions sensibles.

### 27.8 Plateformes et modèle économique
- Le client Windows Unreal reste la référence initiale ; les voies navigateur et autres plateformes suivent une stratégie technique distincte mais visent les mêmes règles et la parité de gameplay, comme défini en section 16.
- Le compte RIXE, la progression et les paramètres doivent être synchronisables entre plateformes compatibles, avec protections de compte et gestion des conflits.
- Le cross-play doit être configurable et respecter les préférences des joueurs et l'équité des périphériques.
- Le jeu de base reste gratuit et aucun avantage compétitif ne peut être vendu.
- Budget actuel : 0 €. Aucun serveur payant, service cloud, hébergement, achat d'asset, plugin, abonnement, frais de boutique ou dépense ne peut être engagé sans accord explicite préalable. Concevoir les fonctions communautaires en fonction des capacités réellement gratuites et des limites d'hébergement par les joueurs.

### 27.9 Interface et architecture de navigation
- Conserver la direction d'interface RIXE déjà approuvée : identité originale, claire, rapide, hiérarchie simple, coins arrondis cohérents de 8 à 16 px, sans copier Apex, THE FINALS ou Warzone.
- L'écran principal met en avant « Jouer » et le matchmaking/lobby public.
- Les rubriques secondaires peuvent inclure « Communauté/Serveurs », « Amis/Groupe », « Armes », « Progression », « Personnalisation » et « Paramètres ».
- La rubrique communautaire ne doit pas concurrencer visuellement le bouton « Jouer » ni devenir l'expérience par défaut.
- Paramètres lisibles, libellés explicites, descriptions courtes, valeurs visibles, aperçu immédiat et réinitialisation.

### 27.10 Ordre de réalisation

Cette séquence complète la chronologie générale de la section 12 ; elle ne la remplace pas. La première build Windows de la section 24 reste prioritaire. Les services privés EOS et le matchmaking public sont deux jalons distincts. **La sécurité communautaire minimale doit précéder toute ouverture ou expérimentation publique**, et la validation qualité/alpha doit précéder les extensions avancées.

1. **Sécurisation et audit :** sauvegarde, état réel du dépôt, secrets, licences, plugins, dépendances, configurations et blocages. Aucune distribution publique avant clarification des licences ; les tests internes peuvent continuer si les droits et conditions applicables le permettent.
2. **Première build jouable :** une carte pilote, un mode, boucle FPS complète et build Windows de test ; bots/local autorisés pour valider le gameplay sans prétendre valider le réseau en ligne.
3. **Fondations FPS et réseau :** qualité du tir/hit registration, autorité serveur, réplication, déplacements et mécaniques de base approuvées, dégâts, apparitions, équipes, bots, stabilité de la carte pilote et tests réseau progressifs. Établir la référence de performances dès ce stade. **La carte pilote seule est requise pour cette phase et pour ouvrir le chantier EOS ; les autres cartes du lancement ne sont pas un prérequis EOS.**
4. **EOS et parties privées :** identité/Connect, présence, amis/invitations, lobbies et sessions privées ; valider création, invitation, rejoindre, lancer une partie, retour au lobby et reconnexion. Garder un chemin LAN/direct de diagnostic.
5. **Socle de sécurité communautaire avant le public :** sourdine, blocage, signalement, limites anti-spam, confidentialité, messages d'erreur et règles de traitement des abus. Tester ces protections avec les parcours privés et les scénarios de groupe. Les outils avancés de modération restent ultérieurs, mais aucune ouverture publique ne doit précéder ce socle.
6. **Matchmaking public officiel et contenu de lancement :** après validation d'EOS et des parties privées, construire et tester en environnement contrôlé la file publique, la constitution des équipes, le lobby BO2, le compte à rebours/seuil de joueurs, le lancement automatique et la continuité des groupes. Les prototypes internes du matchmaking peuvent avancer sur la carte pilote sans attendre la finalisation des autres cartes. Ajouter progressivement gestion des départs, migration d'hôte, backfill, remplaçants et préférences selon les capacités validées. Finaliser et valider les trois cartes maximum et les modes inclus dans l'alpha avant celle-ci. **L'activation publique réelle** attend les contrôles de sécurité, de licence, de stabilité et de capacité.
7. **Données persistantes et systèmes dépendants :** statistiques détaillées, sauvegardes, progression, défis, préférences synchronisées et fonctions communautaires avancées. Le score de match de base et son affichage sont requis dans la première boucle jouable ; sa validation serveur appartient aux fondations FPS.
8. **Qualité, performances et préparation de l'alpha :** non-régression, tests réseau/performance multi-configurations, sauvegardes, accessibilité, localisation, compatibilité, audit final des licences, build Shipping et procédure de retour arrière. Le profilage commence dès les fondations ; cette phase réalise la validation finale.
9. **Extensions après validation du socle :** replays, création communautaire, événements, fonctions sociales avancées, cross-play, clients navigateur et plateformes supplémentaires lorsque leurs dépendances sont prêtes. Learning Agents reste une expérimentation isolée, désactivable et non bloquante.

Ne pas développer tous les systèmes sociaux simultanément. À chaque étape, appliquer les critères de passage de la section 12 et les critères spécialisés du système concerné. Une dépendance non validée bloque le jalon qui en dépend, pas les tâches indépendantes et réversibles de même priorité. Les fonctionnalités reportées restent planifiées ; elles ne sont ni supprimées ni déclarées livrées.

À chaque jalon : tests réels adaptés, critères d'acceptation, sauvegarde, rapport branche/commit, état des limites et build ou lien de test vérifié lorsque possible. Une fonction planifiée n'est jamais présentée comme livrée sans preuve.

