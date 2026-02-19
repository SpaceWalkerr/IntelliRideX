import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-charts": ["chart.js", "react-chartjs-2"],
          "vendor-motion": ["framer-motion"],
          "vendor-radix":  ["@radix-ui/react-tooltip", "@radix-ui/react-dialog",
                            "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
        },
      },
    },
  },
});
