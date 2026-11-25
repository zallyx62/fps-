# RIXE — Gameplay decision record: ADS, scoring, sprint, respawn (25 November 2026)

**Owner direction (25 Nov 2026, in the Claude Code session):** the four pending Phase 2 decisions (ADS time and quickscoping, suicide and team-kill scoring, sprint rules, bot respawn delay) are to be based on **XDefiant, Call of Duty and Apex Legends**.

**How this record was produced:** four research agents (one per decision) collected sourced figures from patch notes, wikis and data sites; a second agent independently re-checked each claim; a final agent wrote the rules below. Only claims confirmed or corrected by the checker are cited as reference facts; every other number is labelled *RIXE choice* (a tuning value, not a fact from a reference game). The owner's open questions at the end were answered by Claude under the owner's delegation and can be changed by the owner at any time.

**Status:** approved direction, values provisional. Nothing below is implemented yet; each rule is implemented later as its own audit item (L2, L13, S3, bot respawn) with its own tests. These rules do not change the specification's phases, priorities or scope; they fill the decisions the Phase 2 audit (`AUDIT_PHASE2_COMBAT_AUTHORITY.md`, section 6) was waiting for. Friendly fire stays **off** in standard official modes (specification section 34.2); the team-kill rules only apply to modes that explicitly enable friendly fire.

**Licensing note:** these are gameplay rules and numbers used as references, as the specification already allows (section on weapon references, around line 2630). No asset, code, interface or text from these games is reused.

---

## 1. ADS (aim down sights)

**Rule**
- ADS becomes a progress value from 0 to 1. It starts when the server receives the ADS request.
- ADS times per class, all *RIXE choice*:

  | Class | Time to full ADS |
  |---|---|
  | Pistol | 180 ms |
  | SMG | 190 ms |
  | Shotgun | 220 ms |
  | AR | 270 ms |
  | Marksman | 350 ms |
  | LMG | 450 ms |
  | Sniper | 450 ms |

- Zoom-out takes 0.85 × the ADS time (*RIXE choice*).
- Spread and movement speed (600 to 420 cm/s) follow the progress value (*RIXE choice*).
- Snipers need an extra 100 ms "focus" time after full ADS before they reach full accuracy (*RIXE choice*).
- When an enemy hits you while you aim, your view is pushed off target (flinch), and the effect builds with each hit.
- Pressing ADS while sprinting ends the sprint.

**References**
- XDefiant ADS times: SMG 170–185 ms, M4A1 267 ms, SVD 350 ms, M44 400 ms, M60 525 ms, TAC-50 625 ms.
- Apex ADS times: Wingman 0.18 s, SMG 0.22 s, AR 0.27 s, marksman/sniper 0.30–0.34 s, LMG 0.34 s.
- XDefiant patch Y1S1.4 (14 Aug 2024) defines a sniper "spread reduction duration": the time to reach full accuracy after entering ADS.
- XDefiant patch Y1S0.3 (12 Jun 2024) made flinch build up across hits.

**Not adopted**
- The instant on/off ADS flag.
- Client-supplied timestamps.
- The BO6 idle-sway delay.
- Attachment modifiers. They come later, through the weapon data table.
- Citing CoD or Apex as the source for blending spread during zoom-in. Neither documents that behaviour.

**Implementation**
- Server RPC `Server_StartADS` stores `GameState.GetServerWorldTimeSeconds` and replicates `ADSStartTime` and `bAiming`.
- On each shot, the server calculates spread from the time it receives the fire request.
- ADS time, hip spread, ADS spread and focus time are columns in the weapon data table.
- Bots go through the same path. Their ADS state resets on possess and on pawn loss, like the S6 work.

---

## 2. Scoring (TDM)

**Rule**
- A team point is scored only when an enemy kills you.
- **Suicide with no enemy damage in the last 5 s** (*RIXE choice*): the player gets +1 death. Team score does not change and there is no personal penalty.
- **Suicide, fall, quit or voluntary team switch with enemy damage in the last 5 s:** the last enemy who damaged the player gets a normal kill and +1 team point.
- **Auto-balance or admin move:** no change to anything.
- **Team kills (friendly-fire modes only):**
  - Nobody scores a point. The killer gets +1 on a team-kill stat.
  - The victim's death does not count in K/D.
  - From the 2nd team kill, damage to teammates reflects back to the shooter.
  - On the 3rd team kill, the player is removed from the match.
  - Bots are never removed.

**References**
- MWIII TDM guide: every death from an enemy player gives the enemy team a point.
- Apex Season 12 (Feb 2022): quitting no longer denies the kill. It goes to the last enemy damager, if one is marked.
- CoD WWII patch 1.07: team-kill deaths stopped counting toward the victim's K/D.
- BOCW League Play (2021): friendly fire turns into ricochet damage after the 2nd team kill.
- BO2/BO3 Hardcore: a player is kicked after 3 team kills.
- XDefiant has no sourced rules on any of this, so this decision rests on CoD and Apex only.

**Not adopted**
- Removing a team point for a suicide.
- The −100 team-kill score penalty, which could not be verified.
- The "team kill in the first 15 s" rule, which could not be verified.
- Host exemption and killstreak exemption from the team-kill kick.
- Killstreaks or medals. Adding them would be a scope change.

**Implementation**
- A component on each player keeps the last enemy damager and the server time of that damage.
- The GameMode decides who gets credit when a player dies.
- Team score is replicated through the GameState.
- Only enemy damage counts toward credit. Damage from a teammate is ignored.

---

## 3. Sprint

**Rule**
- One unlimited sprint. No stamina limit and no tactical sprint.
- Speeds: sprint 900 cm/s, walk 600 cm/s, a ratio of 1.50.
  - The measured speeds are about 5% low (walk 570, ADS walk 399), which suggests a common offset. Measure sprint the same way before retuning anything.
- You cannot fire while sprinting. Pressing fire or ADS ends the sprint on the server, and a sprint-out delay then applies.
- Sprint-out delays per class:

  | Class | Delay | Source |
  |---|---|---|
  | Pistol | 150 ms | *RIXE choice* |
  | SMG | 220 ms | Within BO3's 200–300 ms |
  | Shotgun | 230 ms | *RIXE choice* |
  | AR | 250 ms | *RIXE choice* |
  | Marksman | 400 ms | Matches XDefiant M44 |
  | LMG | 400 ms | *RIXE choice* |
  | Sniper | 600 ms | Within XDefiant's 575–625 ms |

- Sprint is allowed only within ±45° of facing (*RIXE choice*).
- Sprint input during a reload is ignored, and starting a reload ends the sprint (*RIXE choice*).
- Sprint input is ignored while ADS is held (*RIXE choice*).

**References**
- XDefiant has no tactical sprint.
- BO3 has unlimited sprint.
- The MW2019 movement guide says weapons cannot be used while sprinting.
- XDefiant patch Y1S1.2 sprint-out values: M44 400 ms, L115 575 ms, TAC-50 625 ms.
- Apex wiki speeds: walk 5.07 m/s and sprint 7.59 m/s, a 1.50 ratio.

**Not adopted**
- Tactical sprint and stamina.
- BO6 omnidirectional sprint.
- MW-style reload cancelling.

**Implementation**
- The server sets `MaxWalkSpeed` from its own sprint and ADS state.
- The server checks the ±45° limit against the actual velocity, not against client input.
- The server stores a sprint-out end time and checks it inside fire validation.
- The client predicts the same delay, and the server allows a small tolerance, so shots right after sprinting are not dropped.
- Bots follow the same rules.

---

## 4. Respawn and bots

**Rule**
- When a player dies, the server stores one respawn time.
- Respawn delays (*RIXE choice*): TDM 3.0 s, objective modes 4.0 s.
- Suicide adds +1.0 s.
- Respawn is automatic for humans and bots alike, with no "press to respawn", so neither side gets a timing edge.
- No killcam in v1. A simple death cam only.
- No spawn invulnerability. Spawn points are chosen by distance from and line of sight to enemies.
  - Target for playtests: fewer than 10% of spawns take damage within 3 s (*RIXE choice*).

**References**
- Apex TDM respawns automatically (Revelry patch notes).
- BO2 tuned spawn selection around a "3-second rule", not around invulnerability.
- A CDL 2026 preset lists a 1 s suicide spawn delay. Which mode it applies to is unclear.

**Not adopted**
- The CDL 2.5 s and 5 s delays. These are competitive delays added on top of the normal respawn, not public-match values.
- Press-to-respawn.
- Invulnerability. Apex's invulnerability applies only to Control dropship spawns.
- Killcam. It would be separate scope.

**Implementation**
- The GameMode owns the respawn timer and the override of `ChoosePlayerStart`.
- The bot director must call the same GameMode respawn function, so it cannot bypass the timer or the spawn scoring.
- ADS and sprint state reset on possess (S6).

---

## Answers to the open questions (Claude defaults under the owner's delegation, 25 Nov 2026)

1. **Sniper quickscoping:** keep the 100 ms sniper focus time after full ADS (XDefiant is the main gameplay reference of the specification; its Y1S1.4 patch added a comparable spread-reduction duration). Quickscoping stays possible but is not instant.
2. **Last-damager credit window:** 5 s.
3. **Third team kill (friendly-fire modes only):** remove the player from the match. No friendly-fire mode exists yet, so this has no effect today.
4. **Network disconnect:** not counted as a death; if an enemy damaged the player in the last 5 s, that enemy gets the kill (Apex-style quit credit).
5. **Sprint while aiming:** sprint input is ignored while ADS is held; sprint is allowed within ±45° of facing; starting a reload ends the sprint and sprint input is ignored during a reload. This settles the sprint part of audit item L13.
6. **XDefiant gaps:** where XDefiant data is unknown, Call of Duty and Apex values are used, as the owner named all three games.
7. **Killcam:** not in scope now; recorded as a possible later item, not added to the specification.

## Sources consulted

Source list collected by the research and verification agents (not all are cited above; only checked claims are used as facts):

- https://apexlegends.wiki.gg/wiki/AR
- https://apexlegends.wiki.gg/wiki/Movement
- https://apexlegends.wiki.gg/wiki/Sniper_Stock
- https://apexlegends.wiki.gg/wiki/Standard_Stock
- https://apexlegends.wiki.gg/wiki/TDM
- https://apexlegends.wiki.gg/wiki/Team_Deathmatch
- https://apexlegends.wiki.gg/wiki/Wingman
- https://blog.activision.com/call-of-duty/2019-10/The-Basics-of-Call-of-Duty-Modern-Warfare-Movement
- https://blog.activision.com/call-of-duty/2020-02/Modern-Warfare-Perks-in-Season-Two-How-to-Take-Advantage-of-the-Balance-Changes
- https://callofduty.com/guides/blackops6/training/call-of-duty-guides-black-ops-6-multiplayer-training-movement
- https://callofduty.com/guides/multiplayer-modes/call-of-duty-modern-warfare-iii-play-modes-team-deathmatch
- https://callofduty.fandom.com/wiki/Friendly_Fire
- https://callofduty.fandom.com/wiki/Last_Stand
- https://callofduty.fandom.com/wiki/Last_stand
- https://callofduty.fandom.com/wiki/Medal
- https://callofduty.fandom.com/wiki/Team_Deathmatch
- https://charlieintel.com/call-of-duty-warzone/who-gets-awarded-in-the-kill-credit-in-call-of-duty-warzone-64492
- https://charlieintel.com/xdefiant/xdefiant-1-4-update-patch-notes-335981
- https://charlieintel.com/xdefiant/xdefiant-dev-shares-easy-fix-for-inconsistent-slide-mechanic-326937
- https://charlieintel.com/xdefiant/xdefiant-y1s0-3-patch-notes-328898
- https://devtrackers.gg/black-ops-4/p/f35f8d26-teammate-had-the-most-score-out-of-anyone-in-the-match-with-zero-objective-score-and-damage-here-s-how
- https://dexerto.com/apex-legends/apex-legends-june-29-update-patch-notes-ash-sfx-fix-anonymous-mode-more-2194722
- https://dexerto.com/call-of-duty/black-ops-6-devs-reveal-sprint-assist-setting-that-could-completely-change-movement-2825143
- https://dexerto.com/gaming/xdefiant-july-16-update-patch-notes-spiderbot-glitch-fix-mp5a2-buff-and-speed-hack-removal-2826267
- https://dotesports.com/?p=1252864
- https://dotesports.com/call-of-duty/news/cdl-2026-competitive-settings
- https://dotesports.com/xdefiant/news/xdefiant-assault-rifle-and-lmg-tier-list
- https://esports.gg/news/xdefiant/an-overview-of-xdefiants-recent-update-y1s1-2-patch-notes/
- https://estnn.com/new-glitch-allows-call-of-duty-league-pros-to-bypass-respawn-delay
- https://forums.ea.com/blog/apex-legends-game-info-hub-en/apex-legends%E2%84%A2-ignite-mid-season-patch-notes/9467113
- https://forums.ea.com/discussions/apex-legends-general-discussion-en/reload-while-sprinting/11903205
- https://gameranx.com/updates/id/10642/article/black-ops-2-intelligent-spawn-system-detailed/
- https://gameranx.com/updates/id/13175/article/black-ops-2-explaining-perks-lightweight-and-extreme-conditioning/
- https://gameranx.com/updates/id/28726/article/black-ops-3-multiplayer-mechanics-revealed/
- https://gamesradar.com/how-to-quickscope-modern-warfare-warzone
- https://gamingbolt.com/xdefiant-preseason-patch-notes-confirms-the-return-of-echelon-dedsecs-spiderbot
- https://giantbomb.com/wiki/Concepts/Suicide
- https://insider-gaming.com/call-of-duty-black-ops-6-season-1-weapons-update-details/
- https://insider-gaming.com/modern-warfare-4-beta-movement-changes/
- https://mein-mmo.de/en/cod-mw-warzone-why-you-should-definitely-sprint-with-a-knife-from-now-on,494159
- https://mein-mmo.de/en/the-best-players-in-cod-modern-warfare-do-without-a-sight-but-why,447661
- https://mp1st.com/news/call-of-duty-developer-seeks-balance-between-quickscopers-and-hardscopers
- https://mp1st.com/news/cod-ww2-update-now-live-fixes-ranked-play-issues-adds-mute-all-option-in-hq-more
- https://mp1st.com/news/new-black-ops-2-multiplayer-details-game-modes-challenges-player-card-theater-and-prestige
- https://mp1st.com/news/treyarch-game-design-director-details-black-ops-2-spawn-system-and-the-3-second-rule
- https://mp1st.com/title-updates-and-patches/xdefiant-update-for-october-9-brings-version-1-000-024-for-y1s2-2-nerfs-phantom-faction-significantly
- https://news.ubisoft.com/en-us/article/31yf1DQohKy9tz7ZEV5ip3/xdefiant-season-1-is-out-now---5-major-updates-you-need-to-know
- https://news.ubisoft.com/en-us/article/5SwLIjBC7Uji0RfIhz79p9/xdefiant-everything-you-need-to-know-to-get-started
- https://primagames.com/eguides/call-of-duty-black-ops-iii-eguide/multiplayer/basic-training
- https://redlib.hyperreal.coffee/r/blackops3/comments/78vy7o/a_very_unofficial_guide_to_weapons_smgs
- https://steamcommunity.com/app/202990/discussions/0/34094415952632199
- https://thefilibusterblog.com/disable-killcams-and-kill-effects-in-call-of-duty-black-ops-6/
- https://www.callofduty.com/guides/blackops6/modes/call-of-duty-guides-black-ops-6-multiplayer-mode-team-deathmatch
- https://www.charlieintel.com/apex-legends/how-to-sprintout-cancel-in-apex-legends-to-vastly-reduce-sprint-to-fire-time-201589/
- https://www.charlieintel.com/call-of-duty-warzone/warzone-glitch-breaks-reloading-for-black-ops-cold-war-guns-74338/
- https://www.destructoid.com/all-black-ops-6-season-1-weapon-balance-changes/
- https://www.destructoid.com/xdefiant-y1s0-3-patch-notes-sniper-flinch-and-jump-crouch-penalties/
- https://www.ea.com/able/news/revelry-patch-notes
- https://www.ea.com/ea-originals/news/resurrection-patch-notes
- https://www.ea.com/ea-play/news/ignite-mid-season-patch-notes
- https://www.ea.com/games/apex-legends/news/takeover-patch-notes
- https://www.gamerevolution.com/guides/494517-apex-legends-run-speed-quickest-character-legend-fov-fastest
- https://www.gamesradar.com/apex-legends-is-stopping-quitters-from-denying-their-foes-kills
- https://www.mw4.games/encyclopedia/hardcore/
- https://www.pcgamer.com/games/fps/xdefiant-will-get-team-deathmatch-in-a-couple-weeks-because-we-hassled-them-about-it-lots
- https://www.pcgamer.com/the-new-call-of-duty-update-makes-teamkillers-hurt-themselves
- https://www.ppe.pl/poradniki/343044/xdefiant-podwojny-sprint-i-czolganie-sie-czy-jest.html
- https://www.sportskeeda.com/call-of-duty-game/all-weapon-balance-changes-black-ops-6-season-2
- https://www.sportskeeda.com/call-of-duty-game/warzone-december-10-patch-notes-ranked-play-changes-aiming-idle-sway-changes-weapons-nerf
- https://www.sportskeeda.com/esports/news-xdefiant-launches-fan-favorite-game-mode
- https://www.ubisoft.com/en-us/game/xdefiant/news/6K6cPGfRn3VIKOeNkqqkxa/session-notes-august-26th
- https://www.ubisoft.com/en-us/game/xdefiant/news/dO3vgd719O7U9EvOGRlPe/session-notes-july-22nd
- https://xboxplay.games/black-ops-6/how-to-turn-off-kill-effects-killcams-in-black-ops-6-60975
- https://xdefiant.fandom.com/wiki/Weapon