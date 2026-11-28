## 69. Signalement de bugs avec rapport technique facultatif — ajout approuvé le 23 novembre 2026

Permettre au joueur de transmettre un signalement de bug structuré depuis RIXE afin de faciliter la reproduction et la correction des problèmes, sans lui demander de connaître les détails techniques.

### 69.1 Création du signalement
- Proposer une entrée accessible depuis les menus et, lorsque cela est pertinent, depuis l'écran de fin de partie.
- Permettre de décrire le problème en texte libre et de choisir une catégorie : crash, problème visuel, audio, commandes, réseau, interface ou gameplay.
- Proposer des champs facultatifs pour préciser les étapes permettant de reproduire le problème, le résultat attendu et le résultat observé.
- Associer automatiquement, uniquement si le joueur l'autorise, les informations utiles comme la version du jeu, le numéro de build, la plateforme et le contexte général de survenue.
- Permettre de joindre une capture d'écran ou une courte séquence lorsque cela est pris en charge et explicitement choisi par le joueur.

### 69.2 Rapport technique et confidentialité
- Proposer séparément un rapport technique facultatif contenant uniquement les éléments utiles au diagnostic, par exemple journaux pertinents, catégorie d'erreur, informations matérielles générales et état de connexion résumé.
- Présenter un aperçu des données techniques qui seront envoyées et demander un consentement explicite avant leur transmission.
- Exclure les mots de passe, jetons d'authentification, contenus privés du joueur et données personnelles non nécessaires.
- Ne pas enregistrer le chat vocal ni transmettre les conversations privées dans le cadre d'un rapport de bug.
- Permettre l'envoi sans rapport technique et afficher clairement si le signalement a été transmis, mis en attente ou n'a pas pu être envoyé.
- Prévoir une file locale temporaire et une suppression possible des rapports en attente avant leur transmission.

### 69.3 Suivi et validation
- Fournir un identifiant de signalement permettant au joueur de retrouver son envoi et son état général, sans promettre une réponse individuelle.
- Éviter les envois multiples involontaires et permettre de compléter un rapport existant lorsque c'est possible.
- Tester les rapports incomplets, les pièces jointes, les échecs réseau, les autorisations et la suppression des données sensibles.
- Respecter le budget cible de 0 € ; le volume de stockage et de traitement des rapports doit être maîtrisé.



