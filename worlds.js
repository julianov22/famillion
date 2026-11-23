// Worlds are the visual presets a day is played in. Each is a journey of 9 points in a 400-wide SVG:
// a start, the 7 prompt stops, and a finish. The engine in index.html moves the `mover` between them.
//   pts           9 [x, y] points
//   seg(a, b)     SVG path commands from point a to point b (the "M a" is added by the engine)
//   art(d, lang)  the scenery SVG, given the full route path d
//   hudAt(k), hudMove(k, e)   the top-right readout at point k, or moving from k to k+1 (e = 0..1)
//   orient(dx, dy)            rotation for the mover while it travels
//   text[lang]    every world-specific line of copy

const fmt = n => n.toLocaleString('en');
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ---------- Swiss alpine descent: Maschgenkamm (Flumserberg) down to Unterterzen on the Walensee ----------
const ALTS = [2222, 2050, 1800, 1560, 1300, 1040, 780, 560, 420];
const alpinePts = ALTS.map((_, k) => [k === 0 || k === 8 ? 200 : (k % 2 ? 125 : 275), 640 + k * 300]);
const smooth = (y, pts) => {
  for (let k = 0; k < pts.length - 1; k++) {
    const [x0, y0] = pts[k], [x1, y1] = pts[k + 1];
    if (y >= y0 && y <= y1) { const t = (y - y0) / (y1 - y0); return x0 + (x1 - x0) * t * t * (3 - 2 * t); }
  }
  return 200;
};
const chalet = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-12" width="28" height="16" fill="#7a4a2e"/><rect x="-4" y="-6" width="7" height="10" fill="#3b2416"/><rect x="-11" y="-9" width="5" height="5" fill="#ffd27a"/><rect x="7" y="-9" width="5" height="5" fill="#ffd27a"/><path d="M-19 -11L0 -26L19 -11Z" fill="#fff"/><path d="M-19 -11L0 -26L19 -11L16 -11L0 -23L-16 -11Z" fill="#c9d8e6"/></g>`;

function alpineArt(d, lang) {
  seed = 11;
  const P = alpinePts, L = lang === 'es' ? { start: 'SALIDA', gate: 'PUERTA', finish: 'META' } : { start: 'START', gate: 'GATE', finish: 'FINISH' };
  const trees = [];
  for (let i = 0; i < 320; i++) {
    const y = 660 + rnd() * 2380, x = rnd() * 400, dens = (y - 660) / 2380;
    if (Math.abs(x - smooth(y, P)) < 58) continue;
    if (x > 64 && x < 336 && rnd() > dens * .8) continue;
    trees.push([x, y, 9 + rnd() * 12 + dens * 8, ['#1f4d3a', '#245a42', '#183f2e'][i % 3]]);
  }
  trees.sort((a, b) => a[1] - b[1]);
  const tree = ([x, y, s, c]) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse cx="${s * .35}" cy="${s * .12}" rx="${s * .7}" ry="${s * .16}" fill="#cddcea"/><rect x="-1.5" y="-2" width="3" height="${s * .3}" fill="#5a3b2a"/><path d="M0 ${-s * 1.7}L${s * .62} 0L${-s * .62} 0Z" fill="${c}"/><path d="M0 ${-s * 1.7}L${s * .26} ${-s}L0 ${-s * 1.08}L${-s * .26} ${-s}Z" fill="#fff"/></g>`;
  const moguls = Array.from({ length: 60 }, () => `<ellipse cx="${(rnd() * 400).toFixed(0)}" cy="${(700 + rnd() * 2300).toFixed(0)}" rx="${(8 + rnd() * 16).toFixed(0)}" ry="3" fill="#e4edf6"/>`).join('');
  const gates = P.slice(1, 8).map(([x, y], i) => {
    const col = i % 2 ? '#1d4ed8' : '#d52b1e', left = x < 200, tx = left ? x + 52 : x - 52, anchor = left ? 'start' : 'end';
    const flag = fx => `<line x1="${fx}" y1="${y - 26}" x2="${fx}" y2="${y + 2}" stroke="#2a3346" stroke-width="1.6"/><path d="M${fx} ${y - 26}l14 5l-14 5z" fill="${col}"/>`;
    return `${flag(x - 32)}${flag(x + 32)}<text x="${tx}" y="${y - 10}" text-anchor="${anchor}" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="${col}">${L.gate} ${i + 1}</text><text x="${tx}" y="${y + 4}" text-anchor="${anchor}" font-family="JetBrains Mono" font-size="11" fill="#5b6b82">${fmt(ALTS[i + 1])} m</text>`;
  }).join('');
  const [fx, fy] = P[8];
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d97d0"/><stop offset=".75" stop-color="#bcd8ef"/><stop offset="1" stop-color="#e9f2fa"/></linearGradient>
    <linearGradient id="slope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#e8f0f7"/></linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f97a8"/><stop offset="1" stop-color="#1d5866"/></linearGradient></defs>
  <rect width="400" height="700" fill="url(#sky)"/><circle cx="318" cy="150" r="46" fill="#ffe6c7" opacity=".9"/>
  <ellipse cx="70" cy="330" rx="64" ry="12" fill="#fff" opacity=".55"/><ellipse cx="330" cy="300" rx="56" ry="10" fill="#fff" opacity=".5"/>
  <path d="M0 470L34 380L70 412L112 300L150 360L192 250L238 345L282 282L322 352L362 300L400 365V700H0Z" fill="#a8bfd6"/>
  <path d="M112 300L126 330L138 322L150 360L132 352L122 340ZM192 250L206 290L220 280L238 345L214 318L200 300ZM282 282L296 312L306 304L322 352L302 330Z" fill="#eef4fa"/>
  <path d="M0 560L44 468L92 520L142 418L198 500L250 398L310 482L360 432L400 476V720H0Z" fill="#f4f8fc"/>
  <path d="M142 418L198 500L170 500L150 452ZM250 398L310 482L282 470L260 430ZM44 468L92 520L70 512Z" fill="#d6e3ef"/>
  <rect y="600" width="400" height="2500" fill="url(#slope)"/>${moguls}
  <path d="${d}" fill="none" stroke="#d3e1ed" stroke-width="62" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="#f1f6fb" stroke-width="54" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="#bcd0e2" stroke-width="1.2" stroke-dasharray="2 7" transform="translate(-7 0)"/>
  <path d="${d}" fill="none" stroke="#bcd0e2" stroke-width="1.2" stroke-dasharray="2 7" transform="translate(7 0)"/>
  ${trees.map(tree).join('')}${chalet(P[0][0] - 58, P[0][1] + 4, .9)}
  <text x="${P[0][0] + 40}" y="${P[0][1] - 6}" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="#14213d">${L.start}</text>
  <text x="${P[0][0] + 40}" y="${P[0][1] + 8}" font-family="JetBrains Mono" font-size="11" fill="#5b6b82">Maschgenkamm · 2,222 m</text>
  ${gates}
  <line x1="${fx - 46}" y1="${fy - 34}" x2="${fx - 46}" y2="${fy + 4}" stroke="#2a3346" stroke-width="2.4"/><line x1="${fx + 46}" y1="${fy - 34}" x2="${fx + 46}" y2="${fy + 4}" stroke="#2a3346" stroke-width="2.4"/>
  <rect x="${fx - 50}" y="${fy - 44}" width="100" height="18" rx="2" fill="#d52b1e"/>
  <text x="${fx}" y="${fy - 31}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="#fff" letter-spacing="2">${L.finish}</text>
  <path d="M0 3100Q50 3088 100 3098T200 3094T300 3100T400 3092V4000H0Z" fill="url(#lake)"/>
  <path d="M40 3150h60M150 3170h80M260 3140h70M90 3210h90M240 3230h110" stroke="#7cc3d1" stroke-width="2" stroke-linecap="round" opacity=".6"/>
  ${chalet(60, 3090, 1)}${chalet(98, 3094, .8)}${chalet(330, 3088, 1.1)}
  <text x="200" y="3196" text-anchor="middle" font-family="Bricolage Grotesque" font-size="20" font-weight="800" fill="#d8f0f4" opacity=".85">Walensee</text>
  <text x="200" y="3216" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="#d8f0f4" opacity=".75">UNTERTERZEN · 420 m</text>`;
}

const raceTime = (pts, name) => {
  const t = 30 + (21 - pts) * 2.4 + [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 10 / 10;
  return `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
};

const alpine = {
  bg: '#7fb3e0', height: 4000, homeAt: .62, snow: true, tint: '#f7c9a9', tintMax: .45, marker: ['#d52b1e', '#1d4ed8'],
  badge: '<span class="badge swiss"></span>',
  pts: alpinePts,
  seg: ([x0, y0], [x1, y1]) => { const m = (y1 - y0) / 2; return `C${x0} ${y0 + m} ${x1} ${y1 - m} ${x1} ${y1}`; },
  art: alpineArt,
  hudAt: k => `${fmt(ALTS[k])} m`,
  hudMove: (k, e) => `${fmt(Math.round(ALTS[k] + (ALTS[k + 1] - ALTS[k]) * e))} m`,
  orient: dx => `rotate(${Math.max(-25, Math.min(25, dx * 14))}deg)`,
  mover: `<line x1="-13" y1="7" x2="13" y2="9" stroke="#14213d" stroke-width="2.4" stroke-linecap="round"/><line x1="-11" y1="11" x2="12" y2="13" stroke="#14213d" stroke-width="2.4" stroke-linecap="round"/><path d="M-3 7L-1 -1L3 -1L5 8" stroke="#14213d" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-5" y="-12" width="10" height="12" rx="3" fill="#d52b1e"/><circle cx="0" cy="-16" r="4.2" fill="#f2c8a0"/><path d="M-4.5 -17a4.5 4.5 0 0 1 9 0z" fill="#1d4ed8"/><line x1="-6" y1="-6" x2="-12" y2="10" stroke="#5b6b82" stroke-width="1.2"/><line x1="6" y1="-6" x2="12" y2="10" stroke="#5b6b82" stroke-width="1.2"/>`,
  score: raceTime,
  text: {
    en: {
      place: 'Flumserberg', homeTitle: "Today's run", start: 'Start the run ↓',
      homeLead: '7 gates from Maschgenkamm down to the Walensee. At each gate, one prompt. The rarer your answer, the faster your run.',
      stop: g => `Gate ${g} of 7 · ${fmt(ALTS[g])} m`, stopShort: g => `Gate ${g} · ${fmt(ALTS[g])} m`,
      next: g => g < 7 ? `Ski to gate ${g + 1} ↓` : 'Ski to the finish ↓',
      finishEyebrow: 'Finish · Unterterzen · 420 m', finishTitle: r => r === 1 ? 'Fastest run today!' : 'You made it down', scoreLabel: 'Your run',
    },
    es: {
      place: 'Flumserberg', homeTitle: 'La bajada de hoy', start: 'Empezar la bajada ↓',
      homeLead: '7 puertas desde Maschgenkamm hasta el Walensee. En cada puerta, una pregunta. Cuanto más rara tu respuesta, más rápida tu bajada.',
      stop: g => `Puerta ${g} de 7 · ${fmt(ALTS[g])} m`, stopShort: g => `Puerta ${g} · ${fmt(ALTS[g])} m`,
      next: g => g < 7 ? `Esquía a la puerta ${g + 1} ↓` : 'Esquía a la meta ↓',
      finishEyebrow: 'Meta · Unterterzen · 420 m', finishTitle: r => r === 1 ? '¡La bajada más rápida de hoy!' : 'Has llegado abajo', scoreLabel: 'Tu bajada',
    },
  },
};

// ---------- Madrid metro: Line 1 from Estrecho down to Sol, on a December night ----------
const STATIONS = ['Estrecho', 'Alvarado', 'Cuatro Caminos', 'Ríos Rosas', 'Iglesia', 'Bilbao', 'Tribunal', 'Gran Vía', 'Sol'];
const metroPts = STATIONS.map((_, k) => [k === 0 || k === 8 ? 200 : (k % 2 ? 110 : 290), 640 + k * 300]);
const metroSeg = ([x0, y0], [x1, y1]) => { const a = (y1 - y0 - Math.abs(x1 - x0)) / 2; return `L${x0} ${y0 + a} L${x1} ${y1 - a} L${x1} ${y1}`; };
const lineX = y => { // x of the line at height y, following the same straight and 45° segments
  for (let k = 0; k < metroPts.length - 1; k++) {
    const [x0, y0] = metroPts[k], [x1, y1] = metroPts[k + 1], a = (y1 - y0 - Math.abs(x1 - x0)) / 2;
    if (y < y0 || y > y1) continue;
    if (y <= y0 + a) return x0;
    if (y >= y1 - a) return x1;
    return x0 + (x1 - x0) * (y - y0 - a) / (y1 - y0 - 2 * a);
  }
  return 200;
};
const CELESTE = '#38b6e8';

function metroArt(d) {
  seed = 23;
  const stars = Array.from({ length: 50 }, () => `<circle cx="${(rnd() * 400).toFixed(0)}" cy="${(rnd() * 460).toFixed(0)}" r="${(.5 + rnd()).toFixed(1)}" fill="#fff" opacity="${(.3 + rnd() * .6).toFixed(2)}"/>`).join('');
  let skyline = '', x = 0;
  while (x < 400) {
    const w = 26 + rnd() * 34, h = 60 + rnd() * 110;
    skyline += `<rect x="${x.toFixed(0)}" y="${(640 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#0e1430"/>`;
    for (let wy = 640 - h + 10; wy < 630; wy += 14) for (let wx = x + 6; wx < x + w - 6; wx += 10) if (rnd() > .62) skyline += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" fill="#ffd98a" opacity=".8"/>`;
    x += w + 3;
  }
  const dome = `<path d="M150 470h50v-30a25 25 0 0 1 50 0v30h50v170H150Z" fill="#0e1430"/><path d="M225 410v-22" stroke="#0e1430" stroke-width="4"/><circle cx="225" cy="384" r="5" fill="#e8c26a"/>`;
  let blocks = '';
  for (let by = 700; by < 2980; by += 64) for (let bx = 8; bx < 392; bx += 78) {
    const cx = bx + 34, cy = by + 25;
    if (Math.abs(cx - lineX(cy)) < 80 || Math.abs(cx - lineX(by)) < 70 || Math.abs(cx - lineX(by + 50)) < 70) continue;
    blocks += `<rect x="${bx}" y="${by}" width="68" height="50" rx="6" fill="#1d2647"/>`;
    for (let i = 0; i < 4; i++) if (rnd() > .5) blocks += `<rect x="${bx + 8 + i * 14}" y="${by + 10 + (rnd() > .5 ? 18 : 0)}" width="6" height="8" rx="1" fill="#ffd98a" opacity="${(.35 + rnd() * .5).toFixed(2)}"/>`;
  }
  let lights = '';
  for (let i = 0; i < 16; i++) {
    const y = 760 + Math.floor(rnd() * 35) * 64 - 7, x0 = rnd() * 200, x1 = x0 + 120 + rnd() * 120;
    for (let lx = x0; lx < x1; lx += 9) lights += `<circle cx="${lx.toFixed(0)}" cy="${(y + Math.sin((lx - x0) / (x1 - x0) * Math.PI) * 6).toFixed(1)}" r="1.6" fill="${i % 3 ? '#ffcf6e' : '#ff8fa3'}"/>`;
  }
  const stations = metroPts.slice(0, 8).map(([sx, sy], k) => {
    const left = sx < 200 || k === 0, tx = left ? sx + 26 : sx - 26, anchor = left ? 'start' : 'end';
    return `<circle cx="${sx}" cy="${sy}" r="11" fill="#fff" stroke="${CELESTE}" stroke-width="5"/>
      <text x="${tx}" y="${sy + 2}" text-anchor="${anchor}" font-family="Bricolage Grotesque" font-size="17" font-weight="800" fill="#fff">${STATIONS[k]}</text>
      <text x="${tx}" y="${sy + 18}" text-anchor="${anchor}" font-family="JetBrains Mono" font-size="10" fill="${CELESTE}">${k === 0 ? 'L1' : `L1 · ${k}/7`}</text>`;
  }).join('');
  const [sx, sy] = metroPts[8];
  const sol = `<rect x="0" y="3080" width="400" height="920" fill="#2a3152"/>
    <path d="M0 3080h400" stroke="#ffcf6e" stroke-width="2" stroke-dasharray="2 8"/>
    <rect x="70" y="3150" width="260" height="110" fill="#c98f5f"/><rect x="70" y="3150" width="260" height="8" fill="#e7b98c"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${84 + i * 24}" y="${i === 4 || i === 5 ? 3220 : 3172}" width="10" height="${i === 4 || i === 5 ? 40 : 20}" fill="#ffe3a8"/>`).join('')}
    <rect x="178" y="3092" width="44" height="60" fill="#c98f5f"/><path d="M174 3092h52l-26-22z" fill="#8a5a3a"/>
    <circle cx="200" cy="3118" r="15" fill="#fff8e6" stroke="#3a2a1e" stroke-width="2"/>
    <path d="M200 3118V3106M200 3118l1 -11" stroke="#3a2a1e" stroke-width="2" stroke-linecap="round"/>
    <path d="M200 3068V3052" stroke="#3a2a1e" stroke-width="2"/><circle cx="200" cy="3058" r="5" fill="#e8c26a"/>
    <path d="M354 3260L376 3170L398 3260Z" fill="none" stroke="#ffcf6e" stroke-width="1.5" stroke-dasharray="1 5"/>
    <path d="M20 3260L40 3190L60 3260Z" fill="none" stroke="#ff8fa3" stroke-width="1.5" stroke-dasharray="1 5"/>
    <text x="200" y="3284" text-anchor="middle" font-family="Bricolage Grotesque" font-size="18" font-weight="800" fill="#ffe3a8">Puerta del Sol</text>
    <text x="200" y="3296" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#ffe3a8" opacity=".75">KM 0</text>`;
  return `<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1026"/><stop offset="1" stop-color="#26305e"/></linearGradient></defs>
  <rect width="400" height="4000" fill="#151c38"/><rect width="400" height="660" fill="url(#nsky)"/>${stars}
  <circle cx="330" cy="120" r="28" fill="#f6ecd0"/><circle cx="342" cy="112" r="24" fill="#0f1530" opacity=".25"/>
  ${skyline}${dome}${blocks}${lights}
  <path d="${d}" fill="none" stroke="#0e1430" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${CELESTE}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  ${stations}${sol}
  <circle cx="${sx}" cy="${sy}" r="15" fill="#fff" stroke="${CELESTE}" stroke-width="6"/>
  <text x="${sx + 26}" y="${sy + 6}" font-family="Bricolage Grotesque" font-size="20" font-weight="800" fill="#fff">Sol</text>`;
}

const metro = {
  bg: '#0b1026', height: 4000, homeAt: .62, snow: false, tint: '#ffb86b', tintMax: .18, marker: [CELESTE, CELESTE], round: true,
  badge: '<span class="badge line">1</span>',
  pts: metroPts,
  seg: metroSeg,
  art: metroArt,
  hudAt: k => STATIONS[k],
  hudMove: k => `→ ${STATIONS[k + 1]}`,
  orient: (dx, dy) => `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`,
  mover: `<rect x="-19" y="-8" width="38" height="16" rx="7" fill="${CELESTE}" stroke="#0e1430" stroke-width="1.5"/><rect x="-13" y="-4.5" width="7" height="6" rx="1.5" fill="#e8f7ff"/><rect x="-3.5" y="-4.5" width="7" height="6" rx="1.5" fill="#e8f7ff"/><rect x="6" y="-4.5" width="7" height="6" rx="1.5" fill="#e8f7ff"/><circle cx="16" cy="0" r="2" fill="#ffe9a8"/>`,
  score: pts => `23:${String(40 + 21 - pts).padStart(2, '0')}`, // more points, earlier arrival at Sol
  text: {
    en: {
      place: 'Madrid', homeTitle: "Today's ride", start: 'Board the train →',
      homeLead: '7 stations on Line 1, from Estrecho to Sol. At each station, one prompt. The rarer your answer, the earlier you arrive.',
      stop: g => `Station ${g} of 7 · ${STATIONS[g]}`, stopShort: g => STATIONS[g],
      next: g => g < 7 ? `Next stop: ${STATIONS[g + 1]} →` : 'Last stop: Sol →',
      finishEyebrow: 'Sol · Kilómetro 0', finishTitle: r => r === 1 ? 'First to arrive at Sol!' : 'You made it to Sol', scoreLabel: 'Arrival',
    },
    es: {
      place: 'Madrid', homeTitle: 'El viaje de hoy', start: 'Subir al tren →',
      homeLead: '7 estaciones de la Línea 1, de Estrecho a Sol. En cada estación, una pregunta. Cuanto más rara tu respuesta, antes llegas.',
      stop: g => `Estación ${g} de 7 · ${STATIONS[g]}`, stopShort: g => STATIONS[g],
      next: g => g < 7 ? `Próxima estación: ${STATIONS[g + 1]} →` : 'Última parada: Sol →',
      finishEyebrow: 'Sol · Kilómetro 0', finishTitle: r => r === 1 ? '¡El primero en llegar a Sol!' : 'Has llegado a Sol', scoreLabel: 'Llegada',
    },
  },
};

export const WORLDS = { alpine, metro };
