import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
const __dirname = new URL(".", import.meta.url).pathname;


const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      "@models": path.resolve(__dirname, './src/models'),
      "@pages": path.resolve(__dirname, './src/pages'),
      "@helpers": path.resolve(__dirname, './src/helpers'),
      "@hooks": path.resolve(__dirname, './src/hooks'),
      "@decorators": path.resolve(__dirname, './src/decorators'),
      "@db": path.resolve(__dirname, "./src/database"),
      "@controllers": path.resolve(__dirname, "./src/controllers"),
      "@command": path.resolve(__dirname, "./src/command"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
