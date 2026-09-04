<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useUserStore } from '../stores/user'
import { usePageBackground } from '../composables/usePageBackground'
import AchievementBadge from '../components/AchievementBadge.vue'

usePageBackground()

const router = useRouter()
const userStore = useUserStore()

const user = ref(null)
const loading = ref(true)

const achievements = ref([])
const achievementGroups = ref([])
const achievementsLoading = ref(true)

// 已解鎖 / 總數，顯示在標題旁
const unlockedCount = computed(
  () => achievements.value.filter(badge => badge.unlocked).length
)

// 依分組把徽章整理成 [{ key, label, badges: [] }]，畫面上分區顯示
const groupedAchievements = computed(() =>
  achievementGroups.value
    .map(group => ({
      ...group,
      badges: achievements.value.filter(badge => badge.group === group.key)
    }))
    .filter(group => group.badges.length > 0)
)

// 取得目前登入使用者資料
// 不管記憶體裡有沒有 Access Token 都直接呼叫：
// 沒有登入過（或沒有有效的 Refresh Token）就會失敗，axios 攔截器已經試過換發了
const getProfile = async () => {
  try {
    const response = await api.get('/user/profile')

    user.value = response.data.user
  } catch (error) {
    console.log(error)

    user.value = null
  } finally {
    loading.value = false
  }
}

// 取得成就徽章清單（後端每次呼叫都會重新評估，達門檻就自動解鎖）
const getAchievements = async () => {
  try {
    const response = await api.get('/user/achievements')

    achievements.value = response.data.achievements
    achievementGroups.value = response.data.groups
  } catch (error) {
    console.log(error)

    achievements.value = []
    achievementGroups.value = []
  } finally {
    achievementsLoading.value = false
  }
}

// 登出
const logout = async () => {
  await userStore.logout()

  user.value = null

  alert('已登出')

  router.push('/login')
}

onMounted(() => {
  getProfile()
  getAchievements()
})
</script>

<template>
  <div class="user-page">

    <h1>使用者</h1>

    <!-- 載入中 -->
    <p v-if="loading">載入中...</p>

    <!-- 已登入 -->
    <template v-else-if="user">

      <div class="card pixel-card">

        <h2>帳號：{{ user.account }}</h2>

        <p>❤️ 愛心：<strong>{{ user.heart }}</strong></p>

        <p v-if="user.activeGoal">🎯 目前目標：{{ user.activeGoalLabel }}</p>

        <button class="pixel-btn warn" @click="logout">登出</button>

      </div>

      <!-- 成就徽章牆 -->
      <section class="achievements">

        <div class="achievements-head">
          <h2>成就徽章</h2>
          <span
            v-if="!achievementsLoading && achievements.length"
            class="pixel-badge"
          >{{ unlockedCount }} / {{ achievements.length }}</span>
        </div>

        <p v-if="achievementsLoading">載入中...</p>

        <p v-else-if="!achievements.length">目前沒有成就資料</p>

        <div
          v-for="group in groupedAchievements"
          :key="group.key"
          class="achievement-group"
        >
          <h3>{{ group.label }}</h3>

          <div class="badge-grid">
            <AchievementBadge
              v-for="badge in group.badges"
              :key="badge.key"
              :badge="badge"
            />
          </div>
        </div>

      </section>

    </template>

    <!-- 未登入 -->
    <div v-else class="card pixel-card">

      <p>尚未登入</p>

      <button class="pixel-btn" @click="router.push('/login')">前往登入</button>

    </div>

  </div>
</template>

<style scoped>
.user-page {
  max-width: 900px;
  margin: auto;
  padding: 40px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--pixel-pink);
  font-size: 20px;
}

.card {
  padding: 20px;
  margin-bottom: 20px;
}

.card .pixel-btn {
  margin-top: 8px;
}

.achievements {
  margin-top: 30px;
}

.achievements-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.achievements-head h2 {
  font-size: 16px;
}

.achievement-group {
  margin-top: 18px;
}

.achievement-group h3 {
  font-size: 12px;
  margin-bottom: 10px;
}

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
