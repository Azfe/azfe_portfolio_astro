export function showNotice(message) {
  const el = document.getElementById("cv-notice");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

export function hideNotice() {
  const el = document.getElementById("cv-notice");
  if (el) el.hidden = true;
}
