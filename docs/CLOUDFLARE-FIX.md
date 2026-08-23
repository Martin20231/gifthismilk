# Cloudflare Pages — Fix wenn gifthismilk.pages.dev nicht lädt

## Problem
`gifthismilk.pages.dev` hat **keinen DNS-Eintrag** → Projekt ist noch nicht als **Pages** live (nur Worker oder Deploy fehlgeschlagen).

---

## Lösung (Handy, ~3 Min)

### 1. Workers und Pages → **Erstellen**
- Nicht das alte Worker-Projekt öffnen
- **Erstellen** → **Pages** → **Mit Git verbinden**

### 2. Repo wählen
`Martin20231/gifthismilk`

### 3. Genau diese Werte

| Feld | Wert |
|------|------|
| Projektname | `gifthismilk` (oder `gtm-app` falls Name belegt) |
| Production branch | `main` |
| Framework | **None** / Keins |
| Build command | **leer** |
| **Build output directory** | **`docs`** |

⚠️ **Nicht** `npx wrangler deploy` — das ist Worker!

### 4. Deploy → warten bis **grün**

### 5. URL **aus dem Dashboard kopieren**
Oben steht die echte URL, z.B.:
- `https://gifthismilk.pages.dev`
- oder `https://gtm-app.pages.dev` (falls Name vergeben)

---

## Prüfen ob es Pages ist

| Pages ✅ | Worker ❌ |
|----------|-----------|
| Build output: `docs` | Deploy: `npx wrangler deploy` |
| URL: `*.pages.dev` | URL: `*.workers.dev` |

---

## Sofort funktionierende Links (Fallback)

| Link | Status |
|------|--------|
| https://gifthismilk.megadjbeatbox1.workers.dev | ✅ läuft |
| https://martin20231.github.io/gifthismilk/ | ✅ läuft |

---

## Alternative ohne Cloudflare-Stress

Netlify (2 Min): https://app.netlify.com/start/deploy?repository=https://github.com/Martin20231/gifthismilk  
→ Site name: `gifthismilk` → **https://gifthismilk.netlify.app**
