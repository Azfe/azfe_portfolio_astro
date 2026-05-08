/**
 * Fixtures de datos para tests de integración de la página CV (cv.astro).
 *
 * Simula la respuesta del endpoint GET /api/v1/cv del backend sin necesidad
 * de levantar el servidor. La estructura refleja exactamente `CompleteCV`
 * de `src/types/cv.types.ts`.
 *
 * Uso:
 *   import { mockCompleteCV, mockEmptyCV } from "@/tests/integration/fixtures/cv.fixtures";
 */

import type {
  CompleteCV,
  Profile,
  ContactInformation,
  SocialNetwork,
  WorkExperience,
  Project,
  Skill,
  Tool,
  Education,
  AdditionalTraining,
  Certification,
} from "@/types/cv.types";

// ---------------------------------------------------------------------------
// Entidades base reutilizables
// ---------------------------------------------------------------------------

export const mockProfile: Profile = {
  id: "profile-001",
  created_at: "2024-01-01T00:00:00",
  updated_at: "2024-06-01T00:00:00",
  name: "Alex Zapata",
  headline: "Backend Developer · Python · Clean Architecture",
  bio: "Desarrollador fullstack con capacidad para diseñar y desarrollar aplicaciones web end‑to‑end. Combino un fuerte dominio del frontend con experiencia en backend y bases de datos.",
  location: "Barcelona, ES",
  avatar_url: null,
};

export const mockContactInfo: ContactInformation = {
  id: "contact-001",
  created_at: "2024-01-01T00:00:00",
  updated_at: null,
  email: "alex@azfe.dev",
  phone: "+34 600 000 000",
  linkedin: "https://linkedin.com/in/alexzapata",
  github: "https://github.com/azfe",
  website: "https://azfe.dev",
};

export const mockSocialNetworks: SocialNetwork[] = [
  {
    id: "sn-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    platform: "GitHub",
    url: "https://github.com/azfe",
    username: "azfe",
    order_index: 1,
  },
  {
    id: "sn-002",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    platform: "LinkedIn",
    url: "https://linkedin.com/in/alexzapata",
    username: "alexzapata",
    order_index: 2,
  },
];

export const mockWorkExperiences: WorkExperience[] = [
  {
    id: "exp-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    role: "Backend Developer",
    company: "Acme Corp",
    location: "Barcelona, ES",
    start_date: "2023-01-01",
    end_date: null,
    is_current: true,
    duration_months: 28,
    description: "Desarrollo de APIs REST con FastAPI y MongoDB.",
    responsibilities: ["Diseño de arquitectura", "Code reviews", "Testing"],
    technologies: [],
    order_index: 1,
  },
  {
    id: "exp-002",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    role: "Junior Developer",
    company: "StartupXYZ",
    location: "Remote",
    start_date: "2021-03-01",
    end_date: "2022-12-31",
    is_current: false,
    duration_months: 22,
    description: "Desarrollo fullstack con React y Node.js.",
    responsibilities: ["Frontend con React", "Backend con Express"],
    technologies: [],
    order_index: 2,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    title: "azfe.dev Portfolio",
    description: "Portfolio profesional con Astro y FastAPI.",
    start_date: "2024-01-01",
    end_date: null,
    live_url: "https://azfe.dev",
    repo_url: "https://github.com/azfe/portfolio",
    technologies: ["Astro", "FastAPI", "MongoDB", "TypeScript"],
    image_url: null,
    order_index: 1,
  },
];

export const mockSkills: Skill[] = [
  {
    id: "skill-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    name: "Python",
    level: "expert",
    order_index: 1,
  },
  {
    id: "skill-002",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    name: "FastAPI",
    level: "advanced",
    order_index: 2,
  },
  {
    id: "skill-003",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    name: "TypeScript",
    level: "advanced",
    order_index: 3,
  },
];

export const mockTools: Tool[] = [
  {
    id: "tool-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    name: "Docker",
    category: "DevOps",
    icon_url: null,
    order_index: 1,
  },
  {
    id: "tool-002",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    name: "VS Code",
    category: "Editor",
    icon_url: null,
    order_index: 2,
  },
];

export const mockEducation: Education[] = [
  {
    id: "edu-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    institution: "FP Jesuites El Clot",
    degree: "Técnico Superior en Desarrollo de Aplicaciones Web",
    field: "Desarrollo Web",
    start_date: "2016-09-01",
    end_date: "2020-06-01",
    description: "Formación en desarrollo web fullstack.",
    technologies: [],
    order_index: 1,
  },
];

export const mockAdditionalTraining: AdditionalTraining[] = [
  {
    id: "at-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    title: "Clean Architecture en Python",
    provider: "Udemy",
    completion_date: "2023-09-01",
    duration: "15h",
    certificate_url: null,
    description: "Patrones de diseño y arquitectura limpia.",
    technologies: [],
    order_index: 1,
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "cert-001",
    created_at: "2024-01-01T00:00:00",
    updated_at: null,
    title: "Java Programming",
    issuer: "Oracle Academy",
    issue_date: "2020-07-15",
    expiry_date: null,
    credential_id: "OA-2020-JP",
    credential_url:
      "https://www.linkedin.com/in/alejandrozapataf/overlay/Certifications/338095226/treasury/",
    order_index: 1,
  },
];

// ---------------------------------------------------------------------------
// CompleteCV — fixture completo (API disponible)
// ---------------------------------------------------------------------------

export const mockCompleteCV: CompleteCV = {
  profile: mockProfile,
  contact_info: mockContactInfo,
  social_networks: mockSocialNetworks,
  work_experiences: mockWorkExperiences,
  projects: mockProjects,
  skills: mockSkills,
  tools: mockTools,
  education: mockEducation,
  additional_training: mockAdditionalTraining,
  certifications: mockCertifications,
};

// ---------------------------------------------------------------------------
// CompleteCV — fixture mínimo (perfil sin datos opcionales)
// ---------------------------------------------------------------------------

export const mockMinimalCV: CompleteCV = {
  profile: {
    ...mockProfile,
    bio: null,
    location: null,
    avatar_url: null,
  },
  contact_info: null,
  social_networks: [],
  work_experiences: [],
  projects: [],
  skills: [],
  tools: [],
  education: [],
  additional_training: [],
  certifications: [],
};

// ---------------------------------------------------------------------------
// CV sin skills (para probar fallback de texto plano en cv.astro)
// ---------------------------------------------------------------------------

export const mockCVWithoutSkills: CompleteCV = {
  ...mockCompleteCV,
  skills: [],
};

// ---------------------------------------------------------------------------
// CV sin tools (para probar fallback de texto plano en cv.astro)
// ---------------------------------------------------------------------------

export const mockCVWithoutTools: CompleteCV = {
  ...mockCompleteCV,
  tools: [],
};
