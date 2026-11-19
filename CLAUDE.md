# CONSIGNES PRIORITAIRES POUR CLAUDE — RIXE

## Démarrage obligatoire : lire le cahier des charges
Avant toute modification, lire intégralement `CAHIER_DES_CHARGES_RIXE.md` à la racine du dépôt. Ce document est la référence fonctionnelle consolidée du projet. Le présent fichier conserve aussi des notes techniques historiques : en cas de contradiction, ne pas appliquer aveuglément une ancienne note ou une ancienne feuille de route ; comparer les deux, privilégier les décisions les plus récentes du cahier des charges et signaler tout conflit réel.

## Exigence multiplateforme RIXE
Respecter la section « Jeu multiplateforme et parité de gameplay » du cahier des charges. Ne pas réduire l'objectif à un simple site vitrine : le navigateur doit permettre de jouer réellement. Étudier d'abord un prototype Pixel Streaming Unreal (rendu Unreal réel mais infrastructure GPU distante et latence/coût à mesurer), puis comparer à un client navigateur WebGL/WebGPU distinct si le streaming n'est pas viable. Ne jamais prétendre qu'un client web allégé est rendu par Unreal. Dans les deux cas, préserver strictement les mêmes règles, armes, cartes fonctionnelles, timings, validations serveur, progression et équité compétitive ; seuls les détails visuels/performance peuvent varier. Priorité à Windows Unreal stable, puis prototype web et autres plateformes par étapes. Budget 0 € : aucun hébergement GPU ou service payant sans accord.

## Nouveaux chantiers approuvés : réseau, communauté et équilibrage
Prendre en compte la section 17 du cahier des charges : réseau compétitif (diagnostic ping/jitter/pertes, compensation de latence et prédiction/réconciliation contrôlées), protection communautaire (blocage, sourdine, signalements, anti-spam et modération proportionnée), et équilibrage fondé sur des statistiques agrégées avec échantillons suffisants et tests avant/après. Ne pas sacrifier l'autorité serveur, la vie privée ou le budget 0 €. Commencer par les outils locaux et les mesures/tests les plus simples ; aucune sanction grave entièrement automatisée, aucune collecte superflue, aucun ajustement automatique des règles en pleine partie. Ces fonctions ne sont pas réputées existantes avant implémentation et tests.


## Plateforme unifiée, compte joueur et cross-play — exigences approuvées
Respecter la section 18 de `CAHIER_DES_CHARGES_RIXE.md`. RIXE doit viser une plateforme multiplateforme avec un compte RIXE unique : le joueur retrouve son profil, sa progression, ses statistiques, ses déblocages et ses paramètres compatibles sur PC, navigateur et les autres plateformes effectivement prises en charge. Concevoir liaison sécurisée des comptes de plateforme, sauvegarde/synchronisation, récupération et résolution des conflits. Le cross-play doit être activable ou désactivable par le joueur ; le matchmaking et les groupes doivent respecter ce choix sans mélange silencieux. Les amis doivent pouvoir jouer ensemble entre plateformes compatibles. Garder progression/rangs/récompenses validés côté serveur, préserver l'équité clavier/souris/manette/tactile et la parité de gameplay. Étudier EOS et les solutions compatibles, sans présumer qu'un service cloud est gratuit. Budget 0 € : aucun coût récurrent ou service payant sans accord. Développer par étapes et ne déclarer ces fonctions livrées qu'après tests de bout en bout sur plusieurs clients réels.

## PRIORITÉ ABSOLUE N°1 : audit et clarification de la licence
Traiter la licence comme le tout premier chantier, avant les nouvelles fonctionnalités et avant toute publication.

1. Examiner `LICENSE`, les mentions de licence du README, les fichiers de configuration, les plugins, les dépendances, les assets et les dossiers du projet Unreal.
2. Faire l'inventaire des provenances et droits, en distinguant au minimum : code original RIXE, code/contenu du template Unreal, contenu Epic/Fab/Quixel, plugins, bibliothèques et ressources tierces.
3. Identifier précisément ce qui est couvert par la GPL-3.0 actuelle, qui en détient les droits, et si le dépôt mélange des éléments soumis à des licences incompatibles ou à des conditions spécifiques.
4. Vérifier les conditions officielles Unreal/Epic applicables aux versions et aux contenus réellement utilisés. Ne pas se fier à une supposition ni à une simple recherche de nom de fichier.
5. Proposer une stratégie de licences séparées si nécessaire : par exemple licence permissive pour le seul code original RIXE, notices/exclusions explicites pour le contenu Unreal/Epic et respect des licences tierces. MIT n'est qu'une piste à évaluer, jamais une décision automatique.
6. Ne pas remplacer, supprimer ou réécrire `LICENSE`, les notices de copyright ou les mentions de tiers tant que l'inventaire n'est pas établi. Ne pas prétendre que RIXE est entièrement open source ou redistribuable tant que ce n'est pas vérifié.
7. Produire un rapport clair : fichiers concernés, détenteurs/provenances identifiés, licences applicables, incompatibilités/risques, éléments non vérifiables et stratégie recommandée.
8. Préparer ensuite les modifications de licence dans un commit distinct et les appliquer uniquement après avoir établi que les droits le permettent. Toute décision juridique incertaine doit être signalée au propriétaire pour validation ; ne pas inventer de droits ni donner une garantie juridique.

## Autonomie d'exécution
Le propriétaire autorise Claude à avancer de manière autonome avec les outils disponibles, y compris terminal, navigateur, éditeur Unreal et contrôle du PC, dans la limite des autorisations réellement accordées par le système. Utiliser ces accès pour inspecter, tester, sauvegarder et faire progresser le projet sans demander une confirmation à chaque opération technique réversible.

Limites impératives :
- Budget autorisé : **0 €**. Aucun achat, abonnement, plugin/asset payant, serveur, publicité, domaine ou frais de boutique sans accord explicite préalable.
- Ne jamais exposer de mot de passe, jeton, clé API, donnée privée ou secret dans le dépôt, les logs ou les rapports.
- Sauvegarder avant les opérations risquées ; ne jamais supprimer/écraser des données sans sauvegarde vérifiée.
- Demander l'accord avant dépense, publication publique, action irréversible, engagement juridique, changement de propriété/licence ou utilisation d'identifiants/paiements.
- Ne pas prétendre avoir exécuté une action si l'outil ne l'a pas confirmée.

## Après l'audit de licence
Une fois le rapport de licence établi et les changements sûrs traités/validés :
1. Faire un état des lieux Git : branche active, remote, commits non poussés et différences entre `main` et `jeu-unreal`. Ne pas supposer que ces branches sont synchronisées.
2. Reproduire le problème bloquant actuel et le corriger avant d'ajouter des fonctionnalités.
3. Continuer selon les priorités et critères de test du cahier des charges.
4. Pour chaque étape, consigner les fichiers changés, sauvegardes, tests exécutés, résultats, limites et prochaine étape. Ne déclarer terminé que ce qui a été effectivement testé.

---

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


## Livraison testable à chaque mise à jour — exigence du propriétaire

Le propriétaire souhaite recevoir un lien utilisable pour tester chaque mise à jour. À la fin de chaque étape qui modifie le jeu :

1. Si le projet peut être compilé et empaqueté correctement, produire une build jouable (priorité à une build Windows x64 Shipping ou Development adaptée aux tests).
2. Publier le paquet comme artefact GitHub Actions ou comme asset d'une GitHub Release, puis fournir un lien direct de téléchargement et indiquer la version, la branche, le commit, la plateforme, les contrôles effectués et les limites connues.
3. Si la build n'est pas encore fiable, ne pas la présenter comme jouable : fournir le rapport de test et expliquer précisément ce qui bloque.
4. Ne jamais remplacer le jeu Unreal par l'ancien dossier `prototype-web` ni présenter `prototype-web/demo.html` comme une version jouable de RIXE.
5. Un lien vers les fichiers source GitHub ne constitue pas un lien de test du jeu. Pour Unreal, fournir une build installable/téléchargeable ; un lancement dans le navigateur n'est pas attendu sauf si une véritable version web distincte est développée et validée.
6. Ne pas publier automatiquement une version publique ou une Release officielle sans vérifier le contenu, les licences, les données incluses et l'accord du propriétaire. Un artefact de test privé ou une Release de préversion peut être privilégié selon les permissions disponibles.
7. Si la taille de la build ou les contraintes GitHub empêchent l'hébergement, proposer une solution gratuite compatible avec le budget de 0 € et expliquer ses limites. Ne jamais prétendre qu'un lien existe tant qu'il n'a pas été créé et vérifié.

Dans chaque compte rendu, ajouter obligatoirement :
- **Lien de test/téléchargement :** URL vérifiée, ou « indisponible » avec la raison.
- **Version testée :** branche + commit.
- **Tests :** lancement, carte, contrôles, réseau si pertinent.
- **État :** jouable / jouable avec limites / non jouable.
