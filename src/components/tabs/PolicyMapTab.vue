<template>
  <div class="min-h-screen bg-slate-50 p-4 font-sans text-slate-700">

    <header class="mb-4 flex items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-blue-200 shadow-lg">
          <i class="ri-government-fill text-xl"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 tracking-tight">全国医保政策 & 吐槽地图</h1>
          <p class="text-xs text-slate-400">Crohn Kingdom Policy Database</p>
        </div>
      </div>

      <button
          v-if="currentMap !== 'china' && !showDetailPanel"
          @click="backToChina"
          class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-100 hover:text-blue-600 transition-all border border-slate-200"
      >
        <i class="ri-arrow-go-back-line"></i> 返回全国
      </button>
    </header>

    <main class="relative h-[85vh] w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">

      <div v-show="!showDetailPanel" class="h-full w-full relative group">
        <div ref="chartRef" class="h-full w-full"></div>

        <div class="absolute bottom-6 right-6 pointer-events-none bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow border border-slate-100 text-sm text-slate-500">
          <i class="ri-fingerprint-line mr-1"></i> 点击省份下钻，点击城市查看详情
        </div>
      </div>

      <div v-if="showDetailPanel" class="absolute inset-0 z-20 flex flex-col bg-slate-50">

        <div class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div class="flex items-center gap-4">
            <button @click="closeDetailPanel" class="rounded-full p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
              <i class="ri-arrow-left-line text-xl"></i>
            </button>
            <div>
              <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {{ selectedArea.name }}
                <span class="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100">Target Zone</span>
              </h2>
              <p class="text-xs text-slate-400">数据最后更新: {{ currentPolicy.updateTime || '刚刚' }}</p>
            </div>
          </div>

          <div class="flex rounded-lg bg-slate-100 p-1">
            <button
                v-for="type in policyTypes"
                :key="type.key"
                @click="switchType(type.key)"
                :class="[
                'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                activeType === type.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              <i :class="type.icon"></i> {{ type.label }}
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">

          <div class="w-2/3 overflow-y-auto p-8">
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm text-slate-400 mb-1">门诊特殊病种</div>
                <div class="flex items-center gap-2">
                  <div :class="`h-3 w-3 rounded-full ${currentPolicy.mente ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-xl font-bold text-slate-800">{{ currentPolicy.mente ? '已纳入' : '未纳入' }}</span>
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm text-slate-400 mb-1">双通道药店</div>
                <div class="flex items-center gap-2">
                  <div :class="`h-3 w-3 rounded-full ${currentPolicy.dualChannel ? 'bg-green-500' : 'bg-red-500'}`"></div>
                  <span class="text-xl font-bold text-slate-800">{{ currentPolicy.dualChannel ? '支持外购' : '不支持' }}</span>
                </div>
              </div>
            </div>

            <div class="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-200">
              <div class="flex justify-between items-end mb-2">
                <span class="text-blue-100 font-medium">实际报销比例</span>
                <span class="text-4xl font-bold">{{ currentPolicy.dualRatio || '0' }}<span class="text-xl">%</span></span>
              </div>
              <div class="h-3 w-full rounded-full bg-black/20 overflow-hidden">
                <div class="h-full bg-white/90 rounded-full" :style="{ width: (currentPolicy.dualRatio || 0) + '%' }"></div>
              </div>
              <p class="mt-3 text-sm text-blue-100 opacity-80" v-if="currentPolicy.dualNote">
                <i class="ri-information-line"></i> 备注: {{ currentPolicy.dualNote }}
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-6">
              <h3 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i class="ri-book-open-line text-blue-500"></i> 避坑指南 & 摘要
              </h3>
              <p class="text-slate-600 leading-relaxed text-sm">
                {{ currentPolicy.summary || '暂无详细描述，快来点击下方按钮补充第一手情报！' }}
              </p>
            </div>

            <div class="mt-8 flex gap-4">
              <button @click="openEditDialog" class="flex-1 rounded-lg bg-slate-800 py-3 text-white hover:bg-slate-700 transition font-medium shadow-lg shadow-slate-200">
                <i class="ri-edit-2-line mr-1"></i> 我要修正数据 / 补充情报
              </button>
            </div>
          </div>

          <div class="w-1/3 border-l border-slate-200 bg-slate-50 flex flex-col">
            <div class="p-4 border-b border-slate-200 bg-white/50 backdrop-blur">
              <h3 class="font-bold text-slate-700">💊 病友阵地</h3>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-for="i in 3" :key="i" class="flex gap-3">
                <div class="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">User</div>
                <div class="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-slate-100 text-sm text-slate-600">
                  <p>内江的报销太难跑了，二院那个窗口今天又没人！</p>
                  <div class="mt-2 flex gap-3 text-xs text-slate-400">
                    <span>10分钟前</span>
                    <span class="hover:text-blue-600 cursor-pointer">回复</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-white border-t border-slate-200">
              <div class="relative">
                <input type="text" placeholder="发射一句吐槽..." class="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                <button class="absolute right-1 top-1 rounded-full h-8 w-8 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                  <i class="ri-send-plane-fill text-xs"></i>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import chinaJson from '@/assets/map/china.json'
import http from "@/api/http.js";

// --- 状态 ---
const chartRef = ref(null)
let myChart = null
const currentMap = ref('china')

// 🔥 核心状态：是否显示详情面板
// 当这个为 true 时，地图隐藏，显示详情页
const showDetailPanel = ref(false)

// 医保类型配置
const policyTypes = [
  { key: 'employee', label: '职工医保', icon: 'ri-briefcase-4-line' },
  { key: 'resident', label: '居民医保', icon: 'ri-home-smile-2-line' },
  { key: 'flexible', label: '灵活就业', icon: 'ri-user-voice-line' }
]
const activeType = ref('employee')

// 当前选中的区域信息
const selectedArea = reactive({
  name: '',
  data: {
    employee: { hasData: false },
    resident: { hasData: false },
    flexible: { hasData: false }
  }
})

// 计算属性
const currentPolicy = computed(() => selectedArea.data[activeType.value] || { hasData: false })

// --- 逻辑方法 ---

const switchType = (key) => activeType.value = key

// 关闭详情页，回到地图（但不一定是回全国，可能是回省图）
const closeDetailPanel = () => {
  showDetailPanel.value = false
  // 此时地图容器 v-show 会变回 true，ECharts 依然健在
  // 稍微延迟一下 resize，防止布局变化导致图表变形
  setTimeout(() => myChart && myChart.resize(), 100)
}

// 返回全国
const backToChina = () => {
  currentMap.value = 'china'
  selectedArea.name = ''
  showDetailPanel.value = false // 确保关闭详情
  renderMap('china')
}

// 数据加载逻辑 (和之前一样，不改动)
const cleanData = (backendData) => {
  if (!backendData) return { hasData: false }
  return {
    hasData: true,
    contributor: backendData.contributor || '匿名英雄',
    updateTime: backendData.updateTime,
    mente: backendData.isMente === 1,
    dualChannel: backendData.isDual === 1,
    dualRatio: backendData.dualRatio,
    dualNote: backendData.dualNote,
    summary: backendData.summary
  }
}

const loadPolicyData = async (areaName) => {
  console.log(`正在请求 ${areaName} 的数据...`)
  selectedArea.name = areaName

  // 清空缓存
  selectedArea.data = { employee: { hasData: false }, resident: { hasData: false }, flexible: { hasData: false } }

  // 模拟发请求 (你之前的逻辑)
  // 暂时先 Mock 一下，方便你直接看效果
  setTimeout(() => {
    selectedArea.data.employee = {
      hasData: true, mente: true, dualChannel: false, dualRatio: 45, dualNote: '需要三甲医院备案', summary: '内江职工医保报销较严，建议去新桥。', updateTime: '2026-01-29'
    }
  }, 500)
}

// --- 地图逻辑 (你的核心资产) ---
// 省份代码映射 (保留)
const provinceCodeMap = { '北京': '110000', '四川': '510000', '重庆': '500000', '广东': '440000' } // ...其他省略

const getAdcodeByName = (name) => {
  let code = provinceCodeMap[name]
  if (!code) {
    const geoJson = echarts.getMap('citys')?.geoJSON
    const feature = geoJson?.features.find(f => f.properties.name === name)
    if (feature) code = feature.properties.adcode
  }
  return code || '999999'
}

const initMap = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)
  echarts.registerMap('china', chinaJson)
  renderMap('china')

  myChart.on('click', async (params) => {
    console.log('点击了:', params.name)

    // 1. 先去后台拉数据
    await loadPolicyData(params.name)

    // 2. 判断逻辑
    if (currentMap.value === 'china') {
      // 如果在全国地图，点击了省份 -> 下钻
      const adcode = getAdcodeByName(params.name)
      if (adcode && adcode !== '999999') {
        try {
          // 这里演示用的假路径，你需要确保文件存在
          const response = await fetch(`/map/citys/${adcode}.json`)
          const provinceJson = await response.json()
          echarts.registerMap('citys', provinceJson)
          currentMap.value = 'citys'
          renderMap('citys', params.name)
        } catch (e) {
          console.warn('无该省地图数据，但这不影响查看政策', e)
          // 哪怕没地图数据，也要显示详情！
          showDetailPanel.value = true
        }
      } else {
        // 直辖市或未配置的省，直接显示详情
        showDetailPanel.value = true
      }
    } else {
      // 如果已经在省份地图了 (例如在四川地图)，点击了内江 -> 开启详情页，隐藏地图
      showDetailPanel.value = true
    }
  })
}

const renderMap = (mapName) => {
  // 既然换了风格，地图配色也要改改，改成清新的蓝色系
  const option = {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e2e8f0', textStyle: {color:'#1e293b'} },
    geo: {
      map: mapName, roam: true, zoom: 1.1,
      label: { show: true, color: '#64748b' }, // 灰色文字
      itemStyle: {
        areaColor: '#f1f5f9', // 浅灰底色
        borderColor: '#cbd5e1', // 边框
        borderWidth: 1,
        shadowColor: 'rgba(0,0,0,0.05)', shadowBlur: 4
      },
      emphasis: {
        itemStyle: { areaColor: '#bfdbfe', borderColor: '#3b82f6' }, // 选中变浅蓝
        label: { color: '#1e40af' }
      }
    }
  }
  myChart.setOption(option, true)
}

onMounted(() => {
  initMap()
  window.addEventListener('resize', () => myChart && myChart.resize())
})
</script>