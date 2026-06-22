<template>
  <div class="relative w-full min-h-full pb-8 bg-[#F8F6F1] text-slate-950 overflow-x-hidden">
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/40 rounded-full blur-[90px] pointer-events-none"></div>
    <div class="absolute top-80 -left-28 w-80 h-80 bg-cyan-100/60 rounded-full blur-[110px] pointer-events-none"></div>

    <header class="sticky top-0 z-30 bg-[#F8F6F1]/88 backdrop-blur-xl border-b border-stone-200/60 px-4 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <button @click="emit('change-tab', 'checkin')" class="w-10 h-10 rounded-2xl bg-white border border-stone-200 text-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-sm">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <div class="min-w-0">
          <p class="text-[10px] font-black tracking-[0.18em] text-emerald-600">病友真实记录</p>
          <h1 class="text-[20px] font-black tracking-tight leading-tight truncate">用药记录库</h1>
        </div>
      </div>
    </header>

    <main class="relative z-10 p-5 space-y-4">
      <section class="relative overflow-hidden rounded-[30px] bg-slate-950 text-white p-5 shadow-[0_22px_50px_-32px_rgba(15,23,42,0.9)]">
        <div class="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-emerald-300/20 blur-2xl"></div>
        <div class="relative">
          <p class="text-[11px] font-black tracking-[0.18em] text-emerald-200/80 mb-2">不是医学结论，是病友经验</p>
          <h2 class="text-[24px] font-black tracking-tight leading-tight">记录药物怎么被真实身体接住。</h2>
          <p class="text-[12px] text-white/58 leading-relaxed mt-3">药名、剂量、用了多久、是否舒服、哪里不舒服。我们先把真实样本积起来。</p>
        </div>
      </section>

      <section class="grid grid-cols-3 gap-2.5">
        <div class="rounded-2xl bg-white border border-stone-100 p-3 shadow-sm">
          <p class="text-[10px] font-black text-slate-400">药品</p>
          <p class="text-[19px] font-black mt-1">{{ drugDatabase.length }}</p>
        </div>
        <div class="rounded-2xl bg-white border border-stone-100 p-3 shadow-sm">
          <p class="text-[10px] font-black text-slate-400">记录</p>
          <p class="text-[19px] font-black mt-1">{{ totalDrugReviewCount }}</p>
        </div>
        <button @click="resetNewDrug(); showCreateDrug = true" class="rounded-2xl bg-emerald-500 text-white p-3 shadow-sm active:scale-95 transition-all text-left">
          <i class="ri-add-line text-lg"></i>
          <p class="text-[12px] font-black mt-1">补充药品</p>
        </button>
      </section>

      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">💊</span>
        <input v-model="keyword" type="text" placeholder="搜索药名、商品名、用药类型" class="w-full bg-white border border-stone-200 rounded-2xl py-3.5 pl-11 pr-4 text-[13.5px] font-bold outline-none focus:border-emerald-200 shadow-sm placeholder-slate-400">
      </div>

      <div class="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
        <button v-for="category in categories" :key="category.key" @click="activeCategory = category.key" :class="activeCategory === category.key ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-stone-200'" class="shrink-0 px-4 py-2 rounded-full border text-[12px] font-black active:scale-95 transition-all">
          {{ category.label }}
        </button>
      </div>

      <section v-if="filteredDrugs.length" class="space-y-3">
        <article v-for="drug in filteredDrugs" :key="drug.id" @click="openDetail(drug)" class="bg-white border border-stone-100 rounded-[26px] p-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.25)] active:scale-[0.99] transition-all">
          <div class="flex items-start gap-3">
            <button v-if="drug.coverImage || drug.images.length" @click.stop="previewImages(drug.images.length ? drug.images : [drug.coverImage])" class="shrink-0 w-[74px] h-[74px] rounded-[22px] overflow-hidden bg-stone-100 border border-stone-100">
              <img :src="drug.coverImage || drug.images[0]" class="w-full h-full object-cover">
            </button>
            <div v-else class="shrink-0 w-[74px] h-[74px] rounded-[22px] bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-3xl">
              {{ drug.icon || '💊' }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 mb-2">
                <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black">{{ drug.typeLabel || '药物' }}</span>
                <span v-if="drug.tag" class="px-2 py-0.5 rounded-md bg-stone-50 text-slate-500 border border-stone-100 text-[10px] font-black">{{ drug.tag }}</span>
              </div>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="text-[16px] font-black tracking-tight leading-snug truncate">{{ drug.name }}</h3>
                  <p class="text-[11.5px] text-slate-400 font-bold mt-1 truncate">{{ drug.company || '来源待补充' }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="text-[20px] font-black text-slate-950 leading-none">{{ drug.reviewCount || 0 }}</p>
                  <p class="text-[10px] text-slate-400 font-black mt-1">条记录</p>
                </div>
              </div>
              <p class="mt-3 text-[12px] text-slate-600 leading-relaxed bg-stone-50/80 border border-stone-100 rounded-2xl p-3 line-clamp-2">
                {{ drug.desc || drug.description || '还没有足够病友记录，等你来补第一条。' }}
              </p>
              <div class="flex flex-wrap gap-1.5 mt-3">
                <span v-for="tag in drug.tags.slice(0, 3)" :key="tag" class="px-2 py-1 rounded-md bg-white border border-stone-100 text-[10px] font-bold text-slate-500"># {{ tag }}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="rounded-[28px] bg-white border border-stone-100 p-8 text-center">
        <div class="w-14 h-14 rounded-2xl bg-stone-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <i class="ri-capsule-line text-2xl"></i>
        </div>
        <p class="text-[14px] font-black text-slate-700">没找到这款药</p>
        <button @click="prefillDrugFromSearch" class="mt-4 px-5 py-3 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all">补充这款药</button>
      </section>
    </main>

    <div v-if="showDetail && selectedDrug" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" @click="closeDetail"></div>
      <div class="relative z-10 w-full sm:w-[500px] h-[92vh] sm:h-[88vh] rounded-t-[34px] sm:rounded-[34px] bg-[#F8F6F1] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        <div class="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-stone-300"></div>
        <header class="px-5 pt-7 pb-4 bg-[#F8F6F1]/95 border-b border-stone-200/70 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-black tracking-[0.18em] text-emerald-600">{{ selectedDrug.typeLabel || '用药记录' }}</p>
            <h2 class="text-[20px] font-black tracking-tight leading-tight mt-1">{{ selectedDrug.name }}</h2>
            <p class="text-[11.5px] text-slate-400 font-bold mt-1">{{ selectedDrug.company || '来源待补充' }}</p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <template v-if="canManageDrug(selectedDrug)">
              <button @click.stop="openEditDrug(selectedDrug)" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
                <i class="ri-edit-line text-lg"></i>
              </button>
              <button @click.stop="requestDeleteDrug(selectedDrug)" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-rose-500 flex items-center justify-center active:scale-95 transition-all">
                <i class="ri-delete-bin-line text-lg"></i>
              </button>
            </template>
            <button @click="closeDetail" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center active:scale-95 transition-all">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 pb-6">
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-[13px] font-black text-slate-900">基础信息</h3>
              <span class="text-[10px] font-black text-slate-400">{{ selectedDrug.reviewCount || 0 }} 条记录</span>
            </div>
            <p class="text-[12.5px] text-slate-600 leading-relaxed">{{ selectedDrug.desc || selectedDrug.description || '暂无说明，先看病友记录。' }}</p>
            <div v-if="selectedDrug.mechanism" class="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3 text-[12px] text-emerald-900 leading-relaxed">
              {{ selectedDrug.mechanism }}
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">参考原价：<span class="text-slate-900">{{ formatPrice(selectedDrug.priceOriginal) }}</span></div>
              <div class="rounded-2xl bg-stone-50 p-3 text-slate-500">医保后：<span class="text-slate-900">{{ formatPrice(selectedDrug.priceReimbursed) }}</span></div>
            </div>
            <div v-if="selectedDrug.sideEffects" class="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-[12px] text-rose-800 leading-relaxed">
              {{ selectedDrug.sideEffects }}
            </div>
            <div v-if="selectedDrug.images.length" class="grid grid-cols-3 gap-2">
              <button v-for="(image, index) in selectedDrug.images.slice(0, 6)" :key="image" @click="previewImages(selectedDrug.images, index)" class="aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <img :src="image" class="w-full h-full object-cover">
              </button>
            </div>
          </section>

          <section class="rounded-[26px] bg-white border border-emerald-100 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-[13px] font-black text-slate-900">写一条用药记录</h3>
                <p class="text-[10px] text-slate-400 font-bold mt-1">效果、耐受、剂量和图片一起留档</p>
              </div>
              <button @click="drugReviewForm.isAnonymous = drugReviewForm.isAnonymous ? 0 : 1" :class="drugReviewForm.isAnonymous ? 'bg-slate-950 text-white' : 'bg-stone-50 text-slate-500'" class="px-3 py-1.5 rounded-full text-[10px] font-black active:scale-95 transition-all">
                {{ drugReviewForm.isAnonymous ? '匿名' : '实名' }}
              </button>
            </div>

            <div class="space-y-2">
              <p class="text-[10px] font-black text-slate-400">身体反馈</p>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="option in drugFeelingOptions" :key="option.value" @click="drugReviewForm.effectScore = option.value" :class="drugReviewForm.effectScore === option.value ? option.active : 'bg-stone-50 text-slate-500 border-stone-100'" class="py-2.5 rounded-2xl border text-[11px] font-black active:scale-95 transition-all">
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-2">
                <p class="text-[10px] font-black text-slate-400">耐受感</p>
                <div class="grid grid-cols-3 gap-1.5">
                  <button v-for="option in drugSafetyOptions" :key="option.value" @click="drugReviewForm.safetyScore = option.value" :class="drugReviewForm.safetyScore === option.value ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-stone-50 text-slate-500 border-stone-100'" class="py-2 rounded-xl border text-[10px] font-black active:scale-95 transition-all">
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <p class="text-[10px] font-black text-slate-400">副作用</p>
                <div class="grid grid-cols-3 gap-1.5">
                  <button v-for="option in sideEffectOptions" :key="option.value" @click="drugReviewForm.sideEffectLevel = option.value" :class="drugReviewForm.sideEffectLevel === option.value ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-50 text-slate-500 border-stone-100'" class="py-2 rounded-xl border text-[10px] font-black active:scale-95 transition-all">
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <input v-model="drugReviewForm.usageDuration" placeholder="用了多久" class="rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-emerald-200">
              <input v-model="drugReviewForm.dosage" placeholder="剂量 / 频率" class="rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-emerald-200">
            </div>
            <input v-model="drugReviewForm.priceNote" placeholder="价格 / 医保 / 购药渠道" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3 py-3 text-[12px] font-bold outline-none focus:border-emerald-200">
            <textarea v-model="drugReviewForm.content" rows="4" placeholder="真实写：有没有起效、哪里不舒服、多久见效、医生怎么说、踩了什么坑。" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-3.5 py-3 text-[12.5px] font-medium outline-none resize-none focus:border-emerald-200"></textarea>

            <div class="rounded-2xl bg-stone-50 border border-stone-100 p-3">
              <div class="flex items-center justify-between mb-2">
                <p class="text-[11px] font-black text-slate-600">药盒 / 处方 / 缴费图</p>
                <button @click="pickDrugReviewImages" :disabled="isUploadingDrugReviewImages" class="text-[11px] font-black text-emerald-600 disabled:text-slate-300">
                  {{ isUploadingDrugReviewImages ? '上传中…' : '上传图片' }}
                </button>
              </div>
              <input id="drug-review-image-input" type="file" accept="image/*" multiple class="hidden" @change="uploadDrugReviewImages">
              <div v-if="drugReviewForm.images.length" class="grid grid-cols-4 gap-2">
                <div v-for="(image, index) in drugReviewForm.images" :key="image" class="relative aspect-square rounded-xl overflow-hidden bg-white">
                  <img :src="image" class="w-full h-full object-cover">
                  <button @click="removeImage(drugReviewForm, index)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/70 text-white text-[10px] flex items-center justify-center">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
            </div>

            <button @click="submitDrugReview" :disabled="isDrugReviewSubmitting" class="w-full py-3.5 rounded-2xl bg-slate-950 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-400">
              {{ isDrugReviewSubmitting ? '发布中...' : '发布用药记录' }}
            </button>
          </section>

          <section class="space-y-2.5">
            <h3 class="text-[13px] font-black text-slate-900 px-1">病友记录 · {{ drugReviews.length }}</h3>
            <div v-if="isDrugReviewsLoading" class="rounded-2xl bg-white border border-stone-100 p-5 text-center text-[12px] text-slate-400 font-bold">加载中…</div>
            <div v-else-if="drugReviews.length" class="space-y-2.5">
              <article v-for="review in drugReviews" :key="review.id" class="rounded-[22px] bg-white border border-stone-100 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <img :src="avatarOf(review.userAvatar, review.userId)" class="w-8 h-8 rounded-full bg-stone-100 border border-white object-cover">
                    <div class="min-w-0">
                      <p class="text-[12.5px] font-black truncate">{{ review.isAnonymous ? '匿名病友' : (review.userName || '病友') }}</p>
                      <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{ drugFeelingLabel(review.effectScore) }}<span v-if="review.usageDuration"> · {{ review.usageDuration }}</span></p>
                    </div>
                  </div>
                  <button v-if="canDeleteReview(review)" @click="deleteDrugReview(review)" class="text-slate-300 hover:text-rose-500 active:scale-95">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
                <p class="text-[12.5px] text-slate-600 leading-relaxed mt-3">{{ review.content }}</p>
                <div v-if="review.images.length" class="grid grid-cols-4 gap-2 mt-3">
                  <button v-for="(image, index) in review.images.slice(0, 4)" :key="image" @click="previewImages(review.images, index)" class="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img :src="image" class="w-full h-full object-cover">
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-3">
                  <span v-if="review.dosage" class="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">{{ review.dosage }}</span>
                  <span v-if="review.priceNote" class="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">{{ review.priceNote }}</span>
                  <span class="px-2 py-1 rounded-md bg-stone-50 text-slate-500 text-[10px] font-bold">耐受 {{ drugSafetyLabel(review.safetyScore) }}</span>
                  <span class="px-2 py-1 rounded-md bg-stone-50 text-slate-500 text-[10px] font-bold">副作用 {{ sideEffectLabel(review.sideEffectLevel) }}</span>
                </div>
              </article>
            </div>
            <div v-else class="rounded-2xl bg-white border border-stone-100 p-6 text-center text-[12px] text-slate-400 font-bold">暂无记录，第一条很重要。</div>
          </section>
        </div>

      </div>
    </div>

    <div v-if="showCreateDrug" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" @click="showCreateDrug = false"></div>
      <div class="relative z-10 w-full sm:w-[500px] max-h-[88vh] rounded-t-[30px] sm:rounded-[30px] bg-[#F8F6F1] p-5 animate-slide-up overflow-y-auto custom-scrollbar">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-[10px] font-black tracking-[0.18em] text-emerald-600">补充药品</p>
            <h3 class="text-[19px] font-black mt-1">{{ editingDrugId ? '编辑药品档案' : '添加一款药' }}</h3>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">填药名选个类就能存，其余知道再补</p>
          </div>
          <button @click="showCreateDrug = false" class="w-9 h-9 rounded-full bg-white border border-stone-200 text-slate-500 flex items-center justify-center">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="space-y-3">
          <!-- 必填 · 极简 -->
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3.5">
            <input v-model="newDrug.name" placeholder="药名 / 商品名（必填）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3.5 text-[14px] font-bold outline-none focus:border-emerald-200 focus:bg-white transition-all">
            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-2">药物分类</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="option in drugTypeOptions" :key="option.key" @click="newDrug.type = option.key; newDrug.typeLabel = option.label" :class="newDrug.type === option.key ? 'bg-slate-950 text-white border-slate-950' : 'bg-stone-50 text-slate-500 border-stone-100'" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ option.label }}</button>
              </div>
            </div>
            <textarea v-model="newDrug.description" rows="2" placeholder="一句话说明：用于什么、适合什么阶段（推荐填）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-medium outline-none resize-none focus:border-emerald-200 focus:bg-white transition-all"></textarea>
          </section>

          <!-- 展开更多（全部可选）-->
          <button @click="showMoreDrugFields = !showMoreDrugFields" class="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-white border border-stone-100 text-[12px] font-black text-slate-500 active:scale-95 transition-all">
            <i :class="showMoreDrugFields ? 'ri-subtract-line' : 'ri-add-line'"></i>
            {{ showMoreDrugFields ? '收起补充信息' : '继续补充价格 / 标签 / 说明（可选）' }}
          </button>

          <template v-if="showMoreDrugFields">
          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3.5">
            <p class="text-[11px] font-black text-slate-500">价格与来源</p>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newDrug.priceOriginal" inputmode="numeric" placeholder="参考原价" class="rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-emerald-200">
              <input v-model="newDrug.priceReimbursed" inputmode="numeric" placeholder="医保后价格" class="rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-emerald-200">
            </div>
            <input v-model="newDrug.company" placeholder="厂家 / 来源（可选）" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-bold outline-none focus:border-emerald-200">
            <div>
              <p class="text-[11px] font-bold text-slate-400 mb-1.5">标签（可多选）</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="t in drugTagOptions" :key="t" @click="toggleDrugTag(t)" :class="drugChip(hasDrugTag(t))" class="px-3.5 py-1.5 rounded-full border text-[12px] font-bold active:scale-95 transition-all">{{ t }}</button>
              </div>
            </div>
          </section>

          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <p class="text-[11px] font-black text-slate-500">说明与注意（可选）</p>
            <textarea v-model="newDrug.mechanism" rows="2" placeholder="作用理解：比如抗 TNF、肠道选择性、营养支持。" class="w-full rounded-2xl bg-stone-50 border border-stone-100 px-4 py-3 text-[13px] font-medium outline-none resize-none focus:border-emerald-200"></textarea>
            <textarea v-model="newDrug.sideEffects" rows="2" placeholder="常见不适 / 需要提前知道的坑。" class="w-full rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-[13px] font-medium outline-none resize-none focus:border-rose-200"></textarea>
          </section>

          <section class="rounded-[24px] bg-white border border-stone-100 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-black text-slate-500">药盒 / 说明书图片</p>
              <button @click="pickDrugImages" :disabled="isUploadingDrugImages" class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black disabled:text-slate-300">
                {{ isUploadingDrugImages ? '上传中…' : '上传' }}
              </button>
            </div>
            <input id="drug-create-image-input" type="file" accept="image/*" multiple class="hidden" @change="uploadDrugImages">
            <div v-if="newDrug.images.length" class="grid grid-cols-4 gap-2">
              <div v-for="(image, index) in newDrug.images" :key="image" class="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                <img :src="image" class="w-full h-full object-cover">
                <button @click="removeImage(newDrug, index)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/70 text-white text-[10px] flex items-center justify-center">
                  <i class="ri-close-line"></i>
                </button>
              </div>
            </div>
            <button v-else @click="pickDrugImages" class="w-full py-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-[12px] font-black text-slate-400">
              <i class="ri-image-add-line mr-1"></i> 添加图片
            </button>
          </section>
          </template>

          <button @click="requestSubmitDrug" :disabled="isCreatingDrug" class="w-full py-3.5 rounded-2xl bg-slate-950 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-400">
            {{ isCreatingDrug ? '保存中...' : (editingDrugId ? '保存修改' : '确认补充') }}
          </button>
        </div>
      </div>
    </div>

    <SupplementConfirmModal
      v-model:show="showDrugConfirm"
      kind="drug"
      :mode="confirmMode"
      :submitting="isCreatingDrug"
      @confirm="handleDrugConfirm"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { showConfirmDialog, showFailToast, showImagePreview, showSuccessToast, showToast } from 'vant'
import http from '@/api/http'
import { SERVER_DOWN_HINT } from '@/utils/serverHint'
import { avatarOf } from '@/utils/avatarPool'
import { useAuth } from '@/components/useAuth'
import SupplementConfirmModal from '@/components/ui/SupplementConfirmModal.vue'

const emit = defineEmits(['change-tab'])
const { currentUserId, checkPermission } = useAuth()

const categories = [
  { key: 'all', label: '全部' },
  { key: 'bio', label: '生物制剂' },
  { key: 'targeted', label: '小分子' },
  { key: 'immunosuppressant', label: '免疫抑制' },
  { key: 'anti-inflammatory', label: '基础抗炎' },
  { key: 'nutrition', label: '营养剂' },
  { key: 'other', label: '其它' }
]

const categoryAliases = {
  bio: ['bio', 'biological'],
  targeted: ['targeted', 'small_molecule'],
  'anti-inflammatory': ['anti-inflammatory']
}

const drugFeelingOptions = [
  { value: 5, label: '很有用', active: 'bg-emerald-500 text-white border-emerald-500' },
  { value: 3, label: '说不准', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 1, label: '不舒服', active: 'bg-rose-500 text-white border-rose-500' }
]

const drugSafetyOptions = [
  { value: 5, label: '很稳' },
  { value: 3, label: '一般' },
  { value: 1, label: '难受' }
]

const sideEffectOptions = [
  { value: 1, label: '轻微' },
  { value: 3, label: '明显' },
  { value: 5, label: '严重' }
]

const drugTypeOptions = categories.filter(category => category.key !== 'all')

const activeCategory = ref('all')
const keyword = ref('')
const showDetail = ref(false)
const showCreateDrug = ref(false)
const selectedDrug = ref(null)
const editingDrugId = ref(null)
const showDrugConfirm = ref(false)
const confirmMode = ref('create')
const pendingDrugPassword = ref('')
const drugDatabase = ref([])
const drugReviews = ref([])
const isDrugReviewsLoading = ref(false)
const isDrugReviewSubmitting = ref(false)
const isCreatingDrug = ref(false)
const isUploadingDrugImages = ref(false)
const isUploadingDrugReviewImages = ref(false)

const drugReviewForm = reactive({
  effectScore: 3,
  safetyScore: 3,
  sideEffectLevel: 1,
  usageDuration: '',
  dosage: '',
  priceNote: '',
  content: '',
  images: [],
  isAnonymous: 0
})

const newDrug = reactive({
  name: '',
  type: 'other',
  typeLabel: '',
  company: '',
  tag: '',
  tagsText: '',
  description: '',
  mechanism: '',
  sideEffects: '',
  priceOriginal: '',
  priceReimbursed: '',
  images: []
})

// 建档表单：点选式 + 分步折叠
const showMoreDrugFields = ref(false)
const drugTagOptions = ['医保覆盖', '需自费', '口服', '针剂', '输注', '起效快', '副作用小', '需冷藏', '院外购买', '院内开药']
const drugChip = (active) => active
  ? 'bg-emerald-500 text-white border-emerald-500'
  : 'bg-stone-50 text-slate-500 border-stone-100'
const hasDrugTag = (label) => String(newDrug.tagsText || '').split(/[，,\s#]+/).map(s => s.trim()).includes(label)
const toggleDrugTag = (label) => {
  const set = new Set(String(newDrug.tagsText || '').split(/[，,\s#]+/).map(s => s.trim()).filter(Boolean))
  if (set.has(label)) set.delete(label)
  else set.add(label)
  newDrug.tagsText = Array.from(set).join(' ')
}

const safeJson = (value, fallback = []) => {
  if (!value) return fallback
  try { return JSON.parse(value) } catch (error) { return fallback }
}

const normalizeDrug = (drug) => ({
  ...drug,
  desc: drug.description || '',
  tags: Array.isArray(drug.tags) ? drug.tags : safeJson(drug.tagsJson, []),
  images: Array.isArray(drug.images) ? drug.images : safeJson(drug.imagesJson, []),
  reviewCount: Number(drug.reviewCount || 0)
})

const normalizeDrugReview = (review) => ({
  ...review,
  images: Array.isArray(review.images) ? review.images : safeJson(review.imagesJson, [])
})

const formatPrice = (value) => {
  const amount = Number(value || 0)
  return amount > 0 ? `¥${amount}` : '待补'
}

const scoreLabel = (options, value, fallback) => options.find(option => Number(option.value) === Number(value))?.label || fallback
const drugFeelingLabel = (score) => scoreLabel(drugFeelingOptions, score, '说不准')
const drugSafetyLabel = (score) => scoreLabel(drugSafetyOptions, score, '一般')
const sideEffectLabel = (score) => scoreLabel(sideEffectOptions, score, '轻微')
const drugTypeLabelByKey = (key) => drugTypeOptions.find(option => option.key === key)?.label || '病友补充'
const parsePrice = (value) => Number.parseInt(String(value || '').replace(/[^\d]/g, ''), 10) || 0

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

const pickDrugImages = () => document.getElementById('drug-create-image-input')?.click()
const pickDrugReviewImages = () => document.getElementById('drug-review-image-input')?.click()
const uploadDrugImages = (event) => uploadImagesTo(event, newDrug, isUploadingDrugImages)
const uploadDrugReviewImages = (event) => uploadImagesTo(event, drugReviewForm, isUploadingDrugReviewImages)
const removeImage = (target, index) => target.images.splice(index, 1)
const previewImages = (images, start = 0) => {
  if (!images?.length) return
  showImagePreview({ images, startPosition: start })
}

const resetNewDrug = () => {
  editingDrugId.value = null
  Object.assign(newDrug, {
    name: '',
    type: 'other',
    typeLabel: '',
    company: '',
    tag: '',
    tagsText: '',
    description: '',
    mechanism: '',
    sideEffects: '',
    priceOriginal: '',
    priceReimbursed: '',
    images: []
  })
  showMoreDrugFields.value = false
}

const loadDrugs = async () => {
  try {
    const res = await http.get('/drug/list')
    if (res.status === 200 && Array.isArray(res.data)) {
      drugDatabase.value = res.data.map(normalizeDrug)
      return
    }
    drugDatabase.value = []
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  } catch (error) {
    console.error('药物列表加载失败', error)
    drugDatabase.value = []
    showToast({ type: 'fail', message: SERVER_DOWN_HINT })
  }
}

const loadCabinet = async () => {
  try {
    const res = await http.get('/drug/cabinet')
    if (res.status === 200) cabinetList.value = res.data || []
  } catch (error) {
    console.error('药箱加载失败', error)
  }
}

onMounted(async () => {
  try {
    await loadDrugs()
    await loadCabinet()
  } catch (error) {
    console.error('药物列表加载失败', error)
  }
})

const filteredDrugs = computed(() => {
  let list = drugDatabase.value
  if (activeCategory.value !== 'all') {
    const aliases = categoryAliases[activeCategory.value] || [activeCategory.value]
    list = list.filter(item => aliases.includes(item.type) || String(item.typeLabel || '').includes(drugTypeLabelByKey(activeCategory.value)))
  }
  const searchText = keyword.value.trim().toLowerCase()
  if (searchText) {
    list = list.filter(item =>
      [item.name, item.typeLabel, item.company, item.description, item.mechanism, item.sideEffects, ...(item.tags || [])]
        .filter(Boolean)
        .some(text => String(text).toLowerCase().includes(searchText))
    )
  }
  return list
})

const totalDrugReviewCount = computed(() => drugDatabase.value.reduce((sum, item) => sum + Number(item.reviewCount || 0), 0))
const canDeleteReview = (review) => currentUserId.value > 0 && Number(review?.userId || 0) === currentUserId.value
const canManageDrug = (drug) => drug && checkPermission(drug.createdBy)
const currentCabinetItem = computed(() => {
  if (!selectedDrug.value) return null
  return cabinetList.value.find(item => item.drugName === selectedDrug.value.name) || null
})

const resetDrugReviewForm = () => {
  drugReviewForm.effectScore = 3
  drugReviewForm.safetyScore = 3
  drugReviewForm.sideEffectLevel = 1
  drugReviewForm.usageDuration = ''
  drugReviewForm.dosage = ''
  drugReviewForm.priceNote = ''
  drugReviewForm.content = ''
  drugReviewForm.images = []
  drugReviewForm.isAnonymous = 0
}

const loadDrugReviews = async (drugId) => {
  isDrugReviewsLoading.value = true
  try {
    const res = await http.get(`/drug/${drugId}/reviews`)
    if (res.status === 200 && Array.isArray(res.data)) {
      drugReviews.value = res.data.map(normalizeDrugReview)
      const target = drugDatabase.value.find(item => Number(item.id) === Number(drugId))
      if (target) target.reviewCount = res.data.length
      if (selectedDrug.value) selectedDrug.value.reviewCount = res.data.length
    }
  } finally {
    isDrugReviewsLoading.value = false
  }
}

const openDetail = async (drug) => {
  selectedDrug.value = normalizeDrug(drug)
  drugReviews.value = []
  resetDrugReviewForm()
  showDetail.value = true
  await loadDrugReviews(drug.id)
}

const closeDetail = () => {
  showDetail.value = false
  selectedDrug.value = null
}

const submitDrugReview = async () => {
  if (!selectedDrug.value) return
  const content = drugReviewForm.content.trim()
  if (!content) return alert('写点真实用药感受再发布')
  isDrugReviewSubmitting.value = true
  try {
    const res = await http.post(`/drug/${selectedDrug.value.id}/reviews`, {
      ...drugReviewForm,
      content,
      imagesJson: JSON.stringify(drugReviewForm.images)
    })
    if (res.status === 200) {
      resetDrugReviewForm()
      await loadDrugReviews(selectedDrug.value.id)
    } else {
      alert(res.message || '发布失败')
    }
  } catch (error) {
    console.error('药品评价发布失败', error)
    alert('发布失败，稍后再试')
  } finally {
    isDrugReviewSubmitting.value = false
  }
}

const deleteDrugReview = async (review) => {
  if (!selectedDrug.value || !review?.id) return
  if (!confirm('确定删除这条用药记录吗？')) return
  const res = await http.post(`/drug/${selectedDrug.value.id}/reviews/${review.id}/delete`)
  if (res.status === 200) await loadDrugReviews(selectedDrug.value.id)
}

const prefillDrugFromSearch = () => {
  resetNewDrug()
  newDrug.name = keyword.value.trim()
  showCreateDrug.value = true
}

const fillDrugForm = (drug) => {
  const normalized = normalizeDrug(drug)
  editingDrugId.value = normalized.id
  newDrug.name = normalized.name || ''
  newDrug.type = normalized.type || 'other'
  newDrug.typeLabel = normalized.typeLabel || ''
  newDrug.company = normalized.company || ''
  newDrug.tag = normalized.tag || ''
  newDrug.tagsText = (normalized.tags || []).join(' ')
  newDrug.description = normalized.description || normalized.desc || ''
  newDrug.mechanism = normalized.mechanism || ''
  newDrug.sideEffects = normalized.sideEffects || ''
  newDrug.priceOriginal = normalized.priceOriginal ? String(normalized.priceOriginal) : ''
  newDrug.priceReimbursed = normalized.priceReimbursed ? String(normalized.priceReimbursed) : ''
  newDrug.images = [...(normalized.images || [])]
  showMoreDrugFields.value = Boolean(
    newDrug.company || newDrug.mechanism || newDrug.sideEffects || newDrug.priceOriginal || newDrug.priceReimbursed || newDrug.images.length
  )
}

const openEditDrug = (drug) => {
  fillDrugForm(drug)
  showCreateDrug.value = true
}

const buildDrugPayload = () => {
  const tags = newDrug.tagsText
    .split(/[，,\s#]+/)
    .map(item => item.trim())
    .filter(Boolean)
  const typeLabel = newDrug.typeLabel.trim() || drugTypeLabelByKey(newDrug.type)
  return {
    name: newDrug.name.trim(),
    type: newDrug.type || 'other',
    typeLabel,
    icon: '💊',
    tag: newDrug.tag || typeLabel,
    company: newDrug.company,
    description: newDrug.description,
    mechanism: newDrug.mechanism,
    sideEffects: newDrug.sideEffects,
    priceOriginal: parsePrice(newDrug.priceOriginal),
    priceReimbursed: parsePrice(newDrug.priceReimbursed),
    coverImage: newDrug.images[0] || '',
    imagesJson: JSON.stringify(newDrug.images),
    tagsJson: JSON.stringify(tags.length ? tags : [typeLabel])
  }
}

const requestSubmitDrug = () => {
  if (!newDrug.name.trim()) return alert('先写药名')
  confirmMode.value = editingDrugId.value ? 'edit' : 'create'
  showDrugConfirm.value = true
}

const requestDeleteDrug = (drug) => {
  if (!canManageDrug(drug)) return
  editingDrugId.value = drug.id
  confirmMode.value = 'delete'
  showDrugConfirm.value = true
}

const handleDrugConfirm = async (password) => {
  pendingDrugPassword.value = password
  if (confirmMode.value === 'delete') {
    await deleteDrug(password)
    return
  }
  await submitDrug(password)
}

const submitDrug = async (password) => {
  const name = newDrug.name.trim()
  if (!name) return alert('先写药名')
  isCreatingDrug.value = true
  try {
    const payload = { ...buildDrugPayload(), password }
    const isEdit = Boolean(editingDrugId.value)
    const res = isEdit
      ? await http.post(`/drug/${editingDrugId.value}/update`, payload)
      : await http.post('/drug/create', payload)
    if (res.status === 200 && res.data) {
      const drug = normalizeDrug(res.data)
      if (isEdit) {
        const index = drugDatabase.value.findIndex(item => Number(item.id) === Number(drug.id))
        if (index >= 0) drugDatabase.value[index] = drug
        if (selectedDrug.value && Number(selectedDrug.value.id) === Number(drug.id)) {
          selectedDrug.value = drug
        }
      } else {
        drugDatabase.value.unshift(drug)
      }
      showDrugConfirm.value = false
      showCreateDrug.value = false
      resetNewDrug()
      if (!isEdit) await openDetail(drug)
    } else {
      alert(res.message || '保存失败')
    }
  } catch (error) {
    console.error('补充药品失败', error)
    alert('保存失败，稍后再试')
  } finally {
    isCreatingDrug.value = false
  }
}

const deleteDrug = async (password) => {
  if (!editingDrugId.value) return
  isCreatingDrug.value = true
  try {
    const res = await http.post(`/drug/${editingDrugId.value}/delete`, { password })
    if (res.status === 200) {
      drugDatabase.value = drugDatabase.value.filter(item => Number(item.id) !== Number(editingDrugId.value))
      showDrugConfirm.value = false
      closeDetail()
      resetNewDrug()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除药品失败', error)
    alert('删除失败，稍后再试')
  } finally {
    isCreatingDrug.value = false
  }
}

const openAddToCabinet = (drug) => {
  configDrug.value = drug
  cabinetForm.dosage = ''
  cabinetForm.frequency = '每日一次'
  cabinetForm.time = '08:00'
  showCabinetConfig.value = true
}

const confirmAddToCabinet = async () => {
  if (!configDrug.value) return
  const res = await http.post('/drug/cabinet/add', {
    drugName: configDrug.value.name,
    drugIcon: configDrug.value.icon,
    dosage: cabinetForm.dosage,
    frequency: cabinetForm.frequency,
    timeOfDay: cabinetForm.time
  })
  if (res.status === 200) {
    await loadCabinet()
    showCabinetConfig.value = false
  }
}

const removeFromCabinet = async (id) => {
  if (!confirm('确定移出药箱吗？')) return
  await http.delete(`/drug/cabinet/delete/${id}`)
  cabinetList.value = cabinetList.value.filter(item => Number(item.id) !== Number(id))
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
