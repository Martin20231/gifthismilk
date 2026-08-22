export function bindOverlayUI(prefix = '') {
  const id = (name) => document.getElementById(`${prefix}${name}`);
  const card = id('machine')?.closest('.overlay-card') || null;
  return {
    card,
    machine: id('machine'),
    stream: id('stream'),
    bottle: id('bottle'),
    bottleLiquid: id('bottle-liquid'),
    bottleEmoji: id('bottle-emoji'),
    tankLiquid: id('tank-liquid'),
    fountain: id('fountain'),
    particles: id('particles'),
    floatLayer: id('float-layer'),
    flash: id('flash'),
    gifBanner: id('gif-banner'),
    gifEmoji: id('gif-emoji'),
    gifTitle: id('gif-title'),
    gifSub: id('gif-sub'),
    meterFill: id('meter-fill'),
    meterLabel: id('meter-label'),
    toast: id('toast'),
    toastText: id('toast-text'),
    gifTag: id('gif-tag'),
    leaderboardEl: id('leaderboard'),
  };
}

export function updateMeter(ui, level) {
  if (!ui.meterFill) return;
  const pct = Math.min(100, level);
  ui.meterFill.style.width = `${pct}%`;
  ui.meterFill.classList.toggle('full', pct >= 95);
  if (ui.meterLabel) ui.meterLabel.textContent = `${Math.round(pct)}%`;
  if (ui.tankLiquid) ui.tankLiquid.style.height = `${30 + pct * 0.45}%`;
}

export function updateLeaderboard(ui, list) {
  if (!ui.leaderboardEl) return;
  ui.leaderboardEl.innerHTML = (list || [])
    .slice(0, 5)
    .map((e, i) => `<li>${i + 1}. @${e.user} — ${e.points} pts</li>`)
    .join('') || '<li>Noch niemand…</li>';
}

function spawnParticles(ui, count, milk) {
  if (!ui.particles) return;
  ui.particles.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / count;
    const dist = 30 + Math.random() * 50;
    p.style.left = '50%';
    p.style.top = '40%';
    if (milk?.color) p.style.background = milk.color;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 20}px`);
    ui.particles.appendChild(p);
  }
  setTimeout(() => { ui.particles.innerHTML = ''; }, 850);
}

function floatTag(ui, text) {
  if (!ui.floatLayer) return;
  const tag = document.createElement('div');
  tag.className = 'float-tag';
  tag.textContent = text;
  ui.floatLayer.appendChild(tag);
  setTimeout(() => tag.remove(), 900);
}

function setColors(ui, milk) {
  if (!milk?.color) return;
  if (ui.bottleLiquid) {
    ui.bottleLiquid.style.background = `linear-gradient(180deg, rgba(255,255,255,0.3), ${milk.color})`;
  }
  if (ui.tankLiquid) {
    ui.tankLiquid.style.background = `linear-gradient(180deg, rgba(255,255,255,0.45), ${milk.color})`;
  }
}

function showGifBanner(ui, event) {
  if (!ui.gifBanner) return;
  ui.gifEmoji.textContent = event.milk?.emoji || '🥛';
  ui.gifTitle.textContent = event.milk?.name || 'gif this milk';
  ui.gifSub.textContent = event.isNewUnlock ? '✨ Neu freigeschaltet' : `@${event.user}`;
  ui.gifBanner.classList.remove('show');
  void ui.gifBanner.offsetWidth;
  ui.gifBanner.classList.add('show');
}

export function playAnimation(ui, type, milk) {
  if (!ui.machine) return;

  ui.machine.classList.remove('shake', 'explode');
  ui.stream?.classList.remove('active');
  ui.bottle?.classList.remove('show');
  ui.fountain?.classList.remove('active');
  void ui.machine.offsetWidth;

  if (milk?.emoji && ui.bottleEmoji) ui.bottleEmoji.textContent = milk.emoji;
  setColors(ui, milk);

  if (['explosion', 'legendary', 'fountain'].includes(type) && ui.card) {
    ui.card.classList.remove('shake-card');
    void ui.card.offsetWidth;
    ui.card.classList.add('shake-card');
  }

  switch (type) {
    case 'press':
    case 'gift':
    case 'unlock':
      ui.machine.classList.add('shake');
      ui.stream?.classList.add('active');
      floatTag(ui, '+GIF');
      setTimeout(() => {
        ui.stream?.classList.remove('active');
        ui.bottle?.classList.add('show');
      }, 550);
      break;
    case 'explosion':
    case 'legendary':
      ui.machine.classList.add('explode');
      ui.flash?.classList.add('active');
      setTimeout(() => ui.flash?.classList.remove('active'), 350);
      spawnParticles(ui, 16, milk);
      setTimeout(() => ui.bottle?.classList.add('show'), 350);
      break;
    case 'fountain':
      ui.fountain?.classList.add('active');
      ui.flash?.classList.add('active');
      setTimeout(() => ui.flash?.classList.remove('active'), 350);
      spawnParticles(ui, 14, milk);
      break;
    case 'bubble':
      ui.stream?.classList.add('active');
      setTimeout(() => ui.stream?.classList.remove('active'), 400);
      break;
    default:
      ui.bottle?.classList.add('show');
  }
}

export function showToast(ui, event) {
  if (ui.toastText) ui.toastText.textContent = event.message || 'Milch!';
  if (ui.gifTag) {
    ui.gifTag.textContent = event.isNewUnlock
      ? `✨ NEU: ${event.gifCaption}`
      : (event.gifCaption || 'gif this milk');
  }
  ui.toast?.classList.add('visible');
  showGifBanner(ui, event);
  setTimeout(() => ui.toast?.classList.remove('visible'), 4000);
}

export function handleMilkEvent(ui, event, state) {
  playAnimation(ui, event.animation, event.milk);
  showToast(ui, event);
  if (state) {
    updateMeter(ui, state.milkLevel);
    updateLeaderboard(ui, state.leaderboard);
  }
}
