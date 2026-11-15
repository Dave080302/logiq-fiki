'use strict';

const newsSamples = window.LOGIQ_NEWS;
const $ = (id) => document.getElementById(id);
const state = { sample: 'repair', view: 'reading', claim: null, phone: false, timer: null, revision: 0, feedback: {} };
const views = new Set(['reading', 'start', 'checking', 'results', 'claim', 'sources', 'share', 'feedback', 'unavailable']);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function add(parent, ...nodes) { parent.append(...nodes.filter(Boolean)); return parent; }
function paragraph(text, className = '') { return element('p', className, text); }
function route(view, claim = null, sample = state.sample) {
  const params = new URLSearchParams({ sample });
  if (claim) params.set('claim', claim);
  return `#${view}?${params}`;
}
function link(text, view, className = 'panel-link', claim = null) {
  const node = element('a', className, text); node.href = route(view, claim); return node;
}
function button(text, className, action) {
  const node = element('button', className, text); node.type = 'button'; node.addEventListener('click', action); return node;
}
function go(view, claim = null) {
  const hash = route(view, claim);
  if (location.hash === hash) render(); else location.hash = hash;
}
function heading(kicker, title, description) {
  const wrap = element('div', 'panel-heading');
  add(wrap, paragraph(kicker, 'eyebrow'));
  const h = element('h2', '', title); h.tabIndex = -1; add(wrap, h);
  if (description) add(wrap, paragraph(description, 'panel-description'));
  return wrap;
}
function badge(claim) { return element('span', `claim-badge ${claim.status}`, claim.label); }
function evidenceSource(sample, id) { return sample.sources.find((source) => source.id === id); }
function claimTile(claim, number) {
  const tile = element('a', 'claim-tile'); tile.href = route('claim', claim.id);
  add(tile, paragraph(`CLAIM ${String(number + 1).padStart(2, '0')}`, 'claim-index'), badge(claim), element('h3', '', claim.text), element('span', 'claim-open', 'See why & view evidence →'));
  return tile;
}
function sourceCard(source) {
  const card = element('div', 'source-card');
  add(card, paragraph(source.type, 'eyebrow'), element('h3', '', source.publisher), paragraph(source.title), paragraph(source.date, 'quiet-copy'));
  add(card, button('Read source details →', 'inline-button', () => showSource(source)));
  return card;
}
function showSource(source) {
  const box = $('source-dialog-body'); box.replaceChildren();
  const title = element('h2', '', source.title); title.id = 'source-dialog-title';
  const external = element('a', 'button button-dark', 'Open original source →');
  external.href = source.url; external.target = '_blank'; external.rel = 'noopener noreferrer';
  add(box, paragraph(source.type, 'eyebrow'), title, paragraph(source.publisher, 'source-publisher'), paragraph(source.date, 'quiet-copy'), paragraph(source.note), paragraph(source.limitation, 'source-limitation'), external, paragraph('This source was manually selected for the demo. Opening the original page leaves this prototype.', 'quiet-copy'));
  $('source-dialog').showModal();
}
function renderArticle(sample) {
  $('article-address').textContent = sample.url.replace('https://', '');
  for (const [id, field] of [['article-topic', 'topic'], ['article-title', 'title'], ['article-lead', 'lead'], ['article-publisher', 'publisher']]) $(id).textContent = sample[field];
  $('article-body').replaceChildren(...sample.paragraphs.map((text) => paragraph(text)));
}
function renderStart() {
  const wrap = element('div', 'panel-body');
  add(wrap, heading('START A CHECK', 'What are you reading?', 'Choose the current article, or preview how you would bring a link or text into LogiQ.'));
  add(wrap, button('Check the current article →', 'button button-dark full-button', () => go('checking')));
  const form = element('form', 'check-form'); form.noValidate = true;
  const label = element('label', 'field-label', 'Article link or claim'); label.htmlFor = 'check-input';
  const input = element('textarea'); input.id = 'check-input'; input.rows = 4; input.maxLength = 2000; input.placeholder = 'Paste a link or the words you want to check';
  input.setAttribute('aria-describedby', 'input-help input-error');
  const help = paragraph('This preview recognizes only the four sample URLs. Other text will show the unconnected-analysis state.', 'quiet-copy'); help.id = 'input-help';
  const error = paragraph('', 'input-error'); error.id = 'input-error'; error.setAttribute('role', 'status');
  const submit = element('button', 'button button-outline full-button', 'Continue'); submit.type = 'submit';
  form.addEventListener('submit', (event) => {
    event.preventDefault(); const value = input.value.trim();
    if (!value) { error.textContent = 'Add a link or some text to continue.'; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
    input.removeAttribute('aria-invalid');
    const matched = Object.entries(newsSamples).find(([, sample]) => sample.url === value);
    if (matched) { location.hash = route('checking', null, matched[0]); return; }
    error.textContent = 'Live checking is not connected in this prototype. Your input has not been sent or assessed. Try the current sample to explore the results.';
  });
  input.addEventListener('input', () => { error.textContent = ''; input.removeAttribute('aria-invalid'); });
  add(form, label, input, help, error, submit);
  add(wrap, form, button('Use this sample link', 'inline-button', () => { input.value = newsSamples[state.sample].url; input.focus(); }), link('Cancel and keep reading', 'reading'));
  return wrap;
}
function renderChecking() {
  const wrap = element('div', 'panel-body checking-view');
  add(wrap, element('div', 'checking-orbit', 'Q'), heading('PREPARING THE DEMO', 'A little context is on its way.', 'Loading the prewritten claims and evidence for this sample. No live search or AI analysis is running.'), paragraph('The same result is shown every time you open this sample.', 'quiet-copy'), link('Cancel and keep reading', 'reading'));
  const revision = state.revision;
  state.timer = setTimeout(() => { if (revision === state.revision) go(newsSamples[state.sample].unavailable ? 'unavailable' : 'results'); }, 1000);
  return wrap;
}
function renderResults(sample) {
  const wrap = element('div', 'panel-body');
  add(wrap, heading('THE SECOND LOOK', 'What the evidence tells us.', sample.summary));
  const count = paragraph(`${sample.claims.length} ${sample.claims.length === 1 ? 'claim' : 'claims'} reviewed · ${sample.sources.length} selected ${sample.sources.length === 1 ? 'source' : 'sources'}`, 'result-meta');
  const list = element('div', 'claim-list'); sample.claims.forEach((claim, n) => list.append(claimTile(claim, n)));
  add(wrap, count, list, paragraph('Claims are considered individually. A problem with one claim does not establish that an entire article is false.', 'quiet-copy'), link('Explore sources & context →', 'sources', 'button button-outline full-button'), link('Prepare a shareable summary', 'share'), link('Helpful, unclear, or disagree?', 'feedback'));
  return wrap;
}
function renderClaim(sample) {
  const claim = sample.claims.find((item) => item.id === state.claim) || sample.claims[0];
  const wrap = element('div', 'panel-body');
  add(wrap, link('← All claims', 'results'), heading('ONE CLAIM, IN CONTEXT', claim.text), badge(claim), paragraph(claim.explanation, 'claim-explanation'));
  const context = element('details', 'context-disclosure'); add(context, element('summary', '', 'What context matters?'), paragraph(claim.context));
  const question = element('div', 'question-box'); add(question, element('span', '', 'A QUESTION WORTH ASKING'), paragraph(claim.question));
  const sources = element('div', 'claim-sources');
  add(sources, element('h3', '', claim.evidence.length ? 'Evidence for this assessment' : 'What is still missing'));
  if (claim.evidence.length) claim.evidence.forEach((id) => sources.append(sourceCard(evidenceSource(sample, id))));
  else add(sources, paragraph('A dated announcement from an identifiable authority. No such source is included in this evidence pack.', 'quiet-copy'));
  add(wrap, context, question, sources, link('View all sources →', 'sources'), link('Share a summary with sources', 'share'), link('Challenge this assessment', 'feedback'));
  return wrap;
}
function renderSources(sample) {
  const wrap = element('div', 'panel-body');
  add(wrap, link('← Results overview', 'results'), heading('FOLLOW THE EVIDENCE', 'Sources, not just labels.', 'Open a source to see who published it, where to look, and what it can—and cannot—establish.'));
  if (sample.sources.length) sample.sources.forEach((source) => wrap.append(sourceCard(source)));
  else add(wrap, paragraph('No official source is included for this fictional announcement.', 'empty-evidence'), paragraph('The claim remains unresolved. This does not establish that it is false. In a real case, check the original announcement, the date, the services covered, and independent reporting.'));
  add(wrap, paragraph('Source quality and source independence matter. Multiple copies of one story are not necessarily independent evidence.', 'quiet-copy'), link('Prepare a shareable summary', 'share', 'button button-outline full-button'), link('Return to reading', 'reading'));
  return wrap;
}
function summaryText(sample) {
  return ['LogiQ — curated UX demonstration, not a live fact-check.', `Fictional article: ${sample.title}`, '', sample.takeaway, '', ...sample.claims.map((claim) => `${claim.label}: ${claim.text}`), '', 'Selected evidence:', ...(sample.sources.length ? sample.sources.map((source) => `${source.publisher} — ${source.title}\n${source.url}`) : ['No official source is included in this fictional sample.']), '', 'Evidence pack curated 15 November 2026. Claims may need further context; this demonstration is not a current assessment of a real article.'].join('\n');
}
function renderShare(sample) {
  const wrap = element('div', 'panel-body');
  add(wrap, link('← Results overview', 'results'), heading('SHARE THE CONTEXT', 'A clearer conversation.', 'Preview a short summary with its evidence and limitations. Nothing is posted automatically.'));
  const label = element('label', 'field-label', 'Summary to copy'); label.htmlFor = 'news-share-text';
  const field = element('textarea', 'share-field'); field.id = 'news-share-text'; field.rows = 12; field.readOnly = true; field.value = summaryText(sample);
  const status = paragraph('', 'copy-status'); status.setAttribute('role', 'status');
  const copy = button('Copy summary & sources', 'button button-dark full-button', async () => {
    const revision = state.revision; copy.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      if (revision === state.revision) status.textContent = 'Copied, including sources and the demo notice. Nothing was posted.';
    } catch (_) {
      if (revision === state.revision) { status.textContent = 'Automatic copying is unavailable. Select the summary and use your device’s Copy command.'; field.focus(); field.select(); }
    } finally { if (revision === state.revision) copy.disabled = false; }
  });
  add(wrap, label, field, copy, status, link('Back to the article', 'reading'));
  return wrap;
}
function renderFeedback() {
  const wrap = element('div', 'panel-body');
  add(wrap, link('← Results overview', 'results'), heading('YOUR JUDGMENT MATTERS', 'How did this second look feel?', 'Try the feedback interaction. These answers stay in this tab and are not collected as research.'));
  const form = element('form', 'feedback-form');
  const fieldset = element('fieldset'); add(fieldset, element('legend', '', 'Choose one response'));
  const saved = state.feedback[state.sample] || {};
  [['helpful', 'Helpful'], ['unclear', 'Unclear'], ['disagree', 'I disagree']].forEach(([value, text]) => {
    const label = element('label', 'feedback-choice'); const input = element('input'); input.type = 'radio'; input.name = 'rating'; input.value = value; input.checked = saved.rating === value;
    add(label, input, element('span', '', text)); fieldset.append(label);
  });
  const label = element('label', 'field-label', 'What would you change? (optional)'); label.htmlFor = 'news-feedback-note';
  const note = element('textarea'); note.id = 'news-feedback-note'; note.maxLength = 500; note.rows = 3; note.value = saved.note || '';
  const status = paragraph('', 'feedback-status'); status.setAttribute('role', 'status');
  const submit = element('button', 'button button-dark full-button', 'Preview feedback confirmation'); submit.type = 'submit';
  form.addEventListener('submit', (event) => {
    event.preventDefault(); const rating = new FormData(form).get('rating');
    if (!['helpful', 'unclear', 'disagree'].includes(rating)) { status.textContent = 'Choose Helpful, Unclear, or I disagree first.'; return; }
    state.feedback[state.sample] = { rating, note: note.value };
    status.textContent = 'Your response is selected for this demo only. It has not been sent or saved outside this tab.';
  });
  form.addEventListener('input', () => { status.textContent = ''; });
  add(form, fieldset, label, note, paragraph('Please leave personal information out of this preview.', 'quiet-copy'), submit, status);
  add(wrap, form, link('Return to reading', 'reading'));
  return wrap;
}
function renderUnavailable() {
  const wrap = element('div', 'panel-body');
  add(wrap, heading('WE COULD NOT READ THIS ARTICLE', 'The headline is not enough.', 'The full article is not available in this sample. No claims have been assessed.'), paragraph('A real product would need permission and access to the article text. It should not bypass a subscription wall or infer a result from the headline.', 'quiet-copy'), link('Try the text entry screen', 'start', 'button button-outline full-button'));
  const another = element('a', 'panel-link', 'Try an accessible sample →'); another.href = route('reading', null, 'repair');
  add(wrap, another, link('Return to the article', 'reading')); return wrap;
}
function render() {
  clearTimeout(state.timer); state.revision += 1;
  if ($('source-dialog').open) $('source-dialog').close();
  const [requested, query = ''] = location.hash.slice(1).split('?'); const params = new URLSearchParams(query);
  state.sample = Object.hasOwn(newsSamples, params.get('sample')) ? params.get('sample') : 'repair';
  state.view = views.has(requested) ? requested : 'reading'; state.claim = params.get('claim');
  const sample = newsSamples[state.sample];
  if (sample.unavailable && ['results', 'claim', 'sources', 'share', 'feedback'].includes(state.view)) state.view = 'unavailable';
  renderArticle(sample); $('news-sample').value = state.sample;
  const hasPanel = state.view !== 'reading';
  $('reader-layout').classList.toggle('has-panel', hasPanel);
  $('verification-panel').hidden = !hasPanel; $('reading-aside').hidden = hasPanel;
  $('reading-browser').classList.toggle('phone-layout', state.phone);
  $('check-article').hidden = hasPanel;
  $('view-status').textContent = ({ reading: 'Reading', start: 'Start a check', checking: 'Preparing sample', results: 'Claims overview', claim: 'Claim details', sources: 'Sources & context', share: 'Share summary', feedback: 'Feedback preview', unavailable: 'Article unavailable' })[state.view];
  for (const id of ['close-panel', 'read-tab']) $(id).href = route('reading');
  $('panel-home').href = route('results'); $('new-check').href = route('start');
  if (hasPanel) {
    const renderers = { start: renderStart, checking: renderChecking, results: renderResults, claim: renderClaim, sources: renderSources, share: renderShare, feedback: renderFeedback, unavailable: renderUnavailable };
    $('panel-content').replaceChildren(renderers[state.view](sample));
    const target = $('panel-content').querySelector('h2'); if (target) target.focus({ preventScroll: true });
    if (matchMedia('(max-width: 780px)').matches || state.phone) $('verification-panel').scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}
for (const id of ['check-article', 'aside-check', 'article-check-inline']) $(id).addEventListener('click', () => go('checking'));
$('news-sample').addEventListener('change', (event) => { location.hash = route('reading', null, event.target.value); });
$('mobile-preview').addEventListener('click', () => {
  state.phone = !state.phone; $('mobile-preview').setAttribute('aria-pressed', String(state.phone));
  $('mobile-preview').textContent = state.phone ? 'Desktop layout' : 'Phone layout'; render();
});
$('reset-news').addEventListener('click', () => {
  state.feedback = {}; state.phone = false; $('mobile-preview').setAttribute('aria-pressed', 'false'); $('mobile-preview').textContent = 'Phone layout';
  location.hash = route('reading', null, 'repair'); if (state.sample === 'repair' && state.view === 'reading') render();
});
window.addEventListener('hashchange', render);
$('app').hidden = false; render();
