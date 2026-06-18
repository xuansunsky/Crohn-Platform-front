<template>
  <transition name="fade-up">
    <div
      v-if="show"
      class="fixed inset-0 z-[145] bg-slate-900/45 backdrop-blur-md flex flex-col justify-end"
      @click.self="$emit('close')"
    >
      <div class="bg-[#FBF9F5] rounded-t-[34px] max-h-[76vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]">
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

        <header class="shrink-0 px-6 pt-8 pb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-[10px] font-black tracking-[0.18em] text-slate-400 mb-1">今天看过</p>
            <h2 class="text-[22px] font-black text-slate-950 tracking-tight">{{ title }}</h2>
          </div>
          <button
            @click="$emit('close')"
            class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all"
          >
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto custom-scroll px-5 pb-[calc(env(safe-area-inset-bottom,8px)+20px)] space-y-2.5">
          <p v-if="picks.length === 0" class="text-center py-12 text-[13px] text-slate-400 font-bold">今天还没有看过的人</p>
          <article
            v-for="pick in picks"
            :key="pick.id"
            class="bg-white/82 border border-white/90 rounded-[24px] p-3.5 flex items-center gap-3 shadow-sm"
          >
            <img :src="pick.avatar || avatarOf('', pick.id)" class="w-12 h-12 rounded-[18px] object-cover bg-slate-100 border border-white shrink-0">
            <button @click="$emit('open-profile', pick)" class="flex-1 min-w-0 text-left active:scale-[0.99] transition-all">
              <h3 class="text-[14px] font-black text-slate-900 truncate">{{ pick.name }}</h3>
              <p class="text-[11px] font-bold text-slate-400 mt-0.5 truncate">{{ pick.sign || pick.distance || '今天看过的朋友' }}</p>
            </button>
            <button
              @click="$emit('greet', pick)"
              :disabled="pick.requested || greetRemaining <= 0"
              class="px-3 py-2 rounded-2xl text-[11px] font-black active:scale-95 transition-all shrink-0"
              :class="pick.requested ? 'bg-emerald-50 text-emerald-600' : (greetRemaining <= 0 ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white')"
            >
              {{ pick.requested ? '已打招呼' : '打招呼' }}
            </button>
          </article>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { avatarOf } from '@/utils/avatarPool'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '精选'
  },
  picks: {
    type: Array,
    default: () => []
  },
  greetRemaining: {
    type: Number,
    default: 0
  }
})

defineEmits(['close', 'open-profile', 'greet'])
</script>
