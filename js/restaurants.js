const restaurantsURL = "http://localhost:8000/restaurant";
const reservationURL = "http://localhost:8000/reservation";

// Fonction asynchrone permettant de récupérer le json correspondant à chaque date de l'API
export async function restaurantsJson() {
    return fetch(restaurantsURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
}

//Fonction pour envoyer une réservation à la BD
export async function reserverTable(idRestaurant, nbPers, time) {
    return fetch(reservationURL+`?id=${idRestaurant}&date=${time}&pers=${nbPers}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
}
