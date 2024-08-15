import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://image.astralaxis.tech', // Your backend API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Adjust this based on your API structure
      },
      '/panel': {
        target: 'https://panel.astralaxis.one', // Another API or service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/panel/, ''), // Adjust this based on your service structure
      },
      '/server': {
        target: 'https://servers.astralaxis.one', // Another API or service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/panel/, ''), // Adjust this based on your service structure
      }
    }
  }
});




