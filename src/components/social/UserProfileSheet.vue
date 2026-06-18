<template>
  <transition name="fade-up">
    <div
      v-if="show"
      class="fixed inset-0 z-[170] bg-slate-900/55 backdrop-blur-md flex flex-col justify-end"
      @click.self="$emit('close')"
    >
      <div
        class="relative bg-[#FBF9F5] rounded-t-[34px] max-h-[82vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]"
        @click.stop
      >
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

        <header class="relative shrink-0 px-6 pt-8 pb-8 overflow-hidden">
          <div v-if="user?.profileCover" class="absolute inset-0 pointer-events-none">
            <img :src="user.profileCover" class="w-full h-full object-cover opacity-75">
            <div class="absolute inset-0 bg-gradient-to-b from-white/25 via-white/56 to-[#FBF9F5]"></div>
          </div>
          <div class="relative z-10 flex justify-between items-start gap-3">
            <div class="flex items-center gap-4 min-w-0">
              <img :src="avatarOf(user, user?.userId)" class="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md bg-slate-100">
              <div class="min-w-0">
                <div class="flex items-center gap-2 min-w-0">
                  <h2 class="text-[23px] font-black text-slate-950 tracking-tight truncate">{{ displayName }}</h2>
                  <button
                    v-if="canRemark"
                    @click="$emit('edit-remark')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 active:scale-95 transition-all"
                  >
                    {{ remark ? '改备注' : '+备注' }}
                  </button>
                </div>
                <p v-if="remark" class="text-[11px] text-slate-400 font-bold mt-0.5 truncate">昵称：{{ user?.nickname }}</p>
                <p v-if="user?.radarSign" class="text-[12px] text-slate-500 font-bold mt-1 truncate">{{ user.radarSign }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span v-if="user?.verified" class="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                    <i class="ri-shield-check-fill"></i> 已认证
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                    编号 {{ user?.userId }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="$emit('close')" class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="relative z-10 flex-1 overflow-y-auto custom-scroll px-6 pt-3 pb-6 space-y-3">
          <p v-if="loading" class="text-center py-12 text-[13px] text-slate-400 font-bold">加载资料中...</p>

          <template v-else>
            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <div class="flex items-start gap-3">
                <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                  {{ user?.emoji || '🌙' }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[11px] font-black text-slate-400 tracking-[0.14em] mb-1">当前状态</p>
                  <h3 class="text-[16px] font-black text-slate-900 tracking-tight">{{ user?.text || '暂未设置状态' }}</h3>
                  <p class="text-[12px] text-slate-500 leading-relaxed mt-1">{{ user?.description || '对方还没有留下更多说明。' }}</p>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-3 gap-2">
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ user?.reactions || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">收到关心</p>
              </div>
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ profileData?.iSent || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">我送出</p>
              </div>
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ profileData?.theySent || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">对方回应</p>
              </div>
            </section>

            <section v-if="user?.reactors?.length" class="bg-white rounded-[24px] border border-white/80 p-4">
              <p class="text-[12px] font-black text-slate-900 mb-3">最近关心对方的人</p>
              <div class="flex -space-x-2">
                <img v-for="(reactor, idx) in user.reactors" :key="idx" :src="avatarOf(reactor, idx)" class="w-8 h-8 rounded-full border-2 border-white bg-slate-100">
              </div>
            </section>

            <section @click="$emit('open-moments')" class="bg-white rounded-[24px] border border-white/80 p-4 active:scale-[0.99] transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-3">
                <p class="text-[12px] font-black text-slate-900">对方的朋友圈</p>
                <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  {{ moments.length }} 条
                  <i v-if="moments.length" class="ri-arrow-right-s-line text-sm"></i>
                </span>
              </div>
              <p v-if="momentsLoading" class="text-center py-6 text-[12px] text-slate-400 font-bold">正在加载动态...</p>
              <p v-else-if="moments.length === 0" class="text-center py-6 text-[12px] text-slate-400 font-bold">暂时没有可见动态</p>
              <div v-else class="space-y-3">
                <article v-for="post in previewMoments" :key="post.id" class="rounded-2xl bg-stone-50/80 border border-stone-100 p-3">
                  <div class="flex items-center justify-between gap-3 mb-2">
                    <span class="text-[11px] font-bold text-slate-400">{{ post.time }}</span>
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="momentVisibilityMeta(post.visibility).class">
                      {{ momentVisibilityMeta(post.visibility).label }}
                    </span>
                  </div>
                  <p class="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
                  <div v-if="post.images?.length" class="grid grid-cols-3 gap-1.5 mt-2">
                    <img
                      v-for="(img, idx) in post.images.slice(0, 3)"
                      :key="idx"
                      :src="img"
                      @click.stop="$emit('open-image', post.images, idx)"
                      class="w-full aspect-square object-cover rounded-xl bg-slate-100"
                    >
                  </div>
                </article>
                <p v-if="moments.length > 2" class="text-center text-[11px] font-bold text-slate-400 pt-1">点击查看全部动态</p>
              </div>
            </section>

            <section v-if="profileData && profileData.myUnlocked === false" class="bg-amber-50 border border-amber-100 rounded-[22px] p-4 text-[12px] text-amber-700 font-bold leading-relaxed">
              上传病例认证后，可以查看更多资料。当前只展示基础状态。
            </section>
          </template>
        </div>

        <footer v-if="!loading" class="relative z-10 shrink-0 grid grid-cols-2 gap-2 px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,8px)+16px)] bg-[#FBF9F5]/95 border-t border-stone-100">
          <button
            @click="$emit('care')"
            :disabled="user?.reactedToday"
            class="py-3.5 rounded-2xl text-[13px] font-black active:scale-95 transition-all"
            :class="user?.reactedToday ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white'"
          >
            {{ user?.reactedToday ? '今天已关心' : '送上关心' }}
          </button>
          <button
            @click="$emit('start-chat')"
            :disabled="isSelf"
            class="py-3.5 rounded-2xl text-[13px] font-black bg-blue-600 text-white disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all"
          >
            发起密聊
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { avatarOf } from '@/utils/avatarPool'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  profileData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  moments: {
    type: Array,
    default: () => []
  },
  momentsLoading: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String,
    default: '神秘朋友'
  },
  remark: {
    type: String,
    default: ''
  },
  canRemark: {
    type: Boolean,
    default: false
  },
  myId: {
    type: Number,
    default: 0
  },
  momentVisibilityMeta: {
    type: Function,
    required: true
  }
})

defineEmits(['close', 'edit-remark', 'open-moments', 'care', 'start-chat', 'open-image'])

const isSelf = computed(() => Number(props.user?.userId) === Number(props.myId))
const previewMoments = computed(() => props.moments.slice(0, 2))
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
