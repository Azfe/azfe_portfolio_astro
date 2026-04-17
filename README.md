# azfe.dev — Frontend

Portfolio profesional de Alex Zapata. Construido con Astro 6, Tailwind CSS v4 y TypeScript strict.

## Requisitos

- Node.js >= 22.12.0
- npm

## Instalacion

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta los valores:

```bash
cp .env.example .env.local
```

| Variable           | Descripcion                     | Ejemplo                        |
| ------------------ | ------------------------------- | ------------------------------ |
| `PUBLIC_API_URL`   | URL base de la API del backend  | `http://localhost:8000/api/v1` |
| `PUBLIC_SITE_URL`  | URL del sitio (sin barra final) | `http://localhost:4321`        |
| `PUBLIC_SITE_NAME` | Nombre del sitio                | `Azfe.dev`                     |

## Comandos

Ejecutar desde la raiz del proyecto (`portfolio_frontend/`):

| Comando               | Accion                                            |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Servidor de desarrollo en `http://localhost:4321` |
| `npm run build`       | Build de produccion en `./dist/`                  |
| `npm run preview`     | Vista previa del build en local                   |
| `npm run astro check` | Verificacion de tipos TypeScript                  |

## Estructura

```
src/
├── pages/                  # Rutas del sitio
│   ├── index.astro         # Landing page (SSG)
│   ├── cv.astro            # Pagina del CV (SSR, consume la API)
│   └── 404.astro           # Pagina de error
├── layouts/                # Plantillas base
│   ├── BaseLayout.astro    # HTML base, head, meta
│   └── MainLayout.astro    # BaseLayout + Header + Footer
├── components/
│   ├── common/             # Header, Footer, Navigation
│   ├── home/               # Hero
│   ├── cv/                 # ProfileCard, ExperienceList, SkillList
│   └── ui/                 # Button, Card, Badge, SectionTitle
├── components-islands/     # Componentes React con hidratacion en cliente
├── services/api/           # Cliente HTTP y servicios por recurso
├── types/                  # Tipos TypeScript (fuente de verdad)
├── config/                 # Constantes, SEO, datos del sitio
├── utils/                  # Formateadores, manejo de errores, fechas
├── styles/                 # CSS global, variables, animaciones
└── lib/                    # Utilidades compartidas de bajo nivel
```

## Arquitectura de islas

Astro elimina JavaScript del cliente por defecto. Solo los componentes en `src/components-islands/` se hidratan:

```astro
<ContactForm client:visible />
<DownloadButton client:load />
```

Los componentes `.astro` en `src/components/` no generan JS en cliente.

## Stack

- **Astro 6** — framework principal, SSG por defecto
- **Tailwind CSS v4** — integrado via `@tailwindcss/vite`
- **TypeScript** — strict mode
- **React** — solo para componentes isla interactivos

## Despliegue

- Frontend: Vercel o Netlify
- Backend: Railway (`PUBLIC_API_URL` apunta a la URL de Railway en produccion)
