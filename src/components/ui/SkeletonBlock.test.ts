/**
 * Tests para SkeletonBlock.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (<span>, style inline, aria-hidden) — requiere Astro.
 *  - Los valores por defecto de width/height/radius — requiere Astro.
 */

import { describe, it } from "vitest";

describe("SkeletonBlock.astro — contrato de props", () => {
  it.todo("renderiza un <span> con aria-hidden='true'");
  it.todo("width por defecto es '100%'");
  it.todo("height por defecto es '14px'");
  it.todo("radius por defecto es '6px'");
  it.todo("width, height y radius pasados se aplican en el style inline");
  it.todo("prop class adicional se añade al <span>");
});
