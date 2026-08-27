<template>

<div class="tasks-page">

<h1>任務紀錄</h1>

<v-row>

  <!-- 左側：月曆 -->
  <v-col cols="12" md="5">
    <div class="calendar-wrap pixel-card">
      <v-date-picker
        v-model="selectedDate"
        :events="recordDates"
        show-adjacent-months
        hide-header
        width="100%"
        elevation="0"
      />
    </div>
  </v-col>

  <!-- 右側：所選日期當天的任務 -->
  <v-col cols="12" md="7">
    <v-card class="pixel-vcard">

      <v-card-title>{{ selectedDateKey }}</v-card-title>

      <v-card-text>

        <p v-if="selectedDayTasks.length === 0">
          這天沒有完成任務
        </p>

        <v-list v-else>

          <v-list-item
            v-for="dailyTask in selectedDayTasks"
            :key="dailyTask._id"
          >

            <v-list-item-title>
              {{ dailyTask.taskId?.title ?? '(任務已刪除)' }}
            </v-list-item-title>

            <v-list-item-subtitle v-if="dailyTask.taskId">
              {{ dailyTask.taskId.description }}
              ❤️ +{{ dailyTask.taskId.rewardHeart }}
            </v-list-item-subtitle>

          </v-list-item>

        </v-list>

      </v-card-text>

    </v-card>
  </v-col>

</v-row>

<!-- 累計成就統計：依目標分開顯示 -->
<v-row class="stats-row">

  <v-col
    v-for="goal in goalOptions"
    :key="goal.key"
    cols="12"
    md="6"
  >
    <v-card class="stats-card pixel-vcard">

      <v-card-title>🏆 {{ goal.label }} 成就統計</v-card-title>

      <v-card-text>

        <p v-if="achievementStatsByGoal[goal.key].length === 0">
          還沒有累積到任何紀錄
        </p>

        <v-list v-else>

          <v-list-item
            v-for="stat in achievementStatsByGoal[goal.key]"
            :key="stat.taskId"
          >
            {{ stat.title }} × {{ stat.count }}
          </v-list-item>

        </v-list>

      </v-card-text>

    </v-card>
  </v-col>

</v-row>

</div>

</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'
import { usePageBackground } from '../composables/usePageBackground'

usePageBackground()

const history = ref([])
const loading = ref(true)
const selectedDate = ref(new Date())
const goalOptions = ref([])

const getHistory = async () => {

  try {

    const response = await api.get('/daily-tasks/history')

    history.value = response.data.history

  } catch (error) {

    console.log(error)
    alert('取得任務紀錄失敗')

  } finally {

    loading.value = false

  }

}

// 取得目標清單，用來把統計拆成「減重減脂」「語言學習」兩張卡片
const getGoalOptions = async () => {

  try {

    const response = await api.get('/user/goal-options')

    goalOptions.value = response.data.goals

  } catch (error) {

    console.log(error)

  }

}

onMounted(() => {
  getHistory()
  getGoalOptions()
})

// 把 Date 物件轉成跟後端一樣的 YYYY-MM-DD 格式
// 用「本地時間」而不是 toISOString()，避免時區換日造成日期差一天
const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 有完成紀錄的日期清單，給月曆標記小圓點用
const recordDates = computed(() =>
  history.value.map(day => day.date)
)

const selectedDateKey = computed(() =>
  toDateKey(selectedDate.value)
)

// 所選日期當天完成的任務
const selectedDayTasks = computed(() => {

  const day = history.value.find(
    day => day.date === selectedDateKey.value
  )

  return day ? day.tasks : []

})

// 累計成就統計：先依目標（goalKey）分組，各自再依任務分組計算完成次數
// 統計範圍就是 history 本身（後端 /daily-tasks/history 已經依 RECORD_RETENTION_DAYS 過濾過期紀錄了，這裡不用再篩一次）
const achievementStatsByGoal = computed(() => {

  const countMapByGoal = {}

  history.value.forEach(day => {

    day.tasks.forEach(dailyTask => {

      const task = dailyTask.taskId
      const goalKey = dailyTask.goalKey

      if (!countMapByGoal[goalKey]) {
        countMapByGoal[goalKey] = {}
      }

      // 任務已被刪除（例如重新 seed 過）時，歸類成同一組，不要整筆跳過不計
      const key = task ? task._id : 'deleted'
      const title = task ? task.title : '(任務已刪除)'

      if (!countMapByGoal[goalKey][key]) {
        countMapByGoal[goalKey][key] = { taskId: key, title, count: 0 }
      }

      countMapByGoal[goalKey][key].count++

    })

  })

  // 每個目標各自由高到低排序，完成越多次排越前面
  const result = {}

  goalOptions.value.forEach(goal => {
    const stats = countMapByGoal[goal.key] || {}
    result[goal.key] = Object.values(stats).sort((a, b) => b.count - a.count)
  })

  return result

})

</script>


<style scoped>
.tasks-page {
  max-width: 900px;
  margin: auto;
  padding: 40px;
}

.tasks-page h1 {
  text-align: center;
  color: var(--pixel-pink);
  font-size: 20px;
  margin-bottom: 24px;
}

.stats-row {
  margin-top: 24px;
}

.calendar-wrap {
  overflow: hidden;
  padding: 4px;
}

.calendar-wrap :deep(.v-date-picker) {
  box-shadow: none;
}

/* 已完成任務的日期：不要 Vuetify 預設的小圓點，改成日期數字後面壓一個淡灰色圓底 */
.calendar-wrap :deep(.v-date-picker-month__events) {
  display: none;
}

.calendar-wrap :deep(.v-date-picker-month__day:has(.v-date-picker-month__events) .v-date-picker-month__day-btn) {
  background-color: #dcdcdc !important;
}

/* 「今天」用 Vuetify 加的 aria-current="date" 判斷，圓底要比一般已完成日期更深，才看得出是今天 */
.calendar-wrap :deep(.v-date-picker-month__day:has(.v-date-picker-month__events) .v-date-picker-month__day-btn[aria-current="date"]) {
  background-color: #a3a3a3 !important;
}

/* 蓋掉 Vuetify v-card 預設的圓角/陰影，改成像素風的粗框+硬陰影 */
.pixel-vcard {
  border-radius: 0 !important;
  border: var(--pixel-border) solid var(--pixel-ink) !important;
  box-shadow: var(--pixel-shadow) !important;
}

.pixel-vcard :deep(.v-card-title) {
  font-family: var(--font-pixel);
  font-size: 14px;
  white-space: normal;
}
</style>
