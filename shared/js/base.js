/** GitHub-Pages-kompatible Pfade */
export function getBasePath() {
  if (!location.hostname.includes('github.io')) return '';
  const seg = location.pathname.split('/').filter(Boolean)[0];
  return seg ? `/${seg}` : '';
}

export function appLink(path) {
  const base = getBasePath();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

export function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
