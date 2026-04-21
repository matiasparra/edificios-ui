<template>
  <div>
    <h1>Gestión de Edificios</h1>

    <!-- 🔐 si NO está logueado -->
    <Login v-if="!isLogged" @login-success="onLogin" />

    <!-- ✅ si está logueado -->
    <Buscador v-else @logout="onLogout" />
  </div>
</template>

<script>
import Buscador from "./components/Buscador.vue";
import Login from "./components/Login.vue";

export default {
  components: {
    Buscador,
    Login
  },

  data() {
    return {
      token: localStorage.getItem("token")
    };
  },

  computed: {
    isLogged() {
      return !!this.token;
    }
  },

  methods: {
    onLogin(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    onLogout() {
      localStorage.removeItem("token");
      this.token = null;
    }
  }
};
</script>