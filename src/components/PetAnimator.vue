<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// pet 格式跟資料庫的 Pet 文件一樣：{ frames: [...], frameDuration }
// equippedHat / equippedAccessory 格式都一樣：{ image, anchorOffset: { x, y }, ... }
// 傳 null 代表沒有裝備，該圖層就不會顯示
const props = defineProps({
  pet: {
    type: Object,
    required: true
  },
  equippedHat: {
    type: Object,
    default: null
  },
  equippedAccessory: {
    type: Object,
    default: null
  }
})

const API_BASE = 'http://localhost:3000'

const frameIndex = ref(0)

let rafId = null
let lastTimestamp = null
let accumulatedTime = 0

function tick(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp
  }

  accumulatedTime += timestamp - lastTimestamp
  lastTimestamp = timestamp

  const frameDuration = props.pet.frameDuration

  // 用經過的時間直接算跳了幾幀，避免分頁切回背景時累積的大量 delta 要一格一格跑迴圈
  const framesElapsed = Math.floor(accumulatedTime / frameDuration)

  if (framesElapsed > 0) {
    frameIndex.value = (frameIndex.value + framesElapsed) % props.pet.frames.length
    accumulatedTime -= framesElapsed * frameDuration
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

// 換寵物時（例如在背包切換）從頭一幀開始播，避免幀數不同時 index 對不到
watch(() => props.pet._id, () => {
  frameIndex.value = 0
})

const currentFrame = computed(() => props.pet.frames[frameIndex.value])
const petImageSrc = computed(() => API_BASE + currentFrame.value.image)

const hatImageSrc = computed(() =>
  props.equippedHat ? API_BASE + props.equippedHat.image : ''
)

const accessoryImageSrc = computed(() =>
  props.equippedAccessory ? API_BASE + props.equippedAccessory.image : ''
)

// 記錄寵物圖片「原始像素尺寸」，帽子位置才能用百分比換算，
// 這樣不管外面用 CSS 把圖片縮多小，帽子都還是對得準
const petNaturalSize = ref({ width: 1, height: 1 })

function onPetImageLoad(event) {
  petNaturalSize.value = {
    width: event.target.naturalWidth,
    height: event.target.naturalHeight
  }
}

// 帽子/配件圖片各自的原始像素尺寸，用來換算成「佔寵物圖片百分之幾寬」，
// 這樣商品圖不管原始檔案多大/多小，疊在寵物身上的視覺大小都維持一致
const hatNaturalSize = ref({ width: 1, height: 1 })
const accessoryNaturalSize = ref({ width: 1, height: 1 })

function onHatImageLoad(event) {
  hatNaturalSize.value = {
    width: event.target.naturalWidth,
    height: event.target.naturalHeight
  }
}

function onAccessoryImageLoad(event) {
  accessoryNaturalSize.value = {
    width: event.target.naturalWidth,
    height: event.target.naturalHeight
  }
}

const hatStyle = computed(() => {
  if (!props.equippedHat) return {}

  const anchor = currentFrame.value.anchors.hat
  const offset = props.equippedHat.anchorOffset

  return {
    left: ((anchor.x - offset.x) / petNaturalSize.value.width) * 100 + '%',
    top: ((anchor.y - offset.y) / petNaturalSize.value.height) * 100 + '%',
    width: (hatNaturalSize.value.width / petNaturalSize.value.width) * 100 + '%'
  }
})

const accessoryStyle = computed(() => {
  if (!props.equippedAccessory) return {}

  const anchor = currentFrame.value.anchors.accessory
  const offset = props.equippedAccessory.anchorOffset

  return {
    left: ((anchor.x - offset.x) / petNaturalSize.value.width) * 100 + '%',
    top: ((anchor.y - offset.y) / petNaturalSize.value.height) * 100 + '%',
    width: (accessoryNaturalSize.value.width / petNaturalSize.value.width) * 100 + '%'
  }
})
</script>

<template>
  <div style="position: relative; display: inline-block">
    <img
      :src="petImageSrc"
      alt="寵物"
      style="display: block"
      @load="onPetImageLoad"
    />

    <img
      v-if="equippedHat"
      :src="hatImageSrc"
      :style="{ position: 'absolute', ...hatStyle }"
      alt="帽子"
      @load="onHatImageLoad"
    />

    <img
      v-if="equippedAccessory"
      :src="accessoryImageSrc"
      :style="{ position: 'absolute', ...accessoryStyle }"
      alt="配件"
      @load="onAccessoryImageLoad"
    />
  </div>
</template>
