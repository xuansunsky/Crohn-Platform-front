<template>
  <Teleport to="body">
    <transition name="petchat-fade">
      <div class="petchat-mask" @click.self="close">
        <div class="petchat-sheet">
          <header class="petchat-head">
            <div class="petchat-head-avatar"><img :src="portrait" alt="" /></div>
            <div class="petchat-head-text">
              <p class="petchat-head-name">魔物萌娘</p>
              <p class="petchat-head-sub">{{ streaming ? '正在说...' : '陪着你' }}</p>
            </div>
            <button type="button" class="petchat-close" @click="close"><i class="ri-close-line"></i></button>
          </header>

          <div ref="scrollBox" class="petchat-scroll">
            <div v-if="loading" class="petchat-empty">正在拿回你们之前聊的...</div>
            <div v-else-if="!messages.length" class="petchat-empty">跟她说句话吧，她一直在等你</div>
            <div v-for="m in messages" :key="m.id" class="petchat-msg" :class="m.sender === 'me' ? 'me' : 'ai'">
              <div class="petchat-bubble">{{ m.content }}</div>
            </div>
            <div v-if="thinking" class="petchat-msg ai">
              <div class="petchat-bubble petchat-typing"><span></span><span></span><span></span></div>
            </div>
          </div>

          <div class="petchat-input">
            <textarea
              v-model="draft"
              class="petchat-textarea"
              :placeholder="streaming ? '她正在回复...' : '想跟她说点什么'"
              rows="1"
              @keydown.enter.exact.prevent="send"
            ></textarea>
            <button type="button" class="petchat-send" :class="{ stop: streaming }" :disabled="!streaming && !draft.trim()" @click="send">
              <i v-if="streaming" class="ri-stop-fill"></i>
              <i v-else class="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import http from '@/api/http'

defineProps({
  portrait: { type: String, default: '' },
  moodTag: { type: String, default: 'calm' },
})
const emit = defineEmits(['close'])
const close = () => emit('close')

const ok = (res) => res && (res.status === 200 || res.code === 200)

const messages = ref([])
const loading = ref(false)
const draft = ref('')
const thinking = ref(false)
const streaming = ref(false)
const scrollBox = ref(null)
let msgSeq = 1
let currentAbort = null
let currentStreamId = null

const scrollToBottom = () => {
  nextTick(() => {
    const el = scrollBox.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const loadMessages = async () => {
  loading.value = true
  try {
    const res = await http.get('/pet/messages', { params: { limit: 60 }, timeout: 15000 })
    if (ok(res) && Array.isArray(res.data)) {
      messages.value = res.data.map((m) => ({ id: `s${m.id}`, sender: m.sender, content: m.content }))
    }
  } catch (e) {
    // 拉不到历史也不影响继续新聊，安静失败
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const stopStreaming = async () => {
  if (currentAbort) currentAbort.abort()
  if (currentStreamId) {
    try { await http.post('/pet/chat/stop', null, { params: { streamId: currentStreamId } }) } catch (e) { /* ignore */ }
  }
  streaming.value = false
  thinking.value = false
}

const send = async () => {
  if (streaming.value) { stopStreaming(); return }
  const text = draft.value.trim()
  if (!text || thinking.value) return
  draft.value = ''
  messages.value.push({ id: `l${msgSeq++}`, sender: 'me', content: text })
  scrollToBottom()
  thinking.value = true
  streaming.value = true

  const streamId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  currentStreamId = streamId
  let aiIndex = -1
  const ensureAiIndex = () => {
    if (aiIndex !== -1) return aiIndex
    messages.value.push({ id: `l${msgSeq++}`, sender: 'ai', content: '' })
    aiIndex = messages.value.length - 1
    thinking.value = false
    scrollToBottom()
    return aiIndex
  }

  const controller = new AbortController()
  currentAbort = controller
  try {
    const token = (await import('@/utils/authToken')).getValidToken()
    const base = http.defaults.baseURL || ''
    const params = new URLSearchParams({ content: text, streamId })
    const resp = await fetch(`${base}/pet/chat/stream?${params.toString()}`, {
      headers: { Authorization: 'Bearer ' + token },
      signal: controller.signal,
    })
    if (!resp.ok || !resp.body) throw new Error('连接失败')

    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    const handleBlock = (block) => {
      let eventName = 'message'
      const dataLines = []
      for (const raw of block.split('\n')) {
        if (raw.startsWith('event:')) eventName = raw.slice(6).trim()
        else if (raw.startsWith('data:')) dataLines.push(raw.slice(5).replace(/^ /, ''))
      }
      if (!dataLines.length) return
      const dataStr = dataLines.join('\n')
      let payload = ''
      try { payload = JSON.parse(dataStr).t || '' } catch { payload = dataStr }
      if (eventName === 'token') {
        const idx = ensureAiIndex()
        messages.value[idx].content += payload
        scrollToBottom()
      } else if (eventName === 'done') {
        streaming.value = false
        thinking.value = false
      }
    }
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let sep
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        handleBlock(buffer.slice(0, sep))
        buffer = buffer.slice(sep + 2)
      }
    }
    if (buffer.trim()) handleBlock(buffer)
    if (aiIndex === -1) { const idx = ensureAiIndex(); messages.value[idx].content = '我在呢，一直都在。' }
  } catch (e) {
    if (e.name !== 'AbortError') {
      const idx = ensureAiIndex()
      if (!messages.value[idx].content) messages.value[idx].content = '我这边没接稳，不过我一直都在你身边呀。'
    }
  } finally {
    thinking.value = false
    streaming.value = false
    currentStreamId = null
    currentAbort = null
    scrollToBottom()
  }
}

onMounted(loadMessages)
onUnmounted(() => { if (currentAbort) currentAbort.abort() })
</script>

<style scoped>
.petchat-mask {
  position: fixed; inset: 0; z-index: 960; background: rgba(6,5,10,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
}
.petchat-sheet {
  width: 100%; max-width: 460px; height: min(78vh, 640px);
  display: flex; flex-direction: column; border-radius: 26px 26px 0 0; overflow: hidden;
  background: linear-gradient(165deg, #221b2c 0%, #17131f 70%, #100d16 100%);
  box-shadow: 0 -24px 60px -24px rgba(0,0,0,0.6);
}
.petchat-head { display: flex; align-items: center; gap: 11px; padding: 16px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.petchat-head-avatar { width: 38px; height: 38px; border-radius: 999px; overflow: hidden; flex-shrink: 0; background: #3a2f4a; }
.petchat-head-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center 8%; }
.petchat-head-text { flex: 1; min-width: 0; }
.petchat-head-name { margin: 0; font-size: 14.5px; font-weight: 900; color: #f3ecff; }
.petchat-head-sub { margin: 2px 0 0; font-size: 11px; font-weight: 700; color: rgba(243,236,255,0.5); }
.petchat-close { width: 30px; height: 30px; border-radius: 999px; display: flex; align-items: center; justify-content: center; color: #d8cdf0; background: rgba(255,255,255,0.08); font-size: 17px; flex-shrink: 0; }

.petchat-scroll { flex: 1; overflow-y: auto; padding: 16px 14px; }
.petchat-empty { text-align: center; margin-top: 30px; font-size: 12.5px; color: rgba(243,236,255,0.4); font-weight: 650; }

.petchat-msg { display: flex; margin-bottom: 12px; }
.petchat-msg.me { justify-content: flex-end; }
.petchat-msg.ai { justify-content: flex-start; }
.petchat-bubble {
  max-width: 78%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.6; font-weight: 550;
  word-break: break-word; white-space: pre-wrap;
}
.petchat-msg.me .petchat-bubble { background: linear-gradient(135deg, #f6d365, #fda085); color: #2b2010; border-radius: 4px 16px 16px 16px; }
.petchat-msg.ai .petchat-bubble { background: rgba(255,255,255,0.09); color: #f3ecff; border-radius: 16px 16px 16px 4px; border: 1px solid rgba(255,255,255,0.06); }
.petchat-typing { display: flex; gap: 5px; align-items: center; }
.petchat-typing span { width: 6px; height: 6px; border-radius: 50%; background: rgba(243,236,255,0.5); animation: petchat-blink 1.2s infinite; }
.petchat-typing span:nth-child(2) { animation-delay: 0.2s; }
.petchat-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes petchat-blink { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }

.petchat-input { display: flex; align-items: flex-end; gap: 9px; padding: 12px 14px calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,0.06); }
.petchat-textarea {
  flex: 1; max-height: 110px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
  padding: 10px 13px; color: #f3ecff; font-size: 14px; line-height: 1.5; font-weight: 550; outline: none; resize: none; font-family: inherit;
}
.petchat-textarea::placeholder { color: rgba(243,236,255,0.35); }
.petchat-send {
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #2b2010; font-size: 17px; background: linear-gradient(135deg, #fde68a, #f6c453); box-shadow: 0 10px 22px -14px rgba(217,160,50,0.7);
}
.petchat-send:disabled { opacity: 0.4; }
.petchat-send.stop { color: #fff; background: linear-gradient(135deg, #ef4444, #dc2626); }

.petchat-fade-enter-active, .petchat-fade-leave-active { transition: opacity 0.24s ease; }
.petchat-fade-enter-from, .petchat-fade-leave-to { opacity: 0; }
.petchat-fade-enter-active .petchat-sheet, .petchat-fade-leave-active .petchat-sheet { transition: transform 0.28s cubic-bezier(0.22,1,0.36,1); }
.petchat-fade-enter-from .petchat-sheet, .petchat-fade-leave-to .petchat-sheet { transform: translateY(100%); }
</style>
