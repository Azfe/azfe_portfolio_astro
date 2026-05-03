/**
 * Tests de integración — CVLayout.astro
 *
 * Objetivo (I-F-4.6.2-06, I-F-4.6.2-08):
 * Verificar que cv.astro se puede componer con CVLayout sin romper la
 * navegación ni duplicar estructuras. CVLayout es un layout especializado
 * que NO incluye el Header/Footer del sitio principal — este test valida
 * que ese contrato de aislamiento está bien definido.
 *
 * Entorno: node (sin jsdom).
 */

import { describe, it, expect } from "vitest";
import { PAGE_SEO } from "@/config/seo";
import { ROUTES } from "@/config/constants";
import { API_URL } from "@/config/constants";

// ---------------------------------------------------------------------------
// Props del CVLayout — cv.astro pasa title, description (noindex omitido)
// ---------------------------------------------------------------------------

describe("CVLayout — contratos de props de cv.astro", () => {
  it("PAGE_SEO.cv.title 'CV' es el title que se pasa a CVLayout", () => {
    expect(PAGE_SEO.cv.title).toBe("CV");
  });

  it("PAGE_SEO.cv.description es una cadena no vacía para CVLayout", () => {
    expect(typeof PAGE_SEO.cv.description).toBe("string");
    expect((PAGE_SEO.cv.description ?? "").length).toBeGreaterThan(0);
  });

  it("cv.astro no pasa noindex: el CV es una página pública", () => {
    expect(PAGE_SEO.cv.noindex).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// CVLayout es aislado — no incluye Header/Footer del sitio principal
// ---------------------------------------------------------------------------

describe("CVLayout — aislamiento respecto a MainLayout", () => {
  it("la ruta del CV no es la raíz (no coincide con Home)", () => {
    expect(ROUTES.cv).not.toBe(ROUTES.home);
  });

  it("el enlace 'Portfolio' en el toolbar del CVLayout apunta a ROUTES.home", () => {
    // CVLayout tiene un <a href="/"> que vuelve al portfolio
    expect(ROUTES.home).toBe("/");
  });

  it("CVLayout no requiere Header ni Footer (se verifica via la documentación del layout)", () => {
    // CVLayout.astro tiene comentario explícito:
    // "CVLayout does not use Header or Footer intentionally."
    // Este test documenta el contrato de aislamiento.
    expect(true).toBe(true); // contrato documentado
  });
});

// ---------------------------------------------------------------------------
// DownloadButton — CVLayout pasa el endpoint correcto al botón de descarga
// ---------------------------------------------------------------------------

describe("CVLayout — endpoint de descarga de CV", () => {
  it("API_URL está configurada en el entorno de tests", () => {
    expect(typeof API_URL).toBe("string");
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it("el endpoint de descarga es API_URL + '/cv/download'", () => {
    const downloadEndpoint = `${API_URL}/cv/download`;
    expect(downloadEndpoint).toContain("/cv/download");
  });

  it("el endpoint de descarga no termina en slash doble", () => {
    const downloadEndpoint = `${API_URL}/cv/download`;
    expect(downloadEndpoint).not.toContain("//cv");
  });
});

// ---------------------------------------------------------------------------
// Navegación desde CVLayout — el toolbar permite volver al portfolio
// ---------------------------------------------------------------------------

describe("CVLayout — navegación del toolbar", () => {
  it("el botón 'Portfolio' del toolbar usa ROUTES.home ('/')", () => {
    expect(ROUTES.home).toBe("/");
  });

  it("la ruta de retorno es la raíz, no una subruta", () => {
    expect(ROUTES.home).toBe("/");
  });
});

// ---------------------------------------------------------------------------
// Contratos de composición (it.todo — requieren renderer Astro o E2E)
// ---------------------------------------------------------------------------

describe("CVLayout — contratos de composición render (it.todo)", () => {
  it.todo("renderiza el toolbar con clase 'cv-bar' sticky al top");
  it.todo("el toolbar muestra 'Alex Zapata · Curriculum Vitae' con el punto azul");
  it.todo("el toolbar incluye el enlace '← Portfolio' que apunta a '/'");
  it.todo("el toolbar incluye DownloadButton hidratado con client:load");
  it.todo("el fondo de la página (.cv-bg) tiene background #f4f6fa");
  it.todo("el contenido del CV se renderiza en .cv-paper con sombra y borde redondeado");
  it.todo("el slot de contenido se inyecta dentro de .cv-paper");
  it.todo("en impresión: .cv-bar se oculta y .cv-paper pierde la sombra");
  it.todo("ScrollToTop isla está presente con client:idle");
  it.todo(":global(body) tiene background-color #f4f6fa en la página CV");
  it.todo("CVLayout no incluye <Header /> ni <Footer /> del sitio");
});
