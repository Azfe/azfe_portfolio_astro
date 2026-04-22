/**
 * error.types.ts
 *
 * Tipos normalizados de error para la capa frontend.
 *
 * Principio de diseño:
 *  - `FrontendError` es la estructura unificada que circula por la capa de
 *    utilidades, servicios y páginas. Ni los componentes ni las páginas
 *    deben inspeccionar `ApiError` directamente — siempre consumen este tipo.
 *  - `ErrorCategory` clasifica el error semánticamente (para UI y logs) sin
 *    exponer detalles de transporte (códigos HTTP, stack traces).
 *  - Las categorías mapean 1:1 con los casos del backend que debe cubrir el MVP:
 *    400 → VALIDATION, 404 → NOT_FOUND, 409 → CONFLICT, 5xx → SERVER_ERROR,
 *    fallo de red → NETWORK.
 *
 * Uso típico:
 *   import type { FrontendError } from "@/types/error.types";
 *   const err: FrontendError = normalizeError(caught);
 *   if (err.category === "NOT_FOUND") { ... }
 */

// ---------------------------------------------------------------------------
// Categoría semántica de error
// ---------------------------------------------------------------------------

/**
 * Categorías de error que el frontend puede distinguir.
 *
 * - NETWORK    → Backend no disponible (ECONNREFUSED, timeout, etc.)
 * - VALIDATION → Datos enviados inválidos (HTTP 400 / 422)
 * - NOT_FOUND  → Recurso inexistente (HTTP 404)
 * - CONFLICT   → Recurso duplicado o estado inconsistente (HTTP 409)
 * - SERVER     → Error interno del backend (HTTP 5xx)
 * - UNKNOWN    → Cualquier otro error no clasificable
 */
export type ErrorCategory =
  | "NETWORK"
  | "VALIDATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER"
  | "UNKNOWN";

// ---------------------------------------------------------------------------
// Estructura normalizada de error
// ---------------------------------------------------------------------------

/**
 * Representación unificada de un error en el frontend.
 *
 * Toda la información necesaria para decidir qué mostrar en UI
 * y cómo reaccionar (retry vs. mostrar mensaje permanente) está aquí.
 */
export interface FrontendError {
  /** Clasificación semántica del error. */
  category: ErrorCategory;

  /**
   * Mensaje legible para el usuario en español.
   * Siempre presente; nunca expone detalles técnicos internos.
   */
  userMessage: string;

  /**
   * Código HTTP de la respuesta que originó el error, si aplica.
   * Ausente en errores de red puros.
   */
  httpStatus?: number;

  /**
   * Código de error opcional del backend (ej. "VALIDATION_ERROR", "NOT_FOUND").
   * Útil para logging o mensajes más específicos sin afectar la UI.
   */
  backendCode?: string;

  /**
   * Indica si el usuario puede reintentar la operación.
   * true  → fallos de red y errores 5xx (transitorios)
   * false → errores 4xx (precondición no cumplida, no mejorará con reintento)
   */
  retryable: boolean;
}

// ---------------------------------------------------------------------------
// Resultado de operación de página SSR/SSG
// ---------------------------------------------------------------------------

/**
 * Wrapper que encapsula el resultado de una llamada a servicio API
 * en el contexto de una página Astro (SSR o SSG).
 *
 * Permite devolver datos o un error normalizado sin usar try/catch
 * disperso en cada página.
 *
 * @example
 *   const result: PageDataResult<CompleteCV> = await fetchPageData(() => getCVComplete());
 *   if (result.ok) {
 *     const cv = result.data;
 *   } else {
 *     const err = result.error; // FrontendError
 *   }
 */
export type PageDataResult<T> = { ok: true; data: T } | { ok: false; error: FrontendError };
