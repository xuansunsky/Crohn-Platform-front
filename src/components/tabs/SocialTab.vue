<template>
  <div class="relative h-full bg-[#FBF9F5] flex flex-col overflow-hidden">

    <div v-show="currentView === 'list'" class="flex-1 overflow-y-auto custom-scroll w-full z-10 relative bg-[#FBF9F5] flex flex-col">

      <!-- ============ 朋友圈封面 Hero ============ -->
      <div class="shrink-0 relative">
        <!-- 封面图 -->
        <div class="relative h-44 overflow-hidden">
          <img :src="myCard.cover" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"></div>

          <!-- 顶部小标签 + 相机 -->
          <div class="absolute top-3 left-4 right-4 flex justify-between items-center z-10">
            <span class="text-[10px] font-black tracking-[0.3em] text-white uppercase backdrop-blur-md bg-black/25 px-2.5 py-1 rounded-full border border-white/20">
              ✦ Paradise · 密友圈
            </span>
            <div class="flex items-center gap-2">
              <button @click="openPaperBoat" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="情绪解压纸船">
                <i class="ri-ship-line text-base"></i>
              </button>
              <button @click="openComposer" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center active:scale-90 transition-all" title="发布动态">
                <i class="ri-camera-line text-base"></i>
              </button>
            </div>
          </div>

          <!-- 右下：用户信息 -->
          <div class="absolute bottom-3 left-4 right-24 z-10">
            <p class="text-white/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5">My Wall</p>
            <h2 class="text-white text-[20px] font-black tracking-tight leading-tight drop-shadow-md">{{ myCard.name }}</h2>
            <p class="text-white/85 text-[11.5px] font-medium tracking-wide drop-shadow-sm mt-0.5">{{ myCard.sign }}</p>
            <button @click="copyMyId" class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 active:scale-95 transition-all">
              <i class="ri-fingerprint-line"></i> 我的ID: {{ myId }}
              <i class="ri-file-copy-line ml-0.5"></i>
            </button>
          </div>

        </div>

        <!-- 头像悬浮 -->
        <div class="absolute -bottom-7 right-4 z-40">
          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-br from-blue-500 to-violet-500 rounded-[20px] blur opacity-40"></div>
            <img :src="myCard.avatar" class="relative w-[60px] h-[60px] rounded-[18px] border-[3px] border-[#FBF9F5] object-cover bg-white shadow-md" />
            <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#FBF9F5] rounded-full"></span>
          </div>
        </div>
      </div>

      <!-- ============ Tab Pills ============ -->
      <div class="sticky top-0 shrink-0 px-5 pt-8 pb-3 z-30 bg-[#FBF9F5]/90 backdrop-blur-xl border-b border-stone-200/40">
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
              <button class="text-slate-300 hover:text-slate-600 transition-all active:scale-90 -mr-1 -mt-1 p-1">
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
                <img v-else :src="img" class="w-full h-full object-cover cursor-pointer" loading="lazy" />
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
              <div v-if="post.visibility && post.visibility !== 'public'" class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md" :class="post.visibility === 'private' ? 'text-slate-500 bg-slate-100' : 'text-emerald-600 bg-emerald-50'">
                <i :class="post.visibility === 'private' ? 'ri-lock-2-fill' : 'ri-shield-check-fill'" class="text-[12px]"></i>
                {{ post.visibility === 'private' ? '仅自己' : '仅战友' }}
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
                placeholder="说点什么暖暖TA..."
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
          <div v-for="item in chatList" :key="item.type + '-' + item.id" @click="openChat(item)" class="group mb-4 p-4 flex items-center cursor-pointer bg-white/50 backdrop-blur-lg rounded-[28px] border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] hover:-translate-y-0.5 transition-all duration-400 active:scale-[0.98]">
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

          <div class="relative overflow-hidden bg-white p-5 rounded-[28px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-5">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl"></div>

            <div class="relative z-10 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-slate-800 text-[18px] font-black tracking-tight mb-1 flex items-center gap-2">
                    <i class="ri-map-pin-user-fill text-blue-500"></i> 同城精选
                  </h3>
                  <p class="text-slate-400 text-[12px] font-medium">
                    当前城市：<span class="text-blue-600 font-black">{{ myCity || '还没选择' }}</span> · 匹配同城 Crohn 战友
                  </p>
                </div>
                <div class="flex items-center gap-[-10px]">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" class="w-8 h-8 rounded-full border-2 border-white shadow-sm z-30">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" class="w-8 h-8 rounded-full border-2 border-white shadow-sm z-20 -ml-3">
                  <div class="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold z-10 -ml-3 shadow-sm">
                    +12
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-[1fr_auto] gap-2">
                <button
                  @click="showAreaPicker = true"
                  class="min-w-0 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[13px] font-black outline-none focus:border-blue-300 focus:bg-white transition-all flex items-center justify-between gap-2"
                  :class="myCity ? 'text-slate-700' : 'text-slate-400'"
                >
                  <span class="truncate">{{ areaDisplay || '选择你的省 / 市 / 区' }}</span>
                  <i class="ri-arrow-down-s-line text-base text-slate-400 shrink-0"></i>
                </button>
                <button
                  @click="detectAndSaveLocation"
                  :disabled="isLocating"
                  class="px-4 py-3 rounded-2xl text-[12px] font-black text-white bg-blue-600 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:bg-slate-400"
                >
                  <i class="ri-crosshair-2-line" :class="{ 'animate-pulse': isLocating }"></i>
                  {{ isLocating ? '定位中' : '发定位' }}
                </button>
              </div>

              <van-popup v-model:show="showAreaPicker" position="bottom" round teleport="body" :z-index="200">
                <van-area
                  :area-list="areaList"
                  :value="areaCode"
                  title="选择城市"
                  @confirm="onAreaConfirm"
                  @cancel="showAreaPicker = false"
                />
              </van-popup>

              <p v-if="locationStatus" class="text-[11px] font-bold text-slate-400 leading-relaxed">
                {{ locationStatus }}
              </p>

              <button
                @click="openRadar"
                class="w-full py-3 rounded-2xl text-[13px] font-black bg-slate-900 text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <i class="ri-radar-line animate-pulse"></i>
                开始匹配同城好友
              </button>
            </div>
          </div>

          <div class="bg-white/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/80 shadow-sm">
            <h3 class="text-[12px] font-black text-blue-600 tracking-widest uppercase mb-4 flex items-center gap-1"><i class="ri-search-2-line"></i> 搜索 / 添加好友</h3>
            <div class="flex items-center gap-3">
              <input v-model="friendSearchKeyword" @keydown.enter="searchUsers" type="text" placeholder="输入昵称或对方 ID..." class="flex-1 bg-white/80 rounded-full px-5 py-3 text-[14px] font-medium outline-none border border-white focus:border-blue-300 focus:shadow-md transition-all">
              <button @click="searchUsers" :disabled="isSearching" class="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg hover:bg-slate-800 active:scale-90 transition-all disabled:bg-slate-400">
                <i class="ri-search-line text-xl" :class="{ 'animate-pulse': isSearching }"></i>
              </button>
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="mt-4 space-y-2.5">
              <div v-for="u in searchResults" :key="u.userId" class="flex items-center justify-between p-2.5 rounded-2xl bg-white/80 border border-stone-100">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.userId" class="w-10 h-10 rounded-2xl border border-white shadow-sm shrink-0">
                  <div class="min-w-0">
                    <h4 class="text-[14px] font-bold text-slate-800 truncate">{{ u.nickname || '神秘特工' }}</h4>
                    <p class="text-[10.5px] text-slate-400 font-medium">ID: {{ u.userId }}<span v-if="u.city"> · {{ u.city }}</span></p>
                  </div>
                </div>
                <button @click="sendFriendRequest(u.userId)" class="px-4 py-2 bg-blue-600 text-white text-[12px] font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all shrink-0">
                  <i class="ri-user-add-line"></i> 加好友
                </button>
              </div>
            </div>
            <p v-else-if="searchDone" class="mt-4 text-center text-[12px] text-slate-400 font-bold py-2">没找到这个人,换个昵称或 ID 试试 🔍</p>
          </div>

          <div v-if="pendingRequests.length > 0">
            <h3 class="text-[12px] font-black text-slate-400 tracking-widest uppercase mb-3 px-2">新请求接入</h3>
            <div v-for="req in pendingRequests" :key="req.id" class="bg-white/50 backdrop-blur-lg rounded-[28px] p-4 flex items-center justify-between border border-white/60 shadow-sm mb-3">
              <div class="flex items-center gap-3">
                <img :src="req.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + req.id" class="w-[46px] h-[46px] rounded-[18px] object-cover border-2 border-white shadow-sm">
                <div>
                  <h4 class="text-[15px] font-bold text-slate-800">{{ req.nickname || '神秘特工' }}</h4>
                  <p class="text-[11px] text-slate-500 font-medium">请求加入您的小队</p>
                </div>
              </div>
              <button @click="acceptRequest(req.friendshipId)" class="px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[13px] font-bold rounded-full shadow-md shadow-emerald-500/30 hover:shadow-lg active:scale-95 transition-all">
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

          <div class="flex-1 flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <img :src="activeChat?.avatar" class="w-9 h-9 rounded-full object-cover">
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div class="flex flex-col justify-center min-w-0">
              <h2 class="text-[15px] font-semibold text-slate-900 leading-tight truncate">{{ activeChat?.name }}</h2>
              <span class="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{{ activeChat?.type === 'group' ? (activeChat?.memberCount || 0) + ' 位成员' : '在线' }}</span>
            </div>
          </div>

          <button v-if="activeChat?.type === 'group'" @click="openMemberPanel" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all active:scale-90 shrink-0">
            <i class="ri-more-line text-[20px]"></i>
          </button>
        </header>

        <div id="chat-container" class="flex-1 overflow-y-auto px-4 pt-5 pb-4 custom-scroll overscroll-none relative">

          <div class="flex justify-center mb-5">
            <span class="text-[11px] text-slate-400 font-medium px-3 py-1 bg-white/60 rounded-full">今天</span>
          </div>

          <div v-for="(msg, index) in chatHistory" :key="msg.id || index" class="flex flex-col mb-2.5" :class="msg.senderId === myId ? 'items-end' : 'items-start'">

            <span v-if="msg.senderId !== myId && activeChat?.type === 'group'" class="text-[10px] text-slate-400 font-bold mb-0.5 ml-1">{{ msg.senderName || '队友' }}</span>

            <div v-if="msg.senderId !== myId" class="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-md text-[14.5px] max-w-[78%] leading-relaxed border border-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <img v-if="msg.type === 'image'" :src="msg.content" class="max-w-full rounded-xl" />
              <span v-else>{{ msg.content }}</span>
            </div>

            <div v-else class="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-md text-[14.5px] max-w-[78%] leading-relaxed shadow-[0_1px_2px_rgba(37,99,235,0.15)]">
              <img v-if="msg.type === 'image'" :src="msg.content" class="max-w-full rounded-xl" />
              <span v-else>{{ msg.content }}</span>
            </div>
          </div>
        </div>

        <div class="shrink-0 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+8px)] bg-white/80 backdrop-blur-xl border-t border-slate-100/80 relative">

          <div class="flex items-end gap-2">
            <button @click="showPlusMenu = !showPlusMenu; showEmojiMenu = false" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-slate-100 active:scale-90" :class="showPlusMenu ? 'rotate-45 text-blue-600 bg-blue-50' : 'text-slate-500'">
              <i class="ri-add-line text-[24px] transition-transform"></i>
            </button>

            <div class="flex-1 bg-slate-100/80 rounded-3xl flex items-center min-h-[40px] focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 transition-all">
              <input v-model="inputMsg" @keydown.enter="sendMessage" @focus="showPlusMenu = false; showEmojiMenu = false" type="text" placeholder="输入消息..." class="w-full bg-transparent px-4 py-2.5 text-[14.5px] outline-none placeholder-slate-400 text-slate-800">
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

          <div v-show="showPlusMenu" class="grid grid-cols-3 gap-y-5 pt-5 pb-3 mt-2 border-t border-slate-100">
            <div v-for="item in plusMenuItems" :key="item.label" @click="handlePlusItem(item)" class="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100 transition-all">
                <i :class="[item.icon, item.color, 'text-[22px]']"></i>
              </div>
              <span class="text-[11px] text-slate-500 font-medium">{{ item.label }}</span>
            </div>
          </div>
          <input id="chat-album-input" type="file" accept="image/*" class="hidden" @change="sendImageFile" />
          <input id="chat-camera-input" type="file" accept="image/*" capture="environment" class="hidden" @change="sendImageFile" />

        </div>
      </div>
    </transition>

    <transition name="fade-up">
      <div v-if="showRadarModal" class="fixed inset-0 z-[120] bg-slate-50 flex flex-col overflow-hidden font-sans">

        <div class="flex justify-between items-center px-4 py-3 pt-[calc(env(safe-area-inset-top,16px)+10px)] relative z-20 bg-slate-50/90 backdrop-blur-md">
          <button @click="showRadarModal = false,emit('chat-active', false)" class="flex items-center gap-1.5 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-[12px] font-bold active:scale-95 transition-all">
            <i class="ri-arrow-left-s-line text-lg"></i> 返回
          </button>

          <div class="flex items-center gap-4 text-slate-700 text-xl">
            <i class="ri-search-line"></i>
            <i @click="showProfileConfig = true" class="ri-equalizer-line cursor-pointer active:scale-90 transition-all"></i>
            <div class="relative">
              <i class="ri-chat-3-line"></i>
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4 pt-2 pb-24 space-y-5 custom-scroll relative z-10 overscroll-none">
          <div v-for="(p, index) in foundPatients" :key="p.id"
               class="relative w-full aspect-[3/4] max-h-[65vh] rounded-[32px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] bg-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700"
               :style="`animation-fill-mode: both; animation-delay: ${index * 100}ms;`">

            <img :src="p.avatar" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

            <div class="absolute inset-x-0 bottom-0 p-6 pb-8 flex flex-col justify-end">
              <div class="flex flex-wrap gap-2 mb-3">
            <span v-for="tag in p.tags" :key="tag" class="bg-black/40 backdrop-blur-md text-white text-[12px] font-medium px-3 py-1.5 rounded-full">
              {{ tag }}
            </span>
              </div>

              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-white text-[28px] font-black tracking-tight drop-shadow-md">{{ p.name }}</h1>
                <div v-if="p.gender === 'female'" class="w-5 h-5 rounded-full bg-pink-500/80 flex items-center justify-center backdrop-blur-sm">
                  <i class="ri-women-line text-white text-[12px]"></i>
                </div>
                <div v-else class="w-5 h-5 rounded-full bg-blue-500/80 flex items-center justify-center backdrop-blur-sm">
                  <i class="ri-men-line text-white text-[12px]"></i>
                </div>
              </div>

              <p class="text-white/80 text-[13px] font-medium tracking-wide drop-shadow-md flex items-center gap-1.5">
                {{ p.sign }}
                <span class="w-1 h-1 bg-white/50 rounded-full"></span>
                {{ p.distance }}
              </p>

              <button class="absolute right-6 bottom-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-lg">
                <i class="ri-heart-fill text-2xl drop-shadow-md"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

    </transition>

    <transition name="van-slide-up">
      <div v-if="showProfileConfig" class="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-white rounded-t-[36px] p-6 h-[85vh] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.1)] relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full"></div>

          <div class="flex justify-between items-center mb-6 mt-4 shrink-0">
            <div>
              <h2 class="text-slate-900 text-[22px] font-black tracking-tight">信号源配置</h2>
              <p class="text-slate-500 text-[12px] mt-1">定制你的专属同城雷达</p>
            </div>
            <button @click="showProfileConfig = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-90 transition-all">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll space-y-8 pb-6">

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
                <h3 class="text-slate-800 text-[15px] font-black tracking-widest">广播签名</h3>
              </div>
              <textarea v-model="broadcastSign" rows="3" placeholder="说点什么，吸引频率相同的人..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-blue-400 focus:bg-white focus:shadow-[0_8px_20px_rgba(59,130,246,0.1)] transition-all resize-none"></textarea>
            </div>

          </div>

          <div class="shrink-0 pt-4 border-t border-slate-100">
            <button @click="showProfileConfig = false" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-[16px] py-4 rounded-[20px] shadow-[0_10px_20px_rgba(15,23,42,0.2)] active:scale-95 transition-all flex justify-center items-center gap-2">
              保存并开启广播 <i class="ri-radar-line animate-pulse"></i>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- ============ 情绪解压纸船 Modal ============ -->
    <transition name="fade-up">
      <div v-if="showPaperBoatModal" class="fixed inset-0 z-[140] bg-slate-950/85 backdrop-blur-md flex flex-col justify-end">
        <div class="bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-[36px] p-6 h-[85vh] flex flex-col border-t border-slate-800 relative">
          <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-800 rounded-full"></div>

          <div class="flex justify-between items-center mb-6 mt-4 shrink-0">
            <div>
              <h2 class="text-white text-[20px] font-black tracking-tight flex items-center gap-2">
                情绪解压纸船 <i class="ri-ship-2-fill text-indigo-400 animate-pulse"></i>
              </h2>
              <p class="text-slate-400 text-[11px] mt-1">倾倒你的痛苦，它们会化作星光彻底解体消散。</p>
            </div>
            <button @click="showPaperBoatModal = false" class="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 active:scale-90 transition-all">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <!-- 模式选择 -->
          <div class="shrink-0 flex bg-slate-800/55 p-1 rounded-full border border-slate-750 gap-0.5 mb-6">
            <button @click="paperBoatTab = 'write'" :class="paperBoatTab === 'write' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'" class="flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all">
              写下心事
            </button>
            <button @click="paperBoatTab = 'scoop'" :class="paperBoatTab === 'scoop' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'" class="flex-1 py-1.5 text-[12px] font-bold rounded-full transition-all">
              捞取漂流纸船
            </button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll space-y-6 pb-6">
            <!-- 写下心事 -->
            <div v-if="paperBoatTab === 'write'" class="space-y-5">
              <div class="relative">
                <textarea 
                  v-model="paperBoatText" 
                  rows="6" 
                  :disabled="isDisintegrating"
                  placeholder="写下你此时此刻所有的委屈、愤怒、或者对病痛的无助。这里没有人知道你是谁，写完它，然后彻底粉碎放飞吧..."
                  :class="[
                    'w-full bg-slate-900 border rounded-2xl p-4 text-slate-100 text-[13.5px] font-medium outline-none transition-all resize-none',
                    isDisintegrating ? 'border-indigo-500/20 text-transparent select-none cursor-default' : 'border-slate-800 focus:border-indigo-500 focus:shadow-[0_8px_30px_rgba(99,102,241,0.2)]'
                  ]"
                ></textarea>
                
                <!-- 粒子粉碎动画层 -->
                <div v-if="isDisintegrating" class="absolute inset-0 p-4 overflow-hidden pointer-events-none flex flex-wrap content-start gap-0.5">
                  <span 
                    v-for="(word, wIdx) in paperBoatText.split('')" 
                    :key="wIdx"
                    class="text-[13.5px] text-indigo-300 font-bold inline-block animate-disintegrate"
                    :style="getDisintegrateStyle()"
                  >
                    {{ word === '\n' ? '' : word }}
                  </span>
                </div>
              </div>

              <div class="text-[11px] text-slate-500 text-center leading-relaxed">
                点击碎裂放飞，所有的字符都会在物理级被彻底粉碎抹除，不记入任何数据库。
              </div>
            </div>

            <!-- 捞取心事 -->
            <div v-if="paperBoatTab === 'scoop'" class="space-y-4">
              <div v-if="scoopedBoat" class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in zoom-in duration-300">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-indigo-400 font-black tracking-widest uppercase">
                    ⛵ 捞起了一只匿名纸船
                  </span>
                  <span class="text-[10px] text-slate-500 font-bold">
                    {{ scoopedBoat.time }}
                  </span>
                </div>
                
                <p class="text-[13.5px] text-slate-200 leading-relaxed italic">
                  “{{ scoopedBoat.content }}”
                </p>
                
                <div class="flex justify-end gap-2 pt-2">
                  <button 
                    @click="sendBreezeToScooped"
                    :disabled="scoopedBoat.breezed"
                    class="px-4 py-2 rounded-full text-[11px] font-black text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 transition-all flex items-center gap-1 disabled:bg-emerald-500/20 disabled:text-emerald-400 disabled:border-emerald-500/30"
                  >
                    <i class="ri-windy-line" :class="{ 'animate-spin': scoopedBoat.breezed }"></i>
                    {{ scoopedBoat.breezed ? '微风已吹过 🍃' : '吹拂微风 🍃' }}
                  </button>
                  <button 
                    @click="scoopAnother"
                    class="px-4 py-2 rounded-full text-[11px] font-black text-slate-400 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
                  >
                    换一只 🌊
                  </button>
                </div>
              </div>
              
              <div v-else class="text-center py-10 space-y-4">
                <div class="text-[28px] text-indigo-400 animate-bounce">🌊</div>
                <p class="text-[12px] text-slate-400 font-bold">点击网起江河里漂来的匿名纸船...</p>
                <button 
                  @click="scoopAnother" 
                  class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[12.5px] rounded-full active:scale-95 transition-all shadow-md shadow-indigo-600/20"
                >
                  抛网打捞 ⛵
                </button>
              </div>
            </div>
          </div>

          <div v-if="paperBoatTab === 'write'" class="shrink-0 pt-4 border-t border-slate-800">
            <button 
              @click="disintegratePaperBoat" 
              :disabled="!paperBoatText.trim() || isDisintegrating"
              class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-[15px] py-4 rounded-[20px] shadow-[0_10px_20px_rgba(99,102,241,0.2)] active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              碎裂放飞 ⛵
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============ 发布动态 Composer · 全屏沉浸（小红书布局）============ -->
    <transition name="page-slide">
      <div v-if="showComposer" class="fixed inset-0 z-[140] bg-white flex flex-col">

        <!-- 顶栏：返回 -->
        <header class="shrink-0 flex items-center h-14 px-2.5 border-b border-slate-50">
          <button @click="showComposer = false" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-all">
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
          <button @click="showComposer = false" class="px-6 py-3.5 rounded-full text-[14px] font-bold text-slate-600 bg-slate-100 active:scale-95 transition-all">
            存草稿
          </button>
          <button
            @click="publishMoment"
            :disabled="isPublishing || mediaUploading"
            class="flex-1 py-3.5 rounded-full text-[15px] font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <i class="ri-send-plane-fill" :class="{ 'animate-pulse': isPublishing }"></i>
            {{ isPublishing ? '发布中...' : '发布到密友圈' }}
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
          <p class="text-[12px] text-slate-400 font-medium mb-4">这条消息会单独发给你的每一位好友。</p>
          <textarea v-model="broadcastText" rows="4" placeholder="想对全体战友说点什么?如:今晚八段锦走起!" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-[14px] font-medium outline-none focus:border-rose-400 focus:bg-white transition-all resize-none mb-4"></textarea>
          <button @click="sendBroadcast" :disabled="isSendingBroadcast || !broadcastText.trim()" class="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-black text-[15px] py-4 rounded-[20px] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2">
            <i class="ri-broadcast-line" :class="{ 'animate-pulse': isSendingBroadcast }"></i>
            {{ isSendingBroadcast ? '广播中...' : '发射广播' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- ============ 小队成员面板 ============ -->
    <transition name="fade-up">
      <div v-if="showMemberPanel" class="fixed inset-0 z-[150] flex justify-end">
        <div @click="showMemberPanel = false" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div class="relative w-[80%] max-w-[340px] h-full bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300">
          <div class="shrink-0 px-5 pt-[calc(env(safe-area-inset-top,16px)+16px)] pb-4 border-b border-slate-100">
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <h2 class="text-[18px] font-black text-slate-900 tracking-tight truncate">{{ activeChat?.name }}</h2>
                <p class="text-[12px] text-slate-400 font-bold mt-0.5">{{ groupMembers.length }} 位成员</p>
              </div>
              <button @click="showMemberPanel = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90 transition-all shrink-0">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto custom-scroll px-3 py-3 space-y-1">
            <p v-if="loadingMembers" class="text-center text-[13px] text-slate-400 font-bold py-10">加载成员中...</p>
            <div v-for="m in groupMembers" :key="m.userId" class="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all">
              <img :src="m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.userId" class="w-11 h-11 rounded-2xl border border-white shadow-sm object-cover bg-slate-100">
              <div class="flex-1 min-w-0">
                <h4 class="text-[14.5px] font-bold text-slate-800 truncate">{{ m.nickname || '神秘队员' }}</h4>
                <span v-if="m.userId === myId" class="text-[11px] text-slate-400 font-medium">我自己</span>
              </div>
              <span v-if="m.role === 'OWNER'" class="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                <i class="ri-vip-crown-fill"></i> 队长
              </span>
              <span v-else class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">队员</span>
            </div>
          </div>
          <div class="shrink-0 p-4 border-t border-slate-100 pb-[calc(env(safe-area-inset-bottom,8px)+16px)]">
            <button @click="openInviteFromPanel" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-[14px] py-3.5 rounded-[18px] active:scale-95 transition-all flex justify-center items-center gap-2">
              <i class="ri-user-add-line"></i> 邀请战友进队
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
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, computed, watch } from 'vue'
import http from '@/api/http'
import { areaList } from '@vant/area-data'
import StatusBoard from '@/components/tabs/StatusBoard.vue'

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
const isDisintegrating = ref(false)
const scoopedBoat = ref(null)

const mockBurdens = [
  { content: '今天刚做了肠镜，溃疡面还是很大，什么时候是个头啊...', time: '10分钟前', breezed: false },
  { content: '明天就要开始打生物制剂了，心里有点害怕，对身体会有影响吗？', time: '1小时前', breezed: false },
  { content: '连续喝了一星期的全流食白粥，真的好馋，好想痛快吃顿烤肉 😭', time: '3小时前', breezed: false },
  { content: '因为请假太频繁主管找我谈话了，慢性病病友在职场真难啊...', time: '半天前', breezed: false }
]

const openPaperBoat = () => {
  showPaperBoatModal.value = true
  paperBoatText.value = ''
  isDisintegrating.value = false
  scoopedBoat.value = null
  paperBoatTab.value = 'write'
}

const disintegratePaperBoat = async () => {
  if (!paperBoatText.value.trim()) return
  isDisintegrating.value = true
  
  try {
    await http.post('/heal/paperboat/release', { content: paperBoatText.value })
  } catch (e) {
    console.error('心事放飞失败', e)
  }
  
  // 2.2秒后粒子碎裂特效结束，清除文本并关闭弹窗
  setTimeout(() => {
    paperBoatText.value = ''
    isDisintegrating.value = false
    showPaperBoatModal.value = false
  }, 2200)
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
  try {
    const res = await http.get('/heal/paperboat/scoop')
    if (res.status === 200 && res.data) {
      scoopedBoat.value = {
        id: res.data.id,
        content: res.data.content,
        time: res.data.time || '刚刚',
        breezed: res.data.breezed || false
      }
    } else {
      const rand = mockBurdens[Math.floor(Math.random() * mockBurdens.length)]
      scoopedBoat.value = { ...rand, id: Date.now(), breezed: false }
    }
  } catch (e) {
    const rand = mockBurdens[Math.floor(Math.random() * mockBurdens.length)]
    scoopedBoat.value = { ...rand, id: Date.now(), breezed: false }
  }
}

const sendBreezeToScooped = async () => {
  if (!scoopedBoat.value) return
  try {
    const res = await http.post('/heal/paperboat/breeze', { boatId: scoopedBoat.value.id })
    if (res.status === 200 || res.code === 200) {
      scoopedBoat.value.breezed = true
      loadWarmth()
    }
  } catch (e) {
    console.error('送微风失败', e)
  }
}

// 社交名片配置
const showProfileConfig = ref(false)
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
const broadcastSign = ref('97年 · 金牛座 · 正在寻找能一起吃火锅的病友！')

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
}

const premiumsGradients = [
  'bg-gradient-to-br from-pink-500/80 to-purple-600/90', // 1: 霓虹夕阳
  'bg-gradient-to-br from-cyan-400 to-blue-600',       // 2: 冰蓝海岸
  'bg-gradient-to-br from-green-400 to-emerald-600',   // 3: 荧光竹林
  'bg-gradient-to-br from-orange-500 to-red-600',     // 4: 火焰珊瑚
  'bg-gradient-to-br from-indigo-500 to-pink-600',     // 5: 薰衣草之夜
]

const mockPatients = [
  {
    id: 1,
    name: '开心.',
    gender: 'female',
    distance: '福州',
    tags: ['桌游', '高尔夫', '网球', '找搭子'],
    sign: '97年 · 金牛座 · IT/互联网',
    // 绝美光影女生人像
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: '沙滩漫步',
    gender: 'female',
    distance: '距你 3.2km',
    tags: ['海边', '摄影', '周末放松'],
    sign: '00后 · 双子座 · 自由职业',
    // 海边唯美背影/人像
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Z-Warrior', // 你的Z战士这次变帅了！
    gender: 'male',
    distance: '距你 1.5km',
    tags: ['运动搭子', '佛系修仙', '健身'],
    sign: '每天八段锦，只要心态好一切都好。',
    // 极具质感的风景/背影图
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: '半夏微凉',
    gender: 'female',
    distance: '距你 5.0km',
    tags: ['寻找饭搭子', '吃货'],
    sign: '新开的那家椰子鸡咱们能吃吗？',
    // 咖啡馆氛围感人像
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  }
]

const openRadar = async () => {
  if (myCity.value) {
    await saveMyCity(false)
  }

  emit('chat-active', true)
  showRadarModal.value = true
  selectedPatient.value = null
  try {
    const res = await http.get('/users/nearby')
    if (res.status === 200 && res.data && res.data.length > 0) {
      foundPatients.value = res.data.map(u => ({
        id: u.userId,
        name: u.nickname || '神秘特工',
        gender: u.gender === 2 ? 'female' : 'male',
        distance: u.city || myCity.value || '同城',
        tags: ['同城战友', u.city || myCity.value || '附近'],
        sign: '在 ' + (u.city || myCity.value || '附近') + ' 等你来打招呼',
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.userId}`
      }))
    } else {
      foundPatients.value = mockPatients.map(p => ({
        ...p,
        distance: myCity.value || p.distance
      }))
    }
  } catch (e) {
    console.error('拉取同城失败', e)
    foundPatients.value = mockPatients.map(p => ({
      ...p,
      distance: myCity.value || p.distance
    }))
  }
}

const foundPatients = ref([
  {
    id: 1,
    name: '特工 001',
    distance: '800m',
    tags: ['造口战神', '经验丰富'],
    sign: '久病成医，内江市中医院熟人，有事问我。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=001',
    // 背景用一张极客暗黑风的风景图/纹理
    cover: 'https://picsum.photos/id/1015/400/600'
  },
  {
    id: 2,
    name: 'ANXIOUS_ROOKIE',
    distance: '3.2km',
    tags: ['情绪树洞', '求医问药'],
    sign: '昨天刚拿到肠镜报告，天塌了，有病友能聊聊吗？',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=002',
    cover: 'https://picsum.photos/id/1043/400/600'
  },
  {
    id: 3,
    name: '内江干饭人',
    distance: '1.5km',
    tags: ['寻找饭搭子', '钢铁之躯'],
    sign: '新开的那家椰子鸡咱们能吃吗？求组队尝试！',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=003',
    cover: 'https://picsum.photos/id/1080/400/600'
  },
  {
    id: 4,
    name: 'Z-Warrior',
    distance: '5.0km',
    tags: ['运动搭子', '佛系修仙'],
    sign: '每天八段锦，只要心态好，一切都会好。',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=004',
    cover: 'https://picsum.photos/id/1055/400/600'
  }
])

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
  sign: 'Architect · Crohn 缓解期 · 每天努力多吃一勺白粥',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xuan',
  cover: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80'
})

const moments = ref([])

const loadMoments = async () => {
  try {
    const res = await http.get('/moment/list')
    if (res.status === 200) {
      moments.value = res.data.map(m => ({
        id: m.id,
        user: {
          name: m.nickname,
          avatar: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userId}`,
          stage: '',
          online: false
        },
        time: m.createdAt ? new Date(m.createdAt).toLocaleString('zh-CN') : '',
        device: m.device || '',
        location: m.location || '',
        visibility: m.visibility || 'public',
        content: m.content,
        images: m.imagesJson ? JSON.parse(m.imagesJson) : [],
        liked: m.liked,
        likesCount: m.likesCount || 0,
        likes: [],
        comments: (m.comments || []).map(c => ({
          user: c.nickname || '神秘特工',
          content: c.content
        })),
        commentInput: '',
        showCommentBox: false
      }))
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
  { value: 'public', label: '公开可见', desc: '所有病友都能看到', icon: 'ri-earth-line' },
  { value: 'comrade', label: '仅战友可见', desc: '只有已认证的 IBD 战友能看', icon: 'ri-shield-check-line' },
  { value: 'private', label: '仅自己可见', desc: '只有你自己能看到', icon: 'ri-lock-2-line' }
]
const showVisibilitySheet = ref(false)
const visibilityLabel = computed(() => {
  const v = visibilityOptions.find(o => o.value === composerVisibility.value)
  return v ? v.label : '公开可见'
})
const pickVisibility = (v) => {
  composerVisibility.value = v
  showVisibilitySheet.value = false
}

// 按扩展名判断是不是视频
const isVideo = (url) => /\.(mp4|mov|webm|m4v|ogg|3gp)(\?|$)/i.test(url || '')

const openComposer = () => {
  showComposer.value = true
  composerText.value = ''
  composerTitle.value = ''
  composerImages.value = []
  composerLocation.value = ''
  composerVisibility.value = 'public'
}

// ---- 标记地点（复用腾讯地图 POI 附近搜索）----
const showLocationSheet = ref(false)
const locationLoading = ref(false)
const locationKeyword = ref('')
const poiResults = ref([])

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
      const tencentKey = 'PBBBZ-R7ZKM-W5X6A-6PYR4-Z3XB6-PFFGM'
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
      script.src = `https://apis.map.qq.com/ws/place/v1/search?keyword=${keyword}&boundary=nearby(${lat},${lng},2000)&key=${tencentKey}&output=jsonp&callback=${callbackName}`
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
    const res = await http.post('/moment/publish', {
      content,
      imagesJson: composerImages.value.length ? JSON.stringify(composerImages.value) : null,
      location: composerLocation.value || null,
      visibility: composerVisibility.value || 'public'
    })
    if (res.status === 200 || res.code === 200) {
      showComposer.value = false
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
const myId = Number(localStorage.getItem('userId')) || 1
const showEmojiMenu = ref(false)
const showPlusMenu = ref(false)
const inputMsg = ref('')
const chatHistory = ref([])
let socket = null

// 联络人状态
const friendChats = ref([])
const groupChats = ref([])
const chatList = computed(() => [...groupChats.value, ...friendChats.value])
const pendingRequests = ref([])
const friendSearchKeyword = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchDone = ref(false)

const copyMyId = async () => {
  const idText = String(myId)
  try {
    await navigator.clipboard.writeText(idText)
    alert('已复制你的 ID:' + idText + '，发给好友就能搜到你啦')
  } catch (e) {
    alert('你的 ID 是:' + idText)
  }
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
      friendChats.value = res.data.map(friend => ({
        type: 'single',
        id: friend.friendId || friend.id,
        name: friend.nickname || '神秘特工',
        avatar: friend.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (friend.friendId || friend.id),
        role: '小队成员',
        lastMsg: '点击发起密聊...',
        time: '',
        unread: null
      }))
    }
  } catch (error) {
    console.error("拉取好友失败:", error)
  }
}

const loadGroups = async () => {
  try {
    const res = await http.get('/group/list')
    if (res.status === 200 || res.code === 200) {
      groupChats.value = (res.data || []).map(g => ({
        type: 'group',
        id: g.id,
        name: g.name,
        avatar: g.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + g.id,
        memberCount: g.memberCount || 0,
        lastMsg: '点击进入小队群聊...',
        time: '',
        unread: null
      }))
    }
  } catch (error) {
    console.error("拉取小队失败:", error)
  }
}

// 收到非当前会话的消息时,给会话列表打未读角标
const bumpUnread = (type, id, content) => {
  const pool = type === 'group' ? groupChats.value : friendChats.value
  const item = pool.find(c => Number(c.id) === Number(id))
  if (item) {
    item.unread = (item.unread || 0) + 1
    item.lastMsg = content
    item.time = '刚刚'
  }
}

// ============ FAB:密聊 / 创建小队 / 群发广播 ============
const showFriendPicker = ref(false)
const showCreateGroup = ref(false)
const showBroadcast = ref(false)
const newGroupName = ref('')
const selectedMembers = ref([])
const broadcastText = ref('')
const isSendingBroadcast = ref(false)

// ============ 小队成员面板 / 邀请 ============
const showMemberPanel = ref(false)
const groupMembers = ref([])
const loadingMembers = ref(false)
const showInvitePicker = ref(false)
const inviteSelected = ref([])

const openMemberPanel = async () => {
  if (!activeChat.value || activeChat.value.type !== 'group') return
  showMemberPanel.value = true
  loadingMembers.value = true
  groupMembers.value = []
  try {
    const res = await http.get(`/group/${activeChat.value.id}/members`)
    if (res.status === 200 || res.code === 200) {
      groupMembers.value = (res.data || []).map(m => ({ ...m, userId: Number(m.userId) }))
    }
  } catch (e) {
    console.error('加载成员失败', e)
  } finally {
    loadingMembers.value = false
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
  isSendingBroadcast.value = true
  try {
    const res = await http.post('/chat/broadcast', { content })
    if (res.status === 200 || res.code === 200) {
      showBroadcast.value = false
      broadcastText.value = ''
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

const sendFriendRequest = async (targetId) => {
  if (!targetId) return
  try {
    // 对应后端: @RequestBody Friendship request -> { addresseeId: xx }
    const res = await http.post('/friend/request', { addresseeId: Number(targetId) })
    if (res.status === 200) {
      alert("申请信号已发送！")
    } else {
      alert(res.message || res.msg || "发送失败")
    }
  } catch (error) {
    alert("请求网络异常")
  }
}

const acceptRequest = async (id) => {
  try {
    console.log(id)
    // 对应你的后端: /api/friend/accept/{id}
    const res = await http.post(`/friend/accept/${id}`)
    if (res.status === 200) {
      alert("已同意接入网络！")
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
  { icon: 'ri-folder-2-line', label: '文件', color: 'text-orange-500', action: 'soon' },
  { icon: 'ri-vidicon-line', label: '视频通话', color: 'text-green-500', action: 'soon' },
  { icon: 'ri-bank-card-line', label: '红包', color: 'text-yellow-500', action: 'redpacket' }
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
  return [myProvince.value, myCity.value, myDistrict.value].filter(Boolean).join(' / ')
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
      locationStatus.value = `已把你的同城雷达切到「${areaDisplay.value}」，现在可以匹配同城好友。`
    }
  } catch (e) {
    console.error('保存城市失败', e)
    if (showTip) {
      locationStatus.value = '城市已先保存到本机，联网后会同步到账号。'
    }
  }
}

const detectAndSaveLocation = () => {
  if (!navigator.geolocation) {
    locationStatus.value = '当前设备不支持浏览器定位，请手动选择城市。'
    return
  }

  isLocating.value = true
  locationStatus.value = '正在请求定位权限...'

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords
      lastLocation.value = { latitude, longitude }
      localStorage.setItem('lastLocation', JSON.stringify(lastLocation.value))

      if (myCity.value) {
        await saveMyCity(false)
      }

      try {
        await http.post('/radar/location', {
          longitude,
          latitude,
          city: myCity.value || ''
        })
      } catch (e) {
        console.error('同步定位到雷达失败', e)
      }

      locationStatus.value = `定位已准备好：${latitude.toFixed(5)}, ${longitude.toFixed(5)}。聊天里点「位置」可发送地图坐标；同城匹配按你选择的城市「${myCity.value || '未选择'}」筛选。`
      isLocating.value = false
    },
    (err) => {
      console.error('定位失败', err)
      locationStatus.value = '定位失败或未授权，请手动选择城市后匹配同城好友。'
      isLocating.value = false
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
}

const handlePlusItem = async (item) => {
  showPlusMenu.value = false
  if (item.action === 'album') {
    document.getElementById('chat-album-input')?.click()
  } else if (item.action === 'camera') {
    document.getElementById('chat-camera-input')?.click()
  } else if (item.action === 'location') {
    sendLocationMessage()
  } else if (item.action === 'redpacket') {
    sendRedPacket()
  } else {
    if (typeof showToast === 'function') {
      showToast('该功能即将上线 🚧')
    } else {
      alert('该功能即将上线 🚧')
    }
  }
}

const sendImageFile = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    const upRes = await http.post('/upload', formData)
    const imgUrl = upRes.data
    await dispatchMessage(imgUrl, 'image')
  } catch (err) {
    alert('图片发送失败')
  }
  e.target.value = ''
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
  const amount = (Math.random() * 8.88 + 0.88).toFixed(2)
  const content = `🧧 给你撒个虚拟红包：¥${amount}（仅供娱乐，暖暖心）`
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
  const tempMsg = {
    id: Date.now(),
    senderId: myId,
    receiverId: activeChat.value.id,
    content,
    type,
    senderName: myCard.value.name
  }
  chatHistory.value.push(tempMsg)
  scrollToBottom()
  try {
    if (activeChat.value.type === 'group') {
      await http.post(`/group/${activeChat.value.id}/send`, { content, type })
    } else {
      await http.post('/chat/send', { receiverId: activeChat.value.id, content, type })
    }
  } catch (error) {
    console.error("发送失败:", error)
    alert("发送失败，请检查网络")
  }
}

const closeChat = () => {
  currentView.value = 'list'
  activeChat.value = null
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

  // 甩手掌柜全自动：智能切换本地/生产环境的 WebSocket 聊天链路
  const getWsUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // 如果你在本地开发调试网页
      if (hostname === 'localhost' && window.location.port === '5173') {
        return `ws://localhost:8080/ws/${myId}`
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
        scrollToBottom()
      } else {
        bumpUnread('group', data.groupId, data.content)
      }
    } else {
      const inThisChat = activeChat.value && activeChat.value.type !== 'group' && Number(activeChat.value.id) === Number(data.senderId)
      if (inThisChat) {
        chatHistory.value.push({
          id: Date.now(),
          senderId: data.senderId,
          content: data.content,
          type: data.type || 'text'
        })
        scrollToBottom()
      } else {
        bumpUnread('single', data.senderId, data.content)
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
