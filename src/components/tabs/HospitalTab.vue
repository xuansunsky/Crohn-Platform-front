<template>
  <div class="relative w-full pb-8 bg-[#FBF9F5] text-slate-900 font-sans overflow-x-hidden">

    <!-- 柔和奶白底色色斑 -->
    <div class="absolute top-[-100px] right-[-100px] w-96 h-96 bg-amber-200/30 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[30%] left-[-100px] w-80 h-80 bg-rose-200/25 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[65%] right-[10%] w-72 h-72 bg-teal-100/30 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Header -->
    <header class="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-xl border-b border-stone-200/60 px-4 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
            @click="emit('change-tab', 'checkin')"
            class="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center active:scale-95 transition-all text-slate-700 shadow-sm hover:shadow-md"
        >
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <div>
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="text-[10px] font-black tracking-[0.3em] text-amber-600 uppercase">Clinic · IBD Frontier</span>
          </div>
          <h1 class="text-[19px] font-black tracking-tight text-slate-900 leading-none flex items-center gap-2">
            顶级专科中心
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          </h1>
        </div>
      </div>
      <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-sm">
        <i class="ri-medal-fill text-lg"></i>
      </div>
    </header>

    <main class="p-5 space-y-5 relative z-10">

      <!-- 搜索栏 -->
      <div class="relative">
        <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
        <input
            v-model="keyword"
            type="text"
            placeholder="搜索名院或技术 · 如 瑞金 / 华西 / MRE"
            class="w-full bg-white text-slate-900 text-[13.5px] font-medium rounded-2xl py-3.5 pl-12 pr-4 outline-none border border-stone-200 focus:border-amber-500/40 focus:shadow-[0_8px_24px_-12px_rgba(245,158,11,0.25)] transition-all placeholder-slate-400 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]"
        >
      </div>

      <!-- 地区快捷 -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
        <button
            v-for="region in regions"
            :key="region.key"
            @click="activeRegion = region.key"
            :class="[
              'px-4 py-2 rounded-full text-[12px] font-black whitespace-nowrap transition-all border shrink-0 active:scale-95',
              activeRegion === region.key
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-500 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.5)]'
                : 'bg-white text-slate-500 border-stone-200 hover:border-stone-300 hover:text-slate-700'
            ]"
        >
          <i class="ri-map-pin-line mr-1"></i> {{ region.label }}
        </button>
      </div>

      <!-- 列表标题 -->
      <div class="flex items-end justify-between pt-2 px-1">
        <div>
          <h3 class="text-[17px] font-black tracking-tight text-slate-900">推荐专科</h3>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">{{ filteredHospitals.length }} 家 IBD 顶级专科 · 保姆级避坑</p>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredHospitals.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-300">
        <div class="w-16 h-16 mb-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-center">
          <i class="ri-hospital-line text-2xl"></i>
        </div>
        <p class="text-[13px] font-medium text-slate-400">暂无该范围内的专科医院</p>
      </div>

      <!-- 医院卡片 -->
      <div v-else class="space-y-3">
        <article
            v-for="hosp in filteredHospitals"
            :key="hosp.id"
            @click="openDetail(hosp)"
            class="group relative overflow-hidden bg-white rounded-[24px] p-5 border border-stone-100 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-12px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 cursor-pointer"
        >
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="relative flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-100">
                  {{ hosp.level }}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-100">
                  {{ hosp.regionLabel }}
                </span>
              </div>
              <h3 class="text-[15.5px] font-black text-slate-900 tracking-tight leading-snug group-hover:text-amber-700 transition-colors line-clamp-1">
                {{ hosp.name }}
              </h3>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex items-center text-amber-500">
                  <i class="ri-star-fill text-[12px]"></i>
                  <span class="text-[12px] font-black text-slate-700 ml-1">{{ hosp.rating }}</span>
                </div>
                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span class="text-[11px] font-bold text-slate-500">推荐率 {{ hosp.recommendRate }}%</span>
              </div>
            </div>

            <div class="flex flex-col items-end shrink-0">
              <span class="px-2 py-1 rounded-md bg-gradient-to-br from-amber-50 to-amber-100/80 text-amber-700 text-[10px] font-black border border-amber-200/60 flex items-center gap-0.5 shadow-sm">
                <i class="ri-shield-flash-line"></i> 绿道 {{ hosp.greenChannel }}
              </span>
              <span class="text-[9.5px] text-slate-400 mt-1.5 font-bold tracking-wide">急诊 {{ hosp.responseTime }}</span>
            </div>
          </div>

          <!-- 避坑摘要 -->
          <p class="text-[12px] text-slate-600 mt-3 leading-relaxed bg-stone-50/60 p-3 rounded-xl border border-stone-100 font-medium line-clamp-2">
            <span class="text-amber-600 font-black">💡 避坑摘要 · </span>{{ hosp.summary }}
          </p>

          <div class="flex justify-between items-center mt-3">
            <div class="flex gap-1 flex-wrap">
              <span v-for="tech in hosp.techs.slice(0, 2)" :key="tech" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-bold">
                {{ tech }}
              </span>
            </div>
            <span class="text-[11px] font-black text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              名医宝典 <i class="ri-arrow-right-s-line text-base"></i>
            </span>
          </div>
        </article>
      </div>

    </main>

    <!-- 详情面板 -->
    <div v-if="showDetail && selectedHospital" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div @click="showDetail = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>

      <div class="bg-[#FBF9F5] w-full sm:w-[500px] h-[92vh] sm:h-[88vh] sm:rounded-[32px] rounded-t-[32px] relative z-10 animate-slide-up shadow-2xl flex flex-col overflow-hidden">

        <!-- 抓手 -->
        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-300 rounded-full z-20"></div>

        <!-- 详情页顶 -->
        <header class="px-5 pt-7 pb-4 border-b border-stone-100 bg-[#FBF9F5]/95 backdrop-blur shrink-0 flex justify-between items-start z-10">
          <div class="min-w-0 pr-3">
            <span class="text-[10px] font-black tracking-[0.25em] uppercase text-amber-700">{{ selectedHospital.level }} · {{ selectedHospital.regionLabel }}</span>
            <h3 class="text-[19px] font-black text-slate-900 mt-1 tracking-tight leading-tight">{{ selectedHospital.name }}</h3>
          </div>
          <button @click="showDetail = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-slate-500 flex items-center justify-center transition-all active:scale-90 shrink-0">
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <!-- 滚动区 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-4 pb-24">

          <!-- 指标罗盘 -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="bg-white rounded-2xl p-3 border border-stone-100 text-center relative overflow-hidden">
              <p class="text-[9.5px] font-black text-slate-400 tracking-widest uppercase">门诊预约</p>
              <p class="text-[16px] font-black text-amber-600 mt-1.5 tracking-tighter leading-none">{{ selectedHospital.difficulty }}</p>
              <p class="text-[9.5px] text-slate-400 mt-1.5 font-medium">放号瞬抢率</p>
            </div>
            <div class="bg-white rounded-2xl p-3 border border-stone-100 text-center relative overflow-hidden">
              <p class="text-[9.5px] font-black text-slate-400 tracking-widest uppercase">肠镜预约</p>
              <p class="text-[16px] font-black text-emerald-600 mt-1.5 tracking-tighter leading-none">{{ selectedHospital.scopeWait }}</p>
              <p class="text-[9.5px] text-slate-400 mt-1.5 font-medium">快速通道</p>
            </div>
            <div class="bg-white rounded-2xl p-3 border border-stone-100 text-center relative overflow-hidden">
              <p class="text-[9.5px] font-black text-slate-400 tracking-widest uppercase">MRE排期</p>
              <p class="text-[16px] font-black text-blue-600 mt-1.5 tracking-tighter leading-none">{{ selectedHospital.mreWait }}</p>
              <p class="text-[9.5px] text-slate-400 mt-1.5 font-medium">小肠核磁</p>
            </div>
          </div>

          <!-- 绿道配置 -->
          <div class="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-2xl p-4 border border-amber-100 space-y-2.5">
            <h4 class="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
              <i class="ri-shield-flash-line text-sm"></i> IBD 急诊绿道配置
            </h4>
            <div class="space-y-2 text-[12px]">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-medium">🚨 急性复发直接收治</span>
                <span class="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">特护床位</span>
              </div>
              <div class="w-full h-px bg-amber-100"></div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-medium">💉 生物制剂注射室</span>
                <span class="text-slate-900 font-bold text-[11px] text-right max-w-[180px]">{{ selectedHospital.injectionRoom || '有，配制排队约30分钟' }}</span>
              </div>
              <div class="w-full h-px bg-amber-100"></div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-medium">🧪 DBE 双气囊小肠镜</span>
                <span class="text-slate-900 font-bold text-[11px]">独立操作室</span>
              </div>
            </div>
          </div>

          <!-- 名医推荐 -->
          <div class="space-y-2.5">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <i class="ri-user-star-line text-amber-600 text-sm"></i> Crohn 顶尖名医
            </h4>
            <div class="space-y-2.5">
              <div v-for="doc in selectedHospital.doctors" :key="doc.name" class="bg-white p-4 rounded-2xl border border-stone-100 flex items-start gap-3.5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 flex items-center justify-center font-black text-amber-700 shrink-0 border border-amber-200/60 text-[16px]">
                  {{ doc.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-baseline flex-wrap gap-1">
                    <span class="text-[14px] font-black text-slate-900 tracking-tight">{{ doc.name }}</span>
                    <span class="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-black">{{ doc.title }}</span>
                  </div>
                  <p class="text-[11.5px] text-slate-500 mt-1.5 font-medium leading-relaxed">
                    <span class="text-slate-400 font-black tracking-wider uppercase text-[9.5px]">擅长 </span>{{ doc.spec }}
                  </p>
                  <div class="flex justify-between items-center mt-3 border-t border-stone-100 pt-2.5 flex-wrap gap-2">
                    <span class="text-[10.5px] text-slate-500 font-bold flex items-center gap-1">
                      <i class="ri-calendar-event-line text-amber-600"></i> {{ doc.time }}
                    </span>
                    <span class="text-[10.5px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-md">
                      患者评分 {{ doc.score }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 避坑就诊指南 -->
          <div class="bg-white rounded-2xl p-4 border border-stone-100 space-y-3">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <i class="ri-book-open-line text-amber-600 text-sm"></i> 保姆级就诊避坑经验
            </h4>
            <div class="space-y-3 text-[12px] text-slate-700 leading-relaxed font-medium">
              <div v-for="(tip, idx) in selectedHospital.tips" :key="idx" class="flex gap-2.5">
                <span class="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center font-black text-amber-700 border border-amber-100 shrink-0 text-[11px]">{{ idx + 1 }}</span>
                <p class="flex-1 pt-0.5">{{ tip }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- CTA -->
        <div class="absolute bottom-0 w-full px-4 py-3 border-t border-stone-100 bg-white/95 backdrop-blur-xl z-20">
          <button
              @click="showDetail = false"
              class="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-3.5 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[13.5px] shadow-[0_8px_20px_-6px_rgba(245,158,11,0.4)]"
          >
            我已知晓指南 · 返回大厅 <i class="ri-arrow-right-up-line"></i>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import http from '@/api/http'

const emit = defineEmits(['change-tab'])

// 地区过滤
const regions = [
  { key: 'all', label: '全国专科' },
  { key: 'shanghai', label: '上海/华东' },
  { key: 'jiangsu', label: '江苏/南京' },
  { key: 'sichuan', label: '四川/华西' },
  { key: 'guangdong', label: '广东/中山' }
]

const activeRegion = ref('all')
const keyword = ref('')
const showDetail = ref(false)
const selectedHospital = ref(null)

const hospitalDatabase = ref([])

const regionLabelMap = Object.fromEntries(regions.map(r => [r.key, r.label]))

onMounted(async () => {
  try {
    const res = await http.get('/hospital/list')
    if (res.status === 200) {
      hospitalDatabase.value = res.data.map(h => ({
        ...h,
        regionLabel: regionLabelMap[h.region] || h.region || '',
        techs: h.techsJson ? JSON.parse(h.techsJson) : [],
        doctors: h.doctorsJson ? JSON.parse(h.doctorsJson) : [],
        tips: h.tipsJson ? JSON.parse(h.tipsJson) : []
      }))
    }
  } catch (e) {
    console.error('医院列表加载失败', e)
  }
})

const filteredHospitals = computed(() => {
  let list = hospitalDatabase.value

  if (activeRegion.value !== 'all') {
    list = list.filter(h => h.region === activeRegion.value)
  }

  if (keyword.value.trim()) {
    const k = keyword.value.toLowerCase().trim()
    list = list.filter(h =>
      h.name.toLowerCase().includes(k) ||
      h.level.toLowerCase().includes(k) ||
      h.summary.toLowerCase().includes(k) ||
      h.techs.some(t => t.toLowerCase().includes(k))
    )
  }

  return list
})

const openDetail = (hosp) => {
  selectedHospital.value = hosp
  showDetail.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
