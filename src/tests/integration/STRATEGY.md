# Estrategia de tests de integración de páginas

## Contexto

El stack Astro + Vitest en entorno `node` no permite importar ni renderizar
componentes `.astro` fuera del runtime de Astro. Por tanto, los tests de
integración de páginas adoptan la siguiente estrategia en dos capas:

### Capa 1 — Tests ejecutables (Vitest, entorno `node`)

Validan la **composición lógica** de cada página: los módulos TypeScript que
las páginas importan y usan son completamente testeables en Vitest.

Incluye:

- Contratos de layout: props que los layouts exponen y que las páginas pasan.
- Rutas y constantes de navegación que conectan páginas y componentes comunes.
- Metadatos SEO por página (title, description, noindex).
- Fixtures de datos mock que simulan la respuesta de la API para páginas SSR.
- Lógica de transformación de datos API → datos de presentación (cv.astro).
- Contratos de composición: que cada página importa los módulos correctos.

### Capa 2 — Tests documentados (it.todo)

Registran **qué falta validar** cuando se disponga de un renderer de Astro o
pruebas E2E con browser. Sirven como checklist para EPIC 5.2.

Incluye:

- HTML renderizado (etiquetas semánticas, estructura DOM).
- Integración visual entre layout, header, nav, footer y contenido.
- Comportamiento SSR real (datos frescos en cada request en cv.astro).
- Comportamiento de islas (ThemeToggle, ContactForm, DownloadButton).

## Convenciones de archivos

```
src/tests/integration/
├── STRATEGY.md           # Este documento
├── fixtures/
│   ├── cv.fixtures.ts    # Mock CompleteCV para tests de cv.astro
│   └── projects.fixtures.ts  # Mock de proyectos para tests de projects.astro
├── pages/
│   ├── home.integration.test.ts
│   ├── cv.integration.test.ts
│   └── projects.integration.test.ts
└── layouts/
    ├── MainLayout.integration.test.ts
    └── CVLayout.integration.test.ts
```

## Ejecución

```bash
# Todos los tests (unitarios + integración)
npm test

# Solo tests de integración
npx vitest run src/tests/integration

# Con cobertura
npm run test:coverage
```

## Qué se valida en integración vs otras capas

| Aspecto                                    | Integración | Unitario       | E2E |
| ------------------------------------------ | ----------- | -------------- | --- |
| Contratos de props entre layouts y páginas | SI          | NO             | NO  |
| Rutas y SEO por página                     | SI          | Parcial        | NO  |
| Fixtures de datos mock para SSR            | SI          | NO             | NO  |
| HTML renderizado real                      | NO          | NO             | SI  |
| Navegación interactiva en browser          | NO          | NO             | SI  |
| Islas React hidratadas                     | NO          | Lógica aislada | SI  |
| Backend real respondiendo                  | NO          | NO             | SI  |

## Dependencias

- No requiere backend real ni base de datos.
- No requiere servidor de desarrollo (`npm run dev`) en marcha.
- Compatible con CI/CD (Railway, Vercel, GitHub Actions).
