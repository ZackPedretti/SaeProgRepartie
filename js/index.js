import { meteoJson } from "./meteo.js";
import { getAllVelibs} from "./velib.js";

const zoomMap = 12;

//Template des icones utilisés sur la map
var mapIcons = L.Icon.extend({
    options: {
        iconSize:     [30, 40],
        iconAnchor:   [8, 38], 
        popupAnchor:  [6, -35]
    }
});
//Récuperation des données météo JSON
meteoJson()
.then(JSON => {
    console.log(JSON);
    var tableMeteo = 
    `<table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Heure</th>
                <th></th>
                <th>Température</th>
                <th>Direction du vent</th>
                <th>Vent moyen</th>
                <th>Vent des rafales</th>
                <th>Humidité</th>
                <th>Iso Zero</th>
                <th>Pression</th>
                <th>CAPE</th>
            </tr>
        </thead>
        <tbody>
    `;
    for (var key in JSON) {
        // Vérifier si la clé est une date (format YYYY-MM-DD HH:mm:ss)
        if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(key)) {
            //Différents types de météo
            var image = "";
            if (JSON[key]["risque_neige"] == "oui") {
                image = "neige.svg";
            }
            else if (JSON[key]["pluie"] > 1) {
                image = "pluie.svg"
            }
            else if (JSON[key]["nebulosite"]["totale"] > 66) {
                image = "nuage.svg"
            }
            else if (JSON[key]["nebulosite"]["totale"] > 33) {
                image = "soleil_nuageux.svg"
            }
            else {
                image = "soleil.svg";
            }
            //Direction du vent
            var vent = "";
            var angle_vent = JSON[key]["vent_direction"]["10m"] - 180;
            if (angle_vent < 22.5 || angle_vent > 337.5) {
                vent = "S"
            }
            else if (angle_vent < 67.5) {
                vent = "SW";
            }
            else if (angle_vent < 112.5) {
                vent = "W";
            }
            else if (angle_vent < 157.5) {
                vent = "NW";
            }
            else if (angle_vent < 202.5) {
                vent = "N";
            }
            else if (angle_vent < 247.5) {
                vent = "NE";
            }
            else if (angle_vent < 292.5) {
                vent = "E";
            }
            else {
                vent = "SE";
            }
            tableMeteo +=
            `<tr>
                <td>${key.slice(0,10)}</td>
                <td>${key.slice(11,13)}h</td>
                <td><img src="images/meteo/${image}" alt="logo meteo"></td>
                <td>${Math.round(JSON[key].temperature.sol - 273.15)} °C</td>
                <td>${vent}</td>
                <td>${JSON[key]["vent_moyen"]["10m"]} km/h</td>
                <td>${JSON[key]["vent_rafales"]["10m"]} km/h</td>
                <td>${JSON[key]["humidite"]["2m"]} %</td>
                <td>${JSON[key]["iso_zero"]}</td>
                <td>${JSON[key]["pression"]["niveau_de_la_mer"]} Pa</td>
                <td>${JSON[key]["cape"]} m²/s²</td>
            </tr>`;
        }
    }
    tableMeteo += "</tbody></table>"
    document.getElementById("meteo").innerHTML = tableMeteo;
    }
);

//STATIONS VELIB
//Icones velib
var emptyStationVelibIcon = new mapIcons({iconUrl: 'images/emptyStationVelibIcon.svg'}) //323 x 388 px
var fewPlacesStationVelibIcon = new mapIcons({iconUrl: 'images/fewPlacesStationVelibIcon.svg'})
var fullStationVelibIcon = new mapIcons({iconUrl: 'images/fullStationVelibIcon.svg'})
//Groupe des markers des stations velib
var stationMarkers = L.layerGroup();
//Récupération des donées des sations velib JSON
getAllVelibs()
.then(stationsVelib => {
    stationsVelib.forEach(function (station, index, array) {
        //Icon d'une couleur différente en fonction du nombre de place disponible
        if (station.bikesAvailable == 0) {
            var iconStation = emptyStationVelibIcon;
        }
        else if (station.bikesAvailable < 5) {
            var iconStation = fewPlacesStationVelibIcon;
        }
        else {
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
var restaurantIcon = new mapIcons({iconUrl: 'images/restaurantIcon.svg'})
var restaurantJson = {
    "restaurant_id": "",
    "name": "",
    "address": "",
    "codeP" : 0,
    "lat": 0,
    "lon": 0,
    
}
var restaurants = [];
for (var i = 0; i < 10; i++) {
    let restaurant = structuredClone(restaurantJson);
    restaurant.restaurant_id = i;
    restaurant.name = "y";
    restaurant.address = "z";
    restaurant.codeP = 42;
    restaurant.lat = 48.692054 + (Math.random()-0.5)*0.05;
    restaurant.lon = 6.184417 + (Math.random()-0.5)*0.05;
    restaurants.push(restaurant);
}
//Groupe des markers des restaurants
var restaurantMarkers = L.layerGroup();
restaurants.forEach(function (item) {
    L.marker([item.lat, item.lon], {icon: restaurantIcon}).addTo(restaurantMarkers).bindPopup(`s<h1> ${item.name} </h1>`);
});

//Deux types de map différents
var mapType1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap'
});
var mapType2 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});
var mapType3 = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
});
var mapType4 = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

//Les types de map
var baseMaps = {
    "OpenStreetMap": mapType1,
    "OpenStreetMap.HOT": mapType2,
    "OpenStreetMap.OSM": mapType3,
    "Google Map Sattelite": mapType4
};

//Les groupes de markers
var overlayMaps = {
    "Stations Velib": stationMarkers,
    "Restaurants": restaurantMarkers
};

//Construction de la map avec des données de base (centrée sur Nancy avec la type de map 1 et uniquement les stations d'affichées)
var map = L.map('map', {center: [48.692054, 6.184417], zoom: zoomMap, layers: [mapType1, stationMarkers]});

//Ajout des différents types de map et objets à choisir d'afficher
L.control.layers(baseMaps, overlayMaps).addTo(map);
