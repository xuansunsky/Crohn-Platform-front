<template>
  <div class="fixed inset-0 bg-[#FBF9F5] flex flex-col font-sans text-slate-900 overflow-hidden">

    <!-- 唯一的滚动容器 -->
    <main
        ref="scrollMain"
        class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-[#FBF9F5]"
    >
      <transition name="van-fade" mode="out-in">
        <div :key="activeTab" :class="['w-full', isFullHeightTab ? 'h-full' : '']">
          <SocialTab v-if="activeTab === 'circle'" @chat-active="handleChatActive" />
          <CheckinTab v-else-if="activeTab === 'checkin'" @change-tab="activeTab = $event" />
          <FlowTab v-else-if="activeTab === 'flow'" />
          <PolicyMapTab v-else-if="activeTab === 'policy'" />
          <LibraryTab v-else-if="activeTab === 'library'" />
          <ProfileTab v-else-if="activeTab === 'profile'" @change-tab="activeTab = $event" />
          <HealthDiaryTab v-else-if="activeTab === 'diary'" @change-tab="activeTab = $event" />
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
      <div class="flex items-stretch h-[58px] px-2 relative">
        <!-- 左侧 2 个 -->
        <button
            v-for="tab in tabItems.slice(0, 2)"
            :key="tab.name"
            @click="activeTab = tab.name"
            class="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all active:scale-90"
        >
          <div :class="['w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-300', activeTab === tab.name ? 'bg-slate-900' : '']">
            <i :class="[tab.icon, 'text-[18px] transition-colors duration-300', activeTab === tab.name ? 'text-white' : 'text-slate-400']"></i>
          </div>
          <span :class="['text-[10px] font-bold tracking-wide transition-colors duration-300', activeTab === tab.name ? 'text-slate-900' : 'text-slate-400']">{{ tab.label }}</span>
        </button>

        <!-- 中间凸起：起舞（主角） -->
        <div class="flex-1 flex justify-center">
          <button
              @click="activeTab = 'flow'"
              class="absolute -top-5 flex flex-col items-center active:scale-90 transition-all"
          >
            <span
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center text-white text-[24px] shadow-[0_8px_24px_-4px_rgba(99,102,241,0.6)] border-4 border-white transition-all duration-300',
                  activeTab === 'flow'
                    ? 'bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 scale-105'
                    : 'bg-gradient-to-br from-violet-500 to-indigo-600'
                ]"
            >
              <i class="ri-sparkling-fill"></i>
            </span>
            <span :class="['text-[10px] font-black tracking-wide mt-1 transition-colors', activeTab === 'flow' ? 'text-violet-600' : 'text-slate-400']">起舞</span>
          </button>
        </div>

        <!-- 右侧 3 个 -->
        <button
            v-for="tab in tabItems.slice(2)"
            :key="tab.name"
            @click="activeTab = tab.name"
            class="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all active:scale-90"
        >
          <div :class="['w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-300', activeTab === tab.name ? 'bg-slate-900' : '']">
            <i :class="[tab.icon, 'text-[18px] transition-colors duration-300', activeTab === tab.name ? 'text-white' : 'text-slate-400']"></i>
          </div>
          <span :class="['text-[10px] font-bold tracking-wide transition-colors duration-300', activeTab === tab.name ? 'text-slate-900' : 'text-slate-400']">{{ tab.label }}</span>
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

    <!-- 记录页已经有内嵌陪伴角色，避免两个萌娘和气泡同时抢用户注意力 -->
    <PetCompanion :suppress="isChatActive || activeTab === 'flow'" />

  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import http from '@/api/http.js'
import { getAuthItem, setAuthItem } from '@/utils/authToken'
import PetCompanion from '@/components/pet/PetCompanion.vue'

const SocialTab = defineAsyncComponent(() => import('@/components/tabs/SocialTab.vue'))
const CheckinTab = defineAsyncComponent(() => import('@/components/tabs/CheckinTab.vue'))
const FlowTab = defineAsyncComponent(() => import('@/components/tabs/FlowTab.vue'))
const PolicyMapTab = defineAsyncComponent(() => import('@/components/tabs/PolicyMapTab.vue'))
const LibraryTab = defineAsyncComponent(() => import('@/components/tabs/LibraryTab.vue'))
const ProfileTab = defineAsyncComponent(() => import('@/components/tabs/ProfileTab.vue'))
const HealthDiaryTab = defineAsyncComponent(() => import('@/components/tabs/HealthDiaryTab.vue'))
const AdminConsoleTab = defineAsyncComponent(() => import('@/components/tabs/AdminConsoleTab.vue'))
const DrugMapTab = defineAsyncComponent(() => import('@/components/tabs/DrugMapTab.vue'))
const HospitalTab = defineAsyncComponent(() => import('@/components/tabs/HospitalTab.vue'))

const tabItems = [
  { name: 'circle', label: '小队', icon: 'ri-team-line' },
  { name: 'checkin', label: '情报', icon: 'ri-sparkling-2-line' },
  { name: 'policy', label: '地图', icon: 'ri-map-pin-2-line' },
  { name: 'library', label: '金库', icon: 'ri-archive-drawer-line' },
  { name: 'profile', label: '我的', icon: 'ri-user-smile-line' },
]

const roleId = ref(getAuthItem('roleId') || '0')
const savedTab = localStorage.getItem('lastActiveTab')
const validTabs = ['circle', 'checkin', 'policy', 'library', 'profile', 'diary', 'admin', 'drugmap', 'hospital', 'flow']
const activeTab = ref(validTabs.includes(savedTab) ? savedTab : 'checkin')
const isChatActive = ref(false)
const scrollMain = ref(null)

const handleChatActive = (active) => {
  isChatActive.value = active
}

// 哪些 Tab 是"地图/聊天"这种需要塞满 main 高度的全屏 Tab
const isFullHeightTab = computed(() => {
  return ['circle', 'policy', 'flow'].includes(activeTab.value)
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
    setAuthItem('roleId', res.data)
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
</style>
