# Cloudflare Pages — Upload (ohne GitHub / ohne Worker)

Wenn **„Build output: docs“** nicht angeboten wird → **statische Dateien hochladen**.

## Schritte (Handy)

1. **Workers und Pages → Erstellen** (oder „Ship something new“)
2. **„Upload your static files“** / **Statische Dateien hochladen**
   - NICHT „Continue with GitHub“ (führt oft zu Worker + wrangler)
3. Projektname: **`gifthismilk`**
4. Datei hochladen: **`gifthismilk-static.zip`** (liegt im Repo-Root auf GitHub)
5. Deploy → fertig

## Link danach

**https://gifthismilk.pages.dev**

## ZIP lokal bauen

```bash
cd docs && zip -r ../gifthismilk-static.zip .
```

## ZIP von GitHub holen

https://github.com/Martin20231/gifthismilk/raw/main/gifthismilk-static.zip
