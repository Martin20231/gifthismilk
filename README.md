# Gif This Milk

TikTok Live Milch-Automat — interaktiv, meme-tauglich, OBS-ready.

**Live Demo:** https://martin20231.github.io/gifthismilk/

## GitHub Pages (Demo)

1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions** (empfohlen) oder Branch `main` → Ordner `/docs`
3. Demo öffnen → Overlay in zweitem Tab für Live-Sync

| Seite | URL |
|-------|-----|
| **Landing** | `/` |
| Länder entdecken | `/discover/` |
| Match (Swipe) | `/match/` |
| Sortiment (Milch-Mix + Live-Glas) | `/sortiment/` |
| Stream-Demo (OBS) | `/demo/` |
| OBS-Overlay | `/overlay.html` |

> Pages = Browser-Demo ohne Server. **TikTok Live Sync** braucht `npm start` lokal oder einen gehosteten Server.

## Sortiment + TikTok Live

**Privat im Browser:** Land, Geschlecht, Sexualität — nur localStorage, nie TikTok-Chat.

**Öffentlich via TikTok:**
- **Like** → Glas füllt sich für alle
- Chat **`trinken`** → Glas leeren (wenn voll)

### Demo testen

- **GitHub Pages:** https://martin20231.github.io/gifthismilk/sortiment/?v=13 — reine Demo, alles lokal
- **Lokal mit Server:** `npm start` → http://localhost:3847/sortiment/?demo=1

```bash
npm install
npm start
# Optional TikTok:
TIKTOK_USERNAME=dein_username npm start
```

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
| **Like** (TikTok) | Glas füllt sich für alle |
| Chat **`trinken`** | Glas leeren wenn voll |
| **Browser** (privat) | Land, Geschlecht, Sexualität wählen |
| Chat `!milch` / `!gif` | Milch wird gepresst (Overlay) |
| Like-Burst | Milch-Level steigt → Fontäne bei 100% |
| Rose (Gift) | Traurige Milch freischalten |
| Größeres Gift | Existenzielle / Chaos-Milch |
| Follow | Legendäre Milch + Name auf Flasche |

## Stack

Node.js · Express · Socket.io · Vanilla JS/CSS
