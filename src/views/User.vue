<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useUserStore } from '../stores/user'
import { usePageBackground } from '../composables/usePageBackground'

usePageBackground()

const router = useRouter()
const userStore = useUserStore()

const user = ref(null)
const loading = ref(true)

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

// 登出
const logout = async () => {
  await userStore.logout()

  user.value = null

  alert('已登出')

  router.push('/login')
}

onMounted(() => {
  getProfile()
})
</script>

<template>
  <div class="user-page">

    <h1>使用者</h1>

    <!-- 載入中 -->
    <p v-if="loading">載入中...</p>

    <!-- 已登入 -->
    <div v-else-if="user" class="card pixel-card">

      <h2>帳號：{{ user.account }}</h2>

      <p>❤️ 愛心：<strong>{{ user.heart }}</strong></p>

      <p v-if="user.activeGoal">🎯 目前目標：{{ user.activeGoalLabel }}</p>

      <button class="pixel-btn warn" @click="logout">登出</button>

    </div>

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
</style>
