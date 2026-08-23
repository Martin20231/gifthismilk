import {
  COUNTRIES,
  GENDER_OPTIONS,
  getCountry,
  getProfileById,
  getSexualityOptions,
  getSelection,
  profileToSelection,
  resolveMilkProfile,
  saveSelection,
} from './data.js';
import { appLink } from '../../shared/js/base.js';
import {
  connectStream,
  startLiveSession,
  onStreamState,
  isLiveMode,
  sendLike,
  sendDrink,
} from './stream-client.js';

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

const saved = getSelection();
const selection = {
  country: saved?.country ?? null,
  gender: saved?.gender ?? null,
  sexuality: saved?.sexuality ?? null,
};

const urlProfile = new URLSearchParams(location.search).get('profil');
if (urlProfile) {
  const fromUrl = getProfileById(urlProfile);
  if (fromUrl) Object.assign(selection, profileToSelection(fromUrl));
}

let gameActive = false;
let streamState = {
  fill: 0,
  likes: 0,
  drunk: 0,
  pouring: false,
  drinking: false,
  toast: '',
  lastActor: null,
};
let streamMode = isLiveMode() ? 'connecting' : 'demo';

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function persistSelection() {
  saveSelection({ ...selection });
}

function isReady() {
  return selection.country && selection.gender && selection.sexuality;
}

function getProfile() {
  if (!isReady()) return null;
  return resolveMilkProfile(selection.country, selection.gender, selection.sexuality);
}

function statusHtml() {
  if (streamMode === 'live') return '<div class="status status-live">🔴 TikTok Live verbunden</div>';
  if (streamMode === 'connecting') return '<div class="status status-wait">Verbinde…</div>';
  return '<div class="status status-demo">🧪 Demo — Like & trinken testen</div>';
}

function progressPct() {
  let n = 0;
  if (selection.country) n++;
  if (selection.gender) n++;
  if (selection.sexuality) n++;
  return Math.round((n / 3) * 100);
}

function renderProgressBar() {
  const pct = progressPct();
  const left = 3 - (selection.country ? 1 : 0) - (selection.gender ? 1 : 0) - (selection.sexuality ? 1 : 0);
  return `
    <div class="progress-wrap">
      <div class="progress-labels">
        <span>${pct}% Mix</span>
        <span>${isReady() ? '✓ Bereit' : `${left} offen`}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function render() {
  const profile = getProfile();
  const country = selection.country ? getCountry(selection.country) : null;

  app.innerHTML = `
    <div class="app ${gameActive ? 'is-game' : ''}">

      <header class="nav">
        <a class="nav-brand" href="${appLink('/')}">
          <span class="nav-logo">🥛</span>
          <div>
            <strong>gif this milk</strong>
            <small>Milch Builder</small>
          </div>
        </a>
        ${!gameActive ? renderProgressBar() : '<span class="nav-mode">' + (streamMode === 'demo' ? 'DEMO' : 'LIVE') + '</span>'}
      </header>

      <section class="screen setup" id="setup">
        <div class="hero">
          <span class="tag">TikTok Live Ready</span>
          <h1>Stell deine <em>Milch</em> zusammen</h1>
          <p class="sub">Privat wählen · Live nur Like &amp; trinken</p>
        </div>

        <div class="info-grid">
          <div class="info-card privacy">
            <span>🔒</span>
            <div>
              <strong>Privat auf deinem Gerät</strong>
              <p>Land, Geschlecht &amp; Sexualität — nie im TikTok-Chat.</p>
            </div>
          </div>
          <div class="info-card live">
            <span>💬</span>
            <div>
              <strong>TikTok steuert nur</strong>
              <p><b>Like</b> füllt · Chat <b>trinken</b> leert</p>
            </div>
          </div>
        </div>

        <div class="selectors">
          <article class="sel-card sel-land ${selection.country ? 'done' : ''}">
            <header class="sel-head">
              <span class="sel-num">1</span>
              <div><h2>Land</h2><p>Sorte</p></div>
              ${selection.country ? `<span class="sel-check">✓</span>` : ''}
            </header>
            <div class="flag-grid" id="countries">
              ${COUNTRIES.map((c) => `
                <button type="button" class="pick ${selection.country === c.code ? 'on' : ''}" data-country="${c.code}">
                  <span class="pick-icon">${c.flag}</span>
                  <span class="pick-label">${esc(c.name)}</span>
                </button>
              `).join('')}
            </div>
          </article>

          <article class="sel-card sel-gender ${selection.gender ? 'done' : ''}">
            <header class="sel-head">
              <span class="sel-num">2</span>
              <div><h2>Geschlecht</h2><p>Geschmack</p></div>
              ${selection.gender ? `<span class="sel-check">✓</span>` : ''}
            </header>
            <div class="pick-row" id="genders">
              ${GENDER_OPTIONS.map((g) => `
                <button type="button" class="pick pick-lg ${selection.gender === g.id ? 'on' : ''}" data-gender="${g.id}">
                  <span class="pick-icon">${g.icon}</span>
                  <span class="pick-label">${esc(g.label)}</span>
                </button>
              `).join('')}
            </div>
          </article>

          <article class="sel-card sel-aroma ${selection.sexuality ? 'done' : ''}">
            <header class="sel-head">
              <span class="sel-num">3</span>
              <div><h2>Sexualität</h2><p>Aroma</p></div>
              ${selection.sexuality ? `<span class="sel-check">✓</span>` : ''}
            </header>
            <div class="aroma-grid" id="sexualities">
              ${getSexualityOptions().map((o) => `
                <button type="button" class="pick pick-aroma ${selection.sexuality === o.label ? 'on' : ''}" data-sexuality="${esc(o.label)}">
                  <span class="pick-icon">${SEXUALITY_EMOJI[o.label] ?? '🌈'}</span>
                  <span class="pick-label">${esc(o.label)}</span>
                  <span class="pick-sub">${esc(o.aroma)}</span>
                </button>
              `).join('')}
            </div>
          </article>
        </div>

        ${profile && country ? `
          <div class="result-card">
            <p class="result-tag">Dein Mix · nur lokal 🔒</p>
            <h3>${country.flag} ${esc(country.sorte)}</h3>
            <div class="result-chips">
              <span>⚧️ ${esc(profile.taste)}</span>
              <span>🌈 ${esc(profile.aroma)}</span>
            </div>
          </div>
        ` : ''}
      </section>

      <section class="screen game" id="game">
        <div class="game-card">
          <div class="game-top">
            <button type="button" class="btn-ghost" id="back-setup">← Zurück</button>
            <span class="badge-live">${streamMode === 'demo' ? 'DEMO' : 'LIVE'}</span>
          </div>

          ${statusHtml()}

          ${profile && country ? `
            <div class="your-mix">
              <span class="mix-lock">🔒</span>
              ${country.flag} ${esc(country.sorte)} · ${esc(profile.taste)} · ${esc(profile.aroma)}
            </div>
          ` : ''}

          <div class="stage">
            <div class="machine">
              <div class="machine-box"><div class="machine-fluid"></div></div>
              <div class="stream ${streamState.pouring ? 'on' : ''}"></div>
            </div>
            <div class="glass-box">
              <div class="glass ${streamState.drinking ? 'shake' : ''}">
                <div class="glass-milk" style="height:${streamState.fill}%"></div>
              </div>
              <div class="meter"><div class="meter-fill" style="width:${streamState.fill}%"></div></div>
              <p class="meter-label">${streamState.fill >= 100 ? '🥛 Voll — trinken!' : `${Math.round(streamState.fill)}%`}</p>
              <p class="meter-stats">❤️ ${streamState.likes} · 🥤 ${streamState.drunk}×</p>
            </div>
          </div>

          <div class="toast ${streamState.toast ? 'show' : ''}">${esc(streamState.toast || '')}</div>

          <div class="game-actions">
            <button type="button" class="btn-like" id="demo-like">❤️ Like testen</button>
            <button type="button" class="btn-drink ${streamState.fill >= 100 ? 'show' : ''}" id="demo-drink">🥤 trinken</button>
          </div>
        </div>
      </section>

      <footer class="dock">
        <button type="button" class="btn-go ${isReady() ? 'ready' : ''}" id="start-game" ${isReady() ? '' : 'disabled'}>
          Spiel starten →
        </button>
      </footer>
    </div>
  `;

  bindEvents();
}

function applyStreamUpdate(data) {
  if (data.mode === 'demo') {
    streamMode = 'demo';
    render();
    return;
  }

  if (data.connected === false) {
    streamMode = 'connecting';
    render();
    return;
  }

  if (data.connected !== undefined || data.fill !== undefined) {
    streamMode = 'live';
    if (data.fill !== undefined) {
      streamState = {
        fill: data.fill,
        likes: data.likes ?? 0,
        drunk: data.drunk ?? 0,
        pouring: data.pouring ?? false,
        drinking: data.drinking ?? false,
        toast: data.toast ?? '',
        lastActor: data.lastActor ?? null,
      };
    }
    render();
  }
}

function bindEvents() {
  document.querySelectorAll('[data-country]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.country = btn.dataset.country;
      persistSelection();
      render();
    });
  });

  document.querySelectorAll('[data-gender]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.gender = btn.dataset.gender;
      persistSelection();
      render();
    });
  });

  document.querySelectorAll('[data-sexuality]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.sexuality = btn.dataset.sexuality;
      persistSelection();
      render();
    });
  });

  document.getElementById('start-game')?.addEventListener('click', () => {
    if (!isReady()) return;
    persistSelection();
    gameActive = true;
    streamState = { fill: 0, likes: 0, drunk: 0, pouring: false, drinking: false, toast: '', lastActor: null };
    startLiveSession();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('back-setup')?.addEventListener('click', () => {
    gameActive = false;
    render();
    document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('demo-like')?.addEventListener('click', () => {
    if (!sendLike('Demo')) handleLocalLike('Demo');
  });

  document.getElementById('demo-drink')?.addEventListener('click', () => {
    if (!sendDrink('Demo')) handleLocalDrink('Demo');
  });
}

function handleLocalLike(user) {
  if (streamState.fill >= 100 || streamState.drinking) return;
  streamState.likes += 1;
  const boost = 8 + Math.floor(Math.random() * 10);
  streamState.fill = Math.min(100, streamState.fill + boost);
  streamState.pouring = true;
  streamState.toast = `❤️ ${user} +${boost}%`;
  render();
  setTimeout(() => {
    streamState.pouring = false;
    if (streamState.fill >= 100) streamState.toast = '🥛 Voll — trinken!';
    render();
  }, 700);
}

function handleLocalDrink(user) {
  if (streamState.fill < 100 || streamState.drinking) return;
  streamState.drunk += 1;
  streamState.drinking = true;
  streamState.toast = `🥤 ${user} trinkt! gif this milk!`;
  render();
  setTimeout(() => {
    streamState.fill = 0;
    streamState.drinking = false;
    streamState.toast = `${streamState.drunk}× getrunken — weiter liken!`;
    render();
  }, 1400);
}

connectStream();
onStreamState(applyStreamUpdate);
streamMode = isLiveMode() ? 'connecting' : 'demo';
render();
