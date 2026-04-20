import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "src/setupTests.ts",
                "src/vite-env.d.ts",
                "src/env.d.ts",
                "eslint.config.js",
                "global.d.ts",
                "vite.config.js"
            ]
        }
    }
});
