## 64. Pause technique encadrée pour les parties privées — ajout approuvé le 22 novembre 2026

Permettre une pause technique limitée dans les parties privées et les rencontres de tournoi compatibles, afin de gérer un incident matériel ou réseau ponctuel sans fausser le résultat. Cette fonction complète les temps morts tactiques de la section 29.4 (choix stratégique) et doit partager avec eux le même mécanisme de pause synchronisée sous autorité serveur.

### 64.1 Règles de pause
- Autoriser un nombre limité de pauses par équipe ou par rencontre, avec une durée maximale configurable par le créateur ou le règlement du tournoi.
- Afficher clairement l'équipe ou le joueur à l'origine de la demande, le motif sélectionné et le temps restant.
- Synchroniser l'arrêt et la reprise pour tous les participants, sous autorité serveur lorsque l'architecture le permet.
- Prévoir une reprise annoncée avec un court compte à rebours, afin que tous les joueurs soient prêts.
- Définir le traitement des joueurs qui restent absents à la fin du délai : reprise, forfait ou autre procédure selon le règlement de la rencontre.
- Réserver cette fonction aux contextes privés/compétitifs explicitement compatibles ; ne pas l'activer dans les parties publiques ordinaires.

### 64.2 Prévention des abus et intégrité
- Empêcher les demandes répétées, les pauses en chaîne et l'utilisation de la fonction pour casser le rythme ou obtenir un avantage tactique.
- Ne pas permettre de modifier les équipes, équipements, règles ou paramètres de la rencontre pendant la pause, sauf disposition explicitement prévue par le règlement.
- Journaliser les demandes, durées et reprises pour permettre aux organisateurs de traiter les contestations.
- Prévoir une procédure de reprise sûre en cas de déconnexion de l'hôte ou d'un participant pendant la pause.

### Validation
- Tester les demandes simultanées, les limites de durée, les refus, les déconnexions, les reprises synchronisées et les abus possibles.
- Vérifier que l'état de partie, le chronomètre, les objectifs et les statistiques reprennent sans duplication ni perte d'événement.

