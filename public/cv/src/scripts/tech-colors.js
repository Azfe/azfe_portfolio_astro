const TECH_COLORS = {
  python: "c2",
  fastapi: "c2",
  typescript: "c1",
  react: "c1",
  astro: "c5",
  tailwind: "c6",
  tailwindcss: "c6",
  "tailwind css": "c6",
  mongodb: "c2",
  docker: "c6",
  pytest: "c3",
  javascript: "c1",
  html: "c3",
  css: "c1",
  vite: "c5",
  vitest: "c5",
  git: "c3",
  github: "c3",
  "git + github": "c3",
  "git+github": "c3",
  nestjs: "c5",
  postgresql: "c6",
  "github actions": "c3",
  node: "c2",
  "node.js": "c2",
  java: "c4",
  php: "c5",
  mysql: "c6",
  flask: "c2",
  linux: "c4",
};

export function getTechBadgeClass(tech) {
  return `badge--${TECH_COLORS[tech.toLowerCase()] ?? "c1"}`;
}

export function getSkillChipClass(level) {
  const map = {
    expert: "chip-c1",
    advanced: "chip-c2",
    intermediate: "chip-c5",
    basic: "chip-c6",
  };
  return map[level] ?? "chip-neutral";
}
