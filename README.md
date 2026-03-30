# Testi: Academic Work Finland

Automatisoitu end-to-end-testi, jossa käydään läpi viisi skenaariota:
1. Sivun lataus ja testiä varten tarvittavien elementtien tarkistus
2. Hakusanan kirjoitus onnistuu
3. Haun testaus hakusanalla "quality"
4. Hakutulosten määrä päivittyy
5. Hakutuloksissa näkyy kuvaus työtehtävästä

[academicwork.fi](https://www.academicwork.fi/en/jobs).

## Tulokset

Testit 1-5 menevät läpi ilman huomautuksia.

**Huomiona**, että jos hakusanaa ei syötä enterillä, ei hakusanaa huomioida. Tämä toistuu varsinkin desktopissa selaimessa.
Toisto-ohjeet:
1. Kirjoita hakukenttään "quality". Älä paina enteriä.
2. Valitse Search now -toiminto
3. Koska hakusanaa ei huomioida, haku ei tapahdu.
4. Valitse sitten Clear filter -toiminto.
5. Kirjoittamasi hakusana jää hakukenttään.


## Tekninen info
- [Playwright](https://playwright.dev/) — JavaScript
- Selaimet: Chromium, Firefox, WebKit
