const overlayUrl = document.getElementById('overlay-url');
if (overlayUrl) {
  overlayUrl.textContent = new URL('../overlay.html', window.location.href).href;
}
