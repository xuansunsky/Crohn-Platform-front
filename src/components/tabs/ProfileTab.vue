<template>
  <div class="xuan-care-container">
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>

    <header class="greeting-bar">
      <div class="greeting-text">
        <span class="greeting-title">早上好 小轩，今天也要按时吃饭 🌼</span>
        <span class="greeting-subtitle">Architect-xuan 专属守护</span>
      </div>
    </header>

    <!-- 身份卡（保持垂直徽章，已按你最新图片更新） -->
    <div class="premium-glass-card">
      <div class="card-glow-bg"></div>

      <div class="profile-content">
        <div class="avatar-wrapper">
          <div class="avatar-glow"></div>
          <img class="avatar" :src="userInfo.avatar" alt="小轩头像" />
          <div class="tech-ring"></div>

          <van-uploader
              :after-read="afterRead"
              class="avatar-uploader"
          >
            <div class="uploader-trigger"></div>
          </van-uploader>

          <div class="status-indicator">
            <span class="status-dot"></span>
          </div>
        </div>

        <div class="profile-info">
          <div class="name-wrapper" @click="openEditName">
            <h2 class="vip-name">{{ userInfo.nickname }}</h2>
            <div class="edit-dot"></div> </div>
          <p class="title-tag">Architect-xuan 专属系统守护者</p>
        </div>

        <van-popup
            v-model:show="showEditName"
            position="bottom"
            round
            class="app-edit-popup"
            teleport="body"
        >
          <div class="popup-header">
            <span class="cancel-btn" @click="showEditName = false">取消</span>
            <span class="popup-title">修改身份标识</span>
            <span class="confirm-btn" @click="onConfirmName">保存</span>
          </div>

          <div class="popup-body">
            <van-field
                v-model="tempNickname"
                placeholder="请输入新的全栈昵称"
                :border="false"
                autofocus
                class="app-input"
                maxlength="15"
            />
            <p class="input-tip">好的名字是架构成功的开始</p>
          </div>
        </van-popup>

      </div>
          <!-- 垂直徽章列表（已更新为最新图片内容） -->
      <div class="badges-list relative group cursor-pointer" @click="showBadgeSelector = true">
        <div class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/10 backdrop-blur text-slate-500 p-1.5 rounded-full z-10 flex items-center justify-center shadow-sm">
          <i class="ri-pencil-fill text-xs"></i>
        </div>

        <div v-for="badge in badgeLibrary.filter(b => b.selected)" :key="badge.id" class="badge-item relative z-0">
          <span class="badge-icon">{{ badge.icon }}</span>
          <span class="badge-text">{{ badge.name }}</span>
        </div>
      </div>
        </div>



    <!-- 🔥 全新简洁版：我的当前状态（超工整、无乱字） -->
    <div class="clean-panel">
      <div class="panel-header">
        <h3 class="panel-title">我的状态参数</h3>
        <span class="edit-hint">点击可切换 ✏️</span>
      </div>

      <div class="status-list">
        <div class="status-row" @click="openMatrixSheet('phase')">
          <span class="row-label">当前阶段</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentPhase.color, background: currentPhase.bgColor }">
            {{ currentPhase.icon }} {{ currentPhase.name }}
          </span>
            <span class="sub-text">{{ currentPhase.days }} 天</span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="line-divider"></div>

        <div class="status-row" @click="openMatrixSheet('diet')">
          <span class="row-label">饮食协议</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentDiet.color, background: currentDiet.bgColor }">
            {{ currentDiet.icon }} {{ currentDiet.name }}
          </span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="line-divider"></div>

        <div class="status-row" @click="openMatrixSheet('gut')">
          <span class="row-label">肠道反馈</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentGut.color, background: currentGut.bgColor }">
            {{ currentGut.icon }} {{ currentGut.name }}
          </span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>
    </div>

       <!-- 修复按钮保持原样但更柔和 -->
    <div class="recovery-section">
      <button class="btn-recovery" @click="triggerRecovery">
        <span class="btn-icon">❤️💊</span>
        <span class="btn-text">启动战后修复协议</span>
      </button>
      <p class="recovery-tip">别怕，吃错了我们马上降级，小轩的架构永远在线。</p>
    </div>

    <div class="glass-card menu-list">
      <div class="menu-item">
        <span class="menu-icon">💬</span>
        <span class="menu-text">克罗恩病友圈</span>
        <span class="menu-badge">2条新战报</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item">
        <span class="menu-icon">📝</span>
        <span class="menu-text">我的温和饮食清单</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item" @click="uploadMedicalRecord">
        <span class="menu-icon">🔐</span>
        <span class="menu-text">病例上传与权限解锁</span>
      </div>
    </div>
  </div>
  <transition name="van-slide-up">
  <div v-if="showBadgeSelector" class="fixed inset-0 z-[150] flex flex-col justify-end">

    <div @click="showBadgeSelector = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>

    <div class="relative w-full h-[85vh] bg-white/95 backdrop-blur-2xl rounded-t-[36px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border-t border-white">

      <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

      <div class="shrink-0 px-6 pt-10 pb-4 flex justify-between items-end border-b border-slate-100">
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            荣誉徽章库 <i class="ri-vip-diamond-fill text-blue-500 animate-pulse"></i>
          </h2>
          <p class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            已装备: <span :class="selectedCount === MAX_BADGES ? 'text-blue-600' : 'text-slate-800'">{{ selectedCount }}</span> / {{ MAX_BADGES }}
          </p>
        </div>
        <button @click="showBadgeSelector = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors active:scale-90">
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-8 pb-32">

        <div v-for="category in ['官方身份', '饮食流派', '战神荣誉']" :key="category">
          <h3 class="text-[13px] font-black text-slate-400 mb-4 tracking-widest flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {{ category }}
          </h3>

          <div class="grid grid-cols-2 gap-3">
            <div v-for="badge in badgeLibrary.filter(b => b.category === category)" :key="badge.id"
                 @click="toggleBadge(badge)"
                 class="relative p-4 rounded-2xl cursor-pointer transition-all duration-300 active:scale-95 group overflow-hidden"
                 :class="[
                       badge.selected
                        ? 'bg-white border-2 border-blue-500 shadow-[0_8px_20px_rgba(59,130,246,0.15)] ring-4 ring-blue-50'
                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                     ]">

              <div v-if="badge.selected" class="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-bl-2xl flex items-center justify-center shadow-sm">
                <i class="ri-check-line text-white text-lg font-black relative top-0.5 right-0.5"></i>
              </div>

              <div class="flex flex-col items-center text-center mt-1">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner mb-3 transition-transform duration-300 group-hover:scale-110"
                     :class="[badge.selected ? badge.bg : 'bg-slate-200/50']">
                  {{ badge.icon }}
                </div>
                <h4 class="text-[14px] font-black tracking-tight" :class="badge.selected ? 'text-slate-800' : 'text-slate-500'">
                  {{ badge.name }}
                </h4>
                <p class="text-[10px] font-medium mt-1" :class="badge.selected ? 'text-blue-500/80' : 'text-slate-400'">
                  {{ badge.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white/90 to-transparent pt-12">
        <button @click="saveBadges"
                class="w-full bg-slate-900 text-white font-black text-[16px] py-4 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.3)] hover:shadow-[0_10px_40px_rgba(15,23,42,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          装备徽章 <i class="ri-shield-flash-fill text-blue-400"></i>
        </button>
      </div>

    </div>
  </div>
</transition>
  <transition name="van-slide-up">
    <div v-if="activeSheetType" class="fixed inset-0 z-[200] flex flex-col justify-end">

      <div @click="activeSheetType = ''" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"></div>

      <div class="relative w-full bg-slate-50/95 backdrop-blur-2xl rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-white">

        <div class="px-6 pt-8 pb-5 flex justify-between items-center border-b border-slate-200/60 bg-white/50">
          <h3 class="text-[17px] font-black text-slate-800 tracking-tight flex items-center gap-2">
            <i class="ri-equalizer-line text-blue-500"></i>
            {{ sheetTitles[activeSheetType] }}
          </h3>
          <button @click="activeSheetType = ''" class="w-8 h-8 flex items-center justify-center bg-slate-200/50 text-slate-500 rounded-full active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </div>

        <div class="p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-2 gap-3">

            <div v-for="item in statusLibrary[activeSheetType]" :key="item.id"
                 @click="selectStatus(item)"
                 class="relative p-4 rounded-2xl cursor-pointer transition-all duration-300 active:scale-95 border-2 flex flex-col justify-between min-h-[100px] overflow-hidden group"
                 :class="[
                     currentSelectedIds[activeSheetType] === item.id
                      ? `${item.bg} ${item.border} shadow-md ring-2 ring-white scale-[1.02]`
                      : 'bg-white border-transparent shadow-sm hover:shadow-md'
                   ]">

              <div v-if="currentSelectedIds[activeSheetType] === item.id"
                   class="absolute -top-10 -right-10 w-24 h-24 bg-white/40 rounded-full blur-xl pointer-events-none"></div>

              <div class="flex items-start justify-between relative z-10">
                <span class="text-2xl drop-shadow-sm">{{ item.icon }}</span>
                <i v-if="currentSelectedIds[activeSheetType] === item.id"
                   class="ri-checkbox-circle-fill text-[20px]" :class="item.color"></i>
              </div>

              <div class="mt-3 relative z-10">
                <h4 class="text-[14px] font-black tracking-tight text-slate-800 mb-0.5">{{ item.name }}</h4>
                <p class="text-[10px] font-medium text-slate-500 leading-tight">{{ item.desc }}</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  </transition>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { closeToast, showToast } from 'vant'
import http from '@/api/http.js'

// 应急操作
const triggerRecovery = () => {
  alert('【系统级降级预案已启动】\n小轩，立刻切换全流质模式！小轩为你护航！')
}

const uploadMedicalRecord = () => {
  alert('安全加密通道已开启，准备上传病历...')
}

// 当前状态展示
const currentPhase = ref({ name: '临床缓解期', icon: '✨', days: 128, color: '#6b46c1', bgColor: 'rgba(107, 70, 193, 0.1)' })
const currentDiet = ref({ name: '低 FODMAP', icon: '🌿', color: '#0d9488', bgColor: 'rgba(13, 148, 136, 0.1)' })
const currentGut = ref({ name: '运行平稳', icon: '🟢', color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.1)' })

const showBadgeSelector = ref(false)
const MAX_BADGES = 3

// 荣誉徽章数据
const badgeLibrary = ref([
  { id: 1, category: '官方身份', icon: '🛡️', name: '克罗恩 V1 认证', desc: '系统初代守护者', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', selected: true },
  { id: 2, category: '官方身份', icon: '⚙️', name: '全栈架构师', desc: '代码改变命运', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', selected: true },

  { id: 3, category: '饮食流派', icon: '🌿', name: '无麸质探路者', desc: '坚守纯净饮食', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', selected: true },
  { id: 4, category: '饮食流派', icon: '🥩', name: '食肉狂战士', desc: '高蛋白纯肉摄入', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', selected: false },
  { id: 5, category: '饮食流派', icon: '🥥', name: '低FODMAP大师', desc: '精准避开产气雷区', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', selected: false },

  { id: 6, category: '战神荣誉', icon: '⚔️', name: '钢铁肠道', desc: '已挺过最难的阶段', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', selected: false },
  { id: 7, category: '战神荣誉', icon: '🧘‍♂️', name: '禅定修心者', desc: '情绪稳定，百毒不侵', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', selected: false },
  { id: 8, category: '战神荣誉', icon: '🩸', name: '生物制剂老兵', desc: '抗体在血液中燃烧', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', selected: false },
])

const selectedCount = computed(() => badgeLibrary.value.filter(b => b.selected).length)

const toggleBadge = (badge) => {
  if (badge.selected) {
    badge.selected = false
  } else {
    if (selectedCount.value >= MAX_BADGES) {
      console.log('最多只能装备 3 枚徽章！')
      return
    }
    badge.selected = true
  }
}

const saveBadges = async () => {
  showBadgeSelector.value = false

  const selectedNames = badgeLibrary.value
      .filter(b => b.selected)
      .map(b => b.name)

  const payload = {
    badges: JSON.stringify(selectedNames)
  }

  try {
    const res = await http.post('/center/update-badges', payload)

    if (res.data?.code === 200) {
      showToast({ type: 'success', message: '荣誉徽章装备成功！' })
    } else {
      showToast({ type: 'fail', message: res.message || '装备失败，请重试' })
    }
  } catch (error) {
    console.error('装备徽章异常:', error)
    showToast({ type: 'fail', message: '网络信号弱，装备同步失败' })
  }
}

const currentEditType = ref('')

const userInfo = ref({
  nickname: '全栈架构师_小轩',
  avatar: 'https://picsum.photos/id/64/300/300',
  userId: null
})

const afterRead = async (file) => {
  const formData = new FormData()

  formData.append('file', file.file)
  try {
    const uploadRes = await http.post('/upload', formData)
    const newAvatarUrl = uploadRes.data

    await http.post('/center/update-basic', {
      avatar: newAvatarUrl
    })

    userInfo.value.avatar = newAvatarUrl
    showToast('头像已在位 🚀')
  } catch (err) {
    showToast('链路中断')
  } finally {
    closeToast()
  }
}

const showEditName = ref(false)
const tempNickname = ref('')
const openEditName = () => {
  tempNickname.value = userInfo.value.nickname
  showEditName.value = true
}

const activeSheetType = ref('')

// 动态弹窗的标题字典
const sheetTitles = {
  phase: '诊断雷达：更新当前阶段',
  diet:  '能量补给：切换饮食协议',
  gut:   '生物反馈：记录肠道状态'
}

// 状态选项库
const statusLibrary = ref({
  phase: [
    { id: 'p1', icon: '✨', name: '临床缓解期', desc: '指标正常，岁月静好', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'p2', icon: '🔥', name: '急性发作期', desc: '炎症风暴，需要支援', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'p3', icon: '🛡️', name: '隐匿活动期', desc: '表面平静，暗流涌动', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'p4', icon: '🩹', name: '术后恢复期', desc: '重塑防线，稳步回血', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  ],
  diet: [
    { id: 'd1', icon: '🌿', name: '低FODMAP', desc: '精准避开产气雷区', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { id: 'd2', icon: '💧', name: '全流食协议', desc: '肠道最高级别休眠', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'd3', icon: '🌾', name: '无麸质饮食', desc: '切断潜在致敏源头', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'd4', icon: '🍱', name: '常规探路', desc: '小心试探，逐步扩容', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
  ],
  gut: [
    { id: 'g1', icon: '🟢', name: '运行平稳', desc: '毫无波澜，完美吸收', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'g2', icon: '🟡', name: '轻度波动', desc: '咕噜作响，偶有不适', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'g3', icon: '🔴', name: '警报拉响', desc: '拉肚子/腹痛加剧', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
  ]
})

// 模拟你目前选中的状态（用来和卡片对比高亮）
const currentSelectedIds = ref({
  phase: 'p1', // 默认选中临床缓解期
  diet: 'd1',  // 默认低FODMAP
  gut: 'g1'    // 默认平稳
})

// 点击列表行时，打开对应类型的控制台
const openMatrixSheet = (type) => {
  activeSheetType.value = type
}

// 在控制台中点击选中某个卡片
const selectStatus = (item) => {
  // 1. 前端 UI 瞬间点亮（对号打上），给用户“秒响应”的快感
  currentSelectedIds.value[activeSheetType.value] = item.id

  // 2. 让外面主页的标签跟着变色、变字
  if (activeSheetType.value === 'phase') currentPhase.value = item
  if (activeSheetType.value === 'diet') currentDiet.value = item
  if (activeSheetType.value === 'gut') currentGut.value = item

  // 3. 组装发给后端的数据 (根据点击的不同类型，动态生成不同的 key)
  const payload = {}
  if (activeSheetType.value === 'phase') payload.healthPhase = item.name
  if (activeSheetType.value === 'diet')  payload.dietStrategy = item.name
  if (activeSheetType.value === 'gut')   payload.bowelStatus = item.name

  // 4. 延迟 300ms 丝滑关闭抽屉
  setTimeout(() => {
    activeSheetType.value = ''
  }, 300)

  // 后台同步状态，不阻塞当前交互
  http.post('/center/update-status', payload).then(res => {
    // 可以静默成功，什么都不提示，或者在控制台打印一下
    console.log(`[系统日志] ${item.name} 状态已同步至云端`)
  }).catch(err => {
    // 只有失败的时候才弹出来提醒用户
    showToast({ type: 'fail', message: '状态同步失败，正在重试' })
  })
}
// 1. 定义拉取函数
const loadData = async () => {
  try {
    const res = await http.get('/center/info');

    // ⚠️ 注意：根据你的 ApiResponse 结构，如果数据包了一层，这里可能是 res.data.data
    // 假设你的 axios 拦截器已经去掉了最外层，这里用 res.data
    const profile = res.data?.data || res.data;

    if (profile) {
      // 1. 同步基础信息
      userInfo.value.nickname = profile.nickname || '未命名特工';
      userInfo.value.avatar = profile.avatar || 'https://picsum.photos/id/64/300/300';
      userInfo.value.userId = profile.userId;

      // 2. 匹配并点亮【当前阶段】
      if (profile.healthPhase) {
        // 在本地的 statusLibrary 里找到对应名字的那张卡片
        const foundPhase = statusLibrary.value.phase.find(item => item.name === profile.healthPhase);
        if (foundPhase) {
          // 加上后端算好的天数！
          currentPhase.value = { ...foundPhase, days: profile.maintainedDays || 0 };
          currentSelectedIds.value.phase = foundPhase.id; // 让抽屉里的卡片高亮
        }
      }

      // 3. 匹配并点亮【饮食协议】
      if (profile.dietStrategy) {
        const foundDiet = statusLibrary.value.diet.find(item => item.name === profile.dietStrategy);
        if (foundDiet) {
          currentDiet.value = foundDiet;
          currentSelectedIds.value.diet = foundDiet.id;
        }
      }

      // 4. 匹配并点亮【肠道反馈】
      if (profile.bowelStatus) {
        const foundGut = statusLibrary.value.gut.find(item => item.name === profile.bowelStatus);
        if (foundGut) {
          currentGut.value = foundGut;
          currentSelectedIds.value.gut = foundGut.id;
        }
      }

      // 5. 扫描并装备【荣誉徽章】
      // 后端传过来的是 badgeCodes: ["克罗恩 V1 认证", "全栈架构师"]
      if (profile.badgeCodes && Array.isArray(profile.badgeCodes)) {
        badgeLibrary.value.forEach(badge => {
          // 如果徽章的名字在后端的数组里，就设为 true (点亮)，否则为 false
          badge.selected = profile.badgeCodes.includes(badge.name);
        });
      } else {
        // 如果后端没传或者数组为空，全部卸下
        badgeLibrary.value.forEach(badge => badge.selected = false);
      }
    }
  } catch (error) {
    console.error('获取个人档案失败:', error);
  }
};
// 2. 挂载时触发：这就是“拉取”真理的过程
onMounted(() => {
  loadData();
});
const onConfirmName = async () => {
  if (!tempNickname.value.trim() || tempNickname.value === userInfo.value.nickname) {
    showEditName.value = false;
    return;
  }

  // 你的剥壳 http 调用
  await http.post('/center/update-basic', {
    nickname: tempNickname.value
  });

  userInfo.value.nickname = tempNickname.value;
  showEditName.value = false;
  showToast({ message: '标识已重构', icon: 'success' });
};
</script>

<style scoped>
.tag-dynamic {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 10px;
  transition: all 0.3s ease; /* 颜色切换时加个柔和的过渡动画 */
}
/* 全局保持不变（只微调了间距让整体更舒服） */
.xuan-care-container {
  min-height: 100vh;
  background-color: #f0f4f8;
  position: relative;
  overflow: hidden;
  padding: 14px 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #4a5568;
  max-width: 440px;
  margin: 0 auto;
}

.bg-shape { position: absolute; border-radius: 50%; filter: blur(60px); z-index: 0; opacity: 0.45; }
.shape-1 { width: 160px; height: 160px; background: #b39ddb; top: -30px; right: -30px; }
.shape-2 { width: 200px; height: 200px; background: #ff8e8b; bottom: 60px; left: -70px; }

.greeting-bar { margin-bottom: 16px; }
.greeting-title { font-size: 17px; font-weight: 600; color: #2d3748; }
.greeting-subtitle { font-size: 12px; color: #7ba4c9; opacity: 0.9; }

/* 身份卡保持高端 */
.premium-glass-card {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 24px;
  padding: 20px 18px;
  margin-bottom: 18px;
  box-shadow: 0 18px 36px -8px rgba(123,164,201,0.15);
}
.card-glow-bg {
  position: absolute;
  inset: -60%;
  background: radial-gradient(circle at 30% 20%, rgba(179,157,219,0.18) 0%, transparent 55%);
  animation: slow-rotate 28s linear infinite;
}

.profile-content { position: relative; z-index: 1; display: flex; align-items: center; }
.avatar-wrapper { position: relative; width: 76px; height: 76px; margin-right: 16px; flex-shrink: 0; }
.avatar { width: 76px; height: 76px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 10px 24px rgba(0,0,0,0.12); z-index: 3; }
.vip-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(90deg, #1e2937, #475569); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.verified-badge { width: 19px; height: 19px; background: linear-gradient(135deg, #22d3ee, #67e8f9); color: white; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(103,232,249,0.4); }
.title-tag { font-size: 13.5px; color: #64748b; margin-bottom: 8px; font-weight: 500; }

/* 垂直徽章（干净工整） */
.badges-list { margin-top: 10px; display: flex; flex-direction: column; gap: 7px; }
.badge-item {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255,255,255,0.75);
  border-radius: 9999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #4338ca;
  box-shadow: 0 2px 6px rgba(123,164,201,0.1);
}
.badge-icon { font-size: 16px; }

/* 🔥 全新健康状态卡（超级工整版） */

/* 其余部分保持一致 */
.recovery-section { margin-bottom: 18px; text-align: center; }
.btn-recovery {
  width: 100%;
  border: none;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  color: white;
  padding: 17px 20px;
  border-radius: 9999px;
  font-size: 15.5px;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}
.btn-recovery:active { transform: scale(0.97); }
.btn-icon { font-size: 22px; }
.recovery-tip { font-size: 12px; color: #94a3b8; margin-top: 10px; }

.glass-card { background: rgba(255,255,255,0.65); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.8); border-radius: 22px; padding: 8px 16px; margin-bottom: 16px; }
.menu-item { display: flex; align-items: center; padding: 14px 0; }
.menu-icon { font-size: 21px; margin-right: 14px; }
.menu-text { flex: 1; font-size: 15px; font-weight: 500; }
.menu-badge { font-size: 12px; color: #ff8e8b; background: rgba(255,142,139,0.12); padding: 3px 9px; border-radius: 9999px; }
/* --- 极致工整的卡片面板样式 --- */
.clean-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 0; /* 留白交给内部 row */
  margin-bottom: 18px;
  box-shadow: 0 8px 24px rgba(123, 164, 201, 0.08);
  overflow: hidden; /* 保证圆角不被破坏 */
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px 8px;
}

.panel-title {
  font-size: 15px;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
}

.edit-hint {
  font-size: 12px;
  color: #a0aec0;
}

/* 列表行样式 (绝对对齐) */
.status-list {
  display: flex;
  flex-direction: column;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-row:active {
  background-color: rgba(0, 0, 0, 0.03); /* 点击时的反馈 */
}

.row-label {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

.row-value {
  display: flex;
  align-items: center;
  gap: 8px; /* 元素间距绝对固定 */
}


.sub-text {
  font-size: 12px;
  color: #718096;
  font-family: 'SF Mono', monospace;
}


.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px 8px;
}

.panel-title {
  font-size: 15px;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
}

.edit-hint {
  font-size: 12px;
  color: #a0aec0;
}

/* 列表行样式 (绝对对齐) */
.status-list {
  display: flex;
  flex-direction: column;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-row:active {
  background-color: rgba(0, 0, 0, 0.03); /* 点击时的反馈 */
}

.row-label {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}
/* 昵称旁的小点点，暗示可点 */
.edit-dot {
  width: 6px;
  height: 6px;
  background: #22d3ee;
  border-radius: 50%;
  margin-left: 8px;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
}

.app-edit-popup {
  padding-bottom: env(safe-area-inset-bottom); /* 适配全面屏 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 0.5px solid #eee;
}

.popup-title { font-weight: 600; font-size: 16px; color: #333; }
.cancel-btn { color: #999; font-size: 14px; }
.confirm-btn { color: #4338ca; font-weight: 700; font-size: 14px; }

.popup-body { padding: 24px 20px 40px; }

.app-input {
  background: #f5f7fa !important;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
}

.input-tip {
  font-size: 12px;
  color: #ccc;
  margin-top: 12px;
  text-align: center;
}
.row-value {
  display: flex;
  align-items: center;
  gap: 8px; /* 元素间距绝对固定 */
}


.sub-text {
  font-size: 12px;
  color: #718096;
  font-family: 'SF Mono', monospace;
}

.arrow {
  font-size: 18px;
  color: #cbd5e1;
  margin-left: 4px;
  font-family: monospace;
}

.line-divider {
  height: 1px;
  background-color: rgba(226, 232, 240, 0.6);
  margin: 0 18px; /* 左右留白，类似微信设置页的分割线 */
}
.arrow {
  font-size: 18px;
  color: #cbd5e1;
  margin-left: 4px;
  font-family: monospace;
}
/* 1. 确保父容器是定位基准 */
.avatar-wrapper {
  position: relative; /* 必须有这个，否则 uploader 会飞到页面顶端 */
  width: 76px;
  height: 76px;
}

/* 2. 让上传组件完全盖在头像图层之上 */
.avatar-uploader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 确保在所有装饰元素（tech-ring等）的最顶层 */
  opacity: 0;  /* 保持透明，不破坏你的高阶审美 */
}

/* 3. 核心：必须给内部 trigger 一个确定的宽高，否则点击区域是 0 */
.uploader-trigger {
  width: 76px;
  height: 76px;
  cursor: pointer;
}

.line-divider {
  height: 1px;
  background-color: rgba(226, 232, 240, 0.6);
  margin: 0 18px; /* 左右留白，类似微信设置页的分割线 */
}
/* 动画 */
@keyframes slow-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>