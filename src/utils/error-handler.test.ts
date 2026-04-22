/**
 * Tests para la capa centralizada de manejo de errores (error-handler.ts).
 *
 * Estrategia: entorno `node` (sin jsdom). Se utilizan instancias reales de
 * `ApiError` para verificar la normalización sin mockear dependencias externas.
 */

import { describe, it, expect } from "vitest";
import {
  httpStatusToCategory,
  normalizeError,
  getErrorMessage,
  isRetryableError,
  fetchPageData,
} from "./error-handler";
import { ApiError } from "@/services/api/base.service";
import type { FrontendError } from "@/types/error.types";

// ---------------------------------------------------------------------------
// httpStatusToCategory
// ---------------------------------------------------------------------------

describe("httpStatusToCategory", () => {
  it("devuelve VALIDATION para 400", () => {
    expect(httpStatusToCategory(400)).toBe("VALIDATION");
  });

  it("devuelve VALIDATION para 422", () => {
    expect(httpStatusToCategory(422)).toBe("VALIDATION");
  });

  it("devuelve NOT_FOUND para 404", () => {
    expect(httpStatusToCategory(404)).toBe("NOT_FOUND");
  });

  it("devuelve CONFLICT para 409", () => {
    expect(httpStatusToCategory(409)).toBe("CONFLICT");
  });

  it("devuelve SERVER para 500", () => {
    expect(httpStatusToCategory(500)).toBe("SERVER");
  });

  it("devuelve SERVER para 503", () => {
    expect(httpStatusToCategory(503)).toBe("SERVER");
  });

  it("devuelve UNKNOWN para 401", () => {
    expect(httpStatusToCategory(401)).toBe("UNKNOWN");
  });

  it("devuelve UNKNOWN para 403", () => {
    expect(httpStatusToCategory(403)).toBe("UNKNOWN");
  });
});

// ---------------------------------------------------------------------------
// normalizeError — ApiError de red
// ---------------------------------------------------------------------------

describe("normalizeError — error de red (NETWORK_ERROR)", () => {
  it("produce categoría NETWORK", () => {
    const err = new ApiError(503, "No se pudo conectar", "NETWORK_ERROR");
    const fe = normalizeError(err);
    expect(fe.category).toBe("NETWORK");
  });

  it("es retryable", () => {
    const err = new ApiError(503, "No se pudo conectar", "NETWORK_ERROR");
    expect(normalizeError(err).retryable).toBe(true);
  });

  it("incluye httpStatus y backendCode", () => {
    const err = new ApiError(503, "No se pudo conectar", "NETWORK_ERROR");
    const fe = normalizeError(err);
    expect(fe.httpStatus).toBe(503);
    expect(fe.backendCode).toBe("NETWORK_ERROR");
  });

  it("userMessage no está vacío", () => {
    const err = new ApiError(503, "No se pudo conectar", "NETWORK_ERROR");
    expect(normalizeError(err).userMessage.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// normalizeError — errores HTTP
// ---------------------------------------------------------------------------

describe("normalizeError — HTTP 400", () => {
  it("produce categoría VALIDATION", () => {
    const err = new ApiError(400, "Validation failed");
    expect(normalizeError(err).category).toBe("VALIDATION");
  });

  it("no es retryable", () => {
    const err = new ApiError(400, "Validation failed");
    expect(normalizeError(err).retryable).toBe(false);
  });

  it("usa el mensaje del backend si es legible", () => {
    const err = new ApiError(400, "El email ya existe");
    expect(normalizeError(err).userMessage).toBe("El email ya existe");
  });

  it("usa mensaje por categoría cuando el backend envía 'HTTP 400'", () => {
    const err = new ApiError(400, "HTTP 400");
    const fe = normalizeError(err);
    expect(fe.userMessage).not.toBe("HTTP 400");
    expect(fe.userMessage.length).toBeGreaterThan(0);
  });
});

describe("normalizeError — HTTP 404", () => {
  it("produce categoría NOT_FOUND", () => {
    const err = new ApiError(404, "Profile not found");
    expect(normalizeError(err).category).toBe("NOT_FOUND");
  });

  it("no es retryable", () => {
    const err = new ApiError(404, "Profile not found");
    expect(normalizeError(err).retryable).toBe(false);
  });
});

describe("normalizeError — HTTP 409", () => {
  it("produce categoría CONFLICT", () => {
    const err = new ApiError(409, "Duplicate entry");
    expect(normalizeError(err).category).toBe("CONFLICT");
  });

  it("no es retryable", () => {
    const err = new ApiError(409, "Duplicate entry");
    expect(normalizeError(err).retryable).toBe(false);
  });
});

describe("normalizeError — HTTP 500", () => {
  it("produce categoría SERVER", () => {
    const err = new ApiError(500, "Internal server error");
    expect(normalizeError(err).category).toBe("SERVER");
  });

  it("es retryable", () => {
    const err = new ApiError(500, "Internal server error");
    expect(normalizeError(err).retryable).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// normalizeError — Error nativo y valores desconocidos
// ---------------------------------------------------------------------------

describe("normalizeError — Error nativo", () => {
  it("produce categoría UNKNOWN", () => {
    expect(normalizeError(new Error("something went wrong")).category).toBe("UNKNOWN");
  });

  it("no es retryable", () => {
    expect(normalizeError(new Error("something")).retryable).toBe(false);
  });
});

describe("normalizeError — valor desconocido", () => {
  it("maneja string lanzado", () => {
    expect(normalizeError("error string").category).toBe("UNKNOWN");
  });

  it("maneja null lanzado", () => {
    expect(normalizeError(null).category).toBe("UNKNOWN");
  });

  it("maneja undefined lanzado", () => {
    expect(normalizeError(undefined).category).toBe("UNKNOWN");
  });

  it("maneja objeto plano lanzado", () => {
    expect(normalizeError({ code: 42 }).category).toBe("UNKNOWN");
  });
});

// ---------------------------------------------------------------------------
// getErrorMessage
// ---------------------------------------------------------------------------

describe("getErrorMessage", () => {
  it("acepta un FrontendError ya normalizado", () => {
    const fe: FrontendError = {
      category: "NOT_FOUND",
      userMessage: "No se encontraron datos.",
      retryable: false,
    };
    expect(getErrorMessage(fe)).toBe("No se encontraron datos.");
  });

  it("acepta un ApiError directamente y devuelve mensaje legible", () => {
    const err = new ApiError(404, "Profile not found");
    const msg = getErrorMessage(err);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });

  it("acepta un Error nativo", () => {
    const msg = getErrorMessage(new Error("boom"));
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });

  it("acepta null", () => {
    const msg = getErrorMessage(null);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// isRetryableError
// ---------------------------------------------------------------------------

describe("isRetryableError", () => {
  it("devuelve true para ApiError de red", () => {
    expect(isRetryableError(new ApiError(503, "net", "NETWORK_ERROR"))).toBe(true);
  });

  it("devuelve true para ApiError 500", () => {
    expect(isRetryableError(new ApiError(500, "server error"))).toBe(true);
  });

  it("devuelve false para ApiError 400", () => {
    expect(isRetryableError(new ApiError(400, "bad request"))).toBe(false);
  });

  it("devuelve false para ApiError 404", () => {
    expect(isRetryableError(new ApiError(404, "not found"))).toBe(false);
  });

  it("acepta un FrontendError ya normalizado", () => {
    const fe: FrontendError = {
      category: "SERVER",
      userMessage: "Error del servidor.",
      retryable: true,
    };
    expect(isRetryableError(fe)).toBe(true);
  });

  it("devuelve false para errores desconocidos", () => {
    expect(isRetryableError(new Error("generic"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// fetchPageData
// ---------------------------------------------------------------------------

describe("fetchPageData", () => {
  it("devuelve { ok: true, data } cuando el fetcher resuelve", async () => {
    const result = await fetchPageData(() => Promise.resolve({ id: "1", name: "Alex" }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ id: "1", name: "Alex" });
    }
  });

  it("devuelve { ok: false, error } cuando el fetcher lanza ApiError", async () => {
    const result = await fetchPageData(() =>
      Promise.reject(new ApiError(404, "Profile not found"))
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.category).toBe("NOT_FOUND");
      expect(result.error.retryable).toBe(false);
    }
  });

  it("devuelve { ok: false, error } con categoría NETWORK cuando el fetcher lanza NETWORK_ERROR", async () => {
    const result = await fetchPageData(() =>
      Promise.reject(new ApiError(503, "No se pudo conectar", "NETWORK_ERROR"))
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.category).toBe("NETWORK");
      expect(result.error.retryable).toBe(true);
    }
  });

  it("devuelve { ok: false, error } cuando el fetcher lanza un Error nativo", async () => {
    const result = await fetchPageData(() => Promise.reject(new Error("unexpected")));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.category).toBe("UNKNOWN");
    }
  });

  it("nunca lanza — siempre resuelve", async () => {
    await expect(
      fetchPageData(() => Promise.reject(new ApiError(500, "boom")))
    ).resolves.toBeDefined();
  });
});
