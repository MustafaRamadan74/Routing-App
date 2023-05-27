let map = L.map("map").setView([30.113493, 31.246196], 16.5);

let osmMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    // minZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let imageryMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    // minZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

let basemaps = {
    "OSM": osmMap,
    "World Imagery": imageryMap,
};

const Building = L.geoJSON(Buildings, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.B_Name) {
            layer.bindPopup(feature.properties.B_Name)
        }
    },
    style: {
        color: "#FE9E0F",
        weight: 1,
        fill: true,
        fillColor: "#FDFE0F",
        fillOpacity: 0.8,

    }
}).addTo(map);

const Farm = L.geoJSON(Farms, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.B_Name) {
            layer.bindPopup(feature.properties.B_Name)
        }
    },
    style: {
        color: "#40B307",
        weight: 1,
        fill: true,
        fillColor: "#00B333",
        fillOpacity: 0.8,
    }
}).addTo(map);


const GreenHouse = L.geoJSON(GreenHouses, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.B_Name) {
            layer.bindPopup(feature.properties.B_Name)
        }
    },
    style: {
        color: "#02B3AD",
        weight: 1,
        fill: true,
        fillColor: "#36FFF8",
        fillOpacity: 0.8,
    }
}).addTo(map);

const PlayGround = L.geoJSON(PlayGrounds, {
    style: {
        color: "#02B3AD",
        weight: 0.5,
        fill: true,
        fillColor: "#36FFF8",
        fillOpacity: 0.8,
    }
}).addTo(map);
const WaterFountain = L.geoJSON(WaterFountains, {
    style: {
        color: "#02B3AD",
        weight: 1,
        fill: true,
        fillColor: "#36FFF8",
        fillOpacity: 0.8,
    }
}).addTo(map);

const GreenArea = L.geoJSON(GreenAreas, {
    style: {
        color: "#40B307",
        weight: 1,
        fill: true,
        fillColor: "#62FF14",
        fillOpacity: 0.8,
    }
}).addTo(map);

const Wall = L.geoJSON(Walls, {
    style: {
        color: "#B30000",
        weight: 2,
    }
}).addTo(map);

let searchLayers = L.layerGroup([Building, Farm, GreenHouse, PlayGround]);

let overlay = {
    "المباني": Building,
    "المزارع": Farm,
    "مناطق خضراء": GreenArea,
    "الصوب": GreenHouse,
    "الملاعب": PlayGround,
}

L.control.layers(basemaps, overlay).addTo(map);

let searchControl = new L.Control.Search({
    layer: searchLayers,
    propertyName: "B_Name",
    zoom: 17,
    marker: {},
});

let Slat, Slng, routing;
searchControl.on('search:locationfound', function (e) {
    Slat = e.latlng.lat;
    Slng = e.latlng.lng;

    L.Routing.control({
        waypoints: [
            L.latLng(Curlat, Curlng),
            L.latLng(Slat, Slng)
        ],
        showAlternatives: false,
        router: L.Routing.graphHopper('8b4651d3-fd4a-4730-8d67-bd8e983be6b5', {
            urlParameters: {
                vehicle: 'foot'
            }
        })
    }).addTo(map);

});

map.addControl(searchControl);

setInterval(() => {
    navigator.geolocation.getCurrentPosition(getPosition);
}, 2000);

let CurMarker;
let Curlat, Curlng;
function getPosition(position) {
    Curlat = position.coords.latitude;
    Curlng = position.coords.longitude;

    if (CurMarker) {
        map.removeLayer(CurMarker)
    }
    CurMarker = L.marker([Curlat, Curlng]).addTo(map);
};
