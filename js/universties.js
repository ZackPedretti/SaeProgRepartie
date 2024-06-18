//const universitesURL = "http://localhost:8000/universites";
const universitesURL = `https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-implantations_etablissements_d_enseignement_superieur_publics/records?limit=50&refine=localisation%3A"Alsace%20-%20Champagne-Ardenne%20-%20Lorraine>Nancy-Metz>Meurthe-et-Moselle>Nancy"`;

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