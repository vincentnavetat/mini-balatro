import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test" || process.env.VITEST;
  
  return {
    plugins: [
      tailwindcss(),
      // Only apply reactRouter plugin when not in test mode
      ...(isTest ? [] : [reactRouter()]),
      tsconfigPaths(),
    ],
    test: {
      globals: true,
      environment: "jsdom", // Default to jsdom for React components
      setupFiles: ["./tests/setup.ts"],
      // Use node for .ts test files (unit tests without DOM)
      environmentMatchGlobs: [
        ["**/*.test.ts", "node"],
        ["**/*.test.tsx", "jsdom"],
      ],
    },
  };
});
