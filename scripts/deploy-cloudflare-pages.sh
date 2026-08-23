#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN fehlt"
  exit 1
fi
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "CLOUDFLARE_ACCOUNT_ID fehlt"
  exit 1
fi

PROJECT="${1:-gifthismilk}"

echo "→ Cloudflare Pages deploy: $PROJECT"
npx wrangler pages deploy docs \
  --project-name="$PROJECT" \
  --branch=main \
  --commit-dirty=true

echo ""
echo "→ Fertig: https://${PROJECT}.pages.dev"
