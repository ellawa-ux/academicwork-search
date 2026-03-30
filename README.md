# Testi: Academic Work Finland

Automatisoitu end-to-end-testi, jossa käydään läpi seitsemän skenaariota:
1. Sivun lataus ja testiä varten tarvittavien elementtien tarkistus
2. Hakusanan kirjoitus onnistuu
3. Haun testaus hakusanalla "quality"
4. Hakutulosten määrä päivittyy
5. Hakutuloksissa näkyy kuvaus työtehtävästä

[academicwork.fi](https://www.academicwork.fi/en/jobs).

## Tulokset

Testit 1-5 menevät läpi ilman huomautuksia.

**Keyword search does not filter results server-side.** Searching "quality" and an empty string both return the same number of jobs. Documented in TC-06 and TC-07.

## Tech Stack
- [Playwright](https://playwright.dev/) — JavaScript
- Browsers: Chromium, Firefox, WebKit

## How to Run
npm install
npx playwright install
npx playwright test
