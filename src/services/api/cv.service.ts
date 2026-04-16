import type { CompleteCV } from "@/types/cv.types";
import { API_URL } from "@/config/constants";
import { apiFetch, ApiError } from "./base.service";

export async function getCVComplete(): Promise<CompleteCV> {
  return apiFetch<CompleteCV>("/cv");
}

export async function downloadCV(): Promise<Blob> {
  const res = await fetch(`${API_URL}/cv/download`);
  if (!res.ok) {
    throw new ApiError(res.status, `Error al descargar el CV: HTTP ${res.status}`);
  }
  return res.blob();
}
