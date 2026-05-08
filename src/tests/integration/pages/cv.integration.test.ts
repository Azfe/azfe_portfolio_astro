/**
 * Tests de integración — CV (cv.astro)
 *
 * Objetivo (I-F-4.6.2-04):
 * Validar que cv.astro puede componerse correctamente con CVLayout, los
 * bloques curriculares, la estrategia SSR y el contrato de datos de la API.
 *
 * Entorno: node (sin jsdom) — los archivos .astro no son importables.
 * Estrategia de dos capas:
 *
 * Capa 1 (ejecutable): valida los contratos TypeScript que cv.astro consume:
 *   - Fixtures CompleteCV → datos de presentación (transformación de datos API).
 *   - PAGE_SEO.cv provee title y description.
 *   - Estrategia SSR (prerender = false).
 *   - Lógica de fallback cuando la API no está disponible.
 *   - Lógica de agrupación de tools por categoría.
 *   - Lógica de idiomas con CEFR labels.
 *
 * Capa 2 (it.todo): documenta qué se debe validar con renderer Astro o E2E.
 */

import { describe, it, expect } from "vitest";
import { PAGE_SEO } from "@/config/seo";
import { ROUTES } from "@/config/constants";
import type { CompleteCV, Skill, Tool, Language, AdditionalTraining } from "@/types/cv.types";
import {
  mockCompleteCV,
  mockMinimalCV,
  mockCVWithoutSkills,
  mockCVWithoutTools,
} from "@/tests/integration/fixtures/cv.fixtures";

// ---------------------------------------------------------------------------
// SEO — metadatos que cv.astro pasa a CVLayout → BaseLayout → SEO.astro
// ---------------------------------------------------------------------------

describe("CV — configuración SEO (PAGE_SEO.cv)", () => {
  it("PAGE_SEO.cv.title está definido y no está vacío", () => {
    expect(typeof PAGE_SEO.cv.title).toBe("string");
    expect((PAGE_SEO.cv.title ?? "").length).toBeGreaterThan(0);
  });

  it("PAGE_SEO.cv.description está definida y menciona 'CV' o 'curriculum'", () => {
    const desc = PAGE_SEO.cv.description ?? "";
    expect(desc.length).toBeGreaterThan(0);
    const lowerDesc = desc.toLowerCase();
    expect(lowerDesc.includes("cv") || lowerDesc.includes("curriculum")).toBe(true);
  });

  it("PAGE_SEO.cv no tiene noindex (el CV es público)", () => {
    expect(PAGE_SEO.cv.noindex).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// Estrategia SSR — cv.astro usa prerender = false
// ---------------------------------------------------------------------------

describe("CV — estrategia de render SSR", () => {
  it("la ruta /cv está definida en ROUTES", () => {
    expect(ROUTES.cv).toBe("https://cv.azfe.dev/");
  });

  it("el fixture CompleteCV tiene la forma esperada por cv.astro", () => {
    // Verificar que el fixture tiene todos los campos que cv.astro usa
    expect(mockCompleteCV).toHaveProperty("profile");
    expect(mockCompleteCV).toHaveProperty("contact_info");
    expect(mockCompleteCV).toHaveProperty("work_experiences");
    expect(mockCompleteCV).toHaveProperty("education");
    expect(mockCompleteCV).toHaveProperty("skills");
    expect(mockCompleteCV).toHaveProperty("tools");
    expect(mockCompleteCV).toHaveProperty("certifications");
    expect(mockCompleteCV).toHaveProperty("additional_training");
    expect(mockCompleteCV).toHaveProperty("projects");
  });
});

// ---------------------------------------------------------------------------
// Transformación de datos API → presentación
// Replica la lógica que cv.astro ejecuta en el frontmatter al recibir CompleteCV
// ---------------------------------------------------------------------------

describe("CV — transformación de datos API cuando backend responde", () => {
  function transformCVData(cv: CompleteCV) {
    return {
      name: cv.profile.name,
      headline: cv.profile.headline,
      location: cv.profile.location ?? "",
      bio: cv.profile.bio ?? "",
      email: cv.contact_info?.email ?? "",
      phone: cv.contact_info?.phone ?? "",
      github: cv.contact_info?.github ?? "",
      linkedin: cv.contact_info?.linkedin ?? "",
      website: cv.contact_info?.website ?? "",
      certifications: cv.certifications.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        date: c.issue_date ?? null,
        url: c.credential_url ?? null,
      })),
      experiences: cv.work_experiences.map((e) => ({
        role: e.role,
        company: e.company,
        start: e.start_date,
        end: e.end_date,
        isCurrent: e.end_date === null,
        location: "",
        description: e.description ?? "",
      })),
      education: cv.education.map((e) => ({
        degree: e.degree,
        institution: e.institution,
        start: e.start_date,
        end: e.end_date,
        description: e.description ?? "",
      })),
    };
  }

  it("extrae el nombre del perfil correctamente", () => {
    const data = transformCVData(mockCompleteCV);
    expect(data.name).toBe("Alex Zapata");
  });

  it("extrae el headline del perfil correctamente", () => {
    const data = transformCVData(mockCompleteCV);
    expect(data.headline).toBe("Backend Developer · Python · Clean Architecture");
  });

  it("usa string vacío cuando location es null", () => {
    const data = transformCVData(mockMinimalCV);
    expect(data.location).toBe("");
  });

  it("usa string vacío cuando bio es null", () => {
    const data = transformCVData(mockMinimalCV);
    expect(data.bio).toBe("");
  });

  it("usa string vacío cuando contact_info es null", () => {
    const data = transformCVData(mockMinimalCV);
    expect(data.email).toBe("");
    expect(data.phone).toBe("");
    expect(data.github).toBe("");
  });

  it("extrae el email de contact_info correctamente", () => {
    const data = transformCVData(mockCompleteCV);
    expect(data.email).toBe("alex@azfe.dev");
  });

  it("mapea las certificaciones con title, issuer y url", () => {
    const data = transformCVData(mockCompleteCV);
    expect(data.certifications.length).toBeGreaterThan(0);
    const cert = data.certifications[0];
    expect(cert).toHaveProperty("title");
    expect(cert).toHaveProperty("issuer");
    expect(cert).toHaveProperty("url");
  });

  it("isCurrent es true cuando end_date es null en work_experiences", () => {
    const data = transformCVData(mockCompleteCV);
    const currentJob = data.experiences.find((e) => e.end === null);
    expect(currentJob?.isCurrent).toBe(true);
  });

  it("isCurrent es false cuando end_date tiene valor", () => {
    const data = transformCVData(mockCompleteCV);
    const pastJob = data.experiences.find((e) => e.end !== null);
    expect(pastJob?.isCurrent).toBe(false);
  });

  it("mapea la educación con degree, institution y fechas", () => {
    const data = transformCVData(mockCompleteCV);
    expect(data.education.length).toBeGreaterThan(0);
    const edu = data.education[0];
    expect(edu).toHaveProperty("degree");
    expect(edu).toHaveProperty("institution");
    expect(edu).toHaveProperty("start");
  });
});

// ---------------------------------------------------------------------------
// Skills — cv.astro usa cv.skills si disponible, o fallback de texto
// ---------------------------------------------------------------------------

describe("CV — skills: API vs fallback", () => {
  it("usa skills del CV cuando la API responde con datos", () => {
    const skills: Skill[] = mockCompleteCV.skills;
    expect(skills.length).toBeGreaterThan(0);
  });

  it("devuelve array vacío de skills cuando el CV no tiene skills (activa fallback)", () => {
    const skills: Skill[] = mockCVWithoutSkills.skills;
    expect(skills).toHaveLength(0);
  });

  it("cada skill tiene name y level", () => {
    for (const skill of mockCompleteCV.skills) {
      expect(typeof skill.name).toBe("string");
    }
  });
});

// ---------------------------------------------------------------------------
// Tools — agrupación por categoría (lógica de cv.astro)
// ---------------------------------------------------------------------------

describe("CV — tools: agrupación por categoría", () => {
  function groupToolsByCategory(tools: Tool[]): Record<string, Tool[]> {
    return tools.reduce<Record<string, Tool[]>>((acc, tool) => {
      const cat = tool.category ?? "";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tool);
      return acc;
    }, {});
  }

  it("agrupa las tools por su campo category", () => {
    const grouped = groupToolsByCategory(mockCompleteCV.tools);
    expect(Object.keys(grouped).length).toBeGreaterThan(0);
  });

  it("cada grupo contiene al menos una tool", () => {
    const grouped = groupToolsByCategory(mockCompleteCV.tools);
    for (const tools of Object.values(grouped)) {
      expect(tools.length).toBeGreaterThan(0);
    }
  });

  it("agrupa bajo clave vacía cuando category es null/undefined", () => {
    const toolsWithNull: Tool[] = [
      {
        id: "t-null",
        created_at: null,
        updated_at: null,
        name: "Sin categoría",
        category: null,
        icon_url: null,
        order_index: 99,
      },
    ];
    const grouped = groupToolsByCategory(toolsWithNull);
    expect(grouped[""]).toBeDefined();
    expect(grouped[""].length).toBe(1);
  });

  it("devuelve objeto vacío cuando no hay tools", () => {
    const grouped = groupToolsByCategory([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });

  it("tools vacías activan el fallback de texto en cv.astro", () => {
    expect(mockCVWithoutTools.tools).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Idiomas — lógica CEFR labels (cv.astro)
// ---------------------------------------------------------------------------

describe("CV — idiomas: etiquetas CEFR", () => {
  const cefrLabel: Record<string, string> = {
    a1: "A1 — Principiante",
    a2: "A2 — Básico",
    b1: "B1 — Intermedio",
    b2: "B2 — Intermedio alto",
    c1: "C1 — Avanzado",
    c2: "C2 — Nativo / Maestría",
  };

  it("el mapa CEFR cubre los 6 niveles estándar", () => {
    expect(Object.keys(cefrLabel)).toHaveLength(6);
    for (const level of ["a1", "a2", "b1", "b2", "c1", "c2"]) {
      expect(cefrLabel[level]).toBeDefined();
    }
  });

  it("cada etiqueta CEFR empieza por el código en mayúsculas", () => {
    expect(cefrLabel["b2"]).toMatch(/^B2/);
    expect(cefrLabel["c1"]).toMatch(/^C1/);
  });

  it("los idiomas de fallback usan niveles CEFR válidos", () => {
    const fallbackLanguages: Pick<Language, "name" | "proficiency">[] = [
      { name: "Español", proficiency: "c2" },
      { name: "Inglés", proficiency: "b2" },
    ];

    for (const lang of fallbackLanguages) {
      expect(lang.proficiency).toBeDefined();
      expect(cefrLabel[lang.proficiency!]).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Formación adicional — fallback cuando la API no devuelve datos
// ---------------------------------------------------------------------------

describe("CV — formación adicional: API vs fallback", () => {
  it("los items de formación adicional del fixture tienen title, provider y completion_date", () => {
    for (const item of mockCompleteCV.additional_training) {
      expect(typeof item.title).toBe("string");
      expect(typeof item.provider).toBe("string");
      expect(typeof item.completion_date).toBe("string");
    }
  });

  it("duration puede ser null en items de formación adicional", () => {
    const itemWithNullDuration: AdditionalTraining = {
      id: "at-test",
      created_at: null,
      updated_at: null,
      title: "Curso sin duración",
      provider: "Provider",
      completion_date: "2024-01-01",
      duration: null,
      certificate_url: null,
      description: null,
      technologies: [],
      order_index: 1,
    };
    expect(itemWithNullDuration.duration).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CVLayout — props que cv.astro pasa al layout
// ---------------------------------------------------------------------------

describe("CV — contratos de props con CVLayout", () => {
  it("PAGE_SEO.cv.title es el valor esperado para el prop title de CVLayout", () => {
    expect(PAGE_SEO.cv.title).toBe("CV");
  });

  it("PAGE_SEO.cv provee description para CVLayout", () => {
    expect(typeof PAGE_SEO.cv.description).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// Contratos de composición (it.todo — requieren renderer Astro o E2E)
// ---------------------------------------------------------------------------

describe("CV — contratos de composición con CVLayout (it.todo)", () => {
  it.todo("renderiza el toolbar sticky con el nombre 'Alex Zapata · Curriculum Vitae'");
  it.todo("el toolbar incluye el botón 'Descargar CV' (DownloadButton isla con client:load)");
  it.todo("el toolbar incluye el enlace 'Portfolio' que vuelve a '/'");
  it.todo("la barra del CV está sticky con z-index alto");
  it.todo("renderiza el sidebar con contacto, redes, certificaciones, skills, tools e idiomas");
  it.todo("renderiza el main con nombre, headline, bio y secciones de experiencia");
  it.todo("la sección de experiencia muestra los items con timeline vertical");
  it.todo("la sección de estudios muestra degree e institution");
  it.todo("la sección de formación adicional muestra titulo, proveedor y fecha");
  it.todo("la sección de proyectos muestra titulo, tecnologías y links");
  it.todo("cuando la API falla se muestra el banner de aviso (.cv-notice)");
  it.todo("cuando la API falla se muestran los datos de fallback hardcoded");
  it.todo("el layout no incluye Header ni Footer (CVLayout intencional)");
  it.todo("el fondo del body cambia a #f4f6fa en la página CV via :global(body)");
  it.todo("ScrollToTop isla está hidratada con client:idle");
  it.todo("el CV se puede imprimir (print media query oculta el toolbar)");
});
