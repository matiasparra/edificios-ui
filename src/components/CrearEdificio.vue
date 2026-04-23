<template>
  <div>
    <h2>➕ Crear Edificio</h2>

    <!-- nombre -->
    <input v-model="edificio.nombre" placeholder="Nombre" />

    <!-- 🔍 buscar direccion -->
    <input 
      v-model="busquedaDireccion" 
      placeholder="Buscar dirección..."
    />

    <!-- autocomplete -->
    <div 
      v-if="resultados.length" 
      style="border:1px solid #ccc; max-height:150px; overflow:auto; margin-bottom:10px;"
    >
      <div 
        v-for="r in resultados" 
        :key="r.place_id"
        @click="seleccionarDireccion(r)"
        style="padding:5px; cursor:pointer;"
      >
        {{ r.display_name }}
      </div>
    </div>

    <!-- coords -->
    <p>
      📍 Lat: {{ edificio.lat }} | Lng: {{ edificio.lng }}
    </p>

    <!-- mapa -->
    <Mapa
      :lat="edificio.lat || -34.6037"
      :lng="edificio.lng || -58.3816"
      @update-coords="setCoords"
    />

    <button @click="crear">Crear</button>

    <p v-if="mensaje" style="color:green">{{ mensaje }}</p>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import { api } from "../services/api";
import Mapa from "./Mapa.vue";

export default {
  components: { Mapa },

  data() {
    return {
      edificio: {
        nombre: "",
        direccion: "",
        lat: null,
        lng: null
      },
      busquedaDireccion: "",
      resultados: [],
      timeout: null,
      mensaje: null,
      error: null
    };
  },

  watch: {
    busquedaDireccion(value) {
      clearTimeout(this.timeout);

      if (!value) {
        this.resultados = [];
        return;
      }

      this.timeout = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
          );
          this.resultados = await res.json();
        } catch {
          this.resultados = [];
        }
      }, 500);
    }
  },

  methods: {
    seleccionarDireccion(lugar) {
      this.edificio.lat = parseFloat(lugar.lat);
      this.edificio.lng = parseFloat(lugar.lon);
      this.edificio.direccion = lugar.display_name;

      this.busquedaDireccion = lugar.display_name;
      this.resultados = [];
    },

    async setCoords(coords) {
      this.edificio.lat = coords.lat;
      this.edificio.lng = coords.lng;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
        );

        const data = await res.json();

        this.edificio.direccion = data.display_name;
        this.busquedaDireccion = data.display_name;

      } catch {
        console.log("Error reverse geocoding");
      }
    },

    async crear() {
      this.error = null;
      this.mensaje = null;

      try {
        await api.post("/edificio", this.edificio);

        this.mensaje = "Edificio creado correctamente 🔥";

        this.edificio = {
          nombre: "",
          direccion: "",
          lat: null,
          lng: null
        };

        this.busquedaDireccion = "";

      } catch (e) {
        this.error = e.message;
      }
    }
  }
};
</script>