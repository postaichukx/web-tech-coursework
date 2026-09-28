// ========================================
// 1. WEATHER API
// ========================================

const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=48.15" +
    "&longitude=17.11" +
    "&current=temperature_2m,wind_speed_10m,relative_humidity_2m" +
    "&hourly=precipitation_probability" +
    "&timezone=auto";



fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        const temperature = data.current.temperature_2m;
        const wind = data.current.wind_speed_10m;
        const humidity = data.current.relative_humidity_2m;

        let rainText = "";

        for (let i = 0; i < 8; i++) {
            const time = data.hourly.time[i*3].split("T")[1];
            const chanceRain = data.hourly.precipitation_probability[i*3];

            rainText += time + " - " + chanceRain + "%<br>";
        }

        document.getElementById("weather").innerHTML =
            "Teplota: " + temperature + " °C<br>" +
            "Vietor: " + wind + " km/h<br>" +
            "Vlhkost: " + humidity + "%<br><br>" +
            "<b>Pravdepodobnost zrazok:</b><br>" +
            rainText;


    })
    .catch(error => {

        document.getElementById("weather").innerHTML =
            "Nepodarilo sa načítať počasie.";

        console.error(error);

    });


// ========================================
// 2. LEAFLET MAP
// ========================================

const map = L.map("map").setView(
    [50.909787, 34.796002],
    15
);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map);


// ========================================
// 3. MARKER
// ========================================


L.marker([50.90, 34.79])
    .addTo(map)
    .bindPopup("kokos")
    .openPopup();


L.marker([50.91, 34.78])
    .addTo(map)
    .bindPopup("Hello World")
    .openPopup();

L.marker([50.909787, 34.796002])
    .addTo(map)
    .bindPopup("Shopping Mall Kyiv" )
    .openPopup();

