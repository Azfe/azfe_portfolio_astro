import { API_URL } from "./config.js";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function fetchCV() {
  let res;
  try {
    res = await fetch(`${API_URL}/cv`, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new ApiError(503, "No se pudo conectar al servidor. Mostrando datos de ejemplo.");
  }
  if (!res.ok)
    throw new ApiError(
      res.status,
      `Error del servidor (${res.status}). Mostrando datos de ejemplo.`
    );
  const json = await res.json();
  return json?.data ?? json;
}
