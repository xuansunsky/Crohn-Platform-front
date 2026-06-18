<template>
  <transition name="fade">
    <div v-if="viewer.show" class="fixed inset-0 z-[240] bg-black/95 flex flex-col" @click.self="$emit('close')">
      <header class="shrink-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3 text-white">
        <span class="text-[13px] font-bold text-white/70">{{ viewer.index + 1 }} / {{ viewer.images.length }}</span>
        <button
          @click="$emit('close')"
          class="w-9 h-9 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center active:scale-90 transition-all"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </header>
      <div class="flex-1 min-h-0 flex items-center justify-center px-2 pb-[calc(env(safe-area-inset-bottom,0px)+18px)]">
        <button
          v-if="viewer.images.length > 1"
          @click.stop="$emit('prev')"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all"
        >
          <i class="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <img
          :src="viewer.images[viewer.index]"
          class="max-w-full max-h-full object-contain rounded-lg select-none"
          @click="$emit('next')"
        />
        <button
          v-if="viewer.images.length > 1"
          @click.stop="$emit('next')"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all"
        >
          <i class="ri-arrow-right-s-line text-2xl"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  viewer: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'prev', 'next'])
</script>
