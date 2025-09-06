import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwind(), // ✅ Tailwind v4 PostCSS plugin
        autoprefixer(), // ✅ Autoprefixer
      ],
    },
  },
});
