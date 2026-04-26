/**
 * Tests para SEO.astro y su capa de configuración (seo.ts / site.ts).
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest. Sin embargo, la lógica de composición del título
 * (`${title} — ${SITE.name}`) y los valores por defecto de SEO_DEFAULTS
 * residen en módulos TS puros que sí son importables y testeables.
 *
 * Qué se cubre:
 *  - Contrato de SEOProps (title, description, canonical, noindex).
 *  - Valores de SEO_DEFAULTS.
 *  - La fórmula de composición de título que SEO.astro aplica.
 *  - Los metadatos de PAGE_SEO para las páginas conocidas.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (<title>, <meta>, og:*) — requiere renderizado Astro.
 */

import { describe, it, expect } from "vitest";
import { SEO_DEFAULTS, PAGE_SEO } from "@/config/seo";
import { SITE } from "@/config/site";

// ---------------------------------------------------------------------------
// SITE — valores base
// ---------------------------------------------------------------------------

describe("SITE — constantes del sitio", () => {
  it("SITE.author es 'Alex Zapata'", () => {
    expect(SITE.author).toBe("Alex Zapata");
  });

  it("SITE.locale es 'es'", () => {
    expect(SITE.locale).toBe("es");
  });

  it("SITE.description no está vacío", () => {
    expect(typeof SITE.description).toBe("string");
    expect(SITE.description.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// SEO_DEFAULTS
// ---------------------------------------------------------------------------

describe("SEO_DEFAULTS — valores por defecto", () => {
  it("description no está vacío", () => {
    expect(typeof SEO_DEFAULTS.description).toBe("string");
    expect(SEO_DEFAULTS.description!.length).toBeGreaterThan(0);
  });

  it("noindex es false por defecto", () => {
    expect(SEO_DEFAULTS.noindex).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Lógica de composición del título (refleja lo que hace SEO.astro)
// ---------------------------------------------------------------------------

describe("SEO.astro — lógica de composición del título", () => {
  function buildPageTitle(title?: string): string {
    return title ? `${title} — ${SITE.name}` : SITE.name;
  }

  it("sin title el pageTitle es SITE.name", () => {
    expect(buildPageTitle()).toBe(SITE.name);
  });

  it("con title el pageTitle es 'title — SITE.name'", () => {
    expect(buildPageTitle("CV")).toBe(`CV — ${SITE.name}`);
  });

  it("con title vacío el pageTitle es SITE.name", () => {
    expect(buildPageTitle("")).toBe(SITE.name);
  });
});

// ---------------------------------------------------------------------------
// PAGE_SEO — metadatos por página
// ---------------------------------------------------------------------------

describe("PAGE_SEO — metadatos de páginas conocidas", () => {
  it("'cv' tiene un title definido", () => {
    expect(typeof PAGE_SEO.cv.title).toBe("string");
    expect(PAGE_SEO.cv.title!.length).toBeGreaterThan(0);
  });

  it("'notFound' tiene noindex: true", () => {
    expect(PAGE_SEO.notFound.noindex).toBe(true);
  });

  it("'home' tiene description definida", () => {
    expect(typeof PAGE_SEO.home.description).toBe("string");
    expect(PAGE_SEO.home.description!.length).toBeGreaterThan(0);
  });
});
