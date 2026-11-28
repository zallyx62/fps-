## 46. Informations tactiques contextuelles, continuité des périphériques et statistiques par carte — ajouts approuvés le 22 novembre 2026

Ces ajouts complètent les communications tactiques (sections 23.1 et 26), les préférences et réglages de périphériques (sections 28.4 et 32.2), le diagnostic graphique/réseau (section 30.6) et la comparaison personnelle des performances (section 36.4). Ils restent planifiés et ne sont pas considérés comme implémentés avant validation sur une build réelle.

### 46.1 Marqueurs tactiques contextuels et intelligents
- Compléter les appellations de zones et les pings déjà prévus aux sections 23.1 et 26 par une communication rapide contextuelle : signaler un danger observé, demander un soutien, indiquer une direction, un objectif à défendre/attaquer ou un équipement/allier nécessitant de l'aide.
- Adapter les propositions au contexte réel (mode, proximité d'un objectif, état du joueur et éléments effectivement visibles) sans envoyer automatiquement un message non voulu ; le joueur conserve toujours la confirmation de l'envoi.
- Associer si possible le marqueur à une zone ou un élément identifié, avec une durée de validité adaptée. Faire expirer ou atténuer les marqueurs devenus anciens, invalides ou contredits par l'évolution de la partie.
- Distinguer clairement une observation directe, une demande d'aide et une hypothèse ; ne jamais transformer un ping en révélation de position ennemie non observée.
- Respecter les règles de visibilité et de confidentialité : le serveur valide les informations partageables et aucun client ne reçoit de données cachées par l'intermédiaire du système de ping.
- Prévoir une roue ou des raccourcis configurables, une utilisation clavier/souris et manette, des libellés traduisibles et des retours visuels/sonores accessibles.
- Limiter la fréquence, empêcher le spam et permettre de masquer ou réduire les marqueurs ; les outils de modération et de blocage existants restent applicables.
- Critères de validation : marqueur erroné devenu obsolète, changement de position, ennemi non visible, joueur bloqué, spam, groupe vocal/non vocal, lisibilité en combat chargé et cohérence entre clients.

### 46.2 Détection des interruptions et bascule contrôlée des périphériques
- Détecter la perte, déconnexion, mise en veille ou absence prolongée de réponse d'un périphérique de contrôle actif (souris, clavier, manette ou autre périphérique officiellement pris en charge).
- Afficher une notification discrète et explicite indiquant le périphérique concerné, sans bloquer inutilement la partie ni déclencher une action de gameplay.
- Lorsqu'un autre périphérique compatible est disponible, permettre une bascule simple et contrôlée ; ne jamais changer automatiquement de méthode de contrôle d'une manière susceptible de déplacer la visée, d'activer une commande ou de modifier involontairement les réglages.
- Préserver les associations, remappages, sensibilités, zones mortes et profils propres à chaque périphérique conformément à la section 32.2.
- À la reconnexion, éviter les doubles entrées, changements intempestifs de focus ou répétitions involontaires de commandes ; demander une confirmation si le retour au périphérique précédent nécessite une bascule.
- Distinguer une déconnexion matérielle d'un gel du jeu, d'une perte de focus ou d'un problème système ; ne pas prétendre diagnostiquer avec certitude une panne matérielle.
- Prévoir des options pour désactiver les notifications ou choisir le comportement de bascule, sans masquer un état qui rendrait les commandes inopérantes.
- Critères de validation : débranchement en combat, batterie vide, veille/réveil, reconnexion, périphériques multiples, changement de fenêtre, manette sans fil instable et maintien des paramètres personnels.

### 46.3 Historique et comparaison des performances par carte
- Étendre la comparaison personnelle prévue en section 36.4 afin de permettre de consulter ses tendances séparément par carte, mode et côté (attaque/défense ou équipe selon les règles du mode).
- Afficher, lorsque les données sont fiables et disponibles, des indicateurs contextualisés : résultats, éliminations/morts/assists, précision, contribution aux objectifs, soutien, performances par arme et durée de partie.
- Permettre de filtrer par période et de comparer des parties réellement comparables ; signaler le nombre de matchs pris en compte et éviter toute conclusion lorsque l'échantillon est trop faible.
- Présenter les tendances comme des repères de progression personnelle, jamais comme une preuve qu'une carte, un côté ou un coéquipier est responsable d'un résultat.
- Distinguer les modes officiels, privés, communautaires, expérimentaux et entraînements hors ligne ; seules les données répondant aux règles de fiabilité correspondantes alimentent chaque vue.
- Réutiliser les statistiques et l'historique existants, sans créer une seconde infrastructure de collecte ni enregistrer des données personnelles inutiles.
- Prévoir des filtres de confidentialité, une option de désactivation et, lorsque l'architecture le permet, l'export ou la suppression de l'historique personnel.
- Ne pas utiliser ces indicateurs pour modifier automatiquement le matchmaking, le niveau caché ou l'équilibrage.
- Critères de validation : faible nombre de parties, changement de mode/carte, équilibrage de carte modifié entre versions, résultats incomplets, parties hors ligne et confidentialité du profil.

### Priorités et critères communs
- 46.1 réutilise les zones nommées, la roue de communication et les pings déjà prévus ; il ne crée pas un canal d'information caché.
- 46.2 complète les réglages par périphérique et la gestion des périphériques déjà pris en charge ; la continuité des commandes prime sur l'automatisation.
- 46.3 étend la comparaison personnelle de la section 36.4 et réutilise les statistiques officielles ; aucun système de statistiques parallèle.
- Ces fonctions restent secondaires par rapport à la première build Windows jouable, à la stabilité du combat/réseau et à la sécurité. Respecter le budget de 0 € et ne pas intégrer de service payant sans accord explicite.


