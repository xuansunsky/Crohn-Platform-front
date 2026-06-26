<template>
  <div class="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col">
    <header v-show="!showDetailPanel" class="shrink-0">
      <TabPageHeader
        title="医保地图"
        accent="teal"
      >
        <template #action>
          <button
            @click="showGuideSheet = true"
            class="w-9 h-9 rounded-lg border border-stone-200 bg-stone-50 text-stone-500 flex items-center justify-center active:scale-95 transition-all"
            title="数据来源与使用须知"
          >
            <i class="ri-information-line text-lg"></i>
          </button>
        </template>
      </TabPageHeader>

      <div v-if="currentMap !== 'china' && !showDetailPanel" class="px-4 pb-2">
        <button
          @click="backToChina"
          class="flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-[13px] font-medium text-stone-600 border border-stone-200 active:scale-[0.98] transition-all"
        >
          <i class="ri-arrow-go-back-line"></i> 返回全国
        </button>
      </div>
    </header>

    <main class="flex-1 w-full h-full relative overflow-y-auto custom-scrollbar">
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

        <!-- 紧凑型详情头：贴边 sticky，DOSSIER 档案风 -->
        <div class="shrink-0 bg-white border-b border-slate-200 z-20 relative">

          <!-- 第一行：返回 + 城市名 + 核验 + 操作 -->
          <div class="flex items-center gap-2 px-4 pt-3 pb-1.5">
            <button @click="closeDetailPanel" class="rounded-full p-1.5 -ml-1 hover:bg-slate-100 text-slate-500 active:scale-90 transition-all shrink-0">
              <i class="ri-arrow-left-line text-xl"></i>
            </button>
            <h2 class="text-[22px] font-black text-slate-900 tracking-tight whitespace-nowrap">
              {{ selectedArea.name }}
            </h2>

            <div class="flex-1"></div>

            <button
                @click.stop="handleLike"
                :class="['flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all active:scale-95 border shrink-0',
                currentPolicy.isLiked
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50']"
            >
              <i :class="currentPolicy.isLiked ? 'ri-heart-3-fill' : 'ri-heart-3-line'"></i>
              <span>{{ currentPolicy.likes || 0 }}</span>
            </button>
            <button
              @click="showGuideSheet = true"
              class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center active:scale-90 transition-all shrink-0"
              title="数据来源与使用须知"
            >
              <i class="ri-information-line text-lg"></i>
            </button>
          </div>

          <!-- 第二行：元信息 · 版本切换（仅有数据时显示贡献者）-->
          <div v-if="currentPolicy.hasData" class="flex items-center gap-2 px-4 pb-2 text-[11px] text-slate-400 font-medium overflow-hidden">
            <img :src="currentPolicy.avatar || DEFAULT_AVATAR" class="w-5 h-5 rounded-full object-cover bg-slate-100 border border-slate-100 shrink-0" />
            <span class="truncate">
              <span class="text-slate-600 font-bold">{{ currentPolicy.nickname || '匿名大侠' }}</span>
              <span class="mx-1.5 text-slate-300">·</span>
              {{ currentPolicy.updateTime || '' }}
            </span>
            <span v-if="isMyVersion" class="shrink-0 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-100">我的版本</span>
            <span class="w-px h-2.5 bg-slate-300 shrink-0"></span>
            <button
                @click="openHistoryDrawer"
                class="text-blue-600 font-bold flex items-center gap-0.5 hover:underline shrink-0 active:scale-95 transition-all"
            >
              其他版本
              <i class="ri-arrow-right-s-line text-sm"></i>
            </button>
          </div>

          <!-- 第三行：险种 segmented，等宽圆角 -->
          <div class="px-3 pb-3">
            <div class="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                  v-for="type in policyTypes"
                  :key="type.key"
                  @click="switchType(type.key)"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12.5px] font-black rounded-lg transition-all whitespace-nowrap"
                  :class="activeType === type.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 active:bg-stone-200'"
              >
                <i :class="type.icon" class="text-[14px]"></i>
                <span>{{ type.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 版本历史抽屉（保留逻辑，移出 header） -->
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
              <div v-if="!historyList.length" class="py-12 flex flex-col items-center text-center">
                <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mb-3">
                  <i class="ri-stack-line text-2xl"></i>
                </div>
                <p class="text-[13px] font-bold text-slate-500">暂无其他版本</p>
                <p class="text-[11.5px] text-slate-400 mt-1">当前已是这座城市唯一的一份情报</p>
              </div>
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
                    <img :src="item.avatar || DEFAULT_AVATAR" class="w-5 h-5 rounded-full object-cover bg-slate-100 shrink-0" />
                    <span class="font-bold text-slate-800 text-sm">{{ item.nickname || '匿名大侠' }}</span>
                    <span v-if="myUserId && item.userId === myUserId" class="text-blue-600 text-[10px] bg-blue-100 px-1.5 py-0.5 rounded font-bold">我的</span>
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

        <div class="flex md:flex-row flex-1 overflow-hidden relative">

          <div class="w-full md:w-2/3 h-full overflow-y-auto px-4 pt-3 pb-24 md:px-8 md:pt-5 scroll-smooth">

            <template v-if="currentPolicy.hasData">
            <!-- 政策亮点 chips · 圆角淡彩 -->
            <div v-if="policyHighlights.length" class="mb-3 flex flex-wrap gap-1.5">
              <span
                v-for="h in policyHighlights"
                :key="h.label"
                :class="['inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border', highlightToneClass(h.tone)]"
              >
                <i class="ri-checkbox-circle-fill text-[12px]"></i>
                {{ h.label }}
              </span>
            </div>

            <!-- 高敏感城市资格中性提醒 · 圆角玫红卡 -->
            <div
              v-if="showLocalEligibilityNotice"
              class="mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-2xl bg-rose-50 border border-rose-100"
            >
              <i class="ri-error-warning-line text-rose-500 text-[16px] mt-0.5 shrink-0"></i>
              <p class="text-[12px] text-rose-700 leading-relaxed font-medium">
                <span class="font-black mr-0.5">资格提醒：</span>参保资格须符合当地规定（如本地真实就业、居住）。请向 {{ currentPolicy.cityName || selectedArea.name }} 医保局（<span class="font-mono text-rose-600">12393</span>）核实。
              </p>
            </div>

            <!-- 关键事实双联：白底细线 · 杂志风 -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <!-- 门诊特殊病种 -->
              <div
                class="relative overflow-hidden rounded-2xl bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-4 transition-all"
              >
                <div
                  class="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                  :class="currentPolicy.mente ? 'bg-teal-700' : 'bg-stone-300'"
                ></div>

                <div class="pl-2">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    :class="currentPolicy.mente ? 'bg-teal-50 text-teal-800' : 'bg-stone-100 text-stone-400'"
                  >
                    <i class="ri-hospital-line text-lg"></i>
                  </div>
                  <p class="text-[11px] font-medium text-stone-500 mb-1">门诊特殊病种</p>
                  <p
                    class="text-[20px] font-bold tracking-tight leading-none mb-2"
                    :class="currentPolicy.mente ? 'text-stone-900' : 'text-stone-400'"
                  >
                    {{ currentPolicy.mente ? '已纳入' : '未纳入' }}
                  </p>
                  <p class="text-[10.5px] text-stone-500 leading-relaxed">
                    {{ currentPolicy.mente ? '门诊检查与拿药可走医保统筹' : '当前仅限住院期间报销' }}
                  </p>
                </div>
              </div>

              <!-- 双通道药房 -->
              <div
                class="relative overflow-hidden rounded-2xl bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-4 transition-all"
              >
                <div
                  class="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                  :class="currentPolicy.dualChannel ? 'bg-indigo-700' : 'bg-stone-300'"
                ></div>

                <div class="pl-2">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    :class="currentPolicy.dualChannel ? 'bg-indigo-50 text-indigo-800' : 'bg-stone-100 text-stone-400'"
                  >
                    <i class="ri-capsule-line text-lg"></i>
                  </div>
                  <p class="text-[11px] font-medium text-stone-500 mb-1">双通道药房</p>
                  <p
                    class="text-[20px] font-bold tracking-tight leading-none mb-2"
                    :class="currentPolicy.dualChannel ? 'text-stone-900' : 'text-stone-400'"
                  >
                    {{ currentPolicy.dualChannel ? '支持外购' : '不支持' }}
                  </p>
                  <p class="text-[10.5px] text-stone-500 leading-relaxed">
                    {{ currentPolicy.dualChannel ? '指定药店购药可纳入报销' : '需在医院端开方与拿药' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 报销比例：白底大数字 -->
            <div class="mb-4 rounded-2xl bg-white border border-stone-200/90 shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-28 h-28 rounded-full bg-stone-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div class="relative">
                <div class="flex items-end justify-between mb-4">
                  <div>
                    <p class="text-[12px] font-semibold text-stone-800 flex items-center gap-1.5">
                      <i class="ri-pie-chart-2-line text-stone-400"></i>
                      报销快照
                    </p>
                    <p class="text-[11px] text-stone-500 mt-0.5">实际报销比例</p>
                  </div>
                  <div class="flex items-baseline text-stone-900 tabular-nums">
                    <span class="text-[52px] font-bold leading-none tracking-tight">{{ currentPolicy.dualRatio || 0 }}</span>
                    <span class="text-[20px] font-bold ml-0.5 text-stone-600">%</span>
                  </div>
                </div>

                <div class="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden mb-4">
                  <div
                    class="h-full rounded-full bg-teal-700 transition-all duration-700"
                    :style="{ width: (currentPolicy.dualRatio || 0) + '%' }"
                  ></div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                  <div>
                    <p class="text-[10px] text-stone-400 font-medium mb-1">起付线</p>
                    <p class="text-[17px] font-bold text-stone-900 tabular-nums">
                      ¥{{ currentPolicy.deductible || 0 }}<span class="text-[11px] font-medium text-stone-400 ml-1">/年</span>
                    </p>
                  </div>
                  <div v-if="currentPolicy.dualNote">
                    <p class="text-[10px] text-stone-400 font-medium mb-1">备注</p>
                    <p class="text-[11.5px] text-stone-600 leading-relaxed line-clamp-2">{{ currentPolicy.dualNote }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 核心药物供应 · 圆角白卡 -->
            <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
              <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="ri-medicine-bottle-fill text-blue-500"></i>
                  <span class="font-black text-slate-800 text-[14px]">核心药物供应</span>
                </div>
                <span v-if="currentPolicy.drugs?.length" class="text-[10.5px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {{ currentPolicy.drugs.filter(d => d.status === 'yes').length }} / {{ currentPolicy.drugs.length }} 有货
                </span>
              </div>

              <div v-if="!currentPolicy.drugs || currentPolicy.drugs.length === 0" class="p-6 text-center text-slate-400 text-[12px]">
                暂无数据
              </div>

              <div v-else class="divide-y divide-slate-100">
                <div v-for="drug in currentPolicy.drugs" :key="drug.key" class="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <div class="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <i :class="[drug.icon || 'ri-capsule-line', drug.color || 'text-slate-500']" class="text-base"></i>
                      </div>
                      <span class="text-[13px] font-bold text-slate-800 truncate">{{ drug.name }}</span>
                    </div>
                    <span v-if="drug.status === 'yes'" class="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">有货</span>
                    <span v-else-if="drug.status === 'no'" class="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 shrink-0">缺货</span>
                    <span v-else class="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200 shrink-0">未知</span>
                  </div>

                  <div v-if="drug.status === 'yes' && (drug.phone || drug.comment)" class="mt-2 ml-11 pl-3 border-l-2 border-emerald-100 space-y-1.5">
                    <p v-if="drug.phone" class="text-[11.5px] text-slate-500 flex items-center gap-1.5">
                      <i class="ri-phone-fill text-slate-300"></i>
                      <span class="font-mono">{{ drug.phone }}</span>
                    </p>
                    <p v-if="drug.comment" class="text-[12px] text-slate-600 italic leading-relaxed bg-emerald-50/40 px-2 py-1.5 rounded-lg">"{{ drug.comment }}"</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 避坑笔记 · 圆角白卡 + 引号 -->
            <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 mb-4 relative overflow-hidden">
              <div class="absolute -top-3 left-4 text-[60px] text-slate-100 font-serif leading-none select-none pointer-events-none">"</div>
              <div class="relative">
                <h3 class="font-black text-slate-800 mb-3 flex items-center gap-2 text-[14px]">
                  <i class="ri-book-open-fill text-amber-500"></i> 避坑笔记
                </h3>
                <p v-if="currentPolicy.summary" class="text-[13.5px] text-slate-700 leading-[1.85]">
                  {{ currentPolicy.summary }}
                </p>
                <p v-else class="text-[12.5px] text-slate-400 italic">这里还没有病友留下经验，欢迎补充情报。</p>
              </div>
            </div>

            <!-- 报销凭证 · 圆角图库 -->
            <div class="mb-5">
              <div class="flex items-center justify-between mb-2.5 px-1">
                <h3 class="text-[13px] font-black text-slate-800 flex items-center gap-1.5">
                  <i class="ri-image-2-fill text-blue-500"></i> 报销凭证
                </h3>
                <span v-if="currentPolicy.evidenceList?.length" class="text-[10.5px] font-bold text-slate-400">
                  共 {{ currentPolicy.evidenceList.length }} 张
                </span>
              </div>

              <div v-if="currentPolicy.evidenceList && currentPolicy.evidenceList.length > 0" class="grid grid-cols-4 gap-2">
                <div
                    v-for="(img, index) in currentPolicy.evidenceList"
                    :key="index"
                    class="relative aspect-square rounded-xl bg-slate-100 overflow-hidden cursor-zoom-in group border border-slate-200"
                    @click="previewImage(img)"
                >
                  <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="证据">
                </div>
              </div>

              <div v-else class="rounded-2xl bg-slate-50 border border-dashed border-slate-200 px-4 py-4 flex items-center gap-2 text-[12px] text-slate-400">
                <i class="ri-image-line text-base"></i>
                暂无图片证据，等待病友上传
              </div>
            </div>

            </template>

            <!-- 无数据空状态 -->
            <div v-else class="pt-10 pb-4 flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-300 flex items-center justify-center mb-4">
                <i class="ri-map-pin-add-line text-3xl"></i>
              </div>
              <h3 class="text-[16px] font-black text-slate-800">{{ selectedArea.name }} 还没有这条情报</h3>
              <p class="text-[12.5px] text-slate-500 leading-relaxed mt-1.5 max-w-[260px]">
                当前「{{ activeTypeLabel }}」暂无病友上传报销 / 用药数据，你可以成为第一个补充的人。
              </p>
            </div>

            <!-- 贡献 CTA · 深色实心圆角 -->
            <div class="mt-6">
              <button
                @click="openEditDialog"
                class="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 py-3.5 text-white font-black text-[14px] shadow-lg shadow-slate-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <i class="ri-edit-2-line text-base"></i>
                <span>{{ contributeLabel }}</span>
              </button>
              <p class="text-[10.5px] text-slate-400 text-center mt-2 font-medium">
                {{ currentPolicy.hasData && !isMyVersion ? '不会覆盖 TA 的版本，你填的是属于你自己的一份 ✨' : '你的实测能让下一个病友少走一段弯路 ✨' }}
              </p>
            </div>

            <footer class="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 leading-relaxed">
              <p>数据来源：病友实测上传 · 仅供参考</p>
              <p class="mt-1">
                <button
                  @click="showGuideSheet = true"
                  class="underline decoration-dotted underline-offset-2 hover:text-slate-600 transition-colors"
                >《数据来源与使用须知》</button>
                <span class="mx-1">·</span>
                办理前请致电参保地 <span class="font-mono">12393</span>
              </p>
            </footer>
          </div>
          <div v-if="showEditDrawer" @click="showEditDrawer = false" class="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"></div>

          <div
              class="fixed bottom-0 left-0 w-full bg-slate-50 z-[70] rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out flex flex-col h-[85vh] md:h-[90vh] md:w-[500px] md:left-1/2 md:-translate-x-1/2 md:rounded-t-xl"
              :class="showEditDrawer ? 'translate-y-0' : 'translate-y-full'"
          >

            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white rounded-t-2xl">
              <button @click="showEditDrawer = false" class="text-slate-500 hover:text-slate-800 text-sm font-medium">取消</button>
              <span class="font-bold text-slate-800 text-lg">我的版本 / {{ selectedArea.name }}</span>
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
                        <label class="text-[10px] font-bold text-slate-400 mb-1 block">药房电话</label>
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
                        <label class="text-[10px] font-bold text-slate-400 mb-1 block">购买体验 / 价格备注</label>
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
                  * 请上传真实报销单/发票/政策截图。涉跨地区参保的，请同时注明你的常住地与办理渠道，便于他人核对当地细则。
                </p>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">避坑指南 & 经验摘要</label>
                  <textarea
                      v-model="editForm.summary"
                      rows="4"
                      placeholder="示例：我于2025年在重庆以灵活就业参保，已办门特；乌帕替尼15mg×2盒，总价约9k，统筹报销约78%，自付约2k+。附结算单截图。请勿写「教你换城市参保」类内容。"
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
              @click="openCityBoard"
              class="md:hidden fixed bottom-24 right-6 mb-[env(safe-area-inset-bottom)] h-14 w-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center z-50 active:scale-90 transition-transform"
          >
            <i class="ri-message-3-line text-2xl"></i>
            <div v-if="cityComments.length" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full border border-white flex items-center justify-center">
              {{ cityComments.length > 99 ? '99+' : cityComments.length }}
            </div>
          </button>

          <div v-if="showMobileChat" @click="showMobileChat = false" class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm md:hidden transition-opacity"></div>

          <div
              class="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col h-[75vh]"
              :class="showMobileChat ? 'translate-y-0' : 'translate-y-full'"
          >
            <div class="flex justify-center pt-3 pb-1" @click="showMobileChat = false">
              <div class="h-1.5 w-12 bg-slate-300 rounded-full"></div>
            </div>

            <div class="px-4 pt-1 pb-3 border-b border-slate-100 flex items-center gap-2">
              <i class="ri-group-2-line text-blue-500 text-lg"></i>
              <h3 class="font-black text-slate-800">病友阵地 · {{ selectedArea.name }}</h3>
              <span v-if="cityComments.length" class="text-[11px] font-bold text-slate-400">{{ cityComments.length }} 条留言</span>
            </div>

            <div class="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
              <div v-if="isLoadingComments" class="flex items-center justify-center py-12 text-slate-400 gap-2">
                <i class="ri-loader-4-line animate-spin text-xl"></i> 正在加载留言…
              </div>

              <template v-else>
                <div v-if="cityComments.length === 0" class="flex flex-col items-center justify-center py-14 text-center">
                  <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mb-3">
                    <i class="ri-chat-3-line text-2xl"></i>
                  </div>
                  <p class="text-[13px] font-bold text-slate-500">还没有人在 {{ selectedArea.name }} 留言</p>
                  <p class="text-[11.5px] text-slate-400 mt-1">说说你在这座城市办医保 / 报销的真实经历吧</p>
                </div>

                <div v-for="c in cityComments" :key="c.id" class="flex items-start gap-2.5">
                  <img :src="c.userAvatar || DEFAULT_AVATAR" class="w-9 h-9 rounded-full object-cover bg-slate-100 shrink-0 border border-slate-100" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[12.5px] font-black text-slate-700 truncate">{{ c.userName || '匿名病友' }}</span>
                      <span class="text-[10.5px] text-slate-400 shrink-0">{{ formatCommentTime(c.createTime) }}</span>
                      <button
                        v-if="c.userId === myUserId"
                        @click="deleteCityComment(c)"
                        class="ml-auto text-[10.5px] text-slate-300 hover:text-rose-500 active:scale-95 transition-all shrink-0"
                      >删除</button>
                    </div>
                    <div class="mt-1 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl rounded-tl-md text-[13px] text-slate-700 leading-relaxed break-words">
                      {{ c.content }}
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <div class="p-3 border-t border-slate-100 safe-area-bottom flex items-center gap-2">
              <div class="w-full space-y-2">
                <div class="rounded-2xl bg-blue-50 border border-blue-100 px-3 py-2 text-[11px] leading-relaxed text-blue-700">
                  <p class="font-black mb-1">留言建议</p>
                  <p>可以写客观事实：办理时间、材料清单、窗口反馈、报销到账周期。</p>
                  <p class="text-blue-500">不要做：评价某市政策、伪造材料、教导规避资格审核。</p>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="cityCommentInput"
                    type="text"
                    maxlength="500"
                    @keydown.enter="sendCityComment"
                    placeholder="例：我在本地办门特，用了诊断证明和出院小结"
                    class="flex-1 bg-slate-100 rounded-full py-3 px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                  <button
                    @click="sendCityComment"
                    :disabled="isSendingComment || !cityCommentInput.trim()"
                    class="shrink-0 h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300 active:scale-90 transition-all"
                  >
                    <i :class="isSendingComment ? 'ri-loader-4-line animate-spin' : 'ri-send-plane-fill'" class="text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>

    <!-- ============ 数据来源与使用须知（首次进入强提示 + 二次查阅入口）============ -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showGuideSheet" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="!disclaimerForceAck && (showGuideSheet = false)"></div>

          <div class="relative bg-white w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

            <header class="shrink-0 px-6 pt-7 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p class="text-[10px] font-bold text-stone-400 mb-1.5">信息共享条款</p>
                <h3 class="text-[19px] font-black text-slate-900 tracking-tight">数据来源与使用须知</h3>
                <p class="text-[12px] text-slate-500 font-medium mt-1">Crohn Paradise · 政策地图模块</p>
              </div>
              <button
                v-if="!disclaimerForceAck"
                @click="showGuideSheet = false"
                class="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center active:scale-90 shrink-0"
              >
                <i class="ri-close-line text-lg"></i>
              </button>
            </header>

            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[13px] leading-[1.75] text-slate-600 custom-scroll">

              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">1</span>
                  <h4 class="text-[13.5px] font-black text-slate-900">信源声明</h4>
                </div>
                <p class="text-slate-600 pl-7">
                  本地图数据由社区病友自行上传的实测信息汇总，包含办理时间、城市、险种、报销凭证截图等。<strong class="text-slate-800">平台不审核单条数据的真实性</strong>、不验证用户身份与材料合规性，仅做时间戳与证据存档。
                </p>
              </section>

              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">2</span>
                  <h4 class="text-[13.5px] font-black text-slate-900">性质声明</h4>
                </div>
                <p class="text-slate-600 pl-7">
                  本模块为<strong class="text-slate-800">信息共享社区</strong>，不提供医保代办、不构成参保建议、不出具任何形式的"省钱排行"或"参保推荐"。所列政策是否适用于你、能否办理、能否报销，请以参保地医保局（<strong class="text-blue-600 font-mono">12393</strong>）官方答复为准。
                </p>
              </section>

              <section>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">3</span>
                  <h4 class="text-[13.5px] font-black text-slate-900">资格边界</h4>
                </div>
                <p class="text-slate-600 pl-7">
                  我国推动职工 / 灵活就业医保<strong class="text-slate-800">取消户籍限制</strong>，但仍以"本地真实就业、居住、户籍"等资格条件为基础。<strong class="text-rose-600">平台不鼓励、不指导任何形式的材料伪造或资格套利。</strong>如对自身参保资格存疑，请优先咨询当地医保局或人社部门。
                </p>
              </section>

              <section class="rounded-xl bg-slate-50 border border-slate-100 p-4 mt-2">
                <p class="text-[11.5px] text-slate-500 leading-relaxed">
                  <i class="ri-quill-pen-line text-slate-400"></i>
                  上传内容时，请如实记录<strong class="text-slate-700">参保地、办理渠道、办理时间</strong>，并附结算单或发票截图；不要写"快来 XX 市参保"等导向性文案，以保护社区与你自身。
                </p>
              </section>

            </div>

            <footer class="shrink-0 px-6 py-4 border-t border-slate-100 bg-white">
              <button
                @click="ackDisclaimer"
                class="w-full py-3.5 rounded-xl bg-slate-900 text-white text-[14px] font-black active:scale-[0.98] transition-transform"
              >
                {{ disclaimerForceAck ? '我已阅读，进入地图' : '知道了' }}
              </button>
              <p class="text-center text-[10px] text-slate-400 mt-2.5">办理前请致电参保地医保局 <span class="font-mono">12393</span> · 以官方答复为准</p>
            </footer>
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import * as echarts from 'echarts'
import chinaJson from '@/assets/map/china.json'
import http from '@/api/http.js'
import { getAuthItem } from '@/utils/authToken'

// 编辑抽屉状态
const showEditDrawer = ref(false)
const fileInputRef = ref(null)
const drugOptions = [
  { key: 'rinvoq', name: '乌帕替尼 (Rinvoq)', icon: 'ri-capsule-fill', color: 'text-blue-600' },
  { key: 'adalimumab', name: '阿达木单抗 (修美乐等)', icon: 'ri-syringe-line', color: 'text-green-600' },
  { key: 'stelara', name: '输液单抗 (乌斯奴/古塞奇尤)', icon: 'ri-drop-line', color: 'text-purple-600' },
  { key: 'nutrition', name: '全肠内营养 (能全素/安素)', icon: 'ri-cup-line', color: 'text-orange-600' }
]

const editForm = reactive({
  mente: false,
  dualChannel: false,
  dualRatio: 0,
  summary: '',
  evidenceList: [],
  dualNote: '',
  deductible: 0,
  nominalRatio: 80,
  hiddenSelfPay: 0,
  drugs: drugOptions.map(d => ({
    key: d.key,
    name: d.name,
    icon: d.icon,
    color: d.color,
    status: 'unknown',
    phone: '',
    comment: ''
  }))
})

const calculatedRealRatio = computed(() => {
  const real = editForm.nominalRatio * (100 - editForm.hiddenSelfPay) / 100
  return Math.round(real)
})

const triggerUpload = () => {
  fileInputRef.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('图片太大了，请上传 5MB 以内的图片')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 12000,
    })
    if (res.status === 200) {
      const serverUrl = res.data

      editForm.evidenceList.push(serverUrl)
    } else {
      alert('上传失败: ' + res.data.msg)
    }
  } catch (error) {
    alert('上传失败，请稍后再试')
  } finally {
    event.target.value = ''
  }
}

const removeImage = (index) => {
  editForm.evidenceList.splice(index, 1)
}

// 监听计算结果，自动同步给 dualRatio
watch(calculatedRealRatio, (val) => {
  editForm.dualRatio = val
})

// 把一份 policy 数据灌进编辑表单（没有就给空白）
const fillEditForm = (p) => {
  const src = p || {}
  editForm.mente = src.mente || false
  editForm.dualChannel = src.dualChannel || false
  editForm.dualRatio = src.dualRatio || 0
  editForm.summary = src.summary || ''
  editForm.dualNote = src.dualNote || ''
  editForm.evidenceList = Array.isArray(src.evidenceList) ? [...src.evidenceList] : []
  editForm.deductible = src.deductible || 0
  editForm.nominalRatio = src.nominalRatio || 80
  editForm.hiddenSelfPay = src.hiddenSelfPay || 0
  editForm.drugs = drugOptions.map(opt => {
    const existing = Array.isArray(src.drugs) ? src.drugs.find(d => d.key === opt.key) : null
    return {
      key: opt.key,
      name: opt.name,
      icon: opt.icon,
      color: opt.color,
      status: existing?.status || 'unknown',
      phone: existing?.phone || '',
      comment: existing?.comment || ''
    }
  })
}

const openEditDialog = async () => {
  // 编辑永远基于「我自己的版本」：当前看的就是我的就直接用，否则去后端拿我的，没有就空白新建
  if (isMyVersion.value) {
    fillEditForm(currentPolicy.value)
    showEditDrawer.value = true
    return
  }
  showEditDrawer.value = true
  try {
    const res = await http.get('/policy/mine', {
      params: { city: selectedArea.name, type: activeType.value }
    })
    if (res.code === 200 && res.data) {
      fillEditForm(res.data)
    } else {
      fillEditForm(null)
    }
  } catch (e) {
    if (e?.response?.status === 401) {
      alert('请先登录再补充情报')
      showEditDrawer.value = false
      return
    }
    fillEditForm(null)
  }
}

const submitEdit = async () => {
  const payload = {
    cityName: selectedArea.name,
    policyType: activeType.value,
    updateTime: new Date().toISOString().split('T')[0],
    nickname: getAuthItem('nickname') || '热心病友',
    userId: 0, // 游客 ID
    ...editForm
  }

  try {
    const res = await http.post('/policy/save', payload)

    if (res.code === 200) {
      alert('提交成功！这是你自己的版本，已记录到「其他版本」里')
      showEditDrawer.value = false
      // 提交后直接显示「我的版本」，让用户看到自己刚填的内容
      try {
        const mineRes = await http.get('/policy/mine', {
          params: { city: selectedArea.name, type: activeType.value }
        })
        if (mineRes.code === 200 && mineRes.data) {
          currentPolicy.value = { ...mineRes.data, hasData: true }
        } else {
          await loadPolicyData(selectedArea.name)
        }
      } catch (e) {
        await loadPolicyData(selectedArea.name)
      }
    } else if (res.code === 401) {
      alert('请先登录再补充情报')
    } else {
      alert('提交失败: ' + res.msg)
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      alert('请先登录再补充情报')
    } else {
      alert('网络连接失败，请稍后再试')
    }
  }
}

// 地图与详情状态
const showMobileChat = ref(false)

// ===== 病友阵地（城市留言板）=====
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/thumbs/svg?seed=crohn'
const myUserId = Number(getAuthItem('userId')) || null
const cityComments = ref([])
const cityCommentInput = ref('')
const isLoadingComments = ref(false)
const isSendingComment = ref(false)

const formatCommentTime = (value) => {
  const date = value ? new Date(typeof value === 'string' ? value.replace(' ', 'T') : value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  const diff = Date.now() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  return `${date.getMonth() + 1}.${date.getDate()}`
}

const loadCityComments = async () => {
  const city = selectedArea.name
  if (!city) return
  isLoadingComments.value = true
  try {
    const res = await http.get('/policy/comments', { params: { city } })
    if (res.code === 200) {
      cityComments.value = Array.isArray(res.data) ? res.data : []
    }
  } catch (e) {
    console.error('加载病友阵地留言失败:', e)
  } finally {
    isLoadingComments.value = false
  }
}

const openCityBoard = async () => {
  showMobileChat.value = true
  await loadCityComments()
}

const riskyPolicyCommentPattern = /(代办|包过|挂靠|伪造|假材料|刷流水|骗保|套利|随便填|不用资格|不查资格|快来.*参保|推荐.*参保|哪里便宜去哪)/i

const sendCityComment = async () => {
  const content = cityCommentInput.value.trim()
  if (!content || isSendingComment.value) return
  const city = selectedArea.name
  if (!city) return
  if (riskyPolicyCommentPattern.test(content)) {
    showToast({ type: 'fail', message: '换成真实办理经历会更安全' })
    return
  }
  isSendingComment.value = true
  try {
    const res = await http.post('/policy/comments', { cityName: city, content })
    if (res.code === 200 && res.data) {
      cityComments.value.unshift(res.data)
      cityCommentInput.value = ''
    } else {
      showToast({ type: 'fail', message: res.msg || '留言失败，稍后再试' })
    }
  } catch (e) {
    if (e?.response?.status === 401) {
      showToast({ type: 'fail', message: '请先登录再留言' })
    } else {
      showToast({ type: 'fail', message: '网络不太稳，留言没发出去' })
    }
  } finally {
    isSendingComment.value = false
  }
}

const deleteCityComment = async (comment) => {
  if (!comment || comment.userId !== myUserId) return
  try {
    await showConfirmDialog({
      title: '删除留言',
      message: '确定删除这条留言吗？',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
  } catch (e) {
    return
  }
  try {
    const res = await http.post(`/policy/comments/${comment.id}/delete`)
    if (res.code === 200) {
      cityComments.value = cityComments.value.filter(c => c.id !== comment.id)
    } else {
      showToast({ type: 'fail', message: res.msg || '删除失败' })
    }
  } catch (e) {
    showToast({ type: 'fail', message: '删除失败，稍后再试' })
  }
}

const chartRef = ref(null)
let myChart = null
const currentMap = ref('china')

const showGuideSheet = ref(false)
const showDetailPanel = ref(false)
const disclaimerForceAck = ref(false)

// 首次进入强提示：未 ack 时打开 sheet 且禁用关闭键，强制点"我已阅读"
const DISCLAIMER_ACK_KEY = 'policyMap.disclaimerAcked.v1'
const ackDisclaimer = () => {
  try { localStorage.setItem(DISCLAIMER_ACK_KEY, '1') } catch (e) { /* localStorage 不可用就算了 */ }
  showGuideSheet.value = false
  disclaimerForceAck.value = false
}

// 高敏感城市清单（参保资格审核较严格、易引发跨省套利误读的城市）
// 城市详情顶部显示中性提醒；不影响数据呈现本身
const SENSITIVE_CITIES = ['重庆', '重庆市']

// 政策亮点 chips：从 currentPolicy 派生
const HIGHLIGHT_TONE_CLASS = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
  slate: 'bg-slate-50 text-slate-600 border-slate-200'
}
const highlightToneClass = (tone) => HIGHLIGHT_TONE_CLASS[tone] || HIGHLIGHT_TONE_CLASS.slate

const policyHighlights = computed(() => {
  const p = currentPolicy.value
  if (!p || !p.hasData) return []
  const tags = []
  if (p.policyType === 'flexible' && p.needResidence === false) {
    tags.push({ label: '免居住证', tone: 'emerald' })
  }
  if (p.onlinePharmacy) tags.push({ label: '支持线上购药', tone: 'blue' })
  if (Number(p.dualRatio) >= 80) tags.push({ label: `实际报销 ${p.dualRatio}%`, tone: 'amber' })
  return tags
})

const showLocalEligibilityNotice = computed(() => {
  const p = currentPolicy.value
  if (!p || !p.hasData) return false
  if (activeType.value !== 'flexible') return false
  if (p.requiresLocalEligibility === true) return true
  const cityName = p.cityName || selectedArea.name || ''
  return SENSITIVE_CITIES.some(c => cityName.includes(c))
})

// 医保类型配置
const policyTypes = [
  { key: 'employee', label: '职工医保', icon: 'ri-briefcase-4-line' },
  { key: 'resident', label: '居民医保', icon: 'ri-home-smile-2-line' },
  { key: 'flexible', label: '灵活就业', icon: 'ri-user-voice-line' }
]
const activeType = ref('employee')
const activeTypeLabel = computed(() => policyTypes.find(t => t.key === activeType.value)?.label || '该险种')
// 当前显示的这份是不是「我自己」上传的版本
const isMyVersion = computed(() => !!myUserId && currentPolicy.value?.userId === myUserId)
// 贡献按钮文案：随场景变，避免「修正」歧义
const contributeLabel = computed(() => {
  if (!currentPolicy.value?.hasData) return '我来补充第一条情报'
  return isMyVersion.value ? '编辑我的版本' : '我也来填一份'
})

const selectedArea = reactive({
  name: '',
  data: {
    employee: { hasData: false },
    resident: { hasData: false },
    flexible: { hasData: false }
  }
})

const currentPolicy = ref({})

const switchType = (key) => {
  activeType.value = key
  loadPolicyData(selectedArea.name)
}

const closeDetailPanel = () => {
  showDetailPanel.value = false
  setTimeout(() => myChart && myChart.resize(), 100)
}

const backToChina = () => {
  currentMap.value = 'china'
  selectedArea.name = ''
  showDetailPanel.value = false
  renderMap('china')
}

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
  selectedArea.name = areaName

  const type = activeType.value

  currentPolicy.value = { hasData: false }
  // 切换城市，重置病友阵地
  cityComments.value = []
  cityCommentInput.value = ''
  loadCityComments()

  try {
    const res = await http.get('/policy/detail', {
      params: { city: areaName, type: type }
    })

    if (res.code === 200 && res.data) {
      const realData = res.data
      realData.hasData = true

      currentPolicy.value = { ...realData }
    } else {
      currentPolicy.value = { hasData: false }
    }

  } catch (error) {
    console.error('拉取数据失败:', error)
    currentPolicy.value = { hasData: false }
  }
}

// --- 地图逻辑 ---
// 省份代码映射
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

  myChart.on('click', async (params) => {
    const directCities = ['北京', '天津', '上海', '重庆', '香港', '澳门', '台湾']
    const isDirectCity = directCities.some(city => params.name.includes(city))

    if (currentMap.value === 'china') {
      if (isDirectCity) {
        await loadPolicyData(params.name)
        showDetailPanel.value = true
        return
      }

      const adcode = getAdcodeByName(params.name)

      if (adcode && adcode !== '999999') {
        try {
          const url = `/map/citys/${adcode}.json`

          const response = await fetch(url)
          if (!response.ok) throw new Error(`地图文件缺失 (${response.status})`)

          const provinceJson = await response.json()

          echarts.registerMap('citys', provinceJson)
          currentMap.value = 'citys'
          renderMap('citys', params.name)

        } catch (e) {
          alert(`正在建设【${params.name}】的地图数据，暂为您展示政策列表。`)
          await loadPolicyData(params.name)
          showDetailPanel.value = true
        }
      }
    }
    else {
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
  let acked = false
  try { acked = localStorage.getItem(DISCLAIMER_ACK_KEY) === '1' } catch (e) {}
  if (!acked) {
    disclaimerForceAck.value = true
    showGuideSheet.value = true
  }
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
  } catch (e) {
    currentPolicy.value.likes--;
    currentPolicy.value.isLiked = false;
  }
}

const openHistoryDrawer = async () => {
  // 先把抽屉打开，没有版本也能看到「暂无其他版本」
  const city = currentPolicy.value.cityName || currentPolicy.value.city || selectedArea.name
  const type = currentPolicy.value.policyType || activeType.value
  historyList.value = []
  showHistoryDrawer.value = true
  try {
    const res = await http.get('/policy/history', {
      params: { city: city, type: type }
    });
    if (res.code === 200) {
      historyList.value = Array.isArray(res.data) ? res.data : []
    }
  } catch (e) {
    console.error('加载其他版本失败:', e)
  }
}
// 简单的看图 (暂时用新窗口打开，省事)
const previewImage = (url) => {
  window.open(url, '_blank')
}
// 切换历史版本
const switchVersion = async (item) => {
  try {
    const res = await http.get('policy/detail/version', {
      params: { id: item.id }
    });

    if (res.code === 200 && res.data) {
      currentPolicy.value = res.data
      showHistoryDrawer.value = false;
    }
  } catch (e) {
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
