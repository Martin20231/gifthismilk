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
  const step = selection.sexuality ? 3 : selection.gender ? 2 : selection.country ? 1 : 0;

  app.innerHTML = `
    <div class="page ${gameActive ? 'game-active' : ''}">
      <header class="top-bar">
        <div class="logo">
          <span class="logo-icon">🥛</span>
          GTM
        </div>
        <div class="progress-pills" aria-label="Fortschritt">
          <span class="progress-pill ${step >= 1 ? 'done' : step === 0 ? 'active' : ''}"></span>
          <span class="progress-pill ${step >= 2 ? 'done' : step === 1 ? 'active' : ''}"></span>
          <span class="progress-pill ${step >= 3 ? 'done' : step === 2 ? 'active' : ''}"></span>
        </div>
      </header>

      <section class="setup" id="setup">
        <header class="hero">
          <div class="hero-badge">Live Experience</div>
          <h1>Stell deine <span class="gradient-text">Milch</span> zusammen</h1>
          <p class="lead">Land · Geschlecht · Aroma — dann ins Live-Spiel.</p>
        </header>

        <div class="selector-card ${selection.country ? 'active' : ''}" id="step-land">
          <div class="step-header">
            <span class="step-num">01</span>
            <div>
              <h2>🌍 Land</h2>
              <p class="step-desc">Bestimmt deine Sorte</p>
            </div>
          </div>
          <div class="chip-grid countries" id="countries">
            ${COUNTRIES.map((c) => `
              <button type="button" class="chip ${selection.country === c.code ? 'selected' : ''}" data-country="${c.code}">
                <span class="chip-flag">${c.flag}</span> ${esc(c.name)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="selector-card ${selection.country ? (selection.gender ? 'active' : '') : 'disabled'}">
          <div class="step-header">
            <span class="step-num">02</span>
            <div>
              <h2>⚧️ Geschlecht</h2>
              <p class="step-desc">Bestimmt deinen Geschmack</p>
            </div>
          </div>
          <div class="chip-grid genders" id="genders">
            ${GENDER_OPTIONS.map((g) => `
              <button type="button" class="chip ${selection.gender === g.id ? 'selected' : ''}" data-gender="${g.id}" ${selection.country ? '' : 'disabled'}>
                ${g.icon} ${esc(g.label)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="selector-card ${selection.gender ? (selection.sexuality ? 'active' : '') : 'disabled'}">
          <div class="step-header">
            <span class="step-num">03</span>
            <div>
              <h2>🌈 Sexualität</h2>
              <p class="step-desc">Bestimmt dein Aroma</p>
            </div>
          </div>
          <div class="aroma-grid" id="sexualities">
            ${selection.gender ? getSexualityOptions().map((o) => `
              <button type="button" class="aroma-card ${selection.sexuality === o.label ? 'selected' : ''}" data-sexuality="${esc(o.label)}">
                <strong>${esc(o.label)}</strong>
                <span>${esc(o.aroma)}</span>
              </button>
            `).join('') : '<p class="empty-msg">Zuerst Land und Geschlecht wählen.</p>'}
          </div>
        </div>

        ${profile && country ? `
          <div class="preview-box">
            <p class="preview-label">Deine Milch</p>
            <div class="preview-sorte">
              <span>${country.flag}</span>
              <span>${esc(country.sorte)}</span>
            </div>
            <div class="preview-tags">
              <span class="preview-tag">⚧️ ${esc(profile.taste)}</span>
              <span class="preview-tag">🌈 ${esc(profile.aroma)}</span>
            </div>
          </div>
        ` : ''}
      </section>

      <div class="cta-bar">
        <div class="cta-inner">
          <button type="button" class="btn btn-start ${isReady() ? 'ready' : ''}" id="start-game" ${isReady() ? '' : 'disabled'}>
            🎮 Spiel starten
          </button>
        </div>
      </div>

      <section class="game" id="game">
        <div class="game-stage">
          <header class="stream-header">
            <button type="button" class="back-setup" id="back-setup">← Zurück</button>
            <span class="live-badge">LIVE</span>
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
            <div class="fill-ring" aria-hidden="true">
              <div class="fill-ring-bar" style="width:${streamState.fill}%"></div>
            </div>
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
        </div>
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
