# RIXE under Unreal Engine 5.8 — change log

Base project: "First Person" template, "Arena Shooter" variant (Blueprint).

> **Scope of this document:** a log of the implementation observed in the prototype, not a functional specification. The behaviours described here do not automatically become final rules. If they differ, follow the authoritative section files indexed in `spec/INDEX.md` and record the difference as a task to fix. `CAHIER_DES_CHARGES_RIXE.md` is their generated aggregate mirror. The tests mentioned are historical in-editor tests; they do not prove validation on a packaged build or over the Internet.

> **Convention on the old steps:** the titles "Step 1: rendering, performance, interface" and "Step 2: weapons, shooting range, arsenal" are historical names of work batches of 18 November 2026. They do not match phases 1 and 2 of the current consolidated timeline and are not proof that a phase was passed. See `SUIVI_PHASES_RIXE.md` for the criteria and evidence.

> **Language:** this file is English only (`CLAUDE.md`, section 7). Game UI strings that are French on screen are quoted as they appear.

## Configuration gaps found — to audit, not validated

- `Config/DefaultEngine.ini` now disables hardware ray tracing by default (`r.RayTracing=False`), as the specification requires. Enabling it still has to be implemented and tested as a high-end option; this configuration change does not yet prove compatibility of every profile.
- The configuration declares D3D11/SM5 and also Linux and Mac targets in SM6. Their presence in the file proves neither that they compile nor that they work; Windows remains the initial target.
- **Clean-up done on 19 November 2026:** exact duplicates of `DefaultGraphicsRHI=DefaultGraphicsRHI_DX12` and of `r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange` were removed from `Config/DefaultEngine.ini` on both branches. No different graphics value was arbitrated; check the effective behaviour in Unreal before any other change.
- `fps.uproject` enables `GameplayStateTree`, `ModelContextProtocol`, `MCPClientToolset` and `AllToolsets`, in addition to `ModelingToolsEditorMode` limited to the editor. Check dependencies, licences, Editor/Runtime modules and behaviour when packaging Shipping; do not remove the MCP tools used for development without checking their scope.
  - **Update 24 Nov 2026 (commit `006a31c`):** `ModelContextProtocol`, `MCPClientToolset` and `AllToolsets` are now restricted with `"TargetAllowList": ["Editor"]`. Before this change the game target enabled the MCP runtime module, which embeds an HTTP server that can be started from the console. After the change, `fps.target` and the staging manifests of the packaged Development builds no longer contain any MCP module. The editor MCP workflow is unchanged. Shipping packaging is still not tested.
  - **Update 24 Nov 2026 (commits `006a31c`, `04355ca`):** `Config/DefaultGame.ini` declares an Asset Manager rule for `GameFeatureData` with `bIsEditorOnly=True`; without it the cook failed (ExitCode 25), and a runtime rule caused a handled ensure at game startup.
- **Update 28 Nov 2026 (patch, not yet tested in Unreal):** split screen turned off (`bUseSplitscreen=False`), `ServerDefaultMap` and `GlobalDefaultServerGameMode` now point to the arena and `BP_ShooterGameMode` (a dedicated server would otherwise start in `/Engine/Maps/Entry`), mouse smoothing turned off (`bEnableMouseSmoothing=False`), `CopyrightNotice` filled in.

## Done in the editor

- **Project:** name "RIXE", start map and game map = `Variant_Shooter/Lvl_ArenaShooter`, default game mode = `BP_ShooterGameMode`. The MCP server starts with the editor.
- **"Twilight" art direction** (`Content/Rixe/Materials`):
  - `MI_Rixe_Wall`, `MI_Rixe_Floor`: dark concrete with a fine grid for walls and floors;
  - `MI_Rixe_Red`, `MI_Rixe_Blue`: team colours, applied automatically according to the side of the arena;
  - `MI_Rixe_Gold`: metal elements of the central area.
- **Lighting:** low sun (3900 K), red and blue team lights near the spawn points, warm light in the centre.
- **Post-processing:** bloom, colour grading (cool shadows, warm highlights), vignette, light grain, light chromatic aberration, reduced motion blur.
- **Match rules** (`Content/Rixe/Blueprints/BP_RixeMatchRules`, placed in the arena): the first team to reach `ScoreLimit` (20 by default, editable on the actor) wins, the victory is shown, then the match restarts after 6 seconds.
  - **Update 24 Nov 2026 (commit `aeaf808`):** the placed instance in `Lvl_ArenaShooter` had overridden `ScoreLimit` to 75. Owner decision (24 Nov 2026): keep the base value. The override was reset, so the arena now uses the class default of **20**. The actor is also no longer spatially loaded (`bIsSpatiallyLoaded=false`, commit `34eeea3`), so match rules are always present in World Partition.
- **Saved settings** (`Content/Rixe/Blueprints`):
  - `BP_RixeGameInstance` (the project's game instance) keeps the sensitivity, the field of view, the master volume and the inversion of the vertical axis; it loads them at startup and saves them in the save slot `RixeReglages`;
  - `BP_RixeSaveSettings` is the matching save object;
  - the `Aim` function of `BP_FirstPersonCharacter` applies the sensitivity, the inversion and the field of view.
- **Pause / Settings menu** (`Content/Rixe/UI/WBP_RixeMenu`), opened and closed with **Esc** or **M** (in the editor, Esc stops the game: use M). The match keeps running behind the menu, as in an online FPS; the player can no longer move, aim or shoot while the menu is open.
  - Graphics: quality (Low, Medium, High, Epic), display (full screen, borderless window, windowed), vertical sync, frame-rate limit (60, 120, 144, unlimited), field of view (see the FOV note below).
  - **Gap to fix:** specification section 30.1 requires six presets (Ultra performance, Performance, Équilibré, Qualité élevée, Très haute qualité, Ultra) and a separate Personnalisé mode; the four levels of the prototype do not meet this target yet. The owner reconfirmed this on 28 Nov 2026 (`DECISIONS_SETTINGS_LICENSE_2026-11-28.md`).
  - **FOV note:** this log used to give two different ranges (70 to 120 and 80 to 120). The slider of the latest work (Step 1 below) is 80 to 120. Owner decision of 28 Nov 2026: default **70**, maximum **120**, minimum 70 (to be confirmed). The Editor still has to apply it.
  - Controls: aim sensitivity (0.1 to 3), vertical-axis inversion.
  - Audio: master volume.
  - Show or hide the frame counter, quit the game.
  - The graphics settings are saved by Unreal (`GameUserSettings`), the others by `BP_RixeGameInstance`.
  - Opening logic: functions `OpenRixeMenu` / `CloseRixeMenu` of `BP_ShooterPlayerController`.
- **Template fix:** `StateTreeTask_SenseEnemies` checks that the AI controller exists before subscribing to perception, which removes the "Accessed None" errors from the log.

## Online multiplayer

Current network model: **listen server** (one player hosts, the others join). The prototype already delegates some documented elements to the server, notably projectile damage, deaths and the provisional match score. This does not prove full server authority: rate of fire, ammunition, movement, abilities, spawns, RPCs and results still have to be audited against the specification. Clients request actions; the server must validate every sensitive action before applying it.

- **Host / Join** (menu M, Multiplayer section):
  - "Pseudo" field saved with the other settings;
  - "Héberger" (Host) restarts the arena in `listen` mode;
  - "Rejoindre" (Join) opens the entered IP address (`open <ip>`), UDP port 7777. To play outside the local network: open port 7777 on the host's router, or use a virtual network (ZeroTier, Radmin VPN) and enter the address that software gives.
- **Player actions:** `ServerRixeAction(Action, Text)` in `BP_ShooterPlayerController` (reliable "run on server" RPC): 0 = stop firing, 1 = fire, 2 = swap weapon, 3 = chat message, 4 / 5 = sprint on / off, 6 = reload, 7 / 8 = aim (ADS) on / off, 9 = loadout. Server guard `RixeCanAct` (SUIVI section 10): every action except 3 and 9 is refused when the controlled pawn is missing or dead, or when `WinningTeam` is not 0 (match over). Before that guard, `RixeServerGate` runs `RixeValidateAction` (SUIVI section 17): action must be 0..9, text at most 256 characters, token bucket of 30 refilled at 30/s per controller; refused calls are counted in `RixeActDropped` and logged on the 1st and every 100th drop.
- **Replicated variables:**
  - `BP_ShooterCharacter`: `bFiringRep`, `SwapCountRep`, `bDeadRep`, `Current HP` (with notification), `Team Byte`; the copies of the other players fire, swap weapons and die through the `OnRep_` functions;
  - `BP_ShooterNPC`: `bShootingRep`, `AimTargetRep`, `bDeadRep`;
  - `BP_RixeGameState` (new): `RedScore`, `BlueScore`, `WinningTeam`, `ChatLog`.
- **Server authority:** bots are created only by the server (`BP_ShooterNPCSpawner`), projectile damage applies only on the server (`BP_ShooterProjectileBase`), death is decided by the server and then replicated.
- **Starting equipment:** every player spawns with a pistol and a rifle (`BeginPlay` of `BP_ShooterCharacter`), like a class loadout; weapons on the ground can still be picked up.

- **Replicated weapon actors (Update 25 Nov 2026; code commit `fed4266`, SUIVI section 24):** weapon classes replicate; the server alone spawns player and bot weapons. `Owned Weapons` and bot `Weapon` use RepNotify so clients attach the replicated actors to their holders, apply the current weapon index, and reproduce the attachments and skin. `CurrentBullets` is written only on authority; clients keep a local prediction counter only for the auto-reload guard, while `OnRep_CurrentBullets` drives the owner's HUD from the server value. The listen-server PIE census covered 23 weapons for 20 holders across three server travels, deaths and respawns; a packaged Development host/client loopback test also joined, fired and showed the same victory. **Limits:** the owner's HUD ammo is one round trip late; the pickup path `EventAddWeaponClass` is not authority-gated; there was no late-join test, no separate-machine or Internet test, and no dedicated-server test. These results do not validate Phase 2.
- **Nicknames:** at launch the saved nickname is applied (`setname`). Without a nickname, the game assigns "JoueurNN" and keeps it for the whole session.
- **Animations:** the weapon Anim Blueprints (`ABP_FP_*`, `ABP_TP_*`) use `GetBaseAimRotation` instead of the controller, which does not exist for the other players; no more "Accessed None" errors, and the weapon tilt follows the aim of the other players.

## Player-versus-player teams

- **Current team assignment and spawning of the prototype:** `ChoosePlayerStart` (`BP_ShooterGameMode`) puts each player in a team according to arrival order (1st Red, 2nd Blue, 3rd Red…) and then spawns them on a spawn point of their side (`PlayerStart` tagged `RED` / `BLUE`), also after every death. This is a static selection per side, not yet the adaptive system decided in section 3 of the specification (threat evaluation, lines of sight, spawn-point repetition and server validation at respawn time). This rule must be replaced and tested before the final spawn system is validated.
- **Bots — known gap with the product target:** bots are spawned and refilled on the server by `BP_RixeBotDirector` (timer-driven `DirectorTick`, gated on `WinningTeam == 0` since PR #32). PIE tests with a listen server and a remote client (SUIVI sections 10, 15 and 16) show bots staying in the match while human clients are connected; the earlier description (bots only in solo, removed by `OnPostLogin` when a second player joins) no longer matches what was observed. The exact fill rule has not been re-documented here. This is current prototype behaviour, **not a final rule**. The specification, notably its section 28.1, plans explicit human/bot preferences, transparent filling according to the playlist and separate statistics. Replace this automatic removal with the rules of the mode concerned before considering matchmaking or team filling finished.
- **No friendly fire:** `RixeFriendlyAuth` (`BP_ShooterProjectileBase`, server side) cancels damage between two members of the same team. The shooter's team is cached on the projectile from the authoritative `Team Byte`, and an unknown team counts as friendly. It replaced the old `RixeFriendly` in `bdce5e2` (SUIVI section 12).
- **Colours:** players and bots are tinted red or blue (`ApplyTeamColor`, "Paint Tint" parameter of the mannequin), updated for everyone through `OnRep_Team Byte`.
- **Interface:** "ÉQUIPE ROUGE" or "ÉQUIPE BLEUE" (RED TEAM / BLUE TEAM) under the score, in the team colour.

## XDefiant-style controls

- **ZQSD:** `IMC_Default` also accepts Z (forward) and Q (left) for AZERTY keyboards, in addition to WASD.
- **Sprint:** holding Left Shift raises the speed from 600 to 900 (`BP_ShooterCharacter`). The server applies the same speed through `ServerRixeAction` (actions 4 = sprint, 5 = walk), otherwise it would correct the position. The decision record targets a sprint/walk ratio of 1.5; the editor test below measured about 1.3 (see "Tested"). Re-measure before retuning.
- **Crouch:** C toggles, Left Ctrl held; `bCanCrouch` enabled on the `CharMoveComp` (300 crouched).
- **Aim:** right button held → field of view × 0.7 (variable `bRixeADS` read by the `Aim` function of `BP_FirstPersonCharacter`, called on press and on release).
- **Weapons:** 1 = rifle (primary), 2 = pistol (secondary), wheel = alternate; Shift no longer changes weapon. Server side (SUIVI section 18): action 2 advances the replicated absolute index `RixeWeaponIdxRep` (0.15 s server cooldown); other machines apply it in `OnRep_RixeWeaponIdxRep`, and the owning player snaps to it 0.5 s after its last local swap if the server refused the swap. On an AZERTY keyboard, Unreal reads the "1" key as "&" and "2" as "é": both are bound.
- **Reload:** R sends action 6. The server clears `bFiringRep` and calls `RixeServerReload`, which calls `RixeReload` on the server copy of the current weapon; the weapon's own `RixeReloadTime` applies (minimum 0.5 s), and the reload is refused when already reloading or when the magazine is full. Swapping weapons cancels the reload (`RixeCancelReload` on `DeactivateWeapon`). Fire is refused while reloading (`RixeSyncReloading`). The fixed 1.6 s delay was removed in `38f298e` (SUIVI section 15). The template's instant reload with an empty magazine is still in place.
- **Client ammunition:** the server fires in place of the client, so the client's bullet counter did not move. `Current Bullets` (`BP_ShooterWeaponBase`) is now replicated; `OnRep_Current Bullets` updates the interface of the player holding the weapon. Tested: 35 bullets on the server and on the client after five client shots.

## Settings (tabbed menu)

`WBP_RixeMenu` is organised in tabs **Play / Arsenal / Graphics / Controls / Keys / Sound** (labels are French on screen), in a futuristic style (dark background, cyan borders). The button of the active option is highlighted (`RefreshOptions`).

- **Rebindable keys:** Enhanced Input user settings enabled (`DefaultInput.ini`, `bEnableUserSettings`). Every keyboard/mouse key has a name (`MoveForward`, `Sprint`, `Aim`…) in `IMC_Default`, `IMC_Weapons` and the new `IMC_Rixe` (`Content/Rixe/Input`, actions `IA_Sprint`, `IA_Aim`, `IA_Reload`, `IA_Weapon1/2`, `IA_CrouchToggle/Hold`, `IA_Chat`, `IA_Voice`). One `WBP_RixeKeyRow` row per action, with two `InputKeySelector` boxes (primary / secondary); the change is applied immediately and saved (`SaveSettings` of Enhanced Input). "Reset keys" button.
- **Sensitivity:** normal and while aiming (multiplier, adjusted according to the weapon zoom), axis inversion, aim mode hold / toggle.
- **Saving:** `BP_RixeSaveSettings` (slot `RixeReglages`) keeps sensitivities, field of view, volume, inversion, aim mode, FPS counter and nickname; the graphics go through `GameUserSettings`.

## Step 1: rendering, performance, interface

- **Rendering:** Lumen (global illumination and reflections), Nanite, virtual shadows and TSR stay active by default. The arena's post-process volume locks the exposure (min = max = -0.5 EV, no more brightness "pumping"), limits sky leaks (`LumenSkylightLeaking` 0.1), lightens the shadows without making them black (local exposure: shadows 0.75, highlights 0.9) and raises the contrast (1.15) and the saturation (1.08 to 1.12) a little.
- **Prototype quality** Low / Medium / High / Epic (`GameUserSettings`; the log used to list the same four levels as Basse / Moyenne / Haute / Ultra, and the on-screen labels are still French); at **Low**, Lumen is switched off (`r.Lumen.DiffuseIndirect.Allow 0`, `r.Lumen.Reflections.Allow 0`) for small graphics cards. Anti-aliasing selectable **TSR / TAA / FXAA** (`r.AntiAliasingMethod` 4 / 2 / 1), frame-rate limit (60 / 120 / 144 / unlimited), vertical sync, display mode, field of view slider **80 to 120**. `ApplyGraphicsPrefs` (`BP_RixeGameInstance`) reapplies these choices at launch; the anti-aliasing is saved with the other settings (`AAMethod`).
- **Interface kit:** panels with rounded corners (8 to 16 px), blurred background (`BackgroundBlur`), 1.5 px glowing cyan border, highlighted active tab; same style for the HUD score and chat.

## Aiming through the sight

While aiming, `RixeAdsTick` (`BP_ShooterCharacter`, every frame, local player) places the camera behind the weapon's sight point (`RixeSightOffset`, `RixeEyeDist`) and reduces the field of view (`RixeAdsFov`), with a smooth transition. The server knows the aim state (actions 7 / 8): movement slowed to 420.

## Score and end of round

The prototype counts the eliminations of each team (`TeamScores`): the Red score matches the deaths of the Blue team, and the other way round. `BP_RixeMatchRules` uses the same rule. **This elimination counter is not yet the final contribution score** defined in section 3 of the specification, which must also reward objectives, assists, defence and support with anti-farming protections. It must therefore be treated as a provisional prototype score, not as a complete implementation of the approved scoring. On victory, the "VICTOIRE DE L'ÉQUIPE …" (TEAM … WINS) banner is shown to every player, then the server restarts the arena (`servertravel`) and the clients reconnect on their own.

## Game interface (`Content/Rixe/UI/WBP_RixeHUD`)

Red | Blue score at the top, victory banner, chat at the bottom left, key help, microphone indicator. Outlined text to stay readable on a light background.

## Text chat

**Enter** opens the input area, **Enter** sends, **Esc** cancels. The server appends "Nickname: message" to the GameState's `ChatLog` (last 8 lines), replicated to everyone. Server-side protection: message cut to 100 characters, at most one message every 0.5 seconds per player.

## Voice chat

Hold **V** to talk (`ToggleSpeaking 1` / `0`); the "● Micro ouvert" (microphone open) indicator is shown. Configuration:

- `DefaultEngine.ini`: `[OnlineSubsystem] DefaultPlatformService=Null`, `bHasVoiceEnabled=true`; `[Voice] bEnabled=true`;
- `DefaultGame.ini`: `[/Script/Engine.GameSession] bRequiresPushToTalk=true`.

These settings are read when the editor or the game starts.

Unreal's voice only registers the players ("talkers") in an **online session**. The game therefore creates one (`Null` subsystem, local network, 8 slots):

- before hosting and before joining an IP address (menu buttons), so that the session exists when the other players arrive;
- at the start of every match (`RixeVoiceSession` in `BP_ShooterPlayerController`, retried every 0.5 seconds while the player state has not arrived), useful for tests in the editor.

Tested in the editor: microphone opened then closed without error on the server and on the client (`StartLocalProcessing(0) returned 0x00000000`), the server registers the client as a talker, and the client registers the server from the second round. With the Host / Join buttons, registration is done from the first round. Not tested: voice on a dedicated server over the Internet (the `Null` session is local-network only).

## Anti-cheat

The prototype documents server authority over several elements: damage applied by projectiles, deaths, scores, victory, bot creation and chat length/frequency limits. **This is not a complete anti-cheat validation.** The RPCs and parameters received from the client, the rate of fire, ammunition, movement, abilities, spawns and results still have to be audited and tested against section 5 of the specification.

Known limits: the aim comes from the client and can be manipulated; a listen server belongs to a player who can cheat themselves or falsify the match state. Never claim that a modified client cannot cheat on the sole basis of the current PIE tests. Ranking and competitive rewards stay disabled until integrity is demonstrated. A possible client-side anti-cheat does not replace server authority and must be evaluated according to the platforms and licences actually chosen.

## Tested

Match started in the editor: the arena shows with the new lighting, the 0 | 0 score is shown, no script error.

Pause menu tested in the editor with mouse and keyboard: opening and closing with M, "Reprendre la partie" (Resume) button, quality "Epic", axis inversion, sensitivity slider; the values are kept when the menu is reopened.

Multiplayer tested in the editor with 2 players (listen server + 1 client):

- the client connects, both players appear with pistol and rifle;
- chat: message typed on the client, shown on the client and on the server with the nickname;
- client shot: the server receives the order, fires in its place, the damage hits a bot (100 → 50 → 25 HP), the bot dies, the score becomes Red 1 | Blue 0 on the client;
- end of round: "VICTOIRE DE L'ÉQUIPE ROUGE" banner on both players, new round started 6 seconds later, the client reconnected, scores reset to 0;
- V key: commands `ToggleSpeaking 1` then `0` sent;
- log: no script error during the matches.

Teams tested in the editor with 2 players: server in Red on a `RED` point, client in Blue on a `BLUE` point, no bot, each sees the other in their colour; the Red player wounds then eliminates the Blue one, the score becomes Red 1, the Blue player respawns on the Blue side with **500 HP (unintended, see `DECISIONS_SETTINGS_LICENSE_2026-11-28.md`; bots seem to have 100 HP)**. In solo, the bots appear in blue.

Keys tested in the editor with 2 players, on the server then on the client: C crouches (the other player sees it, capsule lowered), "&" / "é" switch to the rifle / pistol, the wheel alternates; in 1 second, Shift + movement covers about 1.3 times the distance of walking (position read on the server side, so accepted by the server; the target ratio is 1.5). The right-click zoom could not be tried: the test tool cannot hold that button (since then, the "toggle" mode makes it testable: the camera moves behind the rifle's sight). R: 37 bullets out of 40 after three shots, 40 after the reload, on the server; magazine also refilled for the client. No script error.

Step 1 tested in the editor with 2 players (client window): Graphics tab, "Low" switches Lumen off (both variables go to 0, quality 0), "Epic" turns it back on; "TAA" sets `r.AntiAliasingMethod` to 2, "TSR" sets it back to 4; the status message and the active button follow; the field-of-view slider widens the view. Menu, score and chat in the new style. No script error.

Fix found on re-check: two "HasAuthority" branches also sent the client case to the same node (projectile damage applied on the clients, bot spawn requested on the clients). The client case now does nothing.

## Known packaged listen-host travel regression

The packaged Development test recorded in `SUIVI_PHASES_RIXE.md`, section 24 (25 Nov 2026), found that a host launched with `?listen` reloads `Lvl_ArenaShooter` as `NetMode = Standalone` after the first victory and disconnects its client. The client then continues in a separate local match. PIE did not reproduce the issue because it preserves the network mode across travel. The in-game **Héberger** path has not yet been tested for this case. Do not treat packaged multiplayer round restart as validated until both hosting paths are reproduced, corrected and retested with client reconnection.

## Note

The texts "Roaming while Searching" / "Idling while Searching" above the enemies come from the template's state tree (`ST_Shooter`, "Debug Text" tasks). They only appear in the editor and in development builds, not in a "Shipping" build.
