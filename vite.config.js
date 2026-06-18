import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // ★GitHub Actions環境ならPages用のパス、Vercelやローカルならルートパス（/）に自動で切り替える魔法
  base: process.env.GITHUB_ACTIONS ? '/wows-app/' : '/',
  plugins: [
    react(),
    tailwindcss()
  ],
})