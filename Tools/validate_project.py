#!/usr/bin/env python3
"""Contrôles reproductibles du dépôt RIXE, sans prétendre compiler Unreal."""
from __future__ import annotations
import ast
import json
import math
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "Tools"
sys.path.insert(0, str(TOOLS))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"ÉCHEC: {message}")


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"ÉCHEC: JSON invalide ({path.relative_to(ROOT)}): {exc}") from exc


def main() -> None:
    project = load_json(ROOT / "fps.uproject")
    require(project.get("EngineAssociation") == "5.8", "fps.uproject doit cibler Unreal Engine 5.8")
    require(isinstance(project.get("Plugins"), list), "fps.uproject: Plugins doit être une liste")

    engine_ini = (ROOT / "Config/DefaultEngine.ini").read_text(encoding="utf-8")
    require("r.RayTracing=False" in engine_ini, "le ray tracing matériel doit être désactivé par défaut")
    require("r.RayTracing=True" not in engine_ini, "une activation globale du ray tracing a été détectée")

    metadata = load_json(TOOLS / "weapons_meta.json")
    require(isinstance(metadata, dict) and metadata, "weapons_meta.json doit contenir des armes")
    for name, data in metadata.items():
        require(isinstance(data, dict), f"métadonnées invalides pour {name}")
        triangles = data.get("tris")
        require(isinstance(triangles, int) and triangles > 0, f"nombre de triangles invalide pour {name}")
        for key in ("sight", "mount_sight", "mount_muzzle", "mount_under", "mount_mag"):
            value = data.get(key)
            if value is not None:
                require(isinstance(value, list) and len(value) == 3
                        and all(isinstance(v, (int, float)) and math.isfinite(v) for v in value),
                        f"coordonnées {key} invalides pour {name}")

    python_files = sorted(TOOLS.glob("*.py"))
    require(python_files, "aucun script Python trouvé dans Tools/")
    for path in python_files:
        try:
            ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        except (OSError, SyntaxError) as exc:
            raise SystemExit(f"ÉCHEC: syntaxe Python invalide ({path.relative_to(ROOT)}): {exc}") from exc

    import rixe_weapons
    expected_keys = set(rixe_weapons.WEAPONS) | {f"att_{name}" for name in rixe_weapons.ATTS}
    require(set(metadata) == expected_keys, "les clés de weapons_meta.json ne correspondent pas aux générateurs")

    for name, factory in rixe_weapons.WEAPONS.items():
        mesh, _ = factory()
        actual = sum(len(faces) for faces in mesh.tris.values())
        require(actual == metadata[name]["tris"], f"maillage {name}: {actual} triangles, attendu {metadata[name]['tris']}")
        require(actual > 0, f"maillage {name} vide")
        blueprint = ROOT / f"Content/Rixe/Weapons/Blueprints/BP_Rixe_{name}.uasset"
        require(blueprint.is_file(), f"Blueprint d'arme manquant: {blueprint.relative_to(ROOT)}")

    for name, factory in rixe_weapons.ATTS.items():
        mesh, _ = factory()
        actual = sum(len(faces) for faces in mesh.tris.values())
        expected = metadata[f"att_{name}"]["tris"]
        require(actual == expected, f"accessoire {name}: {actual} triangles, attendu {expected}")

    with tempfile.TemporaryDirectory(prefix="rixe-validation-") as tmp:
        output = Path(tmp) / "mesh.obj"
        from rixe_meshgen import test_mesh
        triangle_count = test_mesh().write_obj(str(output))
        require(output.is_file() and output.stat().st_size > 0, "le générateur OBJ n'a pas produit de fichier")
        require(triangle_count > 0 and "f " in output.read_text(encoding="utf-8"),
                "le fichier OBJ ne contient aucune face")

    print(f"OK: UE {project['EngineAssociation']}; {len(python_files)} scripts; "
          f"{len(rixe_weapons.WEAPONS)} armes; {len(rixe_weapons.ATTS)} accessoires; "
          "smoke test OBJ réussi. Aucun build Unreal n'a été exécuté.")


if __name__ == "__main__":
    main()
