# Obedové menu v okolí FEI STU

Klientská webová stránka, ktorá načíta uložené HTML kópie troch jedální v okolí FEI STU, spracuje ich ponuku do jednotného formátu a zobrazí menu podľa dňa alebo za celý týždeň. Používateľ môže filtrovať jedálne; spracované údaje sa ukladajú v `localStorage`.

## Spustenie

Stránku treba otvoriť cez lokálny HTTP server, pretože prehliadač nepovoľuje načítavať susedné súbory cez `file://`:

1. Otvorte terminál v priečinku `Z2_postaichuk`.
2. Spustite `python3 -m http.server`.
3. V prehliadači otvorte `http://127.0.0.1:8000/`.

HTML menu sa načítava z projektu. Bootstrap a jQuery sa načítavajú z ich CDN adries, preto vzhľad a obsluha stránky potrebujú internetové pripojenie.

## Súbory

- `index.html` — sémantická štruktúra a slovenský obsah stránky.
- `css/styles.css` — vlastný responzívny dizajn.
- `js/script.js` — Fetch API, `DOMParser`, samostatné parsery, filtre, vykreslenie a cache.
- `restauracie/` — úplné HTML stránky uložené z pôvodných verejných zdrojov; aplikácia načítava tieto súbory.
- `restauracie/testovacie/` — skoršie malé HTML príklady na precvičenie parserov; aplikácia ich nepoužíva.
- `fonts/open-sans.woff2` — lokálne písmo Open Sans.
- `img/favicon.svg` — ikona stránky.
- `docs/validation.md` — aktuálne kontroly a zostávajúce kroky pred odovzdaním.

## HTML zdroje

Všetky tri stránky boli stiahnuté **26. 10. 2026 medzi 12:19:36 a 12:19:38 UTC**. Odkazy v aplikácii vedú na pôvodné weby; samotné menu sa pri otvorení aplikácie z nich nenačítava.

1. [Eat & Meet — týždenné menu](https://eatandmeet.sk/tyzdenne-menu) — `restauracie/eat-and-meet.html`
2. [Reštaurácia DRAG — menu](https://www.restauracia-drag.sk/restauracia-drag) — `restauracie/drag.html`
3. [White Dragon — týždenné menu](https://whitedragon.sk/menucka/) — `restauracie/white-dragon.html`

Keďže ide o uložené snímky stránok, ich obsah sa sám neobnovuje a môže zostarnúť. Ak HTML súbor v projekte nahradíte novšou kópiou, stlačte „Aktualizovať menu“, aby sa znovu načítal aj pri existujúcej cache.

## Ako sa spracúvajú dáta

`fetch()` načíta každý lokálny HTML súbor ako text. `DOMParser` z textu vytvorí samostatný HTML dokument. Parser konkrétnej jedálne vyhľadá v tomto dokumente jej vlastné bloky menu a z nich vytvorí záznamy v spoločnom formáte:

| Pole | Význam |
| --- | --- |
| `restaurantId`, `restaurantName` | identifikácia jedálne |
| `day` | deň v týždni v jednotnom anglickom kľúči |
| `date` | dátum `YYYY-MM-DD`, alebo `null`, ak ho zdroj neuvádza |
| `category` | polievka, hlavné jedlo, vegetariánske, šalát, dezert alebo špeciál |
| `title` | názov jedla bez údajov o alergénoch a hmotnosti |
| `price`, `priceText` | číselná cena, ak sa dá určiť, a pôvodný text ceny |
| `weight` | hmotnosť alebo objem, ak je uvedený |
| `allergens` | zoznam rozpoznaných čísel alergénov |

Všetky parsery vracajú tieto záznamy v rovnakom tvare. Stránka vytvára vlastné DOM elementy a vkladá text cez `textContent`; celý cudzí HTML dokument sa do stránky nevkladá.

## Režim načítania a poznámka k zadaniu

Aktuálna verzia používa výhradne lokálne uložené HTML kópie. Proxy a živý režim sú odstránené; tlačidlo „Aktualizovať menu“ znovu načíta súbory z projektu, nie weby jedální. Takto sa predchádza CORS blokovaniu pri načítaní cudzích stránok.

Vyučujúci v dodatočnej správe odporučil stiahnuť HTML stránky, ak sa objavujú chyby CORS. Pôvodný PDF však výslovne uvádza aj prepínanie medzi živou stránkou a lokálnou kópiou. Súčasná verzia nasleduje novšiu inštrukciu na používanie lokálnych kópií; ak sa pri hodnotení vyžaduje aj doslovné prepínanie režimov, treba si potvrdiť, či je táto výnimka schválená.

## Použité knižnice a písmo

- [Bootstrap 5.3.8](https://getbootstrap.com/docs/5.3/) — responzívne rozloženie a ovládacie prvky.
- [jQuery 3.7.1](https://jquery.com/) — obsluha udalostí filtrov a formulára.
- Fetch API, `DOMParser`, `querySelector`/`querySelectorAll`, `localStorage` — vstavané rozhrania prehliadača.
- Open Sans — lokálny WOFF2 súbor; licencia [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/opensans/OFL.txt); metadáta rodiny písma sú v [Google Fonts](https://github.com/google/fonts/blob/main/ofl/opensans/METADATA.pb).

## Funkcie a obmedzenia

- Výber jedného dňa alebo celého týždňa; filtrovanie jednotlivých jedální.
- Cache spracovaných dát v `localStorage` na aktuálny deň; tlačidlo na jej vymazanie.
- Dátum a čas, kedy bola použitá HTML kópia stiahnutá.
- Ak sa nepodarí načítať jedna kópia alebo zmení sa jej štruktúra, chyba sa zobrazí pre daný zdroj a ostatné jedálne sa načítajú ďalej.
- Kontaktný formulár je ukážkový: po 5 sekundách zobrazí potvrdenie, ale správu nikam neposiela.
- Pred návštevou si overte ponuku priamo u prevádzky; uložené HTML sa samo neaktualizuje.
- Tretí zdroj White Dragon bol schválený vyučujúcim.
- HTML/CSS validáciu, funkčné kontroly a zostávajúce úlohy pozri v `docs/validation.md`.

## Použitie AI

Pri návrhu a implementácii časti HTML, CSS, JavaScriptu a dokumentácie bol použitý OpenAI Codex. Autor projektu zodpovedá za kontrolu kódu a jeho vysvetlenie pri obhajobe.
