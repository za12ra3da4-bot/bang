'use strict';
// 카드 22종 일러스트 + 카드 테두리(갈색/파란색) + 카드 뒷면: 낡은 양피지 위의 서부 목판화 스타일
const { svg, lin, rad, grainFilter, blur, rng, f } = require('./lib');

const INK = '#2b1a0f';
const DEFS = [
  rad('pap', [[0, '#f6e7c4'], [0.65, '#e2c795'], [1, '#b99462']], 0.5, 0.45, 0.75),
  `<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="${INK}" stroke-width="1.3" opacity=".35"/></pattern>`,
  grainFilter('grain', 0.8),
  blur('b4', 4),
  lin('steel', [[0, '#eef2f6'], [0.35, '#aab2bc'], [0.6, '#5a626c'], [1, '#2e343c']]),
  lin('brass', [[0, '#fff1b8'], [0.45, '#d8a93c'], [1, '#6e4a12']]),
  lin('wood', [[0, '#b0703e'], [0.5, '#7a4424'], [1, '#4a2410']], 0, 0, 1, 1),
  lin('blued', [[0, '#8a96a8'], [0.4, '#3a4452'], [1, '#141a22']]),
  rad('vig', [[0.55, '#000', 0], [1, '#3a2410', 0.55]], 0.5, 0.5, 0.72),
].join('');

function sunRays(cx, cy, color, op) {
  let d = '';
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const b = a + Math.PI / 48;
    d += `M${cx} ${cy}L${f(cx + Math.cos(a) * 260)} ${f(cy + Math.sin(a) * 260)}L${f(cx + Math.cos(b) * 260)} ${f(cy + Math.sin(b) * 260)}Z`;
  }
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
}
function burst(cx, cy, n, r1, r2, fill, stroke = INK) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? r2 : r1 * (0.8 + ((i * 37) % 10) / 45);
    pts.push(`${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
}
function suitShape(s, x, y, size, color) {
  const paths = {
    H: 'M0 .38C-.95-.2-.6-.95 0-.42C.6-.95.95-.2 0 .38Z',
    D: 'M0-.6L.44 0L0 .6L-.44 0Z',
    S: 'M0-.62C.95 0 .58.62.1.26L.24.62H-.24L-.1.26C-.58.62-.95 0 0-.62Z',
    C: 'M0-.56A.24.24 0 1 1 .01-.56ZM-.28-.1A.24.24 0 1 1-.27-.1ZM.28-.1A.24.24 0 1 1 .29-.1ZM-.06.1H.06L.2.6H-.2Z',
  };
  if (s === 'C') {
    return `<g transform="translate(${x} ${y}) scale(${size})" fill="${color}"><circle cx="0" cy="-.32" r=".26"/><circle cx="-.3" cy=".08" r=".26"/><circle cx=".3" cy=".08" r=".26"/><path d="M-.07.05H.07L.2.6H-.2Z"/></g>`;
  }
  return `<path d="${paths[s]}" fill="${color}" transform="translate(${x} ${y}) scale(${size})"/>`;
}
const spokes = (cx, cy, r) => Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return `<path d="M${cx} ${cy}L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}" stroke="${INK}" stroke-width="2.5"/>`;
}).join('');

function horse(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${INK}">
    <path d="M-30-8C-26-22-6-26 14-22C26-20 34-14 36-4C38 6 30 12 20 12L-18 12C-30 12-34 2-30-8Z"/>
    <path d="M-24-14L-40-40L-48-38L-56-30L-52-24L-42-26L-30-4Z"/>
    <path d="M-44-40l-2-8 5 5z"/>
    <path d="M-20 8L-40 24L-44 20M-8 10L-12 34M18 10L36 26L40 22M28 6L20 34" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M34-8C48-12 54 0 50 12M-30-30C-24-36-16-34-14-24" stroke="${INK}" stroke-width="4" fill="none"/>
  </g>`;
}
function gunslinger(x, y, s, flip) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" fill="${INK}">
    <path d="M-24-86C-22-96 22-96 24-86L36-84C32-79-32-79-36-84Z"/>
    <path d="M-11-92C-11-106 11-106 11-92Z"/>
    <ellipse cx="0" cy="-73" rx="9" ry="10"/>
    <path d="M-17-62C-8-66 8-66 17-62L21-20L13-18L11 0H3L0-18L-3 0H-11L-13-18L-21-20Z"/>
    <path d="M16-58L30-30L26-26L12-46ZM-16-58L-22-30L-16-28L-12-46Z"/>
    <path d="M26-31h12v5h-12z"/>
    <path d="M-26-12C-40-10-44 0-40 2" stroke="${INK}" stroke-width="3" fill="none"/>
  </g>`;
}
function arrow(x, y, ang, i) {
  return `<g transform="translate(${x} ${y}) rotate(${ang})">
    <path d="M0 0H86" stroke="${INK}" stroke-width="4"/>
    <path d="M86-7L104 0L86 7Z" fill="#6a6a70" stroke="${INK}" stroke-width="2.5"/>
    <path d="M0 0L-16-10H4L10 0L4 10H-16Z" fill="${i % 2 ? '#b3261e' : '#f4efe4'}" stroke="${INK}" stroke-width="2"/>
    <path d="M-8-6L-2 0L-8 6" stroke="${INK}" stroke-width="1.5" fill="none"/>
  </g>`;
}
function pistol({ len, frame, barrel, lever = false, rod = false }) {
  const bx = 100;
  const ox = f((240 - (bx + len)) / 2 - 12);
  return `<g transform="translate(${ox} 14)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <rect x="${bx}" y="58" width="${len}" height="14" rx="2" fill="${barrel}"/>
    <path d="M${bx + len - 7} 58v-6h5v6" fill="${INK}"/>
    ${rod ? `<rect x="${bx + 6}" y="72" width="${f(len * 0.72)}" height="7" rx="3" fill="${barrel}"/><path d="M${bx} 72L${f(bx + len * 0.38)} 72L${bx} 86Z" fill="${barrel}"/>` : ''}
    <path d="M44 56L106 54L106 100L86 104L70 104L60 88L44 84Z" fill="${frame}"/>
    <rect x="68" y="52" width="40" height="38" rx="9" fill="${lever ? frame : '#5a6472'}"/>
    ${lever ? '<path d="M74 70h28" stroke-width="2"/>' : '<path d="M78 54v34M90 52v38" stroke-width="2.5" opacity=".7"/>'}
    <path d="M46 56L32 34L44 30L58 54Z" fill="#2a303a"/>
    <path d="M70 104C70 124 94 130 104 112" fill="none" stroke-width="5"/>
    ${lever ? '<path d="M56 98C42 128 62 150 88 136" fill="none" stroke-width="6"/>' : ''}
    <path d="M48 80L76 96C74 120 78 140 88 160L46 168C30 140 30 104 48 80Z" fill="url(#wood)"/>
    <path d="M48 80L76 96C74 120 78 140 88 160L46 168C30 140 30 104 48 80Z" fill="url(#hatch)" stroke="none"/>
    <path d="M${bx + 4} 62H${bx + len - 8}" stroke="#fff" stroke-width="2" opacity=".55"/>
  </g>`;
}
function rifle({ len, receiver, lever }) {
  return `<g transform="rotate(-12 120 100)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <path d="M6 110L68 90L96 88L96 114L70 118L18 140Z" fill="url(#wood)"/>
    <path d="M6 110L68 90L96 88L96 114L70 118L18 140Z" fill="url(#hatch)" stroke="none"/>
    <rect x="92" y="84" width="42" height="30" rx="4" fill="${receiver}"/>
    <rect x="132" y="86" width="${len}" height="10" rx="2" fill="url(#blued)"/>
    <rect x="132" y="96" width="${f(len * 0.85)}" height="7" rx="3" fill="url(#blued)"/>
    <path d="M134 103L${f(132 + len * 0.5)} 103L${f(132 + len * 0.48)} 113L134 114Z" fill="url(#wood)"/>
    ${lever ? '<path d="M100 114C90 140 116 150 130 126" fill="none" stroke-width="5"/>' : '<path d="M106 114C104 128 120 132 124 120" fill="none" stroke-width="4"/>'}
    <circle cx="112" cy="98" r="3" fill="${INK}"/>
    <path d="M136 89H${f(128 + len)}" stroke="#fff" stroke-width="1.6" opacity=".5"/>
    <circle cx="112" cy="${lever ? 124 : 120}" r="0" />
  </g>`;
}

const SCENE_DEFS = [
  rad('sky', [[0, '#ffeab4'], [0.42, '#efb864'], [1, '#c0783a']], 0.5, 0.4, 0.85),
  lin('dirt', [[0, '#a4652f'], [1, '#6b3c18']]),
  rad('vig2', [[0.5, '#000', 0], [1, '#2a1708', 0.6]], 0.5, 0.48, 0.74),
  `<filter id="mono"><feColorMatrix type="saturate" values="0.06"/><feComponentTransfer><feFuncR type="linear" slope="1.05" intercept="0.02"/><feFuncG type="linear" slope="1.02"/><feFuncB type="linear" slope="0.98"/></feComponentTransfer></filter>`,
].join('');

/** 먼 산 - 그림 뒤쪽 */
const SCENE_BACK = `
  <path d="M0 158L28 132L50 146L76 118L102 142L128 122L156 146L184 124L212 144L240 130V300H0Z" fill="#b9793f" opacity=".42"/>
  <path d="M0 186L34 166L62 182L92 160L124 184L154 164L188 184L216 166L240 180V300H0Z" fill="#8d5526" opacity=".5"/>`;

/** 앞쪽 땅 - 그림 위에 덮여 깊이를 만든다 */
const SCENE_FRONT = `
  <path d="M0 262Q60 250 124 258T240 252V300H0Z" fill="url(#dirt)"/>
  <path d="M0 276Q70 268 132 274T240 270V300H0Z" fill="#5a3014" opacity=".75"/>
  <g fill="#3a1d0a" opacity=".7">
    <ellipse cx="26" cy="284" rx="15" ry="5"/><ellipse cx="206" cy="290" rx="19" ry="6"/>
    <path d="M214 272c0-8 3-13 6-13s6 5 6 13v14h-12z"/>
    <path d="M214 276c-5 0-8-4-8-9s2-6 4-6 4 3 4 8zM226 274c5 0 9-4 9-10s-2-7-4-7-4 4-4 9z"/>
  </g>`;

/**
 * 실제 뱅 카드처럼 그림이 카드 한 면을 가득 채운다 (240×300).
 * mono: 무기 카드는 실제 뱅처럼 흑백 일러스트로 그린다.
 */
const art = (body, { rays = true, bg = 'url(#sky)', extraDefs = '', mono = false, lift = 46 } = {}) => {
  const inner = `
    <rect width="240" height="300" fill="${bg}"/>
    ${rays ? sunRays(120, 120, '#fff3cf', 0.32) : ''}
    ${SCENE_BACK}
    <g transform="translate(0 ${lift})">${body}</g>
    ${SCENE_FRONT}`;
  return svg(240, 300, `
    ${mono ? `<g filter="url(#mono)">${inner}</g>` : inner}
    <rect width="240" height="300" fill="url(#vig2)"/>
    <rect width="240" height="300" filter="url(#grain)" opacity=".2"/>`, { defs: DEFS + SCENE_DEFS + extraDefs });
};

const r1 = rng(3);
const bubbles = Array.from({ length: 12 }, () => `<circle cx="${f(92 + r1() * 56)}" cy="${f(100 + r1() * 66)}" r="${f(1.5 + r1() * 3)}" fill="#fff6d0" opacity=".7"/>`).join('');

const ART = {
  bang: () => art(`
    ${burst(186, 80, 16, 58, 26, '#f2b233')}${burst(186, 80, 12, 36, 16, '#d8452a')}${burst(186, 80, 10, 18, 8, '#fff4c0')}
    <path d="M152 46l-14-12M162 36l-6-18M148 112l-18 10M212 130l10 16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    ${pistol({ len: 62, frame: 'url(#blued)', barrel: 'url(#blued)' }).replace('translate(', 'translate(-6 4) translate(')}`),

  missed: () => art(`
    <path d="M6 106L136 80M142 78L230 58" stroke="${INK}" stroke-width="2.5" stroke-dasharray="7 6"/>
    <g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">
      <path d="M62 116C58 66 86 50 120 58C154 50 182 66 178 116Z" fill="#9a6436"/>
      <path d="M120 60C112 76 110 96 114 112" fill="none" opacity=".6"/>
      <path d="M64 100C92 110 148 110 176 100L178 116C150 126 90 126 62 116Z" fill="#3a2416"/>
      <path d="M14 122C34 100 92 118 120 118C148 118 206 100 226 122C206 144 150 146 120 146C90 146 34 144 14 122Z" fill="#865228"/>
    </g>
    <path d="M30 124C60 134 180 134 210 124" stroke="#f0c898" stroke-width="2" opacity=".5" fill="none"/>
    <circle cx="138" cy="80" r="7" fill="#140a04" stroke="${INK}" stroke-width="2"/>
    <path d="M138 80l-10-10M138 80l12-8M138 80l4 13M138 80l-12 6" stroke="${INK}" stroke-width="1.6"/>
    <g transform="translate(216 60) rotate(-12)"><path d="M-14-6H4C12-6 16 0 16 0C16 0 12 6 4 6H-14Z" fill="url(#brass)" stroke="${INK}" stroke-width="2.5"/></g>
    <path d="M160 140c10 10 30 12 44 4" stroke="${INK}" stroke-width="2" fill="none" stroke-dasharray="3 4"/>`),

  beer: () => art(`
    <g stroke="${INK}" stroke-width="3.4" stroke-linejoin="round">
      <path d="M160 82C204 82 204 150 156 148" fill="none" stroke-width="15"/>
      <path d="M160 82C204 82 204 150 156 148" fill="none" stroke="#d08a2a" stroke-width="7"/>
      <path d="M66 62L164 62L156 172C154 180 78 180 76 172Z" fill="url(#ale)"/>
      <path d="M58 66C52 44 76 34 90 44C98 28 124 28 134 40C148 30 174 38 172 58C186 64 176 84 162 78L70 78C56 82 48 72 58 66Z" fill="#fffaec"/>
      <path d="M76 78C78 94 84 98 88 90C90 84 92 80 94 78" fill="#fffaec"/>
    </g>
    <path d="M86 96V160" stroke="#fff" stroke-width="7" opacity=".3" stroke-linecap="round"/>
    <path d="M142 96V160" stroke="#fff" stroke-width="3" opacity=".22" stroke-linecap="round"/>
    ${bubbles}`, { extraDefs: lin('ale', [[0, '#f6c04a'], [0.6, '#d8861e'], [1, '#8a4a0e']]) }),

  panic: () => art(`
    <path d="M30 60h28M22 80h30M34 100h20" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">
      <path d="M118 78C78 78 58 116 62 144C66 176 172 176 176 144C180 116 160 78 118 78Z" fill="#c49a62"/>
      <path d="M100 80C104 68 132 68 136 80L130 86H106Z" fill="#a87a44"/>
      <path d="M96 84C110 90 126 90 140 84" fill="none" stroke-width="4"/>
    </g>
    <path d="M78 118C84 140 96 156 110 164" stroke="#fff" stroke-width="4" opacity=".25" fill="none" stroke-linecap="round"/>
    <text x="118" y="152" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700" fill="${INK}">$</text>
    <g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">
      <path d="M244 -4L244 40L178 94L150 64Z" fill="#5a3a26"/>
      <path d="M154 60C136 56 112 62 104 72C100 78 106 84 114 82L134 78C128 86 130 94 138 94C142 104 152 104 156 98C164 102 172 96 172 88Z" fill="#8a5a36"/>
      <path d="M114 82C118 86 128 86 134 78M138 94L146 84M156 98L160 86" fill="none" stroke-width="2.5"/>
    </g>`),

  catbalou: () => art(`
    <path d="M26 176C60 150 90 80 150 60C184 50 206 58 222 40" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M26 176C60 150 90 80 150 60C184 50 206 58 222 40" stroke="#7a4a22" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <rect x="8" y="166" width="36" height="13" rx="5" fill="#3a2416" stroke="${INK}" stroke-width="3" transform="rotate(-36 26 172)"/>
    ${burst(224, 38, 10, 18, 7, '#fff1b0')}
    ${[[74, 46, -24, 'S'], [124, 124, 18, 'H'], [182, 122, -10, 'C'], [58, 116, 30, 'D']].map(([x, y, r, s], i) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-17" y="-24" width="34" height="48" rx="4" fill="#fbf4e2" stroke="${INK}" stroke-width="2.6"/>${suitShape(s, 0, 0, 22, s === 'H' || s === 'D' ? '#b3261e' : INK)}</g><path d="M${x - 30} ${y + 10}h-14M${x - 30} ${y + 18}h-8" stroke="${INK}" stroke-width="2"/>`).join('')}`),

  stagecoach: () => art(`
    <path d="M0 170H240" stroke="${INK}" stroke-width="3"/>
    <circle cx="222" cy="150" r="16" fill="#e8d0a0" opacity=".8"/><circle cx="234" cy="130" r="11" fill="#e8d0a0" opacity=".7"/><circle cx="206" cy="162" r="10" fill="#e8d0a0" opacity=".8"/>
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M112 64H202V128H106Z" fill="#8a3a22"/>
      <rect x="124" y="76" width="30" height="24" fill="#f2d68a"/><rect x="164" y="76" width="28" height="24" fill="#f2d68a"/>
      <path d="M116 56H198L202 64H112Z" fill="#5a2414"/>
      <rect x="126" y="42" width="54" height="14" fill="#6a4a2a"/><path d="M136 42v14M160 42v14" stroke-width="2"/>
      <path d="M96 102H112V128H90Z" fill="#5a2414"/>
      <path d="M140 108h40" stroke="#f2d68a" stroke-width="3"/>
      <circle cx="130" cy="148" r="22" fill="none" stroke-width="5"/><circle cx="188" cy="146" r="24" fill="none" stroke-width="5"/>
      ${spokes(130, 148, 22)}${spokes(188, 146, 24)}
      <path d="M94 106L42 118" stroke-width="2"/>
    </g>
    ${horse(62, 120, 0.92)}${horse(30, 132, 0.82)}`),

  wellsfargo: () => art(`
    <circle cx="128" cy="78" r="70" fill="#ffe7a0" opacity=".6"/>
    <g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">
      <path d="M58 88L96 40H212L172 88Z" fill="#6a4226"/>
      <path d="M50 94H176V170H50Z" fill="#7a4a2a"/>
      <path d="M176 94L208 62V138L176 170Z" fill="#5a3418"/>
      <path d="M50 94L82 62H208L176 94Z" fill="#2a1408"/>
      ${[[92, 72], [124, 70], [156, 72], [108, 82], [140, 82]].map(([x, y]) => `<path d="M${x} ${y}h26l-4 10h-18z" fill="url(#brass)" stroke-width="2"/>`).join('')}
      <rect x="72" y="94" width="10" height="76" fill="url(#steel)"/><rect x="146" y="94" width="10" height="76" fill="url(#steel)"/>
      <rect x="102" y="118" width="24" height="28" rx="3" fill="url(#brass)"/><circle cx="114" cy="130" r="3" fill="${INK}"/>
    </g>
    ${[[42, 176], [196, 176], [212, 168], [30, 166]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="12" ry="5" fill="url(#brass)" stroke="${INK}" stroke-width="2"/>`).join('')}
    ${burst(84, 60, 6, 12, 4, '#fff8d0', '#d8a93c')}${burst(170, 50, 6, 10, 3, '#fff8d0', '#d8a93c')}`),

  gatling: () => art(`
    <path d="M0 176H240" stroke="${INK}" stroke-width="3"/>
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M58 152L108 98L122 108L76 166Z" fill="url(#wood)"/>
      <g transform="rotate(-16 120 100)">
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="110" y="${84 + i * 6}" width="112" height="6" fill="${i % 2 ? '#3a4452' : '#5a6472'}"/>`).join('')}
        <rect x="104" y="80" width="18" height="40" rx="3" fill="url(#brass)"/>
        <rect x="170" y="80" width="10" height="40" rx="2" fill="url(#brass)"/>
        <rect x="218" y="80" width="10" height="40" rx="2" fill="#2a303a"/>
        <rect x="72" y="78" width="34" height="44" rx="4" fill="url(#blued)"/>
        <path d="M72 94H54V112" fill="none" stroke-width="4"/><circle cx="52" cy="114" r="5" fill="url(#brass)"/>
      </g>
      <circle cx="96" cy="150" r="30" fill="none" stroke-width="6"/>${spokes(96, 150, 30)}<circle cx="96" cy="150" r="6" fill="url(#brass)"/>
    </g>
    ${burst(228, 56, 12, 22, 9, '#f2b233')}${burst(228, 56, 8, 11, 4, '#fff4c0')}`),

  indians: () => art(`
    <path d="M0 158C60 148 180 152 240 144V190H0Z" fill="#c9a26a" stroke="${INK}" stroke-width="3"/>
    ${[[30, 20, 58], [92, 8, 66], [150, 22, 56], [196, 6, 64], [60, 70, 52], [170, 76, 58]].map(([x, y, a], i) => arrow(x, y, a, i)).join('')}
    <path d="M40 176l8-6M120 174l10-8M190 172l8-6" stroke="${INK}" stroke-width="2"/>`),

  duel: () => art(`
    <circle cx="120" cy="146" r="58" fill="#ffd66a"/>
    <path d="M0 144H240V190H0Z" fill="#5a2a14"/>
    <path d="M0 144H240" stroke="${INK}" stroke-width="3"/>
    <path d="M52 150L110 186M188 150L130 186" stroke="#1e0a04" stroke-width="12" opacity=".45"/>
    ${gunslinger(48, 144, 1.05, false)}${gunslinger(192, 144, 1.05, true)}
    <circle cx="120" cy="164" r="9" fill="none" stroke="#c9a26a" stroke-width="2"/><path d="M112 160c6 6 12 2 16 8M114 170c4-8 10-6 14-2" stroke="#c9a26a" stroke-width="1.5" fill="none"/>`,
  { rays: false, bg: 'url(#sunset)', extraDefs: lin('sunset', [[0, '#f8dc8a'], [0.55, '#e8843a'], [1, '#8a2a1a']]) }),

  store: () => art(`
    <path d="M0 176H240" stroke="${INK}" stroke-width="3"/>
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M36 176V42H70V28H170V42H204V176Z" fill="#a8744a"/>
      ${[60, 80, 100, 120, 140, 160].map((y) => `<path d="M38 ${y + 16}H202" stroke-width="1.2" opacity=".35"/>`).join('')}
      <rect x="56" y="46" width="128" height="26" fill="#f0e2c0"/>
      <path d="M34 98H206L196 116H44Z" fill="#f4efe4"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${40 + i * 34} 98H${57 + i * 34}L${54 + i * 34} 116H${46 + i * 34}Z" fill="#b3261e" stroke="none"/>`).join('')}
      <rect x="50" y="122" width="44" height="38" fill="#f2d68a"/><rect x="146" y="122" width="44" height="38" fill="#f2d68a"/>
      <rect x="104" y="120" width="32" height="56" fill="#5a3418"/><circle cx="130" cy="150" r="2.5" fill="url(#brass)"/>
      <rect x="4" y="148" width="28" height="28" fill="#8a5a2a"/><path d="M4 148l28 28M32 148l-28 28" stroke-width="2"/>
      <path d="M208 140C204 150 204 168 208 176H232C236 168 236 150 232 140Z" fill="url(#wood)"/>
    </g>
    <g fill="${INK}" opacity=".75"><rect x="56" y="140" width="7" height="16"/><rect x="66" y="134" width="6" height="22"/><path d="M76 156c0-12 12-12 12 0z"/><rect x="152" y="140" width="10" height="16"/><path d="M166 156c0-14 16-14 16 0z"/></g>
    <text x="120" y="65" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" font-weight="700" letter-spacing="2" fill="${INK}">GENERAL STORE</text>`),

  saloon: () => art(`
    <rect x="50" y="30" width="140" height="160" fill="#ffd98a"/>
    <circle cx="120" cy="100" r="80" fill="#fff0c0" opacity=".7"/>
    <g fill="${INK}" opacity=".55"><rect x="64" y="52" width="112" height="4"/><rect x="70" y="36" width="8" height="16"/><rect x="84" y="40" width="7" height="12"/><rect x="150" y="36" width="8" height="16"/><rect x="164" y="42" width="6" height="10"/></g>
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      <path d="M28 190V20H212V190H192V40H48V190Z" fill="#6a3a1e"/>
      <rect x="38" y="4" width="164" height="22" fill="#3a2010"/>
      <path d="M52 84C68 72 100 72 118 84V152C100 160 68 160 52 152Z" fill="#a8683a"/>
      <path d="M190 86C174 76 146 76 128 88V154C146 162 174 162 190 154Z" fill="#96582e"/>
      ${[64, 80, 96, 110].map((x) => `<path d="M${x} ${x === 64 ? 80 : 78}V154" stroke-width="2"/>`).join('')}
      ${[140, 156, 172].map((x) => `<path d="M${x} 82V156" stroke-width="2"/>`).join('')}
      <path d="M52 110H118M128 112H190" stroke-width="2.5"/>
    </g>
    <text x="120" y="21" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="15" font-weight="700" letter-spacing="4" fill="#f2d68a">SALOON</text>`, { rays: false }),

  barrel: () => art(`
    <ellipse cx="120" cy="176" rx="64" ry="10" fill="${INK}" opacity=".3"/>
    <g stroke="${INK}" stroke-width="3.2" stroke-linejoin="round">
      <path d="M78 32C64 72 64 132 78 172H162C176 132 176 72 162 32Z" fill="url(#wood)"/>
      ${[92, 106, 120, 134, 148].map((x) => `<path d="M${x} 34C${x - (120 - x) * 0.25} 80 ${x - (120 - x) * 0.25} 124 ${x} 170" fill="none" stroke-width="1.8" opacity=".6"/>`).join('')}
      <ellipse cx="120" cy="32" rx="42" ry="10" fill="#9a6a3a"/>
      <path d="M72 60C100 68 140 68 168 60M70 144C100 152 140 152 170 144" stroke="#3a3a40" stroke-width="10" fill="none"/>
    </g>
    <path d="M72 60C100 68 140 68 168 60M70 144C100 152 140 152 170 144" stroke="#9aa2ac" stroke-width="3" fill="none"/>
    ${[[104, 100], [142, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#3a2410" stroke="${INK}" stroke-width="2"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#d8a93c"/>`).join('')}
    <path d="M90 50V150" stroke="#fff" stroke-width="5" opacity=".15"/>`),

  scope: () => art(`
    <g transform="rotate(-18 170 124)" stroke="${INK}" stroke-width="3">
      <path d="M118 110L222 114V134L118 138Z" fill="url(#brass)"/>
      <rect x="200" y="104" width="26" height="38" rx="4" fill="url(#brass)"/>
      <rect x="106" y="104" width="18" height="38" rx="4" fill="#3a2a10"/>
      <path d="M126 116H214" stroke="#fff" stroke-width="2" opacity=".6"/>
    </g>
    <circle cx="84" cy="94" r="64" fill="#fff8e6" stroke="${INK}" stroke-width="7"/>
    <circle cx="84" cy="94" r="44" fill="none" stroke="${INK}" stroke-width="2"/>
    <path d="M84 30V158M20 94H148" stroke="${INK}" stroke-width="2.5"/>
    ${[-30, -15, 15, 30].map((d) => `<path d="M${84 + d} 90v8M80 ${94 + d}h8" stroke="${INK}" stroke-width="2"/>`).join('')}
    <circle cx="84" cy="94" r="6" fill="none" stroke="#b3261e" stroke-width="3"/>
    <path d="M40 60a54 54 0 0 1 30-22" stroke="#fff" stroke-width="5" opacity=".6" fill="none" stroke-linecap="round"/>`),

  mustang: () => art(`
    <path d="M104 38C130 40 158 60 172 92C184 118 190 152 188 192" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M168 192C170 150 160 116 148 92C136 66 118 46 96 40C80 36 60 40 48 50C36 58 30 72 38 80C44 86 58 84 70 82C80 96 92 110 98 132C104 156 100 176 96 192Z" fill="url(#coat)" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M96 42L88 16L110 36Z" fill="#7a4424" stroke="${INK}" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${120 + i * 11} ${46 + i * 22}c14 4 22 14 24 26" stroke="#5a3a26" stroke-width="3" fill="none"/>`).join('')}
    <circle cx="84" cy="56" r="4.5" fill="${INK}"/><circle cx="85" cy="55" r="1.4" fill="#fff"/>
    <ellipse cx="46" cy="72" rx="4" ry="3" fill="${INK}"/>
    <path d="M58 48L100 70L70 84M100 70L128 64" stroke="#b3261e" stroke-width="3.5" fill="none"/>
    <circle cx="100" cy="70" r="4" fill="url(#brass)" stroke="${INK}" stroke-width="1.5"/>
    <path d="M112 84C124 110 132 140 132 180" stroke="#fff" stroke-width="6" opacity=".15" fill="none" stroke-linecap="round"/>`, { extraDefs: lin('coat', [[0, '#9a5a2e'], [1, '#5a2e14']], 0, 0, 1, 1) }),

  jail: () => art(`
    <rect x="18" y="14" width="204" height="166" fill="#2a1e18" stroke="${INK}" stroke-width="5"/>
    <rect x="28" y="24" width="184" height="146" fill="#1a2440"/>
    <circle cx="160" cy="62" r="18" fill="#f4ecd0"/><circle cx="160" cy="62" r="34" fill="#f4ecd0" opacity=".15"/>
    ${[48, 84, 120, 156, 192].map((x) => `<rect x="${x - 6}" y="20" width="12" height="154" fill="url(#steel)" stroke="${INK}" stroke-width="2.5"/>`).join('')}
    <rect x="24" y="56" width="192" height="10" fill="url(#steel)" stroke="${INK}" stroke-width="2.5"/>
    <rect x="24" y="136" width="192" height="10" fill="url(#steel)" stroke="${INK}" stroke-width="2.5"/>
    <path d="M110 132V118a14 14 0 0 1 28 0V132" stroke="${INK}" stroke-width="6" fill="none"/>
    <path d="M110 132V118a14 14 0 0 1 28 0V132" stroke="#9aa2ac" stroke-width="3" fill="none"/>
    <rect x="102" y="130" width="44" height="36" rx="5" fill="url(#brass)" stroke="${INK}" stroke-width="3"/>
    <circle cx="124" cy="144" r="5" fill="${INK}"/><path d="M122 146h4v10h-4z" fill="${INK}"/>`, { rays: false }),

  dynamite: () => art(`
    <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
      ${[0, 1, 2].map((i) => `<rect x="${60 + i * 32}" y="72" width="34" height="104" rx="9" fill="${i === 1 ? '#a8261e' : '#c8322a'}"/><path d="M${66 + i * 32} 80V168" stroke="#fff" stroke-width="3" opacity=".25"/>`).join('')}
      <path d="M54 112H162M54 138H162" stroke="#c9a26a" stroke-width="10"/>
      <path d="M110 72C110 40 136 30 156 42C172 52 180 34 184 24" fill="none" stroke-width="4"/>
    </g>
    <path d="M54 107H162M54 117H162M54 133H162M54 143H162" stroke="${INK}" stroke-width="1.2"/>
    ${burst(186, 22, 12, 22, 8, '#f2b233')}${burst(186, 22, 8, 11, 4, '#fff4c0')}
    <text x="126" y="160" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="14" fill="#f4e6c8" transform="rotate(-90 126 160)">TNT</text>`),

  volcanic: () => art(pistol({ len: 58, frame: 'url(#brass)', barrel: 'url(#blued)', lever: true }), { mono: true }),
  schofield: () => art(pistol({ len: 76, frame: 'url(#steel)', barrel: 'url(#steel)' }), { mono: true }),
  remington: () => art(pistol({ len: 96, frame: 'url(#blued)', barrel: 'url(#blued)', rod: true }), { mono: true }),
  carabine: () => art(rifle({ len: 78, receiver: 'url(#blued)', lever: false }), { mono: true }),
  winchester: () => art(rifle({ len: 104, receiver: 'url(#brass)', lever: true }), { mono: true }),
};

function frame(kind) {
  const blue = kind === 'blue';
  const c = blue ? ['#2f6d9a', '#0d2a45', '#9ccaf0'] : ['#8a5228', '#3a2210', '#f0c080'];
  const r = rng(blue ? 11 : 7);
  const scuff = Array.from({ length: 7 }, () => `<ellipse cx="${f(12 + r() * 226)}" cy="${f(12 + r() * 326)}" rx="${f(8 + r() * 26)}" ry="${f(4 + r() * 12)}" fill="#000" opacity=".06"/>`).join('');
  return svg(250, 350, `
    <rect width="250" height="350" rx="14" fill="url(#edge)"/>
    ${scuff}
    <rect width="250" height="350" rx="14" fill="#000" filter="url(#grain)" opacity=".16"/>
    <rect x="3.5" y="3.5" width="243" height="343" rx="12" fill="none" stroke="${c[2]}" stroke-opacity=".4" stroke-width="1.5"/>
    <rect x="9" y="9" width="232" height="332" rx="9" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1"/>
    <!-- 그림 자리 (위에 실제 그림이 덮인다) -->
    <rect x="15" y="15" width="220" height="255" fill="#1a0e05"/>
    <rect x="15" y="15" width="220" height="255" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <!-- 이름 명판 -->
    <rect x="15" y="276" width="220" height="44" rx="4" fill="url(#plate)" stroke="${INK}" stroke-width="2"/>
    <path d="M22 281H228M22 315H228" stroke="${c[2]}" stroke-opacity=".35" stroke-width="1"/>
    <!-- 아래쪽 장식 못 -->
    ${[[24, 332], [226, 332]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="url(#brass)" stroke="${INK}" stroke-width="1.2"/>`).join('')}`, {
    defs: DEFS + lin('edge', [[0, c[0]], [0.55, c[1]], [1, c[0]]], 0, 0, 1, 1) + lin('plate', [[0, c[0]], [1, c[1]]]),
  });
}

/**
 * 갈색 카드에만 있는 총알 구멍. 그림 위에 겹쳐 올려서 카드를 뚫고 지나간 것처럼 보이게 한다.
 * (실제 뱅에서 파란 테두리 카드는 총알 구멍이 없다)
 */
function bulletHoles() {
  const r = rng(29);
  const spots = [[27, 63], [223, 121], [21, 214], [229, 247], [46, 300], [204, 41]];
  const body = spots.map(([x, y]) => {
    const rot = f(r() * 360);
    const rr = f(4.4 + r() * 1.8);
    return `<g transform="translate(${x} ${y}) rotate(${rot})">
      <ellipse rx="${f(rr + 3.4)}" ry="${f(rr + 2.6)}" fill="#000" opacity=".28"/>
      <ellipse rx="${rr}" ry="${f(rr * 0.86)}" fill="#0d0603"/>
      <path d="M${f(-rr - 2)} 0A${f(rr + 2)} ${f(rr + 1.6)} 0 0 1 ${f(rr + 2)} 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.3"/>
      ${Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + r();
    const d = rr + 1.5 + r() * 3.5;
    return `<path d="M${f(Math.cos(a) * rr * 0.8)} ${f(Math.sin(a) * rr * 0.8)}L${f(Math.cos(a) * d)} ${f(Math.sin(a) * d)}" stroke="#0d0603" stroke-width="1.4" stroke-linecap="round" opacity=".75"/>`;
  }).join('')}
    </g>`;
  }).join('');
  return svg(250, 350, body);
}

function cardBack() {
  const r = rng(21);
  const holes = Array.from({ length: 5 }, () => [f(40 + r() * 170), f(70 + r() * 220)]);
  return svg(250, 350, `
    <rect width="250" height="350" rx="14" fill="url(#leather)"/>
    <rect width="250" height="350" rx="14" fill="#000" filter="url(#grain)" opacity=".3"/>
    ${sunRays(125, 175, '#f0c080', 0.08)}
    <rect x="10" y="10" width="230" height="330" rx="9" fill="none" stroke="#e0b070" stroke-width="3"/>
    <rect x="18" y="18" width="214" height="314" rx="6" fill="none" stroke="#e0b070" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="6 4"/>
    <circle cx="125" cy="160" r="64" fill="#2a1408" stroke="#e0b070" stroke-width="4"/>
    ${Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${f(125 + Math.cos(a) * 36)}" cy="${f(160 + Math.sin(a) * 36)}" r="13" fill="#140a04" stroke="#b8864a" stroke-width="3"/>`; }).join('')}
    <circle cx="125" cy="160" r="8" fill="#b8864a"/>
    <text x="125" y="270" text-anchor="middle" font-family="Impact, 'Arial Black', Georgia, sans-serif" font-size="54" letter-spacing="2" fill="#c8322a" stroke="#140a04" stroke-width="3" paint-order="stroke">BANG!</text>
    ${holes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#050201"/>`).join('')}`, {
    defs: DEFS + rad('leather', [[0, '#7a3a1a'], [0.7, '#3e1a0a'], [1, '#1e0a04']], 0.5, 0.45, 0.75),
  });
}

module.exports = { ART, frame, bulletHoles, cardBack, suitShape, burst, sunRays, INK, DEFS, art };
