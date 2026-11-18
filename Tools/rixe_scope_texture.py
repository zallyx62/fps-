"""Génère T_RixeScope.png : masque de lunette 4096x1024 (noir opaque, ouverture
circulaire transparente, réticule fin, point rouge central).

Utilisé par WBP_RixeScope (ScaleBox en "Scale To Fill") : le cercle garde son
rapport quel que soit le format d'écran. Importer le PNG dans /Game/Rixe/UI
sans changer la compression.
"""
from PIL import Image
import numpy as np

W, H = 4096, 1024
cx, cy, R = W / 2, H / 2, 500.0
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2)
alpha = np.clip((d - (R - 3)) / 3.0, 0, 1)
alpha = np.maximum(alpha, np.clip((d - (R - 70)) / 70.0, 0, 1) ** 2.2 * 0.85)
ret = np.zeros((H, W), np.float32)


def hline(y0, x0, x1, th):
    ret[int(y0 - th / 2):int(y0 + th / 2 + 0.5), int(x0):int(x1)] = 1


def vline(x0, y0, y1, th):
    ret[int(y0):int(y1), int(x0 - th / 2):int(x0 + th / 2 + 0.5)] = 1


gap = 14
hline(cy, cx - R, cx - gap, 2); hline(cy, cx + gap, cx + R, 2)
vline(cx, cy - R, cy - gap, 2); vline(cx, cy + gap, cy + R, 2)
hline(cy, cx - R, cx - 260, 7); hline(cy, cx + 260, cx + R, 7); vline(cx, cy + 260, cy + R, 7)
for i in range(1, 6):
    o = i * 40
    for s in (-1, 1):
        vline(cx + s * o, cy - 6, cy + 7, 2)
    hline(cy + o, cx - 6, cx + 7, 2)
ret *= d < R - 2
img = np.dstack([np.zeros((H, W, 3), np.float32), np.maximum(alpha, ret)])
dot = np.clip(1 - (d - 3.0) / 1.5, 0, 1)
img[..., 0] = np.where(dot > 0, 1.0, img[..., 0])
img[..., 1] = np.where(dot > 0, 0.12, img[..., 1])
img[..., 2] = np.where(dot > 0, 0.08, img[..., 2])
img[..., 3] = np.maximum(img[..., 3], dot)
Image.fromarray((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA").save("T_RixeScope.png", optimize=True)
