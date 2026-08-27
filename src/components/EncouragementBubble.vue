<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <transition name="bubble-fade">
    <div
      v-if="visible"
      class="encouragement-bubble"
    >
      {{ message }}
      <span class="bubble-tail" />
    </div>
  </transition>
</template>

<style scoped>
.encouragement-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 14px;
  background: #ffffff;
  border: 3px solid var(--pixel-ink);
  border-radius: 0;
  padding: 10px 16px;
  min-width: 235px;
  max-width: 260px;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  box-shadow: 3px 3px 0 var(--pixel-ink);
  cursor: pointer;
  z-index: 1;
}

.bubble-tail {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-width: 8px 8px 0 8px;
  border-style: solid;
  border-color: var(--pixel-ink) transparent transparent transparent;
}

.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}

.bubble-fade-enter-from,
.bubble-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
</style>
