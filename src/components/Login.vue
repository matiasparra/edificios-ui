<template>
  <div>
    <h2>Login</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Ingresar</button>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import { api } from "../services/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },

  methods: {
    async login() {
      this.error = null;

      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password
        });

        const data = res.data;

        // 🔐 guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔁 redirigir al home
        this.$router.push("/");

      } catch (e) {
        this.error = "Credenciales inválidas";
      }
    }
  }
};
</script>