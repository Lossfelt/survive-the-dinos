// PROTOTYPE (kastes): Variant A, pikselgrafikk.
// All grafikk lages med kode: sprites er tekstrutenett med palett, terrenget er støy + dithering.

const PIXEL_CSS = `
body.v-A { background: #0b0e14; color: #d9dccf; font: 14px/1.4 system-ui, sans-serif; }
.v-A h2, .v-A h3, .v-A .px-title { font-family: 'Silkscreen', monospace; font-weight: 400; letter-spacing: .5px; margin: 0 0 8px; }
.v-A h2 { font-size: 15px; color: #e0c341; }
.v-A h3 { font-size: 12px; color: #9fb0c8; margin-top: 12px; }
.px-root { display: grid; grid-template-columns: 250px 1fr 290px; grid-template-rows: auto 1fr; gap: 12px; padding: 12px 12px 72px; min-height: 100vh; }
.px-panel { background: #1a2030; border: 4px solid #070a10; box-shadow: inset 4px 4px 0 #2b3550, inset -4px -4px 0 #11151f; padding: 12px; }
.px-top { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.px-top .px-title { margin: 0; font-size: 14px; }
.px-btn { font-family: 'Silkscreen', monospace; font-size: 12px; background: #e0c341; color: #111; border: 0; box-shadow: inset -3px -3px 0 #9a7f1c, inset 3px 3px 0 #f6e08a; padding: 7px 10px; cursor: pointer; }
.px-btn:hover { filter: brightness(1.1); }
.px-body { display: flex; flex-direction: column; align-items: center; }
.px-legend { display: flex; gap: 6px; flex-wrap: wrap; font-size: 11px; margin: 8px 0; justify-content: center; }
.px-legend i { display: inline-block; width: 10px; height: 10px; margin-right: 3px; vertical-align: -1px; }
.px-injuries { list-style: none; padding: 0; margin: 0; font-size: 12px; width: 100%; }
.px-injuries li { padding: 3px 0; border-bottom: 2px solid #11151f; }
.px-injuries i { display: inline-block; width: 10px; height: 10px; margin-right: 6px; }
.px-vital { margin: 6px 0; font-size: 12px; width: 100%; }
.px-vital .row { display: flex; justify-content: space-between; }
.px-bar { display: flex; gap: 2px; margin-top: 3px; }
.px-bar span { flex: 1; height: 8px; background: #0c0f16; }
.px-center { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.px-map { position: relative; padding: 0; }
.px-map canvas { display: block; width: 100%; image-rendering: pixelated; }
.px-label { position: absolute; transform: translate(-50%, 4px); font-size: 11px; background: rgba(7,10,16,.78); padding: 1px 4px; white-space: nowrap; cursor: default; }
.px-label.unv { color: #9aa3b5; }
.px-label.here { color: #e0c341; font-weight: 700; }
.px-label.danger { color: #ff7a6a; }
.px-loc { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.px-loc p { margin: 0 0 8px; color: #b9bdb0; }
.px-rooms { list-style: none; padding: 0; margin: 0; font-size: 13px; }
.px-rooms li { padding: 2px 0; }
.px-rooms li.done { color: #6f7788; text-decoration: line-through; }
.px-choice { display: flex; justify-content: space-between; width: 100%; text-align: left; margin-bottom: 4px; background: #252d42; color: #e6e8de; border: 0; box-shadow: inset -3px -3px 0 #141a28, inset 3px 3px 0 #364262; padding: 6px 8px; cursor: pointer; font: 13px system-ui, sans-serif; }
.px-choice:hover { background: #2f3a56; }
.px-choice b { font-family: 'Silkscreen', monospace; color: #e0c341; margin-right: 6px; font-weight: 400; }
.px-choice small { color: #8d97ad; }
.px-log { font-family: 'VT323', monospace; font-size: 18px; line-height: 1.15; max-height: 150px; overflow: auto; }
.px-log div:last-child { color: #e0c341; }
.px-log span { color: #6f7f9c; margin-right: 8px; }
.px-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 6px; }
.px-item { background: #11151f; padding: 6px 4px; text-align: center; font-size: 11px; }
.px-item canvas { width: 32px; height: 32px; image-rendering: pixelated; display: block; margin: 0 auto 4px; }
.px-item small { color: #8d97ad; display: block; }
.px-kv { font-size: 12px; margin: 2px 0; }
.px-kv span { color: #8d97ad; }
.px-sound { color: #ff9a6a; font-size: 12px; margin: 3px 0; }
.v-A #tip { background: #070a10; border: 2px solid #e0c341; padding: 6px 8px; font: 12px/1.4 system-ui, sans-serif; color: #e6e8de; }
.v-A .tip-bad { color: #ff8a6a; } .v-A .tip-good { color: #7ad97a; }
.v-A [data-zone] { cursor: help; }
.px-fx { font-style: normal; font-family: 'Silkscreen', monospace; color: #7ad97a; }
.v-A .sheet-inner { background: #1a2030; border: 4px solid #070a10; box-shadow: inset 4px 4px 0 #2b3550, inset -4px -4px 0 #11151f; padding: 18px 22px; min-width: 320px; color: #e6e8de; }
.v-A .sheet-inner table { width: 100%; border-collapse: collapse; font-size: 13px; }
.v-A .sheet-inner td { padding: 3px 4px; border-bottom: 2px solid #11151f; }
.v-A .sheet-inner td:last-child { text-align: right; color: #e0c341; font-family: 'Silkscreen', monospace; }
.v-A .sheet-hint { font-size: 11px; color: #8d97ad; }
@media (max-width: 900px) { .px-root { grid-template-columns: 1fr; } .px-loc { grid-template-columns: 1fr; } }
`;

const PX_PAL = {
  r: '#8a3b2e', w: '#cfc6b0', k: '#1b1f2a', d: '#3b2a20', x: '#d8343a', b: '#3a5a7a', B: '#5d8fbf',
  p: '#6b6b6b', c: '#3d6b7a', C: '#7fd0d8', g: '#9a9a8a', o: '#5a3f2a', G: '#4f8a3a', s: '#d8343a',
  S: '#e8e0d0', f: '#555555', F: '#e8c547', m: '#7a7f86', M: '#9aa0a8',
};
const PX_BUILDINGS = {
  house: ['....rrr....', '...rrrrr...', '..rrrrrrr..', '.rrrrrrrrr.', 'rrrrrrrrrrr', '.wwwwwwwww.', '.wkwwwwwkw.', '.wwwwddwww.', '.wwwwddwww.'],
  syk: ['....rrr....', '...rrrrr...', '..rrrrrrr..', '.rrrrrrrrr.', 'rrrrrrrrrrr', '.SSSSxSSSS.', '.SSSxxxSSS.', '.SSSSxSddS.', '.SSSSSSddS.'],
  vann: ['..bbbbbbb..', '.bBBBBBBBb.', '.bBBBBBBBb.', '.bbbbbbbbb.', '.bBBBBBBBb.', '.bbbbbbbbb.', '..p.....p..', '..p.....p..', 'pppppppppp.'],
  reaktor: ['...ccccc...', '..cCCCCCc..', '.cCCCCCCCc.', 'cCCCCCCCCCc', 'ggggggggggg', 'gkgggggggkg', 'ggggddggggg', 'ggggddggggg'],
  vakt: ['..rrrrrrr..', '..wkwwwkw..', '..wwwwwww..', '...p...p...', '...pp.pp...', '...p.p.p...', '...pp.pp...', '...p...p...', '..pp...pp..'],
  aker: ['ooooooooooo', 'GoGoGoGoGoG', 'ooooooooooo', 'GoGoGoGoGoG', 'ooooooooooo', 'GoGoGoGoGoG'],
  butikk: ['sSsSsSsSsSs', 'SsSsSsSsSsS', '.wwwwwwwww.', '.wkkkwkkkw.', '.wkkkwkkkw.', '.wwwwddwww.', '.wwwwddwww.'],
  adm: ['.....fFF...', '.....fFF...', '.....f.....', 'rrrrrrrrrrr', 'wwwwwwwwwww', 'wkwkwkwkwkw', 'wwwwwwwwwww', 'wkwkwddwkwk', 'wwwwwddwwww'],
  drift: ['........pp.', '........pp.', 'mmmmmmmmpp.', 'mMmMmMmMmmm', 'mmmmmmmmmmm', 'mkkmmmmkkmm', 'mmmmddmmmmm', 'mmmmddmmmmm'],
};
const PX_THEROPOD = [
  '....xxxxx.............', '...xxxxxxx............', '..xxoxxxxxx...........', '.xxxxxxxxxxx..........',
  'xxxxxxxx.xxxx.........', 'xxxxx.....xxxxx.......', '..........xxxxxxx.....', '..........xxxxxxxxxx..',
  '...........xxxxxxxxxxx', '...........xxxxxx...xx', '...........xx..xx.....', '..........xx...xx.....',
  '..........x....x......', '.........xx...xx......',
];
const PX_ICON_PAL = {
  Y: '#ffe680', y: '#d9b44a', g: '#8b9096', b: '#4a3a2a', B: '#7a5c3c', o: '#6b4b2b', O: '#c98a3a',
  w: '#c8d8e8', k: '#333333', r: '#b0403a', R: '#e0605a', c: '#8fd0e0', C: '#dff6ff',
};
const PX_ICONS = {
  flashlight: ['........', '........', '.Y.ggggg', 'YYYggggg', 'YYYggggg', '.Y.ggggg', '........', '........'],
  key: ['........', '.yyy....', 'y...y...', 'y...yyyy', 'y...y.y.', '.yyy..y.', '........', '........'],
  backpack: ['..bbbb..', '.b....b.', 'bBBBBBBb', 'bBbbbbBb', 'bBbBBbBb', 'bBbbbbBb', 'bBBBBBBb', '.bbbbbb.'],
  bar: ['........', '........', 'oOOOOOOo', 'oOwwOOOo', 'oOOOOOOo', '........', '........', '........'],
  bottle: ['...kk...', '...ww...', '..w..w..', '.w....w.', '.w....w.', '.w....w.', '.w....w.', '..wwww..'],
  extinguisher: ['..kk....', '..rrk...', '.rrrr...', '.rRrr...', '.rRrr...', '.rrrr...', '.rrrr...', '..rr....'],
  glass: ['........', '.c......', 'cCc..c..', '.c..cC..', '....c.c.', '..c.....', '.cCc....', '........'],
};
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function pxSprite(ctx, rows, pal, x, y) {
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = pal[row[i]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x + i, y + j, 1, 1);
    }
  });
}

function pxNoise(seed) {
  const rnd = mulberry32(seed), G = 64;
  const grid = Array.from({ length: G * G }, rnd);
  const at = (i, j) => grid[((j % G) + G) % G * G + ((i % G) + G) % G];
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), u = s(x - xi), v = s(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function pxDither(shades, v, x, y) {
  const t = Math.min(0.999, Math.max(0, v)) * (shades.length - 1);
  const i = Math.floor(t);
  const step = t - i > BAYER[y % 4][x % 4] / 16 ? 1 : 0;
  return shades[Math.min(i + step, shades.length - 1)];
}

function pxNodePos(n, W, H) {
  return [Math.round(10 + n.x * (W - 20)), Math.round(10 + n.y * (H - 18))];
}

function pxTerrain(ctx, W, H) {
  const n = pxNoise(7);
  const fbm = (x, y) => n(x / 18, y / 18) * 0.55 + n(x / 7 + 40, y / 7) * 0.3 + n(x / 3 + 80, y / 3) * 0.15;
  const JUNGLE = ['#0d2414', '#143a1d', '#1d5027', '#2a6a31'];
  const GRASS = ['#3a5428', '#46652f', '#557638'];
  const DIRT = ['#55432f', '#66543b'];
  const WATER = ['#1d3d63', '#2a5a8a'];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = fbm(x, y);
      const r = Math.hypot((x - 100) / 86, (y - 62) / 56);
      const lake = Math.hypot(x - 188, y - 86) < 14 + (v - 0.5) * 12;
      let col;
      if (lake) col = pxDither(WATER, n(x / 4, y / 2), x, y);
      else if (Math.abs(r - 1) < 0.012 && n(x / 6, y / 6) < 0.72) col = (x + y) % 2 ? '#9aa0a8' : '#4a4f57';
      else if (r > 1) col = pxDither(JUNGLE, v * 1.1 - 0.05, x, y);
      else if (v < 0.4) col = pxDither(DIRT, v * 2.5, x, y);
      else col = pxDither(GRASS, (v - 0.4) * 2, x, y);
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function pxLine(ctx, x0, y0, x1, y1, color) {
  ctx.fillStyle = color;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function pxStaticMap(W, H) {
  const base = document.createElement('canvas');
  base.width = W; base.height = H;
  const ctx = base.getContext('2d');
  pxTerrain(ctx, W, H);
  for (const [a, b] of GAME.edges) {
    const [x0, y0] = pxNodePos(nodeById(a), W, H), [x1, y1] = pxNodePos(nodeById(b), W, H);
    pxLine(ctx, x0, y0, x1, y1, '#8a7350');
  }
  for (const node of GAME.nodes) {
    const spr = PX_BUILDINGS[node.type];
    const [x, y] = pxNodePos(node, W, H);
    pxSprite(ctx, spr, PX_PAL, x - 5, y - spr.length + 2);
  }
  pxSprite(ctx, PX_THEROPOD, { x: '#050a06', o: '#ff3b2f' }, 172, 50);
  // Natt: mørk blå tone, deretter dithret lys fra lommelykten.
  ctx.fillStyle = 'rgba(8,16,52,0.48)';
  ctx.fillRect(0, 0, W, H);
  const [hx, hy] = pxNodePos(nodeById('hjem'), W, H);
  ctx.fillStyle = 'rgba(255,225,140,0.32)';
  for (let y = hy - 16; y < hy + 16; y++) {
    for (let x = hx - 16; x < hx + 16; x++) {
      const f = 1 - Math.hypot(x - hx, y - hy) / 16;
      if (f > 0 && f > BAYER[(y + 64) % 4][(x + 64) % 4] / 16) ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.fillStyle = '#ff3b2f';
  ctx.fillRect(176, 52, 1, 1);
  return base;
}

function pxAnimateMap(canvas, base) {
  const W = canvas.width, H = canvas.height, ctx = canvas.getContext('2d');
  const rnd = mulberry32(3);
  const drops = Array.from({ length: 90 }, () => [rnd() * W, rnd() * H]);
  const [hx, hy] = pxNodePos(nodeById('hjem'), W, H);
  const [vx, vy] = pxNodePos(nodeById('vann'), W, H);
  let raf, last = 0, frame = 0;
  const tick = (t) => {
    raf = requestAnimationFrame(tick);
    if (t - last < 90) return;
    last = t; frame++;
    ctx.drawImage(base, 0, 0);
    ctx.fillStyle = 'rgba(170,190,235,0.6)';
    for (const d of drops) {
      d[0] -= 1; d[1] += 3;
      if (d[1] > H) { d[1] = 0; d[0] = rnd() * W + 20; }
      if (d[0] < 0) d[0] += W;
      ctx.fillRect(Math.round(d[0]), Math.round(d[1]), 1, 2);
    }
    const r = 2 + (frame % 14);
    ctx.fillStyle = `rgba(255,90,74,${1 - r / 16})`;
    for (let a = 0; a < Math.PI * 2; a += 1 / r) {
      ctx.fillRect(Math.round(vx + Math.cos(a) * r), Math.round(vy - 3 + Math.sin(a) * r * 0.7), 1, 1);
    }
    if (frame % 8 < 5) pxSprite(ctx, ['YYY', '.Y.'], { Y: '#ffe680' }, hx - 1, hy - 13);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function pxIcon(name) {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 8;
  pxSprite(c.getContext('2d'), PX_ICONS[name], PX_ICON_PAL, 0, 0);
  return c;
}

function pxBar(v) {
  const filled = Math.round(v.value / 10);
  const col = v.good ? '#5fbf5a' : v.value > 50 ? '#e08a32' : '#e0c341';
  return Array.from({ length: 10 }, (_, i) => `<span style="${i < filled ? 'background:' + col : ''}"></span>`).join('');
}

function pxItems(list) {
  return `<div class="px-items">${list.map((it) => `<div class="px-item" data-icon="${it.icon}">${esc(it.name)}<small>${esc(it.note)}</small></div>`).join('')}</div>`;
}

function renderPixel(app) {
  const g = GAME, t = g.time;
  app.innerHTML = `<div class="px-root">
    <div class="px-panel px-top">
      <span class="px-title">${esc(g.character.name)} <span style="color:#8d97ad">${esc(g.character.role)}</span></span>
      <span class="px-title" style="color:#9fb0c8">Dag ${t.day} &nbsp; ${t.clock} &nbsp; ${t.phase} &nbsp; ${t.weather} ${t.temp}</span>
      <button class="px-btn" data-sheet>Karakterark [C]</button>
    </div>
    <div class="px-panel px-body">
      <h2>Helse</h2>
      ${pxbPanelHtml()}
      <h3 style="align-self:flex-start">Tilstand</h3>
      ${g.vitals.map((v) => `<div class="px-vital"><div class="row"><span>${v.label}</span><span style="color:#8d97ad">${v.text}</span></div><div class="px-bar">${pxBar(v)}</div></div>`).join('')}
    </div>
    <div class="px-center">
      <div class="px-panel px-map" id="px-map"></div>
      <div class="px-panel px-loc">
        <div>
          <h2>${esc(g.location.name)}</h2>
          <p>${esc(g.location.desc)}</p>
          <ul class="px-rooms">${g.location.rooms.map((r) => `<li class="${r.done ? 'done' : ''}">${r.name} <small style="color:#8d97ad">${r.state}</small></li>`).join('')}</ul>
        </div>
        <div>${g.location.choices.map((c) => `<button class="px-choice" data-choice="${c.key}"><span><b>${c.key}</b>${c.text}${g.treatments[c.key] ? ' <i class="px-fx">+</i>' : ''}</span><small>${c.meta}</small></button>`).join('')}</div>
      </div>
      <div class="px-panel"><h3 style="margin-top:0">Hendelser</h3><div class="px-log">${g.log.map((l) => `<div><span>${l.t}</span>${esc(l.text)}</div>`).join('')}</div></div>
    </div>
    <div class="px-panel">
      <h2>Utstyr</h2>
      <div class="px-kv"><span>Høyre hånd:</span> ${esc(g.hands.right)}</div>
      <div class="px-kv"><span>Venstre hånd:</span> ${esc(g.hands.left)}</div>
      <div class="px-kv"><span>På deg:</span> ${g.worn.join(', ')}</div>
      <h3>Inventar</h3>${pxItems(g.inventory)}
      <h3>Her</h3>${pxItems(g.ground)}
      <h3>Lyder</h3>${g.sounds.map((s) => `<div class="px-sound">♪ ${esc(s)}</div>`).join('')}
    </div>
  </div>`;

  pxbMount(app);
  const hover = (sel, html) => app.querySelectorAll(sel).forEach((el) => {
    el.addEventListener('mousemove', (e) => showTip(html(el), e.clientX, e.clientY));
    el.addEventListener('mouseleave', hideTip);
  });
  hover('li[data-zone]', (el) => zoneTip(el.dataset.zone));
  hover('[data-choice]', (el) => (g.treatments[el.dataset.choice] ? treatmentTip(el.dataset.choice) : esc(el.textContent)));
  app.querySelectorAll('[data-icon]').forEach((el) => el.prepend(pxIcon(el.dataset.icon)));

  const W = 200, H = 120;
  const mapEl = app.querySelector('#px-map');
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  mapEl.append(canvas);
  for (const node of g.nodes) {
    const [x, y] = pxNodePos(node, W, H);
    const el = document.createElement('div');
    el.className = 'px-label' + (node.id === g.location.id ? ' here' : node.danger ? ' danger' : node.visited ? '' : ' unv');
    el.style.left = (x / W) * 100 + '%';
    el.style.top = (y / H) * 100 + '%';
    el.textContent = node.name + (node.visited ? '' : ' ?');
    const state = node.visited ? 'Besøkt' : 'Tilstand ukjent';
    el.onmousemove = (e) => showTip(`<b>${esc(node.name)}</b><br>${state}${node.danger ? '<br>' + esc(node.danger) : ''}`, e.clientX, e.clientY);
    el.onmouseleave = hideTip;
    mapEl.append(el);
  }
  return pxAnimateMap(canvas, pxStaticMap(W, H));
}
