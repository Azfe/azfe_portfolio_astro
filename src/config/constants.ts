export const API_URL = import.meta.env.PUBLIC_API_URL as string;

export const ROUTES = {
  home: "/",
  cv: "/cv",
  projects: "/projects",
  notFound: "/404",
} as const;
