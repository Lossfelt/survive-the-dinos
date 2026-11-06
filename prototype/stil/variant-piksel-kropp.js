// PROTOTYPE (kastes): kroppsfigur og forstørret hode for variant A.
// Sprites tegnes som venstre halvdel og speiles. Skygge, kontur og skader beregnes i kode.

const PXB_SKIN = '#a9aeb6';
const PXB_CLOTH = '#56657d';
const PXB_OUTLINE = '#120c09';
// Gul, oransje og rød fargelegging oppå sonen etter alvorlighet.
const PXB_INJURY = ['', '#f0c419', '#ee7d22', '#d6302a'];
const PXB_TINT = [0, 0.65, 0.75, 0.9];
const PXB_SEP = 'kbgyRLqlSBtf';
// Ansiktstrekk har ingen egen farge: øyne, nese og munn synes bare når de er skadet.
const PXB_BASE = {};
const PXB_ZONE = {
  a: 'skull', h: 'skull', c: 'skull', e: 'eyes', E: 'eyes', n: 'nose', N: 'nose', m: 'mouth', M: 'mouth', r: 'ears',
  k: 'neck', b: 'chest', g: 'belly', y: 'back', R: 'armR', q: 'handR', L: 'armL', l: 'handL',
  S: 'legR', t: 'footR', B: 'legL', f: 'footL',
};
const PXB_SWAP = { R: 'L', L: 'R', q: 'l', l: 'q', S: 'B', B: 'S', t: 'f', f: 't' };

const PXB_BODY_HALF = [
  '............hhhh', '...........hhhhh', '..........hhhhhh', '..........hhhhhh',
  '.........rhhhEhh', '.........rhhhhhh', '.........rhhhhhh', '..........hhhhMM',
  '..........hhhhhh', '...........hhhhh', '............hhhh', '.............kkk',
  '.............kkk', '........bbbbbbbb', '......RRbbbbbbbb',
  ...Array(6).fill('.....RRRbbbbbbbb'),
  ...Array(2).fill('.....RRR.ggggggg'),
  ...Array(6).fill('....RRR..ggggggg'),
  ...Array(3).fill('...qqqq..SSSSSS.'),
  '....qq...SSSSSS.',
  ...Array(6).fill('.........SSSSSS.'),
  ...Array(8).fill('..........SSSSS.'),
  '.......tttttttt.', '.......tttttttt.', '.......tttttttt.',
];

const PXB_HEAD_HALF = [
  '........hhhh', '......hhhhhh', '.....hhhhhhh', '....hhhhhhhh', '...hhhhhhhhh', '...hhhhhhhhh',
  '...hhhhhhhhh', '...hhhhhhhhh', '..rhhheeeehh', '.rrhhheEEehh', '.rrhhheeeehh', '.rrhhhhhhhnN',
  '.rrhhhhhhhnN', '..rhhhhhhhnn', '...hhhhhhhhh', '...hhhhhmMMM', '...hhhhhmmmm', '....hhhhhhhh',
  '.....hhhhhhh', '......hhhhhh', '........hhhh', '.........kkk', '.........kkk',
];

function pxbMirror(half) {
  return half.map((r) => r + [...r].reverse().map((c) => PXB_SWAP[c] || c).join(''));
}
// Ansiktshud under hårfestet ('c') hører til hodeskallen ved hover, men farges ikke av skader der.
function pxbFace(grid, hairline) {
  return grid.map((row, j) => (j >= hairline ? row.replace(/h/g, 'c') : row));
}
const PXB_FRONT = pxbFace(pxbMirror(PXB_BODY_HALF), 4);
// Baksiden: hele hodet blir hodeskalle, overkropp blir rygg, sidene bytter plass.
const PXB_BACK = PXB_FRONT.map((row) => [...row].map((c) => {
  if ('ceEnNmM'.includes(c)) return 'h';
  if (c === 'b' || c === 'g') return 'y';
  return PXB_SWAP[c] || c;
}).join(''));
const PXB_HEAD = pxbFace(pxbMirror(PXB_HEAD_HALF), 8);

function pxbMix(hex, to, t) {
  const p = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(hex, i) + (p(to, i) - p(hex, i)) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

function pxbColor(grid, i, j, hover, clothRows) {
  const ch = grid[j][i];
  const zone = PXB_ZONE[ch];
  let col = PXB_BASE[ch] || PXB_SKIN;
  if (clothRows && j >= clothRows[0] && j <= clothRows[1] && 'gSBy'.includes(ch)) col = PXB_CLOTH;
  const left = grid[j][i - 1], right = grid[j][i + 1];
  if (!left || left === '.') col = pxbMix(col, '#ffffff', 0.2);
  else if (!right || right === '.') col = pxbMix(col, '#000000', 0.25);
  else if (PXB_SEP.includes(ch) && PXB_SEP.includes(right) && PXB_ZONE[right] !== zone) col = pxbMix(col, '#000000', 0.3);
  const s = GAME.zones[zone].status;
  if (s && ch !== 'c' && ch !== 'a') col = pxbMix(col, PXB_INJURY[s], PXB_TINT[s]);
  if (zone === hover) col = pxbMix(col, '#ffffff', 0.4);
  return col;
}

function pxbDraw(canvas, grid, hover, clothRows) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = PXB_OUTLINE;
  grid.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.') ctx.fillRect(i, j, 3, 3); }));
  grid.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === '.') return;
    ctx.fillStyle = pxbColor(grid, i, j, hover, clothRows);
    ctx.fillRect(i + 1, j + 1, 1, 1);
  }));
}

// Lager et lerret med hover som lyser opp hele sonen og viser detaljer.
function pxbCanvas(grid, scale, clothRows) {
  const c = document.createElement('canvas');
  c.width = grid[0].length + 2;
  c.height = grid.length + 2;
  c.style.width = c.width * scale + 'px';
  c.style.imageRendering = 'pixelated';
  c.style.cursor = 'crosshair';
  let hover = null;
  pxbDraw(c, grid, hover, clothRows);
  c.addEventListener('mousemove', (e) => {
    const r = c.getBoundingClientRect();
    const i = Math.floor((e.clientX - r.left) / (r.width / c.width)) - 1;
    const j = Math.floor((e.clientY - r.top) / (r.height / c.height)) - 1;
    const ch = grid[j]?.[i];
    const zone = ch && ch !== '.' ? PXB_ZONE[ch] : null;
    if (zone !== hover) { hover = zone; pxbDraw(c, grid, hover, clothRows); }
    if (zone) showTip(zoneTip(zone), e.clientX, e.clientY);
    else hideTip();
  });
  c.addEventListener('mouseleave', () => { hover = null; pxbDraw(c, grid, null, clothRows); hideTip(); });
  return c;
}

function pxbSwatch(status) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 4;
  const ctx = c.getContext('2d');
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = status ? pxbMix(PXB_SKIN, PXB_INJURY[status], PXB_TINT[status]) : PXB_SKIN;
      ctx.fillRect(i, j, 1, 1);
    }
  }
  return c.toDataURL();
}

const PXB_CSS = `
.pxb-head { display: flex; gap: 10px; align-items: center; width: 100%; margin-bottom: 10px; }
.pxb-face { list-style: none; padding: 0; margin: 0; font-size: 12px; flex: 1; }
.pxb-face li { display: flex; justify-content: space-between; padding: 1px 0; }
.pxb-face span { color: #8d97ad; }
.pxb-views { display: flex; gap: 14px; justify-content: center; }
.pxb-views figure { margin: 0; text-align: center; }
.pxb-views figcaption { font-family: 'Silkscreen', monospace; font-size: 10px; color: #8d97ad; margin-top: 4px; }
.pxb-sw { display: inline-block; width: 12px; height: 12px; margin-right: 4px; vertical-align: -2px; image-rendering: pixelated; background-size: 100% 100%; border: 1px solid #070a10; }
`;

function pxbStatusShort(z) {
  return z.status ? STATUS[z.status].split(' ')[0] : 'Frisk';
}

// Returnerer HTML for helsepanelet; kall pxbMount etterpå for å sette inn lerretene.
function pxbPanelHtml() {
  const face = ['skull', 'eyes', 'ears', 'nose', 'mouth'].map((id) => {
    const z = GAME.zones[id];
    const col = z.status ? PXB_INJURY[z.status] : '#8d97ad';
    return `<li data-zone="${id}"><span>${z.label}</span><b style="color:${col};font-weight:400">${pxbStatusShort(z)}</b></li>`;
  }).join('');
  const injuries = Object.entries(GAME.zones).filter(([, z]) => z.status > 0);
  return `<style>${PXB_CSS}</style>
    <div class="pxb-head"><div id="pxb-head-slot"></div><ul class="pxb-face">${face}</ul></div>
    <div class="pxb-views">
      <figure><div id="pxb-front-slot"></div><figcaption>Forside</figcaption></figure>
      <figure><div id="pxb-back-slot"></div><figcaption>Bakside</figcaption></figure>
    </div>
    <div class="px-legend">${[0, 1, 2, 3].map((s) => `<span><i class="pxb-sw" style="background-image:url(${pxbSwatch(s)})"></i>${STATUS[s].split(' ')[0]}</span>`).join('')}</div>
    <ul class="px-injuries">${injuries.map(([id, z]) => `<li data-zone="${id}"><i class="pxb-sw" style="background-image:url(${pxbSwatch(z.status)})"></i>${esc(z.label)}: ${esc(z.note)}</li>`).join('')}</ul>`;
}

function pxbMount(root) {
  root.querySelector('#pxb-head-slot').append(pxbCanvas(PXB_HEAD, 4));
  root.querySelector('#pxb-front-slot').append(pxbCanvas(PXB_FRONT, 3));
  root.querySelector('#pxb-back-slot').append(pxbCanvas(PXB_BACK, 3));
}
