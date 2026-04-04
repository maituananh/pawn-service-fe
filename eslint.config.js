import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist", "node_modules", ".agents"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            eslintConfigPrettier
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
                project: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "no-undef": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { vars: "all" }],
            "react-hooks/exhaustive-deps": "warn",
            "no-console": ["warn", { allow: ["info", "warn", "error"] }],
            "no-return-await": "off",
            "@typescript-eslint/return-await": "error",
            "prettier/prettier": [
                "warn",
                {
                    printWidth: 120,
                    useTabs: false,
                    tabWidth: 4,
                    trailingComma: "none",
                    semi: true,
                    singleQuote: false,
                    bracketSpacing: true,
                    arrowParens: "always",
                    jsxSingleQuote: false,
                    bracketSameLine: false,
                    endOfLine: "lf"
                }
            ]
        }
    }
]);
