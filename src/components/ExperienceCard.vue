<template>
  <article
      @click="$emit('open')"
      :class="[
      'group relative w-full overflow-hidden cursor-pointer font-sans transition-all duration-500',
      'rounded-[24px] border',
      'shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.16)]',
      'hover:-translate-y-0.5 active:scale-[0.99]',
      themeWrap[theme] || themeWrap.editorial
    ]"
  >
    <!-- 背景层（动效/渐变） -->
    <div v-if="theme === 'midnight'" class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_60%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.25),transparent_55%)]"></div>
    </div>

    <div v-if="theme === 'sunrise'" class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-100 to-orange-200"></div>
      <div class="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-white/40 blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-rose-300/30 blur-3xl"></div>
    </div>

    <div v-if="theme === 'aurora'" class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-50"></div>
      <div class="absolute -top-20 right-0 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
      <div class="absolute -bottom-20 left-0 w-72 h-72 rounded-full bg-violet-200/40 blur-3xl"></div>
    </div>

    <div v-if="theme === 'ink'" class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_55%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_55%)]"></div>
    </div>

    <div v-if="theme === 'bloom'" class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100"></div>
      <div class="absolute -top-12 -right-10 w-52 h-52 rounded-full bg-rose-200/40 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-fuchsia-200/30 blur-3xl"></div>
    </div>

    <!-- 故事配图 -->
    <div v-if="coverImage" class="relative z-10 px-3 pt-3">
      <img :src="coverImage" class="w-full h-36 object-cover rounded-[18px]" />
    </div>

      <!-- 内容主体 -->
      <div class="relative z-10 flex flex-col h-full px-5 pt-5 pb-4">
        <!-- 顶部：图标徽章 + 日期 -->
        <header class="flex items-start justify-between mb-4">
          <div
              :class="[
              'w-10 h-10 rounded-[14px] flex items-center justify-center text-[20px] backdrop-blur-md shadow-sm',
              iconBadge[theme]
            ]"
          >
            {{ icon || '✦' }}
          </div>
          <div :class="['flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase', metaColor[theme]]">
            <span class="w-1 h-1 rounded-full" :class="dotColor[theme]"></span>
            {{ formatDate(date) }}
          </div>
        </header>

        <!-- 标题 -->
        <h3
            v-if="title"
            :class="[
            'text-[18px] leading-[1.3] tracking-tight mb-2.5',
            titleColor[theme]
          ]"
        >
          {{ title }}
        </h3>

        <!-- 摘要 -->
        <p
            :class="[
            'text-[13px] leading-[1.65] line-clamp-3 mb-4 flex-1',
            summaryColor[theme]
          ]"
        >
          {{ summary || '兄弟，这里是摘要内容...' }}
        </p>

        <!-- 底部：标签 + 互动 -->
        <footer class="flex items-center justify-between pt-3.5" :class="dividerColor[theme]">
          <div class="flex flex-wrap gap-1.5">
            <span
                v-for="tag in (tags || []).slice(0, 2)"
                :key="tag"
                :class="[
                'text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide',
                tagStyle[theme]
              ]"
            >
              {{ tag }}
            </span>
          </div>
          <div :class="['flex items-center gap-3 text-[11px] font-bold', metaColor[theme]]">
            <span class="flex items-center gap-1">
              <i class="ri-heart-3-line text-[13px]"></i> {{ likes ?? 0 }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri-chat-3-line text-[13px]"></i> {{ comments ?? 0 }}
            </span>
          </div>
        </footer>
      </div>

    <!-- 编辑层 -->
    <div
        v-if="canEdit"
        class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
    >
      <button
          @click.stop="$emit('delete')"
          class="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xl shadow-md text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all active:scale-90"
      >
        <i class="ri-delete-bin-line text-sm"></i>
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  id: Number,
  title: String,
  summary: String,
  icon: String,
  theme: { type: String, default: 'editorial' },
  date: String,
  tags: Array,
  coverImage: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  canEdit: { type: Boolean, default: false }
})
defineEmits(['delete', 'open'])

const formatDate = (date) => {
  if (!date) return ''
  return date.replace(/^\d{4}\./, '').replace(/\./g, '/')
}

// === 4 个克制高级主题 ===
// editorial: 杂志风 · 白底克制
// midnight: 深夜模式 · 深空蓝紫
// sunrise: 朝霞 · 暖色温柔
// aurora: 极光 · 清透柔光
const themeWrap = {
  editorial: 'bg-white border-slate-100/80',
  midnight: 'bg-slate-900 border-slate-800/50',
  sunrise: 'bg-transparent border-orange-200/60',
  aurora: 'bg-transparent border-white/80',
  ink: 'bg-slate-950 border-amber-500/20',
  bloom: 'bg-transparent border-rose-200/70'
}

const iconBadge = {
  editorial: 'bg-slate-50 border border-slate-100 text-slate-700',
  midnight: 'bg-white/10 border border-white/20 text-white',
  sunrise: 'bg-white/70 border border-white/80 text-rose-700',
  aurora: 'bg-white/70 border border-white/80 text-slate-700',
  ink: 'bg-amber-400/10 border border-amber-400/30 text-amber-300',
  bloom: 'bg-white/70 border border-white/80 text-rose-600'
}

const titleColor = {
  editorial: 'text-slate-900 font-black',
  midnight: 'text-white font-black',
  sunrise: 'text-slate-900 font-black',
  aurora: 'text-slate-900 font-black',
  ink: 'text-amber-50 font-black',
  bloom: 'text-rose-950 font-black'
}

const summaryColor = {
  editorial: 'text-slate-500',
  midnight: 'text-slate-300',
  sunrise: 'text-slate-700/90',
  aurora: 'text-slate-600',
  ink: 'text-slate-300',
  bloom: 'text-rose-900/70'
}

const metaColor = {
  editorial: 'text-slate-400',
  midnight: 'text-slate-400',
  sunrise: 'text-slate-600/80',
  aurora: 'text-slate-500',
  ink: 'text-amber-200/70',
  bloom: 'text-rose-500/80'
}

const dotColor = {
  editorial: 'bg-blue-500',
  midnight: 'bg-sky-400',
  sunrise: 'bg-rose-500',
  aurora: 'bg-violet-500',
  ink: 'bg-amber-400',
  bloom: 'bg-fuchsia-500'
}

const dividerColor = {
  editorial: 'border-t border-slate-100',
  midnight: 'border-t border-white/10',
  sunrise: 'border-t border-orange-200/60',
  aurora: 'border-t border-white/70',
  ink: 'border-t border-amber-400/15',
  bloom: 'border-t border-rose-200/60'
}

const tagStyle = {
  editorial: 'bg-slate-100 text-slate-700',
  midnight: 'bg-white/10 text-white/90 border border-white/15',
  sunrise: 'bg-white/70 text-rose-700 border border-white/80',
  aurora: 'bg-white/70 text-violet-700 border border-white/80',
  ink: 'bg-amber-400/10 text-amber-200 border border-amber-400/20',
  bloom: 'bg-white/70 text-fuchsia-700 border border-white/80'
}
</script>
