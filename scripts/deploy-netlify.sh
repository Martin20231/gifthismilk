#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "NETLIFY_AUTH_TOKEN fehlt. Siehe HOSTING.md"
  exit 1
fi

SITE_NAME="${1:-gifthismilk}"
DOCS="docs"

echo "→ Netlify Site prüfen/erstellen: $SITE_NAME"
SITE_ID=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/sites?filter=all&name=$SITE_NAME" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" 2>/dev/null || true)

if [[ -z "$SITE_ID" ]]; then
  echo "→ Neue Site erstellen..."
  RESP=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$SITE_NAME\"}" \
    "https://api.netlify.com/api/v1/sites")
  SITE_ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
fi

echo "→ Deploy docs/ → Site $SITE_ID"
cd "$DOCS"
zip -r -q /tmp/gtm-deploy.zip .
curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @/tmp/gtm-deploy.zip \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('Live:', d.get('deploy_ssl_url') or d.get('url') or d)"

echo "→ Fertig: https://${SITE_NAME}.netlify.app"
