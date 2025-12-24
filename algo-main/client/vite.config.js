import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/profile": "http://localhost:5000",
      "/holdings": "http://localhost:5000",
      "/positions": "http://localhost:5000",
      "/status": "http://localhost:5000"
    }
  }
});
