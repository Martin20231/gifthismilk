# Eigener Link ohne „Martin“ — Cloudflare Pages

Ziel-URL: **https://gifthismilk.pages.dev**

Code bleibt auf GitHub. Besucher sehen nur die Pages-URL.

---

## Option A — Ich deploye für dich (empfohlen)

Trage in **Cursor → Environment → Secrets** ein:

| Secret | Woher |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | [API Tokens](https://dash.cloudflare.com/profile/api-tokens) → Custom → **Account → Cloudflare Pages → Edit** + **Account Settings → Read** |
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard rechts unter **Account ID** |

Dann schreib: **„Secrets drin“** — ich deploye mit:

```bash
./scripts/deploy-cloudflare-pages.sh gifthismilk
```

---

## Option B — Cloudflare Dashboard (Handy)

1. **Workers und Pages → Erstellen → Pages → Mit Git verbinden**
2. Repo **`Martin20231/gifthismilk`**
3. Einstellungen:

| Feld | Wert |
|------|------|
| Projektname | `gifthismilk` |
| Branch | `main` |
| Build command | **leer** |
| **Build output** | **`docs`** |

4. Deploy → grün → **https://gifthismilk.pages.dev**

⚠️ **Nicht** „Worker“ mit `npx wrangler deploy` — das ergibt `*.megadjbeatbox1.workers.dev`

---

## Worker-Projekt löschen (optional)

Das alte Worker-Projekt kann gelöscht werden — Pages reicht.

---

## TikTok Live (optional, später)

Frontend: Pages · Backend: Render/Railway mit `npm start`

`https://gifthismilk.pages.dev/sortiment/?server=https://dein-backend.onrender.com`
