'use strict';
/* ===================================================================
   RÉSEAU — deux transports derrière la même interface :
   • « room »  : dans Claude (capacité room, état de présence partagé)
   • « rtc »   : sur le web ouvert (WebRTC en maillage, signalisation
                 compatible PeerServer) → vrai chat vocal possible
   + chat texte, chat vocal, garde anti-triche (votes d'exclusion).
   =================================================================== */
const SIG_DEF = 'wss://0.peerjs.com:443/peerjs?key=peerjs';
const ICE = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'], username: 'peerjs', credential: 'peerjsp' }];

const Rtc = {
  kind: 'rtc', me: '', tok: '', roomId: '', cap: 16, url: SIG_DEF, sig: null, gs: null, greeter: false, up: false, peers: new Map(), mic: null, jres: null, ht: 0, tries: 0, lastGr: 0,
  start() {
    let u = QS.get('sig') || store.get('sigurl', '') || SIG_DEF; if (!/^wss?:\/\//.test(u)) u = SIG_DEF; if (!u.includes('?')) u += '?key=peerjs'; this.url = u;
    this.me = 'p' + rid(14); this.tok = rid(12);
    return new Promise(res => {
      let done = false; const fin = ok => { if (!done) { done = true; res(ok); } };
      const open = () => { this.sig = this.sock(this.me, this.tok, m => this.onSig(m), () => { this.up = true; fin(true); if (this.roomId) this.claim(); }, () => { this.up = false; fin(false); setTimeout(open, 6000); }); };
      open(); setTimeout(() => fin(false), 7000);
      setInterval(() => this.upkeep(), 2500);
    });
  },
  sock(id, tok, onmsg, onopen, onfail) {
    let ws, hb, dead = false; const fail = why => { if (dead) return; dead = true; clearInterval(hb); onfail(why); };
    try { ws = new WebSocket(this.url + '&id=' + encodeURIComponent(id) + '&token=' + tok + '&version=1.5.5'); } catch (e) { setTimeout(() => fail('ERR'), 0); return null; }
    ws.onopen = () => { hb = setInterval(() => { if (ws.readyState === 1) ws.send('{"type":"HEARTBEAT"}'); }, 5000); };
    ws.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (_) { return; } if (!m || typeof m !== 'object') return; if (m.type === 'OPEN') onopen(); else if (m.type === 'ID-TAKEN' || m.type === 'INVALID-KEY') { fail(m.type); try { ws.close(); } catch (_) { } } else if (m.type !== 'ERROR') onmsg(m); };
    ws.onclose = () => fail('CLOSE'); ws.onerror = () => { };
    return ws;
  },
  send(m) { if (this.sig && this.sig.readyState === 1) this.sig.send(JSON.stringify(m)); },
  closeG() { const g = this.gs; this.gs = null; this.greeter = false; if (g) try { g.onclose = null; g.close(); } catch (e) { } },
  // tente de devenir le point d'entrée de la salle ; sinon demande la liste des membres
  claim() {
    if (!this.up || !this.roomId) return; const r0 = this.roomId; this.closeG();
    const g = this.sock(r0, rid(12), m => {
      if (m.type === 'OFFER' && m.payload && m.payload.k === 'hello' && this.roomId === r0 && typeof m.src === 'string') {
        const ids = [this.me]; for (const [id, p] of this.peers) if (p.open) ids.push(id);
        try { g.send(JSON.stringify({ type: 'ANSWER', dst: m.src, payload: ids.length >= this.cap ? { k: 'full' } : { k: 'members', ids } })); } catch (e) { }
      }
    }, () => { if (this.roomId !== r0) { try { g.close(); } catch (e) { } return; } this.gs = g; this.greeter = true; this.joined(true); },
      why => { if (this.gs === g) { this.gs = null; this.greeter = false; } if (why === 'ID-TAKEN' && this.roomId === r0 && !this.peers.size) this.hello(r0); });
  },
  hello(r0) { this.send({ type: 'OFFER', dst: r0, payload: { k: 'hello' } }); clearTimeout(this.ht); this.ht = setTimeout(() => { if (this.roomId === r0 && !this.peers.size && !this.greeter) { if (++this.tries < 4) this.claim(); else this.joined(false); } }, 4500); },
  join(roomId, cap) { this.leave(); this.roomId = roomId.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); this.cap = cap; this.tries = 0; return new Promise(res => { this.jres = res; if (this.up) this.claim(); else this.joined(false); setTimeout(() => this.joined(true), 9000); }); },
  joined(ok, full) { const r = this.jres; if (r) { this.jres = null; r({ ok, full: !!full }); } },
  leave() { for (const id of [...this.peers.keys()]) this.drop(id); this.closeG(); clearTimeout(this.ht); this.joined(false); this.roomId = ''; },
  mk(id) {
    const pc = new RTCPeerConnection({ iceServers: ICE }), p = { id, pc, dc: null, st: null, rev: 0, open: false, t: performance.now(), cq: [], tr: null, audio: null };
    pc.onicecandidate = e => { if (e.candidate) this.send({ type: 'CANDIDATE', dst: id, payload: { k: 'ice', c: e.candidate.toJSON() } }); };
    pc.onconnectionstatechange = () => { if (pc.connectionState === 'failed' || pc.connectionState === 'closed') this.drop(id); };
    pc.ontrack = e => { try { let a = p.audio; if (!a) { a = p.audio = new Audio(); a.autoplay = true; a.setAttribute('playsinline', ''); (document.getElementById('rtcaudio') || document.body).append(a); } a.srcObject = (e.streams && e.streams[0]) || new MediaStream([e.track]); Voice.vol(); const pl = a.play(); if (pl && pl.catch) pl.catch(() => { }); } catch (_) { } };
    this.peers.set(id, p); return p;
  },
  wire(p, dc) { p.dc = dc; dc.onopen = () => { p.open = true; p.t = performance.now(); }; dc.onclose = () => this.drop(p.id); dc.onmessage = e => { try { const st = JSON.parse(e.data); if (st && typeof st === 'object') { p.st = st; p.rev++; p.t = performance.now(); } } catch (_) { } }; },
  connect(id) {
    const p = this.mk(id), pc = p.pc; try { p.tr = pc.addTransceiver('audio', { direction: 'sendrecv' }); if (this.mic) p.tr.sender.replaceTrack(this.mic).catch(() => { }); } catch (e) { }
    this.wire(p, pc.createDataChannel('g', { ordered: false, maxRetransmits: 0 }));
    pc.createOffer().then(o => pc.setLocalDescription(o)).then(() => this.send({ type: 'OFFER', dst: id, payload: { k: 'sdp', r: this.roomId, sdp: pc.localDescription } })).catch(() => this.drop(id));
  },
  async accept(src, pl) {
    if (pl.r !== this.roomId || this.peers.size >= this.cap + 2) return; if (this.peers.has(src)) this.drop(src);
    const p = this.mk(src), pc = p.pc; pc.ondatachannel = e => this.wire(p, e.channel);
    try {
      await pc.setRemoteDescription(pl.sdp); const tr = pc.getTransceivers().find(t => t.receiver && t.receiver.track && t.receiver.track.kind === 'audio');
      if (tr) { tr.direction = 'sendrecv'; p.tr = tr; if (this.mic) await tr.sender.replaceTrack(this.mic).catch(() => { }); }
      await pc.setLocalDescription(await pc.createAnswer()); this.send({ type: 'ANSWER', dst: src, payload: { k: 'sdp', sdp: pc.localDescription } }); this.flush(p);
    } catch (e) { this.drop(src); }
  },
  flush(p) { for (const c of p.cq) p.pc.addIceCandidate(c).catch(() => { }); p.cq.length = 0; },
  onSig(m) {
    const pl = m.payload || {}, src = m.src; if (typeof src !== 'string') return;
    if (m.type === 'ANSWER' && pl.k === 'members' && Array.isArray(pl.ids)) { clearTimeout(this.ht); for (const id of pl.ids.slice(0, 32)) if (typeof id === 'string' && id !== this.me && !this.peers.has(id)) this.connect(id); this.joined(true); }
    else if (m.type === 'ANSWER' && pl.k === 'full') { clearTimeout(this.ht); this.joined(false, true); }
    else if (m.type === 'OFFER' && pl.k === 'sdp') this.accept(src, pl);
    else if (m.type === 'ANSWER' && pl.k === 'sdp') { const p = this.peers.get(src); if (p) p.pc.setRemoteDescription(pl.sdp).then(() => this.flush(p)).catch(() => { }); }
    else if (m.type === 'CANDIDATE' && pl.k === 'ice') { const p = this.peers.get(src); if (p) { if (p.pc.remoteDescription) p.pc.addIceCandidate(pl.c).catch(() => { }); else p.cq.push(pl.c); } }
    else if (m.type === 'EXPIRE') { const p = this.peers.get(src); if (p && !p.open) this.drop(src); }
  },
  drop(id) { const p = this.peers.get(id); if (!p) return; this.peers.delete(id); try { if (p.dc) { p.dc.onclose = null; p.dc.close(); } p.pc.onconnectionstatechange = null; p.pc.close(); } catch (e) { } if (p.audio) { try { p.audio.srcObject = null; p.audio.remove(); } catch (e) { } } },
  upkeep() {
    const now = performance.now(); let gr = this.greeter;
    for (const [id, p] of this.peers) { if (now - p.t > (p.open ? 9000 : 16000)) { this.drop(id); continue; } if (p.open && p.st && p.st.gr) gr = true; }
    if (gr) this.lastGr = now; else if (this.up && this.roomId && this.peers.size && now - this.lastGr > 6000 + Math.random() * 4000) { this.lastGr = now; this.claim(); }
    if (this.up && this.roomId && !this.peers.size && !this.greeter && !this.jres) this.claim();
  },
  post(obj) { let s; try { s = JSON.stringify(obj); } catch (e) { return; } for (const p of this.peers.values()) if (p.open && p.dc.readyState === 'open' && p.dc.bufferedAmount < 65536) try { p.dc.send(s); } catch (e) { } },
  each(cb, roomId) { const r = roomId || this.roomId; for (const [id, p] of this.peers) if (p.open && p.st && p.st.rm === r) cb(id, p.st, p.rev); },
  setMic(track) { this.mic = track; for (const p of this.peers.values()) if (p.tr) p.tr.sender.replaceTrack(track).catch(() => { }); },
};

const RoomT = {
  kind: 'room', me: '', room: null, greeter: false, roomId: '', dead: false, t0: 0,
  async start() { try { const r = await window.claude.use('room'); if (!r) return false; this.room = r; this.t0 = performance.now(); r.onPeers(() => { }, () => { this.dead = true; }); return true; } catch (e) { return false; } },
  async join(roomId, cap) { const w = 1600 - (performance.now() - this.t0); if (w > 0) await new Promise(r => setTimeout(r, w)); let n = 0; this.each(() => n++, roomId); if (n >= cap) return { ok: false, full: true }; this.roomId = roomId; return { ok: true, full: false }; },
  leave() { this.roomId = ''; },
  post(obj) { if (this.dead) return; try { this.room.presence(obj).catch(() => { }); } catch (e) { } },
  each(cb, roomId) { if (this.dead) return; const r = roomId || this.roomId; let l; try { l = this.room.peers(); } catch (e) { return; } for (const pr of l) { if (pr.kind !== 'viewer') continue; if (pr.sameTab) { this.me = pr.peer; continue; } const st = pr.presence; if (!st || st.rm !== r) continue; cb(pr.peer, st, st); } },
};

/* ---------- anti-triche : signalements + votes d'exclusion ---------- */
const Guard = {
  sc: new Map(), votes: new Set(), banned: new Set(), names: id => id, kicked: false,
  flag(id, why, pts = 1) {
    if (!id || id === Net.me || this.banned.has(id)) return; let s = this.sc.get(id); if (!s) this.sc.set(id, s = { n: 0, why: {} }); s.n += pts; s.why[why] = (s.why[why] || 0) + 1;
    if (s.n >= 10 && !this.votes.has(id)) { this.votes.add(id); toast(this.names(id) + ' : comportement suspect (' + why + '), vote d\'exclusion envoyé', 'bad', 5000); }
  },
  decay(dt) { for (const s of this.sc.values()) s.n = Math.max(0, s.n - dt * .2); },
  vote(id, on) { if (on) this.votes.add(id); else this.votes.delete(id); },
  reset() { this.sc.clear(); this.votes.clear(); this.banned.clear(); this.kicked = false; },
  tally() {
    const cnt = new Map(); let humans = 1; for (const id of this.votes) cnt.set(id, 1);
    for (const [pid, p] of Net.all) { humans++; if (this.banned.has(pid)) continue; const vk = p.st.vk; if (Array.isArray(vk)) for (const id of vk.slice(0, 8)) if (typeof id === 'string') cnt.set(id, (cnt.get(id) || 0) + 1); }
    const need = Math.floor((humans - 1) / 2) + 1, nb = new Set(); let me = false;
    for (const [id, c] of cnt) if (c >= need) { if (id === Net.me) me = true; else if (Net.all.has(id)) nb.add(id); }
    for (const id of this.banned) if (Net.all.has(id)) nb.add(id);   // une exclusion tient jusqu'au départ du joueur
    this.banned = nb; if (me && humans > 2 && !this.kicked) { this.kicked = true; if (Net.h.kicked) Net.h.kicked(); }
  },
};

const Net = {
  T: null, kind: 'off', g: '', roomId: '', joinT: 0, peers: new Map(), all: new Map(), st: {}, ev: [], seq: 0, ch: [], cseq: 0, hz: 12, last: 0, h: {}, sayT: [],
  get me() { return (this.T && this.T.me) || 'moi'; },
  get online() { return !!this.T && !!this.roomId; },
  async init(game) {
    this.g = game; if (QS.get('net') === 'off') return 'off';
    if (INFRAME) { if (await RoomT.start()) { this.T = RoomT; this.kind = 'room'; } }
    else if (window.RTCPeerConnection && window.WebSocket) { if (await Rtc.start()) { this.T = Rtc; this.kind = 'rtc'; } }
    return this.kind;
  },
  async join(roomId, cap = 16) { this.leave(); if (!this.T) return { ok: false, full: false }; const r = await this.T.join(this.g + '-' + roomId, cap); if (!r.full) { this.roomId = roomId; this.joinT = Date.now(); } return r; },
  async quick(prefix, cap, max = 8) { for (let i = 1; i <= max; i++) { const r = await this.join(prefix + i, cap); if (!r.full) return prefix + i; } return prefix + max; },
  leave() { if (this.T) this.T.leave(); this.roomId = ''; for (const p of this.peers.values()) if (this.h.leave) this.h.leave(p); this.peers.clear(); this.all.clear(); Guard.reset(); },
  event(type, ...a) { this.ev.push({ t: performance.now(), w: [++this.seq, type, ...a] }); if (this.ev.length > 18) this.ev.shift(); },
  say(text, team, voice) { const now = performance.now(); this.sayT = this.sayT.filter(t => now - t < 10000); if (this.sayT.length >= 6) return false; this.sayT.push(now); this.ch.push({ t: now, w: [++this.cseq, cleanText(text, 200), team ? 1 : 0, voice ? 1 : 0] }); if (this.ch.length > 4) this.ch.shift(); return true; },
  tick() {
    const T = this.T; if (!T || !this.roomId) return; const now = performance.now();
    while (this.ev.length && now - this.ev[0].t > 3000) this.ev.shift(); while (this.ch.length && now - this.ch[0].t > 12000) this.ch.shift();
    if (now - this.last >= 1000 / this.hz) {
      this.last = now; const p = this.st; p.g = this.g; p.j = this.joinT; p.rm = this.g + '-' + this.roomId; if (this.kind === 'rtc') p.rm = p.rm.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      p.gr = T.greeter ? 1 : 0; p.vk = [...Guard.votes].slice(0, 8); p.ev = this.ev.map(e => e.w); p.ch = this.ch.map(c => c.w);
      if (this.kind === 'room') { let n = JSON.stringify(p).length; if (n > 3900) { p.ch = []; n = JSON.stringify(p).length; } if (n > 3900) p.ev = p.ev.slice(-4); }
      T.post(p);
    }
    const seen = new Set(), rm = this.kind === 'rtc' ? Rtc.roomId : this.g + '-' + this.roomId;
    T.each((id, st, rev) => {
      if (st.g !== this.g) return; seen.add(id);
      let a = this.all.get(id); if (!a) this.all.set(id, a = { id, st }); a.st = st;
      if (Guard.banned.has(id)) { const o = this.peers.get(id); if (o) { this.peers.delete(id); if (this.h.leave) this.h.leave(o); } return; }
      let p = this.peers.get(id), fresh = false;
      if (!p) { const mx = l => Array.isArray(l) ? l.reduce((m, e) => Math.max(m, num(e && e[0], 0)), 0) : 0; p = { id, st, rev: null, es: mx(st.ev), cs: mx(st.ch), t: now }; this.peers.set(id, p); fresh = true; }
      if (p.rev !== rev || fresh) {
        p.rev = rev; p.st = st; p.t = now; if (fresh && this.h.join) this.h.join(p);
        if (Array.isArray(st.ev)) for (const e of st.ev) if (Array.isArray(e) && num(e[0]) > p.es && p.es - num(e[0]) > -64) { p.es = e[0]; if (this.h.event) try { this.h.event(p, e[1], e.slice(2)); } catch (err) { } }
        if (Array.isArray(st.ch)) for (const c of st.ch) if (Array.isArray(c) && num(c[0]) > p.cs) { p.cs = c[0]; if (this.h.chat) this.h.chat(p, cleanText(c[1], 200), !!c[2], !!c[3]); }
        if (this.h.update) this.h.update(p);
      }
    }, rm);
    for (const [id, p] of this.peers) if (!seen.has(id)) { this.peers.delete(id); if (this.h.leave) this.h.leave(p); }
    for (const id of [...this.all.keys()]) if (!seen.has(id)) this.all.delete(id);
    Guard.tally();
  },
  // l'hôte = le plus ancien de la salle (départage par identifiant)
  host() { let hid = this.me, hj = this.joinT || 0; for (const [id, p] of this.peers) { const j = num(p.st.j, 0); if (j && (j < hj || (j === hj && id < hid))) { hid = id; hj = j; } } return hid; },
  isHost() { return !this.online || this.host() === this.me; },
};

/* ---------- chat texte ---------- */
const Chat = {
  open: false, team: false, el: null, log: null, inp: null, onSend: null, hasTeam: false,
  init(o) {
    this.onSend = o.onSend; this.hasTeam = !!o.team; const el = this.el = $('#chat'); el.textContent = '';
    this.log = h('div', { id: 'chatlog', 'aria-live': 'polite' }); this.inp = h('input', { id: 'chatin', type: 'text', maxlength: 200, autocomplete: 'off', enterkeyhint: 'send', 'aria-label': 'Message' });
    const bar = h('div', { id: 'chatbar' }, this.inp, h('button', { class: 'btn sm pri', onclick: () => this.send() }, 'Envoyer'), h('button', { class: 'btn sm', 'aria-label': 'Fermer le chat', onclick: () => this.hide() }, '✕'),
      h('div', { class: 'qc' }, (o.quick || []).map(q => h('button', { onclick: () => { this.onSend(q, this.team, false); this.hide(); } }, q))));
    el.append(this.log, bar);
    this.inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); this.send(); } else if (e.key === 'Escape') { e.preventDefault(); this.hide(); } });
  },
  add(name, text, o = {}) {
    const m = h('div', { class: 'msg' + (o.sys ? ' sys' : '') }); if (name) { const b = h('b', null, name); if (o.color) b.style.color = o.color; m.append(o.voice ? '🎙 ' : '', o.team ? h('i', null, '[équipe] ') : '', b, ' : '); }
    m.append(String(text)); this.log.append(m); while (this.log.children.length > 60) this.log.firstChild.remove(); this.log.scrollTop = 1e6; setTimeout(() => m.classList.add('old'), 9000);
  },
  show(team) { this.open = true; this.team = !!team && this.hasTeam; this.el.classList.add('open'); this.inp.placeholder = this.team ? 'Message à ton équipe…' : 'Message à tous…'; this.inp.value = ''; Inp.block = true; Inp.unlock(); setTimeout(() => { try { this.inp.focus(); } catch (e) { } this.log.scrollTop = 1e6; }, 0); },
  hide() { if (!this.open) return; this.open = false; this.el.classList.remove('open'); try { this.inp.blur(); } catch (e) { } Inp.block = false; if (this.onHide) this.onHide(); },
  send() { const t = cleanText(this.inp.value, 200).trim(); if (t) this.onSend(t, this.team, false); this.hide(); },
};

/* ---------- chat vocal ----------
   rtc : vraie voix (micro → WebRTC).  stt : dans Claude, la parole est
   transcrite puis lue à voix haute chez les autres. */
const Voice = {
  mode: 'none', dict: null, tts: null, talking: false, txOn: false, want: false, team: false, box: null, micTrack: null, noSpeak: false, allow: null, lvl: 0, an: null, buf: null,
  async init() {
    this.box = $('#voicebox');
    if (INFRAME) {
      try { this.dict = await window.claude.use('dictation'); } catch (e) { } try { this.tts = await window.claude.use('tts'); } catch (e) { }
      if (this.dict) {
        this.mode = 'stt';
        this.dict.onPartial(e => { if (this.talking) this.show(e.text || 'Parle…'); });
        this.dict.onFinal(e => { const t = cleanText(e.text, 200).trim(); if (t && Chat.onSend) Chat.onSend(t, this.team, true); });
        this.dict.onState(e => { if (e.state === 'idle') { this.talking = false; this.show(null); if (e.reason === 'not_granted') toast('Micro refusé pour cette page', 'bad'); else if (e.reason === 'unavailable') { this.mode = 'none'; toast('Dictée indisponible ici', 'bad'); } } });
      }
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection) this.mode = 'rtc';
    return this.mode;
  },
  desc() { return this.mode === 'rtc' ? 'Vraie voix en direct entre joueurs (micro).' : this.mode === 'stt' ? 'Ici ta voix est transcrite puis lue à voix haute chez les autres. La vraie voix marche sur la version GitHub.' : (INFRAME ? 'Micro indisponible dans ce navigateur : utilise Chrome ou Edge sur ordinateur, ou le chat texte.' : 'Micro indisponible sur ce navigateur : utilise le chat texte.'); },
  show(t) { if (!this.box) return; if (t == null) this.box.hidden = true; else { this.box.hidden = false; this.box.textContent = t; } },
  // à appeler directement dans le geste (touche ou bouton)
  down(team) {
    this.team = !!team; Sfx.init();
    if (this.mode === 'stt') { if (this.talking) return; this.talking = true; this.show('Parle…'); this.dict.start().catch(e => { this.talking = false; this.show(null); const c = e && e.code; if (c === 'not_granted') toast('Micro refusé pour cette page', 'bad'); else if (c === 'unavailable') toast('Dictée indisponible sur ce navigateur', 'bad'); }); }
    else if (this.mode === 'rtc') { this.want = true; if (this.micTrack) this.tx(true); else this.getMic().then(ok => { if (ok && this.want) this.tx(true); }); }
    else toast(this.desc(), 'bad', 5000);
  },
  up() { this.want = false; if (this.mode === 'stt') { if (this.talking) this.dict.stop().catch(() => { }); } else if (this.mode === 'rtc') this.tx(false); },
  toggle(team) { if (this.talking || this.txOn) this.up(); else this.down(team); },
  async getMic() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }); const t = s.getAudioTracks()[0]; if (!t) return false; t.enabled = false; this.micTrack = t; Rtc.setMic(t);
      try { if (Sfx.ctx) { const src = Sfx.ctx.createMediaStreamSource(s); this.an = Sfx.ctx.createAnalyser(); this.an.fftSize = 256; this.buf = new Uint8Array(128); src.connect(this.an); } } catch (e) { }
      return true;
    } catch (e) { toast('Micro refusé ou introuvable', 'bad'); return false; }
  },
  tx(on) { if (!this.micTrack) return; this.micTrack.enabled = on; this.txOn = on; this.show(on ? 'Tu parles' + (this.team ? ' à ton équipe' : '') + '…' : null); },
  vol() { const v = Cfg.v.volVoice == null ? 1 : Cfg.v.volVoice; for (const [id, p] of Rtc.peers) if (p.audio) { p.audio.volume = clamp(v, 0, 1); p.audio.muted = v <= 0 || Guard.banned.has(id) || (this.allow ? !this.allow(id) : false); } },
  level() { if (!this.an || !this.txOn) return 0; this.an.getByteTimeDomainData(this.buf); let m = 0; for (let i = 0; i < 128; i++) m = Math.max(m, Math.abs(this.buf[i] - 128)); return m / 128; },
  // lecture à voix haute d'un message (mode transcription, ou accessibilité)
  read(text, idx) {
    const md = Cfg.v.readAloud || 'voice'; if (md === 'off' || this.noSpeak || !text) return;
    if (this.tts) { this.tts.add([{ text: text.slice(0, 300), voice: ['buttery', 'airy', 'glassy', 'rounded'][Math.abs(idx | 0) % 4] }]).catch(e => { const c = e && e.code; if (c === 'not_granted' || c === 'unavailable') this.noSpeak = true; }); return; }
    try { if (window.speechSynthesis && window.SpeechSynthesisUtterance) { const u = new SpeechSynthesisUtterance(text.slice(0, 300)); u.lang = 'fr-FR'; u.volume = clamp(Cfg.v.volVoice == null ? 1 : Cfg.v.volVoice, 0, 1); u.pitch = 0.8 + (Math.abs(idx | 0) % 4) * .15; speechSynthesis.speak(u); } } catch (e) { }
  },
  // liste des joueurs en train de parler
  talkers(names) { const el = $('#talkers'); if (!el) return; const k = names.join('|'); if (el._k === k) return; el._k = k; el.textContent = ''; for (const n of names) el.append(h('span', null, n)); },
};
const AUDIO_ITEMS = [
  { k: 'volMaster', l: 'Volume général', t: 'range', min: 0, max: 1, step: .05, d: .8, f: v => Math.round(v * 100) + ' %' },
  { k: 'volSfx', l: 'Effets', t: 'range', min: 0, max: 1, step: .05, d: .8, f: v => Math.round(v * 100) + ' %' },
  { k: 'volMusic', l: 'Musique', t: 'range', min: 0, max: 1, step: .05, d: .35, f: v => Math.round(v * 100) + ' %' },
  { t: 'head', l: 'Chat vocal' },
  { t: 'info', l: 'Fonctionnement', v: () => Voice.desc() },
  { k: 'volVoice', l: 'Volume des voix', t: 'range', min: 0, max: 1, step: .05, d: 1, f: v => Math.round(v * 100) + ' %' },
  { k: 'micMode', l: 'Micro', t: 'select', d: 'ptt', o: [['ptt', 'Appuyer pour parler'], ['open', 'Micro ouvert (bascule)']] },
  { k: 'readAloud', l: 'Lecture à voix haute', h: 'Lit les messages avec une voix de synthèse.', t: 'select', d: 'voice', o: [['voice', 'Messages vocaux'], ['all', 'Tous les messages'], ['off', 'Jamais']] },
];
