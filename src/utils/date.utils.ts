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

/**
 * Convierte un número de meses a un formato legible en español.
 * Omite la parte con valor cero.
 *
 * Ejemplos:
 *   14 → "1 año 2 meses"
 *   12 → "1 año"
 *    3 → "3 meses"
 *    1 → "1 mes"
 *    0 → "menos de 1 mes"
 */
export function formatDuration(months: number): string {
  if (months <= 0) return "menos de 1 mes";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const yearsPart = years > 0 ? `${years} ${years === 1 ? "año" : "años"}` : "";
  const monthsPart =
    remainingMonths > 0 ? `${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}` : "";

  return [yearsPart, monthsPart].filter(Boolean).join(" ");
}
