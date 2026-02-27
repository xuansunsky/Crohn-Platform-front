<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">

    <header class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <div>
            <h1 class="text-base font-bold text-gray-900 leading-tight">BioHazard</h1>
            <p class="text-[10px] text-gray-500">IBD 饮食情报库</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Xuan" alt="User">
        </div>
      </div>

      <div class="px-4 pb-3">
        <div class="relative">
          <i class="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
          <input
              v-model="keyword"
              type="text"
              placeholder="搜索品牌或食物 (如: KFC)"
              class="w-full bg-gray-100 text-gray-900 text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border border-transparent focus:border-blue-500"
          >
        </div>
      </div>
    </header>

    <main class="p-4 space-y-4">
      <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
        <i class="ri-inbox-line text-4xl mb-2"></i>
        <p class="text-sm">没有找到相关情报</p>
      </div>

      <div v-for="item in filteredList" :key="item.id"
           @click="openDetail(item)"
           class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform duration-200 cursor-pointer">

        <div class="flex gap-4">
          <div class="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
            <img :src="item.image" class="w-full h-full object-cover">
            <div v-if="item.type === 'danger'" class="absolute top-0 left-0 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-br-lg font-bold">高危</div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-base font-bold text-gray-900 truncate pr-2">{{ item.product }}</h3>
                <p class="text-xs text-gray-500 mt-0.5 font-medium">{{ item.brand }}</p>
              </div>
              <div class="flex flex-col items-end">
                 <span class="text-lg font-bold"
                       :class="item.type === 'danger' ? 'text-red-500' : (item.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')">
                   {{ item.safeRate }}%
                 </span>
                <span class="text-[9px] text-gray-400">安全率</span>
              </div>
            </div>

            <p class="text-xs text-gray-600 mt-2 line-clamp-1 bg-gray-50 p-1.5 rounded">
              {{ item.desc }}
            </p>

            <div class="flex justify-between items-center mt-3">
              <div class="flex gap-1.5">
                <span v-for="tag in item.tags" :key="tag"
                      class="text-[10px] px-1.5 py-0.5 rounded border"
                      :class="getBadgeStyle(item.type)">
                  {{ tag }}
                </span>
              </div>
              <span class="text-[10px] text-gray-400"><i class="ri-group-line"></i> {{ item.voteCount }}人评</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="fixed bottom-6 right-6 z-30">
      <button
          @click="showUploadModal = true"
          class="w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all"
      >
        <i class="ri-add-line text-2xl"></i>
      </button>
    </div>

    <div v-if="showDetailModal && currentFood" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div @click="showDetailModal = false" class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div class="bg-gray-50 w-full sm:w-[500px] h-[90vh] sm:rounded-2xl rounded-t-2xl relative z-10 animate-slide-up shadow-2xl flex flex-col overflow-hidden">

        <div class="bg-white flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
          <div class="flex flex-col">
            <h3 class="text-lg font-bold text-gray-900">{{ currentFood.brand }} - {{ currentFood.product }}</h3>
          </div>
          <button @click="showDetailModal = false" class="text-gray-400 bg-gray-100 p-1.5 rounded-full"><i class="ri-close-line text-xl"></i></button>
        </div>

        <div class="overflow-y-auto flex-1 p-4 space-y-4">

          <div class="bg-white p-4 rounded-xl shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-xs text-gray-500">综合安全评估</p>
                <div class="flex items-baseline gap-1 mt-1">
                   <span class="text-3xl font-black" :class="currentFood.type === 'danger' ? 'text-red-500' : (currentFood.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')">
                     {{ currentFood.safeRate }}%
                   </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">总计测评</p>
                <p class="text-lg font-bold text-gray-800">{{ currentFood.voteCount }} 人</p>
              </div>
            </div>

            <div class="space-y-2 mt-2 border-t pt-4">
              <p class="text-xs font-bold text-gray-800 mb-2">身体反馈分布</p>
              <div v-for="level in levels" :key="level.val" class="flex items-center gap-2 text-xs">
                <span class="w-16 text-right text-gray-500 truncate">{{ level.name.split('·')[0] }}</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full"
                       :class="level.bgClass"
                       :style="`width: ${ (getLevelCount(level.val) / currentFood.voteCount) * 100 }%`">
                  </div>
                </div>
                <span class="w-8 text-gray-700 font-medium">{{ getLevelCount(level.val) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
              <i class="ri-message-3-line"></i> 最新战报 ({{ currentFoodReports.length }})
            </h4>

            <div class="space-y-3">
              <div v-for="report in currentFoodReports" :key="report.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center gap-3">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.userName}`" class="w-10 h-10 rounded-full bg-gray-100 shrink-0">

                    <div class="flex flex-col gap-0.5">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-gray-700">{{ report.userName }}</span>

                        <div class="px-1.5 py-0.5 rounded text-[9px] font-black tracking-tighter" :class="getLevelStyle(report.levelId)">
                          {{ getLevelInfo(report.levelId).name.split('·')[1] }}
                        </div>
                      </div>

                      <span v-if="report.location" class="text-[9px] text-gray-400">
          <i class="ri-map-pin-line text-blue-400"></i> {{ report.location }}
        </span>
                    </div>
                  </div>

                  <span class="text-[10px] text-gray-400">{{ report.time }}</span>
                </div>

                <p class="text-xs text-gray-600 leading-relaxed pl-[3.25rem] mt-1">
                  {{ report.content }}
                </p>
              </div>

              <div v-if="currentFoodReports.length === 0" class="text-center py-6 text-gray-400 text-xs">
                还没有病友留下文字战报，快来抢首发！
              </div>
            </div>
          </div>

        </div>

        <div class="bg-white p-3 border-t border-gray-100 shrink-0">
          <button @click="openUploadFromDetail" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all">
            我也吃过，来写战报
          </button>
        </div>
      </div>
    </div>


    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div @click="showUploadModal = false" class="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"></div>

      <div class="bg-white/95 w-full sm:w-[480px] sm:rounded-2xl rounded-t-2xl p-6 relative z-10 animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-2 border-b border-gray-100">
          <h3 class="text-lg font-black text-gray-900 tracking-tight">发布实测情报</h3>
          <button @click="showUploadModal = false" class="text-gray-400 hover:bg-gray-100 hover:text-gray-700 p-1.5 rounded-full transition-colors">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1.5">品牌/餐厅</label>
              <input v-model="formData.brand" type="text" placeholder="肯德基" class="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1.5">食物单品</label>
              <input v-model="formData.product" type="text" placeholder="吮指原味鸡" class="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5 flex justify-between">
              <span>实测图片 (选填)</span>
              <span v-if="isUploading" class="text-blue-500 animate-pulse"><i class="ri-loader-4-line animate-spin"></i> 上传中...</span>
            </label>

            <div @click="triggerFileInput" class="relative w-full h-32 bg-gray-50/50 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden">
              <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*">

              <div v-if="!formData.coverImg" class="text-center transition-transform group-hover:scale-105">
                <i class="ri-image-add-line text-3xl text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                <p class="text-[11px] font-medium text-gray-400 mt-2">点击上传食物照片</p>
              </div>

              <img v-else :src="formData.coverImg" class="absolute inset-0 w-full h-full object-cover" />

              <button v-if="formData.coverImg" @click.stop="formData.coverImg = ''" class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-red-500 transition-colors">
                <i class="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5">评论(您感觉吃了咋样？)</label>
            <textarea v-model="formData.content" rows="2" placeholder="比如：我只要了微辣，吃完还是拉肚子了..." class="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-2">身体反馈 (做个明白人)</label>
            <div class="space-y-2.5">
              <div v-for="level in levels" :key="level.val"
                   @click="formData.level = level.val"
                   :class="[
             'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none',
             formData.level === level.val ? level.activeClass + ' shadow-md scale-[1.01]' : 'border-transparent bg-gray-50/80 hover:bg-gray-100'
           ]">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm" :class="level.iconBg">{{ level.icon }}</div>
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-0.5">
                    <span class="text-sm font-black text-gray-800">{{ level.name }}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50">{{ level.impact }}</span>
                  </div>
                  <p class="text-[11px] text-gray-500 font-medium">{{ level.desc }}</p>
                </div>
                <i v-if="formData.level === level.val" class="ri-checkbox-circle-fill text-2xl drop-shadow-sm"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5">消费门店/位置 (周边美食扫描)</label>
            <div class="relative">
              <div class="flex gap-2 relative">
                <i class="ri-map-pin-2-line absolute left-3 top-3 text-gray-400 z-10"></i>
                <input
                    v-model="formData.location"
                    type="text"
                    placeholder="点击右侧按钮扫描附近餐厅，或手动输入..."
                    class="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                >
                <button @click="fetchNearby" :disabled="isLocating" class="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-70">
                  <i :class="isLocating ? 'ri-loader-4-line animate-spin' : 'ri-radar-line text-sm'"></i>
                  {{ isLocating ? '扫描中' : '扫描附近' }}
                </button>
              </div>

              <div v-if="poiList.length > 0" class="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-56 overflow-y-auto custom-scrollbar animate-slide-up">
                <div class="sticky top-0 bg-gray-50/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold text-gray-400 border-b border-gray-100 flex justify-between">
                  <span>为你探测到以下门店</span>
                  <span @click="poiList = []" class="text-blue-500 cursor-pointer hover:underline">关闭</span>
                </div>

                <div
                    v-for="poi in poiList" :key="poi.id"
                    @click="selectPoi(poi)"
                    class="p-3 border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <div class="font-bold text-sm text-gray-800">{{ poi.title }}</div>
                  <div class="text-[11px] text-gray-400 mt-1 flex justify-between items-center">
                    <span class="truncate pr-2">{{ poi.address }}</span>
                    <span class="text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded">距你 {{ poi._distance }}m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button @click="submitForm" class="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-gray-900/20 hover:shadow-xl active:scale-[0.98] transition-all">
            🚀 发布实测情报
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
const fileInput = ref(null)
import http from "@/api/http.js";
onMounted(() => {
  fetchFoodList()
})
// --- 📍 LBS 雷达探测逻辑 ---
const poiList = ref([]) // 存附近餐厅的数据列表

const fetchNearby = () => {
  isLocating.value = true
  poiList.value = [] // 重新扫描前先清空旧数据

  // 1. 调用浏览器底层硬件，获取你的经纬度
  if (!navigator.geolocation) {
    alert("老哥，你的浏览器不支持定位！")
    isLocating.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        console.log(`拿到你的坐标了：纬度 ${lat}, 经度 ${lng}`)

        // 2. 构造 JSONP 黑客级跨域请求，直接偷腾讯地图的数据
        const tencentKey = 'PBBBZ-R7ZKM-W5X6A-6PYR4-Z3XB6-PFFGM' // 你的兵符
        const callbackName = 'jsonp_callback_' + Date.now() // 随机生成一个函数名

        // 在全局对象(window)上挂载一个函数，等腾讯把数据传过来调用
        window[callbackName] = (res) => {
          if (res.status === 0) {
            console.log("🔥 腾讯云返回的周边美食：", res.data)
            poiList.value = res.data // 瞬间把数据塞进 Vue，页面列表自动渲染！
          } else {
            alert("拉取周边数据失败：" + res.message)
          }
          isLocating.value = false
          delete window[callbackName] // 脏活干完，立刻销毁证据！
        }
        const searchKeyword = formData.value.location
            ? encodeURIComponent(formData.value.location)
            : encodeURIComponent('美食')
        // 3. 动态创建 script 标签，注入请求！
        const script = document.createElement('script')
        // 参数解释：keyword=美食(过滤掉网吧洗脚城)，boundary=nearby(方圆1000米)
        script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${searchKeyword}&boundary=nearby(${lat},${lng},3000)&key=${tencentKey}&output=jsonp&callback=${callbackName}`
        document.body.appendChild(script)

        // 请求发出去后，把标签从 DOM 里删掉（毁尸灭迹）
        script.onload = () => document.body.removeChild(script)
        script.onerror = () => {
          alert("网络请求被拦截，请检查是否在本地 localhost 测试")
          isLocating.value = false
          document.body.removeChild(script)
        }
      },
      (error) => {
        console.warn(error)
        alert("定位失败！请确保你给浏览器开了【获取位置】的权限！")
        isLocating.value = false
      },
      { enableHighAccuracy: true, timeout: 5000 } // 开启高精度模式
  )
}

// 选中列表里的一家店
const selectPoi = (poi) => {
  // 把店名填进输入框
  formData.value.location = poi.title
  // 选完之后关闭列表
  poiList.value = []
}
// ==========================================
// 1. 分级常量定义 (新增了 bgClass 用于渲染进度条)
// ==========================================
const levels = [
  { val: 1, name: '绿区·安全屋', impact: '毫无波澜', desc: '放心吃，肠道稳如老狗。', icon: '🍃', iconBg: 'bg-emerald-100', bgClass: 'bg-emerald-500', activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
  { val: 2, name: '黄区·试探线', impact: '轻微胀气', desc: '有点动静，但在可控范围内。', icon: '💨', iconBg: 'bg-amber-100', bgClass: 'bg-amber-400', activeClass: 'border-amber-500 bg-amber-50 text-amber-700' },
  { val: 3, name: '橙区·警告位', impact: '立刻找坑', desc: '肚子绞痛，成型度明显下降。', icon: '⚠️', iconBg: 'bg-orange-100', bgClass: 'bg-orange-500', activeClass: 'border-orange-500 bg-orange-50 text-orange-700' },
  { val: 4, name: '红区·代价派', impact: '粘液便/加药', desc: '炎症加重，必须靠美沙拉嗪续命。', icon: '💊', iconBg: 'bg-red-100', bgClass: 'bg-red-500', activeClass: 'border-red-500 bg-red-50 text-red-700' },
  { val: 5, name: '紫区·见血封喉', impact: '直接喷血', desc: '肉眼可见的损伤，粘膜在求救。', icon: '🩸', iconBg: 'bg-purple-100', bgClass: 'bg-purple-500', activeClass: 'border-purple-500 bg-purple-50 text-purple-700' },
  { val: 6, name: '黑区·急诊直通车', impact: '准备住院', desc: '肠梗阻或高烧，直接拎包住院。', icon: '🚑', iconBg: 'bg-black text-white', bgClass: 'bg-gray-900', activeClass: 'border-black bg-gray-900 text-white' }
]

// ==========================================
// 2. 核心数据 (Mock Data) - 模拟拆表后的数据
// ==========================================
// 表1模拟：食物大盘表
const foodList = ref([])
const fetchFoodList = async () => {
  try {
    // 呼叫咱们刚写的后端接口
    const res = await http.get('/diet/list')
console.log("你好",res)
    // 假设你的 axios 拦截器返回的是 res.data，如果没拦截器直接是 res，你自己微调一下
    const rawData = res

    // 🌟 狸猫换太子：把后端 Java 的字段，拼装成你 HTML 模板里需要的样子！
    foodList.value = rawData.map(dbItem => {
      // 算一下颜色：安全率大于80算绿区(safe)，低于40算红区(danger)，中间算黄区(warning)
      let currentType = 'warning'
      if (dbItem.safeRate >= 80) currentType = 'safe'
      if (dbItem.safeRate <= 40) currentType = 'danger'

      return {
        id: dbItem.id,
        brand: dbItem.brandName,      // 对应 Java 的 brandName
        product: dbItem.foodName,     // 对应 Java 的 foodName
        type: currentType,
        image: dbItem.coverImg || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80', // 如果没图，先搞张假网图顶着
        safeRate: dbItem.safeRate,
        voteCount: dbItem.totalVotes,
        tags: dbItem.tagsJson ? JSON.parse(dbItem.tagsJson) : [], // 解析标签
        desc: dbItem.summaryDesc || '这道菜暂无描述，全是实战数据！',
        // 把各个区间的票数全塞进来，给详情页的进度条用
        levelStats: {
          1: dbItem.level1Votes, 2: dbItem.level2Votes,
          3: dbItem.level3Votes, 4: dbItem.level4Votes,
          5: dbItem.level5Votes, 6: dbItem.level6Votes
        }
      }
    })
  } catch (error) {
    console.error("获取大盘数据失败，兄弟检查下网络：", error)
  }
}

// ==========================================
// 3. 状态控制与交互逻辑
// ==========================================
const keyword = ref('')
const showUploadModal = ref(false)
const showDetailModal = ref(false)
const currentFood = ref(null)

const formData = ref({ brand: '', product: '', content: '', level: 1,location: '',
  coverImg: ''})
const triggerFileInput = () => {
  if (!formData.value.coverImg) {
    fileInput.value.click()
  }
}
const isUploading = ref(false)
// 核心：把图片塞进 FormData 扔给后端
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  const uploadData = new FormData()
  uploadData.append('file', file) // 这里的 'file' 必须和你后端 Controller 接收的名字一样！

  try {
    // 呼叫你刚刚跑通的后端腾讯云 COS 接口
    const res = await http.post('/upload', uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // 拿到真实图片 URL，页面瞬间显示预览！
    // 🚨 注意：根据你之前的 ApiResponse 结构，这里大概率要写 res.data
    formData.value.coverImg = res.data
    console.log("图片上传成功！直链：", formData.value.coverImg)
  } catch (error) {
    console.error("图片上传失败：", error)
    alert("上传失败，请检查网络或秘钥配置")
  } finally {
    isUploading.value = false
    // 清空 input 的值，保证下次传同一张图也能触发 change 事件
    event.target.value = ''
  }
}
// 首页列表过滤
const filteredList = computed(() => {
  // 注意：这里必须加上 .value，因为它是 ref() 定义的响应式数据！
  if (!keyword.value) return foodList.value;

  const k = keyword.value.toLowerCase().trim();
  return foodList.value.filter(item =>
      item.brand.toLowerCase().includes(k) ||
      item.product.toLowerCase().includes(k)
  );
})
// 获取当前食物的战报列表
// 获取当前食物的战报列表 (临时安全版)
const currentFoodReports = ref([])
const fetchReports = async (foodId) => {
  try {
    const res = await http.get(`/diet/reports/${foodId}`)
    console.log("你好,2",res.data)
    // 狸猫换太子：把后端的字段，适配成咱们 HTML 模板需要的名字！
    currentFoodReports.value = res.data.map(dbItem => {
      return {
        id: dbItem.id,
        userName: '病友_' + (dbItem.userId || '神秘人'), // 以后做了用户系统再换真名字
        levelId: dbItem.reactionLevel,    // 映射：后端的 reactionLevel -> 前端的 levelId
        location: dbItem.location || '未知战场',
        content: dbItem.content || '该病友什么也没留，只留下了一个打分...',
        time: dbItem.createTime || '刚刚' // 如果你的实体类有 createTime 字段就填这个
      }
    })
  } catch (error) {
    console.error("获取战报失败：", error)
  }
}
// 打开详情页
const openDetail = (item) => {
  currentFood.value = item
  showDetailModal.value = true

  // 弹窗一开，立刻拉取该食物的战报！
  fetchReports(item.id)
}

// 从详情页打开上传弹窗 (自动带入品牌和商品)
const openUploadFromDetail = () => {
  formData.value.brand = currentFood.value.brand
  formData.value.product = currentFood.value.product
  showUploadModal.value = true
}

// 提交表单 (新增：写入临时 Mock 数据看效果)
// 注意：如果你的 http 是在别的文件定义的，记得在最上面 import 进来
// import http from '@/utils/http'
// 📍 --- 自动定位逻辑 ---
const isLocating = ref(false)

const autoLocate = () => {
  isLocating.value = true

  // 调用浏览器的底层 GPS/IP 定位接口
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          // 成功拿到经纬度！
          const lat = position.coords.latitude.toFixed(4)
          const lng = position.coords.longitude.toFixed(4)

          // 【架构师提示】：原生 H5 只能拿到经纬度。要变成"内江市万达广场"，
          // 后续需要接入腾讯地图/高德地图的“逆地址解析 API”。
          // 这里咱们先展示经纬度，让你感受全栈打通的快感！
          formData.value.location = `经度: ${lng}, 纬度: ${lat} (本地定位)`
          isLocating.value = false
        },
        (error) => {
          console.warn("定位被拒绝或失败：", error)
          formData.value.location = "定位失败，请手动输入"
          isLocating.value = false
        },
        { timeout: 5000 } // 最多等5秒
    )
  } else {
    formData.value.location = "浏览器不支持定位"
    isLocating.value = false
  }
}
const submitForm = async () => { // 🌟 重点 1：加上 async，因为咱们要发网络请求了
  try {
    // 🛑 拦截一下：如果连名字都没填，直接打回去，别浪费后端资源
    if (!formData.value.brand || !formData.value.product) {
      alert("兄弟，品牌和单品名字得填啊！")
      return
    }

    // 🚀 重点 2：直接调用你封装好的 post 发射数据！
    // 你的 formData 里的字段 (brand, product, level, location, content) 完美契合咱们后端的流氓打法！
    const res = await http.post('/diet/publish', formData.value)

    // 如果走到这里，说明后端没报错，完美入库了！
    alert(`牛逼！战报发布成功！`)

    // 关掉弹窗
    showUploadModal.value = false

    // 清空表单，为下次发布做准备 (别忘了把你加的 location 也清空)
    formData.value = { brand: '', product: '', content: '', location: '', level: 1 }

    // 💡 导师小提示：因为咱们现在首页的 mockFoodDB 还是假数据，
    // 所以你发完之后页面上暂时不会多出一条。
    // 等咱们这步跑通了，下一步把首页列表也换成真实接口，就能实时看见了！
    fetchFoodList()
  } catch (error) {
    // 万一 Token 过期了或者后端报错了，这里能接住
    console.error("战报发布失败：", error)
    alert("发布失败了兄弟，按 F12 看看控制台报啥错？")
  }
}

// ==========================================
// 4. 工具函数
// ==========================================
const getBadgeStyle = (type) => {
  switch (type) {
    case 'danger': return 'bg-red-50 text-red-600 border-red-100'
    case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'safe': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    default: return 'bg-gray-50 text-gray-600 border-gray-100'
  }
}

const getLevelInfo = (val) => levels.find(l => l.val === val) || levels[0]

const getLevelCount = (levelVal) => {
  return currentFood.value?.levelStats?.[levelVal] || 0
}

const getLevelStyle = (val) => {
  const level = getLevelInfo(val)
  return `${level.activeClass} border`
}
</script>

<style>
/* 保持你的原有样式即可 */
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
body { background-color: #f9fafb; }
</style>