/**
 * Tests para Button.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué se cubre:
 *  - Las clases CSS generadas por `variants` están documentadas como contrato.
 *  - Los valores por defecto de los props (variant="primary", type="button").
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (<a> vs <button>, slot, atributos) — requiere Astro.
 *  - La rama href (renderiza <a>) vs sin href (renderiza <button>) — requiere Astro.
 */

import { describe, it } from "vitest";

describe("Button.astro — contrato de props", () => {
  it.todo("sin href renderiza un <button> con type='button' por defecto");
  it.todo("con href renderiza un <a> con el href dado");
  it.todo("con download renderiza el atributo download en el <a>");
  it.todo("variant 'primary' aplica las clases de botón primario");
  it.todo("variant 'secondary' aplica las clases de botón secundario");
  it.todo("variant 'ghost' aplica las clases de botón ghost");
  it.todo("prop class adicional se concatena a base + variant");
  it.todo("slot se proyecta como contenido del botón");
});
