<template>
  <div>
    <button @click="logout" style="float:right">Salir</button>

    <h2>Buscar edificio</h2>

    <input v-model="id" placeholder="ID edificio" />
    <button @click="buscar">Buscar</button>

    <p v-if="error" style="color:red">{{ error }}</p>

    <div v-if="edificio">
      <h3>{{ edificio.nombre }}</h3>
      <p>{{ edificio.direccion }}</p>

      <!-- coords originales -->
      <p>
        Lat original: {{ edificio.lat }} | Lng original: {{ edificio.lng }}
      </p>

      <!-- 🗺️ Mapa -->
      <Mapa 
        :lat="nuevaLat" 
        :lng="nuevaLng"
        @update-coords="actualizarCoords"
      />

      <!-- coords nuevas -->
      <p>
        Nueva Lat: {{ nuevaLat }} | Nueva Lng: {{ nuevaLng }}
      </p>

      <button @click="guardar">Guardar coordenadas</button>
    </div>
  </div>
</template>

<script>
import Mapa from "./Mapa.vue";

export default {
  components: { Mapa },

  data() {
    return {
      id: "",
      edificio: null,
      error: null,
      nuevaLat: null,
      nuevaLng: null
    };
  },

  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.logout();
        return {};
      }

      return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
    },

    async buscar() {
      this.error = null;
      this.edificio = null;

      if (!this.id) {
        this.error = "Ingresá un ID";
        return;
      }

      try {
        const res = await fetch(
          `https://localhost:44365/edificio/${this.id}`,
          {
            headers: this.getAuthHeaders()
          }
        );

        if (res.status === 401) {
          this.logout();
          return;
        }

        if (!res.ok) {
          throw new Error("No encontrado");
        }

        this.edificio = await res.json();

        this.nuevaLat = this.edificio.lat;
        this.nuevaLng = this.edificio.lng;

      } catch (e) {
        this.error = e.message;
      }
    },

    actualizarCoords(coords) {
      this.nuevaLat = coords.lat;
      this.nuevaLng = coords.lng;
    },

    async guardar() {
      this.error = null;

      try {
        const res = await fetch(
          `https://localhost:44365/edificio/${this.id}/coordenadas`,
          {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
              lat: this.nuevaLat,
              lng: this.nuevaLng
            })
          }
        );

        if (res.status === 401) {
          this.logout();
          return;
        }

        if (!res.ok) {
          throw new Error("Error al guardar coordenadas");
        }

        const data = await res.json();

        this.edificio.lat = data.lat;
        this.edificio.lng = data.lng;

        alert("Coordenadas guardadas correctamente 🔥");

      } catch (e) {
        this.error = e.message;
      }
    },

logout() {
  if (confirm("¿Seguro que querés salir?")) {
    this.$emit("logout");
  }
}
  }
};
</script>