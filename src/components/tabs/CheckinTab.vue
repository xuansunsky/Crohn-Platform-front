<template>
  <div class="w-full pb-8 bg-[#FBF9F5]">

    <!-- Premium Header -->
    <header class="relative px-5 pt-6 pb-4 overflow-hidden">
      <div class="absolute -top-16 -right-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-20 -left-20 w-56 h-56 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative flex items-center justify-between mb-5">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-[10px] font-black tracking-[0.1em] text-blue-600 uppercase">Crohn Paradise</span>
            <span class="w-1 h-1 rounded-full bg-blue-400"></span>
          </div>
          <h1 class="text-[24px] font-black tracking-tight text-slate-900 leading-none">
            晚上好，<span class="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Xuan</span>
          </h1>
          <p class="text-[12px] text-slate-400 font-medium mt-1.5">今天的肠子还好吗？我们一起翻翻情报。</p>
        </div>
        <div class="relative shrink-0">
          <div class="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur opacity-60"></div>
          <div class="relative w-11 h-11 rounded-full bg-white overflow-hidden border-2 border-white shadow-md">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Xuan" alt="User" class="w-full h-full">
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
      </div>

      <!-- 搜索条 -->
      <div class="relative">
        <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
        <input
            v-model="keyword"
            type="text"
            placeholder="搜索品牌或食物 · 如 KFC / 火锅"
            class="w-full bg-white/90 backdrop-blur-xl text-slate-900 text-[13px] font-medium rounded-2xl py-3 pl-10 pr-20 outline-none border border-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)] focus:bg-white focus:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.12)] focus:border-blue-200 transition-all placeholder-slate-400"
        >
        <button class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-sm hover:bg-slate-800 active:scale-95 transition-all">
          雷达
        </button>
      </div>
    </header>

    <main class="px-5 space-y-5 mt-2">

      <!-- 战术金刚区 -->
      <section class="grid grid-cols-2 gap-3">
        <!-- 药物图谱 -->
        <button
            @click="emit('change-tab', 'drugmap')"
            class="relative overflow-hidden rounded-[24px] p-5 text-left bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-700 text-white shadow-[0_12px_32px_-12px_rgba(16,185,129,0.5)] cursor-pointer active:scale-[0.97] hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div class="absolute top-3 right-3 text-[60px] opacity-10 leading-none">💊</div>
          <div class="relative flex items-center justify-between mb-4">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <i class="ri-capsule-fill text-lg"></i>
            </div>
            <i class="ri-arrow-right-up-line text-base opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"></i>
          </div>
          <h3 class="text-[15px] font-black tracking-tight leading-tight">前沿药物图谱</h3>
          <p class="text-[10.5px] text-white/80 mt-1 font-medium">瑞福 · 喜达诺 · 英夫利昔</p>
        </button>

        <!-- 顶级专科 -->
        <button
            @click="emit('change-tab', 'hospital')"
            class="relative overflow-hidden rounded-[24px] p-5 text-left bg-gradient-to-br from-amber-500 via-amber-500 to-orange-700 text-white shadow-[0_12px_32px_-12px_rgba(245,158,11,0.5)] cursor-pointer active:scale-[0.97] hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div class="absolute top-3 right-3 text-[60px] opacity-10 leading-none">🏥</div>
          <div class="relative flex items-center justify-between mb-4">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <i class="ri-hospital-fill text-lg"></i>
            </div>
            <i class="ri-arrow-right-up-line text-base opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"></i>
          </div>
          <h3 class="text-[15px] font-black tracking-tight leading-tight">顶级专科中心</h3>
          <p class="text-[10.5px] text-white/80 mt-1 font-medium">本地绿道 · 避坑宝典</p>
        </button>
      </section>

      <!-- 今日推荐 / Hero -->
      <section v-if="todayPick" class="relative overflow-hidden rounded-[28px] bg-slate-900 cursor-pointer group active:scale-[0.99] transition-all" @click="openDetail(todayPick)">
        <div class="relative h-44">
          <img :src="todayPick.image" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          <!-- 顶部标签 -->
          <div class="absolute top-4 left-4 flex items-center gap-1.5">
            <span class="text-[10px] font-black tracking-[0.25em] text-amber-300 uppercase px-2.5 py-1 bg-amber-300/15 backdrop-blur-md rounded-full border border-amber-300/30">
              ✦ Today Pick
            </span>
          </div>

          <!-- 右上角评分 -->
          <div class="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
            <span class="text-[11px] font-black text-white">{{ todayPick.safeRate }}%</span>
            <span class="text-[9px] font-bold text-white/70">SAFE</span>
          </div>

          <!-- 底部内容 -->
          <div class="absolute bottom-0 left-0 right-0 p-5">
            <p class="text-[10.5px] font-bold text-white/60 tracking-wider mb-1">{{ todayPick.brand }}</p>
            <h2 class="text-white text-[22px] font-black tracking-tight leading-none mb-2">{{ todayPick.product }}</h2>
            <p class="text-white/70 text-[12px] line-clamp-1">{{ todayPick.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 列表标题 -->
      <div class="flex items-end justify-between pt-2">
        <div>
          <h3 class="text-[18px] font-black tracking-tight text-slate-900">情报库</h3>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">{{ filteredList.length }} 条实测情报 · 持续更新</p>
        </div>
        <div class="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button
              v-for="f in filters"
              :key="f.id"
              @click="activeFilter = f.id"
              :class="[
              'px-3 py-1.5 rounded-full text-[11px] font-bold transition-all',
              activeFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            ]"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-300">
        <div class="w-16 h-16 mb-3 rounded-2xl bg-slate-50 flex items-center justify-center">
          <i class="ri-inbox-line text-2xl"></i>
        </div>
        <p class="text-[13px] font-medium">没有找到相关情报</p>
      </div>

      <!-- 食物卡片 -->
      <div class="space-y-3">
        <article
            v-for="item in filteredList"
            :key="item.id"
            @click="openDetail(item)"
            class="group relative bg-white rounded-[24px] p-3.5 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 cursor-pointer"
        >
          <div class="flex gap-3.5">
            <!-- 图片 -->
            <div class="relative w-[88px] h-[88px] rounded-2xl overflow-hidden shrink-0 bg-slate-100">
              <img :src="item.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              <div
                  v-if="item.type === 'danger'"
                  class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-md tracking-wider"
              >
                高危
              </div>
              <div
                  v-else-if="item.type === 'safe'"
                  class="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md tracking-wider"
              >
                安全
              </div>
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-[10.5px] font-bold text-slate-400 tracking-wide truncate">{{ item.brand }}</p>
                    <h3 class="text-[15.5px] font-black text-slate-900 tracking-tight truncate mt-0.5">{{ item.product }}</h3>
                  </div>
                  <div class="text-right shrink-0">
                    <div
                        class="text-[20px] font-black leading-none tracking-tighter"
                        :class="item.type === 'danger' ? 'text-rose-500' : (item.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')"
                    >
                      {{ item.safeRate }}<span class="text-[10px] opacity-70">%</span>
                    </div>
                    <div class="text-[8.5px] font-bold text-slate-400 tracking-widest mt-0.5">SAFE</div>
                  </div>
                </div>
                <p class="text-[11.5px] text-slate-500 mt-1.5 line-clamp-1 leading-snug">
                  {{ item.desc }}
                </p>
              </div>

              <div class="flex items-center justify-between mt-2">
                <div class="flex gap-1.5">
                  <span
                      v-for="tag in (item.tags || []).slice(0, 2)"
                      :key="tag"
                      class="text-[9.5px] font-bold px-2 py-0.5 rounded-md"
                      :class="getBadgeStyle(item.type)"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <i class="ri-group-line"></i> {{ item.voteCount }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- 浮动新增按钮 -->
    <button
        @click="showUploadModal = true"
        class="fixed bottom-[78px] right-5 z-30 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-[0_12px_28px_-8px_rgba(15,23,42,0.5)] flex items-center justify-center active:scale-90 transition-all group"
    >
      <i class="ri-add-line text-2xl group-hover:rotate-90 transition-transform duration-300"></i>
      <span class="absolute -inset-1 rounded-full bg-blue-500/30 blur-md -z-10 opacity-60 group-hover:opacity-100 transition-opacity"></span>
    </button>

    <!-- 详情 Modal -->
    <div v-if="showDetailModal && currentFood" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div @click="showDetailModal = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

      <div class="bg-slate-50 w-full sm:w-[520px] h-[92vh] sm:h-[88vh] sm:rounded-[32px] rounded-t-[32px] relative z-10 animate-slide-up shadow-2xl flex flex-col overflow-hidden">

        <!-- 抓手 -->
        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-30"></div>

        <!-- Hero 图 -->
        <div class="relative h-56 sm:h-64 shrink-0">
          <img
              :src="currentFood.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'"
              class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-slate-900/20"></div>

          <!-- 关闭按钮 -->
          <button
              @click="showDetailModal = false"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white hover:bg-white/25 flex items-center justify-center transition-all active:scale-90 z-20"
          >
            <i class="ri-close-line text-lg"></i>
          </button>

          <!-- 信息层 -->
          <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider backdrop-blur-md border mb-2"
                :class="currentFood.type === 'danger' ? 'bg-rose-500/30 border-rose-400/50 text-rose-100' : (currentFood.type === 'safe' ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-100' : 'bg-amber-500/30 border-amber-400/50 text-amber-100')"
            >
              <i :class="currentFood.type === 'danger' ? 'ri-fire-fill' : (currentFood.type === 'safe' ? 'ri-leaf-fill' : 'ri-error-warning-fill')"></i>
              {{ currentFood.type === 'danger' ? '高危雷区' : (currentFood.type === 'safe' ? '安全白名单' : '薛定谔的屎') }}
            </span>
            <p class="text-[11px] font-bold text-white/70 tracking-wide">{{ currentFood.brand }}</p>
            <h3 class="text-[26px] font-black tracking-tight leading-tight">{{ currentFood.product }}</h3>
          </div>
        </div>

        <!-- 滚动区 -->
        <div class="overflow-y-auto flex-1 px-5 pt-5 pb-6 custom-scrollbar space-y-4">
          <!-- 综合评分卡 -->
          <div class="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between mb-5">
              <div>
                <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase">综合安全评估</p>
                <div class="flex items-baseline gap-1.5 mt-1">
                  <span
                      class="text-[36px] font-black tracking-tighter leading-none"
                      :class="currentFood.type === 'danger' ? 'text-rose-500' : (currentFood.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')"
                  >
                    {{ currentFood.safeRate }}%
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase">总测评</p>
                <p class="text-[20px] font-black text-slate-900 mt-1 leading-none">
                  {{ currentFood.voteCount }}<span class="text-[11px] font-medium text-slate-400 ml-0.5">人</span>
                </p>
              </div>
            </div>

            <div class="space-y-2.5 border-t border-slate-50 pt-4">
              <p class="text-[10px] font-black text-slate-700 mb-3 tracking-widest uppercase">身体反馈分布</p>
              <div v-for="level in levels" :key="level.val" class="flex items-center gap-3 text-[12px]">
                <span class="w-16 text-right text-slate-500 font-medium truncate">{{ level.name.split('·')[0] }}</span>
                <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                      class="h-full rounded-full transition-all duration-700"
                      :class="level.bgClass"
                      :style="`width: ${ (getLevelCount(level.val) / currentFood.voteCount) * 100 || 0 }%`"
                  ></div>
                </div>
                <span class="w-7 text-slate-900 font-black text-right">{{ getLevelCount(level.val) }}</span>
              </div>
            </div>
          </div>

          <!-- 战报区 -->
          <div>
            <h4 class="flex items-center justify-between mb-3 px-1">
              <span class="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <i class="ri-message-3-fill text-blue-500"></i>
                实测战报
              </span>
              <span class="text-[10px] font-bold text-slate-400 tracking-wider">{{ currentFoodReports.length }} REPORTS</span>
            </h4>

            <div class="space-y-2.5">
              <div
                  v-for="report in currentFoodReports"
                  :key="report.id"
                  class="bg-white p-4 rounded-[20px] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-md transition-all"
              >
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center gap-2.5">
                    <img
                        :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.userName}`"
                        class="w-9 h-9 rounded-full bg-slate-50 shrink-0 border border-white shadow-sm"
                    >
                    <div class="flex flex-col gap-0.5">
                      <div class="flex items-center gap-1.5">
                        <span class="text-[12px] font-black text-slate-800">{{ report.userName }}</span>
                        <div
                            class="px-1.5 py-0.5 rounded text-[9px] font-black tracking-tight"
                            :class="getLevelStyle(report.levelId)"
                        >
                          {{ getLevelInfo(report.levelId).name.split('·')[1] }}
                        </div>
                      </div>
                      <span v-if="report.location" class="text-[9.5px] text-slate-400 font-medium flex items-center gap-0.5">
                        <i class="ri-map-pin-2-fill text-blue-400"></i> {{ report.location }}
                      </span>
                    </div>
                  </div>
                  <span class="text-[10px] font-medium text-slate-400">{{ report.time }}</span>
                </div>

                <p class="text-[12px] text-slate-600 leading-relaxed pl-[44px]">
                  {{ report.content }}
                </p>
              </div>

              <div
                  v-if="currentFoodReports.length === 0"
                  class="text-center py-10 bg-white/60 rounded-[20px] border border-dashed border-slate-200"
              >
                <p class="text-slate-400 text-[12px] font-medium">还没有病友留下文字战报，快来抢首发！</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部 CTA -->
        <div class="px-4 py-3 border-t border-slate-100 bg-white/90 backdrop-blur-xl shrink-0">
          <button
              @click="openUploadFromDetail"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl text-[14px] active:scale-[0.98] transition-all shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] flex items-center justify-center gap-2"
          >
            我也吃过 · 写战报 <i class="ri-arrow-right-up-line"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 上传 Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
      <div @click="showUploadModal = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

      <div class="bg-white w-full sm:w-[500px] sm:rounded-[32px] rounded-t-[32px] relative z-10 animate-slide-up shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

        <header class="shrink-0 flex justify-between items-center px-6 pt-7 pb-4 border-b border-slate-100">
          <div>
            <div class="text-[10px] font-black text-blue-600 tracking-[0.25em] uppercase mb-1">New Report</div>
            <h3 class="text-[20px] font-black text-slate-900 tracking-tight">发布实测情报</h3>
          </div>
          <button @click="showUploadModal = false" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-5">

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">品牌/餐厅</label>
              <input v-model="formData.brand" type="text" placeholder="肯德基" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[13.5px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">食物单品</label>
              <input v-model="formData.product" type="text" placeholder="吮指原味鸡" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[13.5px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all">
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5 flex justify-between items-center">
              <span>实测图片 · 选填</span>
              <span v-if="isUploading" class="text-blue-500 animate-pulse normal-case tracking-normal flex items-center gap-1">
                <i class="ri-loader-4-line animate-spin"></i> 上传中...
              </span>
            </label>
            <div
                @click="triggerFileInput"
                class="relative w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-900 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
            >
              <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*">
              <div v-if="!formData.coverImg" class="text-center transition-transform group-hover:scale-105">
                <i class="ri-image-add-line text-3xl text-slate-300 group-hover:text-slate-900 transition-colors"></i>
                <p class="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">点击上传食物照片</p>
              </div>
              <img v-else :src="formData.coverImg" class="absolute inset-0 w-full h-full object-cover">
              <button v-if="formData.coverImg" @click.stop="formData.coverImg = ''" class="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-md text-white rounded-full p-1.5 hover:bg-rose-500 transition-colors">
                <i class="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">评论 · 你的感受</label>
            <textarea v-model="formData.content" rows="3" placeholder="比如：我只要了微辣，吃完还是拉肚子了..." class="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[13px] outline-none focus:bg-white focus:border-slate-900 transition-all resize-none leading-relaxed"></textarea>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">身体反馈 · 做个明白人</label>
            <div class="space-y-2">
              <div
                  v-for="level in levels"
                  :key="level.val"
                  @click="formData.level = level.val"
                  :class="[
                  'flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.99]',
                  formData.level === level.val ? level.activeClass + ' shadow-md' : 'border-transparent bg-slate-50 hover:bg-slate-100'
                ]"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0" :class="level.iconBg">{{ level.icon }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center mb-0.5 gap-2">
                    <span class="text-[13.5px] font-black tracking-tight truncate">{{ level.name }}</span>
                    <span class="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/60 shrink-0 tracking-wider">{{ level.impact }}</span>
                  </div>
                  <p class="text-[11px] font-medium opacity-70">{{ level.desc }}</p>
                </div>
                <i v-if="formData.level === level.val" class="ri-checkbox-circle-fill text-xl shrink-0"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">消费门店 · 周边美食扫描</label>
            <div class="relative">
              <div class="flex gap-2 relative">
                <i class="ri-map-pin-2-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>
                <input v-model="formData.location" type="text" placeholder="点击右侧扫描，或手动输入..." class="flex-1 bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-3 text-[13px] outline-none focus:bg-white focus:border-slate-900 transition-all">
                <button @click="fetchNearby" :disabled="isLocating" class="bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-xl text-[11.5px] font-black active:scale-95 transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-70">
                  <i :class="isLocating ? 'ri-loader-4-line animate-spin' : 'ri-radar-line text-sm'"></i>
                  {{ isLocating ? '扫描中' : '扫描' }}
                </button>
              </div>

              <div v-if="poiList.length > 0" class="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-56 overflow-y-auto custom-scrollbar animate-slide-up">
                <div class="sticky top-0 bg-slate-50 px-3 py-2 text-[10px] font-black text-slate-500 border-b border-slate-100 flex justify-between tracking-widest uppercase">
                  <span>探测到以下门店</span>
                  <span @click="poiList = []" class="text-blue-500 cursor-pointer">关闭</span>
                </div>
                <div v-for="poi in poiList" :key="poi.id" @click="selectPoi(poi)" class="p-3 border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors">
                  <div class="font-bold text-[13px] text-slate-800">{{ poi.title }}</div>
                  <div class="text-[10.5px] text-slate-400 mt-1 flex justify-between items-center">
                    <span class="truncate pr-2">{{ poi.address }}</span>
                    <span class="text-blue-500 font-black bg-blue-50 px-1.5 py-0.5 rounded">{{ poi._distance }}m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="shrink-0 px-6 py-4 border-t border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-end gap-3">
          <button @click="showUploadModal = false" class="px-5 py-3 rounded-xl text-[13.5px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
            取消
          </button>
          <button @click="submitForm" class="px-6 py-3 rounded-xl text-[14px] font-black text-white bg-slate-900 hover:bg-slate-800 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center gap-2">
            发布情报 <i class="ri-arrow-right-up-line"></i>
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import http from '@/api/http.js'

const emit = defineEmits(['change-tab'])

const fileInput = ref(null)

onMounted(() => {
  fetchFoodList()
})

// 周边餐厅雷达
const poiList = ref([])

const fetchNearby = () => {
  isLocating.value = true
  poiList.value = []

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

        const tencentKey = 'PBBBZ-R7ZKM-W5X6A-6PYR4-Z3XB6-PFFGM'
        const callbackName = 'jsonp_callback_' + Date.now()

        window[callbackName] = (res) => {
          if (res.status === 0) {
            console.log("🔥 腾讯云返回的周边美食：", res.data)
            poiList.value = res.data
          } else {
            alert("拉取周边数据失败：" + res.message)
          }
          isLocating.value = false
          delete window[callbackName]
        }
        const searchKeyword = formData.value.location
            ? encodeURIComponent(formData.value.location)
            : encodeURIComponent('美食')

        const script = document.createElement('script')
        script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${searchKeyword}&boundary=nearby(${lat},${lng},3000)&key=${tencentKey}&output=jsonp&callback=${callbackName}`
        document.body.appendChild(script)

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
      {enableHighAccuracy: true, timeout: 5000}
  )
}

const selectPoi = (poi) => {
  formData.value.location = poi.title
  poiList.value = []
}

// 分级常量定义
const levels = [
  {
    val: 1,
    name: '绿区·安全屋',
    impact: '毫无波澜',
    desc: '放心吃，肠道稳如老狗。',
    icon: '🍃',
    iconBg: 'bg-emerald-100',
    bgClass: 'bg-emerald-500',
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700'
  },
  {
    val: 2,
    name: '黄区·试探线',
    impact: '轻微胀气',
    desc: '有点动静，但在可控范围内。',
    icon: '💨',
    iconBg: 'bg-amber-100',
    bgClass: 'bg-amber-400',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-700'
  },
  {
    val: 3,
    name: '橙区·警告位',
    impact: '立刻找坑',
    desc: '肚子绞痛，成型度明显下降。',
    icon: '⚠️',
    iconBg: 'bg-orange-100',
    bgClass: 'bg-orange-500',
    activeClass: 'border-orange-500 bg-orange-50 text-orange-700'
  },
  {
    val: 4,
    name: '红区·代价派',
    impact: '粘液便/加药',
    desc: '炎症加重，必须靠美沙拉嗪续命。',
    icon: '💊',
    iconBg: 'bg-red-100',
    bgClass: 'bg-red-500',
    activeClass: 'border-red-500 bg-red-50 text-red-700'
  },
  {
    val: 5,
    name: '紫区·见血封喉',
    impact: '直接喷血',
    desc: '肉眼可见的损伤，粘膜在求救。',
    icon: '🩸',
    iconBg: 'bg-purple-100',
    bgClass: 'bg-purple-500',
    activeClass: 'border-purple-500 bg-purple-50 text-purple-700'
  },
  {
    val: 6,
    name: '黑区·急诊直通车',
    impact: '准备住院',
    desc: '肠梗阻或高烧，直接拎包住院。',
    icon: '🚑',
    iconBg: 'bg-black text-white',
    bgClass: 'bg-gray-900',
    activeClass: 'border-black bg-gray-900 text-white'
  }
]

// 核心数据
const foodList = ref([])
const fetchFoodList = async () => {
  try {
    const res = await http.get('/diet/list')
    console.log("你好", res)
    const rawData = res

    foodList.value = rawData.map(dbItem => {
      let currentType = 'warning'
      if (dbItem.safeRate >= 80) currentType = 'safe'
      if (dbItem.safeRate <= 40) currentType = 'danger'

      return {
        id: dbItem.id,
        brand: dbItem.brandName,
        product: dbItem.foodName,
        type: currentType,
        image: dbItem.coverImg || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80',
        safeRate: dbItem.safeRate,
        voteCount: dbItem.totalVotes,
        tags: dbItem.tagsJson ? JSON.parse(dbItem.tagsJson) : [],
        desc: dbItem.summaryDesc || '这道菜暂无描述，全是实战数据！',
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

// 状态控制
const keyword = ref('')
const showUploadModal = ref(false)
const showDetailModal = ref(false)
const currentFood = ref(null)
const activeFilter = ref('all')

const filters = [
  { id: 'all', label: '全部' },
  { id: 'safe', label: '安全' },
  { id: 'warning', label: '警告' },
  { id: 'danger', label: '高危' }
]

const formData = ref({
  brand: '', product: '', content: '', level: 1, location: '',
  coverImg: ''
})

const triggerFileInput = () => {
  if (!formData.value.coverImg) {
    fileInput.value.click()
  }
}

const isUploading = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  const uploadData = new FormData()
  uploadData.append('file', file)

  try {
    const res = await http.post('/upload', uploadData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })

    formData.value.coverImg = res.data
    console.log("图片上传成功！直链：", formData.value.coverImg)
  } catch (error) {
    console.error("图片上传失败：", error)
    alert("上传失败，请检查网络或秘钥配置")
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}

// 首页列表过滤
const filteredList = computed(() => {
  let list = foodList.value
  if (activeFilter.value !== 'all') {
    list = list.filter(item => item.type === activeFilter.value)
  }
  if (keyword.value) {
    const k = keyword.value.toLowerCase().trim()
    list = list.filter(item =>
        item.brand.toLowerCase().includes(k) ||
        item.product.toLowerCase().includes(k)
    )
  }
  return list
})

// 今日推荐 · 拿安全率最高 + 评测数最多的
const todayPick = computed(() => {
  if (foodList.value.length === 0) return null
  return [...foodList.value]
      .sort((a, b) => (b.safeRate * 0.6 + b.voteCount * 0.4) - (a.safeRate * 0.6 + a.voteCount * 0.4))[0]
})

// 当前食物战报列表
const currentFoodReports = ref([])
const fetchReports = async (foodId) => {
  try {
    const res = await http.get(`/diet/reports/${foodId}`)
    console.log("你好,2", res.data)
    currentFoodReports.value = res.data.map(dbItem => {
      return {
        id: dbItem.id,
        userName: '病友_' + (dbItem.userId || '神秘人'),
        levelId: dbItem.reactionLevel,
        location: dbItem.location || '未知战场',
        content: dbItem.content || '该病友什么也没留，只留下了一个打分...',
        time: dbItem.createTime || '刚刚'
      }
    })
  } catch (error) {
    console.error("获取战报失败：", error)
  }
}

const openDetail = (item) => {
  currentFood.value = item
  showDetailModal.value = true
  fetchReports(item.id)
}

const openUploadFromDetail = () => {
  formData.value.brand = currentFood.value.brand
  formData.value.product = currentFood.value.product
  showUploadModal.value = true
}

const isLocating = ref(false)

const autoLocate = () => {
  isLocating.value = true

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4)
          const lng = position.coords.longitude.toFixed(4)
          formData.value.location = `经度: ${lng}, 纬度: ${lat} (本地定位)`
          isLocating.value = false
        },
        (error) => {
          console.warn("定位被拒绝或失败：", error)
          formData.value.location = "定位失败，请手动输入"
          isLocating.value = false
        },
        {timeout: 5000}
    )
  } else {
    formData.value.location = "浏览器不支持定位"
    isLocating.value = false
  }
}

const submitForm = async () => {
  try {
    if (!formData.value.brand || !formData.value.product) {
      alert("兄弟，品牌和单品名字得填啊！")
      return
    }

    const res = await http.post('/diet/publish', formData.value)
    console.log("你好，", res)
    alert(`牛逼！战报发布成功！`)

    showUploadModal.value = false

    formData.value = {brand: '', product: '', content: '', location: '', level: 1, coverImg: ''}

    fetchFoodList()
  } catch (error) {
    console.error("战报发布失败：", error)
    alert("发布失败了兄弟，按 F12 看看控制台报啥错？")
  }
}

// 工具函数
const getBadgeStyle = (type) => {
  switch (type) {
    case 'danger':
      return 'bg-rose-50 text-rose-600'
    case 'warning':
      return 'bg-amber-50 text-amber-600'
    case 'safe':
      return 'bg-emerald-50 text-emerald-600'
    default:
      return 'bg-slate-50 text-slate-600'
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

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>

<style>
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
</style>
