<template>
  <div class="container-fluid">
    <!-- Map Container -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import L from 'leaflet'; // Import Leaflet

// Define props to receive data from parent
const props = defineProps({
  hotels: Array,
  places: Array
});

let map = null;

onMounted(() => {
  // Initialize the map
  map = L.map('map').setView([8.9492, 125.5435], 13); // Center at Butuan

  // Add a tile layer from OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Add initial markers
  addMarkers();
});

// Watch for changes in props
watch([() => props.hotels, () => props.places], () => {
  // Remove old markers
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Re-add markers
  addMarkers();
});

// Function to add markers with custom icons
const addMarkers = () => {
  // Define hotel icon
  const hotelIcon = L.icon({
    iconUrl: '/hotels.png', // 🏨 Image path inside public/
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // Define place icon
  const placeIcon = L.icon({
    iconUrl: '/places.png', // 📍 Image path inside public/
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });

  // Add hotel markers
  props.hotels.forEach(hotel => {
    L.marker([hotel.lat, hotel.lng], { icon: hotelIcon })
      .addTo(map)
      .bindPopup(`<b>${hotel.name}</b><br>Hotel Location: ${hotel.lat}, ${hotel.lng}`);
  });

  // Add place markers
  props.places.forEach(place => {
    L.marker([place.lat, place.lng], { icon: placeIcon })
      .addTo(map)
      .bindPopup(`<b>${place.name}</b><br>Place Location: ${place.lat}, ${place.lng}`);
  });
};
</script>

<style scoped>
/* Map styling */
#map {
  width: 100%;
  height: 60vh; /* Make map bigger and better */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
