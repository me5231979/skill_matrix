/* =====================================================================
   FLH PORTFOLIO DASHBOARD
   Renders the constellation (SVG), through-line and impact sections
   from window.FLH (data.js). No build step, no dependencies.
   ===================================================================== */
(function () {
'use strict';

const D = window.FLH;
const byId = Object.fromEntries(D.programs.map(p => [p.id, p]));
const stageName = id => D.stages.find(s => s.id === id).name;
const audName = id => D.audiences.find(a => a.id === id).name;
const partnerName = id => D.partners.find(p => p.id === id).name;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- layout ---------- */
const HUB = { x: 600, y: 430 };
const POS = {
  anchors:     { x: 215, y: 300, r: 40 },
  speak:       { x: 130, y: 480, r: 18 },
  compliance:  { x: 235, y: 640, r: 18 },
  navigators:  { x: 350, y: 165, r: 18 },
  chart:       { x: 575, y: 120, r: 22 },
  cohort:      { x: 800, y: 155, r: 18 },
  coaching:    { x: 985, y: 245, r: 18 },
  marketplace: { x: 1065, y: 430, r: 22 },
  summit:      { x: 985, y: 615, r: 22 },
  voyage:      { x: 800, y: 730, r: 20 },
  lr:          { x: 575, y: 765, r: 30 },
  alumni:      { x: 350, y: 715, r: 18 },
  vault:       { x: 462, y: 555, r: 16 },
  products:    { x: 762, y: 330, r: 16 }
};

const LENS_COLORS = {
  stage:    { foundations:'#E0D5C0', capability:'#CFAE70', mobility:'#ECB748', leadership:'#FEEEB6', governance:'#946E24' },
  audience: { all:'#CFAE70', leaders:'#FEEEB6', targeted:'#ECB748', exec:'#946E24' },
  partner:  { inhouse:'#CFAE70', oracle:'#ECB748', edassist:'#FEEEB6', vuit:'#E0D5C0', abroad:'#946E24' }
};
const LENS_GROUPS = {
  stage:    D.stages.map(s => [s.id, s.name]),
  audience: D.audiences.map(a => [a.id, a.name]),
  partner:  D.partners.map(p => [p.id, p.name])
};

const svg = document.getElementById('const-svg');
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

/* curved edge path: bow away from the hub so lines never cross the mark */
function edgePath(a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  let ox = mx - HUB.x, oy = my - HUB.y;
  const len = Math.hypot(ox, oy) || 1;
  const bow = 34 + Math.hypot(b.x - a.x, b.y - a.y) * 0.06;
  ox = ox / len * bow; oy = oy / len * bow;
  return `M ${a.x} ${a.y} Q ${mx + ox} ${my + oy} ${b.x} ${b.y}`;
}

/* ---------- render constellation ---------- */
const gSpokes = el('g', {}); svg.appendChild(gSpokes);
const gEdges  = el('g', {}); svg.appendChild(gEdges);
const gHub    = el('g', { class: 'chub' }); svg.appendChild(gHub);
const gNodes  = el('g', {}); svg.appendChild(gNodes);

D.programs.forEach(p => {
  const pos = POS[p.id];
  gSpokes.appendChild(el('path', { class: 'cspoke', d: `M ${pos.x} ${pos.y} L ${HUB.x} ${HUB.y}` }));
});

const edgeEls = D.edges.map((e, i) => {
  const d = edgePath(POS[e.a], POS[e.b]);
  const vis = el('path', { class: 'cedge', d, 'data-i': i });
  const hit = el('path', { class: 'cedge cedge--hit', d, 'data-i': i, tabindex: -1 });
  gEdges.appendChild(vis); gEdges.appendChild(hit);
  return vis;
});

const hubImg = el('image', { x: HUB.x - 34, y: HUB.y - 42, width: 68, height: 62 });
hubImg.setAttribute('href', '../assets/img/vu-v-icon.png');
gHub.appendChild(hubImg);
const hubTxt = el('text', { x: HUB.x, y: HUB.y + 44, 'text-anchor': 'middle' });
hubTxt.textContent = 'Futures Learning Hub';
gHub.appendChild(hubTxt);

const nodeEls = {};
D.programs.forEach(p => {
  const pos = POS[p.id];
  const g = el('g', { class: 'cnode' + (p.status === 'in-development' ? ' indev' : ''),
    'data-id': p.id, tabindex: 0, role: 'button',
    'aria-label': `${p.name} — ${stageName(p.stage)}. Select to see connections.` });
  g.appendChild(el('circle', { class: 'halo', cx: pos.x, cy: pos.y, r: pos.r + 7 }));
  g.appendChild(el('circle', { class: 'dot', cx: pos.x, cy: pos.y, r: pos.r }));
  const t = el('text', { x: pos.x, y: pos.y + pos.r + 24, 'text-anchor': 'middle' });
  t.textContent = p.name;
  g.appendChild(t);
  const s = el('text', { class: 'sub', x: pos.x, y: pos.y + pos.r + 42, 'text-anchor': 'middle' });
  s.textContent = stageName(p.stage);
  g.appendChild(s);
  gNodes.appendChild(g);
  nodeEls[p.id] = g;
});

/* ---------- panel ---------- */
const panel = document.getElementById('const-panel');
let selected = null;

function metricsHTML(p) {
  const bits = [];
  if (p.volume) bits.push(`<div><b>${p.volume.n.toLocaleString()}</b><span>${esc(p.volume.label)}</span></div>`);
  if (p.nps) bits.push(`<div><b>${p.nps.score.toFixed(2)}</b><span>NPS of 5 &middot; ${p.nps.responses} responses</span></div>`);
  return bits.length
    ? `<p class="plabel">Measured so far</p><div class="pmetrics">${bits.join('')}</div>`
    : `<p class="plabel">Measured so far</p><p style="margin-top:.4rem">Metrics for this program are being stood up &mdash; reach and NPS will populate here.</p>`;
}

function tiesOf(id) {
  return D.edges.filter(e => e.a === id || e.b === id)
    .map(e => ({ other: e.a === id ? e.b : e.a, why: e.why }));
}

function renderPanelHome() {
  panel.innerHTML = `
    <p class="eyebrow">How to read the map</p>
    <h3>One hub. Fourteen orbits.</h3>
    <p>Every gold line is a real hand-off between two programs &mdash; a graduate who flows onward, a platform they share, a barrier one removes so another can work. Faint spokes mark FLH stewardship. A dashed ring means the program is still in development.</p>
    <p class="plabel">Try it</p>
    <p style="margin-top:.4rem">Select any program to trace what it feeds and what feeds it &mdash; or hover a line to see why it exists.</p>`;
}

function renderPanel(p) {
  const ties = tiesOf(p.id);
  panel.innerHTML = `
    <p class="eyebrow">${esc(stageName(p.stage))} &middot; ${esc(partnerName(p.partner))}</p>
    <h3>${esc(p.name)}</h3>
    <span class="pstatus pstatus--${p.status}">${p.status.replace('-', ' ')}</span>
    <p>${esc(p.what)}</p>
    <p class="plabel">Who it serves</p><p style="margin-top:.4rem">${esc(p.who)}</p>
    <p class="plabel">Value to Vanderbilt</p><p style="margin-top:.4rem">${esc(p.value)}</p>
    ${metricsHTML(p)}
    <p class="plabel">Connective tissue &middot; ${ties.length}</p>
    <ul class="pties">${ties.map(t =>
      `<li><button data-go="${t.other}">${esc(byId[t.other].name)}</button> &mdash; ${esc(t.why)}</li>`).join('')}
    </ul>
    <button class="pclear" type="button">Clear selection</button>`;
  panel.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => select(b.dataset.go)));
  panel.querySelector('.pclear').addEventListener('click', () => select(null));
}

function select(id) {
  selected = id;
  svg.classList.toggle('has-sel', !!id);
  D.programs.forEach(p => {
    const g = nodeEls[p.id];
    g.classList.toggle('sel', p.id === id);
    g.classList.toggle('lit', !!id && (p.id === id || tiesOf(id).some(t => t.other === p.id)));
  });
  edgeEls.forEach((elm, i) => {
    const e = D.edges[i];
    elm.classList.toggle('lit', !!id && (e.a === id || e.b === id));
  });
  if (id) { renderPanel(byId[id]); history.replaceState(null, '', '#p=' + id); }
  else { renderPanelHome(); history.replaceState(null, '', '#map'); }
}

gNodes.addEventListener('click', ev => {
  const g = ev.target.closest('.cnode');
  if (g) select(g.dataset.id === selected ? null : g.dataset.id);
});
gNodes.addEventListener('keydown', ev => {
  const g = ev.target.closest('.cnode');
  if (g && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); select(g.dataset.id); }
});

/* ---------- edge tooltip ---------- */
const tip = document.getElementById('const-tip');
const stageBox = document.querySelector('.const__stage');
gEdges.addEventListener('mousemove', ev => {
  const hit = ev.target.closest('.cedge--hit');
  if (!hit) { tip.hidden = true; return; }
  const e = D.edges[+hit.dataset.i];
  tip.innerHTML = `<b>${esc(byId[e.a].name)} &harr; ${esc(byId[e.b].name)}</b><br>${esc(e.why)}`;
  tip.hidden = false;
  const box = stageBox.getBoundingClientRect();
  let x = ev.clientX - box.left + 16, y = ev.clientY - box.top + 14;
  if (x + 330 > box.width) x = box.width - 330;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
});
gEdges.addEventListener('mouseleave', () => { tip.hidden = true; });

/* ---------- lenses ---------- */
const legend = document.getElementById('const-legend');
const TISSUE_LEGEND = `
  <span><i style="background:var(--vu-gold-flat)"></i> Line = a real hand-off between programs</span>
  <span><i style="background:rgba(207,174,112,.25)"></i> Spoke = FLH stewardship</span>
  <span><i style="background:transparent;border:1.5px dashed rgba(255,255,255,.6)"></i> Dashed ring = in development</span>`;

function applyLens(lens) {
  document.querySelectorAll('.lens__chip').forEach(c => {
    const on = c.dataset.lens === lens;
    c.classList.toggle('on', on);
    c.setAttribute('aria-selected', on);
  });
  if (lens === 'tissue') {
    legend.innerHTML = TISSUE_LEGEND;
    D.programs.forEach(p => { nodeEls[p.id].querySelector('.dot').style.cssText = ''; });
    gEdges.style.opacity = '';
  } else {
    const colors = LENS_COLORS[lens];
    legend.innerHTML = LENS_GROUPS[lens].map(([id, name]) =>
      `<span><i style="background:${colors[id]}"></i> ${esc(name)}</span>`).join('');
    D.programs.forEach(p => {
      const c = colors[p[lens === 'stage' ? 'stage' : lens]];
      nodeEls[p.id].querySelector('.dot').style.cssText = `fill:${c};stroke:${c}`;
    });
    gEdges.style.opacity = .25;
  }
}
document.querySelector('.lens').addEventListener('click', ev => {
  const chip = ev.target.closest('.lens__chip');
  if (chip) applyLens(chip.dataset.lens);
});
applyLens('tissue');
renderPanelHome();

/* ---------- through-line ---------- */
const flow = document.getElementById('journey-flow');
flow.innerHTML = D.stages.map((s, i) => `
  <div class="journey__stage" data-reveal>
    <p class="journey__num">0${i + 1}</p>
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.blurb)}</p>
    <div class="journey__pills">${D.programs.filter(p => p.stage === s.id).map(p =>
      `<a href="#map" data-sel="${p.id}"${p.status === 'in-development' ? ' class="indev"' : ''}>${esc(p.name)}</a>`).join('')}
    </div>
  </div>`).join('');
flow.addEventListener('click', ev => {
  const a = ev.target.closest('[data-sel]');
  if (a) select(a.dataset.sel);
});

/* ---------- impact ---------- */
const cards = document.getElementById('impact-cards');
const featured = [
  { id: 'anchors', stat: '1,000', cap: 'employees registered for at least one session' },
  { id: 'lr',      stat: '113',   cap: 'M1&ndash;E1 leaders through the full program' },
  { id: 'alumni',  stat: '4.75',  cap: 'NPS from the graduate community', isNps: true },
  { id: 'voyage',  stat: '15',    cap: 'managers in the founding pilot cohort' }
];
cards.innerHTML = featured.map(f => {
  const p = byId[f.id];
  const nps = p.nps ? `<div class="npsbar"><i style="width:${(p.nps.score / 5) * 100}%"></i></div>
    <p class="npscap">NPS ${p.nps.score.toFixed(2)} of 5 &middot; ${p.nps.responses} responses</p>` : '';
  return `<div class="icard" data-reveal>
    <p class="eyebrow">${esc(stageName(p.stage))}</p>
    <h3>${esc(p.name)}</h3>
    <p class="big">${f.stat}${f.isNps ? '<small> / 5</small>' : ''}</p>
    <p class="cap">${f.cap}</p>${f.isNps ? '' : nps}</div>`;
}).join('');

const tbody = document.querySelector('#impact-table tbody');
tbody.innerHTML = D.programs.map(p => {
  const reach = p.volume ? `<b>${p.volume.n.toLocaleString()}</b> ${esc(p.volume.label)}` : '<span class="muted">Data coming</span>';
  const impact = p.nps ? `<b>NPS ${p.nps.score.toFixed(2)}</b> of 5 &middot; ${p.nps.responses} responses` : '<span class="muted">Data coming</span>';
  return `<tr>
    <td><b>${esc(p.name)}</b><br><span class="muted">${esc(stageName(p.stage))} &middot; ${esc(partnerName(p.partner))}</span></td>
    <td>${esc(p.who)}</td><td>${reach}</td><td>${impact}</td>
    <td><span class="tstatus tstatus--${p.status}">${p.status.replace('-', ' ')}</span></td></tr>`;
}).join('');

/* ---------- hero weave ---------- */
const weave = document.getElementById('hero-weave');
const pts = [[80,520],[220,180],[420,420],[600,120],[790,380],[980,170],[1120,480],[300,600],[900,590],[600,320]];
const links = [[0,2],[1,2],[2,3],[3,4],[4,5],[5,6],[2,7],[4,8],[2,9],[4,9],[9,3],[6,8]];
weave.innerHTML =
  links.map(([a, b]) => {
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const mx = (ax + bx) / 2 + (ay - by) * 0.18, my = (ay + by) / 2 + (bx - ax) * 0.18;
    return `<path d="M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}"/>`;
  }).join('') +
  pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3.5 : 2.2}"/>`).join('');

/* ---------- reveal + nav ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(n => io.observe(n));

const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* deep link: #p=<id> */
const m = location.hash.match(/p=([a-z]+)/);
if (m && byId[m[1]]) { select(m[1]); document.getElementById('map').scrollIntoView(); }

})();
