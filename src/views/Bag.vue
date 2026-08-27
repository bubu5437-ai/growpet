<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { API_BASE } from '../api/config'
import { usePageBackground } from '../composables/usePageBackground'
import { useUserStore } from '../stores/user'

usePageBackground()

const userStore = useUserStore()


const hatItems = ref([])
const accessoryItems = ref([])
const backgroundItems = ref([])
const petSceneItems = ref([])
const petItems = ref([])
const activePet = ref(null)
const equipped = ref({ hat: null, shoes: null, accessory: null, background: null, petScene: null })
const loading = ref(true)
const submitting = ref(false)

// 取得背包資料
const getInventory = async () => {
  try {
    const response = await api.get('/shop/inventory')

    hatItems.value = response.data.items.hat
    accessoryItems.value = response.data.items.accessory
    backgroundItems.value = response.data.items.background
    petSceneItems.value = response.data.items.petScene
    equipped.value = response.data.equipped
    petItems.value = response.data.pets
    activePet.value = response.data.activePet

    // 背景主題要跟全站共用的狀態同步，其他頁面才會立刻顯示正確的背景
    userStore.setBackgroundClass(equipped.value.background?.cssClass)
  } catch (error) {
    console.log(error)

    alert('取得背包資料失敗')
  } finally {
    loading.value = false
  }
}

// 切換使用中的寵物
const switchPet = async (pet) => {
  if (submitting.value) return

  submitting.value = true

  try {
    await api.post('/shop/equip-pet', { petId: pet._id })

    await getInventory()
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '切換失敗'
    )
  } finally {
    submitting.value = false
  }
}

// 判斷某商品目前是不是穿戴中
const isEquipped = (item) => {
  return equipped.value[item.type]?._id === item._id
}

// 穿戴商品
const equipItem = async (item) => {
  if (submitting.value) return

  submitting.value = true

  try {
    await api.post('/shop/equip', { itemId: item._id })

    await getInventory()
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '穿戴失敗'
    )
  } finally {
    submitting.value = false
  }
}

// 取消穿戴
const unequipItem = async (item) => {
  if (submitting.value) return

  submitting.value = true

  try {
    await api.post('/shop/unequip', { type: item.type })

    await getInventory()
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || '取消穿戴失敗'
    )
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  getInventory()
})
</script>

<template>
  <div class="bag">

    <h1>背包</h1>

    <p v-if="loading">載入中...</p>

    <template v-else>

      <section class="bag-section">

        <h2>寵物</h2>

        <p v-if="petItems.length === 0">還沒有任何寵物，去商城逛逛吧</p>

        <div v-else class="item-list">

          <div
            v-for="pet in petItems"
            :key="pet._id"
            class="item-card pixel-card"
            :class="{ equipped: activePet?._id === pet._id }"
          >
            <img
              v-if="pet.image"
              :src="`${API_BASE}${pet.image}`"
              :alt="pet.name"
              class="item-thumb"
            />
            <h3>{{ pet.name }}</h3>

            <button
              v-if="activePet?._id === pet._id"
              class="pixel-btn"
              disabled
            >
              使用中
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="submitting"
              @click="switchPet(pet)"
            >
              切換使用
            </button>

          </div>

        </div>

      </section>

      <section class="bag-section">

        <h2>帽子</h2>

        <p v-if="hatItems.length === 0">還沒有任何帽子，去商城逛逛吧</p>

        <div v-else class="item-list">

          <div
            v-for="item in hatItems"
            :key="item._id"
            class="item-card pixel-card"
            :class="{ equipped: isEquipped(item) }"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>

            <button
              v-if="isEquipped(item)"
              class="pixel-btn"
              :disabled="submitting"
              @click="unequipItem(item)"
            >
              取消穿戴
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="submitting"
              @click="equipItem(item)"
            >
              穿戴
            </button>

          </div>

        </div>

      </section>

      <section class="bag-section">

        <h2>配件</h2>

        <p v-if="accessoryItems.length === 0">還沒有任何配件，去商城逛逛吧</p>

        <div v-else class="item-list">

          <div
            v-for="item in accessoryItems"
            :key="item._id"
            class="item-card pixel-card"
            :class="{ equipped: isEquipped(item) }"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>

            <button
              v-if="isEquipped(item)"
              class="pixel-btn"
              :disabled="submitting"
              @click="unequipItem(item)"
            >
              取消穿戴
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="submitting"
              @click="equipItem(item)"
            >
              穿戴
            </button>

          </div>

        </div>

      </section>

      <section class="bag-section">

        <h2>背景主題</h2>

        <p v-if="backgroundItems.length === 0">還沒有任何背景主題，去商城逛逛吧</p>

        <div v-else class="item-list">

          <div
            v-for="item in backgroundItems"
            :key="item._id"
            class="item-card pixel-card"
            :class="{ equipped: isEquipped(item) }"
          >
            <div class="item-swatch" :class="item.cssClass"></div>
            <h3>{{ item.name }}</h3>

            <button
              v-if="isEquipped(item)"
              class="pixel-btn"
              :disabled="submitting"
              @click="unequipItem(item)"
            >
              取消穿戴
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="submitting"
              @click="equipItem(item)"
            >
              穿戴
            </button>

          </div>

        </div>

      </section>

      <section class="bag-section">

        <h2>寵物場景</h2>

        <p v-if="petSceneItems.length === 0">還沒有任何寵物場景，去商城逛逛吧</p>

        <div v-else class="item-list">

          <div
            v-for="item in petSceneItems"
            :key="item._id"
            class="item-card pixel-card"
            :class="{ equipped: isEquipped(item) }"
          >
            <img
              v-if="item.image"
              :src="`${API_BASE}${item.image}`"
              :alt="item.name"
              class="item-thumb"
            />
            <div v-else class="item-icon">{{ item.icon }}</div>
            <h3>{{ item.name }}</h3>

            <button
              v-if="isEquipped(item)"
              class="pixel-btn"
              :disabled="submitting"
              @click="unequipItem(item)"
            >
              取消穿戴
            </button>

            <button
              v-else
              class="pixel-btn"
              :disabled="submitting"
              @click="equipItem(item)"
            >
              穿戴
            </button>

          </div>

        </div>

      </section>

    </template>

  </div>
</template>

<style scoped>
.bag {
  max-width: 900px;
  margin: auto;
  padding: 40px;
}

.bag h1 {
  text-align: center;
  color: var(--pixel-pink);
  font-size: 20px;
}

.bag-section {
  margin-bottom: 30px;
}

.bag-section h2 {
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

.item-card.equipped {
  background: var(--pixel-yellow);
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
