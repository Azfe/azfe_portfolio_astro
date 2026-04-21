/**
 * base.service.ts
 *
 * Cliente HTTP base del frontend. Centraliza:
 *  - La URL base del backend (PUBLIC_API_URL)
 *  - Headers comunes (Content-Type: application/json)
 *  - Parsing uniforme de respuestas (ApiSuccess<T> → T)
 *  - Tratamiento genérico de errores HTTP y de red
 *  - Puntos de extensión para cabeceras adicionales e interceptores equivalentes
 *
 * Compatible con SSR (Astro `prerender = false`) y SSG:
 * `fetch` es global en Node ≥ 18 y en el navegador, por lo que este módulo
 * funciona en ambos entornos sin dependencias externas.
 *
 * Uso básico:
 *   import { apiFetch } from "@/services/api/base.service";
 *   const cv = await apiFetch<CompleteCV>("/cv");
 *   const msg = await apiFetch<ContactMessage>("/contact-messages", { method: "POST", body: JSON.stringify(data) });
 *
 * Uso con helpers de método:
 *   import { apiGet, apiPost } from "@/services/api/base.service";
 *   const cv   = await apiGet<CompleteCV>("/cv");
 *   const sent = await apiPost<ContactMessage>("/contact-messages", { name: "…", email: "…", message: "…" });
 */

import type { ApiResponse } from "@/types/api.types";
import { API_URL } from "@/config/constants";

// ---------------------------------------------------------------------------
// Error tipado
// ---------------------------------------------------------------------------

/**
 * Error lanzado por el cliente HTTP base.
 * Distingue errores de red (code = "NETWORK_ERROR") de errores HTTP (status ≥ 400).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Puntos de extensión (equivalentes a interceptores)
// ---------------------------------------------------------------------------

/**
 * Callback invocado justo antes de cada petición.
 * Permite añadir cabeceras dinámicas (ej. tokens de auth futuros) o logging.
 *
 * @example
 *   import { onBeforeRequest } from "@/services/api/base.service";
 *   onBeforeRequest((url, init) => {
 *     init.headers = { ...init.headers, "X-Request-Id": crypto.randomUUID() };
 *   });
 */
type BeforeRequestHook = (url: string, init: RequestInit) => void;

/**
 * Callback invocado justo después de recibir una respuesta exitosa (res.ok).
 * Útil para logging o métricas sin modificar el flujo principal.
 */
type AfterResponseHook = (url: string, response: Response) => void;

const beforeRequestHooks: BeforeRequestHook[] = [];
const afterResponseHooks: AfterResponseHook[] = [];

/** Registra un hook que se ejecuta antes de cada petición. */
export function onBeforeRequest(hook: BeforeRequestHook): void {
  beforeRequestHooks.push(hook);
}

/** Registra un hook que se ejecuta después de cada respuesta exitosa. */
export function onAfterResponse(hook: AfterResponseHook): void {
  afterResponseHooks.push(hook);
}

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Wrapper central sobre `fetch`. Todos los servicios del frontend deben
 * utilizarlo en lugar de llamar a `fetch` directamente.
 *
 * - Prepende automáticamente API_URL al path recibido.
 * - Añade `Content-Type: application/json` como cabecera por defecto.
 * - Parsea respuestas del backend con forma `{ success, data }`.
 * - Lanza `ApiError` en cualquier error HTTP o de red.
 *
 * @param path  Ruta relativa al endpoint, ej. "/cv" o "/contact-messages".
 * @param init  Opciones estándar de `RequestInit` (method, body, headers, …).
 * @returns     El campo `data` de la respuesta, tipado como `T`.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;

  // Mezclar headers por defecto con los del caller
  const mergedInit: RequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    },
  };

  // Ejecutar hooks "antes"
  for (const hook of beforeRequestHooks) {
    hook(url, mergedInit);
  }

  let res: Response;
  try {
    res = await fetch(url, mergedInit);
  } catch {
    // Error de red: backend no disponible, ECONNREFUSED, timeout, etc.
    throw new ApiError(
      503,
      `No se pudo conectar al backend (${url}). Verifica que el servidor esté corriendo.`,
      "NETWORK_ERROR"
    );
  }

  // Ejecutar hooks "después" solo en respuestas exitosas
  if (res.ok) {
    for (const hook of afterResponseHooks) {
      hook(url, res.clone());
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    let code: string | undefined;
    try {
      const body: ApiResponse<never> = await res.json();
      if (!body.success) {
        message = body.message ?? message;
        code = body.code;
      }
    } catch {
      // La respuesta no contiene JSON válido — usamos el mensaje por defecto
    }
    throw new ApiError(res.status, message, code);
  }

  const json: unknown = await res.json();

  // Normalizar: si la respuesta tiene forma { data: T }, devolvemos data; si no, la respuesta directamente
  if (json !== null && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }

  return json as T;
}

// ---------------------------------------------------------------------------
// Helpers por método HTTP
// ---------------------------------------------------------------------------

/**
 * Realiza una petición GET al endpoint indicado.
 *
 * @example
 *   const cv = await apiGet<CompleteCV>("/cv");
 */
export async function apiGet<T>(path: string, init?: Omit<RequestInit, "method">): Promise<T> {
  return apiFetch<T>(path, { ...init, method: "GET" });
}

/**
 * Realiza una petición POST serializando `body` como JSON.
 *
 * @example
 *   const msg = await apiPost<ContactMessage>("/contact-messages", formData);
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  return apiFetch<T>(path, {
    ...init,
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Realiza una petición PUT serializando `body` como JSON.
 *
 * @example
 *   const updated = await apiPut<Profile>("/profile/123", updatedData);
 */
export async function apiPut<T>(
  path: string,
  body: unknown,
  init?: Omit<RequestInit, "method" | "body">
): Promise<T> {
  return apiFetch<T>(path, {
    ...init,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Realiza una petición DELETE al endpoint indicado.
 *
 * @example
 *   await apiDelete("/messages/123");
 */
export async function apiDelete<T = void>(
  path: string,
  init?: Omit<RequestInit, "method">
): Promise<T> {
  return apiFetch<T>(path, { ...init, method: "DELETE" });
}
