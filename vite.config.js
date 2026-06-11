import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ★1. これを追加！

// https://vite.dev/config/
export default defineConfig({
  base: '/wows-app/',
  plugins: [
    react(),
    tailwindcss() // ★2. これを追加！
  ],
})