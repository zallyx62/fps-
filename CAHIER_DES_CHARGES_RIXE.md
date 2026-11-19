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