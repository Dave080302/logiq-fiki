'use strict';
// Open a referenced account when arriving from a finding or a shared section link.
function openLinkedNote() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const note = document.getElementById(id);
  if (!note || !note.classList.contains('feedback-record')) return;
  note.open = true;
  note.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', openLinkedNote);
openLinkedNote();
