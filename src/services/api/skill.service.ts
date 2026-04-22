import type { Skill } from "@/types/cv.types";
import { apiGet, apiPost, apiPut, apiDelete } from "./base.service";

type SkillPayload = Omit<Skill, "id" | "profile_id" | "created_at" | "updated_at">;

export async function getSkills(): Promise<Skill[]> {
  return apiGet<Skill[]>("/skills");
}

export async function createSkill(data: SkillPayload): Promise<Skill> {
  return apiPost<Skill>("/skills", data);
}

export async function updateSkill(id: string, data: Partial<SkillPayload>): Promise<Skill> {
  return apiPut<Skill>(`/skills/${id}`, data);
}

export async function deleteSkill(id: string): Promise<void> {
  return apiDelete<void>(`/skills/${id}`);
}
