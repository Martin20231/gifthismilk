import {
  CONCEPT,
  COUNTRIES,
  GENDER_OPTIONS,
  clearSelection,
  findProfile,
  getCountry,
  getGenderOption,
  getSelection,
  getSexualityOptions,
  getStreamState,
  resetStreamState,
  saveSelection,
  saveStreamState,
} from './data.js';

const app = document.getElementById('app');

function nav(path) {
  location.hash = path;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function parseRoute() {
  const parts = location.hash.slice(1).split('/').filter(Boolean);
  return parts;
}

function stepBar(step) {
  const labels = ['Land', 'Geschlecht', 'Aroma', 'Stream'];
  return `
    <div class="step-bar">
      ${labels.map((l, i) => `
        <div class="step-item ${i + 1 <= step ? 'done' : ''} ${i + 1 === step ? 'active' : ''}">
          <span class="step-num">${i + 1}</span>
          <span class="step-label">${l}</span>
        </div>
      `).join('')}
    </div>`;
}

function layout(content, { step = 0, back = null, title = 'Gif This Milk' } = {}) {
  document.title = title;
  app.innerHTML = `
    <div class="app-shell ${step === 4 ? 'stream-mode' : ''}">
      ${step && step < 4 ? stepBar(step) : ''}
      ${back !== null ? `<header class="topbar"><button class="back-btn" data-back="${esc(back)}">←</button></header>` : ''}
      <main class="main">${content}</main>
      ${step < 4 ? '<footer class="footer"><span class="accent">gif this milk</span></footer>' : ''}
    </div>`;
  app.querySelector('[data-back]')?.addEventListener('click', (e) => nav(e.target.dataset.back));
}

function renderHome() {
  layout(`
    <section class="hero">
      <p class="eyebrow">Gif This Milk</p>
      <h1>Stell deine Milch zusammen</h1>
      <p class="lead">Land → Geschlecht → Aroma — dann live im Stream: liken, füllen, trinken.</p>
    </section>
    <div class="concept-grid">
      ${Object.values(CONCEPT).map((c) => `
        <article class="concept-card">
          <span class="concept-icon">${c.icon}</span>
          <h2>${esc(c.title)}</h2>
          <p>${esc(c.text)}</p>
        </article>
      `).join('')}
    </div>
    <button class="btn btn-primary" id="start">🌍 Land wählen — Start</button>
  `, { title: 'Gif This Milk — Start' });

  document.getElementById('start').addEventListener('click', () => nav('/land'));
}

function renderLand() {
  layout(`
    <section class="page-head">
      <h1>🌍 Dein Land</h1>
      <p>Bestimmt deine Milch-Sorte</p>
    </section>
    <div class="pick-grid">
      ${COUNTRIES.map((c) => `
        <button class="pick-card" data-country="${c.code}">
          <span class="pick-icon">${c.flag}</span>
          <strong>${esc(c.name)}</strong>
          <span>${esc(c.sorte)}</span>
        </button>
      `).join('')}
    </div>
  `, { step: 1, back: '/', title: 'Land wählen' });

  app.querySelectorAll('[data-country]').forEach((btn) => {
    btn.addEventListener('click', () => nav(`/geschlecht/${btn.dataset.country}`));
  });
}

function renderGender(countryCode) {
  const country = getCountry(countryCode);
  if (!country) return renderHome();

  layout(`
    <section class="page-head">
      <h1>⚧️ Dein Geschlecht</h1>
      <p>${country.flag} ${esc(country.name)} · bestimmt den Geschmack</p>
    </section>
    <div class="pick-grid pick-grid-sm">
      ${GENDER_OPTIONS.map((g) => `
        <button class="pick-card" data-gender="${g.id}">
          <span class="pick-icon">${g.icon}</span>
          <strong>${esc(g.label)}</strong>
          <span>${esc(g.desc)}</span>
        </button>
      `).join('')}
    </div>
  `, { step: 2, back: '/land', title: 'Geschlecht wählen' });

  app.querySelectorAll('[data-gender]').forEach((btn) => {
    btn.addEventListener('click', () => nav(`/aroma/${countryCode}/${btn.dataset.gender}`));
  });
}

function renderAroma(countryCode, genderKey) {
  const country = getCountry(countryCode);
  const gender = getGenderOption(genderKey);
  if (!country || !gender) return renderHome();

  const options = getSexualityOptions(countryCode, genderKey);
  if (!options.length) {
    layout(`<p class="empty">Keine Sorte für diese Kombination.</p>`, { step: 3, back: `/geschlecht/${countryCode}` });
    return;
  }

  layout(`
    <section class="page-head">
      <h1>🌈 Deine Sexualität</h1>
      <p>${country.flag} · ${esc(gender.label)} · bestimmt das Aroma</p>
    </section>
    <div class="pick-list">
      ${options.map((p) => `
        <button class="pick-row" data-sexuality="${esc(p.sexuality)}">
          <div>
            <strong>${esc(p.sexuality)}</strong>
            <span>Aroma: ${esc(p.aroma)}</span>
            <span>Geschmack: ${esc(p.taste)}</span>
          </div>
          <span class="arrow">→</span>
        </button>
      `).join('')}
    </div>
  `, { step: 3, back: `/geschlecht/${countryCode}`, title: 'Aroma wählen' });

  app.querySelectorAll('[data-sexuality]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const profile = findProfile(countryCode, genderKey, btn.dataset.sexuality);
      if (!profile) return;
      saveSelection({
        country: countryCode,
        gender: genderKey,
        sexuality: profile.sexuality,
        profileId: profile.id,
      });
      resetStreamState();
      nav('/stream');
    });
  });
}

function renderStream() {
  const sel = getSelection();
  if (!sel?.profileId) {
    nav('/');
    return;
  }

  const profile = findProfile(sel.country, sel.gender, sel.sexuality);
  const country = getCountry(sel.country);
  if (!profile || !country) {
    nav('/');
    return;
  }

  let state = getStreamState();

  function mount() {
    layout(`
      <div class="stream-overlay">
        <header class="stream-header">
          <span class="live-badge">● LIVE</span>
          <h1>Gif This Milk</h1>
          <p class="stream-slogan">gif this milk</p>
        </header>

        <div class="stream-info">
          <span>${country.flag} ${esc(country.sorte)}</span>
          <span>⚧️ ${esc(profile.taste)}</span>
          <span>🌈 ${esc(profile.aroma)}</span>
        </div>

        <div class="machine-mini">
          <div class="machine-mini-body">
            <div class="machine-mini-tank"></div>
            <div class="machine-mini-nozzle"></div>
          </div>
          <div class="stream-pour ${state.pouring ? 'active' : ''}" id="pour-line"></div>
        </div>

        <div class="glass-wrap">
          <div class="glass" id="glass">
            <div class="glass-milk" id="glass-milk" style="height:${state.fill}%"></div>
            <div class="glass-shine"></div>
          </div>
          <p class="glass-label" id="glass-label">${state.fill >= 100 ? 'Voll!' : `${Math.round(state.fill)}% voll`}</p>
        </div>

        <div class="stream-toast ${state.toast ? 'show' : ''}" id="stream-toast">${esc(state.toast || '')}</div>

        <div class="stream-actions">
          <button class="like-btn" id="like-btn" ${state.fill >= 100 ? 'disabled' : ''}>
            ❤️ Like <span id="like-count">${state.likes}</span>
          </button>
          <button class="drink-btn ${state.fill >= 100 ? 'show' : ''}" id="drink-btn">
            🥤 Trinken
          </button>
        </div>

        <p class="stream-hint" id="stream-hint">
          ${state.fill >= 100 ? 'Glas ist voll — trink deine Milch!' : 'Like = Milch ins Glas. Bei 100% trinken.'}
        </p>

        <button class="btn-link" id="restart">↺ Neu zusammenstellen</button>
      </div>
    `, { step: 4, title: 'Live Stream' });

    document.getElementById('like-btn')?.addEventListener('click', onLike);
    document.getElementById('drink-btn')?.addEventListener('click', onDrink);
    document.getElementById('restart')?.addEventListener('click', () => {
      clearSelection();
      resetStreamState();
      nav('/');
    });
  }

  function onLike() {
    if (state.fill >= 100) return;
    state.likes += 1;
    const boost = 8 + Math.floor(Math.random() * 10);
    state.fill = Math.min(100, state.fill + boost);
    state.pouring = true;
    state.toast = `+${boost}% Milch! ❤️`;
    saveStreamState(state);
    mount();
    setTimeout(() => {
      state.pouring = false;
      if (state.fill >= 100) state.toast = '🥛 Glas voll — jetzt trinken!';
      saveStreamState(state);
      mount();
    }, 700);
  }

  function onDrink() {
    if (state.fill < 100) return;
    state.drunk += 1;
    state.toast = 'Schluck schluck… gif this milk! 🥛';
    state.pouring = false;
    const glass = document.getElementById('glass');
    glass?.classList.add('drinking');
    setTimeout(() => {
      state.fill = 0;
      state.toast = `Leer! ${state.drunk}× getrunken — keep liking!`;
      saveStreamState(state);
      mount();
    }, 1400);
  }

  mount();
}

function router() {
  const p = parseRoute();
  if (!p.length) return renderHome();
  if (p[0] === 'land') return renderLand();
  if (p[0] === 'geschlecht' && p[1]) return renderGender(p[1]);
  if (p[0] === 'aroma' && p[1] && p[2]) return renderAroma(p[1], p[2]);
  if (p[0] === 'stream') return renderStream();
  return renderHome();
}

window.addEventListener('hashchange', router);
router();
