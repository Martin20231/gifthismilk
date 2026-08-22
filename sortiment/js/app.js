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

const SEXUALITY_EMOJI = {
  Heterosexuell: '💑',
  Schwul: '🏳️‍🌈',
  Lesbisch: '🌸',
  Bisexuell: '💜',
  Pansexuell: '🦋',
  Asexuell: '🤍',
  Demisexuell: '🔗',
  Queer: '✨',
};

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

function stepIndex() {
  if (selection.sexuality) return 3;
  if (selection.gender) return 2;
  if (selection.country) return 1;
  return 0;
}

function renderSteps() {
  const steps = ['Land', 'Geschmack', 'Aroma'];
  const current = stepIndex();
  return steps.map((label, i) => {
    const n = i + 1;
    const state = current > n ? 'done' : current === n ? 'active' : '';
    return `<div class="step-item ${state}"><span class="step-dot">${current > n ? '✓' : n}</span><span>${label}</span></div>`;
  }).join('');
}

function render() {
  const profile = getProfile();
  const country = selection.country ? getCountry(selection.country) : null;

  app.innerHTML = `
    <div class="shell ${gameActive ? 'is-game' : ''}">

      <section class="screen setup" id="setup">
        <header class="brand">
          <div class="brand-icon">🥛</div>
          <div class="brand-text">
            <strong>gif this milk</strong>
            <span>Live Milch Builder</span>
          </div>
        </header>

        <div class="hero">
          <div class="hero-pill">🔴 TikTok Live Style</div>
          <h1>Mix deine<br><em>Milch</em></h1>
          <p class="hero-sub">Land · Geschlecht · Aroma — dann live ins Glas.</p>
          <div class="step-track">${renderSteps()}</div>
        </div>

        <div class="bento">

          <article class="bento-card card-land ${selection.country ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">01</span>
              <div>
                <h2>Land</h2>
                <p>= deine Sorte</p>
              </div>
            </div>
            <div class="flag-grid" id="countries">
              ${COUNTRIES.map((c) => `
                <button type="button" class="flag-tile ${selection.country === c.code ? 'selected' : ''}" data-country="${c.code}">
                  <span class="flag-big">${c.flag}</span>
                  <span class="flag-name">${esc(c.name)}</span>
                </button>
              `).join('')}
            </div>
          </article>

          <article class="bento-card card-gender ${!selection.country ? 'locked' : selection.gender ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">02</span>
              <div>
                <h2>Geschlecht</h2>
                <p>= dein Geschmack</p>
              </div>
            </div>
            <div class="gender-row" id="genders">
              ${GENDER_OPTIONS.map((g) => `
                <button type="button" class="gender-tile ${selection.gender === g.id ? 'selected' : ''}" data-gender="${g.id}" ${selection.country ? '' : 'disabled'}>
                  <span class="gender-emoji">${g.icon}</span>
                  <span class="gender-label">${esc(g.label)}</span>
                </button>
              `).join('')}
            </div>
          </article>

          <article class="bento-card card-aroma ${!selection.gender ? 'locked' : selection.sexuality ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">03</span>
              <div>
                <h2>Sexualität</h2>
                <p>= dein Aroma</p>
              </div>
            </div>
            <div class="aroma-grid" id="sexualities">
              ${selection.gender ? getSexualityOptions().map((o) => `
                <button type="button" class="aroma-tile ${selection.sexuality === o.label ? 'selected' : ''}" data-sexuality="${esc(o.label)}">
                  <span class="aroma-emoji">${SEXUALITY_EMOJI[o.label] ?? '🌈'}</span>
                  <span class="aroma-name">${esc(o.label)}</span>
                  <span class="aroma-flavor">${esc(o.aroma)}</span>
                </button>
              `).join('') : '<p class="lock-msg">🔒 Erst Land & Geschlecht wählen</p>'}
            </div>
          </article>

        </div>

        ${profile && country ? `
          <div class="milk-card">
            <div class="milk-card-glow"></div>
            <div class="milk-card-inner">
              <span class="milk-card-label">Dein Mix ist ready 🎉</span>
              <div class="milk-card-title">${country.flag} ${esc(country.sorte)}</div>
              <div class="milk-card-tags">
                <span>⚧️ ${esc(profile.taste)}</span>
                <span>🌈 ${esc(profile.aroma)}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="fab-wrap">
          <button type="button" class="fab-start ${isReady() ? 'ready' : ''}" id="start-game" ${isReady() ? '' : 'disabled'}>
            <span class="fab-text">Spiel starten</span>
            <span class="fab-arrow">→</span>
          </button>
        </div>
      </section>

      <section class="screen game" id="game">
        <div class="live-phone">
          <div class="live-phone-notch"></div>

          <header class="live-top">
            <button type="button" class="live-back" id="back-setup">← Mix</button>
            <div class="live-brand">gif this milk</div>
            <span class="live-dot">LIVE</span>
          </header>

          ${profile && country ? `
            <div class="live-tags">
              <span>${country.flag} ${esc(country.sorte)}</span>
              <span>⚧️ ${esc(profile.taste)}</span>
              <span>🌈 ${esc(profile.aroma)}</span>
            </div>
          ` : ''}

          <div class="live-stage">
            <div class="dispenser">
              <div class="dispenser-body">
                <div class="dispenser-window"></div>
                <div class="dispenser-spout"></div>
              </div>
              <div class="pour ${streamState.pouring ? 'active' : ''}"></div>
            </div>

            <div class="glass-zone">
              <div class="glass ${streamState.drinking ? 'drinking' : ''}">
                <div class="glass-fill" style="height:${streamState.fill}%"></div>
                <div class="glass-glare"></div>
              </div>
              <div class="fill-bar"><div class="fill-bar-inner" style="width:${streamState.fill}%"></div></div>
              <p class="fill-text">${streamState.fill >= 100 ? '🥛 Voll — trinken!' : `${Math.round(streamState.fill)}% im Glas`}</p>
            </div>
          </div>

          <div class="live-toast ${streamState.toast ? 'show' : ''}">${esc(streamState.toast || '')}</div>

          <div class="live-actions">
            <button type="button" class="btn-like" id="like-btn" ${streamState.fill >= 100 ? 'disabled' : ''}>
              ❤️ Like <b>${streamState.likes}</b>
            </button>
            <button type="button" class="btn-drink ${streamState.fill >= 100 ? 'show' : ''}" id="drink-btn">
              🥤 Trinken
            </button>
          </div>

          <p class="live-hint">${streamState.fill >= 100 ? 'Glas voll — jetzt trinken!' : 'Jeder Like füllt dein Glas 🥛'}</p>
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
