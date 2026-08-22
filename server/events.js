const MILK_TYPES = [
  { id: 'classic', name: 'Classic Milk', emoji: '🥛', color: '#f5f0e8', unlock: 'default' },
  { id: 'sad', name: 'Traurige Milch', emoji: '😢', color: '#9eb4c8', unlock: 'gift_small' },
  { id: 'existential', name: 'Existenzielle Milch', emoji: '🌀', color: '#6b5b95', unlock: 'gift_medium' },
  { id: 'chaos', name: 'Chaos-Milch', emoji: '💥', color: '#ff6b35', unlock: 'gift_large' },
  { id: 'legendary', name: 'Legendäre Milch', emoji: '👑', color: '#ffd700', unlock: 'follow' },
];

function pickRandomMilk(unlocked = ['classic']) {
  const pool = MILK_TYPES.filter((m) => unlocked.includes(m.id));
  return pool[Math.floor(Math.random() * pool.length)] || MILK_TYPES[0];
}

function addToLeaderboard(state, user, points) {
  const entry = state.leaderboard.find((e) => e.user === user);
  if (entry) {
    entry.points += points;
  } else {
    state.leaderboard.push({ user, points });
  }
  state.leaderboard.sort((a, b) => b.points - a.points);
  state.leaderboard = state.leaderboard.slice(0, 10);
}

function unlockMilk(state, milkId) {
  if (!state.unlockedMilks.includes(milkId)) {
    state.unlockedMilks.push(milkId);
    return true;
  }
  return false;
}

function processEvent(event, state) {
  const timestamp = Date.now();
  let result = {
    timestamp,
    type: event.type,
    user: event.user || 'Zuschauer',
    animation: 'drip',
    message: '',
    milk: MILK_TYPES[0],
    isNewUnlock: false,
    gifCaption: 'gif this milk',
  };

  switch (event.type) {
    case 'chat':
    case 'simulate':
      if (event.action === 'press' || event.simulate === 'chat') {
        result.animation = 'press';
        result.milk = event.milk || pickRandomMilk(state.unlockedMilks);
        result.message = `${result.user} presst Milch!`;
        result.gifCaption = `${result.milk.emoji} ${result.milk.name}`;
        state.milkLevel = Math.min(100, state.milkLevel + 8);
        addToLeaderboard(state, result.user, 1);
      }
      break;

    case 'like':
      result.animation = 'bubble';
      result.message = `${result.user} liked! +${event.likeCount || 1}`;
      state.totalLikes += event.likeCount || 1;
      state.milkLevel = Math.min(100, state.milkLevel + (event.likeCount || 1) * 0.2);
      if (state.milkLevel >= 100) {
        result.animation = 'fountain';
        result.message = 'MILCH-FONTÄNE!!!';
        state.milkLevel = 0;
      }
      break;

    case 'gift':
      state.totalGifts += 1;
      addToLeaderboard(state, result.user, event.diamondCount || 5);

      if ((event.diamondCount || 0) >= 100) {
        result.animation = 'explosion';
        result.milk = MILK_TYPES.find((m) => m.id === 'chaos');
        result.isNewUnlock = unlockMilk(state, 'chaos');
        result.message = `${result.user} → CHAOS-MILCH!`;
      } else if ((event.diamondCount || 0) >= 30) {
        result.animation = 'unlock';
        result.milk = MILK_TYPES.find((m) => m.id === 'existential');
        result.isNewUnlock = unlockMilk(state, 'existential');
        result.message = `${result.user} → Existenzielle Milch`;
      } else {
        result.animation = 'gift';
        result.milk = MILK_TYPES.find((m) => m.id === 'sad');
        result.isNewUnlock = unlockMilk(state, 'sad');
        result.message = `${result.user} sent ${event.giftName || 'Rose'} 🌹`;
      }
      result.gifCaption = `${result.milk.emoji} ${result.milk.name} — gif this milk`;
      state.milkLevel = Math.min(100, state.milkLevel + 15);
      break;

    case 'follow':
      result.animation = 'legendary';
      result.milk = MILK_TYPES.find((m) => m.id === 'legendary');
      result.isNewUnlock = unlockMilk(state, 'legendary');
      result.message = `${result.user} folgt! Name auf der Flasche.`;
      result.gifCaption = `👑 ${result.user} Milch™`;
      addToLeaderboard(state, result.user, 10);
      break;

    case 'member':
      result.animation = 'wave';
      result.message = `${result.user} ist da!`;
      break;

    default:
      result.message = event.message || 'Milch passiert.';
  }

  return result;
}

module.exports = { MILK_TYPES, pickRandomMilk, processEvent };
