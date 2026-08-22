/**
 * TikTok Live bridge — optional.
 * Install @tiktool/live and set TIKTOK_USERNAME to connect.
 * Falls back gracefully if the package is not installed.
 */
function createTikTokBridge(username, onEvent) {
  let TikTokLive;
  try {
    TikTokLive = require('@tiktool/live').TikTokLive;
  } catch {
    console.warn('TikTok SDK not installed. Run: npm install @tiktool/live');
    return null;
  }

  const live = new TikTokLive(username);

  live.on('chat', (e) => {
    const comment = (e.comment || '').trim();
    const lower = comment.toLowerCase();
    const user = e.user?.uniqueId || 'anonymous';

    if (lower === 'trinken' || lower === '!trinken' || lower.startsWith('trinken ')) {
      onEvent({ type: 'chat', user, comment, action: 'drink' });
      return;
    }

    if (lower === '!milch' || lower === '!gif') {
      onEvent({
        type: 'chat',
        user,
        action: 'press',
      });
    }
  });

  live.on('gift', (e) => {
    if (!e.repeatEnd && e.repeatCount > 1) return;
    onEvent({
      type: 'gift',
      user: e.user?.uniqueId || 'anonymous',
      giftName: e.giftName,
      diamondCount: e.diamondCount * (e.repeatCount || 1),
    });
  });

  live.on('like', (e) => {
    onEvent({
      type: 'like',
      user: e.user?.uniqueId || 'anonymous',
      likeCount: e.likeCount || 1,
    });
  });

  live.on('social', (e) => {
    if (e.action === 'follow') {
      onEvent({ type: 'follow', user: e.user?.uniqueId || 'anonymous' });
    }
  });

  live.on('member', (e) => {
    onEvent({ type: 'member', user: e.user?.uniqueId || 'anonymous' });
  });

  live.connect().catch((err) => {
    console.error('TikTok connect failed:', err.message);
  });

  return live;
}

module.exports = { createTikTokBridge };
