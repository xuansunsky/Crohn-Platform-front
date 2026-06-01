<template>
  <div class="relative w-full pb-8 bg-[#FBF9F5]">

    <!-- Hero Header -->
    <header class="relative px-5 pt-8 pb-6 overflow-hidden">
      <div class="absolute -top-20 -right-16 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-violet-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-32 -left-20 w-64 h-64 bg-gradient-to-tr from-rose-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase">Vault · 经验金库</span>
          <span class="w-1 h-1 rounded-full bg-blue-400"></span>
          <span class="text-[10px] font-medium text-slate-400">Curated by 病友</span>
        </div>
        <h1 class="text-[32px] leading-none font-black tracking-tight text-slate-900 mb-3">
          那些<span class="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">没人告诉你</span><br/>的真实经验。
        </h1>
        <p class="text-[13px] text-slate-500 leading-relaxed">
          在这里，我们交换伤疤，也交换勋章。
        </p>

        <!-- 数据指标条 -->
        <div class="mt-6 flex items-stretch gap-2 p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.06)]">
          <div class="flex-1 px-4 py-2.5">
            <div class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Stories</div>
            <div class="text-xl font-black text-slate-900 mt-0.5 leading-none">{{ libraryItems.length }}</div>
          </div>
          <div class="w-px bg-slate-100"></div>
          <div class="flex-1 px-4 py-2.5">
            <div class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Today</div>
            <div class="text-xl font-black text-slate-900 mt-0.5 leading-none">+{{ todayCount }}</div>
          </div>
          <div class="w-px bg-slate-100"></div>
          <button
              @click="openModal"
              class="px-4 flex items-center gap-1.5 text-[13px] font-black text-white bg-slate-900 rounded-xl shadow-[0_4px_12px_-4px_rgba(15,23,42,0.4)] hover:bg-slate-800 active:scale-95 transition-all"
          >
            <i class="ri-add-line text-base"></i> 投稿
          </button>
        </div>

        <!-- 类目筛选 -->
        <div class="mt-5 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          <button
              v-for="cat in categories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              :class="[
              'shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition-all active:scale-95 flex items-center gap-1.5',
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/80 text-slate-500 border border-slate-100 hover:bg-white'
            ]"
          >
            <span>{{ cat.icon }}</span> {{ cat.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Story (featured) -->
    <section v-if="featured" class="px-5 mb-6 relative">
      <div
          class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 pt-8 cursor-pointer group active:scale-[0.99] transition-transform"
      >
        <!-- 光晕装饰 -->
        <div class="absolute -top-20 -right-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex items-center gap-1.5 mb-4">
            <span class="text-[10px] font-black tracking-[0.25em] text-amber-300 uppercase px-2 py-1 bg-amber-300/10 rounded-full border border-amber-300/20">
              ✦ Editor's Pick
            </span>
            <span class="text-[10px] font-bold text-white/40 tracking-wider">本周精选</span>
          </div>

          <h2 class="text-white text-[26px] font-black leading-[1.2] tracking-tight mb-3">
            {{ featured.title }}
          </h2>
          <p class="text-white/70 text-[13.5px] leading-relaxed line-clamp-2 mb-5">
            {{ featured.summary }}
          </p>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-slate-900 bg-gradient-to-br" :class="avatarColors[i-1]"></div>
              </div>
              <div>
                <div class="text-[12px] font-bold text-white">{{ featured.likes || 128 }} 人共鸣</div>
                <div class="text-[10px] text-white/40">·  {{ featured.date }}</div>
              </div>
            </div>
            <div class="flex items-center gap-1 text-[12px] font-bold text-amber-300">
              展开阅读 <i class="ri-arrow-right-line"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 列表区标题 -->
    <div class="flex items-end justify-between px-5 mb-4">
      <div>
        <h3 class="text-[18px] font-black tracking-tight text-slate-900">最新故事</h3>
        <p class="text-[11px] text-slate-400 font-medium mt-0.5">Sorted by latest · {{ filteredItems.length }} 条</p>
      </div>
      <button class="flex items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <i class="ri-equalizer-line"></i> 排序
      </button>
    </div>

    <!-- 卡片瀑布流 -->
    <div class="px-5 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      <div v-for="item in filteredItems" :key="item.id" class="break-inside-avoid">
        <ExperienceCard
            v-bind="item"
            :can-edit="checkPermission(item.userId)"
            @delete="deleteCard(item.id)"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredItems.length === 0" class="px-5 mt-12 text-center">
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
              <div class="text-[10px] font-black text-blue-600 tracking-[0.25em] uppercase mb-1">New Story</div>
              <h3 class="text-[22px] font-black tracking-tight text-slate-900">写下你的故事</h3>
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
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2">标题</label>
                  <input
                      v-model="newPost.title"
                      type="text"
                      placeholder="今天没忍住吃了顿火锅..."
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[15px] font-bold text-slate-900 placeholder-slate-300"
                  >
                </div>

                <div>
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2">摘要</label>
                  <textarea
                      v-model="newPost.summary"
                      rows="5"
                      placeholder="写点什么..."
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[14px] text-slate-700 placeholder-slate-300 resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2">故事配图（可选）</label>
                  <div class="flex items-center gap-3">
                    <div v-if="newPost.coverImage" class="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                      <img :src="newPost.coverImage" class="w-full h-full object-cover" />
                      <button @click="newPost.coverImage = ''" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center text-[10px]"><i class="ri-close-line"></i></button>
                    </div>
                    <label class="cursor-pointer px-4 py-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-[12px] font-bold text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2">
                      <i class="ri-image-add-line text-base"></i> {{ coverUploading ? '上传中...' : '上传配图' }}
                      <input type="file" accept="image/*" class="hidden" @change="uploadCover" :disabled="coverUploading" />
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2.5">心情图标</label>
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
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2.5">卡片主题</label>
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
                  <label class="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2">标签</label>
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
                  <span class="text-[11px] font-black text-slate-400 tracking-widest uppercase">实时预览</span>
                  <span class="text-[10px] font-bold text-slate-300">Live · 推送到金库</span>
                </div>
                <ExperienceCard v-bind="newPost" />
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
                class="px-7 py-3 rounded-xl text-[14px] font-black text-white bg-slate-900 hover:bg-slate-800 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center gap-2"
            >
              发布到金库 <i class="ri-arrow-right-up-line"></i>
            </button>
          </footer>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ExperienceCard from '@/components/ExperienceCard.vue'
import { useAuth } from '@/components/useAuth.js'
import http from '@/api/http'

const { currentUserId, checkPermission } = useAuth()

// 类目
const categories = [
  { id: 'all', label: '全部', icon: '✦' },
  { id: 'pain', label: '血泪史', icon: '🔥' },
  { id: 'heal', label: '治愈', icon: '🌿' },
  { id: 'food', label: '吃货实录', icon: '🍜' },
  { id: 'life', label: '人生感悟', icon: '🌙' }
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

const loadPosts = async () => {
  try {
    const res = await http.get('/experience/list')
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = (res.data || []).map(p => ({
        id: p.id,
        userId: p.userId,
        theme: p.theme || 'editorial',
        title: p.title,
        summary: p.summary,
        icon: p.icon || '✍️',
        tags: p.tags ? p.tags.split(',').filter(Boolean) : [],
        coverImage: p.coverImage || '',
        authorName: p.authorName,
        authorAvatar: p.authorAvatar,
        likes: 0,
        comments: 0,
        category: categoryOf(p.tags ? p.tags.split(',') : []),
        date: fmtDate(p.createdAt)
      }))
    }
  } catch (e) {
    console.error('加载金库失败', e)
  }
}

onMounted(loadPosts)

// 计算属性：本周精选 = 最新一条（也可按共鸣排）
const featured = computed(() => libraryItems.value[0] || null)

const todayCount = computed(() => {
  return Math.min(libraryItems.value.length, 12)
})

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return libraryItems.value
  return libraryItems.value.filter(item => item.category === activeCategory.value)
})

const avatarColors = [
  'from-blue-400 to-violet-500',
  'from-rose-400 to-orange-500',
  'from-emerald-400 to-teal-500'
]

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

// Modal
const showModal = ref(false)
const coverUploading = ref(false)
const publishing = ref(false)
const newPost = reactive({
  id: null,
  theme: 'editorial',
  title: '',
  summary: '',
  icon: '✍️',
  tags: ['新故事'],
  coverImage: '',
  likes: 0,
  comments: 0,
  date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
})

const uploadCover = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  coverUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await http.post('/upload', formData)
    if (res.status === 200 || res.code === 200) {
      newPost.coverImage = res.data
    } else {
      alert(res.message || '上传失败')
    }
  } catch (err) {
    alert('配图上传失败，检查网络')
  } finally {
    coverUploading.value = false
    e.target.value = ''
  }
}

const availableThemes = [
  { name: 'Editorial', value: 'editorial', bgPreview: '#ffffff', textColor: '#0f172a' },
  { name: 'Midnight', value: 'midnight', bgPreview: 'linear-gradient(135deg, #0f172a, #1e3a8a)', textColor: '#fff' },
  { name: 'Sunrise', value: 'sunrise', bgPreview: 'linear-gradient(135deg, #fef3c7, #fecaca)', textColor: '#7c2d12' },
  { name: 'Aurora', value: 'aurora', bgPreview: 'linear-gradient(135deg, #ecfdf5, #ede9fe)', textColor: '#1e1b4b' }
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
  newPost.coverImage = ''
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
  try {
    const res = await http.post('/experience/publish', {
      title: newPost.title,
      summary: newPost.summary,
      icon: newPost.icon,
      theme: newPost.theme,
      tags: newPost.tags.join(','),
      coverImage: newPost.coverImage
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
</style>
