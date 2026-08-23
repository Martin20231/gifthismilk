import { connectStream, onStreamState } from '../sortiment/js/stream-client.js';

const els = {
  milk: document.getElementById('glass-milk'),
  meter: document.getElementById('meter-fill'),
  label: document.getElementById('meter-label'),
  stats: document.getElementById('meter-stats'),
  toast: document.getElementById('toast'),
  glass: document.getElementById('glass'),
  stream: document.getElementById('pour-stream'),
  badge: document.getElementById('mode-badge'),
};

let state = { fill: 0, likes: 0, drunk: 0, pouring: false, drinking: false, toast: '' };

function render() {
  els.milk.style.height = `${state.fill}%`;
  els.meter.style.width = `${state.fill}%`;
  els.label.textContent = state.fill >= 100 ? '🥛 Voll — trinken!' : `${Math.round(state.fill)}%`;
  els.stats.textContent = `❤️ ${state.likes} · 🥤 ${state.drunk}×`;
  els.toast.textContent = state.toast || '❤️ Like füllt · trinken leert';
  els.stream.classList.toggle('on', !!state.pouring);
  els.glass.classList.toggle('shake', !!state.drinking);
}

function apply(data) {
  if (data.mode === 'demo') {
    els.badge.textContent = 'DEMO';
    els.badge.classList.remove('live');
    return;
  }
  if (data.connected === false) {
    els.badge.textContent = '…';
    els.badge.classList.remove('live');
    return;
  }
  els.badge.textContent = 'LIVE';
  els.badge.classList.add('live');
  if (data.fill !== undefined) {
    state = {
      fill: data.fill,
      likes: data.likes ?? 0,
      drunk: data.drunk ?? 0,
      pouring: data.pouring ?? false,
      drinking: data.drinking ?? false,
      toast: data.toast ?? '',
    };
    render();
  }
}

onStreamState(apply);
connectStream();
render();
