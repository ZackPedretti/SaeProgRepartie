import { meteoJson } from "./meteo.js";
import { getAllVelibs} from "./velib.js";
import Handlebars from 'handlebars';

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
    for (var key in JSON) {
        // Vérifier si la clé est une date (format YYYY-MM-DD HH:mm:ss)
        if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(key)) {
            document.getElementById("cartesMeteo").innerHTML += 
            `<div id="carte">
                <h4>${key}</h4>
                <img src="images/meteo/neige.svg" alt="logo meteo" class="carteImage">
                <p>Température : ${Math.round(JSON[key].temperature.sol - 273.15)} °C</p>
            </div>`;
        }
    }
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
