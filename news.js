'use strict';

const newsSamples = window.LOGIQ_NEWS;
const $ = (id) => document.getElementById(id);
const reviewed = new Set();
const state = { sample: 'repair', surface: 'browser', device: 'desktop', view: 'reading', timer: null, revision: 0 };
const key = () => `${state.sample}:${state.surface}:${state.device}`;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function add(parent, ...nodes) { parent.append(...nodes.filter(Boolean)); return parent; }
function p(text, className = '') { return element('p', className, text); }
function route(view, overrides = {}) {
  const params = new URLSearchParams({ sample: state.sample, surface: state.surface, device: state.device, ...overrides });
  return `#${view}?${params}`;
}
function go(view, overrides = {}, replace = false) {
  const hash = route(view, overrides);
  if (replace) { history.replaceState(null, '', hash); render(); }
  else if (location.hash === hash) render();
  else location.hash = hash;
}
function summaryText(sample) {
  return ['LogiQ — illustrative review, not a live fact-check.', `Sample story: ${sample.title}`, '', sample.takeaway, '', ...sample.claims.map(claim => `${claim.label}: ${claim.text}`), '', 'Selected evidence:', ...(sample.sources.length ? sample.sources.map(source => `${source.publisher} — ${source.title}\n${source.url}`) : ['No official source is included in this fictional sample.']), '', 'Manually curated demonstration. Check the original context before acting or sharing.'].join('\n');
}
function sourceBlock(source) {
  const box = element('details', 'source-details');
  const summary = element('summary'); add(summary, element('span', 'source-icon', '↗'), element('span', '', source.publisher));
  const body = element('div', 'source-detail-body');
  const external = element('a', 'source-original', 'Open original source →');
  external.href = source.url; external.target = '_blank'; external.rel = 'noopener noreferrer';
  add(body, element('h4', '', source.title), p(source.date, 'source-date'), p(source.note), p(source.limitation, 'quiet-copy'), external);
  return add(box, summary, body);
}
function claimBlock(claim, sample, number) {
  const block = element('details', 'claim-detail'); block.open = number === 0;
  const summary = element('summary');
  add(summary, element('span', `claim-badge ${claim.status}`, claim.label), element('span', 'claim-text', claim.text));
  const body = element('div', 'claim-detail-body');
  add(body, p(claim.explanation), p(claim.context, 'claim-context'));
  const sources = element('div', 'claim-sources'); add(sources, element('h4', '', claim.evidence.length ? 'Follow the evidence' : 'What is missing?'));
  if (claim.evidence.length) {
    for (const id of claim.evidence) { const source = sample.sources.find(item => item.id === id); if (source) sources.append(sourceBlock(source)); }
  } else add(sources, p('A dated announcement from an identifiable authority. No such source is included in this sample.', 'quiet-copy'));
  add(body, sources, p(claim.question, 'reflection-question'));
  return add(block, summary, body);
}
function shareBlock(sample) {
  const details = element('details', 'share-disclosure'); add(details, element('summary', '', 'Share a short summary'));
  const label = element('label', 'field-label', 'Summary with evidence'); label.htmlFor = 'share-text';
  const text = element('textarea'); text.id = 'share-text'; text.readOnly = true; text.rows = 7; text.value = summaryText(sample);
  const copy = element('button', 'button button-dark full-button', 'Copy summary & sources'); copy.type = 'button';
  const status = p('', 'copy-status'); status.setAttribute('role', 'status');
  copy.addEventListener('click', async () => {
    const revision = state.revision; copy.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text.value);
      if (revision === state.revision) status.textContent = 'Copied with sources and the demo notice. Nothing was posted.';
    } catch (_) {
      if (revision === state.revision) { status.textContent = 'Select the summary and use your device’s Copy command.'; text.focus(); text.select(); }
    } finally { if (revision === state.revision) copy.disabled = false; }
  });
  const body = element('div', 'share-body'); add(body, label, text, copy, status);
  return add(details, body);
}
function renderReview(sample) {
  const body = $('review-content');
  const title = element('h2', '', 'Here’s what needs a closer look.'); title.id = 'review-title'; title.tabIndex = -1;
  const claims = element('div', 'claim-list'); sample.claims.forEach((claim, n) => claims.append(claimBlock(claim, sample, n)));
  const back = element('button', 'inline-button continue-reading', 'Close and keep reading →'); back.type = 'button'; back.addEventListener('click', closeReview);
  body.replaceChildren(p('THE STORY, IN CONTEXT', 'eyebrow'), title, p(sample.summary, 'panel-description'), claims, shareBlock(sample), back);
}
function renderArticle(sample) {
  const story = $('reading-article');
  const masthead = element('div', 'article-publication'); add(masthead, element('strong', '', 'CIVIC WIRE'), element('span', '', 'Sample edition'));
  story.replaceChildren(masthead, p(sample.topic, 'eyebrow'), element('h2', '', sample.title), p(sample.lead, 'article-lead'), p(sample.publisher, 'article-byline'), ...sample.paragraphs.map(text => p(text, 'article-paragraph')));
}
function feedPost(author, initials, text, className = '') {
  const post = element('article', `feed-post ${className}`);
  const header = element('div', 'post-header');
  const authorBlock = element('div'); add(authorBlock, element('strong', '', author), element('span', '', 'Shared with the community · Sample post'));
  add(header, element('span', 'post-avatar', initials), authorBlock, element('span', 'post-menu', '···'));
  add(post, header, p(text, 'post-text'));
  return post;
}
function renderFeed(sample) {
  const feed = $('social-feed');
  const intro = feedPost('Local community', 'LC', 'A little good news: the weekend repair café is back. What are you hoping to fix?', 'ambient-post');
  const selected = feedPost('Mara S.', 'MS', sample.lead, 'selected-post');
  const preview = element('div', 'shared-story');
  add(preview, p(sample.topic, 'eyebrow'), element('h2', '', sample.title), p(sample.paragraphs[0]), p('civic-wire.example · Sample story', 'story-domain'));
  add(selected, preview, element('div', 'post-reactions', '24 reactions · 6 comments · 3 shares'));
  const comment = element('div', 'sample-comment'); add(comment, element('strong', '', 'Alex'), p('I saw this too. Does anyone have the original source?'));
  add(selected, comment);
  const next = feedPost('Your neighborhood', 'YN', 'The community garden is looking good this week. Thanks to everyone who helped.', 'ambient-post');
  feed.replaceChildren(intro, selected, next);
}
function renderChrome(sample) {
  const chrome = $('scene-chrome');
  if (state.surface === 'feed') {
    chrome.replaceChildren(element('strong', 'feed-brand', 'community'), element('span', 'feed-search', 'Your community feed'), element('span', 'chrome-profile', 'A'));
  } else {
    chrome.replaceChildren(element('span', 'browser-lights', '● ● ●'), element('span', 'address-bar', sample.url.replace('https://', '')), element('span', 'browser-menu', '···'));
  }
}
function setIndicator(ready) {
  $('review-indicator').disabled = !ready;
  $('review-indicator').classList.toggle('is-ready', ready);
  $('indicator-label').textContent = ready ? 'LogiQ · Review ready' : 'LogiQ is reviewing…';
}
function render() {
  clearTimeout(state.timer); state.revision += 1;
  const [requested = 'reading', query = ''] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query);
  state.sample = Object.hasOwn(newsSamples, params.get('sample')) ? params.get('sample') : 'repair';
  state.surface = params.get('surface') === 'feed' ? 'feed' : 'browser';
  state.device = params.has('device') ? (params.get('device') === 'mobile' ? 'mobile' : 'desktop') : (matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop');
  // Older deep links land on the simplified expanded review.
  state.view = ['alert', 'review'].includes(requested) ? requested : ['results', 'claim', 'sources', 'share'].includes(requested) ? 'review' : 'reading';
  const sample = newsSamples[state.sample];
  if (state.view !== 'reading') reviewed.add(key());
  renderChrome(sample); renderArticle(sample); renderFeed(sample); renderReview(sample);
  $('news-sample').value = state.sample;
  document.querySelectorAll('[data-surface]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.surface === state.surface)));
  document.querySelectorAll('[data-device]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.device === state.device)));
  $('experience-frame').className = `experience-frame ${state.device}-experience ${state.surface}-experience`;
  $('reading-article').hidden = state.surface !== 'browser'; $('social-feed').hidden = state.surface !== 'feed';
  $('scene-caption').textContent = `${state.device === 'mobile' ? 'Mobile' : 'Desktop'} · ${state.surface === 'feed' ? 'Social feed' : 'Browser article'}`;
  $('scene-layout').classList.toggle('has-review', state.view === 'review');
  $('logiq-alert').hidden = state.view !== 'alert'; $('review-panel').hidden = state.view !== 'review';
  $('expand-alert').setAttribute('aria-expanded', String(state.view === 'review'));
  $('review-indicator').setAttribute('aria-expanded', String(state.view === 'review'));
  $('reading-surface').inert = state.device === 'mobile' && state.view === 'review';
  const issue = sample.claims.find(claim => claim.status !== 'supported') || sample.claims[0];
  $('alert-title').textContent = issue.status === 'uncertain' ? 'A shared claim needs a source.' : issue.status === 'context' ? 'This story may be missing context.' : 'We found a misleading claim.';
  $('alert-description').textContent = issue.status === 'uncertain' ? 'See what’s missing before you share it.' : 'Take a quick look at the explanation and evidence.';
  setIndicator(reviewed.has(key()));
  if (state.view === 'reading' && !reviewed.has(key())) {
    const revision = state.revision;
    state.timer = setTimeout(() => {
      if (revision !== state.revision) return;
      reviewed.add(key());
      go('alert', {}, true);
      $('announcement').textContent = 'LogiQ has a finding for this sample. Open the branded alert to see the explanation and sources.';
    }, 1100);
  }
  if (state.view === 'review') { $('review-panel').scrollTop = 0; $('review-title').focus({ preventScroll: true }); }
}
function closeReview() {
  reviewed.add(key()); go('reading');
  // Return keyboard users to the control that can reopen the completed review.
  requestAnimationFrame(() => $('review-indicator').focus({ preventScroll: true }));
}
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); $('workspace').focus(); $('workspace').scrollIntoView({ block: 'start' }); });
$('expand-alert').addEventListener('click', () => go('review'));
function dismissAlert() { reviewed.add(key()); go('reading', {}, true); $('review-indicator').focus({ preventScroll: true }); }
$('dismiss-alert').addEventListener('click', dismissAlert);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.view !== 'reading') { event.preventDefault(); state.view === 'review' ? closeReview() : dismissAlert(); }
});
$('close-review').addEventListener('click', closeReview);
$('review-indicator').addEventListener('click', () => go('review'));
document.querySelectorAll('[data-surface]').forEach(button => button.addEventListener('click', () => go('reading', { surface: button.dataset.surface })));
document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => go('reading', { device: button.dataset.device })));
$('news-sample').addEventListener('change', event => go('reading', { sample: event.target.value }));
$('replay').addEventListener('click', () => { reviewed.delete(key()); $('announcement').textContent = ''; go('reading', {}, true); });
window.addEventListener('hashchange', render);
$('app').hidden = false; render();
