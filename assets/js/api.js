// Importamos la URL desde el config
import { baseURL } from "./config.js";

// La clave es la plabra Async
// Convierte la funcion en una asincrona
export async function callAPI(path, options = {}) {
  const url = `${baseURL}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}