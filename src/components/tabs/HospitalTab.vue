<template>
  <div class="relative w-full min-h-full pb-8 bg-[#F8F6F1] text-slate-950 overflow-x-hidden">
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-amber-200/50 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-96 -left-28 w-80 h-80 bg-orange-100/70 rounded-full blur-[110px] pointer-events-none"></div>

    <header class="sticky top-0 z-30 bg-[#F8F6F1]/88 backdrop-blur-xl border-b border-stone-200/60 px-4 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <button @click="emit('change-tab', 'checkin')" class="w-10 h-10 rounded-2xl bg-white border border-stone-200 text-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-sm">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <div class="min-w-0">
          <p class="text-[10px] font-black tracking-[0.18em] text-amber-600">病友就诊记录</p>
          <h1 class="text-[20px] font-black tracking-tight leading-tight truncate">医院避坑库</h1>
        </div>
      </div>
      <button @click="resetNewHospital(); showCreateHospital = true" class="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-slate-900/10">
        <i class="ri-add-line text-lg"></i>
      </button>
    </header>

    <main class="relative z-10 p-5 space-y-4">
      <section class="relative overflow-hidden rounded-[30px] bg-slate-950 text-white p-5 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.9)]">
        <div class="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-amber-300/20 blur-2xl"></div>
        <div class="relative">
          <p class="text-[11px] font-black tracking-[0.18em] text-amber-200/80 mb-2">挂号、检查、医生、报销</p>
          <h2 class="text-[24px] font-black tracking-tight leading-tight">把就诊体验变成下一位病友的路标。</h2>
          <p class="text-[12px] text-white/58 leading-relaxed mt-3">哪家能去、哪里难挂、检查等多久、医生沟通如何。先从真实评价开始。</p>
        </div>
      </section>

      <section class="grid grid-cols-3 gap-2.5">
        <div class="rounded-2xl bg-white border border-stone-100 p-3 shadow-sm">
          <p class="text-[10px] font-black text-slate-400">医院</p>
          <p class="text-[19px] font-black mt-1">{{ hospitalDatabase.length }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-stone-100 p-3 shadow-sm">
          <p class="text-[10px] font-black text-slate-400">评价</p>
          <p class="text-[19px] font-black mt-1">{{ totalHospitalReviewCount }}</p>
        </div>
        <button @click="resetNewHospital(); showCreateHospital = true" class="rounded-2xl bg-amber-500 text-white p-3 shadow-sm active:scale-95 transition-all text-left">
          <i class="ri-hospital-line text-lg"></i>
          <p class="text-[12px] font-black mt-1">补充医院</p>
        </button>
      </section>

      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🏥</span>
        <input v-model="keyword" type="text" placeholder="搜索医院、城市、医生、检查" class="w-full bg-white border border-stone-200 rounded-2xl py-3.5 pl-11 pr-4 text-[13.5px] font-bold outline-none focus:border-amber-200 shadow-sm placeholder-slate-400">
      </div>

      <div class="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
        <button v-for="region in regions" :key="region.key" @click="activeRegion = region.key" :class="activeRegion === region.key ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-stone-200'" class="shrink-0 px-4 py-2 rounded-full border text-[12px] font-black active:scale-95 transition-all">
          {{ region.label }}
        </button>
      </div>

      <section v-if="filteredHospitals.length" class="space-y-3">
        <article v-for="hospital in filteredHospitals" :key="hospital.id" @click="openDetail(hospital)" class="bg-white border border-stone-100 rounded-[26px] p-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.25)] active:scale-[0.99] transition-all">
          <div class="flex items-start gap-3">
            <button v-if="hospital.coverImage || hospital.images.length" @click.stop="previewImages(hospital.images.length ? hospital.images : [hospital.coverImage])" class="shrink-0 w-[78px] h-[78px] rounded-[22px] overflow-hidden bg-stone-100 border border-stone-100">
              <img :src="hospital.coverImage || hospital.images[0]" class="w-full h-full object-cover">
            </button>
            <div v-else class="shrink-0 w-[78px] h-[78px] rounded-[22px] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center text-3xl">
              🏥
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 mb-2">
                <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black">{{ hospital.regionLabel || hospital.region || '地区' }}</span>
                <span class="px-2 py-0.5 rounded-md bg-stone-50 text-slate-500 border border-stone-100 text-[10px] font-black">{{ hospital.level || '病友补充' }}</span>
              </div>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="text-[16px] font-black tracking-tight leading-snug truncate">{{ hospital.name }}</h3>
                  <p class="text-[11.5px] text-slate-400 font-bold mt-1 truncate">{{ hospital.summary || '还没有病友补充说明' }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="text-[20px] font-black text-slate-950 leading-none">{{ hospital.reviewCount || 0 }}</p>
                  <p class="text-[10px] text-slate-400 font-black mt-1">条评价</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 mt-3">
                <div class="rounded-2xl bg-stone-50 border border-stone-100 p-2">
                  <p class="text-[9px] font-black text-slate-400">挂号</p>
                  <p class="text-[11px] font-black text-slate-700 mt-1 truncate">{{ hospital.difficulty || '待补' }}</p>
                </div>
                <div class="rounded-2xl bg-stone-50 border border-stone-100 p-2">
                  <p class="text-[9px] font-black text-slate-400">肠镜</p>
                  <p class="text-[11px] font-black text-slate-700 mt-1 truncate">{{ hospital.scopeWait || '待补' }}</p>
                </div>
                <div class="rounded-2xl bg-stone-50 border border-stone-100 p-2">
                  <p class="text-[9px] font-black text-slate-400">检查</p>
                  <p class="text-[11px] font-black text-slate-700 mt-1 truncate">{{ hospital.mreWait || '待补' }}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="rounded-[28px] bg-white border border-stone-100 p-8 text-center">
        <div class="w-14 h-14 rounded-2xl bg-stone-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <i class="ri-hospital-line text-2xl"></i>
        </div>
        <p class="text-[14px] font-black text-slate-700">没找到这家医院</p>
        <button @click="prefillHospitalFromSearch" class="mt-4 px-5 py-3 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all">补充这家医院</button>
      </section>
    </main>

    <div v-if="showDetail && selectedHospital" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" @click="closeDetail"></div>
      <div class="relative z-10 w-full sm:w-[500px] h-[92vh] sm:h-[88vh] rounded-t-[34px] sm:rounded-[34px] bg-[#F8F6F1] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-stone-300"></div>
        <header class="px-5 pt-7 pb-4 bg-[#F8F6F1]/95 border-b border-stone-200/70 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-black tracking-[0.18em] text-amber-600">{{ selectedHospital.regionLabel || selectedHospital.region || '就诊记录' }}</p>
            <h2 class="text-[20px] font-black tracking-tight leading-tight mt-1">{{ selectedHospital.name }}</h2>
            <p class="text-[11.5px] text-slate-400 font-bold mt-1">{{ selectedHospital.level || '病友补充' }}</p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <template v-if="canManageHospital(selectedHospital)">
              <button @click.stop="openEditHospital(selectedHospital)" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
                <i class="ri-edit-line text-lg"></i>
              </button>
              <button @click.stop="requestDeleteHospital(selectedHospital)" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-rose-500 flex items-center justify-center active:scale-95 transition-all">
                <i class="ri-delete-bin-line text-lg"></i>
              </button>
            </template>
            <button @click="closeDetail" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 pb-24">
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-[13px] font-black text-slate-900">就诊信息</h3>
              <span class="text-[10px] font-black text-slate-400">{{ selectedHospital.reviewCount || 0 }} 条评价</span>
            </div>
            <p class="text-[12.5px] text-slate-600 leading-relaxed">{{ selectedHospital.summary || '还没有病友补充说明。' }}</p>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">挂号：<span class="text-slate-900">{{ selectedHospital.difficulty || '待补' }}</span></div>
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">生物制剂：<span class="text-slate-900">{{ selectedHospital.injectionRoom ? '有记录' : '待确认' }}</span></div>
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">肠镜：<span class="text-slate-900">{{ selectedHospital.scopeWait || '待补' }}</span></div>
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">影像：<span class="text-slate-900">{{ selectedHospital.mreWait || '待补' }}</span></div>
            </div>
            <div v-if="selectedHospital.techs.length" class="flex flex-wrap gap-1.5">
              <span v-for="tech in selectedHospital.techs" :key="tech" class="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">{{ tech }}</span>
            </div>
            <div v-if="selectedHospital.images.length" class="grid grid-cols-3 gap-2">
              <button v-for="(image, index) in selectedHospital.images.slice(0, 6)" :key="image" @click="previewImages(selectedHospital.images, index)" class="aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <img :src="image" class="w-full h-full object-cover">
              </button>
            </div>
          </section>

          <section v-if="selectedHospital.doctors.length" class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <h3 class="text-[13px] font-black text-slate-900">病友提到的医生</h3>
            <div v-for="doctor in selectedHospital.doctors" :key="doctor.name || doctor" class="rounded-2xl bg-stone-50 border border-stone-100 p-3">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-[12px] font-black text-slate-800">{{ doctor.name || doctor }}<span v-if="doctor.title" class="ml-1 text-[10px] text-slate-400">{{ doctor.title }}</span></p>
                  <p v-if="doctor.focus" class="text-[11px] text-slate-500 font-bold leading-relaxed mt-1">{{ doctor.focus }}</p>
                  <p v-if="doctor.tip" class="text-[11px] text-slate-400 leading-relaxed mt-0.5">“{{ doctor.tip }}”</p>
                  <p v-if="doctorReviewCount(doctor.name || doctor)" class="text-[10px] text-amber-600 font-black mt-1.5">{{ doctorReviewCount(doctor.name || doctor) }} 条病友评价</p>
                </div>
                <button @click="reviewThisDoctor(doctor)" class="shrink-0 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black active:scale-95 transition-all">评价 TA</button>
              </div>
            </div>
          </section>

          <section v-if="selectedHospital.tips.length" class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <h3 class="text-[13px] font-black text-slate-900">已收集避坑</h3>
            <div v-for="(tip, index) in selectedHospital.tips" :key="index" class="flex gap-2 text-[12px] text-slate-600 leading-relaxed">
              <span class="w-5 h-5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black flex items-center justify-center shrink-0">{{ index + 1 }}</span>
              <span>{{ tip }}</span>
            </div>
          </section>

          <section ref="reviewFormRef" class="rounded-[26px] bg-white border border-amber-100 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-[13px] font-black text-slate-900">写一条就诊评价</h3>
                <p class="text-[10px] text-slate-400 font-bold mt-1">挂号、等待、医生、花费都能留档</p>
              </div>
              <button @click="hospitalReviewForm.isAnonymous = hospitalReviewForm.isAnonymous ? 0 : 1" :class="hospitalReviewForm.isAnonymous ? 'bg-slate-950 text-white' : 'bg-stone-50 text-slate-500'" class="px-3 py-1.5 rounded-full text-[10px] font-black active:scale-95 transition-all">
                {{ hospitalReviewForm.isAnonymous ? '匿名' : '实名' }}
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button v-for="option in hospitalFeelingOptions" :key="option.value" @click="hospitalReviewForm.rating = option.value" :class="hospitalReviewForm.rating === option.value ? option.active : 'bg-stone-50 text-slate-500 border-stone-100'" class="py-2.5 rounded-2xl border text-[11px] font-black active:scale-95 transition-all">
                {{ option.label }}
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button v-for="type in visitTypes" :key="type" @click="hospitalReviewForm.visitType = type" :class="hospitalReviewForm.visitType === type ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-50 text-slate-500 border-stone-100'" class="py-2.5 rounded-2xl border text-[11px] font-black active:scale-95 transition-all">
                {{ type }}
              </button>
            </div>

            <input v-model="hospitalReviewForm.department" placeholder="科室 / 门诊类型" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-amber-200">

            <div>
              <p class="text-[10px] font-black text-slate-400 mb-1.5 px-1">评价哪位医生？（可点选，也可手填）</p>
              <div v-if="selectedHospital.doctors && selectedHospital.doctors.length" class="flex flex-wrap gap-1.5 mb-2">
                <button v-for="doc in selectedHospital.doctors" :key="doc.name || doc" @click="hospitalReviewForm.doctorName = (doc.name || doc)" :class="hospitalReviewForm.doctorName === (doc.name || doc) ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-50 text-slate-500 border-stone-100'" class="px-3 py-1.5 rounded-full border text-[11px] font-bold active:scale-95 transition-all">
                  {{ doc.name || doc }}
                </button>
              </div>
              <input v-model="hospitalReviewForm.doctorName" placeholder="医生名（选填）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-amber-200">
            </div>
            <input v-model="hospitalReviewForm.costNote" placeholder="花费 / 医保 / 门特感受" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-amber-200">

            <div class="grid grid-cols-4 gap-1.5">
              <label v-for="metric in reviewMetrics" :key="metric.key" class="rounded-2xl bg-stone-50 border border-stone-100 p-2 text-center">
                <span class="block text-[9px] font-black text-slate-400">{{ metric.label }}</span>
                <select v-model.number="hospitalReviewForm[metric.key]" class="mt-1 bg-transparent text-[12px] font-black text-slate-800 outline-none">
                  <option v-for="score in [5,4,3,2,1]" :key="score" :value="score">{{ score }}</option>
                </select>
              </label>
            </div>

            <textarea v-model="hospitalReviewForm.content" rows="4" placeholder="真实写：怎么挂号、等了多久、医生沟通、检查流程、医保报销、哪里要避坑。" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3.5 py-3 text-[12.5px] font-medium outline-none resize-none focus:border-amber-200"></textarea>

            <div class="rounded-2xl bg-stone-50 border border-stone-100 p-3">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[11px] font-black text-slate-600">门诊页 / 检查单 / 缴费图</p>
                <button @click="pickHospitalReviewImages" :disabled="isUploadingHospitalReviewImages" class="text-[11px] font-black text-amber-600 disabled:text-slate-300">
                  {{ isUploadingHospitalReviewImages ? '上传中…' : '上传图片' }}
                </button>
              </div>
              <input id="hospital-review-image-input" type="file" accept="image/*" multiple class="hidden" @change="uploadHospitalReviewImages">
              <div v-if="hospitalReviewForm.images.length" class="grid grid-cols-4 gap-2">
                <div v-for="(image, index) in hospitalReviewForm.images" :key="image" class="relative aspect-square rounded-xl overflow-hidden bg-white">
                  <img :src="image" class="w-full h-full object-cover">
                  <button @click="removeImage(hospitalReviewForm, index)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/70 text-white text-[10px] flex items-center justify-center">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
            </div>

            <button @click="submitHospitalReview" :disabled="isHospitalReviewSubmitting" class="w-full py-3.5 rounded-2xl bg-slate-950 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-400">
              {{ isHospitalReviewSubmitting ? '发布中...' : '发布就诊评价' }}
            </button>
          </section>

          <section class="space-y-2.5">
            <h3 class="text-[13px] font-black text-slate-900 px-1">病友评价 · {{ hospitalReviews.length }}</h3>
            <div v-if="isHospitalReviewsLoading" class="rounded-2xl bg-white border border-stone-100 p-5 text-center text-[12px] text-slate-400 font-bold">加载中…</div>
            <div v-else-if="hospitalReviews.length" class="space-y-2.5">
              <article v-for="review in hospitalReviews" :key="review.id" class="rounded-[22px] bg-white border border-stone-100 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[12.5px] font-black truncate">{{ review.isAnonymous ? '匿名病友' : (review.userName || '病友') }}</p>
                    <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{ hospitalFeelingLabel(review.rating) }}<span v-if="review.visitType"> · {{ review.visitType }}</span><span v-if="review.department"> · {{ review.department }}</span></p>
                  </div>
                  <button v-if="canDeleteReview(review)" @click="deleteHospitalReview(review)" class="text-slate-300 hover:text-rose-500 active:scale-95">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
                <p class="text-[12.5px] text-slate-600 leading-relaxed mt-3">{{ review.content }}</p>
                <div v-if="review.images.length" class="grid grid-cols-4 gap-2 mt-3">
                  <button v-for="(image, index) in review.images.slice(0, 4)" :key="image" @click="previewImages(review.images, index)" class="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img :src="image" class="w-full h-full object-cover">
                  </button>
                </div>
                <div class="grid grid-cols-4 gap-1.5 mt-3">
                  <span class="rounded-md bg-stone-50 text-slate-500 text-[9.5px] font-bold text-center px-1 py-1">挂号 {{ review.appointmentScore || 3 }}</span>
                  <span class="rounded-md bg-stone-50 text-slate-500 text-[9.5px] font-bold text-center px-1 py-1">等待 {{ review.waitScore || 3 }}</span>
                  <span class="rounded-md bg-stone-50 text-slate-500 text-[9.5px] font-bold text-center px-1 py-1">沟通 {{ review.attitudeScore || 3 }}</span>
                  <span class="rounded-md bg-stone-50 text-slate-500 text-[9.5px] font-bold text-center px-1 py-1">专业 {{ review.professionalScore || 3 }}</span>
                </div>
                <div v-if="review.costNote || review.doctorName" class="flex flex-wrap gap-1.5 mt-3">
                  <span v-if="review.doctorName" class="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">{{ review.doctorName }}</span>
                  <span v-if="review.costNote" class="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">{{ review.costNote }}</span>
                </div>
              </article>
            </div>
            <div v-else class="rounded-2xl bg-white border border-stone-100 p-6 text-center text-[12px] text-slate-400 font-bold">暂无评价，第一条就诊经验很有用。</div>
          </section>
        </div>
      </div>
    </div>

    <div v-if="showCreateHospital" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" @click="showCreateHospital = false"></div>
      <div class="relative z-10 w-full sm:w-[500px] max-h-[88vh] rounded-t-[30px] sm:rounded-[30px] bg-[#F8F6F1] p-5 animate-slide-up overflow-y-auto custom-scrollbar">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-[10px] font-black tracking-[0.18em] text-amber-600">补充医院</p>
            <h3 class="text-[19px] font-black mt-1">{{ editingHospitalId ? '编辑医院档案' : '添加一家医院' }}</h3>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">填名字就能存，其余知道再点</p>
          </div>
          <button @click="showCreateHospital = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="space-y-3">
          <!-- 必填 · 极简三项 -->
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3.5">
            <input v-model="newHospital.name" placeholder="医院名称（必填）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3.5 text-[14px] font-bold outline-none focus:border-amber-200 focus:bg-white transition-all">
            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-2">在哪个城市</p>
              <button type="button" @click="showCityPicker = true" class="w-full flex items-center justify-between rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3.5 text-left active:scale-[0.99] transition-all focus:border-amber-200">
                <span :class="newHospital.region ? 'text-[13.5px] font-bold text-slate-800' : 'text-[13px] font-medium text-slate-400'">{{ newHospital.region || '点击选择省 / 市，如 四川 · 内江' }}</span>
                <i class="ri-map-pin-line text-amber-500 text-lg shrink-0"></i>
              </button>
            </div>
            <textarea v-model="newHospital.summary" rows="2" placeholder="一句话说明：IBD 门诊、肠镜方便、生物制剂等（推荐填）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-medium outline-none resize-none focus:border-amber-200 focus:bg-white transition-all"></textarea>
          </section>

          <!-- 展开更多（全部可选）-->
          <button @click="showMoreHospitalFields = !showMoreHospitalFields" class="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-white border border-stone-100 text-[12px] font-black text-slate-500 active:scale-95 transition-all">
            <i :class="showMoreHospitalFields ? 'ri-subtract-line' : 'ri-add-line'"></i>
            {{ showMoreHospitalFields ? '收起补充信息' : '继续补充就诊能力（都可选，知道就点）' }}
          </button>

          <template v-if="showMoreHospitalFields">
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-4">
            <p class="text-[11px] font-black text-slate-500">就诊能力 · 不知道的留空就行</p>

            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">挂号难度</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="opt in difficultyOptions" :key="opt" @click="toggleField('difficulty', opt)" :class="chipClass(newHospital.difficulty === opt)" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ opt }}</button>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">初诊响应</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="opt in responseOptions" :key="opt" @click="toggleField('responseTime', opt)" :class="chipClass(newHospital.responseTime === opt)" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ opt }}</button>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">肠镜等待</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="opt in waitOptions" :key="'scope' + opt" @click="toggleField('scopeWait', opt)" :class="chipClass(newHospital.scopeWait === opt)" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ opt }}</button>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">影像（MRE / CT）等待</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="opt in waitOptions" :key="'mre' + opt" @click="toggleField('mreWait', opt)" :class="chipClass(newHospital.mreWait === opt)" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ opt }}</button>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">特色能力（可多选）</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="t in hospitalTechOptions" :key="t" @click="toggleHospitalTech(t)" :class="chipClass(hasHospitalTech(t))" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ t }}</button>
              </div>
            </div>

            <button @click="newHospital.injectionRoom = !newHospital.injectionRoom" :class="newHospital.injectionRoom ? 'bg-amber-500 text-white border-amber-500' : 'bg-stone-50 text-slate-500 border-stone-100'" class="w-full py-3 rounded-2xl border text-[12px] font-black active:scale-95 transition-all">
              {{ newHospital.injectionRoom ? '✓ 有生物制剂 / 输注' : '生物制剂 / 输注待确认' }}
            </button>
          </section>

          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-black text-slate-500">推荐的医生（可选）</p>
              <span class="text-[10px] text-slate-300 font-bold">{{ newHospital.doctors.length }} 位</span>
            </div>

            <div v-for="(doc, dIndex) in newHospital.doctors" :key="dIndex" class="rounded-2xl bg-stone-50 border border-stone-100 p-3 space-y-2.5">
              <div class="flex items-center gap-2">
                <input v-model="doc.name" placeholder="医生姓名，如 张晓琦" class="flex-1 rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-[12.5px] font-bold outline-none focus:border-amber-200">
                <button @click="removeDoctorRow(dIndex)" class="w-8 h-8 rounded-full bg-white border border-stone-200 text-slate-400 text-[14px] active:scale-90 transition-all shrink-0">×</button>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="t in doctorTitleOptions" :key="t" @click="doc.title = doc.title === t ? '' : t" :class="chipClass(doc.title === t)" class="px-3 py-1.5 rounded-full border text-[11px] font-bold active:scale-95 transition-all">{{ t }}</button>
              </div>
              <input v-model="doc.focus" placeholder="专长，如 克罗恩病 / IBD规范化治疗" class="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-[12px] font-medium outline-none focus:border-amber-200">
              <input v-model="doc.tip" placeholder="一句点评，如 沟通细致、号难挂" class="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-[12px] font-medium outline-none focus:border-amber-200">
            </div>

            <button @click="addDoctorRow" class="w-full py-2.5 rounded-2xl border border-dashed border-stone-300 text-[12px] font-black text-slate-400 active:scale-95 transition-all">+ 添加一位医生</button>

            <p class="text-[11px] font-black text-slate-500 pt-1">避坑清单（可选）</p>
            <textarea v-model="newHospital.tipsText" rows="3" placeholder="避坑清单：一行一个，如 首诊带齐肠镜和病理报告。" class="w-full rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-[13px] font-medium outline-none resize-none focus:border-amber-200"></textarea>
          </section>

          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-black text-slate-500">门诊 / 医院图片</p>
              <button @click="pickHospitalImages" :disabled="isUploadingHospitalImages" class="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black disabled:text-slate-300">
                {{ isUploadingHospitalImages ? '上传中…' : '上传' }}
              </button>
            </div>
            <input id="hospital-create-image-input" type="file" accept="image/*" multiple class="hidden" @change="uploadHospitalImages">
            <div v-if="newHospital.images.length" class="grid grid-cols-4 gap-2">
              <div v-for="(image, index) in newHospital.images" :key="image" class="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                <img :src="image" class="w-full h-full object-cover">
                <button @click="removeImage(newHospital, index)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/70 text-white text-[10px] flex items-center justify-center">
                  <i class="ri-close-line"></i>
                </button>
              </div>
            </div>
            <button v-else @click="pickHospitalImages" class="w-full py-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-[12px] font-black text-slate-400">
              <i class="ri-image-add-line mr-1"></i> 添加图片
            </button>
          </section>
          </template>

          <button @click="requestSubmitHospital" :disabled="isCreatingHospital" class="w-full py-3.5 rounded-2xl bg-slate-950 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-400">
            {{ isCreatingHospital ? '保存中...' : (editingHospitalId ? '保存修改' : '确认补充') }}
          </button>
        </div>
      </div>
    </div>

    <SupplementConfirmModal
      v-model:show="showHospitalConfirm"
      kind="hospital"
      :mode="confirmMode"
      :submitting="isCreatingHospital"
      @confirm="handleHospitalConfirm"
    />

    <van-popup v-model:show="showCityPicker" position="bottom" round teleport="body">
      <van-area
        title="选择城市"
        :area-list="areaList"
        :columns-num="2"
        @confirm="onCityConfirm"
        @cancel="showCityPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { showImagePreview } from 'vant'
import { areaList } from '@vant/area-data'
import http from '@/api/http'
import { showToast } from 'vant'
import { SERVER_DOWN_HINT } from '@/utils/serverHint'
import { useAuth } from '@/components/useAuth'
import SupplementConfirmModal from '@/components/ui/SupplementConfirmModal.vue'

const emit = defineEmits(['change-tab'])
const { checkPermission } = useAuth()

const regions = [
  { key: 'all', label: '全部' },
  { key: 'shanghai', label: '上海' },
  { key: 'beijing', label: '北京' },
  { key: 'jiangsu', label: '江苏' },
  { key: 'sichuan', label: '四川' },
  { key: 'guangdong', label: '广东' },
  { key: 'other', label: '其它' }
]

const hospitalFeelingOptions = [
  { value: 5, label: '值得去', active: 'bg-emerald-500 text-white border-emerald-500' },
  { value: 3, label: '一般', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 1, label: '慎重', active: 'bg-rose-500 text-white border-rose-500' }
]

const visitTypes = ['门诊', '住院', '检查', '输液', '急诊', '复诊']
const reviewMetrics = [
  { key: 'appointmentScore', label: '挂号' },
  { key: 'waitScore', label: '等待' },
  { key: 'attitudeScore', label: '沟通' },
  { key: 'professionalScore', label: '专业' }
]

const activeRegion = ref('all')
const keyword = ref('')
const showDetail = ref(false)
const showCreateHospital = ref(false)
const selectedHospital = ref(null)
const editingHospitalId = ref(null)
const showHospitalConfirm = ref(false)
const confirmMode = ref('create')
const hospitalDatabase = ref([])
const hospitalReviews = ref([])
const isHospitalReviewsLoading = ref(false)
const isHospitalReviewSubmitting = ref(false)
const isCreatingHospital = ref(false)
const isUploadingHospitalImages = ref(false)
const isUploadingHospitalReviewImages = ref(false)

const hospitalReviewForm = reactive({
  visitType: '门诊',
  doctorName: '',
  department: '',
  rating: 3,
  appointmentScore: 3,
  waitScore: 3,
  attitudeScore: 3,
  professionalScore: 3,
  costNote: '',
  content: '',
  images: [],
  recommend: 1,
  isAnonymous: 0
})

const newHospital = reactive({
  name: '',
  region: '',
  level: '',
  summary: '',
  difficulty: '',
  responseTime: '',
  scopeWait: '',
  mreWait: '',
  injectionRoom: false,
  techsText: '',
  doctors: [],
  tipsText: '',
  images: []
})

// 建档表单：点选式选项 + 分步折叠
const showMoreHospitalFields = ref(false)
const showCityPicker = ref(false)
const difficultyOptions = ['容易', '中等', '难', '极难']
const responseOptions = ['当天', '3天内', '1周内', '2周+']
const waitOptions = ['1周内', '1-2周', '2-4周', '1月+']
const hospitalTechOptions = ['IBD专病门诊', '肠镜/胃镜', '胶囊内镜', '小肠镜', '营养门诊', '生物制剂输注', 'MDT多学科', '造口护理']
const doctorTitleOptions = ['主任医师', '副主任医师', '主治医师', '住院医师']

const chipClass = (active) => active
  ? 'bg-amber-500 text-white border-amber-500'
  : 'bg-stone-50 text-slate-500 border-stone-100'

// 单选 chip：再点一下可取消（全部可选）
const toggleField = (key, val) => {
  newHospital[key] = newHospital[key] === val ? '' : val
}

// 医生结构化录入
const addDoctorRow = () => newHospital.doctors.push({ name: '', title: '', focus: '', tip: '' })
const removeDoctorRow = (index) => newHospital.doctors.splice(index, 1)

// 评价医生：统计某医生被点评的条数 + 一键评价
const reviewFormRef = ref(null)
const doctorReviewCount = (name) => {
  const target = String(name || '').trim()
  if (!target) return 0
  return hospitalReviews.value.filter(r => String(r.doctorName || '').trim() === target).length
}
const reviewThisDoctor = (doctor) => {
  hospitalReviewForm.doctorName = doctor?.name || doctor || ''
  reviewFormRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// 特色能力多选：写回逗号分隔字符串，兼容原有提交逻辑
const hasHospitalTech = (label) => String(newHospital.techsText || '').split(/\n|，|,/).map(s => s.trim()).includes(label)
const toggleHospitalTech = (label) => {
  const set = new Set(String(newHospital.techsText || '').split(/\n|，|,/).map(s => s.trim()).filter(Boolean))
  if (set.has(label)) set.delete(label)
  else set.add(label)
  newHospital.techsText = Array.from(set).join('，')
}

const safeJson = (value, fallback = []) => {
  if (!value) return fallback
  try { return JSON.parse(value) } catch (error) { return fallback }
}

const splitTextList = (value) => String(value || '')
  .split(/\n|，|,/)
  .map(item => item.trim())
  .filter(Boolean)

const regionLabelMap = Object.fromEntries(regions.map(item => [item.key, item.label]))

const stripAdminSuffix = (name) => String(name || '')
  .replace(/(特别行政区|自治区|自治州|地区|盟)$/g, '')
  .replace(/(壮族|回族|维吾尔)/g, '')
  .replace(/(省|市)$/g, '')
  .trim()

const formatCityRegion = (selectedOptions = []) => {
  const province = selectedOptions[0]?.text || ''
  const city = selectedOptions[1]?.text || ''
  if (!province) return ''
  const provinceShort = stripAdminSuffix(province)
  const cityShort = stripAdminSuffix(city)
  const municipalities = ['北京', '上海', '天津', '重庆']
  if (municipalities.includes(provinceShort)) return provinceShort
  if (!cityShort || cityShort === provinceShort || city === '市辖区') return provinceShort
  return `${provinceShort}·${cityShort}`
}

const onCityConfirm = ({ selectedOptions }) => {
  newHospital.region = formatCityRegion(selectedOptions)
  showCityPicker.value = false
}

const normalizeRegionKey = (value) => {
  const text = String(value || '').trim()
  if (!text) return 'other'
  const legacy = regions.find(item => item.key === text)
  if (legacy) return legacy.key
  const found = regions.find(item => item.key !== 'all' && item.key !== 'other' && text.includes(item.label))
  return found?.key || 'other'
}

const normalizeHospital = (hospital) => ({
  ...hospital,
  regionLabel: regionLabelMap[hospital.region] || hospital.region || '',
  techs: Array.isArray(hospital.techs) ? hospital.techs : safeJson(hospital.techsJson, []),
  doctors: Array.isArray(hospital.doctors) ? hospital.doctors : safeJson(hospital.doctorsJson, []),
  tips: Array.isArray(hospital.tips) ? hospital.tips : safeJson(hospital.tipsJson, []),
  images: Array.isArray(hospital.images) ? hospital.images : safeJson(hospital.imagesJson, []),
  reviewCount: Number(hospital.reviewCount || 0)
})

const normalizeHospitalReview = (review) => ({
  ...review,
  images: Array.isArray(review.images) ? review.images : safeJson(review.imagesJson, [])
})

const hospitalFeelingLabel = (score) => hospitalFeelingOptions.find(item => item.value === Number(score))?.label || '一般'

const uploadOneMedia = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await http.post('/upload', formData, { timeout: 120000 })
  if (res.status === 200 && res.data) return res.data
  throw new Error(res.message || '上传失败')
}

const uploadImagesTo = async (event, target, loadingRef, limit = 6) => {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return
  const remaining = Math.max(0, limit - target.images.length)
  if (!remaining) return alert(`最多上传 ${limit} 张图片`)
  loadingRef.value = true
  try {
    const results = await Promise.allSettled(files.slice(0, remaining).map(uploadOneMedia))
    const urls = results.filter(result => result.status === 'fulfilled').map(result => result.value)
    target.images.push(...urls)
    if (results.some(result => result.status === 'rejected')) alert('有图片上传失败，已保留成功的')
  } catch (error) {
    console.error('图片上传失败', error)
    alert('图片上传失败，稍后再试')
  } finally {
    loadingRef.value = false
  }
}

const pickHospitalImages = () => document.getElementById('hospital-create-image-input')?.click()
const pickHospitalReviewImages = () => document.getElementById('hospital-review-image-input')?.click()
const uploadHospitalImages = (event) => uploadImagesTo(event, newHospital, isUploadingHospitalImages)
const uploadHospitalReviewImages = (event) => uploadImagesTo(event, hospitalReviewForm, isUploadingHospitalReviewImages)
const removeImage = (target, index) => target.images.splice(index, 1)
const previewImages = (images, start = 0) => {
  if (!images?.length) return
  showImagePreview({ images, startPosition: start })
}

const resetNewHospital = () => {
  editingHospitalId.value = null
  Object.assign(newHospital, {
    name: '',
    region: '',
    level: '',
    summary: '',
    difficulty: '',
    responseTime: '',
    scopeWait: '',
    mreWait: '',
    injectionRoom: false,
    techsText: '',
    doctors: [],
    tipsText: '',
    images: []
  })
  showMoreHospitalFields.value = false
}

const loadHospitals = async () => {
  try {
    const res = await http.get('/hospital/list')
    if (res.status === 200 && Array.isArray(res.data)) {
      hospitalDatabase.value = res.data.map(normalizeHospital)
      return
    }
    hospitalDatabase.value = []
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  } catch (error) {
    console.error('医院列表加载失败', error)
    hospitalDatabase.value = []
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  }
}

onMounted(async () => {
  try {
    await loadHospitals()
  } catch (error) {
    console.error('医院列表加载失败', error)
  }
})

const filteredHospitals = computed(() => {
  let list = hospitalDatabase.value
  if (activeRegion.value !== 'all') list = list.filter(item => normalizeRegionKey(item.region) === activeRegion.value)
  const searchText = keyword.value.trim().toLowerCase()
  if (searchText) {
    list = list.filter(item =>
      [
        item.name,
        item.level,
        item.regionLabel,
        item.summary,
        item.difficulty,
        item.scopeWait,
        item.mreWait,
        ...(item.techs || []),
        ...(item.tips || []),
        ...(item.doctors || []).flatMap(doctor => [doctor.name, doctor.focus, doctor.tip])
      ]
        .filter(Boolean)
        .some(text => String(text).toLowerCase().includes(searchText))
    )
  }
  return list
})

const totalHospitalReviewCount = computed(() => hospitalDatabase.value.reduce((sum, item) => sum + Number(item.reviewCount || 0), 0))
const canDeleteReview = (review) => checkPermission(review?.userId)
const canManageHospital = (hospital) => hospital && checkPermission(hospital.createdBy)

const resetHospitalReviewForm = () => {
  hospitalReviewForm.visitType = '门诊'
  hospitalReviewForm.doctorName = ''
  hospitalReviewForm.department = ''
  hospitalReviewForm.rating = 3
  hospitalReviewForm.appointmentScore = 3
  hospitalReviewForm.waitScore = 3
  hospitalReviewForm.attitudeScore = 3
  hospitalReviewForm.professionalScore = 3
  hospitalReviewForm.costNote = ''
  hospitalReviewForm.content = ''
  hospitalReviewForm.images = []
  hospitalReviewForm.recommend = 1
  hospitalReviewForm.isAnonymous = 0
}

const loadHospitalReviews = async (hospitalId) => {
  isHospitalReviewsLoading.value = true
  try {
    const res = await http.get(`/hospital/${hospitalId}/reviews`)
    if (res.status === 200 && Array.isArray(res.data)) {
      hospitalReviews.value = res.data.map(normalizeHospitalReview)
      const target = hospitalDatabase.value.find(item => Number(item.id) === Number(hospitalId))
      if (target) target.reviewCount = res.data.length
      if (selectedHospital.value) selectedHospital.value.reviewCount = res.data.length
    }
  } finally {
    isHospitalReviewsLoading.value = false
  }
}

const openDetail = async (hospital) => {
  selectedHospital.value = normalizeHospital(hospital)
  hospitalReviews.value = []
  resetHospitalReviewForm()
  showDetail.value = true
  await loadHospitalReviews(hospital.id)
}

const closeDetail = () => {
  showDetail.value = false
  selectedHospital.value = null
}

const submitHospitalReview = async () => {
  if (!selectedHospital.value) return
  const content = hospitalReviewForm.content.trim()
  if (!content) return alert('写点真实就诊体验再发布')
  isHospitalReviewSubmitting.value = true
  try {
    const res = await http.post(`/hospital/${selectedHospital.value.id}/reviews`, {
      ...hospitalReviewForm,
      content,
      imagesJson: JSON.stringify(hospitalReviewForm.images),
      recommend: hospitalReviewForm.rating >= 3 ? 1 : 0
    })
    if (res.status === 200) {
      resetHospitalReviewForm()
      await loadHospitalReviews(selectedHospital.value.id)
    } else {
      alert(res.message || '发布失败')
    }
  } catch (error) {
    console.error('医院评价发布失败', error)
    alert('发布失败，稍后再试')
  } finally {
    isHospitalReviewSubmitting.value = false
  }
}

const deleteHospitalReview = async (review) => {
  if (!selectedHospital.value || !review?.id) return
  if (!confirm('确定删除这条就诊评价吗？')) return
  const res = await http.post(`/hospital/${selectedHospital.value.id}/reviews/${review.id}/delete`)
  if (res.status === 200) await loadHospitalReviews(selectedHospital.value.id)
}

const prefillHospitalFromSearch = () => {
  resetNewHospital()
  newHospital.name = keyword.value.trim()
  showCreateHospital.value = true
}

const fillHospitalForm = (hospital) => {
  const normalized = normalizeHospital(hospital)
  editingHospitalId.value = normalized.id
  newHospital.name = normalized.name || ''
  newHospital.region = normalized.regionLabel || normalized.region || ''
  newHospital.level = normalized.level || ''
  newHospital.summary = normalized.summary || ''
  newHospital.difficulty = normalized.difficulty || ''
  newHospital.responseTime = normalized.responseTime || ''
  newHospital.scopeWait = normalized.scopeWait || ''
  newHospital.mreWait = normalized.mreWait || ''
  newHospital.injectionRoom = Boolean(normalized.injectionRoom)
  newHospital.techsText = (normalized.techs || []).join('，')
  newHospital.doctors = (normalized.doctors || []).map(doc => ({
    name: doc.name || '',
    title: doc.title || '',
    focus: doc.focus || '',
    tip: doc.tip || ''
  }))
  newHospital.tipsText = (normalized.tips || []).join('\n')
  newHospital.images = [...(normalized.images || [])]
  showMoreHospitalFields.value = Boolean(
    newHospital.difficulty || newHospital.responseTime || newHospital.scopeWait || newHospital.mreWait
      || newHospital.injectionRoom || newHospital.techsText || newHospital.doctors.length || newHospital.tipsText || newHospital.images.length
  )
}

const openEditHospital = (hospital) => {
  fillHospitalForm(hospital)
  showCreateHospital.value = true
}

const buildHospitalPayload = () => {
  const region = newHospital.region.trim()
  const techs = splitTextList(newHospital.techsText)
  const tips = splitTextList(newHospital.tipsText || newHospital.summary)
  return {
    name: newHospital.name.trim(),
    level: newHospital.level || '病友补充',
    region: region || 'other',
    summary: newHospital.summary,
    rating: 0,
    recommendRate: 0,
    greenChannel: false,
    responseTime: newHospital.responseTime,
    scopeWait: newHospital.scopeWait,
    mreWait: newHospital.mreWait,
    difficulty: newHospital.difficulty,
    injectionRoom: newHospital.injectionRoom,
    techsJson: JSON.stringify(techs.length ? techs : [region].filter(Boolean)),
    doctorsJson: JSON.stringify(
      newHospital.doctors
        .filter(d => String(d.name || '').trim())
        .map(d => ({
          name: String(d.name).trim(),
          title: String(d.title || '').trim(),
          focus: String(d.focus || '').trim(),
          tip: String(d.tip || '').trim()
        }))
    ),
    tipsJson: JSON.stringify(tips),
    coverImage: newHospital.images[0] || '',
    imagesJson: JSON.stringify(newHospital.images)
  }
}

const requestSubmitHospital = () => {
  if (!newHospital.name.trim()) return alert('先写医院名称')
  confirmMode.value = editingHospitalId.value ? 'edit' : 'create'
  showHospitalConfirm.value = true
}

const requestDeleteHospital = (hospital) => {
  if (!canManageHospital(hospital)) return
  editingHospitalId.value = hospital.id
  confirmMode.value = 'delete'
  showHospitalConfirm.value = true
}

const handleHospitalConfirm = async (password) => {
  if (confirmMode.value === 'delete') {
    await deleteHospital(password)
    return
  }
  await submitHospital(password)
}

const submitHospital = async (password) => {
  const name = newHospital.name.trim()
  if (!name) return alert('先写医院名称')
  isCreatingHospital.value = true
  try {
    const payload = { ...buildHospitalPayload(), password }
    const isEdit = Boolean(editingHospitalId.value)
    const res = isEdit
      ? await http.post(`/hospital/${editingHospitalId.value}/update`, payload)
      : await http.post('/hospital/create', payload)
    if (res.status === 200 && res.data) {
      const hospital = normalizeHospital(res.data)
      if (isEdit) {
        const index = hospitalDatabase.value.findIndex(item => Number(item.id) === Number(hospital.id))
        if (index >= 0) hospitalDatabase.value[index] = hospital
        if (selectedHospital.value && Number(selectedHospital.value.id) === Number(hospital.id)) {
          selectedHospital.value = hospital
        }
      } else {
        hospitalDatabase.value.unshift(hospital)
      }
      showHospitalConfirm.value = false
      showCreateHospital.value = false
      resetNewHospital()
      if (!isEdit) await openDetail(hospital)
    } else {
      alert(res.message || '保存失败')
    }
  } catch (error) {
    console.error('补充医院失败', error)
    alert('保存失败，稍后再试')
  } finally {
    isCreatingHospital.value = false
  }
}

const deleteHospital = async (password) => {
  if (!editingHospitalId.value) return
  isCreatingHospital.value = true
  try {
    const res = await http.post(`/hospital/${editingHospitalId.value}/delete`, { password })
    if (res.status === 200) {
      hospitalDatabase.value = hospitalDatabase.value.filter(item => Number(item.id) !== Number(editingHospitalId.value))
      showHospitalConfirm.value = false
      closeDetail()
      resetNewHospital()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除医院失败', error)
    alert('删除失败，稍后再试')
  } finally {
    isCreatingHospital.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 999px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up { animation: slide-up 0.34s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
