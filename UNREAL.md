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

## Testé

Partie lancée dans l'éditeur : l'arène s'affiche avec le nouvel éclairage, le score 0 | 0 s'affiche,
aucune erreur de script.

Menu Pause testé dans l'éditeur avec la souris et le clavier : ouverture et fermeture avec M,
bouton « Reprendre la partie », qualité « Épique », inversion de l'axe, curseur de sensibilité ;
les valeurs sont conservées quand on rouvre le menu.

## Remarque

Les textes « Roaming while Searching » / « Idling while Searching » au-dessus des ennemis viennent de
l'arbre d'états du modèle (`ST_Shooter`, tâches « Debug Text »). Ils n'apparaissent que dans l'éditeur et
les versions de développement, pas dans une version « Shipping ».
