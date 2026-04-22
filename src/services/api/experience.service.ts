import type { WorkExperience } from "@/types/cv.types";
import { apiGet, apiPost, apiPut, apiDelete } from "./base.service";

type WorkExperiencePayload = Omit<
  WorkExperience,
  "id" | "profile_id" | "created_at" | "updated_at"
>;

export async function getExperiences(): Promise<WorkExperience[]> {
  return apiGet<WorkExperience[]>("/work-experience");
}

export async function createExperience(data: WorkExperiencePayload): Promise<WorkExperience> {
  return apiPost<WorkExperience>("/work-experience", data);
}

export async function updateExperience(
  id: string,
  data: Partial<WorkExperiencePayload>
): Promise<WorkExperience> {
  return apiPut<WorkExperience>(`/work-experience/${id}`, data);
}

export async function deleteExperience(id: string): Promise<void> {
  return apiDelete<void>(`/work-experience/${id}`);
}
