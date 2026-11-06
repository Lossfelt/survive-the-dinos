// PROTOTYPE (kastes): Variant B, feltdagbok.
// Alt er tegnet med kode: "skjelvende" SVG-streker gir håndtegnet preg.

const JOURNAL_CSS = `
body.v-B { background: radial-gradient(ellipse at 30% 20%, #4a3324, #23170f 70%); color: #2b2a33; font: 19px/1.25 'Patrick Hand', cursive; }
.jr-desk { padding: 20px 16px 80px; display: flex; justify-content: center; }
.jr-book { position: relative; display: grid; grid-template-columns: 1fr 1.35fr; max-width: 1280px; width: 100%; filter: drop-shadow(0 12px 24px rgba(0,0,0,.55)); }
.jr-page { background: #f2e8cf; padding: 22px 26px; min-height: 760px; position: relative; }
.jr-left { border-radius: 6px 0 0 6px; background-image: radial-gradient(#c9bd9f 1px, transparent 1.2px); background-size: 18px 18px; box-shadow: inset -24px 0 30px -18px rgba(80,50,20,.45); }
.jr-right { border-radius: 0 6px 6px 0; background-image: repeating-linear-gradient(transparent 0 27px, #c8d3dc 27px 28px); box-shadow: inset 24px 0 30px -18px rgba(80,50,20,.45); }
.jr-right::after { content: ''; position: absolute; width: 130px; height: 130px; right: 40px; bottom: 60px; border-radius: 50%; border: 6px solid rgba(120,70,30,.18); filter: blur(1px); pointer-events: none; }
.v-B h2, .v-B h3, .jr-date { font-family: 'Caveat', cursive; font-weight: 700; margin: 0; }
.v-B h2 { font-size: 34px; line-height: 1; }
.v-B h3 { font-size: 26px; margin-top: 10px; }
.jr-date { font-size: 24px; color: #5a4a3a; margin-bottom: 6px; }
.jr-sub { color: #6b5d4f; margin-bottom: 4px; }
.jr-body-svg { width: 100%; max-width: 380px; display: block; margin: 0 auto; }
.jr-ink { fill: none; stroke: #2e2f3a; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; }
.jr-faint { stroke: #6d6a72; stroke-width: .9; }
.jr-hit { fill: transparent; cursor: help; }
.jr-hit:hover { fill: rgba(190,60,40,.12); }
.jr-ann { font-family: 'Caveat', cursive; font-size: 19px; fill: #3b3a44; }
.jr-vitals { display: grid; grid-template-columns: auto auto 1fr; gap: 2px 10px; align-items: center; margin-top: 6px; }
.jr-vitals svg { width: 92px; height: 18px; }
.jr-vitals small { color: #6b5d4f; font-size: 17px; }
.jr-sticky { background: #f7e27a; padding: 12px 16px 14px; margin: 16px 6px 0; transform: rotate(-1.6deg); box-shadow: 2px 4px 8px rgba(0,0,0,.25); position: relative; }
.jr-sticky::before { content: ''; position: absolute; top: -10px; left: 40%; width: 80px; height: 22px; background: rgba(255,255,255,.55); transform: rotate(3deg); }
.jr-sticky ul { margin: 4px 0 0; padding-left: 0; list-style: none; columns: 2; }
.jr-sticky li::before { content: '☐ '; }
.jr-map-svg { width: 100%; display: block; }
.jr-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.jr-rooms { list-style: none; padding: 0; margin: 4px 0; }
.jr-rooms li.done { text-decoration: line-through; color: #8a8178; }
.jr-choice { display: block; padding: 0 0 0 4px; cursor: pointer; border-radius: 3px; }
.jr-choice:hover { background: rgba(255,230,120,.55); }
.jr-choice small { color: #7a6d60; }
.jr-log p { margin: 0; }
.jr-log b { font-family: 'Caveat', cursive; font-size: 22px; margin-right: 6px; color: #5a4a3a; }
.jr-tab { position: absolute; right: -36px; top: 60px; background: #a8402e; color: #f7ecd6; padding: 10px 8px; writing-mode: vertical-rl; font-family: 'Caveat', cursive; font-size: 22px; border-radius: 0 6px 6px 0; cursor: pointer; box-shadow: 2px 2px 6px rgba(0,0,0,.3); }
.v-B #tip { background: #fbf4df; border: 1px solid #b9a984; padding: 6px 10px; font: 18px/1.2 'Patrick Hand', cursive; color: #2b2a33; transform: rotate(-1deg); box-shadow: 2px 3px 6px rgba(0,0,0,.3); }
.v-B .sheet-inner { background: #f2e8cf; padding: 22px 28px; min-width: 340px; transform: rotate(.6deg); box-shadow: 0 10px 30px rgba(0,0,0,.5); font: 20px/1.3 'Patrick Hand', cursive; }
.v-B .sheet-inner table { width: 100%; border-collapse: collapse; }
.v-B .sheet-inner td { border-bottom: 1px dashed #b9a984; padding: 2px 4px; }
.v-B .sheet-inner td:last-child { text-align: right; font-family: 'Caveat', cursive; font-size: 26px; font-weight: 700; }
.v-B .sheet-hint { color: #8a8178; font-size: 16px; }
@media (max-width: 900px) { .jr-book { grid-template-columns: 1fr; } .jr-cols { grid-template-columns: 1fr; } .jr-tab { right: 0; } }
`;

const JR_PENCIL = ['#2e2f3a', '#c9a227', '#d9822b', '#c0392b'];

function jrPath(pts) {
  return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}
function jrLine(rng, x1, y1, x2, y2, j = 1.2) {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 18));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, w = i === 0 || i === n ? j * 0.4 : j;
    pts.push([x1 + (x2 - x1) * t + (rng() - 0.5) * w, y1 + (y2 - y1) * t + (rng() - 0.5) * w]);
  }
  return jrPath(pts);
}
function jrEllipse(rng, cx, cy, rx, ry, j = 1.2) {
  const pts = [], start = rng() * 6.28, steps = 26;
  for (let i = 0; i <= steps + 2; i++) {
    const a = start + (i / steps) * Math.PI * 2, k = 1 + (rng() - 0.5) * j * 0.04;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return jrPath(pts);
}
function jrRect(rng, x, y, w, h, j = 1.2) {
  return [jrLine(rng, x - 2, y, x + w + 2, y, j), jrLine(rng, x + w, y - 2, x + w, y + h + 2, j),
    jrLine(rng, x + w + 2, y + h, x - 2, y + h, j), jrLine(rng, x, y + h + 2, x, y - 2, j)].join(' ');
}
// To strøk oppå hverandre gir skisse-effekt.
function jrInk(rng, fn, args, cls = 'jr-ink', style = '') {
  return `<path class="${cls}" style="${style}" d="${fn(rng, ...args)}"/><path class="${cls}" style="${style};opacity:.55" d="${fn(rng, ...args)}"/>`;
}
function jrHatch(rng, x, y, w, h, color, gap = 5) {
  let d = '';
  for (let k = -h; k < w; k += gap) {
    const x1 = Math.max(x, x + k), y1 = y + Math.max(0, -k), x2 = Math.min(x + w, x + k + h), y2 = y + Math.min(h, w - k);
    d += jrLine(rng, x1, y1, x2, y2, 0.8) + ' ';
  }
  return `<path d="${d}" style="fill:none;stroke:${color};stroke-width:1.1;opacity:.8"/>`;
}

const JR_SHAPES = {
  skull: ['e', 150, 50, 24, 30], ears: null, eyes: null, nose: null, mouth: null,
  neck: ['r', 141, 80, 18, 16], chest: ['r', 116, 96, 68, 60], belly: ['r', 120, 156, 60, 56],
  armR: ['r', 94, 100, 18, 108], handR: ['e', 102, 220, 9, 12], armL: ['r', 188, 100, 18, 108], handL: ['e', 198, 220, 9, 12],
  legR: ['r', 122, 214, 24, 150], footR: ['e', 132, 375, 16, 8], legL: ['r', 154, 214, 24, 150], footL: ['e', 168, 375, 16, 8],
};
const JR_ANN = {
  skull: { x: 196, y: 20, to: [168, 30], text: ['svimmel, hjernerystelse?'] },
  ears: { x: 6, y: 34, to: [122, 50], text: ['øret piper,', 'hører dårlig'] },
  chest: { x: 222, y: 110, to: [182, 118], text: ['blåmerker'] },
  armL: { x: 222, y: 168, to: [206, 160], text: ['kutt'] },
  handL: { x: 218, y: 226, to: [208, 222], text: ['BRENT!', 'kan ikke holde noe'] },
  footR: { x: 40, y: 410, to: [128, 384], text: ['barbeint, skrubbsår på begge'] },
};

function jrBody() {
  const rng = mulberry32(21);
  let s = '';
  for (const [id, sh] of Object.entries(JR_SHAPES)) {
    if (!sh) continue;
    s += sh[0] === 'e' ? jrInk(rng, jrEllipse, sh.slice(1)) : jrInk(rng, jrRect, sh.slice(1));
  }
  s += jrInk(rng, jrEllipse, [124, 52, 5, 9]) + jrInk(rng, jrEllipse, [176, 52, 5, 9]);
  s += jrInk(rng, jrEllipse, [140, 45, 4, 2]) + jrInk(rng, jrEllipse, [160, 45, 4, 2]);
  s += `<path class="jr-ink" d="M150 48 L147 60 L152 61"/><path class="jr-ink" d="M141 70 Q150 76 159 70"/>`;
  // Skader: farget blyant-skravering og kommentarer i margen.
  for (const [id, z] of Object.entries(GAME.zones)) {
    if (!z.status) continue;
    const col = JR_PENCIL[z.status];
    const sh = JR_SHAPES[id];
    if (sh) {
      const [kind, a, b, c, d] = sh;
      const box = kind === 'e' ? [a - c, b - d, c * 2, d * 2] : [a, b, c, d];
      s += jrHatch(rng, ...box, col, z.status === 3 ? 3 : 5);
    }
    if (id === 'ears') s += jrInk(rng, jrEllipse, [124, 52, 9, 14], 'jr-ink', `stroke:${col};stroke-width:2`);
    const ann = JR_ANN[id];
    if (!ann) continue;
    const tx = ann.x < 150 ? ann.x + 95 : ann.x - 4;
    s += `<path class="jr-ink jr-faint" d="${jrLine(rng, tx, ann.y - 5, ann.to[0], ann.to[1], 1)}"/>`;
    s += `<text class="jr-ann" x="${ann.x}" y="${ann.y}" style="fill:${z.status === 3 ? col : '#3b3a44'}">${ann.text.map((t, i) => `<tspan x="${ann.x}" dy="${i ? 18 : 0}">${esc(t)}</tspan>`).join('')}</text>`;
  }
  // Usynlige treffområder for hover.
  const hit = (id, el) => el.replace('<', `<`).replace('/>', ` class="jr-hit" data-zone="${id}"/>`);
  for (const [id, sh] of Object.entries(JR_SHAPES)) {
    if (!sh) continue;
    s += sh[0] === 'e' ? hit(id, `<ellipse cx="${sh[1]}" cy="${sh[2]}" rx="${sh[3]}" ry="${sh[4]}"/>`) : hit(id, `<rect x="${sh[1]}" y="${sh[2]}" width="${sh[3]}" height="${sh[4]}"/>`);
  }
  s += hit('ears', '<ellipse cx="124" cy="52" rx="6" ry="10"/>') + hit('ears', '<ellipse cx="176" cy="52" rx="6" ry="10"/>');
  s += hit('eyes', '<ellipse cx="140" cy="45" rx="6" ry="4"/>') + hit('eyes', '<ellipse cx="160" cy="45" rx="6" ry="4"/>');
  s += hit('nose', '<rect x="144" y="49" width="12" height="13"/>') + hit('mouth', '<rect x="139" y="64" width="22" height="10"/>');
  return `<svg class="jr-body-svg" viewBox="0 0 340 420">${s}</svg>`;
}

function jrVitalBoxes(v, seed) {
  const rng = mulberry32(seed);
  const filled = Math.round(v.value / 20);
  const col = v.good ? '#3f7d3a' : v.value > 50 ? '#d9822b' : '#c9a227';
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += `<path class="jr-ink" d="${jrRect(rng, 3 + i * 17, 3, 13, 12, 0.8)}"/>`;
    if (i < filled) s += jrHatch(rng, 4 + i * 17, 4, 11, 10, col, 3);
  }
  return `<svg viewBox="0 0 92 18">${s}</svg>`;
}

function jrMap() {
  const rng = mulberry32(5);
  const P = (n) => [20 + n.x * 560, 24 + n.y * 300];
  let s = '';
  for (let i = 0; i < 520; i++) {
    const x = rng() * 600, y = rng() * 360;
    if (Math.hypot((x - 300) / 285, (y - 180) / 168) < 1.03) continue;
    s += `<path d="M${x - 3} ${y - 4} L${x} ${y} L${x + 3} ${y - 5}" style="fill:none;stroke:#4b7a3d;stroke-width:1;opacity:.75"/>`;
  }
  s += `<path class="jr-ink" style="stroke-dasharray:7 5" d="${jrEllipse(rng, 300, 180, 280, 164, 0.6)}"/>`;
  s += `<path class="jr-ink" style="stroke:#2c5d8f" d="${jrEllipse(rng, 572, 262, 30, 24)}"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M${556} ${252 + i * 7} q4 -3 8 0 t8 0 t8 0" style="fill:none;stroke:#2c5d8f;stroke-width:1"/>`;
  for (const [a, b] of GAME.edges) {
    const [x1, y1] = P(nodeById(a)), [x2, y2] = P(nodeById(b));
    s += `<path class="jr-ink jr-faint" style="stroke-dasharray:4 4" d="${jrLine(rng, x1, y1, x2, y2, 2)}"/>`;
  }
  for (const n of GAME.nodes) {
    const [x, y] = P(n);
    s += jrInk(rng, jrRect, [x - 9, y - 9, 18, 16]);
    if (n.type === 'syk') s += `<path class="jr-ink" style="stroke:#c0392b" d="M${x} ${y - 6} V${y + 4} M${x - 5} ${y - 1} H${x + 5}"/>`;
    const here = n.id === GAME.location.id;
    s += `<text class="jr-ann" x="${x + 13}" y="${y + 6}" style="fill:${here ? '#a8402e' : n.visited ? '#2e2f3a' : '#6d6a72'};font-weight:${here ? 700 : 400}">${esc(n.name)}${n.visited ? '' : ' ?'}</text>`;
    s += `<rect class="jr-hit" data-node="${n.id}" x="${x - 12}" y="${y - 12}" width="24" height="22"/>`;
  }
  const [hx, hy] = P(nodeById('hjem'));
  s += `<path class="jr-ink" style="stroke:#c0392b;stroke-width:2.4" d="M${hx - 7} ${hy - 7} L${hx + 7} ${hy + 7} M${hx + 7} ${hy - 7} L${hx - 7} ${hy + 7}"/>`;
  s += `<path class="jr-ink" style="stroke:#c0392b;stroke-width:1.6" d="${jrEllipse(rng, hx, hy, 18, 15)}"/>`;
  const [vx, vy] = P(nodeById('vann'));
  s += `<text class="jr-ann" x="${vx - 70}" y="${vy - 26}" style="fill:#c0392b;font-size:24px;font-weight:700">!! tunge skritt??</text>`;
  s += `<text class="jr-ann" x="520" y="96" style="fill:#5a4a3a" transform="rotate(-8 520 96)">gjerdet brutt her?</text>`;
  s += `<path class="jr-ink" d="M30 20 L30 56 M23 30 L30 20 L37 30"/><text class="jr-ann" x="24" y="74">N</text>`;
  return `<svg class="jr-map-svg" viewBox="0 0 600 360">${s}</svg>`;
}

function renderJournal(app) {
  const g = GAME, t = g.time, loc = g.location;
  app.innerHTML = `<div class="jr-desk"><div class="jr-book">
    <div class="jr-page jr-left">
      <div class="jr-date">Dag ${t.day}, kl. ${t.clock}. ${t.phase.toLowerCase()}, ${t.weather.toLowerCase()}, ${t.temp}</div>
      <h2>${esc(g.character.name)}</h2>
      <div class="jr-sub">${esc(g.character.role)}</div>
      ${jrBody()}
      <div class="jr-vitals">${g.vitals.map((v, i) => `<span>${v.label}</span>${jrVitalBoxes(v, 40 + i)}<small>${v.text}</small>`).join('')}</div>
      <div class="jr-sticky">
        <b>I hendene:</b> ${esc(g.hands.right)}. Venstre: ${esc(g.hands.left.toLowerCase())}.<br>
        <b>På meg:</b> ${g.worn.join(', ').toLowerCase()}.
        <ul>${g.inventory.map((it) => `<li>${esc(it.name)} <small>(${esc(it.note.toLowerCase())})</small></li>`).join('')}</ul>
        <b>Ligger her:</b> ${g.ground.map((it) => esc(it.name.toLowerCase())).join(', ')}
      </div>
    </div>
    <div class="jr-page jr-right">
      <h2>Kolonien</h2>
      ${jrMap()}
      <div class="jr-cols">
        <div>
          <h3>${esc(loc.name)}</h3>
          <div>${esc(loc.desc)}</div>
          <ul class="jr-rooms">${loc.rooms.map((r) => `<li class="${r.done ? 'done' : ''}">${r.name}: ${r.state.toLowerCase()}</li>`).join('')}</ul>
          <div><i>Hører:</i> ${g.sounds.map((x) => x.toLowerCase()).join('. ')}.</div>
        </div>
        <div>
          <h3>Hva nå?</h3>
          ${loc.choices.map((c) => `<span class="jr-choice">${c.key}. ${c.text} <small>(${c.meta})</small></span>`).join('')}
          <h3>Notater</h3>
          <div class="jr-log">${g.log.map((l) => `<p><b>${l.t}</b>${esc(l.text)}</p>`).join('')}</div>
        </div>
      </div>
    </div>
    <div class="jr-tab" data-sheet>Om meg [C]</div>
  </div></div>`;

  app.querySelectorAll('[data-zone]').forEach((el) => {
    el.addEventListener('mousemove', (e) => showTip(zoneTip(el.dataset.zone), e.clientX, e.clientY));
    el.addEventListener('mouseleave', hideTip);
  });
  app.querySelectorAll('[data-node]').forEach((el) => {
    const n = nodeById(el.dataset.node);
    el.addEventListener('mousemove', (e) => showTip(`<b>${esc(n.name)}</b><br>${n.visited ? 'Besøkt' : 'Vet ikke hvordan det ser ut der nå'}${n.danger ? '<br>' + esc(n.danger) : ''}`, e.clientX, e.clientY));
    el.addEventListener('mouseleave', hideTip);
  });
}
