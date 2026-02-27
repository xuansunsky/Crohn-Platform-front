<template>
  <div class="relative -m-4 w-[calc(100%+2rem)] h-[calc(100vh-96px)] bg-slate-50 overflow-hidden">
    <header class="mb-4 flex items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-blue-200 shadow-lg">
          <i class="ri-government-fill text-xl"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 tracking-tight">全国医保政策 & 避坑指南</h1>
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
      <div class="absolute bottom-20 right-4 flex flex-col gap-2 z-10">
        <button @click="zoomMap(1.2)" class="h-10 w-10 bg-white/90 backdrop-blur shadow-lg rounded-lg flex items-center justify-center text-slate-600 active:bg-blue-50 active:text-blue-600 border border-slate-100 transition-colors">
          <i class="ri-add-line text-xl"></i>
        </button>
        <button @click="zoomMap(0.8)" class="h-10 w-10 bg-white/90 backdrop-blur shadow-lg rounded-lg flex items-center justify-center text-slate-600 active:bg-blue-50 active:text-blue-600 border border-slate-100 transition-colors">
          <i class="ri-subtract-line text-xl"></i>
        </button>
        <button @click="resetMap" class="h-10 w-10 bg-white/90 backdrop-blur shadow-lg rounded-lg flex items-center justify-center text-blue-600 active:bg-blue-50 border border-slate-100 transition-colors">
          <i class="ri-focus-3-line text-xl"></i>
        </button>
      </div>
      <div v-if="showDetailPanel" class="absolute inset-0 z-20 flex flex-col bg-slate-50">

        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6 shadow-sm gap-4 shrink-0 z-20 relative">
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button @click="closeDetailPanel" class="rounded-full p-2 hover:bg-slate-100 text-slate-400"><i class="ri-arrow-left-line text-xl"></i></button>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="text-xl font-black text-slate-800 whitespace-nowrap">
                  {{ selectedArea.name }}
                </h2>

                <span v-if="currentPolicy.auditStatus === 1" class="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 ring-1 ring-blue-500/20">
                  <i class="ri-verified-badge-fill"></i> 官方核验
                </span>
                <span v-else class="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                  <i class="ri-information-line"></i> 待核验
                </span>
              </div>

              <div class="flex items-center gap-3">
                <p class="text-xs text-slate-400 flex items-center gap-1">
                  <span>{{ currentPolicy.updateTime }}</span>
                  <span class="w-px h-2 bg-slate-300"></span>
                  <span>{{ currentPolicy.nickname || '匿名大侠' }}</span>
                </p>

                <button
                    @click.stop="handleLike"
                    :class="['flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all active:scale-95 border',
                    currentPolicy.isLiked
                      ? 'bg-pink-50 text-pink-500 border-pink-200 shadow-sm shadow-pink-100'
                      : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50']"
                >
                  <i :class="currentPolicy.isLiked ? 'ri-heart-3-fill' : 'ri-heart-3-line'"></i>
                  {{ currentPolicy.likes || 0 }}
                </button>
              </div>
            </div>
          </div>
          <div class="mt-4 mb-6 bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <button
                @click="openHistoryDrawer"
                class="text-left text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline w-fit"
            >
              <span>当前是最新版本，查看其他 3 位伙伴的贡献</span>
              <i class="ri-arrow-right-s-line"></i>
            </button>

          </div>
          <div v-if="showHistoryDrawer" class="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="showHistoryDrawer = false"></div>

            <div class="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl transform transition-transform max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-10 fade-in duration-300">

              <div class="flex items-center justify-between mb-4 px-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 class="text-lg font-bold text-slate-800">选择政策版本</h3>
                  <p class="text-xs text-slate-400">不同老师上传的数据可能不同，请选择最信赖的</p>
                </div>
                <button @click="showHistoryDrawer = false" class="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <i class="ri-close-line"></i>
                </button>
              </div>

              <div class="space-y-3 pb-6">
                <div
                    v-for="(item, index) in historyList"
                    :key="item.id"
                    @click="switchVersion(item)"
                    class="relative p-4 rounded-xl border cursor-pointer transition-all group overflow-hidden"
                    :class="currentPolicy.id === item.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-100 hover:border-blue-300 shadow-sm'"
                >
                  <div v-if="currentPolicy.id === item.id" class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                    当前展示
                  </div>

                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-800 text-sm">{{ item.nickname }}</span>
                      <span v-if="item.auditStatus === 1" class="text-blue-600 text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <i class="ri-verified-badge-fill"></i> 已核验
                    </span>
                    </div>
                    <span class="text-xs text-slate-400">{{ item.updateTime }}</span>
                  </div>

                  <div class="flex items-center gap-4 text-xs text-slate-500 bg-slate-50/50 p-2 rounded-lg">
                    <span>报销: <b class="text-slate-900">{{ item.dualRatio }}%</b></span>
                    <span class="w-px h-3 bg-slate-300"></span>
                    <span>起付: <b class="text-slate-900">{{ item.deductible }}</b></span>
                    <span class="w-px h-3 bg-slate-300"></span>
                    <span class="flex items-center gap-1 text-pink-500 font-bold">
                    <i class="ri-heart-3-fill"></i> {{ item.likes }}
                  </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="flex bg-slate-100 p-1 w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
                v-for="type in policyTypes"
                :key="type.key"
                @click="switchType(type.key)"
                class="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap"
                :class="activeType === type.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'"
            >
              <i :class="type.icon"></i> {{ type.label }}
            </button>
          </div>
        </div>

        <div class="flex md:flex-row flex-1 overflow-hidden relative">

          <div class="w-full md:w-2/3 h-full overflow-y-auto p-4 md:p-8 scroll-smooth pb-24">

            <div class="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div class="flex flex-row divide-x divide-slate-100">

                <div class="flex-1 p-5 flex flex-col items-center justify-center text-center hover:bg-slate-50/50 transition-colors">
                  <div class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">门诊特殊病种</div>

                  <div :class="[
                'px-4 py-2 rounded-full border flex items-center gap-2 transition-all shadow-sm',
                currentPolicy.mente
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              ]">
                <span class="relative flex h-2.5 w-2.5">
                  <span v-if="currentPolicy.mente" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span :class="`relative inline-flex rounded-full h-2.5 w-2.5 ${currentPolicy.mente ? 'bg-green-500' : 'bg-slate-400'}`"></span>
                </span>

                    <span class="text-lg font-black tracking-tight">
                  {{ currentPolicy.mente ? '已纳入' : '未纳入' }}
                </span>
                  </div>

                  <p class="mt-3 text-[10px] text-slate-400 font-medium">
                    {{ currentPolicy.mente ? '✅ 可报销门诊检查/拿药' : '❌ 仅限住院报销' }}
                  </p>
                </div>

                <div class="flex-1 p-5 flex flex-col items-center justify-center text-center hover:bg-slate-50/50 transition-colors">
                  <div class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">双通道药房</div>

                  <div :class="[
                'px-4 py-2 rounded-full border flex items-center gap-2 transition-all shadow-sm',
                currentPolicy.dualChannel
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-red-50 border-red-200 text-red-600'
              ]">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        :class="currentPolicy.dualChannel ? 'bg-purple-400' : 'bg-red-500'"></span>
                  <span :class="`relative inline-flex rounded-full h-2.5 w-2.5 ${currentPolicy.dualChannel ? 'bg-purple-600' : 'bg-red-600'}`"></span>
                </span>

                    <span class="text-lg font-black tracking-tight">
                  {{ currentPolicy.dualChannel ? '支持外购' : '不支持' }}
                </span>
                  </div>

                  <p class="mt-3 text-[10px] text-slate-400 font-medium">
                    {{ currentPolicy.dualChannel ? '🏥 药店买药可报销' : '⚠️ 需住院或门诊拿药' }}
                  </p>
                </div>

              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
              <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <i class="ri-medicine-bottle-line text-blue-500"></i>
                <span class="font-bold text-slate-800 text-sm">核心药物供应情报</span>
              </div>

              <div v-if="!currentPolicy.drugs || currentPolicy.drugs.length === 0" class="p-6 text-center text-slate-400 text-sm">
                暂无数据...
              </div>

              <div v-else class="divide-y divide-slate-100">
                <div v-for="drug in currentPolicy.drugs" :key="drug.key" class="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0">
                    <i :class="[drug.icon || 'ri-capsule-line', drug.color || 'text-slate-500']"></i>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                      <span class="font-bold text-slate-700 text-sm">{{ drug.name }}</span>
                      <span v-if="drug.status === 'yes'" class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">有货</span>
                      <span v-else-if="drug.status === 'no'" class="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">缺货</span>
                      <span v-else class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">未知</span>
                    </div>

                    <div v-if="drug.status === 'yes'" class="text-xs text-slate-500 space-y-1 mt-1">
                      <div class="flex items-center gap-1">
                        <i class="ri-phone-fill text-slate-300"></i>
                        <span>{{ drug.phone || '暂无电话' }}</span>
                      </div>
                      <div v-if="drug.comment" class="bg-blue-50/50 text-blue-600 p-2 rounded-lg mt-1 border border-blue-100/50">
                        "{{ drug.comment }}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-6 md:mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6 text-white shadow-lg shadow-blue-200">

              <div class="flex justify-between items-end mb-2">
                <span class="text-blue-100 font-medium">实际报销比例</span>
                <span class="text-3xl md:text-4xl font-bold">{{ currentPolicy.dualRatio || '0' }}<span class="text-xl">%</span></span>
              </div>
              <div class="h-3 w-full rounded-full bg-black/20 overflow-hidden mb-4">
                <div class="h-full bg-white/90 rounded-full" :style="{ width: (currentPolicy.dualRatio || 0) + '%' }"></div>
              </div>

              <div class="h-px w-full bg-white/20 mb-3"></div>

              <div class="flex justify-between items-start gap-4">
                <div class="flex flex-col shrink-0">
                  <span class="text-xs text-blue-200 mb-1">起付线 (门槛费)</span>
                  <span class="font-bold text-xl">{{ currentPolicy.deductible || 0 }} <span class="text-xs font-normal opacity-80">元/年</span></span>
                </div>

                <div class="flex-1 text-right">
                  <p class="text-xs text-blue-100 opacity-90 leading-relaxed" v-if="currentPolicy.dualNote">
                    <i class="ri-information-line"></i> {{ currentPolicy.dualNote }}
                  </p>
                </div>
              </div>

            </div>
            <div class="mb-6">
              <h3 class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>📸 报销凭证 & 政策截图</span>
                <span v-if="currentPolicy.evidenceList?.length" class="bg-slate-100 text-slate-500 px-1.5 rounded text-[10px]">
                {{ currentPolicy.evidenceList.length }} 张
              </span>
              </h3>

              <div v-if="currentPolicy.evidenceList && currentPolicy.evidenceList.length > 0" class="grid grid-cols-4 gap-2">
                <div
                    v-for="(img, index) in currentPolicy.evidenceList"
                    :key="index"
                    class="relative aspect-square rounded-lg bg-slate-100 overflow-hidden cursor-zoom-in group border border-slate-200"
                    @click="previewImage(img)"
                >
                  <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="证据">
                </div>
              </div>

              <div v-else class="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                <i class="ri-image-line"></i>
                <span>暂无图片证据，等待病友上传...</span>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4 md:p-6 mb-6">
              <h3 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i class="ri-book-open-line text-blue-500"></i> 避坑指南 & 摘要
              </h3>
              <p class="text-slate-600 leading-relaxed text-sm">
                {{ currentPolicy.summary || '暂无详细描述...' }}
              </p>
            </div>
            <div class="mt-6 flex gap-4">
              <button @click="openEditDialog" class="flex-1 rounded-lg bg-slate-800 py-3 text-white hover:bg-slate-700 transition font-medium shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                <i class="ri-edit-2-line"></i>
                <span>我要修正数据 / 补充情报</span>
              </button>
            </div>
          </div>
          <div v-if="showEditDrawer" @click="showEditDrawer = false" class="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"></div>

          <div
              class="fixed bottom-0 left-0 w-full bg-slate-50 z-[70] rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out flex flex-col h-[85vh] md:h-[90vh] md:w-[500px] md:left-1/2 md:-translate-x-1/2 md:rounded-t-xl"
              :class="showEditDrawer ? 'translate-y-0' : 'translate-y-full'"
          >

            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white rounded-t-2xl">
              <button @click="showEditDrawer = false" class="text-slate-500 hover:text-slate-800 text-sm font-medium">取消</button>
              <span class="font-bold text-slate-800 text-lg">修正情报 / {{ selectedArea.name }}</span>
              <div class="w-8"></div>
            </div>

            <div class="flex-1 overflow-y-auto p-5 space-y-6">

              <div class="space-y-4">

                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                      <label class="font-bold text-slate-700 flex items-center gap-2">
                        <i class="ri-hospital-line text-green-500"></i> 门诊特殊病种
                      </label>
                      <span :class="['text-xs px-2 py-0.5 rounded font-bold', editForm.mente ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                  {{ editForm.mente ? '已纳入' : '未纳入' }}
                </span>
                    </div>
                    <div class="flex gap-3">
                      <button
                          @click="editForm.mente = true"
                          :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border', editForm.mente ? 'bg-green-500 text-white border-green-600 shadow-md shadow-green-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
                      >
                        已纳入
                      </button>
                      <button
                          @click="editForm.mente = false"
                          :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border', !editForm.mente ? 'bg-slate-700 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
                      >
                        未纳入
                      </button>
                    </div>
                  </div>

                  <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                      <label class="font-bold text-slate-700 flex items-center gap-2">
                        <i class="ri-store-2-line text-purple-500"></i> 双通道药店
                      </label>
                      <span :class="['text-xs px-2 py-0.5 rounded font-bold', editForm.dualChannel ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500']">
                  {{ editForm.dualChannel ? '支持外购' : '不支持' }}
                </span>
                    </div>
                    <div class="flex gap-3">
                      <button
                          @click="editForm.dualChannel = true"
                          :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border', editForm.dualChannel ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
                      >
                        支持
                      </button>
                      <button
                          @click="editForm.dualChannel = false"
                          :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all border', !editForm.dualChannel ? 'bg-slate-700 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
                      >
                        不支持
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <label class="font-bold text-slate-700 flex items-center gap-2">
                      <i class="ri-calculator-line text-blue-500"></i> 报销力度计算器
                    </label>
                    <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">自动计算</span>
                  </div>

                  <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div class="h-8 w-8 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
                      <i class="ri-money-cny-box-line"></i>
                    </div>
                    <div class="flex-1">
                      <label class="text-xs text-slate-500 font-bold block">起付线 (门槛费)</label>
                      <input
                          v-model="editForm.deductible"
                          type="number"
                          class="w-full bg-transparent font-bold text-slate-800 outline-none text-sm placeholder:text-slate-300"
                          placeholder="例如: 800"
                      >
                    </div>
                    <span class="text-xs font-bold text-slate-400">元/年</span>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs text-slate-500 mb-1 block">📄 官方名义比例</label>
                      <div class="relative">
                        <input
                            v-model="editForm.nominalRatio"
                            type="number"
                            class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-bold focus:border-blue-500 outline-none transition-colors text-center"
                        >
                        <span class="absolute right-3 top-2 text-sm text-slate-400">%</span>
                      </div>
                    </div>

                    <div>
                      <label class="text-xs text-red-500 mb-1 block font-bold">✂️自付扣除</label>
                      <div class="relative">
                        <input
                            v-model="editForm.hiddenSelfPay"
                            type="number"
                            class="w-full rounded-lg border border-red-200 bg-red-50 py-2 pl-3 pr-8 text-sm font-bold text-red-600 focus:border-red-500 outline-none transition-colors text-center"
                            placeholder="0"
                        >
                        <span class="absolute right-3 top-2 text-sm text-red-400">%</span>
                      </div>
                    </div>
                  </div>

                  <div class="relative pt-6">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200"></div>
                    <div class="absolute top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-200 rotate-45 -mt-1.5"></div>

                    <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 text-white flex justify-between items-center shadow-lg">
                      <div>
                        <span class="text-xs text-slate-400 block mb-0.5">你的真实报销比例</span>
                        <span class="text-xs opacity-50 font-mono">
                  {{ editForm.nominalRatio }}% × {{ 100 - editForm.hiddenSelfPay }}%
                </span>
                      </div>
                      <div class="text-right">
                        <span class="text-3xl font-bold text-green-400">{{ calculatedRealRatio }}<span class="text-base">%</span></span>
                      </div>
                    </div>

                    <p v-if="editForm.hiddenSelfPay > 0" class="text-[10px] text-center text-slate-400 mt-2">
                      * 已扣除 {{ editForm.hiddenSelfPay }}% 的所谓“自付部分”，这才是你能拿到的钱。
                    </p>
                  </div>

                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label class="font-bold text-slate-700 flex items-center gap-2 mb-2">
                    <i class="ri-first-aid-kit-line text-red-500"></i> 核心药物供应情报
                  </label>

                  <div v-for="(drug, index) in editForm.drugs" :key="drug.key" class="p-3 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:border-blue-200">

                    <div class="flex flex-col gap-3 mb-3"> <div class="flex items-center gap-2">
                      <i :class="[drugOptions[index].icon, drugOptions[index].color, 'text-lg']"></i>
                      <span class="font-bold text-slate-700 text-sm">{{ drug.name }}</span>
                    </div>

                      <div class="flex bg-slate-100 p-1 rounded-lg w-full gap-1">
                        <button
                            @click="drug.status = 'yes'"
                            :class="['flex-1 py-2 rounded-md text-xs font-bold transition-all text-center', drug.status === 'yes' ? 'bg-green-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200']"
                        >
                          有货
                        </button>
                        <button
                            @click="drug.status = 'no'"
                            :class="['flex-1 py-2 rounded-md text-xs font-bold transition-all text-center', drug.status === 'no' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200']"
                        >
                          缺货
                        </button>
                        <button
                            @click="drug.status = 'unknown'"
                            :class="['flex-1 py-2 rounded-md text-xs font-bold transition-all text-center', drug.status === 'unknown' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:bg-slate-200']"
                        >
                          未知
                        </button>
                      </div>
                    </div>

                    <div v-if="drug.status === 'yes'" class="mt-3 pl-3 border-l-2 border-green-200 space-y-3 animate-in fade-in slide-in-from-top-2">

                      <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">药房电话</label>
                        <div class="relative">
                          <i class="ri-phone-line absolute left-3 top-2.5 text-slate-400"></i>
                          <input
                              v-model="drug.phone"
                              type="text"
                              placeholder="例如：0832-xxxxxx"
                              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                          >
                        </div>
                      </div>

                      <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">购买体验 / 价格备注</label>
                        <textarea
                            v-model="drug.comment"
                            rows="3"
                            placeholder="价格是否合适？能否刷医保？位置好不好找？"
                            class="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
                        ></textarea>
                      </div>

                    </div>


                  </div>

                  <p class="text-[10px] text-center text-slate-400 pt-2">
                    * 请只更新您了解的药物，不确定的请保持“未知”。
                  </p>
                </div>

              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <label class="font-bold text-slate-700 flex items-center gap-2">
                    <i class="ri-image-add-line text-blue-500"></i> 上传报销凭证/截图
                  </label>
                  <span class="text-xs text-slate-400">{{ editForm.evidenceList.length }}/4 张</span>
                </div>

                <div class="grid grid-cols-4 gap-2">
                  <div
                      v-for="(img, index) in editForm.evidenceList"
                      :key="index"
                      class="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                  >
                    <img :src="img" class="w-full h-full object-cover" />

                    <button
                        @click="removeImage(index)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    >
                      <i class="ri-close-line text-xs"></i>
                    </button>
                  </div>

                  <div
                      v-if="editForm.evidenceList.length < 4"
                      @click="triggerUpload"
                      class="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 cursor-pointer transition-colors text-slate-400 hover:text-blue-500"
                  >
                    <i class="ri-add-line text-2xl mb-1"></i>
                    <span class="text-[10px] font-bold">添加图片</span>
                  </div>
                </div>

                <input
                    type="file"
                    ref="fileInputRef"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileChange"
                >

                <p class="text-[10px] text-slate-400 mt-2">
                  * 请上传真实的报销单、发票或政策截图，您的贡献将帮助更多人。
                </p>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">避坑指南 & 经验摘要</label>
                  <textarea
                      v-model="editForm.summary"
                      rows="4"
                      placeholder="请分享你在当地报销的真实流程，或者遇到的坑..."
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-slate-400"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">备注 (可选)</label>
                  <input
                      v-model="editForm.dualNote"
                      type="text"
                      placeholder="例如：需要三甲医院备案"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                </div>
              </div>



            </div>

            <div class="p-4 border-t border-slate-200 bg-white safe-area-bottom">
              <button
                  @click="submitEdit"
                  class="w-full rounded-xl bg-slate-900 py-3.5 text-white font-bold text-base shadow-lg shadow-slate-300 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <i class="ri-save-3-line"></i>
                提交修正
              </button>
            </div>

          </div>

          <button
              @click="showMobileChat = true"
              class="md:hidden fixed bottom-24 right-6 mb-[env(safe-area-inset-bottom)] h-14 w-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center z-50 active:scale-90 transition-transform"
          >
            <i class="ri-message-3-line text-2xl"></i>
            <div class="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border border-blue-600"></div>
          </button>

          <div v-if="showMobileChat" @click="showMobileChat = false" class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm md:hidden transition-opacity"></div>

          <div
              class="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col h-[75vh]"
              :class="showMobileChat ? 'translate-y-0' : 'translate-y-full'"
          >
            <div class="flex justify-center pt-3 pb-1" @click="showMobileChat = false">
              <div class="h-1.5 w-12 bg-slate-300 rounded-full"></div>
            </div>

            <div class="flex-1 p-4 overflow-y-auto">
              <h3 class="font-bold text-slate-700 mb-4">💊 病友阵地</h3>
              <div v-for="i in 3" :key="i" class="mb-4">
                <div class="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                  内江的报销太难跑了...
                </div>
              </div>
            </div>

            <div class="p-4 border-t safe-area-bottom">
              <input type="text" placeholder="说点什么..." class="w-full bg-slate-100 rounded-full py-3 px-4 outline-none">
            </div>
          </div>

        </div>

      </div>

    </main>

  </div>
</template>

<script setup>
// 👇 放在 <script setup> 里 👇

// 1. 控制编辑抽屉的开关
const showEditDrawer = ref(false)
const drugOptions = [
  { key: 'rinvoq', name: '乌帕替尼 (Rinvoq)', icon: 'ri-capsule-fill', color: 'text-blue-600' },
  { key: 'adalimumab', name: '阿达木单抗 (修美乐等)', icon: 'ri-syringe-line', color: 'text-green-600' },
  { key: 'stelara', name: '输液单抗 (乌斯奴/古塞奇尤)', icon: 'ri-drop-line', color: 'text-purple-600' }, // 这里的名字你可以按需改
  { key: 'nutrition', name: '全肠内营养 (能全素/安素)', icon: 'ri-cup-line', color: 'text-orange-600' }
]
// 2. 表单数据模型 (对应你后端的字段)
const editForm = reactive({
  mente: false,       // 门特病种 (布尔值)
  dualChannel: false,        // 双通道 (布尔值)
  dualRatio: 0,         // 报销比例 (数字)
  summary: '',
  evidenceList: [],
  dualNote: '',
  // 🔥 新增：复杂计算字段
  deductible: 0,        // 起付线 (元)
  nominalRatio: 80,     // 官方名义比例 (%)
  hiddenSelfPay: 0,     // 隐形自付比例 (%, 也就是那个不能报的15%)
  drugs: drugOptions.map(d => ({
    key: d.key,
    name: d.name,
    icon: d.icon,    // ✅ 确保图标存在
    color: d.color,  // ✅ 确保颜色存在
    status: 'unknown',
    phone: '',
    comment: ''
  }))
})
const calculatedRealRatio = computed(() => {
  const real = editForm.nominalRatio * (100 - editForm.hiddenSelfPay) / 100
  return Math.round(real) // 取整
})
const triggerUpload = () => {
  fileInputRef.value.click()
}

// 🔥 处理文件选择 (核心)
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 1. 限制大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('图片太大了，请上传 5MB 以内的图片')
    return
  }

  // 2. 准备包裹
  const formData = new FormData()
  formData.append('file', file) // 这里的 'file' 要跟后端 @RequestParam("file") 对应

  try {
    // 🔥 3. 发送请求 (加上 await 等待结果)
    const res = await http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
console.log(res)
    // 🔥 4. 解析后端返回的数据
    // 假设后端结构是: { code: 200, data: { url: "http://..." } }
    if (res.status === 200) {
      // 拿到真链接！不是本地的假链接了
      const serverUrl = res.data

      console.log('上传成功，后端返回地址:', serverUrl)

      // 5. 塞进数组，页面立马显示
      editForm.evidenceList.push(serverUrl)
    } else {
      alert('上传失败: ' + res.data.msg)
    }
  } catch (error) {
    console.error('上传炸了:', error)
    alert('网络或者权限出了问题，看看控制台报错')
  } finally {
    // 6. 无论成功失败，都把 input 清空，防止选同一张图没反应
    event.target.value = ''
  }
}
// 🔥 删除图片
const removeImage = (index) => {
  editForm.evidenceList.splice(index, 1)
}
// 监听计算结果，自动同步给 dualRatio
watch(calculatedRealRatio, (val) => {
  editForm.dualRatio = val
})
// 3. 打开编辑抽屉 (把当前数据填进去)
const openEditDialog = () => {
  editForm.mente = currentPolicy.value.mente || false
  editForm.dualChannel = currentPolicy.value.dualChannel || false
  editForm.dualRatio = currentPolicy.value.dualRatio || 0
  editForm.summary = currentPolicy.value.summary || ''
  editForm.dualNote = currentPolicy.value.dualNote || ''
  editForm.evidenceList=currentPolicy.value.evidenceList||''
      editForm.deductible=currentPolicy.value.deductible||''
  showEditDrawer.value = true
}

// 4. 提交保存 (这里对接你后端的 API)
const submitEdit = async () => {

  // 1. 组装数据 payload
  const payload = {
    // 📍 上下文定位
    cityName: selectedArea.name,
    policyType: activeType.value,

    // 🕒 自动生成今天的时间
    updateTime: new Date().toISOString().split('T')[0],

    // 👤 🔥 核心修改：编一个名字！
    // 加个随机数，这样你在演示“历史版本”时，列表里会有不同的人，显得平台很火！
    nickname: '热心战友_' + Math.floor(Math.random() * 1000),
    userId: 0, // 游客 ID

    // 📝 把表单里的数据 (报销比例、门特、图片...) 全部展开塞进去
    ...editForm
  }

  // 2. 打印看看，心里有底
  console.log('🚀 准备发射数据:', payload)

  try {
    // 🔥 发起真提交！POST /api/policy/save
    const res = await http.post('/policy/save', payload)

    if (res.code === 200) {
      // 🎉 成功！
      alert('提交成功！你的贡献已被记录！')
      showEditDrawer.value = false // 关掉编辑框

      // ✨✨✨ 见证奇迹的时刻 ✨✨✨
      // 马上重新拉取数据，页面上的报销比例、名字、时间瞬间变成你刚才填的！
      await loadPolicyData(selectedArea.name)

    } else {
      alert('提交失败: ' + res.msg)
    }
  } catch (error) {
    console.error('提交炸了:', error)
    alert('网络连接失败，请稍后再试')
  }
}
import {ref, onMounted, reactive, computed, watch} from 'vue'
import * as echarts from 'echarts'
import chinaJson from '@/assets/map/china.json'
import http from "@/api/http.js";
// 控制手机端聊天抽屉的开关
const showMobileChat = ref(false)
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
const currentPolicy = ref({})

const switchType = (key) => {
  activeType.value = key

  // 👇 记得加这行！切换 Tab 时，重新去后端拉这个类型的数据
  loadPolicyData(selectedArea.name)
}

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
    mente: backendData.mente === 1,
    dualChannel: backendData.dualChannel === 1,
    dualRatio: backendData.dualRatio,
    dualNote: backendData.dualNote,
    summary: backendData.summary
  }
}

const loadPolicyData = async (areaName) => {
  console.log(`正在请求 ${areaName} 的数据...`)

  // 1. 告诉全场，现在选的是哪里 (地图高亮需要这个)
  selectedArea.name = areaName

  const type = activeType.value

  // 2. 先清空当前白板，防止显示上一条数据
  // (也可以不清，看你想不想让用户看到闪烁)
  currentPolicy.value = { hasData: false }

  try {
    // 🔥 发起请求
    const res = await http.get('/policy/detail', {
      params: { city: areaName, type: type }
    })

    if (res.code === 200 && res.data) {
      const realData = res.data
      realData.hasData = true

      // ✅ 【关键改动】直接更新 UI！(这就是你想要的直观逻辑)
      // 使用 {...} 也是为了保险，强迫 Vue 刷新
      currentPolicy.value = { ...realData }

      // 同时也存一份到缓存里 (selectedArea)，以备不时之需


      console.log('数据加载成功，界面已更新')
    } else {
      // 没数据，保持白板为空
      currentPolicy.value = { hasData: false }
    }

  } catch (error) {
    console.error('拉取数据失败:', error)
    currentPolicy.value = { hasData: false }
  }
}

// --- 地图逻辑 (你的核心资产) ---
// 省份代码映射 (保留)
const provinceCodeMap = {
  '北京': '110000', '天津': '120000', '河北': '130000', '山西': '140000', '内蒙古': '150000',
  '辽宁': '210000', '吉林': '220000', '黑龙江': '230000', '上海': '310000', '江苏': '320000',
  '浙江': '330000', '安徽': '340000', '福建': '350000', '江西': '360000', '山东': '370000',
  '河南': '410000', '湖北': '420000', '湖南': '430000', '广东': '440000', '广西': '450000',
  '海南': '460000', '重庆': '500000', '四川': '510000', '贵州': '520000', '云南': '530000',
  '西藏': '540000', '陕西': '610000', '甘肃': '620000', '青海': '630000', '宁夏': '640000',
  '新疆': '650000', '台湾': '710000', '香港': '810000', '澳门': '820000'
}
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
  myChart = echarts.init(chartRef.value, null, { renderer: 'svg' })
  echarts.registerMap('china', chinaJson)
  renderMap('china')

  // 监听点击事件
  myChart.on('click', async (params) => {
    console.log('📍 点击捕捉:', params.name) // 调试第一步：看点到了啥

    // --- 1. 直辖市判断 (这些地方不让钻) ---
    const directCities = ['北京', '天津', '上海', '重庆', '香港', '澳门', '台湾']
    const isDirectCity = directCities.some(city => params.name.includes(city))

    // ==========================================
    // 场景 A: 当前在【全国地图】 (准备下钻)
    // ==========================================
    if (currentMap.value === 'china') {

      // 1.1 如果是直辖市 -> 直接弹窗
      if (isDirectCity) {
        console.log('👉 直辖市，直接看详情')
        await loadPolicyData(params.name)
        showDetailPanel.value = true
        return
      }

      // 1.2 获取省份身份证 (adcode)
      const adcode = getAdcodeByName(params.name)
      console.log('🔍 身份证号:', adcode)

      if (adcode && adcode !== '999999') {
        try {
          // 1.3 请求地图数据
          const url = `/map/citys/${adcode}.json`
          console.log('🚀 正在请求地图:', url)

          const response = await fetch(url)
          if (!response.ok) throw new Error(`地图文件缺失 (${response.status})`)

          const provinceJson = await response.json()

          // 1.4 注册并切换 (关键步骤！)
          echarts.registerMap('citys', provinceJson)
          currentMap.value = 'citys'         // 状态切换：进入省份
          renderMap('citys', params.name)    // 渲染地图 (把省份名字传过去做标题)

          console.log('✅ 下钻成功！')

        } catch (e) {
          // 🔥 修正点：如果地图文件没有，不要直接弹窗，而是给个提示
          // 这样你就知道是逻辑坏了，还是文件没了
          console.error('❌ 下钻失败:', e)
          alert(`正在建设【${params.name}】的地图数据，暂为您展示政策列表。`)

          // 兜底：确实没地图，那就看详情吧
          await loadPolicyData(params.name)
          showDetailPanel.value = true
        }
      } else {
        console.warn('⚠️ 未找到该区域的 adcode')
      }
    }

        // ==========================================
        // 场景 B: 当前已经在【省份地图】 (点击城市)
    // ==========================================
    else {
      console.log('👉 点击了城市/区县，查看详情')
      await loadPolicyData(params.name)
      showDetailPanel.value = true
    }
  })
}

const renderMap = (mapName) => {
  const option = {
    // 1. 提示框优化：手机上点击才显示，手指离开稍微延迟消失
    tooltip: {
      trigger: 'item',
      triggerOn: 'click', // 手机上只有点击，没有悬停
      enterable: true,    // 允许点击提示框内部
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#1e293b', fontSize: 12 },
      padding: 10,
      // 手机上提示框容易遮挡手指，稍微偏移一点
      position: function (point, params, dom, rect, size) {
        // 固定在顶部，或者跟随手指但往上提
        return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1] - 20];
      }
    },

    geo: {
      map: mapName,

      // 🔥🔥🔥 核心手感优化区 🔥🔥🔥

      // 1. 开启漫游 (缩放 + 平移)
      roam: true,

      // 2. 初始大小：手机屏幕窄，我们要把地图撑满！
      // 不要用 zoom: 1.1 了，用 layoutSize 更稳
      layoutCenter: ['50%', '50%'], // 地图中心对准屏幕中心
      layoutSize: '95%',            // 撑满 95% 的宽度，视觉冲击力强，好点选

      // 3. 限制缩放范围 (防呆设计)
      // 防止用户缩得太小看不见，或者放得太大迷路
      scaleLimit: {
        min: 0.8, // 最小缩放到 0.8 倍 (不能缩成蚂蚁)
        max: 3    // 最大放大到 3 倍 (太大了也没意义，还容易糊)
      },

      // 4. 文字优化：手机上字太小看不清，稍微大一点
      label: {
        show: true,
        color: '#64748b',
        fontSize: 10 // 稍微控制一下字体大小，别太挤
      },

      // 5. 配色样式 (保持你喜欢的清新蓝)
      itemStyle: {
        areaColor: '#f1f5f9',
        borderColor: '#cbd5e1',
        borderWidth: 1,
      },

      // 6. 选中高亮样式
      emphasis: {
        itemStyle: {
          areaColor: '#bfdbfe',
          borderColor: '#3b82f6',
          borderWidth: 2 // 选中时边框加粗，反馈感更强
        },
        label: {
          color: '#1e40af',
          fontWeight: 'bold' // 选中文字加粗
        }
      },

      // 7. 这是一个隐藏技巧：优化拖拽流畅度
      // 定义只有在地图区域内才能拖拽，防止和页面滚动冲突太严重
      silent: false
    }
  }

  // 必须加上 true (不合并配置，彻底重绘)，防止切换地图时残留
  myChart.setOption(option, true)
}
const resetMap = () => {
  if (!myChart) return
  // 恢复默认视图，不用双指捏半天
  myChart.dispatchAction({
    type: 'restore'
  })
}
onMounted(() => {
  console.log('🚀 自动进入开发调试模式...')

  // 1. 假装你点击了内江
  selectedArea.name = '内江市' // 这里换成你正在调试的城市

  // 2. 自动去拉数据
  loadPolicyData('内江市')

  // 3. 强制打开详情面板
  showDetailPanel.value = true

  // 4. (可选) 如果你正在调编辑框，把下面这行注释解开，它会自动弹出编辑框
  // showEditDrawer.value = true
})
const showHistoryDrawer = ref(false)
const historyList = ref([])

// ✅ 1. 点赞逻辑
const handleLike = async () => {
  // 如果已经点过了，暂时不支持“取消点赞”（后端目前只写了+1），这就防止反复刷
  if (currentPolicy.value.isLiked) return;

  // 1. 视觉交互：先斩后奏，让用户觉得秒开
  if (!currentPolicy.value.likes) currentPolicy.value.likes = 0;
  currentPolicy.value.likes++;
  currentPolicy.value.isLiked = true;

  // 2. 默默通知后端 +1
  try {
    // 假设你的后端接口是 /api/like?id=xxx
    // 注意：这里要用 FormData 或者 params 传参，取决于你后端的接收方式
    // 既然后端用的是 @RequestParam，这里直接拼在 url 里或者用 params 最稳
    await http.post('/policy/like', null, {
      params: { id: currentPolicy.value.id }
    });
    console.log('❤️ 后端点赞成功');
  } catch (e) {
    console.error('点赞失败', e);
    // 如果失败了，要把刚才视觉上加的 1 减回来，防止欺骗用户
    currentPolicy.value.likes--;
    currentPolicy.value.isLiked = false;
  }
}

// ✅ 2. 打开历史列表逻辑
const openHistoryDrawer = async () => {
  console.log('正在加载历史版本...');

  try {
    // 拿到当前城市和类型
    const city = currentPolicy.value.cityName || currentPolicy.value.city; // 兼容不同字段名
    const type = currentPolicy.value.policyType;

    // 发请求给后端：兄弟，把内江的所有版本给我！
    const res = await http.get('/policy/history', {
      params: { city: city, type: type }
    });

    if (res.code === 200) {
      // 成功拿到真数据！
      historyList.value = res.data;
      // 打开抽屉
      showHistoryDrawer.value = true;
    } else {
      console.warn('获取历史失败:', res.msg);
    }
  } catch (e) {
    console.error('网络请求炸了:', e);
  }
}
const fileInputRef = ref(null)
// 简单的看图 (暂时用新窗口打开，省事)
const previewImage = (url) => {
  window.open(url, '_blank')
}
// 🔥 核心动作：切换版本 (点击列表某一项)
const switchVersion = async (item) => {
  console.log('正在切换到版本 ID:', item.id); // 打印一下，看看是不是那个 ID

  try {
    // 1. 拿着身份证 (ID) 去后端找那一条特定数据
    // 注意：这里的接口 /detail/version 是我们刚才在 Controller 里新写的
    const res = await http.get('policy/detail/version', {
      params: { id: item.id }
    });

    if (res.code === 200 && res.data) {
      // 2. 🔥 核心瞬间：把当前页面的数据，替换成查回来的旧版本数据
      currentPolicy.value = res.data
      console.log(currentPolicy)
      // 3. 关掉抽屉 (完事拂衣去)
      showHistoryDrawer.value = false;
      console.log(res)
      // 4. (可选) 给个提示
      // alert(`已切换到 ${item.nickname} 的版本`);
      console.log('🎉 切换成功，现在看的是:', item.nickname);

    } else {
      console.warn('切换失败，后端没给数据');
    }
  } catch (e) {
    console.error('切换版本接口炸了:', e);
  }
}
const zoomMap = (ratio) => {
  if (!myChart) return

  // 获取当前的配置
  const option = myChart.getOption()
  // 拿到当前的缩放比例
  const currentZoom = option.geo[0].zoom || 1.1

  // 计算新比例 (限制一下最大最小，别缩没了)
  let newZoom = currentZoom * ratio
  if (newZoom < 0.8) newZoom = 0.8
  if (newZoom > 5) newZoom = 5

  myChart.setOption({
    geo: {
      zoom: newZoom
    }
  })
}
onMounted(() => {
  initMap()
  window.addEventListener('resize', () => myChart && myChart.resize())
})
</script>