import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/librojuego-abismo-appv5/",  // 👈 nombre EXACTO del repo
});
