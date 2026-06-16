<template>
  <div class="relative h-full bg-[#FBF9F5] flex flex-col overflow-hidden">

    <div v-show="currentView === 'list'" class="flex-1 overflow-y-auto custom-scroll w-full z-10 relative bg-[#FBF9F5] flex flex-col">

      <!-- ============ 朋友圈封面 Hero ============ -->
      <div class="shrink-0 relative">
        <!-- 封面图 -->
        <div class="relative h-[calc(9.5rem+env(safe-area-inset-top,0px))] overflow-hidden">
          <img :src="myCard.cover" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>

          <!-- 封面右上：创建入口 -->
          <div class="absolute top-[calc(env(safe-area-inset-top,0px)+0.75rem)] right-4 z-10 flex items-center gap-2">
            <button @click="openPaperBoat" class="w-10 h-10 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="星河漂流">
              <i class="ri-ship-line text-base"></i>
            </button>
            <button @click.stop="showQuickCreateMenu = !showQuickCreateMenu" class="w-10 h-10 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="创建">
              <i class="ri-add-line text-[22px] transition-transform" :class="{ 'rotate-45': showQuickCreateMenu }"></i>
            </button>

            <transition name="fade-up">
              <div v-if="showQuickCreateMenu" class="fixed top-[calc(env(safe-area-inset-top,0px)+3.6rem)] right-4 z-[220] w-40 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_18px_42px_-24px_rgba(15,23,42,0.45)] overflow-hidden p-1.5">
                <button @click="openAddFriendShortcut" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-700 active:bg-slate-100 transition-all">
                  <span class="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><i class="ri-user-add-line"></i></span>
                  添加好友
                </button>
                <button @click="openComposerFromQuickMenu" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-700 active:bg-slate-100 transition-all">
                  <span class="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center"><i class="ri-quill-pen-line"></i></span>
                  发动态
                </button>
              </div>
            </transition>
          </div>

          <!-- 右下：用户信息 -->
          <div class="absolute bottom-3 left-4 right-4 z-10">
            <div class="flex items-end justify-between gap-3">
              <div class="min-w-0">
                <p class="text-white/70 text-[10px] font-bold tracking-wide mb-0.5">我的主页</p>
                <h2 class="text-white text-[20px] font-bold tracking-tight leading-tight drop-shadow-md">{{ myCard.name }}</h2>
                <p class="text-white/85 text-[11.5px] font-medium tracking-wide drop-shadow-sm mt-0.5 line-clamp-2">{{ myCard.sign }}</p>
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
            <span class="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          </button>
          <button @click="currentTab = 'contacts'" :class="currentTab === 'contacts' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
            联络人
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
              <div class="px-5 pt-4">
                <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/50 rounded-[28px] p-5 border border-indigo-100/50 shadow-[0_8px_30px_rgba(99,102,241,0.06)] backdrop-blur-xl">
                  <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl"></div>
                  <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-300/10 rounded-full blur-2xl"></div>

                  <div class="relative z-10">
                    <div class="flex flex-col gap-1.5 mb-3">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black tracking-[0.15em] text-indigo-600 uppercase px-2.5 py-1 bg-indigo-50 rounded-full border border-indigo-100/80">
                          ✦ 痛痛共鸣舱
                        </span>
                        <span class="text-[11px] font-black text-rose-500 flex items-center gap-1 shrink-0">
                          <i class="ri-heart-pulse-fill animate-pulse"></i> {{ warmthPoints }} 暖心值
                        </span>
                      </div>
                    </div>

                    <h3 class="text-[15px] font-black text-slate-800 tracking-tight mb-1">肚子抽痛或感到孤独？</h3>
                    <p class="text-[12px] text-slate-500 leading-relaxed mb-4">一键向附近的战友发送微光信号，无言守护，默默陪伴。</p>

                    <!-- 交互按钮区域 -->
                    <div class="flex gap-2.5">
                      <button
                        @click="triggerPainRescue"
                        :disabled="isBroadcasting"
                        class="flex-1 py-3 px-4 rounded-2xl text-[12px] font-black text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:from-slate-400 disabled:to-slate-500"
                      >
                        <i class="ri-heart-add-fill" :class="{ 'animate-pulse': isBroadcasting }"></i>
                        {{ isBroadcasting ? '信号广播中...' : '一键痛痛呼救 🩹' }}
                      </button>

                      <button
                        @click="openPatrolSignal"
                        class="py-3 px-4 rounded-2xl text-[12px] font-black text-slate-700 bg-white border border-stone-200 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <i class="ri-radar-line text-indigo-500 animate-pulse"></i>
                        暖暖他人 🫂
                      </button>
                    </div>

                    <!-- 广播时涟漪雷达效果 -->
                    <div v-if="isBroadcasting" class="mt-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-100 flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                      <div class="relative w-16 h-16 flex items-center justify-center mb-2">
                        <span class="absolute w-12 h-12 rounded-full bg-indigo-500/20 animate-ping"></span>
                        <span class="absolute w-8 h-8 rounded-full bg-pink-500/30 animate-pulse"></span>
                        <i class="ri-radar-line text-indigo-600 text-2xl z-10 relative"></i>
                      </div>
                      <p class="text-[11.5px] font-bold text-indigo-700 animate-pulse">痛痛微光已向全网放飞... 别怕，有我们在</p>
                      <div class="text-[10px] text-slate-400 mt-1">深呼吸，吸气... 呼气... 🍂</div>
                    </div>

                    <!-- 接收反馈的浮窗气泡 -->
                    <transition-group name="fade-up">
                      <div
                        v-for="comfort in incomingComforts"
                        :key="comfort.id"
                        class="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11.5px] font-bold flex items-center gap-2 shadow-md shadow-emerald-500/10"
                      >
                        <i class="ri-sparkling-fill"></i>
                        <span>{{ comfort.text }}</span>
                      </div>
                    </transition-group>

                    <!-- 查看他人痛痛求助 -->
                    <transition name="fade-up">
                      <div v-if="showPatrol" class="mt-4 p-4 rounded-2xl bg-white border border-stone-150 space-y-3 animate-in fade-in duration-300">
                        <h4 class="text-[12px] font-black text-slate-700 flex items-center gap-1">
                          <i class="ri-notification-fill text-amber-500"></i> 附近的痛苦共鸣信号
                        </h4>

                        <div v-if="patrolPatients.length === 0" class="text-center py-2 text-[11px] text-slate-400 font-bold">
                          目前天空晴朗，没有战友在难受 🌤️
                        </div>

                        <div
                          v-for="p in patrolPatients"
                          :key="p.id"
                          class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 animate-in fade-in duration-300"
                        >
                          <div>
                            <div class="flex items-center gap-1">
                              <span class="text-[12px] font-black text-slate-800">{{ p.name }}</span>
                              <span class="text-[9px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-bold">{{ p.dist }}</span>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-0.5">{{ p.sign }}</p>
                          </div>

                          <button
                            @click="sendWarmthTo(p)"
                            :disabled="p.warmed"
                            class="px-3 py-1.5 rounded-full text-[10.5px] font-black text-white bg-slate-900 shadow-sm active:scale-95 transition-all disabled:bg-emerald-500 disabled:text-white"
                          >
                            {{ p.warmed ? '已送暖 🩹' : '揉揉暖腹 🩹' }}
                          </button>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
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
                <p class="text-[11.5px] text-slate-500 font-medium truncate mt-0.5">{{ myCard.sign }}</p>
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
              <div class="relative shrink-0">
                <img :src="post.user.avatar" class="w-11 h-11 rounded-2xl border border-white shadow-sm bg-stone-100" />
                <span v-if="post.user.online" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[14.5px] font-black text-slate-900 tracking-tight">{{ post.user.name }}</span>
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
                  <p class="text-white/55 text-[12px] font-medium leading-relaxed">
                    同城看当前城市，远方看天南海北。每天少量，不刷人。
                  </p>
                </div>
                <div class="shrink-0 w-14 h-14 rounded-[22px] bg-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-cyan-100 text-slate-950 flex items-center justify-center shadow-[0_0_28px_rgba(255,255,255,0.24)]">
                    <i class="ri-compass-3-line text-xl"></i>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-[1fr_auto] gap-2">
                <div
                  class="min-w-0 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-[13px] font-black flex items-center justify-between gap-2"
                  :class="myCity ? 'text-white' : 'text-white/45'"
                >
                  <span class="truncate">{{ cityDisplay || '定位后确认当前城市' }}</span>
                  <i class="ri-shield-check-line text-base text-white/45 shrink-0"></i>
                </div>
                <button
                  @click="detectAndSaveLocation"
                  :disabled="isLocating"
                  class="px-4 py-3 rounded-2xl text-[12px] font-black text-slate-950 bg-white shadow-md shadow-white/10 active:scale-95 transition-all disabled:bg-white/40 disabled:text-white/60"
                >
                  <i class="ri-crosshair-2-line" :class="{ 'animate-pulse': isLocating }"></i>
                  {{ isLocating ? '确认中' : '定位确认' }}
                </button>
              </div>

              <p v-if="locationStatus" class="text-[11px] font-bold text-white/45 leading-relaxed">
                {{ locationStatus }}
              </p>

              <div class="rounded-[24px] bg-white/10 border border-white/10 p-3.5 space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[13px] font-black text-white">允许被遇见</p>
                    <p class="text-[10.5px] font-bold text-white/42 mt-0.5">关闭后不会出现在同城和远方推荐里</p>
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
                  placeholder="一句话介绍你的情况，比如：缓解期，想认识能互相鼓劲的人。"
                  class="w-full rounded-2xl bg-white/10 border border-white/10 px-3.5 py-3 text-[12.5px] font-bold text-white placeholder-white/30 outline-none resize-none focus:bg-white/14 transition-all"
                  @blur="saveDiscoverySettings"
                ></textarea>

                <div class="flex gap-1.5 overflow-x-auto custom-scroll -mx-0.5 px-0.5">
                  <button
                    v-for="tag in lifeTags"
                    :key="tag.id"
                    @click="toggleTag(tag.id)"
                    class="shrink-0 px-2.5 py-1.5 rounded-full text-[10.5px] font-black border transition-all active:scale-95"
                    :class="selectedTags.includes(tag.id) ? 'bg-white text-slate-950 border-white' : 'bg-white/8 text-white/50 border-white/10'"
                  >
                    {{ tag.icon }} {{ tag.label }}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <button
                  @click="openDiscovery('city')"
                  class="min-h-[78px] rounded-[22px] bg-white/10 border border-white/10 text-white active:scale-95 transition-all flex flex-col items-start justify-center px-4 text-left"
                >
                  <span class="w-8 h-8 rounded-2xl bg-white/15 text-cyan-100 flex items-center justify-center mb-2"><i class="ri-map-pin-user-line"></i></span>
                  <span class="text-[13px] font-black">同城精选</span>
                  <span class="text-[10.5px] font-bold text-white/42 mt-0.5">按当前城市</span>
                </button>
                <button
                  @click="openDiscovery('distant')"
                  class="min-h-[78px] rounded-[22px] bg-white/10 border border-white/10 text-white active:scale-95 transition-all flex flex-col items-start justify-center px-4 text-left"
                >
                  <span class="w-8 h-8 rounded-2xl bg-white/15 text-amber-100 flex items-center justify-center mb-2"><i class="ri-route-line"></i></span>
                  <span class="text-[13px] font-black">远方朋友</span>
                  <span class="text-[10.5px] font-bold text-white/42 mt-0.5">不按距离</span>
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
                <button @click="sendFriendRequest(u.userId)" class="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all shrink-0">
                  <i class="ri-user-add-line"></i> 加好友
                </button>
              </div>
            </div>
            <p v-else-if="searchDone" class="mt-4 text-center text-[12px] text-slate-400 font-bold py-2">没找到这个人，换个昵称或编号试试 🔍</p>
          </div>

          <div v-if="pendingRequests.length > 0">
            <h3 class="text-[12px] font-black text-slate-400 tracking-widest uppercase mb-3 px-2">新请求接入</h3>
            <div v-for="req in pendingRequests" :key="req.id" class="bg-white/50 backdrop-blur-lg rounded-[28px] p-4 flex items-center justify-between border border-white/60 shadow-sm mb-3 gap-3">
              <button @click="openUserProfile(req.friendId)" class="flex items-center gap-3 min-w-0 text-left active:scale-[0.99] transition-all">
                <img :src="avatarOf(req, req.id)" class="w-[46px] h-[46px] rounded-[18px] object-cover border-2 border-white shadow-sm">
                <div class="min-w-0">
                  <h4 class="text-[15px] font-bold text-slate-800">{{ req.nickname || '神秘特工' }}</h4>
                  <p class="text-[11px] text-slate-500 font-medium">想和你成为朋友 · 点头像看主页</p>
                </div>
              </button>
              <button @click.stop="acceptRequest(req.friendshipId)" class="px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[13px] font-bold rounded-full shadow-md shadow-emerald-500/30 hover:shadow-lg active:scale-95 transition-all shrink-0">
                授权
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>

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
            <p class="text-[10px] font-black tracking-[0.22em] text-slate-400 leading-none">每日少量</p>
            <h2 class="text-[15px] font-black tracking-tight text-slate-900 mt-1">{{ discoveryTitle }}</h2>
          </div>
          <button v-if="discoveryMode === 'city'" @click="openDiscovery('city')" :disabled="isLocating" class="h-9 px-3 rounded-full bg-slate-950 text-white text-[12px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-[0_12px_26px_-18px_rgba(15,23,42,0.8)] disabled:bg-slate-400">
            <i class="ri-crosshair-2-line" :class="{ 'animate-pulse': isLocating }"></i> 定位
          </button>
          <div v-else class="h-9 px-3 rounded-full bg-white/72 backdrop-blur-xl border border-white/70 text-slate-500 text-[12px] font-black flex items-center gap-1 shadow-sm">
            <i class="ri-leaf-line"></i> 有限
          </div>
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
                <span class="text-[11px] font-black tracking-[0.16em] text-white/55">一个个看 · 还能打招呼 {{ discoveryGreetRemaining }} 次</span>
              </div>
              <h1 class="text-[28px] font-black tracking-tight leading-[1.08] whitespace-pre-line">{{ discoveryHeroTitle }}</h1>
              <p class="text-[12.5px] text-white/58 font-medium leading-relaxed mt-3 max-w-[17rem]">
                {{ discoveryHeroDesc }}
              </p>
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

                    <div class="flex flex-wrap justify-center gap-1.5 mt-4">
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

              <p class="text-center text-[11px] font-bold text-slate-400">
                不展示精确距离，不做无限刷人。慢慢认识一个人。
              </p>
            </div>

            <div v-else class="rounded-[32px] bg-white/76 border border-white/90 p-7 text-center shadow-sm">
              <div class="mx-auto w-14 h-14 rounded-[24px] bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <i class="ri-moon-clear-line text-2xl"></i>
              </div>
              <h3 class="text-[18px] font-black text-slate-900 tracking-tight">今天暂时没有精选</h3>
              <p class="text-[12.5px] text-slate-500 font-medium leading-relaxed mt-2">
                {{ discoveryEmptyText }}
              </p>
              <button v-if="discoveryMode === 'city'" @click="openDiscovery('city')" :disabled="isLocating" class="mt-5 px-5 py-3 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all disabled:bg-slate-400">
                {{ isLocating ? '正在确认' : '定位确认' }}
              </button>
              <button v-else @click="closeCityPicks" class="mt-5 px-5 py-3 rounded-2xl bg-slate-950 text-white text-[12px] font-black active:scale-95 transition-all">
                先返回
              </button>
            </div>
          </section>

          <p class="mt-5 text-center text-[10.5px] font-bold text-slate-400 leading-relaxed px-5">
            {{ discoveryFooterText }}
          </p>
        </main>
      </div>

    </transition>

    <transition name="van-slide-up">
      <div v-if="showProfileConfig" class="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 h-[85vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

          <div class="flex justify-between items-center mb-6 mt-4 shrink-0">
            <div>
              <h2 class="text-slate-900 text-[22px] font-black tracking-tight">我的主页</h2>
              <p class="text-slate-500 text-[12px] mt-1">封面、签名和遇见偏好放在这里</p>
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

            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">首要诉求</h3>
              </div>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="item in mainPurposes" :key="item.id"
                     @click="selectedPurpose = item.id"
                     class="flex flex-col items-center gap-2 cursor-pointer group">
                  <div class="w-[60px] h-[60px] rounded-[22px] flex items-center justify-center text-[32px] transition-all duration-300"
                       :class="selectedPurpose === item.id ? 'bg-blue-100 shadow-[0_8px_20px_rgba(59,130,246,0.25)] scale-110 border-2 border-blue-400' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'">
                    {{ item.icon }}
                  </div>
                  <span class="text-[12px] font-bold transition-colors mt-1" :class="selectedPurpose === item.id ? 'text-blue-600' : 'text-slate-500'">{{ item.label }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-end mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                  <h3 class="text-slate-800 text-[15px] font-black tracking-widest">相同兴趣 / 状态</h3>
                </div>
                <span class="text-[11px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">已选 {{ selectedTags.length }} / 3</span>
              </div>

              <div class="grid grid-cols-4 gap-y-6 gap-x-2">
                <div v-for="tag in lifeTags" :key="tag.id"
                     @click="toggleTag(tag.id)"
                     class="flex flex-col items-center gap-2 cursor-pointer group">
                  <div class="w-[56px] h-[56px] rounded-full flex items-center justify-center text-[28px] transition-all duration-300 relative"
                       :class="selectedTags.includes(tag.id) ? 'bg-slate-900 shadow-[0_8px_15px_rgba(0,0,0,0.2)] scale-105' : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'">
                    <div v-if="selectedTags.includes(tag.id)" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center z-10 animate-in zoom-in duration-200">
                      <i class="ri-check-line text-white text-[12px] font-black"></i>
                    </div>
                    {{ tag.icon }}
                  </div>
                  <span class="text-[11px] font-bold text-center" :class="selectedTags.includes(tag.id) ? 'text-slate-900' : 'text-slate-400'">{{ tag.label }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">问候签名</h3>
              </div>
              <textarea v-model="broadcastSign" rows="3" placeholder="说点什么，吸引频率相同的人..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-blue-400 focus:bg-white focus:shadow-[0_8px_20px_rgba(59,130,246,0.1)] transition-all resize-none"></textarea>
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

    <!-- ============ 情绪纸船 Modal ============ -->
    <transition name="fade-up">
      <div v-if="showPaperBoatModal" class="fixed inset-0 z-[140] bg-slate-950/85 backdrop-blur-md flex flex-col justify-end">
        <div class="paper-river-sheet relative h-[88vh] rounded-t-[34px] border border-white/10 shadow-[0_-28px_80px_-34px_rgba(0,0,0,0.75)] flex flex-col overflow-hidden">
          <div class="paper-stars"></div>
          <div class="paper-moon"></div>
          <div class="paper-river"></div>
          <div class="paper-river-shine"></div>
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-10"></div>

          <header class="relative z-10 shrink-0 px-6 pt-8 pb-4">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-[11px] font-black tracking-[0.22em] text-cyan-100/70 mb-1">星河漂流</p>
                <h2 class="text-[25px] font-black tracking-tight text-white leading-none">把心事放进河里</h2>
                <p class="text-[12px] text-cyan-50/70 font-medium mt-2 leading-relaxed">一天放飞两封，捞起两封。让它慢慢漂，不催它靠岸。</p>
              </div>
              <button @click="showPaperBoatModal = false" class="w-9 h-9 rounded-full bg-white/10 text-white/70 border border-white/10 flex items-center justify-center active:scale-90 transition-all shrink-0">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2.5 mt-5">
              <div class="paper-quota-card">
                <p class="text-[10px] font-black tracking-[0.18em] text-cyan-100/70">今日可放</p>
                <div class="mt-1 flex items-end gap-1">
                  <span class="text-[25px] font-black text-white leading-none">{{ paperBoatQuota.releaseRemaining }}</span>
                  <span class="text-[11px] font-bold text-cyan-100/50 mb-0.5">/ {{ paperBoatQuota.releaseLimit }}</span>
                </div>
              </div>
              <div class="paper-quota-card">
                <p class="text-[10px] font-black tracking-[0.18em] text-cyan-100/70">今日可捞</p>
                <div class="mt-1 flex items-end gap-1">
                  <span class="text-[25px] font-black text-white leading-none">{{ paperBoatQuota.scoopRemaining }}</span>
                  <span class="text-[11px] font-bold text-cyan-100/50 mb-0.5">/ {{ paperBoatQuota.scoopLimit }}</span>
                </div>
              </div>
            </div>
          </header>

          <div class="relative z-10 shrink-0 px-6">
            <div class="flex bg-white/10 p-1 rounded-full gap-1 border border-white/10">
              <button @click="switchPaperBoatTab('write')" :class="paperBoatTab === 'write' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
                写一封
              </button>
              <button @click="switchPaperBoatTab('scoop')" :class="paperBoatTab === 'scoop' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
                捞一封
              </button>
              <button @click="switchPaperBoatTab('history')" :class="paperBoatTab === 'history' ? 'bg-white text-slate-950 shadow-[0_8px_24px_-14px_rgba(255,255,255,0.55)]' : 'text-cyan-50/70'" class="flex-1 py-2 text-[12.5px] font-black rounded-full transition-all">
                记录
              </button>
            </div>
          </div>

          <div v-if="paperBoatHint" class="relative z-10 mx-6 mt-3 rounded-2xl bg-amber-200/10 border border-amber-100/20 px-4 py-3 text-[12px] font-bold text-amber-100">
            {{ paperBoatHint }}
          </div>

          <div class="relative z-10 flex-1 overflow-y-auto custom-scroll px-6 py-5 pb-6">
            <div v-if="paperBoatTab === 'write'" class="space-y-4">
              <div class="relative">
                <textarea
                  v-model="paperBoatText"
                  maxlength="280"
                  rows="8"
                  :disabled="isDisintegrating || paperBoatQuota.releaseRemaining <= 0"
                  placeholder="写下此刻不想说出口的话。它会匿名漂走，不进入公开动态。"
                  :class="[
                    'w-full bg-slate-950/40 border rounded-[24px] p-4 text-cyan-50 placeholder:text-cyan-100/40 text-[14px] font-medium outline-none transition-all resize-none leading-relaxed shadow-[0_18px_50px_-34px_rgba(0,0,0,0.8)] backdrop-blur-xl',
                    isDisintegrating ? 'border-cyan-100/10 text-transparent select-none cursor-default' : 'border-white/12 focus:border-cyan-200/32 focus:bg-slate-950/45',
                    paperBoatQuota.releaseRemaining <= 0 ? 'opacity-60' : ''
                  ]"
                ></textarea>

                <div v-if="isDisintegrating" class="absolute inset-0 p-4 overflow-hidden pointer-events-none flex flex-wrap content-start gap-0.5">
                  <span
                    v-for="(word, wIdx) in paperBoatText.split('')"
                    :key="wIdx"
                    class="text-[13.5px] text-cyan-100/80 font-bold inline-block animate-disintegrate"
                    :style="getDisintegrateStyle()"
                  >
                    {{ word === '\n' ? '' : word }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-cyan-50/45 font-bold">
                <span>{{ paperBoatText.length }}/280</span>
                <span>剩余 {{ paperBoatQuota.releaseRemaining }} 封</span>
              </div>

              <button
                @click="disintegratePaperBoat"
                :disabled="!paperBoatText.trim() || isDisintegrating || paperBoatQuota.releaseRemaining <= 0"
                class="w-full bg-white text-slate-950 hover:bg-cyan-50 disabled:bg-white/10 disabled:text-cyan-100/40 font-black text-[15px] py-4 rounded-[22px] active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0_16px_40px_-24px_rgba(255,255,255,0.7)]"
              >
                {{ paperBoatQuota.releaseRemaining <= 0 ? '今天的河面已经满了' : '放进河里' }}
              </button>
            </div>

            <div v-if="paperBoatTab === 'scoop'" class="space-y-4">
              <div v-if="scoopedBoat" class="paper-floating-boat rounded-[28px] bg-white/10 border border-white/20 p-5 shadow-[0_20px_56px_-34px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in zoom-in duration-300">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <span class="text-[10px] text-cyan-100/70 font-black tracking-[0.2em]">匿名来信</span>
                  <span class="text-[10px] text-cyan-100/50 font-bold">{{ scoopedBoat.time || '刚刚' }}</span>
                </div>

                <p class="text-[15px] text-cyan-50/90 leading-relaxed font-medium whitespace-pre-wrap">
                  {{ scoopedBoat.content }}
                </p>

                <div class="grid grid-cols-3 gap-2 mt-5 text-center">
                  <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                    <p class="text-[15px] font-black text-white">{{ scoopedBoat.breezeCount || 0 }}</p>
                    <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">微风</p>
                  </div>
                  <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                    <p class="text-[15px] font-black text-white">{{ scoopedBoat.replyCount || 0 }}</p>
                    <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">回声</p>
                  </div>
                  <div class="rounded-2xl bg-white/10 px-2 py-2 border border-white/10">
                    <p class="text-[15px] font-black text-white">{{ scoopedBoat.giftCount || 0 }}</p>
                    <p class="text-[10px] font-bold text-cyan-100/40 mt-0.5">礼物</p>
                  </div>
                </div>
              </div>

              <div v-if="scoopedBoat" class="rounded-[24px] bg-slate-950/28 border border-white/10 p-4 space-y-3 backdrop-blur-xl">
                <textarea
                  v-model="paperBoatReplyText"
                  rows="3"
                  maxlength="180"
                  :disabled="scoopedBoat.replied"
                  placeholder="写一句只给这只纸船的私密回声。"
                  class="w-full bg-white/10 border border-white/10 rounded-2xl px-3.5 py-3 text-[13px] text-cyan-50 placeholder:text-cyan-100/40 font-medium outline-none focus:bg-white/10 focus:border-cyan-200/30 transition-all resize-none leading-relaxed disabled:opacity-60"
                ></textarea>

                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="gift in paperBoatGifts"
                    :key="gift.type"
                    @click="selectedPaperBoatGift = gift.type"
                    :disabled="scoopedBoat.gifted"
                    :class="[
                      'rounded-2xl border px-3 py-2.5 text-left transition-all active:scale-[0.98] disabled:opacity-55',
                      selectedPaperBoatGift === gift.type ? 'bg-white text-slate-950 border-white' : 'bg-white/10 text-cyan-50/70 border-white/10'
                    ]"
                  >
                    <div class="text-[17px] leading-none">{{ gift.icon }}</div>
                    <div class="text-[11px] font-black mt-1">{{ gift.label }}</div>
                  </button>
                </div>

                <div class="grid grid-cols-3 gap-2 pt-1">
                  <button
                    @click="respondToScooped('reply')"
                    :disabled="!paperBoatReplyText.trim() || scoopedBoat.replied || isPaperBoatResponding"
                    class="py-3 rounded-2xl bg-white text-slate-950 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all"
                  >
                    {{ scoopedBoat.replied ? '已回应' : '回一声' }}
                  </button>
                  <button
                    @click="respondToScooped('gift')"
                    :disabled="scoopedBoat.gifted || isPaperBoatResponding"
                    class="py-3 rounded-2xl bg-amber-200/20 text-amber-100 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all border border-amber-100/20"
                  >
                    {{ scoopedBoat.gifted ? '已送礼' : '送礼物' }}
                  </button>
                  <button
                    @click="sendBreezeToScooped"
                    :disabled="scoopedBoat.breezed"
                    class="py-3 rounded-2xl bg-cyan-200/20 text-cyan-100 text-[12px] font-black disabled:bg-white/10 disabled:text-cyan-100/40 active:scale-95 transition-all border border-cyan-100/20"
                  >
                    {{ scoopedBoat.breezed ? '已吹过' : '微风' }}
                  </button>
                </div>
              </div>

              <div v-if="!scoopedBoat" class="rounded-[28px] bg-white/10 border border-dashed border-cyan-100/20 p-8 text-center backdrop-blur-xl">
                <div class="w-14 h-14 mx-auto rounded-full bg-white/10 text-cyan-100/70 flex items-center justify-center mb-4 border border-white/10">
                  <i class="ri-ship-2-line text-2xl"></i>
                </div>
                <p class="text-[14px] font-black text-white">河面很安静</p>
                <p class="text-[12px] text-cyan-50/70 mt-1 leading-relaxed">今天还可以捞 {{ paperBoatQuota.scoopRemaining }} 封匿名心事。</p>
              </div>

              <button
                @click="scoopAnother"
                :disabled="isScoopLoading || paperBoatQuota.scoopRemaining <= 0"
                class="w-full bg-white text-slate-950 hover:bg-cyan-50 disabled:bg-white/10 disabled:text-cyan-100/40 font-black text-[15px] py-4 rounded-[22px] active:scale-[0.98] transition-all shadow-[0_16px_40px_-24px_rgba(255,255,255,0.7)]"
              >
                {{ paperBoatQuota.scoopRemaining <= 0 ? '今天先不打扰河面了' : (scoopedBoat ? '再捞一封' : '捞起一封') }}
              </button>
            </div>

            <div v-if="paperBoatTab === 'history'" class="space-y-5">
              <div class="paper-history-hero rounded-[28px] p-5 border border-white/12 backdrop-blur-xl">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-[10px] text-cyan-100/55 font-black tracking-[0.2em]">河流记得</p>
                    <h3 class="text-[20px] text-white font-black mt-1 tracking-tight">你的纸船记录</h3>
                    <p class="text-[12px] text-cyan-50/65 mt-2 leading-relaxed">写过的心事、捞起的来信，都会安静留在这里。</p>
                  </div>
                  <button
                    @click="loadPaperBoatHistory(true)"
                    :disabled="isPaperBoatHistoryLoading"
                    class="w-10 h-10 rounded-2xl bg-white/10 text-cyan-50 border border-white/10 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 shrink-0"
                  >
                    <i class="ri-refresh-line" :class="{ 'animate-spin': isPaperBoatHistoryLoading }"></i>
                  </button>
                </div>
              </div>

              <div v-if="isPaperBoatHistoryLoading" class="rounded-[28px] bg-white/10 border border-white/10 p-8 text-center backdrop-blur-xl">
                <div class="w-12 h-12 mx-auto rounded-full bg-white/10 text-cyan-100 flex items-center justify-center mb-4">
                  <i class="ri-loader-4-line text-2xl animate-spin"></i>
                </div>
                <p class="text-[13px] font-black text-cyan-50">正在翻找河面记忆</p>
              </div>

              <template v-else>
                <div class="space-y-3">
                  <div class="flex items-end justify-between">
                    <h4 class="text-[15px] font-black text-white">我放飞的</h4>
                    <span class="text-[11px] font-bold text-cyan-100/45">{{ paperBoatHistory.released.length }} 封</span>
                  </div>

                  <div v-if="paperBoatHistory.released.length === 0" class="paper-history-empty">
                    还没有放飞过纸船。
                  </div>

                  <article v-for="boat in paperBoatHistory.released" :key="'released-' + boat.id" class="paper-history-card">
                    <div class="flex items-center justify-between gap-3 mb-3">
                      <span class="text-[10px] font-black tracking-[0.18em] text-cyan-100/50">匿名心事</span>
                      <span class="text-[10px] font-bold text-cyan-100/60">{{ formatPaperBoatTime(boat.createdAt) }}</span>
                    </div>
                    <p class="text-[13.5px] leading-relaxed text-cyan-50/90 whitespace-pre-wrap">{{ boat.content }}</p>
                    <div class="grid grid-cols-3 gap-2 mt-4">
                      <div class="paper-history-stat">
                        <b>{{ boat.breezeCount || 0 }}</b>
                        <span>微风</span>
                      </div>
                      <div class="paper-history-stat">
                        <b>{{ boat.replyCount || 0 }}</b>
                        <span>回声</span>
                      </div>
                      <div class="paper-history-stat">
                        <b>{{ boat.giftCount || 0 }}</b>
                        <span>礼物</span>
                      </div>
                    </div>
                  </article>
                </div>

                <div class="space-y-3">
                  <div class="flex items-end justify-between">
                    <h4 class="text-[15px] font-black text-white">我捞到的</h4>
                    <span class="text-[11px] font-bold text-cyan-100/45">{{ paperBoatHistory.scooped.length }} 封</span>
                  </div>

                  <div v-if="paperBoatHistory.scooped.length === 0" class="paper-history-empty">
                    还没有捞起过纸船。
                  </div>

                  <article v-for="boat in paperBoatHistory.scooped" :key="'scooped-' + boat.id + '-' + boat.scoopedAt" class="paper-history-card">
                    <div class="flex items-center justify-between gap-3 mb-3">
                      <span class="text-[10px] font-black tracking-[0.18em] text-cyan-100/50">捞起的来信</span>
                    <span class="text-[10px] font-bold text-cyan-100/60">{{ formatPaperBoatTime(boat.scoopedAt || boat.createdAt) }}</span>
                  </div>
                    <p class="text-[13.5px] leading-relaxed text-cyan-50/90 whitespace-pre-wrap">{{ boat.content }}</p>

                    <div v-if="boat.replyContent || boat.giftType || boat.breezed" class="mt-4 space-y-2">
                      <div v-if="boat.replyContent" class="paper-history-note">
                        <span>我的回声</span>
                        <p>{{ boat.replyContent }}</p>
                      </div>
                      <div v-if="boat.giftType" class="paper-history-note">
                        <span>送过礼物</span>
                        <p>{{ paperBoatGiftLabel(boat.giftType) }}</p>
                      </div>
                      <div v-if="boat.breezed" class="paper-history-note">
                        <span>微风</span>
                        <p>你给它吹过一阵风</p>
                      </div>
                    </div>
                  </article>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </transition>

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

    <!-- ============ 发起密聊:好友选择器 ============ -->
    <transition name="fade-up">
      <div v-if="showFriendPicker" class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 max-h-[80vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
          <div class="flex justify-between items-center mb-5 mt-4 shrink-0">
            <h2 class="text-slate-900 text-[20px] font-black tracking-tight">发起密聊</h2>
            <button @click="showFriendPicker = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
          </div>
          <div class="flex-1 overflow-y-auto custom-scroll space-y-2">
            <p v-if="friendChats.length === 0" class="text-center text-[13px] text-slate-400 font-bold py-10">还没有好友,先去联络人搜索添加吧 🔍</p>
            <div v-for="f in friendChats" :key="f.id" @click="startPrivateChat(f)" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer">
              <img :src="f.avatar" class="w-11 h-11 rounded-2xl border border-white shadow-sm">
              <h4 class="text-[15px] font-bold text-slate-800 flex-1 truncate">{{ f.name }}</h4>
              <i class="ri-arrow-right-s-line text-slate-300 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 创建小队 ============ -->
    <transition name="fade-up">
      <div v-if="showCreateGroup" class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 max-h-[85vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
          <div class="flex justify-between items-center mb-5 mt-4 shrink-0">
            <h2 class="text-slate-900 text-[20px] font-black tracking-tight">创建小队</h2>
            <button @click="showCreateGroup = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
          </div>
          <input v-model="newGroupName" type="text" placeholder="给小队起个名字,如:低渣打卡战队" class="shrink-0 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] font-medium outline-none focus:border-violet-400 focus:bg-white transition-all mb-4">
          <p class="shrink-0 text-[12px] font-black text-slate-400 mb-2">勾选要拉进来的战友 (已选 {{ selectedMembers.length }})</p>
          <div class="flex-1 overflow-y-auto custom-scroll space-y-2">
            <p v-if="friendChats.length === 0" class="text-center text-[13px] text-slate-400 font-bold py-8">还没有好友,可以先建空队稍后再邀请</p>
            <div v-for="f in friendChats" :key="f.id" @click="toggleSelectMember(f.id)" class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]" :class="selectedMembers.includes(f.id) ? 'bg-violet-50 border-violet-200' : 'bg-white border-stone-100 hover:bg-slate-50'">
              <img :src="f.avatar" class="w-10 h-10 rounded-2xl border border-white shadow-sm">
              <h4 class="text-[14px] font-bold text-slate-800 flex-1 truncate">{{ f.name }}</h4>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="selectedMembers.includes(f.id) ? 'bg-violet-500 border-violet-500' : 'border-slate-300'">
                <i v-if="selectedMembers.includes(f.id)" class="ri-check-line text-white text-xs"></i>
              </div>
            </div>
          </div>
          <div class="shrink-0 pt-4 mt-2 border-t border-slate-100">
            <button @click="createGroup" class="w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
              <i class="ri-team-fill"></i> 创建小队
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 群发广播 ============ -->
    <transition name="fade-up">
      <div v-if="showBroadcast" class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
          <div class="flex justify-between items-center mb-2 mt-4 shrink-0">
            <h2 class="text-slate-900 text-[20px] font-black tracking-tight">群发广播</h2>
            <button @click="showBroadcast = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
          </div>
          <p class="text-[12px] text-slate-400 font-medium mb-4">先选人，再发送。不会默认打扰所有人。</p>
          <div class="max-h-44 overflow-y-auto custom-scroll space-y-2 mb-4">
            <button
              v-for="friend in friendChats"
              :key="friend.id"
              @click="toggleBroadcastReceiver(friend.id)"
              class="w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left active:scale-[0.99] transition-all"
              :class="broadcastReceiverIds.includes(friend.id) ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'"
            >
              <img :src="friend.avatar" class="w-9 h-9 rounded-2xl object-cover bg-white shrink-0">
              <span class="flex-1 min-w-0 text-[13px] font-black text-slate-700 truncate">{{ friend.name }}</span>
              <i :class="broadcastReceiverIds.includes(friend.id) ? 'ri-checkbox-circle-fill text-rose-500' : 'ri-checkbox-blank-circle-line text-slate-300'" class="text-xl"></i>
            </button>
            <p v-if="friendChats.length === 0" class="text-center py-6 text-[12px] text-slate-400 font-bold">还没有好友可以广播</p>
          </div>
          <div class="flex gap-2 mb-3">
            <button @click="broadcastReceiverIds = friendChats.map(f => f.id)" class="flex-1 py-2 rounded-xl bg-slate-100 text-[11px] font-black text-slate-600 active:scale-95">全选</button>
            <button @click="broadcastReceiverIds = []" class="flex-1 py-2 rounded-xl bg-slate-100 text-[11px] font-black text-slate-600 active:scale-95">清空</button>
          </div>
          <textarea v-model="broadcastText" rows="4" placeholder="想对全体战友说点什么?如:今晚八段锦走起!" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-rose-400 focus:bg-white transition-all resize-none mb-4"></textarea>
          <button @click="sendBroadcast" :disabled="isSendingBroadcast || !broadcastText.trim() || broadcastReceiverIds.length === 0" class="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
            <i class="ri-broadcast-line" :class="{ 'animate-pulse': isSendingBroadcast }"></i>
            {{ isSendingBroadcast ? '广播中...' : `发给 ${broadcastReceiverIds.length} 人` }}
          </button>
        </div>
      </div>
    </transition>

    <!-- ============ 小队资料页 ============ -->
    <transition name="fade-up">
      <div v-if="showMemberPanel" class="fixed inset-0 z-[150] bg-slate-900/45 backdrop-blur-md flex flex-col justify-end">
        <div class="relative h-[88vh] bg-[#FBF9F5] rounded-t-[34px] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

          <header class="shrink-0 px-5 pt-8 pb-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="relative shrink-0">
                  <img :src="groupEdit.avatar || activeChat?.avatar" class="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md bg-slate-100">
                  <button v-if="isGroupOwner" @click="pickGroupAvatar" class="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center border-2 border-[#FBF9F5] active:scale-90 transition-all">
                    <i class="ri-camera-line text-sm"></i>
                  </button>
                  <input id="group-avatar-input" type="file" accept="image/*" class="hidden" @change="onGroupAvatarChange" />
                </div>

                <div class="min-w-0">
                  <p class="text-[11px] font-black tracking-[0.16em] text-violet-500 mb-1">小队资料</p>
                  <h2 class="text-[24px] font-black text-slate-950 tracking-tight truncate">{{ groupEdit.name || activeChat?.name }}</h2>
                  <p class="text-[12px] text-slate-400 font-bold mt-1">{{ groupMembers.length }} 位成员 · {{ isGroupOwner ? '你是队长' : '队员' }}</p>
                </div>
              </div>

              <button @click="showMemberPanel = false" class="w-9 h-9 flex items-center justify-center bg-white rounded-full text-slate-500 active:scale-90 transition-all shrink-0 shadow-sm">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </header>

          <div class="flex-1 overflow-y-auto custom-scroll px-5 pb-5 space-y-4">
            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-[14px] font-black text-slate-900">小队信息</h3>
                <button v-if="isGroupOwner" @click="groupProfileMode = groupProfileMode === 'edit' ? 'view' : 'edit'" class="text-[12px] font-black text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                  {{ groupProfileMode === 'edit' ? '收起编辑' : '编辑资料' }}
                </button>
              </div>

              <div v-if="groupProfileMode !== 'edit'" class="space-y-2">
                <p class="text-[12px] text-slate-400 font-bold">公告</p>
                <p class="text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{{ groupEdit.notice || '队长还没有写公告。' }}</p>
              </div>

              <div v-else class="space-y-3">
                <input v-model="groupEdit.name" type="text" placeholder="小队名称" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[14px] font-bold text-slate-800 outline-none focus:bg-white focus:border-violet-200 transition-all">
                <textarea v-model="groupEdit.notice" rows="4" placeholder="写一段小队公告：目标、边界、互助规则..." class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:border-violet-200 transition-all resize-none leading-relaxed"></textarea>
                <button @click="saveGroupProfile" :disabled="isSavingGroupProfile" class="w-full bg-slate-950 text-white py-3.5 rounded-2xl text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-300">
                  {{ isSavingGroupProfile ? '保存中...' : '保存小队资料' }}
                </button>
              </div>
            </section>

            <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-[14px] font-black text-slate-900">成员</h3>
                <button @click="openInviteFromPanel" class="text-[12px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full active:scale-95 transition-all">
                  邀请
                </button>
              </div>

              <p v-if="loadingMembers" class="text-center text-[13px] text-slate-400 font-bold py-10">加载成员中...</p>
              <div v-else class="space-y-1">
                <div v-for="m in groupMembers" :key="m.userId" class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all">
                  <button @click="openUserProfile(m.userId)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <img :src="avatarOf(m, m.userId)" class="w-11 h-11 rounded-2xl border border-white shadow-sm object-cover bg-slate-100">
                    <div class="flex-1 min-w-0">
                      <h4 class="text-[14.5px] font-bold text-slate-800 truncate">{{ m.nickname || '神秘队员' }}</h4>
                      <span class="text-[11px] text-slate-400 font-medium">{{ m.userId === myId ? '我自己' : '查看资料' }}</span>
                    </div>
                  </button>
                  <span v-if="m.role === 'OWNER'" class="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                    <i class="ri-vip-crown-fill"></i> 队长
                  </span>
                  <button v-else-if="isGroupOwner" @click="removeGroupMember(m)" class="text-[10px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full active:scale-95 transition-all shrink-0">
                    移出
                  </button>
                  <span v-else class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">队员</span>
                </div>
              </div>
            </section>

            <button @click="leaveCurrentGroup" class="w-full py-4 rounded-[22px] bg-white text-rose-500 border border-rose-100 text-[14px] font-black active:scale-95 transition-all">
              <i class="ri-logout-box-r-line"></i> 退出这个小队
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 邀请成员 ============ -->
    <transition name="fade-up">
      <div v-if="showInvitePicker" class="fixed inset-0 z-[160] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 max-h-[80vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>
          <div class="flex justify-between items-center mb-5 mt-4 shrink-0">
            <h2 class="text-slate-900 text-[20px] font-black tracking-tight">邀请进队</h2>
            <button @click="showInvitePicker = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all"><i class="ri-close-line text-lg"></i></button>
          </div>
          <p class="shrink-0 text-[12px] font-black text-slate-400 mb-2">勾选要拉进来的战友 (已选 {{ inviteSelected.length }})</p>
          <div class="flex-1 overflow-y-auto custom-scroll space-y-2">
            <p v-if="invitableFriends.length === 0" class="text-center text-[13px] text-slate-400 font-bold py-8">没有可邀请的好友了,先去联络人添加吧 🔍</p>
            <div v-for="f in invitableFriends" :key="f.id" @click="toggleInviteMember(f.id)" class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]" :class="inviteSelected.includes(f.id) ? 'bg-violet-50 border-violet-200' : 'bg-white border-stone-100 hover:bg-slate-50'">
              <img :src="f.avatar" class="w-10 h-10 rounded-2xl border border-white shadow-sm">
              <h4 class="text-[14px] font-bold text-slate-800 flex-1 truncate">{{ f.name }}</h4>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="inviteSelected.includes(f.id) ? 'bg-violet-500 border-violet-500' : 'border-slate-300'">
                <i v-if="inviteSelected.includes(f.id)" class="ri-check-line text-white text-xs"></i>
              </div>
            </div>
          </div>
          <div class="shrink-0 pt-4 mt-2 border-t border-slate-100">
            <button @click="submitInvite" :disabled="inviteSelected.length === 0" class="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
              <i class="ri-user-add-fill"></i> 确认邀请
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 战友资料卡 ============ -->
    <transition name="fade-up">
      <div v-if="showUserProfile" class="fixed inset-0 z-[170] bg-slate-900/55 backdrop-blur-md flex flex-col justify-end">
        <div class="relative bg-[#FBF9F5] rounded-t-[34px] max-h-[82vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

          <header class="relative shrink-0 px-6 pt-8 pb-5 overflow-hidden">
            <div v-if="profileUser?.profileCover" class="absolute inset-0 pointer-events-none">
              <img :src="profileUser.profileCover" class="w-full h-full object-cover opacity-35 blur-[1px] scale-[1.03]">
              <div class="absolute inset-0 bg-gradient-to-b from-white/78 via-[#FBF9F5]/88 to-[#FBF9F5]"></div>
            </div>
            <div class="relative z-10 flex justify-between items-start gap-3">
              <div class="flex items-center gap-4 min-w-0">
                <img :src="avatarOf(profileUser, profileUser?.userId)" class="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md bg-slate-100">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 min-w-0">
                    <h2 class="text-[23px] font-black text-slate-950 tracking-tight truncate">{{ profileDisplayName }}</h2>
                    <button v-if="canRemarkProfile" @click="editProfileRemark" class="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 active:scale-95 transition-all">
                      {{ profileRemark ? '改备注' : '+备注' }}
                    </button>
                  </div>
                  <p v-if="profileRemark" class="text-[11px] text-slate-400 font-bold mt-0.5 truncate">昵称：{{ profileUser?.nickname }}</p>
                  <p v-if="profileUser?.radarSign" class="text-[12px] text-slate-500 font-bold mt-1 truncate">{{ profileUser.radarSign }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span v-if="profileUser?.verified" class="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                      <i class="ri-shield-check-fill"></i> 已认证
                    </span>
                    <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                      编号 {{ profileUser?.userId }}
                    </span>
                  </div>
                </div>
              </div>
              <button @click="showUserProfile = false" class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </header>

          <div class="relative z-10 flex-1 overflow-y-auto custom-scroll px-6 pb-6 space-y-3">
            <p v-if="userProfileLoading" class="text-center py-12 text-[13px] text-slate-400 font-bold">加载资料中...</p>

            <template v-else>
              <section class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
                <div class="flex items-start gap-3">
                  <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
                    {{ profileUser?.emoji || '🌙' }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[11px] font-black text-slate-400 tracking-[0.14em] mb-1">当前状态</p>
                    <h3 class="text-[16px] font-black text-slate-900 tracking-tight">{{ profileUser?.text || '暂未设置状态' }}</h3>
                    <p class="text-[12px] text-slate-500 leading-relaxed mt-1">{{ profileUser?.description || '对方还没有留下更多说明。' }}</p>
                  </div>
                </div>
              </section>

              <section class="grid grid-cols-3 gap-2">
                <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                  <p class="text-[18px] font-black text-slate-900">{{ profileUser?.reactions || 0 }}</p>
                  <p class="text-[10px] font-bold text-slate-400 mt-0.5">收到关心</p>
                </div>
                <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                  <p class="text-[18px] font-black text-slate-900">{{ userProfileData?.iSent || 0 }}</p>
                  <p class="text-[10px] font-bold text-slate-400 mt-0.5">我送出</p>
                </div>
                <div class="bg-white rounded-2xl border border-white/80 p-3 text-center">
                  <p class="text-[18px] font-black text-slate-900">{{ userProfileData?.theySent || 0 }}</p>
                  <p class="text-[10px] font-bold text-slate-400 mt-0.5">对方回应</p>
                </div>
              </section>

              <section v-if="profileUser?.reactors?.length" class="bg-white rounded-[24px] border border-white/80 p-4">
                <p class="text-[12px] font-black text-slate-900 mb-3">最近关心对方的人</p>
                <div class="flex -space-x-2">
                  <img v-for="(r, idx) in profileUser.reactors" :key="idx" :src="avatarOf(r, idx)" class="w-8 h-8 rounded-full border-2 border-white bg-slate-100">
                </div>
              </section>

              <section @click="openProfileMomentsPanel" class="bg-white rounded-[24px] border border-white/80 p-4 active:scale-[0.99] transition-all cursor-pointer">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-[12px] font-black text-slate-900">对方的朋友圈</p>
                  <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    {{ profileMoments.length }} 条
                    <i v-if="profileMoments.length" class="ri-arrow-right-s-line text-sm"></i>
                  </span>
                </div>
                <p v-if="profileMomentsLoading" class="text-center py-6 text-[12px] text-slate-400 font-bold">正在加载动态...</p>
                <p v-else-if="profileMoments.length === 0" class="text-center py-6 text-[12px] text-slate-400 font-bold">暂时没有可见动态</p>
                <div v-else class="space-y-3">
                  <article v-for="post in profileMoments.slice(0, 2)" :key="post.id" class="rounded-2xl bg-stone-50/80 border border-stone-100 p-3">
                    <div class="flex items-center justify-between gap-3 mb-2">
                      <span class="text-[11px] font-bold text-slate-400">{{ post.time }}</span>
                      <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="momentVisibilityMeta(post.visibility).class">
                        {{ momentVisibilityMeta(post.visibility).label }}
                      </span>
                    </div>
                    <p class="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
                    <div v-if="post.images?.length" class="grid grid-cols-3 gap-1.5 mt-2">
                      <img v-for="(img, idx) in post.images.slice(0, 3)" :key="idx" :src="img" @click.stop="openImageViewer(post.images, idx)" class="w-full aspect-square object-cover rounded-xl bg-slate-100">
                    </div>
                  </article>
                  <p v-if="profileMoments.length > 2" class="text-center text-[11px] font-bold text-slate-400 pt-1">点击查看全部动态</p>
                </div>
              </section>

              <section v-if="userProfileData && userProfileData.myUnlocked === false" class="bg-amber-50 border border-amber-100 rounded-[22px] p-4 text-[12px] text-amber-700 font-bold leading-relaxed">
                上传病例认证后，可以查看更多战友隐私资料。当前只展示基础状态。
              </section>
            </template>
          </div>

          <footer v-if="!userProfileLoading" class="relative z-10 shrink-0 grid grid-cols-2 gap-2 px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,8px)+16px)] bg-[#FBF9F5]/95 border-t border-stone-100">
            <button @click="careFromUserProfile" :disabled="profileUser?.reactedToday" class="py-3.5 rounded-2xl text-[13px] font-black active:scale-95 transition-all" :class="profileUser?.reactedToday ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white'">
              {{ profileUser?.reactedToday ? '今天已关心' : '送上关心' }}
            </button>
            <button @click="startChatFromProfile" :disabled="profileUser?.userId === myId" class="py-3.5 rounded-2xl text-[13px] font-black bg-blue-600 text-white disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all">
              发起密聊
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- ============ 对方的朋友圈详情 ============ -->
    <transition name="fade-up">
      <div v-if="showProfileMomentsPanel" class="fixed inset-0 z-[185] bg-slate-900/55 backdrop-blur-md flex flex-col justify-end">
        <div class="relative bg-[#FBF9F5] rounded-t-[34px] h-[86vh] overflow-hidden flex flex-col shadow-[0_-24px_60px_-26px_rgba(15,23,42,0.45)]">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full"></div>

          <header class="shrink-0 px-6 pt-8 pb-4 border-b border-stone-100/80">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="avatarOf(profileUser, profileUser?.userId)" class="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm bg-slate-100">
                <div class="min-w-0">
                  <h2 class="text-[18px] font-black text-slate-950 truncate">{{ profileMomentsTitle }}</h2>
                  <p class="text-[11px] text-slate-400 font-bold mt-0.5">{{ profileMoments.length }} 条可见动态</p>
                </div>
              </div>
              <button @click="showProfileMomentsPanel = false" class="w-9 h-9 rounded-full bg-white text-slate-500 flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </header>

          <div class="flex-1 overflow-y-auto custom-scroll px-5 py-4 pb-[calc(env(safe-area-inset-bottom,8px)+20px)] space-y-3.5">
            <p v-if="profileMoments.length === 0" class="text-center py-16 text-[13px] text-slate-400 font-bold">暂时没有可见动态</p>
            <article v-for="post in profileMoments" :key="post.id" class="bg-white rounded-[26px] border border-white/80 p-4 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.32)]">
              <div class="flex items-center justify-between gap-3 mb-3">
                <span class="text-[11px] font-bold text-slate-400">{{ post.time }}</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="momentVisibilityMeta(post.visibility).class">
                    {{ momentVisibilityMeta(post.visibility).label }}
                  </span>
                  <button
                    v-if="post.isMine"
                    @click.stop="editMoment(post)"
                    class="w-6 h-6 rounded-full text-slate-300 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center active:scale-90 transition-all"
                    aria-label="编辑动态"
                  >
                    <i class="ri-edit-2-line text-[13px]"></i>
                  </button>
                  <button
                    v-if="post.isMine"
                    @click.stop="deleteMoment(post)"
                    class="w-6 h-6 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center active:scale-90 transition-all"
                    aria-label="删除动态"
                  >
                    <i class="ri-delete-bin-6-line text-[13px]"></i>
                  </button>
                </div>
              </div>
              <p class="text-[14px] text-slate-700 leading-[1.75] whitespace-pre-line">{{ post.content }}</p>
              <div v-if="post.images?.length" :class="imageGridClass(post.images.length)" class="grid gap-1.5 mt-3">
                <img v-for="(img, idx) in post.images" :key="idx" :src="img" @click="openImageViewer(post.images, idx)" class="w-full object-cover rounded-2xl bg-slate-100 cursor-pointer" :class="post.images.length === 1 ? 'aspect-[4/3]' : 'aspect-square'">
              </div>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                <span class="text-[11px] font-bold text-slate-400">{{ post.likesCount }} 共鸣 · {{ post.comments.length }} 回复</span>
                <button @click.stop="toggleLike(post)" class="flex items-center gap-1 text-[11.5px] font-black text-rose-500 active:scale-90 transition-all">
                  <i :class="post.liked ? 'ri-heart-fill' : 'ri-heart-line'" class="text-base"></i>
                  {{ post.likesCount }}
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 图片预览 ============ -->
    <transition name="fade">
      <div v-if="imageViewer.show" class="fixed inset-0 z-[240] bg-black/95 flex flex-col">
        <header class="shrink-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3 text-white">
          <span class="text-[13px] font-bold text-white/70">{{ imageViewer.index + 1 }} / {{ imageViewer.images.length }}</span>
          <button @click="closeImageViewer" class="w-9 h-9 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-close-line text-xl"></i>
          </button>
        </header>
        <div class="flex-1 min-h-0 flex items-center justify-center px-2 pb-[calc(env(safe-area-inset-bottom,0px)+18px)]">
          <button v-if="imageViewer.images.length > 1" @click.stop="prevImage" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-arrow-left-s-line text-2xl"></i>
          </button>
          <img :src="imageViewer.images[imageViewer.index]" class="max-w-full max-h-full object-contain rounded-lg select-none" @click="nextImage" />
          <button v-if="imageViewer.images.length > 1" @click.stop="nextImage" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all">
            <i class="ri-arrow-right-s-line text-2xl"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, computed, watch } from 'vue'
import TabPageHeader from '@/components/ui/TabPageHeader.vue'
import http from '@/api/http'
import { areaList } from '@vant/area-data'
import StatusBoard from '@/components/tabs/StatusBoard.vue'
import { avatarOf } from '@/utils/avatarPool'

const emit = defineEmits(['chat-active'])

// ============ 痛痛抱抱舱状态与逻辑 ============
const warmthPoints = ref(Number(localStorage.getItem('warmthPoints')) || 36)
const isBroadcasting = ref(false)
const incomingComforts = ref([])
const showPatrol = ref(false)
const patrolPatients = ref([])

const loadWarmth = async () => {
  try {
    const res = await http.get('/heal/warmth')
    if (res.status === 200 || res.code === 200) {
      warmthPoints.value = res.data
      localStorage.setItem('warmthPoints', res.data)
    }
  } catch (e) {
    console.error('加载暖心值失败', e)
  }
}

const triggerPainRescue = async () => {
  isBroadcasting.value = true
  incomingComforts.value = []
  try {
    await http.post('/heal/pain/broadcast', { location: myCard.value.city || '福州' })
  } catch (e) {
    console.error('痛痛呼救广播失败', e)
  }
  
  // 模拟陆续收到暖心反馈
  setTimeout(() => {
    incomingComforts.value.push({ id: 1, text: '❤️ 战友 @Xuan. 给你送来了一个热水袋 🩹' })
    loadWarmth()
  }, 3000)
  
  setTimeout(() => {
    incomingComforts.value.push({ id: 2, text: '🔥 战友 @半夏微凉 帮你轻揉了揉肚子 🫂' })
    loadWarmth()
  }, 5500)
  
  setTimeout(() => {
    incomingComforts.value.push({ id: 3, text: '✨ 战友 @Z-Warrior 默默给你念起了八段锦心经 🍀' })
    loadWarmth()
  }, 8000)

  // 12秒后自动恢复广播状态
  setTimeout(() => {
    isBroadcasting.value = false
  }, 12000)
}

const loadPatrolSignals = async () => {
  try {
    const res = await http.get('/heal/pain/patrol')
    if (res.status === 200 || res.code === 200) {
      patrolPatients.value = res.data
    }
  } catch (e) {
    console.error('拉取痛痛信号失败', e)
  }
}

const openPatrolSignal = () => {
  showPatrol.value = !showPatrol.value
  if (showPatrol.value) {
    loadPatrolSignals()
  }
}

const sendWarmthTo = async (p) => {
  try {
    const res = await http.post('/heal/pain/comfort', { signalId: p.id })
    if (res.status === 200 || res.code === 200) {
      p.warmed = true
      loadWarmth()
    }
  } catch (e) {
    console.error('揉腹送暖失败', e)
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
    applyPaperBoatQuota(res.data?.quota)
    paperBoatHint.value = res.message || '纸船已经入河。'
    markPaperBoatHistoryDirty()
  } catch (e) {
    console.error('心事放飞失败', e)
    paperBoatHint.value = e?.response?.data?.message || '放飞失败，稍后再试。'
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
  { id: 't2', icon: '🛡️', label: '造口战神' },
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
    broadcastSign.value = nextSign
    await saveDiscoverySettings()
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
    await http.post('/center/discovery', {
      discoveryEnabled: discoveryEnabled.value,
      radarTags: JSON.stringify(selectedTags.value),
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
const discoveryMode = ref('city')
const discoveryGreetLimit = 2
const discoveryGreetCount = ref(0)

const discoveryTitle = computed(() => discoveryMode.value === 'city' ? '同城精选' : '远方朋友')
const discoveryGreetRemaining = computed(() => Math.max(0, discoveryGreetLimit - discoveryGreetCount.value))
const discoveryHeroTitle = computed(() => discoveryMode.value === 'city'
  ? '不刷人。\n只遇见同一座城。'
  : '不刷人。\n也能遇见远方的人。'
)
const discoveryHeroDesc = computed(() => discoveryMode.value === 'city'
  ? '克制展示，不暴露精确位置。想认识，再轻轻打一声招呼。'
  : '不靠距离猎人，按真实资料慢慢遇见天南海北的朋友。'
)
const discoveryScopeText = computed(() => discoveryMode.value === 'city'
  ? (cityDisplay.value || myCity.value || '先确认你的城市')
  : '不按城市手动挑选'
)
const discoveryEmptyText = computed(() => discoveryMode.value === 'city'
  ? '可能是城市还没选，或者同城用户太少。先把城市定下来，再回来看看。'
  : '今天暂时没遇到合适的人。别急，朋友不是刷出来的。'
)
const discoveryFooterText = computed(() => discoveryMode.value === 'city'
  ? '同城精选只按城市展示，不显示精确位置。别急着加很多人，慢慢认识就好。'
  : '远方朋友不支持手动挑城市，避免被当成到处扫人的工具。'
)
const currentDiscoveryPick = computed(() => foundPatients.value[discoveryIndex.value] || null)
const discoveryProgressText = computed(() => {
  if (!foundPatients.value.length) return '今日 0 / 0'
  return `今日 ${Math.min(discoveryIndex.value + 1, foundPatients.value.length)} / ${foundPatients.value.length}`
})

const getTodayText = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const getDiscoveryGreetKey = (mode = discoveryMode.value) => {
  return `discovery_greet_${myId}_${mode}_${getTodayText()}`
}

const readDiscoveryGreets = (mode = discoveryMode.value) => {
  try {
    return JSON.parse(localStorage.getItem(getDiscoveryGreetKey(mode)) || '[]')
  } catch (e) {
    return []
  }
}

const refreshDiscoveryGreetCount = (mode = discoveryMode.value) => {
  discoveryGreetCount.value = readDiscoveryGreets(mode).length
}

const recordDiscoveryGreet = (targetId, mode = discoveryMode.value) => {
  const greets = readDiscoveryGreets(mode)
  const idText = String(targetId)
  if (!greets.includes(idText)) {
    greets.push(idText)
    localStorage.setItem(getDiscoveryGreetKey(mode), JSON.stringify(greets))
  }
  refreshDiscoveryGreetCount(mode)
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
    sign: user.radarSign || (isCityMode ? `也在${place}，先从一句轻轻的问候开始。` : `${city ? `来自${city}，` : ''}也在认真生活，先从一句问候开始。`),
    avatar: avatarOf(user, user.userId),
    requested: false,
    isFriend: friendChats.value.some(friend => Number(friend.id) === Number(user.userId))
  }
}

const openDiscovery = async (mode = 'city') => {
  discoveryMode.value = mode
  refreshDiscoveryGreetCount(mode)

  emit('chat-active', true)
  showRadarModal.value = true
  isCityPicksLoading.value = true
  foundPatients.value = []
  discoveryIndex.value = 0

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
      foundPatients.value = res.data.slice(0, 5).map(user => mapCityPick(user, mode))
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
  foundPatients.value = foundPatients.value.filter(p => p.id !== targetId)
  if (discoveryIndex.value >= foundPatients.value.length) {
    discoveryIndex.value = Math.max(0, foundPatients.value.length - 1)
  }
}

const skipCurrentDiscoveryPick = () => {
  if (!currentDiscoveryPick.value) return
  if (discoveryIndex.value < foundPatients.value.length - 1) {
    discoveryIndex.value += 1
  } else {
    skipCityPick(currentDiscoveryPick.value.id)
  }
}

const openDiscoveryProfile = async (pick) => {
  if (!pick?.id) return
  await openUserProfile(pick.id)
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
    return
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
  sign: '缓解期 · 每天努力多吃一勺白粥',
  avatar: avatarOf('', 'Xuan'),
  cover: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80',
  style: 'warm'
})

const myId = Number(localStorage.getItem('userId')) || 1
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
const composerVisibility = ref('public') // public / comrade / private
const isPublishing = ref(false)
const mediaUploading = ref(false)
const MAX_MEDIA = 9

// 可见范围三档
const visibilityOptions = [
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
const chatList = computed(() => {
  return [...groupChats.value, ...friendChats.value].sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0))
})
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
    name: result.name || existing?.name || (result.type === 'group' ? '未知小队' : '神秘战友'),
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

const openAddFriendShortcut = async () => {
  showQuickCreateMenu.value = false
  currentTab.value = 'contacts'
  await nextTick()
  addFriendCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => friendSearchInputRef.value?.focus(), 260)
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
      searchResults.value = res.data || []
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
    }
  } catch (error) {
    console.error("拉取好友失败:", error)
  }
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

// ============ 战友资料卡 ============
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
  return profileRemark.value || profileUser.value?.nickname || '神秘战友'
})
const profileMomentsTitle = computed(() => Number(profileUser.value?.userId) === myId ? '我的朋友圈' : `${profileDisplayName.value}的朋友圈`)
const canRemarkProfile = computed(() => !!profileFriendChat.value && Number(profileUser.value?.userId) !== myId)

const saveFriendRemarks = () => {
  localStorage.setItem('friend_remarks', JSON.stringify(friendRemarks.value))
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
    }

    if (momentsRes.status === 'fulfilled' && (momentsRes.value.status === 200 || momentsRes.value.code === 200)) {
      profileMoments.value = (momentsRes.value.data || []).map(mapMoment)
    }
  } catch (e) {
    console.error('加载战友资料失败', e)
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

const careFromUserProfile = async () => {
  if (!profileUser.value || profileUser.value.reactedToday) return
  try {
    const res = await http.post('/team/status/react', {
      targetUserId: profileUser.value.userId,
      reactionType: 'seen'
    })
    if (res.status === 200 || res.code === 200) {
      profileUser.value.reactedToday = 1
      profileUser.value.reactions = (profileUser.value.reactions || 0) + 1
      userProfileData.value.iSent = (userProfileData.value.iSent || 0) + 1
    } else {
      alert(res.message || '送关心失败')
    }
  } catch (e) {
    alert('送关心失败，请稍后再试')
  }
}

const startChatFromProfile = () => {
  if (!profileUser.value || Number(profileUser.value.userId) === myId) return
  const existing = friendChats.value.find(item => Number(item.id) === Number(profileUser.value.userId))
  const chat = existing || {
    type: 'single',
    id: profileUser.value.userId,
    name: profileDisplayName.value,
    rawName: profileUser.value.nickname || '神秘战友',
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
      alert(res.message || '已群发给全体战友 📡')
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
      pendingRequests.value = res.data
    }
  } catch (error) {
    console.error("拉取申请列表失败:", error)
  }
}

const sendFriendRequest = async (targetId, options = {}) => {
  if (!targetId) return false
  try {
    // 对应后端: @RequestBody Friendship request -> { addresseeId: xx }
    const res = await http.post('/friend/request', { addresseeId: Number(targetId) })
    if (res.status === 200) {
      alert(options.successMessage || "好友申请已发送")
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
    console.log(id)
    // 对应你的后端: /api/friend/accept/{id}
    const res = await http.post(`/friend/accept/${id}`)
    if (res.status === 200) {
      alert("已成为伙伴！")
      loadPendingRequests() // 刷新申请列表
      loadFriends() // 刷新好友列表
    }
  } catch (error) {
    alert("操作失败")
  }
}

onMounted(() => {
  initWebSocket()
  loadFriends()
  loadGroups()
  loadPendingRequests()
  loadMoments()
  loadWarmth()
  loadMyCity()
})

const plusMenuItems = [
  { icon: 'ri-image-2-line', label: '相册', color: 'text-blue-500', action: 'album' },
  { icon: 'ri-camera-3-line', label: '拍摄', color: 'text-slate-700', action: 'camera' },
  { icon: 'ri-map-pin-line', label: '位置', color: 'text-red-500', action: 'location' },
  { icon: 'ri-folder-2-line', label: '文件', color: 'text-orange-500', action: 'file' },
  { icon: 'ri-vidicon-line', label: '视频通话', color: 'text-green-500', action: 'call' },
  { icon: 'ri-lock-2-line', label: '密聊', color: 'text-violet-500', action: 'secret' },
  { icon: 'ri-bank-card-line', label: '心意', color: 'text-yellow-500', action: 'redpacket' }
]

const myCity = ref(localStorage.getItem('myCity') || '')
const myProvince = ref(localStorage.getItem('myProvince') || '')
const myDistrict = ref(localStorage.getItem('myDistrict') || '')
const areaCode = ref(localStorage.getItem('myAreaCode') || '')
const showAreaPicker = ref(false)
const isLocating = ref(false)
const locationStatus = ref('')
const lastLocation = ref(JSON.parse(localStorage.getItem('lastLocation') || 'null'))

const areaDisplay = computed(() => {
  return [myProvince.value, myCity.value, myDistrict.value].filter(Boolean).join(' · ')
})

const cityDisplay = computed(() => {
  return [myProvince.value, myCity.value].filter(Boolean).join(' · ')
})

// 根据区县编码反查省/市，兼容只存了 city 字段的旧账号
const lookupAreaByCity = (cityName) => {
  if (!cityName) return null
  const cityList = areaList.city_list || {}
  const provinceList = areaList.province_list || {}
  for (const code in cityList) {
    if (cityList[code] === cityName || cityList[code].startsWith(cityName)) {
      const provinceCode = code.slice(0, 2) + '0000'
      return {
        code,
        province: provinceList[provinceCode] || '',
        city: cityList[code],
        district: ''
      }
    }
  }
  return null
}

const loadMyCity = async () => {
  try {
    const res = await http.get('/center/info')
    if (res.status === 200 && res.data) {
      myCard.value.name = res.data.nickname || localStorage.getItem('nickname') || myCard.value.name
      myCard.value.avatar = avatarOf(res.data.avatar, res.data.userId || res.data.nickname || myId)
      myCard.value.sign = res.data.radarSign || res.data.healthPhase || myCard.value.sign
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
      const matched = lookupAreaByCity(res.data.city)
      if (matched) {
        myProvince.value = matched.province
        myCity.value = matched.city
        myDistrict.value = ''
        areaCode.value = matched.code
        localStorage.setItem('myProvince', myProvince.value)
        localStorage.setItem('myCity', myCity.value)
        localStorage.setItem('myDistrict', '')
        localStorage.setItem('myAreaCode', matched.code)
      } else {
        myCity.value = res.data.city
        localStorage.setItem('myCity', myCity.value)
      }
    }
  } catch (e) {
    console.error('读取城市失败', e)
  }
}

const onAreaConfirm = ({ selectedOptions }) => {
  if (!selectedOptions || selectedOptions.length < 2) return
  const province = selectedOptions[0]?.text || ''
  let city = selectedOptions[1]?.text || ''
  // 北京 / 上海 / 天津 / 重庆 这类直辖市第二级是"市辖区"，把它降级成省名
  if (city === '市辖区' || city === '县') city = province
  myProvince.value = province
  myCity.value = city
  myDistrict.value = selectedOptions[2]?.text || ''
  areaCode.value = selectedOptions[selectedOptions.length - 1]?.value || ''
  localStorage.setItem('myProvince', myProvince.value)
  localStorage.setItem('myCity', myCity.value)
  localStorage.setItem('myDistrict', myDistrict.value)
  localStorage.setItem('myAreaCode', areaCode.value)
  showAreaPicker.value = false
  saveMyCity(true)
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
  areaCode.value = ''
  localStorage.setItem('myProvince', myProvince.value)
  localStorage.setItem('myCity', myCity.value)
  localStorage.setItem('myDistrict', myDistrict.value)
  localStorage.setItem('myAreaCode', '')
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

      locationStatus.value = `已通过定位确认：${cityDisplay.value || myCity.value}。同城精选按城市匹配，不显示区县和精确距离。`
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
  } else if (item.action === 'redpacket') {
    sendRedPacket()
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

const sendRedPacket = async () => {
  const content = '🧧 想给你一点心意。平台不经手钱款，需要的话请去对方主页查看自愿公开的收款码。'
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

  const isLocalNetworkHost = (hostname) => {
    if (!hostname) return false
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    )
  }

  // 甩手掌柜全自动：智能切换本地/生产环境的 WebSocket 聊天链路
  const getWsUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      // 本地/局域网真机调试：让手机连回电脑后端，而不是误飞公网
      if (isLocalNetworkHost(hostname)) {
        const wsHost = hostname === 'localhost' ? 'localhost' : hostname
        return `ws://${wsHost}:8080/ws/${myId}`
      }
    }
    // 如果你在手机 App 上运行或者访问部署上线的网页，直接连接公网服务器的 WebSocket 通道！
    return `ws://106.55.249.7:8080/ws/${myId}`
  }

  const wsUrl = getWsUrl()
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

@keyframes disintegrate {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
    filter: blur(0);
  }
  20% {
    transform: translate(calc(var(--rand-x, 10px) * 0.2), calc(var(--rand-y, -10px) * 0.2)) scale(1.1) rotate(calc(var(--rand-r, 10deg) * 0.2));
    color: #a5b4fc;
  }
  100% {
    transform: translate(var(--rand-x, 80px), var(--rand-y, -120px)) scale(0) rotate(var(--rand-r, 45deg));
    opacity: 0;
    filter: blur(3px);
  }
}

.animate-disintegrate {
  animation: disintegrate 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  --rand-x: 0px;
  --rand-y: 0px;
  --rand-r: 0deg;
}

.paper-river-sheet {
  background:
    radial-gradient(circle at 74% 12%, rgba(248, 244, 198, 0.18), transparent 8rem),
    radial-gradient(circle at 18% 24%, rgba(125, 92, 255, 0.18), transparent 11rem),
    linear-gradient(180deg, #090d21 0%, #0b132a 46%, #071224 100%);
}

.paper-stars,
.paper-stars::before,
.paper-stars::after {
  position: absolute;
  inset: 0;
  content: "";
  pointer-events: none;
}

.paper-stars {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 1.4px),
    radial-gradient(circle, rgba(147, 197, 253, 0.48) 0 1px, transparent 1.6px);
  background-position: 18px 22px, 94px 64px;
  background-size: 92px 92px, 138px 138px;
  opacity: 0.42;
  animation: paper-stars-drift 20s linear infinite;
}

.paper-stars::before {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.88) 0 1px, transparent 1.4px),
    radial-gradient(circle, rgba(251, 191, 36, 0.56) 0 1px, transparent 1.5px);
  background-position: 42px 18px, 130px 92px;
  background-size: 156px 156px, 218px 218px;
  opacity: 0.35;
  animation: paper-stars-pulse 5s ease-in-out infinite;
}

.paper-stars::after {
  background:
    linear-gradient(120deg, transparent 0 42%, rgba(255, 255, 255, 0.28) 48%, transparent 54% 100%) 0 12% / 210px 1px no-repeat;
  opacity: 0.58;
  animation: paper-shooting-star 5.8s ease-in-out infinite;
}

.paper-moon {
  position: absolute;
  right: 32px;
  top: 54px;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: radial-gradient(circle at 32% 30%, #fff9d8 0%, #f8d88b 42%, rgba(248, 216, 139, 0.05) 72%);
  box-shadow: 0 0 38px rgba(248, 216, 139, 0.26);
  opacity: 0.5;
  pointer-events: none;
}

.paper-river {
  position: absolute;
  left: -18%;
  right: -18%;
  bottom: -9%;
  height: 42%;
  pointer-events: none;
  background:
    linear-gradient(165deg, transparent 0 18%, rgba(37, 99, 235, 0.14) 30%, rgba(20, 184, 166, 0.24) 52%, rgba(129, 140, 248, 0.14) 72%, transparent 88%),
    linear-gradient(8deg, rgba(14, 165, 233, 0.18), rgba(49, 46, 129, 0.05));
  border-radius: 48% 52% 0 0 / 36% 38% 0 0;
  filter: blur(0.4px);
  opacity: 0.78;
  transform: rotate(-4deg);
  animation: paper-river-breathe 8s ease-in-out infinite;
}

.paper-river::before,
.paper-river::after {
  position: absolute;
  left: -8%;
  right: -8%;
  content: "";
  border-radius: 999px;
  pointer-events: none;
}

.paper-river::before {
  top: 26%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(186, 230, 253, 0.42), transparent);
  animation: paper-river-line 5.5s linear infinite;
}

.paper-river::after {
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.28), transparent);
  animation: paper-river-line 7s linear infinite reverse;
}

.paper-river-shine {
  position: absolute;
  left: 9%;
  right: 9%;
  bottom: 9%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  opacity: 0.32;
  pointer-events: none;
}

.paper-quota-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.075);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 34px -28px rgba(0, 0, 0, 0.8);
  padding: 12px 16px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.paper-floating-boat {
  position: relative;
  animation: paper-boat-float 4.8s ease-in-out infinite;
}

.paper-floating-boat::before {
  position: absolute;
  right: 18px;
  top: -13px;
  content: "⛵";
  color: rgba(255, 255, 255, 0.82);
  font-size: 24px;
  filter: drop-shadow(0 10px 18px rgba(14, 165, 233, 0.22));
  transform: rotate(-7deg);
}

.paper-history-hero {
  background:
    radial-gradient(circle at 92% 12%, rgba(251, 191, 36, 0.18), transparent 5rem),
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(14, 165, 233, 0.07));
  box-shadow: 0 20px 54px -34px rgba(0, 0, 0, 0.9);
}

.paper-history-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(240, 249, 255, 0.92);
  box-shadow: 0 18px 46px -34px rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: 16px;
}

.paper-history-card > p {
  color: rgba(240, 249, 255, 0.92) !important;
}

.paper-history-empty {
  border: 1px dashed rgba(186, 230, 253, 0.16);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(224, 242, 254, 0.58);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  padding: 18px;
}

.paper-history-stat {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 6px;
  text-align: center;
}

.paper-history-stat b {
  display: block;
  color: white;
  font-size: 14px;
  line-height: 1;
}

.paper-history-stat span {
  display: block;
  color: rgba(224, 242, 254, 0.44);
  font-size: 10px;
  font-weight: 800;
  margin-top: 4px;
}

.paper-history-note {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.28);
  padding: 10px 12px;
}

.paper-history-note span {
  display: block;
  color: rgba(186, 230, 253, 0.5);
  font-size: 10px;
  font-weight: 900;
  margin-bottom: 4px;
}

.paper-history-note p {
  margin: 0;
  color: rgba(240, 249, 255, 0.86);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.55;
}

@keyframes paper-stars-drift {
  from { background-position: 18px 22px, 94px 64px; }
  to { background-position: 110px 114px, 232px 202px; }
}

@keyframes paper-stars-pulse {
  0%, 100% { opacity: 0.22; }
  50% { opacity: 0.48; }
}

@keyframes paper-shooting-star {
  0%, 54% {
    transform: translate3d(-45%, 0, 0);
    opacity: 0;
  }
  62% {
    opacity: 0.6;
  }
  76%, 100% {
    transform: translate3d(120%, 0, 0);
    opacity: 0;
  }
}

@keyframes paper-river-breathe {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg) scaleY(1); }
  50% { transform: translate3d(2%, -2%, 0) rotate(-3deg) scaleY(1.06); }
}

@keyframes paper-river-line {
  from { transform: translateX(-22%); }
  to { transform: translateX(22%); }
}

@keyframes paper-boat-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(-0.2deg); }
  50% { transform: translate3d(0, -4px, 0) rotate(0.4deg); }
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
