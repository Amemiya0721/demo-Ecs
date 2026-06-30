/* ---------- SVG line art ---------- */
const BIKE = `
<svg class="svg-art" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="10" y="10" width="220" height="140" rx="14" fill="#F7F9FC" stroke="#D8E0EC" stroke-width="2"/>
  <rect x="18" y="18" width="44" height="20" rx="10" fill="#EAF0FF"/>
  <text x="40" y="32" text-anchor="middle" font-size="10" font-weight="800" fill="#1F4FD1"
        font-family="Arial, 'Noto Sans JP', sans-serif">USED</text>
  <rect x="172" y="18" width="50" height="20" rx="10" fill="#FFF0A8"/>
  <text x="197" y="32" text-anchor="middle" font-size="10" font-weight="800" fill="#222"
        font-family="Arial, 'Noto Sans JP', sans-serif">ROAD</text>

  <g stroke="#314255" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="72" cy="108" r="28"/>
    <circle cx="168" cy="108" r="28"/>
    <path d="M72 108 L108 108 L134 70 L162 108"/>
    <path d="M108 108 L126 70 L134 70"/>
    <path d="M126 70 L116 56 L98 56"/>
    <path d="M162 108 L162 72 L150 72"/>
    <path d="M98 56 L90 52"/>
    <path d="M134 70 L142 62"/>
  </g>

  <rect x="18" y="124" width="204" height="18" rx="9" fill="#EEF3FB"/>
  <text x="120" y="137" text-anchor="middle" font-size="10" font-weight="700" fill="#617083"
        font-family="Arial, 'Noto Sans JP', sans-serif">
    中古在庫イメージ / 実車写真準備中
  </text>
</svg>`;

const MOTO = `
<svg class="svg-art" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="10" y="10" width="220" height="140" rx="14" fill="#F7F9FC" stroke="#D8E0EC" stroke-width="2"/>
  <rect x="18" y="18" width="44" height="20" rx="10" fill="#EAF0FF"/>
  <text x="40" y="32" text-anchor="middle" font-size="10" font-weight="800" fill="#1F4FD1"
        font-family="Arial, 'Noto Sans JP', sans-serif">USED</text>
  <rect x="172" y="18" width="50" height="20" rx="10" fill="#FFF0A8"/>
  <text x="197" y="32" text-anchor="middle" font-size="10" font-weight="800" fill="#222"
        font-family="Arial, 'Noto Sans JP', sans-serif">MOTO</text>

  <g stroke="#314255" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="70" cy="110" r="24"/>
    <circle cx="170" cy="110" r="24"/>
    <path d="M70 110 L98 86 L142 86 L170 110"/>
    <path d="M92 86 Q104 58 134 64 L154 66 Q170 68 170 84"/>
    <path d="M142 86 L154 66"/>
    <path d="M98 86 L88 72 L74 72"/>
    <path d="M154 66 L172 62"/>
  </g>

  <rect x="18" y="124" width="204" height="18" rx="9" fill="#EEF3FB"/>
  <text x="120" y="137" text-anchor="middle" font-size="10" font-weight="700" fill="#617083"
        font-family="Arial, 'Noto Sans JP', sans-serif">
    中古在庫イメージ / 実車写真準備中
  </text>
</svg>`;

const art = t => t === 'バイク' ? MOTO : BIKE;

/* ---------- inventory ---------- */
const items = [
  {
    id: 1, type: '自転車', title: 'Specialized Allez Sprint', year: '2021年式', price: 168000, spec: '54 / Sram Rival', grade: 'S', photos: 9,
    state: '実走わずか。チェーン・バーテープ新品。',
    facts: [['カテゴリ', 'ロードバイク'], ['サイズ', '54 (実測)'], ['コンポ', 'Rival eTap']],
    karte: [['フレーム', 'S', 96, '打痕・クラックなし'], ['駆動系', 'A', 88, '変速良好・要グリス'], ['ホイール', 'A', 90, '振れなし'], ['消耗品', 'S', 98, '新品交換済み'], ['外観', 'A', 85, '微小なスレ数点']],
    desc: ['前オーナー使用1シーズン、屋内保管。', 'チェーン／バーテープ／ブレーキパッドは入庫時に新品交換。', 'フレームは全面点検済み、クラック・打痕なし。', 'ペダルは付属しません。'],
    ship: [['配送', '専用車体梱包'], ['送料', '¥3,800〜'], ['発送', '入金確認後2〜4営業日']], shipNote: '北海道・沖縄・離島は別途見積。整備記録を同梱します。', overall: 93
  },
  {
    id: 2, type: 'バイク', title: 'Honda CB400 Super Four', year: '2016年式', price: 198000, spec: '400cc / 21,400km', grade: 'A', photos: 12,
    state: '機関好調。タイヤ前後8分山。',
    facts: [['排気量', '399cc'], ['走行', '21,400km'], ['車検', '残あり']],
    karte: [['エンジン', 'A', 90, '始動良好・異音なし'], ['駆動系', 'A', 86, 'チェーン調整済'], ['足回り', 'B', 74, 'Fフォーク要観察'], ['消耗品', 'A', 88, 'タイヤ8分山'], ['外観', 'B', 76, '右に立ちゴケ跡']],
    desc: ['実働車。エンジン始動・吹け上がり良好。', '右ステップ・レバーに立ちゴケ跡あり（写真参照）。', 'オイル・プラグは納車前に交換します。', '名義変更・登録は代行可能。'],
    ship: [['引き渡し', '店頭 / 陸送'], ['陸送費', '¥15,000〜（地域別）'], ['名義変更', '代行 ¥11,000']], shipNote: '陸送は提携業者の見積を別途ご案内します。', overall: 83
  },
  {
    id: 3, type: '自転車', title: 'Cannondale CAAD13', year: '2020年式', price: 124000, spec: '56 / 105 R7000', grade: 'A', photos: 8,
    state: '定番アルミ。BB異音なし。',
    facts: [['カテゴリ', 'ロードバイク'], ['サイズ', '56'], ['コンポ', 'Shimano 105']],
    karte: [['フレーム', 'A', 89, '目立つ傷なし'], ['駆動系', 'A', 87, '105 11速良好'], ['ホイール', 'B', 78, '軽微な振れ調整済'], ['消耗品', 'B', 75, 'タイヤ5分山'], ['外観', 'A', 84, '通常使用感']],
    desc: ['通勤＋週末ライドで使用、走行距離控えめ。', 'BB・ヘッド異音なし、回転良好。', 'タイヤは残り5分山、近く交換推奨。', 'スタンドは付属しません。'],
    ship: [['配送', '専用車体梱包'], ['送料', '¥3,800〜'], ['発送', '入金確認後2〜4営業日']], shipNote: '北海道・沖縄・離島は別途見積。', overall: 83
  },
  {
    id: 4, type: 'バイク', title: 'Yamaha SR400 Final', year: '2021年式', price: 189000, spec: '400cc / 6,800km', grade: 'S', photos: 14,
    state: '低走行・極上。ノーマル車。',
    facts: [['排気量', '399cc'], ['走行', '6,800km'], ['車検', 'なし(車検なし車)']],
    karte: [['エンジン', 'S', 95, 'キック一発始動'], ['駆動系', 'S', 94, '全体に良好'], ['足回り', 'A', 88, 'サビ・ガタなし'], ['消耗品', 'A', 90, 'タイヤ山十分'], ['外観', 'S', 93, '目立つ傷なし']],
    desc: ['ファイナルエディション、低走行の上物。', 'カスタムなしのフルノーマル。', '屋内保管・転倒歴なし。', '納車前にオイル・各部点検を実施します。'],
    ship: [['引き渡し', '店頭 / 陸送'], ['陸送費', '¥15,000〜（地域別）'], ['名義変更', '代行 ¥11,000']], shipNote: '人気車種につき在庫変動が早い点ご了承ください。', overall: 92
  },
  {
    id: 5, type: '自転車', title: 'Trek Émonda SL5', year: '2019年式', price: 142000, spec: '52 / 105', grade: 'B', photos: 7,
    state: '軽量カーボン。下ハンに小傷。',
    facts: [['カテゴリ', 'カーボンロード'], ['サイズ', '52'], ['コンポ', 'Shimano 105']],
    karte: [['フレーム', 'B', 79, '下ハンに擦り傷'], ['駆動系', 'B', 77, '変速調整済'], ['ホイール', 'B', 76, '振れ取り済'], ['消耗品', 'C', 68, 'チェーン交換推奨'], ['外観', 'B', 74, '使用感あり']],
    desc: ['カーボンフレームの軽量モデル。', '落車歴なし、フレームの構造的損傷なし。', '下ハンドルに擦り傷あり（走行に支障なし）。', 'チェーンは伸び気味、交換を推奨します。'],
    ship: [['配送', '専用車体梱包'], ['送料', '¥3,800〜'], ['発送', '入金確認後2〜4営業日']], shipNote: 'カーボン車体は梱包に特に注意して発送します。', overall: 75
  },
  {
    id: 6, type: 'バイク', title: 'Kawasaki Estrella', year: '2015年式', price: 158000, spec: '250cc / 18,200km', grade: 'A', photos: 10,
    state: '空冷シングル。外装きれい。',
    facts: [['排気量', '249cc'], ['走行', '18,200km'], ['車検', '不要(軽二輪)']],
    karte: [['エンジン', 'A', 88, '安定したアイドリング'], ['駆動系', 'A', 85, 'チェーン・スプロケ良'], ['足回り', 'A', 86, 'サビ少'], ['消耗品', 'B', 78, 'バッテリー近く交換'], ['外観', 'A', 87, '外装良好']],
    desc: ['クラシックスタイルの空冷単気筒。', '外装・メッキの状態良好。', 'バッテリーはやや弱り、近く交換推奨。', 'ETC装着済み。'],
    ship: [['引き渡し', '店頭 / 陸送'], ['陸送費', '¥12,000〜（地域別）'], ['名義変更', '代行 ¥11,000']], shipNote: '軽二輪のため車検は不要です。', overall: 84
  },
  {
    id: 7, type: '自転車', title: 'GIANT TCR Advanced', year: '2022年式', price: 176000, spec: 'M / Ultegra', grade: 'S', photos: 11,
    state: '上位グレード。アルテグラ完成車。',
    facts: [['カテゴリ', 'カーボンロード'], ['サイズ', 'M (適応170-180)'], ['コンポ', 'Ultegra R8000']],
    karte: [['フレーム', 'S', 95, '極上'], ['駆動系', 'S', 93, 'アルテグラ良好'], ['ホイール', 'A', 89, '振れなし'], ['消耗品', 'A', 88, 'タイヤ山十分'], ['外観', 'S', 92, '目立つ傷なし']],
    desc: ['人気のTCR、上位コンポ完成車。', '屋内保管・落車歴なし。', '各部点検済み、すぐに走り出せる状態。', 'ペダル別売。'],
    ship: [['配送', '専用車体梱包'], ['送料', '¥3,800〜'], ['発送', '入金確認後2〜4営業日']], shipNote: '北海道・沖縄・離島は別途見積。', overall: 91
  },
  {
    id: 8, type: 'バイク', title: 'Suzuki ST250 E-Type', year: '2014年式', price: 128000, spec: '250cc / 24,600km', grade: 'B', photos: 9,
    state: '扱いやすい単気筒。タンク小錆。',
    facts: [['排気量', '249cc'], ['走行', '24,600km'], ['車検', '不要(軽二輪)']],
    karte: [['エンジン', 'A', 85, '始動・吹け良好'], ['駆動系', 'B', 76, 'チェーン要調整'], ['足回り', 'B', 74, 'Rサス軽微なオイル滲み'], ['消耗品', 'B', 72, 'タイヤ4分山'], ['外観', 'C', 66, 'タンク内に小錆']],
    desc: ['軽量で取り回しの良い単気筒。', 'タンク内に小錆あり、コーティング推奨。', 'リアサスに軽微なオイル滲み（要観察）。', '初めての一台にも扱いやすい車格。'],
    ship: [['引き渡し', '店頭 / 陸送'], ['陸送費', '¥12,000〜（地域別）'], ['名義変更', '代行 ¥11,000']], shipNote: '現状渡し／納車整備つきが選べます。', overall: 73
  },
];

const grid = document.getElementById('grid');
const countEl = document.getElementById('count');
let curFilter = 'all';

const yen = n => '<span class="yen">¥</span>' + n.toLocaleString('ja-JP');

function matches(it) {
  if (curFilter === 'all') return true;
  if (curFilter === 'topgrade') return it.grade === 'S' || it.grade === 'A';
  return it.type === curFilter;
}

function renderGrid() {
  const list = items.filter(matches);

  grid.innerHTML = list.map(it => `
    <div class="col-12 col-md-6 col-xl-3">
      <article class="stock-card g-${it.grade}" onclick="openDetail(${it.id})" tabindex="0" role="button"
        aria-label="${it.title} の詳細"
        onkeydown="if(event.key==='Enter'){openDetail(${it.id})}">
        <div class="shot">
          <div class="grade-badge">
            <span class="grade-dot">${it.grade}</span>
            状態${it.grade}
          </div>
          ${art(it.type)}
          <span class="photo-tag mono">${it.photos} PHOTOS</span>
        </div>

        <div class="card-body-custom">
          <div class="card-type">${it.type === 'バイク' ? 'Motorcycle' : 'Road bike'}</div>
          <div class="card-title-custom">${it.title}</div>
          <div class="card-state">${it.state}</div>

          <div class="card-foot">
            <div class="price mono">${yen(it.price)}</div>
            <div class="spec">${it.spec.split(' / ')[0]}</div>
          </div>
        </div>
      </article>
    </div>
  `).join('');

  countEl.textContent = `${list.length} / ${items.length} 台`;

  requestAnimationFrame(() => {
    [...grid.querySelectorAll('.stock-card')].forEach((card, i) => {
      setTimeout(() => card.classList.add('in'), i * 40);
    });
  });
}

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;

  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  curFilter = btn.dataset.f;
  renderGrid();
});

function ringSVG(pct) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);

  return `
    <svg viewBox="0 0 54 54" aria-hidden="true">
      <circle cx="27" cy="27" r="${r}" fill="none" stroke="#E1E2DA" stroke-width="4"/>
      <circle cx="27" cy="27" r="${r}" fill="none" stroke="#9A6E2E" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 27 27)"
        style="transition:stroke-dashoffset 1s var(--ease)" data-off="${off}"/>
    </svg>
  `;
}

function openDetail(id) {
  const it = items.find(x => x.id === id);
  if (!it) return;

  document.getElementById('mainShot').innerHTML = art(it.type);

  document.getElementById('thumbs').innerHTML =
    [0, 1, 2].map(i => `
      <div class="col-4">
        <div class="thumb ${i === 0 ? 'on' : ''}"
          onclick="setThumb(this)">
          ${art(it.type)}
        </div>
      </div>
    `).join('');

  document.getElementById('info').innerHTML = `
    <div class="d-type">${it.type === 'バイク' ? 'Used motorcycle' : 'Used road bike'}</div>
    <h1 class="d-title">${it.title}</h1>
    <div class="d-year mono">${it.year}　/　${it.spec}</div>
    <div class="d-price mono">${yen(it.price)}</div>
    <div class="d-tax">税込・本体価格（登録費用別途）</div>

    <div class="facts">
      ${it.facts.map(f => `
        <div class="fact">
          <div class="k">${f[0]}</div>
          <div class="v">${f[1]}</div>
        </div>
      `).join('')}
    </div>

    <div class="karte">
      <div class="karte-head">
        <div class="ring">
          ${ringSVG(it.overall)}
          <b>${it.grade}</b>
        </div>
        <div>
          <div class="kt">State karte / 状態カルテ</div>
          <div class="kd">総合評価 ${it.overall} / 100 ・ 分解点検済み</div>
        </div>
      </div>

      ${it.karte.map(k => `
        <div class="krow">
          <div class="cat">${k[0]}</div>
          <div class="meter"><i data-w="${k[2]}"></i></div>
          <div class="note">${k[1]}・${k[3]}</div>
        </div>
      `).join('')}
    </div>

    <div class="desc">
      <h3>状態説明</h3>
      <ul>
        ${it.desc.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>

    <div class="ship">
      <h3>送料・引き渡し</h3>
      ${it.ship.map(s => `
        <div class="ship-row">
          <span>${s[0]}</span>
          <span class="sv mono">${s[1]}</span>
        </div>
      `).join('')}
      <p class="small-note">${it.shipNote}</p>
    </div>

    <div class="cta">
      <button class="btn-main" type="button">購入手続きへ進む</button>
      <button class="btn-ghost" type="button" aria-label="お気に入り">♡</button>
    </div>
  `;

  document.getElementById('listing').classList.remove('active');
  document.getElementById('detail').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'auto' });

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.meter i').forEach(m => {
        m.style.width = m.dataset.w + '%';
      });

      const ring = document.querySelector('.ring svg circle[data-off]');
      if (ring) ring.style.strokeDashoffset = ring.dataset.off;
    }, 120);
  });
}

function setThumb(el) {
  const thumbs = el.closest('#thumbs');
  thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
}

function showListing() {
  document.getElementById('detail').classList.remove('active');
  document.getElementById('listing').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

renderGrid();