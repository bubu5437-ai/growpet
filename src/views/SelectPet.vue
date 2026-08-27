<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { API_BASE } from '../api/config'

const router = useRouter()

const pets = ref([])
const loading = ref(true)
const submitting = ref(false)

// 取得可以選擇的寵物清單
const getPets = async () => {
  try {
    const response = await api.get('/pets')

    pets.value = response.data.pets
  } catch (error) {
    console.log(error)

    alert('取得寵物清單失敗')
  } finally {
    loading.value = false
  }
}

// 選擇寵物
const choosePet = async (petId) => {
  if (submitting.value) return

  submitting.value = true

  try {
    await api.post('/user/select-pet', { petId })

    alert('寵物選擇成功')

    // 下一步：選擇年度目標
    router.push('/onboarding/goal')
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '寵物選擇失敗'
    )
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  getPets()
})
</script>

<template>
  <div class="select-pet">

    <h1>選擇你的寵物</h1>

    <p v-if="loading">載入中...</p>

    <p v-else-if="pets.length === 0">目前沒有可選擇的寵物</p>

    <div v-else class="pet-list">

      <div
        v-for="pet in pets"
        :key="pet._id"
        class="pet-card pixel-card"
      >

        <img
          v-if="pet.image"
          :src="`${API_BASE}${pet.image}`"
          :alt="pet.name"
          class="pet-image"
        />

        <h3>{{ pet.name }}</h3>

        <button
          class="pixel-btn"
          :disabled="submitting"
          @click="choosePet(pet._id)"
        >
          選擇這隻
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.select-pet {
  max-width: 900px;
  margin: auto;
  padding: 40px;
  text-align: center;
}

.select-pet h1 {
  color: var(--pixel-pink);
  font-size: 20px;
}

.pet-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.pet-card {
  padding: 20px;
  width: 200px;
}

.pet-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 3px solid var(--pixel-ink);
}

.pet-card .pixel-btn {
  margin-top: 12px;
}
</style>
