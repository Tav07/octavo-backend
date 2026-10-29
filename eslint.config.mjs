import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/infrastructure/generated/**", // código generado por prisma generate
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // La resolución de módulos y globals los valida TypeScript, no ESLint
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
);