import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".astro"],
    passWithNoTests: true,
    // Expone variables de entorno a import.meta.env durante los tests
    env: {
      PUBLIC_API_URL: "http://localhost:8000/api/v1",
      PUBLIC_SITE_URL: "http://localhost:4321",
      PUBLIC_SITE_NAME: "Azfe.dev",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/env.d.ts", "src/pages/**", "src/layouts/**"],
    },
  },
});
