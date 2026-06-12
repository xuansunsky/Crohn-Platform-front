<template>
  <div class="relative w-full pb-8 bg-[#FBF9F5] min-h-full">

    <TabPageHeader
      title="经验金库"
      accent="amber"
    >
      <template #action>
        <button
          @click="openModal"
          class="px-3 py-2 rounded-lg text-[12px] font-bold text-white bg-stone-900 border border-stone-900 active:scale-95 transition-transform flex items-center gap-1"
        >
          <i class="ri-add-line text-base"></i>
          写故事
        </button>
      </template>
    </TabPageHeader>

    <!-- 分类（吸顶） -->
    <div class="sticky top-0 z-20 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-100">
      <div class="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95',
            activeCategory === cat.id
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-500 border border-stone-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- 双列瀑布流 · 小红书/闲鱼风 -->
    <div class="px-2 pt-2 columns-2 gap-2">
      <ExperienceCard
        v-for="item in filteredItems"
        :key="item.id"
        v-bind="item"
        :can-edit="checkPermission(item.userId)"
        @delete="deleteCard(item.id)"
        @open="openDetail(item.id)"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredItems.length === 0" class="px-6 mt-16 text-center">
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
        <i class="ri-book-mark-line text-2xl text-slate-300"></i>
      </div>
      <p class="text-[13px] text-slate-400 font-medium">该分类还没有故事，去当第一人</p>
    </div>

    <!-- Modal: 写下你的故事 -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-md" @click="closeModal"></div>

        <div class="relative bg-white w-full sm:max-w-3xl sm:rounded-[32px] rounded-t-[32px] max-h-[92vh] sm:max-h-[88vh] overflow-hidden flex flex-col shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)] animate-slide-up">

          <!-- 顶部抓手 -->
          <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

          <!-- Header -->
          <header class="shrink-0 px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <p class="text-[11px] font-medium text-stone-400 mb-1">发布到金库</p>
              <h3 class="text-[22px] font-bold tracking-tight text-slate-900">写下你的故事</h3>
            </div>
            <button @click="closeModal" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-90">
              <i class="ri-close-line text-lg"></i>
            </button>
          </header>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scroll">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

              <!-- 表单区 -->
              <div class="space-y-6">
                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">标题</label>
                  <input
                      v-model="newPost.title"
                      type="text"
                      placeholder="今天没忍住吃了顿火锅..."
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[15px] font-bold text-slate-900 placeholder-slate-300"
                  >
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">摘要</label>
                  <textarea
                      v-model="newPost.summary"
                      rows="5"
                      placeholder="写点什么..."
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[14px] text-slate-700 placeholder-slate-300 resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">正文图集 / 视频（最多 9 条 · 第 1 张作封面）</label>
                  <div class="grid grid-cols-3 gap-2.5">
                    <div v-for="(m, i) in newMedia" :key="i" class="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.12)]">
                      <video v-if="isVideo(m)" :src="m" class="w-full h-full object-cover" muted></video>
                      <img v-else :src="m" class="w-full h-full object-cover" />
                      <span v-if="i === 0" class="absolute top-1.5 left-1.5 text-[9px] font-black text-white bg-blue-600/90 px-1.5 py-0.5 rounded-md pointer-events-none">封面</span>
                      <span v-if="isVideo(m)" class="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white bg-black/45 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 pointer-events-none"><i class="ri-play-mini-fill"></i> 视频</span>
                      <button @click="removeStoryMedia(i)" class="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/70 backdrop-blur text-white rounded-full flex items-center justify-center text-[13px] active:scale-90 shadow"><i class="ri-close-line"></i></button>
                    </div>
                    <button
                        v-if="newMedia.length < MAX_MEDIA"
                        @click="pickStoryMedia"
                        class="aspect-square rounded-2xl bg-[#f4f4f6] hover:bg-[#ececf0] flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-all"
                    >
                      <i :class="mediaUploading ? 'ri-loader-4-line animate-spin text-3xl' : 'ri-add-line text-[34px] font-thin'"></i>
                      <span class="text-[11px] font-bold mt-0.5">{{ mediaUploading ? '上传中' : newMedia.length + '/' + MAX_MEDIA }}</span>
                    </button>
                  </div>
                  <input id="story-media-input" type="file" accept="image/*,video/*" multiple class="hidden" @change="onStoryMedia" />
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2.5">心情图标</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                        v-for="emoji in emojiOptions"
                        :key="emoji"
                        @click="newPost.icon = emoji"
                        :class="[
                        'w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90',
                        newPost.icon === emoji
                          ? 'bg-slate-900 text-white scale-110 shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100'
                      ]"
                    >
                      {{ emoji }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2.5">卡片底色</label>
                  <div class="grid grid-cols-4 gap-2.5">
                    <button
                        v-for="theme in availableThemes"
                        :key="theme.value"
                        @click="newPost.theme = theme.value"
                        :class="[
                        'h-16 rounded-2xl border-2 text-[11px] font-black transition-all active:scale-95 relative overflow-hidden',
                        newPost.theme === theme.value
                          ? 'border-slate-900 ring-2 ring-slate-900/10 scale-[1.02] shadow-md'
                          : 'border-transparent hover:border-slate-200'
                      ]"
                        :style="{ background: theme.bgPreview, color: theme.textColor }"
                    >
                      <span class="relative z-10">{{ theme.name }}</span>
                      <span v-if="newPost.theme === theme.value" class="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center text-slate-900 z-10">
                        <i class="ri-check-line text-[10px] font-black"></i>
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">标签</label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                        v-for="t in tagOptions"
                        :key="t"
                        @click="toggleTag(t)"
                        :class="[
                        'px-3 py-1.5 rounded-full text-[11.5px] font-bold transition-all active:scale-95',
                        newPost.tags.includes(t)
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      ]"
                    >
                      # {{ t }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 预览区 -->
              <div class="lg:sticky lg:top-0 lg:self-start">
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-[11px] font-bold text-stone-400">实时预览</span>
                  <span class="text-[10px] font-medium text-stone-300">双列展示效果</span>
                </div>
                <div class="columns-2 gap-2 max-w-[320px]">
                  <ExperienceCard v-bind="previewPost" />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white/80 backdrop-blur-xl">
            <button @click="closeModal" class="px-5 py-3 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
              再想想
            </button>
            <button
                @click="publishPost"
                :disabled="publishing || mediaUploading"
                class="px-7 py-3 rounded-xl text-[14px] font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center gap-2"
            >
              发布到金库 <i class="ri-arrow-right-up-line"></i>
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- ============ 文章详情 · 小红书风 ============ -->
    <transition name="modal-fade">
      <div v-if="showDetail" class="fixed inset-0 z-[110] bg-[#FFFCF8] flex flex-col">

        <!-- 顶栏：返回 + 作者 + 收藏 -->
        <header class="detail-topbar shrink-0 bg-[#FFFCF8]/95 backdrop-blur-xl border-b border-stone-100/80">
          <div class="h-[54px] px-3 flex items-center gap-2">
            <button @click="closeDetail" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-stone-100 transition-all shrink-0">
              <i class="ri-arrow-left-line text-[22px] text-stone-900"></i>
            </button>
            <div v-if="detail && !detailLoading" class="flex-1 flex items-center gap-2.5 min-w-0">
              <img :src="avatarOf(detail.authorAvatar || defaultAvatar, detail.authorName || detail.userId || detail.id)" class="w-9 h-9 rounded-full object-cover bg-stone-100 ring-1 ring-stone-100 shrink-0" />
              <div class="min-w-0">
                <p class="text-[14px] font-black text-stone-950 truncate">{{ detail.authorName || '匿名病友' }}</p>
                <p class="text-[10px] text-stone-400 font-medium">{{ fmtDate(detail.createdAt) }}</p>
              </div>
            </div>
            <div v-else class="flex-1"></div>
            <button
              v-if="detail && !checkPermission(detail.userId)"
              @click="toggleFavorite"
              :disabled="favoriteBusy"
              class="h-8 px-3 rounded-full bg-stone-950 text-white text-[12px] font-black active:scale-95 disabled:opacity-60 transition-all shrink-0"
            >
              {{ detail.favorited ? '已收藏' : '收藏' }}
            </button>
            <button v-if="detail && checkPermission(detail.userId)" @click="deleteFromDetail" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-rose-50 text-rose-500 shrink-0">
              <i class="ri-delete-bin-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scroll bg-[#FFFCF8]">
          <div v-if="detailLoading" class="flex items-center justify-center py-24 text-slate-400">
            <i class="ri-loader-4-line text-2xl animate-spin"></i>
          </div>

          <article v-else-if="detail">
            <!-- 横滑大图（横图/竖图自适应，不裁切） -->
            <div v-if="detailMedia.length" class="relative bg-stone-50">
              <div
                ref="galleryEl"
                @scroll="onGalleryScroll"
                class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar items-start"
              >
                <div
                  v-for="(m, i) in detailMedia"
                  :key="i"
                  class="shrink-0 w-full snap-center flex items-center justify-center bg-stone-50 min-h-[180px]"
                >
                  <video
                    v-if="isVideo(m)"
                    :src="m"
                    class="w-full max-h-[72vh] object-contain"
                    controls
                    playsinline
                    preload="metadata"
                  ></video>
                  <img
                    v-else
                    :src="m"
                    class="w-full max-h-[72vh] object-contain block"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <!-- 圆点指示器（图片下方，小红书同款） -->
            <div v-if="detailMedia.length > 1" class="flex items-center justify-center gap-1.5 py-3">
              <span
                v-for="(m, i) in detailMedia"
                :key="i"
                class="rounded-full transition-all duration-300"
                :class="i === galleryIndex ? 'w-1.5 h-1.5 bg-rose-500' : 'w-1.5 h-1.5 bg-slate-300'"
              ></span>
            </div>

            <!-- 标题 + 标签 + 正文 -->
            <div class="px-5 pb-6" :class="detailMedia.length <= 1 ? 'pt-5' : ''">
              <h1 class="text-[22px] leading-[1.35] font-black tracking-tight text-stone-950 mb-3">{{ detail.title }}</h1>

              <p v-if="detail.summary" class="text-[15px] leading-[1.85] text-stone-700 whitespace-pre-line mb-4">{{ detail.summary }}</p>

              <!-- 话题标签 -->
              <div v-if="detailTags.length" class="flex flex-wrap gap-2 mb-3">
                <span v-for="t in detailTags" :key="t" class="text-[13px] font-black text-[#315C9A]">#{{ t }}</span>
              </div>

              <button
                v-if="detailSearchHint"
                @click="jumpToRelated"
                class="w-full mt-5 px-4 py-3 rounded-2xl bg-white border border-stone-100 shadow-[0_10px_26px_-22px_rgba(28,25,23,0.5)] flex items-center gap-3 active:scale-[0.99] transition-all text-left"
              >
                <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <i class="ri-search-2-line text-base"></i>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-[11px] font-bold text-stone-400 mb-0.5">猜你想搜</span>
                  <span class="block text-[14px] font-black text-stone-900 truncate">{{ detailSearchHint }}</span>
                </span>
                <i class="ri-arrow-right-s-line text-xl text-stone-300"></i>
              </button>
            </div>

            <!-- 评论区 -->
            <section class="mx-4 mb-28 rounded-[28px] bg-white border border-stone-100 shadow-[0_16px_50px_-36px_rgba(28,25,23,0.45)] overflow-hidden">
              <div class="px-4 pt-4 pb-3 flex items-center justify-between">
                <h2 class="text-[15px] font-black text-stone-950">评论 {{ detail.commentCount || comments.length || 0 }}</h2>
                <span class="text-[11px] font-bold text-stone-400">温柔一点说</span>
              </div>

              <div v-if="commentsLoading" class="py-10 flex items-center justify-center text-stone-300">
                <i class="ri-loader-4-line text-xl animate-spin"></i>
              </div>

              <div v-else-if="comments.length === 0" class="px-5 py-10 text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-50 flex items-center justify-center text-stone-300">
                  <i class="ri-chat-smile-2-line text-2xl"></i>
                </div>
                <p class="text-[13px] font-bold text-stone-400">还没有评论，来坐第一排</p>
              </div>

              <div v-else class="divide-y divide-stone-100">
                <div v-for="comment in comments" :key="comment.id" class="px-4 py-4 flex gap-3">
                  <img
                    :src="avatarOf(comment.userAvatar, comment.userName || comment.userId || comment.id)"
                    class="w-9 h-9 rounded-full object-cover bg-stone-100 ring-1 ring-stone-100 shrink-0"
                    alt=""
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[13px] font-black text-stone-800 truncate">{{ comment.userName || '匿名病友' }}</span>
                      <span class="text-[10px] text-stone-300 shrink-0">{{ fmtDate(comment.createdAt) }}</span>
                    </div>
                    <p class="text-[14px] leading-relaxed text-stone-700 break-words">{{ comment.content }}</p>
                  </div>
                  <button
                    v-if="checkPermission(comment.userId)"
                    @click="deleteComment(comment)"
                    class="w-8 h-8 rounded-full text-stone-300 active:bg-rose-50 active:text-rose-500 flex items-center justify-center shrink-0"
                  >
                    <i class="ri-delete-bin-6-line text-[15px]"></i>
                  </button>
                </div>
              </div>
            </section>
          </article>
        </div>

        <!-- 底栏互动 -->
        <footer v-if="detail && !detailLoading" class="shrink-0 flex items-center gap-2 px-3 py-3 border-t border-stone-100/90 bg-white/95 backdrop-blur-xl safe-area-bottom">
          <form @submit.prevent="submitComment" class="flex-1 min-w-0 h-10 rounded-full bg-stone-100 flex items-center px-3 gap-2">
            <i class="ri-edit-line text-stone-400 shrink-0"></i>
            <input
              ref="commentInputEl"
              v-model="commentDraft"
              type="text"
              maxlength="300"
              placeholder="说点什么…"
              class="flex-1 min-w-0 bg-transparent outline-none text-[13px] font-medium text-stone-800 placeholder-stone-400"
            />
            <button
              v-if="commentDraft.trim()"
              type="submit"
              :disabled="commentSending"
              class="px-2.5 py-1 rounded-full bg-stone-950 text-white text-[11px] font-black disabled:opacity-50 active:scale-95"
            >
              发送
            </button>
          </form>
          <button @click="toggleLike" :disabled="likeBusy" class="flex flex-col items-center gap-0.5 active:scale-95 px-1.5 disabled:opacity-60" :class="detail.liked ? 'text-rose-500' : 'text-stone-600'">
            <i :class="detail.liked ? 'ri-heart-3-fill' : 'ri-heart-3-line'" class="text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.likeCount || 0 }}</span>
          </button>
          <button @click="toggleFavorite" :disabled="favoriteBusy" class="flex flex-col items-center gap-0.5 active:scale-95 px-1.5 disabled:opacity-60" :class="detail.favorited ? 'text-amber-500' : 'text-stone-600'">
            <i :class="detail.favorited ? 'ri-star-fill' : 'ri-star-line'" class="text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.favoriteCount || 0 }}</span>
          </button>
          <button @click="focusComment" class="flex flex-col items-center gap-0.5 text-stone-600 active:scale-95 px-1.5">
            <i class="ri-chat-3-line text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.commentCount || comments.length || 0 }}</span>
          </button>
        </footer>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import ExperienceCard from '@/components/ExperienceCard.vue'
import { useAuth } from '@/components/useAuth.js'
import http from '@/api/http'
import { avatarOf } from '@/utils/avatarPool'

const { currentUserId, checkPermission } = useAuth()

// 类目
const categories = [
  { id: 'all', label: '全部' },
  { id: 'pain', label: '血泪史' },
  { id: 'heal', label: '治愈' },
  { id: 'food', label: '吃货实录' },
  { id: 'life', label: '人生感悟' }
]
const activeCategory = ref('all')

// 数据源（真实数据，从后端拉取）
const libraryItems = ref([])

// tags → category 映射（用于分类筛选）
const categoryOf = (tags) => {
  const t = tags || []
  if (t.includes('血泪史') || t.includes('克制') || t.includes('共鸣')) return 'pain'
  if (t.includes('治愈') || t.includes('用药') || t.includes('出院')) return 'heal'
  if (t.includes('吃货实录') || t.includes('清单')) return 'food'
  if (t.includes('人生感悟') || t.includes('日常') || t.includes('身材')) return 'life'
  return 'all'
}

const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const mapExperiencePost = (p) => {
  let mediaList = []
  if (p.media) {
    try { mediaList = JSON.parse(p.media) } catch (e) { mediaList = [] }
  }
  const tags = p.tags ? p.tags.split(',').filter(Boolean) : []
  const cover = p.coverImage || mediaList.find(m => !/\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(m)) || mediaList[0] || ''
  return {
    id: p.id,
    userId: p.userId,
    theme: p.theme || 'editorial',
    title: p.title,
    summary: p.summary,
    icon: p.icon || '✍️',
    tags,
    coverImage: cover,
    media: mediaList,
    authorName: p.authorName,
    authorAvatar: avatarOf(p.authorAvatar, p.authorName || p.userId || p.id),
    likes: Number(p.likeCount || 0),
    comments: Number(p.commentCount || 0),
    favoriteCount: Number(p.favoriteCount || 0),
    liked: !!p.liked,
    favorited: !!p.favorited,
    category: categoryOf(tags),
    date: fmtDate(p.createdAt)
  }
}

const syncPostCard = (post) => {
  if (!post?.id) return
  const idx = libraryItems.value.findIndex(item => Number(item.id) === Number(post.id))
  if (idx === -1) return
  libraryItems.value[idx] = {
    ...libraryItems.value[idx],
    likes: Number(post.likeCount || 0),
    comments: Number(post.commentCount || 0),
    favoriteCount: Number(post.favoriteCount || 0),
    liked: !!post.liked,
    favorited: !!post.favorited
  }
}

const loadPosts = async () => {
  try {
    const res = await http.get('/experience/list')
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = (res.data || []).map(mapExperiencePost)
    }
  } catch (e) {
    console.error('加载金库失败', e)
  }
}

onMounted(loadPosts)

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return libraryItems.value
  return libraryItems.value.filter(item => item.category === activeCategory.value)
})

const deleteCard = async (id) => {
  if (!confirm('兄弟，确定要把这条经验从金库里移除吗？')) return
  try {
    const res = await http.delete(`/experience/delete/${id}`)
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = libraryItems.value.filter(item => item.id !== id)
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

// 媒体辅助
const defaultAvatar = avatarOf('', 'story')
const isVideo = (url) => /\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(url || '')

// ============ 文章详情 ============
const showDetail = ref(false)
const detailLoading = ref(false)
const detail = ref(null)
const galleryEl = ref(null)
const galleryIndex = ref(0)
const comments = ref([])
const commentsLoading = ref(false)
const commentDraft = ref('')
const commentSending = ref(false)
const likeBusy = ref(false)
const favoriteBusy = ref(false)
const commentInputEl = ref(null)
const detailTags = computed(() => detail.value && detail.value.tags ? detail.value.tags.split(',').filter(Boolean) : [])
const detailSearchHint = computed(() => {
  if (!detail.value) return ''
  const tag = detailTags.value.find(t => t && t !== '新故事')
  if (tag) return `${tag}经验`
  const title = (detail.value.title || '').replace(/[，。！？、\s]/g, '').slice(0, 14)
  return title || '克罗恩经验'
})
const detailMedia = computed(() => {
  if (!detail.value) return []
  let list = []
  if (detail.value.media) {
    try { list = JSON.parse(detail.value.media) } catch (e) { list = [] }
  }
  // 兼容旧数据：只有 coverImage、没有 media 时也能横滑
  if (!list.length && detail.value.coverImage) list = [detail.value.coverImage]
  return list
})

const onGalleryScroll = () => {
  const el = galleryEl.value
  if (!el || !el.clientWidth) return
  galleryIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

const openDetail = async (id) => {
  if (!id) return
  showDetail.value = true
  detailLoading.value = true
  detail.value = null
  comments.value = []
  commentDraft.value = ''
  galleryIndex.value = 0
  commentsLoading.value = true
  try {
    const [res, commentRes] = await Promise.all([
      http.get(`/experience/detail/${id}`),
      http.get(`/experience/${id}/comments`)
    ])
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      comments.value = (commentRes.status === 200 || commentRes.code === 200) ? (commentRes.data || []) : []
      syncPostCard(res.data)
    } else {
      alert(res.message || '文章打不开了')
      showDetail.value = false
    }
  } catch (e) {
    alert('加载失败，检查网络')
    showDetail.value = false
  } finally {
    detailLoading.value = false
    commentsLoading.value = false
  }
}

const closeDetail = () => { showDetail.value = false }

const submitComment = async () => {
  if (!detail.value?.id) return
  const content = commentDraft.value.trim()
  if (!content || commentSending.value) return
  commentSending.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/comments`, { content })
    if (res.status === 200 || res.code === 200) {
      commentDraft.value = ''
      if (res.data) comments.value.unshift(res.data)
      detail.value.commentCount = Number(detail.value.commentCount || 0) + 1
      syncPostCard(detail.value)
    } else {
      alert(res.message || '评论失败')
    }
  } catch (e) {
    alert('评论失败，检查网络')
  } finally {
    commentSending.value = false
  }
}

const deleteComment = async (comment) => {
  if (!detail.value?.id || !comment?.id) return
  if (!confirm('确定删除这条评论吗？')) return
  try {
    const res = await http.post(`/experience/${detail.value.id}/comments/${comment.id}/delete`)
    if (res.status === 200 || res.code === 200) {
      comments.value = comments.value.filter(item => item.id !== comment.id)
      detail.value.commentCount = Math.max(Number(detail.value.commentCount || 0) - 1, 0)
      syncPostCard(detail.value)
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

const toggleLike = async () => {
  if (!detail.value?.id || likeBusy.value) return
  likeBusy.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/like`)
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      syncPostCard(res.data)
    } else {
      alert(res.message || '操作失败')
    }
  } catch (e) {
    alert('操作失败，检查网络')
  } finally {
    likeBusy.value = false
  }
}

const toggleFavorite = async () => {
  if (!detail.value?.id || favoriteBusy.value) return
  favoriteBusy.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/favorite`)
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      syncPostCard(res.data)
    } else {
      alert(res.message || '操作失败')
    }
  } catch (e) {
    alert('操作失败，检查网络')
  } finally {
    favoriteBusy.value = false
  }
}

const focusComment = async () => {
  await nextTick()
  commentInputEl.value?.focus()
}

const jumpToRelated = () => {
  const category = categoryOf(detailTags.value)
  if (category && category !== 'all') activeCategory.value = category
  closeDetail()
}

const deleteFromDetail = async () => {
  if (!detail.value) return
  if (!confirm('兄弟，确定要把这条经验从金库里移除吗？')) return
  const id = detail.value.id
  try {
    const res = await http.delete(`/experience/delete/${id}`)
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = libraryItems.value.filter(item => item.id !== id)
      showDetail.value = false
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

// Modal
const showModal = ref(false)
const publishing = ref(false)
const newMedia = ref([])
const mediaUploading = ref(false)
const MAX_MEDIA = 9

// 单个文件上传：视频/大图给 2 分钟超时，覆盖全局 5s
const uploadOneMedia = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await http.post('/upload', fd, { timeout: 120000 })
  return res && res.data ? res.data : null
}

const pickStoryMedia = () => document.getElementById('story-media-input')?.click()
const onStoryMedia = async (e) => {
  const picked = Array.from(e.target.files || [])
  e.target.value = ''
  if (!picked.length) return
  const remaining = MAX_MEDIA - newMedia.value.length
  if (remaining <= 0) { alert(`最多 ${MAX_MEDIA} 条哦`); return }
  const files = picked.slice(0, remaining)
  mediaUploading.value = true
  try {
    // 并行上传，互不阻塞；个别失败也不影响其它
    const results = await Promise.allSettled(files.map(uploadOneMedia))
    const urls = results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value)
    if (urls.length) newMedia.value.push(...urls)
    const failed = results.length - urls.length
    if (failed > 0) alert(`有 ${failed} 个上传失败了（可能太大或网络慢），已自动跳过`)
  } finally {
    mediaUploading.value = false
  }
}
const removeStoryMedia = (i) => newMedia.value.splice(i, 1)
const newPost = reactive({
  id: null,
  theme: 'editorial',
  title: '',
  summary: '',
  icon: '✍️',
  tags: ['新故事'],
  likes: 0,
  comments: 0,
  date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
})

// 实时预览：封面自动取图集第一张
const previewPost = computed(() => ({
  ...newPost,
  coverImage: newMedia.value.find(m => !isVideo(m)) || newMedia.value[0] || '',
  authorName: '我',
  authorAvatar: defaultAvatar
}))

const availableThemes = [
  { name: '素白', value: 'editorial', bgPreview: '#ffffff', textColor: '#0f172a' },
  { name: '深夜', value: 'midnight', bgPreview: 'linear-gradient(135deg, #0f172a, #1e3a8a)', textColor: '#fff' },
  { name: '暖晨', value: 'sunrise', bgPreview: 'linear-gradient(135deg, #fef3c7, #fecaca)', textColor: '#7c2d12' },
  { name: '清透', value: 'aurora', bgPreview: 'linear-gradient(135deg, #ecfdf5, #ede9fe)', textColor: '#1e1b4b' },
  { name: '墨金', value: 'ink', bgPreview: 'linear-gradient(135deg, #020617, #422006)', textColor: '#fcd34d' },
  { name: '浅绯', value: 'bloom', bgPreview: 'linear-gradient(135deg, #fff1f2, #fae8ff)', textColor: '#9d174d' }
]

const emojiOptions = ['😈', '🧊', '🍦', '🧠', '👾', '✍️', '📸', '🌥️', '🐳', '💊', '🌙', '🔥', '🌿', '🚑']
const tagOptions = ['血泪史', '治愈', '吃货实录', '克制', '共鸣', '日常', '用药', '清单', '人生感悟']

const toggleTag = (t) => {
  const idx = newPost.tags.indexOf(t)
  if (idx > -1) newPost.tags.splice(idx, 1)
  else {
    if (newPost.tags.length >= 3) newPost.tags.shift()
    newPost.tags.push(t)
  }
}

const openModal = () => {
  newPost.title = ''
  newPost.summary = ''
  newPost.theme = 'editorial'
  newPost.icon = '✍️'
  newPost.tags = ['新故事']
  newMedia.value = []
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const publishPost = async () => {
  if (!newPost.title) {
    alert('兄弟，写个标题呗！')
    return
  }
  if (publishing.value) return
  publishing.value = true
  // 封面自动取图集第一张（图片优先；若第一张是视频也直接用，详情页会播放）
  const firstImage = newMedia.value.find(m => !isVideo(m)) || newMedia.value[0] || ''
  try {
    const res = await http.post('/experience/publish', {
      title: newPost.title,
      summary: newPost.summary,
      icon: newPost.icon,
      theme: newPost.theme,
      tags: newPost.tags.join(','),
      coverImage: firstImage,
      media: newMedia.value.length ? JSON.stringify(newMedia.value) : null
    })
    if (res.status === 200 || res.code === 200) {
      closeModal()
      await loadPosts()
    } else {
      alert(res.message || '发布失败')
    }
  } catch (e) {
    alert('发布失败，检查网络')
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.detail-topbar {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
</style>
