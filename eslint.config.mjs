// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default tseslint.config(
  // Exclusiones globales — no analizar artefactos generados
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
  },

  // Reglas base de ESLint para todos los archivos JS/TS
  eslint.configs.recommended,

  // TypeScript — archivos .ts y .tsx
  ...tseslint.configs.recommended,

  // Astro — archivos .astro con su parser específico
  ...astro.configs.recommended,

  // Archivos de configuración raíz en Node.js (*.config.mjs, *.config.js, etc.)
  {
    files: ["*.config.mjs", "*.config.js", "*.config.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Overrides para archivos TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Permitir variables _prefijadas como no usadas (patrón habitual en TS)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Desactivar la versión base en favor de la TS
      "no-unused-vars": "off",
    },
  },

  {
    files: ["**/*.astro"],
    rules: {
      // Las variables de Astro frontmatter pueden usarse solo en el template
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
