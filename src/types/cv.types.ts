// ---------------------------------------------------------------------------
// Enums (reflejan los Value Objects del dominio)
// ---------------------------------------------------------------------------

export type SkillLevel = "basic" | "intermediate" | "advanced" | "expert";

/** CEFR */
export type LanguageProficiency = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export type ProgrammingLanguageLevel = "basic" | "intermediate" | "advanced" | "expert";

// ---------------------------------------------------------------------------
// Recursos individuales
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  name: string;
  headline: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInformation {
  id: string;
  profile_id: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialNetwork {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  username: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  profile_id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  responsibilities: string[];
  order_index: number;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  live_url: string | null;
  repo_url: string | null;
  technologies: string[];
  order_index: number;
  is_ongoing: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  category: string;
  level: SkillLevel | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  profile_id: string;
  name: string;
  category: string;
  icon_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile_id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  order_index: number;
  is_ongoing: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdditionalTraining {
  id: string;
  profile_id: string;
  title: string;
  provider: string;
  completion_date: string;
  duration: string | null;
  certificate_url: string | null;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  order_index: number;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  profile_id: string;
  name: string;
  proficiency: LanguageProficiency | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProgrammingLanguage {
  id: string;
  profile_id: string;
  name: string;
  level: ProgrammingLanguageLevel | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  read_at: string | null;
  replied_at: string | null;
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
