"""RIXE - generateur de maillages (armes, accessoires, decor) en OBJ.

Repere Unreal : X lateral, Y vers l'avant (canon), Z vers le haut, unites en cm.
Les pieces sont des enveloppes convexes (scipy) : boites chanfreinees, cylindres, profils extrudes.
Chaque piece porte un nom de materiau (Body, Detail, Accent, Glass) -> un emplacement de materiau dans Unreal.
"""
import math
import numpy as np
from scipy.spatial import ConvexHull

# Conversion Unreal (X,Y,Z) -> fichier OBJ ; reglee apres un test d'import.
AXIS = lambda p: (p[0], -p[1], p[2])  # l'import OBJ d'Unreal inverse Y


class Mesh:
    def __init__(self):
        self.tris = {}  # mat -> list of (p0,p1,p2) numpy

    def hull(self, pts, mat):
        pts = np.asarray(pts, dtype=float)
        h = ConvexHull(pts)
        c = pts.mean(axis=0)
        lst = self.tris.setdefault(mat, [])
        for s in h.simplices:
            a, b, d = pts[s[0]], pts[s[1]], pts[s[2]]
            n = np.cross(b - a, d - a)
            if np.dot(n, a - c) < 0:
                b, d = d, b
            lst.append((a, b, d))
        return self

    # --- primitives -------------------------------------------------------
    def box(self, c, s, mat, bev=0.4):
        cx, cy, cz = c
        sx, sy, sz = [v / 2.0 for v in s]
        b = min(bev, sx * 0.45, sy * 0.45, sz * 0.45)
        pts = []
        for i in (-1, 1):
            for j in (-1, 1):
                for k in (-1, 1):
                    pts.append((cx + i * (sx - b), cy + j * sy, cz + k * sz))
                    pts.append((cx + i * sx, cy + j * (sy - b), cz + k * sz))
                    pts.append((cx + i * sx, cy + j * sy, cz + k * (sz - b)))
                    if b <= 0:
                        break
        return self.hull(pts, mat)

    def cyl(self, c, axis, r, length, mat, seg=20, bev=0.2, r2=None):
        r2 = r if r2 is None else r2
        pts = []
        for t, rr, inset in ((-1, r, 0), (-1, r - bev, bev), (1, r2, 0), (1, r2 - bev, bev)):
            for i in range(seg):
                a = 2 * math.pi * i / seg
                u, v = rr * math.cos(a), rr * math.sin(a)
                h = t * (length / 2.0 - bev) if inset == 0 else t * (length / 2.0)
                if axis == 'y':
                    pts.append((c[0] + u, c[1] + h, c[2] + v))
                elif axis == 'x':
                    pts.append((c[0] + h, c[1] + u, c[2] + v))
                else:
                    pts.append((c[0] + u, c[1] + v, c[2] + h))
        return self.hull(pts, mat)

    def prism(self, prof, x0, x1, mat, bev=0.5):
        """Profil convexe dans le plan (Y,Z), extrude de x0 a x1 avec chanfrein."""
        prof = np.asarray(prof, dtype=float)
        cen = prof.mean(axis=0)
        inner = []
        for p in prof:
            d = p - cen
            L = np.linalg.norm(d)
            inner.append(p - d / L * bev if L > bev * 2 else p)
        pts = []
        for x, poly in ((x0, inner), (x0 + bev, prof), (x1 - bev, prof), (x1, inner)):
            for y, z in poly:
                pts.append((x, y, z))
        return self.hull(pts, mat)

    def ring(self, c, axis, r, thick, depth, mat, seg=16):
        """Anneau creux fait de segments convexes (lunettes, visees)."""
        for i in range(seg):
            a0 = 2 * math.pi * i / seg
            a1 = 2 * math.pi * (i + 1) / seg
            pts = []
            for a in (a0, a1):
                for rr in (r, r + thick):
                    u, v = rr * math.cos(a), rr * math.sin(a)
                    for h in (-depth / 2, depth / 2):
                        if axis == 'y':
                            pts.append((c[0] + u, c[1] + h, c[2] + v))
                        else:
                            pts.append((c[0] + h, c[1] + u, c[2] + v))
            self.hull(pts, mat)
        return self

    def mirror_x(self, fn):
        fn(1)
        fn(-1)

    # --- export -----------------------------------------------------------
    def write_obj(self, path):
        lines = ['# RIXE meshgen']
        vi = 1
        vn = 1
        for mat in sorted(self.tris):
            lines.append('usemtl %s' % mat)
            lines.append('g %s' % mat)
            for a, b, d in self.tris[mat]:
                n = np.cross(b - a, d - a)
                L = np.linalg.norm(n)
                if L < 1e-9:
                    continue
                n = n / L
                ax = int(np.argmax(np.abs(n)))
                for p in (a, d, b):  # ordre inverse : compense le miroir de AXIS
                    q = AXIS(p)
                    lines.append('v %.4f %.4f %.4f' % q)
                    if ax == 0:
                        uv = (p[1] / 20.0, p[2] / 20.0)
                    elif ax == 1:
                        uv = (p[0] / 20.0, p[2] / 20.0)
                    else:
                        uv = (p[0] / 20.0, p[1] / 20.0)
                    lines.append('vt %.4f %.4f' % uv)
                qn = AXIS(n)
                lines.append('vn %.4f %.4f %.4f' % qn)
                lines.append('f %d/%d/%d %d/%d/%d %d/%d/%d' % (vi, vi, vn, vi + 1, vi + 1, vn, vi + 2, vi + 2, vn))
                vi += 3
                vn += 1
        with open(path, 'w') as f:
            f.write('\n'.join(lines) + '\n')
        return sum(len(v) for v in self.tris.values())


def test_mesh():
    m = Mesh()
    m.box((0, 0, 0), (2, 10, 4), 'Body', 0.2)
    m.box((0, 5, 3), (1, 1, 1), 'Accent', 0.1)
    return m


if __name__ == '__main__':
    import sys, os
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.makedirs(out, exist_ok=True)
    print(test_mesh().write_obj(os.path.join(out, 'RixeAxisTest.obj')))
