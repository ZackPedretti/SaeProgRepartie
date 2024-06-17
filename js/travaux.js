const travauxURL = "http://localhost:8000/travaux";

// Fonction asynchrone permettant de récupérer le json correspondant à chaque date de l'API
export async function travauxJson() {
    return fetch(travauxURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
}
