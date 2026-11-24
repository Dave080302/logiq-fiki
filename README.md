# LogiQ · Fiki

[Project journal](https://andrei-27.github.io/logiq-fiki/) · [M4 prototype](https://andrei-27.github.io/logiq-fiki/news.html) · [Wireframes & interview guide](https://andrei-27.github.io/logiq-fiki/ux.html)

M4 simulates automatic news review: read → LogiQ alert → findings and sources → continue. Browser articles and social feeds each have desktop and mobile scenarios. Three fictional stories use curated evidence; there is no live analysis.

Run `python3 serve.py` and open http://localhost:8000/. No build or dependencies required. GitHub Pages serves the repository root from `main`.

Main files: `news.html`, `news.js`, `news-data.js`, `m4.css` (prototype); `ux.html`, `ux.js`, `assets/m4/` (research and wireframes); `index.html` (journal); `site-ui.css`, `site.js` (shared responsive UI).


## M5 — validation 2 (lead generation)

The [landing page](https://andrei-27.github.io/logiq-fiki/landing.html#early-access) has an early-access signup powered by Formspree. The [M5 campaign Fiki](https://andrei-27.github.io/logiq-fiki/m5-campaign.html) records the distribution strategy and will document actual posts, links and channel comparisons after outreach.

The public Formspree endpoint and PostHog EU project token are configured in `m5-config.js` (no private API secrets). The `m5-leads.js` integration sends only opt-in email signups to Formspree. PostHog captures website page views, exits, general clicks, form engagement and custom CTA/signup conversion events automatically on the landing page, project journal, prototype and campaign page. Session replay is enabled in the PostHog project; input values and signup form text are masked, and email addresses are not sent in custom events. Visitors can opt out of tracking through the landing-page footer.

**M5 measurement:** landing visitors → prototype clicks / visits → form engagement → confirmed email signup. Use the PostHog EU dashboard for pageviews, acquisition channels, conversion funnels and session recordings, and Formspree for verified email submissions. Share outreach posts using campaign-specific UTM links and document their actual permalink, publication date, screenshots and measured results. Do not count test submissions as campaign leads.

The public website is served from `main`. Changes in this PR do not activate on the live site until merged and deployed. No outreach impressions, leads or channel winners should be claimed without real campaign evidence.
