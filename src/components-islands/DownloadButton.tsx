/**
 * DownloadButton.tsx
 *
 * Componente isla React que descarga el CV en PDF desde el backend.
 * Recibe la URL del PDF como prop `href` para evitar acoplamientos con la
 * configuración de la API dentro del componente.
 *
 * Comportamiento:
 *  - Realiza un fetch al endpoint indicado y crea un object URL temporal.
 *  - Dispara la descarga del archivo con el nombre "cv-alex-zapata.pdf".
 *  - Muestra un estado de carga visual (spinner + texto) mientras procesa.
 *  - Muestra un mensaje de error inline si la descarga falla.
 *
 * Estilos: inline exclusivamente (sin Tailwind). El aspecto replica el de
 * `.cv-download-btn` definido en CVLayout.astro.
 */

import { useState } from "react";

// ---------------------------------------------------------------------------
// Utilidad pura exportada — testeable en entorno node
// ---------------------------------------------------------------------------

/**
 * Descarga el PDF desde `href` y lo ofrece al usuario con `filename`.
 * Retorna void en éxito o lanza un Error con mensaje legible en fallo.
 *
 * Se exporta para permitir tests unitarios de la lógica sin DOM.
 */
export async function downloadPdf(href: string, filename: string): Promise<void> {
  const res = await fetch(href);

  if (!res.ok) {
    throw new Error(`No se pudo descargar el CV (HTTP ${res.status})`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("pdf") && !contentType.includes("octet-stream")) {
    // La respuesta no parece un PDF — podría ser un error envuelto en JSON
    throw new Error("La respuesta del servidor no es un PDF válido");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Liberar la URL de objeto una vez que el navegador inicia la descarga
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// ---------------------------------------------------------------------------
// Estilos inline
// ---------------------------------------------------------------------------

const BASE_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "7px 16px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "#ffffff",
  background: "#00507d",
  border: "none",
  cursor: "pointer",
  textTransform: "uppercase",
  transition: "background 200ms ease",
  userSelect: "none",
};

const LOADING_STYLE: React.CSSProperties = {
  ...BASE_STYLE,
  cursor: "default",
  opacity: 0.8,
};

const ERROR_STYLE: React.CSSProperties = {
  display: "block",
  marginTop: "4px",
  fontSize: "11px",
  color: "#c0392b",
  fontWeight: 500,
};

// ---------------------------------------------------------------------------
// Icono SVG — download (misma figura que en CVLayout.astro)
// ---------------------------------------------------------------------------

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// Spinner minimalista en SVG para el estado de carga
function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DownloadButtonProps {
  /** URL completa del endpoint que devuelve el PDF. */
  href: string;
  /** Texto del botón. Por defecto "Descargar CV". */
  label?: string;
  /** Nombre sugerido para el archivo descargado. */
  filename?: string;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function DownloadButton({
  href,
  label = "Descargar CV",
  filename = "cv-alex-zapata.pdf",
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await downloadPdf(href, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido al descargar el CV";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? "Descargando CV…" : label}
        style={loading ? LOADING_STYLE : BASE_STYLE}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.background = "#2a78a6";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.background = "#00507d";
          }
        }}
      >
        {loading ? <Spinner /> : <DownloadIcon />}
        {loading ? "DESCARGANDO…" : label.toUpperCase()}
      </button>
      {error && <span style={ERROR_STYLE}>{error}</span>}
    </div>
  );
}
