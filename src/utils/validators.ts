import type { ContactFormData } from "@/types/common.types";
import type { ApiResponse, ApiSuccess, ApiError } from "@/types/api.types";

const NAME_MIN = 2;
const NAME_MAX = 100;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

// RFC 5322 simplificado: cubre la inmensa mayoría de emails válidos sin
// falsos negativos en casos límite que un regex completo introduciría.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export interface ValidationError {
  field: keyof ContactFormData;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= NAME_MIN && trimmed.length <= NAME_MAX;
}

export function isValidMessage(message: string): boolean {
  const trimmed = message.trim();
  return trimmed.length >= MESSAGE_MIN && trimmed.length <= MESSAGE_MAX;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isValidName(data.name)) {
    errors.push({
      field: "name",
      message: `El nombre debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres.`,
    });
  }

  if (!isValidEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Introduce un correo electrónico válido.",
    });
  }

  if (!isValidMessage(data.message)) {
    errors.push({
      field: "message",
      message: `El mensaje debe tener entre ${MESSAGE_MIN} y ${MESSAGE_MAX} caracteres.`,
    });
  }

  return { valid: errors.length === 0, errors };
}

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

export function isApiError(response: ApiResponse<unknown>): response is ApiError {
  return response.success === false;
}
