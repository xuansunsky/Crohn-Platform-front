<template>
  <div class="status-board pb-10">

    <!-- 全局轻提示 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="toast" class="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white text-[13px] font-black px-5 py-2.5 rounded-full shadow-xl pop-in">
          {{ toast }}
        </div>
      </transition>
    </Teleport>

    <!-- 我的状态 -->
    <div class="px-5 pt-3">
      <div class="relative overflow-hidden rounded-[28px] p-5 bg-gradient-to-br shadow-lg" :class="[accent(myStatus.accent).grad, accent(myStatus.accent).glow]">
        <div class="absolute -top-10 -right-8 w-36 h-36 bg-white/20 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-12 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-black tracking-[0.18em] text-white/80">我的状态</span>
            <button @click="showPayQrSetup = true" class="text-[10px] font-bold text-white/80 bg-black/15 px-2.5 py-1 rounded-full active:scale-95 transition-all flex items-center gap-1">
              <i class="ri-qr-code-line"></i> 我的收款码
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-[60px] h-[60px] rounded-3xl bg-white/25 backdrop-blur-md flex items-center justify-center text-[34px] shrink-0 shadow-inner">
              {{ myStatus.text ? myStatus.emoji : '🌫️' }}
            </div>
            <div class="flex-1 min-w-0">
              <template v-if="myStatus.text">
                <h2 class="text-white text-[22px] font-black tracking-tight leading-tight truncate">{{ myStatus.text }}</h2>
                <p class="text-white/85 text-[12px] font-medium mt-0.5 leading-snug line-clamp-2">{{ myStatus.desc }}</p>
              </template>
              <template v-else>
                <h2 class="text-white text-[18px] font-black tracking-tight leading-tight">还没设置状态</h2>
                <p class="text-white/80 text-[12px] font-medium mt-0.5 leading-snug">点下面，让战友看见此刻的你</p>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <button @click="showPicker = true" class="flex-1 py-2.5 rounded-2xl bg-white/90 text-slate-800 text-[13px] font-black active:scale-95 transition-all shadow-sm">
              <i class="ri-edit-2-line"></i> {{ myStatus.text ? '换个状态' : '设置状态' }}
            </button>
            <div class="px-3.5 py-2.5 rounded-2xl bg-black/15 text-white text-[12px] font-black flex items-center gap-1.5">
              <i class="ri-hand-heart-fill"></i> {{ myStatus.received || 0 }} 份关心
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 三档统计 -->
    <div class="px-5 pt-4">
      <div class="flex items-center gap-2.5">
        <div v-for="(meta, z) in ZONE_META" :key="z" class="flex-1 bg-white border border-slate-100 rounded-2xl py-2.5 px-3 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.08)]">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" :class="meta.dot"></span>
            <span class="text-[18px] font-black text-slate-800 leading-none">{{ zoneCounts[z] }}</span>
          </div>
          <p class="text-[10px] font-bold text-slate-400 mt-1">{{ meta.label }}</p>
        </div>
      </div>
    </div>

    <!-- 插槽：拉响警报这一排下面（痛痛共鸣舱等） -->
    <slot name="after-stats" />

    <!-- 上传病例软提示（不挡状态墙，未上传时温柔推荐） -->
    <div v-if="!isVerified" class="px-5 pt-4">
      <button @click="showVerify = true"
              class="w-full text-left relative overflow-hidden rounded-[22px] px-4 py-3.5 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg active:scale-[0.99] transition-all">
        <div class="absolute -top-6 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <i class="ri-shield-check-fill text-blue-400 text-[20px]"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-[13.5px] font-black">上传病例，点亮「战友」</p>
            <p class="text-white/60 text-[11px] font-medium mt-0.5 leading-snug">确诊单/肠镜/药单都行，可涂黑姓名医院。解锁后能看战友资料与你们的往来。</p>
          </div>
          <i class="ri-arrow-right-s-line text-white/50 text-xl shrink-0"></i>
        </div>
      </button>
    </div>

    <!-- 战友状态墙（对所有人可见） -->
    <div class="px-5 pt-5">
      <h3 class="text-[13px] font-black text-slate-500 tracking-wide mb-3 flex items-center gap-1.5">
        <i class="ri-radar-line text-blue-500"></i> 战友状态墙 · {{ members.length }} 人
      </h3>

      <p v-if="loading" class="text-center text-[13px] text-slate-400 font-bold py-10">加载战友状态中…</p>
      <div v-else-if="members.length === 0" class="text-center py-12">
        <div class="text-[40px] mb-2">🛰️</div>
        <p class="text-[13px] font-black text-slate-600">还没有战友挂状态</p>
        <p class="text-[11px] text-slate-400 font-medium mt-1">去联络人加好友，状态墙就热闹了</p>
      </div>

      <div v-else class="space-y-2.5">
        <div v-for="m in members" :key="m.userId" @click="openProfile(m)" class="bg-white border border-slate-100 rounded-[22px] p-3.5 flex items-center gap-3 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] pop-in cursor-pointer active:scale-[0.99] transition-transform">
          <div class="relative shrink-0">
            <img :src="avatarOf(m)" class="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-white shadow-sm">
            <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[13px] border-2 border-white shadow-sm" :class="accent(m.accent).soft">{{ m.text ? (m.emoji || '🙂') : '🌫️' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-[14px] font-black text-slate-800 truncate">{{ m.nickname }}</span>
              <span v-if="m.verified" class="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                <i class="ri-verified-badge-fill"></i> 战友
              </span>
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="accent(m.accent).dot"></span>
            </div>
            <p v-if="m.text" class="text-[12.5px] font-bold mt-0.5 truncate" :class="accent(m.accent).text">{{ m.emoji }} {{ m.text }}</p>
            <p v-else class="text-[12.5px] font-bold mt-0.5 text-slate-300">未设置状态</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <p class="text-[10px] font-medium text-slate-300">{{ m.updatedAt ? relTime(m.updatedAt) : '—' }}</p>
              <template v-if="m.reactions > 0">
                <span class="text-slate-200">·</span>
                <div class="flex -space-x-1.5">
                  <img v-for="(r, i) in (m.reactors || []).slice(0, 3)" :key="i" :src="r.avatar || avatarOf({ nickname: r.nickname, userId: i })"
                       :title="r.nickname" class="w-4 h-4 rounded-full object-cover border border-white bg-slate-100">
                </div>
                <p class="text-[10px] font-bold text-rose-400 truncate">
                  <i class="ri-hand-heart-fill"></i>
                  <span v-if="m.reactors && m.reactors.length">{{ m.reactors[0].nickname }} 等 {{ m.reactions }} 人关心</span>
                  <span v-else>{{ m.reactions }} 份关心</span>
                </p>
              </template>
            </div>
          </div>
          <button @click.stop="openReact(m)" :disabled="m.reactedToday"
                  class="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
                  :class="m.reactedToday ? 'bg-slate-100 text-slate-300' : [accent(m.accent).soft, accent(m.accent).text, 'active:scale-90']">
            <i :class="m.reactedToday ? 'ri-check-double-line' : 'ri-hand-heart-line'" class="text-[20px]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 状态选择面板 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showPicker" class="fixed inset-0 z-[1900] flex flex-col justify-end">
          <div @click="showPicker = false" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div class="sheet-panel relative bg-[#FBF9F5] rounded-t-[32px] max-h-[86vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div class="shrink-0 pt-3 pb-2"><div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div></div>
            <div class="shrink-0 px-5 pb-3 flex items-center justify-between">
              <h2 class="text-[19px] font-black text-slate-900 tracking-tight">你现在啥状态？</h2>
              <button @click="showPicker = false" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line text-lg"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 space-y-5">
              <div v-for="grp in STATUS_LIBRARY" :key="grp.zone">
                <div class="flex items-center gap-1.5 mb-2.5">
                  <span class="w-2 h-2 rounded-full" :class="ZONE_META[grp.zone].dot"></span>
                  <h3 class="text-[12px] font-black tracking-wide" :class="ZONE_META[grp.zone].text">{{ ZONE_META[grp.zone].label }}</h3>
                </div>
                <div class="grid grid-cols-2 gap-2.5">
                  <button v-for="item in grp.items" :key="item.key" @click="pickStatus(grp.zone, item)"
                          class="text-left bg-white border rounded-2xl p-3 active:scale-95 transition-all shadow-[0_3px_12px_-4px_rgba(15,23,42,0.08)]"
                          :class="myStatus.key === item.key ? 'border-slate-800 ring-1 ring-slate-800' : 'border-slate-100'">
                    <div class="flex items-center gap-2">
                      <span class="w-9 h-9 rounded-xl flex items-center justify-center text-[20px] shrink-0" :class="accent(item.accent).soft">{{ item.emoji }}</span>
                      <span class="text-[13.5px] font-black text-slate-800 leading-tight">{{ item.text }}</span>
                    </div>
                    <p class="text-[10.5px] text-slate-400 font-medium mt-1.5 leading-snug line-clamp-2">{{ item.desc }}</p>
                  </button>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-1.5 mb-2.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h3 class="text-[12px] font-black tracking-wide text-indigo-600">自己定一个</h3>
                </div>
                <div class="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-[0_3px_12px_-4px_rgba(15,23,42,0.08)]">
                  <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2.5">
                    <button v-for="e in emojiChoices" :key="e" @click="customEmoji = e"
                            class="w-9 h-9 rounded-xl flex items-center justify-center text-[19px] shrink-0 active:scale-90 transition-all"
                            :class="customEmoji === e ? 'bg-indigo-100 ring-1 ring-indigo-400' : 'bg-slate-50'">{{ e }}</button>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[20px] shrink-0">{{ customEmoji }}</span>
                    <input v-model="customText" @keydown.enter="saveCustom" type="text" maxlength="14" placeholder="此刻最想说的一句…" class="flex-1 min-w-0 bg-slate-50 rounded-xl px-3 py-2.5 text-[13px] font-bold outline-none border border-stone-200 focus:border-indigo-300">
                    <button @click="saveCustom" :disabled="!customText.trim()" class="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-black active:scale-95 transition-all disabled:bg-slate-200">挂上</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 战友资料卡 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showProfile" class="fixed inset-0 z-[1910] flex flex-col justify-end">
          <div @click="showProfile = false" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div class="sheet-panel relative bg-[#FBF9F5] rounded-t-[32px] max-h-[88vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div class="shrink-0 pt-3 pb-2"><div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div></div>

            <div v-if="profileTarget" class="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
              <!-- 头部 -->
              <div class="flex items-center gap-3.5">
                <img :src="avatarOf(profileTarget)" class="w-16 h-16 rounded-3xl object-cover bg-slate-100 border border-white shadow-sm">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <h2 class="text-[19px] font-black text-slate-900 truncate">{{ profileTarget.nickname }}</h2>
                    <span v-if="profileTarget.verified" class="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                      <i class="ri-verified-badge-fill"></i> 战友
                    </span>
                    <span v-else class="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      <i class="ri-user-line"></i> 未上传病例
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-400 font-medium mt-1">
                    {{ profileTarget.verified ? '已上传病例 · 认证战友' : 'TA 还没上传病例' }}
                  </p>
                </div>
              </div>

              <!-- 当前状态 -->
              <div class="mt-4 rounded-[22px] p-4 bg-gradient-to-br shadow-md" :class="[accent(profileTarget.accent).grad, accent(profileTarget.accent).glow]">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-[26px] shrink-0">{{ profileTarget.text ? (profileTarget.emoji || '🙂') : '🌫️' }}</div>
                  <div class="min-w-0">
                    <p class="text-white text-[16px] font-black truncate">{{ profileTarget.text || '还没设置状态' }}</p>
                    <p v-if="profileTarget.desc" class="text-white/85 text-[11.5px] font-medium leading-snug line-clamp-2">{{ profileTarget.desc }}</p>
                  </div>
                </div>
                <p class="text-white/70 text-[10px] font-medium mt-2">{{ profileTarget.updatedAt ? '更新于 ' + relTime(profileTarget.updatedAt) : '暂无状态' }} · 共收到 {{ profileTarget.reactions || 0 }} 份关心</p>
              </div>

              <!-- 你们的往来（需我已上传解锁） -->
              <div v-if="profileData && profileData.myUnlocked" class="mt-4">
                <h3 class="text-[12px] font-black text-slate-500 mb-2.5 flex items-center gap-1.5"><i class="ri-arrow-left-right-line text-rose-400"></i> 你们的往来</h3>
                <div class="grid grid-cols-2 gap-2.5">
                  <div class="bg-white border border-slate-100 rounded-2xl p-3.5 text-center shadow-[0_3px_12px_-4px_rgba(15,23,42,0.06)]">
                    <p class="text-[22px] font-black text-rose-500 leading-none">{{ profileData.iSent || 0 }}</p>
                    <p class="text-[10px] font-bold text-slate-400 mt-1.5">你送 TA 的关心</p>
                  </div>
                  <div class="bg-white border border-slate-100 rounded-2xl p-3.5 text-center shadow-[0_3px_12px_-4px_rgba(15,23,42,0.06)]">
                    <p class="text-[22px] font-black text-blue-500 leading-none">{{ profileData.theySent || 0 }}</p>
                    <p class="text-[10px] font-bold text-slate-400 mt-1.5">TA 送你的关心</p>
                  </div>
                </div>
                <p v-if="!(profileData.iSent || profileData.theySent)" class="text-center text-[11px] text-slate-400 font-medium mt-3">还没有往来，点下面给 TA 送上第一份温暖吧</p>
              </div>

              <!-- 未上传：引导上传解锁 -->
              <div v-else-if="profileData" class="mt-4 rounded-[22px] p-4 bg-slate-900 text-white relative overflow-hidden">
                <div class="absolute -top-6 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                <div class="relative">
                  <p class="text-[13.5px] font-black flex items-center gap-1.5"><i class="ri-lock-2-fill text-blue-400"></i> 想看你们的往来与更多资料？</p>
                  <p class="text-white/65 text-[11px] font-medium mt-1.5 leading-relaxed">上传你自己的病例（可涂黑姓名、医院），就能解锁战友资料、看到你们之间的关心往来。也让大家交流得更没距离。</p>
                  <button @click="showProfile = false; showVerify = true" class="mt-3 w-full py-2.5 rounded-2xl bg-white text-slate-900 text-[13px] font-black active:scale-95 transition-all">
                    <i class="ri-upload-cloud-2-line"></i> 上传病例，立即解锁
                  </button>
                </div>
              </div>

              <p v-if="profileLoading" class="text-center text-[11px] text-slate-300 font-bold mt-3">加载资料中…</p>

              <!-- 操作 -->
              <div class="grid grid-cols-2 gap-2.5 mt-5">
                <button @click="careFromProfile" :disabled="profileTarget.reactedToday"
                        class="py-3 rounded-2xl text-[13px] font-black active:scale-95 transition-all"
                        :class="profileTarget.reactedToday ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white'">
                  <i :class="profileTarget.reactedToday ? 'ri-check-double-line' : 'ri-hand-heart-fill'"></i>
                  {{ profileTarget.reactedToday ? '今天已送过' : '送上关心' }}
                </button>
                <button @click="transferFromProfile" class="py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-[13px] font-black active:scale-95 transition-all shadow-sm shadow-rose-500/20">
                  <i class="ri-hand-coin-fill"></i> 转款送温暖
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 回应面板 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showReact" class="fixed inset-0 z-[1900] flex flex-col justify-end">
          <div @click="showReact = false" class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div class="sheet-panel relative bg-white rounded-t-[32px] pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
            <div class="pt-3 pb-2"><div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div></div>
            <div class="px-5 pt-1 pb-4 flex items-center gap-3" v-if="reactTarget">
              <img :src="avatarOf(reactTarget)" class="w-11 h-11 rounded-2xl object-cover bg-slate-100">
              <div class="min-w-0">
                <p class="text-[15px] font-black text-slate-800 truncate">给 {{ reactTarget.nickname }} 一点回应</p>
                <p class="text-[12px] font-bold mt-0.5" :class="accent(reactTarget.accent).text">{{ reactTarget.emoji }} {{ reactTarget.text }}</p>
              </div>
            </div>
            <div class="px-5 grid grid-cols-2 gap-2.5" v-if="reactTarget">
              <button v-for="rk in ZONE_REACTIONS[reactTarget.zone] || ZONE_REACTIONS.green" :key="rk" @click="sendReaction(rk)"
                      class="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl px-3 py-3 active:scale-95 transition-all">
                <span class="text-[24px]">{{ REACTIONS[rk].emoji }}</span>
                <span class="text-[13px] font-black text-slate-700">{{ REACTIONS[rk].label }}</span>
              </button>
            </div>
            <div class="px-5 mt-3" v-if="reactTarget">
              <button @click="openTransfer" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-2xl px-3 py-3.5 active:scale-95 transition-all shadow-sm shadow-rose-500/20">
                <i class="ri-hand-coin-fill text-[19px]"></i> <span class="text-[14px] font-black">转款送温暖</span>
              </button>
            </div>
            <p class="text-center text-[11px] text-slate-400 font-medium mt-4">无声的看见，比一万句安慰都管用</p>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 扫码转账（微信收款码） -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showTransfer" class="fixed inset-0 z-[1950] flex items-center justify-center px-8">
          <div @click="showTransfer = false" class="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>
          <div class="relative w-full max-w-[320px] bg-white rounded-[28px] p-6 shadow-2xl pop-in">
            <button @click="showTransfer = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line text-lg"></i></button>
            <div class="flex flex-col items-center text-center" v-if="reactTarget">
              <img :src="avatarOf(reactTarget)" class="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm mb-2">
              <p class="text-[16px] font-black text-slate-900">转款给 {{ reactTarget.nickname }}</p>
              <p class="text-[11px] text-slate-400 font-medium mt-0.5 mb-4">用微信扫下面的码，直接打给 TA</p>

              <div v-if="payQrLoading" class="w-56 h-56 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 text-[13px] font-bold">读取收款码中…</div>
              <div v-else-if="payQrUrl" class="w-56 h-56 rounded-2xl bg-white border border-slate-100 shadow-inner p-2 flex items-center justify-center">
                <img :src="payQrUrl" class="w-full h-full object-contain rounded-xl">
              </div>
              <div v-else class="w-56 h-56 rounded-2xl bg-slate-50 flex flex-col items-center justify-center px-4">
                <div class="text-[34px] mb-2">🙈</div>
                <p class="text-[12px] font-bold text-slate-500">TA 还没上传收款码</p>
                <p class="text-[10px] text-slate-400 mt-1">提醒 TA 去「我的收款码」设置一下</p>
              </div>

              <div class="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <i class="ri-shield-check-line text-emerald-500"></i> 平台不经手任何资金，安全直达
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 设置我的收款码 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showPayQrSetup" class="fixed inset-0 z-[1950] flex items-center justify-center px-8">
          <div @click="showPayQrSetup = false" class="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>
          <div class="relative w-full max-w-[330px] bg-white rounded-[28px] p-6 shadow-2xl pop-in">
            <button @click="showPayQrSetup = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line text-lg"></i></button>
            <p class="text-[16px] font-black text-slate-900 text-center">我的微信收款码</p>
            <p class="text-[11px] text-slate-400 font-medium text-center mt-1 mb-4">战友扛不住时，可以直接扫码打钱给你</p>

            <label class="block w-44 h-44 mx-auto rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-2 flex items-center justify-center mb-4 cursor-pointer active:scale-95 transition-all overflow-hidden">
              <img v-if="myQrInput.trim()" :src="myQrInput" class="w-full h-full object-contain rounded-xl">
              <span v-else-if="qrUploading" class="text-[12px] text-slate-400 font-bold">上传中…</span>
              <span v-else class="text-[12px] text-slate-400 font-bold text-center px-3"><i class="ri-camera-line text-[24px] block mb-1"></i>点这里上传收款码</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadMyQr" :disabled="qrUploading">
            </label>

            <p class="text-[10px] text-slate-400 font-medium leading-snug mb-3 text-center">
              <i class="ri-shield-check-line text-emerald-500"></i> 只存这张图片，绝不保存银行卡号、身份证等任何隐私信息。
            </p>
            <button @click="saveMyQr" :disabled="!myQrInput.trim() || qrUploading" class="w-full bg-rose-500 text-white font-black text-[14px] py-3 rounded-2xl active:scale-95 transition-all disabled:bg-slate-200">保存收款码</button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- IBD 认证上传 -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="showVerify" class="fixed inset-0 z-[1960] flex items-center justify-center px-8">
          <div @click="showVerify = false" class="absolute inset-0 bg-slate-900/70 backdrop-blur-md"></div>
          <div class="relative w-full max-w-[340px] bg-white rounded-[28px] p-6 shadow-2xl pop-in">
            <button @click="showVerify = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90"><i class="ri-close-line text-lg"></i></button>
            <div class="flex items-center justify-center gap-1.5 mb-1">
              <i class="ri-shield-check-fill text-blue-500 text-[20px]"></i>
              <p class="text-[16px] font-black text-slate-900 text-center">战友身份认证</p>
            </div>
            <p class="text-[11px] text-slate-400 font-medium text-center leading-snug mb-4">
              上传确诊单 / 肠镜报告 / 药单照片，<br>可把姓名、医院等信息<span class="text-rose-500 font-bold">涂黑遮盖</span>再传
            </p>

            <label class="block w-full h-48 rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-2 flex items-center justify-center mb-4 cursor-pointer active:scale-95 transition-all overflow-hidden">
              <img v-if="proofUrl" :src="proofUrl" class="w-full h-full object-contain rounded-xl">
              <span v-else-if="proofUploading" class="text-[12px] text-slate-400 font-bold">上传中…</span>
              <span v-else class="text-[12px] text-slate-400 font-bold text-center px-3"><i class="ri-image-add-line text-[26px] block mb-1"></i>点这里上传证明图片</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadProof" :disabled="proofUploading">
            </label>

            <p class="text-[10px] text-slate-400 font-medium leading-snug mb-3 text-center">
              <i class="ri-lock-line text-blue-500"></i> 仅用于解锁战友权限，上传后立即点亮「战友」标识。
            </p>
            <button @click="submitVerify" :disabled="!proofUrl || proofUploading || verifySubmitting" class="w-full bg-blue-600 text-white font-black text-[14px] py-3 rounded-2xl active:scale-95 transition-all disabled:bg-slate-200">
              {{ verifySubmitting ? '上传中…' : '上传，立即解锁' }}
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/api/http'

const myId = Number(localStorage.getItem('userId')) || 0

// 主题色表（完整类名直写，保证 Tailwind JIT 能扫到）
const ACCENTS = {
  emerald: { soft: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', grad: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/30' },
  blue:    { soft: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-500',    grad: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-500/30' },
  teal:    { soft: 'bg-teal-50',    text: 'text-teal-600',    dot: 'bg-teal-500',    grad: 'from-teal-400 to-cyan-500',   glow: 'shadow-teal-500/30' },
  amber:   { soft: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-500',   grad: 'from-amber-400 to-orange-500',glow: 'shadow-amber-500/30' },
  violet:  { soft: 'bg-violet-50',  text: 'text-violet-600',  dot: 'bg-violet-500',  grad: 'from-violet-400 to-purple-500',glow:'shadow-violet-500/30' },
  indigo:  { soft: 'bg-indigo-50',  text: 'text-indigo-600',  dot: 'bg-indigo-500',  grad: 'from-indigo-400 to-blue-500',  glow:'shadow-indigo-500/30' },
  slate:   { soft: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400',   grad: 'from-slate-400 to-slate-500',  glow:'shadow-slate-500/20' },
  orange:  { soft: 'bg-orange-50',  text: 'text-orange-600',  dot: 'bg-orange-500',  grad: 'from-orange-400 to-red-500',   glow:'shadow-orange-500/30' },
  rose:    { soft: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500',    grad: 'from-rose-400 to-pink-500',    glow:'shadow-rose-500/30' },
  red:     { soft: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500',     grad: 'from-red-400 to-rose-500',     glow:'shadow-red-500/30' },
  cyan:    { soft: 'bg-cyan-50',    text: 'text-cyan-600',    dot: 'bg-cyan-500',    grad: 'from-cyan-400 to-blue-500',    glow:'shadow-cyan-500/30' },
}
const accent = (k) => ACCENTS[k] || ACCENTS.slate

const ZONE_META = {
  green:  { label: '防线在线', dot: 'bg-emerald-500', text: 'text-emerald-600' },
  yellow: { label: '我有点难', dot: 'bg-amber-500',   text: 'text-amber-600' },
  red:    { label: '拉响警报', dot: 'bg-rose-500',    text: 'text-rose-600' },
}

const REACTIONS = {
  handshake: { emoji: '🤝', label: '隔空握手' },
  hold:      { emoji: '✊', label: '稳住兄弟' },
  hug:       { emoji: '🤗', label: '抱抱' },
  powder:    { emoji: '🥣', label: '催喝营养粉' },
  warmbag:   { emoji: '🔥', label: '催敷热水袋' },
  punch:     { emoji: '👊', label: '锤一拳' },
  luck:      { emoji: '🍀', label: '接好运' },
  seen:      { emoji: '👀', label: '我看到了' },
  strong:    { emoji: '💪', label: '挺住' },
}
const ZONE_REACTIONS = {
  green:  ['punch', 'luck', 'seen'],
  yellow: ['handshake', 'hold', 'hug'],
  red:    ['powder', 'warmbag', 'strong', 'hug'],
}

// 预设状态库
const STATUS_LIBRARY = [
  { zone: 'green', items: [
    { key: 'steady', emoji: '🛡️', text: '稳如老狗', desc: '饮食干净，防线焊死，满血游龙', accent: 'emerald' },
    { key: 'coding', emoji: '💻', text: '带病游龙', desc: '边扛病边搬砖，照样干', accent: 'blue' },
    { key: 'zen',    emoji: '🧘', text: '佛系修仙', desc: '心态稳了，接受一切', accent: 'teal' },
    { key: 'lucky',  emoji: '🎉', text: '今日小确幸', desc: '有件开心事想分享', accent: 'amber' },
  ]},
  { zone: 'yellow', items: [
    { key: 'lonely',  emoji: '🌾', text: '一个人扛着', desc: '看着别人吃，孤独到憋内伤', accent: 'violet' },
    { key: 'emo',     emoji: '😔', text: 'emo了',     desc: '情绪低谷，啥也不想干', accent: 'indigo' },
    { key: 'tired',   emoji: '😵', text: '累成废铁',   desc: '乏力虚脱，电量只剩 1%', accent: 'slate' },
    { key: 'craving', emoji: '🍢', text: '正在抗诱惑', desc: '烧烤味飘过来了，命悬一线', accent: 'orange' },
  ]},
  { zone: 'red', items: [
    { key: 'broke',    emoji: '💥', text: '防线破产',  desc: '没管住嘴，肉体要亮红灯了', accent: 'rose' },
    { key: 'pain',     emoji: '🔥', text: '肚子造反',  desc: '腹痛绞痛，正蜷成一团', accent: 'red' },
    { key: 'toilet',   emoji: '🚽', text: '厕所战神',  desc: '一天 N 趟，马桶常驻民', accent: 'amber' },
    { key: 'hospital', emoji: '🏥', text: '住院打卡',  desc: '在医院呢，挂着水', accent: 'cyan' },
    { key: 'alarm',    emoji: '🌡️', text: '指标报警',  desc: '复查数值不好看', accent: 'rose' },
  ]},
]
const emojiChoices = ['✏️', '🌈', '☕', '🌧️', '⚡', '🌙', '🐢', '🔋', '🎧', '❤️', '😭', '💪']

// 空白态：用户 24h 内没设置状态时留白，不显示任何默认状态
const myStatus = ref({ key: null, emoji: '', text: '', desc: '', accent: 'slate', zone: null, updatedAt: null, received: 0 })
const members = ref([])
const loading = ref(true)

const showPicker = ref(false)
const showReact = ref(false)
const reactTarget = ref(null)
const customText = ref('')
const customEmoji = ref('✏️')
const toast = ref('')

const showTransfer = ref(false)
const payQrUrl = ref('')
const payQrLoading = ref(false)

const showPayQrSetup = ref(false)
const myQrInput = ref('')
const qrUploading = ref(false)

// IBD 认证门槛
const myVerifyStatus = ref('NONE') // NONE / PENDING / APPROVED / REJECTED
const isVerified = computed(() => myVerifyStatus.value === 'APPROVED')
const showVerify = ref(false)
const proofUrl = ref('')
const proofUploading = ref(false)
const verifySubmitting = ref(false)

// 战友资料卡
const showProfile = ref(false)
const profileTarget = ref(null)
const profileData = ref(null)
const profileLoading = ref(false)

const zoneCounts = computed(() => {
  const c = { green: 0, yellow: 0, red: 0 }
  members.value.forEach(m => { if (m.zone) c[m.zone] = (c[m.zone] || 0) + 1 })
  if (myStatus.value.zone) c[myStatus.value.zone]++
  return c
})

const avatarOf = (m) => m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (m.nickname || m.userId)

const relTime = (t) => {
  const ts = typeof t === 'number' ? t : new Date(t).getTime()
  if (!ts || isNaN(ts)) return ''
  const d = Date.now() - ts
  if (d < 60000) return '刚刚'
  if (d < 3600000) return Math.floor(d / 60000) + ' 分钟前'
  if (d < 86400000) return Math.floor(d / 3600000) + ' 小时前'
  return Math.floor(d / 86400000) + ' 天前'
}

const flash = (msg) => { toast.value = msg; setTimeout(() => { toast.value = '' }, 1600) }

const ok = (res) => res && (res.status === 200 || res.code === 200)

// 把后端行映射成前端结构（无有效状态/已过期 → 留白，不再回落默认）
const mapRow = (r) => {
  const hasStatus = !!(r && r.text)
  const base = hasStatus
    ? { emoji: r.emoji || '🙂', text: r.text, desc: r.description || '', accent: r.accent || 'slate', zone: r.zone || 'green', updatedAt: r.updatedAt }
    : { emoji: '', text: '', desc: '', accent: 'slate', zone: null, updatedAt: null }
  return {
    userId: Number(r.userId),
    nickname: r.userId === myId ? '我' : (r.nickname || '神秘队员'),
    avatar: r.avatar,
    ...base,
    reactions: r.reactions || 0,
    reactedToday: !!r.reactedToday,
    verified: !!r.verified,
    reactors: r.reactors || [],
  }
}

const loadFeed = async () => {
  loading.value = true
  try {
    const res = await http.get('/team/status/list')
    if (ok(res) && res.data) {
      myVerifyStatus.value = res.data.myVerifyStatus || 'NONE'
      if (res.data.me) {
        const me = mapRow(res.data.me)
        myStatus.value = { ...me, received: me.reactions, key: me.text ? 'live' : null }
      }
      members.value = (res.data.members || []).map(mapRow)
    }
  } catch (e) {
    console.error('加载状态墙失败', e)
  } finally {
    loading.value = false
  }
}

const pushStatus = async (payload) => {
  try {
    const res = await http.post('/team/status/set', payload)
    if (ok(res)) { flash('状态已更新 ✦'); loadFeed() }
    else flash(res.message || '更新失败')
  } catch (e) {
    flash('更新失败，检查网络')
  }
}

const pickStatus = (zone, item) => {
  myStatus.value = { ...item, zone, updatedAt: Date.now(), received: myStatus.value.received }
  showPicker.value = false
  pushStatus({ emoji: item.emoji, text: item.text, description: item.desc, accent: item.accent, zone })
}

const saveCustom = () => {
  const t = customText.value.trim()
  if (!t) return
  const payload = { emoji: customEmoji.value || '✏️', text: t, description: '自定义状态', accent: 'indigo', zone: 'yellow' }
  myStatus.value = { key: 'custom', ...payload, desc: payload.description, updatedAt: Date.now(), received: myStatus.value.received }
  customText.value = ''
  showPicker.value = false
  pushStatus(payload)
}

const openProfile = async (m) => {
  profileTarget.value = m
  profileData.value = null
  showProfile.value = true
  profileLoading.value = true
  try {
    const res = await http.get(`/team/status/profile/${m.userId}`)
    if (ok(res) && res.data) {
      profileData.value = res.data
      if (res.data.user) {
        const mapped = mapRow(res.data.user)
        const idx = members.value.findIndex(x => x.userId === mapped.userId)
        if (idx > -1) mapped.reactedToday = members.value[idx].reactedToday || mapped.reactedToday
        profileTarget.value = mapped
      }
    }
  } catch (e) {
    console.error('读取战友资料失败', e)
  } finally {
    profileLoading.value = false
  }
}

const careFromProfile = () => {
  if (!profileTarget.value) return
  reactTarget.value = profileTarget.value
  showProfile.value = false
  showReact.value = true
}

const transferFromProfile = () => {
  if (!profileTarget.value) return
  reactTarget.value = profileTarget.value
  showProfile.value = false
  openTransfer()
}

const openReact = (m) => { reactTarget.value = m; showReact.value = true }

const sendReaction = async (key) => {
  if (!reactTarget.value) return
  const target = reactTarget.value
  if (target.reactedToday) { flash('今天已经给 TA 送过关心啦 🌙'); return }
  showReact.value = false
  try {
    const res = await http.post('/team/status/react', { targetUserId: target.userId, reactionType: key })
    if (ok(res)) {
      const m = members.value.find(x => x.userId === target.userId)
      if (m) { m.reactions = (m.reactions || 0) + 1; m.reactedToday = true }
      flash(`已给 ${target.nickname} 送上「${REACTIONS[key].label}」`)
      loadFeed()
    } else {
      flash(res.message || '今天已送过啦 🌙')
    }
  } catch (e) {
    const msg = e && e.response && e.response.data && e.response.data.message
    flash(msg || '今天已经送过关心啦 🌙')
  }
}

const openTransfer = async () => {
  if (!reactTarget.value) return
  showReact.value = false
  showTransfer.value = true
  payQrUrl.value = ''
  payQrLoading.value = true
  try {
    const res = await http.get(`/team/status/paycode/${reactTarget.value.userId}`)
    if (ok(res)) payQrUrl.value = res.data || ''
  } catch (e) {
    console.error('读取收款码失败', e)
  } finally {
    payQrLoading.value = false
  }
}

const uploadMyQr = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  qrUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await http.post('/upload', fd)
    if (ok(res)) myQrInput.value = res.data
    else flash(res.message || '上传失败')
  } catch (err) {
    flash('上传失败，检查网络')
  } finally {
    qrUploading.value = false
    e.target.value = ''
  }
}

const saveMyQr = async () => {
  const url = myQrInput.value.trim()
  if (!url) return
  try {
    const res = await http.post('/team/status/paycode', { url })
    if (ok(res)) { flash('收款码已保存 ✦'); showPayQrSetup.value = false }
    else flash(res.message || '保存失败')
  } catch (e) {
    flash('保存失败，检查网络')
  }
}

const uploadProof = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  proofUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await http.post('/upload', fd)
    if (ok(res)) proofUrl.value = res.data
    else flash(res.message || '上传失败')
  } catch (err) {
    flash('上传失败，检查网络')
  } finally {
    proofUploading.value = false
    e.target.value = ''
  }
}

const submitVerify = async () => {
  if (!proofUrl.value) { flash('请先上传证明图片'); return }
  verifySubmitting.value = true
  try {
    const res = await http.post('/verify/submit', { proofImageUrl: proofUrl.value })
    if (ok(res)) {
      myVerifyStatus.value = 'APPROVED'
      flash('上传成功，战友权限已解锁 🛡️')
      showVerify.value = false
      loadFeed()
    } else flash(res.message || '提交失败')
  } catch (e) {
    flash('提交失败，检查网络')
  } finally {
    verifySubmitting.value = false
  }
}

onMounted(() => {
  loadFeed()
  // 预填我已有的收款码
  http.get(`/team/status/paycode/${myId}`).then(res => {
    if (ok(res) && res.data) myQrInput.value = res.data
  }).catch(() => {})
  // 拉取我的认证状态
  http.get('/verify/me').then(res => {
    if (ok(res) && res.data) myVerifyStatus.value = res.data.status || 'NONE'
  }).catch(() => {})
})
</script>

<style scoped>
.status-board { animation: sb-in 0.4s ease; }
@keyframes sb-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 60% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
.pop-in { animation: pop-in 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
.sheet-enter-active, .sheet-leave-active { transition: all 0.28s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }
.sheet-panel { transition: transform 0.3s cubic-bezier(0.32,0.72,0,1); }
</style>
