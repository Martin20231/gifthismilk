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
    gifCard: id('gif-card'),
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
  if (ui.tankLiquid) {
    ui.tankLiquid.style.height = `${28 + pct * 0.5}%`;
    if (pct >= 95) ui.tankLiquid.classList.add('bubble');
    else ui.tankLiquid.classList.remove('bubble');
  }
}

export function updateLeaderboard(ui, list) {
  if (!ui.leaderboardEl) return;
  ui.leaderboardEl.innerHTML = (list || [])
    .slice(0, 5)
    .map((e, i) => `<li>${i + 1}. @${e.user} — ${e.points} pts</li>`)
    .join('') || '<li>Noch niemand…</li>';
}

function spawnParticles(ui, count = 14, milk) {
  if (!ui.particles) return;
  ui.particles.innerHTML = '';
  const cx = 210;
  const cy = 100;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = `particle ${i % 3 === 0 ? 'spark' : 'splash'}`;
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 35 + Math.random() * 75;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    if (milk?.color && i % 3 !== 0) p.style.background = milk.color;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist - 35}px`);
    ui.particles.appendChild(p);
  }
  setTimeout(() => { ui.particles.innerHTML = ''; }, 950);
}

function floatTag(ui, text) {
  if (!ui.floatLayer) return;
  const tag = document.createElement('div');
  tag.className = 'float-tag';
  tag.textContent = text;
  ui.floatLayer.appendChild(tag);
  setTimeout(() => tag.remove(), 1100);
}

function flash(ui) {
  if (!ui.flash) return;
  ui.flash.classList.remove('active');
  void ui.flash.offsetWidth;
  ui.flash.classList.add('active');
}

function showGifCard(ui, event) {
  if (!ui.gifCard) return;
  ui.gifEmoji.textContent = event.milk?.emoji || '🥛';
  ui.gifTitle.textContent = event.milk?.name || 'gif this milk';
  ui.gifSub.textContent = event.isNewUnlock ? '✨ NEU freigeschaltet' : `@${event.user}`;
  ui.gifCard.classList.remove('show');
  void ui.gifCard.offsetWidth;
  ui.gifCard.classList.add('show');
}

function setBottleColor(ui, milk) {
  if (!ui.bottleLiquid || !milk?.color) return;
  ui.bottleLiquid.style.background = `linear-gradient(180deg, rgba(255,255,255,0.35), ${milk.color})`;
  if (ui.tankLiquid) {
    ui.tankLiquid.style.background = `linear-gradient(180deg, rgba(255,255,255,0.55), ${milk.color} 40%, var(--milk-dark))`;
  }
}

export function playAnimation(ui, type, milk) {
  if (!ui.machine) return;

  ui.machine.classList.remove('shake', 'explode', 'pour-active');
  ui.stream?.classList.remove('active');
  ui.bottle?.classList.remove('show', 'pop');
  ui.fountain?.classList.remove('active');
  void ui.machine.offsetWidth;

  if (milk?.emoji && ui.bottleEmoji) ui.bottleEmoji.textContent = milk.emoji;
  setBottleColor(ui, milk);

  const cardShake = ['explosion', 'legendary', 'fountain'].includes(type);
  if (cardShake && ui.card) {
    ui.card.classList.remove('shake-card');
    void ui.card.offsetWidth;
    ui.card.classList.add('shake-card');
  }

  switch (type) {
    case 'press':
    case 'gift':
    case 'unlock':
      ui.machine.classList.add('shake', 'pour-active');
      ui.stream?.classList.add('active');
      floatTag(ui, type === 'gift' ? '+GIF' : 'SQUEEZE');
      setTimeout(() => {
        ui.stream?.classList.remove('active');
        ui.machine.classList.remove('pour-active');
        ui.bottle?.classList.add('show', 'pop');
      }, 650);
      break;
    case 'explosion':
    case 'legendary':
      ui.machine.classList.add('explode');
      flash(ui);
      spawnParticles(ui, 26, milk);
      floatTag(ui, type === 'legendary' ? 'LEGENDARY' : 'CHAOS');
      setTimeout(() => ui.bottle?.classList.add('show', 'pop'), 420);
      break;
    case 'fountain':
      ui.fountain?.classList.add('active');
      flash(ui);
      spawnParticles(ui, 22, milk);
      floatTag(ui, 'FONTÄNE');
      break;
    case 'bubble':
      ui.stream?.classList.add('active');
      ui.machine.classList.add('pour-active');
      setTimeout(() => {
        ui.stream?.classList.remove('active');
        ui.machine.classList.remove('pour-active');
      }, 450);
      break;
    default:
      ui.bottle?.classList.add('show');
  }
}

export function showToast(ui, event) {
  if (!ui.toast) return;
  ui.toastText.textContent = event.message || 'Milch!';
  ui.gifTag.textContent = event.isNewUnlock
    ? `✨ NEU: ${event.gifCaption}`
    : (event.gifCaption || 'gif this milk');
  ui.toast.classList.add('visible');
  showGifCard(ui, event);
  setTimeout(() => ui.toast.classList.remove('visible'), 4500);
}

export function handleMilkEvent(ui, event, state) {
  playAnimation(ui, event.animation, event.milk);
  showToast(ui, event);
  if (state) {
    updateMeter(ui, state.milkLevel);
    updateLeaderboard(ui, state.leaderboard);
  }
}
