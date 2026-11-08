# Môj TODO List — WEBTE1, zadanie 3

## Stav projektu

Toto je rozpracovaná aplikácia. Aktuálne vie po zadaní povoleného identifikátora načítať a zobraziť úlohy zo školského REST API. Vytváranie, úprava, mazanie, zmena stavu, kalendár a filtrovanie ešte treba dopracovať pred odovzdaním.

## Použité technológie

- HTML, CSS, JavaScript
- React 19 — používateľské rozhranie
- Vite — vývojový server a zostavenie aplikácie
- Fetch API — komunikácia so serverom
- FullCalendar 6 — závislosti sú pripravené, kalendár zatiaľ nie je zapojený

## Spustenie

Potrebný je Node.js vo verzii 20.19+ alebo 22.12+.

```bash
cd Z3_postaichuk
npm ci
npm run dev
```

Otvorte adresu, ktorú vypíše Vite. Pri prvom načítaní úloh zadajte identifikátor povolený školským API. Iný identifikátor server odmietne.

Počas lokálneho vývoja Vite presmeruje požiadavky `/api` na školský server. Pri nasadení sa používa priamo adresa API; server musí povoliť požiadavky z domény nasadenej stránky (CORS).

## Zostavenie

```bash
npm run build
npm run preview
```

Zostavená stránka vznikne v priečinku `dist/`. Pred odovzdaním treba do koreňa odovzdávaného ZIP súboru pridať `README.md` a skontrolovať, že tam je `index.html`. K finálnemu riešeniu treba priložiť aj zdrojové súbory potrebné na vysvetlenie implementácie.

## API

Školské REST API: <https://wt1zadanie.iolab.sk/docs>. Úlohy sa ukladajú na serveri. Ich uchovávanie iba v `localStorage` alebo v lokálnom poli nenahrádza požiadavky zadania.

## Použitie AI

AI nástroj bol použitý na prípravu úvodnej štruktúry projektu, základného načítania úloh a súkromného študijného plánu. Pred odovzdaním túto časť aktualizujem podľa skutočného rozsahu použitia AI. Za finálny kód a jeho obhajobu zodpovedám ja.

## Pred odovzdaním doplniť

- všetky požadované operácie nad úlohami a ich validáciu;
- kalendár, filtre, responzívne zobrazenie a sekciu „O projekte“;
- favicon, kontrolu v Chrome a Firefoxe a odkaz na školský server;
- tento README podľa skutočného finálneho stavu aplikácie.
