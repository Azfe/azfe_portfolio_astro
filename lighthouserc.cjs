/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      // index.astro and cv.astro use SSR (prerender = false), so staticDistDir
      // cannot serve them. We start the @astrojs/node standalone server instead.
      startServerCommand: "node dist/server/entry.mjs",
      startServerReadyPattern: "listening on",
      url: ["http://localhost:4321/", "http://localhost:4321/projects/"],
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        // El servidor de desarrollo (@astrojs/node standalone) no comprime ni
        // hace tree-shaking. En producción (Railway/Vercel) ambas optimizaciones
        // se aplican automáticamente, por lo que estas comprobaciones no aportan
        // valor real en el entorno de CI de test.
        "unused-javascript": "off",
        "uses-text-compression": "off",
        // Auditorías informativas sin puntuación numérica — el preset les aplica minScore y devuelve NaN
        "lcp-lazy-loaded": "off",
        "non-composited-animations": "off",
        "prioritize-lcp-image": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
