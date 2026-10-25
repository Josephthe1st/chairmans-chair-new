/* THE CHAIRMAN'S CHAIR - unofficial fan game. Everything you may want to edit is in the SETTINGS block. */

// ===== SETTINGS =====
const TIME_LIMIT = 90;      // seconds
const SPEED = 52;           // pixels per second
const CARRY_SLOW = 0.8;     // speed multiplier while carrying the finished chair
const T = 16;               // tile size

// Chair artwork (cropped from your chart). Index = chair stage 0..5. Edit names/files freely.
const CHAIRS = [
  { img: 'images/chair0.png', name: 'Tiny stool' },
  { img: 'images/chair1.png', name: 'Basic chair' },
  { img: 'images/chair2.png', name: 'Office chair' },
  { img: 'images/chair3.png', name: 'Stylish chair' },
  { img: 'images/chair4.png', name: 'Executive chair' },
  { img: 'images/chair5.png', name: "The Chairman's Chair" }
];
const STAGE_AT = [1, 3, 5, 7, 9, 10]; // materials needed to unlock chair 0..5

// Victory scene per level: rank title, portrait and sign-off line. Edit freely.
const WINS = [
  { title: 'CHAIRMAN', img: 'images/chairman.jpg',  line: 'The boardroom is yours. Take a seat.' },
  { title: 'TYCOON',   img: 'images/chairman2.jpg', line: 'The market bows to you. Take a seat.' },
  { title: 'MOGUL',    img: 'images/chairman3.jpg', line: 'Your empire is spreading. Take a seat.' },
  { title: 'EMPEROR',  img: 'images/chairman4.jpg', line: 'The throne has been waiting for you. Take a seat.' },
  { title: 'SOVEREIGN', img: 'images/chairman5.jpg', line: 'Every boardroom answers to you. Take a seat.' },
  { title: 'OVERLORD', img: 'images/chairman6.jpg', line: 'Even the Chairman fears you now. Take a seat.' },
  { title: 'SUPREME',  img: 'images/chairman7.png', line: 'There is nothing above you. Take a seat.', head: 'YOU ARE SUPREME!' }
];

// Failure outcomes. A rank applies when materials >= min (highest match wins). No gaps, no overlaps.
const RANKS = [
  { min: 0, chair: null, head: "YOU'VE BEEN FIRED!", title: 'FIRED', text: 'You spent the entire shift doing absolutely nothing. Please leave your office keys on the desk.' },
  { min: 1, chair: 0, head: "YOU'VE BEEN DEMOTED TO UNPAID INTERN!", title: 'Unpaid Intern', text: "Management has decided you're not ready for a proper chair. Your new seat is made of whatever was left in storage." },
  { min: 3, chair: 1, head: "YOU'VE BEEN DEMOTED TO OFFICE ASSISTANT!", title: 'Office Assistant', text: 'You showed some promise, but the Chairman\'s Chair remains unfinished. Please return to organising the meeting room.' },
  { min: 5, chair: 2, head: "YOU'VE BEEN DEMOTED TO ASSISTANT MANAGER!", title: 'Assistant Manager', text: "Not quite management material yet. You may keep the chair, but don't get too comfortable." },
  { min: 7, chair: 3, head: "YOU'VE BEEN DEMOTED TO OFFICE MANAGER!", title: 'Office Manager', text: 'You gathered enough materials to earn some respect, but the throne is still out of reach. The board expects better next time.' },
  { min: 9, chair: 4, head: "YOU'VE BEEN DEMOTED TO EXECUTIVE ASSISTANT!", title: 'Executive Assistant', text: "You were dangerously close to greatness. Unfortunately, the Chairman's Chair never made it to the podium." }
];

// Map: # wall, S shelf, B crate, T table, D desk, W workbench, P plant, O podium, . floor. 24 x 16 tiles.
const L1_MAP = [
  '########################',
  '#SSSSSS..#P..P#..DDDD.P#',
  '#........#....#........#',
  '#.BB..BB.#....#..SS....#',
  '#'+'.'.repeat(22)+'#',
  '#.BB.....#....#....DD..#',
  '#S......S#....#P......P#',
  '##########....##########',
  '#...OO...#....#WWWW...W#',
  '#........#....#........#',
  '#.TTTTTT.#....#..BB....#',
  '#'+'.'.repeat(22)+'#',
  '#P......P#....#.W....B.#',
  '#........#....#........#',
  '#........#P..P#WW....WW#',
  '########################'
];
const SOLID = '#SBTDWPO';

// Items: [type, tileCol, tileRow]. Fixed positions so players can learn the route.
const TYPES = {
  plank:   { name: 'Planks',   col: '#a86f35' },
  screw:   { name: 'Screws',   col: '#b8b8b8' },
  cushion: { name: 'Cushions', col: '#9b2335' },
  fabric:  { name: 'Fabric',   col: '#d9c9a0' },
  tool:    { name: 'Tools',    col: '#c0582b' },
  gold:    { name: 'Gold',     col: '#d4a82a' }
};
const L1_ITEMS = [
  ['plank', 4, 3], ['plank', 8, 2], ['screw', 1, 5], ['screw', 7, 5],           // Storage Room
  ['cushion', 16, 2], ['cushion', 21, 3], ['fabric', 19, 6],                    // Manager's Office
  ['tool', 20, 9], ['gold', 16, 13], ['gold', 22, 10]                           // Workshop
];
// ===== LEVELS (7 offices) =====
// Level 1 is the original hand-made map. Levels 2-7 are built from fixed seeds, so every attempt is identical and learnable.
// topo A = central hallway, B = long corridor, C = ring of connected rooms. asg = which room sits in each corner. d = door positions.
const LEVEL_COUNT = 7, COLS = 24, ROWS = 16;
const NAMES = { store: 'STORAGE ROOM', mgr: "MANAGER'S OFFICE", board: 'BOARDROOM', work: 'WORKSHOP' };
const SUITS = [ // outfit per level: edit freely
  { suit: '#1f3a6e', pants: '#17294f', tie: '#c9a227', shirt: '#ffffff' },
  { suit: '#2f6b3f', pants: '#214b2c', tie: '#efe6c8', shirt: '#ffffff' },
  { suit: '#6b3a7a', pants: '#4a2755', tie: '#f3d66a', shirt: '#ffffff' },
  { suit: '#1f7a82', pants: '#16575c', tie: '#d9742b', shirt: '#ffffff' },
  { suit: '#b0791c', pants: '#6b4a12', tie: '#7a1f2b', shirt: '#fff4d6' },
  { suit: '#8c2f39', pants: '#5a1c24', tie: '#efe6c8', shirt: '#ffffff' },
  { suit: '#e8e2d0', pants: '#a89f86', tie: '#c9a227', shirt: '#cfe0ee' }
];
const LV_CFG = [null,
  { topo: 'B', asg: { TL: 'store', TR: 'mgr', BL: 'board', BR: 'work' }, d: [4, 19, 9, 16], seed: 21 },
  { topo: 'C', asg: { TL: 'board', TR: 'store', BL: 'work', BR: 'mgr' }, d: [3, 11, 5, 19], seed: 33 },
  { topo: 'A', asg: { TL: 'mgr', TR: 'board', BL: 'work', BR: 'store' }, d: [3, 5, 12, 9], seed: 47 },
  { topo: 'B', asg: { TL: 'work', TR: 'board', BL: 'store', BR: 'mgr' }, d: [8, 15, 3, 20], seed: 58 },
  { topo: 'C', asg: { TL: 'mgr', TR: 'work', BL: 'board', BR: 'store' }, d: [5, 13, 8, 16], seed: 62 },
  { topo: 'A', asg: { TL: 'work', TR: 'store', BL: 'mgr', BR: 'board' }, d: [2, 5, 10, 13], seed: 77 }
];
let LEVEL = 0, MAP, RG, RECTS, RUG, DOORS, PODIUM, ITEM_DEFS, TOTAL, START, SUIT;

function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function floodFrom(g, c0, r0) { // walking distance (in tiles) from a tile to every reachable tile
  const d = g.map(r => r.map(() => -1)); d[r0][c0] = 0; const q = [[c0, r0]];
  for (let i = 0; i < q.length; i++) { const [c, r] = q[i];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const x = c + a, y = r + b;
      if (g[y] && g[y][x] !== undefined && d[y][x] < 0 && !SOLID.includes(g[y][x])) { d[y][x] = d[r][c] + 1; q.push([x, y]); } }); }
  return d;
}

function buildLevel(i) {
  if (i === 0) {
    const g = L1_MAP.map(r => r.split(''));
    const rg = g.map((row, r) => row.map((ch, c) => c >= 10 && c <= 13 ? 'hall' : r < 7 ? (c < 10 ? 'store' : 'mgr') : (c < 14 ? 'board' : 'work')));
    return { g, rg, rects: { store: [1, 1, 8, 6], mgr: [15, 1, 22, 6], board: [1, 8, 8, 14], work: [15, 8, 22, 14] },
      podium: { x: 80, y: 136 }, start: [5, 13], items: L1_ITEMS.map(d => d.slice()), doors: [[9, 4], [9, 11], [14, 4], [14, 11]], rug: c => c === 11 || c === 12 };
  }
  const cfg = LV_CFG[i], R = rng(cfg.seed), d = cfg.d, key = (c, r) => c + ',' + r;
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill('#')), rg = Array.from({ length: ROWS }, () => Array(COLS).fill('hall'));
  const rects = {}, doors = [];
  const fill = (c0, r0, c1, r1, k) => { for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) { g[r][c] = '.'; rg[r][c] = k; } };
  const addRoom = (pos, c0, r0, c1, r1) => { const k = cfg.asg[pos]; fill(c0, r0, c1, r1, k); rects[k] = [c0, r0, c1, r1]; };
  const door = (c, r) => { g[r][c] = '.'; doors.push([c, r]); };
  let rug = () => false;
  if (cfg.topo === 'A') { addRoom('TL', 1, 1, 8, 6); addRoom('TR', 15, 1, 22, 6); addRoom('BL', 1, 8, 8, 14); addRoom('BR', 15, 8, 22, 14); fill(10, 1, 13, 14, 'hall'); door(9, d[0]); door(14, d[1]); door(9, d[2]); door(14, d[3]); rug = c => c === 11 || c === 12; }
  if (cfg.topo === 'B') { addRoom('TL', 1, 1, 11, 5); addRoom('TR', 13, 1, 22, 5); addRoom('BL', 1, 10, 11, 14); addRoom('BR', 13, 10, 22, 14); fill(1, 7, 22, 8, 'hall'); door(d[0], 6); door(d[1], 6); door(d[2], 9); door(d[3], 9); rug = (c, r) => r === 7 || r === 8; }
  if (cfg.topo === 'C') { addRoom('TL', 1, 1, 11, 6); addRoom('TR', 13, 1, 22, 6); addRoom('BL', 1, 8, 11, 14); addRoom('BR', 13, 8, 22, 14); door(12, d[0]); door(12, d[1]); door(d[2], 7); door(d[3], 7); }
  const res = new Set(); // tiles that must stay clear: doorways, podium front, start
  doors.forEach(([c, r]) => [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => res.add(key(c + a, r + b))));
  const [c0, r0, c1, r1] = rects.board, adjTop = doors.some(([c, r]) => r === r0 - 1);
  const pr = adjTop ? r1 : r0, fr = adjTop ? r1 - 1 : r0 + 1, pc = Math.floor((c0 + c1) / 2);
  g[pr][pc] = 'O'; g[pr][pc + 1] = 'O';
  for (let c = pc - 1; c <= pc + 2; c++) res.add(key(c, fr));
  const start = [pc, adjTop ? r0 + 1 : r1 - 1]; res.add(key(start[0], start[1]));
  const spec = { store: [['SSS', 2], ['B', 6]], mgr: [['DD', 2], ['SS', 1], ['P', 3]], board: [['TTTTT', 1], ['P', 3]], work: [['WWW', 2], ['W', 2], ['B', 3]] };
  Object.keys(rects).forEach(k => { const [a0, b0, a1, b1] = rects[k];
    spec[k].forEach(([str, cnt]) => { let placed = 0;
      for (let tries = 0; tries < 60 && placed < cnt; tries++) {
        const c = a0 + Math.floor(R() * (a1 - a0 - str.length + 2)), r = b0 + Math.floor(R() * (b1 - b0 + 1));
        const cells = [...str].map((ch, j) => [c + j, r, ch]);
        if (cells.some(([x, y]) => g[y][x] !== '.' || res.has(key(x, y)))) continue;
        cells.forEach(([x, y, ch]) => g[y][x] = ch);
        const dist = floodFrom(g, start[0], start[1]); // furniture may never cut off any part of the map
        if (g.every((row, y) => row.every((ch, x) => SOLID.includes(ch) || dist[y][x] >= 0))) placed++; else cells.forEach(([x, y]) => g[y][x] = '.');
      } }); });
  const items = [], want = { store: ['plank', 'plank', 'screw', 'screw'], mgr: ['cushion', 'cushion', 'fabric'], work: ['tool', 'gold', 'gold'] };
  Object.keys(want).forEach(k => { const [a0, b0, a1, b1] = rects[k], cands = [], spots = [];
    for (let r = b0; r <= b1; r++) for (let c = a0; c <= a1; c++) if (g[r][c] === '.' && !res.has(key(c, r))) cands.push([c, r]);
    want[k].forEach(type => {
      let pool = cands.filter(p => !spots.some(s => Math.abs(s[0] - p[0]) + Math.abs(s[1] - p[1]) < 4));
      if (!pool.length) pool = cands.filter(p => !spots.some(s => s[0] === p[0] && s[1] === p[1]));
      const p = pool[Math.floor(R() * pool.length)]; spots.push(p); items.push([type, p[0], p[1]]); }); });
  return { g, rg, rects, podium: { x: (pc + 1) * T, y: pr * T + 8 }, start, items, doors, rug };
}

function loadLevel(i) {
  LEVEL = i; const L = buildLevel(i);
  MAP = L.g.map(r => r.join('')); RG = L.rg; RECTS = L.rects; RUG = L.rug; DOORS = L.doors; PODIUM = L.podium;
  ITEM_DEFS = L.items; TOTAL = ITEM_DEFS.length; START = L.start; SUIT = SUITS[i]; buildBackground();
}
function nextLevel() { loadLevel(Math.min(LEVEL + 1, LEVEL_COUNT - 1)); reset(); }
function restartAll() { loadLevel(0); reset(); }


// ===== STATE =====
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
const $ = id => document.getElementById(id);
const imgs = CHAIRS.map(c => { const i = new Image(); i.src = c.img; return i; });
let S, keys = {}, last = 0, muted = false, parts = [], tick = 0;

function reset() {
  S = { state: 'play', t: TIME_LIMIT, x: START[0] * T + 8, y: START[1] * T + 12, moving: false, carry: false, placed: false,
        got: {}, count: 0, items: ITEM_DEFS.map(d => ({ type: d[0], x: d[1] * T + 8, y: d[2] * T + 8, taken: false })) };
  parts = []; hideOverlay(); hud(); $('timer').classList.remove('low'); $('timer').textContent = TIME_LIMIT;
  toast('Level ' + (LEVEL + 1) + ' · ' + THEMES[LEVEL].name + ' · Become the ' + WINS[LEVEL].title[0] + WINS[LEVEL].title.slice(1).toLowerCase());
}

// ===== SOUND (starts only after the Start button) =====
const SND = {};
['collect', 'chair', 'place', 'win', 'lose'].forEach(n => { try { const a = new Audio('sounds/' + n + '.wav'); a.preload = 'auto'; SND[n] = a; } catch (e) {} });
function play(n) { if (muted || !SND[n]) return; try { SND[n].currentTime = 0; const p = SND[n].play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
$('mute').onclick = () => { muted = !muted; $('mute').textContent = muted ? '🔇' : '🔊'; };

// ===== HUD =====
const stageOf = n => STAGE_AT.filter(m => n >= m).length - 1;
function hud(bump) {
  const st = stageOf(S.count), im = $('chairImg');
  im.src = CHAIRS[Math.max(st, 0)].img; im.classList.toggle('ghost', st < 0);
  $('stageName').textContent = st < 0 ? 'No chair yet' : CHAIRS[st].name;
  if (bump) { im.classList.remove('up'); void im.offsetWidth; im.classList.add('up'); }
  const tot = {}; ITEM_DEFS.forEach(d => tot[d[0]] = (tot[d[0]] || 0) + 1);
  $('mats').innerHTML = `<span class="m"><b>Level ${LEVEL + 1}/${LEVEL_COUNT}</b></span>` + Object.keys(TYPES).map(k => `<span class="m ${(S.got[k] || 0) >= tot[k] ? 'done' : ''}"><i style="background:${TYPES[k].col}"></i>${TYPES[k].name}<b>${S.got[k] || 0}/${tot[k]}</b></span>`).join('') + `<span class="m"><b>Total ${S.count}/${TOTAL}</b></span>`;
}
let toastT;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1400); }

// ===== INPUT =====
const KEYMAP = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
addEventListener('keydown', e => {
  if (KEYMAP[e.key]) { keys[KEYMAP[e.key]] = true; e.preventDefault(); }
  if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && !e.repeat) { e.preventDefault(); interact(); }
});
addEventListener('keyup', e => { if (KEYMAP[e.key]) keys[KEYMAP[e.key]] = false; });
addEventListener('blur', () => keys = {});
document.querySelectorAll('#dpad button').forEach(b => {
  const k = b.dataset.k;
  b.addEventListener('pointerdown', e => { e.preventDefault(); keys[k] = true; });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => keys[k] = false));
});
$('act').addEventListener('pointerdown', e => { e.preventDefault(); interact(); });
document.addEventListener('contextmenu', e => e.preventDefault());

// ===== GAME LOGIC =====
const solidAt = (px, py) => { const c = Math.floor(px / T), r = Math.floor(py / T); return !MAP[r] || SOLID.includes(MAP[r][c] || '#'); };
const blocked = (x, y) => [[-5, -6], [5, -6], [-5, 0], [5, 0]].some(o => solidAt(x + o[0], y + o[1]));

function update(dt) {
  if (!S || S.state !== 'play') return;
  S.t -= dt;
  let dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  S.moving = !!(dx || dy);
  if (S.moving) {
    const l = Math.hypot(dx, dy), sp = SPEED * (S.carry ? CARRY_SLOW : 1) * dt;
    dx = dx / l * sp; dy = dy / l * sp;
    if (!blocked(S.x + dx, S.y)) S.x += dx;
    if (!blocked(S.x, S.y + dy)) S.y += dy;
  }
  S.items.forEach(it => { if (!it.taken && Math.hypot(it.x - S.x, it.y - 4 - S.y) < 11) collect(it); });
  $('timer').textContent = Math.max(0, Math.ceil(S.t));
  $('timer').classList.toggle('low', S.t <= 15);
  if (S.t <= 0) lose();
}

function collect(it) {
  it.taken = true; S.count++; S.got[it.type] = (S.got[it.type] || 0) + 1;
  burst(it.x, it.y, 8, '#f3d66a');
  const before = stageOf(S.count - 1), after = stageOf(S.count);
  hud(after > before);
  if (S.count === TOTAL) {
    S.carry = true; play('chair'); burst(S.x, S.y - 20, 30, '#f3d66a');
    toast('👑 CHAIR COMPLETE! Follow the arrow to the podium!');
  } else { play('collect'); toast('+1 ' + TYPES[it.type].name + (after > before ? ' — chair upgraded!' : '')); }
}

function interact() {
  if (!S || S.state !== 'play') return;
  if (Math.hypot(PODIUM.x - S.x, PODIUM.y - S.y) < 32) {
    if (S.carry) win(); else toast(S.count < TOTAL ? 'The podium is empty. Build the chair first!' : 'Hmm, no chair?');
  } else toast('Nothing to use here.');
}

function win() {
  S.state = 'win'; S.placed = true; S.carry = false; S.moving = false;
  play('place'); burst(PODIUM.x, PODIUM.y, 60, '#f3d66a');
  setTimeout(() => play('win'), 350);
  for (let i = 0; i < 4; i++) setTimeout(() => confetti(), i * 450);
  const my = S, W = WINS[LEVEL];
  setTimeout(() => { if (S !== my) return; showCard(`<div class="card win"><h2>${W.head || 'YOU ARE THE ' + W.title + '!'}</h2>
    <img class="art" src="${W.img}" alt="The new ${W.title}"><p class="big">${W.line}</p>
    <p class="stat">Level ${LEVEL + 1} of ${LEVEL_COUNT} cleared · Time left: ${S.t.toFixed(1)}s</p>${LEVEL < LEVEL_COUNT - 1 ? '<button onclick="nextLevel()">Next Level ▶</button> <button onclick="reset()">Play Again</button>' : '<p class="big">All seven boardrooms conquered. Legendary.</p><button onclick="restartAll()">Play Again</button>'}</div>`); }, 1900);
}

function lose() {
  S.state = 'lose'; S.t = 0; $('timer').textContent = 0; S.moving = false;
  let r = RANKS[0]; RANKS.forEach(k => { if (S.count >= k.min) r = k; });
  play('lose');
  const visual = r.chair === null
    ? `<div class="bin">🗑️📦🪴</div><p><i>Your desk, moments ago. No chair earned.</i></p>`
    : `<img class="ch" src="${CHAIRS[r.chair].img}" alt=""><p><i>Your new seat: ${CHAIRS[r.chair].name}</i></p>`;
  const extra = S.count === TOTAL ? '<p><i>You built the throne… but never reached the podium.</i></p>' : '';
  setTimeout(() => showCard(`<div class="card"><h2>${r.head}</h2>${visual}<p class="stat">Title: ${r.title}</p>
    <p class="stat">Materials collected: ${S.count}/${TOTAL}</p><p>${r.text}</p>${extra}<button onclick="reset()">Play Again</button></div>`), 700);
}

// ===== OVERLAY =====
function showCard(html) { const o = $('overlay'); o.innerHTML = html; o.classList.add('on'); }
function hideOverlay() { $('overlay').classList.remove('on'); }
function title() {
  showCard(`<div class="card"><img class="art" src="images/boardroom.jpg" alt="The boardroom">
  <h1>The Chairman's Chair</h1><p>The Chairman's Chair has gone missing! You have <b>${TIME_LIMIT} seconds</b> to scavenge all ${TOTAL} materials from the Storage Room, Manager's Office and Workshop, build a replacement, and carry it to the podium in the boardroom.</p>
  <p>Fall short and you'll be demoted — or fired. Win to unlock the next of 7 different offices.</p><button id="go">Start</button><p style="font-size:11px">An unofficial fan game inspired by The Mutual Fun</p></div>`);
  $('go').onclick = () => { reset(); play('collect'); };
}

// ===== PARTICLES =====
function burst(x, y, n, c) { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 90, vy: -Math.random() * 80 - 10, l: .7 + Math.random() * .5, c }); }
function confetti() { const cols = ['#c9a227', '#f3d66a', '#9b2335', '#efe6c8', '#7fa57a']; for (let i = 0; i < 40; i++) parts.push({ x: Math.random() * 384, y: -5, vx: (Math.random() - .5) * 30, vy: 20 + Math.random() * 40, l: 3, c: cols[i % 5], g: 1 }); }

// ===== DRAWING =====
const bg = document.createElement('canvas'); bg.width = 384; bg.height = 256;
const room = (c, r) => (c >= 10 && c <= 13) ? 'hall' : r < 7 ? (c < 10 ? 'store' : 'mgr') : (c < 14 ? 'board' : 'work');
function rect(g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w, h); }

// ===== LEVEL THEMES: each office looks richer than the last. Edit colours freely. =====
// w = wall [base, top highlight, trim]; floors are [light, dark]; shelf = [wood, 4 book colours]; crate/table/desk/bench/pot/pod = 3 colours each
const THEMES = [
  { name: 'Back Office', w: ['#5d5a52', '#77736a', '#9a968a'], hall: ['#bdb7a3', '#b3ad99'], store: ['#8f7a5e', '#7f6b50'], mgr: ['#a7a38c', '#9d9983'], board: ['#6e5a4e', '#64524a'], work: ['#7d807a', '#767972'], rug: 'rgba(90,60,60,.3)', bord: 'rgba(190,190,170,.3)',
    shelf: ['#4a3d2c', '#6b6b6b', '#8a8576', '#555555', '#a39d8a'], crate: ['#8a6a3f', '#5e4727', '#b5a98a'], table: ['#4a3d38', '#65524a', '#7a655b'], desk: ['#4b3b2c', '#6a5642', '#e8e4d4'], bench: ['#555a58', '#7a807d', '#8a6a3f'], pot: ['#6b4a33', '#4f7a48', '#66925b'], pod: ['#3a3430', '#6e5a4e', '#a8a290'], door: ['#cfc9b3', '#9a968a'], lab: '#e8e4d4' },
  { name: 'Mint Records Room', w: ['#2f5f55', '#44806f', '#cfe3d8'], hall: ['#e9f1e4', '#d8e8d6'], store: ['#c9a36b', '#b9935d'], mgr: ['#b8d8c8', '#a8cab8'], board: ['#3f6e6a', '#376460'], work: ['#9fb4ad', '#94aaa3'], rug: 'rgba(47,95,85,.3)', bord: 'rgba(207,227,216,.4)',
    shelf: ['#4a6b5a', '#d9e8d2', '#e8c27a', '#8fb9a8', '#f2efe0'], crate: ['#b88a4e', '#7e5a2f', '#cfe3d8'], table: ['#2b4f4a', '#3f6e6a', '#5a8f89'], desk: ['#6b4f35', '#8a6a48', '#fffbea'], bench: ['#6d8a84', '#9fc0b8', '#e0793a'], pot: ['#b8643d', '#2f8a55', '#4fb577'], pod: ['#24443f', '#3f6e6a', '#cfe3d8'], door: ['#e9f1e4', '#cfe3d8'], lab: '#e9f6ee' },
  { name: 'Navy Law Firm', w: ['#232f55', '#344581', '#aab4d4'], hall: ['#e6e4da', '#cfd3e0'], store: ['#8d7656', '#7e684b'], mgr: ['#c8cde0', '#b7bdd6'], board: ['#2a3d7a', '#233468'], work: ['#7d8794', '#737d8a'], rug: 'rgba(35,52,104,.35)', bord: 'rgba(220,200,130,.4)',
    shelf: ['#3c2f24', '#2a3d7a', '#c9a227', '#8a2f3a', '#e6e4da'], crate: ['#8a6a3f', '#5e4727', '#aab4d4'], table: ['#1a2347', '#2a3d7a', '#4d62a8'], desk: ['#3e3025', '#5c4733', '#f0eee4'], bench: ['#4d5663', '#7d8a9c', '#d98a2b'], pot: ['#7a4a30', '#2f7a5a', '#46a07a'], pod: ['#161d3a', '#2a3d7a', '#c9a227'], door: ['#e6e4da', '#aab4d4'], lab: '#e6e8f4' },
  { name: "Classic Members' Club", w: ['#4b5d49', '#5f7459', '#c9a227'], hall: ['#e8e0c0', '#d8dcb6'], store: ['#b78a55', '#a67a47'], mgr: ['#a9c0a0', '#9db596'], board: ['#7a1f2b', '#6c1a26'], work: ['#8e9a8a', '#859180'], rug: 'rgba(122,31,43,.35)', bord: 'rgba(201,162,39,.35)',
    shelf: ['#5a3a1c', '#7a1f2b', '#c9a227', '#4b5d49', '#efe6c8'], crate: ['#9a6a35', '#6f4721', '#c9a227'], table: ['#c9a227', '#5a1520', '#7a1f2b'], desk: ['#4a2e17', '#6b3f1f', '#efe6c8'], bench: ['#5f6b68', '#8a9894', '#c0582b'], pot: ['#8b4a2b', '#2f7a3c', '#46a05a'], pod: ['#3a1219', '#7a1f2b', '#c9a227'], door: ['#e8e0c0', '#c9a227'], lab: '#efe6c8' },
  { name: 'Emerald Library', w: ['#1f4a3a', '#2e6a54', '#d4a82a'], hall: ['#d9d2b0', '#c9c29e'], store: ['#7a5a3a', '#6b4d30'], mgr: ['#3f7a62', '#376f58'], board: ['#1f5a45', '#1a4f3c'], work: ['#6f7f78', '#66766f'], rug: 'rgba(20,70,50,.4)', bord: 'rgba(212,168,42,.5)',
    shelf: ['#3a2515', '#8a2f3a', '#d4a82a', '#2e6a54', '#efe6c8'], crate: ['#8a5f2f', '#5a3d1c', '#d4a82a'], table: ['#d4a82a', '#143a2d', '#2e6a54'], desk: ['#3a2515', '#5a3a22', '#efe6c8'], bench: ['#4f605a', '#7d918a', '#d4a82a'], pot: ['#a0552e', '#1f7a3f', '#3fb35a'], pod: ['#10281f', '#1f5a45', '#d4a82a'], door: ['#d9d2b0', '#d4a82a'], lab: '#f3e9b8' },
  { name: 'Art Deco Penthouse', w: ['#17171f', '#2b2b38', '#e0b83a'], hall: ['#f0ead6', '#1f1f2a'], store: ['#5c4630', '#4f3b28'], mgr: ['#2f2f3d', '#282834'], board: ['#3d1f52', '#341a47'], work: ['#3f4450', '#383c48'], rug: 'rgba(224,184,58,.28)', bord: 'rgba(224,184,58,.6)',
    shelf: ['#0f0f16', '#e0b83a', '#7a2f8a', '#2f8a7a', '#f0ead6'], crate: ['#6b4a28', '#3f2a15', '#e0b83a'], table: ['#e0b83a', '#15151d', '#3d1f52'], desk: ['#15151d', '#2b2b38', '#f0ead6'], bench: ['#2b2e38', '#5a6070', '#e0b83a'], pot: ['#e0b83a', '#2f8a7a', '#4fc2a8'], pod: ['#0f0f16', '#3d1f52', '#e0b83a'], door: ['#f0ead6', '#e0b83a'], lab: '#f6e08a' },
  { name: 'Royal Palace', w: ['#5a1230', '#7a2146', '#f3d66a'], hall: ['#fbf6e6', '#efe3bd'], store: ['#c9a063', '#b88f52'], mgr: ['#f2e6c0', '#e6d6a6'], board: ['#8e1b34', '#7a152b'], work: ['#d6cdb0', '#c9bf9f'], rug: 'rgba(142,27,52,.4)', bord: 'rgba(243,214,106,.8)',
    shelf: ['#6b4a1c', '#8e1b34', '#f3d66a', '#2f6aa8', '#fff6d8'], crate: ['#d4a82a', '#9a7a14', '#fff0a8'], table: ['#f3d66a', '#6b1226', '#8e1b34'], desk: ['#9a7a14', '#d4a82a', '#fff6d8'], bench: ['#b8a46a', '#e8d9a0', '#8e1b34'], pot: ['#f3d66a', '#2f8a4a', '#5fd37f'], pod: ['#4a0f26', '#8e1b34', '#f3d66a'], door: ['#fff6d8', '#f3d66a'], lab: '#fff0a8' }
];

function buildBackground() {
  const g = bg.getContext('2d'), TH = THEMES[LEVEL], lv = LEVEL, B = RECTS.board;
  for (let r = 0; r < 16; r++) for (let c = 0; c < 24; c++) {
    const x = c * T, y = r * T, ch = MAP[r][c], chk = (c + r) % 2, rm = RG[r][c];
    if (ch === '#') { // walls get fancier with the level
      rect(g, TH.w[0], x, y, T, T); rect(g, TH.w[1], x, y, T, 3);
      if (lv >= 2) rect(g, 'rgba(0,0,0,.16)', x, y + 5, T, 1);
      if (lv >= 4) rect(g, 'rgba(255,255,255,.1)', x + (c % 2 ? 2 : 9), y + 7, 5, 5);
      rect(g, TH.w[2], x, y + T - (lv >= 5 ? 3 : 2), T, lv >= 5 ? 2 : 1); continue;
    }
    if (rm === 'store') { rect(g, TH.store[0], x, y, T, T); rect(g, TH.store[1], x, y + 7, T, 1); rect(g, TH.store[1], x + (r % 2 ? 4 : 11), y, 1, 7); }
    else { const f = TH[rm]; rect(g, chk ? f[0] : f[1], x, y, T, T); }
    if (rm === 'hall' && RUG(c, r)) rect(g, TH.rug, x, y, T, T);
    if (rm === 'board' && (c === B[0] || c === B[2] || r === B[1] || r === B[3])) rect(g, TH.bord, x, y, T, T);
    if (lv >= 3 && chk && c % 2 === 0) rect(g, 'rgba(255,255,255,.12)', x + 6, y + 6, 4, 4);
    if (lv >= 5) { rect(g, 'rgba(255,255,255,.08)', x, y, T, 1); if (c % 4 === 0 && r % 4 === 0) rect(g, TH.w[2], x, y, 2, 2); }
    if (ch === 'S') { rect(g, TH.shelf[0], x, y, T, T); TH.shelf.slice(1).forEach((k, i) => { rect(g, k, x + 1 + i * 4, y + 2, 3, 5); rect(g, k, x + 2 + i * 4, y + 9, 3, 5); }); }
    if (ch === 'B') { rect(g, TH.crate[0], x + 1, y + 1, 14, 14); rect(g, TH.crate[1], x + 1, y + 1, 14, 2); rect(g, TH.crate[1], x + 7, y + 1, 2, 14); rect(g, TH.crate[2], x + 6, y + 6, 4, 3); }
    if (ch === 'T') { rect(g, TH.table[0], x, y + 1, T, 14); rect(g, TH.table[1], x, y + 2, T, 12); rect(g, TH.table[2], x, y + 3, T, 3); }
    if (ch === 'D') { rect(g, TH.desk[0], x, y + 1, T, 15); rect(g, TH.desk[1], x, y + 1, T, 12); if (c % 2) { rect(g, TH.desk[2], x + 3, y + 4, 7, 5); rect(g, TH.w[2], x + 11, y + 4, 2, 2); } }
    if (ch === 'W') { rect(g, TH.bench[0], x, y + 1, T, 15); rect(g, TH.bench[1], x, y + 1, T, 11); rect(g, TH.bench[2], x + 3 + (c % 3) * 3, y + 4, 2, 6); rect(g, '#222', x + 10, y + 5, 3, 3); }
    if (ch === 'P') { rect(g, 'rgba(0,0,0,.2)', x + 3, y + 13, 10, 2); rect(g, TH.pot[0], x + 4, y + 9, 8, 6); rect(g, TH.pot[1], x + 2, y + 2, 12, 9); rect(g, TH.pot[2], x + 4, y + 3, 5, 5); rect(g, TH.pot[1], x + 7, y, 2, 4); }
    if (ch === 'O') { rect(g, TH.pod[0], x, y, T, T); rect(g, TH.pod[1], x, y + 3, T, 12); rect(g, TH.pod[2], x, y + 3, T, 2); rect(g, TH.pod[2], x + (MAP[r][c - 1] !== 'O' ? 1 : 13), y + 3, 2, 12); }
  }
  DOORS.forEach(([c, r]) => { const x = c * T, y = r * T; rect(g, TH.door[0], x, y, T, T); if (MAP[r - 1][c] === '#' && MAP[r + 1][c] === '#') { rect(g, TH.door[1], x, y, T, 2); rect(g, TH.door[1], x, y + 14, T, 2); } else { rect(g, TH.door[1], x, y, 2, T); rect(g, TH.door[1], x + 14, y, 2, T); } });
  g.font = 'bold 8px Georgia, serif'; g.textAlign = 'left';
  const lab = (t, x, y, c) => { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillText(t, x + 1, y + 1); g.fillStyle = c; g.fillText(t, x, y); };
  Object.keys(RECTS).forEach(k => lab(NAMES[k], RECTS[k][0] * T + 4, (RECTS[k][1] - 1) * T + 11, k === 'board' ? '#f3d66a' : TH.lab));
}

function drawItem(it, i) {
  const bob = Math.sin(tick * 3 + i) * 1.5, x = Math.round(it.x), y = Math.round(it.y + bob);
  rect(ctx, 'rgba(0,0,0,.3)', x - 5, it.y + 5, 10, 2);
  switch (it.type) {
    case 'plank': rect(ctx, '#a86f35', x - 6, y - 2, 12, 4); rect(ctx, '#c99250', x - 6, y - 2, 12, 1); rect(ctx, '#555', x - 5, y, 1, 1); rect(ctx, '#555', x + 4, y, 1, 1); break;
    case 'screw': rect(ctx, '#b8b8b8', x - 1, y - 3, 2, 8); rect(ctx, '#777', x - 3, y - 5, 6, 2); rect(ctx, '#eee', x, y - 2, 1, 6); break;
    case 'cushion': rect(ctx, '#9b2335', x - 5, y - 4, 10, 8); rect(ctx, '#c9a227', x - 5, y - 4, 2, 2); rect(ctx, '#c9a227', x + 3, y + 2, 2, 2); rect(ctx, '#c9a227', x - 1, y - 1, 2, 2); break;
    case 'fabric': rect(ctx, '#d9c9a0', x - 5, y - 3, 10, 6); rect(ctx, '#7a1f2b', x - 5, y - 1, 10, 1); rect(ctx, '#7a1f2b', x - 5, y + 1, 10, 1); rect(ctx, '#b8a878', x + 3, y - 3, 2, 6); break;
    case 'tool': rect(ctx, '#8a8f94', x - 3, y - 6, 6, 3); rect(ctx, '#222', x - 1, y - 6, 2, 1); rect(ctx, '#8a8f94', x - 1, y - 3, 2, 5); rect(ctx, '#c0582b', x - 1, y + 1, 2, 4); break;
    case 'gold': rect(ctx, '#a07d12', x - 5, y - 3, 10, 6); rect(ctx, '#d4a82a', x - 5, y - 3, 10, 5); rect(ctx, '#f3d66a', x - 5, y - 3, 10, 2); break;
  }
  if (Math.floor(tick * 2 + i) % 3 === 0) rect(ctx, '#fff', x + 5, y - 6, 1, 1);
}

function drawPlayer() {
  const ox = Math.round(S.x) - 6, oy = Math.round(S.y) - 15, step = S.moving ? Math.floor(tick * 9) % 2 : 0, bob = S.moving && step ? 1 : 0;
  const p = (c, x, y, w, h) => rect(ctx, c, ox + x, oy + y - bob + (bob && y > 10 ? bob : 0), w, h);
  rect(ctx, 'rgba(0,0,0,.3)', ox + 1, oy + 14, 10, 2);
  p(SUIT.pants, 3, 11, 2, 3 - (step ? 1 : 0)); p(SUIT.pants, 7, 11, 2, 3 - (step ? 0 : 1));
  p('#2a2018', 2, 14 - (step ? 1 : 0), 3, 1); p('#2a2018', 7, 14 - (step ? 0 : 1), 3, 1);
  p(SUIT.suit, 2, 6, 8, 6); p(SUIT.suit, 1, 7 + step, 1, 4); p(SUIT.suit, 10, 8 - step, 1, 4);
  p('#e9b98e', 1, 10 + step, 1, 1); p('#e9b98e', 10, 11 - step, 1, 1);
  p(SUIT.shirt, 5, 6, 2, 1); p(SUIT.tie, 5, 7, 2, 4);
  p('#e9b98e', 3, 0, 6, 6); p('#e9b98e', 2, 2, 1, 2); p('#e9b98e', 9, 2, 1, 2);
  p('#b8b8b8', 3, 2, 6, 2); p('#fff', 4, 2, 1, 2); p('#fff', 7, 2, 1, 2); p('#222', 4, 3, 1, 1); p('#222', 7, 3, 1, 1);
  p('#5a2a20', 5, 5, 2, 1);
  if (S.carry) {
    const im = imgs[5], h = 22, w = h * im.naturalWidth / (im.naturalHeight || 1), yy = oy - h - 1 + Math.sin(tick * 6) * 1;
    ctx.fillStyle = 'rgba(243,214,106,.35)'; ctx.fillRect(ox + 6 - w / 2 - 1, yy - 1, w + 2, h + 2);
    if (im.complete) ctx.drawImage(im, Math.round(ox + 6 - w / 2), Math.round(yy), Math.round(w), h);
  }
}

function drawParts(dt) {
  parts = parts.filter(p => (p.l -= dt) > 0);
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g ? 5 : 160) * dt; rect(ctx, p.c, Math.round(p.x), Math.round(p.y), 2, 2); });
}

// Podium label + glow, and an arrow that points at the podium once the chair is finished
function drawGuide() {
  const pulse = 0.5 + 0.5 * Math.sin(tick * 6), g = ctx;
  if (S.carry && !S.placed) {
    g.fillStyle = 'rgba(243,214,106,' + (0.2 + 0.35 * pulse) + ')'; g.fillRect(PODIUM.x - 22, PODIUM.y - 12, 44, 40);
    g.strokeStyle = 'rgba(243,214,106,' + (0.5 + 0.5 * pulse) + ')'; g.lineWidth = 2; g.strokeRect(PODIUM.x - 22, PODIUM.y - 12, 44, 40);
  }
  if (S.placed) return;
  g.font = 'bold 8px Georgia, serif'; g.textAlign = 'center';
  const ty = PODIUM.y + 22 + (S.carry ? Math.round(pulse * 2) : 0), txt = (S.carry ? '▲ ' : '') + 'PODIUM';
  g.fillStyle = '#3a1219'; g.fillText(txt, PODIUM.x + 1, ty + 1); g.fillStyle = S.carry ? '#f3d66a' : '#efe6c8'; g.fillText(txt, PODIUM.x, ty);
  g.textAlign = 'left';
  if (!S.carry) return;
  const px = S.x, py = S.y - 8, a = Math.atan2(PODIUM.y - py, PODIUM.x - px), d = Math.hypot(PODIUM.x - px, PODIUM.y - py);
  if (d < 34) return;
  const r = 26 + pulse * 3, cx = px + Math.cos(a) * r, cy = py + Math.sin(a) * r;
  const pt = (ang, len) => [cx + Math.cos(a + ang) * len, cy + Math.sin(a + ang) * len];
  const tip = pt(0, 8), l = pt(2.5, 7), rr = pt(-2.5, 7);
  g.beginPath(); g.moveTo(tip[0], tip[1]); g.lineTo(l[0], l[1]); g.lineTo(cx - Math.cos(a) * 2, cy - Math.sin(a) * 2); g.lineTo(rr[0], rr[1]); g.closePath();
  g.fillStyle = '#f3d66a'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#7a1f2b'; g.stroke();
}

function frame(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; tick += dt;
  update(dt);
  ctx.drawImage(bg, 0, 0);
  if (S) {
    S.items.forEach((it, i) => { if (!it.taken) drawItem(it, i); });
    if (S.placed) { // finished chair sits on the podium
      const im = imgs[5], h = 22, w = h * im.naturalWidth / (im.naturalHeight || 1);
      ctx.fillStyle = 'rgba(243,214,106,' + (0.25 + 0.15 * Math.sin(tick * 8)) + ')'; ctx.fillRect(PODIUM.x - w / 2 - 3, PODIUM.y - h - 2, w + 6, h + 6);
      if (im.complete) ctx.drawImage(im, Math.round(PODIUM.x - w / 2), PODIUM.y - h + 2, Math.round(w), h);
    }
    if (S.state === 'play' || S.state === 'lose') drawPlayer();
    else if (S.state === 'win') { drawPlayer(); }
    if (S.state === 'play' || S.state === 'win') drawGuide();
  }
  drawParts(dt);
  requestAnimationFrame(frame);
}

// ===== BOOT =====
loadLevel(0);
S = { state: 'title', t: TIME_LIMIT, x: 5 * T, y: 13 * T, items: [], count: 0, got: {} };
hud(); title();
requestAnimationFrame(frame);
