// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import node from "@astrojs/node";

/**
 * Render strategy summary (issue 4.4.4):
 *
 * output: "static" (default) — pages are pre-rendered at build time unless
 * they explicitly opt out with `export const prerender = false`.
 *
 * Per-page strategy:
 *  - /          (index.astro)    → SSG  | prerender = true  — stable landing page
 *  - /cv        (cv.astro)       → SSR  | prerender = false — live data from backend API
 *  - /projects  (projects.astro) → SSG  | prerender = true  — static content, first iteration
 *  - /404       (404.astro)      → SSG  | prerender = true  — static error page
 *
 * The @astrojs/node adapter (standalone mode) handles SSR pages at runtime.
 * SSG pages are served as pre-built static HTML — no server overhead.
 */

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
  integrations: [react()],
  adapter: node({ mode: "standalone" }),
});
