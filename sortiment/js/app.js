import {
  COUNTRIES,
  GENDER_OPTIONS,
  getCountry,
  getSexualityOptions,
  resolveMilkProfile,
} from './data.js';
import {
  connectStream,
  startLiveSession,
  onStreamState,
  isLiveMode,
  sendChatCommand,
  registerProfile,
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

const selection = {
  country: null,
  gender: null,
  sexuality: null,
};

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
let registrations = [];
let registryToast = '';
let streamMode = isLiveMode() ? 'connecting' : 'demo';

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
  let n = 0;
  if (selection.country) n = 1;
  if (selection.gender) n = 2;
  if (selection.sexuality) n = 3;
  return n;
}

function renderSteps() {
  const steps = ['Land', 'Geschmack', 'Aroma'];
  const current = stepIndex();
  return steps.map((label, i) => {
    const num = i + 1;
    const done = current >= num;
    const active = current === num - 1 || (current === 0 && num === 1);
    return `<div class="step-item ${done && current > num - 1 ? 'done' : active ? 'active' : ''}"><span class="step-dot">${done && current > num - 1 ? '✓' : num}</span><span>${label}</span></div>`;
  }).join('');
}

function liveStatusHtml() {
  if (streamMode === 'live') return '<span class="conn-badge conn-live">🔴 TikTok Live verbunden</span>';
  if (streamMode === 'connecting') return '<span class="conn-badge conn-wait">⏳ Verbinde…</span>';
  return '<span class="conn-badge conn-demo">📱 Demo — Server für TikTok Live nötig</span>';
}

function renderRegistrations() {
  if (!registrations.length) {
    return '<p class="reg-empty">Noch niemand registriert — wähle im Chat oder unten.</p>';
  }
  return registrations.slice(0, 12).map((r) => `
    <div class="reg-item">
      <span class="reg-user">@${esc(r.user)}</span>
      <span class="reg-milk">${r.profile.flag} ${esc(r.profile.sorte)}</span>
      <span class="reg-meta">${esc(r.profile.gender)} · ${esc(r.profile.sexuality)}</span>
    </div>
  `).join('');
}

function render() {
  const profile = getProfile();
  const country = selection.country ? getCountry(selection.country) : null;
  const isLive = streamMode === 'live';

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
          <div class="hero-pill">🔴 TikTok Live</div>
          <h1>Mix deine<br><em>Milch</em></h1>
          <p class="hero-sub">Frei wählen oder im Chat registrieren</p>
          <div class="step-track">${renderSteps()}</div>
        </div>

        <div class="chat-help">
          <h3>💬 TikTok Chat-Befehle</h3>
          <div class="chat-cmds">
            <code>land de</code>
            <code>geschlecht frau</code>
            <code>sexualität heterosexuell</code>
            <code>trinken</code>
          </div>
          <p class="chat-help-note">Reihenfolge egal · bei 3/3 bist du registriert</p>
        </div>

        <div class="bento">
          <article class="bento-card card-land ${selection.country ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">01</span>
              <div><h2>Land</h2><p>= Sorte</p></div>
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

          <article class="bento-card card-gender ${selection.gender ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">02</span>
              <div><h2>Geschlecht</h2><p>= Geschmack</p></div>
            </div>
            <div class="gender-row" id="genders">
              ${GENDER_OPTIONS.map((g) => `
                <button type="button" class="gender-tile ${selection.gender === g.id ? 'selected' : ''}" data-gender="${g.id}">
                  <span class="gender-emoji">${g.icon}</span>
                  <span class="gender-label">${esc(g.label)}</span>
                </button>
              `).join('')}
            </div>
          </article>

          <article class="bento-card card-aroma ${selection.sexuality ? 'has-value' : ''}">
            <div class="card-head">
              <span class="card-num">03</span>
              <div><h2>Sexualität</h2><p>= Aroma</p></div>
            </div>
            <div class="aroma-grid" id="sexualities">
              ${getSexualityOptions().map((o) => `
                <button type="button" class="aroma-tile ${selection.sexuality === o.label ? 'selected' : ''}" data-sexuality="${esc(o.label)}">
                  <span class="aroma-emoji">${SEXUALITY_EMOJI[o.label] ?? '🌈'}</span>
                  <span class="aroma-name">${esc(o.label)}</span>
                  <span class="aroma-flavor">${esc(o.aroma)}</span>
                </button>
              `).join('')}
            </div>
          </article>
        </div>

        ${profile && country ? `
          <div class="milk-card">
            <div class="milk-card-glow"></div>
            <div class="milk-card-inner">
              <span class="milk-card-label">Dein Mix 🎉</span>
              <div class="milk-card-title">${country.flag} ${esc(country.sorte)}</div>
              <div class="milk-card-tags">
                <span>⚧️ ${esc(profile.taste)}</span>
                <span>🌈 ${esc(profile.aroma)}</span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="reg-panel">
          <h3>✅ Registriert im Stream</h3>
          ${registryToast ? `<div class="reg-toast show">${esc(registryToast)}</div>` : ''}
          <div class="reg-list">${renderRegistrations()}</div>
        </div>

        <div class="chat-demo">
          <p class="chat-demo-label">Chat testen (Demo)</p>
          <div class="chat-demo-row">
            <input type="text" id="demo-user" placeholder="Username" value="Zuschauer1" />
            <input type="text" id="demo-chat" placeholder="land de" />
            <button type="button" id="demo-send">→</button>
          </div>
        </div>

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

          ${liveStatusHtml()}

          ${profile && country ? `
            <div class="live-tags">
              <span>${country.flag} ${esc(country.sorte)}</span>
              <span>⚧️ ${esc(profile.taste)}</span>
              <span>🌈 ${esc(profile.aroma)}</span>
            </div>
          ` : ''}

          <div class="live-rules">
            <div class="rule"><span>❤️</span> Like = Milch</div>
            <div class="rule"><span>💬</span> <strong>trinken</strong></div>
          </div>

          <div class="live-stage">
            <div class="dispenser">
              <div class="dispenser-body"><div class="dispenser-window"></div><div class="dispenser-spout"></div></div>
              <div class="pour ${streamState.pouring ? 'active' : ''}"></div>
            </div>
            <div class="glass-zone">
              <div class="glass ${streamState.drinking ? 'drinking' : ''}">
                <div class="glass-fill" style="height:${streamState.fill}%"></div>
                <div class="glass-glare"></div>
              </div>
              <div class="fill-bar"><div class="fill-bar-inner" style="width:${streamState.fill}%"></div></div>
              <p class="fill-text">${streamState.fill >= 100 ? '🥛 Voll — trinken!' : `${Math.round(streamState.fill)}% im Glas`}</p>
              <p class="fill-meta">❤️ ${streamState.likes} · 🥤 ${streamState.drunk}× · 👥 ${registrations.length} registriert</p>
            </div>
          </div>

          <div class="live-toast ${streamState.toast ? 'show' : ''}">${esc(streamState.toast || '')}</div>

          ${registryToast ? `<div class="reg-toast show">${esc(registryToast)}</div>` : ''}

          ${isLive ? `
            <p class="live-hint live-hint-main">Live via TikTok — Likes & Chat steuern das Glas</p>
          ` : `
            <div class="live-actions">
              <button type="button" class="btn-like" id="demo-like">❤️ Demo-Like</button>
              <button type="button" class="btn-drink ${streamState.fill >= 100 ? 'show' : ''}" id="demo-drink">💬 trinken</button>
            </div>
          `}

          <div class="reg-panel reg-panel-compact">
            <h3>Registriert</h3>
            <div class="reg-list">${renderRegistrations()}</div>
          </div>
        </div>
      </section>
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

  if (data.connected !== undefined || data.fill !== undefined || data.registrations) {
    streamMode = data.connected === false ? 'connecting' : 'live';
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
    if (data.registrations) registrations = data.registrations;
    if (data.lastRegistryEvent?.message) {
      registryToast = data.lastRegistryEvent.message;
      setTimeout(() => { registryToast = ''; render(); }, 5000);
    }
    render();
  }
}

function bindEvents() {
  document.querySelectorAll('[data-country]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.country = btn.dataset.country;
      render();
    });
  });

  document.querySelectorAll('[data-gender]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selection.gender = btn.dataset.gender;
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
    const profile = getProfile();
    const country = getCountry(selection.country);
    gameActive = true;
    streamState = { fill: 0, likes: 0, drunk: 0, pouring: false, drinking: false, toast: '', lastActor: null };
    startLiveSession({
      sorte: country?.sorte,
      flag: country?.flag,
      taste: profile?.taste,
      aroma: profile?.aroma,
    });
    registerProfile('Streamer', selection.country, selection.gender, selection.sexuality);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('back-setup')?.addEventListener('click', () => {
    gameActive = false;
    render();
    document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('demo-like')?.addEventListener('click', () => handleLocalLike('Demo'));
  document.getElementById('demo-drink')?.addEventListener('click', () => handleLocalDrink('Demo'));

  document.getElementById('demo-send')?.addEventListener('click', () => {
    const user = document.getElementById('demo-user')?.value?.trim() || 'Demo';
    const comment = document.getElementById('demo-chat')?.value?.trim();
    if (!comment) return;
    if (sendChatCommand(user, comment)) return;
    fetch('http://localhost:3847/api/sortiment/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, comment }),
    }).catch(() => {
      registryToast = 'Server nicht erreichbar — npm start';
      render();
    });
    document.getElementById('demo-chat').value = '';
  });

  document.getElementById('demo-chat')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('demo-send')?.click();
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
  streamState.toast = `🥤 ${user} trinkt!`;
  render();
  setTimeout(() => {
    streamState.fill = 0;
    streamState.drinking = false;
    streamState.toast = `${streamState.drunk}× getrunken`;
    render();
  }, 1400);
}

connectStream();
onStreamState(applyStreamUpdate);
streamMode = isLiveMode() ? 'connecting' : 'demo';
render();
