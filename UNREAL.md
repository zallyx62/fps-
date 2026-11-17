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

## Testé

Partie lancée dans l'éditeur : l'arène s'affiche avec le nouvel éclairage, le score 0 | 0 s'affiche,
aucune erreur de script.
