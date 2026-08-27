import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 必須跟 GitHub Pages 的路徑一致，也就是 repo 名稱：https://bubu5437-ai.github.io/growpet/
  base: '/growpet/',
})
