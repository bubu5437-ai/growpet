import { watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

// 有幾個頁面正在使用背景（不是每個頁面各自管理一份，是全站共用同一個背景）
// 切換頁面時，Vue Router 會先掛載新頁面、才卸載舊頁面，
// 如果每個頁面各自「卸載時就移除 class」，會把新頁面剛加上的 class 誤刪掉，
// 所以要用計數器判斷「真的沒有任何頁面在用背景了」才移除
let activeCount = 0

// 頁面掛載時幫 <body> 加上「使用者目前裝備的背景主題」class，
// 全部使用背景的頁面都離開後才移除；如果使用者在背包頁換了背景，畫面也會立刻跟著換
export function usePageBackground() {

  const userStore = useUserStore()
  const { backgroundClass } = storeToRefs(userStore)

  // 第一次呼叫時才去問後端，之後每個頁面共用同一份，不會重複打 API
  userStore.ensureBackgroundLoaded()

  activeCount++

  const stopWatch = watch(
    backgroundClass,
    (newClass, oldClass) => {
      if (oldClass) {
        document.body.classList.remove(oldClass)
      }
      document.body.classList.add(newClass)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stopWatch()

    activeCount--

    if (activeCount === 0) {
      document.body.classList.remove(backgroundClass.value)
    }
  })

}
