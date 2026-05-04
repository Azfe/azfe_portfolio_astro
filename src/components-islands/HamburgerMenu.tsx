import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/config/navigation";

const STYLE_ID = "hamburger-menu-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .hamburger-wrapper {
      position: relative;
    }

    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--radius-pill);
      color: var(--ink-2);
      transition: background var(--transition), color var(--transition);
    }

    .hamburger-btn:hover {
      background: var(--soft);
      color: var(--accent-color);
    }

    .hamburger-dropdown {
      position: absolute;
      top: calc(100% + 8px);      
      min-width: 210px;
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow-card);
      z-index: 210;
      padding: 6px;
      list-style: none;
    }

    .hamburger-dropdown ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .hamburger-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--ink-2);
      text-decoration: none;
      transition: background var(--transition), color var(--transition);
    }

    .hamburger-link:hover {
      background: var(--soft);
      color: var(--accent-color);
    }

    .hamburger-link span:first-child {
      display: flex;
      align-items: center;
      color: var(--ink-3);
    }

    .hamburger-cv-link {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      padding: 9px 12px;
      border-top: 1px solid var(--line);
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
      color: #1557d6;
      text-decoration: none;
      background: var(--accent-color-soft);
      transition: background var(--transition);
    }

    .hamburger-cv-link:hover {
      background: #d4e5ff;
    }
  `;
  document.head.appendChild(style);
}

interface Props {
  links: NavLink[];
  cvHref: string;
}

export default function HamburgerMenu({ links, cvHref }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function toggle() {
    setOpen((prev) => !prev);
  }

  return (
    <div ref={wrapperRef} className="hamburger-wrapper" style={{ position: "relative" }}>
      <button
        className="hamburger-btn"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="hamburger-dropdown animate-fade-in"
          role="navigation"
          aria-label="Menú móvil"
        >
          <ul>
            {links.map(({ label, href, icon }) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="hamburger-link">
                  <span dangerouslySetInnerHTML={{ __html: icon }} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={cvHref} onClick={() => setOpen(false)} className="hamburger-cv-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Ver / Descargar CV
          </a>
        </div>
      )}
    </div>
  );
}
