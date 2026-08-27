import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export const useUserStore = defineStore('user', () => {
  // Access Token 只存在記憶體（Pinia），不寫入 localStorage
  // 重新整理網頁後會消失，靠 restoreSession() 用 Refresh Token 換回來
  const accessToken = ref('')

  const isLoggedIn = computed(() => !!accessToken.value)

  // 目前套用的背景主題 class（預設粉色點點），供 usePageBackground 全站共用
  const backgroundClass = ref('bg-pink-dots')
  const backgroundLoaded = ref(false)

  // 第一次載入頁面時，跟後端問一次目前裝備的背景主題（之後就不用再問）
  const ensureBackgroundLoaded = async () => {
    if (backgroundLoaded.value) return

    try {
      const res = await api.get('/user/profile')
      backgroundClass.value = res.data.user.equippedBackground?.cssClass || 'bg-pink-dots'
    } catch {
      // 拿不到就先維持預設粉色點點，不影響頁面正常顯示
    } finally {
      backgroundLoaded.value = true
    }
  }

  // 在背包頁切換/取消穿戴背景主題後，直接更新，不用重新問後端
  const setBackgroundClass = (cssClass) => {
    backgroundClass.value = cssClass || 'bg-pink-dots'
    backgroundLoaded.value = true
  }

  // 帳號密碼登入
  const login = async ({ account, password }) => {
    const res = await api.post('/user/login', { account, password })
    accessToken.value = res.data.result.accessToken
  }

  // 帳號密碼註冊（註冊成功後不會自動登入，還要再呼叫 login）
  const register = async ({ account, password }) => {
    const res = await api.post('/user/register', { account, password })
    return res.data
  }

  // 用瀏覽器的 Refresh Token（cookie）換一組新的 Access Token
  // 用來在剛打開網站、或 Access Token 過期時恢復登入狀態
  const restoreSession = async () => {
    try {
      const res = await api.post('/user/refresh')
      accessToken.value = res.data.result.accessToken
      return true
    } catch {
      accessToken.value = ''
      return false
    }
  }

  // 登出：請後端刪除 Refresh Token，並清空前端狀態
  const logout = async () => {
    try {
      await api.post('/user/logout')
    } finally {
      accessToken.value = ''
      // 換帳號時要重新問一次背景主題，不然會沿用上一個帳號的設定
      backgroundClass.value = 'bg-pink-dots'
      backgroundLoaded.value = false
    }
  }

  return {
    accessToken,
    isLoggedIn,
    backgroundClass,
    login,
    register,
    restoreSession,
    logout,
    ensureBackgroundLoaded,
    setBackgroundClass
  }
})
