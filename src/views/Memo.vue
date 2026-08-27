<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { usePageBackground } from '../composables/usePageBackground'

usePageBackground()

const memos = ref([])
const newContent = ref('')

// 正在編輯中的備忘錄 id（null 代表沒有任何一筆在編輯）
const editingId = ref(null)
const editingContent = ref('')

// 取得備忘錄列表
const getMemos = async () => {
  try {
    const response = await api.get('/memos')

    memos.value = response.data.memos
  } catch (error) {
    console.log(error)
    alert('取得備忘錄失敗')
  }
}

// 新增備忘錄
const addMemo = async () => {
  if (!newContent.value.trim()) {
    return
  }

  try {
    await api.post('/memos', {
      content: newContent.value
    })

    newContent.value = ''

    await getMemos()
  } catch (error) {
    console.log(error)
    alert('新增失敗')
  }
}

// 切換完成狀態
const toggleMemo = async (memo) => {
  try {
    await api.patch(`/memos/${memo._id}`, {
      completed: !memo.completed
    })

    await getMemos()
  } catch (error) {
    console.log(error)
    alert('更新失敗')
  }
}

// 刪除備忘錄
const deleteMemo = async (memo) => {
  try {
    await api.delete(`/memos/${memo._id}`)

    await getMemos()
  } catch (error) {
    console.log(error)
    alert('刪除失敗')
  }
}

// 開始編輯內容
const startEdit = (memo) => {
  editingId.value = memo._id
  editingContent.value = memo.content
}

const cancelEdit = () => {
  editingId.value = null
  editingContent.value = ''
}

// 儲存編輯後的內容
const saveEdit = async (memo) => {
  if (!editingContent.value.trim()) {
    alert('內容不能是空的')
    return
  }

  try {
    await api.patch(`/memos/${memo._id}`, {
      content: editingContent.value
    })

    cancelEdit()

    await getMemos()
  } catch (error) {
    console.log(error)
    alert('修改失敗')
  }
}

// 把目前畫面上的排列順序存回後端
const saveOrder = async () => {
  try {
    await api.patch('/memos/reorder', {
      orderedIds: memos.value.map(memo => memo._id)
    })
  } catch (error) {
    console.log(error)
    alert('排序更新失敗')
  }
}

// 往上移一格
const moveUp = (index) => {
  if (index === 0) return

  const list = memos.value

  ;[list[index - 1], list[index]] = [list[index], list[index - 1]]

  saveOrder()
}

// 往下移一格
const moveDown = (index) => {
  if (index === memos.value.length - 1) return

  const list = memos.value

  ;[list[index], list[index + 1]] = [list[index + 1], list[index]]

  saveOrder()
}

onMounted(() => {
  getMemos()
})
</script>

<template>
  <div class="memo-page">

    <h1>備忘錄</h1>

    <!-- 新增輸入框 -->
    <div class="card pixel-card add-bar">

      <input
        v-model="newContent"
        class="pixel-input"
        placeholder="輸入待辦事項..."
        @keyup.enter="addMemo"
      />

      <button class="pixel-btn" @click="addMemo">新增</button>

    </div>

    <!-- 備忘錄清單 -->
    <div class="card pixel-card">

      <p v-if="memos.length === 0">目前沒有備忘錄</p>

      <ul class="memo-list">

        <li
          v-for="(memo, index) in memos"
          :key="memo._id"
          class="memo-item"
        >

          <div class="order-btns">
            <button
              class="pixel-btn order-btn"
              :disabled="index === 0"
              @click="moveUp(index)"
            >▲</button>
            <button
              class="pixel-btn order-btn"
              :disabled="index === memos.length - 1"
              @click="moveDown(index)"
            >▼</button>
          </div>

          <template v-if="editingId === memo._id">

            <input
              v-model="editingContent"
              class="pixel-input edit-input"
              @keyup.enter="saveEdit(memo)"
              @keyup.esc="cancelEdit"
            />

            <div class="memo-actions">
              <button class="pixel-btn" @click="saveEdit(memo)">儲存</button>
              <button class="pixel-btn secondary" @click="cancelEdit">取消</button>
            </div>

          </template>

          <template v-else>

            <label class="memo-content">
              <input
                type="checkbox"
                :checked="memo.completed"
                @change="toggleMemo(memo)"
              />

              <span :class="{ done: memo.completed }">
                {{ memo.content }}
              </span>
            </label>

            <div class="memo-actions">
              <button class="pixel-btn secondary" @click="startEdit(memo)">編輯</button>
              <button class="pixel-btn warn" @click="deleteMemo(memo)">刪除</button>
            </div>

          </template>

        </li>

      </ul>

    </div>

  </div>
</template>

<style scoped>
.memo-page {
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

.add-bar {
  display: flex;
  gap: 10px;
}

.add-bar input {
  flex: 1;
}

.memo-list {
  list-style: none;
  padding: 0;
}

.memo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed var(--pixel-ink);
  padding: 12px 0;
}

.memo-item:last-child {
  border-bottom: none;
}

.memo-content {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
  min-width: 0;
}

.memo-content .done {
  text-decoration: line-through;
  color: #9e9e9e;
}

.order-btns {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-right: 12px;
}

.order-btn {
  padding: 2px 8px !important;
  font-size: 10px !important;
}

.memo-actions {
  display: flex;
  gap: 8px;
  flex: none;
}

.edit-input {
  flex: 1;
  min-width: 0;
}
</style>
