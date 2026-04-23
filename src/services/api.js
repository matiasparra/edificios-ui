import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL
});


// 🔐 REQUEST: adjuntar token + fix multipart
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ⚠️ IMPORTANTE: no forzar Content-Type en FormData
  // axios lo setea solo con boundary correcto
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});


// 🚨 RESPONSE: manejar expiración + errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔐 token inválido o expirado
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // 🚫 forbidden (rol admin, etc)
    if (error.response?.status === 403) {
      console.error("No tenés permisos para esta acción");
    }

    return Promise.reject(error);
  }
);