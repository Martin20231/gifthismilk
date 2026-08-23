import {
  getCountry,
  getUnswipedProfiles,
  getMatches,
  saveMatch,
  saveSwiped,
  profileToSelection,
  saveSelection,
} from '../../shared/js/data.js';
import { appLink, esc, initials } from '../../shared/js/base.js';

const app = document.getElementById('app');
let deck = [];
let matchPopup = null;

function navHtml() {
  return `
    <header class="nav">
      <a class="nav-brand" href="${appLink('/')}">
        <span class="nav-logo">🥛</span>
        <div><strong>gif this milk</strong><small>Match</small></div>
      </a>
      <nav class="nav-links">
        <a class="nav-link" href="${appLink('/discover/')}">Entdecken</a>
        <a class="nav-link on" href="${appLink('/match/')}">Match</a>
        <a class="nav-link" href="${appLink('/sortiment/')}">Spiel</a>
      </nav>
    </header>
  `;
}

function renderEmpty() {
  app.innerHTML = `
    <div class="shell">
      ${navHtml()}
      <div class="card empty-state">
        <h2>Alle durchgeswiped! 🥛</h2>
        <p>Du hast alle Profile gesehen. Schau in deine Matches oder entdecke die Länder nochmal.</p>
        <a class="btn btn-primary" href="${appLink('/discover/')}">🌍 Länder ansehen</a>
        <a class="btn btn-ghost" href="${appLink('/sortiment/')}" style="margin-top:8px">🥛 Spiel starten</a>
      </div>
    </div>
  `;
}

function showMatchPopup(profile) {
  const country = getCountry(profile.country);
  matchPopup = document.createElement('div');
  matchPopup.className = 'match-overlay';
  matchPopup.innerHTML = `
    <div class="card match-popup">
      <div class="avatar avatar-lg" style="margin:0 auto 12px">${esc(initials(profile.name))}</div>
      <h2>It's a Match! 💕</h2>
      <p>${esc(profile.name)} aus ${country?.flag ?? ''} ${esc(country?.name ?? '')} passt zu deinem Geschmack.</p>
      <button type="button" class="btn btn-primary" id="popup-play">🥛 Mix starten</button>
      <button type="button" class="btn btn-ghost" id="popup-continue">Weiter swipen</button>
    </div>
  `;
  document.body.appendChild(matchPopup);

  matchPopup.querySelector('#popup-play')?.addEventListener('click', () => {
    saveSelection(profileToSelection(profile));
    location.href = appLink('/sortiment/');
  });
  matchPopup.querySelector('#popup-continue')?.addEventListener('click', () => {
    matchPopup.remove();
    matchPopup = null;
  });
  matchPopup.addEventListener('click', (e) => {
    if (e.target === matchPopup) {
      matchPopup.remove();
      matchPopup = null;
    }
  });
}

function swipe(profile, liked) {
  saveSwiped(profile.id);
  if (liked) {
    saveMatch(profile.id);
    setTimeout(() => showMatchPopup(profile), 350);
  }
  deck.shift();
  renderDeck();
}

function bindSwipeCard(cardEl, profile) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;
  const stampLike = cardEl.querySelector('.stamp-like');
  const stampNope = cardEl.querySelector('.stamp-nope');

  function setTransform(x) {
    const rot = x * 0.06;
    cardEl.style.transform = `translateX(${x}px) rotate(${rot}deg)`;
    const opacity = Math.min(Math.abs(x) / 100, 1);
    if (stampLike) stampLike.style.opacity = x > 30 ? opacity : 0;
    if (stampNope) stampNope.style.opacity = x < -30 ? opacity : 0;
  }

  function onStart(x) {
    dragging = true;
    startX = x;
    currentX = 0;
    cardEl.style.transition = 'none';
  }

  function onMove(x) {
    if (!dragging) return;
    currentX = x - startX;
    setTransform(currentX);
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    cardEl.style.transition = '';
    if (currentX > 90) {
      cardEl.classList.add('exiting-right');
      swipe(profile, true);
    } else if (currentX < -90) {
      cardEl.classList.add('exiting-left');
      swipe(profile, false);
    } else {
      setTransform(0);
      if (stampLike) stampLike.style.opacity = 0;
      if (stampNope) stampNope.style.opacity = 0;
    }
  }

  cardEl.addEventListener('pointerdown', (e) => {
    cardEl.setPointerCapture(e.pointerId);
    onStart(e.clientX);
  });
  cardEl.addEventListener('pointermove', (e) => onMove(e.clientX));
  cardEl.addEventListener('pointerup', onEnd);
  cardEl.addEventListener('pointercancel', onEnd);
}

function cardHtml(profile, zIndex) {
  const country = getCountry(profile.country);
  return `
    <article class="card swipe-card" style="z-index:${zIndex}" data-id="${profile.id}">
      <span class="stamp stamp-nope">NOPE</span>
      <span class="stamp stamp-like">MATCH</span>
      <div class="swipe-top">
        <div class="avatar avatar-lg">${esc(initials(profile.name))}</div>
        <div>
          <h2>${esc(profile.name)}, ${profile.age}</h2>
          <p class="sub">${country?.flag ?? ''} ${esc(country?.sorte ?? '')}</p>
        </div>
      </div>
      <div class="swipe-tags">
        <span class="chip">${esc(profile.taste)}</span>
        <span class="chip">${esc(profile.aroma)}</span>
        <span class="chip">${esc(profile.gender)}</span>
      </div>
      <p class="swipe-bio">${esc(profile.bio)}</p>
      <p class="swipe-vibe">✨ ${esc(profile.vibe || 'Einzigartiger Mix')}</p>
    </article>
  `;
}

function renderDeck() {
  if (!deck.length) {
    renderEmpty();
    return;
  }

  const matches = getMatches().length;
  const remaining = deck.length;

  app.innerHTML = `
    <div class="shell">
      ${navHtml()}
      <h1 class="section-title">Milch-Match</h1>
      <p class="section-sub">Swipe rechts = Match · links = Nope</p>
      <div class="match-stats">
        <span>❤️ <strong>${matches}</strong> Matches</span>
        <span>🃏 <strong>${remaining}</strong> übrig</span>
      </div>
      <div class="deck-wrap" id="deck">
        ${deck.slice(0, 2).reverse().map((p, i) => cardHtml(p, i + 1)).join('')}
      </div>
      <div class="swipe-actions">
        <button type="button" class="action-btn action-nope" id="btn-nope" aria-label="Nope">✕</button>
        <button type="button" class="action-btn action-like" id="btn-like" aria-label="Match">❤️</button>
      </div>
    </div>
  `;

  const topCard = document.querySelector('.swipe-card[data-id="' + deck[0].id + '"]');
  if (topCard) bindSwipeCard(topCard, deck[0]);

  document.getElementById('btn-nope')?.addEventListener('click', () => {
    topCard?.classList.add('exiting-left');
    swipe(deck[0], false);
  });
  document.getElementById('btn-like')?.addEventListener('click', () => {
    topCard?.classList.add('exiting-right');
    swipe(deck[0], true);
  });
}

function init() {
  deck = getUnswipedProfiles();
  renderDeck();
}

init();
