import { CHANNEL_NAME, MILK_TYPES, createState, processEvent } from './engine.js';
import { bindOverlayUI, handleMilkEvent, updateLeaderboard, updateMeter } from './ui.js';

const channel = new BroadcastChannel(CHANNEL_NAME);
const state = createState();
const previewUi = bindOverlayUI('preview-');

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const milkCollection = document.getElementById('milk-collection');
const overlayUrl = document.getElementById('overlay-url');

const base = new URL('.', window.location.href);
overlayUrl.textContent = new URL('overlay.html', base).href;

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

function showOnPreview(result) {
  handleMilkEvent(previewUi, result, state);
}

function applyEvent(event) {
  const result = processEvent(event, state);
  showOnPreview(result);
  broadcast('milk-event', { event: result, state: snapshotState() });
  renderMilks();
  if (result.isNewUnlock) flashUnlock(result);
  return result;
}

function renderMilks() {
  milkCollection.innerHTML = MILK_TYPES.map((m) => {
    const isUnlocked = state.unlockedMilks.includes(m.id);
    return `<span class="milk-chip ${isUnlocked ? 'unlocked' : 'locked'}">${m.emoji} ${m.name}</span>`;
  }).join('');
}

function flashUnlock(result) {
  const chip = document.createElement('span');
  chip.className = 'milk-chip unlocked';
  chip.textContent = `✨ ${result.milk?.emoji} ${result.milk?.name} freigeschaltet!`;
  milkCollection.prepend(chip);
  setTimeout(() => chip.remove(), 3000);
}

document.querySelectorAll('[data-sim]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const payload = SIM_MAP[btn.dataset.sim]?.() || { type: 'simulate', simulate: btn.dataset.sim };
    applyEvent(payload);
  });
});

statusDot.style.background = '#4ade80';
statusText.textContent = 'Live-Vorschau aktiv — einfach Buttons drücken';
renderMilks();
updateMeter(previewUi, 0);
updateLeaderboard(previewUi, []);
broadcast('sync', { state: snapshotState() });

setTimeout(() => applyEvent(SIM_MAP['gift-small']()), 900);
