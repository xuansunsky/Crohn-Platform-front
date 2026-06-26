<template>
  <transition name="fade-up">
    <div
      v-if="show"
      class="fixed inset-0 z-[170] bg-slate-900/55 backdrop-blur-md flex flex-col justify-end"
      @click.self="$emit('close')"
    >
      <div
        class="profile-sheet-panel relative rounded-t-[34px] max-h-[82vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]"
        :style="profileThemeVars"
        @click.stop
      >
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

        <header class="profile-sheet-header relative shrink-0 px-6 pt-8 pb-8 overflow-hidden">
          <div v-if="user?.profileCover" class="absolute inset-0 pointer-events-none">
            <img :src="user.profileCover" class="w-full h-full object-cover opacity-75">
            <div class="profile-cover-fade absolute inset-0"></div>
          </div>
          <div class="relative z-10 flex justify-between items-start gap-3">
            <div class="flex items-center gap-4 min-w-0">
              <img :src="avatarOf(user, user?.userId)" class="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md bg-slate-100">
              <div class="min-w-0">
                <div class="flex items-center gap-2 min-w-0">
                  <h2 class="text-[23px] font-black text-slate-950 tracking-tight truncate">{{ displayName }}</h2>
                  <button
                    v-if="canRemark"
                    @click="$emit('edit-remark')"
                    class="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 active:scale-95 transition-all"
                  >
                    {{ remark ? '改备注' : '+备注' }}
                  </button>
                </div>
                <p v-if="remark" class="text-[11px] text-slate-400 font-bold mt-0.5 truncate">昵称：{{ user?.nickname }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span v-if="isVerified" class="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                    <i class="ri-shield-check-fill"></i> 病情已认证
                  </span>
                  <span v-else class="text-[10px] font-black text-slate-500 bg-white/80 border border-slate-100 px-2 py-1 rounded-full">
                    <i class="ri-shield-user-line"></i> 未认证
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                    编号 {{ user?.userId }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="$emit('close')" class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="relative z-10 flex-1 overflow-y-auto custom-scroll px-6 pt-3 pb-6 space-y-3">
          <p v-if="loading" class="text-center py-12 text-[13px] text-slate-400 font-bold">加载资料中...</p>

          <template v-else>
            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <p class="text-[11px] font-black text-slate-400 tracking-[0.14em] mb-2">个人签名</p>
              <p class="text-[14px] font-bold text-slate-800 leading-relaxed whitespace-pre-line">{{ user?.radarSign || '这个朋友还没有写个人签名。' }}</p>
            </section>
   <!-- 身份状态：疾病身份 / 确诊时长 / 经历 / 饮食流派 / 生活状态 -->
            <section v-if="identityChips.length" class="bg-white rounded-[26px] border border-white/80 p-4">
              <p class="text-[11px] font-black text-slate-400 tracking-[0.14em] mb-3">身份状态</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="(chip, idx) in identityChips" :key="idx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-700 text-[12px] font-black">
                  <span class="text-[14px] leading-none">{{ chip.emoji }}</span>{{ chip.text }}
                </span>
              </div>
            </section>
            
            <section class="bg-white rounded-[26px] border border-white/80 p-4">
              <div class="flex items-center justify-between gap-3 mb-3">
                <p class="text-[11px] font-black text-slate-400 tracking-[0.14em]">我的爱好</p>
                <span class="text-[10px] font-bold text-slate-300">最多 6 个</span>
              </div>
              <div v-if="profileTags.length" class="flex flex-wrap gap-2">
                <span v-for="tag in profileTags" :key="tag" class="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-black">{{ tag }}</span>
              </div>
              <p v-else class="text-[12px] text-slate-400 font-bold">还没有填爱好。</p>
            </section>

         

            <section class="rounded-[24px] border p-4" :class="isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" :class="isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
                  <i :class="isVerified ? 'ri-shield-check-fill' : 'ri-shield-user-line'" class="text-xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] font-black" :class="isVerified ? 'text-emerald-800' : 'text-amber-800'">
                    {{ isVerified ? '病情认证已通过' : '病情认证未公开或未通过' }}
                  </p>
                  <p class="text-[11.5px] font-medium leading-relaxed mt-1" :class="isVerified ? 'text-emerald-700/80' : 'text-amber-700/80'">
                    {{ isVerified ? '对方已提交过 IBD 相关证明，交流可信度更高。' : '想看更多可信资料，建议先完成自己的病例认证申请。' }}
                  </p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <div class="flex items-start gap-3">
                <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                  {{ user?.emoji || '🌙' }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[11px] font-black text-slate-400 tracking-[0.14em] mb-1">当前状态</p>
                  <h3 class="text-[16px] font-black text-slate-900 tracking-tight">{{ user?.text || '暂未设置状态' }}</h3>
                  <p class="text-[12px] text-slate-500 leading-relaxed mt-1">{{ user?.description || '对方还没有留下更多说明。' }}</p>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-3 gap-2">
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ user?.reactions || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">收到关心</p>
              </div>
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ profileData?.iSent || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">我送出</p>
              </div>
              <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                <p class="text-[18px] font-black text-slate-900">{{ profileData?.theySent || 0 }}</p>
                <p class="text-[10px] font-bold text-slate-400 mt-0.5">对方回应</p>
              </div>
            </section>

            <section v-if="user?.reactors?.length" class="bg-white rounded-[24px] border border-white/80 p-4">
              <p class="text-[12px] font-black text-slate-900 mb-3">最近关心对方的人</p>
              <div class="flex -space-x-2">
                <img v-for="(reactor, idx) in user.reactors" :key="idx" :src="avatarOf(reactor, idx)" class="w-8 h-8 rounded-full border-2 border-white bg-slate-100">
              </div>
            </section>

            <section @click="$emit('open-moments')" class="bg-white rounded-[24px] border border-white/80 p-4 active:scale-[0.99] transition-all cursor-pointer">
              <div class="flex items-center justify-between mb-3">
                <p class="text-[12px] font-black text-slate-900">对方的朋友圈</p>
                <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  {{ moments.length }} 条
                  <i v-if="moments.length" class="ri-arrow-right-s-line text-sm"></i>
                </span>
              </div>
              <p v-if="momentsLoading" class="text-center py-6 text-[12px] text-slate-400 font-bold">正在加载动态...</p>
              <p v-else-if="moments.length === 0" class="text-center py-6 text-[12px] text-slate-400 font-bold">暂时没有可见动态</p>
              <div v-else class="space-y-3">
                <article v-for="post in previewMoments" :key="post.id" class="rounded-2xl bg-stone-50/80 border border-stone-100 p-3">
                  <div class="flex items-center justify-between gap-3 mb-2">
                    <span class="text-[11px] font-bold text-slate-400">{{ post.time }}</span>
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="momentVisibilityMeta(post.visibility).class">
                      {{ momentVisibilityMeta(post.visibility).label }}
                    </span>
                  </div>
                  <p class="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
                  <div v-if="post.images?.length" class="grid grid-cols-3 gap-1.5 mt-2">
                    <img
                      v-for="(img, idx) in post.images.slice(0, 3)"
                      :key="idx"
                      :src="img"
                      @click.stop="$emit('open-image', post.images, idx)"
                      class="w-full aspect-square object-cover rounded-xl bg-slate-100"
                    >
                  </div>
                </article>
                <p v-if="moments.length > 2" class="text-center text-[11px] font-bold text-slate-400 pt-1">点击查看全部动态</p>
              </div>
            </section>

            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="text-[12px] font-black text-slate-900 flex items-center gap-1.5">
                    <i :class="showProofLocked ? 'ri-lock-2-fill text-slate-500' : 'ri-file-shield-2-fill text-blue-600'"></i>
                    病例证明
                  </p>
                  <p class="text-[11.5px] text-slate-500 font-medium leading-relaxed mt-1.5">
                    签名、标签、状态和动态都可以看；只有真实病例证明，需要你先完成自己的认证后再查看。
                  </p>
                </div>
                <span v-if="isVerified" class="shrink-0 text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">可查看</span>
                <span v-else class="shrink-0 text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">暂无证明</span>
              </div>

              <div v-if="showProofLocked" class="mt-3 rounded-2xl bg-slate-900 border border-slate-800 p-3 text-white">
                <p class="text-[12px] font-black flex items-center gap-1.5"><i class="ri-lock-2-fill text-blue-300"></i> 病例证明需双向认证后查看</p>
                <p class="text-[11px] text-white/65 font-medium leading-relaxed mt-1">你先上传并通过自己的病例认证后，才能看别人上传的真实病例证明。</p>
                <button
                  type="button"
                  @click="$emit('request-verify')"
                  class="mt-3 w-full py-2.5 rounded-2xl bg-white text-slate-950 text-[12px] font-black active:scale-95 transition-all"
                >
                  去提交认证申请
                </button>
              </div>

              <button
                v-else-if="isVerified"
                type="button"
                @click="loadProofs"
                :disabled="proofLoading"
                class="mt-3 w-full py-2.5 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all disabled:bg-slate-300"
              >
                <i :class="proofLoading ? 'ri-loader-4-line animate-spin' : 'ri-eye-line'"></i>
                {{ proofLoading ? '读取中...' : (proofLoaded ? '重新读取病例证明' : '查看病例证明') }}
              </button>

              <p v-else class="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-[11.5px] text-slate-400 font-bold">
                TA 还没有上传可展示的病例证明。
              </p>

              <div v-if="proofError" class="mt-3 rounded-2xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-[11.5px] text-amber-700 font-bold leading-relaxed">
                {{ proofError }}
              </div>

              <div v-if="proofUrls.length" class="grid grid-cols-3 gap-2 mt-3">
                <button
                  v-for="(url, index) in proofUrls"
                  :key="url"
                  type="button"
                  @click="$emit('open-image', proofUrls, index)"
                  class="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 active:scale-95 transition-all"
                >
                  <img :src="url" class="w-full h-full object-cover" alt="病例证明">
                </button>
              </div>
            </section>
          </template>
        </div>

        <!-- 奇怪招呼选择层 -->
        <div v-if="showGreetPicker" class="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end" @click.self="showGreetPicker = false">
          <div class="bg-white rounded-t-[28px] p-5 pb-[calc(env(safe-area-inset-bottom,8px)+20px)]">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <p class="text-[15px] font-black text-slate-900 text-center mb-1">给 TA 送个招呼</p>
            <p class="text-[11px] text-slate-400 font-medium text-center mb-4">无需多言，一个奇怪的招呼就够暖 👋</p>
            <div class="grid grid-cols-3 gap-2.5">
              <button v-for="g in GREETINGS" :key="g.key"
                      @click="pickGreet(g.key)"
                      class="flex flex-col items-center gap-1 py-3 rounded-2xl bg-slate-50 border border-slate-100 active:scale-95 transition-all">
                <span class="text-[24px] leading-none">{{ g.emoji }}</span>
                <span class="text-[11px] font-black text-slate-600">{{ g.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <footer v-if="!loading" class="relative z-10 shrink-0 grid grid-cols-2 gap-2 px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,8px)+16px)] bg-[#FBF9F5]/95 border-t border-stone-100">
          <button
            @click="showGreetPicker = true"
            :disabled="isSelf || user?.reactedToday"
            class="py-3.5 rounded-2xl text-[13px] font-black active:scale-95 transition-all"
            :class="(isSelf || user?.reactedToday) ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white'"
            :style="{ gridColumn: isFriend && !isSelf ? 'auto' : '1 / -1' }"
          >
            {{ user?.reactedToday ? '今天已打过招呼' : '👋 送个招呼' }}
          </button>
          <button
            v-if="isFriend && !isSelf"
            @click="$emit('start-chat')"
            class="py-3.5 rounded-2xl text-[13px] font-black bg-blue-600 text-white active:scale-95 transition-all"
          >
            💬 发起密聊
          </button>
          <button
            v-if="canRemoveFriend"
            @click="$emit('delete-friend', user?.userId)"
            class="col-span-2 py-2.5 rounded-2xl text-[12px] font-black text-rose-500 bg-rose-50 active:scale-95 transition-all"
          >
            解除好友关系
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import http from '@/api/http'
import { avatarOf } from '@/utils/avatarPool'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  profileData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  moments: {
    type: Array,
    default: () => []
  },
  momentsLoading: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String,
    default: '神秘朋友'
  },
  remark: {
    type: String,
    default: ''
  },
  canRemark: {
    type: Boolean,
    default: false
  },
  isFriend: {
    type: Boolean,
    default: false
  },
  myId: {
    type: Number,
    default: 0
  },
  momentVisibilityMeta: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'edit-remark', 'open-moments', 'greet', 'start-chat', 'open-image', 'delete-friend', 'request-verify'])

// 奇怪的招呼库（与状态墙的 REACTIONS 一致）
const GREETINGS = [
  { key: 'handshake', emoji: '🤝', label: '隔空握手' },
  { key: 'hug', emoji: '🤗', label: '抱抱' },
  { key: 'hold', emoji: '✊', label: '稳住兄弟' },
  { key: 'punch', emoji: '👊', label: '锤一拳' },
  { key: 'luck', emoji: '🍀', label: '接好运' },
  { key: 'strong', emoji: '💪', label: '挺住' },
  { key: 'powder', emoji: '🥣', label: '催喝营养粉' },
  { key: 'warmbag', emoji: '🔥', label: '催敷热水袋' },
  { key: 'seen', emoji: '👀', label: '我看到了' },
]
const showGreetPicker = ref(false)
const proofLoading = ref(false)
const proofLoaded = ref(false)
const proofUrls = ref([])
const proofError = ref('')
const pickGreet = (key) => {
  showGreetPicker.value = false
  emit('greet', key)
}

const isSelf = computed(() => Number(props.user?.userId) === Number(props.myId))
const canRemoveFriend = computed(() => props.isFriend && !isSelf.value)
const previewMoments = computed(() => props.moments.slice(0, 2))
const isVerified = computed(() => Number(props.user?.verified || 0) > 0)
const showProofLocked = computed(() => !isSelf.value && props.profileData && props.profileData.myUnlocked === false)

const PROFILE_THEMES = {
  warm: {
    shell: '#FBF9F5',
    header: 'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 52%, #fed7aa 100%)',
    fade: 'linear-gradient(to bottom, rgba(255,255,255,0.24), rgba(255,255,255,0.58), #FBF9F5)',
    rail: '#f97316'
  },
  night: {
    shell: '#F7F7FC',
    header: 'linear-gradient(135deg, #111827 0%, #312e81 58%, #2563eb 100%)',
    fade: 'linear-gradient(to bottom, rgba(15,23,42,0.06), rgba(255,255,255,0.62), #F7F7FC)',
    rail: '#4338ca'
  },
  forest: {
    shell: '#F4FBF6',
    header: 'linear-gradient(135deg, #ccfbf1 0%, #bbf7d0 58%, #e0f2fe 100%)',
    fade: 'linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.58), #F4FBF6)',
    rail: '#059669'
  },
  clean: {
    shell: '#F8FAFC',
    header: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 58%, #e0f2fe 100%)',
    fade: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.64), #F8FAFC)',
    rail: '#64748b'
  }
}
const profileTheme = computed(() => PROFILE_THEMES[props.user?.profileStyle] || PROFILE_THEMES.warm)
const profileThemeVars = computed(() => ({
  '--profile-shell': profileTheme.value.shell,
  '--profile-header': profileTheme.value.header,
  '--profile-cover-fade': profileTheme.value.fade,
  '--profile-rail': profileTheme.value.rail
}))

const resetProofState = () => {
  proofLoading.value = false
  proofLoaded.value = false
  proofUrls.value = []
  proofError.value = ''
}

watch(
  () => [props.show, props.user?.userId],
  resetProofState
)

const loadProofs = async () => {
  if (!props.user?.userId || proofLoading.value) return
  if (showProofLocked.value) {
    emit('request-verify')
    return
  }
  proofLoading.value = true
  proofError.value = ''
  try {
    const res = await http.get(`/verify/user/${props.user.userId}/proofs`)
    const data = res?.data || {}
    if ((res.status === 200 || res.code === 200) && data.canView !== false) {
      proofUrls.value = Array.isArray(data.proofImageUrls) ? data.proofImageUrls.filter(Boolean) : []
      proofLoaded.value = true
      if (!proofUrls.value.length) {
        proofError.value = '对方已认证，但暂时没有可展示的病例图片。'
      }
      return
    }
    proofUrls.value = []
    proofLoaded.value = true
    proofError.value = res?.message || '病例证明需先完成自己的认证后查看。'
  } catch (error) {
    proofUrls.value = []
    proofLoaded.value = true
    proofError.value = error?.response?.data?.message || '读取病例证明失败，请稍后再试。'
  } finally {
    proofLoading.value = false
  }
}
const profileTags = computed(() => {
  const raw = props.user?.radarTags || props.user?.radarTagList
  if (Array.isArray(raw)) return raw.filter(Boolean).slice(0, 6)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 6) : []
  } catch (e) {
    return String(raw).split(/[,，\s]+/).map(item => item.trim()).filter(Boolean).slice(0, 6)
  }
})

// 身份标签 → emoji 映射（与 ProfileTab 的身份库保持一致）
const DISEASE_EMOJI = { '克罗恩病': '🧬', '溃疡性结肠炎': '🩸', '未分型 IBD': '🔬', '未分型IBD': '🔬' }
const DURATION_EMOJI = { '确诊1年内': '🌱', '确诊1-3年': '😐', '确诊3-5年': '😤', '确诊5-10年': '🔥', '确诊10年以上': '🛡️' }
const PHASE_TAG_EMOJI = { '有造口': '🎒', '做过手术': '🏥', '有肛瘘': '⚡' }
const DIET_EMOJI = { '低 FODMAP': '🌿', '低FODMAP': '🌿', '流食为主': '💧', '无麸质饮食': '🌾', '低渣软食': '🍚', '常规少量尝试': '🍱' }
const GUT_EMOJI = { '正常生活中': '🟢', '低电量恢复': '🟡', '正在硬扛': '🔴', '住院/复查中': '🏥' }
const emojiFor = (map, name, fallback = '🔖') => map[String(name || '').trim()] || fallback

// 疾病身份（healthPhase 是 JSON：{disease, duration, tags}）
const phaseInfo = computed(() => {
  const raw = props.user?.healthPhase
  if (!raw) return null
  let parsed = null
  try { parsed = JSON.parse(raw) } catch (e) { parsed = null }
  if (parsed && parsed.disease) {
    return {
      disease: parsed.disease,
      duration: parsed.duration || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter(Boolean) : []
    }
  }
  // 兜底：纯文本
  return { disease: String(raw), duration: '', tags: [] }
})

// 四个身份汇总，给模板用
const identityChips = computed(() => {
  const list = []
  const p = phaseInfo.value
  if (p && p.disease) {
    list.push({ label: '疾病身份', emoji: emojiFor(DISEASE_EMOJI, p.disease), text: p.disease })
    if (p.duration) list.push({ label: '确诊时长', emoji: emojiFor(DURATION_EMOJI, p.duration, '⏳'), text: p.duration })
    p.tags.forEach(t => list.push({ label: '经历', emoji: emojiFor(PHASE_TAG_EMOJI, t), text: t }))
  }
  if (props.user?.dietStrategy) {
    list.push({ label: '饮食流派', emoji: emojiFor(DIET_EMOJI, props.user.dietStrategy, '🍽️'), text: props.user.dietStrategy })
  }
  if (props.user?.bowelStatus) {
    list.push({ label: '生活状态', emoji: emojiFor(GUT_EMOJI, props.user.bowelStatus, '🌿'), text: props.user.bowelStatus })
  }
  return list
})
</script>

<style scoped>
.profile-sheet-panel {
  background: var(--profile-shell, #FBF9F5);
}

.profile-sheet-header {
  background: var(--profile-header, linear-gradient(135deg, #fff7ed 0%, #ffe4e6 52%, #fed7aa 100%));
}

.profile-cover-fade {
  background: var(--profile-cover-fade, linear-gradient(to bottom, rgba(255,255,255,0.24), rgba(255,255,255,0.58), #FBF9F5));
}

.custom-scroll::-webkit-scrollbar {
  display: none;
}
.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.26s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(18px);
}
</style>
