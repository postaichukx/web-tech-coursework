const url = "./source/kino-hviezda.html";

async function parseKino(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();

        const parser = new DOMParser();
        const source = parser.parseFromString(html, "text/html");
        const films = source.querySelectorAll(".film");
        const filmData = Array.from(films).map((film) => {
            const priceElement = film.querySelector(".cena");
            const genreElement = film.querySelector(".zaner");
            const titleElement = film.querySelector(".nazov");

            return{
                genre: genreElement.textContent.replace(/\s+/g, " ").trim(),
                title: titleElement.textContent.replace(/\s+/g, " ").trim(),
                price: priceElement ? Number(priceElement.textContent.replace("€", "").replace(",", ".").trim()) : null
            };
        });
        console.log(films);

        const cards = [];

        filmData.forEach((film) => {
            const card = document.createElement("div");
            card.classList.add("film-card");

            const ulEl = document.createElement("ul");
            const title = document.createElement("h2");
            const genre = document.createElement("li");
            const price = document.createElement("li");

            title.innerText = film.title;
            genre.innerText = film.genre;
            if(film.price === null){
                price.innerText = "nie je cena";
            } else{
                price.innerText = film.price.toFixed(2) + " €";
            }
            ulEl.appendChild(genre);
            ulEl.appendChild(price);
            const qwe = document.querySelector("#program");
            card.appendChild(title);
            card.appendChild(ulEl);
            qwe.appendChild(card);
            cards.push({ card: card, genre: film.genre });
        });

        console.log(filmData);

        const filters = document.querySelector("#filters");
        const genres = filmData.map((film) => film.genre);
        const uniqueGenres = Array.from(new Set(genres));
        uniqueGenres.forEach((genre) => {

            const labelEl = document.createElement("label");
            const checkboxEl = document.createElement("input")
            checkboxEl.type = "checkbox";
            checkboxEl.checked = true;

            labelEl.append(checkboxEl, " " + genre);
            filters.appendChild(labelEl);

            checkboxEl.addEventListener("change", () => {
                cards.forEach((item) => {
                    if (item.genre === genre) {
                        item.card.hidden = !checkboxEl.checked;
                    }
                });
            });
        });
    }
    catch(err){
        console.log(err);
    }
}
parseKino(url);
