# Academic Work Finland — Playwright Test Suite

Automated end-to-end tests for the job search feature on [academicwork.fi](https://www.academicwork.fi/en/jobs).

## Test Coverage
- Page load and UI element visibility
- Keyword search input acceptance
- Search results returned for keyword "quality"
- Result count label validation
- Job card content validation
- Filter reset behaviour
- Empty/nonsense keyword behaviour

## Bug Found
**Keyword search does not filter results server-side.** Searching "quality" and an empty string both return the same number of jobs. Documented in TC-06 and TC-07.

## Tech Stack
- [Playwright](https://playwright.dev/) — JavaScript
- Browsers: Chromium, Firefox, WebKit

## How to Run
npm install
npx playwright install
npx playwright test