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
        const res = await fetch("https://localhost:44365/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        if (!res.ok) {
          throw new Error("Credenciales inválidas");
        }

        const data = await res.json();

        // 🔐 guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔁 redirigir al home
        this.$router.push("/");

      } catch (e) {
        this.error = e.message;
      }
    }
  }
};
</script>