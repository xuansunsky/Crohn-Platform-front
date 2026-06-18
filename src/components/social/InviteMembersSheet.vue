<template>
  <transition name="fade-up">
    <div v-if="show" class="fixed inset-0 z-[160] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end" @click.self="$emit('close')">
      <div class="bg-white rounded-t-[36px] p-6 max-h-[80vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative" @click.stop>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
        <div class="flex justify-between items-center mb-5 mt-4 shrink-0">
          <h2 class="text-slate-900 text-[20px] font-black tracking-tight">邀请进队</h2>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </div>
        <p class="shrink-0 text-[12px] font-black text-slate-400 mb-2">勾选要邀请的朋友 (已选 {{ selectedIds.length }})</p>
        <div class="flex-1 overflow-y-auto custom-scroll space-y-2">
          <p v-if="friends.length === 0" class="text-center text-[13px] text-slate-400 font-bold py-8">没有可邀请的好友了,先去联络人添加吧 🔍</p>
          <div
            v-for="friend in friends"
            :key="friend.id"
            @click="$emit('toggle-member', friend.id)"
            class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]"
            :class="selectedIds.includes(friend.id) ? 'bg-violet-50 border-violet-200' : 'bg-white border-stone-100 hover:bg-slate-50'"
          >
            <img :src="friend.avatar" class="w-10 h-10 rounded-2xl border border-white shadow-sm">
            <h4 class="text-[14px] font-bold text-slate-800 flex-1 truncate">{{ friend.name }}</h4>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="selectedIds.includes(friend.id) ? 'bg-violet-500 border-violet-500' : 'border-slate-300'">
              <i v-if="selectedIds.includes(friend.id)" class="ri-check-line text-white text-xs"></i>
            </div>
          </div>
        </div>
        <div class="shrink-0 pt-4 mt-2 border-t border-slate-100">
          <button
            @click="$emit('submit')"
            :disabled="selectedIds.length === 0"
            class="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2"
          >
            <i class="ri-user-add-fill"></i> 确认邀请
          </button>
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
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'toggle-member', 'submit'])
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
