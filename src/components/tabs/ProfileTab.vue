<template>
  <div class="xuan-care-container">
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>

    <header class="greeting-bar">
      <div class="greeting-text">
        <span class="greeting-title">早上好 文彬，今天也要按时吃饭 🌼</span>
        <span class="greeting-subtitle">Architect-xuan 专属守护</span>
      </div>
    </header>

    <!-- 身份卡（保持垂直徽章，已按你最新图片更新） -->
    <div class="premium-glass-card">
      <div class="card-glow-bg"></div>

      <div class="profile-content">
        <div class="avatar-wrapper">
          <div class="avatar-glow"></div>
          <img class="avatar" src="https://picsum.photos/id/64/300/300" alt="文彬头像" />
          <div class="tech-ring"></div>
          <div class="status-indicator">
            <span class="status-dot"></span>
          </div>
        </div>

        <div class="profile-info">
          <div class="name-wrapper">
            <h2 class="vip-name">全栈架构师_文彬</h2>
            <div class="verified-badge">✓</div>
          </div>
          <p class="title-tag">Architect-xuan 专属系统守护者</p>

          <!-- 垂直徽章列表（已更新为最新图片内容） -->
          <div class="badges-list">
            <div class="badge-item">
              <span class="badge-icon">🛡️</span>
              <span class="badge-text">克罗恩 V1 认证</span>
            </div>
            <div class="badge-item">
              <span class="badge-icon">⚙️</span>
              <span class="badge-text">全栈架构师</span>
            </div>
            <div class="badge-item">
              <span class="badge-icon">🌿</span>
              <span class="badge-text">无麸质探路者</span>
            </div>
          </div>
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
        <div class="status-row" @click="openSheet('phase')">
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

        <div class="status-row" @click="openSheet('diet')">
          <span class="row-label">饮食协议</span>
          <div class="row-value">
          <span class="tag-dynamic" :style="{ color: currentDiet.color, background: currentDiet.bgColor }">
            {{ currentDiet.icon }} {{ currentDiet.name }}
          </span>
            <span class="arrow">›</span>
          </div>
        </div>

        <div class="line-divider"></div>

        <div class="status-row" @click="openSheet('gut')">
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

    <van-action-sheet
        v-model:show="showSheet"
        :actions="sheetOptions"
        :title="sheetTitle"
        cancel-text="取消"
        close-on-click-action
        @select="onSelectOption"
    />    <!-- 修复按钮保持原样但更柔和 -->
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
</template>

<script setup>

const triggerRecovery = () => {
  alert('【系统级降级预案已启动】\n文彬，立刻切换全流质模式！小轩为你护航！');
};

const uploadMedicalRecord = () => {
  alert('安全加密通道已开启，准备上传病历...');
};// 模拟用户点击切换状态

import { ref } from 'vue';
// 注意：如果你的项目按需引入了 Vant，可能需要单独引入 ActionSheet 组件

// --- 1. 响应式状态 (当前显示的数据) ---
const currentPhase = ref({ name: '临床缓解期', icon: '✨', days: 128, color: '#6b46c1', bgColor: 'rgba(107, 70, 193, 0.1)' });
const currentDiet = ref({ name: '低 FODMAP', icon: '🌿', color: '#0d9488', bgColor: 'rgba(13, 148, 136, 0.1)' });
const currentGut = ref({ name: '运行平稳', icon: '🟢', color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.1)' });

// --- 2. 病友专属字典 (Vant ActionSheet 格式) ---
// Vant 的 actions 接受 name (主标题) 和 subname (副标题说明)
const dicPhase = [
  { name: '临床缓解期', icon: '✨', subname: '症状完全消失，复查指标平稳', color: '#6b46c1', bgColor: 'rgba(107, 70, 193, 0.1)' },
  { name: '轻度活动期', icon: '⚠️', subname: '偶有腹痛腹泻，生活基本不受限', color: '#d97706', bgColor: 'rgba(217, 119, 6, 0.1)' },
  { name: '中重度活动期', icon: '🔥', subname: '腹痛频繁，急需就医调整方案', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
  { name: '诱导缓解期', icon: '💊', subname: '正在上激素或初打生物制剂', color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.1)' },
  { name: '术后康复期', icon: '🏥', subname: '刚经历手术，极其关键的休养期', color: '#059669', bgColor: 'rgba(5, 150, 105, 0.1)' },
];

const dicDiet = [
  { name: '低 FODMAP', icon: '🌿', subname: '避开易发酵碳水，减少产气', color: '#0d9488', bgColor: 'rgba(13, 148, 136, 0.1)' },
  { name: '无麸质饮食', icon: '🌾', subname: '严格避开小麦等麸质过敏源', color: '#b45309', bgColor: 'rgba(180, 83, 9, 0.1)' },
  { name: '低渣/软食协议', icon: '🥣', subname: '白粥烂面条为主，减轻物理摩擦', color: '#4f46e5', bgColor: 'rgba(79, 70, 229, 0.1)' },
  { name: '纯肠内营养', icon: '🧪', subname: '全流质/营养粉，让肠道彻底休息', color: '#db2777', bgColor: 'rgba(219, 39, 119, 0.1)' },
  { name: '极简白名单', icon: '🍚', subname: '只吃自己亲测过的安全食物', color: '#4b5563', bgColor: 'rgba(75, 85, 99, 0.1)' },
];

const dicGut = [
  { name: '运行平稳', icon: '🟢', subname: '大便成型，毫无痛感', color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.1)' },
  { name: '轻微预警', icon: '🟡', subname: '肚子咕噜叫，轻微胀气或不成形', color: '#ca8a04', bgColor: 'rgba(202, 138, 4, 0.1)' },
  { name: '局部故障', icon: '🟠', subname: '腹痛明显，跑厕所次数增加', color: '#ea580c', bgColor: 'rgba(234, 88, 12, 0.1)' },
  { name: '严重报错', icon: '🔴', subname: '剧烈绞痛/便血，立即就医！', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
];

// --- 3. 面板控制逻辑 ---
const showSheet = ref(false); // 控制底部面板是否显示
const sheetTitle = ref('');   // 面板标题
const sheetOptions = ref([]); // 当前面板要展示的选项列表
const currentEditType = ref(''); // 记录当前正在修改哪个模块 (phase/diet/gut)

// 打开面板
const openSheet = (type) => {
  currentEditType.value = type;
  if (type === 'phase') {
    sheetTitle.value = '更新当前病程阶段';
    sheetOptions.value = dicPhase;
  } else if (type === 'diet') {
    sheetTitle.value = '切换饮食协议';
    sheetOptions.value = dicDiet;
  } else if (type === 'gut') {
    sheetTitle.value = '今日肠道反馈';
    sheetOptions.value = dicGut;
  }
  showSheet.value = true;
};

// 选中选项后的处理
const onSelectOption = (item) => {
  // item 就是你点中的那个字典对象
  if (currentEditType.value === 'phase') {
    // 如果他切换了阶段，这里可以弹窗问他：“是否重新计算天数？”
    currentPhase.value = { ...currentPhase.value, ...item, days: 1 }; // 模拟切换后天数重置为 1
  } else if (currentEditType.value === 'diet') {
    currentDiet.value = item;
  } else if (currentEditType.value === 'gut') {
    currentGut.value = item;
  }
  // Vant 设置了 close-on-click-action，选中后会自动关闭弹窗，无需手动 showSheet.value = false
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

.line-divider {
  height: 1px;
  background-color: rgba(226, 232, 240, 0.6);
  margin: 0 18px; /* 左右留白，类似微信设置页的分割线 */
}
/* 动画 */
@keyframes slow-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>