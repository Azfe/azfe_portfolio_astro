/**
 * Tests para ContactForm.tsx.
 *
 * Entorno: node (sin jsdom). El componente React requiere DOM para montarse,
 * por lo que no se prueba el JSX directamente.
 *
 * Qué se cubre:
 *  - La función `validateContactForm` usada por el componente antes del envío.
 *  - La función `sendContactMessage` (capa de servicio que el componente invoca).
 *  - El módulo exporta el componente por defecto.
 *
 * Qué no se cubre aquí:
 *  - El ciclo completo de estado (idle → loading → success/error) — requiere jsdom.
 *  - Los handlers de React (handleChange, handleSubmit, handleRetry) — requieren jsdom.
 *  - La renderización de errores de campo y el estado de éxito — requieren jsdom.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { validateContactForm, isValidEmail, isValidName, isValidMessage } from "@/utils/validators";
import { sendContactMessage } from "@/services/api/contact.service";
import type { ContactFormData } from "@/types/common.types";

// ---------------------------------------------------------------------------
// Módulo — comprobación de export default
// ---------------------------------------------------------------------------

describe("ContactForm — módulo exports", () => {
  it("exporta el componente React por defecto", async () => {
    const mod = await import("./ContactForm");
    expect(typeof mod.default).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// validateContactForm — datos válidos
// ---------------------------------------------------------------------------

const VALID_DATA: ContactFormData = {
  name: "Alex Zapata",
  email: "alex@example.com",
  message: "Hola, me gustaría hablar sobre un proyecto.",
};

describe("validateContactForm — datos válidos", () => {
  it("devuelve valid: true cuando todos los campos son correctos", () => {
    const result = validateContactForm(VALID_DATA);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// validateContactForm — campo name
// ---------------------------------------------------------------------------

describe("validateContactForm — campo name", () => {
  it("falla cuando name está vacío", () => {
    const result = validateContactForm({ ...VALID_DATA, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "name")).toBe(true);
  });

  it("falla cuando name tiene solo 1 carácter", () => {
    const result = validateContactForm({ ...VALID_DATA, name: "A" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "name")).toBe(true);
  });

  it("pasa cuando name tiene exactamente 2 caracteres", () => {
    const result = validateContactForm({ ...VALID_DATA, name: "Al" });
    expect(result.valid).toBe(true);
  });

  it("falla cuando name supera 100 caracteres", () => {
    const result = validateContactForm({ ...VALID_DATA, name: "A".repeat(101) });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "name")).toBe(true);
  });

  it("el mensaje de error de name no está vacío", () => {
    const result = validateContactForm({ ...VALID_DATA, name: "" });
    const err = result.errors.find((e) => e.field === "name");
    expect(err?.message.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// validateContactForm — campo email
// ---------------------------------------------------------------------------

describe("validateContactForm — campo email", () => {
  it("falla cuando email está vacío", () => {
    const result = validateContactForm({ ...VALID_DATA, email: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "email")).toBe(true);
  });

  it("falla cuando email no tiene dominio", () => {
    const result = validateContactForm({ ...VALID_DATA, email: "user@" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "email")).toBe(true);
  });

  it("falla cuando email no tiene @", () => {
    const result = validateContactForm({ ...VALID_DATA, email: "notanemail" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "email")).toBe(true);
  });

  it("pasa con un email válido estándar", () => {
    const result = validateContactForm({ ...VALID_DATA, email: "user@domain.com" });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateContactForm — campo message
// ---------------------------------------------------------------------------

describe("validateContactForm — campo message", () => {
  it("falla cuando message está vacío", () => {
    const result = validateContactForm({ ...VALID_DATA, message: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "message")).toBe(true);
  });

  it("falla cuando message tiene menos de 10 caracteres", () => {
    const result = validateContactForm({ ...VALID_DATA, message: "Hola" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "message")).toBe(true);
  });

  it("pasa cuando message tiene exactamente 10 caracteres", () => {
    const result = validateContactForm({ ...VALID_DATA, message: "1234567890" });
    expect(result.valid).toBe(true);
  });

  it("falla cuando message supera 2000 caracteres", () => {
    const result = validateContactForm({ ...VALID_DATA, message: "A".repeat(2001) });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "message")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateContactForm — múltiples errores simultáneos
// ---------------------------------------------------------------------------

describe("validateContactForm — múltiples errores", () => {
  it("acumula errores de varios campos a la vez", () => {
    const result = validateContactForm({ name: "", email: "bad", message: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("cada error tiene field y message definidos", () => {
    const result = validateContactForm({ name: "", email: "bad", message: "" });
    for (const err of result.errors) {
      expect(typeof err.field).toBe("string");
      expect(typeof err.message).toBe("string");
      expect(err.message.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers de validación individuales
// ---------------------------------------------------------------------------

describe("isValidEmail", () => {
  it("acepta email estándar", () => expect(isValidEmail("a@b.com")).toBe(true));
  it("rechaza sin dominio TLD", () => expect(isValidEmail("a@b")).toBe(false));
  it("rechaza cadena vacía", () => expect(isValidEmail("")).toBe(false));
  it("rechaza sin @", () => expect(isValidEmail("noemail")).toBe(false));
  it("acepta subdominio", () => expect(isValidEmail("user@mail.domain.es")).toBe(true));
});

describe("isValidName", () => {
  it("acepta nombre de 2+ caracteres", () => expect(isValidName("Al")).toBe(true));
  it("rechaza nombre de 1 carácter", () => expect(isValidName("A")).toBe(false));
  it("rechaza cadena vacía", () => expect(isValidName("")).toBe(false));
  it("recorta espacios antes de validar", () => expect(isValidName("  A  ")).toBe(false));
  it("acepta nombre con espacios internos", () => expect(isValidName("Alex Zapata")).toBe(true));
});

describe("isValidMessage", () => {
  it("acepta mensaje de exactamente 10 caracteres", () =>
    expect(isValidMessage("1234567890")).toBe(true));
  it("rechaza mensaje de 9 caracteres", () => expect(isValidMessage("123456789")).toBe(false));
  it("rechaza cadena vacía", () => expect(isValidMessage("")).toBe(false));
  it("acepta mensaje de 2000 caracteres", () =>
    expect(isValidMessage("A".repeat(2000))).toBe(true));
  it("rechaza mensaje de 2001 caracteres", () =>
    expect(isValidMessage("A".repeat(2001))).toBe(false));
});

// ---------------------------------------------------------------------------
// sendContactMessage — errores HTTP
// ---------------------------------------------------------------------------

describe("sendContactMessage — errores HTTP", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lanza ApiError cuando el backend responde 400", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, message: "Validation failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const { ApiError } = await import("@/services/api/base.service");
    await expect(sendContactMessage(VALID_DATA)).rejects.toBeInstanceOf(ApiError);
  });

  it("lanza ApiError cuando el backend responde 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const { ApiError } = await import("@/services/api/base.service");
    await expect(sendContactMessage(VALID_DATA)).rejects.toBeInstanceOf(ApiError);
  });

  it("lanza ApiError con code NETWORK_ERROR cuando fetch falla por red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const { ApiError } = await import("@/services/api/base.service");
    await expect(sendContactMessage(VALID_DATA)).rejects.toMatchObject({
      code: "NETWORK_ERROR",
    });
    await expect(sendContactMessage(VALID_DATA)).rejects.toBeInstanceOf(ApiError);
  });
});

describe("sendContactMessage — éxito", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resuelve cuando el backend responde 200 con success: true", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: { id: "abc123" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await expect(sendContactMessage(VALID_DATA)).resolves.toBeDefined();
  });
});
