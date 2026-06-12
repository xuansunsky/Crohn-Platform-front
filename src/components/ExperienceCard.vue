<template>
  <article
    @click="$emit('open')"
    class="group relative w-full overflow-hidden cursor-pointer bg-white rounded-xl break-inside-avoid mb-2.5 active:opacity-90 transition-opacity"
  >
    <!-- 封面 / 纯文字卡 -->
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
      <span
        v-if="isVideoCover"
        class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/45 flex items-center justify-center text-white pointer-events-none"
      >
        <i class="ri-play-mini-fill text-sm"></i>
      </span>
    </div>

    <div
      v-else
      class="px-3 pt-3 pb-2 min-h-[88px] flex items-start"
      :class="textCardBg"
    >
      <p class="text-[15px] font-bold leading-snug line-clamp-4" :class="textCardTitleClass">
        {{ title || '暂无标题' }}
      </p>
    </div>

    <!-- 文案区 -->
    <div class="px-2.5 py-2.5">
      <h3
        v-if="coverImage && title"
        class="text-[13px] font-medium text-stone-900 leading-[1.45] line-clamp-2 mb-2"
      >
        {{ title }}
      </h3>

      <p
        v-if="!coverImage && summary"
        class="text-[12px] text-stone-500 leading-relaxed line-clamp-2 mb-2"
      >
        {{ summary }}
      </p>

      <div v-if="displayTag" class="mb-2">
        <span class="text-[11px] text-stone-400">#{{ displayTag }}</span>
      </div>

      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <img
            :src="authorAvatarSrc"
            class="w-[18px] h-[18px] rounded-full object-cover bg-stone-100 shrink-0"
            alt=""
          />
          <span class="text-[11px] text-stone-500 truncate">{{ authorName || '匿名战友' }}</span>
        </div>
        <span class="flex items-center gap-0.5 text-[11px] shrink-0 tabular-nums" :class="liked ? 'text-rose-500' : 'text-stone-400'">
          <i :class="liked ? 'ri-heart-3-fill' : 'ri-heart-3-line'" class="text-[13px]"></i>
          {{ likes ?? 0 }}
        </span>
      </div>
    </div>

    <!-- 作者删除 -->
    <button
      v-if="canEdit"
      @click.stop="$emit('delete')"
      class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/35 backdrop-blur-sm text-white flex items-center justify-center active:scale-90 z-10"
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

const displayTag = computed(() => {
  const tags = (props.tags || []).filter(t => t && t !== '新故事')
  return tags[0] || ''
})

const textCardBg = computed(() => {
  const map = {
    midnight: 'bg-slate-800',
    sunrise: 'bg-amber-50',
    aurora: 'bg-teal-50',
    ink: 'bg-stone-900',
    bloom: 'bg-rose-50',
    editorial: 'bg-stone-50'
  }
  return map[props.theme] || map.editorial
})

const textCardTitleClass = computed(() => {
  if (props.theme === 'midnight' || props.theme === 'ink') return 'text-stone-100'
  return 'text-stone-900'
})
</script>
