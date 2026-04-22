/**
 * Tests para useApiState.
 *
 * Entorno: node (sin jsdom). El hook usa useState/useCallback de React, que
 * requieren DOM para renderizarse. En su lugar, se prueba la lógica asíncrona
 * subyacente que governa las transiciones de estado (idle → loading → success|error)
 * de forma aislada — sin montar el hook.
 *
 * Qué se cubre:
 *  - El fetcher resuelve correctamente: se obtienen datos y sin error.
 *  - El fetcher rechaza con ApiError: el error queda normalizado como FrontendError.
 *  - El fetcher rechaza con Error nativo: categoría UNKNOWN, retryable false.
 *  - La normalización de error preserva el contrato de FrontendError.
 *
 * Qué no se cubre aquí:
 *  - El ciclo completo de useState/useCallback dentro de React (requiere jsdom
 *    o react-testing-library, fuera del alcance de este entorno node).
 */

import { describe, it, expect } from "vitest";
import { normalizeError } from "@/utils/error-handler";
import { ApiError } from "@/services/api/base.service";
import type { ApiStateStatus } from "./useApiState";

// ---------------------------------------------------------------------------
// Helpers — simulan la lógica de execute() sin React
// ---------------------------------------------------------------------------

interface ExecuteResult<T> {
  status: ApiStateStatus;
  data: T | null;
  error: ReturnType<typeof normalizeError> | null;
}

async function runFetcher<T>(fetcher: () => Promise<T>): Promise<ExecuteResult<T>> {
  try {
    const data = await fetcher();
    return { status: "success", data, error: null };
  } catch (err) {
    return { status: "error", data: null, error: normalizeError(err) };
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useApiState — lógica de execute (fetcher resuelve)", () => {
  it("devuelve status success y los datos cuando el fetcher resuelve", async () => {
    const payload = { name: "Alex", role: "Backend Developer" };
    const result = await runFetcher(() => Promise.resolve(payload));

    expect(result.status).toBe("success");
    expect(result.data).toEqual(payload);
    expect(result.error).toBeNull();
  });

  it("data puede ser cualquier forma de objeto", async () => {
    const result = await runFetcher(() => Promise.resolve([1, 2, 3]));

    expect(result.status).toBe("success");
    expect(result.data).toEqual([1, 2, 3]);
  });

  it("data puede ser null cuando el fetcher devuelve null explícitamente", async () => {
    const result = await runFetcher(() => Promise.resolve(null as unknown as object));

    expect(result.status).toBe("success");
    expect(result.data).toBeNull();
  });
});

describe("useApiState — lógica de execute (fetcher rechaza con ApiError)", () => {
  it("devuelve status error y un FrontendError normalizado para 404", async () => {
    const result = await runFetcher(() => Promise.reject(new ApiError(404, "Profile not found")));

    expect(result.status).toBe("error");
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.category).toBe("NOT_FOUND");
    expect(result.error!.retryable).toBe(false);
  });

  it("devuelve status error y NETWORK para errores de red", async () => {
    const result = await runFetcher(() =>
      Promise.reject(new ApiError(503, "No se pudo conectar", "NETWORK_ERROR"))
    );

    expect(result.status).toBe("error");
    expect(result.error!.category).toBe("NETWORK");
    expect(result.error!.retryable).toBe(true);
  });

  it("devuelve status error y SERVER para errores 500", async () => {
    const result = await runFetcher(() =>
      Promise.reject(new ApiError(500, "Internal server error"))
    );

    expect(result.status).toBe("error");
    expect(result.error!.category).toBe("SERVER");
    expect(result.error!.retryable).toBe(true);
  });

  it("devuelve status error y VALIDATION para errores 400", async () => {
    const result = await runFetcher(() => Promise.reject(new ApiError(400, "Datos inválidos")));

    expect(result.status).toBe("error");
    expect(result.error!.category).toBe("VALIDATION");
    expect(result.error!.retryable).toBe(false);
  });
});

describe("useApiState — lógica de execute (fetcher rechaza con Error nativo)", () => {
  it("devuelve status error con categoría UNKNOWN para Error nativo", async () => {
    const result = await runFetcher(() => Promise.reject(new Error("Unexpected")));

    expect(result.status).toBe("error");
    expect(result.data).toBeNull();
    expect(result.error!.category).toBe("UNKNOWN");
    expect(result.error!.retryable).toBe(false);
  });

  it("devuelve status error con categoría UNKNOWN para valores no Error", async () => {
    const result = await runFetcher(() => Promise.reject("string error"));

    expect(result.status).toBe("error");
    expect(result.error!.category).toBe("UNKNOWN");
  });
});

describe("useApiState — contrato de FrontendError", () => {
  it("userMessage siempre es un string no vacío en caso de error", async () => {
    const cases = [
      new ApiError(404, "not found"),
      new ApiError(503, "net", "NETWORK_ERROR"),
      new Error("boom"),
      "raw string",
      null,
    ];

    for (const err of cases) {
      const result = await runFetcher(() => Promise.reject(err));
      expect(typeof result.error!.userMessage).toBe("string");
      expect(result.error!.userMessage.length).toBeGreaterThan(0);
    }
  });

  it("httpStatus está presente cuando el error proviene de ApiError", async () => {
    const result = await runFetcher(() => Promise.reject(new ApiError(422, "Unprocessable")));
    expect(result.error!.httpStatus).toBe(422);
  });

  it("httpStatus está ausente para Error nativo", async () => {
    const result = await runFetcher(() => Promise.reject(new Error("no http")));
    expect(result.error!.httpStatus).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ApiStateStatus — comprobación del tipo exportado
// ---------------------------------------------------------------------------

describe("ApiStateStatus — valores válidos", () => {
  it("acepta los cuatro valores del tipo", () => {
    const statuses: ApiStateStatus[] = ["idle", "loading", "success", "error"];
    expect(statuses).toHaveLength(4);
    expect(statuses).toContain("idle");
    expect(statuses).toContain("loading");
    expect(statuses).toContain("success");
    expect(statuses).toContain("error");
  });
});
