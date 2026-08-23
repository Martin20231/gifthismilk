import {
  COUNTRIES,
  getCountry,
  getProfilesByCountry,
  getProfileById,
  profileToSelection,
  saveSelection,
} from '../../shared/js/data.js';
import { appLink, esc, initials } from '../../shared/js/base.js';

const app = document.getElementById('app');

function getRoute() {
  const params = new URLSearchParams(location.search);
  return {
    country: params.get('land'),
    profile: params.get('profil'),
  };
}

function navHtml(active) {
  return `
    <header class="nav">
      <a class="nav-brand" href="${appLink('/')}">
        <span class="nav-logo">🥛</span>
        <div><strong>gif this milk</strong><small>Entdecken</small></div>
      </a>
      <nav class="nav-links">
        <a class="nav-link ${active === 'discover' ? 'on' : ''}" href="${appLink('/discover/')}">Entdecken</a>
        <a class="nav-link ${active === 'match' ? 'on' : ''}" href="${appLink('/match/')}">Match</a>
        <a class="nav-link ${active === 'sortiment' ? 'on' : ''}" href="${appLink('/sortiment/')}">Spiel</a>
      </nav>
    </header>
  `;
}

function renderCountries() {
  app.innerHTML = `
    <div class="shell">
      ${navHtml('discover')}
      <section>
        <h1 class="section-title">Länder &amp; Sorten</h1>
        <p class="section-sub">Wähle ein Land — sieh alle Milch-Profile.</p>
        <div class="country-grid">
          ${COUNTRIES.map((c) => {
            const count = getProfilesByCountry(c.code).length;
            return `
              <button type="button" class="card country-card" data-country="${c.code}">
                <span class="country-flag">${c.flag}</span>
                <h3>${esc(c.name)}</h3>
                <span class="sorte">${esc(c.sorte)}</span>
                <span class="meta">${count} Profile · ${esc(c.tagline)}</span>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    </div>
  `;

  document.querySelectorAll('[data-country]').forEach((btn) => {
    btn.addEventListener('click', () => {
      location.search = `?land=${btn.dataset.country}`;
    });
  });
}

function renderCountry(code) {
  const country = getCountry(code);
  if (!country) {
    renderCountries();
    return;
  }

  const profiles = getProfilesByCountry(code);

  app.innerHTML = `
    <div class="shell">
      ${navHtml('discover')}
      <div class="back-row">
        <button type="button" class="back-btn" id="back-countries">← Alle Länder</button>
      </div>
      <section>
        <span class="tag">${country.flag} ${esc(country.sorte)}</span>
        <h1 class="section-title">${esc(country.name)}</h1>
        <p class="section-sub">${profiles.length} Profile · ${esc(country.tagline)}</p>
        <div class="profile-list">
          ${profiles.map((p) => `
            <article class="card profile-card" data-profile="${p.id}">
              <div class="avatar">${esc(initials(p.name))}</div>
              <div class="profile-body">
                <h3>${esc(p.name)} <span class="age">${p.age}</span></h3>
                <p class="profile-bio">${esc(p.bio)}</p>
                <div class="profile-tags">
                  <span class="chip">${esc(p.taste)}</span>
                  <span class="chip">${esc(p.aroma)}</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  document.getElementById('back-countries')?.addEventListener('click', () => {
    location.search = '';
  });

  document.querySelectorAll('[data-profile]').forEach((el) => {
    el.addEventListener('click', () => {
      location.search = `?land=${code}&profil=${el.dataset.profile}`;
    });
  });
}

function renderProfile(profileId, countryCode) {
  const profile = getProfileById(profileId);
  const country = getCountry(countryCode || profile?.country);
  if (!profile || !country) {
    renderCountries();
    return;
  }

  app.innerHTML = `
    <div class="shell">
      ${navHtml('discover')}
      <div class="back-row">
        <button type="button" class="back-btn" id="back-country">← ${esc(country.name)}</button>
      </div>
      <article class="card profile-detail">
        <div class="avatar avatar-lg">${esc(initials(profile.name))}</div>
        <div class="profile-detail-head">
          <h2>${esc(profile.name)}, ${profile.age}</h2>
          <p class="section-sub">${country.flag} ${esc(country.sorte)} · ${esc(profile.vibe || '')}</p>
        </div>
        <div class="detail-section">
          <h4>Bio</h4>
          <p>${esc(profile.bio)}</p>
        </div>
        <div class="detail-section">
          <h4>Geschmack</h4>
          <p>${esc(profile.taste)} · ${esc(profile.gender)}</p>
        </div>
        <div class="detail-section">
          <h4>Aroma</h4>
          <p>${esc(profile.aroma)} · ${esc(profile.sexuality)}</p>
        </div>
        <div class="detail-actions">
          <button type="button" class="btn btn-primary" id="use-profile">🥛 Mix mit ${esc(profile.name.split(' ')[0])} starten</button>
          <a class="btn btn-ghost" href="${appLink('/match/')}">💕 Erst matchen</a>
        </div>
      </article>
    </div>
  `;

  document.getElementById('back-country')?.addEventListener('click', () => {
    location.search = `?land=${country.code}`;
  });

  document.getElementById('use-profile')?.addEventListener('click', () => {
    saveSelection(profileToSelection(profile));
    location.href = appLink('/sortiment/');
  });
}

function render() {
  const { country, profile } = getRoute();
  if (profile) renderProfile(profile, country);
  else if (country) renderCountry(country);
  else renderCountries();
}

window.addEventListener('popstate', render);
render();
