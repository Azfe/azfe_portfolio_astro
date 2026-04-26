/**
 * Fixtures de datos para tests de integración de la página Proyectos
 * (projects.astro).
 *
 * La página usa datos estáticos/mock en esta iteración (no consume la API
 * directamente). Los fixtures aquí reflejan la interfaz `MockProject` que
 * projects.astro define internamente y son usados en los tests para validar
 * la estructura de datos sin necesidad de importar el archivo .astro.
 */

// ---------------------------------------------------------------------------
// Interfaz local (refleja MockProject de projects.astro)
// ---------------------------------------------------------------------------

export interface MockProject {
  subtitle: string;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  liveUrl: string | null;
  repoUrl: string | null;
}

// ---------------------------------------------------------------------------
// Fixture: lista de proyectos estáticos de la página Proyectos
// Mantener sincronizado con src/pages/projects.astro
// ---------------------------------------------------------------------------

export const mockStaticProjects: MockProject[] = [
  {
    subtitle: "Portfolio · Proyecto personal",
    title: "azfe.dev — Portfolio profesional",
    description:
      "Portfolio y CV online construido con Astro + FastAPI. Backend con Clean Architecture, MongoDB y generacion de PDF. Frontend SSG/SSR desplegado en Vercel.",
    tags: ["Astro", "FastAPI", "MongoDB", "Python", "Tailwind"],
    gradient: "linear-gradient(135deg, #0e2a5c 0%, #1e6bf7 100%)",
    liveUrl: "https://azfe.dev",
    repoUrl: "https://github.com/azfe/portfolio",
  },
  {
    subtitle: "API · Backend project",
    title: "REST API con Clean Architecture",
    description:
      "API REST modular con FastAPI, arquitectura limpia por capas (Domain, Application, Infrastructure), tests unitarios e integracion con pytest.",
    tags: ["FastAPI", "Python", "MongoDB", "pytest", "Docker"],
    gradient: "linear-gradient(135deg, #064e2e 0%, #0f8a4a 100%)",
    liveUrl: null,
    repoUrl: "https://github.com/azfe",
  },
  {
    subtitle: "CLI tool · Utility",
    title: "Dev CLI utilities",
    description:
      "Conjunto de utilidades de linea de comandos para automatizar tareas de desarrollo. Gestion de entornos, scaffolding y helpers de proyecto.",
    tags: ["Python", "Typer", "Rich", "Click"],
    gradient: "linear-gradient(135deg, #5a0a1e 0%, #c23a52 100%)",
    liveUrl: null,
    repoUrl: "https://github.com/azfe",
  },
  {
    subtitle: "Automation · Script",
    title: "Data pipeline automatizado",
    description:
      "Pipeline ETL para procesamiento de datos con Python. Extraccion, transformacion y carga de datos con manejo de errores y logging estructurado.",
    tags: ["Python", "Pandas", "SQLAlchemy", "Logging"],
    gradient: "linear-gradient(135deg, #2d1a6e 0%, #6a3acf 100%)",
    liveUrl: null,
    repoUrl: "https://github.com/azfe",
  },
];

// ---------------------------------------------------------------------------
// Fixture: proyecto con live URL para validar CTAs
// ---------------------------------------------------------------------------

export const projectWithLiveUrl = mockStaticProjects.find((p) => p.liveUrl !== null)!;

// ---------------------------------------------------------------------------
// Fixture: proyecto sin live URL (solo repo)
// ---------------------------------------------------------------------------

export const projectWithRepoOnly = mockStaticProjects.find(
  (p) => p.liveUrl === null && p.repoUrl !== null
)!;
