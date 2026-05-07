import { CV_FILENAME } from "./config.js";

const SVG_DOWNLOAD = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

export function downloadPDF() {
  const btn = document.getElementById("btn-download");
  const element = document.querySelector(".cv-layout");

  if (!element) return;

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Generando PDF…";
  }

  const opt = {
    margin: [0, 0],
    filename: CV_FILENAME,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  window
    .html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `${SVG_DOWNLOAD} Descargar CV`;
      }
    })
    .catch(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `${SVG_DOWNLOAD} Descargar CV`;
      }
    });
}
