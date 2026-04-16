import type { ApiResponse, ApiSuccess } from "@/types/api.types";
import { API_URL } from "@/config/constants";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    let code: string | undefined;
    try {
      const body: ApiResponse<never> = await res.json();
      if (!body.success) {
        message = body.message ?? message;
        code = body.code;
      }
    } catch {
      // respuesta sin JSON — usamos el mensaje por defecto
    }
    throw new ApiError(res.status, message, code);
  }

  const json: ApiSuccess<T> = await res.json();
  return json.data;
}
