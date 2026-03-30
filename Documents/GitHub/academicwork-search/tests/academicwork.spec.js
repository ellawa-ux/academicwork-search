// @ts-check
const { test, expect } = require('@playwright/test');
 
/**
 * Test Suite: Academic Work Finland — Job Search
 * URL:        https://www.academicwork.fi/en/jobs
 * Keyword:    "quality"
 *
 * HOW TO RUN (VS Code):
 *   1. Place this file in your /e2e folder
 *   2. Run via Playwright VS Code extension (Testing panel) or:
 *        npx playwright test academicwork.spec.js --headed --project=chromium
 */
 
const BASE_URL = 'https://www.academicwork.fi/en/jobs';
const KEYWORD  = 'quality';
 
/**
 * Dismisses the cookie consent dialog.
 * The banner is a dialog[aria-label="Cookie consent"] with an "Accept All Cookies" button.
 * Must be called after page.goto() before any page interaction.
 */
async function acceptCookies(page) {
  try {
    const cookieBtn = page.getByRole('button', { name: 'Accept All Cookies' });
    await cookieBtn.waitFor({ state: 'visible', timeout: 6000 });
    await cookieBtn.click();
    console.log('  ✔ Cookie banner dismissed');
  } catch {
    // No banner appeared — fine, continue
  }
  // Always nuke the OneTrust SDK from the DOM regardless of whether we clicked it.
  // Firefox re-injects and fades the overlay slowly, blocking pointer events.
  // We also inject a CSS rule as a belt-and-suspenders measure.
  await page.evaluate(() => {
    const sdk = document.getElementById('onetrust-consent-sdk');
    if (sdk) sdk.remove();
    // Belt-and-suspenders: inject CSS to kill any lingering overlay
    const style = document.createElement('style');
    style.textContent = '#onetrust-consent-sdk, .onetrust-pc-dark-filter { display: none !important; pointer-events: none !important; }';
    document.head.appendChild(style);
  });
}
 
/**
 * Types a keyword into the job search combobox and submits.
 * The search field is a combobox (not a plain input), so we click it first,
 * fill it, then click "Search now".
 */
async function searchJobs(page, keyword) {
  // Defensively remove OneTrust overlay before every search interaction
  await page.evaluate(() => {
    const sdk = document.getElementById('onetrust-consent-sdk');
    if (sdk) sdk.remove();
    const filter = document.querySelector('.onetrust-pc-dark-filter');
    if (filter) filter.remove();
  });
  const searchBox = page.getByRole('combobox').first();
  await searchBox.click();
  await searchBox.fill(keyword);
  await page.getByRole('button', { name: 'Search now' }).click();
  // Use domcontentloaded instead of networkidle — blocked OneTrust requests
  // prevent networkidle from ever resolving on Chromium
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
}
 
test.describe('Academic Work — Job Search: keyword "quality"', () => {
 
  test.beforeEach(async ({ page }) => {
    // Block OneTrust scripts before the page loads — most reliable cross-browser fix.
    // Firefox re-injects the consent SDK after DOM removal, so we prevent it at the network level.
    await page.route('**/*onetrust*', route => route.abort());
    await page.route('**/*cookielaw*', route => route.abort());
    await page.goto(BASE_URL);
    await acceptCookies(page); // safety net in case banner still appears
  });
 
  // ─────────────────────────────────────────────────────────────────
  // TC-01: Page loads and key elements are visible
  // ─────────────────────────────────────────────────────────────────
  test('TC-01 | Page loads and search elements are visible', async ({ page }) => {
    // Page title contains "jobs"
    await expect(page).toHaveTitle(/jobs/i);
 
    // Search combobox is visible
    const searchBox = page.getByRole('combobox').first();
    await expect(searchBox).toBeVisible();
 
    // "Search now" button is visible
    await expect(page.getByRole('button', { name: 'Search now' })).toBeVisible();
 
    // Job count heading is visible (e.g. "119 available jobs")
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
 
  // ─────────────────────────────────────────────────────────────────
  // TC-02: Typing keyword is accepted by the combobox
  // ─────────────────────────────────────────────────────────────────
  test('TC-02 | Typing keyword is accepted by the search field', async ({ page }) => {
    await page.evaluate(() => {
      const sdk = document.getElementById('onetrust-consent-sdk');
      if (sdk) sdk.remove();
      const filter = document.querySelector('.onetrust-pc-dark-filter');
      if (filter) filter.remove();
    });
    const searchBox = page.getByRole('combobox').first();
    await searchBox.click();
    await searchBox.fill(KEYWORD);
    await expect(searchBox).toHaveValue(KEYWORD);
  });
 
  // ─────────────────────────────────────────────────────────────────
  // TC-03: Search returns at least one result
  // ─────────────────────────────────────────────────────────────────
  test('TC-03 | Search returns at least one result for "quality"', async ({ page }) => {
    await searchJobs(page, KEYWORD);
 
    // Job cards are rendered as level-4 headings
    const jobHeadings = page.getByRole('heading', { level: 4 });
    const count = await jobHeadings.count();
 
    console.log(`  Results found for "${KEYWORD}": ${count}`);
    expect(count).toBeGreaterThan(0);
  });
 
  // ─────────────────────────────────────────────────────────────────
  // TC-04: Result count label updates after search
  // ─────────────────────────────────────────────────────────────────
  test('TC-04 | Result count label is visible after search', async ({ page }) => {
    await searchJobs(page, KEYWORD);
 
    // After a keyword search the page shows a <span> with e.g. "28 matching jobs"
    const countLabel = page.getByText('matching jobs');
    await expect(countLabel).toBeVisible();
 
    const text = await countLabel.textContent();
    console.log(`  Count label: "${text?.trim()}"`);
  });
 
  // ─────────────────────────────────────────────────────────────────
  // TC-05: Job cards contain a title, work type and job type
  // ─────────────────────────────────────────────────────────────────
  test('TC-05 | Job cards contain title, work type and job type', async ({ page }) => {
    await searchJobs(page, KEYWORD);
 
    const jobHeadings = page.getByRole('heading', { level: 4 });
    const count = await jobHeadings.count();
    expect(count).toBeGreaterThan(0);
 
    // Check the first card title is non-empty
    const title = await jobHeadings.first().textContent();
    console.log(`  First result: "${title?.trim()}"`);
    expect(title?.trim().length).toBeGreaterThan(0);
 
    // Work type and job type appear as paragraph text in cards
    await expect(page.getByText(/full time|part time/i).first()).toBeVisible();
    await expect(page.getByText(/staffing|recruitment/i).first()).toBeVisible();
  });
 
});
