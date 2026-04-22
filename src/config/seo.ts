import { SITE } from "./site";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

export const SEO_DEFAULTS: SEOProps = {
  title: SITE.name,
  description: SITE.description,
  canonical: SITE.url,
  noindex: false,
};

export const PAGE_SEO: Record<string, SEOProps> = {
  home: {
    title: SITE.name,
    description: SITE.description,
  },
  cv: {
    title: "CV",
    description: `Curriculum vitae de ${SITE.author} — trayectoria profesional, habilidades y formación.`,
  },
  projects: {
    title: "Proyectos",
    description: `Proyectos de ${SITE.author} — casos reales con stack técnico, código y demos.`,
  },
  notFound: {
    title: "Página no encontrada",
    description: "La página que buscas no existe.",
    noindex: true,
  },
};
