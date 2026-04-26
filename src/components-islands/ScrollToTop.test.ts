/**
 * Tests para ScrollToTop.tsx.
 *
 * Entorno: node (sin jsdom). El componente usa useEffect, window.scrollY,
 * window.addEventListener y document.head — todos globals de navegador que
 * no existen en node.
 *
 * Qué se cubre:
 *  - El módulo exporta el componente React por defecto.
 *
 * Qué no se cubre aquí:
 *  - La lógica de visibilidad (visible cuando scrollY > 400) — requiere jsdom.
 *  - injectStyles (crea un <style> en document.head) — requiere jsdom.
 *  - El handler de scroll y su limpieza en el return del useEffect — requiere jsdom.
 *  - scrollUp (window.scrollTo) — requiere jsdom.
 *  - La renderización del botón cuando visible es true — requiere jsdom.
 */

import { describe, it, expect } from "vitest";

describe("ScrollToTop — módulo exports", () => {
  it("exporta el componente React por defecto", async () => {
    const mod = await import("./ScrollToTop");
    expect(typeof mod.default).toBe("function");
  });
});

describe("ScrollToTop — contrato de comportamiento", () => {
  it.todo("no renderiza nada cuando scrollY es <= 400 (visible=false)");
  it.todo("renderiza el botón cuando scrollY supera 400 (visible=true)");
  it.todo("el botón tiene aria-label='Volver arriba'");
  it.todo("al hacer click en el botón llama a window.scrollTo({ top: 0 })");
  it.todo("injectStyles inserta un <style> en document.head la primera vez");
  it.todo("injectStyles no duplica el <style> si ya existe el id 'scroll-to-top-styles'");
  it.todo("el listener de scroll se elimina al desmontar el componente");
});
