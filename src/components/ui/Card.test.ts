/**
 * Tests para Card.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (div, clases CSS, slot) — requiere renderizado Astro.
 */

import { describe, it } from "vitest";

describe("Card.astro — contrato de props", () => {
  it.todo("renderiza un <div> con las clases de superficie (rounded, border, bg, shadow)");
  it.todo("prop class adicional se concatena a las clases base");
  it.todo("slot proyecta el contenido interior de la card");
});
