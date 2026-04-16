/** @type {import('@lhci/cli').LighthouseConfig} */
export default {
  ci: {
    collect: {
      // Sirve el build estatico de Astro directamente
      staticDistDir: "./dist",
      // URLs a auditar
      url: ["/", "/cv"],
      // Tres ejecuciones por URL para promediar ruido
      numberOfRuns: 3,
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        // Bloquea si hay recursos de primera carga demasiado pesados
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
      },
    },
    upload: {
      // Sube resultados al servidor publico temporal de LHCI
      target: "lhci",
      serverBaseUrl: "https://lighthouse-ci.appspot.com/",
    },
  },
};
