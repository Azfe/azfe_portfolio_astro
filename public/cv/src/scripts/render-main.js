import { getTechBadgeClass } from "./tech-colors.js";
import { formatDate, formatDateRange, formatDuration } from "./formatters.js";
import { fallbackProjects, fallbackAdditionalTraining } from "./fallback-data.js";

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTechList(technologies) {
  if (!technologies || technologies.length === 0) return "";
  const techs = technologies.flatMap((t) =>
    t.includes(",")
      ? t
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [t]
  );
  let html = `<div class="project-tech-list">`;
  for (const tech of techs) {
    html += `<span class="tech-badge ${getTechBadgeClass(tech)}">${esc(tech)}</span>`;
  }
  html += `</div>`;
  return html;
}

function renderXpItem(content) {
  return `<div class="xp-item"><div class="xp-dot"></div><div class="xp-content">${content}</div></div>`;
}

export function renderMain(data, projects, additionalTraining) {
  let html = "";

  // Header
  html += `<div class="cv-main-header">`;
  html += `<h1 class="cv-name">${esc(data.name.toUpperCase())}</h1>`;
  html += `<p class="cv-headline">${esc(data.headline.toUpperCase())}</p>`;
  if (data.bio) html += `<p class="cv-intro">${esc(data.bio)}</p>`;
  html += `</div>`;

  // Experiencia
  if (data.experiences && data.experiences.length > 0) {
    html += `<div class="cv-section"><h2 class="cv-section-title">Experiencia Reciente</h2><div class="xp-list">`;
    for (const exp of data.experiences) {
      let content = `<h3 class="xp-role">${esc(exp.role)}`;
      if (exp.company) content += `<span class="xp-company"> — ${esc(exp.company)}</span>`;
      content += `</h3>`;
      content += `<div class="xp-meta-row">`;
      if (exp.location) content += `<span class="xp-location-pill">${esc(exp.location)}</span>`;
      content += `<span class="xp-dates-pill">${formatDateRange(exp.start, exp.end, exp.isCurrent)}</span>`;
      if (exp.duration_months != null && exp.duration_months > 0) {
        content += `<span class="training-duration-pill">${formatDuration(exp.duration_months)}</span>`;
      }
      content += `</div>`;
      if (exp.description) content += `<p class="xp-desc">${esc(exp.description)}</p>`;
      content += renderTechList(exp.technologies);
      html += renderXpItem(content);
    }
    html += `</div></div>`;
  }

  // Estudios
  if (data.education && data.education.length > 0) {
    html += `<div class="cv-section"><h2 class="cv-section-title">Estudios</h2><div class="xp-list">`;
    for (const edu of data.education) {
      let content = `<h3 class="xp-role">${esc(edu.degree)}`;
      content += `<span class="xp-company-inline"> — ${esc(edu.institution)}</span></h3>`;
      content += `<div class="xp-meta-row"><span class="xp-dates-pill">${formatDateRange(edu.start, edu.end, false)}</span></div>`;
      if (edu.description) content += `<p class="xp-desc">${esc(edu.description)}</p>`;
      content += renderTechList(edu.technologies);
      html += renderXpItem(content);
    }
    html += `</div></div>`;
  }

  // Formación adicional
  const trainingItems =
    additionalTraining && additionalTraining.length > 0
      ? additionalTraining
      : fallbackAdditionalTraining;
  if (trainingItems.length > 0) {
    html += `<div class="cv-section"><h2 class="cv-section-title">Formación adicional</h2><div class="xp-list">`;
    for (const item of trainingItems) {
      let content = `<h3 class="xp-role">`;
      if (item.certificate_url) {
        content += `<a href="${esc(item.certificate_url)}" target="_blank" rel="noopener noreferrer" class="project-title-link">${esc(item.title)}</a>`;
      } else {
        content += esc(item.title);
      }
      content += `<span class="xp-company-inline"> — ${esc(item.provider)}</span></h3>`;
      content += `<div class="xp-meta-row"><span class="xp-dates-pill">${formatDate(item.completion_date)}</span>`;
      if (item.duration)
        content += `<span class="training-duration-pill">${esc(item.duration)}</span>`;
      content += `</div>`;
      if (item.description) content += `<p class="xp-desc">${esc(item.description)}</p>`;
      if (item.technologies && item.technologies.length > 0)
        content += renderTechList(item.technologies);
      html += renderXpItem(content);
    }
    html += `</div></div>`;
  }

  // Proyectos
  if (projects && projects.length > 0) {
    html += `<div class="cv-section"><h2 class="cv-section-title">Proyectos</h2><div class="xp-list">`;
    for (const project of projects) {
      let content = `<h3 class="xp-role">`;
      const projectUrl = project.live_url || project.repo_url;
      if (projectUrl) {
        content += `<a href="${esc(projectUrl)}" target="_blank" rel="noopener noreferrer" class="project-title-link">${esc(project.title)}</a>`;
      } else {
        content += esc(project.title);
      }
      if (!project.end_date) content += `<span class="project-ongoing-badge">En curso</span>`;
      content += `</h3>`;
      content += `<div class="xp-meta-row"><span class="xp-dates-pill">${formatDateRange(project.start_date, project.end_date, project.end_date === null)}</span></div>`;
      if (project.description) content += `<p class="xp-desc">${esc(project.description)}</p>`;
      content += renderTechList(project.technologies);
      html += renderXpItem(content);
    }
    html += `</div></div>`;
  } else if (fallbackProjects.length > 0) {
    html += `<div class="cv-section"><h2 class="cv-section-title">Proyectos</h2><ul class="project-list">`;
    for (const p of fallbackProjects) {
      html += `<li><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a></li>`;
    }
    html += `</ul></div>`;
  }

  return html;
}
