#!/usr/bin/env python3
"""Reproducible static checks and generator smoke tests for the RIXE repository."""
from __future__ import annotations

import ast
import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "Tools"
sys.path.insert(0, str(TOOLS))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"FAILED: {message}")


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"FAILED: invalid JSON ({path.relative_to(ROOT)}): {exc}") from exc


def run_generator(script: Path, output_dir: Path, *, timeout: int = 180) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            [sys.executable, str(script), str(output_dir)],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired as exc:
        raise SystemExit(f"FAILED: {script.name} exceeded its {timeout}s timeout") from exc


def main() -> None:
    project = load_json(ROOT / "fps.uproject")
    require(project.get("EngineAssociation") == "5.8", "fps.uproject must target Unreal Engine 5.8")

    plugins = project.get("Plugins")
    require(isinstance(plugins, list), "fps.uproject: Plugins must be a list")
    plugin_names = [item.get("Name") for item in plugins if isinstance(item, dict)]
    require(len(plugin_names) == len(plugins), "fps.uproject: every plugin entry must be an object")
    require(all(isinstance(name, str) and name for name in plugin_names), "fps.uproject: plugin names must be non-empty strings")
    require(len(plugin_names) == len(set(plugin_names)), "fps.uproject: duplicate plugin names detected")

    engine_ini = (ROOT / "Config/DefaultEngine.ini").read_text(encoding="utf-8")
    require("r.RayTracing=False" in engine_ini, "hardware ray tracing must remain disabled by default")
    require("r.RayTracing=True" not in engine_ini, "global hardware ray tracing activation detected")

    # Keep the configured startup assets aligned with the checked-in project content.
    required_configured_assets = {
        "EditorStartupMap": (" /Game/Variant_Shooter/Lvl_ArenaShooter", ROOT / "Content/Variant_Shooter/Lvl_ArenaShooter.umap"),
        "GameDefaultMap": (" /Game/Variant_Shooter/Lvl_ArenaShooter", ROOT / "Content/Variant_Shooter/Lvl_ArenaShooter.umap"),
        "GlobalDefaultGameMode": (" /Game/Variant_Shooter/Blueprints/BP_ShooterGameMode.BP_ShooterGameMode_C", ROOT / "Content/Variant_Shooter/Blueprints/BP_ShooterGameMode.uasset"),
        "GameInstanceClass": (" /Game/Rixe/Blueprints/BP_RixeGameInstance.BP_RixeGameInstance_C", ROOT / "Content/Rixe/Blueprints/BP_RixeGameInstance.uasset"),
    }
    for key, (value, asset_path) in required_configured_assets.items():
        require(f"{key}={value.strip()}" in engine_ini, f"DefaultEngine.ini: unexpected or missing {key}")
        require(asset_path.is_file(), f"configured Unreal asset is missing: {asset_path.relative_to(ROOT)}")

    metadata = load_json(TOOLS / "weapons_meta.json")
    require(isinstance(metadata, dict) and metadata, "weapons_meta.json must contain weapon metadata")
    for name, data in metadata.items():
        require(isinstance(name, str) and name, "weapon metadata contains an invalid key")
        require(isinstance(data, dict), f"invalid metadata object for {name}")
        triangles = data.get("tris")
        require(isinstance(triangles, int) and triangles > 0, f"invalid triangle count for {name}")
        for key in ("sight", "mount_sight", "mount_muzzle", "mount_under", "mount_mag"):
            value = data.get(key)
            if value is not None:
                require(
                    isinstance(value, list)
                    and len(value) == 3
                    and all(isinstance(v, (int, float)) and math.isfinite(v) for v in value),
                    f"invalid {key} coordinates for {name}",
                )
        for key in ("eye", "fov", "line"):
            value = data.get(key)
            if value is not None:
                require(
                    isinstance(value, (int, float)) and math.isfinite(value),
                    f"invalid {key} value for {name}",
                )

    python_files = sorted(TOOLS.glob("*.py"))
    require(python_files, "no Python tools found in Tools/")
    for path in python_files:
        try:
            ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        except (OSError, SyntaxError) as exc:
            raise SystemExit(f"FAILED: invalid Python syntax ({path.relative_to(ROOT)}): {exc}") from exc

    import rixe_weapons

    expected_keys = set(rixe_weapons.WEAPONS) | {f"att_{name}" for name in rixe_weapons.ATTS}
    require(set(metadata) == expected_keys, "weapons_meta.json keys do not match the weapon/accessory generators")

    for name, factory in rixe_weapons.WEAPONS.items():
        mesh, _ = factory()
        actual = sum(len(faces) for faces in mesh.tris.values())
        require(actual == metadata[name]["tris"], f"weapon mesh {name}: {actual} triangles, expected {metadata[name]['tris']}")
        blueprint = ROOT / f"Content/Rixe/Weapons/Blueprints/BP_Rixe_{name}.uasset"
        require(blueprint.is_file(), f"weapon Blueprint is missing: {blueprint.relative_to(ROOT)}")

    for name, factory in rixe_weapons.ATTS.items():
        mesh, _ = factory()
        actual = sum(len(faces) for faces in mesh.tris.values())
        expected = metadata[f"att_{name}"]["tris"]
        require(actual == expected, f"accessory mesh {name}: {actual} triangles, expected {expected}")

    for name, factory in rixe_weapons.IRONS.items():
        mesh = factory()
        actual = sum(len(faces) for faces in mesh.tris.values())
        require(actual > 0, f"iron-sight mesh {name} is empty")

    # Exercise the complete OBJ export pipeline, including iron sights and accessories.
    with tempfile.TemporaryDirectory(prefix="rixe-weapons-") as tmp:
        output_dir = Path(tmp)
        result = run_generator(TOOLS / "rixe_weapons.py", output_dir)
        require(result.returncode == 0, f"weapon generator failed: {result.stderr[-2000:]}")
        generated_metadata = load_json(output_dir / "meta.json")
        require(generated_metadata == metadata, "generated weapon metadata differs from Tools/weapons_meta.json")

        expected_obj_files = (
            [f"SM_Wpn_{name}.obj" for name in rixe_weapons.WEAPONS]
            + [f"SM_Wpn_{name}_Irons.obj" for name in rixe_weapons.IRONS]
            + [f"SM_Att_{name}.obj" for name in rixe_weapons.ATTS]
        )
        for filename in expected_obj_files:
            obj_path = output_dir / filename
            require(obj_path.is_file() and obj_path.stat().st_size > 0, f"OBJ export missing or empty: {filename}")
            obj_text = obj_path.read_text(encoding="utf-8")
            require("\\nv " in obj_text and "\\nf " in obj_text, f"OBJ export has no vertices/faces: {filename}")

    # Keep a small independent geometry smoke test for the shared mesh writer.
    with tempfile.TemporaryDirectory(prefix="rixe-meshgen-") as tmp:
        output = Path(tmp) / "mesh.obj"
        from rixe_meshgen import test_mesh

        triangle_count = test_mesh().write_obj(str(output))
        require(output.is_file() and output.stat().st_size > 0, "meshgen smoke test produced no OBJ file")
        require(triangle_count > 0 and "\\nf " in output.read_text(encoding="utf-8"), "meshgen smoke OBJ contains no faces")

    # Test the scope texture generator in an isolated temporary directory.
    with tempfile.TemporaryDirectory(prefix="rixe-scope-") as tmp:
        output_dir = Path(tmp)
        result = run_generator(TOOLS / "rixe_scope_texture.py", output_dir)
        # This script writes to its working directory and does not accept an output argument.
        if result.returncode != 0 and "unrecognized arguments" in result.stderr:
            result = subprocess.run(
                [sys.executable, str(TOOLS / "rixe_scope_texture.py")],
                cwd=output_dir,
                check=False,
                capture_output=True,
                text=True,
                timeout=180,
            )
        require(result.returncode == 0, f"scope texture generator failed: {result.stderr[-2000:]}")
        texture_path = output_dir / "T_RixeScope.png"
        require(texture_path.is_file() and texture_path.stat().st_size > 0, "scope texture PNG was not generated")
        try:
            with Image.open(texture_path) as texture:
                require(texture.format == "PNG", "scope texture output is not PNG")
                require(texture.size == (4096, 1024), f"unexpected scope texture size: {texture.size}")
                require(texture.mode == "RGBA", f"unexpected scope texture mode: {texture.mode}")
                center = texture.getpixel((2048, 512))
                transparent_area = texture.getpixel((2248, 712))
                require(center[0] >= 240 and center[3] >= 240, "scope reticle center dot is missing")
                require(transparent_area[3] == 0, "scope lens interior should retain transparency")
        except OSError as exc:
            raise SystemExit(f"FAILED: cannot read generated scope texture: {exc}") from exc

    print(
        f"OK: UE {project['EngineAssociation']}; {len(python_files)} Python tools; "
        f"{len(rixe_weapons.WEAPONS)} weapons; {len(rixe_weapons.IRONS)} iron sights; "
        f"{len(rixe_weapons.ATTS)} accessories; OBJ and scope PNG generation passed. "
        "No Unreal build or Blueprint load was performed."
    )


if __name__ == "__main__":
    main()
