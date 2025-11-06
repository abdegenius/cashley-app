// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Inherit Next.js recommended rules (including TypeScript)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Global ignores
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  // **Disable the rule globally**
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",

      "prefer-const": "warn",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-unused-vars": "off",
      "no-empty": "off",

      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
