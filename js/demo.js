import { CHANNEL_NAME, MILK_TYPES, createState, processEvent } from './engine.js';
import { bindOverlayUI, handleMilkEvent, updateLeaderboard, updateMeter } from './ui.js';

const channel = new BroadcastChannel(CHANNEL_NAME);
const state = createState();
const previewUi = bindOverlayUI('preview-');

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const milkCollection = document.getElementById('milk-collection');
const overlayUrl = document.getElementById('overlay-url');

overlayUrl.textContent = new URL('overlay.html', window.location.href).href;

const SIM_USERS = ['milchfan42', 'tiktok_melker', 'rose_queen', 'chaos_cow', 'gif_master'];

function randomUser() {
  return SIM_USERS[Math.floor(Math.random() * SIM_USERS.length)];
}

const SIM_MAP = {
  chat: () => ({ type: 'simulate', simulate: 'chat', user: randomUser(), action: 'press' }),
  like: () => ({ type: 'like', user: randomUser(), likeCount: 15 + Math.floor(Math.random() * 30) }),
  'gift-small': () => ({ type: 'gift', user: randomUser(), giftName: 'Rose', diamondCount: 1 }),
  'gift-medium': () => ({ type: 'gift', user: randomUser(), giftName: 'Finger Heart', diamondCount: 35 }),
  'gift-large': () => ({ type: 'gift', user: randomUser(), giftName: 'Universe', diamondCount: 150 }),
  follow: () => ({ type: 'follow', user: randomUser() }),
  fountain: () => ({ type: 'like', user: 'CROWD', likeCount: 500 }),
};

function snapshotState() {
  return {
    ...state,
    leaderboard: [...state.leaderboard],
    unlockedMilks: [...state.unlockedMilks],
  };
}

function broadcast(type, payload) {
  channel.postMessage({ type, ...payload });
}

function applyEvent(event) {
  const result = processEvent(event, state);
  handleMilkEvent(previewUi, result, state);
  broadcast('milk-event', { event: result, state: snapshotState() });
  renderMilks();
  if (result.isNewUnlock) flashUnlock(result);
  return result;
}

function renderMilks() {
  milkCollection.innerHTML = MILK_TYPES.map((m) => {
    const isUnlocked = state.unlockedMilks.includes(m.id);
    return `<span class="milk-chip ${isUnlocked ? 'unlocked' : 'locked'}">${m.emoji}<br>${m.name}</span>`;
  }).join('');
}

function flashUnlock(result) {
  const chip = document.createElement('span');
  chip.className = 'milk-chip unlocked';
  chip.innerHTML = `✨<br>${result.milk?.emoji} ${result.milk?.name}`;
  milkCollection.prepend(chip);
  setTimeout(() => chip.remove(), 3200);
}

function ripple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const rippleEl = document.createElement('span');
  rippleEl.className = 'btn-ripple';
  rippleEl.style.width = rippleEl.style.height = `${size}px`;
  rippleEl.style.left = `${e.clientX - rect.left - size / 2}px`;
  rippleEl.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(rippleEl);
  setTimeout(() => rippleEl.remove(), 600);
}

document.querySelectorAll('[data-sim]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    ripple(btn, e);
    const payload = SIM_MAP[btn.dataset.sim]?.() || { type: 'simulate', simulate: btn.dataset.sim };
    applyEvent(payload);
  });
});

statusDot.style.background = '#4ade80';
statusText.textContent = 'Live — tippe auf einen Button';
renderMilks();
updateMeter(previewUi, 0);
updateLeaderboard(previewUi, []);
broadcast('sync', { state: snapshotState() });

const intro = [
  ['gift-small', 800],
  ['gift-medium', 2400],
  ['gift-large', 4200],
];
intro.forEach(([key, delay]) => {
  setTimeout(() => applyEvent(SIM_MAP[key]()), delay);
});
