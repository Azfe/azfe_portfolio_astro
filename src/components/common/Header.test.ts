/**
 * Tests para Header.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (header, nav, links) — requiere renderizado Astro.
 *  - La integración con Navigation.astro y SITE/ROUTES — requiere renderizado Astro.
 */

import { describe, it } from "vitest";

describe("Header.astro — contrato de estructura", () => {
  it.todo("renderiza un <header> con posición sticky");
  it.todo("incluye el nombre del autor desde SITE.author como nav-brand");
  it.todo("incluye el enlace al CV usando ROUTES.cv");
  it.todo("incluye el componente Navigation");
  it.todo("el enlace al CV abre en target='_blank'");
});
