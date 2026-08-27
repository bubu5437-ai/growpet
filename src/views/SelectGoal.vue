<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()

const goals = ref([])
const loading = ref(true)
const submitting = ref(false)

// 取得可以選擇的年度目標清單
const getGoalOptions = async () => {
  try {
    const response = await api.get('/user/goal-options')

    goals.value = response.data.goals
  } catch (error) {
    console.log(error)

    alert('取得目標清單失敗')
  } finally {
    loading.value = false
  }
}

// 選擇年度目標
const chooseGoal = async (goalKey) => {
  if (submitting.value) return

  submitting.value = true

  try {
    await api.post('/user/select-goal', { goal: goalKey })

    alert('年度目標設定成功')

    // 新手引導完成，進大廳
    router.push('/')
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '目標設定失敗'
    )
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  getGoalOptions()
})
</script>

<template>
  <div class="select-goal">

    <h1>🎯 選擇你的年度目標</h1>

    <p v-if="loading">載入中...</p>

    <p v-else-if="goals.length === 0">目前沒有可選擇的目標</p>

    <div v-else class="goal-list">

      <div
        v-for="goal in goals"
        :key="goal.key"
        class="goal-card pixel-card"
      >

        <h3>{{ goal.label }}</h3>

        <button
          class="pixel-btn"
          :disabled="submitting"
          @click="chooseGoal(goal.key)"
        >
          選這個目標
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.select-goal {
  max-width: 900px;
  margin: auto;
  padding: 40px;
  text-align: center;
}

.select-goal h1 {
  color: var(--pixel-pink);
  font-size: 20px;
}

.goal-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.goal-card {
  padding: 20px;
  width: 200px;
}

.goal-card .pixel-btn {
  margin-top: 12px;
}
</style>
