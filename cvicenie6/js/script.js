const SOURCE_URL = "source/kino-hviezda.html";
const STORAGE_KEY = "cinema-program";
const DAY_NAMES = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"];

const statusText = document.getElementById("status");
const refreshButton = document.getElementById("refresh");
const clearButton = document.getElementById("clear");
const tabs = document.getElementById("day-tabs");
const schedule = document.getElementById("schedule");

let program = [];
let selectedDay = 0;

async function loadCinemaHtml() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Stránku kina sa nepodarilo načítať (HTTP ${response.status}).`);
  }
  return response.text();
}

function loadCinemaHtmlJquery() {
  return $.ajax({ url: SOURCE_URL, dataType: "text" });
}

function parseHtml(html) {
  return new DOMParser().parseFromString(html, "text/html");
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function parsePrice(text) {
  if (!text) {
    return null;
  }

  const price = parseFloat(text.replace(",", "."));
  return Number.isNaN(price) ? null : price;
}

function textOf(element, selector) {
  return cleanText(element.querySelector(selector)?.textContent ?? "");
}

function parseCinema(doc) {
  const days = [];

  for (const section of doc.querySelectorAll(".den")) {
    const heading = section.querySelector("h2");
    const day = cleanText(heading.firstChild?.textContent ?? "");
    const date = cleanText(heading.querySelector("small")?.textContent ?? "");
    const screenings = [];

    for (const film of section.querySelectorAll(".film")) {
      const time = textOf(film, ".cas");
      const title = textOf(film, ".nazov");

      if (!time || !title) {
        console.warn("Skipping incomplete screening:", film);
        continue;
      }

      screenings.push({
        time,
        title,
        hall: textOf(film, ".sala"),
        price: parsePrice(textOf(film, ".cena")),
      });
    }

    days.push({ day, date, screenings });
  }

  if (days.length === 0) {
    throw new Error("Na stránke kina sa nenašiel program. Možno sa zmenila jej štruktúra.");
  }

  return days;
}

function parseCinemaJquery(doc) {
  const days = [];

  $(doc).find(".den").each((dayIndex, section) => {
    const $section = $(section);
    const $heading = $section.find("h2").first();
    const day = cleanText($heading.contents().first().text());
    const date = cleanText($heading.find("small").text());
    const screenings = [];

    $section.find(".film").each((filmIndex, film) => {
      const $film = $(film);
      const time = cleanText($film.find(".cas").text());
      const title = cleanText($film.find(".nazov").text());

      if (!time || !title) {
        console.warn("Skipping incomplete screening:", film);
        return;
      }

      screenings.push({
        time,
        title,
        hall: cleanText($film.find(".sala").text()),
        price: parsePrice($film.find(".cena").text()),
      });
    });

    days.push({ day, date, screenings });
  });

  if (days.length === 0) {
    throw new Error("Na stránke kina sa nenašiel program. Možno sa zmenila jej štruktúra.");
  }

  return days;
}

function saveProgram(days) {
  const data = { savedAt: new Date().toISOString(), days };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedProgram() {
  const storedText = localStorage.getItem(STORAGE_KEY);
  if (!storedText) {
    return null;
  }

  try {
    const data = JSON.parse(storedText);
    if (!data?.savedAt || !Array.isArray(data.days)) {
      return null;
    }

    const savedAt = new Date(data.savedAt);
    if (Number.isNaN(savedAt.getTime()) || savedAt.toDateString() !== new Date().toDateString()) {
      return null;
    }

    return { savedAt, days: data.days };
  } catch (error) {
    console.warn("Saved cinema data could not be read:", error);
    return null;
  }
}

function getTodayIndex() {
  const todayName = DAY_NAMES[(new Date().getDay() + 6) % 7];
  const index = program.findIndex((day) => day.day === todayName);
  return index === -1 ? 0 : index;
}

function renderTabs() {
  tabs.replaceChildren();

  program.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = day.day;
    button.setAttribute("aria-pressed", String(index === selectedDay));
    button.addEventListener("click", () => {
      selectedDay = index;
      render();
    });
    tabs.appendChild(button);
  });
}

function renderSchedule() {
  schedule.replaceChildren();
  const day = program[selectedDay];
  if (!day) {
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = `${day.day} ${day.date}`;
  schedule.appendChild(heading);

  if (day.screenings.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-day";
    emptyMessage.textContent = "V tento deň sa nepremieta.";
    schedule.appendChild(emptyMessage);
    return;
  }

  const list = document.createElement("ul");
  list.className = "screenings";

  for (const screening of day.screenings) {
    const item = document.createElement("li");
    item.className = "screening";

    const time = document.createElement("span");
    time.className = "screening__time";
    time.textContent = screening.time;

    const title = document.createElement("span");
    title.className = "screening__title";
    title.textContent = screening.title;

    const hall = document.createElement("span");
    hall.className = "screening__hall";
    hall.textContent = screening.hall;

    const price = document.createElement("span");
    if (screening.price === null) {
      price.className = "screening__price-missing";
      price.textContent = "Cena neuvedená";
    } else {
      price.className = "screening__price";
      price.textContent = `${screening.price.toFixed(2)} €`;
    }

    item.append(time, title, hall, price);
    list.appendChild(item);
  }

  schedule.appendChild(list);
}

function render() {
  renderTabs();
  renderSchedule();
}

async function showProgram(forceRefresh = false) {
  const saved = forceRefresh ? null : loadSavedProgram();

  if (saved) {
    program = saved.days;
    statusText.textContent = `Uložený program z ${saved.savedAt.toLocaleString("sk-SK")}.`;
  } else {
    statusText.textContent = "Načítavam program…";
    refreshButton.disabled = true;

    try {
      const html = await loadCinemaHtml();
      const parsedProgram = parseCinema(parseHtml(html));

      // Keep the jQuery parser aligned with the vanilla JavaScript parser.
      if (typeof window.jQuery === "function") {
        const jqueryProgram = parseCinemaJquery(parseHtml(html));
        console.log(
          "JavaScript and jQuery parsers match:",
          JSON.stringify(parsedProgram) === JSON.stringify(jqueryProgram),
        );
      }

      program = parsedProgram;
      saveProgram(program);
      statusText.textContent = `Program aktualizovaný ${new Date().toLocaleString("sk-SK")}.`;
    } catch (error) {
      statusText.textContent = error.message || `Nepodarilo sa načítať program (HTTP ${error.status ?? "?"}).`;
      console.error(error);
      return;
    } finally {
      refreshButton.disabled = false;
    }
  }

  selectedDay = getTodayIndex();
  render();
}

refreshButton.addEventListener("click", () => showProgram(true));

clearButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  statusText.textContent = "Uložené dáta sú vymazané.";
});

showProgram();
