import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env file from the project root.
  // The third argument '' allows loading variables without the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Set the base path for deployment. For GitHub Pages, a relative path is needed
    // to ensure all assets (JS, CSS, images) are loaded correctly.
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // Make process.env.API_KEY available in the client code.
      // Vite performs a direct string replacement, so we need to stringify the value.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
