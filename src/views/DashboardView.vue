<template>
  <div class="bg-gray-50 min-h-screen pb-[50px] font-sans text-gray-800">

    <van-nav-bar fixed placeholder z-index="50" class="shadow-sm">
      <template #left>
        <div class="flex flex-col justify-center py-1">
          <div class="flex items-center gap-1 text-blue-600 font-bold text-lg leading-none">
            <i class="ri-crown-fill"></i> BioHazard
          </div>
          <div class="text-[10px] text-gray-400 mt-1 font-medium tracking-wide">
            早上好 Xuan，今天也要按时吃饭 🌞
          </div>
        </div>
      </template>
      <template #right>
        <div class="flex items-center gap-3">
          <i class="ri-search-line text-xl text-gray-500"></i>
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Architect" class="w-full h-full object-cover">
          </div>
        </div>
      </template>
    </van-nav-bar>

    <main class="p-4 overflow-x-hidden space-y-4">

      <van-swipe v-if="activeTab === 'checkin'" class="my-swipe rounded-xl overflow-hidden shadow-sm h-40" :autoplay="4000" indicator-color="white">
        <van-swipe-item>
          <div class="w-full h-full relative">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" class="w-full h-full object-cover">
            <div class="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-white">
              <p class="text-sm font-bold">去海边吹吹风吧 🌊</p>
              <p class="text-[10px] opacity-80">保持心情愉悦，是缓解炎症的良药。</p>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="w-full h-full relative">
            <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80" class="w-full h-full object-cover">
            <div class="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-white">
              <p class="text-sm font-bold">好好吃饭，慢慢变强 💪</p>
              <p class="text-[10px] opacity-80">每一次记录，都是对身体的负责。</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <transition name="van-fade" mode="out-in">
        <div :key="activeTab" class="w-full">
          <CheckinTab v-if="activeTab === 'checkin'" />

          <PolicyMapTab v-else-if="activeTab === 'policy'" />

          <CircleTab v-else-if="activeTab === 'circle'" /> <LibraryTab v-else-if="activeTab === 'library'" />

          <ProfileTab v-else-if="activeTab === 'profile'" />

          <AdminConsoleTab v-else-if="activeTab === 'admin'" />

          <DrugMapTab v-else-if="activeTab === 'drugmap'" />
          <HospitalTab v-else-if="activeTab === 'hospital'" />

          <van-empty v-else description="正在加载模块..." />
        </div>
      </transition>
    </main>

    <van-tabbar v-model="activeTab" fixed route active-color="#2563EB" inactive-color="#94A3B8" class="shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100">

      <van-tabbar-item name="checkin" icon="fire-o">
        <span>情报</span>
        <template #icon>
          <i class="ri-sparkling-2-line text-xl"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item name="policy" icon="location-o">
        <span>地图</span>
        <template #icon>
          <i class="ri-map-pin-2-line text-xl"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item name="circle" icon="friends-o" badge="3">
        <span>小队</span>
        <template #icon>
          <i class="ri-team-line text-xl"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item name="library" icon="label-o">
        <span>金库</span>
        <template #icon>
          <i class="ri-archive-drawer-line text-xl"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item name="profile" icon="user-o">
        <span>我的</span>
        <template #icon>
          <i class="ri-user-smile-line text-xl"></i>
        </template>
      </van-tabbar-item>

    </van-tabbar>

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
import { ref, computed, onMounted, watch } from 'vue'
import { showConfirmDialog, showToast } from 'vant';

// 引入组件 (确保路径对)
import LibraryTab from "@/components/tabs/LibraryTab.vue";
import CheckinTab from "@/components/tabs/CheckinTab.vue";
import PolicyMapTab from "@/components/tabs/PolicyMapTab.vue";
import AdminConsoleTab from "@/components/tabs/AdminConsoleTab.vue";
import ProfileTab from "@/components/tabs/ProfileTab.vue";
// import CircleTab from "@/components/tabs/CircleTab.vue"; // 暂时注释，除非你创建了这个文件

// 备用组件
// import DrugMapTab from "@/components/tabs/DrugMapTab.vue";
// import HospitalTab from "@/components/tabs/HospitalTab.vue";

import http from "@/api/http.js";
import router from "@/router/index.js";

const roleId = ref(localStorage.getItem('roleId') || '0')
const activeTab = ref(localStorage.getItem('lastActiveTab') || 'checkin')

// 动态标题
const currentTabLabel = computed(() => {
  const map = {
    checkin: '星光打卡',
    policy: '医保地图', // 回来了！
    circle: '战术小队',
    library: '经验金库',
    profile: '个人中心',
    admin: '王国控制台',
    drugmap: '药物图谱',
    hospital: '医院调查'
  }
  return map[activeTab.value] || '克罗恩王国'
})

watch(activeTab, (newTab) => {
  localStorage.setItem('lastActiveTab', newTab)
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
:deep(.van-nav-bar__title) {
  font-weight: 700;
  color: #111827;
}
/* 选中状态变蓝，加粗 */
:deep(.van-tabbar-item--active) {
  font-weight: 600;
  color: #2563EB;
}
</style>