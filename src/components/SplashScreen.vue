<template>
  <transition name="splash-out">
    <div v-if="visible" class="splash">
      <div class="splash-img" :class="{ 'img-ready': imgLoaded }">
        <img src="/img/bg-stars.png" @load="imgLoaded = true" alt="" />
      </div>

      <div class="splash-content" :class="{ 'content-ready': imgLoaded }">
        <p class="welcome-label">欢迎来到</p>
        <h1 class="title">Crohn Paradise</h1>
        <p class="subtitle">最坚强的灵魂，在这里相遇</p>
        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>
      </div>

      <p class="credit" :class="{ 'content-ready': imgLoaded }">created by godxuan</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)
const imgLoaded = ref(false)

onMounted(() => {
  setTimeout(() => { visible.value = false }, 2800)
})
</script>

<style scoped>
.splash {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; flex-direction: column;
  background: #FFFDF8;
  overflow: hidden;
}

.splash-img {
  flex: 1; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: scale(1.05);
  transition: opacity 0.8s ease, transform 1.6s cubic-bezier(0.16,1,0.3,1);
}
.splash-img.img-ready {
  opacity: 1; transform: scale(1);
}
.splash-img img {
  width: 92%; max-height: 90%; object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(15,23,42,0.12);
}
.splash-img::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 60px;
  background: linear-gradient(to bottom, transparent, #FFFDF8);
}

.splash-content {
  padding: 32px 28px 48px; text-align: center;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s;
}
.splash-content.content-ready {
  opacity: 1; transform: translateY(0);
}

.welcome-label {
  font-size: 13px; font-weight: 700;
  color: #94a3b8; letter-spacing: 4px;
  text-transform: uppercase; margin-bottom: 8px;
}
.title {
  font-size: 28px; font-weight: 900;
  color: #1e293b; line-height: 1.2;
  letter-spacing: -0.5px; margin-bottom: 10px;
}
.subtitle {
  font-size: 14px; color: #64748b;
  font-weight: 500; margin-bottom: 28px;
}

.loading-bar {
  width: 120px; height: 3px; margin: 0 auto;
  background: #e2e8f0; border-radius: 4px; overflow: hidden;
}
.loading-fill {
  height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  animation: fill-bar 2.4s ease-in-out forwards;
}

.credit {
  position: absolute; bottom: 20px; left: 0; right: 0;
  text-align: center;
  font-size: 11px; font-weight: 500;
  color: #cbd5e1; letter-spacing: 1px;
  opacity: 0;
  transition: opacity 0.6s ease 0.8s;
}
.credit.content-ready {
  opacity: 1;
}

.splash-out-leave-active {
  transition: opacity 0.5s ease;
}
.splash-out-leave-to {
  opacity: 0;
}

@keyframes fill-bar {
  0% { width: 0; }
  100% { width: 100%; }
}
</style>
