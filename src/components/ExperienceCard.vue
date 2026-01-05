<template>
  <div :class="[
    'relative w-full max-w-[20rem] cursor-pointer transition-all duration-300 group font-sans',
    containerClasses[theme]
  ]">

    <div v-if="theme === 'neon'" class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

    <div v-if="theme === 'sunset'" class="absolute inset-0 rounded-2xl overflow-hidden z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-pink-400 via-orange-300 to-orange-200"></div>
      <div class="absolute top-10 left-8 w-16 h-16 bg-white/40 rounded-full blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.6)]"></div>
      <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-rose-900/20 rounded-full mix-blend-multiply"></div>
      <div class="absolute -bottom-16 -left-10 w-72 h-72 bg-rose-900/30 rounded-full mix-blend-multiply"></div>
    </div>

    <div v-if="theme === 'deepsea'" class="absolute inset-0 rounded-2xl overflow-hidden z-0 bg-slate-900">
      <div class="absolute inset-0 bg-gradient-to-b from-cyan-900 via-blue-900 to-black opacity-90"></div>
      <div class="absolute bottom-4 left-10 w-4 h-4 border border-cyan-400/30 rounded-full animate-bounce duration-[3000ms]"></div>
      <div class="absolute bottom-12 left-20 w-2 h-2 border border-cyan-400/20 rounded-full animate-bounce duration-[5000ms]"></div>
      <div class="absolute top-0 right-0 w-full h-2/3 bg-gradient-to-bl from-cyan-400/10 to-transparent"></div>
    </div>


    <div :class="[
      'relative h-full flex flex-col justify-between overflow-hidden transition-all duration-300 z-10',
      contentClasses[theme]
    ]">

      <div class="flex items-start justify-between">
        <div :class="(theme === 'sunset' || theme === 'deepsea') ? 'text-white drop-shadow-md' : ''">
          <div :class="['text-3xl transition-transform duration-300 group-hover:scale-110', iconClasses[theme]]">{{ icon || '💊' }}</div>
          <h3 :class="['text-lg leading-tight mt-2', titleColor[theme]]">
            {{ title || '默认标题' }}
          </h3>
        </div>

        <div v-if="theme === 'sunset'" class="text-right text-white drop-shadow-md">
          <p class="text-xs font-bold opacity-80">2025.12.23</p>
          <p class="text-3xl font-black">24°C</p>
        </div>
        <div v-else-if="theme === 'deepsea'" class="text-right text-cyan-200 drop-shadow-md">
          <p class="text-xs font-bold opacity-60">DEPTH</p>
          <p class="text-3xl font-black tracking-widest">-3000m</p>
        </div>
        <p v-else :class="['text-xs mt-1', dateColor[theme]]">2025.12.16</p>
      </div>

      <p :class="['text-sm mt-4 line-clamp-3 leading-relaxed', (theme === 'sunset' || theme === 'deepsea') ? 'text-white/90 font-medium drop-shadow-sm' : textColor[theme]]">
        {{ summary || '兄弟，这里是摘要内容...' }}
      </p>

      <div v-if="theme === 'sunset'" class="mt-5 -mx-7 px-7 py-4 bg-white/90 backdrop-blur-sm border-t border-white/50">
        <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag" class="text-xs font-bold text-slate-600">
              ● {{ tag }}
            </span>
        </div>
      </div>

      <div v-else-if="theme === 'deepsea'" class="mt-5 pt-4 border-t border-cyan-500/30">
        <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag" class="text-xs px-2 py-0.5 border border-cyan-500/50 text-cyan-300 bg-cyan-900/40 rounded-full">
              {{ tag }}
            </span>
        </div>
      </div>

      <div v-else class="flex flex-wrap gap-2 mt-5">
        <span v-for="tag in tags" :key="tag" :class="['text-xs px-2 py-0.5 border', tagClasses[theme]]">
          {{ tagPrefix[theme] }}{{ tag }}
        </span>
      </div>
      <div v-if="canEdit" class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button class="bg-red-500 text-white p-1 rounded hover:bg-red-600" @click.stop="$emit('delete')">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: Number,
  title: String,
  summary: String,
  icon: String,
  theme: String,
  date: String,
  tags: Array,

  // 👇 关键：接收权限开关！
  canEdit: {
    type: Boolean,
    default: false
  }
})

// 👇 声明我们要抛出的事件，告诉父组件“我要删这个！”
defineEmits(['delete'])

// === 🎨 皮肤配置中心 ===

const containerClasses = {
  neon: 'rounded-lg hover:-translate-y-2',
  glass: 'rounded-xl shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-2',
  pop: 'rounded-xl hover:-translate-y-1',
  cyber: 'rounded-sm hover:-translate-y-1',
  paper: 'rounded-sm rotate-1 hover:rotate-0 hover:scale-105',
  aurora: 'rounded-2xl hover:scale-[1.02]',
  sunset: 'rounded-2xl shadow-xl shadow-orange-500/20 hover:-translate-y-2',
  deepsea: 'rounded-2xl shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/40 hover:-translate-y-2'
}

const contentClasses = {
  neon: 'bg-slate-900 text-slate-100 rounded-lg px-7 py-6',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-inner rounded-xl px-7 py-6',
  pop: 'bg-yellow-400 border-2 border-black text-black rounded-xl px-7 py-6',
  cyber: 'bg-black border border-green-500/50 rounded-sm px-7 py-6',
  paper: 'bg-[#fffdf5] border border-stone-200 shadow-md text-stone-800 rounded-sm px-7 py-6',
  aurora: 'bg-slate-900 border border-slate-700/50 rounded-2xl px-7 py-6',
  sunset: 'bg-transparent px-7 pt-6 pb-0', // 修复了底部被切的问题
  deepsea: 'bg-transparent px-7 py-6'
}

// 标题颜色
const titleColor = {
  neon: 'text-white font-bold',
  glass: 'text-slate-800 font-extrabold',
  pop: 'text-black font-black uppercase',
  cyber: 'text-green-400 font-mono tracking-tighter font-bold',
  paper: 'text-stone-800 font-serif font-bold italic',
  aurora: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-indigo-300 font-bold',
  sunset: 'text-white font-bold text-2xl drop-shadow-lg',
  deepsea: 'text-cyan-100 font-bold tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]'
}

// 正文颜色
const textColor = {
  neon: 'text-slate-400',
  glass: 'text-slate-600 font-medium',
  pop: 'text-slate-900 font-bold',
  cyber: 'text-green-600/80 font-mono text-xs',
  paper: 'text-stone-600 font-serif',
  aurora: 'text-slate-400',
  sunset: 'text-white',
  deepsea: 'text-cyan-200/80'
}

// 日期颜色
const dateColor = {
  neon: 'text-slate-500',
  glass: 'text-slate-500',
  pop: 'text-slate-700 font-mono',
  cyber: 'text-green-800 font-mono text-[10px]',
  paper: 'text-stone-400 font-serif italic',
  aurora: 'text-slate-500',
  sunset: 'text-white',
  deepsea: 'text-cyan-500'
}

// 图标样式
const iconClasses = {
  cyber: 'grayscale contrast-200 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]',
  paper: 'opacity-80',
  aurora: 'grayscale-0',
  sunset: 'text-white drop-shadow-md text-4xl',
  deepsea: 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] text-4xl'
}

// 标签样式 (Sunset/Deepsea 在 template 特殊处理)
const tagClasses = {
  neon: 'text-pink-500 border-pink-500 rounded-full',
  glass: 'text-blue-600 border-blue-200 bg-blue-50/50 rounded-full',
  pop: 'text-black border-black bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full',
  cyber: 'text-green-400 border-green-900 bg-green-900/20 font-mono text-[10px] rounded-none',
  paper: 'text-stone-500 border-stone-300 bg-stone-100 rounded-sm font-serif',
  aurora: 'text-white border-white/10 bg-white/5 rounded-full backdrop-blur-sm',
  sunset: '',
  deepsea: ''
}

// 标签前缀
const tagPrefix = {
  neon: '#', glass: '#', pop: '',
  cyber: '>', paper: '', aurora: '✦ ', sunset: '', deepsea: ''
}
</script>