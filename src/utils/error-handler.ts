import { ApiError } from "@/services/api/base.service";

/**
 * Transforma cualquier error capturado en un mensaje legible para el usuario.
 * Centraliza la lógica de manejo de errores de API en un único lugar.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "NETWORK_ERROR") {
      return "El servidor no está disponible en este momento. Inténtalo de nuevo más tarde.";
    }
    if (err.status === 404) {
      return "No se encontraron los datos solicitados.";
    }
    if (err.status === 503) {
      return "El servicio no está disponible temporalmente. Inténtalo de nuevo más tarde.";
    }
    return `Error ${err.status}: ${err.message}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Ocurrió un error inesperado.";
}

/**
 * Determina si un error es recuperable (puede reintentar el usuario)
 * o permanente (no tiene sentido reintentar).
 */
export function isRetryableError(err: unknown): boolean {
  if (err instanceof ApiError) {
    return err.status >= 500 || err.code === "NETWORK_ERROR";
  }
  return false;
}
