<template>
  <transition name="fade-up">
    <div v-if="show" class="fixed inset-0 z-[150] bg-slate-900/45 backdrop-blur-md flex flex-col justify-end" @click.self="$emit('close')">
      <div class="relative h-[88vh] bg-[#FBF9F5] rounded-t-[34px] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]" @click.stop>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

        <header class="shrink-0 px-5 pt-8 pb-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative shrink-0">
                <img :src="edit.avatar || activeChat?.avatar" class="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md bg-slate-100">
                <button
                  v-if="isOwner"
                  @click="$emit('pick-avatar')"
                  class="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center border-2 border-[#FBF9F5] active:scale-90 transition-all"
                >
                  <i class="ri-camera-line text-sm"></i>
                </button>
                <input :id="avatarInputId" type="file" accept="image/*" class="hidden" @change="$emit('avatar-change', $event)" />
              </div>

              <div class="min-w-0">
                <p class="text-[11px] font-black tracking-[0.16em] text-violet-500 mb-1">小队资料</p>
                <h2 class="text-[24px] font-black text-slate-950 tracking-tight truncate">{{ edit.name || activeChat?.name }}</h2>
                <p class="text-[12px] text-slate-400 font-bold mt-1">{{ members.length }} 位成员 · {{ isOwner ? '你是队长' : '队员' }}</p>
              </div>
            </div>

            <button @click="$emit('close')" class="w-9 h-9 flex items-center justify-center bg-white rounded-full text-slate-500 active:scale-90 transition-all shrink-0 shadow-sm">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scroll px-5 pb-5 space-y-4">
          <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-[14px] font-black text-slate-900">小队信息</h3>
              <button v-if="isOwner" @click="$emit('toggle-edit')" class="text-[12px] font-black text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                {{ mode === 'edit' ? '收起编辑' : '编辑资料' }}
              </button>
            </div>

            <div v-if="mode !== 'edit'" class="space-y-2">
              <p class="text-[12px] text-slate-400 font-bold">公告</p>
              <p class="text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{{ edit.notice || '队长还没有写公告。' }}</p>
            </div>

            <div v-else class="space-y-3">
              <input
                :value="edit.name"
                @input="$emit('update-edit', { ...edit, name: $event.target.value })"
                type="text"
                placeholder="小队名称"
                class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-800 outline-none focus:bg-white focus:border-violet-200 transition-all"
              >
              <textarea
                :value="edit.notice"
                @input="$emit('update-edit', { ...edit, notice: $event.target.value })"
                rows="4"
                placeholder="写一段小队公告：目标、边界、互助规则..."
                class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:border-violet-200 transition-all resize-none leading-relaxed"
              ></textarea>
              <button @click="$emit('save')" :disabled="saving" class="w-full bg-slate-950 text-white py-3.5 rounded-2xl text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-300">
                {{ saving ? '保存中...' : '保存小队资料' }}
              </button>
            </div>
          </section>

          <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-[14px] font-black text-slate-900">成员</h3>
              <button @click="$emit('open-invite')" class="text-[12px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                邀请
              </button>
            </div>

            <p v-if="loading" class="text-center text-[13px] text-slate-400 font-bold py-10">加载成员中...</p>
            <div v-else class="space-y-1">
              <div v-for="member in members" :key="member.userId" class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all">
                <button @click="$emit('open-user', member.userId)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <img :src="avatarOf(member, member.userId)" class="w-11 h-11 rounded-2xl border border-white shadow-sm object-cover bg-slate-100">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-[14.5px] font-bold text-slate-800 truncate">{{ member.nickname || '神秘队员' }}</h4>
                    <span class="text-[11px] text-slate-400 font-medium">{{ Number(member.userId) === Number(myId) ? '我自己' : '查看资料' }}</span>
                  </div>
                </button>
                <span v-if="member.role === 'OWNER'" class="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                  <i class="ri-vip-crown-fill"></i> 队长
                </span>
                <button v-else-if="isOwner" @click="$emit('remove-member', member)" class="text-[10px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full active:scale-95 transition-all shrink-0">
                  移出
                </button>
                <span v-else class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">队员</span>
              </div>
            </div>
          </section>

          <button @click="$emit('leave')" class="w-full py-4 rounded-[22px] bg-white text-rose-500 border border-rose-100 text-[14px] font-black active:scale-95 transition-all">
            <i class="ri-logout-box-r-line"></i> 退出这个小队
          </button>
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
  activeChat: {
    type: Object,
    default: null
  },
  edit: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'view'
  },
  members: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  myId: {
    type: Number,
    default: 0
  },
  avatarInputId: {
    type: String,
    default: 'group-avatar-input'
  }
})

defineEmits(['close', 'pick-avatar', 'avatar-change', 'toggle-edit', 'update-edit', 'save', 'open-invite', 'open-user', 'remove-member', 'leave'])
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
