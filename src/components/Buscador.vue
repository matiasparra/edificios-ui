<template>
  <div>
    <button @click="logout" style="float:right">Salir</button>

    <h2>🔍 Buscar edificio</h2>

    <!-- 🔍 input + botón -->
    <input 
      v-model="busqueda" 
      placeholder="Buscar por ID o nombre..."
      @keyup.enter="buscar"
    />
    <button @click="buscar">Buscar</button>

    <!-- 📋 resultados -->
    <div 
      v-if="resultados.length" 
      style="border:1px solid #ccc; max-height:150px; overflow:auto; margin-top:5px;"
    >
      <div 
        v-for="e in resultados" 
        :key="e.id"
        @click="seleccionarEdificio(e)"
        style="padding:5px; cursor:pointer;"
      >
        {{ e.nombre }} (ID: {{ e.id }})
      </div>
    </div>

    <p v-if="error" style="color:red">{{ error }}</p>

    <!-- 📦 detalle -->
    <div v-if="edificio">
      <h3>{{ edificio.nombre }}</h3>
      <p>{{ edificio.direccion }}</p>

      <p>
        Lat original: {{ edificio.lat }} | Lng original: {{ edificio.lng }}
      </p>

      <!-- 🗺️ mapa -->
      <Mapa 
        :lat="nuevaLat" 
        :lng="nuevaLng"
        @update-coords="actualizarCoords"
      />

      <p>
        Nueva Lat: {{ nuevaLat }} | Nueva Lng: {{ nuevaLng }}
      </p>

      <button @click="guardar">Guardar coordenadas</button>
    </div>
  </div>
</template>

<script>
import Mapa from "./Mapa.vue";
import { api } from "../services/api";

export default {
  components: { Mapa },

  data() {
    return {
      busqueda: "",
      resultados: [],
      edificio: null,
      error: null,
      nuevaLat: null,
      nuevaLng: null
    };
  },

  methods: {
    async buscar() {
      this.error = null;
      this.resultados = [];
      this.edificio = null;

      if (!this.busqueda) {
        this.error = "Ingresá un valor para buscar";
        return;
      }

      try {
        const res = await api.get("/edificio", {
          params: {
            search: this.busqueda
          }
        });

        this.resultados = res.data;

        if (!this.resultados.length) {
          this.error = "No se encontraron resultados";
        }

      } catch (e) {
        this.error = "Error buscando edificios";
      }
    },

    seleccionarEdificio(e) {
      this.edificio = e;
      this.resultados = [];

      this.nuevaLat = e.lat;
      this.nuevaLng = e.lng;
    },

    actualizarCoords(coords) {
      this.nuevaLat = coords.lat;
      this.nuevaLng = coords.lng;
    },

    async guardar() {
      this.error = null;

      try {
        const res = await api.put(
          `/edificio/${this.edificio.id}/coordenadas`,
          {
            lat: this.nuevaLat,
            lng: this.nuevaLng
          }
        );

        this.edificio.lat = res.data.lat;
        this.edificio.lng = res.data.lng;

        alert("Coordenadas guardadas 🔥");

      } catch (e) {
        this.error = "Error guardando coordenadas";
      }
    },

    logout() {
      if (confirm("¿Seguro que querés salir?")) {
        localStorage.clear();
        this.$router.push("/login");
      }
    }
  }
};
</script>