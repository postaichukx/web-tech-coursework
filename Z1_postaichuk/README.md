# Pavlo Postaichuk – moja online vizitka

- **Meno:** Pavlo Postaichuk, WEBTE1. Číslo krúžku zatiaľ nie je uvedené.
- **Školský server:** stránka zatiaľ nemá uvedenú verejnú adresu.

Na webe predstavujem svoje štúdium, zručnosti a pracovné prostredie. Obsahuje môj rozvrh, mapu cesty z internátu Mladosť
na FEI STU a aktuálne počasie. Vlastné body na mape sa ukladajú v prehliadači.

## Zdroje

- Fotografia `img/photo_2026-09-30_14-45-53.jpg`: môj osobný archív.
- Ilustrácia `img/workspace.svg`: vytvorená pre tento web s pomocou OpenAI Codex.
- Mapy: [OpenStreetMap](https://www.openstreetmap.org/copyright), knižnica [Leaflet 1.9.4](https://leafletjs.com/) –
  povolená iba na stránke mapy.
- Lokality: [FEI STU](https://www.fei.stuba.sk/), [ŠD Mladosť](https://ubytovanieastravovanie.stuba.sk/sd-mladost). Body
  majú približné súradnice.
- Počasie: [Open-Meteo](https://open-meteo.com/).
- Lokálne písma `fonts/MAVERICK.woff2` (PINISIART) a `fonts/Histore Magical Italic DEMO VERSION.woff2` (Letterena
  Studios): pôvodné súbory dodané autorom stránky. Maverick je hlavné písmo, Histore sa používa na motto. Histore je
  demo verzia; presné oprávnenie na verejné použitie oboch fontov treba overiť podľa licencie od autora. Pôvodný Open
  Sans sa už nepoužíva.

Použil som OpenAI Codex na zjednodušenie HTML, CSS a JavaScriptu, úpravu ilustrácie a kontrolu požiadaviek zadania.

## Pred odovzdaním

Doplniť krúžok a adresu na školskom serveri. Skontrolovať pravdivosť údajov o vzdelaní a úrovni zručností. Priebeh
semestra sa počíta automaticky pre 14. 9. 2026 – 14. 12. 2026 podľa dátumov z poskytnutého príkladu. Dátumy sú v
konštantách `SEMESTER_START` a `SEMESTER_END` v `js/script.js`; percento a lišta sa aktualizujú pri načítaní stránky a
každú minútu.

Výsledky online validátorov sú v `docs/validator-html.txt` a `docs/validator-css*.xml`. Podrobná kontrola je v
`docs/assignment-review.md`.

Pri tvorbe `Z1_postaichuk.zip` zabaliť obsah tohto priečinka tak, aby boli `index.html` a `README.md` priamo v koreňovom
adresári ZIP.
