import { fetchCV } from "./api.js";
import { getFallbackData } from "./fallback-data.js";
import { showNotice } from "./render-notice.js";
import { renderSidebar } from "./render-sidebar.js";
import { renderMain } from "./render-main.js";
import { downloadPDF } from "./pdf.js";

function normalizeData(cv) {
  if (!cv) {
    return {
      data: getFallbackData(),
      skills: [],
      tools: [],
      languages: [],
      projects: [],
      additionalTraining: [],
    };
  }
  return {
    data: {
      name: cv.profile.name,
      headline: cv.profile.headline,
      location: cv.profile.location ?? "",
      bio: cv.profile.bio ?? "",
      email: cv.contact_info?.email ?? "",
      phone: cv.contact_info?.phone ?? "",
      github: cv.contact_info?.github ?? "",
      linkedin: cv.contact_info?.linkedin ?? "",
      website: cv.contact_info?.website ?? "",
      certifications: (cv.certifications ?? []).map((c) => ({
        title: c.title,
        issuer: c.issuer,
        date: c.issue_date ?? null,
        url: c.credential_url ?? null,
      })),
      experiences: (cv.work_experiences ?? []).map((e) => ({
        role: e.role,
        company: e.company,
        start: e.start_date,
        end: e.end_date,
        isCurrent: e.end_date === null,
        duration_months: e.duration_months,
        location: e.location ?? "",
        description: e.description ?? "",
        technologies: e.technologies ?? [],
      })),
      education: (cv.education ?? []).map((e) => ({
        degree: e.degree,
        institution: e.institution,
        start: e.start_date,
        end: e.end_date,
        description: e.description ?? "",
        technologies: e.technologies ?? [],
      })),
    },
    skills: cv.skills ?? [],
    tools: cv.tools ?? [],
    languages: cv.languages ?? [],
    projects: cv.projects ?? [],
    additionalTraining: cv.additional_training ?? [],
  };
}

async function init() {
  const sidebarEl = document.getElementById("cv-sidebar");
  const mainEl = document.getElementById("cv-main");

  let cv = null;
  let apiError = null;

  try {
    cv = await fetchCV();
    if (!cv?.profile) {
      apiError = "No se encontraron datos del CV en el servidor. Mostrando datos de ejemplo.";
      cv = null;
    }
  } catch (err) {
    apiError = err.message || "Error al cargar el CV. Mostrando datos de ejemplo.";
  }

  const { data, skills, tools, languages, projects, additionalTraining } = normalizeData(cv);

  if (apiError) showNotice(apiError);

  if (sidebarEl) sidebarEl.innerHTML = renderSidebar(data, skills, tools, languages);
  if (mainEl) mainEl.innerHTML = renderMain(data, projects, additionalTraining);
}

// PDF download
document.getElementById("btn-download")?.addEventListener("click", downloadPDF);

// Scroll to top
const scrollBtn = document.getElementById("scroll-to-top-cv");
window.addEventListener(
  "scroll",
  () => {
    if (scrollBtn) scrollBtn.style.display = window.scrollY > 400 ? "flex" : "none";
  },
  { passive: true }
);
scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.addEventListener("DOMContentLoaded", init);
