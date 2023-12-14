'use strict';

mapboxgl.accessToken = 'pk.eyJ1IjoibWNndWVuZXR0ZSIsImEiOiJjbHExOWUxeWcwNmwyMmlvMGY3NXF3bGc4In0.SXaq4QutArp0bqPMpmnkjg';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mcguenette/clq46ofev004c01pdacot3c5t', // style URL
    center: [-97.1418535214156, 49.89382907977702],  // starting position [lng, lat]
    zoom: 9, // starting zoom,
    pitch: 40
});

let userLocation;

map.on('load', () => {
    map.addLayer({
        id: 'terrain-data',
        type: 'line',
        source: {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-terrain-v2'
        },
        'source-layer': 'contour'
    });
});

function addMarker(coordinates) {
    const el = document.createElement('div');
    el.className = 'marker';

    // Make a marker for the feature and add it to the map
    new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .addTo(map);
}

function getLocation(position) {
    let { latitude, longitude } = position.coords;
    userLocation = [longitude, latitude];
    map.flyTo({ center: userLocation, zoom: 14 });

    addMarker(userLocation);
}

function errorHandler() {
    alert('Unable to retrieve your location');
}

const options = {
    enableHighAccuracy: true
};

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
} else {
    alert('Browser does not support geolocation');
}

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: userLocation ? [userLocation[0], userLocation[1]] : [0, 0]
            },
            properties: {
                title: 'My Location'
            }
        },
    ]
};

// Add markers to map
for (const feature of geojson.features) {
    // create an HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);
