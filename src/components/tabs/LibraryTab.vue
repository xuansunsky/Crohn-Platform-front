<template>
  <div class="single-main relative">

    <div class="mb-8 flex justify-between items-end px-4">
      <div>
        <h2 class="text-3xl font-black text-slate-800">经验金库</h2>
        <p class="text-slate-500 mt-2">在这里，我们交换伤疤，也交换勋章。</p>
      </div>
      <button
          @click="openModal"
          class="bg-black text-white px-5 py-2 rounded-full font-bold hover:bg-slate-800 transition shadow-lg flex items-center gap-2 active:scale-95">
        <i class="ri-add-line"></i> 分享我的故事
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-20">
      <ExperienceCard
          v-for="item in libraryItems"
          :key="item.id"
          v-bind="item"

          :can-edit="checkPermission(item.userId)"

          @delete="deleteCard(item.id)"
      />
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

        <div class="w-full md:w-1/2 p-8 overflow-y-auto">
          <h3 class="text-2xl font-black text-slate-800 mb-6">写下你的故事</h3>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-500 mb-1">标题</label>
              <input v-model="newPost.title" type="text" placeholder="例如：今天没忍住吃了顿火锅..." class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black transition font-bold text-slate-800">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-500 mb-1">内容摘要</label>
              <textarea v-model="newPost.summary" rows="3" placeholder="写点什么..." class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black transition text-slate-600 resize-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-500 mb-1">心情图标</label>
              <div class="flex gap-2">
                <button v-for="emoji in ['😈','🧊','🍦','🧠','👾','✍️','📸','🌥️','🐳']" :key="emoji"
                        @click="newPost.icon = emoji"
                        :class="['w-10 h-10 rounded-full flex items-center justify-center text-xl transition hover:scale-110', newPost.icon === emoji ? 'bg-black text-white scale-110' : 'bg-slate-100 text-slate-500']">
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-500 mb-2">选择卡片皮肤</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                    v-for="theme in availableThemes"
                    :key="theme.value"
                    @click="newPost.theme = theme.value"
                    :class="[
                    'h-12 rounded-lg border-2 text-xs font-bold transition-all hover:scale-105',
                    newPost.theme === theme.value ? 'border-black ring-2 ring-black/20 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  ]"
                    :style="{ background: theme.bgPreview, color: theme.textColor }"
                >
                  {{ theme.name }}
                </button>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button @click="publishPost" class="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition active:scale-95">
                发布到金库
              </button>
              <button @click="closeModal" class="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
                取消
              </button>
            </div>

          </div>
        </div>

        <div class="w-full md:w-1/2 bg-slate-100 flex flex-col items-center justify-center p-8 border-l border-slate-200 relative overflow-hidden">

          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 font-black text-9xl select-none pointer-events-none opacity-50">
            PREVIEW
          </div>

          <div class="scale-110 transition-all duration-500">
            <ExperienceCard v-bind="newPost" />
          </div>

          <p class="mt-8 text-slate-400 text-sm font-bold">实时预览中...</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ExperienceCard from "@/components/ExperienceCard.vue"
import {useAuth} from "@/components/useAuth.js";
const { checkPermission } = useAuth()
// === 1. 数据源 ===
const libraryItems = ref([
  {
    id: 1,
    userId: 100,
    theme: 'neon',
    title: '深夜痛悟：红汤是魔鬼',
    summary: '昨晚看着朋友吃红汤，心里那个馋啊。但是一想到上次复发...兄弟们，忍住就是胜利！',
    icon: '😈',
    tags: ['血泪史'],
    date: '2025.12.14'
  },
  // ... 其他旧数据保留 ...
  {
    id: 8,
    userId: 1,
    theme: 'sunset',
    title: '内江的夕阳',
    summary: '肚子阴痛了会儿，站在阳台看了一眼夕阳，感觉世界还是挺温柔的。',
    icon: '🌥️',
    tags: ['治愈'],
    date: '2025.12.23'
  }
])
const deleteCard = (id) => {
  // 弹个窗确认一下，防止手滑
  if (!confirm('兄弟，确定要把这条经验从金库里移除吗？')) return

  // 简单粗暴：把这个 id 的项过滤掉
  // (如果是真实后端，这里要写 await axios.delete(`/posts/${id}`))
  libraryItems.value = libraryItems.value.filter(item => item.id !== id)
}

const publishPost = () => {
  if (!newPost.title) return alert('兄弟，写个标题呗！')

  const newItem = {
    ...newPost,
    // 💡 小技巧：用时间戳做 ID，保证不重复
    id: Date.now(),
    // 🔥 关键：要把这个帖子标记为“我”发的！
    // 这样发出去之后，checkPermission 就会立即返回 true，你马上就能编辑它
    userId: currentUserId.value
  }

  libraryItems.value.unshift(newItem)
  closeModal()
}
// === 2. 弹窗控制 ===
const showModal = ref(false)

// === 3. 新建帖子的临时数据 (这是双向绑定的核心) ===
const newPost = reactive({
  id: null,
  theme: 'neon', // 默认选中 neon
  title: '',
  summary: '',
  icon: '✍️',
  tags: ['新故事'], // 暂时写死，后面可以做标签输入
  date: '2025.12.23'
})

// === 4. 皮肤配置 (用于渲染选择器的小方块) ===
const availableThemes = [
  { name: 'Neon', value: 'neon', bgPreview: '#0f172a', textColor: '#fff' },
  { name: 'Glass', value: 'glass', bgPreview: '#e2e8f0', textColor: '#334155' },
  { name: 'Pop', value: 'pop', bgPreview: '#facc15', textColor: '#000' },
  { name: 'Cyber', value: 'cyber', bgPreview: '#000', textColor: '#22c55e' },
  { name: 'Paper', value: 'paper', bgPreview: '#fffdf5', textColor: '#57534e' },
  { name: 'Aurora', value: 'aurora', bgPreview: '#1e293b', textColor: '#94a3b8' },
  { name: 'Sunset', value: 'sunset', bgPreview: 'linear-gradient(to bottom, #f472b6, #fdba74)', textColor: '#fff' },
  { name: 'DeepSea', value: 'deepsea', bgPreview: 'linear-gradient(to bottom, #164e63, #000)', textColor: '#67e8f9' },
]

// === 5. 方法 ===
const openModal = () => {
  // 重置表单
  newPost.title = ''
  newPost.summary = ''
  newPost.theme = 'neon'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>