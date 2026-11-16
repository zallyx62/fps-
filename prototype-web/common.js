'use strict';
/* ===================================================================
   COUCHE COMMUNE — réglages, entrées (clavier/souris/manette/tactile),
   sons procéduraux, petits utilitaires d'interface.
   =================================================================== */
const $ = (s, r) => (r || document).querySelector(s);
function h(tag, at, ...kids) {
  const e = document.createElement(tag);
  if (at) for (const k in at) { const v = at[k]; if (v == null || v === false) continue; if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v); else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v); }
  for (const c of kids.flat(3)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return e;
}
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }, del(k) { try { localStorage.removeItem(k); } catch (e) { } } };
const { clamp, lerp, smooth, hex, m4, PI, TAU } = E;
const rnd = (a = 1, b) => b == null ? Math.random() * a : a + Math.random() * (b - a);
const rid = n => { const c = 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < n; i++) s += c[Math.random() * c.length | 0]; return s; };
const num = (v, d = 0) => typeof v === 'number' && isFinite(v) ? v : d;
const cleanText = (t, n = 200) => String(t == null ? '' : t).replace(/[\u0000-\u001f\u007f-\u009f​-‏ -‮⁠-⁯﻿]/g, '').slice(0, n);
const INFRAME = !!(window.claude && window.claude.use);
const QS = new URLSearchParams(location.search);
const isFr = /^fr/i.test(navigator.language || 'fr');
const angDiff = (a, b) => { let d = (a - b) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };

/* ---------- noms de touches ---------- */
const KEYN = { Space: 'Espace', ShiftLeft: 'Maj', ShiftRight: 'Maj D', ControlLeft: 'Ctrl', ControlRight: 'Ctrl D', AltLeft: 'Alt', AltRight: 'Alt Gr', Tab: 'Tab', Enter: 'Entrée', Escape: 'Échap', Backspace: 'Retour', CapsLock: 'Verr Maj', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Mouse0: 'Clic gauche', Mouse1: 'Clic molette', Mouse2: 'Clic droit', Mouse3: 'Souris 4', Mouse4: 'Souris 5', WheelUp: 'Molette ↑', WheelDown: 'Molette ↓' };
const AZ = { KeyQ: 'A', KeyW: 'Z', KeyA: 'Q', KeyZ: 'W', KeyM: ',', Semicolon: 'M' };
let layoutMap = null;
try { if (navigator.keyboard && navigator.keyboard.getLayoutMap) navigator.keyboard.getLayoutMap().then(m => { layoutMap = m; if (Cfg.isOpen) Cfg.build(); if (window.onLayout) window.onLayout(); }).catch(() => { }); } catch (e) { }
function keyName(c) {
  if (!c) return ''; if (KEYN[c]) return KEYN[c];
  if (layoutMap) { const k = layoutMap.get(c); if (k) return k.length === 1 ? k.toUpperCase() : k; }
  if (isFr && AZ[c]) return AZ[c];
  if (c.startsWith('Key')) return c.slice(3); if (c.startsWith('Digit')) return c.slice(5); if (c.startsWith('Numpad')) return 'Num ' + c.slice(6); return c;
}
const bindName = a => keyName((Cfg.binds[a] || [])[0]) || keyName((Cfg.binds[a] || [])[1]) || '?';

/* ---------- réglages ---------- */
const Cfg = {
  ns: '', tabs: [], v: {}, def: {}, binds: {}, bindDef: {}, subs: [], cur: 0, isOpen: false, waiting: null, onClose: null,
  init(ns, tabs, binds) {
    this.ns = ns; this.tabs = tabs; this.bindDef = binds;
    for (const t of tabs) for (const it of t.items) if (it.k) this.def[it.k] = typeof it.d === 'function' ? it.d() : it.d;
    const sv = store.get(ns + ':cfg', {}) || {};
    this.v = Object.assign({}, this.def, sv.v || {}); this.binds = {};
    for (const a in binds) this.binds[a] = (sv.b && Array.isArray(sv.b[a])) ? sv.b[a].slice(0, 2) : binds[a].slice();
    const cap = e => {
      const w = this.waiting; if (!w) return; e.preventDefault(); e.stopPropagation();
      let code = null;
      if (e.type === 'keydown') { if (e.code === 'Escape') { this.waiting = null; this.build(); return; } code = (e.code === 'Backspace' || e.code === 'Delete') ? '' : e.code; }
      else if (e.type === 'mousedown') code = 'Mouse' + e.button; else if (e.type === 'wheel') code = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
      if (code == null) return;
      if (code) for (const a in this.binds) this.binds[a] = this.binds[a].map(c => c === code ? '' : c);
      const b = this.binds[w.a] || (this.binds[w.a] = []); b[w.s] = code; this.waiting = null; this.save(); this.build(); for (const f of this.subs) f('binds');
    };
    addEventListener('keydown', cap, true); addEventListener('mousedown', cap, true); addEventListener('wheel', cap, { capture: true, passive: false });
  },
  save() { store.set(this.ns + ':cfg', { v: this.v, b: this.binds }); },
  set(k, val, silent) { if (this.v[k] === val) return; this.v[k] = val; this.save(); if (!silent) for (const f of this.subs) f(k, val); },
  on(f) { this.subs.push(f); },
  open(i) { if (i != null) this.cur = i; this.isOpen = true; $('#settings').hidden = false; this.build(); },
  close() { if (!this.isOpen) return; this.isOpen = false; this.waiting = null; $('#settings').hidden = true; if (this.onClose) this.onClose(); },
  resetTab() { const t = this.tabs[this.cur]; for (const it of t.items) { if (it.k) this.set(it.k, this.def[it.k]); if (it.t === 'bind') this.binds[it.a] = this.bindDef[it.a].slice(); } this.save(); for (const f of this.subs) f('binds'); this.build(); },
  row(it) {
    if (it.t === 'head') return h('div', { class: 'row-h' }, it.l);
    const fmt = it.f || (v => String(v)), id = 'cfg-' + (it.k || it.a || it.l).replace(/\W/g, ''), ctl = h('div', { class: 'ctl' });
    const lab = h('span', null, it.l, it.h ? h('small', null, typeof it.h === 'function' ? it.h() : it.h) : null);
    if (it.t === 'range') { const out = h('output', null, fmt(this.v[it.k])); ctl.append(h('input', { type: 'range', id, min: it.min, max: it.max, step: it.step, value: this.v[it.k], 'aria-label': it.l, oninput: e => { const val = +e.target.value; out.textContent = fmt(val); this.set(it.k, val); } }), out); }
    else if (it.t === 'toggle') { const b = h('button', { class: 'sw', id, role: 'switch', 'aria-checked': String(!!this.v[it.k]), 'aria-label': it.l, onclick: () => { const nv = !this.v[it.k]; b.setAttribute('aria-checked', String(nv)); this.set(it.k, nv); if (it.re) this.build(); } }); ctl.append(b); }
    else if (it.t === 'select') ctl.append(h('select', { id, 'aria-label': it.l, onchange: e => { this.set(it.k, e.target.value); if (it.re) this.build(); } }, it.o.map(([v, l]) => h('option', { value: v, selected: String(this.v[it.k]) === String(v) }, l))));
    else if (it.t === 'text') ctl.append(h('input', { class: 'txt', id, type: 'text', maxlength: it.max || 16, value: this.v[it.k], 'aria-label': it.l, autocomplete: 'off', onchange: e => { const val = cleanText(e.target.value, it.max || 16).trim() || this.def[it.k]; e.target.value = val; this.set(it.k, val); } }));
    else if (it.t === 'bind') for (let s = 0; s < 2; s++) { const w = this.waiting && this.waiting.a === it.a && this.waiting.s === s; ctl.append(h('button', { class: 'kb' + (w ? ' wait' : ''), 'aria-label': it.l + ' touche ' + (s + 1), onclick: () => { this.waiting = { a: it.a, s }; this.build(); } }, w ? 'Appuie…' : (keyName((this.binds[it.a] || [])[s]) || '—'))); }
    else if (it.t === 'btn') ctl.append(h('button', { class: 'btn sm', id, onclick: () => it.fn() }, it.b || 'OK'));
    else if (it.t === 'info') ctl.append(h('small', null, typeof it.v === 'function' ? it.v() : it.v));
    return h('div', { class: 'row' }, lab, ctl);
  },
  build() {
    const root = $('#settings'), sc = root.querySelector('.rows'), top = sc ? sc.scrollTop : 0; root.textContent = '';
    const t = this.tabs[this.cur], rows = h('div', { class: 'rows' });
    for (const it of t.items) { if (it.show && !it.show()) continue; rows.append(this.row(it)); }
    root.append(h('div', { class: 'sheet', role: 'dialog', 'aria-label': 'Réglages' },
      h('div', { class: 'sheet-h' }, h('b', null, 'Réglages'), h('button', { class: 'x', 'aria-label': 'Fermer les réglages', onclick: () => this.close() }, '✕')),
      h('div', { class: 'tabs', role: 'tablist' }, this.tabs.map((tb, i) => (tb.show && !tb.show()) ? null : h('button', { class: 'tab' + (i === this.cur ? ' on' : ''), role: 'tab', 'aria-selected': String(i === this.cur), onclick: () => { this.cur = i; this.waiting = null; this.build(); } }, tb.n))),
      rows,
      h('div', { class: 'sheet-f' }, h('small', null, t.note || 'Les réglages sont enregistrés sur cet appareil.'), h('button', { class: 'btn sm', onclick: () => this.resetTab() }, 'Réinitialiser cet onglet'))));
    rows.scrollTop = top;
  },
};

/* ---------- entrées ---------- */
const Inp = {
  keys: new Set(), hitQ: new Set(), act: {}, actP: new Set(), mx: 0, my: 0, tx: 0, ty: 0, jx: 0, jy: 0, gx: 0, gy: 0, glx: 0, gly: 0, wheel: 0,
  locked: false, lockFail: false, block: false, mouse: [0, 0], canvas: null, onLock: null, onKey: null, onKeyUp: null, padMap: {}, padPrev: [], lastDev: 'kb',
  init(canvas) {
    this.canvas = canvas;
    const typing = e => { const t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA'); };
    const bound = c => { for (const a in Cfg.binds) if (Cfg.binds[a].includes(c)) return true; return false; };
    addEventListener('keydown', e => {
      if (Cfg.waiting) return; if (this.onKey && this.onKey(e.code, e) === true) { e.preventDefault(); return; }
      if (typing(e)) return; this.lastDev = 'kb';
      if (!e.repeat) { this.keys.add(e.code); this.hitQ.add(e.code); }
      if (bound(e.code) || e.code === 'Space' || e.code === 'Tab' || e.code.startsWith('Arrow')) e.preventDefault();
    });
    addEventListener('keyup', e => { this.keys.delete(e.code); if (this.onKeyUp) this.onKeyUp(e.code, e); });
    addEventListener('blur', () => { this.keys.clear(); for (const k in this.act) this.act[k] = false; });
    canvas.addEventListener('mousedown', e => { if (Cfg.waiting) return; this.keys.add('Mouse' + e.button); this.hitQ.add('Mouse' + e.button); this.lastDev = 'kb'; if (this.onMouse) this.onMouse(e); });
    addEventListener('mouseup', e => { this.keys.delete('Mouse' + e.button); });
    canvas.addEventListener('wheel', e => { e.preventDefault(); this.hitQ.add(e.deltaY < 0 ? 'WheelUp' : 'WheelDown'); this.wheel += Math.sign(e.deltaY); }, { passive: false });
    addEventListener('mousemove', e => { this.mouse[0] = e.clientX; this.mouse[1] = e.clientY; this.mx += e.movementX || 0; this.my += e.movementY || 0; });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === canvas; if (this.onLock) this.onLock(this.locked); });
    document.addEventListener('pointerlockerror', () => { this.lockFail = true; });
  },
  down(a) { if (this.block) return false; if (this.act[a]) return true; const b = Cfg.binds[a]; if (b) for (const c of b) if (c && this.keys.has(c)) return true; return false; },
  hit(a) { if (this.block) return false; if (this.actP.has(a)) return true; const b = Cfg.binds[a]; if (b) for (const c of b) if (c && this.hitQ.has(c)) return true; return false; },
  axis(neg, pos) { return (this.down(pos) ? 1 : 0) - (this.down(neg) ? 1 : 0); },
  end() { this.hitQ.clear(); this.actP.clear(); this.mx = this.my = this.tx = this.ty = 0; this.wheel = 0; },
  lock() { try { const p = this.canvas.requestPointerLock && this.canvas.requestPointerLock(); if (p && p.catch) p.catch(() => { this.lockFail = true; }); } catch (e) { this.lockFail = true; } },
  unlock() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { } },
  pad() {
    let gp = null; try { const l = navigator.getGamepads ? navigator.getGamepads() : []; for (const g of l) if (g && g.connected) { gp = g; if (g.mapping === 'standard') break; } } catch (e) { }
    if (!gp) { this.gx = this.gy = this.glx = this.gly = 0; return false; }
    const dz = Cfg.v.padDead == null ? .15 : Cfg.v.padDead, ax = i => { const v = gp.axes[i] || 0; return Math.abs(v) < dz ? 0 : (v - Math.sign(v) * dz) / (1 - dz); };
    this.gx = ax(0); this.gy = -ax(1); this.glx = ax(2); this.gly = ax(3); if (this.gx || this.gy || this.glx || this.gly) this.lastDev = 'pad';
    for (const i in this.padMap) { const b = gp.buttons[i], on = !!(b && (b.pressed || b.value > .4)), a = this.padMap[i]; if (on && !this.padPrev[i]) { this.actP.add(a); this.lastDev = 'pad'; } if (on !== !!this.padPrev[i]) this.act[a] = on; this.padPrev[i] = on; }
    return true;
  },
};

/* ---------- commandes tactiles ---------- */
const Touch = {
  on: false, el: null, btns: {}, opt: {},
  init(defs, opt = {}) {
    this.opt = opt; const el = this.el = $('#touch'); el.textContent = ''; this.btns = {};
    const zone = h('div', { class: 'tzone' }), joy = h('div', { id: 'joy' }, h('i')); el.append(zone, joy);
    let jp = null; const lp = new Map(), R0 = 58;
    zone.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return; e.preventDefault(); try { zone.setPointerCapture(e.pointerId); } catch (_) { }
      const left = Cfg.v.tLeft ? e.clientX > innerWidth * .58 : e.clientX < innerWidth * .42;
      if (opt.joy !== false && left && !jp) { jp = { id: e.pointerId, x: e.clientX, y: e.clientY }; joy.style.display = 'block'; joy.style.left = (e.clientX - 62) + 'px'; joy.style.top = (e.clientY - 62) + 'px'; joy.firstChild.style.transform = ''; }
      else lp.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now(), mv: 0 });
    });
    zone.addEventListener('pointermove', e => {
      if (jp && e.pointerId === jp.id) { let dx = e.clientX - jp.x, dy = e.clientY - jp.y; const l = Math.hypot(dx, dy); if (l > R0) { dx *= R0 / l; dy *= R0 / l; } Inp.jx = dx / R0; Inp.jy = -dy / R0; joy.firstChild.style.transform = `translate(${dx}px,${dy}px)`; return; }
      const p = lp.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y;
      if (lp.size >= 2 && opt.onPinch) { const o = [...lp.values()].find(q => q !== p); const d0 = Math.hypot(p.x - o.x, p.y - o.y), d1 = Math.hypot(e.clientX - o.x, e.clientY - o.y); if (d0 > 1) opt.onPinch(d1 / d0); p.mv += 99; }
      else { Inp.tx += dx; Inp.ty += dy; p.mv += Math.abs(dx) + Math.abs(dy); }
      p.x = e.clientX; p.y = e.clientY;
    });
    const up = e => { if (jp && e.pointerId === jp.id) { jp = null; Inp.jx = Inp.jy = 0; joy.style.display = 'none'; return; } const p = lp.get(e.pointerId); if (p) { lp.delete(e.pointerId); if (e.type === 'pointerup' && p.mv < 14 && performance.now() - p.t < 320 && opt.onTap) opt.onTap(e.clientX, e.clientY); } };
    zone.addEventListener('pointerup', up); zone.addEventListener('pointercancel', up);
    for (const d of defs) this.add(d);
    const set = on => { if (this.on === on) return; this.on = on; document.body.classList.toggle('touch', on); if (opt.onMode) opt.onMode(on); };
    addEventListener('pointerdown', e => { if (e.pointerType === 'touch' || e.pointerType === 'pen') set(true); else if (e.pointerType === 'mouse' && this.on && !QS.has('touch')) set(false); }, true);
    let coarse = false; try { coarse = matchMedia('(pointer:coarse)').matches && !matchMedia('(any-pointer:fine)').matches; } catch (e) { }
    if (coarse || QS.has('touch')) set(true);
    this.style();
  },
  style() { const s = this.el.style; s.setProperty('--ts', Cfg.v.tSize || 1); s.setProperty('--to', Cfg.v.tAlpha == null ? .85 : Cfg.v.tAlpha); for (const k in this.btns) this.place(this.btns[k]); },
  place(b) { const d = b._d, lh = !!Cfg.v.tLeft, st = b.style; st.left = st.right = st.top = st.bottom = ''; const sc = Cfg.v.tSize || 1;
    if (d.r != null) st[lh ? 'left' : 'right'] = `calc(var(--s${lh ? 'l' : 'r'}) + ${d.r * sc}px)`; if (d.l != null) st[lh ? 'right' : 'left'] = `calc(var(--s${lh ? 'r' : 'l'}) + ${d.l * sc}px)`;
    if (d.b != null) st.bottom = `calc(var(--sb) + ${d.b * sc}px)`; if (d.top != null) st.top = `calc(var(--st) + ${d.top}px)`; if (d.s) st.setProperty('--tb', d.s + 'px'); },
  add(d) {
    const b = h('button', { class: 'tbtn ' + (d.cls || ''), 'aria-label': d.l || d.a, html: d.t }); b._d = d; let pid = null, px = 0, py = 0;
    b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); try { b.setPointerCapture(e.pointerId); } catch (_) { } pid = e.pointerId; px = e.clientX; py = e.clientY; b.classList.add('on');
      if (d.fn) d.fn(true, e); else if (d.toggle) { Inp.act[d.a] = !Inp.act[d.a]; if (Inp.act[d.a]) Inp.actP.add(d.a); b.classList.toggle('lock', !!Inp.act[d.a]); } else { Inp.act[d.a] = true; Inp.actP.add(d.a); } });
    b.addEventListener('pointermove', e => { if (e.pointerId !== pid || !d.look) return; Inp.tx += e.clientX - px; Inp.ty += e.clientY - py; px = e.clientX; py = e.clientY; });
    const up = e => { if (e.pointerId !== pid) return; pid = null; b.classList.remove('on'); if (d.fn) d.fn(false, e); else if (!d.toggle) Inp.act[d.a] = false; };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('contextmenu', e => e.preventDefault());
    this.el.append(b); this.btns[d.id || d.a] = b; this.place(b); return b;
  },
};

/* ---------- sons procéduraux ---------- */
const Sfx = {
  ctx: null, out: null, sfx: null, mus: null, nb: null, def: {}, L: { x: 0, y: 0, z: 0, rx: 1, rz: 0 },
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { }); return; }
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return; const c = this.ctx = new C();
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 6; comp.connect(c.destination);
      this.out = c.createGain(); this.out.connect(comp); this.sfx = c.createGain(); this.sfx.connect(this.out); this.mus = c.createGain(); this.mus.connect(this.out);
      const n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.nb = b; this.vol();
    } catch (e) { this.ctx = null; }
  },
  vol() { if (!this.ctx) return; const v = Cfg.v; this.out.gain.value = v.volMaster == null ? .8 : v.volMaster; this.sfx.gain.value = v.volSfx == null ? .8 : v.volSfx; this.mus.gain.value = v.volMusic == null ? .4 : v.volMusic; },
  _end(g, o) { const c = this.ctx; let n = g; if (o.pan && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = clamp(o.pan, -1, 1); g.connect(p); n = p; } n.connect(o.dest || this.sfx); },
  tone(o) {
    const c = this.ctx; if (!c) return; const t = c.currentTime + (o.t0 || 0), d = o.d || .1, os = c.createOscillator(), g = c.createGain();
    os.type = o.type || 'sine'; os.frequency.setValueAtTime(Math.max(1, o.f), t); if (o.f2) os.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v || .2, t + (o.a || .005)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    os.connect(g); this._end(g, o); os.start(t); os.stop(t + d + .03);
  },
  noise(o) {
    const c = this.ctx; if (!c) return; const t = c.currentTime + (o.t0 || 0), d = o.d || .2, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nb; s.loop = true; f.type = o.type || 'lowpass'; f.Q.value = o.q || .8; f.frequency.setValueAtTime(o.f || 1000, t); if (o.f2) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v || .3, t + (o.a || .003)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(f); f.connect(g); this._end(g, o); s.start(t, Math.random() * 1.5); s.stop(t + d + .03);
  },
  play(name, v = 1, pan = 0, pitch = 1) { if (!this.ctx || this.ctx.state !== 'running') return; const f = this.def[name]; if (f) try { f(v, pan, pitch); } catch (e) { } },
  at(name, x, y, z, v = 1, maxD = 70, pitch = 1) { const L = this.L, dx = x - L.x, dy = y - L.y, dz = z - L.z, d = Math.hypot(dx, dy, dz); if (d > maxD) return; const att = 1 / (1 + d * d * .012); this.play(name, v * att * (1 - d / maxD), d > .5 ? clamp((dx * L.rx + dz * L.rz) / d, -1, 1) * .8 : 0, pitch); },
};
const Music = {
  fn: null, bpm: 90, step: 0, next: 0, timer: null,
  start(fn, bpm) { this.fn = fn; this.bpm = bpm; this.step = 0; if (this.timer) return; this.timer = setInterval(() => { const c = Sfx.ctx; if (!c || c.state !== 'running' || !this.fn) return; if (this.next < c.currentTime) this.next = c.currentTime + .06; while (this.next < c.currentTime + .35) { try { this.fn(this.step++, this.next - c.currentTime); } catch (e) { } this.next += 60 / this.bpm / 4; } }, 90); },
  stop() { this.fn = null; },
};

/* ---------- interface ---------- */
function toast(text, cls, ms = 3200) { const box = $('#toasts'); if (!box) return; const t = h('div', { class: 'toast ' + (cls || '') }, text); box.append(t); while (box.children.length > 4) box.firstChild.remove(); setTimeout(() => t.remove(), ms); }
const Labels = {
  root: null, m: new Map(), used: new Set(), tmp: [0, 0, 0],
  begin() { if (!this.root) this.root = $('#labels'); this.used.clear(); },
  put(R, id, x, y, z, text, cls, color) {
    if (!R.project(x, y, z, this.tmp)) return; let e = this.m.get(id); if (!e) { e = h('div', { class: 'wl' }); this.root.append(e); this.m.set(id, e); }
    if (e._t !== text) { e.textContent = text; e._t = text; } if (e._c !== cls) { e.className = 'wl ' + (cls || ''); e._c = cls; } if (e._k !== color) { e.style.color = color || ''; e._k = color; }
    e.style.transform = `translate(${this.tmp[0] | 0}px,${this.tmp[1] | 0}px) translate(-50%,-100%)`; this.used.add(id);
  },
  end() { for (const [id, e] of this.m) if (!this.used.has(id)) { e.remove(); this.m.delete(id); } },
};

/* ---------- vidéo : qualité, résolution dynamique ---------- */
const Vid = {
  R: null, fps: 60, acc: 0, n: 0, auto: 'eleve', slow: 0, el: null,
  init(R) {
    this.R = R; let coarse = false; try { coarse = matchMedia('(pointer:coarse)').matches; } catch (e) { }
    const weak = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 8) <= 4; this.auto = coarse ? (weak ? 'bas' : 'moyen') : (weak ? 'moyen' : 'eleve'); this.apply();
  },
  apply() {
    const v = Cfg.v, q = Object.assign({}, E.QUALITY[v.quality === 'auto' ? this.auto : v.quality] || E.QUALITY.moyen);
    if (v.quality === 'perso') { q.shadow = +v.shadows; q.taps = q.shadow >= 2048 ? 9 : 4; q.bloom = !!v.bloom; q.ssao = !!v.ssao; q.rays = !!v.rays; q.fxaa = !!v.fxaa; q.detail = !!v.detail; q.clouds = v.detail ? 4 : 2; q.maxDpr = 2; q.chroma = !!v.bloom; q.lights = 8; q.aoS = 10; }
    if (!v.resAuto) this.R.scale = clamp((v.resScale || 100) / 100, .4, 1); this.R.setQuality(q);
    if (this.el) this.el.hidden = !v.fpsShow;
  },
  tick(dt) {
    this.acc += dt; this.n++; if (this.acc < 1) return; this.fps = this.n / this.acc; this.acc = 0; this.n = 0;
    const R = this.R, v = Cfg.v; if (!this.el) this.el = $('#fps'); if (this.el && v.fpsShow) { this.el.hidden = false; this.el.textContent = Math.round(this.fps) + ' i/s · ' + R.w + '×' + R.h; }
    if (v.resAuto && !document.hidden) {
      const s0 = R.scale; if (this.fps < 43) R.scale = Math.max(.5, R.scale - .1); else if (this.fps > 57) R.scale = Math.min(1, R.scale + .05);
      if (R.scale !== s0) R.resize(true);
      if (v.quality === 'auto' && this.fps < 27 && R.scale <= .5) { if (++this.slow >= 4) { this.slow = 0; const o = ['ultra', 'eleve', 'moyen', 'bas'], i = o.indexOf(this.auto); if (i < 3) { this.auto = o[i + 1]; this.apply(); } } } else this.slow = 0;
    }
  },
};
const VIDEO_ITEMS = [
  { k: 'quality', l: 'Qualité graphique', h: 'Auto choisit selon ton appareil.', t: 'select', d: 'auto', re: 1, o: [['auto', 'Auto'], ['bas', 'Basse'], ['moyen', 'Moyenne'], ['eleve', 'Élevée'], ['ultra', 'Ultra'], ['perso', 'Personnalisée']] },
  { k: 'shadows', l: 'Ombres', t: 'select', d: '2048', show: () => Cfg.v.quality === 'perso', o: [['0', 'Désactivées'], ['1024', 'Basses'], ['2048', 'Élevées'], ['4096', 'Ultra']] },
  { k: 'bloom', l: 'Halo lumineux (bloom)', t: 'toggle', d: true, show: () => Cfg.v.quality === 'perso' },
  { k: 'ssao', l: 'Occlusion ambiante', t: 'toggle', d: true, show: () => Cfg.v.quality === 'perso' },
  { k: 'rays', l: 'Rayons de soleil', t: 'toggle', d: true, show: () => Cfg.v.quality === 'perso' },
  { k: 'fxaa', l: 'Anticrénelage', t: 'toggle', d: true, show: () => Cfg.v.quality === 'perso' },
  { k: 'detail', l: 'Détail des surfaces', t: 'toggle', d: true, show: () => Cfg.v.quality === 'perso' },
  { k: 'resAuto', l: 'Résolution dynamique', h: 'Baisse la netteté pour garder un jeu fluide.', t: 'toggle', d: true, re: 1 },
  { k: 'resScale', l: 'Échelle de résolution', t: 'range', min: 50, max: 100, step: 5, d: 100, f: v => v + ' %', show: () => !Cfg.v.resAuto },
  { k: 'bright', l: 'Luminosité', t: 'range', min: .6, max: 1.5, step: .05, d: 1, f: v => Math.round(v * 100) + ' %' },
  { k: 'fpsCap', l: 'Limite d\'images par seconde', t: 'select', d: '0', o: [['0', 'Illimitée'], ['60', '60'], ['30', '30']] },
  { k: 'fpsShow', l: 'Afficher les images par seconde', t: 'toggle', d: false },
];
function runLoop(frame) {
  let last = performance.now();
  const tick = now => { requestAnimationFrame(tick); const cap = +Cfg.v.fpsCap || 0; if (cap && now - last < 1000 / cap - 2) return; let dt = (now - last) / 1000; last = now; if (dt <= 0) return; if (dt > .1) dt = .1; frame(dt, now / 1000); window.frames_ = (window.frames_ || 0) + 1; };
  requestAnimationFrame(tick);
}
function goFullscreen() { try { const d = document, e = d.documentElement; if (d.fullscreenElement) d.exitFullscreen().catch(() => { }); else if (e.requestFullscreen) e.requestFullscreen({ navigationUI: 'hide' }).catch(() => toast('Plein écran indisponible ici', 'bad')); else toast('Plein écran indisponible ici', 'bad'); } catch (e) { } }
let wakeLock = null;
function keepAwake() { try { if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(w => { wakeLock = w; w.addEventListener('release', () => { wakeLock = null; }); }).catch(() => { }); } catch (e) { } }
