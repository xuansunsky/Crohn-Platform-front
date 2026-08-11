<template>
  <div class="relative w-full min-h-full bg-[#FBF9F5] pb-10">
    <div class="px-4 pt-3">
      <button
        type="button"
        @click="emit('change-tab', 'profile')"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-[13px] font-bold active:scale-95 transition-transform shadow-sm"
      >
        <i class="ri-arrow-left-s-line text-lg"></i>
        返回我的
      </button>
    </div>

    <van-loading v-if="isLoading" class="fixed inset-0 z-[200] flex items-center justify-center !bg-[#FBF9F5]/85" vertical color="#14b8a6">
      加载日记中…
    </van-loading>

    <TabPageHeader title="肠道日记" accent="teal">
      <template #action>
        <button
          @click="exportPanelOpen = true"
          class="px-3 py-2 rounded-lg text-[12px] font-bold text-white bg-stone-900 active:scale-95 transition-transform flex items-center gap-1"
        >
          <i class="ri-image-line text-base"></i>
          导出美图
        </button>
      </template>
    </TabPageHeader>

    <!-- ===== 顶部：连续打卡 Hero ===== -->
    <div class="px-4 pt-1">
      <div class="relative overflow-hidden rounded-[28px] p-5 bg-gradient-to-br from-teal-400 via-emerald-500 to-emerald-600 text-white shadow-[0_16px_40px_-16px_rgba(16,185,129,0.6)]">
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl"></div>
        <div class="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-black tracking-[0.18em] text-white/85">CROHN PARADISE · 每日记录</span>
            <span class="text-[11px] font-bold text-white/80">{{ todayStr }}</span>
          </div>
          <div class="flex items-end gap-3 mb-3">
            <div class="flex-1 rounded-2xl bg-white/14 border border-white/20 px-4 py-3">
              <p class="text-[10px] font-black tracking-wide text-white/70 mb-1">连续记录</p>
              <div class="flex items-end gap-1">
                <span class="text-[40px] font-black leading-none">{{ streakCount }}</span>
                <span class="text-[13px] font-bold text-white/85 mb-1">天 🔥</span>
              </div>
            </div>
            <div class="flex-1 rounded-2xl bg-white/14 border border-white/20 px-4 py-3">
              <p class="text-[10px] font-black tracking-wide text-white/70 mb-1">累计记录</p>
              <div class="flex items-end gap-1">
                <span class="text-[40px] font-black leading-none">{{ totalRecordDays }}</span>
                <span class="text-[13px] font-bold text-white/85 mb-1">天</span>
              </div>
            </div>
          </div>
          <p class="text-[12.5px] text-white/85 font-medium mb-4">{{ streakTip }}</p>

          <button
            @click="openCheckin"
            :class="[
              'w-full py-3.5 rounded-2xl text-[15px] font-black active:scale-[0.98] transition-all flex items-center justify-center gap-2',
              todayDone ? 'bg-white/20 text-white border border-white/30' : 'bg-white text-emerald-600 shadow-lg'
            ]"
          >
            <i :class="todayDone ? 'ri-check-double-line' : 'ri-quill-pen-line'"></i>
            {{ todayDone ? '今天已记录 · 点击修改' : '记录今天的状态（约 30 秒）' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 此刻感想：和身体记录放在一起，但不互相强迫 ===== -->
    <div class="px-4 pt-4">
      <section class="moment-journal">
        <header class="moment-journal-head">
          <div>
            <p>FEELING NOTES</p>
            <h3>这一刻，也可以留下</h3>
            <span>不必完整，不必每天写。想到什么就记什么。</span>
          </div>
          <button type="button" aria-label="记录此刻感想" @click="emit('open-feeling-composer')">
            <i class="ri-add-line"></i>
          </button>
        </header>

        <div v-if="feelingsLoading" class="moment-empty">正在拿回你的感想…</div>
        <div v-else-if="feelingsFailed && !recentFeelings.length" class="moment-empty">感想暂时没拿到，身体记录仍可正常使用。</div>
        <div v-else-if="recentFeelings.length" class="moment-list">
          <article v-for="entry in recentFeelings" :key="entry.id" class="moment-note" :class="entry.tone">
            <div class="moment-note-copy">
              <div class="moment-note-meta">
                <span><i class="ri-heart-3-line"></i>{{ moodScoreLabel(entry) }}</span>
              </div>
              <h4>{{ feelingTitle(entry) }}</h4>
              <p>{{ entry.content || entry.mood || '这一刻留下了图片。' }}</p>
              <small v-if="feelingDetail(entry)">{{ feelingDetail(entry) }}</small>
              <time class="moment-note-time">{{ formatFeelingTime(entry.createdAt) }}</time>
            </div>
            <div class="moment-note-image">
              <img :src="entry.images[0] || moodCharacterImage(entry)" :alt="entry.images.length ? '感想图片' : '当时的心情角色'" />
              <span v-if="entry.images.length > 1">+{{ entry.images.length - 1 }}</span>
            </div>
          </article>
        </div>
        <button v-else type="button" class="moment-empty moment-empty-action" @click="emit('open-feeling-composer')">
          <i class="ri-quill-pen-line"></i>
          <span><strong>还没有留下感想</strong><small>一句话也算，点这里写下第一条。</small></span>
        </button>
      </section>
    </div>

    <!-- ===== 时间范围切换 ===== -->
    <div class="px-4 pt-4">
      <div class="flex bg-white border border-stone-100 rounded-2xl p-1 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]">
        <button v-for="r in rangeOptions" :key="r.key"
          @click="rangeDays = r.key"
          :class="['flex-1 py-2 rounded-xl text-[12px] font-black transition-all active:scale-95', rangeDays === r.key ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400']"
        >{{ r.label }}</button>
      </div>
    </div>

    <!-- ===== 区间小结四宫格（只统计、不评价）===== -->
    <div class="px-4 pt-4">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="s in rangeStats" :key="s.label" class="rounded-2xl bg-white border border-stone-100 p-4 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]">
          <div class="flex items-center gap-1.5 mb-2">
            <i :class="[s.icon, s.color]" class="text-base"></i>
            <span class="text-[11px] font-bold text-stone-400">{{ s.label }}</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-[24px] font-black text-stone-900">{{ s.value }}</span>
            <span class="text-[11px] font-bold text-stone-400">{{ s.unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 布里斯托分布 ===== -->
    <div class="px-4 pt-4">
      <div class="grid grid-cols-1 gap-3">
        <section class="rounded-[24px] bg-white/92 border border-stone-100 p-4 shadow-[0_8px_28px_-22px_rgba(15,23,42,0.22)]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-[14px] font-black text-stone-800 flex items-center gap-1.5">
                <i class="ri-bar-chart-box-line text-teal-500"></i> 布里斯托分布
              </h3>
              <p class="text-[10.5px] font-bold text-stone-400 mt-1">{{ rangeLabel }}大便性状概览</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-black">共 {{ rangedHistory.length }} 天</span>
          </div>
          <div class="space-y-3">
            <div v-for="item in bristolDistribution" :key="item.type" class="grid grid-cols-[58px_1fr_34px] items-center gap-2">
              <div class="flex items-center gap-1.5">
                <span class="text-[16px] leading-none">{{ item.icon }}</span>
                <span class="text-[10px] font-black text-stone-500">{{ item.label }}</span>
              </div>
              <div class="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="item.bar" :style="{ width: item.percent + '%' }"></div>
              </div>
              <span class="text-right text-[11px] font-black text-stone-500">{{ item.count }}天</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- ===== 趋势图 ===== -->
    <div class="px-4 pt-4">
      <div class="rounded-2xl bg-white border border-stone-100 p-4 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-black text-stone-800 flex items-center gap-1.5">
            <i class="ri-line-chart-line text-teal-500"></i> {{ rangeLabel }}趋势
          </h3>
          <div class="flex bg-stone-100 rounded-lg p-0.5">
            <button
              v-for="m in trendModes" :key="m.key"
              @click="trendMode = m.key"
              :class="['px-2.5 py-1 rounded-md text-[11px] font-bold transition-all', trendMode === m.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400']"
            >{{ m.label }}</button>
          </div>
        </div>
        <div ref="chartRef" class="w-full h-44"></div>
      </div>
    </div>

    <!-- ===== 炎症标志物趋势 ===== -->
    <div class="px-4 pt-4">
      <section class="rounded-2xl bg-white border border-stone-100 p-4 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-[14px] font-black text-stone-800 flex items-center gap-1.5">
              <i class="ri-test-tube-line text-teal-500"></i> 炎症标志物
            </h3>
            <p class="text-[10.5px] font-bold text-stone-400 mt-1">CRP 与粪便钙卫蛋白 · 复查时录入</p>
          </div>
          <button @click="openLabForm" class="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-black active:scale-95 transition-all">+ 补充化验</button>
        </div>
        <div v-if="labSummary.length" class="grid grid-cols-2 gap-2.5 mb-3">
          <div v-for="lab in labSummary" :key="lab.name" :class="lab.normal ? 'bg-emerald-50' : 'bg-rose-50'" class="rounded-xl p-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-black text-stone-600">{{ lab.name }}</span>
              <span :class="lab.normal ? 'text-emerald-600' : 'text-rose-600'" class="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/70">{{ lab.normal ? '正常' : '偏高' }}</span>
            </div>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-[20px] font-black text-stone-900">{{ lab.value }}</span>
              <span class="text-[10px] font-bold text-stone-400">{{ lab.unit }}</span>
              <span :class="lab.delta < 0 ? 'text-emerald-500' : 'text-rose-500'" class="text-[10px] font-black ml-auto">
                {{ lab.delta < 0 ? '↓' : '↑' }}{{ Math.abs(lab.delta) }}
              </span>
            </div>
            <p class="text-[9.5px] font-bold text-stone-400 mt-0.5">参考 {{ lab.ref }} {{ lab.unit }}</p>
          </div>
        </div>
        <p v-else class="text-[12px] font-bold text-stone-400 mb-3 px-1">还没有化验记录，复查后点右上角补充</p>
        <div v-if="labHistory.length" class="space-y-2 mb-3">
          <div
            v-for="lab in [...labHistory].reverse()"
            :key="lab.id"
            class="flex items-center justify-between gap-3 rounded-xl bg-white border border-stone-100 px-3 py-2.5"
          >
            <div class="min-w-0">
              <p class="text-[12px] font-black text-stone-800">{{ lab.testDate }}</p>
              <p class="text-[10.5px] font-bold text-stone-400 truncate">
                <span v-if="lab.crp != null">CRP {{ lab.crp }}</span>
                <span v-if="lab.crp != null && lab.cal != null"> · </span>
                <span v-if="lab.cal != null">钙卫 {{ lab.cal }}</span>
              </p>
            </div>
            <button
              type="button"
              @click="deleteLabRecord(lab.id)"
              class="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-100 active:scale-95"
            >
              删除
            </button>
          </div>
        </div>
        <div v-if="labHistory.length" ref="labRef" class="w-full h-44"></div>
      </section>
    </div>

    <!-- ===== 历史日历 ===== -->
    <div class="px-4 pt-4">
      <div class="rounded-2xl bg-white border border-stone-100 p-4 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-black text-stone-800 flex items-center gap-1.5">
            <i class="ri-calendar-check-line text-teal-500"></i> 记录足迹
          </h3>
          <div class="flex items-center gap-1">
            <button @click="prevCalendarMonth" class="w-8 h-8 rounded-full bg-stone-50 text-stone-500 flex items-center justify-center active:scale-90"><i class="ri-arrow-left-s-line"></i></button>
            <span class="text-[12px] font-black text-stone-700 min-w-[88px] text-center">{{ calendarTitle }}</span>
            <button @click="nextCalendarMonth" :disabled="!canNextCalendarMonth" :class="canNextCalendarMonth ? 'text-stone-500' : 'text-stone-300'" class="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center active:scale-90"><i class="ri-arrow-right-s-line"></i></button>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          <div v-for="w in ['一','二','三','四','五','六','日']" :key="w" class="text-center text-[10px] font-bold text-stone-300 pb-1">{{ w }}</div>
          <button v-for="(d, i) in calendarDays" :key="i"
            type="button"
            :disabled="!d || !d.record"
            @click="openDayDetail(d)"
            :class="[
              'aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold transition-all',
              !d ? '' : d.record ? 'ring-1 ring-teal-200 active:scale-95 cursor-pointer' : 'cursor-default',
              !d ? '' : d.feel === 'good' ? 'bg-emerald-100 text-emerald-700'
                : d.feel === 'mid' ? 'bg-amber-100 text-amber-700'
                : d.feel === 'bad' ? 'bg-rose-100 text-rose-600'
                : 'bg-stone-50 text-stone-300'
            ]"
          >
            <span v-if="d">{{ d.day }}</span>
          </button>
        </div>
        <p class="text-[10.5px] text-stone-400 font-bold mt-3">有颜色的日子点一下，看当天记了什么</p>
        <div class="flex items-center gap-4 mt-2 pt-3 border-t border-stone-50">
          <span class="flex items-center gap-1 text-[10.5px] text-stone-400 font-bold"><span class="w-2.5 h-2.5 rounded bg-emerald-200"></span>很好</span>
          <span class="flex items-center gap-1 text-[10.5px] text-stone-400 font-bold"><span class="w-2.5 h-2.5 rounded bg-amber-200"></span>还行</span>
          <span class="flex items-center gap-1 text-[10.5px] text-stone-400 font-bold"><span class="w-2.5 h-2.5 rounded bg-rose-200"></span>难受</span>
          <span class="flex items-center gap-1 text-[10.5px] text-stone-400 font-bold"><span class="w-2.5 h-2.5 rounded bg-stone-100"></span>未记录</span>
        </div>
      </div>
    </div>

    <!-- ============ 打卡弹层 ============ -->
    <transition name="sheet">
      <div v-if="checkinOpen" class="fixed inset-0 z-[120] flex items-end justify-center">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="checkinOpen = false"></div>
        <div class="relative w-full sm:max-w-md bg-[#FBF9F5] rounded-t-[32px] max-h-[92vh] flex flex-col shadow-2xl">
          <div class="shrink-0 pt-3 pb-1 flex justify-center"><div class="w-12 h-1.5 rounded-full bg-stone-200"></div></div>
          <div class="shrink-0 px-6 pt-2 pb-3 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-stone-400">{{ checkinDateLabel }}</p>
              <h2 class="text-[20px] font-black text-stone-900">{{ checkinIsToday ? '今天，肠子还好吗？' : '修改这一天的记录' }}</h2>
            </div>
            <button @click="checkinOpen = false" class="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center active:scale-90"><i class="ri-close-line text-lg"></i></button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 pb-4 space-y-6 custom-scroll">
            <p class="text-[11px] font-bold text-stone-400 -mb-2">全部选填 · 记多少算多少，不想填的直接保存也行</p>
            <!-- 1. 排便次数 -->
            <section>
              <label class="block text-[13px] font-black text-stone-700 mb-2.5">💩 今天排便几次？ <span class="text-[11px] font-bold text-stone-400">选填</span></label>
              <div class="flex gap-2">
                <button v-for="n in poopCountOptions" :key="n"
                  @click="form.poopCount = n"
                  :class="['flex-1 py-3 rounded-xl text-[15px] font-black transition-all active:scale-95', form.poopCount === n ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 border border-stone-200']"
                >{{ n }}{{ n === '6+' ? '' : '次' }}</button>
              </div>
            </section>

            <!-- 2. 性状（布里斯托）-->
            <section>
              <label class="block text-[13px] font-black text-stone-700 mb-2.5">大便性状（布里斯托分类） <span class="text-[11px] font-bold text-stone-400">选填</span></label>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="b in bristol" :key="b.type"
                  @click="form.bristol = b.type"
                  :class="['rounded-xl py-2.5 px-1 transition-all active:scale-95 border', form.bristol === b.type ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-200' : 'bg-white border-stone-200']"
                >
                  <div class="text-[22px] leading-none mb-1">{{ b.icon }}</div>
                  <div :class="['text-[9.5px] font-bold', form.bristol === b.type ? 'text-teal-700' : 'text-stone-400']">{{ b.label }}</div>
                </button>
              </div>
            </section>

            <!-- 3. 出血/黏液 -->
            <section>
              <label class="block text-[13px] font-black text-stone-700 mb-2.5">🩸 有没有血或黏液？ <span class="text-[11px] font-bold text-stone-400">选填</span></label>
              <div class="flex flex-wrap gap-2">
                <button v-for="opt in bloodOptions" :key="opt.key"
                  @click="form.blood = opt.key"
                  :class="['px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-95 border', form.blood === opt.key ? opt.active : 'bg-white text-stone-500 border-stone-200']"
                >{{ opt.label }}</button>
              </div>
            </section>

            <!-- 4. 腹痛 0-10 -->
            <section>
              <div class="flex items-center justify-between mb-2.5">
                <label class="text-[13px] font-black text-stone-700">😣 腹痛程度 <span class="text-[11px] font-bold text-stone-400">选填</span></label>
                <span :class="['text-[15px] font-black', painColor]">{{ form.pain }} / 10 · {{ painLabel }}</span>
              </div>
              <input type="range" min="0" max="10" v-model.number="form.pain" class="w-full accent-rose-500" />
              <div class="flex justify-between text-[10px] font-bold text-stone-300 mt-1"><span>无痛</span><span>剧痛</span></div>
            </section>

            <!-- 5. 整体感觉 -->
            <section>
              <label class="block text-[13px] font-black text-stone-700 mb-2.5">😶‍🌫️ 整体感觉 <span class="text-[11px] font-bold text-stone-400">选填</span></label>
              <div class="flex gap-2">
                <button v-for="f in feelOptions" :key="f.key"
                  @click="form.feel = f.key"
                  :class="['flex-1 py-3 rounded-xl transition-all active:scale-95 border', form.feel === f.key ? f.active : 'bg-white border-stone-200']"
                >
                  <div class="text-[24px] leading-none mb-0.5">{{ f.icon }}</div>
                  <div :class="['text-[11px] font-bold', form.feel === f.key ? f.text : 'text-stone-400']">{{ f.label }}</div>
                </button>
              </div>
            </section>

            <!-- 选填区 -->
            <section class="rounded-2xl bg-white border border-stone-100 p-4 space-y-4">
              <p class="text-[11px] font-bold text-stone-400">用药 · 饮食 · 知道就记</p>
              <div>
                <button type="button" @click="medOpen = !medOpen" class="w-full flex items-center justify-between">
                  <label class="text-[12px] font-bold text-stone-600">💊 今天用药了吗？<span v-if="!medOpen && (form.meds.length || form.medOther)" class="ml-1 text-[11px] font-bold text-violet-500">已记录</span></label>
                  <i :class="['ri-arrow-down-s-line text-stone-400 text-[18px] transition-transform', medOpen ? 'rotate-180' : '']"></i>
                </button>
                <div v-if="medOpen" class="mt-2">
                  <div class="flex flex-wrap gap-2">
                    <button v-for="m in medOptions" :key="m"
                      @click="toggleMed(m)"
                      :class="['px-3 py-1.5 rounded-full text-[12px] font-bold transition-all active:scale-95 border', form.meds.includes(m) ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-stone-50 text-stone-400 border-stone-200']"
                    >{{ m }}</button>
                  </div>
                  <input v-if="form.meds.includes('其它')" v-model="form.medOther" type="text" placeholder="其它药名，如：硫唑嘌呤" class="mt-2 w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium text-stone-700 placeholder-stone-300 outline-none focus:border-violet-200 focus:bg-white transition-all" />
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-[12px] font-bold text-stone-600 mb-2">🍚 今天吃了啥？</label>
                  <div class="space-y-2">
                    <input v-model="form.breakfast" type="text" placeholder="早餐 · 如：白粥、鸡蛋（可不填）" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium text-stone-700 placeholder-stone-300 outline-none focus:border-stone-900 focus:bg-white transition-all" />
                    <input v-model="form.lunch" type="text" placeholder="午餐 · 如：米饭、清炒时蔬（可不填）" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium text-stone-700 placeholder-stone-300 outline-none focus:border-stone-900 focus:bg-white transition-all" />
                    <input v-model="form.dinner" type="text" placeholder="晚餐 · 如：面条、蒸鱼（可不填）" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium text-stone-700 placeholder-stone-300 outline-none focus:border-stone-900 focus:bg-white transition-all" />
                    <input v-model="form.food" type="text" placeholder="其它 · 如：加餐、外食、踩雷食物（可不填）" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium text-stone-700 placeholder-stone-300 outline-none focus:border-stone-900 focus:bg-white transition-all" />
                  </div>
                </div>
                <div class="pt-4 border-t border-stone-100">
                  <label class="block text-[12px] font-bold text-stone-600 mb-2">🌿 吃完有什么感觉？</label>
                  <textarea v-model="form.foodFeeling" rows="2" placeholder="如：很舒服、肚子胀、有点痛、跑了厕所（可不填）" class="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[13px] font-medium leading-relaxed text-stone-700 placeholder-stone-300 outline-none resize-none focus:border-stone-900 focus:bg-white transition-all"></textarea>
                </div>
              </div>
            </section>
            <p class="text-[11px] font-bold text-stone-300 text-center leading-relaxed px-2">记漏了？没关系，去日历那天的网格点一下，随时能补记或修改当天的感受和饮食。</p>
          </div>

          <div class="shrink-0 px-6 py-4 border-t border-stone-100 bg-white">
            <button @click="saveCheckin" class="w-full py-3.5 rounded-2xl bg-emerald-500 text-white text-[15px] font-black shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all">
              {{ checkinIsToday ? '保存今天的记录 ✓' : '保存修改 ✓' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 保存成功庆祝 ============ -->
    <transition name="pop">
      <div v-if="celebrate" class="fixed inset-0 z-[130] flex items-center justify-center pointer-events-none">
        <div class="bg-white rounded-[28px] px-8 py-7 shadow-2xl text-center">
          <div class="text-[56px] mb-2 animate-bounce">🎉</div>
          <p class="text-[18px] font-black text-stone-900">记录成功！</p>
            <p class="text-[13px] font-bold text-emerald-500 mt-1">已连续 {{ streakCount }} 天 🔥</p>
        </div>
      </div>
    </transition>

    <!-- ============ 导出美图面板 ============ -->
    <transition name="sheet">
      <div v-if="exportPanelOpen" class="fixed inset-0 z-[120] flex items-end justify-center">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="exportPanelOpen = false"></div>
        <div class="relative w-full sm:max-w-md bg-[#FBF9F5] rounded-t-[32px] max-h-[94vh] flex flex-col shadow-2xl">
          <div class="shrink-0 pt-3 pb-1 flex justify-center"><div class="w-12 h-1.5 rounded-full bg-stone-200"></div></div>
          <div class="shrink-0 px-6 pt-2 pb-3 flex items-center justify-between">
            <h2 class="text-[20px] font-black text-stone-900">导出美图</h2>
            <button @click="exportPanelOpen = false" class="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center active:scale-90"><i class="ri-close-line text-lg"></i></button>
          </div>
          <div class="shrink-0 px-6 pb-3 flex gap-2">
            <button v-for="c in exportCards" :key="c.key"
              @click="activeCard = c.key"
              :class="['flex-1 py-2 rounded-xl text-[12px] font-black transition-all', activeCard === c.key ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 border border-stone-200']"
            >{{ c.label }}</button>
          </div>

          <!-- 导出时间区间 -->
          <div class="shrink-0 px-6 pb-3 space-y-2.5">
            <p class="text-[11px] font-black text-stone-500">选择导出区间</p>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="exportRange.from" type="date" class="rounded-xl bg-white border border-stone-100 px-3 py-2.5 text-[12px] font-bold outline-none focus:border-teal-200">
              <input v-model="exportRange.to" type="date" class="rounded-xl bg-white border border-stone-100 px-3 py-2.5 text-[12px] font-bold outline-none focus:border-teal-200">
            </div>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="p in exportPresets" :key="p.days" @click="setExportPreset(p.days)" class="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-100 text-[11px] font-bold text-stone-500 active:scale-95">{{ p.label }}</button>
            </div>
            <p class="text-[10.5px] font-bold text-teal-600">{{ exportRangeLabel }}</p>
          </div>

          <div class="flex-1 overflow-y-auto px-6 pb-4 custom-scroll">
            <!-- 成就卡 -->
            <div v-show="activeCard === 'streak'" ref="cardStreak" class="rounded-[28px] overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-500 to-emerald-700 p-7 text-white relative">
              <div class="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/15 blur-2xl"></div>
              <p class="text-[11px] font-black tracking-[0.2em] text-white/80 mb-6">CROHN PARADISE</p>
              <p class="text-[14px] font-bold text-white/90 mb-1">这段时期记录了</p>
              <div class="flex items-end gap-2 mb-6">
                <span class="text-[80px] font-black leading-none">{{ exportRangedHistory.length }}</span>
                <span class="text-[20px] font-bold mb-3">天 📒</span>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-white/15 backdrop-blur p-3">
                  <p class="text-[11px] text-white/75 font-bold">自觉舒适</p>
                  <p class="text-[20px] font-black">{{ exportGoodDays }} 天</p>
                </div>
                <div class="rounded-2xl bg-white/15 backdrop-blur p-3">
                  <p class="text-[11px] text-white/75 font-bold">无痛天数</p>
                  <p class="text-[20px] font-black">{{ exportPainFreeDays }} 天</p>
                </div>
              </div>
              <p class="text-[10.5px] text-white/70 font-medium mt-6">{{ exportRange.from }} ~ {{ exportRange.to }}</p>
            </div>

            <!-- 周报卡 -->
            <div v-show="activeCard === 'weekly'" ref="cardWeekly" class="rounded-[28px] overflow-hidden bg-white border border-stone-100 p-7">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <p class="text-[11px] font-black tracking-[0.15em] text-teal-500">RECORD REPORT</p>
                  <h3 class="text-[20px] font-black text-stone-900">我的肠道小结</h3>
                  <p class="text-[11px] font-bold text-stone-400 mt-0.5">{{ exportRangeLabel }}</p>
                </div>
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-xl">📊</div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-5">
                <div v-for="s in exportRangeStats" :key="s.label" class="rounded-2xl bg-stone-50 p-3.5">
                  <p class="text-[11px] font-bold text-stone-400 mb-1">{{ s.label }}</p>
                  <p class="text-[22px] font-black text-stone-900">{{ s.value }}<span class="text-[11px] text-stone-400 ml-0.5">{{ s.unit }}</span></p>
                </div>
              </div>
              <div class="rounded-2xl bg-emerald-50 p-4">
                <p class="text-[12px] font-bold text-emerald-700 leading-relaxed">{{ exportWeeklyComment }}</p>
              </div>
              <p class="text-[10px] text-stone-300 font-bold mt-4 text-center">Crohn Paradise · 肠道日记</p>
            </div>

            <!-- 就诊报告卡 -->
            <div v-show="activeCard === 'report'" ref="cardReport" class="rounded-[28px] overflow-hidden bg-white border border-stone-100 p-6">
              <div class="border-b-2 border-stone-900 pb-3 mb-4">
                <h3 class="text-[18px] font-black text-stone-900">症状摘要</h3>
                <p class="text-[11px] font-bold text-stone-400 mt-0.5">{{ exportRange.from }} ~ {{ exportRange.to }} · 供复诊参考</p>
              </div>
              <div class="space-y-2.5">
                <div v-for="r in exportReportRows" :key="r.label" class="flex items-center justify-between py-2 border-b border-stone-50">
                  <span class="text-[13px] font-bold text-stone-500">{{ r.label }}</span>
                  <span class="text-[14px] font-black text-stone-900">{{ r.value }}</span>
                </div>
              </div>
              <div class="mt-4 rounded-xl bg-stone-50 p-3">
                <p class="text-[11px] font-bold text-stone-400 mb-1">用药记录</p>
                <p class="text-[12.5px] font-bold text-stone-700">{{ exportReportMeds }}</p>
              </div>
              <p class="text-[9.5px] text-stone-300 font-medium mt-4 text-center leading-relaxed">本摘要由患者自行记录生成，仅供医患沟通参考，不构成诊断依据。</p>
            </div>
          </div>

          <div class="shrink-0 px-6 py-4 border-t border-stone-100 bg-white">
            <button @click="doExport" :disabled="exporting" class="w-full py-3.5 rounded-2xl bg-stone-900 text-white text-[15px] font-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <i :class="exporting ? 'ri-loader-4-line animate-spin' : 'ri-download-2-line'"></i>
              {{ exporting ? '生成中...' : '保存图片到相册' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    <!-- ============ 某天的记录详情 ============ -->
    <transition name="sheet">
      <div v-if="dayDetailOpen && selectedDayRecord" class="fixed inset-0 z-[125] flex items-end justify-center">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="dayDetailOpen = false"></div>
        <div class="relative w-full sm:max-w-md bg-[#FBF9F5] rounded-t-[32px] max-h-[88vh] flex flex-col shadow-2xl">
          <div class="shrink-0 pt-3 pb-1 flex justify-center"><div class="w-12 h-1.5 rounded-full bg-stone-200"></div></div>
          <div class="shrink-0 px-6 pt-2 pb-3 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-bold text-stone-400">{{ formatDisplayDate(selectedDayRecord.date) }}</p>
              <h2 class="text-[20px] font-black text-stone-900">当天记录详情</h2>
            </div>
            <button @click="dayDetailOpen = false" class="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center active:scale-90"><i class="ri-close-line text-lg"></i></button>
          </div>
          <div class="flex-1 overflow-y-auto px-6 pb-4 space-y-3 custom-scroll">
            <div v-for="row in dayDetailRows" :key="row.label" class="rounded-2xl bg-white border border-stone-100 px-4 py-3 flex items-start justify-between gap-3">
              <span class="text-[12px] font-bold text-stone-400 shrink-0">{{ row.label }}</span>
              <span class="text-[13px] font-black text-stone-800 text-right leading-relaxed">{{ row.value }}</span>
            </div>
            <section v-if="selectedDayFeelings.length" class="day-feelings">
              <header><i class="ri-quill-pen-line"></i> 那天还留下了</header>
              <article v-for="entry in selectedDayFeelings" :key="entry.id" :class="entry.tone">
                <div><span>{{ moodScoreLabel(entry) }}</span><time>{{ formatFeelingClock(entry.createdAt) }}</time></div>
                <h4>{{ feelingTitle(entry) }}</h4>
                <p>{{ entry.content || entry.mood || '这一刻留下了图片。' }}</p>
                <div class="day-feeling-images">
                  <img v-if="!entry.images.length" :src="moodCharacterImage(entry)" alt="当时的心情角色" />
                  <img v-for="image in entry.images" :key="image" :src="image" alt="感想图片" />
                </div>
              </article>
            </section>
          </div>
          <div class="shrink-0 px-6 py-4 border-t border-stone-100 bg-white">
            <button @click="editSelectedDay" class="w-full py-3.5 rounded-2xl bg-stone-900 text-white text-[15px] font-black active:scale-[0.98] transition-all">修改这条记录</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 补充化验 ============ -->
    <transition name="sheet">
      <div v-if="labFormOpen" class="fixed inset-0 z-[120] flex items-end justify-center">
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="labFormOpen = false"></div>
        <div class="relative w-full sm:max-w-md bg-[#FBF9F5] rounded-t-[32px] p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-[20px] font-black text-stone-900">补充化验记录</h2>
            <button @click="labFormOpen = false" class="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center active:scale-90"><i class="ri-close-line text-lg"></i></button>
          </div>
          <div class="space-y-3">
            <input v-model="labForm.testDate" type="date" class="w-full rounded-2xl bg-white border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-teal-200">
            <div class="grid grid-cols-2 gap-2">
              <input v-model="labForm.crp" inputmode="decimal" placeholder="CRP (mg/L)" class="rounded-2xl bg-white border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-teal-200">
              <input v-model="labForm.calprotectin" inputmode="decimal" placeholder="钙卫蛋白 (μg/g)" class="rounded-2xl bg-white border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-teal-200">
            </div>
            <input v-model="labForm.note" placeholder="备注（可选）" class="w-full rounded-2xl bg-white border border-stone-100 px-4 py-3 text-[13px] font-medium outline-none focus:border-teal-200">
            <button @click="saveLabRecord" :disabled="isSavingLab" class="w-full py-3.5 rounded-2xl bg-teal-600 text-white text-[15px] font-black active:scale-[0.98] transition-all disabled:opacity-50">
              {{ isSavingLab ? '保存中...' : '保存化验记录' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { showToast } from 'vant'
import http from '@/api/http'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import { SERVER_DOWN_HINT } from '@/utils/serverHint'

const props = defineProps({
  feelingRefreshKey: { type: Number, default: 0 }
})
const emit = defineEmits(['change-tab', 'open-feeling-composer'])

const today = new Date()
const todayStr = computed(() => `${today.getMonth() + 1}月${today.getDate()}日`)
const todayDateStr = computed(() => {
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

const diaryHistory = ref([])
const labHistory = ref([])
const feelingHistory = ref([])
const feelingsLoading = ref(false)
const feelingsFailed = ref(false)
const streakCount = ref(0)
const totalRecordDays = ref(0)
const todayDone = ref(false)
const isLoading = ref(false)

const streakTip = computed(() => {
  if (todayDone.value) return '今天的记录已经收好啦，肠子辛苦了 🌿'
  if (streakCount.value > 0) return `已连续 ${streakCount.value} 天 · 今天还没记，抓紧补一笔就能续上 🔥`
  if (totalRecordDays.value > 0) return '连续记录已断档 · 今天记一笔，重新出发'
  return '坚持就是胜利，花 30 秒记一笔吧'
})

const safeJson = (value, fallback = []) => {
  if (Array.isArray(value)) return value
  try { return JSON.parse(value || '[]') } catch { return fallback }
}

const poopToNumber = (poopCount) => {
  if (poopCount === '6+') return 6
  const n = parseInt(poopCount, 10)
  return Number.isFinite(n) ? n : 0
}

const formatDateStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatDisplayDate = (date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`

const parseFeelingDate = (value) => {
  if (!value) return null
  if (Array.isArray(value)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = value
    return new Date(year, month - 1, day, hour, minute, second)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const parseFeelingImages = (value) => {
  if (!value) return []
  try {
    const images = JSON.parse(value)
    return Array.isArray(images) ? images.filter(Boolean) : []
  } catch {
    return String(value).split(',').map(item => item.trim()).filter(Boolean)
  }
}

const parseMoodScore = (entry) => {
  const source = `${entry?.title || ''} ${entry?.mood || ''}`
  const match = source.match(/心情\s*(10|[0-9])\s*\/\s*10/)
  return match ? Number(match[1]) : null
}

const moodImageIndex = (score) => {
  if (score == null) return 3
  if (score <= 1) return 5
  if (score <= 3) return 4
  if (score <= 5) return 3
  if (score <= 7) return 2
  return 1
}

const moodScoreLabel = (entry) => entry.moodScore == null ? '旧感想' : `心情 ${entry.moodScore}/10`
const feelingTitle = (entry) => {
  const title = String(entry.title || '').trim()
  return /^心情\s*(10|[0-9])\s*\/\s*10$/.test(title) ? '这一刻' : (title || '这一刻')
}
const moodCharacterImage = (entry) => `/media/journal-companion/mood-${entry.moodImage}.webp`
const feelingDetail = (entry) => {
  const moodNote = String(entry.mood || '').replace(/心情\s*(10|[0-9])\s*\/\s*10\s*·?\s*/, '').trim()
  return [moodNote, entry.statusText].filter(Boolean).join(' · ')
}

const normalizeFeeling = (entry) => {
  const moodScore = parseMoodScore(entry)
  return {
    ...entry,
    tone: ['bright', 'calm', 'dark'].includes(entry.tone) ? entry.tone : 'calm',
    moodScore,
    moodImage: moodImageIndex(moodScore),
    date: parseFeelingDate(entry.createdAt),
    images: parseFeelingImages(entry.imagesJson)
  }
}

const formatFeelingTime = (value) => {
  const date = parseFeelingDate(value)
  if (!date) return ''
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const clock = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  return sameDay ? `今天 ${clock}` : `${date.getMonth() + 1}月${date.getDate()}日 ${clock}`
}

const formatFeelingClock = (value) => {
  const date = parseFeelingDate(value)
  return date ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : ''
}

const recentFeelings = computed(() => [...feelingHistory.value].slice(0, 4))

const normalizeRecord = (record) => {
  const date = new Date(`${record.recordDate}T00:00:00`)
  const meals = safeJson(record.mealsJson, {})
  return {
    id: record.id,
    recordDate: record.recordDate,
    date,
    day: date.getDate(),
    feel: record.feel || '',
    poopCount: record.poopCount || '0',
    poop: poopToNumber(record.poopCount),
    pain: Number(record.pain || 0),
    bloodKey: record.blood || 'none',
    blood: record.blood && record.blood !== 'none' ? 1 : 0,
    bristol: Number(record.bristol || 0),
    meds: safeJson(record.medsJson, []),
    meals,
    breakfast: meals.breakfast || '',
    lunch: meals.lunch || '',
    dinner: meals.dinner || '',
    food: record.foodNote || '',
    foodFeeling: meals.feeling || ''
  }
}

const normalizeLab = (lab) => {
  const date = new Date(`${lab.testDate}T00:00:00`)
  return {
    id: lab.id,
    testDate: lab.testDate,
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    crp: lab.crp != null ? Number(lab.crp) : null,
    cal: lab.calprotectin != null ? Number(lab.calprotectin) : null
  }
}

const avg = (list) => list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : 0

const rangeOptions = [
  { key: 7, label: '7天' },
  { key: 14, label: '14天' },
  { key: 30, label: '30天' },
  { key: 90, label: '90天' },
  { key: 0, label: '全部' },
]
const rangeDays = ref(14)
const rangedHistory = computed(() => rangeDays.value === 0 ? diaryHistory.value : diaryHistory.value.slice(-rangeDays.value))
const moodTrendHistory = computed(() => {
  const byDay = new Map()
  feelingHistory.value.forEach(entry => {
    if (!entry.date || entry.moodScore == null) return
    const key = formatDateStr(entry.date)
    const day = byDay.get(key) || { date: new Date(`${key}T00:00:00`), scores: [] }
    day.scores.push(entry.moodScore)
    byDay.set(key, day)
  })
  const list = Array.from(byDay.values())
    .map(day => ({ date: day.date, moodScore: Number(avg(day.scores).toFixed(1)) }))
    .sort((a, b) => a.date - b.date)
  if (rangeDays.value === 0) return list
  const from = new Date(today)
  from.setHours(0, 0, 0, 0)
  from.setDate(from.getDate() - rangeDays.value + 1)
  return list.filter(day => day.date >= from)
})
const rangeLabel = computed(() => rangeDays.value === 0 ? `全部 ${diaryHistory.value.length} 天` : `近 ${rangeDays.value} 天`)

const rangeStats = computed(() => {
  const list = rangedHistory.value
  if (!list.length) {
    return [
      { label: '日均排便', value: '-', unit: '次', icon: 'ri-loop-right-line', color: 'text-teal-500' },
      { label: '无痛天数', value: 0, unit: '天', icon: 'ri-emotion-happy-line', color: 'text-emerald-500' },
      { label: '出血天数', value: 0, unit: '天', icon: 'ri-drop-line', color: 'text-rose-500' },
      { label: '自觉舒适', value: 0, unit: '天', icon: 'ri-sun-line', color: 'text-amber-500' },
    ]
  }
  const n = list.length
  const avgPoop = (list.reduce((s, d) => s + d.poop, 0) / n).toFixed(1)
  const painFree = list.filter(d => d.pain === 0).length
  const bloodDays = list.filter(d => d.blood > 0).length
  const goodDays = list.filter(d => d.feel === 'good').length
  return [
    { label: '日均排便', value: avgPoop, unit: '次', icon: 'ri-loop-right-line', color: 'text-teal-500' },
    { label: '无痛天数', value: painFree, unit: '天', icon: 'ri-emotion-happy-line', color: 'text-emerald-500' },
    { label: '出血天数', value: bloodDays, unit: '天', icon: 'ri-drop-line', color: 'text-rose-500' },
    { label: '自觉舒适', value: goodDays, unit: '天', icon: 'ri-sun-line', color: 'text-amber-500' },
  ]
})

const remissionDays = computed(() => diaryHistory.value.filter(d => d.feel === 'good').length)
const painFreeDays = computed(() => diaryHistory.value.filter(d => d.pain === 0).length)

const bristolMeta = {
  0: { icon: '💤', label: '未排', bar: 'bg-stone-300' },
  1: { icon: '🌑', label: '硬球', bar: 'bg-amber-400' },
  2: { icon: '🥔', label: '块状', bar: 'bg-amber-300' },
  3: { icon: '🌽', label: '裂纹', bar: 'bg-teal-400' },
  4: { icon: '🍌', label: '理想', bar: 'bg-emerald-500' },
  5: { icon: '🍮', label: '软块', bar: 'bg-teal-400' },
  6: { icon: '🥣', label: '糊状', bar: 'bg-orange-400' },
  7: { icon: '💧', label: '水样', bar: 'bg-rose-400' }
}
const bristolDistribution = computed(() => {
  const list = rangedHistory.value
  if (!list.length) return []
  const counts = list.reduce((map, day) => {
    map[day.bristol] = (map[day.bristol] || 0) + 1
    return map
  }, {})
  return Object.entries(bristolMeta)
    .map(([type, meta]) => ({
      type,
      ...meta,
      count: counts[type] || 0,
      percent: Math.round(((counts[type] || 0) / list.length) * 100)
    }))
    .filter(item => item.count > 0)
})

const labSummary = computed(() => {
  if (!labHistory.value.length) return []
  const latest = labHistory.value[labHistory.value.length - 1]
  const prev = labHistory.value[labHistory.value.length - 2] || latest
  return [
    {
      name: 'CRP',
      value: latest.crp ?? '-',
      unit: 'mg/L',
      ref: '< 5',
      normal: latest.crp != null && latest.crp < 5,
      delta: latest.crp != null && prev.crp != null ? +(latest.crp - prev.crp).toFixed(1) : 0,
    },
    {
      name: '钙卫蛋白',
      value: latest.cal ?? '-',
      unit: 'μg/g',
      ref: '< 150',
      normal: latest.cal != null && latest.cal < 150,
      delta: latest.cal != null && prev.cal != null ? +(latest.cal - prev.cal).toFixed(0) : 0,
    },
  ]
})

const calendarYear = ref(today.getFullYear())
const calendarMonth = ref(today.getMonth())
const calendarTitle = computed(() => `${calendarYear.value}年${calendarMonth.value + 1}月`)
const canNextCalendarMonth = computed(() => {
  const next = new Date(calendarYear.value, calendarMonth.value + 1, 1)
  return next <= new Date(today.getFullYear(), today.getMonth(), 1)
})
const prevCalendarMonth = () => {
  if (calendarMonth.value === 0) {
    calendarYear.value -= 1
    calendarMonth.value = 11
  } else {
    calendarMonth.value -= 1
  }
}
const nextCalendarMonth = () => {
  if (!canNextCalendarMonth.value) return
  if (calendarMonth.value === 11) {
    calendarYear.value += 1
    calendarMonth.value = 0
  } else {
    calendarMonth.value += 1
  }
}

const calendarDays = computed(() => {
  const year = calendarYear.value
  const month = calendarMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  let pad = (firstDay.getDay() + 6) % 7
  for (let i = 0; i < pad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const rec = diaryHistory.value.find(h => h.date.toDateString() === date.toDateString())
    days.push({
      day: d,
      date,
      recordDate: formatDateStr(date),
      feel: rec ? rec.feel : null,
      record: rec || null
    })
  }
  return days
})

const dayDetailOpen = ref(false)
const selectedDayRecord = ref(null)

const bloodLabel = (key) => bloodOptions.find(o => o.key === key)?.label || key || '未填'
const feelLabel = (key) => feelOptions.find(o => o.key === key)?.label || key || '未填'
const bristolText = (type) => {
  const meta = bristolMeta[type]
  return meta ? `${meta.icon} ${meta.label}` : `类型 ${type}`
}

const selectedDayFeelings = computed(() => {
  const record = selectedDayRecord.value
  if (!record?.date) return []
  return feelingHistory.value.filter(entry => entry.date && entry.date.toDateString() === record.date.toDateString())
})

const dayDetailRows = computed(() => {
  const r = selectedDayRecord.value
  if (!r) return []
  const rows = [
    { label: '排便次数', value: `${r.poopCount}${r.poopCount === '6+' ? '' : ' 次'}` },
    { label: '大便性状', value: bristolText(r.bristol) },
    { label: '出血/黏液', value: bloodLabel(r.bloodKey) },
    { label: '腹痛程度', value: `${r.pain} / 10` },
    { label: '整体感觉', value: r.feel ? feelLabel(r.feel) : '未填' },
    { label: '用药', value: r.meds?.length ? r.meds.join('、') : '未填' },
  ]
  if (r.breakfast) rows.push({ label: '早餐', value: r.breakfast })
  if (r.lunch) rows.push({ label: '午餐', value: r.lunch })
  if (r.dinner) rows.push({ label: '晚餐', value: r.dinner })
  if (r.food) rows.push({ label: '饮食其它', value: r.food })
  if (r.foodFeeling) rows.push({ label: '吃后感觉', value: r.foodFeeling })
  if (!r.breakfast && !r.lunch && !r.dinner && !r.food) {
    rows.push({ label: '饮食', value: '未填' })
  }
  if (!r.foodFeeling) rows.push({ label: '吃后感觉', value: '未填' })
  return rows
})

const openDayDetail = (cell) => {
  if (!cell?.record) return
  selectedDayRecord.value = cell.record
  dayDetailOpen.value = true
}

const chartRef = ref(null)
const labRef = ref(null)
let chart = null
let labChart = null
const trendMode = ref('poop')
const trendMeta = {
  poop: { label: '排便', field: 'poop', color: '#14b8a6', unit: '次' },
  pain: { label: '腹痛', field: 'pain', color: '#f43f5e', unit: '分' },
  mood: { label: '心情', field: 'moodScore', color: '#a87b96', unit: '分', max: 10 },
}
const trendModes = Object.entries(trendMeta).map(([key, m]) => ({ key, label: m.label }))

const renderChart = () => {
  if (!chart) return
  const meta = trendMeta[trendMode.value] || trendMeta.poop
  const list = trendMode.value === 'mood' ? moodTrendHistory.value : rangedHistory.value
  if (!list.length) {
    chart.clear()
    return
  }
  const data = list.map(day => day[meta.field])
  const labels = list.map(d => `${d.date.getMonth() + 1}/${d.date.getDate()}`)
  const color = meta.color
  const labelInterval = Math.max(0, Math.ceil(list.length / 7) - 1)
  chart.setOption({
    grid: { left: 28, right: 12, top: 16, bottom: 24 },
    xAxis: { type: 'category', data: labels, axisLine: { lineStyle: { color: '#e7e5e4' } }, axisLabel: { color: '#a8a29e', fontSize: 9, interval: labelInterval }, axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, max: meta.max, splitLine: { lineStyle: { color: '#f5f5f4' } }, axisLabel: { color: '#a8a29e', fontSize: 9 } },
    series: [{
      type: 'line', data, smooth: true, symbol: list.length > 45 ? 'none' : 'circle', symbolSize: 6,
      lineStyle: { color, width: 3 }, itemStyle: { color },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: color + '55' }, { offset: 1, color: color + '05' }]) }
    }],
    tooltip: { trigger: 'axis', valueFormatter: (v) => `${v} ${meta.unit}` }
  }, true)
}

const ensureLabChart = () => {
  if (!labChart && labRef.value) labChart = echarts.init(labRef.value)
}

const renderLab = () => {
  ensureLabChart()
  if (!labChart) return
  if (!labHistory.value.length) {
    labChart.clear()
    return
  }
  const labels = labHistory.value.map(d => d.date)
  labChart.setOption({
    grid: { left: 38, right: 38, top: 18, bottom: 22 },
    legend: { data: ['CRP', '钙卫蛋白'], top: 0, right: 0, itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 9, color: '#78716c' } },
    xAxis: { type: 'category', data: labels, axisLine: { lineStyle: { color: '#e7e5e4' } }, axisLabel: { color: '#a8a29e', fontSize: 9 }, axisTick: { show: false } },
    yAxis: [
      { type: 'value', name: 'CRP', nameTextStyle: { color: '#f43f5e', fontSize: 8 }, splitLine: { lineStyle: { color: '#f5f5f4' } }, axisLabel: { color: '#a8a29e', fontSize: 8 } },
      { type: 'value', name: '钙卫蛋白', nameTextStyle: { color: '#6366f1', fontSize: 8 }, splitLine: { show: false }, axisLabel: { color: '#a8a29e', fontSize: 8 } },
    ],
    series: [
      { name: 'CRP', type: 'line', yAxisIndex: 0, data: labHistory.value.map(d => d.crp), smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#f43f5e', width: 2.5 }, itemStyle: { color: '#f43f5e' } },
      { name: '钙卫蛋白', type: 'line', yAxisIndex: 1, data: labHistory.value.map(d => d.cal), smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#6366f1', width: 2.5 }, itemStyle: { color: '#6366f1' } },
    ],
    tooltip: { trigger: 'axis' }
  }, true)
}

watch([trendMode, rangeDays, diaryHistory, moodTrendHistory], () => nextTick(renderChart))
watch(labHistory, () => nextTick(() => { ensureLabChart(); renderLab() }))

const loadFeelings = async () => {
  feelingsLoading.value = true
  feelingsFailed.value = false
  try {
    const response = await http.get('/dance/entries', {
      params: { limit: 200, mode: 'peakvalley' },
      timeout: 30000
    })
    if ((response?.status === 200 || response?.code === 200) && Array.isArray(response.data?.entries)) {
      feelingHistory.value = response.data.entries.map(normalizeFeeling)
    }
  } catch (error) {
    feelingsFailed.value = true
    console.error('感想记录加载失败', error)
  } finally {
    feelingsLoading.value = false
  }
}

const loadDiary = async () => {
  isLoading.value = true
  try {
    const [recordsRes, labsRes, todayRes] = await Promise.all([
      http.get('/diary/records', { params: { days: 0 } }),
      http.get('/diary/labs'),
      http.get('/diary/today')
    ])
    if (recordsRes.status === 200 && recordsRes.data) {
      const list = Array.isArray(recordsRes.data.records) ? recordsRes.data.records : []
      diaryHistory.value = list.map(normalizeRecord)
      streakCount.value = Number(recordsRes.data.streak || 0)
      totalRecordDays.value = Number(
        recordsRes.data.totalDays != null ? recordsRes.data.totalDays : list.length
      )
    }
    if (labsRes.status === 200 && Array.isArray(labsRes.data)) {
      labHistory.value = labsRes.data.map(normalizeLab)
    }
    if (todayRes.status === 200 && todayRes.data) {
      todayDone.value = true
      fillFormFromRecord(todayRes.data)
    } else {
      todayDone.value = false
    }
  } catch (error) {
    console.error('肠道日记加载失败', error)
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  } finally {
    isLoading.value = false
    nextTick(() => {
      renderChart()
      renderLab()
    })
  }
}

onMounted(async () => {
  nextTick(() => {
    if (chartRef.value) chart = echarts.init(chartRef.value)
    ensureLabChart()
    window.addEventListener('resize', () => {
      chart && chart.resize()
      labChart && labChart.resize()
    })
  })
  await Promise.all([loadDiary(), loadFeelings()])
})

watch(() => props.feelingRefreshKey, () => loadFeelings())

const checkinOpen = ref(false)
const medOpen = ref(false)
const celebrate = ref(false)
const checkinTargetDate = ref(todayDateStr.value)
const checkinIsToday = computed(() => checkinTargetDate.value === todayDateStr.value)
const checkinDateLabel = computed(() => {
  const d = new Date(`${checkinTargetDate.value}T00:00:00`)
  return checkinIsToday.value ? todayStr.value : formatDisplayDate(d)
})
const form = reactive({ poopCount: '', bristol: 0, blood: '', pain: 0, feel: '', meds: [], medOther: '', breakfast: '', lunch: '', dinner: '', food: '', foodFeeling: '' })
const poopCountOptions = ['0', '1', '2', '3', '4', '5', '6+']
const bristol = [
  { type: 1, icon: '🌑', label: '硬球' }, { type: 2, icon: '🥔', label: '块状' },
  { type: 3, icon: '🌽', label: '裂纹' }, { type: 4, icon: '🍌', label: '光滑' },
  { type: 5, icon: '🍮', label: '软块' }, { type: 6, icon: '🥣', label: '糊状' },
  { type: 7, icon: '💧', label: '水样' }, { type: 0, icon: '💤', label: '未排' },
]
const bloodOptions = [
  { key: 'none', label: '没有', active: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'mucus', label: '只有黏液', active: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'little', label: '少量血', active: 'bg-orange-50 text-orange-700 border-orange-200' },
  { key: 'much', label: '较多血', active: 'bg-rose-50 text-rose-700 border-rose-200' },
]
const feelOptions = [
  { key: 'good', icon: '😊', label: '很好', active: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-700' },
  { key: 'mid', icon: '😐', label: '还行', active: 'bg-amber-50 border-amber-300', text: 'text-amber-700' },
  { key: 'bad', icon: '😣', label: '难受', active: 'bg-rose-50 border-rose-300', text: 'text-rose-700' },
]
const medOptions = ['美沙拉嗪', '阿达木单抗', '英夫利昔', '维得利珠', '乌帕替尼', '乌斯奴', '激素', '没吃', '其它']

const parseMedsForForm = (meds) => {
  const list = Array.isArray(meds) ? [...meds] : []
  let medOther = ''
  const preset = list.filter(m => {
    if (typeof m === 'string' && m.startsWith('其它·')) {
      medOther = m.slice(3)
      return false
    }
    return true
  })
  if (list.some(m => m === '其它' || (typeof m === 'string' && m.startsWith('其它·')))) {
    if (!preset.includes('其它')) preset.push('其它')
  }
  return { meds: preset, medOther }
}

const buildMedsPayload = () => {
  const list = form.meds.filter(m => m !== '其它')
  if (form.meds.includes('其它')) {
    const custom = form.medOther.trim()
    list.push(custom ? `其它·${custom}` : '其它')
  }
  return list
}

const buildMealsPayload = () => {
  const meals = {}
  if (form.breakfast.trim()) meals.breakfast = form.breakfast.trim()
  if (form.lunch.trim()) meals.lunch = form.lunch.trim()
  if (form.dinner.trim()) meals.dinner = form.dinner.trim()
  if (form.foodFeeling.trim()) meals.feeling = form.foodFeeling.trim()
  return Object.keys(meals).length ? meals : null
}

const toggleMed = (m) => {
  if (m === '没吃') {
    if (form.meds.includes('没吃')) {
      form.meds.splice(form.meds.indexOf('没吃'), 1)
    } else {
      form.meds.splice(0, form.meds.length, '没吃')
      form.medOther = ''
    }
    return
  }
  const noneIdx = form.meds.indexOf('没吃')
  if (noneIdx > -1) form.meds.splice(noneIdx, 1)
  const i = form.meds.indexOf(m)
  if (i > -1) {
    form.meds.splice(i, 1)
    if (m === '其它') form.medOther = ''
  } else {
    form.meds.push(m)
  }
}
const painLabel = computed(() => form.pain === 0 ? '无痛' : form.pain <= 3 ? '轻微' : form.pain <= 6 ? '中度' : '剧烈')
const painColor = computed(() => form.pain === 0 ? 'text-emerald-500' : form.pain <= 3 ? 'text-amber-500' : form.pain <= 6 ? 'text-orange-500' : 'text-rose-500')

const resetForm = () => {
  form.poopCount = ''
  form.bristol = 0
  form.blood = ''
  form.pain = 0
  form.feel = ''
  form.meds = []
  form.medOther = ''
  form.breakfast = ''
  form.lunch = ''
  form.dinner = ''
  form.food = ''
  form.foodFeeling = ''
}

const fillFormFromRecord = (record) => {
  form.poopCount = record.poopCount || ''
  form.bristol = record.bristol ?? 0
  form.blood = record.blood || record.bloodKey || ''
  form.pain = record.pain ?? 0
  form.feel = record.feel || ''
  const rawMeds = Array.isArray(record.meds) ? record.meds : safeJson(record.medsJson, [])
  const parsedMeds = parseMedsForForm(rawMeds)
  form.meds = parsedMeds.meds
  form.medOther = parsedMeds.medOther
  const meals = record.meals || safeJson(record.mealsJson, {})
  form.breakfast = meals.breakfast || record.breakfast || ''
  form.lunch = meals.lunch || record.lunch || ''
  form.dinner = meals.dinner || record.dinner || ''
  form.food = record.foodNote || record.food || ''
  form.foodFeeling = meals.feeling || record.foodFeeling || ''
}

const openCheckin = async () => {
  checkinTargetDate.value = todayDateStr.value
  try {
    const res = await http.get('/diary/today')
    if (res.status === 200 && res.data) {
      fillFormFromRecord(res.data)
    } else {
      resetForm()
    }
  } catch {
    resetForm()
  }
  medOpen.value = Boolean(form.meds.length || form.medOther)
  checkinOpen.value = true
}

const editSelectedDay = () => {
  if (!selectedDayRecord.value) return
  checkinTargetDate.value = selectedDayRecord.value.recordDate
  fillFormFromRecord(selectedDayRecord.value)
  medOpen.value = Boolean(form.meds.length || form.medOther)
  dayDetailOpen.value = false
  checkinOpen.value = true
}

const saveCheckin = async () => {
  try {
    const res = await http.post('/diary/save', {
      recordDate: checkinTargetDate.value,
      poopCount: form.poopCount || '0',
      bristol: form.bristol,
      blood: form.blood || 'none',
      pain: form.pain,
      feel: form.feel,
      meds: buildMedsPayload(),
      meals: buildMealsPayload(),
      foodNote: form.food.trim()
    })
    if (res.status === 200) {
      checkinOpen.value = false
      if (checkinIsToday.value) todayDone.value = true
      celebrate.value = true
      setTimeout(() => { celebrate.value = false }, 1800)
      await loadDiary()
    } else {
      alert(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败', error)
    alert('保存失败，稍后再试')
  }
}

const labFormOpen = ref(false)
const isSavingLab = ref(false)
const labForm = reactive({ testDate: todayDateStr.value, crp: '', calprotectin: '', note: '' })

const openLabForm = () => {
  labForm.testDate = todayDateStr.value
  labForm.crp = ''
  labForm.calprotectin = ''
  labForm.note = ''
  labFormOpen.value = true
}

const saveLabRecord = async () => {
  if (!labForm.testDate) return alert('请选择化验日期')
  if (!labForm.crp.trim() && !labForm.calprotectin.trim()) return alert('至少填写 CRP 或钙卫蛋白其中一项')
  isSavingLab.value = true
  try {
    const res = await http.post('/diary/labs', {
      testDate: labForm.testDate,
      crp: labForm.crp.trim() || null,
      calprotectin: labForm.calprotectin.trim() || null,
      note: labForm.note.trim()
    })
    if (res.status === 200) {
      labFormOpen.value = false
      const labsRes = await http.get('/diary/labs')
      if (labsRes.status === 200 && Array.isArray(labsRes.data)) {
        labHistory.value = labsRes.data.map(normalizeLab)
      }
    } else {
      alert(res.message || '保存失败')
    }
  } catch (error) {
    console.error('化验保存失败', error)
    alert('保存失败，稍后再试')
  } finally {
    isSavingLab.value = false
  }
}

const deleteLabRecord = async (labId) => {
  if (!labId || !confirm('确定删除这条化验记录吗？')) return
  try {
    const res = await http.post(`/diary/labs/${labId}/delete`)
    if (res.status === 200) {
      labHistory.value = labHistory.value.filter(item => item.id !== labId)
      showToast({ type: 'success', message: '已删除' })
      nextTick(renderLab)
    } else {
      showToast({ type: 'fail', message: res.message || '删除失败' })
    }
  } catch (error) {
    console.error('化验删除失败', error)
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  }
}

const exportPanelOpen = ref(false)
const activeCard = ref('weekly')
const exportCards = [
  { key: 'streak', label: '成就卡' },
  { key: 'weekly', label: '小结卡' },
  { key: 'report', label: '就诊报告' },
]
const cardStreak = ref(null); const cardWeekly = ref(null); const cardReport = ref(null)
const exporting = ref(false)

const exportRange = reactive({ from: '', to: '' })
const exportPresets = [
  { days: 7, label: '近7天' },
  { days: 14, label: '近14天' },
  { days: 30, label: '近30天' },
  { days: 90, label: '近90天' },
]

const initExportRange = () => {
  exportRange.to = todayDateStr.value
  const from = new Date(today)
  from.setDate(from.getDate() - 29)
  exportRange.from = formatDateStr(from)
}

const setExportPreset = (days) => {
  exportRange.to = todayDateStr.value
  const from = new Date(today)
  from.setDate(from.getDate() - (days - 1))
  exportRange.from = formatDateStr(from)
}

watch(exportPanelOpen, (open) => { if (open) initExportRange() })

const exportRangedHistory = computed(() => {
  if (!exportRange.from || !exportRange.to) return []
  const from = new Date(`${exportRange.from}T00:00:00`)
  const to = new Date(`${exportRange.to}T23:59:59`)
  if (from > to) return []
  return diaryHistory.value.filter(d => d.date >= from && d.date <= to)
})

const exportRangeLabel = computed(() => {
  const n = exportRangedHistory.value.length
  if (!exportRange.from || !exportRange.to) return '请选择起止日期'
  if (!n) return `${exportRange.from} ~ ${exportRange.to} · 该区间暂无记录`
  return `${exportRange.from} ~ ${exportRange.to} · 共 ${n} 天有记录`
})

const buildStats = (list) => {
  if (!list.length) {
    return [
      { label: '日均排便', value: '-', unit: '次' },
      { label: '无痛天数', value: 0, unit: '天' },
      { label: '出血天数', value: 0, unit: '天' },
      { label: '自觉舒适', value: 0, unit: '天' },
    ]
  }
  const n = list.length
  return [
    { label: '日均排便', value: (list.reduce((s, d) => s + d.poop, 0) / n).toFixed(1), unit: '次' },
    { label: '无痛天数', value: list.filter(d => d.pain === 0).length, unit: '天' },
    { label: '出血天数', value: list.filter(d => d.blood > 0).length, unit: '天' },
    { label: '自觉舒适', value: list.filter(d => d.feel === 'good').length, unit: '天' },
  ]
}

const exportRangeStats = computed(() => buildStats(exportRangedHistory.value))
const exportGoodDays = computed(() => exportRangedHistory.value.filter(d => d.feel === 'good').length)
const exportPainFreeDays = computed(() => exportRangedHistory.value.filter(d => d.pain === 0).length)

const exportWeeklyComment = computed(() => {
  const good = Number(exportRangeStats.value[3]?.value || 0)
  const total = exportRangedHistory.value.length
  if (!total) return '所选区间还没有记录，先记几天再来导出吧。'
  return good >= Math.ceil(total * 0.6) ? '这段时间大部分时间都挺舒服，继续保持温和饮食 🌿'
    : good >= Math.ceil(total * 0.3) ? '这段时间有起伏，注意记录诱因，慢慢就能找到自己的雷区。'
    : '这段时间有点辛苦，别硬扛，必要时联系你的主治医生 💚'
})

const exportReportRows = computed(() => {
  const window = exportRangedHistory.value
  const n = window.length || 1
  const avgPoop = window.length ? (window.reduce((s, d) => s + d.poop, 0) / n).toFixed(1) : '-'
  const maxPain = window.length ? Math.max(...window.map(d => d.pain)) : 0
  const bloodDays = window.filter(d => d.blood > 0).length
  const painDays = window.filter(d => d.pain > 0).length
  const labsInRange = labHistory.value.filter(l => {
    const d = new Date(`${l.testDate}T00:00:00`)
    const from = new Date(`${exportRange.from}T00:00:00`)
    const to = new Date(`${exportRange.to}T23:59:59`)
    return d >= from && d <= to
  })
  const latestLab = labsInRange[labsInRange.length - 1]
  return [
    { label: '日均排便次数', value: avgPoop + (avgPoop === '-' ? '' : ' 次') },
    { label: '最高腹痛评分', value: window.length ? `${maxPain} / 10` : '暂无' },
    { label: '有腹痛天数', value: `${painDays} 天` },
    { label: '出血/黏液天数', value: `${bloodDays} 天` },
    { label: 'CRP（区间内最新）', value: latestLab?.crp != null ? `${latestLab.crp} mg/L` : '暂无' },
    { label: '钙卫蛋白（区间内最新）', value: latestLab?.cal != null ? `${latestLab.cal} μg/g` : '暂无' },
    { label: '记录天数', value: `${window.length} 天` },
  ]
})

const exportReportMeds = computed(() => {
  const set = new Set()
  exportRangedHistory.value.forEach(d => (d.meds || []).forEach(m => { if (m && m !== '没吃') set.add(m) }))
  return set.size ? Array.from(set).join(' · ') : '暂无用药记录'
})

const doExport = async () => {
  if (!exportRangedHistory.value.length && activeCard.value !== 'streak') {
    return alert('所选区间没有记录，换个日期试试')
  }
  exporting.value = true
  try {
    const el = activeCard.value === 'streak' ? cardStreak.value
      : activeCard.value === 'weekly' ? cardWeekly.value : cardReport.value
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: null, useCORS: true })
    const link = document.createElement('a')
    link.download = `肠道日记_${activeCard.value}_${exportRange.from}_${exportRange.to}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('导出失败', e)
    alert('导出失败了，稍后再试')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.moment-journal { overflow: hidden; border: 1px solid rgba(103,76,61,.09); border-radius: 26px; background: radial-gradient(circle at 88% 4%, rgba(255,241,206,.88), transparent 30%), linear-gradient(145deg, #fffdf9, #f6eee8); box-shadow: 0 18px 38px -32px rgba(72,48,37,.45); }
.moment-journal-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 18px 18px 14px; }
.moment-journal-head p { color: #ad8d7f; font-size: 9px; font-weight: 900; letter-spacing: .18em; }
.moment-journal-head h3 { margin-top: 3px; color: #392b26; font-family: Georgia, "Noto Serif SC", serif; font-size: 18px; font-weight: 900; }
.moment-journal-head span { display: block; margin-top: 4px; color: #9d8d85; font-size: 10px; font-weight: 700; }
.moment-journal-head button { width: 43px; height: 43px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 15px; color: #fff; background: #2c2522; font-size: 23px; box-shadow: 0 13px 22px -16px rgba(44,37,34,.8); }
.moment-list { display: grid; gap: 8px; padding: 0 10px 10px; }
.moment-note { --moment-accent: #967366; min-height: 88px; display: flex; align-items: stretch; overflow: hidden; border: 1px solid rgba(98,73,61,.07); border-radius: 17px; background: rgba(255,255,255,.84); }
.moment-note.bright { --moment-accent: #c48627; }
.moment-note.dark { --moment-accent: #715878; }
.moment-note-copy { min-width: 0; flex: 1; padding: 12px 13px; }
.moment-note-meta { display: flex; align-items: center; gap: 8px; color: #aa9c95; font-size: 9.5px; font-weight: 800; }
.moment-note-meta span { display: inline-flex; align-items: center; gap: 4px; color: var(--moment-accent); }
.moment-note-copy > h4 { overflow: hidden; margin-top: 7px; color: #392b26; font-family: Georgia, "Noto Serif SC", serif; font-size: 14px; font-weight: 900; line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.moment-note-copy > p { display: -webkit-box; overflow: hidden; margin-top: 3px; color: #62524b; font-size: 11px; font-weight: 650; line-height: 1.5; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.moment-note-copy > small { display: block; overflow: hidden; margin-top: 4px; color: #a4968f; font-size: 9.5px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
.moment-note-time { display: block; margin-top: 7px; color: #b1a49d; font-size: 9px; font-weight: 750; }
.moment-note-image { position: relative; width: 84px; flex: 0 0 auto; overflow: hidden; }
.moment-note-image img { width: 100%; height: 100%; object-fit: cover; }
.moment-note-image span { position: absolute; right: 5px; bottom: 5px; min-width: 23px; height: 20px; display: grid; place-items: center; padding: 0 5px; border-radius: 999px; color: #fff; background: rgba(30,25,23,.65); font-size: 9px; font-weight: 900; }
.moment-empty { margin: 0 10px 10px; padding: 20px; border-radius: 17px; color: #a4968f; background: rgba(255,255,255,.66); font-size: 11px; font-weight: 750; text-align: center; }
.moment-empty-action { width: calc(100% - 20px); display: flex; align-items: center; justify-content: center; gap: 9px; text-align: left; }
.moment-empty-action > i { color: #9a7569; font-size: 21px; }
.moment-empty-action span { display: grid; gap: 2px; }
.moment-empty-action strong { color: #6f5e55; font-size: 11.5px; }
.moment-empty-action small { color: #ac9e97; font-size: 9.5px; }
.day-feelings { display: grid; gap: 8px; margin-top: 6px; }
.day-feelings > header { display: flex; align-items: center; gap: 6px; padding: 5px 2px 1px; color: #88736a; font-size: 11px; font-weight: 900; }
.day-feelings > article { --day-accent: #967366; padding: 13px 14px; border-left: 3px solid var(--day-accent); border-radius: 5px 16px 16px 5px; background: #fff; }
.day-feelings > article.bright { --day-accent: #c48627; }
.day-feelings > article.dark { --day-accent: #715878; }
.day-feelings article > div:first-child { display: flex; align-items: center; justify-content: space-between; color: #aa9c95; font-size: 9.5px; font-weight: 800; }
.day-feelings article > div:first-child span { color: var(--day-accent); }
.day-feelings article > h4 { margin-top: 8px; color: #392b26; font-family: Georgia, "Noto Serif SC", serif; font-size: 14px; font-weight: 900; }
.day-feelings article > p { margin-top: 4px; color: #62524b; font-size: 12px; font-weight: 650; line-height: 1.65; white-space: pre-wrap; }
.day-feeling-images { display: grid !important; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 9px; }
.day-feeling-images img { width: 100%; aspect-ratio: 1; border-radius: 9px; object-fit: cover; }
.custom-scroll::-webkit-scrollbar { display: none; }
.custom-scroll { -ms-overflow-style: none; scrollbar-width: none; }
.sheet-enter-active, .sheet-leave-active { transition: opacity .3s; }
.sheet-enter-active > div:last-child, .sheet-leave-active > div:last-child { transition: transform .3s cubic-bezier(.32,.72,0,1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div:last-child, .sheet-leave-to > div:last-child { transform: translateY(100%); }
.pop-enter-active { transition: all .3s cubic-bezier(.32,.72,0,1); }
.pop-enter-from { opacity: 0; transform: scale(.8); }
.pop-leave-active { transition: all .2s; }
.pop-leave-to { opacity: 0; }
</style>
