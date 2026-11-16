'use strict';
const context = document.getElementById('wireframe-context');
let stage = 'reading';
context.value = matchMedia('(max-width:720px)').matches ? 'browser-mobile' : 'browser-desktop';
function showWireframe() {
  const [surface, device] = context.value.split('-');
  const image = document.getElementById('wireframe-image');
  const title = `${device === 'mobile' ? 'Mobile' : 'Desktop'} ${surface === 'browser' ? 'browser article' : 'social feed'} · ${stage === 'review' ? 'Expanded review' : stage === 'alert' ? 'Automatic alert' : 'Reading'}`;
  image.src = `./assets/m4/${context.value}-${stage}.svg`;
  image.alt = title;
  image.width = device === 'mobile' ? 390 : 1140; image.height = device === 'mobile' ? 910 : 800;
  document.getElementById('wireframe-caption').textContent = title;
  document.getElementById('wireframe-full').href = image.src;
  document.getElementById('wireframe-try').href = `./news.html#${stage}?sample=repair&surface=${surface}&device=${device}`;
  document.querySelector('.wireframe-canvas').classList.toggle('desktop-canvas', device === 'desktop');
  document.querySelector('.desktop-wireframe-hint').hidden = device !== 'desktop';
  document.querySelectorAll('[data-stage]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stage === stage)));
}
context.addEventListener('change', showWireframe);
document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => { stage = button.dataset.stage; showWireframe(); }));
showWireframe();
document.getElementById('print-guide').addEventListener('click', () => { document.body.classList.add('print-guide-only'); window.print(); });
window.addEventListener('afterprint', () => document.body.classList.remove('print-guide-only'));
