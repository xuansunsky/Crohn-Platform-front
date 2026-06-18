<template>
  <transition name="fade-up">
    <div v-if="show" class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end" @click.self="$emit('close')">
      <div class="bg-white rounded-t-[36px] p-6 max-h-[80vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative" @click.stop>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
        <div class="flex justify-between items-center mb-5 mt-4 shrink-0">
          <h2 class="text-slate-900 text-[20px] font-black tracking-tight">发起密聊</h2>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto custom-scroll space-y-2">
          <p v-if="friends.length === 0" class="text-center text-[13px] text-slate-400 font-bold py-10">还没有好友,先去联络人搜索添加吧 🔍</p>
          <div
            v-for="friend in friends"
            :key="friend.id"
            @click="$emit('select', friend)"
            class="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            <img :src="friend.avatar" class="w-11 h-11 rounded-2xl border border-white shadow-sm">
            <h4 class="text-[15px] font-bold text-slate-800 flex-1 truncate">{{ friend.name }}</h4>
            <i class="ri-arrow-right-s-line text-slate-300 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  friends: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'select'])
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}
.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.26s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(18px);
}
</style>
