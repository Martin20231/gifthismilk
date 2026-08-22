import {
  COUNTRIES,
  GENDER_OPTIONS,
  getCountry,
  getSexualityOptions,
  getStreamState,
  resetStreamState,
  resolveMilkProfile,
  saveStreamState,
} from './data.js';

const app = document.getElementById('app');

const selection = {
  country: null,
  gender: null,
  sexuality: null,
};

let streamState = getStreamState();
let gameActive = false;

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function isReady() {
  return selection.country && selection.gender && selection.sexuality;
}

function getProfile() {
  if (!isReady()) return null;
  return resolveMilkProfile(selection.country, selection.gender, selection.sexuality);
}

function render() {
  const profile = getProfile();
  const country = selection.country ? getCountry(selection.country) : null;

  app.innerHTML = `
    <div class="page ${gameActive ? 'game-active' : ''}">
      <!-- Setup: alles auf einer Seite -->
      <section class="setup" id="setup">
        <header class="hero">
          <p class="eyebrow">Gif This Milk</p>
          <h1>Stell deine Milch zusammen</h1>
          <p class="lead">Land · Geschlecht · Aroma — dann Spiel starten.</p>
        </header>

        <div class="selector-block">
          <h2>🌍 Land <span class="hint">= Sorte</span></h2>
          <div class="chip-grid" id="countries">
            ${COUNTRIES.map((c) => `
              <button type="button" class="chip ${selection.country === c.code ? 'selected' : ''}" data-country="${c.code}">
                ${c.flag} ${esc(c.name)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="selector-block ${selection.country ? '' : 'disabled'}">
          <h2>⚧️ Geschlecht <span class="hint">= Geschmack</span></h2>
          <div class="chip-grid" id="genders">
            ${GENDER_OPTIONS.map((g) => `
              <button type="button" class="chip ${selection.gender === g.id ? 'selected' : ''}" data-gender="${g.id}" ${selection.country ? '' : 'disabled'}>
                ${g.icon} ${esc(g.label)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="selector-block ${selection.gender ? '' : 'disabled'}">
          <h2>🌈 Sexualität <span class="hint">= Aroma</span></h2>
          <div class="chip-list" id="sexualities">
            ${selection.gender ? getSexualityOptions().map((o) => `
              <button type="button" class="chip-row ${selection.sexuality === o.label ? 'selected' : ''}" data-sexuality="${esc(o.label)}">
                <strong>${esc(o.label)}</strong>
                <span>${esc(o.aroma)}</span>
              </button>
            `).join('') : '<p class="empty-msg">Zuerst Land und Geschlecht wählen.</p>'}
          </div>
        </div>

        ${profile && country ? `
          <div class="preview-box">
            <p>Deine Milch:</p>
            <strong>${country.flag} ${esc(country.sorte)}</strong>
            <span>⚧️ ${esc(profile.taste)} · 🌈 ${esc(profile.aroma)}</span>
          </div>
        ` : ''}

        <button type="button" class="btn btn-start" id="start-game" ${isReady() ? '' : 'disabled'}>
          🎮 Spiel starten
        </button>
      </section>

      <!-- Spiel: Glas -->
      <section class="game" id="game">
        <header class="stream-header">
          <button type="button" class="back-setup" id="back-setup">← Zurück</button>
          <span class="live-badge">● LIVE</span>
          <h1>Gif This Milk</h1>
          <p class="stream-slogan">gif this milk</p>
        </header>

        ${profile && country ? `
          <div class="stream-info">
            <span>${country.flag} ${esc(country.sorte)}</span>
            <span>⚧️ ${esc(profile.taste)}</span>
            <span>🌈 ${esc(profile.aroma)}</span>
          </div>
        ` : ''}

        <div class="machine-mini">
          <div class="machine-mini-body">
            <div class="machine-mini-tank"></div>
            <div class="machine-mini-nozzle"></div>
          </div>
          <div class="stream-pour ${streamState.pouring ? 'active' : ''}"></div>
        </div>

        <div class="glass-wrap">
          <div class="glass ${streamState.drinking ? 'drinking' : ''}" id="glass">
            <div class="glass-milk" style="height:${streamState.fill}%"></div>
            <div class="glass-shine"></div>
          </div>
          <p class="glass-label">${streamState.fill >= 100 ? 'Voll — trinken!' : `${Math.round(streamState.fill)}% voll`}</p>
        </div>

        <div class="stream-toast ${streamState.toast ? 'show' : ''}">${esc(streamState.toast || '')}</div>

        <div class="stream-actions">
          <button type="button" class="like-btn" id="like-btn" ${streamState.fill >= 100 ? 'disabled' : ''}>
            ❤️ Like <span>${streamState.likes}</span>
          </button>
          <button type="button" class="drink-btn ${streamState.fill >= 100 ? 'show' : ''}" id="drink-btn">
            🥤 Trinken
          </button>
        </div>

        <p class="stream-hint">
          ${streamState.fill >= 100 ? 'Glas voll — tippe Trinken!' : 'Like = Milch ins Glas. Bei 100% trinken.'}
        </p>
      </section>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-country]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.country = btn.dataset.country;
      selection.gender = null;
      selection.sexuality = null;
      render();
    });
  });

  document.querySelectorAll('[data-gender]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!selection.country) return;
      selection.gender = btn.dataset.gender;
      selection.sexuality = null;
      render();
    });
  });

  document.querySelectorAll('[data-sexuality]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.sexuality = btn.dataset.sexuality;
      render();
    });
  });

  document.getElementById('start-game')?.addEventListener('click', () => {
    if (!isReady()) return;
    resetStreamState();
    streamState = getStreamState();
    gameActive = true;
    render();
    document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('back-setup')?.addEventListener('click', () => {
    gameActive = false;
    render();
    document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('like-btn')?.addEventListener('click', onLike);
  document.getElementById('drink-btn')?.addEventListener('click', onDrink);
}

function onLike() {
  if (streamState.fill >= 100) return;
  streamState.likes += 1;
  const boost = 8 + Math.floor(Math.random() * 10);
  streamState.fill = Math.min(100, streamState.fill + boost);
  streamState.pouring = true;
  streamState.toast = `+${boost}% Milch! ❤️`;
  streamState.drinking = false;
  saveStreamState(streamState);
  render();
  setTimeout(() => {
    streamState.pouring = false;
    if (streamState.fill >= 100) streamState.toast = '🥛 Voll — jetzt trinken!';
    saveStreamState(streamState);
    render();
  }, 650);
}

function onDrink() {
  if (streamState.fill < 100) return;
  streamState.drunk = (streamState.drunk || 0) + 1;
  streamState.drinking = true;
  streamState.toast = 'Schluck schluck… gif this milk! 🥛';
  saveStreamState(streamState);
  render();
  setTimeout(() => {
    streamState.fill = 0;
    streamState.drinking = false;
    streamState.toast = `${streamState.drunk}× getrunken — keep liking!`;
    saveStreamState(streamState);
    render();
  }, 1300);
}

render();
