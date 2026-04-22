import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/Login.vue";
import Buscador from "../components/Buscador.vue";
import Usuarios from "../components/Usuarios.vue";
import CrearEdificio from "../components/CrearEdificio.vue";

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/",
    component: Buscador,
    meta: { requiresAuth: true }
  },
  {
    path: "/usuarios",
    component: Usuarios,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/crear-edificio",
    component: CrearEdificio,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔐 GUARD (protección de rutas)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 🚫 si requiere login y no hay token
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // 🚫 si requiere admin y no lo es
  if (to.meta.requiresAdmin && user?.role !== "Admin") {
    return next("/");
  }

  next();
});

export default router;