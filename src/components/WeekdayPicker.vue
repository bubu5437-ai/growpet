<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// 星期顯示順序：日一二三四五六，對應 JS Date.getDay() 的 0~6
const weekdays = [
  { label: '日', value: 0 },
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 }
]

const presets = {
  everyday: [0, 1, 2, 3, 4, 5, 6],
  weekday: [1, 2, 3, 4, 5],
  weekend: [0, 6]
}

const isSelected = (value) => props.modelValue.includes(value)

const toggleDay = (value) => {
  const next = isSelected(value)
    ? props.modelValue.filter(day => day !== value)
    : [...props.modelValue, value]

  emit('update:modelValue', next)
}

const selectPreset = (key) => {
  emit('update:modelValue', [...presets[key]])
}
</script>

<template>
  <div class="weekday-picker">

    <div class="weekday-buttons">
      <button
        v-for="day in weekdays"
        :key="day.value"
        type="button"
        class="weekday-btn"
        :class="{ selected: isSelected(day.value) }"
        @click="toggleDay(day.value)"
      >
        {{ day.label }}
      </button>
    </div>

    <div class="preset-buttons">
      <button type="button" class="preset-btn" @click="selectPreset('everyday')">每天</button>
      <button type="button" class="preset-btn" @click="selectPreset('weekday')">工作日</button>
      <button type="button" class="preset-btn" @click="selectPreset('weekend')">週末</button>
    </div>

  </div>
</template>

<style scoped>
.weekday-picker {
  margin: 8px 0;
}

.weekday-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
}

.weekday-btn {
  width: 36px;
  height: 36px;
  border-radius: 0;
  border: 2px solid var(--pixel-ink);
  background: #fff;
  color: var(--pixel-ink);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-pixel);
  transition: transform .1s ease, background .15s ease, color .15s ease;
}

.weekday-btn:active {
  transform: scale(0.9);
}

.weekday-btn.selected {
  background: var(--pixel-pink);
  border-color: var(--pixel-ink);
  color: #fff;
  box-shadow: 2px 2px 0 var(--pixel-ink);
}

.preset-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.preset-btn {
  padding: 5px 10px;
  border-radius: 0;
  border: 2px solid var(--pixel-ink);
  background: var(--pixel-cyan);
  color: var(--pixel-ink);
  cursor: pointer;
  font-size: 10px;
  font-family: var(--font-pixel);
}

.preset-btn:hover {
  filter: brightness(1.1);
}
</style>
