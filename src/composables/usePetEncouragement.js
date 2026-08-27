import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '../api/axios'

// 自動彈出的時間區間：3~5 分鐘
const MIN_INTERVAL_MS = 3 * 60 * 1000
const MAX_INTERVAL_MS = 5 * 60 * 1000

// 對話框顯示多久後自動淡出
const AUTO_HIDE_MS = 9000

// 點擊節流：避免使用者狂點造成過多請求
const CLICK_THROTTLE_MS = 500

// 管理寵物「加油詞句對話框」的計時器、抽句、顯示狀態
export function usePetEncouragement() {

  const message = ref('')
  const visible = ref(false)

  let lastId = null
  let autoTimer = null
  let hideTimer = null
  let lastClickTime = 0

  const randomInterval = () =>
    MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)

  const scheduleHide = () => {

    if (hideTimer) {
      clearTimeout(hideTimer)
    }

    hideTimer = setTimeout(() => {
      visible.value = false
    }, AUTO_HIDE_MS)

  }

  const scheduleNextAuto = () => {

    if (autoTimer) {
      clearTimeout(autoTimer)
    }

    autoTimer = setTimeout(async () => {
      await showNewMessage()
      scheduleNextAuto()
    }, randomInterval())

  }

  // 抽一句新的加油詞句並顯示，同時重置自動淡出的計時
  const showNewMessage = async () => {

    try {

      const response = await api.get('/encouragements/random', {
        params: lastId ? { exclude: lastId } : {}
      })

      const encouragement = response.data.encouragement

      if (!encouragement) return

      message.value = encouragement.content
      lastId = encouragement._id
      visible.value = true

      scheduleHide()

    } catch (error) {

      console.log(error)

    }

  }

  // 使用者點擊寵物或對話框：立即換一句，並節流避免狂點
  const triggerNewMessage = () => {

    const now = Date.now()

    if (now - lastClickTime < CLICK_THROTTLE_MS) return

    lastClickTime = now

    showNewMessage()

  }

  onMounted(() => {
    scheduleNextAuto()
  })

  onBeforeUnmount(() => {

    if (autoTimer) clearTimeout(autoTimer)
    if (hideTimer) clearTimeout(hideTimer)

  })

  return {
    message,
    visible,
    triggerNewMessage
  }

}
