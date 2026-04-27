import { describe, it, expect } from "vitest";
import { formatDuration } from "./date.utils";

describe("formatDuration", () => {
  it("devuelve 'menos de 1 mes' para 0 meses", () => {
    expect(formatDuration(0)).toBe("menos de 1 mes");
  });

  it("devuelve 'menos de 1 mes' para valores negativos", () => {
    expect(formatDuration(-5)).toBe("menos de 1 mes");
  });

  it("devuelve '1 mes' para 1 mes", () => {
    expect(formatDuration(1)).toBe("1 mes");
  });

  it("devuelve 'N meses' cuando solo hay meses (sin años completos)", () => {
    expect(formatDuration(3)).toBe("3 meses");
    expect(formatDuration(11)).toBe("11 meses");
  });

  it("devuelve '1 año' para exactamente 12 meses", () => {
    expect(formatDuration(12)).toBe("1 año");
  });

  it("devuelve 'N años' para múltiplos exactos de 12", () => {
    expect(formatDuration(24)).toBe("2 años");
    expect(formatDuration(36)).toBe("3 años");
  });

  it("devuelve '1 año N meses' para 13-23 meses (singlar de año)", () => {
    expect(formatDuration(13)).toBe("1 año 1 mes");
    expect(formatDuration(14)).toBe("1 año 2 meses");
    expect(formatDuration(23)).toBe("1 año 11 meses");
  });

  it("devuelve 'N años M meses' para combinaciones mayores de 24 meses", () => {
    expect(formatDuration(27)).toBe("2 años 3 meses");
    expect(formatDuration(25)).toBe("2 años 1 mes");
  });
});
