import type { BaseEntity, ISODateString, ObjectId } from "./common.types";

// ---------------------------------------------------------------------------
// Enums (reflejan los Value Objects del dominio)
// ---------------------------------------------------------------------------

export type SkillLevel = "basic" | "intermediate" | "advanced" | "expert" | "none";

/** CEFR */
export type LanguageProficiency = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export type ProgrammingLanguageLevel = "basic" | "intermediate" | "advanced" | "expert";

// ---------------------------------------------------------------------------
// Recursos individuales
// ---------------------------------------------------------------------------

export interface Profile extends BaseEntity {
  name: string;
  headline: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
}

export interface ContactInformation extends BaseEntity {
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface SocialNetwork extends BaseEntity {
  platform: string;
  url: string;
  username: string | null;
  order_index: number;
}

export interface WorkExperience extends BaseEntity {
  role: string;
  company: string;
  location?: string | null;
  start_date: ISODateString;
  end_date: ISODateString | null;
  is_current: boolean;
  duration_months: number;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  order_index: number;
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  start_date: ISODateString;
  end_date: ISODateString | null;
  live_url: string | null;
  repo_url: string | null;
  technologies: string[];
  order_index: number;
}

export interface Skill extends BaseEntity {
  name: string;
  level: SkillLevel | null;
  order_index: number;
}

export interface Tool extends BaseEntity {
  name: string;
  category: string | null;
  icon_url: string | null;
  order_index: number;
}

export interface Education extends BaseEntity {
  institution: string;
  degree: string;
  field: string;
  start_date: ISODateString;
  end_date: ISODateString | null;
  description: string | null;
  technologies: string[];
  order_index: number;
}

export interface AdditionalTraining extends BaseEntity {
  title: string;
  provider: string;
  completion_date: ISODateString;
  duration: string | null;
  certificate_url: string | null;
  description: string | null;
  technologies: string[];
  order_index: number;
}

export interface Certification extends BaseEntity {
  title: string;
  issuer: string;
  issue_date: ISODateString;
  expiry_date: ISODateString | null;
  credential_id: string | null;
  credential_url: string | null;
  order_index: number;
}

export interface Language extends BaseEntity {
  name: string;
  proficiency: LanguageProficiency | null;
  order_index: number;
}

export interface ProgrammingLanguage extends BaseEntity {
  name: string;
  level: ProgrammingLanguageLevel | null;
  order_index: number;
}

export interface ContactMessage {
  id: ObjectId;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: ISODateString;
  read_at: ISODateString | null;
  replied_at: ISODateString | null;
}

// ---------------------------------------------------------------------------
// CV completo — refleja CVCompleteResponse del backend (cv_schema.py)
// ---------------------------------------------------------------------------

export interface CompleteCV {
  profile: Profile;
  contact_info: ContactInformation | null;
  social_networks: SocialNetwork[];
  work_experiences: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  tools: Tool[];
  education: Education[];
  additional_training: AdditionalTraining[];
  certifications: Certification[];
}

/** Alias para compatibilidad con nomenclatura orientada a la API */
export type CVResponse = CompleteCV;
