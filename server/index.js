const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const { createTikTokBridge } = require('./tiktok-bridge');
const { MILK_TYPES, pickRandomMilk, processEvent } = require('./events');
const sortimentStream = require('./sortiment-stream');

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

function broadcastSortimentState() {
  io.emit('sortiment:state', sortimentStream.getState());
}

sortimentStream.setBroadcaster(() => broadcastSortimentState());

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
  } else if (event.type === 'chat' && sortimentStream.isDrinkCommand(event.comment)) {
    sortimentStream.handleDrink(event);
  } else if (event.type === 'drink') {
    sortimentStream.handleDrink(event);
  }

  return event;
}

io.on('connection', (socket) => {
  socket.emit('state', overlayState);
  socket.emit('sortiment:state', sortimentStream.getState());

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
    }
  });

  socket.on('sortiment:start', () => {
    sortimentStream.resetState(null);
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
  res.json(sortimentStream.getState());
});

app.post('/api/event', express.json(), (req, res) => {
  res.json(applyOverlayEvent(req.body));
});

app.post('/api/sortiment/like', express.json(), (req, res) => {
  res.json(sortimentStream.handleLike({
    user: req.body?.user || 'API',
    likeCount: req.body?.likeCount || 1,
  }));
});

app.post('/api/sortiment/drink', express.json(), (req, res) => {
  res.json(sortimentStream.handleDrink({ user: req.body?.user || 'API' }));
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
  console.log(`   Demo:      http://localhost:${PORT}/sortiment/?demo=1`);
  console.log(`   Sortiment: http://localhost:${PORT}/sortiment/`);
  console.log(`   Overlay:   http://localhost:${PORT}/overlay.html\n`);
});
