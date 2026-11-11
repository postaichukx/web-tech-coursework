"use strict";

// Джерело лежить поруч із цією сторінкою. Інтернет не потрібен, але потрібен HTTP-сервер.
const SOURCE_URL = "./eat-and-meet-example.html";
const daysBox = document.querySelector("#days");
const menuBox = document.querySelector("#menu");
const statusText = document.querySelector("#status");
let days = [];
let selectedDay = 0;

function cleanText(value) {
  // textContent може містити переноси й багато пробілів.
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function firstPrice(value) {
  // У джерелі написано "4,50 € / 2,10 €". Беремо ПЕРШЕ число.
  const match = cleanText(value).replace(",", ".").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

async function loadDays() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Кожен блок із id day-1/day-2 — один день; .menu-details — одна страва.
  const sections = [...doc.querySelectorAll('[id^="day-"]')];
  if (!sections.length) throw new Error("Дні не знайдені: перевір селектор");
  return sections.map(section => ({
    name: cleanText(section.querySelector("h2")?.textContent),
    dishes: [...section.querySelectorAll(".menu-details")].map(card => ({
      category: cleanText(card.querySelector(".menu-title h4")?.textContent),
      name: cleanText(card.querySelector(".menu-description p.desc")?.textContent),
      price: firstPrice(card.querySelector(".menu-title .price")?.textContent)
    })).filter(dish => dish.name)
  }));
}

function render() {
  // Кнопки та страви створюємо заново з масиву days, тому після кліку вони узгоджені.
  daysBox.replaceChildren();
  days.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = day.name;
    button.setAttribute("aria-pressed", String(index === selectedDay));
    button.addEventListener("click", () => {
      selectedDay = index;
      render();
    });
    daysBox.append(button);
  });

  menuBox.replaceChildren();
  for (const dish of days[selectedDay].dishes) {
    const article = document.createElement("article");
    article.className = "dish";
    const title = document.createElement("h3");
    title.textContent = dish.name;
    const category = document.createElement("p");
    category.textContent = dish.category;
    const price = document.createElement("p");
    price.textContent = dish.price === null ? "Cena neuvedená" : `${dish.price.toFixed(2)} €`;
    article.append(title, category, price);
    menuBox.append(article);
  }
}

loadDays().then(data => {
  days = data;
  statusText.textContent = `Načítané ${days.length} dni.`;
  render();
}).catch(error => {
  console.error(error);
  statusText.textContent = "Menu sa nepodarilo načítať. Skontroluj URL a spusti stránku cez server.";
});
