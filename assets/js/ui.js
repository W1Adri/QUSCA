/* =========================================================================
 * ui.js — Tiny DOM toolkit, toasts, modals and dependency-free SVG charts.
 * Self-contained so the app works fully offline (no external CDNs).
 * ========================================================================= */

/** Create an element. el('div.card#x', {onclick}, [children|string]) */
export function el(spec, attrs = {}, children = []) {
  const [tagAndId, ...classes] = spec.split('.');
  const [tag, id] = tagAndId.split('#');
  const node = document.createElement(tag || 'div');
  if (id) node.id = id;
  if (classes.length) node.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') node.className += ' ' + v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

/* ----------------------------- toast ----------------------------- */
let toastHost;
export function toast(message, type = 'info', ms = 3200) {
  if (!toastHost) {
    toastHost = el('div.toast-host');
    document.body.append(toastHost);
  }
  const t = el(`div.toast.toast-${type}`, {}, message);
  toastHost.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

/* ----------------------------- modal ----------------------------- */
export function modal({ title, body, actions = [] }) {
  const overlay = el('div.modal-overlay');
  const card = el('div.modal', {}, [
    el('h3.modal-title', {}, title),
    el('div.modal-body', {}, [body]),
  ]);
  const footer = el('div.modal-actions');
  const close = () => { overlay.classList.remove('show'); setTimeout(() => overlay.remove(), 200); };
  for (const a of actions) {
    footer.append(el('button', {
      class: `btn ${a.variant || 'btn-ghost'}`,
      onclick: () => { const r = a.onClick?.(); if (r !== false) close(); },
    }, a.label));
  }
  if (actions.length) card.append(footer);
  overlay.append(card);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.body.append(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  return { close, overlay };
}

export function confirmDialog(message, onYes) {
  modal({
    title: 'Please confirm',
    body: el('p', {}, message),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: 'Confirm', variant: 'btn-danger', onClick: onYes },
    ],
  });
}

/* --------------------------- SVG charts -------------------------- */
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

/**
 * Line chart. data: [{label, value}]. Returns an <svg>.
 */
export function lineChart(data, { width = 600, height = 220, color = '#5b8cff', goal = null } = {}) {
  const pad = { l: 38, r: 12, t: 14, b: 24 };
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, class: 'chart', preserveAspectRatio: 'none' });
  if (!data.length) {
    svg.append(svgEl('text', { x: width / 2, y: height / 2, 'text-anchor': 'middle', fill: '#8a90a6', 'font-size': 13 }));
    svg.lastChild.textContent = 'No data yet';
    return svg;
  }
  const values = data.map((d) => d.value);
  let min = Math.min(...values, goal ?? Infinity);
  let max = Math.max(...values, goal ?? -Infinity);
  if (min === max) { min -= 1; max += 1; }
  const pad2 = (max - min) * 0.1;
  min -= pad2; max += pad2;
  const x = (i) => pad.l + (i / Math.max(1, data.length - 1)) * (width - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (height - pad.t - pad.b);

  // gridlines + y labels
  for (let g = 0; g <= 3; g++) {
    const v = min + (g / 3) * (max - min);
    const yy = y(v);
    svg.append(svgEl('line', { x1: pad.l, y1: yy, x2: width - pad.r, y2: yy, stroke: 'rgba(255,255,255,.06)' }));
    const lbl = svgEl('text', { x: 4, y: yy + 4, fill: '#8a90a6', 'font-size': 10 });
    lbl.textContent = Math.round(v);
    svg.append(lbl);
  }
  if (goal != null) {
    const gy = y(goal);
    svg.append(svgEl('line', { x1: pad.l, y1: gy, x2: width - pad.r, y2: gy, stroke: '#37d39b', 'stroke-dasharray': '4 4', 'stroke-width': 1.5 }));
  }
  // area + line
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  const area = `${pad.l},${height - pad.b} ${pts} ${x(data.length - 1)},${height - pad.b}`;
  svg.append(svgEl('polygon', { points: area, fill: color, opacity: 0.12 }));
  svg.append(svgEl('polyline', { points: pts, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  data.forEach((d, i) => {
    const dot = svgEl('circle', { cx: x(i), cy: y(d.value), r: 3, fill: color });
    dot.append(svgEl('title', {}));
    dot.lastChild.textContent = `${d.label}: ${d.value}`;
    svg.append(dot);
  });
  return svg;
}

/** Progress ring. 0..1 ratio. */
export function ring(ratio, { size = 120, stroke = 12, color = '#5b8cff', label = '', sub = '' } = {}) {
  ratio = Math.max(0, Math.min(1, ratio || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'ring', width: size, height: size });
  svg.append(svgEl('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: 'rgba(255,255,255,.08)', 'stroke-width': stroke }));
  svg.append(svgEl('circle', {
    cx: size / 2, cy: size / 2, r, fill: 'none', stroke: color, 'stroke-width': stroke,
    'stroke-linecap': 'round', 'stroke-dasharray': c, 'stroke-dashoffset': c * (1 - ratio),
    transform: `rotate(-90 ${size / 2} ${size / 2})`,
  }));
  const t1 = svgEl('text', { x: size / 2, y: size / 2 - 2, 'text-anchor': 'middle', fill: 'var(--text)', 'font-size': size * 0.2, 'font-weight': 700 });
  t1.textContent = label;
  svg.append(t1);
  if (sub) {
    const t2 = svgEl('text', { x: size / 2, y: size / 2 + size * 0.16, 'text-anchor': 'middle', fill: '#8a90a6', 'font-size': size * 0.1 });
    t2.textContent = sub;
    svg.append(t2);
  }
  return svg;
}

export function fmtDate(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
