import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { parseApiBaseUrl } from "./src/apiConfiguration.js";

export default defineConfig(({ mode }) => {
  const environment = process.env;
  const apiBaseUrl = environment.VITE_API_BASE_URL?.trim();

  if (mode === "production") {
    parseApiBaseUrl(apiBaseUrl, true);
  }

  return {
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
    },
  };
});
