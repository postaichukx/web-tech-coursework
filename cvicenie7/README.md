# WEBTE1 – Cvičenie 7: programy viacerých kín

Riešenie cvičenia [Programy viacerých kín naraz](https://webte.iolab.sk/materials/8).

## Spustenie

Otvorte `index.html` cez Live Server alebo z koreňa repozitára spustite
`python3 -m http.server 8000` a navštívte
`http://127.0.0.1:8000/cvicenie7/`. Načítanie cez `file://` nestačí, pretože
`fetch` potrebuje HTTP server.

Predvolený režim používa lokálne súbory v `source/`. Prvé tri sú súčasťou
podkladov cvičenia; `kino-odeon.html` je kópia stránky Hviezdy podľa posledného
kroku zadania. Časy 0,5 / 1 / 1,5 sekundy v `DELAYS` iba simulujú rôzne rýchle
servery. Aktuálny deň sa určuje podľa dátumu zariadenia. Vzorové programy sú
na týždeň od 2. do 8. novembra 2026; mimo neho sa môže zobraziť hlásenie, že
sa dnes nehrá.

## Čo stránka ukazuje

- Každé kino má konfiguráciu v poli `SOURCES`. Nové kino automaticky dostane
  kartu aj filter.
- Programy sa načítajú paralelne. Každá karta sa aktualizuje samostatne po
  dokončení svojho zdroja; chyba jedného kina neblokuje ostatné.
- Karta zobrazuje indikátor načítania, dnešný program alebo chybu s tlačidlom
  na opakovanie, odkaz na pôvodnú stránku a čas posledného úspešného načítania.
- Filter ostáva zachovaný pri opätovnom načítaní. Bootstrap zobrazuje jeden
  stĺpec na mobile, dva od 768 px a tri od 992 px.
- Prepínač lokálne/proxy sa ukladá do `localStorage`. Adresa cieľovej stránky
  sa odovzdá proxy cez `encodeURIComponent`.

Adresy kín `*.example` a `https://proxy.example/?url=` sú zámerne fiktívne
hodnoty zo zadania. Proxy režim preto ukáže chyby. Na jeho reálne použitie
treba nahradiť `PROXY_URL` a `website` skutočnými adresami. Na preverenie
samostatného opakovania jedného kina možno dočasne premenovať
`source/kino-odeon.html`, obnoviť stránku, vrátiť súbor a kliknúť na
„Skúsiť znova“ pri Odeone.
