const meteoUrl = "https://www.infoclimat.fr/public-api/gfs/json?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2";

// Fonction asynchrone permettant de récupérer le json correspondant à chaque date de l'API
export async function meteoJson() {
    // Initialiser un objet pour stocker les dates et les données associées
    let map = {};

    // Attendre la réponse et extraire les données JSON
    let response = await fetch(meteoUrl);
    let json = await response.json();

    // Parcourir les clés de l'objet JSON
    for (const key in json) {
        // Vérifier si la clé est une date (format YYYY-MM-DD HH:mm:ss)
        if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(key)) {
            // Ajouter la date et les données associées à l'objet map
            map[key] = json[key];
        }
    }

    // Retourner l'objet map contenant les dates et les données associées
    return map;
}
