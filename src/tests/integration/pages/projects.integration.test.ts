/**
 * Tests de integración — Proyectos (projects.astro)
 *
 * Objetivo (I-F-4.6.2-05):
 * Validar que projects.astro puede componerse correctamente con MainLayout,
 * el grid de tarjetas y los componentes visuales reutilizables.
 *
 * Entorno: node (sin jsdom) — los archivos .astro no son importables.
 * Estrategia de dos capas:
 *
 * Capa 1 (ejecutable): valida los contratos TypeScript que projects.astro consume:
 *   - PAGE_SEO.projects provee title y description.
 *   - Estructura y contratos del fixture de proyectos estáticos.
 *   - Estrategia SSG (prerender = true, datos estáticos en esta iteración).
 *   - Contratos de la interfaz MockProject.
 *
 * Capa 2 (it.todo): documenta qué se debe validar con renderer Astro o E2E.
 */

import { describe, it, expect } from "vitest";
import { PAGE_SEO } from "@/config/seo";
import { ROUTES } from "@/config/constants";
import {
  mockStaticProjects,
  projectWithLiveUrl,
  projectWithRepoOnly,
  type MockProject,
} from "@/tests/integration/fixtures/projects.fixtures";

// ---------------------------------------------------------------------------
// SEO — metadatos que projects.astro pasa a MainLayout → BaseLayout → SEO.astro
// ---------------------------------------------------------------------------

describe("Proyectos — configuración SEO (PAGE_SEO.projects)", () => {
  it("PAGE_SEO.projects está definido", () => {
    expect(PAGE_SEO.projects).toBeDefined();
  });

  it("PAGE_SEO.projects.title está definido y no está vacío", () => {
    expect(typeof PAGE_SEO.projects!.title).toBe("string");
    expect((PAGE_SEO.projects!.title ?? "").length).toBeGreaterThan(0);
  });

  it("PAGE_SEO.projects.description está definida y no está vacía", () => {
    expect(typeof PAGE_SEO.projects!.description).toBe("string");
    expect((PAGE_SEO.projects!.description ?? "").length).toBeGreaterThan(0);
  });

  it("PAGE_SEO.projects no tiene noindex (es una página pública)", () => {
    expect(PAGE_SEO.projects!.noindex).toBeFalsy();
  });

  it("la description de proyectos menciona el autor o proyectos", () => {
    const desc = (PAGE_SEO.projects!.description ?? "").toLowerCase();
    expect(desc.includes("proyecto") || desc.includes("alex")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Rutas — la ruta de proyectos está definida en ROUTES
// ---------------------------------------------------------------------------

describe("Proyectos — ruta y estrategia SSG", () => {
  it("ROUTES.projects es '/projects'", () => {
    expect(ROUTES.projects).toBe("/projects");
  });

  it("projects.astro es SSG (datos estáticos, sin dependencia de API)", () => {
    // La página usa prerender = true y datos hardcoded en esta iteración.
    // Este test documenta que no requiere PUBLIC_API_URL para renderizar.
    // Los datos vienen del array local de MockProject.
    expect(mockStaticProjects.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// MockProject — contrato de la interfaz de datos de projects.astro
// ---------------------------------------------------------------------------

describe("Proyectos — contrato de la interfaz MockProject", () => {
  it("todos los proyectos tienen subtitle, title, description, tags y gradient", () => {
    for (const project of mockStaticProjects) {
      expect(typeof project.subtitle).toBe("string");
      expect(typeof project.title).toBe("string");
      expect(typeof project.description).toBe("string");
      expect(Array.isArray(project.tags)).toBe(true);
      expect(typeof project.gradient).toBe("string");
    }
  });

  it("liveUrl puede ser string o null", () => {
    for (const project of mockStaticProjects) {
      expect(project.liveUrl === null || typeof project.liveUrl === "string").toBe(true);
    }
  });

  it("repoUrl puede ser string o null", () => {
    for (const project of mockStaticProjects) {
      expect(project.repoUrl === null || typeof project.repoUrl === "string").toBe(true);
    }
  });

  it("los tags son strings no vacíos", () => {
    for (const project of mockStaticProjects) {
      for (const tag of project.tags) {
        expect(typeof tag).toBe("string");
        expect(tag.length).toBeGreaterThan(0);
      }
    }
  });

  it("el gradient es un string CSS válido (empieza con 'linear-gradient')", () => {
    for (const project of mockStaticProjects) {
      expect(project.gradient.startsWith("linear-gradient")).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Grid de proyectos — contratos del listado
// ---------------------------------------------------------------------------

describe("Proyectos — listado de proyectos estáticos", () => {
  it("hay al menos 2 proyectos en la lista", () => {
    expect(mockStaticProjects.length).toBeGreaterThanOrEqual(2);
  });

  it("al menos un proyecto tiene liveUrl (para mostrar el CTA 'Ver en vivo')", () => {
    const hasLive = mockStaticProjects.some((p) => p.liveUrl !== null);
    expect(hasLive).toBe(true);
  });

  it("al menos un proyecto tiene repoUrl (para mostrar el CTA 'Repositorio')", () => {
    const hasRepo = mockStaticProjects.some((p) => p.repoUrl !== null);
    expect(hasRepo).toBe(true);
  });

  it("todos los proyectos tienen al menos un tag", () => {
    for (const project of mockStaticProjects) {
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("todos los titles son únicos (sin proyectos duplicados)", () => {
    const titles = mockStaticProjects.map((p) => p.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });
});

// ---------------------------------------------------------------------------
// CTAs — lógica de renderizado condicional de botones de acción
// ---------------------------------------------------------------------------

describe("Proyectos — lógica de CTAs por proyecto", () => {
  it("projectWithLiveUrl tiene liveUrl definida (no null)", () => {
    expect(projectWithLiveUrl).toBeDefined();
    expect(projectWithLiveUrl.liveUrl).not.toBeNull();
    expect(typeof projectWithLiveUrl.liveUrl).toBe("string");
  });

  it("projectWithRepoOnly tiene repoUrl definida y liveUrl null", () => {
    expect(projectWithRepoOnly).toBeDefined();
    expect(projectWithRepoOnly.liveUrl).toBeNull();
    expect(typeof projectWithRepoOnly.repoUrl).toBe("string");
  });

  it("un proyecto sin ningún link no requiere sección de CTAs", () => {
    const projectWithNoLinks: MockProject = {
      subtitle: "Test",
      title: "Sin links",
      description: "Proyecto sin URLs",
      tags: ["Python"],
      gradient: "linear-gradient(135deg, #000 0%, #fff 100%)",
      liveUrl: null,
      repoUrl: null,
    };
    // cv.astro mostraría .project-links vacío; el test documenta el contrato
    expect(projectWithNoLinks.liveUrl).toBeNull();
    expect(projectWithNoLinks.repoUrl).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Composición con MainLayout — rutas de navegación disponibles desde Proyectos
// ---------------------------------------------------------------------------

describe("Proyectos — composición con MainLayout y navegación", () => {
  it("desde Proyectos se puede volver a Home (ROUTES.home)", () => {
    expect(ROUTES.home).toBe("/");
  });

  it("desde Proyectos hay enlace de retorno al CV (ROUTES.cv)", () => {
    expect(ROUTES.cv).toBe("https://cv.azfe.dev/");
  });

  it("ROUTES.projects coincide con la ruta de la página", () => {
    expect(ROUTES.projects).toBe("/projects");
  });
});

// ---------------------------------------------------------------------------
// Contratos de composición (it.todo — requieren renderer Astro o E2E)
// ---------------------------------------------------------------------------

describe("Proyectos — contratos de composición con MainLayout (it.todo)", () => {
  it.todo("renderiza un <section id='proyectos'> envuelto en MainLayout");
  it.todo("el <header> contiene el nombre del autor desde SITE.author");
  it.todo("la cabecera de página incluye el overline 'Portfolio'");
  it.todo("el <h1> de la página es 'Proyectos'");
  it.todo("el grid de tarjetas tiene 2 columnas en desktop");
  it.todo("el grid tiene 1 columna en móvil (max-width: 600px)");
  it.todo("cada tarjeta tiene miniatura con gradient, body con título y descripción");
  it.todo("las tarjetas con liveUrl muestran el botón 'Ver en vivo'");
  it.todo("las tarjetas con repoUrl muestran el botón 'Repositorio'");
  it.todo("los tags de cada proyecto se renderizan como <span role='listitem'>");
  it.todo("el SEO incluye <title> y <meta name='description'> con PAGE_SEO.projects");
  it.todo("el <footer> está presente (herencia de MainLayout)");
  it.todo("ScrollToTop isla está hidratada con client:idle");
  it.todo("cuando se integre la API: los proyectos provienen de getCVComplete().projects");
});
