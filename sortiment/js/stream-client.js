/**
 * TikTok Live stream client — syncs glass state for all viewers via Socket.io.
 */

let socket = null;
let connected = false;
let listeners = new Set();

function resolveServerUrl() {
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

export function getConnectionStatus() {
  if (!resolveServerUrl()) return 'offline';
  return connected ? 'live' : 'connecting';
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
    console.warn('Socket.io client not loaded');
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

export function disconnectStream() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connected = false;
}

export function startLiveSession(profile) {
  if (!socket?.connected) return;
  socket.emit('sortiment:start', profile);
}

export function sendChatCommand(user, comment) {
  if (!socket?.connected) return false;
  socket.emit('sortiment:chat', { user, comment });
  return true;
}

export function registerProfile(user, country, gender, sexuality) {
  if (!socket?.connected) return false;
  socket.emit('sortiment:register', { user, country, gender, sexuality });
  return true;
}

export function demoLike(user = 'Demo') {
  if (socket?.connected) {
    socket.emit('sortiment:like', { user });
    return;
  }
  notify({ mode: 'demo-like', user });
}

export function demoDrink(user = 'Demo') {
  if (socket?.connected) {
    socket.emit('sortiment:drink', { user });
    return;
  }
  notify({ mode: 'demo-drink', user });
}
