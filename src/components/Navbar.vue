<template>
  <div style="display:flex; justify-content:space-between; background:#eee; padding:10px;">
    
    <!-- IZQUIERDA -->
    <div style="display:flex; gap:10px;">
      <button @click="$router.push('/')">🏢 Edificios</button>

      <button @click="$router.push('/crear-edificio')">
        ➕ Crear Edificio
      </button>

      <button v-if="esAdmin" @click="$router.push('/usuarios')">
        👑 Usuarios
      </button>
    </div>

    <!-- DERECHA -->
    <div>
      <span v-if="user">
        {{ user.email }} ({{ user.role }})
      </span>

      <button @click="logout" style="margin-left:10px;">
        Salir
      </button>
    </div>

  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    esAdmin() {
      return this.user?.role === "Admin";
    }
  },

  methods: {
    logout() {
      if (confirm("¿Seguro que querés salir?")) {
        localStorage.clear();
        this.$router.push("/login");
      }
    }
  }
};
</script>