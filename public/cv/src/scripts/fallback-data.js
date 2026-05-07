export function getFallbackData() {
  return {
    name: "Alex Zapata",
    headline: "Software developer · Fullstack Developer · UI Designer",
    location: "Barcelona, ES",
    bio: "Desarrollador full‑stack con capacidad para diseñar y desarrollar aplicaciones web end‑to‑end. Combino un fuerte dominio del frontend —creación de interfaces accesibles, eficientes y orientadas a la experiencia de usuario— con experiencia en backend, APIs, bases de datos y despliegue en entornos cloud. Comprometido con la calidad del código, la optimización del rendimiento y la construcción de productos escalables y mantenibles.",
    email: "azapatafe@gmail.com",
    phone: "+34 695 462 730",
    github: "https://github.com/azfe",
    linkedin: "https://linkedin.com/in/alexzapata",
    website: "https://azfe.dev",
    certifications: [
      {
        title: "Certificaciones en Platzi",
        issuer: "Platzi",
        date: null,
        url: "https://platzi.com/p/Azfe1984/",
      },
      {
        title: "Database Programming with PL/SQL",
        issuer: "Oracle Academy",
        date: "2020-05-07",
        url: "https://www.linkedin.com/in/alejandrozapataf/overlay/Certifications/686878267/treasury/?profileId=ACoAABlTMRgB74V6i2RDqXYgvPk2UqWk9VmnCCg",
      },
      {
        title: "Java Programming",
        issuer: "Oracle Academy",
        date: "2020-07-15",
        url: "https://www.linkedin.com/in/alejandrozapataf/overlay/Certifications/338095226/treasury/?profileId=ACoAABlTMRgB74V6i2RDqXYgvPk2UqWk9VmnCCg",
      },
      {
        title: "Master en CSS",
        issuer: "Udemy",
        date: "2020-07-15",
        url: "https://www.udemy.com/certificate/UC-5d216ebf-8a7e-4ddb-80cb-57b1ab176c4b/",
      },
    ],
    experiences: [
      {
        role: "Fullstack Developer & Team Lead",
        company: "CodeCrafters Developer Community",
        start: "2025-11-10",
        end: null,
        isCurrent: true,
        duration_months: null,
        location: "Barcelona, ES",
        description:
          "Líder de equipos multidisciplinarios internacionales, especializado en la gestión del ciclo de vida de desarrollo bajo metodologías ágiles. Experto en coordinar flujos de trabajo en Git, asegurar la calidad mediante Code Reviews y promover estándares de Clean Code y mentoría técnica. Stack y Capacidades Técnicas: Backend: Arquitecturas escalables con Node.js, NestJS y PostgreSQL. Frontend: Interfaces reactivas con React y Tailwind CSS. DevOps: Automatización de despliegues con Docker y GitHub Actions. Liderazgo: Gestión de proyectos desde cero (E2E), garantizando escalabilidad e innovación en entornos colaborativos de alto rendimiento.",
        technologies: [
          "React",
          "Tailwind CSS",
          "Node.js",
          "NestJS",
          "PostgreSQL",
          "Docker",
          "GitHub Actions",
          "Git",
        ],
      },
      {
        role: "Frontend Developer",
        company: "Arttalo Tech",
        start: "2021-03-01",
        end: "2023-01-01",
        isCurrent: false,
        duration_months: 22,
        location: "Barcelona, ES",
        description:
          "1. Sistema HMI para Automóviles: Desarrollo de interfaces críticas de alta precisión con enfoque en rendimiento y adaptabilidad. 2. Intranet Corporativa: Liderazgo en el desarrollo de una biblioteca de componentes reutilizables, optimizando los tiempos de desarrollo en un 30%.",
        technologies: ["TypeScript", "React", "HTML", "CSS", "JavaScript", "Git"],
      },
    ],
    education: [
      {
        degree: "Técnico Superior en Desarrollo de Aplicaciones Web",
        institution: "FP Jesuites El Clot, Barcelona",
        start: "2016-09-01",
        end: "2020-06-01",
        description:
          "Formación orientada al desarrollo completo de aplicaciones web en entorno cliente y servidor. Programación frontend con HTML5, CSS3 y JavaScript. Desarrollo de interfaces aplicando principios de usabilidad y accesibilidad. Programación backend y lógica de negocio (Java, Php). Diseño y gestión de bases de datos relacionales (MySQL / Oracle). Creación y consumo de APIs y servicios web REST.",
        technologies: ["HTML", "CSS", "JavaScript", "Java", "PHP", "MySQL", "Git"],
      },
    ],
  };
}

export const fallbackSkillsText =
  "Python · FastAPI · TypeScript · React · MongoDB · PostgreSQL · Docker · Clean Architecture · REST APIs · pytest · Git · Linux";

export const fallbackToolsText =
  "VS Code · Docker · Git · Postman · MongoDB Atlas · GitHub Actions · Linux · Railway";

export const fallbackProjects = [
  { title: "azfe.dev Portfolio", url: "https://azfe.dev" },
  { title: "REST API Clean Arch", url: "https://github.com/azfe" },
];

export const fallbackAdditionalTraining = [
  {
    title:
      "IFCD0210 - Certificado de profesionalidad Desarrollo de Aplicaciones con tecnología web (Nivel 3)",
    provider: "The Corner (CEPP)",
    completion_date: "2025-12-16",
    duration: "6 meses",
    certificate_url: null,
    description:
      "Formación especializada en programación web en entorno cliente y servidor, orientada al desarrollo de aplicaciones modernas y escalables. Desarrollo de interfaces frontend con HTML5, CSS3, JavaScript ES6+, Tailwind CSS y React. Implementación de backend con Python, Flask, FastAPI. Uso de control de versiones con Git y colaboración con GitHub.",
    technologies: [],
  },
  {
    title: "Clean Architecture & DDD en Python",
    provider: "Udemy",
    completion_date: "2023-09-01",
    duration: "15h",
    certificate_url: null,
    description: null,
    technologies: [],
  },
];

export const fallbackLanguages = [
  { name: "Español", proficiency: "c2" },
  { name: "Inglés", proficiency: "b2" },
];
