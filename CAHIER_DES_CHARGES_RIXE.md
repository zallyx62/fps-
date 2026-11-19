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
