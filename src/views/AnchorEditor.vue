<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '../api/axios'
import { API_BASE } from '../api/config'

// 這是開發用的錨點校準工具，不用做得美觀，能點座標、能匯出 JSON 就好


// mode: 'pet' = 校準寵物每幀身上的錨點（帽子/配件要疊在哪）
//       'item' = 校準商品「自己圖片」的 anchorOffset（商品圖片上哪一點對準錨點）
const mode = ref('pet')

// ---------- 寵物身上的錨點 ----------

// 從後端抓所有寵物（跟商城/背包用的是同一份資料），選其中一隻來校準
const pets = ref([])
const selectedPetIndex = ref(0)

// 目前選中寵物的 frames 深複製一份，避免直接改到 pets 裡的原始資料
const frames = reactive([])

async function loadPets() {
  const response = await api.get('/pets')
  pets.value = response.data.pets
  loadFramesFromSelectedPet()
}

function loadFramesFromSelectedPet() {
  const pet = pets.value[selectedPetIndex.value]

  if (!pet) return

  frames.splice(0, frames.length, ...JSON.parse(JSON.stringify(pet.frames)))
  frameIndex.value = 0
}

watch(selectedPetIndex, loadFramesFromSelectedPet)

onMounted(loadPets)

// 目前在校準哪一個裝備欄位的錨點，跟資料庫 frames.anchors 的欄位名稱要一致
const anchorType = ref('hat')
const anchorTypes = [
  { key: 'hat', label: '帽子錨點' },
  { key: 'accessory', label: '配件錨點' }
]

const frameIndex = ref(0)
const currentFrame = computed(() => frames[frameIndex.value])
const currentPetAnchor = computed(() => currentFrame.value?.anchors?.[anchorType.value])
const petImageSrc = computed(() => currentFrame.value ? API_BASE + currentFrame.value.image : '')

function prevFrame() {
  if (frameIndex.value > 0) frameIndex.value--
}
function nextFrame() {
  if (frameIndex.value < frames.length - 1) frameIndex.value++
}

// ---------- 商品自己的 anchorOffset ----------

// 這個工具不連商品的後端 API，直接列出目前商城裡「有美術圖」的商品，方便一個一個校準
// 校準完之後把匯出的數字回填到資料庫（或告訴 Claude Code 幫忙寫入）
const items = reactive([
  { name: '棒球帽', image: '/images/item/hat.png', anchorOffset: { x: 35, y: 62 } },
  { name: '派對帽', image: '/images/item/partyhat.png', anchorOffset: { x: 24, y: 59 } },
  { name: '花帽', image: '/images/item/flowerhat.png', anchorOffset: { x: 23, y: 69 } },
  { name: '蝴蝶結', image: '/images/item/bowtie.png', anchorOffset: { x: 31, y: 15 } },
  { name: '眼鏡', image: '/images/item/glass.png', anchorOffset: { x: 38, y: 15 } },
  { name: '墨鏡', image: '/images/item/sunglass.png', anchorOffset: { x: 34, y: 10 } }
])

const selectedItemIndex = ref(0)
const currentItem = computed(() => items[selectedItemIndex.value])
const itemImageSrc = computed(() => API_BASE + currentItem.value.image)

// ---------- 共用：點圖片設定座標 ----------

const currentAnchor = computed(() =>
  mode.value === 'pet' ? currentPetAnchor.value : currentItem.value.anchorOffset
)
const currentImageSrc = computed(() =>
  mode.value === 'pet' ? petImageSrc.value : itemImageSrc.value
)

const imageRef = ref(null)
const naturalSize = ref({ width: 1, height: 1 })

function onImageLoad() {
  naturalSize.value = {
    width: imageRef.value.naturalWidth,
    height: imageRef.value.naturalHeight
  }
}

// 點擊圖片：把畫面上的顯示座標換算回圖片原始像素座標
function handleImageClick(event) {
  if (!currentAnchor.value) return

  const img = imageRef.value
  const scaleX = img.naturalWidth / img.clientWidth
  const scaleY = img.naturalHeight / img.clientHeight

  const x = Math.round(event.offsetX * scaleX)
  const y = Math.round(event.offsetY * scaleY)

  currentAnchor.value.x = x
  currentAnchor.value.y = y
}

// 小圓點位置，用百分比對齊圖片，不用另外處理縮放
const dotStyle = computed(() => {
  if (!currentAnchor.value) return { display: 'none' }

  return {
    left: (currentAnchor.value.x / naturalSize.value.width) * 100 + '%',
    top: (currentAnchor.value.y / naturalSize.value.height) * 100 + '%'
  }
})

// ---------- 匯出 ----------

const exportedPetConfig = computed(() => {
  const pet = pets.value[selectedPetIndex.value]

  return {
    petName: pet?.name,
    frameDuration: pet?.frameDuration,
    frames: frames.map((f) => ({
      image: f.image,
      anchors: {
        hat: { x: f.anchors.hat.x, y: f.anchors.hat.y },
        accessory: { x: f.anchors.accessory.x, y: f.anchors.accessory.y }
      }
    }))
  }
})

const exportedItemOffsets = computed(() =>
  items.reduce((result, item) => {
    result[item.name] = { x: item.anchorOffset.x, y: item.anchorOffset.y }
    return result
  }, {})
)

const showExport = ref(false)

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div style="max-width: 700px; margin: 20px auto; font-family: sans-serif">
    <h2>錨點校準工具（開發用）</h2>

    <div style="margin-bottom: 12px">
      <button @click="mode = 'pet'" :disabled="mode === 'pet'">
        校準寵物身上的錨點
      </button>
      <button @click="mode = 'item'" :disabled="mode === 'item'">
        校準商品圖片自己的位置
      </button>
    </div>

    <!-- 校準寵物身上的錨點：先選寵物，再選帽子/配件，再一幀一幀點 -->
    <template v-if="mode === 'pet'">
      <div style="margin-bottom: 12px">
        <select v-model="selectedPetIndex">
          <option v-for="(pet, index) in pets" :key="pet._id" :value="index">
            {{ pet.name }}
          </option>
        </select>
      </div>

      <div style="margin-bottom: 12px">
        <button
          v-for="type in anchorTypes"
          :key="type.key"
          @click="anchorType = type.key"
          :disabled="anchorType === type.key"
        >
          {{ type.label }}
        </button>
      </div>

      <div v-if="frames.length > 0" style="margin-bottom: 12px">
        <button @click="prevFrame" :disabled="frameIndex === 0">← 上一幀</button>
        第 {{ frameIndex + 1 }} / {{ frames.length }} 幀
        <button @click="nextFrame" :disabled="frameIndex === frames.length - 1">
          下一幀 →
        </button>
      </div>
    </template>

    <!-- 校準商品自己的 anchorOffset：選要校準哪一件商品 -->
    <template v-else>
      <div style="margin-bottom: 12px">
        <select v-model="selectedItemIndex">
          <option v-for="(item, index) in items" :key="item.name" :value="index">
            {{ item.name }}
          </option>
        </select>
      </div>
    </template>

    <p v-if="currentAnchor">
      目前錨點座標：x = {{ currentAnchor.x }}, y = {{ currentAnchor.y }}
      （點擊下方圖片設定）
    </p>

    <div v-if="currentImageSrc" style="position: relative; display: inline-block; border: 1px solid #ccc">
      <img
        ref="imageRef"
        :src="currentImageSrc"
        @load="onImageLoad"
        @click="handleImageClick"
        style="max-width: 100%; display: block; cursor: crosshair"
      />
      <div
        style="
          position: absolute;
          width: 10px;
          height: 10px;
          background: red;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        "
        :style="dotStyle"
      ></div>
    </div>

    <div style="margin-top: 20px">
      <button @click="showExport = !showExport">
        {{ showExport ? '隱藏' : '顯示' }} 匯出 JSON
      </button>
      <button @click="downloadJSON(exportedPetConfig, 'petFrames.json')">
        下載這隻寵物的 frames
      </button>
      <button @click="downloadJSON(exportedItemOffsets, 'itemAnchorOffsets.json')">
        下載商品 anchorOffset
      </button>
    </div>

    <div v-if="showExport" style="margin-top: 12px">
      <h4>寵物身上的錨點（帽子 + 配件）</h4>
      <pre style="background: #f0f0f0; padding: 10px; overflow: auto">{{
        JSON.stringify(exportedPetConfig, null, 2)
      }}</pre>

      <h4>商品 anchorOffset（每件商品自己圖片上的定位點）</h4>
      <pre style="background: #f0f0f0; padding: 10px; overflow: auto">{{
        JSON.stringify(exportedItemOffsets, null, 2)
      }}</pre>
    </div>
  </div>
</template>
