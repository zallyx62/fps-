'use strict';
/* ===================================================================
   MOTEUR 3D — WebGL2, sans dépendance.
   PBR direct (GGX) + ombres PCF + ciel procédural + eau + HDR,
   bloom, SSAO, rayons de soleil, ACES, FXAA, particules.
   =================================================================== */
const E = (() => {
const PI = Math.PI, TAU = PI * 2;
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
const hex = h => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
// générateur pseudo-aléatoire déterministe
function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

// ---------- matrices 4x4 (colonnes) ----------
const m4 = {
  create() { const o = new Float32Array(16); o[0] = o[5] = o[10] = o[15] = 1; return o; },
  ident(o) { o.fill(0); o[0] = o[5] = o[10] = o[15] = 1; return o; },
  mul(o, a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
      a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    for (let i = 0; i < 16; i += 4) {
      const b0 = b[i], b1 = b[i + 1], b2 = b[i + 2], b3 = b[i + 3];
      o[i] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30; o[i + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      o[i + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32; o[i + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }
    return o;
  },
  persp(o, fovy, asp, n, f) { const t = 1 / Math.tan(fovy / 2); o.fill(0); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
  ortho(o, l, r, b, t, n, f) { o.fill(0); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); o[15] = 1; return o; },
  lookAt(o, ex, ey, ez, tx, ty, tz, ux, uy, uz) {
    let zx = ex - tx, zy = ey - ty, zz = ez - tz, l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
    let xx = uy * zz - uz * zy, xy = uz * zx - ux * zz, xz = ux * zy - uy * zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0; o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0; o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
    o[12] = -(xx * ex + xy * ey + xz * ez); o[13] = -(yx * ex + yy * ey + yz * ez); o[14] = -(zx * ex + zy * ey + zz * ez); o[15] = 1; return o;
  },
  invert(o, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; if (!d) return m4.ident(o); d = 1 / d;
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * d; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * d; o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * d; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * d;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * d; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * d; o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * d; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * d;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * d; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * d; o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * d; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * d;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * d; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * d; o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * d; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * d; return o;
  },
  // T * Ry(h) * Rx(p) * Rz(r) * S  — h : cap (avant = -Z quand h=0), p : tangage (+ = vers le haut)
  trs(o, x, y, z, h = 0, p = 0, r = 0, sx = 1, sy = sx, sz = sx) {
    const c = Math.cos(h), s = Math.sin(h), cp = Math.cos(p), sp = Math.sin(p), cr = Math.cos(r), sr = Math.sin(r);
    const a0x = c, a0y = 0, a0z = -s, a1x = s * sp, a1y = cp, a1z = c * sp, a2x = s * cp, a2y = -sp, a2z = c * cp;
    o[0] = (a0x * cr + a1x * sr) * sx; o[1] = (a0y * cr + a1y * sr) * sx; o[2] = (a0z * cr + a1z * sr) * sx; o[3] = 0;
    o[4] = (-a0x * sr + a1x * cr) * sy; o[5] = (-a0y * sr + a1y * cr) * sy; o[6] = (-a0z * sr + a1z * cr) * sy; o[7] = 0;
    o[8] = a2x * sz; o[9] = a2y * sz; o[10] = a2z * sz; o[11] = 0; o[12] = x; o[13] = y; o[14] = z; o[15] = 1; return o;
  },
  tp(m, x, y, z, o = [0, 0, 0]) { o[0] = m[0] * x + m[4] * y + m[8] * z + m[12]; o[1] = m[1] * x + m[5] * y + m[9] * z + m[13]; o[2] = m[2] * x + m[6] * y + m[10] * z + m[14]; return o; },
};
const _t1 = m4.create(), _t2 = m4.create();
// compose parent * TRS local dans o (pratique pour les hiérarchies)
function childTRS(o, parent, x, y, z, h, p, r, sx, sy, sz) { m4.trs(_t1, x, y, z, h, p, r, sx, sy, sz); return m4.mul(o, parent, _t1); }

// ---------- constructeur de géométrie ----------
const WIND = k => Math.max(1, Math.round(k * 127)) / 255;        // poids de vent 0..1
const GRID1 = 160 / 255, GRID2 = 200 / 255, GRID4 = 240 / 255;     // joints de dalles tous les 1 / 2 / 4 m
const FACES = [[0, 1, 2, 1], [0, 2, 1, -1], [1, 2, 0, 1], [1, 0, 2, -1], [2, 0, 1, 1], [2, 1, 0, -1]]; // [axe normal, u, v, signe]
class Geo {
  constructor() { this.P = []; this.N = []; this.C = []; this.M = []; this.I = []; this.nv = 0; }
  v(m, x, y, z, nx, ny, nz, c, mt, ao = 1) {
    if (m) {
      const X = m[0] * x + m[4] * y + m[8] * z + m[12], Y = m[1] * x + m[5] * y + m[9] * z + m[13], Z = m[2] * x + m[6] * y + m[10] * z + m[14];
      const NX = m[0] * nx + m[4] * ny + m[8] * nz, NY = m[1] * nx + m[5] * ny + m[9] * nz, NZ = m[2] * nx + m[6] * ny + m[10] * nz, l = Math.hypot(NX, NY, NZ) || 1;
      x = X; y = Y; z = Z; nx = NX / l; ny = NY / l; nz = NZ / l;
    }
    this.P.push(x, y, z); this.N.push(nx, ny, nz); this.C.push(c[0], c[1], c[2], ao); this.M.push(mt[0], mt[1], mt[2], mt[3] || 0); return this.nv++;
  }
  tri(a, b, c) { this.I.push(a, b, c); }
  quadI(a, b, c, d) { this.I.push(a, b, c, a, c, d); }
  // boîte centrée. o.ao=[bas,haut] occlusion par sommet, o.top=couleur du dessus, o.skip=[faces à ignorer]
  box(m, w, h, d, c, mt, o = {}) {
    const hs = [w / 2, h / 2, d / 2], ao = o.ao || [1, 1];
    for (let f = 0; f < 6; f++) {
      if (o.skip && o.skip.includes(f)) continue;
      const [n, u, v, s] = FACES[f], nn = [0, 0, 0]; nn[n] = s;
      const col = (f === 2 && o.top) ? o.top : (f === 3 && o.bot) ? o.bot : c, id = [];
      for (const [du, dv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const p = [0, 0, 0]; p[n] = s * hs[n]; p[u] = du * hs[u]; p[v] = dv * hs[v];
        id.push(this.v(m, p[0], p[1], p[2], nn[0], nn[1], nn[2], col, mt, p[1] < 0 ? ao[0] : ao[1]));
      }
      this.quadI(id[0], id[1], id[2], id[3]);
    }
    return this;
  }
  // boîte à arêtes arrondies (normales lissées sur le chanfrein)
  rbox(m, w, h, d, r, c, mt, o = {}) {
    const hs = [w / 2, h / 2, d / 2], ao = o.ao || [1, 1]; r = Math.min(r, hs[0], hs[1], hs[2]);
    const co = a => [-hs[a], -hs[a] + r, hs[a] - r, hs[a]];
    for (let f = 0; f < 6; f++) {
      const [n, u, v, s] = FACES[f], cu = co(u), cv = co(v), id = [];
      for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
        const p = [0, 0, 0]; p[n] = s * hs[n]; p[u] = cu[i]; p[v] = cv[j];
        const q = [clamp(p[0], -hs[0] + r, hs[0] - r), clamp(p[1], -hs[1] + r, hs[1] - r), clamp(p[2], -hs[2] + r, hs[2] - r)];
        let nx = p[0] - q[0], ny = p[1] - q[1], nz = p[2] - q[2]; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
        id.push(this.v(m, q[0] + nx * r, q[1] + ny * r, q[2] + nz * r, nx, ny, nz, (f === 2 && o.top) ? o.top : c, mt, lerp(ao[0], ao[1], (p[1] + hs[1]) / (2 * hs[1] || 1))));
      }
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) this.quadI(id[j * 4 + i], id[j * 4 + i + 1], id[j * 4 + i + 5], id[j * 4 + i + 4]);
    }
    return this;
  }
  // cylindre/cône le long de +Y, base à y=0. r0 bas, r1 haut.
  cyl(m, r0, r1, h, seg, c, mt, o = {}) {
    const ao = o.ao || [1, 1], sl = (r0 - r1) / (h || 1), base = this.nv;
    for (let k = 0; k <= seg; k++) {
      const a = k / seg * TAU, ca = Math.cos(a), sa = Math.sin(a), l = Math.hypot(1, sl);
      this.v(m, r0 * ca, 0, r0 * sa, ca / l, sl / l, sa / l, c, mt, ao[0]); this.v(m, r1 * ca, h, r1 * sa, ca / l, sl / l, sa / l, o.c1 || c, mt, ao[1]);
    }
    for (let k = 0; k < seg; k++) { const b = base + k * 2; this.quadI(b, b + 1, b + 3, b + 2); }
    if (r1 > 0 && o.capTop !== false) { const ct = this.v(m, 0, h, 0, 0, 1, 0, o.top || c, mt, ao[1]), b = this.nv; for (let k = 0; k <= seg; k++) { const a = k / seg * TAU; this.v(m, r1 * Math.cos(a), h, r1 * Math.sin(a), 0, 1, 0, o.top || c, mt, ao[1]); } for (let k = 0; k < seg; k++) this.tri(ct, b + k + 1, b + k); }
    if (r0 > 0 && o.capBot) { const cb = this.v(m, 0, 0, 0, 0, -1, 0, c, mt, ao[0]), b = this.nv; for (let k = 0; k <= seg; k++) { const a = k / seg * TAU; this.v(m, r0 * Math.cos(a), 0, r0 * Math.sin(a), 0, -1, 0, c, mt, ao[0]); } for (let k = 0; k < seg; k++) this.tri(cb, b + k, b + k + 1); }
    return this;
  }
  sphere(m, r, seg, rings, c, mt, o = {}) {
    const base = this.nv, sy = o.sy || 1, ao = o.ao || [1, 1];
    for (let j = 0; j <= rings; j++) {
      const ph = j / rings * PI, y = Math.cos(ph), rr = Math.sin(ph);
      for (let i = 0; i <= seg; i++) { const th = i / seg * TAU, x = rr * Math.cos(th), z = rr * Math.sin(th); this.v(m, x * r, y * r * sy, z * r, x, y, z, c, mt, lerp(ao[0], ao[1], y * .5 + .5)); }
    }
    for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) { const a = base + j * (seg + 1) + i, b = a + seg + 1; this.tri(a, a + 1, b); this.tri(a + 1, b + 1, b); }
    return this;
  }
  // icosphère facettée (rochers, feuillages). o.jit = déformation, o.seed, o.sy = écrasement vertical, o.smooth
  ico(m, r, det, c, mt, o = {}) {
    const t = (1 + Math.sqrt(5)) / 2; let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }; V = V.map(nrm);
    for (let d = 0; d < det; d++) {
      const cache = {}, mid = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (cache[k] == null) { cache[k] = V.length; V.push(nrm([V[a][0] + V[b][0], V[a][1] + V[b][1], V[a][2] + V[b][2]])); } return cache[k]; }, F2 = [];
      for (const [a, b, c2] of F) { const ab = mid(a, b), bc = mid(b, c2), ca = mid(c2, a); F2.push([a, ab, ca], [b, bc, ab], [c2, ca, bc], [ab, bc, ca]); } F = F2;
    }
    const rnd = rng(o.seed || 7), jit = o.jit || 0, sy = o.sy || 1, ao = o.ao || [1, 1];
    const Pp = V.map(v => { const k = r * (1 + (rnd() - .5) * 2 * jit); return [v[0] * k, v[1] * k * sy, v[2] * k]; });
    for (const [a, b, c2] of F) {
      const A = Pp[a], B = Pp[b], Cc = Pp[c2];
      let nx = (B[1] - A[1]) * (Cc[2] - A[2]) - (B[2] - A[2]) * (Cc[1] - A[1]), ny = (B[2] - A[2]) * (Cc[0] - A[0]) - (B[0] - A[0]) * (Cc[2] - A[2]), nz = (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0]);
      const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l; const id = [];
      for (const [p, vi] of [[A, a], [B, b], [Cc, c2]]) { const sn = o.smooth ? V[vi] : [nx, ny, nz]; id.push(this.v(m, p[0], p[1], p[2], sn[0], sn[1], sn[2], c, mt, lerp(ao[0], ao[1], V[vi][1] * .5 + .5))); }
      this.tri(id[0], id[1], id[2]);
    }
    return this;
  }
  torus(m, R, r, seg, tube, c, mt) {
    const base = this.nv;
    for (let i = 0; i <= seg; i++) for (let j = 0; j <= tube; j++) { const u = i / seg * TAU, w = j / tube * TAU, cu = Math.cos(u), su = Math.sin(u), cw = Math.cos(w), sw = Math.sin(w); this.v(m, (R + r * cw) * cu, r * sw, (R + r * cw) * su, cw * cu, sw, cw * su, c, mt); }
    for (let i = 0; i < seg; i++) for (let j = 0; j < tube; j++) { const a = base + i * (tube + 1) + j, b = a + tube + 1; this.tri(a, a + 1, b + 1); this.tri(a, b + 1, b); }
    return this;
  }
  // rampe : monte de 0 (z=-d/2) à h (z=+d/2)
  wedge(m, w, h, d, c, mt, o = {}) {
    const x = w / 2, z = d / 2, sl = Math.hypot(d, h), ao = o.ao || [1, 1], q = (pts, n, col) => { const id = pts.map(p => this.v(m, p[0], p[1], p[2], n[0], n[1], n[2], col || c, mt, p[1] > 0 ? ao[1] : ao[0])); id.length === 4 ? this.quadI(id[0], id[1], id[2], id[3]) : this.tri(id[0], id[1], id[2]); };
    const A = [-x, 0, -z], B = [x, 0, -z], C = [x, 0, z], D = [-x, 0, z], Ee = [x, h, z], F = [-x, h, z];
    q([A, F, Ee, B], [0, d / sl, -h / sl], o.top); q([D, C, Ee, F], [0, 0, 1]); q([A, B, C, D], [0, -1, 0]); q([B, Ee, C], [1, 0, 0]); q([A, D, F], [-1, 0, 0]); return this;
  }
  // quad horizontal (y constant), face vers +Y
  plane(m, w, d, c, mt, ao = 1) { const x = w / 2, z = d / 2; const id = [[-x, z], [x, z], [x, -z], [-x, -z]].map(p => this.v(m, p[0], 0, p[1], 0, 1, 0, c, mt, ao)); this.quadI(id[0], id[1], id[2], id[3]); return this; }
  // ajoute une autre géométrie transformée
  add(g, m) {
    const b = this.nv;
    for (let i = 0; i < g.nv; i++) this.v(m, g.P[i * 3], g.P[i * 3 + 1], g.P[i * 3 + 2], g.N[i * 3], g.N[i * 3 + 1], g.N[i * 3 + 2], [g.C[i * 4], g.C[i * 4 + 1], g.C[i * 4 + 2]], [g.M[i * 4], g.M[i * 4 + 1], g.M[i * 4 + 2], g.M[i * 4 + 3]], g.C[i * 4 + 3]);
    for (const i of g.I) this.I.push(b + i); return this;
  }
}
// police pixel 5x7 pour enseignes en relief
const FONT = { A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110', C: '01111100001000010000100001000001111', D: '11110100011000110001100011000111110', E: '11111100001000011110100001000011111', F: '11111100001000011110100001000010000', G: '01111100001000010011100011000101111', H: '10001100011000111111100011000110001', I: '11111001000010000100001000010011111', J: '00111000010000100001000011000101110', K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111', M: '10001110111010110001100011000110001', N: '10001110011010110011100011000110001', O: '01110100011000110001100011000101110', P: '11110100011000111110100001000010000', Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001', S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100', U: '10001100011000110001100011000101110', V: '10001100011000110001100010101000100', W: '10001100011000110001101011101110001', X: '10001100010101000100010101000110001', Y: '10001100010101000100001000010000100', Z: '11111000010001000100010001000011111', 0: '01110100011001110101110011000101110', 1: '00100011000010000100001000010001110', 2: '01110100010000100110010001000011111', 3: '11110000010000101110000010000111110', 4: '00010001100101010010111110001000010', 5: '11111100001111000001000011000101110', 6: '01110100001000011110100011000101110', 7: '11111000010001000100010000100001000', 8: '01110100011000101110100011000101110', 9: '01110100011000101111000010000101110', '-': '00000000000000011111000000000000000', '>': '10000010000010000010001000100010000', '<': '00001000100010001000001000001000001', '!': '00100001000010000100001000000000100', ' ': '00000000000000000000000000000000000' };
// texte en cubes dans le plan XY local (hauteur px*7), centré
function geoText(g, m, str, px, depth, c, mt) {
  const n = str.length, tw = n * 6 * px - px, tm = m4.create();
  for (let k = 0; k < n; k++) {
    const f = FONT[str[k].toUpperCase()] || FONT[' '];
    for (let r = 0; r < 7; r++) for (let q = 0; q < 5; q++) if (f[r * 5 + q] === '1') { m4.trs(_t2, -tw / 2 + (k * 6 + q + .5) * px, (3 - r) * px, 0); m4.mul(tm, m, _t2); g.box(tm, px * .96, px * .96, depth, c, mt); }
  }
  return tw;
}

// ---------- shaders ----------
const GL_COMMON = `
precision highp float;
float h13(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float vn3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y),f.z);}
float vn2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h12(i),h12(i+vec2(1,0)),f.x),mix(h12(i+vec2(0,1)),h12(i+vec2(1,1)),f.x),f.y);}
uniform vec3 uZen,uHor,uGnd,uGlow,uSunDir;
uniform float uExp;
vec3 skyBase(vec3 d){
  vec3 c=mix(uHor,uZen,pow(clamp(d.y,0.,1.),.5));
  c=mix(c,uGnd,smoothstep(0.,-.3,d.y));
  float s=max(dot(d,uSunDir),0.);
  c+=uGlow*(pow(s,5.)*.25+pow(s,40.)*.6);
  return c;}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
#ifdef LDR
vec3 fin(vec3 c){return pow(aces(c*uExp),vec3(1./2.2));}
#else
vec3 fin(vec3 c){return c;}
#endif
uniform vec3 uCam; uniform float uFogDen,uFogH;
vec3 fogged(vec3 col,vec3 w){
  vec3 dv=w-uCam; float dist=length(dv); vec3 dn=dv/max(dist,1e-4);
  float hf=exp(-max(w.y-uFogH,0.)*.05);
  float f=1.-exp(-dist*uFogDen*mix(.3,1.,hf));
  vec3 fc=skyBase(normalize(vec3(dn.x,max(dn.y,0.)*.35+.03,dn.z)));
  return mix(col,fc,clamp(f,0.,1.));}
`;
const VS_MAIN = `
precision highp float;
layout(location=0) in vec3 aP; layout(location=1) in vec3 aN; layout(location=2) in vec4 aC; layout(location=3) in vec4 aM;
layout(location=4) in mat4 iM; layout(location=8) in vec4 iC; layout(location=9) in vec4 iT;
uniform mat4 uVP; uniform float uTime,uWindS;
out vec3 vW; out vec3 vN; out vec4 vC; out vec4 vM; out vec2 vX;
void main(){
  vec4 w=iM*vec4(aP,1.);
  float fx=aM.w*255.;
  if(fx>.5&&fx<127.5){float k=fx/127.;float ph=uTime*1.6+w.x*.31+w.z*.27;w.x+=sin(ph)*.13*k*uWindS;w.z+=cos(ph*.83+1.3)*.11*k*uWindS;w.y+=sin(ph*1.31)*.03*k*uWindS;}
  mat3 m=mat3(iM);vec3 s=vec3(dot(m[0],m[0]),dot(m[1],m[1]),dot(m[2],m[2]));
  vN=m*(aN/max(s,vec3(1e-8)));vW=w.xyz;
  vC=vec4(pow(aC.rgb*iC.rgb,vec3(2.2)),aC.a);
  vM=vec4(aM.x*iT.x,max(aM.y,iT.y),aM.z+iT.z,aM.w);
  vX=vec2(iC.a,iT.w);
  gl_Position=uVP*w;
}`;
const FS_EMPTY = `precision highp float; void main(){}`;
const FS_MAIN = `
precision highp sampler2DShadow;
in vec3 vW; in vec3 vN; in vec4 vC; in vec4 vM; in vec2 vX;
uniform vec3 uSunCol,uAmbS,uAmbG; uniform float uTime,uEmis,uFlat;
uniform sampler2DShadow uSh; uniform mat4 uShVP; uniform vec3 uShP;
uniform vec4 uLP[NL]; uniform vec3 uLC[NL]; uniform int uLN;
out vec4 o;
float shadow(vec3 wp,vec3 n,float ndl){
#if ST>0
  if(uShP.y<.5)return 1.;
  vec4 sp=uShVP*vec4(wp+n*(.05+.12*(1.-ndl)),1.);
  vec3 s=sp.xyz*.5+.5;
  if(s.x<0.||s.x>1.||s.y<0.||s.y>1.||s.z>1.)return 1.;
  float t=uShP.x,b=.0012,sum=0.;
#if ST>=9
  for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)sum+=texture(uSh,vec3(s.xy+vec2(x,y)*t*1.3,s.z-b));
  sum/=9.;
#elif ST>=4
  sum=(texture(uSh,vec3(s.xy+vec2(-.6,-.6)*t,s.z-b))+texture(uSh,vec3(s.xy+vec2(.6,-.6)*t,s.z-b))+texture(uSh,vec3(s.xy+vec2(-.6,.6)*t,s.z-b))+texture(uSh,vec3(s.xy+vec2(.6,.6)*t,s.z-b)))*.25;
#else
  sum=texture(uSh,vec3(s.xy,s.z-b));
#endif
  vec2 e=abs(s.xy*2.-1.);
  return mix(sum,1.,smoothstep(.86,1.,max(e.x,e.y)));
#else
  return 1.;
#endif
}
void main(){
  if(vX.x<.999){float d=fract(dot(floor(gl_FragCoord.xy),vec2(.75487765,.56984029)));if(d>vX.x)discard;}
  vec3 N=normalize(vN);
  if(uFlat>.5)N=normalize(cross(dFdx(vW),dFdy(vW)));
  if(!gl_FrontFacing)N=-N;
  vec3 V=normalize(uCam-vW);
  vec3 alb=vC.rgb;float ao=vC.a;float rough=clamp(vM.x,.06,1.);float metal=vM.y;float em=vM.z;
#ifdef DETAIL
  float fx=vM.w*255.;
  float n1=vn3(vW*1.7),n2=vn3(vW*7.3+11.);
  alb*=.84+.32*mix(n1,n2,.35);
  rough=clamp(rough*(.78+.44*n2),.06,1.);
  if(fx>127.5){
    float sc=fx>220.?.25:(fx>180.?.5:1.);
    vec3 q=vW*sc;vec3 e=.5-abs(fract(q)-.5);vec3 fw=fwidth(q);vec3 wd=max(vec3(.012*sc),fw*1.2);
    vec3 l=smoothstep(vec3(0.),wd,e);vec3 an=abs(N);
    float line=min(mix(l.x,1.,step(.7,an.x)),min(mix(l.y,1.,step(.7,an.y)),mix(l.z,1.,step(.7,an.z))));
    line=mix(line,1.,clamp(max(fw.x,max(fw.y,fw.z))*4.,0.,1.));
    alb*=mix(.62,1.,line);
  }
#endif
  vec3 L=uSunDir;float ndl=max(dot(N,L),0.);
  float sh=ndl>0.?shadow(vW,N,ndl):0.;
  vec3 F0=mix(vec3(.04),alb,metal);vec3 dif=alb*(1.-metal);
  float a=rough*rough,a2=a*a;
  vec3 H=normalize(L+V);float ndv=max(dot(N,V),1e-3),ndh=max(dot(N,H),0.),vdh=max(dot(V,H),0.);
  float dd=(ndh*a2-ndh)*ndh+1.;float D=a2/(3.14159*dd*dd+1e-6);
  float k=a*.5;float G=.25/((ndv*(1.-k)+k)*(ndl*(1.-k)+k)+1e-4);
  vec3 F=F0+(1.-F0)*pow(1.-vdh,5.);
  vec3 col=(dif+min(D*G,12.)*F)*uSunCol*ndl*sh;
  vec3 amb=mix(uAmbG,uAmbS,N.y*.5+.5);
  col+=dif*amb*ao;
  vec3 R=reflect(-V,N);vec3 env=mix(skyBase(R),amb,rough*rough);
  vec3 Fa=F0+(max(vec3(1.-rough),F0)-F0)*pow(1.-ndv,5.);
  col+=env*Fa*ao*(.4+.6*smoothstep(-.2,.3,R.y));
  for(int i=0;i<NL;i++){
    if(i>=uLN)break;
    vec3 d=uLP[i].xyz-vW;float r=uLP[i].w;float l2=dot(d,d);
    if(l2<r*r){float l=sqrt(l2);vec3 Lp=d/max(l,1e-4);float at=1.-l/r;at*=at;float nl=max(dot(N,Lp),0.);
      vec3 Hp=normalize(Lp+V);float sp=pow(max(dot(N,Hp),0.),mix(90.,6.,rough))*(1.-rough)*2.;
      col+=(dif*nl+F0*sp*nl)*uLC[i]*at;}
  }
  col+=alb*em*uEmis+vec3(vX.y);
  col=fogged(col,vW);
  o=vec4(fin(col),1.);
}`;
const VS_FS = `
precision highp float; layout(location=0) in vec2 aP; out vec2 vUv;
void main(){vUv=aP*.5+.5;gl_Position=vec4(aP,1.,1.);}`;
const FS_SKY = `
in vec2 vUv; uniform mat4 uIVP; uniform float uTime,uNight,uCloud; uniform vec4 uDisk; uniform vec3 uCloudCol; out vec4 o;
#if CO>0
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<CO;i++){s+=a*vn2(p);p=p*2.07+13.7;a*=.5;}return s;}
#endif
void main(){
  vec4 p=uIVP*vec4(vUv*2.-1.,1.,1.);vec3 d=normalize(p.xyz/p.w-uCam);
  vec3 c=skyBase(d);float s=max(dot(d,uSunDir),0.);
  c+=uDisk.rgb*smoothstep(uDisk.a,uDisk.a+.00022,s);
  if(uNight>.01&&d.y>0.){vec3 q=d*150.;vec3 ci=floor(q);float h=h13(ci);
    float st=step(.9925,h)*smoothstep(.45,.05,length(fract(q)-.5));
    c+=st*uNight*(.55+.45*sin(uTime*2.+h*90.))*vec3(.85,.92,1.)*1.8*smoothstep(0.,.25,d.y);}
#if CO>0
  if(d.y>.02){vec2 uv=d.xz/(d.y+.12)*.9+vec2(uTime*.006,uTime*.003);float f=fbm(uv*1.4);
    float cov=smoothstep(uCloud,uCloud+.28,f);float lit=smoothstep(.25,.95,f)*.55+.45;
    vec3 cc=uCloudCol*lit+uGlow*pow(s,6.)*.7;c=mix(c,cc,cov*smoothstep(.02,.22,d.y)*.93);}
#endif
  o=vec4(fin(c),1.);
}`;
const VS_WATER = `
precision highp float; layout(location=0) in vec3 aP; uniform mat4 uVP; uniform vec4 uWT; out vec3 vW;
void main(){vec3 w=vec3(aP.x*uWT.z+uWT.x,uWT.w,aP.z*uWT.z+uWT.y);vW=w;gl_Position=uVP*vec4(w,1.);}`;
const FS_WATER = `
in vec3 vW; uniform sampler2D uHM; uniform vec4 uHP; uniform float uTime; uniform vec3 uSunCol,uAmbS,uWS,uWD; out vec4 o;
void main(){
  vec2 p=vW.xz;float t=uTime;vec2 g=vec2(0.);
  float dist=length(vW-uCam);float S=mix(1.,.2,smoothstep(30.,220.,dist));
#define WV(dx,dz,f,sp,am) {vec2 dd=vec2(dx,dz);g+=dd*am*f*cos(dot(dd,p)*f+t*sp);}
  WV(.8,.6,.33,1.0,.55) WV(-.6,.8,.61,1.4,.26) WV(.3,-.95,1.27,2.0,.11) WV(-.9,-.3,2.3,2.7,.055)
  g+=(vec2(vn2(p*1.7+t*.35),vn2(p*1.7-t*.3+9.))-.5)*.5;
  vec3 N=normalize(vec3(-g.x*S,1.,-g.y*S));
  float th=texture(uHM,(p-uHP.xy)*uHP.z+.5).r;float depth=uHP.w-th;
  vec3 V=normalize(uCam-vW);float ndv=max(dot(N,V),0.);float fr=.02+.98*pow(1.-ndv,5.);
  vec3 lightc=uAmbS*.9+uSunCol*.3*max(uSunDir.y,0.);
  vec3 body=mix(uWS,uWD,1.-exp(-max(depth,0.)*.42))*lightc;
  vec3 refl=skyBase(reflect(-V,N));
  vec3 H=normalize(uSunDir+V);refl+=uSunCol*pow(max(dot(N,H),0.),420.)*3.;
  vec3 col=mix(body,refl,fr);
  float fm=smoothstep(.75,0.,depth)*(.55+.45*sin(depth*8.-t*2.+vn2(p*.7)*6.283));
  fm=clamp(fm+smoothstep(.16,0.,depth)*.7,0.,1.);
  col=mix(col,vec3(.95)*(uAmbS+uSunCol*.5),fm*.85);
  col=fogged(col,vW);
  float a=smoothstep(-.03,.12,depth);
  o=vec4(fin(col)*a,a);
}`;
const VS_SPR = `
precision highp float; layout(location=0) in vec2 aQ;
layout(location=1) in vec3 iP; layout(location=2) in vec3 iR; layout(location=3) in vec3 iU; layout(location=4) in vec4 iC; layout(location=5) in float iS;
uniform mat4 uVP; out vec2 vQ; out vec4 vC; flat out float vS;
void main(){vQ=aQ;vC=iC;vS=iS;gl_Position=uVP*vec4(iP+iR*aQ.x+iU*aQ.y,1.);}`;
const FS_SPR = `
in vec2 vQ; in vec4 vC; flat in float vS; uniform float uTime; out vec4 o;
void main(){
  float r=length(vQ),a;
  if(vS<.5)a=pow(clamp(1.-r,0.,1.),1.6);
  else if(vS<1.5)a=exp(-vQ.y*vQ.y*5.)*smoothstep(1.,.75,abs(vQ.x));
  else if(vS<2.5)a=smoothstep(.14,0.,abs(r-.84));
  else if(vS<3.5)a=smoothstep(1.,.8,max(abs(vQ.x),abs(vQ.y)));
  else if(vS<4.5){float n=vn2(vQ*2.3+vC.rg*37.);a=clamp(1.-r,0.,1.);a=a*a*(.45+.75*n);}
  else if(vS<5.5)a=clamp(1.-r,0.,1.)*step(r,1.);
  else a=max(exp(-vQ.y*vQ.y*40.)*(1.-abs(vQ.x)),exp(-vQ.x*vQ.x*40.)*(1.-abs(vQ.y)))+pow(clamp(1.-r,0.,1.),3.);
  a*=vC.a;
#ifdef LDR
  o=vec4(pow(clamp(vC.rgb*uExp*.6,0.,1.),vec3(1./2.2))*a,a);
#else
  o=vec4(vC.rgb*a,a);
#endif
}`;
const FS_FX = `
in vec3 vW; in vec3 vN; in vec4 vC; in vec4 vM; in vec2 vX; uniform vec4 uCol; uniform float uTime; out vec4 o;
void main(){vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(1.-abs(dot(N,V)),2.2);
  float sc=.5+.5*sin(vW.y*16.-uTime*5.);float a=uCol.a*(.12+.88*f)+sc*.05*uCol.a;
  o=vec4(fin(uCol.rgb)*a,0.);}`;
const FS_GHOST = `
in vec3 vW; in vec3 vN; in vec4 vC; in vec4 vM; in vec2 vX; uniform vec4 uCol; out vec4 o;
void main(){vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=.35+.65*pow(1.-abs(dot(N,V)),1.5);o=vec4(fin(uCol.rgb)*uCol.a*f,0.);}`;
const FS_SSAO = `
precision highp float; in vec2 vUv; uniform sampler2D uD; uniform vec4 uPr; uniform vec2 uRes; uniform float uRad; out vec4 o;
float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float lz(float d){return uPr.z*uPr.w/(uPr.w-d*(uPr.w-uPr.z));}
vec3 vp(vec2 uv){float z=lz(texture(uD,uv).r);return vec3((uv*2.-1.)*uPr.xy*z,-z);}
void main(){
  float d=texture(uD,vUv).r;if(d>=.99995){o=vec4(1.);return;}
  vec3 p=vp(vUv);vec2 px=1./uRes;
  vec3 pr=vp(vUv+vec2(px.x,0.)),pl=vp(vUv-vec2(px.x,0.)),pu=vp(vUv+vec2(0.,px.y)),pd=vp(vUv-vec2(0.,px.y));
  vec3 dx=abs(pr.z-p.z)<abs(p.z-pl.z)?pr-p:p-pl;vec3 dy=abs(pu.z-p.z)<abs(p.z-pd.z)?pu-p:p-pd;
  vec3 n=normalize(cross(dx,dy));
  vec3 t=normalize(cross(n,abs(n.y)<.9?vec3(0.,1.,0.):vec3(1.,0.,0.)));vec3 b=cross(n,t);
  float rnd=h12(gl_FragCoord.xy)*6.2832;float rad=uRad*clamp(-p.z*.12,.35,1.6);float occ=0.;
  for(int i=0;i<NS;i++){
    float fi=float(i)+.5;float r=sqrt(fi/float(NS));float th=fi*2.39996+rnd;
    vec3 sd=(t*cos(th)+b*sin(th))*r+n*sqrt(max(1.-r*r,0.));
    vec3 sp=p+sd*rad*(.35+.65*fract(fi*.618));
    vec2 suv=(sp.xy/(-sp.z)/uPr.xy)*.5+.5;
    float sz=-lz(texture(uD,suv).r);
    occ+=(sz>=sp.z+.04?1.:0.)*smoothstep(0.,1.,rad/max(abs(p.z-sz),1e-4));
  }
  o=vec4(pow(1.-occ/float(NS),1.7));
}`;
const FS_BLUR4 = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform vec2 uRes; out vec4 o;
void main(){vec2 px=1./uRes;float s=0.;for(int x=-2;x<2;x++)for(int y=-2;y<2;y++)s+=texture(uT,vUv+(vec2(x,y)+.5)*px).r;o=vec4(s/16.);}`;
const FS_RAYM = `
precision highp float; in vec2 vUv; uniform sampler2D uD,uT; out vec4 o;
void main(){float d=texture(uD,vUv).r;vec3 c=texture(uT,vUv).rgb;o=vec4(d>=.99995?min(dot(c,vec3(.33)),5.)/5.:0.);}`;
const FS_RAYB = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform vec2 uSun; out vec4 o;
void main(){vec2 dl=(uSun-vUv)/28.*.92;vec2 uv=vUv;float s=0.,w=1.;for(int i=0;i<28;i++){uv+=dl;s+=texture(uT,uv).r*w;w*=.955;}o=vec4(s/28.);}`;
const FS_BPRE = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform float uThr; out vec4 o;
void main(){vec3 c=texture(uT,vUv).rgb;float l=max(c.r,max(c.g,c.b));float k=max(l-uThr,0.)/max(l,1e-4);o=vec4(min(c*k,vec3(24.)),1.);}`;
const FS_DOWN = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform vec2 uPx; out vec4 o;
void main(){o=vec4((texture(uT,vUv+uPx*vec2(-1.,-1.)).rgb+texture(uT,vUv+uPx*vec2(1.,-1.)).rgb+texture(uT,vUv+uPx*vec2(-1.,1.)).rgb+texture(uT,vUv+uPx*vec2(1.,1.)).rgb)*.25,1.);}`;
const FS_COPY = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform float uK; out vec4 o;
void main(){o=vec4(texture(uT,vUv).rgb*uK,1.);}`;
const FS_COMP = `
precision highp float; in vec2 vUv; uniform sampler2D uScene,uBloom,uAO,uRays;
uniform vec4 uP0,uP1,uP2,uFlash; uniform vec3 uTint,uRayCol; out vec4 o;
float h12(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
  vec2 uv=vUv;vec2 cc=uv-.5;float r2=dot(cc,cc);vec3 c;
  if(uP2.z>0.){vec2 off=cc*r2*uP2.z*.03;c=vec3(texture(uScene,uv+off).r,texture(uScene,uv).g,texture(uScene,uv-off).b);}else c=texture(uScene,uv).rgb;
  if(uP0.z>.5)c*=mix(1.,texture(uAO,uv).r,uP0.z-1.);
  c+=texture(uBloom,uv).rgb*uP0.y;
  if(uP0.w>0.)c+=texture(uRays,uv).r*uRayCol*uP0.w;
  c=aces(c*uP0.x);
  float l=dot(c,vec3(.2126,.7152,.0722));
  c=mix(vec3(l),c,uP1.x*(1.-uP2.y));
  c=(c-.5)*uP1.y+.5;c*=uTint;
  c=pow(max(c,0.),vec3(1./2.2));
  c*=1.-r2*uP1.z*1.6;
  c=mix(c,vec3(.72,.02,.03),clamp(uP2.x*smoothstep(.06,.48,r2)*1.5,0.,.85));
  c=mix(c,uFlash.rgb,uFlash.a);
  c+=(h12(gl_FragCoord.xy+fract(uP2.w)*71.)-.5)*uP1.w;
  o=vec4(c,1.);
}`;
const FS_FXAA = `
precision highp float; in vec2 vUv; uniform sampler2D uT; uniform vec2 uPx; out vec4 o;
void main(){
  vec3 nw=texture(uT,vUv+vec2(-1.,-1.)*uPx).rgb,ne=texture(uT,vUv+vec2(1.,-1.)*uPx).rgb,sw=texture(uT,vUv+vec2(-1.,1.)*uPx).rgb,se=texture(uT,vUv+vec2(1.,1.)*uPx).rgb,m=texture(uT,vUv).rgb;
  vec3 lu=vec3(.299,.587,.114);float lnw=dot(nw,lu),lne=dot(ne,lu),lsw=dot(sw,lu),lse=dot(se,lu),lm=dot(m,lu);
  float lmin=min(lm,min(min(lnw,lne),min(lsw,lse))),lmax=max(lm,max(max(lnw,lne),max(lsw,lse)));
  vec2 dir=vec2(-((lnw+lne)-(lsw+lse)),((lnw+lsw)-(lne+lse)));
  float red=max((lnw+lne+lsw+lse)*.03125,1./128.);float rcp=1./(min(abs(dir.x),abs(dir.y))+red);
  dir=clamp(dir*rcp,vec2(-8.),vec2(8.))*uPx;
  vec3 A=.5*(texture(uT,vUv+dir*(1./3.-.5)).rgb+texture(uT,vUv+dir*(2./3.-.5)).rgb);
  vec3 B=A*.5+.25*(texture(uT,vUv+dir*-.5).rgb+texture(uT,vUv+dir*.5).rgb);
  float lb=dot(B,lu);o=vec4((lb<lmin||lb>lmax)?A:B,1.);
}`;

// ---------- particules ----------
class Particles {
  constructor(max = 1600) { this.max = max; this.n = 0; this.d = new Float32Array(max * 18); }
  // flags : add (0/1), shape (0..6)
  spawn(x, y, z, vx, vy, vz, life, s0, s1, r, g, b, a, add = 1, shape = 0, grav = 0, drag = 0) {
    if (this.n >= this.max) return; const d = this.d, i = this.n++ * 18;
    d[i] = x; d[i + 1] = y; d[i + 2] = z; d[i + 3] = vx; d[i + 4] = vy; d[i + 5] = vz; d[i + 6] = life; d[i + 7] = life; d[i + 8] = s0; d[i + 9] = s1;
    d[i + 10] = r; d[i + 11] = g; d[i + 12] = b; d[i + 13] = a; d[i + 14] = add; d[i + 15] = shape; d[i + 16] = grav; d[i + 17] = drag;
  }
  update(dt) {
    const d = this.d;
    for (let k = this.n - 1; k >= 0; k--) {
      const i = k * 18; d[i + 6] -= dt;
      if (d[i + 6] <= 0) { const l = --this.n * 18; if (l !== i) d.copyWithin(i, l, l + 18); continue; }
      d[i + 4] -= d[i + 16] * dt; const dr = Math.max(0, 1 - d[i + 17] * dt); d[i + 3] *= dr; d[i + 4] *= dr; d[i + 5] *= dr;
      d[i] += d[i + 3] * dt; d[i + 1] += d[i + 4] * dt; d[i + 2] += d[i + 5] * dt;
    }
  }
  draw(R) {
    const d = this.d;
    for (let k = 0; k < this.n; k++) { const i = k * 18, t = 1 - d[i + 6] / d[i + 7]; R.sprite(d[i], d[i + 1], d[i + 2], lerp(d[i + 8], d[i + 9], t), d[i + 10], d[i + 11], d[i + 12], d[i + 13] * (t < .1 ? t * 10 : 1 - smooth(.5, 1, t)), d[i + 14], d[i + 15]); }
  }
}

// ---------- rendu ----------
const QUALITY = {
  bas: { shadow: 0, taps: 1, bloom: false, ssao: false, rays: false, fxaa: false, detail: false, clouds: 2, lights: 4, aoS: 8, chroma: false, maxDpr: 1 },
  moyen: { shadow: 1024, taps: 4, bloom: true, ssao: false, rays: false, fxaa: true, detail: true, clouds: 3, lights: 6, aoS: 8, chroma: false, maxDpr: 1.5 },
  eleve: { shadow: 2048, taps: 9, bloom: true, ssao: true, rays: true, fxaa: true, detail: true, clouds: 4, lights: 8, aoS: 10, chroma: true, maxDpr: 2 },
  ultra: { shadow: 4096, taps: 9, bloom: true, ssao: true, rays: true, fxaa: true, detail: true, clouds: 5, lights: 8, aoS: 16, chroma: true, maxDpr: 2 },
};
function init(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const R = { gl, canvas, w: 1, h: 1, time: 0, hdr: !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')), q: Object.assign({}, QUALITY.eleve), scale: 1, stats: { draws: 0 }, lost: false };
  const env = R.env = { sunDir: [.4, .7, .3], sunCol: [3.4, 3.0, 2.5], ambS: [.34, .44, .6], ambG: [.2, .17, .13], zen: [.08, .24, .62], hor: [.46, .62, .82], gnd: [.2, .22, .24], glow: [1, .7, .4], disk: [40, 34, 26, .9995], cloud: .5, cloudCol: [1.4, 1.4, 1.45], night: 0, fogDen: .004, fogH: 0, exposure: 1, windS: 1, emis: 6, shCenter: [0, 0, 0], shRadius: 45, shDepth: 120 };
  const post = R.post = { bloom: .4, thr: 1.25, sat: 1.08, contrast: 1.06, tint: [1, 1, 1], vignette: .28, grain: .025, flash: [1, 1, 1, 0], dmg: 0, desat: 0, chroma: .35, ao: .85, rays: .5, aoRad: .7 };
  const cam = R.cam = { pos: [0, 2, 6], h: 0, p: 0, roll: 0, fov: 60, near: .1, far: 900, view: m4.create(), proj: m4.create(), vp: m4.create(), ivp: m4.create(), fwd: [0, 0, -1], right: [1, 0, 0], up: [0, 1, 0], vmFov: 52, vmVP: m4.create() };
  cam.update = () => {
    const a = R.w / R.h; m4.trs(_t1, cam.pos[0], cam.pos[1], cam.pos[2], cam.h, cam.p, cam.roll); m4.invert(cam.view, _t1);
    m4.persp(cam.proj, cam.fov * PI / 180, a, cam.near, cam.far); m4.mul(cam.vp, cam.proj, cam.view); m4.invert(cam.ivp, cam.vp);
    m4.persp(_t2, cam.vmFov * PI / 180, a, .02, 20); m4.mul(cam.vmVP, _t2, cam.view);
    const v = cam.view; cam.right[0] = v[0]; cam.right[1] = v[4]; cam.right[2] = v[8]; cam.up[0] = v[1]; cam.up[1] = v[5]; cam.up[2] = v[9]; cam.fwd[0] = -v[2]; cam.fwd[1] = -v[6]; cam.fwd[2] = -v[10];
  };
  // programme
  function mkProg(vs, fs, defs = '') {
    const hd = '#version 300 es\n' + defs;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, hd + s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { const log = gl.getShaderInfoLog(o); console.error('SHADER ' + log + '\n' + (hd + s).split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n')); throw new Error('shader ' + log); } return o; };
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link ' + gl.getProgramInfoLog(p));
    const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  }
  let P = {};
  function buildPrograms() {
    for (const k in P) gl.deleteProgram(P[k].p);
    const q = R.q, d = `#define NL ${q.lights}\n#define ST ${q.shadow ? q.taps : 0}\n#define CO ${q.clouds}\n#define NS ${q.aoS}\n` + (q.detail ? '#define DETAIL\n' : '') + (R.hdr ? '' : '#define LDR\n');
    P = {
      main: mkProg(VS_MAIN, GL_COMMON + FS_MAIN, d), shadow: mkProg(VS_MAIN, FS_EMPTY, d), sky: mkProg(VS_FS, GL_COMMON + FS_SKY, d), water: mkProg(VS_WATER, GL_COMMON + FS_WATER, d),
      spr: mkProg(VS_SPR, GL_COMMON + FS_SPR, d), fx: mkProg(VS_MAIN, GL_COMMON + FS_FX, d), ghost: mkProg(VS_MAIN, GL_COMMON + FS_GHOST, d),
      ssao: mkProg(VS_FS, FS_SSAO, d), blur: mkProg(VS_FS, FS_BLUR4), raym: mkProg(VS_FS, FS_RAYM), rayb: mkProg(VS_FS, FS_RAYB), bpre: mkProg(VS_FS, FS_BPRE), down: mkProg(VS_FS, FS_DOWN), copy: mkProg(VS_FS, FS_COPY), comp: mkProg(VS_FS, FS_COMP), fxaa: mkProg(VS_FS, FS_FXAA),
    };
  }
  // tampons
  const fsVao = gl.createVertexArray(); gl.bindVertexArray(fsVao); const fsB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, fsB); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const quadB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadB); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
  const fsTri = () => { gl.bindVertexArray(fsVao); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  R.mesh = g => {
    const n = g.nv, buf = new ArrayBuffer(n * 32), f = new Float32Array(buf), b = new Uint8Array(buf);
    for (let i = 0; i < n; i++) {
      f[i * 8] = g.P[i * 3]; f[i * 8 + 1] = g.P[i * 3 + 1]; f[i * 8 + 2] = g.P[i * 3 + 2]; f[i * 8 + 3] = g.N[i * 3]; f[i * 8 + 4] = g.N[i * 3 + 1]; f[i * 8 + 5] = g.N[i * 3 + 2];
      for (let k = 0; k < 4; k++) { b[i * 32 + 24 + k] = clamp(Math.round(g.C[i * 4 + k] * 255), 0, 255); b[i * 32 + 28 + k] = clamp(Math.round(g.M[i * 4 + k] * 255), 0, 255); }
    }
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao); const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
    const attr = () => { gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12); gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, 32, 24); gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 4, gl.UNSIGNED_BYTE, true, 32, 28); };
    attr(); const ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); const big = n > 65535; gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, big ? new Uint32Array(g.I) : new Uint16Array(g.I), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, vbo, ibo, count: g.I.length, it: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, attr, tris: g.I.length / 3 };
  };
  // lot d'instances : mat4 + couleur(rgb, a=opacité tramée) + matériau(rugosité×, métal, émissif+, flash)
  R.batch = (mesh, cap = 64) => {
    const b = { mesh, cap, n: 0, data: new Float32Array(cap * 24), dirty: true };
    b.vao = gl.createVertexArray(); gl.bindVertexArray(b.vao); gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo); mesh.attr(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
    b.vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b.vbo); gl.bufferData(gl.ARRAY_BUFFER, b.data.byteLength, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 6; i++) { gl.enableVertexAttribArray(4 + i); gl.vertexAttribPointer(4 + i, 4, gl.FLOAT, false, 96, i * 16); gl.vertexAttribDivisor(4 + i, 1); }
    gl.bindVertexArray(null);
    b.reset = () => { b.n = 0; b.dirty = true; return b; };
    b.add = (m, r = 1, g = 1, bl = 1, rough = 1, metal = 0, emis = 0, alpha = 1, flash = 0) => {
      if (b.n >= b.cap) { b.cap *= 2; const d = new Float32Array(b.cap * 24); d.set(b.data); b.data = d; gl.bindBuffer(gl.ARRAY_BUFFER, b.vbo); gl.bufferData(gl.ARRAY_BUFFER, d.byteLength, gl.DYNAMIC_DRAW); }
      const o = b.n++ * 24, d = b.data; for (let i = 0; i < 16; i++) d[o + i] = m[i];
      d[o + 16] = r; d[o + 17] = g; d[o + 18] = bl; d[o + 19] = alpha; d[o + 20] = rough; d[o + 21] = metal; d[o + 22] = emis; d[o + 23] = flash; b.dirty = true; return b;
    };
    b.upload = () => { if (b.dirty && b.n) { gl.bindBuffer(gl.ARRAY_BUFFER, b.vbo); gl.bufferSubData(gl.ARRAY_BUFFER, 0, b.data, 0, b.n * 24); } b.dirty = false; };
    return b;
  };
  // sprites
  const SPR_MAX = 4096;
  const mkSpr = () => { const s = { n: 0, d: new Float32Array(SPR_MAX * 14), vao: gl.createVertexArray(), vbo: gl.createBuffer() }; gl.bindVertexArray(s.vao); gl.bindBuffer(gl.ARRAY_BUFFER, quadB); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ARRAY_BUFFER, s.vbo); gl.bufferData(gl.ARRAY_BUFFER, s.d.byteLength, gl.DYNAMIC_DRAW); let o = 0; for (const [loc, sz] of [[1, 3], [2, 3], [3, 3], [4, 4], [5, 1]]) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 56, o); gl.vertexAttribDivisor(loc, 1); o += sz * 4; } gl.bindVertexArray(null); return s; };
  const sprA = mkSpr(), sprB = mkSpr();
  R.quad = (x, y, z, rx, ry, rz, ux, uy, uz, r, g, b, a, add = 1, shape = 0) => { const s = add ? sprA : sprB; if (s.n >= SPR_MAX) return; const o = s.n++ * 14, d = s.d; d[o] = x; d[o + 1] = y; d[o + 2] = z; d[o + 3] = rx; d[o + 4] = ry; d[o + 5] = rz; d[o + 6] = ux; d[o + 7] = uy; d[o + 8] = uz; d[o + 9] = r; d[o + 10] = g; d[o + 11] = b; d[o + 12] = a; d[o + 13] = shape; };
  R.sprite = (x, y, z, size, r, g, b, a, add = 1, shape = 0) => { const cr = cam.right, cu = cam.up; R.quad(x, y, z, cr[0] * size, cr[1] * size, cr[2] * size, cu[0] * size, cu[1] * size, cu[2] * size, r, g, b, a, add, shape); };
  R.beam = (x0, y0, z0, x1, y1, z1, w, r, g, b, a) => {
    const ax = (x1 - x0) / 2, ay = (y1 - y0) / 2, az = (z1 - z0) / 2, mx = x0 + ax, my = y0 + ay, mz = z0 + az, tx = cam.pos[0] - mx, ty = cam.pos[1] - my, tz = cam.pos[2] - mz;
    let sx = ay * tz - az * ty, sy = az * tx - ax * tz, sz = ax * ty - ay * tx; const l = Math.hypot(sx, sy, sz) || 1; sx = sx / l * w; sy = sy / l * w; sz = sz / l * w;
    R.quad(mx, my, mz, ax, ay, az, sx, sy, sz, r, g, b, a, 1, 1);
  };
  // files de rendu
  const qO = [], qV = [], qG = [], qF = []; let nO = 0, nV = 0, nG = 0, nF = 0; const lights = new Float32Array(64), lcols = new Float32Array(48); let nL = 0;
  const ONE = [1, 1, 1, 1], IM = [1, 0, 0, 0];
  const item = (arr, i) => arr[i] || (arr[i] = { mesh: null, b: null, model: m4.create(), col: [1, 1, 1, 1], im: [1, 0, 0, 0], flat: false, ns: false, two: false });
  function push(arr, i, mesh, b, model, o) { const it = item(arr, i); it.mesh = mesh; it.b = b; if (model) it.model.set(model); const c = (o && o.col) || ONE, im = (o && o.im) || IM; it.col[0] = c[0]; it.col[1] = c[1]; it.col[2] = c[2]; it.col[3] = c[3] == null ? 1 : c[3]; it.im[0] = im[0]; it.im[1] = im[1]; it.im[2] = im[2]; it.im[3] = im[3] || 0; it.flat = !!(o && o.flat); it.ns = !!(o && o.noShadow); it.two = !!(o && o.two); return it; }
  R.begin = t => { R.time = t; nO = nV = nG = nF = nL = 0; sprA.n = sprB.n = 0; R.stats.draws = 0; cam.update(); };
  R.draw = (mesh, model, o) => { if (o && o.vm) push(qV, nV++, mesh, null, model, o); else push(qO, nO++, mesh, null, model, o); };
  R.drawBatch = (b, o) => { if (!b.n) return; b.upload(); if (o && o.vm) push(qV, nV++, null, b, null, o); else push(qO, nO++, null, b, null, o); };
  R.ghost = (mesh, b, model, col) => { if (b) b.upload(); push(qG, nG++, mesh, b, model, { col }); };
  R.fx = (mesh, model, col) => { push(qF, nF++, mesh, null, model, { col }); };
  R.light = (x, y, z, r, g, b, rad) => { if (nL >= R.q.lights) return; lights[nL * 4] = x; lights[nL * 4 + 1] = y; lights[nL * 4 + 2] = z; lights[nL * 4 + 3] = rad; lcols[nL * 3] = r; lcols[nL * 3 + 1] = g; lcols[nL * 3 + 2] = b; nL++; };
  R.water = null;   // { level, hm: texture, hp:[ox,oz,scale], shallow:[..], deep:[..], size }
  let waterMesh = null;
  R.heightTex = (data, n) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, n, n, 0, gl.RED, gl.FLOAT, data); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
  // cibles
  let T = null;
  const tex = (w, h, ifmt, fmt, type, filt) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, type, null); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
  const fbo = (c, d) => { const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); if (c) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c, 0); else { gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE); } if (d) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, d, 0); return f; };
  const rt = (w, h, hdr, filt = gl.LINEAR) => { w = Math.max(1, w | 0); h = Math.max(1, h | 0); const t = hdr ? tex(w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, filt) : tex(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, filt); return { t, f: fbo(t, null), w, h }; };
  function freeTargets() { if (!T) return; for (const k in T) { const v = T[k]; const arr = Array.isArray(v) ? v : [v]; for (const x of arr) { if (x && x.t) gl.deleteTexture(x.t); if (x && x.f) gl.deleteFramebuffer(x.f); if (x && x.d) gl.deleteTexture(x.d); } } T = null; }
  let shTex = null, shFbo = null, shSize = 0;
  function targets() {
    freeTargets(); const w = R.w, h = R.h; T = {};
    const d = tex(w, h, gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, gl.NEAREST);
    const c = R.hdr ? tex(w, h, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.LINEAR) : tex(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR);
    T.scene = { t: c, d, f: fbo(c, d), w, h };
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE && R.hdr) { R.hdr = false; buildPrograms(); return targets(); }
    T.ldr = rt(w, h, false);
    if (R.hdr) {
      T.ao = rt(w / 2, h / 2, false); T.ao2 = rt(w / 2, h / 2, false); T.ra = rt(w / 4, h / 4, false); T.rb = rt(w / 4, h / 4, false);
      T.bl = []; let bw = w >> 1, bh = h >> 1; for (let i = 0; i < 5 && bw > 4 && bh > 4; i++) { T.bl.push(rt(bw, bh, true)); bw >>= 1; bh >>= 1; }
    }
  }
  function shadowTarget() {
    if (shSize === R.q.shadow) return; if (shTex) { gl.deleteTexture(shTex); gl.deleteFramebuffer(shFbo); shTex = null; } shSize = R.q.shadow; if (!shSize) return;
    shTex = tex(shSize, shSize, gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL); shFbo = fbo(null, shTex);
  }
  R.setQuality = q => { Object.assign(R.q, q); buildPrograms(); shadowTarget(); R.resize(true); };
  R.resize = force => {
    const dpr = Math.min(window.devicePixelRatio || 1, R.q.maxDpr) * R.scale;
    const w = Math.max(64, Math.round(canvas.clientWidth * dpr)), h = Math.max(64, Math.round(canvas.clientHeight * dpr));
    if (!force && w === R.w && h === R.h) return; R.w = w; R.h = h; canvas.width = w; canvas.height = h; targets();
  };
  const shVP = m4.create(), shV = m4.create(), shP = m4.create();
  function frameU(pr, vp) {
    const u = pr.u; gl.useProgram(pr.p); gl.uniformMatrix4fv(u.uVP, false, vp); gl.uniform3fv(u.uCam, cam.pos); gl.uniform3fv(u.uZen, env.zen); gl.uniform3fv(u.uHor, env.hor); gl.uniform3fv(u.uGnd, env.gnd); gl.uniform3fv(u.uGlow, env.glow); gl.uniform3fv(u.uSunDir, env.sunDir);
    gl.uniform1f(u.uExp, env.exposure); gl.uniform1f(u.uFogDen, env.fogDen); gl.uniform1f(u.uFogH, env.fogH); gl.uniform1f(u.uTime, R.time); gl.uniform1f(u.uWindS, env.windS); gl.uniform3fv(u.uSunCol, env.sunCol); gl.uniform3fv(u.uAmbS, env.ambS); gl.uniform3fv(u.uAmbG, env.ambG);
  }
  function drawItem(it, u) {
    if (it.two) gl.disable(gl.CULL_FACE);
    if (u.uFlat) gl.uniform1f(u.uFlat, it.flat ? 1 : 0);
    if (it.b) { gl.bindVertexArray(it.b.vao); gl.drawElementsInstanced(gl.TRIANGLES, it.b.mesh.count, it.b.mesh.it, 0, it.b.n); }
    else { const m = it.model; gl.bindVertexArray(it.mesh.vao); gl.vertexAttrib4f(4, m[0], m[1], m[2], m[3]); gl.vertexAttrib4f(5, m[4], m[5], m[6], m[7]); gl.vertexAttrib4f(6, m[8], m[9], m[10], m[11]); gl.vertexAttrib4f(7, m[12], m[13], m[14], m[15]); gl.vertexAttrib4fv(8, it.col); gl.vertexAttrib4fv(9, it.im); gl.drawElements(gl.TRIANGLES, it.mesh.count, it.mesh.it, 0); }
    if (it.two) gl.enable(gl.CULL_FACE); R.stats.draws++;
  }
  const bindT = (unit, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); };
  const pass = (target, pr) => { gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.f : null); gl.viewport(0, 0, target ? target.w : R.w, target ? target.h : R.h); gl.useProgram(pr.p); return pr.u; };
  R.end = () => {
    if (R.lost || !T) return; const q = R.q, W = R.w, H = R.h;
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.disable(gl.BLEND);
    // 1. ombres
    const shOn = q.shadow && shTex && env.sunCol[0] + env.sunCol[1] + env.sunCol[2] > .02;
    if (shOn) {
      const c = env.shCenter, r = env.shRadius, s = env.sunDir, D = env.shDepth, up = Math.abs(s[1]) > .95;
      m4.lookAt(shV, c[0] + s[0] * D, c[1] + s[1] * D, c[2] + s[2] * D, c[0], c[1], c[2], up ? 0 : 0, up ? 0 : 1, up ? 1 : 0); m4.ortho(shP, -r, r, -r, r, 1, D * 2); m4.mul(shVP, shP, shV);
      gl.bindFramebuffer(gl.FRAMEBUFFER, shFbo); gl.viewport(0, 0, shSize, shSize); gl.clear(gl.DEPTH_BUFFER_BIT); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(2, 4);
      const u = P.shadow.u; gl.useProgram(P.shadow.p); gl.uniformMatrix4fv(u.uVP, false, shVP); gl.uniform1f(u.uTime, R.time); gl.uniform1f(u.uWindS, env.windS);
      for (let i = 0; i < nO; i++) if (!qO[i].ns) drawItem(qO[i], u);
      gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    // 2. scène
    gl.bindFramebuffer(gl.FRAMEBUFFER, T.scene.f); gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    frameU(P.main, cam.vp); let u = P.main.u;
    gl.uniform1f(u.uEmis, env.emis); bindT(0, shTex); gl.uniform1i(u.uSh, 0); gl.uniformMatrix4fv(u.uShVP, false, shVP); gl.uniform3f(u.uShP, 1 / (shSize || 1), shOn ? 1 : 0, 0);
    gl.uniform4fv(u.uLP, lights.subarray(0, q.lights * 4)); gl.uniform3fv(u.uLC, lcols.subarray(0, q.lights * 3)); gl.uniform1i(u.uLN, nL);
    for (let i = 0; i < nO; i++) drawItem(qO[i], u);
    if (nV) { gl.depthRange(0, .08); gl.uniformMatrix4fv(u.uVP, false, cam.vmVP); for (let i = 0; i < nV; i++) drawItem(qV[i], u); gl.depthRange(0, 1); }
    // ciel
    gl.depthFunc(gl.LEQUAL); gl.depthMask(false); frameU(P.sky, cam.vp); u = P.sky.u; gl.uniformMatrix4fv(u.uIVP, false, cam.ivp); gl.uniform1f(u.uNight, env.night); gl.uniform1f(u.uCloud, env.cloud); gl.uniform4fv(u.uDisk, env.disk); gl.uniform3fv(u.uCloudCol, env.cloudCol); fsTri();
    gl.depthFunc(gl.LESS); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // eau
    if (R.water) {
      const wt = R.water; if (!waterMesh) { const g = new Geo(); g.plane(null, 1, 1, [1, 1, 1], [1, 0, 0, 0]); waterMesh = R.mesh(g); }
      frameU(P.water, cam.vp); u = P.water.u; bindT(6, wt.hm); gl.uniform1i(u.uHM, 6); gl.uniform4f(u.uHP, wt.hp[0], wt.hp[1], wt.hp[2], wt.level); gl.uniform3fv(u.uWS, wt.shallow); gl.uniform3fv(u.uWD, wt.deep);
      gl.uniform4f(u.uWT, cam.pos[0], cam.pos[2], wt.size, wt.level); gl.bindVertexArray(waterMesh.vao); gl.drawElements(gl.TRIANGLES, 6, waterMesh.it, 0);
    }
    gl.blendFunc(gl.ONE, gl.ONE);
    if (nG) { gl.depthFunc(gl.GREATER); frameU(P.ghost, cam.vp); u = P.ghost.u; for (let i = 0; i < nG; i++) { gl.uniform4fv(u.uCol, qG[i].col); drawItem(qG[i], u); } gl.depthFunc(gl.LESS); }
    if (nF) { gl.disable(gl.CULL_FACE); frameU(P.fx, cam.vp); u = P.fx.u; for (let i = 0; i < nF; i++) { gl.uniform4fv(u.uCol, qF[i].col); drawItem(qF[i], u); } gl.enable(gl.CULL_FACE); }
    if (sprA.n || sprB.n) {
      gl.disable(gl.CULL_FACE); gl.useProgram(P.spr.p); u = P.spr.u; gl.uniformMatrix4fv(u.uVP, false, cam.vp); gl.uniform1f(u.uTime, R.time); gl.uniform1f(u.uExp, env.exposure);
      if (sprB.n) { gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.bindVertexArray(sprB.vao); gl.bindBuffer(gl.ARRAY_BUFFER, sprB.vbo); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprB.d, 0, sprB.n * 14); gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, sprB.n); }
      if (sprA.n) { gl.blendFunc(gl.ONE, gl.ONE); gl.bindVertexArray(sprA.vao); gl.bindBuffer(gl.ARRAY_BUFFER, sprA.vbo); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprA.d, 0, sprA.n * 14); gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, sprA.n); }
      gl.enable(gl.CULL_FACE);
    }
    gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    // 3. post-traitement
    if (!R.hdr) { if (q.fxaa) { u = pass(null, P.fxaa); bindT(1, T.scene.t); gl.uniform1i(u.uT, 1); gl.uniform2f(u.uPx, 1 / W, 1 / H); } else { u = pass(null, P.copy); bindT(1, T.scene.t); gl.uniform1i(u.uT, 1); gl.uniform1f(u.uK, 1); } fsTri(); return; }
    const th = Math.tan(cam.fov * PI / 360);
    if (q.ssao) {
      u = pass(T.ao, P.ssao); bindT(2, T.scene.d); gl.uniform1i(u.uD, 2); gl.uniform4f(u.uPr, th * W / H, th, cam.near, cam.far); gl.uniform2f(u.uRes, T.ao.w, T.ao.h); gl.uniform1f(u.uRad, post.aoRad); fsTri();
      u = pass(T.ao2, P.blur); bindT(3, T.ao.t); gl.uniform1i(u.uT, 3); gl.uniform2f(u.uRes, T.ao.w, T.ao.h); fsTri();
    }
    let rayK = 0;
    if (q.rays && post.rays > 0) {
      const s = env.sunDir, f = cam.fwd, dt = s[0] * f[0] + s[1] * f[1] + s[2] * f[2];
      if (dt > .05) {
        const v = cam.vp, x = cam.pos[0] + s[0] * 500, y = cam.pos[1] + s[1] * 500, z = cam.pos[2] + s[2] * 500, cw = v[3] * x + v[7] * y + v[11] * z + v[15];
        const sx = (v[0] * x + v[4] * y + v[8] * z + v[12]) / cw * .5 + .5, sy = (v[1] * x + v[5] * y + v[9] * z + v[13]) / cw * .5 + .5; rayK = smooth(.05, .5, dt) * post.rays;
        u = pass(T.ra, P.raym); bindT(2, T.scene.d); bindT(1, T.scene.t); gl.uniform1i(u.uD, 2); gl.uniform1i(u.uT, 1); fsTri();
        u = pass(T.rb, P.rayb); bindT(5, T.ra.t); gl.uniform1i(u.uT, 5); gl.uniform2f(u.uSun, sx, sy); fsTri();
      }
    }
    const bl = T.bl, bloomOn = q.bloom && bl.length > 1;
    if (bloomOn) {
      u = pass(bl[0], P.bpre); bindT(1, T.scene.t); gl.uniform1i(u.uT, 1); gl.uniform1f(u.uThr, post.thr); fsTri();
      for (let i = 1; i < bl.length; i++) { u = pass(bl[i], P.down); bindT(4, bl[i - 1].t); gl.uniform1i(u.uT, 4); gl.uniform2f(u.uPx, 1 / bl[i - 1].w, 1 / bl[i - 1].h); fsTri(); }
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      for (let i = bl.length - 1; i > 0; i--) { u = pass(bl[i - 1], P.copy); bindT(4, bl[i].t); gl.uniform1i(u.uT, 4); gl.uniform1f(u.uK, .85); fsTri(); }
      gl.disable(gl.BLEND);
    }
    u = pass(q.fxaa ? T.ldr : null, P.comp);
    bindT(1, T.scene.t); gl.uniform1i(u.uScene, 1); bindT(4, bloomOn ? bl[0].t : null); gl.uniform1i(u.uBloom, 4); bindT(3, q.ssao ? T.ao2.t : null); gl.uniform1i(u.uAO, 3); bindT(5, rayK > 0 ? T.rb.t : null); gl.uniform1i(u.uRays, 5);
    gl.uniform4f(u.uP0, env.exposure, bloomOn ? post.bloom : 0, q.ssao ? 1 + post.ao : 0, rayK); gl.uniform4f(u.uP1, post.sat, post.contrast, post.vignette, post.grain);
    gl.uniform4f(u.uP2, post.dmg, post.desat, q.chroma ? post.chroma : 0, R.time); gl.uniform4fv(u.uFlash, post.flash); gl.uniform3fv(u.uTint, post.tint); gl.uniform3f(u.uRayCol, env.sunCol[0] * .22, env.sunCol[1] * .22, env.sunCol[2] * .22); fsTri();
    if (q.fxaa) { u = pass(null, P.fxaa); bindT(7, T.ldr.t); gl.uniform1i(u.uT, 7); gl.uniform2f(u.uPx, 1 / W, 1 / H); fsTri(); }
  };
  // projection monde -> écran (pixels CSS). renvoie false si derrière
  R.project = (x, y, z, o) => { const v = cam.vp, w = v[3] * x + v[7] * y + v[11] * z + v[15]; if (w <= .01) return false; o[0] = ((v[0] * x + v[4] * y + v[8] * z + v[12]) / w * .5 + .5) * canvas.clientWidth; o[1] = (1 - ((v[1] * x + v[5] * y + v[9] * z + v[13]) / w * .5 + .5)) * canvas.clientHeight; o[2] = w; return true; };
  // rayon depuis un point écran (pixels CSS)
  R.ray = (px, py) => { const nx = px / canvas.clientWidth * 2 - 1, ny = 1 - py / canvas.clientHeight * 2, v = cam.ivp; const f = (z, o) => { const w = v[3] * nx + v[7] * ny + v[11] * z + v[15]; o[0] = (v[0] * nx + v[4] * ny + v[8] * z + v[12]) / w; o[1] = (v[1] * nx + v[5] * ny + v[9] * z + v[13]) / w; o[2] = (v[2] * nx + v[6] * ny + v[10] * z + v[14]) / w; return o; }; const a = f(-1, [0, 0, 0]), b = f(1, [0, 0, 0]); const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); return { o: a, d: [(b[0] - a[0]) / l, (b[1] - a[1]) / l, (b[2] - a[2]) / l] }; };
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); R.lost = true; if (R.onLost) R.onLost(); });
  buildPrograms(); shadowTarget(); R.resize(true);
  // maillages unité pour l'instanciation
  const W1 = [1, 1, 1], M1 = [1, 0, 0, 0];
  R.unit = { box: R.mesh(new Geo().box(null, 1, 1, 1, W1, M1)), rbox: R.mesh(new Geo().rbox(null, 1, 1, 1, .16, W1, M1)), sphere: R.mesh(new Geo().sphere(null, .5, 14, 9, W1, M1)), cyl: R.mesh(new Geo().cyl(null, .5, .5, 1, 14, W1, M1, { capBot: true })) };
  return R;
}
return { m4, Geo, geoText, Particles, init, QUALITY, clamp, lerp, smooth, hex, rng, childTRS, WIND, GRID1, GRID2, GRID4, PI, TAU };
})();
