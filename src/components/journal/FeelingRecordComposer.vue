<template>
  <Teleport to="body">
    <transition name="feeling-sheet">
      <div v-if="show" class="feeling-mask" @click.self="requestClose">
        <section class="feeling-sheet" :class="moodStage.className">
          <header class="feeling-portrait">
            <div class="feeling-light"></div>
            <img :src="moodStage.image" alt="" />
            <button type="button" class="feeling-close" aria-label="关闭" @click="requestClose">
              <i class="ri-close-line"></i>
            </button>
            <div class="feeling-greeting">
              <span>此刻心情 {{ moodScore }} / 10</span>
              <strong>{{ moodStage.greeting }}</strong>
            </div>
          </header>

          <div class="feeling-paper">
            <div class="feeling-heading">
              <div>
                <p>JUST THIS MOMENT</p>
                <h2>留下这一刻</h2>
              </div>
              <time>{{ dateLabel }}</time>
            </div>

            <section class="mood-score">
              <div class="mood-score-head">
                <span>心情打几分？</span>
                <strong>{{ moodScore }}<small>/ 10</small></strong>
              </div>
              <input v-model.number="moodScore" type="range" min="0" max="10" step="1" aria-label="心情评分，0到10分" />
              <div class="mood-score-scale"><span>很糟</span><span>普通</span><span>很好</span></div>
            </section>

            <input
              v-model="title"
              class="moment-title-input"
              maxlength="80"
              placeholder="标题"
              autofocus
            />

            <textarea
              v-model="content"
              class="moment-input"
              placeholder="您此刻在想啥？记录吧！"
              rows="7"
            ></textarea>

            <div v-if="images.length" class="moment-images">
              <div v-for="(image, index) in images" :key="image.id" class="moment-image" :class="{ pending: image.uploading, failed: image.error }">
                <img :src="image.previewUrl || image.url" alt="记录图片" />
                <span v-if="image.uploading"><i class="ri-loader-4-line"></i></span>
                <span v-else-if="image.error">上传失败</span>
                <button type="button" aria-label="移除图片" @click="removeImage(index)"><i class="ri-close-line"></i></button>
              </div>
            </div>

            <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFiles" />

            <div class="feeling-tools">
              <button type="button" @click="pickImages" :disabled="uploading || images.length >= 6">
                <i class="ri-image-add-line"></i>
                <span>图片</span>
              </button>
              <span class="optional-note">全都选填，想写多少都行</span>
            </div>

            <button type="button" class="save-moment" :disabled="!canSave || saving || uploading" @click="saveMoment">
              <i :class="saving ? 'ri-loader-4-line spinning' : 'ri-quill-pen-line'"></i>
              {{ saving ? '正在收好…' : '收好这一刻' }}
            </button>
            <p v-if="errorMessage" class="save-error">{{ errorMessage }}</p>
          </div>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import http from '@/api/http'

const props = defineProps({
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'saved'])

const moodStages = [
  {
    max: 1,
    image: '/media/journal-companion/mood-5.webp',
    className: 'mood-5',
    greeting: '很难受也没关系，我先陪你待着。'
  },
  {
    max: 3,
    image: '/media/journal-companion/mood-4.webp',
    className: 'mood-4',
    greeting: '看起来有点难熬，慢慢写。'
  },
  {
    max: 5,
    image: '/media/journal-companion/mood-3.webp',
    className: 'mood-3',
    greeting: '今天有些安静，我在听。'
  },
  {
    max: 7,
    image: '/media/journal-companion/mood-2.webp',
    className: 'mood-2',
    greeting: '好像有一点开心了，讲给我听。'
  },
  {
    max: 10,
    image: '/media/journal-companion/mood-1.webp',
    className: 'mood-1',
    greeting: '今天真不错，把这份开心收好。'
  }
]

const moodScore = ref(5)
const title = ref('')
const content = ref('')
const saving = ref(false)
const uploading = ref(false)
const errorMessage = ref('')
const images = ref([])
const fileInput = ref(null)

const moodStage = computed(() => moodStages.find(stage => moodScore.value <= stage.max) || moodStages[moodStages.length - 1])
const tone = computed(() => moodScore.value >= 8 ? 'bright' : moodScore.value <= 3 ? 'dark' : 'calm')
const moodValue = computed(() => `心情 ${moodScore.value}/10`)
const dateLabel = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日`
})
const readyImages = computed(() => images.value.map(image => image.url).filter(Boolean))
const canSave = computed(() => Boolean(title.value.trim() || content.value.trim() || readyImages.value.length || moodScore.value !== 5))

const releaseImages = () => {
  images.value.forEach(image => {
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl)
  })
  images.value = []
}

const reset = () => {
  moodScore.value = 5
  title.value = ''
  content.value = ''
  errorMessage.value = ''
  releaseImages()
}

watch(() => props.show, (show, wasShown) => {
  if (show && !wasShown) reset()
})

const requestClose = () => {
  if (saving.value || uploading.value) return
  emit('close')
}

const pickImages = () => fileInput.value?.click()

const createImages = (files) => Array.from(files || [])
  .filter(file => file?.type?.startsWith('image/'))
  .slice(0, Math.max(0, 6 - images.value.length))
  .map(file => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    url: '',
    uploading: true,
    error: false
  }))

const uploadImage = async (image) => {
  const form = new FormData()
  form.append('file', image.file)
  const response = await http.post('/upload', form, {
    timeout: 120000,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  if ((response?.status === 200 || response?.code === 200) && response.data) return response.data
  throw new Error(response?.message || '图片上传失败')
}

const handleFiles = async (event) => {
  const added = createImages(event.target.files)
  event.target.value = ''
  if (!added.length) return
  images.value.push(...added)
  uploading.value = true
  errorMessage.value = ''
  try {
    await Promise.all(added.map(async (image) => {
      try {
        image.url = await uploadImage(image)
        image.uploading = false
      } catch (error) {
        image.uploading = false
        image.error = true
        console.error('感想图片上传失败', error)
      }
    }))
    if (added.every(image => image.error)) errorMessage.value = '图片没传上，可以移除后再试。'
  } finally {
    uploading.value = false
  }
}

const removeImage = (index) => {
  const [removed] = images.value.splice(index, 1)
  if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
}

const saveMoment = async () => {
  if (!canSave.value || saving.value || uploading.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const response = await http.post('/dance/entry', {
      title: title.value.trim() || `心情 ${moodScore.value}/10`,
      content: content.value.trim() || (readyImages.value.length ? '图片记录' : `今天的心情是 ${moodScore.value}/10`),
      mood: moodValue.value,
      statusText: '',
      imagesJson: JSON.stringify(readyImages.value),
      tone: tone.value,
      ai: 'false'
    }, { timeout: 30000 })

    if (response?.status !== 200 && response?.code !== 200) {
      throw new Error(response?.message || '这一刻暂时没存上')
    }

    emit('saved', response.data)
    emit('close')
  } catch (error) {
    console.error('保存感想失败', error)
    errorMessage.value = error?.message || '这一刻暂时没存上，文字还在。'
  } finally {
    saving.value = false
  }
}

onBeforeUnmount(releaseImages)
</script>

<style scoped>
.feeling-mask { position: fixed; inset: 0; z-index: 650; display: flex; align-items: flex-end; justify-content: center; background: rgba(25, 25, 30, .58); backdrop-filter: blur(7px); }
.feeling-sheet { --accent: #9a7569; --soft: #efe3dd; width: 100%; max-width: 460px; max-height: 94dvh; overflow-y: auto; border-radius: 32px 32px 0 0; background: #fffdf9; box-shadow: 0 -18px 70px rgba(20, 16, 14, .25); }
.feeling-sheet.mood-1 { --accent: #c4782e; --soft: #ffe7c8; }
.feeling-sheet.mood-2 { --accent: #bf795e; --soft: #f6ddd4; }
.feeling-sheet.mood-3 { --accent: #8c7184; --soft: #eadfe8; }
.feeling-sheet.mood-4 { --accent: #766074; --soft: #e1d6df; }
.feeling-sheet.mood-5 { --accent: #655267; --soft: #d9ceda; }
.feeling-portrait { position: relative; height: 190px; overflow: hidden; background: linear-gradient(145deg, #fffaf5, var(--soft)); }
.feeling-light { position: absolute; right: 4%; bottom: -35%; width: 230px; height: 230px; border-radius: 50%; background: rgba(255,255,255,.66); }
.feeling-portrait img { position: absolute; right: 3%; bottom: -8px; height: 108%; max-width: 58%; object-fit: contain; object-position: bottom center; filter: drop-shadow(0 18px 18px rgba(73, 48, 56, .16)); }
.feeling-close { position: absolute; z-index: 3; top: 14px; right: 14px; width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid rgba(80,60,50,.08); border-radius: 50%; background: rgba(255,255,255,.76); color: #766861; font-size: 19px; backdrop-filter: blur(10px); }
.feeling-greeting { position: absolute; z-index: 2; left: 22px; bottom: 30px; width: 54%; }
.feeling-greeting span { display: block; color: var(--accent); font-size: 10px; font-weight: 900; letter-spacing: .13em; }
.feeling-greeting strong { display: block; margin-top: 8px; color: #392c27; font-family: Georgia, "Noto Serif SC", serif; font-size: 20px; line-height: 1.45; }
.feeling-paper { position: relative; margin-top: -18px; padding: 22px 20px calc(18px + env(safe-area-inset-bottom)); border-radius: 28px 28px 0 0; background: #fffdf9; }
.feeling-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.feeling-heading p { color: var(--accent); font-size: 9px; font-weight: 900; letter-spacing: .18em; }
.feeling-heading h2 { margin-top: 3px; color: #302521; font-family: Georgia, "Noto Serif SC", serif; font-size: 24px; font-weight: 900; }
.feeling-heading time { color: #aa9c95; font-size: 11px; font-weight: 800; }
.mood-score { margin-top: 15px; padding: 12px 14px 10px; border: 1px solid #eee7e3; border-radius: 16px; background: rgba(255,255,255,.8); }
.mood-score-head { display: flex; align-items: center; justify-content: space-between; color: #786a63; font-size: 11px; font-weight: 850; }
.mood-score-head strong { color: var(--accent); font-family: Georgia, serif; font-size: 24px; line-height: 1; }
.mood-score-head small { margin-left: 2px; color: #aa9c95; font-family: inherit; font-size: 10px; }
.mood-score input { width: 100%; height: 5px; margin-top: 12px; border-radius: 999px; accent-color: var(--accent); }
.mood-score-scale { display: flex; justify-content: space-between; margin-top: 6px; color: #b3a8a1; font-size: 9px; font-weight: 750; }
.moment-title-input { width: 100%; margin-top: 14px; padding: 14px 2px 10px; border: 0; outline: none; color: #352925; background: transparent; font-family: Georgia, "Noto Serif SC", serif; font-size: 21px; font-weight: 850; line-height: 1.4; }
.moment-title-input::placeholder { color: #c4b7b0; font-weight: 700; }
.moment-input { width: 100%; min-height: 148px; margin-top: 2px; padding: 12px 2px 15px; resize: none; border: 0; border-top: 1px solid #eee9e5; border-bottom: 1px solid #eee9e5; outline: none; color: #3b302b; background: transparent; font-family: Georgia, "Noto Serif SC", serif; font-size: 16px; font-weight: 650; line-height: 1.85; }
.moment-input::placeholder { color: #c1b7b1; font-weight: 600; }
.moment-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 12px; }
.moment-image { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: 13px; background: #eee8e4; }
.moment-image img { width: 100%; height: 100%; object-fit: cover; }
.moment-image > span { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; background: rgba(25,20,18,.48); font-size: 10px; font-weight: 850; }
.moment-image.pending > span i { font-size: 21px; animation: spin 1s linear infinite; }
.moment-image > button { position: absolute; top: 5px; right: 5px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: rgba(25,20,18,.6); font-size: 13px; }
.feeling-tools { display: flex; align-items: center; gap: 7px; margin-top: 13px; }
.feeling-tools > button { height: 36px; display: inline-flex; align-items: center; gap: 5px; padding: 0 11px; border: 1px solid #ebe5e1; border-radius: 11px; color: #766861; background: #fff; font-size: 11px; font-weight: 850; }
.feeling-tools > button.active { color: var(--accent); border-color: var(--soft); background: var(--soft); }
.feeling-tools > button:disabled { opacity: .42; }
.optional-note { margin-left: auto; color: #b2a7a0; font-size: 9.5px; font-weight: 700; }
.save-moment { width: 100%; min-height: 50px; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 7px; border-radius: 16px; color: #fff; background: #26211f; font-size: 14px; font-weight: 900; box-shadow: 0 16px 26px -20px rgba(36,29,26,.8); }
.save-moment:disabled { opacity: .35; }
.save-error { margin-top: 8px; color: #b85a56; font-size: 11px; font-weight: 750; text-align: center; }
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.feeling-sheet-enter-active,.feeling-sheet-leave-active { transition: opacity .25s ease; }
.feeling-sheet-enter-active .feeling-sheet,.feeling-sheet-leave-active .feeling-sheet { transition: transform .32s cubic-bezier(.32,.72,0,1); }
.feeling-sheet-enter-from,.feeling-sheet-leave-to { opacity: 0; }
.feeling-sheet-enter-from .feeling-sheet,.feeling-sheet-leave-to .feeling-sheet { transform: translateY(100%); }
</style>
