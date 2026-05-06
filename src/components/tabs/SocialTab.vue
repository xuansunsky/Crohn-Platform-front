<template>
  <div class="absolute inset-x-0 top-[50px] bottom-[50px] bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex flex-col overflow-hidden z-10">

    <div v-show="currentView === 'list'" class="flex-1 flex flex-col min-h-0 w-full z-10 relative">

      <div class="shrink-0 px-6 pt-8 pb-2 z-20">
        <div class="flex justify-between items-center mb-7">
          <div>
            <h1 class="text-[32px] font-black tracking-tight text-slate-800 flex items-center gap-2">
              小队通讯录
              <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.6)]"></span>
            </h1>
            <p class="text-[10px] text-slate-400 font-bold tracking-[0.25em] uppercase mt-1">Secure Network</p>
          </div>
          <div class="relative group">
            <div class="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
            <button @click="showFabMenu = !showFabMenu" class="relative w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white transform transition-all duration-300 active:scale-90 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" :class="{ 'rotate-45': showFabMenu }">
              <i class="ri-add-line text-2xl"></i>
            </button>
            <transition name="fade-up">
              <div v-if="showFabMenu" class="absolute top-14 right-0 bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-2 w-36 border border-white origin-top-right">
                <button v-for="menu in ['发起密聊', '创建小队', '群发广播']" :key="menu" class="w-full text-left px-4 py-3 text-sm hover:bg-slate-50/80 rounded-[16px] transition-all text-slate-800 font-bold">{{ menu }}</button>
              </div>
            </transition>
          </div>
        </div>

        <div class="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-full mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/60">
          <button @click="currentTab = 'chat'" :class="currentTab === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'" class="flex-1 py-2.5 text-[14px] font-black rounded-full transition-all">
            <i class="ri-message-3-fill mr-1"></i> 会话
          </button>
          <button @click="currentTab = 'contacts'" :class="currentTab === 'contacts' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'" class="flex-1 py-2.5 text-[14px] font-bold rounded-full transition-all">
            <i class="ri-user-smile-line mr-1"></i> 联络人
          </button>
          <button @click="currentTab = 'todo'" :class="currentTab === 'todo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'" class="flex-1 py-2.5 text-[14px] font-bold rounded-full transition-all">
            <i class="ri-checkbox-circle-line mr-1"></i> 小队待办
          </button>
        </div>

      </div>

      <div class="flex-1 overflow-y-auto px-6 pb-6 pt-2 custom-scroll bg-transparent overscroll-none">

        <div v-show="currentTab === 'chat'">
          <div v-for="item in chatList" :key="item.id" @click="openChat(item)" class="group mb-4 p-4 flex items-center cursor-pointer bg-white/50 backdrop-blur-lg rounded-[28px] border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] hover:-translate-y-0.5 transition-all duration-400 active:scale-[0.98]">
            <div class="relative">
              <img :src="item.avatar" class="w-[56px] h-[56px] rounded-[22px] object-cover shrink-0 shadow-sm border-2 border-white transition-transform duration-500 group-hover:scale-105 group-hover:border-blue-100">
              <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div class="ml-4 flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <h3 class="text-[16px] font-bold text-slate-900 truncate">{{ item.name }}</h3>
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
          <div @click="openRadar" class="relative overflow-hidden bg-white p-5 rounded-[28px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer group active:scale-95 transition-all mb-5">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>

            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h3 class="text-slate-800 text-[18px] font-black tracking-tight mb-1 flex items-center gap-2">
                  <i class="ri-map-pin-user-fill text-blue-500"></i> 同城精选
                </h3>
                <p class="text-slate-400 text-[12px] font-medium">发现附近的 Crohn 饮食搭子...</p>
              </div>
              <div class="flex items-center gap-[-10px]">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" class="w-8 h-8 rounded-full border-2 border-white shadow-sm z-30">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" class="w-8 h-8 rounded-full border-2 border-white shadow-sm z-20 -ml-3">
                <div class="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold z-10 -ml-3 shadow-sm">
                  +12
                </div>
              </div>
            </div>
          </div>   <div class="bg-white/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/80 shadow-sm">
            <h3 class="text-[12px] font-black text-blue-600 tracking-widest uppercase mb-4 flex items-center gap-1"><i class="ri-radar-line"></i> 搜寻特工</h3>
            <div class="flex items-center gap-3">
              <input v-model="newFriendId" type="text" placeholder="输入对方 ID 编码..." class="flex-1 bg-white/80 rounded-full px-5 py-3 text-[14px] font-medium outline-none border border-white focus:border-blue-300 focus:shadow-md transition-all">
              <button @click="sendFriendRequest" class="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg hover:bg-slate-800 active:scale-90 transition-all">
                <i class="ri-user-add-line text-xl"></i>
              </button>
            </div>
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

        <div v-show="currentTab === 'todo'" class="flex flex-col items-center justify-center pt-24 opacity-60">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <i class="ri-rocket-2-line text-4xl text-blue-500"></i>
          </div>
          <h3 class="text-lg font-black text-slate-700">小队任务中心</h3>
          <p class="text-[13px] font-medium text-slate-500 mt-1">健康饮食 / 目标探讨 / 协同建设中...</p>
        </div>

      </div>
    </div>

    <transition name="slide-right">
      <div v-if="currentView === 'chat'" class="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 z-[100] overflow-hidden">

        <div class="absolute top-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div class="absolute top-1/4 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div class="shrink-0 mt-[env(safe-area-inset-top,16px)] mx-4 mb-2 p-1.5 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] z-20 relative flex items-center justify-between">

          <button @click="closeChat" class="w-11 h-11 flex items-center justify-center hover:bg-slate-100/60 rounded-full transition-all active:scale-90 shrink-0">
            <i class="ri-arrow-left-s-line text-[28px] text-slate-800"></i>
          </button>

          <div class="flex-1 flex items-center gap-3 px-1 cursor-pointer group">
            <div class="relative shrink-0">
              <img :src="activeChat?.avatar" class="w-10 h-10 rounded-full object-cover shadow-sm border border-white/80 group-hover:scale-105 transition-transform duration-300">
              <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></span>
            </div>

            <div class="flex flex-col justify-center">
              <h2 class="text-[15px] font-black text-slate-800 leading-none tracking-tight flex items-center gap-1.5">
                {{ activeChat?.name }}
                <i class="ri-vip-crown-fill text-yellow-500 text-[13px] drop-shadow-sm"></i>
              </h2>
              <span class="text-[11px] text-emerald-500 font-bold mt-1 tracking-wide opacity-90 flex items-center gap-1">
                Active Now
              </span>
            </div>
          </div>

          <div class="flex items-center gap-0.5 pr-1 shrink-0">
            <button class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-full transition-all active:scale-90">
              <i class="ri-phone-line text-[20px]"></i>
            </button>
            <button class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50/80 rounded-full transition-all active:scale-90">
              <i class="ri-video-chat-line text-[20px]"></i>
            </button>
            <button class="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-full transition-all active:scale-90">
              <i class="ri-more-2-fill text-[20px]"></i>
            </button>
          </div>

        </div>

        <div id="chat-container" class="flex-1 overflow-y-auto px-5 pt-4 pb-6 custom-scroll overscroll-none z-10 relative">
          <div v-for="(msg, index) in chatHistory" :key="msg.id || index" class="flex flex-col mb-5" :class="msg.senderId === myId ? 'items-end' : 'items-start'">

            <div v-if="msg.senderId !== myId" class="bg-white/80 backdrop-blur-xl text-slate-800 px-5 py-3.5 rounded-[22px] rounded-tl-sm text-[15px] max-w-[80%] leading-relaxed shadow-sm border border-white/60">
              {{ msg.content }}
            </div>

            <div v-else class="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-5 py-3.5 rounded-[22px] rounded-tr-sm text-[15px] max-w-[80%] leading-relaxed shadow-lg shadow-slate-900/20">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <div class="shrink-0 px-4 pb-[env(safe-area-inset-bottom,20px)] z-20 relative">
          <div class="bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-300 p-2">

            <div class="flex items-center gap-2">
              <button @click="showPlusMenu = !showPlusMenu; showEmojiMenu = false" class="w-11 h-11 bg-white/80 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-white shadow-sm active:scale-95" :class="showPlusMenu ? 'rotate-45 text-blue-600' : 'text-slate-500'">
                <i class="ri-add-line text-[24px] transition-transform"></i>
              </button>

              <div class="flex-1 bg-slate-100/60 rounded-full border border-white/50 focus-within:bg-white focus-within:shadow-sm focus-within:border-blue-200 transition-all flex items-center min-h-[44px]">
                <input v-model="inputMsg" @keydown.enter="sendMessage" @focus="showPlusMenu = false; showEmojiMenu = false" type="text" placeholder="Message..." class="w-full bg-transparent px-4 py-2.5 text-[15px] font-medium outline-none placeholder-slate-400 text-slate-800 leading-normal">
                <button @click="showEmojiMenu = !showEmojiMenu; showPlusMenu = false" class="p-2.5 text-slate-400 hover:text-yellow-500 transition-colors shrink-0">
                  <i class="ri-emotion-line text-xl"></i>
                </button>
              </div>

              <button @click="sendMessage" class="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 active:scale-90 transition-all group">
                <i class="ri-send-plane-fill text-white text-[18px] relative right-[1px] top-[1px] group-active:translate-x-1 group-active:-translate-y-1 transition-transform duration-200"></i>
              </button>
            </div>

            <div v-show="showEmojiMenu" class="px-2 pt-4 pb-2 mt-1 border-t border-white/30">
              <div class="grid grid-cols-7 gap-y-4 gap-x-2">
                <button v-for="emoji in emojis" :key="emoji" @click="appendEmoji(emoji)" class="text-[26px] hover:scale-125 transition-transform active:scale-90">
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div v-show="showPlusMenu" class="grid grid-cols-4 gap-y-6 pt-5 pb-4 mt-1 border-t border-white/30">
              <div v-for="item in plusMenuItems" :key="item.label" class="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform">
                <div class="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white group-hover:bg-white group-hover:shadow-md transition-all">
                  <i :class="[item.icon, item.color, 'text-2xl']"></i>
                </div>
                <span class="text-[11px] text-slate-500 font-bold">{{ item.label }}</span>
              </div>
            </div>

          </div>
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
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import http from '@/api/http'

const emit = defineEmits(['chat-active'])

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

const openRadar = () => {
  emit('chat-active', true)
  showRadarModal.value = true
  selectedPatient.value = null
  foundPatients.value = mockPatients
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
const currentTab = ref('chat')
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
const chatList = ref([])
const pendingRequests = ref([])
const newFriendId = ref('')

const loadFriends = async () => {
  try {
    const res = await http.get('/friend/list')
    if (res.status === 200 || res.code === 200) {
      chatList.value = res.data.map(friend => ({
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

const sendFriendRequest = async () => {
  if (!newFriendId.value) return
  try {
    // 对应你的后端: @RequestBody Friendship request -> { addresseeId: xx }
    const res = await http.post('/friend/request', { addresseeId: Number(newFriendId.value) })
    if (res.status === 200) {
      alert("申请信号已发送！")
      newFriendId.value = '' // 清空输入框
    } else {
      alert(res.msg || res.message || "发送失败")
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
  loadPendingRequests()
})

const plusMenuItems = [
  { icon: 'ri-image-2-line', label: '相册', color: 'text-blue-500' },
  { icon: 'ri-camera-3-line', label: '拍摄', color: 'text-slate-700' },
  { icon: 'ri-folder-2-line', label: '文件', color: 'text-orange-500' },
  { icon: 'ri-vidicon-line', label: '视频通话', color: 'text-green-500' },
  { icon: 'ri-map-pin-line', label: '位置', color: 'text-red-500' },
  { icon: 'ri-bank-card-line', label: '转账', color: 'text-yellow-500' }
]
const openChat = async (user) => {
  activeChat.value = user
  currentView.value = 'chat'
  chatHistory.value = []
  emit('chat-active', true)
  try {
    const res = await http.get(`/chat/history?friendId=${user.id}`)
    console.log("这是聊天记录",res)
    if (res.status === 200) {
      chatHistory.value = res.data
      scrollToBottom()
    }
  } catch (error) {
    console.error("拉取聊天记录失败:", error)
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

  const tempMsg = {
    id: Date.now(),
    senderId: myId,
    receiverId: activeChat.value.id,
    content: content,
    type: 'text'
  }
  chatHistory.value.push(tempMsg)
  inputMsg.value = ''
  scrollToBottom()

  try {
    await http.post('/chat/send', {
      receiverId: activeChat.value.id,
      content: content,
      type: 'text'
    })
  } catch (error) {
    console.error("发送失败:", error)
    alert("发送失败，请检查网络")
  }
}

const initWebSocket = () => {
  if (typeof(WebSocket) === "undefined") {
    console.error("您的浏览器不支持 WebSocket")
    return
  }

  const wsUrl = `ws://localhost:8080/ws/${myId}`
  socket = new WebSocket(wsUrl)

  socket.onopen = () => console.log("🟢 WebSocket 链路已接通")

  socket.onmessage = (event) => {
    console.log("收到新消息：", event.data)

    if (activeChat.value) {
      chatHistory.value.push({
        id: Date.now(),
        senderId: activeChat.value.id,
        content: event.data,
        type: 'text'
      })
      scrollToBottom()
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

onMounted(() => {
  initWebSocket()
  loadFriends()
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}
.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

</style>