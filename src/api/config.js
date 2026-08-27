// 後端網址：線上版由 GitHub Actions build 時帶入 VITE_API_URL（Render 後端網址），
// 本機開發沒設定就 fallback 到 localhost:3000。
// 圖片等靜態資源用 API_BASE 拼路徑，API 請求用 src/api/axios.js。
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
