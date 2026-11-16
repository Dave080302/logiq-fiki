'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('global-nav');
if (menu && navigation) {
  document.documentElement.classList.add('has-site-js');
  menu.hidden = false;
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
  navigation.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.global-header')) closeMenu(); });
  const current = location.pathname.split('/').pop() || 'index.html';
  navigation.querySelectorAll('a').forEach(link => { if (new URL(link.href).pathname.split('/').pop() === current) link.setAttribute('aria-current', 'page'); });
}
// Preserve column meanings when rows become mobile cards, including live survey tables.
function labelTables() {
  document.querySelectorAll('table').forEach(table => {
    const heads = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    if (!heads.length) return;
    table.classList.add('responsive-table');
    table.querySelectorAll('tbody tr').forEach(row => Array.from(row.children).forEach((cell, i) => { if (!cell.dataset.label) cell.dataset.label = heads[i] || ''; }));
  });
}
labelTables();
new MutationObserver(labelTables).observe(document.body, { childList: true, subtree: true });
