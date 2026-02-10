<template>
  <div class="min-h-screen bg-[#020617] text-slate-300 font-sans pb-20 relative selection:bg-rose-500/30">

    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full"></div>

    <header class="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
      <div class="flex justify-between items-center mb-3">
        <div>
          <h1 class="text-xl font-black italic tracking-tighter text-white">
            <span class="text-rose-500">BIO</span>_HAZARD
          </h1>
          <p class="text-[10px] text-slate-500 font-mono">IBD 生存情报数据库</p>
        </div>
        <div class="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          <i class="ri-medal-fill text-amber-400 text-xs"></i>
          <span class="text-xs font-bold">贡献: 32</span>
        </div>
      </div>

      <div class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-lg opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
        <div class="relative flex items-center bg-[#0a0f1c] rounded-lg">
          <i class="ri-search-2-line absolute left-3 text-slate-500"></i>
          <input
              type="text"
              placeholder="搜索食物 / 药品 / 医院..."
              class="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-white focus:outline-none placeholder:text-slate-600"
          >
          <button class="absolute right-2 p-1.5 text-slate-400 hover:text-white">
            <i class="ri-camera-lens-line"></i>
          </button>
        </div>
      </div>

      <div class="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
        <button class="shrink-0 px-3 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">🔥 高危预警</button>
        <button class="shrink-0 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">🛡️ 安全区</button>
        <button class="shrink-0 px-3 py-1 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700">🍔 快餐</button>
        <button class="shrink-0 px-3 py-1 rounded-md bg-slate-800 text-slate-400 text-xs border border-slate-700">🏥 医院</button>
      </div>
    </header>

    <main class="p-4 space-y-4">

      <div class="flex justify-between items-end">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="ri-radar-fill text-indigo-500 animate-pulse"></i>
          实时情报流
        </h2>
        <span class="text-[10px] text-slate-500">基于 12,403 条真实肉测</span>
      </div>

      <div class="bg-slate-900/50 border border-rose-500/20 rounded-xl overflow-hidden relative group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-rose-600/10 blur-[40px] rounded-full pointer-events-none"></div>

        <div class="flex p-3 gap-3">
          <div class="w-20 h-20 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80" class="w-full h-full object-cover opacity-80" alt="KFC">
            <div class="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[9px] font-black text-center py-0.5 uppercase tracking-wider">
              Danger
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h3 class="text-base font-bold text-slate-100 truncate">香辣鸡翅 (KFC)</h3>
              <div class="flex flex-col items-end">
                <span class="text-xl font-black text-rose-500 leading-none">12%</span>
                <span class="text-[9px] text-rose-500/60 uppercase font-bold">Safe Rate</span>
              </div>
            </div>

            <p class="text-xs text-slate-400 mt-1 line-clamp-2">
              <span class="text-rose-400 font-bold">⚠ 警告：</span> 油炸+辣=双重暴击。目前已有 58 人反馈食用后腹痛/腹泻。
            </p>

            <div class="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
              <span class="flex items-center gap-1"><i class="ri-skull-fill text-rose-500"></i> 58 翻车</span>
              <span class="flex items-center gap-1"><i class="ri-shield-check-fill text-slate-600"></i> 8 幸存</span>
            </div>
          </div>
        </div>

        <div class="bg-rose-950/20 px-3 py-2 flex justify-between items-center border-t border-rose-500/10">
          <span class="text-[10px] text-rose-300">"昨晚吃了一对，直接急诊..."</span>
          <button class="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1 rounded-full shadow-lg shadow-rose-900/50">
            提交战损
          </button>
        </div>
      </div>

      <div class="bg-slate-900/50 border border-emerald-500/20 rounded-xl overflow-hidden relative group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 blur-[40px] rounded-full pointer-events-none"></div>

        <div class="flex p-3 gap-3">
          <div class="w-20 h-20 rounded-lg bg-slate-800 shrink-0 overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&q=80" class="w-full h-full object-cover opacity-80" alt="Noodle">
            <div class="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-black text-center py-0.5 uppercase tracking-wider">
              Safe
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h3 class="text-base font-bold text-slate-100 truncate">阳春面 / 清汤面</h3>
              <div class="flex flex-col items-end">
                <span class="text-xl font-black text-emerald-400 leading-none">96%</span>
                <span class="text-[9px] text-emerald-500/60 uppercase font-bold">Safe Rate</span>
              </div>
            </div>

            <p class="text-xs text-slate-400 mt-1 line-clamp-2">
              <span class="text-emerald-400 font-bold">✅ 推荐：</span> 易消化，低纤维。适合缓解期及轻度活动期食用。
            </p>

            <div class="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
              <span class="flex items-center gap-1"><i class="ri-thumb-up-fill text-emerald-500"></i> 1,204 推荐</span>
              <span class="flex items-center gap-1"><i class="ri-alert-fill text-slate-600"></i> 12 不适</span>
            </div>
          </div>
        </div>

        <div class="bg-emerald-950/20 px-3 py-2 flex justify-between items-center border-t border-emerald-500/10">
          <span class="text-[10px] text-emerald-300">"好吃又健康，吃了很开心666"</span>
          <button class="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-full shadow-lg shadow-emerald-900/50">
            验证安全
          </button>
        </div>
      </div>

      <div class="bg-slate-900/50 border border-indigo-500/20 rounded-xl overflow-hidden relative group">
        <div class="flex p-3 gap-3">
          <div class="w-20 h-20 rounded-lg bg-indigo-900/20 shrink-0 flex items-center justify-center border border-indigo-500/30">
            <i class="ri-hospital-line text-3xl text-indigo-400"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h3 class="text-base font-bold text-slate-100 truncate">内江市第一人民医院</h3>
              <div class="flex flex-col items-end">
                <span class="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">消化科</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-2">
              <div class="bg-slate-800/50 rounded p-1.5">
                <p class="text-[9px] text-slate-500">生物制剂</p>
                <p class="text-xs font-bold text-slate-200">✅ 极好开</p>
              </div>
              <div class="bg-slate-800/50 rounded p-1.5">
                <p class="text-[9px] text-slate-500">厕所环境</p>
                <p class="text-xs font-bold text-slate-200">⚠️ 蹲坑多</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-indigo-950/20 px-3 py-2 flex justify-between items-center border-t border-indigo-500/10">
          <span class="text-[10px] text-indigo-300">"张主任周二坐诊，人很稳..."</span>
          <button class="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-full shadow-lg">
            添加情报
          </button>
        </div>
      </div>

    </main>

    <div class="fixed bottom-6 right-6 z-50">
      <button class="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/20">
        <i class="ri-add-line text-2xl font-bold"></i>
      </button>
      <span class="absolute -top-8 right-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap animate-bounce">
        发现新目标？
      </span>
    </div>

  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

/* 隐藏横向滚动条 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>