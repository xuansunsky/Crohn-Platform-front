<template>
  <div class="relative w-full pb-8 bg-[#FBF9F5] text-slate-900 font-sans overflow-x-hidden">

    <!-- 柔和奶白底色上的色斑 -->
    <div class="absolute top-[-100px] left-[-100px] w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[20%] right-[-100px] w-80 h-80 bg-blue-200/30 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute top-[60%] left-[10%] w-72 h-72 bg-amber-100/40 rounded-full blur-[120px] pointer-events-none"></div>

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
            <span class="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase">Pharma · IBD Frontier</span>
          </div>
          <h1 class="text-[19px] font-black tracking-tight text-slate-900 leading-none flex items-center gap-2">
            前沿药物图谱
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </h1>
        </div>
      </div>
      <button
          @click="showCabinet = true"
          class="relative w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-emerald-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
      >
        <i class="ri-briefcase-4-line text-lg"></i>
        <div v-if="cabinetList.length > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md ring-2 ring-[#FBF9F5]">
          {{ cabinetList.length }}
        </div>
      </button>
    </header>

    <main class="p-5 space-y-5 relative z-10">

      <!-- 搜索栏 -->
      <div class="relative">
        <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
        <input
            v-model="keyword"
            type="text"
            placeholder="搜索前沿药物 · 如 乌帕替尼 / 喜达诺"
            class="w-full bg-white text-slate-900 text-[13.5px] font-medium rounded-2xl py-3.5 pl-12 pr-4 outline-none border border-stone-200 focus:border-emerald-500/40 focus:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)] transition-all placeholder-slate-400 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]"
        >
      </div>

      <!-- 分类标签 -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
        <button
            v-for="cat in categories"
            :key="cat.key"
            @click="activeCategory = cat.key"
            :class="[
              'px-4 py-2 rounded-full text-[12px] font-black whitespace-nowrap transition-all border shrink-0 active:scale-95',
              activeCategory === cat.key
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-500 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)]'
                : 'bg-white text-slate-500 border-stone-200 hover:border-stone-300 hover:text-slate-700'
            ]"
        >
          <i :class="cat.icon" class="mr-1"></i> {{ cat.label }}
        </button>
      </div>

      <!-- 列表标题 -->
      <div class="flex items-end justify-between pt-2 px-1">
        <div>
          <h3 class="text-[17px] font-black tracking-tight text-slate-900">药物清单</h3>
          <p class="text-[11px] text-slate-400 font-medium mt-0.5">{{ filteredDrugs.length }} 款前沿药物 · IBD 实战数据</p>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredDrugs.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-300">
        <div class="w-16 h-16 mb-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-center">
          <i class="ri-capsule-line text-2xl"></i>
        </div>
        <p class="text-[13px] font-medium text-slate-400">暂无对应前沿药效情报</p>
      </div>

      <!-- 药物卡片 -->
      <div v-else class="space-y-3">
        <article
            v-for="drug in filteredDrugs"
            :key="drug.id"
            @click="openDetail(drug)"
            class="group relative overflow-hidden bg-white rounded-[24px] p-5 border border-stone-100 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-12px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 cursor-pointer"
        >
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="relative flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {{ drug.typeLabel }}
                </span>
                <span v-if="drug.tag" class="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-100">
                  {{ drug.tag }}
                </span>
              </div>
              <h3 class="text-[16px] font-black text-slate-900 tracking-tight leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
                {{ drug.name }}
              </h3>
              <p class="text-[11.5px] text-slate-400 mt-1 font-medium">{{ drug.company }}</p>
            </div>

            <div class="flex gap-3 shrink-0 bg-stone-50/80 px-3 py-2 rounded-2xl border border-stone-100">
              <div class="text-center">
                <p class="text-[9px] font-black text-slate-400 tracking-widest uppercase">响应率</p>
                <p class="text-[15px] font-black text-emerald-600 mt-0.5 leading-none tracking-tighter">{{ drug.responseRate }}%</p>
              </div>
              <div class="w-px h-8 bg-stone-200 self-center"></div>
              <div class="text-center">
                <p class="text-[9px] font-black text-slate-400 tracking-widest uppercase">安全度</p>
                <p class="text-[15px] font-black text-blue-600 mt-0.5 leading-none tracking-tighter">{{ drug.safetyRate }}%</p>
              </div>
            </div>
          </div>

          <p class="text-[12px] text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-stone-50/60 p-3 rounded-xl border border-stone-100 font-medium">
            {{ drug.desc }}
          </p>

          <div class="flex justify-between items-center mt-3">
            <div class="flex flex-wrap gap-1">
              <span v-for="t in drug.tags.slice(0, 2)" :key="t" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-bold">
                # {{ t }}
              </span>
            </div>
            <span class="text-[11px] font-black text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              实战详情 <i class="ri-arrow-right-s-line text-base"></i>
            </span>
          </div>
        </article>
      </div>

    </main>

    <!-- 详情抽屉 -->
    <div v-if="showDetail && selectedDrug" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div @click="showDetail = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>

      <div class="bg-[#FBF9F5] w-full sm:w-[500px] h-[92vh] sm:h-[88vh] sm:rounded-[32px] rounded-t-[32px] relative z-10 animate-slide-up shadow-2xl flex flex-col overflow-hidden">

        <!-- 抓手 -->
        <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-300 rounded-full z-20"></div>

        <!-- 详情页顶 -->
        <header class="px-5 pt-7 pb-4 border-b border-stone-100 bg-[#FBF9F5]/95 backdrop-blur shrink-0 flex justify-between items-start z-10">
          <div class="min-w-0 pr-3">
            <span class="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-600">{{ selectedDrug.typeLabel }}</span>
            <h3 class="text-[19px] font-black text-slate-900 mt-1 tracking-tight leading-tight">{{ selectedDrug.name }}</h3>
          </div>
          <button @click="showDetail = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-slate-500 flex items-center justify-center transition-all active:scale-90 shrink-0">
            <i class="ri-close-line text-lg"></i>
          </button>
        </header>

        <!-- 详情内容 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-4 pb-28">

          <!-- 指标双星盘 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white rounded-2xl p-4 border border-stone-100 text-center relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-100/60 rounded-full blur-xl"></div>
              <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase relative">临床有效应率</p>
              <p class="text-[32px] font-black text-emerald-600 mt-1.5 tracking-tighter leading-none relative">{{ selectedDrug.responseRate }}%</p>
              <p class="text-[10px] text-slate-400 mt-2 font-medium relative">12周临床缓解</p>
            </div>
            <div class="bg-white rounded-2xl p-4 border border-stone-100 text-center relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-100/60 rounded-full blur-xl"></div>
              <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase relative">长期安全指数</p>
              <p class="text-[32px] font-black text-blue-600 mt-1.5 tracking-tighter leading-none relative">{{ selectedDrug.safetyRate }}%</p>
              <p class="text-[10px] text-slate-400 mt-2 font-medium relative">无严重不良反应</p>
            </div>
          </div>

          <!-- 靶点机制 -->
          <div class="bg-white rounded-2xl p-4 border border-stone-100 space-y-2">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <i class="ri-pulse-line text-emerald-600 text-sm"></i> 作用机制与靶点
            </h4>
            <p class="text-[13.5px] font-black text-slate-900 tracking-tight">{{ selectedDrug.tags[0] }}</p>
            <p class="text-[12px] text-slate-500 leading-relaxed">{{ selectedDrug.mechanism }}</p>
          </div>

          <!-- 价格与医保 -->
          <div class="bg-white rounded-2xl p-4 border border-stone-100 space-y-3">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <i class="ri-bank-card-2-line text-emerald-600 text-sm"></i> 参考价格与医保
            </h4>
            <div class="grid grid-cols-2 gap-4 text-[12px]">
              <div class="bg-stone-50 rounded-xl p-3">
                <p class="text-slate-400 font-black tracking-widest uppercase text-[9.5px]">原始单价</p>
                <p class="text-slate-900 font-bold mt-1 text-[13px]">{{ selectedDrug.priceOriginal }}</p>
              </div>
              <div class="bg-emerald-50/80 rounded-xl p-3 border border-emerald-100/50">
                <p class="text-emerald-700 font-black tracking-widest uppercase text-[9.5px]">医保后</p>
                <p class="text-emerald-700 font-black mt-1 text-[13px]">{{ selectedDrug.priceReimbursed }}</p>
              </div>
            </div>
            <p class="text-[10.5px] text-slate-400 leading-relaxed border-t border-stone-100 pt-2.5 font-medium">
              * 各地医保双通道药店具体报销政策有差异，可在"医保地图"查看专属城市详情。
            </p>
          </div>

          <!-- 副作用 -->
          <div class="bg-rose-50/60 rounded-2xl p-4 border border-rose-100 space-y-2">
            <h4 class="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
              <i class="ri-error-warning-line text-sm"></i> 不良反应与红线
            </h4>
            <p class="text-[12px] text-rose-900/80 leading-relaxed font-medium">{{ selectedDrug.sideEffects }}</p>
          </div>

          <!-- 病友吐槽墙 -->
          <div class="space-y-2.5">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <i class="ri-chat-quote-line text-emerald-600 text-sm"></i> 病友吐槽墙 · {{ selectedDrug.reviews.length }} 条真实反馈
            </h4>
            <div class="space-y-2.5">
              <div v-for="rev in selectedDrug.reviews" :key="rev.id" class="bg-white p-4 rounded-2xl border border-stone-100">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user}`" class="w-7 h-7 rounded-full bg-stone-50 border border-stone-100 shrink-0">
                    <span class="text-[12.5px] font-black text-slate-900 tracking-tight">{{ rev.user }}</span>
                  </div>
                  <span class="text-[10.5px] text-slate-400 font-medium">{{ rev.date }}</span>
                </div>
                <p class="text-[12px] text-slate-600 leading-relaxed font-medium pl-[36px]">
                  "{{ rev.content }}"
                </p>
                <div class="flex gap-0.5 mt-2 text-amber-500 text-[11px] pl-[36px]">
                  <i v-for="star in rev.rating" :key="star" class="ri-star-fill"></i>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 底部 CTA -->
        <div class="absolute bottom-0 w-full px-4 py-3 border-t border-stone-100 bg-white/95 backdrop-blur-xl z-20 flex gap-3">
          <button
              v-if="isInCabinet(selectedDrug.id)"
              @click="removeFromCabinet(selectedDrug.id)"
              class="flex-1 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-[13.5px] shadow-[0_8px_20px_-6px_rgba(244,63,94,0.4)]"
          >
            <i class="ri-delete-bin-line text-base"></i> 从药箱卸载
          </button>
          <button
              v-else
              @click="openAddToCabinet(selectedDrug)"
              class="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-[13.5px] shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)]"
          >
            <i class="ri-add-circle-fill text-base"></i> 纳入药箱闹钟
          </button>
        </div>

      </div>
    </div>

    <!-- 配置药箱抽屉 -->
    <van-popup
        v-model:show="showCabinetConfig"
        position="bottom"
        round
        teleport="body"
        class="bg-[#FBF9F5] text-slate-900 pb-[env(safe-area-inset-bottom)]"
    >
      <div class="p-6 space-y-5 bg-[#FBF9F5] rounded-t-3xl">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-[10px] font-black text-emerald-600 tracking-[0.25em] uppercase mb-1">Setup</div>
            <h3 class="text-[18px] font-black text-slate-900 tracking-tight">配置药箱守护</h3>
          </div>
          <button @click="showCabinetConfig = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 flex items-center justify-center active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
        </div>

        <div class="space-y-4" v-if="configDrug">
          <div class="bg-white p-4 rounded-2xl border border-stone-100">
            <p class="text-[10px] text-slate-400 font-black tracking-widest uppercase">已选药物</p>
            <p class="text-[14px] font-black text-emerald-700 mt-1.5 tracking-tight">{{ configDrug.name }}</p>
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-2">服用剂量描述</label>
            <input
                v-model="cabinetForm.dosage"
                type="text"
                placeholder="例如: 每次1片 (15mg)，温水送服"
                class="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-3 text-[13.5px] text-slate-900 font-medium outline-none focus:border-emerald-500/40 focus:shadow-sm transition-all placeholder-slate-300"
            >
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-2">打卡提醒频次</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                  v-for="freq in ['每日一次', '每周一次', '每两周一次', '每四周一次', '每八周一次', '自定义']"
                  :key="freq"
                  @click="cabinetForm.frequency = freq"
                  :class="[
                    'py-2.5 px-3 rounded-xl border text-[11.5px] font-black transition-all active:scale-95',
                    cabinetForm.frequency === freq
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white border-stone-200 text-slate-500 hover:border-stone-300'
                  ]"
              >
                {{ freq }}
              </button>
            </div>
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-500 tracking-widest uppercase block mb-2">提醒打卡时刻</label>
            <input
                v-model="cabinetForm.time"
                type="time"
                class="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-3 text-[13.5px] text-slate-900 font-medium outline-none focus:border-emerald-500/40 transition-all"
            >
          </div>

          <button
              @click="confirmAddToCabinet"
              class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 rounded-2xl shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)] hover:shadow-xl active:scale-[0.98] transition-all text-[14px] flex items-center justify-center gap-2"
          >
            <i class="ri-shield-check-line text-lg"></i> 激活药箱协议 · 开启闹钟守护
          </button>
        </div>
      </div>
    </van-popup>

    <!-- 我的药箱 -->
    <van-popup
        v-model:show="showCabinet"
        position="bottom"
        round
        teleport="body"
        class="bg-[#FBF9F5] text-slate-900 pb-[env(safe-area-inset-bottom)]"
    >
      <div class="p-6 bg-[#FBF9F5] rounded-t-3xl h-[70vh] flex flex-col">
        <div class="flex justify-between items-center mb-5 shrink-0">
          <div>
            <div class="text-[10px] font-black text-emerald-600 tracking-[0.25em] uppercase mb-1">Cabinet</div>
            <h3 class="text-[19px] font-black text-slate-900 tracking-tight">我的守护药箱</h3>
            <p class="text-[11px] text-slate-400 mt-1 font-medium">{{ cabinetList.length }} 款药物 · 静默护肠</p>
          </div>
          <button @click="showCabinet = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 hover:bg-stone-100 flex items-center justify-center active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          <div v-if="cabinetList.length === 0" class="flex flex-col items-center justify-center h-full text-slate-300">
            <div class="w-16 h-16 mb-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-center">
              <i class="ri-inbox-archive-line text-2xl"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-400">药箱空空，快去添加吧</p>
          </div>

          <div
              v-else
              v-for="item in cabinetList"
              :key="item.id"
              class="bg-white p-4 rounded-2xl border border-stone-100 flex items-start gap-3.5 hover:border-emerald-200 transition-all shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]"
          >
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 border border-emerald-100">
              <i :class="item.icon || 'ri-capsule-line'"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start gap-2">
                <h4 class="text-[14px] font-black text-slate-900 truncate tracking-tight">{{ item.name }}</h4>
                <button @click="removeFromCabinet(item.id)" class="text-[10.5px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md hover:bg-rose-100 transition-colors shrink-0">卸载</button>
              </div>
              <p class="text-[11.5px] text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                <span class="font-black text-slate-400 tracking-wider uppercase text-[9.5px]">剂量</span> {{ item.dosage }}
              </p>
              <div class="flex items-center gap-2 mt-2.5 border-t border-stone-100 pt-2.5 flex-wrap">
                <span class="text-[10px] text-slate-600 font-bold bg-stone-50 px-2 py-1 rounded-md border border-stone-100 flex items-center gap-1">
                  <i class="ri-calendar-todo-line text-emerald-600"></i> {{ item.frequency }}
                </span>
                <span class="text-[10px] text-slate-600 font-bold bg-stone-50 px-2 py-1 rounded-md border border-stone-100 flex items-center gap-1">
                  <i class="ri-alarm-warning-line text-blue-600"></i> {{ item.time }} 提醒
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-100 shrink-0 mt-4">
          <p class="text-[10.5px] text-slate-400 text-center leading-relaxed font-medium">
            * 手机将在设定时间派发静默闹钟进行安全打卡，保障抗体血药浓度稳定。
          </p>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import http from '@/api/http'

const emit = defineEmits(['change-tab'])

// 分类体系
const categories = [
  { key: 'all', label: '全部前沿药', icon: 'ri-apps-2-line' },
  { key: 'targeted', label: '小分子靶向', icon: 'ri-key-line' },
  { key: 'bio', label: '生物制剂', icon: 'ri-dna-line' },
  { key: 'immunosuppressant', label: '免疫抑制剂', icon: 'ri-shield-cross-line' },
  { key: 'anti-inflammatory', label: '基础抗炎', icon: 'ri-first-aid-kit-line' },
  { key: 'nutrition', label: '肠内营养', icon: 'ri-cup-line' }
]

const activeCategory = ref('all')
const keyword = ref('')
const showDetail = ref(false)
const selectedDrug = ref(null)

const showCabinet = ref(false)
const showCabinetConfig = ref(false)
const configDrug = ref(null)

const cabinetForm = reactive({
  dosage: '',
  frequency: '每日一次',
  time: '08:00'
})

const cabinetList = ref([])

onMounted(async () => {
  try {
    const drugRes = await http.get('/drug/list')
    if (drugRes.status === 200) {
      drugDatabase.value = drugRes.data.map(d => ({
        ...d,
        desc: d.description || '',
        tags: d.tagsJson ? JSON.parse(d.tagsJson) : [],
        reviews: []
      }))
    }
  } catch (e) {
    console.error('药物列表加载失败', e)
  }
  try {
    const cabinetRes = await http.get('/drug/cabinet')
    if (cabinetRes.status === 200) cabinetList.value = cabinetRes.data
  } catch (e) {
    console.error('药箱加载失败', e)
  }
})

const isInCabinet = (id) => {
  return cabinetList.value.some(item => item.id === id)
}

const openAddToCabinet = (drug) => {
  configDrug.value = drug
  cabinetForm.dosage = drug.type === 'targeted' ? '每次1片 (15mg)' : (drug.type === 'bio' ? '1支 (80mg/130mg)' : '每次1袋，温水冲服')
  cabinetForm.frequency = drug.type === 'targeted' ? '每日一次' : (drug.type === 'bio' ? '每八周一次' : '每日两次')
  cabinetForm.time = '08:00'
  showCabinetConfig.value = true
}

const confirmAddToCabinet = async () => {
  if (!cabinetForm.dosage) return alert('兄弟，写个剂量呗！')
  const payload = {
    drugName: configDrug.value.name,
    drugIcon: configDrug.value.icon,
    dosage: cabinetForm.dosage,
    frequency: cabinetForm.frequency,
    timeOfDay: cabinetForm.time
  }
  const res = await http.post('/drug/cabinet/add', payload)
  if (res.status === 200) {
    const cabinetRes = await http.get('/drug/cabinet')
    if (cabinetRes.status === 200) cabinetList.value = cabinetRes.data
  }
  showCabinetConfig.value = false
  alert(`"${configDrug.value.name}"已纳入闹钟守护，祝你早日红区降绿区！🍃`)
}

const removeFromCabinet = async (id) => {
  if (confirm('兄弟，确定要把这个药物从药箱移除，关闭提醒吗？')) {
    await http.delete(`/drug/cabinet/delete/${id}`)
    cabinetList.value = cabinetList.value.filter(item => item.id !== id)
    alert('已成功卸载该守护协议。')
  }
}

const drugDatabase = ref([])

const filteredDrugs = computed(() => {
  let list = drugDatabase.value

  if (activeCategory.value !== 'all') {
    list = list.filter(d => d.type === activeCategory.value)
  }

  if (keyword.value.trim()) {
    const k = keyword.value.toLowerCase().trim()
    list = list.filter(d =>
      d.name.toLowerCase().includes(k) ||
      d.typeLabel.toLowerCase().includes(k) ||
      d.company.toLowerCase().includes(k) ||
      d.tags.some(tag => tag.toLowerCase().includes(k))
    )
  }

  return list
})

const openDetail = (drug) => {
  selectedDrug.value = drug
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
