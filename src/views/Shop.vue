<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'
import { API_BASE } from '../api/config'
import { usePageBackground } from '../composables/usePageBackground'

usePageBackground()

const heart = ref(0)
const items = ref([])
const pets = ref([])
const loading = ref(true)
const buyingId = ref(null)
const buyingPetId = ref(null)

const hats = computed(() => items.value.filter(item => item.type === 'hat'))
const accessories = computed(() => items.value.filter(item => item.type === 'accessory'))
const backgrounds = computed(() => items.value.filter(item => item.type === 'background'))
const petScenes = computed(() => items.value.filter(item => item.type === 'petScene'))

// 取得商城商品清單
const getItems = async () => {
  try {
    const response = await api.get('/shop/items')

    heart.value = response.data.heart
    items.value = response.data.items
  } catch (error) {
    console.log(error)

    alert('取得商城資料失敗')
  } finally {
    loading.value = false
  }
}

// 取得寵物清單
const getPets = async () => {
  try {
    const response = await api.get('/pets')

    pets.value = response.data.pets
  } catch (error) {
    console.log(error)

    alert('取得寵物清單失敗')
  }
}

// 購買商品
const buyItem = async (item) => {
  if (buyingId.value) return

  buyingId.value = item._id

  try {
    await api.post('/shop/buy', { itemId: item._id })

    alert(`購買成功：${item.name}`)

    // 重新取得清單（更新愛心餘額、已擁有狀態）
    await getItems()
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '購買失敗'
    )
  } finally {
    buyingId.value = null
  }
}

// 購買寵物
const buyPet = async (pet) => {
  if (buyingPetId.value) return

  buyingPetId.value = pet._id

  try {
    await api.post('/shop/buy-pet', { petId: pet._id })

    alert(`購買成功：${pet.name}`)

    // 寵物的擁有狀態、商品的愛心餘額都要更新
    await Promise.all([getPets(), getItems()])
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '購買失敗'
    )
  } finally {
    buyingPetId.value = null
  }
}

onMounted(() => {
  getItems()
  getPets()
})
</script>

<template>
  <div class="shop">

    <h1>商城</h1>

    <div class="heart-bar">
      ❤️ 目前愛心：<strong>{{ heart }}</strong>
    </div>

    <p v-if="loading">載入中...</p>

    <template v-else>

      <section v-if="pets.length > 0" class="shop-section">

        <h2>寵物</h2>

        <div class="item-list">

          <div
            v-for="pet in pets"
            :key="pet._id"
            class="item-card pixel-card"
          >
            <img
              v-if="pet.image"
              :src="`${API_BASE}${pet.image}`"
              :alt="pet.name"
              class="item-thumb"
            />
            <h3>{{ pet.name }}</h3>
            <p>❤️ {{ pet.price }}</p>

            <button
              v-if="pet.owned"
              class="pixel-btn"
              disabled
            >
              已擁有
            </button>

            <button
              v-else-if="heart < pet.price"
              class="pixel-btn"
              disabled
            >
              愛心不足
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="buyingPetId === pet._id"
              @click="buyPet(pet)"
            >
              購買
            </button>

          </div>

        </div>

      </section>

      <section v-if="hats.length > 0" class="shop-section">

        <h2>帽子</h2>

        <div class="item-list">

          <div
            v-for="item in hats"
            :key="item._id"
            class="item-card pixel-card"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>
            <p>❤️ {{ item.price }}</p>

            <button
              v-if="item.owned"
              class="pixel-btn"
              disabled
            >
              已擁有
            </button>

            <button
              v-else-if="heart < item.price"
              class="pixel-btn"
              disabled
            >
              愛心不足
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="buyingId === item._id"
              @click="buyItem(item)"
            >
              購買
            </button>

          </div>

        </div>

      </section>

      <section v-if="accessories.length > 0" class="shop-section">

        <h2>配件</h2>

        <div class="item-list">

          <div
            v-for="item in accessories"
            :key="item._id"
            class="item-card pixel-card"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>
            <p>❤️ {{ item.price }}</p>

            <button
              v-if="item.owned"
              class="pixel-btn"
              disabled
            >
              已擁有
            </button>

            <button
              v-else-if="heart < item.price"
              class="pixel-btn"
              disabled
            >
              愛心不足
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="buyingId === item._id"
              @click="buyItem(item)"
            >
              購買
            </button>

          </div>

        </div>

      </section>

      <section v-if="backgrounds.length > 0" class="shop-section">

        <h2>背景主題</h2>

        <div class="item-list">

          <div
            v-for="item in backgrounds"
            :key="item._id"
            class="item-card pixel-card"
          >
            <div class="item-swatch" :class="item.cssClass"></div>
            <h3>{{ item.name }}</h3>
            <p>❤️ {{ item.price }}</p>

            <button
              v-if="item.owned"
              class="pixel-btn"
              disabled
            >
              已擁有
            </button>

            <button
              v-else-if="heart < item.price"
              class="pixel-btn"
              disabled
            >
              愛心不足
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="buyingId === item._id"
              @click="buyItem(item)"
            >
              購買
            </button>

          </div>

        </div>

      </section>

      <section v-if="petScenes.length > 0" class="shop-section">

        <h2>寵物場景</h2>

        <div class="item-list">

          <div
            v-for="item in petScenes"
            :key="item._id"
            class="item-card pixel-card"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>
            <p>❤️ {{ item.price }}</p>

            <button
              v-if="item.owned"
              class="pixel-btn"
              disabled
            >
              已擁有
            </button>

            <button
              v-else-if="heart < item.price"
              class="pixel-btn"
              disabled
            >
              愛心不足
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="buyingId === item._id"
              @click="buyItem(item)"
            >
              購買
            </button>

          </div>

        </div>

      </section>

    </template>

  </div>
</template>

<style scoped>
.shop {
  max-width: 900px;
  margin: auto;
  padding: 40px;
}

.shop h1 {
  text-align: center;
  color: var(--pixel-pink);
  font-size: 20px;
}

.heart-bar {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

.shop-section {
  margin-bottom: 30px;
}

.shop-section h2 {
  font-size: 14px;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item-card {
  padding: 20px;
  width: 180px;
  text-align: center;
}

.item-icon {
  font-size: 40px;
}

.item-thumb {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.item-swatch {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  border: 2px solid var(--pixel-ink);
  overflow: hidden;
}
</style>
