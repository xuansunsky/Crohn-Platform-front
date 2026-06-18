<template>
  <transition name="fade-up">
    <div v-if="show" class="fixed inset-0 z-[140] bg-slate-950/85 backdrop-blur-md flex flex-col justify-end" @click.self="$emit('close')">
      <div class="paper-river-sheet relative h-[88vh] rounded-t-[34px] border border-white/10 shadow-[0_-28px_80px_-34px_rgba(0,0,0,0.75)] flex flex-col overflow-hidden" @click.stop>
        <div class="paper-stars"></div>
        <div class="paper-moon"></div>
        <div class="paper-river"></div>
        <div class="paper-river-shine"></div>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-10"></div>

        <header class="relative z-10 shrink-0 px-6 pt-8 pb-4">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-[11px] font-black tracking-[0.22em] text-cyan-100/70 mb-1">星河漂流</p>
              <h2 class="text-[25px] font-black tracking-tight text-white leading-none">把心事放进河里</h2>
              <p class="text-[12px] text-cyan-50/70 font-medium mt-2 leading-relaxed">一天放飞两封，捞起两封。让它慢慢漂，不催它靠岸。</p>
            </div>
            <button @click="$emit('close')" class="w-9 h-9 rounded-full bg-white/10 text-white/70 border border-white/10 flex items-center justify-center active:scale-90 transition-all shrink-0">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2.5 mt-5">
            <div class="paper-quota-card">
              <p class="text-[10px] font-black tracking-[0.18em] text-cyan-100/70">今日可放</p>
              <div class="mt-1 flex items-end gap-1">
                <span class="text-[25px] font-black text-white leading-none">{{ quota.releaseRemaining }}</span>
                <span class="text-[11px] font-bold text-cyan-100/50 mb-0.5">/ {{ quota.releaseLimit }}</span>
              </div>
            </div>
            <div class="paper-quota-card">
              <p class="text-[10px] font-black tracking-[0.18em] text-cyan-100/70">今日可捞</p>
              <div class="mt-1 flex items-end gap-1">
                <span class="text-[25px] font-black text-white leading-none">{{ quota.scoopRemaining }}</span>
                <span class="text-[11px] font-bold text-cyan-100/50 mb-0.5">/ {{ quota.scoopLimit }}</span>
              </div>
            </div>
          </div>
        </header>

        <div class="relative z-10 shrink-0 px-6">
          <div class="flex bg-white/10 p-1 rounded-full gap-1 border border-white/10">
            <button @click="$emit('switch-tab', 'write')" :class="tab === 'write' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
              写一封
            </button>
            <button @click="$emit('switch-tab', 'scoop')" :class="tab === 'scoop' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
              捞一封
            </button>
            <button @click="$emit('switch-tab', 'history')" :class="tab === 'history' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
              记录
            </button>
          </div>
        </div>

        <div v-if="hint" class="relative z-10 mx-6 mt-3 rounded-2xl bg-amber-200/10 border border-amber-100/20 px-4 py-3 text-[12px] font-bold text-amber-100">
          {{ hint }}
        </div>

        <div class="relative z-10 flex-1 overflow-y-auto custom-scroll px-6 py-5 pb-6">
          <div v-if="tab === 'write'" class="space-y-4">
            <div class="relative">
              <textarea
                :value="text"
                @input="$emit('update:text', $event.target.value)"
                maxlength="280"
                rows="8"
                :disabled="isDisintegrating || quota.releaseRemaining <= 0"
                placeholder="写下此刻不想说出口的话。它会匿名漂走，不进入公开动态。"
                :class="[
                  'w-full bg-slate-950/40 border rounded-[24px] p-4 text-cyan-50 placeholder:text-cyan-100/40 text-[14px] font-medium outline-none transition-all resize-none leading-relaxed shadow-[0_18px_50px_-34px_rgba(0,0,0,0.8)] backdrop-blur-xl',
                  isDisintegrating ? 'border-cyan-100/10 text-transparent select-none cursor-default' : 'border-white/12 focus:border-cyan-200/32 focus:bg-slate-950/45',
                  quota.releaseRemaining <= 0 ? 'opacity-60' : ''
                ]"
              ></textarea>

              <div v-if="isDisintegrating" class="absolute inset-0 p-4 overflow-hidden pointer-events-none flex flex-wrap content-start gap-0.5">
                <span
                  v-for="(word, wIdx) in text.split('')"
                  :key="wIdx"
                  class="text-[13.5px] text-cyan-100/80 font-bold inline-block animate-disintegrate"
                  :style="getDisintegrateStyle()"
                >
                  {{ word === '\n' ? '' : word }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-cyan-50/45 font-bold">
              <span>{{ text.length }}/280</span>
              <span>剩余 {{ quota.releaseRemaining }} 封</span>
            </div>

            <button
              @click="$emit('release')"
              :disabled="!text.trim() || isDisintegrating || quota.releaseRemaining <= 0"
              class="w-full bg-white text-slate-950 hover:bg-cyan-50 disabled:bg-white/10 disabled:text-cyan-100/40 font-black text-[15px] py-4 rounded-[22px] active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0_16px_40px_-24px_rgba(255,255,255,0.7)]"
            >
              {{ quota.releaseRemaining <= 0 ? '今天的河面已经满了' : '放进河里' }}
            </button>
          </div>

          <div v-if="tab === 'scoop'" class="space-y-4">
            <div v-if="scoopedBoat" class="paper-floating-boat rounded-[28px] bg-white/10 border border-white/20 p-5 shadow-[0_20px_56px_-34px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in zoom-in duration-300">
              <div class="flex items-center justify-between gap-3 mb-4">
                <span class="text-[10px] text-cyan-100/70 font-black tracking-[0.2em]">匿名来信</span>
                <span class="text-[10px] text-cyan-100/50 font-bold">{{ scoopedBoat.time || '刚刚' }}</span>
              </div>

              <p class="text-[15px] text-cyan-50/90 leading-relaxed font-medium whitespace-pre-wrap">
                {{ scoopedBoat.content }}
              </p>

              <div class="grid grid-cols-3 gap-2 mt-5 text-center">
                <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                  <p class="text-[15px] font-black text-white">{{ scoopedBoat.breezeCount || 0 }}</p>
                  <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">微风</p>
                </div>
                <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                  <p class="text-[15px] font-black text-white">{{ scoopedBoat.replyCount || 0 }}</p>
                  <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">回声</p>
                </div>
                <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                  <p class="text-[15px] font-black text-white">{{ scoopedBoat.giftCount || 0 }}</p>
                  <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">礼物</p>
                </div>
              </div>
            </div>

            <div v-if="scoopedBoat" class="rounded-[24px] bg-slate-950/28 border border-white/10 p-4 space-y-3 backdrop-blur-xl">
              <textarea
                :value="replyText"
                @input="$emit('update:reply-text', $event.target.value)"
                rows="3"
                maxlength="180"
                :disabled="scoopedBoat.replied"
                placeholder="写一句只给这只纸船的私密回声。"
                class="w-full bg-white/10 border border-white/10 rounded-2xl px-3.5 py-3 text-[13px] text-cyan-50 placeholder:text-cyan-100/40 font-medium outline-none focus:bg-white/10 focus:border-cyan-200/30 transition-all resize-none leading-relaxed disabled:opacity-60"
              ></textarea>

              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="gift in gifts"
                  :key="gift.type"
                  @click="$emit('update:selected-gift', gift.type)"
                  :disabled="scoopedBoat.gifted"
                  :class="[
                    'rounded-2xl border px-3 py-2.5 text-left transition-all active:scale-[0.98] disabled:opacity-55',
                    selectedGift === gift.type ? 'bg-white text-slate-950 border-white' : 'bg-white/10 text-cyan-50/70 border-white/10'
                  ]"
                >
                  <div class="text-[17px] leading-none">{{ gift.icon }}</div>
                  <div class="text-[11px] font-black mt-1">{{ gift.label }}</div>
                </button>
              </div>

              <div class="grid grid-cols-3 gap-2 pt-1">
                <button
                  @click="$emit('respond', 'reply')"
                  :disabled="!replyText.trim() || scoopedBoat.replied || isResponding"
                  class="py-3 rounded-2xl bg-white text-slate-950 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all"
                >
                  {{ scoopedBoat.replied ? '已回应' : '回一声' }}
                </button>
                <button
                  @click="$emit('respond', 'gift')"
                  :disabled="scoopedBoat.gifted || isResponding"
                  class="py-3 rounded-2xl bg-amber-200/20 text-amber-100 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all border border-amber-100/20"
                >
                  {{ scoopedBoat.gifted ? '已送礼' : '送礼物' }}
                </button>
                <button
                  @click="$emit('breeze')"
                  :disabled="scoopedBoat.breezed"
                  class="py-3 rounded-2xl bg-cyan-200/20 text-cyan-100 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all border border-cyan-100/20"
                >
                  {{ scoopedBoat.breezed ? '已吹过' : '微风' }}
                </button>
              </div>
            </div>

            <div v-if="!scoopedBoat" class="rounded-[28px] bg-white/10 border border-dashed border-cyan-100/20 p-8 text-center backdrop-blur-xl">
              <div class="w-14 h-14 mx-auto rounded-full bg-white/10 text-cyan-100/70 flex items-center justify-center mb-4 border border-white/10">
                <i class="ri-ship-2-line text-2xl"></i>
              </div>
              <p class="text-[14px] font-black text-white">河面很安静</p>
              <p class="text-[12px] text-cyan-50/70 mt-1 leading-relaxed">今天还可以捞 {{ quota.scoopRemaining }} 封匿名心事。</p>
            </div>

            <button
              @click="$emit('scoop')"
              :disabled="isScoopLoading || quota.scoopRemaining <= 0"
              class="w-full bg-white text-slate-950 hover:bg-cyan-50 disabled:bg-white/10 disabled:text-cyan-100/40 font-black text-[15px] py-4 rounded-[22px] active:scale-[0.98] transition-all shadow-[0_16px_40px_-24px_rgba(255,255,255,0.7)]"
            >
              {{ quota.scoopRemaining <= 0 ? '今天先不打扰河面了' : (scoopedBoat ? '再捞一封' : '捞起一封') }}
            </button>
          </div>

          <div v-if="tab === 'history'" class="space-y-5">
            <div class="paper-history-hero rounded-[28px] p-5 border border-white/12 backdrop-blur-xl">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[10px] text-cyan-100/55 font-black tracking-[0.2em]">河流记得</p>
                  <h3 class="text-[20px] text-white font-black mt-1 tracking-tight">你的纸船记录</h3>
                  <p class="text-[12px] text-cyan-50/65 mt-2 leading-relaxed">写过的心事、捞起的来信，都会安静留在这里。</p>
                </div>
                <button
                  @click="$emit('load-history', true)"
                  :disabled="isHistoryLoading"
                  class="w-10 h-10 rounded-2xl bg-white/10 text-cyan-50 border border-white/10 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 shrink-0"
                >
                  <i class="ri-refresh-line" :class="{ 'animate-spin': isHistoryLoading }"></i>
                </button>
              </div>
            </div>

            <div v-if="isHistoryLoading" class="rounded-[28px] bg-white/10 border border-white/10 p-8 text-center backdrop-blur-xl">
              <div class="w-12 h-12 mx-auto rounded-full bg-white/10 text-cyan-100 flex items-center justify-center mb-4">
                <i class="ri-loader-4-line text-2xl animate-spin"></i>
              </div>
              <p class="text-[13px] font-black text-cyan-50">正在翻找河面记忆</p>
            </div>

            <template v-else>
              <div class="space-y-3">
                <div class="flex items-end justify-between">
                  <h4 class="text-[15px] font-black text-white">我放飞的</h4>
                  <span class="text-[11px] font-bold text-cyan-100/45">{{ history.released.length }} 封</span>
                </div>

                <div v-if="history.released.length === 0" class="paper-history-empty">
                  还没有放飞过纸船。
                </div>

                <article v-for="boat in history.released" :key="'released-' + boat.id" class="paper-history-card">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <span class="text-[10px] font-black tracking-[0.18em] text-cyan-100/50">匿名心事</span>
                    <span class="text-[10px] font-bold text-cyan-100/60">{{ formatTime(boat.createdAt) }}</span>
                  </div>
                  <p class="text-[13.5px] leading-relaxed text-cyan-50/90 whitespace-pre-wrap">{{ boat.content }}</p>
                  <div class="grid grid-cols-3 gap-2 mt-4">
                    <div class="paper-history-stat">
                      <b>{{ boat.breezeCount || 0 }}</b>
                      <span>微风</span>
                    </div>
                    <div class="paper-history-stat">
                      <b>{{ boat.replyCount || 0 }}</b>
                      <span>回声</span>
                    </div>
                    <div class="paper-history-stat">
                      <b>{{ boat.giftCount || 0 }}</b>
                      <span>礼物</span>
                    </div>
                  </div>
                </article>
              </div>

              <div class="space-y-3">
                <div class="flex items-end justify-between">
                  <h4 class="text-[15px] font-black text-white">我捞到的</h4>
                  <span class="text-[11px] font-bold text-cyan-100/45">{{ history.scooped.length }} 封</span>
                </div>

                <div v-if="history.scooped.length === 0" class="paper-history-empty">
                  还没有捞起过纸船。
                </div>

                <article v-for="boat in history.scooped" :key="'scooped-' + boat.id + '-' + boat.scoopedAt" class="paper-history-card">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <span class="text-[10px] font-black tracking-[0.18em] text-cyan-100/50">捞起的来信</span>
                    <span class="text-[10px] font-bold text-cyan-100/60">{{ formatTime(boat.scoopedAt || boat.createdAt) }}</span>
                  </div>
                  <p class="text-[13.5px] leading-relaxed text-cyan-50/90 whitespace-pre-wrap">{{ boat.content }}</p>

                  <div v-if="boat.replyContent || boat.giftType || boat.breezed" class="mt-4 space-y-2">
                    <div v-if="boat.replyContent" class="paper-history-note">
                      <span>我的回声</span>
                      <p>{{ boat.replyContent }}</p>
                    </div>
                    <div v-if="boat.giftType" class="paper-history-note">
                      <span>送过礼物</span>
                      <p>{{ giftLabel(boat.giftType) }}</p>
                    </div>
                    <div v-if="boat.breezed" class="paper-history-note">
                      <span>微风</span>
                      <p>你给它吹过一阵风</p>
                    </div>
                  </div>
                </article>
              </div>
            </template>
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
  tab: {
    type: String,
    default: 'write'
  },
  quota: {
    type: Object,
    default: () => ({
      releaseLimit: 2,
      scoopLimit: 2,
      releaseRemaining: 2,
      scoopRemaining: 2
    })
  },
  hint: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  isDisintegrating: {
    type: Boolean,
    default: false
  },
  scoopedBoat: {
    type: Object,
    default: null
  },
  replyText: {
    type: String,
    default: ''
  },
  gifts: {
    type: Array,
    default: () => []
  },
  selectedGift: {
    type: String,
    default: 'warm_water'
  },
  isResponding: {
    type: Boolean,
    default: false
  },
  isScoopLoading: {
    type: Boolean,
    default: false
  },
  history: {
    type: Object,
    default: () => ({ released: [], scooped: [] })
  },
  isHistoryLoading: {
    type: Boolean,
    default: false
  },
  formatTime: {
    type: Function,
    default: () => '刚刚'
  },
  giftLabel: {
    type: Function,
    default: () => '一份小礼物'
  },
  getDisintegrateStyle: {
    type: Function,
    default: () => () => ({})
  }
})

defineEmits([
  'close',
  'switch-tab',
  'release',
  'respond',
  'breeze',
  'scoop',
  'load-history',
  'update:text',
  'update:reply-text',
  'update:selected-gift'
])
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

.animate-disintegrate {
  animation: disintegrate 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  --rand-x: 0px;
  --rand-y: 0px;
  --rand-r: 0deg;
}

.paper-river-sheet {
  background:
    radial-gradient(circle at 74% 12%, rgba(248, 244, 198, 0.18), transparent 8rem),
    radial-gradient(circle at 18% 24%, rgba(125, 92, 255, 0.18), transparent 11rem),
    linear-gradient(180deg, #090d21 0%, #0b132a 46%, #071224 100%);
}

.paper-stars,
.paper-stars::before,
.paper-stars::after {
  position: absolute;
  inset: 0;
  content: "";
  pointer-events: none;
}

.paper-stars {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 1.4px),
    radial-gradient(circle, rgba(147, 197, 253, 0.48) 0 1px, transparent 1.6px);
  background-position: 18px 22px, 94px 64px;
  background-size: 92px 92px, 138px 138px;
  opacity: 0.42;
  animation: paper-stars-drift 20s linear infinite;
}

.paper-stars::before {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.88) 0 1px, transparent 1.4px),
    radial-gradient(circle, rgba(251, 191, 36, 0.56) 0 1px, transparent 1.5px);
  background-position: 42px 18px, 130px 92px;
  background-size: 156px 156px, 218px 218px;
  opacity: 0.35;
  animation: paper-stars-pulse 5s ease-in-out infinite;
}

.paper-stars::after {
  background:
    linear-gradient(120deg, transparent 0 42%, rgba(255, 255, 255, 0.28) 48%, transparent 54% 100%) 0 12% / 210px 1px no-repeat;
  opacity: 0.58;
  animation: paper-shooting-star 5.8s ease-in-out infinite;
}

.paper-moon {
  position: absolute;
  right: 32px;
  top: 54px;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: radial-gradient(circle at 32% 30%, #fff9d8 0%, #f8d88b 42%, rgba(248, 216, 139, 0.05) 72%);
  box-shadow: 0 0 38px rgba(248, 216, 139, 0.26);
  opacity: 0.5;
  pointer-events: none;
}

.paper-river {
  position: absolute;
  left: -18%;
  right: -18%;
  bottom: -9%;
  height: 42%;
  pointer-events: none;
  background:
    linear-gradient(165deg, transparent 0 18%, rgba(37, 99, 235, 0.14) 30%, rgba(20, 184, 166, 0.24) 52%, rgba(129, 140, 248, 0.14) 72%, transparent 88%),
    linear-gradient(8deg, rgba(14, 165, 233, 0.18), rgba(49, 46, 129, 0.05));
  border-radius: 48% 52% 0 0 / 36% 38% 0 0;
  filter: blur(0.4px);
  opacity: 0.78;
  transform: rotate(-4deg);
  animation: paper-river-breathe 8s ease-in-out infinite;
}

.paper-river::before,
.paper-river::after {
  position: absolute;
  left: -8%;
  right: -8%;
  content: "";
  border-radius: 999px;
  pointer-events: none;
}

.paper-river::before {
  top: 26%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(186, 230, 253, 0.42), transparent);
  animation: paper-river-line 5.5s linear infinite;
}

.paper-river::after {
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.28), transparent);
  animation: paper-river-line 7s linear infinite reverse;
}

.paper-river-shine {
  position: absolute;
  left: 9%;
  right: 9%;
  bottom: 9%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  opacity: 0.32;
  pointer-events: none;
}

.paper-quota-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 34px -28px rgba(0, 0, 0, 0.8);
  padding: 12px 16px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.paper-floating-boat {
  position: relative;
  animation: paper-boat-float 4.8s ease-in-out infinite;
}

.paper-floating-boat::before {
  position: absolute;
  right: 18px;
  top: -13px;
  content: "⛵";
  color: rgba(255, 255, 255, 0.82);
  font-size: 24px;
  filter: drop-shadow(0 10px 18px rgba(14, 165, 233, 0.22));
  transform: rotate(-7deg);
}

.paper-history-hero {
  background:
    radial-gradient(circle at 92% 12%, rgba(251, 191, 36, 0.18), transparent 5rem),
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(14, 165, 233, 0.07));
  box-shadow: 0 20px 54px -34px rgba(0, 0, 0, 0.9);
}

.paper-history-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(240, 249, 255, 0.92);
  box-shadow: 0 18px 46px -34px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: 16px;
}

.paper-history-card > p {
  color: rgba(240, 249, 255, 0.92) !important;
}

.paper-history-empty {
  border: 1px dashed rgba(186, 230, 253, 0.16);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(224, 242, 254, 0.58);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  padding: 18px;
}

.paper-history-stat {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 6px;
  text-align: center;
}

.paper-history-stat b {
  display: block;
  color: white;
  font-size: 14px;
  line-height: 1;
}

.paper-history-stat span {
  display: block;
  color: rgba(224, 242, 254, 0.44);
  font-size: 10px;
  font-weight: 800;
  margin-top: 4px;
}

.paper-history-note {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.28);
  padding: 10px 12px;
}

.paper-history-note span {
  display: block;
  color: rgba(186, 230, 253, 0.5);
  font-size: 10px;
  font-weight: 900;
  margin-bottom: 4px;
}

.paper-history-note p {
  margin: 0;
  color: rgba(240, 249, 255, 0.86);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.55;
}

@keyframes disintegrate {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--rand-x), var(--rand-y), 0) rotate(var(--rand-r));
  }
}

@keyframes paper-stars-drift {
  from { background-position: 18px 22px, 94px 64px; }
  to { background-position: 110px 114px, 232px 202px; }
}

@keyframes paper-stars-pulse {
  0%, 100% { opacity: 0.22; }
  50% { opacity: 0.48; }
}

@keyframes paper-shooting-star {
  0%, 54% {
    transform: translate3d(-45%, 0, 0);
    opacity: 0;
  }
  62% {
    opacity: 0.6;
  }
  76%, 100% {
    transform: translate3d(120%, 0, 0);
    opacity: 0;
  }
}

@keyframes paper-river-breathe {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg) scaleY(1); }
  50% { transform: translate3d(2%, -2%, 0) rotate(-3deg) scaleY(1.06); }
}

@keyframes paper-river-line {
  from { transform: translateX(-22%); }
  to { transform: translateX(22%); }
}

@keyframes paper-boat-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.2deg); }
  50% { transform: translate3d(0, -4px, 0) rotate(0.4deg); }
}
</style>
