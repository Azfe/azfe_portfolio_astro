/**
 * ContactForm.tsx
 *
 * Isla React interactiva que permite enviar un mensaje de contacto desde el portfolio.
 *
 * Comportamiento:
 *  - Valida el formulario en cliente antes de enviar (nombre, email, mensaje).
 *  - Muestra errores de campo en tiempo de envío (submit-time, no on-the-fly).
 *  - Muestra un estado de carga visual mientras la petición está en vuelo.
 *  - Muestra confirmación de éxito cuando el backend responde correctamente.
 *  - Muestra un mensaje de error global cuando el backend falla o no está disponible.
 *  - Permite reintentar cuando el error es transitorio (red / servidor 5xx).
 *
 * Integración en Astro:
 *   import ContactForm from "@/components-islands/ContactForm";
 *   <ContactForm client:visible />
 *
 * El endpoint usado es POST /contact-messages (definido en contact.service.ts).
 * Cuando el contrato backend cambie, solo hay que actualizar contact.service.ts
 * — este componente no necesita modificarse.
 */

import { useState, useId } from "react";
import { validateContactForm } from "@/utils/validators";
import { normalizeError } from "@/utils/error-handler";
import { sendContactMessage } from "@/services/api/contact.service";
import type { ContactFormData } from "@/types/common.types";
import type { ValidationError } from "@/utils/validators";
import type { FrontendError } from "@/types/error.types";

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

type FormStatus = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Sub-componentes de utilidad
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ animation: "cf-spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes cf-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers de estilo (inline — sin Tailwind en islas)
// ---------------------------------------------------------------------------

const FORM_WRAP: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: "var(--radius)",
  padding: "32px 28px",
  boxShadow: "var(--shadow-card)",
};

const FIELD_WRAP: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "20px",
};

const LABEL: React.CSSProperties = {
  fontSize: "13.5px",
  fontWeight: 600,
  color: "var(--ink)",
  letterSpacing: "0.01em",
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: `1.5px solid ${hasError ? "#e53e3e" : "var(--line)"}`,
    background: hasError ? "#fff5f5" : "var(--soft)",
    color: "var(--ink)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 150ms ease, background 150ms ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
}

const FIELD_ERROR: React.CSSProperties = {
  fontSize: "12.5px",
  color: "#c53030",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const SUBMIT_BTN: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "11px 28px",
  borderRadius: "var(--radius-pill)",
  background: "var(--blue)",
  color: "#ffffff",
  fontSize: "14.5px",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "background 200ms ease, box-shadow 200ms ease",
  boxShadow: "0 4px 14px rgba(30, 107, 247, 0.28)",
  width: "100%",
  marginTop: "4px",
};

const SUBMIT_BTN_LOADING: React.CSSProperties = {
  ...SUBMIT_BTN,
  opacity: 0.75,
  cursor: "default",
  boxShadow: "none",
};

const GLOBAL_ERROR_BOX: React.CSSProperties = {
  background: "#fff5f5",
  border: "1.5px solid #fed7d7",
  borderRadius: "10px",
  padding: "14px 16px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const GLOBAL_ERROR_TEXT: React.CSSProperties = {
  fontSize: "13.5px",
  color: "#c53030",
  fontWeight: 500,
  lineHeight: 1.55,
};

const RETRY_BTN: React.CSSProperties = {
  alignSelf: "flex-start",
  padding: "5px 14px",
  borderRadius: "var(--radius-pill)",
  background: "transparent",
  border: "1.5px solid #c53030",
  color: "#c53030",
  fontSize: "12.5px",
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "background 150ms ease",
};

const SUCCESS_BOX: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  padding: "40px 28px",
  textAlign: "center",
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: "var(--radius)",
  boxShadow: "var(--shadow-card)",
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const EMPTY_FORM: ContactFormData = { name: "", email: "", message: "" };

export default function ContactForm() {
  const formId = useId();

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [globalError, setGlobalError] = useState<FrontendError | null>(null);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar el error del campo al editar
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validación cliente
    const result = validateContactForm(formData);
    if (!result.valid) {
      const mapped: FieldErrors = {};
      result.errors.forEach((err: ValidationError) => {
        mapped[err.field] = err.message;
      });
      setFieldErrors(mapped);
      return;
    }

    setFieldErrors({});
    setGlobalError(null);
    setStatus("loading");

    try {
      await sendContactMessage(formData);
      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch (err) {
      const fe = normalizeError(err);
      setGlobalError(fe);
      setStatus("error");
    }
  }

  function handleRetry() {
    setGlobalError(null);
    setStatus("idle");
  }

  // -------------------------------------------------------------------------
  // Render — estado success
  // -------------------------------------------------------------------------

  if (status === "success") {
    return (
      <div style={SUCCESS_BOX} role="status" aria-live="polite">
        <span
          style={{
            color: "#22c55e",
            background: "#f0fdf4",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon />
        </span>
        <p
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Mensaje enviado
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ink-2)",
            margin: 0,
            maxWidth: "340px",
            lineHeight: 1.6,
          }}
        >
          Gracias por escribirme. Te responderé en el menor tiempo posible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: "4px",
            padding: "9px 22px",
            borderRadius: "var(--radius-pill)",
            background: "var(--soft)",
            border: "1px solid var(--line)",
            color: "var(--ink-2)",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render — formulario (idle | loading | error)
  // -------------------------------------------------------------------------

  const isLoading = status === "loading";

  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const messageId = `${formId}-message`;
  const nameErrorId = `${nameId}-error`;
  const emailErrorId = `${emailId}-error`;
  const messageErrorId = `${messageId}-error`;

  return (
    <div style={FORM_WRAP}>
      {/* Error global (red o servidor) */}
      {status === "error" && globalError && (
        <div style={GLOBAL_ERROR_BOX} role="alert" aria-live="assertive">
          <p style={GLOBAL_ERROR_TEXT}>{globalError.userMessage}</p>
          {globalError.retryable && (
            <button onClick={handleRetry} style={RETRY_BTN}>
              Reintentar
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-label="Formulario de contacto">
        {/* Nombre */}
        <div style={FIELD_WRAP}>
          <label htmlFor={nameId} style={LABEL}>
            Nombre{" "}
            <span aria-hidden="true" style={{ color: "#c53030" }}>
              *
            </span>
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? nameErrorId : undefined}
            placeholder="Tu nombre completo"
            style={inputStyle(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name && (
            <span id={nameErrorId} style={FIELD_ERROR} role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div style={FIELD_WRAP}>
          <label htmlFor={emailId} style={LABEL}>
            Correo electrónico{" "}
            <span aria-hidden="true" style={{ color: "#c53030" }}>
              *
            </span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? emailErrorId : undefined}
            placeholder="tu@email.com"
            style={inputStyle(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && (
            <span id={emailErrorId} style={FIELD_ERROR} role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Mensaje */}
        <div style={{ ...FIELD_WRAP, marginBottom: "24px" }}>
          <label htmlFor={messageId} style={LABEL}>
            Mensaje{" "}
            <span aria-hidden="true" style={{ color: "#c53030" }}>
              *
            </span>
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? messageErrorId : undefined}
            placeholder="¿En qué puedo ayudarte?"
            style={{
              ...inputStyle(Boolean(fieldErrors.message)),
              resize: "vertical",
              minHeight: "120px",
            }}
          />
          {fieldErrors.message && (
            <span id={messageErrorId} style={FIELD_ERROR} role="alert">
              {fieldErrors.message}
            </span>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          aria-disabled={isLoading}
          style={isLoading ? SUBMIT_BTN_LOADING : SUBMIT_BTN}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--blue-2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 20px rgba(30, 107, 247, 0.38)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--blue)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 14px rgba(30, 107, 247, 0.28)";
            }
          }}
        >
          {isLoading ? (
            <>
              <Spinner />
              Enviando…
            </>
          ) : (
            <>
              <SendIcon />
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
}
