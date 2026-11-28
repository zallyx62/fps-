# RIXE — third-party notices and licence scope

This file defines the exact scope of the RIXE source-available licence and identifies material governed by other terms. It is a tracking document, not legal advice. See `LICENCE_DISTRIBUTION.md` before redistributing any repository file, build, or asset.

## 1. Original RIXE material under PolyForm Noncommercial 1.0.0

The PolyForm Noncommercial 1.0.0 licence applies only to original material for which the RIXE rights holder owns or controls the necessary rights, including:

- `Content/Rixe/**`, but only after the provenance of each asset is confirmed; exclude every asset incorporating or derived from Epic or third-party material unless the applicable licence permits this exact use.
- `Tools/**` (RIXE-authored generators, validators, and DSL scripts), excluding installed Python packages and third-party components.
- `prototype-web/**`, only to the extent that the code and assets are original and rights-cleared.
- Original root-level Markdown documentation (`/*.md`), including the aggregate cahier des charges.
- `spec/**`, including the section files, index, and order file.

This scope does not claim ownership of Unreal Engine, Epic content, third-party assets, plugins, or third-party dependencies. A file's location inside a RIXE folder does not by itself prove ownership. If provenance is uncertain, treat the file as excluded until checked.

The licence permits noncommercial use, modification, and redistribution under its terms. It does not grant users commercial rights. The rights holder may independently grant a separate commercial licence for rights they actually own. This is source-available, not OSI-approved open source.

## 2. Epic Games and Unreal Engine

Official terms to check at the time of each release:

- Unreal Engine EULA: https://www.unrealengine.com/eula/unreal
- Epic Content License Agreement: https://www.unrealengine.com/eula/content

The repository is based on the Unreal Engine 5.8 "First Person / Arena Shooter" template. The EULA defines "Examples" as code, artwork, or other content made available in the installation's Samples and Templates folders. Section 5(b) permits distribution of Examples, including modified Examples, in source or object code to third parties. This permission is usable only after the exact source/provenance of each included asset is verified against the installed engine version and the EULA definition.

The current repository contains Epic/template-derived folders, including:

- `Content/Characters/**`
- `Content/FirstPerson/**`
- `Content/Input/**`
- `Content/LevelPrototyping/**`
- `Content/Variant_Shooter/**`
- `Content/Weapons/**`
- `Content/__ExternalActors__/**`
- `Content/__ExternalObjects__/**`

These paths are a provisional inventory, not proof that every file is an Epic Example. Map-generated external actors/objects and any files copied from other packs must be traced to their actual source. Keep all Epic notices. Do not apply PolyForm to these files.

Unreal Engine code and Engine Tools are not licensed by RIXE. Do not commit engine source or redistribute Engine Tools outside the channels permitted by the EULA. When a distributed game incorporates Licensed Technology, Epic's EULA requires it to be included in object code as an inseparable part of the Product and requires the applicable end-user licence/disclaimer. Do not package Epic source assets separately.

The Unreal Engine EULA's Non-Compatible Licenses clause (section 6(c)) does not name PolyForm Noncommercial. This is not an express Epic approval. The separation described here is intended to keep Epic technology under Epic's own terms and RIXE-original material under its own licence; compatibility of the actual combined project still requires a written Epic clarification or qualified legal review before a definitive clearance.

## 3. Epic Marketplace, Fab, Learn, and Quixel content

Content downloaded through Fab/Marketplace, the Learn tab, or Quixel is governed by its own Epic Content License Agreement or the licence shown for the item. The content agreement generally allows distribution to end users only as object code inseparably incorporated into a project and generally prohibits public source redistribution of the licensed content.

The Marketplace Distribution Agreement defines a "Prohibited License" to include terms requiring material to be redistributable at no/minimal charge or only for non-commercial purposes, and prohibits submitting content that contains material under such a licence or derivatives of it. PolyForm Noncommercial is therefore not to be used for a Fab submission. **Do not submit RIXE/PolyForm material to Fab unless Epic has given written permission or the submission has been restructured and legally cleared.**

No Fab, Learn, or Quixel asset is currently declared as cleared for public source redistribution. Before using one, record its name, source URL, exact licence/version, acquisition date, attribution, and permitted redistribution format here. Do not commit the raw asset to the public repository unless its licence explicitly permits that distribution.

## 4. Plugins enabled in `fps.uproject`

Currently declared plugins:

- `GameplayStateTree`
- `ModelingToolsEditorMode`
- `ModelContextProtocol`
- `MCPClientToolset`
- `AllToolsets`

Their availability within an Unreal installation does not itself establish that every plugin is freely redistributable. Confirm the plugin source, version, runtime/editor scope, licence and packaging behaviour. Do not include an editor-only plugin or its source in a public release unless its terms allow it.

## 5. Python tool dependencies

`Tools/requirements.txt` currently lists `numpy`, `scipy`, and `Pillow`. They are installed by the user and are not intentionally vendored by this repository. Record exact versions and licences before bundling any of them into a distributed tool.

## 6. Shared game and cosmetic content policy

The official RIXE release must provide the same base-game content and the same official cosmetic catalogue to all players. No paid-exclusive skin, paid cosmetic advantage, platform-exclusive catalogue, or region-exclusive official skin is permitted. Official cosmetics use the same availability and unlock rules for everyone. Local graphics presets may scale rendering for hardware performance, but must not withhold game content or create a competitive gameplay advantage. This is a product rule and does not change third-party asset licences.

## 7. Release evidence still required

Before public release of a source snapshot or packaged game:

- Complete a file-level provenance inventory for `Content/Rixe`, all template folders, external actors/objects, plugins, tools, fonts, sounds, textures, and imported resources.
- Verify that every Epic-derived source asset in this public repository is an EULA "Example" covered by section 5(b), or remove/isolate the file and document an alternative workflow for contributors to obtain it under their own Epic licence.
- Confirm plugin licences and target inclusion; preserve all required third-party notices.
- Check that the exact packaged build distributes Epic Licensed Technology only in permitted format and includes the required end-user terms and credits.
- Obtain written Epic clarification or qualified legal review of the PolyForm/EULA 6(c) interaction.
- Recheck Epic's current terms and the exact release artefact immediately before release.

Do not state that Epic has approved PolyForm or that all assets are cleared until the evidence above exists.
