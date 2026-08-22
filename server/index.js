const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const { createTikTokBridge } = require('./tiktok-bridge');
const { MILK_TYPES, pickRandomMilk, processEvent } = require('./events');
const sortimentStream = require('./sortiment-stream');
const chatRegistry = require('./chat-registry');

const PORT = process.env.PORT || 3847;
const ROOT = path.join(__dirname, '..');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(ROOT, 'public')));
app.use('/sortiment', express.static(path.join(ROOT, 'sortiment')));

const overlayState = {
  milkLevel: 0,
  totalGifts: 0,
  totalLikes: 0,
  unlockedMilks: ['classic'],
  leaderboard: [],
  lastEvent: null,
};

function broadcastOverlayState() {
  io.emit('state', overlayState);
}

function broadcastSortimentState(extra = {}) {
  io.emit('sortiment:state', {
    ...sortimentStream.getState(),
    ...chatRegistry.getSnapshot(),
    ...extra,
  });
}

sortimentStream.setBroadcaster(() => broadcastSortimentState());
chatRegistry.setBroadcaster((event) => broadcastSortimentState({ lastRegistryEvent: event }));

function applyOverlayEvent(event) {
  const result = processEvent(event, overlayState);
  overlayState.lastEvent = result;
  broadcastOverlayState();
  io.emit('milk-event', result);
  return result;
}

function applyTikTokEvent(event) {
  applyOverlayEvent(event);

  if (event.type === 'like') {
    sortimentStream.handleLike(event);
  } else if (event.type === 'chat') {
    if (sortimentStream.isDrinkCommand(event.comment)) {
      sortimentStream.handleDrink(event);
    } else {
      chatRegistry.handleChat(event.user, event.comment);
    }
  } else if (event.type === 'drink') {
    sortimentStream.handleDrink(event);
  }

  return event;
}

io.on('connection', (socket) => {
  socket.emit('state', overlayState);
  socket.emit('sortiment:state', {
    ...sortimentStream.getState(),
    ...chatRegistry.getSnapshot(),
  });

  socket.on('simulate', (payload) => {
    applyOverlayEvent({ type: 'simulate', ...payload });
  });

  socket.on('chat-command', ({ user, comment }) => {
    const cmd = (comment || '').trim().toLowerCase();
    if (cmd === '!milch' || cmd === '!gif') {
      applyOverlayEvent({
        type: 'chat',
        user: user || 'anonymous',
        action: 'press',
        milk: pickRandomMilk(overlayState.unlockedMilks),
      });
    }
    if (sortimentStream.isDrinkCommand(cmd)) {
      sortimentStream.handleDrink({ user: user || 'anonymous', comment: cmd });
    } else {
      chatRegistry.handleChat(user || 'anonymous', comment);
    }
  });

  socket.on('sortiment:register', ({ user, country, gender, sexuality }) => {
    chatRegistry.registerFromApp(user || 'App', country, gender, sexuality);
  });

  socket.on('sortiment:chat', ({ user, comment }) => {
    chatRegistry.handleChat(user || 'Demo', comment);
  });

  /* ── Sortiment live stream ── */
  socket.on('sortiment:start', (profile) => {
    sortimentStream.resetState(profile);
  });

  socket.on('sortiment:like', (payload) => {
    sortimentStream.handleLike({ user: payload?.user || 'Demo', likeCount: 1 });
  });

  socket.on('sortiment:drink', (payload) => {
    sortimentStream.handleDrink({ user: payload?.user || 'Demo' });
  });
});

app.get('/api/state', (_req, res) => res.json(overlayState));

app.get('/api/sortiment/state', (_req, res) => {
  res.json({
    ...sortimentStream.getState(),
    ...chatRegistry.getSnapshot(),
  });
});

app.post('/api/sortiment/chat', express.json(), (req, res) => {
  const event = chatRegistry.handleChat(req.body?.user || 'API', req.body?.comment || '');
  res.json(event);
});

app.post('/api/event', express.json(), (req, res) => {
  const result = applyOverlayEvent(req.body);
  res.json(result);
});

app.post('/api/sortiment/like', express.json(), (req, res) => {
  const state = sortimentStream.handleLike({
    user: req.body?.user || 'API',
    likeCount: req.body?.likeCount || 1,
  });
  res.json(state);
});

app.post('/api/sortiment/drink', express.json(), (req, res) => {
  const state = sortimentStream.handleDrink({ user: req.body?.user || 'API' });
  res.json(state);
});

app.get('/api/milks', (_req, res) => res.json(MILK_TYPES));

const tiktokUsername = process.env.TIKTOK_USERNAME;
if (tiktokUsername) {
  createTikTokBridge(tiktokUsername, applyTikTokEvent);
  console.log(`TikTok bridge active for @${tiktokUsername}`);
} else {
  console.log('Demo mode — set TIKTOK_USERNAME to connect a live stream');
}

server.listen(PORT, () => {
  console.log(`\n🥛 Gif This Milk — live ready`);
  console.log(`   Demo:      http://localhost:${PORT}`);
  console.log(`   Sortiment: http://localhost:${PORT}/sortiment/`);
  console.log(`   Overlay:   http://localhost:${PORT}/overlay.html\n`);
});
