<template>
  <article
    @click="$emit('open')"
    :class="[
      'group relative w-full overflow-hidden cursor-pointer rounded-2xl break-inside-avoid mb-2.5 active:scale-[0.98] transition-all border',
      themeStyle.cardClass
    ]"
  >
    <!-- 主题光晕装饰（彩色主题才有） -->
    <div v-if="themeStyle.glow" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-8 -right-6 w-24 h-24 rounded-full blur-2xl" :class="themeStyle.glow"></div>
    </div>

    <!-- 封面 / 视频 -->
    <div v-if="coverImage" class="relative w-full bg-stone-100 overflow-hidden">
      <video
        v-if="isVideoCover"
        :src="coverImage"
        class="w-full h-auto max-h-[240px] min-h-[120px] object-cover block pointer-events-none"
        muted
        playsinline
        preload="metadata"
      ></video>
      <img
        v-else
        :src="coverImage"
        class="w-full h-auto max-h-[240px] min-h-[120px] object-cover block"
        loading="lazy"
        alt=""
      />
      <!-- 表情角标 -->
      <span
        v-if="icon"
        class="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-[15px] backdrop-blur-md shadow-sm"
        :class="themeStyle.iconBadge"
      >{{ icon }}</span>
      <span
        v-if="isVideoCover"
        class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/45 flex items-center justify-center text-white pointer-events-none"
      >
        <i class="ri-play-mini-fill text-sm"></i>
      </span>
    </div>

    <!-- 文案区 -->
    <div class="relative z-10 px-2.5 py-2.5">
      <!-- 无封面：表情 + 大标题（文字卡） -->
      <div v-if="!coverImage" class="flex items-start gap-2 mb-2.5 pt-1">
        <span v-if="icon" class="text-[20px] leading-none shrink-0">{{ icon }}</span>
        <p class="text-[15px] font-bold leading-snug line-clamp-4" :class="themeStyle.titleClass">
          {{ title || '暂无标题' }}
        </p>
      </div>

      <!-- 有封面：标题 -->
      <h3
        v-else-if="title"
        class="text-[13px] font-semibold leading-[1.45] line-clamp-2 mb-2"
        :class="themeStyle.titleClass"
      >
        {{ title }}
      </h3>

      <!-- 无封面时显示摘要 -->
      <p
        v-if="!coverImage && summary"
        class="text-[12px] leading-relaxed line-clamp-2 mb-2"
        :class="themeStyle.subClass"
      >
        {{ summary }}
      </p>

      <!-- 标签 + 地点 -->
      <div v-if="displayTag || location" class="mb-2 flex items-center gap-1.5 min-w-0">
        <span v-if="displayTag" class="text-[11px] font-bold shrink-0" :class="themeStyle.tagClass">#{{ displayTag }}</span>
        <span v-if="location" class="inline-flex items-center gap-0.5 text-[10px] min-w-0" :class="themeStyle.metaClass">
          <i class="ri-map-pin-2-line text-[11px]"></i>
          <span class="truncate">{{ location }}</span>
        </span>
      </div>

      <!-- 作者 + 点赞 -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <img
            :src="authorAvatarSrc"
            class="w-[18px] h-[18px] rounded-full object-cover bg-stone-100 shrink-0"
            alt=""
          />
          <span class="text-[11px] truncate" :class="themeStyle.metaClass">{{ authorName || '匿名战友' }}</span>
        </div>
        <span class="flex items-center gap-0.5 text-[11px] shrink-0 tabular-nums" :class="liked ? 'text-rose-500' : themeStyle.metaClass">
          <i :class="liked ? 'ri-heart-3-fill' : 'ri-heart-3-line'" class="text-[13px]"></i>
          {{ likes ?? 0 }}
        </span>
      </div>
    </div>

    <!-- 作者删除 -->
    <button
      v-if="canEdit"
      @click.stop="$emit('delete')"
      class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/35 backdrop-blur-sm text-white flex items-center justify-center active:scale-90 z-20"
    >
      <i class="ri-delete-bin-line text-[13px]"></i>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { avatarOf } from '@/utils/avatarPool'

const props = defineProps({
  id: Number,
  title: String,
  summary: String,
  icon: String,
  theme: { type: String, default: 'editorial' },
  date: String,
  location: { type: String, default: '' },
  tags: Array,
  coverImage: { type: String, default: '' },
  authorName: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false }
})

defineEmits(['delete', 'open'])

const authorAvatarSrc = computed(() => avatarOf(props.authorAvatar, props.authorName || props.id || 'story'))

const isVideoCover = computed(() =>
  /\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(props.coverImage || '')
)

const PRIMARY_CARD_TAGS = ['求助', '经验分享', '知识分享', '交友']

const displayTag = computed(() => {
  const tags = (props.tags || []).filter(Boolean)
  const primary = tags.find(t => PRIMARY_CARD_TAGS.includes(t))
  if (primary) return primary
  const topic = tags.find(t => !['新故事', '血泪史', '治愈', '人生感悟', '共鸣', '克制', '清单', '吃货实录', '出院'].includes(t))
  return topic || tags[0] || ''
})

// 六款主题 · 每款独立风格
const THEME_STYLES = {
  editorial: {
    cardClass: 'bg-white border-stone-200/70',
    titleClass: 'text-stone-900',
    subClass: 'text-stone-500',
    metaClass: 'text-stone-400',
    tagClass: 'text-stone-500',
    iconBadge: 'bg-white/85 text-stone-700',
    glow: ''
  },
  midnight: {
    cardClass: 'bg-gradient-to-br from-slate-900 to-blue-950 border-slate-700/40',
    titleClass: 'text-white',
    subClass: 'text-slate-300',
    metaClass: 'text-slate-400',
    tagClass: 'text-sky-300',
    iconBadge: 'bg-white/15 text-white',
    glow: 'bg-sky-500/30'
  },
  sunrise: {
    cardClass: 'bg-gradient-to-br from-amber-50 to-rose-100 border-amber-200/60',
    titleClass: 'text-orange-950',
    subClass: 'text-orange-900/70',
    metaClass: 'text-orange-900/50',
    tagClass: 'text-orange-600',
    iconBadge: 'bg-white/75 text-orange-700',
    glow: 'bg-rose-300/40'
  },
  aurora: {
    cardClass: 'bg-gradient-to-br from-emerald-50 to-violet-100 border-violet-200/50',
    titleClass: 'text-indigo-950',
    subClass: 'text-slate-600',
    metaClass: 'text-slate-400',
    tagClass: 'text-violet-600',
    iconBadge: 'bg-white/75 text-violet-700',
    glow: 'bg-emerald-300/40'
  },
  ink: {
    cardClass: 'bg-gradient-to-br from-stone-950 to-amber-950 border-amber-500/20',
    titleClass: 'text-amber-100',
    subClass: 'text-amber-200/60',
    metaClass: 'text-amber-200/50',
    tagClass: 'text-amber-400',
    iconBadge: 'bg-amber-400/15 text-amber-300',
    glow: 'bg-amber-500/20'
  },
  bloom: {
    cardClass: 'bg-gradient-to-br from-rose-50 to-fuchsia-100 border-rose-200/60',
    titleClass: 'text-rose-950',
    subClass: 'text-rose-900/70',
    metaClass: 'text-rose-500/70',
    tagClass: 'text-fuchsia-600',
    iconBadge: 'bg-white/75 text-rose-600',
    glow: 'bg-fuchsia-300/40'
  }
}

const themeStyle = computed(() => THEME_STYLES[props.theme] || THEME_STYLES.editorial)
</script>
