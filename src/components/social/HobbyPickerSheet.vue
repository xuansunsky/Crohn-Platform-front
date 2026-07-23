<template>
  <Teleport to="body">
    <transition name="sheet">
      <div v-if="show" class="fixed inset-0 z-[1950] flex flex-col justify-end">
        <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div class="sheet-panel relative bg-[#FBF9F5] rounded-t-[32px] max-h-[88vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
          <div class="shrink-0 pt-3 pb-2"><div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div></div>

          <div class="shrink-0 px-5 pb-3 flex items-center justify-between">
            <div>
              <h2 class="text-[19px] font-black text-slate-900 tracking-tight">你的爱好是？</h2>
              <p class="text-[11px] text-slate-400 font-bold mt-0.5">挑几个爱好让大家认识真实的你 · 已选 {{ selected.length }}/{{ MAX }}</p>
            </div>
            <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line text-lg"></i></button>
          </div>

          <div class="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 space-y-5">
            <div v-for="grp in HOBBY_LIBRARY" :key="grp.label">
              <div class="flex items-center gap-1.5 mb-2.5">
                <span class="text-[15px]">{{ grp.icon }}</span>
                <h3 class="text-[12px] font-black tracking-wide text-slate-500">{{ grp.label }}</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <button v-for="h in grp.items" :key="h"
                        @click="toggle(h)"
                        class="px-3 py-2 rounded-2xl text-[12.5px] font-black active:scale-95 transition-all border"
                        :class="isPicked(h)
                          ? 'bg-slate-900 text-white border-slate-900 shadow-[0_4px_14px_-4px_rgba(15,23,42,0.5)]'
                          : 'bg-white text-slate-600 border-slate-100'">
                  {{ h }}
                </button>
              </div>
            </div>

            <!-- 自定义追加 -->
            <div>
              <div class="flex items-center gap-1.5 mb-2.5">
                <span class="text-[15px]">✨</span>
                <h3 class="text-[12px] font-black tracking-wide text-indigo-600">没有想要的？自己加一个</h3>
              </div>
              <div class="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-2 shadow-[0_3px_12px_-4px_rgba(15,23,42,0.08)]">
                <input v-model="customText" @keydown.enter="addCustom" type="text" maxlength="8"
                       placeholder="比如 钓鱼、滑板、养多肉…"
                       class="flex-1 min-w-0 bg-slate-50 rounded-xl px-3 py-2.5 text-[13px] font-bold outline-none border border-stone-200 focus:border-indigo-300">
                <button @click="addCustom" :disabled="!canAddCustom"
                        class="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-200">
                  加上
                </button>
              </div>
            </div>
          </div>

          <!-- 已选预览 + 保存 -->
          <div class="shrink-0 px-5 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+14px)] bg-[#FBF9F5]/95 border-t border-stone-100">
            <div v-if="selected.length" class="flex flex-wrap gap-1.5 mb-3">
              <span v-for="h in selected" :key="h"
                    @click="toggle(h)"
                    class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black active:scale-95 transition-all cursor-pointer">
                {{ h }} <i class="ri-close-line"></i>
              </span>
            </div>
            <button @click="save"
                    class="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-[14px] font-black active:scale-95 transition-all">
              保存爱好
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  // 已选爱好（字符串数组），打开时回填
  modelValue: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'save'])

const MAX = 6

// 预设爱好库：以正常人爱好为主，品类铺开，让人记得世间精彩很多
const HOBBY_LIBRARY = [
  { label: '运动健身', icon: '🏃', items: ['跑步', '健身', '羽毛球', '游泳', '骑行', '瑜伽', '篮球', '爬山', '滑板'] },
  { label: '美食料理', icon: '🍳', items: ['做饭', '烘焙', '探店', '咖啡', '喝茶', '做甜点', '火锅控'] },
  { label: '影音文娱', icon: '🎬', items: ['追剧', '看电影', '听音乐', '弹吉他', '唱歌', '读书', '写作', '播客'] },
  { label: '二次元', icon: '🌸', items: ['动漫', '漫画', '手办', 'COS', '看番', '画画'] },
  { label: '游戏电竞', icon: '🎮', items: ['手游', '主机游戏', '桌游', '剧本杀', '电竞'] },
  { label: '户外旅行', icon: '🏕️', items: ['旅行', '露营', '徒步', '钓鱼', '摄影', '看展', '逛公园'] },
  { label: '生活日常', icon: '🐱', items: ['养猫', '养狗', '养花', '手工', '收纳', '数码', '穿搭', '种菜', '香薰'] },
  { label: '安静时刻', icon: '🍃', items: ['发呆', '冥想', '写日记', '拼图', '晒太阳', '逛超市'] }
]

const selected = ref([])

// 打开时回填已选
watch(() => props.show, (v) => {
  if (v) {
    selected.value = Array.isArray(props.modelValue) ? [...props.modelValue].filter(Boolean).slice(0, MAX) : []
  }
})

const customText = ref('')

const isPicked = (h) => selected.value.includes(h)

const toggle = (h) => {
  const idx = selected.value.indexOf(h)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    if (selected.value.length >= MAX) {
      alert(`最多选 ${MAX} 个爱好哦`)
      return
    }
    selected.value.push(h)
  }
}

const canAddCustom = computed(() => {
  const v = customText.value.trim()
  return !!v && !selected.value.includes(v) && selected.value.length < MAX
})

const addCustom = () => {
  const v = customText.value.trim()
  if (!v) return
  if (selected.value.includes(v)) { customText.value = ''; return }
  if (selected.value.length >= MAX) { alert(`最多选 ${MAX} 个爱好哦`); return }
  selected.value.push(v)
  customText.value = ''
}

const save = () => {
  emit('save', [...selected.value])
}
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.28s ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
