import { CHANNEL_NAME, MILK_TYPES, createState, processEvent } from './engine.js';
import { bindOverlayUI, handleMilkEvent, updateLeaderboard, updateMeter } from './ui.js';

const ui = bindOverlayUI();
const channel = new BroadcastChannel(CHANNEL_NAME);

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
ui.toastText.textContent = 'Live — gif this milk';
ui.toast.classList.add('visible');
setTimeout(() => ui.toast.classList.remove('visible'), 2000);
