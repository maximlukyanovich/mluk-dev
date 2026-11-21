import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    // scripts/ keeps its own node:test suite (`pnpm test:scripts`).
    include: ["{app,features,shared}/**/*.test.{ts,tsx}", "proxy.test.ts"],
  },
});
