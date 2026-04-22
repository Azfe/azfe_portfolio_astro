/** @type {import('@lhci/cli').LighthouseConfig} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/client",
      url: ["/", "/projects/"],
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
