/* Fit mommy — app de rutinas. Todo se guarda en el celular (localStorage). */
'use strict';

const CLAVE = 'fitMommy.v1';
const $app = document.getElementById('app');
const DIAS_SEM = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/* ================= ESTADO ================= */
let S = cargar();
function nuevoEstado() {
  return { v: 1, nombre: '', semanas: {}, historial: [], actual: null,
    medidas: MEDIDAS_INICIALES.slice(), ultimaN: 4, creada: hoy(), descansoAuto: true };
}
function cargar() {
  try {
    const t = localStorage.getItem(CLAVE);
    if (t) return Object.assign(nuevoEstado(), JSON.parse(t));
  } catch (e) { /* sin almacenamiento */ }
  return nuevoEstado();
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { toast('No se pudo guardar '); }
}

/* ================= FECHAS ================= */
function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function hoy() { return iso(new Date()); }
function aFecha(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function lunes(s) { const d = aFecha(s); const k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return iso(d); }
function difDias(a, b) { return Math.round((aFecha(b) - aFecha(a)) / 864e5); }
function fCorta(s) { const d = aFecha(s); return d.getDate() + ' ' + MESES[d.getMonth()]; }
function fLarga(s) { const d = aFecha(s); return DIAS_SEM[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; }
function diasRestantes() { const d = new Date(); return 7 - ((d.getDay() + 6) % 7); } // hoy incluido

/* ================= UTIL ================= */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = n => (Math.round(n * 100) / 100).toString().replace('.', ',');
const foto = (ex, i = 0) => 'img/' + EJ[ex].img + '_' + i + '.jpg';
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2400);
}
function vibrar(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
function saludo() { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; }
function unidad(ex) { const e = EJ[ex]; return e.tipo === 'k' ? 'min' : e.seg ? 'seg' : 'reps'; }
function usaPeso(ex) { const e = EJ[ex]; return e.tipo !== 'k' && !e.seg; }

/* ================= SEMANA ================= */
function semana() {
  const wk = lunes(hoy());
  const n = S.semanas[wk] || 0;
  const hechas = S.historial.filter(h => lunes(h.fecha) === wk);
  const plan = n ? PLANES[n].slice() : [];
  const pendientes = plan.slice();
  const extras = [];
  hechas.forEach(h => { const i = pendientes.indexOf(h.rutina); if (i >= 0) pendientes.splice(i, 1); else extras.push(h); });
  const hoyHecho = hechas.some(h => h.fecha === hoy());
  return { wk, n, hechas, plan, pendientes, extras, hoyHecho };
}
function sugerencia(sm) {
  if (!sm.pendientes.length) return null;
  const ult = S.historial[S.historial.length - 1];
  const ayerPierna = ult && difDias(ult.fecha, hoy()) <= 1 && RUTINAS[ult.rutina].pierna;
  const quedan = diasRestantes() - (sm.hoyHecho ? 1 : 0);
  const apretado = sm.pendientes.length > quedan;
  let r = sm.pendientes[0];
  if (apretado) {
    const p = sm.pendientes.find(x => RUTINAS[x].pierna);
    if (p) r = p;
  }
  if (ayerPierna && RUTINAS[r].pierna) {
    const s = sm.pendientes.find(x => !RUTINAS[x].pierna);
    if (s && !apretado) r = s;
  }
  return { rutina: r, apretado, ayerPierna, quedan };
}

/* ================= PROGRESIÓN ================= */
function ultimo(ex) {
  for (let i = S.historial.length - 1; i >= 0; i--) {
    const it = S.historial[i].items.find(x => x.ex === ex && x.sets.length);
    if (it) return { fecha: S.historial[i].fecha, sets: it.sets };
  }
  return null;
}
function mejor(ex, antesDe) {
  let m = 0;
  S.historial.forEach(h => { if (antesDe && h.id === antesDe) return; h.items.forEach(it => { if (it.ex === ex) it.sets.forEach(s => { if (s.w > m) m = s.w; }); }); });
  return m;
}
function sugerir(ex, energia) {
  const e = EJ[ex], [lo, hi] = e.reps, u = ultimo(ex);
  if (!u) return { w: 0, r: e.tipo === 'k' ? ENERGIA[energia].cardio : lo, msg: usaPeso(ex) ? 'Primera vez: empieza liviano. Elige un peso con el que puedas hacer ' + hi + ' repeticiones con calma, y anótalo.' : '', sube: false, nuevo: true };
  const w = Math.max(...u.sets.map(s => s.w || 0));
  const conW = u.sets.filter(s => (s.w || 0) === w);
  const minR = Math.min(...conW.map(s => s.r));
  if (!usaPeso(ex)) {
    const r = e.tipo === 'k' ? Math.max(ENERGIA[energia].cardio, 0) : Math.min(hi, minR + (energia === 'tranquila' ? 0 : 2));
    return { w: 0, r, msg: e.seg ? 'La última vez: ' + minR + ' segundos.' : '', sube: false };
  }
  if (energia === 'tranquila') return { w, r: Math.min(minR, hi), msg: 'Día tranquilo: mismo peso que la vez pasada (' + num(w) + ' kg).', sube: false };
  if (minR >= hi && conW.length >= 2 && e.inc > 0) {
    return { w: w + e.inc, r: lo, msg: '¡La vez pasada hiciste ' + minR + ' repeticiones con ' + num(w) + ' kg! Hoy subimos a ' + num(w + e.inc) + ' kg ', sube: true };
  }
  const r = Math.min(hi, minR + 1);
  return { w, r, msg: 'La vez pasada: ' + num(w) + ' kg × ' + minR + '. Hoy intenta ' + r + ' repeticiones.', sube: false };
}

/* ================= SESIÓN ================= */
function crearSesion(rutina, energia) {
  const E = ENERGIA[energia];
  const ids = RUTINAS[rutina].ejercicios.slice(0, E.n);
  const items = ids.map((ex, i) => itemNuevo(ex, energia, energia === 'fuerte' && i === 0 ? 4 : E.series));
  items.push(itemNuevo('bici', energia, 1));
  S.actual = { id: Date.now().toString(36), rutina, energia, fecha: hoy(), items, idx: -1, inicio: Date.now() };
  S.ultimaEnergia = energia;
  guardar();
}
function itemNuevo(ex, energia, nSeries) {
  const s = sugerir(ex, energia);
  return { ex, sets: Array.from({ length: nSeries }, () => ({ w: s.w, r: s.r, ok: false })) };
}
function itemHecho(it) { return it.sets.some(s => s.ok); }
function itemCompleto(it) { return it.sets.every(s => s.ok); }

function guardarSesion() {
  const a = S.actual; if (!a) return null;
  const items = a.items.map(it => ({ ex: it.ex, sets: it.sets.filter(s => s.ok || s.ed).map(s => ({ w: s.w, r: s.r })) })).filter(it => it.sets.length);
  S.actual = null;
  if (!items.length) { guardar(); return null; }
  const prs = [];
  items.forEach(it => { if (!usaPeso(it.ex)) return; const m = Math.max(...it.sets.map(s => s.w)); const ant = mejor(it.ex); if (m > 0 && ant > 0 && m > ant) prs.push({ ex: it.ex, w: m, ant }); });
  const h = { id: a.id, fecha: a.fecha, rutina: a.rutina, energia: a.energia, items, min: Math.min(240, Math.round((Date.now() - a.inicio) / 60000)) };
  S.historial.push(h);
  S.historial.sort((x, y) => x.fecha < y.fecha ? -1 : x.fecha > y.fecha ? 1 : 0);
  S.ultimoFin = { id: h.id, prs };
  guardar();
  return h;
}
function terminarSesion() {
  const h = guardarSesion();
  soltarPantalla();
  go(h ? '#/fin' : '#/');
}
// Si quedó un entrenamiento abierto de otro día, se guarda solo para no perder nada
if (S.actual && S.actual.fecha !== hoy()) guardarSesion();

/* ================= NAVEGACIÓN ================= */
function go(h) { if (location.hash === h) render(); else location.hash = h; }
window.addEventListener('hashchange', () => { cerrarHoja(); pararDescanso(); document.querySelectorAll('.confeti').forEach(c => c.remove()); render(); window.scrollTo(0, 0); });

function render() {
  const h = location.hash.replace(/^#\/?/, '');
  const [ruta, arg] = h.split('/');
  let html = '', nav = true, tab = 'inicio';
  switch (ruta) {
    case 'entreno': html = vEntreno(); nav = false; break;
    case 'ej': html = vEjercicio(Number(arg)); nav = false; break;
    case 'fin': html = vFin(); nav = false; break;
    case 'progreso': html = vProgreso(); tab = 'progreso'; break;
    case 'prog-ej': html = vProgEj(arg); tab = 'progreso'; break;
    case 'guia': html = vGuia(arg); tab = 'guia'; break;
    case 'ficha': html = vFicha(arg); tab = 'guia'; break;
    case 'mas': html = vMas(); tab = 'mas'; break;
    case 'porque': html = vPorque(); tab = 'mas'; break;
    case 'instalar': html = vInstalar(); tab = 'mas'; break;
    default: html = vInicio();
  }
  $app.className = nav ? '' : 'sinnav';
  $app.innerHTML = html + (nav ? navHtml(tab) : '');
  if (ruta === 'fin') confeti();
}
const ICON = {
  inicio: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  progreso: '<path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7"/>',
  guia: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  mas: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
};
function navHtml(tab) {
  const t = (id, txt, href) => `<a href="${href}" class="${tab === id ? 'on' : ''}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[id]}</svg>${txt}</a>`;
  return `<nav class="tabs"><div class="in">${t('inicio', 'Inicio', '#/')}${t('progreso', 'Progreso', '#/progreso')}${t('guia', 'Ejercicios', '#/guia')}${t('mas', 'Más', '#/mas')}</div></nav>`;
}

/* ================= VISTA: INICIO ================= */
function vInicio() {
  const sm = semana();
  const nombre = S.nombre ? ', ' + esc(S.nombre) : '';
  let h = `<div class="sub">${fLarga(hoy())}</div>`;

  if (S.actual) {
    const a = S.actual, R = RUTINAS[a.rutina];
    const hechos = a.items.filter(itemHecho).length;
    h += `<div class="hero"><div class="tag">Entrenamiento en curso</div>
      <h1>${R.nombre}</h1><p>Llevas ${hechos} de ${a.items.length} ejercicios</p>
      <button class="btn dark" data-a="continuar">Continuar ▶</button></div>`;
    return h + bloqueSemana(sm);
  }

  if (!sm.n) {
    const pre = S.ultimaN || 4;
    h += `<div class="card"><h2 style="margin-top:0">¿Cuántos días vas a ir al gym esta semana?</h2>
      <div class="sub">No te preocupes si después cambia: la app se acomoda día a día.</div>
      <div class="dias">${[3, 4, 5].map(n => `<button class="dia-btn ${n === pre ? 'sel' : ''}" data-a="dias" data-n="${n}"><b>${n}</b><span>días</span></button>`).join('')}</div>
      <div class="dias">${[2, 6].map(n => `<button class="dia-btn chico" data-a="dias" data-n="${n}"><b>${n}</b><span>${n === 2 ? 'semana difícil' : 'días'}</span></button>`).join('')}</div>
      </div>`;
    if (sm.hechas.length) h += bloqueSemana(sm);
    return h;
  }

  const sg = sugerencia(sm);
  if (sg) {
    const R = RUTINAS[sg.rutina];
    let nota = '';
    if (sm.hoyHecho) nota = '¡Ya entrenaste hoy! Descansa. Esto es para la próxima vez.';
    else if (sg.apretado) nota = `Quedan ${sg.quedan} día${sg.quedan === 1 ? '' : 's'} en la semana: priorizamos pierna y cola `;
    else if (sg.ayerPierna) nota = 'Ayer hiciste pierna, así que hoy descansa la pierna.';
    h += `<div class="hero"><div class="tag">${sm.hoyHecho ? 'Próximo entrenamiento' : 'Hoy te toca'}</div>
      <h1>${R.nombre}</h1><p>${R.desc}</p>
      <button class="btn dark" data-a="empezar" data-r="${sg.rutina}">Empezar ▶</button></div>`;
    if (nota) h += `<div class="consejo">${nota}</div>`;
    const otras = [...new Set(sm.pendientes.filter(x => x !== sg.rutina))];
    if (otras.length) h += `<button class="link" data-a="otras">Prefiero hacer otro entrenamiento hoy →</button>`;
  } else {
    h += `<div class="hero"><div class="tag">Semana completa</div>
      <h1>¡Lo lograste! </h1><p>Hiciste los ${sm.n} días de esta semana. Descansa y disfruta.</p>
      <button class="btn dark" data-a="extra">Quiero ir un día extra</button></div>`;
  }
  h += bloqueSemana(sm);
  return h;
}
function bloqueSemana(sm) {
  if (!sm.n && !sm.hechas.length) return '';
  const celdas = [];
  sm.hechas.forEach(x => celdas.push({ ok: true, r: x.rutina, f: x.fecha }));
  const sg = sugerencia(sm);
  const pend = sm.pendientes.slice();
  if (sg) { const i = pend.indexOf(sg.rutina); pend.splice(i, 1); pend.unshift(sg.rutina); }
  pend.forEach((r, i) => celdas.push({ ok: false, r, next: i === 0 && !S.actual }));
  let h = `<h2>Tu semana</h2><div class="card flat" style="padding:14px">
    <div class="row" style="align-items:center"><div><b>${sm.hechas.length} de ${sm.n || sm.hechas.length}</b> <span class="sub">entrenamientos</span></div>
    ${sm.n ? `<button class="link" style="flex:0" data-a="cambiarDias">Cambiar</button>` : ''}</div>
    <div class="semana">${celdas.map(c => `<div class="d"><div class="bola ${c.ok ? 'ok' : ''} ${c.next ? 'next' : ''}"><span>${RUTINAS[c.r].corto}</span>${c.ok ? '<i>✓</i>' : ''}</div><small>${c.ok ? fCorta(c.f) : ''}</small></div>`).join('')}</div></div>`;
  return h;
}

/* ================= VISTA: ENTRENAMIENTO (resumen) ================= */
function vEntreno() {
  const a = S.actual; if (!a) { setTimeout(() => go('#/'), 0); return ''; }
  const R = RUTINAS[a.rutina], E = ENERGIA[a.energia];
  const hechos = a.items.filter(itemHecho).length;
  let h = topbar(hechos, a.items.length, 'salir');
  h += `<h1>${R.nombre}</h1><div class="sub">${E.nombre} · ${E.frase}</div>
    <div class="consejo">${E.guia}</div>
    <button class="item" data-a="calentar"><div class="t"><b>Calentamiento · 5 min</b><span>Bici suave + mover cadera, rodillas y hombros</span></div><div class="check ${a.calentado ? 'on' : ''}">${a.calentado ? '✓' : ''}</div></button>`;
  a.items.forEach((it, i) => {
    const e = EJ[it.ex], ok = it.sets.filter(s => s.ok).length;
    const desc = e.tipo === 'k' ? 'Al final · ' + it.sets[0].r + ' min (opcional)' : it.sets.length + ' series × ' + e.reps[0] + '–' + e.reps[1] + ' ' + unidad(it.ex) + (e.lado ? ' c/lado' : '') + resumenPasado(it.ex);
    h += `<button class="item" data-a="abrir" data-i="${i}"><img class="thumb" src="${foto(it.ex, 1)}" alt="" loading="lazy">
      <div class="t"><b>${i + 1}. ${esc(e.nombre)}</b><span>${desc}</span></div>
      <div class="check ${itemCompleto(it) ? 'on' : ''}">${itemCompleto(it) ? '✓' : ok ? ok + '/' + it.sets.length : ''}</div></button>`;
  });
  const sig = a.items.findIndex(it => !itemCompleto(it));
  h += `<div class="abajo"><div class="in">${sig >= 0
    ? `<button class="btn" data-a="abrir" data-i="${sig}">${hechos ? 'Seguir con el ' + (sig + 1) : 'Empezar con el 1'} ▶</button>`
    : `<button class="btn" data-a="terminar">Terminar entrenamiento </button>`}</div></div>`;
  return h;
}
function topbar(hechos, total, accion) {
  return `<div class="topbar"><button class="x" data-a="${accion}" aria-label="Volver">${accion === 'salir' ? '✕' : '‹ Lista'}</button>
    <div class="progreso"><small>${hechos} de ${total} ejercicios</small><div class="barra"><i style="width:${Math.round(hechos / total * 100)}%"></i></div></div></div>`;
}

/* ================= VISTA: UN EJERCICIO ================= */
function vEjercicio(i) {
  const a = S.actual; if (!a || !a.items[i]) { setTimeout(() => go('#/entreno'), 0); return ''; }
  a.idx = i; guardar();
  const it = a.items[i], e = EJ[it.ex], cardio = e.tipo === 'k';
  const sg = sugerir(it.ex, a.energia);
  const hechos = a.items.filter(itemHecho).length;
  let h = topbar(hechos, a.items.length, 'lista');
  h += fotoHtml(it.ex, (i + 1) + ' de ' + a.items.length);
  h += `<div class="ej-nombre">${esc(e.nombre)}</div><div class="maq">${esc(e.maquina)}</div><br>
    <span class="meta">${cardio ? it.sets[0].r + ' minutos' : it.sets.length + ' series × ' + e.reps[0] + '–' + e.reps[1] + ' ' + unidad(it.ex) + (e.lado ? ' (cada lado)' : '')}</span>${cardio ? '' : ` <span class="meta suave"> Descanso ${mmss(segDescanso(it.ex, a.energia))} min</span>`}`;
  if (!cardio) h += vezPasadaHtml(it.ex, sg, a.energia);

  h += `<div id="series">${seriesHtml(i)}</div>`;

  h += `<h2>¿Cómo se hace?</h2><ol class="pasos">${e.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`;
  if (e.rodilla && e.rodilla !== '—') h += `<div class="consejo knee"> <b>Rodilla:</b> ${esc(e.rodilla)}</div>`;
  h += `<h2>¿Máquina ocupada? Cámbialo por:</h2><div class="variantes">${e.variantes.map(v => `
    <button class="variante" data-a="cambiar" data-i="${i}" data-ex="${v}"><img src="${foto(v, 1)}" alt="" loading="lazy"><div><b>${esc(EJ[v].nombre)}</b><span>${esc(EJ[v].maquina)}</span></div></button>`).join('')}</div>`;

  const ult = i === a.items.length - 1;
  h += `<div class="abajo"><div class="in">${i > 0 ? `<button class="btn ghost" data-a="abrir" data-i="${i - 1}" aria-label="Anterior">‹</button>` : ''}
    ${ult ? `<button class="btn" data-a="terminar">Terminar </button>` : `<button class="btn" data-a="abrir" data-i="${i + 1}">Siguiente ejercicio ›</button>`}</div></div>`;
  return h;
}
function seriesHtml(i) {
  const it = S.actual.items[i], cardio = EJ[it.ex].tipo === 'k';
  let h = '';
  it.sets.forEach((s, k) => {
    h += `<div class="serie ${s.ok ? 'ok' : ''}"><div class="n">${cardio ? '1' : k + 1}</div>`;
    if (usaPeso(it.ex)) h += paso('w', i, k, num(s.w), 'kg');
    else h += `<div class="small center">${cardio ? 'Ritmo suave' : 'Sin peso'}</div>`;
    h += paso('r', i, k, s.r, unidad(it.ex)) + `<button class="hecho" data-a="ok" data-i="${i}" data-k="${k}" aria-label="Serie hecha">✓</button></div>`;
  });
  if (!cardio) h += `<div class="series-acc"><button data-a="masSerie" data-i="${i}">+ Agregar serie</button>${it.sets.length > 1 ? `<button data-a="menosSerie" data-i="${i}">− Quitar serie</button>` : ''}</div>`;
  return h;
}
function paso(campo, i, k, v, u) {
  return `<div class="paso"><button data-a="menos" data-c="${campo}" data-i="${i}" data-k="${k}" aria-label="menos">−</button>
    <div class="v" data-a="escribir" data-c="${campo}" data-i="${i}" data-k="${k}"><b>${v}</b><small>${u}</small></div>
    <button data-a="mas" data-c="${campo}" data-i="${i}" data-k="${k}" aria-label="más">+</button></div>`;
}
function fotoHtml(ex, badge) {
  return `<div class="foto"><img src="${foto(ex, 0)}" alt=""><img class="b" src="${foto(ex, 1)}" alt="${esc(EJ[ex].nombre)}">${badge ? `<div class="badge">${badge}</div>` : ''}</div>`;
}

/* ================= HISTORIAL POR EJERCICIO ================= */
function vecesHecho(ex) { let n = 0; S.historial.forEach(h => h.items.forEach(it => { if (it.ex === ex && it.sets.length) n++; })); return n; }
function registros(ex) {
  const r = []; S.historial.forEach(h => h.items.forEach(it => { if (it.ex === ex && it.sets.length) r.push({ f: h.fecha, sets: it.sets }); })); return r;
}
function setsTxt(ex, sets) { return sets.map(s => (usaPeso(ex) ? num(s.w) + ' kg × ' : '') + s.r).join(' · '); }
function resumenPasado(ex) {
  const u = ultimo(ex); if (!u) return '';
  if (EJ[ex].tipo === 'k') return '';
  const w = Math.max(...u.sets.map(s => s.w || 0)), r = Math.max(...u.sets.map(s => s.r));
  return '<br>Vez pasada: ' + (usaPeso(ex) ? num(w) + ' kg × ' : '') + r;
}
function haceTxt(f) { const d = difDias(f, hoy()); return d === 0 ? 'hoy' : d === 1 ? 'ayer' : 'hace ' + d + ' días'; }
function vezPasadaHtml(ex, sg, energia) {
  const u = ultimo(ex);
  if (!u) return sg && sg.msg ? `<div class="consejo">${sg.msg}</div>` : '';
  const peso = usaPeso(ex), n = vecesHecho(ex), rec = mejor(ex), U = unidad(ex);
  let h = `<div class="vez"><div class="vez-t"><span>La vez pasada</span><b>${fCorta(u.fecha)} · ${haceTxt(u.fecha)}</b></div>
    <div class="vez-sets">${u.sets.map((s, k) => `<div class="vs"><small>Serie ${k + 1}</small>${peso ? `<b>${num(s.w)}<i> kg</i></b><span>${s.r} ${U}</span>` : `<b>${s.r}</b><span>${U}</span>`}</div>`).join('')}</div>`;
  if (sg && peso) {
    if (sg.sube) h += `<div class="vez-r up"><div><b>¡Sí, súbele!</b> Hoy ${num(sg.w)} kg. La vez pasada lograste todas las repeticiones.</div></div>`;
    else if (energia === 'tranquila') h += `<div class="vez-r"><div><b>Mismo peso: ${num(sg.w)} kg.</b> Hoy es día tranquilo.</div></div>`;
    else h += `<div class="vez-r"><div><b>Quédate en ${num(sg.w)} kg</b> e intenta llegar a ${sg.r} repeticiones. Cuando hagas ${EJ[ex].reps[1]} en todas las series, te digo que subas.</div></div>`;
  } else if (sg && !peso) h += `<div class="vez-r"><div>Intenta llegar a <b>${sg.r} ${U}</b> hoy.</div></div>`;
  h += `<button class="vez-b" data-a="historial" data-ex="${ex}"><span>${peso && rec ? ' Récord: <b>' + num(rec) + ' kg</b>' : ' ' + n + (n === 1 ? ' vez' : ' veces')}</span><span>Ver todas las veces (${n}) ›</span></button></div>`;
  return h;
}
function hojaHistorial(ex) {
  const filas = registros(ex), peso = usaPeso(ex);
  const pts = filas.map(r => ({ x: r.f, y: peso ? Math.max(...r.sets.map(s => s.w || 0)) : Math.max(...r.sets.map(s => s.r)) }));
  const unico = {}; pts.forEach(p => { unico[p.x] = Math.max(unico[p.x] || 0, p.y); });
  const pts2 = Object.keys(unico).sort().map(x => ({ x, y: unico[x] }));
  hoja(`<h2>${esc(EJ[ex].nombre)}</h2><div class="sub">Todas las veces que lo hiciste</div>
    ${pts2.length > 1 ? `<div class="card" style="padding:12px">${linea([{ nombre: peso ? 'Peso más alto (kg)' : 'Mejor marca', color: 'var(--acc)', pts: pts2 }], true)}</div>` : ''}
    <div class="hist-l">${filas.slice().reverse().map(r => `<div class="hl"><div><b>${fCorta(r.f)}</b><small>${haceTxt(r.f)}</small></div><div class="hl-s">${r.sets.map((s, k) => `<span>${peso ? num(s.w) + ' kg × ' : ''}${s.r}</span>`).join('')}</div></div>`).join('')}</div>
    <button class="btn ghost sm" data-a="cerrar" style="margin-top:14px">Cerrar</button>`);
}
function hojaSesion(id) {
  const h0 = S.historial.find(x => x.id === id); if (!h0) return;
  const R = RUTINAS[h0.rutina];
  hoja(`<h2>${R.nombre}</h2><div class="sub">${fLarga(h0.fecha)} · ${ENERGIA[h0.energia].nombre}</div>
    <div class="hist-l">${h0.items.map(it => `<button class="hl" data-a="historial" data-ex="${it.ex}"><div><b>${esc(EJ[it.ex].nombre)}</b></div><div class="hl-s">${it.sets.map(s => `<span>${usaPeso(it.ex) ? num(s.w) + ' kg × ' : ''}${s.r}${EJ[it.ex].tipo === 'k' ? ' min' : ''}</span>`).join('')}</div></button>`).join('')}</div>
    <button class="btn ghost sm" data-a="cerrar" style="margin-top:14px">Cerrar</button>`);
}

/* ================= VISTA: FIN ================= */
function vFin() {
  const f = S.ultimoFin; const h0 = f && S.historial.find(x => x.id === f.id);
  if (!h0) { setTimeout(() => go('#/'), 0); return ''; }
  const series = h0.items.reduce((a, it) => a + it.sets.length, 0);
  const kilos = h0.items.reduce((a, it) => a + it.sets.reduce((b, s) => b + (s.w || 0) * (EJ[it.ex].tipo === 'k' ? 0 : s.r), 0), 0);
  const sm = semana();
  let h = `<div class="fiesta"><div class="big"><span>✓</span></div><h1>¡Excelente${S.nombre ? ', ' + esc(S.nombre) : ''}!</h1>
    <div class="sub">${RUTINAS[h0.rutina].nombre} terminado</div></div>
    <div class="stat-grid" style="margin-top:20px">
      <div class="stat"><b>${h0.items.length}</b><span>ejercicios</span></div>
      <div class="stat"><b>${series}</b><span>series</span></div>
      <div class="stat"><b>${Math.round(kilos).toLocaleString('es-CO')}</b><span>kg levantados en total</span></div>
      <div class="stat"><b>${sm.hechas.length}${sm.n ? '/' + sm.n : ''}</b><span>días esta semana</span></div>
    </div>`;
  if (f.prs.length) h += `<h2>¡Nuevos récords!</h2>` + f.prs.map(p => `<div class="item"><img class="thumb" src="${foto(p.ex, 1)}" alt=""><div class="t"><b>${esc(EJ[p.ex].nombre)}</b><span>${num(p.ant)} kg → <b class="acc">${num(p.w)} kg</b></span></div></div>`).join('');
  h += `<div class="consejo" style="margin-top:20px">Toma agua y come algo con proteína en las próximas 2 horas (huevos, pollo, yogur, queso, fríjoles).</div>
    <div class="abajo"><div class="in"><button class="btn" data-a="inicio">Volver al inicio</button></div></div>`;
  return h;
}
function confeti() {
  const col = ['#E8A9CC', '#C98BB4', '#F6D3E6', '#9B4D7F', '#2B1027'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div'); c.className = 'confeti';
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = col[i % col.length];
    c.style.animationDuration = (2 + Math.random() * 2.5) + 's'; c.style.animationDelay = Math.random() * .8 + 's';
    document.body.appendChild(c); setTimeout(() => c.remove(), 5500);
  }
  vibrar([60, 40, 60, 40, 120]);
}

/* ================= VISTA: PROGRESO ================= */
function vProgreso() {
  const H = S.historial;
  let h = `<h1>Tu progreso </h1>`;
  // Días por semana (últimas 8)
  const semanas = [];
  for (let k = 7; k >= 0; k--) { const d = aFecha(lunes(hoy())); d.setDate(d.getDate() - 7 * k); semanas.push(iso(d)); }
  const cuenta = semanas.map(w => H.filter(x => lunes(x.fecha) === w).length);
  const totalMes = H.filter(x => difDias(x.fecha, hoy()) < 30).length;
  h += `<div class="stat-grid"><div class="stat"><b>${H.length}</b><span>entrenamientos en total</span></div><div class="stat"><b>${totalMes}</b><span>en los últimos 30 días</span></div></div>`;
  h += `<h2>Días por semana</h2><div class="card">${barras(semanas.map((w, i) => ({ l: fCorta(w), v: cuenta[i], meta: S.semanas[w] || 0 })))}</div>`;

  // Composición corporal
  const M = S.medidas.slice().sort((a, b) => a.fecha < b.fecha ? -1 : 1);
  const u = M[M.length - 1], p = M[0];
  h += `<h2>Cuerpo</h2>`;
  if (u) {
    const pct = u.grasa && u.peso ? Math.round(u.grasa / u.peso * 100) : null;
    h += `<div class="stat-grid">
      <div class="stat"><b>${num(u.peso)} kg</b><span>peso</span></div>
      <div class="stat"><b>${u.grasa != null ? num(u.grasa) + ' kg' : '—'}</b><span>grasa${pct ? ' (' + pct + '%)' : ''}</span></div>
      <div class="stat"><b>${u.musculo != null ? num(u.musculo) + ' kg' : '—'}</b><span>músculo esquelético</span></div>
      <div class="stat"><b>${fCorta(u.fecha)}</b><span>última medición</span></div></div>`;
    if (M.length > 1) {
      h += `<div class="card">${linea([
        { nombre: 'Grasa (kg)', color: '#9B4D7F', pts: M.filter(m => m.grasa != null).map(m => ({ x: m.fecha, y: m.grasa })) },
        { nombre: 'Músculo (kg)', color: 'var(--acc)', pts: M.filter(m => m.musculo != null).map(m => ({ x: m.fecha, y: m.musculo })) }
      ])}</div>`;
      h += `<div class="small">Meta según la báscula: bajar unos 6 kg de grasa y subir 1 kg de músculo. Desde ${fCorta(p.fecha)}: músculo ${signo((u.musculo || 0) - (p.musculo || 0))} kg, grasa ${signo((u.grasa || 0) - (p.grasa || 0))} kg.</div>`;
    }
  }
  h += `<button class="btn ghost sm" style="margin-top:12px" data-a="medida">+ Anotar nueva medición</button>`;

  // Ejercicios
  const usados = {};
  H.forEach(x => x.items.forEach(it => { usados[it.ex] = (usados[it.ex] || 0) + 1; }));
  const lista = Object.keys(usados).filter(ex => EJ[ex] && EJ[ex].tipo !== 'k').sort((a, b) => usados[b] - usados[a]);
  if (H.length) {
    h += `<h2>Tus entrenamientos</h2>` + H.slice().reverse().slice(0, 30).map(x => `<button class="item" data-a="sesion" data-id="${x.id}"><div class="em txt">${RUTINAS[x.rutina].corto}</div><div class="t"><b>${RUTINAS[x.rutina].nombre}</b><span>${fLarga(x.fecha)} · ${x.items.length} ejercicios</span></div><div class="chev">›</div></button>`).join('');
  }
  h += `<h2>Pesos por ejercicio</h2><div class="sub">Toca uno para ver todas las veces que lo hiciste.</div>`;
  if (!lista.length) h += `<div class="vacio">Cuando termines tu primer entrenamiento, aquí verás cómo suben tus pesos semana a semana.</div>`;
  lista.forEach(ex => {
    const u2 = ultimo(ex), w = u2 ? Math.max(...u2.sets.map(s => s.w || 0)) : 0;
    const prim = primero(ex), dif = w - prim;
    h += `<button class="item" onclick="go('#/prog-ej/${ex}')"><img class="thumb" src="${foto(ex, 1)}" alt="" loading="lazy">
      <div class="t"><b>${esc(EJ[ex].nombre)}</b><span>${usaPeso(ex) ? 'Ahora: <b>' + num(w) + ' kg</b>' + (dif > 0 ? `<br><b class="acc">+${num(dif)} kg</b> desde el inicio` : '') : usados[ex] + ' veces'}</span></div><div class="chev">›</div></button>`;
  });
  return h;
}
function signo(n) { return (n > 0 ? '+' : '') + num(n); }
function primero(ex) {
  for (const x of S.historial) { const it = x.items.find(i => i.ex === ex); if (it) return Math.max(...it.sets.map(s => s.w || 0)); }
  return 0;
}
function vProgEj(ex) {
  if (!EJ[ex]) return '';
  const e = EJ[ex];
  const filas = [];
  S.historial.forEach(x => x.items.forEach(it => { if (it.ex === ex) filas.push({ f: x.fecha, sets: it.sets }); }));
  // un punto por semana: el peso máximo
  const porSem = {};
  filas.forEach(r => { const w = lunes(r.f); const m = usaPeso(ex) ? Math.max(...r.sets.map(s => s.w || 0)) : Math.max(...r.sets.map(s => s.r)); porSem[w] = Math.max(porSem[w] || 0, m); });
  const pts = Object.keys(porSem).sort().map(w => ({ x: w, y: porSem[w] }));
  let h = `<button class="link" onclick="history.back()">‹ Volver</button>` + fotoHtml(ex) +
    `<div class="ej-nombre">${esc(e.nombre)}</div><div class="maq">${esc(e.maquina)}</div>`;
  h += `<h2>${usaPeso(ex) ? 'Peso más alto por semana (kg)' : 'Mejor marca por semana (' + unidad(ex) + ')'}</h2>`;
  h += pts.length > 1 ? `<div class="card">${linea([{ nombre: '', color: 'var(--acc)', pts }], true)}</div>` : `<div class="small">Necesitas al menos 2 semanas para ver la gráfica.</div>`;
  h += `<h2>Historial</h2><table class="hist">${filas.slice().reverse().map(r => `<tr><td><b>${fCorta(r.f)}</b></td><td>${r.sets.map(s => (usaPeso(ex) ? num(s.w) + '×' : '') + s.r).join(' · ')}</td></tr>`).join('')}</table>`;
  return h;
}

/* ---------- gráficos SVG ---------- */
function barras(datos) {
  const W = 320, H = 150, max = Math.max(4, ...datos.map(d => Math.max(d.v, d.meta)));
  const bw = W / datos.length;
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H + 24}">`;
  datos.forEach((d, i) => {
    const x = i * bw + bw * .2, w = bw * .6, hh = d.v / max * H, hm = d.meta / max * H;
    if (d.meta) s += `<rect x="${x}" y="${H - hm}" width="${w}" height="${hm}" rx="8" fill="none" stroke="#c9b2c0" stroke-dasharray="4 4"/>`;
    s += `<rect x="${x}" y="${H - hh}" width="${w}" height="${Math.max(hh, 0)}" rx="8" fill="var(--acc)"/>`;
    if (d.v) s += `<text x="${x + w / 2}" y="${H - hh - 6}" text-anchor="middle" fill="#2b1027" font-size="13" font-weight="700">${d.v}</text>`;
    s += `<text x="${x + w / 2}" y="${H + 18}" text-anchor="middle" fill="#8a7083" font-size="11">${d.l}</text>`;
  });
  return s + `</svg><div class="small">Barra rosada = días que fuiste · línea punteada = días que planeaste</div>`;
}
function linea(series, etiquetas) {
  const W = 320, H = 160, P = 28;
  const todos = series.flatMap(s => s.pts);
  if (!todos.length) return '';
  const xs = [...new Set(todos.map(p => p.x))].sort();
  let mn = Math.min(...todos.map(p => p.y)), mx = Math.max(...todos.map(p => p.y));
  if (mx === mn) { mx += 1; mn -= 1; }
  const pad = (mx - mn) * .15; mn -= pad; mx += pad;
  const X = x => P + (xs.length === 1 ? (W - 2 * P) / 2 : xs.indexOf(x) / (xs.length - 1) * (W - 2 * P));
  const Y = y => 10 + (1 - (y - mn) / (mx - mn)) * (H - 20);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H + 22}">`;
  series.forEach(se => {
    if (!se.pts.length) return;
    s += `<polyline fill="none" stroke="${se.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${se.pts.map(p => X(p.x) + ',' + Y(p.y)).join(' ')}"/>`;
    se.pts.forEach((p, i) => {
      s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="${se.color}"/>`;
      if (etiquetas || i === 0 || i === se.pts.length - 1) s += `<text x="${X(p.x)}" y="${Y(p.y) - 10}" text-anchor="middle" fill="#2b1027" font-size="12" font-weight="700">${num(p.y)}</text>`;
    });
  });
  const paso = Math.ceil(xs.length / 5);
  xs.forEach((x, i) => { if (i % paso === 0 || i === xs.length - 1) s += `<text x="${X(x)}" y="${H + 18}" text-anchor="middle" fill="#8a7083" font-size="11">${fCorta(x)}</text>`; });
  s += '</svg>';
  const ley = series.filter(x => x.nombre).map(x => `<span style="color:${x.color}">●</span> ${x.nombre}`).join(' &nbsp; ');
  return s + (ley ? `<div class="small">${ley}</div>` : '');
}

/* ================= VISTA: GUÍA DE EJERCICIOS ================= */
function vGuia(grupo) {
  const grupos = ['Pierna', 'Glúteo', 'Espalda', 'Pecho', 'Hombro', 'Brazos', 'Abdomen', 'Cardio'];
  const g = grupos.includes(decodeURIComponent(grupo || '')) ? decodeURIComponent(grupo) : 'Pierna';
  let h = `<h1>Ejercicios </h1><div class="sub">Toca uno para ver cómo se hace.</div>
    <div class="chips">${grupos.map(x => `<a class="chip ${x === g ? 'on' : ''}" href="#/guia/${encodeURIComponent(x)}" style="text-decoration:none">${x}</a>`).join('')}</div>`;
  Object.keys(EJ).filter(k => EJ[k].grupo === g).forEach(k => {
    h += `<button class="item" onclick="go('#/ficha/${k}')"><img class="thumb" src="${foto(k, 1)}" alt="" loading="lazy"><div class="t"><b>${esc(EJ[k].nombre)}</b><span>${esc(EJ[k].maquina)}</span></div><div class="chev">›</div></button>`;
  });
  return h;
}
function vFicha(ex) {
  const e = EJ[ex]; if (!e) return '';
  const tieneHist = vecesHecho(ex) > 0;
  let h = `<button class="link" onclick="history.back()">‹ Volver</button>` + fotoHtml(ex) +
    `<div class="ej-nombre">${esc(e.nombre)}</div><div class="maq">${esc(e.maquina)}</div><br>
    <span class="meta">${e.reps[0]}–${e.reps[1]} ${unidad(ex)}${e.lado ? ' c/lado' : ''}</span><div class="sub">Trabaja: ${esc(e.musculos)}</div>${tieneHist ? vezPasadaHtml(ex, null, null) : ''}
    <h2>¿Cómo se hace?</h2><ol class="pasos">${e.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`;
  if (e.rodilla && e.rodilla !== '—') h += `<div class="consejo knee"> <b>Rodilla:</b> ${esc(e.rodilla)}</div>`;
  h += `<h2>Parecidos</h2><div class="variantes">${e.variantes.map(v => `<button class="variante" onclick="go('#/ficha/${v}')"><img src="${foto(v, 1)}" alt="" loading="lazy"><div><b>${esc(EJ[v].nombre)}</b><span>${esc(EJ[v].maquina)}</span></div></button>`).join('')}</div>`;
  return h;
}

/* ================= VISTA: MÁS ================= */
function vMas() {
  return `<h1>Más </h1>
    <button class="item" onclick="go('#/porque')"><div class="t"><b>¿Por qué esta rutina?</b><span>Lo que dice la ciencia y tu rodilla</span></div><div class="chev">›</div></button>
    <button class="item" onclick="go('#/instalar')"><div class="t"><b>Poner la app en el celular</b><span>Para abrirla sin internet</span></div><div class="chev">›</div></button>
    <h2>Tu nombre</h2><label class="campo"><input id="nombre" value="${esc(S.nombre)}" placeholder="¿Cómo te llamas?" maxlength="20" onchange="S.nombre=this.value.trim();guardar();toast('Guardado ✓')"></label>
    <h2>Copia de seguridad</h2>
    <div class="small">Tus datos viven solo en este celular. Guarda una copia de vez en cuando (por ejemplo, mándatela por WhatsApp).</div>
    <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-a="exportar">Guardar copia</button><button class="btn ghost sm" data-a="importar">Recuperar copia</button></div>
    <input type="file" id="archivo" accept=".json,application/json" hidden>
    <div class="sep"></div>
    <button class="btn danger sm" data-a="borrar">Borrar todo y empezar de cero</button>
    <p class="small center" style="margin-top:24px">Fotos de ejercicios: Free Exercise DB (dominio público).<br>Hecha con cariño </p>`;
}
function vPorque() {
  return `<button class="link" onclick="history.back()">‹ Volver</button><h1>¿Por qué esta rutina? </h1><div class="texto">
  <div class="card"><h3>Tu punto de partida</h3>
  <p>52 años · 164 cm · 66 kg · grasa 22 kg (cerca del 33 %) · músculo esquelético 21 kg.</p>
  <p>Desde junio ganaste 1 kg de músculo  y subió 2 kg la grasa. La báscula sugiere <b>bajar unos 6 kg de grasa y subir 1 kg de músculo</b>. A un ritmo sano (medio kilo por semana como máximo) eso toma de 3 a 6 meses de constancia.</p></div>

  <h2>Lo que dice la ciencia</h2>
  <ul>
  <li><b>Cada músculo 2 veces por semana.</b> Entrenar fuerza 2 a 3 veces por semana es lo que más músculo da a cualquier edad. Por eso pierna y cola se repiten 2 días.</li>
  <li><b>Después de los 50 hay que levantar peso de verdad.</b> En la menopausia se pierde músculo y hueso más rápido. En mujeres posmenopáusicas, entrenar con pesos que cuestan (con buena técnica) es seguro y mejora músculo, fuerza y hueso.</li>
  <li><b>De 8 a 15 repeticiones, cerca del cansancio.</b> Con pesos moderados se gana tanto músculo como con pesos muy altos, si las últimas repeticiones cuestan. Es más amable con las articulaciones.</li>
  <li><b>Descansar bien entre series.</b> Descansar 2 a 3 minutos gana más músculo que descansar 1 minuto, porque la siguiente serie sale con más fuerza. Por eso la app pone 2 minutos y 45 segundos de descanso.</li>
  <li><b>Subir poquito a poquito.</b> Cuando logras el máximo de repeticiones en todas las series, la app te sube el peso. Así el cuerpo sigue mejorando.</li>
  <li><b>Brazos y espalda: tonificar, no agrandar.</b> "Tonificar" es tener músculo firme y menos grasa encima. Con 12 a 15 repeticiones y sin exagerar el volumen, los brazos no crecen. La grasa no se quema por zonas: baja en todo el cuerpo.</li>
  <li><b>La grasa se baja sobre todo en la cocina.</b> Comer un poquito menos de lo que gastas, proteína en cada comida (unos 80 a 100 g al día: huevos, pollo, pescado, lácteos, fríjoles, lentejas) y caminar más. El cardio suave al final del entrenamiento ayuda.</li>
  <li><b>Los días con poca energía cuentan.</b> Mejor ir y hacer la versión tranquila que no ir. Lo que da resultados es la constancia de semanas y meses. Dormir 7 a 8 horas también ayuda a ganar músculo.</li>
  </ul>

  <h2>Cuidando la rodilla operada</h2>
  <ul>
  <li>Nada de impacto: correr, saltar, aeróbicos con brincos.</li>
  <li>No doblar la rodilla con peso más allá de 90° (ángulo recto). Por eso no hay sentadillas profundas ni zancadas, y la prensa se hace con poco peso y recorrido corto.</li>
  <li>Evitar girar el cuerpo con el pie fijo en el piso.</li>
  <li>Sí: máquinas guiadas, extensión de cuádriceps con peso moderado, curl femoral, hip thrust, abductor, bici y elíptica. Fortalecer cuádriceps y glúteo protege la prótesis.</li>
  <li>Si un ejercicio duele <i>dentro</i> de la rodilla, se cambia por una variante. Cansancio en el músculo es normal; dolor en la articulación no.</li>
  <li><b>Muéstrale esta rutina a tu ortopedista o fisioterapeuta</b> para que confirme los ejercicios y el peso de la prensa.</li>
  </ul>

  <h2>Cómo funciona la semana</h2>
  <ul>
  <li>Cada lunes la app te pregunta cuántos días vas a ir.</li>
  <li>Cada vez que abres la app te dice qué te toca <i>hoy</i>, según lo que ya hiciste. Si faltas un día, no se daña nada: lo que no hiciste queda pendiente.</li>
  <li>Si se acaba la semana y quedan entrenamientos, se prioriza pierna y cola.</li>
  <li>Tú eliges la energía del día: tranquila (6 ejercicios), normal (7) o con energía (8).</li>
  </ul>
  <p class="ref">Basado en: posición de la NSCA sobre entrenamiento de fuerza en adultos mayores (Fragala y col., 2019); posición del ACSM sobre progresión en entrenamiento de fuerza (2009); estudio LIFTMOR en mujeres posmenopáusicas (Watson y col., 2018); metaanálisis de cargas bajas vs. altas para hipertrofia (Schoenfeld y col., 2017); recomendaciones de actividad física tras prótesis de rodilla (Kuster, 2002; Meier y col., 2008). Esta app no reemplaza la indicación de un médico.</p>
  </div>`;
}
function vInstalar() {
  return `<button class="link" onclick="history.back()">‹ Volver</button><h1>Poner la app en el celular </h1>
  ${deferido ? `<button class="btn" data-a="instalarYa">Instalar ahora</button>` : ''}
  <div class="card"><h3>Android (Chrome)</h3><ol class="pasos"><li>Abre el link en <b>Chrome</b>.</li><li>Toca los <b>3 puntitos ⋮</b> arriba a la derecha.</li><li>Toca <b>"Agregar a la pantalla principal"</b> o <b>"Instalar app"</b>.</li><li>Listo: aparece el ícono "Fit mommy" junto a tus apps.</li></ol></div>
  <div class="card"><h3>iPhone (Safari)</h3><ol class="pasos"><li>Abre el link en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (cuadrito con flecha ↑).</li><li>Baja y toca <b>"Agregar a inicio"</b>.</li><li>Toca <b>"Agregar"</b>.</li></ol></div>
  <div class="consejo">Después de abrirla una vez con internet, funciona <b>sin internet</b> en el gimnasio.</div>`;
}

/* ================= HOJAS (MODALES) ================= */
function hoja(html) {
  cerrarHoja();
  const v = document.createElement('div'); v.className = 'velo'; v.id = 'velo';
  v.innerHTML = `<div class="hoja"><div class="asa"></div>${html}</div>`;
  v.addEventListener('click', ev => { if (ev.target === v) cerrarHoja(); });
  document.body.appendChild(v);
}
function cerrarHoja() { const v = document.getElementById('velo'); if (v) v.remove(); }

function barras3(n) { return `<span class="niv">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`; }
function hojaEnergia(rutina) {
  const R = RUTINAS[rutina];
  hoja(`<h2>${R.nombre}</h2><div class="sub" style="margin-bottom:14px">¿Cómo te sientes hoy?</div><div class="energia">
    ${Object.keys(ENERGIA).map(k => { const E = ENERGIA[k]; return `<button class="en-btn" data-a="energia" data-r="${rutina}" data-e="${k}"><div class="e">${barras3(E.nivel)}</div><div><b>${E.nombre}</b><span>${E.frase}</span></div></button>`; }).join('')}
    </div><p class="small center">Todos los días cuentan. Si estás cansada, la tranquila también te hace avanzar.</p>`);
}
function hojaOtras() {
  const sm = semana();
  const ops = [...new Set(sm.pendientes)];
  hoja(`<h2>¿Qué quieres hacer hoy?</h2>${ops.map(r => `<button class="item" data-a="empezar" data-r="${r}"><div class="em txt">${RUTINAS[r].corto}</div><div class="t"><b>${RUTINAS[r].nombre}</b><span>${RUTINAS[r].desc}</span></div><div class="chev">›</div></button>`).join('')}`);
}
function hojaExtra() {
  hoja(`<h2>Día extra </h2><div class="sub">Elige cualquiera:</div>${Object.keys(RUTINAS).map(r => `<button class="item" data-a="empezar" data-r="${r}"><div class="em txt">${RUTINAS[r].corto}</div><div class="t"><b>${RUTINAS[r].nombre}</b><span>${RUTINAS[r].desc}</span></div><div class="chev">›</div></button>`).join('')}`);
}
function hojaDias() {
  const sm = semana();
  hoja(`<h2>¿Cuántos días en total esta semana?</h2><div class="sub">Ya llevas ${sm.hechas.length}. Lo que hiciste no se pierde.</div>
    <div class="dias">${[2, 3, 4, 5, 6].map(n => `<button class="dia-btn ${n === sm.n ? 'sel' : ''} ${n < 3 || n > 5 ? 'chico' : ''}" data-a="dias" data-n="${n}"><b>${n}</b><span>días</span></button>`).join('')}</div>`);
}
function hojaSalir() {
  const a = S.actual, alguno = a && a.items.some(itemHecho);
  hoja(`<h2>¿Qué quieres hacer?</h2>
    <button class="btn ghost" data-a="cerrar">Seguir entrenando</button><div style="height:10px"></div>
    ${alguno ? `<button class="btn" data-a="terminar">Terminar y guardar lo que hice</button><div style="height:10px"></div>` : ''}
    <button class="btn line" data-a="pausa">Salir (lo guardo para después)</button><div style="height:10px"></div>
    <button class="btn danger sm" data-a="descartar">Cancelar este entrenamiento</button>`);
}
function hojaMedida() {
  const u = S.medidas[S.medidas.length - 1] || {};
  hoja(`<h2>Nueva medición</h2><div class="sub">Copia los datos de la báscula del gimnasio (InBody o similar). Deja vacío lo que no tengas.</div>
    <label class="campo"><span>Peso (kg)</span><input id="m-peso" type="number" inputmode="decimal" step="0.1" placeholder="${u.peso || ''}"></label>
    <label class="campo"><span>Masa de grasa (kg)</span><input id="m-grasa" type="number" inputmode="decimal" step="0.1" placeholder="${u.grasa || ''}"></label>
    <label class="campo"><span>Masa muscular esquelética (kg)</span><input id="m-musc" type="number" inputmode="decimal" step="0.1" placeholder="${u.musculo || ''}"></label>
    <button class="btn" data-a="guardarMedida">Guardar</button>`);
}
function hojaEscribir(c, i, k) {
  const s = S.actual.items[i].sets[k];
  const u = c === 'w' ? 'kg' : unidad(S.actual.items[i].ex);
  hoja(`<h2>Escribe ${c === 'w' ? 'el peso' : 'las ' + u}</h2>
    <label class="campo"><input id="valor" type="number" inputmode="decimal" step="0.5" value="${s[c]}" style="font-size:32px;height:70px;text-align:center"></label>
    <div class="small" style="margin-bottom:12px">Se copia a las series que faltan.</div>
    <button class="btn" data-a="guardarValor" data-c="${c}" data-i="${i}" data-k="${k}">Listo</button>`);
  setTimeout(() => { const el = document.getElementById('valor'); el && (el.focus(), el.select()); }, 250);
}

/* ================= DESCANSO ================= */
let reloj = null;
// Descanso fijo entre series: 2 min 45 s
function segDescanso() { return 165; }
function mmss(t) { return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
function descanso(seg) {
  pararDescanso();
  const fin = Date.now() + seg * 1000;
  const d = document.createElement('div'); d.className = 'descanso'; d.id = 'descanso';
  const C = 2 * Math.PI * 108;
  d.innerHTML = `<div class="sub" style="font-size:18px">Descansa: así la próxima serie sale más fuerte</div>
    <div class="reloj"><svg width="240" height="240"><circle cx="120" cy="120" r="108" stroke="var(--card2)" stroke-width="16" fill="none"/>
    <circle id="arco" cx="120" cy="120" r="108" stroke="var(--acc)" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><div class="num" id="seg">${mmss(seg)}</div></div>
    <div class="row"><button class="btn" data-a="saltar">Listo ▶</button></div>`;
  document.body.appendChild(d);
  const total = seg, finR = fin;
  reloj = setInterval(() => {
    const r = Math.max(0, Math.ceil((finR - Date.now()) / 1000));
    const el = document.getElementById('seg'); if (!el) return pararDescanso();
    el.textContent = mmss(r);
    document.getElementById('arco').setAttribute('stroke-dashoffset', C * (1 - r / total));
    if (r <= 0) { pitido(); vibrar([200, 100, 200]); pararDescanso(); }
  }, 250);
}
function pararDescanso() { clearInterval(reloj); reloj = null; const d = document.getElementById('descanso'); if (d) d.remove(); }
function pitido() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, .25].forEach(t => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.25, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + t + .2); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .22); });
  } catch (e) {}
}

/* ================= PANTALLA ENCENDIDA ================= */
let wake = null;
async function mantenerPantalla() { try { if ('wakeLock' in navigator && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); } } catch (e) {} }
function soltarPantalla() { try { wake && wake.release(); } catch (e) {} wake = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.actual) mantenerPantalla(); });

/* ================= ACCIONES ================= */
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-a]'); if (!b) return;
  const d = b.dataset, a = d.a, i = Number(d.i), k = Number(d.k);
  const act = S.actual;
  switch (a) {
    case 'dias': {
      const n = Number(d.n); S.semanas[lunes(hoy())] = n; S.ultimaN = n; guardar(); cerrarHoja(); render();
      toast('¡Listo! Semana de ' + n + ' días '); break;
    }
    case 'cambiarDias': hojaDias(); break;
    case 'empezar': hojaEnergia(d.r); break;
    case 'otras': hojaOtras(); break;
    case 'extra': hojaExtra(); break;
    case 'energia': crearSesion(d.r, d.e); cerrarHoja(); mantenerPantalla(); go('#/entreno'); break;
    case 'continuar': mantenerPantalla(); go(act && act.idx >= 0 ? '#/ej/' + act.idx : '#/entreno'); break;
    case 'abrir': go('#/ej/' + i); break;
    case 'lista': go('#/entreno'); break;
    case 'salir': hojaSalir(); break;
    case 'cerrar': cerrarHoja(); break;
    case 'pausa': cerrarHoja(); soltarPantalla(); go('#/'); break;
    case 'descartar': S.actual = null; guardar(); cerrarHoja(); soltarPantalla(); go('#/'); toast('Entrenamiento cancelado'); break;
    case 'terminar': cerrarHoja(); terminarSesion(); break;
    case 'inicio': go('#/'); break;
    case 'calentar': act.calentado = !act.calentado; guardar(); render(); break;
    case 'mas': case 'menos': {
      const it = act.items[i], s = it.sets[k], e = EJ[it.ex];
      const step = d.c === 'w' ? (e.inc || 1) : 1;
      const nv = Math.max(0, Math.round((s[d.c] + (a === 'mas' ? step : -step)) * 100) / 100);
      // copia a las series siguientes que no estén hechas
      it.sets.forEach((x, j) => { if (j === k || (j > k && !x.ok)) x[d.c] = nv; }); s.ed = true;
      guardar(); rerenderMismaPos(); break;
    }
    case 'escribir': hojaEscribir(d.c, i, k); break;
    case 'guardarValor': {
      const v = parseFloat(String(document.getElementById('valor').value).replace(',', '.'));
      if (!isNaN(v) && v >= 0) { const it = act.items[i]; it.sets.forEach((x, j) => { if (j === k || (j > k && !x.ok)) x[d.c] = v; }); it.sets[k].ed = true; guardar(); }
      cerrarHoja(); rerenderMismaPos(); break;
    }
    case 'ok': {
      const it = act.items[i], s = it.sets[k];
      s.ok = !s.ok; guardar(); rerenderMismaPos();
      if (s.ok) {
        vibrar(40);
        const quedan = it.sets.some(x => !x.ok);
        if (EJ[it.ex].tipo === 'k') { if (i === act.items.length - 1) toast('¡Cardio listo! Toca "Terminar" '); }
        else if (quedan) descanso(segDescanso(it.ex, act.energia));
        else { toast('¡Ejercicio terminado! ✓'); if (i < act.items.length - 1) setTimeout(() => { descanso(segDescanso(it.ex, act.energia)); }, 300); }
      }
      break;
    }
    case 'masSerie': { const it = act.items[i], l = it.sets[it.sets.length - 1]; it.sets.push({ w: l.w, r: l.r, ok: false }); guardar(); rerenderMismaPos(); break; }
    case 'menosSerie': { const it = act.items[i]; if (it.sets.length > 1) it.sets.pop(); guardar(); rerenderMismaPos(); break; }
    case 'cambiar': {
      const n = act.items[i].sets.length;
      act.items[i] = itemNuevo(d.ex, act.energia, n); guardar(); render(); window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Cambiado por: ' + EJ[d.ex].nombre); break;
    }
    case 'saltar': pararDescanso(); break;
    case 'historial': hojaHistorial(d.ex); break;
    case 'sesion': hojaSesion(d.id); break;
    case 'tema': S.tema = d.t; guardar(); render(); break;
    case 'medida': hojaMedida(); break;
    case 'guardarMedida': {
      const g = id => { const v = parseFloat(String(document.getElementById(id).value).replace(',', '.')); return isNaN(v) ? null : v; };
      const m = { fecha: hoy(), peso: g('m-peso'), grasa: g('m-grasa'), musculo: g('m-musc') };
      if (m.peso == null && m.grasa == null && m.musculo == null) { toast('Escribe al menos un dato'); break; }
      S.medidas = S.medidas.filter(x => x.fecha !== m.fecha); S.medidas.push(m); guardar(); cerrarHoja(); render(); toast('Medición guardada ✓'); break;
    }
    case 'exportar': exportar(); break;
    case 'importar': { const f = document.getElementById('archivo'); f.onchange = importar; f.click(); break; }
    case 'borrar':
      hoja(`<h2>¿Borrar todo?</h2><div class="sub">Se pierden todos tus entrenamientos y pesos. No se puede deshacer.</div><div style="height:14px"></div>
        <button class="btn ghost" data-a="cerrar">No, volver</button><div style="height:10px"></div><button class="btn danger" data-a="borrarSi">Sí, borrar todo</button>`); break;
    case 'borrarSi': S = nuevoEstado(); guardar(); cerrarHoja(); go('#/'); break;
    case 'instalarYa': if (deferido) { deferido.prompt(); deferido = null; } break;
  }
});
// Actualiza solo las series (sin redibujar la pantalla) para que no salte ni tiemble
function rerenderMismaPos() {
  const box = document.getElementById('series'), m = location.hash.match(/^#\/ej\/(\d+)/);
  if (box && m && S.actual) {
    box.innerHTML = seriesHtml(Number(m[1]));
    const a = S.actual, hechos = a.items.filter(itemHecho).length;
    const bar = document.querySelector('.progreso i'), txt = document.querySelector('.progreso small');
    if (bar) bar.style.width = Math.round(hechos / a.items.length * 100) + '%';
    if (txt) txt.textContent = hechos + ' de ' + a.items.length + ' ejercicios';
    return;
  }
  const y = window.scrollY; render(); window.scrollTo(0, y);
}

/* ================= COPIA DE SEGURIDAD ================= */
async function exportar() {
  const datos = JSON.stringify(S);
  const nombre = 'fit-mommy-copia-' + hoy() + '.json';
  try {
    const f = new File([datos], nombre, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'Copia Fit mommy' }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([datos], { type: 'application/json' })); a.download = nombre; a.click();
  toast('Copia descargada ✓');
}
function importar(ev) {
  const f = ev.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try { const d = JSON.parse(r.result); if (!d || !Array.isArray(d.historial)) throw 0; S = Object.assign(nuevoEstado(), d); guardar(); render(); toast('¡Copia recuperada! ✓'); }
    catch (e) { toast('Ese archivo no es una copia válida'); }
  };
  r.readAsText(f);
}

/* ================= PWA ================= */
let deferido = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferido = e; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {}));
// Cuando hay una versión nueva de la app, recarga sola (todo queda guardado, no se pierde nada)
if ('serviceWorker' in navigator) {
  const habia = !!navigator.serviceWorker.controller;
  let recargado = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (habia && !recargado) { recargado = true; location.reload(); } });
  // Al volver a abrir la app, revisa si hay versión nueva
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {});
  });
}
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

render();
