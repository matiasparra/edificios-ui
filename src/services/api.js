export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(url, {
    ...options,
    headers
  });

  // 🔐 manejo global de sesión
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  return res;
}