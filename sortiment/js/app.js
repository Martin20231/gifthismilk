import {
  CONCEPT,
  COUNTRIES,
  getCountry,
  getProfile,
  getProfilesByCountry,
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
      <h2>Entdecke alle Sorten</h2>
      <p>Wähle ein Land und finde die verfügbaren Profile.</p>
      <button class="btn btn-primary" id="go-countries">🌍 Länder anzeigen</button>
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

      <button class="btn btn-secondary" id="back-country">← Zurück zu ${esc(country.name)}</button>
    </article>
  `, { back: `/land/${profile.country}`, title: `${profile.name} — Sortiment` });

  document.getElementById('back-country').addEventListener('click', () => {
    nav(`/land/${profile.country}`);
  });
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
  return renderNotFound();
}

window.addEventListener('hashchange', router);
router();
