'use strict';

// import { onEvent, select, selectAll } from './utils.js';

mapboxgl.accessToken = 'pk.eyJ1IjoibWNndWVuZXR0ZSIsImEiOiJjbHExOWUxeWcwNmwyMmlvMGY3NXF3bGc4In0.SXaq4QutArp0bqPMpmnkjg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mcguenette/clq419vsu004101ql1zxm8bj3', // style URL
    center: [-97.1418535214156, 49.89382907977702],  // starting position [lng, lat]
    zoom: 9, // starting zoom,
    pitch: 40
});

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


function getLocation(position) {
    let { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];
    map.flyTo({center: userLocation, zoom: 14});

    addMarker(userLocation);
}

function errorHandler() {
    alert('unable to retireve your location');
}

const options = {
    enableHighAccuracy: true
};

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
} else {
    alert('borwser does not support geolocation');
}

const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'point',
                coordinates: [userLocation]
            },
            properties: {
                title: 'My Location'
            }
        },
    ]
};

// add markers to map
for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
  }

  map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );