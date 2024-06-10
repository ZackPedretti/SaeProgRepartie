//Les icones utilisés sur la map
var mapIcons = L.Icon.extend({
    options: {
        iconSize:     [30, 30],
        iconAnchor:   [22, 94], 
        popupAnchor:  [-3, -76]
    }
});

//STATIONS VELIB
var velibIcon = new mapIcons({iconUrl: 'images/logo-velib.png'})
var stationJson = {
    "address": "",
    "capacity": 0,
    "lat": 0,
    "lon": 0,
    "name": "",
    "station_id": ""
}
var stations = [];
for (var i = 0; i < 10; i++) {
    let station = structuredClone(stationJson);
    station.address = "a";
    station.capacity = Math.round(Math.random()*50);
    station.lat = 48.692054 + (Math.random()-0.5)*0.05;
    station.lon = 6.184417 + (Math.random()-0.5)*0.05;
    station.name = "b";
    station.station_id = i;
    stations.push(station);
}
//Groupe des markers des stations velib
var stationMarkers = L.layerGroup();
stations.forEach(function (item, index, array) {
    L.marker([item.lat, item.lon], {icon: velibIcon}).addTo(stationMarkers).bindPopup(`<h1> ${item.name} </h1>`);
});

//RESTAURANTS
var restaurantIcon = new mapIcons({iconUrl: 'images/logo-restaurant.png'})
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
restaurants.forEach(function (item, index, array) {
    L.marker([item.lat, item.lon], {icon: restaurantIcon}).addTo(restaurantMarkers).bindPopup(`s<h1> ${item.name} </h1>`);
});

//Deux types de map différents
var mapType1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap'
});
var mapType2 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

//Les types de map
var baseMaps = {
    "OpenStreetMap": mapType1,
    "OpenStreetMap.HOT": mapType2
};

//Les groupes de markers
var overlayMaps = {
    "Stations Velib": stationMarkers,
    "Restaurants": restaurantMarkers
};

//Construction de la map avec des données de base (centrée sur Nancy avec la type de map 1 et uniquement les stations d'affichées)
var map = L.map('map', {center: [48.692054, 6.184417], zoom: 12, layers: [mapType1, stationMarkers]});

//Ajout des différents types de map et objets à choisir d'afficher
L.control.layers(baseMaps, overlayMaps).addTo(map);
