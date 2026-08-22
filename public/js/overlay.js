const socket = io();

const machine = document.getElementById('machine');
const stream = document.getElementById('stream');
const bottle = document.getElementById('bottle');
const bottleEmoji = document.getElementById('bottle-emoji');
const fountain = document.getElementById('fountain');
const particles = document.getElementById('particles');
const meterFill = document.getElementById('meter-fill');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const gifTag = document.getElementById('gif-tag');
const leaderboardEl = document.getElementById('leaderboard');

function updateMeter(level) {
  meterFill.style.width = `${Math.min(100, level)}%`;
}

function updateLeaderboard(list) {
  leaderboardEl.innerHTML = (list || [])
    .slice(0, 5)
    .map((e, i) => `<li>${i + 1}. @${e.user} — ${e.points} pts</li>`)
    .join('') || '<li>Noch niemand…</li>';
}

function spawnParticles(count = 12) {
  particles.innerHTML = '';
  const cx = 210;
  const cy = 90;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / count + Math.random();
    const dist = 40 + Math.random() * 60;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 30}px`);
    particles.appendChild(p);
  }
  setTimeout(() => { particles.innerHTML = ''; }, 900);
}

function playAnimation(type, milk) {
  machine.classList.remove('shake', 'explode');
  stream.classList.remove('active');
  bottle.classList.remove('show');
  fountain.classList.remove('active');

  void machine.offsetWidth;

  if (milk?.emoji) {
    bottleEmoji.textContent = milk.emoji;
    if (milk.color) {
      bottle.style.background = `linear-gradient(180deg, transparent 30%, ${milk.color} 30%)`;
    }
  }

  switch (type) {
    case 'press':
    case 'gift':
    case 'unlock':
      machine.classList.add('shake');
      stream.classList.add('active');
      setTimeout(() => {
        stream.classList.remove('active');
        bottle.classList.add('show');
      }, 600);
      break;
    case 'explosion':
    case 'legendary':
      machine.classList.add('explode');
      spawnParticles(20);
      setTimeout(() => bottle.classList.add('show'), 400);
      break;
    case 'fountain':
      fountain.classList.add('active');
      spawnParticles(16);
      break;
    case 'bubble':
      stream.classList.add('active');
      setTimeout(() => stream.classList.remove('active'), 400);
      break;
    default:
      bottle.classList.add('show');
  }
}

function showToast(event) {
  toastText.textContent = event.message || 'Milch!';
  gifTag.textContent = event.gifCaption || 'gif this milk';
  if (event.isNewUnlock) {
    gifTag.textContent = `✨ NEU: ${event.gifCaption}`;
  }
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 4000);
}

socket.on('state', (state) => {
  updateMeter(state.milkLevel);
  updateLeaderboard(state.leaderboard);
});

socket.on('milk-event', (event) => {
  playAnimation(event.animation, event.milk);
  showToast(event);
});

socket.on('connect', () => {
  toastText.textContent = 'Live — gif this milk';
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
});
