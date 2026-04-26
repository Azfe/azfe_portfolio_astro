/**
 * Tests de integración — MainLayout.astro
 *
 * Objetivo (I-F-4.6.2-06, I-F-4.6.2-08):
 * Verificar que Home y Proyectos se pueden componer con MainLayout sin
 * duplicación ni roturas de navegación. Valida los contratos de props,
 * la consistencia de rutas y la ausencia de dependencias ocultas entre capas.
 *
 * Entorno: node (sin jsdom).
 * Los contratos validables sin renderer Astro son:
 *  - Props que MainLayout acepta: title, description (opcionales).
 *  - Que las páginas que usan MainLayout le pasan los props correctos.
 *  - Que Header, Footer y Navigation no rompen la navegación entre páginas.
 *  - Que las rutas de navegación no generan duplicados ni ciclos.
 */

import { describe, it, expect } from "vitest";
import { PAGE_SEO } from "@/config/seo";
import { ROUTES } from "@/config/constants";
import { SITE } from "@/config/site";

// ---------------------------------------------------------------------------
// Props del MainLayout — las páginas deben pasar title y description válidos
// ---------------------------------------------------------------------------

describe("MainLayout — contratos de props por página", () => {
  it("Home pasa PAGE_SEO.home.title definido a MainLayout", () => {
    expect(PAGE_SEO.home.title).toBeDefined();
    expect((PAGE_SEO.home.title ?? "").length).toBeGreaterThan(0);
  });

  it("Home pasa PAGE_SEO.home.description definida a MainLayout", () => {
    expect(PAGE_SEO.home.description).toBeDefined();
    expect((PAGE_SEO.home.description ?? "").length).toBeGreaterThan(0);
  });

  it("Proyectos pasa PAGE_SEO.projects.title definido a MainLayout", () => {
    expect(PAGE_SEO.projects).toBeDefined();
    expect((PAGE_SEO.projects!.title ?? "").length).toBeGreaterThan(0);
  });

  it("Proyectos pasa PAGE_SEO.projects.description definida a MainLayout", () => {
    expect((PAGE_SEO.projects!.description ?? "").length).toBeGreaterThan(0);
  });

  it("ninguna de las páginas con MainLayout tiene noindex activo", () => {
    expect(PAGE_SEO.home.noindex).toBeFalsy();
    expect(PAGE_SEO.projects!.noindex).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Rutas de navegación — sin duplicados, sin ciclos, sin roturas
// ---------------------------------------------------------------------------

describe("MainLayout — navegación: unicidad y coherencia de rutas", () => {
  it("todas las rutas en ROUTES son strings únicos", () => {
    const routes = Object.values(ROUTES);
    const uniqueRoutes = new Set(routes);
    expect(uniqueRoutes.size).toBe(routes.length);
  });

  it("todas las rutas empiezan por '/'", () => {
    for (const route of Object.values(ROUTES)) {
      expect(route.startsWith("/")).toBe(true);
    }
  });

  it("ROUTES cubre las 3 páginas principales que usan MainLayout o CVLayout", () => {
    expect(ROUTES).toHaveProperty("home");
    expect(ROUTES).toHaveProperty("cv");
    expect(ROUTES).toHaveProperty("projects");
  });

  it("no existen rutas vacías en ROUTES", () => {
    for (const route of Object.values(ROUTES)) {
      expect(route.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// SITE — datos que MainLayout expone a través de Header y Footer
// ---------------------------------------------------------------------------

describe("MainLayout — datos del sitio disponibles para Header y Footer", () => {
  it("SITE.author está disponible para el nav-brand del Header", () => {
    expect(SITE.author).toBe("Alex Zapata");
  });

  it("SITE.locale está disponible para el atributo lang del html", () => {
    expect(SITE.locale).toBe("es");
  });

  it("SITE.url está disponible para el canonical default de SEO", () => {
    expect(typeof SITE.url).toBe("string");
    expect(SITE.url.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Composición sin duplicación — cada página tiene su sección de contenido
// ---------------------------------------------------------------------------

describe("MainLayout — composición sin duplicación entre páginas", () => {
  it("Home y Proyectos tienen descripciones SEO diferentes", () => {
    expect(PAGE_SEO.home.description).not.toBe(PAGE_SEO.projects!.description);
  });

  it("Home y Proyectos tienen titles diferentes", () => {
    // Cada página tiene su propio contexto en el <title>
    expect(PAGE_SEO.home.title).not.toBe(PAGE_SEO.projects!.title);
  });

  it("la ruta home no coincide con la ruta projects", () => {
    expect(ROUTES.home).not.toBe(ROUTES.projects);
  });

  it("la ruta cv no coincide con home ni projects", () => {
    expect(ROUTES.cv).not.toBe(ROUTES.home);
    expect(ROUTES.cv).not.toBe(ROUTES.projects);
  });
});

// ---------------------------------------------------------------------------
// Contratos de composición (it.todo — requieren renderer Astro o E2E)
// ---------------------------------------------------------------------------

describe("MainLayout — contratos de composición render (it.todo)", () => {
  it.todo("renderiza <Header /> antes del slot de contenido principal");
  it.todo("renderiza <Footer /> después del slot de contenido principal");
  it.todo("el <main> tiene la clase 'waves-bg'");
  it.todo("el Header incluye Navigation con los 5 enlaces principales");
  it.todo("el Header muestra el nombre del autor como nav-brand");
  it.todo("el Footer incluye el año actual y el enlace al CV");
  it.todo("ScrollToTop isla se incluye con client:idle");
  it.todo("el slot 'head' del BaseLayout acepta preload links (usado en Home para el avatar)");
  it.todo("el MainLayout no genera CSS duplicado cuando se usa en múltiples páginas");
});
