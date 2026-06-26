<template>
  <div class="relative h-full bg-[#FBF9F5] flex flex-col overflow-hidden">

    <div ref="listScrollRef" v-show="currentView === 'list'" class="flex-1 overflow-y-auto custom-scroll w-full z-10 relative bg-[#FBF9F5] flex flex-col">

      <!-- ============ 朋友圈封面 Hero ============ -->
      <div class="shrink-0 relative">
        <!-- 封面图 -->
        <div class="relative h-[calc(9.5rem+env(safe-area-inset-top,0px))] overflow-hidden">
          <img :src="myCard.cover" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>

          <!-- 封面右上：创建入口 -->
          <div class="absolute top-[calc(env(safe-area-inset-top,0px)+0.75rem)] right-4 z-10 flex items-center gap-2">
            <button type="button" @click="openPaperBoat" class="w-10 h-10 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="星河漂流">
              <i class="ri-ship-line text-base"></i>
            </button>
            <button type="button" @click.stop.prevent="toggleQuickCreateMenu" class="w-10 h-10 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="创建">
              <i class="ri-add-line text-[22px] transition-transform" :class="{ 'rotate-45': showQuickCreateMenu }"></i>
            </button>

          </div>

          <!-- 右下：用户信息 -->
          <div class="absolute bottom-3 left-4 right-4 z-10">
            <div class="flex items-end justify-between gap-3">
              <div class="min-w-0">
                <p class="text-white/70 text-[10px] font-bold tracking-wide mb-0.5">我的主页</p>
                <h2 class="text-white text-[20px] font-bold tracking-tight leading-tight drop-shadow-md">{{ myCard.name }}</h2>
                <p class="text-white/85 text-[11.5px] font-medium tracking-wide drop-shadow-sm mt-0.5 line-clamp-2">{{ myCard.sign || '写一句自己的签名，让病友更快认识你' }}</p>
              </div>
              <button @click="openProfileConfig" class="shrink-0 px-3 py-2 rounded-2xl bg-white/16 backdrop-blur-md border border-white/20 text-white text-[11px] font-black active:scale-95 transition-all">
                编辑主页
              </button>
            </div>
          </div>

        </div>

        <!-- 档案框标题 -->
        <TabPageHeader
          title="战术小队"
          accent="indigo"
        />

      </div>

      <!-- ============ Tab Pills ============ -->
      <div class="sticky top-0 shrink-0 px-5 pt-3 pb-3 z-30 bg-[#FBF9F5]/90 backdrop-blur-xl border-b border-stone-200/40">
        <div class="flex bg-white/70 backdrop-blur-xl p-1 rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-white/80 gap-0.5">
          <button @click="currentTab = 'status'" :class="currentTab === 'status' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
            状态
          </button>
          <button @click="currentTab = 'chat'" :class="currentTab === 'chat' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all relative">
            会话
            <span v-if="hasUnreadChats" class="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          </button>
          <button @click="currentTab = 'contacts'" :class="currentTab === 'contacts' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all relative">
            联络人
            <span v-if="pendingRequests.length" class="absolute top-1 right-3 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black leading-4">
              {{ pendingRequests.length > 9 ? '9+' : pendingRequests.length }}
            </span>
          </button>
          <button @click="currentTab = 'moments'" :class="currentTab === 'moments' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
            动态
          </button>
        </div>
      </div>

      <div class="px-5 pb-12 pt-1 flex-1 z-10 bg-transparent">

        <!-- ============ 状态墙 ============ -->
        <div v-show="currentTab === 'status'" class="-mx-5">
          <StatusBoard>
            <!-- 痛痛共鸣舱：插在「拉响警报」那一排下面 -->
            <template #after-stats>
              <PainResonanceChamber :city="myCard.city || myCity" />
            </template>
          </StatusBoard>
        </div>

        <!-- ============ 动态 Feed（纯净列表流）============ -->
        <div v-show="currentTab === 'moments'" class="space-y-3.5 pt-1">
          <section class="relative overflow-hidden rounded-[28px] bg-white/82 backdrop-blur-xl p-4 border border-white/90 shadow-[0_12px_34px_-26px_rgba(15,23,42,0.35)]">
            <div class="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-blue-100/70 blur-2xl pointer-events-none"></div>
            <div class="relative z-10 flex items-center gap-3">
              <button @click="openMyMoments" class="relative shrink-0 active:scale-95 transition-all" aria-label="打开我的动态">
                <img :src="myCard.avatar" class="w-[54px] h-[54px] rounded-[20px] border-[3px] border-white shadow-md bg-white object-cover" />
                <span class="absolute -right-1 -bottom-1 w-7 h-7 rounded-2xl bg-slate-950 text-white border-[3px] border-white flex items-center justify-center shadow-md">
                  <i class="ri-camera-lens-line text-[13px]"></i>
                </span>
              </button>
              <button @click="openMyMoments" class="flex-1 min-w-0 text-left active:scale-[0.99] transition-all">
                <p class="text-[10px] font-black tracking-[0.16em] text-blue-500">我的动态</p>
                <h3 class="text-[17px] font-black tracking-tight truncate mt-0.5 text-slate-950">{{ myCard.name }}</h3>
                <p class="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">{{ myCard.sign || '还没有写个人签名' }}</p>
              </button>
              <button @click="openComposerFromQuickMenu" class="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center active:scale-90 transition-all shrink-0 shadow-md">
                <i class="ri-add-line text-[22px]"></i>
              </button>
            </div>
          </section>

          <!-- Feed -->
          <article
              v-for="post in moments"
              :key="post.id"
              class="bg-white rounded-[24px] p-5 border border-stone-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)] transition-shadow"
          >
            <!-- Header -->
            <header class="flex items-start gap-3 mb-3">
              <button @click.stop="openImageViewer([post.user.avatar], 0)" class="relative shrink-0 active:scale-95 transition-all" aria-label="放大头像">
                <img :src="post.user.avatar" class="w-11 h-11 rounded-2xl border border-white shadow-sm bg-stone-100" />
                <span v-if="post.user.online" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </button>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button @click.stop="openUserProfile(post.userId)" class="text-[14.5px] font-black text-slate-900 tracking-tight active:text-blue-600 transition-colors text-left">{{ post.user.name }}</button>
                  <span v-if="post.user.stage" class="text-[9.5px] font-black px-1.5 py-0.5 rounded-md tracking-wider" :class="stageStyle(post.user.stage)">{{ post.user.stage }}</span>
                </div>
                <p class="text-[10.5px] text-slate-400 font-medium mt-1 tracking-wide flex items-center gap-1.5">
                  <span>{{ post.time }}</span>
                  <span v-if="post.device" class="flex items-center gap-0.5"><span class="w-0.5 h-0.5 rounded-full bg-slate-300"></span> {{ post.device }}</span>
                </p>
              </div>
              <div v-if="post.isMine" class="flex items-center gap-1 -mr-1 -mt-1">
                <button
                  @click="editMoment(post)"
                  class="w-7 h-7 rounded-full text-slate-300 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center active:scale-90 transition-all"
                  aria-label="编辑动态"
                >
                  <i class="ri-edit-2-line text-[14px]"></i>
                </button>
                <button
                  @click="deleteMoment(post)"
                  class="w-7 h-7 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center active:scale-90 transition-all"
                  aria-label="删除动态"
                >
                  <i class="ri-delete-bin-6-line text-[14px]"></i>
                </button>
              </div>
              <button v-else class="text-slate-300 hover:text-slate-600 transition-all active:scale-90 -mr-1 -mt-1 p-1">
                <i class="ri-more-2-fill text-lg"></i>
              </button>
            </header>

            <!-- 文本内容 -->
            <p class="text-[13.5px] text-slate-700 leading-[1.7] whitespace-pre-line mb-3">{{ post.content }}</p>

            <!-- 图片 / 视频（朋友圈九宫格） -->
            <div v-if="post.images && post.images.length" :class="imageGridClass(post.images.length)" class="grid gap-1 mb-3">
              <div
                  v-for="(img, i) in post.images"
                  :key="i"
                  :class="post.images.length === 1 ? 'aspect-[4/3] max-h-[280px]' : 'aspect-square'"
                  class="relative overflow-hidden rounded-xl bg-stone-100 hover:opacity-95 transition-opacity"
              >
                <video v-if="isVideo(img)" :src="img" class="w-full h-full object-cover" controls playsinline preload="metadata"></video>
                <img v-else :src="img" @click="openImageViewer(post.images, i)" class="w-full h-full object-cover cursor-pointer" loading="lazy" />
                <span v-if="isVideo(img) && post.images.length > 1" class="absolute top-1.5 left-1.5 text-[9px] font-black text-white bg-black/45 px-1.5 py-0.5 rounded-full pointer-events-none">
                  <i class="ri-play-mini-fill"></i> 视频
                </span>
              </div>
            </div>

            <!-- 位置标签 + 可见范围 -->
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <div v-if="post.location" class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                <i class="ri-map-pin-2-fill text-[12px]"></i> {{ post.location }}
              </div>
              <div class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md" :class="momentVisibilityMeta(post.visibility).class">
                <i :class="momentVisibilityMeta(post.visibility).icon" class="text-[12px]"></i>
                {{ momentVisibilityMeta(post.visibility).label }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-2.5 border-t border-stone-50">
              <span class="text-[10px] font-bold text-slate-400 tracking-wide">{{ post.likesCount }} 共鸣 · {{ post.comments.length }} 回复</span>
              <div class="flex items-center gap-1">
                <button
                    @click="toggleLike(post)"
                    class="flex items-center gap-1 text-[11.5px] font-black transition-all active:scale-90 px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
                    :class="post.liked ? 'text-rose-500' : 'text-slate-400'"
                >
                  <i :class="post.liked ? 'ri-heart-fill' : 'ri-heart-line'" class="text-base"></i>
                  <span>{{ post.likesCount }}</span>
                </button>
                <button @click="post.showCommentBox = !post.showCommentBox" class="flex items-center gap-1 text-[11.5px] font-black transition-all active:scale-90 px-2.5 py-1.5 rounded-lg hover:bg-blue-50" :class="post.showCommentBox ? 'text-blue-500' : 'text-slate-400'">
                  <i class="ri-chat-3-line text-base"></i>
                  <span>{{ post.comments.length }}</span>
                </button>
                <button class="text-slate-400 hover:text-slate-700 active:scale-90 transition-all p-1.5 rounded-lg hover:bg-slate-50">
                  <i class="ri-share-forward-line text-base"></i>
                </button>
              </div>
            </div>

            <!-- 点赞 + 评论盒子 -->
            <div v-if="(post.likes && post.likes.length) || post.comments.length" class="bg-stone-50/70 -mx-2 mt-3 rounded-2xl p-3.5 space-y-2.5">
              <!-- 点赞行 -->
              <div v-if="post.likes && post.likes.length" class="flex items-start gap-2">
                <i class="ri-heart-fill text-rose-400 text-sm mt-0.5 shrink-0"></i>
                <div class="text-[11.5px] text-slate-500 font-medium leading-relaxed">
                  <template v-for="(like, i) in post.likes" :key="like.name">
                    <span class="text-slate-700 font-black">{{ like.name }}</span><span v-if="i < post.likes.length - 1">, </span>
                  </template>
                  <span v-if="post.likesCount > post.likes.length"> 等 <span class="font-bold">{{ post.likesCount }}</span> 人</span>
                </div>
              </div>

              <!-- 分隔线 -->
              <div v-if="post.likes && post.likes.length && post.comments.length" class="h-px bg-stone-200/60"></div>

              <!-- 评论 -->
              <div v-if="post.comments.length" class="space-y-1.5">
                <div v-for="(c, i) in post.comments" :key="i" class="text-[12px] text-slate-700 leading-relaxed">
                  <span class="font-black text-blue-600">{{ c.user }}</span><span class="text-slate-400">: </span>{{ c.content }}
                </div>
              </div>
            </div>

            <!-- 评论输入框 -->
            <div v-if="post.showCommentBox" class="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                v-model="post.commentInput"
                @keydown.enter="submitComment(post)"
                type="text"
                placeholder="说点什么暖暖对方..."
                class="flex-1 bg-stone-50 rounded-full px-4 py-2 text-[12.5px] outline-none border border-stone-100 focus:border-blue-300 focus:bg-white transition-all"
              >
              <button @click="submitComment(post)" :disabled="!post.commentInput || !post.commentInput.trim()" class="px-4 py-2 rounded-full text-[12px] font-bold text-white bg-blue-600 shadow-sm active:scale-95 transition-all disabled:bg-slate-300">
                发送
              </button>
            </div>
          </article>

          <!-- 加载更多占位 -->
          <div class="text-center py-6 text-[11px] text-slate-300 font-bold tracking-widest uppercase">
            · 没有更多动态了 ·
          </div>
        </div>

        <div v-show="currentTab === 'chat'">
          <div v-if="chatList.length === 0" class="text-center py-16 text-[13px] text-slate-400 font-bold">
            还没有会话,去联络人加个好友或点右上角「创建小队」吧 💬
          </div>
          <div v-else class="mb-4">
            <div class="flex items-center gap-2 bg-white/70 border border-white/80 rounded-[22px] px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
              <i class="ri-search-line text-slate-400 text-lg"></i>
              <input v-model="chatSearchKeyword" type="text" placeholder="搜索联系人、小队或聊天内容" class="flex-1 bg-transparent text-[13.5px] font-bold text-slate-700 placeholder:text-slate-400 outline-none">
              <button v-if="chatSearchKeyword" @click="chatSearchKeyword = ''" class="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center active:scale-90 transition-all">
                <i class="ri-close-line text-sm"></i>
              </button>
            </div>
            <p v-if="isChatHistorySearching" class="mt-2 text-[11px] text-slate-400 font-bold px-2">
              正在搜索历史消息...
            </p>
          </div>
          <div v-if="chatList.length > 0 && !isChatHistorySearching && filteredChatList.length === 0" class="text-center py-12 text-[13px] text-slate-400 font-bold">
            没找到对应会话，换个关键词试试 🔍
          </div>
          <div v-for="item in filteredChatList" :key="item.type + '-' + item.id" @click="openChat(item)" class="group mb-4 p-4 flex items-center cursor-pointer bg-white/50 backdrop-blur-lg rounded-[28px] border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] hover:-translate-y-0.5 transition-all duration-400 active:scale-[0.98]">
            <div class="relative">
              <img :src="item.avatar" class="w-[56px] h-[56px] rounded-[22px] object-cover shrink-0 shadow-sm border-2 border-white transition-transform duration-500 group-hover:scale-105 group-hover:border-blue-100">
              <div v-if="item.type === 'group'" class="absolute -bottom-0.5 -right-0.5 px-1 h-4 bg-violet-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <i class="ri-team-fill text-white text-[8px]"></i>
              </div>
              <div v-else class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div class="ml-4 flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <h3 class="text-[16px] font-bold text-slate-900 truncate flex items-center gap-1.5">
                  {{ item.name }}
                  <span v-if="item.type === 'group'" class="text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded font-black shrink-0">小队 {{ item.memberCount }}</span>
                </h3>
                <span class="text-[11px] text-slate-400 font-bold shrink-0">{{ item.time }}</span>
              </div>
              <div class="flex justify-between items-center mt-0.5">
                <p class="text-[13px] font-medium text-slate-500 truncate pr-3">{{ item.lastMsg }}</p>
                <div v-if="item.unread" class="min-w-[20px] h-[20px] px-1.5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                  <span class="text-[10px] font-black text-white">{{ item.unread }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'contacts'" class="space-y-5">
          <!-- 快捷操作：发起密聊 / 创建小队 / 群发广播 -->
          <div class="grid grid-cols-3 gap-2.5">
            <button @click="openFriendPicker" class="flex flex-col items-center gap-1.5 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] active:scale-95 transition-all">
              <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><i class="ri-chat-private-line text-lg"></i></span>
              <span class="text-[11.5px] font-black text-slate-700">发起密聊</span>
            </button>
            <button @click="openCreateGroup" class="flex flex-col items-center gap-1.5 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] active:scale-95 transition-all">
              <span class="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center"><i class="ri-team-line text-lg"></i></span>
              <span class="text-[11.5px] font-black text-slate-700">创建小队</span>
            </button>
            <button @click="openBroadcast" class="flex flex-col items-center gap-1.5 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] active:scale-95 transition-all">
              <span class="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"><i class="ri-broadcast-line text-lg"></i></span>
              <span class="text-[11.5px] font-black text-slate-700">群发广播</span>
            </button>
          </div>

          <div class="relative overflow-hidden bg-[#111827] p-5 rounded-[30px] border border-white/10 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.85)] mb-5 text-white">
            <div class="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-gradient-to-br from-amber-200/30 via-rose-200/20 to-indigo-300/20 blur-2xl"></div>
            <div class="absolute -left-10 bottom-0 w-40 h-24 rounded-full bg-cyan-300/10 blur-2xl"></div>
            <div class="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"></div>

            <div class="relative z-10 space-y-4">
              <div class="flex items-center justify-between">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[10px] font-black tracking-[0.16em] text-white/65 mb-2">
                    认识朋友
                    <span class="w-1 h-1 rounded-full bg-emerald-300"></span>
                    慢慢来
                  </div>
                  <h3 class="text-white text-[20px] font-black tracking-tight mb-1 flex items-center gap-2">
                    有限遇见
                  </h3>
                </div>
                <div class="shrink-0 w-14 h-14 rounded-[22px] bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-cyan-100 text-slate-950 flex items-center justify-center shadow-[0_0_28px_rgba(255,255,255,0.24)]">
                    <i class="ri-compass-3-line text-xl"></i>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  @click="manualRefreshLocation"
                  :disabled="isLocating"
                  class="min-w-0 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-[13px] font-black flex items-center justify-between gap-2"
                  :class="myCity ? 'text-white' : 'text-white/45'"
                >
                  <span class="truncate">{{ cityDisplay || '当前城市' }}</span>
                  <i :class="isLocating ? 'ri-loader-4-line animate-spin' : 'ri-shield-check-line'" class="text-base text-white/45 shrink-0"></i>
                </button>
              </div>

              <div class="rounded-[24px] bg-white/10 border border-white/10 p-3.5 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[13px] font-black text-white">允许被遇见</p>
                  </div>
                  <button
                    @click="toggleDiscoveryEnabled"
                    :disabled="discoverySaving"
                    class="relative w-[52px] h-[30px] rounded-full transition-all shrink-0 active:scale-95 disabled:opacity-60"
                    :class="discoveryEnabled ? 'bg-emerald-400' : 'bg-white/18'"
                  >
                    <span class="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow transition-all" :class="discoveryEnabled ? 'left-[26px]' : 'left-1'"></span>
                  </button>
                </div>

                <textarea
                  v-model="broadcastSign"
                  rows="2"
                  maxlength="60"
                  placeholder="写一段别人刷到你时看到的话，比如：缓解期，想认识能互相鼓劲的人。"
                  class="w-full rounded-2xl bg-white/10 border border-white/10 px-3.5 py-3 text-[12.5px] font-bold text-white placeholder-white/30 outline-none resize-none focus:bg-white/14 transition-all"
                  @blur="saveDiscoverySettings"
                ></textarea>

                <div class="flex items-start gap-2 rounded-2xl bg-white/8 border border-white/10 px-3.5 py-3">
                  <i class="ri-price-tag-3-line text-white/45 text-base mt-0.5"></i>
                  <p class="text-[11px] leading-relaxed text-white/55 font-bold">
                    您的标签会从「我的」里同步展示，这里只写一句遇见宣言。
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <button
                  @click="openDiscovery('city')"
                  class="min-h-[78px] rounded-[22px] bg-white/10 border border-white/10 text-white active:scale-95 transition-all flex flex-col items-start justify-center px-4 text-left"
                >
                  <span class="w-8 h-8 rounded-2xl bg-white/15 text-cyan-100 flex items-center justify-center mb-2"><i class="ri-map-pin-user-line"></i></span>
                  <span class="text-[13px] font-black">同城精选</span>
                </button>
                <button
                  @click="openDiscovery('distant')"
                  class="min-h-[78px] rounded-[22px] bg-white/10 border border-white/10 text-white active:scale-95 transition-all flex flex-col items-start justify-center px-4 text-left"
                >
                  <span class="w-8 h-8 rounded-2xl bg-white/15 text-amber-100 flex items-center justify-center mb-2"><i class="ri-route-line"></i></span>
                  <span class="text-[13px] font-black">远方朋友</span>
                </button>
              </div>
            </div>
          </div>

          <div ref="addFriendCardRef" class="bg-white/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/80 shadow-sm">
            <div class="flex items-center justify-between gap-3 mb-4">
              <h3 class="text-[12px] font-black text-blue-600 tracking-widest uppercase flex items-center gap-1"><i class="ri-search-2-line"></i> 搜索 / 添加好友</h3>
              <button @click="copyMyId" class="shrink-0 inline-flex items-center gap-1 text-[10.5px] font-black text-slate-500 bg-white/80 border border-slate-100 px-2.5 py-1.5 rounded-full active:scale-95 transition-all">
                我的编号 {{ myId }}
                <i class="ri-file-copy-line"></i>
              </button>
            </div>
            <div class="flex items-center gap-3">
              <input ref="friendSearchInputRef" v-model="friendSearchKeyword" @keydown.enter="searchUsers" type="text" placeholder="输入昵称或对方编号..." class="flex-1 bg-white/80 rounded-full px-5 py-3 text-[14px] font-medium outline-none border border-white focus:border-blue-300 focus:shadow-md transition-all">
              <button @click="searchUsers" :disabled="isSearching" class="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg hover:bg-slate-800 active:scale-90 transition-all disabled:bg-slate-400">
                <i class="ri-search-line text-xl" :class="{ 'animate-pulse': isSearching }"></i>
              </button>
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="mt-4 space-y-2.5">
              <div v-for="u in searchResults" :key="u.userId" class="flex items-center justify-between p-2.5 rounded-2xl bg-white/80 border border-stone-100">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="avatarOf(u, u.userId)" class="w-10 h-10 rounded-2xl border border-white shadow-sm shrink-0">
                  <div class="min-w-0">
                    <h4 class="text-[14px] font-bold text-slate-800 truncate">{{ u.nickname || '神秘特工' }}</h4>
                    <p class="text-[10.5px] text-slate-400 font-medium">编号：{{ u.userId }}<span v-if="u.city"> · {{ u.city }}</span></p>
                  </div>
                </div>
                <button
                  @click="sendFriendRequest(u.userId, { user: u })"
                  :disabled="u.requested || u.isFriend"
                  class="px-4 py-2 text-white text-[12px] font-bold rounded-full shadow-md active:scale-95 transition-all shrink-0 disabled:bg-slate-300 disabled:shadow-none"
                  :class="(u.requested || u.isFriend) ? 'bg-slate-300' : 'bg-blue-600 shadow-blue-500/20'"
                >
                  <i :class="(u.requested || u.isFriend) ? 'ri-check-line' : 'ri-user-add-line'"></i> {{ u.isFriend ? '已是好友' : (u.requested ? '已发送' : '加好友') }}
                </button>
              </div>
            </div>
            <p v-else-if="searchDone" class="mt-4 text-center text-[12px] text-slate-400 font-bold py-2">没找到这个人，换个昵称或编号试试 🔍</p>
          </div>

          <div v-if="pendingRequests.length > 0">
            <h3 class="text-[12px] font-black text-slate-400 tracking-widest uppercase mb-3 px-2">新请求接入</h3>
            <div v-for="req in pendingRequests" :key="req.id" class="bg-white/50 backdrop-blur-lg rounded-[28px] p-4 flex items-center justify-between border border-white/60 shadow-sm mb-3 gap-3">
              <button @click="openUserProfile(req.friendId || req.userId || req.requesterId)" class="flex items-center gap-3 min-w-0 text-left active:scale-[0.99] transition-all">
                <img :src="avatarOf(req, req.id)" class="w-[46px] h-[46px] rounded-[18px] object-cover border-2 border-white shadow-sm">
                <div class="min-w-0">
                  <h4 class="text-[15px] font-bold text-slate-800">{{ req.nickname || '神秘特工' }}</h4>
                  <p class="text-[11px] text-slate-500 font-medium">想和你成为朋友 · 点头像看主页</p>
                </div>
              </button>
              <button @click.stop="acceptRequest(req.friendshipId || req.id)" class="px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[13px] font-bold rounded-full shadow-md shadow-emerald-500/30 hover:shadow-lg active:scale-95 transition-all shrink-0">
                授权
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <SocialQuickCreateMenu
      :show="showQuickCreateMenu"
      @close="showQuickCreateMenu = false"
      @add-friend="openAddFriendShortcut"
      @compose="openComposerFromQuickMenu"
    />

    <transition name="slide-right">
      <div v-if="currentView === 'chat'" class="fixed inset-0 flex flex-col bg-[#FAFAFA] z-[100] overflow-hidden">

        <header class="shrink-0 mt-[env(safe-area-inset-top,0px)] px-4 py-3 flex items-center gap-3 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 z-20 relative">

          <button @click="closeChat" class="w-9 h-9 flex items-center justify-center -ml-1.5 text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-90 shrink-0">
            <i class="ri-arrow-left-line text-[22px]"></i>
          </button>

          <button @click="activeChat?.type === 'group' ? openMemberPanel() : openUserProfile(activeChat?.id)" class="flex-1 flex items-center gap-3 min-w-0 text-left active:scale-[0.99] transition-all">
            <div class="relative shrink-0">
              <img :src="activeChat?.avatar" class="w-9 h-9 rounded-full object-cover">
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <h2 class="text-[15px] font-semibold text-slate-900 leading-tight truncate">{{ activeChat?.name }}</h2>
              <span class="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{{ activeChat?.type === 'group' ? (activeChat?.memberCount || 0) + ' 位成员' : '在线' }}</span>
            </div>
          </button>

          <button v-if="activeChat?.type === 'group'" @click="openMemberPanel" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all active:scale-90 shrink-0">
            <i class="ri-settings-3-line text-[20px]"></i>
          </button>
        </header>

        <div id="chat-container" class="flex-1 overflow-y-auto px-4 pt-5 pb-4 custom-scroll overscroll-none relative">

          <div class="flex justify-center mb-5">
            <span class="text-[11px] text-slate-400 font-medium px-3 py-1 bg-white/60 rounded-full">今天</span>
          </div>

          <div v-for="(msg, index) in chatHistory" :key="msg.id || index" class="flex flex-col mb-2.5" :class="msg.senderId === myId ? 'items-end' : 'items-start'">

            <button v-if="msg.senderId !== myId && activeChat?.type === 'group'" @click="openUserProfile(msg.senderId)" class="text-[10px] text-slate-400 font-bold mb-0.5 ml-1 text-left active:text-blue-500 transition-colors">{{ msg.senderName || '队友' }}</button>

            <div v-if="msg.senderId !== myId" class="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-md text-[14.5px] max-w-[78%] leading-relaxed border border-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)]" :class="msg.secret ? 'ring-1 ring-violet-200 bg-violet-50' : ''">
              <img v-if="msg.type === 'image'" :src="msg.content" class="max-w-full rounded-xl" />
              <a v-else-if="msg.type === 'file'" :href="filePayload(msg).url" target="_blank" class="flex items-center gap-2.5 min-w-[190px]">
                <span class="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><i class="ri-file-3-line text-xl"></i></span>
                <span class="min-w-0">
                  <span class="block text-[13px] font-black truncate">{{ filePayload(msg).name }}</span>
                  <span class="block text-[10px] text-slate-400 font-bold mt-0.5">{{ filePayload(msg).sizeText || '文件' }}</span>
                </span>
              </a>
              <span v-else-if="msg.secret">🔒 {{ msg.content }}</span>
              <span v-else>{{ msg.content }}</span>
              <p v-if="msg.secret" class="text-[10px] text-violet-400 font-bold mt-1">密聊消息，10 秒后消失</p>
            </div>

            <div v-else class="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-md text-[14.5px] max-w-[78%] leading-relaxed shadow-[0_1px_2px_rgba(37,99,235,0.15)]" :class="msg.secret ? 'bg-violet-600' : ''">
              <img v-if="msg.type === 'image'" :src="msg.content" class="max-w-full rounded-xl" />
              <a v-else-if="msg.type === 'file'" :href="filePayload(msg).url" target="_blank" class="flex items-center gap-2.5 min-w-[190px] text-white">
                <span class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><i class="ri-file-3-line text-xl"></i></span>
                <span class="min-w-0">
                  <span class="block text-[13px] font-black truncate">{{ filePayload(msg).name }}</span>
                  <span class="block text-[10px] text-white/70 font-bold mt-0.5">{{ filePayload(msg).sizeText || '文件' }}</span>
                </span>
              </a>
              <span v-else-if="msg.secret">🔒 {{ msg.content }}</span>
              <span v-else>{{ msg.content }}</span>
              <p v-if="msg.secret" class="text-[10px] text-white/70 font-bold mt-1">不保存 · 10 秒后消失</p>
            </div>
          </div>
        </div>

        <div class="shrink-0 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+8px)] bg-white/80 backdrop-blur-xl border-t border-slate-100/80 relative">
          <div v-if="secretMode" class="mb-2 mx-1 rounded-2xl bg-violet-50 border border-violet-100 px-3 py-2 text-[11px] font-black text-violet-600 flex items-center justify-between gap-2">
            <span><i class="ri-lock-2-fill"></i> 密聊中：不保存，10 秒后消失</span>
            <button @click="secretMode = false" class="text-violet-400 active:scale-95">退出</button>
          </div>

          <div class="flex items-end gap-2">
            <button @click="showPlusMenu = !showPlusMenu; showEmojiMenu = false" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-slate-100 active:scale-90" :class="showPlusMenu ? 'rotate-45 text-blue-600 bg-blue-50' : 'text-slate-500'">
              <i class="ri-add-line text-[24px] transition-transform"></i>
            </button>

            <div class="flex-1 bg-slate-100/80 rounded-3xl flex items-center min-h-[40px] focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 transition-all">
              <input v-model="inputMsg" @keydown.enter="sendMessage" @focus="showPlusMenu = false; showEmojiMenu = false" type="text" :placeholder="secretMode ? '密聊：不会保存，10 秒后消失' : '输入消息...'" class="w-full bg-transparent px-4 py-2.5 text-[14.5px] outline-none placeholder-slate-400 text-slate-800">
              <button @click="showEmojiMenu = !showEmojiMenu; showPlusMenu = false" class="p-2.5 mr-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                <i class="ri-emotion-line text-[20px]"></i>
              </button>
            </div>

            <button @click="sendMessage" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90" :class="inputMsg.trim() ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-300'" :disabled="!inputMsg.trim()">
              <i class="ri-arrow-up-line text-[20px] font-bold"></i>
            </button>
          </div>

          <div v-show="showEmojiMenu" class="px-2 pt-4 pb-2 mt-2 border-t border-slate-100">
            <div class="grid grid-cols-7 gap-y-3 gap-x-2">
              <button v-for="emoji in emojis" :key="emoji" @click="appendEmoji(emoji)" class="text-[24px] hover:scale-110 transition-transform active:scale-90 py-1">
                {{ emoji }}
              </button>
            </div>
          </div>

          <div v-show="showPlusMenu" class="grid grid-cols-4 gap-y-5 pt-5 pb-3 mt-2 border-t border-slate-100">
            <div v-for="item in plusMenuItems" :key="item.label" @click="handlePlusItem(item)" class="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100 transition-all">
                <i :class="[item.icon, item.color, 'text-[22px]']"></i>
              </div>
              <span class="text-[11px] text-slate-500 font-medium">{{ item.label }}</span>
            </div>
          </div>
          <input id="chat-album-input" type="file" accept="image/*" class="hidden" @change="sendImageFile" />
          <input id="chat-camera-input" type="file" accept="image/*" capture="environment" class="hidden" @change="sendImageFile" />
          <input id="chat-file-input" type="file" class="hidden" @change="sendGenericFile" />

        </div>
      </div>
    </transition>

    <transition name="fade-up">
      <div v-if="showRadarModal" class="city-picks-page fixed inset-0 z-[120] flex flex-col overflow-hidden font-sans text-slate-950">
        <div class="city-picks-orb city-picks-orb-a"></div>
        <div class="city-picks-orb city-picks-orb-b"></div>

        <header class="relative z-20 px-5 pt-[calc(env(safe-area-inset-top,16px)+12px)] pb-3 flex items-center justify-between">
          <button @click="closeCityPicks" class="h-9 px-3 rounded-full bg-white/72 backdrop-blur-xl border border-white/70 text-slate-700 text-[12px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm">
            <i class="ri-arrow-left-s-line text-lg"></i> 返回
          </button>
          <div class="text-center">
            <h2 class="text-[15px] font-black tracking-tight text-slate-900">{{ discoveryTitle }}</h2>
          </div>
          <button @click="showSeenPicksPanel = true" class="h-9 px-3 rounded-full bg-white/72 backdrop-blur-xl border border-white/70 text-slate-600 text-[12px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm">
            <i class="ri-history-line"></i> 已看 {{ seenDiscoveryPicks.length }}
          </button>
        </header>

        <main class="relative z-10 flex-1 overflow-y-auto custom-scroll overscroll-none px-5 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+28px)]">
          <section class="relative overflow-hidden rounded-[34px] bg-slate-950 text-white p-6 mb-4 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.95)]">
            <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-200/20 blur-2xl"></div>
            <div class="absolute -left-10 bottom-0 w-44 h-24 rounded-full bg-cyan-300/15 blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-8 h-8 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <i class="ri-sparkling-2-line text-amber-100"></i>
                </span>
                <span class="text-[11px] font-black tracking-[0.16em] text-white/55">还能打招呼 {{ discoveryGreetRemaining }} 次</span>
              </div>
              <h1 class="text-[28px] font-black tracking-tight leading-[1.08] whitespace-pre-line">{{ discoveryHeroTitle }}</h1>
              <div class="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-2 text-[11px] font-black text-white/72">
                <i :class="discoveryMode === 'city' ? 'ri-map-pin-user-line' : 'ri-route-line'" class="text-amber-100"></i>
                {{ discoveryScopeText }}
              </div>
            </div>
          </section>

          <section class="space-y-3.5">
            <div v-if="isCityPicksLoading" class="space-y-3.5">
              <div v-for="i in 3" :key="i" class="rounded-[28px] bg-white/72 border border-white/80 p-4 shadow-sm animate-pulse">
                <div class="flex gap-3">
                  <div class="w-14 h-14 rounded-2xl bg-slate-200"></div>
                  <div class="flex-1 space-y-2 py-1">
                    <div class="h-4 w-28 rounded-full bg-slate-200"></div>
                    <div class="h-3 w-full rounded-full bg-slate-100"></div>
                    <div class="h-3 w-2/3 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentDiscoveryPick" class="space-y-4">
              <article
                :key="currentDiscoveryPick.id"
                class="city-pick-card discovery-profile-card relative overflow-hidden rounded-[36px] bg-white/82 backdrop-blur-xl border border-white/90 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.9)]"
              >
                <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-indigo-100 via-rose-50 to-amber-100"></div>
                <div class="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/50 blur-2xl"></div>
                <div class="relative p-5 pt-7">
                  <div class="flex items-center justify-between mb-8">
                    <span class="rounded-full bg-white/70 border border-white px-3 py-1.5 text-[10.5px] font-black text-slate-500 shadow-sm">
                      {{ discoveryProgressText }}
                    </span>
                    <span class="rounded-full bg-slate-950/88 text-white px-3 py-1.5 text-[10.5px] font-black shadow-sm">
                      {{ currentDiscoveryPick.distance }}
                    </span>
                  </div>

                  <div class="flex flex-col items-center text-center">
                    <div class="relative">
                      <img :src="currentDiscoveryPick.avatar" class="w-28 h-28 rounded-[36px] object-cover bg-slate-100 border-[5px] border-white shadow-[0_22px_46px_-24px_rgba(15,23,42,0.9)]">
                      <span class="absolute -right-1 bottom-2 w-8 h-8 rounded-2xl bg-emerald-400 border-[3px] border-white flex items-center justify-center shadow-lg">
                        <i class="ri-check-line text-white text-[16px]"></i>
                      </span>
                    </div>
                    <h3 class="mt-4 text-[26px] font-black text-slate-950 tracking-tight">{{ currentDiscoveryPick.name }}</h3>
                    <p class="mt-2 max-w-[17rem] text-[13.5px] text-slate-500 font-semibold leading-relaxed">
                      {{ currentDiscoveryPick.sign }}
                    </p>

                    <div v-if="currentDiscoveryPick.statusChips?.length" class="grid grid-cols-1 gap-1.5 mt-4 w-full max-w-[18rem]">
                      <span v-for="chip in currentDiscoveryPick.statusChips" :key="chip" class="rounded-2xl bg-white/75 border border-white text-slate-600 px-3 py-2 text-[11.5px] font-black shadow-sm">
                        {{ chip }}
                      </span>
                    </div>

                    <div v-if="currentDiscoveryPick.tags?.length" class="flex flex-wrap justify-center gap-1.5 mt-3">
                      <span v-for="tag in currentDiscoveryPick.tags" :key="tag" class="rounded-full bg-stone-100/90 text-slate-600 px-3 py-1.5 text-[11px] font-black">
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-6">
                    <button @click="skipCurrentDiscoveryPick" class="py-3 rounded-2xl bg-slate-100/90 text-slate-500 text-[12px] font-black active:scale-95 transition-all flex flex-col items-center gap-1">
                      <i class="ri-arrow-go-forward-line text-[18px]"></i>
                      下一个
                    </button>
                    <button @click="openDiscoveryProfile(currentDiscoveryPick)" class="py-3 rounded-2xl bg-white text-slate-700 border border-slate-100 text-[12px] font-black active:scale-95 transition-all flex flex-col items-center gap-1 shadow-sm">
                      <i class="ri-camera-lens-line text-[18px]"></i>
                      朋友圈
                    </button>
                    <button
                      @click="greetCityPick(currentDiscoveryPick)"
                      :disabled="currentDiscoveryPick.requested || discoveryGreetRemaining <= 0"
                      class="py-3 rounded-2xl text-[12px] font-black active:scale-95 transition-all flex flex-col items-center gap-1"
                      :class="currentDiscoveryPick.requested ? 'bg-emerald-50 text-emerald-600' : (discoveryGreetRemaining <= 0 ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white shadow-[0_14px_26px_-20px_rgba(15,23,42,0.9)]')"
                    >
                      <i :class="currentDiscoveryPick.requested ? 'ri-check-line' : 'ri-user-heart-line'" class="text-[18px]"></i>
                      {{ currentDiscoveryPick.requested ? '已打招呼' : (discoveryGreetRemaining <= 0 ? '已满' : '打招呼') }}
                    </button>
                  </div>

                  <button
                    v-if="currentDiscoveryPick.isFriend"
                    @click="chatWithDiscoveryPick(currentDiscoveryPick)"
                    class="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[12px] font-black active:scale-95 transition-all shadow-[0_16px_30px_-24px_rgba(79,70,229,0.9)]"
                  >
                    <i class="ri-message-3-line mr-1"></i>
                    发一句私信
                  </button>
                </div>
              </article>
            </div>

            <div v-else class="rounded-[32px] bg-white/76 border border-white/90 p-7 text-center shadow-sm">
              <div class="mx-auto w-14 h-14 rounded-[24px] bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <i class="ri-moon-clear-line text-2xl"></i>
              </div>
              <h3 class="text-[18px] font-black text-slate-900 tracking-tight">暂时没有精选</h3>
              <p class="text-[12.5px] text-slate-500 font-medium leading-relaxed mt-2">
                {{ discoveryEmptyText }}
              </p>
              <button @click="closeCityPicks" class="mt-5 px-5 py-3 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all">
                先返回
              </button>
            </div>
          </section>
        </main>
      </div>

    </transition>

    <DiscoverySeenPanel
      :show="showSeenPicksPanel"
      :title="discoveryTitle"
      :picks="seenDiscoveryPicks"
      :greet-remaining="discoveryGreetRemaining"
      @close="showSeenPicksPanel = false"
      @open-profile="openSeenDiscoveryProfile"
      @greet="greetSeenDiscoveryPick"
    />

    <transition name="van-slide-up">
      <div v-if="showProfileConfig" class="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end" @click.self="showProfileConfig = false">
        <div class="bg-white rounded-t-[36px] p-6 h-[85vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative" @click.stop>
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

          <div class="flex justify-between items-center mb-6 mt-4 shrink-0">
            <div>
              <h2 class="text-slate-900 text-[22px] font-black tracking-tight">我的主页</h2>
              <p class="text-slate-500 text-[12px] mt-1">封面、个人签名和标签分开放，不再混成一坨</p>
            </div>
            <button @click="showProfileConfig = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-90 transition-all">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll space-y-8 pb-6">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">主页封面</h3>
              </div>
              <div class="relative h-40 rounded-[26px] overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                <img :src="profileEdit.cover || myCard.cover" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent"></div>
                <button @click="pickProfileCover" class="absolute right-3 bottom-3 px-3.5 py-2 rounded-2xl bg-white text-slate-900 text-[12px] font-black shadow-lg active:scale-95 transition-all">
                  <i class="ri-image-edit-line"></i> 换封面
                </button>
                <input id="profile-cover-input" type="file" accept="image/*" class="hidden" @change="onProfileCoverChange" />
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">个人签名</h3>
              </div>
              <textarea v-model="profileEdit.sign" rows="3" maxlength="80" placeholder="一句话，让别人一眼记住你。"
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-slate-900 focus:bg-white transition-all resize-none"></textarea>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">主页风格</h3>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="style in profileStyleOptions"
                  :key="style.id"
                  @click="profileEdit.style = style.id"
                  class="h-14 rounded-2xl border-2 active:scale-95 transition-all"
                  :class="[style.class, profileEdit.style === style.id ? 'border-slate-950 shadow-lg' : 'border-white']"
                  :aria-label="style.label"
                ></button>
              </div>
            </div>

            <!-- 预览别人眼中的我 -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">别人眼中的我</h3>
              </div>
              <button @click="previewMyProfile"
                      class="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 active:scale-[0.99] transition-all text-left">
                <div class="w-11 h-11 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center text-[20px] shrink-0">
                  <i class="ri-eye-line"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[14px] font-black text-slate-800">预览我的主页</p>
                  <p class="text-[11.5px] text-slate-400 font-medium mt-0.5 leading-snug">看看别人点开你时，看到的样子（爱好在「我的状态」里设置）</p>
                </div>
                <i class="ri-arrow-right-s-line text-slate-300 text-xl shrink-0"></i>
              </button>
            </div>

          </div>

          <div class="shrink-0 pt-4 border-t border-slate-100">
            <button @click="saveProfileConfig" :disabled="isSavingProfileConfig || discoverySaving" class="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black text-[16px] py-4 rounded-[20px] shadow-[0_10px_20px_rgba(15,23,42,0.2)] active:scale-95 transition-all flex justify-center items-center gap-2">
              {{ isSavingProfileConfig || discoverySaving ? '保存中...' : '保存主页' }} <i class="ri-check-line"></i>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <PaperBoatSheet
      :show="showPaperBoatModal"
      :tab="paperBoatTab"
      :quota="paperBoatQuota"
      :hint="paperBoatHint"
      v-model:text="paperBoatText"
      :is-disintegrating="isDisintegrating"
      :scooped-boat="scoopedBoat"
      v-model:reply-text="paperBoatReplyText"
      :gifts="paperBoatGifts"
      v-model:selected-gift="selectedPaperBoatGift"
      :is-responding="isPaperBoatResponding"
      :is-scoop-loading="isScoopLoading"
      :history="paperBoatHistory"
      :is-history-loading="isPaperBoatHistoryLoading"
      :format-time="formatPaperBoatTime"
      :gift-label="paperBoatGiftLabel"
      :get-disintegrate-style="getDisintegrateStyle"
      @close="showPaperBoatModal = false"
      @switch-tab="switchPaperBoatTab"
      @release="disintegratePaperBoat"
      @respond="respondToScooped"
      @breeze="sendBreezeToScooped"
      @scoop="scoopAnother"
      @load-history="loadPaperBoatHistory"
    />

    <!-- ============ 发布动态 Composer · 全屏沉浸（小红书布局）============ -->
    <transition name="page-slide">
      <div v-if="showComposer" class="fixed inset-0 z-[140] bg-white flex flex-col">

        <!-- 顶栏：返回 -->
        <header class="shrink-0 flex items-center h-14 px-2.5 border-b border-slate-50">
          <button @click="closeComposer" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-all">
            <i class="ri-arrow-left-line text-[26px] text-slate-800"></i>
          </button>
        </header>

        <!-- 内容滚动区 -->
        <div class="flex-1 overflow-y-auto custom-scroll px-5 pt-4 pb-6">
          <!-- 带序号的九宫格 -->
          <div class="grid grid-cols-3 gap-2.5 mb-5">
            <div
              v-for="(media, i) in composerImages"
              :key="i"
              class="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.12)]"
            >
              <video v-if="isVideo(media)" :src="media" class="w-full h-full object-cover" muted></video>
              <img v-else :src="media" class="w-full h-full object-cover" />
              <!-- 序号徽章 -->
              <span class="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-slate-900/55 backdrop-blur text-white text-[11px] font-black flex items-center justify-center pointer-events-none">{{ i + 1 }}</span>
              <span v-if="isVideo(media)" class="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white bg-black/45 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 pointer-events-none">
                <i class="ri-play-mini-fill"></i> 视频
              </span>
              <button @click="removeComposerImage(i)" class="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/70 backdrop-blur text-white rounded-full flex items-center justify-center text-[13px] active:scale-90 shadow">
                <i class="ri-close-line"></i>
              </button>
            </div>

            <!-- 添加块 -->
            <button
              v-if="composerImages.length < MAX_MEDIA"
              @click="pickComposerImage"
              class="aspect-square rounded-2xl bg-[#f4f4f6] hover:bg-[#ececf0] active:scale-95 transition-all flex flex-col items-center justify-center text-slate-400"
            >
              <i :class="mediaUploading ? 'ri-loader-4-line animate-spin text-3xl' : 'ri-add-line text-[34px] font-thin'"></i>
              <span class="text-[11px] font-bold mt-0.5">{{ mediaUploading ? '上传中' : composerImages.length + '/' + MAX_MEDIA }}</span>
            </button>
          </div>

          <!-- 标题（选填） -->
          <input
            v-model="composerTitle"
            type="text"
            maxlength="30"
            placeholder="添加标题"
            class="w-full bg-transparent text-slate-900 text-[19px] font-black tracking-tight outline-none placeholder-slate-300 pb-2"
          />
          <div class="h-px bg-slate-100"></div>

          <!-- 正文 -->
          <textarea
            v-model="composerText"
            rows="6"
            placeholder="添加正文…  这一刻的想法、今天的肠子还好吗～"
            class="w-full bg-transparent text-slate-700 text-[15.5px] font-medium leading-[1.8] outline-none resize-none placeholder-slate-300 pt-3"
          ></textarea>

          <p class="text-[11px] text-slate-300 font-medium mb-2">最多 9 张图片 / 视频 · 可一次多选（部分手机/微信内置浏览器需逐张点 +）</p>
          <input id="composer-image-input" type="file" accept="image/*,video/*" multiple class="hidden" @change="onComposerImage" />

          <!-- 功能行：标记地点 / 谁可见 -->
          <div class="mt-4 border-t border-slate-100">
            <button @click="openLocationSheet" class="w-full flex items-center justify-between py-4 active:bg-slate-50 transition-all">
              <span class="flex items-center gap-3 text-[14px] font-bold text-slate-700">
                <i class="ri-map-pin-2-line text-[19px]" :class="composerLocation ? 'text-rose-500' : 'text-slate-400'"></i> 标记地点
              </span>
              <span class="flex items-center gap-1 text-[13px] font-medium" :class="composerLocation ? 'text-rose-500' : 'text-slate-400'">
                <span class="max-w-[150px] truncate">{{ composerLocation || '添加位置' }}</span>
                <i v-if="composerLocation" @click.stop="clearComposerLocation" class="ri-close-circle-fill text-base text-slate-300 ml-0.5"></i>
                <i v-else class="ri-arrow-right-s-line text-lg"></i>
              </span>
            </button>
            <div class="h-px bg-slate-50"></div>
            <button @click="showVisibilitySheet = true" class="w-full flex items-center justify-between py-4 active:bg-slate-50 transition-all">
              <span class="flex items-center gap-3 text-[14px] font-bold text-slate-700">
                <i class="ri-lock-2-line text-[19px] text-slate-400"></i> 谁可见
              </span>
              <span class="flex items-center gap-1 text-[13px] text-slate-500 font-bold">
                {{ visibilityLabel }} <i class="ri-arrow-right-s-line text-lg text-slate-400"></i>
              </span>
            </button>
          </div>
        </div>

        <!-- 底栏：存草稿 / 发布 -->
        <footer class="shrink-0 flex items-center gap-3 px-5 pt-3 pb-7 border-t border-slate-100 bg-white">
          <button @click="closeComposer" class="px-6 py-3.5 rounded-full text-[14px] font-bold text-slate-600 bg-slate-100 active:scale-95 transition-all">
            存草稿
          </button>
          <button
            @click="publishMoment"
            :disabled="isPublishing || mediaUploading"
            class="flex-1 py-3.5 rounded-full text-[15px] font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <i class="ri-send-plane-fill" :class="{ 'animate-pulse': isPublishing }"></i>
            {{ isPublishing ? (editingMomentId ? '保存中...' : '发布中...') : (editingMomentId ? '保存修改' : '发布到密友圈') }}
          </button>
        </footer>

        <!-- 标记地点：底部浮层 -->
        <transition name="fade-up">
          <div v-if="showLocationSheet" class="absolute inset-0 z-[10] bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end" @click.self="showLocationSheet = false">
            <div class="bg-white rounded-t-[28px] max-h-[75%] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
              <div class="shrink-0 px-5 pt-5 pb-3">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-[17px] font-black text-slate-900">所在位置</h3>
                  <button @click="showLocationSheet = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line"></i></button>
                </div>
                <div class="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2.5">
                  <i class="ri-search-line text-slate-400"></i>
                  <input v-model="locationKeyword" @keydown.enter="searchNearbyPoi" type="text" placeholder="搜索地点（餐厅 / 医院 / 商场…）" class="flex-1 bg-transparent text-[14px] outline-none placeholder-slate-400" />
                  <button @click="searchNearbyPoi" class="text-[13px] font-bold text-blue-600 active:scale-95">搜索</button>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto custom-scroll px-5 pb-6">
                <div v-if="locationLoading" class="flex items-center justify-center py-12 text-slate-400 gap-2">
                  <i class="ri-loader-4-line animate-spin text-xl"></i> 正在定位附近地点…
                </div>
                <template v-else>
                  <button @click="pickPoi({ title: '' })" class="w-full flex items-center gap-3 py-3.5 border-b border-slate-50 active:bg-slate-50">
                    <i class="ri-forbid-line text-[20px] text-slate-400"></i>
                    <span class="text-[14px] font-bold text-slate-500">不显示位置</span>
                  </button>
                  <button v-for="poi in poiResults" :key="poi.id" @click="pickPoi(poi)" class="w-full flex items-start gap-3 py-3.5 border-b border-slate-50 text-left active:bg-slate-50">
                    <i class="ri-map-pin-2-fill text-[20px] text-rose-400 mt-0.5 shrink-0"></i>
                    <div class="min-w-0">
                      <p class="text-[14px] font-bold text-slate-800 truncate">{{ poi.title }}</p>
                      <p class="text-[11.5px] text-slate-400 truncate">{{ poi.address }}</p>
                    </div>
                  </button>
                  <div v-if="!poiResults.length" class="text-center py-12 text-slate-300 text-[13px] font-bold">附近没搜到地点，换个关键词试试</div>
                </template>
              </div>
            </div>
          </div>
        </transition>

        <!-- 谁可见：底部浮层 -->
        <transition name="fade-up">
          <div v-if="showVisibilitySheet" class="absolute inset-0 z-[10] bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end" @click.self="showVisibilitySheet = false">
            <div class="bg-white rounded-t-[28px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.15)] pb-7">
              <div class="px-5 pt-5 pb-2 flex items-center justify-between">
                <h3 class="text-[17px] font-black text-slate-900">谁可以看</h3>
                <button @click="showVisibilitySheet = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line"></i></button>
              </div>
              <button v-for="o in visibilityOptions" :key="o.value" @click="pickVisibility(o.value)" class="w-full flex items-center gap-3.5 px-5 py-4 active:bg-slate-50 transition-all">
                <span class="w-10 h-10 rounded-2xl flex items-center justify-center" :class="composerVisibility === o.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'">
                  <i :class="o.icon" class="text-[19px]"></i>
                </span>
                <div class="flex-1 text-left">
                  <p class="text-[14.5px] font-black text-slate-800">{{ o.label }}</p>
                  <p class="text-[11.5px] text-slate-400 font-medium">{{ o.desc }}</p>
                </div>
                <i v-if="composerVisibility === o.value" class="ri-check-line text-xl text-slate-900"></i>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <SocialFriendPicker
      :show="showFriendPicker"
      :friends="friendChats"
      @close="showFriendPicker = false"
      @select="startPrivateChat"
    />

    <CreateGroupSheet
      :show="showCreateGroup"
      v-model:name="newGroupName"
      :friends="friendChats"
      :selected-ids="selectedMembers"
      @close="showCreateGroup = false"
      @toggle-member="toggleSelectMember"
      @create="createGroup"
    />

    <BroadcastSheet
      :show="showBroadcast"
      :friends="friendChats"
      :receiver-ids="broadcastReceiverIds"
      v-model:text="broadcastText"
      :sending="isSendingBroadcast"
      @close="showBroadcast = false"
      @toggle-receiver="toggleBroadcastReceiver"
      @select-all="broadcastReceiverIds = friendChats.map(friend => friend.id)"
      @clear="broadcastReceiverIds = []"
      @send="sendBroadcast"
    />

    <GroupProfileSheet
      :show="showMemberPanel"
      :active-chat="activeChat"
      :edit="groupEdit"
      :mode="groupProfileMode"
      :members="groupMembers"
      :loading="loadingMembers"
      :is-owner="isGroupOwner"
      :saving="isSavingGroupProfile"
      :my-id="myId"
      @close="showMemberPanel = false"
      @pick-avatar="pickGroupAvatar"
      @avatar-change="onGroupAvatarChange"
      @toggle-edit="groupProfileMode = groupProfileMode === 'edit' ? 'view' : 'edit'"
      @update-edit="groupEdit = $event"
      @save="saveGroupProfile"
      @open-invite="openInviteFromPanel"
      @open-user="openUserProfile"
      @remove-member="removeGroupMember"
      @leave="leaveCurrentGroup"
    />

    <InviteMembersSheet
      :show="showInvitePicker"
      :friends="invitableFriends"
      :selected-ids="inviteSelected"
      @close="showInvitePicker = false"
      @toggle-member="toggleInviteMember"
      @submit="submitInvite"
    />

    <UserProfileSheet
      :show="showUserProfile"
      :user="profileUser"
      :profile-data="userProfileData"
      :loading="userProfileLoading"
      :moments="profileMoments"
      :moments-loading="profileMomentsLoading"
      :display-name="profileDisplayName"
      :remark="profileRemark"
      :can-remark="canRemarkProfile"
      :is-friend="!!profileFriendChat"
      :my-id="myId"
      :moment-visibility-meta="momentVisibilityMeta"
      @close="closeUserProfile"
      @edit-remark="editProfileRemark"
      @open-moments="openProfileMomentsPanel"
      @greet="greetFromUserProfile"
      @start-chat="startChatFromProfile"
      @open-image="openImageViewer"
      @delete-friend="onDeleteFriendFromProfile"
      @request-verify="requestVerifyFromProfile"
    />

    <ProfileMomentsSheet
      :show="showProfileMomentsPanel"
      :user="profileUser"
      :title="profileMomentsTitle"
      :moments="profileMoments"
      :moment-visibility-meta="momentVisibilityMeta"
      :image-grid-class="imageGridClass"
      @close="closeProfileMomentsPanel"
      @edit-moment="editMoment"
      @delete-moment="deleteMoment"
      @open-image="openImageViewer"
      @toggle-like="toggleLike"
    />

    <SocialImageViewer
      :viewer="imageViewer"
      @close="closeImageViewer"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import http, { getWsBaseURL } from '@/api/http'
import StatusBoard from '@/components/tabs/StatusBoard.vue'
import DiscoverySeenPanel from '@/components/social/DiscoverySeenPanel.vue'
import SocialQuickCreateMenu from '@/components/social/SocialQuickCreateMenu.vue'
import SocialImageViewer from '@/components/social/SocialImageViewer.vue'
import UserProfileSheet from '@/components/social/UserProfileSheet.vue'
import ProfileMomentsSheet from '@/components/social/ProfileMomentsSheet.vue'
import SocialFriendPicker from '@/components/social/SocialFriendPicker.vue'
import CreateGroupSheet from '@/components/social/CreateGroupSheet.vue'
import BroadcastSheet from '@/components/social/BroadcastSheet.vue'
import GroupProfileSheet from '@/components/social/GroupProfileSheet.vue'
import InviteMembersSheet from '@/components/social/InviteMembersSheet.vue'
import PaperBoatSheet from '@/components/social/PaperBoatSheet.vue'
import PainResonanceChamber from '@/components/social/PainResonanceChamber.vue'
import { avatarOf } from '@/utils/avatarPool'
import { getAuthItem } from '@/utils/authToken'
import {
  readDiscoveryGreets as readStoredDiscoveryGreets,
  recordDiscoveryGreet as recordStoredDiscoveryGreet,
  readDiscoverySeenIds as readStoredDiscoverySeenIds,
  readDiscoverySeenRecords,
  recordDiscoverySeen as recordStoredDiscoverySeen
} from '@/utils/discoveryHistory'

const emit = defineEmits(['chat-active'])

const loadWarmth = async () => {
  try {
    const res = await http.get('/heal/warmth')
    if (res.status === 200 || res.code === 200) {
      localStorage.setItem('warmthPoints', res.data)
    }
  } catch (e) {
    console.error('加载暖心值失败', e)
  }
}

// ============ 情绪解压纸船状态与逻辑 ============
const showPaperBoatModal = ref(false)
const paperBoatTab = ref('write')
const paperBoatText = ref('')
const paperBoatHint = ref('')
const isDisintegrating = ref(false)
const isScoopLoading = ref(false)
const isPaperBoatResponding = ref(false)
const scoopedBoat = ref(null)
const paperBoatReplyText = ref('')
const selectedPaperBoatGift = ref('warm_water')
const isPaperBoatHistoryLoading = ref(false)
const paperBoatHistoryLoaded = ref(false)
const paperBoatHistory = ref({
  released: [],
  scooped: []
})
const paperBoatQuota = ref({
  releaseLimit: 2,
  scoopLimit: 2,
  releaseUsed: 0,
  scoopUsed: 0,
  releaseRemaining: 2,
  scoopRemaining: 2
})

const paperBoatGifts = [
  { type: 'warm_water', label: '一杯温水', icon: '♨️' },
  { type: 'night_light', label: '一盏夜灯', icon: '🕯️' },
  { type: 'soft_blanket', label: '一条毯子', icon: '🧣' },
  { type: 'quiet_hug', label: '一个拥抱', icon: '🤍' }
]

const openPaperBoat = async () => {
  showPaperBoatModal.value = true
  paperBoatText.value = ''
  paperBoatHint.value = ''
  isDisintegrating.value = false
  scoopedBoat.value = null
  paperBoatReplyText.value = ''
  selectedPaperBoatGift.value = 'warm_water'
  paperBoatTab.value = 'write'
  paperBoatHistoryLoaded.value = false
  await loadPaperBoatQuota()
}

const switchPaperBoatTab = async (tab) => {
  paperBoatTab.value = tab
  paperBoatHint.value = ''
  if (tab === 'history') {
    await loadPaperBoatHistory()
  }
}

const loadPaperBoatQuota = async () => {
  try {
    const res = await http.get('/heal/paperboat/quota')
    if (res.status === 200 && res.data) {
      paperBoatQuota.value = {
        ...paperBoatQuota.value,
        ...res.data
      }
    }
  } catch (e) {
    console.error('纸船额度加载失败', e)
  }
}

const applyPaperBoatQuota = (quota) => {
  if (!quota) return
  paperBoatQuota.value = {
    ...paperBoatQuota.value,
    ...quota
  }
}

const normalizePaperBoat = (boat) => {
  if (!boat) return null
  return {
    id: boat.id,
    content: boat.content,
    time: boat.time || '刚刚',
    createdAt: boat.createdAt,
    scoopedAt: boat.scoopedAt,
    breezeCount: boat.breezeCount || 0,
    replyCount: boat.replyCount || 0,
    giftCount: boat.giftCount || 0,
    breezed: !!boat.breezed,
    replied: !!boat.replied,
    gifted: !!boat.gifted,
    replyContent: boat.replyContent || '',
    giftType: boat.giftType || ''
  }
}

const parsePaperBoatDate = (value) => {
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

const formatPaperBoatTime = (value) => {
  const date = parsePaperBoatDate(value)
  if (!date || Number.isNaN(date.getTime())) return '刚刚'

  const diff = Date.now() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

const paperBoatGiftLabel = (type) => {
  return paperBoatGifts.find(gift => gift.type === type)?.label || '一份小礼物'
}

const loadPaperBoatHistory = async (force = false) => {
  if (isPaperBoatHistoryLoading.value) return
  if (paperBoatHistoryLoaded.value && !force) return

  isPaperBoatHistoryLoading.value = true
  try {
    const res = await http.get('/heal/paperboat/history')
    if (res.status === 200 || res.code === 200) {
      const data = res.data || {}
      paperBoatHistory.value = {
        released: (data.released || []).map(normalizePaperBoat).filter(Boolean),
        scooped: (data.scooped || []).map(normalizePaperBoat).filter(Boolean)
      }
      applyPaperBoatQuota(data.quota)
      paperBoatHistoryLoaded.value = true
    } else {
      paperBoatHint.value = res.message || '记录暂时没翻出来。'
    }
  } catch (e) {
    console.error('纸船记录加载失败', e)
    paperBoatHint.value = '记录暂时没翻出来，稍后再试。'
  } finally {
    isPaperBoatHistoryLoading.value = false
  }
}

const markPaperBoatHistoryDirty = () => {
  paperBoatHistoryLoaded.value = false
}

const disintegratePaperBoat = async () => {
  if (!paperBoatText.value.trim()) return
  if (paperBoatQuota.value.releaseRemaining <= 0) {
    paperBoatHint.value = '今天已经放飞 2 封了，留一点心事给明天慢慢说。'
    return
  }

  paperBoatHint.value = ''
  isDisintegrating.value = true
  
  try {
    const res = await http.post('/heal/paperboat/release', { content: paperBoatText.value })
    if (res.status !== 200) {
      paperBoatHint.value = res.message || '今天已经放不了更多纸船了。'
      isDisintegrating.value = false
      return
    }
    applyPaperBoatQuota(res.data?.quota)
    paperBoatHint.value = res.message || '纸船已经入河。'
    markPaperBoatHistoryDirty()
  } catch (e) {
    console.error('心事放飞失败', e)
    paperBoatHint.value = e?.response?.data?.message || '放飞失败，稍后再试。'
    isDisintegrating.value = false
    return
  }

  setTimeout(() => {
    paperBoatText.value = ''
    isDisintegrating.value = false
  }, 1400)
}

const getDisintegrateStyle = () => {
  const rx = (Math.random() * 160 - 80) + 'px'
  const ry = -(Math.random() * 150 + 100) + 'px'
  const rr = (Math.random() * 90 - 45) + 'deg'
  return {
    '--rand-x': rx,
    '--rand-y': ry,
    '--rand-r': rr,
  }
}

const scoopAnother = async () => {
  if (paperBoatQuota.value.scoopRemaining <= 0) {
    paperBoatHint.value = '今天已经捞过 2 封了，给河面留一点安静。'
    return
  }

  paperBoatHint.value = ''
  isScoopLoading.value = true

  try {
    const res = await http.get('/heal/paperboat/scoop')
    applyPaperBoatQuota(res.data?.quota)

    const boat = res.data?.boat || res.data
    if (res.status === 200 && boat?.content) {
      scoopedBoat.value = normalizePaperBoat(boat)
      paperBoatReplyText.value = ''
      markPaperBoatHistoryDirty()
    } else {
      scoopedBoat.value = null
      paperBoatHint.value = res.message || '暂时没有新的心事。'
    }
  } catch (e) {
    if (e?.response?.data?.data?.quota) {
      applyPaperBoatQuota(e.response.data.data.quota)
    }
    paperBoatHint.value = e?.response?.data?.message || '打捞失败，稍后再试。'
  } finally {
    isScoopLoading.value = false
  }
}

const sendBreezeToScooped = async () => {
  if (!scoopedBoat.value) return
  try {
    const res = await http.post('/heal/paperboat/breeze', { boatId: scoopedBoat.value.id })
    if (res.status === 200) {
      scoopedBoat.value.breezed = true
      scoopedBoat.value.breezeCount = (scoopedBoat.value.breezeCount || 0) + 1
      paperBoatHint.value = res.message || '微风已送达。'
      markPaperBoatHistoryDirty()
      loadWarmth()
    }
  } catch (e) {
    console.error('送微风失败', e)
    paperBoatHint.value = '微风没有送出去，稍后再试。'
  }
}

const respondToScooped = async (type) => {
  if (!scoopedBoat.value || isPaperBoatResponding.value) return
  if (type === 'reply' && !paperBoatReplyText.value.trim()) return

  isPaperBoatResponding.value = true

  try {
    const res = await http.post('/heal/paperboat/respond', {
      boatId: scoopedBoat.value.id,
      type,
      content: type === 'reply' ? paperBoatReplyText.value : '',
      giftType: type === 'gift' ? selectedPaperBoatGift.value : null
    })

    if (res.status === 200) {
      if (type === 'reply' && !scoopedBoat.value.replied) {
        scoopedBoat.value.replied = true
        scoopedBoat.value.replyCount = (scoopedBoat.value.replyCount || 0) + 1
        paperBoatReplyText.value = ''
      }

      if (type === 'gift' && !scoopedBoat.value.gifted) {
        scoopedBoat.value.gifted = true
        scoopedBoat.value.giftCount = (scoopedBoat.value.giftCount || 0) + 1
      }

      paperBoatHint.value = res.message || '回应已经轻轻送达。'
      markPaperBoatHistoryDirty()
      loadWarmth()
    }
  } catch (e) {
    console.error('纸船回应失败', e)
    paperBoatHint.value = e?.response?.data?.message || '回应失败，稍后再试。'
  } finally {
    isPaperBoatResponding.value = false
  }
}

// 社交名片配置
const showProfileConfig = ref(false)
const isSavingProfileConfig = ref(false)
const profileEdit = ref({
  cover: '',
  sign: '',
  style: 'warm'
})
const profileStyleOptions = [
  { id: 'warm', label: '暖光', class: 'bg-gradient-to-br from-amber-100 via-rose-100 to-orange-200' },
  { id: 'night', label: '夜航', class: 'bg-gradient-to-br from-slate-950 via-indigo-900 to-blue-700' },
  { id: 'forest', label: '绿洲', class: 'bg-gradient-to-br from-emerald-100 via-teal-100 to-lime-200' },
  { id: 'clean', label: '清白', class: 'bg-gradient-to-br from-white via-slate-100 to-blue-100' }
]
const mainPurposes = [
  { id: 'food', icon: '🍲', label: '找饭搭子' },
  { id: 'chat', icon: '🫂', label: '情绪树洞' },
  { id: 'sport', icon: '🏃', label: '运动搭子' },
  { id: 'help', icon: '🏥', label: '求医问药' }
]
const selectedPurpose = ref('food')

// 兴趣状态网格，最多选 3 个
const lifeTags = [
  { id: 't1', icon: '✨', label: '临床缓解' },
  { id: 't2', icon: '🛡️', label: '造口经历' },
  { id: 't3', icon: '🥛', label: '全流食' },
  { id: 't4', icon: '🎮', label: '电竞玩家' },
  { id: 't5', icon: '🎵', label: 'Livehouse' },
  { id: 't6', icon: '🐶', label: '宠物奴' },
  { id: 't7', icon: '🏕️', label: '户外露营' },
  { id: 't8', icon: '☕', label: '微醺/咖啡' }
]
const selectedTags = ref(['t1', 't4'])
const broadcastSign = ref('缓解期，想认识能互相鼓劲的人。')
const discoveryEnabled = ref(true)
const discoverySaving = ref(false)

const openProfileConfig = () => {
  profileEdit.value = {
    cover: myCard.value.cover,
    sign: myCard.value.sign,
    style: myCard.value.style || 'warm'
  }
  showProfileConfig.value = true
}

const pickProfileCover = () => {
  document.getElementById('profile-cover-input')?.click()
}

const onProfileCoverChange = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const url = await uploadOneMedia(file)
    if (!url) throw new Error('empty cover url')
    profileEdit.value.cover = url
  } catch (e) {
    alert('封面上传失败，稍后再试')
  }
}

const previewMyProfile = () => {
  // 关掉编辑弹窗，用「别人视角」打开自己的主页卡片
  showProfileConfig.value = false
  openUserProfile(myId)
}

const saveProfileConfig = async () => {
  if (isSavingProfileConfig.value) return
  isSavingProfileConfig.value = true
  try {
    const nextSign = (profileEdit.value.sign || '').trim()
    await http.post('/center/profile-style', {
      radarSign: nextSign,
      profileCover: profileEdit.value.cover,
      profileStyle: profileEdit.value.style
    })
    // 主页只管签名/封面/风格；爱好(radarTags)已移到「我的状态」里设置，这里不再写，避免覆盖
    myCard.value.sign = nextSign || myCard.value.sign
    myCard.value.cover = profileEdit.value.cover || myCard.value.cover
    myCard.value.style = profileEdit.value.style || myCard.value.style
    showProfileConfig.value = false
  } catch (e) {
    alert('保存失败，稍后再试')
  } finally {
    isSavingProfileConfig.value = false
  }
}

const normalizeDiscoveryTags = (rawTags) => {
  if (Array.isArray(rawTags)) return rawTags
  if (!rawTags) return []
  try {
    const parsed = JSON.parse(rawTags)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

const discoveryTagLabels = (rawTags) => {
  const ids = normalizeDiscoveryTags(rawTags)
  const labelMap = new Map(lifeTags.map(tag => [tag.id, tag.label]))
  return ids.map(id => labelMap.get(id) || id).filter(Boolean)
}

const saveDiscoverySettings = async () => {
  if (discoverySaving.value) return
  discoverySaving.value = true
  try {
    // radarTags 已改作「爱好」用途，所有权归「我的状态」页，这里不再写它，避免覆盖用户的爱好
    await http.post('/center/discovery', {
      discoveryEnabled: discoveryEnabled.value,
      radarSign: broadcastSign.value.trim()
    })
  } catch (e) {
    console.error('保存遇见设置失败', e)
    locationStatus.value = '遇见设置保存失败，稍后再试。'
  } finally {
    discoverySaving.value = false
  }
}

const toggleDiscoveryEnabled = async () => {
  discoveryEnabled.value = !discoveryEnabled.value
  await saveDiscoverySettings()
}

const toggleTag = (id) => {
  const idx = selectedTags.value.indexOf(id)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    if (selectedTags.value.length >= 3) {
      selectedTags.value.shift()
    }
    selectedTags.value.push(id)
  }
  saveDiscoverySettings()
}

const isCityPicksLoading = ref(false)
const foundPatients = ref([])
const discoveryIndex = ref(0)
const discoverySeenCount = ref(0)
const discoveryMode = ref('city')
const showSeenPicksPanel = ref(false)
const seenDiscoveryPicks = ref([])
const discoveryGreetLimit = 2
const discoveryGreetCount = ref(0)

const discoveryTitle = computed(() => discoveryMode.value === 'city' ? '同城精选' : '远方朋友')
const discoveryGreetRemaining = computed(() => Math.max(0, discoveryGreetLimit - discoveryGreetCount.value))
const discoveryHeroTitle = computed(() => discoveryMode.value === 'city'
  ? '不刷人。\n只遇见同一座城。'
  : '不刷人。\n也能遇见远方的人。'
)
const discoveryScopeText = computed(() => discoveryMode.value === 'city'
  ? (cityDisplay.value || myCity.value || '先确认你的城市')
  : '不按城市手动挑选'
)
const discoveryEmptyText = computed(() => discoveryMode.value === 'city'
  ? (discoverySeenCount.value > 0 ? '这批同城朋友已经看完了。' : '同城朋友还不多，晚点再看看。')
  : (discoverySeenCount.value > 0 ? '这批远方朋友已经看完了。' : '暂时没遇到合适的人。')
)
const currentDiscoveryPick = computed(() => foundPatients.value[discoveryIndex.value] || null)
const discoveryProgressText = computed(() => {
  const total = discoverySeenCount.value + foundPatients.value.length
  if (!total) return '本轮 0 / 0'
  return `本轮 ${Math.min(discoverySeenCount.value + 1, total)} / ${total}`
})

const readDiscoveryGreets = (mode = discoveryMode.value) => {
  return readStoredDiscoveryGreets(myId, mode)
}

const readDiscoverySeenIds = (mode = discoveryMode.value) => {
  return readStoredDiscoverySeenIds(myId, mode)
}

const refreshSeenDiscoveryPicks = (mode = discoveryMode.value) => {
  seenDiscoveryPicks.value = readDiscoverySeenRecords(myId, mode)
    .slice()
    .sort((a, b) => (b.seenAt || 0) - (a.seenAt || 0))
}

const recordDiscoverySeen = (pick, mode = discoveryMode.value) => {
  recordStoredDiscoverySeen(myId, mode, pick)
  refreshSeenDiscoveryPicks(mode)
}

const refreshDiscoveryGreetCount = (mode = discoveryMode.value) => {
  discoveryGreetCount.value = readDiscoveryGreets(mode).length
}

const recordDiscoveryGreet = (targetId, mode = discoveryMode.value) => {
  recordStoredDiscoveryGreet(myId, mode, targetId)
  refreshDiscoveryGreetCount(mode)
}

const parseHealthPhaseLabel = (raw) => {
  if (!raw) return ''
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  if (!trimmed) return ''
  try {
    const parsed = JSON.parse(trimmed)
    if (parsed && typeof parsed === 'object') {
      const parts = [
        parsed.disease,
        parsed.duration ? `确诊${parsed.duration}` : '',
        Array.isArray(parsed.tags) ? parsed.tags.join('、') : ''
      ].filter(Boolean)
      return parts.join(' · ')
    }
  } catch (e) {
    // 兼容旧数据：不是 JSON 就当普通文本展示
  }
  return trimmed
}

const buildDiscoveryStatusChips = (user) => {
  return [
    parseHealthPhaseLabel(user.healthPhase),
    user.dietStrategy ? `饮食：${user.dietStrategy}` : '',
    user.bowelStatus ? `生活状态：${user.bowelStatus}` : ''
  ].filter(Boolean).slice(0, 3)
}

const mapCityPick = (user, mode = discoveryMode.value) => {
  const rawCity = user.city || ''
  const city = mode === 'city' ? (myCity.value || rawCity) : rawCity
  const place = mode === 'city' ? (myCity.value || '同城') : (city || '远方')
  const isCityMode = mode === 'city'
  const tags = discoveryTagLabels(user.radarTags)
  return {
    id: user.userId,
    name: user.nickname || '未命名朋友',
    distance: place,
    tags: tags.length ? tags.slice(0, 3) : (isCityMode ? ['同城', '可先打招呼', '不显示距离'] : ['远方', '慢慢认识', '不显示距离']),
    statusChips: buildDiscoveryStatusChips(user),
    sign: user.radarSign || (isCityMode ? `也在${place}，先从一句轻轻的问候开始。` : `${city ? `来自${city}，` : ''}也在认真生活，先从一句问候开始。`),
    avatar: avatarOf(user, user.userId),
    requested: false,
    isFriend: friendChats.value.some(friend => Number(friend.id) === Number(user.userId))
  }
}

const openDiscovery = async (mode = 'city') => {
  discoveryMode.value = mode
  refreshDiscoveryGreetCount(mode)
  refreshSeenDiscoveryPicks(mode)

  emit('chat-active', true)
  showRadarModal.value = true
  isCityPicksLoading.value = true
  foundPatients.value = []
  discoveryIndex.value = 0
  discoverySeenCount.value = 0

  if (mode === 'city') {
    const cityReady = myCity.value || await detectAndSaveLocation()
    if (!cityReady) {
      isCityPicksLoading.value = false
      return
    }
    if (myCity.value) {
      await saveMyCity(false)
    }
  }

  try {
    const res = await http.get(mode === 'city' ? '/users/nearby' : '/users/distant')
    if (res.status === 200 && Array.isArray(res.data)) {
      const seenIds = new Set(readDiscoverySeenIds(mode))
      foundPatients.value = res.data
        .filter(user => !seenIds.has(String(user.userId)))
        .slice(0, 5)
        .map(user => mapCityPick(user, mode))
      discoveryIndex.value = 0
    }
  } catch (e) {
    console.error('拉取朋友精选失败', e)
    foundPatients.value = []
  } finally {
    isCityPicksLoading.value = false
  }
}

const openRadar = () => openDiscovery('city')

const closeCityPicks = () => {
  showRadarModal.value = false
  emit('chat-active', false)
}

const skipCityPick = (targetId) => {
  const skippedPick = foundPatients.value.find(p => Number(p.id) === Number(targetId))
  const before = foundPatients.value.length
  foundPatients.value = foundPatients.value.filter(p => Number(p.id) !== Number(targetId))
  if (foundPatients.value.length < before) {
    recordDiscoverySeen(skippedPick || targetId)
    discoverySeenCount.value += 1
  }
  discoveryIndex.value = 0
}

const skipCurrentDiscoveryPick = () => {
  const pick = currentDiscoveryPick.value
  if (!pick) return
  skipCityPick(pick.id)
}

const openDiscoveryProfile = async (pick) => {
  if (!pick?.id) return
  await openUserProfile(pick.id)
}

const openSeenDiscoveryProfile = async (pick) => {
  showSeenPicksPanel.value = false
  await openDiscoveryProfile(pick)
}

const greetSeenDiscoveryPick = async (pick) => {
  if (!pick || pick.requested) return
  const sent = await greetCityPick(pick)
  if (sent) {
    pick.requested = true
    recordDiscoverySeen(pick)
  }
}

const chatWithDiscoveryPick = (pick) => {
  if (!pick?.id) return
  const friend = friendChats.value.find(item => Number(item.id) === Number(pick.id))
  const chat = friend || {
    type: 'single',
    id: pick.id,
    name: pick.name,
    rawName: pick.name,
    avatar: pick.avatar,
    lastMsg: '可以先发一句问候。',
    time: '',
    unread: null
  }
  showRadarModal.value = false
  emit('chat-active', true)
  openChat(chat)
}

const greetCityPick = async (pick) => {
  if (!pick || pick.requested) return
  if (discoveryGreetRemaining.value <= 0) {
    alert('今天先认识到这里，慢一点更安全。')
    return false
  }
  const sent = await sendFriendRequest(pick.id, { successMessage: '已打招呼' })
  if (sent) {
    pick.requested = true
    recordDiscoveryGreet(pick.id)
    setTimeout(() => {
      if (currentDiscoveryPick.value?.id === pick.id) {
        skipCurrentDiscoveryPick()
      }
    }, 520)
  }
  return sent
}

const emojis = ['😀', '😂', '🤣', '😊', '😍', '😒', '😘', '😁', '😭', '😎', '😢', '😡', '👍', '🙏', '🎉', '❤️', '🔥', '💩', '👻', '💊']

const appendEmoji = (emoji) => {
  inputMsg.value += emoji
}

// 雷达与聊天状态
const isScanning = ref(true)
const selectedPatient = ref(null)
const currentTab = ref('status')

// ============ 我的朋友圈封面 ============
const myCard = ref({
  name: 'Xuan',
  sign: '',
  avatar: avatarOf('', 'Xuan'),
  cover: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80',
  style: 'warm'
})

const myId = Number(getAuthItem('userId')) || 1
const moments = ref([])

const parseMomentImages = (imagesJson) => {
  if (!imagesJson) return []
  try {
    return JSON.parse(imagesJson)
  } catch (e) {
    return []
  }
}

const mapMoment = (m) => ({
  id: m.id,
  userId: m.userId,
  isMine: Number(m.userId) === myId,
  user: {
    name: m.nickname,
    avatar: avatarOf(m, m.userId),
    stage: '',
    online: false
  },
  time: m.createdAt ? new Date(m.createdAt).toLocaleString('zh-CN') : '',
  device: m.device || '',
  location: m.location || '',
  visibility: m.visibility || 'public',
  content: m.content,
  images: parseMomentImages(m.imagesJson),
  liked: m.liked,
  likesCount: m.likesCount || 0,
  likes: [],
  comments: (m.comments || []).map(c => ({
    user: c.nickname || '神秘特工',
    content: c.content
  })),
  commentInput: '',
  showCommentBox: false
})

const momentVisibilityMeta = (visibility = 'public') => {
  if (visibility === 'discoverable') {
    return {
      label: '陌生可见',
      icon: 'ri-planet-fill',
      class: 'text-violet-600 bg-violet-50'
    }
  }
  if (visibility === 'private') {
    return {
      label: '仅自己',
      icon: 'ri-lock-2-fill',
      class: 'text-slate-500 bg-slate-100'
    }
  }
  if (visibility === 'comrade') {
    return {
      label: '仅好友',
      icon: 'ri-user-heart-fill',
      class: 'text-blue-600 bg-blue-50'
    }
  }
  return {
    label: '好友和小队',
    icon: 'ri-team-fill',
    class: 'text-emerald-600 bg-emerald-50'
  }
}

const loadMoments = async () => {
  try {
    const res = await http.get('/moment/list')
    if (res.status === 200) {
      moments.value = (res.data || []).map(mapMoment)
    }
  } catch (e) {
    console.error('动态加载失败', e)
  }
}

// ============ 工具函数 ============
const imageGridClass = (n) => {
  if (n === 1) return 'grid-cols-1'
  if (n === 2 || n === 4) return 'grid-cols-2'
  return 'grid-cols-3'
}

const stageStyle = (stage) => {
  if (stage.includes('绿') || stage.includes('缓解')) return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
  if (stage.includes('黄') || stage.includes('轻度')) return 'bg-amber-50 text-amber-700 border border-amber-100'
  if (stage.includes('橙') || stage.includes('中度')) return 'bg-orange-50 text-orange-700 border border-orange-100'
  if (stage.includes('红') || stage.includes('急性')) return 'bg-rose-50 text-rose-700 border border-rose-100'
  return 'bg-slate-50 text-slate-700 border border-slate-100'
}

const toggleLike = async (post) => {
  const res = await http.post(`/moment/like/${post.id}`)
  if (res.status === 200) {
    post.liked = !post.liked
    post.likesCount += post.liked ? 1 : -1
  }
}

// ============ 发布动态（全屏沉浸 · 小红书布局）============
const showComposer = ref(false)
const editingMomentId = ref(null)
const composerText = ref('')
const composerTitle = ref('')          // 标题（选填）
const composerImages = ref([])          // 图片 / 视频 URL 混存，最多 9 条
const composerLocation = ref('')        // 标记地点（POI 名称）
const composerVisibility = ref('public') // discoverable / public / comrade / private
const isPublishing = ref(false)
const mediaUploading = ref(false)
const MAX_MEDIA = 9

// 可见范围
const visibilityOptions = [
  { value: 'discoverable', label: '陌生人也可见', desc: '同城和远方朋友进主页也能看', icon: 'ri-planet-line' },
  { value: 'public', label: '好友和小队可见', desc: '好友能刷到，同队成员进主页也能看', icon: 'ri-team-line' },
  { value: 'comrade', label: '仅好友可见', desc: '只给好友看，同队陌生人看不到', icon: 'ri-user-heart-line' },
  { value: 'private', label: '仅自己可见', desc: '只有你自己能看到', icon: 'ri-lock-2-line' }
]
const showVisibilitySheet = ref(false)
const visibilityLabel = computed(() => {
  const v = visibilityOptions.find(o => o.value === composerVisibility.value)
  return v ? v.label : '好友和小队可见'
})
const pickVisibility = (v) => {
  composerVisibility.value = v
  showVisibilitySheet.value = false
}

// 按扩展名判断是不是视频
const isVideo = (url) => /\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(url || '')

const imageViewer = ref({
  show: false,
  images: [],
  index: 0
})

const openImageViewer = (images, index = 0) => {
  const onlyImages = (images || []).filter(item => !isVideo(item))
  if (!onlyImages.length) return
  const target = images?.[index]
  imageViewer.value = {
    show: true,
    images: onlyImages,
    index: Math.max(0, onlyImages.findIndex(item => item === target))
  }
}

const closeImageViewer = () => {
  imageViewer.value.show = false
}

const nextImage = () => {
  if (!imageViewer.value.images.length) return
  imageViewer.value.index = (imageViewer.value.index + 1) % imageViewer.value.images.length
}

const prevImage = () => {
  if (!imageViewer.value.images.length) return
  imageViewer.value.index = (imageViewer.value.index - 1 + imageViewer.value.images.length) % imageViewer.value.images.length
}

const openComposer = () => {
  editingMomentId.value = null
  showComposer.value = true
  composerText.value = ''
  composerTitle.value = ''
  composerImages.value = []
  composerLocation.value = ''
  composerVisibility.value = 'public'
}

const closeComposer = () => {
  showComposer.value = false
  editingMomentId.value = null
}

const editMoment = (post) => {
  editingMomentId.value = post.id
  composerTitle.value = ''
  composerText.value = post.content || ''
  composerImages.value = [...(post.images || [])]
  composerLocation.value = post.location || ''
  composerVisibility.value = post.visibility || 'public'
  showProfileMomentsPanel.value = false
  showUserProfile.value = false
  showComposer.value = true
}

const deleteMoment = async (post) => {
  if (!post?.id) return
  if (!confirm('确定删除这条动态吗？')) return
  try {
    const res = await http.delete(`/moment/delete/${post.id}`)
    if (res.status === 200 || res.code === 200) {
      moments.value = moments.value.filter(item => item.id !== post.id)
      if (profileMoments.value.length) {
        profileMoments.value = profileMoments.value.filter(item => item.id !== post.id)
      }
    } else {
      alert(res.message || '删除失败')
    }
  } catch (e) {
    alert('删除失败，请检查网络')
  }
}

// ---- 标记地点（复用腾讯地图 POI 附近搜索）----
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
    alert('当前设备不支持定位，无法获取附近地点')
    return
  }
  locationLoading.value = true
  poiResults.value = []
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const callbackName = 'jsonp_poi_' + Date.now()
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
      script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${keyword}&boundary=nearby(${lat},${lng},2000)&key=${TENCENT_MAP_KEY}&output=jsonp&callback=${callbackName}`
      document.body.appendChild(script)
      script.onload = () => document.body.removeChild(script)
      script.onerror = () => {
        alert('网络请求被拦截，请检查网络')
        locationLoading.value = false
        document.body.removeChild(script)
      }
    },
    (error) => {
      console.warn(error)
      alert('定位失败！请给浏览器开启【获取位置】权限')
      locationLoading.value = false
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

const pickPoi = (poi) => {
  composerLocation.value = poi.title
  showLocationSheet.value = false
}

const clearComposerLocation = () => {
  composerLocation.value = ''
}

const pickComposerImage = () => {
  document.getElementById('composer-image-input')?.click()
}

// 单个文件上传：视频/大图给 2 分钟超时，覆盖全局 5s
const uploadOneMedia = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await http.post('/upload', formData, { timeout: 120000 })
  return res && res.data ? res.data : null
}

const onComposerImage = async (e) => {
  const picked = Array.from(e.target.files || [])
  e.target.value = ''
  if (!picked.length) return
  const remaining = MAX_MEDIA - composerImages.value.length
  if (remaining <= 0) { alert(`最多 ${MAX_MEDIA} 条哦`); return }
  const files = picked.slice(0, remaining)
  mediaUploading.value = true
  try {
    // 并行上传，互不阻塞；个别失败也不影响其它
    const results = await Promise.allSettled(files.map(uploadOneMedia))
    const urls = results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value)
    if (urls.length) composerImages.value.push(...urls)
    const failed = results.length - urls.length
    if (failed > 0) alert(`有 ${failed} 个上传失败了（可能太大或网络慢），已自动跳过`)
  } finally {
    mediaUploading.value = false
  }
}

const removeComposerImage = (i) => {
  composerImages.value.splice(i, 1)
}

const publishMoment = async () => {
  const title = composerTitle.value.trim()
  const body = composerText.value.trim()
  if (!title && !body && composerImages.value.length === 0) {
    alert('写点什么或加张图吧')
    return
  }
  // 标题选填：有标题就作为正文首行
  const content = title ? (body ? title + '\n' + body : title) : body
  isPublishing.value = true
  try {
    const payload = {
      content,
      imagesJson: composerImages.value.length ? JSON.stringify(composerImages.value) : null,
      location: composerLocation.value || null,
      visibility: composerVisibility.value || 'public'
    }
    const endpoint = editingMomentId.value ? `/moment/update/${editingMomentId.value}` : '/moment/publish'
    const res = await http.post(endpoint, payload)
    if (res.status === 200 || res.code === 200) {
      closeComposer()
      composerText.value = ''
      composerTitle.value = ''
      composerImages.value = []
      composerLocation.value = ''
      await loadMoments()
    } else {
      alert(res.message || '发布失败')
    }
  } catch (e) {
    alert('发布失败,请检查网络')
  } finally {
    isPublishing.value = false
  }
}

const submitComment = async (post) => {
  const text = (post.commentInput || '').trim()
  if (!text) return
  try {
    const res = await http.post('/moment/comment', { momentId: post.id, content: text })
    if (res.status === 200 || res.code === 200) {
      post.comments.push({ user: myCard.value.name, content: text })
      post.commentInput = ''
    } else {
      alert(res.message || '评论失败')
    }
  } catch (e) {
    alert('评论失败,请检查网络')
  }
}
const showRadarModal = ref(false)
const currentView = ref('list')
const showFabMenu = ref(false)
const activeChat = ref(null)
const showEmojiMenu = ref(false)
const showPlusMenu = ref(false)
const secretMode = ref(false)
const inputMsg = ref('')
const chatHistory = ref([])
let socket = null

// 联络人状态
const friendChats = ref([])
const groupChats = ref([])
const showQuickCreateMenu = ref(false)
const chatSearchKeyword = ref('')
const chatHistorySearchResults = ref([])
const isChatHistorySearching = ref(false)
let chatSearchTimer = null
let friendSyncTimer = null
const knownFriendIds = ref(new Set())
const knownRequestIds = ref(new Set())
const friendSyncReady = ref(false)
const chatList = computed(() => {
  return [...groupChats.value, ...friendChats.value].sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0))
})
const hasUnreadChats = computed(() => chatList.value.some(item => Number(item.unread || 0) > 0))
const filteredChatList = computed(() => {
  const keyword = chatSearchKeyword.value.trim().toLowerCase()
  if (!keyword) return chatList.value
  const merged = new Map()
  chatList.value.filter(item => {
    const text = [
      item.name,
      item.lastMsg,
      item.id,
      item.type === 'group' ? '小队 群聊' : '好友 密聊'
    ].filter(Boolean).join(' ').toLowerCase()
    return text.includes(keyword)
  }).forEach(item => merged.set(chatKey(item), item))
  chatHistorySearchResults.value
    .map(hydrateChatSearchResult)
    .filter(Boolean)
    .forEach(item => merged.set(chatKey(item), item))
  return Array.from(merged.values())
})
const pendingRequests = ref([])
const friendSearchKeyword = ref('')
const addFriendCardRef = ref(null)
const friendSearchInputRef = ref(null)
const listScrollRef = ref(null)
const searchResults = ref([])
const isSearching = ref(false)
const searchDone = ref(false)

const previewMessage = (content, type = 'text') => {
  if (type === 'image') return '[图片]'
  if (type === 'file') return '[文件]'
  if (type === 'secret') return '[密聊]'
  return content || '点击进入聊天...'
}

const formatFileSize = (size = 0) => {
  const bytes = Number(size || 0)
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

const filePayload = (msg) => {
  try {
    const parsed = JSON.parse(msg?.content || '{}')
    return {
      url: parsed.url || msg?.content || '#',
      name: parsed.name || '未命名文件',
      sizeText: parsed.sizeText || ''
    }
  } catch (e) {
    return {
      url: msg?.content || '#',
      name: '文件',
      sizeText: ''
    }
  }
}

const chatKey = (item) => `${item.type}-${item.id}`

const hydrateChatSearchResult = (result) => {
  if (!result?.type || !result?.id) return null
  const id = Number(result.id)
  const existing = chatList.value.find(item => item.type === result.type && Number(item.id) === id)
  return {
    ...(existing || {}),
    type: result.type,
    id,
    name: result.name || existing?.name || (result.type === 'group' ? '未知小队' : '神秘朋友'),
    avatar: avatarOf(result.avatar || existing?.avatar, id),
    lastMsg: result.lastMsg || existing?.lastMsg,
    time: result.lastTime || existing?.time || '',
    memberCount: existing?.memberCount || result.memberCount || 0,
    unread: existing?.unread || null,
    sortAt: Date.now()
  }
}

const touchChatPreview = (type, id, content, msgType = 'text', unread = false) => {
  const pool = type === 'group' ? groupChats.value : friendChats.value
  const item = pool.find(c => Number(c.id) === Number(id))
  if (!item) return
  item.lastMsg = previewMessage(content, msgType)
  item.time = '刚刚'
  item.sortAt = Date.now()
  if (unread) {
    item.unread = (item.unread || 0) + 1
  }
}

const searchChatHistory = async (keyword) => {
  const currentKeyword = keyword.trim()
  if (!currentKeyword) {
    chatHistorySearchResults.value = []
    isChatHistorySearching.value = false
    return
  }

  isChatHistorySearching.value = true
  try {
    const res = await http.get('/chat/search', { params: { keyword: currentKeyword } })
    if (chatSearchKeyword.value.trim() === currentKeyword && (res.status === 200 || res.code === 200)) {
      chatHistorySearchResults.value = res.data || []
    }
  } catch (e) {
    console.error('搜索聊天历史失败', e)
    if (chatSearchKeyword.value.trim() === currentKeyword) {
      chatHistorySearchResults.value = []
    }
  } finally {
    if (chatSearchKeyword.value.trim() === currentKeyword) {
      isChatHistorySearching.value = false
    }
  }
}

watch(chatSearchKeyword, (value) => {
  clearTimeout(chatSearchTimer)
  const keyword = value.trim()
  chatHistorySearchResults.value = []
  if (!keyword) {
    isChatHistorySearching.value = false
    return
  }
  chatSearchTimer = setTimeout(() => searchChatHistory(keyword), 260)
})

const copyMyId = async () => {
  const idText = String(myId)
  try {
    await navigator.clipboard.writeText(idText)
    alert('已复制你的编号：' + idText + '，发给好友就能搜到你啦')
  } catch (e) {
    alert('你的编号是：' + idText)
  }
}

const toggleQuickCreateMenu = () => {
  showQuickCreateMenu.value = !showQuickCreateMenu.value
}

const openAddFriendShortcut = async () => {
  showQuickCreateMenu.value = false
  currentTab.value = 'contacts'
  await nextTick()
  setTimeout(() => {
    const card = addFriendCardRef.value
    const scroller = listScrollRef.value
    if (card && scroller) {
      scroller.scrollTo({
        top: Math.max(0, card.offsetTop - 92),
        behavior: 'smooth'
      })
    } else {
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    friendSearchInputRef.value?.focus()
  }, 80)
}

const openComposerFromQuickMenu = () => {
  showQuickCreateMenu.value = false
  currentTab.value = 'moments'
  openComposer()
}

const searchUsers = async () => {
  const kw = friendSearchKeyword.value.trim()
  if (!kw) return
  isSearching.value = true
  searchDone.value = false
  try {
    const res = await http.get('/users/search', { params: { keyword: kw } })
    if (res.status === 200 || res.code === 200) {
      const friendIds = new Set(friendChats.value.map(item => Number(item.id)))
      searchResults.value = (res.data || []).map(user => ({
        ...user,
        isFriend: friendIds.has(Number(user.userId))
      }))
    }
  } catch (e) {
    console.error('搜索用户失败', e)
    searchResults.value = []
  } finally {
    isSearching.value = false
    searchDone.value = true
  }
}

const loadFriends = async () => {
  try {
    const res = await http.get('/friend/list')
    if (res.status === 200 || res.code === 200) {
      const friends = res.data || []
      const previousIds = knownFriendIds.value
      friendChats.value = friends.map((friend, index, list) => {
        const id = friend.friendId || friend.id
        const rawName = friend.nickname || '神秘特工'
        return {
          type: 'single',
          id,
          name: friendRemarks.value[String(id)] || rawName,
          rawName,
          avatar: avatarOf(friend.avatar, id),
          role: '小队成员',
          lastMsg: previewMessage(friend.lastMsg),
          time: friend.lastTime || '',
          unread: friend.unread || null,
          sortAt: list.length - index
        }
      })
      const nextIds = new Set(friendChats.value.map(item => Number(item.id)))
      if (friendSyncReady.value) {
        const newFriend = friendChats.value.find(item => !previousIds.has(Number(item.id)))
        if (newFriend) {
          currentTab.value = 'chat'
          alert(`你和 ${newFriend.name} 已成为朋友，可以开始聊天了`)
        }
      }
      knownFriendIds.value = nextIds
      searchResults.value.forEach(user => {
        user.isFriend = nextIds.has(Number(user.userId))
        if (user.isFriend) user.requested = false
      })
      return friendChats.value
    }
  } catch (error) {
    console.error("拉取好友失败:", error)
  }
  return friendChats.value
}

const loadGroups = async () => {
  try {
    const res = await http.get('/group/list')
    if (res.status === 200 || res.code === 200) {
      const groups = res.data || []
      groupChats.value = groups.map((g, index) => ({
        type: 'group',
        id: g.id,
        name: g.name,
        avatar: avatarOf(g.avatar, 'group-' + g.id),
        notice: g.notice || '',
        ownerId: g.ownerId,
        memberCount: g.memberCount || 0,
        lastMsg: previewMessage(g.lastMsg),
        time: g.lastTime || '',
        unread: null,
        sortAt: groups.length - index
      }))
    }
  } catch (error) {
    console.error("拉取小队失败:", error)
  }
}

// 收到非当前会话的消息时,给会话列表打未读角标
const bumpUnread = (type, id, content, msgType = 'text') => {
  const pool = type === 'group' ? groupChats.value : friendChats.value
  const item = pool.find(c => Number(c.id) === Number(id))
  if (item) {
    item.unread = (item.unread || 0) + 1
    item.lastMsg = previewMessage(content, msgType)
    item.time = '刚刚'
    item.sortAt = Date.now()
  }
}

// ============ FAB:密聊 / 创建小队 / 群发广播 ============
const showFriendPicker = ref(false)
const showCreateGroup = ref(false)
const showBroadcast = ref(false)
const newGroupName = ref('')
const selectedMembers = ref([])
const broadcastText = ref('')
const broadcastReceiverIds = ref([])
const isSendingBroadcast = ref(false)

// ============ 小队成员面板 / 邀请 ============
const showMemberPanel = ref(false)
const groupMembers = ref([])
const loadingMembers = ref(false)
const showInvitePicker = ref(false)
const inviteSelected = ref([])
const groupDetail = ref(null)
const groupProfileMode = ref('view')
const groupDetailRole = ref('')
const isSavingGroupProfile = ref(false)
const groupEdit = ref({
  name: '',
  avatar: '',
  notice: ''
})

const isGroupOwner = computed(() => {
  return groupDetailRole.value === 'OWNER' || Number(groupDetail.value?.ownerId) === myId || Number(activeChat.value?.ownerId) === myId
})

const openMemberPanel = async () => {
  if (!activeChat.value || activeChat.value.type !== 'group') return
  showMemberPanel.value = true
  loadingMembers.value = true
  groupProfileMode.value = 'view'
  groupMembers.value = []
  try {
    const [detailRes, membersRes] = await Promise.all([
      http.get(`/group/${activeChat.value.id}`),
      http.get(`/group/${activeChat.value.id}/members`)
    ])

    if (detailRes.status === 200 || detailRes.code === 200) {
      groupDetail.value = detailRes.data?.group || null
      groupDetailRole.value = detailRes.data?.myRole || ''
      if (groupDetail.value) {
        groupEdit.value = {
          name: groupDetail.value.name || activeChat.value.name,
          avatar: groupDetail.value.avatar || activeChat.value.avatar,
          notice: groupDetail.value.notice || ''
        }
        activeChat.value.name = groupEdit.value.name
        activeChat.value.avatar = groupEdit.value.avatar
        activeChat.value.notice = groupEdit.value.notice
        activeChat.value.ownerId = groupDetail.value.ownerId
      }
    }

    if (membersRes.status === 200 || membersRes.code === 200) {
      groupMembers.value = (membersRes.data || []).map(m => ({ ...m, userId: Number(m.userId) }))
    }
  } catch (e) {
    console.error('加载成员失败', e)
  } finally {
    loadingMembers.value = false
  }
}

const pickGroupAvatar = () => {
  document.getElementById('group-avatar-input')?.click()
}

const onGroupAvatarChange = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const url = await uploadOneMedia(file)
    if (url) {
      groupEdit.value.avatar = url
    }
  } catch (e) {
    alert('群头像上传失败，请稍后再试')
  }
}

const syncActiveGroup = (group) => {
  if (!group) return
  const target = groupChats.value.find(item => Number(item.id) === Number(group.id))
  if (target) {
    target.name = group.name
    target.avatar = group.avatar || target.avatar
    target.notice = group.notice || ''
    target.ownerId = group.ownerId
    target.memberCount = group.memberCount || target.memberCount
  }
  if (activeChat.value && Number(activeChat.value.id) === Number(group.id)) {
    activeChat.value.name = group.name
    activeChat.value.avatar = group.avatar || activeChat.value.avatar
    activeChat.value.notice = group.notice || ''
    activeChat.value.ownerId = group.ownerId
    activeChat.value.memberCount = group.memberCount || activeChat.value.memberCount
  }
}

const saveGroupProfile = async () => {
  if (!activeChat.value || !groupEdit.value.name.trim()) return
  isSavingGroupProfile.value = true
  try {
    const res = await http.post(`/group/${activeChat.value.id}/profile`, {
      name: groupEdit.value.name.trim(),
      avatar: groupEdit.value.avatar,
      notice: groupEdit.value.notice
    })
    if (res.status === 200 || res.code === 200) {
      groupDetail.value = res.data
      syncActiveGroup(res.data)
      groupProfileMode.value = 'view'
    } else {
      alert(res.message || '保存失败')
    }
  } catch (e) {
    alert('保存失败，请检查网络')
  } finally {
    isSavingGroupProfile.value = false
  }
}

const removeGroupMember = async (member) => {
  if (!activeChat.value || !member) return
  if (!confirm(`确定把「${member.nickname || '这位队员'}」移出小队吗？`)) return
  try {
    const res = await http.post(`/group/${activeChat.value.id}/remove`, { memberId: member.userId })
    if (res.status === 200 || res.code === 200) {
      await openMemberPanel()
      activeChat.value.memberCount = groupMembers.value.length
      const g = groupChats.value.find(x => Number(x.id) === Number(activeChat.value.id))
      if (g) g.memberCount = groupMembers.value.length
    } else {
      alert(res.message || '移除失败')
    }
  } catch (e) {
    alert('移除失败，请检查网络')
  }
}

const leaveCurrentGroup = async () => {
  if (!activeChat.value) return
  if (!confirm(`确定退出「${activeChat.value.name}」吗？`)) return
  try {
    const res = await http.post(`/group/${activeChat.value.id}/leave`)
    if (res.status === 200 || res.code === 200) {
      showMemberPanel.value = false
      closeChat()
      await loadGroups()
      currentTab.value = 'chat'
    } else {
      alert(res.message || '退出失败')
    }
  } catch (e) {
    alert(e?.response?.data?.message || '退出失败，请检查网络')
  }
}

// 可邀请的好友 = 我的好友里，还没在群成员名单里的
const invitableFriends = computed(() => {
  const existingIds = new Set(groupMembers.value.map(m => Number(m.userId)))
  return friendChats.value.filter(f => !existingIds.has(Number(f.id)))
})

const openInviteFromPanel = () => {
  inviteSelected.value = []
  loadFriends()
  showInvitePicker.value = true
}

const toggleInviteMember = (id) => {
  const idx = inviteSelected.value.indexOf(id)
  if (idx > -1) inviteSelected.value.splice(idx, 1)
  else inviteSelected.value.push(id)
}

const submitInvite = async () => {
  if (inviteSelected.value.length === 0 || !activeChat.value) return
  try {
    const res = await http.post(`/group/${activeChat.value.id}/invite`, {
      memberIds: inviteSelected.value
    })
    if (res.status === 200 || res.code === 200) {
      showInvitePicker.value = false
      await openMemberPanel()
      const newCount = groupMembers.value.length
      activeChat.value.memberCount = newCount
      const g = groupChats.value.find(x => Number(x.id) === Number(activeChat.value.id))
      if (g) g.memberCount = newCount
    } else {
      alert(res.message || '邀请失败')
    }
  } catch (e) {
    alert('邀请失败,请检查网络')
  }
}

// ============ 用户资料卡 ============
const showUserProfile = ref(false)
const userProfileLoading = ref(false)
const userProfileData = ref(null)
const profileMoments = ref([])
const profileMomentsLoading = ref(false)
const showProfileMomentsPanel = ref(false)
const loadFriendRemarks = () => {
  try {
    return JSON.parse(localStorage.getItem('friend_remarks') || '{}')
  } catch (e) {
    return {}
  }
}
const friendRemarks = ref(loadFriendRemarks())
const profileUser = computed(() => userProfileData.value?.user || null)
const profileFriendChat = computed(() => {
  if (!profileUser.value) return null
  return friendChats.value.find(item => Number(item.id) === Number(profileUser.value.userId)) || null
})
const profileRemark = computed(() => {
  if (!profileUser.value) return ''
  return friendRemarks.value[String(profileUser.value.userId)] || ''
})
const profileDisplayName = computed(() => {
  if (Number(profileUser.value?.userId) === myId) return '我'
  return profileRemark.value || profileUser.value?.nickname || '神秘朋友'
})
const profileMomentsTitle = computed(() => Number(profileUser.value?.userId) === myId ? '我的朋友圈' : `${profileDisplayName.value}的朋友圈`)
const canRemarkProfile = computed(() => !!profileFriendChat.value && Number(profileUser.value?.userId) !== myId)

const saveFriendRemarks = () => {
  localStorage.setItem('friend_remarks', JSON.stringify(friendRemarks.value))
}

const closeUserProfile = () => {
  showUserProfile.value = false
}

const onDeleteFriendFromProfile = async (friendId) => {
  const ok = await deleteFriend(friendId)
  if (ok) showUserProfile.value = false
}

const requestVerifyFromProfile = () => {
  showUserProfile.value = false
  localStorage.setItem('openVerifyUpload', '1')
  currentTab.value = 'status'
  window.dispatchEvent(new Event('open-verify-upload'))
}

const closeProfileMomentsPanel = () => {
  showProfileMomentsPanel.value = false
}

const openUserProfile = async (userId) => {
  if (!userId) return
  showUserProfile.value = true
  showProfileMomentsPanel.value = false
  userProfileLoading.value = true
  profileMomentsLoading.value = true
  userProfileData.value = null
  profileMoments.value = []
  try {
    const [profileRes, momentsRes] = await Promise.allSettled([
      http.get(`/team/status/profile/${userId}`),
      http.get(`/moment/user/${userId}`)
    ])

    if (profileRes.status === 'fulfilled' && (profileRes.value.status === 200 || profileRes.value.code === 200)) {
      userProfileData.value = profileRes.value.data
      const user = userProfileData.value?.user
      if (user?.radarTags) {
        user.radarTagList = discoveryTagLabels(user.radarTags)
      }
    }

    if (momentsRes.status === 'fulfilled' && (momentsRes.value.status === 200 || momentsRes.value.code === 200)) {
      profileMoments.value = (momentsRes.value.data || []).map(mapMoment)
    }
  } catch (e) {
    console.error('加载用户资料失败', e)
  } finally {
    userProfileLoading.value = false
    profileMomentsLoading.value = false
  }
}

const openProfileMomentsPanel = () => {
  if (profileMomentsLoading.value) return
  showProfileMomentsPanel.value = true
}

const openMyMoments = async () => {
  showUserProfile.value = false
  showProfileMomentsPanel.value = true
  profileMomentsLoading.value = true
  userProfileData.value = {
    user: {
      userId: myId,
      nickname: myCard.value.name,
      avatar: myCard.value.avatar
    }
  }
  profileMoments.value = []
  try {
    const res = await http.get(`/moment/user/${myId}`)
    if (res.status === 200 || res.code === 200) {
      profileMoments.value = (res.data || []).map(mapMoment)
    }
  } catch (e) {
    console.error('我的朋友圈加载失败', e)
  } finally {
    profileMomentsLoading.value = false
  }
}

const editProfileRemark = () => {
  if (!canRemarkProfile.value || !profileUser.value) return
  const nextRemark = prompt('备注', profileRemark.value || profileUser.value.nickname || '')
  if (nextRemark === null) return
  const key = String(profileUser.value.userId)
  const clean = nextRemark.trim()
  if (clean) {
    friendRemarks.value[key] = clean
  } else {
    delete friendRemarks.value[key]
  }
  friendRemarks.value = { ...friendRemarks.value }
  saveFriendRemarks()

  const friend = friendChats.value.find(item => Number(item.id) === Number(profileUser.value.userId))
  if (friend) {
    friend.rawName = profileUser.value.nickname || friend.rawName || friend.name
    friend.name = clean || friend.rawName
  }
}

// 送个奇怪招呼：主页/同城遇见的人都能打招呼（走 react，后端每人每天一次额度）
const greetFromUserProfile = async (reactionKey) => {
  if (!profileUser.value) return
  if (Number(profileUser.value.userId) === myId) return
  if (profileUser.value.reactedToday) { alert('今天已经给 TA 打过招呼啦，明天再来 🌙'); return }
  const key = reactionKey || 'seen'
  try {
    const res = await http.post('/team/status/react', {
      targetUserId: profileUser.value.userId,
      reactionType: key
    })
    if (res.status === 200 || res.code === 200) {
      profileUser.value.reactedToday = 1
      profileUser.value.reactions = (profileUser.value.reactions || 0) + 1
      if (userProfileData.value) userProfileData.value.iSent = (userProfileData.value.iSent || 0) + 1
      alert('招呼已送达 👋')
    } else {
      alert(res.message || '今天已打过招呼啦 🌙')
    }
  } catch (e) {
    const msg = e?.response?.data?.message
    alert(msg || '今天已经打过招呼啦 🌙')
  }
}

const startChatFromProfile = () => {
  if (!profileUser.value || Number(profileUser.value.userId) === myId) return
  const existing = friendChats.value.find(item => Number(item.id) === Number(profileUser.value.userId))
  const chat = existing || {
    type: 'single',
    id: profileUser.value.userId,
    name: profileDisplayName.value,
    rawName: profileUser.value.nickname || '神秘朋友',
    avatar: avatarOf(profileUser.value, profileUser.value.userId),
    lastMsg: '点击发起密聊...',
    time: '',
    unread: null
  }
  showUserProfile.value = false
  showRadarModal.value = false
  showMemberPanel.value = false
  emit('chat-active', true)
  openChat(chat)
}

const openFriendPicker = () => {
  showFabMenu.value = false
  loadFriends()
  showFriendPicker.value = true
}

const openCreateGroup = () => {
  showFabMenu.value = false
  newGroupName.value = ''
  selectedMembers.value = []
  loadFriends()
  showCreateGroup.value = true
}

const openBroadcast = () => {
  showFabMenu.value = false
  broadcastText.value = ''
  broadcastReceiverIds.value = friendChats.value.map(f => f.id)
  showBroadcast.value = true
}

const startPrivateChat = (friend) => {
  showFriendPicker.value = false
  openChat(friend)
}

const toggleSelectMember = (id) => {
  const idx = selectedMembers.value.indexOf(id)
  if (idx > -1) selectedMembers.value.splice(idx, 1)
  else selectedMembers.value.push(id)
}

const createGroup = async () => {
  if (!newGroupName.value.trim()) {
    alert('给小队起个名字吧')
    return
  }
  try {
    const res = await http.post('/group/create', {
      name: newGroupName.value.trim(),
      memberIds: selectedMembers.value
    })
    if (res.status === 200 || res.code === 200) {
      showCreateGroup.value = false
      await loadGroups()
      currentTab.value = 'chat'
      alert('小队已创建 🎉')
    } else {
      alert(res.message || '创建失败')
    }
  } catch (e) {
    alert('创建失败,请检查网络')
  }
}

const sendBroadcast = async () => {
  const content = broadcastText.value.trim()
  if (!content) return
  if (broadcastReceiverIds.value.length === 0) {
    alert('先选择要广播给谁')
    return
  }
  isSendingBroadcast.value = true
  try {
    const res = await http.post('/chat/broadcast', { content, receiverIds: broadcastReceiverIds.value })
    if (res.status === 200 || res.code === 200) {
      showBroadcast.value = false
      broadcastText.value = ''
      broadcastReceiverIds.value = []
      alert(res.message || `已发送给 ${broadcastReceiverIds.value.length} 人`)
    } else {
      alert(res.message || '广播失败')
    }
  } catch (e) {
    alert('广播失败,请检查网络')
  } finally {
    isSendingBroadcast.value = false
  }
}

const toggleBroadcastReceiver = (id) => {
  const idx = broadcastReceiverIds.value.indexOf(id)
  if (idx > -1) broadcastReceiverIds.value.splice(idx, 1)
  else broadcastReceiverIds.value.push(id)
}

const loadPendingRequests = async () => {
  try {
    const res = await http.get('/friend/requests')
    if (res.status === 200 || res.code === 200) {
      const requests = res.data || []
      const previousIds = knownRequestIds.value
      pendingRequests.value = requests
      const nextIds = new Set(requests.map(item => Number(item.friendshipId || item.id)))
      if (friendSyncReady.value) {
        const newRequest = requests.find(item => !previousIds.has(Number(item.friendshipId || item.id)))
        if (newRequest) {
          currentTab.value = 'contacts'
          alert(`${newRequest.nickname || '有人'} 想和你成为朋友`)
        }
      }
      knownRequestIds.value = nextIds
      return pendingRequests.value
    }
  } catch (error) {
    console.error("拉取申请列表失败:", error)
  }
  return pendingRequests.value
}

const sendFriendRequest = async (targetId, options = {}) => {
  if (!targetId) return false
  try {
    // 对应后端: @RequestBody Friendship request -> { addresseeId: xx }
    const res = await http.post('/friend/request', { addresseeId: Number(targetId) })
    if (res.status === 200 || res.code === 200) {
      if (options.user) options.user.requested = true
      alert(options.successMessage || "好友申请已发送")
      syncFriendState()
      return true
    } else {
      alert(res.message || res.msg || "发送失败")
      return false
    }
  } catch (error) {
    alert(error?.response?.data?.message || "请求网络异常")
    return false
  }
}

const acceptRequest = async (id) => {
  try {
    // 对应你的后端: /api/friend/accept/{id}
    const res = await http.post(`/friend/accept/${id}`)
    if (res.status === 200 || res.code === 200) {
      alert("已成为伙伴！")
      await Promise.all([
        loadPendingRequests(),
        loadFriends()
      ])
    } else {
      alert(res.message || res.msg || "操作失败")
    }
  } catch (error) {
    alert("操作失败")
  }
}

const deleteFriend = async (friendId) => {
  if (!friendId) return false
  if (!confirm('确定要解除好友关系吗？聊天记录会保留，但需要重新加好友才能继续私聊。')) return false
  try {
    // 对应后端: POST /api/friend/delete/{friendId}
    const res = await http.post(`/friend/delete/${friendId}`)
    if (res.status === 200 || res.code === 200) {
      alert('已解除好友关系')
      // 如果正在和这个人聊天，退出会话
      if (activeChat.value && Number(activeChat.value.id) === Number(friendId)) {
        activeChat.value = null
      }
      await loadFriends()
      return true
    }
    alert(res.message || res.msg || '操作失败')
    return false
  } catch (error) {
    alert(error?.response?.data?.message || '操作失败')
    return false
  }
}

const syncFriendState = async () => {
  await Promise.all([
    loadPendingRequests(),
    loadFriends()
  ])
}

const startFriendSync = () => {
  clearInterval(friendSyncTimer)
  friendSyncTimer = setInterval(syncFriendState, 4000)
}

const hasSocialOverlay = () => {
  return imageViewer.value.show ||
    showProfileMomentsPanel.value ||
    showUserProfile.value ||
    showSeenPicksPanel.value ||
    showRadarModal.value ||
    currentView.value === 'chat'
}

const closeTopSocialLayer = () => {
  if (imageViewer.value.show) {
    closeImageViewer()
    return true
  }
  if (showProfileMomentsPanel.value) {
    closeProfileMomentsPanel()
    return true
  }
  if (showUserProfile.value) {
    closeUserProfile()
    return true
  }
  if (showSeenPicksPanel.value) {
    showSeenPicksPanel.value = false
    return true
  }
  if (showRadarModal.value) {
    closeCityPicks()
    return true
  }
  if (currentView.value === 'chat') {
    closeChat()
    return true
  }
  return false
}

const ensureSocialHistoryGuard = () => {
  if (typeof window === 'undefined') return
  window.history.pushState({ socialGuard: true }, '')
}

const handleSocialBack = () => {
  if (closeTopSocialLayer()) {
    ensureSocialHistoryGuard()
  }
}

onMounted(async () => {
  ensureSocialHistoryGuard()
  window.addEventListener('popstate', handleSocialBack)
  initWebSocket()
  await syncFriendState()
  friendSyncReady.value = true
  startFriendSync()
  loadGroups()
  loadMoments()
  loadWarmth()
  loadMyCity()
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleSocialBack)
  clearInterval(friendSyncTimer)
  clearTimeout(chatSearchTimer)
})

const plusMenuItems = [
  { icon: 'ri-image-2-line', label: '相册', color: 'text-blue-500', action: 'album' },
  { icon: 'ri-camera-3-line', label: '拍摄', color: 'text-slate-700', action: 'camera' },
  { icon: 'ri-map-pin-line', label: '位置', color: 'text-red-500', action: 'location' },
  { icon: 'ri-folder-2-line', label: '文件', color: 'text-orange-500', action: 'file' },
  { icon: 'ri-vidicon-line', label: '视频通话', color: 'text-green-500', action: 'call' },
  { icon: 'ri-lock-2-line', label: '密聊', color: 'text-violet-500', action: 'secret' }
]

const myCity = ref(localStorage.getItem('myCity') || '')
const myProvince = ref(localStorage.getItem('myProvince') || '')
const myDistrict = ref(localStorage.getItem('myDistrict') || '')
const isLocating = ref(false)
const locationStatus = ref('')
const lastLocation = ref(JSON.parse(localStorage.getItem('lastLocation') || 'null'))

const cityDisplay = computed(() => {
  return [myProvince.value, myCity.value].filter(Boolean).join(' · ')
})

const loadMyCity = async () => {
  try {
    const res = await http.get('/center/info')
    if (res.status === 200 && res.data) {
      myCard.value.name = res.data.nickname || getAuthItem('nickname') || myCard.value.name
      myCard.value.avatar = avatarOf(res.data.avatar, res.data.userId || res.data.nickname || myId)
      myCard.value.sign = res.data.radarSign || ''
      myCard.value.cover = res.data.profileCover || myCard.value.cover
      myCard.value.style = res.data.profileStyle || myCard.value.style
      myCard.value.city = res.data.city || myCard.value.city
      if (typeof res.data.discoveryEnabled === 'boolean') {
        discoveryEnabled.value = res.data.discoveryEnabled
      }
      if (res.data.radarSign) {
        broadcastSign.value = res.data.radarSign
      }
      const savedTags = normalizeDiscoveryTags(res.data.radarTags || res.data.radarTagList)
      if (savedTags.length) {
        selectedTags.value = savedTags.slice(0, 3)
      }
    }
    if (res.status === 200 && res.data?.city) {
      myProvince.value = res.data.province || ''
      myCity.value = res.data.city
      myDistrict.value = res.data.district || ''
      localStorage.setItem('myProvince', myProvince.value)
      localStorage.setItem('myCity', myCity.value)
      localStorage.setItem('myDistrict', myDistrict.value)
    }
  } catch (e) {
    console.error('读取城市失败', e)
  }
}

const saveMyCity = async (showTip = true) => {
  if (!myCity.value) return
  myCard.value.city = myCity.value
  try {
    const res = await http.post('/center/update-basic', {
      province: myProvince.value,
      city: myCity.value,
      district: myDistrict.value
    })
    if (showTip && (res.status === 200 || res.code === 200)) {
      locationStatus.value = `同城精选已切到「${cityDisplay.value || myCity.value}」。`
    }
  } catch (e) {
    console.error('保存城市失败', e)
    if (showTip) {
      locationStatus.value = '城市已先保存到本机，联网后会同步到账号。'
    }
  }
}

const reverseGeocodeLocation = (latitude, longitude) => new Promise((resolve, reject) => {
  const callbackName = 'jsonp_city_' + Date.now()
  const script = document.createElement('script')
  const cleanup = () => {
    delete window[callbackName]
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }

  window[callbackName] = (res) => {
    cleanup()
    if (res.status === 0 && res.result?.address_component) {
      resolve(res.result.address_component)
    } else {
      reject(new Error(res.message || '城市识别失败'))
    }
  }

  script.src = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${TENCENT_MAP_KEY}&get_poi=0&output=jsonp&callback=${callbackName}`
  script.onerror = () => {
    cleanup()
    reject(new Error('城市识别失败'))
  }
  document.body.appendChild(script)
})

const applyLocatedCity = (component) => {
  if (!component) return false
  const province = component.province || ''
  let city = component.city || ''
  const district = component.district || ''

  if (!city || city === '市辖区' || city === '县') {
    city = province
  }
  if (!city) return false

  myProvince.value = province
  myCity.value = city
  myDistrict.value = district
  localStorage.setItem('myProvince', myProvince.value)
  localStorage.setItem('myCity', myCity.value)
  localStorage.setItem('myDistrict', myDistrict.value)
  localStorage.removeItem('myAreaCode')
  return true
}

const detectAndSaveLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) {
    locationStatus.value = myCity.value
      ? `无法重新定位，先按已保存城市「${cityDisplay.value || myCity.value}」匹配。`
      : '当前设备不支持定位，暂时无法使用同城精选。'
    resolve(!!myCity.value)
    return
  }

  if (isLocating.value) {
    resolve(!!myCity.value)
    return
  }

  isLocating.value = true
  locationStatus.value = '正在确认你所在的城市...'

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords
      lastLocation.value = { latitude, longitude }
      localStorage.setItem('lastLocation', JSON.stringify(lastLocation.value))

      try {
        const cityComponent = await reverseGeocodeLocation(latitude, longitude)
        const applied = applyLocatedCity(cityComponent)
        if (!applied) {
          locationStatus.value = myCity.value
            ? `城市识别暂时失败，先按已保存城市「${cityDisplay.value || myCity.value}」匹配。`
            : '定位成功，但没有识别到城市，稍后再试一次。'
          isLocating.value = false
          resolve(!!myCity.value)
          return
        }

        await saveMyCity(false)
      } catch (e) {
        console.warn('城市识别暂时不可用', e?.message || e)
        locationStatus.value = myCity.value
          ? `城市识别暂时失败，先按已保存城市「${cityDisplay.value || myCity.value}」匹配。`
          : '定位成功，但城市识别失败，稍后再试一次。'
        isLocating.value = false
        resolve(!!myCity.value)
        return
      }

      try {
        await http.post('/radar/location', {
          longitude,
          latitude,
          city: myCity.value || ''
        })
      } catch (e) {
        console.error('同步定位失败', e)
      }

      locationStatus.value = `已定位到「${cityDisplay.value || myCity.value}」，我的主页城市已同步更新。同城精选只按城市匹配。`
      isLocating.value = false
      resolve(true)
    },
    (err) => {
      console.error('定位失败', err)
      locationStatus.value = myCity.value
        ? `定位失败或未授权，先按已保存城市「${cityDisplay.value || myCity.value}」匹配。`
        : '定位失败或未授权，暂时无法查看同城精选。'
      isLocating.value = false
      resolve(!!myCity.value)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
})

const manualRefreshLocation = async () => {
  const ok = await detectAndSaveLocation()
  if (ok && myCity.value) {
    await saveMyCity(false)
  }
}

const handlePlusItem = async (item) => {
  showPlusMenu.value = false
  if (item.action === 'album') {
    document.getElementById('chat-album-input')?.click()
  } else if (item.action === 'camera') {
    document.getElementById('chat-camera-input')?.click()
  } else if (item.action === 'file') {
    document.getElementById('chat-file-input')?.click()
  } else if (item.action === 'location') {
    sendLocationMessage()
  } else if (item.action === 'secret') {
    if (!activeChat.value || activeChat.value.type === 'group') {
      alert('密聊只适合一对一。')
      return
    }
    secretMode.value = !secretMode.value
    alert(secretMode.value ? '已进入密聊：不保存记录，10 秒后消失。' : '已退出密聊。')
  } else if (item.action === 'call') {
    alert('视频通话先不硬上半成品，发布版先保证聊天稳定。')
  } else {
    alert('这个功能稍后再开。')
  }
}

const sendImageFile = async (e) => {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  try {
    const imgUrl = await uploadOneMedia(file)
    if (!imgUrl) throw new Error('上传接口没有返回图片地址')
    await dispatchMessage(imgUrl, 'image')
  } catch (err) {
    console.error('图片发送失败', err)
    alert('图片发送失败，可能是网络慢或图片格式过大')
  }
}

const sendGenericFile = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    alert('文件先限制 20MB 以内，避免手机网络炸掉。')
    return
  }
  try {
    const url = await uploadOneMedia(file)
    if (!url) throw new Error('上传接口没有返回文件地址')
    await dispatchMessage(JSON.stringify({
      url,
      name: file.name || '文件',
      sizeText: formatFileSize(file.size)
    }), 'file')
  } catch (err) {
    console.error('文件发送失败', err)
    alert('文件发送失败，可能是网络慢或文件过大')
  }
}

const sendLocationMessage = async () => {
  const city = myCity.value || '神秘地点'
  const mapText = lastLocation.value
    ? `\n坐标：${lastLocation.value.latitude.toFixed(5)}, ${lastLocation.value.longitude.toFixed(5)}\n地图：https://uri.amap.com/marker?position=${lastLocation.value.longitude},${lastLocation.value.latitude}&name=${encodeURIComponent(city)}`
    : ''
  const content = `📍 我在 ${city}${mapText}`
  await dispatchMessage(content, 'text')
}

const openChat = async (item) => {
  activeChat.value = item
  currentView.value = 'chat'
  chatHistory.value = []
  item.unread = null
  emit('chat-active', true)
  try {
    if (item.type === 'group') {
      const res = await http.get(`/group/${item.id}/messages`)
      if (res.status === 200 || res.code === 200) {
        chatHistory.value = (res.data || []).map(m => ({
          id: m.id,
          senderId: m.senderId,
          content: m.content,
          type: m.type,
          senderName: m.senderName,
          senderAvatar: m.senderAvatar
        }))
        scrollToBottom()
      }
    } else {
      const res = await http.get(`/chat/history?friendId=${item.id}`)
      if (res.status === 200 || res.code === 200) {
        chatHistory.value = res.data
        item.unread = null
        scrollToBottom()
      }
    }
  } catch (error) {
    console.error("拉取聊天记录失败:", error)
  }
}

// 统一发送：根据当前会话类型走单聊或群聊接口
const dispatchMessage = async (content, type = 'text') => {
  if (!activeChat.value) return
  const isSecret = secretMode.value && activeChat.value.type !== 'group'
  const tempMsg = {
    id: Date.now(),
    senderId: myId,
    receiverId: activeChat.value.id,
    content,
    type,
    senderName: myCard.value.name,
    secret: isSecret
  }
  chatHistory.value.push(tempMsg)
  scrollToBottom()
  try {
    if (isSecret) {
      await http.post('/chat/secret', { receiverId: activeChat.value.id, content, type })
      touchChatPreview(activeChat.value.type, activeChat.value.id, content, 'secret')
      setTimeout(() => {
        chatHistory.value = chatHistory.value.filter(msg => msg.id !== tempMsg.id)
      }, 10000)
      return
    }
    if (activeChat.value.type === 'group') {
      await http.post(`/group/${activeChat.value.id}/send`, { content, type })
    } else {
      await http.post('/chat/send', { receiverId: activeChat.value.id, content, type })
    }
    touchChatPreview(activeChat.value.type, activeChat.value.id, content, type)
  } catch (error) {
    console.error("发送失败:", error)
    alert("发送失败，请检查网络")
  }
}

const closeChat = () => {
  currentView.value = 'list'
  activeChat.value = null
  secretMode.value = false
  emit('chat-active', false)
}

const sendMessage = async () => {
  const content = inputMsg.value.trim()
  if (!content) return
  inputMsg.value = ''
  await dispatchMessage(content, 'text')
}

const initWebSocket = () => {
  if (typeof(WebSocket) === "undefined") {
    console.error("您的浏览器不支持 WebSocket")
    return
  }

  const wsUrl = getWsBaseURL(myId)
  socket = new WebSocket(wsUrl)

  socket.onopen = () => console.log("🟢 WebSocket 链路已接通")

  socket.onmessage = (event) => {
    console.log("收到新消息：", event.data)

    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      // 兼容老格式纯文本
      data = { kind: 'single', senderId: activeChat.value?.id, content: event.data, type: 'text' }
    }

    if (data.kind === 'group') {
      const inThisGroup = activeChat.value && activeChat.value.type === 'group' && Number(activeChat.value.id) === Number(data.groupId)
      if (inThisGroup) {
        chatHistory.value.push({
          id: Date.now(),
          senderId: data.senderId,
          content: data.content,
          type: data.type || 'text',
          senderName: data.senderName,
          senderAvatar: data.senderAvatar
        })
        touchChatPreview('group', data.groupId, data.content, data.type || 'text')
        scrollToBottom()
      } else {
        bumpUnread('group', data.groupId, data.content, data.type || 'text')
      }
    } else {
      const inThisChat = activeChat.value && activeChat.value.type !== 'group' && Number(activeChat.value.id) === Number(data.senderId)
      const displayType = data.type || 'text'
      const previewType = data.secret ? 'secret' : displayType
      if (inThisChat) {
        const incomingMsg = {
          id: Date.now(),
          senderId: data.senderId,
          content: data.content,
          type: displayType,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          secret: !!data.secret
        }
        chatHistory.value.push(incomingMsg)
        touchChatPreview('single', data.senderId, data.content, previewType)
        scrollToBottom()
        if (data.secret) {
          setTimeout(() => {
            chatHistory.value = chatHistory.value.filter(msg => msg.id !== incomingMsg.id)
          }, Number(data.ttl || 10) * 1000)
        }
      } else {
        bumpUnread('single', data.senderId, data.content, previewType)
      }
    }
  }

  socket.onclose = () => console.log("🔴 WebSocket 链路已断开")
  socket.onerror = () => console.error("❌ WebSocket 发生错误")
}

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.getElementById('chat-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}


</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}
.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.city-picks-page {
  background:
    radial-gradient(circle at 76% 10%, rgba(251, 191, 36, 0.18), transparent 9rem),
    radial-gradient(circle at 12% 20%, rgba(125, 211, 252, 0.2), transparent 10rem),
    linear-gradient(180deg, #f8f4ec 0%, #f4efe6 46%, #fbf9f5 100%);
}

.city-picks-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(18px);
  opacity: 0.54;
  transform: translateZ(0);
}

.city-picks-orb-a {
  right: -40px;
  top: 18%;
  width: 140px;
  height: 140px;
  background: rgba(251, 191, 36, 0.18);
}

.city-picks-orb-b {
  left: -52px;
  bottom: 18%;
  width: 170px;
  height: 170px;
  background: rgba(56, 189, 248, 0.13);
}

.city-pick-card {
  animation: city-pick-rise 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes city-pick-rise {
  from {
    transform: translate3d(0, 14px, 0) scale(0.985);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;}

@keyframes checkin-pop {
  0% { transform: scale(0.5); opacity: 0; }
  55% { transform: scale(1.08); opacity: 1; }
  70% { transform: scale(0.96); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-checkin-pop {
  animation: checkin-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes checkin-check {
  0% { transform: scale(0) rotate(-30deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
.animate-checkin-check {
  animation: checkin-check 0.55s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes checkin-points {
  0% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-checkin-points {
  animation: checkin-points 0.4s 0.35s ease-out both;
}

/* 全屏发布页：从右侧滑入，沉浸感 */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease;
}
.page-slide-enter-from,
.page-slide-leave-to {
  transform: translateX(100%);
  opacity: 0.6;
}
</style>
