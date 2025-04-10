import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Configure the dev server
    port: 5173, // Keep the frontend port as configured
    proxy: {
      // Proxy API requests to the backend
      // '/api' is the prefix for your backend routes
      "/api": {
        target: "http://localhost:3000", // Your Express server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Optional: Set to false if backend is not HTTPS
        // Optional: rewrite path if needed, e.g., remove /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
