<template>
  <div class="min-h-screen bg-[#09090b] text-slate-200 font-sans pb-24 relative selection:bg-indigo-500/30">



    <main class="pt-20 px-4 space-y-8">

      <article class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center bg-indigo-600 text-xs font-bold">轩</div>
          </div>
          <div>
            <p class="text-sm font-bold text-slate-200">Architect-Xuan</p>
            <p class="text-[10px] text-slate-500">刚刚 · 内江</p>
          </div>
          <button class="ml-auto text-slate-600 hover:text-slate-400">
            <i class="ri-more-fill"></i>
          </button>
        </div>

        <div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gym">

          <div class="absolute top-3 right-3 flex flex-col gap-2">
            <div class="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg flex items-center justify-center w-8 h-8 shadow-lg" title="饮食：清淡">
              <i class="ri-leaf-fill text-emerald-400 text-sm"></i>
            </div>
            <div class="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg flex items-center justify-center w-8 h-8 shadow-lg" title="运动：有动">
              <i class="ri-fire-fill text-orange-400 text-sm"></i>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm text-slate-300 leading-relaxed">
            恢复训练第3天。虽然重量不大，但是流汗的感觉真好。这才是活着的感觉。💪
          </p>
          <div class="flex gap-2 mt-3">
            <span class="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400">#自律</span>
            <span class="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400">#行者</span>
          </div>
        </div>
      </article>

      <div class="h-[1px] bg-slate-800 w-full"></div>

      <article class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center bg-indigo-600 text-xs font-bold">轩</div>
          </div>
          <div>
            <p class="text-sm font-bold text-slate-200">Architect-Xuan</p>
            <p class="text-[10px] text-slate-500">昨天 18:30</p>
          </div>
        </div>

        <div class="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" class="w-full h-full object-cover" alt="Food">

          <div class="absolute top-3 right-3 flex flex-col gap-2">
            <div class="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg flex items-center justify-center w-8 h-8 shadow-lg">
              <i class="ri-goblet-fill text-purple-400 text-sm"></i>
            </div>
            <div class="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg flex items-center justify-center w-8 h-8 shadow-lg">
              <i class="ri-zzz-fill text-slate-400 text-sm"></i>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm text-slate-300 leading-relaxed">
            今天做了一份低油版的沙拉，味道意外的还不错。
          </p>
        </div>
      </article>

    </main>

    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <button class="flex items-center gap-2 pl-4 pr-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-95 transition-all group">
        <i class="ri-add-line text-xl font-bold group-hover:rotate-90 transition-transform"></i>
        <span class="text-sm font-bold tracking-wide">记录此刻</span>
      </button>
    </div>

  </div>
</template>

<style>
/* 图标库 */
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

/* 全局滚动条优化 */
body::-webkit-scrollbar {
  width: 4px;
}
body::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
</style>