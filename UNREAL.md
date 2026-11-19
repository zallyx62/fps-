# RIXE sous Unreal Engine 5.8 — journal des modifications

Projet de base : modèle « First Person », variante « Arena Shooter » (Blueprint).

> **Portée de ce document :** journal de l'implémentation observée dans le prototype, et non cahier des charges fonctionnel. Les comportements décrits ici ne deviennent pas automatiquement des règles finales. En cas d'écart, suivre `CAHIER_DES_CHARGES_RIXE.md` et consigner l'écart comme tâche à corriger. Les tests mentionnés sont des tests historiques dans l'éditeur ; ils ne prouvent pas une validation sur build empaquetée ni sur Internet.

> **Convention sur les anciennes étapes :** les titres « Étape 1 : rendu, performances, interface » et « Étape 2 : armes, stand de tir, arsenal » sont des intitulés historiques de lots de travail du 18 novembre 2026. Ils ne correspondent pas aux phases 1 et 2 de la chronologie consolidée actuelle et ne constituent pas une preuve de franchissement. Se reporter à `SUIVI_PHASES_RIXE.md` pour les critères et preuves.

## Écarts de configuration détectés — à auditer, non validés

- `Config/DefaultEngine.ini` active actuellement `r.RayTracing=True`, avec DX12 comme RHI Windows par défaut. Le ray tracing ne doit pas être considéré comme un prérequis de jeu : mesurer son coût et vérifier son activation par profil avant de décider de le conserver par défaut.
- La configuration déclare D3D11/SM5 ainsi que des cibles Linux et Mac en SM6. Leur présence dans le fichier ne prouve ni la compilation ni le fonctionnement de ces plateformes ; Windows reste la cible initiale.
- **Nettoyage effectué le 19 novembre 2026** : les doublons stricts de `DefaultGraphicsRHI=DefaultGraphicsRHI_DX12` et de `r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange` ont été retirés de `Config/DefaultEngine.ini` sur les deux branches. Aucune valeur graphique différente n'a été arbitrée ; vérifier le comportement effectif dans Unreal avant toute autre modification.
- `fps.uproject` active `GameplayStateTree`, `ModelContextProtocol`, `MCPClientToolset` et `AllToolsets`, en plus de `ModelingToolsEditorMode` limité à l'éditeur. Vérifier les dépendances, licences, modules Editor/Runtime et le comportement lors du packaging Shipping ; ne pas retirer les outils MCP utilisés pour le développement sans vérifier leur portée.


## Fait dans l'éditeur

- **Projet** : nom « RIXE », carte de démarrage et carte du jeu = `Variant_Shooter/Lvl_ArenaShooter`,
  mode de jeu par défaut = `BP_ShooterGameMode`. Le serveur MCP démarre avec l'éditeur.
- **Direction artistique « crépuscule »** (`Content/Rixe/Materials`) :
  - `MI_Rixe_Wall`, `MI_Rixe_Floor` : béton sombre à grille fine pour murs et sols ;
  - `MI_Rixe_Red`, `MI_Rixe_Blue` : couleurs d'équipe, appliquées automatiquement selon le côté de l'arène ;
  - `MI_Rixe_Gold` : éléments métalliques de la zone centrale.
- **Éclairage** : soleil rasant (3900 K), lumières d'équipe rouges et bleues près des points d'apparition,
  lumière chaude au centre.
- **Post-traitement** : bloom, étalonnage (ombres froides, hautes lumières chaudes), vignette,
  grain léger, aberration chromatique légère, flou de mouvement réduit.
- **Règles de match** (`Content/Rixe/Blueprints/BP_RixeMatchRules`, placé dans l'arène) :
  la première équipe à `ScoreLimit` (20 par défaut, modifiable sur l'acteur) gagne,
  la victoire s'affiche puis la partie redémarre après 6 secondes.
- **Réglages enregistrés** (`Content/Rixe/Blueprints`) :
  - `BP_RixeGameInstance` (instance de jeu du projet) garde la sensibilité, le champ de vision,
    le volume général et l'inversion de l'axe vertical ; il les charge au démarrage et les enregistre
    dans l'emplacement de sauvegarde `RixeReglages` ;
  - `BP_RixeSaveSettings` est l'objet de sauvegarde correspondant ;
  - la fonction `Aim` de `BP_FirstPersonCharacter` applique la sensibilité, l'inversion et le champ de vision.
- **Menu Pause / Réglages** (`Content/Rixe/UI/WBP_RixeMenu`), ouvert et fermé avec **Échap** ou **M**
  (dans l'éditeur, Échap arrête la partie : utiliser M). La partie continue derrière le menu, comme dans
  un FPS en ligne ; le joueur ne peut plus bouger, viser ni tirer tant que le menu est ouvert.
  - Graphismes : qualité (Basse, Moyenne, Élevée, Épique), affichage (plein écran, fenêtre sans bordure,
    fenêtré), synchro verticale, limite d'images par seconde (60, 120, 144, sans limite), champ de vision (70 à 120).
  - Commandes : sensibilité de la visée (0,1 à 3), inversion de l'axe vertical.
  - Audio : volume général.
  - Afficher ou masquer le compteur d'images par seconde, quitter le jeu.
  - Les réglages graphiques sont enregistrés par Unreal (`GameUserSettings`), les autres par `BP_RixeGameInstance`.
  - Logique d'ouverture : fonctions `OpenRixeMenu` / `CloseRixeMenu` de `BP_ShooterPlayerController`.
- **Correctif du modèle** : `StateTreeTask_SenseEnemies` vérifie que le contrôleur de l'IA existe avant
  de s'abonner à la perception, ce qui supprime les erreurs « Accès à None » dans le journal.

## Multijoueur en ligne

Modèle réseau actuel : **serveur d'écoute** (un joueur héberge, les autres le rejoignent). Le prototype délègue déjà au serveur certains éléments documentés, notamment les dégâts des projectiles, les morts et le score provisoire de match. Cela ne démontre pas une autorité serveur complète : cadence de tir, munitions, déplacements, capacités, apparitions, RPC et résultats doivent encore être audités selon le cahier des charges. Les clients demandent des actions ; le serveur doit valider chaque action sensible avant de l'appliquer.

- **Héberger / Rejoindre** (menu M, section Multijoueur) :
  - champ « Pseudo » enregistré avec les autres réglages ;
  - « Héberger » relance l'arène en mode `listen` ;
  - « Rejoindre » ouvre l'adresse IP saisie (`open <ip>`), port UDP 7777.
    Pour jouer hors réseau local : ouvrir le port 7777 sur la box de l'hôte, ou utiliser un réseau
    virtuel (ZeroTier, Radmin VPN) et saisir l'adresse donnée par ce logiciel.
- **Actions des joueurs** : `ServerRixeAction(Action, Texte)` dans `BP_ShooterPlayerController`
  (RPC « exécuté sur le serveur », fiable) : 0 = arrêter de tirer, 1 = tirer, 2 = changer d'arme, 3 = message.
- **Variables répliquées** :
  - `BP_ShooterCharacter` : `bFiringRep`, `SwapCountRep`, `bDeadRep`, `Current HP` (avec notification),
    `Team Byte` ; les copies des autres joueurs tirent, changent d'arme et meurent grâce aux fonctions `OnRep_` ;
  - `BP_ShooterNPC` : `bShootingRep`, `AimTargetRep`, `bDeadRep` ;
  - `BP_RixeGameState` (nouveau) : `RedScore`, `BlueScore`, `WinningTeam`, `ChatLog`.
- **Autorité du serveur** : les bots ne sont créés que par le serveur (`BP_ShooterNPCSpawner`), les dégâts
  des projectiles ne s'appliquent que sur le serveur (`BP_ShooterProjectileBase`), la mort est décidée par le
  serveur puis répliquée.
- **Équipement de départ** : chaque joueur apparaît avec un pistolet et un fusil (`BeginPlay` de
  `BP_ShooterCharacter`), comme un chargement de classe ; les armes au sol restent ramassables.
- **Pseudos** : au lancement, le pseudo enregistré est appliqué (`setname`). Sans pseudo, le jeu attribue
  « JoueurNN » et le garde pour toute la session.
- **Animations** : les Anim Blueprints des armes (`ABP_FP_*`, `ABP_TP_*`) utilisent `GetBaseAimRotation`
  au lieu du contrôleur, qui n'existe pas pour les autres joueurs ; plus d'erreurs « Accès à None » et
  l'inclinaison de l'arme suit la visée des autres joueurs.

## Équipes joueurs contre joueurs

- **Répartition et apparition actuelles du prototype** : `ChoosePlayerStart` (`BP_ShooterGameMode`) place chaque joueur dans une équipe selon son
  ordre d'arrivée (1er Rouge, 2e Bleu, 3e Rouge…) puis le fait apparaître sur un point d'apparition de son
  camp (`PlayerStart` marqués `RED` / `BLUE`), aussi après chaque mort. Il s'agit d'une sélection statique par camp, pas encore du système adaptatif décidé dans la section 3 du cahier des charges (évaluation des menaces, lignes de vue, répétition des points et validation serveur au moment du respawn). Cette règle devra être remplacée et testée avant validation du système d'apparition final.
- **Bots — écart connu avec la cible produit** : l'implémentation documentée les utilise seulement en solo (entraînement contre l'équipe Bleue) et `OnPostLogin` les supprime dès qu'un deuxième joueur arrive. C'est un comportement actuel du prototype, **pas une règle finale**. Le cahier des charges, notamment sa section 28.1, prévoit des préférences explicites humains/bots, un remplissage transparent selon la playlist et des statistiques distinctes. Remplacer cette suppression automatique par les règles du mode concerné avant de considérer le matchmaking ou le remplissage des équipes comme terminé.
- **Pas de tir ami** : `RixeFriendly` (`BP_ShooterProjectileBase`) annule les dégâts entre deux joueurs de la
  même équipe (côté serveur).
- **Couleurs** : les joueurs et les bots sont teints en rouge ou en bleu (`ApplyTeamColor`, paramètre
  « Paint Tint » du mannequin), mis à jour chez tout le monde grâce à `OnRep_Team Byte`.
- **Interface** : « ÉQUIPE ROUGE » ou « ÉQUIPE BLEUE » sous le score, dans la couleur de l'équipe.

## Touches façon XDefiant

- **ZQSD** : `IMC_Default` accepte aussi Z (avancer) et Q (gauche) pour les claviers AZERTY, en plus de WASD.
- **Sprint** : maintenir Maj gauche passe la vitesse de 600 à 900 (`BP_ShooterCharacter`). Le serveur applique
  la même vitesse grâce à `ServerRixeAction` (actions 4 = sprint, 5 = marche), sinon il corrigerait la position.
- **Accroupi** : C bascule, Ctrl gauche maintenu ; `bCanCrouch` activé sur le `CharMoveComp` (300 accroupi).
- **Visée** : clic droit maintenu → champ de vision × 0,7 (variable `bRixeADS` lue par la fonction `Aim` de
  `BP_FirstPersonCharacter`, appelée à l'appui et au relâchement).
- **Armes** : 1 = fusil (principale), 2 = pistolet (secondaire), molette = alterner ; Maj ne change plus d'arme.
  Sur un clavier AZERTY, Unreal lit la touche « 1 » comme « & » et « 2 » comme « é » : les deux sont reliées.
- **Rechargement** : R envoie l'action 6 ; le serveur coupe le tir, attend 1,6 seconde, remplit le chargeur
  (`Current Bullets` = `Mag Size`) et met l'interface à jour. Pendant ce temps, l'ordre de tirer est refusé
  (`RixeReloading` dans `BP_ShooterPlayerController`). Le rechargement instantané du modèle, chargeur vide,
  reste en place.
- **Munitions chez le client** : le serveur tire à la place du client, donc le compteur de balles du client
  ne bougeait pas. `Current Bullets` (`BP_ShooterWeaponBase`) est maintenant répliqué ; `OnRep_Current Bullets`
  met à jour l'interface du joueur qui tient l'arme. Testé : 35 balles côté serveur et côté client après
  cinq tirs du client.

## Réglages (menu à onglets)

`WBP_RixeMenu` est organisé en onglets **Jouer / Arsenal / Graphismes / Commandes / Touches / Son**, au style
futuriste (fond sombre, liserés cyan). Le bouton de l'option active est surligné (`RefreshOptions`).

- **Touches réassignables** : réglages utilisateur d'Enhanced Input activés (`DefaultInput.ini`,
  `bEnableUserSettings`). Chaque touche clavier/souris a un nom (`MoveForward`, `Sprint`, `Aim`…) dans
  `IMC_Default`, `IMC_Weapons` et le nouvel `IMC_Rixe` (`Content/Rixe/Input`, actions `IA_Sprint`, `IA_Aim`,
  `IA_Reload`, `IA_Weapon1/2`, `IA_CrouchToggle/Hold`, `IA_Chat`, `IA_Voice`). Une ligne `WBP_RixeKeyRow` par
  action, avec deux cases `InputKeySelector` (principale / secondaire) ; le changement est appliqué tout de
  suite et enregistré (`SaveSettings` d'Enhanced Input). Bouton « Réinitialiser les touches ».
- **Sensibilité** : normale et en visée (multiplicateur, ajusté selon le zoom de l'arme), inversion de l'axe,
  mode de visée maintenir / basculer.
- **Sauvegarde** : `BP_RixeSaveSettings` (emplacement `RixeReglages`) garde sensibilités, champ de vision,
  volume, inversion, mode de visée, compteur FPS et pseudo ; les graphismes passent par `GameUserSettings`.

## Étape 1 : rendu, performances, interface

- **Rendu** : Lumen (éclairage global et reflets), Nanite, ombres virtuelles et TSR restent actifs par défaut.
  Le volume de post-traitement de l'arène verrouille l'exposition (min = max = -0,5 EV, plus de
  « pompage » de la luminosité), limite les fuites du ciel (`LumenSkylightLeaking` 0,1), éclaircit les
  ombres sans les rendre noires (exposition locale : ombres 0,75, hautes lumières 0,9) et pousse un peu le
  contraste (1,15) et la saturation (1,08 à 1,12).
- **Qualité** Basse / Moyenne / Haute / Ultra (`GameUserSettings`) ; en **Basse**, Lumen est coupé
  (`r.Lumen.DiffuseIndirect.Allow 0`, `r.Lumen.Reflections.Allow 0`) pour les petites cartes graphiques.
  Anticrénelage au choix **TSR / TAA / FXAA** (`r.AntiAliasingMethod` 4 / 2 / 1), limite d'images par seconde
  (60 / 120 / 144 / sans limite), synchro verticale, mode d'affichage, champ de vision **80 à 120**.
  `ApplyGraphicsPrefs` (`BP_RixeGameInstance`) réapplique ces choix au lancement ; l'anticrénelage est
  enregistré avec les autres réglages (`AAMethod`).
- **Kit d'interface** : panneaux à coins arrondis (8 à 16 px), fond flou (`BackgroundBlur`), liseré cyan
  lumineux de 1,5 px, onglet actif surligné ; même style pour le score et le chat du HUD.

## Visée au viseur

En visée, `RixeAdsTick` (`BP_ShooterCharacter`, chaque image, joueur local) place la caméra derrière le point
de visée de l'arme (`RixeSightOffset`, `RixeEyeDist`) et réduit le champ de vision (`RixeAdsFov`), avec une
transition douce. Le serveur connaît la visée (actions 7 / 8) : déplacement ralenti à 420.

## Score et fin de manche

Le prototype compte les éliminations de chaque équipe (`TeamScores`) : le score Rouge correspond aux morts de l'équipe Bleue, et inversement. `BP_RixeMatchRules` utilise la même règle. **Ce compteur d'éliminations n'est pas encore le score de contribution final** défini dans la section 3 du cahier des charges, qui doit aussi valoriser objectifs, assistance, défense et soutien avec des protections anti-farming. Il doit donc être traité comme un score provisoire de prototype, et non comme une implémentation complète du barème approuvé.
À la victoire, la bannière « VICTOIRE DE L'ÉQUIPE … » s'affiche chez tous les joueurs, puis le serveur
relance l'arène (`servertravel`) et les clients se reconnectent tout seuls.

## Interface de jeu (`Content/Rixe/UI/WBP_RixeHUD`)

Score Rouge | Bleu en haut, bannière de victoire, chat en bas à gauche, aide des touches, voyant du micro.
Textes contourés pour rester lisibles sur fond clair.

## Chat textuel

**Entrée** ouvre la zone de saisie, **Entrée** envoie, **Échap** annule. Le serveur ajoute
« Pseudo : message » au `ChatLog` du GameState (8 dernières lignes), répliqué à tous.
Protection côté serveur : message coupé à 100 caractères, un message au plus toutes les 0,5 seconde
par joueur.

## Chat vocal

Maintenir **V** pour parler (`ToggleSpeaking 1` / `0`), le voyant « ● Micro ouvert » s'affiche.
Configuration :

- `DefaultEngine.ini` : `[OnlineSubsystem] DefaultPlatformService=Null`, `bHasVoiceEnabled=true` ;
  `[Voice] bEnabled=true` ;
- `DefaultGame.ini` : `[/Script/Engine.GameSession] bRequiresPushToTalk=true`.

Ces réglages sont lus au démarrage de l'éditeur ou du jeu.

Le vocal d'Unreal n'enregistre les joueurs (« talkers ») que dans une **session en ligne**. Le jeu en crée donc
une (sous-système `Null`, réseau local, 8 places) :

- avant d'héberger et avant de rejoindre une adresse IP (boutons du menu), pour que la session existe
  quand les autres joueurs arrivent ;
- au début de chaque partie (`RixeVoiceSession` dans `BP_ShooterPlayerController`, relancé toutes les
  0,5 seconde tant que l'état du joueur n'est pas encore arrivé), utile pour les tests dans l'éditeur.

Testé dans l'éditeur : micro ouvert puis fermé sans erreur chez le serveur et chez le client
(`StartLocalProcessing(0) returned 0x00000000`), le serveur enregistre le client comme interlocuteur,
et le client enregistre le serveur à partir de la deuxième manche. Avec les boutons Héberger / Rejoindre,
l'enregistrement est fait dès la première manche.

## Anti-triche

Le prototype documente une autorité serveur sur plusieurs éléments : dégâts appliqués par les projectiles, morts, scores, victoire, création des bots et limites de longueur/fréquence du chat. **Cela ne constitue pas une validation anti-triche complète.** Les RPC et paramètres reçus du client, la cadence de tir, les munitions, les déplacements, les capacités, les apparitions et les résultats doivent encore être audités et testés selon la section 5 du cahier des charges.

Limites connues : la visée provient du client et peut être manipulée ; un serveur d'écoute appartient à un joueur qui peut lui-même tricher ou falsifier l'état du match. Ne jamais affirmer qu'un client modifié ne peut pas tricher sur la seule base des tests PIE actuels. Le classement et les récompenses compétitives restent désactivés tant que l'intégrité n'est pas démontrée. Un anti-triche client éventuel ne remplace pas l'autorité serveur et doit être évalué selon les plateformes et licences réellement retenues.

## Testé

Partie lancée dans l'éditeur : l'arène s'affiche avec le nouvel éclairage, le score 0 | 0 s'affiche,
aucune erreur de script.

Menu Pause testé dans l'éditeur avec la souris et le clavier : ouverture et fermeture avec M,
bouton « Reprendre la partie », qualité « Épique », inversion de l'axe, curseur de sensibilité ;
les valeurs sont conservées quand on rouvre le menu.

Multijoueur testé dans l'éditeur à 2 joueurs (serveur d'écoute + 1 client) :

- le client se connecte, les deux joueurs apparaissent avec pistolet et fusil ;
- chat : message tapé chez le client, affiché chez le client et chez le serveur avec le pseudo ;
- tir du client : le serveur reçoit l'ordre, tire à sa place, les dégâts touchent un bot (100 → 50 → 25 PV),
  le bot meurt, le score passe à Rouge 1 | Bleu 0 chez le client ;
- fin de manche : bannière « VICTOIRE DE L'ÉQUIPE ROUGE » chez les deux joueurs, nouvelle manche lancée
  6 secondes plus tard, le client reconnecté, scores remis à 0 ;
- touche V : commandes `ToggleSpeaking 1` puis `0` envoyées ;
- journal : aucune erreur de script pendant les parties.

Équipes testées dans l'éditeur à 2 joueurs : serveur en Rouge sur un point `RED`, client en Bleu sur un
point `BLUE`, aucun bot, chacun voit l'autre dans sa couleur ; le joueur Rouge blesse puis élimine le Bleu,
le score passe à Rouge 1, le Bleu réapparaît côté Bleu avec 500 PV. En solo, les bots apparaissent en bleu.

Touches testées dans l'éditeur à 2 joueurs, chez le serveur puis chez le client : C accroupit (l'autre joueur
le voit, capsule abaissée), « & » / « é » passent au fusil / pistolet, la molette alterne ; en 1 seconde,
Maj + déplacement fait parcourir environ 1,3 fois plus de distance qu'en marchant (position lue côté serveur,
donc acceptée par le serveur). Le zoom du clic droit n'a pas pu être essayé : l'outil de test ne sait pas
maintenir ce bouton (depuis, le mode « basculer » permet de le tester : la caméra passe derrière
le viseur du fusil). R : 37 balles sur 40 après trois tirs, 40 après le rechargement, chez le serveur ;
chargeur aussi rempli pour le client. Aucune erreur de script.

Étape 1 testée dans l'éditeur à 2 joueurs (fenêtre du client) : onglet Graphismes, « Basse » coupe Lumen
(les deux variables passent à 0, qualité 0), « Ultra » le rallume ; « TAA » met `r.AntiAliasingMethod` à 2,
« TSR » le remet à 4 ; le message d'état et le bouton actif suivent ; le curseur du champ de vision agrandit
la vue. Menu, score et chat au nouveau style. Aucune erreur de script.

Correctif trouvé à la revérification : deux branches « HasAuthority » envoyaient aussi le cas client vers
le même nœud (dégâts des projectiles appliqués chez les clients, apparition des bots demandée chez les
clients). Le cas client ne fait plus rien.

## Remarque

Les textes « Roaming while Searching » / « Idling while Searching » au-dessus des ennemis viennent de
l'arbre d'états du modèle (`ST_Shooter`, tâches « Debug Text »). Ils n'apparaissent que dans l'éditeur et
les versions de développement, pas dans une version « Shipping ».
