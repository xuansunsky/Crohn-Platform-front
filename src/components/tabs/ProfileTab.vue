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

    <!-- 肠道日记打卡入口 -->
    <button class="diary-entry" @click="emit('change-tab', 'diary')">
      <div class="diary-entry-glow"></div>
      <div class="diary-entry-left">
        <div class="diary-entry-icon">📔</div>
        <div class="diary-entry-text">
          <span class="diary-entry-title">肠道日记</span>
          <span class="diary-entry-sub">{{ diaryStatsLabel }}</span>
        </div>
      </div>
      <i class="ri-arrow-right-s-line diary-entry-arrow"></i>
    </button>


    <!-- 🔥 全新简洁版：我的当前身份状态（超工整、无乱字） -->
    <div class="clean-panel">
      <div class="panel-header">
        <h3 class="panel-title">我的身份状态</h3>
        <span class="edit-hint">点击更新 ✏️</span>
      </div>

      <div class="status-list">
        <div class="status-row status-row--phase" @click="openMatrixSheet('phase')">
          <span class="row-label">疾病身份</span>
          <div class="row-value phase-row-value">
            <div v-if="currentPhase.disease" class="phase-summary">
              <div class="phase-summary-line">
                <span class="phase-summary-main" :style="{ color: currentPhase.color, background: currentPhase.bgColor }">
                  <span class="phase-summary-icon">{{ currentPhase.icon }}</span>
                  <span class="phase-summary-disease">{{ currentPhase.disease }}</span>
                </span>
                <span v-if="currentPhase.durationLabel" class="phase-summary-duration">
                  {{ currentPhase.durationEmoji }} {{ currentPhase.durationLabel }}
                </span>
              </div>
              <div v-if="currentPhase.tags.length" class="phase-summary-line phase-summary-line--tags">
                <span v-for="tag in currentPhase.tags" :key="tag" class="phase-summary-tag">
                  <span v-if="getPhaseTagMeta(tag)?.emoji" class="phase-summary-tag-emoji">{{ getPhaseTagMeta(tag).emoji }}</span>
                  {{ tag }}
                </span>
              </div>
            </div>
            <span v-else class="phase-summary-empty">点击填写</span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="line-divider"></div>

        <div class="status-row" @click="openMatrixSheet('diet')">
          <span class="row-label">饮食流派</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentDiet.color, background: currentDiet.bgColor }">
            {{ currentDiet.icon }} {{ currentDiet.name }}
          </span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="line-divider"></div>

        <div class="status-row" @click="openMatrixSheet('gut')">
          <span class="row-label">生活状态</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentGut.color, background: currentGut.bgColor }">
            {{ currentGut.icon }} {{ currentGut.name }}
          </span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 🌳 生命之树（打卡越多，长得越壮） -->
    <button class="tree-card" type="button" @click="waterSprout">
      <div class="tree-sky"></div>
      <div class="tree-sun"></div>
      <span v-for="n in 6" :key="'leaf'+n" class="tree-leaf" :class="'tree-leaf-'+n">🍃</span>

      <div class="tree-head">
        <span class="tree-kicker">我的生命之树</span>
        <span class="tree-daychip">累计记录 {{ diaryTotalDays }} 天</span>
      </div>

      <div class="tree-orb" :class="{ 'tree-orb-water': sproutWatered }">
        <div class="tree-orb-ring"></div>
        <div class="tree-orb-glow"></div>
        <span class="tree-emoji">{{ plantStage.icon }}</span>
        <div class="tree-ground"></div>
        <span v-if="sproutWatered" class="tree-drop tree-drop-1">💧</span>
        <span v-if="sproutWatered" class="tree-drop tree-drop-2">💧</span>
      </div>

      <div class="tree-foot">
        <div class="tree-name-row">
          <span class="tree-name">{{ plantStage.name }}</span>
          <span class="tree-next">{{ plantNextLabel }}</span>
        </div>
        <div class="tree-bar">
          <div class="tree-bar-fill" :style="{ width: plantProgress + '%' }"></div>
        </div>
        <p class="tree-tip">{{ sproutWatered ? '咕嘟咕嘟，喝饱啦～ 它又精神了' : plantStage.tip }}</p>
      </div>
    </button>

    <!-- 🔮 今日肠道运势 · 自己抽 -->
    <div class="omikuji-card" :style="fortuneCardStyle">
      <span v-for="n in 14" :key="'star'+n" class="omikuji-star" :class="'omikuji-star-'+n"></span>

      <div class="omikuji-head">
        <span class="omikuji-kicker">今日肠道运势</span>
        <span class="omikuji-date">{{ fortuneDateLabel }}</span>
      </div>

      <!-- 未抽：神秘签筒 -->
      <div v-if="!fortuneResult" class="omikuji-idle">
        <div class="omikuji-orb" :class="{ 'omikuji-orb-shaking': drawing }">
          <div class="omikuji-orb-core">签</div>
          <div class="omikuji-orb-halo"></div>
        </div>
        <p class="omikuji-idle-text">{{ drawing ? '正在为你摇签…' : '静下心，轻触求一支今日签' }}</p>
        <button class="omikuji-draw-btn" :disabled="drawing" @click="drawFortune(false)">
          <i class="ri-sparkling-2-fill"></i> {{ drawing ? '摇签中' : '抽 今 日 签' }}
        </button>
      </div>

      <!-- 已抽：结果（装裱版） -->
      <div v-else class="omikuji-result">
        <span class="omikuji-tier-text" :style="tierTextStyle">{{ fortuneResult.label }}</span>

        <p class="omikuji-poem">「 {{ fortuneResult.poem }} 」</p>

        <!-- 签纸内框：信息全部左对齐成列 -->
        <div class="omikuji-sheet">
          <div class="omikuji-row">
            <span class="omikuji-tag omikuji-tag-yi">宜</span>
            <span class="omikuji-row-val">{{ fortuneResult.yi.join(' · ') }}</span>
          </div>
          <div class="omikuji-row">
            <span class="omikuji-tag omikuji-tag-ji">忌</span>
            <span class="omikuji-row-val">{{ fortuneResult.ji.join(' · ') }}</span>
          </div>

          <div class="omikuji-sheet-divider"></div>

          <div class="omikuji-row">
            <span class="omikuji-row-label">幸运色</span>
            <span class="omikuji-row-val omikuji-row-val-lucky">
              <span class="omikuji-lucky-dot" :style="{ background: fortuneResult.luckyColor.hex }"></span>
              {{ fortuneResult.luckyColor.name }}
            </span>
          </div>
          <div v-if="fortuneResult.guardian" class="omikuji-row">
            <span class="omikuji-row-label">守护词</span>
            <span class="omikuji-row-val" :style="{ color: tierTextStyle.color }">{{ fortuneResult.guardian.word }}</span>
          </div>
        </div>

        <div v-if="fortuneResult.closing" class="omikuji-closing">
          <span class="omikuji-closing-mark">✦</span>
          <p class="omikuji-closing-text">{{ fortuneResult.closing }}</p>
          <span class="omikuji-closing-mark">✦</span>
        </div>

        <button class="omikuji-redraw" @click="drawFortune(true)">
          <i class="ri-refresh-line"></i> 再抽一支
        </button>
      </div>
    </div>

    <!-- 精简菜单：只留真功能 -->
    <div class="glass-card menu-list animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div class="menu-item" @click="openMyDietList">
        <span class="menu-icon">📝</span>
        <span class="menu-text">我的饮食清单</span>
        <span class="menu-badge" style="background: rgba(59,130,246,0.1); color: rgb(59,130,246);">实测</span>
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

        <div v-for="category in ['基础身份', '饮食偏好', '经历标签']" :key="category">
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

        <div class="p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] overflow-y-auto max-h-[70vh]">
          <!-- 疾病身份 · 三步卡片向导 -->
          <div v-if="activeSheetType === 'phase'" class="phase-wizard">
            <div class="phase-steps">
              <span v-for="n in 3" :key="n" class="phase-step-dot" :class="{ 'phase-step-dot--active': phaseSheetStep >= n, 'phase-step-dot--current': phaseSheetStep === n }"></span>
            </div>

            <!-- Step 1 · 疾病类型 -->
            <section v-show="phaseSheetStep === 1" class="phase-step-panel">
              <div class="phase-step-head">
                <p class="phase-step-kicker">STEP 1</p>
                <h4 class="phase-step-title">选择疾病身份</h4>
                <p class="phase-step-desc">先确认你是哪一类 IBD 战友</p>
              </div>
              <div class="phase-disease-grid">
                <button
                  v-for="item in phaseDiseaseOptions"
                  :key="item.id"
                  type="button"
                  @click="selectPhaseDisease(item)"
                  class="phase-disease-card"
                  :class="{ 'phase-disease-card--active': phaseDraft.disease === item.name }"
                  :style="phaseDraft.disease === item.name ? { borderColor: colorClassToHex(item.color), background: colorClassToBg(item.bg) } : {}"
                >
                  <span class="phase-disease-emoji">{{ item.icon }}</span>
                  <span class="phase-disease-name">{{ item.name }}</span>
                  <span class="phase-disease-hint">{{ item.hint }}</span>
                  <i v-if="phaseDraft.disease === item.name" class="ri-checkbox-circle-fill phase-disease-check"></i>
                </button>
              </div>
            </section>

            <!-- Step 2 · 确诊时长（表情随年数变狠） -->
            <section v-show="phaseSheetStep === 2" class="phase-step-panel">
              <div class="phase-step-head phase-step-head--warm">
                <p class="phase-step-kicker">STEP 2</p>
                <h4 class="phase-step-title">你和它斗了多久？</h4>
                <p class="phase-step-desc">确诊越久，表情越狠 —— 都是真战士</p>
              </div>
              <div class="phase-duration-list">
                <button
                  v-for="item in phaseDurationOptions"
                  :key="item.id"
                  type="button"
                  @click="selectPhaseDuration(item)"
                  class="phase-duration-card"
                  :class="[`phase-duration-card--${item.vibe}`, phaseDraft.duration === item.name ? 'phase-duration-card--active' : '']"
                >
                  <span class="phase-duration-emoji">{{ item.emoji }}</span>
                  <div class="phase-duration-copy">
                    <span class="phase-duration-name">{{ item.name }}</span>
                    <span class="phase-duration-mood">{{ item.mood }}</span>
                    <span class="phase-duration-desc">{{ item.desc }}</span>
                  </div>
                  <i v-if="phaseDraft.duration === item.name" class="ri-check-line phase-duration-check"></i>
                </button>
              </div>
            </section>

            <!-- Step 3 · 战斗标记（多选卡片） -->
            <section v-show="phaseSheetStep === 3" class="phase-step-panel">
              <div class="phase-step-head phase-step-head--rose">
                <p class="phase-step-kicker">STEP 3</p>
                <h4 class="phase-step-title">你的战斗标记</h4>
                <p class="phase-step-desc">造口、手术、肛瘘… 有就点亮，可多选</p>
              </div>
              <div class="phase-tag-grid">
                <button
                  v-for="tag in phaseTagOptions"
                  :key="tag.id"
                  type="button"
                  @click="togglePhaseTag(tag.name)"
                  class="phase-tag-card"
                  :class="{ 'phase-tag-card--active': phaseDraft.tags.includes(tag.name) }"
                >
                  <span class="phase-tag-emoji">{{ tag.emoji }}</span>
                  <span class="phase-tag-name">{{ tag.name }}</span>
                  <span class="phase-tag-desc">{{ tag.desc }}</span>
                  <span v-if="phaseDraft.tags.includes(tag.name)" class="phase-tag-badge">已选</span>
                </button>
              </div>
            </section>

            <div class="phase-wizard-actions">
              <button v-if="phaseSheetStep > 1" type="button" class="phase-wizard-btn phase-wizard-btn--ghost" @click="phaseSheetStep -= 1">上一步</button>
              <button
                v-if="phaseSheetStep < 3"
                type="button"
                class="phase-wizard-btn phase-wizard-btn--primary"
                :disabled="(phaseSheetStep === 1 && !phaseDraft.disease) || (phaseSheetStep === 2 && !phaseDraft.duration)"
                @click="goPhaseNext"
              >
                下一步
              </button>
              <button v-else type="button" class="phase-wizard-btn phase-wizard-btn--primary" @click="savePhaseIdentity">
                保存身份状态
              </button>
            </div>
          </div>

          <div v-else class="grid grid-cols-2 gap-3">

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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import { closeToast, showToast } from 'vant'
import http from '@/api/http.js'
import { DEFAULT_AVATARS, avatarOf } from '@/utils/avatarPool'
import { clearAuthSession } from '@/utils/authToken'

const emit = defineEmits(['change-tab'])
const router = useRouter()

// 🌱 养成小苗：根据打卡总天数成长
const diaryStreak = ref(0)
const diaryTotalDays = ref(0)

const diaryStatsLabel = computed(() => {
  const streakPart = diaryStreak.value > 0 ? `连续 ${diaryStreak.value} 天 🔥` : '连续 0 天'
  const totalPart = diaryTotalDays.value > 0 ? `累计 ${diaryTotalDays.value} 天` : '累计 0 天'
  if (diaryTotalDays.value === 0) return '点击记录今天 · 开始你的第一天'
  return `${streakPart} · ${totalPart} · 点击记录`
})
const sproutWatered = ref(false)

const plantStages = [
  { min: 0, icon: '🌰', name: '一颗种子', tip: '埋下了，记一天它就发芽' },
  { min: 1, icon: '🌱', name: '冒芽啦', tip: '它探出了小脑袋' },
  { min: 3, icon: '🌿', name: '舒展枝叶', tip: '正努力往上长' },
  { min: 7, icon: '🪴', name: '小盆栽', tip: '已经有模有样了' },
  { min: 14, icon: '🌳', name: '小树苗', tip: '根扎得很稳' },
  { min: 30, icon: '🌲', name: '常青树', tip: '你们一起走了好远' },
  { min: 60, icon: '🌴', name: '生命之树', tip: '了不起的坚持' },
]

const plantStage = computed(() => {
  const d = diaryTotalDays.value
  let stage = plantStages[0]
  for (const s of plantStages) {
    if (d >= s.min) stage = s
  }
  return stage
})

const plantProgress = computed(() => {
  const d = diaryTotalDays.value
  const idx = plantStages.findIndex(s => s === plantStage.value)
  const next = plantStages[idx + 1]
  if (!next) return 100
  const cur = plantStage.value.min
  return Math.min(100, Math.round(((d - cur) / (next.min - cur)) * 100))
})

const plantNextLabel = computed(() => {
  const idx = plantStages.findIndex(s => s === plantStage.value)
  const next = plantStages[idx + 1]
  if (!next) return '已长成 · 满级 🌟'
  const remain = next.min - diaryTotalDays.value
  return `再 ${remain} 天 → ${next.name}`
})

const waterSprout = () => {
  sproutWatered.value = true
  setTimeout(() => { sproutWatered.value = false }, 1600)
}

// 🔮 今日肠道运势 · 抽签（去掉饮食指挥，只留作息/情绪，谁都适用）
const fortuneDateLabel = computed(() => {
  const d = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日 · ${week}`
})

const fortuneTiers = [
  { key: 'daji',    label: '大 吉', weight: 8,  color: '#f59e0b', glow: 'radial-gradient(circle, rgba(245,158,11,0.55), transparent 70%)' },
  { key: 'zhongji', label: '中 吉', weight: 18, color: '#ec4899', glow: 'radial-gradient(circle, rgba(236,72,153,0.5), transparent 70%)' },
  { key: 'ji',      label: '吉',    weight: 30, color: '#22d3ee', glow: 'radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)' },
  { key: 'xiaoji',  label: '小 吉', weight: 26, color: '#34d399', glow: 'radial-gradient(circle, rgba(52,211,153,0.5), transparent 70%)' },
  { key: 'moji',    label: '末 吉', weight: 13, color: '#a78bfa', glow: 'radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)' },
  { key: 'ping',    label: '平',    weight: 5,  color: '#94a3b8', glow: 'radial-gradient(circle, rgba(148,163,184,0.45), transparent 70%)' },
]

// 🎨 颜色工具：把一个 hex 自动推出「深背景渐变 / 柔和文字色 / 光晕」，以后加色只要给名字+hex
const hexToRgb = (hex) => {
  const h = String(hex).replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
const mixHex = (hex, target, amount) => {
  const [r, g, b] = hexToRgb(hex)
  const [tr, tg, tb] = hexToRgb(target)
  const m = (c, t) => Math.round(c + (t - c) * amount)
  const toHex = (v) => v.toString(16).padStart(2, '0')
  return `#${toHex(m(r, tr))}${toHex(m(g, tg))}${toHex(m(b, tb))}`
}
const makeTheme = (name, hex) => {
  const [r, g, b] = hexToRgb(hex)
  const top = mixHex(hex, '#000000', 0.82)
  const mid = mixHex(hex, '#000000', 0.5)
  const bot = mixHex(hex, '#000000', 0.18)
  return {
    name,
    hex,
    cardBg: `linear-gradient(165deg, ${top} 0%, ${mid} 46%, ${bot} 100%)`,
    glow: `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.5), transparent 70%)`,
  }
}

const poemPool = [
  '云开雾散，身心皆轻。',
  '静水流深，慢即是稳。',
  '小满即安，无需求圆。',
  '风物长宜放眼量。',
  '今日宜松，紧绷的弦也要歇。',
  '熬过的夜，终会换来晨光。',
  '不与身体较劲，便是温柔。',
  '允许自己慢一点，没关系。',
  '一寸进步，也值得庆祝。',
  '潮起潮落，皆是常态。',
  '把焦虑放下，身体会回应你。',
  '善待自己，是今天最重要的事。',
  // 🌿 温柔扩展池
  '风会经过你，也会带走一点疲惫。',
  '慢慢来，今天也算数。',
  '身体在说话，温柔听见就好。',
  '不必赢过今天，陪它走完就很好。',
  '灯火可亲，人间值得缓缓爱。',
  '把心放宽一点，路就没有那么挤。',
  '你已经走了很远，不必时时证明。',
  '小小安稳，也是大大的福气。',
  '云在天上慢慢走，你也可以。',
  '愿你今日少一点紧绷，多一点松弛。',
  '春风不催，花也会开。',
  '把自己照顾好，就是今日上上签。',
  '世界很吵，你可以轻一点活。',
  '不急不赶，也能抵达。',
  '今日无须逞强，平安便是好光景。',
  '一口气慢下来，心就有了落脚处。',
  '别怕慢，慢是身体在认真生活。',
  '你的节奏，也值得被尊重。',
  '微光虽小，也能照亮今天。',
  '放过自己，便是顺风。',
]
const yiPool = [
  '早点睡', '多喝温水', '慢慢吃饭', '晒晒太阳', '深呼吸', '出门散步', '写写日记',
  '午休片刻', '和朋友聊聊', '放空一会', '照顾好自己', '早点收工',
  // 轻作息 / 情绪 / 轻行动
  '早点洗漱', '关灯早一点', '少刷一会手机', '整理桌面', '晒十分钟太阳', '走一小段路',
  '听白噪音', '发会儿呆', '把肩膀放松', '做一次深呼吸', '写下三件小事', '给自己留白',
  '慢一点回复消息', '早点躺下', '伸展一下', '收拾一个角落', '安静坐五分钟', '减少内耗',
  '允许今天普通', '把节奏调慢',
]
const jiPool = [
  '硬扛不适', '熬夜刷手机', '凡事较劲', '久坐不动', '过度自责', '憋着情绪', '勉强应酬',
  '想得太多', '跟自己生气', '逞强硬撑',
  // 不制造焦虑，只提醒别跟自己过不去
  '连续熬夜', '情绪上头', '反复内耗', '强行社交', '一边累一边硬撑', '睡前乱想', '过度比较',
  '把小事想成大事', '逼自己立刻变好', '忽略疲惫', '边焦虑边拖延', '用力证明自己',
  '把今天过满', '什么都往心里放', '精神紧绷', '跟坏情绪死磕', '明明累了还嘴硬',
  '把自己逼太紧', '睡前复盘人生', '因为一点波动否定自己',
]
// 幸运色主题：以后加新色，只要往 luckyColorSeeds 里加一行 [名字, hex]，背景/文字色自动生成
const luckyColorSeeds = [
  ['雾霭蓝', '#60a5fa'], ['鼠尾草绿', '#34d399'], ['暖阳黄', '#fbbf24'], ['青瓷色', '#2dd4bf'],
  ['松石绿', '#14b8a6'], ['薄荷青', '#5eead4'], ['湖水蓝', '#38bdf8'], ['竹影绿', '#86efac'],
  ['星砂金', '#facc15'], ['雪松蓝', '#93c5fd'], ['山茶红', '#fb7185'], ['琉璃蓝', '#7c9fd4'],
]
const luckyColorThemes = luckyColorSeeds.map(([name, hex]) => makeTheme(name, hex))
const luckyColors = luckyColorThemes.map(({ name, hex, cardBg, glow }) => ({ name, hex, cardBg, glow }))
const luckyDeeds = [
  '给自己泡杯热饮', '深呼吸三次', '伸个大大的懒腰', '夸自己一句', '听一首喜欢的歌',
  '早睡十分钟', '出门走两百步', '关掉一个让你累的群',
  // 小到能做到，做完有一点点爽
  '把手机放远五分钟', '认真夸自己一次', '换一张喜欢的壁纸', '清掉一个未读消息', '给窗户开一道缝',
  '把被子铺平', '把明天要做的事少写一件', '对镜子笑一下', '给自己发一句鼓励', '删掉一个让你心烦的草稿',
  '把水杯洗干净', '站起来活动一下肩颈', '听一段轻音乐', '把今天的烦恼写下来再合上', '做一件不用赢的小事',
  '把灯光调柔一点', '给自己十分钟不解释', '把"必须"改成"可以"', '允许自己安静一会', '今天早点结束战斗',
]

// 🕯 今日守护词：抽签结果下方的小卡片
const guardianWords = [
  { word: '松弛', desc: '把身体和心都放低一点，今天不需要处处用力。' },
  { word: '安稳', desc: '不追赶，不比较，能安安稳稳过完今天就很好。' },
  { word: '轻盈', desc: '少背一点情绪包袱，把注意力还给当下。' },
  { word: '自洽', desc: '你不必解释所有状态，和自己站在一起就够了。' },
  { word: '慢行', desc: '慢不是退后，是给自己留出恢复和感受的空间。' },
  { word: '柔软', desc: '对世界柔软一点，也对自己柔软一点。' },
  { word: '清明', desc: '把复杂的念头放一放，先照顾好眼前这一刻。' },
  { word: '微光', desc: '今天不必大放光芒，有一点点亮就已经很好。' },
  { word: '允许', desc: '允许自己有起伏，有情绪，也有什么都不想做的时刻。' },
  { word: '归处', desc: '累了就停一停，你本身就是自己最稳的归处。' },
  { word: '留白', desc: '日子不必填满，空出来的地方会自己长出力气。' },
  { word: '温热', desc: '给自己一点温度，今天被自己好好接住。' },
]

// 🪶 今日轻任务：低压力、可完成、谁都适用
const gentleTasks = [
  '今天给自己留十分钟空白时间。',
  '今天少解释一次，先照顾自己的感受。',
  '今天把一件小事做完就收工。',
  '今天不和坏情绪硬碰硬。',
  '今天把手机提前放下一会儿。',
  '今天认真感受一次阳光、风或安静。',
  '今天不急着证明自己很厉害。',
  '今天允许自己普通，但不否定自己。',
  '今天把肩膀放松三次。',
  '今天结束前，对自己说一句：辛苦了。',
  '今天把"应该"少说一次。',
  '今天为自己做一件不必有用的小事。',
]

// 🌙 签文尾句：收束情绪的一句话
const closingBlessings = [
  '愿你今日身心轻一点，心事少一点。',
  '愿你今天不被情绪牵着走，也不被疲惫打败。',
  '愿你在普通的一天里，也能找到一点小小的喜欢。',
  '愿今天的你，被温柔以待，也被自己善待。',
  '愿你慢慢恢复能量，慢慢靠近舒服的状态。',
  '愿你不必逞强，也能被生活稳稳接住。',
  '愿今天的风，替你吹散一点烦闷。',
  '愿你把自己放在重要的位置上。',
  '愿你拥有一个不那么紧绷的今天。',
  '愿你平安、松弛、自在一点点。',
]

const findLuckyTheme = (lucky) => {
  if (!lucky) return null
  return luckyColorThemes.find(t => t.name === lucky.name || t.hex === lucky.hex) || luckyColorThemes[0]
}

const fortuneCardIdleBg = 'linear-gradient(165deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)'

const fortuneCardStyle = computed(() => {
  if (!fortuneResult.value?.luckyColor) {
    return {
      background: fortuneCardIdleBg,
      boxShadow: '0 24px 48px -22px rgba(49, 46, 129, 0.85)',
    }
  }
  const theme = findLuckyTheme(fortuneResult.value.luckyColor)
  const hex = theme?.hex || '#60a5fa'
  return {
    background: theme?.cardBg || fortuneCardIdleBg,
    boxShadow: `0 24px 48px -18px ${hex}88`,
  }
})

// 等级大字：颜色跟随幸运色，调成柔和亮色 + 同色光晕，不再用刺眼的纯色
const tierTextStyle = computed(() => {
  const hex = fortuneResult.value?.luckyColor?.hex || '#a78bfa'
  const soft = mixHex(hex, '#ffffff', 0.62)
  return {
    color: soft,
    textShadow: `0 3px 22px ${hex}cc, 0 0 1px ${hex}80`,
  }
})

const tierGlowBg = computed(() => {
  const theme = findLuckyTheme(fortuneResult.value?.luckyColor)
  return theme?.glow || fortuneResult.value?.glow || 'radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)'
})

const drawing = ref(false)
const fortuneResult = ref(null)

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pickTwo = (arr) => {
  const c = [...arr]
  const a = c.splice(Math.floor(Math.random() * c.length), 1)[0]
  const b = c.splice(Math.floor(Math.random() * c.length), 1)[0]
  return [a, b]
}

const rollTier = () => {
  const total = fortuneTiers.reduce((s, t) => s + t.weight, 0)
  let r = Math.random() * total
  for (const t of fortuneTiers) {
    if (r < t.weight) return t
    r -= t.weight
  }
  return fortuneTiers[fortuneTiers.length - 1]
}


const normalizeFortuneResult = (raw) => {
  if (!raw || typeof raw !== 'object') return null
  const luckyColor = raw.luckyColor || {}
  const theme = findLuckyTheme(luckyColor)
  return {
    key: raw.key || 'ji',
    label: raw.label || '吉',
    color: raw.color || '#22d3ee',
    glow: raw.glow || theme?.glow || 'radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)',
    poem: raw.poem || '',
    yi: Array.isArray(raw.yi) ? raw.yi : [],
    ji: Array.isArray(raw.ji) ? raw.ji : [],
    luckyColor: {
      name: theme?.name || luckyColor.name || '雾霭蓝',
      hex: theme?.hex || luckyColor.hex || '#60a5fa',
      cardBg: theme?.cardBg || luckyColor.cardBg || fortuneCardIdleBg,
    },
    luckyDeed: raw.luckyDeed || '',
    guardian: (raw.guardian && typeof raw.guardian === 'object')
      ? { word: raw.guardian.word || '松弛', desc: raw.guardian.desc || '' }
      : null,
    gentleTask: raw.gentleTask || '',
    closing: raw.closing || '',
  }
}

const buildFortune = () => {
  const tier = rollTier()
  const luckyColor = rand(luckyColors)
  const theme = findLuckyTheme(luckyColor)
  return {
    key: tier.key,
    label: tier.label,
    color: tier.color,
    glow: tier.glow,
    poem: rand(poemPool),
    yi: pickTwo(yiPool),
    ji: pickTwo(jiPool),
    luckyColor: {
      name: theme.name,
      hex: theme.hex,
      cardBg: theme.cardBg,
    },
    luckyDeed: rand(luckyDeeds),
    guardian: rand(guardianWords),
    gentleTask: rand(gentleTasks),
    closing: rand(closingBlessings),
  }
}

const drawFortune = async (redraw = false) => {
  if (drawing.value) return
  drawing.value = true
  const result = buildFortune()
  try {
    await new Promise(resolve => setTimeout(resolve, redraw ? 900 : 1100))
    const res = await http.post('/fortune/draw', { fortune: result, redraw })
    if (res.status === 200 && res.data?.fortune) {
      fortuneResult.value = normalizeFortuneResult(res.data.fortune)
    } else if (res.status === 200 && res.data?.fromCache && fortuneResult.value) {
      // 今日已抽过且非重抽：保持后端返回的签文
      fortuneResult.value = normalizeFortuneResult(res.data.fortune) || fortuneResult.value
    } else {
      fortuneResult.value = result
    }
  } catch (error) {
    console.error('抽签保存失败', error)
    fortuneResult.value = result
    showToast({ type: 'fail', message: '签文没同步到云端，仅本机可见' })
  } finally {
    drawing.value = false
  }
}

const loadFortune = async () => {
  try {
    const res = await http.get('/fortune/today')
    if (res.status === 200 && res.data?.drawn && res.data.fortune) {
      fortuneResult.value = normalizeFortuneResult(res.data.fortune)
    } else {
      fortuneResult.value = null
    }
  } catch (error) {
    console.error('获取今日签文失败', error)
    fortuneResult.value = null
  }
}

const loadDiaryStats = async () => {
  try {
    const res = await http.get('/diary/records', { params: { days: 0 } })
    if (res.status === 200 && res.data) {
      diaryStreak.value = Number(res.data.streak || 0)
      diaryTotalDays.value = Number(
        res.data.totalDays != null
          ? res.data.totalDays
          : (Array.isArray(res.data.records) ? res.data.records.length : 0)
      )
    }
  } catch (error) {
    console.error('获取打卡统计失败:', error)
  }
}

// 应急操作
const uploadMedicalRecord = () => {
  localStorage.setItem('openVerifyUpload', '1')
  emit('change-tab', 'circle')
}

const openMyDietList = () => {
  localStorage.setItem('openMyDietReports', '1')
  emit('change-tab', 'checkin')
}

const handleLogout = async () => {
  if (!confirm('确定要退出当前账号吗？')) return
  clearAuthSession()
  localStorage.removeItem('lastActiveTab')
  showToast({ message: '已退出登录', icon: 'success' })
  await router.replace('/login2')
}

// 当前状态展示
const currentPhase = ref({
  id: 'p0',
  disease: '',
  durationLabel: '',
  durationEmoji: '',
  tags: [],
  icon: '🧬',
  color: '#64748b',
  bgColor: 'rgba(100, 116, 139, 0.12)',
})
const currentDiet = ref({ id: 'd0', name: '待选择', icon: '🍽️', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.12)' })
const currentGut = ref({ id: 'g0', name: '待记录', icon: '🌫️', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.12)' })

const showBadgeSelector = ref(false)
const MAX_BADGES = 3

// 个人标签数据
const badgeLibrary = ref([
  { id: 1, category: '基础身份', icon: '🛡️', name: '已认证', desc: '资料更可信', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', selected: true },
  { id: 2, category: '基础身份', icon: '🌱', name: '新成员', desc: '刚来到乐园', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', selected: true },

  { id: 3, category: '饮食偏好', icon: '🌿', name: '清淡饮食', desc: '偏向温和选择', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', selected: true },
  { id: 4, category: '饮食偏好', icon: '🍚', name: '少量多餐', desc: '慢慢试探', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', selected: false },
  { id: 5, category: '饮食偏好', icon: '🥥', name: '低FODMAP', desc: '减少刺激', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', selected: false },

  { id: 6, category: '经历标签', icon: '🌤️', name: '稳定期', desc: '最近比较平稳', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', selected: false },
  { id: 7, category: '经历标签', icon: '🧘‍♂️', name: '情绪练习中', desc: '慢慢调节', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', selected: false },
  { id: 8, category: '经历标签', icon: '💉', name: '长期用药', desc: '按时治疗', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', selected: false },
])

const selectedCount = computed(() => badgeLibrary.value.filter(b => b.selected).length)

const toggleBadge = (badge) => {
  if (badge.selected) {
    badge.selected = false
  } else {
    if (selectedCount.value >= MAX_BADGES) {
      showToast({ message: '最多选择 3 个标签' })
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
  nickname: localStorage.getItem('nickname') || '未命名用户',
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
    const uploadRes = await http.post('/upload', formData, { timeout: 12000 })
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
  phase: '选择疾病身份',
  diet:  '切换饮食流派',
  gut:   '记录生活状态'
}

// 状态选项库
const phaseDiseaseOptions = [
  { id: 'pd1', icon: '🧬', name: '克罗恩病', hint: 'CD · 全消化道都可能参战', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'pd2', icon: '🩸', name: '溃疡性结肠炎', hint: 'UC · 结肠为主战场', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'pd3', icon: '🔬', name: '未分型 IBD', hint: '还在确诊/分型路上', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
]
const phaseDurationOptions = [
  { id: 'du1', name: '确诊1年内', emoji: '🌱', mood: '新兵报到', desc: '刚认识这个对手，还在摸索', vibe: 'gentle' },
  { id: 'du2', name: '确诊1-3年', emoji: '😐', mood: '稳住阵脚', desc: '和它过了几个回合，开始懂它脾气', vibe: 'calm' },
  { id: 'du3', name: '确诊3-5年', emoji: '😤', mood: '硬茬选手', desc: '踩过坑，知道什么能惹它生气', vibe: 'tough' },
  { id: 'du4', name: '确诊5-10年', emoji: '🔥', mood: '老江湖', desc: '风浪见过不少，照样往前推', vibe: 'fierce' },
  { id: 'du5', name: '确诊10年以上', emoji: '👹', mood: '终极战士', desc: '什么妖魔鬼怪都见过，狠字写脸上', vibe: 'legend' },
]
const phaseTagOptions = [
  { id: 'stoma', name: '有造口', emoji: '🎒', desc: '带着造口也在认真生活' },
  { id: 'surgery', name: '做过手术', emoji: '🏥', desc: '腹上有故事，也是勋章' },
  { id: 'fistula', name: '有肛瘘', emoji: '⚡', desc: '复杂型也要被好好看见' },
]
const phaseDraft = reactive({ disease: '', duration: '', tags: [] })
const phaseSheetStep = ref(1)

const statusLibrary = ref({
  diet: [
    { id: 'd1', icon: '🌿', name: '低 FODMAP', desc: '减少发酵刺激', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { id: 'd2', icon: '💧', name: '流食为主', desc: '让肠道休息一下', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'd3', icon: '🌾', name: '无麸质饮食', desc: '避开部分刺激源', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'd4', icon: '🍚', name: '低渣软食', desc: '狭窄/恢复期更温柔', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'd5', icon: '🍱', name: '常规少量尝试', desc: '少量、慢慢试', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' }
  ],
  gut: [
    { id: 'g1', icon: '🟢', name: '正常生活中', desc: '上学/上班/社交基本在线', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'g2', icon: '🟡', name: '低电量恢复', desc: '能动，但需要慢一点', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'g3', icon: '🔴', name: '正在硬扛', desc: '腹痛、腹泻或疲惫明显', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'g4', icon: '🏥', name: '住院/复查中', desc: '最近医疗安排比较多', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
  ]
})

const colorClassToHex = (colorClass = '') => {
  const map = {
    'text-indigo-500': '#6366f1',
    'text-rose-500': '#f43f5e',
    'text-amber-500': '#f59e0b',
    'text-emerald-500': '#10b981',
    'text-teal-600': '#0d9488',
    'text-blue-500': '#3b82f6',
    'text-amber-600': '#d97706',
    'text-orange-600': '#ea580c',
    'text-slate-600': '#475569',
    'text-red-500': '#ef4444'
  }
  return map[colorClass] || '#64748b'
}

const colorClassToBg = (bgClass = '') => {
  const map = {
    'bg-indigo-50': 'rgba(99, 102, 241, 0.12)',
    'bg-rose-50': 'rgba(244, 63, 94, 0.12)',
    'bg-amber-50': 'rgba(245, 158, 11, 0.12)',
    'bg-emerald-50': 'rgba(16, 185, 129, 0.12)',
    'bg-teal-50': 'rgba(13, 148, 136, 0.12)',
    'bg-blue-50': 'rgba(59, 130, 246, 0.12)',
    'bg-orange-50': 'rgba(234, 88, 12, 0.12)',
    'bg-slate-50': 'rgba(100, 116, 139, 0.12)',
    'bg-red-50': 'rgba(239, 68, 68, 0.12)'
  }
  return map[bgClass] || 'rgba(100, 116, 139, 0.12)'
}

const parseHealthPhase = (raw) => {
  if (!raw) return { disease: '', duration: '', tags: [] }
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.disease) {
      return {
        disease: parsed.disease || '',
        duration: parsed.duration || '',
        tags: Array.isArray(parsed.tags) ? [...parsed.tags] : [],
      }
    }
  } catch (_) { /* legacy plain text */ }
  const legacy = phaseDiseaseOptions.find(item => item.name === raw || raw.includes(item.name))
  if (legacy) return { disease: legacy.name, duration: '', tags: [] }
  if (raw.includes('克罗恩')) return { disease: '克罗恩病', duration: '', tags: [] }
  if (raw.includes('溃疡')) return { disease: '溃疡性结肠炎', duration: '', tags: [] }
  return { disease: raw, duration: '', tags: [] }
}

const serializeHealthPhase = (draft) => JSON.stringify({
  disease: draft.disease,
  duration: draft.duration || '',
  tags: [...(draft.tags || [])],
})

const getPhaseVisual = (diseaseName) => {
  const found = phaseDiseaseOptions.find(item => item.name === diseaseName)
  if (!found) {
    return { icon: '🧬', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.12)' }
  }
  return {
    icon: found.icon,
    color: colorClassToHex(found.color),
    bgColor: colorClassToBg(found.bg),
  }
}

const getDurationMeta = (durationName) => {
  return phaseDurationOptions.find(item => item.name === durationName) || null
}

const getPhaseTagMeta = (tagName) => {
  return phaseTagOptions.find(item => item.name === tagName) || null
}

const applyPhaseDisplay = (draft) => {
  if (!draft.disease) {
    currentPhase.value = {
      id: 'p0',
      disease: '',
      durationLabel: '',
      durationEmoji: '',
      tags: [],
      icon: '🧬',
      color: '#64748b',
      bgColor: 'rgba(100, 116, 139, 0.12)',
    }
    return
  }
  const visual = getPhaseVisual(draft.disease)
  const durationMeta = getDurationMeta(draft.duration)
  currentPhase.value = {
    id: 'phase-custom',
    disease: draft.disease,
    durationLabel: draft.duration || '',
    durationEmoji: durationMeta?.emoji || '',
    tags: [...(draft.tags || [])],
    icon: visual.icon,
    color: visual.color,
    bgColor: visual.bgColor,
  }
}

const selectPhaseDuration = (item) => {
  phaseDraft.duration = item.name
  phaseSheetStep.value = 3
}

const togglePhaseTag = (tag) => {
  const idx = phaseDraft.tags.indexOf(tag)
  if (idx >= 0) phaseDraft.tags.splice(idx, 1)
  else phaseDraft.tags.push(tag)
}

const currentSelectedIds = ref({
  phase: 'p0',
  diet: 'd0',
  gut: 'g0'
})

// 点击列表行时，打开对应类型的控制台
const openMatrixSheet = (type) => {
  activeSheetType.value = type
  if (type === 'phase') {
    const parsed = parseHealthPhase(storedHealthPhase.value)
    phaseDraft.disease = parsed.disease
    phaseDraft.duration = parsed.duration
    phaseDraft.tags = [...parsed.tags]
    phaseSheetStep.value = parsed.disease ? (parsed.duration ? 3 : 2) : 1
  }
}

const selectPhaseDisease = (item) => {
  phaseDraft.disease = item.name
  phaseSheetStep.value = 2
}

const goPhaseNext = () => {
  if (phaseSheetStep.value === 1 && !phaseDraft.disease) {
    showToast({ type: 'fail', message: '请先选择疾病类型' })
    return
  }
  if (phaseSheetStep.value === 2 && !phaseDraft.duration) {
    showToast({ type: 'fail', message: '请选择确诊时长' })
    return
  }
  if (phaseSheetStep.value < 3) phaseSheetStep.value += 1
}

const storedHealthPhase = ref('')

const savePhaseIdentity = async () => {
  if (!phaseDraft.disease) {
    showToast({ type: 'fail', message: '请先选择疾病类型' })
    return
  }
  const payload = { healthPhase: serializeHealthPhase(phaseDraft) }
  const prev = {
    phase: { ...currentPhase.value, tags: [...(currentPhase.value.tags || [])] },
    raw: storedHealthPhase.value,
  }
  applyPhaseDisplay(phaseDraft)
  storedHealthPhase.value = payload.healthPhase
  try {
    const res = await http.post('/center/update-status', payload)
    if (res.status !== 200) throw new Error(res.message || '保存失败')
    activeSheetType.value = ''
    showToast({ type: 'success', message: '身份状态已更新' })
  } catch (error) {
    currentPhase.value = prev.phase
    storedHealthPhase.value = prev.raw
    showToast({ type: 'fail', message: '状态同步失败，请稍后再试' })
  }
}

// 在控制台中点击选中某个卡片（饮食 / 生活状态）
const selectStatus = async (item) => {
  const type = activeSheetType.value
  if (type === 'phase') return

  const prevId = currentSelectedIds.value[type]
  const prevDiet = { ...currentDiet.value }
  const prevGut = { ...currentGut.value }

  currentSelectedIds.value[type] = item.id
  if (type === 'diet') {
    currentDiet.value = { ...item, bgColor: colorClassToBg(item.bg), color: colorClassToHex(item.color) }
  }
  if (type === 'gut') {
    currentGut.value = { ...item, bgColor: colorClassToBg(item.bg), color: colorClassToHex(item.color) }
  }

  const payload = {}
  if (type === 'diet') payload.dietStrategy = item.name
  if (type === 'gut') payload.bowelStatus = item.name

  setTimeout(() => {
    activeSheetType.value = ''
  }, 300)

  try {
    const res = await http.post('/center/update-status', payload)
    if (res.status !== 200) throw new Error(res.message || '保存失败')
  } catch (error) {
    currentSelectedIds.value[type] = prevId
    if (type === 'diet') currentDiet.value = prevDiet
    if (type === 'gut') currentGut.value = prevGut
    showToast({ type: 'fail', message: '状态同步失败，请稍后再试' })
  }
}
// 1. 定义拉取函数
const loadData = async () => {
  try {
    const res = await http.get('/center/info');

    const profile = res.data?.data || res.data;

    if (profile) {
      // 1. 同步基础信息
      userInfo.value.nickname = profile.nickname || localStorage.getItem('nickname') || '未命名用户';
      userInfo.value.avatar = avatarOf(profile.avatar, profile.userId || profile.nickname || 'me');
      userInfo.value.userId = profile.userId;
      userInfo.value.city = profile.city || '';

      // 2. 匹配并点亮【疾病身份】
      if (profile.healthPhase) {
        storedHealthPhase.value = profile.healthPhase
        const parsed = parseHealthPhase(profile.healthPhase)
        if (parsed.disease) {
          applyPhaseDisplay(parsed)
        }
      }

      // 3. 匹配并点亮【饮食协议】
      if (profile.dietStrategy) {
        const foundDiet = statusLibrary.value.diet.find(item => item.name === profile.dietStrategy);
        if (foundDiet) {
          currentDiet.value = { ...foundDiet, bgColor: colorClassToBg(foundDiet.bg), color: colorClassToHex(foundDiet.color) };
          currentSelectedIds.value.diet = foundDiet.id;
        }
      }

      // 4. 匹配并点亮【肠道反馈】
      if (profile.bowelStatus) {
        const foundGut = statusLibrary.value.gut.find(item => item.name === profile.bowelStatus);
        if (foundGut) {
          currentGut.value = { ...foundGut, bgColor: colorClassToBg(foundGut.bg), color: colorClassToHex(foundGut.color) };
          currentSelectedIds.value.gut = foundGut.id;
        }
      }

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
  loadDiaryStats();
  loadFortune();
});
const onConfirmName = async () => {
  if (!tempNickname.value.trim() || tempNickname.value === userInfo.value.nickname) {
    showEditName.value = false;
    return;
  }

  const prevNickname = userInfo.value.nickname
  try {
    const res = await http.post('/center/update-basic', {
      nickname: tempNickname.value
    })
    if (res.status !== 200) {
      showToast({ type: 'fail', message: res.message || '昵称保存失败' })
      return
    }
    userInfo.value.nickname = tempNickname.value
    localStorage.setItem('nickname', tempNickname.value)
    showEditName.value = false
    showToast({ message: '标识已重构', icon: 'success' })
  } catch (error) {
    userInfo.value.nickname = prevNickname
    showToast({ type: 'fail', message: '昵称保存失败，请稍后再试' })
  }
};

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
/* 肠道日记打卡入口 */
.diary-entry {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  margin-bottom: 14px;
  border: none;
  border-radius: 22px;
  background: linear-gradient(135deg, #2dd4bf 0%, #10b981 55%, #059669 100%);
  box-shadow: 0 16px 36px -18px rgba(16,185,129,0.7);
  cursor: pointer;
  transition: transform .15s;
}
.diary-entry:active { transform: scale(0.98); }
.diary-entry-glow {
  position: absolute;
  top: -40px; right: -30px;
  width: 130px; height: 130px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  filter: blur(28px);
}
.diary-entry-left { position: relative; display: flex; align-items: center; gap: 12px; }
.diary-entry-icon {
  width: 46px; height: 46px;
  border-radius: 16px;
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
}
.diary-entry-text { display: flex; flex-direction: column; align-items: flex-start; }
.diary-entry-title { color: #fff; font-size: 16px; font-weight: 900; line-height: 1.2; }
.diary-entry-sub { color: rgba(255,255,255,0.88); font-size: 11.5px; font-weight: 700; margin-top: 3px; }
.diary-entry-arrow { position: relative; color: rgba(255,255,255,0.9); font-size: 22px; }
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
.vip-name { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(90deg, #1e2937, #475569); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
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

.status-row--phase {
  align-items: center;
  padding-top: 13px;
  padding-bottom: 13px;
}
.phase-row-value {
  flex: 1;
  min-width: 0;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}
.phase-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  max-width: calc(100% - 20px);
}
.phase-summary-line {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}
.phase-summary-line--tags {
  flex-wrap: wrap;
  row-gap: 5px;
}
.phase-summary-main {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
}
.phase-summary-icon { font-size: 14px; line-height: 1; }
.phase-summary-disease { white-space: nowrap; }
.phase-summary-duration {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  white-space: nowrap;
}
.phase-summary-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: #be123c;
  background: rgba(244, 63, 94, 0.08);
  white-space: nowrap;
}
.phase-summary-tag-emoji {
  font-size: 14px;
  line-height: 1;
}
.phase-summary-empty {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.tag-dynamic {
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9px;
  transition: all 0.3s ease;
}

.menu-item-static {
  cursor: default;
}

/* 🌳 生命之树大卡 */
.tree-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: block;
  padding: 18px 18px 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 28px;
  background: linear-gradient(170deg, #d7f5e3 0%, #c2efd9 38%, #eaf9d6 100%);
  box-shadow: 0 22px 44px -22px rgba(16, 185, 129, 0.6);
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease;
}
.tree-card:active { transform: scale(0.99); }
.tree-sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 80% at 80% -10%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(90% 60% at 10% 110%, rgba(132, 204, 22, 0.22), transparent 60%);
  pointer-events: none;
}
.tree-sun {
  position: absolute;
  top: -34px; right: -26px;
  width: 130px; height: 130px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(253, 224, 71, 0.6), rgba(253, 224, 71, 0) 68%);
  filter: blur(4px);
  pointer-events: none;
}
.tree-leaf {
  position: absolute;
  font-size: 15px;
  opacity: 0.65;
  animation: leaf-fall 7s linear infinite;
  pointer-events: none;
}
.tree-leaf-1 { left: 14%; top: -10%; animation-delay: 0s; }
.tree-leaf-2 { left: 32%; top: -10%; animation-delay: 1.6s; font-size: 12px; }
.tree-leaf-3 { left: 52%; top: -10%; animation-delay: 3.1s; }
.tree-leaf-4 { left: 68%; top: -10%; animation-delay: 0.8s; font-size: 13px; }
.tree-leaf-5 { left: 82%; top: -10%; animation-delay: 4.2s; }
.tree-leaf-6 { left: 44%; top: -10%; animation-delay: 5.3s; font-size: 11px; }
@keyframes leaf-fall {
  0% { transform: translateY(0) rotate(0); opacity: 0; }
  12% { opacity: 0.7; }
  100% { transform: translateY(230px) rotate(220deg); opacity: 0; }
}
.tree-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tree-kicker { font-size: 15px; font-weight: 900; color: #14532d; letter-spacing: -0.3px; }
.tree-daychip {
  font-size: 11.5px;
  font-weight: 900;
  color: #15803d;
  background: rgba(255, 255, 255, 0.7);
  padding: 5px 11px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.9);
}
.tree-orb {
  position: relative;
  z-index: 2;
  width: 150px; height: 150px;
  margin: 12px auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tree-orb-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.25));
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 6px 18px rgba(255, 255, 255, 0.8), inset 0 -10px 24px rgba(16, 185, 129, 0.18), 0 14px 30px -12px rgba(16, 185, 129, 0.45);
  backdrop-filter: blur(6px);
}
.tree-orb-glow {
  position: absolute;
  width: 90px; height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(187, 247, 208, 0.9), transparent 70%);
  animation: orb-breathe 4s ease-in-out infinite;
}
@keyframes orb-breathe {
  0%, 100% { transform: scale(0.92); opacity: 0.7; }
  50% { transform: scale(1.08); opacity: 1; }
}
.tree-emoji {
  position: relative;
  z-index: 2;
  font-size: 68px;
  line-height: 1;
  filter: drop-shadow(0 8px 10px rgba(20, 83, 45, 0.25));
  animation: tree-sway 5s ease-in-out infinite;
}
@keyframes tree-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
.tree-orb-water .tree-emoji { animation: tree-pop 0.7s ease; }
@keyframes tree-pop {
  0%, 100% { transform: scale(1) rotate(0); }
  35% { transform: scale(1.16) rotate(-5deg); }
  70% { transform: scale(1.05) rotate(4deg); }
}
.tree-ground {
  position: absolute;
  bottom: 20px;
  width: 84px; height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 83, 45, 0.18), transparent 70%);
  z-index: 1;
}
.tree-drop {
  position: absolute;
  top: 6px;
  font-size: 15px;
  animation: drop-fall 1s ease-in forwards;
}
.tree-drop-1 { left: 42%; }
.tree-drop-2 { left: 56%; animation-delay: 0.2s; }
@keyframes drop-fall {
  0% { transform: translateY(0); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(60px); opacity: 0; }
}
.tree-foot { position: relative; z-index: 2; }
.tree-name-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 9px;
}
.tree-name { font-size: 18px; font-weight: 900; color: #14532d; letter-spacing: -0.4px; }
.tree-next { font-size: 11.5px; font-weight: 800; color: #16a34a; }
.tree-bar {
  height: 9px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.65);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(20, 83, 45, 0.1);
}
.tree-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #4ade80, #16a34a);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.55);
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.tree-tip { margin: 10px 0 0; font-size: 12px; font-weight: 700; color: #3f6212; text-align: center; }

/* 🔮 抽签大卡 */
.omikuji-card {
  position: relative;
  overflow: hidden;
  padding: 18px 18px 20px;
  margin-bottom: 16px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(165deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%);
  box-shadow: 0 24px 48px -22px rgba(49, 46, 129, 0.85);
  transition: background 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.65s ease;
}
.omikuji-star {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation: twinkle 3s ease-in-out infinite;
  pointer-events: none;
}
.omikuji-star-1 { top: 12%; left: 14%; } .omikuji-star-2 { top: 22%; left: 78%; animation-delay: .4s; }
.omikuji-star-3 { top: 8%; left: 52%; animation-delay: .9s; } .omikuji-star-4 { top: 38%; left: 22%; animation-delay: 1.3s; }
.omikuji-star-5 { top: 30%; left: 90%; animation-delay: .2s; } .omikuji-star-6 { top: 54%; left: 8%; animation-delay: 1.7s; }
.omikuji-star-7 { top: 64%; left: 84%; animation-delay: .7s; } .omikuji-star-8 { top: 48%; left: 60%; animation-delay: 2.1s; }
.omikuji-star-9 { top: 72%; left: 38%; animation-delay: 1.1s; } .omikuji-star-10 { top: 18%; left: 34%; animation-delay: 2.5s; }
.omikuji-star-11 { top: 84%; left: 66%; animation-delay: .5s; } .omikuji-star-12 { top: 60%; left: 48%; animation-delay: 1.9s; }
.omikuji-star-13 { top: 40%; left: 44%; animation-delay: 2.8s; } .omikuji-star-14 { top: 78%; left: 18%; animation-delay: 1.5s; }
@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.3); } }
.omikuji-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.omikuji-kicker { font-size: 15px; font-weight: 900; color: #fff; letter-spacing: 0.5px; }
.omikuji-date {
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.5px;
  padding: 4px 11px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  white-space: nowrap;
}

/* 未抽状态 */
.omikuji-idle {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0 6px;
}
.omikuji-orb {
  position: relative;
  width: 92px; height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.omikuji-orb-core {
  position: relative;
  z-index: 2;
  width: 64px; height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 3px 10px rgba(255, 255, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}
.omikuji-orb-halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.5), transparent 68%);
  animation: orb-breathe 3.4s ease-in-out infinite;
}
.omikuji-orb-shaking { animation: orb-shake 0.4s ease-in-out infinite; }
@keyframes orb-shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-5px) rotate(-7deg); }
  75% { transform: translateX(5px) rotate(7deg); }
}
.omikuji-idle-text { font-size: 12.5px; font-weight: 700; color: rgba(255, 255, 255, 0.78); margin: 0 0 16px; }
.omikuji-draw-btn {
  border: none;
  padding: 13px 34px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #1e1b4b;
  background: linear-gradient(135deg, #fde68a, #fbbf24);
  box-shadow: 0 12px 26px -8px rgba(251, 191, 36, 0.65);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.15s ease;
}
.omikuji-draw-btn:active { transform: scale(0.95); }
.omikuji-draw-btn:disabled { opacity: 0.7; }

/* 已抽结果 */
.omikuji-result {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: result-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes result-in {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.omikuji-tier-text {
  position: relative;
  z-index: 2;
  margin: 6px 0 2px;
  font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 8px;
  text-indent: 8px;
}
.omikuji-poem {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin: 8px 0 18px;
  line-height: 1.6;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 签纸内框：装裱、规整、左对齐成列 */
.omikuji-sheet {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.omikuji-row {
  display: grid;
  grid-template-columns: 52px 1fr;
  align-items: center;
  gap: 12px;
}
.omikuji-tag {
  width: 24px; height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}
.omikuji-tag-yi { background: rgba(16, 185, 129, 0.55); }
.omikuji-tag-ji { background: rgba(244, 63, 94, 0.55); }
.omikuji-row-label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.82);
  letter-spacing: 0.5px;
}
.omikuji-row-val {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}
.omikuji-row-val-lucky {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.omikuji-lucky-dot {
  width: 13px; height: 13px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
.omikuji-sheet-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
  margin: 1px 0;
}
.omikuji-closing {
  width: 100%;
  margin: 16px 0 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.omikuji-closing-mark {
  font-size: 7px;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}
.omikuji-closing-text {
  margin: 0;
  font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.5;
  text-align: center;
  color: rgba(255, 248, 235, 0.88);
  letter-spacing: 1px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.omikuji-redraw {
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  padding: 9px 24px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease, background 0.15s ease;
}
.omikuji-redraw:active { transform: scale(0.95); background: rgba(255, 255, 255, 0.26); }

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

/* 疾病身份 · 三步卡片向导 */
.phase-wizard { display: flex; flex-direction: column; gap: 18px; }
.phase-steps { display: flex; align-items: center; justify-content: center; gap: 8px; }
.phase-step-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: #cbd5e1; transition: all 0.25s ease;
}
.phase-step-dot--active { background: #6366f1; width: 22px; }
.phase-step-dot--current { background: #4338ca; }
.phase-step-panel { animation: phase-step-in 0.35s ease; }
@keyframes phase-step-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.phase-step-head {
  padding: 16px 18px; border-radius: 20px; margin-bottom: 14px;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  border: 1px solid rgba(99, 102, 241, 0.12);
}
.phase-step-head--warm {
  background: linear-gradient(135deg, #fff7ed, #fffbeb);
  border-color: rgba(245, 158, 11, 0.15);
}
.phase-step-head--rose {
  background: linear-gradient(135deg, #fff1f2, #fdf2f8);
  border-color: rgba(244, 63, 94, 0.12);
}
.phase-step-kicker { font-size: 10px; font-weight: 900; letter-spacing: 0.18em; color: #94a3b8; margin: 0 0 4px; }
.phase-step-title { font-size: 18px; font-weight: 900; color: #1e293b; margin: 0 0 4px; }
.phase-step-desc { font-size: 12px; font-weight: 600; color: #64748b; margin: 0; }
.phase-disease-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
.phase-disease-card {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 16px 18px; border-radius: 22px; border: 2px solid transparent;
  background: #fff; box-shadow: 0 8px 24px -18px rgba(15, 23, 42, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.phase-disease-card:active { transform: scale(0.98); }
.phase-disease-card--active { box-shadow: 0 12px 28px -16px rgba(79, 70, 229, 0.35); }
.phase-disease-emoji { font-size: 28px; line-height: 1; }
.phase-disease-name { font-size: 16px; font-weight: 900; color: #1e293b; }
.phase-disease-hint { font-size: 11px; font-weight: 600; color: #64748b; }
.phase-disease-check { position: absolute; top: 14px; right: 14px; font-size: 20px; color: #6366f1; }
.phase-duration-list { display: flex; flex-direction: column; gap: 10px; }
.phase-duration-card {
  display: grid; grid-template-columns: 56px 1fr 24px; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 20px; border: 2px solid #e2e8f0;
  background: #fff; text-align: left; transition: all 0.15s ease;
}
.phase-duration-card:active { transform: scale(0.99); }
.phase-duration-card--active { border-color: #6366f1; box-shadow: 0 10px 24px -16px rgba(99, 102, 241, 0.45); }
.phase-duration-card--gentle.phase-duration-card--active { background: linear-gradient(135deg, #ecfdf5, #fff); border-color: #34d399; }
.phase-duration-card--calm.phase-duration-card--active { background: linear-gradient(135deg, #eff6ff, #fff); border-color: #60a5fa; }
.phase-duration-card--tough.phase-duration-card--active { background: linear-gradient(135deg, #fff7ed, #fff); border-color: #fb923c; }
.phase-duration-card--fierce.phase-duration-card--active { background: linear-gradient(135deg, #fef2f2, #fff); border-color: #f87171; }
.phase-duration-card--legend.phase-duration-card--active { background: linear-gradient(135deg, #1e1b4b, #312e81); border-color: #818cf8; }
.phase-duration-card--legend.phase-duration-card--active .phase-duration-name,
.phase-duration-card--legend.phase-duration-card--active .phase-duration-mood,
.phase-duration-card--legend.phase-duration-card--active .phase-duration-desc { color: #fff; }
.phase-duration-card--legend.phase-duration-card--active .phase-duration-check { color: #fde68a; }
.phase-duration-emoji { font-size: 34px; line-height: 1; text-align: center; }
.phase-duration-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.phase-duration-name { font-size: 14px; font-weight: 900; color: #1e293b; }
.phase-duration-mood { font-size: 12px; font-weight: 800; color: #6366f1; }
.phase-duration-desc { font-size: 11px; font-weight: 600; color: #64748b; line-height: 1.4; }
.phase-duration-check { font-size: 20px; color: #6366f1; font-weight: 900; }
.phase-tag-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
.phase-tag-card {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 16px 18px; border-radius: 20px; border: 2px solid #e2e8f0; background: #fff;
  text-align: left; transition: all 0.15s ease;
}
.phase-tag-card:active { transform: scale(0.98); }
.phase-tag-card--active {
  border-color: #f43f5e; background: linear-gradient(135deg, #fff1f2, #fff);
  box-shadow: 0 10px 24px -16px rgba(244, 63, 94, 0.35);
}
.phase-tag-emoji { font-size: 26px; }
.phase-tag-name { font-size: 15px; font-weight: 900; color: #1e293b; }
.phase-tag-desc { font-size: 11px; font-weight: 600; color: #64748b; }
.phase-tag-badge {
  position: absolute; top: 12px; right: 12px;
  font-size: 10px; font-weight: 900; color: #fff; background: #f43f5e;
  padding: 3px 8px; border-radius: 999px;
}
.phase-wizard-actions { display: flex; gap: 10px; padding-top: 4px; }
.phase-wizard-btn {
  flex: 1; border: none; padding: 14px 16px; border-radius: 16px;
  font-size: 15px; font-weight: 900; transition: transform 0.15s ease;
}
.phase-wizard-btn:active { transform: scale(0.98); }
.phase-wizard-btn--ghost { background: #f1f5f9; color: #475569; }
.phase-wizard-btn--primary { background: #1e293b; color: #fff; }
.phase-wizard-btn--primary:disabled { opacity: 0.45; }

/* 动画 */
@keyframes slow-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
