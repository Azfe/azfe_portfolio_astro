/**
 * contact.service.ts
 *
 * Capa de servicio para el endpoint de contacto del backend.
 *
 * Contrato esperado (según issue 4.5.3):
 *   POST /contact-messages
 *   Body : { name: string; email: string; message: string }
 *   200/201 → ApiSuccess<ContactMessageResponse>
 *   400/422 → ApiError (validación backend)
 *   5xx     → ApiError (error interno)
 *
 * El cliente base (apiPost) se encarga de añadir Content-Type: application/json,
 * parsear la respuesta y lanzar ApiError ante cualquier código HTTP de error.
 */

import type { ContactFormData } from "@/types/common.types";
import { apiPost } from "./base.service";

// ---------------------------------------------------------------------------
// Tipos de respuesta
// ---------------------------------------------------------------------------

/**
 * Forma mínima de la respuesta del backend al crear un mensaje de contacto.
 * Se amplía cuando el contrato del endpoint quede cerrado definitivamente.
 */
export interface ContactMessageResponse {
  id?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Servicio
// ---------------------------------------------------------------------------

/**
 * Envía un mensaje de contacto al backend.
 *
 * @param data - Datos del formulario validados en cliente.
 * @returns    - Respuesta del backend (puede ignorarse en la UI si solo interesa el éxito).
 * @throws     - `ApiError` si el backend responde con un error HTTP o no está disponible.
 *
 * @example
 *   try {
 *     await sendContactMessage({ name, email, message });
 *     setStatus("success");
 *   } catch (err) {
 *     setError(normalizeError(err));
 *   }
 */
export async function sendContactMessage(data: ContactFormData): Promise<ContactMessageResponse> {
  return apiPost<ContactMessageResponse>("/contact-messages", data);
}
