/**
 * Tests para Navigation.astro.
 *
 * Entorno: node (sin jsdom). Los componentes .astro no son importables en
 * Vitest — el compilador de Astro no está disponible fuera de su runtime.
 *
 * Qué se cubre:
 *  - Las rutas que Navigation usa internamente provienen de ROUTES, que sí
 *    es un módulo TS importable. Se verifica que las rutas de navegación
 *    esperadas existen en la constante.
 *
 * Qué no se cubre aquí:
 *  - El HTML renderizado (<nav>, <ul>, <li>, links con iconos SVG) — requiere Astro.
 *  - El comportamiento responsive (ocultar texto en móvil) — requiere Astro.
 */

import { describe, it, expect } from "vitest";
import { ROUTES } from "@/config/constants";

describe("ROUTES — constantes usadas por Navigation", () => {
  it("ROUTES.home es '/'", () => {
    expect(ROUTES.home).toBe("/");
  });

  it("ROUTES.cv es '/cv'", () => {
    expect(ROUTES.cv).toBe("/cv");
  });

  it("ROUTES define al menos home y cv", () => {
    expect(ROUTES).toHaveProperty("home");
    expect(ROUTES).toHaveProperty("cv");
  });
});

describe("Navigation.astro — contrato de estructura", () => {
  it.todo("renderiza un <nav> con aria-label='Navegación principal'");
  it.todo("incluye los cinco enlaces: Inicio, Experiencia, Estudios, Proyectos, Contacto");
  it.todo("cada enlace tiene un aria-label con su etiqueta de texto");
  it.todo("cada enlace incluye un icono SVG con aria-hidden='true'");
  it.todo("en móvil el texto de cada enlace queda oculto visualmente");
});
