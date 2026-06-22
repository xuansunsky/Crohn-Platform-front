<template>
  <div class="relative w-full pb-8 bg-[#FBF9F5] min-h-full">

    <TabPageHeader
      title="经验金库"
      accent="amber"
    >
      <template #action>
        <button
          @click="openModal"
          class="px-3 py-2 rounded-lg text-[12px] font-bold text-white bg-stone-900 border border-stone-900 active:scale-95 transition-transform flex items-center gap-1"
        >
          <i class="ri-add-line text-base"></i>
          写故事
        </button>
      </template>
    </TabPageHeader>

    <!-- 搜索 -->
    <div class="px-4 pt-1 pb-2 bg-[#FBF9F5]">
      <div class="relative">
        <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[16px]"></i>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜标题、内容、标签"
          class="w-full h-11 rounded-2xl bg-white border border-stone-100 pl-10 pr-10 text-[13px] font-bold text-stone-800 placeholder-stone-300 outline-none focus:border-stone-900 focus:shadow-[0_8px_24px_-18px_rgba(15,23,42,0.28)] transition-all"
        />
          <button
          v-if="searchKeyword"
          type="button"
          @click="searchKeyword = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center active:scale-90 transition-all"
        >
          <i class="ri-close-line text-[15px]"></i>
          </button>
      </div>
        </div>

    <!-- 分类（吸顶） -->
    <div class="sticky top-0 z-20 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-100">
      <div class="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
          <button
              v-for="cat in categories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              :class="[
            'shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95',
              activeCategory === cat.id
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-500 border border-stone-200'
            ]"
          >
          {{ cat.label }}
          </button>
        </div>
      </div>

    <!-- 双列瀑布流 · 小红书/闲鱼风 -->
    <div class="px-2 pt-2 columns-2 gap-2">
        <ExperienceCard
        v-for="item in filteredItems"
        :key="item.id"
            v-bind="item"
            :can-edit="checkPermission(item.userId)"
            @delete="deleteCard(item.id)"
        @open="openDetail(item.id)"
        />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredItems.length === 0" class="px-6 mt-16 text-center">
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
        <i class="ri-book-mark-line text-2xl text-slate-300"></i>
      </div>
      <p class="text-[13px] text-slate-400 font-medium">{{ searchKeyword ? '没搜到相关故事，换个词试试' : '该分类还没有故事，去当第一人' }}</p>
    </div>

    <!-- Modal: 写下你的故事 -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-slate-900/70 backdrop-blur-md" @click="closeModal"></div>

        <div class="relative bg-white w-full sm:max-w-3xl sm:rounded-[32px] rounded-t-[32px] max-h-[92vh] sm:max-h-[88vh] overflow-hidden flex flex-col shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)] animate-slide-up">

          <!-- 顶部抓手 -->
          <div class="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

          <!-- Header -->
          <header class="shrink-0 px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <p class="text-[11px] font-medium text-stone-400 mb-1">发布到金库</p>
              <h3 class="text-[22px] font-bold tracking-tight text-slate-900">写下你的故事</h3>
            </div>
            <button @click="closeModal" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-90">
              <i class="ri-close-line text-lg"></i>
            </button>
          </header>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scroll">
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

              <!-- 表单区 -->
              <div class="space-y-6">
                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">标题</label>
                  <input
                      v-model="newPost.title"
                      type="text"
                      placeholder="今天没忍住吃了顿火锅..."
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[15px] font-bold text-slate-900 placeholder-slate-300"
                  >
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">内容</label>
                  <textarea
                      v-model="newPost.summary"
                      rows="6"
                      placeholder="可以写经验、求助、复查记录，也可以只是随便说说今天发生了什么。"
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-[14px] text-slate-700 placeholder-slate-300 resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">地点</label>
                  <button
                    type="button"
                    @click="openLocationSheet"
                    class="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left active:bg-white transition-all"
                  >
                    <span class="flex items-center gap-2 min-w-0">
                      <i class="ri-map-pin-2-line text-stone-400 shrink-0"></i>
                      <span :class="newPost.location ? 'text-[14px] font-bold text-stone-800 truncate' : 'text-[14px] text-stone-400'">
                        {{ newPost.location || '添加地点（医院 / 餐厅 / 商场）' }}
                      </span>
                    </span>
                    <i v-if="newPost.location" @click.stop="clearPostLocation" class="ri-close-circle-fill text-stone-300 text-lg shrink-0"></i>
                    <i v-else class="ri-arrow-right-s-line text-stone-300 shrink-0"></i>
                  </button>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">正文图集 / 视频（最多 9 条 · 第 1 张作封面）</label>
                  <div class="grid grid-cols-3 gap-2.5">
                    <div v-for="(m, i) in newMedia" :key="i" class="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.12)]">
                      <video v-if="isVideo(m)" :src="m" class="w-full h-full object-cover" muted></video>
                      <img v-else :src="m" class="w-full h-full object-cover" />
                      <span v-if="i === 0" class="absolute top-1.5 left-1.5 text-[9px] font-black text-white bg-blue-600/90 px-1.5 py-0.5 rounded-md pointer-events-none">封面</span>
                      <span v-if="isVideo(m)" class="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white bg-black/45 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 pointer-events-none"><i class="ri-play-mini-fill"></i> 视频</span>
                      <button @click="removeStoryMedia(i)" class="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/70 backdrop-blur text-white rounded-full flex items-center justify-center text-[13px] active:scale-90 shadow"><i class="ri-close-line"></i></button>
                    </div>
                    <button
                        v-if="newMedia.length < MAX_MEDIA"
                        @click="pickStoryMedia"
                        class="aspect-square rounded-2xl bg-[#f4f4f6] hover:bg-[#ececf0] flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-all"
                    >
                      <i :class="mediaUploading ? 'ri-loader-4-line animate-spin text-3xl' : 'ri-add-line text-[34px] font-thin'"></i>
                      <span class="text-[11px] font-bold mt-0.5">{{ mediaUploading ? '上传中' : newMedia.length + '/' + MAX_MEDIA }}</span>
                    </button>
                  </div>
                  <input id="story-media-input" type="file" accept="image/*,video/*" multiple class="hidden" @change="onStoryMedia" />
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">内容类型</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="t in primaryTagOptions"
                      :key="t"
                      type="button"
                      @click="selectPrimaryTag(t)"
                      :class="[
                        'px-3.5 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 border',
                        primaryTag === t
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200'
                      ]"
                    >
                      {{ t }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2">话题标签 <span class="font-medium text-stone-300">可多选 · 最多 4 个 · 可自定义</span></label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="t in topicTagOptions"
                      :key="t"
                      type="button"
                      @click="toggleTopicTag(t)"
                      :class="[
                        'px-3 py-1.5 rounded-full text-[11.5px] font-bold transition-all active:scale-95',
                        topicTags.includes(t)
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      ]"
                    >
                      # {{ t }}
                    </button>
                  </div>
                  <div class="mt-2.5 flex items-center gap-2">
                    <div class="flex-1 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 focus-within:bg-white focus-within:border-stone-900 transition-all">
                      <span class="text-stone-300 text-[13px] font-black">#</span>
                      <input
                        v-model="customTopicInput"
                        type="text"
                        maxlength="10"
                        placeholder="自定义标签"
                        class="min-w-0 flex-1 bg-transparent outline-none text-[13px] font-bold text-stone-700 placeholder-stone-300"
                        @keydown.enter.prevent="addCustomTopicTag"
                      />
                    </div>
                    <button
                      type="button"
                      @click="addCustomTopicTag"
                      :disabled="!customTopicInput.trim()"
                      class="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-[12px] font-black disabled:bg-stone-200 disabled:text-stone-400 active:scale-95 transition-all"
                    >
                      添加
                    </button>
                  </div>
                  <div v-if="publishTagPreview.length" class="mt-3 rounded-2xl bg-amber-50/60 border border-amber-100 px-3 py-3">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-[11px] font-black text-amber-700">已选标签</span>
                      <span class="text-[10px] font-bold text-amber-500">{{ publishTagPreview.length }} / {{ MAX_TOPIC_TAGS + 1 }}</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-900 text-white text-[11px] font-black">
                        # {{ primaryTag }}
                      </span>
                      <button
                        v-for="tag in topicTags"
                        :key="tag"
                        type="button"
                        @click="toggleTopicTag(tag)"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white text-amber-800 border border-amber-200 text-[11px] font-black active:scale-95 transition-all"
                      >
                        # {{ tag }}
                        <i class="ri-close-line text-[12px]"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2.5">心情图标</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                        v-for="emoji in emojiOptions"
                        :key="emoji"
                      type="button"
                        @click="newPost.icon = emoji"
                        :class="[
                        'w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90',
                        newPost.icon === emoji
                          ? 'bg-slate-900 text-white scale-110 shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100'
                      ]"
                    >
                      {{ emoji }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-stone-400 mb-2.5">卡片底色</label>
                  <div class="grid grid-cols-4 gap-2.5">
                    <button
                        v-for="theme in availableThemes"
                        :key="theme.value"
                      type="button"
                        @click="newPost.theme = theme.value"
                        :class="[
                        'h-16 rounded-2xl border-2 text-[11px] font-black transition-all active:scale-95 relative overflow-hidden',
                        newPost.theme === theme.value
                          ? 'border-slate-900 ring-2 ring-slate-900/10 scale-[1.02] shadow-md'
                          : 'border-transparent hover:border-slate-200'
                      ]"
                        :style="{ background: theme.bgPreview, color: theme.textColor }"
                    >
                      <span class="relative z-10">{{ theme.name }}</span>
                      <span v-if="newPost.theme === theme.value" class="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center text-slate-900 z-10">
                        <i class="ri-check-line text-[10px] font-black"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 预览区 -->
              <div class="lg:sticky lg:top-0 lg:self-start">
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-[11px] font-bold text-stone-400">实时预览</span>
                  <span class="text-[10px] font-medium text-stone-300">双列展示效果</span>
                </div>
                <div class="columns-2 gap-2 max-w-[320px]">
                  <ExperienceCard v-bind="previewPost" />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white/80 backdrop-blur-xl">
            <button @click="closeModal" class="px-5 py-3 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
              再想想
            </button>
            <button
                @click="publishPost"
                :disabled="publishing || mediaUploading"
                class="px-7 py-3 rounded-xl text-[14px] font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] active:scale-95 transition-all flex items-center gap-2"
            >
              发布到金库 <i class="ri-arrow-right-up-line"></i>
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- ============ 文章详情 · 小红书风 ============ -->
    <transition name="modal-fade">
      <div v-if="showDetail" class="fixed inset-0 z-[110] flex flex-col transition-colors duration-300" :class="detailThemeStyle.page">

        <!-- 顶栏：返回 + 作者 + 收藏 -->
        <header class="detail-topbar shrink-0 backdrop-blur-xl border-b" :class="detailThemeStyle.topbar">
          <div class="h-[54px] px-3 flex items-center gap-2">
            <button @click="closeDetail" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-black/10 transition-all shrink-0" :class="detailThemeStyle.strong">
              <i class="ri-arrow-left-line text-[22px]"></i>
            </button>
            <div v-if="detail && !detailLoading" class="flex-1 flex items-center gap-2.5 min-w-0">
              <img :src="avatarOf(detail.authorAvatar || defaultAvatar, detail.authorName || detail.userId || detail.id)" class="w-9 h-9 rounded-full object-cover bg-stone-100 ring-1 ring-white/20 shrink-0" />
              <p class="text-[14px] font-black truncate" :class="detailThemeStyle.title">{{ detail.authorName || '匿名病友' }}</p>
            </div>
            <div v-else class="flex-1"></div>
            <button
              v-if="detail && isImmersiveTheme"
              @click="toggleRender"
              class="h-8 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1 border active:scale-95 transition-all shrink-0"
              :class="detailThemeStyle.card + ' ' + detailThemeStyle.strong"
              :title="renderEnabled ? '关闭风格渲染，简洁阅读' : '开启发帖人风格'"
            >
              <i :class="renderEnabled ? 'ri-contrast-drop-2-fill' : 'ri-contrast-drop-2-line'" class="text-[14px]"></i>
              {{ renderEnabled ? '简洁' : '风格' }}
            </button>
            <button
              v-if="detail && !checkPermission(detail.userId)"
              @click="toggleFavorite"
              :disabled="favoriteBusy"
              class="h-8 px-3 rounded-full text-[12px] font-black active:scale-95 disabled:opacity-60 transition-all shrink-0"
              :class="detailThemeStyle.favBtn"
            >
              {{ detail.favorited ? '已收藏' : '收藏' }}
            </button>
            <button v-if="detail && checkPermission(detail.userId)" @click="deleteFromDetail" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-rose-500/20 text-rose-500 shrink-0">
              <i class="ri-delete-bin-line text-lg"></i>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scroll" :class="detailThemeStyle.page">
          <div v-if="detailLoading" class="flex items-center justify-center py-24" :class="detailThemeStyle.muted">
            <i class="ri-loader-4-line text-2xl animate-spin"></i>
          </div>

          <article v-else-if="detail">
            <!-- 横滑大图（横图/竖图自适应，不裁切） -->
            <div v-if="detailMedia.length" class="relative" :class="detailThemeStyle.imgBg">
              <div
                ref="galleryEl"
                @scroll="onGalleryScroll"
                class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar items-start"
              >
                <div
                  v-for="(m, i) in detailMedia"
                  :key="i"
                  class="shrink-0 w-full snap-center flex items-center justify-center min-h-[180px]"
                  :class="detailThemeStyle.imgBg"
                >
                  <video
                    v-if="isVideo(m)"
                    :src="m"
                    class="w-full max-h-[72vh] object-contain"
                    controls
                    playsinline
                    preload="metadata"
                  ></video>
                  <img
                    v-else
                    :src="m"
                    class="w-full max-h-[72vh] object-contain block"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <!-- 圆点指示器（图片下方，小红书同款） -->
            <div v-if="detailMedia.length > 1" class="flex items-center justify-center gap-1.5 py-3">
              <span
                v-for="(m, i) in detailMedia"
                :key="i"
                class="rounded-full transition-all duration-300"
                :class="i === galleryIndex ? 'w-1.5 h-1.5 bg-rose-500' : 'w-1.5 h-1.5 bg-slate-300'"
              ></span>
            </div>

            <!-- 标题 + 正文 + 标签 + 属地 -->
            <div class="relative overflow-hidden px-4 pb-6" :class="detailMedia.length <= 1 ? 'pt-5' : 'pt-3'">

              <h1 class="relative text-[21px] leading-[1.4] font-bold tracking-tight mb-3" :class="detailThemeStyle.title"><span v-if="detail.icon" class="mr-1.5">{{ detail.icon }}</span>{{ detail.title }}</h1>

              <p v-if="detail.summary" class="relative text-[15px] leading-[1.85] whitespace-pre-line mb-3" :class="detailThemeStyle.body">{{ detail.summary }}</p>

              <div v-if="detailTags.length" class="relative flex flex-wrap gap-x-2 gap-y-1 mb-4">
                <span v-for="t in detailTags" :key="t" class="text-[14px] font-medium" :class="detailThemeStyle.tag">#{{ t }}</span>
              </div>

              <p v-if="detail.location" class="relative mb-1.5 inline-flex items-center gap-1 text-[12.5px] font-bold" :class="detailThemeStyle.locText">
                <i class="ri-map-pin-2-fill text-[14px] text-rose-400"></i>
                {{ detail.location }}
              </p>

              <p class="relative text-[12px] font-medium" :class="detailThemeStyle.muted">
                {{ fmtDateTime(detail.createdAt) }}
                <span class="mx-1">·</span>
                IP属地 {{ normalizeCityLabel(detail.authorCity) || '未知' }}
              </p>

              <button
                v-if="detailSearchHint"
                @click="jumpToRelated"
                class="relative w-full mt-5 px-4 py-3 rounded-2xl border shadow-[0_10px_26px_-22px_rgba(28,25,23,0.5)] flex items-center gap-3 active:scale-[0.99] transition-all text-left"
                :class="detailThemeStyle.card"
              >
                <span class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :class="detailThemeStyle.chip">
                  <i class="ri-search-2-line text-base"></i>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-[11px] font-bold mb-0.5" :class="detailThemeStyle.muted">猜你想搜</span>
                  <span class="block text-[14px] font-black truncate" :class="detailThemeStyle.cardTitle">{{ detailSearchHint }}</span>
                </span>
                <i class="ri-arrow-right-s-line text-xl" :class="detailThemeStyle.muted"></i>
              </button>
            </div>

            <!-- 评论区 -->
            <section class="mx-4 mb-28 rounded-[28px] border shadow-[0_16px_50px_-36px_rgba(28,25,23,0.45)] overflow-hidden" :class="detailThemeStyle.card">
              <div class="px-4 pt-4 pb-3 flex items-center justify-between">
                <h2 class="text-[15px] font-black" :class="detailThemeStyle.title">评论 {{ detail.commentCount || comments.length || 0 }}</h2>

              </div>

              <div v-if="commentsLoading" class="py-10 flex items-center justify-center" :class="detailThemeStyle.muted">
                <i class="ri-loader-4-line text-xl animate-spin"></i>
              </div>

              <div v-else-if="comments.length === 0" class="px-5 py-10 text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" :class="[detailThemeStyle.chip]">
                  <i class="ri-chat-smile-2-line text-2xl"></i>
                </div>
                <p class="text-[13px] font-bold" :class="detailThemeStyle.muted">还没有评论，来坐第一排</p>
              </div>

              <div v-else class="divide-y" :class="detailThemeStyle.divider">
                <div v-for="comment in comments" :key="comment.id" class="px-4 py-4 flex gap-3">
                  <img
                    :src="avatarOf(comment.userAvatar, comment.userName || comment.userId || comment.id)"
                    class="w-9 h-9 rounded-full object-cover bg-stone-100 ring-1 ring-white/20 shrink-0"
                    alt=""
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[13px] font-black truncate" :class="detailThemeStyle.strong">{{ comment.userName || '匿名病友' }}</span>
                      <span class="text-[10px] shrink-0" :class="detailThemeStyle.muted">{{ fmtDateTime(comment.createdAt) }}</span>
                    </div>
                    <p class="text-[14px] leading-relaxed break-words" :class="detailThemeStyle.body">{{ comment.content }}</p>
                  </div>
                  <button
                    v-if="checkPermission(comment.userId)"
                    @click="deleteComment(comment)"
                    class="w-8 h-8 rounded-full active:bg-rose-500/15 active:text-rose-500 flex items-center justify-center shrink-0"
                    :class="detailThemeStyle.muted"
                  >
                    <i class="ri-delete-bin-6-line text-[15px]"></i>
                  </button>
                </div>
              </div>
            </section>
          </article>
        </div>

        <!-- 底栏互动 -->
        <footer v-if="detail && !detailLoading" class="shrink-0 flex items-center gap-2 px-3 py-3 border-t backdrop-blur-xl safe-area-bottom" :class="detailThemeStyle.topbar">
          <form @submit.prevent="submitComment" class="flex-1 min-w-0 h-10 rounded-full flex items-center px-3 gap-2" :class="detailThemeStyle.inputBg">
            <i class="ri-edit-line shrink-0" :class="detailThemeStyle.muted"></i>
            <input
              ref="commentInputEl"
              v-model="commentDraft"
              type="text"
              maxlength="300"
              placeholder="说点什么…"
              class="flex-1 min-w-0 bg-transparent outline-none text-[13px] font-medium"
              :class="detailThemeStyle.inputText"
            />
            <button
              v-if="commentDraft.trim()"
              type="submit"
              :disabled="commentSending"
              class="px-2.5 py-1 rounded-full text-[11px] font-black disabled:opacity-50 active:scale-95"
              :class="detailThemeStyle.favBtn"
            >
              发送
            </button>
          </form>
          <button @click="toggleLike" :disabled="likeBusy" class="flex flex-col items-center gap-0.5 active:scale-95 px-1.5 disabled:opacity-60" :class="detail.liked ? 'text-rose-500' : detailThemeStyle.iconBtn">
            <i :class="detail.liked ? 'ri-heart-3-fill' : 'ri-heart-3-line'" class="text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.likeCount || 0 }}</span>
          </button>
          <button @click="toggleFavorite" :disabled="favoriteBusy" class="flex flex-col items-center gap-0.5 active:scale-95 px-1.5 disabled:opacity-60" :class="detail.favorited ? 'text-amber-500' : detailThemeStyle.iconBtn">
            <i :class="detail.favorited ? 'ri-star-fill' : 'ri-star-line'" class="text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.favoriteCount || 0 }}</span>
          </button>
          <button @click="focusComment" class="flex flex-col items-center gap-0.5 active:scale-95 px-1.5" :class="detailThemeStyle.iconBtn">
            <i class="ri-chat-3-line text-[22px]"></i>
            <span class="text-[10px] font-black tabular-nums">{{ detail.commentCount || comments.length || 0 }}</span>
          </button>
        </footer>
      </div>
    </transition>

    <!-- 地点选择 · 小红书风 -->
    <transition name="modal-fade">
      <div v-if="showLocationSheet" class="fixed inset-0 z-[120] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showLocationSheet = false"></div>
        <div class="relative w-full max-w-lg bg-white rounded-t-[24px] max-h-[72vh] flex flex-col animate-slide-up">
          <div class="px-5 pt-5 pb-3 border-b border-stone-100 flex items-center justify-between">
            <h4 class="text-[16px] font-bold text-stone-900">添加地点</h4>
            <button @click="showLocationSheet = false" class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <div class="px-4 py-3 border-b border-stone-50">
            <div class="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2.5">
              <i class="ri-search-line text-stone-400"></i>
              <input
                v-model="locationKeyword"
                @keydown.enter="searchNearbyPoi"
                type="text"
                placeholder="搜索地点（医院 / 商场 / 餐厅）"
                class="flex-1 bg-transparent text-[14px] outline-none placeholder-stone-400"
              />
              <button @click="searchNearbyPoi" class="text-[12px] font-bold text-stone-700 px-2">搜索</button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto custom-scroll">
            <div v-if="locationLoading" class="py-12 flex items-center justify-center text-stone-400 gap-2">
              <i class="ri-loader-4-line animate-spin"></i>
              <span class="text-[13px]">正在定位附近…</span>
            </div>
            <div v-else-if="!poiResults.length" class="py-12 text-center text-[13px] text-stone-400">暂无结果，换个关键词试试</div>
            <button
              v-for="poi in poiResults"
              :key="poi.id"
              type="button"
              @click="pickPoi(poi)"
              class="w-full px-4 py-3.5 border-b border-stone-50 text-left active:bg-stone-50 transition-colors"
            >
              <p class="text-[14px] font-bold text-stone-900">{{ poi.title }}</p>
              <p class="text-[11px] text-stone-400 mt-0.5 truncate">{{ poi.address }}</p>
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import ExperienceCard from '@/components/ExperienceCard.vue'
import { useAuth } from '@/components/useAuth.js'
import http from '@/api/http'
import { avatarOf } from '@/utils/avatarPool'

const { currentUserId, checkPermission } = useAuth()

// 类目筛选
const categories = [
  { id: 'all', label: '全部' },
  { id: 'help', label: '求助' },
  { id: 'share', label: '经验分享' },
  { id: 'knowledge', label: '知识分享' },
  { id: 'social', label: '交友' },
  { id: 'daily', label: '日常' },
  { id: 'free', label: '随便说说' },
  { id: 'med', label: '用药' },
  { id: 'food', label: '饮食' }
]
const activeCategory = ref('all')
const searchKeyword = ref('')

const PRIMARY_TAGS = ['求助', '经验分享', '知识分享', '交友', '日常分享', '随便说说']
const TOPIC_TAGS = ['用药', '饮食', '医保', '医院', '复查', '心理', '日常', '睡眠', '运动', '检查', '情绪', '记录']
const LEGACY_TAG_MAP = {
  血泪史: '经验分享',
  治愈: '经验分享',
  人生感悟: '经验分享',
  共鸣: '经验分享',
  克制: '日常分享',
  清单: '日常',
  吃货实录: '饮食',
  出院: '复查',
  新故事: '经验分享',
  日常: '日常分享'
}

const normalizeTags = (tags) => {
  const list = (tags || [])
    .map(t => String(t || '').replace(/^#/, '').trim())
    .map(t => LEGACY_TAG_MAP[t] || t)
    .filter(Boolean)
  return [...new Set(list)]
}

const categoryOf = (tags) => {
  const t = normalizeTags(tags)
  if (t.includes('求助')) return 'help'
  if (t.includes('经验分享')) return 'share'
  if (t.includes('知识分享')) return 'knowledge'
  if (t.includes('交友')) return 'social'
  if (t.includes('日常分享')) return 'daily'
  if (t.includes('随便说说')) return 'free'
  if (t.includes('用药') || t.includes('医保') || t.includes('医院') || t.includes('复查')) return 'med'
  if (t.includes('饮食')) return 'food'
  return 'all'
}

const fmtDateTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  if (d.getFullYear() === now.getFullYear()) return `${month}.${day} ${hour}:${minute}`
  return `${d.getFullYear()}.${month}.${day} ${hour}:${minute}`
}

const normalizeCityLabel = (city) => {
  if (!city) return ''
  return String(city)
    .replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区)$/g, '')
    .trim()
}

const fmtXhsMeta = (iso, city) => {
  if (!iso) return normalizeCityLabel(city) || ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return normalizeCityLabel(city) || ''
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const datePart = `${month}-${day}`
  const cityPart = normalizeCityLabel(city)
  return cityPart ? `${datePart} · ${cityPart}` : datePart
}

const mapExperiencePost = (p) => {
  let mediaList = []
  if (p.media) {
    try { mediaList = JSON.parse(p.media) } catch (e) { mediaList = [] }
  }
  const tags = normalizeTags(p.tags ? p.tags.split(',').filter(Boolean) : [])
  const cover = p.coverImage || mediaList.find(m => !/\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(m)) || mediaList[0] || ''
  return {
    id: p.id,
    userId: p.userId,
    theme: p.theme || 'editorial',
    title: p.title,
    summary: p.summary,
    icon: p.icon || '✍️',
    tags,
    location: p.location || '',
    authorCity: p.authorCity || '',
    coverImage: cover,
    media: mediaList,
    authorName: p.authorName,
    authorAvatar: avatarOf(p.authorAvatar, p.authorName || p.userId || p.id),
    likes: Number(p.likeCount || 0),
    comments: Number(p.commentCount || 0),
    favoriteCount: Number(p.favoriteCount || 0),
    liked: !!p.liked,
    favorited: !!p.favorited,
    category: categoryOf(tags),
    date: fmtDateTime(p.createdAt)
  }
}

// 数据源（真实数据，从后端拉取）
const libraryItems = ref([])

const syncPostCard = (post) => {
  if (!post?.id) return
  const idx = libraryItems.value.findIndex(item => Number(item.id) === Number(post.id))
  if (idx === -1) return
  libraryItems.value[idx] = {
    ...libraryItems.value[idx],
    likes: Number(post.likeCount || 0),
    comments: Number(post.commentCount || 0),
    favoriteCount: Number(post.favoriteCount || 0),
    liked: !!post.liked,
    favorited: !!post.favorited
  }
}

const loadPosts = async () => {
  try {
    const res = await http.get('/experience/list')
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = (res.data || []).map(mapExperiencePost)
    }
  } catch (e) {
    console.error('加载金库失败', e)
  }
}

onMounted(loadPosts)

const filteredItems = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return libraryItems.value.filter(item => {
    const categoryMatched = activeCategory.value === 'all' || item.category === activeCategory.value
    if (!categoryMatched) return false
    if (!keyword) return true
    const text = [
      item.title,
      item.summary,
      item.location,
      item.authorName,
      ...(item.tags || [])
    ].filter(Boolean).join(' ').toLowerCase()
    return text.includes(keyword)
  })
})

const deleteCard = async (id) => {
  if (!confirm('兄弟，确定要把这条经验从金库里移除吗？')) return
  try {
    const res = await http.delete(`/experience/delete/${id}`)
    if (res.status === 200 || res.code === 200) {
      libraryItems.value = libraryItems.value.filter(item => item.id !== id)
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

// 媒体辅助
const defaultAvatar = avatarOf('', 'story')
const isVideo = (url) => /\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(url || '')

// ============ 文章详情 ============
const showDetail = ref(false)
const detailLoading = ref(false)
const detail = ref(null)
const galleryEl = ref(null)
const galleryIndex = ref(0)
const comments = ref([])
const commentsLoading = ref(false)
const commentDraft = ref('')
const commentSending = ref(false)
const likeBusy = ref(false)
const favoriteBusy = ref(false)
const commentInputEl = ref(null)
const detailTags = computed(() => {
  if (!detail.value?.tags) return []
  return normalizeTags(detail.value.tags.split(',').filter(Boolean))
})

// 详情页全局主题（完全沉浸：覆盖背景/顶栏/正文/评论/底栏）
const DETAIL_THEMES = {
  editorial: {
    page: 'bg-[#FFFCF8]', topbar: 'bg-[#FFFCF8]/95 border-stone-100/80',
    title: 'text-stone-950', body: 'text-stone-700', muted: 'text-stone-400', strong: 'text-stone-900',
    tag: 'text-[#13386B]', locText: 'text-stone-600',
    card: 'bg-white border-stone-100', cardTitle: 'text-stone-900', chip: 'bg-amber-50 text-amber-600',
    divider: 'divide-stone-100', commentBorder: 'border-stone-100',
    inputBg: 'bg-stone-100', inputText: 'text-stone-800 placeholder-stone-400',
    iconBtn: 'text-stone-600', favBtn: 'bg-stone-950 text-white', imgBg: 'bg-stone-50', watermark: 'text-stone-900'
  },
  midnight: {
    page: 'bg-[#0b1326]', topbar: 'bg-[#0b1326]/95 border-white/10',
    title: 'text-white', body: 'text-slate-200', muted: 'text-slate-400', strong: 'text-white',
    tag: 'text-sky-300', locText: 'text-slate-200',
    card: 'bg-white/5 border-white/10', cardTitle: 'text-white', chip: 'bg-sky-400/15 text-sky-300',
    divider: 'divide-white/10', commentBorder: 'border-white/10',
    inputBg: 'bg-white/10', inputText: 'text-white placeholder-slate-400',
    iconBtn: 'text-slate-200', favBtn: 'bg-white text-slate-900', imgBg: 'bg-black/40', watermark: 'text-white'
  },
  sunrise: {
    page: 'bg-gradient-to-b from-amber-50 to-rose-50', topbar: 'bg-amber-50/95 border-orange-200/40',
    title: 'text-orange-950', body: 'text-orange-950/80', muted: 'text-orange-900/45', strong: 'text-orange-900',
    tag: 'text-orange-600', locText: 'text-orange-800',
    card: 'bg-white/70 border-orange-200/50', cardTitle: 'text-orange-900', chip: 'bg-white/70 text-orange-600',
    divider: 'divide-orange-200/40', commentBorder: 'border-orange-200/40',
    inputBg: 'bg-white/80', inputText: 'text-orange-900 placeholder-orange-300',
    iconBtn: 'text-orange-800', favBtn: 'bg-orange-900 text-white', imgBg: 'bg-orange-100', watermark: 'text-orange-400'
  },
  aurora: {
    page: 'bg-gradient-to-b from-emerald-50 to-violet-50', topbar: 'bg-emerald-50/90 border-violet-200/40',
    title: 'text-indigo-950', body: 'text-slate-700', muted: 'text-slate-400', strong: 'text-indigo-900',
    tag: 'text-violet-600', locText: 'text-slate-600',
    card: 'bg-white/70 border-violet-200/50', cardTitle: 'text-indigo-900', chip: 'bg-white/70 text-violet-600',
    divider: 'divide-violet-200/40', commentBorder: 'border-violet-200/40',
    inputBg: 'bg-white/80', inputText: 'text-indigo-900 placeholder-slate-400',
    iconBtn: 'text-slate-600', favBtn: 'bg-indigo-900 text-white', imgBg: 'bg-emerald-50', watermark: 'text-violet-400'
  },
  ink: {
    page: 'bg-[#1a1206]', topbar: 'bg-[#1a1206]/95 border-amber-500/15',
    title: 'text-amber-50', body: 'text-amber-100/80', muted: 'text-amber-200/50', strong: 'text-amber-100',
    tag: 'text-amber-400', locText: 'text-amber-100/80',
    card: 'bg-amber-400/5 border-amber-500/15', cardTitle: 'text-amber-100', chip: 'bg-amber-400/15 text-amber-300',
    divider: 'divide-amber-500/10', commentBorder: 'border-amber-500/15',
    inputBg: 'bg-amber-400/10', inputText: 'text-amber-50 placeholder-amber-200/40',
    iconBtn: 'text-amber-100/80', favBtn: 'bg-amber-400 text-stone-900', imgBg: 'bg-black/40', watermark: 'text-amber-300'
  },
  bloom: {
    page: 'bg-gradient-to-b from-rose-50 to-fuchsia-50', topbar: 'bg-rose-50/90 border-rose-200/40',
    title: 'text-rose-950', body: 'text-rose-950/80', muted: 'text-rose-400/70', strong: 'text-rose-900',
    tag: 'text-fuchsia-600', locText: 'text-rose-700',
    card: 'bg-white/70 border-rose-200/50', cardTitle: 'text-rose-900', chip: 'bg-white/70 text-fuchsia-600',
    divider: 'divide-rose-200/40', commentBorder: 'border-rose-200/40',
    inputBg: 'bg-white/80', inputText: 'text-rose-900 placeholder-rose-300',
    iconBtn: 'text-rose-700', favBtn: 'bg-rose-900 text-white', imgBg: 'bg-rose-100', watermark: 'text-rose-400'
  }
}
// 阅读端渲染开关（尊重发帖人主题，但阅读者可一键关掉 + 记忆偏好）
const renderEnabled = ref(localStorage.getItem('vaultDetailRender') !== 'off')
const toggleRender = () => {
  renderEnabled.value = !renderEnabled.value
  localStorage.setItem('vaultDetailRender', renderEnabled.value ? 'on' : 'off')
}
const isImmersiveTheme = computed(() => !!detail.value?.theme && detail.value.theme !== 'editorial')
const detailThemeStyle = computed(() => {
  if (!renderEnabled.value) return DETAIL_THEMES.editorial
  return DETAIL_THEMES[detail.value?.theme] || DETAIL_THEMES.editorial
})
const detailSearchHint = computed(() => {
  if (!detail.value) return ''
  const tag = detailTags.value.find(t => PRIMARY_TAGS.includes(t)) || detailTags.value[0]
  if (tag) return `${tag}相关`
  const title = (detail.value.title || '').replace(/[，。！？、\s]/g, '').slice(0, 14)
  return title || '克罗恩相关'
})
const detailMedia = computed(() => {
  if (!detail.value) return []
  let list = []
  if (detail.value.media) {
    try { list = JSON.parse(detail.value.media) } catch (e) { list = [] }
  }
  // 兼容旧数据：只有 coverImage、没有 media 时也能横滑
  if (!list.length && detail.value.coverImage) list = [detail.value.coverImage]
  return list
})

const onGalleryScroll = () => {
  const el = galleryEl.value
  if (!el || !el.clientWidth) return
  galleryIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

const openDetail = async (id) => {
  if (!id) return
  showDetail.value = true
  detailLoading.value = true
  detail.value = null
  comments.value = []
  commentDraft.value = ''
  galleryIndex.value = 0
  commentsLoading.value = true
  try {
    const [res, commentRes] = await Promise.all([
      http.get(`/experience/detail/${id}`),
      http.get(`/experience/${id}/comments`)
    ])
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      comments.value = (commentRes.status === 200 || commentRes.code === 200) ? (commentRes.data || []) : []
      syncPostCard(res.data)
    } else {
      alert(res.message || '文章打不开了')
      showDetail.value = false
    }
  } catch (e) {
    alert('加载失败，检查网络')
    showDetail.value = false
  } finally {
    detailLoading.value = false
    commentsLoading.value = false
  }
}

const closeDetail = () => { showDetail.value = false }

const submitComment = async () => {
  if (!detail.value?.id) return
  const content = commentDraft.value.trim()
  if (!content || commentSending.value) return
  commentSending.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/comments`, { content })
    if (res.status === 200 || res.code === 200) {
      commentDraft.value = ''
      if (res.data) comments.value.unshift(res.data)
      detail.value.commentCount = Number(detail.value.commentCount || 0) + 1
      syncPostCard(detail.value)
    } else {
      alert(res.message || '评论失败')
    }
  } catch (e) {
    alert('评论失败，检查网络')
  } finally {
    commentSending.value = false
  }
}

const deleteComment = async (comment) => {
  if (!detail.value?.id || !comment?.id) return
  if (!confirm('确定删除这条评论吗？')) return
  try {
    const res = await http.post(`/experience/${detail.value.id}/comments/${comment.id}/delete`)
    if (res.status === 200 || res.code === 200) {
      comments.value = comments.value.filter(item => item.id !== comment.id)
      detail.value.commentCount = Math.max(Number(detail.value.commentCount || 0) - 1, 0)
      syncPostCard(detail.value)
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

const toggleLike = async () => {
  if (!detail.value?.id || likeBusy.value) return
  likeBusy.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/like`)
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      syncPostCard(res.data)
    } else {
      alert(res.message || '操作失败')
    }
  } catch (e) {
    alert('操作失败，检查网络')
  } finally {
    likeBusy.value = false
  }
}

const toggleFavorite = async () => {
  if (!detail.value?.id || favoriteBusy.value) return
  favoriteBusy.value = true
  try {
    const res = await http.post(`/experience/${detail.value.id}/favorite`)
    if (res.status === 200 || res.code === 200) {
      detail.value = res.data
      syncPostCard(res.data)
    } else {
      alert(res.message || '操作失败')
    }
  } catch (e) {
    alert('操作失败，检查网络')
  } finally {
    favoriteBusy.value = false
  }
}

const focusComment = async () => {
  await nextTick()
  commentInputEl.value?.focus()
}

const jumpToRelated = () => {
  const category = categoryOf(detailTags.value)
  if (category && category !== 'all') activeCategory.value = category
  closeDetail()
}

// ============ 地点选择 ============
const showLocationSheet = ref(false)
const locationLoading = ref(false)
const locationKeyword = ref('')
const poiResults = ref([])
const TENCENT_MAP_KEY = 'PBBBZ-R7ZKM-W5X6A-6PYR4-Z3XB6-PFFGM'

const openLocationSheet = () => {
  showLocationSheet.value = true
  poiResults.value = []
  searchNearbyPoi()
}

const searchNearbyPoi = () => {
  if (!navigator.geolocation) {
    alert('当前设备不支持定位，请手动输入地点名称')
    return
  }
  locationLoading.value = true
  poiResults.value = []
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const callbackName = 'jsonp_vault_poi_' + Date.now()
      window[callbackName] = (res) => {
        if (res.status === 0) {
          poiResults.value = res.data || []
        } else {
          alert('拉取附近地点失败：' + res.message)
        }
        locationLoading.value = false
        delete window[callbackName]
      }
      const keyword = locationKeyword.value ? encodeURIComponent(locationKeyword.value) : encodeURIComponent('附近')
      const script = document.createElement('script')
      script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${keyword}&boundary=nearby(${lat},${lng},3000)&key=${TENCENT_MAP_KEY}&output=jsonp&callback=${callbackName}`
      document.body.appendChild(script)
      script.onload = () => document.body.removeChild(script)
      script.onerror = () => {
        alert('网络请求失败，请检查网络')
        locationLoading.value = false
        document.body.removeChild(script)
      }
    },
    () => {
      alert('定位失败，请在浏览器设置中允许获取位置')
      locationLoading.value = false
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

const pickPoi = (poi) => {
  newPost.location = poi.title || ''
  showLocationSheet.value = false
}

const clearPostLocation = () => {
  newPost.location = ''
}

const deleteFromDetail = async () => {
  if (!detail.value) return
  if (!confirm('兄弟，确定要把这条经验从金库里移除吗？')) return
  const id = detail.value.id
  try {
    const res = await http.delete(`/experience/delete/${id}`)
    if (res.status === 200 || res.code === 200) {
  libraryItems.value = libraryItems.value.filter(item => item.id !== id)
      showDetail.value = false
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，检查网络')
  }
}

// Modal
const showModal = ref(false)
const publishing = ref(false)
const newMedia = ref([])
const mediaUploading = ref(false)
const MAX_MEDIA = 9

// 单个文件上传：视频/大图给 2 分钟超时，覆盖全局 5s
const uploadOneMedia = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await http.post('/upload', fd, { timeout: 120000 })
  return res && res.data ? res.data : null
}

const pickStoryMedia = () => document.getElementById('story-media-input')?.click()
const onStoryMedia = async (e) => {
  const picked = Array.from(e.target.files || [])
  e.target.value = ''
  if (!picked.length) return
  const remaining = MAX_MEDIA - newMedia.value.length
  if (remaining <= 0) { alert(`最多 ${MAX_MEDIA} 条哦`); return }
  const files = picked.slice(0, remaining)
  mediaUploading.value = true
  try {
    // 并行上传，互不阻塞；个别失败也不影响其它
    const results = await Promise.allSettled(files.map(uploadOneMedia))
    const urls = results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value)
    if (urls.length) newMedia.value.push(...urls)
    const failed = results.length - urls.length
    if (failed > 0) alert(`有 ${failed} 个上传失败了（可能太大或网络慢），已自动跳过`)
  } finally {
    mediaUploading.value = false
  }
}
const removeStoryMedia = (i) => newMedia.value.splice(i, 1)
const newPost = reactive({
  id: null,
  theme: 'editorial',
  title: '',
  summary: '',
  location: '',
  icon: '✍️',
  likes: 0,
  comments: 0,
  date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
})

const primaryTag = ref('经验分享')
const topicTags = ref([])
const primaryTagOptions = PRIMARY_TAGS
const topicTagOptions = TOPIC_TAGS
const MAX_TOPIC_TAGS = 4
const customTopicInput = ref('')

const emojiOptions = ['😈', '🧊', '🍦', '🧠', '👾', '✍️', '📸', '🌥️', '🐳', '💊', '🌙', '🔥', '🌿', '🚑', '🥰', '🫶', '🌈', '☀️']

const availableThemes = [
  { name: '素白', value: 'editorial', bgPreview: '#ffffff', textColor: '#0f172a' },
  { name: '深夜', value: 'midnight', bgPreview: 'linear-gradient(135deg, #0f172a, #1e3a8a)', textColor: '#fff' },
  { name: '暖晨', value: 'sunrise', bgPreview: 'linear-gradient(135deg, #fef3c7, #fecaca)', textColor: '#7c2d12' },
  { name: '清透', value: 'aurora', bgPreview: 'linear-gradient(135deg, #ecfdf5, #ede9fe)', textColor: '#1e1b4b' },
  { name: '墨金', value: 'ink', bgPreview: 'linear-gradient(135deg, #020617, #422006)', textColor: '#fcd34d' },
  { name: '浅绯', value: 'bloom', bgPreview: 'linear-gradient(135deg, #fff1f2, #fae8ff)', textColor: '#9d174d' }
]

const buildPublishTags = () => {
  return normalizeTags([primaryTag.value, ...topicTags.value.filter(t => t !== primaryTag.value)])
}
const publishTagPreview = computed(buildPublishTags)

const selectPrimaryTag = (tag) => {
  primaryTag.value = tag
  topicTags.value = topicTags.value.filter(t => t !== tag)
}

const toggleTopicTag = (tag) => {
  if (tag === primaryTag.value) return
  const idx = topicTags.value.indexOf(tag)
  if (idx > -1) topicTags.value.splice(idx, 1)
  else {
    if (topicTags.value.length >= MAX_TOPIC_TAGS) topicTags.value.shift()
    topicTags.value.push(tag)
  }
}

const addCustomTopicTag = () => {
  const tag = customTopicInput.value.replace(/^#/, '').trim()
  if (!tag || tag === primaryTag.value) {
    customTopicInput.value = ''
    return
  }
  toggleTopicTag(tag.slice(0, 10))
  customTopicInput.value = ''
}

// 实时预览：封面自动取图集第一张
const previewPost = computed(() => ({
  ...newPost,
  tags: buildPublishTags(),
  coverImage: newMedia.value.find(m => !isVideo(m)) || newMedia.value[0] || '',
  authorName: '我',
  authorAvatar: defaultAvatar
}))

const openModal = () => {
  newPost.title = ''
  newPost.summary = ''
  newPost.location = ''
  newPost.theme = 'editorial'
  newPost.icon = '✍️'
  primaryTag.value = '经验分享'
  topicTags.value = []
  customTopicInput.value = ''
  newMedia.value = []
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const publishPost = async () => {
  if (!newPost.title) {
    alert('先写个标题吧')
    return
  }
  if (!newPost.summary.trim()) {
    alert('内容也写一点吧，哪怕只是随便说说')
    return
  }
  if (publishing.value) return
  publishing.value = true
  // 封面自动取图集第一张（图片优先；若第一张是视频也直接用，详情页会播放）
  const firstImage = newMedia.value.find(m => !isVideo(m)) || newMedia.value[0] || ''
  try {
    const res = await http.post('/experience/publish', {
    title: newPost.title,
    summary: newPost.summary,
      location: newPost.location.trim(),
    icon: newPost.icon,
      theme: newPost.theme,
      tags: buildPublishTags().join(','),
      coverImage: firstImage,
      media: newMedia.value.length ? JSON.stringify(newMedia.value) : null
    })
    if (res.status === 200 || res.code === 200) {
  closeModal()
      await loadPosts()
    } else {
      alert(res.message || '发布失败')
    }
  } catch (e) {
    alert('发布失败，检查网络')
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.detail-topbar {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
</style>
