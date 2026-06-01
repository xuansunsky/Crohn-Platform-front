<template>
  <div class="fixed inset-0 bg-[#FBF9F5] flex flex-col font-sans text-slate-900 overflow-hidden">

    <!-- 顶部 NavBar：自然 shrink，不再 fixed -->
    <header
        v-show="!isChatActive"
        class="shrink-0 px-4 py-3 flex items-center justify-between bg-[#FBF9F5]/90 backdrop-blur-xl border-b border-stone-100/80"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/25">
          <i class="ri-heart-pulse-fill text-white text-sm"></i>
        </div>
        <div>
          <div class="text-[15px] font-black tracking-tight text-slate-900 leading-none">Crohn Paradise</div>
          <div class="text-[10px] text-slate-400 font-medium mt-0.5">{{ currentTabLabel }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="w-8 h-8 rounded-xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-slate-500 active:scale-90 transition-all">
          <i class="ri-search-line text-base"></i>
        </button>
        <div class="w-8 h-8 rounded-xl overflow-hidden border-2 border-white shadow-md">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect" class="w-full h-full object-cover">
        </div>
      </div>
    </header>

    <!-- 唯一的滚动容器 -->
    <main
        ref="scrollMain"
        class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-[#FBF9F5]"
    >
      <transition name="van-fade" mode="out-in">
        <div :key="activeTab" :class="['w-full', isFullHeightTab ? 'h-full' : '']">
          <SocialTab v-if="activeTab === 'circle'" @chat-active="handleChatActive" />
          <CheckinTab v-else-if="activeTab === 'checkin'" @change-tab="activeTab = $event" />
          <PolicyMapTab v-else-if="activeTab === 'policy'" />
          <LibraryTab v-else-if="activeTab === 'library'" />
          <ProfileTab v-else-if="activeTab === 'profile'" @change-tab="activeTab = $event" />
          <AdminConsoleTab v-else-if="activeTab === 'admin'" />
          <DrugMapTab v-else-if="activeTab === 'drugmap'" @change-tab="activeTab = $event" />
          <HospitalTab v-else-if="activeTab === 'hospital'" @change-tab="activeTab = $event" />
          <van-empty v-else description="正在加载模块..." />
        </div>
      </transition>
    </main>

    <!-- 底部 TabBar -->
    <nav
        v-show="!isChatActive"
        class="shrink-0 bg-white/90 backdrop-blur-xl border-t border-stone-100/80 shadow-[0_-1px_0_rgba(15,23,42,0.04)]"
    >
      <div class="flex items-stretch h-[58px] px-2">
        <button
            v-for="tab in tabItems"
            :key="tab.name"
            @click="activeTab = tab.name"
            class="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all active:scale-90"
        >
          <div
              :class="[
              'w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-300',
              activeTab === tab.name ? 'bg-slate-900' : ''
            ]"
          >
            <i :class="[tab.icon, 'text-[18px] transition-colors duration-300', activeTab === tab.name ? 'text-white' : 'text-slate-400']"></i>
          </div>
          <span :class="['text-[10px] font-bold tracking-wide transition-colors duration-300', activeTab === tab.name ? 'text-slate-900' : 'text-slate-400']">
            {{ tab.label }}
          </span>
          <span v-if="tab.badge" class="absolute top-1.5 right-[calc(50%-14px)] w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {{ tab.badge }}
          </span>
        </button>
      </div>
      <div class="h-[env(safe-area-inset-bottom)]"></div>
    </nav>

    <!-- 国王浮动入口 -->
    <van-floating-bubble
        v-if="roleId === '1'"
        axis="xy"
        icon="shield-o"
        magnetic="x"
        @click="activeTab = 'admin'"
        class="bg-blue-600 text-white shadow-xl"
    />

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import LibraryTab from '@/components/tabs/LibraryTab.vue'
import CheckinTab from '@/components/tabs/CheckinTab.vue'
import PolicyMapTab from '@/components/tabs/PolicyMapTab.vue'
import AdminConsoleTab from '@/components/tabs/AdminConsoleTab.vue'
import ProfileTab from '@/components/tabs/ProfileTab.vue'
import SocialTab from '@/components/tabs/SocialTab.vue'
import DrugMapTab from '@/components/tabs/DrugMapTab.vue'
import HospitalTab from '@/components/tabs/HospitalTab.vue'
import http from '@/api/http.js'

const tabItems = [
  { name: 'circle', label: '小队', icon: 'ri-team-line', badge: 3 },
  { name: 'checkin', label: '情报', icon: 'ri-sparkling-2-line' },
  { name: 'policy', label: '地图', icon: 'ri-map-pin-2-line' },
  { name: 'library', label: '金库', icon: 'ri-archive-drawer-line' },
  { name: 'profile', label: '我的', icon: 'ri-user-smile-line' },
]

const roleId = ref(localStorage.getItem('roleId') || '0')
const activeTab = ref(localStorage.getItem('lastActiveTab') || 'checkin')
const isChatActive = ref(false)
const scrollMain = ref(null)

const handleChatActive = (active) => {
  isChatActive.value = active
}

// 哪些 Tab 是"地图/聊天"这种需要塞满 main 高度的全屏 Tab
const isFullHeightTab = computed(() => {
  return ['circle', 'policy'].includes(activeTab.value)
})

const currentTabLabel = computed(() => {
  const map = {
    checkin: '星光打卡',
    policy: '医保地图',
    circle: '战术小队',
    library: '经验金库',
    profile: '个人中心',
    admin: '王国控制台',
    drugmap: '药物图谱',
    hospital: '医院调查'
  }
  return map[activeTab.value] || '克罗恩王国'
})

// 切换 Tab 时把滚动容器复位到顶部
watch(activeTab, (newTab) => {
  localStorage.setItem('lastActiveTab', newTab)
  if (scrollMain.value) {
    scrollMain.value.scrollTo({ top: 0, behavior: 'auto' })
  }
})

onMounted(async () => {
  try {
    const res = await http.get("users/getRole")
    roleId.value = res.data
    localStorage.setItem('roleId', res.data)
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
</style>
