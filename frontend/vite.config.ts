import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy /students requests to Spring Boot backend during development
      '/students': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
