import { getSkillChipClass } from "./tech-colors.js";
import { formatDate } from "./formatters.js";
import { fallbackSkillsText, fallbackToolsText, fallbackLanguages } from "./fallback-data.js";

const CEFR_LABEL = {
  a1: "A1 — Principiante",
  a2: "A2 — Básico",
  b1: "B1 — Intermedio",
  b2: "B2 — Intermedio alto",
  c1: "C1 — Avanzado",
  c2: "C2 — Nativo / Maestría",
};

const SVG_PHONE = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const SVG_LOCATION = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg>`;
const SVG_EMAIL = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const SVG_GITHUB = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
const SVG_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
const SVG_WEBSITE = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const SVG_EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderSidebar(data, skills, tools, languages) {
  let html = "";

  // Contacto
  html += `<div class="sidebar-section"><h4 class="sidebar-heading">Contacto</h4><ul class="contact-list">`;
  if (data.phone) html += `<li>${SVG_PHONE}<span>${esc(data.phone)}</span></li>`;
  if (data.location) html += `<li>${SVG_LOCATION}<span>${esc(data.location)}</span></li>`;
  if (data.email)
    html += `<li>${SVG_EMAIL}<a href="mailto:${esc(data.email)}">${esc(data.email)}</a></li>`;
  html += `</ul></div>`;

  // Redes
  html += `<div class="sidebar-section"><h4 class="sidebar-heading">Redes</h4><ul class="contact-list">`;
  if (data.github)
    html += `<li>${SVG_GITHUB}<a href="${esc(data.github)}" target="_blank" rel="noopener noreferrer">GitHub</a></li>`;
  if (data.linkedin)
    html += `<li>${SVG_LINKEDIN}<a href="${esc(data.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>`;
  if (data.website)
    html += `<li>${SVG_WEBSITE}<a href="${esc(data.website)}" target="_blank" rel="noopener noreferrer">azfe.dev</a></li>`;
  html += `</ul></div>`;

  // Certificaciones
  if (data.certifications && data.certifications.length > 0) {
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Certificaciones</h4><div class="cert-list">`;
    for (const cert of data.certifications) {
      if (cert.url) {
        html += `<a href="${esc(cert.url)}" class="cert-card cert-card--link" target="_blank" rel="noopener noreferrer">`;
        html += `<p class="cert-title">${esc(cert.title)}</p>`;
        html += `<p class="cert-issuer">${esc(cert.issuer)}</p>`;
        html += `<div class="cert-footer">`;
        if (cert.date) html += `<span class="cert-date">${formatDate(cert.date)}</span>`;
        html += `<span class="cert-link">Ver credencial ${SVG_EXTERNAL}</span>`;
        html += `</div></a>`;
      } else {
        html += `<div class="cert-card">`;
        html += `<p class="cert-title">${esc(cert.title)}</p>`;
        html += `<p class="cert-issuer">${esc(cert.issuer)}</p>`;
        if (cert.date) html += `<p class="cert-date">${formatDate(cert.date)}</p>`;
        html += `</div>`;
      }
    }
    html += `</div></div>`;
  }

  // Skills
  if (skills && skills.length > 0) {
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Habilidades</h4><div class="tag-row">`;
    for (const skill of skills) {
      html += `<span class="skill-tag ${getSkillChipClass(skill.level)}">${esc(skill.name)}</span>`;
    }
    html += `</div></div>`;
  } else {
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Skills</h4><p class="sidebar-skills">${esc(fallbackSkillsText)}</p></div>`;
  }

  // Herramientas
  if (tools && tools.length > 0) {
    const byCategory = tools.reduce((acc, tool) => {
      const cat = tool.category ?? "";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tool);
      return acc;
    }, {});
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Herramientas</h4><div class="tools-group-list">`;
    for (const [cat, catTools] of Object.entries(byCategory)) {
      html += `<div class="tools-group">`;
      if (cat) html += `<p class="tools-category-label">${esc(cat)}</p>`;
      html += `<div class="tools-tag-row">`;
      for (const tool of catTools) html += `<span class="tools-tag">${esc(tool.name)}</span>`;
      html += `</div></div>`;
    }
    html += `</div></div>`;
  } else {
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Herramientas</h4><p class="sidebar-skills">${esc(fallbackToolsText)}</p></div>`;
  }

  // Idiomas
  const displayLangs =
    languages && languages.length > 0
      ? languages.map((l) => ({
          name: l.name,
          label: l.proficiency ? (CEFR_LABEL[l.proficiency] ?? l.proficiency.toUpperCase()) : null,
        }))
      : fallbackLanguages.map((l) => ({
          name: l.name,
          label: CEFR_LABEL[l.proficiency] ?? l.proficiency.toUpperCase(),
        }));

  if (displayLangs.length > 0) {
    html += `<div class="sidebar-section"><h4 class="sidebar-heading">Idiomas</h4><ul class="lang-list">`;
    for (const lang of displayLangs) {
      html += `<li class="lang-item"><span class="lang-name">${esc(lang.name)}</span>`;
      if (lang.label) html += `<span class="lang-level">${esc(lang.label)}</span>`;
      html += `</li>`;
    }
    html += `</ul></div>`;
  }

  return html;
}
