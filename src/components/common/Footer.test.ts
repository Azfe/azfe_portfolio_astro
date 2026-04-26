/**
 * Tests para Footer.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (footer, links, año dinámico) — requiere Astro.
 *  - La integración con SITE.author — requiere renderizado Astro.
 */

import { describe, it } from "vitest";

describe("Footer.astro — contrato de estructura", () => {
  it.todo("renderiza el nombre del autor desde SITE.author");
  it.todo("incluye el año actual generado en build time");
  it.todo("incluye un enlace de email");
  it.todo("incluye un enlace al CV (/cv)");
  it.todo("incluye un enlace a GitHub con rel='noopener noreferrer'");
});
