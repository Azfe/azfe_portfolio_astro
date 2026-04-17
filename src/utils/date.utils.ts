/**
 * Utilidades de fecha — complementa formatters.ts con helpers de bajo nivel.
 */

/**
 * Calcula los años transcurridos entre una fecha de inicio y hoy (o hasta end).
 * Útil para mostrar años de experiencia.
 */
export function yearsSince(startDate: string, endDate?: string | null): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < start.getDate())) {
    return diff - 1;
  }
  return diff;
}

/**
 * Devuelve true si la fecha ISO dada ya ha pasado respecto a hoy.
 */
export function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/**
 * Formatea una fecha ISO a "YYYY" (solo año).
 */
export function formatYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

/**
 * Formatea una fecha ISO a "mes YYYY" en español (ej: "ene 2023").
 */
export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
}
