// PROTOTYPE (kastes): felles testdata, hjelpefunksjoner og variantbytter.
// Spørsmål: Hvilken visuell stil passer Survive the Dinos?

const STATUS = ['Frisk', 'Lett skadet', 'Moderat skadet', 'Alvorlig skadet'];

const GAME = {
  character: { name: 'Ingrid Vold', age: 34, role: 'Vannteknikker', hand: 'Høyrehendt' },
  time: { day: 1, clock: '04:12', phase: 'Natt', weather: 'Lett regn', temp: '24 °C' },
  vitals: [
    { id: 'hunger', label: 'Sult', value: 20, good: false, text: 'Lite sulten' },
    { id: 'thirst', label: 'Tørst', value: 55, good: false, text: 'Tørr i munnen' },
    { id: 'sleep', label: 'Søvn', value: 40, good: false, text: 'Trett' },
    { id: 'stamina', label: 'Stamina', value: 70, good: true, text: 'Litt andpusten' },
  ],
  // injury: heal = tid før den gror av seg selv, effects = negative effekter nå,
  // progression = forverring over tid, outcome = sjanse for godt utfall uten behandling.
  zones: {
    skull: {
      label: 'Hodeskalle', status: 1, note: 'Lett hjernerystelse, svimmel',
      injury: { type: 'Lett hjernerystelse', heal: '2-4 dager', effects: ['-1 INT', 'Svimmel: -10 % treffsikkerhet'],
        progression: 'Ingen, men et nytt slag mot hodet gjør den alvorlig', outcome: '95 % full bedring', treat: 'Hvile' },
    },
    eyes: { label: 'Øyne', status: 0 },
    nose: { label: 'Nese', status: 0 },
    mouth: { label: 'Munn', status: 0 },
    ears: {
      label: 'Ører', status: 2, note: 'Susing etter eksplosjonen, dårligere hørsel',
      injury: { type: 'Lydskade etter eksplosjon', heal: '1-3 uker', effects: ['Hørsel -40 %: oppdager lyder senere'],
        progression: 'Ingen', outcome: '70 % full bedring, ellers varig nedsatt hørsel', treat: 'Ingen kjent behandling' },
    },
    neck: { label: 'Hals', status: 0 },
    chest: {
      label: 'Bryst', status: 1, note: 'Blåmerker',
      injury: { type: 'Blåmerker', heal: '4-6 dager', effects: ['-5 % maks stamina'], progression: 'Ingen', outcome: '100 % full bedring', treat: 'Ikke nødvendig' },
    },
    belly: { label: 'Mage', status: 0 },
    back: { label: 'Rygg', status: 0 },
    armR: { label: 'Høyre arm', status: 0 },
    handR: { label: 'Høyre hånd', status: 0 },
    armL: {
      label: 'Venstre arm', status: 1, note: 'Overfladisk kutt',
      injury: { type: 'Overfladisk kutt', heal: '5-7 dager', effects: ['Blør litt: -1 HP per time'],
        progression: 'Blødningen stopper av seg selv etter ca. 2 t. 15 % infeksjonsrisiko', worsening: true,
        outcome: '85 % gror uten komplikasjoner', treat: 'Rens og bandasjer' },
    },
    handL: {
      label: 'Venstre hånd', status: 3, note: 'Brannskade, kan ikke holde noe',
      injury: { type: 'Brannskade, 2. grad', heal: '3-5 uker', effects: ['Kan ikke holde noe', '-2 DEX', 'Smerte: -10 % stamina'],
        progression: '40 % infeksjonsrisiko. Infeksjon gir feber og kan spre seg', worsening: true,
        outcome: '50 % god funksjon i hånden', treat: 'Bandasjer (handling 3)' },
    },
    legR: { label: 'Høyre bein', status: 0 },
    footR: {
      label: 'Høyre fot', status: 1, note: 'Barbeint, skrubbsår',
      injury: { type: 'Skrubbsår', heal: '3-5 dager', effects: ['Fart -10 %'], progression: 'Forverres når du går barbeint', worsening: true,
        outcome: '95 % full bedring', treat: 'Finn sko' },
    },
    legL: { label: 'Venstre bein', status: 0 },
    footL: {
      label: 'Venstre fot', status: 1, note: 'Barbeint, skrubbsår',
      injury: { type: 'Skrubbsår', heal: '3-5 dager', effects: ['Fart -10 %'], progression: 'Forverres når du går barbeint', worsening: true,
        outcome: '95 % full bedring', treat: 'Finn sko' },
    },
  },
  // Hva en handling endrer, vist ved hover. Nøkkel = handlingens nummer.
  treatments: {
    3: {
      title: 'Bandasjer venstre hånd', cost: '15 min. Bruker genseren som bandasje (du mister varmen fra den)',
      changes: [['Gror på', '3-5 uker', '2-3 uker'], ['Infeksjonsrisiko', '40 %', '10 %'], ['God funksjon', '50 %', '85 %'], ['Smerte', '-10 % stamina', '-5 % stamina']],
    },
    5: {
      title: 'Gjem deg og vent på dagslys', cost: '2 t. Tunge skritt i nærheten',
      changes: [['Hjernerystelse gror på', '2-4 dager', '1-3 dager'], ['Søvnbehov', '40 %', '25 %'], ['Stamina', '70 %', '90 %'], ['Kutt i armen', 'Blør', 'Sluttet å blø']],
    },
  },
  nodes: [
    { id: 'hjem', code: 'B12', name: 'Bolig 12 (ditt hus)', x: 0.44, y: 0.6, type: 'house', visited: true },
    { id: 'b14', code: 'B14', name: 'Bolig 14', x: 0.3, y: 0.52, type: 'house' },
    { id: 'b15', code: 'B15', name: 'Bolig 15', x: 0.55, y: 0.74, type: 'house' },
    { id: 'syk', code: 'SYK', name: 'Sykestue', x: 0.6, y: 0.46, type: 'syk' },
    { id: 'butikk', code: 'BUT', name: 'Butikk', x: 0.36, y: 0.34, type: 'butikk' },
    { id: 'adm', code: 'ADM', name: 'Administrasjon', x: 0.5, y: 0.26, type: 'adm' },
    { id: 'vakt', code: 'VPN', name: 'Vaktpost nord', x: 0.47, y: 0.08, type: 'vakt' },
    { id: 'reaktor', code: 'REA', name: 'Reaktor', x: 0.7, y: 0.2, type: 'reaktor' },
    { id: 'drift', code: 'DRI', name: 'Driftsbygning', x: 0.76, y: 0.42, type: 'drift' },
    { id: 'vann', code: 'VAN', name: 'Vannverk', x: 0.8, y: 0.64, type: 'vann', danger: 'Tunge skritt herfra' },
    { id: 'aker', code: 'ÅKR', name: 'Åkre', x: 0.2, y: 0.72, type: 'aker' },
  ],
  edges: [
    ['hjem', 'b14'], ['hjem', 'b15'], ['hjem', 'syk'], ['b14', 'aker'], ['b14', 'butikk'],
    ['butikk', 'adm'], ['adm', 'syk'], ['adm', 'vakt'], ['adm', 'reaktor'], ['syk', 'drift'],
    ['drift', 'vann'], ['b15', 'vann'], ['reaktor', 'drift'],
  ],
  location: {
    id: 'hjem',
    name: 'Bolig 12 (ditt hus)',
    desc: 'Strømmen er borte. Kapselrommet er sotet og fullt av glass. Gjennom det knuste vinduet hører du regnet.',
    rooms: [
      { name: 'Kjøkken', state: 'Ikke gjennomsøkt' },
      { name: 'Soverom', state: 'Gjennomsøkt', done: true },
      { name: 'Kapselrom', state: 'Kapselen er ødelagt', done: true },
      { name: 'Bad', state: 'Ikke gjennomsøkt' },
    ],
    choices: [
      { key: '1', text: 'Søk gjennom kjøkkenet', meta: '20 min, lite støy' },
      { key: '2', text: 'Søk gjennom badet', meta: '10 min, lite støy' },
      { key: '3', text: 'Bandasjer venstre hånd', meta: '15 min, krever rent tøy' },
      { key: '4', text: 'Gå til Bolig 14', meta: '5 min, tilstand ukjent' },
      { key: '5', text: 'Gjem deg og vent på dagslys', meta: '2 t' },
    ],
  },
  hands: { right: 'Lommelykt (svakt batteri)', left: 'Ubrukelig (brannskade)' },
  worn: ['Pyjamas', 'Genser', 'Ingen sko'],
  inventory: [
    { icon: 'flashlight', name: 'Lommelykt', note: 'Svakt batteri' },
    { icon: 'key', name: 'Husnøkkel', note: 'Bolig 12' },
    { icon: 'backpack', name: 'Ryggsekk', note: 'Tom' },
    { icon: 'bar', name: 'Proteinbar', note: '2 stk' },
    { icon: 'bottle', name: 'Vannflaske', note: 'Tom' },
  ],
  ground: [
    { icon: 'extinguisher', name: 'Brannslukker', note: 'Halvfull' },
    { icon: 'glass', name: 'Glasskår', note: 'Skarpe' },
  ],
  sounds: ['Tunge skritt et sted mot øst', 'Regn mot taket'],
  log: [
    { t: '03:58', text: 'Du våkner på gulvet i kapselrommet. Det piper i ørene.' },
    { t: '04:01', text: 'Kapselen er ødelagt. Venstre hånd er brent.' },
    { t: '04:05', text: 'Du fant en ryggsekk og en genser på soverommet.' },
    { t: '04:10', text: 'Sirenene har stilnet. Det regner.' },
    { t: '04:12', text: 'Du hører tunge skritt et sted mot øst.' },
  ],
  stats: [
    { id: 'STR', label: 'Strength', value: 5 },
    { id: 'CON', label: 'Constitution', value: 6 },
    { id: 'DEX', label: 'Dexterity', value: 4 },
    { id: 'INT', label: 'Intelligence', value: 7 },
    { id: 'CHA', label: 'Charisma', value: 5 },
  ],
  skills: [
    { label: 'Mekanikk og rør', value: 3 },
    { label: 'Vannrensing', value: 3 },
    { label: 'Førstehjelp', value: 1 },
    { label: 'Sniking', value: 1 },
    { label: 'Nærkamp', value: 0 },
    { label: 'Overlevelse i naturen', value: 0 },
  ],
};

// Seedet tilfeldighet slik at alt genererte ser likt ut ved hver lasting.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nodeById(id) {
  return GAME.nodes.find((n) => n.id === id);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Felles tooltip, stylet per variant via CSS.
function showTip(html, x, y) {
  const tip = document.getElementById('tip');
  if (tip.innerHTML !== html) tip.innerHTML = html;
  tip.hidden = false;
  // Snu til venstre/oppover når tooltipen ellers havner utenfor vinduet.
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = (x + 14 + w > innerWidth ? x - 14 - w : x + 14) + 'px';
  tip.style.top = Math.max(4, y + 14 + h > innerHeight ? y - 14 - h : y + 14) + 'px';
}
function hideTip() {
  document.getElementById('tip').hidden = true;
}
function tipRows(rows) {
  return `<table class="tip-table">${rows.map(([k, v, cls]) => `<tr><td>${k}</td><td class="${cls || ''}">${v}</td></tr>`).join('')}</table>`;
}

function zoneTip(zoneId) {
  const z = GAME.zones[zoneId];
  const head = `<b>${esc(z.label)}</b>: ${STATUS[z.status]}`;
  const inj = z.injury;
  if (!inj) return head;
  const firstAid = GAME.skills.find((s) => s.label === 'Førstehjelp').value;
  return head + `<div class="tip-type">${esc(inj.type)}</div>` + tipRows([
    ['Gror av seg selv', esc(inj.heal)],
    ['Effekter', inj.effects.map(esc).join('<br>'), 'tip-bad'],
    ['Utvikling', esc(inj.progression), inj.worsening ? 'tip-bad' : ''],
    ['Godt utfall', esc(inj.outcome)],
    ['Behandling', esc(inj.treat)],
  ]) + `<div class="tip-note">Anslag. Førstehjelp ${firstAid} gir usikre tall.</div>`;
}

function treatmentTip(key) {
  const t = GAME.treatments[key];
  return `<b>${esc(t.title)}</b><div class="tip-type">${esc(t.cost)}</div>` +
    `<table class="tip-table"><tr class="tip-head"><td></td><td>Nå</td><td>Etter</td></tr>${t.changes.map(([k, a, b]) =>
      `<tr><td>${esc(k)}</td><td class="tip-bad">${esc(a)}</td><td class="tip-good">${esc(b)}</td></tr>`).join('')}</table>`;
}

// Karakterark: felles innhold, stylet per variant.
function sheetHtml() {
  const c = GAME.character;
  const stats = GAME.stats.map((s) => `<tr><td>${s.id}</td><td>${s.label}</td><td>${s.value}</td></tr>`).join('');
  const skills = GAME.skills.map((s) => `<tr><td colspan="2">${s.label}</td><td>${s.value}</td></tr>`).join('');
  return `<div class="sheet-inner">
    <h2>${esc(c.name)}, ${c.age} år</h2>
    <p>${esc(c.role)}. ${esc(c.hand)}.</p>
    <h3>Stats</h3><table>${stats}</table>
    <h3>Skills</h3><table>${skills}</table>
    <p class="sheet-hint">Lukk med C eller Esc</p>
  </div>`;
}
function toggleSheet(force) {
  const s = document.getElementById('sheet');
  const open = force ?? s.hidden;
  hideTip();
  if (open) s.innerHTML = sheetHtml();
  s.hidden = !open;
}

// Variantbytter (prototypeverktøy, ikke del av designet).
function startPrototype(variants) {
  let cleanup = null;
  const params = new URLSearchParams(location.search);
  let idx = Math.max(0, variants.findIndex((v) => v.key === (params.get('variant') || 'A')));

  function show() {
    const v = variants[idx];
    if (cleanup) cleanup();
    hideTip();
    toggleSheet(false);
    document.getElementById('variant-css').textContent = v.css;
    document.body.className = 'v-' + v.key;
    const app = document.getElementById('app');
    app.innerHTML = '';
    cleanup = v.render(app) || null;
    document.getElementById('sw-label').textContent = `${v.key}: ${v.name}`;
    const p = new URLSearchParams(location.search);
    p.set('variant', v.key);
    history.replaceState(null, '', '?' + p.toString());
  }
  const step = (d) => { idx = (idx + d + variants.length) % variants.length; show(); };

  document.getElementById('sw-prev').onclick = () => step(-1);
  document.getElementById('sw-next').onclick = () => step(1);
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'c' || e.key === 'C') toggleSheet();
    else if (e.key === 'Escape') toggleSheet(false);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-sheet]')) toggleSheet(true);
    else if (e.target.closest('#sheet')) toggleSheet(false);
  });
  show();
}
