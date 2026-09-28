import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        login: "index.html",
        register: "register.html",
        dashboard: "dashboard.html",
      },
    },
  },
});
