<style scoped>
.dashboard {
  max-width: 900px;
  margin: auto;
  padding: 40px;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 30px;
  color: var(--pixel-pink);
  font-size: 22px;
}

.title-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.card {
  background: var(--pixel-surface);
  border: var(--pixel-border) solid var(--pixel-ink);
  box-shadow: var(--pixel-shadow);
  border-radius: 0;
  padding: 20px;
  margin-bottom: 20px;
}

.card h2 {
  font-size: 14px;
  margin: 0 0 14px;
}

/* 寵物卡片：仿小卡/遊戲卡的卡框 + 名牌
   注意：不能設 overflow:hidden，不然加油詞句對話框彈出時會被裁掉，
   圓角外觀改讓內層（照片區）自己用 border-radius 裁切就好 */
.pet-card-frame {
  position: relative;
  background: var(--pixel-pink);
  border: var(--pixel-border) solid var(--pixel-ink);
  border-radius: 12px;
  padding: 12px 10px 10px;
  margin-bottom: 14px;
  box-shadow: var(--pixel-shadow);
}

.pet-card-nameplate {
  position: relative;
  z-index: 2;
  width: fit-content;
  margin: 0 auto 10px;
  background: #fff;
  color: var(--pixel-ink);
  border: 3px solid var(--pixel-ink);
  border-radius: 8px;
  padding: 6px 22px;
  font-family: var(--font-pixel);
  font-size: 14px;
  text-align: center;
  box-shadow: var(--pixel-shadow-sm);
}

/* 外層不裁切，避免加油詞句對話框彈出時被卡住；
   棋盤格透明底紋改畫在 ::before 偽元素上，自己裁圓角就好。
   用 aspect-ratio 固定畫布比例（之後寵物場景背景圖要用），
   不能再用「內容撐高度」的做法，不然場景圖會被拉伸變形 */
.pet-card-photo {
  position: relative;
  aspect-ratio: 7 / 8;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 30px;
}

.pet-card-photo::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 2px solid var(--pixel-ink);
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  background-image:
    linear-gradient(45deg, #ffe9f2 25%, transparent 25%),
    linear-gradient(-45deg, #ffe9f2 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ffe9f2 75%),
    linear-gradient(-45deg, transparent 75%, #ffe9f2 75%);
  background-size: 50px 50px;
  background-repeat: repeat;
  background-position: 0 0, 0 25px, 25px -25px, -25px 0px;
}

/* 裝備寵物場景時蓋在棋盤格底紋（::before）上面；
   還沒有美術圖時先用底色 + emoji 佔位，之後補圖直接顯示圖片就好，不用再改樣式 */
.pet-card-scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 2px solid var(--pixel-ink);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--pixel-bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.pet-card-scene-icon {
  font-size: 64px;
}

.pet-card-photo .pet-name {
  position: relative;
  z-index: 1;
}

.pet-card-photo .pet-avatar :deep(img) {
  max-width: 175px;
}

.pet-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pet-avatar {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.pet-avatar :deep(img) {
  max-width: 120px;
}

.equip-icon {
  position: absolute;
  font-size: 28px;
  left: 50%;
  transform: translateX(-50%);
}

.equip-hat {
  top: -18px;
}

.equip-shoes {
  bottom: -10px;
  font-size: 20px;
}

.equip-accessory {
  top: 45%;
  font-size: 20px;
}

.goal-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.goal-tab {
  padding: 6px 12px;
  font-size: 11px;
  background: var(--pixel-grey);
  color: var(--pixel-ink);
}

.goal-tab--active {
  background: var(--pixel-pink);
  color: white;
}

.task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.task-card-header h2 {
  margin: 0;
}

.add-task-btn {
  padding: 4px 12px;
  font-size: 16px;
  line-height: 1;
}

.add-task-dialog {
  margin-bottom: 0;
}

.add-task-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed var(--pixel-ink);
  padding: 15px 0;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item h3 {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
}

.reward-badge {
  background: var(--pixel-yellow);
}

button {
  font-family: var(--font-pixel);
  font-size: 11px;
  padding: 10px 16px;
  cursor: pointer;
  border: var(--pixel-border) solid var(--pixel-ink);
  border-radius: 0;
  background: var(--pixel-pink);
  color: white;
  box-shadow: var(--pixel-shadow-sm);
  transition: transform 0.05s ease, box-shadow 0.05s ease;
}

button:hover:not(:disabled) {
  filter: brightness(1.1);
}

button:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 var(--pixel-ink);
}

button:disabled {
  background: var(--pixel-grey);
  color: #766f60;
  cursor: not-allowed;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'
import { API_BASE } from '../api/config'
import PetAnimator from '../components/PetAnimator.vue'
import EncouragementBubble from '../components/EncouragementBubble.vue'
import HabitTracker from '../components/HabitTracker.vue'
import { usePetEncouragement } from '../composables/usePetEncouragement'
import { usePageBackground } from '../composables/usePageBackground'
import logo from '../assets/logo.png'

usePageBackground()


const user = ref(null)
const pet = ref(null)
const tasks = ref([])
const equipped = ref({ hat: null, shoes: null, accessory: null, petScene: null })

// 寵物卡片場景背景：還沒有美術圖時只給底色，靠 icon 佔位
const petSceneStyle = computed(() => {
  if (equipped.value.petScene?.image) {
    return { backgroundImage: `url(${API_BASE}${equipped.value.petScene.image})` }
  }

  return {}
})
const goalOptions = ref([])
const switchingGoal = ref(false)

// 新增自訂任務用的小視窗
const showAddTask = ref(false)
const savingTask = ref(false)
const newTaskTitle = ref('')
const newTaskReward = ref(1)

// 寵物加油詞句對話框：每隔一段時間自動彈出，點擊寵物或對話框可立即換一句
const {
  message: encouragementMessage,
  visible: encouragementVisible,
  triggerNewMessage
} = usePetEncouragement()

// 取得 Dashboard 資料
const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard')

    console.log(response.data)

    user.value = response.data.user
    pet.value = response.data.pet
    tasks.value = response.data.tasks
    equipped.value = response.data.equipped
  } catch (error) {
    console.log(error)
    alert('取得資料失敗')
  }
}

// 取得可選的年度目標清單（大廳目標 tab 用）
const getGoalOptions = async () => {
  try {
    const response = await api.get('/user/goal-options')

    goalOptions.value = response.data.goals
  } catch (error) {
    console.log(error)
  }
}

// 切換到已經加入過的目標
const switchGoal = async (goalKey) => {
  if (switchingGoal.value || goalKey === user.value?.activeGoal) return

  switchingGoal.value = true

  try {
    await api.post('/user/switch-goal', { goal: goalKey })
    await getDashboard()
  } catch (error) {
    console.log(error)
    alert(error.response?.data?.message || '目標切換失敗')
  } finally {
    switchingGoal.value = false
  }
}

// 加入還沒選過的目標，加入後自動切換過去
const joinGoal = async (goalKey) => {
  if (switchingGoal.value) return

  switchingGoal.value = true

  try {
    await api.post('/user/join-goal', { goal: goalKey })
    await getDashboard()
  } catch (error) {
    console.log(error)
    alert(error.response?.data?.message || '目標加入失敗')
  } finally {
    switchingGoal.value = false
  }
}

// 完成任務 / 取消完成任務
const toggleTask = async (task) => {
  try {
    const url = task.completed
      ? '/daily-tasks/uncomplete'
      : '/daily-tasks/complete'

    await api.patch(url, {
      dailyTaskId: task._id
    })

    // 重新取得 Dashboard
    await getDashboard()
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message ||
      (task.completed ? '取消完成失敗' : '完成任務失敗')
    )
  }
}

// 開啟／關閉「新增自訂任務」小視窗
const openAddTask = () => {
  newTaskTitle.value = ''
  newTaskReward.value = 1
  showAddTask.value = true
}

const closeAddTask = () => {
  showAddTask.value = false
}

// 新增自訂任務：寫進資料庫後，之後每天隨機抽任務時就有機會抽到
// 不會馬上出現在今天的任務清單（今天的 3 筆已經抽過了）
const saveNewTask = async () => {
  if (!newTaskTitle.value.trim()) {
    alert('請輸入任務名稱')
    return
  }

  savingTask.value = true

  try {
    await api.post('/tasks/custom', {
      title: newTaskTitle.value,
      rewardHeart: newTaskReward.value
    })

    closeAddTask()

    alert('已新增任務，之後每天隨機抽任務時都有機會抽到它！')
  } catch (error) {
    console.log(error)

    alert(error.response?.data?.message || '新增任務失敗')
  } finally {
    savingTask.value = false
  }
}

onMounted(() => {
  getDashboard()
  getGoalOptions()
})
</script>

<template>
  <div class="dashboard">

    <h1>
      <img
        :src="logo"
        alt="GrowPet"
        class="title-logo"
      />
      GrowPet
    </h1>

    <v-row>

      <!-- 左側：玩家資訊 + 寵物資訊 -->
      <v-col cols="12" md="5">

        <!-- 使用者資訊 -->
        <div v-if="user" class="card">

          <h2>玩家：{{ user.account }}</h2>

          <p>
            ❤️ 愛心：
            <strong>{{ user.heart }}</strong>
          </p>

          <p>
            🎯 年度目標：
            <strong>{{ user.activeGoalLabel }}</strong>
          </p>

          <div class="goal-tabs">

            <button
              v-for="goal in goalOptions"
              :key="goal.key"
              type="button"
              class="goal-tab"
              :class="{ 'goal-tab--active': goal.key === user.activeGoal }"
              :disabled="switchingGoal"
              @click="user.goals.includes(goal.key) ? switchGoal(goal.key) : joinGoal(goal.key)"
            >
              {{ user.goals.includes(goal.key) ? goal.label : `+ 加入 ${goal.label}` }}
            </button>

          </div>

        </div>

        <!-- 寵物資訊：仿遊戲卡/小卡樣式 -->
        <div
          v-if="pet"
          class="pet-card-frame"
        >

          <div class="pet-card-nameplate">
            {{ pet.name }}
          </div>

          <div class="pet-card-photo">

            <!-- 寵物場景：沒裝備時維持原本的棋盤格底紋（::before），裝備後蓋在上面 -->
            <div
              v-if="equipped.petScene"
              class="pet-card-scene"
              :style="petSceneStyle"
            >
              <span
                v-if="!equipped.petScene.image"
                class="pet-card-scene-icon"
              >
                {{ equipped.petScene.icon }}
              </span>
            </div>

            <h3 class="pet-name">
              <span class="pet-avatar" @click="triggerNewMessage">
                <EncouragementBubble
                  :message="encouragementMessage"
                  :visible="encouragementVisible"
                />

                <PetAnimator
                  :pet="pet"
                  :equipped-hat="equipped.hat?.image ? equipped.hat : null"
                  :equipped-accessory="equipped.accessory?.image ? equipped.accessory : null"
                />

                <!-- 帽子還沒有美術圖時，先用 icon 疊加代替 -->
                <span
                  v-if="equipped.hat && !equipped.hat.image"
                  class="equip-icon equip-hat"
                >
                  {{ equipped.hat.icon }}
                </span>

                <span
                  v-if="equipped.shoes"
                  class="equip-icon equip-shoes"
                >
                  {{ equipped.shoes.icon }}
                </span>

                <!-- 配件還沒有美術圖時，先用 icon 疊加代替 -->
                <span
                  v-if="equipped.accessory && !equipped.accessory.image"
                  class="equip-icon equip-accessory"
                >
                  {{ equipped.accessory.icon }}
                </span>
              </span>
            </h3>
          </div>

        </div>

      </v-col>

      <!-- 右側：今日任務 -->
      <v-col cols="12" md="7">

        <div class="card">

          <div class="task-card-header">
            <h2>📅 今日任務</h2>

            <button
              class="add-task-btn"
              type="button"
              title="新增自訂任務"
              @click="openAddTask"
            >
              +
            </button>
          </div>

          <ul class="task-list">

            <li
              v-for="task in tasks"
              :key="task._id"
              class="task-item"
            >

              <div>

                <h3>
                  {{ task.taskId?.title }}
                </h3>

                <p>
                  {{ task.taskId?.description }}
                </p>

                <span class="pixel-badge reward-badge">
                  ❤️ +{{ task.taskId?.rewardHeart }}
                </span>

              </div>

              <button
                @click="toggleTask(task)"
              >
                {{ task.completed ? '取消完成' : '完成' }}
              </button>

            </li>

          </ul>

        </div>

        <!-- 每日習慣（獨立功能，打勾不會產生愛心） -->
        <HabitTracker />

      </v-col>

    </v-row>

    <!-- 新增自訂任務小視窗 -->
    <v-dialog
      v-model="showAddTask"
      max-width="400"
    >
      <div class="card add-task-dialog">

        <h2>新增自訂任務</h2>

        <v-text-field
          v-model="newTaskTitle"
          label="任務名稱"
          placeholder="任務將加入未來隨機任務中"
          maxlength="30"
          counter
          :disabled="savingTask"
        />

        <v-slider
          v-model="newTaskReward"
          label="愛心獎勵"
          :min="1"
          :max="10"
          :step="1"
          thumb-label
          :disabled="savingTask"
        />

        <div class="add-task-actions">
          <button
            type="button"
            :disabled="savingTask"
            @click="closeAddTask"
          >
            取消
          </button>

          <button
            type="button"
            :disabled="savingTask"
            @click="saveNewTask"
          >
            儲存
          </button>
        </div>

      </div>
    </v-dialog>

  </div>
</template>

