<template>
  <div class="relative h-screen w-full overflow-hidden bg-slate-900 text-white selection:bg-pink-500/30">

    <div class="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/30 blur-[100px]"></div>
    <div class="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-pink-600/30 blur-[100px]"></div>

    <div class="pointer-events-none absolute inset-0 z-0">
      <div
          v-for="heart in hearts"
          :key="heart.id"
          class="absolute text-pink-500 animate-float"
          :style="{
          left: heart.x + '%',
          bottom: '-20px',
          fontSize: heart.size + 'px',
          animationDuration: heart.duration + 's',
          opacity: heart.opacity
        }"
      >
        <i class="ri-heart-fill"></i>
      </div>
    </div>

    <div class="relative z-10 flex h-full flex-col items-center justify-center text-center p-6">

      <button
          @click="spawnHearts"
          class="group relative mb-12 transition-transform active:scale-95 outline-none"
      >
        <div class="absolute inset-0 animate-pulse rounded-full bg-red-500/50 blur-3xl group-hover:bg-red-500/70 transition-all duration-500"></div>

        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="relative h-40 w-40 text-red-500 drop-shadow-2xl filter transition-all duration-300 group-hover:drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-heartbeat"
        >
          <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path>
        </svg>

        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-pink-200/50 opacity-0 group-hover:opacity-100 transition-opacity">
          点击收获大家对您的爱心
        </div>
      </button>

      <div class="space-y-6">
        <h1 class="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 drop-shadow-sm">
          再见，刘金良
        </h1>

        <div class="flex flex-col gap-2">
          <p class="text-2xl font-bold text-slate-200">
            咱们江湖人称 <span class="text-pink-400">“刘师”</span>
          </p>
          <p class="text-lg text-slate-400 font-light max-w-lg mx-auto leading-relaxed">
            这破公司留不住你的才华，<br>
            但医院和兄弟们永远记得你的能力和人品！
          </p>
        </div>

        <div class="mt-8 inline-block rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md">
          <span class="mr-2">🚀</span>
          <span class="font-mono text-pink-300">Target:</span>
          <span class="font-bold text-white"> 星辰大海 · 前程似锦</span>
        </div>
      </div>

    </div>

    <div class="absolute bottom-6 w-full text-center text-xs text-slate-600">
      Designed with ❤️ by Your Bro Godxuan
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// 粒子系统逻辑
const hearts = ref([])
let heartId = 0

const spawnHearts = () => {
  // 每次点击生成 15 个爱心
  for (let i = 0; i < 15; i++) {
    const id = heartId++
    const startX = 50 + (Math.random() - 0.5) * 20 // 从屏幕中间附近发射

    hearts.value.push({
      id,
      x: startX + (Math.random() - 0.5) * 60, // 随机扩散 X 轴
      size: Math.random() * 20 + 10,          // 随机大小
      duration: Math.random() * 2 + 3,        // 随机飘浮时间 3-5秒
      opacity: 1
    })

    // 动画结束后清理 DOM，防止卡顿
    setTimeout(() => {
      hearts.value = hearts.value.filter(h => h.id !== id)
    }, 5000)
  }
}
</script>

<style scoped>
/* 定义心跳动画 */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}

/* 定义爱心上浮动画 */
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1.2) rotate(360deg); /* 飘到屏幕顶端 */
    opacity: 0;
  }
}

.animate-float {
  animation-name: floatUp;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
}
</style>