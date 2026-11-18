"""RIXE - modeles des armes et accessoires (genere des .obj avec rixe_meshgen).

Reperes communs (armes a deux mains) : poignee de la main droite a l'origine, main gauche vers
(0, 28.5, 3), axe du canon a z = 9.9, bouche vers y = 51 (comme SKM_Rifle).
Materiaux : Body (coque), Detail (metal), Accent (neon), Glass (optiques).
"""
import json, os, sys
from rixe_meshgen import Mesh

B, D, A, G = 'Body', 'Detail', 'Accent', 'Glass'


def grip(m, y0=-4.0, big=False):
    w = 4.2 if big else 3.8
    m.prism([(y0, 2.5), (y0 + 6, 2.5), (y0 + 3.5, -10), (y0 - 2, -9)], -w / 2, w / 2, B, 0.6)
    m.box((0, y0 + 7.2, 0.0), (0.8, 6.5, 0.6), D, 0.2)       # pontet
    m.box((0, y0 + 6.2, 1.0), (0.6, 0.8, 2.4), D, 0.15)      # detente


def side_accent(m, y, z, ly, lz=0.5, x=2.75):
    for s in (1, -1):
        m.box((s * x, y, z), (0.25, ly, lz), A, 0.08)


def irons(m, rear_y, front_y, line_z, base_rear, base_front):
    # hausse : support + oreilles + oeilleton ; guidon : support + lame + ailettes
    m.box((0, rear_y, (base_rear + line_z - 1.2) / 2), (2.6, 2.0, line_z - 1.2 - base_rear), D, 0.3)
    for s in (1, -1):
        m.box((s * 1.1, rear_y, line_z + 0.2), (0.5, 1.6, 2.2), D, 0.15)
    m.ring((0, rear_y, line_z), 'y', 0.55, 0.3, 0.5, D, 12)
    m.box((0, front_y, (base_front + line_z - 2.2) / 2), (2.2, 2.0, line_z - 2.2 - base_front), D, 0.3)
    m.box((0, front_y, line_z - 1.1), (0.35, 0.5, 2.2), D, 0.05)
    for s in (1, -1):
        m.box((s * 1.15, front_y, line_z - 0.6), (0.4, 1.4, 2.6), D, 0.1)


def rail(m, y0, y1, z):
    m.box((0, (y0 + y1) / 2, z - 0.7), (2.6, y1 - y0, 1.4), D, 0.3)
    y = y0 + 1
    while y < y1 - 0.5:
        m.box((0, y, z + 0.2), (2.6, 0.9, 0.5), D, 0.1)
        y += 2.0


def scope(m, cy, cz, r, length, bell, mat_body=B):
    m.cyl((0, cy, cz), 'y', r, length, mat_body, 24, 0.3)
    m.cyl((0, cy + length / 2 + 2, cz), 'y', r * 1.05, 4, mat_body, 24, 0.3, r2=bell)
    m.cyl((0, cy - length / 2 - 1.2, cz), 'y', r * 1.25, 2.6, mat_body, 24, 0.3)
    m.cyl((0, cy + length / 2 + 4.05, cz), 'y', bell - 0.25, 0.12, G, 24, 0.02)
    m.cyl((0, cy - length / 2 - 2.55, cz), 'y', r * 1.15, 0.12, G, 24, 0.02)
    m.cyl((0, cy, cz), 'y', r + 0.06, 0.7, A, 24, 0.05)
    for dy in (-length / 3, length / 3):
        m.box((0, cy + dy, cz - r - 1.0), (2.2, 1.6, 2.2), D, 0.3)


# ----------------------------------------------------------------- armes --
def ar():
    m = Mesh()
    m.prism([(-27, 2.5), (-27, 11.5), (-19, 12.5), (-6, 12.5), (-6, 5), (-15, 3)], -2, 2, B, 0.6)
    m.box((0, -27.2, 7), (4.4, 1.4, 9.6), D, 0.4)
    side_accent(m, -16, 10, 16, 0.6, 2.05)
    m.prism([(-6, 2.5), (22, 2.5), (22, 13.5), (18, 15.5), (-3, 15.5), (-6, 13)], -2.7, 2.7, B, 0.7)
    side_accent(m, 8, 12, 20)
    m.box((2.8, 10, 9), (0.3, 7, 3), D, 0.1)
    m.box((0, 11, 0.5), (4.6, 8, 5), B, 0.5)
    m.prism([(8, -2), (14, -2), (15.5, -15), (9.5, -15.5)], -1.8, 1.8, D, 0.4)
    m.box((0, 12.5, -15.6), (3.8, 6.2, 0.6), A, 0.15)
    grip(m)
    m.prism([(22, 3.5), (42, 4.5), (42, 13.2), (22, 13.6)], -2.8, 2.8, B, 0.7)
    for k in range(3):
        side_accent(m, 27 + k * 5, 9, 3, 1.2, 2.85)
    m.cyl((0, 46.5, 9.9), 'y', 1.15, 9, D, 18, 0.2)
    m.box((0, 50.2, 9.9), (3.0, 2.6, 3.0), D, 0.5)
    m.box((0, 50.2, 11.45), (1.2, 1.6, 0.12), A, 0.03)
    rail(m, -2, 20, 16.9)
    return m, dict(sight=(0, 1.5, 19.0), eye=14, fov=0.85, mount_sight=(0, 8, 16.9), mount_muzzle=(0, 51.5, 9.9), mount_under=(0, 32, 4.2), mount_mag=(0, 12.4, -15.9))


def ar_irons():
    m = Mesh(); irons(m, 1.5, 40, 19.0, 16.9, 13.2); return m


def smg():
    m = Mesh()
    m.prism([(-4, 3), (20, 3), (20, 13), (16, 14.5), (-1, 14.5), (-4, 12)], -2.5, 2.5, B, 0.6)
    side_accent(m, 8, 11.5, 18, 0.5, 2.55)
    m.cyl((0, 33, 9.9), 'y', 2.2, 26, B, 20, 0.4)
    for y in (26, 32, 38):
        m.cyl((0, y, 9.9), 'y', 2.32, 0.6, A, 20, 0.05)
    m.cyl((0, 48.5, 9.9), 'y', 1.4, 5, D, 18, 0.3)
    m.prism([(25.5, 3.2), (31.5, 3.2), (30.5, -7), (26.5, -7)], -1.5, 1.5, B, 0.5)
    grip(m, -3.5)
    m.prism([(9, -1), (14, -1), (14.5, -17), (9.5, -17)], -1.6, 1.6, D, 0.4)
    m.box((0, 12, -17.4), (3.4, 5.6, 0.6), A, 0.15)
    m.box((0, -14, 12), (1.0, 20, 1.0), D, 0.3)
    m.box((0, -14, 5), (1.0, 20, 1.0), D, 0.3)
    m.box((0, -24.2, 8.5), (3.2, 1.2, 9.0), D, 0.4)
    rail(m, -1, 17, 16.0)
    return m, dict(sight=(0, 0.0, 17.6), eye=14, fov=0.85, mount_sight=(0, 7, 16.0), mount_muzzle=(0, 51.2, 9.9), mount_under=(0, 22, 3.0), mount_mag=(0, 11.8, -17.7))


def smg_irons():
    m = Mesh(); irons(m, 0.0, 44, 17.6, 16.0, 12.1); return m


def lmg():
    m = Mesh()
    m.prism([(-6, 1), (24, 1), (24, 15), (20, 17), (-3, 17), (-6, 14)], -3.5, 3.5, B, 0.8)
    side_accent(m, 9, 13.5, 22, 0.6, 3.55)
    m.box((0, 12, -4), (8, 10, 9), D, 0.8)
    side_accent(m, 12, -4, 8, 1.0, 4.05)
    m.cyl((0, 37, 9.9), 'y', 2.4, 22, B, 22, 0.4)
    for k in range(4):
        m.box((0, 30 + k * 4.5, 12.4), (1.6, 2.2, 0.3), A, 0.05)
    m.cyl((0, 50, 9.9), 'y', 1.2, 4, D, 18, 0.2)
    for s in (1, -1):
        m.cyl((s * 1.4, 40, 6.2), 'y', 0.45, 16, D, 10, 0.1)
    m.box((0, 7, 19.5), (1.6, 2, 5.0), D, 0.3)
    m.box((0, 17, 19.5), (1.6, 2, 5.0), D, 0.3)
    m.box((0, 12, 21.6), (1.8, 12, 1.4), D, 0.4)
    m.prism([(-27, 3), (-27, 13), (-6, 14), (-6, 4)], -2.5, 2.5, B, 0.6)
    m.box((0, -27.3, 8), (5.2, 1.4, 10.4), D, 0.4)
    grip(m, -4, big=True)
    return m, dict(sight=(0, -1.0, 23.4), eye=14, fov=0.85, mount_sight=(0, 12, 22.3), mount_muzzle=(0, 52.2, 9.9), mount_under=(0, 30, 6.0), mount_mag=(0, 12, -8.6))


def lmg_irons():
    m = Mesh(); irons(m, -1.0, 46, 23.4, 17.0, 12.3); return m


def dmr():
    m = Mesh()
    m.prism([(-6, 3), (24, 3), (24, 13), (20, 14.5), (-3, 14.5), (-6, 12)], -2.4, 2.4, B, 0.6)
    side_accent(m, 9, 11.5, 22, 0.45, 2.45)
    m.prism([(24, 4), (44, 4.6), (44, 12.6), (24, 13)], -2.5, 2.5, B, 0.6)
    side_accent(m, 34, 8.5, 16, 0.4, 2.55)
    m.cyl((0, 48, 9.9), 'y', 1.0, 7, D, 18, 0.2)
    m.cyl((0, 51, 9.9), 'y', 1.5, 2.2, D, 18, 0.3)
    scope(m, 9, 20.0, 1.6, 14, 2.4)
    m.prism([(-27, 1.5), (-27, 12), (-6, 13), (-6, 4)], -2.2, 2.2, B, 0.6)
    m.box((0, -14, 13.6), (3.4, 10, 1.4), D, 0.4)
    m.prism([(9, -1), (14, -1), (14, -8), (9, -8)], -1.7, 1.7, D, 0.4)
    m.box((0, 11.5, -8.3), (3.2, 5.2, 0.5), A, 0.12)
    grip(m)
    return m, dict(sight=(0, -1.0, 20.0), eye=9, fov=0.55, mount_sight=None, mount_muzzle=(0, 52.2, 9.9), mount_under=(0, 32, 4.2), mount_mag=(0, 11.5, -8.6))


def sniper():
    m = Mesh()
    m.prism([(-6, 3), (18, 3), (18, 13), (-6, 13)], -2.5, 2.5, B, 0.6)
    m.cyl((3.4, 2, 11), 'x', 0.5, 3.6, D, 10, 0.1)
    m.cyl((5.3, 2, 11), 'x', 0.9, 1.2, A, 12, 0.1)
    m.prism([(18, 4), (42, 5), (42, 12.5), (18, 13)], -2.6, 2.6, B, 0.6)
    side_accent(m, 30, 8.8, 20, 0.45, 2.65)
    m.cyl((0, 46.5, 9.9), 'y', 1.3, 9, D, 18, 0.2)
    m.box((0, 50.3, 9.9), (3.4, 2.6, 3.4), D, 0.5)
    for s in (1, -1):
        m.box((s * 1.75, 50.3, 9.9), (0.12, 1.4, 1.6), A, 0.03)
    scope(m, 9, 20.5, 1.7, 18, 2.9)
    m.cyl((0, 9, 22.8), 'z', 0.9, 1.6, D, 14, 0.15)
    m.cyl((2.1, 9, 20.5), 'x', 0.8, 1.4, D, 14, 0.15)
    m.prism([(-27, 0), (-27, 12.5), (-8, 13), (-6, 4)], -2.2, 2.2, B, 0.6)
    m.box((0, -16, 14.0), (3.6, 9, 1.6), D, 0.4)
    m.box((0, -27.3, 6.2), (4.6, 1.4, 12.6), D, 0.4)
    m.box((0, 10, -2), (3.6, 6, 8), D, 0.4)
    grip(m)
    return m, dict(sight=(0, -2.0, 20.5), eye=7, fov=0.3, mount_sight=None, mount_muzzle=(0, 51.8, 9.9), mount_under=(0, 30, 4.6), mount_mag=None)


def shotgun():
    m = Mesh()
    m.prism([(-6, 3), (16, 3), (16, 14), (-3, 14), (-6, 12)], -2.8, 2.8, B, 0.7)
    side_accent(m, 5, 11, 14, 0.6, 2.85)
    m.cyl((0, 33, 9.9), 'y', 1.3, 36, D, 18, 0.25)
    m.cyl((0, 30, 6.6), 'y', 1.3, 28, B, 18, 0.25)
    m.cyl((0, 44.6, 6.6), 'y', 1.45, 1.2, D, 18, 0.2)
    m.box((0, 28, 6.0), (4.6, 12, 4.6), B, 0.8)
    for k in range(5):
        m.box((0, 23.5 + k * 2.2, 3.6), (3.6, 0.7, 0.3), A, 0.05)
    m.prism([(-27, 1), (-27, 12), (-6, 13), (-6, 4)], -2.3, 2.3, B, 0.6)
    m.box((0, -27.3, 6.5), (4.8, 1.4, 11.4), D, 0.4)
    grip(m)
    m.box((0, 2, 14.9), (2.6, 2.4, 1.8), D, 0.3)
    m.ring((0, 2, 16.6), 'y', 0.6, 0.35, 0.6, D, 12)
    m.box((0, 48, 12.6), (1.2, 1.6, 2.6), D, 0.2)
    m.box((0, 48, 14.6), (0.5, 0.6, 1.6), D, 0.05)
    m.box((0, 48, 15.9), (0.5, 0.5, 0.5), A, 0.1)
    return m, dict(sight=(0, 2.0, 16.6), eye=14, fov=0.9, mount_sight=None, mount_muzzle=(0, 51.6, 9.9), mount_under=None, mount_mag=None)


def pistol():
    m = Mesh()
    m.prism([(-5.5, 4), (1, 4), (-1.5, -6), (-6, -5.5)], -1.6, 1.6, B, 0.5)
    m.box((0, 7, 9.5), (3.2, 24, 5.0), B, 0.6)
    side_accent(m, 8, 10.5, 18, 0.35, 1.62)
    m.box((0, 8, 5.4), (3.0, 18, 3.2), D, 0.5)
    m.box((0, 2.5, 3.0), (0.6, 5, 0.5), D, 0.15)
    m.box((0, 19.1, 9.5), (2.2, 0.4, 2.2), D, 0.2)
    for s in (1, -1):
        m.box((s * 0.6, -3.6, 12.4), (0.4, 0.8, 0.9), D, 0.08)
    m.box((0, 17.6, 12.4), (0.35, 0.8, 0.9), D, 0.05)
    m.box((0, 17.6, 12.95), (0.35, 0.4, 0.25), A, 0.05)
    return m, dict(sight=(0, -3.6, 12.7), eye=18, fov=0.9)


def revolver():
    m = Mesh()
    m.prism([(-5, 3.5), (0.5, 3.5), (-1.5, -6), (-5.8, -5.5)], -1.6, 1.6, B, 0.5)
    m.box((0, 2.5, 7), (3.0, 12, 6.0), D, 0.6)
    m.cyl((0, 4.5, 7.6), 'y', 2.6, 5, D, 12, 0.5)
    for k in range(6):
        import math
        a = k * math.pi / 3
        m.box((math.cos(a) * 2.62, 4.5, 7.6 + math.sin(a) * 2.62), (0.3, 3.6, 0.3), A, 0.05)
    m.cyl((0, 13, 9.0), 'y', 1.1, 12, D, 16, 0.2)
    m.box((0, 13, 10.5), (1.2, 12, 1.0), B, 0.2)
    m.box((0, 12, 6.9), (2.2, 12, 2.2), B, 0.4)
    m.box((0, -2.8, 10.8), (1.0, 1.6, 1.6), D, 0.2)
    for s in (1, -1):
        m.box((s * 0.6, -1.0, 11.8), (0.4, 0.8, 0.9), D, 0.08)
    m.box((0, 18.4, 11.6), (0.35, 0.8, 1.1), D, 0.05)
    return m, dict(sight=(0, -1.0, 12.3), eye=18, fov=0.85)


# ------------------------------------------------------------- accessoires --
def att_reddot():
    m = Mesh()
    m.box((0, 0, 0.6), (2.6, 4.0, 1.2), D, 0.3)
    m.ring((0, 0, 3.6), 'y', 1.6, 0.35, 1.2, B, 18)
    m.cyl((0, 0, 3.6), 'y', 1.6, 0.12, G, 18, 0.02)
    m.box((0, 0.1, 3.6), (0.16, 0.05, 0.16), A, 0.01)
    return m, 3.6


def att_scope2x():
    m = Mesh()
    m.box((0, 0, 0.7), (2.4, 5.0, 1.4), D, 0.3)
    m.cyl((0, 0, 3.4), 'y', 1.5, 7, B, 20, 0.3)
    m.cyl((0, 4.0, 3.4), 'y', 1.8, 1.4, B, 20, 0.3)
    m.cyl((0, -4.0, 3.4), 'y', 1.7, 1.4, B, 20, 0.3)
    m.cyl((0, 4.75, 3.4), 'y', 1.55, 0.1, G, 20, 0.02)
    m.cyl((0, -4.75, 3.4), 'y', 1.45, 0.1, G, 20, 0.02)
    m.cyl((0, 1.5, 3.4), 'y', 1.58, 0.6, A, 20, 0.05)
    return m, 3.4


def att_comp():
    m = Mesh()
    m.cyl((0, 1.8, 0), 'y', 1.6, 3.6, D, 16, 0.3)
    for s in (1, -1):
        m.box((s * 1.62, 2.2, 0), (0.12, 1.8, 0.7), A, 0.03)
    return m, 0


def att_supp():
    m = Mesh()
    m.cyl((0, 7, 0), 'y', 1.8, 14, B, 20, 0.4)
    for y in (2.5, 11.5):
        m.cyl((0, y, 0), 'y', 1.9, 0.6, A, 20, 0.05)
    return m, 0


def att_vgrip():
    m = Mesh()
    m.prism([(-1.6, 0), (1.6, 0), (1.1, -7), (-1.1, -7)], -1.3, 1.3, B, 0.4)
    m.box((0, 0, -7.1), (2.4, 2.4, 0.4), A, 0.1)
    return m, 0


def att_laser():
    m = Mesh()
    m.box((0, 0, -1.2), (2.2, 5.0, 2.2), B, 0.4)
    m.cyl((0, 2.6, -1.2), 'y', 0.5, 0.3, A, 12, 0.05)
    return m, 0


def att_extmag():
    m = Mesh()
    m.box((0, 0, -1.6), (3.8, 6.0, 3.2), D, 0.4)
    m.box((0, 0, -3.3), (3.4, 5.4, 0.4), A, 0.1)
    return m, 0


WEAPONS = dict(AR=ar, SMG=smg, LMG=lmg, DMR=dmr, Sniper=sniper, Shotgun=shotgun, Pistol=pistol, Revolver=revolver)
IRONS = dict(AR=ar_irons, SMG=smg_irons, LMG=lmg_irons)
ATTS = dict(RedDot=att_reddot, Scope2x=att_scope2x, Comp=att_comp, Supp=att_supp, VGrip=att_vgrip, Laser=att_laser, ExtMag=att_extmag)

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    meta = {}
    for k, f in WEAPONS.items():
        m, info = f()
        n = m.write_obj(os.path.join(out, 'SM_Wpn_%s.obj' % k))
        meta[k] = dict(info, tris=n)
    for k, f in IRONS.items():
        f().write_obj(os.path.join(out, 'SM_Wpn_%s_Irons.obj' % k))
    for k, f in ATTS.items():
        m, line = f()
        n = m.write_obj(os.path.join(out, 'SM_Att_%s.obj' % k))
        meta['att_' + k] = dict(line=line, tris=n)
    json.dump(meta, open(os.path.join(out, 'meta.json'), 'w'), indent=1)
    print(json.dumps({k: v.get('tris') for k, v in meta.items()}))
