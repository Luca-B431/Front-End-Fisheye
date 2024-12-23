import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Entrée principale
        photographer: "photographer.html", // Autre page HTML
      },
    },
  },
});
