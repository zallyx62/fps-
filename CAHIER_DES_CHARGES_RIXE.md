# RIXE — Cahier des charges consolidé

**Version :** 19 novembre 2026 — mise à jour multiplateforme  
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

### Apparition automatique et adaptative (ajout approuvé)
- Les joueurs ne choisissent pas leur point d'apparition : le jeu le sélectionne automatiquement côté serveur.
- À chaque réapparition, évaluer les points autorisés selon la position des adversaires et alliés, les lignes de vue, les menaces immédiates, la proximité des combats et objectifs, l'historique récent des apparitions et le risque de spawn-kill.
- Favoriser une zone sûre mais utile à la reprise du combat, sans téléporter artificiellement un joueur au cœur d'un affrontement ni favoriser systématiquement une équipe.
- Réévaluer les candidats au moment effectif du respawn ; ne jamais se fier à une décision calculée trop tôt si la situation a changé.
- Garder la sélection et les validations sous autorité serveur, avec des règles déterministes et testables. Prévoir une solution de secours si aucun point idéal n'existe.
- Mesurer équité, temps de retour au combat, morts immédiates après apparition et répétition des mêmes points. Les points d'apparition ne doivent pas révéler la position exacte des ennemis.

### Événements environnementaux tactiques (ajout approuvé)
- Ajouter des événements légers et temporaires dans un mode choisi pour le prototype initial : ouverture/fermeture temporaire d'un passage, changement d'accès ou déplacement/activation d'une couverture prévue par la carte.
- Les événements doivent être annoncés clairement, lisibles, prévisibles et identiques pour les deux équipes ; aucune surprise aléatoire ne doit décider seule d'un duel.
- Prévoir des contre-mesures et plusieurs itinéraires ; ne jamais enfermer un joueur, bloquer un objectif ou créer un avantage durable pour l'équipe déjà gagnante.
- Synchroniser l'état de l'événement par le serveur et garantir que collision, visibilité, navigation des bots et réplication correspondent au même état chez tous les joueurs.
- Désactiver cette mécanique dans les modes où elle nuirait à la compétition ou à la lisibilité. Mesurer son impact sur performances, réseau et équilibre avant extension.

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

### Distinctions de fin de partie (ajout approuvé)
- Ajouter des distinctions collectives et individuelles en fin de match, par exemple meilleur soutien, meilleure défense, joueur le plus utile aux objectifs ou esprit d'équipe.
- Attribuer ces distinctions à partir de statistiques vérifiables côté serveur et de critères publiés, pas par simple vote de popularité.
- Prévoir plusieurs catégories et éviter qu'un même profil rafle systématiquement toutes les distinctions ; les récompenses restent symboliques et ne donnent aucun avantage de gameplay.
- Ajouter des seuils minimums, plafonds et contrôles anti-farming/anti-collusion. Ne pas récompenser les actions répétées artificiellement entre amis ou bots.
- Afficher brièvement la raison de chaque distinction et permettre de consulter les statistiques qui la justifient. Ne pas humilier les joueurs non distingués.

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

## 16. Jeu multiplateforme et parité de gameplay

### Objectif du propriétaire
RIXE doit être accessible depuis un navigateur web et sous forme installable (au minimum Windows), avec possibilité d'étendre ensuite à d'autres plateformes. Tous les joueurs doivent retrouver les mêmes règles, armes, cartes, déplacements, capacités, objectifs, progression et conditions de victoire. Une différence de rendu est acceptable ; une différence de gameplay ou un avantage compétitif lié à la plateforme ne l'est pas.

### Distinguer les voies techniques
1. **Client Unreal natif** : priorité de référence pour Windows, puis étude de macOS/Linux et des plateformes mobiles/consoles selon faisabilité, matériel, exigences de publication et coûts. C'est la voie qui conserve directement le rendu Unreal local ; les niveaux de qualité peuvent varier selon le matériel.
2. **Navigateur avec Pixel Streaming** : exécuter une build Unreal sur une machine distante équipée d'un GPU, puis transmettre image et son au navigateur via WebRTC et renvoyer les commandes du joueur. Cette voie conserve réellement le rendu Unreal dans le navigateur, mais elle exige une infrastructure GPU, de la bande passante et une faible latence. Elle n'est pas considérée comme gratuite ou scalable par défaut et ne doit pas être déployée à grande échelle tant que le financement et les tests réseau ne le permettent pas.
3. **Client web natif allégé** : si le streaming Unreal est trop coûteux ou trop lent, développer un client navigateur distinct avec rendu WebGL/WebGPU et interface adaptée. Il doit utiliser les mêmes règles de jeu, données, armes, cartes fonctionnelles, timings, validations serveur et protocole réseau que les clients Unreal. Les différences visuelles doivent rester cosmétiques et ne jamais masquer des informations utiles ou modifier les hitboxes, collisions, visibilité compétitive ou sensations de contrôle.

Ne pas présenter un client WebGL/WebGPU comme un jeu rendu par Unreal Engine : ce serait un rendu distinct. Ne pas supposer qu'un export HTML5/WebAssembly Unreal est une cible officielle prête à l'emploi pour UE 5.8. Le Pixel Streaming est la piste documentée pour afficher une application Unreal dans un navigateur.

### Architecture exigée pour préserver l'équité
- Séparer autant que possible règles de gameplay et autorité serveur du rendu et de l'interface propres à chaque plateforme.
- Le serveur décide des dégâts, tirs, collisions pertinentes, déplacements autorisés, capacités, apparitions, score, événements de carte et résultats ; les clients ne font que présenter et prédire visuellement dans les limites validées.
- Définir une spécification commune et versionnée des règles, des armes, des cartes, des timings, des données de match et du protocole réseau.
- Prévoir cross-play et salons communs entre plateformes compatibles, avec contrôles de latence, input, aide à la visée et équilibre clavier/souris/manette/tactile. Ne jamais donner un avantage artificiel à une plateforme.
- Garder une base de contenu et de règles commune. Les niveaux de détail, textures, éclairage, effets, résolution et fréquence d'images peuvent être adaptés au matériel, sans modifier la simulation compétitive.
- Tester séparément latence, stabilité, fréquence d'images, précision des commandes, lisibilité, accessibilité et performances sur navigateur et clients installés.
- Le navigateur doit rester utilisable sans installation lourde ; prévoir une page d'accueil légère, contrôles compatibles et avertissements clairs si l'appareil ou la connexion ne permet pas une expérience correcte.

### Déploiement progressif et contrainte zéro euro
- Ne pas tenter de développer simultanément toutes les plateformes avant d'avoir une version Windows stable et une architecture réseau/serveur fiable.
- Étape 1 : stabiliser et empaqueter le client Unreal Windows.
- Étape 2 : valider un prototype Pixel Streaming sur réseau local ou infrastructure temporaire gratuite disponible, sans promettre une capacité publique permanente.
- Étape 3 : comparer objectivement Pixel Streaming et client web allégé sur latence, qualité, coût par joueur, compatibilité et charge de développement ; faire un prototype navigateur seulement après ce comparatif.
- Étape 4 : étendre aux autres plateformes natives selon les résultats et les moyens disponibles.
- Aucun serveur GPU, hébergement cloud, abonnement ou service payant sans accord explicite : budget actuel 0 €.

Références techniques Epic à vérifier pour la version du moteur utilisée :
- Pixel Streaming UE 5.8 : https://dev.epicgames.com/documentation/unreal-engine/overview-of-pixel-streaming-in-unreal-engine
- Infrastructure Pixel Streaming : https://dev.epicgames.com/documentation/unreal-engine/pixel-streaming-infrastructure
- Plateformes et packaging UE 5.8 : https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project

## 17. Réseau compétitif, protection communautaire et équilibrage par les données

### 17.1 Réseau adapté aux FPS compétitifs
Objectif : rendre les affrontements aussi réactifs et équitables que possible malgré les différences de latence, de plateforme et de qualité de connexion.
- Mesurer et afficher le ping, la gigue (jitter), la perte de paquets et les variations de qualité de connexion de manière compréhensible.
- Étudier une compensation de latence côté serveur pour la validation des tirs (par exemple rewind/lag compensation avec historique limité des positions), avec fenêtre maximale, contrôles anti-abus et tests de cas extrêmes.
- Étudier la prédiction et la réconciliation des déplacements côté client pour réduire la sensation de retard, sans donner au client l'autorité sur la position réelle ni les collisions validées.
- Optimiser la fréquence et la priorité de réplication selon la pertinence des acteurs, la distance et les besoins du gameplay ; éviter de transmettre inutilement des données.
- Gérer proprement gigue, pertes de paquets, pics de latence et déconnexions ; fournir un diagnostic clair plutôt que masquer une mauvaise connexion.
- Tester en laboratoire avec latence, gigue et pertes simulées, puis sur des réseaux et plateformes variés. Mesurer le temps de réponse, les écarts de tirs, les corrections de mouvement et l'équité entre joueurs.
- Ne pas promettre une équité parfaite : documenter les limites de l'hébergement par un joueur, de la latence et de la compensation. Toute solution doit rester compatible avec l'autorité serveur et les modes classés éventuels.

### 17.2 Protection et modération de la communauté
Objectif : permettre aux joueurs de jouer ensemble dans un environnement accueillant, sans exiger une équipe de modération coûteuse au lancement.
- Actions accessibles depuis le tableau des scores et le profil : signaler un comportement, bloquer un joueur et mettre en sourdine le chat textuel/vocal.
- Catégories de signalement claires (harcèlement, triche présumée, spam, contenu inapproprié, sabotage) et possibilité d'ajouter un contexte limité.
- Anti-spam pour le chat, invitations et autres interactions ; limites de fréquence, détection de répétitions et protections contre les abus automatisés.
- Outils de modération proportionnés : historique minimal nécessaire, file de signalements, priorisation et décisions traçables. Prévoir une procédure de contestation si des sanctions de compte sont introduites.
- Ne pas appliquer de sanction automatique grave sur la base d'un signalement unique ou d'un score opaque. Les signalements coordonnés et abusifs doivent être détectés.
- Respecter la vie privée : minimiser les données collectées, limiter leur durée de conservation, protéger les accès et expliquer les traitements. Ne pas enregistrer les conversations vocales par défaut.
- Distinguer les mesures locales (masquer/silencier) des sanctions globales qui nécessitent une infrastructure et une procédure fiables. Commencer par les fonctions locales et les outils simples compatibles avec le budget de 0 €.

### 17.3 Équilibrage du jeu fondé sur des données
Objectif : identifier les déséquilibres réels sans modifier le jeu sur la base d'une impression ou d'un petit échantillon.
- Collecter des statistiques de gameplay strictement nécessaires et, si possible, agrégées : efficacité des armes, taux de victoire par carte/côté, durée des manches, lieux d'élimination, usage des capacités et contribution aux objectifs.
- Comparer les résultats en tenant compte du niveau des joueurs, du nombre de parties, des équipes, du mode, de la plateforme et de la qualité réseau lorsque ces facteurs sont disponibles et pertinents.
- Utiliser des seuils d'échantillon et des intervalles d'incertitude ; ne pas tirer de conclusion d'une poignée de parties ni confondre corrélation et causalité.
- Créer des rapports internes et visualisations de tendances pour les développeurs. Ne pas exposer publiquement de données personnelles ou de profils individuels sensibles.
- Tester les changements d'armes, cartes et règles sur une branche ou un environnement de test, comparer avant/après et garder une possibilité de retour arrière.
- Ne jamais laisser un algorithme modifier automatiquement les statistiques d'armes ou les règles en pleine partie classée. Les changements d'équilibrage doivent être versionnés, annoncés et validés avant déploiement.
- Prévoir une option de télémétrie minimale et une information claire des joueurs ; vérifier les obligations de protection des données applicables avant toute collecte en ligne.

### Ordre de priorité
1. Diagnostic réseau et tests avec latence/pertes simulées ; ensuite compensation et prédiction contrôlées.
2. Blocage, sourdine et signalement local ; ensuite outils de modération et protections anti-spam.
3. Instrumentation minimale et rapports d'équilibrage ; ensuite analyses comparatives et tests contrôlés.

Ces trois chantiers restent planifiés tant qu'ils n'ont pas été implémentés et testés sur des builds distribuables.

---
Cahier des charges vivant : une ligne planifiée ne prouve jamais que la fonctionnalité existe dans le code.

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

## 19. Ajouts approuvés : A, B et E

### A — Stabilisation et consolidation du multijoueur
- Faire d'EOS (ou d'une solution équivalente validée) une couche de services en ligne réellement testée : identité, sessions/salons, invitations, recherche de parties et classements si disponibles.
- Garantir un parcours complet et cohérent : créer/rejoindre un salon, inviter, rejoindre un ami, lancer une partie, gérer les déconnexions et revenir au groupe.
- Prévoir un navigateur de parties/salons avec filtres utiles (mode, région/latence, places disponibles, plateforme et type de partie), sans exposer de données privées.
- Afficher les erreurs de connexion avec une explication et une action de récupération compréhensibles.
- Conserver une solution de connexion de secours pendant la transition ; ne retirer aucun parcours existant avant validation de bout en bout.
- Les classements doivent utiliser des résultats fiables validés côté serveur et distinguer clairement les parties classées des parties privées/non classées.

### B — Anti-camping intelligent
- Compléter le level design anti-camping par des mécanismes de jeu contextuels, sans interdire la défense tactique ni pénaliser un joueur qui tient temporairement un objectif.
- Repérer les positions durablement dominantes à partir de données de partie (durée d'immobilité, répétition d'éliminations depuis une même zone, couverture et lignes de vue), sans se baser sur un seul indicateur.
- Préférer des réponses indirectes et équitables : itinéraires alternatifs, objectifs qui déplacent l'action, couvertures et contre-positions accessibles aux deux équipes.
- Si un signal visuel ou une information tactique est utilisé, il doit être symétrique, lisible et ne jamais révéler gratuitement la position exacte d'un joueur.
- Ne pas infliger automatiquement de dégâts, retirer de points ou dévoiler un joueur uniquement parce qu'il reste immobile ; le sniper, le défenseur d'objectif et les stratégies légitimes doivent rester viables.
- Tester sur plusieurs cartes, armes et niveaux de compétence afin de réduire le camping abusif sans rendre les cartes chaotiques ni favoriser le rush permanent.

### E — Transparence des statistiques de fin de partie
- Présenter un tableau de fin de partie détaillé et compréhensible pour tous les joueurs : éliminations, morts, assistances, dégâts utiles si mesurables, objectifs, défense, soutien, soins/réanimations, protections, repérages et score.
- Expliquer comment les points et distinctions ont été attribués, avec les critères et valeurs applicables au mode joué.
- Distinguer clairement statistiques individuelles, contribution à l'équipe et résultat collectif ; éviter qu'un seul ratio éliminations/morts résume la performance.
- Permettre de consulter les statistiques de chaque joueur de la partie, sous réserve des règles de confidentialité et des données réellement disponibles.
- Garder les chiffres cohérents entre le tableau de match, le profil et les statistiques de carrière ; signaler les données indisponibles plutôt que d'inventer ou d'estimer silencieusement.
- Les statistiques affichées doivent provenir d'événements validés et ne pas exposer de données personnelles ou techniques sensibles.

## 20. Création communautaire, replays et calibration des joueurs (ajouts approuvés)

### 20.1 Replays complets de parties
- Prévoir un système de replay permettant de revoir une partie entière après sa fin, au-delà de la killcam.
- Enregistrer prioritairement les événements et états nécessaires à une reconstruction fiable (positions, actions, tirs, dégâts, objectifs, apparitions, événements de manche), plutôt qu'une vidéo lourde lorsque la reconstruction déterministe est possible.
- Permettre de choisir un joueur à suivre, passer d'une vue à l'autre, utiliser une caméra libre si le mode et les règles l'autorisent, mettre en pause et parcourir la chronologie.
- Ajouter des commandes de lecture (lecture/pause, vitesse, saut à un événement) et une chronologie des éliminations/objectifs.
- Distinguer clairement les replays locaux, privés et partageables. Ne jamais publier automatiquement un replay contenant des données privées ou des communications vocales.
- Prévoir des limites de stockage, une durée de conservation configurable et des contrôles de confidentialité. Ne pas enregistrer le chat vocal par défaut.
- Les replays doivent indiquer leur version de jeu et être déclarés incompatibles si une mise à jour empêche une reconstruction fidèle.
- Utiliser les replays pour l'analyse et le signalement, sans les considérer comme preuve infaillible en l'absence de vérification serveur.

### 20.2 Éditeur de cartes communautaire
- Étudier un éditeur de cartes accessible permettant de construire des arènes à partir d'éléments et d'outils autorisés, de placer apparitions/objectifs/couvertures et de tester la circulation des joueurs.
- Fournir des outils de validation : limites de carte, collisions, points d'apparition, lignes de vue, zones inaccessibles, performances, lisibilité et risques de spawn-kill/camping.
- Permettre les tests privés entre amis avant toute proposition à la communauté.
- Prévoir une galerie de cartes avec aperçu, description, auteur, version, notes et retours des joueurs ; les évaluations doivent être protégées contre le spam et les votes coordonnés.
- Mettre en place une validation technique et une modération avant qu'une carte communautaire puisse rejoindre une playlist publique ou compétitive.
- Séparer les cartes communautaires des cartes officielles et des classements officiels tant qu'elles n'ont pas passé les tests d'équilibrage et de sécurité.
- Définir un format de contenu sécurisé, versionné et limité : pas d'exécution de scripts arbitraires, pas d'accès aux fichiers personnels et pas d'assets sans droits de redistribution.
- Respecter strictement les licences des outils, éléments de construction et contenus importés. Ne pas autoriser l'import d'assets tiers non vérifiés.
- Commencer par un prototype restreint et des outils internes ; l'éditeur complet ne doit pas retarder la stabilité du FPS ni dépasser le budget de 0 €.

### 20.3 Calibration du niveau et détection des abus de matchmaking
- Estimer le niveau réel d'un joueur sur plusieurs parties et avec une incertitude explicite, plutôt qu'à partir d'une seule victoire ou du ratio éliminations/morts.
- Prévoir une phase de calibration progressive pour les nouveaux comptes et les joueurs revenant après une longue absence, sans les enfermer durablement dans une catégorie.
- Détecter les comportements compatibles avec du smurfing ou de la manipulation de matchmaking à partir de plusieurs signaux agrégés et contextualisés ; ne jamais conclure sur la seule base d'une bonne partie.
- Distinguer un joueur très talentueux, un joueur qui progresse rapidement, un compte secondaire légitime et une manipulation volontaire.
- Ajuster prudemment l'estimation de niveau et les adversaires proposés ; ne pas appliquer de bannissement ou sanction automatique sur une simple suspicion.
- Prévoir une possibilité de réévaluation et de contestation en cas d'erreur, et limiter la collecte aux données nécessaires.
- Tester l'effet sur les nouveaux joueurs, les groupes d'amis, le cross-play, les joueurs de retour et les petites populations de matchmaking.
- Garder les règles et seuils documentés, versionnés et révisables ; aucune modification cachée des statistiques ou des résultats d'une partie en cours.

### Statut
Ces trois fonctionnalités sont approuvées et planifiées. Elles restent non livrées tant que leurs prototypes, contrôles de sécurité, tests multi-joueurs et contraintes de performance n'ont pas été validés.

## 21. Crosshair entièrement personnalisable

### Deux formes de base
- Proposer deux formes prédéfinies dès le départ : **rond** et **croix**.
- Ces deux formes doivent être disponibles gratuitement pour tous les joueurs, sur toutes les plateformes compatibles.
- Le joueur peut choisir l'une des deux comme point de départ, puis modifier son apparence.

### Personnalisation détaillée
- Permettre de régler la taille, l'épaisseur, l'écartement, la longueur des branches, le diamètre du rond, la couleur et l'opacité.
- Permettre d'activer ou désactiver un point central, un contour et un fond/halo de contraste lorsque ces options restent lisibles.
- Permettre de choisir un réticule statique ou, si le jeu le prend en charge, un comportement dynamique lié au déplacement, au saut ou au tir.
- Fournir un aperçu en direct dans les paramètres et un moyen de tester le réticule dans le stand de tir.
- Proposer une remise à zéro, plusieurs emplacements de profils personnalisés et des préréglages simples.
- Sauvegarder les réglages dans le profil du joueur et les synchroniser entre plateformes lorsque le compte multiplateforme le permet.
- Prévoir des paramètres distincts par arme ou catégorie d'armes uniquement si cela reste simple à comprendre et fiable à synchroniser.
- Assurer la lisibilité sur les différentes cartes et arrière-plans ; proposer des options d'accessibilité pour les couleurs et le contraste.

### Équité et contraintes
- Le crosshair personnalisé est purement visuel : aucune aide à la visée, détection automatique des adversaires, indication de leur position ou information cachée.
- Ne pas fournir d'avantage compétitif par rapport aux autres joueurs ; les options doivent seulement modifier l'apparence et le comportement visuel autorisé du réticule.
- Garantir une interface cohérente à la souris/clavier, à la manette et sur les interfaces tactiles prises en charge.
- Tester la sauvegarde, le changement d'arme, le changement de résolution, le mode fenêtré/plein écran et la synchronisation entre deux appareils.

### Statut et validation
La fonctionnalité est approuvée et planifiée. La mention historique d'un « éditeur de réticule » dans les notes techniques ne vaut pas preuve d'implémentation. Elle ne sera déclarée disponible qu'après vérification dans le projet Unreal, tests en jeu et validation de la sauvegarde des réglages.


## 22. Fiabilité, sécurité, accessibilité et qualité de livraison — nouveaux ajouts approuvés

Les dix axes ci-dessous sont approuvés et doivent être intégrés à la planification. Leur présence dans le cahier des charges ne signifie pas qu'ils sont déjà implémentés. Chaque axe doit être évalué, prototypé et testé selon les priorités, les contraintes de budget (0 €) et la capacité réelle du projet.

### 22.1 Diagnostic et correction des désynchronisations de combat
- Mesurer les écarts entre l'état présenté au client et l'état autoritatif validé par le serveur : positions, tirs, impacts, dégâts et événements.
- Identifier les symptômes de latence, jitter, pertes de paquets et corrections de prédiction ; distinguer clairement un problème réseau d'un comportement suspect.
- Corriger les écarts visuels progressivement lorsque cela ne compromet pas la cohérence compétitive ; ne jamais falsifier l'état autoritatif.
- Fournir des diagnostics techniques reproductibles et respectueux de la vie privée, avec collecte minimale et durée de conservation définie.
- Tester les cas limites sur différentes latences, pertes de paquets et fréquences d'images.

### 22.2 Séparation des parties classées et non classées selon leur niveau de confiance
- Ne proposer de classement officiel que pour des parties dont l'intégrité des résultats peut être suffisamment garantie.
- Évaluer les limites de l'hébergement par un joueur : avantage potentiel de l'hôte, autorité réelle, départ de l'hôte, falsification des résultats et résistance aux manipulations.
- Séparer clairement les parties privées, publiques non classées et classées ; afficher le type d'hébergement et les garanties réelles avant la partie.
- Si une autorité indépendante et fiable n'est pas disponible, désactiver le classement officiel plutôt que prétendre qu'il est sécurisé.
- Ne pas imposer de serveurs payants : toute architecture doit respecter le budget de 0 € ou être soumise à approbation avant dépense.

### 22.3 Accessibilité complète
- Ajouter des options de daltonisme et de distinction des équipes qui ne reposent pas uniquement sur la couleur.
- Permettre de régler tailles de texte, sous-titres, éléments du HUD, contraste et lisibilité.
- Proposer une réduction ou désactivation des flashs, secousses de caméra et effets visuels agressifs, dans les limites de l'équité.
- Séparer les volumes des armes, pas, explosions, interface et communications.
- Proposer des indices visuels facultatifs pour certains sons importants, sans révéler d'informations que le joueur ne pourrait normalement pas connaître.
- Permettre de choisir entre maintenir une touche et basculer un état pour les actions compatibles.
- Vérifier que les options ne fournissent aucun avantage compétitif injuste et qu'elles fonctionnent sur les plateformes prises en charge.

### 22.4 Tutoriel progressif et apprentissage facultatif
- Construire des exercices courts pour les déplacements, le tir, le rechargement, les armes et les objectifs.
- Proposer des entraînements facultatifs adaptés aux difficultés observées, sans pénalité ni obligation.
- Expliquer les notions d'attaque, défense, soutien et coopération.
- Permettre de passer, reprendre ou recommencer chaque exercice.
- Ne pas exposer les données personnelles ou les performances individuelles publiquement ; utiliser uniquement les informations nécessaires pour adapter les exercices.

### 22.5 Laboratoire de validation et d'équilibrage des armes
- Développer des outils internes pour mesurer dégâts, portée, dispersion, recul, cadence, temps de rechargement et récupération de précision.
- Comparer des configurations d'armes dans des conditions reproductibles.
- Tester les armes selon différentes distances, fréquences d'images et conditions réseau.
- Générer des rapports comparatifs versionnés pour les développeurs.
- Ne pas modifier automatiquement les valeurs en partie ; tout changement doit être testé, documenté et réversible.
- Le laboratoire complète le stand de tir joueur, mais ne le remplace pas.

### 22.6 Batterie de validation automatique des cartes
- Détecter les apparitions dans des géométries invalides, dangereuses ou immédiatement exposées.
- Repérer les risques de blocage, zones inaccessibles, collisions incorrectes, passages involontairement réservés à une équipe et objectifs impossibles à atteindre.
- Mesurer les distances entre apparitions, objectifs et zones de combat, sans remplacer les tests humains d'équilibrage.
- Contrôler les performances, les lignes de vue et les possibilités de sortie de carte.
- Produire un rapport exploitable avant validation d'une carte officielle ou communautaire.
- Les résultats automatisés sont des alertes à examiner, pas une preuve suffisante d'équilibrage.

### 22.7 Sécurité et contrôle des sessions de compte
- Permettre au joueur de consulter les sessions et appareils connectés et de révoquer une session à distance.
- Prévoir une récupération de compte sécurisée et des protections renforcées pour les opérations sensibles.
- Protéger les changements d'adresse e-mail, les liaisons/déliaisons de plateformes et les modifications des moyens de récupération.
- Informer le joueur des changements de sécurité importants.
- Ne jamais stocker de mots de passe en clair ; appliquer les bonnes pratiques d'authentification, de limitation des tentatives et de protection des secrets.
- Ne pas créer de mécanisme de sécurité qui nécessite un service payant sans approbation explicite.

### 22.8 Compatibilité des versions et mises à jour réversibles
- Vérifier la compatibilité des versions client, serveur, cartes et données de gameplay avant une connexion.
- Détecter les fichiers manquants, corrompus ou incompatibles et expliquer clairement la correction nécessaire.
- Empêcher qu'un client puisse imposer des données de gameplay non autorisées au serveur.
- Versionner les paramètres d'armes, cartes, règles et formats de données.
- Prévoir une procédure de retour à une version précédente lorsque cela est techniquement et juridiquement possible.
- Documenter les changements susceptibles d'affecter les replays, les statistiques et la compatibilité multijoueur.

### 22.9 Profilage des performances sur configurations modestes
- Mesurer les FPS, temps de frame, saccades, mémoire, temps de chargement, coûts CPU/GPU et charge réseau.
- Identifier les cartes, effets, bots et systèmes de réplication les plus coûteux.
- Définir des profils graphiques cohérents et préserver la lisibilité compétitive à faible niveau de détail.
- Tester sur plusieurs catégories de matériel réellement disponibles, sans inventer de configuration minimale non mesurée.
- Comparer les résultats avant/après chaque changement important et conserver des références de performance.
- Ne pas sacrifier l'équité visuelle entre plateformes.

### 22.10 Tests automatiques de non-régression du gameplay
- Créer des tests reproductibles couvrant les règles essentielles : munitions, cadence de tir, dégâts, mort, score, objectifs, apparitions, équipes, bots et sauvegarde des paramètres.
- Vérifier qu'une action ne peut pas attribuer plusieurs fois les mêmes points ou événements.
- Vérifier que les clients ne peuvent pas imposer au serveur les dégâts, résultats ou récompenses.
- Ajouter des tests réseau, de reconnexion et de compatibilité lorsqu'ils deviennent disponibles.
- Exécuter les tests pertinents après chaque modification et avant toute livraison.
- Consigner les tests réellement exécutés, leurs résultats, les limites connues et le commit testé ; ne jamais déclarer un test réussi s'il n'a pas été exécuté.

### Ordre de priorité recommandé
1. Tests automatiques de non-régression et diagnostic des désynchronisations.
2. Confiance et intégrité des parties classées.
3. Laboratoire de validation des armes et validation automatique des cartes.
4. Compatibilité des versions, profilage des performances et sécurité des sessions.
5. Accessibilité et tutoriel progressif.

### Règles de réalisation
- Ces axes ne doivent pas détourner l'équipe des blocages actuels, de l'audit des licences, de la stabilité du multijoueur et de la production d'une version jouable.
- Privilégier des prototypes réduits, mesurables et livrables ; découper ou reporter les systèmes trop ambitieux.
- Aucune dépense, dépendance payante ou infrastructure payante sans accord explicite du propriétaire.
- Aucune fonctionnalité ne peut être marquée « terminée » sur la seule base de sa spécification ou de code non testé.
- Pour chaque axe : préciser l'état réel (non commencé, en cours, prototype, testé, livré), les dépendances, les risques, les tests et les preuves de validation.


## 23. Nouvelles fonctionnalités communautaires et confort de partie — approuvées

Ces cinq fonctionnalités sont approuvées et planifiées. Elles ne sont pas considérées comme implémentées tant qu'elles n'ont pas été développées et testées dans une build réelle.

### 23.1 Roue de communication rapide
- Ajouter une roue de communication accessible rapidement, notamment à la manette et au clavier, avec des messages courts prédéfinis : « ennemi repéré », « besoin de renfort », « défendez l'objectif », « je recharge », « regroupez-vous », « danger », « merci » et « bien joué ».
- Prévoir une présentation textuelle claire et, si possible sans dépendance payante, des annonces vocales préenregistrées ou synthétiques uniquement si la licence et la taille le permettent.
- Transmettre uniquement les informations que le joueur est autorisé à communiquer ; une indication directionnelle ou de position ne doit pas révéler une information inconnue du joueur.
- Ajouter limitation de fréquence, mute, désactivation et protections anti-spam.
- Adapter l'interface aux plateformes et périphériques pris en charge.

### 23.2 Échauffement pré-match de dix secondes — isolation totale des équipes
- Avant le début officiel de chaque partie, prévoir une phase d'échauffement de **10 secondes**, inspirée des salons d'échauffement des anciens Call of Duty.
- Pendant cette phase, chaque joueur peut librement marcher, courir, sprinter, sauter, viser, tirer, recharger, changer d'arme et tester les grenades ou équipements disponibles dans le mode.
- Les joueurs peuvent entendre les sons de leur propre équipe, mais **aucun son de l'équipe adverse ne doit leur parvenir** : tirs, impacts, explosions, grenades, pas, sauts, rechargements, voix, communications et autres événements audio.
- L'isolation doit être appliquée techniquement côté serveur et/ou par le système de réplication audio : ne pas simplement baisser le volume adverse dans les réglages locaux. Aucun événement audio adverse ne doit être transmis ou rendu audible pendant cette phase.
- Les deux équipes ne doivent recevoir aucune information sur les actions de l'autre équipe : positions, déplacements, visée, tirs, grenades, équipement, changements d'arme, éliminations, messages, marqueurs, indicateurs, killfeed ou notifications. Ne pas transmettre ces informations aux clients adverses pendant l'échauffement lorsque cela est techniquement possible.
- Prévoir une séparation des espaces ou des instances d'échauffement si nécessaire afin d'empêcher les joueurs de voir l'équipe adverse. Si les joueurs partagent physiquement la même carte, masquer les silhouettes, noms, effets, projectiles et autres indices visuels adverses.
- Les joueurs peuvent tester librement les armes et équipements ; les munitions peuvent être réapprovisionnées et les réapparitions rapides autorisées pour éviter les temps morts.
- Les tirs, dégâts, grenades, éliminations et autres actions de l'échauffement ne comptent pas dans les statistiques, le score, les défis, les replays officiels ou le résultat de la partie. Aucun effet persistant ne doit influencer le début officiel.
- À la fin des dix secondes, terminer l'échauffement, réinitialiser les états nécessaires (santé, munitions, grenades, positions et équipements selon les règles du mode), puis démarrer simultanément la partie officielle pour les deux équipes.
- Synchroniser le compte à rebours avec l'autorité de partie. Gérer proprement les chargements tardifs, pertes de connexion et arrivées tardives ; ne pas démarrer avec des états différents entre clients.
- L'échauffement doit être identique pour tous les joueurs du match et ne doit procurer aucun avantage d'information ou de position au lancement officiel.

### 23.3 Rotation intelligente des cartes et des modes
- Éviter les répétitions excessives d'une même carte ou d'un même mode dans les playlists concernées.
- Tenir compte de l'historique récent des parties, de la population disponible et des contraintes de matchmaking.
- Si un vote est proposé, offrir un choix équitable et éviter que le système ne favorise toujours la même carte.
- Ne pas imposer une carte incompatible avec le mode ou les règles de la playlist.
- Garder une rotation déterministe et explicable ; ne pas modifier le matchmaking pour masquer une population insuffisante.

### 23.4 Historique des changements du jeu
- Mettre à disposition des notes de version consultables et archivées : changements d'armes, cartes, règles, corrections et améliorations techniques.
- Associer chaque version aux identifiants de build, branche/commit de développement et date de publication lorsque ces informations sont disponibles.
- Permettre de retrouver les notes des versions précédentes et d'identifier les changements pouvant affecter les statistiques ou replays.
- Ne publier que des informations vérifiées ; distinguer clairement les changements livrés des changements prévus.

### 23.5 Protection contre les erreurs de manipulation
- Demander une confirmation pour les actions destructrices ou difficiles à annuler, par exemple supprimer un profil local ou réinitialiser des paramètres.
- Prévoir une restauration des paramètres par défaut et, lorsque cela est faisable, une sauvegarde des configurations avant modification.
- Permettre plusieurs profils de commandes et de réglages sans écraser accidentellement le profil actif.
- Éviter les confirmations répétitives pour les actions quotidiennes non risquées.
- Ne jamais présenter une suppression distante ou une restauration cloud comme réversible si elle ne l'est pas réellement.

### Statut
Les cinq fonctionnalités sont approuvées et planifiées. Leur priorité est inférieure à la correction des blocages, à la stabilité du FPS multijoueur et à l'obtention d'une build jouable et testable.


## 24. Objectif prioritaire de livraison — horizon de douze jours

### Objectif obligatoire
À l'échéance d'environ douze jours à compter de la décision du propriétaire (19 novembre 2026), l'objectif principal est de fournir **un FPS RIXE réellement jouable et testable**, même si certaines fonctionnalités avancées du cahier des charges restent à développer. Il ne faut pas promettre que l'intégralité du cahier des charges sera terminée dans ce délai.

### Définition minimale d'une livraison jouable
- Une build Unreal empaquetée et exécutable sur Windows x64, si l'environnement et les outils disponibles le permettent.
- Le jeu démarre sans erreur bloquante, permet d'accéder à une partie et de jouer une boucle de gameplay complète.
- Les contrôles essentiels fonctionnent : déplacement, visée, tir, rechargement, dégâts, élimination, réapparition et fin de partie selon le mode retenu.
- Au moins une carte fonctionnelle et un mode jouable, avec des bots si le multijoueur réel n'est pas encore suffisamment stable.
- Tester le multijoueur réel si disponible ; documenter précisément les limites, et ne pas le présenter comme validé si seuls des tests locaux ont été réalisés.
- Pas de crash bloquant connu au démarrage ou pendant la boucle de jeu testée.
- Fournir un lien direct vérifié vers la build de test, ou expliquer explicitement pourquoi aucun lien ne peut être produit.
- Indiquer branche, commit, plateforme, procédure de lancement, tests exécutés, problèmes connus et fonctionnalités non livrées.

### Plan de travail indicatif
1. Jours 1–2 : audit de l'état réel, sauvegarde, audit des licences et reproduction du blocage principal.
2. Jours 3–5 : résoudre le blocage et obtenir une boucle de jeu complète dans Unreal.
3. Jours 6–8 : stabiliser le gameplay, la carte, les bots et le multijoueur disponible ; corriger les défauts critiques.
4. Jours 9–10 : tests de régression, performances, sauvegarde et corrections.
5. Jours 11–12 : empaquetage, test propre de la build, documentation et livraison du lien vérifié.

Ce calendrier est une cible de pilotage, pas une garantie. Réviser les étapes selon les résultats techniques réels et préserver du temps pour les tests.

### Gel de périmètre et arbitrage
- Jusqu'à l'obtention d'une build jouable, ne pas démarrer de gros systèmes secondaires simplement parce qu'ils figurent dans le cahier des charges.
- Prioriser dans cet ordre : (1) sauvegarde et audit des licences, (2) blocage empêchant de jouer, (3) boucle de gameplay complète, (4) stabilité et tests, (5) build téléchargeable, (6) fonctionnalités secondaires seulement si le temps restant le permet.
- Les fonctionnalités avancées non essentielles peuvent être reportées sans être supprimées du cahier des charges.
- Ne pas dégrader la sécurité, les licences ou l'intégrité du jeu pour respecter artificiellement la date.
- Ne pas déclarer RIXE « terminé » : qualifier précisément le résultat de prototype jouable, alpha de test ou autre statut justifié par les validations effectuées.


## 25. Audit de licence Unreal Engine / Epic — point bloquant à résoudre avant distribution

### Constat vérifié dans le dépôt et les conditions Epic consultées le 19 novembre 2026
- Le dépôt contient un fichier `LICENSE` intégralement rédigé sous GNU GPL version 3.
- Le fichier `README.md` indique que le code et les ressources créés pour RIXE, dont `Content/Rixe`, sont sous GPL-3.0, et que les ressources issues des modèles Epic restent sous la licence Unreal Engine.
- Le projet `fps.uproject` déclare Unreal Engine 5.8 et active plusieurs plugins ; chaque plugin, module, contenu et dépendance doit être inventorié avec sa version et sa licence.
- La version actuelle de l'Unreal Engine EULA publiée par Epic contient une clause « Non-Compatible Licenses » (section 6(c)) qui cite explicitement GNU GPL et LGPL (sauf simple liaison dynamique d'une bibliothèque partagée) parmi les licences incompatibles avec la Licensed Technology. L'accord limite aussi la redistribution du moteur et du contenu Epic ; les produits intégrant le moteur doivent respecter les conditions de distribution applicables.
- Ce constat crée un risque sérieux de compatibilité entre la GPL-3.0 annoncée pour le projet et l'utilisation/intégration d'Unreal Engine. Il ne permet pas, à lui seul, de conclure que chaque fichier du dépôt est soumis à la même licence ou que le propriétaire détient les droits nécessaires pour relicencier tous les éléments.

### Consignes obligatoires
- **Ne pas remplacer, supprimer ou réécrire le fichier `LICENSE` automatiquement.** Ne pas annoncer que le problème est réglé par un simple changement global vers MIT, BSD ou Apache.
- Auditer fichier par fichier et dossier par dossier : code original, Blueprints et assets originaux, modèle First Person/Arena Shooter, Starter Content, exemples Epic, contenus Fab/Quixel, plugins, bibliothèques, sons, polices, textures, animations, outils et prototype web.
- Pour chaque élément, relever auteur/source, version, propriétaire des droits, licence exacte, preuve d'acquisition, droits de modification, redistribution, usage commercial et restrictions de plateforme/source.
- Séparer clairement les éléments originaux RIXE des éléments Epic et des tiers. Ne pas appliquer une licence open source au contenu Epic ou tiers sans autorisation expresse.
- Vérifier si les fichiers originaux placés dans le même projet Unreal et distribués avec le moteur peuvent légalement rester sous GPL au regard de la clause 6(c). Examiner une architecture de licences séparées ou une licence permissive pour les seuls éléments originaux, uniquement si le propriétaire possède les droits nécessaires et après validation juridique.
- Ne pas présumer que MIT résout toutes les obligations : conserver les notices tierces, respecter les licences des plugins/assets et les règles de redistribution d'Epic.
- Produire un rapport de compatibilité, les éléments incertains, les options de remédiation et leurs conséquences sur l'ouverture du code, la distribution des sources et les builds binaires.
- Si la compatibilité ne peut pas être établie, suspendre la publication/distribution publique des éléments concernés jusqu'à décision du propriétaire après avis juridique adapté. Le travail privé de développement ne doit pas être confondu avec une autorisation de redistribuer.
- Consigner la version et la date de l'EULA examinée ; revérifier les conditions Epic au moment de toute distribution.

### Décision de licence
Aucune modification de licence n'est autorisée sans inventaire complet, preuve des droits du propriétaire sur chaque élément concerné et approbation explicite du propriétaire. Toute modification doit être ciblée, documentée et vérifiée dans toutes les branches et tous les fichiers de notices concernés.


## 26. Lobby public, continuité des parties, identité sonore et modes Chaos — ajouts approuvés

### Lobby public à lancement automatique, inspiré de Black Ops II
- Concevoir une expérience de playlist publique dans laquelle les joueurs rejoignent un lobby commun à un mode/une playlist, voient les joueurs arriver et attendent le lancement collectif de la partie.
- Le lancement se déclenche automatiquement lorsque le lobby est suffisamment rempli et/ou lorsque le compte à rebours configuré arrive à zéro. Le système doit pouvoir lancer avec un effectif inférieur au maximum si les seuils minimums du mode sont atteints ; sinon, prolonger/recommencer l'attente sans bloquer indéfiniment les joueurs.
- Afficher clairement le nombre de joueurs présents, les places restantes, le mode/la carte, l'état de préparation et le compte à rebours. Le joueur ne doit pas avoir à confirmer individuellement à chaque étape si la playlist publique utilise le lancement automatique.
- Prévoir un seuil minimum, un effectif cible, un délai maximum et des règles de remplissage/backfill. Ne pas lancer une partie déséquilibrée ou injouable simplement pour respecter le timer.
- Le système doit préserver la qualité de connexion, la région/latence et les règles de matchmaking du mode. Pour le classé, appliquer les critères d'intégrité et d'équité plus stricts.
- La confirmation avant lancement reste utile pour les groupes privés/personnalisés ou les changements importants de configuration ; elle ne doit pas transformer le lobby public en succession de pop-ups.
- S'inspirer du rythme et de la lisibilité des anciens lobbies Call of Duty/Black Ops II, sans copier leur interface ou leur code. La référence est le principe de rassemblement dans un lobby puis lancement automatique.

### Déconnexion, période de grâce et remplacement par bot
- Lorsqu'un joueur perd sa connexion ou quitte involontairement, conserver temporairement sa place et son identité de session pendant une période de grâce configurable par mode.
- Pendant cette période, afficher l'état « reconnexion possible » et permettre au même compte/session de reprendre sa place, son équipe et son emplacement logique, sous réserve des validations serveur.
- Le joueur reconnecté ne doit pas récupérer un avantage indu : rétablir son état de jeu selon des règles sûres (par exemple réapparition ou réintégration protégée), sans restaurer un état client non fiable.
- À l'expiration de la période de grâce, remplacer automatiquement le joueur absent par un bot adapté au mode et au niveau moyen de la partie, si le mode autorise les bots.
- Si le joueur revient après le remplacement, appliquer une règle explicite : reprendre sa place en remplaçant le bot si cela est autorisé et sans expulser un autre joueur humain ; sinon attendre une place disponible ou rejoindre en spectateur/au prochain match selon le mode.
- Le bot ne doit pas recevoir les données privées du compte et ne doit pas modifier les statistiques personnelles du joueur absent. Les actions du bot doivent être distinguées dans les statistiques, replays et journaux.
- En classé, définir une politique stricte et cohérente : période de grâce, bot temporaire ou absence de bot selon les exigences compétitives ; aucun résultat ne doit être artificiellement attribué au joueur déconnecté. Prévoir protections contre les déconnexions volontaires et abus de reconnexion, sans sanction automatique sur une simple coupure réseau.
- Synchroniser ces transitions côté serveur et tester coupure réseau, fermeture du jeu, retour rapide, retour tardif, hôte déconnecté, plusieurs joueurs absents et panne de session.

### Migration automatique de l'hôte
- Si l'hôte joueur quitte ou perd durablement sa connexion, tenter de transférer l'autorité de session à un autre participant éligible, avec migration d'état vérifiée et reprise coordonnée.
- Élire le nouvel hôte selon des critères documentés (stabilité, latence, capacité et disponibilité), sans permettre au client de s'auto-attribuer l'autorité.
- Prévoir un délai de migration, un message clair, la reprise ou l'annulation propre de la partie et une solution de secours si la migration échoue.
- Ne jamais considérer la migration P2P comme équivalente à un serveur dédié indépendant pour l'intégrité du classé. Les parties classées doivent utiliser une architecture et des validations adaptées ; désactiver ou limiter la migration si elle compromet l'intégrité.
- Prototyper et mesurer la faisabilité avec l'architecture réseau réelle avant de déclarer la fonction disponible.

### Appellations tactiques des zones de carte
- Donner aux zones importantes de chaque carte des noms courts, distinctifs, faciles à prononcer et traduisibles.
- Utiliser les mêmes appellations dans la mini-carte, les pings, la roue de communication, les objectifs et les communications rapides.
- Éviter les noms ambigus ou trop proches phonétiquement ; tester leur compréhension dans plusieurs langues et sans vocal.
- Permettre de signaler rapidement une zone par son nom, sans révéler automatiquement une information que le joueur n'a pas observée.

### Identité sonore des armes et satisfaction du tracking
- Chaque arme doit avoir une identité sonore de tir et de confirmation d'impact clairement reconnaissable, cohérente avec sa mécanique, sa cadence et sa catégorie.
- Le retour sonore lorsqu'un projectile/tir touche un adversaire doit être particulièrement satisfaisant, précis et lisible pendant le tracking, sans devenir envahissant ni masquer les sons tactiques importants.
- Concevoir des couches audio distinctes et mixables : tir de l'arme du joueur, impacts sur surfaces, impacts confirmés sur adversaire, élimination, rechargement et événements spécifiques. Le retour d'impact doit être fiable et déclenché à partir d'un résultat confirmé par le serveur, avec une latence perçue optimisée.
- Chaque arme possède son propre son de confirmation de touche ou une signature sonore adaptée ; ne pas réutiliser un son générique identique pour tout l'arsenal.
- Débloquer, à partir de seuils de maîtrise de l'arme, des variantes cosmétiques de sons de confirmation de touche. Le son de base doit rester excellent dès le départ ; aucun son ne doit fournir une information compétitive supplémentaire, modifier la détection ou avantager le joueur.
- Laisser le joueur choisir parmi les sons qu'il a débloqués, avec aperçu, réglage de volume dédié, option de désactivation et retour au son par défaut. Les variantes ne doivent pas dégrader la lisibilité des autres sons.
- Tester chaque arme en tir isolé, rafale, tracking continu, impacts multiples, tirs ratés, headshots, élimination, combat rapproché et combat chargé. Évaluer qualité, fatigue auditive, mixage, cohérence et lisibilité avec casque et haut-parleurs.
- Prévoir accessibilité : réglages de volume, indicateurs visuels équivalents et absence d'information exclusivement sonore indispensable.

### Arsenal maîtrisé et playlists Chaos
- Dans les modes classiques et compétitifs standards, sélectionner un arsenal contrôlé et équilibré. Éviter les armes « cancer »/dominantes qui rendent les duels frustrants ou suppriment les possibilités de contre-jeu.
- Conserver les armes explosives ou atypiques (par exemple lance-roquettes/RPG) dans des playlists dédiées où leur présence est attendue, plutôt que de les supprimer définitivement du jeu.
- Créer deux playlists distinctes : **Chaos** (non classée) et **Chaos classé** (classée), avec accès à l'arsenal complet, y compris les armes explosives et les équipements les plus extrêmes.
- Définir pour Chaos classé des règles propres, une rotation/validation de l'arsenal, des limites éventuelles de munitions/fréquence ou des contre-mesures si nécessaires ; « arsenal complet » ne signifie pas abandon de la stabilité, de l'anti-triche ou de la qualité compétitive.
- Afficher clairement avant de rejoindre qu'il s'agit d'une playlist Chaos et que les armes atypiques/explosives y sont autorisées. Ne pas mélanger silencieusement ces règles aux modes classiques.
- Mesurer les taux d'utilisation, éliminations, efficacité, frustration signalée, taux de victoire et possibilités de contre-jeu. Corriger les excès par équilibrage documenté, sans supprimer arbitrairement le style Chaos.

### Interface lobby et paramètres
- Adopter une interface lobby originale de RIXE, avec une hiérarchie visuelle simple, des coins arrondis cohérents avec l'identité déjà décidée (kit UI arrondi, rayons indicatifs 8–16 px), des libellés explicites et des interactions rapides.
- Prioriser : mode/playlist sélectionné, état du lobby, joueurs présents/places restantes, compte à rebours, groupe/amis, connexion/latence et action principale. Les informations secondaires doivent rester secondaires.
- Les paramètres doivent être regroupés par catégories compréhensibles, avec recherche si le nombre d'options le justifie, descriptions courtes, valeurs visibles, aperçu immédiat lorsque possible et bouton de réinitialisation.
- Ne pas copier l'écran de Warzone, Apex Legends ou THE FINALS. Étudier leurs principes d'organisation et tester des prototypes RIXE auprès de joueurs. Choisir la solution sur des mesures de compréhension, nombre d'actions, temps pour lancer/rejoindre une partie, erreurs et accessibilité.
- Éviter les animations longues, les panneaux surchargés, les menus imbriqués inutilement et les éléments décoratifs qui masquent l'information utile. Préserver une navigation rapide à la manette, au clavier/souris et sur navigateur.

Tous ces éléments sont des exigences approuvées mais restent planifiés tant qu'ils ne sont pas implémentés et validés par des tests réels. Respecter le budget de 0 €, les licences et les priorités de stabilité/livraison.

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
Ne pas développer tous les systèmes sociaux simultanément. Respecter les priorités générales du cahier des charges :
1. Audit licence, sauvegarde et état réel du projet ; corriger les blocages.
2. Obtenir une build réellement jouable et testable.
3. Stabiliser gameplay, hit registration, réseau, autorité serveur, bots et cartes de lancement.
4. Mettre en place le parcours officiel complet : identité/session, matchmaking, lobby public BO2, lancement automatique, continuité entre parties, backfill et reconnexion.
5. Ajouter les fonctions sociales essentielles : amis, groupes, invitations, présence et modération.
6. Ajouter le navigateur de serveurs communautaires comme option secondaire.
7. Ajouter clans, événements/tournois, outils communautaires, cartes communautaires et variantes contrôlées.
8. Étendre progressivement la synchronisation multiplateforme et les clients compatibles.
À chaque étape : tests réels, critères d'acceptation, sauvegarde, rapport de branche/commit et build ou lien de test vérifié lorsque possible. Une fonction planifiée n'est jamais présentée comme livrée sans preuve.


## 28. Améliorations de l'expérience multijoueur — cinq ajouts approuvés le 19 novembre 2026

Ces cinq fonctionnalités sont approuvées pour RIXE. Elles complètent les systèmes existants sans les dupliquer. Elles restent planifiées tant qu'elles n'ont pas été développées, testées et validées.

### 28.1 Préférence de matchmaking pour les joueurs humains
- Proposer une préférence claire permettant de privilégier les parties composées de joueurs humains.
- Prévoir au minimum les choix « Humains prioritaires » et « Bots autorisés pour réduire l'attente ». Étudier une option « Humains uniquement » lorsque la population, le mode et la région permettent de trouver une partie dans un délai raisonnable.
- Ne jamais présenter un bot comme un joueur humain : signaler clairement les bots dans le lobby et le tableau de partie.
- Distinguer strictement statistiques, progression, récompenses et résultats des joueurs humains et des bots.
- Les bots ne doivent pas être injectés silencieusement pour donner l'impression artificielle qu'une partie est peuplée.
- Expliquer lorsqu'une préférence empêche de trouver rapidement une partie et permettre au joueur de modifier son choix.
- Appliquer des limites et règles propres aux modes classés ; ne pas introduire de bots dans un match classé officiel sauf décision explicite, transparente et validée séparément.

### 28.2 Chat vocal de proximité facultatif
- Ajouter, dans les modes compatibles, un chat vocal de proximité dont le volume varie selon la distance et, si techniquement pertinent, l'occlusion.
- Le chat de proximité est facultatif et peut être désactivé globalement ou par mode.
- Séparer clairement vocal de proximité, vocal d'équipe et communications de groupe.
- Prévoir mute individuel immédiat, signalement, blocage et contrôles de confidentialité.
- Ne pas enregistrer le vocal par défaut. Minimiser les données traitées et expliquer les règles de conservation.
- Définir les modes où cette fonction est autorisée ; la désactiver dans les modes où elle compromet la compétition, la confidentialité ou la lisibilité.
- Tester latence, qualité, sécurité, abus, charge réseau et accessibilité avant activation publique.

### 28.3 Entraînement pendant la recherche de partie
- Permettre au joueur d'utiliser un stand de tir ou un espace d'entraînement pendant que le matchmaking recherche une partie, lorsque l'architecture réseau et les ressources le permettent.
- Permettre de tester les armes, accessoires, déplacements, cibles mobiles et équipements disponibles.
- Afficher clairement l'état de recherche et avertir le joueur lorsqu'une partie est trouvée.
- Prévoir un transfert vers la partie avec un chargement fiable et un délai raisonnable ; ne pas faire perdre au joueur une place confirmée à cause d'une transition défaillante.
- L'entraînement est isolé du match : aucun dégât, score, défi, statistique, replay officiel ou progression compétitive ne doit être attribué.
- Aucune information sur les équipes adverses, la carte en cours ou les positions de la partie recherchée ne doit être divulguée.
- Si l'entraînement simultané n'est pas techniquement viable ou dépasse le budget/performance, proposer une version légère ou différer la fonction plutôt que fragiliser le matchmaking.

### 28.4 Préférences de matchmaking par périphérique
- Permettre de définir une préférence de mise en relation selon le périphérique de contrôle : clavier/souris, manette ou parties mixtes.
- Ne pas empêcher les amis utilisant des périphériques différents de jouer ensemble ; prévoir des règles explicites pour les groupes mixtes.
- Le joueur doit savoir dans quel type de matchmaking il entre et pouvoir modifier sa préférence.
- Évaluer l'équité à partir de données de performance suffisamment représentatives, sans présumer qu'un périphérique est toujours supérieur.
- Équilibrer et tester séparément l'assistance à la visée, la sensibilité, les entrées et les performances des plateformes.
- Ne pas fragmenter excessivement la population ni augmenter démesurément les temps d'attente : prévoir des règles d'élargissement transparentes et configurables.
- Le périphérique détecté et les règles de groupe doivent être vérifiés autant que possible côté serveur, sans collecte intrusive.

### 28.5 Remplaçants volontaires pour les parties en cours
- Étudier un système permettant à des joueurs volontaires de rejoindre une partie officielle déjà commencée lorsqu'une place est libre.
- Le joueur doit pouvoir activer/désactiver sa disponibilité comme remplaçant et connaître le mode, la durée approximative restante et les conditions de la partie avant d'accepter.
- Prioriser les remplacements qui rétablissent l'équilibre des équipes, sans permettre de rejoindre uniquement les parties presque gagnées ou d'exploiter les informations de match.
- Ne pas interrompre un joueur déjà engagé dans une autre partie.
- Le remplaçant commence avec un état de jeu cohérent et équitable (équipement, ressources, position et protection d'apparition selon le mode).
- Ses statistiques, récompenses et contribution sont enregistrées uniquement à partir de son arrivée ; elles ne sont jamais fusionnées avec celles du joueur parti.
- Les départs, remplacements, bots temporaires et retours de joueurs déconnectés doivent suivre une règle cohérente avec la reconnexion et le backfill existants.
- Protéger le système contre le boosting, les arrangements entre joueurs, les changements volontaires d'équipe et les abus de matchmaking.
- En classé, n'activer cette fonction qu'après définition et validation de règles strictes ; sinon la désactiver.

### 28.6 Ordre de réalisation et critères communs
- Priorité initiale : préférences humains/bots et entraînement pendant la recherche, après stabilisation du matchmaking et de la boucle de jeu.
- Chat vocal de proximité, préférences de périphérique et remplaçants volontaires sont des chantiers ultérieurs, à prototyper et mesurer avant généralisation.
- Chaque fonction doit disposer de critères d'acceptation, tests réseau et sécurité, vérification de l'impact sur les temps d'attente et possibilité de désactivation.
- Respecter le budget de 0 €, la confidentialité, l'autorité serveur, l'accessibilité et la séparation entre statistiques officielles et activités d'entraînement.

## 29. Huit fonctionnalités communautaires et compétitives approuvées

Les huit propositions suivantes sont approuvées par le propriétaire. Elles complètent les systèmes existants ; lorsqu'un sujet recoupe une section antérieure, enrichir cette section plutôt que créer un système concurrent. Elles sont planifiées et ne sont pas réputées implémentées avant validation par des tests.

### 29.1 Annulation et réparation des parties compromises
- Mettre en place une procédure contrôlée pour invalider les résultats d'une partie lorsqu'une triche est confirmée après enquête ou qu'une défaillance serveur majeure a rendu le match manifestement invalide.
- Définir des critères vérifiables et différents selon la cause : triche confirmée, corruption des résultats, panne serveur, déconnexion massive ou incident réseau.
- Restaurer les points/rangs injustement perdus et retirer les gains indûment obtenus uniquement lorsque les preuves et règles publiées le justifient.
- Informer les joueurs concernés de la décision, de son motif et de ses conséquences ; conserver une procédure de contestation et un journal d'audit minimisant les données personnelles.
- Ne jamais annuler une partie ou sanctionner un joueur sur une simple suspicion, un signalement isolé ou une anomalie réseau non corroborée. Prévoir une validation humaine pour les cas ambigus.

### 29.2 Matchmaking tenant compte des groupes préformés
- Enrichir le matchmaking officiel pour identifier la taille et la cohésion des groupes préformés et éviter autant que possible d'opposer un joueur seul à une équipe entièrement constituée d'amis.
- Étudier des préférences de file « solo » et « groupes acceptés », sans garantir une séparation absolue si la population ou le temps d'attente ne le permet pas.
- Préserver les groupes et amis qui souhaitent jouer ensemble ; ne pas les séparer silencieusement pour équilibrer une partie.
- Arbitrer explicitement entre équité, qualité de connexion, temps d'attente, niveau estimé et disponibilité des joueurs. Expliquer les compromis lorsque la préférence ne peut pas être respectée.
- Mesurer les écarts de victoire et de niveau entre groupes et joueurs solos, avec des échantillons suffisants et sans pénaliser automatiquement les groupes.

### 29.3 Entraînement entièrement hors ligne
- Ajouter un mode d'entraînement local utilisable sans connexion Internet, contre des bots, lorsque la plateforme le permet.
- Permettre de choisir les bots, leur difficulté, les équipes, les cartes et les règles compatibles ; proposer des cibles mobiles et des exercices de tracking, recul, précision, déplacement et lancer de grenades.
- Autoriser l'essai des armes et accessoires disponibles localement, sans dépendance à un service en ligne.
- Garder progression, statistiques et résultats strictement locaux et séparés du profil officiel, du matchmaking et des classements ; ne jamais convertir les résultats hors ligne en récompenses officielles.
- Signaler clairement les fonctions indisponibles hors ligne et prévoir une sauvegarde locale robuste.

### 29.4 Temps morts tactiques et abandon encadré
- Étudier des temps morts limités par équipe dans les modes compétitifs compatibles, notamment classés et parties personnalisées ; ne pas les imposer à tous les modes publics.
- Synchroniser le temps mort côté serveur, afficher clairement sa durée et ses conditions, et empêcher les abus de pause répétée ou déclenchée à un moment injuste.
- Prévoir un vote d'abandon uniquement sous conditions définies (par exemple joueur manquant ou situation durablement compromise), avec seuil de votes, délai et protections contre la manipulation.
- Définir les conséquences de l'abandon, les pertes éventuelles de rang et les cas d'exception avant activation en classé.
- Tester l'impact sur le rythme, l'équité, les déconnexions et les possibilités de griefing. Garder la fonction désactivable par mode.

### 29.5 Armurerie transparente et laboratoire d'armes accessible aux joueurs
- Étendre le laboratoire interne d'équilibrage déjà prévu en une version accessible aux joueurs, sans dupliquer les outils de développement.
- Permettre d'essayer librement armes et accessoires dans un stand de tir, de comparer les armes et de consulter leurs valeurs réellement utilisées en jeu : dégâts selon distance, cadence, recul, temps de rechargement, dispersion et autres paramètres pertinents.
- Distinguer clairement les valeurs exactes, les valeurs contextuelles et les éventuelles approximations d'affichage ; les données présentées doivent correspondre à la version de jeu active.
- Afficher les effets réels d'un accessoire sur les statistiques et le comportement, sans descriptions trompeuses.
- Actualiser les informations lors des mises à jour et conserver un historique des changements d'équilibrage pertinent pour les joueurs.

### 29.6 Équilibrage des deux équipes avant le lancement
- Ajouter au matchmaking un équilibrage explicite des deux équipes avant chaque match, en complément de la sélection des joueurs et du niveau estimé déjà prévus.
- Prendre en compte niveau estimé avec son incertitude, performances récentes, expérience du mode, rôles/contributions utiles et cohésion des groupes.
- Éviter autant que possible de séparer les amis ou de déplacer un joueur après le début de la partie ; annoncer clairement toute répartition avant lancement.
- Privilégier l'équité sans sacrifier excessivement la qualité de connexion ni allonger démesurément l'attente.
- Mesurer l'écart de niveau et les résultats des équipes, détecter les effets indésirables et permettre un retour arrière. Ne pas promettre une égalité parfaite ni utiliser un score opaque comme unique critère.

### 29.7 Environnement public de test communautaire
- Prévoir une playlist ou un environnement de test facultatif permettant aux volontaires d'essayer en avance des changements officiels : armes, cartes, modes, recul, apparitions, règles réseau et équilibrage.
- Identifier sans ambiguïté la version expérimentale et ses risques ; ne pas mélanger ses résultats avec les statistiques, rangs ou récompenses officiels.
- Recueillir des retours structurés et facultatifs, ainsi que des données de télémétrie strictement nécessaires, anonymisées ou agrégées autant que possible.
- Comparer les résultats aux objectifs de test et aux retours ; publier, modifier ou retirer une expérimentation seulement après analyse.
- Séparer clairement environnement de test, serveurs communautaires et matchmaking officiel. Ne pas exiger de téléchargement ou de participation au test pour jouer au jeu normal.

### 29.8 Transparence sur le ping des groupes et les régions
- Avant le lancement d'une recherche en groupe, afficher une estimation récente de la latence de chaque membre vers les régions candidates, ainsi que les éventuelles incertitudes.
- Avertir lorsque les membres du groupe sont géographiquement/réseau très éloignés ou qu'une région commune risque de produire une connexion médiocre.
- Proposer les régions compatibles et un choix explicite entre meilleure qualité de connexion et temps d'attente plus court, selon les options réellement disponibles.
- Ne pas exposer d'adresse IP, de localisation précise ni de données réseau sensibles aux autres joueurs ; n'afficher que des indicateurs de latence et de région suffisamment généraux.
- Ne jamais garantir un ping futur à partir d'une simple estimation. Mesurer la qualité réelle après connexion et expliquer les limites de l'hébergement par un joueur.

### Priorités et règles communes
- Intégrer 29.2, 29.6 et 29.8 au système de matchmaking existant ; ne pas créer plusieurs moteurs de matchmaking.
- Intégrer 29.5 au stand de tir et au laboratoire d'équilibrage existants ; proposer une interface joueur distincte et sûre, alimentée par les données de la version active.
- Prioriser 29.1 (intégrité des résultats) et les fondations de 29.2/29.6/29.8 après stabilisation du socle réseau et du matchmaking officiel.
- Réaliser 29.3 comme mode local indépendant après validation de la boucle gameplay et des bots.
- Ajouter 29.4 et 29.7 plus tard, après stabilisation du classé, de la modération et des processus de mise à jour.
- Respecter le budget autorisé de 0 € : aucune infrastructure, service, outil ou dépense nouvelle sans accord explicite. Privilégier les solutions locales et gratuites dans leurs limites réelles.
- Toute fonction reste planifiée jusqu'à ce qu'elle soit implémentée, testée sur une build et documentée avec ses limites.

## 30. Préréglages graphiques, diagnostic et optimisation — six ajouts approuvés le 19 novembre 2026

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
- Permettre de personnaliser individuellement les réglages après le choix d'un préréglage, d'afficher les valeurs actives et de restaurer le préréglage.
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

### Critères communs et ordre de réalisation
- Commencer par les préréglages et leur validation sur plusieurs configurations, puis le benchmark reproductible.
- Prototyper ensuite le mode faible latence et la précompilation/cache, en mesurant les gains réels.
- Intégrer les réglages de confort avec le système d'accessibilité existant.
- Ajouter diagnostic et profils par carte après fiabilisation de la collecte locale des mesures.
- Tester les six préréglages sur GPU modestes et puissants, plusieurs résolutions et les chemins de rendu pris en charge.
- Ne pas retarder la première build jouable pour ces fonctions ; priorité à la stabilité et au socle gameplay.
- Respecter le budget de 0 € et ne pas ajouter de dépendance ou service payant sans accord explicite.

## 31. Internationalisation et retours communautaires — deux ajouts approuvés le 19 novembre 2026

Ces deux fonctionnalités sont approuvées. Elles complètent les systèmes de communauté, d'accessibilité, de statistiques et de modération déjà décrits. Elles restent planifiées jusqu'à leur implémentation et validation.

### 31.1 Internationalisation et localisation complètes
- Concevoir RIXE pour être utilisable dans plusieurs langues, avec une architecture de localisation centralisée plutôt que des textes intégrés directement dans les Blueprints ou widgets.
- Traduire les menus, paramètres, tutoriels, notifications, objectifs, descriptions d'armes/accessoires, aides contextuelles, messages d'erreur et textes d'accessibilité.
- Prévoir une langue de secours clairement définie lorsqu'une traduction est absente ; ne jamais afficher une clé technique ou un texte vide au joueur.
- Permettre de choisir la langue de l'interface indépendamment, lorsque possible, de la langue des voix et des sous-titres.
- Prévoir sous-titres configurables et identification claire des informations audio importantes, sans donner aux sous-titres une information tactique indisponible aux autres joueurs.
- Gérer correctement caractères accentués, alphabets non latins, polices, sens d'écriture droite-à-gauche lorsque nécessaire, formats de nombres/dates et expansion du texte dans les interfaces.
- Éviter que les traductions longues coupent les boutons, menus, notifications ou éléments HUD ; tester chaque langue sur différentes résolutions et échelles d'interface.
- Autoriser des contributions de traduction communautaires dans un processus distinct de la version publiée : proposition, révision, validation, attribution facultative et historique des changements.
- Ne jamais publier automatiquement une traduction communautaire non vérifiée ; prévoir signalement et correction des traductions incorrectes, offensantes ou trompeuses.
- Ne pas fragmenter le matchmaking selon la langue de l'interface. Une préférence de langue pour le chat ou la communication peut être proposée si la population le permet, sans empêcher les groupes d'amis de jouer ensemble.
- Garder les termes de gameplay, noms d'armes, zones et commandes cohérents dans toutes les langues ; maintenir un glossaire de référence.
- Commencer par les langues réellement traduites et testées ; ne pas annoncer une langue comme disponible si sa couverture est incomplète.
- La localisation ne doit pas changer les règles, les statistiques, les valeurs d'armes ou les informations de gameplay.

### 31.2 Retours communautaires structurés sur la qualité et l'équilibrage
- Permettre aux joueurs de transmettre des retours contextualisés sur les cartes, armes, modes, apparitions, performances, réseau, lisibilité et expérience générale.
- Proposer des catégories et des formulaires courts, avec possibilité d'ajouter une description facultative ; éviter de demander des données personnelles inutiles.
- Permettre, lorsque le joueur le souhaite, de joindre des éléments utiles comme la carte, le mode, la version du jeu, l'arme concernée et un identifiant technique de partie non sensible.
- Distinguer clairement un avis subjectif, un problème technique reproductible et un signalement de comportement abusif ; les signalements de joueurs suivent les procédures de modération dédiées et ne deviennent pas des votes d'équilibrage.
- Regrouper et analyser les retours avec les données agrégées du jeu : taux d'utilisation, efficacité, résultats, distances d'engagement, taux de victoire, incidents réseau et contexte de mode.
- Détecter les campagnes de votes coordonnées, le spam, les doublons et les tentatives de manipulation ; ne pas laisser le volume brut de votes décider seul d'un changement.
- Ne jamais modifier automatiquement les armes, cartes, apparitions ou règles à partir des retours. Toute modification doit passer par une analyse, un prototype ou environnement de test, une validation et une possibilité de retour arrière.
- Donner de la visibilité sur l'état des retours : reçu, à l'étude, reproduit, corrigé, rejeté ou planifié, lorsque cela peut être communiqué sans divulguer d'informations sensibles.
- Publier périodiquement des synthèses anonymisées des problèmes étudiés et des décisions prises, y compris lorsqu'une proposition n'est pas retenue.
- Prévoir des limites anti-spam, des outils de modération, une politique de conservation limitée et une explication claire des données éventuellement collectées.
- Respecter le budget de 0 € : privilégier les outils internes et services gratuits dans leurs limites réelles, sans dépendance payante imposée.

### Priorités et critères communs
- Mettre en place d'abord l'architecture de localisation et le glossaire, puis traduire et tester les langues retenues par étapes.
- Développer les retours structurés après stabilisation du profil, des statistiques, de la modération et des mécanismes de test communautaire.
- Les deux systèmes doivent fonctionner sur les plateformes effectivement prises en charge, avec une interface adaptée au navigateur si ce client est développé.
- Toute contribution, traduction ou donnée communautaire doit être modérée, protégée contre les abus et soumise aux licences applicables.
- Ne pas retarder la première build jouable ; commencer par les fondations techniques nécessaires et livrer progressivement.


## 32. Maîtrise des armes, calibration des commandes et défis communautaires — trois ajouts approuvés le 19 novembre 2026

Ces ajouts complètent les systèmes d'armurerie, de personnalisation, de progression, de sons d'armes et d'événements communautaires déjà prévus. Ils doivent être intégrés aux systèmes existants, sans créer de progression ou de menus redondants. Ils restent planifiés jusqu'à leur implémentation et validation.

### 32.1 Maîtrise individuelle des armes — système fusionné
- Créer un seul système cohérent de maîtrise propre à chaque arme, qui regroupe la progression de maîtrise déjà évoquée pour les armes et les déblocages cosmétiques/sonores associés. Ne pas créer deux systèmes parallèles.
- Faire progresser la maîtrise par l'utilisation réelle et variée de l'arme en partie : éliminations confirmées, assists pertinentes, précision, maîtrise du recul, objectifs ou autres contributions vérifiables selon l'arme. Ne pas récompenser uniquement le farming d'éliminations.
- Proposer des niveaux de maîtrise, défis progressifs, insignes et éléments de présentation qui montrent l'expérience acquise avec chaque arme.
- Débloquer uniquement des récompenses non compétitives : camouflages, apparences, emblèmes, éléments de profil et variantes purement cosmétiques des sons de tir ou de confirmation d'impact déjà prévus à la section 26.
- Conserver un son de base de grande qualité pour chaque arme dès le départ. Les variantes déblocables ne doivent jamais être plus audibles, plus précises, plus rapides ou transmettre une information supplémentaire ; elles doivent conserver une durée, une lisibilité et un niveau sonore comparables.
- N'accorder aucun bonus de dégâts, cadence, recul, précision, portée, vitesse de rechargement, assistance à la visée ou autre avantage de gameplay via la maîtrise.
- Calculer et valider la progression à partir d'événements de partie fiables côté serveur lorsque le mode le permet. Définir des plafonds, conditions et protections contre le farming entre amis, bots, comptes secondaires ou actions répétées artificiellement.
- Séparer clairement les résultats des modes officiels, communautaires, expérimentaux et hors ligne. Les règles de conversion de progression doivent être transparentes ; ne pas convertir automatiquement les résultats hors ligne en progression officielle.
- Afficher les défis, la progression et les récompenses de manière claire dans l'armurerie, sans multiplier les menus. Prévoir une consultation des critères et un historique des déblocages.
- Garder toutes les récompenses accessibles gratuitement par le jeu ; aucun achat ne doit accélérer la maîtrise ni donner un avantage compétitif.

### 32.2 Calibration avancée et personnalisation des commandes
- Compléter le remappage des touches déjà prévu par des réglages précis et cohérents pour clavier/souris, manette et commandes tactiles si cette plateforme est développée.
- Pour les sticks, proposer notamment zones mortes intérieure/extérieure lorsque pertinent, courbes de réponse, accélération/décélération et sensibilité horizontale/verticale.
- Pour la souris, proposer sensibilité, sensibilité en visée, éventuel multiplicateur par lunette si le jeu utilise plusieurs niveaux de zoom, et options de lissage/désactivation du lissage clairement expliquées.
- Permettre de régler séparément sensibilité générale, visée, caméra et commandes de déplacement lorsque cela a un sens, sans introduire de réglages contradictoires.
- Fournir un aperçu immédiat, des valeurs par défaut recommandées, des préréglages, une restauration individuelle ou globale et une vérification des conflits de touches.
- Ajouter des exercices dans le stand de tir pour comparer les réglages : suivi de cibles mobiles, changements de cible, contrôle du recul et rotations. Ne pas imposer un réglage considéré comme universellement optimal.
- Enregistrer les paramètres par périphérique et, si possible, par plateforme/compte, avec synchronisation contrôlée et résolution explicite des conflits entre appareils.
- Ne pas confondre calibration des commandes et assistance à la visée. Aucun réglage ne doit fournir une information cachée, modifier les hitboxes ou contourner les règles d'équité du cross-play.
- Tester les valeurs sur les périphériques réellement pris en charge et proposer un comportement de secours si une option n'est pas compatible.

### 32.3 Défis communautaires collectifs
- Ajouter des objectifs mondiaux facultatifs auxquels l'ensemble de la communauté peut contribuer : nombre d'objectifs capturés, soutien apporté, parties terminées, défis coopératifs ou autres actions positives vérifiables.
- Organiser les défis par périodes clairement annoncées, avec objectifs, durée, progression collective et conditions de réussite visibles en jeu.
- Prévoir des paliers intermédiaires afin que les joueurs voient l'effet de leur contribution même si l'objectif final n'est pas atteint.
- Récompenser la participation par des éléments gratuits et non compétitifs : emblèmes, titres, éléments de profil ou cosmétiques. Aucun bonus de statistiques, d'expérience compétitive, d'arme ou d'accès prioritaire ne doit être accordé.
- Éviter que les défis encouragent le sabotage, le farming, l'abandon de partie, les éliminations répétées entre complices ou la concentration excessive sur une action au détriment de l'objectif du match.
- Définir des critères d'éligibilité simples et transparents, des plafonds de contribution et des contrôles anti-bots/anti-collusion ; seules les actions réellement validées doivent compter.
- Ne pas désavantager les nouveaux joueurs, les joueurs occasionnels ou les régions à faible population. Adapter les objectifs à la population réelle et permettre une contribution raisonnable sans obligation de connexion quotidienne.
- Publier les résultats et récompenses de manière transparente, conserver un historique des événements et expliquer les règles de calcul.
- Ne pas exiger d'achat, de paiement, de connexion à une heure précise ou de partage de données personnelles pour participer.
- Utiliser les outils communautaires et de progression existants ; ne pas créer un service payant ni retarder la première build jouable.

### Priorités et critères communs
- Intégrer 32.1 à l'armurerie, au système de sons d'armes de la section 26 et à la progression existante ; un seul système de maîtrise par arme.
- Ajouter 32.2 aux paramètres de commandes et au stand de tir, puis tester chaque périphérique réellement supporté.
- Développer 32.3 après stabilisation des comptes, de la progression, des statistiques et de l'anti-triche.
- Toute progression et toute récompense doivent respecter l'équité, la confidentialité, les règles anti-farming et le budget de 0 €.
- Ne pas retarder la première build jouable pour ces fonctionnalités ; les livrer progressivement après validation du socle gameplay et réseau.


## 33. Destruction tactique, lancer de grenades, audio spatial et approfondissement du combat — sept ajouts approuvés le 19 novembre 2026

Les sept idées suivantes sont approuvées et ajoutées au cahier des charges. Elles restent planifiées tant qu'elles ne sont pas implémentées, testées et validées sur une build réelle. Elles ne doivent pas retarder la première build jouable ni compromettre l'équilibre compétitif, la lisibilité ou les performances.

### 33.1 Destruction tactique limitée des décors
- Autoriser la destruction de certains éléments de couverture clairement identifiés : panneaux, cloisons légères, barricades, portes ou ouvertures prévues par le level design.
- Limiter strictement la destruction à des éléments sélectionnés et testés ; aucune destruction libre ou totale de la carte.
- Concevoir chaque élément destructible avec une fonction tactique et des contreparties : créer une ouverture peut améliorer une ligne de tir mais aussi exposer le joueur.
- Garantir que les destructions ne condamnent pas une équipe, ne rendent pas un objectif inaccessible et ne créent pas de position dominante impossible à contrer.
- Synchroniser l'état, la collision et les dégâts de ces éléments sous autorité serveur. Tous les clients et bots doivent observer le même état.
- Prévoir des états visuels/collision simples et déterministes, une réplication limitée et des budgets CPU, GPU, mémoire et réseau.
- Commencer par un prototype sur une seule carte et un petit nombre d'éléments ; désactiver la mécanique dans les modes où elle nuit à l'équité.
- Distinguer cette destruction provoquée par les joueurs des événements environnementaux prédéfinis de la section 3.

### 33.2 Lancer de grenades à puissance variable
- Permettre plusieurs intensités de lancer selon la durée d'appui ou une commande clairement indiquée : lancer court, moyen et puissant.
- Étudier un lancer au sol/roulé pour faire passer une grenade sous certains obstacles ou dans un espace bas, uniquement lorsque la géométrie et les règles du mode le permettent.
- Assurer des trajectoires, rebonds, vitesses, fuseaux et dégâts cohérents, reproductibles et validés côté serveur.
- Afficher une indication discrète et lisible de la puissance choisie ; éviter une interface qui masque les adversaires ou l'action.
- Prévoir des limites pour empêcher les lancers impossibles, les traversées de géométrie et les abus de physique.
- Conserver des commandes accessibles et configurables sur les périphériques pris en charge ; proposer une méthode alternative si l'appui prolongé n'est pas adapté.
- Tester les distances, rebonds, dégâts et contre-mesures sur chaque carte ; ne pas rendre les grenades indispensables ni excessivement dominantes.

### 33.3 Audio spatial intelligent
- Améliorer la spatialisation des tirs, pas, rechargements, explosions et autres sons utiles selon la distance, la direction, les obstacles, les portes, les étages et les matériaux.
- Appliquer une occlusion et une atténuation cohérentes lorsqu'un mur, une porte ou un obstacle sépare la source du joueur ; éviter qu'un son traverse artificiellement plusieurs surfaces.
- Différencier les matériaux et les espaces lorsque cela apporte une information sonore naturelle et compréhensible.
- Gérer le masquage sonore : explosions et tirs proches peuvent temporairement rendre certains sons moins perceptibles, sans supprimer arbitrairement les indices essentiels.
- Ne jamais amplifier artificiellement un son pour révéler une position qui ne devrait pas être audible, ni donner à un joueur une information cachée.
- Garantir des résultats cohérents entre joueurs, limiter les variations liées au matériel et proposer des réglages d'accessibilité/volume compatibles avec les options audio existantes.
- Tester au casque, sur haut-parleurs et avec différents réglages ; préserver la lisibilité des sons de gameplay sans rendre le mixage fatigant.

### 33.4 Rechargement naturel et cohérent
- Définir précisément les phases de rechargement : début, retrait/éjection, insertion, remise en état de tir et fin de l'animation.
- Pour les armes compatibles, permettre l'interruption à des moments cohérents par un tir, un sprint ou une autre action prioritaire, sans autoriser de duplication de munitions ni de rechargement instantané.
- Distinguer le rechargement tactique (conserver les cartouches restantes lorsque le type d'arme le permet) du rechargement complet après chargeur vide.
- Déterminer côté serveur le moment exact où les munitions sont consommées ou réattribuées ; l'animation client ne doit jamais faire autorité sur les munitions.
- Adapter les règles aux mécanismes réels de chaque famille d'armes, sans imposer une animation ou une logique identique à tout l'arsenal.
- Garder les interruptions prévisibles et équitables en réseau, y compris avec latence, prédiction et correction ; éviter les états où l'arme semble prête mais ne peut pas tirer.
- Tester les transitions, annulations, changements d'arme, morts, déconnexions et corrections réseau.

### 33.5 Impacts environnementaux persistants et temporaires
- Afficher des traces de balles, éclats, impacts et marques sur les surfaces ; permettre à certains vitrages de se fissurer ou de se briser lorsque cela est prévu par la carte.
- Définir une durée de persistance et des limites de quantité par zone, joueur et partie ; supprimer proprement les traces les plus anciennes lorsque les budgets sont atteints.
- Distinguer les effets purement visuels des éléments qui modifient réellement la géométrie ou la collision. Toute modification fonctionnelle doit être prévue au level design et validée/synchronisée par le serveur.
- Ne jamais permettre aux impacts ou aux vitrages de créer une information tactique supplémentaire, une obstruction injuste ou un avantage graphique réservé à une configuration.
- Répliquer uniquement les événements nécessaires ; privilégier des effets locaux déterministes lorsque l'état partagé n'a pas d'incidence sur le gameplay.
- Préserver les performances sur les configurations modestes grâce à des budgets GPU, CPU, mémoire et réseau, des niveaux de détail et une désactivation contrôlée des effets secondaires.
- Vérifier que les effets ne masquent pas les silhouettes, projectiles, objectifs ou indices visuels importants.

### 33.6 Dégâts par zone corporelle
- Étudier des multiplicateurs de dégâts distincts pour les zones corporelles pertinentes (tête, torse, bras et jambes), définis arme par arme et mode par mode si nécessaire.
- Garder des règles simples, documentées et testables ; ne pas multiplier les zones au point de rendre les combats opaques ou imprévisibles.
- Faire dépendre les dégâts de la zone réellement touchée, déterminée et validée par le serveur à partir des traces de tir et des hitboxes autorisées.
- Éviter qu'une zone difficile à atteindre ou une différence de modèle/animation donne un avantage involontaire ; vérifier les hitboxes sur toutes les silhouettes et animations.
- Afficher des retours de hit clairs et cohérents sans révéler d'informations cachées ni permettre au client de décider de ses propres dégâts.
- Mesurer le temps pour éliminer, la fréquence des tirs à la tête, la répartition des zones touchées et l'écart entre armes ; équilibrer pour préserver la viabilité des différentes armes et périphériques.
- Ne pas rendre les bras ou jambes artificiellement punitifs ; toute différence doit avoir une justification de gameplay et être expliquée dans le laboratoire d'armes.
- Tester les impacts sur clavier/souris, manette et autres périphériques pris en charge, ainsi que sur les modes classiques et les playlists Chaos.

### 33.7 Configurations alternatives prédéfinies des cartes
- Préparer, si les tests le justifient, deux ou trois configurations prédéfinies pour certaines cartes : ouvertures différentes, couvertures déplacées, accès alternatifs ou obstacles activés/désactivés.
- Choisir la configuration entre les parties, jamais de manière imprévisible au milieu d'un duel ; annoncer clairement la variante avant le lancement.
- Conserver les mêmes principes d'équilibrage : itinéraires de contre-attaque, distances courte/moyenne/longue, accès aux objectifs et possibilités de rotation.
- Empêcher qu'une variante transforme une zone en position de camping dominante ou supprime une voie de réponse à une équipe.
- Synchroniser le choix de configuration et tous les éléments concernés (géométrie, collision, navigation des bots, points d'apparition, objectifs et réplication) avant le début de la manche.
- Identifier clairement la variante dans le lobby, les informations de carte, les replays et les statistiques afin de comparer des configurations équivalentes.
- Garder un nombre maximal de trois cartes au lancement ; les variantes servent à diversifier les cartes existantes, pas à augmenter artificiellement le nombre de cartes.
- Ne publier une variante dans les playlists officielles qu'après tests de navigation, de performance, de spawn et d'équilibre sur les deux équipes.

### Priorités et critères communs
- Ne pas développer les sept systèmes simultanément. Priorité à la fiabilité du tir, des dégâts, du rechargement et de la réplication avant les effets visuels avancés.
- Prototyper d'abord 33.4 et 33.6 dans un environnement de test, puis 33.2 et 33.3 ; évaluer 33.1 et 33.7 sur une carte pilote avant toute extension.
- Ajouter 33.5 progressivement avec des budgets stricts et une option de réduction des effets secondaires.
- Toute fonctionnalité affectant la collision, les dégâts, les munitions, la géométrie ou les règles doit être autoritaire côté serveur et couverte par des tests de non-régression.
- Ne pas modifier les règles d'un mode sans l'indiquer ; certaines fonctionnalités peuvent être limitées à des modes si les tests montrent un risque pour l'équilibre.
- Conserver la priorité de livraison : audit/licences/sécurité, build jouable, stabilité combat et réseau, puis extensions.
- Respecter le budget de 0 € ; aucun plugin, asset, outil, hébergement ou service payant sans accord explicite.


## 34. Sélection compétitive et circulation sans blocage entre alliés — deux décisions approuvées le 19 novembre 2026

Cette section formalise le veto compétitif approuvé et la règle de circulation entre coéquipiers précisée par le propriétaire. Ces systèmes restent planifiés jusqu'à leur implémentation et validation en jeu.

### 34.1 Veto des cartes et équipements en compétitif
- Prévoir une phase de sélection/bannissement pour les playlists compétitives organisées qui l'activent.
- Permettre aux équipes de bannir alternativement des cartes parmi une sélection annoncée avant la procédure.
- Autoriser, uniquement dans les formats qui le prévoient, le bannissement de certaines armes ou catégories d'équipements ; publier à l'avance la liste éligible et les restrictions.
- Définir un ordre alterné, des délais raisonnables, une résolution automatique en cas d'absence de choix et une présentation identique pour les deux équipes.
- Afficher la sélection, les choix déjà effectués, les options restantes et la carte/les règles finales avant le lancement.
- Éviter les choix impossibles : conserver un nombre suffisant de cartes et d'équipements disponibles et prévoir une solution de secours déterministe.
- Ne pas imposer cette procédure au matchmaking public classique ; elle doit être réservée aux playlists compétitives, parties privées ou formats organisés compatibles.
- Enregistrer le résultat du veto dans les données de partie et les replays afin que les statistiques comparent des configurations équivalentes.
- Tester les abandons, déconnexions, égalités, délais expirés et désaccords de version ; ne pas permettre de modifier la sélection après le début de la partie.

### 34.2 Circulation entre alliés : non-collision de gameplay façon XDefiant, The Finals et Call of Duty
- Viser le ressenti pratique observé dans XDefiant, The Finals et Call of Duty : les coéquipiers ne doivent pas se bloquer physiquement et doivent pouvoir se croiser naturellement, y compris dans les portes, couloirs, escaliers et zones d'objectif. Il s'agit de reproduire le résultat de gameplay attendu, pas de copier une implémentation propriétaire.
- Désactiver les collisions de déplacement bloquantes entre capsules alliées. La collision allié-allié ne doit jamais arrêter, ralentir, repousser, dévier ou immobiliser le mouvement d'un joueur.
- Ne pas utiliser de séparation physique, de répulsion ou de correction de position qui recrée indirectement du body-block. Aucun mur invisible, aucune file d'attente forcée et aucune téléportation pour dégager un passage.
- Accepter une superposition visuelle temporaire entre alliés si nécessaire à la fluidité. Tout éventuel ajustement visuel doit rester strictement cosmétique : il ne doit modifier ni la position de gameplay, ni la trajectoire, ni la vitesse, ni la visée, ni les collisions.
- Les alliés peuvent se traverser sans friction ni blocage. Dans les modes officiels standards, les tirs, projectiles, explosions et effets alliés ne doivent pas blesser ou tuer les coéquipiers ; aucune exception par défaut.
- Les ennemis conservent les collisions et interactions normales prévues par le mode : un joueur ne traverse pas un adversaire et ne bénéficie d'aucune protection supplémentaire contre ses tirs.
- Assurer un comportement identique côté serveur et client : règles de collision explicites, autorité serveur sur les interactions, prédiction client sans blocage local et corrections réseau discrètes. Vérifier que les capsules, traces d'armes, projectiles et interactions avec le décor ne réintroduisent pas de blocage indirect.
- Tester les croisements simultanés à plusieurs joueurs, portes étroites, couloirs, escaliers, objectifs, apparitions, sauts, sprint, glissades éventuelles et connexions à latence élevée.
- Critères d'acceptation : aucun allié ne peut empêcher physiquement un autre allié d'avancer ; aucune répulsion forcée ni déviation de gameplay ; les ennemis et le décor restent correctement bloquants ; tirs amis désactivés dans les modes standards.
- Commencer par un prototype multijoueur dans une carte de test, puis vérifier les cas limites avant généralisation à toutes les cartes et tous les modes.
### Priorités et critères communs
- Prototyper la circulation alliée avec plusieurs personnages dans des couloirs étroits avant de l'étendre à toutes les cartes.
- Vérifier que le système ne crée ni body block, ni superposition exacte, ni déplacement forcé, ni avantage défensif artificiel.
- Développer le veto après stabilisation des playlists compétitives, du système de groupes et de la sélection de cartes.
- Conserver le matchmaking public simple et rapide ; ne pas retarder la première build jouable.
- Respecter le budget de 0 € et ne pas ajouter de dépendance payante sans accord explicite.

## 35. Améliorations supplémentaires du rythme et de la qualité des parties

### 35.1 Protection anti-spawn-trap et réévaluation des apparitions
- Détecter les situations où un joueur ou une équipe est éliminé à répétition très peu de temps après sa réapparition, en particulier lorsque plusieurs adversaires contrôlent les sorties ou les lignes de vue.
- Exploiter les données déjà prévues par le système d'apparitions intelligentes : proximité des ennemis, lignes de vue, pression autour des points, morts récentes, sécurité des sorties et historique des apparitions.
- Réévaluer immédiatement les points disponibles et choisir automatiquement une zone plus sûre lorsqu'une apparition devient manifestement piégée.
- Ne pas rendre les joueurs invulnérables de façon abusive, ne pas téléporter un joueur après son apparition et ne pas révéler les positions ennemies.
- Prévoir des protections contre les abus : un joueur ne doit pas pouvoir provoquer artificiellement un changement de spawn pour exploiter le système.
- Mesurer les éliminations dans les premières secondes après apparition, les répétitions par zone, les apparitions annulées et les déséquilibres créés ; tester sur chaque carte et chaque mode concerné.
- Cette fonction complète le système d'apparitions intelligentes déjà prévu ; elle ne doit pas créer un second système indépendant.

### 35.2 Revanche immédiate et continuité des équipes
- À la fin d'une partie publique compatible, proposer automatiquement une continuité entre les deux équipes afin qu'elles puissent enchaîner sur une revanche sans devoir reformer un groupe ou relancer une recherche complète.
- Conserver autant que possible les équipes et les joueurs qui souhaitent rester, dans l'esprit des lobbies persistants des anciens FPS.
- Permettre une rotation vers une autre carte ou un autre mode selon la playlist, tout en gardant l'option d'une revanche sur la même carte lorsque les règles le permettent.
- Afficher clairement qui reste, qui quitte et qui rejoint ; remplacer les départs par le backfill prévu, sans bloquer indéfiniment le lancement.
- Respecter les choix de départ, les groupes préformés, les préférences de matchmaking et les règles de population. Ne jamais retenir un joueur contre son gré.
- Éviter que la continuité ne fige le matchmaking : si les équipes deviennent trop déséquilibrées ou si la qualité réseau se dégrade, appliquer les règles transparentes de rééquilibrage déjà prévues.
- Garder cette continuité facultative et compatible avec les playlists ; ne pas imposer la conservation des équipes en classé si les règles compétitives l'interdisent.

### 35.3 Protection contre les connexions instables
- Surveiller, lorsque les données sont disponibles, le ping, le jitter, les pertes de paquets, les variations brutales de latence et les désynchronisations pour chaque joueur.
- Distinguer la latence réseau de la latence locale d'entrée/rendu et des ralentissements CPU/GPU ; ne pas présenter le FPS comme une mesure du ping.
- Afficher des indicateurs compréhensibles et des avertissements utiles au joueur, sans exposer son adresse IP ni sa localisation précise.
- Utiliser la qualité de connexion comme un facteur explicable du matchmaking et du choix de région, avec un compromis transparent entre attente, niveau et stabilité.
- Détecter les dégradations temporaires pour éviter les décisions injustes fondées sur une seule mesure ; utiliser des fenêtres de mesure et des seuils validés par les tests.
- Ne jamais modifier artificiellement les dégâts, les hitboxes, la cadence, le recul ou les règles de combat pour compenser une mauvaise connexion.
- Compléter les outils de diagnostic réseau et de désynchronisation déjà prévus ; ne pas créer de systèmes redondants.
- Tester les scénarios de pertes de paquets, jitter, pics de ping, reconnexion et hôte instable. Documenter les limites du listen server et ne pas présenter ces protections comme un remplacement d'une architecture serveur compétitive.
- Respecter le budget de 0 € : aucun service payant ni hébergement supplémentaire sans accord explicite.


## 36. Informations de combat, continuité des groupes et progression personnelle — quatre décisions approuvées le 19 novembre 2026

### 36.1 Récapitulatif détaillé après une élimination
- Après la mort du joueur, présenter un récapitulatif clair de l'élimination : adversaire responsable lorsque connu, arme utilisée, chronologie des impacts, dégâts reçus, répartition par zone corporelle si cette fonction est activée et distance estimée lorsque la mesure est fiable.
- Distinguer les dégâts directs, dégâts de zone et éventuels dégâts déjà reçus d'autres adversaires ; ne pas attribuer à tort toute l'élimination à un seul joueur.
- Afficher uniquement les données de combat réellement enregistrées et validées par le serveur ; signaler les valeurs estimées ou indisponibles plutôt que d'inventer une précision.
- Permettre de fermer ou passer rapidement le récapitulatif pour ne pas ralentir la réapparition.
- Ne pas révéler à un joueur ou à son équipe des positions ennemies qui ne seraient pas normalement connues ; ne pas transformer l'écran de mort en outil de repérage.
- Garder une présentation lisible, concise et cohérente avec les règles de chaque mode.

### 36.2 Transfert automatique du chef de groupe
- Si le chef d'un groupe quitte, se déconnecte durablement ou perd sa session, transférer automatiquement le rôle à un membre éligible encore présent.
- Choisir le successeur selon une règle stable et annoncée, par exemple ancienneté dans le groupe ou disponibilité de session ; éviter une élection confuse à chaque micro-coupure.
- Conserver les membres, invitations, paramètres de groupe et recherche de partie autant que possible ; notifier clairement le changement de chef.
- Si le chef revient, ne pas lui reprendre automatiquement le rôle : le groupe doit rester stable, avec possibilité de transfert volontaire.
- Gérer les cas où le groupe est en file d'attente, dans un lobby, en partie ou en transition ; ne pas confondre ce transfert de responsabilité sociale avec la migration de l'hôte réseau de la partie, déjà spécifiée séparément.
- Prévoir une protection contre les transferts en boucle, les comptes inactifs et les sessions expirées.

### 36.3 Caméra de mort courte
- Dans les modes compatibles, proposer une séquence courte et passable montrant les derniers instants ayant conduit à l'élimination, reconstruite à partir des événements de partie et des données de simulation disponibles.
- Utiliser une reconstruction cohérente avec le serveur ; afficher clairement toute limite ou approximation liée à la reconstruction et à la latence.
- Ne jamais transmettre cette vue aux coéquipiers encore vivants et ne jamais révéler au joueur des informations cachées qu'il pourrait exploiter pour communiquer pendant la partie.
- Permettre de passer la séquence immédiatement et désactiver la fonction dans les modes où elle nuit au rythme ou à l'équité.
- Ne pas enregistrer de vidéo complète en continu : réutiliser les événements nécessaires au système de replay déjà prévu, avec durée de conservation et confidentialité cohérentes.
- Prévoir des protections contre les abus, notamment l'utilisation de la caméra pour identifier des positions, des stratégies ou des joueurs hors du champ de connaissance légitime.

### 36.4 Comparaison des performances avec son propre historique
- À la fin d'une partie, comparer les performances du joueur à ses propres références récentes : éliminations, morts, assists, précision, contribution aux objectifs, soutien et performances par arme, uniquement lorsque les données sont suffisamment fiables.
- Présenter les tendances sur plusieurs parties plutôt que tirer des conclusions d'un seul match ; distinguer les changements de mode, carte, arme et durée de partie.
- Mettre en avant des axes de progression concrets sans imposer de comparaison publique, de classement humiliant ou de pression artificielle.
- Permettre de consulter et filtrer son historique, avec des options de confidentialité et de suppression/export lorsque l'architecture du compte le permet.
- Ne pas modifier le matchmaking, le niveau caché ou l'équilibrage sur la seule base de ces indicateurs personnels.
- Séparer les statistiques officielles validées par le serveur des données locales d'entraînement hors ligne.

### Priorités et critères communs
- Développer d'abord le récapitulatif après élimination et le transfert du chef de groupe, une fois les données serveur et les sessions de groupe stabilisées.
- Ajouter ensuite la caméra de mort courte seulement si la reconstruction est fiable, rapide et sans fuite d'information ; réutiliser l'architecture de replay plutôt que créer un enregistreur parallèle.
- Ajouter la comparaison personnelle après validation de la qualité des statistiques et de l'historique.
- Toutes ces fonctions restent subordonnées à la build jouable, à la stabilité réseau, à la sécurité et au budget de 0 €. Aucun service payant sans accord explicite.


## 37. Signature de gameplay personnelle — décision approuvée le 19 novembre 2026

### 37.1 Identité de jeu évolutive
- Construire pour chaque joueur une signature de gameplay descriptive, calculée à partir de ses performances réelles sur plusieurs parties : tendances offensives/défensives, soutien, jeu d'objectif, polyvalence, distances d'engagement et préférences d'armes.
- Présenter cette signature comme un portrait évolutif et nuancé, et non comme une classe, un rôle imposé, un niveau caché ou une étiquette définitive.
- Déduire les tendances à partir d'un volume suffisant de parties comparables ; afficher un indicateur de fiabilité ou attendre avant de conclure lorsque les données sont insuffisantes.
- Distinguer les habitudes par mode, carte et contexte afin de ne pas qualifier un joueur sur la base d'une seule partie ou d'un mode particulier.
- Autoriser le joueur à consulter son profil, son évolution et les facteurs ayant contribué à chaque tendance ; permettre de masquer ou de limiter le partage public de cette signature.
- Ne pas attribuer de bonus, malus, compétences, armes, matchmaking ou restrictions selon cette signature. Elle ne doit pas pénaliser les joueurs polyvalents, les changements de style ou les parties jouées avec des amis.
- Utiliser des statistiques validées par le serveur pour les parties officielles ; séparer les données d'entraînement hors ligne et les parties communautaires si leurs règles diffèrent.
- Protéger les données personnelles : ne pas inférer de traits sensibles, ne pas exposer de données individuelles non nécessaires et respecter les paramètres de confidentialité du compte.
- Prévoir une présentation compréhensible, traduisible et accessible, avec des catégories explicables plutôt qu'un score opaque unique.

### Priorités et critères de validation
- Commencer par un prototype descriptif basé sur les statistiques déjà prévues, sans créer une nouvelle infrastructure de télémétrie coûteuse.
- Vérifier que les résultats sont stables sur plusieurs parties, explicables, non manipulables facilement et ne favorisent pas artificiellement un style de jeu.
- Ne pas retarder la build jouable, la stabilité réseau, la sécurité ou les fonctionnalités essentielles ; budget de 0 €, aucun service payant sans accord explicite.

## 38. Rivalités, intégrité vérifiable et laboratoire communautaire — trois décisions approuvées le 19 novembre 2026

### 38.1 Rivalités personnelles
- Proposer, lorsque les joueurs se sont affrontés à plusieurs reprises, un historique facultatif de leurs confrontations : nombre de rencontres, victoires/défaites, éliminations, assists et autres statistiques pertinentes disponibles.
- Présenter les résultats avec leur contexte (mode, période, nombre de rencontres) et éviter les conclusions définitives à partir d'un échantillon trop faible.
- Ne pas créer de classement public humiliant, de notification provocatrice ou de mécanisme encourageant le harcèlement ; ne pas exposer les données privées d'un joueur.
- Permettre à chaque joueur de désactiver l'affichage de ses rivalités ou de limiter leur visibilité ; respecter blocage, confidentialité et modération déjà prévus.
- Ne donner aucun bonus, malus, priorité de matchmaking ou information tactique selon l'existence d'une rivalité.
- Calculer les statistiques à partir des résultats officiels validés ; séparer les parties hors ligne, entraînements et expériences communautaires si leurs règles diffèrent.
- Garder cette fonction légère et facultative, sans ralentir le lobby, la recherche de partie ou l'accès aux statistiques principales.

### 38.2 Rapport d'intégrité après chaque partie
- Fournir, lorsque les données techniques le permettent, un rapport synthétique après la partie indiquant les contrôles d'intégrité effectivement exécutés, les incidents techniques détectés et le statut du résultat (validé, en attente d'examen, invalidé ou indisponible).
- Distinguer clairement les contrôles réalisés des contrôles impossibles ou non disponibles ; ne jamais afficher une certification absolue ni garantir qu'aucune triche n'a eu lieu.
- Résumer les événements pertinents sans révéler les méthodes sensibles de détection, les seuils internes, les données personnelles ou les informations qui faciliteraient le contournement de l'anti-triche.
- Séparer une anomalie réseau ou un incident technique d'une suspicion de triche ; une suspicion seule ne doit pas entraîner automatiquement une sanction grave ni l'invalidation définitive d'un résultat.
- Permettre un examen complémentaire, une contestation et une correction/annulation du résultat selon les procédures et preuves déjà prévues.
- Conserver une traçabilité proportionnée et sécurisée des décisions, avec accès limité, durée de conservation définie et respect de la confidentialité.
- En cas de panne ou d'indisponibilité des contrôles, afficher explicitement que le statut ne peut pas être certifié ; ne pas présenter une absence de données comme une preuve d'intégrité.
- Réutiliser les mécanismes serveur, anti-triche, diagnostic réseau et réparation des parties déjà spécifiés, sans créer de systèmes redondants.

### 38.3 Laboratoire communautaire de règles expérimentales
- Créer un espace facultatif où les joueurs peuvent tester des variantes de règles avant toute éventuelle adoption officielle : durée, score, rythme de réapparition, paramètres d'armes autorisés ou autres réglages validés par l'équipe.
- Identifier clairement chaque expérience comme expérimentale, avec sa version, ses règles, sa période de test et les changements par rapport au mode de référence.
- Isoler les statistiques, récompenses et classements expérimentaux des statistiques, récompenses et classements officiels ; aucune progression compétitive officielle ne doit être accordée sur la base de règles expérimentales non validées.
- Recueillir des retours contextualisés et des données agrégées ; protéger le laboratoire contre le spam, la manipulation des votes, le farming et les groupes cherchant à fausser les résultats.
- Ne jamais modifier automatiquement les modes officiels en fonction du nombre de votes ou de la popularité d'une variante : toute adoption doit passer par une analyse, des tests d'équilibrage, une validation technique et une annonce des changements.
- Permettre de retirer, corriger ou réinitialiser une expérience défectueuse ; afficher les limites et incidents connus.
- Réutiliser les outils de retours communautaires, de test et de validation déjà prévus, sans multiplier les infrastructures ni dépendre d'un service payant.
- Garder ce laboratoire séparé du matchmaking officiel et ne pas le rendre obligatoire pour accéder au jeu.

### Priorités et critères communs
- Commencer par un prototype simple du rapport d'intégrité, uniquement après stabilisation des validations serveur et des données de partie.
- Ajouter les rivalités personnelles ensuite, à partir des statistiques déjà disponibles et avec les contrôles de confidentialité.
- Ouvrir le laboratoire communautaire lorsque les modes officiels, les statistiques et les outils de modération sont suffisamment stables.
- Ces trois fonctions ne doivent jamais retarder la première build jouable, la correction du secret exposé dans le dépôt, l'audit des licences, la stabilité réseau ou les fonctionnalités essentielles.
- Respecter le budget de 0 € : aucun service payant, hébergement supplémentaire ou abonnement sans accord explicite.

## 39. Choix du matchmaking, protection des débutants et recommandations entre joueurs — trois décisions approuvées le 19 novembre 2026

### 39.1 Préférence de matchmaking compréhensible et transparente
- Ajouter un choix simple dans les préférences de recherche de partie, avec trois profils clairement nommés :
  - **Ouvert** : privilégier la qualité de connexion et le temps d'attente ; l'équilibrage du niveau est moins strict, sans être abandonné au point de créer volontairement des parties injouables.
  - **Équilibré** : rechercher un compromis entre qualité de connexion, niveau estimé, composition des équipes et temps d'attente.
  - **Compétitif** : privilégier un équilibrage de niveau plus exigeant et une qualité de connexion suffisante, uniquement dans les playlists compatibles.
- Présenter ces choix avec des libellés courts, une phrase d'explication chacun et une indication claire de leurs effets. Éviter les termes techniques opaques, les curseurs complexes et les réglages cachés.
- Afficher le profil actuellement sélectionné avant de lancer la recherche et permettre de le modifier en quelques secondes, sans parcourir plusieurs menus.
- Expliquer simplement qu'un profil peut augmenter le temps d'attente ou réduire le nombre de parties disponibles ; ne jamais promettre un niveau d'adversaires, un ping ou un résultat précis.
- Respecter réellement la préférence choisie : ne pas annoncer un profil puis appliquer silencieusement un autre. Si une adaptation exceptionnelle est nécessaire pour éviter une attente excessive ou une file vide, demander l'accord du joueur ou afficher clairement la proposition avant de l'appliquer.
- Ne pas mélanger les règles du matchmaking classé et non classé ; le profil Ouvert ne doit pas contourner les conditions d'intégrité, de sécurité ou d'éligibilité d'une playlist.
- Préserver les groupes préformés et les règles de périphériques déjà prévues ; ne pas séparer les amis pour satisfaire artificiellement un profil.
- Mesurer la population disponible avant d'activer ces préférences afin d'éviter une fragmentation excessive des files. Si une préférence n'est pas viable dans une région ou à une heure donnée, expliquer clairement pourquoi et proposer une alternative sans l'imposer.
- Fournir une explication accessible des principaux facteurs de recherche, sans révéler les seuils internes sensibles de l'anti-triche ni les détails exploitables du système.
- Tester les trois profils avec des populations faibles et fortes, groupes mixtes, régions différentes, joueurs débutants et joueurs expérimentés. Vérifier que le choix produit une différence réelle et compréhensible.
- Cette préférence complète les paramètres de matchmaking déjà prévus ; elle ne crée pas trois files rigides permanentes si la population ne le permet pas.

### 39.2 Protection temporaire et progressive des nouveaux joueurs
- Proposer aux nouveaux comptes une phase de découverte facultative et limitée, destinée à leur permettre d'apprendre les bases sans être immédiatement confrontés de façon répétée à des adversaires beaucoup plus expérimentés.
- Pendant cette phase, privilégier des parties avec des joueurs ayant une expérience comparable, lorsque la population et la qualité de connexion le permettent.
- Utiliser les bots déjà prévus comme solution d'entraînement ou de remplissage clairement signalée ; ne jamais faire passer un bot pour un joueur humain.
- Faire évoluer progressivement la protection selon plusieurs indicateurs fiables (parties jouées, expérience réelle et incertitude de l'estimation), et non selon un simple nombre de kills ou une seule bonne partie.
- Autoriser le joueur à quitter la phase de découverte et à rejoindre les parties publiques normales ; expliquer simplement les conséquences de ce choix.
- Éviter qu'un joueur expérimenté puisse exploiter cette protection en créant de nouveaux comptes ou en jouant volontairement avec des débutants : surveiller les comportements manifestes d'abus avec prudence, sans sanction automatique sur simple suspicion.
- Ne pas enfermer les nouveaux joueurs dans une file peu peuplée, ne pas rallonger excessivement leur attente et ne pas leur imposer des adversaires artificiellement faciles.
- Ne pas accorder de progression, récompense ou statistique officielle artificielle ; les résultats restent soumis aux règles normales du mode et à la validation serveur.
- Ne pas modifier les dégâts, la précision, les hitboxes, le recul, la santé ou les règles de combat pour favoriser un débutant.
- Expliquer la protection dans le tutoriel et les paramètres avec un texte court ; ne pas afficher publiquement qu'un joueur est débutant.
- Évaluer cette fonction sur la rétention, la qualité des premières parties, l'attente et les écarts de niveau ; désactiver ou ajuster le système si les résultats sont injustes ou manipulables.

### 39.3 Recommandations positives entre joueurs
- À la fin d'une partie, permettre de remercier ou recommander facultativement un joueur pour un comportement observé : esprit d'équipe, soutien, défense d'objectif, communication utile ou fair-play.
- Proposer une interface très rapide, avec quelques catégories prédéfinies et un seul geste de validation ; ne pas imposer de texte libre ni ralentir le retour au lobby.
- Distinguer cette recommandation donnée par un joueur des distinctions automatiques de fin de partie déjà prévues dans le projet.
- Limiter le nombre de recommandations par joueur et par partie ; empêcher les envois répétés, échanges organisés, groupes de farming et manipulations de réputation.
- Ne donner aucun bonus d'expérience, monnaie, progression, avantage de matchmaking, rang ou récompense matérielle en échange des recommandations.
- Ne pas créer de note négative publique, de bouton de dénonciation parallèle ou de classement de popularité ; les signalements d'abus restent dans le système de modération séparé.
- Présenter éventuellement sur le profil des tendances agrégées et anonymisées, uniquement avec un volume suffisant, sans exposer qui a recommandé qui ni transformer ces indications en jugement définitif.
- Permettre de désactiver l'affichage ou la réception de ces recommandations et respecter les paramètres de confidentialité, blocages et règles de modération.
- Ne pas pénaliser les joueurs silencieux, solitaires, débutants ou utilisant les options d'accessibilité ; aucune recommandation ne doit être requise pour progresser.
- Tester la résistance au spam, aux échanges entre amis, aux comptes multiples et aux comportements de harcèlement avant activation publique.

### Priorités et critères communs
- Concevoir d'abord une interface de préférence matchmaking extrêmement simple, puis tester que chaque profil modifie réellement les priorités annoncées sans fragmenter les files.
- Déployer la protection des débutants uniquement après stabilisation des données de niveau, du matchmaking et du remplissage transparent par bots.
- Ajouter les recommandations positives en dernier, après validation des outils de modération, de confidentialité et d'anti-abus.
- Ces fonctions ne doivent pas retarder la première build jouable, les corrections réseau, l'audit de licence ou la sécurisation du dépôt.
- Respecter le budget de 0 € : aucun service payant, hébergement supplémentaire ou abonnement sans accord explicite.

## 40. Fin de partie équilibrée, partage de configurations et meilleurs moments — trois décisions approuvées le 19 novembre 2026

### 40.1 Proposition de fin anticipée dans les parties irrécupérables
- Dans les modes compatibles, détecter les situations de déséquilibre extrême à partir de critères propres au mode : écart de score, temps restant, objectifs, dynamique de partie et probabilité raisonnable de retour.
- Lorsque les critères validés sont réunis, proposer une fin anticipée selon une procédure claire et rapide, par exemple un vote d'équipe ou une règle de mode annoncée à l'avance.
- Ne jamais mettre fin à une partie sur le seul fondement d'un écart de score ponctuel ; préserver les possibilités de retournement et les objectifs secondaires encore accessibles.
- Définir des seuils testés pour chaque mode, avec une période minimale avant qu'une proposition puisse apparaître, afin d'éviter les abus en début de partie.
- Empêcher les manipulations par abandon coordonné, vote répété, comptes multiples ou joueurs qui cherchent à éviter une défaite ; prévoir des limites de fréquence et des règles de résultat explicites.
- En cas de vote, expliquer simplement les conséquences et appliquer une règle de majorité définie avant le match ; ne pas bloquer indéfiniment les joueurs qui souhaitent poursuivre.
- Définir séparément les conséquences statistiques et de progression : une fin anticipée ne doit pas être comptabilisée comme une victoire ou une défaite classique si les règles du mode ne le justifient pas.
- En classé, ne pas activer cette fonction avant d'avoir défini et testé une politique compétitive stricte, résistante aux collusions et aux abus ; elle peut rester désactivée.
- Ne jamais pénaliser automatiquement un joueur pour avoir voté contre une fin anticipée ou pour avoir continué à jouer.
- Tester avec des écarts de score variés, des retournements réels, des déconnexions et des groupes coordonnés. Désactiver la fonction dans tout mode où elle nuit à l'équité ou au rythme.

### 40.2 Codes de partage des configurations d'armes
- Permettre à un joueur de générer un code court pour partager une configuration d'arme complète avec ses accessoires, variantes et paramètres autorisés.
- Permettre à un autre joueur de saisir ou coller ce code pour prévisualiser la configuration, puis l'enregistrer dans un emplacement personnel après confirmation.
- Afficher clairement les accessoires manquants, non débloqués, incompatibles ou indisponibles dans la version actuelle ; ne jamais les équiper automatiquement ni contourner les conditions normales de progression.
- Vérifier le code côté jeu/serveur : format, version, arme, accessoires autorisés et limites de configuration. Rejeter les codes invalides ou manipulés.
- Prévoir une prévisualisation lisible de la configuration et de ses caractéristiques réelles, sans présenter une configuration communautaire comme officiellement recommandée ou objectivement supérieure.
- Autoriser le partage par code et, si les interfaces le permettent, par invitation entre amis ; ne pas exiger de compte tiers ni de service payant.
- Permettre de copier, supprimer et remplacer ses propres configurations sauvegardées ; limiter les emplacements selon une règle transparente et éviter la perte silencieuse d'une configuration existante.
- Préserver les règles d'équilibrage : un code ne débloque aucun accessoire, ne modifie aucune statistique et ne donne aucun avantage non autorisé.
- Gérer les mises à jour : si un accessoire ou une valeur change, signaler que la configuration a été modifiée ou qu'elle n'est plus reproductible à l'identique ; conserver la version de référence lorsque cela est utile.
- Compléter l'armurerie et le laboratoire d'armes déjà prévus sans dupliquer leur interface ni leur système de sauvegarde.

### 40.3 Génération facultative de meilleurs moments
- Réutiliser les événements et données de replay déjà prévus pour repérer des séquences potentiellement intéressantes : multikills, séries d'éliminations, défense décisive, action collective, retournement de situation ou autre événement défini par le mode.
- Proposer au joueur une sélection de moments après la partie, avec aperçu, possibilité de choisir le début et la fin, de renommer et de supprimer une séquence.
- Ne jamais enregistrer une vidéo complète en continu par défaut ; reconstruire les séquences à partir des données de replay disponibles, lorsque leur fidélité est suffisante.
- Afficher clairement les limites de reconstruction, les événements manquants et les approximations éventuelles ; ne pas présenter comme exact un mouvement ou une action qui ne peut pas être reproduit fidèlement.
- Permettre un export vidéo local facultatif lorsque la plateforme et les performances le permettent ; l'export ne doit pas nécessiter de serveur payant ni de stockage cloud obligatoire.
- Laisser le joueur choisir ce qu'il exporte et partage ; ne jamais publier automatiquement, envoyer à des tiers ou rendre public un replay privé.
- Respecter les paramètres de confidentialité, les demandes de blocage et les règles de modération ; éviter d'inclure des informations personnelles, messages privés ou voix enregistrées sans consentement.
- Ne pas exposer des positions ennemies ou informations cachées qui n'étaient pas légitimement accessibles au joueur pendant la partie ; appliquer les mêmes restrictions que le système de replay et la caméra de mort.
- Prévoir une génération légère et asynchrone après le match, avec annulation possible, limites de stockage local et nettoyage des fichiers temporaires.
- Ne pas ralentir la réapparition, le retour au lobby ou le lancement de la partie suivante ; la fonction doit rester entièrement facultative.
- Réutiliser les replays existants et éviter toute infrastructure vidéo ou cloud coûteuse.

### Priorités et critères communs
- Le partage de configurations peut être développé à partir de l'armurerie existante, après stabilisation des armes et de la sauvegarde des profils.
- Le système de meilleurs moments dépend de la fiabilité du replay et doit commencer par une sélection simple, sans montage complexe ni service cloud.
- La fin anticipée est la plus sensible pour l'équité : la tester longuement en parties publiques non classées avant d'envisager d'autres modes ; la désactiver si les abus ne peuvent pas être maîtrisés.
- Ces fonctions ne doivent jamais retarder la première build jouable, la sécurité du dépôt, l'audit des licences ou la stabilité réseau.
- Respecter le budget de 0 € : aucun service payant, hébergement supplémentaire ou abonnement sans accord explicite.

## 41. Rematch amical en duel — décision approuvée le 19 novembre 2026

### 41.1 Défi amical 1 contre 1 après une confrontation
- Après une partie ou une confrontation compatible, permettre à un joueur d'envoyer à un autre une invitation facultative à un duel amical 1 contre 1.
- Le destinataire doit accepter explicitement ; aucun lancement automatique, aucune invitation répétitive et aucun blocage de l'accès au lobby ou à la partie suivante en cas de refus.
- Prévoir un format simple et rapide : choix parmi les cartes et règles de duel autorisées, durée ou score cible prédéfini, puis lancement dès que les deux joueurs sont prêts.
- Utiliser un équipement identique ou un ensemble prédéfini pour les deux participants afin de limiter les écarts liés au déblocage d'accessoires ou à la progression.
- Autoriser des variantes de règles uniquement si elles sont clairement annoncées avant acceptation et restent équilibrées ; commencer par un format de référence commun.
- Isoler totalement les duels amicaux des statistiques officielles, du niveau compétitif, du matchmaking, des classements, des défis officiels et de la progression des armes.
- Afficher clairement le résultat comme amical/non officiel ; ne pas compter les éliminations, victoires ou défaites du duel dans les statistiques des modes standards.
- Prévoir les cas d'annulation, de déconnexion, de refus, de latence excessive et de départ d'un participant ; ne pas attribuer une victoire compétitive à la suite d'un abandon d'un duel amical.
- Respecter les blocages, préférences d'invitation, paramètres de confidentialité et outils de modération ; empêcher les invitations répétées après un refus.
- Ne pas révéler d'informations privées ni permettre d'utiliser le duel pour contourner les restrictions de groupe ou de matchmaking.
- Si l'infrastructure multijoueur ne permet pas encore d'assurer une session stable et équitable, différer la fonction plutôt que proposer un duel dégradé ou trompeur.

### Priorités et critères de validation
- Développer cette fonction après stabilisation des sessions, invitations, groupes et reconnexion.
- Commencer par une seule règle de duel, une carte adaptée et un équipement symétrique ; élargir seulement après tests.
- Tester l'équité réseau, la reconnexion, le refus, les invitations abusives, les groupes et les différences de périphériques.
- Ne pas retarder la première build jouable, la sécurité du dépôt, l'audit des licences ou la stabilité du multijoueur.
- Respecter le budget de 0 € : aucun service payant, hébergement supplémentaire ou abonnement sans accord explicite.

## 42. Progression durable, fiche de mode universelle et favoris de playlists — décisions approuvées le 19 novembre 2026

### 42.1 Progression durable sans FOMO
- Les récompenses prévues comme gratuites ne doivent pas devenir définitivement inaccessibles uniquement parce qu'un joueur a manqué une saison, une période ou un événement.
- Prévoir une archive ou un catalogue permettant de retrouver les anciens défis et de reprendre une progression interrompue, lorsque les conditions de licence et de disponibilité du contenu le permettent.
- Éviter les obligations de connexion quotidienne, les séries punitives, les échéances artificiellement urgentes et les mécaniques conçues pour faire culpabiliser le joueur.
- Les défis peuvent être organisés par périodes, mais leur contenu doit rester récupérable selon des règles transparentes ; aucune récompense de gameplay ne doit être verrouillée derrière une échéance.
- Aucun achat, abonnement ou paiement ne doit être nécessaire pour récupérer les récompenses annoncées comme gratuites.
- Protéger les objectifs contre le farming artificiel et valider côté serveur les progrès compétitifs ; conserver une progression locale distincte en hors ligne.
- Expliquer clairement les conditions, la durée éventuelle d'une période et les possibilités de reprise avant que le joueur ne s'engage.

### 42.2 Fiche de mode universelle — tous les joueurs et tous les modes
- Afficher une fiche d'information courte, simple, efficace et rapide pour tous les joueurs et dans absolument tous les modes, sans exception.
- Présenter uniquement les informations essentielles : nom du mode, objectif, règles particulières importantes et condition de victoire.
- Adapter automatiquement le contenu au mode sélectionné ; ne pas afficher de champs inutiles ni un long tutoriel.
- Rendre l'information immédiatement lisible dans la sélection du mode et, lorsque pertinent, accessible depuis le lobby ou le menu de pause.
- Utiliser des formulations courtes, des pictogrammes cohérents et une hiérarchie visuelle claire ; éviter les fenêtres intrusives et les confirmations supplémentaires.
- Les informations doivent refléter exactement les règles réellement actives pour la partie, y compris les variantes, limites d'équipement, réapparitions, bots ou tir ami lorsqu'ils diffèrent.
- Cette fiche est obligatoire dans tous les modes, y compris expérimentaux et communautaires ; si une règle est inconnue ou non applicable, ne pas inventer de valeur.

### 42.3 Favoris et préférences de playlists
- Permettre de marquer des modes ou playlists comme favoris et de sélectionner plusieurs playlists préférées pour la recherche de partie.
- Permettre d'exclure explicitement certaines playlists et de modifier ces préférences rapidement, sans parcours de menus complexe.
- Afficher une estimation honnête de l'effet possible des préférences sur l'attente, uniquement si des données suffisantes existent ; ne jamais promettre un délai ou une disponibilité.
- Respecter strictement les exclusions : ne jamais placer un joueur dans une playlist qu'il a explicitement désactivée.
- Ne pas fragmenter excessivement le matchmaking ; expliquer simplement quand un choix réduit fortement les possibilités de trouver une partie.
- Synchroniser les préférences sur le compte RIXE lorsque le compte et la sauvegarde sont disponibles ; conserver un comportement local cohérent en cas d'indisponibilité réseau.
- Ne pas modifier silencieusement les préférences du joueur.

### Priorités et critères de validation
- La fiche universelle de mode est une exigence de base de l'interface et doit être réalisée avec le menu de sélection/lobby, sans créer un écran lourd supplémentaire.
- Les favoris et préférences dépendent du système de playlists et de matchmaking ; les développer après stabilisation de ces systèmes.
- La progression durable dépend du catalogue de récompenses, des défis et de la sauvegarde ; commencer par une architecture simple et sans service payant.
- Tester lisibilité, navigation clavier/manette/tactile, localisation, changements de règles, exclusions de playlists, synchronisation et reprise des défis.
- Ces fonctionnalités ne doivent pas retarder la première build jouable ni la correction des risques critiques.
- Respecter le budget de 0 € : aucun service payant, hébergement supplémentaire ou abonnement sans accord explicite.
