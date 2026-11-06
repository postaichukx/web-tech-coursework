# WEBTE1 – Cvičenie 8: prvý projekt vo Vue

Hotový stav cvičenia [Prvý projekt vo Vue](https://webte.iolab.sk/materials/9),
vrátane bonusového formulára na pridanie jedla.

## Spustenie

Potrebujete Node.js 22.18+ alebo 24.12+. V tomto priečinku spustite:

```sh
npm install
npm run dev
```

Otvorte adresu vypísanú terminálom (zvyčajne `http://localhost:5173/`).
Live Server tu nepoužívajte: súbory `.vue` musí spracovať Vite.
Produkčnú zostavu overíte cez `npm run build`. Priečinky `node_modules/` a
`dist/` sa do Gitu nepridávajú.

## Čo je v projekte

- `index.html` obsahuje koreňový element `#app`.
- `src/main.js` pripojí hlavný komponent Vue do `#app`.
- `src/App.vue` drží jedlá, filter, počty objednaných kusov a formulár.
- `src/components/MealItem.vue` zobrazuje jednu položku. Údaje prijíma cez
  props a kliknutie na `+` oznamuje rodičovi udalosťou `order`.

Všetky údaje sú iba v pamäti aplikácie. Obnovenie stránky vynuluje lajky,
objednávku aj pridané jedlá, čo zodpovedá rozsahu cvičenia.
