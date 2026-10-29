# Overenie projektu

Kontrola aktuálnej verzie: **26. 10. 2026**.

## Validita

### HTML

- Validátor: [Nu Html Checker](https://validator.w3.org/nu/)
- Súbor: `index.html`
- Verzia validátora: `26.10.18`
- Výsledok: `messages: []` — **0 chýb a 0 upozornení**.

### CSS

- Validátor: [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/)
- Súbor: `css/styles.css`
- Profil: CSS3
- Výsledok: **0 chýb a 0 upozornení**.

## Načítanie HTML a funkčná kontrola

- `node --check js/script.js` — bez syntaktických chýb.
- Pôvodné stránky boli stiahnuté 26. 10. 2026 a uložené v `restauracie/`:
  - Eat & Meet — HTTP 200, 127 657 bajtov.
  - Reštaurácia DRAG — HTTP 200, 20 889 bajtov.
  - White Dragon — HTTP 200, 199 180 bajtov.
- Stránka bola otvorená cez lokálny HTTP server v Chrome. Všetky tri lokálne HTML súbory sa načítali, ich parsery našli jedlá a zobrazili sa tri karty s cenami a časom stiahnutia kópie.
- Kontrola nepotvrdzuje, že uložené menu zostane aktuálne po zmene ponuky na pôvodnom webe. Na obnovenie treba stiahnuť novú HTML kópiu a stlačiť „Aktualizovať menu“.
- Proxy aj live režim sú odstránené; zdrojový kód stránky už neodosiela požiadavky na weby reštaurácií.

## Súlad a zostávajúce kroky

- PDF zadania uvádza prepínanie medzi živým načítaním a lokálnou kópiou. Dodatočná správa vyučujúceho odporúča stiahnuť HTML stránky pri chybách CORS; táto verzia preto používa iba lokálne kópie. Ak sa má doslovne zachovať požiadavka prepínania režimov, treba potvrdiť u vyučujúceho, že lokálny režim ju nahrádza.
- Samostatná kontrola v aktuálnom Firefoxe a vizuálna kontrola na úzkom mobilnom displeji ešte nebola vykonaná.
- Stránku treba zverejniť na školskom serveri a priložiť jej URL.
- Pred odovzdaním vytvorte ZIP podľa názvového formátu zadania; skontrolujte, že v koreňovom adresári archívu sú `index.html` a `README.md`.
