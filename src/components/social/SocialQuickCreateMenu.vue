<template>
  <Teleport to="body">
    <transition name="fade-up">
      <div v-if="show" class="fixed inset-0 z-[500]" @click="$emit('close')">
        <div
          @click.stop
          class="fixed top-[calc(env(safe-area-inset-top,0px)+3.6rem)] right-4 w-40 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_18px_42px_-24px_rgba(15,23,42,0.45)] overflow-hidden p-1.5"
        >
          <button
            type="button"
            @click.stop.prevent="$emit('add-friend')"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-700 active:bg-slate-100 transition-all"
          >
            <span class="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><i class="ri-user-add-line"></i></span>
            添加好友
          </button>
          <button
            type="button"
            @click.stop.prevent="$emit('compose')"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-700 active:bg-slate-100 transition-all"
          >
            <span class="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center"><i class="ri-quill-pen-line"></i></span>
            发动态
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'add-friend', 'compose'])
</script>
