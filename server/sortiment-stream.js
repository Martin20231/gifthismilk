/**
 * Shared sortiment glass state for all TikTok Live viewers.
 * Likes fill the glass; chat "trinken" drinks when full.
 */

const DEFAULT_STATE = () => ({
  fill: 0,
  likes: 0,
  drunk: 0,
  pouring: false,
  drinking: false,
  toast: '',
  lastActor: null,
  profile: null,
  live: false,
  updatedAt: Date.now(),
});

let state = DEFAULT_STATE();
let pourTimer = null;
let drinkTimer = null;
let broadcastFn = () => {};

function setBroadcaster(fn) {
  broadcastFn = fn;
}

function emit() {
  state.updatedAt = Date.now();
  broadcastFn({ ...state });
}

function resetTimers() {
  if (pourTimer) clearTimeout(pourTimer);
  if (drinkTimer) clearTimeout(drinkTimer);
  pourTimer = null;
  drinkTimer = null;
}

function resetState(profile = null) {
  resetTimers();
  state = { ...DEFAULT_STATE(), profile, live: !!profile };
  emit();
  return state;
}

function getState() {
  return { ...state };
}

function setProfile(profile) {
  state.profile = profile;
  state.live = true;
  emit();
}

function handleLike(event) {
  if (state.drinking) return state;

  const user = event.user || 'Zuschauer';
  const count = Math.max(1, event.likeCount || 1);

  if (state.fill >= 100) {
    state.toast = `❤️ ${user} — Glas ist schon voll! Schreib „trinken“`;
    state.lastActor = user;
    emit();
    return state;
  }

  state.likes += count;
  const boost = Math.min(
    100 - state.fill,
    (5 + Math.floor(Math.random() * 7)) * Math.min(count, 5),
  );
  state.fill = Math.min(100, state.fill + boost);
  state.pouring = true;
  state.drinking = false;
  state.toast = `❤️ ${user} +${boost}% Milch!`;
  state.lastActor = user;
  emit();

  if (pourTimer) clearTimeout(pourTimer);
  pourTimer = setTimeout(() => {
    state.pouring = false;
    if (state.fill >= 100) state.toast = '🥛 Glas voll — schreib „trinken“ im Chat!';
    emit();
  }, 700);

  return state;
}

function handleDrink(event) {
  const user = event.user || 'Zuschauer';

  if (state.fill < 100) {
    state.toast = `💬 ${user}: noch ${Math.round(100 - state.fill)}% bis voll`;
    state.lastActor = user;
    emit();
    return state;
  }

  if (state.drinking) return state;

  state.drunk += 1;
  state.drinking = true;
  state.pouring = false;
  state.toast = `🥤 ${user} trinkt! gif this milk!`;
  state.lastActor = user;
  emit();

  if (drinkTimer) clearTimeout(drinkTimer);
  drinkTimer = setTimeout(() => {
    state.fill = 0;
    state.drinking = false;
    state.toast = `${state.drunk}× getrunken — weiter liken!`;
    emit();
  }, 1400);

  return state;
}

function isDrinkCommand(comment) {
  const text = (comment || '').trim().toLowerCase();
  return text === 'trinken' || text === '!trinken' || text.startsWith('trinken ');
}

module.exports = {
  setBroadcaster,
  getState,
  resetState,
  setProfile,
  handleLike,
  handleDrink,
  isDrinkCommand,
};
