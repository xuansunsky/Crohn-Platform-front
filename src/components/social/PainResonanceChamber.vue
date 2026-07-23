<template>
  <div class="px-5 pt-4">
    <section class="chamber">
      <div class="chamber-aura"></div>

      <header class="chamber-head">
        <div class="chamber-head-text">
          <p class="chamber-eyebrow">痛痛共鸣舱</p>
          <h3 class="chamber-title">疼痛信号</h3>
        </div>
        <button type="button" class="chamber-qr" @click="openMyPayQr">
          <i class="ri-qr-code-line"></i>
        </button>
      </header>

      <p class="chamber-desc">痛了就发信号。社区所有人都可以支持你！！</p>

      <div class="chamber-actions">
        <button
          type="button"
          class="chamber-call"
          :class="{ 'is-live': isBroadcasting }"
          @click="togglePainRescue"
        >
          <span class="chamber-call-icon">
            <i :class="isBroadcasting ? 'ri-checkbox-circle-line' : 'ri-heart-pulse-line'"></i>
          </span>
          <span class="chamber-call-text">
            {{ isBroadcasting ? '收起疼痛信号' : '现在肚子有点痛' }}
          </span>
        </button>
        <button type="button" class="chamber-visit" @click="openPatrolSignal">
          <i class="ri-team-line"></i>
          <span>{{ showPatrol ? '收起' : '陪陪别人' }}</span>
        </button>
      </div>

      <transition name="soft">
        <div v-if="isBroadcasting" class="chamber-live">
          <span class="chamber-live-dot"></span>
          <p>信号已亮！加油朋友，我们与你同在！</p>
        </div>
      </transition>

      <transition-group name="soft" tag="div" class="chamber-comforts">
        <div v-for="comfort in incomingComforts" :key="comfort.id" class="comfort-line">
          <span class="comfort-line-emoji">{{ comfort.emoji }}</span>
          <span class="comfort-line-text">{{ comfort.text }}</span>
        </div>
      </transition-group>

      <transition name="soft">
        <div v-if="showPatrol" class="chamber-patrol">
          <p class="chamber-patrol-title">此刻也在喊痛的人</p>

          <div v-if="patrolPatients.length === 0" class="patrol-empty">
            <span>🌙</span>
            <p>这会儿很安静，没人需要陪伴</p>
          </div>

          <article v-for="p in patrolPatients" :key="p.id" class="signal">
            <div class="signal-avatar" :style="{ background: avatarTint(p) }">
              {{ avatarChar(p) }}
            </div>
            <div class="signal-body">
              <p class="signal-name">{{ p.name }}</p>
              <p class="signal-sign">{{ p.sign || '正在和肚子慢慢周旋…' }}</p>
              <div class="signal-links">
                <button type="button" class="signal-link" @click="openBlessing(p)">送个动作</button>
                <span class="signal-dot">·</span>
                <button type="button" class="signal-link" @click="openComfortPaycode(p)">随缘转点暖</button>
              </div>
            </div>
            <button
              type="button"
              class="signal-warm"
              :class="{ 'is-done': p.warmed }"
              :disabled="p.warmed"
              @click="sendWarmthTo(p)"
            >
              <i :class="p.warmed ? 'ri-check-line' : 'ri-hand-heart-line'"></i>
            </button>
          </article>
        </div>
      </transition>
    </section>

    <!-- 动作卡 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showBlessingSheet" class="sheet-overlay" @click.self="showBlessingSheet = false">
          <div class="sheet sheet--blessing">
            <div class="sheet-handle"></div>
            <p class="sheet-eyebrow">送个动作</p>
            <h3 class="sheet-title">{{ blessingTarget?.name || 'TA' }}</h3>
            <p class="sheet-sub">短一点，直接一点。</p>

            <div class="blessing-grid">
              <button
                v-for="card in BLESSING_CARDS"
                :key="card.id"
                type="button"
                class="blessing-card"
                :style="{ '--card-tint': card.color }"
                @click="sendBlessing(card)"
              >
                <span class="blessing-card-emoji">{{ card.emoji }}</span>
                <span class="blessing-card-title">{{ card.title }}</span>
                <span class="blessing-card-text">{{ card.text }}</span>
              </button>
            </div>

            <button type="button" class="sheet-ghost" @click="showBlessingSheet = false">先不送了</button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 随缘转款 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showComfortPaycode" class="sheet-overlay sheet-overlay--center" @click.self="showComfortPaycode = false">
          <div class="sheet sheet--pay">
            <button type="button" class="sheet-close" @click="showComfortPaycode = false">
              <i class="ri-close-line"></i>
            </button>
            <p class="sheet-eyebrow">随缘转点暖</p>
            <h3 class="sheet-title">{{ comfortPayName }}</h3>
            <p class="sheet-sub">平台不经手任何资金，扫码后由你自愿完成。</p>

            <div class="pay-qr-wrap">
              <div v-if="comfortPayLoading" class="pay-qr-empty">读取收款码中…</div>
              <img v-else-if="comfortPayUrl" :src="comfortPayUrl" alt="收款码" class="pay-qr-img">
              <div v-else class="pay-qr-empty">
                <span>🌫</span>
                <p>TA 还没留下收款码</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 我的收款码 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showPayQrSetup" class="sheet-overlay sheet-overlay--center" @click.self="showPayQrSetup = false">
          <div class="sheet sheet--pay">
            <button type="button" class="sheet-close" @click="showPayQrSetup = false">
              <i class="ri-close-line"></i>
            </button>
            <p class="sheet-eyebrow">我的收款码</p>
            <h3 class="sheet-title">让愿意支持你的人找得到</h3>
            <p class="sheet-sub">只保存这张图片，不收集银行卡或身份信息。</p>

            <label class="pay-upload">
              <img v-if="myQrInput.trim()" :src="myQrInput" alt="我的收款码" class="pay-upload-preview">
              <span v-else-if="qrUploading" class="pay-upload-placeholder">上传中…</span>
              <span v-else class="pay-upload-placeholder">
                <i class="ri-image-add-line"></i>
                点击上传收款码
              </span>
              <input type="file" accept="image/*" class="hidden" @change="uploadMyQr" :disabled="qrUploading">
            </label>

            <button
              type="button"
              class="sheet-save"
              :disabled="!myQrInput.trim() || qrUploading"
              @click="saveMyQr"
            >
              保存收款码
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { showToast } from 'vant'
import http from '@/api/http'
import { getAuthItem } from '@/utils/authToken'

const props = defineProps({
  city: { type: String, default: '' },
})

const myId = Number(getAuthItem('userId')) || 0
const isBroadcasting = ref(false)
const incomingComforts = ref([])
const showPatrol = ref(false)
const patrolPatients = ref([])
let painComfortPollTimer = null

const ok = (res) => res && (res.status === 200 || res.code === 200)

const AVATAR_TINTS = [
  'linear-gradient(135deg, #fecdd3, #fda4af)',
  'linear-gradient(135deg, #fed7aa, #fdba74)',
  'linear-gradient(135deg, #ddd6fe, #c4b5fd)',
  'linear-gradient(135deg, #c7d2fe, #a5b4fc)',
  'linear-gradient(135deg, #99f6e4, #5eead4)',
]

const tintIndex = (p) => {
  const key = String(p?.name || p?.id || '0')
  let sum = 0
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return sum % AVATAR_TINTS.length
}
const avatarTint = (p) => AVATAR_TINTS[tintIndex(p)]
const avatarChar = (p) => (String(p?.name || '友').trim()[0] || '友')

const COMFORT_ACTIONS = [
  { emoji: '👀', text: '我看到了' },
  { emoji: '✊', text: '稳住' },
  { emoji: '🔥', text: '热水袋' },
  { emoji: '🥣', text: '喝点温的' },
  { emoji: '🤝', text: '隔空握手' },
  { emoji: '💪', text: '撑住这一波' },
]

const comfortActionFor = (comfort) => {
  const key = String(comfort.id || comfort.signalId || comfort.signal_id || comfort.comforterId || comfort.comforter_id || comfort.comforterName || comfort.comforter_name || '')
  let sum = 0
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return COMFORT_ACTIONS[Math.abs(sum) % COMFORT_ACTIONS.length]
}

const formatPainComfort = (comfort) => {
  const name = comfort.comforterName || comfort.comforter_name || '有人'
  const action = comfortActionFor(comfort)
  return {
    id: comfort.id || `${comfort.signalId || comfort.signal_id}-${comfort.comforterId || comfort.comforter_id}`,
    emoji: action.emoji,
    text: `${name}：${action.text}`,
  }
}

const loadReceivedPainComforts = async () => {
  try {
    const res = await http.get('/heal/pain/comforts')
    if (ok(res) && Array.isArray(res.data)) {
      incomingComforts.value = res.data.map(formatPainComfort)
    }
  } catch (e) {
    console.error('读取痛痛关心失败', e)
  }
}

const stopPainComfortPolling = () => {
  if (painComfortPollTimer) {
    clearInterval(painComfortPollTimer)
    painComfortPollTimer = null
  }
}

const startPainComfortPolling = () => {
  stopPainComfortPolling()
  loadReceivedPainComforts()
  painComfortPollTimer = setInterval(loadReceivedPainComforts, 4000)
}

const applyPainStatus = (data) => {
  isBroadcasting.value = !!data?.active
  if (Array.isArray(data?.comforts)) {
    incomingComforts.value = data.comforts.map(formatPainComfort)
  }
  if (isBroadcasting.value) startPainComfortPolling()
  else stopPainComfortPolling()
}

const loadPainStatus = async () => {
  try {
    const res = await http.get('/heal/pain/status')
    if (ok(res)) applyPainStatus(res.data)
  } catch (e) {
    console.error('读取痛痛状态失败', e)
  }
}

const triggerPainRescue = async () => {
  isBroadcasting.value = true
  incomingComforts.value = []
  try {
    const res = await http.post('/heal/pain/broadcast', { location: props.city || '远方' })
    if (ok(res)) isBroadcasting.value = true
    startPainComfortPolling()
  } catch (e) {
    console.error('痛痛呼救广播失败', e)
    isBroadcasting.value = false
  }
}

const stopPainRescue = async () => {
  try {
    const res = await http.post('/heal/pain/stop')
    if (ok(res)) applyPainStatus(res.data)
    else {
      isBroadcasting.value = false
      stopPainComfortPolling()
    }
  } catch (e) {
    console.error('停止痛痛呼救失败', e)
  }
}

const togglePainRescue = () => {
  if (isBroadcasting.value) stopPainRescue()
  else triggerPainRescue()
}

const loadPatrolSignals = async () => {
  try {
    const res = await http.get('/heal/pain/patrol')
    if (ok(res)) patrolPatients.value = res.data || []
  } catch (e) {
    console.error('拉取痛痛信号失败', e)
  }
}

const openPatrolSignal = () => {
  showPatrol.value = !showPatrol.value
  if (showPatrol.value) loadPatrolSignals()
}

const sendWarmthTo = async (p) => {
  try {
    const res = await http.post('/heal/pain/comfort', { signalId: p.id })
    if (ok(res)) {
      p.warmed = true
      loadPatrolSignals()
      showToast('动作已送出')
    }
  } catch (e) {
    console.error('陪伴失败', e)
  }
}

const BLESSING_CARDS = [
  { id: 'seen', emoji: '👀', title: '我看到了', text: '已送达', color: '#38bdf8' },
  { id: 'hold', emoji: '✊', title: '稳住', text: '撑这一波', color: '#10b981' },
  { id: 'warmbag', emoji: '🔥', title: '热水袋', text: '去敷一下', color: '#fb7185' },
  { id: 'water', emoji: '🥣', title: '喝点温的', text: '小口慢来', color: '#14b8a6' },
  { id: 'handshake', emoji: '🤝', title: '隔空握手', text: '收到', color: '#64748b' },
  { id: 'strong', emoji: '💪', title: '撑住', text: '先过关', color: '#22c55e' },
]

const showBlessingSheet = ref(false)
const blessingTarget = ref(null)

const openBlessing = (p) => {
  blessingTarget.value = p
  showBlessingSheet.value = true
}

const sendBlessing = (card) => {
  showBlessingSheet.value = false
  showToast({
    message: `${card.emoji} ${card.title} 已送出`,
    duration: 1500,
  })
}

const showComfortPaycode = ref(false)
const comfortPayUrl = ref('')
const comfortPayLoading = ref(false)
const comfortPayName = ref('TA')

const openComfortPaycode = async (p) => {
  if (!p?.userId) {
    showToast('暂时无法读取 TA 的收款信息')
    return
  }
  comfortPayName.value = p.name || 'TA'
  comfortPayUrl.value = ''
  comfortPayLoading.value = true
  showComfortPaycode.value = true
  try {
    const res = await http.get(`/team/status/paycode/${p.userId}`)
    if (ok(res)) comfortPayUrl.value = res.data || ''
  } catch (e) {
    console.error('读取收款码失败', e)
  } finally {
    comfortPayLoading.value = false
  }
}

const showPayQrSetup = ref(false)
const myQrInput = ref('')
const qrUploading = ref(false)

const openMyPayQr = () => {
  showPayQrSetup.value = true
}

const uploadMyQr = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  qrUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await http.post('/upload', fd)
    if (ok(res)) myQrInput.value = res.data
    else showToast(res.message || '上传失败')
  } catch (err) {
    showToast('上传失败，请检查网络')
  } finally {
    qrUploading.value = false
    e.target.value = ''
  }
}

const saveMyQr = async () => {
  const url = myQrInput.value.trim()
  if (!url) return
  try {
    const res = await http.post('/team/status/paycode', { url })
    if (ok(res)) {
      showToast('收款码已保存')
      showPayQrSetup.value = false
    } else {
      showToast(res.message || '保存失败')
    }
  } catch (e) {
    showToast('保存失败，请检查网络')
  }
}

onMounted(() => {
  loadPainStatus()
  if (myId) {
    http.get(`/team/status/paycode/${myId}`).then(res => {
      if (ok(res) && res.data) myQrInput.value = res.data
    }).catch(() => {})
  }
})

onUnmounted(() => {
  stopPainComfortPolling()
})
</script>

<style scoped>
/* ── 共鸣舱主体 ── */
.chamber {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  padding: 22px 20px 20px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.96)),
    radial-gradient(120% 90% at 100% 0%, rgba(20, 184, 166, 0.14) 0%, transparent 54%),
    radial-gradient(100% 80% at 0% 100%, rgba(14, 165, 233, 0.10) 0%, transparent 52%);
  border: 1px solid rgba(226, 232, 240, 0.88);
  box-shadow:
    0 20px 48px -34px rgba(15, 23, 42, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}

.chamber-aura {
  position: absolute;
  top: -60px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.14), transparent 70%);
  pointer-events: none;
}

.chamber-head {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.chamber-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #0f766e;
}

.chamber-title {
  margin: 6px 0 0;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0;
  color: #172033;
}

.chamber-qr {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(203, 213, 225, 0.72);
  color: #0f766e;
  font-size: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px -12px rgba(15, 23, 42, 0.28);
}

.chamber-desc {
  position: relative;
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: #64748b;
  font-weight: 500;
}

/* ── 主操作 ── */
.chamber-actions {
  position: relative;
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.chamber-call {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 18px;
  padding: 13px 16px;
  text-align: left;
  color: #fff;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  box-shadow: 0 14px 28px -16px rgba(239, 68, 68, 0.62);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.chamber-call:active { transform: scale(0.98); }

.chamber-call.is-live {
  background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
  box-shadow: 0 14px 28px -16px rgba(8, 145, 178, 0.54);
}

.chamber-call-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 17px;
}

.chamber-call-text {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.3;
}

.chamber-visit {
  flex-shrink: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 72px;
  border-radius: 18px;
  border: 1px solid rgba(20, 184, 166, 0.24);
  background: rgba(240, 253, 250, 0.8);
  color: #0f766e;
  font-size: 11px;
  font-weight: 700;
}

.chamber-visit i { font-size: 18px; }
.chamber-visit:active { transform: scale(0.98); }

/* ── 直播状态条 ── */
.chamber-live {
  position: relative;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(20, 184, 166, 0.22);
  display: flex;
  align-items: center;
  gap: 11px;
}

.chamber-live-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #14b8a6;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.18);
  animation: pulse-dot 1.6s ease infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.18); opacity: 0.7; }
}

.chamber-live p {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: #0f766e;
  font-weight: 600;
}

/* ── 收到的关心 ── */
.chamber-comforts {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 12px;
}

.comfort-line {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(203, 213, 225, 0.62);
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.comfort-line-emoji { font-size: 15px; flex-shrink: 0; }

/* ── 巡逻列表 ── */
.chamber-patrol {
  position: relative;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(203, 213, 225, 0.7);
}

.chamber-patrol-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #475569;
}

.patrol-empty {
  text-align: center;
  padding: 22px 12px;
}

.patrol-empty span { font-size: 26px; }

.patrol-empty p {
  margin: 10px 0 0;
  font-size: 12.5px;
  color: #64748b;
  font-weight: 600;
}

.signal {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
}

.signal + .signal {
  border-top: 1px solid rgba(203, 213, 225, 0.65);
}

.signal-avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}

.signal-body {
  flex: 1;
  min-width: 0;
}

.signal-name {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #172033;
}

.signal-sign {
  margin: 2px 0 0;
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.signal-links {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}

.signal-link {
  border: 0;
  background: none;
  padding: 0;
  font-size: 11.5px;
  font-weight: 700;
  color: #0f766e;
}

.signal-link:active { opacity: 0.6; }

.signal-dot { color: rgba(148, 163, 184, 0.7); }

.signal-warm {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  font-size: 19px;
  background: linear-gradient(135deg, #0f766e, #0891b2);
  box-shadow: 0 10px 20px -12px rgba(8, 145, 178, 0.58);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s ease;
}

.signal-warm:active { transform: scale(0.94); }

.signal-warm.is-done {
  background: linear-gradient(135deg, #6ee7b7, #34d399);
  box-shadow: none;
}

/* ── 底部弹层通用 ── */
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(60, 30, 24, 0.34);
  backdrop-filter: blur(8px);
}

.sheet-overlay--center {
  align-items: center;
  padding: 24px;
}

.sheet {
  width: 100%;
  position: relative;
}

.sheet--blessing {
  max-width: 520px;
  background: linear-gradient(180deg, #fffaf6 0%, #fff5f3 100%);
  border-radius: 28px 28px 0 0;
  padding: 12px 20px calc(env(safe-area-inset-bottom, 8px) + 24px);
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 -20px 50px -30px rgba(120, 53, 15, 0.3);
}

.sheet--pay {
  max-width: 340px;
  background: linear-gradient(165deg, #f8fafc 0%, #fff 62%, #f0fdfa 100%);
  border-radius: 28px;
  padding: 26px 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 26px 60px -30px rgba(15, 23, 42, 0.34);
}

.sheet-handle {
  width: 40px;
  height: 5px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  margin: 0 auto 18px;
}

.sheet-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: #475569;
  font-size: 18px;
}

.sheet-eyebrow {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #0f766e;
}

.sheet-title {
  margin: 8px 0 0;
  text-align: center;
  font-size: 19px;
  font-weight: 800;
  color: #172033;
}

.sheet-sub {
  margin: 7px 0 0;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.45;
  color: #64748b;
  font-weight: 500;
}

/* ── 动作卡 ── */
.blessing-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
  margin-top: 20px;
}

.blessing-card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 16px 15px;
  text-align: left;
  background: #fff;
  border: 1px solid rgba(203, 213, 225, 0.72);
  box-shadow: 0 12px 26px -22px rgba(15, 23, 42, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.blessing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-tint);
}

.blessing-card::after {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: var(--card-tint);
  opacity: 0.12;
  pointer-events: none;
}

.blessing-card:active {
  transform: scale(0.97);
  box-shadow: 0 8px 18px -16px rgba(15, 23, 42, 0.36);
}

.blessing-card-emoji {
  display: block;
  font-size: 24px;
  margin-bottom: 9px;
}

.blessing-card-title {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  color: #172033;
}

.blessing-card-text {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  line-height: 1.35;
  color: #64748b;
  font-weight: 500;
}

.sheet-ghost {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 16px;
  padding: 13px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(15, 23, 42, 0.06);
  color: #475569;
}

/* ── 收款码 ── */
.pay-qr-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pay-qr-img,
.pay-qr-empty {
  width: 220px;
  height: 220px;
  border-radius: 22px;
}

.pay-qr-img {
  object-fit: contain;
  background: #fff;
  border: 1px solid rgba(203, 213, 225, 0.82);
  padding: 10px;
}

.pay-qr-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.pay-qr-empty span { font-size: 28px; }

.pay-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  margin: 20px auto 0;
  border-radius: 22px;
  border: 1px dashed rgba(148, 163, 184, 0.55);
  background: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  cursor: pointer;
}

.pay-upload-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pay-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: #0f766e;
  padding: 12px;
  text-align: center;
}

.pay-upload-placeholder i { font-size: 24px; }

.sheet-save {
  width: 100%;
  margin-top: 20px;
  border: 0;
  border-radius: 16px;
  padding: 14px;
  font-size: 13.5px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #0f766e, #0891b2);
  box-shadow: 0 12px 24px -14px rgba(8, 145, 178, 0.55);
}

.sheet-save:disabled {
  background: rgba(148, 163, 184, 0.16);
  color: #94a3b8;
  box-shadow: none;
}

/* ── 过渡 ── */
.soft-enter-active,
.soft-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease;
}

.soft-enter-from,
.soft-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.26s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(20px);
  transition: transform 0.26s ease;
}
</style>
