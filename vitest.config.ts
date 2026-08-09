/**
 * Fresh vitest config for the membership-spec build (command §3.A).
 * Written new — nothing recovered from the cleanup's deleted config.
 */
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", "todelete/**", ".next/**"],
    environment: "node",
  },
});
