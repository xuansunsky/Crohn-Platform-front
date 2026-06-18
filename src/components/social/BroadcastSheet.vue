<template>
  <transition name="fade-up">
    <div v-if="show" class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end" @click.self="$emit('close')">
      <div class="bg-white rounded-t-[36px] p-6 flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative" @click.stop>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
        <div class="flex justify-between items-center mb-2 mt-4 shrink-0">
          <h2 class="text-slate-900 text-[20px] font-black tracking-tight">群发广播</h2>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </div>
        <p class="text-[12px] text-slate-400 font-medium mb-4">先选人，再发送。不会默认打扰所有人。</p>
        <div class="max-h-44 overflow-y-auto custom-scroll space-y-2 mb-4">
          <button
            v-for="friend in friends"
            :key="friend.id"
            @click="$emit('toggle-receiver', friend.id)"
            class="w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left active:scale-[0.99] transition-all"
            :class="receiverIds.includes(friend.id) ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'"
          >
            <img :src="friend.avatar" class="w-9 h-9 rounded-2xl object-cover bg-white shrink-0">
            <span class="flex-1 min-w-0 text-[13px] font-black text-slate-700 truncate">{{ friend.name }}</span>
            <i :class="receiverIds.includes(friend.id) ? 'ri-checkbox-circle-fill text-rose-500' : 'ri-checkbox-blank-circle-line text-slate-300'" class="text-xl"></i>
          </button>
          <p v-if="friends.length === 0" class="text-center py-6 text-[12px] text-slate-400 font-bold">还没有好友可以广播</p>
        </div>
        <div class="flex gap-2 mb-3">
          <button @click="$emit('select-all')" class="flex-1 py-2 rounded-xl bg-slate-100 text-[11px] font-black text-slate-600 active:scale-95">全选</button>
          <button @click="$emit('clear')" class="flex-1 py-2 rounded-xl bg-slate-100 text-[11px] font-black text-slate-600 active:scale-95">清空</button>
        </div>
        <textarea
          :value="text"
          @input="$emit('update:text', $event.target.value)"
          rows="4"
          placeholder="想对全体战友说点什么?如:今晚八段锦走起!"
          class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-rose-400 focus:bg-white transition-all resize-none mb-4"
        ></textarea>
        <button
          @click="$emit('send')"
          :disabled="sending || !text.trim() || receiverIds.length === 0"
          class="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <i class="ri-broadcast-line" :class="{ 'animate-pulse': sending }"></i>
          {{ sending ? '广播中...' : `发给 ${receiverIds.length} 人` }}
        </button>
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
  receiverIds: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ''
  },
  sending: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'toggle-receiver', 'select-all', 'clear', 'send', 'update:text'])
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
