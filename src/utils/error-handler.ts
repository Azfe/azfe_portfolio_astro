/**
 * error-handler.ts
 *
 * Capa centralizada de manejo de errores del frontend.
 *
 * Responsabilidades:
 *  1. Normalizar cualquier valor lanzado (ApiError, Error nativo, desconocido)
 *     en un `FrontendError` tipado y consistente.
 *  2. Mapear códigos HTTP a categorías semánticas y mensajes de usuario en español.
 *  3. Proveer helpers para que las páginas SSR/SSG consuman servicios API
 *     sin dispersar try/catch con lógica duplicada.
 *
 * Lo que NO hace este módulo:
 *  - No contiene lógica de vista (no sabe de componentes ni de DOM).
 *  - No accede a la red ni a servicios externos.
 *  - No gestiona estado de aplicación (no conoce stores ni contextos React).
 *
 * Uso básico en una página SSR:
 *   import { fetchPageData } from "@/utils/error-handler";
 *   const result = await fetchPageData(() => getCVComplete());
 *   if (!result.ok) console.error(result.error.userMessage);
 *
 * Uso en un componente isla React:
 *   import { normalizeError, getErrorMessage } from "@/utils/error-handler";
 *   catch (err) {
 *     setError(normalizeError(err));
 *   }
 */

import { ApiError } from "@/services/api/base.service";
import type { FrontendError, ErrorCategory, PageDataResult } from "@/types/error.types";

// ---------------------------------------------------------------------------
// Mensajes de usuario por categoría
// ---------------------------------------------------------------------------

const CATEGORY_MESSAGES: Record<ErrorCategory, string> = {
  NETWORK:
    "El servidor no está disponible en este momento. Comprueba tu conexión e inténtalo de nuevo.",
  VALIDATION: "Los datos enviados no son válidos. Revisa el formulario e inténtalo de nuevo.",
  NOT_FOUND: "No se encontraron los datos solicitados.",
  CONFLICT: "Ya existe un recurso con esos datos. Revisa la información e inténtalo de nuevo.",
  SERVER: "Ha ocurrido un error interno en el servidor. Inténtalo de nuevo más tarde.",
  UNKNOWN: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
};

// ---------------------------------------------------------------------------
// Mapeo HTTP → categoría
// ---------------------------------------------------------------------------

/**
 * Convierte un código de estado HTTP en la categoría semántica correspondiente.
 *
 * Cubre los casos del contrato definido en la issue 4.4.5:
 *   400 / 422 → VALIDATION
 *   404       → NOT_FOUND
 *   409       → CONFLICT
 *   5xx       → SERVER
 *   otros 4xx → UNKNOWN
 */
export function httpStatusToCategory(status: number): ErrorCategory {
  if (status === 400 || status === 422) return "VALIDATION";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

// ---------------------------------------------------------------------------
// Normalización central
// ---------------------------------------------------------------------------

/**
 * Transforma cualquier valor capturado en un `catch` en un `FrontendError`
 * normalizado y tipado.
 *
 * Soporta:
 *  - `ApiError` (lanzado por `apiFetch` / `base.service.ts`)
 *  - `Error` nativo
 *  - Cualquier otro valor (string, objeto, null, …)
 *
 * @param err - El valor capturado en el bloque catch.
 * @returns   - Un `FrontendError` siempre definido, nunca lanza.
 *
 * @example
 *   try { await getCVComplete(); }
 *   catch (err) { const fe = normalizeError(err); }
 */
export function normalizeError(err: unknown): FrontendError {
  if (err instanceof ApiError) {
    // Error de red: backend no disponible
    if (err.code === "NETWORK_ERROR") {
      return {
        category: "NETWORK",
        userMessage: CATEGORY_MESSAGES.NETWORK,
        httpStatus: err.status,
        backendCode: err.code,
        retryable: true,
      };
    }

    const category = httpStatusToCategory(err.status);

    // Para errores del backend, preferimos el mensaje del backend si es legible,
    // pero caemos al mensaje por categoría si el backend no envió uno útil.
    const backendMessage = err.message && !err.message.startsWith("HTTP ") ? err.message : null;
    const userMessage = backendMessage ?? CATEGORY_MESSAGES[category];

    return {
      category,
      userMessage,
      httpStatus: err.status,
      backendCode: err.code,
      retryable: category === "SERVER" || category === "NETWORK",
    };
  }

  if (err instanceof Error) {
    return {
      category: "UNKNOWN",
      userMessage: CATEGORY_MESSAGES.UNKNOWN,
      retryable: false,
    };
  }

  return {
    category: "UNKNOWN",
    userMessage: CATEGORY_MESSAGES.UNKNOWN,
    retryable: false,
  };
}

// ---------------------------------------------------------------------------
// Helpers de presentación
// ---------------------------------------------------------------------------

/**
 * Devuelve el mensaje de error listo para mostrarse en la UI.
 *
 * Acepta tanto un `FrontendError` ya normalizado como cualquier valor
 * capturado en un catch (para uso directo sin normalizar antes).
 *
 * @example
 *   // Con FrontendError ya normalizado
 *   const msg = getErrorMessage(normalizeError(err));
 *
 *   // Directamente desde catch
 *   const msg = getErrorMessage(err);
 */
export function getErrorMessage(err: unknown): string {
  if (err !== null && typeof err === "object" && "category" in err && "userMessage" in err) {
    // Es un FrontendError ya normalizado
    return (err as FrontendError).userMessage;
  }

  return normalizeError(err).userMessage;
}

/**
 * Determina si el error es recuperable (el usuario puede reintentar).
 *
 * - `true`  → errores de red y errores de servidor (5xx), son transitorios.
 * - `false` → errores de cliente (4xx), no mejoran con reintentos.
 *
 * @example
 *   if (isRetryableError(err)) showRetryButton();
 */
export function isRetryableError(err: unknown): boolean {
  if (err !== null && typeof err === "object" && "retryable" in err) {
    // Es un FrontendError ya normalizado
    return Boolean((err as FrontendError).retryable);
  }

  return normalizeError(err).retryable;
}

// ---------------------------------------------------------------------------
// Helper para páginas SSR / SSG
// ---------------------------------------------------------------------------

/**
 * Envuelve una llamada a servicio API para uso en el frontmatter de páginas
 * Astro (SSR o SSG). Elimina la necesidad de bloques try/catch repetidos.
 *
 * Devuelve un `PageDataResult<T>`:
 *  - `{ ok: true, data: T }` en caso de éxito
 *  - `{ ok: false, error: FrontendError }` en caso de fallo
 *
 * La página decide cómo reaccionar: mostrar fallback, redirigir a 404,
 * mostrar banner de error, etc.
 *
 * @param fetcher - Función asíncrona que llama al servicio API.
 * @returns       - `PageDataResult<T>` siempre resuelto, nunca lanza.
 *
 * @example
 *   // En cv.astro (SSR)
 *   const result = await fetchPageData(() => getCVComplete());
 *   if (result.ok) {
 *     const cv = result.data;
 *   } else {
 *     const errorMsg = result.error.userMessage;
 *   }
 */
export async function fetchPageData<T>(fetcher: () => Promise<T>): Promise<PageDataResult<T>> {
  try {
    const data = await fetcher();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: normalizeError(err) };
  }
}
