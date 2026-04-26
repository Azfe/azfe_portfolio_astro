/**
 * Tests para Badge.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera del runtime de
 * Astro, por lo que cualquier `import` de un .astro falla con un error de
 * sintaxis JSX.
 *
 * Estrategia aplicada:
 *  - No se importa Badge.astro en ningún test activo.
 *  - Se documenta el contrato de props mediante it.todo para que quede
 *    registrado y se pueda cubrir si en el futuro se añade un entorno de
 *    renderizado Astro (p.ej. @astrojs/test-utils).
 *
 * Qué no se cubre aquí:
 *  - El HTML generado (class:list, span, estilos inline) — requiere renderizado Astro.
 *  - El mapeo de variantes a clases CSS — requiere renderizado Astro.
 */

import { describe, it } from "vitest";

describe("Badge.astro — contrato de props", () => {
  it.todo("prop label se renderiza como texto del <span>");
  it.todo("variant 'default' aplica las clases de badge estándar");
  it.todo("variant 'outline' aplica borde sin fondo");
  it.todo("variantes c1–c6 aplican clases de color semántico distintas");
  it.todo("prop class adicional se concatena a las clases existentes");
  it.todo("variant por defecto es 'default' cuando no se pasa el prop");
});
