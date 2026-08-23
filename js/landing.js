import { appLink } from '../shared/js/base.js';

const nav = document.getElementById('nav-links');
const actions = document.getElementById('hero-actions');

nav.innerHTML = `
  <a class="nav-link" href="${appLink('/discover/')}">Entdecken</a>
  <a class="nav-link" href="${appLink('/match/')}">Match</a>
  <a class="nav-link" href="${appLink('/sortiment/')}">Spiel</a>
`;

actions.innerHTML = `
  <a class="btn btn-primary" href="${appLink('/discover/')}">🌍 Länder entdecken</a>
  <a class="btn btn-ghost" href="${appLink('/match/')}">💕 Jetzt matchen</a>
  <a class="btn btn-ghost" href="${appLink('/sortiment/')}">🥛 Direkt spielen</a>
`;
