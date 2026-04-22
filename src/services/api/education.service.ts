import type { Education } from "@/types/cv.types";
import { apiGet, apiPost, apiPut, apiDelete } from "./base.service";

type EducationPayload = Omit<Education, "id" | "profile_id" | "created_at" | "updated_at">;

export async function getEducation(): Promise<Education[]> {
  return apiGet<Education[]>("/education");
}

export async function createEducation(data: EducationPayload): Promise<Education> {
  return apiPost<Education>("/education", data);
}

export async function updateEducation(
  id: string,
  data: Partial<EducationPayload>
): Promise<Education> {
  return apiPut<Education>(`/education/${id}`, data);
}

export async function deleteEducation(id: string): Promise<void> {
  return apiDelete<void>(`/education/${id}`);
}
