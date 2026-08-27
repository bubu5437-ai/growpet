import axios from 'axios'
import { useUserStore } from '../stores/user'
import { API_BASE } from './config'

// 記錄「正在換發 Token」的 Promise，避免同時觸發多次換發請求
let refreshPromise = null

const api = axios.create({
  baseURL: API_BASE,
  // 讓瀏覽器自動帶上 Refresh Token 的 cookie
  withCredentials: true
})

// 請求攔截器：自動夾帶 Access Token
api.interceptors.request.use(
  async (config) => {

    // 如果換發正在進行中，先等它完成（換發本身這支請求要排除，不然會卡住）
    if (refreshPromise && config.url !== '/user/refresh') {
      try {
        await refreshPromise
      } catch {
        // 換發失敗的錯誤交給回應攔截器處理，這裡不用管
      }
    }

    const userStore = useUserStore()

    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    return config

  },

  (error) => {

    return Promise.reject(error)

  }

)

// 回應攔截器：Access Token 過期（401）時，用 Refresh Token 換一組新的再重試一次
api.interceptors.response.use(

  (res) => res,

  async (error) => {

    const originalRequest = error.config
    const userStore = useUserStore()

    const isAuthApi =
      originalRequest?.url === '/user/login' ||
      originalRequest?.url === '/user/refresh'

    if (error.response?.status === 401 && !isAuthApi && !originalRequest._retry) {

      originalRequest._retry = true

      // 如果目前沒有正在進行中的換發請求，就發送一個
      if (!refreshPromise) {
        refreshPromise = userStore.restoreSession()
      }

      try {

        const success = await refreshPromise

        if (!success) {
          throw error
        }

        // 用新的 Access Token 重試原始請求
        originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`

        return api(originalRequest)

      } catch {

        throw error

      } finally {

        refreshPromise = null

      }

    }

    return Promise.reject(error)

  }

)

export default api
