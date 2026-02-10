<template>
  <div class="flex h-screen w-full bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden">

    <aside
        :class="[
    'flex flex-col border-r border-white/5 bg-slate-900/95 backdrop-blur-xl transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden',
    'fixed md:relative z-50 h-full',
    isSidebarCollapsed ? 'w-0 opacity-0 -translate-x-10' : 'w-64 opacity-100 translate-x-0'
  ]"
    >

      <div class="flex h-16 items-center justify-between px-6 border-b border-white/5 min-w-[256px]">

        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <i class="ri-crown-fill text-lg"></i>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">Crohn Kingdom</span>
        </div>

        <button
            @click="isSidebarCollapsed = true"
            class="md:hidden text-slate-400 hover:text-white p-1"
        >
          <i class="ri-close-line text-xl"></i>
        </button>

      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-6 space-y-1 min-w-[256px]">
        <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Command Center</p>

        <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
            'group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
            activeTab === tab.key
              ? 'bg-indigo-500/10 text-indigo-400 shadow-inner shadow-indigo-500/5 border border-indigo-500/20'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          ]"
        >
          <i :class="[tab.icon, activeTab === tab.key ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300', 'text-lg transition-colors']"></i>
          <span>{{ tab.label }}</span>

          <div v-if="activeTab === tab.key" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
        </button>
      </nav>

      <div class="border-t border-white/5 p-4 bg-slate-900/30 min-w-[256px]">
        <button
            @click="activeTab = 'profile'"
            class="group w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-left"
        >
          <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform">
            轩
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="truncate text-sm font-bold text-slate-200 group-hover:text-white transition-colors">Architect-Xuan</span>
            <span class="truncate text-xs text-slate-500 group-hover:text-indigo-300 transition-colors">Lv.1 王国建造者</span>
          </div>
        </button>
        <button
            @click="handleLogout"
            class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 py-2 text-xs font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
        >
          <i class="ri-logout-box-r-line"></i> 暂时离线
        </button>
      </div>
    </aside>
    <div
        v-if="!isSidebarCollapsed"
        @click="isSidebarCollapsed = true"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
    ></div>
    <main
        :class="[
        'flex flex-1 flex-col overflow-hidden transition-colors duration-500 relative',
        activeTab === 'policy'
          ? 'bg-slate-50 text-slate-600'
          : 'bg-slate-950 text-slate-300 ]'
      ]"
    >

      <header
          :class="[
          'flex h-16 items-center justify-between px-8 z-10 sticky top-0 backdrop-blur-md border-b transition-colors duration-500',
          activeTab === 'policy'
            ? 'bg-white/90 border-slate-200'
            : 'bg-slate-900/80 border-white/5'
        ]"
      >
        <div class="flex items-center gap-4">
          <button
              @click="toggleSidebar"
              :class="[
              'p-2 rounded-lg transition-all hover:bg-black/5',
              activeTab === 'policy' ? 'text-slate-600' : 'text-slate-300 hover:bg-white/10'
            ]"
          >
            <i :class="isSidebarCollapsed ? 'ri-menu-unfold-line text-xl' : 'ri-menu-fold-line text-xl'"></i>
          </button>

          <div>
            <h2 :class="['text-lg font-bold tracking-wide transition-colors', activeTab === 'policy' ? 'text-slate-800' : 'text-white']">
              {{ currentTabLabel }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative hidden md:block group">
            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" placeholder="检索王国数据..." :class="['h-9 w-64 rounded-full pl-9 pr-4 text-sm outline-none transition-all', activeTab === 'policy' ? 'bg-white border border-slate-200 text-slate-700 shadow-sm' : 'bg-black/20 border border-white/10 text-slate-300']">
          </div>
          <button :class="['relative rounded-full p-2', activeTab === 'policy' ? 'text-slate-400 hover:text-blue-600' : 'text-slate-400 hover:text-white']">
            <i class="ri-notification-3-line text-lg"></i>
          </button>
        </div>
      </header>

      <div
          :class="[
          'flex-1 transition-all duration-300',
          activeTab === 'policy' ? 'p-0 overflow-hidden relative' : 'p-6 overflow-y-auto scroll-smooth'
        ]"
      >
        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="h-full w-full">
            <PolicyMapTab v-if="activeTab === 'policy'" class="h-full w-full" />
            <CheckinTab v-else-if="activeTab === 'checkin'" />
            <LibraryTab v-else-if="activeTab === 'library'" />
            <AdminConsoleTab v-else-if="activeTab === 'admin'"/>
            <ProfileTab v-else-if="activeTab === 'profile'" />
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import LibraryTab from "@/components/tabs/LibraryTab.vue";
import CheckinTab from "@/components/tabs/CheckinTab.vue";
import PolicyMapTab from "@/components/tabs/PolicyMapTab.vue";
import AdminConsoleTab from "@/components/tabs/AdminConsoleTab.vue";
import http from "@/api/http.js";
import router from "@/router/index.js";
import ProfileTab from "@/components/tabs/ProfileTab.vue";

const roleId = ref(localStorage.getItem('roleId') || '0')
const activeTab = ref(localStorage.getItem('lastActiveTab') || 'checkin')

// 🔥 3. 新增：控制侧边栏是否折叠的状态
const isSidebarCollapsed = ref(false)

// 手动切换函数
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 🔥 4. 监听 activeTab 的变化
// 逻辑：只要切到 'policy' (地图)，自动收起侧边栏；切到其他，自动展开
watch(activeTab, (newTab) => {
  localStorage.setItem('lastActiveTab', newTab)

  if (newTab === 'policy') {
    isSidebarCollapsed.value = true // 自动沉浸模式
  } else {
    isSidebarCollapsed.value = false // 恢复控制台模式
  }
})

// 初始化检查
if (activeTab.value === 'policy') {
  isSidebarCollapsed.value = true
}

// ... 你的 tabs 配置和其他代码保持不变 ...
const tabs = computed(() =>  [
  { key: 'checkin',   label: '星光打卡',           icon: 'ri-sparkling-2-line' },
  { key: 'library',   label: '经验金库',           icon: 'ri-archive-drawer-line' },
  { key: 'drugmap',   label: '药物体验图谱',       icon: 'ri-capsule-line' },
  { key: 'policy',    label: '医保政策地图',       icon: 'ri-map-pin-line' },
  { key: 'hospital',  label: '各地医院大调查',     icon: 'ri-hospital-line' },
  { key: 'qa',        label: '问答广场',           icon: 'ri-question-answer-line' },
  { key: 'circle',    label: '好友 / 圈子 / 小队', icon: 'ri-user-smile-line' },
  { key: 'reward',    label: '奖励系统',           icon: 'ri-medal-line' },
  { key: 'values',    label: '王国的价值观',       icon: 'ri-heart-2-line' },
  ...(roleId.value === '1' ? [{ key: 'admin', label: '权限掌控', icon: 'ri-shield-keyhole-line' }] : [])
])

const currentTabLabel = computed(() => {
  return tabs.value.find(t => t.key === activeTab.value)?.label || '控制台'
})

const handleLogout = () => {
  if(!confirm('兄弟，确定要暂时离开王国吗？')) return
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('roleId')
  localStorage.removeItem('lastActiveTab')
  router.push('/login')
}

onMounted(async () => {
  if (window.innerWidth < 768) {
    isSidebarCollapsed.value = true
  }

  try {
    const res = await http.get("users/getRole")
    roleId.value = res.data
    localStorage.setItem('roleId', res.data)
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
/* 保持你的滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>