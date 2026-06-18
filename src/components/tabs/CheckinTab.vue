<template>
  <div class="w-full pb-8 bg-[#FBF9F5]">

    <transition name="van-fade">
      <div v-if="toastMsg" class="fixed top-[20%] left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 bg-slate-900/90 backdrop-blur-md text-white text-[13px] font-bold rounded-2xl shadow-xl max-w-[80%] text-center">
        {{ toastMsg }}
      </div>
    </transition>

    <TabPageHeader
      title="社区情报"
      accent="blue"
    />

    <div class="px-4 pb-4">
      <div class="relative">
        <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
        <input
            v-model="keyword"
            type="text"
            placeholder="搜品牌或单品"
            class="w-full bg-white/90 backdrop-blur-xl text-slate-900 text-[13px] font-medium rounded-2xl py-3 pl-10 pr-20 outline-none border border-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)] focus:bg-white focus:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.12)] focus:border-blue-200 transition-all placeholder-slate-400"
        >
        <button @click="runRadarSearch" class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-1">
          <i class="ri-radar-line text-[12px]"></i>
          雷达
        </button>
      </div>
    </div>

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
            <span class="text-[10px] font-black tracking-[0.16em] text-amber-300 px-2.5 py-1 bg-amber-300/15 backdrop-blur-md rounded-full border border-amber-300/30">
              ✦ 今日精选
            </span>
          </div>

          <!-- 右上角评分 -->
          <div class="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
            <span class="text-[11px] font-black text-white">{{ todayPick.safeRate }}%</span>
            <span class="text-[9px] font-bold text-white/70">安心</span>
          </div>

          <!-- 底部内容 -->
          <div class="absolute bottom-0 left-0 right-0 p-5">
            <p class="text-[10.5px] font-bold text-white/60 tracking-wider mb-1">{{ todayPick.brand }}</p>
            <h2 class="text-white text-[22px] font-black tracking-tight leading-none mb-2">{{ todayPick.product }}</h2>
            <p class="text-white/70 text-[12px] line-clamp-1">{{ todayPick.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 品牌评分馆 -->
      <section v-if="brandSections.length" class="space-y-3">
        <div class="flex items-end justify-between px-0.5">
          <div>
            <h3 class="text-[18px] font-black tracking-tight text-slate-900">品牌评分馆</h3>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">{{ brandSections.length }} 个品牌 · 按单品归档</p>
          </div>
          <button
              v-if="keyword || activeFilter !== 'all'"
              @click="keyword = ''; activeFilter = 'all'"
              class="text-[11px] font-black text-slate-500 bg-white px-3 py-2 rounded-full border border-slate-100 active:scale-95 transition-all"
          >
            看全部
          </button>
        </div>

        <div class="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
          <button
              v-for="brand in brandSections.slice(0, 10)"
              :key="brand.key"
              @click="openBrandModal(brand)"
              class="min-w-[168px] max-w-[168px] relative overflow-hidden text-left rounded-[24px] p-4 bg-white border border-slate-100 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.25)] active:scale-[0.98] transition-all"
          >
            <div
                class="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-25"
                :class="brand.type === 'danger' ? 'bg-rose-400' : (brand.type === 'safe' ? 'bg-emerald-400' : 'bg-amber-400')"
            ></div>
            <div class="relative flex items-center justify-between mb-4">
              <span
                  class="w-9 h-9 rounded-2xl flex items-center justify-center text-[17px] shadow-sm"
                  :class="brand.type === 'danger' ? 'bg-rose-50 text-rose-500' : (brand.type === 'safe' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500')"
              >
                <i :class="brand.type === 'danger' ? 'ri-fire-fill' : (brand.type === 'safe' ? 'ri-leaf-fill' : 'ri-shield-star-fill')"></i>
              </span>
              <span class="text-[10px] font-black text-slate-400">{{ brand.count }} 款</span>
            </div>
            <h4 class="relative text-[16px] font-black text-slate-900 tracking-tight truncate">{{ brand.name }}</h4>
            <p class="relative text-[11px] text-slate-400 font-bold mt-1 truncate">最高 {{ brand.bestSafeRate }}% 安心</p>
            <div class="relative flex items-center justify-between mt-4">
              <div class="flex -space-x-2">
                <img
                    v-for="item in brand.previewItems"
                    :key="item.id"
                    :src="item.image"
                    class="w-7 h-7 rounded-full object-cover border-2 border-white bg-slate-100"
                >
              </div>
              <i class="ri-arrow-right-up-line text-slate-300 text-lg"></i>
            </div>
          </button>
        </div>
      </section>

      <!-- 列表标题 -->
      <div ref="listAnchor" class="flex items-end justify-between pt-2">
        <div>
          <h3 class="text-[18px] font-black tracking-tight text-slate-900">单品评分榜</h3>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">{{ filteredList.length }} 个单品 · 病友共评</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="openMyReports" class="px-3 py-2 rounded-full bg-slate-900 text-white text-[11px] font-black shadow-sm active:scale-95 transition-all flex items-center gap-1">
            <i class="ri-file-list-3-line"></i>
            我的实测
          </button>
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
            v-for="(item, index) in filteredList"
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
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="shrink-0 text-[9px] font-black text-slate-400 bg-slate-50 rounded-md px-1.5 py-0.5">第 {{ index + 1 }}</span>
                      <p class="text-[10.5px] font-bold text-slate-400 tracking-wide truncate">{{ item.brand }}</p>
                    </div>
                    <h3 class="text-[15.5px] font-black text-slate-900 tracking-tight truncate mt-1">{{ item.product }}</h3>
                  </div>
                  <div class="text-right shrink-0">
                    <div
                        class="text-[20px] font-black leading-none tracking-tighter"
                        :class="item.type === 'danger' ? 'text-rose-500' : (item.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')"
                    >
                      {{ item.safeRate }}<span class="text-[10px] opacity-70">%</span>
                    </div>
                    <div class="text-[8.5px] font-bold text-slate-400 tracking-widest mt-0.5">安心值</div>
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
                  <i class="ri-group-line"></i> {{ item.voteCount }} 人评
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- 浮动新增按钮 -->
    <button
        @click="openUploadModal"
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
              {{ currentFood.type === 'danger' ? '高危雷区' : (currentFood.type === 'safe' ? '安全白名单' : '谨慎试探') }}
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
                      :style="`width: ${getLevelPercent(level.val)}%`"
                  ></div>
                </div>
                <span class="w-7 text-slate-900 font-black text-right">{{ getLevelCount(level.val) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-[24px] border border-blue-100/70 shadow-[0_8px_26px_-18px_rgba(37,99,235,0.35)]">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="text-[14px] font-black text-slate-900 tracking-tight">我的评分</p>
                <p class="text-[10px] text-slate-400 font-bold mt-0.5">先选身体反馈，再写一条真实实评</p>
              </div>
              <span class="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {{ quickFeedback.votedLevel ? '已评分' : '未评分' }}
              </span>
            </div>

            <div class="space-y-2 mb-3">
              <template v-for="level in levels" :key="level.val">
                <div
                  @click="pickQuickFeedbackLevel(level.val)"
                  :class="[
                    'flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none active:scale-[0.99]',
                    quickFeedback.level === level.val ? level.activeClass + ' shadow-md' : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  ]"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0" :class="level.iconBg">{{ level.icon }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="text-[13.5px] font-black tracking-tight truncate">{{ level.name }}</span>
                      <span class="text-[9.5px] font-black px-2 py-0.5 rounded-full bg-white/60 shrink-0 tracking-wider">{{ level.impact }}</span>
                    </div>
                    <p class="text-[11px] font-medium opacity-70">{{ level.desc }}</p>
                  </div>
                  <i v-if="quickFeedback.level === level.val" class="ri-checkbox-circle-fill text-xl shrink-0"></i>
                </div>

                <transition name="feedback-expand">
                  <div
                      v-if="quickFeedback.level === level.val && quickFeedback.showEditor"
                      data-feedback-editor="true"
                      class="mx-1 -mt-1 mb-2 rounded-[24px] border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.45)]"
                      @click.stop
                  >
                    <div class="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <p class="text-[13px] font-black text-slate-900">写下这次实评</p>
                        <p class="text-[10px] font-bold text-slate-400 mt-0.5">这是你的身体反馈，不是底部评论</p>
                      </div>
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-black shrink-0" :class="getLevelStyle(level.val)">
                        {{ level.name }}
                      </span>
                    </div>

                    <textarea
                        v-model="quickFeedback.content"
                        rows="4"
                        maxlength="220"
                        placeholder="比如：吃完两小时开始胀气，晚上肚子有点闹，但还能接受。"
                        class="w-full bg-white border border-slate-100 rounded-2xl px-3.5 py-3 text-[13px] text-slate-700 font-medium leading-relaxed outline-none focus:border-slate-900 resize-none"
                    ></textarea>

                    <div class="flex items-center justify-between gap-3 mt-3">
                      <span class="text-[10px] font-bold text-slate-400">{{ quickFeedback.content.length }}/220</span>
                      <button
                          @click.stop="submitFoodFeedback"
                          :disabled="quickFeedback.submitting || !quickFeedback.content.trim()"
                          class="px-5 py-3 rounded-2xl bg-slate-900 text-white text-[12px] font-black disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all"
                      >
                        {{ quickFeedback.submitting ? '发布中' : (quickFeedback.votedLevel ? '更新实评' : '发布实评') }}
                      </button>
                    </div>
                  </div>
                </transition>
              </template>
            </div>
          </div>

          <!-- 实测感受 -->
          <div>
            <h4 class="flex items-center justify-between mb-3 px-1 gap-3">
              <span class="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <i class="ri-file-list-3-fill text-amber-500"></i>
                大家的实测
              </span>
              <span class="text-[10px] font-bold text-slate-400 tracking-wider">{{ currentFoodReports.length }} 条</span>
            </h4>

            <div v-if="currentFoodReports.length" class="space-y-2.5">
              <article
                  v-for="report in currentFoodReports"
                  :key="report.id"
                  class="bg-white p-4 rounded-[20px] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]"
              >
                <div class="flex items-start gap-2.5 mb-2">
                  <img :src="report.avatar" class="w-9 h-9 rounded-full object-cover bg-slate-50 shrink-0 border border-white shadow-sm">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-[12px] font-black text-slate-800 truncate">{{ report.userName }}</span>
                      <span class="text-[10px] font-bold text-slate-400 shrink-0">{{ formatReportTime(report.time) }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="px-2 py-0.5 rounded-lg text-[10px] font-black" :class="getLevelStyle(report.levelId)">
                        {{ getLevelInfo(report.levelId).name }}
                      </span>
                      <span v-if="report.location" class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">
                        <i class="ri-map-pin-2-fill"></i> {{ report.location }}
                      </span>
                    </div>
                  </div>
                </div>
                <p class="text-[13px] text-slate-600 leading-relaxed pl-[46px] whitespace-pre-wrap">{{ report.content }}</p>
              </article>
            </div>

            <div v-else class="text-center py-8 bg-white/60 rounded-[20px] border border-dashed border-slate-200">
              <p class="text-slate-400 text-[12px] font-bold">还没有实测感受。</p>
            </div>
          </div>

          <!-- 评论区 -->
          <div>
            <h4 class="flex items-center justify-between mb-3 px-1 gap-3">
              <span class="text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <i class="ri-message-3-fill text-blue-500"></i>
                评论区
              </span>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] font-bold text-slate-400 tracking-wider">{{ foodComments.length }} 条</span>
                <div class="flex bg-slate-100 rounded-full p-0.5">
                  <button
                      v-for="item in foodCommentSortOptions"
                      :key="item.id"
                      @click="foodCommentSort = item.id"
                      :class="[
                        'px-2 py-1 rounded-full text-[10px] font-black transition-all',
                        foodCommentSort === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                      ]"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </h4>

            <div class="space-y-2.5">
              <div v-if="foodCommentsLoading" class="text-center py-10 bg-white/60 rounded-[20px] border border-dashed border-slate-200">
                <p class="text-slate-400 text-[12px] font-bold">评论加载中…</p>
              </div>

              <template v-else-if="foodComments.length">
                <div
                    v-for="comment in sortedFoodComments"
                    :key="comment.id || comment.localId"
                    class="bg-white p-4 rounded-[20px] border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]"
                >
                  <div class="flex justify-between items-start mb-2 gap-3">
                    <div class="flex items-center gap-2.5">
                      <img :src="avatarOf(comment.userAvatar, comment.userName || comment.userId || comment.id)" class="w-9 h-9 rounded-full bg-slate-50 shrink-0 border border-white shadow-sm">
                      <div class="flex flex-col gap-0.5">
                        <span class="text-[12px] font-black text-slate-800">{{ displayText(comment.userName, '匿名病友') }}</span>
                        <span class="text-[10px] font-medium text-slate-400">{{ formatReportTime(comment.createTime) }}</span>
                      </div>
                    </div>
                    <button
                        v-if="comment.isMine"
                        @click.stop="deleteFoodComment(comment)"
                        class="w-7 h-7 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center active:scale-90 transition-all"
                        aria-label="删除评论"
                    >
                      <i class="ri-delete-bin-6-line text-[13px]"></i>
                    </button>
                  </div>

                  <p class="text-[13px] text-slate-600 leading-relaxed pl-[44px] whitespace-pre-wrap">{{ comment.content }}</p>
                </div>
              </template>

              <div
                  v-else
                  class="text-center py-10 bg-white/60 rounded-[20px] border border-dashed border-slate-200"
              >
                <p class="text-slate-400 text-[12px] font-medium">还没有评论，来做第一个亮回复。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部评论输入 -->
        <div class="px-4 py-3 border-t border-slate-100 bg-white/90 backdrop-blur-xl shrink-0 flex items-center gap-2">
          <input
              v-model="foodCommentInput"
              type="text"
              placeholder="写一句评论，聊聊这条情报…"
              class="flex-1 bg-slate-100 border border-slate-100 rounded-2xl px-4 py-3 text-[12.5px] outline-none focus:bg-white focus:border-blue-200"
              @keyup.enter="submitFoodComment"
          >
          <button
              @click="submitFoodComment"
              :disabled="foodCommentSubmitting || !foodCommentInput.trim()"
              class="px-4 py-3 rounded-2xl bg-slate-900 text-white text-[12px] font-black disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all"
          >
            发送
          </button>
        </div>
      </div>
    </div>

    <!-- 品牌馆 Modal -->
    <div v-if="showBrandModal && selectedBrand" class="fixed inset-0 z-[130] flex items-end sm:items-center justify-center">
      <div @click.stop="closeBrandModal" class="absolute inset-0 bg-slate-900/55 backdrop-blur-md"></div>

      <div class="relative z-10 w-full sm:w-[520px] h-[82vh] sm:h-[76vh] bg-slate-50 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/35 rounded-full z-20"></div>

        <header class="relative shrink-0 overflow-hidden bg-slate-900 text-white px-6 pt-8 pb-6">
          <div
              class="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
              :class="selectedBrand.type === 'danger' ? 'bg-rose-400' : (selectedBrand.type === 'safe' ? 'bg-emerald-400' : 'bg-amber-400')"
          ></div>
          <button type="button" @click.stop="closeBrandModal" class="absolute z-30 top-5 right-5 w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
          <div class="relative">
            <p class="text-[11px] font-black text-white/45 tracking-[0.18em] mb-2">品牌馆</p>
            <h3 class="text-[28px] font-black tracking-tight leading-none pr-12">{{ selectedBrand.name }}</h3>
            <div class="flex items-center gap-2 mt-4 flex-wrap">
              <span class="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-black">{{ selectedBrand.count }} 款单品</span>
              <span class="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-black">{{ selectedBrand.totalVotes }} 人评</span>
              <span class="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-black">{{ selectedBrand.bestSafeRate }}% 最高安心</span>
            </div>
            <button
                type="button"
                @click.stop="openBrandPublish()"
                class="mt-5 h-11 px-4 rounded-2xl bg-white text-slate-950 text-[13px] font-black shadow-[0_12px_28px_-16px_rgba(255,255,255,0.55)] active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <i class="ri-quill-pen-fill text-base"></i>
              写一条实测
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-3">
          <article
              v-for="item in selectedBrand.items"
              :key="item.id"
              @click="openBrandFood(item)"
              class="bg-white rounded-[22px] border border-slate-100 p-3.5 shadow-sm active:scale-[0.995] transition-all cursor-pointer"
          >
            <div class="flex gap-3">
              <img :src="item.image" class="w-[82px] h-[82px] rounded-2xl object-cover bg-slate-100 shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h4 class="text-[15.5px] font-black text-slate-900 truncate">{{ item.product }}</h4>
                    <p class="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{{ item.desc }}</p>
                  </div>
                  <div
                      class="shrink-0 text-[20px] font-black leading-none tracking-tighter"
                      :class="item.type === 'danger' ? 'text-rose-500' : (item.type === 'safe' ? 'text-emerald-500' : 'text-amber-500')"
                  >
                    {{ item.safeRate }}<span class="text-[10px] opacity-70">%</span>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between">
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
                  <span class="text-[10px] font-bold text-slate-400">{{ item.voteCount }} 人评</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <footer class="shrink-0 px-5 py-4 bg-white/90 backdrop-blur-xl border-t border-slate-100">
          <button
              type="button"
              @click.stop="openBrandPublish()"
              class="w-full h-12 rounded-2xl bg-slate-900 text-white text-[13.5px] font-black shadow-[0_12px_28px_-16px_rgba(15,23,42,0.55)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <i class="ri-edit-circle-fill text-lg"></i>
            在 {{ selectedBrand.name }} 写实测
          </button>
        </footer>
      </div>
    </div>

    <!-- 上传 Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
      <div @click="closeUploadModal" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

      <div class="bg-white w-full sm:w-[500px] sm:rounded-[32px] rounded-t-[32px] relative z-10 animate-slide-up shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

        <header class="shrink-0 flex justify-between items-center px-6 pt-7 pb-4 border-b border-slate-100">
          <div>
            <div class="text-[10px] font-black text-blue-600 tracking-[0.18em] mb-1">{{ brandLockedName ? '品牌已锁定' : '新的实测' }}</div>
            <h3 class="text-[20px] font-black text-slate-900 tracking-tight">{{ brandLockedName ? `写给 ${brandLockedName}` : (editingReportId ? '编辑实测情报' : '发布实测情报') }}</h3>
          </div>
          <button @click="closeUploadModal" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-5">

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="flex items-center justify-between gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">
                <span>品牌/餐厅</span>
                <span v-if="brandLockedName" class="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full tracking-normal">已锁定</span>
              </label>
              <input v-model="formData.brand" :disabled="!!editingReportId || !!brandLockedName" type="text" placeholder="肯德基" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[13.5px] font-medium outline-none focus:bg-white focus:border-slate-900 disabled:text-slate-500 disabled:bg-slate-100 transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5">食物单品</label>
              <input v-model="formData.product" :disabled="!!editingReportId" type="text" placeholder="吮指原味鸡" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[13.5px] font-medium outline-none focus:bg-white focus:border-slate-900 disabled:text-slate-400 disabled:bg-slate-100 transition-all">
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

          <div>
            <label class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1.5 flex justify-between items-center">
              <span>实测图片 · 必填</span>
              <span v-if="isUploading" class="text-blue-500 animate-pulse normal-case tracking-normal flex items-center gap-1">
                <i class="ri-loader-4-line animate-spin"></i> 上传中...
              </span>
            </label>
            <div
                class="relative w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-900 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
            >
              <input
                  type="file"
                  class="absolute inset-0 z-20 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  @change="handleFileUpload"
                  accept="image/*"
                  :disabled="isUploading || !!formData.coverImg"
                  aria-label="上传实测图片"
              >
              <div v-if="!formData.coverImg" class="text-center transition-transform group-hover:scale-105 pointer-events-none">
                <i class="ri-image-add-line text-3xl text-slate-300 group-hover:text-slate-900 transition-colors"></i>
                <p class="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">上传真实照片后才能发布</p>
              </div>
              <img v-else :src="formData.coverImg" class="absolute inset-0 w-full h-full object-cover">
              <button v-if="formData.coverImg" @click.stop="formData.coverImg = ''" class="absolute z-30 top-2 right-2 bg-slate-900/70 backdrop-blur-md text-white rounded-full p-1.5 hover:bg-rose-500 transition-colors">
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

        </div>

        <footer class="shrink-0 px-6 py-4 border-t border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-end gap-3">
          <button @click="closeUploadModal" class="px-5 py-3 rounded-xl text-[13.5px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
            取消
          </button>
          <button
              @click="submitForm"
              :disabled="isUploading || !formData.coverImg"
              class="px-6 py-3 rounded-xl text-[14px] font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center gap-2"
          >
            {{ editingReportId ? '保存修改' : '发布情报' }} <i class="ri-arrow-right-up-line"></i>
          </button>
        </footer>
      </div>
    </div>

    <!-- 我的实测 -->
    <div v-if="showMyReportsModal" class="fixed inset-0 z-[125] flex items-end sm:items-center justify-center">
      <div @click="showMyReportsModal = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

      <div class="relative z-10 w-full sm:w-[520px] h-[82vh] sm:h-[78vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

        <header class="shrink-0 px-6 pt-7 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div class="text-[10px] font-black text-blue-600 tracking-[0.18em] mb-1">我的记录</div>
            <h3 class="text-[20px] font-black text-slate-900 tracking-tight">我的实测</h3>
          </div>
          <button @click="showMyReportsModal = false" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-3 bg-slate-50">
          <div v-if="isMyReportsLoading" class="text-center py-12 text-slate-400 text-[13px] font-bold">
            正在拉取你的实测…
          </div>

          <div v-else-if="myReports.length === 0" class="text-center py-16">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-white text-slate-300 flex items-center justify-center mb-3 shadow-sm">
              <i class="ri-file-list-3-line text-2xl"></i>
            </div>
            <p class="text-[13px] text-slate-400 font-bold">你还没有发布过实测。</p>
          </div>

          <article
              v-for="report in myReports"
              :key="report.id"
              @click="editMyReport(report)"
              class="relative bg-white rounded-[22px] border border-slate-100 p-3.5 pr-11 shadow-sm cursor-pointer active:scale-[0.995] transition-all"
          >
            <button
                @click.stop="deleteMyReport(report)"
                class="absolute top-3 right-3 w-7 h-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center active:scale-90 transition-all"
                aria-label="删除实测"
            >
              <i class="ri-delete-bin-6-line text-[13px]"></i>
            </button>
            <div class="flex gap-3">
              <img :src="report.coverImg || DEFAULT_FOOD_COVER" class="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-[11px] text-slate-400 font-bold truncate">{{ report.brand }}</p>
                    <h4 class="text-[15px] font-black text-slate-900 truncate">{{ report.product }}</h4>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 shrink-0">{{ formatReportTime(report.time) }}</span>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <span class="px-2 py-1 rounded-lg text-[10px] font-black" :class="getLevelStyle(report.levelId)">
                    {{ getLevelInfo(report.levelId).name.split('·')[1] }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-bold">可编辑</span>
                </div>
                <p class="mt-2 text-[12px] text-slate-600 leading-relaxed line-clamp-2">{{ report.content }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import http from '@/api/http.js'
import { avatarOf } from '@/utils/avatarPool'

const emit = defineEmits(['change-tab'])

const DEFAULT_FOOD_COVER = '/img/food-placeholder.svg'
const currentUserId = Number(localStorage.getItem('userId') || 0)

const listAnchor = ref(null)
const toastMsg = ref('')
let toastTimer = null
const showToast = (msg) => {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2200)
}

// 雷达：真扫描——收起键盘、定位结果、没扫到就引导去实测
const runRadarSearch = async () => {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur()
  }
  await nextTick()
  const count = filteredList.value.length
  const kw = keyword.value.trim()

  if (count > 0) {
    listAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    showToast(kw ? `雷达锁定 ${count} 个相关单品` : `雷达共收录 ${count} 个单品`)
    return
  }

  if (kw) {
    showToast(`雷达没扫到「${kw}」，来当第一个实测的人吧`)
    setTimeout(() => openUploadModal(), 600)
  } else {
    showToast('先输入品牌或单品再扫描')
  }
}

onMounted(() => {
  fetchFoodList()
  if (localStorage.getItem('openMyDietReports') === '1') {
    localStorage.removeItem('openMyDietReports')
    nextTick(() => openMyReports())
  }
})

// 周边餐厅雷达
const poiList = ref([])

const fetchNearby = () => {
  isLocating.value = true
  poiList.value = []

  if (!navigator.geolocation) {
    alert('当前设备不支持定位，请手动填写地点')
    isLocating.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const tencentKey = 'PBBBZ-R7ZKM-W5X6A-6PYR4-Z3XB6-PFFGM'
        const callbackName = 'jsonp_callback_' + Date.now()

        window[callbackName] = (res) => {
          if (res.status === 0) {
            poiList.value = res.data
          } else {
            alert('附近地点暂时没拉出来，请手动填写')
          }
          isLocating.value = false
          delete window[callbackName]
        }
        const searchKeyword = formData.value.location
            ? encodeURIComponent(formData.value.location)
            : encodeURIComponent(formData.value.brand || '美食')

        const script = document.createElement('script')
        script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${searchKeyword}&boundary=nearby(${lat},${lng},3000)&key=${tencentKey}&output=jsonp&callback=${callbackName}`
        document.body.appendChild(script)

        script.onload = () => document.body.removeChild(script)
        script.onerror = () => {
          alert('附近地点暂时没拉出来，请手动填写')
          isLocating.value = false
          document.body.removeChild(script)
        }
      },
      (error) => {
        alert('定位失败，请检查定位权限或手动填写地点')
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

const usefulText = (value) => {
  const text = String(value || '').trim()
  return text.length >= 2 && !/^\d+$/.test(text)
}

const displayText = (value, fallback) => {
  const text = String(value || '').trim()
  return usefulText(text) ? text : fallback
}

const parseJsonArray = (value) => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

const pickUploadUrl = (res) => {
  if (typeof res === 'string') return res
  if (typeof res?.data === 'string') return res.data
  if (typeof res?.url === 'string') return res.url
  return ''
}

const normalizeReportContent = (content) => {
  const text = String(content || '').trim()
  if (!usefulText(text)) {
    return '这位病友只留下了体感等级，没有写文字。'
  }
  return text
}

const parseReportDate = (value) => {
  if (!value) return null
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    return new Date(year, month - 1, day, hour, minute, second)
  }
  if (typeof value === 'string') {
    return new Date(value.replace(' ', 'T'))
  }
  return new Date(value)
}

const formatReportTime = (value) => {
  const date = parseReportDate(value)
  if (!date || Number.isNaN(date.getTime())) return '刚刚'
  const diff = Date.now() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

// 核心数据
const foodList = ref([])
const fetchFoodList = async () => {
  try {
    const res = await http.get('/diet/list')
    const rawData = Array.isArray(res) ? res : (res.data || [])

    foodList.value = rawData.map(dbItem => {
      let currentType = 'warning'
      const safeRate = Number(dbItem.safeRate || 0)
      const voteCount = Number(dbItem.totalVotes || 0)
      if (safeRate >= 80) currentType = 'safe'
      if (safeRate <= 40) currentType = 'danger'

      return {
        id: dbItem.id,
        brandRaw: String(dbItem.brandName || '').trim(),
        productRaw: String(dbItem.foodName || '').trim(),
        brand: displayText(dbItem.brandName, '未命名来源'),
        product: displayText(dbItem.foodName, '待补充单品'),
        type: currentType,
        image: dbItem.coverImg || DEFAULT_FOOD_COVER,
        safeRate,
        voteCount,
        tags: parseJsonArray(dbItem.tagsJson),
        desc: dbItem.summaryDesc || `已有 ${voteCount} 条实测，安心率 ${safeRate}%`,
        levelStats: {
          1: Number(dbItem.level1Votes || 0), 2: Number(dbItem.level2Votes || 0),
          3: Number(dbItem.level3Votes || 0), 4: Number(dbItem.level4Votes || 0),
          5: Number(dbItem.level5Votes || 0), 6: Number(dbItem.level6Votes || 0)
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
const showBrandModal = ref(false)
const showMyReportsModal = ref(false)
const currentFood = ref(null)
const selectedBrand = ref(null)
const activeFilter = ref('all')
const isMyReportsLoading = ref(false)
const myReports = ref([])
const editingReportId = ref(null)
const brandLockedName = ref('')

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
const quickFeedback = ref({
  level: 1,
  votedLevel: null,
  content: '',
  showEditor: false,
  submitting: false
})
const foodComments = ref([])
const foodCommentInput = ref('')
const foodCommentsLoading = ref(false)
const foodCommentSubmitting = ref(false)
const foodCommentSort = ref('latest')
const autoQuickFeedback = ref('')
const foodCommentSortOptions = [
  { id: 'latest', label: '最新' },
  { id: 'earliest', label: '最早' }
]

const sortedFoodComments = computed(() => {
  const list = [...foodComments.value]
  return list.sort((a, b) => {
    const first = parseReportDate(a.createTime)?.getTime() || 0
    const second = parseReportDate(b.createTime)?.getTime() || 0
    return foodCommentSort.value === 'earliest' ? first - second : second - first
  })
})

const resetFormData = () => {
  formData.value = {brand: '', product: '', content: '', location: '', level: 1, coverImg: ''}
  brandLockedName.value = ''
}

const openUploadModal = () => {
  editingReportId.value = null
  resetFormData()
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  editingReportId.value = null
  brandLockedName.value = ''
  poiList.value = []
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

    formData.value.coverImg = pickUploadUrl(res)
    if (!formData.value.coverImg) {
      throw new Error('empty upload url')
    }
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
        item.product.toLowerCase().includes(k) ||
        item.brandRaw.toLowerCase().includes(k) ||
        item.productRaw.toLowerCase().includes(k)
    )
  }
  return list
})

const getFoodScore = (item) => {
  const voteWeight = Math.min(Number(item.voteCount || 0), 80) * 0.8
  return Number(item.safeRate || 0) + voteWeight
}

const getFoodTypeByRate = (safeRate) => {
  if (safeRate >= 80) return 'safe'
  if (safeRate <= 40) return 'danger'
  return 'warning'
}

const brandSections = computed(() => {
  const brandMap = new Map()

  filteredList.value.forEach(item => {
    const key = item.brandRaw || item.brand
    if (!brandMap.has(key)) {
      brandMap.set(key, {
        key,
        name: item.brand,
        items: [],
        totalVotes: 0,
        bestSafeRate: 0,
        type: 'warning'
      })
    }

    const brand = brandMap.get(key)
    brand.items.push(item)
    brand.totalVotes += Number(item.voteCount || 0)
    brand.bestSafeRate = Math.max(brand.bestSafeRate, Number(item.safeRate || 0))
  })

  return Array.from(brandMap.values())
      .map(brand => {
        const sortedItems = [...brand.items].sort((a, b) => getFoodScore(b) - getFoodScore(a))
        const bestItem = sortedItems[0]
        return {
          ...brand,
          items: sortedItems,
          count: sortedItems.length,
          previewItems: sortedItems.slice(0, 3),
          type: getFoodTypeByRate(bestItem?.safeRate || 0)
        }
      })
      .sort((a, b) => (b.totalVotes + b.count * 8 + b.bestSafeRate) - (a.totalVotes + a.count * 8 + a.bestSafeRate))
})

// 今日推荐 · 拿安全率最高 + 评测数最多的
const todayPick = computed(() => {
  if (foodList.value.length === 0) return null
  return [...foodList.value]
      .sort((a, b) => (b.safeRate * 0.6 + b.voteCount * 0.4) - (a.safeRate * 0.6 + a.voteCount * 0.4))[0]
})

// 当前食物实测列表
const currentFoodReports = ref([])
const normalizeDietReport = (dbItem, foodFallback = null) => ({
  id: dbItem.id,
  foodId: dbItem.foodId || foodFallback?.id,
  userId: Number(dbItem.userId || 0),
  brand: displayText(dbItem.brand || foodFallback?.brand, '未命名来源'),
  product: displayText(dbItem.product || foodFallback?.product, '待补充单品'),
  coverImg: dbItem.coverImg || dbItem.imagesJson || foodFallback?.image || DEFAULT_FOOD_COVER,
  userName: displayText(dbItem.userName, '匿名病友'),
  avatar: avatarOf(dbItem.userAvatar, dbItem.userId || dbItem.userName || dbItem.id),
  isMine: currentUserId > 0 && Number(dbItem.userId || 0) === currentUserId,
  levelId: Number(dbItem.reactionLevel || dbItem.level || 1),
  location: usefulText(dbItem.location) ? dbItem.location : '',
  content: normalizeReportContent(dbItem.content),
  rawContent: String(dbItem.content || '').trim(),
  time: dbItem.createTime || '刚刚',
  commentsVisible: false,
  commentsLoaded: false,
  commentsLoading: false,
  commentSubmitting: false,
  comments: [],
  commentInput: ''
})

const fetchReports = async (foodId) => {
  try {
    const res = await http.get(`/diet/reports/${foodId}`)
    const rawReports = Array.isArray(res) ? res : (res.data || [])
    currentFoodReports.value = rawReports.map(dbItem => normalizeDietReport(dbItem, currentFood.value))
    const mine = currentFoodReports.value.find(report => report.isMine)
    if (mine) {
      quickFeedback.value.level = mine.levelId || 1
      quickFeedback.value.votedLevel = mine.levelId || 1
      quickFeedback.value.content = mine.rawContent || ''
    } else {
      quickFeedback.value.votedLevel = null
    }
  } catch (error) {
    console.error("获取实测失败：", error)
  }
}

const openDetail = (item) => {
  currentFood.value = item
  showDetailModal.value = true
  quickFeedback.value = { level: 1, votedLevel: null, content: '', showEditor: false, submitting: false }
  foodComments.value = []
  foodCommentInput.value = ''
  autoQuickFeedback.value = ''
  fetchReports(item.id)
  fetchFoodComments(item.id)
}

const buildFoodCommentTemplate = (levelVal, food = currentFood.value) => {
  const level = getLevelInfo(levelVal)
  const brand = food?.brand || '这家'
  const product = food?.product || '这个单品'
  const levelName = level.name.split('·')[0]
  const templates = {
    1: `${brand}的${product}我这次吃着挺稳，整体属于${levelName}，可以作为参考。`,
    2: `${brand}的${product}我吃完有一点反应，算${levelName}，建议先少量试。`,
    3: `${brand}的${product}对我有明显警告感，吃完不太舒服，大家谨慎点。`,
    4: `${brand}的${product}我这次代价有点大，反应比较重，不建议状态差的时候碰。`,
    5: `${brand}的${product}对我很危险，身体反馈很糟糕，大家一定谨慎。`,
    6: `${brand}的${product}我这次踩雷很重，接近黑区，真的不建议轻易尝试。`
  }
  return templates[levelVal] || `${brand}的${product}我这次评为${levelName}，给大家做个参考。`
}

const pickQuickFeedbackLevel = (levelVal) => {
  quickFeedback.value.level = levelVal
  quickFeedback.value.showEditor = true
  const nextTemplate = buildFoodCommentTemplate(levelVal)
  const current = quickFeedback.value.content.trim()
  if (!current || current === autoQuickFeedback.value) {
    quickFeedback.value.content = nextTemplate
    autoQuickFeedback.value = nextTemplate
  }
  nextTick(() => {
    const editor = document.querySelector('[data-feedback-editor="true"]')
    editor?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    editor?.querySelector('textarea')?.focus()
  })
}

const openBrandModal = (brand) => {
  selectedBrand.value = brand
  showBrandModal.value = true
}

const closeBrandModal = () => {
  showBrandModal.value = false
  selectedBrand.value = null
}

const openBrandFood = (item) => {
  closeBrandModal()
  openDetail(item)
}

const openBrandPublish = (brand = selectedBrand.value) => {
  if (!brand?.name) return

  editingReportId.value = null
  formData.value = {
    brand: brand.name,
    product: '',
    content: '',
    location: '',
    level: 1,
    coverImg: ''
  }
  brandLockedName.value = brand.name
  showBrandModal.value = false
  selectedBrand.value = null
  poiList.value = []
  showUploadModal.value = true
}

const submitFoodFeedback = async () => {
  if (!currentFood.value?.id || quickFeedback.value.submitting) return
  const content = quickFeedback.value.content.trim()
  if (!content) return

  quickFeedback.value.submitting = true
  try {
    const res = await http.post(`/diet/foods/${currentFood.value.id}/feedback`, {
      level: quickFeedback.value.level,
      reactionLevel: quickFeedback.value.level,
      content,
      location: ''
    })
    if (res.status && res.status !== 200) {
      alert(res.message || '发送失败')
      return
    }
    quickFeedback.value.votedLevel = quickFeedback.value.level
    quickFeedback.value.content = content
    quickFeedback.value.showEditor = false
    autoQuickFeedback.value = ''
    await fetchFoodList()
    const updatedFood = foodList.value.find(item => item.id === currentFood.value.id)
    if (updatedFood) currentFood.value = updatedFood
    await fetchReports(currentFood.value.id)
  } catch (error) {
    console.error('投票失败：', error)
    alert('投票失败，稍后再试')
  } finally {
    quickFeedback.value.submitting = false
  }
}

const fetchFoodComments = async (foodId) => {
  foodCommentsLoading.value = true
  try {
    const res = await http.get(`/diet/foods/${foodId}/comments`)
    const rows = Array.isArray(res) ? res : (res.data || [])
    foodComments.value = rows.map(comment => ({
      ...comment,
      isMine: currentUserId > 0 && Number(comment.userId || 0) === currentUserId,
      localId: `food-comment-${comment.id || Math.random()}`
    }))
  } catch (error) {
    console.error('食物评论加载失败：', error)
  } finally {
    foodCommentsLoading.value = false
  }
}

const submitFoodComment = async () => {
  if (!currentFood.value?.id || foodCommentSubmitting.value) return
  const content = foodCommentInput.value.trim()
  if (!content) return

  foodCommentSubmitting.value = true
  try {
    const res = await http.post(`/diet/foods/${currentFood.value.id}/comments`, { content })
    if (res.status && res.status !== 200) {
      alert(res.message || '评论失败')
      return
    }
    foodCommentInput.value = ''
    await fetchFoodComments(currentFood.value.id)
  } catch (error) {
    console.error('评论失败：', error)
    alert('评论失败，稍后再试')
  } finally {
    foodCommentSubmitting.value = false
  }
}

const deleteFoodComment = async (comment) => {
  if (!currentFood.value?.id || !comment?.id) return
  if (!confirm('确定删除这条评论吗？')) return

  try {
    const res = await http.post(`/diet/foods/${currentFood.value.id}/comments/${comment.id}/delete`)
    if (res.status && res.status !== 200) {
      alert(res.message || '删除失败')
      return
    }
    foodComments.value = foodComments.value.filter(item => item.id !== comment.id)
  } catch (error) {
    console.error('删除评论失败：', error)
    alert('删除失败，稍后再试')
  }
}

const openMyReports = async () => {
  showMyReportsModal.value = true
  await loadMyReports(true)
}

const loadMyReports = async (force = false) => {
  if (isMyReportsLoading.value) return
  if (myReports.value.length && !force) return
  isMyReportsLoading.value = true
  try {
    const res = await http.get('/diet/my-reports')
    const rows = Array.isArray(res) ? res : (res.data || [])
    myReports.value = rows.map(row => normalizeDietReport(row))
  } catch (error) {
    console.error('我的实测加载失败：', error)
    alert('我的实测暂时没拉出来')
  } finally {
    isMyReportsLoading.value = false
  }
}

const editMyReport = (report) => {
  editingReportId.value = report.id
  brandLockedName.value = ''
  formData.value = {
    brand: report.brand,
    product: report.product,
    content: report.rawContent || report.content,
    location: report.location || '',
    level: report.levelId || 1,
    coverImg: report.coverImg === DEFAULT_FOOD_COVER ? '' : report.coverImg
  }
  showMyReportsModal.value = false
  showUploadModal.value = true
}

const deleteMyReport = async (report) => {
  if (!confirm('确定删除这条实测吗？')) return
  try {
    const res = await http.post(`/diet/reports/${report.id}/delete`)
    if (res.status && res.status !== 200) {
      alert(res.message || '删除失败')
      return
    }
    alert(res.message || '实测已删除')
    await fetchFoodList()
    await loadMyReports(true)
    if (currentFood.value?.id) {
      const updatedFood = foodList.value.find(item => item.id === currentFood.value.id)
      if (updatedFood) currentFood.value = updatedFood
      await fetchReports(currentFood.value.id)
    }
  } catch (error) {
    console.error('删除实测失败：', error)
    alert('删除失败，稍后再试')
  }
}

const isLocating = ref(false)

const submitForm = async () => {
  try {
    if (!usefulText(formData.value.brand) || !usefulText(formData.value.product)) {
      alert("品牌和食物名字至少写 2 个字")
      return
    }

    if (!formData.value.level) {
      alert("请选择身体反馈")
      return
    }

    if (!formData.value.coverImg) {
      alert("请上传一张实测图片")
      return
    }

    const endpoint = editingReportId.value
        ? `/diet/reports/${editingReportId.value}/update`
        : '/diet/publish'
    const res = await http.post(endpoint, formData.value)
    if (res.status && res.status !== 200) {
      alert(res.message || '发布失败')
      return
    }

    alert(res.message || (editingReportId.value ? '实测已更新' : '实测已收录'))

    const wasEditing = !!editingReportId.value
    closeUploadModal()

    resetFormData()

    await fetchFoodList()
    if (currentFood.value?.id) {
      const updatedFood = foodList.value.find(item => item.id === currentFood.value.id)
      if (updatedFood) currentFood.value = updatedFood
      await fetchReports(currentFood.value.id)
    }
    if (wasEditing) {
      showMyReportsModal.value = true
      await loadMyReports(true)
    }
  } catch (error) {
    console.error("实测发布失败：", error)
    alert("发布失败，稍后再试")
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

const getLevelPercent = (levelVal) => {
  const total = Number(currentFood.value?.voteCount || 0)
  if (!total) return 0
  return Math.round((getLevelCount(levelVal) / total) * 100)
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

.feedback-expand-enter-active,
.feedback-expand-leave-active {
  transition: all 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.feedback-expand-enter-from,
.feedback-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
  max-height: 0;
}

.feedback-expand-enter-to,
.feedback-expand-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  max-height: 280px;
}
</style>

<style>
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
</style>
