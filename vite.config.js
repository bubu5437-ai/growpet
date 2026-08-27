import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 必須跟 GitHub Pages 的路徑一致：https://bubu5437-ai.github.io/frontend-front/
  // 之前寫 /growpet/ 但 repo 叫 frontend-front，導致部署後 JS/CSS 全部 404、畫面空白
  base: '/frontend-front/',
})
