<template>
  <div class="xuan-care-container">
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>

    <TabPageHeader
      title="我的"
      accent="violet"
    />

    <!-- 身份卡 -->
    <div class="premium-glass-card">
      <div class="card-glow-bg"></div>

      <div class="profile-content">
        <div class="avatar-wrapper">
          <button type="button" class="avatar-button" @click="showAvatarPicker = true">
            <img class="avatar" :src="userInfo.avatar" alt="头像" />
            <span class="avatar-edit-badge">
              <i class="ri-camera-line"></i>
            </span>
          </button>
        </div>

        <div class="profile-info">
          <div class="name-wrapper" @click="openEditName">
            <h2 class="vip-name">{{ userInfo.nickname }}</h2>
            <i class="ri-edit-line edit-pencil"></i>
          </div>
          <div class="member-chip">
            <i class="ri-vip-crown-fill member-chip-icon"></i>
            <span>乐园成员</span>
          </div>
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
            <span class="popup-title">修改昵称</span>
            <span class="confirm-btn" @click="onConfirmName">保存</span>
          </div>

          <div class="popup-body">
            <van-field
                v-model="tempNickname"
                placeholder="请输入新昵称"
                :border="false"
                autofocus
                class="app-input"
                maxlength="15"
            />
          </div>
        </van-popup>

        <van-popup
            v-model:show="showAvatarPicker"
            position="bottom"
            round
            class="avatar-picker-popup"
            teleport="body"
        >
          <div class="avatar-picker">
            <div class="avatar-picker-header">
              <div>
                <h3 class="avatar-picker-title">换个头像</h3>
                <p class="avatar-picker-subtitle">选一个温暖的默认头像，或者上传自己的照片</p>
              </div>
              <button type="button" class="avatar-picker-close" @click="showAvatarPicker = false">
                <i class="ri-close-line"></i>
              </button>
            </div>

            <div class="avatar-preview-card">
              <img :src="userInfo.avatar" class="avatar-preview-img" alt="当前头像" />
              <div>
                <p class="avatar-preview-title">{{ userInfo.nickname || '我的头像' }}</p>
                <p class="avatar-preview-text">当前正在使用</p>
              </div>
            </div>

            <div class="default-avatar-grid">
              <button
                  v-for="avatar in avatarOptions"
                  :key="avatar"
                  type="button"
                  class="default-avatar-option"
                  :class="{ 'default-avatar-option-active': userInfo.avatar === avatar }"
                  :disabled="avatarSaving"
                  @click="selectDefaultAvatar(avatar)"
              >
                <img :src="avatar" alt="默认头像" />
                <i v-if="userInfo.avatar === avatar" class="ri-check-line"></i>
              </button>
            </div>

            <van-uploader
                :after-read="afterRead"
                accept="image/*"
                :disabled="avatarSaving"
                class="avatar-upload-action"
            >
              <div class="avatar-upload-card">
                <span class="avatar-upload-icon">
                  <i class="ri-image-add-line"></i>
                </span>
                <div>
                  <p class="avatar-upload-title">上传自己的头像</p>
                  <p class="avatar-upload-text">从相册选一张，马上换上</p>
                </div>
              </div>
            </van-uploader>
          </div>
        </van-popup>

      </div>
      <!-- 徽章列表 -->
      <div class="badges-list relative group cursor-pointer" @click="showBadgeSelector = true">
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
   
    </div>

    <div class="glass-card menu-list animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div class="menu-item" @click="showCityPicker = true">
        <span class="menu-icon">📍</span>
        <span class="menu-text">我的城市</span>
        <span class="menu-badge" style="background: rgba(59,130,246,0.1); color: rgb(59,130,246);">{{ userInfo.city || '未设置' }}</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item" @click="emit('change-tab', 'circle')">
        <span class="menu-icon">💬</span>
        <span class="menu-text">密友圈</span>
        <span class="menu-badge">2条新战报</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item">
        <span class="menu-icon">📝</span>
        <span class="menu-text">我的温和饮食清单</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item" @click="emit('change-tab', 'drugmap')">
        <span class="menu-icon">💊</span>
        <span class="menu-text">常用药物图谱 & 闹钟守护</span>
        <span class="menu-badge" style="background: rgba(16, 185, 129, 0.12); color: rgb(16, 185, 129);">安全配药</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item" @click="emit('change-tab', 'hospital')">
        <span class="menu-icon">🏥</span>
        <span class="menu-text">顶级推荐专科与就诊绿道</span>
      </div>
      <div class="divider"></div>
      <div class="menu-item" @click="uploadMedicalRecord">
        <span class="menu-icon">🔐</span>
        <span class="menu-text">病例上传与权限解锁</span>
      </div>
    </div>

    <button class="logout-card" type="button" @click="handleLogout">
      <span class="logout-icon"><i class="ri-logout-box-r-line"></i></span>
      <span class="logout-main">
        <span class="logout-title">退出登录</span>
        <span class="logout-subtitle">下次回来，乐园还在这里</span>
      </span>
      <i class="ri-arrow-right-s-line logout-arrow"></i>
    </button>
  </div>

  <!-- 城市选择弹窗 -->
  <van-popup v-model:show="showCityPicker" position="bottom" round teleport="body">
    <div class="city-picker">
      <div class="city-picker-header">
        <span class="city-picker-title">选择你的城市</span>
        <button @click="showCityPicker = false" class="city-picker-close">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="city-search-wrap">
        <i class="ri-search-line city-search-icon"></i>
        <input
          v-model="citySearch"
          type="text"
          class="city-search-input"
          placeholder="搜索城市，如 北京、上海、杭州"
        />
        <i v-if="citySearch" class="ri-close-circle-fill city-search-clear" @click="citySearch = ''"></i>
      </div>

      <div class="city-grid">
        <button
          v-for="c in filteredCityList" :key="c"
          @click="onSelectCity(c)"
          class="city-chip"
          :class="{ 'city-chip-active': userInfo.city === c }"
        >{{ c }}</button>
        <p v-if="filteredCityList.length === 0" class="city-empty">没找到「{{ citySearch }}」，换个关键词试试</p>
      </div>
    </div>
  </van-popup>

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
import { useRouter } from 'vue-router'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import { areaList } from '@vant/area-data'
import { closeToast, showToast } from 'vant'
import http from '@/api/http.js'
import { DEFAULT_AVATARS, avatarOf } from '@/utils/avatarPool'
import { clearAuthSession } from '@/utils/authToken'

const emit = defineEmits(['change-tab'])
const router = useRouter()

// 应急操作
const triggerRecovery = () => {
  alert('【系统级降级预案已启动】\n小轩，立刻切换全流质模式！小轩为你护航！')
}

const uploadMedicalRecord = () => {
  localStorage.setItem('openVerifyUpload', '1')
  emit('change-tab', 'circle')
}

const handleLogout = async () => {
  if (!confirm('确定要退出当前账号吗？')) return
  clearAuthSession()
  localStorage.removeItem('lastActiveTab')
  showToast({ message: '已退出登录', icon: 'success' })
  await router.replace('/login2')
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

    if (res.status === 200 || res.code === 200) {
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
  avatar: avatarOf('', 'me'),
  userId: null,
  city: ''
})

const showAvatarPicker = ref(false)
const avatarSaving = ref(false)
const avatarOptions = DEFAULT_AVATARS

const persistAvatar = async (avatar, successMessage) => {
  if (!avatar || avatarSaving.value) return
  avatarSaving.value = true
  showToast({ type: 'loading', message: '正在换头像', duration: 0, forbidClick: true })

  try {
    await http.post('/center/update-basic', { avatar })
    userInfo.value.avatar = avatar
    showAvatarPicker.value = false
    closeToast()
    showToast({ message: successMessage, icon: 'success' })
  } catch (err) {
    closeToast()
    showToast({ type: 'fail', message: '头像没换上，再试一次' })
  } finally {
    avatarSaving.value = false
  }
}

const selectDefaultAvatar = async (avatar) => {
  if (avatar === userInfo.value.avatar) {
    showAvatarPicker.value = false
    return
  }
  await persistAvatar(avatar, '头像已换好')
}

const pickUploadUrl = (uploadRes) => {
  if (typeof uploadRes === 'string') return uploadRes
  if (typeof uploadRes?.data === 'string') return uploadRes.data
  if (typeof uploadRes?.url === 'string') return uploadRes.url
  return ''
}

const afterRead = async (file) => {
  const formData = new FormData()

  formData.append('file', file.file)
  if (avatarSaving.value) return
  avatarSaving.value = true
  showToast({ type: 'loading', message: '正在上传', duration: 0, forbidClick: true })

  try {
    const uploadRes = await http.post('/upload', formData)
    const newAvatarUrl = pickUploadUrl(uploadRes)

    if (!newAvatarUrl) {
      throw new Error('empty avatar url')
    }

    await http.post('/center/update-basic', {
      avatar: newAvatarUrl
    })

    userInfo.value.avatar = newAvatarUrl
    showAvatarPicker.value = false
    closeToast()
    showToast({ message: '头像已上传', icon: 'success' })
  } catch (err) {
    closeToast()
    showToast({ type: 'fail', message: '上传失败，再试一次' })
  } finally {
    avatarSaving.value = false
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
      userInfo.value.avatar = avatarOf(profile.avatar, profile.userId || profile.nickname || 'me');
      userInfo.value.userId = profile.userId;
      userInfo.value.city = profile.city || '';

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

// === 城市选择 ===
const showCityPicker = ref(false)
const citySearch = ref('')

// areaList 是一个对象（province_list/city_list/county_list），不能直接 v-for。
// 这里把直辖市/特别行政区（在 province_list 中）与地级市（在 city_list 中）
// 合并成一个中文城市名数组，去重后供选择。
const cityList = (() => {
  const names = new Set()
  const directCities = ['北京市', '天津市', '上海市', '重庆市', '香港特别行政区', '澳门特别行政区']
  Object.values(areaList.province_list || {}).forEach(p => {
    if (directCities.includes(p)) names.add(p.replace(/(市|特别行政区)$/, ''))
  })
  Object.values(areaList.city_list || {}).forEach(c => {
    names.add(c.replace(/(市|地区|自治州|盟)$/, ''))
  })
  return Array.from(names).filter(Boolean)
})()

const filteredCityList = computed(() => {
  const kw = citySearch.value.trim()
  if (!kw) return cityList
  return cityList.filter(c => c.includes(kw))
})

const onSelectCity = async (city) => {
  try {
    await http.post('/center/update-basic', { city })
    userInfo.value.city = city
    showCityPicker.value = false
    citySearch.value = ''
    showToast({ message: '城市已更新', icon: 'success' })
  } catch (e) {
    showToast('更新失败')
  }
}
</script>

<style scoped>
/* 适配新的 App Shell 布局：父级 main 负责滚动，这里不再 min-h 也不再 overflow:hidden */
.xuan-care-container {
  background-color: #FBF9F5;
  position: relative;
  padding: 0 16px 32px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #4a5568;
  max-width: 440px;
  margin: 0 auto;
}

.bg-shape { position: absolute; border-radius: 50%; filter: blur(70px); z-index: 0; opacity: 0.3; }
.shape-1 { width: 160px; height: 160px; background: #b39ddb; top: -30px; right: -30px; }
.shape-2 { width: 200px; height: 200px; background: #ff8e8b; bottom: 60px; left: -70px; }

.logout-card {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 14px 0 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(244, 63, 94, 0.10);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 10px 26px -18px rgba(127, 29, 29, 0.28);
  color: #7f1d1d;
  text-align: left;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}
.logout-card:active {
  transform: scale(0.985);
  background: #fff5f5;
  box-shadow: 0 8px 20px -18px rgba(127, 29, 29, 0.34);
}
.logout-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 63, 94, 0.09);
  color: #e11d48;
  font-size: 18px;
  flex-shrink: 0;
}
.logout-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.logout-title {
  font-size: 14px;
  font-weight: 800;
  color: #9f1239;
}
.logout-subtitle {
  font-size: 11px;
  font-weight: 600;
  color: #c08497;
}
.logout-arrow {
  font-size: 20px;
  color: #fecdd3;
}

/* 身份卡 */
.premium-glass-card {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 18px 16px;
  margin-bottom: 14px;
  box-shadow: 0 8px 24px -8px rgba(123,164,201,0.12);
}
.card-glow-bg {
  position: absolute;
  inset: -60%;
  background: radial-gradient(circle at 30% 20%, rgba(179,157,219,0.12) 0%, transparent 55%);
  animation: slow-rotate 28s linear infinite;
}

.profile-content { position: relative; z-index: 1; display: flex; align-items: center; }
.avatar-wrapper { position: relative; width: 72px; height: 72px; margin-right: 14px; flex-shrink: 0; }
.avatar-button {
  position: relative;
  width: 72px;
  height: 72px;
  padding: 0;
  border: 0;
  border-radius: 24px;
  background: transparent;
  cursor: pointer;
}
.avatar-button:active { transform: scale(0.97); }
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  border: 3px solid #fff;
  box-shadow: 0 10px 24px rgba(101, 85, 143, 0.16);
  object-fit: cover;
  display: block;
}
.avatar-edit-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border: 2px solid #fff;
  box-shadow: 0 8px 16px rgba(124, 58, 237, 0.22);
  font-size: 13px;
}
.vip-name { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(90deg, #1e2937, #475569); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.name-wrapper { display: flex; align-items: center; cursor: pointer; }
.edit-pencil {
  margin-left: 7px;
  font-size: 13px;
  color: #b0b8c4;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;
}
.name-wrapper:hover .edit-pencil,
.name-wrapper:active .edit-pencil { opacity: 1; transform: translateX(0); }

.member-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  padding: 3px 10px 3px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  color: #b45309;
  background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.12));
  border: 1px solid rgba(245,158,11,0.25);
}
.member-chip-icon { font-size: 13px; color: #f59e0b; }
.verified-badge { width: 19px; height: 19px; background: linear-gradient(135deg, #22d3ee, #67e8f9); color: white; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(103,232,249,0.4); }
.title-tag { font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 500; }

/* 垂直徽章 */
.badges-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.badge-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.75);
  border-radius: 9999px;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: #4338ca;
  box-shadow: 0 1px 4px rgba(123,164,201,0.08);
}
.badge-icon { font-size: 15px; }

/* 健康状态卡 */
.recovery-section { margin-bottom: 14px; text-align: center; }
.btn-recovery {
  width: 100%;
  border: none;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  color: white;
  padding: 15px 20px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}
.btn-recovery:active { transform: scale(0.97); }
.btn-icon { font-size: 20px; }
.recovery-tip { font-size: 12px; color: #94a3b8; margin-top: 8px; }

.glass-card { background: rgba(255,255,255,0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.85); border-radius: 18px; padding: 6px 14px; margin-bottom: 14px; }
.menu-item { display: flex; align-items: center; padding: 13px 0; }
.menu-icon { font-size: 20px; margin-right: 12px; }
.menu-text { flex: 1; font-size: 14.5px; font-weight: 500; }
.menu-badge { font-size: 11.5px; color: #ff8e8b; background: rgba(255,142,139,0.12); padding: 3px 9px; border-radius: 9999px; }

/* 状态面板 */
.clean-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  padding: 0;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(123, 164, 201, 0.06);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 8px;
}

.panel-title {
  font-size: 14.5px;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
}

.edit-hint {
  font-size: 11.5px;
  color: #a0aec0;
}

.status-list {
  display: flex;
  flex-direction: column;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-row:active {
  background-color: rgba(0, 0, 0, 0.03);
}

.row-label {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

.row-value {
  display: flex;
  align-items: center;
  gap: 8px;
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
  margin: 0 16px;
}

.tag-dynamic {
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9px;
  transition: all 0.3s ease;
}

/* 城市选择弹窗 */
.city-picker { padding: 4px 0 calc(env(safe-area-inset-bottom) + 16px); }
.city-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
}
.city-picker-title { font-size: 16px; font-weight: 800; color: #1e293b; }
.city-picker-close {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 50%;
  background: #f1f5f9; color: #94a3b8; font-size: 18px;
  cursor: pointer; transition: all 0.2s;
}
.city-picker-close:active { transform: scale(0.9); background: #e2e8f0; }

.city-search-wrap {
  position: relative;
  margin: 0 20px 14px;
}
.city-search-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: #cbd5e1; font-size: 16px; pointer-events: none;
}
.city-search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 36px 11px 38px;
  border: 1.5px solid #eef2f7;
  border-radius: 14px;
  background: #f8fafc;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: all 0.2s;
}
.city-search-input:focus { border-color: #3b82f6; background: #fff; }
.city-search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: #cbd5e1; font-size: 17px; cursor: pointer;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 20px;
  max-height: 46vh;
  overflow-y: auto;
}
.city-chip {
  padding: 11px 6px;
  border: 1.5px solid #eef2f7;
  border-radius: 13px;
  background: #f8fafc;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.city-chip:active { transform: scale(0.95); }
.city-chip-active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 6px 14px rgba(37,99,235,0.25);
}
.city-empty {
  grid-column: 1 / -1;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 24px 0;
}

.app-edit-popup {
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.avatar-picker-popup {
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
}

.avatar-picker {
  padding: 20px 18px 22px;
}

.avatar-picker-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-picker-title {
  margin: 0;
  color: #171717;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.6px;
}

.avatar-picker-subtitle {
  margin: 5px 0 0;
  color: #8a8178;
  font-size: 12px;
  font-weight: 700;
}

.avatar-picker-close {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 14px;
  color: #78716c;
  background: #f5f5f4;
  font-size: 18px;
}

.avatar-preview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(250, 250, 249, 0.96), rgba(255, 247, 237, 0.9));
  border: 1px solid rgba(231, 229, 228, 0.9);
}

.avatar-preview-img {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 10px 20px rgba(120, 113, 108, 0.12);
}

.avatar-preview-title {
  margin: 0;
  color: #292524;
  font-size: 15px;
  font-weight: 900;
}

.avatar-preview-text {
  margin: 4px 0 0;
  color: #a8a29e;
  font-size: 12px;
  font-weight: 700;
}

.default-avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.default-avatar-option {
  position: relative;
  aspect-ratio: 1;
  padding: 4px;
  border: 1.5px solid rgba(231, 229, 228, 0.9);
  border-radius: 22px;
  background: rgba(250, 250, 249, 0.82);
  transition: all 0.18s ease;
}

.default-avatar-option:active { transform: scale(0.95); }

.default-avatar-option img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 18px;
  object-fit: cover;
}

.default-avatar-option i {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 19px;
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border: 2px solid #fff;
  font-size: 12px;
  box-shadow: 0 6px 12px rgba(124, 58, 237, 0.2);
}

.default-avatar-option-active {
  border-color: rgba(124, 58, 237, 0.58);
  background: #fff;
  box-shadow: 0 12px 22px rgba(124, 58, 237, 0.12);
}

.avatar-upload-action {
  width: 100%;
  display: block;
}

.avatar-upload-action :deep(.van-uploader__wrapper),
.avatar-upload-action :deep(.van-uploader__input-wrapper) {
  width: 100%;
  display: block;
}

.avatar-upload-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  border-radius: 22px;
  background: #1c1917;
  color: #fff;
  box-shadow: 0 14px 28px rgba(28, 25, 23, 0.18);
}

.avatar-upload-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 20px;
}

.avatar-upload-title {
  margin: 0;
  font-size: 14px;
  font-weight: 900;
}

.avatar-upload-text {
  margin: 3px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 700;
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

/* 动画 */
@keyframes slow-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
