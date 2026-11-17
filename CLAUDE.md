# Notes de travail (RIXE, UE 5.8 Blueprint)

## Chemins
- Projet : `D:\fps 5.8\fps.uproject`. Éditeur : `d:\ue_5.8\engine\binaries\win64\unrealeditor.exe`.
- Dépôt : branche `jeu-unreal`. Sauvegarder dans l'éditeur, `device_stage_files` des `.uasset`, copier depuis
  `/mnt/user-data/uploads/fps 5.8/Content/...` vers `Content/...`, commit, `git -c push.negotiate=true push`.

## Feuille de route (demandes de l'utilisateur, novembre 2026)
Autonomica est abandonné : seul RIXE compte. Mode visé : **Domination 10 contre 10** façon XDefiant
(zones A/B/C, bots pour compléter les équipes). Contenu fait maison uniquement (pas de packs Fab).
1. Réglages : menu à onglets futuriste, touches réassignables (Enhanced Input user settings, IMC_Rixe),
   sensibilité normale + en visée, mode de visée maintenir/basculer, tout sauvegardé (slot `RixeReglages`).
2. Visée à travers le viseur (caméra placée derrière `RixeSightOffset` de l'arme, zoom `RixeAdsFov`).
3. Arsenal : fusil d'assaut, mitraillette, mitrailleuse, fusil tactique, précision, pompe, 2 pistolets ;
   stats équilibrées (pas d'arme abusive) ; maillages futuristes générés (Python) puis importés.
4. Progression par arme (XP sauvegardée) : accessoires et skins débloqués ; écran Arsenal.
5. 3 cartes moyennes pour 10c10, style futuriste néon ; choix de carte et rotation.
6. HUD et menus futuristes. 7. Tout vérifier à 2 joueurs, corriger, documenter, publier.
Fait : touches façon XDefiant, rechargement R, munitions client, IMC_Rixe + IA_* (Content/Rixe/Input).

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
3 chat, 4/5 sprint, 6 rechargement (`RixeReloading`). Équipes : `ChoosePlayerStart` (GameMode), `Team Byte` en RepNotify.
