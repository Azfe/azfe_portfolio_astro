/**
 * Tests para Spinner.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (<span role="status">, aria-label, style) — requiere Astro.
 *  - Los valores por defecto de size y label — requiere Astro.
 */

import { describe, it } from "vitest";

describe("Spinner.astro — contrato de props", () => {
  it.todo("renderiza un <span> con role='status'");
  it.todo("aria-label por defecto es 'Cargando...'");
  it.todo("prop label personaliza el aria-label");
  it.todo("size por defecto es '20px' y se aplica en el style inline");
  it.todo("prop class adicional se añade al <span>");
});
