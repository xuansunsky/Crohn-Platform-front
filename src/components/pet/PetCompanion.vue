<template>
  <!-- 全局悬浮宠物：始终挂载在 Tab 切换之外，切 Tab 也不会消失 -->
  <div v-show="!hidden" class="pet-root">
    <!-- 收起态：可拖拽的小球 -->
    <transition name="pet-ball-fade">
      <button
        v-if="!expanded"
        ref="ballRef"
        type="button"
        class="pet-ball"
        :class="`mood-${moodTag}`"
        :style="ballStyle"
        @pointerdown="onPointerDown"
        @click="onBallClick"
      >
        <img :src="portrait" alt="" class="pet-ball-img" />
        <span v-if="unread" class="pet-ball-dot"></span>
      </button>
    </transition>

    <!-- 收起态旁的气泡：自动弹出问候语，几秒后自己收起 -->
    <transition name="pet-bubble-fade">
      <div
        v-if="!expanded && bubbleText"
        class="pet-mini-bubble"
        :style="bubbleStyle"
        @click="onBallClick"
      >
        {{ bubbleShown }}<span v-show="bubbleTyping" class="pet-caret">丨</span>
      </div>
    </transition>

    <!-- 展开态：大卡片，立绘 + 对话 + 快捷操作 -->
    <transition name="pet-card-fade">
      <div v-if="expanded" class="pet-mask" @click.self="collapse">
        <div class="pet-card" :class="`mood-${moodTag}`">
          <button type="button" class="pet-card-close" @click="collapse"><i class="ri-close-line"></i></button>

          <div class="pet-card-stage">
            <img :src="portrait" alt="" class="pet-card-portrait" />
            <div class="pet-card-dialogue">
              <div class="pet-card-head">
                <span class="pet-card-name">魔物萌娘</span>
                <span class="pet-card-mood-chip"><i :class="moodIconClass"></i>{{ moodLabel }}</span>
              </div>
              <p class="pet-card-line">{{ bubbleShown }}<span v-show="bubbleTyping" class="pet-caret">丨</span></p>
            </div>
          </div>

          <div class="pet-quick-actions">
            <button type="button" class="pet-quick-btn" @click="checkin('happy')"><span>😊</span>开心</button>
            <button type="button" class="pet-quick-btn" @click="checkin('game')"><span>🎮</span>打游戏</button>
            <button type="button" class="pet-quick-btn" @click="checkin('bbq')"><span>🍢</span>吃烧烤</button>
            <button type="button" class="pet-quick-btn" @click="checkin('pain')"><span>😣</span>肚子痛</button>
            <button type="button" class="pet-quick-btn" @click="checkin('lonely')"><span>🌙</span>孤独</button>
          </div>

          <button type="button" class="pet-chat-btn" @click="openChat">
            <i class="ri-chat-3-fill"></i>找她聊聊
          </button>
        </div>
      </div>
    </transition>

    <PetChatPanel v-if="chatOpen" :portrait="portrait" :mood-tag="moodTag" @close="chatOpen = false" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import http from '@/api/http'
import PetChatPanel from './PetChatPanel.vue'

const props = defineProps({
  // 社交全屏聊天等场景下需要把宠物先藏起来，别挡住别的沉浸界面
  suppress: { type: Boolean, default: false },
})

const hidden = computed(() => props.suppress)

// ---- 立绘（先用现有三张乙游立绘，等 Live2D 模型到位后可无缝换成 <Live2DStage>） ----
const PORTRAITS = {
  bright: '/media/mascot/mascot-bright.webp',
  calm: '/media/mascot/mascot-calm.webp',
  dark: '/media/mascot/mascot-dark.webp',
}
const moodTag = ref('calm')
const portrait = computed(() => PORTRAITS[moodTag.value] || PORTRAITS.calm)
const moodLabel = computed(() => (moodTag.value === 'dark' ? '心疼你' : moodTag.value === 'bright' ? '为你开心' : '陪着你'))
const moodIconClass = computed(() => (moodTag.value === 'dark' ? 'ri-heart-2-line' : moodTag.value === 'bright' ? 'ri-sun-line' : 'ri-leaf-line'))

// ---- 本地兜底文案（接口没接稳也绝不空着，红线：不说教、不命令、不硬编事实） ----
const LOCAL_GREETINGS = {
  dark: ['你还好吗…我在呢', '别硬撑着，有我陪你', '难受的话就靠我一下吧'],
  bright: ['看你心情不错呀，我也开心', '今天感觉很不错嘛', '嘻嘻，被你感染到啦'],
  calm: ['今天过得怎么样呀', '我在这儿等你呢', '随时想聊就找我呀'],
}
const LOCAL_LONELY = ['好久没理我啦…有点想你了', '我一直在这儿等你呢', '来找我说说话吧，我在听']
const CHECKIN_REACTIONS = {
  game: '好呀，陪你一起嗨！打完想聊聊我随时都在～',
  bbq: '烧烤呀…好吃是好吃，我在旁边有点小担心你的肚子',
  pain: '呜…肚子痛吗？我在呢，抱抱你',
  happy: '看到你这么开心，我也好开心呀！',
  lonely: '我在呢，不孤单啦，我陪着你',
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ---- 状态 ----
const intimacy = ref(0)
const unread = ref(false)
const expanded = ref(false)
const chatOpen = ref(false)

const LONELY_KEY = 'crohn_pet_last_seen_at'
const isLonely = () => {
  try {
    const last = Number(localStorage.getItem(LONELY_KEY) || 0)
    if (!last) return false
    return Date.now() - last > 4 * 60 * 60 * 1000 // 4 小时没打开过，算孤独
  } catch { return false }
}
const touchLonelyClock = () => {
  try { localStorage.setItem(LONELY_KEY, String(Date.now())) } catch { /* ignore */ }
}

// ---- 打字机气泡（复用 JournalMascot 的节奏） ----
const bubbleText = ref('')
const bubbleShown = ref('')
const bubbleTyping = ref(false)
let typeTimer = null
let hideTimer = null
const stopTyping = () => { if (typeTimer) { clearInterval(typeTimer); typeTimer = null }; bubbleTyping.value = false }
const say = (text, autoHideMs = 5200) => {
  stopTyping()
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  bubbleText.value = text
  bubbleShown.value = ''
  bubbleTyping.value = true
  let i = 0
  typeTimer = setInterval(() => {
    i += 1
    bubbleShown.value = text.slice(0, i)
    if (i >= text.length) stopTyping()
  }, 40)
  if (autoHideMs && !expanded.value) {
    hideTimer = setTimeout(() => { if (!expanded.value) bubbleText.value = '' }, autoHideMs)
  }
}

// ---- 拉状态：优先真实接口，失败就走本地兜底，保证任何时候都不会哑掉 ----
const ok = (res) => res && (res.status === 200 || res.code === 200)
const loadState = async () => {
  const lonely = isLonely()
  try {
    const res = await http.get('/pet/state')
    if (ok(res) && res.data) {
      moodTag.value = res.data.moodTag || 'calm'
      intimacy.value = res.data.intimacy || 0
      const greeting = lonely ? pick(LOCAL_LONELY) : (res.data.greeting || pick(LOCAL_GREETINGS[moodTag.value]))
      say(greeting)
      unread.value = true
      return
    }
    throw new Error('bad response')
  } catch (e) {
    moodTag.value = 'calm'
    say(lonely ? pick(LOCAL_LONELY) : pick(LOCAL_GREETINGS.calm))
    unread.value = true
  } finally {
    touchLonelyClock()
  }
}

// ---- 快捷打卡 ----
const checkin = async (type) => {
  say(CHECKIN_REACTIONS[type] || '记下啦，我陪着你', 6000)
  if (type === 'happy') moodTag.value = 'bright'
  if (type === 'pain') moodTag.value = 'dark'
  try {
    const res = await http.post('/pet/checkin', { type })
    if (ok(res) && res.data?.reaction) say(res.data.reaction, 6000)
  } catch (e) {
    // 接口没接稳也无所谓，本地反应已经先说了
  }
}

const openChat = () => {
  unread.value = false
  chatOpen.value = true
}

// ---- 展开/收起 ----
const collapse = () => { expanded.value = false }
const onBallClick = () => {
  if (dragMoved) { dragMoved = false; return }
  expanded.value = true
  unread.value = false
  if (bubbleText.value) say(bubbleText.value, 0)
}

// ---- 拖拽：记住位置，切 Tab 也不会跳 ----
const POS_KEY = 'crohn_pet_ball_pos'
const pos = reactive({ x: 0, y: 0 })
const ballRef = ref(null)
let dragging = false
let dragMoved = false
let dragStart = { x: 0, y: 0, px: 0, py: 0 }

const clampPos = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  pos.x = Math.min(Math.max(pos.x, 8), w - 68)
  pos.y = Math.min(Math.max(pos.y, 60), h - 140)
}

const loadPos = () => {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      pos.x = Number(p.x) || 0
      pos.y = Number(p.y) || 0
    } else {
      pos.x = window.innerWidth - 76
      pos.y = window.innerHeight - 220
    }
  } catch {
    pos.x = window.innerWidth - 76
    pos.y = window.innerHeight - 220
  }
  clampPos()
}
const savePos = () => {
  try { localStorage.setItem(POS_KEY, JSON.stringify({ x: pos.x, y: pos.y })) } catch { /* ignore */ }
}

const onPointerDown = (e) => {
  dragging = true
  dragMoved = false
  dragStart = { x: pos.x, y: pos.y, px: e.clientX, py: e.clientY }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}
const onPointerMove = (e) => {
  if (!dragging) return
  const dx = e.clientX - dragStart.px
  const dy = e.clientY - dragStart.py
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true
  pos.x = dragStart.x + dx
  pos.y = dragStart.y + dy
  clampPos()
}
const onPointerUp = () => {
  dragging = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  savePos()
}

const ballStyle = computed(() => ({ left: `${pos.x}px`, top: `${pos.y}px` }))
const bubbleStyle = computed(() => {
  const fromRight = pos.x > window.innerWidth / 2
  return fromRight
    ? { right: `${window.innerWidth - pos.x + 8}px`, top: `${pos.y - 6}px` }
    : { left: `${pos.x + 68}px`, top: `${pos.y - 6}px` }
})

onMounted(() => {
  loadPos()
  loadState()
  window.addEventListener('resize', clampPos)
})
onBeforeUnmount(() => {
  stopTyping()
  if (hideTimer) clearTimeout(hideTimer)
  window.removeEventListener('resize', clampPos)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>

<style scoped>
.pet-root { position: fixed; inset: 0; z-index: 880; pointer-events: none; }

/* ---- 悬浮小球 ---- */
.pet-ball {
  position: fixed; width: 60px; height: 60px; border-radius: 999px;
  border: 3px solid rgba(255,255,255,0.9); padding: 0; overflow: hidden;
  pointer-events: auto; touch-action: none; cursor: grab;
  background: linear-gradient(160deg, #fff1cf, #f6c453);
  box-shadow: 0 14px 30px -12px rgba(15,23,42,0.4), 0 0 0 5px rgba(255,255,255,0.28);
  animation: pet-breathe 3.6s ease-in-out infinite;
}
.pet-ball.mood-dark { background: linear-gradient(160deg, #4a3f56, #241a30); box-shadow: 0 14px 30px -12px rgba(0,0,0,0.55), 0 0 0 5px rgba(180,140,220,0.2); }
.pet-ball.mood-bright { background: linear-gradient(160deg, #fff1cf, #f6c453); }
.pet-ball.mood-calm { background: linear-gradient(160deg, #e6efe6, #9ab6a4); }
@keyframes pet-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.pet-ball-img { width: 100%; height: 100%; object-fit: cover; object-position: center 8%; pointer-events: none; }
.pet-ball-dot {
  position: absolute; top: 2px; right: 2px; width: 12px; height: 12px; border-radius: 999px;
  background: #ef4444; border: 2px solid #fff; box-shadow: 0 0 0 2px rgba(239,68,68,0.25);
}

/* ---- 收起态旁的气泡 ---- */
.pet-mini-bubble {
  position: fixed; max-width: 200px; pointer-events: auto; cursor: pointer;
  padding: 9px 13px; border-radius: 16px; font-size: 12.5px; font-weight: 700; line-height: 1.4;
  color: #3d3320; background: rgba(255,255,255,0.96); border: 1px solid rgba(17,24,39,0.06);
  box-shadow: 0 10px 24px -14px rgba(17,24,39,0.35);
}
.pet-caret { animation: pet-blink 0.8s step-end infinite; }
@keyframes pet-blink { 50% { opacity: 0; } }

/* ---- 展开态：遮罩 + 大卡片 ---- */
.pet-mask {
  position: fixed; inset: 0; pointer-events: auto; z-index: 890;
  background: rgba(10,8,14,0.42); backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center;
}
.pet-card {
  position: relative; width: 100%; max-width: 400px; margin: 0 12px calc(18px + env(safe-area-inset-bottom));
  border-radius: 26px; overflow: hidden;
  background: #17140f; box-shadow: 0 -20px 60px -20px rgba(0,0,0,0.6);
}
.pet-card-close {
  position: absolute; top: 12px; right: 12px; z-index: 3; width: 30px; height: 30px; border-radius: 999px;
  color: #fff; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; font-size: 17px;
}
.pet-card-stage { position: relative; height: 260px; }
.pet-card-portrait {
  position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
  height: 108%; max-width: none; width: auto; object-fit: contain; object-position: bottom center;
  filter: drop-shadow(0 12px 18px rgba(0,0,0,0.3));
}
.pet-card-dialogue {
  position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 2;
  background: rgba(20,15,12,0.55); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.14); border-radius: 16px; padding: 10px 13px 11px;
}
.pet-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.pet-card-name { font-size: 12.5px; font-weight: 900; color: #ffe8c2; letter-spacing: 0.02em; }
.pet-card-mood-chip {
  display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #fff8ef;
  background: rgba(255,255,255,0.16); border-radius: 999px; padding: 2px 8px;
}
.pet-card-line { font-size: 13.5px; font-weight: 650; color: #fbf3e8; line-height: 1.5; min-height: 1.5em; margin: 0; }

.pet-quick-actions { display: flex; gap: 7px; padding: 14px 14px 4px; overflow-x: auto; }
.pet-quick-btn {
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 3px;
  min-width: 58px; padding: 8px 6px; border-radius: 14px; font-size: 10.5px; font-weight: 800;
  color: #efe6da; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08);
}
.pet-quick-btn span { font-size: 18px; }
.pet-quick-btn:active { transform: scale(0.94); background: rgba(255,255,255,0.16); }

.pet-chat-btn {
  width: calc(100% - 28px); margin: 12px 14px calc(14px + env(safe-area-inset-bottom));
  padding: 13px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 7px;
  font-size: 14px; font-weight: 900; color: #2b2010;
  background: linear-gradient(135deg, #fde68a, #f6c453); box-shadow: 0 14px 28px -16px rgba(217,160,50,0.7);
}
.pet-chat-btn:active { transform: scale(0.98); }

/* ---- 过渡动画 ---- */
.pet-ball-fade-enter-active, .pet-ball-fade-leave-active { transition: opacity 0.24s ease, transform 0.24s ease; }
.pet-ball-fade-enter-from, .pet-ball-fade-leave-to { opacity: 0; transform: scale(0.7); }
.pet-bubble-fade-enter-active, .pet-bubble-fade-leave-active { transition: opacity 0.22s ease; }
.pet-bubble-fade-enter-from, .pet-bubble-fade-leave-to { opacity: 0; }
.pet-card-fade-enter-active, .pet-card-fade-leave-active { transition: opacity 0.26s ease; }
.pet-card-fade-enter-from, .pet-card-fade-leave-to { opacity: 0; }
.pet-card-fade-enter-active .pet-card, .pet-card-fade-leave-active .pet-card { transition: transform 0.28s cubic-bezier(0.22,1,0.36,1); }
.pet-card-fade-enter-from .pet-card, .pet-card-fade-leave-to .pet-card { transform: translateY(30px); }
</style>
