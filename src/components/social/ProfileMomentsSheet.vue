<template>
  <transition name="fade-up">
    <div
      v-if="show"
      class="fixed inset-0 z-[185] bg-slate-900/55 backdrop-blur-md flex flex-col justify-end"
      @click.self="$emit('close')"
    >
      <div
        class="relative bg-[#FBF9F5] rounded-t-[34px] h-[86vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]"
        @click.stop
      >
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

        <header class="shrink-0 px-6 pt-8 pb-4 border-b border-stone-100/80">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <img :src="avatarOf(user, user?.userId)" class="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm bg-slate-100">
              <div class="min-w-0">
                <h2 class="text-[18px] font-black text-slate-950 truncate">{{ title }}</h2>
                <p class="text-[11px] text-slate-400 font-bold mt-0.5">{{ moments.length }} 条可见动态</p>
              </div>
            </div>
            <button @click="$emit('close')" class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scroll px-5 py-4 pb-[calc(env(safe-area-inset-bottom,8px)+20px)] space-y-3.5">
          <p v-if="moments.length === 0" class="text-center py-16 text-[13px] text-slate-400 font-bold">暂时没有可见动态</p>
          <article
            v-for="post in moments"
            :key="post.id"
            class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.32)]"
          >
            <div class="flex items-center justify-between gap-3 mb-3">
              <span class="text-[11px] font-bold text-slate-400">{{ post.time }}</span>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="momentVisibilityMeta(post.visibility).class">
                  {{ momentVisibilityMeta(post.visibility).label }}
                </span>
                <button
                  v-if="post.isMine"
                  @click.stop="$emit('edit-moment', post)"
                  class="w-6 h-6 rounded-full text-slate-300 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center active:scale-90 transition-all"
                  aria-label="编辑动态"
                >
                  <i class="ri-edit-2-line text-[13px]"></i>
                </button>
                <button
                  v-if="post.isMine"
                  @click.stop="$emit('delete-moment', post)"
                  class="w-6 h-6 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center active:scale-90 transition-all"
                  aria-label="删除动态"
                >
                  <i class="ri-delete-bin-6-line text-[13px]"></i>
                </button>
              </div>
            </div>
            <p class="text-[14px] text-slate-700 leading-[1.75] whitespace-pre-line">{{ post.content }}</p>
            <div v-if="post.images?.length" :class="imageGridClass(post.images.length)" class="grid gap-1.5 mt-3">
              <img
                v-for="(img, idx) in post.images"
                :key="idx"
                :src="img"
                @click="$emit('open-image', post.images, idx)"
                class="w-full object-cover rounded-2xl bg-slate-100 cursor-pointer"
                :class="post.images.length === 1 ? 'aspect-[4/3]' : 'aspect-square'"
              >
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
              <span class="text-[11px] font-bold text-slate-400">{{ post.likesCount }} 共鸣 · {{ post.comments?.length || 0 }} 回复</span>
              <button @click.stop="$emit('toggle-like', post)" class="flex items-center gap-1 text-[11.5px] font-black text-rose-500 active:scale-90 transition-all">
                <i :class="post.liked ? 'ri-heart-fill' : 'ri-heart-line'" class="text-base"></i>
                {{ post.likesCount }}
              </button>
            </div>
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
  user: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: '朋友圈'
  },
  moments: {
    type: Array,
    default: () => []
  },
  momentVisibilityMeta: {
    type: Function,
    required: true
  },
  imageGridClass: {
    type: Function,
    required: true
  }
})

defineEmits(['close', 'edit-moment', 'delete-moment', 'open-image', 'toggle-like'])
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
