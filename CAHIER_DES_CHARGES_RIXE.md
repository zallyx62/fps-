# RIXE — Cahier des charges consolidé

**Version :** 19 novembre 2026  
**Dépôt :** https://github.com/zallyx62/fps-  
**Branche de référence documentaire :** `main`  
**Moteur :** Unreal Engine 5.8 — projet principalement Blueprint.

> Ce document distingue l'existant documenté des objectifs. Une fonctionnalité planifiée n'est pas réputée implémentée tant qu'elle n'a pas été testée.

## 1. Vision et principes

RIXE est un FPS d'arène en équipes, gratuit, open source et communautaire. Il doit accueillir des joueurs internationaux sans imposer le matchmaking automatique ni dépendre de serveurs dédiés permanents.

Principes :
- Jeu de base gratuit, sans avantage compétitif payant.
- Parties hébergées par les joueurs autant que possible.
- Salons, invitations et découverte de parties ; matchmaking facultatif.
- Score valorisant objectifs, assistance, défense et soutien, pas uniquement les éliminations.
- Priorité à la stabilité, la sécurité et l'équilibrage avant l'ajout massif de contenu.

## 2. État de départ connu

Le dépôt est un projet Unreal Engine 5.8 principalement Blueprint, dérivé du modèle First Person / Arena Shooter. Le README et `UNREAL.md` documentent notamment :
- Arène rouge/bleue, règles de manche, score et écran de victoire.
- Multijoueur via serveur d'écoute, hébergement/rejoindre par IP, UDP 7777.
- Bots d'entraînement et logique de remplissage des équipes.
- Armes principales et secondaires, tir, rechargement et munitions répliquées.
- Menus, réglages graphiques/audio/commandes, touches réassignables.
- Chat textuel et commandes de chat vocal.
- HUD et plusieurs validations multijoueur en éditeur.

L'architecture actuelle documentée utilise `OnlineSubsystem Null`. Les éléments décrits dans la documentation doivent être retestés sur une build distribuable.

## 3. Gameplay et cartes

### Cartes de lancement
- Viser trois cartes maximum au lancement initial.
- Équilibrer courte, moyenne et longue portée.
- Éviter les lignes de vue et positions dominantes impossibles à déloger.
- Autoriser le jeu défensif, mais limiter le camping abusif par le level design : itinéraires alternatifs, couvertures, lignes de vue cassées et objectifs qui encouragent la rotation.
- Tester chaque carte avec plusieurs armes et styles de jeu.

### Équipes et bots
- Conserver les équipes rouge et bleue.
- Les bots servent à l'entraînement, aux tests et au remplissage des équipes selon le mode.
- Leur création et leurs décisions importantes doivent rester sous autorité serveur.
- Objectif de référence : jusqu'à 10 contre 10 lorsque performances et stabilité le permettent.

### Score de contribution
Le score doit valoriser capture, défense, progression d'objectif, assistance, soin/réanimation, protection, repérage utile et victoire collective. Les éliminations restent récompensées mais ne doivent pas être l'unique voie de progression.

Barème de départ à équilibrer :
| Action | Points initiaux |
|---|---:|
| Élimination | 100 |
| Assistance | 60 |
| Capture | 150 |
| Défense d'objectif | 100 |
| Progression d'objectif | 20 |
| Soin ou réanimation | 60 |
| Protection d'un allié | 30 |
| Repérage utile | 20 |
| Victoire d'équipe | 150 |

Ces chiffres sont des hypothèses de tuning. Ajouter des conditions d'éligibilité, des plafonds et des protections contre le farming.

## 4. Multijoueur et services en ligne

Étudier puis intégrer Epic Online Services (EOS) pour identités, sessions/salons, invitations, recherche de parties et éventuellement classements.

Contraintes :
- Ne pas imposer le matchmaking : rejoindre par invitation ou salon doit rester possible.
- Privilégier l'hébergement par un joueur pour éviter les coûts de serveurs dédiés permanents.
- Documenter NAT, pare-feu, qualité de connexion, avantage de l'hôte et indisponibilité d'un hôte.
- Étudier la migration d'hôte, sans la promettre avant un prototype testé.
- Distinguer statistiques locales/non classées et résultats classés fiables.
- Ne pas retirer la connexion IP existante avant validation EOS de bout en bout et plan de retour arrière.

Un hôte joueur ne peut pas offrir la même garantie d'intégrité qu'un serveur dédié indépendant.

## 5. Autorité réseau et anti-triche

Priorité critique :
- Le serveur valide tirs, cadence, munitions, dégâts, morts, respawns, scores et résultats.
- Vérifier vitesses, accélérations, téléportations et actions impossibles.
- Ne jamais faire confiance au client pour s'attribuer des points ou déclarer une élimination.
- Limiter et valider les RPC : fréquence, taille, paramètres et états autorisés.
- Protéger salons et profils contre usurpation et abus.
- Journaliser les événements utiles sans collecter inutilement de données personnelles.
- Évaluer un anti-triche client compatible avec les plateformes visées, sans le considérer comme suffisant à lui seul.

Les résultats des parties hébergées par les joueurs ne doivent pas donner accès à des récompenses compétitives de grande valeur sans contrôles supplémentaires.

## 6. Statistiques

Afficher après chaque partie, selon le mode :
- Éliminations, morts et assistances.
- Captures, défense et temps sur objectif.
- Soins, réanimations, protections et repérages utiles.
- Score de contribution et résultat d'équipe.

Le tableau doit expliquer comment le score a été obtenu et valoriser les joueurs utiles à l'équipe, même s'ils ont peu éliminé.

## 7. IA et apprentissage par renforcement

Learning Agents / PPO / imitation learning restent expérimentaux :
- Garder une IA de base fonctionnelle si le plugin ou le modèle appris est indisponible.
- Séparer entraînement, données et exécution en jeu.
- Mesurer précision, survie, contribution aux objectifs, comportement collectif et coût CPU.
- Ne jamais bloquer une partie sur le chargement d'un modèle expérimental.
- Verrouiller et documenter les versions des plugins et dépendances Python.

## 8. Performances et stabilité

- Mesurer CPU, GPU et réseau à 2, 10 et jusqu'à 20 joueurs/bots.
- Éviter les boucles Tick coûteuses et les mises à jour UI redondantes ; privilégier événements et réplication ciblée.
- Tester les builds Development et Shipping, pas uniquement PIE.
- Verrouiller les dépendances et documenter les prérequis.
- Corriger les erreurs critiques avant les nouvelles fonctionnalités.
- Retirer les secrets, jetons et configurations privées du dépôt ; renouveler tout secret exposé.
- Prévoir sauvegarde et restauration du projet.

## 9. Qualité du dépôt

- Maintenir `README.md`, `UNREAL.md` et ce cahier des charges cohérents.
- Marquer chaque élément : planifié, en cours, expérimental, testé ou livré.
- Utiliser branches et pull requests pour les changements importants.
- Ajouter des tests de non-régression pour règles de match, score, dégâts, respawn, connexion et déconnexion.
- Vérifier les plugins activés et retirer les références obsolètes.
- Ne pas versionner caches et fichiers temporaires inutiles.

## 10. Ajouts approuvés dans le dernier échange

Le dernier échange de cadrage approuve quatre ajouts numérotés :
- Ajout 1 : limité à un seul mode.
- Ajout 2 : limité à un seul mode.
- Ajout 3 : limité à un seul mode.
- Ajout 4 : facultatif, désactivable/ignoré.

Le libellé fonctionnel exact de ces quatre éléments doit être recopié depuis la conversation source avant implémentation. Ne pas inventer leur contenu ni les activer globalement par défaut.

## 11. Agent de développement autonome

Le propriétaire souhaite qu'un agent de développement (notamment Claude) avance de manière autonome, y compris avec terminal, éditeur Unreal, navigateur et contrôle du PC lorsque les autorisations correspondantes sont accordées.

Règles :
- Auditer le dépôt et reproduire le problème bloquant actuel avant de coder de nouvelles fonctionnalités.
- Avancer par étapes vérifiables sans demander une validation pour chaque action technique réversible.
- Ne jamais écraser/supprimer des données sans sauvegarde.
- Ne pas publier secrets, données personnelles ou ressources tierces non redistribuables.
- Demander confirmation avant action irréversible, dépense, engagement juridique ou utilisation d'identifiants/paiements.
- Ne déclarer une fonctionnalité terminée qu'après build/test approprié.
- À chaque étape, rapporter fichiers modifiés, tests, résultats, problèmes restants et prochaine action.

## 12. Ordre de réalisation

1. Audit complet du dépôt, plugins, secrets, licences et Blueprints.
2. Reproduire et corriger le problème bloquant actuel ; établir une build de référence.
3. Sécuriser l'autorité serveur et le gameplay réseau.
4. Prototyper EOS : identité, salons, invitations, découverte et connexion de bout en bout.
5. Tester latence, NAT, déconnexion de l'hôte et reconnexion.
6. Implémenter score de contribution et anti-farming.
7. Ajouter tableau de statistiques.
8. Équilibrer cartes, armes et bots.
9. Expérimenter Learning Agents isolément et mesurer les résultats.
10. Optimiser, tester sur plusieurs machines, produire une build Shipping et publier une alpha.

## 13. Distribution et modèle économique — zéro budget

### Décision
- Le jeu de base RIXE doit être gratuit sur toutes les plateformes.
- Aucun achat ne doit donner un avantage de gameplay.
- Le propriétaire dispose actuellement d'un budget de **0 €** : aucune dépense de publication, d'hébergement, d'outil, de publicité ou de sous-traitance ne doit être engagée sans accord explicite et financement préalable.
- Claude / les agents de développement peuvent préparer les cosmétiques, éléments de présentation et tâches de développement dans la mesure permise par les outils, licences et quotas déjà disponibles. Ne pas supposer que l'utilisation d'un agent, de services cloud ou de génération d'assets est sans coût.

### Ordre de publication sans avance de frais
1. **itch.io en premier** : publier gratuitement une version prototype/alpha. Un compte créateur est gratuit et la page peut être configurée en téléchargement gratuit, avec dons facultatifs ou sans paiements. La part de revenus itch.io est configurable ; les frais des prestataires de paiement s'appliquent si des transactions ont lieu.
2. **Steam plus tard** : la publication demande un Steam Direct Fee de 100 USD par produit (taxes éventuelles en sus). Ce montant n'est pas remboursable, mais Valve le récupère sur les paiements dus après que le produit atteint 1 000 USD de revenu brut ajusté éligible. Ne pas payer tant que le budget n'existe pas. Le jeu restera gratuit pour les joueurs ; le paiement est un frais de mise en ligne, pas le prix du jeu.
3. **Epic Games Store éventuellement plus tard** : frais de soumission de 100 USD par produit (taxes locales éventuelles), non remboursables mais récupérables après 1 000 USD de revenus éligibles. Ne pas engager cette dépense tant que le financement n'est pas disponible. Vérifier aussi les exigences de publication, notamment le crossplay PC pour les jeux multijoueurs.
4. Ne pas promettre une sortie simultanée sur toutes les boutiques. Priorité à la stabilité, au coût zéro et à la validation communautaire.

### Financement facultatif sans rendre le jeu payant
- Dons volontaires et soutien communautaire, sans contrepartie qui affecte le gameplay.
- Cosmétiques purement visuels créés pour RIXE : apparences, couleurs, emblèmes, poses ou effets non avantageux, seulement après validation des licences et de la qualité.
- Packs cosmétiques facultatifs, sans armes plus puissantes, bonus d'expérience, accès prioritaire compétitif ni contenu qui fragmente la communauté.
- Soutien participatif / financement communautaire, uniquement avec une présentation transparente de l'objectif, du budget et des risques.
- Éventuellement partenariats ou mécénat, sans céder le contrôle du gameplay ni les données des joueurs.
- Sur itch.io, activer « $0 or Donate » ou « No payments » selon le choix du propriétaire. Les dons restent facultatifs.
- Ne pas dépendre des dons pour payer des serveurs permanents : privilégier l'hébergement par les joueurs et des services gratuits dans leurs limites.

### Gestion stricte du budget
- Coût autorisé par défaut : 0 €.
- Aucun abonnement payant, achat d'asset, plugin payant, publicité, serveur, nom de domaine ou frais de boutique sans approbation préalable.
- Utiliser en priorité les outils, logiciels, services et assets gratuits dont les licences autorisent réellement l'usage et la redistribution du jeu.
- Tenir un registre des coûts réels, y compris frais de paiement, taxes, commissions, coûts d'IA et éventuelles redevances.
- Avant toute sortie commerciale ou collecte de dons, vérifier les obligations légales, fiscales, de protection des consommateurs et de propriété intellectuelle applicables en France et dans les pays ciblés.
- Les dons et cosmétiques sont des pistes possibles, pas des revenus garantis. Le développement ne doit pas présumer qu'ils financeront le projet.

## 14. Licence — audit indispensable

Le dépôt contient actuellement une `LICENSE` GPL-3.0. Les conditions officielles d'Unreal Engine et de certains contenus Epic citent explicitement la GPL parmi les licences incompatibles avec la combinaison/distribution de la technologie ou du contenu licencié.

Ne pas considérer la GPL-3.0 actuelle comme validée pour le projet Unreal complet. Auditer séparément :
1. Code et contenu originaux de RIXE.
2. Code et contenu du modèle Unreal.
3. Ressources Epic / Marketplace / Quixel.
4. Plugins, bibliothèques et ressources tierces.

Piste à étudier : MIT pour les seuls éléments originaux de code RIXE, avec exclusions et notices claires ; licence distincte pour les créations artistiques originales ; licences propres pour les contenus Epic et tiers. Ne pas appliquer une licence globale aux ressources Epic ou tierces. Faire confirmer la licence définitive après inventaire des droits détenus.

Références officielles :
- Unreal Engine EULA : https://www.unrealengine.com/eula/unreal
- Epic Content License Agreement : https://www.unrealengine.com/eula/content
- Options de licence Unreal Engine : https://www.unrealengine.com/license

## 15. Conditions minimales d'une alpha publique

- Hébergement et connexion documentés et testés sur plusieurs réseaux.
- Départ/reconnexion testés.
- Combat et score validés côté serveur.
- Aucun secret dans le dépôt.
- Build Shipping démarrant sur une machine propre.
- Cartes initiales équilibrées.
- Licences des éléments distribués vérifiées.
- Limites de l'hébergement par les joueurs annoncées clairement.

---
Cahier des charges vivant : une ligne planifiée ne prouve jamais que la fonctionnalité existe dans le code.
