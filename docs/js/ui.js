export function bindOverlayUI(prefix = '') {
  const id = (name) => document.getElementById(`${prefix}${name}`);
  return {
    machine: id('machine'),
    stream: id('stream'),
    bottle: id('bottle'),
    bottleEmoji: id('bottle-emoji'),
    fountain: id('fountain'),
    particles: id('particles'),
    meterFill: id('meter-fill'),
    toast: id('toast'),
    toastText: id('toast-text'),
    gifTag: id('gif-tag'),
    leaderboardEl: id('leaderboard'),
  };
}

export function updateMeter(ui, level) {
  ui.meterFill.style.width = `${Math.min(100, level)}%`;
}

export function updateLeaderboard(ui, list) {
  ui.leaderboardEl.innerHTML = (list || [])
    .slice(0, 5)
    .map((e, i) => `<li>${i + 1}. @${e.user} — ${e.points} pts</li>`)
    .join('') || '<li>Noch niemand…</li>';
}

function spawnParticles(ui, count = 12) {
  ui.particles.innerHTML = '';
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
    ui.particles.appendChild(p);
  }
  setTimeout(() => { ui.particles.innerHTML = ''; }, 900);
}

export function playAnimation(ui, type, milk) {
  ui.machine.classList.remove('shake', 'explode');
  ui.stream.classList.remove('active');
  ui.bottle.classList.remove('show');
  ui.fountain.classList.remove('active');
  void ui.machine.offsetWidth;

  if (milk?.emoji) {
    ui.bottleEmoji.textContent = milk.emoji;
    if (milk.color) {
      ui.bottle.style.background = `linear-gradient(180deg, transparent 30%, ${milk.color} 30%)`;
    }
  }

  switch (type) {
    case 'press':
    case 'gift':
    case 'unlock':
      ui.machine.classList.add('shake');
      ui.stream.classList.add('active');
      setTimeout(() => {
        ui.stream.classList.remove('active');
        ui.bottle.classList.add('show');
      }, 600);
      break;
    case 'explosion':
    case 'legendary':
      ui.machine.classList.add('explode');
      spawnParticles(ui, 20);
      setTimeout(() => ui.bottle.classList.add('show'), 400);
      break;
    case 'fountain':
      ui.fountain.classList.add('active');
      spawnParticles(ui, 16);
      break;
    case 'bubble':
      ui.stream.classList.add('active');
      setTimeout(() => ui.stream.classList.remove('active'), 400);
      break;
    default:
      ui.bottle.classList.add('show');
  }
}

export function showToast(ui, event) {
  ui.toastText.textContent = event.message || 'Milch!';
  ui.gifTag.textContent = event.isNewUnlock
    ? `✨ NEU: ${event.gifCaption}`
    : (event.gifCaption || 'gif this milk');
  ui.toast.classList.add('visible');
  setTimeout(() => ui.toast.classList.remove('visible'), 4000);
}

export function handleMilkEvent(ui, event, state) {
  playAnimation(ui, event.animation, event.milk);
  showToast(ui, event);
  if (state) {
    updateMeter(ui, state.milkLevel);
    updateLeaderboard(ui, state.leaderboard);
  }
}
