<script setup>
import { computed } from 'vue'
import { API_BASE } from '../api/config'

const props = defineProps({
  // 單顆徽章資料，來自 GET /user/achievements
  // { key, group, tier, title, description, target, progress, unlocked, unlockedAt, image? }
  badge: {
    type: Object,
    required: true
  }
})

// 分級外框色
const TIER_COLORS = {
  bronze: '#cd7f32',
  silver: '#c8ccd2',
  gold: '#ffd23f',
  platinum: '#7fd8e8'
}

const frameColor = computed(() => TIER_COLORS[props.badge.tier] || TIER_COLORS.gold)

// 之後有美術圖，後端在 badge 補 image 欄位就會走 <img>，不用改這個元件
const imageUrl = computed(() =>
  props.badge.image ? `${API_BASE}${props.badge.image}` : null
)
</script>

<template>
  <div
    class="badge pixel-card"
    :class="{ locked: !badge.unlocked }"
    :title="badge.description"
  >
    <div class="badge-art">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="badge.title"
        class="badge-img"
      />

      <svg
        v-else
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        shape-rendering="crispEdges"
      >
        <!-- 緞帶 -->
        <polygon points="22,40 14,60 24,54 28,46" :fill="frameColor" stroke="#1a1a1a" stroke-width="2" />
        <polygon points="42,40 50,60 40,54 36,46" :fill="frameColor" stroke="#1a1a1a" stroke-width="2" />

        <!-- 獎章外框（像素八角） -->
        <polygon
          points="24,6 40,6 52,18 52,34 40,46 24,46 12,34 12,18"
          :fill="frameColor"
          stroke="#1a1a1a"
          stroke-width="3"
        />

        <!-- 獎章內圈 -->
        <polygon
          points="27,12 37,12 45,20 45,32 37,40 27,40 19,32 19,20"
          fill="#ffffff"
          stroke="#1a1a1a"
          stroke-width="2"
        />

        <!-- 分組圖形 -->
        <polyline
          v-if="badge.group === 'task_count'"
          points="24,26 30,32 41,20"
          fill="none"
          stroke="#1a1a1a"
          stroke-width="4"
        />

        <polygon
          v-else-if="badge.group === 'perfect_streak'"
          points="32,13 41,25 37,25 40,34 24,34 27,25 23,25"
          fill="#ec1e6f"
          stroke="#1a1a1a"
          stroke-width="2"
        />

        <g v-else-if="badge.group === 'pet_collect'" fill="#ec1e6f" stroke="#1a1a1a" stroke-width="1.5">
          <circle cx="32" cy="30" r="6" />
          <circle cx="23" cy="22" r="3" />
          <circle cx="32" cy="18" r="3" />
          <circle cx="41" cy="22" r="3" />
        </g>

        <polygon
          v-else
          points="32,13 43,24 32,39 21,24"
          fill="#ec1e6f"
          stroke="#1a1a1a"
          stroke-width="2"
        />
      </svg>
    </div>

    <div class="badge-title">{{ badge.title }}</div>
    <div class="badge-desc">{{ badge.description }}</div>

    <div v-if="badge.unlocked" class="badge-state done">已達成</div>
    <div v-else class="badge-state">{{ badge.progress }} / {{ badge.target }}</div>
  </div>
</template>

<style scoped>
.badge {
  width: 150px;
  padding: 14px 12px;
  text-align: center;
  transition: filter 0.15s ease;
}

.badge.locked {
  filter: grayscale(1) opacity(0.45);
}

.badge-art {
  width: 72px;
  height: 72px;
  margin: 0 auto 8px;
}

.badge-art svg,
.badge-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.badge-title {
  font-family: var(--font-pixel);
  font-size: 10px;
  line-height: 1.5;
  margin-bottom: 6px;
}

.badge-desc {
  font-size: 12px;
  color: #5a5346;
  min-height: 32px;
}

.badge-state {
  margin-top: 8px;
  font-family: var(--font-pixel);
  font-size: 9px;
  padding: 4px 6px;
  border: 2px solid var(--pixel-ink);
  background: #fff;
}

.badge-state.done {
  background: var(--pixel-green);
  color: #fff;
}
</style>
