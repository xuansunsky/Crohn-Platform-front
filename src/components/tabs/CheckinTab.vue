<template>
  <div class="why-pill" @click="showWhyModal = true">
    <span class="pill-icon">💡</span>
    <span class="pill-text">温柔提示：为什么要记录？ 请点击</span>
    <span class="pill-arrow">→</span>
  </div>
  <div v-if="showWhyModal" class="modal-backdrop">
  <div class="modal-card">
    <h2 class="modal-title">为什么要记录？</h2>
    <div class="modal-body">
      <p>
        我们有点像 F1 赛车手：只有出了大事故，才会进一次维修区（住院、手术），但绝大多数时间，车是在赛道上跑的——那段时间只能靠我们自己。
      </p>
      <p>
        记录，不是为了吓自己，也不是因为你很严重，而是帮我们搞清楚：
        <strong>平时怎么开车更安全、出问题前有哪些预兆</strong>。
      </p>
      <p>
        很多勇士记录的时候会觉得「自己状态好差」，但实际复查、肠镜的结果往往比想象好得多。记录只是让医生更了解你，也让你以后回头看的时候，知道：
        <strong>原来已经过了这么多天了啊，这些天里身体和生活是怎么一步步变好的💪</strong>。
      </p>
      <p>
        我相信，随着预防 + 治疗慢慢到位，你的记录会越来越轻松、越来越简单，生活也会越来越像你自己想要的样子。
      </p>
      <p> 👑 皇冠给你带好,别低头！
      </p>
    </div>
    <button class="modal-close" @click="showWhyModal = false">
      我知道啦
    </button>
  </div>
</div>
  <!-- 星光打卡模块 -->
  <main class="grid">
    <!-- 今日概览 -->
    <section class="card overview-card">
      <div class="card-header">
        <h2>今日概览</h2>
        <span class="chip chip-soft">恢复期 · 第 21 天</span>
      </div>

      <div class="overview-content">
        <div class="ring">
          <div class="ring-inner">
            <span class="ring-value">{{ overallScore }}%</span>
            <span class="ring-label">今日总体状态</span>
          </div>
        </div>

        <div class="overview-metrics">
          <div class="metric" v-for="m in metrics" :key="m.label">
            <div class="metric-top">
              <span class="dot" :style="{ background: m.color }"></span>
              <span class="metric-label">{{ m.label }}</span>
              <span class="metric-score">{{ m.value }}/10</span>
            </div>
            <div class="metric-bar">
              <div
                  class="metric-bar-fill"
                  :style="{ width: m.value * 10 + '%', background: m.color }"
              ></div>
            </div>
            <p class="metric-note">{{ m.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 症状趋势 -->
    <section class="card chart-card">
      <div class="card-header">
        <h2>最近 7 天痛感趋势</h2>
        <span class="chip">0 = 不痛 · 10 = 爆炸痛</span>
      </div>
      <div class="chart-placeholder">
        <svg viewBox="0 0 200 80" class="mini-chart">
          <polyline
              fill="none"
              stroke="#4ade80"
              stroke-width="2"
              :points="painPolyline"
          />
          <circle
              v-for="(p, idx) in painData"
              :key="idx"
              :cx="(idx / (painData.length - 1)) * 190 + 5"
              :cy="80 - p * 7"
              r="2.5"
              class="chart-point"
          />
        </svg>
        <div class="chart-x-axis">
          <span v-for="(d, idx) in days" :key="idx">{{ d }}</span>
        </div>
      </div>
    </section>

    <!-- 今日小任务 -->
    <section class="card goals-card">
      <div class="card-header">
        <h2>今日任务</h2>
        <span class="chip chip-soft">轻量模式</span>
      </div>
      <div class="goals-list">
        <article class="goal-card success">
          <p class="goal-title">按时用药</p>
          <p class="goal-sub">乌帕替尼 · 45mg</p>
          <div class="goal-progress">
            <div class="goal-bar">
              <div class="goal-bar-fill" style="width: 66%;"></div>
            </div>
            <span class="goal-tag">今天完成 2 / 3 次</span>
          </div>
        </article>

        <article class="goal-card warning">
          <p class="goal-title">营养液摄入</p>
          <p class="goal-sub">今天还差一顿 · 放轻松慢慢喝</p>
          <span class="goal-tag">小口喝 · 胃更舒服</span>
        </article>

        <article class="goal-card calm">
          <p class="goal-title">情绪 & 游戏时间</p>
          <p class="goal-sub">今晚少打一把，就算赢</p>
          <span class="goal-tag">留一点精力给「爱与创造」</span>
        </article>
      </div>
    </section>

    <!-- 用药卡片 -->
    <section class="card meds-card">
      <div class="card-header">
        <h2>今日用药打卡</h2>
        <span class="chip">仅自己可见</span>
      </div>
      <div class="meds-grid">
        <div
            v-for="slot in medSlots"
            :key="slot.time"
            class="med-slot"
            :class="{ done: slot.done }"
        >
          <div class="med-time">{{ slot.time }}</div>
          <div class="med-name">{{ slot.name }}</div>
          <div class="med-status">
            <span v-if="slot.done">✅ 已完成</span>
            <span v-else>🕒 待服用</span>
          </div>
        </div>
      </div>
    </section>
    <!-- 饮食 & 触发因素 -->
    <section class="card food-card">
      <div class="card-header">
        <h2>饮食 & 触发因素</h2>
        <span class="chip chip-soft">今天尽量「清淡 + 可消化」</span>
      </div>
      <ul class="food-list">
        <li class="food-item">
          <div>
            <p class="food-title">营养液 · 主食</p>
            <p class="food-note">已喝 2 / 3 次 · 下次 16:30 左右</p>
          </div>
          <span class="food-tag good">可</span>
        </li>
        <li class="food-item">
          <div>
            <p class="food-title">油炸 / 烧烤 · 直接 ban 掉</p>
            <p class="food-note">最近 20 天回避成功 ✅</p>
          </div>
          <span class="food-tag danger">禁</span>
        </li>
        <li class="food-item">
          <div>
            <p class="food-title">小小心愿清单</p>
            <p class="food-note">
              溃疡缩小后：一碗顺滑的面 + 一次安心的火锅
            </p>
          </div>
          <span class="food-tag wish">愿</span>
        </li>
      </ul>
    </section>

    <!-- 心情 & 能量 -->
    <section class="card mood-card">
      <div class="card-header">
        <h2>今日心情 & 电量</h2>
        <span class="chip">自己给自己打个分</span>
      </div>
      <div class="mood-body">
        <div class="battery">
          <div class="battery-shell">
            <div class="battery-level" :style="{ width: energy + '%' }"></div>
          </div>
          <p class="battery-label">当前电量：{{ energy }}%</p>
        </div>
        <div class="tags">
          <span class="pill">有点困但还能干事</span>
          <span class="pill">不是废物 · 是在缓冲</span>
          <span class="pill">今天只要做一小步就合格</span>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
// 假数据：痛感 0–10
import {computed, ref} from "vue";
const showWhyModal = ref(false)
const painData = [4, 5, 3, 6, 5, 4, 3]
const days = ['一', '二', '三', '四', '五', '六', '今']

const painPolyline = computed(() =>
    painData
        .map((p, idx) => {
          const x = (idx / (painData.length - 1)) * 190 + 5
          const y = 80 - p * 7
          return `${x},${y}`
        })
        .join(' ')
)

// 各维度分数
const metrics = [
  { label: '腹痛控制', value: 7, note: '多为隐痛，可忍受', color: '#4ade80' },
  { label: '排便情况', value: 6, note: '基本稳定，略频繁', color: '#22d3ee' },
  { label: '睡眠质量', value: 8, note: '昨晚入睡不错', color: '#a855f7' },
  { label: '情绪 & 焦虑', value: 5, note: '有点乱，但没失控', color: '#fb923c' }
]

const overallScore = Math.round(
    (metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length) * 10
)

// 用药时段
const medSlots = [
  { time: '早上', name: '乌帕替尼 45mg', done: true },
  { time: '中午', name: '营养液 1 袋', done: true },
  { time: '晚上', name: '营养液 1 袋 + 复查提醒', done: false }
]

// 今日电量（你可以之后从打卡里算）
const energy = 42
</script>
<style scoped>
/* 通用卡片 */
.grid {
  display: grid;
  grid-template-columns: 2.1fr 1.7fr 1.6fr;
  grid-auto-rows: minmax(0, auto);
  gap: 18px;
}


.chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  color: #e5e7eb;
  background: rgba(31, 41, 55, 0.9);
}

.chip-soft {
  background: rgba(22, 163, 74, 0.18);
  color: #bbf7d0;
}


/* 今日概览 */
.overview-card {
  grid-column: span 2;
}

.overview-content {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  align-items: center;
}

.ring {
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: conic-gradient(#22c55e 0 240deg, #1f2937 240deg 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ring::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: inherit;
  background: radial-gradient(circle at top, #020617, #020617 60%, #111827);
}

.ring-inner {
  position: relative;
  text-align: center;
}

.ring-value {
  font-size: 24px;
  font-weight: 700;
}

.ring-label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.overview-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.metric {
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(55, 65, 81, 0.9);
}

.metric-top {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.metric-label {
  flex: 1;
}

.metric-score {
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.metric-bar {
  margin-top: 6px;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #020617;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: inherit;
}

.metric-note {
  margin-top: 4px;
  font-size: 11px;
  color: #9ca3af;
}

/* 症状趋势 */
.chart-card {
  grid-column: span 1;
}

.chart-placeholder {
  margin-top: 4px;
}

.mini-chart {
  width: 100%;
  height: 80px;
}

.chart-point {
  fill: #bbf7d0;
}

.chart-x-axis {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
}

/* 今日任务 */
.goals-card {
  grid-column: span 1;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-card {
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(17, 24, 39, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.9);
  font-size: 13px;
}

.goal-title {
  font-weight: 600;
}

.goal-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.goal-progress {
  margin-top: 6px;
}

.goal-bar {
  height: 4px;
  border-radius: 999px;
  background: #020617;
  overflow: hidden;
}

.goal-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #a3e635);
}

.goal-tag {
  display: inline-block;
  margin-top: 4px;
  font-size: 11px;
  color: #bbf7d0;
}

.goal-card.success {
  border-color: rgba(34, 197, 94, 0.6);
}

.goal-card.warning {
  border-color: rgba(250, 204, 21, 0.6);
}

.goal-card.calm {
  border-color: rgba(129, 140, 248, 0.6);
}

/* 用药 */
.meds-card {
  grid-column: span 1;
}

.meds-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.med-slot {
  border-radius: 12px;
  padding: 8px 10px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.9);
  font-size: 12px;
}

.med-slot.done {
  border-color: rgba(34, 197, 94, 0.7);
  background: rgba(22, 163, 74, 0.12);
}

.med-time {
  font-weight: 600;
  margin-bottom: 2px;
}

.med-name {
  color: #9ca3af;
  margin-bottom: 4px;
}

.med-status span {
  font-size: 11px;
}

/* 饮食卡片 */
.food-card {
  grid-column: span 1;
}

.food-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.9);
}

.food-title {
  font-size: 13px;
  font-weight: 500;
}

.food-note {
  font-size: 11px;
  color: #9ca3af;
}

.food-tag {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.food-tag.good {
  background: rgba(34, 197, 94, 0.16);
  color: #bbf7d0;
}

.food-tag.danger {
  background: rgba(248, 113, 113, 0.16);
  color: #fecaca;
}

.food-tag.wish {
  background: rgba(129, 140, 248, 0.16);
  color: #e0e7ff;
}

/* 心情 */
.mood-card {
  grid-column: span 1;
}

.mood-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.battery-shell {
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 999px;
  background: #020617;
  overflow: hidden;
  border: 1px solid rgba(55, 65, 81, 0.9);
}

.battery-level {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #22c55e);
  border-radius: inherit;
}

.battery-label {
  margin-top: 4px;
  font-size: 12px;
  color: #e5e7eb;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: rgba(31, 41, 55, 0.9);
  color: #e5e7eb;
}

/* 响应式 */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .overview-card {
    grid-column: span 1;
  }
}
.why-pill {
  /* 核心：不再是通栏，而是自适应宽度，居中 */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 14px auto; /* 居中显示 */
  padding: 8px 16px;
  border-radius: 999px; /* 胶囊形状 */

  /* 颜色：深色背景，但更融合，使用微弱的暖光 */
  background: rgba(248, 181, 82, 0.08); /* 极淡的橙色背景 */
  border: 1px solid rgba(248, 181, 82, 0.2); /* 微弱的边框 */
  color: #fed7aa; /* 暖色文字 */

  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px); /*稍微带点毛玻璃增强质感*/
}

.why-pill:hover {
  background: rgba(248, 181, 82, 0.15);
  border-color: rgba(248, 181, 82, 0.4);
  transform: translateY(-1px);
}

.pill-icon {
  font-size: 14px;
}

.pill-arrow {
  font-size: 14px;
  opacity: 0.6;
  margin-left: 4px;
  transition: transform 0.2s;
}

.why-pill:hover .pill-arrow {
  transform: translateX(3px); /* hover时箭头有个小位移 */
}
/* 暖色弹窗 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal-card {
  width: min(420px, 90vw);
  border-radius: 18px;
  padding: 18px 18px 14px;
  background: radial-gradient(circle at top, #fff7ed, #fee2e2);
  color: #3f3f46;
  box-shadow: 0 25px 55px rgba(0, 0, 0, 0.55);
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #7c2d12;
}

.modal-body {
  font-size: 13px;
  line-height: 1.6;
}

.modal-body p + p {
  margin-top: 6px;
}

.modal-close {
  margin-top: 10px;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  background: #f97316;
  color: #fff7ed;
  float: right;
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

.user-info .name {
  font-size: 13px;
  font-weight: 600;
}

.user-info .tag {
  font-size: 11px;
  color: #9ca3af;
}

.tab-item i {
  font-size: 16px;
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
/* 如果你的 InsuranceMap 组件里没有定高度，这里可以强行定一下 */
/* :deep() 是 Vue 的一种穿透写法，可以影响子组件的样式 */
:deep(.echarts-map) {
  width: 100% !important;
  height: 100% !important;
  min-height: 500px;
}

</style>