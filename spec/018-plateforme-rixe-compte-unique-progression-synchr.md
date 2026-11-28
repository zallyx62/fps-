## 18. Plateforme RIXE : compte unique, progression synchronisée et cross-play (ajouts approuvés)

### Vision
RIXE doit devenir une plateforme de jeu unifiée, et pas seulement un FPS limité à un appareil. Un joueur doit pouvoir retrouver son identité et continuer sa progression sur toute plateforme officiellement prise en charge, par exemple Windows, navigateur web et, si techniquement possible, d'autres appareils.

### Compte joueur et sauvegarde multiplateforme
- Mettre en place une identité RIXE unique, indépendante de la boutique ou de l'appareil utilisé. Étudier EOS et les solutions d'identité compatibles avec le budget, les licences et les plateformes.
- Permettre de lier/délier proprement les comptes de plateforme (PC, boutiques et autres appareils) à un même compte RIXE, avec une procédure sécurisée de récupération et de prévention des usurpations.
- Synchroniser les données de profil pertinentes : progression, niveau/XP, statistiques de carrière, défis, maîtrises, déblocages cosmétiques, inventaire visuel, préférences et paramètres lorsque compatibles.
- Sauvegarder côté service de compte les données qui doivent suivre le joueur ; conserver un cache local pour permettre un démarrage raisonnable hors ligne si le mode le permet. Définir clairement les règles de conflit, de version et de restauration des sauvegardes.
- Ne jamais perdre une progression à cause d'un changement d'appareil, d'une réinstallation ou d'un changement de boutique. Prévoir sauvegarde, migration, export/récupération du compte et tests de restauration.
- La progression compétitive doit être cohérente entre plateformes et validée côté serveur. Ne pas faire confiance à une sauvegarde client pour attribuer XP, rangs, statistiques ou récompenses.
- Ne pas synchroniser de données sensibles inutiles. Informer le joueur des données conservées, sécuriser les accès et prévoir les mécanismes de confidentialité/suppression requis.
- Le compte et la synchronisation doivent fonctionner sans achat obligatoire. Respecter le budget de 0 € : aucun service cloud payant ou stockage facturé sans accord explicite.

### Cross-play activable ou désactivable
- Permettre au joueur d'activer ou désactiver le cross-play dans les paramètres, avec une explication claire des conséquences sur le temps d'attente et le nombre de parties disponibles.
- Permettre aux joueurs de rejoindre leurs amis multiplateformes via invitations et groupes, sous réserve des règles de compatibilité et de sécurité.
- Définir un matchmaking qui respecte le choix de cross-play de chaque joueur et de son groupe ; ne pas mélanger silencieusement des joueurs ayant refusé le cross-play.
- Étudier des files distinctes ou des règles adaptées selon les plateformes et les périphériques (clavier/souris, manette, tactile), sans donner d'avantage injuste. Ne pas imposer une séparation si les tests démontrent une équité acceptable.
- Afficher les plateformes des membres d'un groupe lorsque cela aide à comprendre la compatibilité, sans exposer d'informations techniques ou personnelles superflues.
- Prévoir des tests de bout en bout : création de compte, liaison, invitation, groupe mixte, matchmaking cross-play activé/désactivé, progression sur un second appareil, déconnexion, conflit de sauvegarde et récupération du compte.

### Architecture et limites réalistes
- Séparer clairement identité du joueur, profil, progression, sauvegardes, matchmaking et session de jeu afin que les clients Unreal natifs et web puissent partager les mêmes services et règles.
- Garder le serveur autoritaire pour les résultats de match, l'XP, les rangs, les récompenses et les statistiques fiables.
- Le navigateur, Windows et les autres clients doivent partager les mêmes règles et données de gameplay ; les différences graphiques/performance déjà prévues ne doivent pas créer d'avantage compétitif.
- Documenter les limites propres à chaque plateforme, les politiques des boutiques, la disponibilité des SDK et les exigences de confidentialité.
- Implémenter progressivement : prototype d'identité et liaison de comptes, puis profil/sauvegarde, puis invitations et cross-play, puis tests de progression multi-appareils. Aucune promesse de disponibilité universelle avant validation réelle.

### Statut
Fonctionnalités approuvées et planifiées ; elles ne sont pas considérées comme implémentées tant que les flux de compte, sauvegarde, cross-play et récupération n'ont pas été testés sur au moins deux clients/plateformes réels.

