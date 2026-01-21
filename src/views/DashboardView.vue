<template>
  <div class="dashboard-page">
    <!-- 顶部栏 -->
    <header class="topbar">
      <div>
        <p class="topbar-sub">Good Morning, 勇士</p>
        <h1 class="topbar-title">欢迎回到 Crohn Kingdom</h1>
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input placeholder="搜索：药物、记录、经验卡片…" />
        </div>
        <div class="user-badge">
          <div class="avatar">轩</div>
          <div class="user-info">
            <span class="name">Architect-Xuan</span>
            <span class="tag">爱与创造ing</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 顶部模块菜单（NEW） -->
    <nav class="main-tabs">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: tab.key === activeTab }"
          @click="activeTab = tab.key"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>
    <!-- 为什么要记录提示 -->

    <!-- 提示小模块：为什么要记录 -->
    <CheckinTab v-if="activeTab === 'checkin'" />

    <!-- 其它模块占位（你以后自己来填） -->
    <main v-else-if="activeTab === 'meds'" class="single-main">
      <section class="card placeholder-card">
        <h2>用药总览（开发中）</h2>
        <p>以后可以在这里做一个「按时间线 / 药物维度」的总览页。</p>
      </section>
    </main>

    <main v-else-if="activeTab === 'log'" class="single-main">
      <section class="card placeholder-card">
        <h2>每日日志（开发中）</h2>
        <p>你可以在这里做 Markdown 日志、情绪记录、关键事件。</p>
      </section>
    </main>

    <PolicyMapTab v-else-if="activeTab === 'policy'" />

    <LibraryTab v-else-if="activeTab === 'library'" />
    <AdminConsoleTab v-else-if="activeTab === 'admin'"/>
    <main v-else-if="activeTab === 'map'" class="single-main">
    </main>
    <button
        @click="handleLogout"
        class="mt-auto flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold"
    >
      <i class="ri-logout-box-r-line text-xl"></i>
      <span>退出登录</span>
    </button>
  </div>
</template>

<script setup>
// 👇 1. 引入我们的新卡片组件
import {computed, onMounted, ref, watch} from 'vue'
import LibraryTab from "@/components/tabs/LibraryTab.vue";
import CheckinTab from "@/components/tabs/CheckinTab.vue";
import PolicyMapTab from "@/components/tabs/PolicyMapTab.vue";
import AdminConsoleTab from "@/components/tabs/AdminConsoleTab.vue";
import http from "@/api/http.js";
import router from "@/router/index.js"; // NEW

// 顶部菜单（NEW）
const roleId = ref(localStorage.getItem('roleId') || '0')
const handleLogout = () => {
  // 1. 问一句，防止手滑
  if(!confirm('兄弟，确定要暂时离开王国吗？')) return

  // 2. 🔥 毁尸灭迹：清空所有身份信息
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('roleId')
  localStorage.removeItem('lastActiveTab') // Tab记忆也顺便清了吧，下次进来从头开始



  // 3. 踢回登录页
  router.push('/login')
}
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

  ...(roleId.value === 1 ? [{ key: 'admin', label: '权限掌控', icon: 'ri-shield-keyhole-line' }] : [])
])

// ✅ 现在的写法：先去 localStorage 找找看有没有存过
// 如果有，就用存的；如果没有，再默认 'checkin'
const activeTab = ref(localStorage.getItem('lastActiveTab') || 'checkin')

// 🌟 关键一步：一旦你点了别的 Tab，立马拿小本本记下来！
// watch 监听器：只要 activeTab 变了，就执行里面的代码
watch(activeTab, (newTab) => {
  localStorage.setItem('lastActiveTab', newTab)
})
onMounted(async () => {
  try {
    console.log('正在与后台同步身份信息...')

    // 假设这是你的 API 请求，我先用 setTimeout 模拟一下异步请求
    // const res = await api.getUserInfo()

    // 模拟：假设后台返回的数据里，你依然是国王 (roleId = 1)
    // 如果后台把你封了，这里就会返回 roleId = 0
    const mockResponse =await http.get("users/getRole")

    // 拿到最新数据
    const latestRole = mockResponse.data

    // Update 1: 更新响应式数据，UI 会自动刷新
    roleId.value = latestRole

    // Update 2: 更新本地缓存，下次进来也准
    localStorage.setItem('roleId', latestRole)

    console.log('身份同步完成，当前权限等级：', latestRole)

  } catch (e) {
    console.error('身份同步失败，降级使用本地缓存')
  }
})


</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 24px 32px 40px;
  background: radial-gradient(circle at top, #111827 0, #020617 55%);
  color: #f9fafb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'PingFang SC',
  sans-serif;
}

/* 顶部栏 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* 原来 24，可以略微调小给 tabs 腾空间 */
}

.topbar-sub {
  font-size: 13px;
  color: #9ca3af;
}

.topbar-title {
  font-size: 22px;
  font-weight: 700;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.search-box input {
  border: none;
  background: transparent;
  color: #e5e7eb;
  outline: none;
  font-size: 13px;
}

.search-box i {
  font-size: 16px;
  color: #6b7280;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #a3e635);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #022c22;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .name {
  font-size: 13px;
  font-weight: 600;
}

.user-info .tag {
  font-size: 11px;
  color: #9ca3af;
}

/* 顶部 tabs（NEW） */
.main-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  margin-top: 4px;
}

.tab-item {
  border: none;
  outline: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.9);
  color: #9ca3af;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.tab-item i {
  font-size: 16px;
}

.tab-item:hover {
  background: rgba(31, 41, 55, 0.9);
  color: #e5e7eb;
}

.tab-item.active {
  background: rgba(22, 163, 74, 0.16);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.6);
}
.card {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 18px;
  padding: 16px 18px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 15px;
  font-weight: 600;
}
.single-main {
  margin-top: 8px;
}

.placeholder-card {
  max-width: 520px;
  margin-top: 12px;
}

/* 地图专属样式 */
.map-card-container {
  /* 让卡片铺满高度，或者至少高一点 */
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.map-viewport {
  flex: 1; /* 让地图占据卡片剩下的所有空间 */
  width: 100%;
  margin-top: 16px;
  background: #f8fafc; /* 给地图一个浅色底，防止透明背景看不清 */
  border-radius: 12px;
  overflow: hidden; /* 防止地图超出圆角 */
  position: relative; /* 这一步很重要，给绝对定位的地图做参考 */
}

/* 如果你的 InsuranceMap 组件里没有定高度，这里可以强行定一下 */
/* :deep() 是 Vue 的一种穿透写法，可以影响子组件的样式 */
:deep(.echarts-map) {
  width: 100% !important;
  height: 100% !important;
  min-height: 500px;
}

</style>
