<template>
  <div>
    <h2>👑 Administración de Usuarios</h2>

    <!-- 🔍 filtro -->
    <input 
      v-model="filtro" 
      placeholder="Buscar por email..." 
      style="margin-bottom:10px;"
    />

    <p v-if="error" style="color:red">{{ error }}</p>

    <!-- 📋 lista -->
    <div 
      v-for="u in usuariosFiltrados" 
      :key="u.id" 
      style="margin-top:10px; border-bottom:1px solid #ccc; padding:5px;"
    >
      <strong>{{ u.email }}</strong> - {{ u.role }}

      <select v-model="u.role">
        <option>User</option>
        <option>Admin</option>
      </select>

      <button @click="updateRole(u)">Guardar</button>
      <button @click="deleteUser(u.id)">Eliminar</button>
    </div>

    <hr />

    <!-- ➕ crear -->
    <h3>Crear usuario</h3>

    <input v-model="newUser.email" placeholder="Email" />
    <input v-model="newUser.password" type="password" placeholder="Password" />

    <select v-model="newUser.role">
      <option>User</option>
      <option>Admin</option>
    </select>

    <button @click="createUser">Crear</button>
  </div>
</template>

<script>
import { apiFetch } from "../services/api";

export default {
  data() {
    return {
      users: [],
      filtro: "",
      error: null,
      newUser: {
        email: "",
        password: "",
        role: "User"
      }
    };
  },

  computed: {
    usuariosFiltrados() {
      if (!this.filtro) return this.users;

      return this.users.filter(u =>
        u.email.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
  },

  methods: {
    async loadUsers() {
      this.error = null;

      try {
        const res = await apiFetch("https://localhost:44365/auth/users");
        this.users = await res.json();

      } catch (e) {
        this.error = e.message;
      }
    },

    async updateRole(user) {
      try {
        await apiFetch(`https://localhost:44365/auth/user/${user.id}/role`, {
          method: "PUT",
          body: JSON.stringify({ role: user.role })
        });

        alert("Rol actualizado");

      } catch (e) {
        this.error = e.message;
      }
    },

    async deleteUser(id) {
      if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

      try {
        await apiFetch(`https://localhost:44365/auth/user/${id}`, {
          method: "DELETE"
        });

        this.loadUsers();

      } catch (e) {
        this.error = e.message;
      }
    },

    async createUser() {
      try {
        await apiFetch("https://localhost:44365/auth/register", {
          method: "POST",
          body: JSON.stringify(this.newUser)
        });

        alert("Usuario creado");

        this.newUser = {
          email: "",
          password: "",
          role: "User"
        };

        this.loadUsers();

      } catch (e) {
        this.error = e.message;
      }
    }
  },

  mounted() {
    this.loadUsers();
  }
};
</script>