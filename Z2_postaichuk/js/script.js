"use strict";

const CACHE_KEY = "fei-lunch-menu-v3";
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_NAMES = {
    Monday: "Pondelok",
    Tuesday: "Utorok",
    Wednesday: "Streda",
    Thursday: "Štvrtok",
    Friday: "Piatok"
};

const restaurants = [
    {
        id: "eat-and-meet",
        name: "Eat & Meet",
        address: "Staré Grunty 36, Átriaky",
        url: "https://eatandmeet.sk/tyzdenne-menu",
        localUrl: "restauracie/eat-and-meet.html",
        snapshotAt: "2026-10-26T12:19:38Z",
        parser: parseEatAndMeet
    },
    {
        id: "drag",
        name: "Reštaurácia DRAG",
        address: "Staré Grunty 64, Bratislava",
        url: "https://www.restauracia-drag.sk/restauracia-drag",
        localUrl: "restauracie/drag.html",
        snapshotAt: "2026-10-26T12:19:36Z",
        parser: parseDrag
    },
    {
        id: "white-dragon",
        name: "White Dragon",
        address: "Staré Grunty 18, Karlova Ves",
        url: "https://whitedragon.sk/menucka/",
        localUrl: "restauracie/white-dragon.html",
        snapshotAt: "2026-10-26T12:19:38Z",
        parser: parseWhiteDragon
    }
];

let allDishes = [];
let currentDay = getInitialDay();
let sourceTimes = {};
let isLoading = false;
const restaurantVisibility = {};

function getInitialDay() {
    const today = new Date().getDay();
    if (today === 0 || today === 6) return "Monday";
    return WEEKDAYS[today - 1];
}

function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function cleanText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function categoryFromLabel(label) {
    const normalized = cleanText(label).toLocaleLowerCase("sk");
    if (normalized.includes("polievka")) return "soup";
    if (normalized.includes("vegetari")) return "vegetarian";
    if (normalized.includes("šalát")) return "salad";
    if (normalized.includes("sladk") || normalized.includes("dezert") || normalized.includes("múčne")) return "dessert";
    if (normalized.includes("špeciál")) return "special";
    if (normalized.includes("hlavné") || normalized.includes("menu") || normalized.includes("jedlo")) return "main";
    return "other";
}

function categoryLabel(category) {
    const labels = {
        soup: "Polievky",
        main: "Hlavné jedlá",
        vegetarian: "Vegetariánske",
        salad: "Šaláty",
        dessert: "Sladké a dezerty",
        special: "Špeciálna ponuka",
        other: "Ostatné"
    };
    return labels[category] || labels.other;
}

function parseAllergens(text) {
    const match = text.match(/\((\d+(?:\s*,\s*\d+)*)\)|\/A\s*:\s*(\d+(?:\s*,\s*\d+)*)\/?|\/\s*(\d+(?:\s*,\s*\d+)*)\s*\//i)
        || text.match(/\s(\d+(?:\s*,\s*\d+)*)\s*$/);
    const value = match && (match[1] || match[2] || match[3]);
    return value ? value.split(",").map((item) => item.trim()) : [];
}

function parseWeight(text) {
    const match = text.match(/\b\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*\/\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))?\b/i);
    return match ? cleanText(match[0]) : null;
}

function cleanDishName(text) {
    return cleanText(text)
        .replace(/\/A\s*:\s*\d+(?:\s*,\s*\d+)*\/?/ig, "")
        .replace(/\/\s*\d+(?:\s*,\s*\d+)*\s*\//g, "")
        .replace(/\((?:\d+\s*,\s*)*\d+\)/g, "")
        .replace(/\s+\d+(?:\s*,\s*\d+)*\s*$/g, "")
        .replace(/^\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l)(?:\s*\/\s*\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))?\s*/i, "")
        .replace(/\s*\/\s*$/g, "")
        .trim();
}

function parsePrice(priceText) {
    const normalized = cleanText(priceText).replace(/\s/g, "").replace(",", ".");
    const match = normalized.match(/\d+(?:\.\d{1,2})?/);
    return match ? Number(match[0]) : null;
}

function makeDish(restaurant, day, title, category, priceText, options = {}) {
    const text = cleanText(title);
    const amount = options.price ?? parsePrice(priceText);
    return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        day,
        date: options.date || null,
        category,
        title: options.name || cleanDishName(text),
        price: amount,
        priceText: options.priceText || cleanText(priceText) || null,
        weight: options.weight || parseWeight(text),
        allergens: options.allergens || parseAllergens(text)
    };
}

function parseEatAndMeet(document, restaurant) {
    const dishes = [];
    WEEKDAYS.forEach((day, index) => {
        const cards = document.querySelectorAll(`#day-${index + 1} .menu-details`);
        cards.forEach((card) => {
            const label = card.querySelector(".menu-title h4")?.textContent || "";
            const price = card.querySelector(".menu-title .price")?.textContent || "";
            const description = card.querySelector(".menu-description p.desc")?.textContent || "";
            if (!cleanText(description)) return;
            dishes.push(makeDish(restaurant, day, description, categoryFromLabel(label), price));
        });
    });
    return dishes;
}

function parseDrag(document, restaurant) {
    const dishes = [];
    const dayIds = {
        pondelok: "Monday",
        utorok: "Tuesday",
        streda: "Wednesday",
        stvrtok: "Thursday",
        piatok: "Friday"
    };

    Object.entries(dayIds).forEach(([id, day]) => {
        const panel = document.querySelector(`#${id}`);
        if (!panel) return;

        const soupHeading = [...panel.querySelectorAll("h3")]
            .find((heading) => cleanText(heading.textContent).toLocaleLowerCase("sk").includes("polievka"));
        if (soupHeading) {
            const soupText = cleanText(soupHeading.parentElement?.nextSibling?.textContent);
            if (soupText) {
                dishes.push(makeDish(restaurant, day, soupText, "soup", "", {
                    priceText: "Cena polievky nie je uvedená samostatne"
                }));
            }
        }

        panel.querySelectorAll("table tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            const description = cleanText(cells[0]?.textContent);
            const price = cleanText(cells[1]?.textContent);
            if (!description || !price) return;
            dishes.push(makeDish(restaurant, day, description, "main", price));
        });
    });
    return dishes;
}

function parseWhiteDragon(document, restaurant) {
    const dishes = [];
    const menuArticle = [...document.querySelectorAll(".w-grid-item .post_content")]
        .find((content) => /Pondelok/i.test(content.textContent));
    if (!menuArticle) return dishes;

    const paragraphs = [...menuArticle.querySelectorAll("p")];
    const weekText = cleanText(paragraphs[0]?.textContent);
    const dateMatch = weekText.match(/(\d{1,2})\.?\s*[-–]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    const startDate = dateMatch
        ? `${dateMatch[4]}-${String(dateMatch[3]).padStart(2, "0")}-${String(dateMatch[1]).padStart(2, "0")}`
        : null;
    const menuPrice = paragraphs.map((paragraph) => cleanText(paragraph.textContent))
        .find((text) => /Cena menu\s*[–-]/i.test(text)) || "";
    const regularPrice = parsePrice(menuPrice);
    const specialMatch = menuPrice.match(/menu špeciál\s*[–-]\s*(\d+(?:[,.]\d+)?)/i);
    const specialPrice = specialMatch ? Number(specialMatch[1].replace(",", ".")) : regularPrice;

    let activeDay = null;
    const itemNumbers = {};
    const dayPattern = /^(Pondelok|Utorok|Streda|Štvrtok|Piatok)(?=$|\s|Zatvorené)/i;
    const dayMap = {
        pondelok: "Monday",
        utorok: "Tuesday",
        streda: "Wednesday",
        štvrtok: "Thursday",
        piatok: "Friday"
    };

    paragraphs.slice(1).forEach((paragraph) => {
        const lines = (paragraph.innerText || paragraph.textContent || "")
            .split(/\n|\r/)
            .map(cleanText)
            .filter(Boolean);
        lines.forEach((line) => {
            const dayMatch = line.match(dayPattern);
            if (dayMatch) {
                activeDay = dayMap[dayMatch[1].toLocaleLowerCase("sk")];
                itemNumbers[activeDay] = 0;
                const remainder = cleanText(line.slice(dayMatch[0].length));
                if (/^Zatvorené/i.test(remainder)) {
                    dishes.push(makeDish(restaurant, activeDay, remainder, "other", "", {
                        date: getDateForWeekday(startDate, activeDay),
                        priceText: "V tento deň je zatvorené"
                    }));
                } else if (remainder) {
                    addWhiteDragonItem(remainder);
                }
                return;
            }
            if (line.toLocaleLowerCase("sk").startsWith("špeciál:")) {
                if (activeDay) addWhiteDragonItem(line.replace(/^Špeciál\s*:\s*/i, ""), true);
                return;
            }
            if (!activeDay || /^(cena menu|príďte|tešíme sa|dobrú chuť|tím white dragon)/i.test(line)) return;
            if (line.startsWith("Zatvorené")) {
                dishes.push(makeDish(restaurant, activeDay, line, "other", "", {
                    date: getDateForWeekday(startDate, activeDay),
                    priceText: "V tento deň je zatvorené"
                }));
                return;
            }
            addWhiteDragonItem(line);
        });
    });

    function addWhiteDragonItem(line, isSpecial = false) {
        if (!activeDay) return;
        itemNumbers[activeDay] = (itemNumbers[activeDay] || 0) + 1;
        const count = itemNumbers[activeDay];
        const category = isSpecial ? "special" : count <= 2 ? "soup" : /šúľance|žemľovka|koláč|dezert/i.test(line) ? "dessert" : "main";
        const price = isSpecial ? specialPrice : regularPrice;
        const priceText = isSpecial
            ? `Špeciál ${formatPrice(specialPrice)}`
            : `${formatPrice(regularPrice)} / menu`;
        dishes.push(makeDish(restaurant, activeDay, line, category, priceText, {
            date: getDateForWeekday(startDate, activeDay),
            price,
            priceText
        }));
    }

    return dishes;
}

function getDateForWeekday(mondayDate, day) {
    if (!mondayDate) return null;
    const index = WEEKDAYS.indexOf(day);
    if (index < 0) return null;
    const date = new Date(`${mondayDate}T12:00:00`);
    date.setDate(date.getDate() + index);
    return localDateKey(date);
}

function formatPrice(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return "";
    return `${value.toFixed(2).replace(".", ",")} €`;
}

function parseDocument(html, source) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    return source.parser(parsedDocument, source);
}

function readCache() {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cache && cache.savedOn === localDateKey() && Array.isArray(cache.dishes)) return cache;
    } catch (error) {
        console.warn("Uložené menu sa nepodarilo prečítať.", error);
    }
    return null;
}

function saveCache() {
    const cache = {
        savedOn: localDateKey(),
        savedAt: new Date().toISOString(),
        dishes: allDishes,
        sourceTimes
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

async function fetchLocalSource(source) {
    const response = await fetch(source.localUrl);
    if (!response.ok) throw new Error(`Lokálna HTML kópia odpovedala stavom ${response.status}.`);
    return response.text();
}

async function loadMenus(options = {}) {
    if (isLoading) return;
    isLoading = true;
    setLoading(true);
    setPageMessage("");

    try {
        if (!options.force) {
            const cached = readCache();
            if (cached) {
                allDishes = cached.dishes;
                sourceTimes = cached.sourceTimes || {};
                renderEverything();
                return;
            }
        }

        const nextDishes = [];
        const nextTimes = {};
        const results = await Promise.all(restaurants.map(async (source) => {
            try {
                const html = await fetchLocalSource(source);
                const dishes = parseDocument(html, source);
                if (!dishes.length) throw new Error("V zdroji sa nenašli jedlá v očakávanej HTML štruktúre.");
                return { source, dishes, updatedAt: source.snapshotAt, error: null };
            } catch (error) {
                return { source, dishes: [], updatedAt: null, error };
            }
        }));

        results.forEach((result) => {
            if (result.dishes.length) nextDishes.push(...result.dishes);
            nextTimes[result.source.id] = result.updatedAt;
        });
        allDishes = nextDishes;
        sourceTimes = nextTimes;
        if (allDishes.length) saveCache();

        const failed = results.filter((result) => result.error);
        if (failed.length) {
            setPageMessage(failed.length === restaurants.length
                ? "Lokálne HTML kópie sa nepodarilo načítať. Skontroluj, či stránku otváraš cez lokálny server."
                : `Menu sa načítalo z ${restaurants.length - failed.length} z ${restaurants.length} zdrojov.`);
        }
        renderEverything(results);
    } finally {
        isLoading = false;
        setLoading(false);
    }
}

function setLoading(loading) {
    const message = document.querySelector("#loading-message");
    const content = document.querySelector("#menu-content");
    message.hidden = !loading;
    content.setAttribute("aria-busy", String(loading));
}

function setPageMessage(message) {
    document.querySelector("#page-message").textContent = message;
}

function renderEverything(results = []) {
    renderDayButtons();
    renderSelectedDayLabel();
    renderRestaurantFilters();
    renderSourceStatuses(results);
    renderMenuCards();
}

function renderDayButtons() {
    document.querySelectorAll(".day-button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.day === currentDay));
    });
}

function renderSelectedDayLabel() {
    const label = document.querySelector("#selected-day-label");
    if (currentDay === "week") {
        label.textContent = "Pondelok – piatok";
        return;
    }
    const date = allDishes.find((dish) => dish.day === currentDay && dish.date)?.date;
    label.textContent = date ? `${DAY_NAMES[currentDay]} · ${formatDate(date)}` : DAY_NAMES[currentDay];
}

function formatDate(dateString) {
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function formatUpdateTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Čas aktualizácie nie je dostupný";
    const dateLabel = date.toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const timeLabel = date.toLocaleTimeString("sk-SK", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return `${dateLabel} ${timeLabel}`;
}

function renderRestaurantFilters() {
    const filterList = document.querySelector("#restaurant-filters");
    const available = restaurants.filter((source) => allDishes.some((dish) => dish.restaurantId === source.id));
    filterList.replaceChildren();
    available.forEach((source) => {
        if (!Object.prototype.hasOwnProperty.call(restaurantVisibility, source.id)) {
            restaurantVisibility[source.id] = true;
        }
        const label = document.createElement("label");
        label.className = "filter-chip";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = restaurantVisibility[source.id];
        checkbox.value = source.id;
        checkbox.setAttribute("aria-label", `Zobraziť menu: ${source.name}`);
        label.append(checkbox, document.createTextNode(source.name));
        filterList.append(label);
    });
    if (!available.length) {
        const text = document.createElement("span");
        text.className = "filter-placeholder";
        text.textContent = "Zatiaľ nie sú dostupné žiadne reštaurácie.";
        filterList.append(text);
    }
}

function renderSourceStatuses(results) {
    const container = document.querySelector("#restaurant-status");
    container.replaceChildren();
    results.filter((result) => result.error).forEach((result) => {
        const message = document.createElement("p");
        message.className = "alert-source";
        message.textContent = `${result.source.name}: ${result.error.message}`;
        container.append(message);
    });
}

function renderMenuCards() {
    const container = document.querySelector("#menu-content");
    const activeIds = [...document.querySelectorAll("#restaurant-filters input:checked")].map((input) => input.value);
    container.replaceChildren();
    let shownRestaurants = 0;

    restaurants.forEach((source, index) => {
        if (!activeIds.includes(source.id)) return;
        const restaurantDishes = allDishes.filter((dish) => dish.restaurantId === source.id);
        if (!restaurantDishes.length) return;
        const visibleDishes = currentDay === "week"
            ? restaurantDishes
            : restaurantDishes.filter((dish) => dish.day === currentDay);
        const card = createRestaurantCard(source, restaurantDishes, visibleDishes, index);
        container.append(card);
        shownRestaurants += 1;
    });

    if (!shownRestaurants) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        const message = document.createElement("p");
        const hasFilterControls = document.querySelector("#restaurant-filters input") !== null;
        if (hasFilterControls && activeIds.length === 0) {
            message.textContent = "Vyber aspoň jednu jedáleň.";
        } else {
            message.textContent = activeIds.length
                ? "Pre tento výber sa nenašli žiadne jedlá. Skús zmeniť deň alebo filtre."
                : "Pre zvolený deň sa nenašli žiadne jedlá.";
        }
        empty.append(message);
        container.append(empty);
    }
}

function createRestaurantCard(source, allRestaurantDishes, visibleDishes, index) {
    const article = document.createElement("article");
    article.className = "restaurant-card card h-100";
    article.setAttribute("aria-labelledby", `restaurant-${source.id}`);

    const header = document.createElement("header");
    header.className = "restaurant-card-header";
    const top = document.createElement("div");
    top.className = "restaurant-card-top";
    const titleBlock = document.createElement("div");
    const number = document.createElement("span");
    number.className = "restaurant-number";
    number.textContent = `JEDÁLEŇ 0${index + 1}`;
    const title = document.createElement("h3");
    title.id = `restaurant-${source.id}`;
    title.textContent = source.name;
    const address = document.createElement("p");
    address.className = "restaurant-address";
    address.textContent = source.address;
    titleBlock.append(number, title, address);
    top.append(titleBlock);

    const firstDate = visibleDishes.find((dish) => dish.date)?.date;
    if (firstDate) {
        const badge = document.createElement("span");
        badge.className = "menu-date-badge badge rounded-pill";
        badge.textContent = formatDate(firstDate);
        top.append(badge);
    }
    const link = document.createElement("a");
    link.className = "source-link";
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Otvoriť zdroj ↗";
    header.append(top, link);
    article.append(header);

    const body = document.createElement("div");
    body.className = "menu-items";
    if (!visibleDishes.length) {
        const empty = document.createElement("p");
        empty.className = "restaurant-card-empty";
        empty.textContent = currentDay === "week" ? "Menu nie je dostupné." : "V zdroji sa pre tento deň nenašla ponuka.";
        body.append(empty);
    } else if (currentDay === "week") {
        WEEKDAYS.forEach((day) => {
            const dayDishes = visibleDishes.filter((dish) => dish.day === day);
            if (!dayDishes.length) return;
            const daySection = document.createElement("section");
            daySection.className = "menu-day-group";
            const dayHeading = document.createElement("h4");
            dayHeading.className = "menu-category-heading week-day-heading";
            dayHeading.textContent = DAY_NAMES[day];
            daySection.append(dayHeading);
            renderCategories(daySection, dayDishes);
            body.append(daySection);
        });
    } else {
        renderCategories(body, visibleDishes);
    }
    article.append(body);

    const footer = document.createElement("footer");
    footer.className = "restaurant-card-footer";
    const saved = document.createElement("span");
    const sourceTime = sourceTimes[source.id];
    saved.textContent = sourceTime
        ? `HTML kópia stiahnutá ${formatUpdateTimestamp(sourceTime)}`
        : "Dátum stiahnutia kópie nie je dostupný";
    footer.append(saved);
    article.append(footer);
    return article;
}

function renderCategories(container, dishes) {
    const categoryOrder = ["soup", "main", "vegetarian", "salad", "dessert", "special", "other"];
    const grouped = new Map();
    dishes.forEach((dish) => {
        if (!grouped.has(dish.category)) grouped.set(dish.category, []);
        grouped.get(dish.category).push(dish);
    });

    categoryOrder.forEach((category) => {
        const items = grouped.get(category);
        if (!items?.length) return;
        const section = document.createElement("section");
        section.className = `menu-category category-${category}`;
        const heading = document.createElement("h4");
        heading.className = "menu-category-heading";
        const marker = document.createElement("span");
        marker.className = "category-marker";
        marker.setAttribute("aria-hidden", "true");
        heading.append(marker, document.createTextNode(categoryLabel(category)));
        const list = document.createElement("ul");
        list.className = "dish-list list-unstyled";
        items.forEach((dish) => list.append(createDishItem(dish)));
        section.append(heading, list);
        container.append(section);
    });
}

function createDishItem(dish) {
    const item = document.createElement("li");
    item.className = "dish-item";
    const details = document.createElement("div");
    const title = document.createElement("p");
    title.className = "dish-name";
    title.textContent = dish.title || "Názov jedla nie je uvedený";
    details.append(title);
    const metadata = [];
    if (dish.weight) metadata.push(dish.weight);
    if (dish.allergens.length) metadata.push(`Alergény: ${dish.allergens.join(", ")}`);
    if (metadata.length) {
        const meta = document.createElement("p");
        meta.className = "dish-meta";
        meta.textContent = metadata.join(" · ");
        details.append(meta);
    }
    const price = document.createElement("span");
    price.className = "dish-price";
    const priceLabel = dish.priceText || (dish.price === null ? "Cena neuvedená" : formatPrice(dish.price));
    price.textContent = priceLabel;
    if (dish.price === null) price.classList.add("is-missing");
    item.append(details, price);
    return item;
}

function bindEvents() {
    $(document).on("click", ".day-button", function () {
        currentDay = this.dataset.day;
        renderEverything();
    });

    $(document).on("change", "#restaurant-filters input", function () {
        restaurantVisibility[this.value] = this.checked;
        renderMenuCards();
    });

    $("#refresh-menu").on("click", () => {
        localStorage.removeItem(CACHE_KEY);
        loadMenus({ force: true });
    });

    $("#clear-menu").on("click", () => {
        localStorage.removeItem(CACHE_KEY);
        setPageMessage("");
    });

    $("#contact-form").on("submit", function (event) {
        event.preventDefault();
        const form = this;
        const button = form.querySelector('button[type="submit"]');
        const feedback = document.querySelector("#contact-feedback");
        button.disabled = true;
        button.textContent = "Odosielam…";
        feedback.classList.remove("is-error");
        feedback.textContent = "";

        scheduleFeedback(() => {
            feedback.textContent = "Ďakujeme za správu. Toto je ukážkový formulár — správa sa neodosiela na server.";
            form.reset();
            button.disabled = false;
            button.replaceChildren(document.createTextNode("Odoslať správu "));
            const arrow = document.createElement("span");
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = "↗";
            button.append(arrow);
        });
    });
}

function scheduleFeedback(callback) {
    window.setTimeout(callback, 5000);
}

function initialize() {
    bindEvents();
    renderEverything();
    loadMenus();
}

$(initialize);
