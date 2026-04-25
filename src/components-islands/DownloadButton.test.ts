/**
 * Tests para DownloadButton.
 *
 * Entorno: node (sin jsdom). El componente React en sí requiere DOM para
 * renderizarse, por lo que no se prueba el JSX directamente.
 *
 * Qué se cubre:
 *  - La función pura `downloadPdf` exportada — lógica de red y validación.
 *  - El módulo exporta el componente por defecto y la función auxiliar.
 *
 * Qué no se cubre aquí:
 *  - El ciclo de useState/eventos DOM del botón (requiere jsdom o
 *    react-testing-library, fuera del alcance de este entorno node).
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { downloadPdf } from "./DownloadButton";

// ---------------------------------------------------------------------------
// Helpers para mockear fetch
// ---------------------------------------------------------------------------

function makeFetchMock(options: {
  ok: boolean;
  status?: number;
  contentType?: string;
  blob?: Blob;
}): typeof fetch {
  const { ok, status = ok ? 200 : 500, contentType = "application/pdf", blob } = options;

  return vi.fn().mockResolvedValue({
    ok,
    status,
    headers: {
      get: (name: string) => (name === "content-type" ? contentType : null),
    },
    blob: () => Promise.resolve(blob ?? new Blob(["PDF content"], { type: "application/pdf" })),
  } as unknown as Response);
}

// ---------------------------------------------------------------------------
// Módulo — comprobación de exports
// ---------------------------------------------------------------------------

describe("DownloadButton — módulo exports", () => {
  it("exporta una función downloadPdf", () => {
    expect(typeof downloadPdf).toBe("function");
  });

  it("exporta el componente React por defecto", async () => {
    const mod = await import("./DownloadButton");
    expect(typeof mod.default).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// downloadPdf — respuesta exitosa
// ---------------------------------------------------------------------------

describe("downloadPdf — respuesta exitosa", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resuelve sin lanzar cuando el fetch devuelve un PDF válido", async () => {
    // En node no existe URL.createObjectURL ni document; mockeamos lo
    // estrictamente necesario para que la función no explote en node.
    vi.stubGlobal("fetch", makeFetchMock({ ok: true, contentType: "application/pdf" }));
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:fake-url"),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue({
        href: "",
        download: "",
        click: vi.fn(),
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });
    vi.stubGlobal("setTimeout", vi.fn());

    await expect(
      downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")
    ).resolves.toBeUndefined();
  });

  it("también acepta content-type octet-stream", async () => {
    vi.stubGlobal("fetch", makeFetchMock({ ok: true, contentType: "application/octet-stream" }));
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:fake-url"),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue({ href: "", download: "", click: vi.fn() }),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
    });
    vi.stubGlobal("setTimeout", vi.fn());

    await expect(
      downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")
    ).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// downloadPdf — errores HTTP
// ---------------------------------------------------------------------------

describe("downloadPdf — errores HTTP", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lanza Error con el status cuando la respuesta no es ok (500)", async () => {
    vi.stubGlobal("fetch", makeFetchMock({ ok: false, status: 500 }));

    await expect(downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")).rejects.toThrow(
      "HTTP 500"
    );
  });

  it("lanza Error con el status cuando la respuesta no es ok (404)", async () => {
    vi.stubGlobal("fetch", makeFetchMock({ ok: false, status: 404 }));

    await expect(downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")).rejects.toThrow(
      "HTTP 404"
    );
  });

  it("lanza Error cuando el content-type no es PDF ni octet-stream", async () => {
    vi.stubGlobal("fetch", makeFetchMock({ ok: true, contentType: "application/json" }));

    await expect(downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")).rejects.toThrow(
      "no es un PDF válido"
    );
  });
});

// ---------------------------------------------------------------------------
// downloadPdf — errores de red
// ---------------------------------------------------------------------------

describe("downloadPdf — errores de red", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("propagates network errors thrown by fetch", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(downloadPdf("http://localhost:8000/api/v1/cv/download", "cv.pdf")).rejects.toThrow(
      "Failed to fetch"
    );
  });
});
