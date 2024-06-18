const universitesURL = "http://localhost:8000/enseignement";

// Fonction asynchrone permettant de récupérer le json correspondant à chaque date de l'API
export async function universitesJson() {
    return fetch(universitesURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
}