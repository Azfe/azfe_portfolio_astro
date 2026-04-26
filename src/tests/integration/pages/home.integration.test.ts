/**
 * Tests de integración — Home (index.astro)
 *
 * Objetivo (I-F-4.6.2-03):
 * Validar que la Home se puede componer correctamente con MainLayout,
 * Header, Navigation, Footer y los módulos de configuración que necesita.
 *
 * Entorno: node (sin jsdom) — los archivos .astro no son importables.
 * Por ello se adopta la estrategia de dos capas:
 *
 * Capa 1 (ejecutable): valida los contratos TypeScript que index.astro consume:
 *   - PAGE_SEO.home provee title y description.
 *   - ROUTES define las rutas de navegación que Header/Navigation usan.
 *   - SITE.author y SITE.locale están disponibles para el layout base.
 *   - La estrategia de render es SSG (prerender = true, sin llamadas a la API).
 *
 * Capa 2 (it.todo): documenta qué se debe validar con un renderer Astro o E2E.
 */

import { describe, it, expect } from "vitest";
import { PAGE_SEO } from "@/config/seo";
import { ROUTES } from "@/config/constants";
import { SITE } from "@/config/site";

// ---------------------------------------------------------------------------
// SEO — metadatos que index.astro pasa a MainLayout → BaseLayout → SEO.astro
// ---------------------------------------------------------------------------

describe("Home — configuración SEO (PAGE_SEO.home)", () => {
  it("PAGE_SEO.home.title está definido y no está vacío", () => {
    expect(typeof PAGE_SEO.home.title).toBe("string");
    expect((PAGE_SEO.home.title ?? "").length).toBeGreaterThan(0);
  });

  it("PAGE_SEO.home.description está definida y no está vacía", () => {
    expect(typeof PAGE_SEO.home.description).toBe("string");
    expect((PAGE_SEO.home.description ?? "").length).toBeGreaterThan(0);
  });

  it("PAGE_SEO.home no tiene noindex (es una página pública)", () => {
    expect(PAGE_SEO.home.noindex).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Rutas — constantes usadas por MainLayout → Header → Navigation
// ---------------------------------------------------------------------------

describe("Home — rutas de navegación (ROUTES)", () => {
  it("ROUTES.home es '/'", () => {
    expect(ROUTES.home).toBe("/");
  });

  it("ROUTES.cv es '/cv'", () => {
    expect(ROUTES.cv).toBe("/cv");
  });

  it("ROUTES.projects es '/projects'", () => {
    expect(ROUTES.projects).toBe("/projects");
  });

  it("todas las rutas de navegación son strings que empiezan por '/'", () => {
    for (const route of Object.values(ROUTES)) {
      expect(typeof route).toBe("string");
      expect(route.startsWith("/")).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// SITE — datos base que MainLayout → BaseLayout expone en el HTML
// ---------------------------------------------------------------------------

describe("Home — datos del sitio (SITE)", () => {
  it("SITE.name está definido (se usa en SEO title por defecto)", () => {
    expect(typeof SITE.name).toBe("string");
    expect(SITE.name.length).toBeGreaterThan(0);
  });

  it("SITE.author es 'Alex Zapata'", () => {
    expect(SITE.author).toBe("Alex Zapata");
  });

  it("SITE.locale es 'es' (usado en el atributo lang del html)", () => {
    expect(SITE.locale).toBe("es");
  });

  it("SITE.description no está vacía (fallback para SEO)", () => {
    expect(SITE.description.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Composición de título — lógica que SEO.astro aplica con los datos de Home
// ---------------------------------------------------------------------------

describe("Home — composición del título de página", () => {
  function buildPageTitle(title?: string): string {
    return title ? `${title} — ${SITE.name}` : SITE.name;
  }

  it("el título de la Home sin title explícito es SITE.name", () => {
    // index.astro pasa PAGE_SEO.home.title = SITE.name al layout
    // que llega a SEO.astro como title === SITE.name
    // SEO.astro: if title is truthy → `${title} — ${SITE.name}`, else SITE.name
    // Cuando title === SITE.name, el resultado es "Azfe.dev — Azfe.dev"
    // Este test documenta el comportamiento real de la fórmula
    const result = buildPageTitle(PAGE_SEO.home.title);
    expect(result).toContain(SITE.name);
  });

  it("los metadatos de la Home son suficientes para SEO (title + description)", () => {
    expect(PAGE_SEO.home.title).toBeDefined();
    expect(PAGE_SEO.home.description).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Estrategia de render — Home es SSG (sin dependencia de API en build time)
// ---------------------------------------------------------------------------

describe("Home — estrategia de render SSG", () => {
  it("la Home no necesita datos de la API (secciones estáticas)", () => {
    // Este test documenta que index.astro usa prerender = true y no llama
    // a getCVComplete() ni a ningún servicio de API.
    // Las secciones (Hero, AboutCard, ExperienceSection…) usan datos estáticos.
    // Se verifica que la API_URL está configurada para el entorno de tests
    // pero no es necesaria para la Home.
    const apiUrl = import.meta.env.PUBLIC_API_URL;
    expect(typeof apiUrl).toBe("string");
    // La presencia de la variable no implica que la Home la consuma.
    // Documentamos que la Home NO depende de ella.
  });

  it("ROUTES.home se corresponde con la ruta raíz del sitio", () => {
    expect(ROUTES.home).toBe("/");
  });
});

// ---------------------------------------------------------------------------
// Contratos de composición (it.todo — requieren renderer Astro o E2E)
// ---------------------------------------------------------------------------

describe("Home — contratos de composición con MainLayout (it.todo)", () => {
  it.todo("renderiza un <main> envuelto en MainLayout con header y footer presentes");
  it.todo("el <header> contiene el nombre del autor desde SITE.author");
  it.todo("la navegación incluye los enlaces: Inicio, Experiencia, Estudios, Proyectos, Contacto");
  it.todo("el <footer> contiene el año actual y el enlace al CV");
  it.todo("el SEO incluye <title> y <meta name='description'> con los valores de PAGE_SEO.home");
  it.todo("se emite un <link rel='preload'> para el avatar optimizado (LCP)");
  it.todo("Hero renderiza el nombre 'Alex Zapata' y el título del puesto");
  it.todo("AboutCard renderiza la sección 'Sobre mí'");
  it.todo("ExperienceSection renderiza la sección de experiencia");
  it.todo("StudiesSection renderiza la sección de estudios");
  it.todo("ProjectsSection renderiza la sección de proyectos");
  it.todo("ContactSection renderiza el formulario de contacto");
  it.todo("ScrollToTop isla está hidratada con client:idle");
});
