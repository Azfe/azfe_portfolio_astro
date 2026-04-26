/**
 * Tests para SectionTitle.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (h2, p de overline, p de subtitle) — requiere Astro.
 *  - La renderización condicional de overline y subtitle — requiere Astro.
 */

import { describe, it } from "vitest";

describe("SectionTitle.astro — contrato de props", () => {
  it.todo("prop title se renderiza dentro de un <h2>");
  it.todo("overline se renderiza como <p> encima del título cuando se pasa");
  it.todo("overline no se renderiza cuando no se pasa el prop");
  it.todo("subtitle se renderiza como <p> debajo del título cuando se pasa");
  it.todo("subtitle no se renderiza cuando no se pasa el prop");
});
