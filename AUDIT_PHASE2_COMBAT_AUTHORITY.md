# RIXE: Phase 2 combat-authority audit (Blueprint DSL)

## 1. Summary

This audit read the exported Blueprint DSL statically and checked it against spec section 5 (server authority, which is critical priority) and spec 12.2 phase 2 step 2 (desyncs, double events, abusable RPCs, replication inconsistencies). Nothing was run.

**Overall verdict.** The core damage path is server-authoritative:
- Damage is applied only under `Networking|IsServer`.
- No RPC carries hit, damage, kill or score data.
- Scores live in the server-only GameMode.
- The fire rate per weapon instance is enforced with server time.

The weaknesses are in three areas:
- **The single client RPC `ServerRixeAction`** accepts actions with no check on whether the pawn is alive, whether the match is over, or how often actions arrive. Most of the high and medium findings come from this.
- **Match flow.** Scoring continues after victory. (The original "a Blue win never restarts the match" claim, H2, was refuted at runtime.)
- **Team and replication consistency.** Friendly fire is decided from a stale cosmetic team copy, the weapon swap is a counter, and weapons are spawned on every machine. (The original "PlayerStart tags are inverted between humans and bots" claim, M8, was refuted at runtime; see SUIVI section 13.)

**Counts after deduplication and later runtime corrections:** 1 high (H2 refuted), 8 medium (M8 refuted), 8 split medium/low, 18 low. 5 items were refuted by the audit verifiers, plus H2 and M8 refuted afterwards at runtime. Fix progress is tracked in section 6.

**How severities are shown.** When both verifiers agreed, their corrected severity is used. When they disagreed, the row says "split" with both ratings and is ranked by the higher one. Every RPC flag in this report is inferred: the export does not show Run on Server, Multicast or Reliable.

## 2. Confirmed findings (deduplicated, ranked)

| ID | Severity | Title | Files / graphs |
|---|---|---|---|
| H1 | High | Dead players (and players after match end) can keep firing real, damaging projectiles | BP_ShooterPlayerController ServerRixeAction; BP_ShooterCharacter OnRep_bFiringRep, RepStartFire, Die, EventAnyDamage; BP_ShooterWeaponBase StartFiring/Fire/RixeFire; BP_ShooterProjectileBase RixeApplyHit |
| H2 | **Refuted at runtime** | ~~A Blue victory never schedules RestartMatch~~ (DSL export artefact; see H2) | BP_RixeMatchRules CheckScore |
| M1 | Medium (one vote high) | Action 9 (loadout) re-send rebuilds weapons: instant full magazine, reset refire cooldown, spawn churn | BP_ShooterPlayerController RixeServerAction2, RixeApplyLoadoutTo; BP_ShooterCharacter OnRep_RixeLoadout, RixeBuildLoadout; BP_ShooterWeaponBase RixeSetupVisual |
| M2 | Medium | Action 6 reload: fixed 1.6 s, ignores the weapon's reload time and state, can refill the wrong weapon, two parallel reload paths | BP_ShooterPlayerController ServerRixeAction (Action 6); BP_ShooterWeaponBase RixeReload/RixeReloadDone |
| M3 | Medium | Weapon swap replicated as a toggle counter, unthrottled: server and proxies end up on different weapons | ServerRixeAction (Action 2); BP_ShooterCharacter OnRep_SwapCountRep, RepSwap |
| M4 | Medium | Friendly fire decided from cosmetic RixeTeamRep, which is stale (default 0) after every player spawn | BP_ShooterProjectileBase RixeFriendly/ProcessHit; BP_FirstPersonCharacter RixeSetHP; BP_ShooterCharacter BeginPlay/OnRep_CurrentHP/EventSetTeam; BP_RixeBotDirector SyncPawns |
| M5 | Medium | Nothing freezes play after victory: score, deaths and respawns continue | BP_RixeMatchRules CheckScore; BP_ShooterGameMode EventIncrementTeamScore; Die; OnDestroyed_Event |
| M6 | Medium | Weapons and projectiles spawned independently on every machine; loadout built twice per spawn | BP_ShooterCharacter BeginPlay/OnRep_RixeLoadout/RixeBuildLoadout; BP_ShooterNPC BeginPlay; BP_ShooterWeaponBase RixeFire |
| M7 | Medium (pitch sub-point split low/medium) | The authoritative shot is re-simulated from server-side camera/muzzle components with independent spread (desync) | BP_ShooterCharacter Get Weapon Target Location; BP_ShooterWeaponBase RixeSpawnXf/RixeFire |
| M8 | **Refuted at runtime** | ~~Humans and bots of the same team map to opposite PlayerStart tags~~ (see SUIVI section 13) | BP_ShooterGameMode ChoosePlayerStart; BP_ShooterPlayerController OnDestroyed_Event; BP_RixeBotDirector SpawnBot |
| M9 | Medium | Team assignment by PlayerArray index parity inside ChoosePlayerStart, never rebalanced | BP_ShooterGameMode ChoosePlayerStart, EventOnPostLogin |
| S1 | Split medium/low | ServerRixeAction has no action whitelist, no per-action rate limit, no allowed-state check, no payload limit | BP_ShooterPlayerController ServerRixeAction, RixeServerAction2, RixeActionSig |
| S2 | Split medium/low | Death does not stop the weapon on simulated clients; dead NPCs may keep firing | BP_ShooterCharacter Die/OnRep_bDeadRep; BP_ShooterNPC Die; BP_ShooterAIController OnDeath |
| S3 | Split medium/low | Score credited from the victim's team with no killer attribution (self-kill or team kill scores for the enemy) | BP_ShooterCharacter/BP_ShooterNPC Die, EventAnyDamage; BP_ShooterGameMode EventIncrementTeamScore |
| S4 | Split medium/low | Respawn bypasses GameMode: no fallback, no validity or match-state check, fires on any pawn destruction | BP_ShooterPlayerController EventOnPossess, OnDestroyed_Event |
| S5 | Split medium/low | Hits on BP_RixeTarget never register (Character cast gate); target state not replicated | BP_ShooterProjectileBase ProcessHit/RixeApplyHit; BP_RixeTarget |
| S6 | Split medium/low | Server sprint/ADS state on the controller is never reset on death/respawn | BP_ShooterPlayerController RixeSpeedFromAction, EventOnPossess; BP_ShooterWeaponBase RixeIsAds |
| S7 | Split low/medium | MaxWalkSpeed changes travel by a separate RPC, outside CharacterMovement saved moves (corrections) | BP_ShooterCharacter RixeSendAds, RixeApplySpeed; RixeServerAction2 |
| S8 | Split medium/low (disputed) | Recoil may apply only to the listen-server host | BP_ShooterWeaponBase RixeFire; BP_ShooterCharacter EventAddWeaponRecoil |
| L1 | Low | bFiringRep is a level flag: taps or re-asserted Action 1 fire on the server but are invisible to proxies | ServerRixeAction; OnRep_bFiringRep |
| L2 | Low | ADS accuracy and recoil bonus applied instantly from client flags; no server ADS time; redundant dual source | RixeIsAds, RixeSpawnXf, RixeFire; RixeSpeedFromAction |
| L3 | Low | Fire path has no `CurrentBullets > 0` check; rejected shots still MakeNoise and reset the timestamp | BP_ShooterWeaponBase RixeFire, Fire |
| L4 | Low | Explosion damage uses the blast centre as hit location: head multiplier, travel falloff, no radial falloff, no occlusion | BP_ShooterProjectileBase EventHit/ProcessHit/RixeIsHead/RixeFalloff |
| L5 | Low | Hits on corpses re-send the "kill" hitmarker (Kind 3), including on dead teammates | RixeApplyHit, RixeHitmarker, RixeFriendly |
| L6 | Low | RixeFriendly fails open when the instigator is gone | RixeFriendly |
| L7 | Low | EventAnyDamage receivers have no authority guard, no team check, no damage sanitising | BP_ShooterCharacter/BP_ShooterNPC EventAnyDamage |
| L8 | Low | Victory polled every 0.5 s with Red precedence (overshoot, tie goes to Red) | BP_RixeMatchRules CheckScore |
| L9 | Low | MatchRules victory check and restart run on every machine with no authority guard | BP_RixeMatchRules EventBeginPlay |
| L10 | Low | Client BeginPlay overwrites replicated Current HP and RixeHPFrac (late join / relevancy) | BP_ShooterCharacter EventBeginPlay, OnRep_CurrentHP; RixeSetHP |
| L11 | Low | Bot director counts corpses, so bot replacement waits ~10 s | BP_RixeBotDirector DirectorTick/CountBots; BP_ShooterNPC Die |
| L12 | Low | Chat: unbounded, client-chosen name prefix; no sanitising; one player can flush the 8-line log | ServerRixeAction Action 3; BP_RixeGameState AddChat |
| L13 | Low | Sprint speed set from unvalidated client codes (firing, reloading, direction not checked) | RixeServerAction2, RixeApplySpeed |
| L14 | Low | No Blueprint speed/teleport validation; GameNetworkManager anti-speedhack left at defaults | All character BPs; Config/DefaultGame.ini |
| L15 | Low | BP_ShooterCharacter GetTeam returns constant 0; bot tag is per-class | BP_ShooterCharacter Get Team; BP_ShooterAIController OnPossess |
| L16 | Low (one vote refuted) | Restart is a single fire-and-forget `servertravel` console command | BP_RixeMatchRules RestartMatch |
| L17 | Low (one vote refuted) | Character Die runs its score call on all machines and has no DoOnce (latent double event) | BP_ShooterCharacter Die |
| L18 | Low (one vote refuted) | Every locally controlled PC, including remote clients, calls CreateSession | BP_ShooterPlayerController RixeVoiceSession |

## 3. Finding details

**Testing conventions.**
- "PIE" means a listen server plus 2 clients, Run Under One Process off, with network emulation of about 100 ms latency and 1% loss where relevant.
- "Packaged" means a Development build run on 2 machines, as in section 24 of the spec.
- Every test must log the commit SHA.

### H1. Dead players can keep firing damaging projectiles (also after match end)

**Evidence**
- ServerRixeAction: `(|SetwithNotifybFiringRep (and (== Action 1) (not (Variables|Default|GetRixeReloading))) _asbp_shooter_character)`. There is no IsDead, bDeadRep or match-state check.
- On the server, OnRep_bFiringRep runs `(CallFunction|RepStartFire)` for pawns that are not locally controlled. That calls `(Class|BPShooterWeaponBase|StartFiring _current_weapon)`.
- RixeFire checks only `(if (not (Variables|Default|GetRixeReloading))`.
- Die runs `(Input|DisableInput _player_controller)` … `(Utilities|FlowControl|Delay 5.000000) (Actor|DestroyActor)`. It does not unpossess the pawn or clear bFiringRep.
- DeactivateWeapon only hides the weapon and calls StopFiring once.
- RixeApplyHit then runs `(Game|Damage|ApplyDamage HitActor _returnvalue_7 (Game|GetInstigatorController) self ...)`.

**Exploit / failure**
- A modified client keeps sending ServerRixeAction(1) during the 5 s after death. Each Set w/ Notify re-runs the OnRep on the server (standard Blueprint behaviour, inferred).
- The projectiles deal damage and the victim's Die calls IncrementTeamScore, so kills after death count.
- A laggy honest client can trigger this too if its fire press arrives after it has died.
- Firing is also accepted during the window after victory, because bMatchOver is server-only and only CheckScore reads it. Kills in that window cannot change the winner.
- The bRixeMenuOpen part of the original claim is unverified and has negligible impact.

**Smallest fix**
- At the top of ServerRixeAction, for actions 1, 2, 6, 7, 8 and 9: return if the controlled pawn is invalid, IsDead, or bDeadRep is set, or if the match is over.
- In Die, on authority: SetwithNotify bFiringRep = false and StopFiring on every owned weapon.
- Add an early return in StartFiring and RixeFire when the owner has the Dead tag.

**Test**
- PIE: client A holds fire and gets killed. Use a debug console command (or a temporary test-only key) to send ServerRixeAction(1) after death. Server log must show no projectile spawn and no damage after the death time.
- Packaged: repeat across 2 machines with a test-only debug command (not shipped).
- Regression: normal firing still works.

### H2. A Blue victory never restarts the match: REFUTED by runtime evidence

> **Post-audit correction (24 Nov 2026).** The packaged `aeaf808` run logged Blue victories at 09:04:17 and 09:05:21 UTC, each followed about 6 s later by `ProcessServerTravel` (see `SUIVI_PHASES_RIXE.md` section 8). The `SetTimerbyFunctionName "RestartMatch"` node is therefore reached from both branches. The DSL export prints a node shared by two exec paths under only one of them. H2 is withdrawn, and findings that depend on it (such as M5's "indefinitely after a Blue win") are adjusted accordingly. The original analysis is kept below for traceability.


**Evidence**
- Red branch: `(Class|BPRixeGameState|SetWinningTeam 1 ...) (Utilities|Time|SetTimerbyFunctionName 0 "RestartMatch" 6.0)`.
- Blue branch: `(:then (Class|BPRixeGameState|SetWinningTeam 2 _asbp_rixe_game_state))`, with no timer.
- `(|SetbMatchOver true)` is set before the branch, so CheckScore never reaches it again.
- RestartMatch is referenced nowhere else.

**Failure.** Every match Blue wins stays in its ended state forever and the host must restart by hand. No client input is needed; it is deterministic.

**Smallest fix.** Move the RestartMatch timer after the branch, so it runs once for both outcomes.

**Test**
- PIE: set ScoreLimit low through a test override, let Blue win, and verify servertravel happens about 6 s later.
- Repeat with a Red win.
- Packaged: same, with 2 machines.
- One verifier noted that a node wired from both branches could print under only one branch in the export. Confirm in the editor before editing.

### M1. Action 9 re-send rebuilds weapons (instant reload, refire reset, spawn churn)

**Evidence**
- RixeServerAction2: `(if (or (< (Actor|GetGameTimeSinceCreation _returnvalue) 10.0) (Utilities|String|EqualExactly(String) _returnvalue_1 "Lvl_RixeRange")) (CallFunction|RixeApplyLoadoutTo _returnvalue))`.
- RixeApplyLoadoutTo calls `SetwithNotifyRixeLoadout`, which reaches OnRep_RixeLoadout and then RixeBuildLoadout: `(Actor|DestroyActor _array_element)` and a respawn of the weapons.
- RixeSetupVisual: `(Variables|Default|SetRixeReloading false)` and `(|SetwithNotifyCurrentBullets (Variables|Ammo|GetMagSize))`.
- A new weapon instance has the default TimeOfLastShot (inferred), so the StartFiring refire gate passes at once.
- Nothing rate-limits action 9 and nothing requires the loadout to differ.

**Exploit**
- A modified client sends 9 after each shot during the first 10 s of every life, or at any time on Lvl_RixeRange.
- It gets an instant full magazine, cancels reloads, and fires a Sniper or Revolver at a rate limited only by the RPC.
- Server-side actor churn follows. Clients also rebuild if the attacker alternates loadout strings.
- The server resets to the primary weapon while the client does not (desync).

**Smallest fix.** Apply the loadout at most once per life: reset a flag in OnPossess, accept only while alive and before the first shot, and make an unchanged string a no-op. Otherwise only store RixeLoadoutSrv for the next spawn. Add a 1 s cooldown on the range level.

**Test**
- PIE: a debug command on client A sends 9 repeatedly after firing.
- Server log: the CurrentBullets refill and the weapon rebuild happen at most once per life, and the shot interval stays at or above RefireRate.
- Packaged: same.

### M2. Action 6 reload path

**Evidence**
- Action 6: `(Variables|Default|SetRixeReloading true) (|SetwithNotifybFiringRep false ...) (Utilities|FlowControl|Delay 1.6) (|SetwithNotifyCurrentBullets _mag_size _current_weapon)`.
- The weapon's own path is `SetTimerbyFunctionName self "RixeReloadDone" (Max (GetRixeReloadTime) 0.5)`, with guard `(and (not GetRixeReloading) (< CurrentBullets MagSize))`.
- `_current_weapon` comes from a pure node and is re-read after the Delay.
- Action 2 is not blocked during the reload.

**Failure / exploit**
- On the server, remote clients always reload in 1.6 s, whatever the weapon's RixeReloadTime (including the x1.15 extended magazine). The host uses the weapon timer.
- A forged Action 6 with a partly empty magazine also refills after 1.6 s.
- Reload then swap: the weapon swapped to gets refilled instead.
- Two refill paths with different timing run in parallel (double event, idempotent in effect).
- Correction from the verifiers: in the export, Action 6 is sent only from the client's auto-reload. IA_Reload's body is empty in the export, so "manual R reload" means a forged or hidden call.
- Per-weapon reload times are class defaults that were not exported.

**Smallest fix.** Have Action 6 call the server weapon's RixeReload on the current weapon (after the alive and match checks) and delete the Delay/refill block. Capture the weapon reference. Cancel the reload on swap, or block the swap while reloading.

**Test**
- PIE with a weapon whose RixeReloadTime is above 1.6 s: log the server refill time.
- Reload then swap: the swapped-to weapon must not be refilled.
- Packaged: same.

### M3. Weapon swap as a toggle counter

**Evidence**
- `(elif (== Action 2) (|SetwithNotifySwapCountRep (+ (Class|BPShooterCharacter|GetSwapCountRep _asbp_shooter_character) 1) ...))`.
- OnRep_SwapCountRep: `(if (not (Pawn|IsLocallyControlled)) (CallFunction|RepSwap))`.
- RepSwap selects the next index and never reads the counter.
- No cooldown, no dead check, no reload check.

**Failure**
- Two swaps within one net update give a single OnRep on proxies, so they show the wrong weapon.
- A pawn that joins late or re-enters relevancy toggles once whatever the parity.
- A server-only RixeBuildLoadout resets the server to the primary.
- Proxy cosmetic fire uses the wrong weapon. Swaps take zero equip time.

**Smallest fix.** Use a replicated absolute CurrentWeaponIndex (RepNotify), set on the server after validation (alive, more than one weapon, not reloading, cooldown of about 0.25 s). Clients apply the index.

**Test**
- PIE: client A double-taps swap with 150 ms emulated lag. Client B and the server must show the same weapon.
- Late-join client C must see the correct weapon.
- Packaged: 2 machines.

### M4. Friendly fire decided from stale RixeTeamRep (merged from 3 reports)

**Evidence**
- RixeFriendly: `(and (Math|Byte|Equal(Byte) (Class|BPFirstPersonCharacter|GetRixeTeamRep _asbp_first_person_character) (Class|BPFirstPersonCharacter|GetRixeTeamRep _asbp_first_person_character_1)) (> (... GetRixeHPFrac ...) 0.0))`.
- ProcessHit: `(if _friendly _ (elif (Networking|IsServer) (CallFunction|RixeApplyHit ...)))`.
- RixeTeamRep is set only in RixeSetHP. That runs from BeginPlay via `(|SetwithNotifyCurrentHP (Variables|Default|GetMaxHP))`, then OnRep_CurrentHP, then `RixeSetHP ... (GetTeamByte)`. This happens inside SpawnActor, before `Pawn|Possess` and EventOnPossess `SetTeam`.
- OnRep_TeamByte only calls ApplyTeamColor.
- The value is corrected only by SyncPawns (1 s timer, only if Enabled) or an HP change.

**Failure**
- A newly spawned team-1 human carries team 0 for up to about 1 s. Enemy shots do no damage to them, they cannot damage enemies, and teammates can damage them.
- Blocked hits never reach RixeApplyHit, so the stale value never corrects itself.
- If no director is present, or Enabled is false, this lasts the whole life (inferred: whether the director is placed is not visible in the export).
- No cheat is needed.

**Smallest fix.** In RixeFriendly, compare the authoritative TeamByte through BPITeammate/TeamByte casts. Also call RixeSetHP from EventSetTeam on authority. Treat an unresolved team as friendly (this also fixes L6).

**Test**
- PIE with the bot director disabled: a team-0 client shoots a newly respawned team-1 client within 1 s. Damage must apply.
- A team-1 teammate shot must not apply.
- Repeat with the director enabled.
- Packaged: same.

### M5. No freeze after victory

**Evidence**
- bMatchOver is read only in CheckScore (`(if (not (|GetbMatchOver)) ...`).
- EventIncrementTeamScore does `Map|Add TeamScores TeamByte (+ ... 1)` and then SetRedScore/SetBlueScore with no state check.
- Die and OnDestroyed_Event have no state check.

**Failure**
- After WinningTeam is set, scores keep changing and pawns keep respawning. The losing team can pass the limit too, so the final state is inconsistent.
- (H2 was refuted at runtime: the restart does happen about 6 s after either victory, so this window lasts about 6 s.)

**Smallest fix.** Add a replicated match phase (or WinningTeam != 0) in BP_RixeGameState. Check it on the server in EventIncrementTeamScore, in the respawn path and in ServerRixeAction.

**Test.** PIE: force a victory, keep bots fighting for 6 s, and verify RedScore and BlueScore are frozen and nothing respawns. Packaged: same.

### M6. Weapons and projectiles spawned on every machine; double loadout build

**Evidence**
- EventBeginPlay calls `(CallFunction|RixeBuildLoadout)` with no authority gate. OnRep_RixeLoadout calls it again.
- RixeSpawnWeapon `(Game|SpawnActorBPRixeAR ...)` has no gate.
- NPC BeginPlay: `(Game|SpawnActor (Variables|Weapon|GetWeaponClass) ...)`.
- `Owned Weapons : None`, `Current Weapon : None`.
- RixeFire spawns the projectile and decrements CurrentBullets on any machine.
- The default "0,6,0,0,0,0" loadout is built, destroyed and rebuilt, so ActivateWeapon runs twice.

**Failure**
- Two ammo sources feed the client HUD (touch path and RixeSetupVisual).
- Proxies compute tracers from local aim and spread.
- If the weapon class replicates (inferred from Current Bullets reaching the client), there are likely duplicate meshes.
- Damage is unaffected because it is gated on the server.
- One verifier noted this per-machine design may be an intended cosmetic-proxy design. Even so, the ammo and swap state can diverge.

**Smallest fix.**
- Spawn weapons only on authority, as replicated actors owned by the pawn, with replicated OwnedWeapons and CurrentWeapon. Build once on the server.
- Wrap the RixeFire spawn and the ammo decrement in HasAuthority. Proxies play cosmetics from a server shot event (see L1).
- Larger refactor: do it after the small items.

**Test.**
- PIE: count BP_Rixe* actors per pawn on each client (World Outliner or a debug log) and check that it is exactly 2.
- The client HUD ammo must equal the server value.
- Packaged: same.

### M7. Authoritative shot re-simulated from components with independent spread

**Evidence**
- Get Weapon Target Location: `(Collision|LineTraceByChannel (GetWorldLocation (GetFirstPersonCamera)) (+ ... (GetForwardVector (GetFirstPersonCamera)) 10000))`.
- RixeSpawnXf: `(GetSocketLocation (|GetFP_Weapon) "Muzzle")` and `RandomUnitVectorInConeInDegrees` with no seed, once per pellet.
- RixeAdsTick runs only `(if (Pawn|IsLocallyControlled) ...)`.
- The RPC carries only `(Action Text)`. There is no lag compensation.

**Failure**
- The shooter's cosmetic projectile and the server projectile diverge, most visibly on shotgun pellets. The player sees a hit and gets no damage, or the reverse.
- Remote clients must lead targets by their ping, while the host does not (fairness issue).
- Inferred and needs a runtime test: on the server, the camera of a remote pawn may lack pitch, because UCameraComponent applies control rotation only in GetCameraView. If so, remote clients would miss targets well above or below them. That would raise this finding's severity.
- Not a trust hole.

**Smallest fix.** Build the server shot from GetBaseAimRotation and the eye viewpoint, and use the muzzle only for cosmetics. Later: send origin, direction and a seed in the fire RPC and validate them against tolerances.

**Test.**
- PIE: a remote client shoots a target about 5 m above and below eye level. Log the server trace start and direction against the client's.
- Shotgun at 10 m: compare pellet hits on client and server.
- Packaged: 2 machines.

### M8. Opposite PlayerStart tags for humans and bots: REFUTED at runtime (SUIVI section 13)

**Evidence**
- ChoosePlayerStart and OnDestroyed_Event use `(select _team_byte "BLUE" "RED")` (byte-indexed).
- SpawnBot uses `(select (Math|Byte|Equal(Byte) Team 0) "RED" "BLUE")` (bool select, true option first, consistent elsewhere in the export).
- Team-0 tint is red.
- The GameMode maps SetBlueScore to GetTeamScore 0.

**Failure.**
- Team-0 humans (painted red) spawn at BLUE starts while team-0 bots spawn at RED starts, so humans spawn among enemy bots.
- The order of options in a byte select is inferred. Either way, the tint and score labels disagree.

**Smallest fix.** One helper, GetSpawnTagForTeam, used in all three places, with one agreed mapping applied to the tint, tags and score labels.

**Test.** PIE: log the team, tag and spawn location for humans and bots on both teams and check they agree. Packaged: visual check.

### M9. Team assignment by PlayerArray index parity

**Evidence**
- `(Class|BPITeammate|SetTeam Player (... (Math|Integer|%(Integer) (Utilities|Array|FindItem (GetPlayerArray ...) (GetPlayerState Player)) 2)))` runs inside ChoosePlayerStart.
- `(event Game|EventOnPostLogin (NewPlayer))` is empty.

**Failure.**
- A disconnect shifts the array, so later joiners get unbalanced teams (for example 3 humans vs 0). Players can stack teams by reconnecting.
- The FindItem returning -1 case was judged unlikely by the verifiers.

**Smallest fix.** Assign the team once in OnPostLogin or HandleStartingNewPlayer, on the smaller human team (CountHumans already exists). ChoosePlayerStart only reads the team.

**Test.** PIE with 3 clients: B disconnects, D joins, and teams must be 2 vs 2. Packaged: same if 4 instances are available.

### S1. ServerRixeAction: no whitelist, rate limit, state check or payload limit (merged 3)

**Evidence**
- The only throttle: `(if (> _returnvalue (+ (Variables|Default|GetLastChatTime) 0.5))`, for Action 3 only.
- Any value above 3 other than 6 goes to RixeServerAction2.
- Text is truncated only for Action 3 (`Left Text 100`) and Action 9 (`Left Text 40`).
- `(fn RixeActionSig (Action Text))` is empty.
- GetControlledPawn and the cast are used without IsValid.

**Impact.**
- Spec 5 RPC limits (frequency, size, parameters, state) are not met. Spam costs server CPU and causes Accessed None errors.
- Fire rate itself stays capped by RefireRate, and Action 6 spam is absorbed by the Delay.
- Unknown codes are harmless, which is why one verifier rated this low.

**Smallest fix.** Switch on Action 0..9 with a Default that returns. Drop Text except for actions 3 and 9. Add a per-controller token bucket plus cooldowns for actions 2, 6 and 9. Check IsValid on the pawn. Implement RixeActionSig as this validator.

**Test.** PIE: a debug command floods ServerRixeAction with out-of-range codes and long text. The server must drop the calls with a counter in the log, with no Accessed None errors. Packaged: same.

### S2. Death does not stop weapons on proxies; NPCs may fire after death

**Evidence**
- The character's Die (which also runs on clients through `OnRep_bDeadRep`) has no StopFiring and does not clear bFiringRep.
- The NPC's Die has no StopShooting. BP_ShooterAIController OnDeath runs `(AI|Logic|StopLogic ...) (Pawn|UnPossess) (Actor|DestroyActor)`.
- Weapon Fire loops while `GetIsFiring`.

**Failure.**
- Proxies show shots from ragdolls until the magazine empties or the actor is destroyed after 5 s (cosmetic).
- Dead bots may fire real projectiles for the rest of their magazine. This holds only if the StateTree exit task does not call StopShooting; the StateTree was not exported.

**Smallest fix.** In both Die graphs, call StopFiring/StopShooting on every machine, and on authority clear bFiringRep and bShootingRep.

**Test.**
- PIE: kill a player and a bot while they hold fire. Client B must see no shots after death.
- The server log must show no projectile spawn from a dead instigator.

### S3. No killer attribution in scoring

**Evidence.**
- `(Class|BPIShooter|IncrementTeamScore (Game|GetGameMode) (Variables|Default|GetTeamByte))` uses the victim's team.
- AnyDamage receives `InstigatedBy DamageCauser` but never uses them.
- ProcessHit allows self-damage when `GetDamageOwner` is set.

**Failure.**
- A suicide or team kill gives the enemy a point, and kills cannot be credited to individual players.
- Not exploitable for self-gain.
- Whether the grenade's DamageOwner default is set was not exported.
- The spec requires an explicit rule for suicides (the owner must decide it).
- Bots scoring the same as players was judged a product decision, not a defect.

**Smallest fix.** Pass InstigatedBy to Die and credit the killer's team only when it differs from the victim's, applying the owner's suicide/team-kill rule.

**Test.** PIE: self-grenade, team kill and enemy kill, then check the score delta for each against the approved rule.

### S4. Respawn bypasses GameMode

**Evidence**
- `(Game|AssignOnDestroyed PossessedPawn (AddEvent|Custom|OnDestroyed_Event))`.
- `GetAllActorsOfClassWithTag ... (select ... "BLUE" "RED")`, then `SpawnActorBPShooterCharacter ... (RandomArrayItem _outactors)) "Undefined"`, then `(Pawn|Possess _returnvalue)`.
- No IsValid, no fallback (ChoosePlayerStart has one), no match-state check.

**Failure.**
- With no tagged start, the pawn spawns at the origin.
- A failed spawn possesses null, leaving the player with no pawn and no retry. This depends on the class default spawn collision handling.
- Logout may spawn an orphan pawn (inferred).
- Players respawn after victory.
- Server-only, so not client-exploitable.

**Smallest fix.** The handler calls a server-only GameMode RequestRespawn(PC). It checks that the PC is valid and not logging out and that the match is running, then uses ChoosePlayerStart with its fallback and retries on failure.

**Test.**
- PIE on a map without tagged starts.
- Client disconnects while dead: the server must hold no orphan BP_ShooterCharacter.
- Kill a player after victory: no respawn.

### S5. RixeTarget hits unreachable

**Evidence.**
- ProcessHit: `(bind _ascharacter (Utilities|Casting|CastToCharacter Hit Actor) (:then ... RixeApplyHit ...) (:CastFailed))`.
- BP_RixeTarget's parent is `/Script/Engine.Actor`, so the `CastToBP_RixeTarget` branch in RixeApplyHit is dead code.
- `RixeHP : None`, `RixeDown : None`, and there is no Multicast.

**Failure.** Range targets never react on any machine. Once the cast is fixed, only the host would see the result. No security impact.

**Smallest fix.** Route non-Character hits to RixeApplyHit, and make RixeHP/RixeDown RepNotify.

**Test.** PIE on Lvl_RixeRange: both the host and a client hit a target, and all machines show the damage number and knockdown.

### S6. Stale server ADS/sprint state across respawn

**Evidence.**
- `RixeSprintSrv : None` and `RixeAdsSrv : None` live on the PC and are written only in RixeSpeedFromAction. They are never reset in Die, OnDestroyed_Event or EventOnPossess.
- RixeIsAds: `(or (|GetbRixeADS ...) (... GetRixeAdsSrv ...))`.

**Failure.**
- Dying while aiming means the respawned pawn gets ADS spread on hip fire, and a mismatched speed causes rubber-banding until the next ADS cycle.
- It heals itself on the next aim press. The sprint half is not shown in the export (the IA_Sprint body is empty).

**Smallest fix.** Reset both flags in EventOnPossess and in Die, call RixeApplySpeed, and use only the server flag in RixeIsAds.

**Test.** PIE: aim, get killed while holding aim, respawn, hip-fire. The server log of `_ads` must be false.

### S7. Speed state outside CharacterMovement prediction

**Evidence.**
- RixeSendAds: `(CallFunction|RixeApplySpeed)` locally, then `ServerRixeAction ... (select (|GetbRixeADS) 7 8)`.
- `RixeSprinting : None`.

**Failure.**
- Corrections and stutter around ADS or sprint toggles under latency or packet reordering. The verifiers disagreed on how frequent this is.
- If the RPC is unreliable (not exported), the server can be stuck on the wrong speed until the next toggle.

**Smallest fix.** Mark the RPC Reliable and replicate the accepted state back to the owner. The proper fix (a CMC saved-move flag) needs C++ and owner approval.

**Test.** PIE at 120 ms with 1% loss: toggle ADS repeatedly while moving and count `ClientAdjustPosition` in the net logs. Packaged: 2 machines.

### S8. Recoil may be host-only (disputed)

**Evidence.**
- RixeFire: `(Class|BPShooterNPC|AddWeaponRecoil _returnvalue (* (GetFiringRecoil) (select _ads 0.7 1.0)))`.
- EventAddWeaponRecoil: `(Pawn|Input|AddControllerPitchInput Recoil)`. On the server this has no effect for remote controllers (engine behaviour, inferred).

**Dispute.** The IA_Shoot body is empty in the export. If mouse fire also runs StartFiring locally, as the touch path does, recoil applies on the client and the asymmetry disappears. UNREAL.md suggests the server fires on the client's behalf.

**Smallest fix.** Apply recoil as a server-side aim offset, and send the visual kick to the owner.

**Test.** PIE: a remote client and the host each fire 30 rounds full-auto at a wall and the spray patterns are compared.

### L1–L18 (low)

**L1. bFiringRep is a level flag.**
- Evidence: `(|SetwithNotifybFiringRep (and (== Action 1) ...))`.
- A tap within one net update, or Action 1 re-sent without Action 0, fires on the server but proxies never see it.
- Correction from the verifiers: reload and swap do reset the flag (Action 6 sets it false, and release sends 0).
- Fix: a server-incremented shot counter or an unreliable multicast from RixeFire.
- Test: PIE at 100 ms, rapid taps, and client B's shot count must equal the server's.

**L2. ADS from client flags with no server ADS time** (merged 3).
- Evidence: `SetRixeAdsSrv (select (== Action 7) true ...)`; RixeSpawnXf `(select _ads (GetRixeAdsSpreadMul) 1.0)`.
- Effect: instant ADS accuracy, available to honest players by tapping aim too. Design gap: spec mentions "temps de visée".
- Fix: a server ADS timestamp or alpha. Owner to decide on quickscoping.
- Test: PIE, send 7 then fire at once, and log the spread multiplier.

**L3. No `CurrentBullets > 0` check in RixeFire.**
- Evidence: `(if (not (Variables|Default|GetRixeReloading))`. Fire always runs `SetTimeOfLastShot` and `(AI|MakeNoise ...)`.
- Effect: phantom noise on a re-press during reload. A magazine size of 0 allows a free shot (configuration risk only).
- Fix: check ammo and reload state first, and clamp MagSize to at least 1.
- Test: PIE, press fire during reload, and confirm no MakeNoise in the log.

**L4. Explosion uses the blast centre as hit location.**
- Evidence: `(CallFunction|ProcessHit _returnvalue _array_element (Transformation|GetActorLocation) ...)`; SphereOverlap with no line-of-sight trace.
- Effect: head multiplier on every victim, falloff by grenade travel distance, flat damage across the radius, damage through walls. Part of this depends on defaults; the grenade may be unused in the RIXE roster.
- Fix: per-victim hit location, no head check for radial damage, radial falloff, visibility trace.
- Test: PIE, grenade behind a wall and at the edge of the radius.

**L5. Corpse hits re-send kill hitmarkers** (merged 2).
- Evidence: `(CallFunction|RixeHitmarker (select (<= _current_hp_1 0.0) 3 (select _head 2 1)))` with no alive check; ragdoll stays for 5 s (character) or 10 s (NPC).
- Fix: early return when the target is dead; send Kind 3 only on the HP transition from above 0 to 0 or below.
- Test: PIE, shoot a corpse, and RixeHitSeq must not increment.

**L6. RixeFriendly fails open.**
- Evidence: `(:CastFailed (return false))` on the instigator and on the hit actor.
- Effect: a removed bot's in-flight projectiles (RemoveOneBot) or a disconnected player's grenade can damage teammates.
- Fix: cache the shooter's team on the projectile at spawn; treat an unknown team as friendly. Folds into M4.

**L7. Damage receivers unguarded.**
- Evidence: `(|SetwithNotifyCurrentHP (- (GetCurrentHP) Damage))`, with no clamp and no team or InstigatedBy use.
- Effect: defence-in-depth only. The engine ShouldTakeDamage already blocks most client cases.
- Fix: ignore damage at or below 0 or not finite, and clamp HP to [0, MaxHP].

**L8. Victory polled with Red precedence.**
- Evidence: `SetTimerbyFunctionName 0 "CheckScore" 0.5 true`; `(if _returnvalue <Red> (else <Blue>))`.
- Fix: check victory synchronously in EventIncrementTeamScore.

**L9. CheckScore timer not authority-gated.**
- Evidence: `(event EventBeginPlay (Utilities|Time|SetTimerbyFunctionName 0 "CheckScore" 0.5 true))`.
- Effect: inert on clients today only because GetGameMode is null there.
- Fix: HasAuthority gate, and clamp ScoreLimit to at least 1.

**L10. Client BeginPlay overwrites replicated HP** (merged 2).
- Evidence: `(event EventBeginPlay (|Parent:BeginPlay) (|SetwithNotifyCurrentHP (Variables|Default|GetMaxHP)) ...)`; OnRep_CurrentHP calls RixeSetHP, which sets RixeHPFrac on the client.
- Effect: a late-joining client shows full health on a pawn that is already damaged. Cosmetic.
- Fix: gate the HP initialisation on authority; the OnRep only updates the UI.
- Test: PIE, client C joins after a player is damaged.

**L11. Bot director counts corpses.**
- Evidence: `(bind _count_1 (CallFunction|CountBots _returnvalue))` with AliveOnly false; NPC `Delay 10.000000`.
- Effect: a team plays one bot short for about 10 s. The controller-mismatch claim in RemoveOneBot was not supported (likely an export artefact).
- Fix: AliveOnly = true, plus an explicit bot respawn delay.

**L12. Chat.**
- Evidence: `(Append (Append (PlayerState|GetPlayerName ...) " : ") (Left Text 100))`; the name comes from client `setname`; the log keeps 8 lines.
- Effect: the honest client replaces spaces with "_", but a modified client can spoof lines. One player can flush the log.
- Fix: server-side name validation, message sanitising, burst limit.

**L13. Sprint from unvalidated codes.**
- Evidence: RixeSpeedFromAction plus RixeApplySpeed with no firing, reload or direction check. The speed is a fixed hardcoded value (no speed hack).
- Sprint rules (exclusive with firing, forward-only) need owner confirmation. Spec line 1350 lets sprint interrupt a reload.

**L14. No speed or teleport validation.**
- Evidence: no `[/Script/Engine.GameNetworkManager]` section in Config; no Blueprint movement checks.
- Effect: a time-dilation speed hack is possible (engine default `bMovementTimeDiscrepancyDetection` is false).
- Fix: enable `bMovementTimeDiscrepancyDetection`, `...Resolution` and `...ForceCorrectionsDuringResolution`.
- Test: packaged build only, ideally with a timestamp-manipulation tool in a test environment.

**L15. GetTeam constant.**
- Evidence: `(fn GetTeam () (return 0))` on BP_ShooterCharacter; the AI controller sets a per-class TeamTag.
- Effect: no current caller uses it on pawns. Latent trap.
- Fix: return TeamByte.

**L16. servertravel fire-and-forget.**
- Evidence: `(Development|ExecuteConsoleCommand (Append "servertravel " (Game|GetCurrentLevelName true)))`.
- Hardening only; one verifier refuted it.
- Fix: GameMode ServerTravel/RestartGame, with logging.

**L17. Character Die not authority-gated, no DoOnce.**
- Evidence: `(if (Networking|HasAuthority) (|SetwithNotifybDeadRep true)) (Class|BPIShooter|IncrementTeamScore ...)`.
- Currently protected by the HP > 0 check in AnyDamage. Latent only; one verifier refuted it.
- Fix: move the score call inside the authority branch and return early on bDeadRep.

**L18. Clients call CreateSession.**
- Evidence: `(if (Pawn|IsLocalPlayerController) ... SetTimerbyFunctionName "RixeVoiceSession" 0.5)`, then `(Online|Session|CreateSession self 8 true)`.
- With the Null OSS and no session browser this may be a deliberate voice workaround (one verifier refuted it).
- Fix if a browser is ever added: create sessions on the host only.

## 4. Already correctly server-authoritative

- **Damage is applied only on the server.** ProcessHit calls RixeApplyHit only under `(Networking|IsServer)`. The only ApplyDamage call is in RixeApplyHit. No RPC carries a hit, damage, kill or score.
- **The server computes aim and spread.** The client sends no origin, direction or target (see the accuracy caveats in M7).
- **Fire rate is enforced on the server per weapon instance.** StartFiring checks `GetGameTimeInSeconds - TimeOfLastShot > RefireRate`, and Fire re-arms the timer. Spamming Action 1/0 cannot exceed the rate. Exceptions: M1 and swaps.
- **Ammo is tracked on the server.** RixeFire decrements ammo. At 0 it calls RixeReload, which blocks firing until RixeReloadDone. Action 1 is refused while the controller's RixeReloading is set.
- **Weapon stats come from the server's own weapon instance.** Damage, head multiplier, falloff, spread, pellets and magazine are not replicated variables. The loadout text is truncated to 40 characters, the primary clamped to 0..5, the secondary to 6..7, the skin to 0..6, and attachments masked with RixeAllowedAttach.
- **No double hits:**
  - Projectile EventHit is wrapped in DoOnce and collision is disabled.
  - Explosion victims are deduplicated through ExplosionDamagedActors.
  - EventAnyDamage is guarded by HP > 0.
  - NPC Die is wrapped in DoOnce.
  - OnRep_bDeadRep runs Die only on non-authority.
  - bDeadRep is set only on authority.
- **Score storage is server-only.** Scores live in the GameMode and are mirrored to the replicated GameState (RedScore, BlueScore, WinningTeam). Clients cannot reach IncrementTeamScore because GetGameMode is null on clients.
- **Team assignment and SetTeam are server-side.** There is no client team RPC. Respawn and spawn-point choice are server-only (the binding is made in OnPossess).
- **Bots run on the server only.** BP_RixeBotDirector and the NPC spawner are HasAuthority-gated, and bot removal awards no score. NPC fire is driven by the server through bShootingRep/AimTargetRep.
- **Hitmarkers are decided on the server.** RixeHitKind/RixeHitSeq are set on the instigator's PC and rendered only if IsLocalPlayerController.
- **No double fire for the host.** The host's own pawn skips the OnRep fire path, and RixeReload sends Action 6 only when IsLocallyControlled and not HasAuthority.
- **Movement speed is bounded.** It is always one of 420, 600 or 900 times a class-default RixeMoveMul that the client cannot change, and ADS overrides sprint. Death disables movement. No Blueprint teleport or SetActorLocation exists on player pawns.
- **Chat limits.** Rate-limited to 0.5 s, 100 characters per message, ChatLog capped at 8 lines and written by the server only.
- **Single RPC entry point.** ServerRixeAction is the only client-to-server entry point in the export. RixeServerAction2, RixeApplyLoadoutTo and RixeSpeedFromAction are plain functions.
- **Verify in the editor:** Custom|ProcessHit must be Not Replicated. If it were Run on Server, a client could submit arbitrary hits.

## 5. Refuted items

- **setdamage-node-class-mismatch.** The "AbilitySystemTestAttributeSet" label is an exporter artefact that resolves the setter by name. A real target mismatch would not compile, and the Phase 0-1 build compiled.
- **menu-state-not-server-known.** No spec rule forbids combat while a menu is open. The menu flag is a client claim, so a server copy would protect nothing.
- **sprint-client-prediction-missing.** The export drops all Enhanced Input bodies. The absence of Action 4/5 senders is not evidence, and the server side is consistent.
- **crouch-not-visible.** Same exporter gap. Engine Crouch uses MaxWalkSpeedCrouched, and no authority impact was shown.
- **H2 and M8 (refuted after the audit).** H2: packaged-build logs show restarts after Blue victories (see H2). M8: runtime and engine-source checks show the team, colour and PlayerStart tag mappings agree (SUIVI section 13).
- **npc-team-not-repnotify.** TeamByte is set in the spawn frame and ships in the initial bunch before client BeginPlay. No code changes a bot's team later. Cosmetic robustness only.

## 6. Proposed fix order (small, independent, each testable on its own)

1. ~~**H2:** move the RestartMatch timer after the Red/Blue branch.~~ Not needed: refuted at runtime.
2. **Done** (SUIVI sections 10–11, code `5d7b18e` / `b3ccb4e`, PRs #26/#27). **H1 (core):**
   - Guard in ServerRixeAction: pawn valid, not dead, match not over.
   - Die on authority clears bFiringRep and calls StopFiring.
   - StopFiring/StopShooting in both Die graphs on every machine (also covers S2).
3. **Done** (SUIVI section 12, code `bdce5e2`). **M4 + L6:** RixeFriendly uses the authoritative TeamByte, cached on the projectile, and an unknown team counts as friendly. RixeSetHP is called from EventSetTeam.
4. **Refuted, no change needed** (SUIVI section 13). ~~**M8:** a single GetSpawnTagForTeam helper; the owner confirms team 0 = RED or BLUE across tint, tags and score labels.~~
5. **Done** (SUIVI section 14, code `29780b3`, PR #30). **M1:** Action 9 at most once per life, unchanged string is a no-op, cooldown on the range level.
6. **Done** (SUIVI section 15, code `38f298e`, PR #31). **M2:** Action 6 calls the server weapon's RixeReload; remove the 1.6 s Delay block; cancel the reload on swap.
7. **Done** (SUIVI section 16, code `4f509b1`, PR #32). **M5 + L8:** replicated match phase; gate scoring and respawn; check victory synchronously.
8. **S1 done** (SUIVI section 17, code `af521de`); **L13 open**, waiting for the owner sprint decisions. **S1 (+ L13):** action whitelist, per-action token bucket and cooldowns, Text only for actions 3 and 9, IsValid on the pawn; implement RixeActionSig.
9. **M3:** replicated absolute weapon index plus a server swap cooldown.
10. **S6 + L2:** reset ADS/sprint flags on possess and in Die; single ADS source. Server ADS timing waits for the owner's decision on aim time.
11. **M9 (+ L15):** assign teams once in OnPostLogin onto the smaller team; GetTeam returns TeamByte.
12. **S4:** respawn through a GameMode RequestRespawn with fallback, validity checks and retry.
13. **S3:** killer attribution in Die/IncrementTeamScore. Needs the owner's suicide and team-kill rule.
14. **L1 + M6 + M7:** server-driven shot event; authority-only weapon spawning; server aim from GetBaseAimRotation. This is the larger refactor and needs a 2-client trace test first.
15. **L14:** GameNetworkManager movement discrepancy settings in DefaultGame.ini. Only after the uncommitted Config changes are reviewed and committed separately.
16. **The rest:** S5, S7, S8 (runtime check first), L3, L4, L5, L7, L9, L10, L11, L12, L16, L17, L18.

**Decisions needed from the owner (scope):**
- Suicide and team-kill scoring.
- Sprint/fire exclusivity and forward-only sprint.
- ADS time and quickscoping.
- Bot respawn delay.
- Any C++ CharacterMovement work (S7).

## 7. Limits of this audit

- **Static reading only.** This was a static reading of the Blueprint DSL export at `C:\Users\lulu\AppData\Local\Claude-Data\claude_pzs8sxrjxfjjc\side-session-notes\local_12f5efb6-0ef7-45d3-b127-b4f4caef5b19\bp-dsl`. Nothing was run in PIE, in a packaged build, or online. Every behaviour above is **not verified** at runtime.
- **RPC flags not exported.** Run on Server, Multicast, Owning Client and Reliable are all missing from the export. ServerRixeAction being Run on Server is inferred from its call sites, and its reliability is unknown.
- **Exporter gaps:**
  - Enhanced Input event bodies (IA_Shoot, IA_Aim, IA_Sprint, IA_Reload, crouch) are empty.
  - Class defaults are missing: reload times, magazine sizes, RixeHeadMul/RixeRange, DamageOwner, TimeOfLastShot, TeamByte defaults, spawn collision handling.
  - Actor replication settings (bReplicates) are missing.
  - StateTree tasks, widgets, collision profiles and level placement (whether BotDirector is present and Enabled, which PlayerStart tags exist) are missing.
  - Some node labels are mislabelled by the exporter, for example `(ToolMenus|Get)` and `Class|BPShooterNPC` on player targets.
- **Inferred engine behaviour:**
  - Set w/ Notify calls the OnRep on the server.
  - BeginPlay runs before Possess.
  - Initial replication is applied before client BeginPlay.
  - CameraComponent pitch handling on the server.
  - AddControllerPitchInput requires a local controller.
  - Non-seamless travel.
- **Sources not reviewed in full.** C++ sources in `RixeSource/` (untracked) and the uncommitted Config/.uproject changes in the working tree were not reviewed in full.
- **Severities.** Severities come from two verifier votes per finding. Where the votes split, both are shown and the finding is ranked by the higher one.
