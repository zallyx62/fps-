# Notes de travail (RIXE, UE 5.8 Blueprint)

## Chemins
- Projet : `D:\fps 5.8\fps.uproject`. Éditeur : `d:\ue_5.8\engine\binaries\win64\unrealeditor.exe`.
- Dépôt : branche `jeu-unreal`. Sauvegarder dans l'éditeur, `device_stage_files` des `.uasset`, copier depuis
  `/mnt/user-data/uploads/fps 5.8/Content/...` vers `Content/...`, commit, `git -c push.negotiate=true push`.

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
3 chat, 4/5 sprint. Équipes : `ChoosePlayerStart` (GameMode), `Team Byte` en RepNotify.
