# RIXE — third-party notices and licence scope

This file defines what the RIXE licence covers and lists material that is NOT covered. It is a tracking tool, not legal advice. See also `LICENCE_DISTRIBUTION.md` (distribution blockers).

## 1. Scope of the RIXE licence (PolyForm Noncommercial 1.0.0)

Covered (original RIXE material, copyright (c) 2026 zallyx62):

- `Content/Rixe/**`, except any item inside it that is derived from Epic or third-party material
- `Tools/**` (generators, validators, DSL scripts), without the Python packages they install
- `prototype-web/**`
- Original documentation (`*.md` in the repository root)

NOT covered (remain under their own terms):

- Epic template content: `Content/Characters`, `Content/FirstPerson`, `Content/Input`, `Content/LevelPrototyping`, `Content/Variant_Shooter`, `Content/Weapons`, `Content/__ExternalActors__`, `Content/__ExternalObjects__`. RIXE changes made inside these Epic-derived assets stay under Epic's terms.
- Unreal Engine code, plugins and tools.
- Anything else carrying its own notice.

Commercial rights over the covered material belong to the owner only. Hosting a free community server is a noncommercial use.

## 2. Epic Games

- Unreal Engine End User License Agreement: https://www.unrealengine.com/eula
- Epic Content License Agreement: https://www.unrealengine.com/eula/content
- The template content above comes from the "First Person / Arena Shooter" template and is used under Epic's terms. RIXE does not claim ownership of it and does not relicense it.
- The Unreal Engine EULA lists the GPL, the LGPL and Creative Commons ShareAlike among non-compatible licences. This is why the former GPL-3.0 `LICENSE` was replaced. Whether PolyForm Noncommercial is compatible with that clause has not been validated by a qualified person: it is applied only to the original material in section 1, never to Epic content.
- Unreal Engine is a trademark of Epic Games, Inc.

## 3. Fab

Any asset obtained from Fab is governed by the licence shown on its Fab listing. No Fab asset is declared yet. Before using one, add a row here (name, listing URL, licence, date) and check that the licence allows redistributing the raw asset in a public repository; many licences allow use inside a game but not redistribution of the source asset. Until then, do not commit Fab assets.

## 4. Plugins enabled in `fps.uproject`

`GameplayStateTree`, `ModelingToolsEditorMode`, `ModelContextProtocol`, `MCPClientToolset`, `AllToolsets`. They appear to ship with Unreal Engine and are used under Epic's terms (confirm for each). All except `GameplayStateTree` are limited to the Editor target.

## 5. Python tool dependencies (`Tools/requirements.txt`)

`numpy`, `scipy` and `Pillow` are installed by the user and are not redistributed in this repository. Each keeps its own licence (see the package metadata).

## 6. Open items

- The public repository currently contains Epic-derived template assets. Check what the Unreal EULA allows for public posting of that content. Possible fixes: keep it out of the public repository and let contributors take it from their own engine install, or make the repository private.
- Inventory fonts, sounds, textures and any other imported file in `Content/Rixe`.
