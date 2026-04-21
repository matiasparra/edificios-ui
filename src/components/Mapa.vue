<template>
  <div id="map" style="height: 300px;"></div>
</template>

<script>
import L from "leaflet";

export default {
  props: ["lat", "lng"],
  emits: ["update-coords"],
  mounted() {
    this.map = L.map("map").setView([this.lat, this.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(this.map);

    this.marker = L.marker([this.lat, this.lng], {
      draggable: true
    }).addTo(this.map);

    // 🖱️ click en el mapa
    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.marker.setLatLng([lat, lng]);
      this.$emit("update-coords", { lat, lng });
    });

    // 🖱️ mover marker
    this.marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      this.$emit("update-coords", { lat, lng });
    });
  }
};
</script>