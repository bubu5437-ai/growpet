<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api/axios'
import WeekdayPicker from './WeekdayPicker.vue'

const todayHabits = ref([])
const allHabits = ref([])
const loading = ref(true)
const showManage = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editingHabitId = ref(null)

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

const form = reactive({
  title: '',
  note: '',
  repeatDays: []
})

const resetForm = () => {
  form.title = ''
  form.note = ''
  form.repeatDays = []
  editingHabitId.value = null
}

// 取得今天要做的習慣
const getTodayHabits = async () => {
  try {
    const response = await api.get('/habits/today')

    todayHabits.value = response.data.habits
  } catch (error) {
    console.log(error)

    alert('取得今日習慣失敗')
  } finally {
    loading.value = false
  }
}

// 取得所有習慣（管理用，含未排今天的）
const getAllHabits = async () => {
  try {
    const response = await api.get('/habits')

    allHabits.value = response.data.habits
  } catch (error) {
    console.log(error)

    alert('取得習慣清單失敗')
  }
}

// 展開／收合「管理習慣」區塊
const toggleManage = async () => {
  showManage.value = !showManage.value

  if (showManage.value) {
    await getAllHabits()
  }
}

const openCreateForm = () => {
  resetForm()
  showForm.value = true
}

const openEditForm = (habit) => {
  editingHabitId.value = habit._id
  form.title = habit.title
  form.note = habit.note
  form.repeatDays = [...habit.repeatDays]
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

// 新增或更新習慣
const saveHabit = async () => {
  if (!form.title.trim()) {
    alert('請輸入習慣名稱')
    return
  }

  if (form.repeatDays.length === 0) {
    alert('請至少選擇一天')
    return
  }

  saving.value = true

  try {
    const payload = {
      title: form.title,
      note: form.note,
      repeatDays: form.repeatDays
    }

    if (editingHabitId.value) {
      await api.patch(`/habits/${editingHabitId.value}`, payload)
    } else {
      await api.post('/habits', payload)
    }

    closeForm()

    await getTodayHabits()

    if (showManage.value) {
      await getAllHabits()
    }
  } catch (error) {
    console.log(error)

    alert(error.response?.data?.message || '儲存失敗')
  } finally {
    saving.value = false
  }
}

// 刪除習慣（後端做停用，保留歷史紀錄）
const removeHabit = async (habit) => {
  if (!confirm(`確定要刪除「${habit.title}」嗎？`)) return

  try {
    await api.delete(`/habits/${habit._id}`)

    await getTodayHabits()
    await getAllHabits()
  } catch (error) {
    console.log(error)

    alert('刪除失敗')
  }
}

// 打勾／取消打勾今天的完成狀態
// 注意：習慣打勾，不觸發愛心獎勵，這裡不會呼叫任何任務系統的 API
const toggleToday = async (habit) => {
  try {
    await api.patch(`/habits/${habit._id}/today`, {
      completed: !habit.completed
    })

    await getTodayHabits()
  } catch (error) {
    console.log(error)

    alert('更新失敗')
  }
}

const repeatDaysText = (repeatDays) => {
  if (repeatDays.length === 7) return '每天'

  return [...repeatDays]
    .sort((a, b) => a - b)
    .map(day => weekdayLabels[day])
    .join('、')
}

onMounted(() => {
  getTodayHabits()
})
</script>

<template>
  <div class="card pixel-card habit-tracker">

    <div class="habit-header">
      <h2>🔁 每日習慣</h2>

      <button class="pixel-btn secondary link-btn" @click="toggleManage">
        {{ showManage ? '收合管理' : '管理習慣' }}
      </button>
    </div>

    <p v-if="loading">載入中...</p>

    <p v-else-if="todayHabits.length === 0" class="empty-text">
      今天沒有安排習慣，休息一下吧
    </p>

    <ul v-else class="habit-list">

      <li
        v-for="habit in todayHabits"
        :key="habit._id"
        class="habit-item"
      >

        <label class="habit-content">
          <input
            type="checkbox"
            :checked="habit.completed"
            @change="toggleToday(habit)"
          />

          <span class="habit-text">
            <span :class="{ done: habit.completed }">{{ habit.title }}</span>
            <small v-if="habit.note" class="habit-note">{{ habit.note }}</small>
          </span>
        </label>

      </li>

    </ul>

    <button class="pixel-btn add-btn" @click="openCreateForm">+ 新增習慣</button>

    <!-- 管理所有習慣（含未排今天的） -->
    <div v-if="showManage" class="manage-panel">

      <h3>所有習慣</h3>

      <p v-if="allHabits.length === 0">目前沒有習慣</p>

      <ul v-else class="habit-list">

        <li
          v-for="habit in allHabits"
          :key="habit._id"
          class="habit-item"
        >

          <span class="habit-content">
            {{ habit.title }}
            <small class="habit-days">（{{ repeatDaysText(habit.repeatDays) }}）</small>
          </span>

          <span class="manage-actions">
            <button class="pixel-btn secondary link-btn" @click="openEditForm(habit)">編輯</button>
            <button class="pixel-btn warn link-btn" @click="removeHabit(habit)">刪除</button>
          </span>

        </li>

      </ul>

    </div>

    <!-- 新增／編輯習慣表單 -->
    <div v-if="showForm" class="form-overlay" @click.self="closeForm">
      <div class="form-modal pixel-card">

        <h3>{{ editingHabitId ? '編輯習慣' : '新增習慣' }}</h3>

        <label class="form-field">
          習慣名稱
          <input v-model="form.title" class="pixel-input" placeholder="例如：喝 2000cc 的水" />
        </label>

        <label class="form-field">
          備註（可選）
          <input v-model="form.note" class="pixel-input" placeholder="補充說明" />
        </label>

        <div class="form-field">
          每週執行日
          <WeekdayPicker v-model="form.repeatDays" />
        </div>

        <div class="form-actions">
          <button class="pixel-btn" :disabled="saving" @click="saveHabit">儲存</button>
          <button class="pixel-btn secondary" @click="closeForm">取消</button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  margin-bottom: 20px;
}

.habit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-text {
  color: #9e9e9e;
  padding: 10px 0;
}

.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed var(--pixel-ink);
  padding: 10px 0;
}

.habit-item:last-child {
  border-bottom: none;
}

.habit-content {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.habit-text {
  display: flex;
  flex-direction: column;
}

.habit-note {
  color: #9e9e9e;
}

.habit-content .done {
  text-decoration: line-through;
  color: #9e9e9e;
}

.add-btn {
  width: 100%;
  margin-top: 12px;
}

.link-btn {
  font-size: 11px;
  padding: 6px 10px;
}

.manage-panel {
  margin-top: 16px;
  border-top: 2px dashed var(--pixel-ink);
  padding-top: 12px;
}

.manage-panel h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.manage-actions {
  display: flex;
  gap: 4px;
}

.habit-days {
  color: #9e9e9e;
}

.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.form-modal {
  padding: 24px;
  width: 90%;
  max-width: 360px;
}

.form-modal h3 {
  margin-top: 0;
}

.form-field {
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
  color: #555;
}

.form-field input {
  width: 100%;
  margin-top: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.form-actions .pixel-btn {
  flex: 1;
}
</style>
