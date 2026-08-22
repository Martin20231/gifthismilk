# Gif This Milk

TikTok Live Milch-Automat — interaktiv, meme-tauglich, OBS-ready.

**Live Demo:** https://martin20231.github.io/gifthismilk/

## GitHub Pages (Demo)

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions** (empfohlen) oder Branch `main` → Ordner `/docs`
3. Demo öffnen → Overlay in zweitem Tab für Live-Sync

| Seite | URL |
|-------|-----|
| Demo | `/` |
| OBS-Overlay | `/overlay.html` |

> Pages = Browser-Demo ohne Server. TikTok Live braucht `npm start` lokal.

## Lokal mit TikTok

```bash
npm install
npm start
```

- **Demo:** http://localhost:3847
- **Overlay:** http://localhost:3847/overlay.html

```bash
TIKTOK_USERNAME=dein_username npm start
```

Optional: `npm install @tiktool/live`

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
