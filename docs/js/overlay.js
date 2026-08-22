import { CHANNEL_NAME } from './engine.js';
import { bindOverlayUI, handleMilkEvent, updateLeaderboard, updateMeter } from './ui.js';

const ui = bindOverlayUI();
const channel = new BroadcastChannel(CHANNEL_NAME);

if (new URLSearchParams(location.search).get('preview') === '1') {
  document.body.classList.add('overlay-preview');
}

channel.onmessage = ({ data }) => {
  if (data.type === 'sync') {
    updateMeter(ui, data.state.milkLevel);
    updateLeaderboard(ui, data.state.leaderboard);
    return;
  }
  if (data.type === 'milk-event') {
    handleMilkEvent(ui, data.event, data.state);
  }
};

updateMeter(ui, 0);
updateLeaderboard(ui, []);
if (ui.toastText) {
  ui.toastText.textContent = 'Live — gif this milk';
  ui.toast?.classList.add('visible');
  setTimeout(() => ui.toast?.classList.remove('visible'), 2000);
}
