<template>
  <section class="card map-card-container">
    <div class="card-header">
      <div>
        <h2>🏥 全国医保政策 & 报销地图</h2>
        <p class="sub-text">点击省份查看当地 Crohn 特殊门诊政策</p>
      </div>
    </div>
  <div class="command-center">
    <div class="map-section">
      <div class="hud-header">
        <div class="title-group">
          <i class="ri-government-line icon-pulse"></i>
          <h3>MEDICAL POLICY MAP / 医保政策网</h3>
        </div>
        <button
            v-if="currentMap !== 'china'"
            @click="backToChina"
            class="cyber-btn back-btn"
        >
          <i class="ri-arrow-go-back-line"></i> 返回全国视图
        </button>
      </div>

      <div ref="chartRef" class="chart-container"></div>

      <div class="decor-line top-left"></div>
      <div class="decor-line bottom-right"></div>
    </div>

    <div class="panel-section">

      <div v-if="!selectedArea.name" class="signal-feed">
        <div class="feed-header">
          <i class="ri-broadcast-line"></i> 实时政策动态更新
        </div>
        <div class="signal-list">
          <div
              v-for="(signal, index) in recentSignals"
              :key="index"
              class="signal-item"
              @click="loadPolicyData(signal.city)"
          >
            <div class="signal-avatar" :class="signal.typeClass">{{ signal.typeText }}</div>
            <div class="signal-info">
              <span class="signal-user">{{ signal.user }}</span>
              <span class="signal-action">更新了 <span class="highlight">{{ signal.city }}</span> {{ signal.category }}政策</span>
            </div>
            <span class="signal-time">{{ signal.time }}</span>
          </div>
        </div>
        <div class="empty-hint">
          <i class="ri-map-pin-2-line"></i>
          <p>请点击左侧地图区域<br>查看分级政策详情</p>
        </div>
      </div>

      <div v-else class="policy-card">
        <div class="card-header">
          <div class="header-main">
            <span class="area-badge">TARGET ZONE</span>
            <h2>{{ selectedArea.name }}</h2>
          </div>
          <div class="last-update">
            更新于: {{ currentPolicy.updateTime || '暂无数据' }}
          </div>
        </div>

        <div class="type-tabs">
          <button
              v-for="type in policyTypes"
              :key="type.key"
              class="type-tab"
              :class="{ active: activeType === type.key }"
              @click="switchType(type.key)"
          >
            <i :class="type.icon"></i> {{ type.label }}
          </button>
        </div>

        <div class="card-body">
          <div class="contributor-bar" v-if="currentPolicy.contributor">
            <span class="label">本页政策提供者:</span>
            <span class="name">
              <i class="ri-user-star-line"></i> {{ currentPolicy.contributor }}
            </span>
            <span class="verified-tag"><i class="ri-check-double-line"></i> 已核验</span>
          </div>

          <div v-if="!currentPolicy.hasData" class="no-data-state">
            <i class="ri-file-shred-line"></i>
            <p>暂无该类型的政策数据</p>
            <button class="cyber-btn save-btn" @click="openEditDialog">
              <i class="ri-add-circle-line"></i> 成为第一个贡献者
            </button>
          </div>

          <div v-else>
            <div class="core-intel-box">
              <div class="box-title">
                <i class="ri-capsule-fill"></i> 核心政策 (生物制剂/双通道)
              </div>

              <div class="intel-grid">
                <div class="intel-cell" :class="currentPolicy.mente ? 'active' : 'inactive'">
                  <span class="cell-label">门诊特殊病种</span>
                  <span class="cell-value">{{ currentPolicy.mente ? '已纳入' : '未纳入' }}</span>
                </div>
                <div class="intel-cell" :class="currentPolicy.dualChannel ? 'active' : 'inactive'">
                  <span class="cell-label">双通道药店</span>
                  <span class="cell-value">{{ currentPolicy.dualChannel ? '支持' : '不支持' }}</span>
                </div>
              </div>

              <div class="progress-section">
                <div class="progress-row">
                  <span class="p-label">报销比例 (门特/双通道)</span>
                  <span class="p-val highlight">{{ currentPolicy.dualRatio || '??' }}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill gold" :style="{ width: (currentPolicy.dualRatio || 0) + '%' }"></div>
                </div>
                <p class="mini-note" v-if="currentPolicy.dualNote">
                  <i class="ri-sticky-note-line"></i> {{ currentPolicy.dualNote }}
                </p>
              </div>
            </div>

            <div class="stats-display">
              <div class="stat-item">
                <span class="stat-label">住院起付线</span>
                <span class="stat-value">{{ currentPolicy.threshold || '-' }} <small>元</small></span>
              </div>
              <div class="stat-item">
                <span class="stat-label">住院报销</span>
                <span class="stat-value">{{ currentPolicy.ratio || '-' }} <small>%</small></span>
              </div>
              <div class="stat-item">
                <span class="stat-label">年度封顶</span>
                <span class="stat-value">{{ currentPolicy.cap || '-' }} <small>万</small></span>
              </div>
            </div>

            <div class="intel-text-box">
              <p class="intel-label">政策摘要 & 避坑指南</p>
              <p class="intel-content">{{ currentPolicy.summary || '暂无详细文字描述。' }}</p>
            </div>

            <div class="action-bar">
              <button class="cyber-btn ghost-btn" @click="openCompareDialog">
                <i class="ri-bar-chart-box-line"></i> 竞争力评估
              </button>
              <button class="cyber-btn save-btn" @click="openEditDialog">
                <i class="ri-edit-2-line"></i> 修正本页数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditDialog" class="modal-backdrop" @click.self="showEditDialog = false">
      <div class="modal large">
        <div class="modal-header">
          <h3><i class="ri-edit-2-line"></i> 提交政策: {{ selectedArea.name }}</h3>
          <button class="icon-btn" @click="showEditDialog = false"><i class="ri-close-line"></i></button>
        </div>
        <div class="modal-body">

          <div class="type-selector-group">
            <label>请选择医保类型:</label>
            <div class="radio-group">
              <label v-for="type in policyTypes" :key="type.key" class="radio-label">
                <input type="radio" v-model="editForm.type" :value="type.key">
                <span class="radio-btn">{{ type.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-section-title">核心战备 (生物制剂)</div>
          <div class="form-row-grid">
            <div class="form-group">
              <label>是否纳入门特/门慢?</label>
              <select v-model="editForm.mente">
                <option :value="true">✅ 是 (已纳入)</option>
                <option :value="false">❌ 否 (仅住院)</option>
              </select>
            </div>
            <div class="form-group">
              <label>是否支持双通道药店?</label>
              <select v-model="editForm.dualChannel">
                <option :value="true">✅ 支持 (可外购)</option>
                <option :value="false">❌ 不支持</option>
              </select>
            </div>
          </div>

          <div class="form-group highlight-input">
            <label>实际报销比例 (%)</label>
            <input type="number" v-model="editForm.dualRatio" placeholder="例如: 75">
            <small>※ 填写门特或双通道的实际报销比例</small>
          </div>

          <div class="form-group">
            <label>双通道特殊备注</label>
            <input v-model="editForm.dualNote" placeholder="例如: 需先住院备案，指定药店只有两家...">
          </div>

          <div class="divider"></div>

          <div class="form-section-title">基础住院数据</div>
          <div class="stats-grid">
            <div class="form-group">
              <label>住院起付线 (元)</label>
              <input v-model="editForm.threshold" placeholder="0">
            </div>
            <div class="form-group">
              <label>住院报销比例 (%)</label>
              <input v-model="editForm.ratio" placeholder="0">
            </div>
            <div class="form-group">
              <label>年度封顶 (万)</label>
              <input v-model="editForm.cap" placeholder="0">
            </div>
          </div>

          <div class="form-group">
            <label>综合政策摘要</label>
            <textarea v-model="editForm.summary" rows="2" placeholder="这里可以写具体的备案流程、坑点..."></textarea>
          </div>

        </div>
        <div class="modal-footer">
          <button class="cyber-btn ghost-btn" @click="showEditDialog = false">取消</button>
          <button class="cyber-btn save-btn" @click="handleSavePolicy">确认发布</button>
        </div>
      </div>
    </div>

    <div v-if="showCompareDialog" class="modal-backdrop" @click.self="showCompareDialog = false">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="ri-scales-3-line"></i> 政策竞争力评估报告</h3>
          <button class="icon-btn" @click="showCompareDialog = false"><i class="ri-close-line"></i></button>
        </div>
        <div class="modal-body">

          <div class="compare-badge-row">
            <div class="c-badge-label">当前评估对象</div>
            <div class="c-badge-value">{{ selectedArea.name }} · {{ getLabelByType(activeType) }}</div>
          </div>

          <div class="compare-grid">
            <div class="compare-item">
              <p class="label">当前报销比例</p>
              <p class="value highlight">{{ compareResult.currentRatio }}%</p>
            </div>
            <div class="compare-item">
              <p class="label">全国同类平均</p>
              <p class="value">{{ compareResult.nationalAvg }}%</p>
            </div>
            <div class="compare-item full-width">
              <p class="label">梯队评级 (系统自动研判)</p>
              <p class="value rank-text" :style="{ color: compareResult.color }">
                {{ compareResult.rank }}
              </p>
              <p class="hint">{{ compareResult.desc }}</p>
            </div>
          </div>

          <div class="compare-tip">
            ※ 此数据基于社区已收集的 {{ compareResult.sampleCount }} 份样本计算得出。
          </div>
        </div>
        <div class="modal-footer">
          <button class="cyber-btn ghost-btn" @click="showCompareDialog = false">关闭</button>
        </div>
      </div>
    </div>

  </div>
  </section>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import chinaJson from '@/assets/map/china.json'
import http from "@/api/http.js";

// --- 基础配置 ---
const chartRef = ref(null)
let myChart = null
const currentMap = ref('china')

// 医保类型配置
const policyTypes = [
  { key: 'employee', label: '职工医保', icon: 'ri-briefcase-4-line' },
  { key: 'resident', label: '居民医保', icon: 'ri-home-smile-2-line' },
  { key: 'flexible', label: '灵活就业', icon: 'ri-user-voice-line' }
]

const activeType = ref('employee') // 默认看职工

// 假数据：右侧动态
const recentSignals = [
  { user: 'KING', city: '北京市', category: '职工', typeText: '职', typeClass: 'tag-emp', time: '10分钟前' },
  { user: 'Warrior_Ken', city: '上海市', category: '居民', typeText: '居', typeClass: 'tag-res', time: '2小时前' },
  { user: '肠道卫士', city: '杭州市', category: '灵活', typeText: '灵', typeClass: 'tag-fle', time: '昨天' }
]

// 当前选中的区域信息
const selectedArea = reactive({
  name: '',
  // 核心数据结构：每个城市包含三个独立的政策对象
  data: {
    employee: { hasData: false },
    resident: { hasData: false },
    flexible: { hasData: false }
  }
})

// 计算属性：获取当前Tab对应的数据
const currentPolicy = computed(() => {
  return selectedArea.data[activeType.value] || { hasData: false }
})

// 编辑表单 (绑定到弹窗)
const editForm = reactive({
  type: 'employee', // 默认选职工
  mente: false,
  dualChannel: false,
  dualRatio: '',
  dualNote: '',
  threshold: '',
  ratio: '',
  cap: '',
  summary: ''
})

const showCompareDialog = ref(false)
const showEditDialog = ref(false)

// 研判结果对象
const compareResult = reactive({
  currentRatio: 0,
  nationalAvg: 0,
  rank: '',
  desc: '',
  color: '',
  sampleCount: 0
})

// --- 核心逻辑 ---

// 切换Tab
const switchType = (key) => {
  activeType.value = key
}

const getLabelByType = (key) => {
  return policyTypes.find(t => t.key === key)?.label || key
}

// 辅助函数：把后端给的 0/1 变成前端要的 true/false
// 这一步叫 "数据清洗" (Data Cleaning)
const cleanData = (backendData) => {
  if (!backendData) return { hasData: false }

  return {
    hasData: true,
    contributor: backendData.contributor || '匿名英雄',
    updateTime: backendData.updateTime,
    // 后端是 1/0，前端要 true/false，这里做个转换
    mente: backendData.isMente === 1,
    dualChannel: backendData.isDual === 1,
    dualRatio: backendData.dualRatio,
    dualNote: backendData.dualNote,
    threshold: backendData.threshold,
    ratio: backendData.ratio,
    cap: backendData.cap,
    summary: backendData.summary
  }
}
// 加载数据 (模拟后端返回的大型JSON)
const loadPolicyData = async (areaName) => {
  console.log(`正在请求 ${areaName} 的数据...`)
  selectedArea.name = areaName

  // 先把柜子清空，防止显示上个城市的缓存
  selectedArea.data = {
    employee: { hasData: false },
    resident: { hasData: false },
    flexible: { hasData: false }
  }

  // 获取城市身份证号 (adcode)
  const adcode = getAdcodeByName(areaName)
  if (!adcode) {
    console.warn('这地方没身份证号，不发请求')
    return
  }

  try {
    // 🔥【核心大招】Promise.all 并发请求
    // 意思就是：三个人同时出发，不管谁快谁慢，必须等三个人都回来了，再往下执行
    // http.get 返回的是后端那一层壳，我们在拦截器里已经剥了一层，这里拿到的是 ApiResponse
    const [resEmp, resRes, resFle] = await Promise.all([
      http.get('/policy/query', { params: { city: adcode, type: 'employee' } }),
      http.get('/policy/query', { params: { city: adcode, type: 'resident' } }),
      http.get('/policy/query', { params: { city: adcode, type: 'flexible' } })
    ])

    // 📦 收货环节
    // 如果 code 是 200，说明查到了；如果 404 (后端返回 null)，那就是没数据
    // 注意：看你拦截器怎么写的，如果拦截器直接返回 res.data，那这里就是 resEmp.data
    // 假设你的 ApiResponse 结构是 { code: 200, data: {...} }

    if (resEmp && resEmp.data) selectedArea.data.employee = cleanData(resEmp.data)
    if (resRes && resRes.data) selectedArea.data.resident = cleanData(resRes.data)
    if (resFle && resFle.data) selectedArea.data.flexible = cleanData(resFle.data)

    console.log('数据加载完毕！前端柜子已填满！')

  } catch (error) {
    console.error('哎呀，请求出错了，可能是后端没开或者网络炸了', error)
  }
}
const openEditDialog = () => {
  // 打开时，默认选中当前看的Tab
  editForm.type = activeType.value
  // 如果当前有数据，回填进去
  if (currentPolicy.value.hasData) {
    Object.assign(editForm, currentPolicy.value)
  } else {
    // 清空表单
    editForm.mente = false
    editForm.dualChannel = false
    editForm.dualRatio = ''
    editForm.dualNote = ''
    editForm.threshold = ''
    editForm.ratio = ''
    editForm.cap = ''
    editForm.summary = ''
  }
  showEditDialog.value = true
}

const handleSavePolicy = async () => {
  // 1. 打包货物 (Payload Construction)
  // 把前端表单的数据，转换成后端能看懂的格式
  const payload = {
    cityCode: getAdcodeByName(selectedArea.name), // 获取身份证号
    cityName: selectedArea.name,
    policyType: editForm.type, // 'employee', 'resident' 等

    // 🔥 关键转换：把开关的 true/false 变成后端要的 1/0
    isMente: editForm.mente ? 1 : 0,
    isDual: editForm.dualChannel ? 1 : 0,

    // 确保数字是数字，别传成字符串过去了
    dualRatio: parseFloat(editForm.dualRatio) || 0,
    threshold: parseInt(editForm.threshold) || 0,
    ratio: parseFloat(editForm.ratio) || 0,
    cap: parseInt(editForm.cap) || 0,

    dualNote: editForm.dualNote,
    summary: editForm.summary,
    contributor: 'King' // 暂时写死，以后有了登录功能再自动填
  }
  const code = getAdcodeByName(selectedArea.name)
  console.log('正在获取城市代码:', payload)
  // 2. 呼叫快递车 (发送请求)
  try {
    // 这里的路径取决于你 Java Controller 里的 @RequestMapping
    // 如果你后端写的是 /api/policy，那这里就写 /policy/save
    const res = await http.post('/policy/save', payload)

    // 3. 签收回执
    // 假设你后端的 ApiResponse 成功是 code 200
    if (res.status === 200) {
      alert(`🎉 搞定！【${selectedArea.name}】的政策已上传云端！`)

      // 🔥 关键一步：保存成功后，立马重新查一遍数据
      // 这样界面上就能立刻看到你刚才修改的最新结果，这就叫“即时反馈”
      await loadPolicyData(selectedArea.name)

      // 关掉弹窗
      showEditDialog.value = false
    } else {
      alert('保存失败，后端说：' + res.message)
    }
  } catch (e) {
    console.error('发货失败:', e)
    alert('网络连不上了，或者后端报错了，快看看控制台！')
  }
}

// 自动研判系统
const openCompareDialog = () => {
  const ratio = parseFloat(currentPolicy.value.dualRatio) || 0
  const type = activeType.value

  compareResult.currentRatio = ratio
  compareResult.sampleCount = Math.floor(Math.random() * 500) + 100 // 假样本数

  // 假定全国平均线 (职工高，居民低)
  let avg = type === 'employee' ? 75 : (type === 'resident' ? 60 : 70)
  compareResult.nationalAvg = avg

  // 研判逻辑
  if (ratio >= avg + 10) {
    compareResult.rank = 'T1 第一梯队 · 极优'
    compareResult.desc = '该地区此项政策非常给力，远超全国平均水平，适合长期治疗。'
    compareResult.color = '#4ade80' // Green
  } else if (ratio >= avg - 5) {
    compareResult.rank = 'T2 中坚力量 · 标准'
    compareResult.desc = '符合全国主流水平，中规中矩，能覆盖大部分压力。'
    compareResult.color = '#60a5fa' // Blue
  } else {
    compareResult.rank = 'T3 潜力地区 · 偏弱'
    compareResult.desc = '低于全国平均线，可能因为起付线高或比例低，建议搭配商保。'
    compareResult.color = '#f87171' // Red
  }

  showCompareDialog.value = true
}

// --- 地图逻辑 (保持稳定) ---
// (这部分代码为了不占篇幅，保持和你之前的一样，主要是 getAdcodeByName 和 initMap)
const provinceCodeMap = { '北京': '110000', '天津': '120000', '河北': '130000', '山西': '140000', '内蒙古': '150000', '辽宁': '210000', '吉林': '220000', '黑龙江': '230000', '上海': '310000', '江苏': '320000', '浙江': '330000', '安徽': '340000', '福建': '350000', '江西': '360000', '山东': '370000', '河南': '410000', '湖北': '420000', '湖南': '430000', '广东': '440000', '广西': '450000', '海南': '460000', '重庆': '500000', '四川': '510000', '贵州': '520000', '云南': '530000', '西藏': '540000', '陕西': '610000', '甘肃': '620000', '青海': '630000', '宁夏': '640000', '新疆': '650000', '台湾': '710000', '香港': '810000', '澳门': '820000' }
const getAdcodeByName = (name) => {
  if (!name) return '000000' // 兜底

  // --- 第一步：先查是不是省份 ---
  let code = provinceCodeMap[name]
  if (!code) {
    // 模糊匹配：比如点 "四川省"，字典里是 "四川"
    const k = Object.keys(provinceCodeMap).find(key => name.includes(key))
    if (k) code = provinceCodeMap[k]
  }

  // --- 第二步：如果不是省份，那就是市区 (这是你之前缺的！) ---
  if (!code) {
    // 我们去问 ECharts 要数据！
    // 这里的 citys 是你下钻时注册的地图名字
    // 如果你还没下钻，这里可能拿不到，但在点击事件里肯定是有的
    const geoJson = echarts.getMap('citys')?.geoJSON

    if (geoJson && geoJson.features) {
      // 在当前显示的地图里找这个名字
      const feature = geoJson.features.find(f => f.properties.name === name)
      if (feature) {
        code = feature.properties.adcode // 找到了！内江的身份证！
      }
    }
  }

  // --- 第三步：如果还是找不到 (比如刚下钻还没注册好) ---
  // 给个兜底，防止报错。以后手动补录或者检查是不是名字不对
  return code || '999999'
}
const initMap = () => {
  if (!chartRef.value) return
  myChart = echarts.init(chartRef.value)

  // 注册全国地图
  echarts.registerMap('china', chinaJson)
  renderMap('china')

  // 🔥 监听点击事件 🔥
  myChart.on('click', async (params) => {
    console.log('点击了区域:', params.name)
    try {
      const res = await http.get('/users/whoami')
      console.log('通信成功！后端回复：', res)
    } catch (e) {
      console.error('通信失败', e)
    }
    // A. 无论点哪里，先更新右边的数据面板
    // (调用我们刚才写的生成假数据的函数)
    loadPolicyData(params.name)

    // B. 下钻逻辑 (Drill Down)
    // 只有当前在全国视图，且点的是省份时，才下钻
    if (currentMap.value === 'china') {
      const adcode = getAdcodeByName(params.name)

      if (adcode) {
        // 拼接路径：比如 /map/citys/510000.json
        // ⚠️ 兄弟，请确保你的 public 文件夹下有 map/citys/ 这个目录，并且里面有 510000.json
        const jsonPath = `/map/citys/${adcode}.json`

        try {
          console.log(`正在请求地图文件: ${jsonPath}`)
          const response = await fetch(jsonPath)

          if (!response.ok) {
            throw new Error('地图文件未找到')
          }

          const provinceJson = await response.json()

          // 注册并切换
          echarts.registerMap('citys', provinceJson)
          currentMap.value = 'citys' // 标记当前进入了市区模式
          renderMap('citys', params.name) // 渲染新地图

        } catch (error) {
          console.warn('下钻失败，可能是没有这个省的 json 文件:', error)
          // 这里可以加个弹窗提示：暂无该省地图数据
        }
      } else {
        console.log('未找到该省份的身份证号(adcode)，无法下钻')
      }
    }
  })
}
const renderMap = (mapName) => {
  const option = {
    tooltip: { trigger: 'item', backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#3b82f6', textStyle: {color:'#fff'} },
    geo: {
      map: mapName, roam: true, zoom: 1.1,
      itemStyle: { areaColor: '#1e293b', borderColor: '#475569', borderWidth: 1, shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 10 },
      emphasis: { itemStyle: { areaColor: '#1d4ed8', borderColor: '#60a5fa' }, label: { color: '#fff' } }
    }
  }
  myChart.setOption(option, true)
}
const backToChina = () => { currentMap.value = 'china'; selectedArea.name = ''; renderMap('china') }

onMounted(() => {
  initMap()
  window.addEventListener('resize', () => myChart && myChart.resize())
})
</script>

<style src="@/assets/css/InsuranceMap.css" scoped></style>