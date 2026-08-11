<template>
  <div v-if="mode === 'home'" class="jm-home" :class="resolvedTone">
    <div class="jm-home-copy">
      <span class="jm-kicker">{{ homeKicker }}</span>
      <p class="jm-home-line">{{ homeText }}</p>
      <span class="jm-home-note">{{ homeNote }}</span>
    </div>
    <div class="jm-home-art" aria-hidden="true">
      <span class="jm-halo"></span>
      <img :src="portrait" alt="" />
    </div>
  </div>

  <div v-else-if="mode === 'idle'" class="jm-idle" :class="resolvedTone">
    <div class="jm-idle-avatar"><img :src="portrait" alt="" /></div>
    <p class="jm-idle-line">{{ homeText }}</p>
  </div>

  <div v-else class="jm-stage" :class="resolvedTone">
    <div class="jm-stage-light"></div>
    <img :src="portrait" :key="resolvedTone" class="jm-portrait" alt="" />
    <div class="jm-dialogue">
      <span class="jm-dialogue-mark"><i :class="toneIconClass"></i></span>
      <div>
        <span class="jm-name">{{ stageName }}</span>
        <p class="jm-line">{{ shown }}<span class="jm-caret" v-show="typing">丨</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  tone: { type: String, default: 'calm' },
  mode: { type: String, default: 'idle' }, // idle | home | stage
  line: { type: String, default: '' },
})

const PORTRAITS = {
  bright: '/media/journal-companion/bright.webp',
  calm: '/media/journal-companion/normal.webp',
  dark: '/media/journal-companion/comfort.webp',
}

const IDLE_LINES = {
  morning: ['早呀。今天想留下哪一刻？', '我在这里，慢慢想就好。'],
  afternoon: ['今天过得怎么样？我听着。', '不用写很多，一句话也会被好好留下。'],
  evening: ['辛苦一天啦。有什么想留住的吗？', '亮的、平常的、暗的，都可以告诉我。'],
  night: ['还没睡呀？我陪你记完这一刻。', '说不上来也没关系，我在这里。'],
}
const TONE_LINES = {
  bright: ['是什么让你眼睛亮起来了？', '快告诉我，我也想分到一点开心。'],
  calm: ['平常的一刻，也值得被看见。', '想到什么就写什么，我认真听。'],
  dark: ['不用把话说得漂亮，我会接住。', '难受的话就慢慢写，我不会催你。'],
}
const HOME_NOTES = {
  bright: '这份开心，我和你一起收好',
  calm: '没有大事发生，也可以留下来',
  dark: '不评价、不催你，只陪你记下',
}
const NAMES = { bright: '为你开心', calm: '我在听', dark: '陪着你' }

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const timeBucket = () => {
  const h = new Date().getHours()
  if (h < 6) return 'night'
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  if (h < 23) return 'evening'
  return 'night'
}

const resolvedTone = computed(() => ['bright', 'calm', 'dark'].includes(props.tone) ? props.tone : 'calm')
const portrait = computed(() => PORTRAITS[resolvedTone.value])
const stageName = computed(() => NAMES[resolvedTone.value])
const toneIconClass = computed(() => resolvedTone.value === 'dark' ? 'ri-moon-line' : resolvedTone.value === 'bright' ? 'ri-sun-line' : 'ri-cloud-line')
const homeKicker = computed(() => resolvedTone.value === 'bright' ? '刚刚那份开心' : resolvedTone.value === 'dark' ? '刚刚那份难受' : '今天这一刻')
const homeNote = computed(() => HOME_NOTES[resolvedTone.value])
const idleLine = ref(pick(IDLE_LINES[timeBucket()] || IDLE_LINES.afternoon))
const homeText = computed(() => props.line || idleLine.value)

const shown = ref('')
const typing = ref(false)
let typeTimer = null
const stopTyping = () => {
  if (typeTimer) clearInterval(typeTimer)
  typeTimer = null
  typing.value = false
}
const typeLine = (text) => {
  stopTyping()
  shown.value = ''
  typing.value = true
  let i = 0
  typeTimer = setInterval(() => {
    i += 1
    shown.value = text.slice(0, i)
    if (i >= text.length) stopTyping()
  }, 34)
}
const rollStage = () => typeLine(props.line || pick(TONE_LINES[resolvedTone.value]))

if (props.mode === 'stage') rollStage()
watch(() => [props.tone, props.mode, props.line], () => {
  if (props.mode === 'stage') rollStage()
})
onBeforeUnmount(stopTyping)
</script>

<style scoped>
.jm-home {
  --jm-accent: #8f7568;
  --jm-soft: #f3e7df;
  position: relative;
  min-height: 218px;
  overflow: hidden;
  border: 1px solid rgba(103, 76, 61, 0.09);
  border-radius: 30px;
  background:
    radial-gradient(circle at 78% 18%, rgba(255,255,255,.96), transparent 31%),
    linear-gradient(145deg, #fffdf9 0%, #f8f1eb 100%);
  box-shadow: 0 24px 50px -38px rgba(70, 43, 30, .42);
}
.jm-home.bright { --jm-accent: #b97926; --jm-soft: #fff0c8; background: radial-gradient(circle at 78% 18%, #fff9e8, transparent 32%), linear-gradient(145deg, #fffdf7, #fff1d5); }
.jm-home.dark { --jm-accent: #715878; --jm-soft: #ebe0ec; background: radial-gradient(circle at 78% 18%, #faf5fb, transparent 32%), linear-gradient(145deg, #fcf9f6, #eee6ef); }
.jm-home-copy { position: relative; z-index: 2; width: 59%; padding: 26px 0 24px 22px; }
.jm-kicker { display: inline-flex; color: var(--jm-accent); font-size: 10px; font-weight: 900; letter-spacing: .14em; }
.jm-home-line { margin: 12px 0 0; color: #352824; font-family: Georgia, "Noto Serif SC", serif; font-size: 19px; font-weight: 800; line-height: 1.58; }
.jm-home-note { display: block; margin-top: 14px; color: #9a8980; font-size: 10.5px; font-weight: 700; line-height: 1.5; }
.jm-home-art { position: absolute; z-index: 1; top: 3px; right: -14px; bottom: -5px; width: 49%; display: flex; justify-content: center; align-items: flex-end; }
.jm-home-art img { position: relative; z-index: 2; height: 104%; max-width: none; object-fit: contain; object-position: bottom center; filter: drop-shadow(0 18px 16px rgba(86, 54, 65, .15)); animation: jm-breathe 4.8s ease-in-out infinite; }
.jm-halo { position: absolute; z-index: 0; width: 145px; height: 145px; bottom: 22px; border-radius: 50%; background: var(--jm-soft); filter: blur(2px); opacity: .88; }
@keyframes jm-breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-3px) scale(1.008); } }

.jm-idle { display: flex; align-items: center; gap: 9px; width: fit-content; max-width: 100%; padding: 5px 12px 5px 5px; border: 1px solid rgba(65,44,34,.07); border-radius: 999px; background: rgba(255,255,255,.82); box-shadow: 0 12px 28px -22px rgba(54,39,31,.4); }
.jm-idle-avatar { width: 36px; height: 36px; overflow: hidden; flex: 0 0 auto; border-radius: 50%; background: #f5ece7; }
.jm-idle-avatar img { width: 100%; height: 130%; object-fit: cover; object-position: center 8%; }
.jm-idle-line { overflow: hidden; color: #54433a; font-size: 12px; font-weight: 750; text-overflow: ellipsis; white-space: nowrap; }

.jm-stage { --jm-stage: #eaded8; position: relative; width: 100%; height: 100%; overflow: hidden; background: linear-gradient(180deg, #fffaf6 0%, var(--jm-stage) 100%); }
.jm-stage.bright { --jm-stage: #f8e7bd; }
.jm-stage.dark { --jm-stage: #ded2df; }
.jm-stage-light { position: absolute; left: 50%; bottom: 6%; width: 220px; height: 220px; border-radius: 50%; transform: translateX(-50%); background: rgba(255,255,255,.62); filter: blur(2px); }
.jm-portrait { position: absolute; left: 50%; bottom: -6px; height: 104%; max-width: none; transform: translateX(-50%); object-fit: contain; object-position: bottom center; filter: drop-shadow(0 20px 20px rgba(72,49,57,.17)); animation: jm-stage-in .35s ease both; }
@keyframes jm-stage-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } }
.jm-dialogue { position: absolute; z-index: 3; left: 12px; right: 12px; bottom: 32px; display: grid; grid-template-columns: 34px 1fr; gap: 9px; align-items: start; padding: 10px 12px; border: 1px solid rgba(85,62,53,.08); border-radius: 16px; background: rgba(255,253,250,.92); box-shadow: 0 14px 30px -22px rgba(55,34,26,.5); backdrop-filter: blur(14px); }
.jm-dialogue-mark { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 12px; background: #f2e6e0; color: #8b675b; }
.jm-name { color: #92756a; font-size: 10px; font-weight: 900; letter-spacing: .1em; }
.jm-line { min-height: 1.4em; margin-top: 2px; color: #3d2f2a; font-size: 12.5px; font-weight: 700; line-height: 1.45; }
.jm-caret { animation: jm-blink .8s step-end infinite; }
@keyframes jm-blink { 50% { opacity: 0; } }
</style>
