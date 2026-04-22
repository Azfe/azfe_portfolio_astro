/** Envuelve cualquier respuesta exitosa del backend */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

/** Respuesta de error del backend */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  code?: string;
}

/** Respuesta simple de operaciones sin datos (create, update, delete) */
export interface ApiMessage {
  success: boolean;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
