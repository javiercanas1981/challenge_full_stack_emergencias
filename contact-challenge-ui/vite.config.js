import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

<<<<<<< HEAD
=======
// https://vitejs.dev/config/
>>>>>>> 654dee2 (Refactor components view and add redux)
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
