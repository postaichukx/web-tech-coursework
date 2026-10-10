# Z1 – Moja online vizitka

**Meno:** Pavlo Postaichuk  
**Predmet:** WEBTE1  
**Školský server:** https://webte1.fei.stuba.sk/~xpostaichuk/Z1_postaichuk/index.html

## Obsah webu

Web je osobná online vizitka s piatimi stránkami: profil, životopis, pracovné
prostredie, rozvrh a interaktívna mapa. Stránky používajú spoločný dizajn,
responzívnu navigáciu, lokálne písma a slovenský text. Rozvrh zobrazuje aktuálnu
alebo najbližšiu hodinu a priebeh semestra; mapa umožňuje pridávať vlastné body,
počítať vzdialenosť Haversinovým vzorcom a ukladať body.

## Zdroje a licencie

- Osobná fotografia: osobný archív.
- Ilustrácia pracovného prostredia: vytvorená pomocou OpenAI Codex podľa promptu
  uvedeného na stránke `pages/map.html`.
- Mapové podklady: [OpenStreetMap](https://www.openstreetmap.org/copyright),
  licencované pod [ODbL](https://opendatacommons.org/licenses/odbl/).
- Mapová knižnica: [Leaflet](https://leafletjs.com/), BSD-2-Clause licencia.
- Počasie: [Open-Meteo](https://open-meteo.com/), podľa podmienok služby.
- Písma: [MAVERICK od PINISIART](https://www.dafont.com/new.php) a
  [Histore Magical Italic Demo od Letterena Studios](https://www.dafont.com/new.php).

## Použitie AI

Pri príprave ilustrácie pracovného prostredia a pri návrhu časti HTML, CSS a
JavaScriptu bol použitý OpenAI Codex. Výsledný kód bol skontrolovaný a upravenýmnou.

## Technické poznámky

- Použité sú HTML5, CSS a vanilla JavaScript bez frameworkov.
- Leaflet sa používa iba na stránke `pages/map.html`, ako povoľuje zadanie.
- Favicon je v súbore `img/favicon.ico` a vychádza z monogramu PP.
