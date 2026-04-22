/**
 * Tests para el cliente HTTP base (base.service.ts).
 *
 * Estrategia: se mockea `fetch` globalmente usando `vi.stubGlobal` para
 * evitar peticiones de red reales. El entorno es `node` (sin jsdom), por lo
 * que se utiliza la API nativa de Vitest para mocks y espías.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ApiError,
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  onBeforeRequest,
  onAfterResponse,
} from "./base.service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Crea una respuesta `Response` con cuerpo JSON y status dado. */
function makeJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  // Limpiar arrays internos de hooks para aislar tests
  // (accedemos a través de import dinámico para no romper el módulo)
});

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

describe("ApiError", () => {
  it("tiene name 'ApiError'", () => {
    const err = new ApiError(404, "Not found");
    expect(err.name).toBe("ApiError");
  });

  it("expone status y message", () => {
    const err = new ApiError(400, "Bad request", "VALIDATION_ERROR");
    expect(err.status).toBe(400);
    expect(err.message).toBe("Bad request");
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("es instancia de Error", () => {
    const err = new ApiError(500, "Internal error");
    expect(err).toBeInstanceOf(Error);
  });

  it("code es opcional", () => {
    const err = new ApiError(500, "Internal error");
    expect(err.code).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// apiFetch — respuestas exitosas
// ---------------------------------------------------------------------------

describe("apiFetch — respuestas exitosas", () => {
  it("devuelve data cuando la respuesta tiene forma { data: T }", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(makeJsonResponse({ success: true, data: { id: "1", name: "Alex" } }));
    vi.stubGlobal("fetch", mockFetch);

    const result = await apiFetch<{ id: string; name: string }>("/profile");
    expect(result).toEqual({ id: "1", name: "Alex" });
  });

  it("devuelve la respuesta directamente cuando no tiene campo data", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse([{ id: "1" }, { id: "2" }]));
    vi.stubGlobal("fetch", mockFetch);

    const result = await apiFetch<{ id: string }[]>("/social-networks");
    expect(result).toEqual([{ id: "1" }, { id: "2" }]);
  });

  it("construye la URL correctamente con el path dado", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [calledUrl] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(calledUrl).toMatch(/\/cv$/);
  });

  it("incluye Content-Type: application/json por defecto", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv");

    const [, calledInit] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((calledInit.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("permite añadir headers extra sin perder Content-Type", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv", { headers: { "X-Custom": "value" } });

    const [, calledInit] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = calledInit.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Custom"]).toBe("value");
  });
});

// ---------------------------------------------------------------------------
// apiFetch — errores HTTP
// ---------------------------------------------------------------------------

describe("apiFetch — errores HTTP", () => {
  it("lanza ApiError con status 404 cuando el servidor responde 404", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        makeJsonResponse({ success: false, error: "not_found", message: "Profile not found" }, 404)
      );
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/profile")).rejects.toThrow(ApiError);
    await expect(apiFetch("/profile")).rejects.toMatchObject({ status: 404 });
  });

  it("lanza ApiError con status 400 y message del backend", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        makeJsonResponse(
          { success: false, error: "bad_request", message: "Validation failed" },
          400
        )
      );
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/contact-messages")).rejects.toMatchObject({
      status: 400,
      message: "Validation failed",
    });
  });

  it("lanza ApiError con status 409", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        makeJsonResponse({ success: false, error: "conflict", message: "Duplicate entry" }, 409)
      );
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/skills")).rejects.toMatchObject({ status: 409 });
  });

  it("lanza ApiError con status 500", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        makeJsonResponse(
          { success: false, error: "server_error", message: "Internal server error" },
          500
        )
      );
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/cv")).rejects.toMatchObject({ status: 500 });
  });

  it("usa mensaje genérico si el body de error no es JSON válido", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(
        new Response("plain text error", { status: 500, headers: { "Content-Type": "text/plain" } })
      );
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/cv")).rejects.toMatchObject({
      status: 500,
      message: "HTTP 500",
    });
  });
});

// ---------------------------------------------------------------------------
// apiFetch — error de red
// ---------------------------------------------------------------------------

describe("apiFetch — error de red", () => {
  it("lanza ApiError con code NETWORK_ERROR cuando fetch rechaza", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/cv")).rejects.toMatchObject({
      status: 503,
      code: "NETWORK_ERROR",
    });
  });

  it("el mensaje de NETWORK_ERROR incluye la URL", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("ECONNREFUSED"));
    vi.stubGlobal("fetch", mockFetch);

    try {
      await apiFetch("/cv");
    } catch (err) {
      expect((err as ApiError).message).toContain("/cv");
    }
  });
});

// ---------------------------------------------------------------------------
// Hooks (interceptores equivalentes)
// ---------------------------------------------------------------------------

describe("onBeforeRequest", () => {
  it("se invoca antes de la petición con la URL y el init", async () => {
    const hook = vi.fn();
    onBeforeRequest(hook);

    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv");

    expect(hook).toHaveBeenCalledOnce();
    const [url, init] = hook.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/cv$/);
    expect(init).toHaveProperty("headers");
  });

  it("permite modificar headers desde el hook", async () => {
    onBeforeRequest((_url, init) => {
      (init.headers as Record<string, string>)["X-Hook-Header"] = "injected";
    });

    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv");

    const [, calledInit] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect((calledInit.headers as Record<string, string>)["X-Hook-Header"]).toBe("injected");
  });
});

describe("onAfterResponse", () => {
  it("se invoca después de una respuesta exitosa", async () => {
    const hook = vi.fn();
    onAfterResponse(hook);

    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: {} }));
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("/cv");

    expect(hook).toHaveBeenCalledOnce();
  });

  it("no se invoca cuando la respuesta es un error HTTP", async () => {
    const hook = vi.fn();
    onAfterResponse(hook);

    const mockFetch = vi
      .fn()
      .mockResolvedValue(makeJsonResponse({ success: false, message: "Not found" }, 404));
    vi.stubGlobal("fetch", mockFetch);

    await expect(apiFetch("/profile")).rejects.toBeInstanceOf(ApiError);
    expect(hook).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Helpers de método
// ---------------------------------------------------------------------------

describe("apiGet", () => {
  it("llama a fetch con method GET", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: [] }));
    vi.stubGlobal("fetch", mockFetch);

    await apiGet("/skills");

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("GET");
  });
});

describe("apiPost", () => {
  it("llama a fetch con method POST y body serializado como JSON", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: { id: "new" } }));
    vi.stubGlobal("fetch", mockFetch);

    const payload = { name: "Alex", email: "alex@example.com", message: "Hola" };
    await apiPost("/contact-messages", payload);

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify(payload));
  });
});

describe("apiPut", () => {
  it("llama a fetch con method PUT y body serializado como JSON", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: { id: "1" } }));
    vi.stubGlobal("fetch", mockFetch);

    const payload = { name: "Updated Name" };
    await apiPut("/profile/1", payload);

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify(payload));
  });
});

describe("apiDelete", () => {
  it("llama a fetch con method DELETE", async () => {
    const mockFetch = vi.fn().mockResolvedValue(makeJsonResponse({ data: null }));
    vi.stubGlobal("fetch", mockFetch);

    await apiDelete("/messages/1");

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("DELETE");
  });
});
