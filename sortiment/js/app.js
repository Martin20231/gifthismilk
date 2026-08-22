import {
  CONCEPT,
  COUNTRIES,
  getCountry,
  getProfile,
  getProfilesByCountry,
  saveToCollection,
  getCollection,
  buildMilkProduct,
} from './data.js';

const app = document.getElementById('app');

function parseRoute() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  return { parts, raw: hash };
}

function nav(path) {
  location.hash = path;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function layout(content, { back = null, title = 'Gif This Milk — Sortiment' } = {}) {
  document.title = title;
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        ${back ? `<button class="back-btn" data-back="${esc(back)}" aria-label="Zurück">←</button>` : '<span class="back-spacer"></span>'}
        <a href="#/" class="logo">🥛 Sortiment</a>
        <span class="back-spacer"></span>
      </header>
      <main class="main">${content}</main>
      <footer class="footer">
        <p>Alle Angaben freiwillig · Demo-Daten · <span class="accent">gif this milk</span></p>
      </footer>
    </div>`;

  app.querySelector('[data-back]')?.addEventListener('click', (e) => {
    nav(e.target.dataset.back);
  });
}

function renderHome() {
  layout(`
    <section class="hero">
      <p class="eyebrow">Gif This Milk</p>
      <h1>Unser Sortiment</h1>
      <p class="lead">Jede Sorte ist einzigartig — zusammengesetzt aus Land, Geschmack und Aroma.</p>
    </section>

    <section class="concept-grid">
      ${Object.values(CONCEPT).map((c) => `
        <article class="concept-card">
          <span class="concept-icon">${c.icon}</span>
          <h2>${esc(c.title)}</h2>
          <p>${esc(c.text)}</p>
        </article>
      `).join('')}
    </section>

    <section class="cta-block">
      <h2>So funktioniert's</h2>
      <ol class="flow-steps">
        <li><strong>Land wählen</strong> → bestimmt die Sorte</li>
        <li><strong>Profil wählen</strong> → Geschmack & Aroma</li>
        <li><strong>Milch pressen</strong> → deine Flasche + Gif</li>
        <li><strong>Teilen</strong> → TikTok, Story, Stream</li>
      </ol>
      <button class="btn btn-primary" id="go-countries">🌍 Los geht's — Länder wählen</button>
      <a href="#/sammlung" class="link-sammlung">🥛 Meine Milch-Sammlung</a>
    </section>
  `, { title: 'Sortiment — Start' });

  document.getElementById('go-countries').addEventListener('click', () => nav('/laender'));
}

function renderCountries() {
  layout(`
    <section class="page-head">
      <h1>Alle Länder</h1>
      <p>${COUNTRIES.length} Sorten-Herkünfte · Tippe ein Land für Details</p>
    </section>
    <div class="country-grid">
      ${COUNTRIES.map((c) => {
        const count = getProfilesByCountry(c.code).length;
        return `
          <a href="#/land/${c.code}" class="country-card">
            <span class="country-flag">${c.flag}</span>
            <div class="country-info">
              <strong>${esc(c.name)}</strong>
              <span class="country-sorte">${esc(c.sorte)}</span>
              <span class="country-meta">${count} Profile · ${esc(c.region)}</span>
            </div>
            <span class="country-arrow">→</span>
          </a>`;
      }).join('')}
    </div>
  `, { back: '/', title: 'Länder — Sortiment' });
}

function renderCountry(code, genderFilter = 'all') {
  const country = getCountry(code);
  if (!country) {
    renderNotFound();
    return;
  }

  const profiles = getProfilesByCountry(code, genderFilter);
  const tabs = [
    { id: 'all', label: 'Alle' },
    { id: 'frauen', label: 'Frauen' },
    { id: 'maenner', label: 'Männer' },
    { id: 'divers', label: 'Divers' },
  ];

  layout(`
    <section class="country-hero">
      <span class="country-hero-flag">${country.flag}</span>
      <div>
        <h1>${esc(country.name)}</h1>
        <p class="sorte-badge">Sorte: ${esc(country.sorte)}</p>
      </div>
    </section>

    <div class="filter-tabs" role="tablist">
      ${tabs.map((t) => `
        <button class="tab ${genderFilter === t.id ? 'active' : ''}" data-filter="${t.id}" role="tab">
          ${esc(t.label)}
        </button>
      `).join('')}
    </div>

    <p class="result-count">${profiles.length} ${profiles.length === 1 ? 'Profil' : 'Profile'}</p>

    <div class="profile-grid">
      ${profiles.length ? profiles.map((p) => `
        <a href="#/profil/${p.id}" class="profile-card">
          <div class="profile-avatar">${p.gender === 'Frau' ? '👩' : p.gender === 'Mann' ? '👨' : '🧑'}</div>
          <div class="profile-summary">
            <strong>${esc(p.name)}</strong>
            <span>${p.age} Jahre · ${esc(p.gender)}</span>
            <span class="profile-aroma">${esc(p.aroma)}</span>
          </div>
          <span class="profile-arrow">→</span>
        </a>
      `).join('') : '<p class="empty">Keine Profile in dieser Kategorie.</p>'}
    </div>
  `, { back: '/laender', title: `${country.name} — Sortiment` });

  app.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      nav(`/land/${code}/${btn.dataset.filter}`);
    });
  });
}

function renderProfile(id) {
  const profile = getProfile(id);
  if (!profile) {
    renderNotFound();
    return;
  }
  const country = getCountry(profile.country);

  layout(`
    <article class="profile-detail">
      <div class="profile-detail-header">
        <div class="profile-avatar large">${profile.gender === 'Frau' ? '👩' : profile.gender === 'Mann' ? '👨' : '🧑'}</div>
        <div>
          <h1>${esc(profile.name)}</h1>
          <p class="profile-age">${profile.age} Jahre</p>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">🌍 Land / Sorte</span>
          <strong>${country.flag} ${esc(country.name)}</strong>
          <span>${esc(country.sorte)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">⚧️ Geschlecht / Geschmack</span>
          <strong>${esc(profile.gender)}</strong>
          <span>${esc(profile.taste)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🌈 Sexualität / Aroma</span>
          <strong>${esc(profile.sexuality)}</strong>
          <span>${esc(profile.aroma)}</span>
        </div>
      </div>

      <section class="bio-box">
        <h2>Bio</h2>
        <p>${esc(profile.bio)}</p>
      </section>

      <section class="action-box">
        <h2>Was passiert als Nächstes?</h2>
        <p>Du wählst diese Sorte — wir pressen deine personalisierte Milch-Flasche und erstellen ein sharebares Gif.</p>
        <button class="btn btn-primary" id="choose-milk">🥛 Diese Sorte wählen — gif this milk</button>
      </section>

      <button class="btn btn-secondary" id="back-country">← Zurück zu ${esc(country.name)}</button>
    </article>
  `, { back: `/land/${profile.country}`, title: `${profile.name} — Sortiment` });

  document.getElementById('back-country').addEventListener('click', () => {
    nav(`/land/${profile.country}`);
  });

  document.getElementById('choose-milk').addEventListener('click', () => {
    nav(`/milch/${profile.id}`);
  });
}

function renderMilch(id) {
  const profile = getProfile(id);
  if (!profile) {
    renderNotFound();
    return;
  }

  const country = getCountry(profile.country);
  const product = saveToCollection(id);
  const overlayUrl = new URL('../overlay.html', window.location.href).href;

  layout(`
    <section class="result-hero">
      <p class="eyebrow">Fertig gepresst</p>
      <h1>Deine Milch ist da!</h1>
      <p class="lead">Aus ${esc(country.name)} · ${esc(profile.taste)} · ${esc(profile.aroma)}</p>
    </section>

    <div class="bottle-result" id="bottle-result">
      <div class="bottle-visual">
        <div class="bottle-cap"></div>
        <div class="bottle-body">
          <div class="bottle-label">
            <span class="bottle-flag">${country.flag}</span>
            <strong>${esc(product.label)}</strong>
            <span>${esc(country.sorte)}</span>
            <span class="bottle-notes">${esc(profile.taste)}</span>
            <span class="bottle-notes">${esc(profile.aroma)}</span>
            <span class="bottle-slogan">gif this milk</span>
          </div>
          <div class="bottle-liquid-fill"></div>
        </div>
      </div>
      <div class="pour-effect">🥛</div>
    </div>

    <section class="result-actions">
      <h2>Was du jetzt machen kannst</h2>
      <div class="action-list">
        <button class="action-card" id="copy-share">
          <span>📋</span>
          <div>
            <strong>Link kopieren</strong>
            <span>Für TikTok-Bio oder Story</span>
          </div>
        </button>
        <a class="action-card" href="${esc(overlayUrl)}" target="_blank" rel="noopener">
          <span>📺</span>
          <div>
            <strong>Im Stream zeigen</strong>
            <span>OBS Overlay öffnen</span>
          </div>
        </a>
        <button class="action-card" id="go-sammlung">
          <span>🗂️</span>
          <div>
            <strong>Zur Sammlung</strong>
            <span>Alle deine Sorten</span>
          </div>
        </button>
      </div>
    </section>

    <button class="btn btn-secondary" id="pick-another">← Andere Sorte wählen</button>
  `, { back: `/profil/${id}`, title: `${product.label} — Fertig` });

  document.getElementById('copy-share').addEventListener('click', async () => {
    const text = `🥛 ${product.label}\n${country.sorte} · ${profile.taste} · ${profile.aroma}\ngif this milk\n${location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById('copy-share');
      btn.querySelector('strong').textContent = 'Kopiert! ✓';
    } catch {
      alert(text);
    }
  });

  document.getElementById('go-sammlung').addEventListener('click', () => nav('/sammlung'));
  document.getElementById('pick-another').addEventListener('click', () => nav('/laender'));

  setTimeout(() => {
    document.getElementById('bottle-result')?.classList.add('animated');
  }, 100);
}

function renderSammlung() {
  const items = getCollection();

  layout(`
    <section class="page-head">
      <h1>Meine Milch-Sammlung</h1>
      <p>${items.length} Sorten gepresst</p>
    </section>

    ${items.length ? `
      <div class="collection-list">
        ${items.map((item) => `
          <a href="#/milch/${esc(item.id)}" class="collection-item">
            <span class="collection-emoji">🥛</span>
            <div>
              <strong>${esc(item.label)}</strong>
              <span>${esc(item.sorte)} · ${esc(item.aroma)}</span>
            </div>
            <span>→</span>
          </a>
        `).join('')}
      </div>
    ` : `
      <section class="empty-page">
        <p>Noch keine Milch gepresst.</p>
        <button class="btn btn-primary" id="start-pick">Sorte wählen</button>
      </section>
    `}
  `, { back: '/', title: 'Meine Sammlung' });

  document.getElementById('start-pick')?.addEventListener('click', () => nav('/laender'));
}

function renderNotFound() {
  layout(`
    <section class="empty-page">
      <h1>Nicht gefunden</h1>
      <p>Diese Seite existiert nicht.</p>
      <button class="btn btn-primary" id="go-home">Zur Startseite</button>
    </section>
  `, { title: '404' });
  document.getElementById('go-home').addEventListener('click', () => nav('/'));
}

function router() {
  const { parts } = parseRoute();

  if (parts.length === 0) return renderHome();
  if (parts[0] === 'laender') return renderCountries();
  if (parts[0] === 'land' && parts[1]) return renderCountry(parts[1], parts[2] || 'all');
  if (parts[0] === 'profil' && parts[1]) return renderProfile(parts[1]);
  if (parts[0] === 'milch' && parts[1]) return renderMilch(parts[1]);
  if (parts[0] === 'sammlung') return renderSammlung();
  return renderNotFound();
}

window.addEventListener('hashchange', router);
router();
