const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const { createTikTokBridge } = require('./tiktok-bridge');
const { MILK_TYPES, pickRandomMilk, processEvent } = require('./events');

const PORT = process.env.PORT || 3847;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, '..', 'public')));

const state = {
  milkLevel: 0,
  totalGifts: 0,
  totalLikes: 0,
  unlockedMilks: ['classic'],
  leaderboard: [],
  lastEvent: null,
};

function broadcastState() {
  io.emit('state', state);
}

function applyEvent(event) {
  const result = processEvent(event, state);
  state.lastEvent = result;
  broadcastState();
  io.emit('milk-event', result);
  return result;
}

io.on('connection', (socket) => {
  socket.emit('state', state);

  socket.on('simulate', (payload) => {
    applyEvent({ type: 'simulate', ...payload });
  });

  socket.on('chat-command', ({ user, comment }) => {
    const cmd = (comment || '').trim().toLowerCase();
    if (cmd === '!milch' || cmd === '!gif') {
      applyEvent({
        type: 'chat',
        user: user || 'anonymous',
        action: 'press',
        milk: pickRandomMilk(state.unlockedMilks),
      });
    }
  });
});

app.get('/api/state', (_req, res) => res.json(state));

app.post('/api/event', express.json(), (req, res) => {
  const result = applyEvent(req.body);
  res.json(result);
});

app.get('/api/milks', (_req, res) => res.json(MILK_TYPES));

const tiktokUsername = process.env.TIKTOK_USERNAME;
if (tiktokUsername) {
  createTikTokBridge(tiktokUsername, applyEvent);
  console.log(`TikTok bridge active for @${tiktokUsername}`);
} else {
  console.log('Demo mode — set TIKTOK_USERNAME to connect a live stream');
}

server.listen(PORT, () => {
  console.log(`\n🥛 Gif This Milk — live overlay ready`);
  console.log(`   Demo:    http://localhost:${PORT}`);
  console.log(`   Overlay: http://localhost:${PORT}/overlay.html\n`);
});
