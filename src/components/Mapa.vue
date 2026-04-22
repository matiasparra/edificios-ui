<template>
  <div ref="map" style="height:400px; width:100%;"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  props: ["lat", "lng"],

  data() {
    return {
      map: null,
      marker: null
    };
  },

  mounted() {
    this.initMap();
  },

  watch: {
    lat() {
      this.updateMap();
    },
    lng() {
      this.updateMap();
    }
  },

  methods: {
    initMap() {
      this.map = L.map(this.$refs.map).setView(
        [this.lat || -34.6037, this.lng || -58.3816],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(this.map);

      this.marker = L.marker(
        [this.lat || -34.6037, this.lng || -58.3816],
        { draggable: true }
      ).addTo(this.map);

      // 📍 click en mapa
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.marker.setLatLng([lat, lng]);

        this.$emit("update-coords", { lat, lng });
      });

      // 🔥 mover marker
      this.marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();

        this.$emit("update-coords", { lat, lng });
      });
    },

    updateMap() {
      if (!this.map || !this.marker) return;

      const lat = this.lat || -34.6037;
      const lng = this.lng || -58.3816;

      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], 15);
    }
  }
};
</script>