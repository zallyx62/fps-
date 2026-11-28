## 68. Tableau de santé des services RIXE — ajout approuvé le 23 novembre 2026

Créer une page d'état des services permettant aux joueurs de savoir si les fonctions en ligne de RIXE rencontrent un incident, plutôt que de confondre une panne générale avec un problème de leur installation ou de leur connexion.

### 68.1 Services et informations affichés
- Présenter séparément l'état des services réellement déployés, par exemple authentification, groupes et invitations, matchmaking, sessions de jeu, statistiques et services communautaires.
- Afficher des états simples et compréhensibles : opérationnel, dégradé, indisponible ou maintenance planifiée.
- Indiquer les régions concernées lorsqu'un incident est régionalisé.
- Afficher l'heure de début connue, la dernière actualisation et, lorsqu'elle est confirmée, une estimation de rétablissement.
- Présenter les maintenances planifiées et un historique concis des incidents récents.

### 68.2 Fiabilité de l'information
- Ne jamais afficher un service comme opérationnel si son état n'a pas pu être vérifié ; distinguer « état inconnu » d'un fonctionnement normal.
- Éviter les estimations de résolution non confirmées et horodater les informations.
- Prévoir une mise à jour automatique raisonnablement espacée et un rafraîchissement manuel.
- Garder la page consultable même lorsqu'un service principal est indisponible, dans la mesure permise par l'architecture.
- Ne pas exposer d'informations internes sensibles, de données personnelles ou de détails facilitant une attaque.

### 68.3 Contraintes et validation
- Concevoir le système pour qu'il reste léger et compatible avec le budget cible de 0 €, sans dépendance obligatoire à une plateforme de statut payante.
- Tester les pannes partielles, les états incohérents, les changements de région, les maintenances et l'indisponibilité du système de statut lui-même.
- Ne déclarer que les composants réellement surveillés ; ne pas simuler une surveillance qui n'existe pas.

