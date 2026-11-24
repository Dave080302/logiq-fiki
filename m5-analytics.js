/* M5: automatic PostHog website, product, and masked session-replay analytics. */
(() => {
  'use strict';
  const config = window.LOGIQ_M5_CONFIG || {};
  const host = String(config.posthogApiHost || '').trim();
  const token = String(config.posthogProjectToken || '').trim();
  const configured = /^phc_[A-Za-z0-9_-]{8,}$/.test(token) &&
    /^https:\/\/(eu|us)\.i\.posthog\.com$/.test(host);
  const optOutKey = 'logiq_m5_tracking_disabled';
  const control = document.getElementById('m5-tracking-toggle');
  const events = [];
  let initialized = false;
  let loading = false;
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const pageType = (pageName === 'landing.html' || document.getElementById('m5-lead-form')) ? 'landing' :
    pageName === 'news.html' ? 'prototype' :
    pageName === 'm5-campaign.html' ? 'campaign' : 'fiki';

  const safeTag = (value, fallback) =>
    typeof value === 'string' && /^[a-zA-Z0-9_-]{1,50}$/.test(value) ? value : fallback;
  const query = new URLSearchParams(location.search);
  function campaignProps() {
    const values = [['utm_source','campaign_source','direct'],['utm_medium','campaign_medium','none'],['utm_campaign','campaign_name','m5_validation_2'],['utm_content','campaign_content','default']];
    const props = {};
    for (const [name, property, fallback] of values) {
      const fromUrl = safeTag(query.get(name), '');
      if (fromUrl) {
        try { sessionStorage.setItem('logiq_' + name, fromUrl); } catch (_) { /* optional */ }
      }
      let remembered = '';
      try { remembered = sessionStorage.getItem('logiq_' + name) || ''; } catch (_) { /* optional */ }
      props[property] = safeTag(fromUrl || remembered, fallback);
    }
    return props;
  }
  function disabled() {
    try { return localStorage.getItem(optOutKey) === '1'; }
    catch (_) { return false; }
  }
  function updateControl() {
    if (!control) return;
    control.textContent = disabled() ? 'Enable analytics' : 'Disable analytics';
    control.setAttribute('aria-pressed', String(disabled()));
  }
  function track(name, props = {}) {
    if (!configured || disabled()) return;
    const details = {...campaignProps(), page_type: pageType, ...props};
    if (initialized && window.posthog?.capture) window.posthog.capture(name, details);
    else events.push([name, details]);
  }
  window.logiqM5Analytics = {track};

  function loadAnalytics() {
    if (!configured || disabled() || loading || initialized) return;
    loading = true;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
    script.onload = () => {
      if (!window.posthog?.init || disabled()) { loading = false; return; }
      window.posthog.init(token, {
        api_host: host,
        defaults: '2026-08-30',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        rageclick: true,
        disable_session_recording: false,
        persistence: 'localStorage+cookie',
        mask_all_element_attributes: true,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '.m5-signup-card',
          maskInputOptions: {password: true, email: true, text: true, textarea: true}
        }
      });
      initialized = true;
      loading = false;
      track('logiq_page_viewed');
      if (pageType === 'landing') track('landing_page_viewed');
      if (pageType === 'prototype') track('prototype_page_viewed');
      for (const [name, properties] of events.splice(0)) window.posthog.capture(name, properties);
    };
    script.onerror = () => { loading = false; events.length = 0; };
    document.head.appendChild(script);
  }

  control?.addEventListener('click', () => {
    const shouldDisable = !disabled();
    try {
      if (shouldDisable) localStorage.setItem(optOutKey, '1');
      else localStorage.removeItem(optOutKey);
    } catch (_) { /* opt out for current page still applies */ }
    if (shouldDisable) {
      events.length = 0;
      if (initialized) {
        window.posthog.stopSessionRecording?.();
        window.posthog.opt_out_capturing?.();
      }
    } else if (initialized) {
      window.posthog.opt_in_capturing?.();
      window.posthog.startSessionRecording?.();
    } else loadAnalytics();
    updateControl();
  });
  updateControl();
  // Custom events supplement PostHog's automatic clicks, changes, and submissions.
  document.querySelectorAll('[data-m5-track]').forEach(link => link.addEventListener('click', () => {
    track('landing_cta_clicked', {destination: safeTag(link.dataset.m5Track, 'other')});
  }));
  const signup = document.getElementById('early-access');
  if (signup && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        track('lead_form_viewed');
        observer.disconnect();
      }
    }, {threshold: 0.25});
    observer.observe(signup);
  }
  loadAnalytics();
})();
