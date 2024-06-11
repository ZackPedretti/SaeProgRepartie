//Classe représentant une station de velib avec ses attributs
export class StationVelib {
    constructor(systemName, language, systemId, address, capacity, lat, lon, stationId, stationName, bikesAvailable, docksAvailable) {
        this.systemName = systemName;
        this.language = language;
        this.systemId = systemId;
        this.address = address;
        this.capacity = capacity;
        this.lat = lat;
        this.lon = lon;
        this.stationId = stationId;
        this.stationName = stationName;
        this.bikesAvailable = bikesAvailable;
        this.docksAvailable = docksAvailable;
    }

    toString() {
        return `StationVelib {
            systemName: ${this.systemName},
            language: ${this.language},
            systemId: ${this.systemId},
            address: ${this.address},
            capacity: ${this.capacity},
            lat: ${this.lat},
            lon: ${this.lon},
            stationId: ${this.stationId},
            stationName: ${this.stationName},
            bikesAvailable: ${this.bikesAvailable},
            docksAvailable: ${this.docksAvailable}
        }`;
    }
}

const urlApi = "https://transport.data.gouv.fr/gbfs/nancy/gbfs.json";

async function getInfoLink(n) {
    try {
        const response = await fetch(urlApi);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        return data.data.fr.feeds[n].url;
    } catch (error) {
        console.error(`Erreur lors de la récupération du lien d'info : ${error}`);
        return null;
    }
}

async function getSystemInfoLink() {
    return await getInfoLink(0);
}

async function getStationInfoLink() {
    return await getInfoLink(1);
}

async function getStationStatusLink() {
    return await getInfoLink(2);
}

//Fonction de récuperation de la liste des stations de velib
export async function getAllVelibs() {
    const velibs = [];

    const systemInfoLink = await getSystemInfoLink();
    const stationInfoLink = await getStationInfoLink();
    const stationStatusLink = await getStationStatusLink();

    if (!systemInfoLink || !stationInfoLink || !stationStatusLink) {
        console.error("Impossible de récupérer tous les liens nécessaires.");
        return velibs;
    }

    try {
        const systemResponse = await fetch(systemInfoLink);
        if (!systemResponse.ok) {
            throw new Error(`Erreur HTTP ! statut : ${systemResponse.status}`);
        }
        const systemData = await systemResponse.json();
        const { name: systemName, language, system_id: systemId } = systemData.data;

        const stationInfoResponse = await fetch(stationInfoLink);
        if (!stationInfoResponse.ok) {
            throw new Error(`Erreur HTTP ! statut : ${stationInfoResponse.status}`);
        }
        const stationInfoData = await stationInfoResponse.json();

        const stationStatusResponse = await fetch(stationStatusLink);
        if (!stationStatusResponse.ok) {
            throw new Error(`Erreur HTTP ! statut : ${stationStatusResponse.status}`);
        }
        const stationStatusData = await stationStatusResponse.json();

        const stationsInfo = stationInfoData.data.stations;
        const stationsStatus = stationStatusData.data.stations;

        for (let i = 0; i < stationsInfo.length; i++) {
            const info = stationsInfo[i];
            const status = stationsStatus.find(s => s.station_id === info.station_id);

            if (status) {
                velibs.push(new StationVelib(
                    systemName, language, systemId,
                    info.address, info.capacity, info.lat, info.lon, info.station_id, info.name,
                    status.num_bikes_available, status.num_docks_available
                ));
            }
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération des données : ${error}`);
    }

    return velibs;
}