const restaurantsURL = "http://localhost:8000/restaurant";

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
