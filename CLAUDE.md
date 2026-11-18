# Notes de travail (RIXE, UE 5.8 Blueprint)

## Chemins
- Projet : `D:\fps 5.8\fps.uproject`. Éditeur : `d:\ue_5.8\engine\binaries\win64\unrealeditor.exe`.
- Dépôt : branche `jeu-unreal`. Sauvegarder dans l'éditeur, `device_stage_files` des `.uasset`, copier depuis
  `/mnt/user-data/uploads/fps 5.8/Content/...` vers `Content/...`, commit, `git -c push.negotiate=true push`.

## Cahier des charges (15 modules, 18/11/2026) et ordre proposé
Autonomica abandonné : seul RIXE compte. FPS arcade façon XDefiant/CoD, 10 contre 10, contenu fait maison
(pas de packs Fab). Chaque étape se termine par une version jouable, testée à 2 joueurs, poussée sur `jeu-unreal`.
1. Socle rendu/perf/UI : Lumen, Nanite, post-process contrasté, exposition verrouillée, pas d'ombres noires (M1) ;
   kit UI coins arrondis 8-16, flou d'arrière-plan, liserés lumineux (M2) ; qualité Basse→Ultra, limite FPS,
   V-Sync, TSR, Basse = sans Lumen (M3) ; champ de vision 80-120 (M9).
2. Armes + stand de tir : 8 armes (maillages faits, voir plus bas), TTK moyen, recul, vitesse par arme,
   hitmarkers corps/tête, barre de vie flottante (M4) ; accessoires qui changent les stats (M9) ; stand de tir (M8) ;
   validation serveur de la cadence (M11).
3. Mouvement : glissade, slide-cancel, jump-shot, escalade rapide (M4) ; input buffering (M11) ; prédiction client
   (C++ si Visual Studio dispo, sinon Blueprint).
4. Cartes et premiers modes : 3 cartes à 3 voies (M1) ; TDM, Domination, modificateur Hardcore (M6) ; bots pour
   remplir le 10c10 (M8) ; apparitions anti-spawnkill (M9).
5. Interface de match : tableau des scores + ping (M10), killfeed avec icônes, vote de carte (M15), podium MVP (M13),
   ping rapide, killcam (M8).
6. Factions : 1 compétence active (recharge) + 1 ultime (score) (M5).
7. Progression : XP compte/armes, accessoires et skins (MI dynamiques) (M7) ; double sauvegarde, éditeur de réticule
   (M14) ; stats de carrière, couleurs de contours (M10) ; passe de combat gratuit (M12) ; défis quotidiens (M8) ;
   inspection d'arme, scorestreaks (drone radar) (M13).
8. Autres modes + classé : Occupation, Hot Shot, CTF, Escorte, Contrôle de zone, Recherche & Destruction (M6) ;
   RP et rangs Bronze→Légende (M7) ; backfill, pénalité d'abandon (M14).
9. En ligne : Steam (OnlineSubsystemSteam, AppID 480), invitations/lobbies (plugin Advanced Sessions, à faire valider),
   spectateur (M12, M10) ; anti-triche serveur vitesse/cadence, logs de crash (M11).
10. Finition : MetaSounds spatialisé + occlusion (M11), manette + aim assist (M12), accessibilité (M15),
    build Shipping optimisé (M10).
Déjà fait : multijoueur (serveur d'écoute), chat, vocal, équipes, rechargement, menu à onglets, touches
réassignables, sensibilités, visée au viseur, maintenir/basculer. **Étape 1 terminée** (18/11, poussée).
Visual Studio 2022 Community 17.14 installé (vérifier MSVC v143 + SDK Windows avant l'étape 3).

## Reprise (armes, 17/11 au soir)
- Maillages générés par `Tools/rixe_weapons.py` (OBJ dans `D:\fps 5.8\RixeSource\Weapons`, repère Y = canon,
  Z = haut, poignée à l'origine), importés dans `/Game/Rixe/Weapons/Meshes` ; matériaux `M_RixeSurface` et
  `MI_Skin0..6_Body/Accent`, `MI_Wpn_Detail`, `MI_Wpn_Glass` dans `/Game/Rixe/Weapons/Materials`.
  **Peut-être pas sauvegardés** : vérifier, sinon réimporter (`StaticMeshTools.import_file`) puis `save_assets`.
- Points de visée, montages d'accessoires : `Tools/weapons_meta.json`. Variables déjà ajoutées à
  `BP_ShooterWeaponBase` : RixeSightOffset, RixeAdsFov, RixeEyeDist, RixeDamage, RixeHeadMul, RixePellets…
- Dégâts : `ProcessHit` de `BP_ShooterProjectileBase` (ApplyDamage avec `Damage`) ; tir : `Fire Bullet` /
  `Calculate Bullet Spawn Transform` de `BP_ShooterWeaponBase`.

## Unreal MCP : `ProgrammaticToolset.execute_tool_script`
- `def run(): ... return {dict}` ; `execute_tool(nom, json.dumps(args))` ; imports : json, math, re, time.
- Une erreur d'outil arrête tout le script, même dans un try : trouver les ids d'abord, construire ensuite.
- `editor_toolset.toolsets.blueprint.BlueprintTools.` get_graph{blueprint,graph_name}, find_nodes{graph,title:''},
  get_node_infos{nodes} (pins : name, pin_id, type_id, value, connected_pins), create_node{graph,type_id,pos}
  (renvoie la réf. du nœud), connect_pins / break_pins{output_pin,input_pin}, set_pin_value{pin,value},
  find_node_types{graph,type_id_filter,context_pins:[]}, compile_blueprint{blueprint}.
- `editor_toolset.toolsets.object.ObjectTools.` get_properties{instance,properties}, set_properties{instance,values:"json"}.
- `editor_toolset.toolsets.asset.AssetTools.save_assets{asset_paths:[...]}`.
- `EditorToolset.EditorAppToolset.` StartPIE{options:{bSimulate,playMode:'PlayMode_InViewPort',warmupSeconds}}, StopPIE.
- `EditorToolset.LogsToolset.GetLogEntries{pattern,category,maxEntries}`.
- `SlateInspectorToolset.SlateInspectorToolset.Windows{action:list|select|close,index}`.
- `UMGToolSet.UMGToolSet.GetWidgets{widgetBlueprint:{refPath:'/Game/.../WBP_X.WBP_X'}}`.

## DSL de graphes (bien plus économe)
- L'éditeur est passé en **anglais** pour que les ids de nœuds collent à la doc du DSL
  (`BlueprintTools.get_graph_dsl_docs`, `write_graph_dsl{graph,code}`, `read_graph_dsl{graph}`).
- `write_graph_dsl` ajoute des nœuds : vider la fonction d'abord (supprimer tout sauf FunctionEntry) ;
  les paramètres doivent déjà exister (`add_function_param`). Les événements d'IA multi-sorties
  (Started/Completed) ne sont pas lus par `read_graph_dsl` : les câbler avec create_node/connect_pins.
- Cache par graphe : un nœud vers une variable/fonction créée après la première requête sur ce graphe
  est introuvable jusqu'au redémarrage de l'éditeur (ou utiliser un graphe neuf). Créer d'abord toutes
  les variables et fonctions vides, redémarrer (File > Exit, puis computer_open_application + double-clic
  sur le projet `fps`), puis écrire la logique.

## Pièges connus
- Ids en français : `Utilitaires|ContrôleDeFlux|Branche`, `Utilitaires|Opérateurs|Égalà(==)`, `Supérieurà(>)`,
  `Math|Flottant|SelectFloat`, `Entrée|KeyboardEvents|C` / `Esperluette` / `é`, `Appelerunefonction|Aim`,
  `Variables|Pardéfaut|ObtenirX` / `DéfinirX` (booléens sans le « b »).
- Opérateurs promotables : brancher A avant de régler B.
- Variable ajoutée à un BP parent : absente des nœuds de l'enfant, mettre la logique dans le parent.
- Les événements RPC (`ServerRixeAction`) sont dans `EventGraph`. NodePosX/Y illisibles.
- `set_pin_value` ne marque pas le paquet modifié ; `save_assets` échoue pendant le PIE.
- Propriétés RepNotify non modifiables par set_properties. Variables BP avec espaces : `Current Weapon`.
- PIE à 2 : `/Script/UnrealEd.Default__LevelEditorPlaySettings` PlayNumberOfClients 2, PlayNetMode
  PIE_ListenServer (remis à zéro au redémarrage). Fermer « Journal des messages », `select` la fenêtre client.
- Objets PIE : `/Game/Variant_Shooter/UEDPIE_0_Lvl_ArenaShooter.Lvl_ArenaShooter:PersistentLevel.BP_ShooterCharacter_C_0`
  (serveur : _0 hôte, _1 client) ; `UEDPIE_1` = monde du client.
- AZERTY : Unreal lit 1 / 2 comme `Ampersand` / `E_AccentAigu`. L'outil de test doit envoyer « & » / « é ».
- Un script bloque le jeu : mesurer après l'action (distance, état), pas pendant.
- Contrôle du PC : `computer_resolve_access(["UnrealEditor.exe","File Explorer"])`. Ne jamais relancer l'éditeur
  avec `computer_open_application` (ouvre une 2e instance).

## Réseau
Serveur d'écoute. `ServerRixeAction(Action, Text)` dans `BP_ShooterPlayerController` : 0/1 tir, 2 arme,
3 chat, 4/5 sprint, 6 rechargement (`RixeReloading`), 7/8 visée (`RixeAdsSrv`, vitesse 420). Équipes : `ChoosePlayerStart` (GameMode), `Team Byte` en RepNotify.
