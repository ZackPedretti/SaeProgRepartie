import {meteoJson} from "./meteo.js";
import {restaurantsJson} from "./restaurants.js";
import {travauxJson} from "./travaux.js";
import {getAllVelibs} from "./velib.js";

const zoomMap = 12;

//Template des icones utilisés sur la map
const mapIcons = L.Icon.extend({
    options: {
        iconSize: [30, 40],
        iconAnchor: [8, 38],
        popupAnchor: [6, -35]
    }
});

document.addEventListener("DOMContentLoaded", function () {

    let weatherData; // Variable pour stocker les données météorologiques
    const dateSelect = document.getElementById("date-select");
    const meteoContainer = document.getElementById("meteo");
    const meteoHeader = document.getElementById("meteoHeader")
    const hourSelect = document.getElementById("hour-select"); // Sélection de l'élément hour-select

    // Fonction pour générer le tableau HTML pour une date spécifique et heure spécifique
    function generateWeatherTable(selectedDate, selectedHour) {
        const key = `${selectedDate} ${selectedHour}:00:00`;

        const weather = weatherData[key];
        if (!weather) {
            console.error(`No weather data found for ${key}`);
            return;
        }

        let image = "";

        if (weather["risque_neige"] === "oui") {
            image = "neige.svg";
        } else if (weather["pluie"] > 1) {
            image = "pluie.svg";
        } else if (weather["nebulosite"]["totale"] > 66) {
            image = "nuage.svg";
        } else if (weather["nebulosite"]["totale"] > 33) {
            image = "soleil_nuageux.svg";
        } else {
            image = "soleil.svg";
        }

        const angle_vent = weather["vent_direction"]["10m"] - 180;
        let vent = "";
        if (angle_vent < 22.5 || angle_vent > 337.5) {
            vent = "S";
        } else if (angle_vent < 67.5) {
            vent = "SW";
        } else if (angle_vent < 112.5) {
            vent = "W";
        } else if (angle_vent < 157.5) {
            vent = "NW";
        } else if (angle_vent < 202.5) {
            vent = "N";
        } else if (angle_vent < 247.5) {
            vent = "NE";
        } else if (angle_vent < 292.5) {
            vent = "E";
        } else {
            vent = "SE";
        }


        // Générer le tableau HTML
        // Insérer le tableau HTML dans meteoContainer
        meteoContainer.innerHTML = `
    <img src="images/meteo/${image}" alt="logo meteo">
    <p>Température : <span>${Math.round(weather.temperature.sol - 273.15)} °C</span></p>
    <p>Direction du vent : <span>${vent}</span></p>
    <p>Vent moyen : <span>${weather["vent_moyen"]["10m"]} km/h</span></p>
    <p>Vent des rafales : <span>${weather["vent_rafales"]["10m"]} km/h</span></p>
    <p>Humidité : <span>${weather["humidite"]["2m"]} %</span></p>
    <p>Iso Zero : <span>${weather["iso_zero"]} m</span></p>
    <p>Pression : <span>${weather["pression"]["niveau_de_la_mer"]} Pa</span></p>
    <p>CAPE : <span>${weather["cape"]} m²/s²</span></p>
`;
    }

    // Fonction pour mettre à jour la liste déroulante des dates
    function updateDateSelect() {
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

        let dates = [];
        for (let key in weatherData) {
            if (dateRegex.test(key) && !dates.includes(key.slice(0, 10))) {
                dates.push(key.slice(0, 10));
            }
        }

        dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dateSelect.appendChild(option);
        });
    }

    // Gérer le changement de sélection dans la liste déroulante de dates
    dateSelect.addEventListener("change", function () {
        const selectedDate = this.value;
        createHourSelect(selectedDate); // Mettre à jour le combobox des heures en fonction de la date sélectionnée
        const selectedHour = hourSelect.value; // Récupérer l'heure sélectionnée
        generateWeatherTable(selectedDate, selectedHour); // Générer le tableau avec la date et l'heure sélectionnées
    });

    // Gérer le changement de sélection dans la liste déroulante des heures
    hourSelect.addEventListener("change", function () {
        const selectedDate = dateSelect.value; // Récupérer la date sélectionnée
        const selectedHour = this.value; // Récupérer la nouvelle heure sélectionnée
        generateWeatherTable(selectedDate, selectedHour); // Générer le tableau avec la date et la nouvelle heure sélectionnées
    });

    // Initialiser les données météorologiques et les contrôles
    meteoJson().then(function (JSON) {
        weatherData = JSON;
        updateDateSelect();

        // Créer le combobox des heures après avoir chargé les données météorologiques
        createHourSelect(dateSelect.value);

        // Afficher les données pour la première date disponible au chargement de la page
        if (dateSelect.options.length > 0) {
            const firstDate = dateSelect.options[0].value;
            const selectedHour = hourSelect.value; // Récupérer l'heure sélectionnée (peut être vide)
            generateWeatherTable(firstDate, selectedHour); // Passer l'heure sélectionnée
        }
    });

    // Fonction pour créer le combobox des heures pour une date donnée
    function createHourSelect(selectedDate) {
        hourSelect.innerHTML = ""; // Effacer les options existantes

        const hours = []; // Stocker les heures disponibles
        for (let key in weatherData) {
            if (key.startsWith(selectedDate)) {
                hours.push(key.slice(11, 13)); // Récupérer l'heure à partir de la clé
            }
        }

        // Trier les heures (optionnel, dépend de vos besoins)
        hours.sort();

        // Créer les options du combobox des heures
        hours.forEach(hour => {
            const option = document.createElement("option");
            option.value = hour;
            option.textContent = `${hour}:00`;
            hourSelect.appendChild(option);
        });

        // Sélectionner la première heure par défaut si disponible
        if (hours.length > 0) {
            hourSelect.value = hours[0];
        }
    }
});


//STATIONS VELIB
//Icones velib
const emptyStationVelibIcon = new mapIcons({iconUrl: 'images/emptyStationVelibIcon.svg'}); //323 x 388 px
const fewPlacesStationVelibIcon = new mapIcons({iconUrl: 'images/fewPlacesStationVelibIcon.svg'});
const fullStationVelibIcon = new mapIcons({iconUrl: 'images/fullStationVelibIcon.svg'});
//Groupe des markers des stations velib
const stationMarkers = L.layerGroup();
//Récupération des donées des sations velib JSON
getAllVelibs()
    .then(stationsVelib => {
        stationsVelib.forEach(function (station, index, array) {
            //Icon d'une couleur différente en fonction du nombre de place disponible
            if (station.bikesAvailable == 0) {
                var iconStation = emptyStationVelibIcon;
            } else if (station.bikesAvailable < 5) {
                var iconStation = fewPlacesStationVelibIcon;
            } else {
                var iconStation = fullStationVelibIcon;
            }
            L.marker([station.lat, station.lon], {icon: iconStation}).addTo(stationMarkers).bindPopup(
                `<h1> ${station.stationName} </h1>
            <h2> ${station.address} </h2>
            <p> Nombre de vélos disponibles : ${station.bikesAvailable} </p>
            <p> Nombre de docks disponibles : ${station.docksAvailable} </p>
            <p> Capacité : ${station.capacity} </p>`);
        });
    });


//RESTAURANTS
//Fonction pour afficher le formulaire pour réserver une table dans un restaurant
function reservation(IdRestaurant) {
    // Supprimez tout formulaire de réservation existant
    const existingForm = document.getElementById('reservationForm');
    if (existingForm) {
        existingForm.remove();
    }

    // Créez le formulaire en tant que chaîne HTML
    const formHtml = `
        <form id="reservationForm" method="GET" action="/reservation">
            <input type="hidden" name="idRst" value="${IdRestaurant}">
            <input type="number" name="nbPers" placeholder="Nombre de personnes" required>
            <input type="date" name="date" required>
            <button type="submit">Confirmer la réservation</button>
        </form>
    `;

    // Ajoute le formulaire au corps du document
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHtml;
    document.getElementById("formulaire").appendChild(formContainer)
}
const restaurantIcon = new mapIcons({iconUrl: 'images/restaurantIcon.svg'});
//Groupe des markers des restaurants
const restaurantMarkers = L.layerGroup();
//Récupération des donées des restaurants JSON
restaurantsJson()
    .then(table => {
        console.log(table);
        table.Restaurants.forEach(function (restaurant, index) {
            const marker = L.marker([restaurant.lat, restaurant.lon], {icon: restaurantIcon}).addTo(restaurantMarkers).bindPopup(
                `<h1> ${restaurant.nom} </h1>
                 <p> ${restaurant.adresse}</p>
                 <button id="reserve-btn-${restaurant.id}"> Réserver une table </button>`);
            marker.on('popupopen', () => {
                const btn = document.getElementById('reserve-btn-'+restaurant.id);
                btn.addEventListener('click', () => {
                    reservation(restaurant.id);
                })
            })
        });
    });


//TRAVAUX
const travauxIcon = new mapIcons({iconUrl: 'images/tavauxIcon.svg'});
//Groupe des markers des travaux
const travauxMarkers = L.layerGroup();
travauxJson()
    .then(travaux => {
        console.log(travaux);
        travaux.incidents.forEach(function (travail) {
            L.marker([travail.location.polyline.split(" ")[0], travail.location.polyline.split(" ")[1]], {icon: travauxIcon}).addTo(travauxMarkers).bindPopup(
                `<h1> ${travail.short_description} </h1>
            <h2> Type : ${travail.type} </h2>
            <h3> Description : ${travail.description} </h3>
            <p> Date de début : ${travail.creationtime} </p>
            <p> Date de fin (peut être) : ${travail.endtime} </p>`
            );
        });
    })


//4 types de map différentes
const mapType1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap'
});
const mapType2 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});
const mapType3 = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
});
const mapType4 = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

//Les types de map
const baseMaps = {
    "OpenStreetMap": mapType1,
    "OpenStreetMap.HOT": mapType2,
    "OpenStreetMap.OSM": mapType3,
    "Google Map Satellite": mapType4
};

//Les groupes de markers
const overlayMaps = {
    "Stations Velib": stationMarkers,
    "Restaurants": restaurantMarkers,
    "Travaux": travauxMarkers
};

//Construction de la map avec des données de base (centrée sur Nancy avec la type de map 1 et uniquement les stations d'affichées)
const map = L.map('map', {center: [48.692054, 6.184417], zoom: zoomMap, layers: [mapType1, restaurantMarkers]});

//Ajout des différents types de map et objets à choisir d'afficher
L.control.layers(baseMaps, overlayMaps).addTo(map);