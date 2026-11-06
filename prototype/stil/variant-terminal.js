// PROTOTYPE (kastes): Variant C, kolonistens terminal (personlig biomonitor).
// Kartet er et tegnrutenett generert med kode, kroppen er en SVG-wireframe.

const TERMINAL_CSS = `
body.v-C { background: #050d08; color: #7dffa8; font: 20px/1.15 'VT323', monospace; text-shadow: 0 0 4px rgba(125,255,168,.45); }
body.v-C::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 30;
  background: repeating-linear-gradient(rgba(0,0,0,.22) 0 1px, transparent 1px 3px), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.6)); }
.tm-root { display: grid; grid-template-columns: 300px 1fr 300px; gap: 10px; padding: 10px 10px 74px; }
.tm-status { grid-column: 1 / -1; border: 1px solid #2f7a4f; padding: 4px 10px; display: flex; gap: 22px; flex-wrap: wrap; color: #b6ffcf; }
.tm-status .warn { color: #ffb347; }
.tm-win { border: 1px solid #2f7a4f; position: relative; padding: 18px 10px 10px; min-width: 0; }
.tm-head { position: absolute; top: -12px; left: 10px; background: #050d08; padding: 0 6px; color: #b6ffcf; letter-spacing: 1px; }
.tm-dim { color: #3f9c66; }
.tm-warn { color: #ffb347; text-shadow: 0 0 4px rgba(255,179,71,.5); }
.tm-crit { color: #ff5a4a; text-shadow: 0 0 5px rgba(255,90,74,.6); }
.tm-blink { animation: tmblink 1s steps(2, start) infinite; }
@keyframes tmblink { to { visibility: hidden; } }
.tm-center { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.tm-map { margin: 0; font: 18px/1 'VT323', monospace; overflow-x: auto; white-space: pre; }
.tm-map .j { color: #1f6b3f; } .tm-map .f { color: #6a8f7a; } .tm-map .w { color: #3aa0ff; text-shadow: 0 0 4px rgba(58,160,255,.5); }
.tm-map .r { color: #2f7a4f; } .tm-map .n { color: #b6ffcf; cursor: help; } .tm-map .unk { color: #4fbf80; cursor: help; }
.tm-map .here { color: #050d08; background: #7dffa8; text-shadow: none; } .tm-map .d { color: #ff5a4a; cursor: help; }
.tm-legend { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); margin-top: 8px; color: #3f9c66; font-size: 18px; }
.tm-body { display: block; width: 210px; margin: 0 auto; }
.tm-body .z { fill: rgba(125,255,168,.04); stroke: #7dffa8; stroke-width: 1.2; cursor: help; }
.tm-body .z:hover { fill: rgba(125,255,168,.2); }
.tm-body .grid { stroke: #123d24; stroke-width: .6; }
.tm-table { width: 100%; border-collapse: collapse; font-size: 19px; }
.tm-table td { padding: 0 2px; }
.tm-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.tm-choice { display: block; cursor: pointer; }
.tm-choice:hover { background: #7dffa8; color: #050d08; text-shadow: none; }
.tm-prompt { margin-top: 8px; color: #b6ffcf; }
.tm-cursor { display: inline-block; width: 10px; height: 18px; background: #7dffa8; vertical-align: -3px; animation: tmblink 1s steps(2, start) infinite; }
.tm-btn { background: none; border: 1px solid #7dffa8; color: #7dffa8; font: inherit; padding: 0 8px; cursor: pointer; text-shadow: inherit; }
.tm-btn:hover { background: #7dffa8; color: #050d08; }
.v-C #tip { background: #050d08; border: 1px solid #7dffa8; padding: 4px 8px; font: 19px/1.1 'VT323', monospace; color: #7dffa8; }
.v-C .sheet-inner { background: #050d08; border: 1px solid #7dffa8; padding: 16px 22px; min-width: 360px; color: #7dffa8; font: 21px/1.15 'VT323', monospace; text-shadow: 0 0 4px rgba(125,255,168,.45); }
.v-C .sheet-inner h2, .v-C .sheet-inner h3 { font-weight: 400; margin: 6px 0; color: #b6ffcf; }
.v-C .sheet-inner table { width: 100%; }
.v-C .sheet-inner td:last-child { text-align: right; }
.v-C .sheet-hint { color: #3f9c66; }
@media (max-width: 1000px) { .tm-root { grid-template-columns: 1fr; } .tm-cols { grid-template-columns: 1fr; } }
`;

const TM_STATUS = ['OK', 'LETT', 'MODERAT', 'ALVORLIG'];
const TM_FILL = ['', 'rgba(125,255,168,.25)', 'rgba(255,179,71,.45)', 'rgba(255,90,74,.55)'];

function tmMap() {
  const W = 74, H = 24;
  const grid = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => {
    const r = Math.hypot((x - W / 2 + 0.5) / (W / 2 - 1), (y - H / 2 + 0.5) / (H / 2 - 0.5));
    const lake = Math.hypot((x - (W - 5)) / 2, y - 17) < 3.3;
    if (lake) return { ch: '~', cls: 'w' };
    if (Math.abs(r - 1) < 0.045) {
      const gap = x > W * 0.86 && y > 6 && y < 11;
      return gap ? { ch: ' ', cls: '' } : { ch: '#', cls: 'f' };
    }
    if (r > 1) return { ch: (x * 7 + y * 13) % 5 === 0 ? '^' : (x + y) % 2 ? '"' : "'", cls: 'j' };
    return { ch: ' ', cls: '' };
  }));
  const pos = (n) => [Math.round(4 + n.x * (W - 14)), Math.round(1 + n.y * (H - 3))];
  const put = (x, y, ch, cls) => { if (grid[y]?.[x]) grid[y][x] = { ch, cls }; };
  for (const [a, b] of GAME.edges) {
    const [x1, y1] = pos(nodeById(a)), [x2, y2] = pos(nodeById(b));
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) put(x, y1, '·', 'r');
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) put(x2, y, '·', 'r');
  }
  for (const n of GAME.nodes) {
    const [x, y] = pos(n);
    const here = n.id === GAME.location.id;
    const label = here ? `[@${n.code}]` : `[${n.code}]`;
    const cls = (here ? 'here' : n.visited ? 'n' : 'unk') + ` node-${n.id}`;
    [...label].forEach((ch, i) => put(x - 2 + i, y, ch, cls));
    if (n.danger) put(x + label.length - 2, y, '!', 'd tm-blink node-' + n.id);
  }
  return grid.map((row) => {
    let out = '', cur = null, buf = '';
    const flush = () => { if (buf) out += cur ? `<span class="${cur}">${esc(buf)}</span>` : esc(buf); buf = ''; };
    for (const c of row) { if (c.cls !== cur) { flush(); cur = c.cls; } buf += c.ch; }
    flush();
    return out;
  }).join('\n');
}

function tmBody() {
  let s = '';
  for (let y = 0; y < 420; y += 20) s += `<line class="grid" x1="40" y1="${y}" x2="260" y2="${y}"/>`;
  for (let x = 40; x <= 260; x += 20) s += `<line class="grid" x1="${x}" y1="0" x2="${x}" y2="400"/>`;
  const fill = (id) => TM_FILL[GAME.zones[id].status] || 'rgba(125,255,168,.04)';
  const cls = (id) => 'z' + (GAME.zones[id].status === 3 ? ' tm-blink' : '');
  for (const [id, sh] of Object.entries(JR_SHAPES)) {
    if (!sh) continue;
    const st = `style="fill:${fill(id)}" class="${cls(id)}" data-zone="${id}"`;
    s += sh[0] === 'e' ? `<ellipse cx="${sh[1]}" cy="${sh[2]}" rx="${sh[3]}" ry="${sh[4]}" ${st}/>` : `<rect x="${sh[1]}" y="${sh[2]}" width="${sh[3]}" height="${sh[4]}" ${st}/>`;
  }
  const f = (id, el) => el.replace('/>', ` style="fill:${fill(id)}" class="${cls(id)}" data-zone="${id}"/>`);
  s += f('ears', '<ellipse cx="124" cy="52" rx="5" ry="9"/>') + f('ears', '<ellipse cx="176" cy="52" rx="5" ry="9"/>');
  s += f('eyes', '<ellipse cx="140" cy="45" rx="5" ry="3"/>') + f('eyes', '<ellipse cx="160" cy="45" rx="5" ry="3"/>');
  s += f('nose', '<rect x="146" y="50" width="8" height="10"/>') + f('mouth', '<rect x="141" y="66" width="18" height="5"/>');
  return `<svg class="tm-body" viewBox="60 0 180 400">${s}</svg>`;
}

function tmMeter(v) {
  const filled = Math.round(v.value / 10);
  const cls = v.good ? '' : v.value > 50 ? 'tm-warn' : '';
  return `<span class="${cls}">${v.label.toUpperCase().padEnd(8, ' ')}[${'#'.repeat(filled)}${'.'.repeat(10 - filled)}] ${String(v.value).padStart(3, ' ')}%</span>`;
}

function renderTerminal(app) {
  const g = GAME, t = g.time, loc = g.location;
  const injured = Object.values(g.zones).filter((z) => z.status > 0);
  const rowCls = (z) => (z.status === 3 ? 'tm-crit' : z.status === 2 ? 'tm-warn' : '');
  app.innerHTML = `<div class="tm-root">
    <div class="tm-status">
      <span>NEW HOME :: PERSONLIG BIOMONITOR v2.3</span>
      <span>DAG ${t.day} ${t.clock}</span><span>${t.phase.toUpperCase()}</span><span>${t.weather.toUpperCase()} ${t.temp}</span>
      <span class="warn">KOLONINETT: FRAKOBLET</span><span class="warn">BATTERI 12%</span>
      <button class="tm-btn" data-sheet>[C] PROFIL</button>
    </div>
    <div class="tm-win">
      <span class="tm-head">┤ BIOMONITOR: ${esc(g.character.name.toUpperCase())} ├</span>
      ${tmBody()}
      <table class="tm-table">${injured.map((z) => `<tr class="${rowCls(z)}"><td>${esc(z.label.toUpperCase())}</td><td style="text-align:right">${TM_STATUS[z.status]}</td></tr>`).join('')}
        <tr class="tm-dim"><td>ØVRIGE SONER</td><td style="text-align:right">OK</td></tr></table>
      <pre style="margin:10px 0 0;font:inherit">${g.vitals.map(tmMeter).join('\n')}</pre>
    </div>
    <div class="tm-center">
      <div class="tm-win">
        <span class="tm-head">┤ KOLONIKART (SIST SYNKET 03:41) ├</span>
        <pre class="tm-map">${tmMap()}</pre>
        <div class="tm-legend">${g.nodes.map((n) => `<span>${n.code} ${esc(n.name)}</span>`).join('')}</div>
      </div>
      <div class="tm-cols">
        <div class="tm-win">
          <span class="tm-head">┤ POSISJON: ${loc.name.split(' (')[0].toUpperCase()} ├</span>
          <div>${esc(loc.desc)}</div>
          <div style="margin-top:6px">${loc.rooms.map((r) => `<div class="${r.done ? 'tm-dim' : ''}">${r.done ? '[x]' : '[ ]'} ${r.name.padEnd(10, ' ')} ${r.state}</div>`).join('')}</div>
        </div>
        <div class="tm-win">
          <span class="tm-head">┤ HANDLINGER ├</span>
          ${loc.choices.map((c) => `<span class="tm-choice" data-cmd="${esc(c.text)}">[${c.key}] ${c.text} <span class="tm-dim">${c.meta}</span></span>`).join('')}
          <div class="tm-prompt">&gt; <span id="tm-cmd"></span><span class="tm-cursor"></span></div>
        </div>
      </div>
      <div class="tm-win">
        <span class="tm-head">┤ LOGG ├</span>
        ${g.log.map((l, i) => `<div class="${i === g.log.length - 1 ? 'tm-warn' : ''}"><span class="tm-dim">${l.t}</span> ${esc(l.text)}</div>`).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="tm-win">
        <span class="tm-head">┤ UTSTYR ├</span>
        <div><span class="tm-dim">H.HÅND</span> ${esc(g.hands.right)}</div>
        <div class="tm-crit"><span class="tm-dim">V.HÅND</span> ${esc(g.hands.left)}</div>
        <div><span class="tm-dim">PÅ DEG</span> ${g.worn.join(', ')}</div>
      </div>
      <div class="tm-win">
        <span class="tm-head">┤ INVENTAR ├</span>
        ${g.inventory.map((it) => `<div>- ${esc(it.name)} <span class="tm-dim">${esc(it.note)}</span></div>`).join('')}
      </div>
      <div class="tm-win">
        <span class="tm-head">┤ I NÆRHETEN ├</span>
        ${g.ground.map((it) => `<div>- ${esc(it.name)} <span class="tm-dim">${esc(it.note)}</span></div>`).join('')}
      </div>
      <div class="tm-win">
        <span class="tm-head">┤ LYDSENSOR ├</span>
        <div class="tm-warn tm-blink">!! ${esc(g.sounds[0])}</div>
        <div class="tm-dim">${esc(g.sounds[1])}</div>
        <div class="tm-dim" style="margin-top:6px">Hørsel redusert: rekkevidde -40%</div>
      </div>
    </div>
  </div>`;

  app.querySelectorAll('[data-zone]').forEach((el) => {
    el.addEventListener('mousemove', (e) => showTip(zoneTip(el.dataset.zone), e.clientX, e.clientY));
    el.addEventListener('mouseleave', hideTip);
  });
  for (const n of g.nodes) {
    app.querySelectorAll('.node-' + n.id).forEach((el) => {
      el.addEventListener('mousemove', (e) => showTip(`${esc(n.name)}<br>${n.visited ? 'BESØKT' : 'STATUS UKJENT'}${n.danger ? '<br>' + esc(n.danger) : ''}`, e.clientX, e.clientY));
      el.addEventListener('mouseleave', hideTip);
    });
  }
  app.querySelectorAll('[data-cmd]').forEach((el) => {
    el.addEventListener('click', () => { app.querySelector('#tm-cmd').textContent = el.dataset.cmd.toLowerCase(); });
  });
}
