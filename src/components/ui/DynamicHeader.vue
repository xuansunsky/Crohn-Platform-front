<template>
  <header
    ref="headerRef"
    class="dynamic-header"
    :class="{ 'dynamic-header--compact': isCompact }"
    :style="accentStyle"
  >
    <div
      class="dynamic-header__nav"
      :class="{ 'dynamic-header__nav--active': status || $slots.action }"
    >
      <div class="dynamic-header__small-title">{{ title }}</div>

      <div v-if="status" class="dynamic-header__status">
        <span v-if="statusDot" class="dynamic-header__status-dot"></span>
        <span>{{ status }}</span>
      </div>

      <div v-if="$slots.action" class="dynamic-header__action">
        <slot name="action" />
      </div>
    </div>

    <div class="dynamic-header__hero">
      <div class="dynamic-header__lockup">
        <span class="dynamic-header__accent-line" aria-hidden="true"></span>
        <h1>{{ title }}</h1>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, default: '' },
  statusDot: { type: Boolean, default: false },
  compactThreshold: { type: Number, default: 10 },
  accent: {
    type: String,
    default: 'stone',
    validator: (value) => ['stone', 'indigo', 'blue', 'teal', 'amber', 'violet'].includes(value)
  }
})

const headerRef = ref(null)
const isCompact = ref(false)

let scrollTarget = null
let rafId = 0

const accentMap = {
  stone: '#111827',
  indigo: '#4f46e5',
  blue: '#2563eb',
  teal: '#0f766e',
  amber: '#d97706',
  violet: '#7c3aed'
}

const accentStyle = computed(() => ({
  '--header-accent': accentMap[props.accent] || accentMap.stone
}))

const getScrollTop = () => {
  if (!scrollTarget) return 0
  return scrollTarget === window ? window.scrollY : scrollTarget.scrollTop
}

const updateCompactState = () => {
  const nextState = getScrollTop() > props.compactThreshold
  if (nextState !== isCompact.value) {
    isCompact.value = nextState
  }
}

const onScroll = () => {
  if (rafId) return

  rafId = window.requestAnimationFrame(() => {
    updateCompactState()
    rafId = 0
  })
}

const findScrollParent = (node) => {
  let parent = node?.parentElement

  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent)
    const overflow = `${style.overflow}${style.overflowY}`

    if (/(auto|scroll|overlay)/.test(overflow)) {
      return parent
    }

    parent = parent.parentElement
  }

  return window
}

onMounted(() => {
  scrollTarget = findScrollParent(headerRef.value)
  updateCompactState()
  scrollTarget.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (rafId) {
    window.cancelAnimationFrame(rafId)
  }

  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.dynamic-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: calc(env(safe-area-inset-top, 0px) + 6px) 20px 12px;
  background: rgba(251, 249, 245, 0);
  border-bottom: 1px solid rgba(231, 229, 228, 0);
  transition:
    padding 220ms ease,
    background-color 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.dynamic-header--compact {
  padding-bottom: 7px;
  background: rgba(255, 255, 255, 0.78);
  border-bottom-color: rgba(226, 232, 240, 0.76);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.055);
  backdrop-filter: blur(16px) saturate(1.24);
  -webkit-backdrop-filter: blur(16px) saturate(1.24);
}

.dynamic-header__nav {
  position: relative;
  display: flex;
  min-height: 12px;
  align-items: center;
  justify-content: flex-end;
  transition: min-height 220ms ease;
}

.dynamic-header__nav--active,
.dynamic-header--compact .dynamic-header__nav {
  min-height: 32px;
}

.dynamic-header__small-title {
  position: absolute;
  left: 50%;
  max-width: 58%;
  overflow: hidden;
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  opacity: 0;
  text-overflow: ellipsis;
  transform: translate3d(-50%, 7px, 0) scale(0.98);
  transition:
    opacity 180ms ease,
    transform 220ms ease;
  white-space: nowrap;
}

.dynamic-header--compact .dynamic-header__small-title {
  opacity: 1;
  transform: translate3d(-50%, 0, 0) scale(1);
}

.dynamic-header__status {
  position: absolute;
  left: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 38%;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 6px 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dynamic-header__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--header-accent);
}

.dynamic-header__action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 38px;
}

.dynamic-header__hero {
  max-height: 48px;
  overflow: hidden;
  transform-origin: left top;
  transition:
    max-height 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 180ms ease,
    transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dynamic-header--compact .dynamic-header__hero {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, -8px, 0) scale(0.96);
}

.dynamic-header__lockup {
  display: flex;
  max-width: 100%;
  align-items: flex-end;
  gap: 10px;
}

.dynamic-header__accent-line {
  width: 4px;
  height: 29px;
  margin-bottom: 2px;
  border-radius: 999px;
  background: var(--header-accent);
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.035);
}

.dynamic-header h1 {
  margin: 0;
  overflow: hidden;
  color: #020617;
  font-size: 31px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.02;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .dynamic-header,
  .dynamic-header__small-title,
  .dynamic-header__hero {
    transition: none;
  }
}
</style>
