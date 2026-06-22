<template>
  <div v-if="show" class="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
    <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" @click="onCancel"></div>
    <div class="relative z-10 w-full sm:w-[420px] rounded-t-[28px] sm:rounded-[28px] bg-[#F8F6F1] p-5 animate-slide-up shadow-2xl">
      <div class="flex items-start justify-between gap-3 mb-4">
        <div>
          <p class="text-[10px] font-black tracking-[0.18em]" :class="accentClass">{{ accentLabel }}</p>
          <h3 class="text-[18px] font-black mt-1">{{ title }}</h3>
        </div>
        <button @click="onCancel" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="rounded-2xl border p-4 mb-4" :class="warningBoxClass">
        <p class="text-[12.5px] leading-relaxed font-bold">{{ warningText }}</p>
        <label v-if="requireAck" class="flex items-start gap-2 mt-3 cursor-pointer">
          <input v-model="ackChecked" type="checkbox" class="mt-0.5 w-4 h-4 rounded accent-slate-950">
          <span class="text-[11.5px] font-bold leading-relaxed">{{ ackText }}</span>
        </label>
      </div>

      <div class="space-y-2 mb-4">
        <p class="text-[11px] font-black text-slate-500">输入登录密码确认</p>
        <input
          v-model="password"
          type="password"
          placeholder="你的账号密码"
          class="w-full rounded-2xl bg-white border border-stone-200 px-4 py-3.5 text-[13px] font-bold outline-none focus:border-slate-400"
          @keyup.enter="onConfirm"
        >
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button @click="onCancel" class="py-3.5 rounded-2xl bg-white border border-stone-200 text-[13px] font-black text-slate-600 active:scale-95 transition-all">
          取消
        </button>
        <button @click="onConfirm" :disabled="!canSubmit || submitting" class="py-3.5 rounded-2xl text-white text-[13px] font-black active:scale-95 transition-all disabled:opacity-50" :class="confirmBtnClass">
          {{ submitting ? '验证中…' : confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  kind: { type: String, default: 'drug' },
  mode: { type: String, default: 'create' },
  submitting: { type: Boolean, default: false },
  requireAck: { type: Boolean, default: true }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const password = ref('')
const ackChecked = ref(false)

const title = computed(() => {
  if (props.mode === 'delete') return props.kind === 'hospital' ? '删除这家医院' : '删除这款药品'
  if (props.mode === 'edit') return props.kind === 'hospital' ? '保存医院修改' : '保存药品修改'
  return props.kind === 'hospital' ? '确认补充医院' : '确认补充药品'
})

const confirmLabel = computed(() => {
  if (props.mode === 'delete') return '确认删除'
  if (props.mode === 'edit') return '确认保存'
  return '确认补充'
})

const accentLabel = computed(() => (props.mode === 'delete' ? '安全确认' : '补充确认'))
const accentClass = computed(() => (props.kind === 'hospital' ? 'text-amber-600' : 'text-emerald-600'))

const warningText = computed(() => {
  if (props.mode === 'delete') {
    return props.kind === 'hospital'
      ? '删除后其他病友将看不到这家医院档案。此操作不可恢复，请确认后再删。'
      : '删除后其他病友将看不到这款药品档案。此操作不可恢复，请确认后再删。'
  }
  if (props.mode === 'edit') {
    return '请确认修改内容真实准确，错误信息会影响其他病友的用药 / 就诊决策。'
  }
  return props.kind === 'hospital'
    ? '请先在列表里搜过，确认库里真的没有这家医院再补充。随意重复补充会让大家更难找到正确信息。'
    : '请先在列表里搜过，确认库里真的没有这款药再补充。随意重复补充会让大家更难找到正确信息。'
})

const ackText = computed(() => {
  if (props.mode === 'delete') return '我确认要删除这条记录'
  if (props.mode === 'edit') return '我已核对修改内容，信息真实准确'
  return props.kind === 'hospital' ? '我已搜过，确认库里没有这家医院' : '我已搜过，确认库里没有这款药'
})

const warningBoxClass = computed(() => {
  if (props.mode === 'delete') return 'bg-rose-50 border-rose-100 text-rose-800'
  return props.kind === 'hospital' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'
})

const confirmBtnClass = computed(() => {
  if (props.mode === 'delete') return 'bg-rose-500'
  return props.kind === 'hospital' ? 'bg-amber-500' : 'bg-slate-950'
})

const canSubmit = computed(() => {
  const hasPassword = password.value.trim().length >= 6
  if (!props.requireAck) return hasPassword
  return hasPassword && ackChecked.value
})

watch(() => props.show, (visible) => {
  if (visible) {
    password.value = ''
    ackChecked.value = false
  }
})

const onCancel = () => {
  emit('update:show', false)
  emit('cancel')
}

const onConfirm = () => {
  if (!canSubmit.value || props.submitting) return
  emit('confirm', password.value.trim())
}
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up { animation: slide-up 0.34s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
