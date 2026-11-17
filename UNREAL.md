# RIXE sous Unreal Engine 5.8 — journal des modifications

Projet de base : modèle « First Person », variante « Arena Shooter » (Blueprint).

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

Modèle réseau : **serveur d'écoute** (un joueur héberge, les autres le rejoignent). Le serveur décide de
tout ce qui compte (dégâts, morts, scores, fin de manche) ; les clients envoient seulement leurs actions.

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

- **Répartition** : `ChoosePlayerStart` (`BP_ShooterGameMode`) place chaque joueur dans une équipe selon son
  ordre d'arrivée (1er Rouge, 2e Bleu, 3e Rouge…) puis le fait apparaître sur un point d'apparition de son
  camp (`PlayerStart` marqués `RED` / `BLUE`), aussi après chaque mort.
- **Bots** : seulement en solo (entraînement contre l'équipe Bleue). Dès qu'un deuxième joueur arrive,
  `OnPostLogin` supprime les bots et `Should Spawn Enemy NPCs` n'en crée plus : la partie devient du
  joueurs contre joueurs, comme XDefiant.
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

## Visée au viseur

En visée, `RixeAdsTick` (`BP_ShooterCharacter`, chaque image, joueur local) place la caméra derrière le point
de visée de l'arme (`RixeSightOffset`, `RixeEyeDist`) et réduit le champ de vision (`RixeAdsFov`), avec une
transition douce. Le serveur connaît la visée (actions 7 / 8) : déplacement ralenti à 420.

## Score et fin de manche

Le modèle compte les morts de chaque équipe (`TeamScores`). L'interface affiche les **éliminations** :
le score Rouge = morts de l'équipe Bleue, et inversement. `BP_RixeMatchRules` utilise la même règle.
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

Ce qui est protégé, parce que décidé par le serveur : dégâts, points de vie, morts, scores, victoire,
création des bots, contenu du chat (longueur et fréquence). Un client modifié ne peut pas s'ajouter des
points ni tuer quelqu'un sans tirer.

Limites connues : la visée vient du client (comme dans la plupart des FPS), donc un aimbot reste possible ;
le serveur d'écoute appartient à un joueur, qui peut tricher. Pour un vrai jeu public il faudra un serveur
dédié et un anti-triche côté client (Easy Anti-Cheat est gratuit pour les projets Unreal).

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

Correctif trouvé à la revérification : deux branches « HasAuthority » envoyaient aussi le cas client vers
le même nœud (dégâts des projectiles appliqués chez les clients, apparition des bots demandée chez les
clients). Le cas client ne fait plus rien.

## Remarque

Les textes « Roaming while Searching » / « Idling while Searching » au-dessus des ennemis viennent de
l'arbre d'états du modèle (`ST_Shooter`, tâches « Debug Text »). Ils n'apparaissent que dans l'éditeur et
les versions de développement, pas dans une version « Shipping ».
