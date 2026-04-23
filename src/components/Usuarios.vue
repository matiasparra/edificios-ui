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
import { api } from "../services/api";

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
        const res = await api.get("/auth/users");
        this.users = res.data;

      } catch (e) {
        this.error = "Error cargando usuarios";
      }
    },

    async updateRole(user) {
      try {
        await api.put(`/auth/user/${user.id}/role`, {
          role: user.role
        });

        alert("Rol actualizado");

      } catch (e) {
        this.error = "Error actualizando rol";
      }
    },

    async deleteUser(id) {
      if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

      try {
        await api.delete(`/auth/user/${id}`);
        this.loadUsers();

      } catch (e) {
        this.error = "Error eliminando usuario";
      }
    },

    async createUser() {
      try {
        await api.post("/auth/register", this.newUser);

        alert("Usuario creado");

        this.newUser = {
          email: "",
          password: "",
          role: "User"
        };

        this.loadUsers();

      } catch (e) {
        this.error = "Error creando usuario";
      }
    }
  },

  mounted() {
    this.loadUsers();
  }
};
</script>