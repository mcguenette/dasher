'use strict';
import { select } from './utils.js';

mapboxgl.accessToken = 'pk.eyJ1IjoibWNndWVuZXR0ZSIsImEiOiJjbHExOWUxeWcwNmwyMmlvMGY3NXF3bGc4In0.SXaq4QutArp0bqPMpmnkjg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mcguenette/clq46ofev004c01pdacot3c5t',
    center: [-97.1418535214156, 49.89382907977702],
    zoom: 9,
    pitch: 40
});

const trackButton = select('#tracking');
let userLocation;

function addMarker(coordinates) {
    // Grabbed from: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker-example
    let marker = new mapboxgl.Marker({
        color: "#860D0D",
        width: '10px',
        height: '10px',
        draggable: true
        }).setLngLat(coordinates)
        .addTo(map);
    // const el = document.createElement('div');
    // el.className = 'marker';

    // new mapboxgl.Marker(el)
    //     .setLngLat(coordinates)
    //     .addTo(map);
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

setTimeout(() => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
    } else {
        alert('Browser does not support geolocation');
    }
}, 1000);

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);

// Event listener for the tracking button
trackButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(getLocation, errorHandler, options);
    } else {
        alert('Browser does not support geolocation');
    }
});
