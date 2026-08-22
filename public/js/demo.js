const socket = io();

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const milkCollection = document.getElementById('milk-collection');
const overlayUrl = document.getElementById('overlay-url');

overlayUrl.textContent = `${window.location.origin}/overlay.html`;

const SIM_USERS = ['milchfan42', 'tiktok_melker', 'rose_queen', 'chaos_cow', 'gif_master'];

function randomUser() {
  return SIM_USERS[Math.floor(Math.random() * SIM_USERS.length)];
}

const SIM_MAP = {
  chat: () => ({ simulate: 'chat', user: randomUser(), action: 'press' }),
  like: () => ({ type: 'like', user: randomUser(), likeCount: 15 + Math.floor(Math.random() * 30) }),
  'gift-small': () => ({ type: 'gift', user: randomUser(), giftName: 'Rose', diamondCount: 1 }),
  'gift-medium': () => ({ type: 'gift', user: randomUser(), giftName: 'Finger Heart', diamondCount: 35 }),
  'gift-large': () => ({ type: 'gift', user: randomUser(), giftName: 'Universe', diamondCount: 150 }),
  follow: () => ({ type: 'follow', user: randomUser() }),
  fountain: () => ({ type: 'like', user: 'CROWD', likeCount: 500 }),
};

document.querySelectorAll('[data-sim]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sim;
    const payload = SIM_MAP[key]?.() || { simulate: key };
    socket.emit('simulate', payload);
  });
});

async function loadMilks() {
  const res = await fetch('/api/milks');
  const milks = await res.json();
  return milks;
}

function renderMilks(unlocked) {
  loadMilks().then((milks) => {
    milkCollection.innerHTML = milks
      .map((m) => {
        const isUnlocked = unlocked.includes(m.id);
        return `<span class="milk-chip ${isUnlocked ? 'unlocked' : 'locked'}">${m.emoji} ${m.name}</span>`;
      })
      .join('');
  });
}

socket.on('connect', () => {
  statusDot.style.background = '#4ade80';
  statusText.textContent = 'Verbunden — Events gehen live ans Overlay';
});

socket.on('disconnect', () => {
  statusDot.style.background = '#f87171';
  statusText.textContent = 'Getrennt';
});

socket.on('state', (state) => {
  renderMilks(state.unlockedMilks);
});

socket.on('milk-event', (event) => {
  if (event.isNewUnlock) {
    const chip = document.createElement('span');
    chip.className = 'milk-chip unlocked';
    chip.textContent = `✨ ${event.milk?.emoji} ${event.milk?.name} freigeschaltet!`;
    chip.style.animation = 'pulse 0.5s ease 3';
    milkCollection.prepend(chip);
    setTimeout(() => chip.remove(), 3000);
  }
});
