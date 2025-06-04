import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio-tester/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.loca.lt'
    ]
  }
})
