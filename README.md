# Gif This Milk

TikTok Live Milch-Automat — interaktiv, meme-tauglich, OBS-ready.

Interaktiver Milch-Automat für TikTok Live. Zuschauer triggern Milch-Animationen via Chat, Gifts und Likes — perfekt als OBS Browser Source.

## Quick Start

```bash
npm install
npm start
```

- **Demo Panel:** http://localhost:3847
- **OBS Overlay:** http://localhost:3847/overlay.html (420×520 px, transparent)

## TikTok Live verbinden

```bash
TIKTOK_USERNAME=dein_username npm start
```

Optional: `npm install @tiktool/live` für die TikTok Live Bridge.

## Events

| Aktion | Reaktion |
|--------|----------|
| Chat `!milch` / `!gif` | Milch wird gepresst |
| Like-Burst | Milch-Level steigt → Fontäne bei 100% |
| Rose (Gift) | Traurige Milch freischalten |
| Größeres Gift | Existenzielle / Chaos-Milch |
| Follow | Legendäre Milch + Name auf Flasche |

## Stack

Node.js · Express · Socket.io · Vanilla JS/CSS
