const socket = io();

//Check if the browser support geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      //It send the Lat and Long
      socket.emit("send-location", { latitude, longitude });
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

//From Leafet
//L: This is the global namespace for Leaflet.js, so the L object contains all Leaflet's functionalities, such as creating maps, layers, markers, etc.
//[] for longitude and latitude ,10 this for zoom
const map = L.map("map").setView([0, 0], 15);

//To see the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Saswat house",
}).addTo(map);

const markers = {};
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
