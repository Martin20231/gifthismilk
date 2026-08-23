# Eigener Link ohne „Martin“ — Hosting-Anleitung

Dein Code bleibt auf GitHub. Besucher sehen einen **neutralen Link** wie:

- `https://gifthismilk.netlify.app` (Netlify)
- `https://gifthismilk.pages.dev` (Cloudflare)
- `https://deine-domain.de` (eigene Domain, optional)

---

## Option A — Netlify (am schnellsten, ~2 Minuten)

1. Öffne: **https://app.netlify.com/start/deploy?repository=https://github.com/Martin20231/gifthismilk**
2. Mit GitHub anmelden und Repo **gifthismilk** verbinden
3. Einstellungen prüfen (stehen schon in `netlify.toml`):
   - **Publish directory:** `docs`
   - **Build command:** leer oder ignorieren
4. Auf **Deploy** klicken
5. Unter **Site settings → Domain management → Options → Edit site name**
   - Name setzen: `gifthismilk`
   - Fertiger Link: **https://gifthismilk.netlify.app**

Bei jedem Push auf `main` baut Netlify automatisch neu.

---

## Option B — Cloudflare Pages (~5 Minuten)

1. Kostenlos anmelden: **https://dash.cloudflare.com/sign-up**
2. **Workers & Pages → Create → Pages → Connect to Git**
3. Repo **Martin20231/gifthismilk** wählen
4. Build settings:
   - **Production branch:** `main`
   - **Build command:** leer
   - **Build output directory:** `docs`
5. Deploy → Projektname: `gifthismilk`
6. Link: **https://gifthismilk.pages.dev**

---

## Option C — Eigene Domain (z.B. gifthismilk.de)

Domain kaufen, dann bei Netlify **oder** Cloudflare:

- DNS **CNAME** auf den Hoster zeigen lassen
- In den Hoster-Einstellungen Domain eintragen

---

## TikTok Live (Backend, optional)

Die **Web-Oberfläche** läuft auf Netlify/Cloudflare (gratis).

Für **echtes Live** (Likes + Chat `trinken` für alle) brauchst du zusätzlich den Node-Server — z.B. kostenlos auf **Render**:

```bash
npm start
# TIKTOK_USERNAME=dein_tiktok npm start
```

Frontend dann verbinden:

`https://gifthismilk.netlify.app/sortiment/?server=https://dein-backend.onrender.com`

---

## Kurzvergleich

| | Link | Kosten | Aufwand |
|---|------|--------|---------|
| Netlify | gifthismilk.netlify.app | 0 € | ~2 Min |
| Cloudflare | gifthismilk.pages.dev | 0 € | ~5 Min |
| Eigene Domain | gifthismilk.de | ~1–12 €/Jahr | + DNS |

**Empfehlung:** Start mit **Netlify Option A** — schnellster Weg zu einem Link ohne deinen Namen.
