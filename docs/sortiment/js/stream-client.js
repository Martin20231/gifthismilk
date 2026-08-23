/**
 * TikTok Live stream client — shared glass only (no personal data).
 */

let socket = null;
let connected = false;
let listeners = new Set();

function isDemoForced() {
  return new URLSearchParams(location.search).get('demo') === '1';
}

function resolveServerUrl() {
  if (isDemoForced()) return null;

  const params = new URLSearchParams(location.search);
  if (params.get('server')) return params.get('server').replace(/\/$/, '');

  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return `${location.protocol}//${location.hostname}:3847`;
  }

  if (location.port === '3847') return location.origin;

  return null;
}

export function isLiveMode() {
  return !!resolveServerUrl();
}

export function onStreamState(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(state) {
  listeners.forEach((fn) => fn(state));
}

export function connectStream() {
  const url = resolveServerUrl();
  if (!url) {
    notify({ mode: 'demo' });
    return null;
  }

  if (typeof io === 'undefined') {
    notify({ mode: 'demo' });
    return null;
  }

  if (socket?.connected) return socket;

  socket = io(url, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    connected = true;
    notify({ mode: 'live', connected: true });
  });

  socket.on('disconnect', () => {
    connected = false;
    notify({ mode: 'live', connected: false });
  });

  socket.on('sortiment:state', (state) => {
    notify({ mode: 'live', connected: true, ...state });
  });

  return socket;
}

export function startLiveSession() {
  if (!socket?.connected) return;
  socket.emit('sortiment:start');
}

export function sendLike(user = 'Demo') {
  if (socket?.connected) {
    socket.emit('sortiment:like', { user });
    return true;
  }
  return false;
}

export function sendDrink(user = 'Demo') {
  if (socket?.connected) {
    socket.emit('sortiment:drink', { user });
    return true;
  }
  return false;
}
